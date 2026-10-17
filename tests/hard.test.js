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
      // practiceAlt（第 2 輪起換數字的同型題，#2270）：每一套題數要和 practice 一樣，前端才能一題換一題
      (e.practiceAlt || []).forEach((set, j) => {
        assert.ok(Array.isArray(set) && set.length === (e.practice || []).length, e.id + " practiceAlt 第 " + (j + 1) + " 套要和 practice 一樣是 " + (e.practice || []).length + " 題");
        set.forEach((q, i) => { assert.ok(q.q); checkChoice(q, e.id + " 換數字第 " + (j + 1) + " 套第 " + (i + 1) + " 題"); });
      });
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
    H.practiceAll(e).forEach((q, i) => judge(q, e.id + " 練習（出題順序）第 " + (i + 1) + " 題"));   // 含 practiceAlt
  });
  // 判準自檢：答案故意弄反要抓得到（兩種題型各一）
  const bad = JSON.parse(JSON.stringify(H.get("p40-2-5")));
  bad.practice[2].a = 0; bad.practice[1].a = 0;
  assert.throws(() => judge(bad.practice[2], "自檢 >< 題"));
  assert.throws(() => judge(bad.practice[1], "自檢 哪一個比較大"));
});

// Opus 審 p40-2-5（2026-10-15）兩輪抓到：①10 組比較全是「數字大的反而小」，只學會「選數字小的」就全對；②我補的對照題又讓
// 「都多 1 就選小的、其他選大的」「多出來的分子大的比較大」全對；確認題正解又全是第一個（前端不打亂選項）。Sonnet、Codex 都沒抓到。
// 判準照「學會」的定義：練習照順序輪流出（app.html list[st.idx % n]）、連續 min(3,n) 題第一次就對＝學會，
// 所以任何一段連續 min(3,n) 題（含繞回開頭）都不能被同一個錯規則全部答對——錯規則學會了也拿得到「學會」，這篇就沒教到。
const SHORTCUTS = (() => {
  const two = (s) => { const m = String(s).match(/(\d+)\/(\d+)\D+?(\d+)\/(\d+)/); return m ? [{ n: +m[1], d: +m[2] }, { n: +m[3], d: +m[4] }] : null; };
  const le = (x, y) => x.n <= y.n && x.d <= y.d && (x.n < y.n || x.d < y.d);   // 分子分母都不比較大、至少一個比較小
  const smaller = (f) => le(f[0], f[1]) ? 0 : le(f[1], f[0]) ? 1 : null;
  const plusOne = (x) => x.n - x.d === 1;
  const extra = (x) => [Math.floor(x.n / x.d), x.n % x.d];                       // 帶分數的整數與多出來的分子
  const mult = (f) => f[0].d % f[1].d === 0 || f[1].d % f[0].d === 0;               // 分母成倍數＝只要擴一邊就能通分
  const correct = (f) => { const c = F.cmp(f[0], f[1]); return c === ">" ? 0 : c === "<" ? 1 : null; };
  // 每條錯規則：pick 給兩個分數、回它會選哪一個（0／1），不適用回 null（＝這題用它答不出來）；
  // valid（選填）＝這一題它用的其實是正確算法——全段都是正確算法答對的，不算錯規則拿到「學會」（Opus 審 41b02fe 的判準）
  const rules = {
    "選數字大的": { pick: (f) => { const s = smaller(f); return s === null ? null : 1 - s; } },
    "選數字小的": { pick: (f) => smaller(f) },
    "都只多 1 就選數字小的、其他選數字大的": { pick: (f) => { const s = smaller(f); return s === null ? null : (plusOne(f[0]) && plusOne(f[1]) ? s : 1 - s); } },
    "多出來的分子大的比較大": { pick: (f) => { const a = extra(f[0]), b = extra(f[1]); return a[0] !== b[0] ? (a[0] > b[0] ? 0 : 1) : a[1] !== b[1] ? (a[1] > b[1] ? 0 : 1) : smaller(f); } },
    // 以下兩條是 Opus 審 41b02fe 第 2 輪抓到的（第 2 輪只有 B 型的分母成倍數）
    "分母成倍數就選數字大的、不成倍數就選數字小的": { pick: (f) => { const s = smaller(f); return s === null ? null : (mult(f) ? 1 - s : s); } },
    "兩邊分母都要換時只比多出來那塊的分母（分母小的比較大）": {
      pick: (f) => { if (mult(f)) return correct(f); const a = extra(f[0]), b = extra(f[1]); if (a[0] !== b[0] || a[1] === b[1]) return correct(f); return f[0].d < f[1].d ? 0 : f[1].d < f[0].d ? 1 : null; },
      valid: (f) => { if (mult(f)) return true; const a = extra(f[0]), b = extra(f[1]); return a[0] !== b[0] || a[1] === b[1]; } },
    // 以下兩條是 Opus 複核 0d5cf8e 另測的（#2274）：只在「一個只多 1、另一個多更多」時用，都只多 1 時她用的是正確算法
    "另一個多出來 2 份就選只多 1 的、3 份以上就選它": {
      pick: (f) => { const p0 = plusOne(f[0]), p1 = plusOne(f[1]); if (p0 && p1) return correct(f); if (p0 === p1) return null; const o = p0 ? 1 : 0, e = extra(f[o])[1]; return e === 2 ? 1 - o : e >= 3 ? o : null; },
      valid: (f) => plusOne(f[0]) && plusOne(f[1]) },
    "數字大的那個分母是兩位數就輸、個位數就贏": {
      pick: (f) => { if (plusOne(f[0]) && plusOne(f[1])) return correct(f); const s = smaller(f); if (s === null) return null; const big = 1 - s; return f[big].d >= 10 ? s : big; },
      valid: (f) => plusOne(f[0]) && plusOne(f[1]) }
  };
  // 會「跟一半比」（1 又 1/2 對上別的，用正確估算）、其他題照錯規則答：Opus 審第 3 套抓到——C 型都是 3/2 時這種孩子連對 3 題（#2274）
  const halfPick = (f) => { const a = extra(f[0]), b = extra(f[1]); if (a[0] !== b[0]) return null; const h0 = 2 * a[1] === f[0].d, h1 = 2 * b[1] === f[1].d; return h0 === h1 ? null : correct(f); };
  [["跟一半比＋都只多 1 就選數字小的、其他選數字大的", "都只多 1 就選數字小的、其他選數字大的"], ["跟一半比＋多出來的分子大的比較大", "多出來的分子大的比較大"]].forEach(([name, base]) => {
    const b = rules[base];
    rules[name] = { pick: (f) => { const h = halfPick(f); return h !== null ? h : b.pick(f); }, valid: (f) => halfPick(f) !== null };
  });
  // 這一題用某條規則答，會不會答對（題目不是兩個分數比大小 ⇒ 數學規則不適用＝答不對）
  const rightBy = (q, pick) => {
    const f = two(q.q); if (!f || F.cmp(f[0], f[1]) === "=") return false;
    const k = pick(f); if (k === null) return false;
    const ans = q.opts.every((o) => [">", "<", "="].includes(o)) ? (k === 0 ? ">" : "<") : F.txt(f[k]);
    return q.opts[q.a] === ans;
  };
  return function problems(list) {
    const out = [];
    list.filter((e) => e.kind === "steps").forEach((e) => {
      const checks = e.steps.filter((s) => s.check).map((s) => s.check), prac = e.practice || [];
      if (checks.length >= 3 && checks.every((q) => q.a === 0)) out.push(e.id + "：確認題的正解全是第一個選項（前端不打亂選項）");
      const n = prac.length, w = Math.min(3, n), alts = e.practiceAlt || [];
      if (!n) return;
      // 照前端實際出題順序（H.practiceAt）：第 1 輪 practice，第 2 輪起輪流出 practiceAlt（沒有就重複 practice）。
      // 一路排到「最後一套接回第一套換數字題」，所有連續 w 題的段落都檢查到（含第 1 輪接第 2 輪的交界）
      const seq = Array.from({ length: n * (alts.length + 2) }, (_, i) => H.practiceAt(e, i));
      // ok＝這題用它答會對；bogus＝這題靠的是錯的推理（全段都對、而且至少一題是靠錯推理碰對的，才算錯規則拿到學會）
      // 位置猜法也看上一題的正解（孩子答完就看得到）：Codex 審 41b02fe 用「選上一題正解的另一邊」在第 12～14 題拿到學會（#2274）
      const two2 = (q) => q.opts.length === 2;
      const all = { "一律選第一個": { ok: (q) => q.a === 0, bogus: () => true }, "一律選第二個": { ok: (q) => q.a === 1, bogus: () => true },
        "跟上一題正解同一邊": { ok: (q, i) => i > 0 && q.a === seq[i - 1].a, bogus: () => true },
        "跟上一題正解換到另一邊": { ok: (q, i) => i > 0 && two2(q) && two2(seq[i - 1]) && q.a === 1 - seq[i - 1].a, bogus: () => true } };
      if (e.subject === "數學") Object.keys(rules).forEach((name) => {
        const r = rules[name];
        all[name] = { ok: (q) => rightBy(q, r.pick), bogus: (q) => { const f = two(q.q); return !r.valid || !f || !r.valid(f); } };
      });
      Object.keys(all).forEach((name) => {
        for (let s = 0; s + w <= seq.length; s++) {
          const win = seq.slice(s, s + w);
          if (win.every((q, j) => all[name].ok(q, s + j)) && win.some((q) => all[name].bogus(q))) { out.push(e.id + "：出題順序第 " + (s + 1) + "–" + (s + w) + " 題連續答對只靠「" + name + "」就做得到"); break; }
        }
      });
    });
    return out;
  };
})();

