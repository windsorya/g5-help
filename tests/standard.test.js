// ⛔ 律師對「孩子用的教學網站」的固定標準——不屬於任何科目，複製這個網站去做新站時這支要一起帶走、不可刪除、不可改成跳過。
// 由來（#1339）：2026-10-13 數學站複製自然站時，影片的強制檢查寫在自然科專用的 steps.test.js 裡，被當成「自然專用」整支刪掉，
// 數學站就在沒有影片的狀態宣稱上線（律師：「數學複習似乎都沒有加上影片」「為何會漏做」）。
// 本站的細則另在 hard.test.js；這支只放三站共通的五條，名字與內容三站一致，方便一眼看出有沒有被拿掉。
// 標準來源：律師 2026-10-11「白話易懂、圖多一些、有影片就附上」；2026-10-13 每步一圖、每篇有影片；白話（#1319）；三站切換（#1333）。
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const H = require("../src/hard.js");
const ROOT = path.join(__dirname, "..");
const MAX_SENTENCE = require("./kidtext.js").OFFICIAL_MAX;   // 固定小五 40（設計 D B19；第 8 輪：不跟執行日期漂移，年級換算另由 kidgate.test.js 測）
const SELF = "help";   // 本站在三站切換列裡的代號

// 本站 src/app.html stepsLesson 把 s.say 原樣放進 innerHTML（不 esc）：<br> 真的換行、&#…; 字元參照會被瀏覽器解碼成字。
// ②④⑤的主閘：本站 tests/e2e_standard.py 的 flow_standard_dom（與自然站 e2e_v3.py、數學站 e2e.py 同一段 DOM 判準，2026-10-15 交辦 #1431 補上）。
const RENDER = { escaped: false };
// ===== 三站共通判準（三支 standard.test.js 這一段逐字相同，只有上面的 SELF／MAX_SENTENCE 與下面取資料的方式不同）=====
// 由來：Codex 審 g5-help 2dfa59cb、g5-sci-review b15cf42f、g5-math-review 236d77d2（2026-10-13）抓到舊判準的假通過：
// 空白理由、[{}] 影片、空 svg、<br> 被合併、連結沒驗目的地、只數網址次數、註解裡的 robots meta、只禁 /private/。
// 每一個反例在檔尾各有一條「自檢」：把資料在記憶體裡改壞，斷言判準抓得到。
// ⚠️ ②圖、④切換列、⑤robots meta 這三條在本檔只是「輔助」（2026-10-13 起）：用文字猜瀏覽器怎麼解析、怎麼畫，Codex 連 3 輪仍找到
//   假通過與誤判（title=' href=…'、title=" content='noindex'"、<path d="M0 0"/>、<rect width="0.0">、合法 <line x2="0"> 判沒圖）。
//   主閘是真瀏覽器 DOM：自然站 tests/e2e_v3.py、數學站 tests/e2e.py 的 flow_standard_dom（a.href、meta.content、getBBox＋getComputedStyle），
//   每條都在頁面上把 DOM 改成這些反例自檢。本檔②④⑤只做不開瀏覽器的秒級粗篩，不再補正規表達式；兩者不一致時以 e2e 為準。
const SITES = {
  sci: { url: "https://windsorya.github.io/g5-sci-review/", name: "五上自然複習" },
  math: { url: "https://windsorya.github.io/g5-math-review/", name: "五上數學複習" },
  help: { url: "https://windsorya.github.io/g5-help/", name: "難題解說" },
  chi: { url: "https://windsorya.github.io/g5-chinese-review/", name: "五上國語複習" },
  soc: { url: "https://windsorya.github.io/g5-social-review/", name: "五上社會複習" },
  wrong: { url: "https://windsorya.github.io/g5-wrong-review/", name: "錯題複習" },
};
const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const isNum = (x) => typeof x === "number" && Number.isFinite(x);
// ①影片：有影片就每支都要合法（11 碼 YouTube ID、有標題、start 是數字、end 是數字且大於 start；endNullable 的站 end 可為 null＝播到完）；
//   沒影片就要寫理由，理由去掉空白後至少 20 字。
function videoProblems(videos, noVideoReason, opt) {
  const endNullable = !!(opt && opt.endNullable);
  // Codex 審 g5-help f53bd540：videos={length:1}、"abc" 這類非陣列被當成「沒有影片」放行，畫面 VIDS.map 卻直接拋錯 ⇒ 有寫 videos 就必須是陣列
  if (videos != null && !Array.isArray(videos)) return ["videos 不是陣列（" + Object.prototype.toString.call(videos).slice(8, -1) + "）：畫面會拋錯或什麼都不顯示"];
  if (!Array.isArray(videos) || !videos.length) {
    // 2026-10-14 律師：「為何漏附影片……請日後避免再犯」——國語站 8 個新觀念我只寫一句理由就沒放影片，測試照放行。
    // ⇒ 沒有影片只認律師核可：{ reason: 理由（去空白 ≥20 字）, ownerApproved: "YYYY-MM-DD 律師原話：「…」" }；只寫理由字串一律不過，去找影片
    const o = noVideoReason;
    if (typeof o === "string") return ["沒有影片：只寫理由不算，要律師核可（{ reason, ownerApproved: \"YYYY-MM-DD 律師原話：「…」\" }），否則就去找影片"];
    const r = o && typeof o.reason === "string" ? o.reason.replace(/\s/g, "") : "";
    const ok = !!o && typeof o.ownerApproved === "string" && /^\d{4}-\d{2}-\d{2} 律師原話：「[^」]+」/.test(o.ownerApproved);
    return r.length >= 20 && ok ? [] : ["沒有影片：要寫理由（去空白 ≥20 字）並附律師核可原話（ownerApproved）"];
  }
  const bad = [];
  videos.forEach((v, i) => {
    const w = "第 " + (i + 1) + " 支影片";
    if (!v || typeof v !== "object") { bad.push(w + "不是物件"); return; }
    if (typeof v.id !== "string" || !YT_ID.test(v.id)) bad.push(w + " YouTube ID 不合法：" + v.id);
    if (typeof v.title !== "string" || !v.title.trim()) bad.push(w + "沒有標題");
    if (!isNum(v.start) || v.start < 0) bad.push(w + " start 不是數字：" + v.start);
    if (!(isNum(v.end) ? v.end > v.start : endNullable && v.end === null)) bad.push(w + " end 不合法：" + v.end);
  });
  return bad;
}
// 讀屬性：屬性名前面必須是空白（Codex 審 4b559c4：\bhref= 也會吃到 data-href=、\bcontent= 吃到 data-content=）。
function attrOf(tag, name) {
  const m = new RegExp("[\\s<]" + name + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)')", "i").exec(" " + String(tag));
  return m ? (m[2] !== undefined ? m[2] : m[3]) : null;
}
// ②圖【輔助；主閘＝e2e 的 flow_standard_dom】：至少一個 <svg>，帶 role="img"、aria-label（去空白後 ≥4 字），而且裡面真的有「有幾何資料」的繪圖元素（HTML 註解不算）。
// Codex 審 4b559c4：<path/> 沒有 d 也被當成有圖 ⇒ 每種元素要有它畫得出東西的必要屬性。
const DRAW_NEED = { path: ["d"], rect: ["width", "height"], circle: ["r"], ellipse: ["rx", "ry"], line: ["x2"], polyline: ["points"], polygon: ["points"], image: ["href"], use: ["href"] };
function drawsSomething(inner) {
  const re = /<(path|rect|circle|ellipse|line|polyline|polygon|image|use|text)\b([^>]*?)(\/?)>([\s\S]*?)(?=<|$)/gi;
  let m;
  while ((m = re.exec(inner))) {
    const el = m[1].toLowerCase();
    if (el === "text") { if (m[4].replace(/<[^>]*>/g, "").trim()) return true; continue; }
    // 線段看兩端點有沒有分開（Codex 審 f0422ce：x2="0" 的合法線段被誤判沒圖）；其他元素照必要屬性
    if (el === "line") { const g = (k) => parseFloat(attrOf("<line" + m[2], k) ?? "0") || 0; if (g("x1") !== g("x2") || g("y1") !== g("y2")) return true; continue; }
    if (DRAW_NEED[el].every((a) => { const v = attrOf("<" + el + m[2], a) ?? attrOf("<" + el + m[2], "xlink:" + a); return v !== null && String(v).trim() !== "" && String(v).trim() !== "0"; })) return true;
  }
  return false;
}
const DRAW = { test: drawsSomething };
const stripComments = (h) => String(h == null ? "" : h).replace(/<!--[\s\S]*?-->/g, "");
function figOk(html) {
  const re = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi, s = stripComments(html);
  let m;
  while ((m = re.exec(s))) {
    const label = attrOf("<svg" + m[1], "aria-label") || "";
    if (attrOf("<svg" + m[1], "role") === "img" && label.replace(/\s/g, "").length >= 4 && DRAW.test(m[2])) return true;
  }
  return false;
}
// ③句長：先依 <br>、換行、句號／驚嘆號／問號切句，切完才去 HTML（先去 HTML 會把 <br> 兩邊黏成一句）。
// 依本站實際怎麼放進畫面：RENDER.escaped＝文字先 esc() 才放進畫面（自然站、數學站），<br> 會變成字面、換行也不換行
// ⇒ 只有。！？是句界、標籤字元照算長度（Codex 審 4b559c4：自然站 esc(s.say)，舊判準卻把 <br> 當句界）。
// 沒 esc 的站（難題站）字元參照由瀏覽器解碼：Codex 審 g5-help f53bd540——舊判準把 &#23383; 刪成空字串，41 個「字」量成 0 字放行
// ⇒ 數字參照（十進位、十六進位）解成那個字，具名參照（&amp; &nbsp; …）各算 1 個字，最後才量長度。
const decodeRefs = (x) => x.replace(/&#(\d+);|&#x([0-9a-f]+);|&[a-z][a-z0-9]*;/gi, (all, d, h) => {
  const cp = d !== undefined ? parseInt(d, 10) : h !== undefined ? parseInt(h, 16) : NaN;
  return Number.isFinite(cp) ? (cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "\ufffd") : "＊";
});
function sentences(t) {
  const s = String(t == null ? "" : t);
  if (RENDER.escaped) return s.split(/[。！？]/).map((x) => x.trim()).filter(Boolean);
  return s.split(/<br\s*\/?>|\n|[。！？]/i)
    .map((x) => decodeRefs(x.replace(/<[^>]*>/g, "")).trim()).filter(Boolean);
}
const tooLong = (t) => sentences(t).filter((s) => s.length > MAX_SENTENCE);
// ④切換列【輔助；主閘＝e2e 的 flow_standard_dom】：只看 id="siteNav" 元素裡面（HTML 註解不算）：恰好兩個 <a>、href 恰為另外兩站，本站項目帶 aria-current="page" 且字是本站名。
function navProblems(html, self) {
  const h = stripComments(html), open = /<([a-z][\w-]*)\b[^>]*\bid="siteNav"[^>]*>/i.exec(h);
  if (!open) return ['找不到 id="siteNav"'];
  const end = h.indexOf("</" + open[1] + ">", open.index);
  if (end < 0) return ["siteNav 沒有結尾標籤"];
  const inner = h.slice(open.index + open[0].length, end), bad = [];
  const anchors = inner.match(/<a\b[^>]*>/gi) || [];
  const hrefs = anchors.map((a) => attrOf(a, "href") || "").sort();
  const want = Object.keys(SITES).filter((k) => k !== self).map((k) => SITES[k].url).sort();
  if (JSON.stringify(hrefs) !== JSON.stringify(want)) bad.push("siteNav 連結應恰為 " + want.join("、") + "；實際：" + (hrefs.join("、") || "（沒有連結）"));
  const cur = [...inner.matchAll(/<([a-z][\w-]*)\b[^>]*\baria-current="page"[^>]*>([\s\S]*?)<\/\1>/gi)];
  if (cur.length !== 1 || cur[0][2].replace(/<[^>]*>/g, "").trim() !== SITES[self].name) bad.push("siteNav 要有一個 aria-current=\"page\" 的「" + SITES[self].name + "」");
  return bad;
}
// ⑤收錄（meta 部分【輔助；主閘＝e2e 的 flow_standard_dom】；robots.txt 是純文字檔，本檔判準即主閘）：去掉 HTML 註解後 <head> 裡有 <meta name="robots" content 含 noindex>；robots.txt 在 User-agent: * 區段有一行恰為「Disallow: /」。
function robotsMetaOk(html) {
  const head = stripComments(html).split(/<\/head>/i)[0];
  return (head.match(/<meta\b[^>]*>/gi) || []).some((t) => {
    const attr = (n) => attrOf(t, n) || "";
    return attr("name").trim().toLowerCase() === "robots" && /(^|[\s,])noindex([\s,]|$)/i.test(attr("content"));
  });
}
function robotsTxtOk(txt) {
  let agents = [], inRules = false, ok = false;
  String(txt == null ? "" : txt).split(/\r?\n/).map((l) => l.replace(/#.*/, "").trim()).filter(Boolean).forEach((l) => {
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(l);
    if (!m) return;
    if (m[1].toLowerCase() === "user-agent") { if (inRules) { agents = []; inRules = false; } agents.push(m[2].trim()); }
    else { inRules = true; if (agents.includes("*") && l === "Disallow: /") ok = true; }
  });
  return ok;
}
// ===== 共通判準到此 =====

