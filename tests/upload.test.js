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

// ── 4agent 最終方案「(d)-縮」驗收列表 A01–A20（記憶體 VM 版；瀏覽器版見 tests/e2e_upload.py 的 A 列；A21 在 tests/sync.test.js）──
// 報告：~/scripts/state/fouragent_20261013_upload/4A_upload_report.md【最終方案】1–6。
// VM：假 DOM（每個容器各一份）、假 fetch（可扣住、可指定回應；abort 一律無效）、假縮圖（可扣住）、
// 假時鐘（setTimeout／setInterval 與 Date.now 只在 advance 時前進）。G5_UPLOAD_SRC 可指向別份元件（突變自檢用）。
const vm = require('node:vm');
const MOUNT_SRC = fs.readFileSync(process.env.G5_UPLOAD_SRC || path.join(__dirname, '..', 'src', 'upload.js'), 'utf8');
const CA = 'ABCDEFGHJKMN', CB = 'PQRSTUVWXYZ2', PRE = { 國語: '【補題:國語:', 數學: '【補題:數學:' };
const NODE_CLASSES = ['g5u-send', 'g5u-file', 'g5u-note', 'g5u-unit', 'g5u-out', 'g5u-health', 'g5u-wmsg', 'g5u-refresh'];
const D0 = '照片沒有送出；確認後再按一次送出';   // 一張都還沒呼叫 post 時的打斷提示（A09：已送出去過就不能出現這句）

function it(id, status, subject) { return { id, time: 1760000000000, note: (PRE[subject || '國語']) + 'L1】' + id, status: status || 'new' }; }
async function flush() { for (let i = 0; i < 40; i += 1) await new Promise((r) => setImmediate(r)); }

