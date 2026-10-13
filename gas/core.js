/* Pure, synchronous logic. store supplies hash(code), withLock(fn), get, set. */
var G5SyncCore = (function () {
  'use strict';
  var ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  var KEYS = ['g5sci.v3', 'g5help.v1', 'g5math.v1', 'g5math.v2', 'g5chi.v1', 'g5soc.v1', 'g5wrong.v1'];   // g5wrong：錯題複習站（2026-10-13）   // g5chi／g5soc：五上國語、社會站（#1351，2026-10-13）
  var MAX_DATA = 900000;
  var CHUNK_SIZE = 45000;

  function integer(n) {
    return typeof n === 'number' && isFinite(n) && Math.floor(n) === n && n >= 0 && n < 9007199254740991;
  }
  function validCode(code) {
    return typeof code === 'string' && code.length === 12 && /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/.test(code);
  }
  function validHash(hash) {
    return typeof hash === 'string' && hash.length === 64 && /^[a-f0-9]{64}$/.test(hash);
  }
  function validRecord(r) {
    return r && integer(r.rev) && r.rev > 0 && integer(r.updated) && typeof r.data === 'string' && r.data.length <= MAX_DATA;
  }
  function snapshot(record) {
    if (!record) { return {rev: 0, data: null, updated: null}; }
    if (!validRecord(record)) { throw new Error('Invalid stored record'); }
    return {rev: record.rev, data: record.data, updated: record.updated};
  }
  function handle(store, req, now) {
    try {
      if (!req || typeof req !== 'object' || Array.isArray(req)) { return {ok: false, err: 'bad-request'}; }
      if (req.op === 'ping') { return {ok: true, pong: true}; }
      if (req.op !== 'get' && req.op !== 'put') { return {ok: false, err: 'bad-op'}; }
      if (!validCode(req.code)) { return {ok: false, err: 'bad-code'}; }
      if (KEYS.indexOf(req.key) < 0) { return {ok: false, err: 'bad-key'}; }
      if (req.op === 'put') {
        if (typeof req.data !== 'string') { return {ok: false, err: 'bad-data'}; }
        if (req.data.length > MAX_DATA) { return {ok: false, err: 'too-big'}; }
        if (!integer(req.rev)) { return {ok: false, err: 'bad-rev'}; }
      }
      var hash = store.hash(req.code);
      if (!validHash(hash)) { throw new Error('Invalid digest'); }
      // Reading and comparing the revision MUST happen inside the same write lock.
      return store.withLock(function () {
        var current = snapshot(store.get(hash, req.key));
        if (req.op === 'get') {
          return {ok: true, rev: current.rev, data: current.data, updated: current.updated};
        }
        if (req.rev !== current.rev) {
          return {ok: false, err: 'conflict', rev: current.rev, data: current.data, updated: current.updated};
        }
        var stamp = typeof now === 'function' ? now() : now;
        if (typeof stamp === 'undefined') { stamp = Date.now(); }
        if (!integer(stamp) || !integer(current.rev + 1)) { throw new Error('Invalid revision or clock'); }
        var next = {rev: current.rev + 1, data: req.data, updated: stamp};
        store.set(hash, req.key, next);
        return {ok: true, rev: next.rev, updated: next.updated};
      });
    } catch (error) {
      return {ok: false, err: 'server'};
    }
  }

  // Each stored cell starts with "~". This prevents Sheets from interpreting a
  // chunk beginning with "=" as a formula, including chunks in the middle of JSON.
  // The sentinel is included in the 45,000-character cell limit.
  function splitData(data) {
    if (typeof data !== 'string' || data.length > MAX_DATA) { throw new Error('Invalid data'); }
    var chunks = [];
    var start = 0;
    do {
      var end = Math.min(start + CHUNK_SIZE - 1, data.length);
      var c = data.charCodeAt(end - 1);
      var d = data.charCodeAt(end);
      if (end < data.length && c >= 0xD800 && c <= 0xDBFF && d >= 0xDC00 && d <= 0xDFFF) { end -= 1; }
      chunks.push('~' + data.slice(start, end));
      start = end;
    } while (start < data.length);
    return chunks;
  }
  function toRow(hash, key, record) {
    if (!validHash(hash) || KEYS.indexOf(key) < 0 || !validRecord(record)) { throw new Error('Invalid row'); }
    var chunks = splitData(record.data);
    return [hash, key, record.rev, record.updated, chunks.length].concat(chunks);
  }
  function fromRow(row) {
    if (!row || !validHash(row[0]) || KEYS.indexOf(row[1]) < 0 || !integer(row[4]) || row[4] < 1 || row[4] > 21 || row.length < 5 + row[4]) {
      throw new Error('Invalid row');
    }
    var pieces = [];
    for (var i = 0; i < row[4]; i += 1) {
      var chunk = row[5 + i];
      if (typeof chunk !== 'string' || chunk.charAt(0) !== '~' || chunk.length > CHUNK_SIZE) { throw new Error('Invalid chunk'); }
      pieces.push(chunk.slice(1));
    }
    var record = {rev: row[2], updated: row[3], data: pieces.join('')};
    if (!validRecord(record)) { throw new Error('Invalid record'); }
    return record;
  }
  return {handle: handle, splitData: splitData, toRow: toRow, fromRow: fromRow, validCode: validCode,
    ALPHABET: ALPHABET, KEYS: KEYS, MAX_DATA: MAX_DATA, CHUNK_SIZE: CHUNK_SIZE};
}());

if (typeof module !== 'undefined') { module.exports = G5SyncCore; }
