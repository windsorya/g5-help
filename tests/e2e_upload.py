"""補題區共用元件（src/upload.js，交辦 #1618）在真瀏覽器裡測：送出、清單、撤回，以及清單查詢／撤回／上傳的生命週期驗收矩陣 U1–U15
（依 Codex 設計者結論 docs/upload-list-lifecycle-codex-designer-20261013.md 的 (b) 驗收矩陣與 (d) 推薦設計）。攔截 GAS，不打真後端。

用 python3.12 執行：python3.12 tests/e2e_upload.py          （Chromium 與 WebKit 各跑一遍；iPad 是 WebKit）
只跑某幾列（除錯用）：python3.12 tests/e2e_upload.py U3 U9 既有
測別份元件（突變自檢用，不必改 repo 檔）：G5_UPLOAD_SRC=/某處/upload.js python3.12 tests/e2e_upload.py

共同 fixture（設計者 (b) 的要求）：
- 假 GAS 的資料依 (家庭碼, 本科前綴) 分開存，各家、各科的題目 id 互斥：拿錯家、錯科的回應一看就知道；
- 每一列（每個變體）都開新的 browser context；
- 扣住的清單查詢在扣住當下固定快照（之後伺服器資料再變，放行的仍是當時那份）；撤回、上傳在放行當下才生效（之前伺服器還沒處理）；
- 每個請求都記下 op／code／prefix／id／送到哪個 endpoint，逐列斷言請求內容；
- 用 Playwright 假時鐘（page.clock，暫停在起點）凍結 2 秒家庭碼檢查與 60 秒自動重查，期限用 run_for／set_system_time 推進，不靠真的等。
"""
import base64
import hashlib
import json
import os
import sys
import tempfile
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SRC_PATH = Path(os.environ.get("G5_UPLOAD_SRC") or ROOT / "src" / "upload.js")
SRC = SRC_PATH.read_text(encoding="utf-8")
PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
A = "ABCDEFGHJKMN"   # 家庭 A 的同步碼
B = "PQRSTUVWXYZ2"   # 家庭 B
P = {"國語": "【補題:國語:", "數學": "【補題:數學:", "自然": "【補題:自然:", "社會": "【補題:社會:"}
SITE = {"國語": "g5-chinese-review", "數學": "g5-math-review", "自然": "g5-sci-review", "社會": "g5-social-review"}
UNITS = '[{id:"L1", name:"第一課 新的開始"}, {id:"L2", name:"第二課 <b>粗</b>"}]'
EP_OLD = "https://script.google.com/macros/s/OLD/exec"   # U9：舊元件、新元件各打不同 endpoint，請求才分得出是誰發的
EP_NEW = "https://script.google.com/macros/s/NEW/exec"
T0 = 1_760_000_000   # 假時鐘起點（Playwright Python 的數字單位是秒）
NO_SYNC = "還沒開啟跨裝置同步"
CANT_READ = "讀不到"
UNSURE = "還沒確認"


def mount_js(var, sel, subject="國語", ep=None):
    extra = f', endpoint:"{ep}"' if ep else ""
    return f'window.{var} = G5Upload.mount("{sel}", {{subject:"{subject}", site:"{SITE[subject]}", units:{UNITS}{extra}}});'


DEFAULT_MOUNT = mount_js("__h", "#box")

# 在元件之前執行（晚於 page.clock 的假計時器，所以包得到）：
# ①記下元件開了哪些計時器、掛了哪些監聽（stop 要全部收掉：U3、U9）
# ②縮圖階段可扣住：new Image() 的 src 先不設，等測試放行（U9、U11）
INSTRUMENT = r"""(function () {
  var st = window.setTimeout, ct = window.clearTimeout, si = window.setInterval, ci = window.clearInterval;
  var timers = {};
  window.setTimeout = function (fn, ms) {
    var id = st.call(window, function () { delete timers["t" + id]; return fn.apply(this, arguments); }, ms);
    timers["t" + id] = ms; return id;
  };
  window.clearTimeout = function (id) { delete timers["t" + id]; return ct.call(window, id); };
  window.setInterval = function (fn, ms) { var id = si.call(window, fn, ms); timers["i" + id] = ms; return id; };
  window.clearInterval = function (id) { delete timers["i" + id]; return ci.call(window, id); };
  var ls = [];
  [[window, "window"], [document, "document"]].forEach(function (p) {
    var t = p[0], add = t.addEventListener, rem = t.removeEventListener;
    t.addEventListener = function (type, f, o) { ls.push([p[1], type, f]); return add.call(this, type, f, o); };
    t.removeEventListener = function (type, f, o) {
      for (var i = ls.length - 1; i >= 0; i -= 1) { if (ls[i][0] === p[1] && ls[i][1] === type && ls[i][2] === f) { ls.splice(i, 1); break; } }
      return rem.call(this, type, f, o);
    };
  });
  // 只數頁面生命週期／跨分頁類的監聽：Playwright 點擊前的可點性檢查會在 window 掛 mouse／pointer／touch 監聽，那不是元件的
  var KINDS = ["storage", "visibilitychange", "pageshow", "pagehide", "online", "offline", "focus", "blur", "hashchange", "popstate", "message", "resize"];
  window.__count = function () {
    return { timers: Object.keys(timers).sort(),
             listeners: ls.filter(function (x) { return KINDS.indexOf(x[1]) >= 0; }).map(function (x) { return x[0] + ":" + x[1]; }) };
  };
  var RealImage = window.Image, desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  window.__imgHold = false; window.__imgQueue = [];
  window.Image = function () {
    var img = new RealImage();
    Object.defineProperty(img, "src", { configurable: true, get: function () { return desc.get.call(img); },
      set: function (v) { if (window.__imgHold) { window.__imgQueue.push(function () { desc.set.call(img, v); }); } else { desc.set.call(img, v); } } });
    return img;
  };
  window.__imgRelease = function () { var q = window.__imgQueue; window.__imgQueue = []; q.forEach(function (f) { f(); }); return q.length; };
})();
"""
# 「abort 沒有效果」：請求照樣在網路上，正確性不能靠它（設計者 (d)：AbortController 只是省資源）
NOABORT = "\nAbortController.prototype.abort = function () {};\n"
PAGE = '<!doctype html><html><head><meta charset="utf-8"></head><body>%s\n<script>%s</script>\n<script>%s</script>\n<script>%s</script>\n</body></html>'

RESULTS = []   # (瀏覽器, 列, 名稱, 通過)
FAILS = []
TAG = ""
ROW = ""
TMP = None
PICS = []


def check(name, ok, info=""):
    ok = bool(ok)
    print(("✅ " if ok else "❌ ") + f"{TAG} {name}" + ("" if ok else "｜" + str(info)[:400]), flush=True)
    RESULTS.append((TAG, ROW, name, ok))
    if not ok:
        FAILS.append(f"{TAG} {name}")


def item(iid, subject="國語", unit="L1", text="", status="new", url=None):
    it = {"id": iid, "time": 1760000000000, "subject": subject, "note": f"【補題:{subject}:{unit}】{text or iid}", "status": status}
    if url:
        it["url"] = url
    return it


def hold_first(pred):
    """只扣住第一個符合條件的請求。"""
    used = []

    def f(q):
        if not used and pred(q):
            used.append(1)
            return True
        return False
    return f


class Held:
    def __init__(self, gas, route, req):
        self.gas, self.route, self.req, self.done = gas, route, req, False
        self.snap = gas.result(req) if req.get("op") == "mine" else None   # 清單查詢：扣住當下固定快照

    def release(self, spec=None):
        """spec：None＝照常（清單回扣住時的快照；撤回／上傳此刻才生效）、"abort"＝網路中斷、{"status","json"|"body"}＝指定回應。"""
        if self.done:
            return
        self.done = True
        if spec is None and self.snap is not None:
            spec = {"json": self.snap}
        try:
            self.gas.answer(self.route, self.req, spec)
        except Exception as e:   # 頁面已自己中止這個請求（AbortController），放行已無對象
            self.gas.late_errors.append(str(e)[:120])


class Gas:
    """假 GAS（gas/inbox.js 的 op mine／withdraw／upload）。"""

    def __init__(self, data=None):
        self.data = {k: [dict(x) for x in v] for k, v in (data or {}).items()}
        self.log, self.held, self.once, self.always, self.bad, self.late_errors = [], [], [], [], [], []
        self.hold = None
        self.n_up = 0

    def __call__(self, route):
        try:
            req = json.loads(route.request.post_data or "{}")
        except ValueError:
            req = {"op": "?"}
        url = route.request.url
        req["_ep"] = url.split("/macros/s/", 1)[1].split("/", 1)[0] if "/macros/s/" in url else url
        self.log.append(req)
        if req.get("op") == "mine" and (req.get("prefix") not in P.values() or not req.get("code")):
            self.bad.append(req)
        for lst in (self.once, self.always):
            for i, (cond, spec) in enumerate(lst):
                if cond(req):
                    if lst is self.once:
                        del lst[i]
                    return self.answer(route, req, spec)
        if self.hold and self.hold(req):
            self.held.append(Held(self, route, req))
            return None
        return self.answer(route, req, None)

    def result(self, req):
        op = req.get("op")
        if op == "mine":
            if req.get("prefix") not in P.values():
                return {"ok": False, "err": "bad-prefix"}
            items = [dict(x) for x in self.data.get((req.get("code"), req.get("prefix")), []) if x.get("status") != "withdrawn"]
            return {"ok": True, "items": items, "lastFetch": 0}
        if op == "withdraw":
            for (code, _), items in self.data.items():
                for it in items:
                    if it["id"] == req.get("id"):
                        if code != req.get("code"):
                            return {"ok": False, "err": "not-found"}
                        if it["status"] == "done":
                            return {"ok": False, "err": "done"}
                        if it["status"] == "withdrawn":
                            return {"ok": True, "already": True}
                        it["status"] = "withdrawn"
                        return {"ok": True}
            return {"ok": False, "err": "not-found"}
        if op == "upload":
            self.n_up += 1
            note = req.get("note") or ""
            subj = next((s for s, p in P.items() if note.startswith(p)), None)
            it = {"id": f"up{self.n_up}", "time": 1760000000000, "subject": req.get("subject"), "note": note[:40], "status": "new"}
            self.data.setdefault((req.get("code"), P.get(subj, "")), []).insert(0, it)
            return {"ok": True, "id": it["id"]}
        return {"ok": False, "err": "unknown-op"}

    def answer(self, route, req, spec):
        if spec == "abort":
            return route.abort()
        if spec is None:
            spec = {"json": self.result(req)}
        body = spec["body"] if "body" in spec else json.dumps(spec["json"], ensure_ascii=False)
        return route.fulfill(status=spec.get("status", 200), content_type="application/json", body=body)


