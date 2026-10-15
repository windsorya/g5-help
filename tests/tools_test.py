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

    def test_all_good_is_zero(self):
        metas = {"EEEEEEEEEEE": {"id": "EEEEEEEEEEE", "embed": True, "availability": "public", "duration": 60}}
        rc, seen = self._check_with(metas)
        self.assertEqual((rc, seen), (0, ["EEEEEEEEEEE"]))


if __name__ == "__main__":
    unittest.main()
