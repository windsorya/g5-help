// 難題站存檔 g5help.v1 的格式（從 src/app.html 搬出來，node 測試 tests/helpdoc.test.js 與頁面用同一份）。
// {v:1, entries:{篇id: 那一篇的教學與練習紀錄}, hidden?:{篇id: 隱藏時間(ms), "_del_"+篇id: 刪除時間(ms)}}
//   hidden（2026-10-13 律師：「為何我測試用的題目，我沒法清除？有無清除或重置按鈕？」）：家長在首頁按「隱藏這篇」收起來的篇。
//   只是不列在首頁，不刪任何篇的內容與作答紀錄；跟著 g5help.v1 一起跨裝置同步。舊存檔沒有這個欄位＝全不隱藏。
//   版本號維持 1：舊版頁面讀到 hidden 會略過（不當壞資料），存檔時會掉這個欄位——只影響還開著舊版的分頁，列為剩餘風險。
// 讀不懂的 hidden（陣列、字串、壞 id、壞時間）只丟掉那一部分，不拖垮整份存檔。
// 刪除（2026-10-14 律師：「請幫我增加刪除題目按鈕」）：在「已隱藏」清單按「刪除」的篇。
//   刪除＝那一篇的作答紀錄歸零、從首頁與「已隱藏」清單都拿掉、沒有恢復鈕（篇的內容在網站程式裡，要找回請交辦）。
//   存法：hidden 裡多一筆 "_del_<篇id>": 刪除時間，原本那篇的隱藏也留著。不另開欄位——舊版頁面讀寫時會丟掉看不懂的欄位，
//   但 hidden 裡合規的 id 會照留（Codex 審 6495640：另開 deleted 欄位，舊版存一次就把刪除洗掉）。篇 id 不會以 _del_ 開頭。
//   頁面記憶體裡拆成 {hidden: 真的隱藏, deleted: {篇id: 時間}}；parse 拆、serialize 合。6495640 曾寫過的 deleted 欄位照樣讀得懂。
(function (root) {
  "use strict";
  var ID = /^[\w-]{1,60}$/;   // 篇 id 與 hard.js、GAS confused 的 entry 同一規則
  var DEL = "_del_";   // hidden 裡刪除標記的前綴（加上前綴仍要合 ID，所以能刪的篇 id 最長 55 字）
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
      var all = cleanHidden(x.hidden), hidden = Object.create(null), deleted = cleanHidden(x.deleted);
      Object.keys(all).forEach(function (k) {
        if (k.indexOf(DEL) === 0) { if (k.length > DEL.length) deleted[k.slice(DEL.length)] = all[k]; }
        else hidden[k] = all[k];
      });
      return {entries: out, hidden: hidden, deleted: deleted};
    } catch (e) { return null; }
  }
  // 用 defineProperty 一筆一筆定義：id 叫 __proto__ 也是普通欄位，JSON.stringify 照樣寫出（Codex 審 81963cee：原本 p[k]= 會吞掉 __proto__）
  function plain(o) {
    var p = {};
    Object.keys(o || {}).forEach(function (k) { Object.defineProperty(p, k, {value: o[k], enumerable: true, writable: true, configurable: true}); });
    return p;
  }
  function serialize(entries, hidden, deleted) {
    var h = plain(hidden);
    Object.keys(deleted || {}).forEach(function (id) { Object.defineProperty(h, DEL + id, {value: deleted[id], enumerable: true, writable: true, configurable: true}); });
    return JSON.stringify({v: 1, entries: plain(entries), hidden: h});
  }
  function hide(hidden, id, t) {
    if (!ID.test(id) || !stamp(t)) throw new Error("bad-hide");
    var out = cleanHidden(plain(hidden)); out[id] = t; return out;
  }
  function unhide(hidden, id) { var out = cleanHidden(plain(hidden)); delete out[id]; return out; }
  function isHidden(hidden, id) { return !!hidden && own(hidden, id) && stamp(hidden[id]); }
  // 「已隱藏」清單只列隱藏、沒刪掉的篇
  function hiddenIn(hidden, list, deleted) { return (list || []).filter(function (e) { return isHidden(hidden, e.id) && !isHidden(deleted, e.id); }); }
  // 刪除一篇：回傳新的 {hidden, deleted}（hidden 那筆也記上，舊版頁面才會繼續藏著）；不改原物件
  function remove(hidden, deleted, id, t) {
    if (!ID.test(id) || !ID.test(DEL + id) || id.indexOf(DEL) === 0 || !stamp(t)) throw new Error("bad-delete");
    var h = cleanHidden(plain(hidden)), d = cleanHidden(plain(deleted));
    if (!stamp(h[id])) h[id] = t;
    d[id] = t; return {hidden: h, deleted: d};
  }
  // 恢復全部隱藏的篇：刪掉的篇不跟著回來（只留它們在 hidden 裡的那筆）
  function unhideAll(hidden, deleted) {
    var h = cleanHidden(plain(hidden)), out = Object.create(null);
    Object.keys(cleanHidden(plain(deleted))).forEach(function (id) { out[id] = stamp(h[id]) ? h[id] : deleted[id]; });
    return out;
  }
  // 清除全部作答紀錄：每一篇回到空白（之後打開時才用 fresh() 建）；隱藏與刪除清單照留（另有「恢復全部隱藏的篇」）
  function cleared(hidden, deleted) { return {entries: Object.create(null), hidden: cleanHidden(plain(hidden)), deleted: cleanHidden(plain(deleted))}; }
  var api = {fresh: fresh, clean1: clean1, parse: parse, serialize: serialize, cleanHidden: cleanHidden, hide: hide, unhide: unhide, isHidden: isHidden, hiddenIn: hiddenIn, remove: remove, unhideAll: unhideAll, cleared: cleared, own: own};
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5HelpDoc = api;
})(typeof window !== "undefined" ? window : this);