class Row:
    """一列（或一個變體）＝一個新的 browser context＋假 GAS。"""
    n = 0

    def __init__(self, b, label, data=None, code=A, body='<div id="box"></div>', mount=DEFAULT_MOUNT, noabort=False, clock=True):
        Row.n += 1
        self.label = label
        self.gas = Gas(data)
        self.ctx = b.new_context()
        if code is not None:
            self.ctx.add_init_script("localStorage.setItem('g5sync.code', %s)" % json.dumps(code))
        self.pg = self.ctx.new_page()
        self.pg.set_default_timeout(5000)
        self.errors = []
        self.pg.on("pageerror", lambda e: self.errors.append(str(e)))
        self.pg.route("**/macros/s/**", self.gas)
        if clock:
            self.pg.clock.install(time=T0)
            self.pg.clock.pause_at(T0 + 1)
        html = TMP / f"row{Row.n}.html"
        html.write_text(PAGE % (body, INSTRUMENT + (NOABORT if noabort else ""), SRC, mount), encoding="utf-8")
        self.pg.goto(html.as_uri())

    def close(self):
        check(f"{self.label} 沒有 JS 錯誤", not self.errors, self.errors[:3])
        check(f"{self.label} 每筆清單查詢都帶同步碼與合法的本科前綴", not self.gas.bad, self.gas.bad[:2])
        try:
            self.ctx.close()
        except Exception:
            pass

    # ── 時間與等待 ──
    def pump(self, ms=300):
        self.pg.wait_for_timeout(ms)

    def tick(self, ms):
        self.pg.clock.run_for(ms)
        self.pump(250)

    def until(self, fn, timeout=4.0):
        end = time.time() + timeout
        while True:
            v = fn()
            if v or time.time() > end:
                return v
            self.pg.wait_for_timeout(40)

    def wait_ids(self, want, box="#box", timeout=4.0):
        end = time.time() + timeout
        while True:
            v = self.ids(box)
            if v == want or time.time() > end:
                return v
            self.pg.wait_for_timeout(40)

    # ── 讀畫面 ──
    def ids(self, box="#box"):
        return self.pg.eval_on_selector_all(f"{box} .g5u-card", "e => e.map(x => x.dataset.id)")

    def txt(self, sel, box="#box"):
        return self.pg.eval_on_selector(f"{box} {sel}", "e => e.textContent")

    def health(self, box="#box"):
        return self.txt(".g5u-health", box)

    def wmsg(self, box="#box"):
        return self.txt(".g5u-wmsg", box)

    def out(self, box="#box"):
        return self.txt(".g5u-out", box)

    def card(self, iid, box="#box"):
        return self.pg.evaluate(f"""() => {{ const c = document.querySelector('{box} .g5u-card[data-id="{iid}"]'); return c ? c.innerText : null; }}""")

    def wd_states(self, box="#box"):
        return self.pg.eval_on_selector_all(f"{box} button[data-wd]", "e => e.map(x => x.disabled)")

    def wd_enabled(self, box="#box"):
        s = self.wd_states(box)
        return bool(s) and not any(s)

    def locked(self, box="#box"):
        return self.pg.evaluate(f"['.g5u-send','.g5u-file','.g5u-note','.g5u-unit'].map(c => document.querySelector('{box} ' + c).disabled)")

    def files(self, box="#box"):
        return self.pg.evaluate(f"document.querySelector('{box} .g5u-file').files.length")

    def view(self, box="#box"):
        return self.pg.evaluate("""(box) => { const r = document.querySelector(box), q = (s) => r.querySelector(s);
          return { cards: [...r.querySelectorAll('.g5u-card')].map((e) => e.dataset.id + '｜' + e.innerText),
                   health: q('.g5u-health').textContent, out: q('.g5u-out').textContent, wmsg: q('.g5u-wmsg').textContent,
                   draft: { unit: q('.g5u-unit').value, note: q('.g5u-note').value, files: q('.g5u-file').files.length },
                   locked: ['.g5u-send', '.g5u-file', '.g5u-note', '.g5u-unit'].map((s) => q(s).disabled),
                   wd: [...r.querySelectorAll('button[data-wd]')].map((e) => e.disabled) }; }""", box)

    def count(self):
        return self.pg.evaluate("window.__count()")

    # ── 讀請求紀錄 ──
    def reqs(self, op, since=0, ep=None):
        return [r for r in self.gas.log[since:] if r.get("op") == op and (ep is None or r["_ep"] == ep)]

    def mine(self, since=0, ep=None):
        return self.reqs("mine", since, ep)

    def wd(self, since=0):
        return self.reqs("withdraw", since)

    def up(self, since=0):
        return self.reqs("upload", since)

    def pending(self):
        return [h for h in self.gas.held if not h.done]

    # ── 操作 ──
    def click_wd(self, iid, box="#box"):
        self.pg.click(f'{box} .g5u-card[data-id="{iid}"] button[data-wd]')

    def withdraw(self, iid, box="#box"):
        """撤回兩段式：先按「撤回」，再按「確定撤回？」。"""
        self.click_wd(iid, box)
        self.click_wd(iid, box)

    def set_code(self, code):
        if code is None:
            self.pg.evaluate("localStorage.removeItem('g5sync.code')")
        else:
            self.pg.evaluate("(c) => localStorage.setItem('g5sync.code', c)", code)

    def reload(self, var="__h", auto=False):
        self.pg.evaluate(f"window.{var}.reload({'true' if auto else ''})")


# ───────────────────────── 既有案例（真計時器） ─────────────────────────

