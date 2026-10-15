'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const G5Sync = require('../src/sync');
const {Storage, Clock, Document, server, device, flush, byClass, descendants, click} = require('./harness');
const KEY = 'g5sci.v3', CODE = 'ABCDEFGHJKMN';
const data = n => JSON.stringify({n});
function backups(d, key = KEY) { return Object.entries(d.storage.dump()).filter(([name]) => name.startsWith('g5sync.backup.' + key + '.')); }
async function pair(t) {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(1)}});
  const b = device(backend);
  t.after(() => { a.api.destroy(); b.api.destroy(); });
  await Promise.all([a.api.ready, b.api.ready]); await a.api.enable();
  const code = a.api.getState().code; await b.api.join(code);
  return {clock, backend, a, b, code};
}

test('S01 A1 first-device enable and empty second-device join preserve the exact document', async t => {
  const {backend, a, b, code} = await pair(t);
  assert.equal(backend.store.record(code).rev, 1); assert.equal(backend.store.rows.size, 1);
  assert.equal(backend.store.record(code).data, a.storage.getItem(KEY));
  assert.equal(b.storage.getItem(KEY), data(1)); assert.deepEqual(b.replacements, [KEY]);
  assert.equal(JSON.parse(b.storage.getItem('g5sync.meta')).keys[KEY].rev, 1);
  assert.equal(b.api.getState().status, '已同步 08:00');
  assert.match(code, /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/);
});

test('S02 A2 polling uploads at 4000ms and reopening the first device downloads with backup', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  b.storage.setItem(KEY, data(12));
  await clock.advance(3999); assert.equal(backend.store.record(code).rev, 1);
  await clock.advance(1); assert.equal(backend.store.record(code).rev, 2); assert.equal(backend.store.record(code).data, data(12));
  a.api.destroy(); const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy());
  await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(12)); assert.deepEqual(reopen.replacements, [KEY]);
  assert.equal(backups(reopen)[0][1], data(1));
});

test('S03 A3 competing edits show summaries; keep local backs up cloud and uses cloud revision', async t => {
  const {backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20));
  await a.api.sync(); await b.api.sync();
  assert.equal(backend.store.record(code).data, data(10)); assert.equal(b.api.getState().conflicts[KEY].rev, 2);
  assert.equal(byClass(b, 'local-summary')[0].textContent, '這台：練過 20 題');
  assert.equal(byClass(b, 'cloud-summary')[0].textContent, '雲端：練過 10 題');
  assert.match(byClass(b, 'cloud-time')[0].textContent, /2026\/10\/13 08:00（台北時間）/);
  const count = b.calls.length; await b.api.sync(); assert.equal(b.calls.length, count);
  click(b, '留這台的'); await flush();
  assert.equal(backend.store.record(code).data, data(20)); assert.equal(backend.store.record(code).rev, 3);
  assert.equal(backups(b)[0][1], data(10)); assert.equal(Object.keys(b.api.getState().conflicts).length, 0);
  a.api.destroy(); const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(20)); assert.equal(backups(reopen)[0][1], data(10));
});

test('S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document', async t => {
  const {backend, a, b} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20));
  await a.api.sync(); await b.api.sync(); await b.api.resolve(KEY, 'local');
  a.storage.setItem(KEY, data(11)); a.api.destroy();
  const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(11)); assert.ok(reopen.api.getState().conflicts[KEY]);
  click(reopen, '留雲端的'); await flush();
  assert.equal(reopen.storage.getItem(KEY), data(20)); assert.equal(backups(reopen)[0][1], data(11));
  assert.deepEqual(reopen.replacements, [KEY]);
});

test('S05 A4 joining with two documents always prompts, even if they are byte-identical', async t => {
  for (const local of [data(1), data(99)]) {
    const clock = new Clock(), backend = server(clock);
    backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
    const d = device(backend, {initial: {[KEY]: local}}); t.after(() => d.api.destroy()); await d.api.ready;
    await d.api.join(CODE);
    assert.ok(d.api.getState().conflicts[KEY]); assert.equal(d.storage.getItem(KEY), local);
    assert.equal(backend.store.record(CODE).rev, 1); assert.equal(d.calls.filter(c => c.req.op === 'put').length, 0);
    assert.deepEqual(d.replacements, []);
  }
});

for (const mode of ['offline', 'reject', 'html', 'server', 'http']) {
  test('S06 A5 failure=' + mode + ' preserves local progress and retries automatically', async t => {
    const {clock, backend, b, code} = await pair(t);
    b.storage.setItem(KEY, data(31));
    if (mode === 'offline') b.window.navigator.onLine = false; else b.mode = mode;
    const before = b.storage.getItem(KEY); await b.api.sync();
    assert.equal(b.storage.getItem(KEY), before); assert.equal(backend.store.record(code).rev, 1);
    const expected = ['offline', 'reject'].includes(mode) ? '離線中，連上網路會自動補上' : '同步失敗，稍後自動再試';
    assert.equal(b.api.getState().status, expected); assert.equal(byClass(b, 'status')[0].textContent, expected);
    b.mode = 'ok'; b.window.navigator.onLine = true;
    await clock.advance(4000);
    assert.equal(backend.store.record(code).data, before); assert.equal(backend.store.record(code).rev, 2);
    assert.match(b.api.getState().status, /^已同步 /);
  });
}

