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
