#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""五年級難題解說端到端驗收：Chromium（桌機、手機 390）＋WebKit iPad，照孩子會做的順序走完教學與練習。
第 1 篇（數學 28/42）走互動算題格式；通用 steps 格式用測試題（__G5_HARD_FIXTURE__，正式頁不會出現）驗。

跑法：python3.12 tests/e2e_math.py [--shots DIR] [--base https://windsorya.github.io/g5-sci-review/]
（--base 給正式網址時改測線上版，並加測影片播放器是否真的載入）
答案用 Python fractions 獨立算（不借用頁面裡的 G5Frac），頁面算錯就會對不上。
"""
import json
import sys
from fractions import Fraction
from math import gcd
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = sys.argv[sys.argv.index("--base") + 1].rstrip("/") + "/" if "--base" in sys.argv else ROOT.as_uri() + "/"
HOME = BASE + "index.html"
URL = HOME + "#h/p38-6-2"
SHOTS = Path(sys.argv[sys.argv.index("--shots") + 1]) if "--shots" in sys.argv else None
RESULTS = []
FIXED = [((24, 36), (35, 50)), ((27, 36), (28, 42)), ((21, 35), (16, 24)),
         ((18, 27), (28, 42)), ((36, 54), (20, 32)), ((45, 63), (32, 40))]


def check(name, cond, detail=""):
    RESULTS.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  ← {detail}"))


def shot(page, name, full=True):
    if SHOTS:
        SHOTS.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=full)


def open_page(browser, device=None, init=None, url=URL, **kw):
    ctx = browser.new_context(**(device or {}), **kw)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    if init:
        page.add_init_script(init)
    page.goto(url, wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("load", timeout=15000)
    except Exception:
        pass
    return ctx, page, errors


def last_ask(page):
    return page.locator("#lesson .ask").last


def chip(page, text):
    last_ask(page).get_by_role("button", name=text, exact=True).click()


def fb_text(page):
    return last_ask(page).locator(".fb").inner_text()


def fill_nums(page, values):
    ask = last_ask(page)
    for i, v in enumerate(values):
        ask.locator(f'input[data-i="{i}"]').fill(str(v))
    ask.get_by_role("button", name="檢查").click()


def no_overflow(page, width):
    sw = page.evaluate("document.documentElement.scrollWidth")
    return sw <= width, sw


def store(page):
    db = json.loads(page.evaluate("localStorage.getItem('g5help.v1')") or "null")
    return (db or {}).get("entries", {}).get("p38-6-2")


def walk_lesson(page, label, mistakes=True):
    page.get_by_role("button", name="開始學").click()
    # 1 先看分母：直接比分子是錯的方法
    check(f"{label} 第1步列出 45 的倍數到 630（14 個）", page.locator("#lesson .mults span").count() == 14 and
          page.locator("#lesson .mults span.hit").inner_text() == "630")
    if mistakes:
        chip(page, "直接比分子，28 比 27 大")
        check(f"{label} 第1步選「直接比分子」被擋並說明", "分子大的不一定比較大" in fb_text(page), fb_text(page))
    chip(page, "先約分：分子分母一起除以同一個數")
    # 2 約分 28/42：先試 3（錯）→ 2 → 太早說不能再約（錯）→ 7 → 不能再約
    if mistakes:
        chip(page, "一起除以 3")
        check(f"{label} 選 3：用乘法表說明 28 不能被 3 整除", "3 × 9 = 27、3 × 10 = 30，中間沒有 28" in fb_text(page), fb_text(page))
    chip(page, "一起除以 2")
    if mistakes:
        fill_nums(page, [13, 21])
        check(f"{label} 28÷2 填 13 被擋並給提示", "2 × 多少 = 28" in fb_text(page), fb_text(page))
    fill_nums(page, [14, 21])
    if mistakes:
        chip(page, "不能再約了")
        check(f"{label} 14/21 說不能再約被擋（7 的乘法表）", "7 的乘法表" in fb_text(page), fb_text(page))
    chip(page, "一起除以 7")
    fill_nums(page, [2, 3])
    chip(page, "不能再約了")
    s2 = page.locator('#lesson section[data-step="2"]').inner_text()
    check(f"{label} 第2步出現 28/42 = 14/21 = 2/3 與「一次除以 14」", "也可以一次除以 14" in s2 and "2 × 7" in s2, s2[-300:])
    check(f"{label} 第2步長條圖：42 格、粗線 2 條、3 大塊塗 2 塊",
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("rect").count() == 43 and
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("line").count() == 2 and
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(1).locator("rect").count() == 4)
    # 3 約分 27/45：一次除以 9
    chip(page, "一起除以 9")
    fill_nums(page, [3, 5])
    chip(page, "不能再約了")
    # 4 通分：先填 30（公倍數但不是最小）
    if mistakes:
        fill_nums(page, [30])
        check(f"{label} 最小公倍數填 30：說是公倍數但還有更小的", "還有更小的" in fb_text(page), fb_text(page))
    fill_nums(page, [15])
    fill_nums(page, [5])
    fill_nums(page, [10])
    fill_nums(page, [3])
    fill_nums(page, [9])
    s4 = page.locator('#lesson section[data-step="4"]').inner_text()
    check(f"{label} 第4步得到 10/15 與 9/15", "10\n15" in s4 and "9\n15" in s4, s4[-200:])
    # 5 比大小
    if mistakes:
        chip(page, "<")
        check(f"{label} 10/15 ○ 9/15 選 < 被擋", "哪個多" in fb_text(page), fb_text(page))
    chip(page, ">")
    chip(page, ">")
    check(f"{label} 題目的□填上 >", page.locator("#box").inner_text().strip() == ">")
    # 6 寫進習作
    if mistakes:
        chip(page, "先通分，再約分")
        check(f"{label} 順序選錯被擋（提到 630）", "630" in fb_text(page), fb_text(page))
    chip(page, "先約分，再通分")
    check(f"{label} 教學完成：出現「換你自己做一題」、存檔 lessonDone", page.locator("#toPractice").is_visible() and (store(page) or {}).get("lessonDone") is True)


def answers(a, b):
    sa, sb = Fraction(*a), Fraction(*b)
    L = sa.denominator * sb.denominator // gcd(sa.denominator, sb.denominator)
    sign = ">" if sa > sb else "<" if sa < sb else "="
    return (sa.numerator, sa.denominator), (sb.numerator, sb.denominator), (sa.numerator * L // sa.denominator, L), (sb.numerator * L // sb.denominator, L), sign


def solve_practice(page, a, b, hint=False, slip=False):
    P = page.locator("#practice")
    sa, sb, ea, eb, sign = answers(a, b)
    r1 = P.locator("#r1")
    if hint:
        r1.get_by_role("button", name="給我提示").click()
    if slip:   # half＝左邊只約一半（大小對、還能再約）；unequal＝分子分母除以不同的數
        k = gcd(*a)
        p = min(q for q in range(2, k + 1) if k % q == 0)
        wrong = (a[0] // p, a[1] // p) if slip == "half" else (a[0] // k, a[1] // 5)   # unequal 只用在 21/35：分子 ÷7、分母 ÷5
        assert wrong != sa, "測試資料要真的是錯的"
        r1.locator('input[data-k="a.n"]').fill(str(wrong[0]))
        r1.locator('input[data-k="a.d"]').fill(str(wrong[1]))
        r1.locator('input[data-k="b.n"]').fill(str(sb[0]))
        r1.locator('input[data-k="b.d"]').fill(str(sb[1]))
        r1.get_by_role("button", name="檢查").click()
        msg = r1.locator(".fb").inner_text()
        want = "還能一起除以" if slip == "half" else "分母卻除以了"
        check(f"練習 {a}：{slip} 錯法被抓「{want}」，且只講左邊", want in msg and msg.startswith("左邊：") and "右邊" not in msg, msg)
    for k, v in (("a.n", sa[0]), ("a.d", sa[1]), ("b.n", sb[0]), ("b.d", sb[1])):
        r1.locator(f'input[data-k="{k}"]').fill(str(v))
    r1.get_by_role("button", name="檢查").click()
    r2 = P.locator("#r2")
    r2.wait_for(state="visible")
    for k, v in (("c.n", ea[0]), ("c.d", ea[1]), ("e.n", eb[0]), ("e.d", eb[1])):
        r2.locator(f'input[data-k="{k}"]').fill(str(v))
    r2.get_by_role("button", name="檢查").click()
    r3 = P.locator("#r3")
    r3.wait_for(state="visible")
    r3.locator(f'button[data-s="{sign}"]').click()
    return sign


def flow_full(browser, label, device=None, width=None, shots=False):
    ctx, page, errors = open_page(browser, device)
    if shots:
        shot(page, f"{label}-0-開頭", full=False)
    walk_lesson(page, label, mistakes=True)
    if shots:
        shot(page, f"{label}-1-教學全程")
    page.locator("#toPractice").click()
    # 練習 6 題固定題：第 3 題分子分母除不同數、第 5 題看提示、第 6 題只約一半（都斷連續），其餘一次做對
    for i, (a, b) in enumerate(FIXED):
        shown = page.locator("#practice .prob").inner_text().split()
        check(f"{label} 練習第 {i + 1} 題是 {a[0]}/{a[1]} 和 {b[0]}/{b[1]}", shown[:2] == [str(a[0]), str(a[1])] and shown[-2:] == [str(b[0]), str(b[1])], shown)
        sign = solve_practice(page, a, b, hint=(i == 4), slip={2: "unequal", 5: "half"}.get(i))
        check(f"{label} 練習第 {i + 1} 題□顯示 {sign}", page.locator("#pbox").inner_text().strip() == {">": ">", "<": "<", "=": "="}[sign])
        st = store(page)
        if i == 2:
            check(f"{label} 第 3 題改過答案⇒連續歸零", st["streak"] == 0 and "下一題試試不看提示" in page.locator("#pend").inner_text(), st)
        if i == 4:
            check(f"{label} 第 5 題看了提示⇒連續歸零", st["streak"] == 0, st)
        if i == 5:
            check(f"{label} 第 6 題只約一半⇒連續歸零、還沒學會", st["streak"] == 0 and not st["mastered"], st)
        if shots and i == 0:
            shot(page, f"{label}-2-練習第1題完成")
        page.locator("#nextQ").click()
    # 第 7–9 題是亂數題：照 Python 算的答案一次做對 ⇒ 連續 3 題 ⇒ 學會
    for i in range(6, 9):
        t = page.locator("#practice .prob").inner_text().split()
        a, b = (int(t[0]), int(t[1])), (int(t[-2]), int(t[-1]))
        sa, sb, *_ = answers(a, b)
        check(f"{label} 亂數第 {i + 1} 題 {a}{b} 兩邊都能約分", sa != a and sb != b)
        solve_practice(page, a, b)
        if i < 8:
            page.locator("#nextQ").click()
    st = store(page)
    check(f"{label} 連續 3 題自己做對 ⇒ 顯示「這種題你會了」、存 mastered", st["mastered"] and st["streak"] == 3 and "這種題你會了" in page.locator("#pend").inner_text(), st)
    check(f"{label} 紀錄 9 題、log 9 筆", st["solved"] == 9 and len(st["log"]) == 9, st)
    if shots:
        shot(page, f"{label}-3-學會了")
    if width:
        ok, sw = no_overflow(page, width)
        check(f"{label} 寬 {width} 沒有左右捲動", ok, sw)
    # 重新整理：接著第 10 題、首頁按鈕改成繼續練習
    page.reload(wait_until="domcontentloaded")
    check(f"{label} 重新整理後顯示「繼續練習（第 10 題）」與已學會", page.get_by_role("button", name="繼續練習（第 10 題）").is_visible() and page.locator("#mastery").is_visible())
    check(f"{label} 沒有 JS 錯誤", not errors, errors)
    ctx.close()


def prob_text(page):
    t = page.locator("#practice .prob").inner_text().split()
    return (int(t[0]), int(t[1])), (int(t[-2]), int(t[-1]))


def flow_codex_r1(browser):
    """Codex 2026-10-12 第 1 輪五個必修，照它的重現步驟逐一打；拆三段、各開新頁，舊版在任一段卡住也不影響其他段。"""
    for part in (codex_r1_lesson, codex_r1_inputs, codex_r1_reopen):
        try:
            part(browser)
        except Exception as e:
            check(f"{part.__name__} 跑完沒有卡住", False, str(e).splitlines()[0])


def codex_r1_lesson(browser):
    # 必修 4＋5：教學第 4 步最小公倍數填 0、填全形 １５
    ctx, page, errors = open_page(browser)
    page.get_by_role("button", name="開始學").click()
    chip(page, "先約分：分子分母一起除以同一個數")
    chip(page, "一起除以 2"); fill_nums(page, [14, 21])
    chip(page, "一起除以 7"); fill_nums(page, [2, 3]); chip(page, "不能再約了")
    chip(page, "一起除以 9"); fill_nums(page, [3, 5]); chip(page, "不能再約了")
    fill_nums(page, [0])
    check("必修4 最小公倍數填 0：說要找比 0 大的公倍數，不說「還有更小的」", "比 0 大" in fb_text(page) and "更小" not in fb_text(page), fb_text(page))
    fill_nums(page, ["１５"])
    check("必修5 最小公倍數填全形１５：判對、進到下一格", "分母 3 要乘多少" in last_ask(page).inner_text(), last_ask(page).inner_text()[:80])
    check("必修4/5 教學段沒有 JS 錯誤", not errors, errors)
    ctx.close()


def codex_r1_inputs(browser):
    # 必修 3＋5：練習填 0、空白、3.、全形數字
    ctx, page, errors = open_page(browser)
    page.get_by_role("button", name="我已經會了，直接練習").click()
    r1 = page.locator("#practice #r1")
    (a, b) = FIXED[0]
    sa, sb, *_ = answers(a, b)
    for k, v in (("a.n", 0), ("a.d", 3), ("b.n", sb[0]), ("b.d", sb[1])):
        r1.locator(f'input[data-k="{k}"]').fill(str(v))
    r1.get_by_role("button", name="檢查").click()
    msg = r1.locator(".fb").inner_text()
    check("必修3 填 0/3：說分子是 0、算一次答錯", "分子是 0" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
    r1.locator('input[data-k="a.n"]').fill("")
    r1.get_by_role("button", name="檢查").click()
    msg = r1.locator(".fb").inner_text()
    check("必修3 有格子空白：說還有格子沒填、不算答錯", "還有格子沒填" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
    r1.locator('input[data-k="a.n"]').fill("3.")
    r1.get_by_role("button", name="檢查").click()
    msg = r1.locator(".fb").inner_text()
    check("必修3 填 3.：說只能填整數、不算答錯", "只能填整數" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
    full = lambda n: str(n).translate(str.maketrans("0123456789", "０１２３４５６７８９"))
    for k, v in (("a.n", sa[0]), ("a.d", sa[1]), ("b.n", sb[0]), ("b.d", sb[1])):
        r1.locator(f'input[data-k="{k}"]').fill(full(v))
    r1.get_by_role("button", name="檢查").click()
    check("必修5 練習填全形數字也判對", page.locator("#practice #r2").is_visible(), r1.locator(".fb").inner_text())
    check("必修3/5 練習段沒有 JS 錯誤", not errors, errors)
    ctx.close()


def codex_r1_reopen(browser):
    # 必修 1＋2：做完不按下一題、改按上方按鈕重開；看提示＋答錯後重開
    ctx, page, errors = open_page(browser)
    direct = lambda: page.get_by_role("button", name="我已經會了，直接練習").click()
    direct()
    solve_practice(page, *FIXED[0])
    direct()
    check("必修1 重開練習換成第 2 題，不是重做第 1 題", prob_text(page) == FIXED[1], prob_text(page))
    for _ in range(2):   # Codex 的重現：重開後再把畫面上那題做完，連做兩次
        direct()
        a, b = prob_text(page)
        if (a, b) == FIXED[0]:
            solve_practice(page, a, b)
    st = store(page)
    check("必修1 重開兩次：第 1 題只算一次、沒有因重複計分而學會", sum(1 for x in st["log"] if x["a"] == "24/36") == 1 and not st["mastered"], st["log"])
    r1 = page.locator("#practice #r1")
    r1.get_by_role("button", name="給我提示").click()
    for k, v in (("a.n", 1), ("a.d", 3), ("b.n", 2), ("b.d", 3)):
        r1.locator(f'input[data-k="{k}"]').fill(str(v))
    r1.get_by_role("button", name="檢查").click()
    direct()
    st = store(page)
    check("必修2 重開後仍是第 2 題，且提示 1 次、答錯 1 次都還在", prob_text(page) == FIXED[1] and st.get("cur") == {"idx": 1, "hints": 1, "wrongs": 1}, st.get("cur"))
    solve_practice(page, *prob_text(page))
    st = store(page)
    check("必修2 這題記成「不是自己一次做對」、連續歸零", st["log"][-1]["clean"] is False and st["log"][-1]["hints"] == 1 and st["streak"] == 0, st["log"][-1])
    check("必修1/2 重開段沒有 JS 錯誤", not errors, errors)
    ctx.close()


def flow_storage_blocked(browser):
    init = "Storage.prototype.setItem=function(){throw new Error('quota')};"
    ctx, page, errors = open_page(browser, init=init)
    page.get_by_role("button", name="我已經會了，直接練習").click()
    a, b = FIXED[0]
    solve_practice(page, a, b)
    check("存不了紀錄：題目照常做完並提示", "存不了紀錄" in page.locator("#pend").inner_text())
    check("存不了紀錄：沒有 JS 錯誤", not errors, errors)
    ctx.close()


def flow_corrupt_store(browser):
    init = "localStorage.setItem('g5help.v1','{not json');"
    ctx, page, errors = open_page(browser, init=init)
    check("壞存檔：照常顯示「開始學」", page.get_by_role("button", name="開始學").is_visible())
    init2 = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{idx:-5,streak:'x',lessonDone:'yes',log:5}}}));"
    ctx2, page2, errors2 = open_page(browser, init=init2)
    st = page2.evaluate("G5HelpPage.state('p38-6-2')")
    check("欄位型別錯：idx 回 0、lessonDone 回 false、log 回空陣列", st["idx"] == 0 and st["lessonDone"] is False and st["log"] == [], st)
    check("壞存檔：沒有 JS 錯誤", not errors and not errors2, errors + errors2)
    ctx.close(); ctx2.close()


GUOYU = {"id": "t-guoyu", "date": "2026-10-13", "subject": "國語", "kind": "steps", "source": "測試卷第 1 題", "title": "測試：成語填空",
         "question": "「一（　）不苟」的空格要填什麼字？",
         "steps": [{"title": "先想意思", "say": "這個成語是說做事很仔細。",
                    "check": {"q": "做事很仔細，是指哪一種人？", "opts": ["馬虎的人", "認真的人"], "a": 1, "why": ["馬虎是不仔細喔。", ""], "ok": "對！"}},
                   {"title": "再想字", "say": "仔細到連一根頭髮都不放過。"}],
         "answer": "絲", "practice": [{"q": "一絲不（　）", "opts": ["狗", "苟"], "a": 1, "why": ["狗是動物。", ""]},
                                      {"q": "「一絲不苟」的意思是？", "opts": ["很仔細", "很隨便"], "a": 0, "why": ["", "相反喔。"]},
                                      {"q": "誰最一絲不苟？", "opts": ["每一題都檢查兩次的人", "寫完就交卷的人"], "a": 0, "why": ["", "沒檢查喔。"]}]}
FIXTURE = "window.__G5_HARD_FIXTURE__ = " + json.dumps([GUOYU], ensure_ascii=False) + ";"


def flow_home(browser):
    """首頁依科目列出；沒有題目的科目寫「還沒有題目」；點進去、回列表、狀態會跟著變。"""
    ctx, page, errors = open_page(browser, url=HOME)
    subj = page.locator("#subjects .subj")
    check("切換列六項（自然、數學、國語、社會、錯題複習、難題解說）、目前站是「難題解說」", page.locator("#siteNav a, #siteNav [aria-current]").count() == 6 and page.locator('#siteNav [aria-current="page"]').inner_text() == "難題解說")
    check("首頁列出國語、數學、自然、社會、英文、其他六科", [subj.nth(i).get_attribute("data-subj") for i in range(subj.count())] == ["國語", "數學", "自然", "社會", "英文", "其他"])
    # 數學科從 2026-10-15 起有第 2 篇（p40-2-5），這裡固定看第 1 篇；另驗第 2 篇也列在數學科
    math = page.locator('.subj[data-subj="數學"] .hcard[href="#h/p38-6-2"]')
    check("數學也列出第 2 篇（26/25 和 31/30）", page.locator('.subj[data-subj="數學"] .hcard[href="#h/p40-2-5"]').count() == 1)
    check("數學有第 1 篇（28/42），狀態還沒看（數學已不只一篇，指定那一篇）", math.count() == 1 and "28/42 和 27/45 比大小" in math.inner_text() and "還沒看" in math.inner_text(), math.inner_text())
    # 哪幾科還沒有題目要看當下的清單（新增第一篇國語題時，寫死「國語還沒有題目」會誤紅；2026-10-15 #2259 復盤）
    used = set(page.evaluate("G5Hard.LIST.map(function(e){return e.subject})"))
    empty_ok = all(("還沒有題目" in page.locator('.subj[data-subj="%s"]' % s).inner_text()) == (s not in used) for s in ["國語", "數學", "自然", "社會", "英文", "其他"])
    check("沒有題目的科目寫「還沒有題目」、有題目的科目不寫", empty_ok, sorted(used))
    math.click()
    page.wait_for_selector("#entry:not([hidden])")
    check("點進去網址變成 #h/p38-6-2、標題是那一篇", page.url.endswith("#h/p38-6-2") and "28/42" in page.title(), page.url)
    page.get_by_role("button", name="我已經會了，直接練習").click()
    solve_practice(page, *FIXED[0])
    page.locator("#backHome").click()
    page.wait_for_selector("#home:not([hidden])")
    check("回列表後狀態變成「練習中」", "練習中" in page.locator('.subj[data-subj="數學"] .hcard[href="#h/p38-6-2"]').inner_text())
    check("首頁沒有 JS 錯誤", not errors, errors)
    ctx.close()


def flow_migrate(browser):
    """昨天在自然複習網站練的紀錄（g5math.v1）搬進第 1 篇；舊資料原文不動。"""
    old = {"v": 1, "lessonDone": True, "idx": 2, "seed": 7, "streak": 2, "clean": 2, "solved": 2, "mastered": False, "log": [], "cur": None}
    init = "if(!localStorage.getItem('g5help.v1'))localStorage.setItem('g5math.v1'," + json.dumps(json.dumps(old)) + ");"
    ctx, page, errors = open_page(browser, init=init)
    st = page.evaluate("G5HelpPage.state('p38-6-2')")
    check("舊紀錄搬進第 1 篇：做完 2 題、連續 2 題、教學看完", st["solved"] == 2 and st["streak"] == 2 and st["lessonDone"] is True, st)
    check("頂部按鈕接著練第 3 題", page.get_by_role("button", name="繼續練習（第 3 題）").is_visible())
    check("舊的 g5math.v1 原文沒被改", json.loads(page.evaluate("localStorage.getItem('g5math.v1')")) == old)
    check("搬家沒有 JS 錯誤", not errors, errors)
    ctx.close()


def flow_steps(browser, label, device=None, shots=False):
    """通用 steps 格式（任何科目）：確認題答錯說原因、答對才往下、沒確認題按「我懂了」、答案、同型練習到學會。"""
    ctx, page, errors = open_page(browser, device, init=FIXTURE, url=HOME)
    card = page.locator('.subj[data-subj="國語"] .hcard[href="#h/t-guoyu"]')
    check(f"{label} 國語出現測試題", card.count() == 1 and "測試：成語填空" in card.inner_text())
    card.click()
    page.wait_for_selector("#entry:not([hidden])")
    check(f"{label} 題目顯示在上方", "一（　）不苟" in page.locator("#prob").inner_text())
    page.get_by_role("button", name="開始學").click()
    chip(page, "馬虎的人")
    check(f"{label} 確認題選錯：顯示原因、不往下", "馬虎是不仔細" in fb_text(page) and page.locator("#lesson .lstep").count() == 1, fb_text(page))
    chip(page, "認真的人")
    page.locator("#lesson button[data-next]").click()
    check(f"{label} 走完步驟後出現答案「絲」", "絲" in page.locator('#lesson section[data-step="3"]').inner_text())
    page.locator("#toPractice").click()
    P = page.locator("#practice")
    P.locator('.chip[data-k="0"]').click()
    check(f"{label} 練習選錯顯示原因", "狗是動物" in P.locator(".fb").first.inner_text())
    P.locator('.chip[data-k="1"]').click()
    st = lambda: page.evaluate("G5HelpPage.state('t-guoyu')")
    check(f"{label} 第 1 題改過答案⇒連續 0", st()["streak"] == 0 and st()["solved"] == 1, st())
    for k in (0, 0, 1):   # 第 2、3 題選對，第 4 題（回到第 1 題）選對 ⇒ 連續 3
        page.locator("#nextQ").click()
        page.locator(f'#practice .chip[data-k="{k}"]').click()
    check(f"{label} 連續 3 題第一次就選對 ⇒ 學會", st()["mastered"] and st()["streak"] == 3 and "這種題你會了" in page.locator("#pend").inner_text(), st())
    if shots:
        shot(page, f"{label}-steps")
    page.locator("#backHome").click()
    check(f"{label} 回列表後國語那篇顯示學會了", "學會了" in page.locator('.subj[data-subj="國語"] .hcard[href="#h/t-guoyu"]').inner_text())
    check(f"{label} steps 格式沒有 JS 錯誤", not errors, errors)
    ctx.close()


def flow_dark(browser):
    ctx, page, errors = open_page(browser, {"viewport": {"width": 390, "height": 844}}, color_scheme="dark")
    bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
    check("深色模式背景是深色", bg in ("rgb(15, 26, 36)",), bg)
    page.get_by_role("button", name="開始學").click()
    chip(page, "先約分：分子分母一起除以同一個數")
    chip(page, "一起除以 2")
    fill_nums(page, [14, 21])
    if SHOTS:
        shot(page, "dark-390-教學")
    ctx.close()


def flow_video_live(browser, label, device=None):
    """只在線上版跑：按播放後 iframe 真的指向 youtube-nocookie、帶 referrerpolicy，播放器沒有出現錯誤 153。"""
    ctx, page, errors = open_page(browser, device)
    page.locator("#vidBox summary").click()
    btns = page.locator("#vids button[data-v]")
    check(f"{label} 影片區有 2 段", btns.count() == 2, btns.count())
    for i in range(btns.count()):
        btns.nth(i).click()
        fr = page.locator("#vids iframe").nth(i)
        src, rp = fr.get_attribute("src"), fr.get_attribute("referrerpolicy")
        check(f"{label} 影片 {i + 1} iframe 指向 youtube-nocookie 並帶 referrerpolicy", "youtube-nocookie.com/embed/" in src and rp == "strict-origin-when-cross-origin", src)
        page.wait_for_timeout(6000)
        frame = page.frame_locator("#vids iframe").nth(i)
        try:
            body = frame.locator("body").inner_text(timeout=10000)
        except Exception as e:
            body = f"<讀不到：{e}>"
        check(f"{label} 影片 {i + 1} 播放器沒有錯誤訊息", "153" not in body and "無法播放" not in body and "Error" not in body, body[:200])
    if SHOTS:
        shot(page, f"{label}-影片", full=False)
    ctx.close()


def flow_codex_help_r1(browser):
    """Codex 2026-10-13 審難題站第 1 輪：必修 1–6、建議 7，照它的重現步驟。"""
    # 必修 2：新 key 壞掉、舊 g5math.v1 完整 ⇒ 仍搬入舊紀錄，壞掉的原文另存
    old = {"v": 1, "lessonDone": True, "idx": 2, "seed": 7, "streak": 2, "clean": 2, "solved": 2, "mastered": False, "log": [], "cur": None}
    init = "if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('g5help.v1','{bad');localStorage.setItem('g5math.v1'," + json.dumps(json.dumps(old)) + ");}"
    ctx, page, errors = open_page(browser, init=init)
    st = page.evaluate("G5HelpPage.state('p38-6-2')")
    keys = page.evaluate("Object.keys(localStorage)")
    check("必修2 新紀錄壞掉時仍搬入舊紀錄（做完 2 題）；讀取時不動原文（第 4 輪必修 3）", st and st["solved"] == 2 and page.evaluate("localStorage.getItem('g5help.v1')") == "{bad", (st, keys))
    page.get_by_role("button", name="繼續練習（第 3 題）").click()
    solve_practice(page, *FIXED[2])
    keys = page.evaluate("Object.keys(localStorage)")
    bk = [k for k in keys if k.startswith("g5help.v1.broken.")]
    check("必修2 第一次存檔才備份壞原文（備份內容＝原文），主 key 換成新紀錄、做完 3 題",
          len(bk) == 1 and page.evaluate(f"localStorage.getItem('{bk[0]}')") == "{bad" and store(page)["solved"] == 3, (bk, store(page)))
    ctx.close()
    # 必修 3：左小右大的分數題，答對時講對方向
    lt = {"id": "t-frac-lt", "date": "2026-10-13", "subject": "數學", "kind": "frac-compare", "source": "測試", "title": "測試：左小右大",
          "a": {"n": 27, "d": 45}, "b": {"n": 28, "d": 42}}
    ctx, page, errors = open_page(browser, init="window.__G5_HARD_FIXTURE__ = " + json.dumps([lt]) + ";", url=HOME + "#h/t-frac-lt")
    page.get_by_role("button", name="開始學").click()
    chip(page, "先約分：分子分母一起除以同一個數")
    chip(page, "一起除以 9"); fill_nums(page, [3, 5]); chip(page, "不能再約了")
    chip(page, "一起除以 2"); fill_nums(page, [14, 21]); chip(page, "一起除以 7"); fill_nums(page, [2, 3]); chip(page, "不能再約了")
    fill_nums(page, [15]); fill_nums(page, [3]); fill_nums(page, [9]); fill_nums(page, [5]); fill_nums(page, [10])
    chip(page, "<")
    asks = page.locator("#lesson .ask")
    msg = asks.nth(asks.count() - 2).locator(".fb").inner_text()   # 答對後下一題（所以 27/45 ○ 28/42）會馬上接在後面
    check("必修3 9/15 ○ 10/15 選 < 時說「9 比 10 小，所以 10/15 比較大」", "9 比 10 小，所以 10/15 比較大" in msg, msg)
    check("必修3 沒有 JS 錯誤", not errors, errors)
    ctx.close()
    # 必修 4：只有 1 題練習時，家長紀錄寫「連續 1 題」
    one = dict(GUOYU, id="t-one", practice=GUOYU["practice"][:1])
    ctx, page, errors = open_page(browser, init="window.__G5_HARD_FIXTURE__ = " + json.dumps([one], ensure_ascii=False) + ";", url=HOME + "#h/t-one")
    page.get_by_role("button", name="我已經會了，直接練習").click()
    page.locator('#practice .chip[data-k="1"]').click()
    check("必修4 一題練習全對：家長紀錄寫連續 1 題、不寫 3 題", "連續 1 題自己做對" in page.locator("#rec").text_content() and "連續 3 題" not in page.locator("#rec").text_content(), page.locator("#rec").text_content())
    ctx.close()
    # 必修 6：超大題號當壞資料，不能同一題重複算到學會
    big = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'t-guoyu':{idx:9007199254740992,solved:0,streak:0}}}));"
    ctx, page, errors = open_page(browser, init=FIXTURE + "if(!sessionStorage.getItem('y')){sessionStorage.setItem('y','1');" + big + "}", url=HOME + "#h/t-guoyu")
    check("必修6 超大題號讀進來變回 0", page.evaluate("G5HelpPage.state('t-guoyu')")["idx"] == 0)
    ctx.close()
    # 建議 7：播影片後回首頁，影片要關掉
    ctx, page, errors = open_page(browser)
    page.locator("#vidBox summary").click()
    page.locator("#vids button[data-v]").first.click()
    page.locator("#backHome").click()
    check("建議7 回首頁後影片 iframe 已移除", page.locator("iframe").count() == 0)
    ctx.close()


def flow_codex_help_r2(browser):
    """Codex 2026-10-13 審難題站第 2 輪必修 1–4。"""
    # 必修 1：大於 10 萬的合法 seed 要保留，重新整理後還是同一題
    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{idx:6,seed:700000,cur:{idx:6,hints:1,wrongs:1}}}}));"
    ctx, page, errors = open_page(browser, init="if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');" + seed + "}")
    st = page.evaluate("G5HelpPage.state('p38-6-2')")
    check("r2必修1 seed 700000 保留、提示答錯紀錄仍對應第 7 題", st["seed"] == 700000 and st["cur"] == {"idx": 6, "hints": 1, "wrongs": 1}, st)
    ctx.close()
    # 必修 2：壞資料備份不了時，原文留在原地、存檔回報失敗
    init = ("if(!sessionStorage.getItem('b')){sessionStorage.setItem('b','1');localStorage.setItem('g5help.v1','{bad');}"
            "var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).indexOf('g5help.v1.broken.')===0)throw new Error('quota');return _s.call(this,k,v);};")
    ctx, page, errors = open_page(browser, init=init)
    page.get_by_role("button", name="我已經會了，直接練習").click()
    solve_practice(page, *FIXED[0])
    raw = page.evaluate("localStorage.getItem('g5help.v1')")
    check("r2必修2 備份失敗：壞掉的原文還在、畫面說存不了紀錄", raw == "{bad" and "存不了紀錄" in page.locator("#pend").inner_text(), raw)
    ctx.close()
    # 必修 3：一直存不進去時，切篇再切回，記憶體裡的進度不能歸零
    ctx, page, errors = open_page(browser, init=FIXTURE + "Storage.prototype.setItem=function(){throw new Error('quota')};")
    page.get_by_role("button", name="我已經會了，直接練習").click()
    solve_practice(page, *FIXED[0])
    page.goto(HOME + "#h/t-guoyu"); page.wait_for_selector("#entry:not([hidden])")
    page.get_by_role("button", name="我已經會了，直接練習").click()
    page.locator('#practice .chip[data-k="1"]').click()
    page.goto(HOME + "#h/p38-6-2"); page.wait_for_selector("#entry:not([hidden])")
    check("r2必修3 存不進去時切篇再切回，數學仍是做完 1 題", page.evaluate("G5HelpPage.state('p38-6-2')")["solved"] == 1, page.evaluate("G5HelpPage.state('p38-6-2')"))
    ctx.close()


def flow_single_writer(browser, label):
    """Codex 設計者方案 B（docs/storage-design-B-20261013.md T01/T11/T13/T17/T19/T20/T22）：
    同一時間只有一個分頁能練習與寫入；第二個分頁唯讀；第一個關掉後第二個自動接手並讀到最新紀錄。"""
    ctx = browser.new_context(); ctx.add_init_script(FIXTURE)
    a = ctx.new_page(); a.goto(URL); a.wait_for_selector("#entry:not([hidden])")
    a.wait_for_function("window.G5HelpWriter && window.G5HelpWriter()")
    b = ctx.new_page(); b.goto(HOME + "#h/t-guoyu"); b.wait_for_selector("#entry:not([hidden])"); b.wait_for_timeout(500)
    check(f"{label} T17 兩個分頁：恰好一個可寫（A 可寫、B 唯讀）", a.evaluate("G5HelpWriter()") is True and b.evaluate("G5HelpWriter()") is False)
    check(f"{label} T13 唯讀分頁沒有作答按鈕、顯示「另一個分頁開著」", b.locator("#topBtns button").count() == 0 and "另一個分頁" in b.locator("#topBtns").inner_text())
    before = b.evaluate("localStorage.getItem('g5help.v1')")
    a.get_by_role("button", name="我已經會了，直接練習").click()
    solve_practice(a, *FIXED[0])
    check(f"{label} T01 A 做完一題有存檔", json.loads(a.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p38-6-2"]["solved"] == 1)
    check(f"{label} T22 唯讀分頁 B 沒有寫入任何東西", b.evaluate("G5HelpWriter()") is False and before != a.evaluate("localStorage.getItem('g5help.v1')"))
    a.close()
    b.wait_for_function("window.G5HelpWriter && window.G5HelpWriter()", timeout=10000)
    b.wait_for_selector("#entry:not([hidden])")
    check(f"{label} T19 A 關掉後 B 自動接手變成可寫", b.evaluate("G5HelpWriter()") is True)
    b.get_by_role("button", name="我已經會了，直接練習").click()
    b.locator('#practice .chip[data-k="1"]').click()
    db = json.loads(b.evaluate("localStorage.getItem('g5help.v1')"))["entries"]
    check(f"{label} T01 接手後兩篇紀錄都在（數學 1、國語 1）", db["p38-6-2"]["solved"] == 1 and db["t-guoyu"]["solved"] == 1, {k: v["solved"] for k, v in db.items()})
    ctx.close()
    # T20：沒有 Web Locks 的舊瀏覽器 ⇒ 唯讀並說明，不退回無鎖寫入
    ctx2, pg, errors = open_page(browser, init="delete Navigator.prototype.locks; Object.defineProperty(navigator,'locks',{value:undefined});")
    check(f"{label} T20 沒有 Web Locks：唯讀並說明瀏覽器太舊", pg.evaluate("G5HelpWriter()") is False and "太舊" in pg.locator("#topBtns").inner_text())
    check(f"{label} T20 沒有 JS 錯誤", not errors, errors)
    ctx2.close()


def flow_codex_r4(browser):
    """Codex 2026-10-13 第 4 輪（設計後首輪）必修 1、2、5 與建議 7。"""
    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,r:1},'t-guoyu':{solved:5,idx:5,r:1}}}));"
    # 必修 1（T21）：讀取突然失敗時存檔，不能把另一篇洗掉
    ctx, pg, errors = open_page(browser, init=FIXTURE + "if(!sessionStorage.getItem('a')){sessionStorage.setItem('a','1');" + seed + "}", url=HOME + "#h/t-guoyu")
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pg.evaluate("(function(){var g=window.__origGet=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(k==='g5help.v1')throw new Error('io');return g.call(this,k);};})(); 0")
    pg.get_by_role("button", name="我已經會了，直接練習").click()
    pg.locator('#practice .chip[data-k="1"]').click()
    raw = pg.evaluate("(function(){Storage.prototype.getItem=window.__origGet;return localStorage.getItem('g5help.v1');})()")
    db = json.loads(raw)["entries"]
    check("r4必修1 讀取失敗時不寫入：數學仍 8 題、國語仍 5 題（進度留在記憶體）", db["p38-6-2"]["solved"] == 8 and db["t-guoyu"]["solved"] == 5 and pg.evaluate("G5HelpDirty()") == 1, {k: v["solved"] for k, v in db.items()})
    ctx.close()
    # 必修 2（T16）：壞資料備份失敗後，空間恢復要能重試存進去
    init = ("if(!sessionStorage.getItem('b')){sessionStorage.setItem('b','1');localStorage.setItem('g5help.v1','{bad');}"
            "window.__fail=true;var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__fail&&String(k).indexOf('g5help.v1.broken.')===0)throw new Error('quota');return _s.call(this,k,v);};")
    ctx, pg, errors = open_page(browser, init=init)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pg.get_by_role("button", name="我已經會了，直接練習").click()
    solve_practice(pg, *FIXED[0])
    check("r4必修2 備份失敗：原文不動、進度標成未存", pg.evaluate("localStorage.getItem('g5help.v1')") == "{bad" and pg.evaluate("G5HelpDirty()") == 1)
    pg.evaluate("window.__fail=false; 0")
    pg.locator("#nextQ").click(); solve_practice(pg, *FIXED[1])
    check("r4必修2 空間恢復後重試成功：兩題都存進去、未存歸零", store(pg)["solved"] == 2 and pg.evaluate("G5HelpDirty()") == 0, store(pg))
    ctx.close()
    # 必修 5（T20）：取鎖被瀏覽器拒絕 ⇒ 唯讀並說明、沒有 JS 錯誤
    ctx, pg, errors = open_page(browser, init="navigator.locks.request=function(){return Promise.reject(new Error('lock-rejected'));};")
    pg.wait_for_timeout(500)
    check("r4必修5 取鎖被拒：唯讀並說明", pg.evaluate("G5HelpWriter()") is False and "拿不到存檔的權限" in pg.locator("#topBtns").inner_text(), pg.locator("#topBtns").inner_text())
    check("r4必修5 取鎖被拒：沒有未處理的錯誤", not errors, errors)
    ctx.close()
    # 建議 7（T22）：唯讀分頁對 localStorage 的寫入次數＝0
    ctx = browser.new_context(); ctx.add_init_script(FIXTURE + "window.__w=0;var _s2=Storage.prototype.setItem,_r2=Storage.prototype.removeItem;Storage.prototype.setItem=function(k,v){window.__w++;return _s2.call(this,k,v);};Storage.prototype.removeItem=function(k){window.__w++;return _r2.call(this,k);};")
    a = ctx.new_page(); a.goto(URL); a.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    b = ctx.new_page(); b.goto(HOME + "#h/t-guoyu"); b.wait_for_timeout(800)
    a.get_by_role("button", name="我已經會了，直接練習").click(); solve_practice(a, *FIXED[0])
    b.wait_for_timeout(500)
    check("r4建議7 唯讀分頁寫入次數＝0", b.evaluate("G5HelpWriter()") is False and b.evaluate("window.__w") == 0, b.evaluate("window.__w"))
    ctx.close()


def flow_codex_r5(browser, label="Chromium"):
    """Codex 2026-10-13 第 5 輪必修 1–3、建議 4（4agent 定案：本頁記憶體是唯一真相、sync.js 不直接寫 g5help.v1、不 reload）。"""
    loads = "sessionStorage.setItem('loads',String(+(sessionStorage.getItem('loads')||0)+1));"
    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,streak:3,clean:8,mastered:true,lessonDone:true,r:1}}}));"
    # 必修 1：冷啟動讀取失敗 ⇒ 不給作答、給「再讀一次」；恢復後接續原紀錄，不會被空白蓋掉
    for key, pre in (("g5help.v1", seed), ("g5math.v1", "localStorage.setItem('g5math.v1',JSON.stringify({v:1,solved:4,idx:4,streak:1,clean:4,mastered:false,lessonDone:true}));")):
        init = (loads + "if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');" + pre + "}"
                "window.__rf=true;var _g=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(window.__rf&&k==='" + key + "')throw new Error('io');return _g.call(this,k);};")
        ctx, pg, errors = open_page(browser, init=init)
        pg.wait_for_timeout(600)
        check(f"{label} r5必修1 冷啟動讀 {key} 失敗：沒有作答按鈕、有「再讀一次」", pg.locator("#goPractice").count() == 0 and pg.locator("#readRetry").count() == 1, pg.locator("#topBtns").inner_text())
        pg.evaluate("window.__rf=false; 0")
        if pg.locator("#readRetry").count():
            pg.locator("#readRetry").click()
        want = 8 if key == "g5help.v1" else 4
        ok = pg.locator("#goPractice").count() == 1
        if ok:
            pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob"); solve_practice(pg, *prob_text(pg))
        st = (store(pg) or {}) if ok else {}
        check(f"{label} r5必修1 恢復讀取後接續原紀錄（{want}→{want + 1} 題，不被空白蓋掉）", st.get("solved") == want + 1, st)
        check(f"{label} r5必修1 沒有 JS 錯誤", not errors, errors)
        ctx.close()
    # 必修 2：雲端版本只在「首頁、沒有未存進度」時套用；套用不 reload
    cloud = json.dumps({"v": 1, "entries": {"p38-6-2": {"solved": 20, "idx": 20, "r": 9}}})
    init = (loads + "window.__fail=false;var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__fail&&k==='g5help.v1')throw new Error('quota');return _s.call(this,k,v);};")
    ctx, pg, errors = open_page(browser, init=init)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    has = pg.evaluate("typeof window.G5HelpApplyRemote === 'function'")
    check(f"{label} r5必修2 有 G5HelpApplyRemote（同步只能經由本頁套用）", has)
    if has:
        pg.evaluate("window.__fail=true; 0")
        pg.locator("#goPractice").click(); solve_practice(pg, *FIXED[0])
        r1 = pg.evaluate("(c)=>G5HelpApplyRemote('g5help.v1', c)", cloud)
        check(f"{label} r5必修2 有未存進度：拒絕套用雲端、不 reload", r1 is False and pg.evaluate("sessionStorage.getItem('loads')") == "1" and pg.evaluate("G5HelpDirty()") == 1)
        pg.evaluate("window.__fail=false; 0")
        pg.wait_for_function("G5HelpDirty() === 0", timeout=9000)
        r2 = pg.evaluate("(c)=>G5HelpApplyRemote('g5help.v1', c)", cloud)
        check(f"{label} r5必修2 正在某一篇裡：先不套用（回首頁才換）", r2 is False and store(pg)["solved"] == 1)
        pg.evaluate("location.hash=''"); pg.wait_for_selector("#home:not([hidden])")
        r3 = pg.evaluate("(c)=>G5HelpApplyRemote('g5help.v1', c)", cloud)
        check(f"{label} r5必修2 首頁、沒有未存：套用雲端、寫進存檔、不 reload", r3 is True and json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p38-6-2"]["solved"] == 20 and pg.evaluate("sessionStorage.getItem('loads')") == "1")
        check(f"{label} r5必修2 套用後首頁狀態跟著變（練習中）", "練習中" in pg.locator('.subj[data-subj="數學"]').inner_text())
    check(f"{label} r5必修2 沒有 JS 錯誤", not errors, errors)
    ctx.close()
    # 必修 3：存不進去 ⇒ 回首頁也看得到警告；恢復後自動重試成功、警告消失
    ctx, pg, errors = open_page(browser, init=init)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pg.evaluate("window.__fail=true; 0")
    pg.locator("#goPractice").click(); solve_practice(pg, *FIXED[0])
    pg.evaluate("location.hash=''"); pg.wait_for_selector("#home:not([hidden])")
    warn = pg.locator("#saveWarn")
    check(f"{label} r5必修3 首頁看得到「還沒存好」警告", warn.count() == 1 and warn.is_visible())
    pg.evaluate("window.__fail=false; 0")
    try:
        pg.wait_for_function("G5HelpDirty() === 0", timeout=9000); auto = True
    except Exception:
        auto = False
    check(f"{label} r5必修3 恢復後自動重試存好（不用再作答）", auto and (store(pg) or {}).get("solved") == 1, pg.evaluate("G5HelpDirty()"))
    check(f"{label} r5必修3 存好後警告消失", warn.count() == 0 or not warn.is_visible())
    ctx.close()
    # 建議 4：舊畫面的「我懂了，下一步」在切走後按下去不出錯；別人改了磁碟也不會讓已答對的題目沒存到
    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pg.get_by_role("button", name="開始學").click()
    chip(pg, "認真的人")
    pg.wait_for_selector("button[data-next]")
    pg.evaluate("window.__oldNext = document.querySelector('button[data-next]'); location.hash = '#h/p38-6-2'; 0")
    pg.wait_for_selector("#prob .frac, #prob")
    pg.evaluate("window.__oldNext.click(); 0"); pg.wait_for_timeout(200)
    check(f"{label} r5建議4 切走後按舊的「下一步」：沒有錯誤、數學篇畫面不被動到", not errors and pg.locator('#lesson .lstep').count() == 0, errors)
    ctx.close()
    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pg.locator("#goPractice").click()
    pg.evaluate("""localStorage.setItem('g5help.v1', JSON.stringify({v:1,entries:{'t-guoyu':{solved:7,idx:7,r:50}}}));
                   window.dispatchEvent(new StorageEvent('storage',{key:'g5help.v1'})); 0""")
    pg.wait_for_timeout(100)
    c1 = pg.locator('#practice .chip[data-k="1"]')
    if c1.count():
        c1.click()
    pg.wait_for_timeout(100)
    db = json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["t-guoyu"]
    check(f"{label} r5建議4 畫面說對了的那一題確實存進去（本頁是唯一真相）", db["solved"] == 1 and "對" in pg.locator("#practice").inner_text(), db)
    check(f"{label} r5建議4 沒有 JS 錯誤", not errors, errors)
    ctx.close()
    # GPT 4agent 補：同一個答對 handler 直接再呼叫一次（不靠按鈕 disabled），只能算一題
    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pg.locator("#goPractice").click()
    pg.evaluate("""(function(){var b=document.querySelector('#practice .chip[data-k="1"]'),h=b.onclick;b.click();h.call(b);})(); 0""")
    db = json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["t-guoyu"]
    check(f"{label} r5補 同一題的答對 handler 重播只計一次", db["solved"] == 1 and db["idx"] == 1 and len(db["log"]) == 1, {k: db[k] for k in ("solved", "idx")})
    ctx.close()

def flow_codex_r6(browser, label="Chromium"):
    """Codex 2026-10-13 第 6 輪（4agent 後第 1 輪）三個新反例＋同寬掃描：切篇後重播畫面上「每一個」舊按鈕 handler。"""
    loads = "sessionStorage.setItem('loads',String(+(sessionStorage.getItem('loads')||0)+1));"
    # 反例 1：首頁套用雲端時 setItem 成功、緊接的讀回拋錯一次 ⇒ 記憶體與磁碟必須一致（不能磁碟 20、記憶體 8）
    seed = "if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,r:1}}}));}"
    ctx, pg, errors = open_page(browser, init=loads + seed, url=HOME)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    cloud = json.dumps({"v": 1, "entries": {"p38-6-2": {"solved": 20, "idx": 20, "r": 9}}})
    r = pg.evaluate("""(c)=>{var g=Storage.prototype.getItem,s=Storage.prototype.setItem,armed=false;
      Storage.prototype.setItem=function(k,v){var x=s.call(this,k,v);if(k==='g5help.v1')armed=true;return x;};
      Storage.prototype.getItem=function(k){if(armed&&k==='g5help.v1'){armed=false;throw new Error('io');}return g.call(this,k);};
      var ok=G5HelpApplyRemote('g5help.v1',c);Storage.prototype.getItem=g;Storage.prototype.setItem=s;
      return {ok:ok,mem:G5HelpPage.state('p38-6-2').solved,disk:JSON.parse(localStorage.getItem('g5help.v1')).entries['p38-6-2'].solved};}""", cloud)
    check(f"{label} r6-1 套用雲端讀回失敗：記憶體和磁碟一致（不會之後把磁碟蓋回舊的）", r["mem"] == r["disk"], r)
    pg.evaluate("location.hash='#h/p38-6-2'"); pg.wait_for_selector("#entry:not([hidden])")
    pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob"); solve_practice(pg, *prob_text(pg))
    st = store(pg) or {}
    check(f"{label} r6-1 接著做一題：從雲端的 20 題接下去（21），不倒退成 9", st.get("solved") == r["disk"] + 1, st)
    ctx.close()
    # 反例 2：冷啟動「再讀一次」的舊 handler 在讀成功、又有未存進度後被重播 ⇒ 不能把記憶體換回磁碟版
    init = (loads + seed + "window.__rf=true;window.__wf=false;var _g=Storage.prototype.getItem,_s=Storage.prototype.setItem;"
            "Storage.prototype.getItem=function(k){if(window.__rf&&k==='g5help.v1')throw new Error('io');return _g.call(this,k);};"
            "Storage.prototype.setItem=function(k,v){if(window.__wf&&k==='g5help.v1')throw new Error('quota');return _s.call(this,k,v);};")
    ctx, pg, errors = open_page(browser, init=init)
    pg.wait_for_timeout(500)
    pg.evaluate("window.__oldRetry = document.querySelector('#readRetry') && document.querySelector('#readRetry').onclick; window.__rf=false; 0")
    pg.locator("#readRetry").click()
    pg.evaluate("window.__wf=true; 0")
    pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob"); solve_practice(pg, *prob_text(pg))
    before = pg.evaluate("G5HelpPage.state('p38-6-2').solved")
    pg.evaluate("window.__oldRetry && window.__oldRetry(); 0")
    after = pg.evaluate("G5HelpPage.state('p38-6-2').solved")
    pg.evaluate("window.__wf=false; 0")
    pg.wait_for_function("G5HelpDirty() === 0", timeout=9000)
    disk = (store(pg) or {}).get("solved")
    check(f"{label} r6-2 重播舊的「再讀一次」：未存的那題還在（記憶體 {before}→{after}、最後存進 {disk}）", before == 9 and after == 9 and disk == 9, {"before": before, "after": after, "disk": disk})
    ctx.close()
    # 同寬掃描（含反例 3 的分數題「給我提示」）：在某一篇把教學、練習的每個按鈕 handler 都存起來，切到別篇後全部重播
    for start, other in (("p38-6-2", "t-guoyu"), ("t-guoyu", "p38-6-2")):
        ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/" + start)
        pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
        pg.get_by_role("button", name="開始學").click(); pg.wait_for_timeout(200)
        pg.evaluate("location.hash='#h/" + start + "'; 0") if False else None
        pg.locator("#goPractice").click(); pg.wait_for_timeout(300)
        n = pg.evaluate("""()=>{window.__stale=[];document.querySelectorAll('#lesson button, #practice button, #topBtns button').forEach(function(b){if(b.onclick)window.__stale.push([b,b.onclick]);});return window.__stale.length;}""")
        snap = pg.evaluate("(id)=>JSON.stringify(G5HelpPage.state(id))", start)
        disk0 = pg.evaluate("localStorage.getItem('g5help.v1')")
        pg.evaluate("location.hash='#h/" + other + "'"); pg.wait_for_timeout(200)
        pg.evaluate("""()=>{window.__stale.forEach(function(p){try{p[1].call(p[0],{preventDefault:function(){}});}catch(e){window.__staleErr=(window.__staleErr||[]).concat(String(e));}});}""")
        pg.wait_for_timeout(300)
        snap2 = pg.evaluate("(id)=>JSON.stringify(G5HelpPage.state(id))", start)
        disk1 = pg.evaluate("localStorage.getItem('g5help.v1')")
        errs = pg.evaluate("window.__staleErr||[]")
        check(f"{label} r6 掃描：{start} 的 {n} 個舊按鈕在切到 {other} 後重播，{start} 的紀錄（記憶體與存檔）完全不變、沒有錯誤",
              n >= 3 and snap == snap2 and disk0 == disk1 and not errs and not errors, {"n": n, "mem_same": snap == snap2, "disk_same": disk0 == disk1, "errs": errs + errors})
        check(f"{label} r6 掃描：重播後畫面仍是 {other}、沒有被舊畫面改動", other in pg.evaluate("location.hash") and pg.locator("#entry:not([hidden])").count() == 1)
        ctx.close()

def flow_confused(browser):
    """交辦 #1319：每一步有「這步看不懂」；沒開同步給口頭說法；有同步碼就送 op=confused（攔下請求，不打真後端）。"""
    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pg.get_by_role("button", name="開始學").click()
    btn = pg.locator(".lstep").first.locator("button[data-confused]")
    check("#1319 每一步有「這步看不懂」按鈕", btn.count() == 1 and btn.is_visible())
    btn.click()
    check("#1319 沒開同步：請她口頭跟爸媽說第幾步", "第 1 步看不懂" in pg.locator(".lstep").first.inner_text())
    sent = []
    pg.route("**/macros/s/**", lambda route: (sent.append(route.request.post_data), route.fulfill(status=200, content_type="application/json", body='{"ok":true,"id":"c1"}')))
    pg.evaluate("localStorage.setItem('g5sync.code','ABCDEFGHJKMN'); 0")
    btn.click(); pg.wait_for_timeout(400)
    body = json.loads(sent[0]) if sent else {}
    check("#1319 有同步碼：送出 op=confused、篇 id、第 1 步", body.get("op") == "confused" and body.get("entry") == "t-guoyu" and body.get("step") == 1 and body.get("subject") == "國語", body)
    check("#1319 送出後告訴她收到了", "收到了" in pg.locator(".lstep").first.inner_text())
    check("#1319 沒有 JS 錯誤", not errors, errors)
    ctx.close()

# ---------------- 家長功能（2026-10-13 律師：「為何我測試用的題目，我沒法清除？有無清除或重置按鈕？」）----------------
def sentences_over(text, limit=40):
    """小五句長：以 。！？ 與換行切句，數非空白字元；回傳超過上限的句子（同 tests/kidgate.js 的規則）。"""
    import re
    return [s for s in re.split(r"[。！？\n]", text) if len(re.sub(r"\s", "", s)) > limit]


def db_of(pg):
    return json.loads(pg.evaluate("localStorage.getItem('g5help.v1')") or "null") or {}


def flow_hide(browser, label="Chromium"):
    """首頁每篇「隱藏這篇」：兩段式防誤觸、可恢復；隱藏清單存進 g5help.v1（走同一個 save()），不刪任何作答紀錄。"""
    seed = ("if(!sessionStorage.getItem('h')){sessionStorage.setItem('h','1');localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'t-guoyu':{lessonDone:true,solved:2,idx:2,r:1}}}));}")
    ctx, pg, errors = open_page(browser, init=FIXTURE + seed, url=HOME)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    G = '.subj[data-subj="國語"]'
    card = lambda: pg.locator(G + ' .hcard[href="#h/t-guoyu"]')
    btn = pg.locator('button[data-hide="t-guoyu"]')
    check(f"{label} 隱藏H1 舊存檔沒有 hidden 欄位：每篇照常列出、沒有「已隱藏」", card().count() == 1 and pg.locator("#hidBox").count() == 0 and "練習中" in card().inner_text())
    check(f"{label} 隱藏H2 每張篇卡片都有「隱藏這篇」", btn.count() == 1 and btn.inner_text() == "隱藏這篇" and pg.locator('button[data-hide="p38-6-2"]').count() == 1)
    btn.click()
    check(f"{label} 隱藏H3 按一次只變成「確定隱藏？」＋「取消」，還沒隱藏、也沒寫檔",
          btn.inner_text() == "確定隱藏？" and pg.locator(G + " button[data-unarm]").is_visible() and card().count() == 1 and not db_of(pg).get("hidden"),
          (btn.inner_text(), db_of(pg)))
    pg.locator(G + " button[data-unarm]").click()
    check(f"{label} 隱藏H4 按「取消」回到「隱藏這篇」，沒有隱藏", btn.inner_text() == "隱藏這篇" and card().count() == 1 and not db_of(pg).get("hidden"))
    btn.click(); pg.wait_for_timeout(5600)
    check(f"{label} 隱藏H5 按一次後 5 秒沒再按：自動回到「隱藏這篇」（防誤觸）", btn.inner_text() == "隱藏這篇" and card().count() == 1, btn.inner_text())
    btn.click(); btn.click()
    d = db_of(pg)
    check(f"{label} 隱藏H6 再按「確定隱藏？」：這篇從清單收起來、這一科改說都藏起來了",
          card().count() == 0 and "藏起來" in pg.locator(G).inner_text(), pg.locator(G).inner_text())
    check(f"{label} 隱藏H7 存檔：hidden 記這篇＋時間；作答紀錄一筆沒少（教學看完、做完 2 題）",
          isinstance(d.get("hidden", {}).get("t-guoyu"), int) and d["entries"]["t-guoyu"]["solved"] == 2 and d["entries"]["t-guoyu"]["lessonDone"] is True and d["v"] == 1, d)
    check(f"{label} 隱藏H8 清單底下出現「顯示已隱藏的 1 篇」", pg.locator("#hidBox summary").inner_text() == "顯示已隱藏的 1 篇", pg.locator("#hidBox").count() and pg.locator("#hidBox summary").inner_text())
    pg.reload(); pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    check(f"{label} 隱藏H9 重新整理後仍是隱藏的", card().count() == 0 and pg.locator("#hidBox summary").inner_text() == "顯示已隱藏的 1 篇")
    pg.goto(HOME + "#h/t-guoyu"); pg.wait_for_selector("#entry:not([hidden])")
    check(f"{label} 隱藏H10 隱藏的篇直接開網址仍打得開、紀錄還在", "繼續練習" in pg.locator("#topBtns").inner_text(), pg.locator("#topBtns").inner_text())
    pg.locator("#backHome").click(); pg.wait_for_selector("#home:not([hidden])")
    pg.locator("#hidBox summary").click()
    row = pg.locator("#hidBox [data-hid-row]")
    check(f"{label} 隱藏H11 展開後列出那一篇的篇名和「恢復」", row.count() == 1 and "測試：成語填空" in row.inner_text() and row.get_by_role("button", name="恢復").is_visible())
    row.get_by_role("button", name="恢復").click()
    d = db_of(pg)
    check(f"{label} 隱藏H12 按「恢復」：回到清單、hidden 清空、紀錄照舊", card().count() == 1 and pg.locator("#hidBox").count() == 0 and d.get("hidden") == {} and d["entries"]["t-guoyu"]["solved"] == 2, d)
    # 存不進去：隱藏也走同一個 save()（DIRTY、首頁警告、自動再試）
    pg.evaluate("(function(){var s=window.__s0=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='g5help.v1')throw new Error('quota');return s.call(this,k,v);};})(); 0")
    btn.click(); btn.click()
    check(f"{label} 隱藏H13 存不進去：畫面先收起來、首頁出現「沒存好」警告、標成未存", card().count() == 0 and pg.locator("#saveWarn").is_visible() and pg.evaluate("G5HelpDirty()") >= 1 and not db_of(pg).get("hidden"))
    pg.evaluate("Storage.prototype.setItem=window.__s0; 0")
    pg.locator("#saveRetry").click()
    check(f"{label} 隱藏H14 空間恢復後再存一次：hidden 寫進去、警告消失", "t-guoyu" in db_of(pg).get("hidden", {}) and pg.locator("#saveWarn").is_hidden() and pg.evaluate("G5HelpDirty()") == 0, db_of(pg))
    b = ctx.new_page(); b.goto(HOME); b.wait_for_timeout(600)
    check(f"{label} 隱藏H15 唯讀分頁（另一個分頁開著）沒有隱藏、恢復按鈕", b.evaluate("G5HelpWriter()") is False and b.locator("button[data-hide]").count() == 0 and b.locator("#hidBox button").count() == 0)
    b.close()
    txt = pg.locator("#home").inner_text()
    check(f"{label} 隱藏H16 新字每句不超過 40 字", not sentences_over(txt), sentences_over(txt))
    check(f"{label} 隱藏 沒有 JS 錯誤", not errors, errors)
    ctx.close()


def card_count(pg, sel):
    return pg.locator(sel + " .hcard").count()


def flow_delete(browser, label="Chromium"):
    """「已隱藏」清單每篇「刪除」（2026-10-14 律師要求）：兩段式、刪掉＝紀錄歸零＋首頁與已隱藏清單都不列、恢復全部也不帶回。"""
    seed = ("if(!sessionStorage.getItem('d')){sessionStorage.setItem('d','1');localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'t-guoyu':{lessonDone:true,solved:2,idx:2,r:1}},hidden:{'t-guoyu':5,'p38-6-2':6}}));}")
    ctx, pg, errors = open_page(browser, init=FIXTURE + seed, url=HOME)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    G = '.subj[data-subj="國語"]'
    pg.locator("#hidBox summary").click()
    row = pg.locator('#hidBox [data-hid-row]', has_text="測試：成語填空")
    dbtn = pg.locator('button[data-del="t-guoyu"]')
    check(f"{label} 刪除D1 已隱藏清單每篇都有「恢復」和「刪除」", row.get_by_role("button", name="恢復").is_visible() and dbtn.inner_text() == "刪除" and pg.locator('button[data-del="p38-6-2"]').count() == 1)
    dbtn.click()
    check(f"{label} 刪除D2 按一次只變成「確定刪除？」＋「取消」，還沒刪、也沒寫檔",
          dbtn.inner_text() == "確定刪除？" and pg.locator("#hidBox button[data-undel]").is_visible() and "_del_t-guoyu" not in db_of(pg).get("hidden", {}), (dbtn.inner_text(), db_of(pg)))
    pg.locator("#hidBox button[data-undel]").click()
    check(f"{label} 刪除D3 按「取消」回到「刪除」，沒有刪", dbtn.inner_text() == "刪除" and "_del_t-guoyu" not in db_of(pg).get("hidden", {}))
    dbtn.click(); pg.wait_for_timeout(5600)
    check(f"{label} 刪除D4 5 秒沒再按：自動回到「刪除」", dbtn.inner_text() == "刪除", dbtn.inner_text())
    dbtn.click(); dbtn.click()
    d = db_of(pg)
    check(f"{label} 刪除D5 確定後：已隱藏剩 1 篇、國語那篇不再列出",
          pg.locator("#hidBox summary").inner_text() == "顯示已隱藏的 1 篇" and pg.locator(G + ' .hcard[href="#h/t-guoyu"]').count() == 0, (pg.locator("#hidBox summary").inner_text(), pg.locator(G).inner_text()))
    check(f"{label} 刪除D6 存檔：deleted 記這篇、hidden 仍留這篇、作答紀錄歸零",
          isinstance(d.get("hidden", {}).get("_del_t-guoyu"), int) and d["hidden"].get("t-guoyu") == 5 and d["entries"]["t-guoyu"]["solved"] == 0 and d["entries"]["t-guoyu"]["lessonDone"] is False, d)
    pg.reload(); pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    check(f"{label} 刪除D7 重新整理後仍刪掉、紀錄沒被舊資料併回來", pg.locator(G + ' .hcard[href="#h/t-guoyu"]').count() == 0 and db_of(pg)["entries"]["t-guoyu"]["solved"] == 0, db_of(pg))
    pg.locator("#setBox summary").click(); pg.locator("#unhideAll").click()
    d = db_of(pg)
    check(f"{label} 刪除D8 「恢復全部隱藏的篇」只帶回數學那篇，刪掉的不回來",
          pg.locator('.subj[data-subj="數學"] .hcard[href="#h/p38-6-2"]').count() == 1 and pg.locator(G + ' .hcard[href="#h/t-guoyu"]').count() == 0 and pg.locator("#hidBox").count() == 0 and sorted(d["hidden"].keys()) == ["_del_t-guoyu", "t-guoyu"], d)
    txt = pg.locator("#home").inner_text()
    check(f"{label} 刪除D9 新字每句不超過 40 字", not sentences_over(txt), sentences_over(txt))
    check(f"{label} 刪除 沒有 JS 錯誤", not errors, errors)
    ctx.close()


def flow_clear(browser, label="Chromium"):
    """家長設定「清除全部作答紀錄」：兩段式確認、走同一個 save()；隱藏清單不清（另有「恢復全部隱藏的篇」）；舊 g5math.v1 不會被搬回來。"""
    old = {"v": 1, "lessonDone": True, "idx": 2, "seed": 7, "streak": 2, "clean": 2, "solved": 2, "mastered": False, "log": [], "cur": None}
    seed = ("if(!sessionStorage.getItem('c')){sessionStorage.setItem('c','1');localStorage.setItem('g5math.v1'," + json.dumps(json.dumps(old)) + ");"
            "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{lessonDone:true,solved:5,idx:5,streak:3,mastered:true,r:4},'t-guoyu':{lessonDone:true,r:1}},hidden:{'p38-6-2':5}}));}")
    ctx, pg, errors = open_page(browser, init=FIXTURE + seed, url=HOME)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    G = '.subj[data-subj="國語"] .hcard[href="#h/t-guoyu"]'
    check(f"{label} 清除C1 首頁有「家長設定」", pg.locator("#setBox summary").inner_text() == "家長設定")
    pg.locator("#setBox summary").click()
    clr = pg.locator("#clearAll")
    check(f"{label} 清除C2 設定裡有「清除全部作答紀錄」", clr.inner_text() == "清除全部作答紀錄")
    before = pg.evaluate("localStorage.getItem('g5help.v1')")
    clr.click()
    check(f"{label} 清除C3 按一次只出現「確定清除？」與「取消」，紀錄沒動",
          clr.inner_text() == "確定清除？" and pg.locator("#clearNo").is_visible() and pg.evaluate("localStorage.getItem('g5help.v1')") == before)
    pg.locator("#clearNo").click()
    check(f"{label} 清除C4 按「取消」回到原樣、紀錄沒動", clr.inner_text() == "清除全部作答紀錄" and pg.locator("#clearNo").is_hidden() and pg.evaluate("localStorage.getItem('g5help.v1')") == before)
    clr.click(); clr.click()
    d = db_of(pg)
    check(f"{label} 清除C5 再按「確定清除？」：每一篇回到「還沒看」、存檔 entries 是空的", d.get("entries") == {} and "還沒看" in pg.locator(G).inner_text(), d)
    check(f"{label} 清除C6 隱藏清單不清：數學那篇仍隱藏、仍有「顯示已隱藏的 1 篇」", d.get("hidden") == {"p38-6-2": 5} and pg.locator('.subj[data-subj="數學"] .hcard[href="#h/p38-6-2"]').count() == 0 and pg.locator("#hidBox summary").inner_text() == "顯示已隱藏的 1 篇", d)
    check(f"{label} 清除C7 告訴家長清好了", "清好了" in pg.locator("#clearMsg").inner_text(), pg.locator("#clearMsg").inner_text())
    pg.reload(); pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    check(f"{label} 清除C8 重新整理後仍是空白；舊 g5math.v1 沒有被搬回第 1 篇（原文也沒動）",
          pg.evaluate("G5HelpPage.state('p38-6-2')") is None and pg.evaluate("G5HelpPage.state('t-guoyu')") is None and json.loads(pg.evaluate("localStorage.getItem('g5math.v1')")) == old)
    pg.locator("#setBox summary").click()
    allb = pg.locator("#unhideAll")
    check(f"{label} 清除C9 設定裡有「恢復全部隱藏的篇（1 篇）」", allb.is_visible() and allb.inner_text() == "恢復全部隱藏的篇（1 篇）", allb.count() and allb.inner_text())
    allb.click()
    check(f"{label} 清除C10 按了之後數學那篇回到清單、hidden 清空", pg.locator('.subj[data-subj="數學"] .hcard[href="#h/p38-6-2"]').count() == 1 and db_of(pg).get("hidden") == {} and pg.locator("#unhideAll").count() == 0)
    # 存不進去時清除：記憶體先清、標成未存；之後存成功也不能把磁碟上的舊紀錄併回來
    pg.goto(HOME + "#h/t-guoyu"); pg.wait_for_selector("#entry:not([hidden])")
    pg.get_by_role("button", name="開始學").click()
    chip(pg, "認真的人"); pg.locator("#lesson button[data-next]").click()
    pg.locator("#backHome").click(); pg.wait_for_selector("#home:not([hidden])")
    check(f"{label} 清除C11 （前置）國語看完教學已存檔", db_of(pg)["entries"]["t-guoyu"]["lessonDone"] is True)
    pg.evaluate("(function(){var s=window.__s0=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='g5help.v1')throw new Error('quota');return s.call(this,k,v);};})(); 0")
    pg.locator("#setBox summary").click() if not pg.locator("#setBox").evaluate("e => e.open") else None
    clr.click(); clr.click()
    check(f"{label} 清除C12 存不進去：畫面已是「還沒看」、出現「沒存好」警告", "還沒看" in pg.locator(G).inner_text() and pg.locator("#saveWarn").is_visible() and db_of(pg)["entries"]["t-guoyu"]["lessonDone"] is True)
    pg.evaluate("Storage.prototype.setItem=window.__s0; 0")
    pg.locator("#saveRetry").click()
    check(f"{label} 清除C13 再存一次成功：磁碟上的舊紀錄沒有被併回來（entries 空）", db_of(pg).get("entries") == {} and pg.evaluate("G5HelpDirty()") == 0, db_of(pg))
    b = ctx.new_page(); b.goto(HOME); b.wait_for_timeout(600)
    check(f"{label} 清除C14 唯讀分頁沒有清除按鈕", b.evaluate("G5HelpWriter()") is False and b.locator("#clearAll").count() == 0)
    b.close()
    txt = pg.locator("#setBox").inner_text()
    check(f"{label} 清除C15 新字每句不超過 40 字", not sentences_over(txt), sentences_over(txt))
    check(f"{label} 清除 沒有 JS 錯誤", not errors, errors)
    ctx.close()


def flow_hide_sync(browser):
    """隱藏清單跟著跨裝置同步：A 隱藏 → 雲端那份有 hidden → B 加入後也隱藏；B 恢復 → A 在首頁自動換上（不 reload）。"""
    from e2e_sync import backend, STORE, EP as SEP
    def dev():
        c = browser.new_context(); c.add_init_script(FIXTURE); c.route(lambda u: u.startswith(SEP), backend); return c
    errors = []
    a = dev(); pa = a.new_page(); pa.on("pageerror", lambda e: errors.append(str(e)))
    pa.goto(HOME); pa.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pa.locator("#syncBox summary").click()
    pa.get_by_role("button", name="開啟跨裝置同步", exact=False).click(); pa.wait_for_timeout(1500)
    code = pa.evaluate("localStorage.getItem('g5sync.code')")
    pa.locator('button[data-hide="t-guoyu"]').click(); pa.locator('button[data-hide="t-guoyu"]').click()
    pa.wait_for_timeout(5500)
    cloud = json.loads((STORE.get((code, "g5help.v1")) or (0, "{}"))[1] or "{}")
    check("同步S1 A 隱藏後，雲端那份 g5help.v1 也有 hidden", "t-guoyu" in (cloud.get("hidden") or {}), cloud)
    b = dev(); pb = b.new_page(); pb.on("pageerror", lambda e: errors.append(str(e)))
    pb.goto(HOME + "#sync=" + code); pb.wait_for_timeout(3000)
    check("同步S2 B 加入後：國語那篇也隱藏、有「顯示已隱藏的 1 篇」", pb.locator('.subj[data-subj="國語"] .hcard[href="#h/t-guoyu"]').count() == 0 and pb.locator("#hidBox summary").inner_text() == "顯示已隱藏的 1 篇")
    pb.locator("#hidBox summary").click(); pb.locator("#hidBox").get_by_role("button", name="恢復").click()
    pb.wait_for_timeout(5500)
    cloud = json.loads((STORE.get((code, "g5help.v1")) or (0, "{}"))[1] or "{}")
    check("同步S3 B 恢復 → 雲端那份 hidden 清空", cloud.get("hidden") == {}, cloud)
    pa.reload(); pa.wait_for_timeout(3000)   # 同步只在開頁時抓雲端新版（sync.js 現行設計；與 e2e_sync「第一台重開拿到」同）
    check("同步S4 A 重開後也恢復（由本頁 accept 換上，不是 sync 直接寫）", pa.locator('.subj[data-subj="國語"] .hcard[href="#h/t-guoyu"]').count() == 1 and not db_of(pa).get("hidden"), db_of(pa))
    check("同步 沒有 JS 錯誤", not errors, errors)
    a.close(); b.close()


def flow_peek_sync(browser):
    """看過答案 peek 跨裝置取聯集（交辦 #2282）：A 記得 K1、B 記得 K2 且練得較多；B 加入時留 B 那份（雲端少了 K1），
    A 重開換上雲端那份後把 K1 併回去並上傳 ⇒ 雲端與兩台最後都有 K1、K2，之後不再來回上傳。另驗家長清除過的篇不把看過紀錄帶回來。"""
    from e2e_sync import backend, STORE, EP as SEP
    def dev(doc):
        seed = ("if(!sessionStorage.getItem('pk')){sessionStorage.setItem('pk','1');localStorage.setItem('g5help.v1'," + json.dumps(json.dumps(doc)) + ");}")
        c = browser.new_context(); c.add_init_script(FIXTURE + seed); c.route(lambda u: u.startswith(SEP), backend); return c
    def ent(n, peek):
        return {"lessonDone": True, "idx": n, "seed": 3, "streak": 0, "clean": 0, "solved": n, "mastered": False,
                "log": [{"t": 10 + i, "q": i, "clean": True, "wrongs": 0} for i in range(n)], "cur": None, "r": 1, "peek": peek}
    K1, K2 = "k" + "1" * 14, "k" + "2" * 14
    errors = []
    a = dev({"v": 1, "entries": {"p40-2-5": ent(4, {K1: 100})}}); pa = a.new_page(); pa.on("pageerror", lambda e: errors.append(str(e)))
    pa.goto(HOME); pa.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    pa.locator("#syncBox summary").click()
    pa.get_by_role("button", name="開啟跨裝置同步", exact=False).click(); pa.wait_for_timeout(1500)
    code = pa.evaluate("localStorage.getItem('g5sync.code')")
    pa.wait_for_timeout(4500)
    b = dev({"v": 1, "entries": {"p40-2-5": ent(9, {K2: 200})}}); pb = b.new_page(); pb.on("pageerror", lambda e: errors.append(str(e)))
    pb.goto(HOME + "#sync=" + code); pb.wait_for_timeout(6000)
    cloud = lambda: json.loads((STORE.get((code, "g5help.v1")) or (0, "{}"))[1] or "{}")
    mid = cloud().get("entries", {}).get("p40-2-5", {})
    check("看過P1 B 加入：練得多的 B 那份勝出（雲端 solved=9、只有 K2）", mid.get("solved") == 9 and mid.get("peek") == {K2: 200}, mid)
    pa.reload(); pa.wait_for_timeout(9000)
    c = cloud().get("entries", {}).get("p40-2-5", {})
    check("看過P2 A 換上雲端那份後把 K1 併回去並上傳：雲端 peek＝K1＋K2、solved 仍是 9", c.get("peek") == {K1: 100, K2: 200} and c.get("solved") == 9, c)
    sa = pa.evaluate("G5HelpPage.state('p40-2-5')")
    check("看過P3 A 本機也是聯集", (sa or {}).get("peek") == {K1: 100, K2: 200}, sa)
    pb.reload(); pb.wait_for_timeout(4000)
    sb = pb.evaluate("G5HelpPage.state('p40-2-5')")
    check("看過P4 B 重開也拿到聯集", (sb or {}).get("peek") == {K1: 100, K2: 200}, sb)
    rev = (STORE.get((code, "g5help.v1")) or (0, ""))[0]
    pa.wait_for_timeout(9000)
    check("看過P5 收斂後不再來回上傳（9 秒內雲端版本號沒變）", (STORE.get((code, "g5help.v1")) or (0, ""))[0] == rev, (rev, STORE.get((code, "g5help.v1"))[0]))
    # 家長在別台清除過（solved=0、沒有 peek）的篇：換上後不把這台記得的看過紀錄帶回來
    cleared = json.dumps({"v": 1, "entries": {"p40-2-5": {"lessonDone": False, "idx": 0, "seed": 1, "streak": 0, "clean": 0, "solved": 0, "mastered": False, "log": [], "cur": None, "r": 9}}, "hidden": {}})
    ok = pa.evaluate("(raw) => G5HelpApplyRemote('g5help.v1', raw)", cleared); pa.wait_for_timeout(500)
    sc = pa.evaluate("G5HelpPage.state('p40-2-5')")
    check("看過P6 換上已清除的那份：不把 K1、K2 帶回來", ok and "peek" not in (sc or {}) and "peek" not in json.loads(pa.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p40-2-5"], sc)
    # Opus 審 e84b623 B1 的反例：別台清除後又練了 1 題（solved=1、新世代 g）⇒ 不把 K1、K2 帶回來
    pa.evaluate("(raw) => G5HelpApplyRemote('g5help.v1', raw)", json.dumps({"v": 1, "entries": {"p40-2-5": dict(ent(9, {K1: 100, K2: 200}), g=1000)}, "hidden": {}}))
    pa.wait_for_timeout(500)
    again = json.dumps({"v": 1, "entries": {"p40-2-5": dict(ent(1, {}), g=2000, peek=None)}, "hidden": {}})
    ok = pa.evaluate("(raw) => G5HelpApplyRemote('g5help.v1', raw)", again); pa.wait_for_timeout(500)
    sr = pa.evaluate("G5HelpPage.state('p40-2-5')")
    check("看過P7 別台清除後又練 1 題（新世代）：不把 K1、K2 帶回來", ok and (sr or {}).get("solved") == 1 and "peek" not in (sr or {}), sr)
    check("看過 沒有 JS 錯誤", not errors, errors)
    a.close(); b.close()


def flow_withdraw(browser):
    """「你傳的題目」每筆還沒做好的都能撤回（兩段式確認）；送 op=withdraw（code＋傳題 id），成功後清單不再列。後端以記憶體模擬。"""
    items = [{"id": "u1-1", "time": 1791868600000, "subject": "自然", "note": "【測試】銀葉樹的板根是什麼？", "status": "new", "url": "", "doneAt": 0},
             {"id": "u2-2", "time": 1791868500000, "subject": "數學", "note": "第 6 題", "status": "done", "url": "https://windsorya.github.io/g5-help/#h/p38-6-2", "doneAt": 1791868550000}]
    sent, mode, held = [], {"withdraw": "ok", "hold": False}, []

    def gas(route):
        req = json.loads(route.request.post_data or "{}"); sent.append(req)
        if req.get("op") == "mine" and mode["hold"]:   # 扣住這次查詢，測試稍後才用當下的舊清單回它（W9）
            held.append((route, [dict(x) for x in items if x["status"] != "withdrawn"]))
            return
        if req.get("op") == "mine":
            body = {"ok": True, "lastFetch": 0, "items": [x for x in items if x["status"] != "withdrawn"]}
        elif req.get("op") == "withdraw":
            if mode["withdraw"] == "net":
                return route.abort()
            if mode["withdraw"] == "ok":
                for x in items:
                    if x["id"] == req.get("id"):
                        x["status"] = "withdrawn"
                body = {"ok": True}
            else:
                body = {"ok": False, "err": mode["withdraw"]}
        else:
            body = {"ok": False, "err": "bad-op"}
        route.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps(body))
    ctx, pg, errors = open_page(browser, url=HOME)
    pg.route("**/macros/s/**", gas)
    pg.evaluate("localStorage.setItem('g5sync.code','ABCDEFGHJKMN'); 0")
    pg.locator("#upBox summary").click()
    pg.wait_for_function("document.querySelectorAll('#upList .hcard').length === 2")
    wb = pg.locator('#upList button[data-wd="u1-1"]')
    check("撤回W1 還沒做好的那筆有「撤回」；做好了的那筆沒有", wb.inner_text() == "撤回" and pg.locator('#upList button[data-wd="u2-2"]').count() == 0)
    wb.click()
    check("撤回W2 按一次只變成「確定撤回？」＋「取消」，還沒送出", wb.inner_text() == "確定撤回？" and pg.locator("#upList button[data-wd-no]").is_visible() and not [r for r in sent if r.get("op") == "withdraw"])
    pg.locator("#upList button[data-wd-no]").click()
    check("撤回W3 按「取消」回到「撤回」、沒有送出", wb.inner_text() == "撤回" and not [r for r in sent if r.get("op") == "withdraw"])
    mode["withdraw"] = "done"
    wb.click(); wb.click(); pg.wait_for_timeout(400)
    check("撤回W4 後端說已做好：告訴家長不能撤回、清單照舊", "已經做好了" in pg.locator("#upWMsg").inner_text() and pg.locator("#upList .hcard").count() == 2, pg.locator("#upWMsg").inner_text())
    mode["withdraw"] = "net"
    wb.click(); wb.click(); pg.wait_for_timeout(400)
    check("撤回W5 沒有網路：說沒撤回成功、按鈕可以再按", "沒有撤回成功" in pg.locator("#upWMsg").inner_text() and wb.is_enabled() and wb.inner_text() == "撤回", pg.locator("#upWMsg").inner_text())
    mode["withdraw"] = "ok"
    wb.click(); wb.click()
    pg.wait_for_function("document.querySelectorAll('#upList .hcard').length === 1")
    w = [r for r in sent if r.get("op") == "withdraw"][-1]
    check("撤回W6 送出 op=withdraw、同步碼、傳題 id", w == {"op": "withdraw", "code": "ABCDEFGHJKMN", "id": "u1-1"}, w)
    check("撤回W7 撤回後清單只剩做好的那筆、告訴家長撤回了", "撤回了" in pg.locator("#upWMsg").inner_text() and "銀葉樹" not in pg.locator("#upList").inner_text(), pg.locator("#upWMsg").inner_text())
    # W9（Codex 審 81963cee）：撤回前送出的舊查詢晚到，不可讓已撤回的題目重新出現
    items.append({"id": "u3-3", "time": 1791868700000, "subject": "社會", "note": "第 2 題", "status": "new", "url": "", "doneAt": 0})
    mode["hold"] = True
    pg.locator("#upBox summary").click(); pg.locator("#upBox summary").click()   # 收起再打開＝重新查詢（這一次被扣住）
    pg.wait_for_timeout(300)
    mode["hold"] = False
    pg.locator("#upBox summary").click(); pg.locator("#upBox summary").click()   # 再查一次（照常回）
    pg.wait_for_function("document.querySelector('#upList').innerText.indexOf('第 2 題') >= 0")
    w3 = pg.locator('#upList button[data-wd="u3-3"]'); w3.click(); w3.click()
    pg.wait_for_function("document.querySelector('#upList').innerText.indexOf('第 2 題') < 0")
    for r0, snap in held:   # 舊查詢這時才回來，帶著撤回前的清單
        r0.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps({"ok": True, "lastFetch": 0, "items": snap}))
    pg.wait_for_timeout(500)
    check("撤回W9 撤回前送出的舊查詢晚到：已撤回的題目不會重新出現", len(held) == 1 and "第 2 題" not in pg.locator("#upList").inner_text(), (len(held), pg.locator("#upList").inner_text()[:200]))
    # W10（Codex 審 4317a96）：網路慢、兩次查詢都還在路上時，先回來的舊查詢（沒有撤回夾在中間）照樣要更新畫面，不能因為又發了一次就整個丟掉
    held.clear(); items[0]["status"] = "new"
    items.append({"id": "u4-4", "time": 1791868800000, "subject": "國語", "note": "第 9 題", "status": "new", "url": "", "doneAt": 0})
    mode["hold"] = True
    pg.locator("#upBox summary").click(); pg.locator("#upBox summary").click(); pg.wait_for_timeout(300)   # A 卡住
    pg.locator("#upBox summary").click(); pg.locator("#upBox summary").click(); pg.wait_for_timeout(300)   # B 也卡住
    mode["hold"] = False
    snap_done = [dict(x) for x in items if x["status"] != "withdrawn"]
    for x in snap_done:
        if x["id"] == "u4-4": x.update(status="done", url="https://windsorya.github.io/g5-help/#h/p38-6-2")
    if held:
        held[0][0].fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps({"ok": True, "lastFetch": 0, "items": snap_done}))
    pg.wait_for_timeout(500)
    a_applied = "第 9 題" in pg.locator("#upList").inner_text() and "做好了" in pg.locator("#upList").inner_text()
    for r0, snap in held[1:]:
        r0.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body=json.dumps({"ok": True, "lastFetch": 0, "items": snap_done}))
    check("撤回W10 慢網路：先回來的查詢照樣更新畫面（沒有撤回夾在中間）", len(held) >= 1 and a_applied, (len(held), pg.locator("#upList").inner_text()[:200]))
    news = [pg.locator("#upWMsg").inner_text(), "確定撤回？", "這題已經做好了，不能撤回。", "沒有撤回成功（可能沒有網路），請稍後再試。"]
    check("撤回W8 新字每句不超過 40 字", not sentences_over("\n".join(news)), sentences_over("\n".join(news)))
    check("撤回 沒有 JS 錯誤", not errors, errors)
    ctx.close()