test('S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening', async t => {
  const clock = new Clock(), backend = server(clock);
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
  const d = device(backend, {initial: {[KEY]: data(2)}, endpoint: ''}); t.after(() => d.api.destroy());
  await d.api.ready; await d.api.join(CODE);
  assert.equal(d.api.getState().status, '同步失敗，稍後自動再試'); assert.equal(d.storage.getItem(KEY), data(2));
  d.api.destroy(); const reopen = device(backend, {storage: d.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
  assert.ok(reopen.api.getState().conflicts[KEY]); assert.equal(backend.store.record(CODE).rev, 1);
});

test('S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation', async t => {
  const clock = new Clock(), backend = server(clock), d = device(backend, {selector: true}); t.after(() => d.api.destroy());
  await d.api.ready;
  click(d, '輸入同步碼（已在別台開過）');
  const input = byClass(d, 'input')[0];
  for (const bad of '0O1IL') {
    input.value = bad + CODE.slice(1); click(d, '加入同步'); await flush();
    assert.equal(d.storage.getItem('g5sync.code'), null); assert.match(d.api.getState().notice, /不含 0、O、1、I、L/);
  }
  input.value = ' abcd - efgh\t- jkmn\n'; click(d, '加入同步'); await flush();
  assert.equal(d.storage.getItem('g5sync.code'), CODE); assert.equal(byClass(d, 'code')[0].textContent, 'ABCD-EFGH-JKMN');
});

test('S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator', async t => {
  const clock = new Clock(), backend = server(clock);
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(8)});
  const d = device(backend, {href: 'https://windsorya.github.io/g5-help/?unit=3#sync=abcd-efgh-jkmn&lesson=2', fetch: async (req, config, current) => {
    assert.ok(!current.window.location.hash.includes('sync='));
    return {ok: true, json: async () => backend.handle(req)};
  }}); t.after(() => d.api.destroy()); await d.api.ready;
  assert.equal(d.storage.getItem(KEY), data(8)); assert.equal(d.window.location.href, 'https://windsorya.github.io/g5-help/?unit=3#lesson=2');
  assert.deepEqual(d.history.calls[0].state, {keep: 1});
  assert.equal(d.qrLinks[0], 'https://windsorya.github.io/g5-help/?unit=3#sync=' + CODE);
  assert.match(byClass(d, 'qr')[0].innerHTML, /<svg[^>]+[\s\S]*<path/);
  assert.equal(byClass(d, 'link')[0].value, d.qrLinks[0]);
});

test('S10 A6 malformed fragment is still removed and never sent to server', async t => {
  const d = device(server(new Clock()), {href: 'https://windsorya.github.io/g5-sci-review/#sync=%ZZ'}); t.after(() => d.api.destroy());
  await d.api.ready; assert.equal(d.window.location.hash, ''); assert.equal(d.calls.length, 0); assert.match(d.api.getState().notice, /12 碼/);
});

test('S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes', async t => {
  const {clock, backend, b, code} = await pair(t);
  b.storage.setItem('g5sync.backup.' + KEY + '.1', 'backup'); b.storage.setItem('g5help.v1', 'help'); b.storage.setItem('unrelated', 'keep');
  const expected = b.storage.dump(); delete expected['g5sync.code']; delete expected['g5sync.meta'];
  click(b, '這台停止同步'); assert.deepEqual(b.storage.dump(), expected);
  b.storage.setItem(KEY, data(99)); await clock.advance(12000);
  assert.equal(backend.store.record(code).data, data(1)); assert.match(b.api.getState().status, /停止同步/);
});

test('S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty', () => {
  for (const value of [null, '', 'abc', '中文😀', '\uD800', 'x'.repeat(900000)]) {
    const input = value === null ? 'N' : 'S' + value;
    const expected = crypto.createHash('sha256').update(Buffer.from(input, 'utf16le')).digest('hex');
    assert.equal(G5Sync.contentHash(value), 'sha256-utf16le:' + expected);
  }
  assert.notEqual(G5Sync.contentHash(null), G5Sync.contentHash(''));
});

