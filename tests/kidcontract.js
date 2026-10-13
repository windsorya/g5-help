// 孩子看得到的字：寫法契約（設計 D 4agent 最終方案，Codex 審 b0b24f1 B15／B18）。
//
// 採字器量測範圍（tests/kidgate.js＋tests/e2e_kidtext.py 真瀏覽器採字；tests/kidtext.js 案例完整性）：
//   ・回饋完整性（kidtext.appBranchProblems）只認「同一行、雙引號」的回饋字面字串：`msg: "…"`、`.textContent = "…";`。
//   ・句長量測（kidgate.js）以文字所在區塊的 computed white-space 判斷換行，不看區塊內子元素各自的覆寫。
// 這兩個量測核心刻意不追 JS 語法（單引號、反引號、跨行、別的寫入 API）與巢狀 white-space——
// 改成由本契約「拒絕這些寫法」：互動元件區段（app.html「// ---------- 互動元件」～「// ---------- 首頁按鈕」，同 kidtext 錨點）
// 只准用量測器看得懂的寫法；違反＝政策紅燈（不是採字器缺陷），改寫法，不是改量測核心。
//
// 封閉清單（每條對應一種量測器刻意不支援的寫法）：
//   K1 反引號字串含中文（B18：模板字串不在完整性閘的語法裡）
//   K2 回饋行（有 .textContent 指定、msg:、fb(）裡有含中文的單引號字串（B18：完整性閘只認雙引號）
//   K3 .textContent = 的右邊跨行（同一行沒有 ;）、msg: 的值不在同一行（B18：完整性閘逐行看）
//   K4 用量測器不認的寫字 API：innerText／outerText／nodeValue／createTextNode／insertAdjacentText（B18）
//   K5 回饋框 .fb 只准：.hidden／.className／.classList／.textContent，或當 fb( 的第一個參數；
//      innerHTML、appendChild、append、另取別名…一律紅（B15：框內不得有子元素，子元素可各自覆寫 white-space）
//   K6 HTML 字串裡的 <div class="fb…">…</div> 同一行內要收尾，且框內不得有任何標籤（B15）
//   K7 區段內不得出現 white-space／whiteSpace；整頁 CSS 只有 .fb 可以用 pre-line／pre-wrap／break-spaces（B15）
// 執行：node --test tests/kidcontract.test.js（接在 node --test tests/*.test.js 裡）
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

module.exports = {START, END, section, tokenize, contractProblems, currentProblems};
