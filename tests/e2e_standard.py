#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""難題站「孩子用的教學網站」固定標準②④⑤的主閘：真瀏覽器 DOM（與自然站 tests/e2e_v3.py、數學站 tests/e2e.py 同一段判準）。

由來（交辦 #1431）：Codex 審 g5-help f53bd540 抓到 tests/standard.test.js 用文字猜 HTML 的五個假通過——非陣列影片、
<path/> 空圖、data-href 切換列、data-name／data-content 的 robots meta、&#23383; 字元參照讓 41 字句量成 0 字。
自然站、數學站在同型問題連三輪後把②④⑤的主閘搬到真瀏覽器（a.href、meta.content、getBBox＋getComputedStyle），
難題站一直沒跟上；這支補上，下面「三站共通」那段與兩站逐字相同（改要三站一起改）。
standard.test.js 的②④⑤靜態判準留作秒級粗篩；兩者不一致時以本檔為準。①影片、③句長不在這裡：①是資料檢查（standard.test.js），
③的主閘是 tests/e2e_kidtext.py 的瀏覽器採字。

走法：Chromium 390 寬、減少動態效果；首頁量④⑤；每一篇通用格式（kind=steps）照孩子的順序走完每一步（確認題選對、其餘按「我懂了」），
每一步剛出現（還是目前這一步）時就量那一步的圖②、走完回頭再量一次，教學頁再量一次④⑤；第一篇拿來做 std_selftest
（把頁面 DOM 改成 Codex 報告的反例，斷言抓得到、合法線段不誤判）與 timing_selftest（目前這一步沒圖的反例）。
跑法：python3.12 tests/e2e_standard.py [--base https://windsorya.github.io/g5-help/]；tools/post.sh verify 會跑（#2191 前漏接，主閘不在上線路徑上）。
"""
import json
import re
import sys
from contextvars import ContextVar
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from e2e import HOME, last_ask, open_page  # noqa: E402

# Each formal/probe run owns its results. Nested expected failures cannot leak
# into the real run, and e2e.py's global RESULTS is never reused here.
_RESULTS = ContextVar('standard_results')


def check(name, cond, detail=''):
    _RESULTS.get().append((name, bool(cond), detail))
    print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else f'  ← {detail}'))


def result_rc(results):
    return 1 if any(not row[1] for row in results) else 0

MOBILE = {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True}


# ===== 三站共通「標準 DOM」判準（主閘）：自然站 tests/e2e_v3.py 與數學站 tests/e2e.py 這一段逐字相同 =====
# 由來：tests/standard.test.js 的②④⑤用正規表達式讀 HTML，Codex 連 3 輪找到假通過與誤判（title=' href="網址"'、
# <meta name="robots" title=" content='noindex'">、data-href／data-content、<path d="M0 0"/>、<path d="M10 10"/>、
# <rect width="0.0">、<circle r="0.0"/> 判有圖、合法 <line x1="50" y1="50" x2="0" y2="50"> 判沒圖）。
# 根因是用文字猜瀏覽器怎麼解析、怎麼畫；這裡直接問瀏覽器：a.href、meta.content 是解析後的真屬性，
# 圖用 getBBox／getBoundingClientRect／getComputedStyle／getTotalLength／isPointInFill 量「真的畫出了東西」。
# 每條判準在 std_selftest() 都有自檢：把頁面 DOM 改成報告的反例，斷言抓得到（合法線段不誤判）。
STD_SITES = {"sci": ("https://windsorya.github.io/g5-sci-review/", "五上自然複習"),
             "math": ("https://windsorya.github.io/g5-math-review/", "五上數學複習"),
             "help": ("https://windsorya.github.io/g5-help/", "難題解說"),
             "chi": ("https://windsorya.github.io/g5-chinese-review/", "五上國語複習"),
             "soc": ("https://windsorya.github.io/g5-social-review/", "五上社會複習"),
             "wrong": ("https://windsorya.github.io/g5-wrong-review/", "錯題複習")}
# ④切換列：#siteNav 恰一個；裡面每個 <a> 的 a.href（瀏覽器解析後）恰為另外兩站、看得見；恰一個 aria-current="page" 且字是本站名。
STD_NAV_JS = """() => { const navs = document.querySelectorAll('#siteNav'), nav = navs[0];
  if (navs.length !== 1) return {navs: navs.length};
  // 看得見＝有大小、visibility 是 visible，而且一路往上每一層都沒 display:none、透明度相乘 >0（Codex 審 f0422ce／b1ae271：上層 opacity:0 假通過）
  const seen = (e) => { const r = e.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0) || getComputedStyle(e).visibility !== 'visible') return false;
    let op = 1; for (let n = e; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === 'none') return false; op *= parseFloat(cs.opacity); } return op > 0; };
  const as = [...nav.querySelectorAll('a')];
  return {navs: 1, hrefs: as.map((a) => a.href), hidden: as.filter((a) => !seen(a)).map((a) => a.href || a.outerHTML.slice(0, 80)),
          current: [...nav.querySelectorAll('[aria-current="page"]')].map((e) => (seen(e) ? '' : '（看不見）') + (e.textContent || '').trim())}; }   // 每個標記都算數量；看不見的直接不等於本站名（Codex 審 4d8b1e0／f26e093：先濾掉再數，藏起來的重複標記會假通過）"""
