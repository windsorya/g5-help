#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""設計 D・B2：用詞閘與句長閘的主閘——真瀏覽器（Chromium＋WebKit iPad）採集孩子實際看得到的字（tests/kidgate.js）。

做法：只載入本 repo 的 index.html（以 https://g5help.test/ 路由提供），照孩子會走的入口實際操作（開始學、直接練習、重開續練、
每一個答錯分支、提示兩級、第三次錯答、影片區），每做一個動作就採一次字、交給 KidGate.evaluate()。
  ・正式內容：每個入口、每個分支都不得有違規（用詞、句長、未歸類的可見文字）；分支有沒有真的走到也要記（案例完整性由 tests/kidtext.js 對照）。
  ・自檢 B01–B19：把內容改壞（hard.js 資料用 G5Hard setter 改、app.html／frac.js 文案用回應內容替換），斷言閘門抓得到；正例斷言不誤判。
  ・U01：交付頁的「家長傳題目」進度，固定時鐘 15:00／15:01、lastFetch＝0／null／undefined，都只說「已送出，等電腦取回」。
結果寫進 tests/kidtext_harvest.json（記 index.html、kidgate.js、本檔的 sha256；node 的 hard.test／standard.test 讀它，過期即紅）。
跑法：python3.12 tests/e2e_kidtext.py [--only chromium|webkit] [--parallel]
  --parallel：Chromium、WebKit 各開一個行程同時跑（寫檔時上鎖、只換自己那一格），最後統一判定一次——
  2026-10-15 #2259 復盤：兩個瀏覽器排隊跑一次 4.7–7.4 分鐘，是孩子等解說時最長的一段。
