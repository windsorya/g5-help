// 各科目站的「補題區」共用元件（交辦 #1618，律師 2026-10-13：「這樣是否需要在各科目欄位內加上補題區？」）。
// 執行：node --test tests/upload.test.js（純函式；畫面與送出流程由 tests/e2e_upload.py 在瀏覽器裡測）
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const U = require('../src/upload.js');

test('說明加前綴【補題:科目:單元】；多張照片標第幾張', () => {
  assert.equal(U.makeNote('自然', 'u2', '習作第 12 頁', 1, 1), '【補題:自然:u2】習作第 12 頁');
  assert.equal(U.makeNote('國語', 'L3', '生字', 2, 3), '【補題:國語:L3】生字（第 2/3 張）');
  assert.equal(U.makeNote('社會', 'all', '', 1, 1), '【補題:社會:all】');
});

test('說明總長不超過 GAS 上限 500 字（截掉的是家長的字，不是前綴與張數）', () => {
  const n = U.makeNote('數學', 'u1', 'x'.repeat(800), 3, 4);
  assert.equal(n.length, 500);
  assert.ok(n.startsWith('【補題:數學:u1】'));
  assert.ok(n.endsWith('（第 3/4 張）'));
});

test('科目或單元 id 不合格就丟錯（不送出壞前綴，取題腳本會解析不到）', () => {
  assert.throws(() => U.makeNote('體育', 'u1', '', 1, 1));
  assert.throws(() => U.makeNote('自然', 'u 1', '', 1, 1));
  assert.throws(() => U.makeNote('自然', '', '', 1, 1));
  assert.throws(() => U.makeNote('自然', 'a:b', '', 1, 1));
});

test('parseNote 讀回科目、單元與家長說明；不是補題的回 null', () => {
  assert.deepEqual(U.parseNote('【補題:國語:L3】生字（第 2/3 張）'), { subject: '國語', unit: 'L3', text: '生字（第 2/3 張）' });
  assert.equal(U.parseNote('【錯題】第 5 題'), null);
  assert.equal(U.parseNote('第 5 題'), null);
  assert.equal(U.parseNote(null), null);
  assert.equal(U.parseNote('【補題:國語】缺單元'), null);
});

test('「你補的題目」只列本科的補題（別科、錯題、難題、撤回的都不列）', () => {
  const items = [
    { id: 'a', note: '【補題:自然:u1】一', status: 'new' },
    { id: 'b', note: '【補題:數學:u1】二', status: 'new' },
    { id: 'c', note: '【錯題】三', status: 'new' },
    { id: 'd', note: '第 5 題', status: 'fetched' },
    { id: 'e', note: '【補題:自然:u2】五', status: 'withdrawn' },
    { id: 'f', note: '【補題:自然:u2】六', status: 'done', url: 'https://windsorya.github.io/g5-sci-review/#c/x' }
  ];
  assert.deepEqual(U.mineFor(items, '自然').map((x) => x.id), ['a', 'f']);
  assert.deepEqual(U.mineFor(null, '自然'), []);
});

test('單元名稱查得到就顯示名稱，查不到顯示 id（題庫改版後舊補題不會變空白）', () => {
  const units = [{ id: 'u1', name: '第一單元 太陽' }];
  assert.equal(U.unitName(units, 'u1'), '第一單元 太陽');
  assert.equal(U.unitName(units, 'zz'), 'zz');
  assert.equal(U.unitName(units, 'all'), '不分單元');
});

test('做好了的連結只接受本站網址（GAS 回來的 url 不可信，不能讓它變成任意連結）', () => {
  assert.equal(U.safeDoneUrl('https://windsorya.github.io/g5-sci-review/#c/abc-1', 'g5-sci-review'), 'https://windsorya.github.io/g5-sci-review/#c/abc-1');
  assert.equal(U.safeDoneUrl('https://windsorya.github.io/g5-math-review/#c/abc', 'g5-sci-review'), '');
  assert.equal(U.safeDoneUrl('javascript:alert(1)', 'g5-sci-review'), '');
  assert.equal(U.safeDoneUrl('https://windsorya.github.io/g5-sci-review/#c/a"onmouseover=x', 'g5-sci-review'), '');
  assert.equal(U.safeDoneUrl(undefined, 'g5-sci-review'), '');
});