# ⑤收錄：<head> 裡的 meta[name=robots]，用真屬性 meta.content，逗號／空白切開後有 noindex。
STD_ROBOTS_JS = """() => [...document.querySelectorAll('meta[name="robots" i]')].map((m) => ({content: m.content, inHead: !!document.head && document.head.contains(m)}))"""
# ②圖：sel 選到的每個容器（一步／一種說法）至少一張 svg[role=img]；每張都要有 aria-label（去空白後 ≥4 字）、本身看得見，
# 而且裡面至少一個繪圖元素真的畫出東西：不在 defs 等不畫的區塊、沒被 display／visibility／opacity 藏起來、getBBox 與畫面上的框
# 有大小且落在圖框內；描邊要 stroke 不是 none、寬度 >0、路徑長度 >0；填色要 fill 不是 none、寬高都 >0、內部取樣點真的在填色區。
# 蓋滿整張圖的 <rect> 是底色，不算「畫了東西」。
STD_FIG_JS = """(sel) => {
  const SKIP = 'defs,clipPath,mask,marker,pattern,symbol,linearGradient,radialGradient,filter';
  const GEO = new Set(['path', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse']), AREA = new Set(['rect', 'circle', 'ellipse']);
  const num = (x) => { const v = parseFloat(x); return Number.isFinite(v) ? v : 0; };
  const noPaint = (c) => !c || c === 'none' || c === 'transparent' || /^rgba\\(.*,\\s*0(\\.0*)?\\)$/.test(c);
  const shown = (el, svg) => { let op = 1;
    for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === 'none') return false; op *= num(cs.opacity); }   // 一路查到最外層：圖的容器被設成透明也算看不見
    return getComputedStyle(el).visibility === 'visible' && op > 0; };
  function drawn(el, svg, vb, box) {
    const tag = el.tagName.toLowerCase(), cs = getComputedStyle(el);
    if (el.closest(SKIP) || !shown(el, svg)) return '';
    let bb; try { bb = el.getBBox(); } catch (e) { return ''; }
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 || r.height > 0)) return '';
    if (r.right < box.left - 1 || r.left > box.right + 1 || r.bottom < box.top - 1 || r.top > box.bottom + 1) return '';
    if (tag === 'rect' && vb.width > 0 && vb.height > 0 && bb.x <= vb.x + vb.width * 0.02 && bb.y <= vb.y + vb.height * 0.02 &&
        bb.x + bb.width >= vb.x + vb.width * 0.98 && bb.y + bb.height >= vb.y + vb.height * 0.98) return '';
    const fillOn = !noPaint(cs.fill) && num(cs.fillOpacity) > 0, strokeOn = !noPaint(cs.stroke) && num(cs.strokeWidth) > 0 && num(cs.strokeOpacity) > 0;
    if (tag === 'text') return (el.textContent || '').trim() && bb.width > 0 && bb.height > 0 && (fillOn || strokeOn) ? 'text' : '';
    // <image>／<use> 不算：量得到寬高，量不到它真的畫了什麼——<use href="#r" fill="none" stroke="none"> 什麼都沒畫也有寬高
    // （Codex 審 g5-help 5d3cf6f2），<image> 圖檔讀不到也一樣。三站內容 0 處用到（2026-10-18 實查），畫圖一律用基本圖形或 <text>。
    if (!GEO.has(tag) || (AREA.has(tag) && !(bb.width > 0 && bb.height > 0))) return '';
    if (strokeOn && typeof el.getTotalLength === 'function' && el.getTotalLength() > 0) return tag + '描邊';
    if (fillOn && tag !== 'line' && bb.width > 0 && bb.height > 0)
      for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++)
        if (el.isPointInFill({x: bb.x + bb.width * (i + 0.5) / 9, y: bb.y + bb.height * (j + 0.5) / 9})) return tag + '填色';
    return '';
  }
  return [...document.querySelectorAll(sel)].map((c) => ({
    where: (c.innerText || c.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 30),
    figs: [...c.querySelectorAll('svg[role="img"]')].map((svg) => {
      const box = svg.getBoundingClientRect(), v = svg.viewBox && svg.viewBox.baseVal;
      const vb = v && v.width > 0 ? v : {x: 0, y: 0, width: svg.width.baseVal.value, height: svg.height.baseVal.value};
      const kinds = box.width > 0 && box.height > 0 && shown(svg, svg) ? [...svg.querySelectorAll('*')].map((el) => drawn(el, svg, vb, box)).filter(Boolean) : [];
      return {label: (svg.getAttribute('aria-label') || '').replace(/\\s/g, ''), seen: box.width > 0 && box.height > 0, n: kinds.length, kinds: [...new Set(kinds)].slice(0, 4)};
    })}));
}"""