"""
import fcntl
import hashlib
import json
import time
import subprocess
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from e2e import FIXED, answers  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = "https://g5help.test/"
EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec"
OUT = ROOT / "tests" / "kidtext_harvest.json"
TZ = timezone(timedelta(hours=8))
SELF_MAX = 40   # cap-why: 設計 D B19「小五 40 字上限固定為測試條件」＝src/hard.js READING[5].maxSentence；自檢邊界不跟執行日期漂移
LOG = []


def say(msg):
    LOG.append(msg)
    print(msg)


BRANCH_JS = r"""(function(){
  var rec = window.__branches = [];
  Object.defineProperty(window, 'G5Frac', {configurable: true, get: function(){ return undefined; }, set: function(F){
    function inv(r){ return r.code === 'invalid' ? (/分母不能/.test(r.msg) ? '-d0' : /分子是 0/.test(r.msg) ? '-n0' : '-other') : ''; }
    ['checkReduce', 'checkCommon'].forEach(function(k){ var f = F[k]; F[k] = function(){ var r = f.apply(this, arguments); rec.push(k + ':' + r.code + inv(r)); return r; }; });
    var pd = F.pickDivisor; F.pickDivisor = function(f, k){ var r = pd.apply(this, arguments); rec.push('pickDivisor:' + (k === 'none' ? (r.ok ? 'none-ok' : 'none-wrong') : (r.ok ? 'ok' : 'bad'))); return r; };
    var cs = F.checkSign; F.checkSign = function(a, b){ var r = cs.apply(this, arguments); rec.push('checkSign:' + (r.ok ? 'ok' : 'wrong') + '-' + (F.cmp(a, b) === '=' ? 'eq' : 'neq')); return r; };
    Object.defineProperty(window, 'G5Frac', {value: F, writable: true, configurable: true, enumerable: true});
  }});
})();"""

MUTATE_JS = r"""(function(){
  var mut = function(H){ %s };
  Object.defineProperty(window, 'G5Hard', {configurable: true, get: function(){ return undefined; }, set: function(H){
    try { mut(H); } catch (e) { window.__mutErr = String(e); }
    Object.defineProperty(window, 'G5Hard', {value: H, writable: true, configurable: true, enumerable: true});
  }});
})();"""


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


class Run:
    """一個瀏覽器 context＝一個乾淨的裝置。subs：對 index.html 的文字替換（改 app.html／frac.js 文案）；mutate：改 G5Hard 資料的 JS。"""

    def __init__(self, br, device, case, subs=(), mutate=None, fixture=None, limit=None):
        self.br, self.case, self.limit = br, case, limit
        self.viol, self.branches, self.errors, self.snaps = [], set(), [], 0
        self.ctx = br.browser.new_context(**device)
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        for old, new in subs:
            assert old in html, f"{case}：替換錨點不在 index.html：{old[:40]}"
            html = html.replace(old, new)
        self.html = html

        def serve(route):
            name = route.request.url[len(ORIGIN):].split("#")[0].split("?")[0] or "index.html"
            if name == "index.html":
                return route.fulfill(status=200, body=self.html, content_type="text/html; charset=utf-8")
            p = ROOT / name
            if "/" in name or not p.is_file():
                return route.fulfill(status=404, body="")
            route.fulfill(status=200, body=p.read_text(encoding="utf-8"), content_type="application/javascript; charset=utf-8")
        self.ctx.route(ORIGIN + "**", serve)
        self.ctx.route(lambda u: u.startswith(EP), lambda r: r.abort())   # 不打真後端
        self.ctx.add_init_script(path=str(ROOT / "tests" / "kidgate.js"))
        self.ctx.add_init_script(BRANCH_JS)
        if mutate:
            self.ctx.add_init_script(MUTATE_JS % mutate)
        if fixture:
            self.ctx.add_init_script("window.__G5_HARD_FIXTURE__ = " + json.dumps(fixture, ensure_ascii=False) + ";")
        self.pg = self.ctx.new_page()
        self.pg.on("pageerror", lambda e: self.errors.append(str(e)))

    def go(self, hash_=""):
        self.pg.goto(ORIGIN + "index.html" + hash_)
        self.pg.wait_for_function("window.G5HelpWriter && G5HelpWriter() && window.KidGate", timeout=15000)
        if self.pg.evaluate("window.__mutErr || ''"):
            raise RuntimeError("mutate 失敗：" + self.pg.evaluate("window.__mutErr"))

    def seed(self, entry_id, state):
        self.pg.evaluate("([id, s]) => localStorage.setItem('g5help.v1', JSON.stringify({v:1, entries:{[id]: s}}))", [entry_id, state])
        self.pg.reload()
        self.pg.wait_for_function("window.G5HelpWriter && G5HelpWriter() && window.KidGate", timeout=15000)

    def snap(self, label):
        lim = self.limit or self.br.limit
        r = self.pg.evaluate("(m) => KidGate.check(document, window, m).violations", lim)
        self.snaps += 1
        for v in r:
            v.update(case=self.case, at=label)
            self.viol.append(v)
        self.branches.update(self.pg.evaluate("window.__branches || []"))
        return r

    def mark(self, *names):
        self.branches.update(names)

    def close(self):
        self.branches.update(self.pg.evaluate("window.__branches || []") if not self.pg.is_closed() else [])
        self.ctx.close()
        return self


class Browser:
    def __init__(self, name, browser, device, limit):
        self.name, self.browser, self.device, self.limit = name, browser, device, limit
        self.viol, self.branches, self.cases, self.errors, self.selftests = [], set(), set(), [], {}
        self.snaps = 0

    def absorb(self, run, cases=()):
        self.viol += run.viol
        self.branches |= run.branches
        self.cases |= set(cases)
        self.snaps += run.snaps
        self.errors += [f"{run.case}: {e}" for e in run.errors]


# ---------------- 操作小工具 ----------------
def last_ask(pg):
    return pg.locator("#lesson .ask").last


def tap(pg, loc):
    """點了要等畫面真的變了再採字。2026-10-15（#2259）兩個瀏覽器同時跑時，WebKit（iPad 觸控模擬）的點擊事件比 click() 回傳晚到，
    自檢 B09 在回饋出現前就採字、拍到空畫面——正式內容的採字也可能因此漏看違規。等不到變化就報錯，不默默採空畫面。"""
    before = pg.evaluate("document.body.innerHTML")
    loc.click()
    pg.wait_for_function("(b) => document.body.innerHTML !== b", arg=before, timeout=10000)


def lchip(pg, text):
    tap(pg, last_ask(pg).get_by_role("button", name=text, exact=True))


def lnums(pg, values):
    ask = last_ask(pg)
    for i, v in enumerate(values):
        ask.locator(f'input[data-i="{i}"]').fill(str(v))
    ask.get_by_role("button", name="檢查").click()


def fill_row(pg, row, vals):
    for k, v in vals.items():
        pg.locator(f"#practice #{row} input[data-k=\"{k}\"]").fill(str(v))
    pg.locator(f"#practice #{row} button[data-check]").click()


def entry(pg, eid):
    return pg.evaluate("(id) => JSON.parse(JSON.stringify(G5Hard.get(id)))", eid)


def fresh_state(**kw):
    s = {"lessonDone": False, "idx": 0, "seed": 5, "streak": 0, "clean": 0, "solved": 0, "mastered": False, "log": [], "cur": None, "r": 1}
    s.update(kw)
    return s


# ---------------- 正式內容：steps 篇（資料驅動：每一步、每一個選項、每一題練習）----------------
def steps_cases(B, eid):
    r = Run(B, B.device, f"{eid}:lesson")
    r.go(f"#h/{eid}"); r.snap("開篇")
    e = entry(r.pg, eid)
    tap(r.pg, r.pg.get_by_role("button", name="開始學")); r.snap("開始學")
    for i, s in enumerate(e["steps"]):
        if s.get("check"):
            c = s["check"]
            for k in range(len(c["opts"])):
                if k == c["a"]:
                    continue
                tap(r.pg, last_ask(r.pg).locator(f'.chip[data-i="{k}"]')); r.snap(f"第{i + 1}步選錯 {k}"); r.mark(f"{eid}:check{i + 1}:{k}")
            tap(r.pg, last_ask(r.pg).locator(f'.chip[data-i="{c["a"]}"]')); r.snap(f"第{i + 1}步選對"); r.mark(f"{eid}:check{i + 1}:{c['a']}")
        else:
            tap(r.pg, r.pg.locator("#lesson button[data-next]:not([disabled])").last); r.snap(f"第{i + 1}步我懂了")
    r.snap("答案")
    B.absorb(r.close(), [f"{eid}:lesson"])
    n = len(e.get("practice") or [])
    need = min(3, n)
    # 直接練習（全新紀錄、沒看教學）。沒有練習題的篇（先上解說、練習題第二階段補，#2528）頁面不放這顆按鈕（app.html drawTopBtns）
    if n:
        r = Run(B, B.device, f"{eid}:direct")
        r.go(f"#h/{eid}")
        tap(r.pg, r.pg.get_by_role("button", name="我已經會了，直接練習")); r.snap("直接練習第 1 題")
        B.absorb(r.close(), [f"{eid}:direct"])
    # 每一題：重開續練（第 k 題）、每個錯選項、答對。含 practiceAlt（第 2 輪起換數字的題，#2270）：idx＝q 時前端出的就是 allp[q]
    allp = (e.get("practice") or []) + [q for s in (e.get("practiceAlt") or []) for q in s]
    for q in range(len(allp)):
        r = Run(B, B.device, f"{eid}:resume{q}")
        r.go(f"#h/{eid}"); r.seed(eid, fresh_state(lessonDone=True, idx=q, solved=q))
        tap(r.pg, r.pg.locator("#goPractice")); r.snap(f"續練第 {q + 1} 題")
        pq = allp[q]
        assert r.pg.locator("#practice .qtext").inner_text().strip() == pq["q"].strip(), f"{eid} 第 {q + 1} 題畫面上的題目不是 {pq['q']}"
        for k in range(len(pq["opts"])):
            if k != pq["a"]:
                tap(r.pg, r.pg.locator(f'#practice .chip[data-k="{k}"]')); r.snap(f"第 {q + 1} 題選錯 {k}"); r.mark(f"{eid}:prac{q + 1}:{k}")
        tap(r.pg, r.pg.locator(f'#practice .chip[data-k="{pq["a"]}"]')); r.snap(f"第 {q + 1} 題選對"); r.mark(f"{eid}:prac{q + 1}:{pq['a']}")
        B.absorb(r.close(), [f"{eid}:resume{q}"])
    # 有換數字題的篇：同一題再出現、以前答錯過（看過答案）時答對，不算進連續答對（#2274）——採到提示字、而且 streak 真的歸零
    alts = e.get("practiceAlt") or []
    if alts and n:
        again = n * (1 + len(alts))   # 第一套換數字題再出現的第一題（題庫編號＝n）
        r = Run(B, B.device, f"{eid}:revisit")
        r.go(f"#h/{eid}")
        pq = allp[n]
        # 看過答案存在 peek、題目身分用內容（#2282）：鍵用頁面自己的 G5Hard.practiceId 算；另塞 100 筆一次就對的 log，證明擋法不靠 log
        k = r.pg.evaluate("(q) => G5Hard.practiceId(q)", pq)
        filler = [{"t": 10 + i, "q": n + 1, "clean": True, "wrongs": 0} for i in range(100)]
        r.seed(eid, fresh_state(lessonDone=True, idx=again, solved=again, streak=2, log=filler, peek={k: 1}))
        tap(r.pg, r.pg.locator("#goPractice"))
        assert r.pg.locator("#practice .qtext").inner_text().strip() == pq["q"].strip(), f"{eid} 第 {again + 1} 題應該是題庫第 {n + 1} 題再出現"
        tap(r.pg, r.pg.locator(f'#practice .chip[data-k="{pq["a"]}"]')); r.snap("以前答錯過、這次答對")
        st = r.pg.evaluate("(id) => G5HelpPage.state(id)", eid)
        if "之前看過答案" in r.pg.locator("#pend").inner_text() and st["streak"] == 2 and not st["mastered"]:   # 中性：不加不歸零
            r.mark(f"{eid}:revisit")
        B.absorb(r.close(), [f"{eid}:revisit"])
        # 題庫每一題都看過答案（#2288）：出現請家長加新題的提示（採字，過小五用詞閘）；只看過一部分時不出現
        r = Run(B, B.device, f"{eid}:allseen")
        r.go(f"#h/{eid}")
        keys = r.pg.evaluate("(qs) => qs.map((q) => G5Hard.practiceId(q))", allp)
        r.seed(eid, fresh_state(lessonDone=True, idx=again, solved=again, peek={k: 1 for k in keys[:-1]}))
        tap(r.pg, r.pg.locator("#goPractice"))
        partial = r.pg.locator("#allSeen").count() == 0
        r.seed(eid, fresh_state(lessonDone=True, idx=again, solved=again, peek={k: 1 for k in keys}))
        tap(r.pg, r.pg.locator("#goPractice")); r.snap("每一題都看過答案")
        if partial and r.pg.locator("#allSeen").is_visible():
            r.mark(f"{eid}:allseen")
        B.absorb(r.close(), [f"{eid}:allseen"])
    # 學會了（連續 need 題）：答對最後一題出現「這種題你會了」；重開後上方顯示已學會
    if n:
        r = Run(B, B.device, f"{eid}:mastery")
        r.go(f"#h/{eid}"); r.seed(eid, fresh_state(lessonDone=True, idx=0, solved=need - 1, streak=need - 1, clean=need - 1))
        tap(r.pg, r.pg.locator("#goPractice"))
        tap(r.pg, r.pg.locator(f'#practice .chip[data-k="{e["practice"][0]["a"]}"]')); r.snap("學會了")
        ok = r.pg.locator("#pend .win").count() == 1
        r.pg.reload(); r.pg.wait_for_function("window.KidGate && G5HelpWriter()"); r.snap("重開：已學會")
        if ok:
            r.mark(f"{eid}:mastery")
        B.absorb(r.close(), [f"{eid}:mastery"])
    video_case(B, eid)


def video_case(B, eid):
    r = Run(B, B.device, f"{eid}:video")
    r.go(f"#h/{eid}")
    r.pg.locator("#vidBox summary").click(); r.snap("展開影片區")
    B.absorb(r.close(), [f"{eid}:video"])


# ---------------- 正式內容：數學篇（frac-compare）：教學每個分支、練習每個判題分支、提示兩級 ----------------
def frac_lesson(B, subs=(), mutate=None, case="p38-6-2:lesson", until=None):
    r = Run(B, B.device, case, subs=subs, mutate=mutate)
    pg = r.pg
    r.go("#h/p38-6-2"); r.snap("開篇")
    pg.get_by_role("button", name="開始學").click(); r.snap("開始學")
    lchip(pg, "直接比分子，28 比 27 大"); r.snap("第1步選直接比分子"); r.mark("app:step1-num")
    lchip(pg, "分子分母一起乘大一點"); r.snap("第1步選一起乘"); r.mark("app:step1-mul")
    lchip(pg, "先約分：分子分母一起除以同一個數"); r.snap("第1步選約分"); r.mark("app:step1-red")
    if until == 1:
        return r
    lchip(pg, "不能再約了"); r.snap("28/42 說不能再約")
    lchip(pg, "一起除以 3"); r.snap("28/42 選 3")
    lchip(pg, "一起除以 2"); r.snap("28/42 選 2")
    last_ask(pg).get_by_role("button", name="檢查").click(); r.snap("空白按檢查"); r.mark("app:nums-empty")
    lnums(pg, ["3.", 21]); r.snap("填 3."); r.mark("app:nums-bad")
    for t in range(3):
        lnums(pg, [13, 21]); r.snap(f"28÷2 填錯第 {t + 1} 次")
    r.mark("app:nums-wrong", "app:nums-third")
    lnums(pg, [14, 21]); r.snap("28÷2 填對")
    lchip(pg, "不能再約了"); r.snap("14/21 說不能再約")
    lchip(pg, "一起除以 7"); lnums(pg, [2, 3]); lchip(pg, "不能再約了"); r.snap("2/3 不能再約")
    lchip(pg, "一起除以 9"); lnums(pg, [3, 5]); lchip(pg, "不能再約了"); r.snap("第3步完成")
    lnums(pg, [0]); r.snap("最小公倍數填 0"); r.mark("app:step4-le0")
    lnums(pg, [30]); r.snap("最小公倍數填 30"); r.mark("app:step4-common")
    lnums(pg, [7]); r.snap("最小公倍數填 7"); r.mark("app:step4-else")
    lnums(pg, [15]); r.snap("最小公倍數填 15")
    lnums(pg, [4]); r.snap("3 乘多少填 4")
    for v in (5, 10, 3, 9):
        lnums(pg, [v])
    r.snap("第4步完成")
    lchip(pg, "<"); r.snap("第5步選 <"); r.mark("app:step5-wrong")
    lchip(pg, ">"); r.snap("第5步選 >"); r.mark("app:step5-ok")
    lchip(pg, "<"); r.snap("所以選 <"); r.mark("app:step5b-wrong")
    lchip(pg, ">"); r.snap("所以選 >"); r.mark("app:step5b-ok")
    lchip(pg, "先通分，再約分"); r.snap("第6步先通分"); r.mark("app:step6-x")
    lchip(pg, "直接比分子"); r.snap("第6步直接比分子"); r.mark("app:step6-n")
    lchip(pg, "先約分，再通分"); r.snap("第6步先約分"); r.mark("app:step6-ok")
    pg.locator("#lesson details.alt summary").click(); r.snap("展開另一種做法"); r.mark("app:alt")
    return r


def solve_row3(r, a, b, label):
    sa, sb, ea, eb, sign = answers(a, b)
    fill_row(r.pg, "r1", {"a.n": sa[0], "a.d": sa[1], "b.n": sb[0], "b.d": sb[1]}); r.snap(label + " ①對")
    fill_row(r.pg, "r2", {"c.n": ea[0], "c.d": ea[1], "e.n": eb[0], "e.d": eb[1]}); r.snap(label + " ②對")
    return sign


def frac_practice(B):
    r = Run(B, B.device, "p38-6-2:practice")
    pg = r.pg
    r.go("#h/p38-6-2")
    pg.get_by_role("button", name="我已經會了，直接練習").click(); r.snap("直接練習第 1 題"); r.mark("p38-6-2:direct")
    # 第 1 題 24/36、35/50：①的每個錯法、提示兩級；②的每個錯法、提示兩級、用 60 通分也對（B10）；③比錯
    r1 = lambda vals, lab: (fill_row(pg, "r1", vals), r.snap(lab))
    pg.locator("#practice #r1 button[data-check]").click(); r.snap("①空白"); r.mark("app:form-empty")
    r1({"a.n": "3.", "a.d": 3, "b.n": 7, "b.d": 10}, "①填 3."); r.mark("app:form-bad")
    r1({"a.n": 0, "a.d": 3}, "①分子 0")
    r1({"a.n": 2, "a.d": 0}, "①分母 0")
    r1({"a.n": 12, "a.d": 18}, "①沒約完")
    r1({"a.n": 5, "a.d": 7}, "①大小變了")
    r1({"a.n": 12, "a.d": 12}, "①分子分母除以不同數")
    pg.locator("#practice #r1 button[data-hint]").click(); r.snap("①提示 1"); r.mark("app:hint-r1-1")
    pg.locator("#practice #r1 button[data-hint]").click(); r.snap("①提示 2"); r.mark("app:hint-r1-2")
    r1({"a.n": 2, "a.d": 3, "b.n": 7, "b.d": 10}, "①對"); r.mark("app:r1-ok")
    r2 = lambda vals, lab: (fill_row(pg, "r2", vals), r.snap(lab))
    r2({"c.n": 20, "c.d": 30, "e.n": 21, "e.d": 60}, "②分母不同")
    r2({"c.n": 21, "c.d": 30, "e.n": 21, "e.d": 30}, "②左邊變了")
    r2({"c.n": 20, "c.d": 30, "e.n": 20, "e.d": 30}, "②右邊變了")
    r2({"c.n": 0, "c.d": 30, "e.n": 21, "e.d": 30}, "②左邊分子 0")
    r2({"c.n": 20, "c.d": 30, "e.n": 21, "e.d": 0}, "②右邊分母 0")
    pg.locator("#practice #r2 button[data-hint]").click(); r.snap("②提示 1（B11 倍數列表那句）"); r.mark("app:hint-r2-1")
    pg.locator("#practice #r2 button[data-hint]").click(); r.snap("②提示 2"); r.mark("app:hint-r2-2")
    r2({"c.n": 40, "c.d": 60, "e.n": 42, "e.d": 60}, "②用 60 通分（B10）")
    b10 = pg.locator("#practice #r3").is_visible()
    pg.locator('#practice #r3 button[data-s=">"]').click(); r.snap("③比錯")
    pg.locator('#practice #r3 button[data-s="<"]').click(); r.snap("③比對、這題看了提示"); r.mark("app:finish-hint")
    # 第 2 題：一次做對（②用最小公倍數）
    pg.locator("#nextQ").click(); r.snap("第 2 題")
    a, b = FIXED[1]; s = solve_row3(r, a, b, "第 2 題")
    pg.locator(f'#practice #r3 button[data-s="{s}"]').click(); r.snap("第 2 題完成"); r.mark("app:finish-clean")
    # 第 3 題：①錯一次（算答錯）
    pg.locator("#nextQ").click(); r.snap("第 3 題")
    fill_row(pg, "r1", {"a.n": 1, "a.d": 5, "b.n": 2, "b.d": 3}); r.snap("第 3 題①錯")
    a, b = FIXED[2]; s = solve_row3(r, a, b, "第 3 題")
    pg.locator(f'#practice #r3 button[data-s="{s}"]').click(); r.snap("第 3 題完成（改過答案）"); r.mark("app:finish-wrong")
    # 第 4 題：一樣大，③先比錯
    pg.locator("#nextQ").click(); r.snap("第 4 題")
    a, b = FIXED[3]; solve_row3(r, a, b, "第 4 題")
    pg.locator('#practice #r3 button[data-s=">"]').click(); r.snap("第 4 題③比錯（一樣大）")
    pg.locator('#practice #r3 button[data-s="="]').click(); r.snap("第 4 題③對")
    # 第 5、6、7 題連續一次做對 ⇒ 學會
    for i in (4, 5, 6):
        pg.locator("#nextQ").click(); r.snap(f"第 {i + 1} 題")
        t = pg.locator("#practice .prob").inner_text().split()
        a, b = (int(t[0]), int(t[1])), (int(t[-2]), int(t[-1]))
        s = solve_row3(r, a, b, f"第 {i + 1} 題")
        pg.locator(f'#practice #r3 button[data-s="{s}"]').click(); r.snap(f"第 {i + 1} 題完成")
    if pg.locator("#pend .win").count():
        r.mark("app:win")
    B.absorb(r.close(), ["p38-6-2:direct", "p38-6-2:practice"])
    # 重開續練（第 8、9 題：亂數題）＋上方「已學會」
    r = Run(B, B.device, "p38-6-2:resume")
    r.go("#h/p38-6-2"); r.seed("p38-6-2", fresh_state(lessonDone=True, idx=7, solved=7, streak=3, clean=5, mastered=True))
    r.snap("重開：已學會、繼續練習（第 8 題）")
    for i in (7, 8):
        r.pg.locator("#goPractice").click(); r.snap(f"續練第 {i + 1} 題")
        t = r.pg.locator("#practice .prob").inner_text().split()
        a, b = (int(t[0]), int(t[1])), (int(t[-2]), int(t[-1]))
        s = solve_row3(r, a, b, f"續練第 {i + 1} 題")
        r.pg.locator(f'#practice #r3 button[data-s="{s}"]').click(); r.snap(f"續練第 {i + 1} 題完成")
    B.absorb(r.close(), ["p38-6-2:resume"])
    return b10


def home_case(B):
    r = Run(B, B.device, "home")
    r.go(""); r.snap("首頁")
    # 家長功能（2026-10-13 律師：「為何我測試用的題目，我沒法清除？」）：每一個新狀態都採一次字
    pg = r.pg
    btn = pg.locator("button[data-hide]").first
    btn.click(); r.snap("首頁：確定隱藏？")
    btn.click(); r.snap("首頁：隱藏一篇後")
    pg.locator("#hidBox summary").click(); r.snap("首頁：已隱藏清單展開")
    pg.locator("#setBox summary").click(); r.snap("家長設定")
    pg.locator("#clearAll").click(); r.snap("家長設定：確定清除？")
    pg.locator("#clearAll").click(); r.snap("家長設定：清好了")
    ok = "清好了" in pg.locator("#clearMsg").inner_text() and pg.locator("#unhideAll").is_visible()
    B.absorb(r.close(), ["home", "home:hide", "home:settings"] if ok else ["home"])
    # 撤回自己傳的題目：撤回、確定撤回？、做好了不能撤、沒網路、撤回了
    r = Run(B, B.device, "home:withdraw")
    box = {"withdraw": None}
    items = [{"id": "u1-1", "time": 1791868600000, "subject": "自然", "note": "【測試】銀葉樹", "status": "new"}]

    def gas(route):
        req = json.loads(route.request.post_data or "{}")
        if req.get("op") == "withdraw":
            if box["withdraw"] == "net":   # 回壞內容＝fetch 那條 catch（WebKit 對 abort 會另報一條 access control 頁面錯誤）
                return route.fulfill(status=502, content_type="text/html", headers={"Access-Control-Allow-Origin": "*"}, body="<html>")
            body = {"ok": False, "err": box["withdraw"]} if box["withdraw"] else {"ok": True}
        else:
            body = {"ok": True, "lastFetch": 0, "items": items}
        route.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps(body))
    r.ctx.route(lambda u: u.startswith(EP), gas)
    # 同步碼在載入前放好（先開頁再 reload 時，WebKit 會把被中斷的同步請求記成一條 access control 頁面錯誤）
    r.ctx.add_init_script("try{localStorage.setItem('g5sync.code','ABCDEFGHJKMN')}catch(e){}")
    r.go("")
    r.pg.locator("#upBox summary").click()
    r.pg.wait_for_function("document.querySelector('#upList button[data-wd]')", timeout=5000)
    wb = r.pg.locator('#upList button[data-wd="u1-1"]')
    r.snap("撤回")
    seen = []
    for mode, label in (("done", "做好了不能撤"), ("not-found", "找不到"), ("server", "沒撤回成功"), ("net", "沒有網路"), (None, "撤回了")):
        box["withdraw"] = mode
        wb.click(); r.snap("確定撤回？")
        wb.click(); r.pg.wait_for_timeout(300); r.snap(label)
        seen.append(r.pg.locator("#upWMsg").inner_text())
    B.absorb(r.close(), ["home:withdraw"] if all(seen) and "撤回了" in seen[-1] else [])


# ---------------- 自檢 B01–B19：內容改壞要抓到；正例不誤判 ----------------
def fixture_entry(eid, say=None, fig=None, title="測試步驟"):
    return {"id": eid, "date": "2026-10-13", "subject": "國語", "kind": "steps", "source": "測試卷", "title": "測試題",
            "question": "測試題目", "lead": "看下面。", "words": {},
            "steps": [{"title": title, "say": say or "看圖。", "fig": fig or '<svg viewBox="0 0 10 10" role="img" aria-label="測試圖示"><rect width="5" height="5"/></svg>'}],
            "answer": "好", "practice": []}


def has(viol, kind, word=None, minchars=None):
    return any(v["kind"] == kind and (word is None or v.get("word") == word) and (minchars is None or v.get("chars", 0) >= minchars) for v in viol)


def selftests(B):
    T = B.selftests

    def rec(tid, ok, detail):
        T[tid] = {"ok": bool(ok), "detail": detail}
        say(("PASS " if ok else "FAIL ") + f"{B.name} 自檢 {tid}" + ("" if ok else f"  ← {detail}"))

    def lesson_open(mutate=None, fixture=None, eid="sci-q5-bangen", limit=None, viewport=None):
        dev = dict(B.device)
        if viewport:
            dev["viewport"] = viewport
        r = Run(B, dev, "self", mutate=mutate, fixture=fixture, limit=limit)
        r.go(f"#h/{eid}"); r.snap("開篇")
        r.pg.get_by_role("button", name="開始學").click(); r.snap("開始學")
        return r

    BG = "var e = H.get('sci-q5-bangen');"
    # B01 空解釋（含全形空白）
    for tid, lead in (("B01a", "先弄清楚板根（）。"), ("B01b", "先弄清楚板根（　）。")):
        r = Run(B, B.device, "self", mutate=BG + f"e.lead = {json.dumps(lead)};")
        r.go("#h/sci-q5-bangen"); v = r.snap("開篇"); r.close()
        rec(tid, has(v, "word", "板根"), v)
    # B02 check.why／practice.why 放「再想想蒸散。」，各自走那個錯答
    r = lesson_open(BG + "e.steps[0].check.why[0] = '再想想蒸散。';")
    last_ask(r.pg).locator('.chip[data-i="0"]').click(); v = r.snap("第1步選錯"); r.close()
    rec("B02a", has(v, "word", "蒸散"), v)
    r = Run(B, B.device, "self", mutate=BG + "e.practice[0].why[1 - e.practice[0].a] = '再想想蒸散。';")
    r.go("#h/sci-q5-bangen"); a0 = entry(r.pg, "sci-q5-bangen")["practice"][0]["a"]
    r.pg.get_by_role("button", name="我已經會了，直接練習").click()
    r.pg.locator(f'#practice .chip[data-k="{1 - a0}"]').click(); v = r.snap("練習選錯"); r.close()
    rec("B02b", has(v, "word", "蒸散"), v)
    # B03 數學篇 lead 用光合作用（沒有 readReview 也照查）
    r = Run(B, B.device, "self", mutate="var e = H.get('p38-6-2'); e.lead = '先認識光合作用。'; delete e.readReview;")
    r.go("#h/p38-6-2"); v = r.snap("開篇"); r.close()
    rec("B03", has(v, "word", "光合作用"), v)
    # B04 ok 有解釋、why 沒有：第一次答錯就要攔
    r = lesson_open(BG + "e.steps[0].check.ok = '對！光合作用（植物用陽光做成養分）。'; e.steps[0].check.why[0] = '再想想光合作用。';")
    last_ask(r.pg).locator('.chip[data-i="0"]').click(); v = r.snap("第1步先答錯"); r.close()
    rec("B04", has(v, "word", "光合作用"), v)
    # B05 數學第四步問題恢復成沒解釋的「最小公倍數」：真的操作到第四步
    sub = ("' 的最小公倍數（兩個數共同的倍數裡，最小的那一個）是多少？'", "' 的最小公倍數是多少？'")
    r = frac_lesson(B, subs=[sub], case="self")
    v = [x for x in r.viol if x["kind"] == "word" and x.get("word") == "最小公倍數"]
    r.close()
    rec("B05", bool(v) and any("最小公倍數填 0" in x["at"] or "第3步完成" in x["at"] for x in v), v[:2])
    # B06 練習答對回饋「對！這就是蒸散。」
    r = Run(B, B.device, "self", mutate=BG + "e.practice[0].ok = '對！這就是蒸散。';")
    r.go("#h/sci-q5-bangen"); a0 = entry(r.pg, "sci-q5-bangen")["practice"][0]["a"]
    r.pg.get_by_role("button", name="我已經會了，直接練習").click()
    r.pg.locator(f'#practice .chip[data-k="{a0}"]').click(); v = r.snap("練習答對"); r.close()
    rec("B06", has(v, "word", "蒸散"), v)
    # B07 數學 lead 100 個字
    r = Run(B, B.device, "self", mutate="H.get('p38-6-2').lead = '字'.repeat(100) + '。';", limit=SELF_MAX)
    r.go("#h/p38-6-2"); v = r.snap("開篇"); r.close()
    rec("B07", has(v, "length", minchars=100), v)
    # B09 prior.hint 有解釋、prior.ok 只提名詞：第一次答對就要攔；先答錯（看到 hint）的路徑另測
    mut = "var p = H.get('p38-6-2').prior; p.hint = '光合作用（植物用陽光做養分）。'; p.ok = '對！光合作用。';"
    r = Run(B, B.device, "self", mutate=mut); r.go("#h/p38-6-2"); r.pg.get_by_role("button", name="開始學").click()
    lchip(r.pg, "先約分：分子分母一起除以同一個數"); v1 = r.snap("第一次就答對"); r.close()
    r = Run(B, B.device, "self", mutate=mut); r.go("#h/p38-6-2"); r.pg.get_by_role("button", name="開始學").click()
    lchip(r.pg, "分子分母一起乘大一點"); v2a = r.snap("先答錯（看到提示）")
    lchip(r.pg, "先約分：分子分母一起除以同一個數"); v2b = r.snap("再答對"); r.close()
    rec("B09", has(v1, "word", "光合作用") and not has(v2a, "word", "光合作用") and has(v2b, "word", "光合作用"), {"答對": v1, "答錯": v2a, "再答對": v2b})
    # B12／B13／B14 標題難詞、SVG <text> 難詞、標題 100 字
    r = lesson_open(BG + "e.steps[0].title = '先看光合作用';"); v = r.viol; r.close()
    rec("B12", has(v, "word", "光合作用"), v)
    r = lesson_open(BG + "e.steps[0].fig = e.steps[0].fig.replace('</svg>', '<text x=\"5\" y=\"20\">光合作用</text></svg>');"); v = r.viol; r.close()
    rec("B13", has(v, "word", "光合作用"), v)
    r = lesson_open(BG + "e.steps[0].title = '字'.repeat(100);", limit=SELF_MAX); v = r.viol; r.close()
    rec("B14", has(v, "length", minchars=100), v)
    # B15 相鄰 span 合成 50 字要攔；真正 <br> 分行各 25 字通過；窄視窗自動折行不能規避
    span = "<span>" + "甲" * 25 + "</span><span>" + "乙" * 25 + "</span>。"
    br = "甲" * 25 + "<br>" + "乙" * 25 + "。"
    plain = "丙" * 50 + "。"
    out = {}
    # 第 8 輪：white-space:pre-line 下兩個 span 中間只隔一個「純換行」文字節點＝真正換行，各 25 字要通過；normal 下同樣的原始碼換行只是空白，要攔
    preline = '<span style="display:block;white-space:pre-line"><span>' + "甲" * 25 + "</span>\n<span>" + "乙" * 25 + "</span>。</span>"
    normalnl = '<span style="display:block"><span>' + "甲" * 25 + "</span>\n<span>" + "乙" * 25 + "</span>。</span>"
    for name, s_, vp in (("span", span, None), ("br", br, None), ("br-narrow", br, {"width": 320, "height": 640}), ("plain-narrow", plain, {"width": 320, "height": 640}),
                         ("preline-newline", preline, None), ("normal-newline", normalnl, None)):
        r = lesson_open(fixture=[fixture_entry("t-b15", say=s_)], eid="t-b15", limit=SELF_MAX, viewport=vp)
        out[name] = [x for x in r.viol if x["kind"] == "length"]
        r.close()
    rec("B15", out["span"] and not out["br"] and not out["br-narrow"] and out["plain-narrow"] and not out["preline-newline"] and out["normal-newline"], out)
    # B18（第 8 輪）：「這步看不懂」收到回饋改成 107 字 ⇒ 真的按下去要攔；正式內容另由 confused_case 五種回饋都走到
    long107 = "很" * 105 + "。"
    r = Run(B, B.device, "self", subs=[("收到了！會換一個更好懂的說法。先試試看下一步。", long107)])
    r.ctx.add_init_script("try{localStorage.setItem('g5sync.code','ABCDEFGHJKMN')}catch(e){}")
    r.ctx.route(lambda u: u.startswith(EP), lambda route: route.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body='{"ok":true}'))
    r.go("#h/sci-q5-bangen"); r.pg.get_by_role("button", name="開始學").click()
    r.pg.locator("#lesson .lstep").first.locator("button[data-confused]").click()
    r.pg.locator("#lesson .lstep").first.locator("[data-cmsg]").filter(has_text="很很很").wait_for(timeout=5000)
    v = r.snap("按「這步看不懂」（107 字回饋）"); r.close()
    rec("B18", has(v, "length", minchars=100), v)
    # B16 解釋藏在 hidden、未展開 details：不得借用；展開後另驗
    hid = '<span hidden>光合作用（植物用陽光做養分）</span>光合作用很重要。'
    det = '<details id="gl"><summary>看解釋</summary>光合作用（植物用陽光做養分）</details><span>光合作用很重要。</span>'
    r = lesson_open(fixture=[fixture_entry("t-b16", say=hid)], eid="t-b16"); v1 = r.viol; r.close()
    r = lesson_open(fixture=[fixture_entry("t-b16", say=det)], eid="t-b16"); v2 = list(r.viol)
    r.pg.locator("#gl summary").click(); v3 = r.snap("展開 details"); r.close()
    rec("B16", has(v1, "word", "光合作用") and has(v2, "word", "光合作用") and not has(v3, "word", "光合作用"), {"hidden": v1, "closed": v2, "opened": v3})
    # B19 正例 40 字、反例 41 字；entity、粗體 span、SVG <text> 不改變採字；有實質解釋的不誤判
    cases = {
        "40": ("字" * 40 + "。", None, False), "41": ("字" * 41 + "。", None, True),
        "bold40": ("<b>字字</b>" + "字" * 38 + "。", None, False), "bold41": ("<b>字字</b>" + "字" * 39 + "。", None, True),
        "entity40": ("&amp;" + "字" * 39 + "。", None, False), "entity41": ("&amp;" + "字" * 40 + "。", None, True),
        "svg41": ("看圖。", '<svg viewBox="0 0 10 10" role="img" aria-label="測試圖示"><text x="1" y="5">' + "字" * 41 + "</text></svg>", True),
        "svg40": ("看圖。", '<svg viewBox="0 0 10 10" role="img" aria-label="測試圖示"><text x="1" y="5">' + "字" * 40 + "</text></svg>", False),
    }
    got = {}
    for k, (s_, fig, bad) in cases.items():
        r = lesson_open(fixture=[fixture_entry("t-b19", say=s_, fig=fig)], eid="t-b19", limit=SELF_MAX)
        got[k] = (has(r.viol, "length"), bad)
        r.close()
    r = lesson_open(fixture=[fixture_entry("t-b19g", say="光合作用（植物用陽光做養分）很重要。")], eid="t-b19g"); g = r.viol; r.close()
    rec("B19", all(a == b for a, b in got.values()) and not has(g, "word"), {"len": got, "gloss": g})
    # 未歸類的可見文字：新加一塊畫面字（不在任何區域）要攔
    r = Run(B, B.device, "self"); r.go("")
    r.pg.evaluate("document.querySelector('.wrap').insertAdjacentHTML('beforeend', '<div id=\"zz\">新加的說明文字</div>'); 0")
    v = r.snap("加一塊沒分類的字"); r.close()
    rec("unclassified", has(v, "unclassified"), v)


# ---------------- U01：交付頁的家長傳題目進度（固定時鐘）----------------
def u01(B):
    res = {}
    for lf_name, lf in (("0", 0), ("null", None), ("undefined", "__undef__")):
        r = Run(B, B.device, "U01")
        t0 = int(datetime(2026, 10, 13, 14, 0, tzinfo=TZ).timestamp() * 1000)
        body = {"ok": True, "items": [{"subject": "數學", "note": "第 6 題", "time": t0, "status": "new"}]}
        if lf != "__undef__":
            body["lastFetch"] = lf
        r.ctx.unroute(lambda u: u.startswith(EP))
        r.ctx.route(lambda u: u.startswith(EP), lambda route: route.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps(body)))
        texts = []
        for hh, mm in ((15, 0), (15, 1)):
            r.pg.clock.set_fixed_time(datetime(2026, 10, 13, hh, mm, tzinfo=TZ))
            r.go(""); r.pg.evaluate("localStorage.setItem('g5sync.code','ABCDEFGHJKMN'); 0"); r.pg.reload()
            r.pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
            r.pg.locator("#upBox summary").click()
            r.pg.wait_for_function("document.querySelector('#upList .hcard')", timeout=5000)
            texts.append(r.pg.locator("#upList .hcard .st").inner_text())
        r.close()
        res[lf_name] = texts
    ok = all(t == ["已送出，等電腦取回"] * 2 for t in res.values())
    say(("PASS " if ok else "FAIL ") + f"{B.name} U01 交付頁 14:00 送出、lastFetch＝0／null／undefined，15:00 與 15:01 都說「已送出，等電腦取回」" + ("" if ok else f"  ← {res}"))
    return {"ok": ok, "detail": res}


# ---------------- 「這步看不懂」五種回饋（第 8 輪 B18：driver 原本沒按過，107 字的突變也不會被量到）----------------
HOLD_CONFUSED_JS = r"""(function(){
  var f = window.fetch;
  window.fetch = function(url, cfg){
    if (window.__holdConfused && cfg && /"op":"confused"/.test(String(cfg.body))) {
      return new Promise(function(done){ window.__releaseConfused = function(){ done(f.apply(window, [url, cfg])); }; });
    }
    return f.apply(window, arguments);
  };
})();"""


def confused_case(B, eid="sci-q5-bangen"):
    modes = (("nocode", None, "這台還沒開同步"), ("sending", "ok", "送出中…"), ("ok", "ok", "收到了！會換一個更好懂的說法"),
             ("fail", "fail", "沒送成功，請跟爸爸媽媽說"), ("net", "net", "沒送成功（可能沒有網路）"))
    for name, mode, want in modes:
        r = Run(B, B.device, f"{eid}:confused-{name}")
        if mode:
            r.ctx.add_init_script("try{localStorage.setItem('g5sync.code','ABCDEFGHJKMN')}catch(e){}")
            r.ctx.add_init_script(HOLD_CONFUSED_JS)

            def make_gas(mode):   # 不能用預設參數綁 mode：Playwright 依參數個數把 request 當第二個參數傳進來
                def gas(route):
                    req = json.loads(route.request.post_data or "{}")
                    if req.get("op") == "confused" and mode == "net":   # 回壞內容＝fetch 那條 catch（WebKit 對 abort 會另報一條 access control 頁面錯誤）
                        return route.fulfill(status=502, content_type="text/html", headers={"Access-Control-Allow-Origin": "*"}, body="<html>")
                    body = {"ok": mode != "fail"} if req.get("op") == "confused" else {"ok": False, "err": "server"}
                    route.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps(body))
                return gas
            r.ctx.route(lambda u: u.startswith(EP), make_gas(mode))
        r.go(f"#h/{eid}")
        r.pg.get_by_role("button", name="開始學").click()
        if name == "sending":
            r.pg.evaluate("window.__holdConfused = true; 0")
        r.pg.locator("#lesson .lstep").first.locator("button[data-confused]").click()
        msg = r.pg.locator("#lesson .lstep").first.locator("[data-cmsg]")
        try:
            msg.filter(has_text=want).wait_for(timeout=5000)
        except Exception:
            pass
        r.snap("按「這步看不懂」：" + name)
        got = msg.inner_text()
        if want in got:
            r.mark(f"app:confused-{name}")
        else:
            r.errors.append(f"「這步看不懂」{name} 沒出現預期回饋：{got!r}")
        if name == "sending":
            r.pg.evaluate("window.__releaseConfused && window.__releaseConfused(); 0")
            r.pg.wait_for_timeout(300); r.snap("送出中→收到了")
        B.absorb(r.close(), [])


# ---------------- 唯讀提示：第二個分頁、取鎖被拒、瀏覽器沒有 Web Locks（第 8 輪 B18：第二分頁提示 45 字沒人量）----------------
def readonly_cases(B, eid="sci-q5-bangen"):
    READONLY = "window.KidGate && window.G5HelpWriter && document.querySelector('#topBtns .banner')"
    # 第二個分頁
    r = Run(B, B.device, "readonly:second-tab")
    r.go(f"#h/{eid}")
    first = r.pg
    second = r.ctx.new_page(); second.on("pageerror", lambda e: r.errors.append(str(e)))
    second.goto(ORIGIN + "index.html#h/" + eid); second.wait_for_function(READONLY, timeout=15000)
    r.pg = second
    r.snap("第二個分頁：篇內")
    ok = second.evaluate("G5HelpWriter()") is False and "另一個分頁" in second.locator("#topBtns").inner_text()
    second.evaluate("location.hash=''; 0"); second.wait_for_selector("#home:not([hidden])")
    second.locator("#setBox summary").click(); r.snap("第二個分頁：首頁家長設定")
    r.branches.update(second.evaluate("window.__branches || []"))
    second.close(); r.pg = first
    B.absorb(r.close(), ["readonly:second-tab"] if ok else [])
    for case, init, want in (("readonly:lockfail", "navigator.locks.request=function(){return Promise.reject(new Error('lock-rejected'));};", "拿不到存檔的權限"),
                             ("readonly:nolocks", "try{Object.defineProperty(Navigator.prototype,'locks',{get:function(){return undefined;},configurable:true});}catch(e){}"
                                                  "try{Object.defineProperty(navigator,'locks',{get:function(){return undefined;},configurable:true});}catch(e){}", "瀏覽器太舊")):
        r = Run(B, B.device, case)
        r.ctx.add_init_script(init)
        r.pg.goto(ORIGIN + "index.html#h/" + eid); r.pg.wait_for_function(READONLY, timeout=15000)
        r.snap("唯讀：" + case)
        ok = want in r.pg.locator("#topBtns").inner_text()
        if not ok:
            r.errors.append(f"{case} 沒出現預期提示：{r.pg.locator('#topBtns').inner_text()!r}")
        B.absorb(r.close(), [case] if ok else [])


def run_browser(B):
    home_case(B)
    confused_case(B)
    readonly_cases(B)
    for eid in [e for e in json.loads(subprocess.check_output(["node", "-e", "console.log(JSON.stringify(require('./src/hard.js').LIST.map(e=>[e.id,e.kind])))"], cwd=ROOT))]:
        if eid[1] == "steps":
            steps_cases(B, eid[0])
    r = frac_lesson(B)
    r.pg.locator("#toPractice").click(); r.snap("教學後換你做")
    B.absorb(r.close(), ["p38-6-2:lesson", "p38-6-2:alt"])
    b10 = frac_practice(B)
    say(("PASS " if b10 else "FAIL ") + f"{B.name} B10 約成 2/3、7/10 後通分填 40/60、42/60：判為正確、出現第③列")
    B.selftests["B10-judged"] = {"ok": b10, "detail": ""}
    video_case(B, "p38-6-2")
    selftests(B)
    B.selftests["U01"] = u01(B)


def final_check():
    # 案例完整性與總判定交給 tests/kidtext.js（node 端同一套）
    return subprocess.run(["node", "-e", "const K=require('./tests/kidtext.js');const p=K.harvestProblems(['word','length','unclassified']);"
                           "p.forEach(x=>console.log('PROBLEM '+x));console.log(p.length?'kidtext: '+p.length+' 項問題':'kidtext: 全部通過');process.exit(p.length?1:0)"], cwd=ROOT).returncode


def parallel():
    t0 = time.time()
    procs = [subprocess.Popen([sys.executable, str(Path(__file__).resolve()), "--only", b, "--no-check"], cwd=ROOT) for b in ("chromium", "webkit")]
    rcs = [p.wait() for p in procs]
    say(f"兩個瀏覽器同時跑完：{time.time() - t0:.0f} 秒（各自結束碼 {rcs}）")
    sys.exit(overall_rc(final_check(), rcs))


def overall_rc(final_rc, rcs):
    """任一個瀏覽器行程不是 0（含被砍掉的負數，例如 -9）就算失敗——那個瀏覽器這一輪沒跑完，判定讀到的可能是上一輪的結果。
    舊版 final_check() or max(rcs)：[-9, 0] 的 max 是 0，配上一輪留下、雜湊仍有效的採字結果就回 0（Codex 審 41b02fe，#2274）。"""
    return final_rc or (1 if any(rc != 0 for rc in rcs) else 0)


