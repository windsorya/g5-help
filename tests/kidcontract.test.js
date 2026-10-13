// 孩子看得到的字：寫法提醒測試（設計 D 4agent 最終方案；2026-10-13 依 4agent 停止條件降級，Codex 審 4271bb4）。
// ⚠️ 降級：K 規則已從「擋件」改為「提醒」——現行內容有違反只印警告清單，不讓 node 全套紅（docs/designD-downgrade-20261013.md）。
// 採字器的自動保證範圍只到句長閘量得到的實際畫面文字；B15（巢狀 white-space）、B18（非標準寫法的回饋）不在自動保證範圍，
// 改列人工抽查清單（node tests/kidcontract.js --checklist）。下面的反例測試只驗「提醒工具本身會對這些寫法出聲」，不代表能擋住所有寫法：
// Codex 審 4271bb4 已證實跨行中轉、fb() 新分支、class="ok fb" 都能繞過。
// 執行：node --test tests/kidcontract.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const KC = require("./kidcontract.js");
const KT = require("./kidtext.js");

const app = KC.section();
const LONG = "很".repeat(100);
// 植入點（現行原始碼裡的固定字句；找不到＝植入點過期，測試要跟著改）
const SENDING = 'btn.disabled = true; msg.textContent = "送出中…";';
const FBVAR = 'var out = $(".fb", row), hb = $(".hint", row), lvl = 0;';
const FBHTML = "'<div class=\"fb ok\">' + (clean ?";
function plant(find, replace) {
  assert.ok(app.src.includes(find), "植入點不在互動元件區段：" + find);
  return app.src.replace(find, replace);
}
const rules = (src) => KC.contractProblems(src, app.offset).map((p) => p.split(" ")[0]);

test("現行互動元件區段：寫法提醒（降級為提醒，違反只印警告、不擋件）", () => {
  const list = KC.currentProblems();
  assert.ok(Array.isArray(list));
  KC.remind("寫法提醒 K1–K7", list);
});

test("區段錨點缺或重複 ⇒ 丟錯（不默默掃空字串）", () => {
  assert.throws(() => KC.section("沒有錨點"), /區段標記/);
  assert.throws(() => KC.section(KC.START + "\n" + KC.START + "\n" + KC.END), /區段標記/);
});

// 反例：每一個都是 Codex 審 b0b24f1 的實際攻擊形狀（在 confused() 加 n===2 回饋、對 .fb 塞子元素）或同類寫法
const CASES = [
  ["B18 單引號 .textContent 回饋", "K2", plant(SENDING, "if (n === 2) { msg.textContent = '" + LONG + "'; return; } " + SENDING)],
  ["B18 反引號 .textContent 回饋", "K1", plant(SENDING, "if (n === 2) { msg.textContent = `" + LONG + "`; return; } " + SENDING)],
  ["B18 反引號（不在回饋行，例如先存變數）", "K1", plant(SENDING, "var t2 = `第 ${n} 步" + LONG + "`; " + SENDING)],
  ["B18 跨行 .textContent（雙引號放下一行）", "K3", plant(SENDING, "if (n === 2) { msg.textContent =\n    \"" + LONG + "\"; return; } " + SENDING)],
  ["B18 跨行 .textContent（字串串接接到下一行）", "K3", plant(SENDING, "if (n === 2) { msg.textContent = \"第 \" + n +\n    \"" + LONG + "\"; return; } " + SENDING)],
  ["B18 msg: 單引號", "K2", plant(SENDING, "var r9 = {ok:false, msg:'" + LONG + "'}; " + SENDING)],
  ["B18 msg: 值放下一行", "K3", plant(SENDING, "var r9 = {ok:false, msg:\n    \"" + LONG + "\"}; " + SENDING)],
  ["B18 fb( 單引號訊息", "K2", plant(FBVAR, FBVAR + " fb(out, false, '" + LONG + "');")],
  ["B18 innerText 寫字", "K4", plant(SENDING, "if (n === 2) { msg.innerText = \"" + LONG + "\"; return; } " + SENDING)],
  ["B18 createTextNode 寫字", "K4", plant(SENDING, "if (n === 2) { msg.appendChild(document.createTextNode(\"" + LONG + "\")); return; } " + SENDING)],
  ["B15 .fb innerHTML", "K5", plant(FBVAR, FBVAR + " out.innerHTML = '<span style=\"white-space:normal\">x</span>';")],
  ["B15 .fb appendChild", "K5", plant(FBVAR, FBVAR + " out.appendChild(document.createElement(\"span\"));")],
  ["B15 .fb 另取別名再塞", "K5", plant(FBVAR, FBVAR + " var o2 = out; o2.innerHTML = \"x\";")],
  ["B15 .fb 不存變數直接 innerHTML", "K5", plant(FBVAR, FBVAR + " $(\".fb\", row).innerHTML = \"x\";")],
  ["B15 HTML 字串裡的 .fb 框有子元素", "K6", plant(FBHTML, "'<div class=\"fb ok\"><span>' + (clean ?")],
  ["B15 區段內設定 white-space", "K7", plant(FBVAR, FBVAR + " row.style.whiteSpace = \"normal\";")],
];
for (const [name, rule, src] of CASES) {
  test("反例 " + name + " ⇒ 契約 " + rule + " 紅", () => {
    const got = rules(src);
    assert.ok(got.includes(rule), "應有 " + rule + "，實得：" + JSON.stringify(KC.contractProblems(src, app.offset)));
  });
}

test("反例：字串沒有在同一行收尾（斷詞失準）⇒ 契約 K0 紅，不猜", () => {
  assert.ok(rules(plant(SENDING, "var t3 = '未收尾\n" + SENDING)).includes("K0"));
});

test("反例 B15 整頁 CSS：.fb 以外用 pre-line ⇒ 契約 K7 紅；只有 .fb 用 ⇒ 綠", () => {
  const css = "<style>.fb{white-space:pre-line}</style>";
  assert.deepEqual(KC.contractProblems("", 1, css), []);
  assert.match(KC.contractProblems("", 1, css + "<style>.lead span{white-space:pre-wrap}</style>").join("\n"), /^K7 CSS「\.lead span」/);
});

// 說明「沒有契約時擋不住」：B18 的單引號／反引號／跨行回饋，舊的完整性閘（kidtext.appBranchProblems，量測核心不改）一個都不報
test("對照：B18 的單引號、反引號、跨行 .textContent 反例，完整性閘本身不報（所以需要契約）", () => {
  const base = KT.appBranchProblems(app.src).length;
  [CASES[0], CASES[1], CASES[3]].forEach(([name, , src]) => {
    assert.equal(KT.appBranchProblems(src).length, base, name + "：完整性閘不報，靠契約擋");
  });
});
