// 設計 D・A 線（2026-10-13，Codex 設計者，#1347 升級階梯）：持久化「單筆待確認上傳」checkpoint 的快速故障注入驗收 A01–A18。
// 對象：提供 accept 的頁面（難題站 g5help.v1）。每案都讀回：雲端、localStorage 進度、checkpoint（g5sync.ckpt.<key>）、UI 狀態列。
// 「恢復」一律在網路恢復後、模擬 60 秒內完成，並再答一題確認同步仍會前進。真瀏覽器版 A01–A08 在 tests/e2e_sync_recovery.py。
// 執行：node --test tests/sync_recovery.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const G5Sync = require('../src/sync');
const {Storage, Clock, server, device, flush, byClass, descendants, hash} = require('./harness');

const KEY = 'g5help.v1', CK = 'g5sync.ckpt.' + KEY, META = 'g5sync.meta', CODE = 'ABCDEFGHJKMN', CODE2 = '23456789ABCD';
const H = G5Sync.contentHash;
// D(n)＝完整進度文件（不是只有題數）：做完 n 題、n 筆紀錄
const D = n => JSON.stringify({v: 1, entries: {'p38-6-2': {lessonDone: true, idx: n, seed: 5, streak: n % 3, clean: n, solved: n, mastered: false,
  log: Array.from({length: n}, (_, i) => ({t: 1760000000000 + i, a: '24/36', b: '35/50', clean: true, hints: 0, wrongs: 0})), cur: null, r: n}}});

// 可注入故障的網路：down＝請求沒到後端；drop＝後端存好了但回應遺失；hold＝下一個 PUT 卡住（before：還沒到後端；after：到了、回應卡住）
function net(backend) {
  const n = {down: false, drop: 0, hold: null, puts: [], commits: [], gets: 0, release: null, beforeSend: null};
  n.fetch = req => {
    if (req.op === 'put') n.puts.push({rev: req.rev, data: req.data}); else n.gets += 1;
    if (n.beforeSend) { const f = n.beforeSend; n.beforeSend = null; if (f(req) === 'reject') return Promise.reject(new TypeError('closed before send')); }
    if (n.down) return Promise.reject(new TypeError('offline'));
    const handle = () => { const r = backend.handle(req); if (req.op === 'put' && r.ok) n.commits.push({rev: r.rev, data: req.data}); return r; };
    if (req.op === 'put' && n.hold) {
      const mode = n.hold; n.hold = null;
      return new Promise(resolve => {
        if (mode === 'after') { const r = handle(); n.release = () => resolve({ok: true, json: async () => r}); }
        else n.release = () => { const r = handle(); resolve({ok: true, json: async () => r}); };
      });
    }
    const r = handle();
    if (req.op === 'put' && n.drop > 0) { n.drop -= 1; return Promise.reject(new TypeError('lost response after commit')); }
    return Promise.resolve({ok: true, json: async () => r});
  };
  return n;
}
// 難題站那樣的頁面：有 canReplace／accept（allow=false 模擬「在某一篇裡或有未存進度」）
function owner(backend, N, o = {}) {
  const box = {allow: true, accepted: 0};
  const d = device(backend, Object.assign({keys: [KEY], fetch: N.fetch,
    summarize: {[KEY]: v => '做完 ' + JSON.parse(v).entries['p38-6-2'].solved + ' 題'},
    canReplace: () => box.allow,
    accept: (k, v) => { if (!box.allow) return false; box.d.storage.setItem(k, v); box.accepted += 1; return true; }}, o));
  box.d = d; d.box = box;
  return d;
}
const ck = d => { const raw = d.storage.data.get(CK); return raw === undefined ? null : JSON.parse(raw); };
const conflictCount = d => Object.keys(d.api.getState().conflicts).length;
const pickButtons = d => descendants(d.doc.container).filter(n => n.tagName === 'BUTTON' && /留這台|留雲端/.test(n.textContent));
const statusText = d => byClass(d, 'status')[0].textContent;

async function fresh(t, local, o = {}) {
  const clock = new Clock(), backend = server(clock), N = net(backend);
  const d = owner(backend, N, Object.assign({initial: {[KEY]: local}}, o));
  const ctx = {clock, backend, N, d};
  t.after(() => ctx.d.api.destroy());
  await d.api.ready;
  return ctx;
}
async function synced8(t) {
  const ctx = await fresh(t, D(8));
  await ctx.d.api.enable(); ctx.code = ctx.d.api.getState().code;
  assert.equal(ctx.backend.store.record(ctx.code, KEY).rev, 1, '前置：D8 已上傳成 rev 1');
  return ctx;
}
async function reopen(t, ctx) {
  ctx.d.api.destroy();
  const d = owner(ctx.backend, ctx.N, {storage: ctx.d.storage});
  ctx.d = d; t.after(() => d.api.destroy());
  await d.api.ready;
  return d;
}
const cloud = ctx => ctx.backend.store.record(ctx.code || ctx.d.api.getState().code, KEY);

