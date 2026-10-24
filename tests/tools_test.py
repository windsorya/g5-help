#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""tools／測試工具的故障注入（Codex 審 41b02fe 抓到的四種，交辦 #2274）。跑法：python3.12 tests/tools_test.py
平行採字：任一瀏覽器行程被砍（負的結束碼）不能回 0；影片：whisper 失敗不能覆寫舊逐字稿、非公開不能回 0、一支出錯不能中止整批。"""
import sys
import tempfile
import types
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
sys.path.insert(0, str(ROOT / "tools"))
import e2e_kidtext  # noqa: E402
import video_check  # noqa: E402


class ParallelRc(unittest.TestCase):
    def test_killed_browser_is_failure(self):
        self.assertEqual(e2e_kidtext.overall_rc(0, [0, 0]), 0)
        self.assertEqual(e2e_kidtext.overall_rc(0, [-9, 0]), 1)      # 舊版 max([-9, 0]) = 0 ⇒ 回 0
        self.assertEqual(e2e_kidtext.overall_rc(0, [0, 1]), 1)
        self.assertEqual(e2e_kidtext.overall_rc(1, [0, 0]), 1)


class VideoCheck(unittest.TestCase):
    NAMES = ("run", "meta", "fetch", "transcribe", "tiles")

    def setUp(self):
        self.d = Path(tempfile.mkdtemp())
        self.real = {n: getattr(video_check, n) for n in self.NAMES}

    def tearDown(self):                                              # 每個測試換掉的函式都還原，測試之間不互相污染
        for n, f in self.real.items():
            setattr(video_check, n, f)

    def test_whisper_failure_keeps_old_transcript(self):
        old = self.d / "AAAAAAAAAAA.txt"
        old.write_text("[00:00] 舊的逐字稿\n", encoding="utf-8")
        video_check.run = lambda *a, **k: types.SimpleNamespace(returncode=1, stdout="", stderr="whisper 掛了")
        with self.assertRaises(RuntimeError):
            video_check.transcribe("AAAAAAAAAAA", self.d / "x.wav", self.d)
        self.assertEqual(old.read_text(encoding="utf-8"), "[00:00] 舊的逐字稿\n")

    def _check_with(self, metas, boom=()):
        video_check.meta = lambda v: dict(metas[v])
        video_check.fetch = lambda v, out: (out / f"{v}.mp4", out / f"{v}.wav")

        def tr(v, wav, out):
            if v in boom:
                raise RuntimeError("轉寫掛了")
            return 5
        seen = []
        video_check.transcribe = tr
        video_check.tiles = lambda v, mp4, times, out: seen.append(v) or out / f"{v}_tiles.jpg"
        rc = video_check.check(list(metas), self.d)
        return rc, seen

    def test_unlisted_is_not_ok(self):
        rc, _ = self._check_with({"BBBBBBBBBBB": {"id": "BBBBBBBBBBB", "embed": True, "availability": "unlisted", "duration": 60}})
        self.assertEqual(rc, 1)                                      # 舊版印「不能用」卻回 0

    def test_one_failure_does_not_stop_batch(self):
        metas = {v: {"id": v, "embed": True, "availability": "public", "duration": 60} for v in ("CCCCCCCCCCC", "DDDDDDDDDDD")}
        rc, seen = self._check_with(metas, boom={"CCCCCCCCCCC"})
        self.assertEqual(seen, ["DDDDDDDDDDD"])                      # 第一支出錯，第二支照做
        self.assertEqual(rc, 1)

    def test_bad_metadata_does_not_stop_batch(self):
        """Codex 審 556db59：第一支 yt-dlp 回壞 JSON（meta 丟例外），第二支照做、整批回 1。"""
        good = {"id": "GGGGGGGGGGG", "embed": True, "availability": "public", "duration": 60}

        def meta(v):
            if v == "FFFFFFFFFFF":
                raise ValueError("Expecting property name: line 1 column 2")
            return dict(good)
        video_check.meta = meta
        video_check.fetch = lambda v, out: (out / f"{v}.mp4", out / f"{v}.wav")
        video_check.transcribe = lambda v, wav, out: 5
        seen = []
        video_check.tiles = lambda v, mp4, times, out: seen.append(v) or out / f"{v}_tiles.jpg"
        rc = video_check.check(["FFFFFFFFFFF", "GGGGGGGGGGG"], self.d)
        self.assertEqual((rc, seen), (1, ["GGGGGGGGGGG"]))

    def test_all_good_is_zero(self):
        metas = {"EEEEEEEEEEE": {"id": "EEEEEEEEEEE", "embed": True, "availability": "public", "duration": 60}}
        rc, seen = self._check_with(metas)
        self.assertEqual((rc, seen), (0, ["EEEEEEEEEEE"]))


class PhotoTiles(unittest.TestCase):   # 交辦 #4293：看照片不再猜座標
    def setUp(self):
        from PIL import Image
        import photo_tiles
        self.pt = photo_tiles
        self.d = Path(tempfile.mkdtemp()); self.photo = self.d / "p.jpg"
        Image.new("RGB", (300, 400), "white").save(self.photo)

    def test_grid_covers_whole_photo_with_overlap(self):
        cells = list(self.pt.cells(300, 400, 3, 3))
        self.assertEqual(len(cells), 9)
        self.assertEqual(min(b[0] for _, b, _ in cells), 0); self.assertEqual(max(b[2] for _, b, _ in cells), 300)
        self.assertEqual(min(b[1] for _, b, _ in cells), 0); self.assertEqual(max(b[3] for _, b, _ in cells), 400)
        _, (x0, _, x1, _), _ = cells[1]
        self.assertLess(x0, 100); self.assertGreater(x1, 200)   # 中間那欄左右都多切一點，字不會剛好被切在邊上

    def run_pt(self, *args):
        try:
            return self.pt.main([str(a) for a in args])
        except SystemExit as e:
            return e.code

    def test_outputs_and_errors(self):
        out = self.d / "t"
        self.assertEqual(self.run_pt(self.photo, out), 0)
        self.assertEqual(sorted(p.name for p in out.iterdir())[0:2], ["overview.png", "r1c1.png"])
        self.assertEqual(len(list(out.glob("r*c*.png"))), 9)
        empty = self.d / "e"; empty.mkdir()
        self.assertEqual(self.run_pt(self.photo, empty, "--box", "r2c3", "--zoom", "4"), 0)   # 已存在但空的目錄可以
        self.assertEqual([p.name for p in empty.iterdir()], ["r2c3_x4.png"])
        for bad in (["nope.jpg", self.d / "n1"], [self.photo, self.d / "n2", "--grid", "0x3"], [self.photo, self.d / "n3", "--grid", "ax3"],
                    [self.photo, self.d / "n4", "--box", "r9c9"], [self.photo, self.d / "n5", "--zoom", "0"],
                    [self.photo, self.d / "n6", "--zoom", "0.001"], [self.photo, self.d / "n7", "--grid", "3x400"]):
            with self.subTest(bad=bad):
                self.assertNotEqual(self.run_pt(*bad), 0)
                self.assertFalse(bad[1].exists() if isinstance(bad[1], Path) else False)   # 參數錯在建目錄前就擋

    def test_rerun_into_previous_output_is_refused_and_untouched(self):
        out = self.d / "t"; self.assertEqual(self.run_pt(self.photo, out), 0)
        before = {p.name: p.read_bytes() for p in out.iterdir()}
        for args in ([], ["--box", "r1c1"]):
            with self.subTest(args=args):
                self.assertNotEqual(self.run_pt(self.photo, out, *args), 0)
                self.assertEqual({p.name: p.read_bytes() for p in out.iterdir()}, before)

    def test_never_overwrites_source_photo(self):   # Codex 審 3a5da2a／e1e16ec：同名、大小寫別名、symlink、hardlink、捷徑目錄
        import os
        from PIL import Image
        for i, name in enumerate(("r1c1.png", "R1C1.PNG")):   # 目錄名用編號：Mac 檔案系統不分大小寫
            with self.subTest(name=name):
                d = self.d / f"same{i}"; d.mkdir(); src = d / name
                Image.new("RGB", (300, 400), "white").save(src); raw = src.read_bytes()
                self.assertNotEqual(self.run_pt(src, d), 0); self.assertEqual(src.read_bytes(), raw)
        for kind in ("symlink", "hardlink", "hidden", "subdir", "broken"):
            with self.subTest(kind=kind):
                d = self.d / ("k_" + kind); d.mkdir(); raw = self.photo.read_bytes()
                if kind == "symlink": (d / "r1c1.png").symlink_to(self.photo)
                elif kind == "hardlink": os.link(self.photo, d / "r1c1.png")
                elif kind == "hidden": (d / ".DS_Store").write_text("x")
                elif kind == "subdir": (d / "sub").mkdir()
                else: (d / "dead").symlink_to(self.d / "missing")
                self.assertNotEqual(self.run_pt(self.photo, d), 0); self.assertEqual(self.photo.read_bytes(), raw)
        link = self.d / "linkdir"; link.symlink_to(self.d)
        self.assertNotEqual(self.run_pt(self.photo, link), 0)

    def test_exclusive_create_even_if_file_appears_late(self):   # 檢查完到寫入之間冒出同名檔：xb 失敗、既有內容不動
        out = self.d / "late"; out.mkdir(); real = self.pt.save_new
        def sneaky(img, path):
            if path.name == "r1c2.png": path.write_bytes(b"keep")
            return real(img, path)
        self.pt.save_new = sneaky
        try:
            self.assertEqual(self.run_pt(self.photo, out), 1)
        finally:
            self.pt.save_new = real
        self.assertEqual((out / "r1c2.png").read_bytes(), b"keep")

    def test_tiny_photo_zoom_half(self):
        from PIL import Image
        tiny = self.d / "tiny.png"; Image.new("RGB", (3, 3), "white").save(tiny)
        out = self.d / "tiny_out"
        self.assertEqual(self.run_pt(tiny, out, "--zoom", "0.5"), 0)
        self.assertEqual(len(list(out.glob("r*c*.png"))), 9)
        for p in out.glob("r*c*.png"):
            self.assertGreaterEqual(min(Image.open(p).size), 1)


class CodexSend(unittest.TestCase):   # 交辦 #4293：prompt 一定在 -i 前、檔首有圍籬、在暫存目錄也能跑
    def setUp(self):
        import os, subprocess
        self.os, self.sp = os, subprocess
        self.d = Path(tempfile.mkdtemp()); self.bin = self.d / "bin"; self.bin.mkdir()
        fake = self.bin / "codex"
        # 假 codex：記下參數；-o 後面那個檔寫入回答（回答裡故意含「codex」「tokens used」獨立行，舊的紀錄擷取法會截斷）
        fake.write_text("#!/bin/sh\nprintf '%s\\n' \"$@\" > \"$FAKE_ARGS\"\nwhile [ $# -gt 0 ]; do if [ \"$1\" = -o ]; then printf '答案第一行\\ncodex\\ntokens used\\n最後一行\\n' > \"$2\"; fi; shift; done\nprintf 'header\\ncodex\\n雜訊\\ntokens used\\n9\\n'\nexit \"${FAKE_RC:-0}\"\n")
        fake.chmod(0o755)
        self.brief = self.d / "brief.md"; self.brief.write_text("請核字\n")
        self.photo = self.d / "p.jpg"; self.photo.write_bytes(b"x")

    def run_send(self, *args, rc=0):
        env = dict(self.os.environ, PATH=str(self.bin) + ":" + self.os.environ["PATH"], FAKE_ARGS=str(self.d / "args.txt"), FAKE_RC=str(rc))
        return self.sp.run(["zsh", str(ROOT / "tools/codex_send.sh"), *args], env=env, capture_output=True, text=True, timeout=30)

    def test_order_fence_and_answer(self):
        out = self.d / "out.txt"
        p = self.run_send(str(self.brief), str(out), str(self.photo))
        self.assertEqual(p.returncode, 0, p.stderr)
        args = (self.d / "args.txt").read_text().split("\n")
        self.assertIn("--skip-git-repo-check", args)
        prompt_at = next(i for i, a in enumerate(args) if a.startswith("## 🔒 讀取範圍硬邊界"))
        self.assertLess(prompt_at, args.index("-i"))                 # 舊錯：-i 在前會吃掉 prompt
        self.assertIn("請核字", "\n".join(args[prompt_at:args.index("-i")]))
        self.assertEqual(args[args.index("-i") + 1], str(self.photo.resolve()))
        self.assertTrue(out.read_text().rstrip().endswith("rc=0"))
        self.assertEqual((self.d / "out.answer.txt").read_text(), "答案第一行\ncodex\ntokens used\n最後一行\n")
        self.assertEqual(Path(args[args.index("-o") + 1]).resolve(), (self.d / "out.answer.txt").resolve())

    def test_existing_fence_not_doubled_and_failures(self):
        self.brief.write_text("## 🔒 讀取範圍硬邊界（自訂）\n內容\n")
        self.assertEqual(self.run_send(str(self.brief), str(self.d / "o.txt")).returncode, 0)
        self.assertEqual((self.d / "args.txt").read_text().count("讀取範圍硬邊界"), 1)
        self.assertEqual(self.run_send(str(self.brief), str(self.d / "o.txt"), rc=3).returncode, 3)   # codex 失敗要照實回
        self.assertEqual(self.run_send(str(self.brief)).returncode, 2)
        self.assertEqual(self.run_send(str(self.d / "none.md"), str(self.d / "o.txt")).returncode, 2)
        self.assertEqual(self.run_send(str(self.brief), str(self.d / "o.txt"), str(self.d / "no.jpg")).returncode, 2)

    def test_fence_word_in_body_still_gets_fence(self):   # Codex 審 d18b20f：內文提到「讀取範圍硬邊界」不等於已有圍籬
        self.brief.write_text("請確認讀取範圍硬邊界是否足夠。\n")
        self.assertEqual(self.run_send(str(self.brief), str(self.d / "o.txt")).returncode, 0)
        args = (self.d / "args.txt").read_text().split("\n")
        self.assertTrue(args[args.index("-o") + 2].startswith("## 🔒 讀取範圍硬邊界"), args[:7])

    def test_relative_output_path(self):   # Codex 審 d18b20f：相對輸出路徑不能因 cd 錯位
        sub = self.d / "docs"; sub.mkdir(); (sub / "b.md").write_text("x\n")
        env = dict(self.os.environ, PATH=str(self.bin) + ":" + self.os.environ["PATH"], FAKE_ARGS=str(self.d / "args.txt"))
        p = self.sp.run(["zsh", str(ROOT / "tools/codex_send.sh"), "docs/b.md", "docs/r.txt"], cwd=self.d, env=env, capture_output=True, text=True, timeout=30)
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertTrue((sub / "r.txt").is_file()); self.assertTrue((sub / "r.answer.txt").is_file())
        self.assertFalse((sub / "docs").exists())
        self.assertEqual(self.run_send(str(self.brief), str(self.d / "nodir" / "o.txt")).returncode, 2)


if __name__ == "__main__":
    unittest.main()