const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const ROBOTS = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
const clone = (x) => JSON.parse(JSON.stringify(x));

// 本站取資料：H.LIST 每一篇；影片在 e.videos（app.html 用 v.start／v.end 組播放網址，end 一律要數字）。
const videoMissing = (list) => list.map((e) => videoProblems(e.videos, e.noVideoReason).map((p) => e.id + "：" + p)).flat();
const figMissing = (list) => list.filter((e) => e.kind === "steps").map((e) => e.steps.map((s, i) => (figOk(s.fig) ? null : e.id + " 第 " + (i + 1) + " 步沒有圖"))).flat().filter(Boolean);

test("標準①影片：每一篇至少一段驗證過的影片（真的找不到要寫明理由）", () => {
  assert.deepEqual(videoMissing(H.LIST), []);
});

test("標準②圖：通用格式每一步都有圖", () => {
  assert.deepEqual(figMissing(H.LIST), []);
});

// 本站取資料（設計 D・B2）：孩子看到的字＝真瀏覽器（Chromium、WebKit）實際操作每個入口與分支後採到的可見文字
// （tests/kidgate.js＋tests/e2e_kidtext.py → tests/kidtext_harvest.json；不是這一版 index.html 量的就紅）。
// 舊版用原始碼重建畫面字，量不到 frac.js 回傳字與拼接後的全句（Codex 審 2e41b5d：61 字的通分提示仍過）。
const KT = require("./kidtext.js");
const harvestSelf = (id) => BROWSERS_OK(id);
function BROWSERS_OK(id) { const h = KT.readHarvest(); return !!h && KT.BROWSERS.every((b) => h.browsers[b] && h.browsers[b].selftests[id] && h.browsers[b].selftests[id].ok); }

