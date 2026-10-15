// 難題站存檔 g5help.v1 的格式（src/helpdoc.js）：2026-10-13 律師「為何我測試用的題目，我沒法清除？有無清除或重置按鈕？」
// 新增 hidden 欄位（家長隱藏的篇）＋清除全部作答紀錄。執行：node --test tests/helpdoc.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const D = require("../src/helpdoc.js");

const plain = (x) => JSON.parse(JSON.stringify(x));
const OLD = JSON.stringify({v: 1, entries: {"p38-6-2": {lessonDone: true, idx: 2, seed: 7, streak: 2, clean: 2, solved: 2, mastered: false, log: [], cur: null, r: 3}}});

test("H01 舊存檔沒有 hidden 欄位 ⇒ 照常讀、預設全不隱藏", () => {
  const d = D.parse(OLD);
  assert.ok(d, "舊格式要讀得懂");
  assert.equal(d.entries["p38-6-2"].solved, 2);
  assert.deepEqual(plain(d.hidden), {});
});

test("H02 新欄位 hidden：{篇id: 隱藏時間} 接受並保留；序列化後再讀一模一樣", () => {
  const raw = JSON.stringify({v: 1, entries: {}, hidden: {"sci-q5-bangen": 1791868607799, "t-guoyu": 5}});
  const d = D.parse(raw);
  assert.deepEqual(plain(d.hidden), {"sci-q5-bangen": 1791868607799, "t-guoyu": 5});
  const back = D.parse(D.serialize(d.entries, d.hidden));
  assert.deepEqual(plain(back.hidden), plain(d.hidden));
  assert.equal(JSON.parse(D.serialize(d.entries, d.hidden)).v, 1, "版本號維持 1：舊版頁面仍讀得懂這份存檔");
});

test("H03 hidden 壞掉不拖垮整份存檔：陣列／字串／壞 id／壞時間各自丟掉，作答紀錄照留", () => {
  for (const bad of [[1, 2], "x", null, 5]) {
    const d = D.parse(JSON.stringify({v: 1, entries: JSON.parse(OLD).entries, hidden: bad}));
    assert.ok(d, "hidden=" + JSON.stringify(bad) + " 仍讀得懂");
    assert.deepEqual(plain(d.hidden), {});
    assert.equal(d.entries["p38-6-2"].solved, 2);
  }
  // 原始 JSON 字串（物件字面量的 "__proto__" 會變成設原型，不會出現在 JSON 裡）
  const d = D.parse('{"v":1,"entries":{},"hidden":{"ok-1":9,"<b>":1,"neg":-1,"str":"1","frac":1.5,"__proto__":3}}');
  assert.deepEqual(Object.keys(d.hidden).sort(), ["__proto__", "ok-1"], "__proto__ 當普通 id 存（hidden 沒有原型），不污染物件");
  assert.equal(Object.getPrototypeOf(d.hidden), null);
  assert.equal(d.hidden["ok-1"], 9);
  assert.ok(!("<b>" in d.hidden) && !("neg" in d.hidden) && !("str" in d.hidden) && !("frac" in d.hidden));
});

test("H03b 存檔往返：id 叫 __proto__ 的篇與隱藏，serialize 後再 parse 一筆不少（Codex 審 81963cee）", () => {
  const raw = '{"v":1,"entries":{"__proto__":{"solved":3},"p38-6-2":{"solved":1}},"hidden":{"__proto__":123,"ok-1":9}}';
  const d = D.parse(raw);
  const back = JSON.parse(D.serialize(d.entries, d.hidden));
  assert.deepEqual(Object.keys(back.entries).sort(), ["__proto__", "p38-6-2"]);
  assert.deepEqual(Object.keys(back.hidden).sort(), ["__proto__", "ok-1"]);
  assert.equal(back.hidden["ok-1"], 9);
  const again = D.parse(D.serialize(d.entries, d.hidden));
  assert.equal(again.hidden["__proto__"], 123);
  assert.ok(D.isHidden(D.hide(d.hidden, "x-1", 5), "__proto__"), "隱藏別篇時 __proto__ 那筆不會掉");
});

test("H04 不是存檔的東西照舊回 null（壞資料備份流程不變）", () => {
  for (const raw of ["{bad", "null", JSON.stringify({v: 2, entries: {}}), JSON.stringify({v: 1, entries: []}), JSON.stringify({v: 1})]) assert.equal(D.parse(raw), null, raw);
});

