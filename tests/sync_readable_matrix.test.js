'use strict';
// #5099／#8251：Codex 設計者（迴圈 L20261122075543-8ff842，task-mwrlrwhc-5dqap0）26 列驗收矩陣。
// 設計：一套「本站讀得懂」關卡同時約束自動動作（換上、上傳、建立／重送待確認、補 baseline）與「已同步」完成條件；
// 傳輸確認（自己的 pending 已提交）不受 accepts 否決；家長親手選擇（manual）只豁免可讀性否決。
// 記號同設計報告：O＝頁面自己寫入（有 accept）、N＝一般站；V＝本站讀得懂、U＝讀不懂、∅＝沒有存檔；B＝baseline。
// 環境變數 G5_SYNC_UNDER_TEST 可改指其他 sync.js（驗「舊版跑這份會紅」用）。
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {Clock, Storage, server, device, flush, descendants, hash} = require('./harness');
const G5Sync = require('../src/sync.js');
const H = G5Sync.contentHash;
const SYNC = process.env.G5_SYNC_UNDER_TEST ? path.resolve(process.env.G5_SYNC_UNDER_TEST) : undefined;
const KEY = 'g5sci.v3', KEY2 = 'g5math.v1', CODE = 'ABCDEFGHJKMN', T0 = Date.UTC(2026, 9, 13, 0, 0, 0);
const V = (n, tag = '') => JSON.stringify({v: 3, cards: {}, log: Array.from({length: n}, (_, i) => ({op: tag + i})), settings: {}});
const Vs = (n, seen, tag = '') => JSON.stringify({v: 3, cards: {c1: {seen}}, log: Array.from({length: n}, (_, i) => ({op: tag + i}))});
const U = (n = 2, tag = '') => JSON.stringify({v: 3, cards: [], log: Array.from({length: n}, (_, i) => ({op: 'u' + tag + i}))});
const strict = raw => { try { const o = JSON.parse(raw); return o.v === 3 && Array.isArray(o.log) && !!o.cards && typeof o.cards === 'object' && !Array.isArray(o.cards); } catch (e) { return false; } };
const MODES = [['N', false], ['O', true]];
let backendRef = null;   // 自訂 fetch 的情境用：open() 建的那個假後端