test("快篩：作答不能用同一個表面捷徑拿到「學會」（一律選第一或第二個；比大小的四種錯規則）", () => {
  assert.deepEqual(SHORTCUTS(H.LIST), []);
  // 判準自檢：上過線的兩版 p40-2-5 練習題（b3daf54、0bea6d9），都要被抓到
  const v = (practice, checksA) => { const e = JSON.parse(JSON.stringify(H.get("p40-2-5"))); e.practice = practice; e.practiceAlt = []; if (checksA) e.steps.forEach((s) => { if (s.check) { s.check.opts = [s.check.opts[s.check.a]].concat(s.check.opts.filter((_, i) => i !== s.check.a)); s.check.a = 0; } }); return e; };
  const q = (t, opts, a) => ({ q: t, opts: opts, a: a, why: opts.map(() => "") });
  const b3 = [q("11/10 和 13/12，哪一個比較大？", ["11/10", "13/12"], 0), q("8/7 和 6/5，哪一個比較大？", ["8/7", "6/5"], 1), q("21/20 □ 16/15，□ 要填什麼？", [">", "<"], 1), q("4/3 和 9/8，哪一個比較大？", ["4/3", "9/8"], 0)];
  const got1 = SHORTCUTS([v(b3, true)]);
  assert.ok(got1.some((p) => /確認題的正解全是第一個/.test(p)) && got1.some((p) => /「選數字小的」/.test(p)), "b3daf54 版要抓到：" + got1.join("；"));
  const bea = [b3[0], q("26/25 和 53/50，哪一個比較大？", ["26/25", "53/50"], 1), b3[1], b3[2], q("6/5 和 13/10，哪一個比較大？", ["6/5", "13/10"], 1), b3[3]];
  const got2 = SHORTCUTS([v(bea, false)]);
  assert.ok(got2.some((p) => /都只多 1 就選數字小的/.test(p)) && got2.some((p) => /多出來的分子大的比較大/.test(p)) && !got2.some((p) => /「選數字小的」/.test(p)), "0bea6d9 版要抓到 Opus 第 2 輪那兩條、且不再是「選數字小的」：" + got2.join("；"));
  // 第 2 輪（practiceAlt）也要檢查到：換數字那套若全是「數字小的比較大」，第 1 輪再好也要紅，而且紅在第 7 題之後
  const bad = JSON.parse(JSON.stringify(H.get("p40-2-5"))); bad.practiceAlt = [b3.concat(b3.slice(0, 2))];
  const got3 = SHORTCUTS([bad]);
  assert.ok(got3.some((p) => /出題順序第 (\d+)–\d+ 題.*「選數字小的」/.test(p) && +p.match(/出題順序第 (\d+)/)[1] >= 5), "換數字那套壞掉要在第 2 輪抓到：" + got3.join("；"));
  assert.deepEqual(SHORTCUTS([H.get("p40-2-5")]), [], "現行 p40-2-5（含換數字那套）不該被抓");
  // 41b02fe 上線版的換數字那套（B 型分母成倍數）：Opus 抓到的兩條錯規則都要在第 2 輪抓到
  const v41 = JSON.parse(JSON.stringify(H.get("p40-2-5")));
  v41.practiceAlt[0][1] = q("12/11 和 25/22，哪一個比較大？", ["12/11", "25/22"], 1);
  v41.practiceAlt[0][4] = q("3/2 和 17/10，哪一個比較大？", ["17/10", "3/2"], 0);
  const got4 = SHORTCUTS([v41]);
  assert.ok(got4.some((p) => /分母成倍數就選數字大的/.test(p)) && got4.some((p) => /只比多出來那塊的分母/.test(p)), "41b02fe 版要抓到 Opus 那兩條：" + got4.join("；"));
  // 0d5cf8e 上線版：只有一套換數字題、B 型是 4/3 和 11/8、5/4 和 10/7——T、D'' 兩條要在第 2 輪抓到（#2274）
  const v0d = JSON.parse(JSON.stringify(H.get("p40-2-5")));
  v0d.practiceAlt = [v0d.practiceAlt[0].slice()];
  v0d.practiceAlt[0][1] = q("4/3 和 11/8，哪一個比較大？", ["4/3", "11/8"], 1);
  v0d.practiceAlt[0][4] = q("5/4 和 10/7，哪一個比較大？", ["10/7", "5/4"], 0);
  const got5 = SHORTCUTS([v0d]);
  assert.ok(got5.some((p) => /3 份以上就選它/.test(p)) && got5.some((p) => /分母是兩位數就輸/.test(p)), "0d5cf8e 版要抓到 T、D''：" + got5.join("；"));
  assert.ok(got5.some((p) => /第 12–14 題.*跟上一題正解換到另一邊/.test(p)), "0d5cf8e 版要抓到 Codex 那個「選上一題正解的另一邊」（第 12–14 題）：" + got5.join("；"));
  // efa05fe 版第 3 套：C 型兩題都是 3/2——「跟一半比」組合規則要在第 3 套抓到（Opus 審，#2274）
  const vef = JSON.parse(JSON.stringify(H.get("p40-2-5")));
  vef.practiceAlt[1][2] = q("3/2 和 10/7，哪一個比較大？", ["3/2", "10/7"], 0);
  vef.practiceAlt[1][5] = q("3/2 和 13/9，哪一個比較大？", ["3/2", "13/9"], 0);
  const got6 = SHORTCUTS([vef]);
  assert.ok(got6.some((p) => /跟一半比＋都只多 1/.test(p)) && got6.some((p) => /跟一半比＋多出來的分子/.test(p)), "efa05fe 版第 3 套要抓到「跟一半比」組合：" + got6.join("；"));
});

