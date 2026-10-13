/* GAS loads core.js into the same global scope. Never log request bodies/codes. */
function g5HashCode(code) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, code, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}

function g5Store() {
  var sheet;
  function getSheet() {
    if (!sheet) {
      var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
      if (!id) { throw new Error('Run setup first'); }
      sheet = SpreadsheetApp.openById(id).getSheetByName('Sync');
      if (!sheet) { throw new Error('Missing Sync sheet'); }
    }
    return sheet;
  }
  function findRow(hash, key) {
    var s = getSheet();
    var count = s.getLastRow() - 1;
    if (count < 1) { return 0; }
    var ids = s.getRange(2, 1, count, 2).getValues();
    var found = 0;
    for (var i = 0; i < ids.length; i += 1) {
      if (ids[i][0] === hash && ids[i][1] === key) {
        if (found) { throw new Error('Duplicate row'); }
        found = i + 2;
      }
    }
    return found;
  }
  return {
    hash: g5HashCode,
    withLock: function (fn) {
      var lock = LockService.getScriptLock();
      var acquired = false;
      try {
        lock.waitLock(10000);
        acquired = true;
        return fn();
      } finally {
        if (acquired) { lock.releaseLock(); }
      }
    },
    get: function (hash, key) {
      var row = findRow(hash, key);
      if (!row) { return null; }
      var s = getSheet();
      var cells = s.getRange(row, 1, 1, s.getLastColumn()).getValues()[0];
      return G5SyncCore.fromRow(cells);
    },
    set: function (hash, key, record) {
      var s = getSheet();
      var row = findRow(hash, key) || s.getLastRow() + 1;
      var cells = G5SyncCore.toRow(hash, key, record);
      // Clear old trailing chunks in the SAME rectangular write.
      var width = Math.max(cells.length, s.getLastColumn());
      while (cells.length < width) { cells.push(''); }
      if (width > s.getMaxColumns()) { s.insertColumnsAfter(s.getMaxColumns(), width - s.getMaxColumns()); }
      if (row > s.getMaxRows()) { s.insertRowsAfter(s.getMaxRows(), row - s.getMaxRows()); }
      s.getRange(row, 1, 1, width).setValues([cells]);
      SpreadsheetApp.flush(); // Commit while the script lock is still held.
    }
  };
}

function g5Json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var result;
  try {
    var req = JSON.parse(e.postData.contents);
    // 第一次被呼叫時自己建試算表（不必再請家長到編輯器手動執行 setup；setup 冪等、沿用既有 SHEET_ID）
    if (!PropertiesService.getScriptProperties().getProperty('SHEET_ID')) { setup(); }
    // 家長傳題目（gas/inbox.js）：upload／inbox／ack；其他請求照舊交給同步核心
    var inboxOps = {upload: 1, inbox: 1, ack: 1};
    result = inboxOps[req && req.op] ? g5Store().withLock(function () { return G5Inbox.handleInbox(g5InboxStore(), req, Date.now); })
      : G5SyncCore.handle(g5Store(), req, Date.now);
  } catch (error) {
    result = {ok: false, err: 'server'};
  }
  return g5Json(result);
}

function doGet(e) {
  return g5Json(G5SyncCore.handle(null, {op: 'ping'}, Date.now));
}

function setup() {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var props = PropertiesService.getScriptProperties();
    var id = props.getProperty('SHEET_ID');
    var book = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create('G5 家庭同步');
    // Save immediately so a repeated setup never creates another book after a partial failure.
    if (!id) { props.setProperty('SHEET_ID', book.getId()); }
    var sheet = book.getSheetByName('Sync') || book.insertSheet('Sync');
    if (sheet.getLastRow() === 0) {
      var headers = ['codeHash', 'key', 'rev', 'updated', 'chunkCount'];
      for (var i = 1; i <= 21; i += 1) { headers.push('chunk' + i); }
      if (sheet.getMaxColumns() < headers.length) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
      }
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
    SpreadsheetApp.flush();
    return {ok: true, spreadsheetId: book.getId()};
  } finally {
    lock.releaseLock();
  }
}
