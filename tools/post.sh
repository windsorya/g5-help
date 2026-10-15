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
  st "快篩通過"
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
  dirty=$(git status --porcelain -- src index.html tests)
  [[ -z ${dirty} ]] || print -r -- "注意：下列改動沒有 commit，不會一起上線：
${dirty}"
  git push -q origin HEAD:main || { st "推不上去（先 git fetch、rebase 到 origin/main）"; exit 1 }
  st "已推上 main（$(git rev-parse --short HEAD)）"
  live=0
  for i in {1..60}; do
    curl -s "https://windsorya.github.io/g5-help/?nc=${RANDOM}${i}" | grep -q "\"${id}\"" && { live=1; break }
    sleep 5
  done
  (( live )) || { st "5 分鐘內正式網址還沒有 ${id}（GitHub Pages 卡住？）"; exit 1 }
  st "正式網址已有這一篇：https://windsorya.github.io/g5-help/#h/${id}"
  if [[ -n ${inbox} ]]; then
    python3 ~/scripts/g5_help_inbox.py --done "${inbox}" "${id}" || { st "回寫網頁進度清單失敗"; exit 1 }
    st "已回寫網頁進度清單（家長看得到連結）"
  fi
  ( ${PY} tests/e2e.py --base https://windsorya.github.io/g5-help/ > "${LOG}/live.log" 2>&1; print "live_rc=$?" >> "${LOG}/live.log" ) &!
  st "正式網址端到端在背景跑，結果看 ${LOG}/live.log（最後一行 live_rc=0 才算全過）"
  ;;
*)
  print "用法：zsh tools/post.sh verify | ship <篇id> [傳題ID]"; exit 2
  ;;
esac