def std_nav_problems(st, self_key):
    if not isinstance(st, dict) or st.get("navs") != 1:
        return [f"#siteNav 應恰一個，實際：{st.get('navs') if isinstance(st, dict) else st!r}"]
    want, bad = sorted(u for k, (u, _) in STD_SITES.items() if k != self_key), []
    if sorted(st["hrefs"]) != want:
        bad.append(f"siteNav 連結應恰為 {want}，瀏覽器讀到 {st['hrefs']}")
    if st["hidden"]:
        bad.append(f"siteNav 有看不見的連結：{st['hidden']}")
    if st["current"] != [STD_SITES[self_key][1]]:
        bad.append(f"siteNav 應恰一個 aria-current=\"page\" 寫「{STD_SITES[self_key][1]}」，實際：{st['current']}")
    return bad


def std_robots_ok(metas):
    return any(m.get("inHead") and "noindex" in re.split(r"[\s,]+", str(m.get("content") or "").lower()) for m in (metas or []))


def std_fig_problems(conts, min_conts=1):
    """STD_FIG_JS 的結果 → 問題清單。容器數不足、某容器沒有 svg[role=img]、某張圖缺 aria-label／看不見／沒有畫出東西都算。"""
    bad = [] if len(conts) >= min_conts else [f"只找到 {len(conts)} 個容器（至少要 {min_conts}）"]
    for i, c in enumerate(conts):
        if not c["figs"]:
            bad.append(f"第 {i + 1} 格「{c['where']}」沒有 svg[role=img]")
        for f in c["figs"]:
            if len(f["label"]) < 4 or not f["seen"] or f["n"] < 1:
                bad.append(f"第 {i + 1} 格「{c['where']}」的圖：aria-label「{f['label']}」、看得見={f['seen']}、畫出 {f['n']} 個元素")
    return bad


def std_page_check(page, label, self_key):
    """④⑤：在真頁面上量切換列與 noindex。"""
    nav = std_nav_problems(page.evaluate(STD_NAV_JS), self_key)
    check(f"{label} 標準DOM④ 切換列：a.href 恰為另外兩站、看得見、恰一個 aria-current 是本站名", not nav, nav)
    metas = page.evaluate(STD_ROBOTS_JS)
    check(f"{label} 標準DOM⑤ <head> 的 meta[name=robots] 真屬性 content 含 noindex", std_robots_ok(metas), metas)


