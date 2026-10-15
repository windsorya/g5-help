// 家長傳題目的進度條（交辦 #1320，律師 2026-10-13：「完成進度條，會隨時間變化嗎？會告知還要等多久嗎」）。
// 已送出 33%＋「最晚 HH:MM 前電腦會取回」（上次取題＋1 分；電腦已逾時就不承諾時間）；
// 製作中 66→95% 依送出後經過時間增加＋「預計 HH:MM 前做好」（已做好題目「送出→做好」耗時的中位數，沒有資料先用 40 分（取題原為 10 分；製作耗時尚無實測，暫不調））；
// 超過預估 95% 封頂、改說比預期久；做好了 100%。時間一律台北時間。tests/upprogress.test.js
(function (root) {
  "use strict";
  var MIN = 60000, FETCH_EVERY = 1 * MIN, DEFAULT_TOTAL = 40 * MIN;   // cap-why: launchd 每 1 分鐘取題一次（律師 2026-10-15：孩子嫌等太久，600→60 秒）（com.lawyer.g5-help-inbox）
  function hhmm(t) { var d = new Date(t + 8 * 3600000); return ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2); }
  function num(x) { return typeof x === "number" && isFinite(x) && x > 0; }
  function estimate(items) {
    var ds = (items || []).filter(function (it) { return it && it.status === "done" && num(it.time) && num(it.doneAt) && it.doneAt > it.time; })
      .map(function (it) { return it.doneAt - it.time; }).sort(function (a, b) { return a - b; });
    if (!ds.length) return DEFAULT_TOTAL;
    var m = ds.length >> 1;
    return ds.length % 2 ? ds[m] : Math.round((ds[m - 1] + ds[m]) / 2);
  }
  function view(it, items, lastFetch, now) {
    if (it.status === "done") return { pct: 100, text: "做好了" };
    if (it.status !== "fetched") {
      // 電腦從沒取過題目＝不知道它在不在跑，不承諾時間（舊版用「現在＋10 分」會每次打開都往後順延）
      if (!num(lastFetch)) return { pct: 33, text: "已送出，等電腦取回" };
      var due = lastFetch + FETCH_EVERY;
      return { pct: 33, text: due >= now ? "已送出，最晚 " + hhmm(due) + " 前電腦會取回" : "已送出，等電腦取回" };
    }
    var start = num(it.time) ? it.time : now, total = estimate(items), eta = start + total;
    if (now > eta) return { pct: 95, text: "製作中，比預期久（可能在等電腦上的 Claude 視窗開著）" };
    var pct = 66 + Math.floor(29 * Math.max(0, now - start) / total);
    return { pct: Math.min(95, pct), text: "製作中，預計 " + hhmm(eta) + " 前做好" };
  }
  var api = { view: view, estimate: estimate, hhmm: hhmm };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5UpProgress = api;
})(typeof window !== "undefined" ? window : this);