def legacy(b):
    R = Row(b, "既有①沒開同步", data={}, code=None, clock=False)
    try:
        R.pg.set_input_files("#box .g5u-file", PICS[:1])
        R.pg.click("#box .g5u-send")
        check("沒開同步：提示先開同步", "跨裝置同步" in R.out(), R.out())
        R.pump()
        check("沒開同步：不送任何請求", R.gas.log == [], R.gas.log)
        check("沒開同步：清單區說明看不到進度", NO_SYNC in R.health(), R.health())
        check("單元名稱被跳脫（不變成粗體）", R.pg.locator("#box .g5u-unit option", has_text="<b>粗</b>").count() == 1)
    finally:
        R.close()

    data = {(A, P["國語"]): [
        item("x1", "數學", "u1", "別科"),   # 舊後端不篩前綴時混進來的別科補題：網頁也要擋
        {"id": "x2", "time": 1760000000000, "subject": "國語", "note": "【錯題】錯題本的", "status": "new"},
        item("x3", "國語", "L1", "<img src=x onerror=window.__xss=1>", "done", "https://windsorya.github.io/g5-math-review/#c/a1"),
        item("x4", "國語", "L2", "做好了", "done", "https://windsorya.github.io/g5-chinese-review/#c/k2"),
    ]}
    R = Row(b, "既有②–⑤", data=data, code=A, clock=False)
    try:
        R.pg.wait_for_selector("#box .g5u-card")
        ids = R.ids()
        check("清單只列本科補題（別科、錯題不列）", ids == ["x3", "x4"], ids)
        check("家長說明被跳脫（沒有執行注入）", R.pg.evaluate("window.__xss") is None)
        check("別站網址的『做好了』不給連結", R.pg.locator('#box .g5u-card[data-id="x3"] a').count() == 0)
        check("本站網址的『做好了』有連結", R.pg.get_attribute('#box .g5u-card[data-id="x4"] a', "href") == "https://windsorya.github.io/g5-chinese-review/#c/k2")
        check("做好了的不能撤回", R.pg.locator('#box .g5u-card[data-id="x4"] button').count() == 0)
        ms = R.mine()
        check("清單查詢帶本科前綴與本家的碼", ms and all(r.get("prefix") == P["國語"] and r.get("code") == A for r in ms), ms[:2])
        # Codex 審 8601526：送出途中照片、說明、單元都鎖住（否則途中改的內容會在送完時被清掉）
        R.gas.hold = hold_first(lambda q: q["op"] == "upload")
        R.pg.set_input_files("#box .g5u-file", PICS[:1])
        R.pg.click("#box .g5u-send")
        R.until(lambda: R.pending())
        check("送出途中照片、說明、單元、送出鈕都鎖住", all(R.locked()) and "送出第" in R.out(), (R.locked(), R.out()))
        for h in R.pending():
            h.release()
        R.pg.wait_for_function("document.querySelector('#box .g5u-out').textContent.indexOf('送出了') >= 0")
        check("送完解鎖", not any(R.locked()), R.locked())
        R.pump(500)

        R.pg.select_option("#box .g5u-unit", "L2")
        R.pg.fill("#box .g5u-note", "生字和注音")
        R.pg.set_input_files("#box .g5u-file", PICS[:2])
        n = len(R.gas.log)
        R.pg.click("#box .g5u-send")
        R.pg.wait_for_function("document.querySelector('#box .g5u-out').textContent.indexOf('都送出了') >= 0", timeout=15000)
        ups = R.up(n)
        check("兩張照片送兩次 upload", len(ups) == 2, len(ups))
        check("說明前綴與第幾張", [u["note"] for u in ups] == ["【補題:國語:L2】生字和注音（第 1/2 張）", "【補題:國語:L2】生字和注音（第 2/2 張）"], [u["note"] for u in ups])
        check("科目＝國語、帶同步碼、照片是 JPEG data URL", all(u["subject"] == "國語" and u["code"] == A and u["image"].startswith("data:image/jpeg;base64,") for u in ups))
        got = R.until(lambda: {"up2", "up3"} <= set(R.ids()))
        check("送完重抓清單並列出新補的兩筆", R.mine(n) and got, (len(R.mine(n)), R.ids()))
        check("送完清空照片與說明", R.pg.input_value("#box .g5u-note") == "" and R.files() == 0)

        # 撤回：兩段式，第一次只變「確定撤回？」不送；第二次才送 withdraw；撤回後清單不再有
        R.click_wd("up2")
        check("撤回第一次只要求確認", R.wd() == [] and R.pg.locator('#box .g5u-card[data-id="up2"] button', has_text="確定撤回？").count() == 1)
        R.click_wd("up2")
        R.pg.wait_for_function("!document.querySelector('#box .g5u-card[data-id=\"up2\"]')")
        check("第二次送出 withdraw（帶本家的碼）並從清單消失", [(w["code"], w["id"]) for w in R.wd()] == [(A, "up2")], R.wd())

        # 部分失敗：三張中第 2 張失敗 → 訊息點名第 2 張、不清空照片
        n = len(R.gas.log)
        R.gas.always.append((lambda q: q["op"] == "upload" and len(R.up(n)) == 2, {"json": {"ok": False, "err": "too-big"}}))
        R.pg.set_input_files("#box .g5u-file", PICS[:3])
        R.pg.click("#box .g5u-send")
        R.pg.wait_for_function("document.querySelector('#box .g5u-out').textContent.indexOf('沒有送出') >= 0", timeout=15000)
        out = R.out()
        check("部分失敗點名第 2 張", "第 2 張沒有送出" in out and "送出 2 張" in out, out)
        check("部分失敗不清空照片", R.files() == 3)
        check("部分失敗後送出鈕可再按", R.pg.is_enabled("#box .g5u-send"))
        R.gas.always.clear()

        # Codex 審 954df2a：同一頁停止同步（只刪同步碼、不呼叫 reload），清單也要在幾秒內清空
        R.pg.wait_for_selector("#box .g5u-card")
        R.set_code(None)
        R.pump(3500)
        check("同頁停止同步、不重新載入：3.5 秒內清單清空", R.ids() == [], R.ids())
        # 換成另一個家庭碼、新家庭查詢失敗 ⇒ 不得留著前一家的題目
        R.gas.always.append((lambda q: q["op"] == "mine" and q.get("code") == "ZZZZZZZZZZZZ", {"json": {"ok": False, "err": "server"}}))
        R.set_code("ZZZZZZZZZZZZ")
        R.pump(3500)
        check("換家庭碼且查詢失敗：不顯示前一家的題目、提示讀不到", R.ids() == [] and CANT_READ in R.health(), (R.ids(), R.health()))
        R.gas.always.clear()
        R.set_code(A)
        R.pg.wait_for_selector("#box .g5u-card", timeout=8000)
        # Codex 審 8601526：停止同步後，停止前發出的清單查詢晚到不得把舊家庭的題目畫回來
        R.pump(300)
        R.gas.hold = lambda q: q["op"] == "mine"
        R.reload()
        R.until(lambda: R.pending())
        R.pg.evaluate("localStorage.removeItem('g5sync.code'); window.__h.reload()")
        R.gas.hold = None
        for h in R.pending():
            h.release()
        R.pump(600)
        check("停止同步：清單清空、舊回應晚到也不回填", R.ids() == [], R.ids())
        check("停止同步：提示還沒開啟同步", NO_SYNC in R.health(), R.health())
    finally:
        R.close()


# ───────────────────────── 驗收矩陣 U1–U15（假時鐘） ─────────────────────────

def u1(b):
    """改碼與 reload() 同一次執行、輪詢凍結：B 的 mine 恰 1 次。"""
    R = Row(b, "U1", {(A, P["國語"]): [item("a1")], (B, P["國語"]): [item("b1")]})
    try:
        R.wait_ids(["a1"])
        n = len(R.gas.log)
        R.pg.evaluate(f"localStorage.setItem('g5sync.code', '{B}'); window.__h.reload()")
        got = R.wait_ids(["b1"])
        R.pump()
        ms = R.mine(n)
        check("U1 改碼＋reload() 同一次執行：B 的 mine 恰 1 次（code＝B、本科前綴）", [(r["code"], r["prefix"]) for r in ms] == [(B, P["國語"])], [(r["code"], r.get("prefix")) for r in ms])
        check("U1 清單換成 B 家的題目", got == ["b1"], got)
    finally:
        R.close()


def u2(b):
    data = {(A, P["國語"]): [item("a1")], (B, P["國語"]): [item("b1")]}
    R = Row(b, "U2", data)
    try:
        R.wait_ids(["a1"])
        R.gas.hold = lambda q: q["op"] == "mine" and q.get("code") == B
        R.set_code(B)   # 直接 A→B，不先停止同步
        R.tick(2100)
        R.until(lambda: R.pending())
        check("U2 直接 A→B：B 的查詢還扣著，A 的題目就已消失", len(R.pending()) == 1 and R.ids() == [], (len(R.pending()), R.ids()))
        R.pending()[0].release({"json": {"ok": False, "err": "server"}})
        R.pump()
        check("U2 B 查詢失敗：仍空白＋讀取失敗提示", R.ids() == [] and CANT_READ in R.health(), (R.ids(), R.health()))
        R.gas.hold = None
        n = len(R.gas.log)
        R.reload()
        got = R.wait_ids(["b1"])
        check("U2 B 之後成功：顯示 B 的題目、提示清掉", got == ["b1"] and R.health() == "", (got, R.health()))
        check("U2 B 的查詢帶 B 的碼與本科前綴", [(r["code"], r["prefix"]) for r in R.mine(n)] == [(B, P["國語"])], R.mine(n))
    finally:
        R.close()
    # 回應入口也要重讀家庭碼：A 的查詢在途時換成 B，A 在 2 秒檢查之前就回來 ⇒ 不得畫出 A 家的新題
    R = Row(b, "U2[A 在途時換 B、A 先回來]", data)
    try:
        R.wait_ids(["a1"])
        R.gas.hold = hold_first(lambda q: q["op"] == "mine")
        R.gas.data[(A, P["國語"])].insert(0, item("a2"))   # A 的快照含 a2
        R.reload()
        R.until(lambda: R.pending())
        R.set_code(B)   # 不推進時鐘：2 秒檢查還沒跑
        R.pending()[0].release()
        R.pump()
        check("U2[A 在途時換 B、A 先回來] A 的回應不採用（沒有 a2）、清單改查 B", "a2" not in R.ids() and R.until(lambda: R.ids() == ["b1"]), R.ids())
    finally:
        R.close()
    # Codex 審 117bbb0①：兩次 2 秒輪詢之間 A→B→A（輪詢讀到的碼前後都是 A）：舊世代的查詢回來也不採用，改發新世代查詢
    R = Row(b, "U2[兩次輪詢之間 A→B→A、舊查詢回來]", data)
    try:
        R.wait_ids(["a1"])
        R.gas.hold = hold_first(lambda q: q["op"] == "mine")
        R.reload()
        R.until(lambda: R.pending())
        old = R.pending()[0]
        old.snap = {"ok": True, "items": [item("a9"), item("a1")], "lastFetch": 0}   # 舊快照含 a9（伺服器現況沒有）
        n = len(R.gas.log)
        R.pg.evaluate(f"localStorage.setItem('g5sync.code', '{B}'); localStorage.setItem('g5sync.code', '{A}')")   # 不推進時鐘
        old.release()
        R.pump()
        got = R.until(lambda: R.ids() == ["a1"] and R.mine(n))
        check("U2[兩次輪詢之間 A→B→A、舊查詢回來] 舊世代的清單不採用（沒有 a9）、改發一筆帶 A 的新查詢",
              got and "a9" not in R.ids() and [r["code"] for r in R.mine(n)] == [A], (R.ids(), [r["code"] for r in R.mine(n)]))
    finally:
        R.close()
    for label, js in (("null", "localStorage.removeItem('g5sync.code')"), ('""', "localStorage.setItem('g5sync.code', '')")):
        R = Row(b, f"U2[B={label}]", data)
        try:
            R.wait_ids(["a1"])
            n = len(R.gas.log)
            R.pg.evaluate(js)
            R.tick(2100)
            R.reload()
            R.reload(auto=True)
            R.pump()
            check(f"U2 B 為 {label}：清單清空、提示還沒開啟同步", R.ids() == [] and NO_SYNC in R.health(), (R.ids(), R.health()))
            check(f"U2 B 為 {label}：不發任何請求", R.gas.log[n:] == [], R.gas.log[n:])
        finally:
            R.close()


