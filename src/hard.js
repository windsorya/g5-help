// 五年級難題解說：律師傳來「她不懂這題」的題目，一題一篇、只講那一題，不分科目（2026-10-13 律師：「不需要重新解說整張試卷，
// 而只需要特別解說我傳給你的題目」「不論是哪一種科目，諸如國、數、自然、社會、英文」）。
// 新增一篇＝在 LIST 加一個物件；tests/hard.test.js 會逐篇驗欄位，數學題另驗算答案。
// kind：frac-compare＝異分母分數比大小（互動算題，用 src/frac.js 判對錯）；
//       steps＝任何科目通用：分步解說（每步可附圖與確認題）＋答案＋同型練習（選擇題）。
// steps 的欄位：question（題目）、steps[{title, say, fig?, check?{q, opts[], a, why[]}}]、answer、write?、practice[{q, opts[], a, why[]}]
(function (root) {
  "use strict";
  var LIST = [
    {
      id: "p38-6-2", date: "2026-10-12", subject: "數學", kind: "frac-compare",
      source: "習作第 38 頁・第 6 題②", ask: "先通分，再比較大小，在□中填入 > 或 <。",
      title: "28/42 和 27/45 比大小",
      tag: "先約分，再通分",
      a: { n: 28, d: 42 }, b: { n: 27, d: 45 },
      lead: "這題的分母 42 和 45 都很大，直接通分會很辛苦。跟著下面一步一步做，每一步都要你自己動手算。",
      // 她同一頁第①題自己做對的方法（照片：18/32＝9/16、21/48＝7/16），拿來接新觀念
      prior: {
        q: "第①題的 18/32 和 21/48 數字也很大，你是怎麼讓它們變小的？",
        ok: "對！第①題你把 18/32 約成 9/16。這題也一樣：先約分，數字變小，再通分。",
        hint: "想想第①題你是怎麼把 18/32 變成 9/16 的。"
      },
      parent: "<p><b>這題比同一頁其他題難在哪：</b>42 和 45 直接通分要用 630（最小公倍數），數字太大。關鍵是先約分：28/42 = 2/3、27/45 = 3/5，再用 15 通分：10/15 &gt; 9/15，所以□填「&gt;」。</p>" +
        "<p><b>這裡教的兩件事：</b>①數字大的時候先約分（約分不會改變分數大小，用長條圖讓她看到）；②怎麼找能一起除的數（從乘法表的 2、3、5、7、9 試）。同一頁①③④和第 7 題的通分寫法都對，所以不重教通分本身。</p>" +
        "<p><b>陪她時可以追問一句：</b>「為什麼這題要先約分？」聽到「數字太大，先約分比較好算；約分不會改變大小」就表示懂了。</p>",
      // 每段都讀過字幕（whisper 全片）、抽格看過才放；playable_in_embed=True（2026-10-12 驗證）
      videos: [
        { id: "XIdh6AxYItA", start: 662, end: 748, len: "約 1 分半", title: "先約分，再通分（臺北酷課雲・濱江國小吳政達老師）",
          note: "比 7/9 和 10/12：先把 10/12 約分成 5/6，再用 9 和 6 的最小公倍數 18 通分，14/18 < 15/18。跟習作這題的做法一樣。" },
        { id: "xdAu15d7MRs", start: 158, end: 224, len: "約 1 分鐘", title: "用約分讓分母變一樣（均一教育平台）",
          note: "8/12 一路約成 2/3、6/18 約成 1/3，約完分母一樣就能比。這段只約分，沒有再通分。" }
      ]
    }
    ,
    {
      id: "sci-q5-bangen", date: "2026-10-13", subject: "自然", kind: "steps",
      source: "植物世界練習卷・選擇題第 5 題", title: "銀葉樹的板根是什麼？", tag: "板根和氣生根怎麼分",
      ask: "為了適應環境，銀葉樹發展出「板根」。關於板根，哪些敘述正確？",
      question: "銀葉樹的「板根」，下面哪些說法正確？<br>(1) 外形細細長長的，很像鬍鬚<br>(2) 突出地面，並呈現翼狀三角形<br>(3) 可以增加抓地面積，讓植物穩固生長<br>(4) 主要功能是長出繁殖用的新芽",
      lead: "先弄清楚板根長在哪、長什麼樣子、有什麼用，再回來一個一個判斷。",
      steps: [
        { title: "板根長在哪裡？",
          say: "大部分的根都埋在土裡看不到。銀葉樹不一樣：它的根有一部分<b>長出地面</b>，一片一片的，像立起來的木板，所以叫「板根」。",
          fig: '<svg viewBox="0 0 320 170" role="img" aria-label="大樹底部有幾片三角形的板根突出地面"><rect x="0" y="130" width="320" height="40" fill="var(--soil)" opacity=".35"/><rect x="146" y="20" width="28" height="112" fill="var(--soil)"/><circle cx="160" cy="28" r="44" fill="var(--grass)"/><polygon points="146,80 96,132 146,132" fill="var(--soil)" opacity=".85"/><polygon points="174,80 228,132 174,132" fill="var(--soil)" opacity=".85"/><polygon points="155,95 130,132 160,132" fill="var(--soil)" opacity=".6"/><text x="70" y="160" font-size="14" fill="var(--ink)">板根：突出地面、像三角形的翅膀</text></svg>',
          check: { q: "板根長在哪裡？", opts: ["全部埋在土裡看不到", "有一部分突出地面，看得到"], a: 1,
                   why: ["一般的根埋在土裡；板根特別的地方，就是突出地面。", ""], ok: "對！板根突出地面，看得到。" } },
        { title: "板根長什麼樣子？",
          say: "板根從樹幹底部往四周伸出去，又扁又寬，從旁邊看像<b>三角形的翅膀</b>（翼狀）。<br>細細長長、像鬍鬚一樣從樹枝垂下來的，是<b>榕樹的氣生根</b>，不是板根。",
          check: { q: "哪一個是板根的樣子？", opts: ["細細長長，像鬍鬚垂下來", "又扁又寬，像三角形的翅膀"], a: 1,
                   why: ["像鬍鬚垂下來的是榕樹的氣生根。", ""], ok: "對！所以 (1) 說的「像鬍鬚」是錯的。" },
          fig: '<svg viewBox="0 0 320 170" role="img" aria-label="左邊榕樹的氣生根從樹枝垂下來像鬍鬚，右邊銀葉樹的板根在地面像三角形翅膀"><rect x="0" y="140" width="320" height="30" fill="var(--soil)" opacity=".3"/><rect x="66" y="40" width="16" height="102" fill="var(--soil)"/><rect x="74" y="40" width="70" height="8" fill="var(--soil)"/><circle cx="90" cy="34" r="34" fill="var(--grass)"/>' + [92,104,116,128,138].map(function(x){ return '<line x1="' + x + '" y1="48" x2="' + x + '" y2="' + (96 + (x % 3) * 8) + '" stroke="var(--soil)" stroke-width="2"/>'; }).join("") + '<text x="22" y="164" font-size="12" fill="var(--ink)">榕樹：氣生根（像鬍鬚）</text><rect x="236" y="40" width="16" height="102" fill="var(--soil)"/><circle cx="244" cy="34" r="34" fill="var(--grass)"/><polygon points="236,96 200,142 236,142" fill="var(--soil)"/><polygon points="252,96 290,142 252,142" fill="var(--soil)"/><text x="180" y="164" font-size="12" fill="var(--ink)">銀葉樹：板根（像翅膀）</text></svg>' },
        { title: "板根有什麼用？",
          say: "銀葉樹常長在海邊、河口，土又軟又濕，風也大。板根像一片片撐住大樹的支架，讓樹<b>抓住地面的面積變大</b>，就站得穩、不容易倒。<br>繁殖（生出新的植物）靠的是花、果實和種子，不是板根。",
          check: { q: "板根主要幫銀葉樹做什麼？", opts: ["長出新芽來繁殖", "增加抓地面積，讓樹站穩"], a: 1,
                   why: ["繁殖靠花、果實和種子；板根是幫忙站穩的。", ""], ok: "對！所以 (3) 正確、(4) 錯誤。" },
          fig: '<svg viewBox="0 0 320 170" role="img" aria-label="海邊軟泥上的銀葉樹，強風吹來，板根撐住樹讓它站穩"><rect x="0" y="132" width="320" height="38" fill="var(--waterfill)" opacity=".6"/><rect x="0" y="128" width="320" height="10" fill="var(--soil)" opacity=".4"/><rect x="186" y="30" width="18" height="100" fill="var(--soil)"/><circle cx="195" cy="28" r="32" fill="var(--grass)"/><polygon points="186,82 132,132 186,132" fill="var(--soil)"/><polygon points="204,82 262,132 204,132" fill="var(--soil)"/><line x1="20" y1="60" x2="110" y2="60" stroke="var(--pri)" stroke-width="3"/><polygon points="110,54 122,60 110,66" fill="var(--pri)"/><line x1="20" y1="84" x2="100" y2="84" stroke="var(--pri)" stroke-width="3"/><polygon points="100,78 112,84 100,90" fill="var(--pri)"/><text x="20" y="48" font-size="13" fill="var(--ink)">強風</text><text x="128" y="160" font-size="13" fill="var(--ink)">板根抓住地面的面積變大 → 站穩</text></svg>' },
        { title: "回到題目，一個一個看",
          say: "(1) 像鬍鬚 → 那是榕樹的氣生根，<b>錯</b>。<br>(2) 突出地面、翼狀三角形 → <b>對</b>。<br>(3) 增加抓地面積、穩固生長 → <b>對</b>。<br>(4) 長出繁殖用的新芽 → 板根不負責繁殖，<b>錯</b>。",
          fig: '<svg viewBox="0 0 320 150" role="img" aria-label="四個選項的對錯：1錯、2對、3對、4錯"><g font-size="15" fill="var(--ink)"><text x="20" y="30">(1) 像鬍鬚</text><text x="20" y="62">(2) 突出地面、三角形</text><text x="20" y="94">(3) 增加抓地面積、站穩</text><text x="20" y="126">(4) 長新芽來繁殖</text></g><g font-size="20" font-weight="700"><text x="260" y="30" fill="var(--bad)">錯</text><text x="260" y="62" fill="var(--leaf)">對</text><text x="260" y="94" fill="var(--leaf)">對</text><text x="260" y="126" fill="var(--bad)">錯</text></g></svg>' }
      ],
      answer: "在 (2)、(3) 打ˇ。",
      write: "( )(1)　(ˇ)(2)　(ˇ)(3)　( )(4)",
      practice: [
        { q: "榕樹從樹枝垂下來、細細長長的根，叫做什麼？", opts: ["板根", "氣生根"], a: 1, why: ["板根是突出地面、像三角形翅膀的根。", ""] },
        { q: "銀葉樹的板根有什麼好處？", opts: ["讓樹在鬆軟的泥地站得更穩", "讓樹更快開花結果"], a: 0, why: ["", "開花結果跟板根沒有關係；板根是幫忙站穩的。"] },
        { q: "下面哪一個是植物用來「繁殖」的構造？", opts: ["板根", "種子"], a: 1, why: ["板根是幫忙站穩的根，不負責繁殖。", ""] },
        { q: "板根長在哪裡？", opts: ["突出地面", "全部埋在土裡"], a: 0, why: ["", "板根特別的地方就是突出地面、看得到。"] }
      ],
      // 2026-10-13 驗證：whisper／作者字幕全文讀過、抽格看過（A_95ff_240「板根」字卡＋手摸板根；B_LQPR_330 板根實景）；playable_in_embed=True
      videos: [
        { id: "95ffZ3un7eg", start: 149, end: 297, len: "約 2 分半", title: "榕樹的氣生根、板根和支柱根（教學節目片段）",
          note: "先看榕樹從樹枝垂下來的氣生根，再看真的板根：講解員摸著樹幹底部說明板根讓樹站得更穩。畫面有繁體字幕。" },
        { id: "LQPR67ud3UI", start: 317, end: 352, len: "約 35 秒", title: "板根像電線桿的基座（有夠好。就是要讓你懂）",
          note: "長在硬地或土層淺的地方，根會長成一片片的板根來撐住大樹，就像電線桿底下的基座。" }
      ],
      parent: "<p><b>她這題其實勾對了</b>（(2)(3)）。這篇是讓她確定「為什麼對」：分清楚板根（突出地面、三角形、幫忙站穩）和榕樹的氣生根（像鬍鬚垂下來），並知道繁殖靠花、果實、種子。</p><p><b>可以追問一句：</b>「板根和榕樹的鬍鬚根有什麼不一樣？」聽到「板根在地上、像三角形翅膀、讓樹站穩；鬍鬚根從樹枝垂下來」就表示懂了。</p>"
    }
  ];
  // 端到端測試用：頁面載入前若有 window.__G5_HARD_FIXTURE__（只有測試會放），併入清單
  if (root && root.__G5_HARD_FIXTURE__ && Array.isArray(root.__G5_HARD_FIXTURE__)) LIST = LIST.concat(root.__G5_HARD_FIXTURE__);
  function get(id) { for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i]; return null; }
  var SUBJECTS = ["國語", "數學", "自然", "社會", "英文", "其他"];
  // 白話程度跟著年級走（2026-10-13 律師：「現在小五，就用小五生的白話易懂程度；之後小六，就用小六生的」）。
  // 學年度 8/1 換年級：2026 學年（2026-08-01～2027-07-31）＝小五。每句上限是寫給孩子讀的長度，tests/hard.test.js 逐句檢查。
  var GRADE_BASE = { schoolYear: 2026, grade: 5 };
  var READING = { 5: { maxSentence: 40, label: "小五" }, 6: { maxSentence: 45, label: "小六" }, 7: { maxSentence: 50, label: "國一" }, 8: { maxSentence: 55, label: "國二" }, 9: { maxSentence: 60, label: "國三" } };
  function gradeAt(d) { var y = d.getFullYear() - (d.getMonth() < 7 ? 1 : 0); return GRADE_BASE.grade + (y - GRADE_BASE.schoolYear); }
  function readingAt(d) { var g = gradeAt(d); return READING[g] || READING[9]; }
  var api = { LIST: LIST, get: get, SUBJECTS: SUBJECTS, KINDS: ["frac-compare", "steps"], gradeAt: gradeAt, readingAt: readingAt, READING: READING };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5Hard = api;
})(typeof window !== "undefined" ? window : this);