function makeEnv(code) {
  const store = new Map();
  if (code) store.set('g5sync.code', code);
  const env = { reqs: [], db: {}, hold: () => false, once: [], failFrom: Infinity, holdImg: false, imgQ: [],
    now: 1760000000000, timers: new Map(), seq: 1, boxes: {}, listeners: {} };
  env.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); }
  };
  // 別的分頁或 sync.js 寫的同步碼：不經過本頁這個 localStorage 物件的方法（元件只能從事件或輪詢得知）
  env.rawSet = (v) => { if (v === null) store.delete('g5sync.code'); else store.set('g5sync.code', v); };
  const noop = () => {};
  const on = (type, fn) => { (env.listeners[type] ||= new Set()).add(fn); };
  const off = (type, fn) => { if (env.listeners[type]) env.listeners[type].delete(fn); };
  env.fire = (type, ev) => { [...(env.listeners[type] || [])].forEach((fn) => fn(Object.assign({ type }, ev))); };
  env.codeEvent = (oldValue, newValue) => env.fire('g5sync:codechange', { oldValue, newValue });
  env.storageEvent = (oldValue, newValue) => env.fire('storage', { key: 'g5sync.code', oldValue, newValue });
  const setT = (fn, ms, rep) => { const id = env.seq++; env.timers.set(id, { fn, at: env.now + (ms || 0), rep: rep ? ms : 0 }); return id; };
  const clr = (id) => { env.timers.delete(id); };
  env.advance = async (ms) => {
    const end = env.now + ms;
    for (let guard = 0; guard < 10000; guard += 1) {
      let best = null;
      for (const [id, t] of env.timers) if (t.at <= end && (!best || t.at < best[1].at)) best = [id, t];
      if (!best) break;
      env.now = best[1].at;
      if (best[1].rep) best[1].at += best[1].rep; else env.timers.delete(best[0]);
      best[1].fn();
      await flush();
    }
    env.now = end;
    await flush();
  };
  class FakeDate extends Date {
    constructor(...a) { super(...(a.length ? a : [env.now])); }
    static now() { return env.now; }
  }
  function plain() { return { textContent: '', disabled: false, value: '', files: [], classList: { toggle() {} }, onclick: null }; }
  function itemsNode() {
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
  function makeBox() {
    const box = {};
    Object.defineProperty(box, 'innerHTML', {
      set() {
        const nodes = {};
        NODE_CLASSES.forEach((c) => { nodes[c] = plain(); });
        nodes['g5u-items'] = itemsNode();
        nodes['g5u-unit'].value = 'L1';
        box.firstChild = { querySelector: (s) => nodes[s.slice(1)] || null };
        box.nodes = nodes;
      }
    });
    return box;
  }
  function mineResult(b) {
    return { ok: true, items: (env.db[b.code + '|' + b.prefix] || []).filter((x) => x.status !== 'withdrawn').map((x) => Object.assign({}, x)), lastFetch: 0 };
  }
  // 照假伺服器「此刻」的資料回答（撤回、上傳在回答當下才生效）
  env.answer = (r) => {
    const b = r.body;
    if (b.op === 'mine') return r.reply(mineResult(b));
    if (b.op === 'upload') {
      const subj = Object.keys(PRE).find((s) => String(b.note).startsWith(PRE[s]));
      const id = 'up' + (env.ops('upload').indexOf(r) + 1);
      (env.db[b.code + '|' + PRE[subj]] ||= []).unshift(it(id, 'new', subj));
      return r.reply({ ok: true, id });
    }
    if (b.op === 'withdraw') {
      for (const k of Object.keys(env.db)) {
        const x = env.db[k].find((y) => y.id === b.id);
        if (!x) continue;
        if (!k.startsWith(b.code + '|')) return r.reply({ ok: false, err: 'not-found' });
        if (x.status === 'done') return r.reply({ ok: false, err: 'done' });
        x.status = 'withdrawn';
        return r.reply({ ok: true });
      }
      return r.reply({ ok: false, err: 'not-found' });
    }
    return r.reply({ ok: false, err: 'unknown-op' });
  };
  const ctx = {
    localStorage: env.localStorage,
    document: {
      querySelector: (s) => (env.boxes[s] ||= makeBox()), getElementById: () => ({}), head: { appendChild: noop },
      createElement: () => ({ width: 0, height: 0, getContext: () => ({ drawImage: noop }), toDataURL: () => 'data:image/jpeg;base64,AAAA' }),
      addEventListener: on, removeEventListener: off, visibilityState: 'visible'
    },
    addEventListener: on, removeEventListener: off,
    setTimeout: (fn, ms) => setT(fn, ms, false), clearTimeout: clr, setInterval: (fn, ms) => setT(fn, ms, true), clearInterval: clr,
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL: noop },
    AbortController, Promise, JSON, Date: FakeDate, Math, Object, Array, String, RegExp, Error,
    Image: function () {
      const img = this;
      img.width = 10; img.height = 10;
      Object.defineProperty(img, 'src', { set() { const go = () => img.onload(); if (env.holdImg) env.imgQ.push(go); else setImmediate(go); } });
    },
    fetch: (url, opt) => new Promise((res, rej) => {
      // abort 一律無效（設計者 (d)：正確性不能靠 abort）
      const r = { url, body: JSON.parse(opt.body), done: false };
      const settle = (fn) => { if (!r.done) { r.done = true; fn(); } };
      r.reply = (json, status) => settle(() => res({ ok: !status || (status >= 200 && status < 300), status: status || 200, text: () => Promise.resolve(JSON.stringify(json)) }));
      r.raw = (text) => settle(() => res({ ok: true, status: 200, text: () => Promise.resolve(text) }));
      r.fail = () => settle(() => rej(new TypeError('net')));
      r.release = () => (r.snap ? r.reply(r.snap) : env.answer(r));
      env.reqs.push(r);
      if (env.reqs.length > env.failFrom) return r.reply({ ok: false, err: 'server' });
      const k = env.once.findIndex(([c]) => c(r.body));
      if (k >= 0) { const act = env.once.splice(k, 1)[0][1]; return act(r); }
      if (env.hold(r.body)) { if (r.body.op === 'mine') r.snap = mineResult(r.body); return; }   // 扣住的清單查詢：固定扣住當下的快照
      env.answer(r);
    })
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(MOUNT_SRC, ctx);
  env.G = ctx.G5Upload;
  env.mount = (sel = '#box', subject = '國語', endpoint) => ctx.G5Upload.mount(sel, Object.assign(
    { subject, site: subject === '國語' ? 'g5-chinese-review' : 'g5-math-review', units: [{ id: 'L1', name: '第一課' }] }, endpoint ? { endpoint } : {}));
  env.n = (sel = '#box') => env.boxes[sel].nodes;
  env.ops = (op, code) => env.reqs.filter((r) => r.body.op === op && (code === undefined || r.body.code === code));
  env.pending = (op) => env.ops(op).filter((r) => !r.done);
  env.tally = (code, since = 0) => { const rs = env.reqs.slice(since).filter((r) => r.body.code === code); return ['mine', 'upload', 'withdraw'].map((o) => rs.filter((r) => r.body.op === o).length).join('/'); };
  env.html = (sel = '#box') => env.n(sel)['g5u-items'].innerHTML;
  env.ids = (sel = '#box') => (env.html(sel).match(/data-id="[^"]*"/g) || []).map((s) => s.slice(9, -1));
  env.card = (id, sel = '#box') => {
    const h = env.html(sel), i = h.indexOf('data-id="' + id + '"'), j = h.indexOf('g5u-card', i + 1);
    return i < 0 ? null : h.slice(i, j < 0 ? h.length : j);
  };
  env.wdBtns = (sel = '#box') => env.n(sel)['g5u-items']._btn.filter((b) => b.wd);
  env.wd = (id, sel = '#box') => env.wdBtns(sel).find((b) => b.wd === id).onclick();
  env.withdraw = async (id, sel = '#box') => { env.wd(id, sel); env.wd(id, sel); await flush(); };
  env.text = (c, sel = '#box') => env.n(sel)[c].textContent;
  env.refreshBtn = (sel = '#box') => { const b = env.n(sel)['g5u-refresh']; assert.equal(typeof b.onclick, 'function', '沒有「重新整理」鈕'); b.onclick(); };
  env.send = async (files, note, sel = '#box') => {
    const n = env.n(sel);
    n['g5u-file'].files = files.map(() => ({}));
    if (note !== undefined) n['g5u-note'].value = note;
    n['g5u-send'].onclick();
    await flush();
  };
  env.view = (sel = '#box') => {
    const n = env.n(sel);
    return JSON.stringify({ items: env.html(sel), out: n['g5u-out'].textContent, health: n['g5u-health'].textContent, wmsg: n['g5u-wmsg'].textContent,
      note: n['g5u-note'].value, locks: ['g5u-send', 'g5u-file', 'g5u-note', 'g5u-unit'].map((c) => n[c].disabled) });
  };
  return env;
}

test('A01 掛載 A：A:1/0/0、清單是 A 的', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')]; E.db[CB + '|' + PRE.國語] = [it('b1')];
  E.mount(); await flush();
  assert.equal(E.tally(CA), '1/0/0'); assert.equal(E.tally(CB), '0/0/0');
  assert.deepEqual(E.ids(), ['a1']);
});