def u3(b):
    """不換家庭：扣國語查詢 → stop → 同容器掛數學並顯示 → 放行國語。"""
    R = Row(b, "U3", {(A, P["國語"]): [item("c1", "國語")], (A, P["數學"]): [item("m1", "數學", "u1")]}, mount="")
    try:
        R.gas.hold = lambda q: q["op"] == "mine" and q.get("prefix") == P["國語"]
        R.pg.evaluate(mount_js("__h1", "#box", "國語"))
        R.until(lambda: R.pending())
        R.pg.evaluate("window.__h1.stop()")
        cnt = R.count()
        check("U3 stop 後舊元件的計時器與監聽全部收掉", cnt == {"timers": [], "listeners": []}, cnt)
        R.pg.evaluate(mount_js("__h2", "#box", "數學"))
        got = R.wait_ids(["m1"])
        before = (got, R.health())
        n = len(R.gas.log)
        for h in R.pending():
            h.release()
        R.pump()
        after = (R.ids(), R.health())
        check("U3 放行已停止的國語查詢：數學卡片與提示不變", got == ["m1"] and after == before, (before, after))
        R.reload("__h1")
        R.reload("__h1", auto=True)
        R.pump()
        check("U3 已停止的舊 handle 呼叫 reload()：不發請求", R.gas.log[n:] == [], R.gas.log[n:])
    finally:
        R.close()

    # 同容器重掛、沒先呼叫 stop()：mount 自己要終結前一個 owner（計時器、監聽、在途查詢、撤回確認都收掉）
    R = Row(b, "U3[不 stop 直接重掛]", {(A, P["國語"]): [item("c1", "國語")], (A, P["數學"]): [item("m1", "數學", "u1")]}, mount="")
    try:
        R.pg.evaluate(mount_js("__h1", "#box", "國語"))
        R.wait_ids(["c1"])
        one = R.count()   # 一個元件、清單查詢已結束時的計時器與監聽
        R.gas.hold = lambda q: q["op"] == "mine" and q.get("prefix") == P["國語"]
        R.reload("__h1")
        R.until(lambda: R.pending())
        R.click_wd("c1")   # 舊元件留一個 5 秒撤回確認計時器
        R.pg.evaluate(mount_js("__h2", "#box", "數學"))
        got = R.wait_ids(["m1"])
        two = R.count()
        check("U3[不 stop 直接重掛] 重掛後只剩新元件的計時器與監聽（跟單獨掛一個時一樣多）",
              len(two["timers"]) == len(one["timers"]) and sorted(two["listeners"]) == sorted(one["listeners"]), (one, two))
        v0 = R.view()
        n = len(R.gas.log)
        for h in R.pending():
            h.release()
        R.pump()
        v1 = R.view()
        check("U3[不 stop 直接重掛] 放行舊的國語查詢：數學畫面不變", got == ["m1"] and v1 == v0, (v0, v1))
        R.reload("__h1")
        R.pump()
        check("U3[不 stop 直接重掛] 舊 handle 的 reload()：不發請求、數學畫面不變", R.gas.log[n:] == [] and R.view() == v0, (R.gas.log[n:], R.view()))
        R.tick(6000)   # 舊的 5 秒撤回確認計時器若沒清，這時會跑
        check("U3[不 stop 直接重掛] 舊確認計時器的時間過了：數學畫面不變", R.view() == v0, (v0, R.view()))
        R.tick(61000)
        check("U3[不 stop 直接重掛] 60 秒後只有數學在發請求（舊計時器都不發）",
              R.gas.log[n:] and all(r.get("prefix") == P["數學"] for r in R.gas.log[n:]), [(r["op"], r.get("prefix")) for r in R.gas.log[n:]])
    finally:
        R.close()


def u4(b):
    """舊 A 一直不結束（abort 無效）：撤回成功後，期限前連做三次 reload(true)，每次都真的發出並更新。"""
    R = Row(b, "U4", {(A, P["國語"]): [item("x", text="要撤回的"), item("y", text="看狀態的")]}, noabort=True)
    try:
        R.wait_ids(["x", "y"])
        R.gas.hold = hold_first(lambda q: q["op"] == "mine")
        R.reload()
        R.until(lambda: R.pending())
        old = R.pending()[0]
        R.withdraw("x")
        got = R.wait_ids(["y"])
        check("U4 舊查詢 A 扣著不放：撤回 x 成功後新查詢完成、只剩 y", got == ["y"], got)
        rows = R.gas.data[(A, P["國語"])]
        steps = [
            ("y 變製作中", lambda: rows[1].update(status="fetched"), lambda: (R.card("y") or "").find("製作中") >= 0),
            ("y 做好了（附本站連結）", lambda: rows[1].update(status="done", url="https://windsorya.github.io/g5-chinese-review/#c/k9"),
             lambda: R.pg.locator('#box .g5u-card[data-id="y"] a[href="https://windsorya.github.io/g5-chinese-review/#c/k9"]').count() == 1),
            ("多一題 z", lambda: rows.insert(0, item("z")), lambda: R.ids() == ["z", "y"]),
        ]
        for k, (what, change, seen) in enumerate(steps, 1):
            change()
            n = len(R.gas.log)
            R.reload(auto=True)
            ok = R.until(seen)
            ms = R.mine(n)
            check(f"U4 第 {k} 次 reload(true)：恰發 1 筆（code＝A、本科前綴）", [(r["code"], r["prefix"]) for r in ms] == [(A, P["國語"])], [(r["code"], r.get("prefix")) for r in ms])
            check(f"U4 第 {k} 次：{what}", ok, (R.ids(), R.card("y")))
        old.release()
        R.pump()
        check("U4 舊 A 最後才回來（快照含 x）：x 不回來、最新狀態不被蓋掉", R.ids() == ["z", "y"], R.ids())
    finally:
        R.close()


def u5(b):
    """連續 reload 只發一筆；該筆失敗釋放後可重查。"""
    R = Row(b, "U5", {(A, P["國語"]): [item("x")]})
    try:
        R.wait_ids(["x"])
        R.gas.hold = lambda q: q["op"] == "mine"
        n = len(R.gas.log)
        R.pg.evaluate("window.__h.reload(); window.__h.reload(); window.__h.reload(true); window.__h.reload()")
        R.pump(400)
        check("U5 連續 4 次 reload（手動＋自動）只發 1 筆", len(R.mine(n)) == 1, len(R.mine(n)))
        for h in R.pending():
            h.release("abort")
        R.pump()
        check("U5 那筆失敗：提示讀不到、清單保留", CANT_READ in R.health() and R.ids() == ["x"], (R.health(), R.ids()))
        R.gas.hold = None
        R.gas.data[(A, P["國語"])].insert(0, item("y"))
        n = len(R.gas.log)
        R.reload()
        got = R.wait_ids(["y", "x"])
        check("U5 失敗釋放後可重查：恰 1 筆、清單更新、提示清掉", len(R.mine(n)) == 1 and got == ["y", "x"] and R.health() == "", (len(R.mine(n)), got, R.health()))
    finally:
        R.close()


def u6(b):
    """扣住含 x 的舊 A → 撤回 x 成功（刷新 B 也扣著）→ 先斷言 x 已消失 → 才放行 A；再測 B 失敗、B 仍含 x。"""
    for variant in ("B失敗", "B仍含x"):
        R = Row(b, f"U6[{variant}]", {(A, P["國語"]): [item("x"), item("y")]})
        try:
            R.wait_ids(["x", "y"])
            R.gas.hold = lambda q: q["op"] == "mine"
            R.reload()
            R.until(lambda: R.pending())
            ha = R.pending()[0]
            R.withdraw("x")
            R.until(lambda: len(R.pending()) == 2)
            check(f"U6[{variant}] 撤回成功當下 x 就消失（舊 A、刷新 B 都還扣著）", len(R.pending()) == 2 and R.ids() == ["y"], (len(R.pending()), R.ids()))
            ha.release()
            R.pump()
            check(f"U6[{variant}] 放行舊 A（快照含 x）：x 不回來", R.ids() == ["y"], R.ids())
            hb = R.pending()[0] if R.pending() else None
            if variant == "B失敗":
                hb and hb.release({"json": {"ok": False, "err": "server"}})
                R.pump()
                check("U6[B失敗] 刷新 B 失敗：x 仍不在、提示讀不到", R.ids() == ["y"] and CANT_READ in R.health(), (R.ids(), R.health()))
            else:
                hb and hb.release({"json": {"ok": True, "items": [item("x"), item("y", status="fetched")], "lastFetch": 0}})
                R.pump()
                check("U6[B仍含x] 刷新 B 成功但仍含 x（伺服器慢一步）：x 不回來、y 照樣更新", R.ids() == ["y"] and "製作中" in (R.card("y") or ""), (R.ids(), R.card("y")))
        finally:
            R.close()

    # Codex 審 117bbb0③：撤回沒成功（done／not-found／其他失敗／網路中斷）結束時，也要作廢撤回前發出的舊查詢並重查一次
    # （impl 文件第 24 行的承諾）；舊查詢晚到不得蓋回撤回前的狀態
    for end, spec in (("done", {"json": {"ok": False, "err": "done"}}), ("not-found", {"json": {"ok": False, "err": "not-found"}}),
                      ("失敗", {"json": {"ok": False, "err": "server"}}), ("中斷", "abort")):
        R = Row(b, f"U6[撤回{end}]", {(A, P["國語"]): [item("x"), item("y")]})
        try:
            R.wait_ids(["x", "y"])
            R.gas.hold = hold_first(lambda q: q["op"] == "mine")
            R.reload()
            R.until(lambda: R.pending())
            old = R.pending()[0]   # 撤回前的舊查詢：快照 x、y（x 待取回）
            R.gas.once.append((lambda q: q["op"] == "withdraw", spec))
            rows = R.gas.data[(A, P["國語"])]
            rows.insert(0, item("z"))   # 伺服器現況：多了 z；done 變體 x 已做好
            if end == "done":
                rows[1]["status"] = "done"
            n = len(R.gas.log)
            R.withdraw("x")
            R.until(lambda: R.wd(n))
            got = R.wait_ids(["z", "x", "y"])
            ms = R.mine(n)
            check(f"U6[撤回{end}] 撤回結束後重查一次（舊查詢還扣著也照發），清單照伺服器現況", len(ms) == 1 and got == ["z", "x", "y"], (len(ms), got))
            old.release()
            R.pump()
            card = R.card("x") or ""
            ok_x = ("做好了" in card and R.pg.locator('#box .g5u-card[data-id="x"] button[data-wd]').count() == 0) if end == "done" else True
            check(f"U6[撤回{end}] 撤回前的舊查詢晚到：不採用（z 還在{'、x 顯示做好了且不能撤回' if end == 'done' else ''}）", R.ids() == ["z", "x", "y"] and ok_x, (R.ids(), card))
        finally:
            R.close()


