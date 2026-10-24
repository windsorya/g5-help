#!/opt/homebrew/opt/python@3.12/bin/python3.12
"""T01–T22: offline acceptance through the real zsh tools/post.sh entry.

Only disposable standalone Git repos are used. No remote is configured. PATH
adapters reject unexpected commands; browser/IO faults exist only in fixtures.
Run: /opt/homebrew/opt/python@3.12/bin/python3.12 tests/post_ship_test.py
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time
import unittest

ROOT = Path(__file__).absolute().parent.parent
PY = '/opt/homebrew/opt/python@3.12/bin/python3.12'
GIT = shutil.which('git')

# These adapters are fixture files, never imported by production code. The
# environment selects fault inputs, not gates to omit from the actual pipeline.
ADAPTER = r'''
import json, os, sys, subprocess, time
from pathlib import Path
name = Path(sys.argv[0]).name
args = sys.argv[1:]
cfg = json.loads(Path(os.environ['FIX_CONFIG']).read_text())
def record(kind):
    fd = os.open(os.environ['FIX_CALLS'], os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
    os.write(fd, (json.dumps([kind, args, os.getcwd()])+'\n').encode()); os.close(fd)
def deny():
    record('UNEXPECTED'); sys.exit(97)
if name == 'git':
    if args and args[0] == 'push':
        if len(args) != 4 or args[:3] != ['push', '-q', 'origin'] or not args[3].endswith(':main'): deny()
        if not cfg.get('allow_delivery'): deny()
        if cfg.get('late_head'):
            subprocess.check_call([os.environ['FIX_GIT'], 'update-ref', 'HEAD', cfg['late_head']])
        record('push'); sys.exit(0)
    # fetch／merge-base／rebase／checkout／add：上線車道的 base 檢查與 verify 開頭自動 rebase（fixture 沒有 remote ⇒ fetch 失敗、只警告）
    if not args or args[0] not in ['ls-files','ls-tree','show','rev-parse','cat-file','diff','status','fetch','merge-base','rebase','checkout','add']: deny()
    sys.exit(subprocess.call([os.environ['FIX_GIT'], *args]))
elif name == 'node':
    if args == ['--version']: print('v22.0.0-fixture'); sys.exit(0)
    if args == ['--test','--test-name-pattern=快篩','tests/hard.test.js']: gate = 'quick'
    elif args == ['--test', *sorted(str(p) for p in Path('tests').glob('*.test.js'))]: gate = 'node'
    else: deny()
    record(gate)
    print('ℹ pass 4\nℹ fail 0')
    sys.exit(cfg.get(gate, 0))
elif name == 'curl':
    if not cfg.get('allow_delivery') or len(args) != 6 or args[:4] != ['-sS','--max-time','20','-o'] or not args[-1].startswith('https://windsorya.github.io/g5-help/?nc='): deny()
    record('curl')
    Path(args[args.index('-o')+1]).write_bytes(subprocess.check_output([os.environ['FIX_GIT'], 'show', cfg['live_sha']+':index.html'], cwd=os.environ['FIX_REPO']))
elif name == 'python3':
    if args != [str(Path.home()/'scripts/g5_help_inbox.py'),'--done','inbox-1','fixture'] or not cfg.get('allow_delivery'): deny()
    record('progress')
else: deny()
'''

BROWSER = r'''
import hashlib, json, os, signal, sys, time
from pathlib import Path
cfg = json.loads(Path(os.environ['FIX_CONFIG']).read_text())
root = Path(__file__).absolute().parent.parent
name = Path(__file__).name
gate = {'e2e.py':'e2e','e2e_standard.py':'standard','e2e_kidtext.py':'kid','tools_test.py':'tools'}[name]
if '--base' in sys.argv:
    gate = 'background'
expected = ['--parallel'] if gate == 'kid' else (['--base','https://windsorya.github.io/g5-help/'] if gate == 'background' else [])
unexpected = sys.argv[1:] != expected or (gate == 'background' and (name != 'e2e.py' or not cfg.get('allow_delivery')))
fd = os.open(os.environ['FIX_CALLS'], os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
os.write(fd, (json.dumps(['UNEXPECTED' if unexpected else gate, sys.argv[1:], str(root)])+'\n').encode()); os.close(fd)
if unexpected: sys.exit(97)
if cfg.get('hold') == gate:
    Path(os.environ['FIX_READY']).touch()
    while not Path(os.environ['FIX_RELEASE']).exists(): time.sleep(.01)
if cfg.get('kill') == gate: os.kill(os.getpid(), signal.SIGKILL)
if cfg.get('timeout') == gate: time.sleep(20)
if gate == 'standard' and cfg.get('probe'):
    import runpy
    ns = runpy.run_path(str(root/'tests/post_probe.py'))
    sys.exit(ns['probe'](root/'tests/standard_source.py', cfg['probe']))
if gate == 'kid' and not cfg.get('kid'):
    def sha(p): return hashlib.sha256((root/p).read_bytes()).hexdigest()
    stamp = dict(index_sha256=sha('index.html'), kidgate_sha256=sha('tests/kidgate.js'), driver_sha256=sha('tests/e2e_kidtext.py'), max=40)
    result = dict(**stamp, cases=['home','fixture:lesson'], branches=['a','b'], violations=[], errors=[], snapshots=2,
                  selftests={k:{'ok':True} for k in ['B01a','B01b','B02a','B02b','B03','B04','B05','B06','B07','B09','B10-judged','B12','B13','B14','B15','B16','B18','B19','unclassified','U01']})
    browsers = {'chromium':result, 'webkit':result}
    if cfg.get('missing_browser'): del browsers['webkit']
    (root/'tests/kidtext_harvest.json').write_text(json.dumps(dict(**stamp, self_max=40, browsers=browsers)))
if cfg.get('flake') == gate:   # 系統忙時 Playwright 逾時（交辦 #4260）
    mark = Path(os.environ['FIX_CALLS']).with_suffix('.flaked')
    if cfg.get('flake_always') or not mark.exists():
        mark.touch(); print('FAIL fixture' if cfg.get('flake_fail') else 'PASS fixture')
        print('playwright._impl._errors.TimeoutError: Locator.click: Timeout 30000ms exceeded.'); sys.exit(1)
sys.exit(cfg.get(gate, 0))
'''

PROBE = r'''
import contextlib, sys, types
def probe(source, mutation):
    # Browser double supplies actual measurement data. No replacement of the
    # flow, check(), timing_selftest(), or exit-code consumer (except mutants).
    fake = types.ModuleType('playwright.sync_api')
    fake.sync_playwright = lambda: None
    sys.modules['playwright'] = types.ModuleType('playwright')
    sys.modules['playwright.sync_api'] = fake
    e = types.ModuleType('e2e'); e.HOME = 'file:///fixture/index.html'
    e.open_page = lambda *a, **kw: (types.SimpleNamespace(close=lambda: None), Page(), [])
    e.last_ask = lambda p: p
    sys.modules['e2e'] = e
    text = source.read_text()
    changes = {
      'drop-now': ('now = [f"第 {k} 步當下：{p}" for k, p in walk_lesson(page, steps)]', 'now = []; walk_lesson(page, steps)'),
      'skip-check': ('check(f"{pid} 標準DOM② 每一步剛出現', 'unused_check(f"{pid} 標準DOM② 每一步剛出現'),
      'zero-rc': ('return 1 if any(not row[1] for row in results) else 0', 'return 0'),
    }
    if mutation in changes:
        before, after = changes[mutation]
        assert text.count(before) == 1, 'mutation anchor absent'
        text = text.replace(before, after)
    ns = {'__file__':str(source), '__name__':'fixture_standard', 'unused_check':lambda *a: None}
    exec(compile(text, str(source), 'exec'), ns)
    class Page:
        def __init__(self): self.hidden = False; self.done = False
        def wait_for_selector(self, *a, **k): pass
        def add_style_tag(self, **kw): self.hidden = True
        def get_by_role(self, *a, **kw): return self
        def locator(self, sel):
            if 'data-next' in sel: self.done = True
            return self
        def click(self): pass
        def evaluate(self, script, arg=None):
            if 'window.G5Hard.LIST' in script: return [{'id':'fixture', 'steps':[{'a':None}]}]
            if script == ns['STD_NAV_JS']:
                return dict(navs=1, hrefs=[v[0] for k,v in ns['STD_SITES'].items() if k != 'help'], hidden=[], current=[ns['STD_SITES']['help'][1]])
            if script == ns['STD_ROBOTS_JS']: return [dict(content='noindex', inHead=True)]
            if script == ns['STD_FIG_JS']:
                return [dict(where='fixture step 1', figs=[dict(label='測試用圖', seen=True, n=0 if self.hidden and not self.done else 1)])]
            raise AssertionError('unexpected browser call')
    ns['std_selftest'] = lambda *a: ns['check']('fixture static selftest', True)
    try:
        rc, results = ns['run_standard'](object(), css=ns['STEP_HIDE_CSS'] if mutation == 'hidden' else None)
    except AssertionError as exc:
        print(str(exc)); return 1
    return rc
'''


class PostShip(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='post-ship-')
        self.addCleanup(self.tmp.cleanup)
        self.base = Path(self.tmp.name)
        self.repo = self.base / 'repo'; self.repo.mkdir()
        self.bin = self.base / 'bin'; self.bin.mkdir()
        self.calls = self.base / 'calls.jsonl'
        self.config = self.base / 'config.json'
        self.cfg = {}; self.configure()
        self.env = {k:v for k,v in os.environ.items() if not k.startswith(('GIT_', 'G5_', 'PYTHON', 'NODE_'))}
        self.env.update(PATH=str(self.bin)+os.pathsep+os.environ['PATH'], HOME=str(self.base),
                        GIT_CONFIG_NOSYSTEM='1', GIT_CONFIG_GLOBAL='/dev/null',
                        FIX_CONFIG=str(self.config), FIX_CALLS=str(self.calls), FIX_GIT=GIT,
                        FIX_REPO=str(self.repo), FIX_READY=str(self.base/'ready'), FIX_RELEASE=str(self.base/'release'))
        for name in ('git','node','curl','python3'):
            p = self.bin/name; p.write_text('#!'+PY+'\n'+ADAPTER); p.chmod(0o755)
        for rel in ('tools/post.sh','tools/post_gate.py'):
            p = ROOT/rel
            if p.exists(): self.write(rel, p.read_text())
        self.write('tests/standard_source.py', (ROOT/'tests/e2e_standard.py').read_text())
        self.write('tests/post_probe.py', PROBE)
        for name in ('e2e.py','e2e_standard.py','e2e_kidtext.py','tools_test.py'):
            self.write('tests/'+name, BROWSER)
        self.write('.gitignore', '.post-state/\n.post-snapshots/\n__pycache__/\ntests/kidtext_harvest.json.lock\n')
        self.write('src/hard.js', 'id: "fixture"\n')
        self.write('src/app.html', 'hello\n')
        for rel in ('tests/hard.test.js','tests/kidgate.js','tests/kidtext.js','tests/fixtures/example.json'):
            self.write(rel, '{}\n')
        self.write('build.py', "from pathlib import Path\np=Path('src')\nPath('index.html').write_text(''.join(x.read_text() for x in sorted(p.glob('*.js')) if '.bak.' not in x.name))\n")
        self.write('index.html', 'id: "fixture"\n')
        self.git('init','-q'); self.git('config','user.email','fixture@example.invalid'); self.git('config','user.name','fixture')
        self.commit()

    def write(self, rel, content):
        p = self.repo/rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content); return p

    def git(self, *args):
        return subprocess.check_output([GIT, *args], cwd=self.repo, env=self.env, text=True).strip()

    def commit(self):
        self.git('add','.'); self.git('commit','-qm','fixture', '--allow-empty')
        return self.git('rev-parse','HEAD')

    def configure(self, **kw):
        self.cfg.update(kw); self.config.write_text(json.dumps(self.cfg))

    def run_post(self, cmd, expected, contains=None, extra_env=None):
        args = ['zsh','tools/post.sh',cmd] + (['fixture','inbox-1'] if cmd == 'ship' else [])
        p = subprocess.run(args, cwd=self.repo, env={**self.env, **(extra_env or {})}, capture_output=True, text=True, timeout=30)
        self.assertEqual(p.returncode, expected, p.stdout+p.stderr)
        if contains: self.assertIn(contains, p.stdout+p.stderr)
        return p

    def events(self, kind):
        rows = [json.loads(s) for s in self.calls.read_text().splitlines()] if self.calls.exists() else []
        return [r for r in rows if r[0] == kind]

    def no_delivery(self):
        for k in ('push','curl','progress','background','UNEXPECTED'):
            self.assertEqual(self.events(k), [], k)

    def verified(self):
        self.run_post('verify', 0)
        return self.commit()

    def shipped(self):
        sha = self.git('rev-parse','HEAD')
        self.configure(allow_delivery=True, live_sha=sha)
        p = self.run_post('ship', 0, '已確認此版本上線')
        deadline = time.monotonic()+3
        while not self.events('background') and time.monotonic() < deadline: time.sleep(.01)
        for k in ('push','curl','progress','background'): self.assertEqual(len(self.events(k)), 1, k)
        self.assertEqual(self.events('push')[0][1], ['push','-q','origin',sha+':main'])
        self.assertEqual(self.events('UNEXPECTED'), [])
        return p

    def receipt(self):
        return self.repo/'.post-state/latest.json'

    def test_T01_missing_receipt(self):
        self.run_post('ship',1,'缺少完整成功收據'); self.no_delivery()

    def test_T02_standard_failed(self):
        self.configure(standard=1)
        self.run_post('verify',1); self.run_post('ship',1,'standard'); self.no_delivery()

    def test_T03_source_commit_changed(self):
        self.verified(); self.write('src/hard.js','id: "fixture"\n// changed\n'); self.commit()
        self.run_post('ship',1,'src/hard.js'); self.no_delivery()

    def test_T04_success_fixed_commit(self):
        self.verified(); self.shipped()
        self.assertEqual(len(self.events('standard')),2)
        self.assertEqual(len(self.events('e2e')),1)
        self.assertEqual(len(self.events('kid')),1)
        self.assertEqual(len(self.events('quick')),1)
        self.assertEqual(len(self.events('tools')),1)
        self.assertEqual(len(self.events('node')),2)

    def test_T05_invalid_receipt(self):
        self.verified(); valid = self.receipt().read_text()
        for mode in ('json','digest','gates','schema','runtime','node_tests','harvest','finished'):
            with self.subTest(mode=mode):
                data = json.loads(valid)
                if mode == 'json': text = '{'
                else:
                    if mode == 'schema': data['schema'] = 'wrong'
                    else: data.pop(mode, None)
                    text = json.dumps(data)
                self.receipt().write_text(text); self.run_post('ship',1,'收據無效'); self.no_delivery()

    def test_T06_untracked_backups_excluded(self):
        self.verified(); self.write('src/hard.js.bak.test','backup')
        self.shipped()

    def test_T06_tracked_backup_is_not_excluded(self):
        self.write('src/hard.js.bak.tracked','tracked backup')
        self.write('tests/fixtures.bak.tracked/value.json','{}')
        self.commit(); self.verified()
        for rel in ('src/hard.js.bak.tracked','tests/fixtures.bak.tracked/value.json'):
            with self.subTest(rel=rel):
                p = self.repo/rel; old = p.read_text(); p.write_text(old+'changed')
                self.run_post('ship',1,rel); p.write_text(old)
        self.no_delivery()

    def test_T07_harvest_key_order(self):
        for committed in (False, True):
            with self.subTest(committed=committed):
                if committed: self.calls.unlink()
                else: self.verified()
                p = self.repo/'tests/kidtext_harvest.json'
                p.write_text(json.dumps(json.loads(p.read_text()), sort_keys=True, indent=4))
                if committed: self.commit()
                self.assertIn('採字內容相同', self.shipped().stdout)

    def test_T08_old_receipt_other_head(self):
        old = self.git('rev-parse','HEAD'); self.write('src/hard.js','id: "fixture"\nnew\n'); self.verified()
        self.git('checkout','-q',old)
        self.run_post('ship',1,'受測內容不符'); self.no_delivery()

    def test_T09_amend_same_content(self):
        old = self.verified(); self.git('commit','--amend','-qm','new message')
        self.assertNotEqual(old,self.git('rev-parse','HEAD')); self.shipped()

    def test_T10_missing_committed_source(self):
        self.write('src/new-post.js','new post\n'); self.run_post('verify',0)
        self.git('add','index.html','tests/kidtext_harvest.json'); self.git('commit','-qm','omit new source')
        self.run_post('ship',1,'HEAD 缺少受測檔案：src/new-post.js'); self.no_delivery()

    def test_T11_new_untracked_candidate(self):
        self.verified()
        for rel in ('src/new-post.js','tests/new.test.js','new-asset.svg'):
            with self.subTest(rel=rel):
                self.write(rel,'new'); self.run_post('ship',1,'候選檔案清單改變'); (self.repo/rel).unlink()
        self.no_delivery()

    def test_T12_changed_dependencies(self):
        base = self.verified()
        for rel in ('build.py','tools/post.sh','tests/kidtext.js','tests/fixtures/example.json'):
            with self.subTest(rel=rel):
                p = self.repo/rel; p.write_text(p.read_text()+'\n'); self.commit()
                self.run_post('ship',1,rel); self.git('reset','--hard',base)
        self.no_delivery()

    def test_T13_new_harvest_bound_after_run(self):
        self.write('tests/kidtext_harvest.json','{"old":true}')
        self.verified(); receipt = json.loads(self.receipt().read_text())
        self.assertEqual(set(receipt['harvest']), {'chromium','webkit'})
        self.shipped()

    def test_T14_harvest_semantic_change(self):
        self.verified(); p = self.repo/'tests/kidtext_harvest.json'; valid = p.read_text()
        for mode in ('bool','hash','violations','array','duplicate','nan'):
            with self.subTest(mode=mode):
                d = json.loads(valid); b = d['browsers']['chromium']
                if mode == 'bool': b['selftests']['B01a']['ok'] = False
                if mode == 'hash': b['index_sha256'] = '0'*64
                if mode == 'violations': b['violations'] = [{'kind':'word','text':'bad'}]
                if mode == 'array': b['branches'].reverse()
                text = json.dumps(d)
                if mode == 'duplicate': text = text[:-1]+',"max":40}'
                if mode == 'nan': text = text[:-1]+',"illegal":NaN}'
                p.write_text(text); self.run_post('ship',1,'採字'); p.write_text(valid)
        self.no_delivery()

    def test_T15_incomplete_gate(self):
        for fault in ({'e2e':1},{'node':1},{'kill':'kid'},{'timeout':'standard'},{'missing_browser':True}):
            with self.subTest(fault=fault):
                self.cfg = {}; self.configure(**fault)
                # Shorten the production timeout only in this disposable source.
                helper = self.repo/'tools/post_gate.py'
                if helper.exists(): helper.write_text(helper.read_text().replace('GATE_TIMEOUT = 900','GATE_TIMEOUT = 1'))
                self.run_post('verify',1); self.run_post('ship',1); self.no_delivery()

    def test_T16_latest_attempt_invalidates_success(self):
        self.verified(); self.configure(e2e=1); self.run_post('verify',1)
        self.run_post('ship',1,'最近 verify 未成功'); self.no_delivery()
        self.receipt().write_text(json.dumps({'status':'running','run_id':'interrupted'}))
        self.run_post('ship',1,'未完成'); self.no_delivery()

    def start_held(self, cmd):
        self.configure(hold='standard')
        p = subprocess.Popen(['zsh','tools/post.sh',cmd]+(['fixture'] if cmd=='ship' else []), cwd=self.repo, env=self.env,
                             stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        self.addCleanup(lambda: p.poll() is None and p.kill())
        deadline = time.monotonic()+10
        while not (self.base/'ready').exists() and p.poll() is None and time.monotonic()<deadline: time.sleep(.01)
        self.assertTrue((self.base/'ready').exists(), 'gate not reached')
        return p

    def release(self, p):
        (self.base/'release').touch(); out = p.communicate(timeout=15)[0]
        self.assertEqual(p.returncode,1,out); return out

    def test_T17_snapshot_and_mutex(self):
        p = self.start_held('verify')
        self.run_post('verify',1,'進行中'); self.run_post('ship',1,'進行中')
        self.write('src/hard.js','id: "fixture"\nchanged during test')
        snap = Path(self.events('standard')[0][2])
        self.assertEqual((snap/'src/hard.js').read_text(),'id: "fixture"\n')
        self.assertIn('內容已變',self.release(p)); self.run_post('ship',1); self.no_delivery()

    def test_T18_ship_dom_failure(self):
        self.verified(); self.configure(standard=1)
        self.run_post('ship',1,'推前 DOM 主閘失敗'); self.no_delivery()

    def test_T19_timing_consumed_by_flow(self):
        self.configure(probe='hidden')
        self.run_post('verify',1,'FAIL fixture 標準DOM② 每一步剛出現'); self.run_post('ship',1); self.no_delivery()

    def test_T20_consumer_mutations_rejected(self):
        # Positive control also exercises the real selftest with separate sinks.
        self.configure(probe='normal'); self.run_post('verify',0)
        for mutation in ('drop-now','skip-check','zero-rc'):
            with self.subTest(mutation=mutation):
                self.configure(probe=mutation)
                self.run_post('verify',1,'反例未使正式主流程失敗'); self.run_post('ship',1); self.no_delivery()

    def test_T21_head_changes_before_push(self):
        self.verified(); p = self.start_held('ship')
        self.write('src/hard.js','id: "fixture"\nunverified'); self.commit()
        self.assertIn('HEAD 已改變',self.release(p)); self.no_delivery()

    def test_T21_late_head_still_pushes_pinned_sha(self):
        approved = self.verified()
        self.write('src/hard.js','id: "fixture"\nunverified late change')
        other = self.commit(); self.git('reset','--hard',approved)
        self.configure(late_head=other); self.shipped()
        self.assertEqual(self.git('rev-parse','HEAD'), other)

    def test_T23_interactive_git_env_allowed(self):
        """CC 的 shell 帶 GIT_EDITOR／GIT_PAGER：不影響受測內容，不得拒跑；GIT_DIR 這類換內容來源的仍要拒。"""
        self.run_post('verify',1,'GIT_INDEX_FILE',extra_env={'GIT_INDEX_FILE':str(self.base/'other.index')})
        self.run_post('verify',0,extra_env={'GIT_EDITOR':'true','GIT_PAGER':'cat'})

    def lane_file(self):
        return self.repo/'.git/post-lane.json'

    def test_T25_lane_held_by_other_worktree_blocks_ship(self):
        """上線車道（#4247 復盤）：別的工作樹還在驗證／上線，本棵不得推（推了對方的 verify 就作廢）；交還後照常推，推完交還車道。"""
        self.verified()
        other = self.base/'other-worktree'; other.mkdir()
        self.lane_file().write_text(json.dumps({'root': str(other), 'until': time.time()+600, 'pid': 1}))
        self.configure(allow_delivery=True, live_sha=self.git('rev-parse','HEAD'))
        self.run_post('ship',1,'上線車道由'); self.no_delivery()
        self.lane_file().unlink()
        self.shipped()
        self.assertFalse(self.lane_file().exists(), 'ship 結束要交還車道')

    def test_T26_lane_expired_or_gone_is_ignored_and_verify_keeps_lane(self):
        """到期或持有者資料夾已不在＝當掉的視窗，自動讓出；verify 成功後車道保留給自己的 ship，失敗就交還。"""
        self.lane_file().write_text(json.dumps({'root': str(self.base/'gone'), 'until': time.time()+600, 'pid': 1}))
        self.run_post('verify',0)
        held = json.loads(self.lane_file().read_text())
        self.assertEqual(held['root'], str(self.repo.resolve()));self.assertGreater(held['until'], time.time())
        self.lane_file().write_text(json.dumps({'root': str(self.base), 'until': time.time()-1, 'pid': 1}))
        self.configure(standard=1)
        self.run_post('verify',1)
        self.assertFalse(self.lane_file().exists(), 'verify 失敗要交還車道')

    def take_lane_during_hold(self):
        other = self.base/'other-worktree'; other.mkdir(exist_ok=True)
        self.lane_file().write_text(json.dumps({'root': str(other), 'until': time.time()+600, 'pid': 1}))

    def test_T30_verify_loses_lane_midway_fails(self):
        """Codex 審 c6b36da P2：verify 跑到一半車道被別棵接手（租期過了），不得回報成功、收據不得是成功、ship 推不出去。"""
        p = self.start_held('verify'); self.take_lane_during_hold()
        self.assertIn('接手', self.release(p))
        self.assertNotEqual(json.loads(self.receipt().read_text()).get('status'), 'success')
        self.lane_file().unlink(); self.commit()
        self.configure(allow_delivery=True, live_sha=self.git('rev-parse','HEAD'))
        self.run_post('ship',1); self.no_delivery()

    def test_T31_ship_loses_lane_before_push_does_not_push(self):
        """Codex 審 c6b36da P2：ship 檢查期間車道被別棵接手，推之前要擋下、不推。"""
        self.verified(); self.configure(allow_delivery=True, live_sha=self.git('rev-parse','HEAD'))
        self.cfg['hold'] = 'standard'; self.config.write_text(json.dumps(self.cfg))
        p = subprocess.Popen(['zsh','tools/post.sh','ship','fixture'], cwd=self.repo, env=self.env,
                             stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        self.addCleanup(lambda: p.poll() is None and p.kill())
        deadline = time.monotonic()+10
        while not (self.base/'ready').exists() and p.poll() is None and time.monotonic()<deadline: time.sleep(.01)
        self.assertTrue((self.base/'ready').exists(), 'gate not reached')
        self.take_lane_during_hold()
        self.assertIn('接手', self.release(p))
        self.assertEqual(self.events('push'), [])

    def load_gate(self):
        import importlib.util
        self.git('init','-q') if not (self.repo/'.git').exists() else None
        spec = importlib.util.spec_from_file_location('post_gate_under_test', self.repo/'tools/post_gate.py')
        m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
        return m

    def test_T32_lane_lost_then_returned_still_fails(self):
        """Codex 審 d48c755 P2：心跳看到別棵接手、對方又交還、本棵結束時再拿回——仍算中途失去車道。"""
        m = self.load_gate(); m.LANE_BEAT = 0.05
        root = self.repo.resolve(); m.lane_take(root)
        with m.lane_heartbeat(root) as lost:
            self.take_lane_during_hold()
            deadline = time.monotonic()+5
            while not lost.is_set() and time.monotonic() < deadline: time.sleep(.02)
            self.lane_file().unlink()   # 對方交還
        self.assertTrue(lost.is_set())
        with self.assertRaises(m.Rejected): m.lane_confirm(root, time.time()+60, 'verify ', lost)

    def test_T33_confirm_io_error_rewrites_receipt_failed(self):
        """Codex 審 d48c755 P2：verify 後確認車道丟 OSError，收據不得留 success。"""
        m = self.load_gate(); m.ROOT = self.repo.resolve()
        m.lane_take = lambda root: None; m.base_current = lambda root, **kw: None; m.prune = lambda root: None
        m.verify = lambda root, receipt: m.atomic_receipt(receipt, {'status': 'success'})
        def boom(*a): raise OSError('fixture io error')
        m.lane_confirm = boom
        self.assertEqual(m.main(['verify']), 1)
        self.assertEqual(json.loads(self.receipt().read_text())['status'], 'failed')

    def test_T34_ship_refuses_when_origin_main_moved(self):
        """車道只是效率工具（範圍收斂後的定位）；main 的正確性靠推前 base 檢查：verify 之後 origin/main 被別棵推進，ship 不推、不回寫進度。"""
        self.verified()
        self.remote_moved('src/hard.js', 'id: "fixture"\n// other window\n')
        self.configure(allow_delivery=True, live_sha=self.git('rev-parse','HEAD'))
        self.run_post('ship', 1, 'origin/main 比 HEAD 新'); self.no_delivery()

    def remote_moved(self, rel, text):
        """建一個 origin，別的 clone 改 rel 後推上 main（模擬別的視窗先上線）。"""
        remote = self.base/'remote.git'
        subprocess.run([GIT, 'init', '-q', '--bare', '--initial-branch=main', str(remote)], check=True)   # 不靠 init.defaultBranch（Codex 審 81d4bfc）
        self.git('remote', 'add', 'origin', str(remote))
        self.git('push', '-q', 'origin', 'HEAD:main')
        other = self.base/'other-clone'
        subprocess.run([GIT, 'clone', '-q', '--branch', 'main', str(remote), str(other)], check=True, env={**self.env, 'PATH': os.environ['PATH']})
        for k, v in (('user.email', 'o@example.invalid'), ('user.name', 'o')):
            subprocess.run([GIT, '-C', str(other), 'config', k, v], check=True)
        (other/rel).write_text(text)
        if rel.startswith('src/') and rel.endswith('.js'):
            (other/'index.html').write_text(''.join(x.read_text() for x in sorted((other/'src').glob('*.js'))))
        subprocess.run([GIT, '-C', str(other), 'commit', '-qam', 'other window'], check=True)
        subprocess.run([GIT, '-C', str(other), 'push', '-q', 'origin', 'HEAD:main'], check=True)
        return subprocess.check_output([GIT, '-C', str(other), 'rev-parse', 'HEAD'], text=True).strip()

    def test_T35_verify_auto_rebases_when_only_hard_js_and_outputs_conflict(self):
        """#4260 實測：排完隊才發現 base 舊、要手動 rebase 再排。verify 開頭自動 rebase：hard.js 兩篇都留、index.html 取 main 的再重建。"""
        up = self.remote_moved('src/hard.js', 'id: "fixture"\nid: "other"\n')
        self.write('src/hard.js', 'id: "fixture"\nid: "mine"\n'); self.write('index.html', 'id: "fixture"\nid: "mine"\n'); self.commit()
        p = self.run_post('verify', 0, '已自動 rebase')
        self.assertEqual(subprocess.run([GIT, 'merge-base', '--is-ancestor', up, 'HEAD'], cwd=self.repo).returncode, 0)
        self.assertEqual((self.repo/'src/hard.js').read_text(), 'id: "fixture"\nid: "other"\nid: "mine"\n')
        self.assertEqual((self.repo/'index.html').read_text(), 'id: "fixture"\nid: "other"\nid: "mine"\n', '建置產物要依合併後的來源重建')

    def test_T36_verify_aborts_rebase_on_other_conflicts(self):
        """非 hard.js／建置產物的衝突不自動合：還原到原 commit、擋下、不寫成功收據。"""
        self.remote_moved('src/app.html', 'other\n')
        self.write('src/app.html', 'mine\n'); self.commit()
        head = self.git('rev-parse', 'HEAD')
        self.run_post('verify', 1, '無法自動處理的衝突')
        self.assertEqual(self.git('rev-parse', 'HEAD'), head)
        self.assertFalse((self.repo/'.git/rebase-merge').exists() or (self.repo/'.git/rebase-apply').exists())
        self.assertFalse(self.receipt().exists() and json.loads(self.receipt().read_text()).get('status') == 'success')

    def test_T37_hard_js_same_line_edits_not_unioned(self):
        """Codex 審 0133d34 P1：兩邊改到 hard.js 同一段既有內容（不是各自新增一篇）不得串接，要還原並擋下。"""
        self.remote_moved('src/hard.js', 'id: "fixture-upstream-edit"\n')
        self.write('src/hard.js', 'id: "fixture-my-edit"\n'); self.write('index.html', 'id: "fixture-my-edit"\n'); self.commit()
        head = self.git('rev-parse', 'HEAD')
        self.run_post('verify', 1, '同一段既有內容')
        self.assertEqual(self.git('rev-parse', 'HEAD'), head)
        self.assertEqual((self.repo/'src/hard.js').read_text(), 'id: "fixture-my-edit"\n')
        self.assertFalse((self.repo/'.git/rebase-merge').exists() or (self.repo/'.git/rebase-apply').exists())

    def test_T38_rebase_failure_midway_is_aborted(self):
        """Codex 審 0133d34 P2：rebase 中途出例外（逾時等）要還原，不留半套 rebase。"""
        self.remote_moved('src/hard.js', 'id: "fixture"\nid: "other"\n')
        self.write('src/hard.js', 'id: "fixture"\nid: "mine"\n'); self.write('index.html', 'id: "fixture"\nid: "mine"\n'); self.commit()
        head = self.git('rev-parse', 'HEAD')
        m = self.load_gate()
        real = m.union_conflicts
        def boom(text): raise subprocess.TimeoutExpired('git rebase --continue', 120)
        m.union_conflicts = boom
        up = self.git('rev-parse', 'origin/main') if False else subprocess.check_output([GIT, 'ls-remote', str(self.base/'remote.git'), 'main'], text=True).split()[0]
        self.git('fetch', '-q', 'origin', 'main')
        with self.assertRaises(subprocess.TimeoutExpired): m.auto_rebase(self.repo, up)
        self.assertEqual(self.git('rev-parse', 'HEAD'), head)
        self.assertFalse((self.repo/'.git/rebase-merge').exists() or (self.repo/'.git/rebase-apply').exists())

    def test_T24_old_runtime_artifacts_pruned(self):
        """快照每輪約 2.6 MB：超過一天的快照／log 目錄被清掉，一天內的（含背景 e2e 正在用的）保留。"""
        old = [self.repo/'.post-snapshots/old-run', self.repo/'.post-state/old-run']
        new = [self.repo/'.post-snapshots/new-run', self.repo/'.post-state/new-run']
        for d in old + new:
            d.mkdir(parents=True, exist_ok=True); (d/'x').write_text('x')
        stamp = time.time() - 2*86400
        for d in old: os.utime(d, (stamp, stamp))
        self.run_post('verify',0)
        for d in old: self.assertFalse(d.exists(), d)
        for d in new: self.assertTrue(d.exists(), d)
        self.assertTrue(self.receipt().is_file())

    def test_T27_load_flake_retried_once(self):
        self.configure(flake='e2e')
        self.run_post('verify', 0, '單獨重跑一次')
        self.assertEqual(len(self.events('e2e')), 2)
        r = json.loads(self.receipt().read_text())
        self.assertEqual(r['gates']['e2e']['retried'], 1); self.assertEqual(r['gates']['e2e']['rc'], 0)
        self.commit(); self.shipped()

    def test_T28_timeout_with_verdict_failure_not_retried(self):
        self.configure(flake='e2e', flake_fail=True)
        self.run_post('verify', 1); self.assertEqual(len(self.events('e2e')), 1)
        self.run_post('ship', 1); self.no_delivery()

    def test_T29_persistent_timeout_retried_only_once(self):
        self.configure(flake='kid', flake_always=True)
        self.run_post('verify', 1, '單獨重跑一次'); self.assertEqual(len(self.events('kid')), 2)
        self.run_post('ship', 1); self.no_delivery()

    def test_T22_storage_and_source_rejection(self):
        self.run_post('verify',1,'G5_UPLOAD_SRC',extra_env={'G5_UPLOAD_SRC':'src/upload.js'})
        self.run_post('ship',1); self.no_delivery()
        self.write('src/outside.js','placeholder').unlink()
        (self.repo/'src/outside.js').symlink_to(self.base/'never-read')
        self.run_post('verify',1,'symlink'); self.run_post('ship',1); self.no_delivery()
        (self.repo/'src/outside.js').unlink()
        helper = self.repo/'tools/post_gate.py'; original = helper.read_text()
        for mode in ('write','readback'):
            with self.subTest(mode=mode):
                anchor = 'os.replace(tmp, path)'
                # Fault only at SUCCESS persistence, after every gate ran.
                fault = ('if data.get("status") == "success": raise OSError("fixture write failure")\n        os.replace(tmp, path)'
                         if mode == 'write' else 'os.replace(tmp, path)\n        if data.get("status") == "success": path.write_text("{}")')
                self.assertIn(anchor,original)
                helper.write_text(original.replace(anchor,fault))
                self.run_post('verify',1,'收據'); self.run_post('ship',1); self.no_delivery()
        helper.write_text(original)


if __name__ == '__main__':
    unittest.main(verbosity=2)