test('A02 連按「重新整理」三次、回應扣住：只發 1 筆；放行後更新', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')];
  E.mount(); await flush();
  const n0 = E.reqs.length;
  E.db[CA + '|' + PRE.國語].unshift(it('a2'));
  E.hold = (b) => b.op === 'mine';
  E.refreshBtn(); E.refreshBtn(); E.refreshBtn(); await flush();
  assert.equal(E.tally(CA, n0), '1/0/0');
  E.pending('mine').forEach((r) => r.release()); await flush();
  assert.deepEqual(E.ids(), ['a2', 'a1']);
});

test('A03 兩張都回 ok：A:1/2/0、「2 張都送出了」、清空草稿', async () => {
  const E = makeEnv(CA);
  E.mount(); await flush();
  const n0 = E.reqs.length;
  await E.send([1, 2], '草稿');
  assert.equal(E.tally(CA, n0), '1/2/0');
  assert.match(E.text('g5u-out'), /2 張都送出了/);
  assert.equal(E.n()['g5u-note'].value, '');
  assert.deepEqual(E.ids(), ['up2', 'up1']);
});

test('A04 閒置 65 秒：零請求（拿掉 60 秒自動重查；2 秒家庭碼檢查只讀不發）', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')];
  E.mount(); await flush();
  const n0 = E.reqs.length;
  await E.advance(65000);
  assert.equal(E.reqs.length - n0, 0);
});

