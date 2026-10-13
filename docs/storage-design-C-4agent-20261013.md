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
