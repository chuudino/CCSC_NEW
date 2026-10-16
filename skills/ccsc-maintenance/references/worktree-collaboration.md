# Worktree 協作流程

## 目錄

1. 任務切分與狀態盤點
2. 建立獨立工作樹
3. 合併前 rebase 與衝突處理
4. 依序整合與組合驗證
5. GitHub／Sites 同步及發布競爭
6. 接手紀錄與清理

## 1. 任務切分與狀態盤點

- 讓各任務負責者處理自己的工作樹；指定一位整合者負責整合分支、兩個來源遠端及 Sites 發布。不要讓多個任務各自推送 `main` 或部署 Site。
- 為每項任務記錄：任務 ID、負責者、分支、工作樹絕對路徑、起點 SHA、修改範圍、相依任務、驗證方式、目前 HEAD，以及開發／待 rebase／待整合／已整合／已發布狀態。整合者維護一份各工作者可讀的清單；單機可放在主工作目錄被忽略的 `.maintenance/`，但其他 Worktree 或獨立 clone 不會自動看見此檔案，須明確傳遞位置或接手紀錄。
- 執行 `git worktree list --porcelain`、`git status --short`、`git diff`、`git diff --cached` 及 `git log`。Worktree 共用 Git objects、refs 與部分設定；不同工作樹仍不能同時切換同一分支，也不要同時操作同一分支的 rebase／merge。
- 若有跨對話或任務狀態工具，查核相關開發與發布工作。沒有這些工具時，明說無法完整盤點其他對話；工作樹清單、過期鎖檔或遠端暫無變更，都不能證明沒有協作者。已知有其他發布者時先協調唯一發布者；不要自行刪除對方的鎖或 Git 操作狀態。
- 取得最新 GitHub main、Sites 來源 HEAD，以及正式部署的來源 SHA；核對差異與祖先關係。相同檔案內容不代表相同提交。兩個遠端若分歧，先在整合分支保留雙方歷史合併，再建立或更新任務基準；不得直接以其中一份覆蓋另一份。
- 按功能及檔案區段分工。`src/data/site.ts` 的同一資料集合、`src/App.tsx` 的路由、共用 CSS、`package.json`／`package-lock.json`、`AGENTS.md`、技能及 `.openai/hosting.json` 都是容易重疊的區域；指定負責者或排定修改順序。依賴有先後時先整合前置任務，不把尚未完成的成果當成穩定基準。
- 依當前工具可用席位及環境資源設定並行上限，大量任務分批執行；不要把固定代理數寫成永久規格，也不要讓所有任務同時安裝依賴或執行重型建置。開發可以並行，整合與正式發布仍依序執行。

## 2. 建立獨立工作樹

先依目前 Sites 技能用來源 helper 開啟既有 Site；沿用其 `checkout_path` 作為整合／發布工作樹。`origin` 指 GitHub；Sites 來源 URL 與分支使用原生工具當次回傳值，憑證只在記憶體中經 stdin 傳入 helper。

下列路徑、任務名與分支是範例，執行時換成本輪唯一值；工作樹放在儲存庫外的相鄰目錄，避免被封裝或提交：

```bash
git fetch origin
git worktree list --porcelain
git worktree add -b task/calendar-20261016 ../ccsc-worktrees/calendar <已核對的整合SHA>
git -C ../ccsc-worktrees/calendar status --short
```

- 每項任務從已確認的整合提交建立不同分支，使用絕對路徑執行命令，避免在錯的工作樹編輯。主工作樹有未提交成果時先保留並辨識歸屬；不要把別人的檔案一起提交或搬進任務。
- 每個工作樹有自己的 index、工作檔案與建置產物。需要執行應用檢查時在該工作樹安裝鎖定依賴；不要共用可變的 `node_modules`、`dist`、TypeScript build cache 或預覽 port。只有文件變更的任務可先做文件檢查，正式封裝仍驗證整合結果。
- 只 stage 本任務檔案、檢查 staged diff 後提交。不要全域 stash、`reset --hard`、`clean -fd`、刪 Git lock，或用強制移除 Worktree 消除未知修改。若需暫存，限本人變更並記錄，不能用自動 stash 隱藏未審核內容。

## 3. 合併前 rebase 與衝突處理

每項任務輪到整合時，由整合者先重新核對兩個遠端並更新整合分支，再提供完整的整合 HEAD。若前一任務剛整合，即使遠端 main 未變，仍須使用這個新 HEAD。

僅在任務工作樹乾淨、沒有其他進行中的 Git 操作，且待改寫提交尚未共享時執行：

```bash
git -C <任務工作樹> status --short
git -C <任務工作樹> branch backup/calendar-before-rebase-20261016 HEAD
git -C <任務工作樹> rebase <最新整合SHA>
```

記錄原始 HEAD 與唯一的備份分支名。`git fetch origin` 只更新參照，不會更新目前工作檔案；不要在任務分支盲目 `git pull` 或只 rebase 到過期的 `origin/main`。

