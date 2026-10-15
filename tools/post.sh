#!/bin/zsh
# 難題解說新增一篇：檢查與上線（交辦 #2259 復盤，2026-10-15 p40-2-5 那次孩子等了 51 分鐘，其中約 22 分鐘是測試一套一套排隊跑）。
#
#   zsh tools/post.sh verify                 建置 → 快篩（1 秒內抓內容錯）→ 採字（Chromium、WebKit 同時）與本機端到端同時跑 → node 全部
#   zsh tools/post.sh ship <篇id> [傳題ID]    推上 main → 等正式網址出現這一篇 → 回寫網頁進度清單 → 正式網址端到端在背景跑
#
# 每一段印出經過秒數；log 放在印出的資料夾。commit 由人寫訊息，不在這裡做。
zmodload zsh/datetime
setopt pipefail
ROOT=${0:A:h:h}
cd "${ROOT}" || exit 2
LOG=$(mktemp -d "${TMPDIR:-/tmp}/g5help-post.XXXXXX")
t0=${EPOCHSECONDS}
st() { print -r -- "[$(( EPOCHSECONDS - t0 ))s] $*" }
PY=/opt/homebrew/opt/python@3.12/bin/python3.12

case $1 in
verify)
  ${PY} build.py > "${LOG}/build.log" 2>&1 || { cat "${LOG}/build.log"; exit 1 }
  st "建置完成"
  if ! node --test --test-name-pattern='快篩' tests/hard.test.js > "${LOG}/quick.log" 2>&1; then
    grep -E "^\s+'|AssertionError" "${LOG}/quick.log" | head -20
    st "快篩沒過：先改內容再跑（不必等瀏覽器）"; exit 1
  fi
  # 名稱對不到任何測試時 node 也回 0（#2260 實測：沒有快篩的舊版也「通過」）——要真的跑到快篩才算
  nq=$(grep -E '^ℹ pass [0-9]+' "${LOG}/quick.log" | grep -oE '[0-9]+' | head -1)
  (( ${nq:-0} >= 4 )) || { st "快篩一條都沒跑到（只跑到 ${nq:-0} 條）：這個工作樹的 tests/hard.test.js 還沒有快篩？"; exit 1 }
  st "快篩通過（${nq} 條）"
  ${PY} tests/e2e_kidtext.py --parallel > "${LOG}/kid.log" 2>&1 & kid=$!
  ${PY} tests/e2e.py > "${LOG}/e2e.log" 2>&1 & e2e=$!
  wait ${kid}; krc=$?
  st "採字結束 rc=${krc}"; grep -E 'VIOLATION|PROBLEM|快照|同時跑完|kidtext:' "${LOG}/kid.log"
  wait ${e2e}; erc=$?
  st "本機端到端結束 rc=${erc}"; grep -E '^FAIL|Error' "${LOG}/e2e.log" | head; tail -1 "${LOG}/e2e.log"
  node --test tests/*.test.js > "${LOG}/node.log" 2>&1; nrc=$?
  st "node 全部 rc=${nrc}"; grep -E '^ℹ (pass|fail)|^✖' "${LOG}/node.log" | head
  print -r -- "log：${LOG}"
  (( krc == 0 && erc == 0 && nrc == 0 )) || { st "有沒過的，不能上線"; exit 1 }
  st "全部通過：git add 這一篇的檔案、寫 commit 訊息，再 zsh tools/post.sh ship <篇id> [傳題ID]"
  ;;
ship)
  id=$2; inbox=$3
  [[ -n ${id} ]] || { print "用法：zsh tools/post.sh ship <篇id> [傳題ID]"; exit 2 }
  grep -q "id: \"${id}\"" src/hard.js || { print -r -- "src/hard.js 沒有 ${id}"; exit 2 }
  # 推之前三道檢查（#2260 補審 70358bb 抓到的假綠：commit 漏了重建後的 index.html 時，HEAD 的 index.html 就是線上舊版，
  # 下面的雜湊比對第一輪就判「已是這一版」並送 --done——家長看到連結，新內容其實沒上線）。任何一道沒過就停，不推。
  pub=(src index.html tests sync.js qrcode.js upload.js)
  # 只看已追蹤檔案：推上去、會被伺服的只有已追蹤檔；工作樹裡大量 hook 自動備份的 *.bak.* 是未追蹤檔，不算改動（2026-10-15 正向實跑抓到的誤判）
  dirty=$(git status --porcelain --untracked-files=no -- ${pub})
  [[ -z ${dirty} ]] || { print -r -- "下列改動還沒 commit（commit 要含 src、重建後的 index.html、tests/kidtext_harvest.json）：
${dirty}"; st "沒推"; exit 1 }
  ${PY} build.py > "${LOG}/build.log" 2>&1 || { cat "${LOG}/build.log"; exit 1 }
  rebuilt=$(git status --porcelain --untracked-files=no -- index.html sync.js qrcode.js upload.js)
  [[ -z ${rebuilt} ]] || { print -r -- "commit 裡的 index.html 不是用現在的 src 建出來的（重建後有差異：${rebuilt}）——重跑 verify、把重建後的檔一起 commit"; st "沒推"; exit 1 }
  node --test tests/*.test.js > "${LOG}/node_ship.log" 2>&1 || { grep -E '^✖' "${LOG}/node_ship.log" | head -5; st "node 測試沒過（含採字結果是不是這一版 index.html 的）：沒推"; exit 1 }
  st "推前檢查通過：沒有未 commit 的改動、index.html 與 src 一致、node 全過"
  git push -q origin HEAD:main || { st "推不上去（先 git fetch、rebase 到 origin/main）"; exit 1 }
  st "已推上 main（$(git rev-parse --short HEAD)）"
  # 判準＝正式網址的 index.html 和這次 commit 的一模一樣（只找篇 id 的話，改寫舊篇時舊版就已經有這個 id）。
  # 先存檔再算雜湊：不能 curl | grep -q——grep 找到就先結束，curl 寫不進去回 23，pipefail 會把整條判成失敗（2026-10-15 實跑空轉 5 分鐘）
  want=$(git show HEAD:index.html | shasum -a 256 | cut -c1-64)
  live=0; fails=0
  for i in {1..60}; do
    if curl -sS --max-time 20 -o "${LOG}/live.html" "https://windsorya.github.io/g5-help/?nc=${RANDOM}${i}" 2>> "${LOG}/curl.err"; then
      [[ $(shasum -a 256 < "${LOG}/live.html" | cut -c1-64) == "${want}" ]] && { live=1; break }
    else
      (( fails++ ))
    fi
    sleep 5
  done
  (( live )) || { st "5 分鐘內正式網址還不是這一版（連線失敗 ${fails} 次，見 ${LOG}/curl.err）"; exit 1 }
  st "正式網址已是這一版（index.html 雜湊與 commit 相同）：https://windsorya.github.io/g5-help/#h/${id}"
  if [[ -n ${inbox} ]]; then
    python3 ~/scripts/g5_help_inbox.py --done "${inbox}" "${id}" || { st "回寫網頁進度清單失敗"; exit 1 }
    st "已回寫網頁進度清單（家長看得到連結）"
  fi
  ( ${PY} tests/e2e.py --base https://windsorya.github.io/g5-help/ > "${LOG}/live.log" 2>&1; print "live_rc=$?" >> "${LOG}/live.log" ) &!
  # 背景這一支讀的是本工作樹的 tests/：跑完前刪掉工作樹＝中途 ModuleNotFoundError（2026-10-15 實錄：219 項全過後中斷）
  st "正式網址端到端在背景跑（約 5 分鐘），結果看 ${LOG}/live.log（最後一行 live_rc=0 才算全過）；跑完前不要刪這個工作樹"
  ;;
*)
  print "用法：zsh tools/post.sh verify | ship <篇id> [傳題ID]"; exit 2
  ;;
esac
