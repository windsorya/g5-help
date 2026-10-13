# 家庭同步碼

把每個 localStorage key 當成一份完整文件同步。後端以 `rev` 樂觀鎖決定是否接受寫入；兩邊都變動時，由家長選擇，程式不合併任何進度欄位。

本目錄提供可測試的程式與部署步驟，尚未部署到 Google Apps Script 或 GitHub Pages。實際網站的資料 schema 不在本目錄，摘要函式需接各站既有的計算方式。

## 檔案

| 路徑 | 用途 |
| --- | --- |
| `src/sync.js` | ES5 語法的瀏覽器函式庫、面板、同步排程；同時支援 CommonJS |
| `src/qrcode.js` | 使用原有 MIT QR 函式庫，未修改 |
| `gas/core.js` | 無 GAS API 的同步協定、鎖定流程、分塊編解碼 |
| `gas/Code.js` | GAS HTTP 入口、試算表 store、`setup()` |
| `gas/appsscript.json` | 台北時區、V8、部署者身分及匿名存取 |
| `tests/harness.js` | 假 DOM、localStorage、時鐘、fetch、記憶體 store |
| `tests/sync.test.js` | 前端與雙裝置情境測試 |
| `tests/gascore.test.js` | 協定、分塊及 GAS adapter 測試 |
| `REPORT.md` | 驗收對照與實際測試結果 |

執行期不需要 npm 套件、框架或外部 QR 服務。瀏覽器須提供 `Promise`、`fetch`、localStorage；第一台產生同步碼需要 HTTPS 下的 `crypto.getRandomValues`。程式以 ES5 語法撰寫，不表示支援缺少這些瀏覽器 API 的舊版瀏覽器。

## 部署 GAS

以下命令是供家長部署時執行的步驟，本次沒有登入 Google、建立試算表或進行任何部署。

1. 準備 Node.js 與 `@google/clasp`，並在 Google Apps Script 的使用者設定啟用 Apps Script API。三個網站共用同一個 GAS 專案及 `/exec` 端點。

2. 在本專案根目錄啟動部署。先保留 manifest，避免 `clasp create` 產生的初始 manifest 取代設定。登入憑證由 clasp 自行管理，不要放進 Git 或網站。

   ```sh
   npm install -g @google/clasp
   mkdir -p work
   cp gas/appsscript.json work/appsscript.deploy.json
   cd gas
   clasp login
   clasp create --type standalone --title "G5 家庭同步"
   cp ../work/appsscript.deploy.json appsscript.json
   clasp push
   ```

   若已有 GAS 專案，使用既有 `.clasp.json` 指向它，略過 `clasp create`。在 `gas/` 執行 `clasp push`，只上傳此資料夾的程式；不要把前端或測試檔案推進 GAS。clasp 命令選項應以實際安裝版本的 `clasp --help` 為準，本次未執行 clasp。

3. 開啟該專案的 GAS 編輯器，第一次手動執行 **`setup`**，以家長帳號核准試算表權限。

   - `setup()` 建立「G5 家庭同步」試算表與 `Sync` 工作表。
   - 試算表 ID 存在 ScriptProperties 的 **`SHEET_ID`**。
   - 重跑 `setup()` 會沿用相同試算表，不清除既有資料。
   - 不需要把試算表公開，也不要讓孩子編輯試算表。

4. 建立部署版本：

   ```sh
   clasp deploy --description "家庭同步碼初版"
   ```

   在 GAS「管理部署作業」確認類型是「網頁應用程式」，執行身分為部署者、存取權為「所有人」（含未登入者）。對應 manifest：

   ```json
   {
     "webapp": {
       "executeAs": "USER_DEPLOYING",
       "access": "ANYONE_ANONYMOUS"
     }
   }
   ```

   使用正式網址 `https://script.google.com/macros/s/部署ID/exec`，不要使用 `/dev`。若組織政策不允許匿名網頁應用程式，需由該帳號管理者處理；程式不能繞過組織政策。

5. 以未登入 Google 的瀏覽器開啟 `/exec`，應收到 `{"ok":true,"pong":true}`。這只驗證 HTTP 入口，**不代表試算表讀寫或跨來源 POST 已驗證**。再用測試進度在兩台裝置依序開啟、加入、修改、衝突選擇，確認試算表列、localStorage 及面板一起改變。

