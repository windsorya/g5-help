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
  ];
  // 端到端測試用：頁面載入前若有 window.__G5_HARD_FIXTURE__（只有測試會放），併入清單
  if (root && root.__G5_HARD_FIXTURE__ && Array.isArray(root.__G5_HARD_FIXTURE__)) LIST = LIST.concat(root.__G5_HARD_FIXTURE__);
  function get(id) { for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i]; return null; }
  var SUBJECTS = ["國語", "數學", "自然", "社會", "英文", "其他"];
  var api = { LIST: LIST, get: get, SUBJECTS: SUBJECTS, KINDS: ["frac-compare", "steps"] };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.G5Hard = api;
})(typeof window !== "undefined" ? window : this);
