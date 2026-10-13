// 家長傳題目後端（gas/inbox.js）。執行：node --test tests/inbox.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const I = require('../gas/inbox.js');

function store(families) {
  const rows = []; let token = null;
  return {
    rows, hash: (c) => 'h-' + c, familyExists: (h) => families.includes(h),
    addUpload: (u) => rows.push({ cells: I.toCells(u), status: 'new' }),
    listNew: () => rows.filter((r) => r.status === 'new').map((r) => I.fromCells(r.cells)),
    markFetched: (id) => { const r = rows.find((x) => x.cells[0] === id); if (!r) return false; r.status = 'fetched'; return true; },
    getToken: () => token, setToken: (t) => { token = t; }
  };
}
const CODE = 'ABCDEFGHJKMN', IMG = 'data:image/jpeg;base64,' + 'A'.repeat(100000), TOK = 'x'.repeat(32);
const now = () => 1791868607799;

test('上傳：只收已開同步的家庭碼；科目、說明、圖片格式與大小都檢查', () => {
  const s = store(['h-' + CODE]);
  const ok = I.handleInbox(s, { op: 'upload', code: CODE, subject: '數學', note: '第 6 題②', image: IMG }, now);
  assert.equal(ok.ok, true);
  assert.equal(I.handleInbox(s, { op: 'upload', code: 'ZZZZZZZZZZZZ', subject: '數學', note: '', image: IMG }, now).err, 'no-family');
  assert.equal(I.handleInbox(s, { op: 'upload', code: 'abc', subject: '數學', note: '', image: IMG }, now).err, 'bad-code');
  assert.equal(I.handleInbox(s, { op: 'upload', code: CODE, subject: '體育', note: '', image: IMG }, now).err, 'bad-subject');
  assert.equal(I.handleInbox(s, { op: 'upload', code: CODE, subject: '數學', note: 'x'.repeat(501), image: IMG }, now).err, 'bad-note');
  assert.equal(I.handleInbox(s, { op: 'upload', code: CODE, subject: '數學', note: '', image: '<script>' }, now).err, 'bad-image');
  assert.equal(I.handleInbox(s, { op: 'upload', code: CODE, subject: '數學', note: '', image: 'data:image/jpeg;base64,' + 'A'.repeat(I.MAX_IMAGE) }, now).err, 'too-big');
  assert.equal(s.rows.length, 1);
});

test('照片切塊存、讀回一模一樣；每格不超過試算表上限；說明加前綴防公式', () => {
  const u = { id: 'u1', time: 1, subject: '國語', note: '=HYPERLINK("x")', codeHash: 'h', image: IMG };
  const cells = I.toCells(u);
  assert.ok(cells.every((c) => String(c).length <= I.CHUNK + 1));
  assert.ok(String(cells[3]).startsWith('~'));
  const back = I.fromCells(cells);
  assert.equal(back.image, IMG); assert.equal(back.note, u.note); assert.equal(back.subject, '國語');
});

test('取題目：第一次設定 token，之後只認同一個；ack 後不再出現', () => {
  const s = store(['h-' + CODE]);
  const up = I.handleInbox(s, { op: 'upload', code: CODE, subject: '自然', note: 'n', image: IMG }, now);
  assert.equal(I.handleInbox(s, { op: 'inbox', token: 'short' }, now).err, 'bad-token');
  const first = I.handleInbox(s, { op: 'inbox', token: TOK }, now);
  assert.equal(first.items.length, 1); assert.equal(first.items[0].image, IMG);
  assert.equal(I.handleInbox(s, { op: 'inbox', token: 'y'.repeat(32) }, now).err, 'bad-token');
  assert.equal(I.handleInbox(s, { op: 'ack', token: TOK, id: up.id }, now).ok, true);
  assert.equal(I.handleInbox(s, { op: 'inbox', token: TOK }, now).items.length, 0);
  assert.equal(I.handleInbox(s, { op: 'get', code: CODE, key: 'g5help.v1' }, now), null, '其他請求交回同步核心');
});