test('A05 同頁刪碼（不派任何事件）、推進 2.1 秒：零請求、清單空白、提示沒開同步、沒有撤回鈕', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')];
  E.mount(); await flush();
  const n0 = E.reqs.length;
  E.rawSet(null);
  await E.advance(2100);
  assert.equal(E.reqs.length - n0, 0);
  assert.deepEqual(E.ids(), []);
  assert.match(E.text('g5u-health'), /還沒開啟跨裝置同步/);
  assert.equal(E.wdBtns().length, 0);
});

test('A06 沒有任何事件、也沒被輪詢看到的 A→B→A（期間上傳）：視為同一家庭，第二張照送 A、B 零請求；註解寫明此不變量', async () => {
  const E = makeEnv(CA);
  E.mount(); await flush();
  const n0 = E.reqs.length;
  E.hold = (b) => b.op === 'upload' && E.ops('upload').length === 1;
  await E.send([1, 2], '草稿');
  assert.equal(E.pending('upload').length, 1);
  E.rawSet(CB); E.rawSet(CA);   // 例如開發者工具直接改：沒有事件、輪詢也沒跑
  E.hold = () => false;
  E.pending('upload')[0].release(); await flush();
  assert.deepEqual(E.ops('upload').map((r) => r.body.code), [CA, CA]);
  assert.equal(E.tally(CB, n0), '0/0/0');
  assert.match(MOUNT_SRC, /A06/);
});

for (const [label, flip] of [
  ['同頁 sync.js 自訂事件', (E) => { E.rawSet(CB); E.codeEvent(CA, CB); E.rawSet(CA); E.codeEvent(CB, CA); }],
  ['別頁 storage 事件', (E) => { E.rawSet(CB); E.rawSet(CA); E.storageEvent(CA, CB); E.storageEvent(CB, CA); }],
  // 審 0b02f39 第 1 列：別頁 localStorage.clear()（storage 事件 key:null）後又恢復原碼；事件送達時已讀回 A，也算「有事件」
  ['別頁 clear() 後恢復原碼', (E) => { E.rawSet(null); E.rawSet(CA); E.fire('storage', { key: null, oldValue: null, newValue: null }); E.storageEvent(null, CA); }]
]) {
  test(`A07 有事件的 A→B→A（${label}）：在途上傳第二張不送、草稿保留、提示不確定有沒有送到；在途撤回的成功不顯示`, async () => {
    const E = makeEnv(CA);
    E.mount(); await flush();
    E.hold = (b) => b.op === 'upload' && E.ops('upload').length === 1;
    await E.send([1, 2], '草稿');
    assert.equal(E.pending('upload').length, 1);
    flip(E);
    E.hold = () => false;
    E.pending('upload')[0].release(); await flush();
    assert.equal(E.ops('upload').length, 1, '第二張不得送出');
    assert.equal(E.n()['g5u-note'].value, '草稿');
    assert.match(E.text('g5u-out'), /不確定有沒有送到/);

    const W = makeEnv(CA);
    W.db[CA + '|' + PRE.國語] = [it('x'), it('w')];
    W.mount(); await flush();
    W.hold = (b) => b.op === 'withdraw';
    await W.withdraw('x');
    assert.equal(W.pending('withdraw').length, 1);
    flip(W);
    W.hold = () => false;
    W.pending('withdraw')[0].release(); await flush();
    assert.doesNotMatch(W.text('g5u-wmsg'), /撤回了/);
    assert.ok(W.wdBtns().every((b) => !b.disabled));
  });
}

