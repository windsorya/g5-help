// 孩子看得到的字：輔助檢查（設計 D・B2，Codex 設計者 #1347）。
// 主閘已改成真瀏覽器採字（tests/kidgate.js＋tests/e2e_kidtext.py，結果在 tests/kidtext_harvest.json）。
// 舊版這支用原始碼 regex 重建「畫面顯示順序」——三輪審查證明它猜錯分支（直接練習、hint／ok 互斥）、量不到 frac.js 回傳字與拼接後全句、
// 漏標題與 SVG 字，所以不再宣告「孩子看到的字全部合格」。現在只負責三件事：
//   ①欄位：steps 篇要有 words；②詞表：HARD_WORDS 與各篇 words 的白話不可空白；
//   ③案例完整性：從題目資料、frac.js 的判題代碼、app.html 的回饋字串推出「一定要實際走到」的案例與分支，對照採字結果；
//     新增題目、選項、判題代碼卻沒有對應案例 ⇒ 紅；另驗採字結果是不是這一版 index.html 量的（過期 ⇒ 紅）。
//     例外（2026-10-13 設計 D 降級，docs/designD-downgrade-20261013.md）：app.html 回饋字串的分支完整性（appBranchProblems）只是提醒、不擋件——
//     它逐行認雙引號字面字串，跨行、變數中轉、fb() 新分支都會漏（Codex 審 4271bb4），不能宣稱「每個回饋分支都被採字到」；改人工抽查清單。
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const H = require("../src/hard.js");

const ROOT = path.join(__dirname, "..");
const HARVEST = path.join(__dirname, "kidtext_harvest.json");
const BROWSERS = ["chromium", "webkit"];
// 正式採字的句長上限：固定小五 40（設計 D B19；第 8 輪：不能用 readingAt(new Date())，否則隔年同一份內容會從紅變綠）。年級換算另由 kidgate.test.js 以固定日期測。
const OFFICIAL_MAX = 40;   // cap-why: 設計 D B19「小五 40 字上限固定為測試條件」＝src/hard.js READING[5].maxSentence（kidgate.test.js 斷言兩者相等）
const SELFTESTS = ["B01a", "B01b", "B02a", "B02b", "B03", "B04", "B05", "B06", "B07", "B09", "B10-judged", "B12", "B13", "B14", "B15", "B16", "B18", "B19", "unclassified", "U01"];
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

// ---- ①②欄位與詞表 ----
function wordTableProblems(list = H.LIST, table = H.HARD_WORDS) {
  const out = [];
  const gloss = (where, obj) => Object.keys(obj).forEach((w) => {
    if (!w.trim()) out.push(where + " 有空白的難詞");
    if (typeof obj[w] !== "string" || !obj[w].replace(/\s/g, "")) out.push(where + " 的「" + w + "」白話是空的");
  });
  gloss("HARD_WORDS", table || {});
  list.forEach((e) => {
    if (e.kind === "steps" && !(e.words && typeof e.words === "object" && !Array.isArray(e.words))) out.push(e.id + " 要列出 words（本篇用到的難詞→白話；真的沒有就寫 {}）");
    if (e.words && typeof e.words === "object") gloss(e.id + ".words", e.words);
  });
  return out;
}

