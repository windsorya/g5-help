// 重寫題目鍵快照 tests/fixtures/practice_keys.json（交辦 #2282）：刻意換題、確認舊題的看過紀錄不再套用是預期的，才跑這支
// 執行：node tools/practice_keys.js
"use strict";
const fs = require("fs"), path = require("path"), H = require("../src/hard.js");
const out = {};
H.LIST.forEach((e) => { if ((e.practiceAlt || []).length) out[e.id] = H.practiceAll(e).map(H.practiceId); });
fs.writeFileSync(path.join(__dirname, "..", "tests", "fixtures", "practice_keys.json"), JSON.stringify(out, null, 1) + "\n");
console.log(Object.keys(out).map((id) => id + " " + out[id].length + " 題").join("\n"));