// 已收斂：雲端、本機、checkpoint、UI 四邊一致於 D(n)/rev
function assertSettled(ctx, n, rev, why) {
  const c = cloud(ctx), k = ck(ctx.d);
  assert.equal(c.rev, rev, why + '：雲端 rev'); assert.equal(c.data, D(n), why + '：雲端是 D' + n);
  assert.equal(ctx.d.storage.getItem(KEY), D(n), why + '：本機是 D' + n);
  assert.equal(conflictCount(ctx.d), 0, why + '：沒有衝突'); assert.equal(pickButtons(ctx.d).length, 0, why + '：沒有選邊按鈕');
  assert.match(statusText(ctx.d), /^已同步 /, why + '：畫面說已同步（實際：' + statusText(ctx.d) + '）');
  assert.ok(k, why + '：checkpoint 存在');
  assert.deepEqual([k.baseline && k.baseline.rev, k.baseline && k.baseline.hash, k.pending], [rev, H(D(n)), null], why + '：checkpoint baseline＝已確認的 D' + n + '、沒有待確認');
}
// 同步仍會前進：再答一題，60 秒內雲端變成下一份
async function assertKeepsSyncing(ctx, n, rev) {
  ctx.d.storage.setItem(KEY, D(n)); await ctx.clock.advance(60000);
  assertSettled(ctx, n, rev, '再答一題後');
}

// ---------------- A01–A08：回應遺失 × 首次啟用／已有 baseline × 同頁／重開 × 多答與否 ----------------
test('A01 baseline＝D8；D9 提交後回應遺失，同頁重試 ⇒ D9 確認、無衝突，之後 D10 照常上傳', async t => {
  const ctx = await synced8(t);
  ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  assert.equal(cloud(ctx).rev, 2, '後端已存 D9');
  await ctx.clock.advance(60000);
  assertSettled(ctx, 9, 2, 'A01');
  await assertKeepsSyncing(ctx, 10, 3);
});

test('A02 同 A01，但重試前先答成 D10 ⇒ 先確認 D9（不把 D10 誤記為已確認）再送 D10', async t => {
  const ctx = await synced8(t);
  ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  ctx.d.storage.setItem(KEY, D(10));
  const before = ctx.N.puts.length;
  await ctx.clock.advance(60000);
  const after = ctx.N.puts.slice(before);
  assert.deepEqual(after.map(p => [p.rev, p.data === D(9) ? 'D9' : p.data === D(10) ? 'D10' : '?']), [[1, 'D9'], [2, 'D10']], '重試送原本那份 D9，確認後才送 D10');
  assertSettled(ctx, 10, 3, 'A02');
  await assertKeepsSyncing(ctx, 11, 4);
});

test('A03 雲端空白、首次啟用：D8 提交後回應遺失，同頁重試 ⇒ 沒有成功 baseline 也能確認 D8', async t => {
  const ctx = await fresh(t, D(8));
  ctx.N.drop = 1; await ctx.d.api.enable(); ctx.code = ctx.d.api.getState().code;
  assert.equal(cloud(ctx).rev, 1, '後端已存 D8');
  await ctx.clock.advance(60000);
  assertSettled(ctx, 8, 1, 'A03');
  await assertKeepsSyncing(ctx, 9, 2);
});

test('A04 同 A03，重試前答成 D9 ⇒ 雲端最終 D9、無衝突', async t => {
  const ctx = await fresh(t, D(8));
  ctx.N.drop = 1; await ctx.d.api.enable(); ctx.code = ctx.d.api.getState().code;
  ctx.d.storage.setItem(KEY, D(9));
  await ctx.clock.advance(60000);
  assertSettled(ctx, 9, 2, 'A04');
  await assertKeepsSyncing(ctx, 10, 3);
});

test('A05 首次啟用 D8 提交後回應遺失 ⇒ 關頁重開、不多答：從持久化的 pending 恢復（不靠舊分頁記憶體）', async t => {
  const ctx = await fresh(t, D(8));
  ctx.N.drop = 1; await ctx.d.api.enable(); ctx.code = ctx.d.api.getState().code;
  await reopen(t, ctx); await ctx.clock.advance(60000);
  assertSettled(ctx, 8, 1, 'A05');
  await assertKeepsSyncing(ctx, 9, 2);
});

