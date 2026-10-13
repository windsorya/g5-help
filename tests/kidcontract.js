// 孩子看得到的字：寫法提醒清單（設計 D 4agent 最終方案；2026-10-13 依 4agent 停止條件降級，Codex 審 4271bb4）。
//
// ⚠️ 降級（docs/designD-downgrade-20261013.md）：本檔的 K 規則與 kidtext.appBranchProblems（「互動元件每個回饋分支都被採字到」）
//   已從「擋件」改為「提醒」——測試照跑、違反時印出警告清單，但不讓 node 全套紅。理由：Codex 審 4271bb4 以三種寫法繞過
//   （B18 跨行賦值、B18 fb() 雙引號但沒有對應分支、B15 class="ok fb" 調換 class 順序），4agent 停止條件規定會診後 FAIL 不再補丁。
//
// 採字器的自動保證範圍只到：句長閘（tests/kidgate.js＋tests/e2e_kidtext.py 真瀏覽器採字，小五 40 字上限，擋件）
//   量得到的「實際走到的畫面文字」。以下兩類「不在自動保證範圍」，改由人工抽查清單（node tests/kidcontract.js --checklist）：
//   ・B18 非標準寫法的回饋：單引號／反引號／跨行／變數中轉／fb() 新增分支等——沒被 e2e 走到的回饋字，句長閘量不到。
//   ・B15 巢狀 white-space：回饋框內子元素各自覆寫 white-space 時，句長量測可能把一句錯分成兩句。
//   不得宣稱「孩子看得到的字已完整覆蓋」。
//
// 提醒規則（封閉清單，只是提示「量測器看不懂這種寫法」，抓不到的寫法很多，見上）：
//   K1 反引號字串含中文
//   K2 回饋行（有 .textContent 指定、msg:、fb(）裡有含中文的單引號字串
//   K3 .textContent = 的右邊跨行（同一行沒有 ;）、msg: 的值不在同一行
//   K4 用 innerText／outerText／nodeValue／createTextNode／insertAdjacentText 寫字
//   K5 回饋框 .fb 只准：.hidden／.className／.classList／.textContent，或當 fb( 的第一個參數
//   K6 HTML 字串裡的 <div class="fb…">…</div> 同一行內要收尾，且框內不得有任何標籤
//   K7 區段內不得出現 white-space／whiteSpace；整頁 CSS 只有 .fb 可以用 pre-line／pre-wrap／break-spaces
// 執行：node --test tests/kidcontract.test.js（提醒，不擋件）；node tests/kidcontract.js --checklist（印人工抽查清單）
"use strict";
const fs = require("fs");
const path = require("path");

const APP = path.join(__dirname, "..", "src", "app.html");
const START = "// ---------- 互動元件", END = "// ---------- 首頁按鈕";
const CJK = /[\u3000-\u303f\u3400-\u9fff\uff00-\uffef…]/;

function appText() { return fs.readFileSync(APP, "utf8"); }
// 回傳 {src, offset}：offset＝區段第一行在 app.html 的行號（1 起算）
function section(app = appText()) {
  const a = app.indexOf(START), b = app.indexOf(END);
  if (a < 0 || b < a || app.indexOf(START, a + 1) >= 0 || app.indexOf(END, b + 1) >= 0) throw new Error("app.html 找不到唯一的「互動元件」～「首頁按鈕」區段標記");
  return {src: app.slice(a, b), offset: app.slice(0, a).split("\n").length};
}

// 極簡 JS 斷詞：只分出字串（' " `）與註解，其餘當程式碼。單／雙引號字串遇到換行＝無法解析（契約紅，不猜）。
function tokenize(src) {
  const strings = [], problems = [];
  let code = "", i = 0, line = 1;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { const e = src.indexOf("*/", i + 2); const end = e < 0 ? src.length : e + 2; const chunk = src.slice(i, end); line += (chunk.match(/\n/g) || []).length; code += chunk.replace(/[^\n]/g, " "); i = end; continue; }
    if (c === "'" || c === '"' || c === "`") {
      const startLine = line; let j = i + 1, text = "", bad = false;
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") { text += src[j] + (src[j + 1] || ""); j += 2; continue; }
        if (src[j] === "\n") { if (c !== "`") { bad = true; break; } line++; }
        text += src[j]; j++;
      }
      if (bad || j >= src.length) { problems.push({rule: "K0", line: startLine, msg: "字串沒有在同一行收尾，無法解析"}); i = j; continue; }
      strings.push({quote: c, text, line: startLine});
      code += c + text.replace(/[^\n]/g, " ") + c;   // 程式碼視圖：字串內容換成空白（保留換行），方便找程式碼層級的符號
      i = j + 1; continue;
    }
    if (c === "\n") line++;
    code += c; i++;
  }
  return {strings, problems, codeLines: code.split("\n")};
}

