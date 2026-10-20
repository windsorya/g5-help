// 家長傳題目進度條隨時間變化＋預估完成時間（交辦 #1320）。執行：node --test tests/upprogress.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../src/upprogress.js');

const MIN = 60000;
const T0 = Date.UTC(2026, 9, 13, 6, 0, 0);   // 台北 14:00

test('時間一律用台北時間顯示', () => {
  assert.equal(P.hhmm(T0), '14:00');
  assert.equal(P.hhmm(Date.UTC(2026, 9, 13, 16, 5, 0)), '00:05');
});

test('已送出：33%，顯示最晚幾點前電腦會取回（上次取題＋1 分）', () => {
  const v = P.view({ status: 'new', time: T0 }, [], T0 + 30000, T0 + MIN);
  assert.equal(v.pct, 33);
  assert.match(v.text, /最晚 14:02 前/);   // 14:01:30 到期 ⇒ 進位顯示 14:02，不能顯示已過去的 14:01（Codex 審 27b7d84）
});

test('最晚取回時間剛好整分不進位；有秒數一律進位到下一分', () => {
  assert.match(P.view({ status: 'new', time: T0 }, [], T0, T0 + 10000).text, /最晚 14:01 前/);
  assert.match(P.view({ status: 'new', time: T0 }, [], T0 + 1000, T0 + 10000).text, /最晚 14:02 前/);
});

test('電腦健康：未滿 3 分鐘＝正常；滿 3 分鐘＝警告；從沒取過另說（Codex 審 27b7d84：停 10 分鐘還說正常；審 c00ef6a：剛好 3 分鐘仍說正常）', () => {
  assert.equal(P.health(T0, T0 + 3 * MIN - 1000).state, 'ok');
  assert.equal(P.health(T0, T0 + 3 * MIN - 1).state, 'ok');
  assert.equal(P.health(T0, T0 + 3 * MIN).state, 'late');
  assert.equal(P.health(T0, T0 + 3 * MIN).ago, 3);
  assert.equal(P.health(T0, T0 + 3 * MIN + 1000).state, 'late');
  assert.equal(P.health(T0, T0 + 10 * MIN + 29000).state, 'late');
  assert.equal(P.health(T0, T0 + 10 * MIN + 29000).ago, 10);
  for (const x of [0, null, undefined, NaN]) assert.equal(P.health(x, T0).state, 'never');
});

// Codex 審 5367999：電腦從沒取過題目（lastFetch=0）時舊版用「現在＋10 分」，每次打開都往後順延、永遠不會過期。
test('電腦從沒取過題目：不承諾時間（不得用現在時間往後推）', () => {
  [0, null, undefined].forEach((lf) => {
    const v = P.view({ status: 'new', time: T0 }, [], lf, T0 + 60 * MIN);
    assert.equal(v.pct, 33);
    assert.doesNotMatch(v.text, /最晚/);
  });
});

test('已送出但電腦比預期久沒取：不承諾時間', () => {
  const v = P.view({ status: 'new', time: T0 }, [], T0 - 30 * MIN, T0 + MIN);
  assert.equal(v.pct, 33);
  assert.doesNotMatch(v.text, /最晚/);
});

test('製作中：沒有歷史資料先估送出後 40 分；進度依經過時間在 66→95% 間增加', () => {
  const a = P.view({ status: 'fetched', time: T0 }, [], T0, T0 + 10 * MIN);
  const b = P.view({ status: 'fetched', time: T0 }, [], T0, T0 + 30 * MIN);
  assert.ok(a.pct >= 66 && a.pct < b.pct && b.pct <= 95, a.pct + ' → ' + b.pct);
  assert.match(a.text, /預計 14:40 前做好/);
});

test('製作中：用已做好題目的實際耗時中位數估', () => {
  const done = [20, 30, 100].map((m, i) => ({ status: 'done', time: T0 - (i + 1) * 1000 * MIN, doneAt: T0 - (i + 1) * 1000 * MIN + m * MIN }));
  const v = P.view({ status: 'fetched', time: T0 }, done, T0, T0 + 5 * MIN);
  assert.match(v.text, /預計 14:30 前做好/);   // 中位數 30 分
});

test('超過預估還沒好：95% 封頂、改說比預期久', () => {
  const v = P.view({ status: 'fetched', time: T0 }, [], T0, T0 + 90 * MIN);
  assert.equal(v.pct, 95);
  assert.match(v.text, /比預期久/);
  assert.doesNotMatch(v.text, /預計/);
});

test('做好了：100%；舊資料缺時間欄也不壞', () => {
  assert.equal(P.view({ status: 'done', time: T0 }, [], T0, T0).pct, 100);
  const v = P.view({ status: 'fetched' }, [{ status: 'done' }], 0, T0);
  assert.ok(v.pct >= 66 && v.pct <= 95);
  assert.equal(typeof v.text, 'string');
});

test('後端狀態欄：做好時記下完成時間，舊格式 done:網址 仍讀得懂', () => {
  const I = require('../gas/inbox.js');
  assert.deepEqual(I.parseStatus('done:https://windsorya.github.io/g5-help/#h/a'), { status: 'done', url: 'https://windsorya.github.io/g5-help/#h/a', doneAt: 0 });
  assert.deepEqual(I.parseStatus(I.doneCell('https://windsorya.github.io/g5-help/#h/a', 123)), { status: 'done', url: 'https://windsorya.github.io/g5-help/#h/a', doneAt: 123 });
  assert.deepEqual(I.parseStatus('fetched'), { status: 'fetched', url: '', doneAt: 0 });
  assert.deepEqual(I.parseStatus('new'), { status: 'new', url: '', doneAt: 0 });
});
