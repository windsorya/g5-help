'use strict';
// #2164／#2189（2026-10-15 律師）：「請解決 iPad 將複習 App 加入主畫面後，進度會跟瀏覽器複習進度不一致的問題。」
// 「應該要以最新的複習進度為準，通常會是練習題目比較最多的那一次記錄」
// ⇒ 兩份不一樣時不再二選一：留練過題數多的那份（log 陣列總長），輸的那份一定留 backup；沒碼的環境自動開同步＋頁首提醒。
const test = require('node:test');
const assert = require('node:assert/strict');
const {Clock, server, device, flush, descendants} = require('./harness');
const KEY = 'g5sci.v3';
// 真實存檔的形狀：每次作答一筆 log（自然／數學／國語／社會站同一格式）
const v3 = (answers, tag = '') => JSON.stringify({v: 3, cards: {}, log: Array.from({length: answers}, (_, i) => ({op: tag + i, ok: true})), settings: {}});
const backups = (d, key = KEY) => Object.entries(d.storage.dump()).filter(([n]) => n.startsWith('g5sync.backup.' + key + '.')).map(([, v]) => v);
const AUTO = {autoResolve: true, summarize: {[KEY]: j => 'x'}};
const owned = (d) => ({canReplace: () => true, accept: (key, value) => { d().storage.setItem(key, value); return true; }});

async function family(t, aData, bData, opts = {}) {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: aData}, ...AUTO});
  t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  let b; b = device(backend, {initial: {[KEY]: bData}, ...AUTO, ...(opts.owned ? owned(() => b) : {})});
  t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code); await flush();
  return {clock, backend, a, b, code};
}

test('R01 律師判準：主畫面那台練得少（3 題）、雲端那份練得多（22 題）⇒ 加入後留 22 題那份，3 題那份留 backup，不出選擇', async t => {
  const {backend, b, code} = await family(t, v3(22, 'safari'), v3(3, 'home'));
  assert.equal(b.storage.getItem(KEY), v3(22, 'safari'));
  assert.equal(backend.store.record(code).data, v3(22, 'safari'));
  assert.deepEqual(backups(b), [v3(3, 'home')], '輸的那份留在這台');
  assert.equal(Object.keys(b.api.getState().conflicts).length, 0, '不再二選一');
  assert.equal(descendants(b.doc.container).filter(n => n.tagName === 'BUTTON' && /留這台|留雲端/.test(n.textContent)).length, 0);
});

test('R02 律師判準反向：這台練得多（30 題）⇒ 上傳蓋過雲端（版本號照接），雲端原本那份留 backup', async t => {
  const {backend, b, code} = await family(t, v3(5, 'old'), v3(30, 'new'));
  assert.equal(backend.store.record(code).data, v3(30, 'new'));
  assert.equal(backend.store.record(code).rev, 2);
  assert.equal(b.storage.getItem(KEY), v3(30, 'new'));
  assert.deepEqual(backups(b), [v3(5, 'old')]);
  assert.equal(Object.keys(b.api.getState().conflicts).length, 0);
});

test('R03 內容一字不差：不備份、不多寫一版、不出選擇', async t => {
  const {backend, b, code} = await family(t, v3(7, 'same'), v3(7, 'same'));
  assert.equal(backend.store.record(code).rev, 1);
  assert.deepEqual(backups(b), []);
  assert.equal(Object.keys(b.api.getState().conflicts).length, 0);
});

test('R04 讀不懂的紀錄不猜：退回原本的選擇畫面，兩邊都不動', async t => {
  const {backend, b, code} = await family(t, v3(4), 'not json');
  assert.equal(b.storage.getItem(KEY), 'not json');
  assert.equal(backend.store.record(code).data, v3(4));
  assert.ok(b.api.getState().conflicts[KEY]);
});