6. 更新同一部署時：

   ```sh
   clasp push
   clasp deploy --deploymentId "既有部署ID" --description "家庭同步碼更新"
   ```

   保留部署 ID，三站便不必改端點。manifest 僅要求 `https://www.googleapis.com/auth/spreadsheets`；core 不需要網路請求或其他 OAuth scope。

## 各站接入

把 `src/sync.js` 和原有 `src/qrcode.js` 複製到每站對應的 `src/`，並在頁面放入容器。先載入 QR 函式庫，再載入同步函式庫；每頁只初始化一個 controller。

```html
<section id="family-sync"></section>
<script src="./src/qrcode.js"></script>
<script src="./src/sync.js"></script>
<script>
var reloadQueued = false;
var familySync = G5Sync.init({
  endpoint: 'https://script.google.com/macros/s/請填正式部署ID/exec',
  keys: ['g5sci.v3', 'g5help.v1', 'g5math.v1', 'g5math.v2'],
  container: '#family-sync',
  summarize: {
    'g5sci.v3': function (jsonString) {
      // 請換成自然站既有的進度摘要函式；勿猜測 JSON 欄位。
      return '自然練習紀錄，共 ' + jsonString.length + ' 字元';
    },
    'g5help.v1': function (jsonString) {
      return '難題解說紀錄，共 ' + jsonString.length + ' 字元';
    }
  },
  onReplaced: function (key) {
    // 一次完成這輪的全部 key 後才回呼。若多個 key 被替換，只排一次重載。
    if (!reloadQueued) {
      reloadQueued = true;
      window.setTimeout(function () { location.reload(); }, 0);
    }
  }
});
</script>
```

各站仍用原本的 `localStorage.setItem(key, JSON.stringify(progress))` 儲存，無須改成另一份進度資料模型。下載會完整取代該 key，網站必須在 `onReplaced` 重新讀取 localStorage 或重載頁面，避免仍在記憶體中的舊狀態寫回。初始畫面若需要等第一次同步，可用 `familySync.ready.then(...)` 接既有啟動畫面流程；同步失敗也會結束這個 Promise，孩子可繼續使用本機進度。

三個 GitHub Pages 路徑共用 `https://windsorya.github.io` origin，因此可用相同四個 `keys` 一次同步三站資料；只同步該站自己的 key 也可以，寫 metadata 時會保留其他 key 的資料。四個 key 彼此獨立，不將 `g5math.v1` 自動搬移或合併成 `g5math.v2`。

同一瀏覽器只要在其中一站加入，其他站重新開啟便會讀到 `g5sync.code`。不同瀏覽器／裝置仍需各加入一次；設定存於 localStorage，清除瀏覽資料或某些私密瀏覽模式可能移除它。

可選的樣式；所有面板 class 以前綴 `g5s-` 命名，按鈕本身已有 `min-height:44px`：

```css
.g5s-panel { padding: 1rem; border: 1px solid #bfcad4; border-radius: 12px; }
.g5s-button { min-height: 44px; padding: .6rem .9rem; margin: .25rem; cursor: pointer; }
.g5s-input, .g5s-link { box-sizing: border-box; max-width: 100%; padding: .5rem; }
.g5s-link { width: 100%; }
.g5s-code { font-size: 1.5rem; font-weight: 700; letter-spacing: .08em; }
.g5s-conflict { margin-top: 1rem; padding: 1rem; border: 2px solid #915e00; }
.g5s-notice { color: #8c2700; }
```

## API 與測試注入

`G5Sync.init(options)` 回傳 controller：

| API | 用途 |
| --- | --- |
| `ready` | 第一次開頁 get 或網址加入完成後 resolve；失敗 resolve `false` |
| `enable()` | 第一台產生安全亂數碼，保存後開始同步；回傳 Promise |
| `join(code)` | 容忍大小寫、空白與連字號；重新建立同步基準，雙方有資料一定要求選擇 |
| `sync()` | 立即檢查本機變動；仍遵守錯誤退避；回傳 Promise |
| `resolve(key, 'local' 或 'cloud')` | 選擇完整文件；失敗會重試已選操作，若雲端再次改動則要求重新選擇 |
| `stop()` | 只刪 `g5sync.code`／`g5sync.meta`，保留進度及備份；回傳是否成功清除設定 |
| `destroy()` | 移除 timer／listener、停止這個 controller；不清同步設定，適用頁面卸載或測試 |
| `link()` | 目前頁面網址（保留 query、去掉原 fragment）加 `#sync=CODE` |
| `getState()` | 面板狀態、同步碼、衝突、重試時間；內容含同步碼，勿上傳日誌 |