function contractProblems(src, offset = 1, app) {
  const out = [], at = (rule, ln, msg) => out.push(rule + " app.html 第 " + (offset + ln - 1) + " 行：" + msg);
  const {strings, problems, codeLines} = tokenize(src);
  problems.forEach((p) => at(p.rule, p.line, p.msg));
  const rawLines = src.split("\n");
  const isFeedbackLine = (ln) => /\.textContent\s*=(?!=)|\bmsg\s*:|\bfb\s*\(/.test(codeLines[ln - 1] || "");
  // K1、K2
  strings.forEach((s) => {
    if (!CJK.test(s.text)) return;
    if (s.quote === "`") at("K1", s.line, "反引號字串含中文（改用雙引號）：" + s.text.slice(0, 30));
    else if (s.quote === "'" && isFeedbackLine(s.line)) at("K2", s.line, "回饋行裡有含中文的單引號字串（改用雙引號）：" + s.text.slice(0, 30));
  });
  codeLines.forEach((codeLine, idx) => {
    const ln = idx + 1;
    // K3
    for (const m of codeLine.matchAll(/\.textContent\s*=(?!=)/g)) {
      if (!codeLine.slice(m.index + m[0].length).includes(";")) at("K3", ln, ".textContent = 的右邊要在同一行寫完並以 ; 結尾");
    }
    if (/\bmsg\s*:\s*$/.test(codeLine)) at("K3", ln, "msg: 的值要寫在同一行");
    // K4
    const api = codeLine.match(/\.(innerText|outerText|nodeValue|insertAdjacentText)\b|\bcreateTextNode\b/);
    if (api) at("K4", ln, "不用 " + api[0].replace(/^\./, "") + " 寫字（採字完整性閘不認），改用 .textContent 或 msg:");
    // K7（區段內）
    if (/white-?space/i.test(rawLines[idx])) at("K7", ln, "互動元件區段不得設定 white-space（巢狀覆寫量不到）");
  });
  // K5：找出綁到 .fb 的變數名，逐一檢查每次出現
  const fbNames = new Set();
  rawLines.forEach((raw, idx) => {
    for (const m of raw.matchAll(/["']\.fb["']/g)) {
      const before = raw.slice(0, m.index);
      const bind = before.match(/\b([A-Za-z_$][\w$]*)\s*=\s*(?:\$|[\w$.]*querySelector)\(\s*$/);
      if (bind) fbNames.add(bind[1]);
      else at("K5", idx + 1, "回饋框 .fb 要先存進變數（var x = $(\".fb\", …)），不得直接操作");
    }
  });
  const ALLOWED = /^\s*\.\s*(hidden|className|classList|textContent)\b/;
  codeLines.forEach((codeLine, idx) => {
    fbNames.forEach((name) => {
      for (const m of codeLine.matchAll(new RegExp("(^|[^\\w$.])" + name.replace(/\$/g, "\\$") + "(?![\\w$])", "g"))) {
        const start = m.index + m[1].length, end = start + name.length, after = codeLine.slice(end), before = codeLine.slice(0, start);
        if (/^\s*=\s*(?:\$|[\w$.]*querySelector)\(\s*["']\.fb["']/.test(rawLines[idx].slice(end))) continue;   // 綁定本身
        if (ALLOWED.test(after)) continue;
        if (/\bfb\s*\(\s*$/.test(before)) continue;
        at("K5", idx + 1, "回饋框變數 " + name + " 只准 .hidden／.className／.classList／.textContent 或 fb(" + name + ", …)，不得：" + (name + after).trim().slice(0, 40));
      }
    });
  });
  // K6：HTML 字串裡的 .fb 框
  rawLines.forEach((raw, idx) => {
    for (const m of raw.matchAll(/class=\\?"fb\b[^"\\]*\\?"/g)) {
      const rest = raw.slice(m.index + m[0].length), gt = rest.indexOf(">"), close = rest.indexOf("</div>");
      if (gt < 0 || close < 0 || close < gt) { at("K6", idx + 1, "HTML 字串裡的回饋框 .fb 要在同一行以 </div> 收尾"); continue; }
      if (rest.slice(gt + 1, close).includes("<")) at("K6", idx + 1, "回饋框 .fb 裡不得有子元素：" + rest.slice(gt + 1, close).trim().slice(0, 40));
    }
  });
  // K7（整頁 CSS）：pre-line／pre-wrap／break-spaces 只准用在 .fb
  if (app !== undefined) {
    const css = [...app.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (/white-space\s*:\s*(pre-line|pre-wrap|break-spaces)/i.test(m[2]) && m[1].trim() !== ".fb") out.push("K7 CSS「" + m[1].trim() + "」用了保留換行的 white-space：只准 .fb（量測器不看巢狀覆寫）");
    }
  }
  return out;
}

function currentProblems() {
  const app = appText(), {src, offset} = section(app);
  return contractProblems(src, offset, app);
}

// 提醒（不擋件）：印出警告清單，回傳筆數。降級後 B18 完整性閘與 K 規則都走這裡，不 assert。
function remind(label, list) {
  if (list.length) console.warn("⚠ 提醒（不擋件，見 docs/designD-downgrade-20261013.md）" + label + "：" + list.length + " 筆\n  " + list.join("\n  "));
  return list.length;
}

// 人工抽查清單：互動元件區段裡每個回饋分支的位置（行號隨 app.html 變動，每次改內容時重印）。
// 只是列「看得到的寫字點」，不是完整性證明：寫法再怪一點（變數中轉、動態組字）一樣可能漏列——那正是要人眼看的原因。
const CHECK_KINDS = [
  ["msg:", /\bmsg\s*:/],
  [".textContent =", /\.textContent\s*=(?!=)/],
  ["fb(", /\bfb\s*\(/],
  ["innerHTML（含中文）", /\.innerHTML\s*=(?!=)/],
  ["回饋框 .fb", /\.fb\b|class=\\?"[^"\\]*\bfb\b/],
  ["white-space", /white-?space/i],
];
function checklist(app = appText()) {
  const {src, offset} = section(app), lines = src.split("\n"), rows = [];
  let comp = "", fn = "";
  lines.forEach((raw, idx) => {
    const h = raw.match(/^\/\/ -{10} (.+?) -{10}/); if (h) comp = h[1];
    const f = raw.match(/^\s*function\s+([\w$]+)\s*\(/) || raw.match(/^function\s+([\w$]+)\s*\(/); if (f) fn = f[1];
    const kinds = CHECK_KINDS.filter(([name, re]) => re.test(raw) && (name !== "innerHTML（含中文）" || CJK.test(raw))).map(([name]) => name);
    if (kinds.length) rows.push({line: offset + idx, component: comp, fn, kinds, text: raw.trim().slice(0, 100)});
  });
  const notices = [];
  app.split("\n").forEach((raw, idx) => { if (/READONLY_MSG\s*=\s*"/.test(raw)) notices.push({line: idx + 1, text: raw.trim().slice(0, 100)}); });
  const css = [];
  [...app.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].forEach((m) => {
    for (const r of m[1].matchAll(/([^{}]+)\{([^{}]*)\}/g)) if (/white-space/i.test(r[2])) css.push(r[1].trim() + " { " + (r[2].match(/white-space\s*:[^;]*/i) || [""])[0] + " }");
  });
  return {rows, notices, css};
}
function formatChecklist(c = checklist()) {
  const out = ["# 人工抽查清單（node tests/kidcontract.js --checklist 產生；src/app.html 互動元件區段）", ""];
  out.push("每次改 src/app.html 的互動元件文字：逐列看那一行在畫面上會說的話是否每句 ≤ 40 字、沒有沒解釋的難詞；" +
    "沒被 e2e_kidtext 走到的分支（例如新加的 if 分支）句長閘量不到，只能靠這裡人眼看。", "");
  out.push("| app.html 行 | 元件 | 函式 | 寫字方式 | 原始碼（前 100 字） |", "|---|---|---|---|---|");
  c.rows.forEach((r) => out.push("| " + r.line + " | " + r.component + " | " + (r.fn || "（頂層）") + " | " + r.kinds.join("、") + " | `" + r.text.replace(/\|/g, "\\|").replace(/`/g, "'") + "` |"));
  out.push("", "唯讀提示（整頁）：", ...c.notices.map((n) => "- 第 " + n.line + " 行：`" + n.text.replace(/`/g, "'") + "`"));
  out.push("", "整頁 CSS 的 white-space（B15：回饋框內若有子元素各自覆寫，句長量測可能錯分）：", ...c.css.map((x) => "- `" + x + "`"));
  return out.join("\n");
}

module.exports = {START, END, section, tokenize, contractProblems, currentProblems, remind, checklist, formatChecklist};

if (require.main === module) {
  if (process.argv.includes("--checklist")) console.log(formatChecklist());
  else {
    const KT = require("./kidtext.js");
    const n = remind("寫法提醒 K1–K7", currentProblems()) + remind("回饋分支提醒（appBranchProblems）", KT.appBranchProblems());
    console.log(n ? "提醒 " + n + " 筆（不擋件）" : "目前沒有提醒（不代表完整覆蓋，見 docs/designD-downgrade-20261013.md）");
  }
}