// 選項全是整數的練習題（角度等）：Codex 審 q6-1-angle-x 3 輪、每輪抓到新猜法不收斂，改用 Codex 設計者封版的 230 條（tests/numshortcuts.js，#2528）
const NS = require("./numshortcuts.js");
test("快篩：選項是整數的練習題，不能靠 230 條固定猜法連對 3 題", () => {
  assert.equal(NS.STRATEGIES.length, 230, "矩陣封版：增減要先跟審稿者重訂");
  assert.deepEqual(NS.problems(H.LIST), []);
  // 判準自檢：第 3 輪被 Codex 判 FAIL 的那版（「小於 90 裡選最大」連對 6 題）要被抓到；分數題不套用
  const r3 = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "q6_practice_codex_r3_fail.json"), "utf8"));
  const got = NS.problems([Object.assign({}, H.get("q6-1-angle-x"), { practice: r3.practice, practiceAlt: r3.practiceAlt })]);
  assert.ok(got.some((p) => /「小於 90」裡選最大/.test(p)), "第 3 輪 FAIL 版要抓到 Codex 指出的猜法：" + got.slice(0, 3).join("；"));
  assert.ok(!NS.isNumeric(H.get("p40-2-5").practice[0]), "分數題（11/10）不套這份矩陣，照 SHORTCUTS");
});
// 角度題練習的找數字程式（tools/practice_search.js）：搜得到、搜到的兩套 230 條全擋、答案對、why 只有正解留白（重開機曾把暫存區的版本清掉，#2528）
test("找數字程式：角度題兩套練習搜得到，且 230 條猜法連對不了 3 題", () => {
  const PS = require("../tools/practice_search.js");
  let t = Date.now();
  const out = PS.search(20000);
  assert.ok(Date.now() - t < 21000, "說好最多 20 秒就不能超過");
  assert.ok(out && out.practice.length === 6 && out.practiceAlt[0].length === 6, "20 秒內要搜到兩套各 6 題");
  // 期限每一步都看（Codex 審 fb632f3：舊版只在重來時看時間，一輪 3,000 步跑完才停）：讓它永遠找不到解、每看一次時間假裝過 5 毫秒，
  // 給 300 毫秒 ⇒ 約 60 步就要收手、回 null
  const realNow = Date.now, realProblems = NS.problems;
  let fake = realNow(), steps = 0;
  Date.now = () => (fake += 5);
  NS.problems = () => { steps++; return ["永遠不合格"]; };
  try { assert.equal(PS.search(300), null); assert.ok(steps < 200, "期限 300 毫秒卻走了 " + steps + " 步"); } finally { Date.now = realNow; NS.problems = realProblems; }
  assert.deepEqual(NS.problems([{ id: "search", kind: "steps", steps: [], practice: out.practice, practiceAlt: out.practiceAlt }]), []);
  out.practice.concat(out.practiceAlt[0]).forEach((q) => {
    const n = (q.q.match(/\d+/g) || []).map(Number);
    const r = /三個角/.test(q.q) ? 180 - n[0] - n[1] : /三角形疊/.test(q.q) ? 180 - n[0] : /直角/.test(q.q) ? 90 - n[0] : 180 - n[0];
    assert.equal(parseInt(q.opts[q.a], 10), r, q.q);
    q.why.forEach((w, i) => assert.equal(w === "", i === q.a, q.q + " 第 " + (i + 1) + " 個選項的 why"));
  });
});