def main():
    if "--help" in sys.argv or "-h" in sys.argv:   # #2260 實測：舊版不認 --help，下了直接跑整套
        print(__doc__)
        return
    if "--parallel" in sys.argv:
        return parallel()
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    # 正式上限固定（小五 40，tests/kidtext.js OFFICIAL_MAX）：不用執行當天的年級換算（第 8 輪 B19：隔年同一份 41 字會從紅變綠）
    limit = json.loads(subprocess.check_output(["node", "-e", "console.log(require('./tests/kidtext.js').OFFICIAL_MAX)"], cwd=ROOT))
    stamp = {"index_sha256": sha(ROOT / "index.html"), "kidgate_sha256": sha(ROOT / "tests" / "kidgate.js"), "driver_sha256": sha(Path(__file__)), "max": limit}
    results = {}
    with sync_playwright() as p:
        for name, launcher, device in (("chromium", p.chromium, {"viewport": {"width": 1280, "height": 900}}),
                                       ("webkit", p.webkit, p.devices["iPad (gen 7)"])):
            if only and only != name:
                continue
            br = launcher.launch()
            B = Browser(name, br, device, limit)
            try:
                run_browser(B)
            except Exception as e:
                B.errors.append("跑到一半中斷：" + str(e).splitlines()[0])
                say(f"FAIL {name} 跑到一半中斷：{str(e).splitlines()[0]}")
            br.close()
            uniq = {}
            for v in B.viol:
                uniq.setdefault((v["kind"], v.get("word"), v.get("text")), v)
            results[name] = {**stamp, "cases": sorted(B.cases), "branches": sorted(B.branches), "violations": list(uniq.values()),
                                        "selftests": B.selftests, "errors": B.errors, "snapshots": B.snaps}
            for v in uniq.values():
                say(f"VIOLATION {name} [{v['kind']}] {v['case']} @ {v['at']}：" + (f"「{v.get('word')}」…{v['text']}…" if v["kind"] == "word" else f"{v.get('chars', '')} 字：{v['text']}"))
            say(f"{name}：快照 {B.snaps} 次、案例 {len(B.cases)}、分支 {len(B.branches)}、違規 {len(uniq)}、自檢 {sum(1 for t in B.selftests.values() if t['ok'])}/{len(B.selftests)}、JS 錯誤 {len(B.errors)}")
    # 寫檔時上鎖、重讀現檔：--parallel 兩個行程同時跑，各自只換自己那一格，不會把對方剛寫的結果蓋回舊的
    with open(OUT.with_name(OUT.name + ".lock"), "w") as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        report = dict(stamp, self_max=SELF_MAX, browsers={})
        if OUT.exists() and only:
            # 只跑一個瀏覽器：另一個瀏覽器的結果原樣保留「它自己當時量的」hash（逐瀏覽器 stamp），由 tests/kidtext.js 逐瀏覽器判新鮮度；
            # 採字器／driver／index.html 任一變了，那份舊結果就判過期，不會因為頂層 hash 換新而被沿用（第 8 輪）
            report["browsers"] = {k: v for k, v in json.loads(OUT.read_text()).get("browsers", {}).items() if k != only}
        report["browsers"].update(results)
        OUT.write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    if "--no-check" in sys.argv:
        sys.exit(1 if any(r["errors"] or r["violations"] for r in results.values()) else 0)
    sys.exit(final_check())


if __name__ == "__main__":
    main()