test('A08 第一張回 no-family、第二張縮圖時換 B：A:0/1/0、B:1/0/0、B 的清單、提示不確定、草稿保留', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')]; E.db[CB + '|' + PRE.國語] = [it('b1')];
  E.mount(); await flush();
  const n0 = E.reqs.length;
  E.hold = (b) => b.op === 'upload';
  await E.send([1, 2], '草稿');
  E.holdImg = true;
  E.pending('upload')[0].reply({ ok: false, err: 'no-family' }); await flush();
  assert.equal(E.imgQ.length, 1);
  E.localStorage.setItem('g5sync.code', CB);
  await E.advance(2100);
  assert.equal(E.tally(CA, n0), '0/1/0'); assert.equal(E.tally(CB, n0), '1/0/0');
  assert.deepEqual(E.ids(), ['b1']);
  assert.match(E.text('g5u-out'), /不確定有沒有送到/);
  assert.equal(E.n()['g5u-note'].value, '草稿');
  E.holdImg = false; E.imgQ.splice(0).forEach((f) => f()); await flush();
  assert.equal(E.ops('upload').length, 1);
});

test('A09 第一張回應遺失（伺服器其實存了）、第二張縮圖時換 B：同 A08，且不得出現「照片沒有送出」', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')]; E.db[CB + '|' + PRE.國語] = [it('b1')];
  E.mount(); await flush();
  const n0 = E.reqs.length;
  E.hold = (b) => b.op === 'upload';
  await E.send([1, 2], '草稿');
  E.holdImg = true;
  const r = E.pending('upload')[0];
  E.db[CA + '|' + PRE.國語].unshift(it('up1'));   // 伺服器存了
  r.fail(); await flush();
  assert.equal(E.imgQ.length, 1);
  E.localStorage.setItem('g5sync.code', CB);
  await E.advance(2100);
  assert.equal(E.tally(CA, n0), '0/1/0'); assert.equal(E.tally(CB, n0), '1/0/0');
  const out = E.text('g5u-out');
  assert.match(out, /不確定有沒有送到/, out);
  assert.ok(!out.includes(D0), out);
  assert.equal(E.n()['g5u-note'].value, '草稿');
});

// 審 0b02f39 第 2 列：同一批裡有 no-family、也有回應遺失的照片：不能只叫人「按一次同步再送」（整批重送會讓那張留兩筆）
test('A09b 第一張回 no-family、第二張回應遺失（伺服器其實存了）：提示同時講同步與「不確定有沒有送到、不要直接重送」，草稿保留', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')];
  E.mount(); await flush();
  E.hold = (b) => b.op === 'upload';
  await E.send([1, 2], '草稿');
  E.pending('upload')[0].reply({ ok: false, err: 'no-family' }); await flush();
  E.db[CA + '|' + PRE.國語].unshift(it('up2'));   // 伺服器存了第二張
  E.pending('upload')[0].fail(); await flush();
  const out = E.text('g5u-out');
  assert.match(out, /同步/, out);
  assert.match(out, /不確定有沒有送到/, out);
  assert.match(out, /不要直接重送/, out);
  assert.equal(E.n()['g5u-note'].value, '草稿');
});