`init` 可注入：

- `now: function () { return 毫秒整數; }`，預設 `Date.now`。
- `random: function (uint8Array) { ...填入每一個 byte...; }`，預設 `crypto.getRandomValues`。也接受提供 `getRandomValues` 的物件；沒有安全亂數時拒絕建立同步碼，沒有 `Math.random` fallback。
- `fetch: function (url, options) { return Promise<Response>; }`。
- `storage`：提供 `getItem/setItem/removeItem/key/length` 的 localStorage 介面。

測試使用 VM 的假 window timer 控制 4 秒輪詢與退避；生產環境不需注入 timer 或安裝依賴。Node 也可 `require('./src/sync.js')`；初始化 UI 時仍需提供 DOM container（測試使用假的 DOM ownerDocument）。

## 同步規則

- **開頁**：先對每個 key `get`。雲端較新且本機仍等於上次基準，先備份本機再下載；本機也改過則顯示衝突。版本相同且本機改過才上傳。
- **加入**：沒有本機基準時，本機與雲端都有資料必須選擇，即使字串相同。加入途中離線後重新開頁，也維持此規則。
- **推送**：前景頁面每 4 秒檢查；`visibilitychange` 變 hidden、瀏覽器恢復 online 時立即嘗試。每個 controller 依序執行請求；後端 script lock 保護不同裝置／分頁的並行寫入。
- **衝突**：「留這台的」先把目前展示的雲端全文備份，再以該雲端 rev put 本機全文；「留雲端的」先確認雲端版本仍等於展示版本，再備份本機並下載。雲端再次變動時重新顯示選擇。
- **失敗**：網路拒絕／離線顯示「離線中，連上網路會自動補上」；HTML、HTTP 錯誤、非預期 JSON 或後端錯誤顯示「同步失敗，稍後自動再試」。依序退避 4、8、16、32、60 秒，之後維持 60 秒；明確的 online／hidden 事件可以立即嘗試。
- **請求逾時**：15 秒後解開本機等待，瀏覽器支援 `AbortController` 時中止該請求。已送到後端的寫入可能已完成；若回覆遺失，重試收到 conflict 仍需家長確認，不冒稱失敗的寫入一定沒有發生。
- **停止**：同 origin 的三站共用 code/meta，停止會讓同瀏覽器其他站在 storage event 或下次輪詢時停止。已抵達 GAS 的 put 不能藉停止功能撤回，但晚到的回覆不會重新建立本機設定或覆寫本機資料。
- **移除 key**：不把本機 `removeItem` 當成刪除雲端指令；協定沒有雲端刪除操作。空字串 `""` 是有效文件，與缺少 key 的 `null` 不同。

同步中的新作答會在下一輪推送，不能把請求送出後才產生的新內容當成已同步。某個 key 過大或失敗也不會阻止同一輪其他 key 處理。若備份無法寫入，便不執行會丟棄另一份文件的選擇。

## 資料格式

### 本機

`g5sync.code`：12 個大寫英數字元，字母表 `ABCDEFGHJKMNPQRSTUVWXYZ23456789`；顯示成 `XXXX-XXXX-XXXX`。網址的 `#sync=` 在發出第一個請求前移除，其他 fragment 片段及 history state 保留。

`g5sync.meta` 範例（雜湊值以示意文字代替）：

```json
{
  "version": 1,
  "codeHash": "sha256-utf16le:<本機碼的雜湊>",
  "keys": {
    "g5sci.v3": {
      "rev": 1,
      "hash": "sha256-utf16le:<上次確認同步的完整內容雜湊>",
      "updated": 1791849600000
    }
  }
}
```

`hash` 是 `SHA-256(UTF-16LE('S' + 文件字串))`；缺少文件是 `SHA-256(UTF-16LE('N'))`，避免 null 與空字串混淆，也保留 Unicode code unit 差異。metadata 的 `codeHash` 用於防止另一組同步碼誤用舊 rev，與後端認證碼雜湊用途不同。