test("審稿模型不得比原設計弱：2026-10-15 起 readReview.by 只能是 codex 或 claude-opus", () => {
  // 律師 2026-10-15：「為何複審模型反而變弱？」——Codex 額度用完時我改派 Sonnet 審稿。Codex 不能用就用 Opus，不得降級。
  const STRONG = ["codex", "claude-opus"];
  H.LIST.filter((e) => e.date >= "2026-10-15").forEach((e) => assert.ok(e.readReview && STRONG.includes(e.readReview.by), e.id + " 的 readReview.by 是 " + (e.readReview && e.readReview.by) + "，要用 " + STRONG.join(" 或 ")));
});

// ---------- 看過答案（交辦 #2282；Codex 審 556db59 FAIL 兩項）：驗收矩陣 S1–S5 ----------
const LEG_EFA = require("./fixtures/hard.legacy-efa05fe.js");   // git show efa05fe:src/hard.js（題目身分依位置的那一版）
const LEG_556 = require("./fixtures/hard.legacy-556db59.js");   // git show 669fd69:src/hard.js（＝556db59 的題目內容）
const P = H.get("p40-2-5");
const need3 = 3;
// efa05fe 的計分（從 app.html 原樣搬來，只用來證明測試真的會抓到 Codex 的反例）
function oldScore(e, st, wrongs, Hx) {
  const clean = wrongs === 0, key = Hx.practiceKey(e, st.idx);
  const seen = !!(e.practiceAlt || []).length && st.log.some((l) => l && l.clean === false && Hx.practiceKey(e, l.q) === key);
  const counts = clean && !seen;
  st.solved++; if (counts) { st.clean++; st.streak++; } else st.streak = 0;
  st.idx++; st.cur = null;
  if (st.streak >= need3) st.mastered = true;
  st.log.push({ t: 1, q: st.idx - 1, clean, wrongs }); st.log = st.log.slice(-100);
}
function drill(score) {   // Codex 的反例：前 18 題各錯一次再改對，之後全部照記住的答案一次選對，做到第 117 題
  const st = DOC.fresh();
  let t = 1000;
  for (let i = 0; i < 117; i++) {
    const w = i < H.practiceAll(P).length ? 1 : 0;
    if (w) H.notePeek(P, st, st.idx, t);
    score(st, w, t++);
  }
  return st;
}