// 開一台已加入家庭（CODE）的裝置：雲端、本機、baseline、pending 都照情境預先放好，然後照正常開頁（GET→判斷）。
async function open(t, o) {
  const clock = new Clock(), backend = server(clock), keys = o.keys || [KEY];
  backendRef = backend;
  for (const [k, [rev, data]] of Object.entries(o.cloud || {})) {
    if (rev > 0) backend.store.withLock(() => backend.store.set(hash(CODE), k, {rev, data, updated: T0 + rev}));
  }
  const init = {'g5sync.code': CODE}, metaKeys = {};
  for (const [k, v] of Object.entries(o.local || {})) if (v !== null) init[k] = v;
  if (o.auto) init['g5sync.auto'] = CODE;
  for (const k of keys) {
    const b = o.base && o.base[k], p = o.pending && o.pending[k];
    const baseline = b ? {rev: b[0], hash: H(b[1]), updated: T0 + b[0]} : null;
    if (o.owned && (b || p)) {
      init['g5sync.ckpt.' + k] = JSON.stringify({version: 1, codeHash: H(CODE), key: k, baseline,
        pending: p ? {baseRev: p.baseRev, data: p.data, hash: H(p.data)} : null});
    } else if (!o.owned && b) { metaKeys[k] = baseline; }
  }
  if (Object.keys(metaKeys).length) init['g5sync.meta'] = JSON.stringify({version: 1, codeHash: H(CODE), keys: metaKeys});
  const storage = new Storage(init), seen = {};
  let accepts;
  if (o.accepts) {
    accepts = {};
    for (const [k, fn] of Object.entries(o.accepts)) { seen[k] = []; accepts[k] = raw => { seen[k].push(raw); return fn(raw); }; }
  }
  const box = {accepted: 0};
  const opts = {storage, keys, autoResolve: o.autoResolve !== false, syncPath: SYNC, fetch: o.fetch,
    summarize: Object.fromEntries(keys.map(k => [k, () => 'x'])), ...(accepts ? {accepts} : {})};
  let d;
  if (o.owned) Object.assign(opts, {canReplace: () => true, accept: (k, v) => { box.accepted++; d.storage.setItem(k, v); return true; }});
  d = device(backend, opts);
  t.after(() => d.api.destroy());
  await d.api.ready; await flush(); await clock.advance(10);
  const s = {clock, backend, d, seen, box, storage,
    puts: () => d.calls.filter(c => c.req.op === 'put').length,
    gets: () => d.calls.filter(c => c.req.op === 'get').length,
    rec: (k = KEY) => backend.store.record(CODE, k),
    ck: (k = KEY) => JSON.parse(storage.getItem('g5sync.ckpt.' + k) || 'null'),
    base: (k = KEY) => {
      if (o.owned) { const c = JSON.parse(storage.getItem('g5sync.ckpt.' + k) || 'null'); return c ? c.baseline : null; }
      const m = JSON.parse(storage.getItem('g5sync.meta') || 'null'); return m && m.keys[k] ? m.keys[k] : null;
    },
    status: () => d.api.getState().status,
    conflict: (k = KEY) => d.api.getState().conflicts[k],
    banner: () => (d.doc.body.children.find(n => n.className === 'g5s-banner') || {textContent: ''}).textContent,
    hint: () => (descendants(d.doc.container).find(n => n.className === 'g5s-auto-hint') || {textContent: ''}).textContent
  };
  return s;
}
// 拒絕案例的共同斷言（設計報告「共同斷言」第一點）：兩邊原文、rev、baseline、pending、PUT 次數、替換通知、畫面文字都不動。
function rejected(s, label, {local, cloud, base, pending, k = KEY}) {
  assert.equal(s.storage.getItem(k), local, label + '：本機原文不動');
  const r = s.rec(k);
  if (cloud[0] === 0) assert.equal(r, null, label + '：雲端仍空白');
  else { assert.equal(r.rev, cloud[0], label + '：雲端 rev 不動'); assert.equal(r.data, cloud[1], label + '：雲端原文不動'); }
  const b = s.base(k);
  if (base === null) assert.equal(b, null, label + '：不建立 baseline');
  else { assert.equal(b.rev, base[0], label + '：baseline rev 不動'); assert.equal(b.hash, H(base[1]), label + '：baseline 不動'); }
  if (pending !== undefined) {
    const ck = s.ck(k), p = ck ? ck.pending : null;
    if (pending === null) assert.equal(p, null, label + '：不建立 pending');
    else { assert.ok(p, label + '：pending 保留'); assert.equal(p.data, pending.data); assert.equal(p.baseRev, pending.baseRev); }
  }
  assert.equal(s.puts(), 0, label + '：沒有 PUT');
  assert.deepEqual(s.d.replacements, [], label + '：沒有替換通知');
  assert.equal(s.box.accepted, 0, label + '：頁面 accept 沒被叫');
  const c = s.conflict(k);
  assert.ok(c, label + '：有衝突（各自保留）');
  assert.equal(c.reason, 'unreadable', label + '：原因是讀不懂，不是 unsure');
  assert.doesNotMatch(s.status(), /已同步/, label + '：不顯示已同步');
  assert.match(s.status(), /無法讀取/, label + '：狀態講明本站讀不懂');
  assert.ok(s.seen[k].length > 0, label + '：accepts 有被問到');
}

for (const [M, owned] of MODES) {
  test(`T01 ${M} 兩份一字不差但讀不懂、沒有 baseline、首次 r1 ⇒ 不被相等捷徑略過`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U()}, cloud: {[KEY]: [1, U()]}, accepts: {[KEY]: strict}});
    rejected(s, 'T01' + M, {local: U(), cloud: [1, U()], base: null, pending: null});
    assert.ok(s.seen[KEY].includes(U()));
  });

  test(`T02 ${M} 空白裝置、雲端讀不懂 ⇒ 不換上、不驗 null`, async t => {
    const s = await open(t, {owned, local: {[KEY]: null}, cloud: {[KEY]: [1, U()]}, accepts: {[KEY]: strict}});
    rejected(s, 'T02' + M, {local: null, cloud: [1, U()], base: null, pending: null});
    assert.ok(s.seen[KEY].includes(U()), '驗雲端那份');
    assert.ok(s.seen[KEY].every(r => r !== null), '不拿 null 去問 accepts');
  });
}

test('T03 O L=C=U、B=1:V、雲端前進到 rev 2 ⇒ 不補 baseline', async t => {
  const s = await open(t, {owned: true, local: {[KEY]: U()}, cloud: {[KEY]: [2, U()]}, base: {[KEY]: [1, V(1)]}, accepts: {[KEY]: strict}});
  rejected(s, 'T03', {local: U(), cloud: [2, U()], base: [1, V(1)], pending: null});
});

for (const [M, owned] of [['O', true], ['N', false]]) {
  test(`T0${owned ? 4 : 5} ${M} L=C=U、B=1:U、版本未前進 ⇒ 有衝突；自動碼的頁首與提示也不說已存雲端`, async t => {
    const s = await open(t, {owned, auto: true, local: {[KEY]: U()}, cloud: {[KEY]: [1, U()]}, base: {[KEY]: [1, U()]}, accepts: {[KEY]: strict}});
    rejected(s, 'T0x' + M, {local: U(), cloud: [1, U()], base: [1, U()], pending: null});
    assert.match(s.banner(), /還沒跟家裡其他裝置連起來/, '前提：自動碼頁首在');
    assert.doesNotMatch(s.banner(), /已經先存到雲端/);
    assert.doesNotMatch(s.hint(), /已自動備份到雲端/);
    assert.match(s.banner(), /讀不懂/);
  });
}

