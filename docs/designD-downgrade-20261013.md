# 設計 D 停止條件降級（2026-10-13）

依據：4agent 報告 `~/scripts/state/fouragent_20261013_g5designD/4A_g5D_report.md`【最終方案】第 3 點（會診後 FAIL 不再補丁：A16 保留、關掉 B18 完整性閘、保留句長閘＋列人工抽查）；觸發：Codex 審 4271bb4 整體 FAIL（`~/scripts/state/codex_commit_reviews/g5-help-4271bb4a1315-20261013-224125-26453.md`）。迴圈 L20261013134831-ef758c，依常設授權（2026-08-17）採推薦方案，可推翻。

## 降級內容

| 項目 | 降級前 | 降級後 |
|---|---|---|
| A16 同步恢復提示（src/sync.js 441 行、四組合測試） | 擋件 | **不動**，仍擋件（Codex 審 4271bb4 判 PASS，16/16） |
| 句長閘（tests/kidgate.js 真瀏覽器採字，小五 40 字，`kidtext.harvestProblems`） | 擋件 | **不動**，仍擋件 |
| B18 完整性閘：`kidtext.appBranchProblems()`「互動元件每個回饋分支都對到要走到的分支」 | `assert.deepEqual(…, [])`（hard.test.js、kidgate.test.js） | **提醒**：違反時印警告清單，不讓 node 全套紅 |
| 寫法契約 K1–K7（tests/kidcontract.js） | 現行內容 0 違規才綠 | **提醒**：違反時印警告清單，不擋件 |
| 偵測器自身的反例測試（植入單引號／反引號／跨行等，偵測器要出聲） | 斷言 | 照舊斷言（驗的是提醒工具本身，不是現行內容） |

## 自動保證範圍（不得宣稱完整覆蓋）

採字器的自動保證範圍**只到「句長閘量得到的實際畫面文字」**：也就是 tests/e2e_kidtext.py 在 Chromium／WebKit 真的走到、真的採到的字，每句 ≤ 40 字、難詞有白話。

**不在自動保證範圍**（Codex 審 4271bb4 三項 FAIL 皆屬此類，均未修補）：

1. **B18 非標準寫法的回饋**：`.textContent =` 右邊跨行、先存變數下一行再賦值、`fb(msg, false, "…")` 新增一個 e2e 沒走到的分支、單引號／反引號字串。這些回饋只要 e2e 沒走到，句長閘就量不到；提醒工具也可能不出聲。
2. **B15 巢狀 white-space**：回饋框 `.fb`（`white-space:pre-line`）內若放子元素並各自覆寫 white-space，句長量測可能把一句錯分成兩句而少報；`class="ok fb"` 調換 class 順序即可繞過 K6 的子元素禁令。

所以：node 全綠＋e2e_kidtext 全綠 ≠「孩子看得到的字全部合格」。

## 人工抽查（每次改 src/app.html 互動元件文字時）

1. 跑 `node tests/kidcontract.js` 看提醒（0 筆不代表完整）。
2. 跑 `node tests/kidcontract.js --checklist`，逐列看那一行在畫面上會出現的每一句：≤ 40 字、難詞有白話。特別看**新加的 if 分支**與**不是雙引號字面字串的寫法**。
3. 確認回饋框 `.fb` 裡沒有子元素（看 `innerHTML`、`class="… fb …"` 的列）。
4. 通用格式 steps（app.html「通用格式 steps」段，不在下表區段）的確認題、練習題回饋來自 src/hard.js 資料，由 `requiredBranches()` 逐選項要求 e2e 走到，仍在句長閘自動範圍內。

下表為 2026-10-13 快照（行號會隨 app.html 變動，以重跑 `--checklist` 為準）：

每次改 src/app.html 的互動元件文字：逐列看那一行在畫面上會說的話是否每句 ≤ 40 字、沒有沒解釋的難詞；沒被 e2e_kidtext 走到的分支（例如新加的 if 分支）句長閘量不到，只能靠這裡人眼看。

