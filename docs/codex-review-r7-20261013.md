Reading additional input from stdin...
OpenAI Codex v0.153.4
--------
workdir: /Users/william/Documents/g5-help
model: gpt-6-astra
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 01a133f9-1bd3-7711-a56f-eacb39032175
--------
user
你是獨立驗收者（唯讀）。只讀 /Users/william/Documents/g5-help（HEAD c2f68bf），不讀其他目錄、不改檔。
對象：難題站存檔保護（交辦 #1303）。第 6 輪你判 FAIL，原文在 docs/codex-review-r6-20261013.md（檔尾的逐項表）。設計文件 docs/storage-design-C-4agent-20261013.md。
本輪改動：src/app.html 新增 guard()（存檔段 dirtyCount 下方），所有會改進度或切畫面的按鈕綁定時記世代與 cur；retryRead 只在未讀成功時有效；applyRemote 在 setItem 成功後一定採用；src/sync.js reconcile 在已有 baseline 且本機＝雲端時只補 baseline。
請做：
1. 逐項核對第 6 輪的兩個 FAIL（部分寫入分歧、舊操作失效含「再讀一次」與分數題提示）是否修好，附重現步驟與結果。
2. 依設計 C 四條不變量，再找會遺失／倒退進度的具體可重現路徑（推測請標推測）。重播舊 handler 的邊界請涵蓋畫面上所有按鈕，不只指定那幾個。
3. sync.js 沒提供 canReplace／accept 時（自然站），行為是否與改前一致；新的「本機＝雲端只補 baseline」規則是否破壞既有 A4（第一次加入一律問）。
4. 可執行：node --test tests/*.test.js。e2e 若因沙箱不能跑就說不能跑；我這邊本機實跑結果：tests/e2e.py 250/250（Chromium＋WebKit），你可當作未驗證的參考。
輸出：逐項表（項目｜PASS/FAIL｜證據），最後一行只寫「整體結論：PASS」或「整體結論：FAIL」。只談存檔與同步。
warning: Under-development features enabled: chronicle. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/william/.codex/config.toml.
warning: Skill descriptions were shortened to fit the skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
[░░░░░░░░░░] 0%｜執行唯讀驗收｜將核對指定 HEAD、第 6 輪失敗表與設計不變量，再跑測試及舊 handler 重播；讀取範圍限於此專案。

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "pwd; git rev-parse HEAD; git status --short; rg --files -g 'AGENTS.md' -g '*storage*' -g '*review-r6*' -g '*test*' -g '*e2e*' -g '*sync*' -g 'package.json' -g '*devlog*' -g '*DEVLOG*'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
/Users/william/Documents/g5-help
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-ke0t4h4g' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-20nOlNjg' (errno=Operation not permitted)
c2f68bfa01bf07424410ce4ff0d18277267a2deb
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-8sTZ6mHk' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-ZAcHeRaS' (errno=Operation not permitted)
?? docs/codex-review-r6-20261013.md
?? index.html.bak.20261013-1219
?? index.html.bak.20261013-1221
?? index.html.bak.20261013-1237
?? index.html.bak.20261013-1330
?? index.html.bak.20261013-1333
?? index.html.bak.20261013-1356
?? src/app.html.bak.20261013-1217
?? src/app.html.bak.20261013-1218
?? src/app.html.bak.20261013-1221
?? src/app.html.bak.20261013-1225
?? src/app.html.bak.20261013-1234
?? src/app.html.bak.20261013-1237
?? src/app.html.bak.20261013-1329
?? src/app.html.bak.20261013-1403
?? src/app.html.bak.20261013-1413
?? src/app.html.bak.20261013-1413b
?? src/app.html.bak.20261013-1432
?? src/app.html.bak.20261013-1432c
?? src/frac.js.bak.20261013-1221
?? src/frac.js.bak.20261013-1225
?? src/hard.js.bak.20261013-1221
?? src/hard.js.bak.20261013-1225
?? src/hard.js.bak.20261013-1237
?? src/hard.js.bak.20261013-1402
?? src/sync.js.bak.20261013-1300
?? src/sync.js.bak.20261013-1329
?? src/sync.js.bak.20261013-1411
?? src/sync.js.bak.20261013-1412
?? src/sync.js.bak.20261013-1432
?? tests/frac.test.js.bak.20261013-1221
?? tests/frac.test.js.bak.20261013-1225
?? tests/hard.test.js.bak.20261013-1219
?? tests/hard.test.js.bak.20261013-1221
?? tests/hard.test.js.bak.20261013-1225
?? tests/hard.test.js.bak.20261013-1235
?? tests/hard.test.js.bak.20261013-1237
?? tests/hard.test.js.bak.20261013-1401
?? tests/sync.test.js.bak.20261013-1411
?? tests/sync.test.js.bak.20261013-1412
?? tests/sync.test.js.bak.20261013-1432
src/sync.js.bak.20261013-1329
src/sync.js.bak.20261013-1432
src/sync.js.bak.20261013-1411
src/sync.js
src/sync.js.bak.20261013-1412
src/sync.js.bak.20261013-1300
docs/storage-design-C-4agent-20261013.md
docs/codex-review-r6-20261013.md
docs/storage-design-B-20261013.md
tests/sync.test.js
tests/hard.test.js.bak.20261013-1237
tests/frac.test.js.bak.20261013-1221
tests/hard.test.js
tests/frac.test.js
tests/upprogress.test.js
tests/inbox.test.js
tests/sync.test.js.bak.20261013-1412
tests/hard.test.js.bak.20261013-1225
tests/e2e.py
tests/frac.test.js.bak.20261013-1225
tests/gascore.test.js
tests/e2e_sync.py
tests/hard.test.js.bak.20261013-1401
tests/hard.test.js.bak.20261013-1235
tests/sync.test.js.bak.20261013-1432
tests/sync.test.js.bak.20261013-1411
tests/hard.test.js.bak.20261013-1219
tests/hard.test.js.bak.20261013-1221
sync.js

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' -g 'README*' -g 'package.json' -g '*CHANGELOG*'; git log -6 --oneline; git show --stat HEAD" in /Users/william/Documents/g5-help
 succeeded in 0ms:
gas/README.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-j3VRMtz6' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-VuZ3kuHl' (errno=Operation not permitted)
c2f68bf 難題站存檔：修 Codex 第 6 輪（4agent 後第 1 輪）三個舊 handler／部分寫入反例（#1303）
0c98e01 e2e：#1319「這步看不懂」按鈕（無同步給口頭說法、有同步送 op=confused，攔截不打真後端）5/5
455135d 難題站存檔設計 C（#1303，Codex 設計後連兩輪 FAIL → 4agent 定案）：本頁記憶體唯一真相
5367999 白話機制補用詞（#1319）＋傳題進度條隨時間（#1320）
65c4c67 白話程度依年級（學年度 8/1 換級，今＝小五每句≤40 字，小六 45…）寫進 hard.js＋hard.test 逐句檢查；家長傳題目進度條（33/66/100%）
00dca9e 難題站存檔：修 Codex 第 4 輪（設計後首輪）必修 1–6＋建議 7（交辦 #1303）
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-I5GmTySy' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-RiIgD5Sj' (errno=Operation not permitted)
commit c2f68bfa01bf07424410ce4ff0d18277267a2deb
Author: windsorya <ace.nonsense@gmail.com>
Date:   Tue Oct 13 14:35:12 2026 +0800

    難題站存檔：修 Codex 第 6 輪（4agent 後第 1 輪）三個舊 handler／部分寫入反例（#1303）
    
    - guard()：所有會改進度或切畫面的按鈕綁定時記世代（與這一題 cur），世代變了／已換題／未讀成功就不做
    - retryRead 只在未讀成功時有效（舊的「再讀一次」重播不會把記憶體換回磁碟版）
    - applyRemote：setItem 成功就採用（記憶體＝磁碟）；讀回失敗只告訴 sync 下次再確認
    - sync.js：已同步過的裝置本機內容＝雲端時只補 baseline，不出衝突（第一次加入仍照 A4 一律問）
    - e2e flow_codex_r6（含同寬掃描：切篇後重播畫面上每一個舊按鈕 handler）舊碼 5 紅；全套 250/250；sync S32/S33；突變 3/3
    
    Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
    Claude-Session: https://claude.ai/code/session_012HDXLZbek1fKw9WSBNyi6f

 index.html         | 33 +++++++++++++++++-------------
 src/app.html       | 33 +++++++++++++++++-------------
 src/sync.js        |  2 ++
 sync.js            |  2 ++
 tests/e2e.py       | 60 ++++++++++++++++++++++++++++++++++++++++++++++++++++++
 tests/sync.test.js | 22 +++++++++++++++++++-
 6 files changed, 123 insertions(+), 29 deletions(-)

hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'cat docs/storage-design-C-4agent-20261013.md' in /Users/william/Documents/g5-help
 succeeded in 0ms:
# 難題站存檔 設計 C（2026-10-13，Codex 設計後連兩輪 FAIL → 4agent 協作定案）

交辦 #1303。設計 B（Web Locks 單一寫入分頁）保留；C 只改「誰是真相、誰能寫」。

## 根因（一句話）
本頁記憶體與磁碟各自被當成真相：app 的 save() 用 BASE/r 跟磁碟比版本、storage 事件會把磁碟版換進記憶體，
sync.js 又能直接寫 g5help.v1 ——三個寫入者都拿著不同時間的快照，任何交錯都可能把另一邊的進度洗掉。

## 不變量
1. 取鎖且「讀成功」（READY）才開放作答；讀取拋錯（含舊 key g5math.v1）≠ 沒有紀錄 → 給「再讀一次」。
2. 本頁記憶體是唯一真相；save() 把記憶體整份寫進主 key，寫成功才清 DIRTY；失敗保留、3 秒自動再試、
   首頁與各篇都看得到 #saveWarn。save 不替換 DB/st/cur 物件（舊 handler 仍指同一份）。
3. g5help.v1 只有本頁寫：不聽 storage 事件換資料；sync.js 以 canReplace(key)（無副作用）先問、
   accept(key, data) 由本頁寫入並重畫；只在「首頁、沒有未存進度」時換，不 reload。
4. 舊畫面 handler：GEN 世代 ＋「st.cur !== cur」閂鎖（這題計分後即失效，重播不重複計分）。

## 刻意不做（縮小範圍）
- 不做跨分頁版本合併、不做 storage 事件凍結（未更新的舊版分頁仍是上線前提風險）。
- 不改等待頁接手 reload（唯讀頁沒有進度，reload 只重讀磁碟）。
- 不做手動同步／metadata 跨頁鎖（GPT 提案，成本高；列殘留風險）。

## 驗收（tests/e2e.py flow_codex_r5，Chromium＋WebKit；sync.test S30）
舊碼 12 項 8 紅；新碼全綠；突變 8/8 轉紅（READY 恆真、吞舊 key 例外、篇內也換雲端、拿掉自動重試、
拿掉「下一步」世代、拿掉計分閂鎖、sync 不問 canReplace、sync 直接 write）。

四腦紀錄：Gemini 架構、GPT SOP、Grok 無額度（403）、Claude premise/probe——見交接檔。

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'cat docs/codex-review-r6-20261013.md' in /Users/william/Documents/g5-help
 succeeded in 0ms:
Reading additional input from stdin...
OpenAI Codex v0.153.4
--------
workdir: /Users/william/Documents/g5-help
model: gpt-6-astra
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 01a133ec-a574-72e2-9394-a07e5732e71e
--------
user
你是獨立驗收者（唯讀）。只讀 /Users/william/Documents/g5-help 這個 repo（HEAD 455135d），不讀其他目錄、不改任何檔。
對象：難題站（給小五孩子用的純前端網站）的存檔保護，交辦 #1303。前一輪（第 5 輪）你判 FAIL，原文在 docs/codex-review-r5-20261013.md。
之後經多模型協作改成「設計 C」，文件 docs/storage-design-C-4agent-20261013.md；程式在 src/app.html（存檔段約 241–330 行、鎖與同步接線在檔尾）、src/sync.js（replaceLocal 的 canReplace／accept 掛勾）。
請做：
1. 逐項核對第 5 輪必修 1–3 與建議 4 是否修好（每項附你實際執行的重現步驟與結果）。
2. 用設計 C 的四條不變量找新的遺失／倒退進度路徑（要具體可重現；推測請標推測）。
3. sync.js 是自然站（另一 repo）也會載入的共用檔：核對未提供 canReplace／accept 時行為與改前一致。
4. 可執行：node --test tests/*.test.js；e2e 需要 Playwright（tests/e2e.py，用 python3.12 執行），不能跑就說不能跑。
輸出：逐項表（項目｜PASS/FAIL｜證據），最後一行只寫「整體結論：PASS」或「整體結論：FAIL」。不要提出與存檔無關的建議。
warning: Under-development features enabled: chronicle. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/william/.codex/config.toml.
warning: Skill descriptions were shortened to fit the skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
[░░░░░░░░░░] 0%｜執行中：唯讀驗收｜先核對 HEAD、第 5 輪要求與設計 C，再執行可重現測試；讀取範圍限於此 repo。
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "pwd; git rev-parse HEAD; git status --short; rg --files -g 'AGENTS.md' -g '*storage*' -g '*review-r5*' -g '*test*' -g 'package.json' -g 'e2e.py' -g '*devlog*' -g '*DEVLOG*'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
/Users/william/Documents/g5-help
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-o7mZFtxr' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Pte7wzG1' (errno=Operation not permitted)
455135df1d96c6b7b56443447d73d9db3b81485b
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-VIFWNf3b' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-XIbjhcNS' (errno=Operation not permitted)
?? index.html.bak.20261013-1219
?? index.html.bak.20261013-1221
?? index.html.bak.20261013-1237
?? index.html.bak.20261013-1330
?? index.html.bak.20261013-1333
?? index.html.bak.20261013-1356
?? src/app.html.bak.20261013-1217
?? src/app.html.bak.20261013-1218
?? src/app.html.bak.20261013-1221
?? src/app.html.bak.20261013-1225
?? src/app.html.bak.20261013-1234
?? src/app.html.bak.20261013-1237
?? src/app.html.bak.20261013-1329
?? src/app.html.bak.20261013-1403
?? src/app.html.bak.20261013-1413
?? src/app.html.bak.20261013-1413b
?? src/frac.js.bak.20261013-1221
?? src/frac.js.bak.20261013-1225
?? src/hard.js.bak.20261013-1221
?? src/hard.js.bak.20261013-1225
?? src/hard.js.bak.20261013-1237
?? src/hard.js.bak.20261013-1402
?? src/sync.js.bak.20261013-1300
?? src/sync.js.bak.20261013-1329
?? src/sync.js.bak.20261013-1411
?? src/sync.js.bak.20261013-1412
?? tests/frac.test.js.bak.20261013-1221
?? tests/frac.test.js.bak.20261013-1225
?? tests/hard.test.js.bak.20261013-1219
?? tests/hard.test.js.bak.20261013-1221
?? tests/hard.test.js.bak.20261013-1225
?? tests/hard.test.js.bak.20261013-1235
?? tests/hard.test.js.bak.20261013-1237
?? tests/hard.test.js.bak.20261013-1401
?? tests/sync.test.js.bak.20261013-1411
?? tests/sync.test.js.bak.20261013-1412
docs/storage-design-C-4agent-20261013.md
docs/codex-review-r5-20261013.md
docs/storage-design-B-20261013.md
tests/sync.test.js
tests/hard.test.js.bak.20261013-1237
tests/frac.test.js.bak.20261013-1221
tests/hard.test.js
tests/frac.test.js
tests/upprogress.test.js
tests/inbox.test.js
tests/sync.test.js.bak.20261013-1412
tests/hard.test.js.bak.20261013-1225
tests/e2e.py
tests/frac.test.js.bak.20261013-1225
tests/gascore.test.js
tests/hard.test.js.bak.20261013-1401
tests/hard.test.js.bak.20261013-1235
tests/sync.test.js.bak.20261013-1411
tests/hard.test.js.bak.20261013-1219
tests/hard.test.js.bak.20261013-1221

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "git log -8 --oneline; rg -n 'storage|snapshot|persist|locked|lock|backup|canReplace|accept|save\\(|load\\(|g5|sync' src/app.html; rg --files -g '"'!*.bak*'"' -g '"'!index.html'"' -g '"'!src/app.html'"' -g '"'!questions*'"' -g '"'!assets/**'"' -g '"'!data/**'"'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-WCWaUrXi' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-4X7CWPyV' (errno=Operation not permitted)
455135d 難題站存檔設計 C（#1303，Codex 設計後連兩輪 FAIL → 4agent 定案）：本頁記憶體唯一真相
5367999 白話機制補用詞（#1319）＋傳題進度條隨時間（#1320）
65c4c67 白話程度依年級（學年度 8/1 換級，今＝小五每句≤40 字，小六 45…）寫進 hard.js＋hard.test 逐句檢查；家長傳題目進度條（33/66/100%）
00dca9e 難題站存檔：修 Codex 第 4 輪（設計後首輪）必修 1–6＋建議 7（交辦 #1303）
7671fac 難題解說比照自然科（白話、每步一圖、影片）：hard.test 強制每步有圖（含 aria-label）、每篇有驗證過的影片或 noVideoReason；板根篇補第 2–4 步圖＋2 段影片（whisper／字幕全文讀過、抽格看過、可嵌入）
908d4fe 家長傳題目：進度清單（已送出／製作中／做好了＋連結）＋電腦上次取題時間（>20 分鐘紅字提示可能故障）；GAS mine/done 部署 @5；inbox.test 4/4（交辦 #1309）
caa23e6 難題解說：自然・植物世界練習卷選擇題第 5 題（銀葉樹的板根）——律師 13:27 從網頁傳題（交辦 #1305）
3dad906 難題站存檔改走 Codex 設計者方案 B：Web Locks 單一寫入分頁（交辦 #1303）
84:/* 跨裝置同步面板（src/sync.js 產生，class 前綴 g5s-） */
85:.g5s-panel{display:grid;gap:10px}
86:.g5s-button{min-height:46px;padding:9px 16px;margin:4px 8px 4px 0;border:2px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);font-size:17px;cursor:pointer}
87:.g5s-input,.g5s-link{box-sizing:border-box;max-width:100%;padding:10px;font-size:17px;border:2px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)}
88:.g5s-link{width:100%}
89:.g5s-code{font-size:26px;font-weight:700;letter-spacing:.08em;font-variant-numeric:tabular-nums}
90:.g5s-conflict{padding:14px;border:2px solid var(--sun);border-radius:12px;background:var(--sun-soft)}
91:.g5s-notice{color:var(--bad)}
92:.g5s-panel svg{width:180px;height:180px;background:#fff;padding:8px;border-radius:8px}
110:.fin i{display:block;width:100%;height:2px;background:var(--ink)}
113:.fbar{width:100%;height:auto;display:block}
123:.dots i{width:16px;height:16px;border-radius:50%;background:var(--line-soft);display:inline-block}
147:        <label>照片 <input type="file" id="upFile" accept="image/*" style="font-size:16px"></label>
154:    <details id="syncBox"><summary>換電腦或 iPad 也能接著練（跨裝置同步）</summary><div id="g5sync"></div></details>
181:<script src="sync.js"></script>
202:function reveal(el){ setTimeout(function(){ if (el.scrollIntoView) el.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "start"}); }, 40); }
215:// ---------- 存檔：g5help.v1＝{v:1, entries:{篇id: 那一篇的教學與練習紀錄}}；不碰自然複習的 g5sci.v3 ----------
216:var KEY = "g5help.v1";
244:// ①同一時間只有一個寫入分頁（Web Locks）；sync.js 也不能直接寫 g5help.v1（canReplace／accept 交給本頁）。
246:// ③作答改記憶體並標 DIRTY；save() 把記憶體整份寫進主 key，寫成功才清 DIRTY；失敗保留、每 3 秒自動再試、
248:// ⑤不聽 storage 事件換資料（只有本頁會寫）；雲端新版本只在「首頁、沒有未存進度」時由本頁套用並重畫，不 reload。
251:// broken＝主 key 有原文但讀不懂，備份與替換一律在 save() 裡、確認備份成功後才做。
257:  try { oldRaw = localStorage.getItem("g5math.v1"); } catch (e) { return {ok:false}; }   // 舊 key 讀不到也算讀取失敗（Codex 第 5 輪必修 1）
260:    // 2026-10-12 那一頁放在自然複習網站時存在 g5math.v1：搬進第 1 篇（舊資料原文不動）
270:function backupBroken(raw){
278:  if (!RETRY) RETRY = setTimeout(function(){ RETRY = null; if (dirtyCount()) save(); }, 3000);
281:function save(){
286:  if (d.broken !== null && !backupBroken(d.broken)) return saveFailed();   // 備份不了就不覆蓋原文
309:function canReplace(key){ return key === KEY && WRITER && READY && !E && !dirtyCount(); }
311:  if (!canReplace(key)) return false;
374:  try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
519:    st.lessonDone = true; save(); drawTopBtns();
530:function lock(box){ each(box.querySelectorAll("input,button[data-check],button[data-hint]"), function(x){ x.disabled = true; }); }
543:  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
591:      else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, r.msg); }
601:    var saved = save();
617:      if (r.ok) { lock(row); fb(out, true, r.msg); r.next(); }
618:      else { if (r.countable) { cur.wrongs++; save(); } fb(out, false, r.msg); }
622:      cur.hints++; save(); hb.hidden = false; hb.textContent = hints[Math.min(lvl, hints.length - 1)](); lvl++;
682:  st.lessonDone = true; save(); drawTopBtns();
687:  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
697:    if (k !== q.a) { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, (q.why && q.why[k]) || "再想想看。"); return; }
704:    var saved = save(), PE = $("#pend", P); PE.hidden = false;
750:$("#saveRetry").onclick = function(){ save(); };
756:function start(){ countdown(); route(); window.dispatchEvent(new Event("g5help-ready")); }
757:if (navigator.locks && navigator.locks.request) {
758:  var lockFail = function(){ WRITER = false; READONLY_MSG = "這一頁拿不到存檔的權限（瀏覽器拒絕），只能看不能練；請重新整理或換瀏覽器。"; start(); };
759:  navigator.locks.request("g5help-writer", {ifAvailable: true}, function(lock){
760:    if (!lock) {
762:      navigator.locks.request("g5help-writer", function(){ location.reload(); return new Promise(function(){}); }).catch(function(){});
767:  }).catch(lockFail);
774:window.G5HelpCanReplace = canReplace;
780:// 跨裝置同步（家庭同步碼）：只同步本站自己的 g5help.v1；同步碼存在同網域 localStorage，自然站連過也算
782:  if (!window.G5Sync) return;   // sync.js 載不到就照常本機使用
783:  function boot(){ if (!(window.G5HelpWriter && window.G5HelpWriter())) { var c = document.getElementById("g5sync"); if (c) c.textContent = "（在另一個分頁開著，同步由那一頁負責）"; return; }
786:    keys: ["g5help.v1"], container: "#g5sync",
787:    summarize: {"g5help.v1": function(j){ try { var x = JSON.parse(j), n = 0, m = 0; Object.keys(x.entries || {}).forEach(function(k){ n += x.entries[k].solved || 0; if (x.entries[k].mastered) m++; }); return "練習做完 " + n + " 題、學會 " + m + " 篇"; } catch (e) { return "（讀不懂的紀錄）"; } }},
789:    canReplace: function(key){ return window.G5HelpCanReplace(key); },
790:    accept: function(key, data){ return window.G5HelpApplyRemote(key, data); }
792:  window.addEventListener("g5help-ready", boot, {once: true});
818:    var code = null; try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
829:        var barH = '<div role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" style="height:10px;border-radius:99px;background:var(--line-soft);overflow:hidden;margin:4px 0"><i style="display:block;height:100%;width:' + pct + '%;background:' + (pct === 100 ? "var(--leaf)" : "var(--pri)") + '"></i></div><span class="meta">進度 ' + pct + '%</span>';
837:    var code = null; try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
src/sync.js
src/hard.js
src/upprogress.js
src/frac.js
src/qrcode.js
robots.txt
docs/codex-review-r3-20261013.md
docs/storage-design-C-4agent-20261013.md
docs/codex-review-r5-20261013.md
docs/storage-design-B-20261013.md
docs/codex-review-r4-20261013.md
tests/sync.test.js
tests/hard.test.js
tests/frac.test.js
tests/upprogress.test.js
tests/inbox.test.js
tests/e2e.py
tests/gascore.test.js
tests/e2e_sync.py
tests/harness.js
sync.js
qrcode.js
gas/inbox.js
gas/README.md
gas/appsscript.json
gas/Code.js
gas/core.js
build.py

hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'nl -ba src/sync.js' in /Users/william/Documents/g5-help
 succeeded in 0ms:
     1	/* ES5 syntax; requires native Promise/fetch (or the supplied fetch function).
     2	 * Progress documents are opaque strings. No field-level merging is performed.
     3	 */
     4	(function (root, factory) {
     5	  var api = factory(root);
     6	  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
     7	  if (root) { root.G5Sync = api; }
     8	}(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this), function (root) {
     9	  'use strict';
    10	  var ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    11	  var KEYS = ['g5sci.v3', 'g5help.v1', 'g5math.v1', 'g5math.v2'];
    12	  var CODE = 'g5sync.code';
    13	  var META = 'g5sync.meta';
    14	  var BAD_CODE = '同步碼須為 12 碼英文字母或數字，不含 0、O、1、I、L；可包含空白與連字號。';
    15	  var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    16	    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    17	    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    18	    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    19	    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    20	    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    21	    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    22	    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    23	  function rotate(x, n) { return (x >>> n) | (x << (32 - n)); }
    24	  // SHA-256 over tagged UTF-16LE, including lone surrogates without lossy coercion.
    25	  function contentHash(value) {
    26	    var s = value === null ? 'N' : 'S' + value;
    27	    var bytes = s.length * 2;
    28	    var size = Math.ceil((bytes + 9) / 64) * 64;
    29	    var h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    30	    var bits = bytes * 8;
    31	    var w = new Array(64);
    32	    var offset, i, j, p, b;
    33	    for (offset = 0; offset < size; offset += 64) {
    34	      for (i = 0; i < 16; i += 1) {
    35	        w[i] = 0;
    36	        for (j = 0; j < 4; j += 1) {
    37	          p = offset + i * 4 + j;
    38	          b = 0;
    39	          if (p < bytes) { b = (s.charCodeAt(Math.floor(p / 2)) >>> ((p % 2) * 8)) & 255; }
    40	          else if (p === bytes) { b = 128; }
    41	          else if (p >= size - 4) { b = (bits >>> ((size - 1 - p) * 8)) & 255; }
    42	          else if (p >= size - 8) { b = (Math.floor(bits / 4294967296) >>> ((size - 5 - p) * 8)) & 255; }
    43	          w[i] = (w[i] << 8) | b;
    44	        }
    45	      }
    46	      for (i = 16; i < 64; i += 1) {
    47	        var s0 = rotate(w[i - 15], 7) ^ rotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
    48	        var s1 = rotate(w[i - 2], 17) ^ rotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
    49	        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    50	      }
    51	      var a = h[0], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], z = h[7];
    52	      b = h[1];
    53	      for (i = 0; i < 64; i += 1) {
    54	        var t1 = (z + (rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
    55	        var t2 = ((rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
    56	        z = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    57	      }
    58	      var work = [a,b,c,d,e,f,g,z];
    59	      for (i = 0; i < 8; i += 1) { h[i] = (h[i] + work[i]) | 0; }
    60	    }
    61	    return 'sha256-utf16le:' + h.map(function (n) { return ('00000000' + (n >>> 0).toString(16)).slice(-8); }).join('');
    62	  }
    63	  function normalizeCode(value) {
    64	    var code = String(value || '').replace(/[\s-]/g, '').toUpperCase();
    65	    return code.length === 12 && /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/.test(code) ? code : null;
    66	  }
    67	  function error(kind) { var e = new Error(kind); e.kind = kind; return e; }
    68	  function integer(n) { return typeof n === 'number' && isFinite(n) && Math.floor(n) === n && n >= 0 && n < 9007199254740991; }
    69	  function pad(n) { return ('0' + n).slice(-2); }
    70	  function taipei(stamp, full) {
    71	    if (!integer(stamp)) { return '尚無紀錄'; }
    72	    // Asia/Taipei is UTC+08:00 for every timestamp produced by this app.
    73	    var d = new Date(stamp + 8 * 3600000);
    74	    var time = pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
    75	    return full ? d.getUTCFullYear() + '/' + pad(d.getUTCMonth() + 1) + '/' + pad(d.getUTCDate()) + ' ' + time + '（台北時間）' : time;
    76	  }
    77	
    78	  function init(options) {
    79	    options = options || {};
    80	    var container = options.container;
    81	    var doc = (container && container.ownerDocument) || root.document;
    82	    if (typeof container === 'string' && doc) { container = doc.querySelector(container); }
    83	    if (!container || !doc) { throw new Error('G5Sync requires a container'); }
    84	    var keys = (options.keys || KEYS).filter(function (key, i, all) { return all.indexOf(key) === i; });
    85	    if (!keys.length || keys.some(function (key) { return KEYS.indexOf(key) < 0; })) { throw new Error('G5Sync: bad-key'); }
    86	    var now = options.now || Date.now;
    87	    var fetcher = options.fetch || (root.fetch && root.fetch.bind(root));
    88	    var storage;
    89	    try { storage = options.storage || root.localStorage; } catch (ignoreStorage) { storage = null; }
    90	    var code = null, epoch = 0, destroyed = false, stopped = false;
    91	    var busy = null, activeAbort = null, retryTimer = null, failures = 0, retryAt = 0;
    92	    var needsGet = {}, conflicts = {}, decisions = {}, observed = {}, replaced = [], deferred = {};
    93	    var status = '尚未開啟同步', notice = '', viewCode, view = {};
    94	
    95	    function read(key) {
    96	      if (!storage) { throw error('storage'); }
    97	      return storage.getItem(key);
    98	    }
    99	    function write(key, value) {
   100	      if (!storage) { throw error('storage'); }
   101	      storage.setItem(key, value);
   102	    }
   103	    function blankMeta() { return {version: 1, codeHash: contentHash(code), keys: {}}; }
   104	    function readMeta() {
   105	      var raw = read(META), meta;
   106	      try { meta = JSON.parse(raw); } catch (ignore) { meta = null; }
   107	      if (!meta || meta.version !== 1 || meta.codeHash !== contentHash(code) || !meta.keys || typeof meta.keys !== 'object' || Array.isArray(meta.keys)) { return blankMeta(); }
   108	      return meta;
   109	    }
   110	    function baseline(key) {
   111	      var entry = readMeta().keys[key];
   112	      if (!entry || !integer(entry.rev) || typeof entry.hash !== 'string' || !/^sha256-utf16le:[a-f0-9]{64}$/.test(entry.hash)) { return null; }
   113	      return entry;
   114	    }
   115	    function saveBaseline(key, rev, data, updated) {
   116	      var meta = readMeta(); // Preserve other sites' key entries on the same origin.
   117	      var previous = meta.keys[key];
   118	      if (previous && integer(previous.rev) && previous.rev > rev) { needsGet[key] = true; return; }
   119	      meta.keys[key] = {rev: rev, hash: contentHash(data), updated: updated};
   120	      write(META, JSON.stringify(meta));
   121	    }
   122	    function active(token) {
   123	      return !destroyed && !stopped && token === epoch && code && read(CODE) === code;
   124	    }
   125	    function assertActive(token) { if (!active(token)) { throw error('stale'); } }
   126	    function observe(key, data) {
   127	      var hash = contentHash(data);
   128	      if (!observed[key] || observed[key].hash !== hash) { observed[key] = {hash: hash, detected: now()}; }
   129	      return observed[key];
   130	    }
   131	    function backup(key, data) {
   132	      if (data === null) { return; }
   133	      var prefix = 'g5sync.backup.' + key + '.';
   134	      var names = [];
   135	      for (var i = 0; i < storage.length; i += 1) {
   136	        var name = storage.key(i);
   137	        if (name && name.indexOf(prefix) === 0 && /^\d+$/.test(name.slice(prefix.length))) { names.push(name); }
   138	      }
   139	      names.sort(function (a, b) { return Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)); });
   140	      var stamp = Math.max(now(), names.length ? Number(names[names.length - 1].slice(prefix.length)) + 1 : 0);
   141	      // Write before pruning: quota errors must NEVER discard progress or its last backup.
   142	      var target = prefix + stamp;
   143	      write(target, data);
   144	      if (read(target) !== data) { throw error('storage'); }
   145	      names.push(target);
   146	      while (names.length > 3) { storage.removeItem(names.shift()); }
   147	    }
   148	    function summary(key, data) {
   149	      if (data === null) { return '沒有進度紀錄'; }
   150	      try {
   151	        if (options.summarize && typeof options.summarize[key] === 'function') { return String(options.summarize[key](data)); }
   152	      } catch (ignore) { /* Summary errors cannot prevent reconciliation. */ }
   153	      return '完整紀錄，共 ' + data.length + ' 字元';
   154	    }
   155	    function el(tag, className, text) {
   156	      var node = doc.createElement(tag);
   157	      node.className = 'g5s-' + className;
   158	      if (typeof text !== 'undefined') { node.textContent = text; }
   159	      return node;
   160	    }
   161	    function button(text, fn) {
   162	      var b = el('button', 'button', text);
   163	      b.type = 'button'; b.style.minHeight = '44px';
   164	      b.addEventListener('click', fn);
   165	      return b;
   166	    }
   167	    function link() {
   168	      var href = root.location ? root.location.href : '';
   169	      return href.split('#')[0] + '#sync=' + (code || '');
   170	    }
   171	    function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }
   172	    function buildView() {
   173	      clear(container);
   174	      var panel = el('section', 'panel');
   175	      panel.setAttribute('aria-label', '家庭跨裝置同步');
   176	      view = {panel: panel};
   177	      if (!code) {
   178	        panel.appendChild(button('開啟跨裝置同步（這台是第一台）', function () { enable(); }));
   179	        panel.appendChild(button('輸入同步碼（已在別台開過）', function () {
   180	          view.join.hidden = false; view.input.focus();
   181	        }));
   182	        var form = el('form', 'join'); form.hidden = true;
   183	        var label = el('label', 'label', '同步碼');
   184	        var input = el('input', 'input'); input.type = 'text'; input.maxLength = 80;
   185	        input.autocomplete = 'off'; input.spellcheck = false; input.style.minHeight = '44px';
   186	        input.setAttribute('autocapitalize', 'characters'); input.setAttribute('aria-label', '同步碼');
   187	        label.appendChild(input); form.appendChild(label);
   188	        form.appendChild(el('p', 'hint', BAD_CODE));
   189	        form.appendChild(button('加入同步', function () { join(input.value); }));
   190	        form.addEventListener('submit', function (event) { event.preventDefault(); join(input.value); });
   191	        panel.appendChild(form); view.join = form; view.input = input;
   192	      } else {
   193	        panel.appendChild(el('p', 'code', code.match(/.{4}/g).join('-')));
   194	        var qrBox = el('div', 'qr');
   195	        qrBox.setAttribute('aria-label', '掃描 QR code 加入同步');
   196	        try {
   197	          if (typeof root.qrcode !== 'function') { throw error('qr'); }
   198	          var qr = root.qrcode(0, 'M'); qr.addData(link()); qr.make();
   199	          qrBox.innerHTML = qr.createSvgTag({cellSize: 4, margin: 16, scalable: true});
   200	          qrBox.style.maxWidth = '256px';
   201	        } catch (qrError) { qrBox.textContent = 'QR code 無法顯示，請使用下方連結或同步碼。'; }
   202	        panel.appendChild(qrBox);
   203	        var share = el('input', 'link'); share.type = 'text'; share.readOnly = true;
   204	        share.value = link(); share.setAttribute('aria-label', '同步連結'); share.style.minHeight = '44px';
   205	        panel.appendChild(share);
   206	        panel.appendChild(button('複製連結', function () {
   207	          var clipboard = root.navigator && root.navigator.clipboard;
   208	          if (clipboard && clipboard.writeText) {
   209	            Promise.resolve().then(function () { return clipboard.writeText(link()); }).then(function () {
   210	              notice = '連結已複製。'; render();
   211	            }, function () { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); });
   212	          } else { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); }
   213	        }));
   214	        panel.appendChild(button('這台停止同步', function () { stop(); }));
   215	      }
   216	      view.status = el('p', 'status'); view.status.setAttribute('role', 'status'); view.status.setAttribute('aria-live', 'polite');
   217	      view.notice = el('p', 'notice'); view.notice.setAttribute('role', 'alert');
   218	      view.conflicts = el('div', 'conflicts');
   219	      panel.appendChild(view.status); panel.appendChild(view.notice); panel.appendChild(view.conflicts);
   220	      container.appendChild(panel); viewCode = code;
   221	    }
   222	    function render() {
   223	      if (destroyed) { return; }
   224	      if (viewCode !== code || !view.panel) { buildView(); }
   225	      view.status.textContent = status; view.notice.textContent = notice;
   226	      var signature = keys.map(function (key) {
   227	        if (!conflicts[key]) { return ''; }
   228	        var local = read(key);
   229	        return key + ':' + conflicts[key].rev + ':' + observe(key, local).hash + ':' + (decisions[key] || '');
   230	      }).join('|');
   231	      if (view.signature === signature) { return; }
   232	      view.signature = signature;
   233	      clear(view.conflicts);
   234	      keys.forEach(function (key) {
   235	        var cloud = conflicts[key];
   236	        if (!cloud) { return; }
   237	        var local = read(key), obs = observe(key, local);
   238	        var box = el('section', 'conflict');
   239	        box.appendChild(el('h3', 'conflict-title', key + '：請選擇保留哪份完整紀錄'));
   240	        box.appendChild(el('p', 'local-summary', '這台：' + summary(key, local)));
   241	        box.appendChild(el('p', 'local-time', '本機變更偵測時間：' + taipei(obs.detected, true) + '；實際作答時間由各站紀錄提供。'));
   242	        box.appendChild(el('p', 'cloud-summary', '雲端：' + summary(key, cloud.data)));
   243	        box.appendChild(el('p', 'cloud-time', '雲端更新時間：' + taipei(cloud.updated, true)));
   244	        var keepLocal = button('留這台的', function () { resolve(key, 'local'); }); keepLocal.disabled = local === null || !!decisions[key];
   245	        var keepCloud = button('留雲端的', function () { resolve(key, 'cloud'); }); keepCloud.disabled = cloud.data === null || !!decisions[key];
   246	        box.appendChild(keepLocal); box.appendChild(keepCloud); view.conflicts.appendChild(box);
   247	      });
   248	    }
   249	    function validSnapshot(r) {
   250	      return r && integer(r.rev) && (r.rev === 0 ? r.data === null && r.updated === null :
   251	        typeof r.data === 'string' && r.data.length <= 900000 && integer(r.updated));
   252	    }
   253	    function request(req, token) {
   254	      assertActive(token);
   255	      if (!options.endpoint || typeof fetcher !== 'function') { return Promise.reject(error('server')); }
   256	      if (root.navigator && root.navigator.onLine === false) { return Promise.reject(error('offline')); }
   257	      req.code = code;
   258	      return new Promise(function (done, reject) {
   259	        var settled = false;
   260	        var controller = root.AbortController ? new root.AbortController() : null;
   261	        activeAbort = controller;
   262	        var timeout = root.setTimeout(function () {
   263	          if (controller) { controller.abort(); }
   264	          finish(error('offline'));
   265	        }, 15000);
   266	        function finish(err, value) {
   267	          if (settled) { return; }
   268	          settled = true; root.clearTimeout(timeout);
   269	          if (activeAbort === controller) { activeAbort = null; }
   270	          if (err) { reject(err); } else { done(value); }
   271	        }
   272	        var config = {method: 'POST', headers: {'Content-Type': 'text/plain'}, body: JSON.stringify(req),
   273	          mode: 'cors', credentials: 'omit', redirect: 'follow', cache: 'no-store'};
   274	        if (controller) { config.signal = controller.signal; }
   275	        Promise.resolve().then(function () { return fetcher(options.endpoint, config); }).then(function (response) {
   276	          assertActive(token);
   277	          if (!response || response.ok === false || typeof response.json !== 'function') { throw error('server'); }
   278	          return Promise.resolve().then(function () { return response.json(); }).catch(function () { throw error('server'); });
   279	        }, function () { throw error('offline'); }).then(function (r) {
   280	          assertActive(token);
   281	          if (!r || (r.ok !== true && r.ok !== false)) { throw error('server'); }
   282	          if (req.op === 'get' && r.ok !== true) { throw error('server'); }
   283	          if (r.ok === false && r.err !== 'conflict') { throw error(r.err === 'too-big' ? 'too-big' : 'server'); }
   284	          if ((req.op === 'get' || r.err === 'conflict') && !validSnapshot(r)) { throw error('server'); }
   285	          if (req.op === 'put' && r.ok && (!integer(r.rev) || r.rev !== req.rev + 1 || !integer(r.updated))) { throw error('server'); }
   286	          finish(null, r);
   287	        }).catch(function (err) { finish(err); });
   288	      });
   289	    }
   290	    function showConflict(key, cloud) {
   291	      delete decisions[key]; // A newly observed cloud version requires a new choice.
   292	      conflicts[key] = {rev: cloud.rev, data: cloud.data, updated: cloud.updated};
   293	      status = '有兩份進度，請選擇要保留的紀錄。';
   294	      render();
   295	    }
   296	    function replaceLocal(key, cloud, token) {
   297	      assertActive(token);
   298	      if (cloud.data === null) { throw error('server'); }
   299	      var currentMeta = baseline(key);
   300	      if (currentMeta && currentMeta.rev > cloud.rev) { showConflict(key, cloud); return; }
   301	      // 頁面自己是唯一寫入者時（難題站，#1303 第 5 輪）：先問能不能換（有未存進度、正在某一篇裡就不行），
   302	      // 不行就什麼都不動（不備份、不寫），下一輪再 GET 再問；可以才備份，並交給頁面自己寫入與重畫（不 reload）。
   303	      if (typeof options.canReplace === 'function' && !options.canReplace(key)) {
   304	        needsGet[key] = true; deferred[key] = true; return;
   305	      }
   306	      var local = read(key);
   307	      backup(key, local);
   308	      assertActive(token);
   309	      // Synchronous read/backup/write; no awaited work between decision and replacement.
   310	      if (typeof options.accept === 'function') {
   311	        if (!options.accept(key, cloud.data)) { needsGet[key] = true; deferred[key] = true; return; }
   312	      } else { write(key, cloud.data); }
   313	      if (read(key) !== cloud.data) { throw error('storage'); }
   314	      delete deferred[key];
   315	      replaced.push(key); // Notify even if persisting the following metadata fails.
   316	      saveBaseline(key, cloud.rev, cloud.data, cloud.updated);
   317	      delete conflicts[key];
   318	    }
   319	    function put(key, data, rev, token, chosenCloud) {
   320	      if (data === null) { return Promise.resolve(); }
   321	      if (data.length > 900000) { return Promise.reject(error('too-big')); }
   322	      if (chosenCloud) { backup(key, chosenCloud.data); }
   323	      return request({op: 'put', key: key, rev: rev, data: data}, token).then(function (r) {
   324	        assertActive(token);
   325	        if (r.err === 'conflict') { showConflict(key, r); return; }
   326	        // The baseline is the exact request payload, never a newer local edit.
   327	        saveBaseline(key, r.rev, data, r.updated);
   328	        delete conflicts[key];
   329	      });
   330	    }
   331	    function reconcile(key, cloud, token) {
   332	      assertActive(token);
   333	      var local = read(key), meta = baseline(key), hash = observe(key, local).hash;
   334	      needsGet[key] = false;
   335	      if (cloud.rev === 0) {
   336	        if (local !== null) { return put(key, local, 0, token); }
   337	        saveBaseline(key, 0, null, null); return;
   338	      }
   339	      if (!meta) {
   340	        if (local === null) { replaceLocal(key, cloud, token); }
   341	        else { showConflict(key, cloud); }
   342	        return;
   343	      }
   344	      if (cloud.rev < meta.rev || (cloud.rev === meta.rev && contentHash(cloud.data) !== meta.hash)) {
   345	        showConflict(key, cloud); return;
   346	      }
   347	      if (cloud.rev > meta.rev) {
   348	        if (hash === meta.hash) { replaceLocal(key, cloud, token); }
   349	        else { showConflict(key, cloud); }
   350	        return;
   351	      }
   352	      if (hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   353	    }
   354	    function resetSession(nextCode) {
   355	      epoch += 1; code = nextCode; needsGet = {}; conflicts = {}; decisions = {}; observed = {}; replaced = []; deferred = {};
   356	      failures = 0; retryAt = 0; notice = '';
   357	      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   358	      keys.forEach(function (key) { needsGet[key] = true; });
   359	      status = code ? '正在同步' : '尚未開啟同步';
   360	    }
   361	    function failure(err) {
   362	      if (err.kind === 'stale') { return; }
   363	      failures += 1;
   364	      var delay = Math.min(60000, 4000 * Math.pow(2, Math.min(failures - 1, 4)));
   365	      retryAt = now() + delay;
   366	      status = err.kind === 'offline' ? '離線中，連上網路會自動補上' : '同步失敗，稍後自動再試';
   367	      if (err.kind === 'storage' || err.name === 'QuotaExceededError') { notice = '本機儲存空間不足或無法使用，請保留原進度並檢查瀏覽器儲存設定。'; }
   368	      if (err.kind === 'too-big') { notice = '這份進度超過 900000 字元，請先保留本機資料。'; }
   369	      if (retryTimer !== null) { root.clearTimeout(retryTimer); }
   370	      retryTimer = root.setTimeout(function () { retryTimer = null; sync(); }, delay);
   371	    }
   372	    function completed() {
   373	      if (keys.some(function (key) { return !!conflicts[key]; })) {
   374	        status = '有兩份進度，請選擇要保留的紀錄。'; return;
   375	      }
   376	      var dirty = keys.some(function (key) {
   377	        var meta = baseline(key), local = read(key);
   378	        return needsGet[key] || !meta || contentHash(local) !== meta.hash;
   379	      });
   380	      status = dirty ? '等待同步本機變更' : '已同步 ' + taipei(now(), false);
   381	      if (keys.some(function (key) { return !!deferred[key]; })) { status = '雲端有較新的進度，回到首頁、存好後就會換上。'; }
   382	      if (keys.some(function (key) { var meta = baseline(key); return meta && meta.rev > 0 && read(key) === null; })) {
   383	        status = '這台的進度已移除，雲端紀錄保留；重新加入可下載。';
   384	      }
   385	    }
   386	    function run(job, force) {
   387	      if (destroyed || stopped) { return Promise.resolve(false); }
   388	      if (busy) { return busy.then(function () { return run(job, force); }); }
   389	      var token;
   390	      busy = Promise.resolve().then(function () {
   391	        var saved = read(CODE);
   392	        if (saved !== code) { resetSession(saved && normalizeCode(saved) === saved ? saved : null); }
   393	        if (!code || (!force && now() < retryAt)) { return false; }
   394	        token = epoch;
   395	        return job(token).then(function () {
   396	          assertActive(token);
   397	          failures = 0; retryAt = 0;
   398	          notice = '';
   399	          if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   400	          completed(); return true;
   401	        });
   402	      }).catch(function (err) {
   403	        if (typeof token === 'undefined' || token === epoch) { failure(err); }
   404	        return false;
   405	      }).then(function (result) {
   406	        busy = null;
   407	        try { render(); } catch (ignoreRender) { /* Storage failures may also affect conflict display. */ }
   408	        var callbacks = replaced; replaced = [];
   409	        callbacks.forEach(function (key) {
   410	          if (typeof options.onReplaced === 'function') {
   411	            try { options.onReplaced(key); } catch (ignoreCallback) { /* Host callback cannot break the scheduler. */ }
   412	          }
   413	        });
   414	        return result;
   415	      });
   416	      return busy;
   417	    }
   418	    function sync(force) {
   419	      return run(function (token) {
   420	        var chain = Promise.resolve();
   421	        var firstError = null;
   422	        keys.forEach(function (key) {
   423	          chain = chain.then(function () {
   424	            assertActive(token);
   425	            if (decisions[key]) { return applyDecision(key, token); }
   426	            if (conflicts[key]) { observe(key, read(key)); return; }
   427	            if (needsGet[key]) {
   428	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   429	            }
   430	            var local = read(key), meta = baseline(key);
   431	            if (!meta) {
   432	              needsGet[key] = true;
   433	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   434	            }
   435	            if (observe(key, local).hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   436	          }).catch(function (err) {
   437	            if (err.kind === 'stale') { throw err; }
   438	            if (!firstError) { firstError = err; }
   439	          });
   440	        });
   441	        return chain.then(function () { if (firstError) { throw firstError; } });
   442	      }, force === true);
   443	    }
   444	    function activate(newCode) {
   445	      // Clear the old baseline first. A partial storage failure then fails conservatively.
   446	      storage.removeItem(META);
   447	      write(CODE, newCode);
   448	      stopped = false; resetSession(newCode); render();
   449	      return sync(true);
   450	    }
   451	    function enable() {
   452	      if (code && !stopped) { return sync(true); }
   453	      try {
   454	        var random = options.random;
   455	        if (!random && root.crypto && root.crypto.getRandomValues) { random = root.crypto.getRandomValues.bind(root.crypto); }
   456	        if (random && typeof random !== 'function' && random.getRandomValues) { random = random.getRandomValues.bind(random); }
   457	        if (!random) { throw error('random'); }
   458	        var generated = '', tries = 0, limit = Math.floor(256 / ALPHABET.length) * ALPHABET.length;
   459	        while (generated.length < 12 && tries < 128) {
   460	          var bytes = new Uint8Array(32); random(bytes); tries += 1;
   461	          for (var i = 0; i < bytes.length && generated.length < 12; i += 1) {
   462	            if (bytes[i] < limit) { generated += ALPHABET.charAt(bytes[i] % ALPHABET.length); }
   463	          }
   464	        }
   465	        if (generated.length !== 12) { throw error('random'); }
   466	        return activate(generated);
   467	      } catch (err) {
   468	        status = '同步失敗，稍後自動再試';
   469	        notice = err.kind === 'random' ? '此瀏覽器無法安全產生同步碼，請使用 HTTPS 開啟網站。' : '無法儲存同步設定，請檢查瀏覽器儲存空間。';
   470	        render(); return Promise.resolve(false);
   471	      }
   472	    }
   473	    function join(value) {
   474	      var normalized = normalizeCode(value);
   475	      if (!normalized) { notice = BAD_CODE; render(); return Promise.resolve(false); }
   476	      try { return activate(normalized); }
   477	      catch (err) { failure(err); render(); return Promise.resolve(false); }
   478	    }
   479	    function applyDecision(key, token) {
   480	      var cloud = conflicts[key], choice = decisions[key], action;
   481	      if (!cloud || !choice) { delete decisions[key]; return Promise.resolve(); }
   482	      if (choice === 'local') { action = put(key, read(key), cloud.rev, token, cloud); }
   483	      else {
   484	        // Re-fetch before accepting cloud: do not silently accept a version the parent never saw.
   485	        action = request({op: 'get', key: key}, token).then(function (latest) {
   486	          if (latest.rev !== cloud.rev || latest.data !== cloud.data) { showConflict(key, latest); return; }
   487	          replaceLocal(key, latest, token);
   488	        });
   489	      }
   490	      return action.then(function () { delete decisions[key]; });
   491	    }
   492	    function resolve(key, choice) {
   493	      if (destroyed || stopped || !conflicts[key] || decisions[key] || keys.indexOf(key) < 0 || (choice !== 'local' && choice !== 'cloud')) { return Promise.resolve(false); }
   494	      decisions[key] = choice;
   495	      render();
   496	      return run(function (token) { return applyDecision(key, token); }, true);
   497	    }
   498	    function stop() {
   499	      stopped = true; epoch += 1;
   500	      if (activeAbort) { activeAbort.abort(); }
   501	      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   502	      code = null; conflicts = {}; decisions = {}; replaced = []; notice = '';
   503	      var ok = true;
   504	      try { storage.removeItem(CODE); storage.removeItem(META); }
   505	      catch (err) { ok = false; notice = '同步已暫停，但瀏覽器無法清除設定；請檢查儲存權限。'; }
   506	      status = ok ? '這台已停止同步，進度仍保留。' : '同步已暫停';
   507	      render(); return ok;
   508	    }
   509	    function visibility() { if (doc.visibilityState === 'hidden' && !stopped) { sync(true); } }
   510	    function online() { if (!stopped) { sync(true); } }
   511	    function storageEvent(event) {
   512	      if (!event || event.key === CODE || event.key === META || keys.indexOf(event.key) >= 0 || event.key === null) {
   513	        // A stop on another same-origin tab also prevents this tab's in-flight readback.
   514	        if (!stopped) { sync(); }
   515	      }
   516	    }
   517	    function hashInvitation() {
   518	      if (!root.location || !root.history) { return null; }
   519	      var parts = root.location.hash.replace(/^#/, '').split('&'), kept = [], invitation = null;
   520	      parts.forEach(function (part) {
   521	        if (/^sync=/.test(part)) {
   522	          try { invitation = decodeURIComponent(part.slice(5)); } catch (ignore) { invitation = '!'; }
   523	        } else if (part) { kept.push(part); }
   524	      });
   525	      if (invitation !== null) {
   526	        root.history.replaceState(root.history.state, '', root.location.href.split('#')[0] + (kept.length ? '#' + kept.join('&') : ''));
   527	      }
   528	      return invitation;
   529	    }
   530	    var invitation = null;
   531	    try {
   532	      invitation = hashInvitation();
   533	      var saved = read(CODE);
   534	      if (saved && normalizeCode(saved) === saved) { resetSession(saved); }
   535	      else if (saved) { notice = BAD_CODE; }
   536	    } catch (err) { status = '同步失敗，稍後自動再試'; notice = '無法讀取同步設定，原進度保留。'; }
   537	    render();
   538	    doc.addEventListener('visibilitychange', visibility);
   539	    if (root.addEventListener) { root.addEventListener('online', online); root.addEventListener('storage', storageEvent); }
   540	    var interval = root.setInterval(function () { if (!stopped) { sync(); } }, 4000);
   541	    var api = {
   542	      enable: enable, join: join, stop: stop, sync: sync, resolve: resolve, link: link,
   543	      getState: function () { return {code: code, status: status, notice: notice, conflicts: JSON.parse(JSON.stringify(conflicts)), retryAt: retryAt, failures: failures}; },
   544	      destroy: function () {
   545	        destroyed = true; epoch += 1; replaced = [];
   546	        root.clearInterval(interval); if (retryTimer !== null) { root.clearTimeout(retryTimer); }
   547	        if (activeAbort) { activeAbort.abort(); }
   548	        doc.removeEventListener('visibilitychange', visibility);
   549	        if (root.removeEventListener) { root.removeEventListener('online', online); root.removeEventListener('storage', storageEvent); }
   550	      }
   551	    };
   552	    api.ready = invitation !== null ? join(invitation) : sync();
   553	    return api;
   554	  }
   555	  return {init: init, normalizeCode: normalizeCode, contentHash: contentHash};
   556	}));

hook: PreToolUse Completed
hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'nl -ba docs/codex-review-r5-20261013.md' in /Users/william/Documents/g5-help
 succeeded in 0ms:
     1	FAIL
     2	
     3	[已驗證] 原有單元測試 **12／12 通過**；另完成 **48 個 Node／DOM 替身回歸檢查**。但仍重現以下遺失進度路徑。原始檔未修改，8 個審查檔案前後 SHA-256 相同。
     4	
     5	1. **必修｜[app.html:264](/private/tmp/claude-501/-Users-william/cb29de8c-f836-406e-b915-104d6868b5f3/scratchpad/codex_help/app.html:264)、258、282、287、741｜冷啟動讀取失敗後，仍以空白狀態啟用作答，恢復讀取反而覆蓋原紀錄。**  
     6	   **具體重現：**預存數學 `solved=8、mastered=true`；初始化時令主 key 的 `getItem()` 拋錯。頁面仍出現練習按鈕。恢復讀取後點「直接練習」，磁碟立即變成 `solved=0`；完成一題再重開，實際為 `solved=1、mastered=false`。另測只有舊 `g5math.v1`、初始化讀舊 key 拋錯，也得到同樣結果。  
     7	   **原因：**`readOk` 沒有控制作答資格；舊 key 讀取例外被吞掉；`save()` 先設 `DIRTY`，使第 287 行的 `!own(DIRTY,E.id)` 永遠無法保護目前篇。  
     8	   **建議改法：**初始讀取未成功時不得建立可提交的空白基準；成功重讀並採用既有紀錄後才啟用作答。舊 key 的讀取例外也須與「沒有舊資料／格式損壞」分開處理。
     9	
    10	2. **必修｜[app.html:763](/private/tmp/claude-501/-Users-william/cb29de8c-f836-406e-b915-104d6868b5f3/scratchpad/codex_help/app.html:763)｜同步排隊的 reload，會丟掉排隊後才產生的未存進度。**  
    11	   **具體重現：**以 `G5Sync` 替身取得實際 `onReplaced`；磁碟換成雲端資料，在 `DIRTY=0` 時呼叫它，暫停其 timer。接著讓主 key 寫入失敗，孩子答對一題，確認 `DIRTY=1`；放行 timer，仍執行 **1 次 reload**。這次答案只在記憶體，將隨重新載入消失。  
    12	   **建議改法：**套用同步資料前停止舊畫面操作並推進世代；延後 reload 執行當下重新確認未存進度及世代。不能只在排入 timer 前檢查。  
    13	   此項已驗證 **app 接線的 callback 時序**；真實同步模組與雲端端到端流程未驗證。
    14	
    15	3. **必修｜[app.html:624](/private/tmp/claude-501/-Users-william/cb29de8c-f836-406e-b915-104d6868b5f3/scratchpad/codex_help/app.html:624)、725｜回首頁後看不到未存警告，且「會自動再試」沒有對應的等待重試。**  
    16	   **具體重現：**令寫入失敗，完成一題後回首頁，再恢復儲存並放行全部排定 timer。實際仍為 `DIRTY=1`、主 key 不存在；警告所在的 `#lead` 被整個 `#entry` 隱藏。另測繼續作答成功存入後，`DIRTY=0`，警告文字仍說「沒存好、請先不要關閉」。  
    17	   **建議改法：**將未存狀態放在首頁與各篇都可見的位置，提供真正的重試機制或重試按鈕；存成功後清除警告。
    18	
    19	4. **建議｜[app.html:268](/private/tmp/claude-501/-Users-william/cb29de8c-f836-406e-b915-104d6868b5f3/scratchpad/codex_help/app.html:268)、652｜世代失效尚未涵蓋所有舊畫面操作。**  
    20	   **具體重現：**
    21	   - 注入較新磁碟紀錄並派送 `storage`，在 `adoptNewer` 的 timer 前按舊畫面的正確選項：顯示「對了！」，舊 `st.solved` 增加，但寫入的是已替換的 `DB.entries`，答案沒有保存。
    22	   - 保留國語「我懂了，下一步」callback，切數學後重播：拋出 `TypeError: Cannot read properties of undefined (reading 'length')`。
    23	   
    24	   **建議改法：**採用新版資料時立即使舊互動失效，統一更新 `st` 與 `DB`；無確認題的下一步按鈕也要檢查世代。第一個反例以前提「收到其他來源的較新寫入」測試；第二個是明確重播舊 callback，未宣稱一般點擊必然觸發。
    25	
    26	第 4 輪逐項對照如下；編號依本輪程式註解及 `flow_codex_r4` 可辨識內容核對：
    27	
    28	| 前輪項目 | 本輪結果 |
    29	|---|---|
    30	| 必修 1：讀取失敗不得洗掉別篇 | 暖啟動原反例已修；冷啟動仍失敗，見本輪第 1 項。 |
    31	| 必修 2：備份失敗仍保留 DIRTY、可重試 | 替身驗證通過；兩篇未存進度保留，恢復後皆可提交。 |
    32	| 必修 3：讀取無寫入副作用、備份後才替換 | 替身驗證通過；讀取／路由／storage 通知不寫入，備份失敗不動主 key。 |
    33	| 必修 4：延後通知不得清掉另一篇 | 指定跨篇反例通過；國語通知排隊後切數學，數學教學保持可見。 |
    34	| 必修 5：取鎖拒絕 | 替身驗證通過；顯示唯讀訊息、不啟動同步。 |
    35	| 必修 6 | **未驗證**：本輪可讀測試未含其完整重現流程；同步相關接線另找到第 2 項問題。 |
    36	| 建議 7：唯讀頁寫入次數 | app 核心替身驗證為 **0 次**，同步初始化亦為 0 次；其他同步頁面未驗證。 |
    37	
    38	`DESIGN.md` T01–T30 對照如下。**「替身通過」只代表本輪 Node 原碼執行結果，不等於 Chromium＋WebKit 完整驗收。**
    39	
    40	| ID | 判定與證據 |
    41	|---|---|
    42	| T01 | 替身通過：交接後兩篇各一題，重開仍在。 |
    43	| T02 | **部分失敗**：正常搬家、壞原文備份、新資料優先通過；來源讀取失敗會遺失搬家進度。 |
    44	| T03 | 替身通過：`<`、`>`、`=` 的教學回饋方向正確。 |
    45	| T04 | 替身通過：0／1／2／3 題門檻及家長紀錄一致。 |
    46	| T05 | 替身通過：`constructor`、`__proto__` 各自保存並重開。 |
    47	| T06 | 替身通過：超大 idx 歸零，完成後正常遞增。 |
    48	| T07 | 替身通過：回首頁、切篇均移除 iframe。 |
    49	| T08 | 替身通過：seed、提示、答錯保留，完成後 `clean=false`。 |
    50	| T09 | 替身通過：備份寫入或讀回失敗，都保留壞原文。 |
    51	| T10 | 部分通過：雙篇未存進度與重試正確；首頁警告及等待重試有缺口。 |
    52	| T11 | 部分通過：交接保留答錯，第一題不算 clean，完成四題後學會；舊持有者工作重播未完整驗證。 |
    53	| T12 | 替身通過：在寫入者讀寫之間插入唯讀頁 `save()`，沒有插入提交。 |
    54	| T13 | 替身通過：只有持有者接受操作；另一頁沒有作答按鈕。 |
    55	| T14 | 部分通過：備份後主 key 寫失敗、恢復重試通過；完整失效復原工作重播未驗證。 |
    56	| T15 | 替身通過：跨篇延後通知不影響數學教學。 |
    57	| T16 | 替身通過：兩篇 DIRTY 經切篇及延後 storage 事件仍保留，恢復後皆保存。 |
    58	| T17 | 部分通過：空白／合法／損壞資料的唯讀零寫入通過；真實雙頁同時冷啟動未驗證。 |
    59	| T18 | **未驗證**：背景暫停、時鐘跳動、返回快取。 |
    60	| T19 | 部分通過：交接 reload 與重讀通過；完整舊工作失效未驗證。 |
    61	| T20 | 替身通過：缺少 Web Locks、request 拒絕皆唯讀。 |
    62	| T21 | **失敗**：暖啟動已修，冷啟動恢復後仍覆蓋原紀錄。 |
    63	| T22 | 部分通過：唯讀 app 不寫入、不初始化同步；其他載入同步模組的頁面未驗證。 |
    64	| T23 | **未驗證**：延遲 GET 與本地操作的完整同步流程。 |
    65	| T24 | **未驗證**：baseline 相等但記憶體 DIRTY 的完整下載流程。 |
    66	| T25 | **未驗證**：選雲端後，本地／雲端再變動。 |
    67	| T26 | **接線失敗**：排隊 reload 未重新檢查 DIRTY；完整安全點替換流程未驗證。 |
    68	| T27 | **未驗證**：雲端套用的備份／主 key／baseline 三處故障。 |
    69	| T28 | **未驗證**：PUT 舊快照回應、停止同步與換碼後的回應。 |
    70	| T29 | **未驗證**：共用 metadata 與跨裝置同 rev 衝突。 |
    71	| T30 | 部分通過：正常切篇、未知 hash、確認題、計分、HTML 跳脫通過；舊 callback 邊界仍有缺口。 |
    72	
    73	`e2e.py:567` 明列本輪回歸只涵蓋 1、2、5、7，且 `flow_codex_r4` 目前只排入 Chromium。其預設入口指向父目錄的 `index.html`，本輪未執行；`sync.js` 未列入明示檔案清單，亦未讀取。上述完整同步及瀏覽器驗收：**此點需擴大讀取範圍，未執行**。iPad Safari 實機未驗證。
    74	
    75	範圍揭露：依較高層記憶指令，本輪另查詢一次 Codex 記憶索引；未讀案件目錄，驗收結論均以本輪原碼及執行結果為據。
    76	

hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc 'nl -ba tests/e2e.py' in /Users/william/Documents/g5-help
 succeeded in 0ms:
     1	#!/opt/homebrew/opt/python@3.12/bin/python3.12
     2	"""五年級難題解說端到端驗收：Chromium（桌機、手機 390）＋WebKit iPad，照孩子會做的順序走完教學與練習。
     3	第 1 篇（數學 28/42）走互動算題格式；通用 steps 格式用測試題（__G5_HARD_FIXTURE__，正式頁不會出現）驗。
     4	
     5	跑法：python3.12 tests/e2e_math.py [--shots DIR] [--base https://windsorya.github.io/g5-sci-review/]
     6	（--base 給正式網址時改測線上版，並加測影片播放器是否真的載入）
     7	答案用 Python fractions 獨立算（不借用頁面裡的 G5Frac），頁面算錯就會對不上。
     8	"""
     9	import json
    10	import sys
    11	from fractions import Fraction
    12	from math import gcd
    13	from pathlib import Path
    14	
    15	from playwright.sync_api import sync_playwright
    16	
    17	ROOT = Path(__file__).resolve().parent.parent
    18	BASE = sys.argv[sys.argv.index("--base") + 1].rstrip("/") + "/" if "--base" in sys.argv else ROOT.as_uri() + "/"
    19	HOME = BASE + "index.html"
    20	URL = HOME + "#h/p38-6-2"
    21	SHOTS = Path(sys.argv[sys.argv.index("--shots") + 1]) if "--shots" in sys.argv else None
    22	RESULTS = []
    23	FIXED = [((24, 36), (35, 50)), ((27, 36), (28, 42)), ((21, 35), (16, 24)),
    24	         ((18, 27), (28, 42)), ((36, 54), (20, 32)), ((45, 63), (32, 40))]
    25	
    26	
    27	def check(name, cond, detail=""):
    28	    RESULTS.append((name, bool(cond), detail))
    29	    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  ← {detail}"))
    30	
    31	
    32	def shot(page, name, full=True):
    33	    if SHOTS:
    34	        SHOTS.mkdir(parents=True, exist_ok=True)
    35	        page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=full)
    36	
    37	
    38	def open_page(browser, device=None, init=None, url=URL, **kw):
    39	    ctx = browser.new_context(**(device or {}), **kw)
    40	    page = ctx.new_page()
    41	    errors = []
    42	    page.on("pageerror", lambda e: errors.append(str(e)))
    43	    if init:
    44	        page.add_init_script(init)
    45	    page.goto(url, wait_until="domcontentloaded")
    46	    try:
    47	        page.wait_for_load_state("load", timeout=15000)
    48	    except Exception:
    49	        pass
    50	    return ctx, page, errors
    51	
    52	
    53	def last_ask(page):
    54	    return page.locator("#lesson .ask").last
    55	
    56	
    57	def chip(page, text):
    58	    last_ask(page).get_by_role("button", name=text, exact=True).click()
    59	
    60	
    61	def fb_text(page):
    62	    return last_ask(page).locator(".fb").inner_text()
    63	
    64	
    65	def fill_nums(page, values):
    66	    ask = last_ask(page)
    67	    for i, v in enumerate(values):
    68	        ask.locator(f'input[data-i="{i}"]').fill(str(v))
    69	    ask.get_by_role("button", name="檢查").click()
    70	
    71	
    72	def no_overflow(page, width):
    73	    sw = page.evaluate("document.documentElement.scrollWidth")
    74	    return sw <= width, sw
    75	
    76	
    77	def store(page):
    78	    db = json.loads(page.evaluate("localStorage.getItem('g5help.v1')") or "null")
    79	    return (db or {}).get("entries", {}).get("p38-6-2")
    80	
    81	
    82	def walk_lesson(page, label, mistakes=True):
    83	    page.get_by_role("button", name="開始學").click()
    84	    # 1 先看分母：直接比分子是錯的方法
    85	    check(f"{label} 第1步列出 45 的倍數到 630（14 個）", page.locator("#lesson .mults span").count() == 14 and
    86	          page.locator("#lesson .mults span.hit").inner_text() == "630")
    87	    if mistakes:
    88	        chip(page, "直接比分子，28 比 27 大")
    89	        check(f"{label} 第1步選「直接比分子」被擋並說明", "分子大的不一定比較大" in fb_text(page), fb_text(page))
    90	    chip(page, "先約分：分子分母一起除以同一個數")
    91	    # 2 約分 28/42：先試 3（錯）→ 2 → 太早說不能再約（錯）→ 7 → 不能再約
    92	    if mistakes:
    93	        chip(page, "一起除以 3")
    94	        check(f"{label} 選 3：用乘法表說明 28 不能被 3 整除", "3 × 9 = 27、3 × 10 = 30，中間沒有 28" in fb_text(page), fb_text(page))
    95	    chip(page, "一起除以 2")
    96	    if mistakes:
    97	        fill_nums(page, [13, 21])
    98	        check(f"{label} 28÷2 填 13 被擋並給提示", "2 × 多少 = 28" in fb_text(page), fb_text(page))
    99	    fill_nums(page, [14, 21])
   100	    if mistakes:
   101	        chip(page, "不能再約了")
   102	        check(f"{label} 14/21 說不能再約被擋（7 的乘法表）", "7 的乘法表" in fb_text(page), fb_text(page))
   103	    chip(page, "一起除以 7")
   104	    fill_nums(page, [2, 3])
   105	    chip(page, "不能再約了")
   106	    s2 = page.locator('#lesson section[data-step="2"]').inner_text()
   107	    check(f"{label} 第2步出現 28/42 = 14/21 = 2/3 與「一次除以 14」", "也可以一次除以 14" in s2 and "2 × 7" in s2, s2[-300:])
   108	    check(f"{label} 第2步長條圖：42 格、粗線 2 條、3 大塊塗 2 塊",
   109	          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("rect").count() == 43 and
   110	          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("line").count() == 2 and
   111	          page.locator('#lesson section[data-step="2"] svg.fbar').nth(1).locator("rect").count() == 4)
   112	    # 3 約分 27/45：一次除以 9
   113	    chip(page, "一起除以 9")
   114	    fill_nums(page, [3, 5])
   115	    chip(page, "不能再約了")
   116	    # 4 通分：先填 30（公倍數但不是最小）
   117	    if mistakes:
   118	        fill_nums(page, [30])
   119	        check(f"{label} 最小公倍數填 30：說是公倍數但還有更小的", "還有更小的" in fb_text(page), fb_text(page))
   120	    fill_nums(page, [15])
   121	    fill_nums(page, [5])
   122	    fill_nums(page, [10])
   123	    fill_nums(page, [3])
   124	    fill_nums(page, [9])
   125	    s4 = page.locator('#lesson section[data-step="4"]').inner_text()
   126	    check(f"{label} 第4步得到 10/15 與 9/15", "10\n15" in s4 and "9\n15" in s4, s4[-200:])
   127	    # 5 比大小
   128	    if mistakes:
   129	        chip(page, "<")
   130	        check(f"{label} 10/15 ○ 9/15 選 < 被擋", "哪個多" in fb_text(page), fb_text(page))
   131	    chip(page, ">")
   132	    chip(page, ">")
   133	    check(f"{label} 題目的□填上 >", page.locator("#box").inner_text().strip() == ">")
   134	    # 6 寫進習作
   135	    if mistakes:
   136	        chip(page, "先通分，再約分")
   137	        check(f"{label} 順序選錯被擋（提到 630）", "630" in fb_text(page), fb_text(page))
   138	    chip(page, "先約分，再通分")
   139	    check(f"{label} 教學完成：出現「換你自己做一題」、存檔 lessonDone", page.locator("#toPractice").is_visible() and (store(page) or {}).get("lessonDone") is True)
   140	
   141	
   142	def answers(a, b):
   143	    sa, sb = Fraction(*a), Fraction(*b)
   144	    L = sa.denominator * sb.denominator // gcd(sa.denominator, sb.denominator)
   145	    sign = ">" if sa > sb else "<" if sa < sb else "="
   146	    return (sa.numerator, sa.denominator), (sb.numerator, sb.denominator), (sa.numerator * L // sa.denominator, L), (sb.numerator * L // sb.denominator, L), sign
   147	
   148	
   149	def solve_practice(page, a, b, hint=False, slip=False):
   150	    P = page.locator("#practice")
   151	    sa, sb, ea, eb, sign = answers(a, b)
   152	    r1 = P.locator("#r1")
   153	    if hint:
   154	        r1.get_by_role("button", name="給我提示").click()
   155	    if slip:   # half＝左邊只約一半（大小對、還能再約）；unequal＝分子分母除以不同的數
   156	        k = gcd(*a)
   157	        p = min(q for q in range(2, k + 1) if k % q == 0)
   158	        wrong = (a[0] // p, a[1] // p) if slip == "half" else (a[0] // k, a[1] // 5)   # unequal 只用在 21/35：分子 ÷7、分母 ÷5
   159	        assert wrong != sa, "測試資料要真的是錯的"
   160	        r1.locator('input[data-k="a.n"]').fill(str(wrong[0]))
   161	        r1.locator('input[data-k="a.d"]').fill(str(wrong[1]))
   162	        r1.locator('input[data-k="b.n"]').fill(str(sb[0]))
   163	        r1.locator('input[data-k="b.d"]').fill(str(sb[1]))
   164	        r1.get_by_role("button", name="檢查").click()
   165	        msg = r1.locator(".fb").inner_text()
   166	        want = "還能一起除以" if slip == "half" else "分母卻除以了"
   167	        check(f"練習 {a}：{slip} 錯法被抓「{want}」，且只講左邊", want in msg and msg.startswith("左邊：") and "右邊" not in msg, msg)
   168	    for k, v in (("a.n", sa[0]), ("a.d", sa[1]), ("b.n", sb[0]), ("b.d", sb[1])):
   169	        r1.locator(f'input[data-k="{k}"]').fill(str(v))
   170	    r1.get_by_role("button", name="檢查").click()
   171	    r2 = P.locator("#r2")
   172	    r2.wait_for(state="visible")
   173	    for k, v in (("c.n", ea[0]), ("c.d", ea[1]), ("e.n", eb[0]), ("e.d", eb[1])):
   174	        r2.locator(f'input[data-k="{k}"]').fill(str(v))
   175	    r2.get_by_role("button", name="檢查").click()
   176	    r3 = P.locator("#r3")
   177	    r3.wait_for(state="visible")
   178	    r3.locator(f'button[data-s="{sign}"]').click()
   179	    return sign
   180	
   181	
   182	def flow_full(browser, label, device=None, width=None, shots=False):
   183	    ctx, page, errors = open_page(browser, device)
   184	    if shots:
   185	        shot(page, f"{label}-0-開頭", full=False)
   186	    walk_lesson(page, label, mistakes=True)
   187	    if shots:
   188	        shot(page, f"{label}-1-教學全程")
   189	    page.locator("#toPractice").click()
   190	    # 練習 6 題固定題：第 3 題分子分母除不同數、第 5 題看提示、第 6 題只約一半（都斷連續），其餘一次做對
   191	    for i, (a, b) in enumerate(FIXED):
   192	        shown = page.locator("#practice .prob").inner_text().split()
   193	        check(f"{label} 練習第 {i + 1} 題是 {a[0]}/{a[1]} 和 {b[0]}/{b[1]}", shown[:2] == [str(a[0]), str(a[1])] and shown[-2:] == [str(b[0]), str(b[1])], shown)
   194	        sign = solve_practice(page, a, b, hint=(i == 4), slip={2: "unequal", 5: "half"}.get(i))
   195	        check(f"{label} 練習第 {i + 1} 題□顯示 {sign}", page.locator("#pbox").inner_text().strip() == {">": ">", "<": "<", "=": "="}[sign])
   196	        st = store(page)
   197	        if i == 2:
   198	            check(f"{label} 第 3 題改過答案⇒連續歸零", st["streak"] == 0 and "下一題試試不看提示" in page.locator("#pend").inner_text(), st)
   199	        if i == 4:
   200	            check(f"{label} 第 5 題看了提示⇒連續歸零", st["streak"] == 0, st)
   201	        if i == 5:
   202	            check(f"{label} 第 6 題只約一半⇒連續歸零、還沒學會", st["streak"] == 0 and not st["mastered"], st)
   203	        if shots and i == 0:
   204	            shot(page, f"{label}-2-練習第1題完成")
   205	        page.locator("#nextQ").click()
   206	    # 第 7–9 題是亂數題：照 Python 算的答案一次做對 ⇒ 連續 3 題 ⇒ 學會
   207	    for i in range(6, 9):
   208	        t = page.locator("#practice .prob").inner_text().split()
   209	        a, b = (int(t[0]), int(t[1])), (int(t[-2]), int(t[-1]))
   210	        sa, sb, *_ = answers(a, b)
   211	        check(f"{label} 亂數第 {i + 1} 題 {a}{b} 兩邊都能約分", sa != a and sb != b)
   212	        solve_practice(page, a, b)
   213	        if i < 8:
   214	            page.locator("#nextQ").click()
   215	    st = store(page)
   216	    check(f"{label} 連續 3 題自己做對 ⇒ 顯示「這種題你會了」、存 mastered", st["mastered"] and st["streak"] == 3 and "這種題你會了" in page.locator("#pend").inner_text(), st)
   217	    check(f"{label} 紀錄 9 題、log 9 筆", st["solved"] == 9 and len(st["log"]) == 9, st)
   218	    if shots:
   219	        shot(page, f"{label}-3-學會了")
   220	    if width:
   221	        ok, sw = no_overflow(page, width)
   222	        check(f"{label} 寬 {width} 沒有左右捲動", ok, sw)
   223	    # 重新整理：接著第 10 題、首頁按鈕改成繼續練習
   224	    page.reload(wait_until="domcontentloaded")
   225	    check(f"{label} 重新整理後顯示「繼續練習（第 10 題）」與已學會", page.get_by_role("button", name="繼續練習（第 10 題）").is_visible() and page.locator("#mastery").is_visible())
   226	    check(f"{label} 沒有 JS 錯誤", not errors, errors)
   227	    ctx.close()
   228	
   229	
   230	def prob_text(page):
   231	    t = page.locator("#practice .prob").inner_text().split()
   232	    return (int(t[0]), int(t[1])), (int(t[-2]), int(t[-1]))
   233	
   234	
   235	def flow_codex_r1(browser):
   236	    """Codex 2026-10-12 第 1 輪五個必修，照它的重現步驟逐一打；拆三段、各開新頁，舊版在任一段卡住也不影響其他段。"""
   237	    for part in (codex_r1_lesson, codex_r1_inputs, codex_r1_reopen):
   238	        try:
   239	            part(browser)
   240	        except Exception as e:
   241	            check(f"{part.__name__} 跑完沒有卡住", False, str(e).splitlines()[0])
   242	
   243	
   244	def codex_r1_lesson(browser):
   245	    # 必修 4＋5：教學第 4 步最小公倍數填 0、填全形 １５
   246	    ctx, page, errors = open_page(browser)
   247	    page.get_by_role("button", name="開始學").click()
   248	    chip(page, "先約分：分子分母一起除以同一個數")
   249	    chip(page, "一起除以 2"); fill_nums(page, [14, 21])
   250	    chip(page, "一起除以 7"); fill_nums(page, [2, 3]); chip(page, "不能再約了")
   251	    chip(page, "一起除以 9"); fill_nums(page, [3, 5]); chip(page, "不能再約了")
   252	    fill_nums(page, [0])
   253	    check("必修4 最小公倍數填 0：說要找比 0 大的公倍數，不說「還有更小的」", "比 0 大" in fb_text(page) and "更小" not in fb_text(page), fb_text(page))
   254	    fill_nums(page, ["１５"])
   255	    check("必修5 最小公倍數填全形１５：判對、進到下一格", "分母 3 要乘多少" in last_ask(page).inner_text(), last_ask(page).inner_text()[:80])
   256	    check("必修4/5 教學段沒有 JS 錯誤", not errors, errors)
   257	    ctx.close()
   258	
   259	
   260	def codex_r1_inputs(browser):
   261	    # 必修 3＋5：練習填 0、空白、3.、全形數字
   262	    ctx, page, errors = open_page(browser)
   263	    page.get_by_role("button", name="我已經會了，直接練習").click()
   264	    r1 = page.locator("#practice #r1")
   265	    (a, b) = FIXED[0]
   266	    sa, sb, *_ = answers(a, b)
   267	    for k, v in (("a.n", 0), ("a.d", 3), ("b.n", sb[0]), ("b.d", sb[1])):
   268	        r1.locator(f'input[data-k="{k}"]').fill(str(v))
   269	    r1.get_by_role("button", name="檢查").click()
   270	    msg = r1.locator(".fb").inner_text()
   271	    check("必修3 填 0/3：說分子是 0、算一次答錯", "分子是 0" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
   272	    r1.locator('input[data-k="a.n"]').fill("")
   273	    r1.get_by_role("button", name="檢查").click()
   274	    msg = r1.locator(".fb").inner_text()
   275	    check("必修3 有格子空白：說還有格子沒填、不算答錯", "還有格子沒填" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
   276	    r1.locator('input[data-k="a.n"]').fill("3.")
   277	    r1.get_by_role("button", name="檢查").click()
   278	    msg = r1.locator(".fb").inner_text()
   279	    check("必修3 填 3.：說只能填整數、不算答錯", "只能填整數" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
   280	    full = lambda n: str(n).translate(str.maketrans("0123456789", "０１２３４５６７８９"))
   281	    for k, v in (("a.n", sa[0]), ("a.d", sa[1]), ("b.n", sb[0]), ("b.d", sb[1])):
   282	        r1.locator(f'input[data-k="{k}"]').fill(full(v))
   283	    r1.get_by_role("button", name="檢查").click()
   284	    check("必修5 練習填全形數字也判對", page.locator("#practice #r2").is_visible(), r1.locator(".fb").inner_text())
   285	    check("必修3/5 練習段沒有 JS 錯誤", not errors, errors)
   286	    ctx.close()
   287	
   288	
   289	def codex_r1_reopen(browser):
   290	    # 必修 1＋2：做完不按下一題、改按上方按鈕重開；看提示＋答錯後重開
   291	    ctx, page, errors = open_page(browser)
   292	    direct = lambda: page.get_by_role("button", name="我已經會了，直接練習").click()
   293	    direct()
   294	    solve_practice(page, *FIXED[0])
   295	    direct()
   296	    check("必修1 重開練習換成第 2 題，不是重做第 1 題", prob_text(page) == FIXED[1], prob_text(page))
   297	    for _ in range(2):   # Codex 的重現：重開後再把畫面上那題做完，連做兩次
   298	        direct()
   299	        a, b = prob_text(page)
   300	        if (a, b) == FIXED[0]:
   301	            solve_practice(page, a, b)
   302	    st = store(page)
   303	    check("必修1 重開兩次：第 1 題只算一次、沒有因重複計分而學會", sum(1 for x in st["log"] if x["a"] == "24/36") == 1 and not st["mastered"], st["log"])
   304	    r1 = page.locator("#practice #r1")
   305	    r1.get_by_role("button", name="給我提示").click()
   306	    for k, v in (("a.n", 1), ("a.d", 3), ("b.n", 2), ("b.d", 3)):
   307	        r1.locator(f'input[data-k="{k}"]').fill(str(v))
   308	    r1.get_by_role("button", name="檢查").click()
   309	    direct()
   310	    st = store(page)
   311	    check("必修2 重開後仍是第 2 題，且提示 1 次、答錯 1 次都還在", prob_text(page) == FIXED[1] and st.get("cur") == {"idx": 1, "hints": 1, "wrongs": 1}, st.get("cur"))
   312	    solve_practice(page, *prob_text(page))
   313	    st = store(page)
   314	    check("必修2 這題記成「不是自己一次做對」、連續歸零", st["log"][-1]["clean"] is False and st["log"][-1]["hints"] == 1 and st["streak"] == 0, st["log"][-1])
   315	    check("必修1/2 重開段沒有 JS 錯誤", not errors, errors)
   316	    ctx.close()
   317	
   318	
   319	def flow_storage_blocked(browser):
   320	    init = "Storage.prototype.setItem=function(){throw new Error('quota')};"
   321	    ctx, page, errors = open_page(browser, init=init)
   322	    page.get_by_role("button", name="我已經會了，直接練習").click()
   323	    a, b = FIXED[0]
   324	    solve_practice(page, a, b)
   325	    check("存不了紀錄：題目照常做完並提示", "存不了紀錄" in page.locator("#pend").inner_text())
   326	    check("存不了紀錄：沒有 JS 錯誤", not errors, errors)
   327	    ctx.close()
   328	
   329	
   330	def flow_corrupt_store(browser):
   331	    init = "localStorage.setItem('g5help.v1','{not json');"
   332	    ctx, page, errors = open_page(browser, init=init)
   333	    check("壞存檔：照常顯示「開始學」", page.get_by_role("button", name="開始學").is_visible())
   334	    init2 = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{idx:-5,streak:'x',lessonDone:'yes',log:5}}}));"
   335	    ctx2, page2, errors2 = open_page(browser, init=init2)
   336	    st = page2.evaluate("G5HelpPage.state('p38-6-2')")
   337	    check("欄位型別錯：idx 回 0、lessonDone 回 false、log 回空陣列", st["idx"] == 0 and st["lessonDone"] is False and st["log"] == [], st)
   338	    check("壞存檔：沒有 JS 錯誤", not errors and not errors2, errors + errors2)
   339	    ctx.close(); ctx2.close()
   340	
   341	
   342	GUOYU = {"id": "t-guoyu", "date": "2026-10-13", "subject": "國語", "kind": "steps", "source": "測試卷第 1 題", "title": "測試：成語填空",
   343	         "question": "「一（　）不苟」的空格要填什麼字？",
   344	         "steps": [{"title": "先想意思", "say": "這個成語是說做事很仔細。",
   345	                    "check": {"q": "做事很仔細，是指哪一種人？", "opts": ["馬虎的人", "認真的人"], "a": 1, "why": ["馬虎是不仔細喔。", ""], "ok": "對！"}},
   346	                   {"title": "再想字", "say": "仔細到連一根頭髮都不放過。"}],
   347	         "answer": "絲", "practice": [{"q": "一絲不（　）", "opts": ["狗", "苟"], "a": 1, "why": ["狗是動物。", ""]},
   348	                                      {"q": "「一絲不苟」的意思是？", "opts": ["很仔細", "很隨便"], "a": 0, "why": ["", "相反喔。"]},
   349	                                      {"q": "誰最一絲不苟？", "opts": ["每一題都檢查兩次的人", "寫完就交卷的人"], "a": 0, "why": ["", "沒檢查喔。"]}]}
   350	FIXTURE = "window.__G5_HARD_FIXTURE__ = " + json.dumps([GUOYU], ensure_ascii=False) + ";"
   351	
   352	
   353	def flow_home(browser):
   354	    """首頁依科目列出；沒有題目的科目寫「還沒有題目」；點進去、回列表、狀態會跟著變。"""
   355	    ctx, page, errors = open_page(browser, url=HOME)
   356	    subj = page.locator("#subjects .subj")
   357	    check("首頁列出國語、數學、自然、社會、英文、其他六科", [subj.nth(i).get_attribute("data-subj") for i in range(subj.count())] == ["國語", "數學", "自然", "社會", "英文", "其他"])
   358	    math = page.locator('.subj[data-subj="數學"] .hcard')
   359	    check("數學有第 1 篇（28/42），狀態還沒看", math.count() == 1 and "28/42 和 27/45 比大小" in math.inner_text() and "還沒看" in math.inner_text(), math.inner_text())
   360	    check("國語目前寫「還沒有題目」", "還沒有題目" in page.locator('.subj[data-subj="國語"]').inner_text())
   361	    math.click()
   362	    page.wait_for_selector("#entry:not([hidden])")
   363	    check("點進去網址變成 #h/p38-6-2、標題是那一篇", page.url.endswith("#h/p38-6-2") and "28/42" in page.title(), page.url)
   364	    page.get_by_role("button", name="我已經會了，直接練習").click()
   365	    solve_practice(page, *FIXED[0])
   366	    page.locator("#backHome").click()
   367	    page.wait_for_selector("#home:not([hidden])")
   368	    check("回列表後狀態變成「練習中」", "練習中" in page.locator('.subj[data-subj="數學"] .hcard').inner_text())
   369	    check("首頁沒有 JS 錯誤", not errors, errors)
   370	    ctx.close()
   371	
   372	
   373	def flow_migrate(browser):
   374	    """昨天在自然複習網站練的紀錄（g5math.v1）搬進第 1 篇；舊資料原文不動。"""
   375	    old = {"v": 1, "lessonDone": True, "idx": 2, "seed": 7, "streak": 2, "clean": 2, "solved": 2, "mastered": False, "log": [], "cur": None}
   376	    init = "if(!localStorage.getItem('g5help.v1'))localStorage.setItem('g5math.v1'," + json.dumps(json.dumps(old)) + ");"
   377	    ctx, page, errors = open_page(browser, init=init)
   378	    st = page.evaluate("G5HelpPage.state('p38-6-2')")
   379	    check("舊紀錄搬進第 1 篇：做完 2 題、連續 2 題、教學看完", st["solved"] == 2 and st["streak"] == 2 and st["lessonDone"] is True, st)
   380	    check("頂部按鈕接著練第 3 題", page.get_by_role("button", name="繼續練習（第 3 題）").is_visible())
   381	    check("舊的 g5math.v1 原文沒被改", json.loads(page.evaluate("localStorage.getItem('g5math.v1')")) == old)
   382	    check("搬家沒有 JS 錯誤", not errors, errors)
   383	    ctx.close()
   384	
   385	
   386	def flow_steps(browser, label, device=None, shots=False):
   387	    """通用 steps 格式（任何科目）：確認題答錯說原因、答對才往下、沒確認題按「我懂了」、答案、同型練習到學會。"""
   388	    ctx, page, errors = open_page(browser, device, init=FIXTURE, url=HOME)
   389	    card = page.locator('.subj[data-subj="國語"] .hcard')
   390	    check(f"{label} 國語出現測試題", card.count() == 1 and "測試：成語填空" in card.inner_text())
   391	    card.click()
   392	    page.wait_for_selector("#entry:not([hidden])")
   393	    check(f"{label} 題目顯示在上方", "一（　）不苟" in page.locator("#prob").inner_text())
   394	    page.get_by_role("button", name="開始學").click()
   395	    chip(page, "馬虎的人")
   396	    check(f"{label} 確認題選錯：顯示原因、不往下", "馬虎是不仔細" in fb_text(page) and page.locator("#lesson .lstep").count() == 1, fb_text(page))
   397	    chip(page, "認真的人")
   398	    page.locator("#lesson button[data-next]").click()
   399	    check(f"{label} 走完步驟後出現答案「絲」", "絲" in page.locator('#lesson section[data-step="3"]').inner_text())
   400	    page.locator("#toPractice").click()
   401	    P = page.locator("#practice")
   402	    P.locator('.chip[data-k="0"]').click()
   403	    check(f"{label} 練習選錯顯示原因", "狗是動物" in P.locator(".fb").first.inner_text())
   404	    P.locator('.chip[data-k="1"]').click()
   405	    st = lambda: page.evaluate("G5HelpPage.state('t-guoyu')")
   406	    check(f"{label} 第 1 題改過答案⇒連續 0", st()["streak"] == 0 and st()["solved"] == 1, st())
   407	    for k in (0, 0, 1):   # 第 2、3 題選對，第 4 題（回到第 1 題）選對 ⇒ 連續 3
   408	        page.locator("#nextQ").click()
   409	        page.locator(f'#practice .chip[data-k="{k}"]').click()
   410	    check(f"{label} 連續 3 題第一次就選對 ⇒ 學會", st()["mastered"] and st()["streak"] == 3 and "這種題你會了" in page.locator("#pend").inner_text(), st())
   411	    if shots:
   412	        shot(page, f"{label}-steps")
   413	    page.locator("#backHome").click()
   414	    check(f"{label} 回列表後國語那篇顯示學會了", "學會了" in page.locator('.subj[data-subj="國語"] .hcard').inner_text())
   415	    check(f"{label} steps 格式沒有 JS 錯誤", not errors, errors)
   416	    ctx.close()
   417	
   418	
   419	def flow_dark(browser):
   420	    ctx, page, errors = open_page(browser, {"viewport": {"width": 390, "height": 844}}, color_scheme="dark")
   421	    bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
   422	    check("深色模式背景是深色", bg in ("rgb(15, 26, 36)",), bg)
   423	    page.get_by_role("button", name="開始學").click()
   424	    chip(page, "先約分：分子分母一起除以同一個數")
   425	    chip(page, "一起除以 2")
   426	    fill_nums(page, [14, 21])
   427	    if SHOTS:
   428	        shot(page, "dark-390-教學")
   429	    ctx.close()
   430	
   431	
   432	def flow_video_live(browser, label, device=None):
   433	    """只在線上版跑：按播放後 iframe 真的指向 youtube-nocookie、帶 referrerpolicy，播放器沒有出現錯誤 153。"""
   434	    ctx, page, errors = open_page(browser, device)
   435	    page.locator("#vidBox summary").click()
   436	    btns = page.locator("#vids button[data-v]")
   437	    check(f"{label} 影片區有 2 段", btns.count() == 2, btns.count())
   438	    for i in range(btns.count()):
   439	        btns.nth(i).click()
   440	        fr = page.locator("#vids iframe").nth(i)
   441	        src, rp = fr.get_attribute("src"), fr.get_attribute("referrerpolicy")
   442	        check(f"{label} 影片 {i + 1} iframe 指向 youtube-nocookie 並帶 referrerpolicy", "youtube-nocookie.com/embed/" in src and rp == "strict-origin-when-cross-origin", src)
   443	        page.wait_for_timeout(6000)
   444	        frame = page.frame_locator("#vids iframe").nth(i)
   445	        try:
   446	            body = frame.locator("body").inner_text(timeout=10000)
   447	        except Exception as e:
   448	            body = f"<讀不到：{e}>"
   449	        check(f"{label} 影片 {i + 1} 播放器沒有錯誤訊息", "153" not in body and "無法播放" not in body and "Error" not in body, body[:200])
   450	    if SHOTS:
   451	        shot(page, f"{label}-影片", full=False)
   452	    ctx.close()
   453	
   454	
   455	def flow_codex_help_r1(browser):
   456	    """Codex 2026-10-13 審難題站第 1 輪：必修 1–6、建議 7，照它的重現步驟。"""
   457	    # 必修 2：新 key 壞掉、舊 g5math.v1 完整 ⇒ 仍搬入舊紀錄，壞掉的原文另存
   458	    old = {"v": 1, "lessonDone": True, "idx": 2, "seed": 7, "streak": 2, "clean": 2, "solved": 2, "mastered": False, "log": [], "cur": None}
   459	    init = "if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('g5help.v1','{bad');localStorage.setItem('g5math.v1'," + json.dumps(json.dumps(old)) + ");}"
   460	    ctx, page, errors = open_page(browser, init=init)
   461	    st = page.evaluate("G5HelpPage.state('p38-6-2')")
   462	    keys = page.evaluate("Object.keys(localStorage)")
   463	    check("必修2 新紀錄壞掉時仍搬入舊紀錄（做完 2 題）；讀取時不動原文（第 4 輪必修 3）", st and st["solved"] == 2 and page.evaluate("localStorage.getItem('g5help.v1')") == "{bad", (st, keys))
   464	    page.get_by_role("button", name="繼續練習（第 3 題）").click()
   465	    solve_practice(page, *FIXED[2])
   466	    keys = page.evaluate("Object.keys(localStorage)")
   467	    bk = [k for k in keys if k.startswith("g5help.v1.broken.")]
   468	    check("必修2 第一次存檔才備份壞原文（備份內容＝原文），主 key 換成新紀錄、做完 3 題",
   469	          len(bk) == 1 and page.evaluate(f"localStorage.getItem('{bk[0]}')") == "{bad" and store(page)["solved"] == 3, (bk, store(page)))
   470	    ctx.close()
   471	    # 必修 3：左小右大的分數題，答對時講對方向
   472	    lt = {"id": "t-frac-lt", "date": "2026-10-13", "subject": "數學", "kind": "frac-compare", "source": "測試", "title": "測試：左小右大",
   473	          "a": {"n": 27, "d": 45}, "b": {"n": 28, "d": 42}}
   474	    ctx, page, errors = open_page(browser, init="window.__G5_HARD_FIXTURE__ = " + json.dumps([lt]) + ";", url=HOME + "#h/t-frac-lt")
   475	    page.get_by_role("button", name="開始學").click()
   476	    chip(page, "先約分：分子分母一起除以同一個數")
   477	    chip(page, "一起除以 9"); fill_nums(page, [3, 5]); chip(page, "不能再約了")
   478	    chip(page, "一起除以 2"); fill_nums(page, [14, 21]); chip(page, "一起除以 7"); fill_nums(page, [2, 3]); chip(page, "不能再約了")
   479	    fill_nums(page, [15]); fill_nums(page, [3]); fill_nums(page, [9]); fill_nums(page, [5]); fill_nums(page, [10])
   480	    chip(page, "<")
   481	    asks = page.locator("#lesson .ask")
   482	    msg = asks.nth(asks.count() - 2).locator(".fb").inner_text()   # 答對後下一題（所以 27/45 ○ 28/42）會馬上接在後面
   483	    check("必修3 9/15 ○ 10/15 選 < 時說「9 比 10 小，所以 10/15 比較大」", "9 比 10 小，所以 10/15 比較大" in msg, msg)
   484	    check("必修3 沒有 JS 錯誤", not errors, errors)
   485	    ctx.close()
   486	    # 必修 4：只有 1 題練習時，家長紀錄寫「連續 1 題」
   487	    one = dict(GUOYU, id="t-one", practice=GUOYU["practice"][:1])
   488	    ctx, page, errors = open_page(browser, init="window.__G5_HARD_FIXTURE__ = " + json.dumps([one], ensure_ascii=False) + ";", url=HOME + "#h/t-one")
   489	    page.get_by_role("button", name="我已經會了，直接練習").click()
   490	    page.locator('#practice .chip[data-k="1"]').click()
   491	    check("必修4 一題練習全對：家長紀錄寫連續 1 題、不寫 3 題", "連續 1 題自己做對" in page.locator("#rec").text_content() and "連續 3 題" not in page.locator("#rec").text_content(), page.locator("#rec").text_content())
   492	    ctx.close()
   493	    # 必修 6：超大題號當壞資料，不能同一題重複算到學會
   494	    big = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'t-guoyu':{idx:9007199254740992,solved:0,streak:0}}}));"
   495	    ctx, page, errors = open_page(browser, init=FIXTURE + "if(!sessionStorage.getItem('y')){sessionStorage.setItem('y','1');" + big + "}", url=HOME + "#h/t-guoyu")
   496	    check("必修6 超大題號讀進來變回 0", page.evaluate("G5HelpPage.state('t-guoyu')")["idx"] == 0)
   497	    ctx.close()
   498	    # 建議 7：播影片後回首頁，影片要關掉
   499	    ctx, page, errors = open_page(browser)
   500	    page.locator("#vidBox summary").click()
   501	    page.locator("#vids button[data-v]").first.click()
   502	    page.locator("#backHome").click()
   503	    check("建議7 回首頁後影片 iframe 已移除", page.locator("iframe").count() == 0)
   504	    ctx.close()
   505	
   506	
   507	def flow_codex_help_r2(browser):
   508	    """Codex 2026-10-13 審難題站第 2 輪必修 1–4。"""
   509	    # 必修 1：大於 10 萬的合法 seed 要保留，重新整理後還是同一題
   510	    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{idx:6,seed:700000,cur:{idx:6,hints:1,wrongs:1}}}}));"
   511	    ctx, page, errors = open_page(browser, init="if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');" + seed + "}")
   512	    st = page.evaluate("G5HelpPage.state('p38-6-2')")
   513	    check("r2必修1 seed 700000 保留、提示答錯紀錄仍對應第 7 題", st["seed"] == 700000 and st["cur"] == {"idx": 6, "hints": 1, "wrongs": 1}, st)
   514	    ctx.close()
   515	    # 必修 2：壞資料備份不了時，原文留在原地、存檔回報失敗
   516	    init = ("if(!sessionStorage.getItem('b')){sessionStorage.setItem('b','1');localStorage.setItem('g5help.v1','{bad');}"
   517	            "var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).indexOf('g5help.v1.broken.')===0)throw new Error('quota');return _s.call(this,k,v);};")
   518	    ctx, page, errors = open_page(browser, init=init)
   519	    page.get_by_role("button", name="我已經會了，直接練習").click()
   520	    solve_practice(page, *FIXED[0])
   521	    raw = page.evaluate("localStorage.getItem('g5help.v1')")
   522	    check("r2必修2 備份失敗：壞掉的原文還在、畫面說存不了紀錄", raw == "{bad" and "存不了紀錄" in page.locator("#pend").inner_text(), raw)
   523	    ctx.close()
   524	    # 必修 3：一直存不進去時，切篇再切回，記憶體裡的進度不能歸零
   525	    ctx, page, errors = open_page(browser, init=FIXTURE + "Storage.prototype.setItem=function(){throw new Error('quota')};")
   526	    page.get_by_role("button", name="我已經會了，直接練習").click()
   527	    solve_practice(page, *FIXED[0])
   528	    page.goto(HOME + "#h/t-guoyu"); page.wait_for_selector("#entry:not([hidden])")
   529	    page.get_by_role("button", name="我已經會了，直接練習").click()
   530	    page.locator('#practice .chip[data-k="1"]').click()
   531	    page.goto(HOME + "#h/p38-6-2"); page.wait_for_selector("#entry:not([hidden])")
   532	    check("r2必修3 存不進去時切篇再切回，數學仍是做完 1 題", page.evaluate("G5HelpPage.state('p38-6-2')")["solved"] == 1, page.evaluate("G5HelpPage.state('p38-6-2')"))
   533	    ctx.close()
   534	
   535	
   536	def flow_single_writer(browser, label):
   537	    """Codex 設計者方案 B（docs/storage-design-B-20261013.md T01/T11/T13/T17/T19/T20/T22）：
   538	    同一時間只有一個分頁能練習與寫入；第二個分頁唯讀；第一個關掉後第二個自動接手並讀到最新紀錄。"""
   539	    ctx = browser.new_context(); ctx.add_init_script(FIXTURE)
   540	    a = ctx.new_page(); a.goto(URL); a.wait_for_selector("#entry:not([hidden])")
   541	    a.wait_for_function("window.G5HelpWriter && window.G5HelpWriter()")
   542	    b = ctx.new_page(); b.goto(HOME + "#h/t-guoyu"); b.wait_for_selector("#entry:not([hidden])"); b.wait_for_timeout(500)
   543	    check(f"{label} T17 兩個分頁：恰好一個可寫（A 可寫、B 唯讀）", a.evaluate("G5HelpWriter()") is True and b.evaluate("G5HelpWriter()") is False)
   544	    check(f"{label} T13 唯讀分頁沒有作答按鈕、顯示「另一個分頁開著」", b.locator("#topBtns button").count() == 0 and "另一個分頁" in b.locator("#topBtns").inner_text())
   545	    before = b.evaluate("localStorage.getItem('g5help.v1')")
   546	    a.get_by_role("button", name="我已經會了，直接練習").click()
   547	    solve_practice(a, *FIXED[0])
   548	    check(f"{label} T01 A 做完一題有存檔", json.loads(a.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p38-6-2"]["solved"] == 1)
   549	    check(f"{label} T22 唯讀分頁 B 沒有寫入任何東西", b.evaluate("G5HelpWriter()") is False and before != a.evaluate("localStorage.getItem('g5help.v1')"))
   550	    a.close()
   551	    b.wait_for_function("window.G5HelpWriter && window.G5HelpWriter()", timeout=10000)
   552	    b.wait_for_selector("#entry:not([hidden])")
   553	    check(f"{label} T19 A 關掉後 B 自動接手變成可寫", b.evaluate("G5HelpWriter()") is True)
   554	    b.get_by_role("button", name="我已經會了，直接練習").click()
   555	    b.locator('#practice .chip[data-k="1"]').click()
   556	    db = json.loads(b.evaluate("localStorage.getItem('g5help.v1')"))["entries"]
   557	    check(f"{label} T01 接手後兩篇紀錄都在（數學 1、國語 1）", db["p38-6-2"]["solved"] == 1 and db["t-guoyu"]["solved"] == 1, {k: v["solved"] for k, v in db.items()})
   558	    ctx.close()
   559	    # T20：沒有 Web Locks 的舊瀏覽器 ⇒ 唯讀並說明，不退回無鎖寫入
   560	    ctx2, pg, errors = open_page(browser, init="delete Navigator.prototype.locks; Object.defineProperty(navigator,'locks',{value:undefined});")
   561	    check(f"{label} T20 沒有 Web Locks：唯讀並說明瀏覽器太舊", pg.evaluate("G5HelpWriter()") is False and "太舊" in pg.locator("#topBtns").inner_text())
   562	    check(f"{label} T20 沒有 JS 錯誤", not errors, errors)
   563	    ctx2.close()
   564	
   565	
   566	def flow_codex_r4(browser):
   567	    """Codex 2026-10-13 第 4 輪（設計後首輪）必修 1、2、5 與建議 7。"""
   568	    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,r:1},'t-guoyu':{solved:5,idx:5,r:1}}}));"
   569	    # 必修 1（T21）：讀取突然失敗時存檔，不能把另一篇洗掉
   570	    ctx, pg, errors = open_page(browser, init=FIXTURE + "if(!sessionStorage.getItem('a')){sessionStorage.setItem('a','1');" + seed + "}", url=HOME + "#h/t-guoyu")
   571	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   572	    pg.evaluate("(function(){var g=window.__origGet=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(k==='g5help.v1')throw new Error('io');return g.call(this,k);};})(); 0")
   573	    pg.get_by_role("button", name="我已經會了，直接練習").click()
   574	    pg.locator('#practice .chip[data-k="1"]').click()
   575	    raw = pg.evaluate("(function(){Storage.prototype.getItem=window.__origGet;return localStorage.getItem('g5help.v1');})()")
   576	    db = json.loads(raw)["entries"]
   577	    check("r4必修1 讀取失敗時不寫入：數學仍 8 題、國語仍 5 題（進度留在記憶體）", db["p38-6-2"]["solved"] == 8 and db["t-guoyu"]["solved"] == 5 and pg.evaluate("G5HelpDirty()") == 1, {k: v["solved"] for k, v in db.items()})
   578	    ctx.close()
   579	    # 必修 2（T16）：壞資料備份失敗後，空間恢復要能重試存進去
   580	    init = ("if(!sessionStorage.getItem('b')){sessionStorage.setItem('b','1');localStorage.setItem('g5help.v1','{bad');}"
   581	            "window.__fail=true;var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__fail&&String(k).indexOf('g5help.v1.broken.')===0)throw new Error('quota');return _s.call(this,k,v);};")
   582	    ctx, pg, errors = open_page(browser, init=init)
   583	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   584	    pg.get_by_role("button", name="我已經會了，直接練習").click()
   585	    solve_practice(pg, *FIXED[0])
   586	    check("r4必修2 備份失敗：原文不動、進度標成未存", pg.evaluate("localStorage.getItem('g5help.v1')") == "{bad" and pg.evaluate("G5HelpDirty()") == 1)
   587	    pg.evaluate("window.__fail=false; 0")
   588	    pg.locator("#nextQ").click(); solve_practice(pg, *FIXED[1])
   589	    check("r4必修2 空間恢復後重試成功：兩題都存進去、未存歸零", store(pg)["solved"] == 2 and pg.evaluate("G5HelpDirty()") == 0, store(pg))
   590	    ctx.close()
   591	    # 必修 5（T20）：取鎖被瀏覽器拒絕 ⇒ 唯讀並說明、沒有 JS 錯誤
   592	    ctx, pg, errors = open_page(browser, init="navigator.locks.request=function(){return Promise.reject(new Error('lock-rejected'));};")
   593	    pg.wait_for_timeout(500)
   594	    check("r4必修5 取鎖被拒：唯讀並說明", pg.evaluate("G5HelpWriter()") is False and "拿不到存檔的權限" in pg.locator("#topBtns").inner_text(), pg.locator("#topBtns").inner_text())
   595	    check("r4必修5 取鎖被拒：沒有未處理的錯誤", not errors, errors)
   596	    ctx.close()
   597	    # 建議 7（T22）：唯讀分頁對 localStorage 的寫入次數＝0
   598	    ctx = browser.new_context(); ctx.add_init_script(FIXTURE + "window.__w=0;var _s2=Storage.prototype.setItem,_r2=Storage.prototype.removeItem;Storage.prototype.setItem=function(k,v){window.__w++;return _s2.call(this,k,v);};Storage.prototype.removeItem=function(k){window.__w++;return _r2.call(this,k);};")
   599	    a = ctx.new_page(); a.goto(URL); a.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   600	    b = ctx.new_page(); b.goto(HOME + "#h/t-guoyu"); b.wait_for_timeout(800)
   601	    a.get_by_role("button", name="我已經會了，直接練習").click(); solve_practice(a, *FIXED[0])
   602	    b.wait_for_timeout(500)
   603	    check("r4建議7 唯讀分頁寫入次數＝0", b.evaluate("G5HelpWriter()") is False and b.evaluate("window.__w") == 0, b.evaluate("window.__w"))
   604	    ctx.close()
   605	
   606	
   607	def flow_codex_r5(browser, label="Chromium"):
   608	    """Codex 2026-10-13 第 5 輪必修 1–3、建議 4（4agent 定案：本頁記憶體是唯一真相、sync.js 不直接寫 g5help.v1、不 reload）。"""
   609	    loads = "sessionStorage.setItem('loads',String(+(sessionStorage.getItem('loads')||0)+1));"
   610	    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,streak:3,clean:8,mastered:true,lessonDone:true,r:1}}}));"
   611	    # 必修 1：冷啟動讀取失敗 ⇒ 不給作答、給「再讀一次」；恢復後接續原紀錄，不會被空白蓋掉
   612	    for key, pre in (("g5help.v1", seed), ("g5math.v1", "localStorage.setItem('g5math.v1',JSON.stringify({v:1,solved:4,idx:4,streak:1,clean:4,mastered:false,lessonDone:true}));")):
   613	        init = (loads + "if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');" + pre + "}"
   614	                "window.__rf=true;var _g=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(window.__rf&&k==='" + key + "')throw new Error('io');return _g.call(this,k);};")
   615	        ctx, pg, errors = open_page(browser, init=init)
   616	        pg.wait_for_timeout(600)
   617	        check(f"{label} r5必修1 冷啟動讀 {key} 失敗：沒有作答按鈕、有「再讀一次」", pg.locator("#goPractice").count() == 0 and pg.locator("#readRetry").count() == 1, pg.locator("#topBtns").inner_text())
   618	        pg.evaluate("window.__rf=false; 0")
   619	        if pg.locator("#readRetry").count():
   620	            pg.locator("#readRetry").click()
   621	        want = 8 if key == "g5help.v1" else 4
   622	        ok = pg.locator("#goPractice").count() == 1
   623	        if ok:
   624	            pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob"); solve_practice(pg, *prob_text(pg))
   625	        st = (store(pg) or {}) if ok else {}
   626	        check(f"{label} r5必修1 恢復讀取後接續原紀錄（{want}→{want + 1} 題，不被空白蓋掉）", st.get("solved") == want + 1, st)
   627	        check(f"{label} r5必修1 沒有 JS 錯誤", not errors, errors)
   628	        ctx.close()
   629	    # 必修 2：雲端版本只在「首頁、沒有未存進度」時套用；套用不 reload
   630	    cloud = json.dumps({"v": 1, "entries": {"p38-6-2": {"solved": 20, "idx": 20, "r": 9}}})
   631	    init = (loads + "window.__fail=false;var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__fail&&k==='g5help.v1')throw new Error('quota');return _s.call(this,k,v);};")
   632	    ctx, pg, errors = open_page(browser, init=init)
   633	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   634	    has = pg.evaluate("typeof window.G5HelpApplyRemote === 'function'")
   635	    check(f"{label} r5必修2 有 G5HelpApplyRemote（同步只能經由本頁套用）", has)
   636	    if has:
   637	        pg.evaluate("window.__fail=true; 0")
   638	        pg.locator("#goPractice").click(); solve_practice(pg, *FIXED[0])
   639	        r1 = pg.evaluate("(c)=>G5HelpApplyRemote('g5help.v1', c)", cloud)
   640	        check(f"{label} r5必修2 有未存進度：拒絕套用雲端、不 reload", r1 is False and pg.evaluate("sessionStorage.getItem('loads')") == "1" and pg.evaluate("G5HelpDirty()") == 1)
   641	        pg.evaluate("window.__fail=false; 0")
   642	        pg.wait_for_function("G5HelpDirty() === 0", timeout=9000)
   643	        r2 = pg.evaluate("(c)=>G5HelpApplyRemote('g5help.v1', c)", cloud)
   644	        check(f"{label} r5必修2 正在某一篇裡：先不套用（回首頁才換）", r2 is False and store(pg)["solved"] == 1)
   645	        pg.evaluate("location.hash=''"); pg.wait_for_selector("#home:not([hidden])")
   646	        r3 = pg.evaluate("(c)=>G5HelpApplyRemote('g5help.v1', c)", cloud)
   647	        check(f"{label} r5必修2 首頁、沒有未存：套用雲端、寫進存檔、不 reload", r3 is True and json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p38-6-2"]["solved"] == 20 and pg.evaluate("sessionStorage.getItem('loads')") == "1")
   648	        check(f"{label} r5必修2 套用後首頁狀態跟著變（練習中）", "練習中" in pg.locator('.subj[data-subj="數學"]').inner_text())
   649	    check(f"{label} r5必修2 沒有 JS 錯誤", not errors, errors)
   650	    ctx.close()
   651	    # 必修 3：存不進去 ⇒ 回首頁也看得到警告；恢復後自動重試成功、警告消失
   652	    ctx, pg, errors = open_page(browser, init=init)
   653	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   654	    pg.evaluate("window.__fail=true; 0")
   655	    pg.locator("#goPractice").click(); solve_practice(pg, *FIXED[0])
   656	    pg.evaluate("location.hash=''"); pg.wait_for_selector("#home:not([hidden])")
   657	    warn = pg.locator("#saveWarn")
   658	    check(f"{label} r5必修3 首頁看得到「還沒存好」警告", warn.count() == 1 and warn.is_visible())
   659	    pg.evaluate("window.__fail=false; 0")
   660	    try:
   661	        pg.wait_for_function("G5HelpDirty() === 0", timeout=9000); auto = True
   662	    except Exception:
   663	        auto = False
   664	    check(f"{label} r5必修3 恢復後自動重試存好（不用再作答）", auto and (store(pg) or {}).get("solved") == 1, pg.evaluate("G5HelpDirty()"))
   665	    check(f"{label} r5必修3 存好後警告消失", warn.count() == 0 or not warn.is_visible())
   666	    ctx.close()
   667	    # 建議 4：舊畫面的「我懂了，下一步」在切走後按下去不出錯；別人改了磁碟也不會讓已答對的題目沒存到
   668	    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
   669	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   670	    pg.get_by_role("button", name="開始學").click()
   671	    chip(pg, "認真的人")
   672	    pg.wait_for_selector("button[data-next]")
   673	    pg.evaluate("window.__oldNext = document.querySelector('button[data-next]'); location.hash = '#h/p38-6-2'; 0")
   674	    pg.wait_for_selector("#prob .frac, #prob")
   675	    pg.evaluate("window.__oldNext.click(); 0"); pg.wait_for_timeout(200)
   676	    check(f"{label} r5建議4 切走後按舊的「下一步」：沒有錯誤、數學篇畫面不被動到", not errors and pg.locator('#lesson .lstep').count() == 0, errors)
   677	    ctx.close()
   678	    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
   679	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   680	    pg.locator("#goPractice").click()
   681	    pg.evaluate("""localStorage.setItem('g5help.v1', JSON.stringify({v:1,entries:{'t-guoyu':{solved:7,idx:7,r:50}}}));
   682	                   window.dispatchEvent(new StorageEvent('storage',{key:'g5help.v1'})); 0""")
   683	    pg.wait_for_timeout(100)
   684	    c1 = pg.locator('#practice .chip[data-k="1"]')
   685	    if c1.count():
   686	        c1.click()
   687	    pg.wait_for_timeout(100)
   688	    db = json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["t-guoyu"]
   689	    check(f"{label} r5建議4 畫面說對了的那一題確實存進去（本頁是唯一真相）", db["solved"] == 1 and "對" in pg.locator("#practice").inner_text(), db)
   690	    check(f"{label} r5建議4 沒有 JS 錯誤", not errors, errors)
   691	    ctx.close()
   692	    # GPT 4agent 補：同一個答對 handler 直接再呼叫一次（不靠按鈕 disabled），只能算一題
   693	    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
   694	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   695	    pg.locator("#goPractice").click()
   696	    pg.evaluate("""(function(){var b=document.querySelector('#practice .chip[data-k="1"]'),h=b.onclick;b.click();h.call(b);})(); 0""")
   697	    db = json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["t-guoyu"]
   698	    check(f"{label} r5補 同一題的答對 handler 重播只計一次", db["solved"] == 1 and db["idx"] == 1 and len(db["log"]) == 1, {k: db[k] for k in ("solved", "idx")})
   699	    ctx.close()
   700	
   701	def flow_confused(browser):
   702	    """交辦 #1319：每一步有「這步看不懂」；沒開同步給口頭說法；有同步碼就送 op=confused（攔下請求，不打真後端）。"""
   703	    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
   704	    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
   705	    pg.get_by_role("button", name="開始學").click()
   706	    btn = pg.locator(".lstep").first.locator("button[data-confused]")
   707	    check("#1319 每一步有「這步看不懂」按鈕", btn.count() == 1 and btn.is_visible())
   708	    btn.click()
   709	    check("#1319 沒開同步：請她口頭跟爸媽說第幾步", "第 1 步看不懂" in pg.locator(".lstep").first.inner_text())
   710	    sent = []
   711	    pg.route("**/macros/s/**", lambda route: (sent.append(route.request.post_data), route.fulfill(status=200, content_type="application/json", body='{"ok":true,"id":"c1"}')))
   712	    pg.evaluate("localStorage.setItem('g5sync.code','ABCDEFGHJKMN'); 0")
   713	    btn.click(); pg.wait_for_timeout(400)
   714	    body = json.loads(sent[0]) if sent else {}
   715	    check("#1319 有同步碼：送出 op=confused、篇 id、第 1 步", body.get("op") == "confused" and body.get("entry") == "t-guoyu" and body.get("step") == 1 and body.get("subject") == "國語", body)
   716	    check("#1319 送出後告訴她收到了", "收到了" in pg.locator(".lstep").first.inner_text())
   717	    check("#1319 沒有 JS 錯誤", not errors, errors)
   718	    ctx.close()
   719	
   720	def main():
   721	    with sync_playwright() as p:
   722	        cr = p.chromium.launch()
   723	        if BASE.startswith("https:"):
   724	            flow_video_live(cr, "線上Chromium")
   725	        flow_full(cr, "桌機", {"viewport": {"width": 1280, "height": 900}}, width=1280)
   726	        flow_full(cr, "手機390", {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True, "device_scale_factor": 2}, width=390, shots=True)
   727	        flow_codex_r1(cr)
   728	        flow_storage_blocked(cr)
   729	        flow_corrupt_store(cr)
   730	        flow_codex_help_r1(cr)
   731	        flow_codex_help_r2(cr)
   732	        flow_single_writer(cr, "Chromium")
   733	        flow_codex_r4(cr)
   734	        flow_codex_r5(cr)
   735	        flow_confused(cr)
   736	        flow_home(cr)
   737	        flow_migrate(cr)
   738	        flow_steps(cr, "手機390", {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True}, shots=True)
   739	        flow_dark(cr)
   740	        cr.close()
   741	        wk = p.webkit.launch()
   742	        ipad = p.devices["iPad (gen 7)"]
   743	        flow_full(wk, "iPad", ipad, width=ipad["viewport"]["width"], shots=True)
   744	        flow_steps(wk, "iPad", ipad)
   745	        flow_single_writer(wk, "WebKit")
   746	        flow_codex_r5(wk, "WebKit")
   747	        if BASE.startswith("https:"):
   748	            flow_video_live(wk, "線上iPad", ipad)
   749	        wk.close()
   750	    bad = [r for r in RESULTS if not r[1]]
   751	    print(f"\n{len(RESULTS) - len(bad)}/{len(RESULTS)} PASS")
   752	    sys.exit(1 if bad else 0)
   753	
   754	
   755	if __name__ == "__main__":
   756	    main()

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
exec
/bin/zsh -lc 'nl -ba docs/storage-design-C-4agent-20261013.md' in /Users/william/Documents/g5-help
 succeeded in 0ms:
     1	# 難題站存檔 設計 C（2026-10-13，Codex 設計後連兩輪 FAIL → 4agent 協作定案）
     2	
     3	交辦 #1303。設計 B（Web Locks 單一寫入分頁）保留；C 只改「誰是真相、誰能寫」。
     4	
     5	## 根因（一句話）
     6	本頁記憶體與磁碟各自被當成真相：app 的 save() 用 BASE/r 跟磁碟比版本、storage 事件會把磁碟版換進記憶體，
     7	sync.js 又能直接寫 g5help.v1 ——三個寫入者都拿著不同時間的快照，任何交錯都可能把另一邊的進度洗掉。
     8	
     9	## 不變量
    10	1. 取鎖且「讀成功」（READY）才開放作答；讀取拋錯（含舊 key g5math.v1）≠ 沒有紀錄 → 給「再讀一次」。
    11	2. 本頁記憶體是唯一真相；save() 把記憶體整份寫進主 key，寫成功才清 DIRTY；失敗保留、3 秒自動再試、
    12	   首頁與各篇都看得到 #saveWarn。save 不替換 DB/st/cur 物件（舊 handler 仍指同一份）。
    13	3. g5help.v1 只有本頁寫：不聽 storage 事件換資料；sync.js 以 canReplace(key)（無副作用）先問、
    14	   accept(key, data) 由本頁寫入並重畫；只在「首頁、沒有未存進度」時換，不 reload。
    15	4. 舊畫面 handler：GEN 世代 ＋「st.cur !== cur」閂鎖（這題計分後即失效，重播不重複計分）。
    16	
    17	## 刻意不做（縮小範圍）
    18	- 不做跨分頁版本合併、不做 storage 事件凍結（未更新的舊版分頁仍是上線前提風險）。
    19	- 不改等待頁接手 reload（唯讀頁沒有進度，reload 只重讀磁碟）。
    20	- 不做手動同步／metadata 跨頁鎖（GPT 提案，成本高；列殘留風險）。
    21	
    22	## 驗收（tests/e2e.py flow_codex_r5，Chromium＋WebKit；sync.test S30）
    23	舊碼 12 項 8 紅；新碼全綠；突變 8/8 轉紅（READY 恆真、吞舊 key 例外、篇內也換雲端、拿掉自動重試、
    24	拿掉「下一步」世代、拿掉計分閂鎖、sync 不問 canReplace、sync 直接 write）。
    25	
    26	四腦紀錄：Gemini 架構、GPT SOP、Grok 無額度（403）、Claude premise/probe——見交接檔。

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,120p' tests/e2e.py; sed -n '1,100p' tests/harness.js; git diff HEAD"'^ HEAD -- src/sync.js' in /Users/william/Documents/g5-help
 succeeded in 0ms:
#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""五年級難題解說端到端驗收：Chromium（桌機、手機 390）＋WebKit iPad，照孩子會做的順序走完教學與練習。
第 1 篇（數學 28/42）走互動算題格式；通用 steps 格式用測試題（__G5_HARD_FIXTURE__，正式頁不會出現）驗。

跑法：python3.12 tests/e2e_math.py [--shots DIR] [--base https://windsorya.github.io/g5-sci-review/]
（--base 給正式網址時改測線上版，並加測影片播放器是否真的載入）
答案用 Python fractions 獨立算（不借用頁面裡的 G5Frac），頁面算錯就會對不上。
"""
import json
import sys
from fractions import Fraction
from math import gcd
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = sys.argv[sys.argv.index("--base") + 1].rstrip("/") + "/" if "--base" in sys.argv else ROOT.as_uri() + "/"
HOME = BASE + "index.html"
URL = HOME + "#h/p38-6-2"
SHOTS = Path(sys.argv[sys.argv.index("--shots") + 1]) if "--shots" in sys.argv else None
RESULTS = []
FIXED = [((24, 36), (35, 50)), ((27, 36), (28, 42)), ((21, 35), (16, 24)),
         ((18, 27), (28, 42)), ((36, 54), (20, 32)), ((45, 63), (32, 40))]


def check(name, cond, detail=""):
    RESULTS.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  ← {detail}"))


def shot(page, name, full=True):
    if SHOTS:
        SHOTS.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=full)


def open_page(browser, device=None, init=None, url=URL, **kw):
    ctx = browser.new_context(**(device or {}), **kw)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    if init:
        page.add_init_script(init)
    page.goto(url, wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("load", timeout=15000)
    except Exception:
        pass
    return ctx, page, errors


def last_ask(page):
    return page.locator("#lesson .ask").last


def chip(page, text):
    last_ask(page).get_by_role("button", name=text, exact=True).click()


def fb_text(page):
    return last_ask(page).locator(".fb").inner_text()


def fill_nums(page, values):
    ask = last_ask(page)
    for i, v in enumerate(values):
        ask.locator(f'input[data-i="{i}"]').fill(str(v))
    ask.get_by_role("button", name="檢查").click()


def no_overflow(page, width):
    sw = page.evaluate("document.documentElement.scrollWidth")
    return sw <= width, sw


def store(page):
    db = json.loads(page.evaluate("localStorage.getItem('g5help.v1')") or "null")
    return (db or {}).get("entries", {}).get("p38-6-2")


def walk_lesson(page, label, mistakes=True):
    page.get_by_role("button", name="開始學").click()
    # 1 先看分母：直接比分子是錯的方法
    check(f"{label} 第1步列出 45 的倍數到 630（14 個）", page.locator("#lesson .mults span").count() == 14 and
          page.locator("#lesson .mults span.hit").inner_text() == "630")
    if mistakes:
        chip(page, "直接比分子，28 比 27 大")
        check(f"{label} 第1步選「直接比分子」被擋並說明", "分子大的不一定比較大" in fb_text(page), fb_text(page))
    chip(page, "先約分：分子分母一起除以同一個數")
    # 2 約分 28/42：先試 3（錯）→ 2 → 太早說不能再約（錯）→ 7 → 不能再約
    if mistakes:
        chip(page, "一起除以 3")
        check(f"{label} 選 3：用乘法表說明 28 不能被 3 整除", "3 × 9 = 27、3 × 10 = 30，中間沒有 28" in fb_text(page), fb_text(page))
    chip(page, "一起除以 2")
    if mistakes:
        fill_nums(page, [13, 21])
        check(f"{label} 28÷2 填 13 被擋並給提示", "2 × 多少 = 28" in fb_text(page), fb_text(page))
    fill_nums(page, [14, 21])
    if mistakes:
        chip(page, "不能再約了")
        check(f"{label} 14/21 說不能再約被擋（7 的乘法表）", "7 的乘法表" in fb_text(page), fb_text(page))
    chip(page, "一起除以 7")
    fill_nums(page, [2, 3])
    chip(page, "不能再約了")
    s2 = page.locator('#lesson section[data-step="2"]').inner_text()
    check(f"{label} 第2步出現 28/42 = 14/21 = 2/3 與「一次除以 14」", "也可以一次除以 14" in s2 and "2 × 7" in s2, s2[-300:])
    check(f"{label} 第2步長條圖：42 格、粗線 2 條、3 大塊塗 2 塊",
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("rect").count() == 43 and
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("line").count() == 2 and
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(1).locator("rect").count() == 4)
    # 3 約分 27/45：一次除以 9
    chip(page, "一起除以 9")
    fill_nums(page, [3, 5])
    chip(page, "不能再約了")
    # 4 通分：先填 30（公倍數但不是最小）
    if mistakes:
        fill_nums(page, [30])
        check(f"{label} 最小公倍數填 30：說是公倍數但還有更小的", "還有更小的" in fb_text(page), fb_text(page))
    fill_nums(page, [15])
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const core = require('../gas/core');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const flush = () => new Promise(resolve => setImmediate(resolve));

class Storage {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); this.fail = null; }
  get length() { return this.data.size; }
  key(i) { return [...this.data.keys()][i] || null; }
  getItem(key) { return this.data.has(String(key)) ? this.data.get(String(key)) : null; }
  setItem(key, value) {
    if (this.fail && this.fail(key, value)) {
      const error = new Error('private storage error'); error.name = 'QuotaExceededError'; throw error;
    }
    this.data.set(String(key), String(value));
  }
  removeItem(key) { this.data.delete(String(key)); }
  dump() { return Object.fromEntries(this.data); }
}
class Events {
  constructor() { this.listeners = {}; }
  addEventListener(type, listener) { (this.listeners[type] ||= new Set()).add(listener); }
  removeEventListener(type, listener) { this.listeners[type]?.delete(listener); }
  dispatch(type, event = {}) { for (const fn of this.listeners[type] || []) { fn(event); } }
}
class Element extends Events {
  constructor(tag, ownerDocument) {
    super(); this.tagName = tag.toUpperCase(); this.ownerDocument = ownerDocument;
    this.children = []; this.style = {}; this.attributes = {}; this._text = ''; this._html = '';
    this.value = ''; this.hidden = false; this.disabled = false;
  }
  get firstChild() { return this.children[0] || null; }
  appendChild(node) { this.children.push(node); return node; }
  removeChild(node) { this.children.splice(this.children.indexOf(node), 1); return node; }
  set textContent(text) { this._text = String(text); this.children = []; this._html = ''; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set innerHTML(html) { this._html = String(html); this.children = []; this._text = ''; }
  get innerHTML() { return this._html; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.ownerDocument.activeElement = this; }
  select() { this.selected = true; }
  click() { if (!this.disabled) this.dispatch('click', {preventDefault() {}}); }
}
class Document extends Events {
  constructor() { super(); this.visibilityState = 'visible'; this.container = new Element('div', this); }
  createElement(tag) { return new Element(tag, this); }
  querySelector(selector) { return selector === '#sync' ? this.container : null; }
}
function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function byClass(device, name) { return descendants(device.doc.container).filter(node => node.className === 'g5s-' + name); }
function click(device, text) {
  const b = descendants(device.doc.container).find(node => node.tagName === 'BUTTON' && node.textContent === text);
  assert.ok(b, `Missing button: ${text}`); b.click(); return b;
}
class Clock {
  constructor(start = Date.UTC(2026, 9, 13, 0, 0, 0)) { this.time = start; this.next = 1; this.tasks = new Map(); }
  now = () => this.time;
  setTimeout = (fn, delay) => { const id = this.next++; this.tasks.set(id, {fn, at: this.time + delay, repeat: 0}); return id; };
  clearTimeout = id => this.tasks.delete(id);
  setInterval = (fn, delay) => { const id = this.setTimeout(fn, delay); this.tasks.get(id).repeat = delay; return id; };
  clearInterval = this.clearTimeout;
  async advance(ms) {
    const target = this.time + ms;
    for (let n = 0; n < 10000; n++) {
      const [id, job] = [...this.tasks].filter(([, item]) => item.at <= target).sort((a, b) => a[1].at - b[1].at)[0] || [];
      if (!job) { this.time = target; await flush(); return; }
      this.time = job.at;
      if (job.repeat) job.at += job.repeat; else this.tasks.delete(id);
      job.fn(); await flush();
    }
    throw new Error('Fake clock runaway');
  }
}
function makeStore() {
  const rows = new Map(); let locked = false;
  const store = {
    rows, events: [], hash,
    withLock(fn) {
      assert.equal(locked, false); locked = true; this.events.push('lock');
      try { return fn(); } finally { locked = false; this.events.push('unlock'); }
    },
    get(h, key) {
      assert.ok(locked); this.events.push('get');
      const row = rows.get(h + '|' + key); return row ? core.fromRow(row) : null;
    },
    set(h, key, record) {
      assert.ok(locked); this.events.push('set'); rows.set(h + '|' + key, core.toRow(h, key, record));
    },
    record(code, key = 'g5sci.v3') { const row = rows.get(hash(code) + '|' + key); return row ? core.fromRow(row) : null; }
  };
  return store;
}
function server(clock, store = makeStore()) {
  return {clock, store, handle(req) { return core.handle(store, req, clock.now); }};
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-1HTbMIZL' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-12tdyQiA' (errno=Operation not permitted)
diff --git a/src/sync.js b/src/sync.js
index 18c8d5f..d366e82 100644
--- a/src/sync.js
+++ b/src/sync.js
@@ -89,7 +89,7 @@
     try { storage = options.storage || root.localStorage; } catch (ignoreStorage) { storage = null; }
     var code = null, epoch = 0, destroyed = false, stopped = false;
     var busy = null, activeAbort = null, retryTimer = null, failures = 0, retryAt = 0;
-    var needsGet = {}, conflicts = {}, decisions = {}, observed = {}, replaced = [];
+    var needsGet = {}, conflicts = {}, decisions = {}, observed = {}, replaced = [], deferred = {};
     var status = '尚未開啟同步', notice = '', viewCode, view = {};
 
     function read(key) {
@@ -298,12 +298,20 @@
       if (cloud.data === null) { throw error('server'); }
       var currentMeta = baseline(key);
       if (currentMeta && currentMeta.rev > cloud.rev) { showConflict(key, cloud); return; }
+      // 頁面自己是唯一寫入者時（難題站，#1303 第 5 輪）：先問能不能換（有未存進度、正在某一篇裡就不行），
+      // 不行就什麼都不動（不備份、不寫），下一輪再 GET 再問；可以才備份，並交給頁面自己寫入與重畫（不 reload）。
+      if (typeof options.canReplace === 'function' && !options.canReplace(key)) {
+        needsGet[key] = true; deferred[key] = true; return;
+      }
       var local = read(key);
       backup(key, local);
       assertActive(token);
       // Synchronous read/backup/write; no awaited work between decision and replacement.
-      write(key, cloud.data);
+      if (typeof options.accept === 'function') {
+        if (!options.accept(key, cloud.data)) { needsGet[key] = true; deferred[key] = true; return; }
+      } else { write(key, cloud.data); }
       if (read(key) !== cloud.data) { throw error('storage'); }
+      delete deferred[key];
       replaced.push(key); // Notify even if persisting the following metadata fails.
       saveBaseline(key, cloud.rev, cloud.data, cloud.updated);
       delete conflicts[key];
@@ -344,7 +352,7 @@
       if (hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
     }
     function resetSession(nextCode) {
-      epoch += 1; code = nextCode; needsGet = {}; conflicts = {}; decisions = {}; observed = {}; replaced = [];
+      epoch += 1; code = nextCode; needsGet = {}; conflicts = {}; decisions = {}; observed = {}; replaced = []; deferred = {};
       failures = 0; retryAt = 0; notice = '';
       if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
       keys.forEach(function (key) { needsGet[key] = true; });
@@ -370,6 +378,7 @@
         return needsGet[key] || !meta || contentHash(local) !== meta.hash;
       });
       status = dirty ? '等待同步本機變更' : '已同步 ' + taipei(now(), false);
+      if (keys.some(function (key) { return !!deferred[key]; })) { status = '雲端有較新的進度，回到首頁、存好後就會換上。'; }
       if (keys.some(function (key) { var meta = baseline(key); return meta && meta.rev > 0 && read(key) === null; })) {
         status = '這台的進度已移除，雲端紀錄保留；重新加入可下載。';
       }

hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
exec
/bin/zsh -lc "nl -ba src/app.html | sed -n '210,335p'; nl -ba src/app.html | sed -n '475,715p'; nl -ba src/app.html | sed -n '715,799p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   210	  if (o.group) for (var j = o.group; j < d; j += o.group) { var x = (2 + j * w).toFixed(2); s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="var(--ink)" stroke-width="3.5"/>'; }
   211	  s += '<rect x="2" y="2" width="' + (W - 4) + '" height="' + (H - 4) + '" fill="none" stroke="var(--ink)" stroke-width="2.5"/>';
   212	  return '<svg class="fbar" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.label || ("切成 " + d + " 格，塗了 " + n + " 格")) + '">' + s + '</svg>';
   213	}
   214	
   215	// ---------- 存檔：g5help.v1＝{v:1, entries:{篇id: 那一篇的教學與練習紀錄}}；不碰自然複習的 g5sci.v3 ----------
   216	var KEY = "g5help.v1";
   217	function fresh(){ return {lessonDone:false, idx:0, seed:Math.floor(Math.random() * 1e6), streak:0, clean:0, solved:0, mastered:false, log:[], cur:null, r:0}; }
   218	function nat(x){ return typeof x === "number" && Number.isSafeInteger(x) && x >= 0 && x <= 100000; }   // 題號、次數：超過 10 萬當壞資料（Codex 必修 6）
   219	function seedOk(x){ return typeof x === "number" && Number.isSafeInteger(x) && x >= 0 && x <= 2147483647; }   // 亂數種子另設範圍（Codex 第 2 輪必修 1）
   220	function clean1(s){
   221	  var d = fresh();
   222	  if (!s || typeof s !== "object") return d;
   223	  ["idx","streak","clean","solved"].forEach(function(k){ if (nat(s[k])) d[k] = s[k]; });
   224	  if (seedOk(s.seed)) d.seed = s.seed;
   225	  d.r = (typeof s.r === "number" && Number.isSafeInteger(s.r) && s.r >= 0) ? s.r : 0;   // 這一篇的版本號：每存一次 +1
   226	  d.lessonDone = s.lessonDone === true; d.mastered = s.mastered === true;
   227	  if (Array.isArray(s.log)) d.log = s.log.slice(-100);
   228	  // 正在做的那一題：看過提示、答錯過幾次（Codex 2026-10-12 第 1 輪必修 1、2：重開練習不能洗掉、不能重複計分）
   229	  if (s.cur && nat(s.cur.idx) && nat(s.cur.hints) && nat(s.cur.wrongs)) d.cur = {idx:s.cur.idx, hints:s.cur.hints, wrongs:s.cur.wrongs};
   230	  return d;
   231	}
   232	function own(o, k){ return Object.prototype.hasOwnProperty.call(o, k); }
   233	function parseDB(raw){
   234	  // 回傳 entries（Object.create(null)，id 叫 constructor、__proto__ 也不會撞到內建屬性）；讀不懂回 null
   235	  try {
   236	    var x = JSON.parse(raw);
   237	    if (!x || x.v !== 1 || !x.entries || typeof x.entries !== "object" || Array.isArray(x.entries)) return null;
   238	    var out = Object.create(null);
   239	    Object.keys(x.entries).forEach(function(id){ out[id] = clean1(x.entries[id]); });
   240	    return out;
   241	  } catch (e) { return null; }
   242	}
   243	// 存檔規則（2026-10-13 第 5 輪後 4agent 定案：本頁記憶體是唯一真相，不再做跨分頁版本比對）：
   244	// ①同一時間只有一個寫入分頁（Web Locks）；sync.js 也不能直接寫 g5help.v1（canReplace／accept 交給本頁）。
   245	// ②取鎖後要「讀成功」才開放作答（READY）；讀不到＝不是沒有紀錄，給「再讀一次」，不建立空白紀錄。
   246	// ③作答改記憶體並標 DIRTY；save() 把記憶體整份寫進主 key，寫成功才清 DIRTY；失敗保留、每 3 秒自動再試、
   247	//   首頁與各篇都看得到警告（#saveWarn）。④壞資料先用不撞名的 key 備份並讀回核對，成功才覆蓋主 key。
   248	// ⑤不聽 storage 事件換資料（只有本頁會寫）；雲端新版本只在「首頁、沒有未存進度」時由本頁套用並重畫，不 reload。
   249	var WRITER = false, READY = false, DIRTY = Object.create(null), BACKED = null, RETRY = null;
   250	// 讀磁碟：只讀、不寫。回 {ok:false}＝讀取失敗（主 key 或舊 key 讀時拋錯；不是「沒有紀錄」）；
   251	// broken＝主 key 有原文但讀不懂，備份與替換一律在 save() 裡、確認備份成功後才做。
   252	function readDisk(){
   253	  var raw, oldRaw;
   254	  try { raw = localStorage.getItem(KEY); } catch (e) { return {ok:false}; }
   255	  var es = raw === null ? null : parseDB(raw);
   256	  if (es) return {ok:true, entries:es, broken:null};
   257	  try { oldRaw = localStorage.getItem("g5math.v1"); } catch (e) { return {ok:false}; }   // 舊 key 讀不到也算讀取失敗（Codex 第 5 輪必修 1）
   258	  es = Object.create(null);
   259	  try {
   260	    // 2026-10-12 那一頁放在自然複習網站時存在 g5math.v1：搬進第 1 篇（舊資料原文不動）
   261	    var old = JSON.parse(oldRaw || "null");
   262	    if (old && old.v === 1) es["p38-6-2"] = clean1(old);
   263	  } catch (e) {}
   264	  return {ok:true, entries:es, broken:raw};   // raw 為 null＝第一次用；非 null＝壞資料待備份
   265	}
   266	function loadDB(){ var d = readDisk(); return {v:1, entries:d.ok ? d.entries : Object.create(null), readOk:d.ok}; }
   267	var DB = loadDB(), st = null, NOTICE = "", GEN = 0;
   268	function stateOf(id){ if (!own(DB.entries, id)) DB.entries[id] = fresh(); return DB.entries[id]; }
   269	function dirtyCount(){ return Object.keys(DIRTY).length; }
   270	function backupBroken(raw){
   271	  // 壞資料：用不會撞名的 key 備份並讀回核對；成功才允許之後用新資料覆蓋主 key（不先刪主 key）
   272	  if (BACKED === raw) return true;
   273	  var k = KEY + ".broken." + Date.now() + "." + Math.floor(Math.random() * 1e9);
   274	  try { localStorage.setItem(k, raw); if (localStorage.getItem(k) !== raw) return false; BACKED = raw; return true; } catch (e) { return false; }
   275	}
   276	function saveFailed(){
   277	  // 存不進去：進度留在記憶體（DIRTY），3 秒後自動再試；首頁與各篇都看得到警告（Codex 第 5 輪必修 3）
   278	  if (!RETRY) RETRY = setTimeout(function(){ RETRY = null; if (dirtyCount()) save(); }, 3000);
   279	  drawWarn(); drawRec(); return false;
   280	}
   281	function save(){
   282	  if (!WRITER || !READY) return false;   // 唯讀分頁、還沒讀成功：一律不寫
   283	  if (E && st) DIRTY[E.id] = true;   // 任何失敗出口之前先記下「這篇有沒存好的進度」
   284	  var d = readDisk();
   285	  if (!d.ok) return saveFailed();   // 讀取失敗≠沒有紀錄：不寫，進度留在記憶體
   286	  if (d.broken !== null && !backupBroken(d.broken)) return saveFailed();   // 備份不了就不覆蓋原文
   287	  var out = Object.create(null);
   288	  Object.keys(d.entries).forEach(function(id){ out[id] = d.entries[id]; });   // 磁碟上有、記憶體沒有的篇（例如搬家來的）照留
   289	  Object.keys(DB.entries).forEach(function(id){ out[id] = DB.entries[id]; });   // 記憶體是唯一真相
   290	  try { localStorage.setItem(KEY, JSON.stringify({v:1, entries:out})); } catch (e) { return saveFailed(); }
   291	  Object.keys(out).forEach(function(id){ if (!own(DB.entries, id)) DB.entries[id] = out[id]; });
   292	  DIRTY = Object.create(null);
   293	  if (RETRY) { clearTimeout(RETRY); RETRY = null; }
   294	  drawWarn(); drawRec();
   295	  return true;
   296	}
   297	function drawWarn(){
   298	  var w = $("#saveWarn"); if (!w) return;
   299	  w.hidden = !dirtyCount();
   300	}
   301	// 讀不到原有紀錄時的「再讀一次」：讀成功才開放作答，並接著原紀錄（不會被空白蓋掉）
   302	function retryRead(){
   303	  if (!WRITER) return;
   304	  var d = readDisk();
   305	  if (!d.ok) { NOTICE = "還是讀不到，請稍後再試，或重新整理這一頁。"; route(); return; }
   306	  DB = {v:1, entries:d.entries, readOk:true}; READY = true; route();
   307	}
   308	// 雲端有較新的紀錄：只在首頁、沒有未存進度時換上；換上＝寫進主 key、重畫首頁，不 reload（Codex 第 5 輪必修 2）
   309	function canReplace(key){ return key === KEY && WRITER && READY && !E && !dirtyCount(); }
   310	function applyRemote(key, raw){
   311	  if (!canReplace(key)) return false;
   312	  var es = parseDB(raw); if (!es) return false;
   313	  try { localStorage.setItem(KEY, raw); if (localStorage.getItem(KEY) !== raw) return false; } catch (e) { return false; }
   314	  GEN++; DB = {v:1, entries:es, readOk:true}; drawHome();
   315	  return true;
   316	}
   317	
   318	// ---------- 互動元件 ----------
   319	// iPad 中文鍵盤可能打出全形數字「１５」：先轉半形（Codex 第 1 輪必修 5）。回傳 {empty}、{bad}（不是整數）或 {v}
   320	function parseNum(raw){
   321	  var t = String(raw || "").replace(/[０-９]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }).replace(/\s+/g, "");
   322	  if (!t) return {empty:true};
   323	  if (!/^\d+$/.test(t)) return {bad:true};
   324	  return {v:parseInt(t, 10)};
   325	}
   326	// 選擇題：答錯會說明為什麼，可以再選；答對才往下
   327	function chipsAsk(body, q, opts, judge, onOk, cls){
   328	  var box = add(body, '<div class="ask"><div class="qq">' + q + '</div><div class="chips">' + opts.map(function(o, i){ return '<button type="button" class="chip' + (cls ? " " + cls : "") + '" data-i="' + i + '">' + o.label + '</button>'; }).join("") + '</div><div class="fb" hidden></div></div>');
   329	  var out = $(".fb", box), bs = box.querySelectorAll(".chip");
   330	  var g0 = GEN;
   331	  each(bs, function(b){ b.onclick = function(){
   332	    if (g0 !== GEN) return;
   333	    var o = opts[+b.dataset.i], r = judge(o.value);
   334	    if (r.ok) { each(bs, function(x){ x.disabled = true; }); b.classList.add("picked"); fb(out, true, r.msg || "對了！"); if (onOk) onOk(o.value, r); }
   335	    else { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake", "tried"); fb(out, false, r.msg); }
   475	    convert(b, sa, L, function(ea){
   476	      convert(b, sb, L, function(eb){
   477	        add(b, '<div class="pic"><div class="cap">' + F.txt(sa) + ' 的每 1 大塊再切成 ' + (L / sa.d) + ' 小格，就是 ' + F.txt(ea) + '：</div>' +
   478	          bar(sa.n, sa.d, {label:F.txt(sa)}) + bar(ea.n, L, {group:L / sa.d, label:F.txt(ea)}) +
   479	          '<div class="cap">' + F.txt(sb) + ' 的每 1 大塊再切成 ' + (L / sb.d) + ' 小格，就是 ' + F.txt(eb) + '：</div>' +
   480	          bar(sb.n, sb.d, {c:"b", label:F.txt(sb)}) + bar(eb.n, L, {c:"b", group:L / sb.d, label:F.txt(eb)}) + '</div>');
   481	        step5(ea, eb);
   482	      });
   483	    });
   484	  });
   485	}
   486	function step5(ea, eb){
   487	  var b = stepCard(5, "比大小");
   488	  add(b, '<p>現在兩個分數的分母都是 ' + ea.d + '，就像兩條一樣長的巧克力都切成 ' + ea.d + ' 小塊，比誰拿的塊數多。</p>' +
   489	    '<div class="pic"><div class="cap">' + F.txt(ea) + '：塗 ' + ea.n + ' 格</div>' + bar(ea.n, ea.d, {label:F.txt(ea)}) +
   490	    '<div class="cap">' + F.txt(eb) + '：塗 ' + eb.n + ' 格</div>' + bar(eb.n, eb.d, {c:"b", label:F.txt(eb)}) + '</div>');
   491	  var s1 = F.cmp(ea, eb);
   492	  chipsAsk(b, fr(ea) + ' ○ ' + fr(eb) + '，○ 裡要填什麼？', SIGNS, function(v){
   493	    return v === s1 ? {ok:true, msg:"對！分母一樣，比分子：" + (s1 === ">" ? ea.n + " 比 " + eb.n + " 大，所以 " + F.txt(ea) + " 比較大。" : s1 === "<" ? ea.n + " 比 " + eb.n + " 小，所以 " + F.txt(eb) + " 比較大。" : "分子一樣，所以兩個一樣大。")} : {ok:false, msg:"看塗色的格子：" + ea.n + " 格和 " + eb.n + " 格，哪個多？"};
   494	  }, function(){
   495	    chipsAsk(b, '所以 ' + fr(A) + ' ○ ' + fr(B) + '？', SIGNS, function(v){
   496	      return v === SOL.sign ? {ok:true, msg:F.txt(A) + " 和 " + F.txt(ea) + " 一樣大、" + F.txt(B) + " 和 " + F.txt(eb) + " 一樣大，所以答案一樣是「" + SOL.sign + "」。"} :
   497	        {ok:false, msg:F.txt(A) + " = " + F.txt(ea) + "，" + F.txt(B) + " = " + F.txt(eb) + "。剛剛比出來哪個大？"};
   498	    }, function(){ setBox(SOL.sign); step6(ea, eb); }, "sign");
   499	  }, "sign");
   500	}
   501	function step6(ea, eb){
   502	  var b = stepCard(6, "寫進習作");
   503	  add(b, '<p>照這樣寫在習作上，跟你第①題的寫法一樣：</p>' +
   504	    '<div class="note"><div class="ln">' + fr(A) + ' = ' + fr(SOL.sa) + ' = ' + fr(ea) + '，</div>' +
   505	    '<div class="ln">' + fr(B) + ' = ' + fr(SOL.sb) + ' = ' + fr(eb) + '</div>' +
   506	    '<div class="ln">' + fr(ea) + ' ' + sym(SOL.sign) + ' ' + fr(eb) + '　∴ ' + fr(A) + ' ' + sym(SOL.sign) + ' ' + fr(B) + '</div></div>');
   507	  chipsAsk(b, '最後確認：遇到分母很大的分數比大小，順序是？', [
   508	    {label:"先通分，再約分", value:"x"}, {label:"先約分，再通分", value:"ok"}, {label:"直接比分子", value:"n"}
   509	  ], function(v){
   510	    if (v === "ok") return {ok:true, msg:"對！先約分讓數字變小（大小不變），再通分，最後比分子。"};
   511	    if (v === "x") return {ok:false, msg:"先通分的話，要用 " + SOL.rawLcm + " 那麼大的數。先把數字變小比較好算。"};
   512	    return {ok:false, msg:"分母不一樣時，不能直接比分子。"};
   513	  }, function(){
   514	    add(b, '<details class="alt"><summary>另一種做法：直接通分（答案一樣，但數字很大）</summary><div class="eq">' +
   515	      fr(A) + ' = ' + frx(A, SOL.rawLcm / A.d) + ' = ' + fr({n:A.n * SOL.rawLcm / A.d, d:SOL.rawLcm}) + '</div><div class="eq">' +
   516	      fr(B) + ' = ' + frx(B, SOL.rawLcm / B.d) + ' = ' + fr({n:B.n * SOL.rawLcm / B.d, d:SOL.rawLcm}) + '</div><p class="tip">' +
   517	      (A.n * SOL.rawLcm / A.d) + ' ' + sym(SOL.sign) + ' ' + (B.n * SOL.rawLcm / B.d) + '，答案也是「' + SOL.sign + '」。可是要算 ' + A.n + ' × ' + (SOL.rawLcm / A.d) + '、' + B.n + ' × ' + (SOL.rawLcm / B.d) + '，比先約分辛苦很多。</p></details>');
   518	    var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做一題</button></div>');
   519	    st.lessonDone = true; save(); drawTopBtns();
   520	    $("#toPractice", go).onclick = function(){ openPractice(); };
   521	  });
   522	}
   523	
   524	// ---------- 練習 ----------
   525	function fin(key){ return '<span class="fin"><input class="num" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done" autocomplete="off" data-k="' + key + '.n" aria-label="' + (key[0] === "a" ? "左邊" : "右邊") + '分子"><i></i><input class="num" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done" autocomplete="off" data-k="' + key + '.d" aria-label="' + (key[0] === "a" ? "左邊" : "右邊") + '分母"></span>'; }
   526	function readFrac(box, key){
   527	  var pn = parseNum(($('input[data-k="' + key + '.n"]', box) || {}).value), pd = parseNum(($('input[data-k="' + key + '.d"]', box) || {}).value);
   528	  return {n:pn.empty || pn.bad ? NaN : pn.v, d:pd.empty || pd.bad ? NaN : pd.v, empty:!!(pn.empty || pd.empty), bad:!!(pn.bad || pd.bad)};
   529	}
   530	function lock(box){ each(box.querySelectorAll("input,button[data-check],button[data-hint]"), function(x){ x.disabled = true; }); }
   531	function need(){ return E.kind === "steps" ? Math.min(3, (E.practice || []).length) : 3; }   // 學會＝連續答對幾題（練習題少於 3 題就全對）
   532	function dots(){ var h = ""; for (var i = 0; i < need(); i++) h += '<i class="' + (i < Math.min(st.streak, need()) ? "on" : "") + '"></i>'; return '<span class="dots" aria-label="連續自己做對 ' + st.streak + ' 題">' + h + '</span>'; }
   533	function openPractice(){ var P = $("#practice"); P.hidden = false; renderPractice(); reveal(P); }
   534	// 填了字但不是整數、或還有格子沒填：講清楚，不算答錯
   535	function formCheck(fs){
   536	  if (fs.some(function(f){ return f.bad; })) return {ok:false, countable:false, msg:"只能填整數，例如 2、15。"};
   537	  if (fs.some(function(f){ return f.empty; })) return {ok:false, countable:false, msg:"還有格子沒填。"};
   538	  return null;
   539	}
   540	function renderPractice(){
   541	  if (E.kind === "steps") return choicePractice();
   542	  var P = $("#practice"), p = F.problem(st.idx, st.seed), a = p.a, b = p.b, s = F.solve(a, b);
   543	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   544	  var cur = st.cur, sa = null, sb = null, ea = null, eb = null;
   545	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   546	    '<div class="small muted">連續 3 題「沒看提示、每一格第一次就對」就算學會。看了提示也沒關係，弄懂最重要。</div>' +
   547	    '<div class="prob">' + fr(a) + '<span class="box" id="pbox" role="img" aria-label="空格"></span>' + fr(b) + '</div>' +
   548	    '<div class="prow" id="r1"><div class="qq">① 先約分，變成最簡分數</div><div class="eq"><span class="pair">' + fr(a) + ' = ' + fin("a") + '</span><span class="pair">' + fr(b) + ' = ' + fin("b") + '</span></div>' +
   549	    '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div></div>' +
   550	    '<div class="prow" id="r2" hidden></div><div class="prow" id="r3" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   551	  var r1 = $("#r1", P), r2 = $("#r2", P), r3 = $("#r3", P);
   552	  wireRow(r1, function(){
   553	    var ia = readFrac(r1, "a"), ib = readFrac(r1, "b"), form = formCheck([ia, ib]);
   554	    if (form) return form;
   555	    var x = F.checkReduce(a, ia), y = F.checkReduce(b, ib);
   556	    if (x.ok && y.ok) { sa = ia; sb = ib; return {ok:true, msg:"對了：" + F.txt(a) + " = " + F.txt(sa) + "，" + F.txt(b) + " = " + F.txt(sb) + "。", next:row2}; }
   557	    return {ok:false, countable:(!x.ok && x.code !== "empty") || (!y.ok && y.code !== "empty"), msg:(x.ok ? "" : "左邊：" + x.msg) + (!x.ok && !y.ok ? "\n" : "") + (y.ok ? "" : "右邊：" + y.msg)};
   558	  }, [
   559	    function(){ return "從 2、3、5、7、9 開始試：分子和分母都在同一個乘法表裡，就能一起除。" + [a, b].map(function(f){ var q = F.smallestCommon(f); return F.txt(f) + "：" + F.divText(q, f.n) + "、" + F.divText(q, f.d) + "，可以先一起除以 " + q + "。"; }).join(" "); },
   560	    function(){ return [a, b].map(function(f){ var t = F.simplest(f); return F.txt(f) + "：" + f.n + " = " + t.g + " × " + t.n + "、" + f.d + " = " + t.g + " × " + t.d + "，一起除以 " + t.g + "，變成 " + t.n + "/" + t.d + "。"; }).join(" "); }
   561	  ]);
   562	  function row2(){
   563	    r2.hidden = false;
   564	    r2.innerHTML = '<div class="qq">② 再通分，讓分母一樣</div><div class="eq"><span class="pair">' + fr(sa) + ' = ' + fin("c") + '</span><span class="pair">' + fr(sb) + ' = ' + fin("e") + '</span></div>' +
   565	      '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div>';
   566	    wireRow(r2, function(){
   567	      var ia = readFrac(r2, "c"), ib = readFrac(r2, "e"), form = formCheck([ia, ib]);
   568	      if (form) return form;
   569	      var x = F.checkCommon(sa, sb, ia, ib);
   570	      if (x.ok) { ea = ia; eb = ib; return {ok:true, msg:x.msg, next:row3}; }
   571	      return {ok:false, countable:x.code !== "empty", msg:x.msg};
   572	    }, [
   573	      function(){ var ma = [], mb = []; for (var i = 1; i <= s.lcm / sa.d; i++) ma.push(sa.d * i); for (var j = 1; j <= s.lcm / sb.d; j++) mb.push(sb.d * j);
   574	        return "先找 " + sa.d + " 和 " + sb.d + " 的最小公倍數。" + sa.d + " 的倍數：" + ma.join("、") + "…；" + sb.d + " 的倍數：" + mb.join("、") + "…，第一個兩邊都有的就是。"; },
   575	      function(){ return "最小公倍數是 " + s.lcm + "。" + F.txt(sa) + " 的分子分母都乘 " + (s.lcm / sa.d) + " → " + F.txt(s.ea) + "；" + F.txt(sb) + " 的分子分母都乘 " + (s.lcm / sb.d) + " → " + F.txt(s.eb) + "。"; }
   576	    ]);
   577	    reveal(r2);
   578	  }
   579	  function row3(){
   580	    r3.hidden = false;
   581	    r3.innerHTML = '<div class="qq">③ 比大小：' + fr(ea) + ' 和 ' + fr(eb) + '</div><div class="qq">所以 ' + fr(a) + ' ○ ' + fr(b) + '？</div><div class="chips">' +
   582	      SIGNS.map(function(o){ return '<button type="button" class="chip sign" data-s="' + esc(o.value) + '">' + o.label + '</button>'; }).join("") + '</div><div class="fb" hidden></div>';
   583	    var out = $(".fb", r3), bs = r3.querySelectorAll(".chip");
   584	    var g0 = GEN;
   585	    var g1 = GEN;
   586	  each(bs, function(bt){ bt.onclick = function(){
   587	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分（st.cur 換掉）或已切走：舊 handler 失效，不重複計分
   588	      if (g0 !== GEN) return;
   589	      var r = F.checkSign(a, b, ea, eb, bt.dataset.s);
   590	      if (r.ok) { each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, r.msg); $("#pbox", P).innerHTML = sym(s.sign); $("#pbox", P).classList.add("got"); finish(); }
   591	      else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, r.msg); }
   592	    }; });
   593	    reveal(r3);
   594	  }
   595	  function finish(){
   596	    var clean = cur.hints === 0 && cur.wrongs === 0, was = st.mastered;
   597	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   598	    st.idx++; st.cur = null;   // 做完就換下一題：重開練習不會再算一次同一題（Codex 第 1 輪必修 1）
   599	    if (st.streak >= 3) st.mastered = true;
   600	    st.log.push({t:Date.now(), a:F.txt(a), b:F.txt(b), clean:clean, hints:cur.hints, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   601	    var saved = save();
   602	    var PE = $("#pend", P); PE.hidden = false;
   603	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 3 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   604	      '<div class="fb ok">' + (clean ? "完全自己做對！連續 " + st.streak + " 題。" : "做完了！" + (cur.hints ? "這題看了提示，" : "這題有改過答案，") + "下一題試試不看提示。") + '</div>') +
   605	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   606	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   607	    $("#nextQ", PE).onclick = function(){ renderPractice(); reveal(P); };
   608	    $("#toLesson", PE).onclick = function(){ startLesson(); };
   609	    drawTopBtns(); drawRec(); reveal(PE);
   610	  }
   611	  function wireRow(row, check, hints){
   612	    var out = $(".fb", row), hb = $(".hint", row), lvl = 0;
   613	    var gg = GEN;
   614	  function go(){
   615	    if (gg !== GEN) return;
   616	      var r = check();
   617	      if (r.ok) { lock(row); fb(out, true, r.msg); r.next(); }
   618	      else { if (r.countable) { cur.wrongs++; save(); } fb(out, false, r.msg); }
   619	    }
   620	    $("button[data-check]", row).onclick = go;
   621	    $("button[data-hint]", row).onclick = function(){
   622	      cur.hints++; save(); hb.hidden = false; hb.textContent = hints[Math.min(lvl, hints.length - 1)](); lvl++;
   623	      if (lvl >= hints.length) this.disabled = true;
   624	    };
   625	    each(row.querySelectorAll("input"), function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
   626	  }
   627	}
   628	
   629	// ---------- 首頁按鈕、紀錄、影片 ----------
   630	function drawTopBtns(){
   631	  var T = $("#topBtns");
   632	  if (!WRITER) { T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">' + esc(READONLY_MSG) + '</div>'; $("#mastery").hidden = true; return; }
   633	  if (!READY) {   // 讀不到原有紀錄：不給作答（Codex 第 5 輪必修 1），給「再讀一次」
   634	    T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">這台裝置的練習紀錄暫時讀不到，為了不把以前的紀錄蓋掉，先不開始練習。</div><button class="btn" type="button" id="readRetry">再讀一次</button>';
   635	    $("#readRetry").onclick = retryRead; $("#mastery").hidden = true; return;
   636	  }
   637	  T.innerHTML = st.lessonDone ?
   638	    '<button class="btn" type="button" id="goPractice">' + (st.solved ? "繼續練習（第 " + (st.idx + 1) + " 題）" : "換你自己做練習題") + '</button><button class="btn ghost" type="button" id="goLesson">再看一次教學</button>' :
   639	    '<button class="btn" type="button" id="goLesson">開始學</button><button class="btn ghost" type="button" id="goPractice">我已經會了，直接練習</button>';
   640	  $("#goLesson").onclick = startLesson;
   641	  $("#goPractice").onclick = openPractice;
   642	  if (E.kind === "steps" && !(E.practice || []).length) $("#goPractice").remove();
   643	  var M = $("#mastery");
   644	  M.hidden = !st.mastered;
   645	  if (st.mastered) M.innerHTML = '<div class="win"><b class="t">這種題你已經會了</b><span>連續 ' + need() + ' 題自己做對。想多練可以繼續做。</span></div>';
   646	}
   647	function drawRec(){
   648	  if (!E || !st) return;
   649	  $("#rec").textContent = st.solved ? "這台裝置上的練習紀錄：做完 " + st.solved + " 題，其中 " + st.clean + " 題沒看提示、一次就對；目前連續 " + st.streak + " 題。" + (st.mastered ? "已達「連續 " + need() + " 題自己做對」。" : "") : "這台裝置上還沒有練習紀錄。";
   650	}
   651	function drawVids(){
   652	  var VIDS = E.videos || [];
   653	  $("#vidBox").hidden = !VIDS.length; $("#vids").innerHTML = "";
   654	  if (!VIDS.length) return;
   655	  $("#vidBox").hidden = false;
   656	  $("#vids").innerHTML = VIDS.map(function(v, i){ return '<div style="display:grid;gap:6px"><b>' + esc(v.title) + '</b><span class="small muted">' + esc(v.note) + '</span><div class="row"><button class="btn ghost sm" type="button" data-v="' + i + '">播放（' + esc(v.len) + '）</button></div><div class="vslot"></div></div>'; }).join("");
   657	  each($("#vids").querySelectorAll("button[data-v]"), function(b){ b.onclick = function(){
   658	    var v = VIDS[+b.dataset.v], slot = b.parentNode.nextElementSibling;
   659	    slot.innerHTML = '<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?rel=0&playsinline=1&autoplay=1&start=' + v.start + (v.end ? '&end=' + v.end : '') + '" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
   660	    b.disabled = true;
   661	  }; });
   662	}
   663	
   664	// ---------- 通用格式 steps（任何科目）：分步解說＋確認題＋答案＋同型練習 ----------
   665	function stepsLesson(){
   666	  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false;
   667	  var i = 0;
   668	  function next(){
   669	    if (i >= E.steps.length) return stepsEnd();
   670	    var s = E.steps[i], b = stepCard(++i, s.title);
   671	    add(b, '<p>' + s.say + '</p>' + (s.fig ? '<div class="pic">' + s.fig + '</div>' : ''));
   672	    if (s.check) chipsAsk(b, s.check.q, s.check.opts.map(function(o, k){ return {label:esc(o), value:k}; }), function(v){
   673	      return v === s.check.a ? {ok:true, msg:s.check.ok || "對了！"} : {ok:false, msg:(s.check.why && s.check.why[v]) || "再想想看。"};
   674	    }, next);
   675	    else { var r = add(b, '<div class="row"><button class="btn sm" type="button" data-next>我懂了，下一步</button></div>'), g = GEN; $("button", r).onclick = function(){ if (g !== GEN) return; this.disabled = true; next(); }; }
   676	  }
   677	  next();
   678	}
   679	function stepsEnd(){
   680	  var b = stepCard(E.steps.length + 1, "答案");
   681	  add(b, '<div class="note" style="font-size:20px">' + E.answer + '</div>' + (E.write ? '<p>寫在考卷上的樣子：</p><div class="note" style="font-size:20px">' + E.write + '</div>' : ''));
   682	  st.lessonDone = true; save(); drawTopBtns();
   683	  if ((E.practice || []).length) { var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做</button></div>'); $("#toPractice", go).onclick = openPractice; }
   684	}
   685	function choicePractice(){
   686	  var P = $("#practice"), list = E.practice, q = list[st.idx % list.length];
   687	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   688	  var cur = st.cur;
   689	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   690	    '<div class="small muted">連續 ' + need() + ' 題第一次就選對，就算學會。</div><div class="qtext">' + q.q + '</div><div class="chips">' +
   691	    q.opts.map(function(o, k){ return '<button type="button" class="chip" data-k="' + k + '">' + esc(o) + '</button>'; }).join("") + '</div><div class="fb" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   692	  var out = $(".fb", P), bs = P.querySelectorAll(".chip");
   693	  var g1 = GEN;
   694	  each(bs, function(bt){ bt.onclick = function(){
   695	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分或已切走：舊 handler 失效，不重複計分
   696	    var k = +bt.dataset.k;
   697	    if (k !== q.a) { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, (q.why && q.why[k]) || "再想想看。"); return; }
   698	    each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, q.ok || "對了！");
   699	    var clean = cur.wrongs === 0, was = st.mastered;
   700	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   701	    st.idx++; st.cur = null;
   702	    if (st.streak >= need()) st.mastered = true;
   703	    st.log.push({t:Date.now(), q:st.idx - 1, clean:clean, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   704	    var saved = save(), PE = $("#pend", P); PE.hidden = false;
   705	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 ' + need() + ' 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   706	      '<div class="fb ok">' + (clean ? "第一次就選對！連續 " + st.streak + " 題。" : "做完了！這題有改過答案，下一題試試一次選對。") + '</div>') +
   707	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   708	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   709	    $("#nextQ", PE).onclick = function(){ choicePractice(); reveal(P); };
   710	    $("#toLesson", PE).onclick = function(){ startLesson(); };
   711	    drawTopBtns(); drawRec(); reveal(PE);
   712	  }; });
   713	}
   714	
   715	// ---------- 首頁（依科目列出每一篇）與切換 ----------
   715	// ---------- 首頁（依科目列出每一篇）與切換 ----------
   716	function statusOf(id){ var s = DB.entries[id]; return !s ? "還沒看" : s.mastered ? "學會了" : s.solved ? "練習中" : s.lessonDone ? "教學看完了" : "還沒看"; }
   717	function drawHome(){
   718	  $("#subjects").innerHTML = H.SUBJECTS.map(function(sj){
   719	    var es = H.LIST.filter(function(e){ return e.subject === sj; }).slice().reverse();
   720	    return '<section class="subj" data-subj="' + sj + '"><div class="sect-t">' + sj + '</div>' + (es.length ? '<div class="hlist">' + es.map(function(e){
   721	      var t = statusOf(e.id);
   722	      return '<a class="hcard" href="#h/' + e.id + '"><b>' + esc(e.title) + '</b><span class="meta">' + esc(e.source) + (e.tag ? "・" + esc(e.tag) : "") + '・' + e.date.slice(5).replace("-", "/") + '</span><span class="st' + (t === "學會了" ? " done" : "") + '">' + t + '</span></a>';
   723	    }).join("") + '</div>' : '<span class="empty">還沒有題目。</span>') + '</section>';
   724	  }).join("");
   725	}
   726	function countdown(){
   727	  var d = new Date(Date.now() + 8 * 3600000), today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), left = Math.round((Date.UTC(2026, 10, 5) - today) / 86400000);
   728	  $("#cd").textContent = left >= 0 ? "・期中考 11/5 還有 " + left + " 天" : "";
   729	}
   730	function openEntry(e){
   731	  GEN++; E = e; st = stateOf(e.id);
   732	  $("#home").hidden = true; $("#entry").hidden = false;
   733	  $("#lesson").innerHTML = ""; $("#lesson").hidden = true; $("#practice").innerHTML = ""; $("#practice").hidden = true;
   734	  $("#src").textContent = e.source + "（" + e.subject + "）" + (e.ask ? "：" + e.ask : "");
   735	  if (e.kind === "frac-compare") { A = e.a; B = e.b; SOL = F.solve(A, B); drawProb(); }
   736	  else $("#prob").innerHTML = '<div class="qtext">' + e.question + '</div>';
   737	  $("#lead").textContent = e.lead || "跟著下面一步一步做，每一步都要你自己想一想、選一選。";
   738	  $("#parentText").innerHTML = e.parent || "";
   739	  document.title = e.title + "｜五年級難題解說";
   740	  drawTopBtns(); drawRec(); drawVids(); window.scrollTo(0, 0);
   741	  if (NOTICE) { $("#lead").textContent = NOTICE; NOTICE = ""; }
   742	}
   743	function route(){
   744	  var m = /^#h\/([\w-]+)$/.exec(location.hash), e = m && H.get(m[1]);
   745	  if (e) return openEntry(e);
   746	  GEN++; E = null; st = null; document.title = "五年級難題解說";
   747	  $("#vids").innerHTML = ""; $("#vidBox").hidden = true;   // 回首頁就關掉影片（Codex 建議 7）
   748	  $("#entry").hidden = true; $("#home").hidden = false; drawHome();
   749	}
   750	$("#saveRetry").onclick = function(){ save(); };
   751	$("#backHome").onclick = function(ev){ ev.preventDefault(); location.hash = ""; route(); };
   752	window.addEventListener("hashchange", route);
   753	// 同一時間只讓一個分頁練習與寫入（Web Locks；Codex 2026-10-13 設計者方案 B）。
   754	// 拿不到鎖＝另一個分頁在練：這頁唯讀；等那頁關掉、鎖釋放後自動重新載入接手（重讀最新紀錄）。
   755	var READONLY_MSG = "這個網站已經在另一個分頁（或視窗）開著了，請回到那個分頁練習；那邊關掉後，這一頁會自動接手。";
   756	function start(){ countdown(); route(); window.dispatchEvent(new Event("g5help-ready")); }
   757	if (navigator.locks && navigator.locks.request) {
   758	  var lockFail = function(){ WRITER = false; READONLY_MSG = "這一頁拿不到存檔的權限（瀏覽器拒絕），只能看不能練；請重新整理或換瀏覽器。"; start(); };
   759	  navigator.locks.request("g5help-writer", {ifAvailable: true}, function(lock){
   760	    if (!lock) {
   761	      WRITER = false; start();
   762	      navigator.locks.request("g5help-writer", function(){ location.reload(); return new Promise(function(){}); }).catch(function(){});
   763	      return;
   764	    }
   765	    WRITER = true; DB = loadDB(); READY = DB.readOk; start();
   766	    return new Promise(function(){});   // 整個頁面存活期間都持有
   767	  }).catch(lockFail);
   768	} else {
   769	  READONLY_MSG = "這個瀏覽器太舊，不能安全存練習紀錄；請更新 iPad／瀏覽器後再練習。";
   770	  WRITER = false; start();
   771	}
   772	window.G5HelpWriter = function(){ return WRITER; };
   773	window.G5HelpDirty = function(){ return dirtyCount(); };
   774	window.G5HelpCanReplace = canReplace;
   775	window.G5HelpApplyRemote = applyRemote;
   776	window.G5HelpPage = {state:function(id){ return JSON.parse(JSON.stringify(DB.entries[id] || null)); }};
   777	})();
   778	</script>
   779	<script>
   780	// 跨裝置同步（家庭同步碼）：只同步本站自己的 g5help.v1；同步碼存在同網域 localStorage，自然站連過也算
   781	(function(){
   782	  if (!window.G5Sync) return;   // sync.js 載不到就照常本機使用
   783	  function boot(){ if (!(window.G5HelpWriter && window.G5HelpWriter())) { var c = document.getElementById("g5sync"); if (c) c.textContent = "（在另一個分頁開著，同步由那一頁負責）"; return; }
   784	  window.G5Sync.init({
   785	    endpoint: "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec",
   786	    keys: ["g5help.v1"], container: "#g5sync",
   787	    summarize: {"g5help.v1": function(j){ try { var x = JSON.parse(j), n = 0, m = 0; Object.keys(x.entries || {}).forEach(function(k){ n += x.entries[k].solved || 0; if (x.entries[k].mastered) m++; }); return "練習做完 " + n + " 題、學會 " + m + " 篇"; } catch (e) { return "（讀不懂的紀錄）"; } }},
   788	    // 雲端版本只能經由本頁套用（首頁、沒有未存進度時），不 reload（#1303 第 5 輪必修 2）
   789	    canReplace: function(key){ return window.G5HelpCanReplace(key); },
   790	    accept: function(key, data){ return window.G5HelpApplyRemote(key, data); }
   791	  }); }
   792	  window.addEventListener("g5help-ready", boot, {once: true});
   793	})();
   794	</script>
   795	<script>
   796	// 家長傳題目：照片在這台裝置先縮小（長邊 1600px、JPEG），送到家裡自己的 GAS（gas/inbox.js）；只有已開啟跨裝置同步的裝置能送
   797	(function(){
   798	  var EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec", $ = function(s){ return document.querySelector(s); };
   799	  $("#upSubj").innerHTML = ["國語","數學","自然","社會","英文","其他"].map(function(x){ return '<option>' + x + '</option>'; }).join("");

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "nl -ba src/sync.js | sed -n '126,340p'; nl -ba tests/sync.test.js | sed -n '1,115p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   126	    function observe(key, data) {
   127	      var hash = contentHash(data);
   128	      if (!observed[key] || observed[key].hash !== hash) { observed[key] = {hash: hash, detected: now()}; }
   129	      return observed[key];
   130	    }
   131	    function backup(key, data) {
   132	      if (data === null) { return; }
   133	      var prefix = 'g5sync.backup.' + key + '.';
   134	      var names = [];
   135	      for (var i = 0; i < storage.length; i += 1) {
   136	        var name = storage.key(i);
   137	        if (name && name.indexOf(prefix) === 0 && /^\d+$/.test(name.slice(prefix.length))) { names.push(name); }
   138	      }
   139	      names.sort(function (a, b) { return Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)); });
   140	      var stamp = Math.max(now(), names.length ? Number(names[names.length - 1].slice(prefix.length)) + 1 : 0);
   141	      // Write before pruning: quota errors must NEVER discard progress or its last backup.
   142	      var target = prefix + stamp;
   143	      write(target, data);
   144	      if (read(target) !== data) { throw error('storage'); }
   145	      names.push(target);
   146	      while (names.length > 3) { storage.removeItem(names.shift()); }
   147	    }
   148	    function summary(key, data) {
   149	      if (data === null) { return '沒有進度紀錄'; }
   150	      try {
   151	        if (options.summarize && typeof options.summarize[key] === 'function') { return String(options.summarize[key](data)); }
   152	      } catch (ignore) { /* Summary errors cannot prevent reconciliation. */ }
   153	      return '完整紀錄，共 ' + data.length + ' 字元';
   154	    }
   155	    function el(tag, className, text) {
   156	      var node = doc.createElement(tag);
   157	      node.className = 'g5s-' + className;
   158	      if (typeof text !== 'undefined') { node.textContent = text; }
   159	      return node;
   160	    }
   161	    function button(text, fn) {
   162	      var b = el('button', 'button', text);
   163	      b.type = 'button'; b.style.minHeight = '44px';
   164	      b.addEventListener('click', fn);
   165	      return b;
   166	    }
   167	    function link() {
   168	      var href = root.location ? root.location.href : '';
   169	      return href.split('#')[0] + '#sync=' + (code || '');
   170	    }
   171	    function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }
   172	    function buildView() {
   173	      clear(container);
   174	      var panel = el('section', 'panel');
   175	      panel.setAttribute('aria-label', '家庭跨裝置同步');
   176	      view = {panel: panel};
   177	      if (!code) {
   178	        panel.appendChild(button('開啟跨裝置同步（這台是第一台）', function () { enable(); }));
   179	        panel.appendChild(button('輸入同步碼（已在別台開過）', function () {
   180	          view.join.hidden = false; view.input.focus();
   181	        }));
   182	        var form = el('form', 'join'); form.hidden = true;
   183	        var label = el('label', 'label', '同步碼');
   184	        var input = el('input', 'input'); input.type = 'text'; input.maxLength = 80;
   185	        input.autocomplete = 'off'; input.spellcheck = false; input.style.minHeight = '44px';
   186	        input.setAttribute('autocapitalize', 'characters'); input.setAttribute('aria-label', '同步碼');
   187	        label.appendChild(input); form.appendChild(label);
   188	        form.appendChild(el('p', 'hint', BAD_CODE));
   189	        form.appendChild(button('加入同步', function () { join(input.value); }));
   190	        form.addEventListener('submit', function (event) { event.preventDefault(); join(input.value); });
   191	        panel.appendChild(form); view.join = form; view.input = input;
   192	      } else {
   193	        panel.appendChild(el('p', 'code', code.match(/.{4}/g).join('-')));
   194	        var qrBox = el('div', 'qr');
   195	        qrBox.setAttribute('aria-label', '掃描 QR code 加入同步');
   196	        try {
   197	          if (typeof root.qrcode !== 'function') { throw error('qr'); }
   198	          var qr = root.qrcode(0, 'M'); qr.addData(link()); qr.make();
   199	          qrBox.innerHTML = qr.createSvgTag({cellSize: 4, margin: 16, scalable: true});
   200	          qrBox.style.maxWidth = '256px';
   201	        } catch (qrError) { qrBox.textContent = 'QR code 無法顯示，請使用下方連結或同步碼。'; }
   202	        panel.appendChild(qrBox);
   203	        var share = el('input', 'link'); share.type = 'text'; share.readOnly = true;
   204	        share.value = link(); share.setAttribute('aria-label', '同步連結'); share.style.minHeight = '44px';
   205	        panel.appendChild(share);
   206	        panel.appendChild(button('複製連結', function () {
   207	          var clipboard = root.navigator && root.navigator.clipboard;
   208	          if (clipboard && clipboard.writeText) {
   209	            Promise.resolve().then(function () { return clipboard.writeText(link()); }).then(function () {
   210	              notice = '連結已複製。'; render();
   211	            }, function () { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); });
   212	          } else { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); }
   213	        }));
   214	        panel.appendChild(button('這台停止同步', function () { stop(); }));
   215	      }
   216	      view.status = el('p', 'status'); view.status.setAttribute('role', 'status'); view.status.setAttribute('aria-live', 'polite');
   217	      view.notice = el('p', 'notice'); view.notice.setAttribute('role', 'alert');
   218	      view.conflicts = el('div', 'conflicts');
   219	      panel.appendChild(view.status); panel.appendChild(view.notice); panel.appendChild(view.conflicts);
   220	      container.appendChild(panel); viewCode = code;
   221	    }
   222	    function render() {
   223	      if (destroyed) { return; }
   224	      if (viewCode !== code || !view.panel) { buildView(); }
   225	      view.status.textContent = status; view.notice.textContent = notice;
   226	      var signature = keys.map(function (key) {
   227	        if (!conflicts[key]) { return ''; }
   228	        var local = read(key);
   229	        return key + ':' + conflicts[key].rev + ':' + observe(key, local).hash + ':' + (decisions[key] || '');
   230	      }).join('|');
   231	      if (view.signature === signature) { return; }
   232	      view.signature = signature;
   233	      clear(view.conflicts);
   234	      keys.forEach(function (key) {
   235	        var cloud = conflicts[key];
   236	        if (!cloud) { return; }
   237	        var local = read(key), obs = observe(key, local);
   238	        var box = el('section', 'conflict');
   239	        box.appendChild(el('h3', 'conflict-title', key + '：請選擇保留哪份完整紀錄'));
   240	        box.appendChild(el('p', 'local-summary', '這台：' + summary(key, local)));
   241	        box.appendChild(el('p', 'local-time', '本機變更偵測時間：' + taipei(obs.detected, true) + '；實際作答時間由各站紀錄提供。'));
   242	        box.appendChild(el('p', 'cloud-summary', '雲端：' + summary(key, cloud.data)));
   243	        box.appendChild(el('p', 'cloud-time', '雲端更新時間：' + taipei(cloud.updated, true)));
   244	        var keepLocal = button('留這台的', function () { resolve(key, 'local'); }); keepLocal.disabled = local === null || !!decisions[key];
   245	        var keepCloud = button('留雲端的', function () { resolve(key, 'cloud'); }); keepCloud.disabled = cloud.data === null || !!decisions[key];
   246	        box.appendChild(keepLocal); box.appendChild(keepCloud); view.conflicts.appendChild(box);
   247	      });
   248	    }
   249	    function validSnapshot(r) {
   250	      return r && integer(r.rev) && (r.rev === 0 ? r.data === null && r.updated === null :
   251	        typeof r.data === 'string' && r.data.length <= 900000 && integer(r.updated));
   252	    }
   253	    function request(req, token) {
   254	      assertActive(token);
   255	      if (!options.endpoint || typeof fetcher !== 'function') { return Promise.reject(error('server')); }
   256	      if (root.navigator && root.navigator.onLine === false) { return Promise.reject(error('offline')); }
   257	      req.code = code;
   258	      return new Promise(function (done, reject) {
   259	        var settled = false;
   260	        var controller = root.AbortController ? new root.AbortController() : null;
   261	        activeAbort = controller;
   262	        var timeout = root.setTimeout(function () {
   263	          if (controller) { controller.abort(); }
   264	          finish(error('offline'));
   265	        }, 15000);
   266	        function finish(err, value) {
   267	          if (settled) { return; }
   268	          settled = true; root.clearTimeout(timeout);
   269	          if (activeAbort === controller) { activeAbort = null; }
   270	          if (err) { reject(err); } else { done(value); }
   271	        }
   272	        var config = {method: 'POST', headers: {'Content-Type': 'text/plain'}, body: JSON.stringify(req),
   273	          mode: 'cors', credentials: 'omit', redirect: 'follow', cache: 'no-store'};
   274	        if (controller) { config.signal = controller.signal; }
   275	        Promise.resolve().then(function () { return fetcher(options.endpoint, config); }).then(function (response) {
   276	          assertActive(token);
   277	          if (!response || response.ok === false || typeof response.json !== 'function') { throw error('server'); }
   278	          return Promise.resolve().then(function () { return response.json(); }).catch(function () { throw error('server'); });
   279	        }, function () { throw error('offline'); }).then(function (r) {
   280	          assertActive(token);
   281	          if (!r || (r.ok !== true && r.ok !== false)) { throw error('server'); }
   282	          if (req.op === 'get' && r.ok !== true) { throw error('server'); }
   283	          if (r.ok === false && r.err !== 'conflict') { throw error(r.err === 'too-big' ? 'too-big' : 'server'); }
   284	          if ((req.op === 'get' || r.err === 'conflict') && !validSnapshot(r)) { throw error('server'); }
   285	          if (req.op === 'put' && r.ok && (!integer(r.rev) || r.rev !== req.rev + 1 || !integer(r.updated))) { throw error('server'); }
   286	          finish(null, r);
   287	        }).catch(function (err) { finish(err); });
   288	      });
   289	    }
   290	    function showConflict(key, cloud) {
   291	      delete decisions[key]; // A newly observed cloud version requires a new choice.
   292	      conflicts[key] = {rev: cloud.rev, data: cloud.data, updated: cloud.updated};
   293	      status = '有兩份進度，請選擇要保留的紀錄。';
   294	      render();
   295	    }
   296	    function replaceLocal(key, cloud, token) {
   297	      assertActive(token);
   298	      if (cloud.data === null) { throw error('server'); }
   299	      var currentMeta = baseline(key);
   300	      if (currentMeta && currentMeta.rev > cloud.rev) { showConflict(key, cloud); return; }
   301	      // 頁面自己是唯一寫入者時（難題站，#1303 第 5 輪）：先問能不能換（有未存進度、正在某一篇裡就不行），
   302	      // 不行就什麼都不動（不備份、不寫），下一輪再 GET 再問；可以才備份，並交給頁面自己寫入與重畫（不 reload）。
   303	      if (typeof options.canReplace === 'function' && !options.canReplace(key)) {
   304	        needsGet[key] = true; deferred[key] = true; return;
   305	      }
   306	      var local = read(key);
   307	      backup(key, local);
   308	      assertActive(token);
   309	      // Synchronous read/backup/write; no awaited work between decision and replacement.
   310	      if (typeof options.accept === 'function') {
   311	        if (!options.accept(key, cloud.data)) { needsGet[key] = true; deferred[key] = true; return; }
   312	      } else { write(key, cloud.data); }
   313	      if (read(key) !== cloud.data) { throw error('storage'); }
   314	      delete deferred[key];
   315	      replaced.push(key); // Notify even if persisting the following metadata fails.
   316	      saveBaseline(key, cloud.rev, cloud.data, cloud.updated);
   317	      delete conflicts[key];
   318	    }
   319	    function put(key, data, rev, token, chosenCloud) {
   320	      if (data === null) { return Promise.resolve(); }
   321	      if (data.length > 900000) { return Promise.reject(error('too-big')); }
   322	      if (chosenCloud) { backup(key, chosenCloud.data); }
   323	      return request({op: 'put', key: key, rev: rev, data: data}, token).then(function (r) {
   324	        assertActive(token);
   325	        if (r.err === 'conflict') { showConflict(key, r); return; }
   326	        // The baseline is the exact request payload, never a newer local edit.
   327	        saveBaseline(key, r.rev, data, r.updated);
   328	        delete conflicts[key];
   329	      });
   330	    }
   331	    function reconcile(key, cloud, token) {
   332	      assertActive(token);
   333	      var local = read(key), meta = baseline(key), hash = observe(key, local).hash;
   334	      needsGet[key] = false;
   335	      if (cloud.rev === 0) {
   336	        if (local !== null) { return put(key, local, 0, token); }
   337	        saveBaseline(key, 0, null, null); return;
   338	      }
   339	      if (!meta) {
   340	        if (local === null) { replaceLocal(key, cloud, token); }
     1	'use strict';
     2	const test = require('node:test');
     3	const assert = require('node:assert/strict');
     4	const crypto = require('node:crypto');
     5	const G5Sync = require('../src/sync');
     6	const {Storage, Clock, Document, server, device, flush, byClass, descendants, click} = require('./harness');
     7	const KEY = 'g5sci.v3', CODE = 'ABCDEFGHJKMN';
     8	const data = n => JSON.stringify({n});
     9	function backups(d, key = KEY) { return Object.entries(d.storage.dump()).filter(([name]) => name.startsWith('g5sync.backup.' + key + '.')); }
    10	async function pair(t) {
    11	  const clock = new Clock(), backend = server(clock);
    12	  const a = device(backend, {initial: {[KEY]: data(1)}});
    13	  const b = device(backend);
    14	  t.after(() => { a.api.destroy(); b.api.destroy(); });
    15	  await Promise.all([a.api.ready, b.api.ready]); await a.api.enable();
    16	  const code = a.api.getState().code; await b.api.join(code);
    17	  return {clock, backend, a, b, code};
    18	}
    19	
    20	test('S01 A1 first-device enable and empty second-device join preserve the exact document', async t => {
    21	  const {backend, a, b, code} = await pair(t);
    22	  assert.equal(backend.store.record(code).rev, 1); assert.equal(backend.store.rows.size, 1);
    23	  assert.equal(backend.store.record(code).data, a.storage.getItem(KEY));
    24	  assert.equal(b.storage.getItem(KEY), data(1)); assert.deepEqual(b.replacements, [KEY]);
    25	  assert.equal(JSON.parse(b.storage.getItem('g5sync.meta')).keys[KEY].rev, 1);
    26	  assert.equal(b.api.getState().status, '已同步 08:00');
    27	  assert.match(code, /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/);
    28	});
    29	
    30	test('S02 A2 polling uploads at 4000ms and reopening the first device downloads with backup', async t => {
    31	  const {clock, backend, a, b, code} = await pair(t);
    32	  b.storage.setItem(KEY, data(12));
    33	  await clock.advance(3999); assert.equal(backend.store.record(code).rev, 1);
    34	  await clock.advance(1); assert.equal(backend.store.record(code).rev, 2); assert.equal(backend.store.record(code).data, data(12));
    35	  a.api.destroy(); const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy());
    36	  await reopen.api.ready;
    37	  assert.equal(reopen.storage.getItem(KEY), data(12)); assert.deepEqual(reopen.replacements, [KEY]);
    38	  assert.equal(backups(reopen)[0][1], data(1));
    39	});
    40	
    41	test('S03 A3 competing edits show summaries; keep local backs up cloud and uses cloud revision', async t => {
    42	  const {backend, a, b, code} = await pair(t);
    43	  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20));
    44	  await a.api.sync(); await b.api.sync();
    45	  assert.equal(backend.store.record(code).data, data(10)); assert.equal(b.api.getState().conflicts[KEY].rev, 2);
    46	  assert.equal(byClass(b, 'local-summary')[0].textContent, '這台：練過 20 題');
    47	  assert.equal(byClass(b, 'cloud-summary')[0].textContent, '雲端：練過 10 題');
    48	  assert.match(byClass(b, 'cloud-time')[0].textContent, /2026\/10\/13 08:00（台北時間）/);
    49	  const count = b.calls.length; await b.api.sync(); assert.equal(b.calls.length, count);
    50	  click(b, '留這台的'); await flush();
    51	  assert.equal(backend.store.record(code).data, data(20)); assert.equal(backend.store.record(code).rev, 3);
    52	  assert.equal(backups(b)[0][1], data(10)); assert.equal(Object.keys(b.api.getState().conflicts).length, 0);
    53	  a.api.destroy(); const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
    54	  assert.equal(reopen.storage.getItem(KEY), data(20)); assert.equal(backups(reopen)[0][1], data(10));
    55	});
    56	
    57	test('S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document', async t => {
    58	  const {backend, a, b} = await pair(t);
    59	  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20));
    60	  await a.api.sync(); await b.api.sync(); await b.api.resolve(KEY, 'local');
    61	  a.storage.setItem(KEY, data(11)); a.api.destroy();
    62	  const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
    63	  assert.equal(reopen.storage.getItem(KEY), data(11)); assert.ok(reopen.api.getState().conflicts[KEY]);
    64	  click(reopen, '留雲端的'); await flush();
    65	  assert.equal(reopen.storage.getItem(KEY), data(20)); assert.equal(backups(reopen)[0][1], data(11));
    66	  assert.deepEqual(reopen.replacements, [KEY]);
    67	});
    68	
    69	test('S05 A4 joining with two documents always prompts, even if they are byte-identical', async t => {
    70	  for (const local of [data(1), data(99)]) {
    71	    const clock = new Clock(), backend = server(clock);
    72	    backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
    73	    const d = device(backend, {initial: {[KEY]: local}}); t.after(() => d.api.destroy()); await d.api.ready;
    74	    await d.api.join(CODE);
    75	    assert.ok(d.api.getState().conflicts[KEY]); assert.equal(d.storage.getItem(KEY), local);
    76	    assert.equal(backend.store.record(CODE).rev, 1); assert.equal(d.calls.filter(c => c.req.op === 'put').length, 0);
    77	    assert.deepEqual(d.replacements, []);
    78	  }
    79	});
    80	
    81	for (const mode of ['offline', 'reject', 'html', 'server', 'http']) {
    82	  test('S06 A5 failure=' + mode + ' preserves local progress and retries automatically', async t => {
    83	    const {clock, backend, b, code} = await pair(t);
    84	    b.storage.setItem(KEY, data(31));
    85	    if (mode === 'offline') b.window.navigator.onLine = false; else b.mode = mode;
    86	    const before = b.storage.getItem(KEY); await b.api.sync();
    87	    assert.equal(b.storage.getItem(KEY), before); assert.equal(backend.store.record(code).rev, 1);
    88	    const expected = ['offline', 'reject'].includes(mode) ? '離線中，連上網路會自動補上' : '同步失敗，稍後自動再試';
    89	    assert.equal(b.api.getState().status, expected); assert.equal(byClass(b, 'status')[0].textContent, expected);
    90	    b.mode = 'ok'; b.window.navigator.onLine = true;
    91	    await clock.advance(4000);
    92	    assert.equal(backend.store.record(code).data, before); assert.equal(backend.store.record(code).rev, 2);
    93	    assert.match(b.api.getState().status, /^已同步 /);
    94	  });
    95	}
    96	
    97	test('S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening', async t => {
    98	  const clock = new Clock(), backend = server(clock);
    99	  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
   100	  const d = device(backend, {initial: {[KEY]: data(2)}, endpoint: ''}); t.after(() => d.api.destroy());
   101	  await d.api.ready; await d.api.join(CODE);
   102	  assert.equal(d.api.getState().status, '同步失敗，稍後自動再試'); assert.equal(d.storage.getItem(KEY), data(2));
   103	  d.api.destroy(); const reopen = device(backend, {storage: d.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
   104	  assert.ok(reopen.api.getState().conflicts[KEY]); assert.equal(backend.store.record(CODE).rev, 1);
   105	});
   106	
   107	test('S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation', async t => {
   108	  const clock = new Clock(), backend = server(clock), d = device(backend, {selector: true}); t.after(() => d.api.destroy());
   109	  await d.api.ready;
   110	  click(d, '輸入同步碼（已在別台開過）');
   111	  const input = byClass(d, 'input')[0];
   112	  for (const bad of '0O1IL') {
   113	    input.value = bad + CODE.slice(1); click(d, '加入同步'); await flush();
   114	    assert.equal(d.storage.getItem('g5sync.code'), null); assert.match(d.api.getState().notice, /不含 0、O、1、I、L/);
   115	  }

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'node --test tests/*.test.js' in /Users/william/Documents/g5-help
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
 succeeded in 478ms:
✔ S01 A1 first-device enable and empty second-device join preserve the exact document (15.712584ms)
✔ S02 A2 polling uploads at 4000ms and reopening the first device downloads with backup (15.224916ms)
✔ S03 A3 competing edits show summaries; keep local backs up cloud and uses cloud revision (14.786375ms)
✔ S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document (15.371458ms)
✔ S05 A4 joining with two documents always prompts, even if they are byte-identical (7.5315ms)
✔ S06 A5 failure=offline preserves local progress and retries automatically (7.833375ms)
✔ S06 A5 failure=reject preserves local progress and retries automatically (8.933042ms)
✔ S06 A5 failure=html preserves local progress and retries automatically (8.108292ms)
✔ S06 A5 failure=server preserves local progress and retries automatically (8.28775ms)
✔ S06 A5 failure=http preserves local progress and retries automatically (7.747542ms)
✔ S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening (7.05125ms)
✔ S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation (5.738792ms)
✔ S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator (3.65025ms)
✔ S10 A6 malformed fragment is still removed and never sent to server (0.505042ms)
✔ S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes (7.561208ms)
✔ S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty (17.475834ms)
✔ S13 multi-key sync serializes requests and preserves metadata belonging to another site (8.20425ms)
✔ S14 visibility hidden and online event immediately attempt pending work (7.386167ms)
✔ S15 backoff is exponential, capped at 60 seconds, and timers do not bypass it (12.270584ms)
✔ S16 edit while put is in flight is not falsely marked synced and is pushed on the next poll (7.565291ms)
✔ S17 edit while startup get is in flight becomes a conflict instead of being overwritten (10.563417ms)
✔ S18 stop during in-flight request cannot restore code/meta or replace local data (11.519791ms)
✔ S19 repeated conflicts keep exactly the three most recent backups, even with a fixed clock (8.510292ms)
✔ S20 quota failure writing a backup blocks replacement and cloud overwrite (7.174834ms)
✔ S21 cloud changes again while conflict is displayed; both choices require a fresh decision (14.685583ms)
✔ S22 invalid server response and malformed metadata never silently overwrite local data (3.448667ms)
✔ S23 button accessibility, text-only summaries and clipboard fallback keep sharing usable (13.074208ms)
✔ S24 first-device secure randomness has no Math.random fallback (4.92675ms)
✔ S25 hanging request times out, releases the queue and later recovers (9.481458ms)
✔ S26 existing empty-string documents, new keys and join with empty cloud upload without parsing or merging (7.069333ms)
✔ S27 a too-large key cannot starve other keys; shrinking it later recovers (125.975875ms)
✔ S28 all downloaded keys are saved before the first replacement callback can reload the page (3.99575ms)
✔ S29 same-origin stop event clears another tab panel and prevents subsequent writes (10.114916ms)
✔ S30 removing a progress key locally does not delete the cloud copy or falsely claim sync (6.79475ms)
✔ S31 a committed put with lost acknowledgement becomes an explicit conflict on retry (11.164834ms)
✔ S32 switching family while a get is in flight ignores the old response and keeps a single request active (6.53425ms)
✔ S33 unresolved join conflict remains a conflict after refreshing the page (7.496791ms)
✔ S34 metadata write failure after downloading still notifies the host about changed local data (3.589292ms)
✔ S35 CommonJS export can initialize directly in Node with injected DOM owner and storage (0.524875ms)
✔ S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice (9.544084ms)
✔ S37 cloud choice retries a failed download and backs up local progress after recovery (7.675875ms)
✔ S30 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入 (11.871541ms)
✔ 時間一律用台北時間顯示 (1.345333ms)
✔ 已送出：33%，顯示最晚幾點前電腦會取回（上次取題＋10 分） (0.131417ms)
✔ 已送出但電腦比預期久沒取：不承諾時間 (0.054417ms)
✔ 製作中：沒有歷史資料先估送出後 40 分；進度依經過時間在 66→95% 間增加 (0.095458ms)
✔ 製作中：用已做好題目的實際耗時中位數估 (0.08975ms)
✔ 超過預估還沒好：95% 封頂、改說比預期久 (0.045166ms)
✔ 做好了：100%；舊資料缺時間欄也不壞 (0.046166ms)
✔ 後端狀態欄：做好時記下完成時間，舊格式 done:網址 仍讀得懂 (1.211208ms)
ℹ tests 80
ℹ suites 0
ℹ pass 80
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 563.71675

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/app.html | sed -n '268,337p'; nl -ba src/app.html | sed -n '638,796p'; sed -n '100,255p' tests/harness.js" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   268	function stateOf(id){ if (!own(DB.entries, id)) DB.entries[id] = fresh(); return DB.entries[id]; }
   269	function dirtyCount(){ return Object.keys(DIRTY).length; }
   270	function backupBroken(raw){
   271	  // 壞資料：用不會撞名的 key 備份並讀回核對；成功才允許之後用新資料覆蓋主 key（不先刪主 key）
   272	  if (BACKED === raw) return true;
   273	  var k = KEY + ".broken." + Date.now() + "." + Math.floor(Math.random() * 1e9);
   274	  try { localStorage.setItem(k, raw); if (localStorage.getItem(k) !== raw) return false; BACKED = raw; return true; } catch (e) { return false; }
   275	}
   276	function saveFailed(){
   277	  // 存不進去：進度留在記憶體（DIRTY），3 秒後自動再試；首頁與各篇都看得到警告（Codex 第 5 輪必修 3）
   278	  if (!RETRY) RETRY = setTimeout(function(){ RETRY = null; if (dirtyCount()) save(); }, 3000);
   279	  drawWarn(); drawRec(); return false;
   280	}
   281	function save(){
   282	  if (!WRITER || !READY) return false;   // 唯讀分頁、還沒讀成功：一律不寫
   283	  if (E && st) DIRTY[E.id] = true;   // 任何失敗出口之前先記下「這篇有沒存好的進度」
   284	  var d = readDisk();
   285	  if (!d.ok) return saveFailed();   // 讀取失敗≠沒有紀錄：不寫，進度留在記憶體
   286	  if (d.broken !== null && !backupBroken(d.broken)) return saveFailed();   // 備份不了就不覆蓋原文
   287	  var out = Object.create(null);
   288	  Object.keys(d.entries).forEach(function(id){ out[id] = d.entries[id]; });   // 磁碟上有、記憶體沒有的篇（例如搬家來的）照留
   289	  Object.keys(DB.entries).forEach(function(id){ out[id] = DB.entries[id]; });   // 記憶體是唯一真相
   290	  try { localStorage.setItem(KEY, JSON.stringify({v:1, entries:out})); } catch (e) { return saveFailed(); }
   291	  Object.keys(out).forEach(function(id){ if (!own(DB.entries, id)) DB.entries[id] = out[id]; });
   292	  DIRTY = Object.create(null);
   293	  if (RETRY) { clearTimeout(RETRY); RETRY = null; }
   294	  drawWarn(); drawRec();
   295	  return true;
   296	}
   297	function drawWarn(){
   298	  var w = $("#saveWarn"); if (!w) return;
   299	  w.hidden = !dirtyCount();
   300	}
   301	// 讀不到原有紀錄時的「再讀一次」：讀成功才開放作答，並接著原紀錄（不會被空白蓋掉）
   302	function retryRead(){
   303	  if (!WRITER) return;
   304	  var d = readDisk();
   305	  if (!d.ok) { NOTICE = "還是讀不到，請稍後再試，或重新整理這一頁。"; route(); return; }
   306	  DB = {v:1, entries:d.entries, readOk:true}; READY = true; route();
   307	}
   308	// 雲端有較新的紀錄：只在首頁、沒有未存進度時換上；換上＝寫進主 key、重畫首頁，不 reload（Codex 第 5 輪必修 2）
   309	function canReplace(key){ return key === KEY && WRITER && READY && !E && !dirtyCount(); }
   310	function applyRemote(key, raw){
   311	  if (!canReplace(key)) return false;
   312	  var es = parseDB(raw); if (!es) return false;
   313	  try { localStorage.setItem(KEY, raw); if (localStorage.getItem(KEY) !== raw) return false; } catch (e) { return false; }
   314	  GEN++; DB = {v:1, entries:es, readOk:true}; drawHome();
   315	  return true;
   316	}
   317	
   318	// ---------- 互動元件 ----------
   319	// iPad 中文鍵盤可能打出全形數字「１５」：先轉半形（Codex 第 1 輪必修 5）。回傳 {empty}、{bad}（不是整數）或 {v}
   320	function parseNum(raw){
   321	  var t = String(raw || "").replace(/[０-９]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }).replace(/\s+/g, "");
   322	  if (!t) return {empty:true};
   323	  if (!/^\d+$/.test(t)) return {bad:true};
   324	  return {v:parseInt(t, 10)};
   325	}
   326	// 選擇題：答錯會說明為什麼，可以再選；答對才往下
   327	function chipsAsk(body, q, opts, judge, onOk, cls){
   328	  var box = add(body, '<div class="ask"><div class="qq">' + q + '</div><div class="chips">' + opts.map(function(o, i){ return '<button type="button" class="chip' + (cls ? " " + cls : "") + '" data-i="' + i + '">' + o.label + '</button>'; }).join("") + '</div><div class="fb" hidden></div></div>');
   329	  var out = $(".fb", box), bs = box.querySelectorAll(".chip");
   330	  var g0 = GEN;
   331	  each(bs, function(b){ b.onclick = function(){
   332	    if (g0 !== GEN) return;
   333	    var o = opts[+b.dataset.i], r = judge(o.value);
   334	    if (r.ok) { each(bs, function(x){ x.disabled = true; }); b.classList.add("picked"); fb(out, true, r.msg || "對了！"); if (onOk) onOk(o.value, r); }
   335	    else { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake", "tried"); fb(out, false, r.msg); }
   336	  }; });
   337	  return box;
   638	    '<button class="btn" type="button" id="goPractice">' + (st.solved ? "繼續練習（第 " + (st.idx + 1) + " 題）" : "換你自己做練習題") + '</button><button class="btn ghost" type="button" id="goLesson">再看一次教學</button>' :
   639	    '<button class="btn" type="button" id="goLesson">開始學</button><button class="btn ghost" type="button" id="goPractice">我已經會了，直接練習</button>';
   640	  $("#goLesson").onclick = startLesson;
   641	  $("#goPractice").onclick = openPractice;
   642	  if (E.kind === "steps" && !(E.practice || []).length) $("#goPractice").remove();
   643	  var M = $("#mastery");
   644	  M.hidden = !st.mastered;
   645	  if (st.mastered) M.innerHTML = '<div class="win"><b class="t">這種題你已經會了</b><span>連續 ' + need() + ' 題自己做對。想多練可以繼續做。</span></div>';
   646	}
   647	function drawRec(){
   648	  if (!E || !st) return;
   649	  $("#rec").textContent = st.solved ? "這台裝置上的練習紀錄：做完 " + st.solved + " 題，其中 " + st.clean + " 題沒看提示、一次就對；目前連續 " + st.streak + " 題。" + (st.mastered ? "已達「連續 " + need() + " 題自己做對」。" : "") : "這台裝置上還沒有練習紀錄。";
   650	}
   651	function drawVids(){
   652	  var VIDS = E.videos || [];
   653	  $("#vidBox").hidden = !VIDS.length; $("#vids").innerHTML = "";
   654	  if (!VIDS.length) return;
   655	  $("#vidBox").hidden = false;
   656	  $("#vids").innerHTML = VIDS.map(function(v, i){ return '<div style="display:grid;gap:6px"><b>' + esc(v.title) + '</b><span class="small muted">' + esc(v.note) + '</span><div class="row"><button class="btn ghost sm" type="button" data-v="' + i + '">播放（' + esc(v.len) + '）</button></div><div class="vslot"></div></div>'; }).join("");
   657	  each($("#vids").querySelectorAll("button[data-v]"), function(b){ b.onclick = function(){
   658	    var v = VIDS[+b.dataset.v], slot = b.parentNode.nextElementSibling;
   659	    slot.innerHTML = '<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?rel=0&playsinline=1&autoplay=1&start=' + v.start + (v.end ? '&end=' + v.end : '') + '" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
   660	    b.disabled = true;
   661	  }; });
   662	}
   663	
   664	// ---------- 通用格式 steps（任何科目）：分步解說＋確認題＋答案＋同型練習 ----------
   665	function stepsLesson(){
   666	  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false;
   667	  var i = 0;
   668	  function next(){
   669	    if (i >= E.steps.length) return stepsEnd();
   670	    var s = E.steps[i], b = stepCard(++i, s.title);
   671	    add(b, '<p>' + s.say + '</p>' + (s.fig ? '<div class="pic">' + s.fig + '</div>' : ''));
   672	    if (s.check) chipsAsk(b, s.check.q, s.check.opts.map(function(o, k){ return {label:esc(o), value:k}; }), function(v){
   673	      return v === s.check.a ? {ok:true, msg:s.check.ok || "對了！"} : {ok:false, msg:(s.check.why && s.check.why[v]) || "再想想看。"};
   674	    }, next);
   675	    else { var r = add(b, '<div class="row"><button class="btn sm" type="button" data-next>我懂了，下一步</button></div>'), g = GEN; $("button", r).onclick = function(){ if (g !== GEN) return; this.disabled = true; next(); }; }
   676	  }
   677	  next();
   678	}
   679	function stepsEnd(){
   680	  var b = stepCard(E.steps.length + 1, "答案");
   681	  add(b, '<div class="note" style="font-size:20px">' + E.answer + '</div>' + (E.write ? '<p>寫在考卷上的樣子：</p><div class="note" style="font-size:20px">' + E.write + '</div>' : ''));
   682	  st.lessonDone = true; save(); drawTopBtns();
   683	  if ((E.practice || []).length) { var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做</button></div>'); $("#toPractice", go).onclick = openPractice; }
   684	}
   685	function choicePractice(){
   686	  var P = $("#practice"), list = E.practice, q = list[st.idx % list.length];
   687	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   688	  var cur = st.cur;
   689	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   690	    '<div class="small muted">連續 ' + need() + ' 題第一次就選對，就算學會。</div><div class="qtext">' + q.q + '</div><div class="chips">' +
   691	    q.opts.map(function(o, k){ return '<button type="button" class="chip" data-k="' + k + '">' + esc(o) + '</button>'; }).join("") + '</div><div class="fb" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   692	  var out = $(".fb", P), bs = P.querySelectorAll(".chip");
   693	  var g1 = GEN;
   694	  each(bs, function(bt){ bt.onclick = function(){
   695	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分或已切走：舊 handler 失效，不重複計分
   696	    var k = +bt.dataset.k;
   697	    if (k !== q.a) { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, (q.why && q.why[k]) || "再想想看。"); return; }
   698	    each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, q.ok || "對了！");
   699	    var clean = cur.wrongs === 0, was = st.mastered;
   700	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   701	    st.idx++; st.cur = null;
   702	    if (st.streak >= need()) st.mastered = true;
   703	    st.log.push({t:Date.now(), q:st.idx - 1, clean:clean, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   704	    var saved = save(), PE = $("#pend", P); PE.hidden = false;
   705	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 ' + need() + ' 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   706	      '<div class="fb ok">' + (clean ? "第一次就選對！連續 " + st.streak + " 題。" : "做完了！這題有改過答案，下一題試試一次選對。") + '</div>') +
   707	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   708	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   709	    $("#nextQ", PE).onclick = function(){ choicePractice(); reveal(P); };
   710	    $("#toLesson", PE).onclick = function(){ startLesson(); };
   711	    drawTopBtns(); drawRec(); reveal(PE);
   712	  }; });
   713	}
   714	
   715	// ---------- 首頁（依科目列出每一篇）與切換 ----------
   716	function statusOf(id){ var s = DB.entries[id]; return !s ? "還沒看" : s.mastered ? "學會了" : s.solved ? "練習中" : s.lessonDone ? "教學看完了" : "還沒看"; }
   717	function drawHome(){
   718	  $("#subjects").innerHTML = H.SUBJECTS.map(function(sj){
   719	    var es = H.LIST.filter(function(e){ return e.subject === sj; }).slice().reverse();
   720	    return '<section class="subj" data-subj="' + sj + '"><div class="sect-t">' + sj + '</div>' + (es.length ? '<div class="hlist">' + es.map(function(e){
   721	      var t = statusOf(e.id);
   722	      return '<a class="hcard" href="#h/' + e.id + '"><b>' + esc(e.title) + '</b><span class="meta">' + esc(e.source) + (e.tag ? "・" + esc(e.tag) : "") + '・' + e.date.slice(5).replace("-", "/") + '</span><span class="st' + (t === "學會了" ? " done" : "") + '">' + t + '</span></a>';
   723	    }).join("") + '</div>' : '<span class="empty">還沒有題目。</span>') + '</section>';
   724	  }).join("");
   725	}
   726	function countdown(){
   727	  var d = new Date(Date.now() + 8 * 3600000), today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), left = Math.round((Date.UTC(2026, 10, 5) - today) / 86400000);
   728	  $("#cd").textContent = left >= 0 ? "・期中考 11/5 還有 " + left + " 天" : "";
   729	}
   730	function openEntry(e){
   731	  GEN++; E = e; st = stateOf(e.id);
   732	  $("#home").hidden = true; $("#entry").hidden = false;
   733	  $("#lesson").innerHTML = ""; $("#lesson").hidden = true; $("#practice").innerHTML = ""; $("#practice").hidden = true;
   734	  $("#src").textContent = e.source + "（" + e.subject + "）" + (e.ask ? "：" + e.ask : "");
   735	  if (e.kind === "frac-compare") { A = e.a; B = e.b; SOL = F.solve(A, B); drawProb(); }
   736	  else $("#prob").innerHTML = '<div class="qtext">' + e.question + '</div>';
   737	  $("#lead").textContent = e.lead || "跟著下面一步一步做，每一步都要你自己想一想、選一選。";
   738	  $("#parentText").innerHTML = e.parent || "";
   739	  document.title = e.title + "｜五年級難題解說";
   740	  drawTopBtns(); drawRec(); drawVids(); window.scrollTo(0, 0);
   741	  if (NOTICE) { $("#lead").textContent = NOTICE; NOTICE = ""; }
   742	}
   743	function route(){
   744	  var m = /^#h\/([\w-]+)$/.exec(location.hash), e = m && H.get(m[1]);
   745	  if (e) return openEntry(e);
   746	  GEN++; E = null; st = null; document.title = "五年級難題解說";
   747	  $("#vids").innerHTML = ""; $("#vidBox").hidden = true;   // 回首頁就關掉影片（Codex 建議 7）
   748	  $("#entry").hidden = true; $("#home").hidden = false; drawHome();
   749	}
   750	$("#saveRetry").onclick = function(){ save(); };
   751	$("#backHome").onclick = function(ev){ ev.preventDefault(); location.hash = ""; route(); };
   752	window.addEventListener("hashchange", route);
   753	// 同一時間只讓一個分頁練習與寫入（Web Locks；Codex 2026-10-13 設計者方案 B）。
   754	// 拿不到鎖＝另一個分頁在練：這頁唯讀；等那頁關掉、鎖釋放後自動重新載入接手（重讀最新紀錄）。
   755	var READONLY_MSG = "這個網站已經在另一個分頁（或視窗）開著了，請回到那個分頁練習；那邊關掉後，這一頁會自動接手。";
   756	function start(){ countdown(); route(); window.dispatchEvent(new Event("g5help-ready")); }
   757	if (navigator.locks && navigator.locks.request) {
   758	  var lockFail = function(){ WRITER = false; READONLY_MSG = "這一頁拿不到存檔的權限（瀏覽器拒絕），只能看不能練；請重新整理或換瀏覽器。"; start(); };
   759	  navigator.locks.request("g5help-writer", {ifAvailable: true}, function(lock){
   760	    if (!lock) {
   761	      WRITER = false; start();
   762	      navigator.locks.request("g5help-writer", function(){ location.reload(); return new Promise(function(){}); }).catch(function(){});
   763	      return;
   764	    }
   765	    WRITER = true; DB = loadDB(); READY = DB.readOk; start();
   766	    return new Promise(function(){});   // 整個頁面存活期間都持有
   767	  }).catch(lockFail);
   768	} else {
   769	  READONLY_MSG = "這個瀏覽器太舊，不能安全存練習紀錄；請更新 iPad／瀏覽器後再練習。";
   770	  WRITER = false; start();
   771	}
   772	window.G5HelpWriter = function(){ return WRITER; };
   773	window.G5HelpDirty = function(){ return dirtyCount(); };
   774	window.G5HelpCanReplace = canReplace;
   775	window.G5HelpApplyRemote = applyRemote;
   776	window.G5HelpPage = {state:function(id){ return JSON.parse(JSON.stringify(DB.entries[id] || null)); }};
   777	})();
   778	</script>
   779	<script>
   780	// 跨裝置同步（家庭同步碼）：只同步本站自己的 g5help.v1；同步碼存在同網域 localStorage，自然站連過也算
   781	(function(){
   782	  if (!window.G5Sync) return;   // sync.js 載不到就照常本機使用
   783	  function boot(){ if (!(window.G5HelpWriter && window.G5HelpWriter())) { var c = document.getElementById("g5sync"); if (c) c.textContent = "（在另一個分頁開著，同步由那一頁負責）"; return; }
   784	  window.G5Sync.init({
   785	    endpoint: "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec",
   786	    keys: ["g5help.v1"], container: "#g5sync",
   787	    summarize: {"g5help.v1": function(j){ try { var x = JSON.parse(j), n = 0, m = 0; Object.keys(x.entries || {}).forEach(function(k){ n += x.entries[k].solved || 0; if (x.entries[k].mastered) m++; }); return "練習做完 " + n + " 題、學會 " + m + " 篇"; } catch (e) { return "（讀不懂的紀錄）"; } }},
   788	    // 雲端版本只能經由本頁套用（首頁、沒有未存進度時），不 reload（#1303 第 5 輪必修 2）
   789	    canReplace: function(key){ return window.G5HelpCanReplace(key); },
   790	    accept: function(key, data){ return window.G5HelpApplyRemote(key, data); }
   791	  }); }
   792	  window.addEventListener("g5help-ready", boot, {once: true});
   793	})();
   794	</script>
   795	<script>
   796	// 家長傳題目：照片在這台裝置先縮小（長邊 1600px、JPEG），送到家裡自己的 GAS（gas/inbox.js）；只有已開啟跨裝置同步的裝置能送
  return {clock, store, handle(req) { return core.handle(store, req, clock.now); }};
}
function device(server, options = {}) {
  const clock = options.clock || server.clock, doc = new Document(), events = new Events();
  const storage = options.storage || new Storage(options.initial);
  let href = options.href || 'https://windsorya.github.io/g5-sci-review/';
  const location = {get href() { return href; }, get hash() { return new URL(href).hash; }};
  const history = {state: {keep: 1}, calls: [], replaceState(state, title, url) { this.calls.push({state, url}); href = url; }};
  const d = {clock, doc, storage, history, calls: [], replacements: [], qrLinks: [], active: 0, maxActive: 0, mode: 'ok', held: null};
  const window = Object.assign(events, {
    document: doc, location, history, navigator: {onLine: true}, localStorage: storage,
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout, setInterval: clock.setInterval, clearInterval: clock.clearInterval,
    crypto: {getRandomValues(array) { crypto.randomFillSync(array); return array; }}, AbortController
  });
  const sandbox = {window, module: {exports: {}}, Uint8Array, Promise, Date, console};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/qrcode.js'), 'utf8'), sandbox, {filename: 'qrcode.js'});
  const qrFactory = sandbox.qrcode; // Browser-global build; no CommonJS `exports` in this VM.
  window.qrcode = (type, level) => {
    const qr = qrFactory(type, level), add = qr.addData;
    qr.addData = data => { d.qrLinks.push(data); return add(data); }; return qr;
  };
  sandbox.module = {exports: {}};
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/sync.js'), 'utf8'), sandbox, {filename: 'sync.js'});
  const fetch = (url, config) => {
    d.active++; d.maxActive = Math.max(d.maxActive, d.active);
    const req = JSON.parse(config.body); d.calls.push({url, config, req, at: clock.now()});
    let pending;
    if (options.fetch) pending = Promise.resolve().then(() => options.fetch(req, config, d));
    else if (d.mode === 'reject') pending = Promise.reject(new TypeError('secret network details'));
    else if (d.mode === 'html') pending = Promise.resolve({ok: true, json() { return Promise.reject(new SyntaxError('<html>private</html>')); }});
    else if (d.mode === 'server') pending = Promise.resolve({ok: true, json: async () => ({ok: false, err: 'server'})});
    else if (d.mode === 'http') pending = Promise.resolve({ok: false, json: async () => ({})});
    else if (d.mode === 'hold') pending = new Promise((resolve, reject) => {
      d.held = () => resolve({ok: true, json: async () => server.handle(req)});
      config.signal?.addEventListener('abort', () => reject(new Error('abort')));
    });
    else pending = Promise.resolve({ok: true, json: async () => server.handle(req)});
    return pending.finally(() => { d.active--; });
  };
  let seed = options.seed || 0;
  const init = {
    endpoint: options.endpoint === undefined ? 'https://example.test/exec' : options.endpoint,
    keys: options.keys || ['g5sci.v3'], container: options.selector ? '#sync' : doc.container,
    summarize: options.summarize || {'g5sci.v3': data => '練過 ' + JSON.parse(data).n + ' 題'},
    now: clock.now, storage, fetch,
    random: array => { for (let i = 0; i < array.length; i++) array[i] = seed++ % 240; },
    onReplaced: key => { d.replacements.push(key); options.onReplaced?.(key, d); },
    canReplace: options.canReplace, accept: options.accept
  };
  if (options.nativeRandom) delete init.random;
  if (options.random) init.random = options.random;
  if (options.noCrypto) delete window.crypto;
  d.window = window; d.library = sandbox.module.exports; d.api = d.library.init(init);
  return d;
}
module.exports = {Storage, Clock, Document, makeStore, server, device, flush, byClass, descendants, click, hash};

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[██░░░░░░░░] 20%｜已核對原文與改動｜HEAD 符合 455135d，Node 測試 80／80 通過；接著重現四項舊反例，並檢查同步寫入失敗時磁碟與記憶體是否一致。
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/sync.js | sed -n '130,205p'; nl -ba src/sync.js | sed -n '252,443p'; nl -ba src/app.html | sed -n '527,647p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   130	    }
   131	    function backup(key, data) {
   132	      if (data === null) { return; }
   133	      var prefix = 'g5sync.backup.' + key + '.';
   134	      var names = [];
   135	      for (var i = 0; i < storage.length; i += 1) {
   136	        var name = storage.key(i);
   137	        if (name && name.indexOf(prefix) === 0 && /^\d+$/.test(name.slice(prefix.length))) { names.push(name); }
   138	      }
   139	      names.sort(function (a, b) { return Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)); });
   140	      var stamp = Math.max(now(), names.length ? Number(names[names.length - 1].slice(prefix.length)) + 1 : 0);
   141	      // Write before pruning: quota errors must NEVER discard progress or its last backup.
   142	      var target = prefix + stamp;
   143	      write(target, data);
   144	      if (read(target) !== data) { throw error('storage'); }
   145	      names.push(target);
   146	      while (names.length > 3) { storage.removeItem(names.shift()); }
   147	    }
   148	    function summary(key, data) {
   149	      if (data === null) { return '沒有進度紀錄'; }
   150	      try {
   151	        if (options.summarize && typeof options.summarize[key] === 'function') { return String(options.summarize[key](data)); }
   152	      } catch (ignore) { /* Summary errors cannot prevent reconciliation. */ }
   153	      return '完整紀錄，共 ' + data.length + ' 字元';
   154	    }
   155	    function el(tag, className, text) {
   156	      var node = doc.createElement(tag);
   157	      node.className = 'g5s-' + className;
   158	      if (typeof text !== 'undefined') { node.textContent = text; }
   159	      return node;
   160	    }
   161	    function button(text, fn) {
   162	      var b = el('button', 'button', text);
   163	      b.type = 'button'; b.style.minHeight = '44px';
   164	      b.addEventListener('click', fn);
   165	      return b;
   166	    }
   167	    function link() {
   168	      var href = root.location ? root.location.href : '';
   169	      return href.split('#')[0] + '#sync=' + (code || '');
   170	    }
   171	    function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }
   172	    function buildView() {
   173	      clear(container);
   174	      var panel = el('section', 'panel');
   175	      panel.setAttribute('aria-label', '家庭跨裝置同步');
   176	      view = {panel: panel};
   177	      if (!code) {
   178	        panel.appendChild(button('開啟跨裝置同步（這台是第一台）', function () { enable(); }));
   179	        panel.appendChild(button('輸入同步碼（已在別台開過）', function () {
   180	          view.join.hidden = false; view.input.focus();
   181	        }));
   182	        var form = el('form', 'join'); form.hidden = true;
   183	        var label = el('label', 'label', '同步碼');
   184	        var input = el('input', 'input'); input.type = 'text'; input.maxLength = 80;
   185	        input.autocomplete = 'off'; input.spellcheck = false; input.style.minHeight = '44px';
   186	        input.setAttribute('autocapitalize', 'characters'); input.setAttribute('aria-label', '同步碼');
   187	        label.appendChild(input); form.appendChild(label);
   188	        form.appendChild(el('p', 'hint', BAD_CODE));
   189	        form.appendChild(button('加入同步', function () { join(input.value); }));
   190	        form.addEventListener('submit', function (event) { event.preventDefault(); join(input.value); });
   191	        panel.appendChild(form); view.join = form; view.input = input;
   192	      } else {
   193	        panel.appendChild(el('p', 'code', code.match(/.{4}/g).join('-')));
   194	        var qrBox = el('div', 'qr');
   195	        qrBox.setAttribute('aria-label', '掃描 QR code 加入同步');
   196	        try {
   197	          if (typeof root.qrcode !== 'function') { throw error('qr'); }
   198	          var qr = root.qrcode(0, 'M'); qr.addData(link()); qr.make();
   199	          qrBox.innerHTML = qr.createSvgTag({cellSize: 4, margin: 16, scalable: true});
   200	          qrBox.style.maxWidth = '256px';
   201	        } catch (qrError) { qrBox.textContent = 'QR code 無法顯示，請使用下方連結或同步碼。'; }
   202	        panel.appendChild(qrBox);
   203	        var share = el('input', 'link'); share.type = 'text'; share.readOnly = true;
   204	        share.value = link(); share.setAttribute('aria-label', '同步連結'); share.style.minHeight = '44px';
   205	        panel.appendChild(share);
   252	    }
   253	    function request(req, token) {
   254	      assertActive(token);
   255	      if (!options.endpoint || typeof fetcher !== 'function') { return Promise.reject(error('server')); }
   256	      if (root.navigator && root.navigator.onLine === false) { return Promise.reject(error('offline')); }
   257	      req.code = code;
   258	      return new Promise(function (done, reject) {
   259	        var settled = false;
   260	        var controller = root.AbortController ? new root.AbortController() : null;
   261	        activeAbort = controller;
   262	        var timeout = root.setTimeout(function () {
   263	          if (controller) { controller.abort(); }
   264	          finish(error('offline'));
   265	        }, 15000);
   266	        function finish(err, value) {
   267	          if (settled) { return; }
   268	          settled = true; root.clearTimeout(timeout);
   269	          if (activeAbort === controller) { activeAbort = null; }
   270	          if (err) { reject(err); } else { done(value); }
   271	        }
   272	        var config = {method: 'POST', headers: {'Content-Type': 'text/plain'}, body: JSON.stringify(req),
   273	          mode: 'cors', credentials: 'omit', redirect: 'follow', cache: 'no-store'};
   274	        if (controller) { config.signal = controller.signal; }
   275	        Promise.resolve().then(function () { return fetcher(options.endpoint, config); }).then(function (response) {
   276	          assertActive(token);
   277	          if (!response || response.ok === false || typeof response.json !== 'function') { throw error('server'); }
   278	          return Promise.resolve().then(function () { return response.json(); }).catch(function () { throw error('server'); });
   279	        }, function () { throw error('offline'); }).then(function (r) {
   280	          assertActive(token);
   281	          if (!r || (r.ok !== true && r.ok !== false)) { throw error('server'); }
   282	          if (req.op === 'get' && r.ok !== true) { throw error('server'); }
   283	          if (r.ok === false && r.err !== 'conflict') { throw error(r.err === 'too-big' ? 'too-big' : 'server'); }
   284	          if ((req.op === 'get' || r.err === 'conflict') && !validSnapshot(r)) { throw error('server'); }
   285	          if (req.op === 'put' && r.ok && (!integer(r.rev) || r.rev !== req.rev + 1 || !integer(r.updated))) { throw error('server'); }
   286	          finish(null, r);
   287	        }).catch(function (err) { finish(err); });
   288	      });
   289	    }
   290	    function showConflict(key, cloud) {
   291	      delete decisions[key]; // A newly observed cloud version requires a new choice.
   292	      conflicts[key] = {rev: cloud.rev, data: cloud.data, updated: cloud.updated};
   293	      status = '有兩份進度，請選擇要保留的紀錄。';
   294	      render();
   295	    }
   296	    function replaceLocal(key, cloud, token) {
   297	      assertActive(token);
   298	      if (cloud.data === null) { throw error('server'); }
   299	      var currentMeta = baseline(key);
   300	      if (currentMeta && currentMeta.rev > cloud.rev) { showConflict(key, cloud); return; }
   301	      // 頁面自己是唯一寫入者時（難題站，#1303 第 5 輪）：先問能不能換（有未存進度、正在某一篇裡就不行），
   302	      // 不行就什麼都不動（不備份、不寫），下一輪再 GET 再問；可以才備份，並交給頁面自己寫入與重畫（不 reload）。
   303	      if (typeof options.canReplace === 'function' && !options.canReplace(key)) {
   304	        needsGet[key] = true; deferred[key] = true; return;
   305	      }
   306	      var local = read(key);
   307	      backup(key, local);
   308	      assertActive(token);
   309	      // Synchronous read/backup/write; no awaited work between decision and replacement.
   310	      if (typeof options.accept === 'function') {
   311	        if (!options.accept(key, cloud.data)) { needsGet[key] = true; deferred[key] = true; return; }
   312	      } else { write(key, cloud.data); }
   313	      if (read(key) !== cloud.data) { throw error('storage'); }
   314	      delete deferred[key];
   315	      replaced.push(key); // Notify even if persisting the following metadata fails.
   316	      saveBaseline(key, cloud.rev, cloud.data, cloud.updated);
   317	      delete conflicts[key];
   318	    }
   319	    function put(key, data, rev, token, chosenCloud) {
   320	      if (data === null) { return Promise.resolve(); }
   321	      if (data.length > 900000) { return Promise.reject(error('too-big')); }
   322	      if (chosenCloud) { backup(key, chosenCloud.data); }
   323	      return request({op: 'put', key: key, rev: rev, data: data}, token).then(function (r) {
   324	        assertActive(token);
   325	        if (r.err === 'conflict') { showConflict(key, r); return; }
   326	        // The baseline is the exact request payload, never a newer local edit.
   327	        saveBaseline(key, r.rev, data, r.updated);
   328	        delete conflicts[key];
   329	      });
   330	    }
   331	    function reconcile(key, cloud, token) {
   332	      assertActive(token);
   333	      var local = read(key), meta = baseline(key), hash = observe(key, local).hash;
   334	      needsGet[key] = false;
   335	      if (cloud.rev === 0) {
   336	        if (local !== null) { return put(key, local, 0, token); }
   337	        saveBaseline(key, 0, null, null); return;
   338	      }
   339	      if (!meta) {
   340	        if (local === null) { replaceLocal(key, cloud, token); }
   341	        else { showConflict(key, cloud); }
   342	        return;
   343	      }
   344	      if (cloud.rev < meta.rev || (cloud.rev === meta.rev && contentHash(cloud.data) !== meta.hash)) {
   345	        showConflict(key, cloud); return;
   346	      }
   347	      if (cloud.rev > meta.rev) {
   348	        if (hash === meta.hash) { replaceLocal(key, cloud, token); }
   349	        else { showConflict(key, cloud); }
   350	        return;
   351	      }
   352	      if (hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   353	    }
   354	    function resetSession(nextCode) {
   355	      epoch += 1; code = nextCode; needsGet = {}; conflicts = {}; decisions = {}; observed = {}; replaced = []; deferred = {};
   356	      failures = 0; retryAt = 0; notice = '';
   357	      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   358	      keys.forEach(function (key) { needsGet[key] = true; });
   359	      status = code ? '正在同步' : '尚未開啟同步';
   360	    }
   361	    function failure(err) {
   362	      if (err.kind === 'stale') { return; }
   363	      failures += 1;
   364	      var delay = Math.min(60000, 4000 * Math.pow(2, Math.min(failures - 1, 4)));
   365	      retryAt = now() + delay;
   366	      status = err.kind === 'offline' ? '離線中，連上網路會自動補上' : '同步失敗，稍後自動再試';
   367	      if (err.kind === 'storage' || err.name === 'QuotaExceededError') { notice = '本機儲存空間不足或無法使用，請保留原進度並檢查瀏覽器儲存設定。'; }
   368	      if (err.kind === 'too-big') { notice = '這份進度超過 900000 字元，請先保留本機資料。'; }
   369	      if (retryTimer !== null) { root.clearTimeout(retryTimer); }
   370	      retryTimer = root.setTimeout(function () { retryTimer = null; sync(); }, delay);
   371	    }
   372	    function completed() {
   373	      if (keys.some(function (key) { return !!conflicts[key]; })) {
   374	        status = '有兩份進度，請選擇要保留的紀錄。'; return;
   375	      }
   376	      var dirty = keys.some(function (key) {
   377	        var meta = baseline(key), local = read(key);
   378	        return needsGet[key] || !meta || contentHash(local) !== meta.hash;
   379	      });
   380	      status = dirty ? '等待同步本機變更' : '已同步 ' + taipei(now(), false);
   381	      if (keys.some(function (key) { return !!deferred[key]; })) { status = '雲端有較新的進度，回到首頁、存好後就會換上。'; }
   382	      if (keys.some(function (key) { var meta = baseline(key); return meta && meta.rev > 0 && read(key) === null; })) {
   383	        status = '這台的進度已移除，雲端紀錄保留；重新加入可下載。';
   384	      }
   385	    }
   386	    function run(job, force) {
   387	      if (destroyed || stopped) { return Promise.resolve(false); }
   388	      if (busy) { return busy.then(function () { return run(job, force); }); }
   389	      var token;
   390	      busy = Promise.resolve().then(function () {
   391	        var saved = read(CODE);
   392	        if (saved !== code) { resetSession(saved && normalizeCode(saved) === saved ? saved : null); }
   393	        if (!code || (!force && now() < retryAt)) { return false; }
   394	        token = epoch;
   395	        return job(token).then(function () {
   396	          assertActive(token);
   397	          failures = 0; retryAt = 0;
   398	          notice = '';
   399	          if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   400	          completed(); return true;
   401	        });
   402	      }).catch(function (err) {
   403	        if (typeof token === 'undefined' || token === epoch) { failure(err); }
   404	        return false;
   405	      }).then(function (result) {
   406	        busy = null;
   407	        try { render(); } catch (ignoreRender) { /* Storage failures may also affect conflict display. */ }
   408	        var callbacks = replaced; replaced = [];
   409	        callbacks.forEach(function (key) {
   410	          if (typeof options.onReplaced === 'function') {
   411	            try { options.onReplaced(key); } catch (ignoreCallback) { /* Host callback cannot break the scheduler. */ }
   412	          }
   413	        });
   414	        return result;
   415	      });
   416	      return busy;
   417	    }
   418	    function sync(force) {
   419	      return run(function (token) {
   420	        var chain = Promise.resolve();
   421	        var firstError = null;
   422	        keys.forEach(function (key) {
   423	          chain = chain.then(function () {
   424	            assertActive(token);
   425	            if (decisions[key]) { return applyDecision(key, token); }
   426	            if (conflicts[key]) { observe(key, read(key)); return; }
   427	            if (needsGet[key]) {
   428	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   429	            }
   430	            var local = read(key), meta = baseline(key);
   431	            if (!meta) {
   432	              needsGet[key] = true;
   433	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   434	            }
   435	            if (observe(key, local).hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   436	          }).catch(function (err) {
   437	            if (err.kind === 'stale') { throw err; }
   438	            if (!firstError) { firstError = err; }
   439	          });
   440	        });
   441	        return chain.then(function () { if (firstError) { throw firstError; } });
   442	      }, force === true);
   443	    }
   527	  var pn = parseNum(($('input[data-k="' + key + '.n"]', box) || {}).value), pd = parseNum(($('input[data-k="' + key + '.d"]', box) || {}).value);
   528	  return {n:pn.empty || pn.bad ? NaN : pn.v, d:pd.empty || pd.bad ? NaN : pd.v, empty:!!(pn.empty || pd.empty), bad:!!(pn.bad || pd.bad)};
   529	}
   530	function lock(box){ each(box.querySelectorAll("input,button[data-check],button[data-hint]"), function(x){ x.disabled = true; }); }
   531	function need(){ return E.kind === "steps" ? Math.min(3, (E.practice || []).length) : 3; }   // 學會＝連續答對幾題（練習題少於 3 題就全對）
   532	function dots(){ var h = ""; for (var i = 0; i < need(); i++) h += '<i class="' + (i < Math.min(st.streak, need()) ? "on" : "") + '"></i>'; return '<span class="dots" aria-label="連續自己做對 ' + st.streak + ' 題">' + h + '</span>'; }
   533	function openPractice(){ var P = $("#practice"); P.hidden = false; renderPractice(); reveal(P); }
   534	// 填了字但不是整數、或還有格子沒填：講清楚，不算答錯
   535	function formCheck(fs){
   536	  if (fs.some(function(f){ return f.bad; })) return {ok:false, countable:false, msg:"只能填整數，例如 2、15。"};
   537	  if (fs.some(function(f){ return f.empty; })) return {ok:false, countable:false, msg:"還有格子沒填。"};
   538	  return null;
   539	}
   540	function renderPractice(){
   541	  if (E.kind === "steps") return choicePractice();
   542	  var P = $("#practice"), p = F.problem(st.idx, st.seed), a = p.a, b = p.b, s = F.solve(a, b);
   543	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   544	  var cur = st.cur, sa = null, sb = null, ea = null, eb = null;
   545	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   546	    '<div class="small muted">連續 3 題「沒看提示、每一格第一次就對」就算學會。看了提示也沒關係，弄懂最重要。</div>' +
   547	    '<div class="prob">' + fr(a) + '<span class="box" id="pbox" role="img" aria-label="空格"></span>' + fr(b) + '</div>' +
   548	    '<div class="prow" id="r1"><div class="qq">① 先約分，變成最簡分數</div><div class="eq"><span class="pair">' + fr(a) + ' = ' + fin("a") + '</span><span class="pair">' + fr(b) + ' = ' + fin("b") + '</span></div>' +
   549	    '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div></div>' +
   550	    '<div class="prow" id="r2" hidden></div><div class="prow" id="r3" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   551	  var r1 = $("#r1", P), r2 = $("#r2", P), r3 = $("#r3", P);
   552	  wireRow(r1, function(){
   553	    var ia = readFrac(r1, "a"), ib = readFrac(r1, "b"), form = formCheck([ia, ib]);
   554	    if (form) return form;
   555	    var x = F.checkReduce(a, ia), y = F.checkReduce(b, ib);
   556	    if (x.ok && y.ok) { sa = ia; sb = ib; return {ok:true, msg:"對了：" + F.txt(a) + " = " + F.txt(sa) + "，" + F.txt(b) + " = " + F.txt(sb) + "。", next:row2}; }
   557	    return {ok:false, countable:(!x.ok && x.code !== "empty") || (!y.ok && y.code !== "empty"), msg:(x.ok ? "" : "左邊：" + x.msg) + (!x.ok && !y.ok ? "\n" : "") + (y.ok ? "" : "右邊：" + y.msg)};
   558	  }, [
   559	    function(){ return "從 2、3、5、7、9 開始試：分子和分母都在同一個乘法表裡，就能一起除。" + [a, b].map(function(f){ var q = F.smallestCommon(f); return F.txt(f) + "：" + F.divText(q, f.n) + "、" + F.divText(q, f.d) + "，可以先一起除以 " + q + "。"; }).join(" "); },
   560	    function(){ return [a, b].map(function(f){ var t = F.simplest(f); return F.txt(f) + "：" + f.n + " = " + t.g + " × " + t.n + "、" + f.d + " = " + t.g + " × " + t.d + "，一起除以 " + t.g + "，變成 " + t.n + "/" + t.d + "。"; }).join(" "); }
   561	  ]);
   562	  function row2(){
   563	    r2.hidden = false;
   564	    r2.innerHTML = '<div class="qq">② 再通分，讓分母一樣</div><div class="eq"><span class="pair">' + fr(sa) + ' = ' + fin("c") + '</span><span class="pair">' + fr(sb) + ' = ' + fin("e") + '</span></div>' +
   565	      '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div>';
   566	    wireRow(r2, function(){
   567	      var ia = readFrac(r2, "c"), ib = readFrac(r2, "e"), form = formCheck([ia, ib]);
   568	      if (form) return form;
   569	      var x = F.checkCommon(sa, sb, ia, ib);
   570	      if (x.ok) { ea = ia; eb = ib; return {ok:true, msg:x.msg, next:row3}; }
   571	      return {ok:false, countable:x.code !== "empty", msg:x.msg};
   572	    }, [
   573	      function(){ var ma = [], mb = []; for (var i = 1; i <= s.lcm / sa.d; i++) ma.push(sa.d * i); for (var j = 1; j <= s.lcm / sb.d; j++) mb.push(sb.d * j);
   574	        return "先找 " + sa.d + " 和 " + sb.d + " 的最小公倍數。" + sa.d + " 的倍數：" + ma.join("、") + "…；" + sb.d + " 的倍數：" + mb.join("、") + "…，第一個兩邊都有的就是。"; },
   575	      function(){ return "最小公倍數是 " + s.lcm + "。" + F.txt(sa) + " 的分子分母都乘 " + (s.lcm / sa.d) + " → " + F.txt(s.ea) + "；" + F.txt(sb) + " 的分子分母都乘 " + (s.lcm / sb.d) + " → " + F.txt(s.eb) + "。"; }
   576	    ]);
   577	    reveal(r2);
   578	  }
   579	  function row3(){
   580	    r3.hidden = false;
   581	    r3.innerHTML = '<div class="qq">③ 比大小：' + fr(ea) + ' 和 ' + fr(eb) + '</div><div class="qq">所以 ' + fr(a) + ' ○ ' + fr(b) + '？</div><div class="chips">' +
   582	      SIGNS.map(function(o){ return '<button type="button" class="chip sign" data-s="' + esc(o.value) + '">' + o.label + '</button>'; }).join("") + '</div><div class="fb" hidden></div>';
   583	    var out = $(".fb", r3), bs = r3.querySelectorAll(".chip");
   584	    var g0 = GEN;
   585	    var g1 = GEN;
   586	  each(bs, function(bt){ bt.onclick = function(){
   587	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分（st.cur 換掉）或已切走：舊 handler 失效，不重複計分
   588	      if (g0 !== GEN) return;
   589	      var r = F.checkSign(a, b, ea, eb, bt.dataset.s);
   590	      if (r.ok) { each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, r.msg); $("#pbox", P).innerHTML = sym(s.sign); $("#pbox", P).classList.add("got"); finish(); }
   591	      else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, r.msg); }
   592	    }; });
   593	    reveal(r3);
   594	  }
   595	  function finish(){
   596	    var clean = cur.hints === 0 && cur.wrongs === 0, was = st.mastered;
   597	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   598	    st.idx++; st.cur = null;   // 做完就換下一題：重開練習不會再算一次同一題（Codex 第 1 輪必修 1）
   599	    if (st.streak >= 3) st.mastered = true;
   600	    st.log.push({t:Date.now(), a:F.txt(a), b:F.txt(b), clean:clean, hints:cur.hints, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   601	    var saved = save();
   602	    var PE = $("#pend", P); PE.hidden = false;
   603	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 3 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   604	      '<div class="fb ok">' + (clean ? "完全自己做對！連續 " + st.streak + " 題。" : "做完了！" + (cur.hints ? "這題看了提示，" : "這題有改過答案，") + "下一題試試不看提示。") + '</div>') +
   605	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   606	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   607	    $("#nextQ", PE).onclick = function(){ renderPractice(); reveal(P); };
   608	    $("#toLesson", PE).onclick = function(){ startLesson(); };
   609	    drawTopBtns(); drawRec(); reveal(PE);
   610	  }
   611	  function wireRow(row, check, hints){
   612	    var out = $(".fb", row), hb = $(".hint", row), lvl = 0;
   613	    var gg = GEN;
   614	  function go(){
   615	    if (gg !== GEN) return;
   616	      var r = check();
   617	      if (r.ok) { lock(row); fb(out, true, r.msg); r.next(); }
   618	      else { if (r.countable) { cur.wrongs++; save(); } fb(out, false, r.msg); }
   619	    }
   620	    $("button[data-check]", row).onclick = go;
   621	    $("button[data-hint]", row).onclick = function(){
   622	      cur.hints++; save(); hb.hidden = false; hb.textContent = hints[Math.min(lvl, hints.length - 1)](); lvl++;
   623	      if (lvl >= hints.length) this.disabled = true;
   624	    };
   625	    each(row.querySelectorAll("input"), function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
   626	  }
   627	}
   628	
   629	// ---------- 首頁按鈕、紀錄、影片 ----------
   630	function drawTopBtns(){
   631	  var T = $("#topBtns");
   632	  if (!WRITER) { T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">' + esc(READONLY_MSG) + '</div>'; $("#mastery").hidden = true; return; }
   633	  if (!READY) {   // 讀不到原有紀錄：不給作答（Codex 第 5 輪必修 1），給「再讀一次」
   634	    T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">這台裝置的練習紀錄暫時讀不到，為了不把以前的紀錄蓋掉，先不開始練習。</div><button class="btn" type="button" id="readRetry">再讀一次</button>';
   635	    $("#readRetry").onclick = retryRead; $("#mastery").hidden = true; return;
   636	  }
   637	  T.innerHTML = st.lessonDone ?
   638	    '<button class="btn" type="button" id="goPractice">' + (st.solved ? "繼續練習（第 " + (st.idx + 1) + " 題）" : "換你自己做練習題") + '</button><button class="btn ghost" type="button" id="goLesson">再看一次教學</button>' :
   639	    '<button class="btn" type="button" id="goLesson">開始學</button><button class="btn ghost" type="button" id="goPractice">我已經會了，直接練習</button>';
   640	  $("#goLesson").onclick = startLesson;
   641	  $("#goPractice").onclick = openPractice;
   642	  if (E.kind === "steps" && !(E.practice || []).length) $("#goPractice").remove();
   643	  var M = $("#mastery");
   644	  M.hidden = !st.mastered;
   645	  if (st.mastered) M.innerHTML = '<div class="win"><b class="t">這種題你已經會了</b><span>連續 ' + need() + ' 題自己做對。想多練可以繼續做。</span></div>';
   646	}
   647	function drawRec(){

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'python3.12 -B tests/e2e.py' in /Users/william/Documents/g5-help
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
 exited 1 in 102ms:
Traceback (most recent call last):
  File "/Users/william/Documents/g5-help/tests/e2e.py", line 756, in <module>
    main()
  File "/Users/william/Documents/g5-help/tests/e2e.py", line 722, in main
    cr = p.chromium.launch()
         ^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/sync_api/_generated.py", line 16269, in launch
    self._sync(
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_sync_base.py", line 115, in _sync
    return task.result()
           ^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_browser_type.py", line 98, in launch
    await self._channel.send(
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.Error: BrowserType.launch: EPERM: operation not permitted, mkdtemp '/var/folders/nf/sry6xz8x35gdnpjkkvxpxnzw0000gn/T/playwright-artifacts-Po6WZR'

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '130,210p' src/app.html; rg -n 'function startLesson|addEventListener|setTimeout|requestAnimationFrame|document\\.' src/app.html; sed -n '443,590p' src/sync.js; sed -n '600,632p' tests/e2e.py; cat build.py" in /Users/william/Documents/g5-help
 succeeded in 0ms:
@media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}
</style>

<div class="wrap">
  <header class="hero">
    <h1>五年級難題解說</h1>
    <span class="muted">不懂的題目，一題一篇，只講那一題<span id="cd"></span></span>
  </header>

  <div id="saveWarn" class="banner" role="alert" hidden style="background:var(--sun-soft);border-radius:12px;padding:12px 16px;margin-bottom:12px">這台裝置還有練習進度沒存好（可能空間不足或瀏覽器限制），請先不要關閉這一頁；每 3 秒會自動再試。 <button class="btn ghost sm" type="button" id="saveRetry">現在再存一次</button></div>
  <section id="home" style="display:grid;gap:18px">
    <div class="panel"><p style="margin:0">每一篇都是她說「看不懂」的那一題：跟著步驟自己動手做，做完再練幾題同類型的，練到會為止。不用重看整張考卷。</p></div>
    <div id="subjects" style="display:grid;gap:18px"></div>
    <details id="upBox"><summary>家長傳題目（她說看不懂的那一題）</summary>
      <div style="display:grid;gap:12px" id="upForm">
        <p class="small muted" style="margin:0">拍下那一題、選科目、寫一句她卡在哪。照片只存在家裡自己的 Google 試算表，不會放上網頁；做好的解說會出現在上面對應的科目裡。</p>
        <label>科目 <select id="upSubj" style="font-size:17px;min-height:46px;padding:6px 10px;border:2px solid var(--line);border-radius:12px;background:var(--card)"></select></label>
        <label>照片 <input type="file" id="upFile" accept="image/*" style="font-size:16px"></label>
        <label for="upNote">哪一題、她說哪裡不懂</label>
        <textarea id="upNote" maxlength="500" style="font-size:16px;min-height:80px;border:2px solid var(--line);border-radius:12px;padding:10px;background:var(--bg);color:var(--ink)" placeholder="例：右上角第 6 題②，她不知道怎麼通分"></textarea>
        <div class="row"><button class="btn" type="button" id="upSend">送出</button><span class="small" id="upMsg" aria-live="polite"></span></div>
        <div style="display:grid;gap:8px;border-top:1px solid var(--line-soft);padding-top:12px"><b>你傳的題目</b><div class="small" id="upHealth"></div><div id="upList" class="hlist"></div></div>
      </div>
    </details>
    <details id="syncBox"><summary>換電腦或 iPad 也能接著練（跨裝置同步）</summary><div id="g5sync"></div></details>
  </section>

  <div id="entry" hidden style="display:grid;gap:18px">
    <a href="#" class="back" id="backHome">回難題列表</a>
    <main class="panel" id="top">
      <div class="src" id="src"></div>
      <div class="prob" id="prob"></div>
      <p style="margin:0" id="lead"></p>
      <div class="row" id="topBtns"></div>
      <div id="mastery" hidden></div>
    </main>

    <section class="lesson" id="lesson" hidden></section>

    <section class="panel" id="practice" hidden></section>

    <details id="vidBox" hidden><summary>看影片再聽一次</summary><div id="vids" style="display:grid;gap:12px"></div></details>

    <details id="parentBox"><summary>給爸媽</summary>
      <div id="parentText"></div>
      <p class="small muted" id="rec" style="margin:0"></p>
    </details>
  </div>
</div>

<script src="qrcode.js"></script>
<script src="sync.js"></script>
<!--@INLINE src/frac.js-->
<!--@INLINE src/hard.js-->
<!--@INLINE src/upprogress.js-->
<script>
(function(){
"use strict";
var F = window.G5Frac;
var H = window.G5Hard, E = null, A = null, B = null, SOL = null;   // E＝目前打開的那一篇
var SIGNS = [{label:"&gt;", value:">"}, {label:"&lt;", value:"<"}, {label:"=", value:"="}];
var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function $(s, el){ return (el || document).querySelector(s); }
function each(list, fn){ Array.prototype.forEach.call(list, fn); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function fr(f){ return '<span class="fr" role="img" aria-label="' + f.d + ' 分之 ' + f.n + '"><span>' + f.n + '</span><span>' + f.d + '</span></span>'; }
function frx(f, m){ return '<span class="fr x" role="img" aria-label="' + f.d + '乘' + m + ' 分之 ' + f.n + '乘' + m + '"><span>' + f.n + '×' + m + '</span><span>' + f.d + '×' + m + '</span></span>'; }
function isPrime(x){ if (x < 2) return false; for (var i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; }
function sym(s){ return s === ">" ? "&gt;" : s === "<" ? "&lt;" : "="; }
function add(el, html){ var d = document.createElement("div"); d.style.display = "contents"; d.innerHTML = html; var first = d.firstElementChild; while (d.firstChild) el.appendChild(d.firstChild); return first; }
function fb(el, ok, msg){ el.hidden = false; el.className = "fb " + (ok ? "ok" : "no"); el.textContent = msg; }
function reveal(el){ setTimeout(function(){ if (el.scrollIntoView) el.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "start"}); }, 40); }

// 長條圖：d 小格塗 n 格；group＝每幾小格畫一條粗線（圈成一大塊）
function bar(n, d, o){
  o = o || {};
  var W = 600, H = o.h || 46, w = (W - 4) / d, fill = o.c === "b" ? "var(--grass)" : "var(--sunball)", s = "";
  var big = !o.group && d <= 12;   // 大塊（例如 2/3 的 3 塊）：格線用深色，才數得出幾塊
  for (var i = 0; i < d; i++) s += '<rect x="' + (2 + i * w).toFixed(2) + '" y="2" width="' + w.toFixed(2) + '" height="' + (H - 4) + '" fill="' + (i < n ? fill : "var(--card)") + '" stroke="' + (big ? "var(--ink)" : "var(--line)") + '" stroke-width="' + (big ? 2.5 : 1) + '"/>';
  if (o.group) for (var j = o.group; j < d; j += o.group) { var x = (2 + j * w).toFixed(2); s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="var(--ink)" stroke-width="3.5"/>'; }
200:function add(el, html){ var d = document.createElement("div"); d.style.display = "contents"; d.innerHTML = html; var first = d.firstElementChild; while (d.firstChild) el.appendChild(d.firstChild); return first; }
202:function reveal(el){ setTimeout(function(){ if (el.scrollIntoView) el.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "start"}); }, 40); }
278:  if (!RETRY) RETRY = setTimeout(function(){ RETRY = null; if (dirtyCount()) save(); }, 3000);
361:  each(ins, function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
388:function startLesson(){
625:    each(row.querySelectorAll("input"), function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
739:  document.title = e.title + "｜五年級難題解說";
746:  GEN++; E = null; st = null; document.title = "五年級難題解說";
752:window.addEventListener("hashchange", route);
783:  function boot(){ if (!(window.G5HelpWriter && window.G5HelpWriter())) { var c = document.getElementById("g5sync"); if (c) c.textContent = "（在另一個分頁開著，同步由那一頁負責）"; return; }
792:  window.addEventListener("g5help-ready", boot, {once: true});
798:  var EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec", $ = function(s){ return document.querySelector(s); };
805:        var k = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement("canvas");
834:  $("#upBox").addEventListener("toggle", function(){ if ($("#upBox").open) loadMine(); });
    }
    function activate(newCode) {
      // Clear the old baseline first. A partial storage failure then fails conservatively.
      storage.removeItem(META);
      write(CODE, newCode);
      stopped = false; resetSession(newCode); render();
      return sync(true);
    }
    function enable() {
      if (code && !stopped) { return sync(true); }
      try {
        var random = options.random;
        if (!random && root.crypto && root.crypto.getRandomValues) { random = root.crypto.getRandomValues.bind(root.crypto); }
        if (random && typeof random !== 'function' && random.getRandomValues) { random = random.getRandomValues.bind(random); }
        if (!random) { throw error('random'); }
        var generated = '', tries = 0, limit = Math.floor(256 / ALPHABET.length) * ALPHABET.length;
        while (generated.length < 12 && tries < 128) {
          var bytes = new Uint8Array(32); random(bytes); tries += 1;
          for (var i = 0; i < bytes.length && generated.length < 12; i += 1) {
            if (bytes[i] < limit) { generated += ALPHABET.charAt(bytes[i] % ALPHABET.length); }
          }
        }
        if (generated.length !== 12) { throw error('random'); }
        return activate(generated);
      } catch (err) {
        status = '同步失敗，稍後自動再試';
        notice = err.kind === 'random' ? '此瀏覽器無法安全產生同步碼，請使用 HTTPS 開啟網站。' : '無法儲存同步設定，請檢查瀏覽器儲存空間。';
        render(); return Promise.resolve(false);
      }
    }
    function join(value) {
      var normalized = normalizeCode(value);
      if (!normalized) { notice = BAD_CODE; render(); return Promise.resolve(false); }
      try { return activate(normalized); }
      catch (err) { failure(err); render(); return Promise.resolve(false); }
    }
    function applyDecision(key, token) {
      var cloud = conflicts[key], choice = decisions[key], action;
      if (!cloud || !choice) { delete decisions[key]; return Promise.resolve(); }
      if (choice === 'local') { action = put(key, read(key), cloud.rev, token, cloud); }
      else {
        // Re-fetch before accepting cloud: do not silently accept a version the parent never saw.
        action = request({op: 'get', key: key}, token).then(function (latest) {
          if (latest.rev !== cloud.rev || latest.data !== cloud.data) { showConflict(key, latest); return; }
          replaceLocal(key, latest, token);
        });
      }
      return action.then(function () { delete decisions[key]; });
    }
    function resolve(key, choice) {
      if (destroyed || stopped || !conflicts[key] || decisions[key] || keys.indexOf(key) < 0 || (choice !== 'local' && choice !== 'cloud')) { return Promise.resolve(false); }
      decisions[key] = choice;
      render();
      return run(function (token) { return applyDecision(key, token); }, true);
    }
    function stop() {
      stopped = true; epoch += 1;
      if (activeAbort) { activeAbort.abort(); }
      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
      code = null; conflicts = {}; decisions = {}; replaced = []; notice = '';
      var ok = true;
      try { storage.removeItem(CODE); storage.removeItem(META); }
      catch (err) { ok = false; notice = '同步已暫停，但瀏覽器無法清除設定；請檢查儲存權限。'; }
      status = ok ? '這台已停止同步，進度仍保留。' : '同步已暫停';
      render(); return ok;
    }
    function visibility() { if (doc.visibilityState === 'hidden' && !stopped) { sync(true); } }
    function online() { if (!stopped) { sync(true); } }
    function storageEvent(event) {
      if (!event || event.key === CODE || event.key === META || keys.indexOf(event.key) >= 0 || event.key === null) {
        // A stop on another same-origin tab also prevents this tab's in-flight readback.
        if (!stopped) { sync(); }
      }
    }
    function hashInvitation() {
      if (!root.location || !root.history) { return null; }
      var parts = root.location.hash.replace(/^#/, '').split('&'), kept = [], invitation = null;
      parts.forEach(function (part) {
        if (/^sync=/.test(part)) {
          try { invitation = decodeURIComponent(part.slice(5)); } catch (ignore) { invitation = '!'; }
        } else if (part) { kept.push(part); }
      });
      if (invitation !== null) {
        root.history.replaceState(root.history.state, '', root.location.href.split('#')[0] + (kept.length ? '#' + kept.join('&') : ''));
      }
      return invitation;
    }
    var invitation = null;
    try {
      invitation = hashInvitation();
      var saved = read(CODE);
      if (saved && normalizeCode(saved) === saved) { resetSession(saved); }
      else if (saved) { notice = BAD_CODE; }
    } catch (err) { status = '同步失敗，稍後自動再試'; notice = '無法讀取同步設定，原進度保留。'; }
    render();
    doc.addEventListener('visibilitychange', visibility);
    if (root.addEventListener) { root.addEventListener('online', online); root.addEventListener('storage', storageEvent); }
    var interval = root.setInterval(function () { if (!stopped) { sync(); } }, 4000);
    var api = {
      enable: enable, join: join, stop: stop, sync: sync, resolve: resolve, link: link,
      getState: function () { return {code: code, status: status, notice: notice, conflicts: JSON.parse(JSON.stringify(conflicts)), retryAt: retryAt, failures: failures}; },
      destroy: function () {
        destroyed = true; epoch += 1; replaced = [];
        root.clearInterval(interval); if (retryTimer !== null) { root.clearTimeout(retryTimer); }
        if (activeAbort) { activeAbort.abort(); }
        doc.removeEventListener('visibilitychange', visibility);
        if (root.removeEventListener) { root.removeEventListener('online', online); root.removeEventListener('storage', storageEvent); }
      }
    };
    api.ready = invitation !== null ? join(invitation) : sync();
    return api;
  }
  return {init: init, normalizeCode: normalizeCode, contentHash: contentHash};
}));
    b = ctx.new_page(); b.goto(HOME + "#h/t-guoyu"); b.wait_for_timeout(800)
    a.get_by_role("button", name="我已經會了，直接練習").click(); solve_practice(a, *FIXED[0])
    b.wait_for_timeout(500)
    check("r4建議7 唯讀分頁寫入次數＝0", b.evaluate("G5HelpWriter()") is False and b.evaluate("window.__w") == 0, b.evaluate("window.__w"))
    ctx.close()


def flow_codex_r5(browser, label="Chromium"):
    """Codex 2026-10-13 第 5 輪必修 1–3、建議 4（4agent 定案：本頁記憶體是唯一真相、sync.js 不直接寫 g5help.v1、不 reload）。"""
    loads = "sessionStorage.setItem('loads',String(+(sessionStorage.getItem('loads')||0)+1));"
    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,streak:3,clean:8,mastered:true,lessonDone:true,r:1}}}));"
    # 必修 1：冷啟動讀取失敗 ⇒ 不給作答、給「再讀一次」；恢復後接續原紀錄，不會被空白蓋掉
    for key, pre in (("g5help.v1", seed), ("g5math.v1", "localStorage.setItem('g5math.v1',JSON.stringify({v:1,solved:4,idx:4,streak:1,clean:4,mastered:false,lessonDone:true}));")):
        init = (loads + "if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');" + pre + "}"
                "window.__rf=true;var _g=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(window.__rf&&k==='" + key + "')throw new Error('io');return _g.call(this,k);};")
        ctx, pg, errors = open_page(browser, init=init)
        pg.wait_for_timeout(600)
        check(f"{label} r5必修1 冷啟動讀 {key} 失敗：沒有作答按鈕、有「再讀一次」", pg.locator("#goPractice").count() == 0 and pg.locator("#readRetry").count() == 1, pg.locator("#topBtns").inner_text())
        pg.evaluate("window.__rf=false; 0")
        if pg.locator("#readRetry").count():
            pg.locator("#readRetry").click()
        want = 8 if key == "g5help.v1" else 4
        ok = pg.locator("#goPractice").count() == 1
        if ok:
            pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob"); solve_practice(pg, *prob_text(pg))
        st = (store(pg) or {}) if ok else {}
        check(f"{label} r5必修1 恢復讀取後接續原紀錄（{want}→{want + 1} 題，不被空白蓋掉）", st.get("solved") == want + 1, st)
        check(f"{label} r5必修1 沒有 JS 錯誤", not errors, errors)
        ctx.close()
    # 必修 2：雲端版本只在「首頁、沒有未存進度」時套用；套用不 reload
    cloud = json.dumps({"v": 1, "entries": {"p38-6-2": {"solved": 20, "idx": 20, "r": 9}}})
    init = (loads + "window.__fail=false;var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__fail&&k==='g5help.v1')throw new Error('quota');return _s.call(this,k,v);};")
    ctx, pg, errors = open_page(browser, init=init)
#!/usr/bin/env python3
"""把 src/app.html 包成可直接開啟的 index.html（GitHub Pages：孩子的 iPad 不登入就能開）。

src/app.html 裡的 <!--@INLINE src/x.js--> 換成那支檔的內容；判題邏輯（src/frac.js）與題目清單（src/hard.js）
同一份檔也給 node 測試用。
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HEAD = ('<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<meta name="robots" content="noindex,nofollow">'
        '<meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="apple-mobile-web-app-title" content="難題解說">'
        '</head><body>')
INLINE = re.compile(r"<!--@INLINE (src/[A-Za-z0-9_.-]+\.js)-->")


def inline(body: str) -> str:
    def sub(m: re.Match) -> str:
        js = (ROOT / m.group(1)).read_text(encoding="utf-8")
        if "</script" in js.lower():
            raise SystemExit(f"{m.group(1)} 含 </script，不能內嵌")
        return "<script>\n" + js + "\n</script>"
    out = INLINE.sub(sub, body)
    if "<!--@INLINE" in out:
        raise SystemExit("還有沒換掉的 @INLINE 標記")
    return out


def main() -> None:
    body = inline((ROOT / "src" / "app.html").read_text(encoding="utf-8"))
    (ROOT / "index.html").write_text(HEAD + body + "</body></html>", encoding="utf-8")
    print(f"built index.html ({len(body)} chars)")
    # 同步函式庫另外當獨立檔放在網站根目錄，自然站等其他站用 <script src> 載入同一份（不另抄一份）
    for name in ("sync.js", "qrcode.js"):
        (ROOT / name).write_text((ROOT / "src" / name).read_text(encoding="utf-8"), encoding="utf-8")
    print("copied sync.js, qrcode.js")


if __name__ == "__main__":
    main()

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "node -e 'const fs=require(\"node:fs\"),cp=require(\"node:child_process\"),crypto=require(\"node:crypto\");for(const name of [\"src/app.html\",\"src/sync.js\",\"index.html\",\"sync.js\",\"tests/e2e.py\",\"tests/harness.js\",\"tests/sync.test.js\"]){const b=fs.readFileSync(name),h=cp.execFileSync(\"git\",[\"show\",\"HEAD:\"+name],{stdio:[\"ignore\",\"pipe\",\"ignore\"]});console.log(name,crypto.createHash(\"sha256\").update(b).digest(\"hex\"),\"matches_HEAD=\"+b.equals(h));}console.log(\"published-sync-matches-source\",fs.readFileSync(\"src/sync.js\").equals(fs.readFileSync(\"sync.js\")));'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
src/app.html 0480acd218824cf206ec2b255df95c50bbd71fe83a3103e7f01867699fe27c22 matches_HEAD=true
src/sync.js 64e0763d3fc99c98d6814f917c2beaf59295bb82ebf74247e2ac6cacab73a6ac matches_HEAD=true
index.html 9aa802a5d4f55bb7c4a383ffcb079afcce024fc1c43413c23b1ff4b7dbbd39a9 matches_HEAD=true
sync.js 64e0763d3fc99c98d6814f917c2beaf59295bb82ebf74247e2ac6cacab73a6ac matches_HEAD=true
tests/e2e.py 4e6064749548d95e1d98e9eea0f371f15f43735f672b4c778097f3a5a993b98d matches_HEAD=true
tests/harness.js 8d9f97c270b99646b5065fd75a86bd492397404171e5873ea77139e4dd564535 matches_HEAD=true
tests/sync.test.js 6d293da77ba939112725329578af11e28ba09033f4bd58ff8305e9cd69f504c4 matches_HEAD=true
published-sync-matches-source true

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "rg -n '"'^FIXTURE|''^def flow_|localStorage|setItem'"' tests/e2e.py; sed -n '267,318p' tests/e2e.py; sed -n '360,403p' src/app.html; sed -n '1,25p' src/hard.js; tail -25 src/hard.js; sed -n '615,675p' tests/sync.test.js" in /Users/william/Documents/g5-help
 succeeded in 0ms:
78:    db = json.loads(page.evaluate("localStorage.getItem('g5help.v1')") or "null")
182:def flow_full(browser, label, device=None, width=None, shots=False):
235:def flow_codex_r1(browser):
319:def flow_storage_blocked(browser):
320:    init = "Storage.prototype.setItem=function(){throw new Error('quota')};"
330:def flow_corrupt_store(browser):
331:    init = "localStorage.setItem('g5help.v1','{not json');"
334:    init2 = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{idx:-5,streak:'x',lessonDone:'yes',log:5}}}));"
350:FIXTURE = "window.__G5_HARD_FIXTURE__ = " + json.dumps([GUOYU], ensure_ascii=False) + ";"
353:def flow_home(browser):
373:def flow_migrate(browser):
376:    init = "if(!localStorage.getItem('g5help.v1'))localStorage.setItem('g5math.v1'," + json.dumps(json.dumps(old)) + ");"
381:    check("舊的 g5math.v1 原文沒被改", json.loads(page.evaluate("localStorage.getItem('g5math.v1')")) == old)
386:def flow_steps(browser, label, device=None, shots=False):
419:def flow_dark(browser):
432:def flow_video_live(browser, label, device=None):
455:def flow_codex_help_r1(browser):
459:    init = "if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('g5help.v1','{bad');localStorage.setItem('g5math.v1'," + json.dumps(json.dumps(old)) + ");}"
462:    keys = page.evaluate("Object.keys(localStorage)")
463:    check("必修2 新紀錄壞掉時仍搬入舊紀錄（做完 2 題）；讀取時不動原文（第 4 輪必修 3）", st and st["solved"] == 2 and page.evaluate("localStorage.getItem('g5help.v1')") == "{bad", (st, keys))
466:    keys = page.evaluate("Object.keys(localStorage)")
469:          len(bk) == 1 and page.evaluate(f"localStorage.getItem('{bk[0]}')") == "{bad" and store(page)["solved"] == 3, (bk, store(page)))
494:    big = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'t-guoyu':{idx:9007199254740992,solved:0,streak:0}}}));"
495:    ctx, page, errors = open_page(browser, init=FIXTURE + "if(!sessionStorage.getItem('y')){sessionStorage.setItem('y','1');" + big + "}", url=HOME + "#h/t-guoyu")
507:def flow_codex_help_r2(browser):
510:    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{idx:6,seed:700000,cur:{idx:6,hints:1,wrongs:1}}}}));"
511:    ctx, page, errors = open_page(browser, init="if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');" + seed + "}")
516:    init = ("if(!sessionStorage.getItem('b')){sessionStorage.setItem('b','1');localStorage.setItem('g5help.v1','{bad');}"
517:            "var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).indexOf('g5help.v1.broken.')===0)throw new Error('quota');return _s.call(this,k,v);};")
521:    raw = page.evaluate("localStorage.getItem('g5help.v1')")
525:    ctx, page, errors = open_page(browser, init=FIXTURE + "Storage.prototype.setItem=function(){throw new Error('quota')};")
536:def flow_single_writer(browser, label):
545:    before = b.evaluate("localStorage.getItem('g5help.v1')")
548:    check(f"{label} T01 A 做完一題有存檔", json.loads(a.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p38-6-2"]["solved"] == 1)
549:    check(f"{label} T22 唯讀分頁 B 沒有寫入任何東西", b.evaluate("G5HelpWriter()") is False and before != a.evaluate("localStorage.getItem('g5help.v1')"))
556:    db = json.loads(b.evaluate("localStorage.getItem('g5help.v1')"))["entries"]
566:def flow_codex_r4(browser):
568:    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,r:1},'t-guoyu':{solved:5,idx:5,r:1}}}));"
570:    ctx, pg, errors = open_page(browser, init=FIXTURE + "if(!sessionStorage.getItem('a')){sessionStorage.setItem('a','1');" + seed + "}", url=HOME + "#h/t-guoyu")
575:    raw = pg.evaluate("(function(){Storage.prototype.getItem=window.__origGet;return localStorage.getItem('g5help.v1');})()")
580:    init = ("if(!sessionStorage.getItem('b')){sessionStorage.setItem('b','1');localStorage.setItem('g5help.v1','{bad');}"
581:            "window.__fail=true;var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__fail&&String(k).indexOf('g5help.v1.broken.')===0)throw new Error('quota');return _s.call(this,k,v);};")
586:    check("r4必修2 備份失敗：原文不動、進度標成未存", pg.evaluate("localStorage.getItem('g5help.v1')") == "{bad" and pg.evaluate("G5HelpDirty()") == 1)
597:    # 建議 7（T22）：唯讀分頁對 localStorage 的寫入次數＝0
598:    ctx = browser.new_context(); ctx.add_init_script(FIXTURE + "window.__w=0;var _s2=Storage.prototype.setItem,_r2=Storage.prototype.removeItem;Storage.prototype.setItem=function(k,v){window.__w++;return _s2.call(this,k,v);};Storage.prototype.removeItem=function(k){window.__w++;return _r2.call(this,k);};")
607:def flow_codex_r5(browser, label="Chromium"):
609:    loads = "sessionStorage.setItem('loads',String(+(sessionStorage.getItem('loads')||0)+1));"
610:    seed = "localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,streak:3,clean:8,mastered:true,lessonDone:true,r:1}}}));"
612:    for key, pre in (("g5help.v1", seed), ("g5math.v1", "localStorage.setItem('g5math.v1',JSON.stringify({v:1,solved:4,idx:4,streak:1,clean:4,mastered:false,lessonDone:true}));")):
613:        init = (loads + "if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');" + pre + "}"
631:    init = (loads + "window.__fail=false;var _s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__fail&&k==='g5help.v1')throw new Error('quota');return _s.call(this,k,v);};")
647:        check(f"{label} r5必修2 首頁、沒有未存：套用雲端、寫進存檔、不 reload", r3 is True and json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["p38-6-2"]["solved"] == 20 and pg.evaluate("sessionStorage.getItem('loads')") == "1")
681:    pg.evaluate("""localStorage.setItem('g5help.v1', JSON.stringify({v:1,entries:{'t-guoyu':{solved:7,idx:7,r:50}}}));
688:    db = json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["t-guoyu"]
697:    db = json.loads(pg.evaluate("localStorage.getItem('g5help.v1')"))["entries"]["t-guoyu"]
701:def flow_confused(browser):
712:    pg.evaluate("localStorage.setItem('g5sync.code','ABCDEFGHJKMN'); 0")
    for k, v in (("a.n", 0), ("a.d", 3), ("b.n", sb[0]), ("b.d", sb[1])):
        r1.locator(f'input[data-k="{k}"]').fill(str(v))
    r1.get_by_role("button", name="檢查").click()
    msg = r1.locator(".fb").inner_text()
    check("必修3 填 0/3：說分子是 0、算一次答錯", "分子是 0" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
    r1.locator('input[data-k="a.n"]').fill("")
    r1.get_by_role("button", name="檢查").click()
    msg = r1.locator(".fb").inner_text()
    check("必修3 有格子空白：說還有格子沒填、不算答錯", "還有格子沒填" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
    r1.locator('input[data-k="a.n"]').fill("3.")
    r1.get_by_role("button", name="檢查").click()
    msg = r1.locator(".fb").inner_text()
    check("必修3 填 3.：說只能填整數、不算答錯", "只能填整數" in msg and ((store(page) or {}).get("cur") or {}).get("wrongs") == 1, msg)
    full = lambda n: str(n).translate(str.maketrans("0123456789", "０１２３４５６７８９"))
    for k, v in (("a.n", sa[0]), ("a.d", sa[1]), ("b.n", sb[0]), ("b.d", sb[1])):
        r1.locator(f'input[data-k="{k}"]').fill(full(v))
    r1.get_by_role("button", name="檢查").click()
    check("必修5 練習填全形數字也判對", page.locator("#practice #r2").is_visible(), r1.locator(".fb").inner_text())
    check("必修3/5 練習段沒有 JS 錯誤", not errors, errors)
    ctx.close()


def codex_r1_reopen(browser):
    # 必修 1＋2：做完不按下一題、改按上方按鈕重開；看提示＋答錯後重開
    ctx, page, errors = open_page(browser)
    direct = lambda: page.get_by_role("button", name="我已經會了，直接練習").click()
    direct()
    solve_practice(page, *FIXED[0])
    direct()
    check("必修1 重開練習換成第 2 題，不是重做第 1 題", prob_text(page) == FIXED[1], prob_text(page))
    for _ in range(2):   # Codex 的重現：重開後再把畫面上那題做完，連做兩次
        direct()
        a, b = prob_text(page)
        if (a, b) == FIXED[0]:
            solve_practice(page, a, b)
    st = store(page)
    check("必修1 重開兩次：第 1 題只算一次、沒有因重複計分而學會", sum(1 for x in st["log"] if x["a"] == "24/36") == 1 and not st["mastered"], st["log"])
    r1 = page.locator("#practice #r1")
    r1.get_by_role("button", name="給我提示").click()
    for k, v in (("a.n", 1), ("a.d", 3), ("b.n", 2), ("b.d", 3)):
        r1.locator(f'input[data-k="{k}"]').fill(str(v))
    r1.get_by_role("button", name="檢查").click()
    direct()
    st = store(page)
    check("必修2 重開後仍是第 2 題，且提示 1 次、答錯 1 次都還在", prob_text(page) == FIXED[1] and st.get("cur") == {"idx": 1, "hints": 1, "wrongs": 1}, st.get("cur"))
    solve_practice(page, *prob_text(page))
    st = store(page)
    check("必修2 這題記成「不是自己一次做對」、連續歸零", st["log"][-1]["clean"] is False and st["log"][-1]["hints"] == 1 and st["streak"] == 0, st["log"][-1])
    check("必修1/2 重開段沒有 JS 錯誤", not errors, errors)
    ctx.close()


  bt.onclick = go;
  each(ins, function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
  return box;
}
function stepCard(n, title){
  var s = add($("#lesson"), '<section class="lstep" data-step="' + n + '"><div class="lhead"><span class="n">' + n + '</span><h2>' + title + '</h2></div><div class="lbody"></div><div class="row"><button class="btn ghost sm" type="button" data-confused>這步看不懂</button><span class="small muted" data-cmsg></span></div></section>');
  $("button[data-confused]", s).onclick = function(){ confused(this, n, title); };
  reveal(s);
  return $(".lbody", s);
}
// 孩子按「這步看不懂」→ 送到家裡的 GAS 佇列（交辦 #1319：孩子本人的真實回饋才是白話程度的最終判準），電腦取回後據此改寫那一步
var HELP_EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec";
function confused(btn, n, title){
  var msg = btn.nextElementSibling, code = null, id = E && E.id, subj = E && E.subject;
  try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
  if (!code) { msg.textContent = "這台還沒開同步，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; return; }
  btn.disabled = true; msg.textContent = "送出中…";
  fetch(HELP_EP, {method:"POST", headers:{"Content-Type":"text/plain"}, credentials:"omit", body:JSON.stringify({op:"confused", code:code, subject:subj, entry:id, step:n, title:String(title).replace(/<[^>]*>/g, "").slice(0, 200)})})
    .then(function(r){ return r.json(); })
    .then(function(r){ msg.textContent = r && r.ok ? "收到了！會換一個更好懂的說法。先試試看下一步。" : "沒送成功，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; if (!(r && r.ok)) btn.disabled = false; })
    .catch(function(){ msg.textContent = "沒送成功（可能沒有網路），請跟爸爸媽媽說：第 " + n + " 步看不懂。"; btn.disabled = false; });
}

// ---------- 題目列 ----------
function setBox(s){ var b = $("#box"); b.innerHTML = s ? sym(s) : ""; b.classList.toggle("got", !!s); b.setAttribute("aria-label", s ? "答案 " + s : "空格"); }
function drawProb(){ $("#prob").innerHTML = fr(A) + '<span class="box" id="box" role="img" aria-label="空格"></span>' + fr(B); }

// ---------- 教學（習作那一題） ----------
function startLesson(){
  if (E.kind === "steps") return stepsLesson();
  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false; setBox("");
  step1();
}
function step1(){
  var b = stepCard(1, "先看分母"), m = F.multiplesUntil(A, B);
  add(b, '<p>兩個分數的分母是 <b>' + A.d + '</b> 和 <b>' + B.d + '</b>，不一樣，要先通分才能比。</p>' +
    '<p>如果直接通分，要找 ' + A.d + ' 和 ' + B.d + ' 的公倍數。把 ' + m.big + ' 的倍數一個一個寫出來：</p>' +
    '<div class="mults">' + m.list.map(function(x, i){ return '<span' + (i === m.list.length - 1 ? ' class="hit"' : '') + '>' + x + '</span>'; }).join("") + '</div>' +
    '<p>要寫到第 ' + m.list.length + ' 個 <b>' + m.lcm + '</b>，才剛好也是 ' + m.small + ' 的倍數。分數會變成「？/' + m.lcm + '」，數字太大，很容易算錯。</p>');
  var pr = E.prior || {q:"數字很大的分數，怎麼讓它們變小？", ok:"對！先約分，數字變小，再通分。", hint:"想想看：分子分母一起除以同一個數，叫做什麼？"};
  chipsAsk(b, pr.q, [
    {label:"分子分母一起乘大一點", value:"mul"},
    {label:"先約分：分子分母一起除以同一個數", value:"red"},
    {label:"直接比分子，" + A.n + " 比 " + B.n + (A.n > B.n ? " 大" : A.n < B.n ? " 小" : " 一樣"), value:"num"}
// 五年級難題解說：律師傳來「她不懂這題」的題目，一題一篇、只講那一題，不分科目（2026-10-13 律師：「不需要重新解說整張試卷，
// 而只需要特別解說我傳給你的題目」「不論是哪一種科目，諸如國、數、自然、社會、英文」）。
// 新增一篇＝在 LIST 加一個物件；tests/hard.test.js 會逐篇驗欄位，數學題另驗算答案。
// kind：frac-compare＝異分母分數比大小（互動算題，用 src/frac.js 判對錯）；
//       steps＝任何科目通用：分步解說（每步可附圖與確認題）＋答案＋同型練習（選擇題）。
// steps 的欄位：question（題目）、steps[{title, say, fig?, check?{q, opts[], a, why[]}}]、answer、write?、practice[{q, opts[], a, why[]}]
(function (root) {
  "use strict";
  var LIST = [
    {
      id: "p38-6-2", date: "2026-10-12", subject: "數學", kind: "frac-compare",
      source: "習作第 38 頁・第 6 題②", ask: "先通分，再比較大小，在□中填入 > 或 <。",
      title: "28/42 和 27/45 比大小",
      tag: "先約分，再通分",
      a: { n: 28, d: 42 }, b: { n: 27, d: 45 },
      lead: "這題的分母 42 和 45 都很大，直接通分會很辛苦。跟著下面一步一步做，每一步都要你自己動手算。",
      // 她同一頁第①題自己做對的方法（照片：18/32＝9/16、21/48＝7/16），拿來接新觀念
      prior: {
        q: "第①題的 18/32 和 21/48 數字也很大，你是怎麼讓它們變小的？",
        ok: "對！第①題你把 18/32 約成 9/16。這題也一樣：先約分，數字變小，再通分。",
        hint: "想想第①題你是怎麼把 18/32 變成 9/16 的。"
      },
      parent: "<p><b>這題比同一頁其他題難在哪：</b>42 和 45 直接通分要用 630（最小公倍數），數字太大。關鍵是先約分：28/42 = 2/3、27/45 = 3/5，再用 15 通分：10/15 &gt; 9/15，所以□填「&gt;」。</p>" +
        "<p><b>這裡教的兩件事：</b>①數字大的時候先約分（約分不會改變分數大小，用長條圖讓她看到）；②怎麼找能一起除的數（從乘法表的 2、3、5、7、9 試）。同一頁①③④和第 7 題的通分寫法都對，所以不重教通分本身。</p>" +
        "<p><b>陪她時可以追問一句：</b>「為什麼這題要先約分？」聽到「數字太大，先約分比較好算；約分不會改變大小」就表示懂了。</p>",
        { id: "95ffZ3un7eg", start: 149, end: 297, len: "約 2 分半", title: "榕樹的氣生根、板根和支柱根（教學節目片段）",
          note: "先看榕樹從樹枝垂下來的氣生根，再看真的板根：講解員摸著樹幹底部說明板根讓樹站得更穩。畫面有繁體字幕。" },
        { id: "LQPR67ud3UI", start: 317, end: 352, len: "約 35 秒", title: "板根像電線桿的基座（有夠好。就是要讓你懂）",
          note: "長在硬地或土層淺的地方，根會長成一片片的板根來撐住大樹，就像電線桿底下的基座。" }
      ],
      parent: "<p><b>她這題其實勾對了</b>（(2)(3)）。這篇是讓她確定「為什麼對」：分清楚板根（突出地面、三角形、幫忙站穩）和榕樹的氣生根（像鬍鬚垂下來），並知道繁殖靠花、果實、種子。</p><p><b>可以追問一句：</b>「板根和榕樹的鬍鬚根有什麼不一樣？」聽到「板根在地上、像三角形翅膀、讓樹站穩；鬍鬚根從樹枝垂下來」就表示懂了。</p>"
    }
  ];
  // 端到端測試用：頁面載入前若有 window.__G5_HARD_FIXTURE__（只有測試會放），併入清單
  if (root && root.__G5_HARD_FIXTURE__ && Array.isArray(root.__G5_HARD_FIXTURE__)) LIST = LIST.concat(root.__G5_HARD_FIXTURE__);
  function get(id) { for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i]; return null; }
  var SUBJECTS = ["國語", "數學", "自然", "社會", "英文", "其他"];
  // 白話程度跟著年級走（2026-10-13 律師：「現在小五，就用小五生的白話易懂程度；之後小六，就用小六生的」）。
  // 學年度 8/1 換年級：2026 學年（2026-08-01～2027-07-31）＝小五。每句上限是寫給孩子讀的長度，tests/hard.test.js 逐句檢查。
  // 用詞難度（交辦 #1319）：句長只是代理指標，看不懂多半卡在詞。下面是「超出小五課本、第一次出現就要附白話」的詞；
  // 每篇另在 words 列出本篇自己的難詞。tests/hard.test.js 檢查第一次出現時寫成「詞（白話）」「（詞）」或「叫「詞」」。
  // 這張表只擋得住列進來的詞；沒列到的靠 readReview（第二個模型依年級審）與孩子按「這步看不懂」補。
  var HARD_WORDS = { "翼狀": "像翅膀的形狀", "氣生根": "長在空氣中的根", "板根": "突出地面、像木板的根", "繁殖": "生出新的植物或動物", "蒸散": "水從葉子變成水蒸氣跑出去", "光合作用": "植物用陽光把水和二氧化碳做成養分", "最小公倍數": "兩個數共同倍數裡最小的那個" };
  var GRADE_BASE = { schoolYear: 2026, grade: 5 };
  var READING = { 5: { maxSentence: 40, label: "小五" }, 6: { maxSentence: 45, label: "小六" }, 7: { maxSentence: 50, label: "國一" }, 8: { maxSentence: 55, label: "國二" }, 9: { maxSentence: 60, label: "國三" } };
  function gradeAt(d) { var y = d.getFullYear() - (d.getMonth() < 7 ? 1 : 0); return GRADE_BASE.grade + (y - GRADE_BASE.schoolYear); }
  function readingAt(d) { var g = gradeAt(d); return READING[g] || READING[9]; }
  var api = { LIST: LIST, get: get, SUBJECTS: SUBJECTS, KINDS: ["frac-compare", "steps"], gradeAt: gradeAt, readingAt: readingAt, READING: READING, HARD_WORDS: HARD_WORDS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5Hard = api;
})(typeof window !== "undefined" ? window : this);

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[███░░░░░░░] 30%｜瀏覽器驗收受限｜Playwright 已載入，但唯讀沙箱拒絕建立瀏覽器暫存目錄（EPERM）；Chromium／WebKit e2e 未執行，改以記憶體中的原碼與 DOM／Storage 替身驗證。
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '337,350p' tests/e2e.py; sed -n '363,395p' src/app.html; tail -50 tests/sync.test.js" in /Users/william/Documents/g5-help
 succeeded in 0ms:
    check("欄位型別錯：idx 回 0、lessonDone 回 false、log 回空陣列", st["idx"] == 0 and st["lessonDone"] is False and st["log"] == [], st)
    check("壞存檔：沒有 JS 錯誤", not errors and not errors2, errors + errors2)
    ctx.close(); ctx2.close()


GUOYU = {"id": "t-guoyu", "date": "2026-10-13", "subject": "國語", "kind": "steps", "source": "測試卷第 1 題", "title": "測試：成語填空",
         "question": "「一（　）不苟」的空格要填什麼字？",
         "steps": [{"title": "先想意思", "say": "這個成語是說做事很仔細。",
                    "check": {"q": "做事很仔細，是指哪一種人？", "opts": ["馬虎的人", "認真的人"], "a": 1, "why": ["馬虎是不仔細喔。", ""], "ok": "對！"}},
                   {"title": "再想字", "say": "仔細到連一根頭髮都不放過。"}],
         "answer": "絲", "practice": [{"q": "一絲不（　）", "opts": ["狗", "苟"], "a": 1, "why": ["狗是動物。", ""]},
                                      {"q": "「一絲不苟」的意思是？", "opts": ["很仔細", "很隨便"], "a": 0, "why": ["", "相反喔。"]},
                                      {"q": "誰最一絲不苟？", "opts": ["每一題都檢查兩次的人", "寫完就交卷的人"], "a": 0, "why": ["", "沒檢查喔。"]}]}
FIXTURE = "window.__G5_HARD_FIXTURE__ = " + json.dumps([GUOYU], ensure_ascii=False) + ";"
}
function stepCard(n, title){
  var s = add($("#lesson"), '<section class="lstep" data-step="' + n + '"><div class="lhead"><span class="n">' + n + '</span><h2>' + title + '</h2></div><div class="lbody"></div><div class="row"><button class="btn ghost sm" type="button" data-confused>這步看不懂</button><span class="small muted" data-cmsg></span></div></section>');
  $("button[data-confused]", s).onclick = function(){ confused(this, n, title); };
  reveal(s);
  return $(".lbody", s);
}
// 孩子按「這步看不懂」→ 送到家裡的 GAS 佇列（交辦 #1319：孩子本人的真實回饋才是白話程度的最終判準），電腦取回後據此改寫那一步
var HELP_EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec";
function confused(btn, n, title){
  var msg = btn.nextElementSibling, code = null, id = E && E.id, subj = E && E.subject;
  try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
  if (!code) { msg.textContent = "這台還沒開同步，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; return; }
  btn.disabled = true; msg.textContent = "送出中…";
  fetch(HELP_EP, {method:"POST", headers:{"Content-Type":"text/plain"}, credentials:"omit", body:JSON.stringify({op:"confused", code:code, subject:subj, entry:id, step:n, title:String(title).replace(/<[^>]*>/g, "").slice(0, 200)})})
    .then(function(r){ return r.json(); })
    .then(function(r){ msg.textContent = r && r.ok ? "收到了！會換一個更好懂的說法。先試試看下一步。" : "沒送成功，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; if (!(r && r.ok)) btn.disabled = false; })
    .catch(function(){ msg.textContent = "沒送成功（可能沒有網路），請跟爸爸媽媽說：第 " + n + " 步看不懂。"; btn.disabled = false; });
}

// ---------- 題目列 ----------
function setBox(s){ var b = $("#box"); b.innerHTML = s ? sym(s) : ""; b.classList.toggle("got", !!s); b.setAttribute("aria-label", s ? "答案 " + s : "空格"); }
function drawProb(){ $("#prob").innerHTML = fr(A) + '<span class="box" id="box" role="img" aria-label="空格"></span>' + fr(B); }

// ---------- 教學（習作那一題） ----------
function startLesson(){
  if (E.kind === "steps") return stepsLesson();
  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false; setBox("");
  step1();
}
function step1(){
  var b = stepCard(1, "先看分母"), m = F.multiplesUntil(A, B);
  add(b, '<p>兩個分數的分母是 <b>' + A.d + '</b> 和 <b>' + B.d + '</b>，不一樣，要先通分才能比。</p>' +

test('S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20)); await a.api.sync(); await b.api.sync();
  await clock.advance(8000); assert.equal(backend.store.record(code).data, data(10));
  b.mode = 'reject'; await b.api.resolve(KEY, 'local'); assert.equal(b.api.getState().status, '離線中，連上網路會自動補上');
  b.mode = 'ok'; await clock.advance(4000);
  assert.equal(backend.store.record(code).data, data(20)); assert.equal(backend.store.record(code).rev, 3);
  assert.equal(Object.keys(b.api.getState().conflicts).length, 0);
});

test('S37 cloud choice retries a failed download and backs up local progress after recovery', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20)); await a.api.sync(); await b.api.sync();
  b.mode = 'html'; await b.api.resolve(KEY, 'cloud'); assert.equal(b.storage.getItem(KEY), data(20));
  b.mode = 'ok'; await clock.advance(4000);
  assert.equal(b.storage.getItem(KEY), data(10)); assert.equal(backups(b)[0][1], data(20));
  assert.equal(backend.store.record(code).rev, 2);
});

test('S30 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入', async t => {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(1)}});
  t.after(() => a.api.destroy());
  await a.api.ready; await a.api.enable();
  const code = a.api.getState().code;
  let allow = true; const accepted = [];
  const b = device(backend, {canReplace: () => allow,
    accept: (key, value) => { accepted.push(key); b.storage.setItem(key, value); return true; }});
  t.after(() => b.api.destroy());
  await b.api.ready; await b.api.join(code);
  assert.equal(b.storage.getItem(KEY), data(1)); assert.deepEqual(accepted, [KEY], '加入時的下載也經由 accept');
  a.storage.setItem(KEY, data(7)); await clock.advance(4000);
  assert.equal(backend.store.record(code).data, data(7));
  // 孩子重開頁面、直接進某一篇（頁面說現在不能換）
  b.api.destroy(); allow = false;
  const b2 = device(backend, {storage: b.storage, canReplace: () => allow,
    accept: (key, value) => { accepted.push(key); b2.storage.setItem(key, value); return true; }});
  t.after(() => b2.api.destroy());
  const nb = backups(b2).length;
  await b2.api.ready; await clock.advance(8000);
  assert.equal(b2.storage.getItem(KEY), data(1), '不允許時本機不被換掉');
  assert.equal(backups(b2).length, nb, '不允許時不寫備份（避免每 4 秒擠掉舊備份）');
  assert.deepEqual(accepted, [KEY]);
  assert.match(b2.api.getState().status, /回到首頁/);
  allow = true; await clock.advance(4000);
  assert.equal(b2.storage.getItem(KEY), data(7), '允許後經由 accept 換成雲端版');
  assert.deepEqual(accepted, [KEY, KEY]);
  assert.equal(backups(b2).length, nb + 1, '真的要換時才備份一次');
});

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e '
'\\''use strict'\\'';
const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
const {Storage,Clock,Document,server,device,flush}=require('\\''./tests/harness'\\'');
const KEY='\\''g5help.v1'\\'', ID='\\''p38-6-2'\\'', GID='\\''t-guoyu'\\'', CODE='\\''ABCDEFGHJKMN'\\'';
const html=fs.readFileSync('\\''src/app.html'\\'','\\''utf8'\\'');
const decode=s=>String(s).replace(/&gt;/g,'\\''>'\\'').replace(/&lt;/g,'\\''<'\\'').replace(/&quot;/g,'\\''\"'\\'').replace(/&amp;/g,'\\''&'\\'');
class El{
 constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
 appendChild(e){if(e.parentNode)e.parentNode.removeChild(e);this.children.push(e);e.parentNode=this;return e;}
 removeChild(e){this.children.splice(this.children.indexOf(e),1);e.parentNode=null;return e;}
 remove(){if(this.parentNode)this.parentNode.removeChild(this);}
 get firstChild(){return this.children[0]||null;}get firstElementChild(){return this.firstChild;}
 get nextElementSibling(){if("'!this.parentNode)return null;return this.parentNode.children[this.parentNode.children.indexOf(this)+1]||null;}
 setAttribute(k,v){v=decode(v);this.attributes[k]=v;if(k==='"'\\''class'\\'')this.className=v;if(k==='\\''id'\\'')this.id=v;if(k==='\\''hidden'\\''||k==='\\''disabled'\\'')this[k]=true;if(k.startsWith('\\''data-'\\''))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
 getAttribute(k){return this.attributes[k]??null;}
 set innerHTML(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text='\\'''\\'';const stack=[this];const re=/<"'!--['"\\s\\S]*?-->|<\\/?([A-Za-z][\\w:-]*)(?:\\s+(?:\"["'^"]*"|'"'\\''["'^'"'\\'']*'\\''|["'^'"'\\''\">])*)?\\/?>|(["'^<]+)/g;let m;while((m=re.exec(s))){if(m[0].startsWith('"'\\''<"'!--'"'\\''))continue;let cur=stack[stack.length-1];if("'!m[1]){cur._text+=decode(m[2]||'"'\\'''\\'');continue;}if(m[0].startsWith('\\''</'\\'')){if(stack.length>1)stack.pop();continue;}const e=new El(m[1],this.ownerDocument);const attrs=m[0].slice(m[1].length+1,-1);for(const a of attrs.matchAll(/([:\\w-]+)(?:\\s*=\\s*(?:\"(["'^"]*)"|'"'\\''(["'^'"'\\'']*)'\\''|(["'^'"\\s\"'\\''=<>]+)))?/g))e.setAttribute(a[1],a[2]??a[3]??a[4]??'\\'''\\'');cur.appendChild(e);if("'!/''^(input|img|br|hr|meta|link|source|area|embed|wbr)$/i.test(m[1])&&!m[0].endsWith('"'\\''/>'\\''))stack.push(e);}}
 get innerHTML(){return this.textContent;}set textContent(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text=String(s);}get textContent(){return this._text+this.children.map(c=>c.textContent).join('\\'''\\'');}
 descendants(){return this.children.flatMap(c=>[c,...c.descendants()]);}
 matches(s){let ok=true;s=s.replace(/\\[([\\w-]+)(?:=[\"'\\'']?(["'^"'"'\\''\\]]*)[\"'\\'']?)?\\]/g,(_,k,v)=>{if("'!Object.hasOwn(this.attributes,k)||(v!==undefined&&this.attributes[k]!==decode(v)))ok=false;return '"'\\'''\\'';});s=s.replace(/#([\\w-]+)/g,(_,id)=>{if(this.id"'!==id)ok=false;return '"'\\'''\\'';});s=s.replace(/\\.([\\w-]+)/g,(_,c)=>{if("'!this.className.split(/'"\\s+/).includes(c))ok=false;return '\\'''\\'';});return ok&&("'!s.trim()||this.tagName===s.trim().toUpperCase());}
 querySelectorAll(sel){const parts=sel.split('"'\\'','\\'').map(s=>s.trim());return this.descendants().filter(e=>parts.some(p=>{const chain=p.split(/\\s+(?"'![''^'"\\[]*\\])/);if("'!e.matches(chain.pop()))return false;let a=e.parentNode;while(chain.length){const want=chain.pop();while(a&&!a.matches(want))a=a.parentNode;if(!a)return false;a=a.parentNode;}return true;}));}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 addEventListener(t,f){(this.listeners[t]||=[]).push(f);}removeEventListener(t,f){this.listeners[t]=(this.listeners[t]||[]).filter(x=>x!==f);}
 click(){if(!this.disabled){if(this.onclick)this.onclick({preventDefault(){}});for(const f of this.listeners.click||[])f.call(this,{preventDefault(){}});}}
 scrollIntoView(){}focus(){}select(){}
}
const fixture={id:GID,date:'"'\\''2026-10-13'\\'',subject:'\\''國語'\\'',kind:'\\''steps'\\'',source:'\\''測試卷第 1 題'\\'',title:'\\''測試：成語填空'\\'',question:'\\''一（ ）不苟'\\'',steps:[{title:'\\''先想意思'\\'',say:'\\''做事仔細'\\'',check:{q:'\\''哪種人'\\'',opts:['\\''馬虎'\\'','\\''認真'\\''],a:1}},{title:'\\''再想字'\\'',say:'\\''一根頭髮'\\''}],answer:'\\''絲'\\'',practice:[{q:'\\''一絲不（ ）'\\'',opts:['\\''狗'\\'','\\''苟'\\''],a:1},{q:'\\''意思'\\'',opts:['\\''仔細'\\'','\\''隨便'\\''],a:0},{q:'\\''誰'\\'',opts:['\\''仔細的人'\\'','\\''隨便的人'\\''],a:0}]};
const raw=n=>JSON.stringify({v:1,entries:{[ID]:{solved:n,idx:n,streak:3,clean:n,mastered:true,lessonDone:true,r:1,seed:22}}});
function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
 const stg=storage||new Storage(initial), clock=new Clock(), doc=new El('\\''document'\\'');doc.ownerDocument=doc;doc.createElement=t=>new El(t,doc);doc.getElementById=id=>doc.querySelector('\\''#'\\''+id);
 doc.innerHTML=html.slice(html.indexOf('\\''<div class=\"wrap\">'\\''),html.indexOf('\\''<script src='\\''));
 const events={};let reloads=0,lockcb;const location={hash,reload(){reloads++;}};
 const d={stg,clock,doc,events,readFail,writeFail,reads:[],writes:[]};
 const baseGet=stg.getItem.bind(stg),baseSet=stg.setItem.bind(stg);
 stg.getItem=k=>{d.reads.push(k);if(d.readFail&&d.readFail(k))throw new Error('\\''get-fail'\\'');return baseGet(k);};
 stg.setItem=(k,v)=>{d.writes.push([k,v]);if(d.writeFail&&d.writeFail(k,v))throw new Error('\\''set-fail'\\'');baseSet(k,v);};
 const w={document:doc,location,localStorage:stg,scrollTo(){},matchMedia:()=>({matches:true}),__G5_HARD_FIXTURE__:[fixture],
  navigator:{locks:{request(name,opts,cb){if(typeof opts==='\\''function'\\'')return new Promise(()=>{});lockcb=cb;return new Promise(()=>{});}}},
  addEventListener(t,f){(events[t]||=[]).push(f);},removeEventListener(){},dispatchEvent(e){for(const f of events[e.type]||[])f(e);},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout,setInterval:clock.setInterval,clearInterval:clock.clearInterval};
 const ctx={window:w,document:doc,navigator:w.navigator,location,localStorage:stg,console,Event:class{constructor(type){this.type=type;}},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout};
 vm.createContext(ctx);
 for(const f of ['\\''src/frac.js'\\'','\\''src/hard.js'\\''])vm.runInContext(fs.readFileSync(f,'\\''utf8'\\''),ctx,{filename:f});
 const script=[...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][0][1];
 // Expose only references for observations; all application function bodies run unchanged.
 const exposed=script.replace('\\''window.G5HelpPage ='\\'','\\''window.__review={save,route,retryRead,openPractice,startLesson,get:()=>({DB,st,E,READY,WRITER,GEN})};window.G5HelpPage ='\\'');
 vm.runInContext(exposed,ctx,{filename:'\\''src/app.html'\\''});
 // Real sync wiring is evaluated against a capture-only init; real sync is tested separately with shared storage.
 w.G5Sync={init:o=>{d.syncOptions=o;return {};}};
 vm.runInContext([...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][1][1],ctx,{filename:'\\''src/app.html-sync-wiring'\\''});
 lockcb(writer?{}:null);
 Object.assign(d,{w,ctx,q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),go(id){location.hash=id?'\\''#h/'\\''+id:'\\'''\\'';w.dispatchEvent(new ctx.Event('\\''hashchange'\\''));},disk:()=>JSON.parse(baseGet(KEY)||'\\''null'\\''),peek:baseGet,reloads:()=>reloads});
 return d;
}
function check(name,fn){const out=fn();console.log('\\''PASS'\\'',name,JSON.stringify(out??true));}
const gcd=(a,b)=>b?gcd(b,a%b):a;
function mathAnswer(d){
 const st=d.w.G5HelpPage.state(ID),p=d.w.G5Frac.problem(st.idx,st.seed);
 const a={n:p.a.n/gcd(p.a.n,p.a.d),d:p.a.d/gcd(p.a.n,p.a.d)},b={n:p.b.n/gcd(p.b.n,p.b.d),d:p.b.d/gcd(p.b.n,p.b.d)};
 for(const [k,v]of Object.entries({'\\''a.n'\\'':a.n,'\\''a.d'\\'':a.d,'\\''b.n'\\'':b.n,'\\''b.d'\\'':b.d}))d.q('\\''#r1 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r1 button[data-check]'\\'').click();
 const l=a.d*b.d/gcd(a.d,b.d);
 for(const [k,v]of Object.entries({'\\''c.n'\\'':a.n*l/a.d,'\\''c.d'\\'':l,'\\''e.n'\\'':b.n*l/b.d,'\\''e.d'\\'':l}))d.q('\\''#r2 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r2 button[data-check]'\\'').click();
 const sign=a.n*b.d===b.n*a.d?'\\''='\\'':a.n*b.d>b.n*a.d?'\\''>'\\'':'\\''<'\\'',button=d.all('\\''#r3 .chip'\\'').find(b=>b.dataset.s===sign);
 const fn=button.onclick;button.click();return {fn,button};
}
function choose(d){const s=d.w.G5HelpPage.state(GID),b=d.q('\\''#practice .chip[data-k=\"'\\''+fixture.practice[s.idx%3].a+'\\''\"]'\\'');const fn=b.onclick;b.click();return {fn,b};}

const d=app();d.q('\\''#goPractice'\\'').click();mathAnswer(d);assert.equal(d.disk().entries[ID].solved,1);console.log('\\''DOM_HARNESS_SMOKE'\\'',d.disk().entries[ID].solved);
const g=app({hash:'\\''#h/'\\''+GID});g.q('\\''#goPractice'\\'').click();choose(g);assert.equal(g.disk().entries[GID].solved,1);console.log('\\''CHOICE_SMOKE'\\'',g.disk().entries[GID].solved);
'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
DOM_HARNESS_SMOKE 1
CHOICE_SMOKE 1

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e '
'\\''use strict'\\'';
const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
const {Storage,Clock,Document,server,device,flush}=require('\\''./tests/harness'\\'');
const KEY='\\''g5help.v1'\\'', ID='\\''p38-6-2'\\'', GID='\\''t-guoyu'\\'', CODE='\\''ABCDEFGHJKMN'\\'';
const html=fs.readFileSync('\\''src/app.html'\\'','\\''utf8'\\'');
const decode=s=>String(s).replace(/&gt;/g,'\\''>'\\'').replace(/&lt;/g,'\\''<'\\'').replace(/&quot;/g,'\\''\"'\\'').replace(/&amp;/g,'\\''&'\\'');
class El{
 constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
 appendChild(e){if(e.parentNode)e.parentNode.removeChild(e);this.children.push(e);e.parentNode=this;return e;}
 removeChild(e){this.children.splice(this.children.indexOf(e),1);e.parentNode=null;return e;}
 remove(){if(this.parentNode)this.parentNode.removeChild(this);}
 get firstChild(){return this.children[0]||null;}get firstElementChild(){return this.firstChild;}
 get nextElementSibling(){if("'!this.parentNode)return null;return this.parentNode.children[this.parentNode.children.indexOf(this)+1]||null;}
 setAttribute(k,v){v=decode(v);this.attributes[k]=v;if(k==='"'\\''class'\\'')this.className=v;if(k==='\\''id'\\'')this.id=v;if(k==='\\''hidden'\\''||k==='\\''disabled'\\'')this[k]=true;if(k.startsWith('\\''data-'\\''))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
 getAttribute(k){return this.attributes[k]??null;}
 set innerHTML(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text='\\'''\\'';const stack=[this];const re=/<"'!--['"\\s\\S]*?-->|<\\/?([A-Za-z][\\w:-]*)(?:\\s+(?:\"["'^"]*"|'"'\\''["'^'"'\\'']*'\\''|["'^'"'\\''\">])*)?\\/?>|(["'^<]+)/g;let m;while((m=re.exec(s))){if(m[0].startsWith('"'\\''<"'!--'"'\\''))continue;let cur=stack[stack.length-1];if("'!m[1]){cur._text+=decode(m[2]||'"'\\'''\\'');continue;}if(m[0].startsWith('\\''</'\\'')){if(stack.length>1)stack.pop();continue;}const e=new El(m[1],this.ownerDocument);const attrs=m[0].slice(m[1].length+1,-1);for(const a of attrs.matchAll(/([:\\w-]+)(?:\\s*=\\s*(?:\"(["'^"]*)"|'"'\\''(["'^'"'\\'']*)'\\''|(["'^'"\\s\"'\\''=<>]+)))?/g))e.setAttribute(a[1],a[2]??a[3]??a[4]??'\\'''\\'');cur.appendChild(e);if("'!/''^(input|img|br|hr|meta|link|source|area|embed|wbr)$/i.test(m[1])&&!m[0].endsWith('"'\\''/>'\\''))stack.push(e);}}
 get innerHTML(){return this.textContent;}set textContent(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text=String(s);}get textContent(){return this._text+this.children.map(c=>c.textContent).join('\\'''\\'');}
 descendants(){return this.children.flatMap(c=>[c,...c.descendants()]);}
 matches(s){let ok=true;s=s.replace(/\\[([\\w-]+)(?:=[\"'\\'']?(["'^"'"'\\''\\]]*)[\"'\\'']?)?\\]/g,(_,k,v)=>{if("'!Object.hasOwn(this.attributes,k)||(v!==undefined&&this.attributes[k]!==decode(v)))ok=false;return '"'\\'''\\'';});s=s.replace(/#([\\w-]+)/g,(_,id)=>{if(this.id"'!==id)ok=false;return '"'\\'''\\'';});s=s.replace(/\\.([\\w-]+)/g,(_,c)=>{if("'!this.className.split(/'"\\s+/).includes(c))ok=false;return '\\'''\\'';});return ok&&("'!s.trim()||this.tagName===s.trim().toUpperCase());}
 querySelectorAll(sel){const parts=sel.split('"'\\'','\\'').map(s=>s.trim());return this.descendants().filter(e=>parts.some(p=>{const chain=p.split(/\\s+(?"'![''^'"\\[]*\\])/);if("'!e.matches(chain.pop()))return false;let a=e.parentNode;while(chain.length){const want=chain.pop();while(a&&!a.matches(want))a=a.parentNode;if(!a)return false;a=a.parentNode;}return true;}));}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 addEventListener(t,f){(this.listeners[t]||=[]).push(f);}removeEventListener(t,f){this.listeners[t]=(this.listeners[t]||[]).filter(x=>x!==f);}
 click(){if(!this.disabled){if(this.onclick)this.onclick({preventDefault(){}});for(const f of this.listeners.click||[])f.call(this,{preventDefault(){}});}}
 scrollIntoView(){}focus(){}select(){}
}
const fixture={id:GID,date:'"'\\''2026-10-13'\\'',subject:'\\''國語'\\'',kind:'\\''steps'\\'',source:'\\''測試卷第 1 題'\\'',title:'\\''測試：成語填空'\\'',question:'\\''一（ ）不苟'\\'',steps:[{title:'\\''先想意思'\\'',say:'\\''做事仔細'\\'',check:{q:'\\''哪種人'\\'',opts:['\\''馬虎'\\'','\\''認真'\\''],a:1}},{title:'\\''再想字'\\'',say:'\\''一根頭髮'\\''}],answer:'\\''絲'\\'',practice:[{q:'\\''一絲不（ ）'\\'',opts:['\\''狗'\\'','\\''苟'\\''],a:1},{q:'\\''意思'\\'',opts:['\\''仔細'\\'','\\''隨便'\\''],a:0},{q:'\\''誰'\\'',opts:['\\''仔細的人'\\'','\\''隨便的人'\\''],a:0}]};
const raw=n=>JSON.stringify({v:1,entries:{[ID]:{solved:n,idx:n,streak:3,clean:n,mastered:true,lessonDone:true,r:1,seed:22}}});
function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
 const stg=storage||new Storage(initial), clock=new Clock(), doc=new El('\\''document'\\'');doc.ownerDocument=doc;doc.createElement=t=>new El(t,doc);doc.getElementById=id=>doc.querySelector('\\''#'\\''+id);
 doc.innerHTML=html.slice(html.indexOf('\\''<div class=\"wrap\">'\\''),html.indexOf('\\''<script src='\\''));
 const events={};let reloads=0,lockcb;const location={hash,reload(){reloads++;}};
 const d={stg,clock,doc,events,readFail,writeFail,reads:[],writes:[]};
 const baseGet=stg.getItem.bind(stg),baseSet=stg.setItem.bind(stg);
 stg.getItem=k=>{d.reads.push(k);if(d.readFail&&d.readFail(k))throw new Error('\\''get-fail'\\'');return baseGet(k);};
 stg.setItem=(k,v)=>{d.writes.push([k,v]);if(d.writeFail&&d.writeFail(k,v))throw new Error('\\''set-fail'\\'');baseSet(k,v);};
 const w={document:doc,location,localStorage:stg,scrollTo(){},matchMedia:()=>({matches:true}),__G5_HARD_FIXTURE__:[fixture],
  navigator:{locks:{request(name,opts,cb){if(typeof opts==='\\''function'\\'')return new Promise(()=>{});lockcb=cb;return new Promise(()=>{});}}},
  addEventListener(t,f){(events[t]||=[]).push(f);},removeEventListener(){},dispatchEvent(e){for(const f of events[e.type]||[])f(e);},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout,setInterval:clock.setInterval,clearInterval:clock.clearInterval};
 const ctx={window:w,document:doc,navigator:w.navigator,location,localStorage:stg,console,Event:class{constructor(type){this.type=type;}},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout};
 vm.createContext(ctx);
 for(const f of ['\\''src/frac.js'\\'','\\''src/hard.js'\\''])vm.runInContext(fs.readFileSync(f,'\\''utf8'\\''),ctx,{filename:f});
 const script=[...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][0][1];
 // Expose only references for observations; all application function bodies run unchanged.
 const exposed=script.replace('\\''window.G5HelpPage ='\\'','\\''window.__review={save,route,retryRead,openPractice,startLesson,get:()=>({DB,st,E,READY,WRITER,GEN})};window.G5HelpPage ='\\'');
 vm.runInContext(exposed,ctx,{filename:'\\''src/app.html'\\''});
 // Real sync wiring is evaluated against a capture-only init; real sync is tested separately with shared storage.
 w.G5Sync={init:o=>{d.syncOptions=o;return {};}};
 vm.runInContext([...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][1][1],ctx,{filename:'\\''src/app.html-sync-wiring'\\''});
 lockcb(writer?{}:null);
 Object.assign(d,{w,ctx,q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),go(id){location.hash=id?'\\''#h/'\\''+id:'\\'''\\'';w.dispatchEvent(new ctx.Event('\\''hashchange'\\''));},disk:()=>JSON.parse(baseGet(KEY)||'\\''null'\\''),peek:baseGet,reloads:()=>reloads});
 return d;
}
function check(name,fn){const out=fn();console.log('\\''PASS'\\'',name,JSON.stringify(out??true));}
const gcd=(a,b)=>b?gcd(b,a%b):a;
function mathAnswer(d){
 const st=d.w.G5HelpPage.state(ID),p=d.w.G5Frac.problem(st.idx,st.seed);
 const a={n:p.a.n/gcd(p.a.n,p.a.d),d:p.a.d/gcd(p.a.n,p.a.d)},b={n:p.b.n/gcd(p.b.n,p.b.d),d:p.b.d/gcd(p.b.n,p.b.d)};
 for(const [k,v]of Object.entries({'\\''a.n'\\'':a.n,'\\''a.d'\\'':a.d,'\\''b.n'\\'':b.n,'\\''b.d'\\'':b.d}))d.q('\\''#r1 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r1 button[data-check]'\\'').click();
 const l=a.d*b.d/gcd(a.d,b.d);
 for(const [k,v]of Object.entries({'\\''c.n'\\'':a.n*l/a.d,'\\''c.d'\\'':l,'\\''e.n'\\'':b.n*l/b.d,'\\''e.d'\\'':l}))d.q('\\''#r2 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r2 button[data-check]'\\'').click();
 const sign=a.n*b.d===b.n*a.d?'\\''='\\'':a.n*b.d>b.n*a.d?'\\''>'\\'':'\\''<'\\'',button=d.all('\\''#r3 .chip'\\'').find(b=>b.dataset.s===sign);
 const fn=button.onclick;button.click();return {fn,button};
}
function choose(d){const s=d.w.G5HelpPage.state(GID),b=d.q('\\''#practice .chip[data-k=\"'\\''+fixture.practice[s.idx%3].a+'\\''\"]'\\'');const fn=b.onclick;b.click();return {fn,b};}

(async()=>{
for(const legacy of [false,true]){
 const initial=legacy?{'\\''g5math.v1'\\'':JSON.stringify({v:1,solved:8,idx:8,mastered:true,clean:8,streak:3})}:{[KEY]:raw(8)},fk=legacy?'\\''g5math.v1'\\'':KEY;
 const d=app({initial,readFail:k=>k===fk});
 assert.equal(d.q('\\''#goPractice'\\''),null);assert.ok(d.q('\\''#readRetry'\\''));assert.equal(d.w.__review.get().READY,false);assert.equal(d.writes.length,0);
 d.readFail=null;d.q('\\''#readRetry'\\'').click();assert.equal(d.w.G5HelpPage.state(ID).solved,8);d.q('\\''#goPractice'\\'').click();mathAnswer(d);
 assert.equal(d.disk().entries[ID].solved,9);assert.equal(d.disk().entries[ID].mastered,true);
 const reopen=app({initial:d.stg.dump()});assert.equal(reopen.w.G5HelpPage.state(ID).solved,9);
 console.log('\\''PASS R5-1'\\'',fk,'\\''blocked then retry => solved=9, mastered=true; reopened=9'\\'');
}
const d=app({hash:'\\''#h/'\\''+GID});d.writeFail=k=>k===KEY;d.q('\\''#goPractice'\\'').click();choose(d);
assert.equal(d.w.G5HelpDirty(),1);const cloud=raw(20);
assert.equal(d.syncOptions.canReplace(KEY),false);assert.equal(d.syncOptions.accept(KEY,cloud),false);
d.go();assert.equal(d.syncOptions.accept(KEY,cloud),false);
const warn=d.q('\\''#saveWarn'\\'');assert.equal(warn.hidden,false);assert.notEqual(warn.parentNode.id,'\\''entry'\\'');
d.writeFail=null;await d.clock.advance(3000);assert.equal(d.w.G5HelpDirty(),0);assert.equal(d.disk().entries[GID].solved,1);assert.equal(warn.hidden,true);
d.go(GID);assert.equal(d.syncOptions.accept(KEY,cloud),false);
d.go();assert.equal(d.syncOptions.accept(KEY,cloud),true);assert.equal(d.disk().entries[ID].solved,20);
d.go(GID);d.writeFail=k=>k===KEY;d.q('\\''#goPractice'\\'').click();choose(d);await d.clock.advance(10000);assert.equal(d.reloads(),0);assert.equal(d.w.G5HelpDirty(),1);
console.log('\\''PASS R5-2 real wiring hooks block dirty/home and entry/clean; home/clean applies; after new failed save + timers reload=0, dirty=1'\\'');
console.log('\\''PASS R5-3 global warn visible at home; recovery + 3000ms saves solved=1; DIRTY=0 and warning hidden'\\'');
const s=app({hash:'\\''#h/'\\''+GID});s.q('\\''#goLesson'\\'').click();s.q('\\''#lesson .chip[data-i=\"1\"]'\\'').click();const old=s.q('\\''button[data-next]'\\''),fn=old.onclick;s.go(ID);fn.call(old);assert.equal(s.all('\\''#lesson .lstep'\\'').length,0);
const t=app({hash:'\\''#h/'\\''+GID});t.q('\\''#goPractice'\\'').click();const stref=t.w.__review.get().st,cur=stref.cur;
t.stg.setItem(KEY,JSON.stringify({v:1,entries:{[GID]:{solved:7,idx:7,r:50}}}));t.w.dispatchEvent({type:'\\''storage'\\'',key:KEY});assert.equal(t.w.__review.get().st,stref);assert.equal(t.w.__review.get().st.cur,cur);
const answered=choose(t);answered.fn.call(answered.b);assert.equal(t.disk().entries[GID].solved,1);assert.equal(t.disk().entries[GID].log.length,1);
console.log('\\''PASS R5-4 original stale data-next callback ignored; injected storage + current answer persisted solved=1; replay counted once'\\'');
const m=app();m.q('\\''#goPractice'\\'').click();const mr=mathAnswer(m);mr.fn.call(mr.button);assert.equal(m.disk().entries[ID].solved,1);assert.equal(m.disk().entries[ID].log.length,1);
console.log('\\''PASS INVARIANT-4 math duplicate answer => solved=1, log=1'\\'');
for(const mode of ['\\''primary'\\'','\\''backup'\\'']){
 const a=app({initial:mode==='\\''backup'\\''?{[KEY]:'\\''{bad'\\''}:{[KEY]:raw(8)}});
 a.writeFail=k=>mode==='\\''backup'\\''?k.startsWith(KEY+'\\''.broken.'\\''):k===KEY;a.q('\\''#goPractice'\\'').click();mathAnswer(a);a.go(GID);a.q('\\''#goPractice'\\'').click();choose(a);a.go();assert.equal(a.w.G5HelpDirty(),2);
 const before=a.peek(KEY);a.writeFail=null;await a.clock.advance(3000);
 assert.equal(a.w.G5HelpDirty(),0);assert.equal(a.disk().entries[ID].solved,mode==='\\''backup'\\''?1:9);assert.equal(a.disk().entries[GID].solved,1);
 console.log('\\''PASS INVARIANT-2'\\'',mode,'\\''failure: DIRTY two entries -> timer saves both; previous='\\''+before.slice(0,60));
}
const ro=app({writer:false});assert.equal(ro.writes.length,0);assert.equal(ro.syncOptions,undefined);assert.equal(ro.q('\\''#goPractice'\\''),null);
console.log('\\''PASS INVARIANT-1 lock unavailable => zero writes/no sync/no answer'\\'');
})().catch(e=>{console.error(e);process.exitCode=1});
'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
PASS R5-1 g5help.v1 blocked then retry => solved=9, mastered=true; reopened=9
PASS R5-1 g5math.v1 blocked then retry => solved=9, mastered=true; reopened=9
PASS R5-2 real wiring hooks block dirty/home and entry/clean; home/clean applies; after new failed save + timers reload=0, dirty=1
PASS R5-3 global warn visible at home; recovery + 3000ms saves solved=1; DIRTY=0 and warning hidden
PASS R5-4 original stale data-next callback ignored; injected storage + current answer persisted solved=1; replay counted once
PASS INVARIANT-4 math duplicate answer => solved=1, log=1
PASS INVARIANT-2 primary failure: DIRTY two entries -> timer saves both; previous={"v":1,"entries":{"p38-6-2":{"solved":8,"idx":8,"streak":3,"
PASS INVARIANT-2 backup failure: DIRTY two entries -> timer saves both; previous={bad
PASS INVARIANT-1 lock unavailable => zero writes/no sync/no answer

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[██████░░░░] 60%｜舊反例驗證通過｜四項指定反例在原碼替身中均已修正；另驗證兩篇未存進度可一起重試保存。正在測試雲端寫入成功、讀回失敗的交錯，以及無掛勾時的相容性。
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e '
'\\''use strict'\\'';
const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
const {Storage,Clock,Document,server,device,flush}=require('\\''./tests/harness'\\'');
const KEY='\\''g5help.v1'\\'', ID='\\''p38-6-2'\\'', GID='\\''t-guoyu'\\'', CODE='\\''ABCDEFGHJKMN'\\'';
const html=fs.readFileSync('\\''src/app.html'\\'','\\''utf8'\\'');
const decode=s=>String(s).replace(/&gt;/g,'\\''>'\\'').replace(/&lt;/g,'\\''<'\\'').replace(/&quot;/g,'\\''\"'\\'').replace(/&amp;/g,'\\''&'\\'');
class El{
 constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
 appendChild(e){if(e.parentNode)e.parentNode.removeChild(e);this.children.push(e);e.parentNode=this;return e;}
 removeChild(e){this.children.splice(this.children.indexOf(e),1);e.parentNode=null;return e;}
 remove(){if(this.parentNode)this.parentNode.removeChild(this);}
 get firstChild(){return this.children[0]||null;}get firstElementChild(){return this.firstChild;}
 get nextElementSibling(){if("'!this.parentNode)return null;return this.parentNode.children[this.parentNode.children.indexOf(this)+1]||null;}
 setAttribute(k,v){v=decode(v);this.attributes[k]=v;if(k==='"'\\''class'\\'')this.className=v;if(k==='\\''id'\\'')this.id=v;if(k==='\\''hidden'\\''||k==='\\''disabled'\\'')this[k]=true;if(k.startsWith('\\''data-'\\''))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
 getAttribute(k){return this.attributes[k]??null;}
 set innerHTML(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text='\\'''\\'';const stack=[this];const re=/<"'!--['"\\s\\S]*?-->|<\\/?([A-Za-z][\\w:-]*)(?:\\s+(?:\"["'^"]*"|'"'\\''["'^'"'\\'']*'\\''|["'^'"'\\''\">])*)?\\/?>|(["'^<]+)/g;let m;while((m=re.exec(s))){if(m[0].startsWith('"'\\''<"'!--'"'\\''))continue;let cur=stack[stack.length-1];if("'!m[1]){cur._text+=decode(m[2]||'"'\\'''\\'');continue;}if(m[0].startsWith('\\''</'\\'')){if(stack.length>1)stack.pop();continue;}const e=new El(m[1],this.ownerDocument);const attrs=m[0].slice(m[1].length+1,-1);for(const a of attrs.matchAll(/([:\\w-]+)(?:\\s*=\\s*(?:\"(["'^"]*)"|'"'\\''(["'^'"'\\'']*)'\\''|(["'^'"\\s\"'\\''=<>]+)))?/g))e.setAttribute(a[1],a[2]??a[3]??a[4]??'\\'''\\'');cur.appendChild(e);if("'!/''^(input|img|br|hr|meta|link|source|area|embed|wbr)$/i.test(m[1])&&!m[0].endsWith('"'\\''/>'\\''))stack.push(e);}}
 get innerHTML(){return this.textContent;}set textContent(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text=String(s);}get textContent(){return this._text+this.children.map(c=>c.textContent).join('\\'''\\'');}
 descendants(){return this.children.flatMap(c=>[c,...c.descendants()]);}
 matches(s){let ok=true;s=s.replace(/\\[([\\w-]+)(?:=[\"'\\'']?(["'^"'"'\\''\\]]*)[\"'\\'']?)?\\]/g,(_,k,v)=>{if("'!Object.hasOwn(this.attributes,k)||(v!==undefined&&this.attributes[k]!==decode(v)))ok=false;return '"'\\'''\\'';});s=s.replace(/#([\\w-]+)/g,(_,id)=>{if(this.id"'!==id)ok=false;return '"'\\'''\\'';});s=s.replace(/\\.([\\w-]+)/g,(_,c)=>{if("'!this.className.split(/'"\\s+/).includes(c))ok=false;return '\\'''\\'';});return ok&&("'!s.trim()||this.tagName===s.trim().toUpperCase());}
 querySelectorAll(sel){const parts=sel.split('"'\\'','\\'').map(s=>s.trim());return this.descendants().filter(e=>parts.some(p=>{const chain=p.split(/\\s+(?"'![''^'"\\[]*\\])/);if("'!e.matches(chain.pop()))return false;let a=e.parentNode;while(chain.length){const want=chain.pop();while(a&&!a.matches(want))a=a.parentNode;if(!a)return false;a=a.parentNode;}return true;}));}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 addEventListener(t,f){(this.listeners[t]||=[]).push(f);}removeEventListener(t,f){this.listeners[t]=(this.listeners[t]||[]).filter(x=>x!==f);}
 click(){if(!this.disabled){if(this.onclick)this.onclick({preventDefault(){}});for(const f of this.listeners.click||[])f.call(this,{preventDefault(){}});}}
 scrollIntoView(){}focus(){}select(){}
}
const fixture={id:GID,date:'"'\\''2026-10-13'\\'',subject:'\\''國語'\\'',kind:'\\''steps'\\'',source:'\\''測試卷第 1 題'\\'',title:'\\''測試：成語填空'\\'',question:'\\''一（ ）不苟'\\'',steps:[{title:'\\''先想意思'\\'',say:'\\''做事仔細'\\'',check:{q:'\\''哪種人'\\'',opts:['\\''馬虎'\\'','\\''認真'\\''],a:1}},{title:'\\''再想字'\\'',say:'\\''一根頭髮'\\''}],answer:'\\''絲'\\'',practice:[{q:'\\''一絲不（ ）'\\'',opts:['\\''狗'\\'','\\''苟'\\''],a:1},{q:'\\''意思'\\'',opts:['\\''仔細'\\'','\\''隨便'\\''],a:0},{q:'\\''誰'\\'',opts:['\\''仔細的人'\\'','\\''隨便的人'\\''],a:0}]};
const raw=n=>JSON.stringify({v:1,entries:{[ID]:{solved:n,idx:n,streak:3,clean:n,mastered:true,lessonDone:true,r:1,seed:22}}});
function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
 const stg=storage||new Storage(initial), clock=new Clock(), doc=new El('\\''document'\\'');doc.ownerDocument=doc;doc.createElement=t=>new El(t,doc);doc.getElementById=id=>doc.querySelector('\\''#'\\''+id);
 doc.innerHTML=html.slice(html.indexOf('\\''<div class=\"wrap\">'\\''),html.indexOf('\\''<script src='\\''));
 const events={};let reloads=0,lockcb;const location={hash,reload(){reloads++;}};
 const d={stg,clock,doc,events,readFail,writeFail,reads:[],writes:[]};
 const baseGet=stg.getItem.bind(stg),baseSet=stg.setItem.bind(stg);
 stg.getItem=k=>{d.reads.push(k);if(d.readFail&&d.readFail(k))throw new Error('\\''get-fail'\\'');return baseGet(k);};
 stg.setItem=(k,v)=>{d.writes.push([k,v]);if(d.writeFail&&d.writeFail(k,v))throw new Error('\\''set-fail'\\'');baseSet(k,v);};
 const w={document:doc,location,localStorage:stg,scrollTo(){},matchMedia:()=>({matches:true}),__G5_HARD_FIXTURE__:[fixture],
  navigator:{locks:{request(name,opts,cb){if(typeof opts==='\\''function'\\'')return new Promise(()=>{});lockcb=cb;return new Promise(()=>{});}}},
  addEventListener(t,f){(events[t]||=[]).push(f);},removeEventListener(){},dispatchEvent(e){for(const f of events[e.type]||[])f(e);},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout,setInterval:clock.setInterval,clearInterval:clock.clearInterval};
 const ctx={window:w,document:doc,navigator:w.navigator,location,localStorage:stg,console,Event:class{constructor(type){this.type=type;}},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout};
 vm.createContext(ctx);
 for(const f of ['\\''src/frac.js'\\'','\\''src/hard.js'\\''])vm.runInContext(fs.readFileSync(f,'\\''utf8'\\''),ctx,{filename:f});
 const script=[...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][0][1];
 // Expose only references for observations; all application function bodies run unchanged.
 const exposed=script.replace('\\''window.G5HelpPage ='\\'','\\''window.__review={save,route,retryRead,openPractice,startLesson,get:()=>({DB,st,E,READY,WRITER,GEN})};window.G5HelpPage ='\\'');
 vm.runInContext(exposed,ctx,{filename:'\\''src/app.html'\\''});
 // Real sync wiring is evaluated against a capture-only init; real sync is tested separately with shared storage.
 w.G5Sync={init:o=>{d.syncOptions=o;return {};}};
 vm.runInContext([...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][1][1],ctx,{filename:'\\''src/app.html-sync-wiring'\\''});
 lockcb(writer?{}:null);
 Object.assign(d,{w,ctx,q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),go(id){location.hash=id?'\\''#h/'\\''+id:'\\'''\\'';w.dispatchEvent(new ctx.Event('\\''hashchange'\\''));},disk:()=>JSON.parse(baseGet(KEY)||'\\''null'\\''),peek:baseGet,reloads:()=>reloads});
 return d;
}
function check(name,fn){const out=fn();console.log('\\''PASS'\\'',name,JSON.stringify(out??true));}
const gcd=(a,b)=>b?gcd(b,a%b):a;
function mathAnswer(d){
 const st=d.w.G5HelpPage.state(ID),p=d.w.G5Frac.problem(st.idx,st.seed);
 const a={n:p.a.n/gcd(p.a.n,p.a.d),d:p.a.d/gcd(p.a.n,p.a.d)},b={n:p.b.n/gcd(p.b.n,p.b.d),d:p.b.d/gcd(p.b.n,p.b.d)};
 for(const [k,v]of Object.entries({'\\''a.n'\\'':a.n,'\\''a.d'\\'':a.d,'\\''b.n'\\'':b.n,'\\''b.d'\\'':b.d}))d.q('\\''#r1 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r1 button[data-check]'\\'').click();
 const l=a.d*b.d/gcd(a.d,b.d);
 for(const [k,v]of Object.entries({'\\''c.n'\\'':a.n*l/a.d,'\\''c.d'\\'':l,'\\''e.n'\\'':b.n*l/b.d,'\\''e.d'\\'':l}))d.q('\\''#r2 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r2 button[data-check]'\\'').click();
 const sign=a.n*b.d===b.n*a.d?'\\''='\\'':a.n*b.d>b.n*a.d?'\\''>'\\'':'\\''<'\\'',button=d.all('\\''#r3 .chip'\\'').find(b=>b.dataset.s===sign);
 const fn=button.onclick;button.click();return {fn,button};
}
function choose(d){const s=d.w.G5HelpPage.state(GID),b=d.q('\\''#practice .chip[data-k=\"'\\''+fixture.practice[s.idx%3].a+'\\''\"]'\\'');const fn=b.onclick;b.click();return {fn,b};}

(async()=>{
 const Sync=require('\\''./src/sync'\\'');
 const clock=new Clock(),backend=server(clock),local=raw(8),cloud=raw(20);
 backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:0,data:local});
 backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:1,data:cloud});
 const meta=JSON.stringify({version:1,codeHash:Sync.contentHash(CODE),keys:{[KEY]:{rev:1,hash:Sync.contentHash(local),updated:clock.now()}}});
 const a=app({hash:'\\'''\\'',initial:{[KEY]:local,'\\''g5sync.code'\\'':CODE,'\\''g5sync.meta'\\'':meta}});
 let failNextRead=false;
 a.writeFail=(k,v)=>{if(k===KEY&&v===cloud)failNextRead=true;return false;};
 a.readFail=k=>{if(k===KEY&&failNextRead){failNextRead=false;return true;}return false;};
 const d=device(backend,{keys:[KEY],storage:a.stg,canReplace:a.syncOptions.canReplace,accept:a.syncOptions.accept});
 await d.api.ready;
 assert.equal(a.disk().entries[ID].solved,20);
 assert.equal(a.w.G5HelpPage.state(ID).solved,8);
 console.log('\\''REPRO NEW-1 after successful remote set + one get throw'\\'',JSON.stringify({disk:a.disk().entries[ID].solved,memory:a.w.G5HelpPage.state(ID).solved,DIRTY:a.w.G5HelpDirty(),sync:d.api.getState().status,metaRev:JSON.parse(a.peek('\\''g5sync.meta'\\'')).keys[KEY].rev}));
 // Let the sync poll observe the partial commit before user enters, to rule out a merely tiny race.
 a.writeFail=null;a.readFail=null;await clock.advance(4000);
 assert.ok(d.api.getState().conflicts[KEY]);assert.equal(a.w.G5HelpPage.state(ID).solved,8);
 a.go(ID);a.q('\\''#goPractice'\\'').click();mathAnswer(a);
 assert.equal(a.disk().entries[ID].solved,9);
 const reopen=app({initial:a.stg.dump()});assert.equal(reopen.w.G5HelpPage.state(ID).solved,9);
 console.log('\\''REPRO NEW-1 after retry conflict + one real math answer + reopen'\\'',JSON.stringify({disk:a.disk().entries[ID].solved,reopen:reopen.w.G5HelpPage.state(ID).solved,DIRTY:a.w.G5HelpDirty(),warnHidden:a.q('\\''#saveWarn'\\'').hidden,cloud:JSON.parse(backend.store.record(CODE,KEY).data).entries[ID].solved}));
 d.api.destroy();
 const r=app({initial:{[KEY]:raw(8)},readFail:k=>k===KEY});
 const old=r.q('\\''#readRetry'\\''),retry=old.onclick;
 r.readFail=null;old.click();r.writeFail=k=>k===KEY;r.q('\\''#goPractice'\\'').click();mathAnswer(r);
 assert.equal(r.w.G5HelpPage.state(ID).solved,9);assert.equal(r.w.G5HelpDirty(),1);
 retry.call(old);
 assert.equal(r.w.G5HelpPage.state(ID).solved,8);assert.equal(r.w.G5HelpDirty(),1);
 r.writeFail=null;await r.clock.advance(3000);assert.equal(r.disk().entries[ID].solved,8);assert.equal(r.w.G5HelpDirty(),0);
 console.log('\\''REPRO NEW-2 explicit replay stale readRetry after success + failed-save answer: memory=9/DIRTY=1 -> memory=8 -> timer disk=8/DIRTY=0'\\'');
 // Current-question hint stale callback crosses GEN: direct callback replay only, not ordinary click.
 const h=app();h.q('\\''#goPractice'\\'').click();const hint=h.q('\\''#r1 button[data-hint]'\\''),hh=hint.onclick,oldCur=h.w.__review.get().st.cur;
 h.go(GID);h.q('\\''#goPractice'\\'').click();const gen=h.w.__review.get().GEN;hh.call(hint);
 assert.equal(oldCur.hints,1);assert.equal(h.disk().entries[ID].cur.hints,1);
 console.log('\\''REPRO INVARIANT-4 stale math hint replay after route: previous entry hints changed 0->1 and persisted; GEN='\\''+gen);
})().catch(e=>{console.error(e);process.exitCode=1});
'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
REPRO NEW-1 after successful remote set + one get throw {"disk":20,"memory":8,"DIRTY":0,"sync":"雲端有較新的進度，回到首頁、存好後就會換上。","metaRev":1}
REPRO NEW-1 after retry conflict + one real math answer + reopen {"disk":9,"reopen":9,"DIRTY":0,"warnHidden":true,"cloud":20}
REPRO NEW-2 explicit replay stale readRetry after success + failed-save answer: memory=9/DIRTY=1 -> memory=8 -> timer disk=8/DIRTY=0
REPRO INVARIANT-4 stale math hint replay after route: previous entry hints changed 0->1 and persisted; GEN=2

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "REVIEW_VARIANT=previous node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
const prev=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''HEAD"'^:src/sync.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
const oldTests=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''HEAD"'^:tests/sync.test.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
if(process.env.REVIEW_VARIANT==='\\''previous'\\''){const real=fs.readFileSync;fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?prev:Buffer.from(prev);return real.call(this,f,...args);};}
const filename=path.resolve('\\''tests/sync.test.js'\\''),req=createRequire(filename),m={exports:{}};
vm.runInThisContext('\\''(function(require,module,exports,__filename,__dirname){'\\''+oldTests+'\\''\\n})'\\'',{filename})(req,m,m.exports,filename,path.dirname(filename));
'" in /Users/william/Documents/g5-help
exec
/bin/zsh -lc "REVIEW_VARIANT=current node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
const prev=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''HEAD"'^:src/sync.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
const oldTests=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''HEAD"'^:tests/sync.test.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
if(process.env.REVIEW_VARIANT==='\\''previous'\\''){const real=fs.readFileSync;fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?prev:Buffer.from(prev);return real.call(this,f,...args);};}
const filename=path.resolve('\\''tests/sync.test.js'\\''),req=createRequire(filename),m={exports:{}};
vm.runInThisContext('\\''(function(require,module,exports,__filename,__dirname){'\\''+oldTests+'\\''\\n})'\\'',{filename})(req,m,m.exports,filename,path.dirname(filename));
'" in /Users/william/Documents/g5-help
hook: PostToolUse Completed
hook: PostToolUse Completed
 succeeded in 449ms:
✔ S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document (15.684542ms)
✔ S05 A4 joining with two documents always prompts, even if they are byte-identical (7.319959ms)
✔ S06 A5 failure=offline preserves local progress and retries automatically (8.321125ms)
✔ S06 A5 failure=reject preserves local progress and retries automatically (9.178ms)
✔ S06 A5 failure=html preserves local progress and retries automatically (7.959875ms)
✔ S06 A5 failure=server preserves local progress and retries automatically (8.070916ms)
✔ S06 A5 failure=http preserves local progress and retries automatically (8.07275ms)
✔ S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening (7.85325ms)
✔ S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation (5.861792ms)
✔ S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator (4.1335ms)
✔ S10 A6 malformed fragment is still removed and never sent to server (0.541541ms)
✔ S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes (9.283291ms)
✔ S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty (17.780333ms)
✔ S13 multi-key sync serializes requests and preserves metadata belonging to another site (8.930708ms)
✔ S14 visibility hidden and online event immediately attempt pending work (7.921125ms)
✔ S15 backoff is exponential, capped at 60 seconds, and timers do not bypass it (13.221916ms)
✔ S16 edit while put is in flight is not falsely marked synced and is pushed on the next poll (9.29425ms)
✔ S17 edit while startup get is in flight becomes a conflict instead of being overwritten (11.638125ms)
✔ S18 stop during in-flight request cannot restore code/meta or replace local data (10.700083ms)
✔ S19 repeated conflicts keep exactly the three most recent backups, even with a fixed clock (9.310834ms)
✔ S20 quota failure writing a backup blocks replacement and cloud overwrite (8.441667ms)
✔ S21 cloud changes again while conflict is displayed; both choices require a fresh decision (16.368625ms)
✔ S22 invalid server response and malformed metadata never silently overwrite local data (3.966958ms)
✔ S23 button accessibility, text-only summaries and clipboard fallback keep sharing usable (13.920917ms)
✔ S24 first-device secure randomness has no Math.random fallback (7.914417ms)
✔ S25 hanging request times out, releases the queue and later recovers (10.021209ms)
✔ S26 existing empty-string documents, new keys and join with empty cloud upload without parsing or merging (8.13525ms)
✔ S27 a too-large key cannot starve other keys; shrinking it later recovers (129.318541ms)
✔ S28 all downloaded keys are saved before the first replacement callback can reload the page (3.893583ms)
✔ S29 same-origin stop event clears another tab panel and prevents subsequent writes (10.000417ms)
✔ S30 removing a progress key locally does not delete the cloud copy or falsely claim sync (7.061625ms)
✔ S31 a committed put with lost acknowledgement becomes an explicit conflict on retry (11.58525ms)
✔ S32 switching family while a get is in flight ignores the old response and keeps a single request active (8.17275ms)
✔ S33 unresolved join conflict remains a conflict after refreshing the page (7.168875ms)
✔ S34 metadata write failure after downloading still notifies the host about changed local data (3.686375ms)
✔ S35 CommonJS export can initialize directly in Node with injected DOM owner and storage (0.557375ms)
✔ S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice (11.260958ms)
✔ S37 cloud choice retries a failed download and backs up local progress after recovery (9.527125ms)
✔ S30 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入 (12.748458ms)
ℹ tests 42
ℹ suites 0
ℹ pass 42
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 508.061458

hook: PostToolUse
hook: PostToolUse
 succeeded in 453ms:
✔ S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document (12.334666ms)
✔ S05 A4 joining with two documents always prompts, even if they are byte-identical (8.699375ms)
✔ S06 A5 failure=offline preserves local progress and retries automatically (11.052541ms)
✔ S06 A5 failure=reject preserves local progress and retries automatically (7.960542ms)
✔ S06 A5 failure=html preserves local progress and retries automatically (8.983291ms)
✔ S06 A5 failure=server preserves local progress and retries automatically (8.782709ms)
✔ S06 A5 failure=http preserves local progress and retries automatically (8.638792ms)
✔ S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening (7.208875ms)
✔ S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation (4.421833ms)
✔ S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator (3.868291ms)
✔ S10 A6 malformed fragment is still removed and never sent to server (0.542916ms)
✔ S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes (7.736ms)
✔ S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty (18.405584ms)
✔ S13 multi-key sync serializes requests and preserves metadata belonging to another site (9.006708ms)
✔ S14 visibility hidden and online event immediately attempt pending work (8.38575ms)
✔ S15 backoff is exponential, capped at 60 seconds, and timers do not bypass it (14.503125ms)
✔ S16 edit while put is in flight is not falsely marked synced and is pushed on the next poll (8.093584ms)
✔ S17 edit while startup get is in flight becomes a conflict instead of being overwritten (11.939583ms)
✔ S18 stop during in-flight request cannot restore code/meta or replace local data (13.462458ms)
✔ S19 repeated conflicts keep exactly the three most recent backups, even with a fixed clock (9.388042ms)
✔ S20 quota failure writing a backup blocks replacement and cloud overwrite (7.8935ms)
✔ S21 cloud changes again while conflict is displayed; both choices require a fresh decision (15.368833ms)
✔ S22 invalid server response and malformed metadata never silently overwrite local data (3.780625ms)
✔ S23 button accessibility, text-only summaries and clipboard fallback keep sharing usable (12.427042ms)
✔ S24 first-device secure randomness has no Math.random fallback (5.167667ms)
✔ S25 hanging request times out, releases the queue and later recovers (9.753167ms)
✔ S26 existing empty-string documents, new keys and join with empty cloud upload without parsing or merging (6.901708ms)
✔ S27 a too-large key cannot starve other keys; shrinking it later recovers (128.139333ms)
✔ S28 all downloaded keys are saved before the first replacement callback can reload the page (4.136208ms)
✔ S29 same-origin stop event clears another tab panel and prevents subsequent writes (11.436125ms)
✔ S30 removing a progress key locally does not delete the cloud copy or falsely claim sync (7.751292ms)
✔ S31 a committed put with lost acknowledgement becomes an explicit conflict on retry (15.178875ms)
✔ S32 switching family while a get is in flight ignores the old response and keeps a single request active (9.674833ms)
✔ S33 unresolved join conflict remains a conflict after refreshing the page (8.062083ms)
✔ S34 metadata write failure after downloading still notifies the host about changed local data (4.05925ms)
✔ S35 CommonJS export can initialize directly in Node with injected DOM owner and storage (0.5685ms)
✔ S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice (10.682833ms)
✔ S37 cloud choice retries a failed download and backs up local progress after recovery (8.665625ms)
✔ S30 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入 (12.3015ms)
ℹ tests 42
ℹ suites 0
ℹ pass 42
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 509.872

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),crypto=require('\\''node:crypto'\\'');
for(const n of ['\\''src/sync.js'\\'','\\''tests/sync.test.js'\\'']){
 const a=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''HEAD"'^:'"'\\''+n],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString(),b=fs.readFileSync(n,'\\''utf8'\\'');
 console.log(n,{beforeLength:a.length,afterLength:b.length,equal:a===b,beforeHooks:a.includes('\\''options.canReplace'\\''),beforeNewTest:a.includes('\\''頁面自己是唯一寫入者'\\'')});
}
'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
src/sync.js {
  beforeLength: 29227,
  afterLength: 29227,
  equal: true,
  beforeHooks: true,
  beforeNewTest: true
}
tests/sync.test.js {
  beforeLength: 28152,
  afterLength: 28152,
  equal: true,
  beforeHooks: false,
  beforeNewTest: true
}

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc 'git rev-parse HEAD HEAD''^; git log -4 --oneline; git diff 455135d''^ 455135d --stat' in /Users/william/Documents/g5-help
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-NwXGD8qQ' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-i823w4Q4' (errno=Operation not permitted)
0c98e0192e97f31993ba9b4dd296f902b9524df4
455135df1d96c6b7b56443447d73d9db3b81485b
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-5uoyo9r2' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Jk2fM1cS' (errno=Operation not permitted)
0c98e01 e2e：#1319「這步看不懂」按鈕（無同步給口頭說法、有同步送 op=confused，攔截不打真後端）5/5
455135d 難題站存檔設計 C（#1303，Codex 設計後連兩輪 FAIL → 4agent 定案）：本頁記憶體唯一真相
5367999 白話機制補用詞（#1319）＋傳題進度條隨時間（#1320）
65c4c67 白話程度依年級（學年度 8/1 換級，今＝小五每句≤40 字，小六 45…）寫進 hard.js＋hard.test 逐句檢查；家長傳題目進度條（33/66/100%）
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-l8rNEEvF' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-ZxdAvOh9' (errno=Operation not permitted)
 docs/codex-review-r5-20261013.md         |  76 ++++++++++++++++++++
 docs/storage-design-C-4agent-20261013.md |  26 +++++++
 index.html                               | 119 +++++++++++++++++--------------
 src/app.html                             | 119 +++++++++++++++++--------------
 src/sync.js                              |  15 +++-
 sync.js                                  |  15 +++-
 tests/e2e.py                             |  96 +++++++++++++++++++++++++
 tests/harness.js                         |   3 +-
 tests/sync.test.js                       |  31 ++++++++
 9 files changed, 385 insertions(+), 115 deletions(-)

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "REVIEW_VARIANT=previous node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
const prev=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:src/sync.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
const oldTests=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:tests/sync.test.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
if(process.env.REVIEW_VARIANT==='\\''previous'\\''){const real=fs.readFileSync;fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?prev:Buffer.from(prev);return real.call(this,f,...args);};}
const filename=path.resolve('\\''tests/sync.test.js'\\''),req=createRequire(filename),m={exports:{}};
vm.runInThisContext('\\''(function(require,module,exports,__filename,__dirname){'\\''+oldTests+'\\''\\n})'\\'',{filename})(req,m,m.exports,filename,path.dirname(filename));
'" in /Users/william/Documents/g5-help
exec
/bin/zsh -lc "REVIEW_VARIANT=current node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
const prev=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:src/sync.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
const oldTests=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:tests/sync.test.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
if(process.env.REVIEW_VARIANT==='\\''previous'\\''){const real=fs.readFileSync;fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?prev:Buffer.from(prev);return real.call(this,f,...args);};}
const filename=path.resolve('\\''tests/sync.test.js'\\''),req=createRequire(filename),m={exports:{}};
vm.runInThisContext('\\''(function(require,module,exports,__filename,__dirname){'\\''+oldTests+'\\''\\n})'\\'',{filename})(req,m,m.exports,filename,path.dirname(filename));
'" in /Users/william/Documents/g5-help
 succeeded in 441ms:
✔ S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document (13.966167ms)
✔ S05 A4 joining with two documents always prompts, even if they are byte-identical (7.491458ms)
✔ S06 A5 failure=offline preserves local progress and retries automatically (8.246458ms)
✔ S06 A5 failure=reject preserves local progress and retries automatically (8.785292ms)
✔ S06 A5 failure=html preserves local progress and retries automatically (8.916375ms)
✔ S06 A5 failure=server preserves local progress and retries automatically (8.509208ms)
✔ S06 A5 failure=http preserves local progress and retries automatically (8.595375ms)
✔ S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening (8.287ms)
✔ S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation (6.237166ms)
✔ S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator (3.891625ms)
✔ S10 A6 malformed fragment is still removed and never sent to server (0.643209ms)
✔ S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes (8.714333ms)
✔ S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty (18.842625ms)
✔ S13 multi-key sync serializes requests and preserves metadata belonging to another site (8.449041ms)
✔ S14 visibility hidden and online event immediately attempt pending work (7.667625ms)
✔ S15 backoff is exponential, capped at 60 seconds, and timers do not bypass it (13.073458ms)
✔ S16 edit while put is in flight is not falsely marked synced and is pushed on the next poll (7.7115ms)
✔ S17 edit while startup get is in flight becomes a conflict instead of being overwritten (10.915834ms)
✔ S18 stop during in-flight request cannot restore code/meta or replace local data (10.634542ms)
✔ S19 repeated conflicts keep exactly the three most recent backups, even with a fixed clock (9.890041ms)
✔ S20 quota failure writing a backup blocks replacement and cloud overwrite (7.551542ms)
✔ S21 cloud changes again while conflict is displayed; both choices require a fresh decision (15.616ms)
✔ S22 invalid server response and malformed metadata never silently overwrite local data (3.74ms)
✔ S23 button accessibility, text-only summaries and clipboard fallback keep sharing usable (14.145583ms)
✔ S24 first-device secure randomness has no Math.random fallback (4.850375ms)
✔ S25 hanging request times out, releases the queue and later recovers (10.942375ms)
✔ S26 existing empty-string documents, new keys and join with empty cloud upload without parsing or merging (8.073916ms)
✔ S27 a too-large key cannot starve other keys; shrinking it later recovers (132.844541ms)
✔ S28 all downloaded keys are saved before the first replacement callback can reload the page (3.864083ms)
✔ S29 same-origin stop event clears another tab panel and prevents subsequent writes (11.689917ms)
✔ S30 removing a progress key locally does not delete the cloud copy or falsely claim sync (7.429084ms)
✔ S31 a committed put with lost acknowledgement becomes an explicit conflict on retry (11.789916ms)
✔ S32 switching family while a get is in flight ignores the old response and keeps a single request active (8.0735ms)
✔ S33 unresolved join conflict remains a conflict after refreshing the page (7.202834ms)
✔ S34 metadata write failure after downloading still notifies the host about changed local data (4.136209ms)
✔ S35 CommonJS export can initialize directly in Node with injected DOM owner and storage (0.852083ms)
✔ S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice (11.111084ms)
✔ S37 cloud choice retries a failed download and backs up local progress after recovery (8.961292ms)
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 497.003375

hook: PostToolUse
hook: PostToolUse
 succeeded in 448ms:
✔ S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document (14.46175ms)
✔ S05 A4 joining with two documents always prompts, even if they are byte-identical (7.524041ms)
✔ S06 A5 failure=offline preserves local progress and retries automatically (8.014166ms)
✔ S06 A5 failure=reject preserves local progress and retries automatically (9.784166ms)
✔ S06 A5 failure=html preserves local progress and retries automatically (8.427625ms)
✔ S06 A5 failure=server preserves local progress and retries automatically (8.719958ms)
✔ S06 A5 failure=http preserves local progress and retries automatically (8.696917ms)
✔ S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening (7.853417ms)
✔ S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation (5.007375ms)
✔ S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator (3.742917ms)
✔ S10 A6 malformed fragment is still removed and never sent to server (0.554125ms)
✔ S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes (7.922667ms)
✔ S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty (18.318167ms)
✔ S13 multi-key sync serializes requests and preserves metadata belonging to another site (9.130833ms)
✔ S14 visibility hidden and online event immediately attempt pending work (7.835042ms)
✔ S15 backoff is exponential, capped at 60 seconds, and timers do not bypass it (14.340167ms)
✔ S16 edit while put is in flight is not falsely marked synced and is pushed on the next poll (8.244792ms)
✔ S17 edit while startup get is in flight becomes a conflict instead of being overwritten (11.944209ms)
✔ S18 stop during in-flight request cannot restore code/meta or replace local data (12.336084ms)
✔ S19 repeated conflicts keep exactly the three most recent backups, even with a fixed clock (9.645834ms)
✔ S20 quota failure writing a backup blocks replacement and cloud overwrite (7.857166ms)
✔ S21 cloud changes again while conflict is displayed; both choices require a fresh decision (15.534041ms)
✔ S22 invalid server response and malformed metadata never silently overwrite local data (3.655333ms)
✔ S23 button accessibility, text-only summaries and clipboard fallback keep sharing usable (14.507166ms)
✔ S24 first-device secure randomness has no Math.random fallback (4.92775ms)
✔ S25 hanging request times out, releases the queue and later recovers (10.789875ms)
✔ S26 existing empty-string documents, new keys and join with empty cloud upload without parsing or merging (7.310792ms)
✔ S27 a too-large key cannot starve other keys; shrinking it later recovers (129.895416ms)
✔ S28 all downloaded keys are saved before the first replacement callback can reload the page (3.982292ms)
✔ S29 same-origin stop event clears another tab panel and prevents subsequent writes (11.319125ms)
✔ S30 removing a progress key locally does not delete the cloud copy or falsely claim sync (8.067417ms)
✔ S31 a committed put with lost acknowledgement becomes an explicit conflict on retry (13.3905ms)
✔ S32 switching family while a get is in flight ignores the old response and keeps a single request active (7.237958ms)
✔ S33 unresolved join conflict remains a conflict after refreshing the page (8.344833ms)
✔ S34 metadata write failure after downloading still notifies the host about changed local data (3.867375ms)
✔ S35 CommonJS export can initialize directly in Node with injected DOM owner and storage (0.544209ms)
✔ S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice (11.971208ms)
✔ S37 cloud choice retries a failed download and backs up local progress after recovery (8.68575ms)
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 501.431709

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc 'git diff 455135d -- src/app.html src/sync.js index.html sync.js tests/harness.js tests/sync.test.js tests/e2e.py' in /Users/william/Documents/g5-help
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-VimtycEp' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-URou57A2' (errno=Operation not permitted)
diff --git a/tests/e2e.py b/tests/e2e.py
index eae47f5..4bde238 100644
--- a/tests/e2e.py
+++ b/tests/e2e.py
@@ -698,6 +698,25 @@ def flow_codex_r5(browser, label="Chromium"):
     check(f"{label} r5補 同一題的答對 handler 重播只計一次", db["solved"] == 1 and db["idx"] == 1 and len(db["log"]) == 1, {k: db[k] for k in ("solved", "idx")})
     ctx.close()
 
+def flow_confused(browser):
+    """交辦 #1319：每一步有「這步看不懂」；沒開同步給口頭說法；有同步碼就送 op=confused（攔下請求，不打真後端）。"""
+    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
+    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
+    pg.get_by_role("button", name="開始學").click()
+    btn = pg.locator(".lstep").first.locator("button[data-confused]")
+    check("#1319 每一步有「這步看不懂」按鈕", btn.count() == 1 and btn.is_visible())
+    btn.click()
+    check("#1319 沒開同步：請她口頭跟爸媽說第幾步", "第 1 步看不懂" in pg.locator(".lstep").first.inner_text())
+    sent = []
+    pg.route("**/macros/s/**", lambda route: (sent.append(route.request.post_data), route.fulfill(status=200, content_type="application/json", body='{"ok":true,"id":"c1"}')))
+    pg.evaluate("localStorage.setItem('g5sync.code','ABCDEFGHJKMN'); 0")
+    btn.click(); pg.wait_for_timeout(400)
+    body = json.loads(sent[0]) if sent else {}
+    check("#1319 有同步碼：送出 op=confused、篇 id、第 1 步", body.get("op") == "confused" and body.get("entry") == "t-guoyu" and body.get("step") == 1 and body.get("subject") == "國語", body)
+    check("#1319 送出後告訴她收到了", "收到了" in pg.locator(".lstep").first.inner_text())
+    check("#1319 沒有 JS 錯誤", not errors, errors)
+    ctx.close()
+
 def main():
     with sync_playwright() as p:
         cr = p.chromium.launch()
@@ -713,6 +732,7 @@ def main():
         flow_single_writer(cr, "Chromium")
         flow_codex_r4(cr)
         flow_codex_r5(cr)
+        flow_confused(cr)
         flow_home(cr)
         flow_migrate(cr)
         flow_steps(cr, "手機390", {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True}, shots=True)

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[████████░░] 80%｜已重現兩條倒退路徑｜雲端寫入後讀回失敗可使本機 20 題退成 9 題；重播舊「再讀一次」callback 可清掉未存答案。另發現 HEAD 已被外部推進，已改用明確 commit 455135d 比對，核心檔案未變。
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3.12 -B -c 'from pathlib import Path
ns={\"__name__\":\"readonly_review\",\"__file__\":str(Path(\"build.py\").resolve())}
exec(compile(Path(\"build.py\").read_text(),\"build.py\",\"exec\"),ns)
expected=ns[\"HEAD\"]+ns[\"inline\"](Path(\"src/app.html\").read_text())+\"</body></html>\"
print(\"published_index_equals_in_memory_build\",expected==Path(\"index.html\").read_text())'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
published_index_equals_in_memory_build True

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),crypto=require('\\''node:crypto'\\'');
for(const name of ['\\''src/app.html'\\'','\\''src/sync.js'\\'','\\''index.html'\\'','\\''sync.js'\\'','\\''src/frac.js'\\'','\\''src/hard.js'\\'','\\''tests/harness.js'\\'','\\''tests/sync.test.js'\\'']){
 const b=fs.readFileSync(name),h=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d:'\\''+name],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']});
 console.log(name,crypto.createHash('\\''sha256'\\'').update(b).digest('\\''hex'\\''),'\\''matches_455135d='\\''+b.equals(h));
}
console.log('\\''pinned_before_and_after_sync_distinct'\\'',"'!cp.execFileSync('"'\\''git'\\'',['\\''show'\\'','\\''455135d"'^:src/sync.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).equals(fs.readFileSync('\\''src/sync.js'\\'')));
'" in /Users/william/Documents/g5-help
 succeeded in 14ms:
pinned_before_and_after_sync_distinct true

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "python3.12 -B -c 'import subprocess
from pathlib import Path
source=subprocess.run([\"git\",\"show\",\"455135d:tests/e2e.py\"],capture_output=True,check=True).stdout
exec(compile(source,\"tests/e2e.py\",\"exec\"),{\"__name__\":\"__main__\",\"__file__\":str(Path(\"tests/e2e.py\").resolve())})'" in /Users/william/Documents/g5-help
hook: PostToolUse Completed
hook: PostToolUse Completed
 exited 1 in 107ms:
Traceback (most recent call last):
  File "<string>", line 4, in <module>
  File "tests/e2e.py", line 736, in <module>
    flow_home(cr)
^^^^^^
  File "tests/e2e.py", line 703, in main
    ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/t-guoyu")
             ^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/sync_api/_generated.py", line 16269, in launch
    self._sync(
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_sync_base.py", line 115, in _sync
    return task.result()
           ^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_browser_type.py", line 98, in launch
    await self._channel.send(
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.Error: BrowserType.launch: EPERM: operation not permitted, mkdtemp '/var/folders/nf/sry6xz8x35gdnpjkkvxpxnzw0000gn/T/playwright-artifacts-OpCevY'

hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e '
'\\''use strict'\\'';
const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
const {Storage,Clock,Document,server,device,flush}=require('\\''./tests/harness'\\'');
const KEY='\\''g5help.v1'\\'', ID='\\''p38-6-2'\\'', GID='\\''t-guoyu'\\'', CODE='\\''ABCDEFGHJKMN'\\'';
const html=fs.readFileSync('\\''src/app.html'\\'','\\''utf8'\\'');
const decode=s=>String(s).replace(/&gt;/g,'\\''>'\\'').replace(/&lt;/g,'\\''<'\\'').replace(/&quot;/g,'\\''\"'\\'').replace(/&amp;/g,'\\''&'\\'');
class El{
 constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
 appendChild(e){if(e.parentNode)e.parentNode.removeChild(e);this.children.push(e);e.parentNode=this;return e;}
 removeChild(e){this.children.splice(this.children.indexOf(e),1);e.parentNode=null;return e;}
 remove(){if(this.parentNode)this.parentNode.removeChild(this);}
 get firstChild(){return this.children[0]||null;}get firstElementChild(){return this.firstChild;}
 get nextElementSibling(){if("'!this.parentNode)return null;return this.parentNode.children[this.parentNode.children.indexOf(this)+1]||null;}
 setAttribute(k,v){v=decode(v);this.attributes[k]=v;if(k==='"'\\''class'\\'')this.className=v;if(k==='\\''id'\\'')this.id=v;if(k==='\\''hidden'\\''||k==='\\''disabled'\\'')this[k]=true;if(k.startsWith('\\''data-'\\''))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
 getAttribute(k){return this.attributes[k]??null;}
 set innerHTML(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text='\\'''\\'';const stack=[this];const re=/<"'!--['"\\s\\S]*?-->|<\\/?([A-Za-z][\\w:-]*)(?:\\s+(?:\"["'^"]*"|'"'\\''["'^'"'\\'']*'\\''|["'^'"'\\''\">])*)?\\/?>|(["'^<]+)/g;let m;while((m=re.exec(s))){if(m[0].startsWith('"'\\''<"'!--'"'\\''))continue;let cur=stack[stack.length-1];if("'!m[1]){cur._text+=decode(m[2]||'"'\\'''\\'');continue;}if(m[0].startsWith('\\''</'\\'')){if(stack.length>1)stack.pop();continue;}const e=new El(m[1],this.ownerDocument);const attrs=m[0].slice(m[1].length+1,-1);for(const a of attrs.matchAll(/([:\\w-]+)(?:\\s*=\\s*(?:\"(["'^"]*)"|'"'\\''(["'^'"'\\'']*)'\\''|(["'^'"\\s\"'\\''=<>]+)))?/g))e.setAttribute(a[1],a[2]??a[3]??a[4]??'\\'''\\'');cur.appendChild(e);if("'!/''^(input|img|br|hr|meta|link|source|area|embed|wbr)$/i.test(m[1])&&!m[0].endsWith('"'\\''/>'\\''))stack.push(e);}}
 get innerHTML(){return this.textContent;}set textContent(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text=String(s);}get textContent(){return this._text+this.children.map(c=>c.textContent).join('\\'''\\'');}
 descendants(){return this.children.flatMap(c=>[c,...c.descendants()]);}
 matches(s){let ok=true;s=s.replace(/\\[([\\w-]+)(?:=[\"'\\'']?(["'^"'"'\\''\\]]*)[\"'\\'']?)?\\]/g,(_,k,v)=>{if("'!Object.hasOwn(this.attributes,k)||(v!==undefined&&this.attributes[k]!==decode(v)))ok=false;return '"'\\'''\\'';});s=s.replace(/#([\\w-]+)/g,(_,id)=>{if(this.id"'!==id)ok=false;return '"'\\'''\\'';});s=s.replace(/\\.([\\w-]+)/g,(_,c)=>{if("'!this.className.split(/'"\\s+/).includes(c))ok=false;return '\\'''\\'';});return ok&&("'!s.trim()||this.tagName===s.trim().toUpperCase());}
 querySelectorAll(sel){const parts=sel.split('"'\\'','\\'').map(s=>s.trim());return this.descendants().filter(e=>parts.some(p=>{const chain=p.split(/\\s+(?"'![''^'"\\[]*\\])/);if("'!e.matches(chain.pop()))return false;let a=e.parentNode;while(chain.length){const want=chain.pop();while(a&&!a.matches(want))a=a.parentNode;if(!a)return false;a=a.parentNode;}return true;}));}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 addEventListener(t,f){(this.listeners[t]||=[]).push(f);}removeEventListener(t,f){this.listeners[t]=(this.listeners[t]||[]).filter(x=>x!==f);}
 click(){if(!this.disabled){if(this.onclick)this.onclick({preventDefault(){}});for(const f of this.listeners.click||[])f.call(this,{preventDefault(){}});}}
 scrollIntoView(){}focus(){}select(){}
}
const fixture={id:GID,date:'"'\\''2026-10-13'\\'',subject:'\\''國語'\\'',kind:'\\''steps'\\'',source:'\\''測試卷第 1 題'\\'',title:'\\''測試：成語填空'\\'',question:'\\''一（ ）不苟'\\'',steps:[{title:'\\''先想意思'\\'',say:'\\''做事仔細'\\'',check:{q:'\\''哪種人'\\'',opts:['\\''馬虎'\\'','\\''認真'\\''],a:1}},{title:'\\''再想字'\\'',say:'\\''一根頭髮'\\''}],answer:'\\''絲'\\'',practice:[{q:'\\''一絲不（ ）'\\'',opts:['\\''狗'\\'','\\''苟'\\''],a:1},{q:'\\''意思'\\'',opts:['\\''仔細'\\'','\\''隨便'\\''],a:0},{q:'\\''誰'\\'',opts:['\\''仔細的人'\\'','\\''隨便的人'\\''],a:0}]};
const raw=n=>JSON.stringify({v:1,entries:{[ID]:{solved:n,idx:n,streak:3,clean:n,mastered:true,lessonDone:true,r:1,seed:22}}});
function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
 const stg=storage||new Storage(initial), clock=new Clock(), doc=new El('\\''document'\\'');doc.ownerDocument=doc;doc.createElement=t=>new El(t,doc);doc.getElementById=id=>doc.querySelector('\\''#'\\''+id);
 doc.innerHTML=html.slice(html.indexOf('\\''<div class=\"wrap\">'\\''),html.indexOf('\\''<script src='\\''));
 const events={};let reloads=0,lockcb;const location={hash,reload(){reloads++;}};
 const d={stg,clock,doc,events,readFail,writeFail,reads:[],writes:[]};
 const baseGet=stg.getItem.bind(stg),baseSet=stg.setItem.bind(stg);
 stg.getItem=k=>{d.reads.push(k);if(d.readFail&&d.readFail(k))throw new Error('\\''get-fail'\\'');return baseGet(k);};
 stg.setItem=(k,v)=>{d.writes.push([k,v]);if(d.writeFail&&d.writeFail(k,v))throw new Error('\\''set-fail'\\'');baseSet(k,v);};
 const w={document:doc,location,localStorage:stg,scrollTo(){},matchMedia:()=>({matches:true}),__G5_HARD_FIXTURE__:[fixture],
  navigator:{locks:{request(name,opts,cb){if(typeof opts==='\\''function'\\'')return new Promise(()=>{});lockcb=cb;return new Promise(()=>{});}}},
  addEventListener(t,f){(events[t]||=[]).push(f);},removeEventListener(){},dispatchEvent(e){for(const f of events[e.type]||[])f(e);},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout,setInterval:clock.setInterval,clearInterval:clock.clearInterval};
 const ctx={window:w,document:doc,navigator:w.navigator,location,localStorage:stg,console,Event:class{constructor(type){this.type=type;}},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout};
 vm.createContext(ctx);
 for(const f of ['\\''src/frac.js'\\'','\\''src/hard.js'\\''])vm.runInContext(fs.readFileSync(f,'\\''utf8'\\''),ctx,{filename:f});
 const script=[...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][0][1];
 // Expose only references for observations; all application function bodies run unchanged.
 const exposed=script.replace('\\''window.G5HelpPage ='\\'','\\''window.__review={save,route,retryRead,openPractice,startLesson,get:()=>({DB,st,E,READY,WRITER,GEN})};window.G5HelpPage ='\\'');
 vm.runInContext(exposed,ctx,{filename:'\\''src/app.html'\\''});
 // Real sync wiring is evaluated against a capture-only init; real sync is tested separately with shared storage.
 w.G5Sync={init:o=>{d.syncOptions=o;return {};}};
 vm.runInContext([...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)][1][1],ctx,{filename:'\\''src/app.html-sync-wiring'\\''});
 lockcb(writer?{}:null);
 Object.assign(d,{w,ctx,q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),go(id){location.hash=id?'\\''#h/'\\''+id:'\\'''\\'';w.dispatchEvent(new ctx.Event('\\''hashchange'\\''));},disk:()=>JSON.parse(baseGet(KEY)||'\\''null'\\''),peek:baseGet,reloads:()=>reloads});
 return d;
}
function check(name,fn){const out=fn();console.log('\\''PASS'\\'',name,JSON.stringify(out??true));}
const gcd=(a,b)=>b?gcd(b,a%b):a;
function mathAnswer(d){
 const st=d.w.G5HelpPage.state(ID),p=d.w.G5Frac.problem(st.idx,st.seed);
 const a={n:p.a.n/gcd(p.a.n,p.a.d),d:p.a.d/gcd(p.a.n,p.a.d)},b={n:p.b.n/gcd(p.b.n,p.b.d),d:p.b.d/gcd(p.b.n,p.b.d)};
 for(const [k,v]of Object.entries({'\\''a.n'\\'':a.n,'\\''a.d'\\'':a.d,'\\''b.n'\\'':b.n,'\\''b.d'\\'':b.d}))d.q('\\''#r1 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r1 button[data-check]'\\'').click();
 const l=a.d*b.d/gcd(a.d,b.d);
 for(const [k,v]of Object.entries({'\\''c.n'\\'':a.n*l/a.d,'\\''c.d'\\'':l,'\\''e.n'\\'':b.n*l/b.d,'\\''e.d'\\'':l}))d.q('\\''#r2 input[data-k=\"'\\''+k+'\\''\"]'\\'').value=String(v);
 d.q('\\''#r2 button[data-check]'\\'').click();
 const sign=a.n*b.d===b.n*a.d?'\\''='\\'':a.n*b.d>b.n*a.d?'\\''>'\\'':'\\''<'\\'',button=d.all('\\''#r3 .chip'\\'').find(b=>b.dataset.s===sign);
 const fn=button.onclick;button.click();return {fn,button};
}
function choose(d){const s=d.w.G5HelpPage.state(GID),b=d.q('\\''#practice .chip[data-k=\"'\\''+fixture.practice[s.idx%3].a+'\\''\"]'\\'');const fn=b.onclick;b.click();return {fn,b};}

(async()=>{
 const Sync=require('\\''./src/sync'\\'');
 const clock=new Clock(),backend=server(clock),local=raw(8),cloud=raw(20);
 backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:0,data:local});
 backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:1,data:cloud});
 const meta=JSON.stringify({version:1,codeHash:Sync.contentHash(CODE),keys:{[KEY]:{rev:1,hash:Sync.contentHash(local),updated:clock.now()}}});
 const a=app({hash:'\\'''\\'',initial:{[KEY]:local,'\\''g5sync.code'\\'':CODE,'\\''g5sync.meta'\\'':meta}});
 let failNextRead=false;
 a.writeFail=(k,v)=>{if(k===KEY&&v===cloud)failNextRead=true;return false;};
 a.readFail=k=>{if(k===KEY&&failNextRead){failNextRead=false;return true;}return false;};
 const d=device(backend,{keys:[KEY],storage:a.stg,canReplace:a.syncOptions.canReplace,accept:a.syncOptions.accept});
 await d.api.ready;
 assert.equal(a.disk().entries[ID].solved,20);
 assert.equal(a.w.G5HelpPage.state(ID).solved,8);
 console.log('\\''REPRO NEW-1 after successful remote set + one get throw'\\'',JSON.stringify({disk:a.disk().entries[ID].solved,memory:a.w.G5HelpPage.state(ID).solved,DIRTY:a.w.G5HelpDirty(),sync:d.api.getState().status,metaRev:JSON.parse(a.peek('\\''g5sync.meta'\\'')).keys[KEY].rev}));
 // Let the sync poll observe the partial commit before user enters, to rule out a merely tiny race.
 a.writeFail=null;a.readFail=null;await clock.advance(4000);
 assert.ok(d.api.getState().conflicts[KEY]);assert.equal(a.w.G5HelpPage.state(ID).solved,8);
 a.go(ID);a.q('\\''#goPractice'\\'').click();assert.equal(a.disk().entries[ID].solved,8);console.log('\\''REPRO NEW-1 just opening practice already rolls disk 20 -> 8'\\'');mathAnswer(a);
 assert.equal(a.disk().entries[ID].solved,9);
 const reopen=app({initial:a.stg.dump()});assert.equal(reopen.w.G5HelpPage.state(ID).solved,9);
 console.log('\\''REPRO NEW-1 after retry conflict + one real math answer + reopen'\\'',JSON.stringify({disk:a.disk().entries[ID].solved,reopen:reopen.w.G5HelpPage.state(ID).solved,DIRTY:a.w.G5HelpDirty(),warnHidden:a.q('\\''#saveWarn'\\'').hidden,cloud:JSON.parse(backend.store.record(CODE,KEY).data).entries[ID].solved}));
 d.api.destroy();
 const r=app({initial:{[KEY]:raw(8)},readFail:k=>k===KEY});
 const old=r.q('\\''#readRetry'\\''),retry=old.onclick;
 r.readFail=null;old.click();r.writeFail=k=>k===KEY;r.q('\\''#goPractice'\\'').click();mathAnswer(r);
 assert.equal(r.w.G5HelpPage.state(ID).solved,9);assert.equal(r.w.G5HelpDirty(),1);
 retry.call(old);
 assert.equal(r.w.G5HelpPage.state(ID).solved,8);assert.equal(r.w.G5HelpDirty(),1);
 r.writeFail=null;await r.clock.advance(3000);assert.equal(r.disk().entries[ID].solved,8);assert.equal(r.w.G5HelpDirty(),0);
 console.log('\\''REPRO NEW-2 explicit replay stale readRetry after success + failed-save answer: memory=9/DIRTY=1 -> memory=8 -> timer disk=8/DIRTY=0'\\'');
 // Current-question hint stale callback crosses GEN: direct callback replay only, not ordinary click.
 const h=app();h.q('\\''#goPractice'\\'').click();const hint=h.q('\\''#r1 button[data-hint]'\\''),hh=hint.onclick,oldCur=h.w.__review.get().st.cur;
 h.go(GID);h.q('\\''#goPractice'\\'').click();const gen=h.w.__review.get().GEN;hh.call(hint);
 assert.equal(oldCur.hints,1);assert.equal(h.disk().entries[ID].cur.hints,1);
 console.log('\\''REPRO INVARIANT-4 stale math hint replay after route: previous entry hints changed 0->1 and persisted; GEN='\\''+gen);
})().catch(e=>{console.error(e);process.exitCode=1});
'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
REPRO NEW-1 after successful remote set + one get throw {"disk":20,"memory":8,"DIRTY":0,"sync":"雲端有較新的進度，回到首頁、存好後就會換上。","metaRev":1}
REPRO NEW-1 just opening practice already rolls disk 20 -> 8
REPRO NEW-1 after retry conflict + one real math answer + reopen {"disk":9,"reopen":9,"DIRTY":0,"warnHidden":true,"cloud":20}
REPRO NEW-2 explicit replay stale readRetry after success + failed-save answer: memory=9/DIRTY=1 -> memory=8 -> timer disk=8/DIRTY=0
REPRO INVARIANT-4 stale math hint replay after route: previous entry hints changed 0->1 and persisted; GEN=2

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[已驗證] 第 5 輪四項指定反例已修正，但另重現進度倒退路徑。以下使用原碼及記憶體中的 DOM／Storage 替身實測，未修改檔案。

驗收固定於 `455135d`。期間 HEAD 被外部推進至 `0c98e01`；已確認受測核心檔與指定 commit 一致，`index.html` 也與記憶體中重新建置的結果一致。

| 項目 | PASS/FAIL | 證據 |
|---|---|---|
| 第 5 輪必修 1：冷啟動讀取失敗 | PASS | 分別預存主 key、舊 `g5math.v1` 的 `solved=8、mastered=true`，令該 key 讀取拋錯。實際沒有練習按鈕、有「再讀一次」、寫入次數為 0。恢復讀取並重試，完成一題後重開：`solved=9、mastered=true`。[讀取及 READY 接線](/Users/william/Documents/g5-help/src/app.html:252) |
| 第 5 輪必修 2：排隊 reload 遺失答案 | PASS | 實際執行 app 的同步接線：有 DIRTY 時，在篇內及首頁均拒絕套用；已存好但仍在篇內也拒絕；首頁且無 DIRTY 才接受。接受後再製造未存答案並放行 timer，`reload=0、DIRTY=1`，答案仍在記憶體。[套用入口](/Users/william/Documents/g5-help/src/app.html:309) |
| 第 5 輪必修 3：首頁警告及重試 | PASS | 令主 key 寫入失敗，答對一題後回首頁：全域 `#saveWarn.hidden=false`。恢復寫入並推進 3 秒，磁碟保存該題、`DIRTY=0`、警告隱藏。另測兩篇同時未存，以及壞資料備份失敗，恢復後皆保存兩篇。[重試及警告](/Users/william/Documents/g5-help/src/app.html:276) |
| 第 5 輪建議 4：兩個指定舊畫面反例 | PASS | 保留國語「我懂了，下一步」callback，切數學後重播：無例外、不新增教學步驟。另注入磁碟 `solved=7` 並派送 `storage`，目前題答對後實際保存 `solved=1`，DB／st／cur 未被事件換掉。國語及數學答對 callback 各重播一次，皆只計一題。[世代檢查](/Users/william/Documents/g5-help/src/app.html:675) |
| 設計 C 不變量 1：取鎖且讀成功才作答 | PASS | 上述兩種讀取失敗均阻擋作答；另模擬未取得鎖，實際無作答按鈕、不初始化同步、寫入次數為 0。[鎖接線](/Users/william/Documents/g5-help/src/app.html:757) |
| 設計 C 不變量 2、3：雲端部分寫入後，磁碟與記憶體分歧 | **FAIL** | **新反例：**本機與 baseline 為 8 題、雲端為 20 題；首頁接受雲端時，讓主 key `setItem` 成功，但緊接的 `getItem` 僅拋錯一次。實際磁碟已是 20，記憶體仍為 8，`DIRTY=0`。放行下一次同步後雖出現衝突，仍可開啟練習，**磁碟立即 20→8**；答一題並重開變成 9，且無未存警告。雲端 20 題仍保留，這是已確認的本機倒退。原因是[第 313 行](/Users/william/Documents/g5-help/src/app.html:313)寫入後讀回失敗直接返回，未執行下一行的 DB 更新；[同步端](/Users/william/Documents/g5-help/src/sync.js:311)將其當成尚未接受。 |
| 設計 C 不變量 4：所有舊操作失效 | **FAIL** | **新反例：**冷啟動讀取失敗時保留「再讀一次」callback；恢復並成功重讀 8 題，接著讓寫入失敗、答對一題，得到記憶體 9 題／`DIRTY=1`。重播保留的 callback，記憶體立即退回磁碟的 8 題；恢復寫入並放行 3 秒重試後，磁碟 8 題／`DIRTY=0`，未存答案消失。[retryRead](/Users/william/Documents/g5-help/src/app.html:302)沒有世代或 DIRTY 防護，直接替換 DB。另重播切篇前的數學提示 callback，也會把前篇 `hints` 從 0 改成 1 並保存；[該 handler](/Users/william/Documents/g5-help/src/app.html:621)沒有世代檢查。兩者均為明確重播舊 callback 的邊界測試，未宣稱一般點擊必然觸發。 |
| 共用 sync.js：未提供 canReplace／accept | PASS | 將 `455135d^` 的既有同步測試在記憶體中，分別對改前及改後模組執行：兩者均 **41／41 通過**，涵蓋下載、備份、衝突、故障重試及 replacement callback。程式差異亦確認：沒有函式掛勾時仍走原本直接寫入路徑。此結論限共用模組；未讀取或驗收自然站另一 repo。[fallback](/Users/william/Documents/g5-help/src/sync.js:303) |
| 指定 Node 測試 | PASS | `node --test tests/*.test.js`：**80／80 通過，exit 0**。既有測試未攔下上述新增反例。 |

[未驗證] 已嘗試 `python3.12 -B tests/e2e.py`，並另執行指定 commit 的記憶體版本；均在 Playwright 啟動時因唯讀沙箱拒絕 `mkdtemp` 而發生 `EPERM`。因此 Chromium／WebKit e2e **不能跑**，上述替身結果不等於瀏覽器驗收通過。

整體結論：FAIL
hook: Stop
hook: Stop Completed
tokens used
117,045
[已驗證] 第 5 輪四項指定反例已修正，但另重現進度倒退路徑。以下使用原碼及記憶體中的 DOM／Storage 替身實測，未修改檔案。

驗收固定於 `455135d`。期間 HEAD 被外部推進至 `0c98e01`；已確認受測核心檔與指定 commit 一致，`index.html` 也與記憶體中重新建置的結果一致。

| 項目 | PASS/FAIL | 證據 |
|---|---|---|
| 第 5 輪必修 1：冷啟動讀取失敗 | PASS | 分別預存主 key、舊 `g5math.v1` 的 `solved=8、mastered=true`，令該 key 讀取拋錯。實際沒有練習按鈕、有「再讀一次」、寫入次數為 0。恢復讀取並重試，完成一題後重開：`solved=9、mastered=true`。[讀取及 READY 接線](/Users/william/Documents/g5-help/src/app.html:252) |
| 第 5 輪必修 2：排隊 reload 遺失答案 | PASS | 實際執行 app 的同步接線：有 DIRTY 時，在篇內及首頁均拒絕套用；已存好但仍在篇內也拒絕；首頁且無 DIRTY 才接受。接受後再製造未存答案並放行 timer，`reload=0、DIRTY=1`，答案仍在記憶體。[套用入口](/Users/william/Documents/g5-help/src/app.html:309) |
| 第 5 輪必修 3：首頁警告及重試 | PASS | 令主 key 寫入失敗，答對一題後回首頁：全域 `#saveWarn.hidden=false`。恢復寫入並推進 3 秒，磁碟保存該題、`DIRTY=0`、警告隱藏。另測兩篇同時未存，以及壞資料備份失敗，恢復後皆保存兩篇。[重試及警告](/Users/william/Documents/g5-help/src/app.html:276) |
| 第 5 輪建議 4：兩個指定舊畫面反例 | PASS | 保留國語「我懂了，下一步」callback，切數學後重播：無例外、不新增教學步驟。另注入磁碟 `solved=7` 並派送 `storage`，目前題答對後實際保存 `solved=1`，DB／st／cur 未被事件換掉。國語及數學答對 callback 各重播一次，皆只計一題。[世代檢查](/Users/william/Documents/g5-help/src/app.html:675) |
| 設計 C 不變量 1：取鎖且讀成功才作答 | PASS | 上述兩種讀取失敗均阻擋作答；另模擬未取得鎖，實際無作答按鈕、不初始化同步、寫入次數為 0。[鎖接線](/Users/william/Documents/g5-help/src/app.html:757) |
| 設計 C 不變量 2、3：雲端部分寫入後，磁碟與記憶體分歧 | **FAIL** | **新反例：**本機與 baseline 為 8 題、雲端為 20 題；首頁接受雲端時，讓主 key `setItem` 成功，但緊接的 `getItem` 僅拋錯一次。實際磁碟已是 20，記憶體仍為 8，`DIRTY=0`。放行下一次同步後雖出現衝突，仍可開啟練習，**磁碟立即 20→8**；答一題並重開變成 9，且無未存警告。雲端 20 題仍保留，這是已確認的本機倒退。原因是[第 313 行](/Users/william/Documents/g5-help/src/app.html:313)寫入後讀回失敗直接返回，未執行下一行的 DB 更新；[同步端](/Users/william/Documents/g5-help/src/sync.js:311)將其當成尚未接受。 |
| 設計 C 不變量 4：所有舊操作失效 | **FAIL** | **新反例：**冷啟動讀取失敗時保留「再讀一次」callback；恢復並成功重讀 8 題，接著讓寫入失敗、答對一題，得到記憶體 9 題／`DIRTY=1`。重播保留的 callback，記憶體立即退回磁碟的 8 題；恢復寫入並放行 3 秒重試後，磁碟 8 題／`DIRTY=0`，未存答案消失。[retryRead](/Users/william/Documents/g5-help/src/app.html:302)沒有世代或 DIRTY 防護，直接替換 DB。另重播切篇前的數學提示 callback，也會把前篇 `hints` 從 0 改成 1 並保存；[該 handler](/Users/william/Documents/g5-help/src/app.html:621)沒有世代檢查。兩者均為明確重播舊 callback 的邊界測試，未宣稱一般點擊必然觸發。 |
| 共用 sync.js：未提供 canReplace／accept | PASS | 將 `455135d^` 的既有同步測試在記憶體中，分別對改前及改後模組執行：兩者均 **41／41 通過**，涵蓋下載、備份、衝突、故障重試及 replacement callback。程式差異亦確認：沒有函式掛勾時仍走原本直接寫入路徑。此結論限共用模組；未讀取或驗收自然站另一 repo。[fallback](/Users/william/Documents/g5-help/src/sync.js:303) |
| 指定 Node 測試 | PASS | `node --test tests/*.test.js`：**80／80 通過，exit 0**。既有測試未攔下上述新增反例。 |

[未驗證] 已嘗試 `python3.12 -B tests/e2e.py`，並另執行指定 commit 的記憶體版本；均在 Playwright 啟動時因唯讀沙箱拒絕 `mkdtemp` 而發生 `EPERM`。因此 Chromium／WebKit e2e **不能跑**，上述替身結果不等於瀏覽器驗收通過。

整體結論：FAIL
rc=0

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/sync.js | sed -n '140,620p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   140	      var stamp = Math.max(now(), names.length ? Number(names[names.length - 1].slice(prefix.length)) + 1 : 0);
   141	      // Write before pruning: quota errors must NEVER discard progress or its last backup.
   142	      var target = prefix + stamp;
   143	      write(target, data);
   144	      if (read(target) !== data) { throw error('storage'); }
   145	      names.push(target);
   146	      while (names.length > 3) { storage.removeItem(names.shift()); }
   147	    }
   148	    function summary(key, data) {
   149	      if (data === null) { return '沒有進度紀錄'; }
   150	      try {
   151	        if (options.summarize && typeof options.summarize[key] === 'function') { return String(options.summarize[key](data)); }
   152	      } catch (ignore) { /* Summary errors cannot prevent reconciliation. */ }
   153	      return '完整紀錄，共 ' + data.length + ' 字元';
   154	    }
   155	    function el(tag, className, text) {
   156	      var node = doc.createElement(tag);
   157	      node.className = 'g5s-' + className;
   158	      if (typeof text !== 'undefined') { node.textContent = text; }
   159	      return node;
   160	    }
   161	    function button(text, fn) {
   162	      var b = el('button', 'button', text);
   163	      b.type = 'button'; b.style.minHeight = '44px';
   164	      b.addEventListener('click', fn);
   165	      return b;
   166	    }
   167	    function link() {
   168	      var href = root.location ? root.location.href : '';
   169	      return href.split('#')[0] + '#sync=' + (code || '');
   170	    }
   171	    function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }
   172	    function buildView() {
   173	      clear(container);
   174	      var panel = el('section', 'panel');
   175	      panel.setAttribute('aria-label', '家庭跨裝置同步');
   176	      view = {panel: panel};
   177	      if (!code) {
   178	        panel.appendChild(button('開啟跨裝置同步（這台是第一台）', function () { enable(); }));
   179	        panel.appendChild(button('輸入同步碼（已在別台開過）', function () {
   180	          view.join.hidden = false; view.input.focus();
   181	        }));
   182	        var form = el('form', 'join'); form.hidden = true;
   183	        var label = el('label', 'label', '同步碼');
   184	        var input = el('input', 'input'); input.type = 'text'; input.maxLength = 80;
   185	        input.autocomplete = 'off'; input.spellcheck = false; input.style.minHeight = '44px';
   186	        input.setAttribute('autocapitalize', 'characters'); input.setAttribute('aria-label', '同步碼');
   187	        label.appendChild(input); form.appendChild(label);
   188	        form.appendChild(el('p', 'hint', BAD_CODE));
   189	        form.appendChild(button('加入同步', function () { join(input.value); }));
   190	        form.addEventListener('submit', function (event) { event.preventDefault(); join(input.value); });
   191	        panel.appendChild(form); view.join = form; view.input = input;
   192	      } else {
   193	        panel.appendChild(el('p', 'code', code.match(/.{4}/g).join('-')));
   194	        var qrBox = el('div', 'qr');
   195	        qrBox.setAttribute('aria-label', '掃描 QR code 加入同步');
   196	        try {
   197	          if (typeof root.qrcode !== 'function') { throw error('qr'); }
   198	          var qr = root.qrcode(0, 'M'); qr.addData(link()); qr.make();
   199	          qrBox.innerHTML = qr.createSvgTag({cellSize: 4, margin: 16, scalable: true});
   200	          qrBox.style.maxWidth = '256px';
   201	        } catch (qrError) { qrBox.textContent = 'QR code 無法顯示，請使用下方連結或同步碼。'; }
   202	        panel.appendChild(qrBox);
   203	        var share = el('input', 'link'); share.type = 'text'; share.readOnly = true;
   204	        share.value = link(); share.setAttribute('aria-label', '同步連結'); share.style.minHeight = '44px';
   205	        panel.appendChild(share);
   206	        panel.appendChild(button('複製連結', function () {
   207	          var clipboard = root.navigator && root.navigator.clipboard;
   208	          if (clipboard && clipboard.writeText) {
   209	            Promise.resolve().then(function () { return clipboard.writeText(link()); }).then(function () {
   210	              notice = '連結已複製。'; render();
   211	            }, function () { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); });
   212	          } else { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); }
   213	        }));
   214	        panel.appendChild(button('這台停止同步', function () { stop(); }));
   215	      }
   216	      view.status = el('p', 'status'); view.status.setAttribute('role', 'status'); view.status.setAttribute('aria-live', 'polite');
   217	      view.notice = el('p', 'notice'); view.notice.setAttribute('role', 'alert');
   218	      view.conflicts = el('div', 'conflicts');
   219	      panel.appendChild(view.status); panel.appendChild(view.notice); panel.appendChild(view.conflicts);
   220	      container.appendChild(panel); viewCode = code;
   221	    }
   222	    function render() {
   223	      if (destroyed) { return; }
   224	      if (viewCode !== code || !view.panel) { buildView(); }
   225	      view.status.textContent = status; view.notice.textContent = notice;
   226	      var signature = keys.map(function (key) {
   227	        if (!conflicts[key]) { return ''; }
   228	        var local = read(key);
   229	        return key + ':' + conflicts[key].rev + ':' + observe(key, local).hash + ':' + (decisions[key] || '');
   230	      }).join('|');
   231	      if (view.signature === signature) { return; }
   232	      view.signature = signature;
   233	      clear(view.conflicts);
   234	      keys.forEach(function (key) {
   235	        var cloud = conflicts[key];
   236	        if (!cloud) { return; }
   237	        var local = read(key), obs = observe(key, local);
   238	        var box = el('section', 'conflict');
   239	        box.appendChild(el('h3', 'conflict-title', key + '：請選擇保留哪份完整紀錄'));
   240	        box.appendChild(el('p', 'local-summary', '這台：' + summary(key, local)));
   241	        box.appendChild(el('p', 'local-time', '本機變更偵測時間：' + taipei(obs.detected, true) + '；實際作答時間由各站紀錄提供。'));
   242	        box.appendChild(el('p', 'cloud-summary', '雲端：' + summary(key, cloud.data)));
   243	        box.appendChild(el('p', 'cloud-time', '雲端更新時間：' + taipei(cloud.updated, true)));
   244	        var keepLocal = button('留這台的', function () { resolve(key, 'local'); }); keepLocal.disabled = local === null || !!decisions[key];
   245	        var keepCloud = button('留雲端的', function () { resolve(key, 'cloud'); }); keepCloud.disabled = cloud.data === null || !!decisions[key];
   246	        box.appendChild(keepLocal); box.appendChild(keepCloud); view.conflicts.appendChild(box);
   247	      });
   248	    }
   249	    function validSnapshot(r) {
   250	      return r && integer(r.rev) && (r.rev === 0 ? r.data === null && r.updated === null :
   251	        typeof r.data === 'string' && r.data.length <= 900000 && integer(r.updated));
   252	    }
   253	    function request(req, token) {
   254	      assertActive(token);
   255	      if (!options.endpoint || typeof fetcher !== 'function') { return Promise.reject(error('server')); }
   256	      if (root.navigator && root.navigator.onLine === false) { return Promise.reject(error('offline')); }
   257	      req.code = code;
   258	      return new Promise(function (done, reject) {
   259	        var settled = false;
   260	        var controller = root.AbortController ? new root.AbortController() : null;
   261	        activeAbort = controller;
   262	        var timeout = root.setTimeout(function () {
   263	          if (controller) { controller.abort(); }
   264	          finish(error('offline'));
   265	        }, 15000);
   266	        function finish(err, value) {
   267	          if (settled) { return; }
   268	          settled = true; root.clearTimeout(timeout);
   269	          if (activeAbort === controller) { activeAbort = null; }
   270	          if (err) { reject(err); } else { done(value); }
   271	        }
   272	        var config = {method: 'POST', headers: {'Content-Type': 'text/plain'}, body: JSON.stringify(req),
   273	          mode: 'cors', credentials: 'omit', redirect: 'follow', cache: 'no-store'};
   274	        if (controller) { config.signal = controller.signal; }
   275	        Promise.resolve().then(function () { return fetcher(options.endpoint, config); }).then(function (response) {
   276	          assertActive(token);
   277	          if (!response || response.ok === false || typeof response.json !== 'function') { throw error('server'); }
   278	          return Promise.resolve().then(function () { return response.json(); }).catch(function () { throw error('server'); });
   279	        }, function () { throw error('offline'); }).then(function (r) {
   280	          assertActive(token);
   281	          if (!r || (r.ok !== true && r.ok !== false)) { throw error('server'); }
   282	          if (req.op === 'get' && r.ok !== true) { throw error('server'); }
   283	          if (r.ok === false && r.err !== 'conflict') { throw error(r.err === 'too-big' ? 'too-big' : 'server'); }
   284	          if ((req.op === 'get' || r.err === 'conflict') && !validSnapshot(r)) { throw error('server'); }
   285	          if (req.op === 'put' && r.ok && (!integer(r.rev) || r.rev !== req.rev + 1 || !integer(r.updated))) { throw error('server'); }
   286	          finish(null, r);
   287	        }).catch(function (err) { finish(err); });
   288	      });
   289	    }
   290	    function showConflict(key, cloud) {
   291	      delete decisions[key]; // A newly observed cloud version requires a new choice.
   292	      conflicts[key] = {rev: cloud.rev, data: cloud.data, updated: cloud.updated};
   293	      status = '有兩份進度，請選擇要保留的紀錄。';
   294	      render();
   295	    }
   296	    function replaceLocal(key, cloud, token) {
   297	      assertActive(token);
   298	      if (cloud.data === null) { throw error('server'); }
   299	      var currentMeta = baseline(key);
   300	      if (currentMeta && currentMeta.rev > cloud.rev) { showConflict(key, cloud); return; }
   301	      // 頁面自己是唯一寫入者時（難題站，#1303 第 5 輪）：先問能不能換（有未存進度、正在某一篇裡就不行），
   302	      // 不行就什麼都不動（不備份、不寫），下一輪再 GET 再問；可以才備份，並交給頁面自己寫入與重畫（不 reload）。
   303	      if (typeof options.canReplace === 'function' && !options.canReplace(key)) {
   304	        needsGet[key] = true; deferred[key] = true; return;
   305	      }
   306	      var local = read(key);
   307	      backup(key, local);
   308	      assertActive(token);
   309	      // Synchronous read/backup/write; no awaited work between decision and replacement.
   310	      if (typeof options.accept === 'function') {
   311	        if (!options.accept(key, cloud.data)) { needsGet[key] = true; deferred[key] = true; return; }
   312	      } else { write(key, cloud.data); }
   313	      if (read(key) !== cloud.data) { throw error('storage'); }
   314	      delete deferred[key];
   315	      replaced.push(key); // Notify even if persisting the following metadata fails.
   316	      saveBaseline(key, cloud.rev, cloud.data, cloud.updated);
   317	      delete conflicts[key];
   318	    }
   319	    function put(key, data, rev, token, chosenCloud) {
   320	      if (data === null) { return Promise.resolve(); }
   321	      if (data.length > 900000) { return Promise.reject(error('too-big')); }
   322	      if (chosenCloud) { backup(key, chosenCloud.data); }
   323	      return request({op: 'put', key: key, rev: rev, data: data}, token).then(function (r) {
   324	        assertActive(token);
   325	        if (r.err === 'conflict') { showConflict(key, r); return; }
   326	        // The baseline is the exact request payload, never a newer local edit.
   327	        saveBaseline(key, r.rev, data, r.updated);
   328	        delete conflicts[key];
   329	      });
   330	    }
   331	    function reconcile(key, cloud, token) {
   332	      assertActive(token);
   333	      var local = read(key), meta = baseline(key), hash = observe(key, local).hash;
   334	      needsGet[key] = false;
   335	      if (cloud.rev === 0) {
   336	        if (local !== null) { return put(key, local, 0, token); }
   337	        saveBaseline(key, 0, null, null); return;
   338	      }
   339	      if (!meta) {
   340	        if (local === null) { replaceLocal(key, cloud, token); }
   341	        else { showConflict(key, cloud); }
   342	        return;
   343	      }
   344	      // 本機內容已經和雲端一字不差（已同步過的裝置；例如頁面寫進去了但讀回失敗，#1303 第 6 輪）。第一次加入仍照 A4 一律問：只補 baseline，不出衝突、不備份、不換
   345	      if (local !== null && local === cloud.data) { saveBaseline(key, cloud.rev, cloud.data, cloud.updated); delete conflicts[key]; return; }
   346	      if (cloud.rev < meta.rev || (cloud.rev === meta.rev && contentHash(cloud.data) !== meta.hash)) {
   347	        showConflict(key, cloud); return;
   348	      }
   349	      if (cloud.rev > meta.rev) {
   350	        if (hash === meta.hash) { replaceLocal(key, cloud, token); }
   351	        else { showConflict(key, cloud); }
   352	        return;
   353	      }
   354	      if (hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   355	    }
   356	    function resetSession(nextCode) {
   357	      epoch += 1; code = nextCode; needsGet = {}; conflicts = {}; decisions = {}; observed = {}; replaced = []; deferred = {};
   358	      failures = 0; retryAt = 0; notice = '';
   359	      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   360	      keys.forEach(function (key) { needsGet[key] = true; });
   361	      status = code ? '正在同步' : '尚未開啟同步';
   362	    }
   363	    function failure(err) {
   364	      if (err.kind === 'stale') { return; }
   365	      failures += 1;
   366	      var delay = Math.min(60000, 4000 * Math.pow(2, Math.min(failures - 1, 4)));
   367	      retryAt = now() + delay;
   368	      status = err.kind === 'offline' ? '離線中，連上網路會自動補上' : '同步失敗，稍後自動再試';
   369	      if (err.kind === 'storage' || err.name === 'QuotaExceededError') { notice = '本機儲存空間不足或無法使用，請保留原進度並檢查瀏覽器儲存設定。'; }
   370	      if (err.kind === 'too-big') { notice = '這份進度超過 900000 字元，請先保留本機資料。'; }
   371	      if (retryTimer !== null) { root.clearTimeout(retryTimer); }
   372	      retryTimer = root.setTimeout(function () { retryTimer = null; sync(); }, delay);
   373	    }
   374	    function completed() {
   375	      if (keys.some(function (key) { return !!conflicts[key]; })) {
   376	        status = '有兩份進度，請選擇要保留的紀錄。'; return;
   377	      }
   378	      var dirty = keys.some(function (key) {
   379	        var meta = baseline(key), local = read(key);
   380	        return needsGet[key] || !meta || contentHash(local) !== meta.hash;
   381	      });
   382	      status = dirty ? '等待同步本機變更' : '已同步 ' + taipei(now(), false);
   383	      if (keys.some(function (key) { return !!deferred[key]; })) { status = '雲端有較新的進度，回到首頁、存好後就會換上。'; }
   384	      if (keys.some(function (key) { var meta = baseline(key); return meta && meta.rev > 0 && read(key) === null; })) {
   385	        status = '這台的進度已移除，雲端紀錄保留；重新加入可下載。';
   386	      }
   387	    }
   388	    function run(job, force) {
   389	      if (destroyed || stopped) { return Promise.resolve(false); }
   390	      if (busy) { return busy.then(function () { return run(job, force); }); }
   391	      var token;
   392	      busy = Promise.resolve().then(function () {
   393	        var saved = read(CODE);
   394	        if (saved !== code) { resetSession(saved && normalizeCode(saved) === saved ? saved : null); }
   395	        if (!code || (!force && now() < retryAt)) { return false; }
   396	        token = epoch;
   397	        return job(token).then(function () {
   398	          assertActive(token);
   399	          failures = 0; retryAt = 0;
   400	          notice = '';
   401	          if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   402	          completed(); return true;
   403	        });
   404	      }).catch(function (err) {
   405	        if (typeof token === 'undefined' || token === epoch) { failure(err); }
   406	        return false;
   407	      }).then(function (result) {
   408	        busy = null;
   409	        try { render(); } catch (ignoreRender) { /* Storage failures may also affect conflict display. */ }
   410	        var callbacks = replaced; replaced = [];
   411	        callbacks.forEach(function (key) {
   412	          if (typeof options.onReplaced === 'function') {
   413	            try { options.onReplaced(key); } catch (ignoreCallback) { /* Host callback cannot break the scheduler. */ }
   414	          }
   415	        });
   416	        return result;
   417	      });
   418	      return busy;
   419	    }
   420	    function sync(force) {
   421	      return run(function (token) {
   422	        var chain = Promise.resolve();
   423	        var firstError = null;
   424	        keys.forEach(function (key) {
   425	          chain = chain.then(function () {
   426	            assertActive(token);
   427	            if (decisions[key]) { return applyDecision(key, token); }
   428	            if (conflicts[key]) { observe(key, read(key)); return; }
   429	            if (needsGet[key]) {
   430	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   431	            }
   432	            var local = read(key), meta = baseline(key);
   433	            if (!meta) {
   434	              needsGet[key] = true;
   435	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   436	            }
   437	            if (observe(key, local).hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   438	          }).catch(function (err) {
   439	            if (err.kind === 'stale') { throw err; }
   440	            if (!firstError) { firstError = err; }
   441	          });
   442	        });
   443	        return chain.then(function () { if (firstError) { throw firstError; } });
   444	      }, force === true);
   445	    }
   446	    function activate(newCode) {
   447	      // Clear the old baseline first. A partial storage failure then fails conservatively.
   448	      storage.removeItem(META);
   449	      write(CODE, newCode);
   450	      stopped = false; resetSession(newCode); render();
   451	      return sync(true);
   452	    }
   453	    function enable() {
   454	      if (code && !stopped) { return sync(true); }
   455	      try {
   456	        var random = options.random;
   457	        if (!random && root.crypto && root.crypto.getRandomValues) { random = root.crypto.getRandomValues.bind(root.crypto); }
   458	        if (random && typeof random !== 'function' && random.getRandomValues) { random = random.getRandomValues.bind(random); }
   459	        if (!random) { throw error('random'); }
   460	        var generated = '', tries = 0, limit = Math.floor(256 / ALPHABET.length) * ALPHABET.length;
   461	        while (generated.length < 12 && tries < 128) {
   462	          var bytes = new Uint8Array(32); random(bytes); tries += 1;
   463	          for (var i = 0; i < bytes.length && generated.length < 12; i += 1) {
   464	            if (bytes[i] < limit) { generated += ALPHABET.charAt(bytes[i] % ALPHABET.length); }
   465	          }
   466	        }
   467	        if (generated.length !== 12) { throw error('random'); }
   468	        return activate(generated);
   469	      } catch (err) {
   470	        status = '同步失敗，稍後自動再試';
   471	        notice = err.kind === 'random' ? '此瀏覽器無法安全產生同步碼，請使用 HTTPS 開啟網站。' : '無法儲存同步設定，請檢查瀏覽器儲存空間。';
   472	        render(); return Promise.resolve(false);
   473	      }
   474	    }
   475	    function join(value) {
   476	      var normalized = normalizeCode(value);
   477	      if (!normalized) { notice = BAD_CODE; render(); return Promise.resolve(false); }
   478	      try { return activate(normalized); }
   479	      catch (err) { failure(err); render(); return Promise.resolve(false); }
   480	    }
   481	    function applyDecision(key, token) {
   482	      var cloud = conflicts[key], choice = decisions[key], action;
   483	      if (!cloud || !choice) { delete decisions[key]; return Promise.resolve(); }
   484	      if (choice === 'local') { action = put(key, read(key), cloud.rev, token, cloud); }
   485	      else {
   486	        // Re-fetch before accepting cloud: do not silently accept a version the parent never saw.
   487	        action = request({op: 'get', key: key}, token).then(function (latest) {
   488	          if (latest.rev !== cloud.rev || latest.data !== cloud.data) { showConflict(key, latest); return; }
   489	          replaceLocal(key, latest, token);
   490	        });
   491	      }
   492	      return action.then(function () { delete decisions[key]; });
   493	    }
   494	    function resolve(key, choice) {
   495	      if (destroyed || stopped || !conflicts[key] || decisions[key] || keys.indexOf(key) < 0 || (choice !== 'local' && choice !== 'cloud')) { return Promise.resolve(false); }
   496	      decisions[key] = choice;
   497	      render();
   498	      return run(function (token) { return applyDecision(key, token); }, true);
   499	    }
   500	    function stop() {
   501	      stopped = true; epoch += 1;
   502	      if (activeAbort) { activeAbort.abort(); }
   503	      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   504	      code = null; conflicts = {}; decisions = {}; replaced = []; notice = '';
   505	      var ok = true;
   506	      try { storage.removeItem(CODE); storage.removeItem(META); }
   507	      catch (err) { ok = false; notice = '同步已暫停，但瀏覽器無法清除設定；請檢查儲存權限。'; }
   508	      status = ok ? '這台已停止同步，進度仍保留。' : '同步已暫停';
   509	      render(); return ok;
   510	    }
   511	    function visibility() { if (doc.visibilityState === 'hidden' && !stopped) { sync(true); } }
   512	    function online() { if (!stopped) { sync(true); } }
   513	    function storageEvent(event) {
   514	      if (!event || event.key === CODE || event.key === META || keys.indexOf(event.key) >= 0 || event.key === null) {
   515	        // A stop on another same-origin tab also prevents this tab's in-flight readback.
   516	        if (!stopped) { sync(); }
   517	      }
   518	    }
   519	    function hashInvitation() {
   520	      if (!root.location || !root.history) { return null; }
   521	      var parts = root.location.hash.replace(/^#/, '').split('&'), kept = [], invitation = null;
   522	      parts.forEach(function (part) {
   523	        if (/^sync=/.test(part)) {
   524	          try { invitation = decodeURIComponent(part.slice(5)); } catch (ignore) { invitation = '!'; }
   525	        } else if (part) { kept.push(part); }
   526	      });
   527	      if (invitation !== null) {
   528	        root.history.replaceState(root.history.state, '', root.location.href.split('#')[0] + (kept.length ? '#' + kept.join('&') : ''));
   529	      }
   530	      return invitation;
   531	    }
   532	    var invitation = null;
   533	    try {
   534	      invitation = hashInvitation();
   535	      var saved = read(CODE);
   536	      if (saved && normalizeCode(saved) === saved) { resetSession(saved); }
   537	      else if (saved) { notice = BAD_CODE; }
   538	    } catch (err) { status = '同步失敗，稍後自動再試'; notice = '無法讀取同步設定，原進度保留。'; }
   539	    render();
   540	    doc.addEventListener('visibilitychange', visibility);
   541	    if (root.addEventListener) { root.addEventListener('online', online); root.addEventListener('storage', storageEvent); }
   542	    var interval = root.setInterval(function () { if (!stopped) { sync(); } }, 4000);
   543	    var api = {
   544	      enable: enable, join: join, stop: stop, sync: sync, resolve: resolve, link: link,
   545	      getState: function () { return {code: code, status: status, notice: notice, conflicts: JSON.parse(JSON.stringify(conflicts)), retryAt: retryAt, failures: failures}; },
   546	      destroy: function () {
   547	        destroyed = true; epoch += 1; replaced = [];
   548	        root.clearInterval(interval); if (retryTimer !== null) { root.clearTimeout(retryTimer); }
   549	        if (activeAbort) { activeAbort.abort(); }
   550	        doc.removeEventListener('visibilitychange', visibility);
   551	        if (root.removeEventListener) { root.removeEventListener('online', online); root.removeEventListener('storage', storageEvent); }
   552	      }
   553	    };
   554	    api.ready = invitation !== null ? join(invitation) : sync();
   555	    return api;
   556	  }
   557	  return {init: init, normalizeCode: normalizeCode, contentHash: contentHash};
   558	}));

hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/app.html | sed -n '130,455p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   130	@media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}
   131	</style>
   132	
   133	<div class="wrap">
   134	  <header class="hero">
   135	    <h1>五年級難題解說</h1>
   136	    <span class="muted">不懂的題目，一題一篇，只講那一題<span id="cd"></span></span>
   137	  </header>
   138	
   139	  <div id="saveWarn" class="banner" role="alert" hidden style="background:var(--sun-soft);border-radius:12px;padding:12px 16px;margin-bottom:12px">這台裝置還有練習進度沒存好（可能空間不足或瀏覽器限制），請先不要關閉這一頁；每 3 秒會自動再試。 <button class="btn ghost sm" type="button" id="saveRetry">現在再存一次</button></div>
   140	  <section id="home" style="display:grid;gap:18px">
   141	    <div class="panel"><p style="margin:0">每一篇都是她說「看不懂」的那一題：跟著步驟自己動手做，做完再練幾題同類型的，練到會為止。不用重看整張考卷。</p></div>
   142	    <div id="subjects" style="display:grid;gap:18px"></div>
   143	    <details id="upBox"><summary>家長傳題目（她說看不懂的那一題）</summary>
   144	      <div style="display:grid;gap:12px" id="upForm">
   145	        <p class="small muted" style="margin:0">拍下那一題、選科目、寫一句她卡在哪。照片只存在家裡自己的 Google 試算表，不會放上網頁；做好的解說會出現在上面對應的科目裡。</p>
   146	        <label>科目 <select id="upSubj" style="font-size:17px;min-height:46px;padding:6px 10px;border:2px solid var(--line);border-radius:12px;background:var(--card)"></select></label>
   147	        <label>照片 <input type="file" id="upFile" accept="image/*" style="font-size:16px"></label>
   148	        <label for="upNote">哪一題、她說哪裡不懂</label>
   149	        <textarea id="upNote" maxlength="500" style="font-size:16px;min-height:80px;border:2px solid var(--line);border-radius:12px;padding:10px;background:var(--bg);color:var(--ink)" placeholder="例：右上角第 6 題②，她不知道怎麼通分"></textarea>
   150	        <div class="row"><button class="btn" type="button" id="upSend">送出</button><span class="small" id="upMsg" aria-live="polite"></span></div>
   151	        <div style="display:grid;gap:8px;border-top:1px solid var(--line-soft);padding-top:12px"><b>你傳的題目</b><div class="small" id="upHealth"></div><div id="upList" class="hlist"></div></div>
   152	      </div>
   153	    </details>
   154	    <details id="syncBox"><summary>換電腦或 iPad 也能接著練（跨裝置同步）</summary><div id="g5sync"></div></details>
   155	  </section>
   156	
   157	  <div id="entry" hidden style="display:grid;gap:18px">
   158	    <a href="#" class="back" id="backHome">回難題列表</a>
   159	    <main class="panel" id="top">
   160	      <div class="src" id="src"></div>
   161	      <div class="prob" id="prob"></div>
   162	      <p style="margin:0" id="lead"></p>
   163	      <div class="row" id="topBtns"></div>
   164	      <div id="mastery" hidden></div>
   165	    </main>
   166	
   167	    <section class="lesson" id="lesson" hidden></section>
   168	
   169	    <section class="panel" id="practice" hidden></section>
   170	
   171	    <details id="vidBox" hidden><summary>看影片再聽一次</summary><div id="vids" style="display:grid;gap:12px"></div></details>
   172	
   173	    <details id="parentBox"><summary>給爸媽</summary>
   174	      <div id="parentText"></div>
   175	      <p class="small muted" id="rec" style="margin:0"></p>
   176	    </details>
   177	  </div>
   178	</div>
   179	
   180	<script src="qrcode.js"></script>
   181	<script src="sync.js"></script>
   182	<!--@INLINE src/frac.js-->
   183	<!--@INLINE src/hard.js-->
   184	<!--@INLINE src/upprogress.js-->
   185	<script>
   186	(function(){
   187	"use strict";
   188	var F = window.G5Frac;
   189	var H = window.G5Hard, E = null, A = null, B = null, SOL = null;   // E＝目前打開的那一篇
   190	var SIGNS = [{label:"&gt;", value:">"}, {label:"&lt;", value:"<"}, {label:"=", value:"="}];
   191	var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   192	
   193	function $(s, el){ return (el || document).querySelector(s); }
   194	function each(list, fn){ Array.prototype.forEach.call(list, fn); }
   195	function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
   196	function fr(f){ return '<span class="fr" role="img" aria-label="' + f.d + ' 分之 ' + f.n + '"><span>' + f.n + '</span><span>' + f.d + '</span></span>'; }
   197	function frx(f, m){ return '<span class="fr x" role="img" aria-label="' + f.d + '乘' + m + ' 分之 ' + f.n + '乘' + m + '"><span>' + f.n + '×' + m + '</span><span>' + f.d + '×' + m + '</span></span>'; }
   198	function isPrime(x){ if (x < 2) return false; for (var i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; }
   199	function sym(s){ return s === ">" ? "&gt;" : s === "<" ? "&lt;" : "="; }
   200	function add(el, html){ var d = document.createElement("div"); d.style.display = "contents"; d.innerHTML = html; var first = d.firstElementChild; while (d.firstChild) el.appendChild(d.firstChild); return first; }
   201	function fb(el, ok, msg){ el.hidden = false; el.className = "fb " + (ok ? "ok" : "no"); el.textContent = msg; }
   202	function reveal(el){ setTimeout(function(){ if (el.scrollIntoView) el.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "start"}); }, 40); }
   203	
   204	// 長條圖：d 小格塗 n 格；group＝每幾小格畫一條粗線（圈成一大塊）
   205	function bar(n, d, o){
   206	  o = o || {};
   207	  var W = 600, H = o.h || 46, w = (W - 4) / d, fill = o.c === "b" ? "var(--grass)" : "var(--sunball)", s = "";
   208	  var big = !o.group && d <= 12;   // 大塊（例如 2/3 的 3 塊）：格線用深色，才數得出幾塊
   209	  for (var i = 0; i < d; i++) s += '<rect x="' + (2 + i * w).toFixed(2) + '" y="2" width="' + w.toFixed(2) + '" height="' + (H - 4) + '" fill="' + (i < n ? fill : "var(--card)") + '" stroke="' + (big ? "var(--ink)" : "var(--line)") + '" stroke-width="' + (big ? 2.5 : 1) + '"/>';
   210	  if (o.group) for (var j = o.group; j < d; j += o.group) { var x = (2 + j * w).toFixed(2); s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="var(--ink)" stroke-width="3.5"/>'; }
   211	  s += '<rect x="2" y="2" width="' + (W - 4) + '" height="' + (H - 4) + '" fill="none" stroke="var(--ink)" stroke-width="2.5"/>';
   212	  return '<svg class="fbar" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.label || ("切成 " + d + " 格，塗了 " + n + " 格")) + '">' + s + '</svg>';
   213	}
   214	
   215	// ---------- 存檔：g5help.v1＝{v:1, entries:{篇id: 那一篇的教學與練習紀錄}}；不碰自然複習的 g5sci.v3 ----------
   216	var KEY = "g5help.v1";
   217	function fresh(){ return {lessonDone:false, idx:0, seed:Math.floor(Math.random() * 1e6), streak:0, clean:0, solved:0, mastered:false, log:[], cur:null, r:0}; }
   218	function nat(x){ return typeof x === "number" && Number.isSafeInteger(x) && x >= 0 && x <= 100000; }   // 題號、次數：超過 10 萬當壞資料（Codex 必修 6）
   219	function seedOk(x){ return typeof x === "number" && Number.isSafeInteger(x) && x >= 0 && x <= 2147483647; }   // 亂數種子另設範圍（Codex 第 2 輪必修 1）
   220	function clean1(s){
   221	  var d = fresh();
   222	  if (!s || typeof s !== "object") return d;
   223	  ["idx","streak","clean","solved"].forEach(function(k){ if (nat(s[k])) d[k] = s[k]; });
   224	  if (seedOk(s.seed)) d.seed = s.seed;
   225	  d.r = (typeof s.r === "number" && Number.isSafeInteger(s.r) && s.r >= 0) ? s.r : 0;   // 這一篇的版本號：每存一次 +1
   226	  d.lessonDone = s.lessonDone === true; d.mastered = s.mastered === true;
   227	  if (Array.isArray(s.log)) d.log = s.log.slice(-100);
   228	  // 正在做的那一題：看過提示、答錯過幾次（Codex 2026-10-12 第 1 輪必修 1、2：重開練習不能洗掉、不能重複計分）
   229	  if (s.cur && nat(s.cur.idx) && nat(s.cur.hints) && nat(s.cur.wrongs)) d.cur = {idx:s.cur.idx, hints:s.cur.hints, wrongs:s.cur.wrongs};
   230	  return d;
   231	}
   232	function own(o, k){ return Object.prototype.hasOwnProperty.call(o, k); }
   233	function parseDB(raw){
   234	  // 回傳 entries（Object.create(null)，id 叫 constructor、__proto__ 也不會撞到內建屬性）；讀不懂回 null
   235	  try {
   236	    var x = JSON.parse(raw);
   237	    if (!x || x.v !== 1 || !x.entries || typeof x.entries !== "object" || Array.isArray(x.entries)) return null;
   238	    var out = Object.create(null);
   239	    Object.keys(x.entries).forEach(function(id){ out[id] = clean1(x.entries[id]); });
   240	    return out;
   241	  } catch (e) { return null; }
   242	}
   243	// 存檔規則（2026-10-13 第 5 輪後 4agent 定案：本頁記憶體是唯一真相，不再做跨分頁版本比對）：
   244	// ①同一時間只有一個寫入分頁（Web Locks）；sync.js 也不能直接寫 g5help.v1（canReplace／accept 交給本頁）。
   245	// ②取鎖後要「讀成功」才開放作答（READY）；讀不到＝不是沒有紀錄，給「再讀一次」，不建立空白紀錄。
   246	// ③作答改記憶體並標 DIRTY；save() 把記憶體整份寫進主 key，寫成功才清 DIRTY；失敗保留、每 3 秒自動再試、
   247	//   首頁與各篇都看得到警告（#saveWarn）。④壞資料先用不撞名的 key 備份並讀回核對，成功才覆蓋主 key。
   248	// ⑤不聽 storage 事件換資料（只有本頁會寫）；雲端新版本只在「首頁、沒有未存進度」時由本頁套用並重畫，不 reload。
   249	var WRITER = false, READY = false, DIRTY = Object.create(null), BACKED = null, RETRY = null;
   250	// 讀磁碟：只讀、不寫。回 {ok:false}＝讀取失敗（主 key 或舊 key 讀時拋錯；不是「沒有紀錄」）；
   251	// broken＝主 key 有原文但讀不懂，備份與替換一律在 save() 裡、確認備份成功後才做。
   252	function readDisk(){
   253	  var raw, oldRaw;
   254	  try { raw = localStorage.getItem(KEY); } catch (e) { return {ok:false}; }
   255	  var es = raw === null ? null : parseDB(raw);
   256	  if (es) return {ok:true, entries:es, broken:null};
   257	  try { oldRaw = localStorage.getItem("g5math.v1"); } catch (e) { return {ok:false}; }   // 舊 key 讀不到也算讀取失敗（Codex 第 5 輪必修 1）
   258	  es = Object.create(null);
   259	  try {
   260	    // 2026-10-12 那一頁放在自然複習網站時存在 g5math.v1：搬進第 1 篇（舊資料原文不動）
   261	    var old = JSON.parse(oldRaw || "null");
   262	    if (old && old.v === 1) es["p38-6-2"] = clean1(old);
   263	  } catch (e) {}
   264	  return {ok:true, entries:es, broken:raw};   // raw 為 null＝第一次用；非 null＝壞資料待備份
   265	}
   266	function loadDB(){ var d = readDisk(); return {v:1, entries:d.ok ? d.entries : Object.create(null), readOk:d.ok}; }
   267	var DB = loadDB(), st = null, NOTICE = "", GEN = 0;
   268	function stateOf(id){ if (!own(DB.entries, id)) DB.entries[id] = fresh(); return DB.entries[id]; }
   269	function dirtyCount(){ return Object.keys(DIRTY).length; }
   270	// 舊畫面守門（Codex 第 6 輪：重播舊 handler 會改到別篇或把記憶體換回磁碟）：綁定時記下畫面世代 GEN（和這一題的 cur），
   271	// 執行時世代變了、或這一題已計分換題、或還沒讀成功，就什麼都不做。所有會改進度或切畫面的按鈕都走這裡。
   272	function guard(fn, c){ var g = GEN; return function(){ if (g !== GEN || !WRITER || !READY || (c && st.cur !== c)) return; return fn.apply(this, arguments); }; }
   273	function backupBroken(raw){
   274	  // 壞資料：用不會撞名的 key 備份並讀回核對；成功才允許之後用新資料覆蓋主 key（不先刪主 key）
   275	  if (BACKED === raw) return true;
   276	  var k = KEY + ".broken." + Date.now() + "." + Math.floor(Math.random() * 1e9);
   277	  try { localStorage.setItem(k, raw); if (localStorage.getItem(k) !== raw) return false; BACKED = raw; return true; } catch (e) { return false; }
   278	}
   279	function saveFailed(){
   280	  // 存不進去：進度留在記憶體（DIRTY），3 秒後自動再試；首頁與各篇都看得到警告（Codex 第 5 輪必修 3）
   281	  if (!RETRY) RETRY = setTimeout(function(){ RETRY = null; if (dirtyCount()) save(); }, 3000);
   282	  drawWarn(); drawRec(); return false;
   283	}
   284	function save(){
   285	  if (!WRITER || !READY) return false;   // 唯讀分頁、還沒讀成功：一律不寫
   286	  if (E && st) DIRTY[E.id] = true;   // 任何失敗出口之前先記下「這篇有沒存好的進度」
   287	  var d = readDisk();
   288	  if (!d.ok) return saveFailed();   // 讀取失敗≠沒有紀錄：不寫，進度留在記憶體
   289	  if (d.broken !== null && !backupBroken(d.broken)) return saveFailed();   // 備份不了就不覆蓋原文
   290	  var out = Object.create(null);
   291	  Object.keys(d.entries).forEach(function(id){ out[id] = d.entries[id]; });   // 磁碟上有、記憶體沒有的篇（例如搬家來的）照留
   292	  Object.keys(DB.entries).forEach(function(id){ out[id] = DB.entries[id]; });   // 記憶體是唯一真相
   293	  try { localStorage.setItem(KEY, JSON.stringify({v:1, entries:out})); } catch (e) { return saveFailed(); }
   294	  Object.keys(out).forEach(function(id){ if (!own(DB.entries, id)) DB.entries[id] = out[id]; });
   295	  DIRTY = Object.create(null);
   296	  if (RETRY) { clearTimeout(RETRY); RETRY = null; }
   297	  drawWarn(); drawRec();
   298	  return true;
   299	}
   300	function drawWarn(){
   301	  var w = $("#saveWarn"); if (!w) return;
   302	  w.hidden = !dirtyCount();
   303	}
   304	// 讀不到原有紀錄時的「再讀一次」：讀成功才開放作答，並接著原紀錄（不會被空白蓋掉）
   305	function retryRead(){
   306	  if (!WRITER || READY) return;   // 已經讀成功：舊的「再讀一次」重播不能把記憶體換回磁碟版（Codex 第 6 輪）
   307	  var d = readDisk();
   308	  if (!d.ok) { NOTICE = "還是讀不到，請稍後再試，或重新整理這一頁。"; route(); return; }
   309	  DB = {v:1, entries:d.entries, readOk:true}; READY = true; route();
   310	}
   311	// 雲端有較新的紀錄：只在首頁、沒有未存進度時換上；換上＝寫進主 key、重畫首頁，不 reload（Codex 第 5 輪必修 2）
   312	function canReplace(key){ return key === KEY && WRITER && READY && !E && !dirtyCount(); }
   313	function applyRemote(key, raw){
   314	  if (!canReplace(key)) return false;
   315	  var es = parseDB(raw); if (!es) return false;
   316	  try { localStorage.setItem(KEY, raw); } catch (e) { return false; }   // 沒寫進去＝磁碟沒變，記憶體也不換
   317	  GEN++; DB = {v:1, entries:es, readOk:true}; drawHome();   // 寫進去了就一定採用：記憶體與磁碟一致（Codex 第 6 輪必修 1）
   318	  var back; try { back = localStorage.getItem(KEY); } catch (e) { back = null; }
   319	  return back === raw;   // 讀回失敗只告訴 sync「下次再確認」，sync 下一輪看到本機＝雲端會只補 baseline
   320	}
   321	
   322	// ---------- 互動元件 ----------
   323	// iPad 中文鍵盤可能打出全形數字「１５」：先轉半形（Codex 第 1 輪必修 5）。回傳 {empty}、{bad}（不是整數）或 {v}
   324	function parseNum(raw){
   325	  var t = String(raw || "").replace(/[０-９]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }).replace(/\s+/g, "");
   326	  if (!t) return {empty:true};
   327	  if (!/^\d+$/.test(t)) return {bad:true};
   328	  return {v:parseInt(t, 10)};
   329	}
   330	// 選擇題：答錯會說明為什麼，可以再選；答對才往下
   331	function chipsAsk(body, q, opts, judge, onOk, cls){
   332	  var box = add(body, '<div class="ask"><div class="qq">' + q + '</div><div class="chips">' + opts.map(function(o, i){ return '<button type="button" class="chip' + (cls ? " " + cls : "") + '" data-i="' + i + '">' + o.label + '</button>'; }).join("") + '</div><div class="fb" hidden></div></div>');
   333	  var out = $(".fb", box), bs = box.querySelectorAll(".chip");
   334	  var g0 = GEN;
   335	  each(bs, function(b){ b.onclick = function(){
   336	    if (g0 !== GEN) return;
   337	    var o = opts[+b.dataset.i], r = judge(o.value);
   338	    if (r.ok) { each(bs, function(x){ x.disabled = true; }); b.classList.add("picked"); fb(out, true, r.msg || "對了！"); if (onOk) onOk(o.value, r); }
   339	    else { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake", "tried"); fb(out, false, r.msg); }
   340	  }; });
   341	  return box;
   342	}
   343	// 填數字：答錯先給提示，錯第 3 次直接告訴答案、請她填進去
   344	function numsAsk(body, q, items, onOk){
   345	  var box = add(body, '<div class="ask">' + (q ? '<div class="qq">' + q + '</div>' : '') + '<div class="eq">' + items.map(function(it, i){
   346	    return '<label class="nl">' + (it.pre || "") + '<input class="num" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done" autocomplete="off" data-i="' + i + '" aria-label="' + esc(it.aria || "答案") + '">' + (it.post || "") + '</label>';
   347	  }).join("") + '</div><div class="row"><button class="btn sm" type="button">檢查</button></div><div class="fb" hidden></div></div>');
   348	  var ins = box.querySelectorAll("input"), bt = $("button", box), out = $(".fb", box), tries = 0;
   349	  var gg = GEN;
   350	  function go(){
   351	    if (gg !== GEN) return;
   352	    for (var i = 0; i < items.length; i++) {
   353	      var it = items[i], pn = parseNum(ins[i].value), v = pn.empty || pn.bad ? NaN : pn.v;
   354	      var r = pn.empty ? {ok:false, msg:"先填一個數字。"} : pn.bad ? {ok:false, msg:"只能填整數，例如 15。"} : it.check ? it.check(v) : v === it.ans ? {ok:true} : {ok:false, msg:"再算一次。" + (it.hint ? "提示：" + it.hint : "")};
   355	      if (!r.ok) {
   356	        if (!isNaN(v)) tries++;
   357	        fb(out, false, r.msg + (tries >= 3 ? "　答案是 " + it.ans + "，把它填進去。" : ""));
   358	        ins[i].focus(); return;
   359	      }
   360	    }
   361	    each(ins, function(x){ x.disabled = true; }); bt.hidden = true; out.hidden = true;
   362	    onOk();
   363	  }
   364	  bt.onclick = go;
   365	  each(ins, function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
   366	  return box;
   367	}
   368	function stepCard(n, title){
   369	  var s = add($("#lesson"), '<section class="lstep" data-step="' + n + '"><div class="lhead"><span class="n">' + n + '</span><h2>' + title + '</h2></div><div class="lbody"></div><div class="row"><button class="btn ghost sm" type="button" data-confused>這步看不懂</button><span class="small muted" data-cmsg></span></div></section>');
   370	  $("button[data-confused]", s).onclick = function(){ confused(this, n, title); };
   371	  reveal(s);
   372	  return $(".lbody", s);
   373	}
   374	// 孩子按「這步看不懂」→ 送到家裡的 GAS 佇列（交辦 #1319：孩子本人的真實回饋才是白話程度的最終判準），電腦取回後據此改寫那一步
   375	var HELP_EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec";
   376	function confused(btn, n, title){
   377	  var msg = btn.nextElementSibling, code = null, id = E && E.id, subj = E && E.subject;
   378	  try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
   379	  if (!code) { msg.textContent = "這台還沒開同步，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; return; }
   380	  btn.disabled = true; msg.textContent = "送出中…";
   381	  fetch(HELP_EP, {method:"POST", headers:{"Content-Type":"text/plain"}, credentials:"omit", body:JSON.stringify({op:"confused", code:code, subject:subj, entry:id, step:n, title:String(title).replace(/<[^>]*>/g, "").slice(0, 200)})})
   382	    .then(function(r){ return r.json(); })
   383	    .then(function(r){ msg.textContent = r && r.ok ? "收到了！會換一個更好懂的說法。先試試看下一步。" : "沒送成功，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; if (!(r && r.ok)) btn.disabled = false; })
   384	    .catch(function(){ msg.textContent = "沒送成功（可能沒有網路），請跟爸爸媽媽說：第 " + n + " 步看不懂。"; btn.disabled = false; });
   385	}
   386	
   387	// ---------- 題目列 ----------
   388	function setBox(s){ var b = $("#box"); b.innerHTML = s ? sym(s) : ""; b.classList.toggle("got", !!s); b.setAttribute("aria-label", s ? "答案 " + s : "空格"); }
   389	function drawProb(){ $("#prob").innerHTML = fr(A) + '<span class="box" id="box" role="img" aria-label="空格"></span>' + fr(B); }
   390	
   391	// ---------- 教學（習作那一題） ----------
   392	function startLesson(){
   393	  if (E.kind === "steps") return stepsLesson();
   394	  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false; setBox("");
   395	  step1();
   396	}
   397	function step1(){
   398	  var b = stepCard(1, "先看分母"), m = F.multiplesUntil(A, B);
   399	  add(b, '<p>兩個分數的分母是 <b>' + A.d + '</b> 和 <b>' + B.d + '</b>，不一樣，要先通分才能比。</p>' +
   400	    '<p>如果直接通分，要找 ' + A.d + ' 和 ' + B.d + ' 的公倍數。把 ' + m.big + ' 的倍數一個一個寫出來：</p>' +
   401	    '<div class="mults">' + m.list.map(function(x, i){ return '<span' + (i === m.list.length - 1 ? ' class="hit"' : '') + '>' + x + '</span>'; }).join("") + '</div>' +
   402	    '<p>要寫到第 ' + m.list.length + ' 個 <b>' + m.lcm + '</b>，才剛好也是 ' + m.small + ' 的倍數。分數會變成「？/' + m.lcm + '」，數字太大，很容易算錯。</p>');
   403	  var pr = E.prior || {q:"數字很大的分數，怎麼讓它們變小？", ok:"對！先約分，數字變小，再通分。", hint:"想想看：分子分母一起除以同一個數，叫做什麼？"};
   404	  chipsAsk(b, pr.q, [
   405	    {label:"分子分母一起乘大一點", value:"mul"},
   406	    {label:"先約分：分子分母一起除以同一個數", value:"red"},
   407	    {label:"直接比分子，" + A.n + " 比 " + B.n + (A.n > B.n ? " 大" : A.n < B.n ? " 小" : " 一樣"), value:"num"}
   408	  ], function(v){
   409	    if (v === "red") return {ok:true, msg:pr.ok};
   410	    if (v === "mul") return {ok:false, msg:"一起乘，數字只會更大喔。" + pr.hint};
   411	    return {ok:false, msg:"分母不一樣的時候，分子大的不一定比較大（等一下練習題就有反例）。要先讓分母一樣。"};
   412	  }, step2);
   413	}
   414	function reduceLoop(b, f, color, done){
   415	  var chain = [f], cur = f;
   416	  function round(){
   417	    var opts = [2, 3, 5, 7, 9].map(function(k){ return {label:"一起除以 " + k, value:k}; });
   418	    var g = F.gcd(cur.n, cur.d);   // 2、3、5、7 以外的因數（例如 11、13）也要選得到
   419	    for (var p = 11; p <= g; p++) if (g % p === 0 && isPrime(p)) opts.push({label:"一起除以 " + p, value:p});
   420	    opts.push({label:"不能再約了", value:"none"});
   421	    chipsAsk(b, fr(cur) + ' 的分子和分母，可以一起除以哪個數？', opts, function(v){ return F.pickDivisor(cur, v); }, function(v, r){
   422	      if (r.done) return finish();
   423	      numsAsk(b, "算算看：", [
   424	        {pre:cur.n + " ÷ " + v + " =", ans:r.next.n, hint:v + " × 多少 = " + cur.n + "？", aria:cur.n + " 除以 " + v},
   425	        {pre:cur.d + " ÷ " + v + " =", ans:r.next.d, hint:v + " × 多少 = " + cur.d + "？", aria:cur.d + " 除以 " + v}
   426	      ], function(){
   427	        add(b, '<div class="eq">' + fr(cur) + ' = ' + fr(r.next) + '</div>');
   428	        cur = r.next; chain.push(cur); round();
   429	      });
   430	    });
   431	  }
   432	  function finish(){
   433	    var last = cur, g = f.n / last.n;
   434	    add(b, '<div class="eq">' + chain.map(fr).join(" = ") + '</div>');
   435	    if (chain.length > 2) add(b, '<p class="tip">也可以一次除以 ' + g + '（就是 ' + chain.slice(1).map(function(x, i){ return chain[i].n / x.n; }).join(" × ") + '），一步就變成 ' + F.txt(last) + '。</p>');
   436	    add(b, '<div class="pic"><div class="cap">' + F.txt(f) + '：切成 ' + f.d + ' 小格，塗 ' + f.n + ' 格。粗線把每 ' + g + ' 小格圈成 1 大塊。</div>' +
   437	      bar(f.n, f.d, {group:g, c:color, label:F.txt(f) + "，每 " + g + " 小格圈成一大塊"}) +
   438	      bar(last.n, last.d, {c:color, label:F.txt(last)}) +
   439	      '<div class="cap">' + F.txt(last) + '：一共 ' + last.d + ' 大塊，塗 ' + last.n + ' 塊。兩條塗色的長度一模一樣——約分不會改變分數的大小。</div></div>');
   440	    done(last);
   441	  }
   442	  round();
   443	}
   444	function step2(){
   445	  var b = stepCard(2, "約分左邊的 " + F.txt(A));
   446	  add(b, '<p>約分＝分子和分母<b>一起除以同一個數</b>，分數的大小不變。從乘法表裡的小數字開始試，選對一個就好，不用一次除到底。</p>');
   447	  reduceLoop(b, A, "a", step3);
   448	}
   449	function step3(){
   450	  var b = stepCard(3, "約分右邊的 " + F.txt(B));
   451	  add(b, '<p>右邊也一樣，分子和分母一起除以同一個數，除到不能再約為止。</p>');
   452	  reduceLoop(b, B, "b", step4);
   453	}
   454	function convert(b, f, L, done){
   455	  var m = L / f.d;

hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/app.html | sed -n '455,850p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   455	  var m = L / f.d;
   456	  numsAsk(b, fr(f) + ' 要變成分母 ' + L + '：分母 ' + f.d + ' 要乘多少？', [
   457	    {pre:f.d + " ×", post:"= " + L, ans:m, hint:f.d + " 的乘法表裡，哪一個是 " + L + "？", aria:f.d + " 乘多少等於 " + L}
   458	  ], function(){
   459	    numsAsk(b, '分母乘 ' + m + '，分子也要乘 ' + m + '：', [
   460	      {pre:f.n + " × " + m + " =", ans:f.n * m, hint:"", aria:f.n + " 乘 " + m}
   461	    ], function(){
   462	      var e = {n:f.n * m, d:L};
   463	      add(b, '<div class="eq">' + fr(f) + ' = ' + frx(f, m) + ' = ' + fr(e) + '</div>');
   464	      done(e);
   465	    });
   466	  });
   467	}
   468	function step4(){
   469	  var sa = SOL.sa, sb = SOL.sb, L = SOL.lcm;
   470	  var b = stepCard(4, "再通分 " + F.txt(sa) + " 和 " + F.txt(sb));
   471	  add(b, '<p>約分以後，題目變成 ' + fr(sa) + ' 和 ' + fr(sb) + '。分母 ' + sa.d + ' 和 ' + sb.d + ' 還是不一樣，現在才通分——數字小多了！</p>');
   472	  numsAsk(b, sa.d + ' 和 ' + sb.d + ' 的最小公倍數是多少？', [{pre:"", ans:L, aria:"最小公倍數", check:function(v){
   473	    if (v === L) return {ok:true};
   474	    if (v <= 0) return {ok:false, msg:"要找比 0 大的公倍數：從 " + sa.d + " 的倍數和 " + sb.d + " 的倍數裡，找第一個一樣的數。"};
   475	    if (v % sa.d === 0 && v % sb.d === 0) return {ok:false, msg:v + " 也是 " + sa.d + " 和 " + sb.d + " 的公倍數，但還有更小的，再找找看。"};
   476	    var ma = [], mb = []; for (var i = 1; i <= L / sa.d + 1; i++) ma.push(sa.d * i); for (var j = 1; j <= L / sb.d + 1; j++) mb.push(sb.d * j);
   477	    return {ok:false, msg:sa.d + " 的倍數：" + ma.join("、") + "…；" + sb.d + " 的倍數：" + mb.join("、") + "…。第一個兩邊都有的數，就是最小公倍數。"};
   478	  }}], function(){
   479	    convert(b, sa, L, function(ea){
   480	      convert(b, sb, L, function(eb){
   481	        add(b, '<div class="pic"><div class="cap">' + F.txt(sa) + ' 的每 1 大塊再切成 ' + (L / sa.d) + ' 小格，就是 ' + F.txt(ea) + '：</div>' +
   482	          bar(sa.n, sa.d, {label:F.txt(sa)}) + bar(ea.n, L, {group:L / sa.d, label:F.txt(ea)}) +
   483	          '<div class="cap">' + F.txt(sb) + ' 的每 1 大塊再切成 ' + (L / sb.d) + ' 小格，就是 ' + F.txt(eb) + '：</div>' +
   484	          bar(sb.n, sb.d, {c:"b", label:F.txt(sb)}) + bar(eb.n, L, {c:"b", group:L / sb.d, label:F.txt(eb)}) + '</div>');
   485	        step5(ea, eb);
   486	      });
   487	    });
   488	  });
   489	}
   490	function step5(ea, eb){
   491	  var b = stepCard(5, "比大小");
   492	  add(b, '<p>現在兩個分數的分母都是 ' + ea.d + '，就像兩條一樣長的巧克力都切成 ' + ea.d + ' 小塊，比誰拿的塊數多。</p>' +
   493	    '<div class="pic"><div class="cap">' + F.txt(ea) + '：塗 ' + ea.n + ' 格</div>' + bar(ea.n, ea.d, {label:F.txt(ea)}) +
   494	    '<div class="cap">' + F.txt(eb) + '：塗 ' + eb.n + ' 格</div>' + bar(eb.n, eb.d, {c:"b", label:F.txt(eb)}) + '</div>');
   495	  var s1 = F.cmp(ea, eb);
   496	  chipsAsk(b, fr(ea) + ' ○ ' + fr(eb) + '，○ 裡要填什麼？', SIGNS, function(v){
   497	    return v === s1 ? {ok:true, msg:"對！分母一樣，比分子：" + (s1 === ">" ? ea.n + " 比 " + eb.n + " 大，所以 " + F.txt(ea) + " 比較大。" : s1 === "<" ? ea.n + " 比 " + eb.n + " 小，所以 " + F.txt(eb) + " 比較大。" : "分子一樣，所以兩個一樣大。")} : {ok:false, msg:"看塗色的格子：" + ea.n + " 格和 " + eb.n + " 格，哪個多？"};
   498	  }, function(){
   499	    chipsAsk(b, '所以 ' + fr(A) + ' ○ ' + fr(B) + '？', SIGNS, function(v){
   500	      return v === SOL.sign ? {ok:true, msg:F.txt(A) + " 和 " + F.txt(ea) + " 一樣大、" + F.txt(B) + " 和 " + F.txt(eb) + " 一樣大，所以答案一樣是「" + SOL.sign + "」。"} :
   501	        {ok:false, msg:F.txt(A) + " = " + F.txt(ea) + "，" + F.txt(B) + " = " + F.txt(eb) + "。剛剛比出來哪個大？"};
   502	    }, function(){ setBox(SOL.sign); step6(ea, eb); }, "sign");
   503	  }, "sign");
   504	}
   505	function step6(ea, eb){
   506	  var b = stepCard(6, "寫進習作");
   507	  add(b, '<p>照這樣寫在習作上，跟你第①題的寫法一樣：</p>' +
   508	    '<div class="note"><div class="ln">' + fr(A) + ' = ' + fr(SOL.sa) + ' = ' + fr(ea) + '，</div>' +
   509	    '<div class="ln">' + fr(B) + ' = ' + fr(SOL.sb) + ' = ' + fr(eb) + '</div>' +
   510	    '<div class="ln">' + fr(ea) + ' ' + sym(SOL.sign) + ' ' + fr(eb) + '　∴ ' + fr(A) + ' ' + sym(SOL.sign) + ' ' + fr(B) + '</div></div>');
   511	  chipsAsk(b, '最後確認：遇到分母很大的分數比大小，順序是？', [
   512	    {label:"先通分，再約分", value:"x"}, {label:"先約分，再通分", value:"ok"}, {label:"直接比分子", value:"n"}
   513	  ], function(v){
   514	    if (v === "ok") return {ok:true, msg:"對！先約分讓數字變小（大小不變），再通分，最後比分子。"};
   515	    if (v === "x") return {ok:false, msg:"先通分的話，要用 " + SOL.rawLcm + " 那麼大的數。先把數字變小比較好算。"};
   516	    return {ok:false, msg:"分母不一樣時，不能直接比分子。"};
   517	  }, function(){
   518	    add(b, '<details class="alt"><summary>另一種做法：直接通分（答案一樣，但數字很大）</summary><div class="eq">' +
   519	      fr(A) + ' = ' + frx(A, SOL.rawLcm / A.d) + ' = ' + fr({n:A.n * SOL.rawLcm / A.d, d:SOL.rawLcm}) + '</div><div class="eq">' +
   520	      fr(B) + ' = ' + frx(B, SOL.rawLcm / B.d) + ' = ' + fr({n:B.n * SOL.rawLcm / B.d, d:SOL.rawLcm}) + '</div><p class="tip">' +
   521	      (A.n * SOL.rawLcm / A.d) + ' ' + sym(SOL.sign) + ' ' + (B.n * SOL.rawLcm / B.d) + '，答案也是「' + SOL.sign + '」。可是要算 ' + A.n + ' × ' + (SOL.rawLcm / A.d) + '、' + B.n + ' × ' + (SOL.rawLcm / B.d) + '，比先約分辛苦很多。</p></details>');
   522	    var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做一題</button></div>');
   523	    st.lessonDone = true; save(); drawTopBtns();
   524	    $("#toPractice", go).onclick = guard(function(){ openPractice(); });
   525	  });
   526	}
   527	
   528	// ---------- 練習 ----------
   529	function fin(key){ return '<span class="fin"><input class="num" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done" autocomplete="off" data-k="' + key + '.n" aria-label="' + (key[0] === "a" ? "左邊" : "右邊") + '分子"><i></i><input class="num" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done" autocomplete="off" data-k="' + key + '.d" aria-label="' + (key[0] === "a" ? "左邊" : "右邊") + '分母"></span>'; }
   530	function readFrac(box, key){
   531	  var pn = parseNum(($('input[data-k="' + key + '.n"]', box) || {}).value), pd = parseNum(($('input[data-k="' + key + '.d"]', box) || {}).value);
   532	  return {n:pn.empty || pn.bad ? NaN : pn.v, d:pd.empty || pd.bad ? NaN : pd.v, empty:!!(pn.empty || pd.empty), bad:!!(pn.bad || pd.bad)};
   533	}
   534	function lock(box){ each(box.querySelectorAll("input,button[data-check],button[data-hint]"), function(x){ x.disabled = true; }); }
   535	function need(){ return E.kind === "steps" ? Math.min(3, (E.practice || []).length) : 3; }   // 學會＝連續答對幾題（練習題少於 3 題就全對）
   536	function dots(){ var h = ""; for (var i = 0; i < need(); i++) h += '<i class="' + (i < Math.min(st.streak, need()) ? "on" : "") + '"></i>'; return '<span class="dots" aria-label="連續自己做對 ' + st.streak + ' 題">' + h + '</span>'; }
   537	function openPractice(){ var P = $("#practice"); P.hidden = false; renderPractice(); reveal(P); }
   538	// 填了字但不是整數、或還有格子沒填：講清楚，不算答錯
   539	function formCheck(fs){
   540	  if (fs.some(function(f){ return f.bad; })) return {ok:false, countable:false, msg:"只能填整數，例如 2、15。"};
   541	  if (fs.some(function(f){ return f.empty; })) return {ok:false, countable:false, msg:"還有格子沒填。"};
   542	  return null;
   543	}
   544	function renderPractice(){
   545	  if (E.kind === "steps") return choicePractice();
   546	  var P = $("#practice"), p = F.problem(st.idx, st.seed), a = p.a, b = p.b, s = F.solve(a, b);
   547	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   548	  var cur = st.cur, sa = null, sb = null, ea = null, eb = null;
   549	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   550	    '<div class="small muted">連續 3 題「沒看提示、每一格第一次就對」就算學會。看了提示也沒關係，弄懂最重要。</div>' +
   551	    '<div class="prob">' + fr(a) + '<span class="box" id="pbox" role="img" aria-label="空格"></span>' + fr(b) + '</div>' +
   552	    '<div class="prow" id="r1"><div class="qq">① 先約分，變成最簡分數</div><div class="eq"><span class="pair">' + fr(a) + ' = ' + fin("a") + '</span><span class="pair">' + fr(b) + ' = ' + fin("b") + '</span></div>' +
   553	    '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div></div>' +
   554	    '<div class="prow" id="r2" hidden></div><div class="prow" id="r3" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   555	  var r1 = $("#r1", P), r2 = $("#r2", P), r3 = $("#r3", P);
   556	  wireRow(r1, function(){
   557	    var ia = readFrac(r1, "a"), ib = readFrac(r1, "b"), form = formCheck([ia, ib]);
   558	    if (form) return form;
   559	    var x = F.checkReduce(a, ia), y = F.checkReduce(b, ib);
   560	    if (x.ok && y.ok) { sa = ia; sb = ib; return {ok:true, msg:"對了：" + F.txt(a) + " = " + F.txt(sa) + "，" + F.txt(b) + " = " + F.txt(sb) + "。", next:row2}; }
   561	    return {ok:false, countable:(!x.ok && x.code !== "empty") || (!y.ok && y.code !== "empty"), msg:(x.ok ? "" : "左邊：" + x.msg) + (!x.ok && !y.ok ? "\n" : "") + (y.ok ? "" : "右邊：" + y.msg)};
   562	  }, [
   563	    function(){ return "從 2、3、5、7、9 開始試：分子和分母都在同一個乘法表裡，就能一起除。" + [a, b].map(function(f){ var q = F.smallestCommon(f); return F.txt(f) + "：" + F.divText(q, f.n) + "、" + F.divText(q, f.d) + "，可以先一起除以 " + q + "。"; }).join(" "); },
   564	    function(){ return [a, b].map(function(f){ var t = F.simplest(f); return F.txt(f) + "：" + f.n + " = " + t.g + " × " + t.n + "、" + f.d + " = " + t.g + " × " + t.d + "，一起除以 " + t.g + "，變成 " + t.n + "/" + t.d + "。"; }).join(" "); }
   565	  ]);
   566	  function row2(){
   567	    r2.hidden = false;
   568	    r2.innerHTML = '<div class="qq">② 再通分，讓分母一樣</div><div class="eq"><span class="pair">' + fr(sa) + ' = ' + fin("c") + '</span><span class="pair">' + fr(sb) + ' = ' + fin("e") + '</span></div>' +
   569	      '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div>';
   570	    wireRow(r2, function(){
   571	      var ia = readFrac(r2, "c"), ib = readFrac(r2, "e"), form = formCheck([ia, ib]);
   572	      if (form) return form;
   573	      var x = F.checkCommon(sa, sb, ia, ib);
   574	      if (x.ok) { ea = ia; eb = ib; return {ok:true, msg:x.msg, next:row3}; }
   575	      return {ok:false, countable:x.code !== "empty", msg:x.msg};
   576	    }, [
   577	      function(){ var ma = [], mb = []; for (var i = 1; i <= s.lcm / sa.d; i++) ma.push(sa.d * i); for (var j = 1; j <= s.lcm / sb.d; j++) mb.push(sb.d * j);
   578	        return "先找 " + sa.d + " 和 " + sb.d + " 的最小公倍數。" + sa.d + " 的倍數：" + ma.join("、") + "…；" + sb.d + " 的倍數：" + mb.join("、") + "…，第一個兩邊都有的就是。"; },
   579	      function(){ return "最小公倍數是 " + s.lcm + "。" + F.txt(sa) + " 的分子分母都乘 " + (s.lcm / sa.d) + " → " + F.txt(s.ea) + "；" + F.txt(sb) + " 的分子分母都乘 " + (s.lcm / sb.d) + " → " + F.txt(s.eb) + "。"; }
   580	    ]);
   581	    reveal(r2);
   582	  }
   583	  function row3(){
   584	    r3.hidden = false;
   585	    r3.innerHTML = '<div class="qq">③ 比大小：' + fr(ea) + ' 和 ' + fr(eb) + '</div><div class="qq">所以 ' + fr(a) + ' ○ ' + fr(b) + '？</div><div class="chips">' +
   586	      SIGNS.map(function(o){ return '<button type="button" class="chip sign" data-s="' + esc(o.value) + '">' + o.label + '</button>'; }).join("") + '</div><div class="fb" hidden></div>';
   587	    var out = $(".fb", r3), bs = r3.querySelectorAll(".chip");
   588	    var g0 = GEN;
   589	    var g1 = GEN;
   590	  each(bs, function(bt){ bt.onclick = function(){
   591	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分（st.cur 換掉）或已切走：舊 handler 失效，不重複計分
   592	      if (g0 !== GEN) return;
   593	      var r = F.checkSign(a, b, ea, eb, bt.dataset.s);
   594	      if (r.ok) { each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, r.msg); $("#pbox", P).innerHTML = sym(s.sign); $("#pbox", P).classList.add("got"); finish(); }
   595	      else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, r.msg); }
   596	    }; });
   597	    reveal(r3);
   598	  }
   599	  function finish(){
   600	    var clean = cur.hints === 0 && cur.wrongs === 0, was = st.mastered;
   601	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   602	    st.idx++; st.cur = null;   // 做完就換下一題：重開練習不會再算一次同一題（Codex 第 1 輪必修 1）
   603	    if (st.streak >= 3) st.mastered = true;
   604	    st.log.push({t:Date.now(), a:F.txt(a), b:F.txt(b), clean:clean, hints:cur.hints, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   605	    var saved = save();
   606	    var PE = $("#pend", P); PE.hidden = false;
   607	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 3 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   608	      '<div class="fb ok">' + (clean ? "完全自己做對！連續 " + st.streak + " 題。" : "做完了！" + (cur.hints ? "這題看了提示，" : "這題有改過答案，") + "下一題試試不看提示。") + '</div>') +
   609	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   610	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   611	    $("#nextQ", PE).onclick = guard(function(){ renderPractice(); reveal(P); });
   612	    $("#toLesson", PE).onclick = guard(function(){ startLesson(); });
   613	    drawTopBtns(); drawRec(); reveal(PE);
   614	  }
   615	  function wireRow(row, check, hints){
   616	    var out = $(".fb", row), hb = $(".hint", row), lvl = 0;
   617	    var gg = GEN;
   618	  function go(){
   619	    if (gg !== GEN) return;
   620	      var r = check();
   621	      if (r.ok) { lock(row); fb(out, true, r.msg); r.next(); }
   622	      else { if (r.countable) { cur.wrongs++; save(); } fb(out, false, r.msg); }
   623	    }
   624	    go = guard(go, cur);
   625	    $("button[data-check]", row).onclick = go;
   626	    $("button[data-hint]", row).onclick = guard(function(){
   627	      cur.hints++; save(); hb.hidden = false; hb.textContent = hints[Math.min(lvl, hints.length - 1)](); lvl++;
   628	      if (lvl >= hints.length) this.disabled = true;
   629	    }, cur);
   630	    each(row.querySelectorAll("input"), function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
   631	  }
   632	}
   633	
   634	// ---------- 首頁按鈕、紀錄、影片 ----------
   635	function drawTopBtns(){
   636	  var T = $("#topBtns");
   637	  if (!WRITER) { T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">' + esc(READONLY_MSG) + '</div>'; $("#mastery").hidden = true; return; }
   638	  if (!READY) {   // 讀不到原有紀錄：不給作答（Codex 第 5 輪必修 1），給「再讀一次」
   639	    T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">這台裝置的練習紀錄暫時讀不到，為了不把以前的紀錄蓋掉，先不開始練習。</div><button class="btn" type="button" id="readRetry">再讀一次</button>';
   640	    $("#readRetry").onclick = retryRead; $("#mastery").hidden = true; return;
   641	  }
   642	  T.innerHTML = st.lessonDone ?
   643	    '<button class="btn" type="button" id="goPractice">' + (st.solved ? "繼續練習（第 " + (st.idx + 1) + " 題）" : "換你自己做練習題") + '</button><button class="btn ghost" type="button" id="goLesson">再看一次教學</button>' :
   644	    '<button class="btn" type="button" id="goLesson">開始學</button><button class="btn ghost" type="button" id="goPractice">我已經會了，直接練習</button>';
   645	  $("#goLesson").onclick = guard(startLesson);
   646	  $("#goPractice").onclick = guard(openPractice);
   647	  if (E.kind === "steps" && !(E.practice || []).length) $("#goPractice").remove();
   648	  var M = $("#mastery");
   649	  M.hidden = !st.mastered;
   650	  if (st.mastered) M.innerHTML = '<div class="win"><b class="t">這種題你已經會了</b><span>連續 ' + need() + ' 題自己做對。想多練可以繼續做。</span></div>';
   651	}
   652	function drawRec(){
   653	  if (!E || !st) return;
   654	  $("#rec").textContent = st.solved ? "這台裝置上的練習紀錄：做完 " + st.solved + " 題，其中 " + st.clean + " 題沒看提示、一次就對；目前連續 " + st.streak + " 題。" + (st.mastered ? "已達「連續 " + need() + " 題自己做對」。" : "") : "這台裝置上還沒有練習紀錄。";
   655	}
   656	function drawVids(){
   657	  var VIDS = E.videos || [];
   658	  $("#vidBox").hidden = !VIDS.length; $("#vids").innerHTML = "";
   659	  if (!VIDS.length) return;
   660	  $("#vidBox").hidden = false;
   661	  $("#vids").innerHTML = VIDS.map(function(v, i){ return '<div style="display:grid;gap:6px"><b>' + esc(v.title) + '</b><span class="small muted">' + esc(v.note) + '</span><div class="row"><button class="btn ghost sm" type="button" data-v="' + i + '">播放（' + esc(v.len) + '）</button></div><div class="vslot"></div></div>'; }).join("");
   662	  each($("#vids").querySelectorAll("button[data-v]"), function(b){ b.onclick = function(){
   663	    var v = VIDS[+b.dataset.v], slot = b.parentNode.nextElementSibling;
   664	    slot.innerHTML = '<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?rel=0&playsinline=1&autoplay=1&start=' + v.start + (v.end ? '&end=' + v.end : '') + '" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
   665	    b.disabled = true;
   666	  }; });
   667	}
   668	
   669	// ---------- 通用格式 steps（任何科目）：分步解說＋確認題＋答案＋同型練習 ----------
   670	function stepsLesson(){
   671	  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false;
   672	  var i = 0;
   673	  function next(){
   674	    if (i >= E.steps.length) return stepsEnd();
   675	    var s = E.steps[i], b = stepCard(++i, s.title);
   676	    add(b, '<p>' + s.say + '</p>' + (s.fig ? '<div class="pic">' + s.fig + '</div>' : ''));
   677	    if (s.check) chipsAsk(b, s.check.q, s.check.opts.map(function(o, k){ return {label:esc(o), value:k}; }), function(v){
   678	      return v === s.check.a ? {ok:true, msg:s.check.ok || "對了！"} : {ok:false, msg:(s.check.why && s.check.why[v]) || "再想想看。"};
   679	    }, next);
   680	    else { var r = add(b, '<div class="row"><button class="btn sm" type="button" data-next>我懂了，下一步</button></div>'), g = GEN; $("button", r).onclick = function(){ if (g !== GEN) return; this.disabled = true; next(); }; }
   681	  }
   682	  next();
   683	}
   684	function stepsEnd(){
   685	  var b = stepCard(E.steps.length + 1, "答案");
   686	  add(b, '<div class="note" style="font-size:20px">' + E.answer + '</div>' + (E.write ? '<p>寫在考卷上的樣子：</p><div class="note" style="font-size:20px">' + E.write + '</div>' : ''));
   687	  st.lessonDone = true; save(); drawTopBtns();
   688	  if ((E.practice || []).length) { var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做</button></div>'); $("#toPractice", go).onclick = guard(openPractice); }
   689	}
   690	function choicePractice(){
   691	  var P = $("#practice"), list = E.practice, q = list[st.idx % list.length];
   692	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   693	  var cur = st.cur;
   694	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   695	    '<div class="small muted">連續 ' + need() + ' 題第一次就選對，就算學會。</div><div class="qtext">' + q.q + '</div><div class="chips">' +
   696	    q.opts.map(function(o, k){ return '<button type="button" class="chip" data-k="' + k + '">' + esc(o) + '</button>'; }).join("") + '</div><div class="fb" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   697	  var out = $(".fb", P), bs = P.querySelectorAll(".chip");
   698	  var g1 = GEN;
   699	  each(bs, function(bt){ bt.onclick = function(){
   700	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分或已切走：舊 handler 失效，不重複計分
   701	    var k = +bt.dataset.k;
   702	    if (k !== q.a) { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, (q.why && q.why[k]) || "再想想看。"); return; }
   703	    each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, q.ok || "對了！");
   704	    var clean = cur.wrongs === 0, was = st.mastered;
   705	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   706	    st.idx++; st.cur = null;
   707	    if (st.streak >= need()) st.mastered = true;
   708	    st.log.push({t:Date.now(), q:st.idx - 1, clean:clean, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   709	    var saved = save(), PE = $("#pend", P); PE.hidden = false;
   710	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 ' + need() + ' 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   711	      '<div class="fb ok">' + (clean ? "第一次就選對！連續 " + st.streak + " 題。" : "做完了！這題有改過答案，下一題試試一次選對。") + '</div>') +
   712	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   713	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   714	    $("#nextQ", PE).onclick = guard(function(){ choicePractice(); reveal(P); });
   715	    $("#toLesson", PE).onclick = guard(function(){ startLesson(); });
   716	    drawTopBtns(); drawRec(); reveal(PE);
   717	  }; });
   718	}
   719	
   720	// ---------- 首頁（依科目列出每一篇）與切換 ----------
   721	function statusOf(id){ var s = DB.entries[id]; return !s ? "還沒看" : s.mastered ? "學會了" : s.solved ? "練習中" : s.lessonDone ? "教學看完了" : "還沒看"; }
   722	function drawHome(){
   723	  $("#subjects").innerHTML = H.SUBJECTS.map(function(sj){
   724	    var es = H.LIST.filter(function(e){ return e.subject === sj; }).slice().reverse();
   725	    return '<section class="subj" data-subj="' + sj + '"><div class="sect-t">' + sj + '</div>' + (es.length ? '<div class="hlist">' + es.map(function(e){
   726	      var t = statusOf(e.id);
   727	      return '<a class="hcard" href="#h/' + e.id + '"><b>' + esc(e.title) + '</b><span class="meta">' + esc(e.source) + (e.tag ? "・" + esc(e.tag) : "") + '・' + e.date.slice(5).replace("-", "/") + '</span><span class="st' + (t === "學會了" ? " done" : "") + '">' + t + '</span></a>';
   728	    }).join("") + '</div>' : '<span class="empty">還沒有題目。</span>') + '</section>';
   729	  }).join("");
   730	}
   731	function countdown(){
   732	  var d = new Date(Date.now() + 8 * 3600000), today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), left = Math.round((Date.UTC(2026, 10, 5) - today) / 86400000);
   733	  $("#cd").textContent = left >= 0 ? "・期中考 11/5 還有 " + left + " 天" : "";
   734	}
   735	function openEntry(e){
   736	  GEN++; E = e; st = stateOf(e.id);
   737	  $("#home").hidden = true; $("#entry").hidden = false;
   738	  $("#lesson").innerHTML = ""; $("#lesson").hidden = true; $("#practice").innerHTML = ""; $("#practice").hidden = true;
   739	  $("#src").textContent = e.source + "（" + e.subject + "）" + (e.ask ? "：" + e.ask : "");
   740	  if (e.kind === "frac-compare") { A = e.a; B = e.b; SOL = F.solve(A, B); drawProb(); }
   741	  else $("#prob").innerHTML = '<div class="qtext">' + e.question + '</div>';
   742	  $("#lead").textContent = e.lead || "跟著下面一步一步做，每一步都要你自己想一想、選一選。";
   743	  $("#parentText").innerHTML = e.parent || "";
   744	  document.title = e.title + "｜五年級難題解說";
   745	  drawTopBtns(); drawRec(); drawVids(); window.scrollTo(0, 0);
   746	  if (NOTICE) { $("#lead").textContent = NOTICE; NOTICE = ""; }
   747	}
   748	function route(){
   749	  var m = /^#h\/([\w-]+)$/.exec(location.hash), e = m && H.get(m[1]);
   750	  if (e) return openEntry(e);
   751	  GEN++; E = null; st = null; document.title = "五年級難題解說";
   752	  $("#vids").innerHTML = ""; $("#vidBox").hidden = true;   // 回首頁就關掉影片（Codex 建議 7）
   753	  $("#entry").hidden = true; $("#home").hidden = false; drawHome();
   754	}
   755	$("#saveRetry").onclick = function(){ save(); };
   756	$("#backHome").onclick = function(ev){ ev.preventDefault(); location.hash = ""; route(); };
   757	window.addEventListener("hashchange", route);
   758	// 同一時間只讓一個分頁練習與寫入（Web Locks；Codex 2026-10-13 設計者方案 B）。
   759	// 拿不到鎖＝另一個分頁在練：這頁唯讀；等那頁關掉、鎖釋放後自動重新載入接手（重讀最新紀錄）。
   760	var READONLY_MSG = "這個網站已經在另一個分頁（或視窗）開著了，請回到那個分頁練習；那邊關掉後，這一頁會自動接手。";
   761	function start(){ countdown(); route(); window.dispatchEvent(new Event("g5help-ready")); }
   762	if (navigator.locks && navigator.locks.request) {
   763	  var lockFail = function(){ WRITER = false; READONLY_MSG = "這一頁拿不到存檔的權限（瀏覽器拒絕），只能看不能練；請重新整理或換瀏覽器。"; start(); };
   764	  navigator.locks.request("g5help-writer", {ifAvailable: true}, function(lock){
   765	    if (!lock) {
   766	      WRITER = false; start();
   767	      navigator.locks.request("g5help-writer", function(){ location.reload(); return new Promise(function(){}); }).catch(function(){});
   768	      return;
   769	    }
   770	    WRITER = true; DB = loadDB(); READY = DB.readOk; start();
   771	    return new Promise(function(){});   // 整個頁面存活期間都持有
   772	  }).catch(lockFail);
   773	} else {
   774	  READONLY_MSG = "這個瀏覽器太舊，不能安全存練習紀錄；請更新 iPad／瀏覽器後再練習。";
   775	  WRITER = false; start();
   776	}
   777	window.G5HelpWriter = function(){ return WRITER; };
   778	window.G5HelpDirty = function(){ return dirtyCount(); };
   779	window.G5HelpCanReplace = canReplace;
   780	window.G5HelpApplyRemote = applyRemote;
   781	window.G5HelpPage = {state:function(id){ return JSON.parse(JSON.stringify(DB.entries[id] || null)); }};
   782	})();
   783	</script>
   784	<script>
   785	// 跨裝置同步（家庭同步碼）：只同步本站自己的 g5help.v1；同步碼存在同網域 localStorage，自然站連過也算
   786	(function(){
   787	  if (!window.G5Sync) return;   // sync.js 載不到就照常本機使用
   788	  function boot(){ if (!(window.G5HelpWriter && window.G5HelpWriter())) { var c = document.getElementById("g5sync"); if (c) c.textContent = "（在另一個分頁開著，同步由那一頁負責）"; return; }
   789	  window.G5Sync.init({
   790	    endpoint: "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec",
   791	    keys: ["g5help.v1"], container: "#g5sync",
   792	    summarize: {"g5help.v1": function(j){ try { var x = JSON.parse(j), n = 0, m = 0; Object.keys(x.entries || {}).forEach(function(k){ n += x.entries[k].solved || 0; if (x.entries[k].mastered) m++; }); return "練習做完 " + n + " 題、學會 " + m + " 篇"; } catch (e) { return "（讀不懂的紀錄）"; } }},
   793	    // 雲端版本只能經由本頁套用（首頁、沒有未存進度時），不 reload（#1303 第 5 輪必修 2）
   794	    canReplace: function(key){ return window.G5HelpCanReplace(key); },
   795	    accept: function(key, data){ return window.G5HelpApplyRemote(key, data); }
   796	  }); }
   797	  window.addEventListener("g5help-ready", boot, {once: true});
   798	})();
   799	</script>
   800	<script>
   801	// 家長傳題目：照片在這台裝置先縮小（長邊 1600px、JPEG），送到家裡自己的 GAS（gas/inbox.js）；只有已開啟跨裝置同步的裝置能送
   802	(function(){
   803	  var EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec", $ = function(s){ return document.querySelector(s); };
   804	  $("#upSubj").innerHTML = ["國語","數學","自然","社會","英文","其他"].map(function(x){ return '<option>' + x + '</option>'; }).join("");
   805	  function msg(t, bad){ $("#upMsg").textContent = t; $("#upMsg").style.color = bad ? "var(--bad)" : "var(--leaf)"; }
   806	  function shrink(file){
   807	    return new Promise(function(ok, no){
   808	      var img = new Image(), url = URL.createObjectURL(file);
   809	      img.onload = function(){
   810	        var k = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement("canvas");
   811	        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
   812	        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
   813	        var q = 0.8, d = c.toDataURL("image/jpeg", q);
   814	        while (d.length > 850000 && q > 0.3) { q -= 0.1; d = c.toDataURL("image/jpeg", q); }
   815	        d.length > 850000 ? no(new Error("big")) : ok(d);
   816	      };
   817	      img.onerror = function(){ no(new Error("img")); }; img.src = url;
   818	    });
   819	  }
   820	  // 進度：已送出（等電腦取回，最多 10 分鐘）→ 已收到、解說製作中 → 做好了（連結）；電腦上次取題時間＝有無故障
   821	  function hhmm(t){ var d = new Date(t + 8 * 3600000); return (d.getUTCMonth() + 1) + "/" + d.getUTCDate() + " " + ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2); }
   822	  function loadMine(){
   823	    var code = null; try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
   824	    if (!code) { $("#upHealth").textContent = "這台裝置還沒開啟跨裝置同步，所以看不到進度。"; return; }
   825	    fetch(EP, {method:"POST", headers:{"Content-Type":"text/plain"}, credentials:"omit", body:JSON.stringify({op:"mine", code:code})}).then(function(r){ return r.json(); }).then(function(r){
   826	      if (!r || !r.ok) { $("#upHealth").textContent = "進度暫時讀不到，稍後再看。"; return; }
   827	      var ago = r.lastFetch ? Math.round((Date.now() - r.lastFetch) / 60000) : null;
   828	      $("#upHealth").innerHTML = ago === null ? "電腦還沒取過題目。" : ago <= 20 ? "電腦運作正常（上次取題 " + hhmm(r.lastFetch) + "，每 10 分鐘取一次）。"
   829	        : '<span style="color:var(--bad)">電腦已經 ' + ago + ' 分鐘沒取題（上次 ' + hhmm(r.lastFetch) + '）：可能關機、睡眠或故障，題目會等電腦開機後再處理。</span>';
   830	      $("#upList").innerHTML = (r.items || []).length ? r.items.map(function(it){
   831	        // 進度隨時間增加＋預估幾點做好（交辦 #1320；src/upprogress.js）；清單打開時每 60 秒重抓一次
   832	        var pv = window.G5UpProgress.view(it, r.items, r.lastFetch, Date.now()), pct = pv.pct;
   833	        var st = it.status === "done" ? '<a href="' + it.url + '">做好了，點這裡看解說</a>' : pv.text;
   834	        var barH = '<div role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" style="height:10px;border-radius:99px;background:var(--line-soft);overflow:hidden;margin:4px 0"><i style="display:block;height:100%;width:' + pct + '%;background:' + (pct === 100 ? "var(--leaf)" : "var(--pri)") + '"></i></div><span class="meta">進度 ' + pct + '%</span>';
   835	        return '<div class="hcard"><b>' + it.subject + '・' + String(it.note || "").replace(/[<>&]/g, "") + '</b><span class="meta">' + hhmm(it.time) + ' 送出</span>' + barH + '<span class="st' + (it.status === "done" ? " done" : "") + '">' + st + '</span></div>';
   836	      }).join("") : '<span class="empty">還沒有傳過題目。</span>';
   837	    }).catch(function(){ $("#upHealth").textContent = "進度暫時讀不到（可能沒有網路），稍後再看。"; });
   838	  }
   839	  $("#upBox").addEventListener("toggle", function(){ if ($("#upBox").open) loadMine(); });
   840	  setInterval(function(){ if ($("#upBox").open) loadMine(); }, 60000);
   841	  $("#upSend").onclick = function(){
   842	    var code = null; try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
   843	    if (!code) return msg("請先在下面「跨裝置同步」開啟或加入同步，這台裝置才能送題目。", true);
   844	    var f = $("#upFile").files[0]; if (!f) return msg("請先選一張照片。", true);
   845	    var btn = this; btn.disabled = true; msg("照片處理中…");
   846	    shrink(f).then(function(img){
   847	      msg("送出中…");
   848	      return fetch(EP, {method:"POST", headers:{"Content-Type":"text/plain"}, credentials:"omit", body:JSON.stringify({op:"upload", code:code, subject:$("#upSubj").value, note:$("#upNote").value.slice(0,500), image:img})}).then(function(r){ return r.json(); });
   849	    }).then(function(r){
   850	      if (r && r.ok) { msg("送出了！下方「你傳的題目」可以看進度；做好的解說會出現在上面「" + $("#upSubj").value + "」那一科。"); $("#upFile").value = ""; $("#upNote").value = ""; loadMine(); }

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "cat tests/harness.js; rg -n 'flow_codex_r6|def |launch|write|mkdir|250' tests/e2e.py; git diff HEAD"'^ HEAD -- src/app.html src/sync.js tests/sync.test.js' in /Users/william/Documents/g5-help
 succeeded in 0ms:
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const core = require('../gas/core');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const flush = () => new Promise(resolve => setImmediate(resolve));

class Storage {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); this.fail = null; }
  get length() { return this.data.size; }
  key(i) { return [...this.data.keys()][i] || null; }
  getItem(key) { return this.data.has(String(key)) ? this.data.get(String(key)) : null; }
  setItem(key, value) {
    if (this.fail && this.fail(key, value)) {
      const error = new Error('private storage error'); error.name = 'QuotaExceededError'; throw error;
    }
    this.data.set(String(key), String(value));
  }
  removeItem(key) { this.data.delete(String(key)); }
  dump() { return Object.fromEntries(this.data); }
}
class Events {
  constructor() { this.listeners = {}; }
  addEventListener(type, listener) { (this.listeners[type] ||= new Set()).add(listener); }
  removeEventListener(type, listener) { this.listeners[type]?.delete(listener); }
  dispatch(type, event = {}) { for (const fn of this.listeners[type] || []) { fn(event); } }
}
class Element extends Events {
  constructor(tag, ownerDocument) {
    super(); this.tagName = tag.toUpperCase(); this.ownerDocument = ownerDocument;
    this.children = []; this.style = {}; this.attributes = {}; this._text = ''; this._html = '';
    this.value = ''; this.hidden = false; this.disabled = false;
  }
  get firstChild() { return this.children[0] || null; }
  appendChild(node) { this.children.push(node); return node; }
  removeChild(node) { this.children.splice(this.children.indexOf(node), 1); return node; }
  set textContent(text) { this._text = String(text); this.children = []; this._html = ''; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set innerHTML(html) { this._html = String(html); this.children = []; this._text = ''; }
  get innerHTML() { return this._html; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.ownerDocument.activeElement = this; }
  select() { this.selected = true; }
  click() { if (!this.disabled) this.dispatch('click', {preventDefault() {}}); }
}
class Document extends Events {
  constructor() { super(); this.visibilityState = 'visible'; this.container = new Element('div', this); }
  createElement(tag) { return new Element(tag, this); }
  querySelector(selector) { return selector === '#sync' ? this.container : null; }
}
function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function byClass(device, name) { return descendants(device.doc.container).filter(node => node.className === 'g5s-' + name); }
function click(device, text) {
  const b = descendants(device.doc.container).find(node => node.tagName === 'BUTTON' && node.textContent === text);
  assert.ok(b, `Missing button: ${text}`); b.click(); return b;
}
class Clock {
  constructor(start = Date.UTC(2026, 9, 13, 0, 0, 0)) { this.time = start; this.next = 1; this.tasks = new Map(); }
  now = () => this.time;
  setTimeout = (fn, delay) => { const id = this.next++; this.tasks.set(id, {fn, at: this.time + delay, repeat: 0}); return id; };
  clearTimeout = id => this.tasks.delete(id);
  setInterval = (fn, delay) => { const id = this.setTimeout(fn, delay); this.tasks.get(id).repeat = delay; return id; };
  clearInterval = this.clearTimeout;
  async advance(ms) {
    const target = this.time + ms;
    for (let n = 0; n < 10000; n++) {
      const [id, job] = [...this.tasks].filter(([, item]) => item.at <= target).sort((a, b) => a[1].at - b[1].at)[0] || [];
      if (!job) { this.time = target; await flush(); return; }
      this.time = job.at;
      if (job.repeat) job.at += job.repeat; else this.tasks.delete(id);
      job.fn(); await flush();
    }
    throw new Error('Fake clock runaway');
  }
}
function makeStore() {
  const rows = new Map(); let locked = false;
  const store = {
    rows, events: [], hash,
    withLock(fn) {
      assert.equal(locked, false); locked = true; this.events.push('lock');
      try { return fn(); } finally { locked = false; this.events.push('unlock'); }
    },
    get(h, key) {
      assert.ok(locked); this.events.push('get');
      const row = rows.get(h + '|' + key); return row ? core.fromRow(row) : null;
    },
    set(h, key, record) {
      assert.ok(locked); this.events.push('set'); rows.set(h + '|' + key, core.toRow(h, key, record));
    },
    record(code, key = 'g5sci.v3') { const row = rows.get(hash(code) + '|' + key); return row ? core.fromRow(row) : null; }
  };
  return store;
}
function server(clock, store = makeStore()) {
  return {clock, store, handle(req) { return core.handle(store, req, clock.now); }};
}
function device(server, options = {}) {
  const clock = options.clock || server.clock, doc = new Document(), events = new Events();
  const storage = options.storage || new Storage(options.initial);
  let href = options.href || 'https://windsorya.github.io/g5-sci-review/';
  const location = {get href() { return href; }, get hash() { return new URL(href).hash; }};
  const history = {state: {keep: 1}, calls: [], replaceState(state, title, url) { this.calls.push({state, url}); href = url; }};
  const d = {clock, doc, storage, history, calls: [], replacements: [], qrLinks: [], active: 0, maxActive: 0, mode: 'ok', held: null};
  const window = Object.assign(events, {
    document: doc, location, history, navigator: {onLine: true}, localStorage: storage,
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout, setInterval: clock.setInterval, clearInterval: clock.clearInterval,
    crypto: {getRandomValues(array) { crypto.randomFillSync(array); return array; }}, AbortController
  });
  const sandbox = {window, module: {exports: {}}, Uint8Array, Promise, Date, console};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/qrcode.js'), 'utf8'), sandbox, {filename: 'qrcode.js'});
  const qrFactory = sandbox.qrcode; // Browser-global build; no CommonJS `exports` in this VM.
  window.qrcode = (type, level) => {
    const qr = qrFactory(type, level), add = qr.addData;
    qr.addData = data => { d.qrLinks.push(data); return add(data); }; return qr;
  };
  sandbox.module = {exports: {}};
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/sync.js'), 'utf8'), sandbox, {filename: 'sync.js'});
  const fetch = (url, config) => {
    d.active++; d.maxActive = Math.max(d.maxActive, d.active);
    const req = JSON.parse(config.body); d.calls.push({url, config, req, at: clock.now()});
    let pending;
    if (options.fetch) pending = Promise.resolve().then(() => options.fetch(req, config, d));
    else if (d.mode === 'reject') pending = Promise.reject(new TypeError('secret network details'));
    else if (d.mode === 'html') pending = Promise.resolve({ok: true, json() { return Promise.reject(new SyntaxError('<html>private</html>')); }});
    else if (d.mode === 'server') pending = Promise.resolve({ok: true, json: async () => ({ok: false, err: 'server'})});
    else if (d.mode === 'http') pending = Promise.resolve({ok: false, json: async () => ({})});
    else if (d.mode === 'hold') pending = new Promise((resolve, reject) => {
      d.held = () => resolve({ok: true, json: async () => server.handle(req)});
      config.signal?.addEventListener('abort', () => reject(new Error('abort')));
    });
    else pending = Promise.resolve({ok: true, json: async () => server.handle(req)});
    return pending.finally(() => { d.active--; });
  };
  let seed = options.seed || 0;
  const init = {
    endpoint: options.endpoint === undefined ? 'https://example.test/exec' : options.endpoint,
    keys: options.keys || ['g5sci.v3'], container: options.selector ? '#sync' : doc.container,
    summarize: options.summarize || {'g5sci.v3': data => '練過 ' + JSON.parse(data).n + ' 題'},
    now: clock.now, storage, fetch,
    random: array => { for (let i = 0; i < array.length; i++) array[i] = seed++ % 240; },
    onReplaced: key => { d.replacements.push(key); options.onReplaced?.(key, d); },
    canReplace: options.canReplace, accept: options.accept
  };
  if (options.nativeRandom) delete init.random;
  if (options.random) init.random = options.random;
  if (options.noCrypto) delete window.crypto;
  d.window = window; d.library = sandbox.module.exports; d.api = d.library.init(init);
  return d;
}
module.exports = {Storage, Clock, Document, makeStore, server, device, flush, byClass, descendants, click, hash};
27:def check(name, cond, detail=""):
32:def shot(page, name, full=True):
34:        SHOTS.mkdir(parents=True, exist_ok=True)
38:def open_page(browser, device=None, init=None, url=URL, **kw):
53:def last_ask(page):
57:def chip(page, text):
61:def fb_text(page):
65:def fill_nums(page, values):
72:def no_overflow(page, width):
77:def store(page):
82:def walk_lesson(page, label, mistakes=True):
142:def answers(a, b):
149:def solve_practice(page, a, b, hint=False, slip=False):
182:def flow_full(browser, label, device=None, width=None, shots=False):
230:def prob_text(page):
235:def flow_codex_r1(browser):
244:def codex_r1_lesson(browser):
260:def codex_r1_inputs(browser):
289:def codex_r1_reopen(browser):
319:def flow_storage_blocked(browser):
330:def flow_corrupt_store(browser):
353:def flow_home(browser):
373:def flow_migrate(browser):
386:def flow_steps(browser, label, device=None, shots=False):
419:def flow_dark(browser):
432:def flow_video_live(browser, label, device=None):
455:def flow_codex_help_r1(browser):
507:def flow_codex_help_r2(browser):
536:def flow_single_writer(browser, label):
566:def flow_codex_r4(browser):
607:def flow_codex_r5(browser, label="Chromium"):
701:def flow_codex_r6(browser, label="Chromium"):
759:def flow_confused(browser):
778:def main():
780:        cr = p.chromium.launch()
790:        flow_single_writer(cr, "Chromium")
793:        flow_codex_r6(cr)
800:        wk = p.webkit.launch()
804:        flow_single_writer(wk, "WebKit")
806:        flow_codex_r6(wk, "WebKit")
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-2s3PNuRg' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-l5n0039r' (errno=Operation not permitted)
diff --git a/src/app.html b/src/app.html
index 8420e37..77c8391 100644
--- a/src/app.html
+++ b/src/app.html
@@ -267,6 +267,9 @@ function loadDB(){ var d = readDisk(); return {v:1, entries:d.ok ? d.entries : O
 var DB = loadDB(), st = null, NOTICE = "", GEN = 0;
 function stateOf(id){ if (!own(DB.entries, id)) DB.entries[id] = fresh(); return DB.entries[id]; }
 function dirtyCount(){ return Object.keys(DIRTY).length; }
+// 舊畫面守門（Codex 第 6 輪：重播舊 handler 會改到別篇或把記憶體換回磁碟）：綁定時記下畫面世代 GEN（和這一題的 cur），
+// 執行時世代變了、或這一題已計分換題、或還沒讀成功，就什麼都不做。所有會改進度或切畫面的按鈕都走這裡。
+function guard(fn, c){ var g = GEN; return function(){ if (g !== GEN || !WRITER || !READY || (c && st.cur !== c)) return; return fn.apply(this, arguments); }; }
 function backupBroken(raw){
   // 壞資料：用不會撞名的 key 備份並讀回核對；成功才允許之後用新資料覆蓋主 key（不先刪主 key）
   if (BACKED === raw) return true;
@@ -300,7 +303,7 @@ function drawWarn(){
 }
 // 讀不到原有紀錄時的「再讀一次」：讀成功才開放作答，並接著原紀錄（不會被空白蓋掉）
 function retryRead(){
-  if (!WRITER) return;
+  if (!WRITER || READY) return;   // 已經讀成功：舊的「再讀一次」重播不能把記憶體換回磁碟版（Codex 第 6 輪）
   var d = readDisk();
   if (!d.ok) { NOTICE = "還是讀不到，請稍後再試，或重新整理這一頁。"; route(); return; }
   DB = {v:1, entries:d.entries, readOk:true}; READY = true; route();
@@ -310,9 +313,10 @@ function canReplace(key){ return key === KEY && WRITER && READY && !E && !dirtyC
 function applyRemote(key, raw){
   if (!canReplace(key)) return false;
   var es = parseDB(raw); if (!es) return false;
-  try { localStorage.setItem(KEY, raw); if (localStorage.getItem(KEY) !== raw) return false; } catch (e) { return false; }
-  GEN++; DB = {v:1, entries:es, readOk:true}; drawHome();
-  return true;
+  try { localStorage.setItem(KEY, raw); } catch (e) { return false; }   // 沒寫進去＝磁碟沒變，記憶體也不換
+  GEN++; DB = {v:1, entries:es, readOk:true}; drawHome();   // 寫進去了就一定採用：記憶體與磁碟一致（Codex 第 6 輪必修 1）
+  var back; try { back = localStorage.getItem(KEY); } catch (e) { back = null; }
+  return back === raw;   // 讀回失敗只告訴 sync「下次再確認」，sync 下一輪看到本機＝雲端會只補 baseline
 }
 
 // ---------- 互動元件 ----------
@@ -517,7 +521,7 @@ function step6(ea, eb){
       (A.n * SOL.rawLcm / A.d) + ' ' + sym(SOL.sign) + ' ' + (B.n * SOL.rawLcm / B.d) + '，答案也是「' + SOL.sign + '」。可是要算 ' + A.n + ' × ' + (SOL.rawLcm / A.d) + '、' + B.n + ' × ' + (SOL.rawLcm / B.d) + '，比先約分辛苦很多。</p></details>');
     var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做一題</button></div>');
     st.lessonDone = true; save(); drawTopBtns();
-    $("#toPractice", go).onclick = function(){ openPractice(); };
+    $("#toPractice", go).onclick = guard(function(){ openPractice(); });
   });
 }
 
@@ -604,8 +608,8 @@ function renderPractice(){
       '<div class="fb ok">' + (clean ? "完全自己做對！連續 " + st.streak + " 題。" : "做完了！" + (cur.hints ? "這題看了提示，" : "這題有改過答案，") + "下一題試試不看提示。") + '</div>') +
       (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
       '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
-    $("#nextQ", PE).onclick = function(){ renderPractice(); reveal(P); };
-    $("#toLesson", PE).onclick = function(){ startLesson(); };
+    $("#nextQ", PE).onclick = guard(function(){ renderPractice(); reveal(P); });
+    $("#toLesson", PE).onclick = guard(function(){ startLesson(); });
     drawTopBtns(); drawRec(); reveal(PE);
   }
   function wireRow(row, check, hints){
@@ -617,11 +621,12 @@ function renderPractice(){
       if (r.ok) { lock(row); fb(out, true, r.msg); r.next(); }
       else { if (r.countable) { cur.wrongs++; save(); } fb(out, false, r.msg); }
     }
+    go = guard(go, cur);
     $("button[data-check]", row).onclick = go;
-    $("button[data-hint]", row).onclick = function(){
+    $("button[data-hint]", row).onclick = guard(function(){
       cur.hints++; save(); hb.hidden = false; hb.textContent = hints[Math.min(lvl, hints.length - 1)](); lvl++;
       if (lvl >= hints.length) this.disabled = true;
-    };
+    }, cur);
     each(row.querySelectorAll("input"), function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
   }
 }
@@ -637,8 +642,8 @@ function drawTopBtns(){
   T.innerHTML = st.lessonDone ?
     '<button class="btn" type="button" id="goPractice">' + (st.solved ? "繼續練習（第 " + (st.idx + 1) + " 題）" : "換你自己做練習題") + '</button><button class="btn ghost" type="button" id="goLesson">再看一次教學</button>' :
     '<button class="btn" type="button" id="goLesson">開始學</button><button class="btn ghost" type="button" id="goPractice">我已經會了，直接練習</button>';
-  $("#goLesson").onclick = startLesson;
-  $("#goPractice").onclick = openPractice;
+  $("#goLesson").onclick = guard(startLesson);
+  $("#goPractice").onclick = guard(openPractice);
   if (E.kind === "steps" && !(E.practice || []).length) $("#goPractice").remove();
   var M = $("#mastery");
   M.hidden = !st.mastered;
@@ -680,7 +685,7 @@ function stepsEnd(){
   var b = stepCard(E.steps.length + 1, "答案");
   add(b, '<div class="note" style="font-size:20px">' + E.answer + '</div>' + (E.write ? '<p>寫在考卷上的樣子：</p><div class="note" style="font-size:20px">' + E.write + '</div>' : ''));
   st.lessonDone = true; save(); drawTopBtns();
-  if ((E.practice || []).length) { var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做</button></div>'); $("#toPractice", go).onclick = openPractice; }
+  if ((E.practice || []).length) { var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做</button></div>'); $("#toPractice", go).onclick = guard(openPractice); }
 }
 function choicePractice(){
   var P = $("#practice"), list = E.practice, q = list[st.idx % list.length];
@@ -706,8 +711,8 @@ function choicePractice(){
       '<div class="fb ok">' + (clean ? "第一次就選對！連續 " + st.streak + " 題。" : "做完了！這題有改過答案，下一題試試一次選對。") + '</div>') +
       (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
       '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
-    $("#nextQ", PE).onclick = function(){ choicePractice(); reveal(P); };
-    $("#toLesson", PE).onclick = function(){ startLesson(); };
+    $("#nextQ", PE).onclick = guard(function(){ choicePractice(); reveal(P); });
+    $("#toLesson", PE).onclick = guard(function(){ startLesson(); });
     drawTopBtns(); drawRec(); reveal(PE);
   }; });
 }
diff --git a/src/sync.js b/src/sync.js
index d366e82..2522a45 100644
--- a/src/sync.js
+++ b/src/sync.js
@@ -341,6 +341,8 @@
         else { showConflict(key, cloud); }
         return;
       }
+      // 本機內容已經和雲端一字不差（已同步過的裝置；例如頁面寫進去了但讀回失敗，#1303 第 6 輪）。第一次加入仍照 A4 一律問：只補 baseline，不出衝突、不備份、不換
+      if (local !== null && local === cloud.data) { saveBaseline(key, cloud.rev, cloud.data, cloud.updated); delete conflicts[key]; return; }
       if (cloud.rev < meta.rev || (cloud.rev === meta.rev && contentHash(cloud.data) !== meta.hash)) {
         showConflict(key, cloud); return;
       }
diff --git a/tests/sync.test.js b/tests/sync.test.js
index d9cd5f3..aa933c5 100644
--- a/tests/sync.test.js
+++ b/tests/sync.test.js
@@ -394,7 +394,7 @@ test('S37 cloud choice retries a failed download and backs up local progress aft
   assert.equal(backend.store.record(code).rev, 2);
 });
 
-test('S30 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入', async t => {
+test('S32 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入', async t => {
   const clock = new Clock(), backend = server(clock);
   const a = device(backend, {initial: {[KEY]: data(1)}});
   t.after(() => a.api.destroy());
@@ -424,3 +424,23 @@ test('S30 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不
   assert.deepEqual(accepted, [KEY, KEY]);
   assert.equal(backups(b2).length, nb + 1, '真的要換時才備份一次');
 });
+
+test('S33 本機內容已經等於雲端（例如頁面寫進去了但讀回失敗）：只補 baseline，不出衝突、不再換', async t => {
+  const clock = new Clock(), backend = server(clock);
+  const a = device(backend, {initial: {[KEY]: data(1)}});
+  t.after(() => a.api.destroy());
+  await a.api.ready; await a.api.enable();
+  const code = a.api.getState().code;
+  const b = device(backend);
+  t.after(() => b.api.destroy());
+  await b.api.ready; await b.api.join(code);
+  a.storage.setItem(KEY, data(7)); await clock.advance(4000);
+  // b 的本機已經是 data(7)，但 baseline 還停在 rev 1
+  b.storage.setItem(KEY, data(7)); b.api.destroy();
+  const b2 = device(backend, {storage: b.storage}); t.after(() => b2.api.destroy());
+  const nb = backups(b2).length;
+  await b2.api.ready;
+  assert.equal(Object.keys(b2.api.getState().conflicts).length, 0, '內容一樣不該問要留哪一份');
+  assert.equal(JSON.parse(b2.storage.getItem('g5sync.meta')).keys[KEY].rev, backend.store.record(code).rev, 'baseline 補到雲端的 rev');
+  assert.equal(backups(b2).length, nb, '內容一樣不必備份');
+});

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/app.html | sed -n '368,455p;532,817p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   368	function stepCard(n, title){
   369	  var s = add($("#lesson"), '<section class="lstep" data-step="' + n + '"><div class="lhead"><span class="n">' + n + '</span><h2>' + title + '</h2></div><div class="lbody"></div><div class="row"><button class="btn ghost sm" type="button" data-confused>這步看不懂</button><span class="small muted" data-cmsg></span></div></section>');
   370	  $("button[data-confused]", s).onclick = function(){ confused(this, n, title); };
   371	  reveal(s);
   372	  return $(".lbody", s);
   373	}
   374	// 孩子按「這步看不懂」→ 送到家裡的 GAS 佇列（交辦 #1319：孩子本人的真實回饋才是白話程度的最終判準），電腦取回後據此改寫那一步
   375	var HELP_EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec";
   376	function confused(btn, n, title){
   377	  var msg = btn.nextElementSibling, code = null, id = E && E.id, subj = E && E.subject;
   378	  try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
   379	  if (!code) { msg.textContent = "這台還沒開同步，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; return; }
   380	  btn.disabled = true; msg.textContent = "送出中…";
   381	  fetch(HELP_EP, {method:"POST", headers:{"Content-Type":"text/plain"}, credentials:"omit", body:JSON.stringify({op:"confused", code:code, subject:subj, entry:id, step:n, title:String(title).replace(/<[^>]*>/g, "").slice(0, 200)})})
   382	    .then(function(r){ return r.json(); })
   383	    .then(function(r){ msg.textContent = r && r.ok ? "收到了！會換一個更好懂的說法。先試試看下一步。" : "沒送成功，請跟爸爸媽媽說：第 " + n + " 步看不懂。"; if (!(r && r.ok)) btn.disabled = false; })
   384	    .catch(function(){ msg.textContent = "沒送成功（可能沒有網路），請跟爸爸媽媽說：第 " + n + " 步看不懂。"; btn.disabled = false; });
   385	}
   386	
   387	// ---------- 題目列 ----------
   388	function setBox(s){ var b = $("#box"); b.innerHTML = s ? sym(s) : ""; b.classList.toggle("got", !!s); b.setAttribute("aria-label", s ? "答案 " + s : "空格"); }
   389	function drawProb(){ $("#prob").innerHTML = fr(A) + '<span class="box" id="box" role="img" aria-label="空格"></span>' + fr(B); }
   390	
   391	// ---------- 教學（習作那一題） ----------
   392	function startLesson(){
   393	  if (E.kind === "steps") return stepsLesson();
   394	  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false; setBox("");
   395	  step1();
   396	}
   397	function step1(){
   398	  var b = stepCard(1, "先看分母"), m = F.multiplesUntil(A, B);
   399	  add(b, '<p>兩個分數的分母是 <b>' + A.d + '</b> 和 <b>' + B.d + '</b>，不一樣，要先通分才能比。</p>' +
   400	    '<p>如果直接通分，要找 ' + A.d + ' 和 ' + B.d + ' 的公倍數。把 ' + m.big + ' 的倍數一個一個寫出來：</p>' +
   401	    '<div class="mults">' + m.list.map(function(x, i){ return '<span' + (i === m.list.length - 1 ? ' class="hit"' : '') + '>' + x + '</span>'; }).join("") + '</div>' +
   402	    '<p>要寫到第 ' + m.list.length + ' 個 <b>' + m.lcm + '</b>，才剛好也是 ' + m.small + ' 的倍數。分數會變成「？/' + m.lcm + '」，數字太大，很容易算錯。</p>');
   403	  var pr = E.prior || {q:"數字很大的分數，怎麼讓它們變小？", ok:"對！先約分，數字變小，再通分。", hint:"想想看：分子分母一起除以同一個數，叫做什麼？"};
   404	  chipsAsk(b, pr.q, [
   405	    {label:"分子分母一起乘大一點", value:"mul"},
   406	    {label:"先約分：分子分母一起除以同一個數", value:"red"},
   407	    {label:"直接比分子，" + A.n + " 比 " + B.n + (A.n > B.n ? " 大" : A.n < B.n ? " 小" : " 一樣"), value:"num"}
   408	  ], function(v){
   409	    if (v === "red") return {ok:true, msg:pr.ok};
   410	    if (v === "mul") return {ok:false, msg:"一起乘，數字只會更大喔。" + pr.hint};
   411	    return {ok:false, msg:"分母不一樣的時候，分子大的不一定比較大（等一下練習題就有反例）。要先讓分母一樣。"};
   412	  }, step2);
   413	}
   414	function reduceLoop(b, f, color, done){
   415	  var chain = [f], cur = f;
   416	  function round(){
   417	    var opts = [2, 3, 5, 7, 9].map(function(k){ return {label:"一起除以 " + k, value:k}; });
   418	    var g = F.gcd(cur.n, cur.d);   // 2、3、5、7 以外的因數（例如 11、13）也要選得到
   419	    for (var p = 11; p <= g; p++) if (g % p === 0 && isPrime(p)) opts.push({label:"一起除以 " + p, value:p});
   420	    opts.push({label:"不能再約了", value:"none"});
   421	    chipsAsk(b, fr(cur) + ' 的分子和分母，可以一起除以哪個數？', opts, function(v){ return F.pickDivisor(cur, v); }, function(v, r){
   422	      if (r.done) return finish();
   423	      numsAsk(b, "算算看：", [
   424	        {pre:cur.n + " ÷ " + v + " =", ans:r.next.n, hint:v + " × 多少 = " + cur.n + "？", aria:cur.n + " 除以 " + v},
   425	        {pre:cur.d + " ÷ " + v + " =", ans:r.next.d, hint:v + " × 多少 = " + cur.d + "？", aria:cur.d + " 除以 " + v}
   426	      ], function(){
   427	        add(b, '<div class="eq">' + fr(cur) + ' = ' + fr(r.next) + '</div>');
   428	        cur = r.next; chain.push(cur); round();
   429	      });
   430	    });
   431	  }
   432	  function finish(){
   433	    var last = cur, g = f.n / last.n;
   434	    add(b, '<div class="eq">' + chain.map(fr).join(" = ") + '</div>');
   435	    if (chain.length > 2) add(b, '<p class="tip">也可以一次除以 ' + g + '（就是 ' + chain.slice(1).map(function(x, i){ return chain[i].n / x.n; }).join(" × ") + '），一步就變成 ' + F.txt(last) + '。</p>');
   436	    add(b, '<div class="pic"><div class="cap">' + F.txt(f) + '：切成 ' + f.d + ' 小格，塗 ' + f.n + ' 格。粗線把每 ' + g + ' 小格圈成 1 大塊。</div>' +
   437	      bar(f.n, f.d, {group:g, c:color, label:F.txt(f) + "，每 " + g + " 小格圈成一大塊"}) +
   438	      bar(last.n, last.d, {c:color, label:F.txt(last)}) +
   439	      '<div class="cap">' + F.txt(last) + '：一共 ' + last.d + ' 大塊，塗 ' + last.n + ' 塊。兩條塗色的長度一模一樣——約分不會改變分數的大小。</div></div>');
   440	    done(last);
   441	  }
   442	  round();
   443	}
   444	function step2(){
   445	  var b = stepCard(2, "約分左邊的 " + F.txt(A));
   446	  add(b, '<p>約分＝分子和分母<b>一起除以同一個數</b>，分數的大小不變。從乘法表裡的小數字開始試，選對一個就好，不用一次除到底。</p>');
   447	  reduceLoop(b, A, "a", step3);
   448	}
   449	function step3(){
   450	  var b = stepCard(3, "約分右邊的 " + F.txt(B));
   451	  add(b, '<p>右邊也一樣，分子和分母一起除以同一個數，除到不能再約為止。</p>');
   452	  reduceLoop(b, B, "b", step4);
   453	}
   454	function convert(b, f, L, done){
   455	  var m = L / f.d;
   532	  return {n:pn.empty || pn.bad ? NaN : pn.v, d:pd.empty || pd.bad ? NaN : pd.v, empty:!!(pn.empty || pd.empty), bad:!!(pn.bad || pd.bad)};
   533	}
   534	function lock(box){ each(box.querySelectorAll("input,button[data-check],button[data-hint]"), function(x){ x.disabled = true; }); }
   535	function need(){ return E.kind === "steps" ? Math.min(3, (E.practice || []).length) : 3; }   // 學會＝連續答對幾題（練習題少於 3 題就全對）
   536	function dots(){ var h = ""; for (var i = 0; i < need(); i++) h += '<i class="' + (i < Math.min(st.streak, need()) ? "on" : "") + '"></i>'; return '<span class="dots" aria-label="連續自己做對 ' + st.streak + ' 題">' + h + '</span>'; }
   537	function openPractice(){ var P = $("#practice"); P.hidden = false; renderPractice(); reveal(P); }
   538	// 填了字但不是整數、或還有格子沒填：講清楚，不算答錯
   539	function formCheck(fs){
   540	  if (fs.some(function(f){ return f.bad; })) return {ok:false, countable:false, msg:"只能填整數，例如 2、15。"};
   541	  if (fs.some(function(f){ return f.empty; })) return {ok:false, countable:false, msg:"還有格子沒填。"};
   542	  return null;
   543	}
   544	function renderPractice(){
   545	  if (E.kind === "steps") return choicePractice();
   546	  var P = $("#practice"), p = F.problem(st.idx, st.seed), a = p.a, b = p.b, s = F.solve(a, b);
   547	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   548	  var cur = st.cur, sa = null, sb = null, ea = null, eb = null;
   549	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   550	    '<div class="small muted">連續 3 題「沒看提示、每一格第一次就對」就算學會。看了提示也沒關係，弄懂最重要。</div>' +
   551	    '<div class="prob">' + fr(a) + '<span class="box" id="pbox" role="img" aria-label="空格"></span>' + fr(b) + '</div>' +
   552	    '<div class="prow" id="r1"><div class="qq">① 先約分，變成最簡分數</div><div class="eq"><span class="pair">' + fr(a) + ' = ' + fin("a") + '</span><span class="pair">' + fr(b) + ' = ' + fin("b") + '</span></div>' +
   553	    '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div></div>' +
   554	    '<div class="prow" id="r2" hidden></div><div class="prow" id="r3" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   555	  var r1 = $("#r1", P), r2 = $("#r2", P), r3 = $("#r3", P);
   556	  wireRow(r1, function(){
   557	    var ia = readFrac(r1, "a"), ib = readFrac(r1, "b"), form = formCheck([ia, ib]);
   558	    if (form) return form;
   559	    var x = F.checkReduce(a, ia), y = F.checkReduce(b, ib);
   560	    if (x.ok && y.ok) { sa = ia; sb = ib; return {ok:true, msg:"對了：" + F.txt(a) + " = " + F.txt(sa) + "，" + F.txt(b) + " = " + F.txt(sb) + "。", next:row2}; }
   561	    return {ok:false, countable:(!x.ok && x.code !== "empty") || (!y.ok && y.code !== "empty"), msg:(x.ok ? "" : "左邊：" + x.msg) + (!x.ok && !y.ok ? "\n" : "") + (y.ok ? "" : "右邊：" + y.msg)};
   562	  }, [
   563	    function(){ return "從 2、3、5、7、9 開始試：分子和分母都在同一個乘法表裡，就能一起除。" + [a, b].map(function(f){ var q = F.smallestCommon(f); return F.txt(f) + "：" + F.divText(q, f.n) + "、" + F.divText(q, f.d) + "，可以先一起除以 " + q + "。"; }).join(" "); },
   564	    function(){ return [a, b].map(function(f){ var t = F.simplest(f); return F.txt(f) + "：" + f.n + " = " + t.g + " × " + t.n + "、" + f.d + " = " + t.g + " × " + t.d + "，一起除以 " + t.g + "，變成 " + t.n + "/" + t.d + "。"; }).join(" "); }
   565	  ]);
   566	  function row2(){
   567	    r2.hidden = false;
   568	    r2.innerHTML = '<div class="qq">② 再通分，讓分母一樣</div><div class="eq"><span class="pair">' + fr(sa) + ' = ' + fin("c") + '</span><span class="pair">' + fr(sb) + ' = ' + fin("e") + '</span></div>' +
   569	      '<div class="row"><button class="btn sm" type="button" data-check>檢查</button><button class="btn ghost sm" type="button" data-hint>給我提示</button></div><div class="fb" hidden></div><div class="hint" hidden></div>';
   570	    wireRow(r2, function(){
   571	      var ia = readFrac(r2, "c"), ib = readFrac(r2, "e"), form = formCheck([ia, ib]);
   572	      if (form) return form;
   573	      var x = F.checkCommon(sa, sb, ia, ib);
   574	      if (x.ok) { ea = ia; eb = ib; return {ok:true, msg:x.msg, next:row3}; }
   575	      return {ok:false, countable:x.code !== "empty", msg:x.msg};
   576	    }, [
   577	      function(){ var ma = [], mb = []; for (var i = 1; i <= s.lcm / sa.d; i++) ma.push(sa.d * i); for (var j = 1; j <= s.lcm / sb.d; j++) mb.push(sb.d * j);
   578	        return "先找 " + sa.d + " 和 " + sb.d + " 的最小公倍數。" + sa.d + " 的倍數：" + ma.join("、") + "…；" + sb.d + " 的倍數：" + mb.join("、") + "…，第一個兩邊都有的就是。"; },
   579	      function(){ return "最小公倍數是 " + s.lcm + "。" + F.txt(sa) + " 的分子分母都乘 " + (s.lcm / sa.d) + " → " + F.txt(s.ea) + "；" + F.txt(sb) + " 的分子分母都乘 " + (s.lcm / sb.d) + " → " + F.txt(s.eb) + "。"; }
   580	    ]);
   581	    reveal(r2);
   582	  }
   583	  function row3(){
   584	    r3.hidden = false;
   585	    r3.innerHTML = '<div class="qq">③ 比大小：' + fr(ea) + ' 和 ' + fr(eb) + '</div><div class="qq">所以 ' + fr(a) + ' ○ ' + fr(b) + '？</div><div class="chips">' +
   586	      SIGNS.map(function(o){ return '<button type="button" class="chip sign" data-s="' + esc(o.value) + '">' + o.label + '</button>'; }).join("") + '</div><div class="fb" hidden></div>';
   587	    var out = $(".fb", r3), bs = r3.querySelectorAll(".chip");
   588	    var g0 = GEN;
   589	    var g1 = GEN;
   590	  each(bs, function(bt){ bt.onclick = function(){
   591	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分（st.cur 換掉）或已切走：舊 handler 失效，不重複計分
   592	      if (g0 !== GEN) return;
   593	      var r = F.checkSign(a, b, ea, eb, bt.dataset.s);
   594	      if (r.ok) { each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, r.msg); $("#pbox", P).innerHTML = sym(s.sign); $("#pbox", P).classList.add("got"); finish(); }
   595	      else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, r.msg); }
   596	    }; });
   597	    reveal(r3);
   598	  }
   599	  function finish(){
   600	    var clean = cur.hints === 0 && cur.wrongs === 0, was = st.mastered;
   601	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   602	    st.idx++; st.cur = null;   // 做完就換下一題：重開練習不會再算一次同一題（Codex 第 1 輪必修 1）
   603	    if (st.streak >= 3) st.mastered = true;
   604	    st.log.push({t:Date.now(), a:F.txt(a), b:F.txt(b), clean:clean, hints:cur.hints, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   605	    var saved = save();
   606	    var PE = $("#pend", P); PE.hidden = false;
   607	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 3 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   608	      '<div class="fb ok">' + (clean ? "完全自己做對！連續 " + st.streak + " 題。" : "做完了！" + (cur.hints ? "這題看了提示，" : "這題有改過答案，") + "下一題試試不看提示。") + '</div>') +
   609	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   610	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   611	    $("#nextQ", PE).onclick = guard(function(){ renderPractice(); reveal(P); });
   612	    $("#toLesson", PE).onclick = guard(function(){ startLesson(); });
   613	    drawTopBtns(); drawRec(); reveal(PE);
   614	  }
   615	  function wireRow(row, check, hints){
   616	    var out = $(".fb", row), hb = $(".hint", row), lvl = 0;
   617	    var gg = GEN;
   618	  function go(){
   619	    if (gg !== GEN) return;
   620	      var r = check();
   621	      if (r.ok) { lock(row); fb(out, true, r.msg); r.next(); }
   622	      else { if (r.countable) { cur.wrongs++; save(); } fb(out, false, r.msg); }
   623	    }
   624	    go = guard(go, cur);
   625	    $("button[data-check]", row).onclick = go;
   626	    $("button[data-hint]", row).onclick = guard(function(){
   627	      cur.hints++; save(); hb.hidden = false; hb.textContent = hints[Math.min(lvl, hints.length - 1)](); lvl++;
   628	      if (lvl >= hints.length) this.disabled = true;
   629	    }, cur);
   630	    each(row.querySelectorAll("input"), function(x){ x.addEventListener("keydown", function(e){ if (e.key === "Enter") go(); }); });
   631	  }
   632	}
   633	
   634	// ---------- 首頁按鈕、紀錄、影片 ----------
   635	function drawTopBtns(){
   636	  var T = $("#topBtns");
   637	  if (!WRITER) { T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">' + esc(READONLY_MSG) + '</div>'; $("#mastery").hidden = true; return; }
   638	  if (!READY) {   // 讀不到原有紀錄：不給作答（Codex 第 5 輪必修 1），給「再讀一次」
   639	    T.innerHTML = '<div class="banner" role="status" style="background:var(--sun-soft);border-radius:12px;padding:12px 16px">這台裝置的練習紀錄暫時讀不到，為了不把以前的紀錄蓋掉，先不開始練習。</div><button class="btn" type="button" id="readRetry">再讀一次</button>';
   640	    $("#readRetry").onclick = retryRead; $("#mastery").hidden = true; return;
   641	  }
   642	  T.innerHTML = st.lessonDone ?
   643	    '<button class="btn" type="button" id="goPractice">' + (st.solved ? "繼續練習（第 " + (st.idx + 1) + " 題）" : "換你自己做練習題") + '</button><button class="btn ghost" type="button" id="goLesson">再看一次教學</button>' :
   644	    '<button class="btn" type="button" id="goLesson">開始學</button><button class="btn ghost" type="button" id="goPractice">我已經會了，直接練習</button>';
   645	  $("#goLesson").onclick = guard(startLesson);
   646	  $("#goPractice").onclick = guard(openPractice);
   647	  if (E.kind === "steps" && !(E.practice || []).length) $("#goPractice").remove();
   648	  var M = $("#mastery");
   649	  M.hidden = !st.mastered;
   650	  if (st.mastered) M.innerHTML = '<div class="win"><b class="t">這種題你已經會了</b><span>連續 ' + need() + ' 題自己做對。想多練可以繼續做。</span></div>';
   651	}
   652	function drawRec(){
   653	  if (!E || !st) return;
   654	  $("#rec").textContent = st.solved ? "這台裝置上的練習紀錄：做完 " + st.solved + " 題，其中 " + st.clean + " 題沒看提示、一次就對；目前連續 " + st.streak + " 題。" + (st.mastered ? "已達「連續 " + need() + " 題自己做對」。" : "") : "這台裝置上還沒有練習紀錄。";
   655	}
   656	function drawVids(){
   657	  var VIDS = E.videos || [];
   658	  $("#vidBox").hidden = !VIDS.length; $("#vids").innerHTML = "";
   659	  if (!VIDS.length) return;
   660	  $("#vidBox").hidden = false;
   661	  $("#vids").innerHTML = VIDS.map(function(v, i){ return '<div style="display:grid;gap:6px"><b>' + esc(v.title) + '</b><span class="small muted">' + esc(v.note) + '</span><div class="row"><button class="btn ghost sm" type="button" data-v="' + i + '">播放（' + esc(v.len) + '）</button></div><div class="vslot"></div></div>'; }).join("");
   662	  each($("#vids").querySelectorAll("button[data-v]"), function(b){ b.onclick = function(){
   663	    var v = VIDS[+b.dataset.v], slot = b.parentNode.nextElementSibling;
   664	    slot.innerHTML = '<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?rel=0&playsinline=1&autoplay=1&start=' + v.start + (v.end ? '&end=' + v.end : '') + '" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
   665	    b.disabled = true;
   666	  }; });
   667	}
   668	
   669	// ---------- 通用格式 steps（任何科目）：分步解說＋確認題＋答案＋同型練習 ----------
   670	function stepsLesson(){
   671	  var L = $("#lesson"); L.innerHTML = ""; L.hidden = false;
   672	  var i = 0;
   673	  function next(){
   674	    if (i >= E.steps.length) return stepsEnd();
   675	    var s = E.steps[i], b = stepCard(++i, s.title);
   676	    add(b, '<p>' + s.say + '</p>' + (s.fig ? '<div class="pic">' + s.fig + '</div>' : ''));
   677	    if (s.check) chipsAsk(b, s.check.q, s.check.opts.map(function(o, k){ return {label:esc(o), value:k}; }), function(v){
   678	      return v === s.check.a ? {ok:true, msg:s.check.ok || "對了！"} : {ok:false, msg:(s.check.why && s.check.why[v]) || "再想想看。"};
   679	    }, next);
   680	    else { var r = add(b, '<div class="row"><button class="btn sm" type="button" data-next>我懂了，下一步</button></div>'), g = GEN; $("button", r).onclick = function(){ if (g !== GEN) return; this.disabled = true; next(); }; }
   681	  }
   682	  next();
   683	}
   684	function stepsEnd(){
   685	  var b = stepCard(E.steps.length + 1, "答案");
   686	  add(b, '<div class="note" style="font-size:20px">' + E.answer + '</div>' + (E.write ? '<p>寫在考卷上的樣子：</p><div class="note" style="font-size:20px">' + E.write + '</div>' : ''));
   687	  st.lessonDone = true; save(); drawTopBtns();
   688	  if ((E.practice || []).length) { var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做</button></div>'); $("#toPractice", go).onclick = guard(openPractice); }
   689	}
   690	function choicePractice(){
   691	  var P = $("#practice"), list = E.practice, q = list[st.idx % list.length];
   692	  if (!st.cur || st.cur.idx !== st.idx) { st.cur = {idx:st.idx, hints:0, wrongs:0}; save(); }
   693	  var cur = st.cur;
   694	  P.innerHTML = '<div class="row" style="justify-content:space-between"><h2 style="font-size:24px">練習第 ' + (st.idx + 1) + ' 題</h2><span class="small muted">連續自己做對' + dots() + '</span></div>' +
   695	    '<div class="small muted">連續 ' + need() + ' 題第一次就選對，就算學會。</div><div class="qtext">' + q.q + '</div><div class="chips">' +
   696	    q.opts.map(function(o, k){ return '<button type="button" class="chip" data-k="' + k + '">' + esc(o) + '</button>'; }).join("") + '</div><div class="fb" hidden></div><div id="pend" style="display:grid;gap:12px" hidden></div>';
   697	  var out = $(".fb", P), bs = P.querySelectorAll(".chip");
   698	  var g1 = GEN;
   699	  each(bs, function(bt){ bt.onclick = function(){
   700	    if (g1 !== GEN || st.cur !== cur) return;   // 這題已計分或已切走：舊 handler 失效，不重複計分
   701	    var k = +bt.dataset.k;
   702	    if (k !== q.a) { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, (q.why && q.why[k]) || "再想想看。"); return; }
   703	    each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, q.ok || "對了！");
   704	    var clean = cur.wrongs === 0, was = st.mastered;
   705	    st.solved++; if (clean) { st.clean++; st.streak++; } else st.streak = 0;
   706	    st.idx++; st.cur = null;
   707	    if (st.streak >= need()) st.mastered = true;
   708	    st.log.push({t:Date.now(), q:st.idx - 1, clean:clean, wrongs:cur.wrongs}); st.log = st.log.slice(-100);
   709	    var saved = save(), PE = $("#pend", P); PE.hidden = false;
   710	    PE.innerHTML = (st.mastered && !was ? '<div class="win"><b class="t">這種題你會了！</b><span>連續 ' + need() + ' 題自己做對。回到' + esc(E.source) + '，把它寫完吧。</span></div>' :
   711	      '<div class="fb ok">' + (clean ? "第一次就選對！連續 " + st.streak + " 題。" : "做完了！這題有改過答案，下一題試試一次選對。") + '</div>') +
   712	      (saved ? "" : '<p class="small muted">這台裝置存不了紀錄（可能是私密瀏覽），重新整理後會從頭開始，題目照常可以做。</p>') +
   713	      '<div class="row"><button class="btn" type="button" id="nextQ">下一題</button><button class="btn ghost" type="button" id="toLesson">再看一次教學</button></div>';
   714	    $("#nextQ", PE).onclick = guard(function(){ choicePractice(); reveal(P); });
   715	    $("#toLesson", PE).onclick = guard(function(){ startLesson(); });
   716	    drawTopBtns(); drawRec(); reveal(PE);
   717	  }; });
   718	}
   719	
   720	// ---------- 首頁（依科目列出每一篇）與切換 ----------
   721	function statusOf(id){ var s = DB.entries[id]; return !s ? "還沒看" : s.mastered ? "學會了" : s.solved ? "練習中" : s.lessonDone ? "教學看完了" : "還沒看"; }
   722	function drawHome(){
   723	  $("#subjects").innerHTML = H.SUBJECTS.map(function(sj){
   724	    var es = H.LIST.filter(function(e){ return e.subject === sj; }).slice().reverse();
   725	    return '<section class="subj" data-subj="' + sj + '"><div class="sect-t">' + sj + '</div>' + (es.length ? '<div class="hlist">' + es.map(function(e){
   726	      var t = statusOf(e.id);
   727	      return '<a class="hcard" href="#h/' + e.id + '"><b>' + esc(e.title) + '</b><span class="meta">' + esc(e.source) + (e.tag ? "・" + esc(e.tag) : "") + '・' + e.date.slice(5).replace("-", "/") + '</span><span class="st' + (t === "學會了" ? " done" : "") + '">' + t + '</span></a>';
   728	    }).join("") + '</div>' : '<span class="empty">還沒有題目。</span>') + '</section>';
   729	  }).join("");
   730	}
   731	function countdown(){
   732	  var d = new Date(Date.now() + 8 * 3600000), today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), left = Math.round((Date.UTC(2026, 10, 5) - today) / 86400000);
   733	  $("#cd").textContent = left >= 0 ? "・期中考 11/5 還有 " + left + " 天" : "";
   734	}
   735	function openEntry(e){
   736	  GEN++; E = e; st = stateOf(e.id);
   737	  $("#home").hidden = true; $("#entry").hidden = false;
   738	  $("#lesson").innerHTML = ""; $("#lesson").hidden = true; $("#practice").innerHTML = ""; $("#practice").hidden = true;
   739	  $("#src").textContent = e.source + "（" + e.subject + "）" + (e.ask ? "：" + e.ask : "");
   740	  if (e.kind === "frac-compare") { A = e.a; B = e.b; SOL = F.solve(A, B); drawProb(); }
   741	  else $("#prob").innerHTML = '<div class="qtext">' + e.question + '</div>';
   742	  $("#lead").textContent = e.lead || "跟著下面一步一步做，每一步都要你自己想一想、選一選。";
   743	  $("#parentText").innerHTML = e.parent || "";
   744	  document.title = e.title + "｜五年級難題解說";
   745	  drawTopBtns(); drawRec(); drawVids(); window.scrollTo(0, 0);
   746	  if (NOTICE) { $("#lead").textContent = NOTICE; NOTICE = ""; }
   747	}
   748	function route(){
   749	  var m = /^#h\/([\w-]+)$/.exec(location.hash), e = m && H.get(m[1]);
   750	  if (e) return openEntry(e);
   751	  GEN++; E = null; st = null; document.title = "五年級難題解說";
   752	  $("#vids").innerHTML = ""; $("#vidBox").hidden = true;   // 回首頁就關掉影片（Codex 建議 7）
   753	  $("#entry").hidden = true; $("#home").hidden = false; drawHome();
   754	}
   755	$("#saveRetry").onclick = function(){ save(); };
   756	$("#backHome").onclick = function(ev){ ev.preventDefault(); location.hash = ""; route(); };
   757	window.addEventListener("hashchange", route);
   758	// 同一時間只讓一個分頁練習與寫入（Web Locks；Codex 2026-10-13 設計者方案 B）。
   759	// 拿不到鎖＝另一個分頁在練：這頁唯讀；等那頁關掉、鎖釋放後自動重新載入接手（重讀最新紀錄）。
   760	var READONLY_MSG = "這個網站已經在另一個分頁（或視窗）開著了，請回到那個分頁練習；那邊關掉後，這一頁會自動接手。";
   761	function start(){ countdown(); route(); window.dispatchEvent(new Event("g5help-ready")); }
   762	if (navigator.locks && navigator.locks.request) {
   763	  var lockFail = function(){ WRITER = false; READONLY_MSG = "這一頁拿不到存檔的權限（瀏覽器拒絕），只能看不能練；請重新整理或換瀏覽器。"; start(); };
   764	  navigator.locks.request("g5help-writer", {ifAvailable: true}, function(lock){
   765	    if (!lock) {
   766	      WRITER = false; start();
   767	      navigator.locks.request("g5help-writer", function(){ location.reload(); return new Promise(function(){}); }).catch(function(){});
   768	      return;
   769	    }
   770	    WRITER = true; DB = loadDB(); READY = DB.readOk; start();
   771	    return new Promise(function(){});   // 整個頁面存活期間都持有
   772	  }).catch(lockFail);
   773	} else {
   774	  READONLY_MSG = "這個瀏覽器太舊，不能安全存練習紀錄；請更新 iPad／瀏覽器後再練習。";
   775	  WRITER = false; start();
   776	}
   777	window.G5HelpWriter = function(){ return WRITER; };
   778	window.G5HelpDirty = function(){ return dirtyCount(); };
   779	window.G5HelpCanReplace = canReplace;
   780	window.G5HelpApplyRemote = applyRemote;
   781	window.G5HelpPage = {state:function(id){ return JSON.parse(JSON.stringify(DB.entries[id] || null)); }};
   782	})();
   783	</script>
   784	<script>
   785	// 跨裝置同步（家庭同步碼）：只同步本站自己的 g5help.v1；同步碼存在同網域 localStorage，自然站連過也算
   786	(function(){
   787	  if (!window.G5Sync) return;   // sync.js 載不到就照常本機使用
   788	  function boot(){ if (!(window.G5HelpWriter && window.G5HelpWriter())) { var c = document.getElementById("g5sync"); if (c) c.textContent = "（在另一個分頁開著，同步由那一頁負責）"; return; }
   789	  window.G5Sync.init({
   790	    endpoint: "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec",
   791	    keys: ["g5help.v1"], container: "#g5sync",
   792	    summarize: {"g5help.v1": function(j){ try { var x = JSON.parse(j), n = 0, m = 0; Object.keys(x.entries || {}).forEach(function(k){ n += x.entries[k].solved || 0; if (x.entries[k].mastered) m++; }); return "練習做完 " + n + " 題、學會 " + m + " 篇"; } catch (e) { return "（讀不懂的紀錄）"; } }},
   793	    // 雲端版本只能經由本頁套用（首頁、沒有未存進度時），不 reload（#1303 第 5 輪必修 2）
   794	    canReplace: function(key){ return window.G5HelpCanReplace(key); },
   795	    accept: function(key, data){ return window.G5HelpApplyRemote(key, data); }
   796	  }); }
   797	  window.addEventListener("g5help-ready", boot, {once: true});
   798	})();
   799	</script>
   800	<script>
   801	// 家長傳題目：照片在這台裝置先縮小（長邊 1600px、JPEG），送到家裡自己的 GAS（gas/inbox.js）；只有已開啟跨裝置同步的裝置能送
   802	(function(){
   803	  var EP = "https://script.google.com/macros/s/AKfycbxwo08VVT5tSRf-DsQEoo1hMlCm1YytGTzj89BPtJ6YWjPieuKyAPbnWXjUKagBdL6l/exec", $ = function(s){ return document.querySelector(s); };
   804	  $("#upSubj").innerHTML = ["國語","數學","自然","社會","英文","其他"].map(function(x){ return '<option>' + x + '</option>'; }).join("");
   805	  function msg(t, bad){ $("#upMsg").textContent = t; $("#upMsg").style.color = bad ? "var(--bad)" : "var(--leaf)"; }
   806	  function shrink(file){
   807	    return new Promise(function(ok, no){
   808	      var img = new Image(), url = URL.createObjectURL(file);
   809	      img.onload = function(){
   810	        var k = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement("canvas");
   811	        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
   812	        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
   813	        var q = 0.8, d = c.toDataURL("image/jpeg", q);
   814	        while (d.length > 850000 && q > 0.3) { q -= 0.1; d = c.toDataURL("image/jpeg", q); }
   815	        d.length > 850000 ? no(new Error("big")) : ok(d);
   816	      };
   817	      img.onerror = function(){ no(new Error("img")); }; img.src = url;

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[██░░░░░░░░] 20%｜已核對原失敗與修補位置｜HEAD 符合 `c2f68bf`；接著測寫入成功但讀回失敗、成功重讀後重播，以及教學、練習與同步面板的全部按鈕邊界。

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/sync.js | sed -n '125,460p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
   125	    function assertActive(token) { if (!active(token)) { throw error('stale'); } }
   126	    function observe(key, data) {
   127	      var hash = contentHash(data);
   128	      if (!observed[key] || observed[key].hash !== hash) { observed[key] = {hash: hash, detected: now()}; }
   129	      return observed[key];
   130	    }
   131	    function backup(key, data) {
   132	      if (data === null) { return; }
   133	      var prefix = 'g5sync.backup.' + key + '.';
   134	      var names = [];
   135	      for (var i = 0; i < storage.length; i += 1) {
   136	        var name = storage.key(i);
   137	        if (name && name.indexOf(prefix) === 0 && /^\d+$/.test(name.slice(prefix.length))) { names.push(name); }
   138	      }
   139	      names.sort(function (a, b) { return Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)); });
   140	      var stamp = Math.max(now(), names.length ? Number(names[names.length - 1].slice(prefix.length)) + 1 : 0);
   141	      // Write before pruning: quota errors must NEVER discard progress or its last backup.
   142	      var target = prefix + stamp;
   143	      write(target, data);
   144	      if (read(target) !== data) { throw error('storage'); }
   145	      names.push(target);
   146	      while (names.length > 3) { storage.removeItem(names.shift()); }
   147	    }
   148	    function summary(key, data) {
   149	      if (data === null) { return '沒有進度紀錄'; }
   150	      try {
   151	        if (options.summarize && typeof options.summarize[key] === 'function') { return String(options.summarize[key](data)); }
   152	      } catch (ignore) { /* Summary errors cannot prevent reconciliation. */ }
   153	      return '完整紀錄，共 ' + data.length + ' 字元';
   154	    }
   155	    function el(tag, className, text) {
   156	      var node = doc.createElement(tag);
   157	      node.className = 'g5s-' + className;
   158	      if (typeof text !== 'undefined') { node.textContent = text; }
   159	      return node;
   160	    }
   161	    function button(text, fn) {
   162	      var b = el('button', 'button', text);
   163	      b.type = 'button'; b.style.minHeight = '44px';
   164	      b.addEventListener('click', fn);
   165	      return b;
   166	    }
   167	    function link() {
   168	      var href = root.location ? root.location.href : '';
   169	      return href.split('#')[0] + '#sync=' + (code || '');
   170	    }
   171	    function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }
   172	    function buildView() {
   173	      clear(container);
   174	      var panel = el('section', 'panel');
   175	      panel.setAttribute('aria-label', '家庭跨裝置同步');
   176	      view = {panel: panel};
   177	      if (!code) {
   178	        panel.appendChild(button('開啟跨裝置同步（這台是第一台）', function () { enable(); }));
   179	        panel.appendChild(button('輸入同步碼（已在別台開過）', function () {
   180	          view.join.hidden = false; view.input.focus();
   181	        }));
   182	        var form = el('form', 'join'); form.hidden = true;
   183	        var label = el('label', 'label', '同步碼');
   184	        var input = el('input', 'input'); input.type = 'text'; input.maxLength = 80;
   185	        input.autocomplete = 'off'; input.spellcheck = false; input.style.minHeight = '44px';
   186	        input.setAttribute('autocapitalize', 'characters'); input.setAttribute('aria-label', '同步碼');
   187	        label.appendChild(input); form.appendChild(label);
   188	        form.appendChild(el('p', 'hint', BAD_CODE));
   189	        form.appendChild(button('加入同步', function () { join(input.value); }));
   190	        form.addEventListener('submit', function (event) { event.preventDefault(); join(input.value); });
   191	        panel.appendChild(form); view.join = form; view.input = input;
   192	      } else {
   193	        panel.appendChild(el('p', 'code', code.match(/.{4}/g).join('-')));
   194	        var qrBox = el('div', 'qr');
   195	        qrBox.setAttribute('aria-label', '掃描 QR code 加入同步');
   196	        try {
   197	          if (typeof root.qrcode !== 'function') { throw error('qr'); }
   198	          var qr = root.qrcode(0, 'M'); qr.addData(link()); qr.make();
   199	          qrBox.innerHTML = qr.createSvgTag({cellSize: 4, margin: 16, scalable: true});
   200	          qrBox.style.maxWidth = '256px';
   201	        } catch (qrError) { qrBox.textContent = 'QR code 無法顯示，請使用下方連結或同步碼。'; }
   202	        panel.appendChild(qrBox);
   203	        var share = el('input', 'link'); share.type = 'text'; share.readOnly = true;
   204	        share.value = link(); share.setAttribute('aria-label', '同步連結'); share.style.minHeight = '44px';
   205	        panel.appendChild(share);
   206	        panel.appendChild(button('複製連結', function () {
   207	          var clipboard = root.navigator && root.navigator.clipboard;
   208	          if (clipboard && clipboard.writeText) {
   209	            Promise.resolve().then(function () { return clipboard.writeText(link()); }).then(function () {
   210	              notice = '連結已複製。'; render();
   211	            }, function () { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); });
   212	          } else { share.focus(); share.select(); notice = '請複製已選取的連結。'; render(); }
   213	        }));
   214	        panel.appendChild(button('這台停止同步', function () { stop(); }));
   215	      }
   216	      view.status = el('p', 'status'); view.status.setAttribute('role', 'status'); view.status.setAttribute('aria-live', 'polite');
   217	      view.notice = el('p', 'notice'); view.notice.setAttribute('role', 'alert');
   218	      view.conflicts = el('div', 'conflicts');
   219	      panel.appendChild(view.status); panel.appendChild(view.notice); panel.appendChild(view.conflicts);
   220	      container.appendChild(panel); viewCode = code;
   221	    }
   222	    function render() {
   223	      if (destroyed) { return; }
   224	      if (viewCode !== code || !view.panel) { buildView(); }
   225	      view.status.textContent = status; view.notice.textContent = notice;
   226	      var signature = keys.map(function (key) {
   227	        if (!conflicts[key]) { return ''; }
   228	        var local = read(key);
   229	        return key + ':' + conflicts[key].rev + ':' + observe(key, local).hash + ':' + (decisions[key] || '');
   230	      }).join('|');
   231	      if (view.signature === signature) { return; }
   232	      view.signature = signature;
   233	      clear(view.conflicts);
   234	      keys.forEach(function (key) {
   235	        var cloud = conflicts[key];
   236	        if (!cloud) { return; }
   237	        var local = read(key), obs = observe(key, local);
   238	        var box = el('section', 'conflict');
   239	        box.appendChild(el('h3', 'conflict-title', key + '：請選擇保留哪份完整紀錄'));
   240	        box.appendChild(el('p', 'local-summary', '這台：' + summary(key, local)));
   241	        box.appendChild(el('p', 'local-time', '本機變更偵測時間：' + taipei(obs.detected, true) + '；實際作答時間由各站紀錄提供。'));
   242	        box.appendChild(el('p', 'cloud-summary', '雲端：' + summary(key, cloud.data)));
   243	        box.appendChild(el('p', 'cloud-time', '雲端更新時間：' + taipei(cloud.updated, true)));
   244	        var keepLocal = button('留這台的', function () { resolve(key, 'local'); }); keepLocal.disabled = local === null || !!decisions[key];
   245	        var keepCloud = button('留雲端的', function () { resolve(key, 'cloud'); }); keepCloud.disabled = cloud.data === null || !!decisions[key];
   246	        box.appendChild(keepLocal); box.appendChild(keepCloud); view.conflicts.appendChild(box);
   247	      });
   248	    }
   249	    function validSnapshot(r) {
   250	      return r && integer(r.rev) && (r.rev === 0 ? r.data === null && r.updated === null :
   251	        typeof r.data === 'string' && r.data.length <= 900000 && integer(r.updated));
   252	    }
   253	    function request(req, token) {
   254	      assertActive(token);
   255	      if (!options.endpoint || typeof fetcher !== 'function') { return Promise.reject(error('server')); }
   256	      if (root.navigator && root.navigator.onLine === false) { return Promise.reject(error('offline')); }
   257	      req.code = code;
   258	      return new Promise(function (done, reject) {
   259	        var settled = false;
   260	        var controller = root.AbortController ? new root.AbortController() : null;
   261	        activeAbort = controller;
   262	        var timeout = root.setTimeout(function () {
   263	          if (controller) { controller.abort(); }
   264	          finish(error('offline'));
   265	        }, 15000);
   266	        function finish(err, value) {
   267	          if (settled) { return; }
   268	          settled = true; root.clearTimeout(timeout);
   269	          if (activeAbort === controller) { activeAbort = null; }
   270	          if (err) { reject(err); } else { done(value); }
   271	        }
   272	        var config = {method: 'POST', headers: {'Content-Type': 'text/plain'}, body: JSON.stringify(req),
   273	          mode: 'cors', credentials: 'omit', redirect: 'follow', cache: 'no-store'};
   274	        if (controller) { config.signal = controller.signal; }
   275	        Promise.resolve().then(function () { return fetcher(options.endpoint, config); }).then(function (response) {
   276	          assertActive(token);
   277	          if (!response || response.ok === false || typeof response.json !== 'function') { throw error('server'); }
   278	          return Promise.resolve().then(function () { return response.json(); }).catch(function () { throw error('server'); });
   279	        }, function () { throw error('offline'); }).then(function (r) {
   280	          assertActive(token);
   281	          if (!r || (r.ok !== true && r.ok !== false)) { throw error('server'); }
   282	          if (req.op === 'get' && r.ok !== true) { throw error('server'); }
   283	          if (r.ok === false && r.err !== 'conflict') { throw error(r.err === 'too-big' ? 'too-big' : 'server'); }
   284	          if ((req.op === 'get' || r.err === 'conflict') && !validSnapshot(r)) { throw error('server'); }
   285	          if (req.op === 'put' && r.ok && (!integer(r.rev) || r.rev !== req.rev + 1 || !integer(r.updated))) { throw error('server'); }
   286	          finish(null, r);
   287	        }).catch(function (err) { finish(err); });
   288	      });
   289	    }
   290	    function showConflict(key, cloud) {
   291	      delete decisions[key]; // A newly observed cloud version requires a new choice.
   292	      conflicts[key] = {rev: cloud.rev, data: cloud.data, updated: cloud.updated};
   293	      status = '有兩份進度，請選擇要保留的紀錄。';
   294	      render();
   295	    }
   296	    function replaceLocal(key, cloud, token) {
   297	      assertActive(token);
   298	      if (cloud.data === null) { throw error('server'); }
   299	      var currentMeta = baseline(key);
   300	      if (currentMeta && currentMeta.rev > cloud.rev) { showConflict(key, cloud); return; }
   301	      // 頁面自己是唯一寫入者時（難題站，#1303 第 5 輪）：先問能不能換（有未存進度、正在某一篇裡就不行），
   302	      // 不行就什麼都不動（不備份、不寫），下一輪再 GET 再問；可以才備份，並交給頁面自己寫入與重畫（不 reload）。
   303	      if (typeof options.canReplace === 'function' && !options.canReplace(key)) {
   304	        needsGet[key] = true; deferred[key] = true; return;
   305	      }
   306	      var local = read(key);
   307	      backup(key, local);
   308	      assertActive(token);
   309	      // Synchronous read/backup/write; no awaited work between decision and replacement.
   310	      if (typeof options.accept === 'function') {
   311	        if (!options.accept(key, cloud.data)) { needsGet[key] = true; deferred[key] = true; return; }
   312	      } else { write(key, cloud.data); }
   313	      if (read(key) !== cloud.data) { throw error('storage'); }
   314	      delete deferred[key];
   315	      replaced.push(key); // Notify even if persisting the following metadata fails.
   316	      saveBaseline(key, cloud.rev, cloud.data, cloud.updated);
   317	      delete conflicts[key];
   318	    }
   319	    function put(key, data, rev, token, chosenCloud) {
   320	      if (data === null) { return Promise.resolve(); }
   321	      if (data.length > 900000) { return Promise.reject(error('too-big')); }
   322	      if (chosenCloud) { backup(key, chosenCloud.data); }
   323	      return request({op: 'put', key: key, rev: rev, data: data}, token).then(function (r) {
   324	        assertActive(token);
   325	        if (r.err === 'conflict') { showConflict(key, r); return; }
   326	        // The baseline is the exact request payload, never a newer local edit.
   327	        saveBaseline(key, r.rev, data, r.updated);
   328	        delete conflicts[key];
   329	      });
   330	    }
   331	    function reconcile(key, cloud, token) {
   332	      assertActive(token);
   333	      var local = read(key), meta = baseline(key), hash = observe(key, local).hash;
   334	      needsGet[key] = false;
   335	      if (cloud.rev === 0) {
   336	        if (local !== null) { return put(key, local, 0, token); }
   337	        saveBaseline(key, 0, null, null); return;
   338	      }
   339	      if (!meta) {
   340	        if (local === null) { replaceLocal(key, cloud, token); }
   341	        else { showConflict(key, cloud); }
   342	        return;
   343	      }
   344	      // 本機內容已經和雲端一字不差（已同步過的裝置；例如頁面寫進去了但讀回失敗，#1303 第 6 輪）。第一次加入仍照 A4 一律問：只補 baseline，不出衝突、不備份、不換
   345	      if (local !== null && local === cloud.data) { saveBaseline(key, cloud.rev, cloud.data, cloud.updated); delete conflicts[key]; return; }
   346	      if (cloud.rev < meta.rev || (cloud.rev === meta.rev && contentHash(cloud.data) !== meta.hash)) {
   347	        showConflict(key, cloud); return;
   348	      }
   349	      if (cloud.rev > meta.rev) {
   350	        if (hash === meta.hash) { replaceLocal(key, cloud, token); }
   351	        else { showConflict(key, cloud); }
   352	        return;
   353	      }
   354	      if (hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   355	    }
   356	    function resetSession(nextCode) {
   357	      epoch += 1; code = nextCode; needsGet = {}; conflicts = {}; decisions = {}; observed = {}; replaced = []; deferred = {};
   358	      failures = 0; retryAt = 0; notice = '';
   359	      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   360	      keys.forEach(function (key) { needsGet[key] = true; });
   361	      status = code ? '正在同步' : '尚未開啟同步';
   362	    }
   363	    function failure(err) {
   364	      if (err.kind === 'stale') { return; }
   365	      failures += 1;
   366	      var delay = Math.min(60000, 4000 * Math.pow(2, Math.min(failures - 1, 4)));
   367	      retryAt = now() + delay;
   368	      status = err.kind === 'offline' ? '離線中，連上網路會自動補上' : '同步失敗，稍後自動再試';
   369	      if (err.kind === 'storage' || err.name === 'QuotaExceededError') { notice = '本機儲存空間不足或無法使用，請保留原進度並檢查瀏覽器儲存設定。'; }
   370	      if (err.kind === 'too-big') { notice = '這份進度超過 900000 字元，請先保留本機資料。'; }
   371	      if (retryTimer !== null) { root.clearTimeout(retryTimer); }
   372	      retryTimer = root.setTimeout(function () { retryTimer = null; sync(); }, delay);
   373	    }
   374	    function completed() {
   375	      if (keys.some(function (key) { return !!conflicts[key]; })) {
   376	        status = '有兩份進度，請選擇要保留的紀錄。'; return;
   377	      }
   378	      var dirty = keys.some(function (key) {
   379	        var meta = baseline(key), local = read(key);
   380	        return needsGet[key] || !meta || contentHash(local) !== meta.hash;
   381	      });
   382	      status = dirty ? '等待同步本機變更' : '已同步 ' + taipei(now(), false);
   383	      if (keys.some(function (key) { return !!deferred[key]; })) { status = '雲端有較新的進度，回到首頁、存好後就會換上。'; }
   384	      if (keys.some(function (key) { var meta = baseline(key); return meta && meta.rev > 0 && read(key) === null; })) {
   385	        status = '這台的進度已移除，雲端紀錄保留；重新加入可下載。';
   386	      }
   387	    }
   388	    function run(job, force) {
   389	      if (destroyed || stopped) { return Promise.resolve(false); }
   390	      if (busy) { return busy.then(function () { return run(job, force); }); }
   391	      var token;
   392	      busy = Promise.resolve().then(function () {
   393	        var saved = read(CODE);
   394	        if (saved !== code) { resetSession(saved && normalizeCode(saved) === saved ? saved : null); }
   395	        if (!code || (!force && now() < retryAt)) { return false; }
   396	        token = epoch;
   397	        return job(token).then(function () {
   398	          assertActive(token);
   399	          failures = 0; retryAt = 0;
   400	          notice = '';
   401	          if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   402	          completed(); return true;
   403	        });
   404	      }).catch(function (err) {
   405	        if (typeof token === 'undefined' || token === epoch) { failure(err); }
   406	        return false;
   407	      }).then(function (result) {
   408	        busy = null;
   409	        try { render(); } catch (ignoreRender) { /* Storage failures may also affect conflict display. */ }
   410	        var callbacks = replaced; replaced = [];
   411	        callbacks.forEach(function (key) {
   412	          if (typeof options.onReplaced === 'function') {
   413	            try { options.onReplaced(key); } catch (ignoreCallback) { /* Host callback cannot break the scheduler. */ }
   414	          }
   415	        });
   416	        return result;
   417	      });
   418	      return busy;
   419	    }
   420	    function sync(force) {
   421	      return run(function (token) {
   422	        var chain = Promise.resolve();
   423	        var firstError = null;
   424	        keys.forEach(function (key) {
   425	          chain = chain.then(function () {
   426	            assertActive(token);
   427	            if (decisions[key]) { return applyDecision(key, token); }
   428	            if (conflicts[key]) { observe(key, read(key)); return; }
   429	            if (needsGet[key]) {
   430	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   431	            }
   432	            var local = read(key), meta = baseline(key);
   433	            if (!meta) {
   434	              needsGet[key] = true;
   435	              return request({op: 'get', key: key}, token).then(function (r) { return reconcile(key, r, token); });
   436	            }
   437	            if (observe(key, local).hash !== meta.hash && local !== null) { return put(key, local, meta.rev, token); }
   438	          }).catch(function (err) {
   439	            if (err.kind === 'stale') { throw err; }
   440	            if (!firstError) { firstError = err; }
   441	          });
   442	        });
   443	        return chain.then(function () { if (firstError) { throw firstError; } });
   444	      }, force === true);
   445	    }
   446	    function activate(newCode) {
   447	      // Clear the old baseline first. A partial storage failure then fails conservatively.
   448	      storage.removeItem(META);
   449	      write(CODE, newCode);
   450	      stopped = false; resetSession(newCode); render();
   451	      return sync(true);
   452	    }
   453	    function enable() {
   454	      if (code && !stopped) { return sync(true); }
   455	      try {
   456	        var random = options.random;
   457	        if (!random && root.crypto && root.crypto.getRandomValues) { random = root.crypto.getRandomValues.bind(root.crypto); }
   458	        if (random && typeof random !== 'function' && random.getRandomValues) { random = random.getRandomValues.bind(random); }
   459	        if (!random) { throw error('random'); }
   460	        var generated = '', tries = 0, limit = Math.floor(256 / ALPHABET.length) * ALPHABET.length;

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba src/sync.js | sed -n '70,130p;460,590p'; sed -n '1,60p;700,758p;778,850p' tests/e2e.py; cat build.py" in /Users/william/Documents/g5-help
 succeeded in 0ms:
    70	  function taipei(stamp, full) {
    71	    if (!integer(stamp)) { return '尚無紀錄'; }
    72	    // Asia/Taipei is UTC+08:00 for every timestamp produced by this app.
    73	    var d = new Date(stamp + 8 * 3600000);
    74	    var time = pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
    75	    return full ? d.getUTCFullYear() + '/' + pad(d.getUTCMonth() + 1) + '/' + pad(d.getUTCDate()) + ' ' + time + '（台北時間）' : time;
    76	  }
    77	
    78	  function init(options) {
    79	    options = options || {};
    80	    var container = options.container;
    81	    var doc = (container && container.ownerDocument) || root.document;
    82	    if (typeof container === 'string' && doc) { container = doc.querySelector(container); }
    83	    if (!container || !doc) { throw new Error('G5Sync requires a container'); }
    84	    var keys = (options.keys || KEYS).filter(function (key, i, all) { return all.indexOf(key) === i; });
    85	    if (!keys.length || keys.some(function (key) { return KEYS.indexOf(key) < 0; })) { throw new Error('G5Sync: bad-key'); }
    86	    var now = options.now || Date.now;
    87	    var fetcher = options.fetch || (root.fetch && root.fetch.bind(root));
    88	    var storage;
    89	    try { storage = options.storage || root.localStorage; } catch (ignoreStorage) { storage = null; }
    90	    var code = null, epoch = 0, destroyed = false, stopped = false;
    91	    var busy = null, activeAbort = null, retryTimer = null, failures = 0, retryAt = 0;
    92	    var needsGet = {}, conflicts = {}, decisions = {}, observed = {}, replaced = [], deferred = {};
    93	    var status = '尚未開啟同步', notice = '', viewCode, view = {};
    94	
    95	    function read(key) {
    96	      if (!storage) { throw error('storage'); }
    97	      return storage.getItem(key);
    98	    }
    99	    function write(key, value) {
   100	      if (!storage) { throw error('storage'); }
   101	      storage.setItem(key, value);
   102	    }
   103	    function blankMeta() { return {version: 1, codeHash: contentHash(code), keys: {}}; }
   104	    function readMeta() {
   105	      var raw = read(META), meta;
   106	      try { meta = JSON.parse(raw); } catch (ignore) { meta = null; }
   107	      if (!meta || meta.version !== 1 || meta.codeHash !== contentHash(code) || !meta.keys || typeof meta.keys !== 'object' || Array.isArray(meta.keys)) { return blankMeta(); }
   108	      return meta;
   109	    }
   110	    function baseline(key) {
   111	      var entry = readMeta().keys[key];
   112	      if (!entry || !integer(entry.rev) || typeof entry.hash !== 'string' || !/^sha256-utf16le:[a-f0-9]{64}$/.test(entry.hash)) { return null; }
   113	      return entry;
   114	    }
   115	    function saveBaseline(key, rev, data, updated) {
   116	      var meta = readMeta(); // Preserve other sites' key entries on the same origin.
   117	      var previous = meta.keys[key];
   118	      if (previous && integer(previous.rev) && previous.rev > rev) { needsGet[key] = true; return; }
   119	      meta.keys[key] = {rev: rev, hash: contentHash(data), updated: updated};
   120	      write(META, JSON.stringify(meta));
   121	    }
   122	    function active(token) {
   123	      return !destroyed && !stopped && token === epoch && code && read(CODE) === code;
   124	    }
   125	    function assertActive(token) { if (!active(token)) { throw error('stale'); } }
   126	    function observe(key, data) {
   127	      var hash = contentHash(data);
   128	      if (!observed[key] || observed[key].hash !== hash) { observed[key] = {hash: hash, detected: now()}; }
   129	      return observed[key];
   130	    }
   460	        var generated = '', tries = 0, limit = Math.floor(256 / ALPHABET.length) * ALPHABET.length;
   461	        while (generated.length < 12 && tries < 128) {
   462	          var bytes = new Uint8Array(32); random(bytes); tries += 1;
   463	          for (var i = 0; i < bytes.length && generated.length < 12; i += 1) {
   464	            if (bytes[i] < limit) { generated += ALPHABET.charAt(bytes[i] % ALPHABET.length); }
   465	          }
   466	        }
   467	        if (generated.length !== 12) { throw error('random'); }
   468	        return activate(generated);
   469	      } catch (err) {
   470	        status = '同步失敗，稍後自動再試';
   471	        notice = err.kind === 'random' ? '此瀏覽器無法安全產生同步碼，請使用 HTTPS 開啟網站。' : '無法儲存同步設定，請檢查瀏覽器儲存空間。';
   472	        render(); return Promise.resolve(false);
   473	      }
   474	    }
   475	    function join(value) {
   476	      var normalized = normalizeCode(value);
   477	      if (!normalized) { notice = BAD_CODE; render(); return Promise.resolve(false); }
   478	      try { return activate(normalized); }
   479	      catch (err) { failure(err); render(); return Promise.resolve(false); }
   480	    }
   481	    function applyDecision(key, token) {
   482	      var cloud = conflicts[key], choice = decisions[key], action;
   483	      if (!cloud || !choice) { delete decisions[key]; return Promise.resolve(); }
   484	      if (choice === 'local') { action = put(key, read(key), cloud.rev, token, cloud); }
   485	      else {
   486	        // Re-fetch before accepting cloud: do not silently accept a version the parent never saw.
   487	        action = request({op: 'get', key: key}, token).then(function (latest) {
   488	          if (latest.rev !== cloud.rev || latest.data !== cloud.data) { showConflict(key, latest); return; }
   489	          replaceLocal(key, latest, token);
   490	        });
   491	      }
   492	      return action.then(function () { delete decisions[key]; });
   493	    }
   494	    function resolve(key, choice) {
   495	      if (destroyed || stopped || !conflicts[key] || decisions[key] || keys.indexOf(key) < 0 || (choice !== 'local' && choice !== 'cloud')) { return Promise.resolve(false); }
   496	      decisions[key] = choice;
   497	      render();
   498	      return run(function (token) { return applyDecision(key, token); }, true);
   499	    }
   500	    function stop() {
   501	      stopped = true; epoch += 1;
   502	      if (activeAbort) { activeAbort.abort(); }
   503	      if (retryTimer !== null) { root.clearTimeout(retryTimer); retryTimer = null; }
   504	      code = null; conflicts = {}; decisions = {}; replaced = []; notice = '';
   505	      var ok = true;
   506	      try { storage.removeItem(CODE); storage.removeItem(META); }
   507	      catch (err) { ok = false; notice = '同步已暫停，但瀏覽器無法清除設定；請檢查儲存權限。'; }
   508	      status = ok ? '這台已停止同步，進度仍保留。' : '同步已暫停';
   509	      render(); return ok;
   510	    }
   511	    function visibility() { if (doc.visibilityState === 'hidden' && !stopped) { sync(true); } }
   512	    function online() { if (!stopped) { sync(true); } }
   513	    function storageEvent(event) {
   514	      if (!event || event.key === CODE || event.key === META || keys.indexOf(event.key) >= 0 || event.key === null) {
   515	        // A stop on another same-origin tab also prevents this tab's in-flight readback.
   516	        if (!stopped) { sync(); }
   517	      }
   518	    }
   519	    function hashInvitation() {
   520	      if (!root.location || !root.history) { return null; }
   521	      var parts = root.location.hash.replace(/^#/, '').split('&'), kept = [], invitation = null;
   522	      parts.forEach(function (part) {
   523	        if (/^sync=/.test(part)) {
   524	          try { invitation = decodeURIComponent(part.slice(5)); } catch (ignore) { invitation = '!'; }
   525	        } else if (part) { kept.push(part); }
   526	      });
   527	      if (invitation !== null) {
   528	        root.history.replaceState(root.history.state, '', root.location.href.split('#')[0] + (kept.length ? '#' + kept.join('&') : ''));
   529	      }
   530	      return invitation;
   531	    }
   532	    var invitation = null;
   533	    try {
   534	      invitation = hashInvitation();
   535	      var saved = read(CODE);
   536	      if (saved && normalizeCode(saved) === saved) { resetSession(saved); }
   537	      else if (saved) { notice = BAD_CODE; }
   538	    } catch (err) { status = '同步失敗，稍後自動再試'; notice = '無法讀取同步設定，原進度保留。'; }
   539	    render();
   540	    doc.addEventListener('visibilitychange', visibility);
   541	    if (root.addEventListener) { root.addEventListener('online', online); root.addEventListener('storage', storageEvent); }
   542	    var interval = root.setInterval(function () { if (!stopped) { sync(); } }, 4000);
   543	    var api = {
   544	      enable: enable, join: join, stop: stop, sync: sync, resolve: resolve, link: link,
   545	      getState: function () { return {code: code, status: status, notice: notice, conflicts: JSON.parse(JSON.stringify(conflicts)), retryAt: retryAt, failures: failures}; },
   546	      destroy: function () {
   547	        destroyed = true; epoch += 1; replaced = [];
   548	        root.clearInterval(interval); if (retryTimer !== null) { root.clearTimeout(retryTimer); }
   549	        if (activeAbort) { activeAbort.abort(); }
   550	        doc.removeEventListener('visibilitychange', visibility);
   551	        if (root.removeEventListener) { root.removeEventListener('online', online); root.removeEventListener('storage', storageEvent); }
   552	      }
   553	    };
   554	    api.ready = invitation !== null ? join(invitation) : sync();
   555	    return api;
   556	  }
   557	  return {init: init, normalizeCode: normalizeCode, contentHash: contentHash};
   558	}));
#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""五年級難題解說端到端驗收：Chromium（桌機、手機 390）＋WebKit iPad，照孩子會做的順序走完教學與練習。
第 1 篇（數學 28/42）走互動算題格式；通用 steps 格式用測試題（__G5_HARD_FIXTURE__，正式頁不會出現）驗。

跑法：python3.12 tests/e2e_math.py [--shots DIR] [--base https://windsorya.github.io/g5-sci-review/]
（--base 給正式網址時改測線上版，並加測影片播放器是否真的載入）
答案用 Python fractions 獨立算（不借用頁面裡的 G5Frac），頁面算錯就會對不上。
"""
import json
import sys
from fractions import Fraction
from math import gcd
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = sys.argv[sys.argv.index("--base") + 1].rstrip("/") + "/" if "--base" in sys.argv else ROOT.as_uri() + "/"
HOME = BASE + "index.html"
URL = HOME + "#h/p38-6-2"
SHOTS = Path(sys.argv[sys.argv.index("--shots") + 1]) if "--shots" in sys.argv else None
RESULTS = []
FIXED = [((24, 36), (35, 50)), ((27, 36), (28, 42)), ((21, 35), (16, 24)),
         ((18, 27), (28, 42)), ((36, 54), (20, 32)), ((45, 63), (32, 40))]


def check(name, cond, detail=""):
    RESULTS.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  ← {detail}"))


def shot(page, name, full=True):
    if SHOTS:
        SHOTS.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=full)


def open_page(browser, device=None, init=None, url=URL, **kw):
    ctx = browser.new_context(**(device or {}), **kw)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    if init:
        page.add_init_script(init)
    page.goto(url, wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("load", timeout=15000)
    except Exception:
        pass
    return ctx, page, errors


def last_ask(page):
    return page.locator("#lesson .ask").last


def chip(page, text):
    last_ask(page).get_by_role("button", name=text, exact=True).click()



def flow_codex_r6(browser, label="Chromium"):
    """Codex 2026-10-13 第 6 輪（4agent 後第 1 輪）三個新反例＋同寬掃描：切篇後重播畫面上「每一個」舊按鈕 handler。"""
    loads = "sessionStorage.setItem('loads',String(+(sessionStorage.getItem('loads')||0)+1));"
    # 反例 1：首頁套用雲端時 setItem 成功、緊接的讀回拋錯一次 ⇒ 記憶體與磁碟必須一致（不能磁碟 20、記憶體 8）
    seed = "if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');localStorage.setItem('g5help.v1',JSON.stringify({v:1,entries:{'p38-6-2':{solved:8,idx:8,r:1}}}));}"
    ctx, pg, errors = open_page(browser, init=loads + seed, url=HOME)
    pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
    cloud = json.dumps({"v": 1, "entries": {"p38-6-2": {"solved": 20, "idx": 20, "r": 9}}})
    r = pg.evaluate("""(c)=>{var g=Storage.prototype.getItem,s=Storage.prototype.setItem,armed=false;
      Storage.prototype.setItem=function(k,v){var x=s.call(this,k,v);if(k==='g5help.v1')armed=true;return x;};
      Storage.prototype.getItem=function(k){if(armed&&k==='g5help.v1'){armed=false;throw new Error('io');}return g.call(this,k);};
      var ok=G5HelpApplyRemote('g5help.v1',c);Storage.prototype.getItem=g;Storage.prototype.setItem=s;
      return {ok:ok,mem:G5HelpPage.state('p38-6-2').solved,disk:JSON.parse(localStorage.getItem('g5help.v1')).entries['p38-6-2'].solved};}""", cloud)
    check(f"{label} r6-1 套用雲端讀回失敗：記憶體和磁碟一致（不會之後把磁碟蓋回舊的）", r["mem"] == r["disk"], r)
    pg.evaluate("location.hash='#h/p38-6-2'"); pg.wait_for_selector("#entry:not([hidden])")
    pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob"); solve_practice(pg, *prob_text(pg))
    st = store(pg) or {}
    check(f"{label} r6-1 接著做一題：從雲端的 20 題接下去（21），不倒退成 9", st.get("solved") == r["disk"] + 1, st)
    ctx.close()
    # 反例 2：冷啟動「再讀一次」的舊 handler 在讀成功、又有未存進度後被重播 ⇒ 不能把記憶體換回磁碟版
    init = (loads + seed + "window.__rf=true;window.__wf=false;var _g=Storage.prototype.getItem,_s=Storage.prototype.setItem;"
            "Storage.prototype.getItem=function(k){if(window.__rf&&k==='g5help.v1')throw new Error('io');return _g.call(this,k);};"
            "Storage.prototype.setItem=function(k,v){if(window.__wf&&k==='g5help.v1')throw new Error('quota');return _s.call(this,k,v);};")
    ctx, pg, errors = open_page(browser, init=init)
    pg.wait_for_timeout(500)
    pg.evaluate("window.__oldRetry = document.querySelector('#readRetry') && document.querySelector('#readRetry').onclick; window.__rf=false; 0")
    pg.locator("#readRetry").click()
    pg.evaluate("window.__wf=true; 0")
    pg.locator("#goPractice").click(); pg.wait_for_selector("#practice .prob"); solve_practice(pg, *prob_text(pg))
    before = pg.evaluate("G5HelpPage.state('p38-6-2').solved")
    pg.evaluate("window.__oldRetry && window.__oldRetry(); 0")
    after = pg.evaluate("G5HelpPage.state('p38-6-2').solved")
    pg.evaluate("window.__wf=false; 0")
    pg.wait_for_function("G5HelpDirty() === 0", timeout=9000)
    disk = (store(pg) or {}).get("solved")
    check(f"{label} r6-2 重播舊的「再讀一次」：未存的那題還在（記憶體 {before}→{after}、最後存進 {disk}）", before == 9 and after == 9 and disk == 9, {"before": before, "after": after, "disk": disk})
    ctx.close()
    # 同寬掃描（含反例 3 的分數題「給我提示」）：在某一篇把教學、練習的每個按鈕 handler 都存起來，切到別篇後全部重播
    for start, other in (("p38-6-2", "t-guoyu"), ("t-guoyu", "p38-6-2")):
        ctx, pg, errors = open_page(browser, init=FIXTURE, url=HOME + "#h/" + start)
        pg.wait_for_function("window.G5HelpWriter && G5HelpWriter()")
        pg.get_by_role("button", name="開始學").click(); pg.wait_for_timeout(200)
        pg.evaluate("location.hash='#h/" + start + "'; 0") if False else None
        pg.locator("#goPractice").click(); pg.wait_for_timeout(300)
        n = pg.evaluate("""()=>{window.__stale=[];document.querySelectorAll('#lesson button, #practice button, #topBtns button').forEach(function(b){if(b.onclick)window.__stale.push([b,b.onclick]);});return window.__stale.length;}""")
        snap = pg.evaluate("(id)=>JSON.stringify(G5HelpPage.state(id))", start)
        disk0 = pg.evaluate("localStorage.getItem('g5help.v1')")
        pg.evaluate("location.hash='#h/" + other + "'"); pg.wait_for_timeout(200)
        pg.evaluate("""()=>{window.__stale.forEach(function(p){try{p[1].call(p[0],{preventDefault:function(){}});}catch(e){window.__staleErr=(window.__staleErr||[]).concat(String(e));}});}""")
        pg.wait_for_timeout(300)
        snap2 = pg.evaluate("(id)=>JSON.stringify(G5HelpPage.state(id))", start)
        disk1 = pg.evaluate("localStorage.getItem('g5help.v1')")
        errs = pg.evaluate("window.__staleErr||[]")
        check(f"{label} r6 掃描：{start} 的 {n} 個舊按鈕在切到 {other} 後重播，{start} 的紀錄（記憶體與存檔）完全不變、沒有錯誤",
              n >= 3 and snap == snap2 and disk0 == disk1 and not errs and not errors, {"n": n, "mem_same": snap == snap2, "disk_same": disk0 == disk1, "errs": errs + errors})
        check(f"{label} r6 掃描：重播後畫面仍是 {other}、沒有被舊畫面改動", other in pg.evaluate("location.hash") and pg.locator("#entry:not([hidden])").count() == 1)
        ctx.close()

def main():
    with sync_playwright() as p:
        cr = p.chromium.launch()
        if BASE.startswith("https:"):
            flow_video_live(cr, "線上Chromium")
        flow_full(cr, "桌機", {"viewport": {"width": 1280, "height": 900}}, width=1280)
        flow_full(cr, "手機390", {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True, "device_scale_factor": 2}, width=390, shots=True)
        flow_codex_r1(cr)
        flow_storage_blocked(cr)
        flow_corrupt_store(cr)
        flow_codex_help_r1(cr)
        flow_codex_help_r2(cr)
        flow_single_writer(cr, "Chromium")
        flow_codex_r4(cr)
        flow_codex_r5(cr)
        flow_codex_r6(cr)
        flow_confused(cr)
        flow_home(cr)
        flow_migrate(cr)
        flow_steps(cr, "手機390", {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True}, shots=True)
        flow_dark(cr)
        cr.close()
        wk = p.webkit.launch()
        ipad = p.devices["iPad (gen 7)"]
        flow_full(wk, "iPad", ipad, width=ipad["viewport"]["width"], shots=True)
        flow_steps(wk, "iPad", ipad)
        flow_single_writer(wk, "WebKit")
        flow_codex_r5(wk, "WebKit")
        flow_codex_r6(wk, "WebKit")
        if BASE.startswith("https:"):
            flow_video_live(wk, "線上iPad", ipad)
        wk.close()
    bad = [r for r in RESULTS if not r[1]]
    print(f"\n{len(RESULTS) - len(bad)}/{len(RESULTS)} PASS")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""把 src/app.html 包成可直接開啟的 index.html（GitHub Pages：孩子的 iPad 不登入就能開）。

src/app.html 裡的 <!--@INLINE src/x.js--> 換成那支檔的內容；判題邏輯（src/frac.js）與題目清單（src/hard.js）
同一份檔也給 node 測試用。
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HEAD = ('<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<meta name="robots" content="noindex,nofollow">'
        '<meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="apple-mobile-web-app-title" content="難題解說">'
        '</head><body>')
INLINE = re.compile(r"<!--@INLINE (src/[A-Za-z0-9_.-]+\.js)-->")


def inline(body: str) -> str:
    def sub(m: re.Match) -> str:
        js = (ROOT / m.group(1)).read_text(encoding="utf-8")
        if "</script" in js.lower():
            raise SystemExit(f"{m.group(1)} 含 </script，不能內嵌")
        return "<script>\n" + js + "\n</script>"
    out = INLINE.sub(sub, body)
    if "<!--@INLINE" in out:
        raise SystemExit("還有沒換掉的 @INLINE 標記")
    return out


def main() -> None:
    body = inline((ROOT / "src" / "app.html").read_text(encoding="utf-8"))
    (ROOT / "index.html").write_text(HEAD + body + "</body></html>", encoding="utf-8")
    print(f"built index.html ({len(body)} chars)")
    # 同步函式庫另外當獨立檔放在網站根目錄，自然站等其他站用 <script src> 載入同一份（不另抄一份）
    for name in ("sync.js", "qrcode.js"):
        (ROOT / name).write_text((ROOT / "src" / name).read_text(encoding="utf-8"), encoding="utf-8")
    print("copied sync.js, qrcode.js")


if __name__ == "__main__":
    main()

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
exec
/bin/zsh -lc 'node --test tests/*.test.js' in /Users/william/Documents/g5-help
 succeeded in 500ms:
✔ S01 A1 first-device enable and empty second-device join preserve the exact document (15.426583ms)
✔ S02 A2 polling uploads at 4000ms and reopening the first device downloads with backup (14.0255ms)
✔ S03 A3 competing edits show summaries; keep local backs up cloud and uses cloud revision (11.955583ms)
✔ S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document (11.670542ms)
✔ S05 A4 joining with two documents always prompts, even if they are byte-identical (8.416875ms)
✔ S06 A5 failure=offline preserves local progress and retries automatically (9.406041ms)
✔ S06 A5 failure=reject preserves local progress and retries automatically (7.140083ms)
✔ S06 A5 failure=html preserves local progress and retries automatically (7.277125ms)
✔ S06 A5 failure=server preserves local progress and retries automatically (7.69075ms)
✔ S06 A5 failure=http preserves local progress and retries automatically (7.562541ms)
✔ S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening (6.959875ms)
✔ S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation (4.715ms)
✔ S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator (3.670959ms)
✔ S10 A6 malformed fragment is still removed and never sent to server (0.514125ms)
✔ S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes (7.433375ms)
✔ S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty (17.900542ms)
✔ S13 multi-key sync serializes requests and preserves metadata belonging to another site (7.945458ms)
✔ S14 visibility hidden and online event immediately attempt pending work (7.625583ms)
✔ S15 backoff is exponential, capped at 60 seconds, and timers do not bypass it (12.665708ms)
✔ S16 edit while put is in flight is not falsely marked synced and is pushed on the next poll (7.930958ms)
✔ S17 edit while startup get is in flight becomes a conflict instead of being overwritten (11.136125ms)
✔ S18 stop during in-flight request cannot restore code/meta or replace local data (10.899208ms)
✔ S19 repeated conflicts keep exactly the three most recent backups, even with a fixed clock (9.289958ms)
✔ S20 quota failure writing a backup blocks replacement and cloud overwrite (7.640583ms)
✔ S21 cloud changes again while conflict is displayed; both choices require a fresh decision (16.441833ms)
✔ S22 invalid server response and malformed metadata never silently overwrite local data (3.6065ms)
✔ S23 button accessibility, text-only summaries and clipboard fallback keep sharing usable (13.660416ms)
✔ S24 first-device secure randomness has no Math.random fallback (4.846875ms)
✔ S25 hanging request times out, releases the queue and later recovers (8.537625ms)
✔ S26 existing empty-string documents, new keys and join with empty cloud upload without parsing or merging (7.5985ms)
✔ S27 a too-large key cannot starve other keys; shrinking it later recovers (132.417125ms)
✔ S28 all downloaded keys are saved before the first replacement callback can reload the page (4.172708ms)
✔ S29 same-origin stop event clears another tab panel and prevents subsequent writes (13.176ms)
✔ S30 removing a progress key locally does not delete the cloud copy or falsely claim sync (7.086625ms)
✔ S31 a committed put with lost acknowledgement becomes an explicit conflict on retry (11.635666ms)
✔ S32 switching family while a get is in flight ignores the old response and keeps a single request active (12.472375ms)
✔ S33 unresolved join conflict remains a conflict after refreshing the page (9.008167ms)
✔ S34 metadata write failure after downloading still notifies the host about changed local data (4.166041ms)
✔ S35 CommonJS export can initialize directly in Node with injected DOM owner and storage (0.559583ms)
✔ S36 an explicitly chosen local version is retried after network recovery; it never pushes before the choice (10.406125ms)
✔ S37 cloud choice retries a failed download and backs up local progress after recovery (10.634916ms)
✔ S32 頁面自己是唯一寫入者（#1303 r5）：canReplace=false 時不備份、不寫；之後允許才由 accept 寫入 (13.648375ms)
✔ S33 本機內容已經等於雲端（例如頁面寫進去了但讀回失敗）：只補 baseline，不出衝突、不再換 (11.380417ms)
✔ 時間一律用台北時間顯示 (1.38525ms)
✔ 已送出：33%，顯示最晚幾點前電腦會取回（上次取題＋10 分） (0.131458ms)
✔ 已送出但電腦比預期久沒取：不承諾時間 (0.051375ms)
✔ 製作中：沒有歷史資料先估送出後 40 分；進度依經過時間在 66→95% 間增加 (0.093875ms)
✔ 製作中：用已做好題目的實際耗時中位數估 (0.088875ms)
✔ 超過預估還沒好：95% 封頂、改說比預期久 (0.0415ms)
✔ 做好了：100%；舊資料缺時間欄也不壞 (0.046125ms)
✔ 後端狀態欄：做好時記下完成時間，舊格式 done:網址 仍讀得懂 (0.977458ms)
ℹ tests 81
ℹ suites 0
ℹ pass 81
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 590.76875

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "rg -n 'class (Dom|Node|Element)|function app\\(|const fs=require|const fs = require|classList|function match|parseHTML|function mathAnswer|node <<|node -e' docs/codex-review-r6-20261013.md | tail -45" in /Users/william/Documents/g5-help
 succeeded in 0ms:
2210:   590	      if (r.ok) { each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, r.msg); $("#pbox", P).innerHTML = sym(s.sign); $("#pbox", P).classList.add("got"); finish(); }
2211:   591	      else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, r.msg); }
2317:   697	    if (k !== q.a) { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, (q.why && q.why[k]) || "再想想看。"); return; }
2318:   698	    each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, q.ok || "對了！");
2901:   334	    if (r.ok) { each(bs, function(x){ x.disabled = true; }); b.classList.add("picked"); fb(out, true, r.msg || "對了！"); if (onOk) onOk(o.value, r); }
2902:   335	    else { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake", "tried"); fb(out, false, r.msg); }
2964:   697	    if (k !== q.a) { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, (q.why && q.why[k]) || "再想想看。"); return; }
2965:   698	    each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, q.ok || "對了！");
3468:   590	      if (r.ok) { each(bs, function(x){ x.disabled = true; }); bt.classList.add("picked"); fb(out, true, r.msg); $("#pbox", P).innerHTML = sym(s.sign); $("#pbox", P).classList.add("got"); finish(); }
3469:   591	      else { cur.wrongs++; save(); bt.classList.remove("shake"); void bt.offsetWidth; bt.classList.add("shake", "tried"); fb(out, false, r.msg); }
3858:/bin/zsh -lc "node -e 'const fs=require(\"node:fs\"),cp=require(\"node:child_process\"),crypto=require(\"node:crypto\");for(const name of [\"src/app.html\",\"src/sync.js\",\"index.html\",\"sync.js\",\"tests/e2e.py\",\"tests/harness.js\",\"tests/sync.test.js\"]){const b=fs.readFileSync(name),h=cp.execFileSync(\"git\",[\"show\",\"HEAD:\"+name],{stdio:[\"ignore\",\"pipe\",\"ignore\"]});console.log(name,crypto.createHash(\"sha256\").update(b).digest(\"hex\"),\"matches_HEAD=\"+b.equals(h));}console.log(\"published-sync-matches-source\",fs.readFileSync(\"src/sync.js\").equals(fs.readFileSync(\"sync.js\")));'" in /Users/william/Documents/g5-help
4013:function setBox(s){ var b = $("#box"); b.innerHTML = s ? sym(s) : ""; b.classList.toggle("got", !!s); b.setAttribute("aria-label", s ? "答案 " + s : "空格"); }
4130:function setBox(s){ var b = $("#box"); b.innerHTML = s ? sym(s) : ""; b.classList.toggle("got", !!s); b.setAttribute("aria-label", s ? "答案 " + s : "空格"); }
4200:/bin/zsh -lc "node -e '
4202:const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
4208: constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
4228:function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
4255:function mathAnswer(d){
4282:/bin/zsh -lc "node -e '
4284:const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
4290: constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
4310:function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
4337:function mathAnswer(d){
4413:/bin/zsh -lc "node -e '
4415:const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
4421: constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
4441:function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
4468:function mathAnswer(d){
4528:/bin/zsh -lc "REVIEW_VARIANT=previous node -e '
4529:const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
4537:/bin/zsh -lc "REVIEW_VARIANT=current node -e '
4538:const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
4656:/bin/zsh -lc "node -e '
4657:const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),crypto=require('\\''node:crypto'\\'');
4726:/bin/zsh -lc "REVIEW_VARIANT=previous node -e '
4727:const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
4735:/bin/zsh -lc "REVIEW_VARIANT=current node -e '
4736:const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
4919:/bin/zsh -lc "node -e '
4920:const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),crypto=require('\\''node:crypto'\\'');
4971:/bin/zsh -lc "node -e '
4973:const fs=require('\\''node:fs'\\''),vm=require('\\''node:vm'\\''),assert=require('\\''node:assert/strict'\\'');
4979: constructor(tag='\\''div'\\'',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='\\'''\\'';this._text='\\'''\\'';this.listeners={};this.className='\\'''\\'';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split('\\'' '\\'').concat(x))].join('\\'' '\\'');},remove(...x){self.className=self.className.split('\\'' '\\'').filter(y=>"'!x.includes(y)).join('"'\\'' '\\'');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
4999:function app({initial={},hash='\\''#h/'\\''+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
5026:function mathAnswer(d){

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'python3.12 -B tests/e2e.py' in /Users/william/Documents/g5-help
hook: PostToolUse Completed
hook: PostToolUse Completed
 exited 1 in 158ms:
Traceback (most recent call last):
  File "/Users/william/Documents/g5-help/tests/e2e.py", line 816, in <module>
    main()
  File "/Users/william/Documents/g5-help/tests/e2e.py", line 780, in main
    cr = p.chromium.launch()
         ^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/sync_api/_generated.py", line 16269, in launch
    self._sync(
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_sync_base.py", line 115, in _sync
    return task.result()
           ^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_browser_type.py", line 98, in launch
    await self._channel.send(
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/homebrew/lib/python3.12/site-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.Error: BrowserType.launch: EPERM: operation not permitted, mkdtemp '/var/folders/nf/sry6xz8x35gdnpjkkvxpxnzw0000gn/T/playwright-artifacts-utfiWd'

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import pathlib,shlex
s=pathlib.Path(\"docs/codex-review-r6-20261013.md\").read_text()
start=s.rfind('\\''/bin/zsh -lc \"node -e '\\'')
end=s.index(\" in /Users/william/Documents/g5-help\",start)
a=shlex.split(s[start:end]); b=shlex.split(a[-1]); src=b[b.index(\"-e\")+1]
print(src[:src.index(\"(async()=>\")])'" in /Users/william/Documents/g5-help
 succeeded in 0ms:

'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {Storage,Clock,Document,server,device,flush}=require('./tests/harness');
const KEY='g5help.v1', ID='p38-6-2', GID='t-guoyu', CODE='ABCDEFGHJKMN';
const html=fs.readFileSync('src/app.html','utf8');
const decode=s=>String(s).replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
class El{
 constructor(tag='div',doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.hidden=false;this.disabled=false;this.value='';this._text='';this.listeners={};this.className='';const self=this;this.classList={add(...x){self.className=[...new Set(self.className.split(' ').concat(x))].join(' ');},remove(...x){self.className=self.className.split(' ').filter(y=>!x.includes(y)).join(' ');},toggle(x,y){if(y)this.add(x);else this.remove(x);}};}
 appendChild(e){if(e.parentNode)e.parentNode.removeChild(e);this.children.push(e);e.parentNode=this;return e;}
 removeChild(e){this.children.splice(this.children.indexOf(e),1);e.parentNode=null;return e;}
 remove(){if(this.parentNode)this.parentNode.removeChild(this);}
 get firstChild(){return this.children[0]||null;}get firstElementChild(){return this.firstChild;}
 get nextElementSibling(){if(!this.parentNode)return null;return this.parentNode.children[this.parentNode.children.indexOf(this)+1]||null;}
 setAttribute(k,v){v=decode(v);this.attributes[k]=v;if(k==='class')this.className=v;if(k==='id')this.id=v;if(k==='hidden'||k==='disabled')this[k]=true;if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
 getAttribute(k){return this.attributes[k]??null;}
 set innerHTML(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text='';const stack=[this];const re=/<!--[\s\S]*?-->|<\/?([A-Za-z][\w:-]*)(?:\s+(?:"[^"]*"|'[^']*'|[^'">])*)?\/?>|([^<]+)/g;let m;while((m=re.exec(s))){if(m[0].startsWith('<!--'))continue;let cur=stack[stack.length-1];if(!m[1]){cur._text+=decode(m[2]||'');continue;}if(m[0].startsWith('</')){if(stack.length>1)stack.pop();continue;}const e=new El(m[1],this.ownerDocument);const attrs=m[0].slice(m[1].length+1,-1);for(const a of attrs.matchAll(/([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+)))?/g))e.setAttribute(a[1],a[2]??a[3]??a[4]??'');cur.appendChild(e);if(!/^(input|img|br|hr|meta|link|source|area|embed|wbr)$/i.test(m[1])&&!m[0].endsWith('/>'))stack.push(e);}}
 get innerHTML(){return this.textContent;}set textContent(s){this.children.forEach(c=>c.parentNode=null);this.children=[];this._text=String(s);}get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 descendants(){return this.children.flatMap(c=>[c,...c.descendants()]);}
 matches(s){let ok=true;s=s.replace(/\[([\w-]+)(?:=["']?([^"'\]]*)["']?)?\]/g,(_,k,v)=>{if(!Object.hasOwn(this.attributes,k)||(v!==undefined&&this.attributes[k]!==decode(v)))ok=false;return '';});s=s.replace(/#([\w-]+)/g,(_,id)=>{if(this.id!==id)ok=false;return '';});s=s.replace(/\.([\w-]+)/g,(_,c)=>{if(!this.className.split(/\s+/).includes(c))ok=false;return '';});return ok&&(!s.trim()||this.tagName===s.trim().toUpperCase());}
 querySelectorAll(sel){const parts=sel.split(',').map(s=>s.trim());return this.descendants().filter(e=>parts.some(p=>{const chain=p.split(/\s+(?![^\[]*\])/);if(!e.matches(chain.pop()))return false;let a=e.parentNode;while(chain.length){const want=chain.pop();while(a&&!a.matches(want))a=a.parentNode;if(!a)return false;a=a.parentNode;}return true;}));}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 addEventListener(t,f){(this.listeners[t]||=[]).push(f);}removeEventListener(t,f){this.listeners[t]=(this.listeners[t]||[]).filter(x=>x!==f);}
 click(){if(!this.disabled){if(this.onclick)this.onclick({preventDefault(){}});for(const f of this.listeners.click||[])f.call(this,{preventDefault(){}});}}
 scrollIntoView(){}focus(){}select(){}
}
const fixture={id:GID,date:'2026-10-13',subject:'國語',kind:'steps',source:'測試卷第 1 題',title:'測試：成語填空',question:'一（ ）不苟',steps:[{title:'先想意思',say:'做事仔細',check:{q:'哪種人',opts:['馬虎','認真'],a:1}},{title:'再想字',say:'一根頭髮'}],answer:'絲',practice:[{q:'一絲不（ ）',opts:['狗','苟'],a:1},{q:'意思',opts:['仔細','隨便'],a:0},{q:'誰',opts:['仔細的人','隨便的人'],a:0}]};
const raw=n=>JSON.stringify({v:1,entries:{[ID]:{solved:n,idx:n,streak:3,clean:n,mastered:true,lessonDone:true,r:1,seed:22}}});
function app({initial={},hash='#h/'+ID,readFail=null,writeFail=null,writer=true,storage=null}={}){
 const stg=storage||new Storage(initial), clock=new Clock(), doc=new El('document');doc.ownerDocument=doc;doc.createElement=t=>new El(t,doc);doc.getElementById=id=>doc.querySelector('#'+id);
 doc.innerHTML=html.slice(html.indexOf('<div class="wrap">'),html.indexOf('<script src='));
 const events={};let reloads=0,lockcb;const location={hash,reload(){reloads++;}};
 const d={stg,clock,doc,events,readFail,writeFail,reads:[],writes:[]};
 const baseGet=stg.getItem.bind(stg),baseSet=stg.setItem.bind(stg);
 stg.getItem=k=>{d.reads.push(k);if(d.readFail&&d.readFail(k))throw new Error('get-fail');return baseGet(k);};
 stg.setItem=(k,v)=>{d.writes.push([k,v]);if(d.writeFail&&d.writeFail(k,v))throw new Error('set-fail');baseSet(k,v);};
 const w={document:doc,location,localStorage:stg,scrollTo(){},matchMedia:()=>({matches:true}),__G5_HARD_FIXTURE__:[fixture],
  navigator:{locks:{request(name,opts,cb){if(typeof opts==='function')return new Promise(()=>{});lockcb=cb;return new Promise(()=>{});}}},
  addEventListener(t,f){(events[t]||=[]).push(f);},removeEventListener(){},dispatchEvent(e){for(const f of events[e.type]||[])f(e);},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout,setInterval:clock.setInterval,clearInterval:clock.clearInterval};
 const ctx={window:w,document:doc,navigator:w.navigator,location,localStorage:stg,console,Event:class{constructor(type){this.type=type;}},setTimeout:clock.setTimeout,clearTimeout:clock.clearTimeout};
 vm.createContext(ctx);
 for(const f of ['src/frac.js','src/hard.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
 const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
 // Expose only references for observations; all application function bodies run unchanged.
 const exposed=script.replace('window.G5HelpPage =','window.__review={save,route,retryRead,openPractice,startLesson,get:()=>({DB,st,E,READY,WRITER,GEN})};window.G5HelpPage =');
 vm.runInContext(exposed,ctx,{filename:'src/app.html'});
 // Real sync wiring is evaluated against a capture-only init; real sync is tested separately with shared storage.
 w.G5Sync={init:o=>{d.syncOptions=o;return {};}};
 vm.runInContext([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][1][1],ctx,{filename:'src/app.html-sync-wiring'});
 lockcb(writer?{}:null);
 Object.assign(d,{w,ctx,q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),go(id){location.hash=id?'#h/'+id:'';w.dispatchEvent(new ctx.Event('hashchange'));},disk:()=>JSON.parse(baseGet(KEY)||'null'),peek:baseGet,reloads:()=>reloads});
 return d;
}
function check(name,fn){const out=fn();console.log('PASS',name,JSON.stringify(out??true));}
const gcd=(a,b)=>b?gcd(b,a%b):a;
function mathAnswer(d){
 const st=d.w.G5HelpPage.state(ID),p=d.w.G5Frac.problem(st.idx,st.seed);
 const a={n:p.a.n/gcd(p.a.n,p.a.d),d:p.a.d/gcd(p.a.n,p.a.d)},b={n:p.b.n/gcd(p.b.n,p.b.d),d:p.b.d/gcd(p.b.n,p.b.d)};
 for(const [k,v]of Object.entries({'a.n':a.n,'a.d':a.d,'b.n':b.n,'b.d':b.d}))d.q('#r1 input[data-k="'+k+'"]').value=String(v);
 d.q('#r1 button[data-check]').click();
 const l=a.d*b.d/gcd(a.d,b.d);
 for(const [k,v]of Object.entries({'c.n':a.n*l/a.d,'c.d':l,'e.n':b.n*l/b.d,'e.d':l}))d.q('#r2 input[data-k="'+k+'"]').value=String(v);
 d.q('#r2 button[data-check]').click();
 const sign=a.n*b.d===b.n*a.d?'=':a.n*b.d>b.n*a.d?'>':'<',button=d.all('#r3 .chip').find(b=>b.dataset.s===sign);
 const fn=button.onclick;button.click();return {fn,button};
}
function choose(d){const s=d.w.G5HelpPage.state(GID),b=d.q('#practice .chip[data-k="'+fixture.practice[s.idx%3].a+'"]');const fn=b.onclick;b.click();return {fn,b};}



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import pathlib,shlex
s=pathlib.Path(\"docs/codex-review-r6-20261013.md\").read_text()
start=s.rfind('\\''/bin/zsh -lc \"node -e '\\'')
end=s.index(\" in /Users/william/Documents/g5-help\",start)
a=shlex.split(s[start:end]); b=shlex.split(a[-1]); src=b[b.index(\"-e\")+1]
base=src[:src.index(\"(async()=>\")]
import subprocess
r=subprocess.run([\"node\",\"-e\",base+\"const d=app(); console.log('\\''boot'\\'',d.w.G5HelpWriter(),d.q('\\''#goPractice'\\'')?.tagName);\"],text=True,capture_output=True)
print(r.stdout);print(r.stderr);raise SystemExit(r.returncode)'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
boot true BUTTON



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '82,143p' tests/e2e.py; sed -n '1,135p' tests/harness.js; sed -n '1,100p' tests/sync.test.js; nl -ba src/app.html | sed -n '454,530p;835,891p'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
def walk_lesson(page, label, mistakes=True):
    page.get_by_role("button", name="開始學").click()
    # 1 先看分母：直接比分子是錯的方法
    check(f"{label} 第1步列出 45 的倍數到 630（14 個）", page.locator("#lesson .mults span").count() == 14 and
          page.locator("#lesson .mults span.hit").inner_text() == "630")
    if mistakes:
        chip(page, "直接比分子，28 比 27 大")
        check(f"{label} 第1步選「直接比分子」被擋並說明", "分子大的不一定比較大" in fb_text(page), fb_text(page))
    chip(page, "先約分：分子分母一起除以同一個數")
    # 2 約分 28/42：先試 3（錯）→ 2 → 太早說不能再約（錯）→ 7 → 不能再約
    if mistakes:
        chip(page, "一起除以 3")
        check(f"{label} 選 3：用乘法表說明 28 不能被 3 整除", "3 × 9 = 27、3 × 10 = 30，中間沒有 28" in fb_text(page), fb_text(page))
    chip(page, "一起除以 2")
    if mistakes:
        fill_nums(page, [13, 21])
        check(f"{label} 28÷2 填 13 被擋並給提示", "2 × 多少 = 28" in fb_text(page), fb_text(page))
    fill_nums(page, [14, 21])
    if mistakes:
        chip(page, "不能再約了")
        check(f"{label} 14/21 說不能再約被擋（7 的乘法表）", "7 的乘法表" in fb_text(page), fb_text(page))
    chip(page, "一起除以 7")
    fill_nums(page, [2, 3])
    chip(page, "不能再約了")
    s2 = page.locator('#lesson section[data-step="2"]').inner_text()
    check(f"{label} 第2步出現 28/42 = 14/21 = 2/3 與「一次除以 14」", "也可以一次除以 14" in s2 and "2 × 7" in s2, s2[-300:])
    check(f"{label} 第2步長條圖：42 格、粗線 2 條、3 大塊塗 2 塊",
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("rect").count() == 43 and
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(0).locator("line").count() == 2 and
          page.locator('#lesson section[data-step="2"] svg.fbar').nth(1).locator("rect").count() == 4)
    # 3 約分 27/45：一次除以 9
    chip(page, "一起除以 9")
    fill_nums(page, [3, 5])
    chip(page, "不能再約了")
    # 4 通分：先填 30（公倍數但不是最小）
    if mistakes:
        fill_nums(page, [30])
        check(f"{label} 最小公倍數填 30：說是公倍數但還有更小的", "還有更小的" in fb_text(page), fb_text(page))
    fill_nums(page, [15])
    fill_nums(page, [5])
    fill_nums(page, [10])
    fill_nums(page, [3])
    fill_nums(page, [9])
    s4 = page.locator('#lesson section[data-step="4"]').inner_text()
    check(f"{label} 第4步得到 10/15 與 9/15", "10\n15" in s4 and "9\n15" in s4, s4[-200:])
    # 5 比大小
    if mistakes:
        chip(page, "<")
        check(f"{label} 10/15 ○ 9/15 選 < 被擋", "哪個多" in fb_text(page), fb_text(page))
    chip(page, ">")
    chip(page, ">")
    check(f"{label} 題目的□填上 >", page.locator("#box").inner_text().strip() == ">")
    # 6 寫進習作
    if mistakes:
        chip(page, "先通分，再約分")
        check(f"{label} 順序選錯被擋（提到 630）", "630" in fb_text(page), fb_text(page))
    chip(page, "先約分，再通分")
    check(f"{label} 教學完成：出現「換你自己做一題」、存檔 lessonDone", page.locator("#toPractice").is_visible() and (store(page) or {}).get("lessonDone") is True)


def answers(a, b):
    sa, sb = Fraction(*a), Fraction(*b)
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const core = require('../gas/core');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const flush = () => new Promise(resolve => setImmediate(resolve));

class Storage {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); this.fail = null; }
  get length() { return this.data.size; }
  key(i) { return [...this.data.keys()][i] || null; }
  getItem(key) { return this.data.has(String(key)) ? this.data.get(String(key)) : null; }
  setItem(key, value) {
    if (this.fail && this.fail(key, value)) {
      const error = new Error('private storage error'); error.name = 'QuotaExceededError'; throw error;
    }
    this.data.set(String(key), String(value));
  }
  removeItem(key) { this.data.delete(String(key)); }
  dump() { return Object.fromEntries(this.data); }
}
class Events {
  constructor() { this.listeners = {}; }
  addEventListener(type, listener) { (this.listeners[type] ||= new Set()).add(listener); }
  removeEventListener(type, listener) { this.listeners[type]?.delete(listener); }
  dispatch(type, event = {}) { for (const fn of this.listeners[type] || []) { fn(event); } }
}
class Element extends Events {
  constructor(tag, ownerDocument) {
    super(); this.tagName = tag.toUpperCase(); this.ownerDocument = ownerDocument;
    this.children = []; this.style = {}; this.attributes = {}; this._text = ''; this._html = '';
    this.value = ''; this.hidden = false; this.disabled = false;
  }
  get firstChild() { return this.children[0] || null; }
  appendChild(node) { this.children.push(node); return node; }
  removeChild(node) { this.children.splice(this.children.indexOf(node), 1); return node; }
  set textContent(text) { this._text = String(text); this.children = []; this._html = ''; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set innerHTML(html) { this._html = String(html); this.children = []; this._text = ''; }
  get innerHTML() { return this._html; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.ownerDocument.activeElement = this; }
  select() { this.selected = true; }
  click() { if (!this.disabled) this.dispatch('click', {preventDefault() {}}); }
}
class Document extends Events {
  constructor() { super(); this.visibilityState = 'visible'; this.container = new Element('div', this); }
  createElement(tag) { return new Element(tag, this); }
  querySelector(selector) { return selector === '#sync' ? this.container : null; }
}
function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function byClass(device, name) { return descendants(device.doc.container).filter(node => node.className === 'g5s-' + name); }
function click(device, text) {
  const b = descendants(device.doc.container).find(node => node.tagName === 'BUTTON' && node.textContent === text);
  assert.ok(b, `Missing button: ${text}`); b.click(); return b;
}
class Clock {
  constructor(start = Date.UTC(2026, 9, 13, 0, 0, 0)) { this.time = start; this.next = 1; this.tasks = new Map(); }
  now = () => this.time;
  setTimeout = (fn, delay) => { const id = this.next++; this.tasks.set(id, {fn, at: this.time + delay, repeat: 0}); return id; };
  clearTimeout = id => this.tasks.delete(id);
  setInterval = (fn, delay) => { const id = this.setTimeout(fn, delay); this.tasks.get(id).repeat = delay; return id; };
  clearInterval = this.clearTimeout;
  async advance(ms) {
    const target = this.time + ms;
    for (let n = 0; n < 10000; n++) {
      const [id, job] = [...this.tasks].filter(([, item]) => item.at <= target).sort((a, b) => a[1].at - b[1].at)[0] || [];
      if (!job) { this.time = target; await flush(); return; }
      this.time = job.at;
      if (job.repeat) job.at += job.repeat; else this.tasks.delete(id);
      job.fn(); await flush();
    }
    throw new Error('Fake clock runaway');
  }
}
function makeStore() {
  const rows = new Map(); let locked = false;
  const store = {
    rows, events: [], hash,
    withLock(fn) {
      assert.equal(locked, false); locked = true; this.events.push('lock');
      try { return fn(); } finally { locked = false; this.events.push('unlock'); }
    },
    get(h, key) {
      assert.ok(locked); this.events.push('get');
      const row = rows.get(h + '|' + key); return row ? core.fromRow(row) : null;
    },
    set(h, key, record) {
      assert.ok(locked); this.events.push('set'); rows.set(h + '|' + key, core.toRow(h, key, record));
    },
    record(code, key = 'g5sci.v3') { const row = rows.get(hash(code) + '|' + key); return row ? core.fromRow(row) : null; }
  };
  return store;
}
function server(clock, store = makeStore()) {
  return {clock, store, handle(req) { return core.handle(store, req, clock.now); }};
}
function device(server, options = {}) {
  const clock = options.clock || server.clock, doc = new Document(), events = new Events();
  const storage = options.storage || new Storage(options.initial);
  let href = options.href || 'https://windsorya.github.io/g5-sci-review/';
  const location = {get href() { return href; }, get hash() { return new URL(href).hash; }};
  const history = {state: {keep: 1}, calls: [], replaceState(state, title, url) { this.calls.push({state, url}); href = url; }};
  const d = {clock, doc, storage, history, calls: [], replacements: [], qrLinks: [], active: 0, maxActive: 0, mode: 'ok', held: null};
  const window = Object.assign(events, {
    document: doc, location, history, navigator: {onLine: true}, localStorage: storage,
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout, setInterval: clock.setInterval, clearInterval: clock.clearInterval,
    crypto: {getRandomValues(array) { crypto.randomFillSync(array); return array; }}, AbortController
  });
  const sandbox = {window, module: {exports: {}}, Uint8Array, Promise, Date, console};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/qrcode.js'), 'utf8'), sandbox, {filename: 'qrcode.js'});
  const qrFactory = sandbox.qrcode; // Browser-global build; no CommonJS `exports` in this VM.
  window.qrcode = (type, level) => {
    const qr = qrFactory(type, level), add = qr.addData;
    qr.addData = data => { d.qrLinks.push(data); return add(data); }; return qr;
  };
  sandbox.module = {exports: {}};
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/sync.js'), 'utf8'), sandbox, {filename: 'sync.js'});
  const fetch = (url, config) => {
    d.active++; d.maxActive = Math.max(d.maxActive, d.active);
    const req = JSON.parse(config.body); d.calls.push({url, config, req, at: clock.now()});
    let pending;
    if (options.fetch) pending = Promise.resolve().then(() => options.fetch(req, config, d));
    else if (d.mode === 'reject') pending = Promise.reject(new TypeError('secret network details'));
    else if (d.mode === 'html') pending = Promise.resolve({ok: true, json() { return Promise.reject(new SyntaxError('<html>private</html>')); }});
    else if (d.mode === 'server') pending = Promise.resolve({ok: true, json: async () => ({ok: false, err: 'server'})});
    else if (d.mode === 'http') pending = Promise.resolve({ok: false, json: async () => ({})});
    else if (d.mode === 'hold') pending = new Promise((resolve, reject) => {
      d.held = () => resolve({ok: true, json: async () => server.handle(req)});
      config.signal?.addEventListener('abort', () => reject(new Error('abort')));
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const G5Sync = require('../src/sync');
const {Storage, Clock, Document, server, device, flush, byClass, descendants, click} = require('./harness');
const KEY = 'g5sci.v3', CODE = 'ABCDEFGHJKMN';
const data = n => JSON.stringify({n});
function backups(d, key = KEY) { return Object.entries(d.storage.dump()).filter(([name]) => name.startsWith('g5sync.backup.' + key + '.')); }
async function pair(t) {
  const clock = new Clock(), backend = server(clock);
  const a = device(backend, {initial: {[KEY]: data(1)}});
  const b = device(backend);
  t.after(() => { a.api.destroy(); b.api.destroy(); });
  await Promise.all([a.api.ready, b.api.ready]); await a.api.enable();
  const code = a.api.getState().code; await b.api.join(code);
  return {clock, backend, a, b, code};
}

test('S01 A1 first-device enable and empty second-device join preserve the exact document', async t => {
  const {backend, a, b, code} = await pair(t);
  assert.equal(backend.store.record(code).rev, 1); assert.equal(backend.store.rows.size, 1);
  assert.equal(backend.store.record(code).data, a.storage.getItem(KEY));
  assert.equal(b.storage.getItem(KEY), data(1)); assert.deepEqual(b.replacements, [KEY]);
  assert.equal(JSON.parse(b.storage.getItem('g5sync.meta')).keys[KEY].rev, 1);
  assert.equal(b.api.getState().status, '已同步 08:00');
  assert.match(code, /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/);
});

test('S02 A2 polling uploads at 4000ms and reopening the first device downloads with backup', async t => {
  const {clock, backend, a, b, code} = await pair(t);
  b.storage.setItem(KEY, data(12));
  await clock.advance(3999); assert.equal(backend.store.record(code).rev, 1);
  await clock.advance(1); assert.equal(backend.store.record(code).rev, 2); assert.equal(backend.store.record(code).data, data(12));
  a.api.destroy(); const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy());
  await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(12)); assert.deepEqual(reopen.replacements, [KEY]);
  assert.equal(backups(reopen)[0][1], data(1));
});

test('S03 A3 competing edits show summaries; keep local backs up cloud and uses cloud revision', async t => {
  const {backend, a, b, code} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20));
  await a.api.sync(); await b.api.sync();
  assert.equal(backend.store.record(code).data, data(10)); assert.equal(b.api.getState().conflicts[KEY].rev, 2);
  assert.equal(byClass(b, 'local-summary')[0].textContent, '這台：練過 20 題');
  assert.equal(byClass(b, 'cloud-summary')[0].textContent, '雲端：練過 10 題');
  assert.match(byClass(b, 'cloud-time')[0].textContent, /2026\/10\/13 08:00（台北時間）/);
  const count = b.calls.length; await b.api.sync(); assert.equal(b.calls.length, count);
  click(b, '留這台的'); await flush();
  assert.equal(backend.store.record(code).data, data(20)); assert.equal(backend.store.record(code).rev, 3);
  assert.equal(backups(b)[0][1], data(10)); assert.equal(Object.keys(b.api.getState().conflicts).length, 0);
  a.api.destroy(); const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(20)); assert.equal(backups(reopen)[0][1], data(10));
});

test('S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document', async t => {
  const {backend, a, b} = await pair(t);
  a.storage.setItem(KEY, data(10)); b.storage.setItem(KEY, data(20));
  await a.api.sync(); await b.api.sync(); await b.api.resolve(KEY, 'local');
  a.storage.setItem(KEY, data(11)); a.api.destroy();
  const reopen = device(backend, {storage: a.storage}); t.after(() => reopen.api.destroy()); await reopen.api.ready;
  assert.equal(reopen.storage.getItem(KEY), data(11)); assert.ok(reopen.api.getState().conflicts[KEY]);
  click(reopen, '留雲端的'); await flush();
  assert.equal(reopen.storage.getItem(KEY), data(20)); assert.equal(backups(reopen)[0][1], data(11));
  assert.deepEqual(reopen.replacements, [KEY]);
});

test('S05 A4 joining with two documents always prompts, even if they are byte-identical', async t => {
  for (const local of [data(1), data(99)]) {
    const clock = new Clock(), backend = server(clock);
    backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
    const d = device(backend, {initial: {[KEY]: local}}); t.after(() => d.api.destroy()); await d.api.ready;
    await d.api.join(CODE);
    assert.ok(d.api.getState().conflicts[KEY]); assert.equal(d.storage.getItem(KEY), local);
    assert.equal(backend.store.record(CODE).rev, 1); assert.equal(d.calls.filter(c => c.req.op === 'put').length, 0);
    assert.deepEqual(d.replacements, []);
  }
});

for (const mode of ['offline', 'reject', 'html', 'server', 'http']) {
  test('S06 A5 failure=' + mode + ' preserves local progress and retries automatically', async t => {
    const {clock, backend, b, code} = await pair(t);
    b.storage.setItem(KEY, data(31));
    if (mode === 'offline') b.window.navigator.onLine = false; else b.mode = mode;
    const before = b.storage.getItem(KEY); await b.api.sync();
    assert.equal(b.storage.getItem(KEY), before); assert.equal(backend.store.record(code).rev, 1);
    const expected = ['offline', 'reject'].includes(mode) ? '離線中，連上網路會自動補上' : '同步失敗，稍後自動再試';
    assert.equal(b.api.getState().status, expected); assert.equal(byClass(b, 'status')[0].textContent, expected);
    b.mode = 'ok'; b.window.navigator.onLine = true;
    await clock.advance(4000);
    assert.equal(backend.store.record(code).data, before); assert.equal(backend.store.record(code).rev, 2);
    assert.match(b.api.getState().status, /^已同步 /);
  });
}

test('S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening', async t => {
  const clock = new Clock(), backend = server(clock);
  backend.handle({op: 'put', code: CODE, key: KEY, rev: 0, data: data(1)});
  const d = device(backend, {initial: {[KEY]: data(2)}, endpoint: ''}); t.after(() => d.api.destroy());
   454	function convert(b, f, L, done){
   455	  var m = L / f.d;
   456	  numsAsk(b, fr(f) + ' 要變成分母 ' + L + '：分母 ' + f.d + ' 要乘多少？', [
   457	    {pre:f.d + " ×", post:"= " + L, ans:m, hint:f.d + " 的乘法表裡，哪一個是 " + L + "？", aria:f.d + " 乘多少等於 " + L}
   458	  ], function(){
   459	    numsAsk(b, '分母乘 ' + m + '，分子也要乘 ' + m + '：', [
   460	      {pre:f.n + " × " + m + " =", ans:f.n * m, hint:"", aria:f.n + " 乘 " + m}
   461	    ], function(){
   462	      var e = {n:f.n * m, d:L};
   463	      add(b, '<div class="eq">' + fr(f) + ' = ' + frx(f, m) + ' = ' + fr(e) + '</div>');
   464	      done(e);
   465	    });
   466	  });
   467	}
   468	function step4(){
   469	  var sa = SOL.sa, sb = SOL.sb, L = SOL.lcm;
   470	  var b = stepCard(4, "再通分 " + F.txt(sa) + " 和 " + F.txt(sb));
   471	  add(b, '<p>約分以後，題目變成 ' + fr(sa) + ' 和 ' + fr(sb) + '。分母 ' + sa.d + ' 和 ' + sb.d + ' 還是不一樣，現在才通分——數字小多了！</p>');
   472	  numsAsk(b, sa.d + ' 和 ' + sb.d + ' 的最小公倍數是多少？', [{pre:"", ans:L, aria:"最小公倍數", check:function(v){
   473	    if (v === L) return {ok:true};
   474	    if (v <= 0) return {ok:false, msg:"要找比 0 大的公倍數：從 " + sa.d + " 的倍數和 " + sb.d + " 的倍數裡，找第一個一樣的數。"};
   475	    if (v % sa.d === 0 && v % sb.d === 0) return {ok:false, msg:v + " 也是 " + sa.d + " 和 " + sb.d + " 的公倍數，但還有更小的，再找找看。"};
   476	    var ma = [], mb = []; for (var i = 1; i <= L / sa.d + 1; i++) ma.push(sa.d * i); for (var j = 1; j <= L / sb.d + 1; j++) mb.push(sb.d * j);
   477	    return {ok:false, msg:sa.d + " 的倍數：" + ma.join("、") + "…；" + sb.d + " 的倍數：" + mb.join("、") + "…。第一個兩邊都有的數，就是最小公倍數。"};
   478	  }}], function(){
   479	    convert(b, sa, L, function(ea){
   480	      convert(b, sb, L, function(eb){
   481	        add(b, '<div class="pic"><div class="cap">' + F.txt(sa) + ' 的每 1 大塊再切成 ' + (L / sa.d) + ' 小格，就是 ' + F.txt(ea) + '：</div>' +
   482	          bar(sa.n, sa.d, {label:F.txt(sa)}) + bar(ea.n, L, {group:L / sa.d, label:F.txt(ea)}) +
   483	          '<div class="cap">' + F.txt(sb) + ' 的每 1 大塊再切成 ' + (L / sb.d) + ' 小格，就是 ' + F.txt(eb) + '：</div>' +
   484	          bar(sb.n, sb.d, {c:"b", label:F.txt(sb)}) + bar(eb.n, L, {c:"b", group:L / sb.d, label:F.txt(eb)}) + '</div>');
   485	        step5(ea, eb);
   486	      });
   487	    });
   488	  });
   489	}
   490	function step5(ea, eb){
   491	  var b = stepCard(5, "比大小");
   492	  add(b, '<p>現在兩個分數的分母都是 ' + ea.d + '，就像兩條一樣長的巧克力都切成 ' + ea.d + ' 小塊，比誰拿的塊數多。</p>' +
   493	    '<div class="pic"><div class="cap">' + F.txt(ea) + '：塗 ' + ea.n + ' 格</div>' + bar(ea.n, ea.d, {label:F.txt(ea)}) +
   494	    '<div class="cap">' + F.txt(eb) + '：塗 ' + eb.n + ' 格</div>' + bar(eb.n, eb.d, {c:"b", label:F.txt(eb)}) + '</div>');
   495	  var s1 = F.cmp(ea, eb);
   496	  chipsAsk(b, fr(ea) + ' ○ ' + fr(eb) + '，○ 裡要填什麼？', SIGNS, function(v){
   497	    return v === s1 ? {ok:true, msg:"對！分母一樣，比分子：" + (s1 === ">" ? ea.n + " 比 " + eb.n + " 大，所以 " + F.txt(ea) + " 比較大。" : s1 === "<" ? ea.n + " 比 " + eb.n + " 小，所以 " + F.txt(eb) + " 比較大。" : "分子一樣，所以兩個一樣大。")} : {ok:false, msg:"看塗色的格子：" + ea.n + " 格和 " + eb.n + " 格，哪個多？"};
   498	  }, function(){
   499	    chipsAsk(b, '所以 ' + fr(A) + ' ○ ' + fr(B) + '？', SIGNS, function(v){
   500	      return v === SOL.sign ? {ok:true, msg:F.txt(A) + " 和 " + F.txt(ea) + " 一樣大、" + F.txt(B) + " 和 " + F.txt(eb) + " 一樣大，所以答案一樣是「" + SOL.sign + "」。"} :
   501	        {ok:false, msg:F.txt(A) + " = " + F.txt(ea) + "，" + F.txt(B) + " = " + F.txt(eb) + "。剛剛比出來哪個大？"};
   502	    }, function(){ setBox(SOL.sign); step6(ea, eb); }, "sign");
   503	  }, "sign");
   504	}
   505	function step6(ea, eb){
   506	  var b = stepCard(6, "寫進習作");
   507	  add(b, '<p>照這樣寫在習作上，跟你第①題的寫法一樣：</p>' +
   508	    '<div class="note"><div class="ln">' + fr(A) + ' = ' + fr(SOL.sa) + ' = ' + fr(ea) + '，</div>' +
   509	    '<div class="ln">' + fr(B) + ' = ' + fr(SOL.sb) + ' = ' + fr(eb) + '</div>' +
   510	    '<div class="ln">' + fr(ea) + ' ' + sym(SOL.sign) + ' ' + fr(eb) + '　∴ ' + fr(A) + ' ' + sym(SOL.sign) + ' ' + fr(B) + '</div></div>');
   511	  chipsAsk(b, '最後確認：遇到分母很大的分數比大小，順序是？', [
   512	    {label:"先通分，再約分", value:"x"}, {label:"先約分，再通分", value:"ok"}, {label:"直接比分子", value:"n"}
   513	  ], function(v){
   514	    if (v === "ok") return {ok:true, msg:"對！先約分讓數字變小（大小不變），再通分，最後比分子。"};
   515	    if (v === "x") return {ok:false, msg:"先通分的話，要用 " + SOL.rawLcm + " 那麼大的數。先把數字變小比較好算。"};
   516	    return {ok:false, msg:"分母不一樣時，不能直接比分子。"};
   517	  }, function(){
   518	    add(b, '<details class="alt"><summary>另一種做法：直接通分（答案一樣，但數字很大）</summary><div class="eq">' +
   519	      fr(A) + ' = ' + frx(A, SOL.rawLcm / A.d) + ' = ' + fr({n:A.n * SOL.rawLcm / A.d, d:SOL.rawLcm}) + '</div><div class="eq">' +
   520	      fr(B) + ' = ' + frx(B, SOL.rawLcm / B.d) + ' = ' + fr({n:B.n * SOL.rawLcm / B.d, d:SOL.rawLcm}) + '</div><p class="tip">' +
   521	      (A.n * SOL.rawLcm / A.d) + ' ' + sym(SOL.sign) + ' ' + (B.n * SOL.rawLcm / B.d) + '，答案也是「' + SOL.sign + '」。可是要算 ' + A.n + ' × ' + (SOL.rawLcm / A.d) + '、' + B.n + ' × ' + (SOL.rawLcm / B.d) + '，比先約分辛苦很多。</p></details>');
   522	    var go = add(b, '<div class="row"><button class="btn" type="button" id="toPractice">換你自己做一題</button></div>');
   523	    st.lessonDone = true; save(); drawTopBtns();
   524	    $("#toPractice", go).onclick = guard(function(){ openPractice(); });
   525	  });
   526	}
   527	
   528	// ---------- 練習 ----------
   529	function fin(key){ return '<span class="fin"><input class="num" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done" autocomplete="off" data-k="' + key + '.n" aria-label="' + (key[0] === "a" ? "左邊" : "右邊") + '分子"><i></i><input class="num" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="done" autocomplete="off" data-k="' + key + '.d" aria-label="' + (key[0] === "a" ? "左邊" : "右邊") + '分母"></span>'; }
   530	function readFrac(box, key){
   835	        return '<div class="hcard"><b>' + it.subject + '・' + String(it.note || "").replace(/[<>&]/g, "") + '</b><span class="meta">' + hhmm(it.time) + ' 送出</span>' + barH + '<span class="st' + (it.status === "done" ? " done" : "") + '">' + st + '</span></div>';
   836	      }).join("") : '<span class="empty">還沒有傳過題目。</span>';
   837	    }).catch(function(){ $("#upHealth").textContent = "進度暫時讀不到（可能沒有網路），稍後再看。"; });
   838	  }
   839	  $("#upBox").addEventListener("toggle", function(){ if ($("#upBox").open) loadMine(); });
   840	  setInterval(function(){ if ($("#upBox").open) loadMine(); }, 60000);
   841	  $("#upSend").onclick = function(){
   842	    var code = null; try { code = localStorage.getItem("g5sync.code"); } catch (e) {}
   843	    if (!code) return msg("請先在下面「跨裝置同步」開啟或加入同步，這台裝置才能送題目。", true);
   844	    var f = $("#upFile").files[0]; if (!f) return msg("請先選一張照片。", true);
   845	    var btn = this; btn.disabled = true; msg("照片處理中…");
   846	    shrink(f).then(function(img){
   847	      msg("送出中…");
   848	      return fetch(EP, {method:"POST", headers:{"Content-Type":"text/plain"}, credentials:"omit", body:JSON.stringify({op:"upload", code:code, subject:$("#upSubj").value, note:$("#upNote").value.slice(0,500), image:img})}).then(function(r){ return r.json(); });
   849	    }).then(function(r){
   850	      if (r && r.ok) { msg("送出了！下方「你傳的題目」可以看進度；做好的解說會出現在上面「" + $("#upSubj").value + "」那一科。"); $("#upFile").value = ""; $("#upNote").value = ""; loadMine(); }
   851	      else msg(r && r.err === "no-family" ? "這組同步碼在雲端還沒有紀錄，請先在這台裝置開啟同步一次。" : "沒有送成功，請稍後再試一次。", true);
   852	    }).catch(function(e){ msg(e && e.message === "big" ? "照片太大，請換一張或截圖成小一點再送。" : "沒有送成功（可能沒有網路），請稍後再試一次。", true); })
   853	    .then(function(){ btn.disabled = false; });
   854	  };
   855	})();
   856	</script>

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[████░░░░░░] 40%｜基礎測試已完成｜Node 測試 81／81 通過；e2e 啟動 Chromium 時遭沙箱拒絕 `mkdtemp`。正在用記憶體替身重播原反例，並檢查同步衝突按鈕是否也會拒絕舊操作。

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import pathlib,shlex
s=pathlib.Path(\"docs/codex-review-r6-20261013.md\").read_text()
start=s.rfind('\\''/bin/zsh -lc \"node -e '\\'')
end=s.index(\" in /Users/william/Documents/g5-help\",start)
a=shlex.split(s[start:end]); b=shlex.split(a[-1]); src=b[b.index(\"-e\")+1]
base=src[:src.index(\"(async()=>\")]
import subprocess
r=subprocess.run(['\\''node'\\'','\\''-e'\\'',base+\"\\n(async()=>{\\n const Sync=require('\\''./src/sync'\\'');\\n const makeMeta=(rev,data)=>JSON.stringify({version:1,codeHash:Sync.contentHash(CODE),keys:{[KEY]:{rev,hash:Sync.contentHash(data),updated:1}}});\\n for(const readafter of ['\\''normal'\\'','\\''throw-once'\\'']){\\n  const clock=new Clock(), backend=server(clock),local=raw(8),cloud=raw(20);\\n  backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:0,data:local});\\n  backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:1,data:cloud});\\n  const a=app({hash:'\\'''\\'',initial:{[KEY]:local,'\\''g5sync.code'\\'':CODE,'\\''g5sync.meta'\\'':makeMeta(1,local)}});\\n  let fail=false;a.writeFail=(k,v)=>{if(k===KEY&&v===cloud&&readafter==='\\''throw-once'\\'')fail=true;return false;};\\n  a.readFail=k=>{if(k===KEY&&fail){fail=false;return true;}return false;};\\n  const d=device(backend,{keys:[KEY],storage:a.stg,...a.syncOptions,endpoint:'\\''https://example.test/exec'\\''});await d.api.ready;\\n  assert.equal(a.disk().entries[ID].solved,20);assert.equal(a.w.G5HelpPage.state(ID).solved,20);\\n  a.writeFail=null;a.readFail=null;await clock.advance(4000);\\n  assert.equal(Object.keys(d.api.getState().conflicts).length,0);\\n  assert.equal(JSON.parse(a.peek('\\''g5sync.meta'\\'')).keys[KEY].rev,2);\\n  console.log('\\''PASS R6 partial'\\'',readafter,{disk:20,memory:20,baseline:2,status:d.api.getState().status});\\n  a.go(ID);a.q('\\''#goPractice'\\'').click();mathAnswer(a);\\n  assert.equal(a.disk().entries[ID].solved,21);assert.equal(app({initial:a.stg.dump()}).w.G5HelpPage.state(ID).solved,21);\\n  console.log('\\''PASS R6 continue/reopen solved=21'\\'');d.api.destroy();\\n }\\n const a=app({initial:{[KEY]:raw(8)},readFail:k=>k===KEY});const b=a.q('\\''#readRetry'\\''),old=b.onclick;\\n assert.equal(a.q('\\''#goPractice'\\''),null);assert.equal(a.writes.length,0);\\n a.readFail=null;b.click();a.writeFail=k=>k===KEY;a.q('\\''#goPractice'\\'').click();mathAnswer(a);\\n const refs=a.w.__review.get();old.call(b);assert.equal(a.w.G5HelpPage.state(ID).solved,9);assert.equal(a.w.G5HelpDirty(),1);assert.equal(refs.DB,a.w.__review.get().DB);\\n a.go('\\'''\\'');assert.equal(a.q('\\''#saveWarn'\\'').hidden,false);a.writeFail=null;await a.clock.advance(3000);\\n assert.equal(a.disk().entries[ID].solved,9);assert.equal(a.w.G5HelpDirty(),0);\\n console.log('\\''PASS R6 retry replay memory=9 dirty=1 -> home timer disk=9 dirty=0'\\'');\\n const h=app();h.q('\\''#goPractice'\\'').click();const hb=h.q('\\''#r1 button[data-hint]'\\''),hh=hb.onclick,cur=h.w.__review.get().st.cur;h.go(GID);h.q('\\''#goPractice'\\'').click();const snap=h.peek(KEY);hh.call(hb);assert.equal(cur.hints,0);assert.equal(h.peek(KEY),snap);console.log('\\''PASS R6 stale math hint cross-entry unchanged'\\'');\\n for(const key of [KEY,'\\''g5math.v1'\\'']){\\n  const init=key===KEY?{[KEY]:raw(8)}:{[key]:JSON.stringify({v:1,solved:8,idx:8,mastered:true})};\\n  const r=app({initial:init,readFail:k=>k===key});assert.equal(r.q('\\''#goPractice'\\''),null);assert.equal(r.writes.length,0);\\n  r.readFail=null;r.q('\\''#readRetry'\\'').click();r.q('\\''#goPractice'\\'').click();mathAnswer(r);assert.equal(r.disk().entries[ID].solved,9);\\n  console.log('\\''PASS cold read fail'\\'',key,'\\''blocks writes; recovered 8 -> 9'\\'');\\n }\\n const ro=app({writer:false,initial:{[KEY]:raw(8)}});assert.equal(ro.q('\\''#goPractice'\\''),null);assert.equal(ro.syncOptions,undefined);assert.equal(ro.writes.length,0);console.log('\\''PASS non-writer no answers/no sync/no writes'\\'');\\n const dirty=app({initial:{[KEY]:raw(8)}});dirty.writeFail=k=>k===KEY;dirty.q('\\''#goPractice'\\'').click();mathAnswer(dirty);dirty.go(GID);dirty.q('\\''#goPractice'\\'').click();choose(dirty);dirty.go('\\'''\\'');\\n assert.equal(dirty.w.G5HelpDirty(),2);assert.equal(dirty.w.G5HelpApplyRemote(KEY,raw(20)),false);assert.equal(dirty.q('\\''#saveWarn'\\'').hidden,false);\\n dirty.writeFail=null;await dirty.clock.advance(3000);assert.equal(dirty.disk().entries[ID].solved,9);assert.equal(dirty.disk().entries[GID].solved,1);assert.equal(dirty.w.G5HelpDirty(),0);assert.equal(dirty.reloads(),0);console.log('\\''PASS two-entry dirty kept+timer saved; remote blocked while dirty; reload=0'\\'');\\n})().catch(e=>{console.error(e);process.exitCode=1;});\\n\"],text=True,capture_output=True)
print(r.stdout);print(r.stderr);raise SystemExit(r.returncode)'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
PASS R6 partial normal { disk: 20, memory: 20, baseline: 2, status: '已同步 08:00' }
PASS R6 continue/reopen solved=21
PASS R6 partial throw-once { disk: 20, memory: 20, baseline: 2, status: '雲端有較新的進度，回到首頁、存好後就會換上。' }
PASS R6 continue/reopen solved=21
PASS R6 retry replay memory=9 dirty=1 -> home timer disk=9 dirty=0
PASS R6 stale math hint cross-entry unchanged
PASS cold read fail g5help.v1 blocks writes; recovered 8 -> 9
PASS cold read fail g5math.v1 blocks writes; recovered 8 -> 9
PASS non-writer no answers/no sync/no writes
PASS two-entry dirty kept+timer saved; remote blocked while dirty; reload=0



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import pathlib,shlex
s=pathlib.Path(\"docs/codex-review-r6-20261013.md\").read_text()
start=s.rfind('\\''/bin/zsh -lc \"node -e '\\'')
end=s.index(\" in /Users/william/Documents/g5-help\",start)
a=shlex.split(s[start:end]); b=shlex.split(a[-1]); src=b[b.index(\"-e\")+1]
base=src[:src.index(\"(async()=>\")]
import subprocess
r=subprocess.run(['\\''node'\\'','\\''-e'\\'',base+\"\\n(async()=>{\\n const {descendants}=require('\\''./tests/harness'\\'');\\n const button=(d,label)=>descendants(d.doc.container).find(x=>x.tagName==='\\''BUTTON'\\''&&x.textContent===label);\\n const grab=b=>[...b.listeners.click][0];\\n // A changed cloud version requires a new parent decision. Retain the previous DOM callback.\\n const clock=new Clock(),backend=server(clock);\\n backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:0,data:raw(3)});\\n const a=app({hash:'\\'''\\'',initial:{[KEY]:raw(8),'\\''g5sync.code'\\'':CODE}});\\n const d=device(backend,{keys:[KEY],storage:a.stg,...a.syncOptions,endpoint:'\\''https://example.test/exec'\\''});await d.api.ready;\\n assert.ok(d.api.getState().conflicts[KEY]);\\n const old=button(d,'\\''留雲端的'\\''),cb=grab(old);\\n backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:1,data:raw(4)});\\n old.click();await flush();await flush();\\n assert.equal(d.api.getState().conflicts[KEY].rev,2);assert.equal(a.disk().entries[ID].solved,8);\\n assert.notEqual(button(d,'\\''留雲端的'\\''),old);\\n cb.call(old,{preventDefault(){}});await flush();await flush();\\n assert.equal(a.disk().entries[ID].solved,4);assert.equal(a.w.G5HelpPage.state(ID).solved,4);\\n console.log('\\''REPRO SYNC-STALE-CLOUD old choice for cloud3 -> fresh conflict cloud4 awaiting choice -> replay detached old callback: local8 ->4; conflict cleared'\\'',\\n {backup:Object.entries(a.stg.dump()).filter(([k])=>k.startsWith('\\''g5sync.backup.'\\'')).map(([,v])=>JSON.parse(v).entries[ID].solved)});\\n d.api.destroy();\\n // Current ordinary choice, then new answer before network completion.\\n const c2=new Clock(),b2=server(c2);b2.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:0,data:raw(3)});\\n const a2=app({hash:'\\'''\\'',initial:{[KEY]:raw(8),'\\''g5sync.code'\\'':CODE}});\\n const d2=device(b2,{keys:[KEY],storage:a2.stg,...a2.syncOptions,endpoint:'\\''https://example.test/exec'\\''});await d2.api.ready;\\n d2.mode='\\''hold'\\'';button(d2,'\\''留雲端的'\\'').click();await flush();assert.equal(typeof d2.held,'\\''function'\\'');\\n a2.go(ID);a2.q('\\''#goPractice'\\'').click();mathAnswer(a2);assert.equal(a2.disk().entries[ID].solved,9);a2.go('\\'''\\'');\\n d2.mode='\\''ok'\\'';d2.held();await flush();await flush();\\n assert.equal(a2.disk().entries[ID].solved,3);assert.equal(a2.w.G5HelpPage.state(ID).solved,3);\\n console.log('\\''REPRO SYNC-INFLIGHT ordinary cloud choice (local8/cloud3), GET held -> answer saved9 -> home -> response released => local/memory3; no new choice'\\'',\\n {dirty:a2.w.G5HelpDirty(),backups:Object.entries(a2.stg.dump()).filter(([k])=>k.startsWith('\\''g5sync.backup.'\\'')).map(([,v])=>JSON.parse(v).entries[ID].solved)});\\n d2.api.destroy();\\n // Stale math hint on same-question re-render.\\n const h=app({initial:{[KEY]:raw(8)}});h.q('\\''#goPractice'\\'').click();const hb=h.q('\\''#r1 button[data-hint]'\\''),hh=hb.onclick;\\n h.q('\\''#goPractice'\\'').click();assert.notEqual(h.q('\\''#r1 button[data-hint]'\\''),hb);\\n hh.call(hb);assert.equal(h.w.G5HelpPage.state(ID).cur.hints,1);mathAnswer(h);\\n assert.equal(h.disk().entries[ID].streak,0);\\n console.log('\\''REPRO SAME-ENTRY old hint after same-question re-render: hints0 ->1; answer saves solved9 but streak3 ->0, clean remains8'\\'');\\n})().catch(e=>{console.error(e);process.exitCode=1});\\n\"],text=True,capture_output=True)
print(r.stdout);print(r.stderr);raise SystemExit(r.returncode)'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
REPRO SYNC-STALE-CLOUD old choice for cloud3 -> fresh conflict cloud4 awaiting choice -> replay detached old callback: local8 ->4; conflict cleared { backup: [ 8 ] }
REPRO SYNC-INFLIGHT ordinary cloud choice (local8/cloud3), GET held -> answer saved9 -> home -> response released => local/memory3; no new choice { dirty: 0, backups: [ 9 ] }
REPRO SAME-ENTRY old hint after same-question re-render: hints0 ->1; answer saves solved9 but streak3 ->0, clean remains8



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import pathlib,shlex
s=pathlib.Path(\"docs/codex-review-r6-20261013.md\").read_text()
start=s.rfind('\\''/bin/zsh -lc \"node -e '\\'')
end=s.index(\" in /Users/william/Documents/g5-help\",start)
a=shlex.split(s[start:end]); b=shlex.split(a[-1]); src=b[b.index(\"-e\")+1]
base=src[:src.index(\"(async()=>\")]
import subprocess
r=subprocess.run(['\\''node'\\'','\\''-e'\\'',base+\"\\nfunction extraApp(d){\\n d.ctx.setInterval=d.clock.setInterval;d.ctx.clearInterval=d.clock.clearInterval;d.q('\\''#upFile'\\'').files=[];\\n d.ctx.fetch=async()=>({json:async()=>({ok:true,items:[]})});\\n vm.runInContext([...html.matchAll(/<script>([\\\\s\\\\S]*?)<\\\\/script>/g)][2][1],d.ctx);\\n}\\nfunction collector(d){\\n const seen=new Map();\\n function snap(){for(const b of d.all('\\''button'\\''))if(b.onclick&&"'!seen.has(b))seen.set(b,b.onclick);}'"\\n snap();return {seen,snap};\\n}\\nfunction mathLesson(d,c){\\n const snap=()=>c?.snap();\\n const last=()=>d.all('\\''#lesson .ask'\\'').at(-1);\\n const chip=t=>{snap();const b=last().querySelectorAll('\\''button'\\'').find(x=>x.textContent===t);assert.ok(b,t);b.click();};\\n const nums=vs=>{snap();const a=last();a.querySelectorAll('\\''input'\\'').forEach((x,i)=>x.value=String(vs[i]));a.querySelector('\\''button'\\'').click();};\\n d.q('\\''#goLesson'\\'').click();\\n chip('\\''先約分：分子分母一起除以同一個數'\\'');chip('\\''一起除以 2'\\'');nums([14,21]);chip('\\''一起除以 7'\\'');nums([2,3]);chip('\\''不能再約了'\\'');\\n chip('\\''一起除以 9'\\'');nums([3,5]);chip('\\''不能再約了'\\'');nums([15]);nums([5]);nums([10]);nums([3]);nums([9]);chip('\\''>'\\'');chip('\\''>'\\'');chip('\\''先約分，再通分'\\'');snap();\\n assert.equal(d.w.G5HelpPage.state(ID).lessonDone,true);\\n}\\nfunction collectMathPractice(d,c){\\n d.q('\\''#goPractice'\\'').click();c.snap();const s=d.w.G5HelpPage.state(ID),p=d.w.G5Frac.problem(s.idx,s.seed);\\n const a={n:p.a.n/gcd(p.a.n,p.a.d),d:p.a.d/gcd(p.a.n,p.a.d)},b={n:p.b.n/gcd(p.b.n,p.b.d),d:p.b.d/gcd(p.b.n,p.b.d)};\\n for(const [k,v] of Object.entries({'\\''a.n'\\'':a.n,'\\''a.d'\\'':a.d,'\\''b.n'\\'':b.n,'\\''b.d'\\'':b.d}))d.q('\\''#r1 input[data-k=\\\"'\\''+k+'\\''\\\"]'\\'').value=String(v);\\n d.q('\\''#r1 button[data-check]'\\'').click();c.snap();const l=a.d*b.d/gcd(a.d,b.d);\\n for(const [k,v] of Object.entries({'\\''c.n'\\'':a.n*l/a.d,'\\''c.d'\\'':l,'\\''e.n'\\'':b.n*l/b.d,'\\''e.d'\\'':l}))d.q('\\''#r2 input[data-k=\\\"'\\''+k+'\\''\\\"]'\\'').value=String(v);\\n d.q('\\''#r2 button[data-check]'\\'').click();c.snap();d.all('\\''#r3 .chip'\\'').find(x=>x.dataset.s===(a.n*b.d>b.n*a.d?'\\''>'\\'':a.n*b.d<b.n*a.d?'\\''<'\\'':'\\''='\\'')).click();c.snap();\\n d.q('\\''#nextQ'\\'').click();c.snap();\\n}\\nfunction allState(d){return JSON.stringify(d.w.__review.get().DB);}\\n\\n(async()=>{\\n let grand=0;\\n for(const id of [ID,...app().w.G5Hard.LIST.filter(e=>e.kind==='\\''steps'\\'').map(e=>e.id)]){\\n  const d=app({hash:'\\''#h/'\\''+id});extraApp(d);const c=collector(d);\\n  if(id===ID){mathLesson(d,c);collectMathPractice(d,c);}\\n  else {\\n   const e=d.w.G5Hard.get(id);d.q('\\''#goLesson'\\'').click();c.snap();\\n   for(let i=0;i<e.steps.length;i++){\\n    c.snap();const s=e.steps[i];\\n    if(s.check)d.all('\\''#lesson .ask'\\'').at(-1).querySelectorAll('\\''button'\\'')[s.check.a].click();\\n    else d.all('\\''#lesson button[data-next]'\\'').at(-1).click();\\n   }\\n   c.snap();if(e.practice?.length){\\n    d.q('\\''#goPractice'\\'').click();c.snap();const s=d.w.G5HelpPage.state(id);\\n    d.q('\\''#practice .chip[data-k=\\\"'\\''+e.practice[s.idx%e.practice.length].a+'\\''\\\"]'\\'').click();c.snap();d.q('\\''#nextQ'\\'').click();c.snap();\\n   }\\n  }\\n  const other=id===ID?GID:ID;d.go(other);d.q('\\''#goPractice'\\'').click();\\n  const before=allState(d),disk=d.peek(KEY),gen=d.w.__review.get().GEN;\\n  const errors=[];for(const [b,fn]of c.seen){try{fn.call(b,{preventDefault(){}});}catch(e){errors.push(String(e));}}\\n  assert.deepEqual(errors,[]);assert.equal(allState(d),before);assert.equal(d.peek(KEY),disk);assert.equal(d.w.__review.get().GEN,gen);\\n  grand+=c.seen.size;\\n  console.log('\\''PASS all button replay cross-entry'\\'',id,'\\''instances='\\''+c.seen.size,'\\''storage unchanged'\\'');\\n }\\n console.log('\\''TOTAL APP BUTTON INSTANCES'\\'',grand);\\n})().catch(e=>{console.error(e);process.exitCode=1});\\n\"],text=True,capture_output=True)
print(r.stdout);print(r.stderr);raise SystemExit(r.returncode)'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
PASS all button replay cross-entry p38-6-2 instances=78 storage unchanged
PASS all button replay cross-entry sci-q5-bangen instances=29 storage unchanged
PASS all button replay cross-entry t-guoyu instances=21 storage unchanged
TOTAL APP BUTTON INSTANCES 128



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[██████░░░░] 60%｜原反例已通過，擴大重播發現缺口｜跨篇重播 128 個按鈕實例未改動存檔；但同篇重畫後的舊提示仍可扣掉連續答對紀錄，舊同步衝突按鈕也能替新衝突作決定。另已重現等待雲端回應期間新存的答案被覆蓋。

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '4720,4756p' docs/codex-review-r6-20261013.md; git diff --numstat c2f68bf -- src/app.html src/sync.js sync.js index.html tests/harness.js tests/e2e.py tests/sync.test.js" in /Users/william/Documents/g5-help
 succeeded in 0ms:
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "REVIEW_VARIANT=previous node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
const prev=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:src/sync.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
const oldTests=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:tests/sync.test.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
if(process.env.REVIEW_VARIANT==='\\''previous'\\''){const real=fs.readFileSync;fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?prev:Buffer.from(prev);return real.call(this,f,...args);};}
const filename=path.resolve('\\''tests/sync.test.js'\\''),req=createRequire(filename),m={exports:{}};
vm.runInThisContext('\\''(function(require,module,exports,__filename,__dirname){'\\''+oldTests+'\\''\\n})'\\'',{filename})(req,m,m.exports,filename,path.dirname(filename));
'" in /Users/william/Documents/g5-help
exec
/bin/zsh -lc "REVIEW_VARIANT=current node -e '
const fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');
const prev=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:src/sync.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
const oldTests=cp.execFileSync('\\''git'\\'',['\\''show'\\'','\\''455135d"'^:tests/sync.test.js'"'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();
if(process.env.REVIEW_VARIANT==='\\''previous'\\''){const real=fs.readFileSync;fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?prev:Buffer.from(prev);return real.call(this,f,...args);};}
const filename=path.resolve('\\''tests/sync.test.js'\\''),req=createRequire(filename),m={exports:{}};
vm.runInThisContext('\\''(function(require,module,exports,__filename,__dirname){'\\''+oldTests+'\\''\\n})'\\'',{filename})(req,m,m.exports,filename,path.dirname(filename));
'" in /Users/william/Documents/g5-help
 succeeded in 441ms:
✔ S04 A3 other device with another unsynced edit must choose; keep cloud backs up its local document (13.966167ms)
✔ S05 A4 joining with two documents always prompts, even if they are byte-identical (7.491458ms)
✔ S06 A5 failure=offline preserves local progress and retries automatically (8.246458ms)
✔ S06 A5 failure=reject preserves local progress and retries automatically (8.785292ms)
✔ S06 A5 failure=html preserves local progress and retries automatically (8.916375ms)
✔ S06 A5 failure=server preserves local progress and retries automatically (8.509208ms)
✔ S06 A5 failure=http preserves local progress and retries automatically (8.595375ms)
✔ S07 A5 wrong endpoint fails without throwing; offline join remains conservative after reopening (8.287ms)
✔ S08 A6 normalize lowercase, whitespace and hyphens; reject 0/O/1/I/L with an explanation (6.237166ms)
✔ S09 A6 fragment invitation is consumed before fetch, removed without losing other state, and used by real QR generator (3.891625ms)
✔ S10 A6 malformed fragment is still removed and never sent to server (0.643209ms)
✔ S11 A8 stop removes only code and meta, keeps progress/backups and prevents later pushes (8.714333ms)
✔ S12 content fingerprint equals independent SHA-256 including Unicode, lone surrogates and null vs empty (18.842625ms)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-c5dY73ls' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-tvKU9RoJ' (errno=Operation not permitted)

hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import runpy,pathlib,hashlib; d=runpy.run_path(\"build.py\",run_name=\"review_no_write\"); p=pathlib.Path(\".\"); rebuilt=d[\"HEAD\"]+d[\"inline\"]((p/\"src/app.html\").read_text())+\"</body></html>\"; print(\"index_equals_rebuild\",(p/\"index.html\").read_text()==rebuilt); print(\"sync_equals_source\",(p/\"sync.js\").read_bytes()==(p/\"src/sync.js\").read_bytes()); print(\"src_app_sha256\",hashlib.sha256((p/\"src/app.html\").read_bytes()).hexdigest())'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
index_equals_rebuild True
sync_equals_source True
src_app_sha256 a36cae9e949f1ac46741ba90289c88ae89f465e65488cb302501a5be60e939fa

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import subprocess,os
src=\"\\nconst fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),vm=require('\\''node:vm'\\''),path=require('\\''node:path'\\''),{createRequire}=require('\\''node:module'\\'');\\nconst git=s=>cp.execFileSync('\\''git'\\'',['\\''show'\\'',s],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();\\nconst tests=git('\\''455135d"'^:tests/sync.test.js'"'\\'');\\nconst source=process.env.VARIANT==='\\''current'\\''?fs.readFileSync('\\''src/sync.js'\\'','\\''utf8'\\''):git(process.env.VARIANT+'\\'':src/sync.js'\\'');\\nconst real=fs.readFileSync;fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?source:Buffer.from(source);return real.call(this,f,...args);};\\nconst filename=path.resolve('\\''tests/sync.test.js'\\''),req=createRequire(filename),m={exports:{}};\\nvm.runInThisContext('\\''(function(require,module,exports,__filename,__dirname){'\\''+tests+'\\''\\\\n})'\\'',{filename})(req,m,m.exports,filename,path.dirname(filename));\\n\"
for variant in ['\\''455135d"'^'"'\\'','\\''c2f68bf"'^'"'\\'','\\''current'\\'']:
 r=subprocess.run(['\\''node'\\'','\\''--test-reporter=spec'\\'','\\''-e'\\'',src],env=dict(os.environ,VARIANT=variant),text=True,capture_output=True)
 print(variant,'\\''exit'\\'',r.returncode)
 print('\\''\\n'\\''.join(line for line in r.stdout.splitlines() if line.startswith('\\''ℹ'\\'') or line.startswith('\\''✖'\\'')))
 if r.returncode: print(r.stderr)
'" in /Users/william/Documents/g5-help
 succeeded in 1775ms:
455135d^ exit 0
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 495.258417
c2f68bf^ exit 0
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 584.670125
current exit 0
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 512.502833

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import pathlib,shlex
s=pathlib.Path(\"docs/codex-review-r6-20261013.md\").read_text()
start=s.rfind('\\''/bin/zsh -lc \"node -e '\\'')
end=s.index(\" in /Users/william/Documents/g5-help\",start)
a=shlex.split(s[start:end]); b=shlex.split(a[-1]); src=b[b.index(\"-e\")+1]
base=src[:src.index(\"(async()=>\")]
import subprocess
r=subprocess.run(['\\''node'\\'','\\''-e'\\'',base+\"\\n(async()=>{\\n const {descendants}=require('\\''./tests/harness'\\'');\\n const btn=(d,t)=>descendants(d.doc.container).find(x=>x.tagName==='\\''BUTTON'\\''&&x.textContent===t);\\n const grab=b=>[...b.listeners.click][0],wait=async()=>{await flush();await flush();};\\n const clock=new Clock(),s=server(clock);s.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:0,data:raw(3)});\\n const a=app({hash:'\\'''\\'',initial:{[KEY]:raw(8)}}),d=device(s,{keys:[KEY],storage:a.stg,...a.syncOptions,endpoint:'\\''https://example.test/exec'\\''});\\n await d.api.ready;\\n const pre=descendants(d.doc.container).filter(x=>x.tagName==='\\''BUTTON'\\''),labels=new Set(pre.map(b=>b.textContent));\\n const oldEnable=btn(d,'\\''開啟跨裝置同步（這台是第一台）'\\''),oldJoin=btn(d,'\\''加入同步'\\''),oldInput=descendants(d.doc.container).find(x=>x.className==='\\''g5s-input'\\''),oldShow=btn(d,'\\''輸入同步碼（已在別台開過）'\\'');\\n oldShow.click();oldEnable.click();await wait();\\n const copy=btn(d,'\\''複製連結'\\''),stop=btn(d,'\\''這台停止同步'\\'');labels.add(copy.textContent);labels.add(stop.textContent);\\n stop.click();await wait();oldInput.value=CODE;grab(oldJoin).call(oldJoin);await wait();\\n assert.equal(d.api.getState().code,CODE);assert.equal(a.disk().entries[ID].solved,8);\\n for(const t of ['\\''留這台的'\\'','\\''留雲端的'\\''])labels.add(t);\\n const keepLocal=btn(d,'\\''留這台的'\\''),keepCloud=btn(d,'\\''留雲端的'\\''),localfn=grab(keepLocal);\\n // New cloud value must remain unselected until a NEW UI operation; replay old local callback instead.\\n s.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:1,data:raw(20)});\\n keepCloud.click();await wait();assert.equal(d.api.getState().conflicts[KEY].rev,2);\\n localfn.call(keepLocal);await wait();assert.equal(JSON.parse(s.store.record(CODE,KEY).data).entries[ID].solved,8);\\n console.log('\\''REPRO SYNC-STALE-LOCAL old callback cloud3 snapshot -> newly shown cloud20 -> replay overwrites cloud20 ->8 with backup20'\\'');\\n let showError;try{grab(oldShow).call(oldShow);}catch(e){showError=e.name;}assert.equal(showError,'\\''TypeError'\\'');\\n const before=a.peek(KEY);grab(copy).call(copy);await wait();assert.equal(a.peek(KEY),before);\\n grab(stop).call(stop);await wait();assert.equal(d.api.getState().code,null);assert.equal(a.peek(KEY),before);\\n grab(oldEnable).call(oldEnable);await wait();assert.ok(d.api.getState().code);assert.equal(a.peek(KEY),before);\\n console.log('\\''ALL SYNC BUTTON TYPES REPLAYED'\\'',JSON.stringify([...labels]),'\\''count='\\''+labels.size,'\\''progress unchanged for enable/join/show/copy/stop; stale stop stopped later session; show throws TypeError'\\'');\\n d.api.destroy();\\n})().catch(e=>{console.error(e);process.exitCode=1});\\n\"],text=True,capture_output=True)
print(r.stdout);print(r.stderr);raise SystemExit(r.returncode)'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
REPRO SYNC-STALE-LOCAL old callback cloud3 snapshot -> newly shown cloud20 -> replay overwrites cloud20 ->8 with backup20
ALL SYNC BUTTON TYPES REPLAYED ["開啟跨裝置同步（這台是第一台）","輸入同步碼（已在別台開過）","加入同步","複製連結","這台停止同步","留這台的","留雲端的"] count=7 progress unchanged for enable/join/show/copy/stop; stale stop stopped later session; show throws TypeError



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import subprocess,os
src=\"\\nconst fs=require('\\''node:fs'\\''),cp=require('\\''node:child_process'\\''),path=require('\\''node:path'\\'');\\nconst real=fs.readFileSync;\\nif(process.env.VARIANT"'!=='"'\\''current'\\''){\\n const source=cp.execFileSync('\\''git'\\'',['\\''show'\\'',process.env.VARIANT+'\\'':src/sync.js'\\''],{stdio:['\\''ignore'\\'','\\''pipe'\\'','\\''ignore'\\'']}).toString();\\n fs.readFileSync=function(f,...args){if(path.resolve(String(f))===path.resolve('\\''src/sync.js'\\''))return args[0]?source:Buffer.from(source);return real.call(this,f,...args);};\\n}\\nconst {Clock,server,device}=require('\\''./tests/harness'\\''),S=require('\\''./src/sync'\\''),K='\\''g5sci.v3'\\'',C='\\''ABCDEFGHJKMN'\\'',old='\\''{\\\"n\\\":1}'\\'',same='\\''{\\\"n\\\":7}'\\'';\\n(async()=>{\\n for(const baseline of [true,false]){\\n  const clock=new Clock(),backend=server(clock);backend.handle({op:'\\''put'\\'',code:C,key:K,rev:0,data:old});backend.handle({op:'\\''put'\\'',code:C,key:K,rev:1,data:same});\\n  const initial={[K]:same,'\\''g5sync.code'\\'':C};\\n  if(baseline)initial['\\''g5sync.meta'\\'']=JSON.stringify({version:1,codeHash:S.contentHash(C),keys:{[K]:{rev:1,hash:S.contentHash(old),updated:1}}});\\n  const d=device(backend,{initial});await d.api.ready;\\n  console.log(JSON.stringify({variant:process.env.VARIANT,baseline,conflict:"'!!d.api.getState().conflicts[K],metaRev:JSON.parse(d.storage.getItem('"'\\''g5sync.meta'\\'')||'\\''null'\\'')?.keys[K].rev??null,callbacks:d.replacements.length,backups:[...d.storage.data.keys()].filter(k=>k.startsWith('\\''g5sync.backup.'\\'')).length,progress:d.storage.getItem(K)}));d.api.destroy();\\n }\\n})().catch(e=>{console.error(e);process.exitCode=1});\\n\"
for v in ['\\''c2f68bf"'^'"'\\'','\\''current'\\'']:
 r=subprocess.run(['\\''node'\\'','\\''-e'\\'',src],env=dict(os.environ,VARIANT=v),text=True,capture_output=True)
 print(r.stdout);print(r.stderr);assert r.returncode==0
'" in /Users/william/Documents/g5-help
 succeeded in 41ms:
{"variant":"c2f68bf^","baseline":true,"conflict":true,"metaRev":1,"callbacks":0,"backups":0,"progress":"{\"n\":7}"}
{"variant":"c2f68bf^","baseline":false,"conflict":true,"metaRev":null,"callbacks":0,"backups":0,"progress":"{\"n\":7}"}


{"variant":"current","baseline":true,"conflict":false,"metaRev":2,"callbacks":0,"backups":0,"progress":"{\"n\":7}"}
{"variant":"current","baseline":false,"conflict":true,"metaRev":null,"callbacks":0,"backups":0,"progress":"{\"n\":7}"}



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[████████░░] 80%｜相容性與 A4 已核對｜無掛勾的既有同步測試，三個版本均 41／41 通過；但新規則也會改變自然站共用模組的「已有 baseline、內容相同」行為。首次加入仍會詢問，A4 未被破壞。正在核對剩餘故障出口與建置產物。

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import pathlib,shlex
s=pathlib.Path(\"docs/codex-review-r6-20261013.md\").read_text()
start=s.rfind('\\''/bin/zsh -lc \"node -e '\\'')
end=s.index(\" in /Users/william/Documents/g5-help\",start)
a=shlex.split(s[start:end]); b=shlex.split(a[-1]); src=b[b.index(\"-e\")+1]
base=src[:src.index(\"(async()=>\")]
import subprocess
r=subprocess.run(['\\''node'\\'','\\''-e'\\'',base+\"\\n(async()=>{\\n const S=require('\\''./src/sync'\\''),clock=new Clock(),backend=server(clock),local=raw(8),cloud=raw(20);\\n backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:0,data:local});backend.handle({op:'\\''put'\\'',code:CODE,key:KEY,rev:1,data:cloud});\\n const meta=JSON.stringify({version:1,codeHash:S.contentHash(CODE),keys:{[KEY]:{rev:1,hash:S.contentHash(local),updated:1}}});\\n const a=app({hash:'\\'''\\'',initial:{[KEY]:local,'\\''g5sync.code'\\'':CODE,'\\''g5sync.meta'\\'':meta}});\\n let armed=false;a.writeFail=(k,v)=>{if(k===KEY&&v===cloud)armed=true;return false;};\\n a.readFail=k=>{if(k===KEY&&armed){armed=false;return true;}return false;};\\n const d=device(backend,{keys:[KEY],storage:a.stg,...a.syncOptions,endpoint:'\\''https://example.test/exec'\\''});await d.api.ready;\\n a.writeFail=null;a.readFail=null;await clock.advance(12000);\\n assert.equal(JSON.parse(a.peek('\\''g5sync.meta'\\'')).keys[KEY].rev,2);\\n assert.equal(d.api.getState().status,'\\''雲端有較新的進度，回到首頁、存好後就會換上。'\\'');\\n console.log('\\''REPRO stale deferred status at 12s'\\'',{memory:a.w.G5HelpPage.state(ID).solved,disk:a.disk().entries[ID].solved,baseline:2,home:"'!a.w.__review.get().E,dirty:a.w.G5HelpDirty(),requests:d.calls.length,status:d.api.getState().status});d.api.destroy();'"\\n const corrupt='\\''{BROKEN-ORIGINAL'\\'';\\n const c=app({initial:{[KEY]:corrupt},writeFail:k=>k.startsWith(KEY+'\\''.broken.'\\'')});\\n c.q('\\''#goPractice'\\'').click();mathAnswer(c);c.go(GID);c.q('\\''#goPractice'\\'').click();choose(c);\\n assert.equal(c.peek(KEY),corrupt);assert.equal(c.w.G5HelpDirty(),2);\\n c.go('\\'''\\'');assert.equal(c.q('\\''#saveWarn'\\'').hidden,false);c.writeFail=null;await c.clock.advance(3000);\\n assert.equal(c.disk().entries[ID].solved,1);assert.equal(c.disk().entries[GID].solved,1);\\n const backups=Object.entries(c.stg.dump()).filter(([k])=>k.startsWith(KEY+'\\''.broken.'\\''));\\n assert.equal(backups.length,1);assert.equal(backups[0][1],corrupt);assert.equal(c.w.G5HelpDirty(),0);\\n console.log('\\''PASS bad raw backup failed => original preserved; recover => original exact backup plus both entries saved'\\'');\\n const x=app({hash:'\\'''\\'',initial:{[KEY]:raw(8)},writeFail:k=>k===KEY});\\n assert.equal(x.w.G5HelpApplyRemote(KEY,raw(20)),false);assert.equal(x.w.G5HelpPage.state(ID).solved,8);assert.equal(x.disk().entries[ID].solved,8);\\n x.writeFail=null;x.go(ID);assert.equal(x.w.G5HelpCanReplace(KEY),false);assert.equal(x.w.G5HelpApplyRemote(KEY,raw(20)),false);\\n const refs=x.w.__review.get();x.q('\\''#goPractice'\\'').click();const st=refs.st,cur=st.cur;\\n x.w.__review.save();assert.equal(x.w.__review.get().DB,refs.DB);assert.equal(x.w.__review.get().st,st);assert.equal(st.cur,cur);\\n const before=JSON.stringify(x.w.__review.get().DB);x.w.dispatchEvent({type:'\\''storage'\\'',key:KEY,newValue:raw(100)});assert.equal(JSON.stringify(x.w.__review.get().DB),before);\\n const {fn,button}=mathAnswer(x);fn.call(button);assert.equal(x.disk().entries[ID].solved,9);\\n x.go(GID);x.q('\\''#goPractice'\\'').click();const {fn:cf,b:cb}=choose(x);cf.call(cb);assert.equal(x.disk().entries[GID].solved,1);\\n console.log('\\''PASS setItem failure leaves disk+memory8; clean entry rejects replace; save retains DB/st/cur identity; storage event ignored; frac+choice score replay counted once'\\'');\\n})().catch(e=>{console.error(e);process.exitCode=1});\\n\"],text=True,capture_output=True)
print(r.stdout);print(r.stderr);raise SystemExit(r.returncode)'" in /Users/william/Documents/g5-help
 succeeded in 0ms:
REPRO stale deferred status at 12s {
  memory: 20,
  disk: 20,
  baseline: 2,
  home: true,
  dirty: 0,
  requests: 2,
  status: '雲端有較新的進度，回到首頁、存好後就會換上。'
}
PASS bad raw backup failed => original preserved; recover => original exact backup plus both entries saved
PASS setItem failure leaves disk+memory8; clean entry rejects replace; save retains DB/st/cur identity; storage event ignored; frac+choice score replay counted once



hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "python3 -B -c 'import subprocess,pathlib,hashlib
def git(*args):
 return subprocess.check_output([\"git\",*args],stderr=subprocess.DEVNULL)
print(\"HEAD\",git(\"rev-parse\",\"HEAD\").decode().strip())
files=[\"src/app.html\",\"src/sync.js\",\"src/hard.js\",\"src/frac.js\",\"src/upprogress.js\",\"index.html\",\"sync.js\",\"tests/harness.js\",\"tests/e2e.py\",\"tests/sync.test.js\"]
for p in files:
 b=pathlib.Path(p).read_bytes()
 print(p,\"matches_c2f68bf\",b==git(\"show\",\"c2f68bf:\"+p))
status=git(\"status\",\"--porcelain\").decode().splitlines()
print(\"tracked_status_entries\",sum(not s.startswith(\"??\") for s in status))
print(\"untracked_entries\",sum(s.startswith(\"??\") for s in status))
'" in /Users/william/Documents/g5-help
 succeeded in 24ms:
HEAD c2f68bfa01bf07424410ce4ff0d18277267a2deb
src/app.html matches_c2f68bf True
src/sync.js matches_c2f68bf True
src/hard.js matches_c2f68bf True
src/frac.js matches_c2f68bf True
src/upprogress.js matches_c2f68bf True
index.html matches_c2f68bf True
sync.js matches_c2f68bf True
tests/harness.js matches_c2f68bf True
tests/e2e.py matches_c2f68bf True
tests/sync.test.js matches_c2f68bf True
tracked_status_entries 0
untracked_entries 41

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
[已驗證] 固定驗收 `c2f68bf`，未改檔。以下為原碼搭配記憶體 DOM／Storage／假時鐘的實測；涵蓋累計 **128 個頁面按鈕實例**、讀取重試，以及同步面板全部 **7 類按鈕**。

| 項目 | PASS/FAIL | 證據 |
|---|---|---|
| 第 6 輪 FAIL①：部分寫入分歧 | PASS | 本機／baseline 8 題、雲端 20 題；讓 `setItem` 成功、隨後讀回拋錯一次。實際記憶體與磁碟均為 **20**；再答一題並重開為 **21**，沒有倒退。下一輪 baseline 補到 rev 2。[applyRemote](/Users/william/Documents/g5-help/src/app.html:313) |
| 第 6 輪 FAIL②：指定的舊操作反例 | PASS | 成功重讀 8 題後，製造寫入失敗並答一題；重播舊「再讀一次」仍為記憶體 **9／DIRTY=1**，恢復寫入後磁碟為 **9**。跨篇重播舊分數提示，原篇 `hints` 與存檔均不變。[retryRead](/Users/william/Documents/g5-help/src/app.html:305)、[提示守門](/Users/william/Documents/g5-help/src/app.html:626) |
| 不變量①：取鎖且讀成功才能作答 | PASS | 主 key、舊 key 分別拋讀取例外時，無練習按鈕、零寫入；恢復後接續原進度。未取鎖時無作答按鈕、不同步、零寫入。 |
| 不變量②：失敗保留記憶體並重試 | PASS | 兩篇各新增答案但寫入失敗，回首頁仍顯示警告；放行 3 秒重試後兩篇均保存、DIRTY 清零。另測壞資料備份失敗：原文保留，恢復後原文完整備份、兩篇保存。`save()` 保留 DB／st／cur 身分。[save](/Users/william/Documents/g5-help/src/app.html:284) |
| 不變量③：替換入口限制 | PASS | 篇內即使已存好仍拒絕雲端替換；首頁有 DIRTY 亦拒絕。主 key 寫入失敗時，磁碟及記憶體均保留 8 題。`storage` 事件不換記憶體；接受雲端後沒有 reload。[canReplace](/Users/william/Documents/g5-help/src/app.html:312) |
| 不變量④：同篇重畫後，舊提示仍有效 | **FAIL** | **重現：**預存連續答對 3 題→開練習並保存提示 callback→再次按頂端「繼續練習」，重畫同一題→重播舊提示→正常答對。實際 `hints` **0→1**，最後 `streak` **3→0**。重畫沒有增加 GEN，且沿用同一 cur，故 `guard()` 放行。跨篇的 128 個按鈕重播雖通過，這個同篇邊界仍失敗。[guard](/Users/william/Documents/g5-help/src/app.html:272)、[重畫入口](/Users/william/Documents/g5-help/src/app.html:544) |
| 同步面板：舊衝突選擇可處理新衝突 | **FAIL** | **重現：**本機 8、雲端 3，保存「留雲端的」callback；雲端更新為 4，首次點擊後正確重新詢問；再重播已移除的舊 callback，實際本機及記憶體 **8→4**，沒有新選擇。反向亦重現：舊「留這台的」可將新顯示的雲端 **20→8**。按鈕只呼叫 `resolve(key, choice)`，未綁定當時衝突版本；兩條路徑均有備份，但目前進度確實被覆寫。[按鈕綁定](/Users/william/Documents/g5-help/src/sync.js:244)、[resolve](/Users/william/Documents/g5-help/src/sync.js:494) |
| 雲端選擇等待期間的新答案 | **FAIL** | **正常操作反例，無重播：**首頁本機 8／雲端 3→按「留雲端的」並暫停 GET 回應→進篇答題且成功存成 **9**→回首頁→放行回應。實際磁碟及記憶體 **9→3**、DIRTY=0，未重新詢問。程式只核對雲端是否變動，沒有核對選擇後新增的本機進度；9 題版本保留於備份。[applyDecision](/Users/william/Documents/g5-help/src/sync.js:481) |
| 補 baseline 後的同步狀態 | **FAIL** | 重播部分寫入反例，推進 12 秒：首頁、DIRTY=0、記憶體／磁碟均 20、baseline rev 2，仍顯示「雲端有較新的進度，回到首頁、存好後就會換上」。相等分支沒有清除 `deferred[key]`。這是同步狀態錯誤，該測例未倒退進度。[相等分支](/Users/william/Documents/g5-help/src/sync.js:345)、[狀態判斷](/Users/william/Documents/g5-help/src/sync.js:383) |
| 無 canReplace／accept：是否完全與改前一致 | **FAIL** | **不完全一致。**使用自然站 key `g5sci.v3`、已有舊 baseline、本機＝雲端：改前出衝突、baseline 留 rev 1；本輪不出衝突、補為 rev 2。新規則沒有按掛勾區分。直接寫入回退仍保留；既有無掛勾測試在 `455135d^`、`c2f68bf^`、本輪均 **41／41** 通過。此差異本身未造成測例資料遺失；未讀取自然站另一 repo。 |
| A4：首次加入一律詢問 | PASS | 無 baseline、本機與雲端已有資料，即使完全相同仍出衝突、不替換、不上傳。實測改前與本輪相同；`!meta` 分支位於相等捷徑之前。[reconcile](/Users/william/Documents/g5-help/src/sync.js:339) |
| 指定測試與交付檔一致性 | PASS | `node --test tests/*.test.js`：**81／81，exit 0**。`index.html` 與記憶體重建結果一致，根目錄 `sync.js` 與來源一致；受測檔符合指定 commit，無 tracked 修改。 |

[未驗證] `python3.12 -B tests/e2e.py` 在 Chromium 啟動時因沙箱拒絕 `mkdtemp`（`EPERM`）而不能跑。你提供的 Chromium＋WebKit **250／250** 僅列為未驗證參考。

整體結論：FAIL
hook: Stop
hook: Stop Completed
tokens used
121,313
[已驗證] 固定驗收 `c2f68bf`，未改檔。以下為原碼搭配記憶體 DOM／Storage／假時鐘的實測；涵蓋累計 **128 個頁面按鈕實例**、讀取重試，以及同步面板全部 **7 類按鈕**。

| 項目 | PASS/FAIL | 證據 |
|---|---|---|
| 第 6 輪 FAIL①：部分寫入分歧 | PASS | 本機／baseline 8 題、雲端 20 題；讓 `setItem` 成功、隨後讀回拋錯一次。實際記憶體與磁碟均為 **20**；再答一題並重開為 **21**，沒有倒退。下一輪 baseline 補到 rev 2。[applyRemote](/Users/william/Documents/g5-help/src/app.html:313) |
| 第 6 輪 FAIL②：指定的舊操作反例 | PASS | 成功重讀 8 題後，製造寫入失敗並答一題；重播舊「再讀一次」仍為記憶體 **9／DIRTY=1**，恢復寫入後磁碟為 **9**。跨篇重播舊分數提示，原篇 `hints` 與存檔均不變。[retryRead](/Users/william/Documents/g5-help/src/app.html:305)、[提示守門](/Users/william/Documents/g5-help/src/app.html:626) |
| 不變量①：取鎖且讀成功才能作答 | PASS | 主 key、舊 key 分別拋讀取例外時，無練習按鈕、零寫入；恢復後接續原進度。未取鎖時無作答按鈕、不同步、零寫入。 |
| 不變量②：失敗保留記憶體並重試 | PASS | 兩篇各新增答案但寫入失敗，回首頁仍顯示警告；放行 3 秒重試後兩篇均保存、DIRTY 清零。另測壞資料備份失敗：原文保留，恢復後原文完整備份、兩篇保存。`save()` 保留 DB／st／cur 身分。[save](/Users/william/Documents/g5-help/src/app.html:284) |
| 不變量③：替換入口限制 | PASS | 篇內即使已存好仍拒絕雲端替換；首頁有 DIRTY 亦拒絕。主 key 寫入失敗時，磁碟及記憶體均保留 8 題。`storage` 事件不換記憶體；接受雲端後沒有 reload。[canReplace](/Users/william/Documents/g5-help/src/app.html:312) |
| 不變量④：同篇重畫後，舊提示仍有效 | **FAIL** | **重現：**預存連續答對 3 題→開練習並保存提示 callback→再次按頂端「繼續練習」，重畫同一題→重播舊提示→正常答對。實際 `hints` **0→1**，最後 `streak` **3→0**。重畫沒有增加 GEN，且沿用同一 cur，故 `guard()` 放行。跨篇的 128 個按鈕重播雖通過，這個同篇邊界仍失敗。[guard](/Users/william/Documents/g5-help/src/app.html:272)、[重畫入口](/Users/william/Documents/g5-help/src/app.html:544) |
| 同步面板：舊衝突選擇可處理新衝突 | **FAIL** | **重現：**本機 8、雲端 3，保存「留雲端的」callback；雲端更新為 4，首次點擊後正確重新詢問；再重播已移除的舊 callback，實際本機及記憶體 **8→4**，沒有新選擇。反向亦重現：舊「留這台的」可將新顯示的雲端 **20→8**。按鈕只呼叫 `resolve(key, choice)`，未綁定當時衝突版本；兩條路徑均有備份，但目前進度確實被覆寫。[按鈕綁定](/Users/william/Documents/g5-help/src/sync.js:244)、[resolve](/Users/william/Documents/g5-help/src/sync.js:494) |
| 雲端選擇等待期間的新答案 | **FAIL** | **正常操作反例，無重播：**首頁本機 8／雲端 3→按「留雲端的」並暫停 GET 回應→進篇答題且成功存成 **9**→回首頁→放行回應。實際磁碟及記憶體 **9→3**、DIRTY=0，未重新詢問。程式只核對雲端是否變動，沒有核對選擇後新增的本機進度；9 題版本保留於備份。[applyDecision](/Users/william/Documents/g5-help/src/sync.js:481) |
| 補 baseline 後的同步狀態 | **FAIL** | 重播部分寫入反例，推進 12 秒：首頁、DIRTY=0、記憶體／磁碟均 20、baseline rev 2，仍顯示「雲端有較新的進度，回到首頁、存好後就會換上」。相等分支沒有清除 `deferred[key]`。這是同步狀態錯誤，該測例未倒退進度。[相等分支](/Users/william/Documents/g5-help/src/sync.js:345)、[狀態判斷](/Users/william/Documents/g5-help/src/sync.js:383) |
| 無 canReplace／accept：是否完全與改前一致 | **FAIL** | **不完全一致。**使用自然站 key `g5sci.v3`、已有舊 baseline、本機＝雲端：改前出衝突、baseline 留 rev 1；本輪不出衝突、補為 rev 2。新規則沒有按掛勾區分。直接寫入回退仍保留；既有無掛勾測試在 `455135d^`、`c2f68bf^`、本輪均 **41／41** 通過。此差異本身未造成測例資料遺失；未讀取自然站另一 repo。 |
| A4：首次加入一律詢問 | PASS | 無 baseline、本機與雲端已有資料，即使完全相同仍出衝突、不替換、不上傳。實測改前與本輪相同；`!meta` 分支位於相等捷徑之前。[reconcile](/Users/william/Documents/g5-help/src/sync.js:339) |
| 指定測試與交付檔一致性 | PASS | `node --test tests/*.test.js`：**81／81，exit 0**。`index.html` 與記憶體重建結果一致，根目錄 `sync.js` 與來源一致；受測檔符合指定 commit，無 tracked 修改。 |

[未驗證] `python3.12 -B tests/e2e.py` 在 Chromium 啟動時因沙箱拒絕 `mkdtemp`（`EPERM`）而不能跑。你提供的 Chromium＋WebKit **250／250** 僅列為未驗證參考。

整體結論：FAIL
rc=0