test("H05 隱藏、恢復、全部恢復：不碰任何一篇的作答紀錄", () => {
  const d = D.parse(OLD);
  const h1 = D.hide(d.hidden, "p38-6-2", 100);
  assert.equal(h1["p38-6-2"], 100);
  assert.deepEqual(plain(d.hidden), {}, "回傳新物件，不改原本的");
  const h2 = D.unhide(h1, "p38-6-2");
  assert.deepEqual(plain(h2), {});
  assert.equal(d.entries["p38-6-2"].solved, 2);
  assert.deepEqual(plain(D.unhide(D.hide(D.hide({}, "a", 1), "b", 2), "zzz")), {a: 1, b: 2}, "恢復沒隱藏的篇不出錯");
  assert.throws(() => D.hide({}, "<b>", 1), "壞 id 不收");
});

test("H06 只算目前清單裡有的篇（舊篇 id 留在 hidden 裡不算進「已隱藏 N 篇」）", () => {
  const list = [{id: "a"}, {id: "b"}, {id: "c"}];
  assert.deepEqual(D.hiddenIn({a: 1, gone: 2, c: 3}, list).map((e) => e.id), ["a", "c"]);
  assert.equal(D.isHidden({a: 1}, "a"), true);
  assert.equal(D.isHidden({a: 1}, "constructor"), false, "內建屬性名不能被當成已隱藏");
});

test("H07 清除全部作答紀錄：每一篇都回到空白；隱藏清單不清（另有全部恢復）", () => {
  const d = D.parse(JSON.stringify({v: 1, entries: JSON.parse(OLD).entries, hidden: {"t-guoyu": 5}}));
  const c = D.cleared(d.hidden);
  assert.deepEqual(Object.keys(c.entries), []);
  assert.deepEqual(plain(c.hidden), {"t-guoyu": 5});
  const back = D.parse(D.serialize(c.entries, c.hidden));
  assert.deepEqual(Object.keys(back.entries), []);
  assert.equal(back.hidden["t-guoyu"], 5);
});

test("H08 原有欄位清洗不變（從 app.html 搬進 helpdoc.js，行為與搬家前相同）", () => {
  const d = D.parse(JSON.stringify({v: 1, entries: {x: {idx: -5, streak: "x", lessonDone: "yes", log: 5, seed: 700000, cur: {idx: 6, hints: 1, wrongs: 1}}, y: {idx: 9007199254740992}}}));
  assert.equal(d.entries.x.idx, 0); assert.equal(d.entries.x.lessonDone, false); assert.deepEqual(d.entries.x.log, []);
  assert.equal(d.entries.x.seed, 700000); assert.deepEqual(plain(d.entries.x.cur), {idx: 6, hints: 1, wrongs: 1});
  assert.equal(d.entries.y.idx, 0);
  assert.equal(Object.getPrototypeOf(d.entries), null, "entries 不能撞內建屬性");
});

// 刪除（2026-10-14 律師：「請幫我增加刪除題目按鈕」）
test("H10 舊存檔沒有 deleted ⇒ 讀成空；壞掉的 deleted 只丟那部分", () => {
  assert.deepEqual(plain(D.parse(OLD).deleted), {});
  const d = D.parse('{"v":1,"entries":{},"deleted":{"ok-1":9,"<b>":1,"neg":-1}}');
  assert.deepEqual(plain(d.deleted), {"ok-1": 9});
  assert.deepEqual(plain(D.parse('{"v":1,"entries":{},"deleted":[1]}').deleted), {});
});

test("H11 remove：記進 deleted，hidden 也留一筆（舊版頁面仍藏著）；不改原物件；往返不掉", () => {
  const h0 = {}, d0 = {};
  const r = D.remove(h0, d0, "sci-q5-bangen", 77);
  assert.equal(r.deleted["sci-q5-bangen"], 77);
  assert.equal(r.hidden["sci-q5-bangen"], 77);
  assert.deepEqual(plain(h0), {}); assert.deepEqual(plain(d0), {});
  const r2 = D.remove({"sci-q5-bangen": 5}, {}, "sci-q5-bangen", 77);
  assert.equal(r2.hidden["sci-q5-bangen"], 5, "原本的隱藏時間照留");
  const back = D.parse(D.serialize({}, r.hidden, r.deleted));
  assert.equal(back.deleted["sci-q5-bangen"], 77);
  assert.throws(() => D.remove({}, {}, "<b>", 1));
});

