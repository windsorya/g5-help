#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""難題解說附影片前的驗證（交辦 #2259 復盤：2026-10-15 這一步手動拼了 8 道指令、還用全磁碟 find 找 whisper 模型，多花約 4 分鐘）。

  tools/video_check.py search "假分數 比大小 五年級" ["分母越大 每一份越小" ...]
      每組關鍵字同時搜，列候選：id｜秒數｜頻道｜標題
  tools/video_check.py check ID[@秒,秒,秒] ... [--out 資料夾]
      同時查「可嵌入／公開／長度」並下載 → whisper 逐字稿（含時間）→ 指定秒數抽格拼成一張（沒指定就取 1/4、1/2、3/4）
      結果：<資料夾>/<id>.txt 逐字稿、<id>_tiles.jpg 拼圖，最後印一張表。

逐字稿要自己讀完、拼圖要自己看（工具只省掉手動拼指令，不代替判斷）；playable_in_embed 不是 True 的不能放進 videos。
"""
import concurrent.futures as cf
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

MODEL = Path.home() / ".cache/whisper/ggml-large-v3-turbo.bin"   # 本機 whisper.cpp 模型；找不到才退 ggml-small
if not MODEL.exists():
    MODEL = Path.home() / ".cache/whisper/ggml-small.bin"
PROMPT = "以下是繁體中文的國小教學。"
URL = "https://www.youtube.com/watch?v="


def run(args, **kw):
    return subprocess.run(args, capture_output=True, text=True, **kw)


def search(queries):
    def one(q):
        return q, run(["yt-dlp", "--flat-playlist", "--print", "%(id)s|%(duration)s|%(channel)s|%(title)s", f"ytsearch8:{q}"]).stdout.strip()
    with cf.ThreadPoolExecutor(max(1, len(queries))) as ex:
        for q, out in ex.map(one, queries):
            print(f"== {q}\n{out or '（沒有結果）'}")


def meta(vid):
    r = run(["yt-dlp", "-j", URL + vid])
    if r.returncode:
        return {"id": vid, "error": (r.stderr.strip().splitlines() or ["yt-dlp 失敗"])[-1]}
    d = json.loads(r.stdout)
    return {"id": vid, "embed": d.get("playable_in_embed"), "availability": d.get("availability"),
            "duration": d.get("duration"), "channel": d.get("channel"), "title": d.get("title")}


def fetch(vid, out):
    mp4 = out / f"{vid}.mp4"
    if not mp4.exists():
        r = run(["yt-dlp", "-q", "-f", "bv*[height<=480]+ba/b[height<=480]", "--merge-output-format", "mp4",
                 "-o", str(out / f"{vid}.%(ext)s"), URL + vid])
        if r.returncode or not mp4.exists():
            raise RuntimeError(f"{vid} 下載失敗：{r.stderr.strip()[-200:]}")
    wav = out / f"{vid}.wav"
    run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(mp4), "-ar", "16000", "-ac", "1", str(wav)], check=True)
    return mp4, wav


def transcribe(vid, wav, out):
    """轉寫失敗（結束碼不是 0，或一行都沒有）就丟錯，不覆寫舊逐字稿（Codex 審 41b02fe：舊版照寫空檔、還回報可用）。"""
    r = run(["whisper-cli", "-m", str(MODEL), "-l", "zh", "-f", str(wav), "--prompt", PROMPT])
    lines = [ln for ln in r.stdout.splitlines() if ln.startswith("[")]
    if r.returncode != 0 or not lines:
        raise RuntimeError(f"{vid} 轉寫失敗（whisper 結束碼 {r.returncode}、{len(lines)} 行）：{(r.stderr or '').strip()[-200:]}")
    tmp = out / f"{vid}.txt.tmp"
    tmp.write_text("\n".join(lines) + "\n", encoding="utf-8")
    tmp.replace(out / f"{vid}.txt")
    return len(lines)


def usable(m):
    """可以放進 videos 的條件：可嵌入、公開、沒有出錯（印出的「可用」與結束碼用同一個判準）。"""
    return m.get("embed") is True and m.get("availability") == "public" and not m.get("error")


def tiles(vid, mp4, times, out):
    frames = []
    for t in times:
        f = out / f"{vid}_{t}.jpg"
        run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(t), "-i", str(mp4), "-frames:v", "1", "-vf", "scale=480:-2", str(f)], check=True)
        frames.append(f)
    tile = out / f"{vid}_tiles.jpg"
    if len(frames) == 1:
        shutil.copy(frames[0], tile)
    else:
        args = ["ffmpeg", "-loglevel", "error", "-y"]
        for f in frames:
            args += ["-i", str(f)]
        run(args + ["-filter_complex", f"hstack={len(frames)}", str(tile)], check=True)
    return tile


def check(specs, out):
    out.mkdir(parents=True, exist_ok=True)
    want = {}
    for s in specs:
        vid, _, ts = s.partition("@")
        want[vid] = [int(float(x)) for x in ts.split(",") if x.strip()] if ts else []
    with cf.ThreadPoolExecutor(len(want) * 2) as ex:            # 查資料與下載同時進行
        metas = {v: ex.submit(meta, v) for v in want}
        files = {v: ex.submit(fetch, v, out) for v in want}
        metas = {v: f.result() for v, f in metas.items()}
        got = {}
        for v, f in files.items():
            try:
                got[v] = f.result()
            except Exception as e:                              # 一支失敗不擋其他支
                metas[v]["error"] = str(e)
    rows = []
    for v, m in metas.items():
        n, tile = 0, ""
        if v in got:
            try:                                                # 一支轉寫或抽格出錯，記下來、繼續做下一支（Codex 審 41b02fe）
                mp4, wav = got[v]
                n = transcribe(v, wav, out)                     # whisper 一支一支跑（同時跑會搶 GPU）
                dur = m.get("duration") or 0
                tile = tiles(v, mp4, want[v] or [int(dur * k / 4) for k in (1, 2, 3)], out)
            except Exception as e:                              # noqa: BLE001
                m["error"] = str(e)
        rows.append((v, m, n, tile))
    print(f"\n輸出資料夾：{out}")
    for v, m, n, tile in rows:
        print(f"{'可用' if usable(m) else '不能用'}｜{v}｜可嵌入={m.get('embed')}｜{m.get('availability')}｜{m.get('duration')} 秒｜逐字稿 {n} 行"
              f"｜{tile}｜{m.get('channel')}｜{m.get('title')}" + (f"｜錯誤：{m['error']}" if m.get("error") else ""))
    return 0 if all(usable(m) for _, m, _, _ in rows) else 1


def main(argv):
    if len(argv) < 2 or argv[0] not in ("search", "check"):
        print(__doc__)
        return 2
    if argv[0] == "search":
        search(argv[1:])
        return 0
    out = Path(os.environ.get("TMPDIR", "/tmp")) / "g5-video-check"
    if "--out" in argv:
        i = argv.index("--out")
        out = Path(argv[i + 1])
        argv = argv[:i] + argv[i + 2:]
    return check(argv[1:], out)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
