'use strict';
// #2164／#2189（2026-10-15 律師）：「請解決 iPad 將複習 App 加入主畫面後，進度會跟瀏覽器複習進度不一致的問題。」
// 「應該要以最新的複習進度為準，通常會是練習題目比較最多的那一次記錄」
// ⇒ 兩份不一樣時不再二選一：留練過題數多的那份（log 陣列總長），輸的那份一定留 backup；沒碼的環境自動開同步＋頁首提醒。
const test = require('node:test');
const assert = require('node:assert/strict');
const {Clock, server, device, flush, descendants, hash} = require('./harness');
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

test('R15 自動碼的這台：上一頁送出後回應沒收到就關頁（雲端版本比這台記得的新、其實是自己寫的），重開後提醒仍在、進度留這台較多那份', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend, {initial: {[KEY]: v3(1, 'x')}, autoEnable: true, autoResolve: true});
  await d.api.ready; await flush();
  const code = d.api.getState().code; assert.equal(d.storage.getItem('g5sync.auto'), code);
  d.api.destroy();
  // 這台送出的 5 題那份伺服器收下了（rev 2），但頁面已關、回應沒收到 ⇒ 這台的 baseline 還停在 rev 1
  assert.equal(backend.handle({op: 'put', code, key: KEY, rev: 1, data: v3(5, 'y')}).ok, true);
  assert.equal(backend.store.record(code).rev, 2);
  d.storage.setItem(KEY, v3(8, 'z'));
  const again = device(backend, {storage: d.storage, autoEnable: true, autoResolve: true}); t.after(() => again.api.destroy());
  await again.api.ready; await flush(); await clock.advance(10);
  assert.equal(again.storage.getItem('g5sync.auto'), code, '不是家人連上，提醒要留著');
  assert.equal(backend.store.record(code).data, v3(8, 'z'), '這台 8 題那份留在雲端');
});

// ---- 交辦 #3151：Codex 審 435b911 FAIL 三項（讀不懂不猜／衝突重送不收斂／頁首提醒說已存雲端）----
const helpDoc = require('../src/helpdoc.js');
const HELP = 'g5help.v1';
const helpSave = n => JSON.stringify({v: 1, entries: {p1: {solved: n, log: Array.from({length: n}, (_, i) => [i, 1])}}, hidden: {}});
const puts = d => d.calls.filter(c => c.req.op === 'put').length;
// 舊版無上限重送只靠 microtask 串，會把事件迴圈吃光（測試卡死）：假後端送到第 40 次就斷線，讓舊版以斷言失敗收場（同 Codex 探針主動拋錯）
const capped = fn => (req, config, d) => d.calls.length > 40 ? Promise.reject(new Error('probe-stop')) : fn(req);

async function helpFamily(t, aData, bData, opts = {}) {
  const clock = new Clock(), backend = server(clock);
  const base = {keys: [HELP], autoResolve: true, summarize: {[HELP]: () => 'x'}, ...(opts.score ? {score: {[HELP]: helpDoc.syncScore}} : {})};
  const a = device(backend, {initial: {[HELP]: aData}, ...base}); t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  let b; b = device(backend, {initial: {[HELP]: bData}, ...base, ...(opts.owned ? owned(() => b) : {})});
  t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code); await flush();
  return {clock, backend, a, b, code};
}

test('R16 讀不懂不猜（Codex 原反例）：這台是 {"log":[1,2,3]}、雲端是合法兩筆 ⇒ 不自動選、雲端不被蓋、不顯示已同步', async t => {
  for (const ownedPage of [false, true]) {
    const {backend, b, code} = await helpFamily(t, helpSave(2), '{"log":[1,2,3]}', {owned: ownedPage});
    assert.equal(backend.store.record(code, HELP).data, helpSave(2), '雲端那份不動');
    assert.equal(backend.store.record(code, HELP).rev, 1, '沒有多寫一版');
    assert.equal(b.storage.getItem(HELP), '{"log":[1,2,3]}', '這台那份也不動');
    assert.ok(b.api.getState().conflicts[HELP], '兩份各自保留');
    assert.doesNotMatch(b.api.getState().status, /已同步/);
  }
});