test('A09c 整批都回 no-family：只講先按一次同步再送（不多出不確定提示）', async () => {
  const E = makeEnv(CA);
  E.mount(); await flush();
  E.hold = (b) => b.op === 'upload';
  await E.send([1, 2], '草稿');
  E.pending('upload')[0].reply({ ok: false, err: 'no-family' }); await flush();
  E.pending('upload')[0].reply({ ok: false, err: 'no-family' }); await flush();
  const out = E.text('g5u-out');
  assert.match(out, /按一次同步再送/, out);
  assert.doesNotMatch(out, /不確定/, out);
});

test('A10 同頁國語＋數學、別頁換 B 一次、兩筆都回成功、之後一律失敗：B:2/0/0、各自是本科的 B、沒有第 3 筆', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('a1')]; E.db[CA + '|' + PRE.數學] = [it('m1', 'new', '數學')];
  E.db[CB + '|' + PRE.國語] = [it('b1')]; E.db[CB + '|' + PRE.數學] = [it('bm1', 'new', '數學')];
  E.mount('#box1', '國語'); E.mount('#box2', '數學'); await flush();
  const n0 = E.reqs.length;
  E.failFrom = n0 + 2;
  E.rawSet(CB); E.storageEvent(CA, CB); await flush();
  await E.advance(2100); await E.advance(2100);
  assert.equal(E.tally(CB, n0), '2/0/0');
  assert.equal(E.reqs.length - n0, 2);
  assert.deepEqual(E.ids('#box1'), ['b1']); assert.deepEqual(E.ids('#box2'), ['bm1']);
});

test('A11 撤回前的查詢扣住 → 撤回回 done → 放行舊查詢 → 新查詢回 done：撤回後新增 mine＝1、做好了、沒有撤回鈕', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('x'), it('w')];
  const h = E.mount(); await flush();
  E.hold = (b) => b.op === 'mine';
  h.reload(); await flush();
  const old = E.pending('mine')[0];
  E.hold = () => false;
  E.db[CA + '|' + PRE.國語][0].status = 'done';
  const n = E.ops('mine').length;
  await E.withdraw('x');
  assert.equal(E.ops('mine').length - n, 1);
  old.release(); await flush();
  assert.deepEqual(E.ids(), ['x', 'w']);
  assert.match(E.card('x'), /做好了/); assert.doesNotMatch(E.card('x'), /data-wd="x"/);
  assert.match(E.text('g5u-wmsg'), /已經做好了/);
});

test('A12 撤回 ok、重查扣住時再放行舊查詢：重查回來前清單空白＋「更新中」；舊查詢不採用；最終 [w]', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('x'), it('w')];
  const h = E.mount(); await flush();
  E.hold = (b) => b.op === 'mine';
  h.reload(); await flush();
  const old = E.pending('mine')[0];
  await E.withdraw('x');
  assert.match(E.text('g5u-wmsg'), /撤回了/);
  assert.deepEqual(E.ids(), []); assert.match(E.html(), /更新中/);
  old.release(); await flush();
  assert.deepEqual(E.ids(), []); assert.match(E.html(), /更新中/);
  const again = E.pending('mine');
  assert.equal(again.length, 1);
  again[0].release(); await flush();
  assert.deepEqual(E.ids(), ['w']);
});