test('R05 已連上的兩台各自練：另一台先上傳 8 題，這台本機練到 12 題 ⇒ 留 12 題那份；另一台下次就換上 12 題', async t => {
  const {clock, backend, a, b, code} = await family(t, v3(1, 'x'), null);
  assert.equal(b.storage.getItem(KEY), v3(1, 'x'));
  a.storage.setItem(KEY, v3(8, 'a')); await clock.advance(4000);
  b.storage.setItem(KEY, v3(12, 'b')); await clock.advance(4000);
  assert.equal(backend.store.record(code).data, v3(12, 'b'));
  assert.ok(backups(b).includes(v3(8, 'a')), '另一台那 8 題留在這台 backup');
  a.api.destroy(); const reopen = device(backend, {storage: a.storage, ...AUTO}); t.after(() => reopen.api.destroy());
  await reopen.api.ready; await flush();
  assert.equal(reopen.storage.getItem(KEY), v3(12, 'b'), '另一台重開頁就換上 12 題（一般站只在開頁／切回時下載，S02 同一設計）');
});

test('R06 題數一樣時比 cards.seen；再一樣留這台', async t => {
  const withSeen = (n, seen) => JSON.stringify({v: 3, log: Array.from({length: n}, (_, i) => ({op: 's' + i})), cards: {c1: {seen}}});
  const r1 = await family(t, withSeen(5, 9), withSeen(5, 2));
  assert.equal(r1.b.storage.getItem(KEY), withSeen(5, 9));
  const r2 = await family(t, v3(4, 'p'), v3(4, 'q'));
  assert.equal(r2.backend.store.record(r2.code).data, v3(4, 'q'), '完全打平留這台');
});

test('R07 難題站（有 accept）也照判準：雲端練得多就換上、這台練得多就經待確認上傳送出；輸的那份都留 backup', async t => {
  const help = n => JSON.stringify({v: 1, entries: {p1: {solved: n, log: Array.from({length: n}, (_, i) => [i, 1])}}, hidden: {}});
  const r1 = await family(t, help(6), help(2), {owned: true});
  assert.equal(r1.b.storage.getItem(KEY), help(6));
  assert.deepEqual(backups(r1.b), [help(2)]);
  assert.equal(Object.keys(r1.b.api.getState().conflicts).length, 0);
  const r2 = await family(t, help(1), help(9), {owned: true});
  await r2.clock.advance(4000);
  assert.equal(r2.backend.store.record(r2.code).data, help(9));
  assert.equal(r2.backend.store.record(r2.code).rev, 2);
  assert.deepEqual(backups(r2.b), [help(1)]);
  const ck = JSON.parse(r2.b.storage.getItem('g5sync.ckpt.' + KEY));
  assert.equal(ck.pending, null); assert.equal(ck.baseline.rev, 2);
});

test('R08 錯題站形狀（it[*].log）也數得到', async t => {
  const wrong = n => JSON.stringify({v: 1, it: {q1: {m: false, log: Array.from({length: n}, () => ['2026-10-15', 1])}}});
  const {b} = await family(t, wrong(10), wrong(2));
  assert.equal(b.storage.getItem(KEY), wrong(10));
});

test('R09 沒有同步碼的環境（主畫面圖示第一次打開）自動開同步：建碼、上傳、標成「還沒連上家人」、頁首出提醒', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend, {initial: {[KEY]: v3(3, 'home')}, autoEnable: true, autoResolve: true});
  t.after(() => d.api.destroy());
  await d.api.ready; await flush();
  const code = d.api.getState().code;
  assert.match(code, /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/);
  assert.equal(backend.store.record(code).data, v3(3, 'home'), '一打開就上雲端');
  assert.equal(d.storage.getItem('g5sync.auto'), code);
  const banner = d.doc.body.children.find(n => n.className === 'g5s-banner');
  assert.ok(banner, '頁首提醒'); assert.match(banner.textContent, /還沒跟家裡其他裝置連起來/);
});

