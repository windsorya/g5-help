// 選項全是整數（例如「65 度」）的練習題：不懂也能連對 3 題的猜法，固定 230 條（交辦 #2528，2026-10-17）。
// 來由：q6-1-angle-x 的練習題 Codex 審 3 輪，每輪都抓到新猜法（180 減題目第一個數、選最小、選小於 90 且題目沒出現的數裡最大的……），
// 逐題補干擾值不收斂。Codex 當設計者給了這份「封版」的矩陣：矩陣內的猜法任何連續 3 題都不得全對；矩陣外的新猜法只記建議、不再當 FAIL。
// 分數比大小的篇（選項是 11/10 這種）不適用，照 tests/hard.test.js 的 SHORTCUTS。
"use strict";
const H = require("../src/hard.js");

const nums = (q) => (String(q.q).replace(/<[^>]*>/g, "").match(/\d+/g) || []).map(Number);   // 題幹依出現順序的全部數字
const vals = (q) => q.opts.map((o) => parseInt(o, 10));
const isNumeric = (q) => q.opts.every((o) => /^\s*\d+\s*(度)?\s*$/.test(String(o)));

function strategies() {
  const S = [];
  for (let k = 0; k < 3; k++) S.push(["一律選第 " + (k + 1) + " 個", () => k]);
  for (let k = 0; k < 3; k++) S.push(["一律選第 " + (k + 1) + " 小的", (N, V) => V.indexOf([...V].sort((a, b) => a - b)[k])]);
  const FB = [-1, 0, 1, 2];   // 算不出結果時固定的後備：不選／選第 1、2、3 個
  const F = { "小於 90": (v) => v < 90, "90 以上": (v) => v >= 90, "題目有的數": (v, N) => N.includes(v), "題目沒有的數": (v, N) => !N.includes(v),
    "小於 90 且題目沒有": (v, N) => v < 90 && !N.includes(v), "90 以上且題目沒有": (v, N) => v >= 90 && !N.includes(v) };
  const PICK = { "最小": (c, V) => c.reduce((a, i) => (V[i] < V[a] ? i : a)), "最大": (c, V) => c.reduce((a, i) => (V[i] > V[a] ? i : a)), "第一個": (c) => c[0], "最後一個": (c) => c[c.length - 1] };
  Object.entries(F).forEach(([fn, f]) => {
    const C = (N, V) => V.map((_, i) => i).filter((i) => f(V[i], N));
    FB.forEach((b) => S.push(["只剩一個「" + fn + "」就選它／後備 " + b, (N, V) => { const c = C(N, V); return c.length === 1 ? c[0] : b; }]));
    Object.entries(PICK).forEach(([pn, p]) => FB.forEach((b) => S.push(["「" + fn + "」裡選" + pn + "／後備 " + b, (N, V) => { const c = C(N, V); return c.length ? p(c, V) : b; }])));
  });
  const X = { "題目第一個數": (N) => N[0], "題目最後一個數": (N) => N[N.length - 1], "題目最小的數": (N) => Math.min(...N), "題目最大的數": (N) => Math.max(...N), "題目的數加起來": (N) => N.reduce((a, b) => a + b, 0) };
  const Y = { "x": (x) => x, "90 − x": (x) => 90 - x, "180 − x": (x) => 180 - x, "|90 − x|": (x) => Math.abs(90 - x), "|180 − x|": (x) => Math.abs(180 - x) };
  Object.entries(X).forEach(([xn, xf]) => Object.entries(Y).forEach(([yn, yf]) => FB.forEach((b) => S.push([yn.replace("x", xn) + "／後備 " + b, (N, V) => {
    if (!N.length) return b;
    const i = V.indexOf(yf(xf(N)));
    return i >= 0 ? i : b;
  }]))));
  FB.forEach((b) => S.push(["|題目第一個數 − 最後一個數|／後備 " + b, (N, V) => { if (N.length < 2) return b; const i = V.indexOf(Math.abs(N[0] - N[N.length - 1])); return i >= 0 ? i : b; }]));
  return S;
}
const STRATEGIES = strategies();

// 照前端實際出題順序（H.practiceAt）：第 1 輪 practice，第 2 輪起輪流出 practiceAlt，排到「最後一套接回第一套」
function problems(list) {
  const out = [];
  list.filter((e) => e.kind === "steps" && (e.practice || []).length).forEach((e) => {
    const n = e.practice.length, alts = e.practiceAlt || [];
    const seq = Array.from({ length: n * (alts.length + 2) }, (_, i) => H.practiceAt(e, i));
    if (!seq.every(isNumeric)) return;
    const w = Math.min(3, n);
    STRATEGIES.forEach(([name, f]) => {
      const ok = seq.map((q) => f(nums(q), vals(q)) === q.a);
      for (let s = 0; s + w <= seq.length; s++) {
        if (ok.slice(s, s + w).every(Boolean)) { out.push(e.id + "：出題順序第 " + (s + 1) + "–" + (s + w) + " 題連續答對只靠「" + name + "」就做得到"); break; }
      }
    });
  });
  return out;
}

module.exports = { problems, STRATEGIES, isNumeric };
