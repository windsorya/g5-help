#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""最新完整 verify → 固定內容快照 → commit → DOM 重跑 → 固定 SHA。

No test-mode switch. Offline tests replace files/executables in standalone
fixture repos. Local receipts are evidence, not adversarial signatures.
"""
import concurrent.futures
import contextlib
import fcntl
import hashlib
from importlib.metadata import version
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import signal
import subprocess
import sys
import threading
import time
import uuid

ROOT = Path(__file__).absolute().parent.parent
SCHEMA = 1
ALGORITHM = 'sha256-manifest-v1'
STATE = '.post-state'
SNAPSHOTS = '.post-snapshots'
HARVEST = 'tests/kidtext_harvest.json'
OUTPUTS = {'index.html', 'sync.js', 'qrcode.js', 'upload.js', HARVEST}
GATES = {'build', 'quick', 'tools', 'kid', 'e2e', 'standard', 'node'}
GATE_TIMEOUT = 900
LIVE_URL = 'https://windsorya.github.io/g5-help/'
# cap-why: 每輪 verify／ship 各留一份約 2.6 MB 快照（2026-10-22 實測）；ship 的正式站背景 e2e 從快照跑約 5 分鐘（2026-10-15 實測）⇒ 留 1 天遠大於此
RETENTION = 24 * 3600


class Rejected(Exception):
    pass


def sha(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':'), allow_nan=False).encode()


def strict_json(data):
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise ValueError('JSON 重複鍵：' + key)
            result[key] = value
        return result

    def constant(value):
        raise ValueError('JSON 非法值：' + value)
    return json.loads(data, object_pairs_hook=pairs, parse_constant=constant)


def normalized(rel, data):
    if rel == HARVEST:
        try:
            return canonical(strict_json(data))
        except (ValueError, UnicodeError) as exc:
            raise Rejected(f'採字內容不合格：{exc}') from exc
    return data


def excluded(rel):
    parts = PurePosixPath(rel).parts
    return parts[0] in {'.git', STATE, SNAPSHOTS} or '__pycache__' in parts or rel == HARVEST + '.lock'


def safe_name(rel):
    path = PurePosixPath(rel)
    if path.is_absolute() or '..' in path.parts or not path.parts or str(path) != rel:
        raise Rejected(f'來源路徑不合法：{rel}')
    for part in path.parts:
        low = part.lower()
        if ('.env' in low or low.endswith(('.pem', '.key', '.p12', '.pfx'))
                or low in {'id_rsa', 'id_ed25519', 'credentials', 'credentials.json', 'secrets.json'}):
            raise Rejected(f'來源含金鑰／.env 路徑，未讀取：{rel}')


def git(root, *args):
    p = subprocess.run(['git', *args], cwd=root, capture_output=True, timeout=30)
    if p.returncode:
        raise Rejected('Git 內容檢查失敗：' + p.stderr.decode(errors='replace').strip())
    return p.stdout


def index_entries(root):
    entries = {}
    for row in git(root, 'ls-files', '-s', '-z').split(b'\0'):
        if not row:
            continue
        meta, name = row.split(b'\t', 1)
        mode, oid, stage = meta.decode().split()
        rel = name.decode()
        if stage != '0':
            raise Rejected(f'暫存區尚有衝突：{rel}')
        safe_name(rel)
        if mode not in {'100644', '100755'}:
            raise Rejected(f'來源不是一般檔案／有 symlink：{rel}')
        if not excluded(rel):
            entries[rel] = (mode, oid)
    return entries


def working_files(root, tracked):
    """Include ignored/untracked assets too; never follow any symlink.

    Only untracked *.bak.* and named runtime artifacts are excluded.
    """
    out = {}

    def walk(folder, prefix=''):
        for child in sorted(os.scandir(folder), key=lambda x: x.name):
            rel = prefix + child.name
            if excluded(rel):
                continue
            safe_name(rel)
            if child.is_symlink():
                raise Rejected(f'來源有 symlink，未展開：{rel}')
            if child.is_dir(follow_symlinks=False):
                walk(child.path, rel + '/')
            elif child.is_file(follow_symlinks=False):
                if '.bak.' in child.name and rel not in tracked:
                    continue
                mode = '100755' if child.stat(follow_symlinks=False).st_mode & 0o111 else '100644'
                out[rel] = (mode, Path(child.path).read_bytes())
            else:
                raise Rejected(f'來源不是一般檔案：{rel}')
    walk(root)
    return out


def blob_files(root, commit=None):
    if commit is None:
        entries = index_entries(root)
    else:
        entries = {}
        for row in git(root, 'ls-tree', '-rz', commit).split(b'\0'):
            if not row:
                continue
            meta, name = row.split(b'\t', 1)
            mode, kind, oid = meta.decode().split(); rel = name.decode()
            safe_name(rel)
            if kind != 'blob' or mode not in {'100644', '100755'}:
                raise Rejected(f'commit 有非一般檔案／symlink：{rel}')
            if not excluded(rel):
                entries[rel] = (mode, oid)
    return {rel: (mode, git(root, 'cat-file', 'blob', oid)) for rel, (mode, oid) in entries.items()}


def manifest(files):
    return {rel: {'mode': mode, 'sha256': sha(normalized(rel, data))}
            for rel, (mode, data) in sorted(files.items())}


def changes(a, b):
    return sorted(rel for rel in a.keys() | b.keys() if a.get(rel) != b.get(rel))


def atomic_receipt(path, data):
    """Failed write/readback cannot leave a success authorizing ship."""
    tmp = path.with_name(path.name + '.' + uuid.uuid4().hex + '.tmp')
    try:
        with tmp.open('xb') as f:
            f.write(canonical(data)); f.flush(); os.fsync(f.fileno())
        os.replace(tmp, path)
        if strict_json(path.read_bytes()) != data:
            raise OSError('寫入後讀回不符')
        fd = os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(fd)
        finally:
            os.close(fd)
    except (OSError, ValueError) as exc:
        with contextlib.suppress(OSError):
            path.unlink()
        raise Rejected(f'收據儲存失敗：{exc}') from exc
    finally:
        with contextlib.suppress(OSError):
            tmp.unlink()


def safe_directory(root, rel):
    p = root / rel
    if p.is_symlink():
        raise Rejected(f'執行產物目錄是 symlink：{rel}')
    p.mkdir(exist_ok=True)
    return p


def prune(root):
    """持鎖時清掉超過 RETENTION 的本工具執行產物（快照、log 目錄）；只碰兩個具名目錄的直屬子目錄，不跟 symlink。

    清理失敗只警告：清不掉舊快照不影響這一輪受測內容。
    """
    cutoff = time.time() - RETENTION
    for rel in (SNAPSHOTS, STATE):
        base = root / rel
        if base.is_symlink() or not base.is_dir():
            continue
        for child in os.scandir(base):
            try:
                if child.is_symlink() or not child.is_dir(follow_symlinks=False):
                    continue
                if child.stat(follow_symlinks=False).st_mtime < cutoff:
                    shutil.rmtree(child.path)
            except OSError as exc:
                print(f'警告：舊執行產物清不掉（不影響本輪）：{child.path}：{exc}', flush=True)


@contextlib.contextmanager
def lock(root):
    state = safe_directory(root, STATE)
    path = state / 'lock'
    if path.is_symlink() or (state / 'latest.json').is_symlink():
        raise Rejected('收據／鎖有 symlink，未讀取')
    with path.open('a') as f:
        try:
            fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise Rejected('驗證／發布進行中，請等目前這輪結束') from exc
        yield state / 'latest.json'


# 上線車道（2026-10-24 交辦 #4247 復盤）：三個視窗各在自己的工作樹做難題，誰先推 main，其他人已跑完的 verify 就作廢
# （zh-q52-siyi：rebase 後整套重跑 6 分鐘；同時三組瀏覽器搶 CPU，每輪採字由約 1 分拖到 5–6 分）。
# 車道存在所有工作樹共用的 git common dir：verify 開始先排隊拿車道，成功後保留給自己的 ship，ship 結束（成或敗）交還。
# 當掉的視窗靠到期自動讓出。
# 定位（2026-10-24 範圍收斂，升級階梯：Codex 審 c6b36da／d48c755／28fbc21 連三輪 FAIL、設計者出租約 token＋狀態機方案 A，成本高）：
#   車道＝**排隊與提早偵測的效率工具，不是安全閘**；lane_heartbeat／lane_confirm 盡力偵測「中途被接手」，擋得到就早點擋。
#   main 的正確性（推上去的一定是驗過的那個組合）不靠車道，靠兩道確定的檢查：
#   ①ship 推前 base_current：origin/main 比受測 commit 新就不推；②git push 固定 SHA、不 force，非快轉一律被遠端拒絕 ⇒「推不上去」、不回寫進度。
#   車道失誤的最壞結果＝白跑一輪 verify，不是錯誤上線。要升級成硬保證時照設計者方案 A（devlog 2026-10-24 第52題復盤）。
# cap-why: verify 在負載 25–43 下實測 314–359 秒（2026-10-24），排隊者最多等一輪 verify＋ship ⇒ 車道 15 分到期
LANE_TTL = 15 * 60
# cap-why: verify 成功到 ship 中間只有 add／commit（實測 1 分內）；10 分鐘還沒 ship 就讓給排隊的人
LANE_SHIP_GRACE = 10 * 60


def lane_paths(root):
    p = subprocess.run(['git', 'rev-parse', '--git-common-dir'], cwd=root, capture_output=True, text=True, timeout=30)
    if p.returncode:
        raise Rejected('讀不到 git common dir，無法排上線車道')
    common = (Path(root) / p.stdout.strip()).resolve()
    return common / 'post-lane.lock', common / 'post-lane.json'


def lane_holder(state_file):
    try:
        cur = json.loads(state_file.read_text())
    except (OSError, ValueError):
        return None
    if not isinstance(cur, dict) or cur.get('until', 0) < time.time() or not Path(str(cur.get('root', ''))).is_dir():
        return None
    return cur


def lane_update(root, until, take):
    """take=True：沒人持有（或是自己）就寫入並回 None，否則回持有者；take=False：自己持有才改到期時間／交還（until=0）。"""
    lock_file, state_file = lane_paths(root)
    root = Path(root).resolve()   # /var 與 /private/var 這類別名要當成同一棵
    with lock_file.open('a') as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        cur = lane_holder(state_file)
        mine = cur is not None and cur.get('root') == str(root)
        if cur is not None and not mine:
            return cur
        if take or mine:
            if until:
                tmp = state_file.with_name(state_file.name + '.tmp-' + uuid.uuid4().hex)
                tmp.write_text(json.dumps({'root': str(root), 'until': until, 'pid': os.getpid()}))
                os.replace(tmp, state_file)
            else:
                state_file.unlink(missing_ok=True)
        return None


def lane_take(root):
    last = 0
    while True:
        holder = lane_update(root, time.time() + LANE_TTL, True)
        if holder is None:
            return
        if time.time() - last >= 60:
            left = max(0, int(holder['until'] - time.time()))
            print(f'上線車道由 {holder["root"]} 使用中（最晚 {left // 60} 分 {left % 60} 秒後讓出）；排隊等它推完', flush=True)
            last = time.time()
        time.sleep(10)


def lane_release(root):
    with contextlib.suppress(Exception):
        lane_update(root, 0, False)


# cap-why: 租期 15 分、每分鐘續一次＝續租失敗 14 次才會過期；verify／ship 本身可能超過租期（Codex 審 c6b36da P2：執行中沒有續租，601 秒後別人就拿得到）
LANE_BEAT = 60


@contextlib.contextmanager
def lane_heartbeat(root):
    """執行中每分鐘續租；續租時發現已被別棵接手就記下 lost 並停。
    lost 一旦設下就不會清掉：對方之後交還、本棵再拿回，也不算持續持有（Codex 審 d48c755 P2）。"""
    stop, lost = threading.Event(), threading.Event()
    def beat():
        while not stop.wait(LANE_BEAT):
            with contextlib.suppress(Exception):
                if lane_update(root, time.time() + LANE_TTL, True) is not None:
                    lost.set(); return
    t = threading.Thread(target=beat, daemon=True); t.start()
    try:
        yield lost
    finally:
        stop.set(); t.join(5)


def lane_confirm(root, until, what, lost):
    """關鍵時刻（verify 寫完成功收據後、ship 推之前）確認車道從頭到尾都在自己手上並延到 until；中途被接手過就擋（Codex 審 c6b36da、d48c755 P2）。"""
    if lost.is_set():
        raise Rejected(f'{what}期間上線車道曾被別棵接手（租期過了）：請等它推完，rebase 後重新 verify')
    holder = lane_update(root, until, True)
    if holder is not None:
        lost.set()
        raise Rejected(f'{what}期間上線車道已被 {holder["root"]} 接手（租期過了）：請等它推完，rebase 後重新 verify')


def union_conflicts(text):
    """把衝突標記換成「上游那段＋本棵那段」：src/hard.js 兩邊各在 LIST 尾端加一篇時，兩篇都留。合錯由接著跑的整套 verify 擋。"""
    # 只合「兩邊都是純新增」的衝突：diff3 的原本那段（||||||| 到 =======）必須是空的；
    # 兩邊改到同一段既有內容（例如同一篇的 answer）串接起來會變成兩個同名屬性、上游修改被蓋掉，verify 也抓不到（Codex 審 0133d34 P1）⇒ 不合。
    out, mode, up, base, mine, saw_base = [], None, [], [], [], False
    for line in text.splitlines(keepends=True):
        if line.startswith('<<<<<<< '):
            mode, up, base, mine, saw_base = 'up', [], [], [], False
        elif line.startswith('||||||| ') and mode == 'up':
            mode, saw_base = 'base', True
        elif line.startswith('=======') and mode in ('up', 'base'):
            mode = 'mine'
        elif line.startswith('>>>>>>> ') and mode == 'mine':
            if not saw_base or base:   # 原本那段連空白行都不能有（空白行被兩邊各換成內容也是改既有內容，Codex 審 3399007）
                raise Rejected('src/hard.js 兩邊改到同一段既有內容（不是各自新增一篇），未自動合併')
            out += up + mine; mode = None
        elif mode == 'up':
            up.append(line)
        elif mode == 'base':
            base.append(line)
        elif mode == 'mine':
            mine.append(line)
        else:
            out.append(line)
    if mode is not None:
        raise Rejected('衝突標記不完整，未自動合併')
    return ''.join(out)


def auto_rebase(root, upstream):
    """merge queue 的作法（GitHub merge queue／bors）：輪到你時把你接到最新 main 上再測，不把你踢回隊尾（#4260 實測：連 3 次排完隊才被告知要 rebase，每次白等約 5 分）。
    只自動處理兩種衝突：建置產物（取 main 的，verify 會重建）、src/hard.js（兩邊都留）；其他衝突一律放棄 rebase、回到原狀擋下。"""
    env = {**os.environ, 'GIT_EDITOR': 'true', 'GIT_CONFIG_COUNT': '1', 'GIT_CONFIG_KEY_0': 'merge.conflictStyle', 'GIT_CONFIG_VALUE_0': 'diff3'}   # diff3：看得到原本那段
    run = lambda *a: subprocess.run(['git', *a], cwd=root, capture_output=True, text=True, timeout=120, env=env)
    if run('status', '--porcelain', '--untracked-files=no').stdout.strip():
        raise Rejected('origin/main 比 HEAD 新，而且有未提交的改動：先 commit，再 verify（會自動 rebase）')
    before = run('rev-parse', 'HEAD').stdout.strip()
    try:
        p = run('rebase', upstream)
        for _ in range(50):   # cap-why: 每輪處理一個本棵 commit；本流程一篇最多幾個 commit，50 只是防無窮迴圈
            if p.returncode == 0:
                print(f'origin/main 比 HEAD 新：已自動 rebase（{before[:7]} → {run("rev-parse", "HEAD").stdout.strip()[:7]}），接著驗證', flush=True)
                return
            conflicted = [f for f in run('diff', '--name-only', '--diff-filter=U').stdout.split('\n') if f]
            if not conflicted or not set(conflicted) <= OUTPUTS | {'src/hard.js'}:
                raise Rejected('origin/main 比 HEAD 新，自動 rebase 有無法自動處理的衝突（' + ', '.join(conflicted) + '）：請手動 git rebase origin/main 後再 verify')
            for f in conflicted:
                if f == 'src/hard.js':
                    path = Path(root) / f
                    path.write_text(union_conflicts(path.read_text()))
                else:
                    run('checkout', '--ours', '--', f)   # rebase 中 ours＝上游 main
                run('add', '--', f)
            p = run('rebase', '--continue')
        raise Rejected('自動 rebase 沒有收斂，已還原：請手動 rebase')
    except BaseException:
        # 任何失敗（含逾時、合併被拒）都還原到 rebase 前，不留半套 rebase（Codex 審 0133d34 P2）
        with contextlib.suppress(Exception):
            subprocess.run(['git', 'rebase', '--abort'], cwd=root, capture_output=True, timeout=120, env=env)
        raise


def base_current(root, auto=False):
    """排到車道後先看 origin/main 有沒有比 HEAD 新：verify 開頭（auto）自動 rebase；ship 推前則舊了就擋。連不上只警告。"""
    p = subprocess.run(['git', 'fetch', '-q', 'origin', 'main'], cwd=root, capture_output=True, timeout=60)
    if p.returncode:
        print('警告：抓不到 origin/main，略過「base 是否最新」檢查', flush=True)
        return
    upstream = subprocess.run(['git', 'rev-parse', 'FETCH_HEAD'], cwd=root, capture_output=True, text=True, timeout=30).stdout.strip()
    p = subprocess.run(['git', 'merge-base', '--is-ancestor', upstream, 'HEAD'], cwd=root, capture_output=True, timeout=30)
    if p.returncode == 1:
        if auto:
            auto_rebase(root, upstream)
            return
        raise Rejected('origin/main 比 HEAD 新：先 git rebase origin/main（src/hard.js 尾端衝突時兩篇都留、index.html 與採字檔取 main 的，verify 會重建），再 verify')


# 只管「改變 git 讀哪份內容」的變數；編輯器／分頁器／推送傳輸不影響受測內容。
# 2026-10-22 真入口首跑：Claude Code 的 shell 一律帶 GIT_EDITOR，原寫法讓 CC 每次 verify 都被拒（離線替身測試的 env 是乾淨的，抓不到）。
GIT_ENV_OK = {'GIT_CONFIG_NOSYSTEM', 'GIT_CONFIG_GLOBAL', 'GIT_EDITOR', 'GIT_SEQUENCE_EDITOR', 'GIT_PAGER',
              'GIT_TERMINAL_PROMPT', 'GIT_ASKPASS', 'GIT_SSH', 'GIT_SSH_COMMAND'}


def environment_check():
    bad = [k for k in os.environ if k.startswith(('G5_', 'GIT_')) and k not in GIT_ENV_OK]
    bad += [k for k in ('PYTHONPATH', 'PYTHONHOME', 'NODE_OPTIONS', 'NODE_PATH', 'BASH_ENV', 'ENV', 'ZDOTDIR') if os.environ.get(k)]
    if bad:
        raise Rejected('非正式來源／執行環境：' + ', '.join(sorted(set(bad))))


def runtime():
    p = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=30)
    if p.returncode or not p.stdout.strip():
        raise Rejected('無法確認 node 執行版本')
    return {'python': sys.version, 'node': p.stdout.strip(), 'playwright': version('playwright')}


def snapshot(root, run_id, files):
    base = safe_directory(root, SNAPSHOTS)
    target = base / run_id; target.mkdir()
    for rel, (mode, data) in files.items():
        safe_name(rel)
        p = target / rel; p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data); p.chmod(0o755 if mode == '100755' else 0o644)
    if manifest(working_files(target, files)) != manifest(files):
        raise Rejected('快照寫入後內容不符')
    return target


def run_gate(name, command, cwd, logs):
    """Own process group: timeout also kills children; nonzero/signal is failure."""
    log = logs / (name + '.log'); started = time.time()
    with log.open('wb') as f:
        p = subprocess.Popen(command, cwd=cwd, stdout=f, stderr=subprocess.STDOUT, start_new_session=True)
        try:
            rc = p.wait(timeout=GATE_TIMEOUT)
        except BaseException as exc:
            with contextlib.suppress(ProcessLookupError):
                os.killpg(p.pid, signal.SIGKILL)
            p.wait()
            if not isinstance(exc, subprocess.TimeoutExpired):
                raise
            rc = 124
    print(f'{name} rc={rc}', flush=True)
    if rc:
        print(log.read_text(errors='replace')[-12000:], flush=True)
    return {'rc': rc, 'completed': True, 'started': started, 'finished': time.time()}


def load_flake(log):
    """Playwright timed out and no test verdict failed: a busy machine, not a content bug."""
    text = log.read_text(errors='replace')
    return ('playwright._impl._errors.TimeoutError' in text
            and not re.search(r'^(?:FAIL|PROBLEM) ', text, re.M))


def need_gate(name, result, prefix='驗證失敗'):
    if result['rc'] != 0:
        raise Rejected(f'{prefix}：{name} rc={result["rc"]}')


def node_tests(files):
    return sorted(rel for rel in files if PurePosixPath(rel).parent == PurePosixPath('tests') and rel.endswith('.test.js'))


def harvest_evidence(files):
    try:
        h = strict_json(files[HARVEST][1])
        if h['max'] != 40 or h['self_max'] != 40 or set(h['browsers']) != {'chromium', 'webkit'}:
            raise ValueError('缺少本輪兩個瀏覽器或正式上限不符')
        expected = {'index_sha256': sha(files['index.html'][1]), 'kidgate_sha256': sha(files['tests/kidgate.js'][1]),
                    'driver_sha256': sha(files['tests/e2e_kidtext.py'][1])}
        for field, value in expected.items():
            if h[field] != value:
                raise ValueError('頂層採字雜湊不符：' + field)
        evidence = {}
        for name, b in h['browsers'].items():
            if b['max'] != 40 or b['errors'] != [] or b['violations'] != []:
                raise ValueError(name + ' 採字不合格')
            if not isinstance(b['cases'], list) or not b['cases'] or not isinstance(b['branches'], list):
                raise ValueError(name + ' 缺少案例／分支')
            if not b['selftests'] or any(v['ok'] is not True for v in b['selftests'].values()):
                raise ValueError(name + ' 自檢未成功')
            if type(b['snapshots']) is not int or b['snapshots'] <= 0:
                raise ValueError(name + ' 沒有採字快照')
            for field, value in expected.items():
                if b[field] != value:
                    raise ValueError(name + ' 採字過期：' + field)
            evidence[name] = {'sha256': sha(canonical(b)), **expected}
        return evidence
    except (KeyError, ValueError, TypeError, AttributeError) as exc:
        raise Rejected(f'採字內容改變／不合格：{exc}') from exc


def read_receipt(path):
    if not path.exists():
        raise Rejected('缺少完整成功收據，請跑 verify')
    try:
        r = strict_json(path.read_bytes())
        if r.get('status') == 'running':
            raise Rejected('最近 verify 未完成，請重新跑 verify')
        if r.get('status') == 'failed':
            raise Rejected('最近 verify 未成功：' + r.get('reason', '未知原因'))
        for key in ('schema', 'algorithm', 'status', 'run_id', 'manifest', 'digest', 'gates', 'finished', 'harvest', 'node_tests', 'runtime'):
            if key not in r:
                raise ValueError('缺少 ' + key)
        if r['schema'] != SCHEMA or r['algorithm'] != ALGORITHM or r['status'] != 'success':
            raise ValueError('schema／algorithm／status')
        if not isinstance(r['run_id'], str) or not r['run_id'] or type(r['finished']) not in {float, int} or r['finished'] <= 0:
            raise ValueError('run_id／finished')
        if not isinstance(r['manifest'], dict) or not r['manifest'] or r['digest'] != sha(canonical(r['manifest'])):
            raise ValueError('digest／manifest')
        for rel, entry in r['manifest'].items():
            safe_name(rel)
            if set(entry) != {'mode', 'sha256'} or entry['mode'] not in {'100644', '100755'} or not re.fullmatch('[a-f0-9]{64}', entry['sha256']):
                raise ValueError('manifest entry ' + rel)
        if set(r['gates']) != GATES:
            raise ValueError('gate 名單不完整')
        for name, g in r['gates'].items():
            if type(g['rc']) is not int or g['rc'] != 0 or g['completed'] is not True or not (0 < g['started'] <= g['finished'] <= r['finished']):
                raise ValueError('gate 未成功／未完成：' + name)
        if r['node_tests'] != node_tests(r['manifest']) or not r['node_tests']:
            raise ValueError('node_tests')
        if set(r['harvest']) != {'chromium', 'webkit'}:
            raise ValueError('harvest')
        if set(r['runtime']) != {'python', 'node', 'playwright'} or not all(isinstance(v, str) and v for v in r['runtime'].values()):
            raise ValueError('runtime')
        return r
    except (ValueError, TypeError, KeyError, AttributeError) as exc:
        raise Rejected(f'收據無效：{exc}') from exc


def verify(root, receipt):
    run_id = uuid.uuid4().hex
    running = {'status': 'running', 'run_id': run_id, 'started': time.time()}
    atomic_receipt(receipt, running)  # Revoke prior success before any validation.
    try:
        environment_check()
        files = working_files(root, index_entries(root)); before = manifest(files)
        versions = runtime(); snap = snapshot(root, run_id, files)
        logs = safe_directory(root, STATE) / run_id; logs.mkdir()
        print(f'快照：{snap}\nlog：{logs}', flush=True)
        (snap / HARVEST).unlink(missing_ok=True)
        gates = {}
        commands = {
            'build': [sys.executable, 'build.py'],
            'quick': ['node', '--test', '--test-name-pattern=快篩', 'tests/hard.test.js'],
            'tools': [sys.executable, 'tests/tools_test.py'],
            'kid': [sys.executable, 'tests/e2e_kidtext.py', '--parallel'],
            'e2e': [sys.executable, 'tests/e2e.py'],
            'standard': [sys.executable, 'tests/e2e_standard.py'],
            'node': ['node', '--test', *node_tests(files)],
        }
        for name in ('build', 'quick', 'tools'):
            gates[name] = run_gate(name, commands[name], snap, logs); need_gate(name, gates[name])
            if name == 'build':
                built = manifest(working_files(snap, files))
                if set(changes(before, built)) - OUTPUTS:
                    raise Rejected('build 改寫非建置產物')
            if name == 'quick':
                found = re.findall(r'^(?:ℹ |# )?pass (\d+)\s*$', (logs/'quick.log').read_text(), re.M)
                if not found or int(found[-1]) < 4:
                    raise Rejected('quick 快篩實際執行不足四條')
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
            jobs = {name: pool.submit(run_gate, name, commands[name], snap, logs) for name in ('kid', 'e2e', 'standard')}
            for name, job in jobs.items():
                gates[name] = job.result()
        # 2026-10-24 交辦 #4260：三個視窗同時跑瀏覽器（負載 130），e2e 的點擊因「元素不穩定」30 秒逾時，內容沒錯卻整套重跑 5 分鐘。
        # 只有「Playwright 逾時、且沒有任何 FAIL／PROBLEM 判定」的那一道，等其他道跑完後單獨重跑一次；重跑仍要全過，第一次的 log 留著、收據記 retried。
        for name in ('kid', 'e2e', 'standard'):
            if gates[name]['rc'] and load_flake(logs / (name + '.log')):
                first = gates[name]; os.replace(logs / (name + '.log'), logs / (name + '.try1.log'))
                print(f'{name}：只有 Playwright 逾時、沒有判定失敗（系統忙時的偶發），單獨重跑一次', flush=True)
                gates[name] = {**run_gate(name, commands[name], snap, logs), 'retried': first['rc']}
        for name in ('kid', 'e2e', 'standard'):
            need_gate(name, gates[name])
        gates['node'] = run_gate('node', commands['node'], snap, logs); need_gate('node', gates['node'])
        after_files = working_files(snap, files); after = manifest(after_files)
        unexpected = set(changes(built, after)) - {HARVEST}
        if unexpected:
            raise Rejected('測試改寫非產物檔案：' + ', '.join(sorted(unexpected)))
        evidence = harvest_evidence(after_files)
        if manifest(working_files(root, index_entries(root))) != before:
            raise Rejected('測試期間原工作區內容已變，未回填；請重新 verify')
        for rel in sorted(OUTPUTS & after_files.keys()):
            if manifest(working_files(root, index_entries(root))) != before:
                raise Rejected('回填期間原工作區內容已變，停止回填')
            mode, data = after_files[rel]
            dest = root / rel; dest.parent.mkdir(parents=True, exist_ok=True)
            temp = dest.with_name(dest.name + '.post-tmp-' + run_id)
            try:
                temp.write_bytes(data); temp.chmod(0o755 if mode == '100755' else 0o644)
                os.replace(temp, dest)
            finally:
                temp.unlink(missing_ok=True)
            before[rel] = after[rel]
        if manifest(working_files(root, index_entries(root))) != after:
            raise Rejected('回填後與受測產物不符')
        record = {'schema': SCHEMA, 'algorithm': ALGORITHM, 'status': 'success', 'run_id': run_id,
                  'manifest': after, 'digest': sha(canonical(after)), 'gates': gates, 'finished': time.time(),
                  'harvest': evidence, 'node_tests': node_tests(after), 'runtime': versions}
        atomic_receipt(receipt, record)
        if read_receipt(receipt) != record:
            raise Rejected('收據讀回不符')
        print('全部通過：請完整 add／commit，再 zsh tools/post.sh ship <篇id> [傳題ID]')
    except BaseException as exc:
        with contextlib.suppress(Exception):
            atomic_receipt(receipt, {**running, 'status': 'failed', 'reason': str(exc), 'finished': time.time()})
        raise


def check_worktree(root, expected):
    current = manifest(working_files(root, index_entries(root)))
    if current.keys() != expected.keys():
        raise Rejected('候選檔案清單改變：' + ', '.join(changes(current, expected)))
    diff = changes(current, expected)
    if diff:
        label = '採字內容改變／不合格' if HARVEST in diff else '工作區內容與收據不符'
        raise Rejected(label + '：' + ', '.join(diff))
    staged = manifest(blob_files(root))
    if staged != expected:
        raise Rejected('暫存區內容與受測 commit 不符：' + ', '.join(changes(staged, expected)))


def ship(root, receipt, pid, inbox, before_push=None):
    environment_check()
    commit = git(root, 'rev-parse', 'HEAD').decode().strip()
    r = read_receipt(receipt)
    files = blob_files(root, commit); committed = manifest(files)
    missing = r['manifest'].keys() - committed.keys()
    if missing:
        raise Rejected('受測內容不符：HEAD 缺少受測檔案：' + ', '.join(sorted(missing)))
    diff = changes(committed, r['manifest'])
    if diff:
        raise Rejected('受測內容不符，內容與收據不符：' + ', '.join(diff))
    check_worktree(root, committed)
    if runtime() != r['runtime']:
        raise Rejected('執行版本與收據不同，請重新 verify')
    if harvest_evidence(files) != r['harvest']:
        raise Rejected('收據無效：採字證據不符')
    if not re.search(r'\bid:\s*' + re.escape(json.dumps(pid, ensure_ascii=False)), files['src/hard.js'][1].decode()):
        raise Rejected('src/hard.js 沒有這一篇：' + pid)
    print('採字內容相同（按 JSON 值核對，忽略物件鍵順序／縮排）', flush=True)
    run_id = 'ship-' + uuid.uuid4().hex
    snap = snapshot(root, run_id, files)
    logs = safe_directory(root, STATE) / run_id; logs.mkdir()
    print(f'固定 commit：{commit}\nlog：{logs}', flush=True)
    result = run_gate('build', [sys.executable, 'build.py'], snap, logs); need_gate('build', result)
    if manifest(working_files(snap, files)) != committed:
        raise Rejected('commit 的建置產物與來源不符，請重新 verify 並提交')
    result = run_gate('node', ['node', '--test', *r['node_tests']], snap, logs); need_gate('node', result)
    result = run_gate('standard', [sys.executable, 'tests/e2e_standard.py'], snap, logs)
    need_gate('standard', result, '推前 DOM 主閘失敗')
    if manifest(working_files(snap, files)) != committed:
        raise Rejected('推前檢查改變受測快照，沒推')
    if git(root, 'rev-parse', 'HEAD').decode().strip() != commit:
        raise Rejected('檢查期間 HEAD 已改變，沒推；請重新 ship')
    check_worktree(root, committed)
    if read_receipt(receipt) != r:
        raise Rejected('檢查期間收據已改變，沒推')
    if before_push is not None:
        before_push()   # 上線車道仍在自己手上才推
    # HEAD may change after the last check; the pushed object still cannot.
    p = subprocess.run(['git', 'push', '-q', 'origin', commit + ':main'], cwd=root)
    if p.returncode:
        raise Rejected('推不上去，請確認遠端版本與連線')
    want = sha(files['index.html'][1])
    # 判準＝正式網址 index.html 與這個 commit 逐位元組相同（只找篇 id 對改寫舊篇沒有鑑別力）；先存檔再算雜湊（curl | grep -q 在 pipefail 下會空轉，2026-10-15）
    for attempt in range(120):   # cap-why: GitHub Pages 平常 80–140 秒，2026-10-16 efa05fe 建置超過 6 分鐘 ⇒ 等到 10 分鐘（120×5 秒）
        output = logs / 'live.html'
        p = subprocess.run(['curl', '-sS', '--max-time', '20', '-o', str(output), LIVE_URL + '?nc=' + run_id + str(attempt)],
                           cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        if p.returncode == 0 and output.is_file() and sha(output.read_bytes()) == want:
            break
        time.sleep(5)
    else:
        raise Rejected(f'已推送 {commit}，但等待後仍未確認正式網址是這一版；尚未回寫進度')
    print(f'已確認此版本上線：{commit}\n{LIVE_URL}#h/{pid}', flush=True)
    if inbox:
        p = subprocess.run(['python3', str(Path.home()/'scripts/g5_help_inbox.py'), '--done', inbox, pid], cwd=root)
        if p.returncode:
            raise Rejected('已上線，但回寫網頁進度清單失敗')
        print('已回寫網頁進度清單')
    # Background diagnostics use the pinned snapshot. Never authorize push.
    with (logs/'live.log').open('wb') as log:
        subprocess.Popen([sys.executable, 'tests/e2e.py', '--base', LIVE_URL], cwd=snap,
                         stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
    print(f'正式站背景檢查已啟動；結果尚未確認：{logs / "live.log"}')


def main(argv=None):
    args = sys.argv[1:] if argv is None else argv
    if not args or args[0] not in {'verify', 'ship'} or (args[0] == 'verify' and len(args) != 1) or (args[0] == 'ship' and len(args) not in {2, 3}):
        print('用法：zsh tools/post.sh verify | ship <篇id> [傳題ID]')
        return 2
    started = time.monotonic()
    try:
        with lock(ROOT) as receipt:
            prune(ROOT)
            if args[0] == 'verify':
                lane_take(ROOT)
                try:
                    with lane_heartbeat(ROOT) as lost:
                        base_current(ROOT, auto=True)
                        verify(ROOT, receipt)
                    try:
                        lane_confirm(ROOT, time.time() + LANE_SHIP_GRACE, 'verify ', lost)   # 留給自己的 ship
                    except BaseException as exc:   # 任何確認失敗（含讀寫錯誤）都不得留下成功收據（Codex 審 d48c755 P2）
                        atomic_receipt(receipt, {'status': 'failed', 'reason': '確認上線車道失敗：' + str(exc), 'finished': time.time()})
                        raise
                except BaseException:
                    lane_release(ROOT)
                    raise
            else:
                holder = lane_update(ROOT, time.time() + LANE_SHIP_GRACE, True)
                if holder is not None:
                    raise Rejected(f'上線車道由 {holder["root"]} 使用中：等它推完，rebase 後重新 verify')
                try:
                    with lane_heartbeat(ROOT) as lost:
                        ship(ROOT, receipt, args[1], args[2] if len(args) == 3 else None,
                             before_push=lambda: (lane_confirm(ROOT, time.time() + LANE_TTL, 'ship ', lost), base_current(ROOT)))
                finally:
                    lane_release(ROOT)
    except (Rejected, OSError, ValueError, subprocess.SubprocessError, KeyboardInterrupt) as exc:
        print(f'停止：{exc}；未完成發布', flush=True)
        return 1
    finally:
        print(f'耗時 {time.monotonic() - started:.2f} 秒', flush=True)
    return 0


if __name__ == '__main__':
    sys.exit(main())