for (const [M, owned] of MODES) {
  test(`T06 ${M} 本機讀得懂且等於 B、雲端前進成讀不懂 ⇒ 不換上`, async t => {
    const s = await open(t, {owned, local: {[KEY]: V(1)}, cloud: {[KEY]: [2, U()]}, base: {[KEY]: [1, V(1)]}, accepts: {[KEY]: strict}});
    rejected(s, 'T06' + M, {local: V(1), cloud: [2, U()], base: [1, V(1)], pending: null});
  });
  test(`T07 ${M} 本機讀不懂（題數較多）、雲端讀得懂、首次 ⇒ 不評分選勝者、不 PUT`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U(40)}, cloud: {[KEY]: [1, V(2)]}, accepts: {[KEY]: strict}});
    rejected(s, 'T07' + M, {local: U(40), cloud: [1, V(2)], base: null, pending: null});
  });
  test(`T08 ${M} 本機讀得懂、雲端讀不懂、首次 ⇒ 不拿本機蓋雲端`, async t => {
    const s = await open(t, {owned, local: {[KEY]: V(9)}, cloud: {[KEY]: [1, U()]}, accepts: {[KEY]: strict}});
    rejected(s, 'T08' + M, {local: V(9), cloud: [1, U()], base: null, pending: null});
  });
  test(`T09 ${M} 本機讀不懂且符合 B、雲端前進成讀得懂 ⇒ 不因本機符合 B 就換上`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U()}, cloud: {[KEY]: [2, V(3)]}, base: {[KEY]: [1, U()]}, accepts: {[KEY]: strict}});
    rejected(s, 'T09' + M, {local: U(), cloud: [2, V(3)], base: [1, U()], pending: null});
    assert.ok(s.seen[KEY].includes(U()), '本機那份也要驗');
  });
  test(`T10 ${M} 本機改成讀得懂的新內容、雲端讀不懂且等於 B、未前進 ⇒ 不直接上傳`, async t => {
    const s = await open(t, {owned, local: {[KEY]: V(5)}, cloud: {[KEY]: [1, U()]}, base: {[KEY]: [1, U()]}, accepts: {[KEY]: strict}});
    rejected(s, 'T10' + M, {local: V(5), cloud: [1, U()], base: [1, U()], pending: null});
    assert.ok(s.seen[KEY].includes(U()), '雲端那份也要驗');
  });
  test(`T11 ${M} 本機讀不懂、雲端空白 rev 0 ⇒ 不 PUT、不建立 pending`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U()}, cloud: {}, accepts: {[KEY]: strict}});
    rejected(s, 'T11' + M, {local: U(), cloud: [0], base: null, pending: null});
  });
  test(`T12 ${M} 已同步後同頁把本機改成讀不懂 ⇒ 擋下直接上傳，重新取得雲端後顯示衝突`, async t => {
    const s = await open(t, {owned, local: {[KEY]: V(2)}, cloud: {[KEY]: [1, V(2)]}, base: {[KEY]: [1, V(2)]}, accepts: {[KEY]: strict}});
    assert.match(s.status(), /已同步/, '前提：一開始已同步');
    s.seen[KEY].length = 0;
    s.storage.setItem(KEY, U()); await s.clock.advance(4000);
    rejected(s, 'T12' + M, {local: U(), cloud: [1, V(2)], base: [1, V(2)], pending: null});
    assert.ok(s.seen[KEY].includes(U()), '驗的是改過之後的那份');
  });
}