// ---- ③案例完整性 ----
// app.html 數學篇（互動元件～首頁按鈕之間）每一個 msg: 回饋都要對到一個分支名；分支名由 tests/e2e_kidtext.py 在真的觸發那個回饋時記下。
const APP_BRANCHES = {
  "app:nums-empty": "先填一個數字。", "app:nums-bad": "只能填整數，例如 15。", "app:nums-wrong": "msg:\"再算一次。\"", "app:nums-third": "　答案是 ",
  "app:step1-red": "msg:pr.ok", "app:step1-mul": "一起乘，數字只會更大喔", "app:step1-num": "分子大的不一定比較大",
  "app:step4-le0": "要找比 0 大的公倍數", "app:step4-common": "的公倍數，但還有更小的", "app:step4-else": "第一個兩邊都有的數，就是最小公倍數",
  "app:step5-ok": "對！分母一樣，比分子", "app:step5-wrong": "看塗色的格子", "app:step5b-ok": "一樣大，所以答案一樣是", "app:step5b-wrong": "剛剛比出來哪個大",
  "app:step6-ok": "對！先約分讓數字變小", "app:step6-x": "先通分的話", "app:step6-n": "分母不一樣時，不能直接比分子。",
  "app:form-bad": "只能填整數，例如 2、15。", "app:form-empty": "還有格子沒填。", "app:r1-ok": "msg:\"對了：\" + F.txt(a)",
  "F:checkReduce": "\"左邊：\" + x.msg", "F:checkCommon": "msg:x.msg",
  "app:hint-r1-1": "從 2、3、5、7、9 開始試", "app:hint-r1-2": "\"，一起除以 \" + t.g", "app:hint-r2-1": "\"先找 \" + sa.d", "app:hint-r2-2": "最小公倍數（共同的倍數裡最小的）是",
  // 「這步看不懂」（每一篇的每一步都有；第 8 輪 B18：原本只找 msg:，這五個 .textContent 回饋沒人驗）
  "app:confused-nocode": "這台還沒開同步", "app:confused-sending": "\"送出中…\"", "app:confused-ok": "收到了！會換一個更好懂的說法",
  "app:confused-fail": "\"沒送成功，請跟爸爸媽媽說", "app:confused-net": "沒送成功（可能沒有網路）",
  "app:finish-clean": "完全自己做對！", "app:finish-hint": "這題看了提示，", "app:finish-wrong": "這題有改過答案，", "app:win": "這種題你會了！", "app:alt": "另一種做法：直接通分",
};
function appSection() {
  const app = fs.readFileSync(path.join(ROOT, "src", "app.html"), "utf8");
  const a = app.indexOf("// ---------- 互動元件"), b = app.indexOf("// ---------- 首頁按鈕");
  if (a < 0 || b < a) throw new Error("app.html 找不到「互動元件」～「首頁按鈕」區段標記");
  return app.slice(a, b);
}
// 一行裡有幾個「直接寫字的 .textContent 回饋」：每個 `.textContent = …;` 右邊有中文字面字串就算 1 個，
// 三元運算每多一個 `: "…"` 再加 1；右邊沒有字面字串（例如 = msg、= hints[i]()）是把別處的字放上來，不在這裡算（第 8 輪 B18）
function textBranches(line) {
  let n = 0;
  for (const m of line.matchAll(/\.textContent\s*=\s*([^;]*)/g)) {
    const rhs = m[1];
    if (!/"[^"]*[\u4e00-\u9fff…][^"]*"/.test(rhs)) continue;
    n += 1 + (rhs.match(/\?[^:]*:\s*"/g) || []).length;
  }
  return n;
}
// 回傳問題清單：沒對到分支名的 msg:／.textContent 回饋行、對不到原始碼的過期錨點（提醒用，不擋件；不是完整性證明）
function appBranchProblems(src = appSection()) {
  const out = [];
  src.split("\n").forEach((line, i) => {
    const n = (line.match(/msg\s*:/g) || []).length + textBranches(line);
    if (!n) return;
    const hit = Object.values(APP_BRANCHES).filter((anchor) => line.includes(anchor)).length;
    if (hit < n) out.push("app.html 數學篇第 " + (i + 1) + " 行有 " + n + " 個回饋、只對到 " + hit + " 個分支名：" + line.trim().slice(0, 90));
  });
  Object.entries(APP_BRANCHES).forEach(([name, anchor]) => { if (!src.includes(anchor)) out.push("分支 " + name + " 的錨點已不在 app.html：" + anchor); });
  return out;
}
// frac.js 判題代碼 ⇒ 一定要實際觸發的分支（invalid 依訊息再分分母 0／分子 0）
const FRAC_UNREACHABLE = {
  "checkReduce:empty": "app.html formCheck 先攔下空格，判題函式收不到",
  "checkCommon:empty": "app.html formCheck 先攔下空格，判題函式收不到",
  "checkReduce:invalid-other": "輸入只收 0–9（parseNum），非正整數只剩 0，已由 -n0／-d0 涵蓋",
  "checkCommon:invalid-other": "同上",
};
function fracBranches() {
  const src = fs.readFileSync(path.join(ROOT, "src", "frac.js"), "utf8");
  const slice = (name, next) => src.slice(src.indexOf("function " + name), next ? src.indexOf("function " + next) : undefined);
  const out = [];
  [["checkReduce", "checkCommon"], ["checkCommon", "checkSign"]].forEach(([fn, next]) => {
    const body = slice(fn, next), codes = new Set([...body.matchAll(/code:\s*"([\w-]+)"/g)].map((m) => m[1]));
    if (/invalid\(/.test(body)) { codes.delete("invalid"); ["n0", "d0", "other"].forEach((x) => codes.add("invalid-" + x)); }
    codes.forEach((c) => out.push(fn + ":" + c));
  });
  ["none-ok", "none-wrong", "bad", "ok"].forEach((x) => out.push("pickDivisor:" + x));
  ["ok-eq", "ok-neq", "wrong-eq", "wrong-neq"].forEach((x) => out.push("checkSign:" + x));
  return out.filter((b) => !FRAC_UNREACHABLE[b]);
}
// 整頁層級的提示（不在數學篇區段）：每一種唯讀提示都要有一個真的採到字的案例（第 8 輪 B18：第二分頁提示 45 字沒人量）
const NOTICES = { "readonly:second-tab": "var READONLY_MSG = \"", "readonly:lockfail": "READONLY_MSG = \"這一頁拿不到存檔", "readonly:nolocks": "READONLY_MSG = \"這個瀏覽器太舊" };
function noticeProblems(src = fs.readFileSync(path.join(ROOT, "src", "app.html"), "utf8")) {
  const out = [];
  src.split("\n").forEach((line, i) => {
    const n = (line.match(/READONLY_MSG\s*=\s*"/g) || []).length;
    if (!n) return;
    const hit = Object.values(NOTICES).filter((a) => line.includes(a)).length;
    if (hit < n) out.push("app.html 第 " + (i + 1) + " 行有 " + n + " 個唯讀提示、只對到 " + hit + " 個案例：" + line.trim().slice(0, 90));
  });
  Object.entries(NOTICES).forEach(([name, a]) => { if (!src.includes(a)) out.push("案例 " + name + " 的錨點已不在 app.html：" + a); });
  return out;
}
function requiredCases(list = H.LIST) {
  const out = ["home", "home:hide", "home:settings", "home:withdraw", ...Object.keys(NOTICES)];   // 家長功能（2026-10-13）：隱藏這篇、家長設定、撤回傳題，每個狀態都要真的採到字
  list.forEach((e) => {
    if (e.kind === "steps") {
      out.push(e.id + ":lesson", e.id + ":direct");
      H.practiceAll(e).forEach((_, q) => out.push(e.id + ":resume" + q));   // 含 practiceAlt（第 2 輪起換數字的題，#2270）：每一題都要實際走到
      if ((e.practice || []).length) out.push(e.id + ":mastery");
      if ((e.practice || []).length && (e.practiceAlt || []).length) out.push(e.id + ":revisit");   // 以前答錯過的題再出現、答對不算（#2274）
    } else {
      out.push(e.id + ":lesson", e.id + ":alt", e.id + ":direct", e.id + ":practice", e.id + ":resume");
    }
    if ((e.videos || []).length) out.push(e.id + ":video");
  });
  return out;
}
function requiredBranches(list = H.LIST) {
  const out = Object.keys(APP_BRANCHES).filter((n) => n.startsWith("app:confused-"));   // 每一篇的教學都有「這步看不懂」
  list.forEach((e) => {
    if (e.kind === "steps") {
      (e.steps || []).forEach((s, i) => { if (s.check) s.check.opts.forEach((_, k) => out.push(e.id + ":check" + (i + 1) + ":" + k)); });
      H.practiceAll(e).forEach((q, n) => q.opts.forEach((_, k) => out.push(e.id + ":prac" + (n + 1) + ":" + k)));
      if ((e.practice || []).length) out.push(e.id + ":mastery");
    } else {
      out.push(e.id + ":direct");
      out.push(...Object.keys(APP_BRANCHES).filter((n) => n.startsWith("app:")));
      out.push(...fracBranches());
    }
  });
  return [...new Set(out)];
}

// ---- 採字結果 ----
function readHarvest() { return fs.existsSync(HARVEST) ? JSON.parse(fs.readFileSync(HARVEST, "utf8")) : null; }
// kinds：要算進來的違規種類（word／length／unclassified）
// opt.indexPath：自檢用（換一份不同的 index.html，應判為過期）；opt.harvest：自檢用（直接給一份採字結果，不讀檔）
// 新鮮度逐瀏覽器判（第 8 輪）：--only chromium 只重跑一個瀏覽器時，另一個瀏覽器保留的是它自己當時量的 hash；
// 那份 hash 跟現在的 index.html／採字器／driver 對不上 ⇒ 那個瀏覽器的結果過期，不能因為頂層 hash 是新的就沿用。
function harvestProblems(kinds, opt = {}) {
  const h = opt.harvest || readHarvest(), out = [];
  if (!h) return ["沒有 tests/kidtext_harvest.json：先 python3.12 build.py，再跑 python3.12 tests/e2e_kidtext.py"];
  const now = [["index.html", sha(opt.indexPath || path.join(ROOT, "index.html")), "index_sha256"], ["tests/kidgate.js", sha(path.join(__dirname, "kidgate.js")), "kidgate_sha256"],
    ["tests/e2e_kidtext.py", sha(path.join(__dirname, "e2e_kidtext.py")), "driver_sha256"]];
  if (h.max !== OFFICIAL_MAX) out.push("採字時用的句長上限 " + h.max + " ≠ 正式上限 " + OFFICIAL_MAX + "（小五，固定）");
  const cases = requiredCases(opt.list), branches = requiredBranches(opt.list);   // opt.list：自檢用（多一題卻沒走到 ⇒ 要紅）
  BROWSERS.forEach((b) => {
    const r = h.browsers && h.browsers[b];
    if (!r) { out.push(b + "：沒有採字結果"); return; }
    now.forEach(([name, cur, field]) => { if (r[field] !== cur) out.push(b + "：採字結果過期：" + name + " 改過了（這個瀏覽器的結果不是這一版量的），請重跑 tests/e2e_kidtext.py"); });
    if (r.max !== OFFICIAL_MAX) out.push(b + "：採字時用的句長上限 " + r.max + " ≠ 正式上限 " + OFFICIAL_MAX);
    (r.errors || []).forEach((e) => out.push(b + "：" + e));
    (r.violations || []).filter((v) => kinds.includes(v.kind)).forEach((v) => out.push(b + " [" + v.kind + "] " + v.case + " @ " + v.at + "：" + (v.word ? "「" + v.word + "」" : (v.chars || "") + " 字 ") + v.text));
    cases.filter((c) => !r.cases.includes(c)).forEach((c) => out.push(b + "：沒有走到案例 " + c));
    branches.filter((c) => !r.branches.includes(c)).forEach((c) => out.push(b + "：沒有走到分支 " + c));
    SELFTESTS.forEach((t) => { if (!(r.selftests && r.selftests[t] && r.selftests[t].ok)) out.push(b + "：自檢 " + t + " 沒有通過"); });
  });
  return out;
}

module.exports = { OFFICIAL_MAX, NOTICES, noticeProblems, wordTableProblems, appBranchProblems, fracBranches, requiredCases, requiredBranches, readHarvest, harvestProblems, APP_BRANCHES, FRAC_UNREACHABLE, SELFTESTS, BROWSERS };