def u7(b):
    data = {(A, P["國語"]): [item("x"), item("y"), item("w")]}
    R = Row(b, "U7[中斷]", data)
    try:
        R.wait_ids(["x", "y", "w"])
        R.gas.once.append((lambda q: q["op"] == "withdraw", "abort"))
        R.withdraw("x")
        R.until(lambda: UNSURE in R.wmsg())
        check("U7[中斷] 撤回請求被中斷：x 留著、提示撤回結果還沒確認", "x" in R.ids() and UNSURE in R.wmsg(), (R.ids(), R.wmsg()))
        check("U7[中斷] 撤回鈕恢復可按", R.wd_enabled(), R.wd_states())
        R.tick(61000)
        check("U7[中斷] 不自動重送撤回（全程 1 筆 withdraw）", len(R.wd()) == 1, R.wd())
    finally:
        R.close()

    R = Row(b, "U7[永不返回]", data)
    try:
        R.wait_ids(["x", "y", "w"])
        R.gas.hold = lambda q: q["op"] == "withdraw"
        R.withdraw("x")
        R.until(lambda: R.pending())
        hx = R.pending()[0]
        R.tick(90500)
        check("U7[永不返回] 撤回到期限：提示還沒確認、撤回鈕恢復、x 留著", UNSURE in R.wmsg() and R.wd_enabled() and "x" in R.ids(), (R.wmsg(), R.wd_states(), R.ids()))
        R.withdraw("y")
        R.until(lambda: len(R.pending()) == 2)
        hy = [h for h in R.pending() if h is not hx][0]
        lock = (R.wmsg(), R.wd_states())
        hx.release()   # x 的撤回其實成功了，但已過期限：遲到的成功不冒出來
        R.pump()
        check("U7[永不返回] x 遲到的成功：不冒成功、不解除 y 的撤回鎖、x 不被本機移除",
              (R.wmsg(), R.wd_states()) == lock and "撤回中" in R.wmsg() and all(R.wd_states()) and "x" in R.ids(), (lock, R.wmsg(), R.wd_states(), R.ids()))
        R.tick(90500)
        check("U7[永不返回] y 也到期限：提示還沒確認、撤回鈕恢復", UNSURE in R.wmsg() and R.wd_enabled(), (R.wmsg(), R.wd_states()))
        R.withdraw("w")
        R.until(lambda: len(R.pending()) == 2)
        hw = [h for h in R.pending() if h is not hy][0]
        lock = (R.wmsg(), R.wd_states())
        hy.release({"json": {"ok": False, "err": "done"}})
        R.pump()
        check("U7[永不返回] y 遲到的 done：不改提示、不解除 w 的撤回鎖", (R.wmsg(), R.wd_states()) == lock and "撤回中" in R.wmsg(), (lock, R.wmsg(), R.wd_states()))
        R.tick(90500)
        hw.release({"json": {"ok": False, "err": "not-found"}})
        R.pump()
        check("U7[永不返回] w 遲到的 not-found：提示仍是還沒確認、撤回鈕可按", UNSURE in R.wmsg() and R.wd_enabled(), (R.wmsg(), R.wd_states()))
        check("U7[永不返回] 不自動重送撤回（三題各 1 筆、依序 x、y、w，都帶 A 的碼）", [(w["code"], w["id"]) for w in R.wd()] == [(A, "x"), (A, "y"), (A, "w")], [(w["code"], w["id"]) for w in R.wd()])
    finally:
        R.close()


def u8(b):
    data = {(A, P["國語"]): [item("x"), item("y")]}
    R = Row(b, "U8[過期限、計時器還沒跑]", data)
    try:
        R.wait_ids(["x", "y"])
        R.gas.hold = lambda q: q["op"] == "mine"
        R.gas.data[(A, P["國語"])].insert(0, item("z"))   # A 的快照含 z
        R.reload()
        R.until(lambda: R.pending())
        R.pg.clock.set_system_time(T0 + 1 + 91)   # Date.now() 已過期限，但期限計時器還沒執行
        R.pending()[0].release()
        R.pump()
        check("U8 時間已過期限、計時器還沒跑時放行 A：A 不採用（沒有 z）、提示讀不到", R.ids() == ["x", "y"] and CANT_READ in R.health(), (R.ids(), R.health()))
    finally:
        R.close()

    # 設計者 (c)：期限在回應、發送、回前景時都要核對（背景分頁、睡眠時計時器會被延後）
    R = Row(b, "U8[發送前核對期限]", data)
    try:
        R.wait_ids(["x", "y"])
        R.gas.hold = lambda q: q["op"] == "mine"
        n = len(R.gas.log)
        R.reload()
        R.until(lambda: R.pending())
        R.pg.clock.set_system_time(T0 + 1 + 91)   # 期限已過、A 的期限計時器還沒跑、A 也還沒回來（背景分頁計時器被延後）
        R.tick(60500)   # 只讓 60 秒自動重查先跑（A 的期限計時器排在 90 秒，不會跑）：這條路不經 reload() 的期限核對
        R.until(lambda: len(R.pending()) == 2)
        check("U8 發送前核對期限：A 已過期但期限計時器還沒跑，60 秒自動重查照樣發新查詢", len(R.mine(n)) == 2, len(R.mine(n)))
    finally:
        R.close()

    R = Row(b, "U8[回前景核對期限]", data)
    try:
        R.wait_ids(["x", "y"])
        R.gas.hold = lambda q: q["op"] == "mine"
        R.reload()
        R.until(lambda: R.pending())
        R.pg.clock.set_system_time(T0 + 1 + 91)
        R.pg.evaluate("document.dispatchEvent(new Event('visibilitychange'))")   # 切回分頁（visibilityState 仍是 visible）
        R.pump()
        check("U8 回前景核對期限：計時器還沒跑也照期限釋放、提示讀不到、清單保留", CANT_READ in R.health() and R.ids() == ["x", "y"], (R.health(), R.ids()))
    finally:
        R.close()

    R = Row(b, "U8[abort 無效]", data, noabort=True)
    try:
        R.wait_ids(["x", "y"])
        R.gas.hold = lambda q: q["op"] == "mine"
        rows = R.gas.data[(A, P["國語"])]
        rows.insert(0, item("q"))   # A 的快照含 q
        n = len(R.gas.log)
        R.reload()
        R.until(lambda: R.pending())
        ha = R.pending()[0]
        R.tick(60500)
        check("U8 60 秒自動重查時 A 還在途：不疊發", len(R.mine(n)) == 1, len(R.mine(n)))
        R.tick(30000)
        check("U8 90 秒期限到：提示讀不到、清單保留", CANT_READ in R.health() and R.ids() == ["x", "y"], (R.health(), R.ids()))
        del rows[0]
        rows.insert(0, item("z"))
        R.reload()
        R.until(lambda: len(R.pending()) == 2)
        check("U8 abort 無效（A 仍在網路上）：期限後仍能發新查詢", len(R.mine(n)) == 2, len(R.mine(n)))
        [h for h in R.pending() if h is not ha][0].release()
        got = R.wait_ids(["z", "x", "y"])
        ha.release()
        R.pump()
        check("U8 新查詢採用；遲到的 A（含 q）不採用", got == ["z", "x", "y"] and R.ids() == ["z", "x", "y"] and R.health() == "", (got, R.ids(), R.health()))
    finally:
        R.close()