`g5sync.backup.<key>.<時間>`：值就是被保留的另一份原始文件字串；時間是本機毫秒整數，同一毫秒碰撞時遞增以免覆蓋。每個 key 最多保留 3 份最新備份，成功寫入新備份後才刪除舊備份。停止同步不刪備份。需要復原時，先停止同步，從瀏覽器儲存空間取出選定備份，確認內容後還原到原 key 並重載；重新加入時再選要留的整份文件。

### HTTP

```json
{"op":"put","code":"ABCDEFGHJKMN","key":"g5sci.v3","rev":0,"data":"{\"n\":1}"}
```

POST 使用 `Content-Type: text/plain`、JSON body、`credentials: omit`，不加自訂認證 header，避免 CORS preflight。碼不放在 API query string，也不送至 QR 服務。

| 情境 | 回覆 |
| --- | --- |
| ping | `{ok:true, pong:true}` |
| get 無資料 | `{ok:true, rev:0, data:null, updated:null}` |
| get 有資料 | `{ok:true, rev:1, data:"原始字串", updated:毫秒}` |
| put 成功 | `{ok:true, rev:舊版+1, updated:毫秒}` |
| conflict | `{ok:false, err:"conflict", rev:目前版, data:"雲端全文", updated:毫秒}` |
| 格式或伺服器錯誤 | `{ok:false, err:"bad-code"/"bad-key"/"bad-data"/"too-big"/"bad-rev"/"bad-op"/"bad-request"/"server"}` |

`data` 當成不透明字串，不解析或合併 JSON 欄位。長度上限 900000 個 JavaScript UTF-16 code unit；`rev` 必須是非負安全整數。網頁與 GAS 內部例外不會把原始錯誤訊息顯示給孩子。

### 後端 store

核心入口：`G5SyncCore.handle(store, req, now)`；CommonJS 匯出相同物件。

```js
var store = {
  hash: function (code) { /* 回傳 SHA-256(code UTF-8) 的小寫 hex */ },
  withLock: function (fn) { /* 取得鎖，呼叫並回傳 fn()，finally 釋放 */ },
  get: function (codeHash, key) { /* null 或 {rev, data, updated} */ },
  set: function (codeHash, key, record) { /* 寫完整文件 */ }
};
```

`hash` 與 `withLock` 都透過 `store` 參數注入，保持 `handle(store, req, now)` 的三參數介面。core 與 store 同步執行；Node 測試用 `crypto`，GAS 用 `Utilities.computeDigest`。get、rev 比較及 put 均在同一個鎖區段內，GAS `waitLock(10000)`，`SpreadsheetApp.flush()` 成功後才釋放。

試算表每列：`codeHash, key, rev, updated, chunkCount, chunk1 … chunkN`。codeHash 是伺服器端 SHA-256，沒有原始碼欄位，也不記錄請求 body。每個 chunk cell 前面固定加 `~`，其餘最多 44999 字元，總長不超過 45000；還原時拿掉每格第一個 `~` 再依序串接。此前綴避免中間分塊以 `=` 開頭時被 Sheets 當成公式；分塊也不切斷 Unicode surrogate pair。最大文件最多 21 格。縮短文件時，同一次列寫入會清空殘留尾塊。

`updated` 是 GAS 寫入時間；面板顯示台北時間。既有 localStorage 沒有通用的修改時間 API，衝突面板明確標示「本機變更偵測時間」，不把偵測時間冒充孩子實際作答時間。

同步碼等同家人的存取憑證，持有者能讀寫這組進度，請只分享給家人。試算表的進度仍是明文；SHA-256 保護的是碼的儲存方式，不是文件加密。這套協定沒有帳號找回或權限分級。

## 測試與部署後確認

不需 `npm install`：

```sh
for f in tests/*.test.js; do node --test $f; done
node --test tests/*.test.js
```

測試沒有外部請求，假 fetch 直接呼叫純 core 與記憶體 store，另外用 GAS API doubles 測試 `Code.js`。QR 測試載入原有函式庫並檢查實際 SVG 字串與輸入連結。

部署後仍須在真實裝置確認匿名 GET／POST 與重導向、Safari／iPad storage 與剪貼簿、QR 掃描、背景頁面／鎖屏重開，以及三站各自的摘要與重載流程。瀏覽器可節流背景 timer，關頁／鎖屏當下的網路送出也不保證完成；本機進度保留後，下次開頁會再次檢查。