test('S13 multi-key sync serializes requests and preserves metadata belonging to another site', async t => {
  const clock = new Clock(), backend = server(clock);
  const initial = Object.fromEntries(['g5sci.v3', 'g5help.v1', 'g5math.v1', 'g5math.v2'].map((key, i) => [key, data(i)]));
  const d = device(backend, {initial, keys: Object.keys(initial)}); t.after(() => d.api.destroy());
  await d.api.ready; await d.api.enable();
  assert.equal(d.maxActive, 1); assert.equal(backend.store.rows.size, 4);
  for (const call of d.calls) {
    assert.equal(call.config.headers['Content-Type'], 'text/plain'); assert.equal(call.config.credentials, 'omit');
    assert.equal(call.config.method, 'POST'); assert.ok(!call.url.includes(d.api.getState().code));
  }
  d.api.destroy(); const other = device(backend, {storage: d.storage, keys: ['g5help.v1']}); t.after(() => other.api.destroy()); await other.api.ready;
  other.storage.setItem('g5help.v1', data(50)); await other.api.sync();
  const meta = JSON.parse(other.storage.getItem('g5sync.meta')).keys;
  assert.equal(meta['g5help.v1'].rev, 2); assert.equal(meta['g5math.v2'].rev, 1); assert.equal(Object.keys(meta).length, 4);
});

test('S14 visibility hidden and online event immediately attempt pending work', async t => {
  const {backend, b, code} = await pair(t);
  b.storage.setItem(KEY, data(7)); b.doc.visibilityState = 'hidden'; b.doc.dispatch('visibilitychange'); await flush();
  assert.equal(backend.store.record(code).data, data(7));
  b.mode = 'reject'; b.storage.setItem(KEY, data(8)); await b.api.sync();
  b.mode = 'ok'; b.window.dispatch('online'); await flush();
  assert.equal(backend.store.record(code).data, data(8));
});

test('S15 backoff is exponential, capped at 60 seconds, and timers do not bypass it', async t => {
  const {clock, b} = await pair(t); b.mode = 'server'; b.storage.setItem(KEY, data(5));
  await b.api.sync();
  for (const delay of [4000, 8000, 16000, 32000, 60000, 60000]) {
    assert.equal(b.api.getState().retryAt - clock.now(), delay);
    const before = b.calls.length; await clock.advance(delay - 1); assert.equal(b.calls.length, before);
    await clock.advance(1); assert.equal(b.calls.length, before + 1);
  }
  b.mode = 'ok'; await clock.advance(60000); assert.equal(b.api.getState().failures, 0);
});

test('S16 edit while put is in flight is not falsely marked synced and is pushed on the next poll', async t => {
  const {clock, backend, b, code} = await pair(t);
  b.mode = 'hold'; b.storage.setItem(KEY, data(10)); const pending = b.api.sync(); await flush();
  b.storage.setItem(KEY, data(11)); b.mode = 'ok'; b.held(); await pending;
  assert.equal(backend.store.record(code).data, data(10)); assert.equal(b.api.getState().status, '等待同步本機變更');
  assert.equal(JSON.parse(b.storage.getItem('g5sync.meta')).keys[KEY].hash, G5Sync.contentHash(data(10)));
  await clock.advance(4000); assert.equal(backend.store.record(code).data, data(11)); assert.equal(b.maxActive, 1);
});

test('S17 edit while startup get is in flight becomes a conflict instead of being overwritten', async t => {
  const {backend, a, b} = await pair(t);
  b.storage.setItem(KEY, data(8)); await b.api.sync(); a.api.destroy();
  let release;
  const reopen = device(backend, {storage: a.storage, fetch: req => new Promise(resolve => { release = () => resolve({ok: true, json: async () => backend.handle(req)}); })});
  t.after(() => reopen.api.destroy()); await flush();
  reopen.storage.setItem(KEY, data(9)); release(); await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(9)); assert.ok(reopen.api.getState().conflicts[KEY]); assert.deepEqual(reopen.replacements, []);
});

test('S18 stop during in-flight request cannot restore code/meta or replace local data', async t => {
  const {backend, a, b, code} = await pair(t); a.api.destroy(); b.api.destroy();
  let release;
  backend.handle({op: 'put', code, key: KEY, rev: 1, data: data(77)});
  const reopen = device(backend, {storage: a.storage, fetch: req => new Promise(resolve => { release = () => resolve({ok: true, json: async () => backend.handle(req)}); })});
  t.after(() => reopen.api.destroy()); await flush(); reopen.api.stop(); release(); await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(1)); assert.equal(reopen.storage.getItem('g5sync.meta'), null);
  assert.equal(reopen.storage.getItem('g5sync.code'), null); assert.deepEqual(reopen.replacements, []);
});

