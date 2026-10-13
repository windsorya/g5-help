// Codex 審 2cae2c9（2026-10-13 第 8 輪）B15／B18／B19／採字回條新鮮度：每一條先寫成會紅的測試（舊碼紅、新碼綠）。
// 2026-10-13 設計 D 降級（docs/designD-downgrade-20261013.md）：句長閘（B19，40 字）仍擋件；B18「現行回饋都有對應分支」改為提醒（只印警告），
//   B15／B18 不在自動保證範圍，改人工抽查（node tests/kidcontract.js --checklist）。偵測器自身行為的測試照舊斷言。
// 執行：node --test tests/kidgate.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const KG = require("./kidgate.js");
const KT = require("./kidtext.js");

// ---- 最小記憶體 DOM（只實作 KidGate.harvest 用到的介面）----
function mkDom(spec) {
  const doc = {};
  function el(tag, attrs = {}, kids = [], style = {}) {
    const e = {nodeType: 1, tagName: tag.toUpperCase(), id: attrs.id || "", hidden: false, open: false, namespaceURI: "http://www.w3.org/1999/xhtml",
      style, childNodes: [], parentElement: null, parentNode: null};
    e.closest = (sel) => {
      const parts = sel.split(",").map((x) => x.trim());
      for (let n = e; n; n = n.parentElement) {
        if (parts.some((p) => (p[0] === "#" && /^#[\w-]+$/.test(p) && n.id === p.slice(1)) || (/^[a-z]+$/.test(p) && n.tagName === p.toUpperCase()))) return n;
      }
      return null;
    };
    kids.forEach((k) => { k.parentElement = e; k.parentNode = e; e.childNodes.push(k); });
    return e;
  }
  const txt = (v) => ({nodeType: 3, nodeValue: v, parentElement: null, parentNode: null, childNodes: []});
  const body = spec(el, txt);
  doc.body = body;
  doc.createTreeWalker = (rootNode) => {
    const order = [];
    (function walk(n) { n.childNodes.forEach((c) => { order.push(c); walk(c); }); })(rootNode);
    let i = -1;
    return {nextNode: () => (++i < order.length ? order[i] : null)};
  };
  const BLOCK = /^(BODY|DIV|P|SECTION|MAIN|H2)$/;
  const win = {getComputedStyle: (e) => ({display: e.style.display || (BLOCK.test(e.tagName) ? "block" : "inline"), visibility: "visible",
    whiteSpace: e.style.whiteSpace || (e.parentElement ? win.getComputedStyle(e.parentElement).whiteSpace : "normal")})};
  return {doc, win};
}
const A = "甲".repeat(25), B = "乙".repeat(25);

test("B15 white-space:pre-line 下兩個 span 中間是「純換行」的文字節點 ⇒ 是真正換行（句界），各 25 字通過", () => {
  const {doc, win} = mkDom((el, txt) => el("body", {}, [el("div", {id: "lesson"}, [
    el("div", {}, [el("span", {}, [txt(A)]), txt("\n"), el("span", {}, [txt(B + "。")])], {whiteSpace: "pre-line"})])]));
  const blocks = KG.harvest(doc, win);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].text, A + "\n" + B + "。", "換行要留下來當句界：" + JSON.stringify(blocks[0].text));
  assert.deepEqual(KG.evaluate(blocks, [], 40).filter((v) => v.kind === "length"), [], "兩段各 25 字，不能被合成 50 字");
});

test("B15 反例：white-space:normal 下原始碼換行只是空白（瀏覽器畫成同一行）⇒ 照樣合成 50 字攔下", () => {
  const {doc, win} = mkDom((el, txt) => el("body", {}, [el("div", {id: "lesson"}, [
    el("div", {}, [el("span", {}, [txt(A)]), txt("\n"), el("span", {}, [txt(B + "。")])])])]));
  const v = KG.evaluate(KG.harvest(doc, win), [], 40);
  assert.ok(v.some((x) => x.kind === "length" && x.chars === 50), JSON.stringify(v));
});

test("B15 pre 與 pre-wrap 一樣算換行；只有空格的文字節點在 pre-line 下不算句界", () => {
  ["pre", "pre-wrap", "break-spaces"].forEach((ws) => {
    const {doc, win} = mkDom((el, txt) => el("body", {}, [el("div", {id: "lesson"}, [
      el("div", {}, [el("span", {}, [txt(A)]), txt("\n"), el("span", {}, [txt(B)])], {whiteSpace: ws})])]));
    assert.deepEqual(KG.evaluate(KG.harvest(doc, win), [], 40), [], ws);
  });
  const {doc, win} = mkDom((el, txt) => el("body", {}, [el("div", {id: "lesson"}, [
    el("div", {}, [el("span", {}, [txt(A)]), txt("   "), el("span", {}, [txt(B)])], {whiteSpace: "pre-line"})])]));
  assert.ok(KG.evaluate(KG.harvest(doc, win), [], 40).some((x) => x.kind === "length"), "空格不是句界");
});

// ---- B18：「這步看不懂」回饋與第二分頁提示 ----
const APP = fs.readFileSync(path.join(__dirname, "../src/app.html"), "utf8");
const SECT = APP.slice(APP.indexOf("// ---------- 互動元件"), APP.indexOf("// ---------- 首頁按鈕"));

test("B18 「這步看不懂」的每個回饋（沒開同步／送出中／收到了／沒送成功／沒網路）都是要實際走到的分支", () => {
  const need = ["app:confused-nocode", "app:confused-sending", "app:confused-ok", "app:confused-fail", "app:confused-net"];
  const req = KT.requiredBranches();
  need.forEach((b) => assert.ok(req.includes(b), "缺分支 " + b));
  require("./kidcontract.js").remind("回饋分支提醒（appBranchProblems；設計 D 降級為提醒，不擋件）", KT.appBranchProblems());
});

test("B18 用 .textContent 寫的新回饋字串、沒有對應分支 ⇒ 完整性檢查要紅（不能只找 msg:）", () => {
  // 偵測器自身的測試：只比「加了這一行」前後的差異；現行內容本身有幾筆提醒不影響（設計 D 降級：提醒不擋件，Codex 審 d4c6e4f）
  const base = KT.appBranchProblems(SECT).length;
  assert.ok(KT.appBranchProblems(SECT + '\n  msg.textContent = "新加的回饋，' + "很".repeat(100) + '。";\n').length > base, "新加 textContent 回饋");
  assert.ok(KT.appBranchProblems(SECT + '\n  msg.textContent = ok ? "收到了！會換一個更好懂的說法" : "另一個新的回饋";\n').length > base, "三元運算的第二個字串也算一個分支");
  assert.deepEqual(KT.appBranchProblems(SECT + "\n  el.textContent = msg;\n"), KT.appBranchProblems(SECT), "沒有字面字串的指定（交給別處的分支）不算");
});

test("B18 第二分頁提示、取鎖被拒提示：列為採字案例；每句不超過 40 字", () => {
  const cases = KT.requiredCases();
  ["readonly:second-tab", "readonly:lockfail", "readonly:nolocks"].forEach((c) => assert.ok(cases.includes(c), "缺案例 " + c));
  assert.deepEqual(KT.noticeProblems(), [], "app.html 裡每個 READONLY_MSG 都對到案例");
  assert.ok(KT.noticeProblems(APP + '\nREADONLY_MSG = "新的唯讀提示。";\n').length, "新加一種唯讀提示、沒有案例 ⇒ 要紅");
  const msgs = [...APP.matchAll(/READONLY_MSG = "([^"]+)"/g)].map((m) => m[1]);
  assert.equal(msgs.length, 3);
  msgs.forEach((m) => assert.deepEqual(KG.evaluate([{text: m, cat: "kid", unit: "top"}], [], 40), [], m));
});

// ---- B19：正式採字的句長上限固定 40，不跟執行日期漂移 ----
function withDate(iso, fn) {
  const Real = Date, fixed = new Real(iso).getTime();
  class Fake extends Real { constructor(...a) { if (a.length) super(...a); else super(fixed); } static now() { return fixed; } }
  global.Date = Fake;
  try { return fn(); } finally { global.Date = Real; }
}
test("B19 正式上限固定 40：2026-10-13 與 2027-10-13 判同一份採字結果，結論一樣（上限不跟日期變成 45）", () => {
  assert.equal(KT.OFFICIAL_MAX, 40);
  const h = KT.readHarvest();
  assert.ok(h, "要有採字結果");
  const a = withDate("2026-10-13T12:00:00+08:00", () => KT.harvestProblems(["length"]).filter((p) => /上限/.test(p)));
  const b = withDate("2027-10-13T12:00:00+08:00", () => KT.harvestProblems(["length"]).filter((p) => /上限/.test(p)));
  assert.deepEqual(a, []); assert.deepEqual(b, [], "隔年執行不能因年級上限變 45 而改變判定");
  assert.ok(KT.harvestProblems(["length"], {harvest: Object.assign({}, h, {max: 45})}).some((p) => /上限/.test(p)), "採字時用了 45 ⇒ 要紅");
  const drv = fs.readFileSync(path.join(__dirname, "e2e_kidtext.py"), "utf8");
  assert.ok(!/readingAt\(new Date\(\)\)/.test(drv), "採字 driver 不能用 readingAt(new Date()) 決定上限");
});
test("B19 年級換算另外測（固定日期）：小五 40、小六 45", () => {
  const H = require("../src/hard.js");
  assert.equal(H.readingAt(new Date("2026-10-13T12:00:00+08:00")).maxSentence, 40);
  assert.equal(H.readingAt(new Date("2027-07-31T12:00:00+08:00")).maxSentence, 40);
  assert.equal(H.readingAt(new Date("2027-10-13T12:00:00+08:00")).maxSentence, 45);
  assert.equal(H.READING[5].maxSentence, KT.OFFICIAL_MAX, "正式上限＝小五那一格");
});

// ---- 採字回條新鮮度：每個瀏覽器各自記它是用哪一版 index.html／採字器／driver 量的 ----
test("新鮮度：只重跑 chromium 時，WebKit 的舊結果若採字器或 driver 已變 ⇒ 判失效，不能沿用", () => {
  const h = KT.readHarvest();
  assert.ok(h && h.browsers && h.browsers.webkit && h.browsers.chromium);
  assert.deepEqual(KT.harvestProblems(["word", "length", "unclassified"], {harvest: h}).filter((p) => /過期/.test(p)), [], "前置：目前結果是新的");
  for (const field of ["kidgate_sha256", "driver_sha256", "index_sha256"]) {
    const stale = JSON.parse(JSON.stringify(h));
    stale.browsers.webkit[field] = "0".repeat(64);   // 頂層的 hash 是新的（--only chromium 換掉的），WebKit 那份是舊版量的
    const p = KT.harvestProblems(["word"], {harvest: stale});
    assert.ok(p.some((x) => /^webkit：採字結果過期/.test(x)), field + "：WebKit 要判過期：" + p.join(" | "));
    assert.ok(!p.some((x) => /^chromium：採字結果過期/.test(x)), field + "：Chromium 是新的");
  }
  const legacy = JSON.parse(JSON.stringify(h));
  delete legacy.browsers.webkit.kidgate_sha256;
  assert.ok(KT.harvestProblems(["word"], {harvest: legacy}).some((x) => /^webkit：採字結果過期/.test(x)), "舊格式（沒有逐瀏覽器 hash）也判過期");
});