for (const when of ['重開前', '重開後恢復前']) {
  test('A06 同 A05，' + when + '答成 D9 ⇒ 先確認 D8 再上傳 D9', async t => {
    const ctx = await fresh(t, D(8));
    ctx.N.drop = 1; await ctx.d.api.enable(); ctx.code = ctx.d.api.getState().code;
    if (when === '重開前') { ctx.d.storage.setItem(KEY, D(9)); await reopen(t, ctx); }
    else { ctx.N.down = true; await reopen(t, ctx); ctx.d.storage.setItem(KEY, D(9)); ctx.N.down = false; }
    await ctx.clock.advance(60000);
    assertSettled(ctx, 9, 2, 'A06 ' + when);
    assert.deepEqual(ctx.N.commits.map(c => c.rev), [1, 2], '只有 D8、D9 兩次提交');
    await assertKeepsSyncing(ctx, 10, 3);
  });
}

test('A07 baseline＝D8，D9 提交後回應遺失 ⇒ 關頁重開、不多答：確認 D9、無衝突', async t => {
  const ctx = await synced8(t);
  ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  await reopen(t, ctx); await ctx.clock.advance(60000);
  assertSettled(ctx, 9, 2, 'A07');
  await assertKeepsSyncing(ctx, 10, 3);
});

for (const when of ['重開前', '重開後恢復前']) {
  test('A08 同 A07，' + when + '答成 D10 ⇒ 雲端最終 D10，後續同步持續', async t => {
    const ctx = await synced8(t);
    ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
    if (when === '重開前') { ctx.d.storage.setItem(KEY, D(10)); await reopen(t, ctx); }
    else { ctx.N.down = true; await reopen(t, ctx); ctx.d.storage.setItem(KEY, D(10)); ctx.N.down = false; }
    await ctx.clock.advance(60000);
    assertSettled(ctx, 10, 3, 'A08 ' + when);
    await assertKeepsSyncing(ctx, 11, 4);
  });
}

// ---------------- A05L–A08L：從同步連結（#sync=同一家庭碼）重開（Codex 第 8 輪 FAIL：join() 無條件清 checkpoint）----------------
// 孩子常用的入口是家長傳來的連結／QR，不是一般網址；同一家庭碼重新加入必須保留待確認上傳、走恢復判斷。
async function reopenViaLink(t, ctx, code) {
  ctx.d.api.destroy();
  const d = owner(ctx.backend, ctx.N, {storage: ctx.d.storage, href: 'https://windsorya.github.io/g5-help/#sync=' + code});
  ctx.d = d; t.after(() => d.api.destroy());
  await d.api.ready;
  return d;
}
test('A05L 首次啟用 D8 提交後回應遺失 ⇒ 從同步連結重開、不多答：保留 pending、確認 D8、無衝突', async t => {
  const ctx = await fresh(t, D(8));
  ctx.N.drop = 1; await ctx.d.api.enable(); ctx.code = ctx.d.api.getState().code;
  await reopenViaLink(t, ctx, ctx.code); await ctx.clock.advance(60000);
  assertSettled(ctx, 8, 1, 'A05L');
  await assertKeepsSyncing(ctx, 9, 2);
});
for (const when of ['重開前', '重開後恢復前']) {
  test('A06L 同 A05L，' + when + '答成 D9 ⇒ 先確認 D8 再上傳 D9，之後仍有請求', async t => {
    const ctx = await fresh(t, D(8));
    ctx.N.drop = 1; await ctx.d.api.enable(); ctx.code = ctx.d.api.getState().code;
    if (when === '重開前') { ctx.d.storage.setItem(KEY, D(9)); await reopenViaLink(t, ctx, ctx.code); }
    else { ctx.N.down = true; await reopenViaLink(t, ctx, ctx.code); ctx.d.storage.setItem(KEY, D(9)); ctx.N.down = false; }
    await ctx.clock.advance(60000);
    assertSettled(ctx, 9, 2, 'A06L ' + when);
    assert.deepEqual(ctx.N.commits.map(c => c.rev), [1, 2], '只有 D8、D9 兩次提交');
    await assertKeepsSyncing(ctx, 10, 3);
  });
}
test('A07L baseline＝D8，D9 提交後回應遺失 ⇒ 從同步連結重開、不多答：確認 D9、無衝突', async t => {
  const ctx = await synced8(t);
  ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  await reopenViaLink(t, ctx, ctx.code); await ctx.clock.advance(60000);
  assertSettled(ctx, 9, 2, 'A07L');
  await assertKeepsSyncing(ctx, 10, 3);
});
for (const when of ['重開前', '重開後恢復前']) {
  test('A08L 同 A07L，' + when + '答成 D10 ⇒ 雲端最終 D10，後續同步持續', async t => {
    const ctx = await synced8(t);
    ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
    if (when === '重開前') { ctx.d.storage.setItem(KEY, D(10)); await reopenViaLink(t, ctx, ctx.code); }
    else { ctx.N.down = true; await reopenViaLink(t, ctx, ctx.code); ctx.d.storage.setItem(KEY, D(10)); ctx.N.down = false; }
    await ctx.clock.advance(60000);
    assertSettled(ctx, 10, 3, 'A08L ' + when);
    await assertKeepsSyncing(ctx, 11, 4);
  });
}
test('A16L 從「不同家庭碼」的同步連結加入 ⇒ 舊家庭的 checkpoint 清掉，pending 不送進新家庭', async t => {
  const ctx = await synced8(t);
  ctx.backend.handle({op: 'put', code: CODE2, key: KEY, rev: 0, data: D(50)});
  ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  assert.ok(ck(ctx.d) && ck(ctx.d).pending, '前置：舊家庭有待確認的 D9');
  const puts = ctx.N.puts.length;
  await reopenViaLink(t, ctx, CODE2); await ctx.clock.advance(8000);
  const k = ck(ctx.d);
  assert.ok(!k || (k.codeHash === H(CODE2) && !(k.pending && k.pending.data === D(9))), '舊家庭的 pending 作廢：' + JSON.stringify(k));
  assert.ok(!ctx.N.puts.slice(puts).some(p => p.data === D(9)), '不把舊家庭的 D9 送進新家庭');
  assert.equal(ctx.backend.store.record(CODE2, KEY).data, D(50), '新家庭雲端不被蓋掉');
  assert.equal(ctx.d.storage.getItem(KEY), D(9), '本機進度保留');
});