test("標準③白話：孩子看到的每一句不超過年級句長上限（每一種 kind）", () => {
  assert.equal(MAX_SENTENCE, (KT.readHarvest() || {}).max, "採字時的句長上限要等於正式上限（小五 40，固定）");
  assert.deepEqual(KT.harvestProblems(["length", "unclassified"]), []);
});

test("標準④三站切換列：siteNav 連到另外兩站、本站標 aria-current", () => {
  assert.deepEqual(navProblems(HTML, SELF), []);
});

test("標準⑤不被搜尋引擎收錄：noindex meta 與 robots.txt 全站 Disallow", () => {
  assert.ok(robotsMetaOk(HTML), "缺有效的 noindex meta");
  assert.ok(robotsTxtOk(ROBOTS), "robots.txt 的 User-agent: * 沒有「Disallow: /」");
});

// ---------- 自檢：每一條判準把資料改壞要抓得到（反例出自上面三份 Codex 報告）----------
const STEPS_ID = H.LIST.find((e) => e.kind === "steps" && (e.steps || []).length).id;
const VIDEO_ID = H.LIST.find((e) => (e.videos || []).length).id;

test("自檢①a：沒有影片、理由是 20 個空白，要抓到", () => {
  const e = clone(H.get(VIDEO_ID)); e.videos = []; e.noVideoReason = " ".repeat(20);
  assert.ok(videoMissing([e]).length);
});
test("自檢①b：影片是 [{}]（會產生 watch?v=undefined），要抓到", () => {
  const e = clone(H.get(VIDEO_ID)); e.videos = [{}];
  assert.ok(videoMissing([e]).length);
});
test("自檢①c：YouTube ID 不是 11 碼、start 是字串，要抓到", () => {
  const e = clone(H.get(VIDEO_ID)); e.videos[0].id = "abc"; e.videos[0].start = "10";
  assert.ok(videoMissing([e]).length >= 2);
});
test("自檢②：<svg aria-label=\"板根示意\"></svg> 空圖，要抓到", () => {
  const e = clone(H.get(STEPS_ID)); e.steps[0].fig = '<svg aria-label="板根示意"></svg>';
  assert.ok(figMissing([e]).length);
  assert.ok(!figOk('<svg role="img" aria-label="板根示意"><!-- <rect/> --></svg>'), "註解裡的繪圖元素不算");
});
test("自檢③a：25 字<br>25 字是兩句，不可黏成 50 字", () => {
  assert.deepEqual(tooLong("字".repeat(25) + "<br>" + "字".repeat(25)), [], "共通判準");
  assert.ok(harvestSelf("B15"), "瀏覽器採字：真正 <br> 分行通過、相鄰 span 合成 50 字與窄視窗折行都要攔（e2e_kidtext B15）");
});
test("自檢③b：一句超過上限要抓到（數學篇 lead 也量）", () => {
  assert.ok(tooLong("字".repeat(MAX_SENTENCE + 1) + "。").length, "共通判準");
  assert.ok(harvestSelf("B19") && harvestSelf("B07") && harvestSelf("B14"), "瀏覽器採字：40 字過、41 字攔；數學篇 lead 100 字、步驟標題 100 字都要攔（e2e_kidtext B19、B07、B14）");
});
test("自檢④a：數學站連結改指自然站，要抓到", () => {
  const bad = HTML.split('href="' + SITES.math.url + '"').join('href="' + SITES.sci.url + '"');
  assert.notEqual(bad, HTML); assert.ok(navProblems(bad, SELF).length);
});
test("自檢④b：移除 siteNav 裡的兩個 <a>（網址還留在別處），要抓到", () => {
  const bad = HTML.replace(/(<[a-z]+\b[^>]*\bid="siteNav"[^>]*>)([\s\S]*?)(<\/nav>)/i, (_, a, b, c) => a + b.replace(/<a\b[\s\S]*?<\/a>/gi, "") + c);
  assert.notEqual(bad, HTML); assert.ok(navProblems(bad + "<script>var u='" + SITES.math.url + SITES.sci.url + "'</script>", SELF).length);
});
test("自檢⑤a：robots meta 包在 HTML 註解裡，要抓到", () => {
  const meta = /<meta\b[^>]*name="robots"[^>]*>/i.exec(HTML)[0];
  assert.ok(!robotsMetaOk(HTML.replace(meta, "<!-- " + meta + " -->")));
});
test("自檢⑤b：robots.txt 只禁 /private/，要抓到", () => {
  assert.ok(!robotsTxtOk("User-agent: *\nDisallow: /private/\n"));
  assert.ok(!robotsTxtOk("User-agent: Googlebot\nDisallow: /\n\nUser-agent: *\nAllow: /\n"), "Disallow: / 要在 User-agent: * 區段");
});