for (const [M, owned] of MODES) {
  const cases = [
    ['本機題數多', V(9, 'l'), V(2, 'c'), 'L'], ['雲端題數多', V(2, 'l'), V(9, 'c'), 'C'],
    ['題數同、本機 seen 多', Vs(5, 9, 'l'), Vs(5, 2, 'c'), 'L'], ['題數同、雲端 seen 多', Vs(5, 2, 'l'), Vs(5, 9, 'c'), 'C'],
    ['完全平手留這台', V(4, 'l'), V(4, 'c'), 'L']];
  for (const [name, L, C, W] of cases) {
    test(`T13 ${M} 兩份都讀得懂且不同（${name}）⇒ 照原判準，勝者 ${W}`, async t => {
      const s = await open(t, {owned, local: {[KEY]: L}, cloud: {[KEY]: [1, C]}, accepts: {[KEY]: strict}});
      await s.clock.advance(4000);
      const win = W === 'L' ? L : C;
      assert.equal(s.storage.getItem(KEY), win);
      assert.equal(s.rec().rev, W === 'L' ? 2 : 1);
      assert.equal(s.rec().data, win);
      assert.equal(s.conflict(), undefined);
      assert.match(s.status(), /已同步/);
      const lose = W === 'L' ? C : L;
      assert.ok(Object.entries(s.storage.dump()).some(([n, v]) => n.startsWith('g5sync.backup.' + KEY + '.') && v === lose), '輸家照舊備份');
      assert.ok(s.seen[KEY].includes(L) && s.seen[KEY].includes(C), '雙方都驗過');
    });
  }
  for (const crev of [1, 2]) {
    test(`T14 ${M} L=C=V、B=1:V、雲端 rev ${crev} ⇒ 不變、baseline 到 ${crev}、已同步，且仍有驗`, async t => {
      const s = await open(t, {owned, local: {[KEY]: V(3)}, cloud: {[KEY]: [crev, V(3)]}, base: {[KEY]: [1, V(3)]}, accepts: {[KEY]: strict}});
      assert.equal(s.storage.getItem(KEY), V(3));
      assert.equal(s.rec().rev, crev);
      assert.equal(s.conflict(), undefined);
      assert.equal(s.base().rev, crev);
      assert.match(s.status(), /已同步/);
      assert.ok(s.seen[KEY].length > 0, '不能因相等省略');
      assert.equal(s.puts(), 0);
    });
  }
  test(`T15 ${M} 兩邊都沒有存檔、rev 0 ⇒ 不呼叫 accepts、可建立空 baseline、已同步`, async t => {
    const s = await open(t, {owned, local: {[KEY]: null}, cloud: {}, accepts: {[KEY]: () => { throw new Error('should not be called'); }}});
    assert.equal(s.storage.getItem(KEY), null);
    assert.equal(s.rec(), null);
    assert.equal(s.conflict(), undefined);
    assert.equal(s.seen[KEY].length, 0);
    assert.equal(s.base().rev, 0);
    assert.match(s.status(), /已同步/);
  });
  for (const [bname, bad] of [['false', () => false], ['1', () => 1], ["'yes'", () => 'yes'], ['undefined', () => undefined], ['拋錯', () => { throw new Error('boom'); }]]) {
    for (const [same, L, C] of [['相同', V(2, 's'), V(2, 's')], ['不同', V(9, 'l'), V(2, 'c')]]) {
      test(`T16 ${M} accepts 回 ${bname}、兩份${same} ⇒ 一律當讀不懂、無自動副作用、例外不外溢`, async t => {
        const s = await open(t, {owned, local: {[KEY]: L}, cloud: {[KEY]: [1, C]}, accepts: {[KEY]: bad}});
        rejected(s, 'T16' + M, {local: L, cloud: [1, C], base: null, pending: null});
        assert.equal(s.d.api.getState().notice, '', '例外不變成錯誤提示');
      });
    }
  }
}

test('T17 N 本機讀得懂、雲端前進成讀不懂：先擋自動；家長親手「留雲端」（重新取得未變）照辦，但仍不顯示已同步', async t => {
  const s = await open(t, {local: {[KEY]: V(1)}, cloud: {[KEY]: [2, U()]}, base: {[KEY]: [1, V(1)]}, accepts: {[KEY]: strict}});
  rejected(s, 'T17 自動', {local: V(1), cloud: [2, U()], base: [1, V(1)], pending: null});
  assert.equal(await s.d.api.resolve(KEY, 'cloud'), true);
  await flush();
  assert.equal(s.storage.getItem(KEY), U(), '換成雲端原文');
  assert.equal(s.rec().rev, 2);
  assert.equal(s.conflict(), undefined, '選擇衝突解除');
  assert.equal(s.base().rev, 2); assert.equal(s.base().hash, H(U()));
  assert.doesNotMatch(s.status(), /已同步/);
  assert.match(s.status(), /無法讀取/);
  assert.ok(Object.entries(s.storage.dump()).some(([n, v]) => n.startsWith('g5sync.backup.' + KEY + '.') && v === V(1)), '原備份照舊');
});

test('T18 O L=P=C=U、B=1:V、pending 已提交（雲端 rev 2＝pending）⇒ GET 恢復照樣 confirm；不出選擇衝突，但不顯示已同步', async t => {
  const s = await open(t, {owned: true, local: {[KEY]: U()}, cloud: {[KEY]: [2, U()]}, base: {[KEY]: [1, V(1)]},
    pending: {[KEY]: {baseRev: 1, data: U()}}, accepts: {[KEY]: strict}});
  assert.equal(s.ck().pending, null, 'pending 清空');
  assert.equal(s.ck().baseline.rev, 2); assert.equal(s.ck().baseline.hash, H(U()));
  assert.equal(s.rec().rev, 2); assert.equal(s.puts(), 0);
  assert.equal(s.conflict(), undefined, '沒有選擇衝突');
  assert.doesNotMatch(s.status(), /已同步/);
  assert.match(s.status(), /無法讀取/);
  assert.ok(s.seen[KEY].length > 0, '狀態判定有問 accepts');
});

