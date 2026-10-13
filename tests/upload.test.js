// 各科目站的「補題區」共用元件（交辦 #1618，律師 2026-10-13：「這樣是否需要在各科目欄位內加上補題區？」）。
// 執行：node --test tests/upload.test.js（純函式；畫面與送出流程由 tests/e2e_upload.py 在瀏覽器裡測）
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
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
