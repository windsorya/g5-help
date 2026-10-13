// 孩子看得到的字：寫法契約測試（設計 D 4agent 最終方案；Codex 審 b0b24f1 B15／B18）。
// 採字器量測範圍與刻意不支援的寫法見 tests/kidcontract.js 檔頭：量測核心（kidgate.js／kidtext.js）不追語法，
// 量不到的寫法由契約在建置前拒絕（政策紅燈）。反例＝在現行互動元件區段裡植入一種量測器看不懂的寫法，契約必須紅；現行內容必須綠。
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

test("現行互動元件區段：契約全綠（0 個違規）", () => {
  assert.deepEqual(KC.currentProblems(), []);
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