def u9(b):
    """完整 stop：分別扣住 mine、撤回、縮圖、upload → stop 兩次 → 同碼重掛、填新草稿 → 放行舊操作與確認計時器。"""
    for kind in ("mine", "撤回", "縮圖", "upload"):
        R = Row(b, f"U9[{kind}]", {(A, P["國語"]): [item("x"), item("y")]}, mount=mount_js("__h1", "#box", "國語", EP_OLD))
        try:
            R.wait_ids(["x", "y"])
            if kind == "mine":
                R.gas.hold = lambda q: q["op"] == "mine"
                R.reload("__h1")
                R.until(lambda: R.pending())
                R.click_wd("y")   # 舊元件留一個 5 秒撤回確認計時器
            elif kind == "撤回":
                R.gas.hold = lambda q: q["op"] == "withdraw"
                R.withdraw("x")
                R.until(lambda: R.pending())
            elif kind == "縮圖":
                R.pg.evaluate("window.__imgHold = true")
                R.pg.set_input_files("#box .g5u-file", PICS[:2])
                R.pg.fill("#box .g5u-note", "舊草稿")
                R.pg.click("#box .g5u-send")
                R.until(lambda: R.pg.evaluate("window.__imgQueue.length") >= 1)
                R.click_wd("y")
            else:
                R.gas.hold = lambda q: q["op"] == "upload"
                R.pg.set_input_files("#box .g5u-file", PICS[:2])
                R.pg.fill("#box .g5u-note", "舊草稿")
                R.pg.click("#box .g5u-send")
                R.until(lambda: R.pending())
                R.click_wd("y")
            held = R.pending()
            R.pg.evaluate("window.__h1.stop(); window.__h1.stop()")
            cnt = R.count()
            check(f"U9[{kind}] stop 兩次後：舊元件的計時器（含確認計時器、期限）與監聽全部收掉", cnt == {"timers": [], "listeners": []}, cnt)
            R.gas.hold = None
            R.gas.data[(A, P["國語"])].insert(0, item("z"))   # 新畫面與任何舊快照都不同
            old_at_stop = [(r["op"], r.get("id")) for r in R.gas.log if r["_ep"] == "OLD"]   # 舊元件打的全是 OLD endpoint
            R.pg.evaluate(mount_js("__h2", "#box", "國語", EP_NEW))
            R.wait_ids(["z", "x", "y"])
            R.pg.select_option("#box .g5u-unit", "L2")
            R.pg.fill("#box .g5u-note", "新草稿")
            R.pg.set_input_files("#box .g5u-file", PICS[:1])
            v0 = R.view()
            if kind == "縮圖":
                R.pg.evaluate("window.__imgHold = false; window.__imgRelease()")
            for h in held:
                h.release()
            R.pump()
            v1 = R.view()
            check(f"U9[{kind}] 放行舊操作：新畫面與草稿不變", v1 == v0, (v0, v1))
            R.tick(6000)   # 舊的 5 秒確認計時器若沒清，這時會跑
            v2 = R.view()
            check(f"U9[{kind}] 舊確認計時器的時間過了：新畫面與草稿不變", v2 == v0, (v0, v2))
            n_new = len(R.mine(ep="NEW"))
            R.tick(61000)  # 舊的 2 秒家庭碼檢查、60 秒自動重查若沒清，這時會發請求
            old_now = [(r["op"], r.get("id")) for r in R.gas.log if r["_ep"] == "OLD"]
            check(f"U9[{kind}] 舊元件零新增請求（放行舊操作後、含 60 秒自動重查與 2 秒家庭碼檢查）", old_now == old_at_stop, (old_at_stop, old_now))
            check(f"U9[{kind}] 新草稿不變、新元件照常運作（60 秒自動重查打新 endpoint）", R.view()["draft"] == v0["draft"] and len(R.mine(ep="NEW")) > n_new, (R.view()["draft"], n_new, len(R.mine(ep="NEW"))))
        finally:
            R.close()


def u10(b):
    data = {(A, P["國語"]): [item("x"), item("w")], (B, P["國語"]): [item("y")]}
    for label, late in (("A成功", None), ("A失敗", {"json": {"ok": False, "err": "done"}})):
        R = Row(b, f"U10[{label}]", data)
        try:
            R.wait_ids(["x", "w"])
            R.gas.hold = lambda q: q["op"] == "withdraw"
            R.withdraw("x")
            R.until(lambda: R.pending())
            hx = R.pending()[0]
            R.set_code(B)
            R.tick(2100)
            R.wait_ids(["y"])
            R.withdraw("y")
            R.until(lambda: len(R.pending()) == 2)
            hy = [h for h in R.pending() if h is not hx][0]
            check(f"U10[{label}] 兩筆撤回各帶自己家庭的碼", (hx.req["code"], hx.req["id"], hy.req["code"], hy.req["id"]) == (A, "x", B, "y"), (hx.req, hy.req))
            v0 = (R.wmsg(), R.wd_states(), R.ids())
            hx.release(late)
            R.pump()
            v1 = (R.wmsg(), R.wd_states(), R.ids())
            check(f"U10[{label}] 放行 A 的撤回：不顯示 A 的訊息、不解除 y 的撤回鎖", v1 == v0 and "撤回中" in v1[0] and v1[1] and all(v1[1]), (v0, v1))
            hy.release()
            R.until(lambda: "撤回了" in R.wmsg())
            check(f"U10[{label}] y 自己的撤回照常完成", R.ids() == [] and "撤回了" in R.wmsg(), (R.ids(), R.wmsg()))
        finally:
            R.close()

    R = Row(b, "U10[A→B→A]", data)
    try:
        R.wait_ids(["x", "w"])
        R.gas.hold = lambda q: q["op"] == "withdraw"
        R.withdraw("x")
        R.until(lambda: R.pending())
        R.set_code(B)
        R.tick(2100)
        R.wait_ids(["y"])
        R.set_code(A)
        R.tick(2100)
        R.wait_ids(["x", "w"])
        R.pending()[0].release()   # 伺服器此刻才處理：x 撤回、回 ok
        R.pump()
        check("U10[A→B→A] 舊撤回的成功晚到：不沿用（不顯示撤回了、x 不被本機移除、撤回鈕可按）",
              "撤回了" not in R.wmsg() and R.ids() == ["x", "w"] and R.wd_enabled(), (R.wmsg(), R.ids(), R.wd_states()))
    finally:
        R.close()

    # Codex 審 117bbb0①：兩次 2 秒輪詢之間 A→B→A（輪詢讀到的碼前後都是 A）：家庭世代仍要換，舊撤回的成功不沿用。
    # 放行分兩種時機：下一次輪詢之前（回應入口要擋）、下一次輪詢之後（輪詢本身要認出世代換了）
    for when in ("輪詢前放行", "輪詢後放行"):
        R = Row(b, f"U10[兩次輪詢之間 A→B→A・{when}]", data)
        try:
            R.wait_ids(["x", "w"])
            R.gas.hold = lambda q: q["op"] == "withdraw"
            R.withdraw("x")
            R.until(lambda: R.pending())
            n = len(R.gas.log)
            R.pg.evaluate(f"localStorage.setItem('g5sync.code', '{B}'); localStorage.setItem('g5sync.code', '{A}')")   # 不推進時鐘
            if when == "輪詢後放行":
                R.tick(2100)
                check(f"U10[兩次輪詢之間 A→B→A・{when}] 輪詢認出換了世代：撤回中提示收掉、撤回鈕恢復", "撤回中" not in R.wmsg() and R.until(R.wd_enabled), (R.wmsg(), R.wd_states()))
            R.gas.hold = None
            R.pending()[0].release()   # 伺服器此刻才處理：x 撤回、回 ok
            R.pump()
            # 輪詢前放行：回應入口認出換世代 ⇒ 不採用、改重查（伺服器已撤回 x ⇒ 只剩 w）
            # 輪詢後放行：輪詢當下已作廢並重查（那時伺服器還沒撤回 ⇒ x、w）；舊撤回晚到不採用，x 不被本機移除
            want = ["w"] if when == "輪詢前放行" else ["x", "w"]
            got = R.until(lambda: R.ids() == want)
            check(f"U10[兩次輪詢之間 A→B→A・{when}] 舊撤回的成功晚到：不沿用（不顯示撤回了、撤回鈕可按）",
                  "撤回了" not in R.wmsg() and R.wd_enabled(), (R.wmsg(), R.ids(), R.wd_states()))
            check(f"U10[兩次輪詢之間 A→B→A・{when}] 換世代後清單照伺服器現況重查一次（帶 A 的碼）", got and [r["code"] for r in R.mine(n)] == [A], (R.ids(), [r["code"] for r in R.mine(n)]))
        finally:
            R.close()

    # 別的分頁 A→B→A：本頁讀到的碼始終是 A，只有 storage 事件的新舊值看得出換過 ⇒ 也要換世代
    R = Row(b, "U10[別的分頁 A→B→A（storage 事件）]", data)
    try:
        R.wait_ids(["x", "w"])
        R.gas.hold = lambda q: q["op"] == "withdraw"
        R.withdraw("x")
        R.until(lambda: R.pending())
        R.pg.evaluate(f"""() => {{
          window.dispatchEvent(new StorageEvent('storage', {{ key: 'g5sync.code', oldValue: '{A}', newValue: '{B}' }}));
          window.dispatchEvent(new StorageEvent('storage', {{ key: 'g5sync.code', oldValue: '{B}', newValue: '{A}' }}));
        }}""")
        R.gas.hold = None
        R.pending()[0].release()
        R.pump()
        R.until(lambda: R.ids() == ["w"])
        check("U10[別的分頁 A→B→A（storage 事件）] 舊撤回的成功晚到：不沿用（不顯示撤回了、撤回鈕可按）", "撤回了" not in R.wmsg() and R.wd_enabled(), (R.wmsg(), R.ids(), R.wd_states()))
    finally:
        R.close()

    # 回應入口也要重讀家庭碼：換成 B 之後、2 秒檢查之前，A 的撤回成功就回來 ⇒ 不顯示 A 的結果
    R = Row(b, "U10[換碼後 A 的撤回立刻回來]", data)
    try:
        R.wait_ids(["x", "w"])
        R.gas.hold = lambda q: q["op"] == "withdraw"
        R.withdraw("x")
        R.until(lambda: R.pending())
        R.set_code(B)   # 不推進時鐘
        R.pending()[0].release()
        R.pump()
        got = R.until(lambda: R.ids() == ["y"])
        check("U10[換碼後 A 的撤回立刻回來] 不顯示 A 的撤回結果、清單改成 B、撤回鈕可按", "撤回了" not in R.wmsg() and got and R.wd_enabled(), (R.wmsg(), R.ids(), R.wd_states()))
    finally:
        R.close()

    R = Row(b, "U10[換碼後立刻點舊確認]", data)
    try:
        R.wait_ids(["x", "w"])
        R.click_wd("x")   # 第一次：變「確定撤回？」
        n = len(R.gas.log)
        R.pg.evaluate(f"""localStorage.setItem('g5sync.code', '{B}'); document.querySelector('#box .g5u-card[data-id="x"] button[data-wd]').click();""")
        R.pump()
        check("U10[換碼後立刻點舊確認] 不送撤回（不拿 B 的碼撤 A 的題，也不沿用 A 的確認）", R.wd(n) == [], R.wd(n))
        R.tick(2100)
        got = R.wait_ids(["y"])
        check("U10[換碼後立刻點舊確認] 之後清單換成 B、仍沒有撤回請求", got == ["y"] and R.wd(n) == [], (got, R.wd(n)))
    finally:
        R.close()


