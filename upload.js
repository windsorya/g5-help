// 各科目站的「補題區」（交辦 #1618，律師 2026-10-13：「這樣是否需要在各科目欄位內加上補題區？」）。
// 四個科目站（自然、數學、國語、社會）共用這一份：<script src="https://windsorya.github.io/g5-help/upload.js">，
// 再 G5Upload.mount("#補題區容器", {subject:"國語", site:"g5-chinese-review", units:[{id,name}]})。
// 走難題站同一條傳題管線（gas/inbox.js 的 op:"upload"／"mine"／"withdraw"），不另開 GAS op：
// 說明前面加「【補題:科目:單元id】」，電腦取題（~/scripts/g5_help_inbox.py）據此知道要做進哪一站的題庫。
// 照片只存在家裡自己的試算表，不放公開網頁（著作權法第 51 條家庭非營利重製；公開題庫只放改寫題）。
// 只有已開啟跨裝置同步的裝置能送（GAS 只收雲端有紀錄的家庭碼）。ES5 寫法（舊 iPad）。tests/upload.test.js、tests/e2e_upload.py
(function (root) {
  "use strict";
  var EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec";
  var SUBJECTS = ["國語", "數學", "自然", "社會"];
  var MAX_NOTE = 500;          // cap-why: gas/inbox.js MAX_NOTE（超過 GAS 回 bad-note）
  var MAX_IMG = 850000;        // cap-why: gas/inbox.js MAX_IMAGE 880000，留 3 萬餘裕（同難題站 shrink 門檻）
  var UNIT_RE = /^[\w-]{1,30}$/;

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function prefix(subject, unit) {
    if (SUBJECTS.indexOf(subject) < 0) throw new Error("bad-subject");
    if (typeof unit !== "string" || !UNIT_RE.test(unit)) throw new Error("bad-unit");
    return "【補題:" + subject + ":" + unit + "】";
  }
  // 家長的字放中間，超長時只截家長的字（前綴與「第幾張」一定留著，取題腳本靠它們）
  function makeNote(subject, unit, text, i, n) {
    var head = prefix(subject, unit), tail = n > 1 ? "（第 " + i + "/" + n + " 張）" : "";
    var room = MAX_NOTE - head.length - tail.length;
    return head + String(text || "").slice(0, Math.max(0, room)) + tail;
  }
  function parseNote(note) {
    var m = /^【補題:([^:】]+):([\w-]{1,30})】([\s\S]*)$/.exec(typeof note === "string" ? note : "");
    return m ? { subject: m[1], unit: m[2], text: m[3] } : null;
  }
  function mineFor(items, subject) {
    return (items || []).filter(function (it) {
      var p = it && parseNote(it.note);
      return p && p.subject === subject && it.status !== "withdrawn";
    });
  }
  function unitName(units, id) {
    if (id === "all") return "不分單元";
    for (var i = 0; i < (units || []).length; i += 1) { if (units[i].id === id) return units[i].name; }
    return id;
  }
  function safeDoneUrl(url, site) {
    var re = new RegExp("^https://windsorya\\.github\\.io/" + site.replace(/[^\w-]/g, "") + "/#c/[\\w-]+$");
    return typeof url === "string" && re.test(url) ? url : "";
  }
  function sendSummary(n, oks) {
    var good = oks.filter(Boolean).length, bad = [];
    oks.forEach(function (ok, i) { if (!ok) bad.push(i + 1); });
    if (!bad.length) return n > 1 ? n + " 張都送出了！" : "送出了！";
    if (!good) return "沒有送出，請稍後再試（照片還在，直接再按一次送出）。";
    return "送出 " + good + " 張；第 " + bad.join("、") + " 張沒有送出，請只選那幾張再送一次。";
  }
  function hhmm(t) { var d = new Date(t + 8 * 3600000); return (d.getUTCMonth() + 1) + "/" + d.getUTCDate() + " " + ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2); }

  function shrink(file) {
    return new Promise(function (ok, no) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        var q = 0.8, d = c.toDataURL("image/jpeg", q);
        while (d.length > MAX_IMG && q > 0.3) { q -= 0.1; d = c.toDataURL("image/jpeg", q); }
        if (d.length > MAX_IMG) no(new Error("big")); else ok(d);
      };
      img.onerror = function () { URL.revokeObjectURL(url); no(new Error("img")); };
      img.src = url;
    });
  }
  function post(ep, body) {
    return fetch(ep, { method: "POST", headers: { "Content-Type": "text/plain" }, credentials: "omit", body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }
  function myCode() { var c = null; try { c = localStorage.getItem("g5sync.code"); } catch (e) {} return c; }

  var CSS = ".g5u{display:grid;gap:10px}.g5u label{display:grid;gap:4px;font-weight:600}" +
    ".g5u select,.g5u textarea,.g5u input[type=file]{font-size:16px;min-height:44px;padding:6px 10px;border:2px solid #cbd5e1;border-radius:12px;background:inherit;color:inherit}" +
    ".g5u textarea{min-height:72px}.g5u .g5u-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}" +
    ".g5u button{font-size:16px;min-height:44px;padding:8px 16px;border-radius:12px;border:2px solid #2563eb;background:#2563eb;color:#fff;cursor:pointer}" +
    ".g5u button.g5u-ghost{background:transparent;color:inherit;border-color:#cbd5e1}.g5u button:disabled{opacity:.5;cursor:default}" +
    ".g5u .g5u-msg{font-size:15px}.g5u .g5u-bad{color:#b91c1c}.g5u .g5u-good{color:#15803d}" +
    ".g5u .g5u-list{display:grid;gap:8px;border-top:1px solid #e2e8f0;padding-top:10px}.g5u .g5u-card{display:grid;gap:4px;padding:10px;border:1px solid #e2e8f0;border-radius:12px}" +
    ".g5u .g5u-meta{font-size:14px;opacity:.75}";

  // 掛到頁面上；回傳 {reload} 給測試／站內「打開時重抓」用
  function mount(sel, cfg) {
    var box = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!box || !cfg || SUBJECTS.indexOf(cfg.subject) < 0 || !/^[\w-]+$/.test(cfg.site || "")) return null;
    var ep = cfg.endpoint || EP, units = (cfg.units || []).filter(function (u) { return u && UNIT_RE.test(u.id) && u.id !== "all"; });
    if (!document.getElementById("g5u-css")) { var st = document.createElement("style"); st.id = "g5u-css"; st.textContent = CSS; document.head.appendChild(st); }
    box.innerHTML = '<div class="g5u">' +
      '<p class="g5u-meta">題庫裡沒有的題目（課本、習作、考卷），拍照傳上來，電腦會改寫成練習題加進本站。照片只存在家裡自己的試算表，不會放上網站。</p>' +
      '<label>哪一課／哪一單元<select class="g5u-unit">' + units.map(function (u) { return '<option value="' + esc(u.id) + '">' + esc(u.name) + '</option>'; }).join("") +
      '<option value="all">不分單元</option></select></label>' +
      '<label>照片（可以一次選好幾張）<input type="file" class="g5u-file" accept="image/*" multiple></label>' +
      '<label>想練什麼（可不填）<textarea class="g5u-note" maxlength="400" placeholder="例：第 3 課的生字和注音；習作第 12 頁第 2 大題"></textarea></label>' +
      '<div class="g5u-row"><button type="button" class="g5u-send">送出</button><span class="g5u-msg g5u-out" aria-live="polite"></span></div>' +
      '<div class="g5u-list"><b>你補的題目</b><span class="g5u-meta g5u-health"></span><span class="g5u-msg g5u-wmsg" aria-live="polite"></span><div class="g5u-items"></div></div></div>';
    var $ = function (c) { return box.querySelector(c); };
    function msg(el, t, bad) { el.textContent = t; el.classList.toggle("g5u-bad", !!bad); el.classList.toggle("g5u-good", !bad); }

    // 清單查詢：撤回成功換世代（撤回前的查詢晚到不採用）；同世代只採用比上次新的；自動重查不疊發（同難題站 Codex 審 81963cee、4317a96）
    var SEQ = 0, APPLIED = 0, EPOCH = 0, INFLIGHT = 0, LAST = null, WD = null, WD_T = null;
    function render() {
      var items = mineFor(LAST && LAST.items, cfg.subject), list = $(".g5u-items");
      list.innerHTML = items.length ? items.map(function (it) {
        var p = parseNote(it.note), id = String(it.id || "").replace(/[^\w-]/g, ""), url = it.status === "done" ? safeDoneUrl(it.url, cfg.site) : "";
        var st = it.status === "done" ? (url ? '<a href="' + url + '">做好了，點這裡練習</a>' : "做好了") : it.status === "fetched" ? "電腦收到了，題目製作中" : "已送出，等電腦取回";
        var wd = it.status === "done" || !id ? "" : '<div class="g5u-row">' + (WD === id ?
          '<button type="button" class="g5u-ghost" data-wd="' + id + '">確定撤回？</button><button type="button" class="g5u-ghost" data-wd-no>取消</button>' :
          '<button type="button" class="g5u-ghost" data-wd="' + id + '">撤回</button>') + '</div>';
        return '<div class="g5u-card" data-id="' + id + '"><b>' + esc(unitName(units, p.unit)) + (p.text ? "・" + esc(p.text) : "") + '</b>' +
          '<span class="g5u-meta">' + (typeof it.time === "number" ? hhmm(it.time) + " 送出" : "") + '</span><span class="g5u-st">' + st + '</span>' + wd + '</div>';
      }).join("") : '<span class="g5u-meta">還沒有補過題目。</span>';
      Array.prototype.forEach.call(list.querySelectorAll("button[data-wd]"), function (b) {
        b.onclick = function () { var id = b.getAttribute("data-wd"); if (WD === id) withdraw(id, b); else arm(id); };
      });
      Array.prototype.forEach.call(list.querySelectorAll("button[data-wd-no]"), function (b) { b.onclick = function () { arm(null); }; });
    }
    function arm(id) { if (WD_T) clearTimeout(WD_T); WD = id; WD_T = id ? setTimeout(function () { WD = null; WD_T = null; render(); }, 5000) : null; render(); }
    function withdraw(id, btn) {
      var code = myCode(); if (!code) return;
      if (WD_T) { clearTimeout(WD_T); WD_T = null; }
      btn.disabled = true; msg($(".g5u-wmsg"), "撤回中…");
      post(ep, { op: "withdraw", code: code, id: id }).then(function (r) {
        WD = null;
        if (r && r.ok) { EPOCH += 1; msg($(".g5u-wmsg"), "撤回了，電腦不會再做這一題。"); load(); return; }
        msg($(".g5u-wmsg"), r && r.err === "done" ? "這題已經做好了，不能撤回。" : r && r.err === "not-found" ? "找不到這一題，可能已經撤回了。" : "沒有撤回成功，請稍後再試。", true);
        render();
      }).catch(function () { WD = null; msg($(".g5u-wmsg"), "沒有撤回成功（可能沒有網路），請稍後再試。", true); render(); });
    }
    function load(auto) {
      var code = myCode();
      if (!code) { $(".g5u-health").textContent = "這台裝置還沒開啟跨裝置同步，所以還不能補題、也看不到進度。"; return; }
      if (auto && INFLIGHT > 0) return;
      var mySeq = ++SEQ, myEpoch = EPOCH, landed = false;
      INFLIGHT += 1;
      var fin = function () { if (!landed) { landed = true; INFLIGHT -= 1; } };
      var stale = function () { return myEpoch !== EPOCH || mySeq < APPLIED; };
      post(ep, { op: "mine", code: code }).then(function (r) {
        fin(); if (stale()) return; APPLIED = mySeq;
        if (!r || !r.ok) { $(".g5u-health").textContent = "進度暫時讀不到，稍後再看。"; return; }
        $(".g5u-health").textContent = "";
        LAST = r; render();
      }).catch(function () { fin(); if (!stale()) $(".g5u-health").textContent = "進度暫時讀不到（可能沒有網路），稍後再看。"; });
    }
    $(".g5u-send").onclick = function () {
      var out = $(".g5u-out"), code = myCode();
      if (!code) return msg(out, "請先在本頁「跨裝置同步」開啟或加入同步，這台裝置才能補題。", true);
      var files = Array.prototype.slice.call($(".g5u-file").files || []);
      if (!files.length) return msg(out, "請先選照片。", true);
      var unit = $(".g5u-unit").value, text = $(".g5u-note").value, btn = this, oks = [];
      btn.disabled = true;
      // 一張一張送（每張一次 op:"upload"）；前一張失敗不擋後面的，最後講清楚哪幾張沒送到
      var chain = Promise.resolve();
      files.forEach(function (f, i) {
        chain = chain.then(function () {
          msg(out, "送出第 " + (i + 1) + "/" + files.length + " 張…");
          return shrink(f).then(function (img) {
            return post(ep, { op: "upload", code: code, subject: cfg.subject, note: makeNote(cfg.subject, unit, text, i + 1, files.length), image: img });
          }).then(function (r) { oks.push(!!(r && r.ok)); if (r && r.err === "no-family") oks.noFamily = true; }, function () { oks.push(false); });
        });
      });
      chain.then(function () {
        btn.disabled = false;
        var all = oks.every(Boolean);
        msg(out, oks.noFamily ? "這台裝置的同步碼在雲端找不到紀錄：請先在「跨裝置同步」按一次同步再送。" : sendSummary(files.length, oks), !all);
        if (all) { $(".g5u-file").value = ""; $(".g5u-note").value = ""; }
        load();
      });
    };
    load();
    var timer = setInterval(function () { if (!WD && document.visibilityState !== "hidden") load(true); }, 60000);
    return { reload: load, stop: function () { clearInterval(timer); } };
  }

  var api = { mount: mount, makeNote: makeNote, parseNote: parseNote, mineFor: mineFor, unitName: unitName, safeDoneUrl: safeDoneUrl, sendSummary: sendSummary, esc: esc, SUBJECTS: SUBJECTS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5Upload = api;
})(typeof window !== "undefined" ? window : this);
