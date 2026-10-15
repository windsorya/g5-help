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
const DOC = require("../src/helpdoc.js");

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
    // 刪除標記存成 hidden 的 "_del_"+id（src/helpdoc.js）：篇 id 最長 55 字、不得以 _del_ 開頭（Codex 審 6dd8b14）
    assert.ok(DOC.postIdOk(e.id), e.id + " 篇 id 要 1–55 字、只用英數底線連字號、不得以 _del_ 開頭");
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
  // 只看新加的那一行有沒有被點名，與現行內容的提醒脫鉤（Codex 審 d4c6e4f、2ac79de）
  assert.ok(KT.appBranchProblems(sect + '\n    if (v === 99) return {ok:false, msg:"測新加回饋丁"};\n').some((p) => p.includes("測新加回饋丁")), "新加一個回饋字串、沒有對應案例 ⇒ 要點名");
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

// ── 快篩（2026-10-15 交辦 #2259 復盤）：新增一篇時先跑 `node --test --test-name-pattern=快篩 tests/hard.test.js`，1 秒內抓出內容錯，
// 不必等兩個瀏覽器採字跑完才發現（p40-2-5 那次：首頁那行 46 字、影片標題的「假分數」沒附白話，都是採字 5 分鐘後才看到，又整套重跑）。
// 這裡只是快篩；主閘仍是真瀏覽器採字（tests/e2e_kidtext.py）。
test("快篩：首頁卡片那一行（出處・重點・日期）每句不超過句長上限", () => {
  const lim = H.readingAt(new Date()).maxSentence, problems = [];
  H.LIST.forEach((e) => {
    const line = e.source + (e.tag ? "・" + e.tag : "") + "・" + e.date.slice(5).replace("-", "/");   // 同 src/app.html 首頁卡片 meta
    KG.sentences(line).forEach((s) => { if (KG.countChars(s) > lim) problems.push(e.id + " 首頁卡片那一行 " + KG.countChars(s) + " 字（上限 " + lim + "）：" + s + "——縮短 source 或 tag"); });
  });
  assert.deepEqual(problems, []);
});

test("快篩：影片標題與說明裡的難詞要在同一段附白話（影片區可以不看教學直接打開）", () => {
  const lim = H.readingAt(new Date()).maxSentence, problems = [];
  H.LIST.forEach((e) => {
    // 開場白（lead）在影片區上方、一進頁就看得到：lead 已附白話的詞，主閘不會判影片區違規（板根那篇就是），快篩不比主閘嚴
    const lead = String(e.lead || "");
    const words = Object.keys(H.HARD_WORDS).concat(Object.keys(e.words || {})).filter((w) => !(lead.includes(w) && KG.glossed(lead, w, lead.indexOf(w))));
    // 影片區照畫面順序（每段：標題、說明）接成一串；同主閘，只看每個難詞在影片區「第一次出現」有沒有附白話
    const seq = (e.videos || []).map((v) => String(v.title || "") + "\n" + String(v.note || "")).join("\n");
    words.forEach((w) => {
      const at = seq.indexOf(w);
      if (at >= 0 && !KG.glossed(seq, w, at)) problems.push(e.id + " 影片區第一次出現的「" + w + "」沒附白話（或換成白話）：" + seq.slice(Math.max(0, at - 12), at + 20).replace(/\n/g, " ／ "));
    });
    KG.sentences(seq).forEach((s) => { if (KG.countChars(s) > lim) problems.push(e.id + " 影片文字超過句長上限：" + s); });
  });
  assert.deepEqual(problems, []);
});

test("快篩：數學題的答案與每一題比大小，用 frac.js 再算一次", () => {
  const two = (s) => { const m = String(s).match(/(\d+)\/(\d+)\D+?(\d+)\/(\d+)/); return m ? [{ n: +m[1], d: +m[2] }, { n: +m[3], d: +m[4] }] : null; };
  const judge = (q, where) => {
    const f = two(q.q); if (!f) return;
    const sign = F.cmp(f[0], f[1]), txt = f.map(F.txt);
    if (q.opts.every((o) => [">", "<", "="].includes(o))) assert.equal(q.opts[q.a], sign, where + "：" + q.q + " 應填 " + sign);
    else if (/哪一個比較大/.test(q.q) && q.opts.length === 2 && q.opts.every((o) => txt.includes(o))) assert.equal(q.opts[q.a], sign === ">" ? txt[0] : txt[1], where + "：" + q.q);
  };
  H.LIST.filter((e) => e.subject === "數學" && e.kind === "steps").forEach((e) => {
    const f = two(e.question);
    if (f && /□/.test(e.question)) assert.ok(String(e.answer).includes(F.cmp(f[0], f[1])), e.id + " 答案和 frac.js 算的不一樣");
    e.steps.forEach((s, i) => s.check && judge(s.check, e.id + " 第 " + (i + 1) + " 步"));
    (e.practice || []).forEach((q, i) => judge(q, e.id + " 練習 " + (i + 1)));
  });
  // 判準自檢：答案故意弄反要抓得到（兩種題型各一）
  const bad = JSON.parse(JSON.stringify(H.get("p40-2-5")));
  bad.practice[2].a = 0; bad.practice[1].a = 0;
  assert.throws(() => judge(bad.practice[2], "自檢 >< 題"));
  assert.throws(() => judge(bad.practice[1], "自檢 哪一個比較大"));
});