test("S1 117 題記憶：log 被截到 100 筆後，看過答案的題仍不算進連續答對", () => {
  const n = H.practiceAll(P).length;
  assert.equal(n, 18, "p40-2-5 題庫應是 18 題（practice＋兩套換數字題）");
  const st = drill((s, w, t) => H.scoreChoice(P, s, w, need3, t));
  assert.equal(st.log.length, 100);
  assert.equal(Object.keys(st.peek).length, 18, "18 題都記成看過答案");
  assert.equal(st.streak, 0);
  assert.equal(st.mastered, false, "照記憶作答不能拿到學會");
  // 自我檢查：同一段操作用 efa05fe 的推法，要重現 Codex 的反例（第 117 題 mastered=true、streak=3）
  const old = DOC.fresh();
  for (let i = 0; i < 117; i++) oldScore(P, old, i < n ? 1 : 0, LEG_EFA);
  assert.equal(old.mastered, true, "efa05fe 的推法應重現反例，否則本測試沒有鑑別力");
  assert.equal(old.streak, 3);
});

test("S2 改版換題不誤判：efa05fe 舊題的錯答不套到內容不同的新題", () => {
  const oldE = LEG_EFA.get("p40-2-5"), oldQ = LEG_EFA.practiceAt(oldE, 14), newQ = H.practiceAt(P, 14);
  assert.match(newQ.q, /5\/4.*17\/14|17\/14.*5\/4/, "第 15 題現在是 5/4 和 17/14");
  assert.notEqual(H.practiceId(oldQ), H.practiceId(newQ), "內容不同的題鍵要不同");
  const st = DOC.fresh(); st.peek = { [H.practiceId(oldQ)]: 1 };
  assert.equal(H.shownBefore(P, st, 14), false, "peek 裡舊題的鍵不套到新題");
  const st2 = DOC.fresh(); st2.log = [{ t: 0, q: 14, clean: false, wrongs: 1 }];
  assert.equal(H.shownBefore(P, st2, 14), false, "沒有 k 的舊 log（依位置記的）不拿來判斷");
  // 對照：efa05fe 的位置推法會把它誤判成看過答案（Codex 的反例）
  assert.equal(LEG_EFA.practiceKey(P, 14), LEG_EFA.practiceKey(oldE, 14));
});