- 有衝突時執行 `git status`、`git diff --name-only --diff-filter=U`，同時閱讀雙方的修改與任務需求，逐一整合。不要整檔套用 `--ours`／`--theirs`；rebase 時兩者的直覺方向容易誤判。
- 解決後只 stage 已處理檔案，執行 `git rebase --continue`，直到 rebase 完成。不能只刪衝突標記；還要檢查資料 ID、slug、路由、匯入、排序、共用 CSS、依賴及建置設定的組合行為。
- 對內容取捨缺乏依據時保留兩份版本與待確認紀錄，暫緩此任務整合；可對本人這次操作執行 `git rebase --abort` 回到原狀。不要刪除別人的功能、史料或提交以讓 rebase 通過。
- 已推送／共享的任務提交、main 與已發布提交不得 rebase、amend 或強制推送（含 `--force-with-lease`）。需重新整理已共享任務時，從原 HEAD 建立新的私人替代分支，再 rebase 其尚未被新分支協作者使用的任務提交，保留原分支與對應紀錄；也可在整合分支以 merge 保留雙方歷史。不能把整條已共享 main 歷史搬動。
- rebase 完成後比較備份與新範圍，必要時用 `git range-diff <舊基準>..<原HEAD> <新基準>..<新HEAD>`，確認任務內容沒有遺失或重複。對衝突解法、受影響依賴及相關功能重新驗證；舊 SHA 的通過結果不自動適用於新成果。

## 4. 依序整合與組合驗證

由唯一整合者在乾淨的整合工作樹依序執行；任務工作者在交付 HEAD 後停止修改該分支，新增工作另開任務：

```bash
git status --short
git merge --ff-only <已rebase完成的任務分支>
git diff --check
```

若 `--ff-only` 失敗，回查基準與最新任務 HEAD，不用普通 merge 掩蓋遺漏的 rebase；只有明確需要保留已共享分支或雙遠端分歧歷史時，才採保留歷史的合併，並審核 merge 結果。

整合 A 後，以新的整合 HEAD 更新 B，再整合 B；每次更新清單。不要讓 A、B 同時 rebase 到相同舊基準後就把 B 視為可直接合併。即使 Git 自動整合沒有文字衝突，也必須檢查彼此功能是否相容。

- 先做各任務適當的檢查，再對最終整合成果執行 `npm run build`、`npm run verify:build`、`git diff --check` 及受影響測試；需要單獨型別檢查時執行 `npm run typecheck`。技能變更加做 skill-creator 驗證與參考連結核對；介面變更依當前 Sites 規範檢查手機版與相關互動。
- 確認沒有 unmerged index、未完成的 rebase／merge、未審核或未提交修改；憑證、備份、快取、Worktree 目錄及建置產物不納入來源提交。
- 固定最終完整 SHA，記錄各任務原／新 SHA、整合結果與驗證對應。rebase、merge 或來源內容再變時，重新驗證受影響部分並重建封裝；不可沿用不同提交的 archive。

## 5. GitHub／Sites 同步及發布競爭

GitHub 保存程式碼，Sites 負責正式保存版本與部署；不因並行開發自動新增 GitHub Actions 或 CI。由唯一發布者完成整個序列；不得由各任務工作樹分別發布。

1. 在推送前再次取得 GitHub main、Sites 來源分支、最新保存版本及部署狀態。原已存在的非終態部署先查明，不盲目重複部署；若有其他已知發布工作，先協調順序。
2. 確認最終提交包含兩個遠端既有成果。將完整相同 SHA 以普通 fast-forward 推送同步至兩個來源；GitHub 可用普通 Git push 或原生 GitHub 工具的預期 HEAD 條件，Sites 使用當前 helper。檢查 helper 是否建立額外提交；若 SHA 改變，先核對差異、驗證並使 GitHub 指向該相同 SHA，才能保存版本。
3. 任一遠端拒絕或前進時，停止保存／部署並保留本機與已成功推送的成果。重新 fetch／用 helper 取得更新，檢查分歧。尚未共享的任務先依新基準 rebase；若發布提交已成功推到任一目的地，它就屬於共享歷史，改在新整合分支 merge 新遠端成果，不能再 rebase 該發布提交。重新驗證、建置，普通推送同一個新的完整 SHA 到兩者。
4. 兩個遠端更新不是原子交易。只有 GitHub 成功、只有 Sites 來源成功，或只有版本保存成功時，分別記錄狀態及待補步驟，不能宣稱全部同步，也不要強制回退已成功的遠端。
5. 封裝使用 Sites helper 回傳的 SHA、archive 與原開啟結果。保存前確認 GitHub／Sites 來源仍等於預定 SHA，部署前確認 saved version 的來源亦相同，且沒有其他工作建立較新版本或部署。發現前進則重新核對整合，不部署舊任務晚完成的 archive；已存在對應版本或部署時接續它，不重複建立。
6. 沿用既有 project_id 與受眾，只部署該已保存版本。部署成功後核對 GitHub HEAD、Sites 來源與已部署版本的完整 SHA，記錄正式網址及版本號。若此時又有新提交／版本，報告本次部署結果及最新差異，不能宣稱三者仍完全一致。

本地任務清單或鎖只對實際共用它的工作者有效，不能提供跨獨立環境的全域互斥。配合唯一發布者、每階段重新核對和遠端的拒絕覆寫機制；工具無法查明其他發布時，清楚報告可驗證的範圍，不聲稱已取得全域發布鎖。

## 6. 接手紀錄與清理

- 回報每項任務是否已整合／發布、最終完整 SHA、GitHub 同步狀態、Sites 版本／部署狀態、驗證結果、衝突決策及剩餘待辦；手機接續時以最新遠端與此紀錄重建狀態，不把附件視為即時來源。
- 確認工作樹乾淨、沒有其他工作者使用，且任務成果已包含於整合提交並完成要求的同步後，才可 `git worktree remove <任務工作樹>`；不要加 `--force`。保留未整合、未推送、失敗或仍需接手的工作樹、分支與備份。
- 已 rebase 的備份分支可能不是最終 HEAD 的祖先，不能只因 `branch --merged` 未列出就判定成果遺失。核對內容對應與接手需求後再清理；不為了畫面整齊而刪未確認的歷史。