test('S19 repeated conflicts keep exactly the three most recent backups, even with a fixed clock', async t => {
  const {backend, a, b} = await pair(t);
  for (let i = 2; i <= 6; i++) {
    a.storage.setItem(KEY, data(i * 10)); await a.api.sync();
    if (a.api.getState().conflicts[KEY]) await a.api.resolve(KEY, 'local');
    b.storage.setItem(KEY, data(i)); await b.api.sync(); await b.api.resolve(KEY, 'cloud');
  }
  const kept = backups(b); assert.equal(kept.length, 3); assert.deepEqual(kept.map(([, value]) => value), [data(4), data(5), data(6)]);
  assert.equal(new Set(kept.map(([name]) => name)).size, 3);
});

test('S20 quota failure writing a backup blocks replacement and cloud overwrite', async t => {
  const {backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20)); await a.api.sync(); await b.api.sync();
  b.storage.fail = key => key.startsWith('g5sync.backup.');
  await b.api.resolve(KEY, 'cloud'); assert.equal(b.storage.getItem(KEY), data(20)); assert.deepEqual(b.replacements, [KEY]);
  await b.api.resolve(KEY, 'local'); assert.equal(backend.store.record(code).data, data(10));
  assert.match(b.api.getState().notice, /儲存空間/); assert.ok(b.api.getState().conflicts[KEY]);
});

test('S21 cloud changes again while conflict is displayed; both choices require a fresh decision', async t => {
  for (const choice of ['cloud', 'local']) {
    const {backend, a, b, code} = await pair(t);
    a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20)); await a.api.sync(); await b.api.sync();
    backend.handle({op: 'put', code, key: KEY, rev: 2, data: data(30)});
    await b.api.resolve(KEY, choice);
    assert.equal(backend.store.record(code).data, data(30)); assert.equal(b.storage.getItem(KEY), data(20));
    assert.equal(b.api.getState().conflicts[KEY].data, data(30));
  }
});

test('S22 invalid server response and malformed metadata never silently overwrite local data', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend, {initial: {[KEY]: data(3), 'g5sync.code': CODE, 'g5sync.meta': '{broken'}, fetch: async () => ({ok: true, json: async () => ({ok: true, rev: 1, data: null, updated: 5})})});
  t.after(() => d.api.destroy()); await d.api.ready;
  assert.equal(d.storage.getItem(KEY), data(3)); assert.equal(d.api.getState().status, '同步失敗，稍後自動再試');
});

test('S23 button accessibility, text-only summaries and clipboard fallback keep sharing usable', async t => {
  const {backend, b, code} = await pair(t);
  for (const node of descendants(b.doc.container).filter(node => node.tagName === 'BUTTON')) assert.equal(node.style.minHeight, '44px');
  assert.equal(byClass(b, 'status')[0].getAttribute('role'), 'status');
  click(b, '複製連結'); assert.equal(byClass(b, 'link')[0].selected, true);
  let copied; b.window.navigator.clipboard = {writeText: async value => { copied = value; }};
  click(b, '複製連結'); await flush(); assert.equal(copied, b.api.link()); assert.equal(b.api.getState().notice, '連結已複製。');
  const evil = device(backend, {initial: {[KEY]: data(2)}, summarize: {[KEY]: () => '<img src=x onerror=alert(1)>'}}); t.after(() => evil.api.destroy());
  await evil.api.ready; await evil.api.join(code);
  assert.equal(byClass(evil, 'local-summary')[0].innerHTML, ''); assert.match(byClass(evil, 'local-summary')[0].textContent, /<img/);
});

test('S24 first-device secure randomness has no Math.random fallback', async t => {
  const backend = server(new Clock());
  const d = device(backend, {nativeRandom: true}); t.after(() => d.api.destroy()); await d.api.ready; await d.api.enable();
  assert.match(d.api.getState().code, /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/);
  const denied = device(backend, {nativeRandom: true, noCrypto: true}); t.after(() => denied.api.destroy()); await denied.api.ready;
  assert.equal(await denied.api.enable(), false); assert.equal(denied.storage.getItem('g5sync.code'), null); assert.match(denied.api.getState().notice, /安全產生/);
});

test('S25 hanging request times out, releases the queue and later recovers', async t => {
  const {clock, backend, b, code} = await pair(t); b.mode = 'hold'; b.storage.setItem(KEY, data(88));
  const pending = b.api.sync(); await flush(); await clock.advance(15000); await pending;
  assert.equal(b.api.getState().status, '離線中，連上網路會自動補上'); assert.equal(b.maxActive, 1);
  b.mode = 'ok'; await clock.advance(4000); assert.equal(backend.store.record(code).data, data(88));
});

test('S26 existing empty-string documents, new keys and join with empty cloud upload without parsing or merging', async t => {
  const backend = server(new Clock());
  const d = device(backend, {initial: {[KEY]: ''}, summarize: {[KEY]: () => { throw new Error('bad summary'); }}}); t.after(() => d.api.destroy());
  await d.api.ready; await d.api.join(CODE);
  assert.equal(backend.store.record(CODE).rev, 1); assert.equal(backend.store.record(CODE).data, '');
  const next = device(backend, {storage: d.storage, keys: ['g5math.v2']}); t.after(() => next.api.destroy()); await next.api.ready;
  next.storage.setItem('g5math.v2', '{"whole":true}'); await next.api.sync();
  assert.equal(backend.store.record(CODE, 'g5math.v2').data, '{"whole":true}');
});