// ---------------- A09–A18 ----------------
for (const how of ['送出前關頁', '請求沒到後端就斷線']) {
  test('A09 pending 已保存、' + how + ' ⇒ 重開後送原 payload（D9），不改成最新 D10 猜測、也不遺漏', async t => {
    const ctx = await synced8(t);
    if (how === '送出前關頁') ctx.N.beforeSend = () => { ctx.d.api.destroy(); return 'reject'; };
    else ctx.N.down = true;
    ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
    assert.equal(cloud(ctx).rev, 1, '後端沒收到');
    assert.equal(ck(ctx.d) && ck(ctx.d).pending && ck(ctx.d).pending.data, D(9), '送出前 pending 已存進 checkpoint');
    ctx.d.storage.setItem(KEY, D(10)); ctx.N.down = false;
    const before = ctx.N.puts.length;
    await reopen(t, ctx); await ctx.clock.advance(60000);
    assert.deepEqual(ctx.N.puts.slice(before).map(p => [p.rev, p.data === D(9) ? 'D9' : p.data === D(10) ? 'D10' : '?']), [[1, 'D9'], [2, 'D10']]);
    assertSettled(ctx, 10, 3, 'A09 ' + how);
  });
}

for (const fault of ['checkpoint 寫入失敗', '寫成功但讀回失敗']) {
  test('A10 後端已提交、' + fault + ' ⇒ 不提前宣稱完成；重開後能確認，沒有多寫版本', async t => {
    const ctx = await synced8(t);
    const st = ctx.d.storage; let armed = true, readFail = false;
    if (fault === 'checkpoint 寫入失敗') {
      st.fail = (k, v) => armed && ((k === CK && JSON.parse(v).pending === null) || k === META);
    } else {
      const set = st.setItem.bind(st), get = st.getItem.bind(st);
      st.setItem = (k, v) => { set(k, v); if (armed && (k === CK && JSON.parse(v).pending === null || k === META)) readFail = true; };
      st.getItem = k => { if (readFail && (k === CK || k === META)) { readFail = false; armed = false; throw new Error('io'); } return get(k); };
    }
    st.setItem(KEY, D(9)); await ctx.clock.advance(4000);
    assert.equal(cloud(ctx).rev, 2, '後端已存 D9');
    assert.doesNotMatch(statusText(ctx.d), /^已同步/, '不能提前說已同步：' + statusText(ctx.d));
    armed = false; st.fail = null;
    const commits = ctx.N.commits.length;
    await reopen(t, ctx); await ctx.clock.advance(60000);
    assertSettled(ctx, 9, 2, 'A10 ' + fault);
    assert.equal(ctx.N.commits.length, commits, '恢復時沒有額外版本寫入');
    await assertKeepsSyncing(ctx, 10, 3);
  });
}