# 自檢反例（出自 Codex 報告 g5-sci-review-4b559c4a／63b048db、g5-math-review-9545348b）：True＝判準應判「有圖」。
STD_FIG_CASES = [
    ("空圖", "", False), ("只有註解", "<!-- <rect width='10' height='10'/> -->", False), ("<path/>", "<path/>", False),
    ('<path d="M0 0"/>', '<path d="M0 0" stroke="black" stroke-width="4"/>', False),
    ('<path d="M10 10"/>', '<path d="M10 10" stroke="black" stroke-width="4"/>', False),
    ('<rect width="0.0" height="10">', '<rect x="10" y="10" width="0.0" height="10" fill="black"/>', False),
    ('<circle r="0.0"/>', '<circle cx="50" cy="50" r="0.0" fill="black" stroke="black" stroke-width="2"/>', False),
    ("只有底色（蓋滿整張的 rect）", '<rect width="100%" height="100%" fill="black"/>', False),
    ("fill、stroke 都是 none", '<rect x="10" y="10" width="50" height="50" fill="none" stroke="none"/>', False),
    ("opacity=0", '<rect x="10" y="10" width="50" height="50" fill="black" opacity="0"/>', False),
    ("只在 <defs> 裡", '<defs><rect x="10" y="10" width="50" height="50" fill="black"/></defs>', False),
    ("畫在圖框外", '<rect x="-5000" y="-5000" width="50" height="50" fill="black"/>', False),
    ("只有填色的斜直線（沒有面積）", '<path d="M10 10 L60 60" fill="black"/>', False),
    ("transform=scale(0)", '<rect x="10" y="10" width="50" height="50" fill="black" transform="scale(0)"/>', False),
    ("<use> 參照的圖形沒填色也沒描邊", '<defs><rect id="stdUseR" x="10" y="10" width="40" height="30"/></defs><use href="#stdUseR" fill="none" stroke="none"/>', False),
    ("<image> 圖檔讀不到", '<image href="data:image/png;base64,AAAA" x="10" y="10" width="40" height="30"/>', False),
    ('合法線段 <line x1="50" y1="50" x2="0" y2="50">', '<line x1="50" y1="50" x2="0" y2="50" stroke="black" stroke-width="4"/>', True),
    ("合法小方塊", '<rect x="10" y="10" width="40" height="30" fill="black"/>', True),
    ("合法圓", '<circle cx="50" cy="50" r="10" fill="black"/>', True),
    ("合法文字", '<text x="20" y="40" font-size="20" fill="black">字</text>', True),
]
STD_MUTATE_JS = """([mode, sel, html]) => {
  window.__stdSaved = window.__stdSaved || {};
  if (mode === 'fig') { const svg = document.querySelector(sel); window.__stdSaved.fig = [svg, svg.innerHTML, svg.getAttribute('aria-label')];
    if (html === null) svg.removeAttribute('aria-label'); else svg.innerHTML = html; return; }
  if (mode === 'figback') { const [svg, inner, lab] = window.__stdSaved.fig; svg.innerHTML = inner; svg.setAttribute('aria-label', lab); return; }
  if (mode === 'nav') { const nav = document.getElementById('siteNav'); window.__stdSaved.nav = nav.innerHTML; (new Function('nav', html))(nav); return; }
  if (mode === 'navback') { const nv = document.getElementById('siteNav'); nv.style.opacity = ''; if (nv.parentElement) nv.parentElement.style.opacity = '';
    nv.innerHTML = window.__stdSaved.nav; document.querySelectorAll('[data-std-extra]').forEach((e) => e.remove()); return; }
  if (mode === 'robots') { const ms = [...document.querySelectorAll('meta[name="robots" i]')]; window.__stdSaved.robots = ms.map((m) => m.cloneNode());
    ms.forEach((m) => m.remove());
    if (html.startsWith('<!--')) window.__stdSaved.cmt = document.head.appendChild(document.createComment(html.slice(4, -3)));
    else document.head.insertAdjacentHTML('beforeend', html.replace('<meta', '<meta data-std-extra'));
    return; }
  if (mode === 'robotsback') { document.querySelectorAll('meta[data-std-extra]').forEach((e) => e.remove());
    if (window.__stdSaved.cmt) { window.__stdSaved.cmt.remove(); window.__stdSaved.cmt = null; }
    window.__stdSaved.robots.forEach((m) => document.head.appendChild(m)); return; }
}"""