test('S27 a too-large key cannot starve other keys; shrinking it later recovers', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend, {keys: [KEY, 'g5help.v1'], initial: {[KEY]: 'x'.repeat(900001), 'g5help.v1': data(5)}}); t.after(() => d.api.destroy());
  await d.api.ready; await d.api.enable(); const code = d.api.getState().code;
  assert.equal(backend.store.record(code), null); assert.equal(backend.store.record(code, 'g5help.v1').data, data(5));
  assert.match(d.api.getState().notice, /900000/); assert.equal(d.storage.getItem(KEY).length, 900001);
  d.storage.setItem(KEY, data(6)); await clock.advance(4000); assert.equal(backend.store.record(code).data, data(6));
  assert.equal(d.api.getState().notice, '');
});

test('S28 all downloaded keys are saved before the first replacement callback can reload the page', async t => {
  const backend = server(new Clock()); const keys = [KEY, 'g5help.v1'];
  keys.forEach((key, n) => backend.handle({op: 'put', code: CODE, key, rev: 0, data: data(n + 1)}));
  const observed = [];
  const d = device(backend, {keys, onReplaced(key, current) { observed.push(keys.map(k => current.storage.getItem(k))); }});
  t.after(() => d.api.destroy()); await d.api.ready; await d.api.join(CODE);
  assert.deepEqual(d.replacements, keys); assert.deepEqual(observed, [[data(1), data(2)], [data(1), data(2)]]);
});

test('S29 same-origin stop event clears another tab panel and prevents subsequent writes', async t => {
  const {backend, a, code} = await pair(t);
  const tab = device(backend, {storage: a.storage}); t.after(() => tab.api.destroy()); await tab.api.ready;
  a.api.stop(); tab.window.dispatch('storage', {key: 'g5sync.code'}); await flush();
  assert.equal(tab.api.getState().code, null);
  tab.storage.setItem(KEY, data(42)); await tab.api.sync(); assert.equal(backend.store.record(code).rev, 1);
});

test('S30 removing a progress key locally does not delete the cloud copy or falsely claim sync', async t => {
  const {backend, b, code} = await pair(t); b.storage.removeItem(KEY); await b.api.sync();
  assert.equal(backend.store.record(code).data, data(1)); assert.equal(b.storage.getItem(KEY), null);
  assert.match(b.api.getState().status, /雲端紀錄保留/);
});

test('S31 a committed put with lost acknowledgement becomes an explicit conflict on retry', async t => {
  const {clock, backend, a, code} = await pair(t); a.api.destroy();
  let lose = true;
  const d = device(backend, {storage: a.storage, fetch: async req => {
    const result = backend.handle(req);
    if (req.op === 'put' && lose) { lose = false; throw new TypeError('lost response after commit'); }
    return {ok: true, json: async () => result};
  }}); t.after(() => d.api.destroy()); await d.api.ready;
  d.storage.setItem(KEY, data(80)); await d.api.sync();
  assert.equal(backend.store.record(code).rev, 2); assert.equal(d.api.getState().status, '離線中，連上網路會自動補上');
  await clock.advance(4000); assert.ok(d.api.getState().conflicts[KEY]); assert.equal(backend.store.record(code).rev, 2);
  assert.equal(d.storage.getItem(KEY), data(80));
});

test('S32 switching family while a get is in flight ignores the old response and keeps a single request active', async t => {
  const backend = server(new Clock()); const otherCode = '23456789ABCD';
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
  backend.handle({op: 'put', code: otherCode, key: KEY, rev: 0, data: data(2)});
  let release, first = true;
  const d = device(backend, {initial: {'g5sync.code': CODE}, fetch: req => {
    if (first) { first = false; return new Promise(resolve => { release = () => resolve({ok: true, json: async () => backend.handle(req)}); }); }
    return {ok: true, json: async () => backend.handle(req)};
  }}); t.after(() => d.api.destroy()); await flush();
  const joining = d.api.join(otherCode); release(); await joining;
  assert.equal(d.storage.getItem(KEY), data(2)); assert.equal(d.storage.getItem('g5sync.code'), otherCode);
  assert.deepEqual(d.replacements, [KEY]); assert.equal(d.maxActive, 1);
});

