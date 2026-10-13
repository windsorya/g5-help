'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../gas/core');
const {makeStore, hash} = require('./harness');
const CODE = 'ABCDEFGHJKMN', KEY = 'g5sci.v3', NOW = 1791849600000;
const get = (store, extra = {}) => core.handle(store, {op: 'get', code: CODE, key: KEY, ...extra}, NOW);
const put = (store, extra = {}) => core.handle(store, {op: 'put', code: CODE, key: KEY, rev: 0, data: '{"n":1}', ...extra}, NOW);

test('G01 ping, missing document, first put and strictly increasing revision', () => {
  const store = makeStore();
  assert.deepEqual(core.handle(null, {op: 'ping'}), {ok: true, pong: true});
  assert.deepEqual(get(store), {ok: true, rev: 0, data: null, updated: null});
  assert.deepEqual(put(store), {ok: true, rev: 1, updated: NOW});
  assert.equal(get(store).data, '{"n":1}');
  assert.deepEqual(put(store, {rev: 1, data: '{"whole":"replacement"}'}), {ok: true, rev: 2, updated: NOW});
  assert.equal(get(store).data, '{"whole":"replacement"}');
});

test('G02 bad-code rejects forbidden characters, wrong length, lowercase and final newline', () => {
  const store = makeStore();
  for (const code of [null, 42, '', CODE.toLowerCase(), 'ABCD-EFGH-JKMN', CODE + 'A', CODE.slice(1), ...'0O1IL'.split('').map(c => c + CODE.slice(1)), 'A'.repeat(11) + '\n']) {
    assert.deepEqual(get(store, {code}), {ok: false, err: 'bad-code'}, String(code));
  }
  assert.equal(store.rows.size, 0);
});

test('G03 exact key whitelist, invalid data, upper bound and revision validation', () => {
  const store = makeStore();
  for (const key of core.KEYS) assert.equal(put(store, {key}).ok, true);
  for (const key of ['__proto__', 'g5sci.v2', null, 1]) assert.equal(get(store, {key}).err, 'bad-key');
  for (const data of [null, {}, 12, []]) assert.equal(put(store, {data}).err, 'bad-data');
  assert.equal(put(store, {data: 'a'.repeat(900001)}).err, 'too-big');
  for (const rev of [-1, 0.5, '1', null, NaN, Infinity, 9007199254740991]) assert.equal(put(store, {rev}).err, 'bad-rev');
  assert.equal(put(store, {rev: 1, data: 'a'.repeat(900000)}).ok, true);
  assert.equal(get(store).data.length, 900000);
});

test('G04 optimistic conflict returns complete cloud document; check and write both inside lock', () => {
  const store = makeStore();
  put(store);
  assert.deepEqual(store.events, ['lock', 'get', 'set', 'unlock']);
  store.events.length = 0;
  assert.deepEqual(put(store, {data: 'loser'}), {ok: false, err: 'conflict', rev: 1, data: '{"n":1}', updated: NOW});
  assert.deepEqual(store.events, ['lock', 'get', 'unlock']);
  assert.equal(store.record(CODE).data, '{"n":1}');
});

test('G05 only SHA-256 code hashes are stored; keys and families remain independent', () => {
  const store = makeStore();
  put(store); put(store, {key: 'g5help.v1', data: 'help'});
  put(store, {code: '23456789ABCD', data: 'another-family'});
  const serialized = JSON.stringify([...store.rows]);
  assert.ok(!serialized.includes(CODE)); assert.ok(!serialized.includes('23456789ABCD'));
  assert.ok(serialized.includes(hash(CODE))); assert.equal(store.rows.size, 3);
  assert.equal(store.record(CODE, 'g5help.v1').data, 'help');
});