test('T18b O pending 送出時本站還讀得懂、回應回來前讀檔變嚴（讀不懂）⇒ PUT 成功回應照樣 confirm，accepts 不否決傳輸事實', async t => {
  let lenient = true;
  const s = await open(t, {owned: true, local: {[KEY]: V(1)}, cloud: {[KEY]: [1, V(1)]}, base: {[KEY]: [1, V(1)]},
    accepts: {[KEY]: raw => lenient || strict(raw)}});
  assert.match(s.status(), /已同步/, '前提');
  s.d.mode = 'hold'; s.storage.setItem(KEY, U()); await s.clock.advance(4000);
  assert.equal(typeof s.d.held, 'function', '前提：PUT 已送出、回應未到');
  assert.equal(s.ck().pending.data, U());
  lenient = false; s.d.mode = 'ok'; s.d.held(); await flush(); await s.clock.advance(10);
  assert.equal(s.rec().rev, 2); assert.equal(s.rec().data, U());
  assert.equal(s.ck().pending, null, 'pending 清空');
  assert.equal(s.ck().baseline.rev, 2); assert.equal(s.ck().baseline.hash, H(U()));
  assert.equal(s.puts(), 1, '沒有再送');
  assert.equal(s.conflict(), undefined);
  assert.doesNotMatch(s.status(), /已同步/);
});

test('T19 O 自己的 pending（讀得懂）已提交、本機之後改成讀不懂 ⇒ 先 confirm 清 pending，再擋下一筆上傳（不可讀衝突、雲端不再增版）', async t => {
  const P = V(4, 'p');
  const s = await open(t, {owned: true, local: {[KEY]: U()}, cloud: {[KEY]: [2, P]}, base: {[KEY]: [1, V(1)]},
    pending: {[KEY]: {baseRev: 1, data: P}}, accepts: {[KEY]: strict}});
  assert.equal((s.conflict() || {}).reason, 'unreadable', '同一輪 confirm 後就擋下 nextFromLocal（不是等下一輪）');
  await s.clock.advance(4000);
  assert.equal(s.ck().pending, null, 'pending 已清');
  assert.equal(s.ck().baseline.rev, 2); assert.equal(s.ck().baseline.hash, H(P));
  assert.equal(s.rec().rev, 2, '不得再增版'); assert.equal(s.rec().data, P);
  assert.equal(s.puts(), 0);
  assert.equal(s.storage.getItem(KEY), U());
  assert.equal((s.conflict() || {}).reason, 'unreadable');
  assert.doesNotMatch(s.status(), /已同步/);
  assert.ok(s.seen[KEY].includes(U()), '驗最新本機');
});

test('T20 O L=P=U、雲端仍在基準（讀得懂）、pending 尚未提交 ⇒ 保留原 pending、不重送、不 confirm', async t => {
  const s = await open(t, {owned: true, local: {[KEY]: U()}, cloud: {[KEY]: [1, V(1)]}, base: {[KEY]: [1, V(1)]},
    pending: {[KEY]: {baseRev: 1, data: U()}}, accepts: {[KEY]: strict}});
  await s.clock.advance(4000);
  rejected(s, 'T20', {local: U(), cloud: [1, V(1)], base: [1, V(1)], pending: {baseRev: 1, data: U()}});
});

test('T20b O 本機讀得懂的 pending 只在讀不懂這一點不同：pending 讀不懂、本機與雲端都讀得懂 ⇒ 仍保留 pending、不重送，顯示讀不懂衝突', async t => {
  const s = await open(t, {owned: true, local: {[KEY]: V(6, 'now')}, cloud: {[KEY]: [1, V(1)]}, base: {[KEY]: [1, V(1)]},
    pending: {[KEY]: {baseRev: 1, data: U()}}, accepts: {[KEY]: strict}});
  rejected(s, 'T20b', {local: V(6, 'now'), cloud: [1, V(1)], base: [1, V(1)], pending: {baseRev: 1, data: U()}});
  assert.ok(s.seen[KEY].includes(U()), '驗的是實際 pending');
});