test('esc 擋掉 HTML（家長說明會被畫進清單）', () => {
  assert.equal(U.esc('<img src=x onerror=1>&"'), '&lt;img src=x onerror=1&gt;&amp;&quot;');
});

test('多張照片送出結果的訊息：全成功／部分失敗講清楚哪幾張沒送到', () => {
  assert.match(U.sendSummary(3, [true, true, true]), /3 張都送出了/);
  const m = U.sendSummary(3, [true, false, true]);
  assert.match(m, /送出 2 張/);
  assert.match(m, /第 2 張沒有送出/);
  const none = U.sendSummary(2, [false, false]);
  assert.match(none, /沒有送出/);
  assert.match(none, /再按一次/);
  assert.doesNotMatch(none, /送出 0 張/);
});

// ── 清單／撤回生命週期用到的純函式（Codex 設計者結論 docs/upload-list-lifecycle-codex-designer-20261013.md；瀏覽器行為見 tests/e2e_upload.py U1–U15）──

test('GAS 回應：HTTP 不是 2xx、不是 JSON、不是物件，一律當失敗（U15：錯誤頁不能當成功）', () => {
  assert.throws(() => U.parseReply(false, '{"ok":true,"items":[]}'));
  assert.throws(() => U.parseReply(true, '<html>Error</html>'));
  assert.throws(() => U.parseReply(true, ''));
  assert.throws(() => U.parseReply(true, '[1,2]'));
  assert.throws(() => U.parseReply(true, 'null'));
  assert.throws(() => U.parseReply(true, '"ok"'));
  assert.deepEqual(U.parseReply(true, '{"ok":true,"items":[]}'), { ok: true, items: [] });
  assert.deepEqual(U.parseReply(true, '{"ok":false,"err":"server"}'), { ok: false, err: 'server' });
});

test('清單回應形狀：只有 ok:true 且 items 是陣列才算成功', () => {
  assert.deepEqual(U.mineItems({ ok: true, items: [{ id: 'a' }] }), [{ id: 'a' }]);
  assert.deepEqual(U.mineItems({ ok: true, items: [] }), []);
  assert.equal(U.mineItems({ ok: true, items: null }), null);
  assert.equal(U.mineItems({ ok: true, items: {} }), null);
  assert.equal(U.mineItems({ ok: true, items: 'a,b' }), null);
  assert.equal(U.mineItems({ ok: true }), null);
  assert.equal(U.mineItems({ ok: false, items: [] }), null);
  assert.equal(U.mineItems({ ok: 'true', items: [] }), null);
  assert.equal(U.mineItems(null), null);
});

test('撤回結果分類：成功／做好了／找不到／其他失敗／無法確認（回應殘缺不算失敗也不算成功）', () => {
  assert.equal(U.withdrawOutcome({ ok: true }), 'ok');
  assert.equal(U.withdrawOutcome({ ok: true, already: true }), 'ok');
  assert.equal(U.withdrawOutcome({ ok: false, err: 'done' }), 'done');
  assert.equal(U.withdrawOutcome({ ok: false, err: 'not-found' }), 'not-found');
  assert.equal(U.withdrawOutcome({ ok: false, err: 'bad-id' }), 'fail');
  assert.equal(U.withdrawOutcome({ ok: false }), 'fail');
  assert.equal(U.withdrawOutcome(null), 'unknown');
  assert.equal(U.withdrawOutcome({}), 'unknown');
  assert.equal(U.withdrawOutcome({ ok: 1 }), 'unknown');
});

