# 專案對照表

| 用途 | 位置 |
| --- | --- |
| 組織、活動、分會、行事曆、刊物與文章資料 | `src/data/site.ts` |
| 頁面、路由、導覽、搜尋及識別標誌元件 | `src/App.tsx` |
| 色彩、字型、標誌與響應式版面 | `src/styles.css` |
| React 入口與 BrowserRouter | `src/main.tsx` |
| 全站標題、description 及 favicon | `index.html` |
| 既有識別圖片（133 × 124 PNG） | `public/ccsc-mark.png` |
| npm scripts 與鎖定依賴 | `package.json`、`package-lock.json` |
| 正式建置產物核對 | `scripts/verify-build.mjs`、`npm run verify:build` |
| Sites 身分與靜態輸出設定 | `.openai/hosting.json` |
| 原始內容疑點 | `CONTENT_NOTES.md` |
| 審核及本機整理紀錄 | `docs/MAINTENANCE.md` |

程式碼儲存庫為 `https://github.com/chuudino/CCSC_NEW`，一般發布分支為 `main`。正式網址為 `https://ccsc.chuudino.chatgpt.site`；以 Sites 成功部署回傳的網址為本次發布依據。

目前是 React 19、TypeScript、Vite 7 的靜態 SPA，Sites 的 `static.directory` 是 `dist`。資料來源是 2026-09-18 官網快照，不是即時 CMS；不要把尚待審核的期刊日期與期號當成已確認的新公告。

路由包括 `/`、`/about`、`/activities`、`/groups/:slug`、`/calendar`、`/publications`、`/culture`、`/prayer`、`/search` 和 `/article/:slug`。刊物「本期目錄整理中」及部分歷史資料仍為現有待辦，不因一次品牌維護而自動新增下載、資料匯入或後端功能。

本機可能位於 iCloud 目錄；先用 `git rev-parse --absolute-git-dir` 找到實際 Git 資料位置。同步衝突曾造成 `index 2` 與 `refs/heads/main 2` 副本，不要在未檢查內容前把衝突副本當成新版本或刪除任何歷史。

## 此 Windows 環境的發布備註

優先使用目前 Sites 技能的 helper。只有出現以下相同錯誤時，才使用已驗證的局部替代方式：

- Sites build helper 的 npm shim 若找不到 `npm-prefix.js` 或 `npm-cli.js`，可在 helper 的 ordered commands 中依序執行 `node node_modules/typescript/bin/tsc -b`、`node node_modules/vite/bin/vite.js build` 和 `node scripts/verify-build.mjs`；這与既有 build script 的型別檢查和建置相同，不改網站依賴。
- 使用已安裝的 Git Bash 封裝時，GNU tar 可能把 Windows 磁碟代號當成遠端主機。只在該次 helper 進程設定 `TAR_OPTIONS=--force-local`，並使用 `C:/...` 格式的絕對 archive 路徑；不要全域修改 shell 設定。
- 若跨命令後忽略的 `dist/` 產物遺失，在同一個 Sites helper 進程內建置、執行 `verify-build` 與封裝。先前的型別檢查在原始碼未變時可重用，但封裝需要可讀取的實際產物。
