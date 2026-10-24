#!/bin/zsh
# 送 Codex 唯讀審（核字形、內容審、練習審共用）。
#   zsh tools/codex_send.sh <brief.md> <輸出.txt> [照片 ...]
# 輸出.txt 是完整紀錄（最後一行 rc=N）；<輸出>.answer.txt 只留 Codex 最後的回答。
# 2026-10-24 交辦 #4293：#4269 一篇就踩了三個起跑錯，各浪費一輪——
#   ① -i 放在 prompt 前面會把 prompt 吃掉（rc=1「No prompt provided」，#4247 也踩過）
#   ② 讀取範圍圍籬不是固定格式，被外送圍籬閘門擋下
#   ③ 在暫存目錄跑要 --skip-git-repo-check，不然 rc=1「Not inside a trusted directory」
# 這支把三件事固定下來：圍籬自動加在檔首、prompt 一律在 -i 前、在 brief 所在目錄跑。
set -u
if (( $# < 2 )); then print -u2 '用法：zsh tools/codex_send.sh <brief.md> <輸出.txt> [照片 ...]'; exit 2; fi
brief=$1; out=${2:A}; shift 2   # 先轉絕對路徑：下面會 cd 到 brief 所在目錄（Codex 審 d18b20f P2）
[[ -f $brief ]] || { print -u2 "找不到 brief：$brief"; exit 2; }
[[ -d ${out:h} ]] || { print -u2 "輸出目錄不存在：${out:h}"; exit 2; }
dir=${brief:A:h}
for img in "$@"; do [[ -f $img ]] || { print -u2 "找不到照片：$img"; exit 2; }; done
final=$dir/.${brief:t}.fenced.md
if head -n 1 $brief | grep -q '^## 🔒 讀取範圍硬邊界'; then   # 只認檔首那一行的圍籬標題，內文提到不算（Codex 審 d18b20f P2）
  cp $brief $final
else
  { cat <<EOF
## 🔒 讀取範圍硬邊界（先讀這一段再做任何事）

允許讀取的範圍只有本訊息與附上的照片（位於 $dir/）。不需要讀任何其他檔案，不得執行會寫入的指令、不得上網。

嚴禁離開該目錄向上層瀏覽。特別是 \`/Users/william/LawOffice/\` 底下的其他子目錄存放當事人案件卷證，與本次工作完全無關：不得 ls／find／grep／cat 該目錄或其任何子目錄，不得沿 symlink 往上走，不得讀 \`~/Documents\`、\`~/Downloads\`、\`~/Library\`、\`~/.claude\`、任何 \`*.env\`／金鑰檔。

若有問題需要離開上述範圍才能回答，不要自行擴大範圍，直接在報告裡寫「此點需擴大讀取範圍，未執行」。

---

EOF
    cat $brief; } > $final
fi
imgs=(); for img in "$@"; do imgs+=(-i ${img:A}); done
cd $dir || exit 2
# prompt 一定在 -i 之前；stdin 接 /dev/null，免得 codex 等 stdin
codex exec --skip-git-repo-check --sandbox read-only "$(cat $final)" "${imgs[@]}" < /dev/null > $out 2>&1
rc=$?
print "rc=$rc" >> $out
# 只留最後一段回答：最後一個單獨的「codex」行之後、到「tokens used」為止
awk '/^codex$/{buf=""; on=1; next} /^tokens used/{on=0} on{buf=buf $0 "\n"} END{printf "%s", buf}' $out | grep -v '^hook: ' > ${out:r}.answer.txt
exit $rc
