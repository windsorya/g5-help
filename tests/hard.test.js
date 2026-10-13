// 難題清單（src/hard.js）：每一篇欄位齊全、答案對得上；新增一篇沒填好這裡就會紅。
// 執行：node --test tests/hard.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const H = require("../src/hard.js");
const F = require("../src/frac.js");

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;   // 介面禁 emoji

function checkChoice(c, where) {
  assert.ok(Array.isArray(c.opts) && c.opts.length >= 2, where + " 至少兩個選項");
  assert.ok(Number.isInteger(c.a) && c.a >= 0 && c.a < c.opts.length, where + " 正確答案的位置要在選項範圍內");
  assert.equal(new Set(c.opts).size, c.opts.length, where + " 選項不能重複");
  if (c.why) assert.equal(c.why.length, c.opts.length, where + " why 要一個選項一句");
}

test("每一篇：id 唯一、科目與格式合法、日期與出處齊全、沒有 emoji", () => {
  const ids = new Set();
  assert.ok(H.LIST.length >= 1);
  H.LIST.forEach((e) => {
    assert.match(e.id, /^[\w-]+$/);
    assert.ok(!["constructor", "__proto__", "prototype", "hasOwnProperty", "toString", "valueOf"].includes(e.id), e.id + " 不能用物件內建屬性名當 id（Codex 2026-10-13 必修 5）");
    assert.ok(!ids.has(e.id), "重複 id " + e.id);
    ids.add(e.id);
    assert.ok(H.SUBJECTS.includes(e.subject), e.id + " 科目要是 " + H.SUBJECTS.join("、"));
    assert.ok(H.KINDS.includes(e.kind), e.id + " 格式要是 " + H.KINDS.join("、"));
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(e.source && e.title, e.id + " 要有出處與標題");
    assert.ok(!EMOJI.test(JSON.stringify(e)), e.id + " 不能有 emoji");
    (e.videos || []).forEach((v) => {
      assert.match(v.id, /^[\w-]{11}$/);
      assert.ok(v.start >= 0 && (!v.end || v.end > v.start));
    });
    if (e.kind === "frac-compare") {
      [e.a, e.b].forEach((f) => assert.ok(Number.isInteger(f.n) && Number.isInteger(f.d) && f.n > 0 && f.d > 0));
      if (e.prior) assert.ok(e.prior.q && e.prior.ok && e.prior.hint);
    }
    // 比照自然科的設計（律師 2026-10-11「白話、圖多、附影片」；2026-10-13 問「難題解說也有秉持嗎」——板根那篇漏圖漏影片）
    assert.ok((e.videos || []).length >= 1 || (typeof e.noVideoReason === "string" && e.noVideoReason.length >= 20),
      e.id + " 要附驗證過的影片；真的找不到要在 noVideoReason 寫找過哪些、為何不合格");
    if (e.kind === "steps") {
      assert.ok(e.question && e.answer, e.id + " 要有題目與答案");
      assert.ok(Array.isArray(e.steps) && e.steps.length >= 1);
      e.steps.forEach((s, i) => {
        assert.ok(s.title && s.say);
        assert.ok(typeof s.fig === "string" && s.fig.trim().startsWith("<svg") && /aria-label="[^"]{4,}"/.test(s.fig), e.id + " 第 " + (i + 1) + " 步要配一張圖（一格一圖一句話），且要有 aria-label");
        if (s.check) checkChoice(s.check, e.id + " 第 " + (i + 1) + " 步");
      });
      (e.practice || []).forEach((q, i) => { assert.ok(q.q); checkChoice(q, e.id + " 練習 " + (i + 1)); });
    }
  });
});

test("第 1 篇：習作 p.38 第 6 題② 28/42 □ 27/45，答案是 >", () => {
  const e = H.get("p38-6-2");
  assert.equal(e.subject, "數學");
  assert.equal(F.cmp(e.a, e.b), ">");
  assert.deepEqual(F.solve(e.a, e.b).sa, { n: 2, d: 3 });
  assert.deepEqual(F.solve(e.a, e.b).sb, { n: 3, d: 5 });
  assert.equal(H.get("沒有這篇"), null);
});

test("測試用題目只在頁面先放 __G5_HARD_FIXTURE__ 時才併入（正式頁不會出現）", () => {
  const src = fs.readFileSync(path.join(__dirname, "../src/hard.js"), "utf8");
  const fix = { id: "t1", date: "2026-10-13", subject: "國語", kind: "steps", source: "測試", title: "測試題" };
  const withFix = { __G5_HARD_FIXTURE__: [fix] };
  vm.runInNewContext(src, { window: withFix });
  assert.equal(withFix.G5Hard.LIST.length, H.LIST.length + 1);
  assert.equal(withFix.G5Hard.get("t1").title, "測試題");
  const plain = {};
  vm.runInNewContext(src, { window: plain });
  assert.equal(plain.G5Hard.LIST.length, H.LIST.length);
});
