#!/usr/bin/env python3
"""把題目照片切成放大的重疊格，一次讀完每個字，不用猜座標。

  python3.12 tools/photo_tiles.py <照片> <輸出目錄> [--grid 3x3] [--zoom 2]
  python3.12 tools/photo_tiles.py <照片> <另一個輸出目錄> --box r2c3 --zoom 4   # 只放大某一格（看被圈、打叉、模糊的字）

輸出：overview.png（原圖縮小＋格線與格名 r1c1…）、r1c1.png…（每格放大，四邊各多 15% 重疊，字不會被切在邊上）。
輸出目錄必須不存在或是空的（連隱藏檔都不能有），每個檔都用「不得覆寫」模式建立——原照片、上次的結果都不會被蓋掉；
再跑一次（含 --box）請換一個新目錄。
2026-10-24 交辦 #4293：#4269 第 76 題我手動猜座標裁了 5 次才找到「大幅翁」那個字。
Codex 審 3 輪 FAIL（同名／大小寫別名覆寫原照片、零像素崩潰）後依設計者方案改成：空目錄＋排他建立、格數不得多於像素、縮放至少 1 像素。
"""
import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

OVERLAP = 0.15


def cells(w, h, rows, cols):
    cw, ch = w / cols, h / rows
    for r in range(rows):
        for c in range(cols):
            x0, y0 = c * cw - cw * OVERLAP, r * ch - ch * OVERLAP
            x1, y1 = (c + 1) * cw + cw * OVERLAP, (r + 1) * ch + ch * OVERLAP
            yield f"r{r + 1}c{c + 1}", (max(0, int(x0)), max(0, int(y0)), min(w, int(x1)), min(h, int(y1))), (c * cw, r * ch)


def scaled(img, factor):
    return img.resize((max(1, int(img.width * factor)), max(1, int(img.height * factor))), Image.LANCZOS)


def save_new(img, path):
    with open(path, "xb") as fh:   # 已有同名檔（含大小寫別名、symlink、hardlink）就失敗，絕不截斷既有內容
        img.save(fh, format="PNG")


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("photo"); ap.add_argument("outdir")
    ap.add_argument("--grid", default="3x3", help="列x欄，預設 3x3")
    ap.add_argument("--zoom", type=float, default=2.0)
    ap.add_argument("--box", help="只輸出這一格（例如 r2c3）")
    a = ap.parse_args(argv)
    try:
        rows, cols = (int(x) for x in a.grid.lower().split("x"))
    except ValueError:
        ap.error("--grid 要寫成 3x3 這種格式")
    if rows < 1 or cols < 1:
        ap.error("--grid 的列數、欄數要是正整數")
    if not 0.5 <= a.zoom <= 8:
        ap.error("--zoom 要在 0.5～8 之間")
    if not Path(a.photo).is_file():
        ap.error(f"找不到照片：{a.photo}")
    img = ImageOps.exif_transpose(Image.open(a.photo)).convert("RGB")   # 手機照片常帶旋轉標記
    w, h = img.size
    if cols > w or rows > h:
        ap.error(f"格數比照片像素還多（照片 {w}×{h}，格 {rows}x{cols}）")
    all_cells = list(cells(w, h, rows, cols))
    if a.box and a.box not in {n for n, _, _ in all_cells}:
        ap.error(f"沒有 {a.box} 這一格；可用 r1c1～r{rows}c{cols}")
    picked = [(n, b) for n, b, _ in all_cells if not a.box or n == a.box]
    for n, (x0, y0, x1, y1) in picked:
        if not (0 <= x0 < x1 <= w and 0 <= y0 < y1 <= h):
            ap.error(f"{n} 的裁切範圍是空的")
    out = Path(a.outdir)
    if out.is_symlink():
        ap.error("輸出目錄不能是捷徑（symlink）：換一個新目錄")
    if out.exists():
        if not out.is_dir():
            ap.error(f"輸出位置不是目錄：{out}")
        if any(out.iterdir()):
            ap.error(f"輸出目錄不是空的：{out}（原照片、上次的結果都可能被蓋掉；換一個新目錄）")
    else:
        out.mkdir(parents=True)
    written = []
    try:
        for name, box in picked:
            p = out / (f"{name}_x{a.zoom:g}.png" if a.box else f"{name}.png")
            save_new(scaled(img.crop(box), a.zoom), p); written.append(p)
        if not a.box:
            scale = min(1.0, 1200 / max(w, h))
            ov = scaled(img, scale); d = ImageDraw.Draw(ov)
            for name, _, (x, y) in all_cells:
                d.rectangle([x * scale, y * scale, (x + w / cols) * scale, (y + h / rows) * scale], outline=(255, 0, 0), width=2)
                d.text((x * scale + 6, y * scale + 4), name, fill=(255, 0, 0))
            p = out / "overview.png"; save_new(ov, p); written.insert(0, p)
    except OSError as e:
        print(f"寫到一半失敗：{e}；本次已建立：{', '.join(map(str, written)) or '無'}（既有檔案沒有被動到）", file=sys.stderr)
        return 1
    for p in written:
        print(p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