for (const [end, act, want] of [
  ['not-found', (r) => r.reply({ ok: false, err: 'not-found' }), /找不到/],
  ['fail', (r) => r.reply({ ok: false, err: 'server' }), /沒有撤回成功/],
  ['網路失敗', (r) => r.fail(), /還沒確認/],
  ['逾 90 秒後成功才到', null, /還沒確認/]
]) {
  test(`A13 撤回 ${end}：提示正確、清單先空白再依重查、沒有第二筆撤回、晚到的回應不改畫面`, async () => {
    const E = makeEnv(CA);
    E.db[CA + '|' + PRE.國語] = [it('x'), it('w')];
    E.mount(); await flush();
    let late = null;
    if (act) E.once.push([(b) => b.op === 'withdraw', act]);
    else E.once.push([(b) => b.op === 'withdraw', (r) => { late = r; }]);
    E.hold = (b) => b.op === 'mine';
    await E.withdraw('x');
    if (!act) await E.advance(90500);
    assert.match(E.text('g5u-wmsg'), want);
    assert.deepEqual(E.ids(), []); assert.match(E.html(), /更新中/);
    const q = E.pending('mine');
    assert.equal(q.length, 1);
    q[0].release(); await flush();
    assert.deepEqual(E.ids(), ['x', 'w']);
    assert.equal(E.ops('withdraw').length, 1);
    if (late) {
      const v = E.view();
      E.db[CA + '|' + PRE.國語][0].status = 'withdrawn';
      late.reply({ ok: true }); await flush();
      assert.equal(E.view(), v);
    }
  });
}

test('A14 撤回在途時舊清單抵達＋reload()：撤回鈕全部停用，硬點別題也只有 1 筆撤回 POST', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('x'), it('y')];
  const h = E.mount(); await flush();
  E.hold = (b) => b.op === 'mine' || b.op === 'withdraw';
  h.reload(); await flush();
  const old = E.pending('mine')[0];
  await E.withdraw('x');
  old.release(); await flush();
  h.reload(); await flush();
  assert.ok(E.wdBtns().length > 0 && E.wdBtns().every((b) => b.disabled), JSON.stringify(E.wdBtns()));
  E.wd('y'); E.wd('y'); await flush();
  assert.equal(E.ops('withdraw').length, 1);
});

test('A15 撤回後重查失敗：「進度暫時讀不到」，不顯示「還沒有補過題目」', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('x')];
  E.mount(); await flush();
  E.once.push([(b) => b.op === 'mine', (r) => r.reply({ ok: false, err: 'server' })]);
  await E.withdraw('x');
  assert.match(E.text('g5u-health'), /進度暫時讀不到/);
  assert.doesNotMatch(E.html(), /還沒有補過題目/);
  assert.deepEqual(E.ids(), []);
});

for (const [label, act] of [
  ['HTTP 500＋ok:true', (r) => r.reply({ ok: true, items: [it('q')] }, 500)],
  ['非法 JSON', (r) => r.raw('<html>Error</html>')],
  ['ok:false', (r) => r.reply({ ok: false, err: 'server' })],
  ['items:null', (r) => r.reply({ ok: true, items: null })]
]) {
  test(`A16 mine 回 ${label}：保留原清單、提示讀不到`, async () => {
    const E = makeEnv(CA);
    E.db[CA + '|' + PRE.國語] = [it('x'), it('y')];
    const h = E.mount(); await flush();
    E.once.push([(b) => b.op === 'mine', act]);
    h.reload(); await flush();
    assert.deepEqual(E.ids(), ['x', 'y']);
    assert.match(E.text('g5u-health'), /讀不到/);
  });
}

for (const [label, act] of [['HTTP 500', (r) => r.reply({ ok: true, id: 'z' }, 500)], ['非法 JSON', (r) => r.raw('<html>Error</html>')]]) {
  test(`A17 upload 回 ${label}：已呼叫 post 就講不確定、不講沒有送出；保留草稿`, async () => {
    const E = makeEnv(CA);
    E.mount(); await flush();
    E.once.push([(b) => b.op === 'upload', act], [(b) => b.op === 'upload', act]);
    await E.send([1, 2], '草稿');
    const out = E.text('g5u-out');
    assert.match(out, /不確定有沒有送到/, out);
    assert.doesNotMatch(out, /沒有送出/, out);
    assert.equal(E.n()['g5u-note'].value, '草稿');
  });
}

