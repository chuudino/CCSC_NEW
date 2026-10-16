# 小會新版官方網站

天主教中華基督神修小會（簡稱「小會」；Chinese Christian Spirit Community）新版網站。以 React、TypeScript 與 Vite 建置，內容來自 2026-09-18 的公開官網快照及舊版專案資料。

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

- 程式碼保存於 [chuudino/CCSC_NEW](https://github.com/chuudino/CCSC_NEW)，正式網站由 [Sites](https://ccsc.chuudino.chatgpt.site) 託管。
- `.openai/hosting.json` 指向既有 Sites 專案，建置輸出為 `dist/`；發布時保留專案 ID 與目前的公開權限。
- GitHub 與 Sites 有各自的來源分支。發布時須將相同提交同步到兩者，再保存並部署該提交的建置產物；只推送 GitHub 不代表網站已更新。
- `node_modules/`、`dist/`、維修備份 `.maintenance/` 與 Sites 暫存資料不納入 Git。憑證只在執行期間使用，不寫入專案或維護紀錄。
- 這份本機工作目錄使用獨立於 iCloud 的 Git 中繼資料，避免同步衝突。另一台電腦應從 GitHub 重新 clone，不要複製這份工作目錄的 `.git` 指標。
