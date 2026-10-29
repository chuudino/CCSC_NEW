# 小會新版官方網站

天主教中華基督神修小會（簡稱「小會」；Chinese Christian Spirit Community）新版網站。以 React、TypeScript 與 Vite 建置；初始內容來自 2026-09-18 的公開官網快照及舊版專案資料，後續更新依內容同步紀錄查核。

## 開發

```bash
npm ci
npm run dev
```

## 驗證與建置

```bash
npm run typecheck
npm run build
npm run verify:build
```

## 內容維護

主要網站內容集中在 `src/data/site.ts`，包括活動、分會、行事曆、刊物與文章。來源資料的疑點記錄於 `CONTENT_NOTES.md`，更新前請一併核對。

## 頁面

- 首頁與組織介紹
- 活動消息與各地分會
- 2026 行事曆
- 心泉、芥子刊物
- 文化福傳與默觀月訊
- 全站搜尋與文章頁

## 專案維護與發布

維護技能的版本來源為 [skills/ccsc-maintenance/SKILL.md](skills/ccsc-maintenance/SKILL.md)，專案指引見 [AGENTS.md](AGENTS.md)。本次協作修改的審核與整理紀錄見 [docs/MAINTENANCE.md](docs/MAINTENANCE.md)。

並行開發請依 [Worktree 協作流程](skills/ccsc-maintenance/references/worktree-collaboration.md)：每項任務獨立分支與工作樹，合併前 rebase 到最新整合提交，由單一整合者依序合併及驗證，再同步 GitHub 與 Sites。GitHub 用於程式碼保存，正式部署使用 Sites，無須為此設定 GitHub Actions 或 CI。

需要按次對齊原官網內容時，使用 [ccsc-content-sync](skills/ccsc-content-sync/SKILL.md)：每次觸發重新查核官網、更新可確認內容、列出待審差異，並同步 GitHub 與 Sites 正式發布。此技能不建立排程；原始抓取資料保留在 `.maintenance/content-sync/`。

最近一次內容對齊見 [2026-10-16 同步紀錄](docs/content-sync/2026-10-16.md)。本輪更新公告、行事曆、默觀月訊、文化福傳與組織介紹；刊物暫緩。原官網摘要仍為按次維護；三類活動資料由下方線上管理介面維護。

- 程式碼保存於 [chuudino/CCSC_NEW](https://github.com/chuudino/CCSC_NEW)，正式網站由 [Sites](https://ccsc.chuudino.chatgpt.site) 託管。
- `.openai/hosting.json` 指向既有 Sites 專案，建置輸出為 `dist/server/index.js`（包含前端資產）；發布時保留專案 ID 與目前的公開權限。
- GitHub 與 Sites 有各自的來源分支。發布時須將相同提交同步到兩者，再保存並部署該提交的建置產物；只推送 GitHub 不代表網站已更新。
- `node_modules/`、`dist/`、維修備份 `.maintenance/` 與 Sites 暫存資料不納入 Git。憑證只在執行期間使用，不寫入專案或維護紀錄。
- 這份本機工作目錄使用獨立於 iCloud 的 Git 中繼資料，避免同步衝突。另一台電腦應從 GitHub 重新 clone，不要複製這份工作目錄的 `.git` 指標。

## 線上活動管理（2026-10-28）

管理入口為 `/admin`，由 Sites 的 ChatGPT 登入驗證目前網站擁有者信箱。資料以 Sites R2 跨裝置保存，不寫入瀏覽器 localStorage。流程為新增／編輯、儲存草稿、核定發佈；編輯已發佈項目時，既有公開版本保留到重新核定。可下架並保留草稿，同時編輯以版本及儲存物件 ETag 檢查衝突。

`/activities` 為將到來活動（活動日期遞增），`/records` 為已發生活動記錄（活動日期遞減），`/calendar` 為獨立年度計劃，可切換年度。年度計劃不會自動變成公告，公告過期不會自動變成活動記錄。既有 53 筆行事曆作為年度計劃初始資料；既有原官網公告保留原文章路由及搜尋入口，不以發文日期臆測活動日期。

保留 React、TypeScript、Vite 及原有 npm lockfile。正式建置依序執行 `npm run build`、`npm run verify:build`、`node scripts/build-worker.mjs`，將原前端產物嵌入 Worker，沿用原 Site 與公開受眾；新增的後端僅負責登入授權及內容儲存。`node --test tests/editor.test.mjs` 驗證草稿隔離、核定、下架、版本衝突、日期及跨來源拒絕。

### 管理者登入

開啟 https://ccsc.chuudino.chatgpt.site/admin，以網站擁有者的 ChatGPT 帳號（chuudino@gmail.com）登入；由 Sites 驗證身分，不另外建立網站密碼。非管理者無法讀取草稿或寫入。登入後選擇三類內容之一，新增或編輯、儲存草稿，再按「核定並發佈」。年度計劃初始資料保留 53 筆及固定祈禱安排；既有 45 則公告可由 `/announcements` 查閱。

維護介面的內容儲存於 Sites R2，核定後直接更新公開活動頁；這些營運資料不會自動寫入 GitHub。GitHub 與 Sites 同一提交的要求適用於完整網站程式、技能與文件。

2026-10-29 接續 `task/editor-20261028`（原始草稿 `c7b3e0bc6782ef775c80b43d41cd6788ef76b167`），保留原共享分支，透過 GitHub 原生 Git 資料工具建立正式提交並讀回相同物件，再同步 Sites。

### 總會與分會分類（2026-10-29）

三類活動頁提供「全部／總會／各分會」及既有神修默觀祈禱小組的單位篩選，切換分類保留所選單位；年度活動計劃可再搭配年度。管理頁可篩選內容並勾選所屬單位（可複選），共同活動會出現在各所屬單位，須儲存草稿並核定後才更新公開版本。

每筆草稿及公開版本各自保存 `groupIds`。既有年度計劃依原資料及穩定 ID 恢復總會／分會歸屬，固定祈禱安排也遵循篩選。舊有 R2 內容保留草稿、公開版本、修訂號與核定狀態，不以新版初始資料覆蓋；無法確認單位的舊內容標示「所屬單位待確認」，編輯儲存前須選擇單位。
