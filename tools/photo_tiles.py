#!/usr/bin/env python3
"""把題目照片切成放大的重疊格，一次讀完每個字，不用猜座標。

  python3.12 tools/photo_tiles.py <照片> <輸出目錄> [--grid 3x3] [--zoom 2]
  python3.12 tools/photo_tiles.py <照片> <輸出目錄> --box r2c3 --zoom 4   # 只放大某一格（看被圈、打叉、模糊的字）

輸出：overview.png（原圖縮小＋格線與格名 r1c1…）、r1c1.png…（每格放大，四邊各多 15% 重疊，字不會被切在邊上）。
2026-10-24 交辦 #4293：#4269 第 76 題我手動猜座標裁了 5 次才找到「大幅翁」那個字；
直排、照片有傾斜時座標很難一次猜中，改成先看 overview 選格、再讀那一格。
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


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("photo"); ap.add_argument("outdir")
    ap.add_argument("--grid", default="3x3", help="列x欄，預設 3x3")
    ap.add_argument("--zoom", type=float, default=2.0)
    ap.add_argument("--box", help="只輸出這一格（例如 r2c3）")
    a = ap.parse_args(argv)
    try:
        rows, cols = (int(x) for x in a.grid.lower().split("x"))
        assert rows > 0 and cols > 0 and 0.5 <= a.zoom <= 8
    except (ValueError, AssertionError):
        ap.error("--grid 要寫成 3x3 這種正整數格式，--zoom 要在 0.5～8 之間")   # 太小會裁成 0 像素崩潰（Codex 審 3a5da2a P3）
    if not Path(a.photo).is_file():
        ap.error(f"找不到照片：{a.photo}")
    img = ImageOps.exif_transpose(Image.open(a.photo)).convert("RGB")   # 手機照片常帶旋轉標記
    out = Path(a.outdir); out.mkdir(parents=True, exist_ok=True)
    w, h = img.size
    all_cells = list(cells(w, h, rows, cols))
    if a.box and a.box not in {n for n, _, _ in all_cells}:
        ap.error(f"沒有 {a.box} 這一格；可用 r1c1～r{rows}c{cols}")
    names = [f"{n}_x{a.zoom:g}.png" if a.box else f"{n}.png" for n, _, _ in all_cells if not a.box or n == a.box] + ([] if a.box else ["overview.png"])
    if Path(a.photo).resolve() in {(out / n).resolve() for n in names}:
        ap.error("輸出會蓋掉原照片：換一個輸出目錄")   # Codex 審 3a5da2a P2：照片放在輸出目錄且同名時會被覆寫
    written = []
    for name, box, _ in all_cells:
        if a.box and name != a.box:
            continue
        tile = img.crop(box)
        tile = tile.resize((int(tile.width * a.zoom), int(tile.height * a.zoom)), Image.LANCZOS)
        p = out / (f"{name}_x{a.zoom:g}.png" if a.box else f"{name}.png"); tile.save(p); written.append(p)
    if not a.box:
        scale = min(1.0, 1200 / max(w, h))
        ov = img.resize((int(w * scale), int(h * scale))); d = ImageDraw.Draw(ov)
        for name, _, (x, y) in all_cells:
            d.rectangle([x * scale, y * scale, (x + w / cols) * scale, (y + h / rows) * scale], outline=(255, 0, 0), width=2)
            d.text((x * scale + 6, y * scale + 4), name, fill=(255, 0, 0))
        p = out / "overview.png"; ov.save(p); written.insert(0, p)
    for p in written:
        print(p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