// ---------- 自檢（交辦 #1431）：Codex 審 g5-help f53bd540 的五個反例，舊判準全部放行 ----------
const APPROVED = { reason: "這一篇真的找不到合適的影片所以先不放，等之後找到再補上去", ownerApproved: "2026-10-14 律師原話：「這篇可以不放影片」" };
test("自檢①d：videos 不是陣列（{length:1}、\"abc\"）就算附了律師核可也要抓到——畫面 VIDS.map 會拋錯", () => {
  for (const v of [{ length: 1 }, "abc", { 0: { id: "aaaaaaaaaaa", start: 0, end: 10 }, length: 1 }]) {
    const e = clone(H.get(VIDEO_ID)); e.videos = v; e.noVideoReason = APPROVED;
    assert.ok(videoMissing([e]).length, JSON.stringify(v));
  }
  const e = clone(H.get(VIDEO_ID)); delete e.videos; e.noVideoReason = APPROVED;
  assert.deepEqual(videoMissing([e]), [], "正例：沒有 videos 欄位＋律師核可照放行");
});
test("自檢②b：<path/>（沒有 d）空圖，要抓到", () => {
  const e = clone(H.get(STEPS_ID)); e.steps[0].fig = '<svg role="img" aria-label="板根示意"><path/></svg>';
  assert.ok(figMissing([e]).length);
});
test("自檢③c：41 個 &#23383;（瀏覽器解成 41 個「字」）要抓到，40 個不誤判", () => {
  assert.ok(tooLong("&#23383;".repeat(MAX_SENTENCE + 1) + "。").length, "十進位");
  assert.ok(tooLong("&#x5b57;".repeat(MAX_SENTENCE + 1) + "。").length, "十六進位");
  assert.deepEqual(tooLong("&#23383;".repeat(MAX_SENTENCE) + "。"), [], "正例");
});
test("自檢④c：siteNav 的 href 改成 data-href（沒有真目的地），要抓到", () => {
  const bad = HTML.replace(/(<[a-z]+\b[^>]*\bid="siteNav"[^>]*>)([\s\S]*?)(<\/nav>)/i, (_, a, b, c) => a + b.replace(/<a href=/g, "<a data-href=") + c);
  assert.notEqual(bad, HTML); assert.ok(navProblems(bad, SELF).length);
});
test("自檢⑤c：<meta data-name=\"robots\" data-content=\"noindex\">（沒有真屬性），要抓到", () => {
  const meta = /<meta\b[^>]*name="robots"[^>]*>/i.exec(HTML)[0];
  assert.ok(!robotsMetaOk(HTML.replace(meta, '<meta data-name="robots" data-content="noindex,nofollow">')));
});