test('G06 chunks round-trip >45000 characters, maximum length, empty string and surrogate boundaries', () => {
  for (const data of ['', '字'.repeat(45001), 'a'.repeat(44998) + '😀' + '=SUM(1,1)', '=IMPORTXML("private")', 'x'.repeat(900000)]) {
    const row = core.toRow(hash(CODE), KEY, {rev: 1, updated: NOW, data});
    assert.equal(row.length, row[4] + 5);
    for (const cell of row.slice(5)) {
      assert.ok(cell.length <= 45000); assert.ok(cell.startsWith('~')); assert.ok(!/[\uD800-\uDBFF]$/.test(cell));
    }
    assert.equal(core.fromRow(row).data, data);
  }
});

test('G07 all injected exceptions are redacted and locks release on failed storage', () => {
  for (const method of ['hash', 'withLock', 'get', 'set']) {
    const store = makeStore(); store[method] = () => { throw new Error('SECRET raw detail'); };
    assert.deepEqual(put(store), {ok: false, err: 'server'});
    if (method === 'get' || method === 'set') assert.equal(store.events.at(-1), 'unlock');
  }
  const store = makeStore(); store.hash = () => 'not-sha256';
  assert.equal(get(store).err, 'server');
  assert.equal(core.handle(makeStore(), {op: 'put', code: CODE, key: KEY, data: '', rev: 0}, () => { throw Error('secret'); }).err, 'server');
});

test('G08 malformed requests, corrupt rows and invalid clocks fail closed', () => {
  for (const req of [null, [], 3, 'get']) assert.equal(core.handle(makeStore(), req).err, 'bad-request');
  assert.equal(core.handle(makeStore(), {op: 'delete'}).err, 'bad-op');
  const row = core.toRow(hash(CODE), KEY, {rev: 1, data: 'ok', updated: NOW});
  for (const change of [[4, 22], [4, 0], [5, '=formula'], [2, '1'], [3, -1], [0, CODE]]) {
    const broken = row.slice(); broken[change[0]] = change[1]; assert.throws(() => core.fromRow(broken));
  }
  const store = makeStore(); store.rows.set(hash(CODE) + '|' + KEY, row.slice(0, 5));
  assert.equal(get(store).err, 'server');
  assert.equal(core.handle(makeStore(), {op: 'put', code: CODE, key: KEY, rev: 0, data: 'ok'}, -1).err, 'server');
});

function gasRuntime() {
  const props = new Map(), events = [], sheets = new Map();
  let locked = false, creates = 0, failFlush = false;
  class Sheet {
    constructor() { this.rows = []; this.columns = 6; this.capacity = 2; }
    getLastRow() { return this.rows.length; }
    getLastColumn() { return Math.max(0, ...this.rows.map(row => row.length)); }
    getMaxColumns() { return this.columns; }
    getMaxRows() { return this.capacity; }
    insertColumnsAfter(after, count) { this.columns += count; }
    insertRowsAfter(after, count) { this.capacity += count; }
    setFrozenRows(n) { this.frozen = n; }
    getRange(row, col, height, width) {
      assert.ok(width + col - 1 <= this.columns); assert.ok(height + row - 1 <= this.capacity);
      return {
        getValues: () => Array.from({length: height}, (_, i) => Array.from({length: width}, (_, j) => this.rows[row - 1 + i]?.[col - 1 + j] ?? '')),
        setValues: values => {
          assert.ok(locked, 'setValues must be locked'); assert.equal(values.length, height);
          events.push('write');
          values.forEach((cells, i) => {
            assert.equal(cells.length, width);
            this.rows[row - 1 + i] ||= [];
            cells.forEach((cell, j) => { this.rows[row - 1 + i][col - 1 + j] = cell; });
          });
        }
      };
    }
  }
  const book = {getId: () => 'book-id', getSheetByName: name => sheets.get(name), insertSheet: name => { const s = new Sheet(); sheets.set(name, s); return s; }};
  const sandbox = {
    PropertiesService: {getScriptProperties: () => ({getProperty: key => props.get(key), setProperty: (key, value) => props.set(key, value)})},
    SpreadsheetApp: {
      create() { creates++; return book; }, openById(id) { assert.equal(id, 'book-id'); return book; },
      flush() { assert.ok(locked); events.push('flush'); if (failFlush) throw Error('SECRET flush details'); }
    },
    LockService: {getScriptLock: () => ({waitLock(ms) { assert.equal(ms, 10000); assert.ok(!locked); locked = true; events.push('lock'); }, releaseLock() { locked = false; events.push('release'); }})},
    Utilities: {DigestAlgorithm: {SHA_256: 'sha256'}, Charset: {UTF_8: 'utf8'}, computeDigest(algorithm, value, charset) {
      return [...require('node:crypto').createHash(algorithm).update(value, charset).digest()].map(byte => byte > 127 ? byte - 256 : byte);
    }},
    ContentService: {MimeType: {JSON: 'application/json'}, createTextOutput(text) { return {text, setMimeType(mime) { this.mime = mime; return this; }}; }}
  };
  vm.createContext(sandbox);
  for (const file of ['core.js', 'Code.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../gas', file), 'utf8'), sandbox, {filename: file});
  return {sandbox, props, events, sheets, get creates() { return creates; }, set failFlush(value) { failFlush = value; },
    post(req) { const out = sandbox.doPost({postData: {contents: JSON.stringify(req)}}); assert.equal(out.mime, 'application/json'); return JSON.parse(out.text); }};
}

