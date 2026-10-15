#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""跨裝置同步端到端：兩個瀏覽器 context＝兩台裝置，GAS 端點以 page.route 攔下，交給記憶體後端（同 gas/core.js 協定：
get／put＋rev 樂觀鎖、conflict 回伺服器那份）。驗：難題站與自然站各自「第一台開啟 → 第二台用連結加入 → 拿到同一份進度」，
以及第二台改了進度推上去、第一台重開拿到。跑法：python3.12 tests/e2e_sync.py
"""
import json
import time
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SCI = Path("/Users/william/Documents/g5-sci-review/index.html")
EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec"
RESULTS = []
STORE = {}   # (code, key) -> (rev, data, updated)；格式照 gas/core.js：updated＝毫秒整數，rev 0 時 data／updated 都是 null


def check(name, cond, detail=""):
    RESULTS.append(bool(cond))
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  ← {detail}"))


def backend(route):
    req = json.loads(route.request.post_data or "{}")
    op, k = req.get("op"), (req.get("code"), req.get("key"))
    rev, data, upd = STORE.get(k, (0, None, None))
    if op == "ping":
        body = {"ok": True}
    elif op == "get":
        body = {"ok": True, "rev": rev, "data": data, "updated": upd}
    elif op == "put":
        if req.get("rev") != rev:
            body = {"ok": False, "err": "conflict", "rev": rev, "data": data, "updated": upd}
        else:
            now = int(time.time() * 1000)
            STORE[k] = (rev + 1, req.get("data"), now)
            body = {"ok": True, "rev": rev + 1, "updated": now}
    else:
        body = {"ok": False, "err": "bad-op"}
    route.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps(body))


def device(browser, noauto=True):
    ctx = browser.new_context()
    if not noauto:   # 模擬真機：自動化瀏覽器 navigator.webdriver＝true 時 sync.js 不自動開（免得別站 e2e 寫進真試算表）
        ctx.add_init_script("Object.defineProperty(Navigator.prototype,'webdriver',{get:()=>false})")
    if noauto:   # #2164：舊流程驗手動開啟；noauto=False＝新版預設（一打開就自動開同步）
        ctx.add_init_script("try{localStorage.setItem('g5sync.noauto','1')}catch(e){}")
    ctx.route(lambda url: url.startswith(EP), backend)   # 攔不到就會打到真的 GAS（還沒授權＝回網頁）
    ctx.route("https://windsorya.github.io/g5-help/sync.js", lambda r: r.fulfill(body=(ROOT / "sync.js").read_text(), content_type="application/javascript"))
    ctx.route("https://windsorya.github.io/g5-help/qrcode.js", lambda r: r.fulfill(body=(ROOT / "qrcode.js").read_text(), content_type="application/javascript"))
    return ctx


def open_(ctx, url, errors):
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(url); pg.wait_for_load_state("load")
    return pg


def flow(browser, label, url, key, seed_js, expect):
    errors = []
    a = device(browser)
    pa = open_(a, url, errors)
    if callable(seed_js):
        seed_js(pa)   # 自然站：要真的操作一次才會存（開頁不寫入）
    else:
        pa.evaluate(seed_js); pa.reload(); pa.wait_for_load_state("load")
    pa.locator("#syncBox summary").click()
    pa.get_by_role("button", name="開啟跨裝置同步", exact=False).click()
    pa.wait_for_timeout(1500)
    code = pa.evaluate("localStorage.getItem('g5sync.code')")
    check(f"{label} 第一台開啟：產生 12 字同步碼、畫面有 QR", code and len(code) == 12 and pa.locator("#g5sync svg").count() >= 1, code)
    check(f"{label} 第一台開啟：雲端有一份、rev 1", STORE.get((code, key), (0,))[0] == 1, STORE.get((code, key)))
    b = device(browser)
    pb = open_(b, url + "#sync=" + code, errors)
    pb.wait_for_timeout(2500)
    got = pb.evaluate(f"localStorage.getItem('{key}')")
    check(f"{label} 第二台點連結加入：拿到同一份進度", got and expect(got), (got or "")[:120])
    check(f"{label} 第二台網址列的 #sync= 已移除", "#sync=" not in pb.url, pb.url)
    # 第二台改進度 → 4 秒內推上去 → 第一台重開拿到
    pb.evaluate(f"(function(){{var x=JSON.parse(localStorage.getItem('{key}'));x.__touched=1;localStorage.setItem('{key}',JSON.stringify(x));}})(); 0")
    pb.wait_for_timeout(5500)
    check(f"{label} 第二台改了進度 → 雲端變 rev 2", STORE[(code, key)][0] == 2, STORE[(code, key)][0])
    pa.reload(); pa.wait_for_timeout(2500)
    check(f"{label} 第一台重開拿到第二台的進度", "__touched" in (pa.evaluate(f"localStorage.getItem('{key}')") or ""))
    check(f"{label} 沒有 JS 錯誤", not errors, errors)
    a.close(); b.close()


def auto_flow(browser, url):
    """#2164／#2189 律師判準（2026-10-15）：主畫面圖示與 Safari 存檔分開 ⇒ 一打開就自動開同步；
    兩邊連起來時「以練習題目比較多的那份為準」，不出二選一；輸的那份留 backup。真瀏覽器、假 GAS。"""
    errors = []
    def seeded(n, tag):
        log = [{"t": 1792000000000 + i, "q": 0, "clean": True, "wrongs": 0} for i in range(n)]
        return json.dumps({"v": 1, "entries": {"p38-6-2": {"lessonDone": True, "idx": 3, "seed": 5, "streak": 0, "clean": 0,
                           "solved": n, "mastered": False, "log": log, "cur": None, "r": 1, "tag": tag}}})
    few, many = seeded(3, "home"), seeded(22, "safari")
    # 主畫面那台（練得少）：一打開就有碼、雲端有一份、頁首有提醒
    h = device(browser, noauto=False); ph = open_(h, url, errors)
    ph.evaluate("(d) => localStorage.setItem('g5help.v1', d)", few); ph.reload(); ph.wait_for_load_state("load"); ph.wait_for_timeout(2500)
    hc = ph.evaluate("localStorage.getItem('g5sync.code')")
    check("自動開同步：主畫面那台一打開就有 12 字同步碼", bool(hc) and len(hc) == 12, hc)
    check("自動開同步：這台進度已上雲端", (hc, "g5help.v1") in STORE and json.loads(STORE[(hc, "g5help.v1")][1])["entries"]["p38-6-2"]["solved"] == 3,
          STORE.get((hc, "g5help.v1"), (None,))[0])
    check("自動開同步：頁首提醒「還沒跟家裡其他裝置連起來」", ph.locator(".g5s-banner").count() == 1 and "還沒跟家裡其他裝置連起來" in ph.locator(".g5s-banner").inner_text())
    # Safari 那台（練得多）：也自動開了自己的碼；在頁首提醒貼主畫面那台的整條連結
    s = device(browser, noauto=False); ps = open_(s, url, errors)
    ps.evaluate("(d) => localStorage.setItem('g5help.v1', d)", many); ps.reload(); ps.wait_for_load_state("load"); ps.wait_for_timeout(2000)
    sc = ps.evaluate("localStorage.getItem('g5sync.code')")
    check("自動開同步：另一台是另一組自動碼", bool(sc) and sc != hc, (sc, hc))
    ps.locator(".g5s-banner input").fill(url + "#sync=" + hc)
    ps.locator(".g5s-banner button").click(); ps.wait_for_timeout(6000)
    check("貼整條連結加入：換成主畫面那台的碼、提醒消失", ps.evaluate("localStorage.getItem('g5sync.code')") == hc and ps.locator(".g5s-banner").count() == 0)
    cloud = json.loads(STORE[(hc, "g5help.v1")][1])["entries"]["p38-6-2"]
    check("律師判準：雲端換成練過 22 題那份（不是 3 題那份）", cloud["solved"] == 22 and cloud["tag"] == "safari", (cloud["solved"], cloud.get("tag")))
    bk = ps.evaluate("Object.keys(localStorage).filter(k => k.indexOf('g5sync.backup.g5help.v1.') === 0).map(k => JSON.parse(localStorage.getItem(k)).entries['p38-6-2'].tag)")
    check("輸的那份（3 題）留在加入那台的備份", bk == ["home"], bk)
    check("沒有出現二選一按鈕", ps.get_by_role("button", name="留這台的").count() == 0 and ps.get_by_role("button", name="留雲端的").count() == 0)
    # 主畫面那台重開：換上 22 題那份；它自己原本的 3 題那份留 backup
    ph.reload(); ph.wait_for_load_state("load"); ph.wait_for_timeout(3000)
    local = json.loads(ph.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p38-6-2"]
    check("主畫面那台重開：換上 22 題那份", local["solved"] == 22, local["solved"])
    check("主畫面那台：收到別台寫的進度＝家人已連上，頁首提醒消失", ph.locator(".g5s-banner").count() == 0)
    check("沒有 JS 錯誤", not errors, errors)
    h.close(); s.close()


def main():
    help_seed = ("localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{lessonDone:true,idx:3,seed:5,streak:3,clean:3,solved:3,mastered:true,log:[],cur:null,r:1}}}))")
    with sync_playwright() as p:
        br = p.chromium.launch()
        auto_flow(br, (ROOT / "index.html").as_uri())
        flow(br, "難題站", (ROOT / "index.html").as_uri(), "g5help.v1", help_seed,
             lambda j: json.loads(j)["entries"]["p38-6-2"]["solved"] == 3)
        def sci_seed(pg):
            pg.locator("#setBox summary").click(); pg.select_option("#snd", "3"); pg.wait_for_timeout(300)
        flow(br, "自然站", SCI.as_uri(), "g5sci.v3", sci_seed, lambda j: json.loads(j)["settings"]["tone"] == 3)
        br.close()
    print(f"\n{sum(RESULTS)}/{len(RESULTS)} PASS")
    sys.exit(0 if all(RESULTS) else 1)


if __name__ == "__main__":
    main()