test('R17 讀不懂不猜（難題站自己的讀檔）：有版本號但本站讀不懂（entries 是陣列）⇒ 用 helpdoc.syncScore 不自動選；讀得懂的照判準', async t => {
  const odd = JSON.stringify({v: 1, entries: [], log: [1, 2, 3, 4, 5]});
  assert.equal(helpDoc.parse(odd), null, '前提：本站讀檔拒絕');
  assert.ok(Number.isNaN(helpDoc.syncScore(odd)));
  assert.equal(helpDoc.syncScore(helpSave(4)), 4);
  const r1 = await helpFamily(t, helpSave(2), odd, {owned: true, score: true});
  assert.equal(r1.backend.store.record(r1.code, HELP).data, helpSave(2));
  assert.equal(r1.b.storage.getItem(HELP), odd);
  assert.ok(r1.b.api.getState().conflicts[HELP]);
  const r2 = await helpFamily(t, helpSave(2), helpSave(6), {owned: true, score: true});
  await r2.clock.advance(4000);
  assert.equal(r2.backend.store.record(r2.code, HELP).data, helpSave(6), '讀得懂、這台多 ⇒ 照樣上傳');
});

test('R18 衝突重送收斂（Codex 原反例）：後端一直回同一 rev 1、題數較少的 conflict ⇒ 不在同一刻連送，改退避', async t => {
  for (const ownedPage of [false, true]) {
    const clock = new Clock(), backend = server(clock);
    const cloud = {ok: false, err: 'conflict', rev: 1, data: v3(2, 'c'), updated: clock.now()};
    let d; d = device(backend, {initial: {[KEY]: v3(9, 'l')}, ...AUTO, ...(ownedPage ? owned(() => d) : {}),
      fetch: capped(req => req.op === 'get' ? {ok: true, json: async () => ({ok: true, rev: 1, data: v3(2, 'c'), updated: clock.now()})}
        : {ok: true, json: async () => cloud})});
    t.after(() => d.api.destroy());
    await d.api.ready; await d.api.join('ABCDEFGHJKMN'); await flush();
    assert.ok(puts(d) <= 1, `同一刻只送 ${puts(d)} 次`);
    assert.match(d.api.getState().status, /稍後自動再試/);
    assert.ok(d.api.getState().retryAt > clock.now(), '有退避');
    await clock.advance(60000);
    assert.ok(puts(d) <= 6, `60 秒內只送 ${puts(d)} 次（退避 4→8→16→32 秒）`);
  }
});

test('R19 衝突重送收斂：後端每次都回「又前進一號」的衝突（另一台不停寫）⇒ 一輪最多重送 3 次就退避', async t => {
  for (const ownedPage of [false, true]) {
    const clock = new Clock(), backend = server(clock);
    let d; d = device(backend, {initial: {[KEY]: v3(9, 'l')}, ...AUTO, ...(ownedPage ? owned(() => d) : {}),
      fetch: capped(req => req.op === 'get' ? {ok: true, json: async () => ({ok: true, rev: 1, data: v3(2, 'c1'), updated: clock.now()})}
        : {ok: true, json: async () => ({ok: false, err: 'conflict', rev: req.rev + 1, data: v3(2, 'c' + (req.rev + 1)), updated: clock.now()})})});
    t.after(() => d.api.destroy());
    await d.api.ready; await d.api.join('ABCDEFGHJKMN'); await flush();
    assert.ok(puts(d) <= 4, `一輪送了 ${puts(d)} 次`);
    assert.match(d.api.getState().status, /稍後自動再試/);
    assert.ok(d.api.getState().retryAt > clock.now());
  }
});

