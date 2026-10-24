// 國語選字練習的封版猜法矩陣（2026-10-24 交辦 #4248；Codex 當設計者給的方案 A）。
// 背景：zh-q62-ji 練習審了 3 輪都 FAIL，每輪冒出一種新的表面猜法（題幹提示詞、兩兩循環、看到某字就選、有逗號選第三個）。
// 根因：固定位置、AB 交替、AABB 循環、三位置輪轉合起來涵蓋全部 27 種三題答案位置，「連對 3 題」對全面防猜不可能過。
// ⇒ 篇可設 practiceNeed（學會＝連對幾題），驗收改成這張固定矩陣：每條猜法從第 1 題連跑 56 題（題庫循環），最長連對要 < practiceNeed。
// 矩陣外的新猜法只算建議，不追加 FAIL。
var C = ["即", "極", "及", "級"], B = [-1, 0, 1, 2];
function pickChar(q, c, fb) { var j = q.opts.indexOf(c); return j >= 0 ? j : fb; }
function actions() {   // 19 種：固定位置 3 種＋指定字×後備 16 種
  var a = [0, 1, 2].map(function (p) { return function () { return p; }; });
  C.forEach(function (c) { B.forEach(function (fb) { a.push(function (q) { return pickChar(q, c, fb); }); }); });
  return a;
}
function stem(q) { var m = q.q.match(/「(.*?)」/); return m ? m[1] : q.q; }
var FEATURES = [
  function (q) { return q.q.indexOf("意思") >= 0; }, function (q) { return q.q.indexOf("北") >= 0; }, function (q) { return q.q.indexOf("，") >= 0; },
  function (q) { return Array.from(stem(q)).length % 2 === 0; },
  function (q) { return Array.from(stem(q)).length >= 16; }, function (q) { return Array.from(stem(q)).length >= 20; }, function (q) { return Array.from(stem(q)).length >= 24; },
  function (q) { var s = stem(q); return s.indexOf("□") < s.indexOf("，"); },
  function (q) { return q.opts.indexOf("級") >= 0; }, function (q) { return q.opts.indexOf("及") >= 0; }
];
function perms(a) { if (a.length < 2) return [a]; var out = []; a.forEach(function (x, i) { perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(function (r) { out.push([x].concat(r)); }); }); return out; }
// 每條策略：f(q, i, prev) → 選第幾個（-1＝錯）
function strategies(P) {
  var S = [], A = actions();
  A.forEach(function (f, k) { S.push({ name: "固定選法" + k, f: f }); });
  var pats = function (x, y) { return [[x, y], [x, x, y, y]]; };
  [0, 1, 2].forEach(function (x) { [0, 1, 2].forEach(function (y) { if (x === y) return; pats(x, y).forEach(function (pt) { for (var ph = 0; ph < pt.length; ph++) (function (pt, ph) {
    S.push({ name: "位置循環" + pt.join("") + "@" + ph, f: function (q, i) { return pt[(i + ph) % pt.length]; } }); })(pt, ph); }); }); });
  C.forEach(function (x) { C.forEach(function (y) { if (x === y) return; pats(x, y).forEach(function (pt) { for (var ph = 0; ph < pt.length; ph++) B.forEach(function (fb) { (function (pt, ph, fb) {
    S.push({ name: "字循環" + pt.join("") + "@" + ph + "/" + fb, f: function (q, i) { return pickChar(q, pt[(i + ph) % pt.length], fb); } }); })(pt, ph, fb); }); }); }); });
  [-1, 1].forEach(function (d) { [0, 1, 2].forEach(function (k) { S.push({ name: "位置輪轉" + d + "+" + k, f: function (q, i) { return (((i * d + k) % 3) + 3) % 3; } }); }); });
  [0, 1, 2].forEach(function (d) { S.push({ name: "前題位置+" + d, f: function (q, i, p) { return p ? (p.a + d) % 3 : -1; } }); });
  B.forEach(function (fb) { S.push({ name: "選前題正解字/" + fb, f: function (q, i, p) { return p ? pickChar(q, p.opts[p.a], fb) : -1; } }); });
  S.push({ name: "排除前題正解字選最左", f: function (q, i, p) { if (!p) return -1; var t = p.opts[p.a]; for (var j = 0; j < q.opts.length; j++) if (q.opts[j] !== t) return j; return -1; } });
  S.push({ name: "排除前題正解字選最右", f: function (q, i, p) { if (!p) return -1; var t = p.opts[p.a]; for (var j = q.opts.length - 1; j >= 0; j--) if (q.opts[j] !== t) return j; return -1; } });
  FEATURES.forEach(function (ft, fi) { A.forEach(function (fx, x) { A.forEach(function (fy, y) {
    S.push({ name: "特徵" + fi + "?" + x + ":" + y, f: function (q, i, p) { return ft(q) ? fx(q, i, p) : fy(q, i, p); } }); }); }); });
  perms(C).forEach(function (pr) { S.push({ name: "偏好" + pr.join(""), f: function (q) { for (var k = 0; k < pr.length; k++) { var j = q.opts.indexOf(pr[k]); if (j >= 0) return j; } return -1; } }); });
  P.forEach(function (pj, j) { A.forEach(function (fa, x) {
    S.push({ name: "只認得第" + (j + 1) + "題/" + x, f: function (q, i, p) { return q.q === pj.q ? q.opts.indexOf(pj.opts[pj.a]) : fa(q, i, p); } }); }); });
  return S;
}
function worst(P, len) {
  len = len || 56;
  var seq = []; for (var i = 0; i < len; i++) seq.push(P[i % P.length]);
  var best = { streak: 0, name: "" };
  strategies(P).forEach(function (s) {
    var c = 0, b = 0;
    seq.forEach(function (q, i) { if (s.f(q, i, i ? seq[i - 1] : null) === q.a) { c++; if (c > b) b = c; } else c = 0; });
    if (b > best.streak) best = { streak: b, name: s.name };
  });
  return best;
}
module.exports = { worst: worst, strategies: strategies };
