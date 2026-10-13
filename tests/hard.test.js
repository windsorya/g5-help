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

test("白話程度跟著年級：今天的年級、每一篇每一句都不超過該年級的句長上限", () => {
  assert.equal(H.gradeAt(new Date("2026-10-13T12:00:00+08:00")), 5);
  assert.equal(H.gradeAt(new Date("2027-07-31T12:00:00+08:00")), 5);
  assert.equal(H.gradeAt(new Date("2027-08-01T12:00:00+08:00")), 6);
  const lim = H.readingAt(new Date()).maxSentence;
  const strip = (x) => String(x || "").replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, "");
  H.LIST.filter((e) => e.kind === "steps").forEach((e) => {
    const texts = [e.lead, e.answer].concat(e.steps.map((s) => s.say), e.steps.map((s) => s.check && s.check.ok), (e.practice || []).map((q) => q.q));
    texts.forEach((t) => strip(t).split(/[。！？\n]|<br>/).forEach((sen) => {
      assert.ok(sen.trim().length <= lim, e.id + " 有一句超過" + H.readingAt(new Date()).label + "句長上限 " + lim + " 字：" + sen.trim());
    }));
  });
});

// 用詞難度（交辦 #1319，2026-10-13 律師問「只檢查句長、用詞靠我注意，這機制合理嗎」）：
// 句長只是代理指標；看不懂多半卡在詞。三道：①難詞第一次出現就要附白話（本測試）②第二個模型依年級審過（readReview）
// ③孩子按「這步看不懂」的真實回饋（app.html → GAS Inbox）。①擋得住「已知的難詞」，擋不住沒列進表的詞 ⇒ 靠②③補。
// 括號裡要真的有白話：「板根（）」不算（Codex 審 5367999）。
// 設計 D・B2（#1347 第 4 輪起）：主閘改成真瀏覽器採字（tests/kidgate.js＋tests/e2e_kidtext.py），這裡讀它的結果（tests/kidtext_harvest.json；
// 不是這一版 index.html 量的就紅）。舊版用原始碼 regex 重建畫面，三輪審查證明它猜錯分支、量不到 frac.js 回傳字與拼接後全句、漏標題與 SVG 字。
// 靜態部分（tests/kidtext.js）只剩輔助：欄位、詞表、案例完整性。
const KT = require("./kidtext.js");
const KG = require("./kidgate.js");

test("難詞第一次出現就要附白話；每篇都要有第二個模型的年級閱讀審查紀錄", () => {
  assert.deepEqual(KT.wordTableProblems(), [], "欄位與詞表");
  // readReview 從 #1319（2026-10-13）起才規定；之前上線的篇（p38-6-2，10-12）不追溯，下次改寫那篇時補。
  H.LIST.forEach((e) => {
    const r = e.readReview;
    if (e.date >= "2026-10-13") assert.ok(r && typeof r.by === "string" && r.by && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.grade === H.gradeAt(new Date(r.date + "T12:00:00+08:00")) && Array.isArray(r.fixed),
      e.id + " 要有 readReview {by: 審查模型, date, grade: 當天年級, fixed: [依審查改了哪些詞句]}——上線前請第二個模型依年級列出看不懂的詞句");
  });
  // 主閘：Chromium、WebKit 實際操作每個入口與分支後採到的字，用詞違規＋未歸類的可見文字都要是 0，案例與分支都要走到、自檢都要過
  assert.deepEqual(KT.harvestProblems(["word", "unclassified"]), []);
});

test("用詞閘自檢：判準本身（node 端同一份 kidgate.js）＋案例完整性的來源都對得上", () => {
  const g = (t, w) => KG.glossed(t, w, t.indexOf(w));
  assert.equal(g("先弄清楚板根（）。", "板根"), false, "空括號不算附白話");
  assert.equal(g("先弄清楚板根（　）。", "板根"), false, "全形空白也不算");
  assert.equal(g("板根（突出地面的根）", "板根"), true);
  assert.equal(g("像三角形的翅膀（翼狀）", "翼狀"), true);
  assert.equal(g("所以叫「板根」", "板根"), true);
  const v = KG.evaluate([{text: "先看光合作用", cat: "kid", unit: "lesson"}, {text: "光合作用（植物用陽光做養分）", cat: "kid", unit: "lesson"}], ["光合作用"]);
  assert.ok(v.some((x) => x.kind === "word"), "後面的解釋不能替前面第一次出現的詞解釋");
  // 畫面上教學在練習上方（教學做完按「換你自己做」）：DOM 順序也是教學在前
  assert.ok(KG.evaluate([{text: "蒸散（水變成水蒸氣）", cat: "kid", unit: "lesson"}, {text: "練習第 1 題", cat: "kid", unit: "practice"}, {text: "蒸散是什麼？", cat: "kid", unit: "practice"}], ["蒸散"])
    .some((x) => x.kind === "word" && x.unit === "practice"), "練習題不能借用教學的解釋");
  assert.ok(KG.evaluate([{text: "新加的字", cat: "unknown", unit: "unknown"}], []).some((x) => x.kind === "unclassified"));
  require("./kidcontract.js").remind("回饋分支提醒（appBranchProblems；設計 D 降級為提醒，不擋件）", KT.appBranchProblems());
  const src = fs.readFileSync(path.join(__dirname, "../src/app.html"), "utf8");
  const sect = src.slice(src.indexOf("// ---------- 互動元件"), src.indexOf("// ---------- 首頁按鈕"));
  // 比加這一行前後的差異（現行內容本身的提醒不影響，Codex 審 d4c6e4f）
  assert.ok(KT.appBranchProblems(sect + '\n    if (v === 99) return {ok:false, msg:"新加的回饋"};\n').length > KT.appBranchProblems(sect).length, "新加一個回饋字串、沒有對應案例 ⇒ 要紅");
  const more = JSON.parse(JSON.stringify(H.LIST)), bg = more.find((e) => e.id === "sci-q5-bangen");
  bg.practice.push({q: "新的一題？", opts: ["甲", "乙"], a: 0, why: ["", "不是乙。"]});
  const miss = KT.harvestProblems(["word"], {list: more});
  assert.ok(miss.some((p) => p.includes("沒有走到案例 sci-q5-bangen:resume4")) && miss.some((p) => p.includes("沒有走到分支 sci-q5-bangen:prac5:1")), "新增一題練習卻沒有實際走到 ⇒ 要紅");
  assert.deepEqual(KT.requiredCases().filter((c) => /^sci-q5-bangen:(resume\d|direct|lesson|mastery|video)$/.test(c)).sort(),
    ["sci-q5-bangen:direct", "sci-q5-bangen:lesson", "sci-q5-bangen:mastery", "sci-q5-bangen:resume0", "sci-q5-bangen:resume1", "sci-q5-bangen:resume2", "sci-q5-bangen:resume3", "sci-q5-bangen:video"], "每一題都要有重開續練的獨立入口");
  const tmp = path.join(require("os").tmpdir(), "g5help-stale-index-" + process.pid + ".html");
  fs.writeFileSync(tmp, fs.readFileSync(path.join(__dirname, "../index.html"), "utf8") + "<!-- changed -->");
  try { assert.ok(KT.harvestProblems(["word"], {indexPath: tmp}).some((p) => /過期/.test(p)), "index.html 改過、沒重跑採字 ⇒ 要紅"); } finally { fs.unlinkSync(tmp); }
  assert.ok(KT.fracBranches().includes("checkCommon:ok-not-lcm") && KT.fracBranches().includes("checkReduce:unequal-div"), "frac.js 判題代碼要推得出分支");
});