test("H12 刪掉的篇不算進「已隱藏」；恢復全部不會帶回刪掉的篇；清除全部紀錄不清 deleted", () => {
  const list = [{id: "a"}, {id: "b"}];
  const r = D.remove({a: 1, b: 2}, {}, "b", 3);
  assert.deepEqual(D.hiddenIn(r.hidden, list, r.deleted).map((e) => e.id), ["a"]);
  const u = D.unhideAll(r.hidden, r.deleted);
  assert.deepEqual(plain(u), {b: 2}, "只留刪掉那篇的隱藏");
  assert.deepEqual(D.hiddenIn(u, list, r.deleted), []);
  const c = D.cleared(r.hidden, r.deleted);
  assert.equal(c.deleted.b, 3);
});

// Codex 審 6495640 FAIL：另開 deleted 欄位，舊版頁面讀寫一次就洗掉。改存成 hidden 裡的 "_del_<id>"。
const OLDDOC = require("./fixtures/helpdoc.legacy-4e7e680.js");   // 加刪除前那一版（git show 4e7e680:src/helpdoc.js）
test("H13 舊版頁面（4e7e680）讀寫一次：刪除照留、那篇仍隱藏、不會跑回「已隱藏」清單", () => {
  const r = D.remove({}, {}, "p38-6-2", 77);
  const raw = D.serialize({}, r.hidden, r.deleted);
  const o = OLDDOC.parse(raw);
  assert.ok(o, "舊版讀得懂");
  assert.ok(OLDDOC.isHidden(o.hidden, "p38-6-2"), "舊版仍當隱藏");
  const back = D.parse(OLDDOC.serialize(o.entries, o.hidden));
  assert.equal(back.deleted["p38-6-2"], 77, "舊版存過一次，刪除還在");
  assert.deepEqual(D.hiddenIn(back.hidden, [{id: "p38-6-2"}], back.deleted), []);
});

test("H14 存檔格式：hidden 裡是 _del_ 標記、沒有另開 deleted 欄位；記憶體裡拆開、標記不算隱藏的篇", () => {
  const r = D.remove({a: 1}, {}, "b", 3);
  const j = JSON.parse(D.serialize({}, r.hidden, r.deleted));
  assert.deepEqual(j.hidden, {a: 1, b: 3, _del_b: 3});
  assert.ok(!("deleted" in j));
  const back = D.parse(JSON.stringify(j));
  assert.deepEqual(plain(back.hidden), {a: 1, b: 3});
  assert.deepEqual(plain(back.deleted), {b: 3});
  assert.throws(() => D.remove({}, {}, "_del_x", 1), "篇 id 不能以 _del_ 開頭");
  assert.throws(() => D.remove({}, {}, "x".repeat(56), 1), "加前綴超過 60 字的 id 不收");
  assert.deepEqual(plain(D.parse('{"v":1,"entries":{},"hidden":{"_del_":5}}').deleted), {}, "只有前綴沒有 id 的標記丟掉");
});

test("H16 篇 id 規則 postIdOk：55 字以內、不以 _del_ 開頭；不合規則的 _del_ 標記與舊 deleted 欄位不採（Codex 審 6dd8b14）", () => {
  assert.ok(D.postIdOk("p38-6-2") && D.postIdOk("x".repeat(55)));
  assert.ok(!D.postIdOk("x".repeat(56)) && !D.postIdOk("_del_p38-6-2") && !D.postIdOk("") && !D.postIdOk("<b>"));
  const d = D.parse(JSON.stringify({v: 1, entries: {}, hidden: {["_del_" + "x".repeat(55)]: 1, "_del__del_a": 2}, deleted: {["y".repeat(56)]: 3, ok: 4}}));
  assert.deepEqual(Object.keys(d.deleted).sort(), ["ok", "x".repeat(55)].sort());
  const r = D.remove({}, {}, "x".repeat(55), 9);
  assert.equal(D.parse(D.serialize({}, r.hidden, r.deleted)).deleted["x".repeat(55)], 9, "55 字的篇刪除存得住");
});

test("H15 6495640 寫過的 deleted 欄位照樣讀得懂，下次存檔改成 _del_ 標記", () => {
  const d = D.parse('{"v":1,"entries":{},"hidden":{"x":1},"deleted":{"x":2}}');
  assert.equal(d.deleted.x, 2);
  assert.deepEqual(JSON.parse(D.serialize(d.entries, d.hidden, d.deleted)).hidden, {x: 1, _del_x: 2});
});