test('S33 unresolved join conflict remains a conflict after refreshing the page', async t => {
  const backend = server(new Clock()); backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
  const d = device(backend, {initial: {[KEY]: data(2)}}); t.after(() => d.api.destroy()); await d.api.ready; await d.api.join(CODE);
  d.api.destroy(); const reopen = device(backend, {storage: d.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
  assert.ok(reopen.api.getState().conflicts[KEY]); assert.equal(reopen.storage.getItem(KEY), data(2)); assert.equal(backend.store.record(CODE).rev, 1);
});

test('S34 metadata write failure after downloading still notifies the host about changed local data', async t => {
  const backend = server(new Clock()); backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
  const storage = new Storage({'g5sync.code': CODE}); storage.fail = key => key === 'g5sync.meta';
  const d = device(backend, {storage}); t.after(() => d.api.destroy()); await d.api.ready;
  assert.equal(storage.getItem(KEY), data(1)); assert.deepEqual(d.replacements, [KEY]); assert.match(d.api.getState().status, /同步失敗/);
});

test('S35 CommonJS export can initialize directly in Node with injected DOM owner and storage', async () => {
  const doc = new Document(), storage = new Storage();
  const api = G5Sync.init({container: doc.container, storage, fetch: async () => { throw Error('must not fetch'); }, endpoint: 'unused', autoEnable: false, keys: [KEY]});
  try { await api.ready; assert.equal(api.getState().code, null); } finally { api.destroy(); }
});

test('S41 五上國語、社會站的 key（g5chi.v1、g5soc.v1）可以初始化，不丟 bad-key；不在白名單的 key 仍拒絕', async () => {
  for (const key of ['g5chi.v1', 'g5soc.v1']) {
    const doc = new Document(), storage = new Storage();
    const api = G5Sync.init({container: doc.container, storage, fetch: async () => { throw Error('must not fetch'); }, endpoint: 'unused', autoEnable: false, keys: [key]});
    try { await api.ready; assert.equal(api.getState().code, null); } finally { api.destroy(); }
  }
  assert.throws(() => G5Sync.init({container: new Document().container, storage: new Storage(), keys: ['g5xyz.v1']}), /bad-key/);
});

test('S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20)); await a.api.sync(); await b.api.sync();
  await clock.advance(8000); assert.equal(backend.store.record(code).data, data(10));
  b.mode = 'reject'; await b.api.resolve(KEY, 'local'); assert.equal(b.api.getState().status, '離線中，連上網路會自動補上');
  b.mode = 'ok'; await clock.advance(4000);
  assert.equal(backend.store.record(code).data, data(20)); assert.equal(backend.store.record(code).rev, 3);
  assert.equal(Object.keys(b.api.getState().conflicts).length, 0);
});

test('S37 cloud choice retries a failed download and backs up local progress after recovery', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20)); await a.api.sync(); await b.api.sync();
  b.mode = 'html'; await b.api.resolve(KEY, 'cloud'); assert.equal(b.storage.getItem(KEY), data(20));
  b.mode = 'ok'; await clock.advance(4000);
  assert.equal(b.storage.getItem(KEY), data(10)); assert.equal(backups(b)[0][1], data(20));
  assert.equal(backend.store.record(code).rev, 2);
});

test('S32 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(1)}});
  t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  let allow = true; const accepted = [];
  const b = device(backend, {canReplace: () => allow,
    accept: (key, value) => { accepted.push(key); b.storage.setItem(key, value); return true; }});
  t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code);
  assert.equal(b.storage.getItem(KEY), data(1)); assert.deepEqual(accepted, [KEY], '加入時的下載也經由 accept');
  a.storage.setItem(KEY, data(7)); await clock.advance(4000);
  assert.equal(backend.store.record(code).data, data(7));
  // 孩子重開頁面、直接進某一篇（頁面說現在不能換）
  b.api.destroy(); allow = false;
  const b2 = device(backend, {storage: b.storage, canReplace: () => allow,
    accept: (key, value) => { accepted.push(key); b2.storage.setItem(key, value); return true; }});
  t.after(() => b2.api.destroy());
  const nb = backups(b2).length;
  await b2.api.ready; await clock.advance(8000);
  assert.equal(b2.storage.getItem(KEY), data(1), '不允許時本機不被換掉');
  assert.equal(backups(b2).length, nb, '不允許時不寫備份（避免每 4 秒擠掉舊備份）');
  assert.deepEqual(accepted, [KEY]);
  assert.match(b2.api.getState().status, /回到首頁/);
  allow = true; await clock.advance(4000);
  assert.equal(b2.storage.getItem(KEY), data(7), '允許後經由 accept 換成雲端版');
  assert.deepEqual(accepted, [KEY, KEY]);
  assert.equal(backups(b2).length, nb + 1, '真的要換時才備份一次');
});