for (const order of ['舊請求晚到後端', '舊請求先到、回應晚到']) {
  test('A11 ' + order + '：超時重試後舊請求才完成 ⇒ 同一基準最多提交一次、遲到回應不讓 baseline 倒退', async t => {
    const ctx = await synced8(t);
    ctx.N.hold = order === '舊請求晚到後端' ? 'before' : 'after';
    ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
    await ctx.clock.advance(15000);   // 15 秒超時
    await ctx.clock.advance(30000);   // 重試
    ctx.N.release(); await flush(); await flush();
    await ctx.clock.advance(30000);
    assert.equal(ctx.N.commits.filter(c => c.rev === 2).length, 1, 'baseRev 1 的提交只成功一次');
    assertSettled(ctx, 9, 2, 'A11 ' + order);
    await assertKeepsSyncing(ctx, 10, 3);
  });
}

test('A11c 同一份儲存有兩個實例（例如舊版分頁）：遲到的舊回應只認 checkpoint 裡現在那一筆 pending，不把新的 pending 洗掉', async t => {
  const ctx = await synced8(t);
  ctx.N.hold = 'after'; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);   // 實例 A 送 D9，回應卡住
  const other = owner(ctx.backend, ctx.N, {storage: ctx.d.storage}); t.after(() => other.api.destroy());
  ctx.d.storage.setItem(KEY, D(10)); await other.api.ready; await flush();   // 實例 B：GET 確認 D9、接著送 D10
  assert.equal(cloud(ctx).rev, 3, '前置：B 已確認 D9 並送出 D10');
  const before = ctx.d.storage.getItem(CK);
  ctx.N.release(); await flush(); await flush();   // A 的舊回應（rev 2）才到
  const k = ck(ctx.d);
  assert.ok(k.baseline.rev === 3 || (k.pending && k.pending.data === D(10)), '舊回應不能把 baseline 拉回 rev 2、也不能清掉 D10 的 pending：' + before + ' → ' + JSON.stringify(k));
  assert.equal(ctx.d.api.getState().failures, 0, '已經被確認過的舊回應安靜忽略，不當成同步失敗');
  assert.doesNotMatch(statusText(ctx.d), /同步失敗/);
});

test('A12 D9 待確認時另一裝置提交不同的 D20 ⇒ 保留兩份；不把 D20 當自己的確認；無選邊按鈕', async t => {
  const ctx = await synced8(t);
  ctx.N.down = true; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  ctx.backend.handle({op: 'put', code: ctx.code, key: KEY, rev: 1, data: D(20)});
  ctx.N.down = false; await ctx.clock.advance(60000);
  assert.equal(cloud(ctx).data, D(20)); assert.equal(cloud(ctx).rev, 2, '雲端那份不動');
  assert.equal(ctx.d.storage.getItem(KEY), D(9), '這台照常用這台的');
  assert.equal(conflictCount(ctx.d), 1); assert.equal(pickButtons(ctx.d).length, 0, '沒有選邊按鈕');
  assert.equal(await ctx.d.api.resolve(KEY, 'cloud'), false);
  assert.ok(ck(ctx.d).baseline.rev === 1 && ck(ctx.d).pending && ck(ctx.d).pending.data === D(9), 'D9 仍是待確認，baseline 沒有改成 D20');
  assert.match(statusText(ctx.d), /各自保留/);
  const puts = ctx.N.puts.length; await ctx.clock.advance(60000);
  assert.equal(ctx.N.puts.length, puts, '真正分歧後不再自動上傳');
});

test('A13 pending 長時間待確認、本機連續增加超過 20 次進度 ⇒ pending 不因歷史容量丟失；確認後上傳最新完整資料', async t => {
  const ctx = await synced8(t);
  ctx.N.drop = 1; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  ctx.N.down = true;
  for (let n = 10; n <= 34; n++) { ctx.d.storage.setItem(KEY, D(n)); ctx.d.window.dispatch('online'); await flush(); await flush(); }
  ctx.N.down = false; await ctx.clock.advance(60000);
  assertSettled(ctx, 34, 3, 'A13');
});

test('A14a pending payload 與雲端相同但版本不是 baseRev+1 ⇒ 不憑「送過相同內容」認領成功；保留資料並顯示無法確認', async t => {
  const ctx = await synced8(t);
  ctx.N.down = true; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  ctx.backend.handle({op: 'put', code: ctx.code, key: KEY, rev: 1, data: D(20)});
  ctx.backend.handle({op: 'put', code: ctx.code, key: KEY, rev: 2, data: D(9)});
  ctx.N.down = false; await ctx.clock.advance(60000);
  assert.equal(cloud(ctx).rev, 3, '雲端不被多寫');
  assert.equal(ctx.d.storage.getItem(KEY), D(9));
  assert.equal(conflictCount(ctx.d), 1, '不能當成自己的確認');
  assert.ok(ck(ctx.d).baseline.rev === 1 && ck(ctx.d).pending, 'baseline 不改成 rev 3、pending 保留');
  assert.match(statusText(ctx.d), /無法確認/);
});

