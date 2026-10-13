// 各科目站的「補題區」（交辦 #1618，律師 2026-10-13：「這樣是否需要在各科目欄位內加上補題區？」）。
// 四個科目站（自然、數學、國語、社會）共用這一份：<script src="https://windsorya.github.io/g5-help/upload.js">，
// 再 G5Upload.mount("#補題區容器", {subject:"國語", site:"g5-chinese-review", units:[{id,name}]})，回傳 {reload, stop}。
// 走難題站同一條傳題管線（gas/inbox.js 的 op:"upload"／"mine"／"withdraw"），不另開 GAS op：
// 說明前面加「【補題:科目:單元id】」，電腦取題（~/scripts/g5_help_inbox.py）據此知道要做進哪一站的題庫。
// 照片只存在家裡自己的試算表，不放公開網頁（著作權法第 51 條家庭非營利重製；公開題庫只放改寫題）。
// 只有已開啟跨裝置同步的裝置能送（GAS 只收雲端有紀錄的家庭碼）。ES5 寫法（舊 iPad）。tests/upload.test.js、tests/e2e_upload.py
//
// 清單、撤回、上傳的生命週期（連 3 輪審查 FAIL 後，依 Codex 設計者結論 docs/upload-list-lifecycle-codex-designer-20261013.md (d) 重做）：
// - 每個元件同時只有一筆有效的清單查詢；同家庭、同世代再要求刷新（手動或每分鐘自動）就合併等它，不另發。
// - 換家庭、撤回成功、上傳成功 ⇒ 舊查詢失效（先釋放自己的 slot，再 abort）。回應要同時對得上 owner、家庭版本、查詢世代、期限才採用。
// - 撤回、上傳各帶自己的操作身分；換家庭、stop、同容器重掛都讓它們失去資格。舊操作只能結束自己，不碰別人的鎖、草稿、訊息。
// - familyCheck() 只讀家庭碼、作廢狀態，不發請求；要不要查由 refresh() 這個唯一入口決定。每個操作入口與回應入口都先重讀家庭碼。
// - AbortController 只是省資源：abort 沒效果時，上面的規則照樣成立。
(function (root) {
  "use strict";
  var EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec";
  var SUBJECTS = ["國語", "數學", "自然", "社會"];
  var MAX_NOTE = 500;          // cap-why: gas/inbox.js MAX_NOTE（超過 GAS 回 bad-note）
  var MAX_IMG = 850000;        // cap-why: gas/inbox.js MAX_IMAGE 880000，留 3 萬餘裕（同難題站 shrink 門檻）
  var DEADLINE_MS = 90000;     // cap-why: 清單查詢與撤回的期限，Codex 設計者 2026-10-13 設計值（未實測 GAS 延遲）：高於審查反例的 65 秒慢回應，也容許一筆查詢跨過一次 60 秒自動重查；涵蓋 fetch、本文與解析，過了就當這次沒有結果
  var REFRESH_MS = 60000;      // cap-why: 每分鐘自動重查進度（電腦取題不會比這更密；查詢在途時合併、不疊發）
  var FAMILY_MS = 2000;        // cap-why: 同一頁 G5Sync.stop() 不發 storage 事件，只能輪詢補救；只讀 localStorage 一個 key，成本可忽略；換家庭後清單要在幾秒內清空
  var ARM_MS = 5000;           // cap-why: 撤回兩段式的確認窗（同難題站）：5 秒內沒按「確定撤回？」就收回
  var CODE_KEY = "g5sync.code";
  var OWNER = "__g5upload";    // 容器上記著目前擁有它的元件；同容器重掛時先終結前一個
  var UNIT_RE = /^[\w-]{1,30}$/;
  var NO_SYNC = "這台裝置還沒開啟跨裝置同步，所以還不能補題、也看不到進度。";

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function prefix(subject, unit) {
    if (SUBJECTS.indexOf(subject) < 0) throw new Error("bad-subject");
    if (typeof unit !== "string" || !UNIT_RE.test(unit)) throw new Error("bad-unit");
    return "【補題:" + subject + ":" + unit + "】";
  }
  // 清單查詢用的本科前綴（gas/inbox.js PREFIX_RE 只收這個形狀）
  function minePrefix(subject) {
    if (SUBJECTS.indexOf(subject) < 0) throw new Error("bad-subject");
    return "【補題:" + subject + ":";
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
  function isArray(x) { return Object.prototype.toString.call(x) === "[object Array]"; }
  function cleanId(x) { return String(x == null ? "" : x).replace(/[^\w-]/g, ""); }
  // 家庭碼：空字串、null、非字串都當作沒開同步（不能拿空碼去查）
  function familyOf(raw) { return typeof raw === "string" && raw ? raw : null; }
  // GAS 回應：HTTP 不是 2xx、本文不是 JSON、不是物件 ⇒ 丟錯當失敗；錯誤頁、殘缺回應不能當成功（設計者 U15）
  function parseReply(httpOk, text) {
    if (!httpOk) throw new Error("http");
    var j = JSON.parse(text);
    if (!j || typeof j !== "object" || isArray(j)) throw new Error("shape");
    return j;
  }
  // 清單回應：只有 ok:true 且 items 是陣列才算成功；其餘回 null（失敗：保留原清單）
  function mineItems(r) { return r && r.ok === true && isArray(r.items) ? r.items : null; }
  // 撤回回應：ok／done／not-found／fail（伺服器明確說沒撤回）／unknown（回應殘缺：不知道伺服器做了沒有）
  function withdrawOutcome(r) {
    if (r && r.ok === true) return "ok";
    if (r && r.ok === false) return r.err === "done" || r.err === "not-found" ? r.err : "fail";
    return "unknown";
  }
  function withdrawMessage(outcome) {
    if (outcome === "ok") return "撤回了，電腦不會再做這一題。";
    if (outcome === "done") return "這題已經做好了，不能撤回。";
    if (outcome === "not-found") return "找不到這一題，可能已經撤回了。";
    if (outcome === "fail") return "沒有撤回成功，請稍後再試。";
    // net／timeout／unknown：請求可能已經到了伺服器，不能說撤回了，也不能說沒撤回；不自動重送
    return "撤回結果還沒確認（可能沒有網路）。清單重新整理後，這題如果還在，可以再撤回一次。";
  }
  // 已確認撤回的題目：之後任何清單回應都濾掉（撤回前發出的查詢晚到、伺服器慢一步，都不讓它回來）
  function dropWithdrawn(items, gone) {
    return (items || []).filter(function (it) { return !(it && (gone || []).indexOf(cleanId(it.id)) >= 0); });
  }

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
  // 送出並檢查 HTTP 狀態與回應形狀；網路層失敗（含 abort）標 net，其餘（HTTP 錯誤、不是 JSON、不是物件）是回應不對
  function post(ep, body, signal) {
    var opt = { method: "POST", headers: { "Content-Type": "text/plain" }, credentials: "omit", body: JSON.stringify(body) };
    if (signal) opt.signal = signal;
    return fetch(ep, opt).then(function (r) {
      if (!r.ok) throw new Error("http-" + r.status);
      return r.text().then(function (t) { return parseReply(true, t); });
    }, function () { var e = new Error("net"); e.net = true; throw e; });
  }
  function myCode() { var c = null; try { c = localStorage.getItem(CODE_KEY); } catch (e) {} return familyOf(c); }

  var CSS = ".g5u{display:grid;gap:10px}.g5u label{display:grid;gap:4px;font-weight:600}" +
    ".g5u select,.g5u textarea,.g5u input[type=file]{font-size:16px;min-height:44px;padding:6px 10px;border:2px solid #cbd5e1;border-radius:12px;background:inherit;color:inherit}" +
    ".g5u textarea{min-height:72px}.g5u .g5u-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}" +
    ".g5u button{font-size:16px;min-height:44px;padding:8px 16px;border-radius:12px;border:2px solid #2563eb;background:#2563eb;color:#fff;cursor:pointer}" +
    ".g5u button.g5u-ghost{background:transparent;color:inherit;border-color:#cbd5e1}.g5u button:disabled{opacity:.5;cursor:default}" +
    ".g5u .g5u-msg{font-size:15px}.g5u .g5u-bad{color:#b91c1c}.g5u .g5u-good{color:#15803d}" +
    ".g5u .g5u-list{display:grid;gap:8px;border-top:1px solid #e2e8f0;padding-top:10px}.g5u .g5u-card{display:grid;gap:4px;padding:10px;border:1px solid #e2e8f0;border-radius:12px}" +
    ".g5u .g5u-meta{font-size:14px;opacity:.75}";

  // 掛到頁面上；回傳 {reload, stop}：reload 給站內「打開時重抓」與測試用，stop 終結這個元件
  function mount(sel, cfg) {
    var box = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!box || !cfg || SUBJECTS.indexOf(cfg.subject) < 0 || !/^[\w-]+$/.test(cfg.site || "")) return null;
    // 同一個容器只能有一個有效的元件：重掛先終結前一個（它的計時器、監聽、在途查詢／撤回／上傳全部失去資格）
    var prev = box[OWNER];
    if (prev && typeof prev.stop === "function") prev.stop();
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
    var el = box.firstChild;   // 只從自己的根節點找元素：重掛後，舊元件的閉包碰不到新元件的節點
    var $ = function (c) { return el.querySelector(c); };
    var alive = true, handle = { reload: reload, stop: stop };
    box[OWNER] = handle;
    function live() { return alive && box[OWNER] === handle; }
    function msg(node, t, bad) { node.textContent = t; node.classList.toggle("g5u-bad", !!bad); node.classList.toggle("g5u-good", !bad && !!t); }
    function health(t) { $(".g5u-health").textContent = t; }

    var FAMILY = myCode(), FREV = 0;   // 目前的家庭碼與它的版本：每看到一次變化就 +1（A→B→A 也是兩次）
    var GEN = 0, ACTIVE = null;        // 查詢世代、目前唯一有效的在途查詢
    var LAST = null, GONE = [];        // 最後一份有效清單、本家庭已確認撤回的題目 id
    var ARMED = null, WD_OP = null, UP_OP = null;   // 撤回確認、撤回中、上傳中：各是一個操作身分

    function endOp(op) { op.done = true; if (op.timer) { clearTimeout(op.timer); op.timer = null; } }
    function abortQ(q) { if (q.ctl) { try { q.ctl.abort(); } catch (e) {} } }
    function disarm() { if (ARMED) { clearTimeout(ARMED.timer); ARMED = null; } }
    // 舊查詢失效：世代 +1，先釋放自己的 slot，再 abort（abort 沒效果也不影響正確性）
    function dropQuery() {
      GEN += 1;
      var q = ACTIVE;
      ACTIVE = null;
      if (q) { endOp(q); abortQ(q); }
    }
    function lock(on) { [".g5u-send", ".g5u-file", ".g5u-note", ".g5u-unit"].forEach(function (c) { $(c).disabled = on; }); }

    // 家庭碼變了（同一頁停止同步、換家庭、別的分頁改了）：清單清空、在途查詢／撤回確認／撤回／上傳全部作廢，舊操作的鎖由這裡解開。
    // 只讀、只作廢，不發請求（要不要查由 refresh() 決定）。回傳是否換了家庭。
    function familyCheck() {
      if (!live()) return false;
      var c = myCode();
      if (c === FAMILY) return false;
      FAMILY = c; FREV += 1;
      dropQuery(); LAST = null; GONE = [];
      disarm();
      if (WD_OP) { endOp(WD_OP); WD_OP = null; msg($(".g5u-wmsg"), ""); }
      if (UP_OP) {
        var u = UP_OP;
        UP_OP = null; endOp(u); lock(false);
        msg($(".g5u-out"), u.sent ? "同步設定改了（停止同步或換了家庭），後面的照片沒有送出；前面已送出的 " + u.sent + " 張不受影響。" :
          "同步設定改了（停止同步或換了家庭），照片沒有送出；確認後再按一次送出。", true);
      }
      health(FAMILY ? "" : NO_SYNC);
      render();
      return true;
    }

    // 唯一的清單查詢入口：手動 reload()、每分鐘自動、換家庭／撤回／上傳之後都走這裡
    function refresh() {
      if (!live()) return;
      familyCheck();
      if (!FAMILY) { health(NO_SYNC); return; }
      if (ACTIVE) {
        if (Date.now() < ACTIVE.deadline) return;   // 同家庭、同世代已有查詢在途：合併等它，不另發
        endQuery(ACTIVE, "timeout");                // 期限已過、計時器卻被延後（背景分頁、睡眠）：照期限釋放
        if (!live() || ACTIVE) return;
      }
      var q = { family: FAMILY, frev: FREV, gen: GEN, deadline: Date.now() + DEADLINE_MS, done: false, ctl: null, timer: null };
      if (typeof AbortController === "function") { try { q.ctl = new AbortController(); } catch (e) { q.ctl = null; } }
      ACTIVE = q;
      q.timer = setTimeout(function () { endQuery(q, "timeout"); }, DEADLINE_MS);
      // 帶本科前綴：後端先篩本科再取最近 20 筆（Codex 審 8601526）
      post(ep, { op: "mine", code: q.family, prefix: minePrefix(cfg.subject) }, q.ctl ? q.ctl.signal : null).then(function (r) {
        var items = mineItems(r);
        endQuery(q, items ? "ok" : "bad", items);
      }, function (e) { endQuery(q, e && e.net ? "net" : "bad"); });
    }
    // 每筆查詢都從這裡結束（成功、回應不對、網路失敗、逾時、遲到）。要同時對得上 owner、家庭版本、世代、期限才採用。
    function endQuery(q, outcome, items) {
      if (q.done) return;
      if (familyCheck()) { refresh(); return; }   // 回應入口重讀家庭碼：換了家庭，這筆已在 familyCheck 裡作廢
      if (q.done) return;
      if (Date.now() >= q.deadline) outcome = "timeout";   // 過了期限才到：不採用
      var mine = ACTIVE === q;
      endOp(q);
      if (mine) ACTIVE = null;                     // 只清自己的 slot
      if (outcome === "timeout") abortQ(q);        // 先邏輯結束，再 abort
      if (!live() || !mine || q.frev !== FREV || q.gen !== GEN) return;
      if (outcome === "ok") { LAST = { items: dropWithdrawn(items, GONE) }; health(""); render(); return; }
      health(outcome === "net" ? "進度暫時讀不到（可能沒有網路），稍後再看。" : "進度暫時讀不到，稍後再看。");
    }

    // 撤回鈕（兩段式）：第一下只變「確定撤回？」，5 秒內第二下才送
    function onWithdrawButton(id) {
      if (!live()) return;
      if (familyCheck()) { refresh(); return; }   // 換了家庭：舊清單、舊確認都已作廢，這一下不算數（不拿新碼撤舊家的題）
      if (WD_OP || !FAMILY) return;              // 撤回中：其他按鈕就算被點到也不送（不只靠 disabled）
      if (ARMED && ARMED.id === id && ARMED.frev === FREV) { sendWithdraw(id); return; }
      disarm();
      var a = { id: id, frev: FREV, timer: null };
      a.timer = setTimeout(function () { if (ARMED === a) { ARMED = null; render(); } }, ARM_MS);
      ARMED = a; render();
    }
    function sendWithdraw(id) {
      disarm();
      var op = { id: id, family: FAMILY, frev: FREV, deadline: Date.now() + DEADLINE_MS, done: false, timer: null };
      WD_OP = op;
      msg($(".g5u-wmsg"), "撤回中…"); render();
      op.timer = setTimeout(function () { endWithdraw(op, "timeout"); }, DEADLINE_MS);
      post(ep, { op: "withdraw", code: op.family, id: id }).then(function (r) { endWithdraw(op, withdrawOutcome(r)); }, function () { endWithdraw(op, "net"); });
    }
    // 撤回結束：只認自己這筆（操作身分＋家庭版本＋期限）。舊的、過期的、別家的回應不碰畫面，也不解開別人的鎖。
    function endWithdraw(op, outcome) {
      if (op.done) return;
      if (familyCheck()) { refresh(); return; }
      if (op.done) return;
      if (Date.now() >= op.deadline) outcome = "timeout";   // 過了期限才到：當作還沒確認，不冒成功
      var mine = WD_OP === op;
      endOp(op);
      if (mine) WD_OP = null;
      if (!live() || !mine || op.frev !== FREV) return;
      if (outcome === "ok") {
        GONE.push(op.id);   // 本機立刻移除，之後任何回應都濾掉
        dropQuery();        // 撤回前發出的查詢：失效
      }
      msg($(".g5u-wmsg"), withdrawMessage(outcome), outcome !== "ok");
      render();
      refresh();            // 照伺服器現況重查（撤回成功開新世代；沒成功或沒確認也讓清單對上實際狀態）；不重送撤回
    }

    function render() {
      if (!live()) return;
      var list = $(".g5u-items");
      if (!LAST) { list.innerHTML = ""; return; }
      var items = dropWithdrawn(mineFor(LAST.items, cfg.subject), GONE), off = WD_OP ? " disabled" : "";
      list.innerHTML = items.length ? items.map(function (it) {
        var p = parseNote(it.note), id = cleanId(it.id), url = it.status === "done" ? safeDoneUrl(it.url, cfg.site) : "";
        var st = it.status === "done" ? (url ? '<a href="' + url + '">做好了，點這裡練習</a>' : "做好了") : it.status === "fetched" ? "電腦收到了，題目製作中" : "已送出，等電腦取回";
        var wd = it.status === "done" || !id ? "" : '<div class="g5u-row">' + (ARMED && ARMED.id === id ?
          '<button type="button" class="g5u-ghost" data-wd="' + id + '"' + off + '>確定撤回？</button><button type="button" class="g5u-ghost" data-wd-no' + off + '>取消</button>' :
          '<button type="button" class="g5u-ghost" data-wd="' + id + '"' + off + '>撤回</button>') + '</div>';
        return '<div class="g5u-card" data-id="' + id + '"><b>' + esc(unitName(units, p.unit)) + (p.text ? "・" + esc(p.text) : "") + '</b>' +
          '<span class="g5u-meta">' + (typeof it.time === "number" ? hhmm(it.time) + " 送出" : "") + '</span><span class="g5u-st">' + st + '</span>' + wd + '</div>';
      }).join("") : '<span class="g5u-meta">還沒有補過題目。</span>';
      Array.prototype.forEach.call(list.querySelectorAll("button[data-wd]"), function (b) {
        b.onclick = function () { onWithdrawButton(b.getAttribute("data-wd")); };
      });
      Array.prototype.forEach.call(list.querySelectorAll("button[data-wd-no]"), function (b) {
        b.onclick = function () { if (!live() || WD_OP) return; disarm(); render(); };
      });
    }

    $(".g5u-send").onclick = function () {
      if (!live() || UP_OP) return;
      var out = $(".g5u-out");
      if (familyCheck()) {   // 按下去的那一刻家庭碼剛變：不沿用，先讓家長看清楚再送
        refresh();
        return msg(out, FAMILY ? "同步設定剛改了；確認後再按一次送出。" : "請先在本頁「跨裝置同步」開啟或加入同步，這台裝置才能補題。", true);
      }
      if (!FAMILY) return msg(out, "請先在本頁「跨裝置同步」開啟或加入同步，這台裝置才能補題。", true);
      var files = Array.prototype.slice.call($(".g5u-file").files || []);
      if (!files.length) return msg(out, "請先選照片。", true);
      var unit = $(".g5u-unit").value, text = $(".g5u-note").value, oks = [], SKIP = {};
      var op = { family: FAMILY, frev: FREV, done: false, sent: 0, noFamily: false, timer: null };
      UP_OP = op;
      // 送出途中照片、說明、單元、送出鈕都鎖住：途中改的內容不會在送完時被清掉（Codex 審 8601526）
      lock(true);
      // 每一步（縮圖前後、送出前、回應）都重讀家庭碼並核對操作身分：換家庭、stop、重掛之後，後面的照片不送，也不改送別家
      function still() {
        if (op.done) return false;
        if (familyCheck()) refresh();
        return live() && !op.done && UP_OP === op && op.frev === FREV;
      }
      // 一張一張送（每張一次 op:"upload"）；前一張失敗不擋後面的，最後講清楚哪幾張沒送到
      var chain = Promise.resolve();
      files.forEach(function (f, i) {
        chain = chain.then(function () {
          if (!still()) return;
          msg(out, "送出第 " + (i + 1) + "/" + files.length + " 張…");
          return shrink(f).then(function (img) {
            if (!still()) return SKIP;
            op.sent += 1;
            return post(ep, { op: "upload", code: op.family, subject: cfg.subject, note: makeNote(cfg.subject, unit, text, i + 1, files.length), image: img });
          }).then(function (r) {
            if (r === SKIP || !still()) return;
            oks.push(!!(r && r.ok === true));
            if (r && r.err === "no-family") op.noFamily = true;
          }, function () { if (still()) oks.push(false); });
        });
      });
      chain.then(function () {
        if (!still()) return;   // 已被換家庭、stop、重掛終結：不解別人的鎖、不清草稿、不改訊息
        endOp(op); UP_OP = null; lock(false);
        var all = oks.every(Boolean);
        msg(out, op.noFamily ? "這台裝置的同步碼在雲端找不到紀錄：請先在「跨裝置同步」按一次同步再送。" : sendSummary(files.length, oks), !all);
        if (all) { $(".g5u-file").value = ""; $(".g5u-note").value = ""; }
        if (oks.some(Boolean)) dropQuery();   // 上傳成功：舊查詢失效，重查才看得到新題
        refresh();
      });
    };

    // 期限：計時器之外，回應入口、發送前（refresh）、回到前景時都再核對一次
    function checkDeadlines() {
      var now = Date.now();
      if (ACTIVE && now >= ACTIVE.deadline) endQuery(ACTIVE, "timeout");
      if (WD_OP && now >= WD_OP.deadline) endWithdraw(WD_OP, "timeout");
    }
    function onStorage(e) { if (!e || !e.key || e.key === CODE_KEY) { if (familyCheck()) refresh(); } }
    // 回到前景（切回分頁、從上一頁回來）：計時器可能被延後，先照期限收掉過期的，再看家庭碼
    function onShow() { if (!live() || document.visibilityState === "hidden") return; checkDeadlines(); if (familyCheck()) refresh(); }
    var familyTimer = setInterval(function () { if (familyCheck()) refresh(); }, FAMILY_MS);
    var refreshTimer = setInterval(function () {
      if (!live() || document.visibilityState === "hidden" || ARMED || WD_OP) return;   // 撤回確認中、撤回中不自動重畫
      refresh();
    }, REFRESH_MS);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("pageshow", onShow);

    // 重抓：與在途查詢合併（reload 定位為「打開時重抓」，不另開同世代的第二筆）；參數 auto 保留相容，行為相同
    function reload() { if (!live()) return; checkDeadlines(); refresh(); }
    // 終結這個元件：計時器、監聽、在途查詢、撤回、上傳、撤回確認全部失去資格；可重複呼叫
    function stop() {
      if (!alive) return;
      alive = false;
      if (box[OWNER] === handle) box[OWNER] = null;
      clearInterval(familyTimer); clearInterval(refreshTimer);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("pageshow", onShow);
      dropQuery();
      disarm();
      if (WD_OP) { endOp(WD_OP); WD_OP = null; }
      if (UP_OP) { endOp(UP_OP); UP_OP = null; }
    }

    render();
    if (FAMILY) refresh(); else health(NO_SYNC);
    return handle;
  }

  var api = { mount: mount, minePrefix: minePrefix, makeNote: makeNote, parseNote: parseNote, mineFor: mineFor, unitName: unitName, safeDoneUrl: safeDoneUrl, sendSummary: sendSummary, esc: esc, SUBJECTS: SUBJECTS,
    familyOf: familyOf, parseReply: parseReply, mineItems: mineItems, withdrawOutcome: withdrawOutcome, withdrawMessage: withdrawMessage, dropWithdrawn: dropWithdrawn, DEADLINE_MS: DEADLINE_MS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5Upload = api;
})(typeof window !== "undefined" ? window : this);