test('T20c O 同頁：pending 送出時讀得懂、請求遺失（沒到雲端）後讀檔變嚴 ⇒ 下一輪不直接重送，同一輪就 GET 判定成讀不懂衝突', async t => {
  let lenient = true, drop = false;
  const s = await open(t, {owned: true, local: {[KEY]: V(1)}, cloud: {[KEY]: [1, V(1)]}, base: {[KEY]: [1, V(1)]},
    accepts: {[KEY]: raw => lenient || strict(raw)},
    fetch: (req, config, d) => { if (drop && req.op === 'put') return Promise.reject(new TypeError('lost')); return {ok: true, json: async () => backendRef.handle(req)}; }});
  drop = true; s.storage.setItem(KEY, U()); await s.clock.advance(4000);
  assert.equal(s.puts(), 1, '前提：送過一次'); assert.equal(s.ck().pending.data, U(), '前提：pending 還在');
  assert.equal(s.rec().rev, 1, '前提：沒到雲端');
  lenient = false; drop = false; await s.clock.advance(4000);
  assert.equal(s.puts(), 1, '沒有重送讀不懂的 pending');
  assert.equal((s.conflict() || {}).reason, 'unreadable', '退避後那一輪就判定');
  assert.equal(s.ck().pending.data, U(), 'pending 保留');
  assert.doesNotMatch(s.status(), /已同步/);
});

for (const [M, owned] of MODES) {
  test(`T27 ${M} 本機讀得懂的新進度送出時被拒、衝突回應帶回的雲端讀不懂 ⇒ 不重送、不換上，顯示讀不懂衝突（PUT 回流也過關卡）`, async t => {
    const s = await open(t, {owned, local: {[KEY]: V(1)}, cloud: {[KEY]: [1, V(1)]}, base: {[KEY]: [1, V(1)]}, accepts: {[KEY]: strict},
      fetch: req => req.op === 'put' ? {ok: true, json: async () => ({ok: false, err: 'conflict', rev: 2, data: U(), updated: T0 + 2})}
        : {ok: true, json: async () => backendRef.handle(req)}});
    s.storage.setItem(KEY, V(9, 'new')); await s.clock.advance(4000);
    assert.equal(s.puts(), 1, '只送那一次');
    assert.equal(s.storage.getItem(KEY), V(9, 'new'), '這台不被換掉');
    assert.equal((s.conflict() || {}).reason, 'unreadable');
    assert.doesNotMatch(s.status(), /已同步/);
    assert.equal(s.box.accepted, 0); assert.deepEqual(s.d.replacements, []);
  });
}

// ---- Codex 審 c9168eb（設計後第 1 輪）三項 ----
test('T28 O pending 讀不懂、雲端被另一台推進（讀得懂）、本機讀得懂 ⇒ 不經驗證就丟掉 pending 不行：保留 pending、不 PUT、讀不懂衝突', async t => {
  const s = await open(t, {owned: true, local: {[KEY]: V(9)}, cloud: {[KEY]: [2, V(3)]}, base: {[KEY]: [1, V(1)]},
    pending: {[KEY]: {baseRev: 1, data: U()}}, accepts: {[KEY]: strict}});
  await s.clock.advance(4000);
  rejected(s, 'T28', {local: V(9), cloud: [2, V(3)], base: [1, V(1)], pending: {baseRev: 1, data: U()}});
  assert.ok(s.seen[KEY].includes(U()), '驗了 pending');
});

test('T29 O 同頁：讀得懂的 pending 送不出去、本機之後改成讀不懂 ⇒ 重送前也驗最新本機：不送、保留 pending、讀不懂衝突', async t => {
  const s = await open(t, {owned: true, local: {[KEY]: V(1)}, cloud: {[KEY]: [1, V(1)]}, base: {[KEY]: [1, V(1)]}, accepts: {[KEY]: strict}});
  s.d.mode = 'reject'; s.storage.setItem(KEY, V(2, 'p')); await s.clock.advance(4000);
  assert.equal(s.puts(), 1, '前提：送過一次（被斷線）'); assert.equal(s.ck().pending.data, V(2, 'p'));
  s.storage.setItem(KEY, U()); s.d.mode = 'ok'; await s.clock.advance(4000); await s.clock.advance(8000);
  assert.equal(s.puts(), 1, '沒有再送'); assert.equal(s.rec().rev, 1);
  assert.equal(s.ck().pending.data, V(2, 'p'), 'pending 保留');
  assert.equal((s.conflict() || {}).reason, 'unreadable');
  assert.doesNotMatch(s.status(), /已同步/);
});

test('T30 N 家長親手留了讀不懂的雲端之後，這台改成讀得懂的新進度 ⇒ 下一次自動上傳不得蓋掉讀不懂的雲端（manual 不延伸）', async t => {
  const s = await open(t, {local: {[KEY]: V(1)}, cloud: {[KEY]: [2, U()]}, base: {[KEY]: [1, V(1)]}, accepts: {[KEY]: strict}});
  assert.equal(await s.d.api.resolve(KEY, 'cloud'), true); await flush();
  assert.equal(s.storage.getItem(KEY), U(), '前提：親手選留雲端');
  s.storage.setItem(KEY, V(9, 'new')); await s.clock.advance(4000);
  assert.equal(s.puts(), 0, '沒有自動上傳'); assert.equal(s.rec().rev, 2); assert.equal(s.rec().data, U());
  assert.equal((s.conflict() || {}).reason, 'unreadable');
  assert.doesNotMatch(s.status(), /已同步/);
});