test('R22 重送次數每輪歸零：上一輪撞滿退避後，下一輪遇到一次正常的搶寫（另一台剛好先寫）仍照判準收斂、上傳成功', async t => {
  const clock = new Clock(), backend = server(clock);
  let rev = 1, data = v3(2, 'c1'), phase = 'storm', raced = false;
  const reply = body => ({ok: true, json: async () => body});
  const d = device(backend, {initial: {[KEY]: v3(9, 'l')}, ...AUTO, fetch: capped(req => {
    if (req.op === 'get') return reply({ok: true, rev, data, updated: clock.now()});
    if (phase === 'storm' || (phase === 'once' && !raced)) {   // 另一台先寫一版
      raced = phase === 'once'; rev += 1; data = v3(2, 'c' + rev);
      return reply({ok: false, err: 'conflict', rev, data, updated: clock.now()});
    }
    if (req.rev !== rev) return reply({ok: false, err: 'conflict', rev, data, updated: clock.now()});
    rev += 1; data = req.data; return reply({ok: true, rev, updated: clock.now()});
  })});
  t.after(() => d.api.destroy());
  await d.api.ready; await d.api.join('ABCDEFGHJKMN'); await flush();
  assert.match(d.api.getState().status, /稍後自動再試/, '前提：第一輪撞滿退避');
  // 第一次退避（4 秒）後的那一輪就要收斂；沒歸零的話這一輪一撞就丟錯、要再退避 8 秒才上得去
  phase = 'once'; await clock.advance(4000);
  assert.equal(data, v3(9, 'l'), '這台 9 題那份上了雲端');
  assert.match(d.api.getState().status, /已同步/);
});

test('R23 雲端倒退（例如被換回舊版）：這台跟上次存好的一樣、但雲端已經不是這份 ⇒ 提醒不說已存雲端', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend, {initial: {[KEY]: v3(3, 'home')}, autoEnable: true, autoResolve: true});
  await d.api.ready; await flush();
  const code = d.api.getState().code;
  d.storage.setItem(KEY, v3(5, 'home')); await clock.advance(4000);
  assert.equal(backend.store.record(code).rev, 2);
  d.api.destroy();
  backend.store.withLock(() => backend.store.set(hash(code), KEY, {rev: 1, data: v3(1, 'old'), updated: clock.now()}));
  const again = device(backend, {storage: d.storage, autoEnable: true, autoResolve: true}); t.after(() => again.api.destroy());
  await again.api.ready; await flush();
  assert.ok(again.api.getState().conflicts[KEY], '前提：看到雲端倒退');
  const text = again.doc.body.children.find(n => n.className === 'g5s-banner').textContent;
  assert.doesNotMatch(text, /已經先存到雲端/); assert.match(text, /還沒存到雲端/);
});

test('R24 存好之後離線重開（還沒重新下載）：這台就是上次雲端確認收下的那份 ⇒ 提醒照說已存雲端，不嚇家長', async t => {
  const clock = new Clock(), backend = server(clock), nav = {onLine: true};
  const d = device(backend, {initial: {[KEY]: v3(3, 'home')}, autoEnable: true, autoResolve: true, navigator: nav});
  await d.api.ready; await flush();
  d.api.destroy(); nav.onLine = false;
  const again = device(backend, {storage: d.storage, autoEnable: true, autoResolve: true, navigator: nav}); t.after(() => again.api.destroy());
  await again.api.ready; await flush();
  assert.match(again.api.getState().status, /離線/);
  assert.match(again.doc.body.children.find(n => n.className === 'g5s-banner').textContent, /已經先存到雲端/);
});

test('R20 頁首提醒只在真的存上雲端時才說「已經先存到雲端」：離線第一次打開不說；連上網路存好後才說', async t => {
  const clock = new Clock(), backend = server(clock), nav = {onLine: false};
  const d = device(backend, {initial: {[KEY]: v3(3, 'home')}, autoEnable: true, autoResolve: true, navigator: nav});
  t.after(() => d.api.destroy());
  await d.api.ready; await flush();
  const code = d.api.getState().code;
  assert.equal(d.calls.length, 0, '離線：一次都沒送');
  assert.equal(backend.store.record(code), null, '雲端沒有');
  const bannerText = () => d.doc.body.children.find(n => n.className === 'g5s-banner').textContent;
  const hint = () => descendants(d.doc.container).find(n => n.className === 'g5s-auto-hint').textContent;
  assert.match(bannerText(), /還沒跟家裡其他裝置連起來/);
  assert.doesNotMatch(bannerText(), /已經先存到雲端/);
  assert.match(bannerText(), /還沒存到雲端/);
  assert.doesNotMatch(hint(), /已自動備份到雲端/);
  nav.onLine = true; d.window.dispatch('online'); await flush(); await clock.advance(10);
  assert.equal(backend.store.record(code).data, v3(3, 'home'));
  assert.match(bannerText(), /已經先存到雲端/);
  assert.match(hint(), /已自動備份到雲端/);
});