def u11(b):
    data = {(A, P["國語"]): [item("x")], (B, P["國語"]): [item("y")]}
    R = Row(b, "U11[upload 扣住]", data)
    try:
        R.wait_ids(["x"])
        R.gas.hold = lambda q: q["op"] == "upload"
        R.pg.set_input_files("#box .g5u-file", PICS[:2])
        R.pg.fill("#box .g5u-note", "A 的說明")
        R.pg.click("#box .g5u-send")
        R.until(lambda: R.pending())
        R.set_code(B)
        R.tick(2100)
        R.wait_ids(["y"])
        check("U11[upload 扣住] 換家庭後輸入解鎖（可以填 B 的草稿）", not any(R.locked()), R.locked())
        R.pg.evaluate("document.querySelector('#box .g5u-note').value = 'B 的草稿'")
        R.pending()[0].release()
        R.pump()
        R.tick(2100)
        ups = R.up()
        check("U11[upload 扣住] 第二張不送、也不改送 B（全程只有第一張、帶 A 的碼）", [u["code"] for u in ups] == [A], [(u["code"], u["note"]) for u in ups])
        check("U11[upload 扣住] B 的草稿沒被清掉", R.pg.input_value("#box .g5u-note") == "B 的草稿" and R.files() == 2, (R.pg.input_value("#box .g5u-note"), R.files()))
        out = R.out()
        check("U11[upload 扣住] 提示後面沒送出、不宣稱取消成功或全部送出", "沒有送出" in out and "取消" not in out and "送出了" not in out, out)
        # 審 117bbb0②：第一張已送出去、還沒回來 ⇒ 不能說成已送出，也不能說「照片沒有送出」（伺服器可能已收到）
        check("U11[upload 扣住] 在途那張講還沒收到結果，不說已確認送出、也不說照片全部沒送出（不叫家長整批重送）",
              "還沒收到結果" in out and "已確認送出" not in out and "確認後再按一次送出" not in out, out)
    finally:
        R.close()

    R = Row(b, "U11[縮圖扣住]", data)
    try:
        R.wait_ids(["x"])
        R.pg.evaluate("window.__imgHold = true")
        R.pg.set_input_files("#box .g5u-file", PICS[:2])
        R.pg.click("#box .g5u-send")
        R.until(lambda: R.pg.evaluate("window.__imgQueue.length") >= 1)
        R.set_code(B)
        R.tick(2100)
        R.wait_ids(["y"])
        R.pg.evaluate("window.__imgHold = false; window.__imgRelease()")
        R.pump()
        R.pg.evaluate("window.__imgRelease()")
        R.tick(2100)
        check("U11[縮圖扣住] 縮圖途中換碼：零 upload 請求", R.up() == [], [(u["code"], u["note"]) for u in R.up()])
        out = R.out()
        check("U11[縮圖扣住] 提示照片沒送出、不宣稱取消成功或已送出", "沒有送出" in out and "取消" not in out and "送出了" not in out, out)
        check("U11[縮圖扣住] 照片還在、輸入可用", R.files() == 2 and not any(R.locked()), (R.files(), R.locked()))
    finally:
        R.close()

    # Codex 審 117bbb0①：扣住第一張上傳，兩次輪詢之間 A→B→A 再放行 ⇒ 第二張不送、不清草稿（舊碼：第二張照送、最後清空草稿）
    R = Row(b, "U11[兩次輪詢之間 A→B→A]", data)
    try:
        R.wait_ids(["x"])
        R.gas.hold = hold_first(lambda q: q["op"] == "upload")
        R.pg.set_input_files("#box .g5u-file", PICS[:2])
        R.pg.fill("#box .g5u-note", "A 的說明")
        R.pg.click("#box .g5u-send")
        R.until(lambda: R.pending())
        R.pg.evaluate(f"localStorage.setItem('g5sync.code', '{B}'); localStorage.setItem('g5sync.code', '{A}')")   # 不推進時鐘
        R.pending()[0].release()
        R.pump(800)
        ups = R.up()
        check("U11[兩次輪詢之間 A→B→A] 第二張不送（全程只有第一張）", len(ups) == 1, [(u["code"], u["note"]) for u in ups])
        check("U11[兩次輪詢之間 A→B→A] 草稿沒被清掉、輸入解鎖、提示後面沒送出",
              R.pg.input_value("#box .g5u-note") == "A 的說明" and R.files() == 2 and not any(R.locked()) and "沒有送出" in R.out() and "送出了" not in R.out(),
              (R.pg.input_value("#box .g5u-note"), R.files(), R.locked(), R.out()))
    finally:
        R.close()

    # Codex 審 117bbb0②：換家庭時的提示只算「已確認送出」的張數。第一張回 no-family（或成功），扣住第二張縮圖，換家庭＋reload()
    for first, label in (({"json": {"ok": False, "err": "no-family"}}, "第一張失敗"), (None, "第一張成功")):
        R = Row(b, f"U11[{label}、第二張縮圖時換家庭]", data)
        try:
            R.wait_ids(["x"])
            R.gas.hold = hold_first(lambda q: q["op"] == "upload")
            R.pg.set_input_files("#box .g5u-file", PICS[:2])
            R.pg.click("#box .g5u-send")
            R.until(lambda: R.pending())
            R.pg.evaluate("window.__imgHold = true")   # 第二張的縮圖扣住
            R.pending()[0].release(first)
            R.until(lambda: R.pg.evaluate("window.__imgQueue.length") >= 1)
            R.pg.evaluate(f"localStorage.setItem('g5sync.code', '{B}'); window.__h.reload()")
            R.pump()
            out = R.out()
            if label == "第一張失敗":
                check(f"U11[{label}、第二張縮圖時換家庭] 成功 0 張：不說已送出、不說 1 張，提示照片沒有送出",
                      "已送出" not in out and "已確認送出" not in out and "1 張" not in out and "沒有送出" in out, out)
            else:
                check(f"U11[{label}、第二張縮圖時換家庭] 成功 1 張：提示已確認送出的 1 張不受影響、後面沒有送出",
                      "已確認送出的 1 張" in out and "沒有送出" in out, out)
            R.pg.evaluate("window.__imgHold = false; window.__imgRelease()")
            R.pump()
            check(f"U11[{label}、第二張縮圖時換家庭] 第二張不送（全程只有第一張）", len(R.up()) == 1, len(R.up()))
        finally:
            R.close()

    # 送出前也要重讀家庭碼：縮圖途中換碼、2 秒檢查還沒跑就縮好 ⇒ 仍然零 upload
    R = Row(b, "U11[換碼後立刻縮好]", data)
    try:
        R.wait_ids(["x"])
        R.pg.evaluate("window.__imgHold = true")
        R.pg.set_input_files("#box .g5u-file", PICS[:2])
        R.pg.click("#box .g5u-send")
        R.until(lambda: R.pg.evaluate("window.__imgQueue.length") >= 1)
        R.pg.evaluate(f"localStorage.setItem('g5sync.code', '{B}'); window.__imgHold = false; window.__imgRelease()")   # 同一次執行，不推進時鐘
        R.pump()
        R.pg.evaluate("window.__imgRelease()")
        R.pump()
        check("U11[換碼後立刻縮好] 2 秒檢查前縮好：零 upload 請求（不送 A、也不改送 B）", R.up() == [], [(u["code"], u["note"]) for u in R.up()])
        check("U11[換碼後立刻縮好] 提示照片沒送出、輸入解鎖", "沒有送出" in R.out() and not any(R.locked()), (R.out(), R.locked()))
    finally:
        R.close()


