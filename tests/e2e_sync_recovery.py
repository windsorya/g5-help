#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""設計 D・A 線真瀏覽器故障注入（A01–A08；Chromium＋WebKit iPad）：只載入本 repo 的 index.html／sync.js（以 https://g5help.test/ 路由提供，
安全來源才有 Web Locks），GAS 端點攔到記憶體後端（同 gas/core.js 協定），可注入「存好了但回應遺失」「請求沒到後端」。
進度用真的畫面作答產生（直接練習、做一題）；判定一律讀回：雲端、localStorage、checkpoint（g5sync.ckpt.g5help.v1）、畫面同步狀態列。
時間用 Playwright 假時鐘推進（恢復要在網路恢復後模擬 60 秒內完成），之後再答一題確認同步仍會前進。
跑法：python3.12 tests/e2e_sync_recovery.py
"""
import json
import os
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from e2e import solve_practice, prob_text  # noqa: E402  （e2e.py 只在 __main__ 才跑）

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = "https://g5help.test/"
EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec"
KEY, CK = "g5help.v1", "g5sync.ckpt.g5help.v1"
RESULTS = []


def check(name, cond, detail=""):
    RESULTS.append(bool(cond))
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  ← {detail}"))


class Backend:
    def __init__(self):
        self.store, self.drop, self.down, self.commits = {}, 0, False, []

    def route(self, route):
        req = json.loads(route.request.post_data or "{}")
        if self.down:
            return route.abort("internetdisconnected")
        k = (req.get("code"), req.get("key"))
        rev, data, upd = self.store.get(k, (0, None, None))
        op = req.get("op")
        if op == "get":
            body = {"ok": True, "rev": rev, "data": data, "updated": upd}
        elif op == "put":
            if req.get("rev") != rev:
                body = {"ok": False, "err": "conflict", "rev": rev, "data": data, "updated": upd}
            else:
                now = int(time.time() * 1000)
                self.store[k] = (rev + 1, req.get("data"), now)
                self.commits.append(rev + 1)
                body = {"ok": True, "rev": rev + 1, "updated": now}
                if self.drop > 0:   # 後端存好了，回應遺失
                    self.drop -= 1
                    return route.abort("failed")
        else:
            body = {"ok": True}
        route.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps(body))


def serve(route):
    name = route.request.url[len(ORIGIN):].split("#")[0].split("?")[0] or "index.html"
    p = ROOT / name
    if name == "sync.js" and os.environ.get("G5_SYNC_JS"):   # 驗「舊碼紅」用：G5_SYNC_JS=tests/fixtures/sync.legacy-859ad79.js
        p = ROOT / os.environ["G5_SYNC_JS"]
    if "/" in name or not p.is_file():
        return route.fulfill(status=404, body="")
    ct = "text/html" if name.endswith(".html") else "application/javascript"
    route.fulfill(status=200, body=p.read_text(encoding="utf-8"), content_type=ct + "; charset=utf-8")


class Case:
    def __init__(self, browser, device, label):
        self.label, self.be, self.errors = label, Backend(), []
        self.ctx = browser.new_context(**device)
        self.ctx.route(ORIGIN + "**", serve)
        self.ctx.route(lambda u: u.startswith(EP), self.be.route)
        self.ctx.clock.install()
        # #2188：seed8() 重新整理後，WebKit 會在 load 後約 0.1–1.2 秒把頁面捲回重新整理前的位置（頂端）；Playwright 1.60 只檢查
        # 第一個滑鼠事件的目標，捲動若落在按下與 click 之間，click 就落到 #home，按鈕沒被按到（家庭碼空，或面板沒開→點擊逾時 30 秒）。
        # 2026-10-18 前置探針 WebKit-iPad：原樣 19/500 落空、149/200 次有跳回頂端；設 manual 後 0/400 落空、0/400 跳動。同步程式不碰捲動。
        self.ctx.add_init_script("history.scrollRestoration = 'manual';")
        self.pg = None

    def open(self, frag=""):
        self.pg = self.ctx.new_page()
        self.pg.on("pageerror", lambda e: self.errors.append(str(e)))
        self.pg.goto(ORIGIN + "index.html" + frag)
        self.pg.wait_for_function("window.G5HelpWriter && G5HelpWriter() && document.querySelector('#g5sync .g5s-panel')", timeout=15000)
        return self.pg

    def reopen(self):
        self.pg.close()
        return self.open()

    def reopen_link(self, code):
        """從家長傳來的同步連結（#sync=同一家庭碼）重開——孩子實際常用的入口（第 8 輪 A05–A08 FAIL）。"""
        self.pg.close()
        return self.open("#sync=" + code)

    def tick(self, ms):
        for _ in range(max(1, ms // 1000)):
            self.pg.clock.run_for(1000)
            self.pg.wait_for_timeout(30)

    def seed8(self):
        self.pg.evaluate("localStorage.setItem('g5help.v1', JSON.stringify({v:1,entries:{'p38-6-2':{lessonDone:true,idx:8,seed:5,streak:2,clean:8,solved:8,mastered:false,log:[],cur:null,r:8}}}))")
        self.pg.reload(); self.pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()", timeout=15000)

    def enable(self):
        # 兩次點擊各自讀回效果（details.open 與按鈕寫碼都是同步的）：點空就直接講點空，不留到下游變成看不懂的紅
        self.pg.locator("#syncBox summary").click()
        if not self.pg.evaluate("document.querySelector('#syncBox').open"):
            raise AssertionError("前置點擊落空：點了同步面板標題但面板沒打開（scrollY=%s）" % self.pg.evaluate("scrollY"))
        self.pg.get_by_role("button", name="開啟跨裝置同步（這台是第一台）").click()
        if not self.pg.evaluate("localStorage.getItem('g5sync.code')"):
            raise AssertionError("前置點擊落空：按了「這台是第一台」但沒有家庭碼（scrollY=%s）" % self.pg.evaluate("scrollY"))
        self.tick(2000)
        return self.pg.evaluate("localStorage.getItem('g5sync.code')")

    def answer(self):
        """真的在畫面上做一題（直接練習／繼續練習），做完回首頁。"""
        pg = self.pg
        pg.evaluate("location.hash='#h/p38-6-2'"); pg.wait_for_selector("#entry:not([hidden])")
        pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob")
        solve_practice(pg, *prob_text(pg))
        pg.wait_for_selector("#pend:not([hidden])")
        pg.evaluate("location.hash=''"); pg.wait_for_selector("#home:not([hidden])")
        return self.solved()

    def solved(self):
        return self.pg.evaluate("JSON.parse(localStorage.getItem('g5help.v1')).entries['p38-6-2'].solved")

    def settled(self, code, n, rev, why):
        pg = self.pg
        cloud = self.be.store.get((code, KEY), (0, None, None))
        local = pg.evaluate("localStorage.getItem('g5help.v1')")
        ck = json.loads(pg.evaluate(f"localStorage.getItem('{CK}')") or "null")
        h = pg.evaluate("(s) => G5Sync.contentHash(s)", local)
        ui = pg.locator("#g5sync .g5s-status").text_content().strip()   # 同步面板在收合的 <details> 裡：讀 DOM 文字，不用 inner_text
        conflicts = pg.locator("#g5sync .g5s-conflict").count()
        # 畫面作答一題會存好幾次（開題記 cur、做完再存），輪詢可能先送出中間版本 ⇒ rev 只要求「至少」；內容必須是最後那份
        ok = (cloud[0] >= rev and cloud[1] == local and json.loads(local)["entries"]["p38-6-2"]["solved"] == n and
              ck and ck["pending"] is None and ck["baseline"]["rev"] == cloud[0] and ck["baseline"]["hash"] == h and
              ui.startswith("已同步") and conflicts == 0)
        check(f"{self.label} {why}：雲端＝本機＝D{n}（rev ≥{rev}）、checkpoint baseline 對上、沒有待確認、畫面「已同步」、沒有衝突", ok,
              {"cloud_rev": cloud[0], "same": cloud[1] == local, "n": json.loads(local)["entries"]["p38-6-2"]["solved"], "ck": ck and {"b": ck["baseline"], "p": bool(ck["pending"])}, "ui": ui, "conflicts": conflicts})

    def keeps_syncing(self, code, n, rev, why):
        got = self.answer()
        self.tick(8000)
        self.settled(code, got, rev, why + " 再答一題後")
        check(f"{self.label} {why} 沒有 JS 錯誤", not self.errors, self.errors)

    def close(self):
        self.ctx.close()


def baseline8(c):
    c.open(); c.seed8()
    code = c.enable()
    check(f"{c.label} 前置：D8 上傳成 rev 1", c.be.store.get((code, KEY), (0,))[0] == 1)
    return code


def first_enable_lost(c):
    c.open(); c.seed8()
    c.be.drop = 1
    code = c.enable()
    check(f"{c.label} 前置：首次啟用 D8 已存進後端（回應遺失）", c.be.store.get((code, KEY), (0,))[0] == 1)
    return code


def lose_d9(c):
    c.be.drop = 1
    n = c.answer()
    c.tick(5000)
    return n


def run(browser, device, label):
    def case(name, fn):
        c = Case(browser, device, f"{label} {name}")
        try:
            fn(c)
        except Exception as e:   # 舊碼卡住也要記成紅，不中斷其他案例
            check(f"{c.label} 跑完沒有卡住", False, str(e).splitlines()[0])
        finally:
            c.close()

    def a01(c):
        code = baseline8(c); n = lose_d9(c)
        c.tick(60000); c.settled(code, n, 2, "A01 同頁重試")
        c.keeps_syncing(code, n + 1, 3, "A01")

    def a02(c):
        code = baseline8(c); lose_d9(c)
        n = c.answer()   # 重試前先答成 D10
        c.tick(60000); c.settled(code, n, 3, "A02 先確認 D9 再送 D10")
        check(f"{c.label} A02 後端提交的版本號連續、沒有重複", c.be.commits == list(range(1, len(c.be.commits) + 1)), c.be.commits)
        c.keeps_syncing(code, n + 1, 4, "A02")

    def a03(c):
        code = first_enable_lost(c)
        c.tick(60000); c.settled(code, 8, 1, "A03 首次啟用同頁重試")
        c.keeps_syncing(code, 9, 2, "A03")

    def a04(c):
        code = first_enable_lost(c)
        n = c.answer()
        c.tick(60000); c.settled(code, n, 2, "A04 首次啟用、重試前多答")
        c.keeps_syncing(code, n + 1, 3, "A04")

    def a05(c):
        code = first_enable_lost(c)
        c.reopen(); c.tick(60000); c.settled(code, 8, 1, "A05 首次啟用、重開不多答")
        c.keeps_syncing(code, 9, 2, "A05")

    def a06(before):
        def f(c):
            code = first_enable_lost(c)
            if before:
                n = c.answer(); c.reopen()
            else:
                c.be.down = True; c.reopen(); n = c.answer(); c.be.down = False
                c.pg.evaluate("window.dispatchEvent(new Event('online')); 0")
            c.tick(60000); c.settled(code, n, 2, "A06 " + ("重開前" if before else "重開後恢復前") + "多答")
            c.keeps_syncing(code, n + 1, 3, "A06")
        return f

    def a07(c):
        code = baseline8(c); n = lose_d9(c)
        c.reopen(); c.tick(60000); c.settled(code, n, 2, "A07 重開不多答")
        c.keeps_syncing(code, n + 1, 3, "A07")

    def a08(before):
        def f(c):
            code = baseline8(c); lose_d9(c)
            if before:
                n = c.answer(); c.reopen()
            else:
                c.be.down = True; c.reopen(); n = c.answer(); c.be.down = False
                c.pg.evaluate("window.dispatchEvent(new Event('online')); 0")
            c.tick(60000); c.settled(code, n, 3, "A08 " + ("重開前" if before else "重開後恢復前") + "多答")
            c.keeps_syncing(code, n + 1, 4, "A08")
        return f

    # A05L–A08L：同 A05–A08，但從同步連結（#sync=同一家庭碼）重開；另驗 checkpoint 沒被清掉、之後仍有請求
    def via_link(c, code):
        c.reopen_link(code)
        frag = c.pg.evaluate("location.hash")
        check(f"{c.label} 同步連結重開後網址的 #sync 已拿掉", "sync=" not in frag, frag)

    def a05l(c):
        code = first_enable_lost(c)
        via_link(c, code); c.tick(60000); c.settled(code, 8, 1, "A05L 連結重開不多答")
        c.keeps_syncing(code, 9, 2, "A05L")

    def a06l(before):
        def f(c):
            code = first_enable_lost(c)
            if before:
                n = c.answer(); via_link(c, code)
            else:
                c.be.down = True; via_link(c, code); n = c.answer(); c.be.down = False
                c.pg.evaluate("window.dispatchEvent(new Event('online')); 0")
            c.tick(60000); c.settled(code, n, 2, "A06L 連結重開" + ("前" if before else "後恢復前") + "多答")
            c.keeps_syncing(code, n + 1, 3, "A06L")
        return f

    def a07l(c):
        code = baseline8(c); n = lose_d9(c)
        via_link(c, code); c.tick(60000); c.settled(code, n, 2, "A07L 連結重開不多答")
        c.keeps_syncing(code, n + 1, 3, "A07L")

    def a08l(before):
        def f(c):
            code = baseline8(c); lose_d9(c)
            if before:
                n = c.answer(); via_link(c, code)
            else:
                c.be.down = True; via_link(c, code); n = c.answer(); c.be.down = False
                c.pg.evaluate("window.dispatchEvent(new Event('online')); 0")
            c.tick(60000); c.settled(code, n, 3, "A08L 連結重開" + ("前" if before else "後恢復前") + "多答")
            c.keeps_syncing(code, n + 1, 4, "A08L")
        return f

    for name, fn in (("A01", a01), ("A02", a02), ("A03", a03), ("A04", a04), ("A05", a05), ("A06a", a06(True)), ("A06b", a06(False)),
                     ("A07", a07), ("A08a", a08(True)), ("A08b", a08(False)),
                     ("A05L", a05l), ("A06La", a06l(True)), ("A06Lb", a06l(False)),
                     ("A07L", a07l), ("A08La", a08l(True)), ("A08Lb", a08l(False))):
        case(name, fn)


def main():
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    with sync_playwright() as p:
        if only in (None, "chromium"):
            br = p.chromium.launch()
            run(br, {"viewport": {"width": 1280, "height": 900}}, "Chromium")
            br.close()
        if only in (None, "webkit"):
            wk = p.webkit.launch()
            run(wk, p.devices["iPad (gen 7)"], "WebKit-iPad")
            wk.close()
    print(f"\n{sum(RESULTS)}/{len(RESULTS)} PASS")
    sys.exit(0 if RESULTS and all(RESULTS) else 1)


if __name__ == "__main__":
    main()
