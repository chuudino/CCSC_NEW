# CCSC 新版官方網站

中華基督神修小會（Chinese Christian Spirit Community）新版網站。以 React、TypeScript 與 Vite 建置，內容來自 2026-09-18 的公開官網快照及舊版專案資料。

## 開發

```bash
npm install
npm run dev
```

## 驗證與建置

```bash
npm run typecheck
npm run build
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