test('R10 自動碼的環境貼上家人的整條連結 ⇒ 加入家庭、提醒消失、照判準留練得多那份', async t => {
  const clock = new Clock(), backend = server(clock);
  const home = device(backend, {initial: {[KEY]: v3(22, 'safari')}, ...AUTO});
  t.after(() => home.api.destroy());
  await home.api.ready; await home.api.enable();
  const family = home.api.getState().code, link = 'https://windsorya.github.io/g5-chinese-review/#sync=' + family;
  const pad = device(backend, {initial: {[KEY]: v3(3, 'pad')}, autoEnable: true, autoResolve: true, seed: 101});
  t.after(() => pad.api.destroy());
  await pad.api.ready; await flush();
  assert.notEqual(pad.api.getState().code, family);
  const banner = pad.doc.body.children.find(n => n.className === 'g5s-banner');
  const input = descendants(banner).find(n => n.tagName === 'INPUT');
  input.value = link; descendants(banner).find(n => n.tagName === 'BUTTON').click(); await flush(); await clock.advance(10);
  assert.equal(pad.api.getState().code, family);
  assert.equal(pad.storage.getItem('g5sync.auto'), null);
  assert.equal(pad.doc.body.children.filter(n => n.className === 'g5s-banner').length, 0, '提醒消失');
  assert.equal(pad.storage.getItem(KEY), v3(22, 'safari'));
  assert.deepEqual(backups(pad), [v3(3, 'pad')]);
});

test('R11 從 #sync= 連結打開：直接加入那個家庭，不另建自動碼', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: v3(2)}, ...AUTO}); t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable(); const code = a.api.getState().code;
  const b = device(backend, {href: 'https://windsorya.github.io/g5-sci-review/#sync=' + code, autoEnable: true, autoResolve: true});
  t.after(() => b.api.destroy()); await b.api.ready; await flush();
  assert.equal(b.api.getState().code, code);
  assert.equal(b.storage.getItem('g5sync.auto'), null);
  assert.equal(b.storage.getItem(KEY), v3(2));
});

test('R12 輸入框收：含連字號的碼、整條連結；亂打仍報格式錯', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend, {...AUTO}); t.after(() => d.api.destroy()); await d.api.ready;
  assert.equal(await d.api.join('https://x.test/a/#foo=1&sync=ABCD-EFGH-JKMN'), true);
  assert.equal(d.api.getState().code, 'ABCDEFGHJKMN');
  assert.equal(await d.api.join('hello'), false);
  assert.match(d.api.getState().notice, /12 碼/);
});

test('R13 autoResolve 關掉時照舊出選擇（舊測試那套機制仍可用）', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: v3(22)}}); t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable(); const code = a.api.getState().code;
  const b = device(backend, {initial: {[KEY]: v3(3)}}); t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code);
  assert.ok(b.api.getState().conflicts[KEY]);
});

test('R14 自動化測試瀏覽器（navigator.webdriver＝true）不自動開同步：別站沒攔 GAS 的 e2e 不會寫進真試算表；noauto 開關同樣擋', async t => {
  const clock = new Clock(), backend = server(clock);
  const bot = device(backend, {initial: {[KEY]: v3(3)}, autoEnable: true, autoResolve: true, navigator: {onLine: true, webdriver: true}});
  t.after(() => bot.api.destroy()); await bot.api.ready; await flush();
  assert.equal(bot.api.getState().code, null); assert.equal(bot.calls.length, 0);
  const off = device(backend, {initial: {[KEY]: v3(3), 'g5sync.noauto': '1'}, autoEnable: true, autoResolve: true});
  t.after(() => off.api.destroy()); await off.api.ready; await flush();
  assert.equal(off.api.getState().code, null); assert.equal(off.calls.length, 0);
  const real = device(backend, {initial: {[KEY]: v3(3)}, autoEnable: true, autoResolve: true, navigator: {onLine: true, webdriver: false}});
  t.after(() => real.api.destroy()); await real.api.ready; await flush();
  assert.match(real.api.getState().code || '', /^[A-Z2-9]{12}$/, '真機照樣自動開');
});
