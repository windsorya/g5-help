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
