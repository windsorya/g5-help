#!/bin/zsh
# 難題解說新增一篇：檢查與上線。實作在 tools/post_gate.py，這裡只轉呼叫。
#
#   zsh tools/post.sh verify                 固定內容快照 → 建置 → 快篩 → 工具故障注入 → 採字（Chromium、WebKit）、本機端到端、標準 DOM 主閘同時跑 → node 全部
#                                            全過才寫成功收據 .post-state/latest.json（綁內容清單＋SHA-256）；任何一道沒過＝收據記失敗
#   zsh tools/post.sh ship <篇id> [傳題ID]    核對收據＝HEAD 內容 → 在 commit 快照上重跑建置、node、DOM 主閘 → 推固定 SHA → 等正式網址 index.html 雜湊相同 → 回寫網頁進度清單 → 正式站 e2e 在背景跑
#
# 歷史（細節見 DevVault devlog）：
# - #2259（2026-10-15 復盤）：p40-2-5 孩子等了 51 分鐘，約 22 分是測試排隊 ⇒ 採字／端到端／主閘平行跑。
# - #2260：commit 漏了重建後的 index.html，雜湊比對第一輪就判「已上線」⇒ ship 先核對 commit 內容。
# - #2621（2026-10-22）：舊 ship 只跑 node 就推，DOM 主閘、verify 成功紀錄都不在上線路徑 ⇒ 改成收據＋推前重跑主閘（Codex 設計者方案 A＋B）。
# - 正式站背景 e2e 讀的是本工作樹 .post-snapshots/ 裡的快照：跑完前不要刪這個工作樹（2026-10-15 實錄：219 項全過後中斷）。
#
# 正式／離線測試共用所有閘門；沒有跳過檢查或替換來源的 test mode。commit 由人寫訊息，不在這裡做。
setopt pipefail
ROOT=${0:A:h:h}
cd "${ROOT}" || exit 2
exec /opt/homebrew/opt/python@3.12/bin/python3.12 tools/post_gate.py "$@"