def std_selftest(page, label, self_key, fig_sel):
    """自檢：在真頁面上把 DOM 改成報告的反例，斷言主閘判準抓得到；改完立刻復原。fig_sel＝要拿來改的那張 svg（第一張），其容器也要給。"""
    svg_sel, cont_sel = fig_sel
    # ②
    wrong = []
    for name, html, want in STD_FIG_CASES + [("拿掉 aria-label", None, False)]:
        page.evaluate(STD_MUTATE_JS, ["fig", svg_sel, html])
        got = not std_fig_problems(page.evaluate(STD_FIG_JS, cont_sel)[:1])
        page.evaluate(STD_MUTATE_JS, ["figback", svg_sel, ""])
        if got != want:
            wrong.append(f"{name}：應判{'有' if want else '沒有'}圖，判成{'有' if got else '沒有'}")
    check(f"{label} 標準DOM自檢② {len(STD_FIG_CASES) + 1} 個圖的反例／正例都判對（含 <path d=\"M0 0\"/>、<rect width=\"0.0\">、<circle r=\"0.0\"/>、合法 <line x2=\"0\">）", not wrong, wrong)
    # 圖的容器（例如 .sfig）設成透明：圖本身完好也要判看不見（Codex 審 f0422ce／b1ae271）
    page.evaluate("(sel) => { const s = document.querySelector(sel + ' svg[role=img]'); s.parentElement.dataset.stdOp = s.parentElement.style.opacity; s.parentElement.style.opacity = '0'; }", cont_sel)
    outer_hidden = bool(std_fig_problems(page.evaluate(STD_FIG_JS, cont_sel)[:1]))
    page.evaluate("(sel) => { const s = document.querySelector(sel + ' svg[role=img]'); s.parentElement.style.opacity = s.parentElement.dataset.stdOp || ''; }", cont_sel)
    check(f"{label} 標準DOM自檢② 圖的外層透明要判成看不見", outer_hidden)
    check(f"{label} 標準DOM自檢② 改完復原後真圖仍判有圖", not std_fig_problems(page.evaluate(STD_FIG_JS, cont_sel)[:1]))
    # ④（JS 片段：參數 nav＝#siteNav 元素）
    other = [u for k, (u, _) in STD_SITES.items() if k != self_key]
    nav_cases = [
        ("href 移進 title（title=' href=\"網址\"'）", "nav.querySelectorAll('a').forEach((a) => { a.setAttribute('title', ' href=\"' + a.getAttribute('href') + '\"'); a.removeAttribute('href'); });"),
        ("href 改成 data-href", "nav.querySelectorAll('a').forEach((a) => { a.setAttribute('data-href', a.getAttribute('href')); a.removeAttribute('href'); });"),
        ("一個連結改指本站", f"nav.querySelector('a').setAttribute('href', {json.dumps(STD_SITES[self_key][0])});"),
        ("移除兩個 <a>、網址留在別處", "nav.querySelectorAll('a').forEach((a) => a.remove()); const s = document.createElement('script'); s.type = 'text/plain'; s.dataset.stdExtra = 1; s.textContent = " + json.dumps(" ".join(other)) + "; document.body.appendChild(s);"),
        ("連結藏起來（display:none）", "nav.querySelectorAll('a').forEach((a) => { a.style.display = 'none'; });"),
        ("連結透明（opacity:0）", "nav.querySelectorAll('a').forEach((a) => { a.style.opacity = '0'; });"),
        ("整個切換列的外層透明", "nav.parentElement.style.opacity = '0';"),
        ("本站標記藏起來（display:none）", "nav.querySelector('[aria-current]').style.display = 'none';"),
        ("多一個藏起來的本站標記", "const x = document.createElement('span'); x.setAttribute('aria-current', 'page'); x.hidden = true; x.textContent = '重複'; nav.appendChild(x);"),
        ("拿掉 aria-current", "nav.querySelectorAll('[aria-current]').forEach((e) => e.removeAttribute('aria-current'));"),
        ("aria-current 字不是本站名", "nav.querySelector('[aria-current]').textContent = '別站';"),
        ("多一個 #siteNav", "const d = nav.cloneNode(true); d.dataset.stdExtra = 1; document.body.appendChild(d);"),
        ("相對網址 href=\"g5-help/\"（解析後不是那個站）", "nav.querySelector('a').setAttribute('href', 'g5-help/');"),
    ]
    wrong = []
    for name, js in nav_cases:
        page.evaluate(STD_MUTATE_JS, ["nav", "", js])
        if not std_nav_problems(page.evaluate(STD_NAV_JS), self_key):
            wrong.append(name)
        page.evaluate(STD_MUTATE_JS, ["navback", "", ""])
    check(f"{label} 標準DOM自檢④ {len(nav_cases)} 個切換列反例都抓得到", not wrong, wrong)
    check(f"{label} 標準DOM自檢④ 復原後真切換列通過", not std_nav_problems(page.evaluate(STD_NAV_JS), self_key))
    # ⑤
    rb_cases = [
        ("<meta name=\"robots\" title=\" content='noindex'\">", "<meta name=\"robots\" title=\" content='noindex'\">", False),
        ("<meta name=\"robots\" data-content=\"noindex\">", '<meta name="robots" data-content="noindex,nofollow">', False),
        ("robots meta 包在註解裡", '<!--<meta name="robots" content="noindex,nofollow">-->', False),
        ("content=\"index,follow\"", '<meta name="robots" content="index,follow">', False),
        ("content=\"noindexer\"（不是 noindex 這個字）", '<meta name="robots" content="noindexer">', False),
        ("合法：大寫 NAME=ROBOTS CONTENT=NOINDEX", '<meta name="ROBOTS" content="NOINDEX, NOFOLLOW">', True),
    ]
    wrong = []
    for name, html, want in rb_cases:
        page.evaluate(STD_MUTATE_JS, ["robots", "", html])
        got = std_robots_ok(page.evaluate(STD_ROBOTS_JS))
        page.evaluate(STD_MUTATE_JS, ["robotsback", "", ""])
        if got != want:
            wrong.append(f"{name}：應判{want}，判成{got}")
    check(f"{label} 標準DOM自檢⑤ {len(rb_cases)} 個 robots meta 反例／正例都判對", not wrong, wrong)
    check(f"{label} 標準DOM自檢⑤ 復原後真 meta 通過", std_robots_ok(page.evaluate(STD_ROBOTS_JS)))
