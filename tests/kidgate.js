// 設計 D・B2（Codex 設計者，#1347）：孩子「實際看得到的字」的用詞閘、句長閘——主閘。
// 在真瀏覽器裡（tests/e2e_kidtext.py 用 add_script_tag 注入本檔）每做一個動作就採一次畫面上可見的文字，交給 evaluate() 判。
// 不再用原始碼 regex 重建畫面（tests/kidtext.js 降為輔助：欄位、詞表、案例完整性）。
//
// 採字規則：
//   ・收：所有可見文字節點，含標題、選項、按鈕、回饋、圖說、SVG <text>；HTML entity 由瀏覽器解碼。
//   ・不收：script／style、hidden 或 display:none／visibility:hidden 的祖先、未展開 <details>（summary 除外）、未觸發的分支（本來就不在 DOM）。
//   ・合併：同一個區塊（最近的非 inline 祖先；<button>、<summary>、<p>、<li>、<h1-6>、SVG <text> 一律自成一塊）裡跨 <span>、<b> 的字合成一句再量；
//     <br>、區塊邊界、white-space 保留的換行（.fb 是 pre-line）才是句界；螢幕變窄產生的自動折行不是句界（量的是 DOM 文字，不是排版）。
//   ・句長：句界再加「。！？」切句，數非空白字元（Array.from 逐字），上限固定 40（小五；年級換算另由 hard.test 測，不跟執行日期漂移）。
// 用詞規則（設計 D：可獨立到達的閱讀單元必須自足）：
//   ・閱讀單元＝題目卡上方說明（#lead 等，進每一篇都先顯示）＋其中一個：教學（#lesson，步驟依序出現，前面步驟必然讀過）／
//     目前這一題練習（#practice，每題重畫，不借用前一題、也不借用教學）／影片區（#vidBox 展開時）。首頁、切換列各自一單元。
//   ・難詞（G5Hard.HARD_WORDS＋本篇 words）在單元裡「第一次出現」就要附白話：詞（白話）、白話（詞）或 叫「詞」。看不見的解釋不算。
// 區域分類：每一個可見文字都要落在下面某一區；落不到＝「未歸類的可見文字」，直接算違規（新加的畫面字沒有對應規則就不能過）。
//   kid＝兩道閘都套；label＝首頁卡片的篇名／出處（名稱，不要求附白話，只量句長）；
//   exam＝考卷原題（#src、#prob：照考卷原文，不能改寫，兩道閘都不套，由教學負責解釋）；parent／system＝給家長或系統狀態（不在本閘範圍，列為剩餘風險）。
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (root) { root.KidGate = api; }
}(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  var MAX = 40;
  var SVG = 'http://www.w3.org/2000/svg';
  // #2164：.g5s-banner＝頁首同步提醒（給爸媽的操作說明，歸 parent）
  var REGIONS = [   // [selector, 類別, 單元]；依序比對 el.closest(selector)，先中先用
    ['#saveWarn', 'system', 'system'],
    // 家長功能（2026-10-13）：撤回按鈕與訊息、家長設定也量句長（家長設定在首頁，兩道閘都套）
    ['#upWMsg', 'label', 'parent'], ['#upList .hact', 'label', 'parent'], ['#setBox', 'kid', 'home'],
    ['#upBox', 'parent', 'parent'], ['#syncBox', 'parent', 'parent'], ['.g5s-banner', 'parent', 'parent'], ['#parentBox', 'parent', 'parent'],
    ['.brandbar', 'kid', 'nav'], ['#siteNav', 'kid', 'nav'], ['.hero', 'kid', 'nav'], ['#entry > .back', 'kid', 'nav'],   // .brandbar＝六站共同站名「荳荳研究所」（2026-10-18）
    ['#subjects .hcard', 'label', 'home'], ['#subjects', 'kid', 'home'], ['#home > .panel', 'kid', 'home'],
    ['#src', 'exam', 'top'], ['#prob', 'exam', 'top'], ['#lead', 'kid', 'top'], ['#topBtns', 'kid', 'top'], ['#mastery', 'kid', 'top'],
    ['#lesson', 'kid', 'lesson'], ['#practice', 'kid', 'practice'], ['#vidBox', 'kid', 'video']
  ];
  var UNITS = ['lesson', 'practice', 'video'];   // 這三種各自接在 top 後面成為一個閱讀單元
  var SELF_BLOCK = /^(BUTTON|SUMMARY|P|LI|H1|H2|H3|H4|H5|H6|TD|TH|OPTION)$/;

  function countChars(s) { return Array.from(String(s).replace(/\s+/g, '')).length; }
  function sentences(text) {
    return String(text).split(/[。！？\n]/).map(function (s) { return s.trim(); }).filter(Boolean);
  }
  // 「詞（白話）」「白話（詞）」「叫「詞」」；括號裡要有實質內容（全空白不算）
  function glossed(text, w, at) {
    var rest = text.slice(at + w.length), before = text.slice(0, at);
    if (/^\s*（\s*[^）\s][^）]*）/.test(rest)) { return true; }
    if (/[^\s（）]\s*（\s*$/.test(before) && /^\s*）/.test(rest)) { return true; }
    return /叫做?\s*「$/.test(before);
  }

  // ---------- 瀏覽器端：採字 ----------
  function hiddenByDetails(el) {
    if (el.tagName === 'DETAILS' && !el.open) { return true; }   // 直接寫在 <details> 裡（不在 summary）的文字
    for (var e = el; e && e.parentElement; e = e.parentElement) {
      var p = e.parentElement;
      if (p.tagName === 'DETAILS' && !p.open && e.tagName !== 'SUMMARY') { return true; }
    }
    return false;
  }
  function shown(el, win) {
    if (el.closest('script,style,noscript,template')) { return false; }
    if (hiddenByDetails(el)) { return false; }
    for (var e = el; e; e = e.parentElement) {
      if (e.hidden === true) { return false; }
      if (win.getComputedStyle(e).display === 'none') { return false; }
    }
    var v = win.getComputedStyle(el).visibility;
    return v !== 'hidden' && v !== 'collapse';
  }
  function blockOf(el, win) {
    for (var e = el; e; e = e.parentElement) {
      if (e.namespaceURI === SVG) { if (e.tagName.toLowerCase() === 'text') { return e; } continue; }
      if (SELF_BLOCK.test(e.tagName)) { return e; }
      var d = win.getComputedStyle(e).display, pe = e.parentElement, pd = pe ? win.getComputedStyle(pe).display : 'block';
      if (d.indexOf('inline') === 0 || pd.indexOf('inline-') === 0) { continue; }   // inline 與 inline-grid／inline-flex 的子項（分數）併進外層
      return e;
    }
    return null;
  }
  function regionOf(el) {
    for (var i = 0; i < REGIONS.length; i += 1) { if (el.closest(REGIONS[i][0])) { return {cat: REGIONS[i][1], unit: REGIONS[i][2], sel: REGIONS[i][0]}; } }
    return {cat: 'unknown', unit: 'unknown', sel: ''};
  }
  function harvest(doc, win) {
    doc = doc || document; win = win || window;
    var out = [], cur = null;
    var walker = doc.createTreeWalker(doc.body, 1 | 4, null);   // 元素＋文字
    for (var n = walker.nextNode(); n; n = walker.nextNode()) {
      if (n.nodeType === 1) {
        if (n.tagName === 'BR' && cur && shown(n, win) && blockOf(n, win) === cur.el) { cur.text += '\n'; }
        continue;
      }
      var el = n.parentElement;
      if (!el || !n.nodeValue || !shown(el, win)) { continue; }
      var block = blockOf(el, win);
      if (!block) { continue; }
      // 先看 white-space 再決定純空白節點算不算：pre／pre-line／pre-wrap／break-spaces 下的換行是真正換行（句界，Codex 第 8 輪 B15），
      // 其他情況的純空白只是排版空白，照舊略過（不開新區塊）
      var ws = win.getComputedStyle(block).whiteSpace, keepsNewline = /^(pre|pre-line|pre-wrap|break-spaces)$/.test(ws);
      if (!/\S/.test(n.nodeValue)) {
        if (keepsNewline && /\n/.test(n.nodeValue) && cur && cur.el === block) { cur.text += '\n'; }
        continue;
      }
      var t = keepsNewline ? n.nodeValue.replace(/[ \t]+/g, ' ') : n.nodeValue.replace(/\s+/g, ' ');
      if (!cur || cur.el !== block) {
        var r = regionOf(block);
        cur = {el: block, text: '', cat: r.cat, unit: r.unit, sel: r.sel, tag: block.tagName.toLowerCase()};
        out.push(cur);
      }
      cur.text += t;
    }
    return out.map(function (b) { return {text: b.text.replace(/[ \t]*\n[ \t]*/g, '\n').trim(), cat: b.cat, unit: b.unit, sel: b.sel, tag: b.tag}; })
      .filter(function (b) { return b.text; });
  }

  // ---------- 判定（瀏覽器與 node 共用；輸入是 harvest() 的區塊清單）----------
  function evaluate(blocks, words, max) {
    max = max || MAX;
    var v = [];
    blocks.forEach(function (b) {
      if (b.cat === 'unknown') { v.push({kind: 'unclassified', text: b.text.slice(0, 60), tag: b.tag}); return; }
      if (b.cat !== 'kid' && b.cat !== 'label') { return; }
      sentences(b.text).forEach(function (s) {
        var n = countChars(s);
        if (n > max) { v.push({kind: 'length', unit: b.unit, chars: n, text: s}); }
      });
    });
    var groups = {nav: ['nav'], home: ['home'], top: ['top']};
    UNITS.forEach(function (u) { groups[u] = ['top', u]; });
    Object.keys(groups).forEach(function (g) {
      var parts = blocks.filter(function (b) { return b.cat === 'kid' && groups[g].indexOf(b.unit) >= 0; });
      if (g !== 'top' && g !== 'nav' && g !== 'home' && !parts.some(function (b) { return b.unit === g; })) { return; }   // 這個單元沒打開
      var text = parts.map(function (b) { return b.text; }).join('\n');
      (words || []).forEach(function (w) {
        var at = text.indexOf(w);
        if (at >= 0 && !glossed(text, w, at)) {
          v.push({kind: 'word', unit: g, word: w, text: text.slice(Math.max(0, at - 14), at + w.length + 10)});
        }
      });
    });
    return v;
  }
  // 頁面裡直接用：目前這一篇的難詞＋共用難詞
  function check(doc, win, max) {
    win = win || window; doc = doc || document;
    var H = win.G5Hard, m = /^#h\/([\w-]+)$/.exec(win.location.hash), e = m && H && H.get(m[1]);
    var words = Object.keys((H && H.HARD_WORDS) || {}).concat(Object.keys((e && e.words) || {}));
    var blocks = harvest(doc, win);
    return {blocks: blocks, violations: evaluate(blocks, words, max)};
  }
  return {MAX: MAX, REGIONS: REGIONS, countChars: countChars, sentences: sentences, glossed: glossed, harvest: harvest, evaluate: evaluate, check: check};
}));