test("S2a 題目鍵規則：同篇不重複；改解說、調換選項、換錯誤選項鍵不變；改數字或正解鍵改變", () => {
  H.LIST.forEach((e) => {
    const ks = H.practiceAll(e).filter((q) => q && q.opts).map(H.practiceId);
    assert.equal(new Set(ks).size, ks.length, e.id + " 同一篇裡兩題的鍵相同（內容重複的題？）");
    ks.forEach((k) => assert.match(k, /^k[0-9a-f]{14}$/));
  });
  const q = H.practiceAt(P, 0), k = H.practiceId(q);
  const sw = { ...q, opts: q.opts.slice().reverse(), a: q.opts.length - 1 - q.a };
  assert.equal(H.practiceId(sw), k, "調換選項順序");
  assert.equal(H.practiceId({ ...q, why: ["x", "y", "z"], ok: "改過的解說" }), k, "改解說");
  const other = q.opts.map((o, i) => (i === q.a ? o : o + "（換）"));
  assert.equal(H.practiceId({ ...q, opts: other }), k, "換錯誤選項");
  assert.equal(H.practiceId({ ...q, q: "<b>" + q.q + "</b> " }), k, "HTML 標籤、空白不影響");
  assert.notEqual(H.practiceId({ ...q, q: q.q.replace(/\d/, (d) => String((+d + 1) % 10)) }), k, "改數字＝新題");
  const opts2 = q.opts.slice(); opts2[q.a] = opts2[q.a] + "!x";
  assert.notEqual(H.practiceId({ ...q, opts: opts2 }), k, "改正解文字＝新題");
});

