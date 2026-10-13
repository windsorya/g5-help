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


def device(browser):
    ctx = browser.new_context()
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


def main():
    help_seed = ("localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{lessonDone:true,idx:3,seed:5,streak:3,clean:3,solved:3,mastered:true,log:[],cur:null,r:1}}}))")
    with sync_playwright() as p:
        br = p.chromium.launch()
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
