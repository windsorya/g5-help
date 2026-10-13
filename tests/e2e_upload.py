"""補題區共用元件（src/upload.js，交辦 #1618）在真瀏覽器裡的送出、清單、撤回。攔截 GAS，不打真後端。

用 python3.12 執行：python3.12 tests/e2e_upload.py   （Chromium 與 WebKit 各跑一遍；iPad 是 WebKit）
"""
import base64
import json
import sys
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SRC = (ROOT / "src" / "upload.js").read_text(encoding="utf-8")
PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
CODE = "ABCDEFGHJKMN"
PAGE = """<!doctype html><html><head><meta charset="utf-8"></head><body><div id="box"></div>
<script>%s</script>
<script>window.__h = G5Upload.mount("#box", {subject:"國語", site:"g5-chinese-review", units:[{id:"L1", name:"第一課 新的開始"}, {id:"L2", name:"第二課 <b>粗</b>"}]});</script>
</body></html>"""

fails = []


def check(name, ok, info=""):
    print(("✅ " if ok else "❌ ") + name + ("" if ok else "｜" + str(info)))
    if not ok:
        fails.append(name)


def run(bt, tmp):
    html = tmp / "page.html"
    html.write_text(PAGE % SRC, encoding="utf-8")
    pics = []
    for i in range(3):
        p = tmp / f"p{i}.png"
        p.write_bytes(PNG)
        pics.append(str(p))
    b = bt.launch()
    tag = bt.name

    # ①沒開同步：不能送、講清楚要先開同步；也不打 mine
    pg = b.new_page()
    sent = []
    pg.route("**/macros/s/**", lambda r: (sent.append(json.loads(r.request.post_data)), r.fulfill(status=200, content_type="application/json", body='{"ok":true,"items":[]}')))
    pg.goto(html.as_uri())
    pg.set_input_files(".g5u-file", pics[:1])
    pg.click(".g5u-send")
    check(f"{tag} 沒開同步：提示先開同步", "跨裝置同步" in pg.inner_text(".g5u-out"), pg.inner_text(".g5u-out"))
    check(f"{tag} 沒開同步：不送任何請求", sent == [], sent)
    check(f"{tag} 沒開同步：清單區說明看不到進度", "還沒開啟跨裝置同步" in pg.inner_text(".g5u-health"))
    check(f"{tag} 單元名稱被跳脫（不變成粗體）", pg.locator(".g5u-unit option", has_text="<b>粗</b>").count() == 1)
    pg.close()

    # ②開了同步：兩張照片送兩次 upload，前綴＋第幾張、科目對；送完重抓清單、只列本科補題
    state = {"items": [], "uploads": [], "fail_second": False, "withdrawn": [], "mine_calls": 0, "mine_reqs": [], "hold_mine": False, "hold_up": False, "held": []}

    def gas(route):
        req = json.loads(route.request.post_data)
        if req["op"] == "upload":
            if state["hold_up"]:
                state["held"].append((route, req))
                return
            state["uploads"].append(req)
            n = len(state["uploads"])
            if state["fail_second"] and n == 2:
                return route.fulfill(status=200, content_type="application/json", body='{"ok":false,"err":"too-big"}')
            state["items"].insert(0, {"id": f"u{n}", "time": 1760000000000, "subject": req["subject"], "note": req["note"][:40], "status": "new"})
            return route.fulfill(status=200, content_type="application/json", body=json.dumps({"ok": True, "id": f"u{n}"}))
        if req["op"] == "mine":
            state["mine_calls"] += 1
            state["mine_reqs"].append(req)
            if state["hold_mine"]:
                state["held"].append((route, req))
                return
            body = json.dumps({"ok": True, "items": [dict(x) for x in state["items"]], "lastFetch": 0})
            return route.fulfill(status=200, content_type="application/json", body=body)
        if req["op"] == "withdraw":
            state["withdrawn"].append(req["id"])
            state["items"] = [x for x in state["items"] if x["id"] != req["id"]]
            return route.fulfill(status=200, content_type="application/json", body='{"ok":true}')
        return route.fulfill(status=500, body="")

    ctx = b.new_context()
    ctx.add_init_script(f"localStorage.setItem('g5sync.code', '{CODE}')")
    pg = ctx.new_page()
    state["items"] = [
        {"id": "x1", "time": 1760000000000, "subject": "數學", "note": "【補題:數學:u1】別科", "status": "new"},
        {"id": "x2", "time": 1760000000000, "subject": "國語", "note": "【錯題】錯題本的", "status": "new"},
        {"id": "x3", "time": 1760000000000, "subject": "國語", "note": "【補題:國語:L1】<img src=x onerror=window.__xss=1>", "status": "done", "url": "https://windsorya.github.io/g5-math-review/#c/a1"},
        {"id": "x4", "time": 1760000000000, "subject": "國語", "note": "【補題:國語:L2】做好了", "status": "done", "url": "https://windsorya.github.io/g5-chinese-review/#c/k2"},
    ]
    pg.route("**/macros/s/**", gas)
    pg.goto(html.as_uri())
    pg.wait_for_selector(".g5u-card")
    ids = pg.eval_on_selector_all(".g5u-card", "e => e.map(x => x.dataset.id)")
    check(f"{tag} 清單只列本科補題（別科、錯題不列）", ids == ["x3", "x4"], ids)
    check(f"{tag} 家長說明被跳脫（沒有執行注入）", pg.evaluate("window.__xss") is None)
    check(f"{tag} 別站網址的『做好了』不給連結", pg.locator('.g5u-card[data-id="x3"] a').count() == 0)
    check(f"{tag} 本站網址的『做好了』有連結", pg.get_attribute('.g5u-card[data-id="x4"] a', "href") == "https://windsorya.github.io/g5-chinese-review/#c/k2")
    check(f"{tag} 做好了的不能撤回", pg.locator('.g5u-card[data-id="x4"] button').count() == 0)
    # Codex 審 8601526：清單要請後端先依本科前綴篩（別科傳多了，本科不會被擠出最近 20 筆）
    check(f"{tag} 清單查詢帶本科前綴", state["mine_reqs"] and all(r.get("prefix") == "【補題:國語:" for r in state["mine_reqs"]), state["mine_reqs"][:2])
    # Codex 審 8601526：送出途中照片、說明、單元都鎖住（否則途中改的內容會在送完時被清掉）
    state["hold_up"] = True
    pg.set_input_files(".g5u-file", pics[:1])
    pg.click(".g5u-send")
    pg.wait_for_function("document.querySelector('.g5u-out').textContent.indexOf('送出第') >= 0", timeout=10000)
    pg.wait_for_timeout(300)
    locked = pg.evaluate("['.g5u-file','.g5u-note','.g5u-unit','.g5u-send'].every(function(c){return document.querySelector(c).disabled;})")
    check(f"{tag} 送出途中照片、說明、單元、送出鈕都鎖住", locked)
    state["hold_up"] = False
    for r0, req in state["held"]:
        state["uploads"].append(req)
        r0.fulfill(status=200, content_type="application/json", body='{"ok":true,"id":"h1"}')
    state["held"].clear()
    pg.wait_for_function("document.querySelector('.g5u-out').textContent.indexOf('送出了') >= 0", timeout=10000)
    check(f"{tag} 送完解鎖", pg.evaluate("['.g5u-file','.g5u-note','.g5u-unit','.g5u-send'].every(function(c){return !document.querySelector(c).disabled;})"))
    state["uploads"] = []
    pg.wait_for_timeout(500)

    pg.select_option(".g5u-unit", "L2")
    pg.fill(".g5u-note", "生字和注音")
    pg.set_input_files(".g5u-file", pics[:2])
    before = state["mine_calls"]
    pg.click(".g5u-send")
    pg.wait_for_function("document.querySelector('.g5u-out').textContent.indexOf('都送出了') >= 0", timeout=15000)
    ups = state["uploads"]
    check(f"{tag} 兩張照片送兩次 upload", len(ups) == 2, len(ups))
    check(f"{tag} 說明前綴與第幾張", [u["note"] for u in ups] == ["【補題:國語:L2】生字和注音（第 1/2 張）", "【補題:國語:L2】生字和注音（第 2/2 張）"], [u["note"] for u in ups])
    check(f"{tag} 科目＝國語、帶同步碼、照片是 JPEG data URL", all(u["subject"] == "國語" and u["code"] == CODE and u["image"].startswith("data:image/jpeg;base64,") for u in ups))
    pg.wait_for_function(f"document.querySelectorAll('.g5u-card').length >= 4", timeout=10000)
    check(f"{tag} 送完重抓清單並列出新補的兩筆", state["mine_calls"] > before and pg.locator('.g5u-card[data-id="u2"]').count() == 1)
    check(f"{tag} 送完清空照片與說明", pg.input_value(".g5u-note") == "" and pg.evaluate("document.querySelector('.g5u-file').files.length") == 0)

    # ③撤回：兩段式，第一次只變「確定撤回？」不送；第二次才送 withdraw；撤回後清單不再有
    pg.click('.g5u-card[data-id="u1"] button[data-wd]')
    check(f"{tag} 撤回第一次只要求確認", state["withdrawn"] == [] and pg.locator('.g5u-card[data-id="u1"] button', has_text="確定撤回？").count() == 1)
    pg.click('.g5u-card[data-id="u1"] button[data-wd]')
    pg.wait_for_function("!document.querySelector('.g5u-card[data-id=\"u1\"]')", timeout=10000)
    check(f"{tag} 第二次送出 withdraw 並從清單消失", state["withdrawn"] == ["u1"], state["withdrawn"])

    # ④部分失敗：三張中第 2 張失敗 → 訊息點名第 2 張、不清空照片
    state["fail_second"] = True
    state["uploads"] = []
    pg.set_input_files(".g5u-file", pics[:3])
    pg.click(".g5u-send")
    pg.wait_for_function("document.querySelector('.g5u-out').textContent.indexOf('沒有送出') >= 0", timeout=15000)
    out = pg.inner_text(".g5u-out")
    check(f"{tag} 部分失敗點名第 2 張", "第 2 張沒有送出" in out and "送出 2 張" in out, out)
    check(f"{tag} 部分失敗不清空照片", pg.evaluate("document.querySelector('.g5u-file').files.length") == 3)
    check(f"{tag} 部分失敗後送出鈕可再按", pg.is_enabled(".g5u-send"))
    # Codex 審 8601526：停止同步後，停止前發出的清單查詢晚到不得把舊家庭的題目畫回來
    pg.wait_for_timeout(300)
    state["hold_mine"] = True
    pg.evaluate("window.__h.reload()")
    pg.wait_for_function("1", timeout=2000)
    pg.wait_for_timeout(300)
    pg.evaluate("localStorage.removeItem('g5sync.code'); window.__h.reload()")
    state["hold_mine"] = False
    for r0, req in state["held"]:
        r0.fulfill(status=200, content_type="application/json", body=json.dumps({"ok": True, "items": [dict(x) for x in state["items"]], "lastFetch": 0}))
    state["held"].clear()
    pg.wait_for_timeout(600)
    check(f"{tag} 停止同步：清單清空、舊回應晚到也不回填", pg.locator(".g5u-card").count() == 0, pg.locator(".g5u-card").count())
    check(f"{tag} 停止同步：提示還沒開啟同步", "還沒開啟跨裝置同步" in pg.inner_text(".g5u-health"), pg.inner_text(".g5u-health"))
    ctx.close()
    b.close()


with sync_playwright() as p, tempfile.TemporaryDirectory() as d:
    for bt in (p.chromium, p.webkit):
        run(bt, Path(d))

print(f"\n{'全部通過' if not fails else '失敗 ' + str(len(fails)) + ' 項'}")
sys.exit(1 if fails else 0)
