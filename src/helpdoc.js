// 難題站存檔 g5help.v1 的格式（從 src/app.html 搬出來，node 測試 tests/helpdoc.test.js 與頁面用同一份）。
// {v:1, entries:{篇id: 那一篇的教學與練習紀錄}, hidden?:{篇id: 隱藏時間(ms)}}
//   hidden（2026-10-13 律師：「為何我測試用的題目，我沒法清除？有無清除或重置按鈕？」）：家長在首頁按「隱藏這篇」收起來的篇。
//   只是不列在首頁，不刪任何篇的內容與作答紀錄；跟著 g5help.v1 一起跨裝置同步。舊存檔沒有這個欄位＝全不隱藏。
//   版本號維持 1：舊版頁面讀到 hidden 會略過（不當壞資料），存檔時會掉這個欄位——只影響還開著舊版的分頁，列為剩餘風險。
// 讀不懂的 hidden（陣列、字串、壞 id、壞時間）只丟掉那一部分，不拖垮整份存檔。
(function (root) {
  "use strict";
  var ID = /^[\w-]{1,60}$/;   // 篇 id 與 hard.js、GAS confused 的 entry 同一規則
  function fresh() { return {lessonDone: false, idx: 0, seed: Math.floor(Math.random() * 1e6), streak: 0, clean: 0, solved: 0, mastered: false, log: [], cur: null, r: 0}; }
  function nat(x) { return typeof x === "number" && Number.isSafeInteger(x) && x >= 0 && x <= 100000; }   // 題號、次數：超過 10 萬當壞資料（Codex 必修 6）
  function seedOk(x) { return typeof x === "number" && Number.isSafeInteger(x) && x >= 0 && x <= 2147483647; }   // 亂數種子另設範圍（Codex 第 2 輪必修 1）
  function stamp(x) { return typeof x === "number" && Number.isSafeInteger(x) && x >= 0; }
  function clean1(s) {
    var d = fresh();
    if (!s || typeof s !== "object") return d;
    ["idx", "streak", "clean", "solved"].forEach(function (k) { if (nat(s[k])) d[k] = s[k]; });
    if (seedOk(s.seed)) d.seed = s.seed;
    d.r = (typeof s.r === "number" && Number.isSafeInteger(s.r) && s.r >= 0) ? s.r : 0;   // 這一篇的版本號：每存一次 +1
    d.lessonDone = s.lessonDone === true; d.mastered = s.mastered === true;
    if (Array.isArray(s.log)) d.log = s.log.slice(-100);
    // 正在做的那一題：看過提示、答錯過幾次（Codex 2026-10-12 第 1 輪必修 1、2：重開練習不能洗掉、不能重複計分）
    if (s.cur && nat(s.cur.idx) && nat(s.cur.hints) && nat(s.cur.wrongs)) d.cur = {idx: s.cur.idx, hints: s.cur.hints, wrongs: s.cur.wrongs};
    return d;
  }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function cleanHidden(h) {
    var out = Object.create(null);
    if (!h || typeof h !== "object" || Array.isArray(h)) return out;
    Object.keys(h).forEach(function (id) { if (ID.test(id) && stamp(h[id])) out[id] = h[id]; });
    return out;
  }
  // 回傳 {entries, hidden}（都是 Object.create(null)，id 叫 constructor、__proto__ 也不會撞到內建屬性）；讀不懂回 null
  function parse(raw) {
    try {
      var x = JSON.parse(raw);
      if (!x || x.v !== 1 || !x.entries || typeof x.entries !== "object" || Array.isArray(x.entries)) return null;
      var out = Object.create(null);
      Object.keys(x.entries).forEach(function (id) { out[id] = clean1(x.entries[id]); });
      return {entries: out, hidden: cleanHidden(x.hidden)};
    } catch (e) { return null; }
  }
  function plain(o) { var p = {}; Object.keys(o || {}).forEach(function (k) { p[k] = o[k]; }); return p; }
  function serialize(entries, hidden) { return JSON.stringify({v: 1, entries: plain(entries), hidden: plain(hidden)}); }
  function hide(hidden, id, t) {
    if (!ID.test(id) || !stamp(t)) throw new Error("bad-hide");
    var out = cleanHidden(plain(hidden)); out[id] = t; return out;
  }
  function unhide(hidden, id) { var out = cleanHidden(plain(hidden)); delete out[id]; return out; }
  function isHidden(hidden, id) { return !!hidden && own(hidden, id) && stamp(hidden[id]); }
  function hiddenIn(hidden, list) { return (list || []).filter(function (e) { return isHidden(hidden, e.id); }); }
  // 清除全部作答紀錄：每一篇回到空白（之後打開時才用 fresh() 建）；隱藏清單照留（另有「恢復全部隱藏的篇」）
  function cleared(hidden) { return {entries: Object.create(null), hidden: cleanHidden(plain(hidden))}; }
  var api = {fresh: fresh, clean1: clean1, parse: parse, serialize: serialize, cleanHidden: cleanHidden, hide: hide, unhide: unhide, isHidden: isHidden, hiddenIn: hiddenIn, cleared: cleared, own: own};
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5HelpDoc = api;
})(typeof window !== "undefined" ? window : this);