test('A14b 雲端版本倒退（比已確認的 baseline 舊）⇒ 不上傳、不覆蓋，保留兩份並顯示異常', async t => {
  const ctx = await synced8(t);
  ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  assert.equal(cloud(ctx).rev, 2);
  ctx.backend.store.withLock(() => ctx.backend.store.set(hash(ctx.code), KEY, {rev: 1, data: D(8), updated: ctx.clock.now()}));
  const puts = ctx.N.puts.length;
  await reopen(t, ctx); await ctx.clock.advance(60000);
  assert.equal(ctx.N.puts.length, puts, '沒有上傳');
  assert.equal(cloud(ctx).rev, 1); assert.equal(ctx.d.storage.getItem(KEY), D(9));
  assert.equal(conflictCount(ctx.d), 1); assert.equal(ck(ctx.d).baseline.rev, 2, 'baseline 不倒退');
  assert.match(statusText(ctx.d), /無法確認|各自保留/);
});

test('A14c 壞後端：PUT 被拒、卻回報雲端還在基準版本 ⇒ 不無限重送，當成同步失敗、pending 保留', {timeout: 10000}, async t => {
  const ctx = await synced8(t);
  const real = ctx.backend.handle.bind(ctx.backend);
  ctx.backend.handle = req => req.op === 'put' ? {ok: false, err: 'conflict', rev: 1, data: D(8), updated: 1} : real(req);
  ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  assert.ok(ctx.N.puts.length <= 3, '有限次數：' + ctx.N.puts.length);
  assert.match(statusText(ctx.d), /同步失敗/);
  assert.equal(ck(ctx.d).pending && ck(ctx.d).pending.data, D(9));
});

test('A16d 留著別的家庭的 checkpoint（例如移除失敗或還原備份）⇒ 不沿用：不把它的 pending 送進這個家庭', async t => {
  const clock = new Clock(), backend = server(clock), N = net(backend);
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: D(8)});
  const foreign = JSON.stringify({version: 1, codeHash: H(CODE2), key: KEY, baseline: {rev: 1, hash: H(D(8)), updated: 1}, pending: {baseRev: 1, data: D(66), hash: H(D(66))}});
  const d = owner(backend, N, {initial: {[KEY]: D(8), 'g5sync.code': CODE, [CK]: foreign}});
  t.after(() => d.api.destroy());
  await d.api.ready; await clock.advance(8000);
  assert.ok(!N.puts.some(p => p.data === D(66)), '別家庭的 pending 不能送');
  assert.equal(backend.store.record(CODE, KEY).data, D(8));
});

for (const fault of ['寫入拋錯', '讀回不符', '資料毀損']) {
  test('A15 checkpoint ' + fault + ' ⇒ 新 PUT 為 0；本機進度保留；顯示儲存異常', async t => {
    const ctx = await synced8(t);
    const st = ctx.d.storage;
    if (fault === '寫入拋錯') st.fail = k => k === CK;
    if (fault === '讀回不符') {
      const get = st.getItem.bind(st);
      st.getItem = k => { const v = get(k); if (k !== CK || v === null) return v; const o = JSON.parse(v); if (o.pending) o.pending.data += ' '; return JSON.stringify(o); };
    }
    if (fault === '資料毀損') st.setItem(CK, '{broken');
    const puts = ctx.N.puts.length;
    st.setItem(KEY, D(9)); await ctx.clock.advance(60000);
    assert.equal(ctx.N.puts.length, puts, '沒有新的上傳');
    assert.equal(st.getItem(KEY), D(9), '本機進度保留');
    assert.doesNotMatch(statusText(ctx.d), /^已同步/);
    assert.match(ctx.d.api.getState().notice, /儲存|同步紀錄/);
  });
}

test('A16a 只有舊 metadata（沒有 checkpoint）⇒ 遷移 baseline、不編造 pending；其他站的 metadata 不變', async t => {
  const clock = new Clock(), backend = server(clock), N = net(backend);
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: D(8)});
  const sci = {rev: 4, hash: H('{"sci":1}'), updated: 5};
  const meta = JSON.stringify({version: 1, codeHash: H(CODE), keys: {[KEY]: {rev: 1, hash: H(D(8)), updated: clock.now()}, 'g5sci.v3': sci}});
  const d = owner(backend, N, {initial: {[KEY]: D(8), 'g5sync.code': CODE, [META]: meta}});
  const ctx = {clock, backend, N, d, code: CODE}; t.after(() => ctx.d.api.destroy());
  await d.api.ready;
  assert.equal(conflictCount(d), 0, '舊 baseline 遷移後不出衝突');
  assert.equal(N.puts.length, 0, '沒有編造 pending 去上傳');
  assert.equal(ck(d) === null || ck(d).pending === null, true, 'pending 不是編出來的');
  d.storage.setItem(KEY, D(9)); await clock.advance(60000);
  assertSettled(ctx, 9, 2, 'A16a');
  assert.deepEqual(JSON.parse(d.storage.getItem(META)).keys['g5sci.v3'], sci, '其他站的 metadata 不變');
});