test('A18 同容器重掛：舊 handle 的 reload／stop、放行舊縮圖／舊 post／舊撤回 ⇒ 舊實例零請求，新實例畫面、草稿、鎖、提示不變', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('x'), it('y')];
  const h1 = E.mount('#box', '國語', 'OLD'); await flush();
  E.hold = (b) => b.op === 'withdraw' || b.op === 'upload';
  await E.withdraw('x');
  await E.send([1, 2, 3], '舊草稿');           // 第一張 post 扣住
  E.hold = () => false;
  E.mount('#box', '國語', 'NEW'); await flush();
  E.n()['g5u-note'].value = '新草稿';
  const v0 = E.view(), oldN = E.reqs.filter((r) => r.url === 'OLD').length;
  h1.reload(); h1.stop(); h1.reload();
  E.pending('withdraw').concat(E.pending('upload')).forEach((r) => r.release()); await flush();
  await E.advance(2100);
  assert.equal(E.reqs.filter((r) => r.url === 'OLD').length, oldN);
  assert.equal(E.view(), v0);
});

test('A19 同頁兩元件：國語撤回，數學閒置 ⇒ 數學零請求、畫面不變', async () => {
  const E = makeEnv(CA);
  E.db[CA + '|' + PRE.國語] = [it('x')]; E.db[CA + '|' + PRE.數學] = [it('m1', 'new', '數學')];
  E.mount('#box1', '國語'); E.mount('#box2', '數學'); await flush();
  const v2 = E.view('#box2'), n0 = E.reqs.length;
  await E.withdraw('x', '#box1');
  await E.advance(2100);
  assert.equal(E.reqs.slice(n0).filter((r) => r.body.prefix === PRE.數學).length, 0);
  assert.equal(E.view('#box2'), v2);
});

test('A20 沒有家庭碼時按送出、重新整理：零請求、提示開啟或加入同步', async () => {
  const E = makeEnv(null);
  E.mount(); await flush();
  await E.send([1], '草稿');
  E.refreshBtn(); await flush();
  assert.equal(E.reqs.length, 0);
  assert.match(E.text('g5u-out'), /開啟或加入同步/);
  assert.match(E.text('g5u-health'), /開啟或加入同步/);
});

test('A07 契約：upload.js 聽的事件名＝sync.js 派的事件名（g5sync:codechange，帶 oldValue／newValue）', () => {
  const sync = fs.readFileSync(path.join(__dirname, '..', 'src', 'sync.js'), 'utf8');
  assert.equal(U.CODE_EVENT, 'g5sync:codechange');
  assert.ok(sync.includes("'g5sync:codechange'"));
  assert.match(sync, /\.oldValue = /); assert.match(sync, /\.newValue = /);
});

test('上傳被打斷的提示（分派版）：一張都還沒送出去才說「照片沒有送出」；送出去過就說不確定、不提張數、不叫人直接重送', () => {
  assert.match(U.interruptMessage(0), new RegExp(D0));
  [1, 3].forEach((d) => {
    const m = U.interruptMessage(d);
    assert.ok(!m.includes(D0), m);
    assert.match(m, /不確定有沒有送到/); assert.match(m, /不要直接重送/);
    assert.doesNotMatch(m, /\d 張|下面/);
  });
});

test('正常送完的訊息：伺服器明確拒絕＝沒有送出；網路／HTTP／解析錯誤＝不確定（不寫成沒有送出）', () => {
  assert.match(U.sendSummary(2, [true, true]), /2 張都送出了/);
  const unsure = U.sendSummary(2, [null, null]);
  assert.match(unsure, /不確定有沒有送到/); assert.doesNotMatch(unsure, /沒有送出|都送出了/);
  const mix = U.sendSummary(3, [true, false, null]);
  assert.match(mix, /送出 1 張/); assert.match(mix, /第 2 張沒有送出/); assert.match(mix, /第 3 張不確定有沒有送到/);
  assert.match(U.sendSummary(2, [false, false]), /沒有送出/);
});