def u12(b):
    body = '<div id="box1"></div><div id="box2"></div>'
    R = Row(b, "U12[國語＋數學]", {(A, P["國語"]): [item("c1", "國語")], (A, P["數學"]): [item("m1", "數學", "u1")]}, body=body, mount="")
    try:
        R.gas.hold = lambda q: q["op"] == "mine" and q.get("prefix") == P["國語"]
        R.pg.evaluate(mount_js("__h1", "#box1", "國語") + mount_js("__h2", "#box2", "數學"))
        R.until(lambda: R.pending())
        R.wait_ids(["m1"], "#box2")
        R.pg.evaluate("window.__h1.stop()")
        R.gas.data[(A, P["數學"])].insert(0, item("m2", "數學", "u1"))
        n = len(R.gas.log)
        R.reload("__h2")
        got = R.wait_ids(["m2", "m1"], "#box2")
        check("U12[國語＋數學] 國語 stop 後數學照常刷新（只發數學的查詢）", got == ["m2", "m1"] and [r["prefix"] for r in R.mine(n)] == [P["數學"]], (got, R.mine(n)))
        v1, v2 = R.view("#box1"), R.view("#box2")
        for h in R.pending():
            h.release()
        R.pump()
        check("U12[國語＋數學] 放行已停止國語的舊查詢：兩個容器都不被改", (R.view("#box1"), R.view("#box2")) == (v1, v2), (v1, R.view("#box1"), v2, R.view("#box2")))
        R.gas.data[(B, P["數學"])] = [item("bm1", "數學", "u1")]
        n = len(R.gas.log)
        R.set_code(B)
        R.tick(2100)
        got = R.wait_ids(["bm1"], "#box2")
        ms = R.mine(n)
        check("U12[國語＋數學] 換家庭：數學照常跟上、已停止的國語不發請求", got == ["bm1"] and [(r["code"], r["prefix"]) for r in ms] == [(B, P["數學"])], (got, [(r["code"], r.get("prefix")) for r in ms]))
    finally:
        R.close()

    R = Row(b, "U12[同科雙容器]", {(A, P["國語"]): [item("c1"), item("c2")]}, body=body, mount="")
    try:
        R.gas.hold = hold_first(lambda q: q["op"] == "mine")   # 只扣 #box1 的第一筆
        R.pg.evaluate(mount_js("__h1", "#box1", "國語"))
        R.until(lambda: R.pending())
        R.pg.evaluate(mount_js("__h2", "#box2", "國語"))
        R.wait_ids(["c1", "c2"], "#box2")
        R.pg.evaluate("window.__h1.stop()")
        R.gas.data[(A, P["國語"])].insert(0, item("c3"))
        R.reload("__h2")
        got = R.wait_ids(["c3", "c1", "c2"], "#box2")
        check("U12[同科雙容器] 一個 stop 後另一個照常刷新", got == ["c3", "c1", "c2"], got)
        v1, v2 = R.view("#box1"), R.view("#box2")
        for h in R.pending():
            h.release()
        R.pump()
        check("U12[同科雙容器] 放行已停止那個的舊查詢：兩個容器都不被改", (R.view("#box1"), R.view("#box2")) == (v1, v2), (v1, R.view("#box1"), v2, R.view("#box2")))
        R.gas.data[(A, P["國語"])].insert(0, item("c4"))
        n = len(R.gas.log)
        R.tick(61000)
        got = R.wait_ids(["c4", "c3", "c1", "c2"], "#box2")
        check("U12[同科雙容器] 60 秒自動重查：只有沒停的那個發、而且照常更新", got == ["c4", "c3", "c1", "c2"] and len(R.mine(n)) == 1, (got, len(R.mine(n))))
    finally:
        R.close()


def u13(b):
    """舊 A 收尾（失敗／逾時）不能清掉新 B 的在途標記；B 完成後可再查。abort 無效（A 一直在網路上）。"""
    for label in ("A失敗", "A逾時"):
        R = Row(b, f"U13[{label}]", {(A, P["國語"]): [item("x"), item("y")]}, noabort=True)
        try:
            R.wait_ids(["x", "y"])
            R.gas.hold = lambda q: q["op"] == "mine"
            R.reload()
            R.until(lambda: R.pending())
            ha = R.pending()[0]
            R.tick(50000)
            R.withdraw("x")
            R.until(lambda: len(R.pending()) == 2)
            hb = [h for h in R.pending() if h is not ha][0]
            if label == "A失敗":
                ha.release("abort")
                R.pump()
            else:
                R.tick(41000)   # A 的 90 秒期限過了（B 是第 50 秒發的，還沒到期）
            n = len(R.gas.log)
            R.reload(auto=True)
            R.reload(auto=True)
            R.pump()
            check(f"U13[{label}] 舊 A 收尾後 B 還在途：reload(true) 不多發", R.mine(n) == [], len(R.mine(n)))
            hb.release()
            R.wait_ids(["y"])
            n = len(R.gas.log)
            R.reload(auto=True)
            R.until(lambda: R.mine(n))
            R.pump()
            check(f"U13[{label}] B 完成後可再查（恰 1 筆）", len(R.mine(n)) == 1, len(R.mine(n)))
        finally:
            R.close()


def u14(b):
    R = Row(b, "U14", {(A, P["國語"]): [item("x"), item("y"), item("z")]})
    try:
        R.wait_ids(["x", "y", "z"])
        R.gas.hold = lambda q: q["op"] == "withdraw"
        R.withdraw("x")
        R.until(lambda: R.pending())
        hx = R.pending()[0]
        check("U14 撤回 x 途中：所有撤回鈕都停用", R.wd_states() and all(R.wd_states()), R.wd_states())
        n = len(R.gas.log)
        R.reload()
        R.until(lambda: R.mine(n))
        R.pump()
        check("U14 清單查詢完成、整份重畫後：撤回鈕仍全部停用", R.wd_states() and all(R.wd_states()), R.wd_states())
        R.pg.evaluate("""() => { for (let k = 0; k < 2; k += 1) { const btn = document.querySelector('#box .g5u-card[data-id="y"] button[data-wd]'); if (btn) { btn.disabled = false; btn.click(); } } }""")
        R.pump()
        check("U14 x 還沒回來就硬點 y 兩次（繞過 disabled）：零第二筆撤回 POST", len(R.wd()) == 1, [(w["code"], w["id"]) for w in R.wd()])
        R.gas.hold = lambda q: q["op"] == "mine"
        hx.release()
        R.until(lambda: "撤回了" in R.wmsg() and R.pending())
        hb = R.pending()[0] if R.pending() else None
        check("U14 x 成功：x 消失（刷新 B 扣著，快照含 y）", R.ids() == ["y", "z"] and hb is not None, (R.ids(), hb))
        R.gas.hold = lambda q: q["op"] == "mine"
        R.withdraw("y")
        R.until(lambda: len(R.pending()) == 2)
        hc = [h for h in R.pending() if h is not hb][0] if len(R.pending()) == 2 else None
        check("U14 y 成功：y 消失", R.ids() == ["z"] and [(w["code"], w["id"]) for w in R.wd()] == [(A, "x"), (A, "y")], (R.ids(), R.wd()))
        hb and hb.release()
        R.pump()
        check("U14 放行含 y 的舊刷新 B：x、y 都不重現", R.ids() == ["z"], R.ids())
        hc and hc.release()
        R.pump()
        check("U14 最新刷新完成：只剩 z", R.ids() == ["z"] and R.health() == "", (R.ids(), R.health()))
    finally:
        R.close()


def u15(b):
    R = Row(b, "U15", {(A, P["國語"]): [item("x"), item("y")]})
    try:
        R.wait_ids(["x", "y"])
        bads = [
            ("HTTP 500＋ok:true", {"status": 500, "json": {"ok": True, "items": [item("q")], "lastFetch": 0}}),
            ("非法 JSON", {"body": "<html>Error</html>"}),
            ("ok:false", {"json": {"ok": False, "err": "server"}}),
            ("items:null", {"json": {"ok": True, "items": None, "lastFetch": 0}}),
            ("items:{}", {"json": {"ok": True, "items": {}, "lastFetch": 0}}),
        ]
        for label, spec in bads:
            n = len(R.gas.log)
            R.reload()   # 先回到「剛成功」的狀態
            R.until(lambda: R.mine(n) and R.health() == "")
            R.pump(150)
            n = len(R.gas.log)
            R.gas.once.append((lambda q: q["op"] == "mine", spec))
            R.reload()
            R.until(lambda: R.mine(n))
            R.pump()
            check(f"U15 {label}：清單保留、不當成功（提示讀不到）", R.ids() == ["x", "y"] and CANT_READ in R.health(), (R.ids(), R.health()))
        R.gas.data[(A, P["國語"])][1]["status"] = "fetched"
        n = len(R.gas.log)
        R.reload()
        R.until(lambda: R.health() == "" and "製作中" in (R.card("y") or ""))
        check("U15 之後正常成功：提示清掉、狀態更新", R.health() == "" and "製作中" in (R.card("y") or "") and R.ids() == ["x", "y"], (R.health(), R.card("y"), R.ids()))
    finally:
        R.close()


ROWS = [("既有", legacy), ("U1", u1), ("U2", u2), ("U3", u3), ("U4", u4), ("U5", u5), ("U6", u6), ("U7", u7), ("U8", u8),
        ("U9", u9), ("U10", u10), ("U11", u11), ("U12", u12), ("U13", u13), ("U14", u14), ("U15", u15)]


def main():
    global TMP, TAG, ROW
    only = set(sys.argv[1:])
    print(f"受測元件：{SRC_PATH}（sha256 {hashlib.sha256(SRC.encode('utf-8')).hexdigest()[:16]}）", flush=True)
    with sync_playwright() as p, tempfile.TemporaryDirectory() as d:
        TMP = Path(d)
        for i in range(3):
            f = TMP / f"p{i}.png"
            f.write_bytes(PNG)
            PICS.append(str(f))
        for bt in (p.chromium, p.webkit):
            TAG = bt.name
            b = bt.launch()
            try:
                for name, fn in ROWS:
                    if only and name not in only:
                        continue
                    ROW = name
                    try:
                        fn(b)
                    except Exception as e:   # 一列出錯不擋後面的列
                        check(f"{name} 執行到一半出錯", False, f"{type(e).__name__}: {str(e)[:300]}")
            finally:
                b.close()
    print("\n逐列結果（通過／檢查數）")
    for name, _ in ROWS:
        if only and name not in only:
            continue
        cells = []
        for tag in ("chromium", "webkit"):
            rs = [r for r in RESULTS if r[0] == tag and r[1] == name]
            cells.append(f"{tag} {sum(r[3] for r in rs)}/{len(rs)}")
        print(f"  {name}: " + "｜".join(cells))
    print(f"\n{len(RESULTS) - len(FAILS)}/{len(RESULTS)} PASS")
    print("全部通過" if not FAILS else "失敗 " + str(len(FAILS)) + " 項")
    sys.exit(1 if FAILS else 0)


if __name__ == "__main__":
    main()