def main():
    with sync_playwright() as p:
        cr = p.chromium.launch()
        if BASE.startswith("https:"):
            flow_video_live(cr, "線上Chromium")
        flow_full(cr, "桌機", {"viewport": {"width": 1280, "height": 900}}, width=1280)
        flow_full(cr, "手機390", {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True, "device_scale_factor": 2}, width=390, shots=True)
        flow_codex_r1(cr)
        flow_storage_blocked(cr)
        flow_corrupt_store(cr)
        flow_codex_help_r1(cr)
        flow_codex_help_r2(cr)
        flow_single_writer(cr, "Chromium")
        flow_codex_r4(cr)
        flow_codex_r5(cr)
        flow_codex_r6(cr)
        flow_confused(cr)
        flow_home(cr)
        flow_migrate(cr)
        flow_steps(cr, "手機390", {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True}, shots=True)
        flow_dark(cr)
        flow_hide(cr)
        flow_delete(cr)
        flow_clear(cr)
        flow_hide_sync(cr)
        flow_peek_sync(cr)
        flow_withdraw(cr)
        cr.close()
        wk = p.webkit.launch()
        ipad = p.devices["iPad (gen 7)"]
        flow_full(wk, "iPad", ipad, width=ipad["viewport"]["width"], shots=True)
        flow_steps(wk, "iPad", ipad)
        flow_single_writer(wk, "WebKit")
        flow_codex_r5(wk, "WebKit")
        flow_codex_r6(wk, "WebKit")
        flow_hide(wk, "WebKit")
        flow_delete(wk, "WebKit")
        flow_clear(wk, "WebKit")
        flow_peek_sync(wk)   # Opus 審 e84b623：commit 寫兩個瀏覽器，原本只在 Chromium 跑
        if BASE.startswith("https:"):
            flow_video_live(wk, "線上iPad", ipad)
        wk.close()
    bad = [r for r in RESULTS if not r[1]]
    print(f"\n{len(RESULTS) - len(bad)}/{len(RESULTS)} PASS")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