test('撤回訊息：網路失敗、逾時、回應殘缺都講「還沒確認」，不說成功、也不說沒撤回（伺服器可能已經做了）', () => {
  ['net', 'timeout', 'unknown'].forEach((o) => {
    assert.match(U.withdrawMessage(o), /還沒確認/, o);
    assert.doesNotMatch(U.withdrawMessage(o), /撤回了|沒有撤回成功/, o);
  });
  assert.match(U.withdrawMessage('ok'), /撤回了/);
  assert.match(U.withdrawMessage('done'), /已經做好了/);
  assert.match(U.withdrawMessage('not-found'), /找不到/);
  assert.match(U.withdrawMessage('fail'), /沒有撤回成功/);
});

test('家庭碼：空字串、null、非字串都當作沒開同步（不能拿空碼去查）', () => {
  assert.equal(U.familyOf(''), null);
  assert.equal(U.familyOf(null), null);
  assert.equal(U.familyOf(undefined), null);
  assert.equal(U.familyOf(123), null);
  assert.equal(U.familyOf('ABCDEFGHJKMN'), 'ABCDEFGHJKMN');
});

test('已確認撤回的題目：之後任何清單回應都濾掉（撤回前發出的查詢晚到、伺服器慢一步都不讓它回來）', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c-1' }, { id: 'd' }, { id: '__proto__' }];
  assert.deepEqual(U.dropWithdrawn(items, ['b', 'c-1', '__proto__']).map((x) => x.id), ['a', 'd']);
  assert.deepEqual(U.dropWithdrawn(items, []).map((x) => x.id), ['a', 'b', 'c-1', 'd', '__proto__']);
  assert.deepEqual(U.dropWithdrawn(null, ['a']), []);
});

test('查詢與撤回的期限 90 秒（設計者設計值），常數旁寫明 cap-why', () => {
  assert.equal(U.DEADLINE_MS, 90000);
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'upload.js'), 'utf8');
  const line = src.split('\n').find((l) => /DEADLINE_MS\s*=\s*90000/.test(l));
  assert.ok(line && /cap-why:/.test(line), line);
});

test('清單查詢的本科前綴：與說明前綴同形、後端 PREFIX_RE 收得下；科目不對丟錯', () => {
  const I = require('../gas/inbox.js');
  U.SUBJECTS.forEach((sj) => {
    const pre = U.minePrefix(sj);
    assert.ok(U.makeNote(sj, 'u1', 'x', 1, 1).startsWith(pre));
    const s = { hash: (c) => 'h', listByCode: (h, p) => [{ id: 'a', status: 'new', p }], getLastFetch: () => 0 };
    assert.equal(I.handleInbox(s, { op: 'mine', code: 'ABCDEFGHJKMN', prefix: pre }, () => 1).ok, true, sj);
  });
  assert.throws(() => U.minePrefix('體育'));
});

// ── Codex 審 117bbb0 三項（設計後第 1 輪）：在記憶體 VM 裡掛元件（假 DOM／fetch／縮圖；計時器一律不跑＝所有事都發生在兩次 2 秒輪詢之間），
// 重現審查的三個反例。瀏覽器版見 tests/e2e_upload.py U2／U6／U10／U11 的對應變體。G5_UPLOAD_SRC 可指向別份元件（突變自檢用）。
const vm = require('node:vm');
const MOUNT_SRC = fs.readFileSync(process.env.G5_UPLOAD_SRC || path.join(__dirname, '..', 'src', 'upload.js'), 'utf8');
const CA = 'ABCDEFGHJKMN', CB = 'PQRSTUVWXYZ2';