# ===== 共通「標準 DOM」判準到此 =====


def walk_lesson(page, steps):
    """照孩子的順序走完每一步（確認題選對才往下，沒有確認題按「我懂了，下一步」），停在答案卡。
    每一步剛出現、還是「目前這一步」的當下就量圖，回傳 [(第幾步, 問題)]。
    由來：Codex 審 5d3cf6f2——走完才量，「#lesson .lstep:last-child svg{visibility:hidden}」這種「正在學的那一步沒圖、
    答案卡出來後圖才出現」會被放過。"""
    now = []
    for k, s in enumerate(steps, 1):
        sec = f'#lesson section[data-step="{k}"]'
        page.wait_for_selector(sec)
        now += [(k, p) for p in std_fig_problems(page.evaluate(STD_FIG_JS, sec))]
        if s["a"] is not None:
            last_ask(page).locator(f'.chip[data-i="{s["a"]}"]').click()
        else:
            page.locator(f"{sec} button[data-next]").click()
    page.wait_for_selector(f'#lesson section[data-step="{len(steps) + 1}"]')   # 最後一張是「答案」，不在每步一圖的範圍
    return now


STEP_HIDE_CSS = "#lesson .lstep:last-child svg{visibility:hidden}"   # Codex 審 5d3cf6f2 的反例：目前這一步沒圖，答案卡出來後圖才出現


