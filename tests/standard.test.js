// ⛔ 律師對「孩子用的教學網站」的固定標準——不屬於任何科目，複製這個網站去做新站時這支要一起帶走、不可刪除、不可改成跳過。
// 由來（#1339）：2026-10-13 數學站複製自然站時，影片的強制檢查寫在自然科專用的 steps.test.js 裡，被當成「自然專用」整支刪掉，
// 數學站就在沒有影片的狀態宣稱上線（律師：「數學複習似乎都沒有加上影片」「為何會漏做」）。
// 本站的細則另在 hard.test.js；這支只放三站共通的五條，名字與內容三站一致，方便一眼看出有沒有被拿掉。
// 標準來源：律師 2026-10-11「白話易懂、圖多一些、有影片就附上」；2026-10-13 每步一圖、每篇有影片；白話（#1319）；三站切換（#1333）。
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const H = require("../src/hard.js");
const ROOT = path.join(__dirname, "..");
const MAX_SENTENCE = H.readingAt(new Date()).maxSentence;

test("標準①影片：每一篇至少一段驗證過的影片（真的找不到要寫明理由）", () => {
  const missing = H.LIST.filter((e) => !((e.videos || []).length || (typeof e.noVideoReason === "string" && e.noVideoReason.length >= 20))).map((e) => e.id);
  assert.deepEqual(missing, []);
});

test("標準②圖：通用格式每一步都有圖", () => {
  H.LIST.filter((e) => e.kind === "steps").forEach((e) => e.steps.forEach((s, i) =>
    assert.ok(/<svg[^>]*aria-label="[^"]{4,}"/.test(String(s.fig || "")), e.id + " 第 " + (i + 1) + " 步沒有圖")));
});

// 孩子看到的字一律從 tests/kidtext.js 取（每一種 kind；Codex 審 bdad9d6：舊版只篩 steps，數學篇寫 100 字一句也過）。
const KT = require("./kidtext.js");
function longSentences(e) {
  const { paths, pieces } = KT.kidText(e), long = [];
  [...new Set(paths.flat().concat(pieces))].forEach((t) => String(t || "").split(/[。！？\n]/).forEach((s) => {
    if (s.trim().length > MAX_SENTENCE) long.push(e.id + "：" + s.trim());
  }));
  return long;
}

test("標準③白話：孩子看到的每一句不超過年級句長上限（每一種 kind）", () => {
  assert.deepEqual(H.LIST.map(longSentences).flat(), []);
});

test("標準③自檢：數學篇超長句要被抓到", () => {
  const c = JSON.parse(JSON.stringify(H.get("p38-6-2"))); c.lead = "字".repeat(100) + "。";
  assert.ok(longSentences(c).length, "frac-compare 篇也要量句長");
});

test("標準④三站切換列、⑤不被搜尋引擎收錄", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.ok(/id="siteNav"/.test(html) && (html.match(/windsorya\.github\.io\/g5-(sci-review|math-review)\//g) || []).length >= 2, "缺三站切換列");
  assert.ok(/<meta name="robots" content="noindex/.test(html), "缺 noindex");
  assert.ok(/Disallow: \//.test(fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8")), "robots.txt 沒有 Disallow");
});