function makeEnv(code) {
  const store = new Map();
  if (code) store.set('g5sync.code', code);
  const env = { reqs: [], auto: () => undefined, holdImg: false, imgQ: [] };
  env.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); }
  };
  function plain() { return { textContent: '', disabled: false, value: '', files: [], classList: { toggle() {} }, onclick: null }; }
  function items() {
    const n = plain();
    n._html = ''; n._btn = [];
    Object.defineProperty(n, 'innerHTML', {
      get() { return n._html; },
      set(h) {
        n._html = h; n._btn = [];
        const re = /<button[^>]*?(data-wd="([^"]*)"|data-wd-no)[^>]*>/g;
        let m;
        while ((m = re.exec(h))) n._btn.push({ wd: m[2] || null, disabled: /\sdisabled/.test(m[0]), getAttribute(a) { return a === 'data-wd' ? this.wd : null; }, onclick: null });
      }
    });
    n.querySelectorAll = (sel) => n._btn.filter((b) => (sel === 'button[data-wd]' ? b.wd : !b.wd));
    return n;
  }
  const box = {};
  Object.defineProperty(box, 'innerHTML', {
    set() {
      const nodes = {};
      ['g5u-send', 'g5u-file', 'g5u-note', 'g5u-unit', 'g5u-out', 'g5u-health', 'g5u-wmsg'].forEach((c) => { nodes[c] = plain(); });
      nodes['g5u-items'] = items();
      nodes['g5u-unit'].value = 'L1';
      box.firstChild = { querySelector: (sel) => nodes[sel.slice(1)] };
      env.nodes = nodes;
    }
  });
  const noop = () => {};
  const ctx = {
    localStorage: env.localStorage,
    document: {
      querySelector: () => box, getElementById: () => ({}), head: { appendChild: noop },
      createElement: () => ({ width: 0, height: 0, getContext: () => ({ drawImage: noop }), toDataURL: () => 'data:image/jpeg;base64,AAAA' }),
      addEventListener: noop, removeEventListener: noop, visibilityState: 'visible'
    },
    addEventListener: noop, removeEventListener: noop,
    setTimeout: () => 1, clearTimeout: noop, setInterval: () => 1, clearInterval: noop,
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL: noop },
    AbortController, Promise, JSON, Date, Math, Object, Array, String, RegExp, Error,
    Image: function () {
      const img = this;
      img.width = 10; img.height = 10;
      Object.defineProperty(img, 'src', { set() { const go = () => img.onload(); if (env.holdImg) env.imgQ.push(go); else setImmediate(go); } });
    },
    fetch: (url, opt) => new Promise((res, rej) => {
      const r = { body: JSON.parse(opt.body), done: false };
      r.reply = (json) => { if (!r.done) { r.done = true; res({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify(json)) }); } };
      r.fail = () => { if (!r.done) { r.done = true; rej(new TypeError('net')); } };
      env.reqs.push(r);
      const a = env.auto(r.body, env);
      if (a !== undefined) r.reply(a);
    })
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(MOUNT_SRC, ctx);
  env.mount = () => ctx.G5Upload.mount('#box', { subject: '國語', site: 'g5-chinese-review', units: [{ id: 'L1', name: '第一課' }] });
  env.ops = (op) => env.reqs.filter((r) => r.body.op === op);
  env.pending = (op) => env.ops(op).filter((r) => !r.done);
  env.ids = () => (env.nodes['g5u-items'].innerHTML.match(/data-id="[^"]*"/g) || []).map((s) => s.slice(9, -1));
  env.card = (id) => {
    const h = env.nodes['g5u-items'].innerHTML, i = h.indexOf('data-id="' + id + '"'), j = h.indexOf('g5u-card', i + 1);
    return i < 0 ? null : h.slice(i, j < 0 ? h.length : j);
  };
  env.wd = (id) => env.nodes['g5u-items']._btn.find((b) => b.wd === id).onclick();
  env.text = (c) => env.nodes[c].textContent;
  return env;
}
async function flush() { for (let i = 0; i < 30; i += 1) await new Promise((r) => setImmediate(r)); }
function it(id, status) { return { id, time: 1760000000000, note: '【補題:國語:L1】' + id, status: status || 'new' }; }

