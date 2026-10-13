/* 家長傳題目（2026-10-13 律師：「自己匯入或放入難題的入口在哪」）。
 * 網頁送出：{op:"upload", code, subject, note, image}；只收已開啟同步的家庭碼（雲端至少有一份紀錄），防陌生人亂塞。
 * 本機抓取：{op:"inbox", token} 列出未取走的題目（含照片）；{op:"ack", token, id} 標記已取走。
 * token 第一次呼叫 inbox 時設定（之後只認同一個；存在 Script Properties，不進 repo）。
 * 照片只存在律師自己的試算表（Inbox 工作表），不放公開網頁。
 * handleInbox(store, req, now) 是純函式，node 測試用假 store（tests/inbox.test.js）。 */
var G5Inbox = (function () {
  var SUBJECTS = ['國語', '數學', '自然', '社會', '英文', '其他'];
  var MAX_IMAGE = 880000;   // cap-why: 試算表單筆紀錄切塊上限 21×45000 字元（同步核心同一上限），留 2 萬給其他欄
  var MAX_NOTE = 500;
  var CHUNK = 45000;        // cap-why: Google 試算表單格上限 50000 字元
  function str(x) { return typeof x === 'string'; }
  function handleInbox(store, req, now) {
    if (req.op === 'upload') {
      if (!str(req.code) || !/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/.test(req.code)) { return {ok: false, err: 'bad-code'}; }
      if (SUBJECTS.indexOf(req.subject) < 0) { return {ok: false, err: 'bad-subject'}; }
      if (!str(req.note) || req.note.length > MAX_NOTE) { return {ok: false, err: 'bad-note'}; }
      if (!str(req.image) || !/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(req.image)) { return {ok: false, err: 'bad-image'}; }
      if (req.image.length > MAX_IMAGE) { return {ok: false, err: 'too-big'}; }
      var hash = store.hash(req.code);
      if (!store.familyExists(hash)) { return {ok: false, err: 'no-family'}; }
      var id = 'u' + now() + '-' + Math.floor(Math.random() * 1e6);
      store.addUpload({id: id, time: now(), subject: req.subject, note: req.note, codeHash: hash, image: req.image});
      return {ok: true, id: id};
    }
    if (req.op === 'confused') {
      // 孩子在某一步按「這步看不懂」（交辦 #1319）：沒有照片，記成一筆待處理，本機取題後據此改寫那一步
      if (!str(req.code) || !/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/.test(req.code)) { return {ok: false, err: 'bad-code'}; }
      if (SUBJECTS.indexOf(req.subject) < 0) { return {ok: false, err: 'bad-subject'}; }
      if (!str(req.entry) || !/^[\w-]{1,60}$/.test(req.entry)) { return {ok: false, err: 'bad-entry'}; }
      if (typeof req.step !== 'number' || req.step < 1 || req.step > 99 || Math.floor(req.step) !== req.step) { return {ok: false, err: 'bad-step'}; }
      if (!str(req.title) || req.title.length > 200) { return {ok: false, err: 'bad-note'}; }
      var h2 = store.hash(req.code);
      if (!store.familyExists(h2)) { return {ok: false, err: 'no-family'}; }
      var cid = 'c' + now() + '-' + Math.floor(Math.random() * 1e6);
      store.addUpload({id: cid, time: now(), subject: req.subject, note: '【看不懂】' + req.entry + ' 第 ' + req.step + ' 步：' + req.title, codeHash: h2, image: ''});
      return {ok: true, id: cid};
    }
    if (req.op === 'mine') {
      // 網頁看自己傳的題目進度：new＝等電腦取回、fetched＝製作中、done＝做好了（附連結）；也回電腦上次取題時間（判斷有無故障）
      if (!str(req.code) || !/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/.test(req.code)) { return {ok: false, err: 'bad-code'}; }
      return {ok: true, items: store.listByCode(store.hash(req.code)), lastFetch: store.getLastFetch()};
    }
    if (req.op === 'inbox' || req.op === 'ack' || req.op === 'done') {
      if (!str(req.token) || req.token.length < 24) { return {ok: false, err: 'bad-token'}; }
      var saved = store.getToken();
      if (!saved) { store.setToken(req.token); saved = req.token; }
      if (saved !== req.token) { return {ok: false, err: 'bad-token'}; }
      if (req.op === 'inbox') { store.setLastFetch(now()); return {ok: true, items: store.listNew()}; }
      if (req.op === 'done') {
        if (!str(req.id) || !str(req.url) || !/^https:\/\/windsorya\.github\.io\/g5-help\/#h\/[\w-]+$/.test(req.url)) { return {ok: false, err: 'bad-done'}; }
        return {ok: store.markDone(req.id, req.url, now())};
      }
      if (!str(req.id)) { return {ok: false, err: 'bad-id'}; }
      return {ok: store.markFetched(req.id)};
    }
    return null;   // 不是傳題目的請求，交給同步核心
  }
  // 狀態欄：new／fetched／done@完成時間:網址（2026-10-13 起記完成時間，給網頁估「還要等多久」；舊格式 done:網址 照讀）
  function doneCell(url, t) { return 'done@' + t + ':' + url; }
  function parseStatus(st) {
    st = String(st);
    var m = /^done@(\d+):(.*)$/.exec(st);
    if (m) { return {status: 'done', url: m[2], doneAt: Number(m[1])}; }
    if (st.indexOf('done:') === 0) { return {status: 'done', url: st.slice(5), doneAt: 0}; }
    return {status: st, url: '', doneAt: 0};
  }
  function toCells(u) {
    var parts = [];
    for (var i = 0; i < u.image.length; i += CHUNK) { parts.push(u.image.slice(i, i + CHUNK)); }
    return [u.id, u.time, u.subject, '~' + u.note, u.codeHash, 'new', parts.length].concat(parts.map(function (p) { return '~' + p; }));
  }
  function fromCells(c) {
    var n = c[6], img = '';
    for (var i = 0; i < n; i += 1) { img += String(c[7 + i]).slice(1); }
    return {id: c[0], time: c[1], subject: c[2], note: String(c[3]).slice(1), image: img};
  }
  return {handleInbox: handleInbox, doneCell: doneCell, parseStatus: parseStatus, toCells: toCells, fromCells: fromCells, SUBJECTS: SUBJECTS, MAX_IMAGE: MAX_IMAGE, CHUNK: CHUNK};
})();
if (typeof module !== 'undefined' && module.exports) { module.exports = G5Inbox; }

/* GAS 端儲存（node 測試不會呼叫到這裡） */
function g5InboxStore() {
  var props = PropertiesService.getScriptProperties();
  function book() { return SpreadsheetApp.openById(props.getProperty('SHEET_ID')); }
  function inbox() { var b = book(); return b.getSheetByName('Inbox') || b.insertSheet('Inbox'); }
  return {
    hash: g5HashCode,
    familyExists: function (hash) {
      var s = book().getSheetByName('Sync'), n = s.getLastRow() - 1;
      if (n < 1) { return false; }
      return s.getRange(2, 1, n, 1).getValues().some(function (r) { return r[0] === hash; });
    },
    addUpload: function (u) {
      var s = inbox(), cells = G5Inbox.toCells(u), row = s.getLastRow() + 1;
      if (cells.length > s.getMaxColumns()) { s.insertColumnsAfter(s.getMaxColumns(), cells.length - s.getMaxColumns()); }
      s.getRange(row, 1, 1, cells.length).setValues([cells]);
      SpreadsheetApp.flush();
    },
    listNew: function () {
      var s = inbox(), n = s.getLastRow();
      if (n < 1) { return []; }
      return s.getRange(1, 1, n, s.getLastColumn()).getValues().filter(function (r) { return r[5] === 'new'; }).map(G5Inbox.fromCells);
    },
    markFetched: function (id) {
      var s = inbox(), n = s.getLastRow();
      if (n < 1) { return false; }
      var ids = s.getRange(1, 1, n, 1).getValues();
      for (var i = 0; i < ids.length; i += 1) { if (ids[i][0] === id) { s.getRange(i + 1, 6).setValue('fetched'); SpreadsheetApp.flush(); return true; } }
      return false;
    },
    listByCode: function (hash) {
      var s = inbox(), n = s.getLastRow();
      if (n < 1) { return []; }
      return s.getRange(1, 1, n, 6).getValues().filter(function (r) { return r[4] === hash; }).map(function (r) {
        var p = G5Inbox.parseStatus(r[5]);
        return {id: r[0], time: r[1], subject: r[2], note: String(r[3]).slice(1, 41), status: p.status, url: p.url, doneAt: p.doneAt};
      }).reverse().slice(0, 20);
    },
    markDone: function (id, url, t) {
      var s = inbox(), n = s.getLastRow();
      if (n < 1) { return false; }
      var ids = s.getRange(1, 1, n, 1).getValues();
      for (var i = 0; i < ids.length; i += 1) { if (ids[i][0] === id) { s.getRange(i + 1, 6).setValue(G5Inbox.doneCell(url, t)); SpreadsheetApp.flush(); return true; } }
      return false;
    },
    getLastFetch: function () { return Number(props.getProperty('INBOX_LAST_FETCH') || 0); },
    setLastFetch: function (t) { props.setProperty('INBOX_LAST_FETCH', String(t)); },
    getToken: function () { return props.getProperty('INBOX_TOKEN'); },
    setToken: function (t) { props.setProperty('INBOX_TOKEN', t); }
  };
}