test('R21 存上雲端後這台又練了、但後端故障送不上 ⇒ 提醒改回「最新的還沒存到雲端」', async t => {
  const clock = new Clock(), backend = server(clock);
  const d = device(backend, {initial: {[KEY]: v3(3, 'home')}, autoEnable: true, autoResolve: true});
  t.after(() => d.api.destroy());
  await d.api.ready; await flush();
  const bannerText = () => d.doc.body.children.find(n => n.className === 'g5s-banner').textContent;
  assert.match(bannerText(), /已經先存到雲端/);
  d.mode = 'server'; d.storage.setItem(KEY, v3(5, 'home')); await clock.advance(4000);
  assert.match(d.api.getState().status, /稍後自動再試/);
  assert.doesNotMatch(bannerText(), /已經先存到雲端/);
  assert.match(bannerText(), /還沒存到雲端/);
});

// #5099：五站各自的嚴格讀檔接進比較（options.accepts）。本站讀不懂的那份（有 v 但格式不對）不參加比較、不自動選；
// 讀得懂的照律師判準（題數→seen→留這台），seen 次比不因此丟掉（score 只能回一個數字，會丟 seen）。
async function acceptFamily(t, aData, bData, accepts) {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: aData}, ...AUTO});
  t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  const b = device(backend, {initial: {[KEY]: bData}, ...AUTO, accepts: {[KEY]: accepts}});
  t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code); await flush();
  return {clock, backend, a, b, code};
}
const strictV3 = raw => { try { const o = JSON.parse(raw); return o.v === 3 && Array.isArray(o.log) && o.cards && typeof o.cards === 'object' && !Array.isArray(o.cards); } catch (e) { return false; } };

test('R25 本站讀不懂（有 v 但 cards 是陣列）的那份練得多也不勝出：兩份各自保留、雲端不被蓋', async t => {
  const odd = JSON.stringify({v: 3, cards: [], log: Array.from({length: 40}, (_, i) => ({op: 'x' + i}))});
  const {backend, b, code} = await acceptFamily(t, v3(2, 'ok'), odd, strictV3);
  assert.equal(backend.store.record(code).data, v3(2, 'ok'), '雲端那份不動');
  assert.equal(backend.store.record(code).rev, 1);
  assert.equal(b.storage.getItem(KEY), odd, '這台那份也不動');
  assert.ok(b.api.getState().conflicts[KEY], '兩份各自保留');
  const r2 = await acceptFamily(t, odd, v3(3, 'mine'), strictV3);
  assert.equal(r2.backend.store.record(r2.code).data, odd, '雲端讀不懂：不拿這台蓋掉它');
  assert.equal(r2.b.storage.getItem(KEY), v3(3, 'mine'));
  assert.ok(r2.b.api.getState().conflicts[KEY]);
});

test('R26 兩份本站都讀得懂：照判準，題數一樣時仍比 seen（accepts 不丟次比）', async t => {
  const withSeen = (n, seen) => JSON.stringify({v: 3, log: Array.from({length: n}, (_, i) => ({op: 's' + i})), cards: {c1: {seen}}});
  const r1 = await acceptFamily(t, v3(22, 'cloud'), v3(3, 'home'), strictV3);
  assert.equal(r1.b.storage.getItem(KEY), v3(22, 'cloud'));
  const r2 = await acceptFamily(t, withSeen(5, 2), withSeen(5, 9), strictV3);
  await r2.clock.advance(4000);
  assert.equal(r2.backend.store.record(r2.code).data, withSeen(5, 9), '題數一樣、這台 seen 多 ⇒ 留這台');
});

test('R27 accepts 本身出錯或回 true 以外的值＝讀不懂，不猜', async t => {
  for (const bad of [() => { throw new Error('boom'); }, () => 1, () => 'yes', () => undefined]) {
    const {backend, b, code} = await acceptFamily(t, v3(2, 'c'), v3(9, 'l'), bad);
    assert.equal(backend.store.record(code).data, v3(2, 'c'));
    assert.equal(b.storage.getItem(KEY), v3(9, 'l'));
    assert.ok(b.api.getState().conflicts[KEY]);
  }
});