| app.html 行 | 元件 | 函式 | 寫字方式 | 原始碼（前 100 字） |
|---|---|---|---|---|
| 319 | 互動元件 | chipsAsk | 回饋框 .fb | `var box = add(body, '<div class="ask"><div class="qq">' + q + '</div><div class="chips">' + opts.map` |
| 320 | 互動元件 | chipsAsk | 回饋框 .fb | `var out = $(".fb", box), bs = box.querySelectorAll(".chip");` |
| 325 | 互動元件 | chipsAsk | fb( | `if (r.ok) { each(bs, function(x){ x.disabled = true; }); b.classList.add("picked"); fb(out, true, r.` |
| 326 | 互動元件 | chipsAsk | fb( | `else { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake", "tried"); fb(out, f` |
| 334 | 互動元件 | numsAsk | 回饋框 .fb | `}).join("") + '</div><div class="row"><button class="btn sm" type="button">檢查</button></div><div cla` |
| 335 | 互動元件 | numsAsk | 回饋框 .fb | `var ins = box.querySelectorAll("input"), bt = $("button", box), out = $(".fb", box), tries = 0;` |
| 341 | 互動元件 | go | msg: | `var r = pn.empty ? {ok:false, msg:"先填一個數字。"} : pn.bad ? {ok:false, msg:"只能填整數，例如 15。"} : it.check ? ` |
| 344 | 互動元件 | go | fb( | `fb(out, false, r.msg + (tries >= 3 ? "　答案是 " + it.ans + "，把它填進去。" : ""));` |
| 366 | 互動元件 | confused | .textContent = | `if (!code) { msg.textContent = "這台還沒開同步，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; return; }` |
| 367 | 互動元件 | confused | .textContent = | `btn.disabled = true; msg.textContent = "送出中…";` |
| 370 | 互動元件 | confused | .textContent = | `.then(function(r){ msg.textContent = r && r.ok ? "收到了！會換一個更好懂的說法。先試試看下一步。" : "沒送成功，請跟爸爸媽媽說：第 " + n +` |
| 371 | 互動元件 | confused | .textContent = | `.catch(function(){ msg.textContent = "沒送成功（可能沒有網路），請跟爸爸媽媽說：第 " + n + " 步看不懂。"; btn.disabled = false;` |
| 375 | 題目列 | setBox | innerHTML（含中文） | `function setBox(s){ var b = $("#box"); b.innerHTML = s ? sym(s) : ""; b.classList.toggle("got", !!s)` |
| 376 | 題目列 | drawProb | innerHTML（含中文） | `function drawProb(){ $("#prob").innerHTML = fr(A) + '<span class="box" id="box" role="img" aria-labe` |
| 396 | 教學（習作那一題） | step1 | msg: | `if (v === "red") return {ok:true, msg:pr.ok};` |
| 397 | 教學（習作那一題） | step1 | msg: | `if (v === "mul") return {ok:false, msg:"一起乘，數字只會更大喔。" + pr.hint};` |
| 398 | 教學（習作那一題） | step1 | msg: | `return {ok:false, msg:"分母不一樣的時候，分子大的不一定比較大（等一下練習題就有反例）。要先讓分母一樣。"};` |
| 461 | 教學（習作那一題） | step4 | msg: | `if (v <= 0) return {ok:false, msg:"要找比 0 大的公倍數：從 " + sa.d + " 的倍數和 " + sb.d + " 的倍數裡，找第一個一樣的數。"};` |
| 462 | 教學（習作那一題） | step4 | msg: | `if (v % sa.d === 0 && v % sb.d === 0) return {ok:false, msg:v + " 也是 " + sa.d + " 和 " + sb.d + " 的公倍` |
| 464 | 教學（習作那一題） | step4 | msg: | `return {ok:false, msg:sa.d + " 的倍數：" + ma.join("、") + "…。" + sb.d + " 的倍數：" + mb.join("、") + "…。第一個兩` |
| 484 | 教學（習作那一題） | step5 | msg: | `return v === s1 ? {ok:true, msg:"對！分母一樣，比分子：" + (s1 === ">" ? ea.n + " 比 " + eb.n + " 大，所以 " + F.txt` |
| 487 | 教學（習作那一題） | step5 | msg: | `return v === SOL.sign ? {ok:true, msg:F.txt(A) + " 和 " + F.txt(ea) + " 一樣大、" + F.txt(B) + " 和 " + F.` |
| 488 | 教學（習作那一題） | step5 | msg: | `{ok:false, msg:F.txt(A) + " = " + F.txt(ea) + "，" + F.txt(B) + " = " + F.txt(eb) + "。剛剛比出來哪個大？"};` |
| 501 | 教學（習作那一題） | step6 | msg: | `if (v === "ok") return {ok:true, msg:"對！先約分讓數字變小（大小不變），再通分，最後比分子。"};` |
| 502 | 教學（習作那一題） | step6 | msg: | `if (v === "x") return {ok:false, msg:"先通分的話，要用 " + SOL.rawLcm + " 那麼大的數。先把數字變小比較好算。"};` |
| 503 | 教學（習作那一題） | step6 | msg: | `return {ok:false, msg:"分母不一樣時，不能直接比分子。"};` |
| 527 | 練習 | formCheck | msg: | `if (fs.some(function(f){ return f.bad; })) return {ok:false, countable:false, msg:"只能填整數，例如 2、15。"};` |
| 528 | 練習 | formCheck | msg: | `if (fs.some(function(f){ return f.empty; })) return {ok:false, countable:false, msg:"還有格子沒填。"};` |
| 536 | 練習 | renderPractice | innerHTML（含中文） | `P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第` |
| 540 | 練習 | renderPractice | 回饋框 .fb | `'<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghos` |
| 547 | 練習 | renderPractice | msg: | `if (x.ok && y.ok) { sa = ia; sb = ib; return {ok:true, msg:"對了：" + F.txt(a) + " = " + F.txt(sa) + "，` |
| 548 | 練習 | renderPractice | msg: | `return {ok:false, countable:(!x.ok && x.code !== "empty") \|\| (!y.ok && y.code !== "empty"), msg:(x.o` |
| 555 | 練習 | row2 | innerHTML（含中文） | `r2.innerHTML = '<div class="qq">② 再通分，讓分母一樣</div><div class="eq"><span class="pair">' + fr(sa) + ' =` |
| 556 | 練習 | row2 | 回饋框 .fb | `'<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghos` |
| 561 | 練習 | row2 | msg: | `if (x.ok) { ea = ia; eb = ib; return {ok:true, msg:x.msg, next:row3}; }` |
| 562 | 練習 | row2 | msg: | `return {ok:false, countable:x.code !== "empty", msg:x.msg};` |
| 573 | 練習 | row3 | innerHTML（含中文） | `r3.innerHTML = '<div class="qq">③ 比大小：' + fr(ea) + ' 和 ' + fr(eb) + '</div><div class="qq">所以 ' + fr` |
| 574 | 練習 | row3 | 回饋框 .fb | `SIGNS.map(function(o){ return '<button type="button" class="chip sign" data-s="' + esc(o.value) + '"` |
| 575 | 練習 | row3 | 回饋框 .fb | `var out = $(".fb", r3), bs = r3.querySelectorAll(".chip");` |
| 582 | 練習 | row3 | fb( | `if (r.ok) { each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, r` |
| 583 | 練習 | row3 | fb( | `else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("sh` |
| 595 | 練習 | finish | innerHTML（含中文） | `PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 3 題自己做對。回到'` |
| 596 | 練習 | finish | 回饋框 .fb | `'<div class="fb ok">' + (clean ? "完全自己做對！連續 " + st.streak + " 題。" : "做完了！" + (cur.hints ? "這題看了提示，" ` |
| 604 | 練習 | wireRow | 回饋框 .fb | `var out = $(".fb", row), hb = $(".hint", row), lvl = 0;` |
| 609 | 練習 | go | fb( | `if (r.ok) { lock(row); fb(out, true, r.msg); r.next(); }` |
| 610 | 練習 | go | fb( | `else { if (r.countable) { cur.wrongs++; save(); } fb(out, false, r.msg); }` |
| 615 | 練習 | go | .textContent = | `cur.hints++; save(); hb.hidden = false; hb.textContent = hints[Math.min(lvl, hints.length - 1)](); l` |

唯讀提示（整頁）：
- 第 813 行：`var READONLY_MSG = "這個網站已經在另一個分頁或視窗開著了，請回到那邊練習。那邊關掉後，這一頁會自動接手。";   // 每句 ≤40 字（第 8 輪 B18：原本一句 45 字）`
- 第 816 行：`var lockFail = function(){ WRITER = false; READONLY_MSG = "這一頁拿不到存檔的權限（瀏覽器拒絕），只能看不能練；請重新整理或換瀏覽器。"; s`
- 第 827 行：`READONLY_MSG = "這個瀏覽器太舊，不能安全存練習紀錄；請更新 iPad／瀏覽器後再練習。";`

整頁 CSS 的 white-space（B15：回饋框內若有子元素各自覆寫，句長量測可能錯分）：
- `.fb { white-space:pre-line }`
- `.fr.x>span { white-space:nowrap }`
- `.nl,.pair { white-space:nowrap }`