test('A16e 舊版（只有 g5sync.meta、沒有 pending）D8 已確認→D9 提交回應遺失→本機 D10，新版重開 ⇒ 顯示「無法確認」（unsure），不當成確定分歧', async t => {
  const clock = new Clock(), backend = server(clock), N = net(backend);
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: D(8)});
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 1, data: D(9)});   // 舊版送的 D9：後端存了、回應遺失，舊版沒有留下證據
  const meta = JSON.stringify({version: 1, codeHash: H(CODE), keys: {[KEY]: {rev: 1, hash: H(D(8)), updated: clock.now()}}});
  const d = owner(backend, N, {initial: {[KEY]: D(10), 'g5sync.code': CODE, [META]: meta}});
  t.after(() => d.api.destroy());
  await d.api.ready; await clock.advance(8000);
  const c = d.api.getState().conflicts[KEY];
  assert.ok(c, '雙邊不同：要保留兩份');
  assert.equal(c.unsure, true, '舊版沒有 pending 證據，無法確認是哪台寫的 ⇒ unsure');
  assert.match(statusText(d), /無法確認/);
  assert.equal(pickButtons(d).length, 0, '沒有選邊按鈕');
  assert.equal(d.storage.getItem(KEY), D(10), '這台照常用這台的');
  assert.equal(backend.store.record(CODE, KEY).data, D(9), '雲端那份不動');
});

test('A16f 新版自己的 checkpoint（baseline 已由新版確認、沒有 pending）遇到雲端下一號不同 ⇒ 仍是確定分歧（不因 A16e 變成 unsure）', async t => {
  const ctx = await synced8(t);
  ctx.d.api.destroy();
  ctx.backend.handle({op: 'put', code: ctx.code, key: KEY, rev: 1, data: D(20)});
  ctx.d.storage.setItem(KEY, D(9));
  const d = owner(ctx.backend, ctx.N, {storage: ctx.d.storage}); ctx.d = d; t.after(() => d.api.destroy());
  await d.api.ready; await ctx.clock.advance(8000);
  const c = d.api.getState().conflicts[KEY];
  assert.ok(c && !c.unsure, '新版有完整證據：另一台寫的 ⇒ 確定分歧：' + JSON.stringify(c));
});

test('A16b 上傳途中切換家庭 ⇒ 舊家庭的遲到回應不能寫入新家庭的 checkpoint', async t => {
  const ctx = await synced8(t);
  ctx.backend.handle({op: 'put', code: CODE2, key: KEY, rev: 0, data: D(50)});
  ctx.N.hold = 'after'; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  const joining = ctx.d.api.join(CODE2);
  ctx.N.release(); await joining; await ctx.clock.advance(8000);
  const k = ck(ctx.d);
  assert.ok(!k || k.codeHash === H(CODE2), 'checkpoint 不是舊家庭的');
  assert.ok(!k || !(k.baseline && k.baseline.hash === H(D(9))), '舊家庭的 D9 不能變成新家庭的 baseline');
  assert.equal(ctx.backend.store.record(CODE2, KEY).data, D(50), '新家庭的雲端不被蓋掉');
  assert.equal(ctx.d.storage.getItem(KEY), D(9));
});

test('A16c 上傳途中停止同步 ⇒ checkpoint 清掉，遲到回應不會再寫回；進度保留', async t => {
  const ctx = await synced8(t);
  ctx.N.hold = 'after'; ctx.d.storage.setItem(KEY, D(9)); await ctx.clock.advance(4000);
  assert.ok(ck(ctx.d) && ck(ctx.d).pending, '送出前有 pending');
  ctx.d.api.stop(); ctx.N.release(); await flush(); await ctx.clock.advance(8000);
  assert.equal(ctx.d.storage.getItem(CK), null, '停止同步後沒有 checkpoint');
  assert.equal(ctx.d.storage.getItem('g5sync.code'), null);
  assert.equal(ctx.d.storage.getItem(KEY), D(9));
});