test('T30b O PUT 讀不懂的 pending 等回應時讀檔變嚴、本機又改成讀得懂 ⇒ confirm 後下一輪不得自動蓋掉剛確認的讀不懂雲端', async t => {
  let lenient = true;
  const s = await open(t, {owned: true, local: {[KEY]: V(1)}, cloud: {[KEY]: [1, V(1)]}, base: {[KEY]: [1, V(1)]},
    accepts: {[KEY]: raw => lenient || strict(raw)}});
  s.d.mode = 'hold'; s.storage.setItem(KEY, U()); await s.clock.advance(4000);
  assert.equal(typeof s.d.held, 'function', '前提：PUT 已送出');
  lenient = false; s.storage.setItem(KEY, V(9, 'new')); s.d.mode = 'ok'; s.d.held(); await flush(); await s.clock.advance(10);
  assert.equal(s.rec().rev, 2, '前提：U 已確認'); assert.equal(s.ck().baseline.hash, H(U()));
  await s.clock.advance(4000); await s.clock.advance(4000);
  assert.equal(s.rec().rev, 2, '沒有自動蓋掉'); assert.equal(s.rec().data, U());
  assert.equal(s.storage.getItem(KEY), V(9, 'new'));
  assert.equal((s.conflict() || {}).reason, 'unreadable');
  assert.doesNotMatch(s.status(), /已同步/);
});

// ---- 沒提供 accepts：維持現行行為（T21–T24）----
for (const [M, owned] of MODES) {
  test(`T21 ${M} 沒有 accepts：L=C 相同字串、B=1、未前進 ⇒ 已同步`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U()}, cloud: {[KEY]: [1, U()]}, base: {[KEY]: [1, U()]}});
    assert.equal(s.storage.getItem(KEY), U()); assert.equal(s.rec().rev, 1);
    assert.equal(s.conflict(), undefined); assert.match(s.status(), /已同步/);
  });
  test(`T22 ${M} 沒有 accepts：空白裝置、雲端是嚴格站會拒絕的那份 ⇒ 照舊下載`, async t => {
    const s = await open(t, {owned, local: {[KEY]: null}, cloud: {[KEY]: [1, U()]}});
    assert.equal(s.storage.getItem(KEY), U()); assert.equal(s.rec().rev, 1);
    assert.equal(s.conflict(), undefined); assert.match(s.status(), /已同步/);
  });
  test(`T23 ${M} 沒有 accepts：本機有、雲端空白 ⇒ 照舊上傳到 rev 1`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U()}, cloud: {}});
    await s.clock.advance(4000);
    assert.equal(s.storage.getItem(KEY), U()); assert.equal(s.rec().rev, 1); assert.equal(s.rec().data, U());
    assert.equal(s.conflict(), undefined); assert.match(s.status(), /已同步/);
  });
  test(`T24 ${M} accepts 只有別的 key：本站 key 與完全沒 accepts 相同，不叫別 key 的 validator`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U()}, cloud: {[KEY]: [1, U()]}, base: {[KEY]: [1, U()]},
      accepts: {[KEY2]: () => { throw new Error('wrong key'); }}});
    assert.equal(s.seen[KEY2].length, 0);
    assert.equal(s.conflict(), undefined); assert.match(s.status(), /已同步/);
    assert.equal(s.rec().rev, 1);
  });
  test(`T25 ${M} 兩個 key：一個 L=C=U、一個 L=C=V（都有 B、未前進）⇒ 只有 U 那格衝突，全站不顯示已同步，各用各的 validator`, async t => {
    const s = await open(t, {owned, keys: [KEY, KEY2], local: {[KEY]: U(), [KEY2]: V(2)},
      cloud: {[KEY]: [1, U()], [KEY2]: [1, V(2)]}, base: {[KEY]: [1, U()], [KEY2]: [1, V(2)]},
      accepts: {[KEY]: strict, [KEY2]: strict}});
    assert.equal((s.conflict(KEY) || {}).reason, 'unreadable');
    assert.equal(s.conflict(KEY2), undefined);
    assert.equal(s.rec(KEY).rev, 1); assert.equal(s.rec(KEY2).rev, 1);
    assert.equal(s.storage.getItem(KEY), U()); assert.equal(s.storage.getItem(KEY2), V(2));
    assert.doesNotMatch(s.status(), /已同步/);
    assert.ok(s.seen[KEY].every(r => r === U()) && s.seen[KEY].length > 0);
    assert.ok(s.seen[KEY2].every(r => r === V(2)) && s.seen[KEY2].length > 0);
  });
  test(`T26 ${M} 讀不懂衝突之後本機修好（9 題）、明確同步重新取得 ⇒ 驗新原文、解除衝突、留修好的本機（rev 2）`, async t => {
    const s = await open(t, {owned, local: {[KEY]: U()}, cloud: {[KEY]: [1, V(2, 'c')]}, accepts: {[KEY]: strict}});
    assert.equal((s.conflict() || {}).reason, 'unreadable', '前提：讀不懂衝突');
    s.storage.setItem(KEY, V(9, 'fix'));
    await s.d.api.sync(true); await flush(); await s.clock.advance(4000);
    assert.ok(s.seen[KEY].includes(V(9, 'fix')), '驗新原文');
    assert.equal(s.conflict(), undefined, '解除');
    assert.equal(s.storage.getItem(KEY), V(9, 'fix'));
    assert.equal(s.rec().rev, 2); assert.equal(s.rec().data, V(9, 'fix'));
    assert.match(s.status(), /已同步/);
  });
}

