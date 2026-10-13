// 補題區停用契約（迴圈 L20261013134831-7db82f 會診後第 2 次 FAIL，審 43ca485，依 4agent 報告停止條件當輪關功能）：
// mount 只畫一行暫停說明並指向難題站；回傳無作用的 {reload, stop}；上傳／查詢／撤回一律 0 請求、不註冊計時器與監聽。
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const SRC = fs.readFileSync(process.env.G5_UPLOAD_SRC || path.join(__dirname, '..', 'src', 'upload.js'), 'utf8');

function env() {
  const calls = { fetch: 0, timers: 0, listeners: 0 };
  const box = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const doc = {
    querySelector: (s) => (s === '#box' ? box : null),
    getElementById: () => null,
    createElement: () => ({}),
    head: { appendChild: () => {} },
    addEventListener: () => { calls.listeners += 1; },
    visibilityState: 'visible'
  };
  const ctx = {
    document: doc, console,
    localStorage: { getItem: () => 'ABCDEFGHJKMN', setItem() {}, removeItem() {} },
    fetch: () => { calls.fetch += 1; return new Promise(() => {}); },
    setTimeout: () => { calls.timers += 1; return 1; }, setInterval: () => { calls.timers += 1; return 1; },
    clearTimeout() {}, clearInterval() {},
    addEventListener: () => { calls.listeners += 1; }, removeEventListener() {}
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(SRC, ctx);
  return { ctx, box, calls, G: ctx.G5Upload };
}

test('停用：ENABLED 為 false', () => {
  assert.equal(env().G.ENABLED, false);
});

test('停用：mount 只畫暫停說明＋難題站連結，0 請求、0 計時器、0 監聽', () => {
  const E = env();
  const h = E.G.mount('#box', { subject: '國語', site: 'g5-chinese-review', units: [{ id: 'u1', name: '第一課' }] });
  assert.ok(h && typeof h.reload === 'function' && typeof h.stop === 'function');
  assert.match(E.box.innerHTML, /補題區暫停使用/);
  assert.match(E.box.innerHTML, /href="https:\/\/windsorya\.github\.io\/g5-help\/"/);
  assert.doesNotMatch(E.box.innerHTML, /g5u-send|g5u-file|g5u-refresh/);
  h.reload(); h.stop(); h.stop();
  assert.deepEqual(E.calls, { fetch: 0, timers: 0, listeners: 0 });
});

test('停用：同一容器重掛兩次，仍只有暫停說明、0 請求', () => {
  const E = env();
  const cfg = { subject: '數學', site: 'g5-math-review', units: [] };
  E.G.mount('#box', cfg); const h2 = E.G.mount('#box', cfg);
  assert.match(E.box.innerHTML, /補題區暫停使用/);
  h2.reload();
  assert.equal(E.calls.fetch, 0);
});

test('停用：不合法的設定照舊回 null（不畫任何東西）', () => {
  const E = env();
  assert.equal(E.G.mount('#box', { subject: '英文', site: 'x' }), null);
  assert.equal(E.box.innerHTML, '');
});