test('審 117bbb0①：兩次輪詢之間 A→B→A，在途上傳不沿用（第二張不送、不清草稿、提示沒有送出）', async () => {
  const E = makeEnv(CA);
  E.auto = (b) => (b.op === 'mine' ? { ok: true, items: [] } : undefined);
  E.mount();
  await flush();
  E.nodes['g5u-file'].files = [{}, {}];
  E.nodes['g5u-note'].value = '草稿';
  E.nodes['g5u-send'].onclick();
  await flush();
  assert.equal(E.pending('upload').length, 1);
  E.localStorage.setItem('g5sync.code', CB);
  E.localStorage.setItem('g5sync.code', CA);
  E.pending('upload')[0].reply({ ok: true, id: 'u1' });
  await flush();
  assert.deepEqual(E.ops('upload').map((r) => r.body.code), [CA], '第二張不得送出');
  assert.equal(E.nodes['g5u-note'].value, '草稿', '草稿不得被清掉');
  assert.match(E.text('g5u-out'), /沒有送出/);
  assert.doesNotMatch(E.text('g5u-out'), /都送出了|^送出了/);
});

test('審 117bbb0①：兩次輪詢之間 A→B→A，在途撤回的成功不沿用；在途查詢不採用、改發新世代查詢', async () => {
  const E = makeEnv(CA);
  E.auto = (b) => (b.op === 'mine' && E.ops('mine').length === 1 ? { ok: true, items: [it('x'), it('w')] } : undefined);
  E.mount();
  await flush();
  assert.deepEqual(E.ids(), ['x', 'w']);
  E.wd('x'); E.wd('x');
  await flush();
  assert.equal(E.pending('withdraw').length, 1);
  E.localStorage.setItem('g5sync.code', CB);
  E.localStorage.setItem('g5sync.code', CA);
  E.pending('withdraw')[0].reply({ ok: true });
  await flush();
  assert.doesNotMatch(E.text('g5u-wmsg'), /撤回了/, '舊世代的撤回結果不得顯示');

  const E2 = makeEnv(CA);
  E2.auto = (b) => (b.op === 'mine' && E2.ops('mine').length === 1 ? { ok: true, items: [it('x')] } : undefined);
  const h2 = E2.mount();
  await flush();
  h2.reload();   // 第一筆已結束，這是第二筆（扣住）
  await flush();
  const old = E2.pending('mine')[0];
  E2.localStorage.setItem('g5sync.code', CB);
  E2.localStorage.setItem('g5sync.code', CA);
  old.reply({ ok: true, items: [it('q'), it('x')] });
  await flush();
  assert.ok(!E2.ids().includes('q'), '舊世代的清單不得採用：' + E2.ids());
  assert.equal(E2.pending('mine').length, 1, '應改發一筆新世代查詢');
  assert.equal(E2.pending('mine')[0].body.code, CA);
});

test('審 117bbb0①：別的分頁 A→B→A（storage 事件帶新舊值，本頁讀到的碼始終是 A）也換世代', () => {
  assert.equal(U.codeEventChanged({ key: 'g5sync.code', oldValue: CA, newValue: CB }), true);
  assert.equal(U.codeEventChanged({ key: 'g5sync.code', oldValue: CB, newValue: CA }), true);
  assert.equal(U.codeEventChanged({ key: 'g5sync.code', oldValue: CA, newValue: CA }), false);
  assert.equal(U.codeEventChanged({ key: 'g5sync.meta', oldValue: 'a', newValue: 'b' }), false);
  assert.equal(U.codeEventChanged({ key: null, oldValue: null, newValue: null }), true);   // localStorage.clear()
  assert.equal(U.codeEventChanged(null), false);
});