test('G09 GAS setup is idempotent; manifest exposes only required spreadsheet scope', () => {
  const gas = gasRuntime();
  assert.equal(gas.sandbox.setup().ok, true); gas.sandbox.setup();
  assert.equal(gas.creates, 1); assert.equal(gas.props.get('SHEET_ID'), 'book-id');
  assert.equal(gas.sheets.get('Sync').rows[0].length, 26); assert.equal(gas.sheets.get('Sync').frozen, 1);
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../gas/appsscript.json'), 'utf8'));
  assert.deepEqual(manifest, {timeZone: 'Asia/Taipei', runtimeVersion: 'V8', webapp: {executeAs: 'USER_DEPLOYING', access: 'ANYONE_ANONYMOUS'}, oauthScopes: ['https://www.googleapis.com/auth/spreadsheets']});
});

test('G10 GAS adapter round-trips chunks, clears old tails and flushes before releasing lock', () => {
  const gas = gasRuntime(); gas.sandbox.setup(); gas.events.length = 0;
  const base = {code: CODE, key: KEY};
  const data = 'A'.repeat(44999) + '=IMPORTXML("private")' + '字'.repeat(2000);
  assert.equal(gas.post({...base, op: 'put', rev: 0, data}).rev, 1);
  assert.deepEqual(gas.events, ['lock', 'write', 'flush', 'release']);
  assert.equal(gas.post({...base, op: 'get'}).data, data);
  assert.equal(gas.post({...base, op: 'put', rev: 1, data: 'small'}).rev, 2);
  const row = gas.sheets.get('Sync').rows[1];
  assert.equal(row[0], hash(CODE)); assert.equal(row[4], 1); assert.equal(row[5], '~small');
  assert.ok(row.slice(6).every(cell => cell === '')); assert.ok(!JSON.stringify(row).includes(CODE));
  assert.equal(gas.post({...base, op: 'get'}).data, 'small');
  assert.equal(gas.post({...base, op: 'put', rev: 1, data: 'stale'}).err, 'conflict');
  assert.equal(gas.post({...base, key: 'g5help.v1', op: 'put', rev: 0, data: ''}).ok, true); // grows row capacity
});

test('G11 GAS malformed POST, missing setup and failed flush return sanitized server error; GET is ping', () => {
  const gas = gasRuntime();
  assert.deepEqual(JSON.parse(gas.sandbox.doGet({}).text), {ok: true, pong: true});
  assert.deepEqual(JSON.parse(gas.sandbox.doPost({postData: {contents: '<html>secret</html>'}}).text), {ok: false, err: 'server'});
  assert.equal(gas.post({op: 'get', code: CODE, key: KEY}).err, 'server');
  gas.sandbox.setup(); gas.failFlush = true;
  assert.deepEqual(gas.post({op: 'put', code: CODE, key: KEY, rev: 0, data: 'ok'}), {ok: false, err: 'server'});
  assert.equal(gas.events.at(-1), 'release');
});