// ---- 共同斷言第三點：沒提供 accepts 的相容性＝修正前後差分（舊版 bc34bf9 vs 現在），含 manual、pending、autoResolve 關閉、R24 離線重開 ----
const LEGACY = path.join(__dirname, 'fixtures', 'sync.legacy-bc34bf9.js');
async function trace(syncPath, owned, autoResolve) {
  const clock = new Clock(), backend = server(clock), out = [], nav = {onLine: true};
  let drop = 0;
  const fetch = async req => {
    if (!nav.onLine) throw new TypeError('offline');
    const r = backend.handle(req);
    if (req.op === 'put' && drop > 0) { drop -= 1; throw new TypeError('lost'); }
    return {ok: true, json: async () => r};
  };
  const mk = (o = {}) => {
    let d;
    const extra = owned ? {canReplace: () => true, accept: (k, v) => { d.storage.setItem(k, v); return true; }} : {};
    d = device(backend, Object.assign({syncPath, fetch, keys: [KEY], autoResolve, navigator: nav, summarize: {[KEY]: () => 'x'}}, extra, o));
    return d;
  };
  const snap = (label, d) => out.push({label, status: d.api.getState().status, notice: d.api.getState().notice,
    conflicts: d.api.getState().conflicts, storage: d.storage.dump(), calls: d.calls.map(c => [c.req.op, c.req.rev, c.req.data]),
    replaced: d.replacements.slice(), text: descendants(d.doc.container).map(n => n.tagName + ':' + n._text).join('|'),
    banner: d.doc.body.children.map(n => n.textContent).join('|')});
  const a = mk({initial: {[KEY]: V(1, 'a')}}); await a.api.ready; await a.api.enable(); snap('enable', a);
  const code = a.api.getState().code;
  drop = 1; a.storage.setItem(KEY, V(2, 'a')); await clock.advance(4000); snap('lost', a);
  await clock.advance(8000); snap('retry', a);
  a.api.destroy();
  const b = mk({initial: {[KEY]: V(5, 'b')}}); await b.api.ready; await b.api.join(code); await clock.advance(10); snap('join-with-data', b);
  if (b.api.getState().conflicts[KEY]) { await b.api.resolve(KEY, 'local'); snap('resolve-local', b); }
  b.storage.setItem(KEY, 'not json'); await clock.advance(4000); snap('b-odd', b);
  const c = mk({initial: {[KEY]: V(3, 'c')}}); await c.api.ready; await c.api.join(code); await clock.advance(10); snap('c-join', c);
  if (c.api.getState().conflicts[KEY]) { await c.api.resolve(KEY, 'cloud'); snap('c-resolve-cloud', c); }
  c.api.destroy(); nav.onLine = false;
  const c2 = mk({storage: c.storage, autoEnable: true}); await c2.api.ready; await clock.advance(10); snap('offline-reopen', c2);
  nav.onLine = true; await clock.advance(4000); snap('online-again', c2);
  [b, c2].forEach(d => d.api.destroy());
  return out;
}
for (const owned of [false, true]) for (const autoResolve of [true, false]) {
  test(`相容差分 ${owned ? 'O' : 'N'} autoResolve=${autoResolve}：沒有 accepts 時與修正前 bc34bf9 逐步相同（請求、儲存、衝突、通知、文字）`, async () => {
    const norm = x => JSON.parse(JSON.stringify(x));
    const before = norm(await trace(LEGACY, owned, autoResolve)), after = norm(await trace(SYNC, owned, autoResolve));
    assert.equal(after.length, before.length);
    before.forEach((st, i) => assert.deepEqual(after[i], st, '第 ' + (i + 1) + ' 步「' + st.label + '」不同'));
  });
}