test("S2a' 題目鍵快照：鍵變了要人工確認是合理換題（tests/fixtures/practice_keys.json）", () => {
  const snapPath = path.join(__dirname, "fixtures", "practice_keys.json");
  const now = {};
  H.LIST.forEach((e) => { if ((e.practiceAlt || []).length) now[e.id] = H.practiceAll(e).map(H.practiceId); });
  const snap = JSON.parse(fs.readFileSync(snapPath, "utf8"));
  assert.deepEqual(now, snap, "題目鍵和快照不同：若是刻意換題，舊題的看過紀錄不再套用是預期的，跑 node tools/practice_keys.js 更新快照");
});

test("S2b 改版但內容沒變的題，看過紀錄照樣保留", () => {
  const oldE = LEG_EFA.get("p40-2-5"), newE = LEG_556.get("p40-2-5");
  const same = [];
  for (let i = 0; i < 18; i++) if (H.practiceId(LEG_EFA.practiceAt(oldE, i)) === H.practiceId(H.practiceAt(newE, i))) same.push(i);
  assert.ok(same.length >= 3, "efa05fe→556db59 應至少有 3 題沒變（實際 " + same.length + "）");
  const st = DOC.fresh(); st.peek = {};
  same.forEach((i) => { st.peek[H.practiceId(LEG_EFA.practiceAt(oldE, i))] = 1; });
  same.forEach((i) => assert.equal(H.shownBefore(P, st, i), true, "第 " + (i + 1) + " 題內容沒變，看過紀錄要保留"));
});

test("S5 沒有換數字題的篇不受影響：不記 peek、log 不帶 k、重來的題照算", () => {
  const plainE = H.LIST.find((e) => (e.practice || []).length && !(e.practiceAlt || []).length);
  assert.ok(plainE, "清單裡至少要有一篇沒有 practiceAlt 的篇");
  const st = DOC.fresh();
  assert.equal(H.notePeek(plainE, st, 0, 5), false);
  H.scoreChoice(plainE, st, 1, need3, 5);
  assert.equal(st.peek, undefined);
  assert.equal("k" in st.log[0], false);
  st.idx = (plainE.practice || []).length;   // 第 2 輪第 1 題（同一題再出現）
  const r = H.scoreChoice(plainE, st, 0, need3, 6);
  assert.equal(r.counts, true, "沒有新題可換的篇，重來的題答對照算");
});

test("S6 notePeek 上界：超過 PEEK_MAX 丟最舊的", () => {
  const st = DOC.fresh(); st.peek = {};
  for (let i = 0; i < H.PEEK_MAX; i++) st.peek["k" + i.toString(16).padStart(14, "0")] = 10 + i;
  assert.equal(H.notePeek(P, st, 0, 99999), true);
  assert.equal(Object.keys(st.peek).length, H.PEEK_MAX);
  assert.equal(("k" + "0".repeat(14)) in st.peek, false, "最舊那筆被丟");
  assert.equal(H.practiceId(H.practiceAt(P, 0)) in st.peek, true);
});