test('S33 有 accept 的頁面（難題站）本機內容已經等於雲端（例如頁面寫進去了但讀回失敗）：只補 baseline，不出衝突、不再換', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(1)}});
  t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  const b = device(backend);
  t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code);
  a.storage.setItem(KEY, data(7)); await clock.advance(4000);
  // b 的本機已經是 data(7)，但 baseline 還停在 rev 1
  b.storage.setItem(KEY, data(7)); b.api.destroy();
  const b2 = device(backend, {storage: b.storage, canReplace: () => true, accept: (k, v) => { b2.storage.setItem(k, v); return true; }}); t.after(() => b2.api.destroy());
  const nb = backups(b2).length;
  await b2.api.ready;
  assert.equal(Object.keys(b2.api.getState().conflicts).length, 0, '內容一樣不該問要留哪一份');
  assert.equal(JSON.parse(b2.storage.getItem('g5sync.meta')).keys[KEY].rev, backend.store.record(code).rev, 'baseline 補到雲端的 rev');
  assert.equal(backups(b2).length, nb, '內容一樣不必備份');
  assert.doesNotMatch(b2.api.getState().status, /回到首頁/, '補完 baseline 不再顯示「回到首頁就會換上」');
});

// #1303 第 7 輪後依升級階梯縮範圍：頁面自己是寫入者（有 accept）時，關閉「留這台／留雲端」衝突選擇——
// 兩台紀錄不一樣就各自保留：這台照常用這台的、雲端那份不動；不出選擇按鈕，resolve 一律拒絕。
test('S34 有 accept 的頁面：衝突時不出選擇按鈕、resolve 拒絕、本機與雲端都不被蓋掉', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(1)}});
  t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  const b = device(backend, {canReplace: () => true, accept: (key, value) => { b.storage.setItem(key, value); return true; }});
  t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code);
  // 兩邊各自改：a 上傳 data(5)；b 本機改成 data(9)
  a.storage.setItem(KEY, data(5)); await clock.advance(4000);
  b.storage.setItem(KEY, data(9)); await clock.advance(4000);
  const st = b.api.getState();
  assert.equal(b.storage.getItem(KEY), data(9), '這台照常用這台的');
  assert.equal(backend.store.record(code).data, data(5), '雲端那份不動');
  const buttons = descendants(b.doc.container).filter((n) => n.tagName === 'BUTTON' && /留這台|留雲端/.test(n.textContent));
  assert.equal(buttons.length, 0, '不出選擇按鈕');
  assert.equal(await b.api.resolve(KEY, 'cloud'), false, 'resolve 拒絕');
  assert.equal(b.storage.getItem(KEY), data(9));
  assert.match(st.status, /不一樣|各自保留/, st.status);
});

test('S35 沒有 accept 的頁面（自然站）：衝突仍出選擇按鈕，行為與改前一致', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(5)); await clock.advance(4000);
  b.storage.setItem(KEY, data(9)); await clock.advance(4000);
  const buttons = descendants(b.doc.container).filter((n) => n.tagName === 'BUTTON' && /留這台|留雲端/.test(n.textContent));
  assert.equal(buttons.length, 2);
});

test('S36 沒有 accept 的頁面：本機＝雲端但 baseline 舊時，照改前出衝突（相等捷徑只給有 accept 的頁面）', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(1)}});
  t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  const b = device(backend); t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code);
  a.storage.setItem(KEY, data(7)); await clock.advance(4000);
  b.storage.setItem(KEY, data(7)); b.api.destroy();
  const b2 = device(backend, {storage: b.storage}); t.after(() => b2.api.destroy());
  await b2.api.ready;
  assert.equal(Object.keys(b2.api.getState().conflicts).length, 1, '自然站照改前：出衝突');
});

// Codex 審 5367999 的 FAIL「上傳回應遺失」：後端已存好、只是回應丟了 → 重試時雲端內容＝這次要送的內容。
// 有 accept 的頁面（難題站）不出衝突（它沒有選擇按鈕，出衝突＝從此不再同步），只補 baseline 並繼續同步。
test('S38 有 accept 的頁面：上傳回應遺失後重試，雲端內容＝要送的內容 ⇒ 不出衝突、之後的進度照常上傳', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(8)}}); t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code; a.api.destroy();
  let lose = true;
  const d = device(backend, {storage: a.storage, canReplace: () => true, accept: (k, v) => { d.storage.setItem(k, v); return true; },
    fetch: async req => {
      const result = backend.handle(req);
      if (req.op === 'put' && lose) { lose = false; throw new TypeError('lost response after commit'); }
      return {ok: true, json: async () => result};
    }}); t.after(() => d.api.destroy()); await d.api.ready;
  d.storage.setItem(KEY, data(9)); await d.api.sync();
  assert.equal(backend.store.record(code).data, data(9));
  await clock.advance(4000);
  assert.equal(Object.keys(d.api.getState().conflicts).length, 0, '內容一樣不是兩份紀錄');
  assert.doesNotMatch(d.api.getState().status, /不一樣/);
  d.storage.setItem(KEY, data(10)); await clock.advance(60000);
  assert.equal(backend.store.record(code).data, data(10), '之後的進度要能繼續上傳');
});