test('審 117bbb0①：同一頁寫入同步碼（setItem／removeItem／clear）每次值變了就換世代，寫同一個值不換', () => {
  const store = new Map([['g5sync.code', CA]]);
  const ls = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => { store.set(k, String(v)); }, removeItem: (k) => { store.delete(k); }, clear: () => { store.clear(); } };
  let n = 0;
  U.watchCode(ls, () => { n += 1; });
  ls.setItem('g5sync.code', CB); assert.equal(n, 1);
  ls.setItem('g5sync.code', CA); assert.equal(n, 2, 'A→B→A 是兩次');
  ls.setItem('g5sync.code', CA); assert.equal(n, 2, '寫同一個值不換');
  ls.setItem('g5sync.meta', 'x'); assert.equal(n, 2, '別的 key 不換');
  ls.removeItem('g5sync.code'); assert.equal(n, 3);
  ls.setItem('g5sync.code', CA); ls.clear(); assert.equal(n, 5);
  assert.equal(ls.getItem('g5sync.code'), null, '原本的寫入行為不變');
});

test('審 117bbb0②：換家庭時的提示只算「已確認送出」的張數（失敗、還沒回來的不算已送出）', async () => {
  for (const [first, want, notWant] of [
    [{ ok: false, err: 'no-family' }, /照片沒有送出/, /已確認送出|已送出|1 張/],
    [{ ok: true, id: 'u1' }, /已確認送出的 1 張不受影響/, /還沒收到結果/]
  ]) {
    const E = makeEnv(CA);
    E.auto = (b) => (b.op === 'mine' ? { ok: true, items: [] } : undefined);
    const h = E.mount();
    await flush();
    E.nodes['g5u-file'].files = [{}, {}];
    E.nodes['g5u-send'].onclick();
    await flush();
    E.holdImg = true;                    // 扣住第二張的縮圖
    E.pending('upload')[0].reply(first);
    await flush();
    assert.equal(E.imgQ.length, 1);
    E.localStorage.setItem('g5sync.code', CB);
    h.reload();
    await flush();
    const out = E.text('g5u-out');
    assert.match(out, want, out);
    assert.doesNotMatch(out, notWant, out);
  }
  assert.match(U.switchMessage(0, false), /照片沒有送出/);
  assert.match(U.switchMessage(2, false), /已確認送出的 2 張不受影響/);
  assert.match(U.switchMessage(0, true), /還沒收到結果/);
  assert.doesNotMatch(U.switchMessage(0, true), /已確認送出|已送出/);
  assert.doesNotMatch(U.switchMessage(1, true), /送出了|取消/);
});

test('審 117bbb0③：撤回不論結果（done／not-found／fail／網路失敗）結束都作廢在途舊查詢並重查一次', async () => {
  for (const end of ['done', 'not-found', 'fail', 'net']) {
    const E = makeEnv(CA);
    let fresh = false;
    E.auto = (b) => {
      if (b.op !== 'mine') return undefined;
      if (E.ops('mine').length === 1) return { ok: true, items: [it('x'), it('w')] };
      return fresh ? { ok: true, items: [it('z'), it('x', end === 'done' ? 'done' : 'new'), it('w')] } : undefined;
    };
    const h = E.mount();
    await flush();
    h.reload();                            // 撤回前發出的舊查詢（扣住，快照沒有 z）
    await flush();
    const old = E.pending('mine')[0];
    E.wd('x'); E.wd('x');
    await flush();
    const w = E.pending('withdraw')[0];
    fresh = true;
    const n = E.ops('mine').length;
    if (end === 'net') w.fail(); else w.reply({ ok: false, err: end === 'fail' ? 'server' : end });
    await flush();
    assert.equal(E.ops('mine').length - n, 1, end + '：撤回結束後應重查一次');
    assert.deepEqual(E.ids(), ['z', 'x', 'w'], end + '：清單照伺服器現況');
    old.reply({ ok: true, items: [it('x'), it('w')] });
    await flush();
    assert.deepEqual(E.ids(), ['z', 'x', 'w'], end + '：舊查詢晚到不採用');
    if (end === 'done') assert.ok(/做好了/.test(E.card('x')) && !/data-wd="x"/.test(E.card('x')), E.card('x'));
  }
});