def timing_selftest(browser, post):
    """Use the same flow and exit calculation as the CLI, including consumers.

    Only input CSS differs. A browser-start exception cannot satisfy the probe;
    the exact lesson/steps must fail while all unrelated checks remain green.
    """
    positive_rc, positive = run_standard(browser, posts=[post], selftests=False)
    negative_rc, negative = run_standard(browser, posts=[post], css=STEP_HIDE_CSS, selftests=False)
    label = f"{post['id']} 標準DOM② 每一步剛出現"
    good = [r for r in positive if r[0].startswith(label)]
    bad = [r for r in negative if r[0].startswith(label)]
    expected = set(range(1, len(post['steps']) + 1))
    flagged = {int(m.group(1)) for row in bad for detail in row[2]
               if (m := re.match(r'第 (\d+) 步當下：', detail))}
    ok = (positive_rc == 0 and len(good) == 1 and good[0][1]
          and negative_rc == 1 and len(bad) == 1 and not bad[0][1]
          and flagged == expected and all(r[1] for r in negative if not r[0].startswith(label)))
    message = f"{post['id']} 標準DOM自檢② 反例未使正式主流程失敗"
    check(message, ok, {'positive_rc': positive_rc, 'negative_rc': negative_rc, 'flagged': sorted(flagged)})
    # Independent assertion catches a mutated final rc=0 too. It is not a
    # substitute for the formal result check: both routes are exercised above.
    if not ok:
        raise AssertionError(message)


def flow_standard_dom(browser, posts=None, css=None, selftests=True):
    """三站共通標準的主閘（真瀏覽器 DOM，Chromium 390 寬）：④切換列 ⑤noindex ②每一步都有圖，每條附自檢（std_selftest）。"""
    ctx, page, errors = open_page(browser, MOBILE, url=HOME, reduced_motion="reduce")
    page.wait_for_selector("#siteNav")
    std_page_check(page, "首頁", "help")
    if posts is None:
        posts = page.evaluate("window.G5Hard.LIST.filter((e) => e.kind === 'steps' && (e.steps || []).length)"
                              ".map((e) => ({id: e.id, steps: e.steps.map((s) => ({a: s.check ? s.check.a : null}))}))")
    ctx.close()
    check("標準DOM② 至少有一篇通用格式（每一步要有圖的那種）可以量", len(posts) >= 1, posts)
    tested = False
    for post in posts:
        pid, steps = post["id"], post["steps"]
        ctx, page, errors = open_page(browser, MOBILE, url=HOME + "#h/" + pid, reduced_motion="reduce")
        page.wait_for_selector("#entry:not([hidden])")
        if css:
            page.add_style_tag(content=css)
        page.get_by_role("button", name="開始學").click()
        now = [f"第 {k} 步當下：{p}" for k, p in walk_lesson(page, steps)]
        check(f"{pid} 標準DOM② 每一步剛出現（還是目前這一步）時，就有看得見、真的畫出東西的圖", not now, now)
        cont_sel = ", ".join(f'#lesson section[data-step="{k}"]' for k in range(1, len(steps) + 1))
        figs = std_fig_problems(page.evaluate(STD_FIG_JS, cont_sel), min_conts=len(steps))
        check(f"{pid} 標準DOM② 走完 {len(steps)} 步回頭看，每一步的圖都還在", not figs, figs)
        std_page_check(page, f"{pid} 教學頁", "help")
        if selftests and not tested:
            std_selftest(page, pid, "help", ('#lesson section[data-step="1"] svg[role="img"]', '#lesson section[data-step="1"]'))
            timing_selftest(browser, post)
            tested = True
        check(f"{pid} 標準DOM 走教學沒有 JS 錯誤", not errors, errors)
        ctx.close()
    if selftests:
        check("標準DOM 自檢至少在一篇真頁面上跑過", tested)


def run_standard(browser, posts=None, css=None, selftests=True):
    """Formal CLI body and selftest body; every invocation has an isolated sink."""
    results = []
    token = _RESULTS.set(results)
    try:
        flow_standard_dom(browser, posts=posts, css=css, selftests=selftests)
        return result_rc(results), results
    finally:
        _RESULTS.reset(token)


def main():
    with sync_playwright() as p:
        cr = p.chromium.launch()
        try:
            rc, results = run_standard(cr)
        finally:
            cr.close()
    bad = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(bad)}/{len(results)} PASS")
    return rc


if __name__ == "__main__":
    sys.exit(main())