// ---------- 看過答案 peek（交辦 #2282）----------
const PRE = require("./fixtures/helpdoc.legacy-669fd69.js");   // 改之前的 helpdoc.js（＝線上舊版頁面）
const H = require("../src/hard.js");
const KK = (i) => "k" + i.toString(16).padStart(14, "0");

test("H17 舊版頁面讀寫：peek 會被丟（已知降級），log 每筆的 k 照留、新版用它兜底", () => {
  const P = H.get("p40-2-5");
  const ks = H.practiceAll(P).map(H.practiceId);
  const st = D.fresh(); st.solved = 30; st.peek = {}; ks.forEach((k, i) => { st.peek[k] = 100 + i; });
  st.log = ks.slice(0, 5).map((k, i) => ({t: 200 + i, q: i, clean: false, wrongs: 1, k}));
  const raw = D.serialize({"p40-2-5": st}, {}, {});
  const old = PRE.parse(raw);
  assert.ok(old, "舊版讀得懂新格式");
  const back = D.parse(PRE.serialize(old.entries, old.hidden, old.deleted));
  const e = back.entries["p40-2-5"];
  assert.equal(e.peek, undefined, "舊版寫回後 peek 不見（記錄降級事實）");
  assert.deepEqual(e.log.map((l) => l.k), ks.slice(0, 5), "log 的 k 全部保留");
  for (let i = 0; i < 18; i++) assert.equal(H.shownBefore(P, e, i), i < 5, "第 " + (i + 1) + " 題：log 有 k 的照擋，只在 peek 裡的已降級");
});

test("H19 peek 上界與遷移：只留最新 256 筆、壞的只丟那部分、沒有 peek 的舊存檔寫出一字不差", () => {
  const big = {}; for (let i = 0; i < 300; i++) big[KK(i)] = 1000 + i;
  const a = D.clean1({solved: 1, peek: big}).peek;
  assert.equal(Object.keys(a).length, 256);
  assert.equal(KK(0) in a, false); assert.equal(KK(299) in a, true);
  const mixed = D.clean1({solved: 2, peek: {[KK(1)]: 5, bad: 1, ["k" + "Z".repeat(14)]: 1, [KK(2)]: -1, [KK(3)]: 1.5}});
  assert.deepEqual(plain(mixed.peek), {[KK(1)]: 5}); assert.equal(mixed.solved, 2);
  ["str", [KK(1)], 5, null].forEach((bad) => { const d = D.clean1({solved: 3, peek: bad}); assert.equal(d.peek, undefined); assert.equal(d.solved, 3); });
  // 沒有 peek 的舊存檔：新版讀進來再寫出去，跟舊版寫出去一字不差（升級不會讓同步多傳一版）
  const raw = JSON.stringify({v: 1, entries: {"p40-2-5": {lessonDone: true, idx: 7, seed: 9, streak: 1, clean: 3, solved: 7, mastered: false, log: [{t: 1, q: 0, clean: false, wrongs: 1}], cur: null, r: 4}}, hidden: {}});
  const n = D.parse(raw), o = PRE.parse(raw);
  assert.equal(D.serialize(n.entries, n.hidden, n.deleted), PRE.serialize(o.entries, o.hidden, o.deleted));
});

test("H20 兩台同步合併：unionPeek 取聯集、同題留較早時間、沒變回 false", () => {
  const st = {peek: {[KK(1)]: 50, [KK(2)]: 60}};
  assert.equal(D.unionPeek(st, {[KK(2)]: 40, [KK(3)]: 70}), true);
  assert.deepEqual(plain(st.peek), {[KK(1)]: 50, [KK(2)]: 40, [KK(3)]: 70});
  assert.equal(D.unionPeek(st, {[KK(1)]: 99}), false, "對方沒有多出來的、時間也不更早：不必再存");
  const none = {}; assert.equal(D.unionPeek(none, {[KK(5)]: 1}), true); assert.deepEqual(plain(none.peek), {[KK(5)]: 1});
  assert.equal(D.unionPeek({}, "壞資料"), false);
  // 上界：已滿 256 筆時，併進來又會被丟的舊題不算變動（否則兩台一直互傳）
  const full = {peek: {}}; for (let i = 0; i < 256; i++) full.peek[KK(i + 10)] = 1000 + i;
  assert.equal(D.unionPeek(full, {[KK(1)]: 1}), false);
});
