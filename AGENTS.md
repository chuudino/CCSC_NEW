# CCSC 專案指引

維護、審核、內容更新或發布本專案時，先閱讀 `skills/ccsc-maintenance/SKILL.md`。其專案資料與流程隨程式碼一起維護；使用者本次指示優先。

使用者要求將內容對齊 `https://ccsc.org.tw/` 時，使用 `skills/ccsc-content-sync/SKILL.md` 執行單次查核、更新及發布；不因一般版面維護而自動同步內容。

- 保留 React、TypeScript、Vite 與 npm lockfile 的既有架構。
- 全名使用「天主教中華基督神修小會」，簡稱「小會」；已確認的共同成長文案使用「偕行」。史料、引用與英文正式名稱不做機械式替換。
- 內容修改以 `src/data/site.ts` 為入口，並核對 `CONTENT_NOTES.md` 的待審事項。
- 發布沿用 `.openai/hosting.json` 的 Sites 專案與既有受眾，將同一提交同步到 GitHub 與 Sites 來源。遵從使用者對本次發布範圍的授權。
- 並行開發採每任務獨立分支與 Worktree，依維護技能的 `references/worktree-collaboration.md` 執行；合併前 rebase 私人任務至最新整合 HEAD，再由單一整合者依序合併、驗證及發布。不得改寫已共享歷史或強制推送。
- GitHub 用於程式碼保存，正式部署使用 Sites；除非使用者另有要求，不新增 GitHub Actions 或 CI。
