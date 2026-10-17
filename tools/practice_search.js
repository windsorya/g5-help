// 角度題練習（直線分角、直角分角、交叉、有無關的角）：用程式搜數值，搜到「230 條固定猜法連對不了 3 題」的兩套題（交辦 #2528）。
// 用法：node tools/practice_search.js [秒數，預設 240]   → 印出 JSON {practice, practiceAlt}，可直接貼進 src/hard.js（why 已依錯法填好）
// 驗收沿用 tests/numshortcuts.js（快篩同一份）；這裡另加資料規則讓搜尋好找：每連續 3 題答案至少一個 <90、一個 ≥90，
// 答案不等於題目裡的數，兩套題幹不重複，每套正解位置各兩次、正解大小名次三種都有。2026-10-17 q6-1-angle-x 用這套搜到、Codex 第 4 輪 PASS。
"use strict";
const NS = require("../tests/numshortcuts.js");

const TYPES = ["line", "right", "three", "cross", "dist", "three"];
const R = (a, b) => a + 5 * Math.floor(Math.random() * ((b - a) / 5 + 1));
const Q = {
  line: (p) => "從直線上的一點，往上畫一條線，分出兩個角。一個是 " + p[0] + " 度，另一個是幾度？",
  right: (p) => "一個直角被一條線分成兩個角。一個是 " + p[0] + " 度，另一個是幾度？",
  three: (p) => "從直線上的一點，往上畫兩條線，分出三個角。其中兩個是 " + p[0] + " 度和 " + p[1] + " 度，第三個是幾度？",
  cross: (p) => "兩條直線交叉，有一個角是 " + p[0] + " 度。它旁邊的角是幾度？",
  dist: (p) => "兩個三角形疊在一起。交叉點上方的角是 " + p[0] + " 度，另外有一個 " + p[1] + " 度的角。和交叉點上方那個角接成一條直線的角是幾度？"
};
// 每種題型：參數、答案、必放的錯法（讓猜法算出的錯值真的出現在選項裡）、可選的錯法
function gen(t) {
  let p, ans, must = [], extra = [];
  if (t === "line" || t === "cross") { p = [R(25, 155)]; ans = 180 - p[0]; extra = [p[0], p[0] - 90, 90 - p[0], ans + 10, ans - 10, ans + 20]; }
  else if (t === "right") { p = [R(15, 75)]; ans = 90 - p[0]; must = [180 - p[0]]; extra = [p[0], ans + 10, ans + 20, ans - 10]; }
  else if (t === "three") { p = [R(20, 100), R(20, 100)]; ans = 180 - p[0] - p[1]; if (ans < 15) return null; must = [180 - p[0], 180 - p[1]]; }
  else { p = [R(95, 140), R(20, 60)]; if (p[0] + p[1] > 170) return null; ans = 180 - p[0]; must = [180 - p[1], 180 - p[0] - p[1]]; extra = [p[1], p[0] - 90, ans + 10, ans + 20, ans - 10]; }
  if (p.includes(ans)) return null;
  must = must.filter((v) => v > 0 && v < 180 && v !== ans);
  if (new Set(must).size !== must.length) return null;
  const d = must.slice(0, 2), pool = extra.filter((v) => v > 0 && v < 180 && v !== ans && !d.includes(v));
  while (d.length < 2 && pool.length) d.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  if (d.length < 2) return null;
  if (t !== "dist" && ans < 90 && !d.some((v) => v > ans && v < 90 && !p.includes(v))) return null;
  return { t, p, ans, d };
}
function why(t, p, ans, v) {
  if (v === ans) return "";
  if (t === "line" || t === "cross") {
    const tail = "這兩個角接成一條直線，合起來是 180 度。180 − " + p[0] + " = " + ans + "。";
    if (v === p[0]) return "兩個角不一定一樣大。" + tail;
    if (v === 90 - p[0]) return v + " 度是 90 − " + p[0] + "。" + tail;
    return tail;
  }
  if (t === "right") return v === 180 - p[0] ? "這兩個角合起來是直角，是 90 度，不是 180 度。90 − " + p[0] + " = " + ans + "。" : "兩個角合起來是直角，是 90 度。90 − " + p[0] + " = " + ans + "。";
  if (t === "three") {
    const all = "180 − " + p[0] + " − " + p[1] + " = " + ans + "。";
    if (v === 180 - p[0]) return v + " 度是 180 − " + p[0] + "，還要再減 " + p[1] + "。" + all;
    if (v === 180 - p[1]) return v + " 度是 180 − " + p[1] + "，還要再減 " + p[0] + "。" + all;
    return "三個角接成一條直線，合起來是 180 度。" + all;
  }
  const tail = "要找的角和交叉點上方那個角合起來是 180 度。180 − " + p[0] + " = " + ans + "。";
  if (v === 180 - p[1]) return v + " 度是 180 − " + p[1] + "。" + p[1] + " 度是別的角，這題用不到。" + tail;
  if (v === 180 - p[0] - p[1]) return v + " 度是 180 − " + p[0] + " − " + p[1] + "。" + p[1] + " 度是別的角，這題用不到。" + tail;
  return tail;
}
const g = (t) => { for (;;) { const x = gen(t); if (x) return x; } };
function mkq(it, pos) { const o = it.d.slice(); o.splice(pos, 0, it.ans); return { q: Q[it.t](it.p), opts: o.map((v) => v + " 度"), a: pos, why: o.map((v) => why(it.t, it.p, it.ans, v)), _: it }; }
function rank(q) { const v = q.opts.map((o) => parseInt(o, 10)), s = [...v].sort((a, b) => a - b); return s.indexOf(v[q.a]); }
function cost(st) {
  const A = st.A.map((it, i) => mkq(it, st.pa[i])), B = st.B.map((it, i) => mkq(it, st.pb[i]));
  let c = NS.problems([{ id: "search", kind: "steps", steps: [], practice: A, practiceAlt: [B] }]).length;
  const seq = [...A, ...B, ...B];
  for (let s = 0; s + 3 <= seq.length; s++) { const w = seq.slice(s, s + 3).map((q) => q._.ans); if (!w.some((a) => a < 90) || !w.some((a) => a >= 90)) c += 3; }
  [A, B].forEach((set) => { const r = set.map(rank); [0, 1, 2].forEach((k) => { if (!r.includes(k)) c += 2; }); });
  [st.pa, st.pb].forEach((P) => [0, 1, 2].forEach((k) => { if (P.filter((x) => x === k).length !== 2) c += 2; }));
  if (new Set(seq.slice(0, 12).map((q) => q.q)).size < 12) c += 5;
  return { c, A, B };
}
function search(ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    let st = { A: TYPES.map(g), B: TYPES.map(g), pa: [0, 1, 2, 0, 1, 2], pb: [2, 0, 1, 2, 0, 1] }, cur = cost(st).c;
    for (let it = 0; it < 3000 && cur > 0; it++) {   // 爬山：換一題或對調兩題的正解位置，不變差就接受
      const nx = { A: st.A.slice(), B: st.B.slice(), pa: st.pa.slice(), pb: st.pb.slice() }, set = Math.random() < 0.5 ? "A" : "B", i = Math.floor(Math.random() * 6);
      if (Math.random() < 0.6) nx[set][i] = g(TYPES[i]); else { const P = set === "A" ? nx.pa : nx.pb, j = Math.floor(Math.random() * 6); [P[i], P[j]] = [P[j], P[i]]; }
      const c = cost(nx).c; if (c <= cur) { st = nx; cur = c; }
    }
    if (cur === 0) { const r = cost(st), strip = (s) => s.map(({ _, ...q }) => q); return { practice: strip(r.A), practiceAlt: [strip(r.B)] }; }
  }
  return null;
}
module.exports = { search, gen, why, Q };
if (require.main === module) {
  const out = search(1000 * (+process.argv[2] || 240));
  if (!out) { console.error("時間內沒搜到，加長秒數再跑"); process.exit(1); }
  console.log(JSON.stringify(out, null, 1));
}