test('A17 雲端有新資料：頁面說不能換（篇內／有未存進度）就不替換；首頁存妥才由 app 的 accept 寫入', async t => {
  const ctx = await synced8(t);
  ctx.backend.handle({op: 'put', code: ctx.code, key: KEY, rev: 1, data: D(20)});
  // 執行中的頁面只在開頁（或衝突、延後替換）時 GET；孩子重開頁面、直接在某一篇裡（allow=false）
  ctx.d.api.destroy();
  const d = owner(ctx.backend, ctx.N, {storage: ctx.d.storage}); ctx.d = d; t.after(() => d.api.destroy());
  d.box.allow = false; await d.api.ready; await ctx.clock.advance(8000);
  assert.equal(ctx.d.storage.getItem(KEY), D(8), '不能換時本機不動'); assert.equal(ctx.d.box.accepted, 0);
  assert.match(statusText(ctx.d), /回到首頁/);
  ctx.d.box.allow = true; await ctx.clock.advance(4000);
  assert.equal(ctx.d.box.accepted, 1, '由 app 的 accept 寫入');
  assertSettled(ctx, 20, 2, 'A17');
});

// A18：沒有 accept 的客戶端（自然站、數學站從 g5-help/sync.js 載入）行為必須與改前完全相同。
// 同一組情境分別跑「改前 sync.js（tests/fixtures/sync.legacy-859ad79.js）」與「現在的 src/sync.js」，逐步比對：
// 請求序列、localStorage 全部內容、衝突、狀態列、提示。另外斷言沒有 accept 時不寫 checkpoint。
const LEGACY = path.join(__dirname, 'fixtures', 'sync.legacy-859ad79.js');
const SKEY = 'g5sci.v3', sdata = n => JSON.stringify({n});
async function scenario(syncPath) {
  const clock = new Clock(), backend = server(clock), trace = [];
  let drop = 0, down = false;
  const fetch = async req => {
    if (down) throw new TypeError('offline');
    const r = backend.handle(req);
    if (req.op === 'put' && drop > 0) { drop -= 1; throw new TypeError('lost'); }
    return {ok: true, json: async () => r};
  };
  const mk = (o = {}) => device(backend, Object.assign({syncPath, fetch, keys: [SKEY]}, o));
  const snap = (label, d) => trace.push({label, status: d.api.getState().status, notice: d.api.getState().notice,
    conflicts: d.api.getState().conflicts, storage: d.storage.dump(), calls: d.calls.map(c => [c.req.op, c.req.rev, c.req.data]),
    buttons: descendants(d.doc.container).filter(n => n.tagName === 'BUTTON').map(n => n.textContent)});
  const a = mk({initial: {[SKEY]: sdata(1)}}); await a.api.ready; await a.api.enable(); snap('enable', a);
  const code = a.api.getState().code;
  drop = 1; a.storage.setItem(SKEY, sdata(2)); await clock.advance(4000); snap('lost', a);
  await clock.advance(8000); snap('retry-after-lost', a);
  a.api.destroy();
  const b = mk(); await b.api.ready; await b.api.join(code); snap('join-empty', b);
  b.storage.setItem(SKEY, sdata(3)); down = true; await clock.advance(4000); snap('offline', b);
  down = false; await clock.advance(8000); snap('back-online', b);
  const c = mk({initial: {[SKEY]: sdata(9)}}); await c.api.ready; await c.api.join(code); snap('join-with-data', c);
  await c.api.resolve(SKEY, 'local'); snap('resolve-local', c);
  b.storage.setItem(SKEY, sdata(4)); await clock.advance(4000); snap('b-conflict', b);
  await b.api.resolve(SKEY, 'cloud'); snap('b-resolve-cloud', b);
  b.api.stop(); snap('stop', b);
  [b, c].forEach(d => d.api.destroy());
  return trace;
}
test('A18 沒有 accept 的客戶端：與改前 sync.js 逐步完全相同（請求、儲存、衝突、按鈕、狀態），也不寫 checkpoint', async () => {
  const norm = x => JSON.parse(JSON.stringify(x));   // 兩次跑在不同 vm realm，先轉成本 realm 的純資料再比
  const before = norm(await scenario(LEGACY)), after = norm(await scenario(undefined));
  assert.equal(before.length, after.length);
  before.forEach((s, i) => assert.deepEqual(after[i], s, '第 ' + (i + 1) + ' 步「' + s.label + '」不同'));
  after.forEach(s => assert.ok(!Object.keys(s.storage).some(k => k.startsWith('g5sync.ckpt.')), s.label + '：沒有 accept 不寫 checkpoint'));
  assert.ok(after.some(s => s.buttons.includes('留這台的')), '自然站仍有選邊按鈕（情境有走到衝突）');
});