// Opus 審 p40-2-5（2026-10-15）抓到：10 組比較全部是「數字大的反而小」，只學會「選數字小的」也能 6/6 全對；4 題確認題的正解又全是第一個選項
// （前端不打亂選項）。這種事 Sonnet 與 Codex 都沒抓到，所以改成機器檢查，不靠審稿模型夠不夠強。
test("快篩：作答不能用同一個表面捷徑全部答對（一律選第一個；比大小一律選數字小的或數字大的）", () => {
  const two = (s) => { const m = String(s).match(/(\d+)\/(\d+)\D+?(\d+)\/(\d+)/); return m ? [{ n: +m[1], d: +m[2] }, { n: +m[3], d: +m[4] }] : null; };
  const shortcutProblems = (list) => {
    const problems = [];
    list.filter((e) => e.kind === "steps").forEach((e) => {
      const checks = e.steps.filter((s) => s.check).map((s) => s.check), items = checks.concat(e.practice || []);
      [["確認題", checks], ["練習題", e.practice || []]].forEach(([name, g]) => {
        if (g.length >= 3 && g.every((q) => q.a === 0)) problems.push(e.id + "：" + name + "的正解全是第一個選項（前端不打亂選項）");
      });
      if (e.subject !== "數學") return;
      // 比大小題：數字比較小的那一個（分子分母都不比較大、至少一個比較小）是不是比較大；分子分母一大一小的題，兩種捷徑都不適用
      const le = (x, y) => x.n <= y.n && x.d <= y.d && (x.n < y.n || x.d < y.d);
      const sides = items.map((q) => {
        const f = two(q.q); if (!f) return null;
        const small = le(f[0], f[1]) ? 0 : le(f[1], f[0]) ? 1 : null;
        const sign = F.cmp(f[0], f[1]); if (sign === "=") return null;
        return { small: small, larger: sign === ">" ? 0 : 1 };
      }).filter(Boolean);
      if (sides.length >= 3 && sides.every((x) => x.small !== null && x.larger === x.small)) problems.push(e.id + "：每一題比大小都是「數字小的比較大」，只學會「選數字小的」也能全對——加一題數字大的比較大");
      if (sides.length >= 3 && sides.every((x) => x.small !== null && x.larger !== x.small)) problems.push(e.id + "：每一題比大小都是「數字大的比較大」，只學會「選數字大的」也能全對");
    });
    return problems;
  };
  assert.deepEqual(shortcutProblems(H.LIST), []);
  // 判準自檢：上線版（b3daf54）的 p40-2-5 兩種毛病都要抓到
  const old = JSON.parse(JSON.stringify(H.get("p40-2-5")));
  old.steps.forEach((s) => { if (s.check) { s.check.opts = [s.check.opts[s.check.a]].concat(s.check.opts.filter((_, i) => i !== s.check.a)); s.check.a = 0; } });
  old.practice = old.practice.filter((q) => !/53\/50|13\/10/.test(q.q));
  const got = shortcutProblems([old]);
  assert.ok(got.some((p) => /確認題的正解全是第一個選項/.test(p)) && got.some((p) => /數字小的比較大/.test(p)), "上線版的兩種毛病都要抓到：" + got.join("；"));
  assert.ok(!got.some((p) => /練習題的正解全是第一個/.test(p)), "練習題正解位置有錯開，不該誤報");
});

test("審稿模型不得比原設計弱：2026-10-15 起 readReview.by 只能是 codex 或 claude-opus", () => {
  // 律師 2026-10-15：「為何複審模型反而變弱？」——Codex 額度用完時我改派 Sonnet 審稿。Codex 不能用就用 Opus，不得降級。
  const STRONG = ["codex", "claude-opus"];
  H.LIST.filter((e) => e.date >= "2026-10-15").forEach((e) => assert.ok(e.readReview && STRONG.includes(e.readReview.by), e.id + " 的 readReview.by 是 " + (e.readReview && e.readReview.by) + "，要用 " + STRONG.join(" 或 ")));
});
