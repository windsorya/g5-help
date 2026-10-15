'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const core = require('../gas/core');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const flush = () => new Promise(resolve => setImmediate(resolve));

class Storage {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); this.fail = null; }
  get length() { return this.data.size; }
  key(i) { return [...this.data.keys()][i] || null; }
  getItem(key) { return this.data.has(String(key)) ? this.data.get(String(key)) : null; }
  setItem(key, value) {
    if (this.fail && this.fail(key, value)) {
      const error = new Error('private storage error'); error.name = 'QuotaExceededError'; throw error;
    }
    this.data.set(String(key), String(value));
  }
  removeItem(key) { this.data.delete(String(key)); }
  dump() { return Object.fromEntries(this.data); }
}
class Events {
  constructor() { this.listeners = {}; }
  addEventListener(type, listener) { (this.listeners[type] ||= new Set()).add(listener); }
  removeEventListener(type, listener) { this.listeners[type]?.delete(listener); }
  dispatch(type, event = {}) { for (const fn of this.listeners[type] || []) { fn(event); } }
}
class Element extends Events {
  constructor(tag, ownerDocument) {
    super(); this.tagName = tag.toUpperCase(); this.ownerDocument = ownerDocument;
    this.children = []; this.style = {}; this.attributes = {}; this._text = ''; this._html = '';
    this.value = ''; this.hidden = false; this.disabled = false;
  }
  get firstChild() { return this.children[0] || null; }
  appendChild(node) { node.parentNode = this; this.children.push(node); return node; }
  insertBefore(node, ref) { node.parentNode = this; const i = ref ? this.children.indexOf(ref) : -1; if (i < 0) this.children.push(node); else this.children.splice(i, 0, node); return node; }
  removeChild(node) { this.children.splice(this.children.indexOf(node), 1); node.parentNode = null; return node; }
  set textContent(text) { this._text = String(text); this.children = []; this._html = ''; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set innerHTML(html) { this._html = String(html); this.children = []; this._text = ''; }
  get innerHTML() { return this._html; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.ownerDocument.activeElement = this; }
  select() { this.selected = true; }
  click() { if (!this.disabled) this.dispatch('click', {preventDefault() {}}); }
}
class Document extends Events {
  constructor() { super(); this.visibilityState = 'visible'; this.container = new Element('div', this); this.body = new Element('body', this); }
  createElement(tag) { return new Element(tag, this); }
  querySelector(selector) { return selector === '#sync' ? this.container : null; }
}
function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function byClass(device, name) { return descendants(device.doc.container).filter(node => node.className === 'g5s-' + name); }
function click(device, text) {
  const b = descendants(device.doc.container).find(node => node.tagName === 'BUTTON' && node.textContent === text);
  assert.ok(b, `Missing button: ${text}`); b.click(); return b;
}
class Clock {
  constructor(start = Date.UTC(2026, 9, 13, 0, 0, 0)) { this.time = start; this.next = 1; this.tasks = new Map(); }
  now = () => this.time;
  setTimeout = (fn, delay) => { const id = this.next++; this.tasks.set(id, {fn, at: this.time + delay, repeat: 0}); return id; };
  clearTimeout = id => this.tasks.delete(id);
  setInterval = (fn, delay) => { const id = this.setTimeout(fn, delay); this.tasks.get(id).repeat = delay; return id; };
  clearInterval = this.clearTimeout;
  async advance(ms) {
    const target = this.time + ms;
    for (let n = 0; n < 10000; n++) {
      const [id, job] = [...this.tasks].filter(([, item]) => item.at <= target).sort((a, b) => a[1].at - b[1].at)[0] || [];
      if (!job) { this.time = target; await flush(); return; }
      this.time = job.at;
      if (job.repeat) job.at += job.repeat; else this.tasks.delete(id);
      job.fn(); await flush();
    }
    throw new Error('Fake clock runaway');
  }
}
function makeStore() {
  const rows = new Map(); let locked = false;
  const store = {
    rows, events: [], hash,
    withLock(fn) {
      assert.equal(locked, false); locked = true; this.events.push('lock');
      try { return fn(); } finally { locked = false; this.events.push('unlock'); }
    },
    get(h, key) {
      assert.ok(locked); this.events.push('get');
      const row = rows.get(h + '|' + key); return row ? core.fromRow(row) : null;
    },
    set(h, key, record) {
      assert.ok(locked); this.events.push('set'); rows.set(h + '|' + key, core.toRow(h, key, record));
    },
    record(code, key = 'g5sci.v3') { const row = rows.get(hash(code) + '|' + key); return row ? core.fromRow(row) : null; }
  };
  return store;
}
function server(clock, store = makeStore()) {
  return {clock, store, handle(req) { return core.handle(store, req, clock.now); }};
}
function device(server, options = {}) {
  const clock = options.clock || server.clock, doc = new Document(), events = new Events();
  const storage = options.storage || new Storage(options.initial);
  let href = options.href || 'https://windsorya.github.io/g5-sci-review/';
  const location = {get href() { return href; }, get hash() { return new URL(href).hash; }};
  const history = {state: {keep: 1}, calls: [], replaceState(state, title, url) { this.calls.push({state, url}); href = url; }};
  const d = {clock, doc, storage, history, calls: [], replacements: [], qrLinks: [], active: 0, maxActive: 0, mode: 'ok', held: null};
  const window = Object.assign(events, {
    document: doc, location, history, navigator: options.navigator || {onLine: true}, localStorage: storage,
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout, setInterval: clock.setInterval, clearInterval: clock.clearInterval,
    crypto: {getRandomValues(array) { crypto.randomFillSync(array); return array; }}, AbortController
  });
  const sandbox = {window, module: {exports: {}}, Uint8Array, Promise, Date, console};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/qrcode.js'), 'utf8'), sandbox, {filename: 'qrcode.js'});
  const qrFactory = sandbox.qrcode; // Browser-global build; no CommonJS `exports` in this VM.
  window.qrcode = (type, level) => {
    const qr = qrFactory(type, level), add = qr.addData;
    qr.addData = data => { d.qrLinks.push(data); return add(data); }; return qr;
  };
  sandbox.module = {exports: {}};
  // syncPath：A18 相容性差分測試用（同一情境分別載入舊版／新版 sync.js 比對）；預設是 src/sync.js
  vm.runInContext(fs.readFileSync(options.syncPath || path.join(__dirname, '../src/sync.js'), 'utf8'), sandbox, {filename: 'sync.js'});
  const fetch = (url, config) => {
    d.active++; d.maxActive = Math.max(d.maxActive, d.active);
    const req = JSON.parse(config.body); d.calls.push({url, config, req, at: clock.now()});
    let pending;
    if (options.fetch) pending = Promise.resolve().then(() => options.fetch(req, config, d));
    else if (d.mode === 'reject') pending = Promise.reject(new TypeError('secret network details'));
    else if (d.mode === 'html') pending = Promise.resolve({ok: true, json() { return Promise.reject(new SyntaxError('<html>private</html>')); }});
    else if (d.mode === 'server') pending = Promise.resolve({ok: true, json: async () => ({ok: false, err: 'server'})});
    else if (d.mode === 'http') pending = Promise.resolve({ok: false, json: async () => ({})});
    else if (d.mode === 'hold') pending = new Promise((resolve, reject) => {
      d.held = () => resolve({ok: true, json: async () => server.handle(req)});
      config.signal?.addEventListener('abort', () => reject(new Error('abort')));
    });
    else pending = Promise.resolve({ok: true, json: async () => server.handle(req)});
    return pending.finally(() => { d.active--; });
  };
  let seed = options.seed || 0;
  const init = {
    endpoint: options.endpoint === undefined ? 'https://example.test/exec' : options.endpoint,
    keys: options.keys || ['g5sci.v3'], container: options.selector ? '#sync' : doc.container,
    summarize: options.summarize || {'g5sci.v3': data => '練過 ' + JSON.parse(data).n + ' 題'},
    now: clock.now, storage, fetch,
    random: array => { for (let i = 0; i < array.length; i++) array[i] = seed++ % 240; },
    onReplaced: key => { d.replacements.push(key); options.onReplaced?.(key, d); },
    canReplace: options.canReplace, accept: options.accept,
    // #2164：舊測試驗的是「選擇」那套機制（備份、版本號、不覆蓋），預設關掉兩個新功能；新測試明確打開
    autoResolve: options.autoResolve ?? false, autoEnable: options.autoEnable ?? false
  };
  if (options.score) init.score = options.score;
  if (options.nativeRandom) delete init.random;
  if (options.random) init.random = options.random;
  if (options.noCrypto) delete window.crypto;
  d.window = window; d.library = sandbox.module.exports; d.api = d.library.init(init);
  return d;
}
module.exports = {Storage, Clock, Document, makeStore, server, device, flush, byClass, descendants, click, hash};
