---
name: ccsc-maintenance
description: 維護與審核 CCSC_NEW「天主教中華基督神修小會」網站，整理協作修改、更新內容並同步 GitHub 與 Sites 部署。用於此專案的維護工作，不用於其他小會或一般網站。
---

# 小會網站維護

在既有 CCSC_NEW 工作目錄完成使用者要求的修改或審核。使用 [專案對照表](references/project-map.md) 找到內容、介面、標誌及部署設定；保留現有架構與使用者提供的素材。

## 接手與審核

1. 讀取專案 `AGENTS.md`、`README.md`、`CONTENT_NOTES.md` 與 `.openai/hosting.json`。
2. 核對本機工作樹及 staged 差異、本機 HEAD、GitHub `origin/main` 與 Sites 正式部署來源提交。分清未提交、未推送及已保存但未部署的狀態；無法讀取本機時，不宣稱所有修改已同步。
3. 保留既有協作修改。若 Git 把相同檔案同時列為刪除和未追蹤，先檢查索引與分支同步副本，備份後再修復；這種狀態本身不是刪除網站檔案的授權。不要以重設工作樹消除未確認的修改。
4. 審核實際內容差異及引用資產。名稱或標誌改動須涵蓋頁首、頁尾、HTML 標題、description、favicon 和相關文章作者；照片或標誌保留實際尺寸比例與適當替代文字，並注意長名稱在手機頁首的空間。

## 內容與品牌

- 全名為「天主教中華基督神修小會」，簡稱「小會」；英文名稱為 `Chinese Christian Spirit Community`。共同成長的既有用語是「偕行」。
- 史料、引用、外站名稱及來源原文不隨品牌文字做全面取代。快照疑點維持 `CONTENT_NOTES.md` 的待審狀態，除非使用者或可信來源提供更正依據。
- `public/ccsc-mark.svg` 是依既有標誌重繪的透明向量原檔，供 `SacredMark` 與 favicon 共用；`public/ccsc-mark.png` 保留為原始參照。更新時保留既有輪廓及紅、深藍、金色，維持 SVG 的 viewBox 比例，不在圖檔內加入不透明底色。首頁的半透明霧面效果由 `.hero-art__mark` 的 CSS 處理；頁首、頁尾標誌保持去背。

## 驗證與同步

- 依變更選擇檢查；`npm run build` 包含 TypeScript 檢查及 Vite 正式建置。需要單獨檢查型別時使用 `npm run typecheck`。依賴未變且已可用時不重裝；需要重建依賴時沿用 `package-lock.json`。
- 執行 `git diff --check`，查看待提交檔案，確認 `.env`、憑證、備份、`node_modules/`、`dist/` 和預覽暫存資料未納入提交。
- 若修改本技能，執行 skill-creator 的 `quick_validate.py`，並同步使用者已安裝的本技能副本。技能的版本來源是專案內 `skills/ccsc-maintenance/`。
- 建置後用 `npm run verify:build` 檢查正式標題、description、標誌、favicon 與 HTML 資產引用。瀏覽器檢查依目前 Sites 技能與環境能力執行，清楚記錄無法完成的驗證。

## Sites 正式發布

使用已安裝的 Sites 技能和原生工具處理來源、封裝、保存版本與部署，不將過期工具參數寫成固定流程。保留 manifest 的 `project_id` 與網站當前受眾，不建立替代網站。

- 先取得現有 Site 與短期來源憑證，透過 Sites 的來源 helper 開啟並核對來源後編輯；憑證只保留在執行記憶體，經 stdin 傳入 helper。
- GitHub `origin` 與 Sites 來源是兩個同步目的地。核對兩者的來源分支，將審核後相同的完整提交 SHA 推送到兩者；如果任何一個遠端拒絕推送，保留本機提交並核對新差異，不強制覆寫遠端。
- 使用 Sites helper 的來源結果與已驗證輸出封裝；成功檢查且輸入未變的步驟不重跑。保存版本時使用 helper 回傳的完整 SHA 和 archive。
- 部署已保存的版本。只對非終態部署繼續查狀態；成功後回報正式網址、版本號、GitHub 提交、驗證結果及剩餘內容待辦。
- 檢查最終工作樹與兩個來源提交的一致性。只有部署成功才能說網站已更新；只有推送成功才能說 GitHub 已同步。