// Codex 審 bdad9d6：回應遺失後、重試前又多答一題（本機 10、雲端是自己剛送的 9）→ 仍卡衝突。
// 判準改成「雲端內容是上次確認後我送出過的任何一份」＝自己的寫入。
test('S39 有 accept 的頁面：回應遺失後又多答一題才重試，雲端是自己先前送的那份 ⇒ 不出衝突、最新進度照常上傳', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(8)}}); t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code; a.api.destroy();
  let lose = true;
  const d = device(backend, {storage: a.storage, canReplace: () => true, accept: (k, v) => { d.storage.setItem(k, v); return true; },
    fetch: async req => {
      const result = backend.handle(req);
      if (req.op === 'put' && lose) { lose = false; throw new TypeError('lost response after commit'); }
      return {ok: true, json: async () => result};
    }}); t.after(() => d.api.destroy()); await d.api.ready;
  d.storage.setItem(KEY, data(9)); await d.api.sync();
  assert.equal(backend.store.record(code).data, data(9));
  d.storage.setItem(KEY, data(10));
  await clock.advance(60000);
  assert.equal(Object.keys(d.api.getState().conflicts).length, 0, '雲端那份是自己送的，不是兩份紀錄');
  assert.equal(backend.store.record(code).data, data(10), '最新進度要上傳');
});

test('S40 有 accept 的頁面：雲端是別台裝置的內容（不是自己送過的）仍照縮範圍規則各自保留，不覆蓋', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  b.api.destroy();
  const b2 = device(backend, {storage: b.storage, canReplace: () => true, accept: (k, v) => { b2.storage.setItem(k, v); return true; }}); t.after(() => b2.api.destroy());
  await b2.api.ready;
  a.storage.setItem(KEY, data(50)); await a.api.sync();
  b2.storage.setItem(KEY, data(60)); await clock.advance(60000);
  assert.equal(backend.store.record(code).data, data(50), '別台的不能被蓋掉');
  assert.equal(b2.storage.getItem(KEY), data(60), '這台的也不能被蓋掉');
});

// 補題區（upload.js）靠這個事件認出同一頁換家庭（4agent 最終方案 (d)-縮 1a，報告 ~/scripts/state/fouragent_20261013_upload/4A_upload_report.md）
function capture(d, mode) {
  const got = [];
  d.doc.createEvent = kind => { if (mode === 'createEvent') throw new Error('boom'); return {kind, initEvent(type, bubbles, cancelable) { Object.assign(this, {type, bubbles, cancelable}); }}; };
  d.window.dispatchEvent = ev => { if (mode === 'dispatch') throw new Error('boom'); got.push({type: ev.type, oldValue: ev.oldValue, newValue: ev.newValue}); return true; };
  return got;
}
test('S43 寫入或刪除同步碼後，在 window 派 g5sync:codechange（帶新舊值）；加入、建立、停止都派', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend); t.after(() => d.api.destroy()); await d.api.ready;
  const got = capture(d);
  await d.api.join(CODE);
  assert.deepEqual(got, [{type: 'g5sync:codechange', oldValue: null, newValue: CODE}]);
  assert.equal(d.api.stop(), true);
  assert.deepEqual(got[1], {type: 'g5sync:codechange', oldValue: CODE, newValue: null});
  await d.api.enable();
  const code = d.storage.getItem('g5sync.code');
  assert.match(code, /^[A-Z2-9]{12}$/);
  assert.deepEqual(got[2], {type: 'g5sync:codechange', oldValue: null, newValue: code});
  assert.equal(got.length, 3);
});

test('A21 派事件丟錯（dispatchEvent／createEvent 會 throw）：同步碼照樣寫入、刪除，流程不變', async t => {
  for (const mode of ['dispatch', 'createEvent']) {
    const clock = new Clock(), backend = server(clock);
    const d = device(backend); t.after(() => d.api.destroy()); await d.api.ready;
    capture(d, mode);
    await d.api.join(CODE);
    assert.equal(d.storage.getItem('g5sync.code'), CODE, mode);
    assert.equal(d.api.getState().code, CODE, mode);
    assert.equal(d.api.stop(), true, mode);
    assert.equal(d.storage.getItem('g5sync.code'), null, mode);
    assert.match(d.api.getState().status, /停止同步/, mode);
  }
});

test('S42 錯題複習站的 key（g5wrong.v1）可以初始化（2026-10-13 律師交辦錯題複習）', async () => {
  const doc = new Document(), storage = new Storage();
  const api = G5Sync.init({container: doc.container, storage, fetch: async () => { throw Error('must not fetch'); }, endpoint: 'unused', autoEnable: false, keys: ['g5wrong.v1']});
  try { await api.ready; assert.equal(api.getState().code, null); } finally { api.destroy(); }
});
