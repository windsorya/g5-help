// 孩子實際看到的文字（hard.test 用詞閘、standard.test 句長閘共用；Codex 審 5367999、bdad9d6 連兩輪抓到兩支測試
// 各自重組文字、順序與範圍都跟畫面不一樣 ⇒ 改成一份「依畫面顯示順序」的資料模型）。
//
// steps 篇（app.html stepsLesson／stepsEnd／choicePractice）：每一步依序顯示 say → 確認題 q＋選項 →
// 答錯時先看到 why[選的那個]、最後答對才看到 ok；之後是答案、寫法、練習（q＋選項 → why → ok）。
// 所以「路徑」＝主線（全部一次答對）＋每一個答錯分支各一條（那條在 ok 前面多看到一句 why）。
// 用詞閘以每一條路徑「第一次出現」判斷有沒有附白話——答錯分支先看到的難詞不能靠後面的 ok 解釋。
//
// frac-compare 篇：步驟文字由 app.html「教學（習作那一題）」到「通用格式 steps」之間的程式組出來，
// 只能讀程式裡的字串常數（aria 標籤是讀屏用，不是畫面字，不算）。顯示順序無法從原始碼得知 ⇒
// 每一個含難詞的字串都要自己附白話（保守）；句長也逐字串量（字串是句子的片段，量到的是下限）。
"use strict";
const fs = require("fs");
const path = require("path");

const stripTags = (x) => String(x || "").replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, "");

// 一篇 steps 的顯示序列：每格 {text} 或 {ok, wrongs[]}
function stepsSlots(e) {
  const slots = [{ text: e.lead }];
  const ask = (c) => { slots.push({ text: c.q + "\n" + (c.opts || []).join("／") }); slots.push({ ok: c.ok || "對了！", wrongs: (c.why || []).filter(Boolean) }); };
  (e.steps || []).forEach((s) => { slots.push({ text: s.say }); if (s.check) ask(s.check); });
  slots.push({ text: e.answer }); if (e.write) slots.push({ text: e.write });
  (e.practice || []).forEach(ask);
  return slots;
}

function stepsPaths(e) {
  const slots = stepsSlots(e);
  const line = (pick) => slots.map((s, i) => (s.text !== undefined ? [s.text] : (pick && pick[0] === i ? [s.wrongs[pick[1]], s.ok] : [s.ok]))).flat().map(stripTags);
  const paths = [line(null)];
  slots.forEach((s, i) => (s.wrongs || []).forEach((_, j) => paths.push(line([i, j]))));
  return paths;
}

let APP = null;
function fracLiterals() {
  if (APP === null) APP = fs.readFileSync(path.join(__dirname, "..", "src", "app.html"), "utf8");
  const a = APP.indexOf("// ---------- 教學（習作那一題）"), b = APP.indexOf("// ---------- 通用格式 steps");
  if (a < 0 || b < a) throw new Error("app.html 找不到 frac-compare 教學區段的標記（教學（習作那一題）…通用格式 steps）");
  const src = APP.slice(a, b).replace(/aria\s*:\s*("[^"]*"|'[^']*')/g, "").replace(/aria-label=\\?"[^"]*"/g, "");
  const out = [];
  src.replace(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g, (_, d, s) => { const t = stripTags(d !== undefined ? d : s); if (/[\u4e00-\u9fff]/.test(t)) out.push(t); return ""; });
  return out;
}

// 回傳 {paths: 依序顯示的文字路徑[], pieces: 各自要附白話的獨立字串[]}
function kidText(e) {
  if (e.kind === "steps") return { paths: stepsPaths(e), pieces: [] };
  const p = e.prior || {};
  return { paths: [[e.lead, p.q, p.hint, p.ok].map(stripTags)], pieces: fracLiterals() };
}

module.exports = { kidText, stepsPaths, fracLiterals, stripTags };