test("S7 之後還會再出的換數字題都看過答案＝學不會，才提示（allSeen，交辦 #2288；Opus 第 2 輪審 4fc56af）", () => {
  const altKeys = [].concat(...P.practiceAlt).map(H.practiceId), firstKeys = P.practice.map(H.practiceId);
  const st = DOC.fresh(); st.peek = {};
  altKeys.slice(0, -1).forEach((k) => { st.peek[k] = 1; });
  assert.equal(H.allSeen(P, st), false, "還有一題換數字題沒看過答案");
  st.log = [{ t: 1, q: 17, clean: false, wrongs: 1, k: altKeys[altKeys.length - 1] }];
  assert.equal(H.allSeen(P, st), true, "最後一題只記在 log 的 k 也算；第 1 輪那 6 題不看（之後不會再出）");
  assert.equal(firstKeys.some((k) => k in st.peek), false, "前提：第 1 輪的題一題都沒看過答案");
  const plainE = H.LIST.find((e) => (e.practice || []).length && !(e.practiceAlt || []).length);
  assert.equal(H.allSeen(plainE, { peek: {}, log: [] }), false, "沒有換數字題的篇不提示");
  // Opus 的反例：第 1 輪 6 題錯第 3、6 題（不可能連對 3 題）、12 題換數字題各錯一次、之後全部一次就對 ⇒ 永遠學不會，提示要出現
  const s2 = DOC.fresh(); let t = 1;
  for (let i = 0; i < 60; i++) {
    const w = i === 2 || i === 5 || (i >= 6 && i < 18) ? 1 : 0;
    if (w) H.notePeek(P, s2, s2.idx, t);
    H.scoreChoice(P, s2, w, need3, t++);
  }
  assert.equal(s2.mastered, false);
  assert.equal(H.allSeen(P, s2), true, "已經學不會時提示要出現");
});

test("S8 只看過一部分題目的答案不會永遠學不會：看過答案的題答對不加不減（Opus 審 e84b623 B2）", () => {
  // 反例：第 3、6、9、12、15、18 題各答錯一次，其餘一次就對；之後全部一次就選對
  const st = DOC.fresh();
  let t = 1, at = -1;
  for (let i = 0; i < 400 && !st.mastered; i++) {
    const w = i < 18 && i % 3 === 2 ? 1 : 0;
    if (w) H.notePeek(P, st, st.idx, t);
    H.scoreChoice(P, st, w, need3, t++);
    if (st.mastered) at = i + 1;
  }
  assert.equal(Object.keys(st.peek).length, 6);
  assert.ok(st.mastered && at > 18 && at <= 30, "看過 6 題答案後，連續 3 題新題一次選對就學會（實際第 " + at + " 題）");
  // 中性：看過答案的題答對，streak 不變；答錯照樣歸零
  const s2 = DOC.fresh(); s2.peek = { [H.practiceId(H.practiceAt(P, 0))]: 1 }; s2.streak = 2;
  const r = H.scoreChoice(P, s2, 0, need3, 9);
  assert.equal(r.counts, false); assert.equal(s2.streak, 2, "看過答案的題答對：不加也不歸零"); assert.equal(s2.mastered, false);
  const s3 = DOC.fresh(); s3.streak = 2; H.scoreChoice(P, s3, 1, need3, 9);
  assert.equal(s3.streak, 0, "答錯照樣歸零");
});

test("S9 log 兜底路徑：scoreChoice 寫的 log 帶 k；只有 clean:false 的 k 算看過（Opus 審 e84b623 C 兩個漏網突變）", () => {
  const st = DOC.fresh();
  H.scoreChoice(P, st, 0, need3, 1); H.scoreChoice(P, st, 1, need3, 2);
  assert.equal(st.log[0].k, H.practiceId(H.practiceAt(P, 0)), "一次就對的那筆也帶 k");
  assert.equal(st.log[1].k, H.practiceId(H.practiceAt(P, 1)));
  delete st.peek;   // 舊版頁面存檔丟掉 peek 的情境：只剩 log
  assert.equal(H.shownBefore(P, st, 0), false, "一次就對、帶 k 的 log 不能被當成看過答案");
  assert.equal(H.shownBefore(P, st, 1), true, "答錯過、帶 k 的 log 要擋");
});

test("S10 題目鍵：帶分數、小數點不會和別的數字撞鍵（Opus 審 e84b623 B10）", () => {
  const q = (t) => ({ q: t, opts: ["a", "b"], a: 0 });
  assert.notEqual(H.practiceId(q("1 1/2 和 2/3 哪個大？")), H.practiceId(q("11/2 和 2/3 哪個大？")));
  assert.notEqual(H.practiceId(q("1.5 和 2 哪個大？")), H.practiceId(q("15 和 2 哪個大？")));
  assert.equal(H.practiceId(q("1  1/2 和 2/3 哪個大？")), H.practiceId(q("1 1/2和 2/3哪個大？")), "數字間空白幾格、文字旁空白都不影響");
});
