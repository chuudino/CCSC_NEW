# 來源與欄位對照

以下連結是在 2026-10-16 實際從官網觀察到的入口。每輪以當次首頁發現的連結為準；連結變更時檢查新入口，不直接判定該分類已移除。

| 資訊 | 當時官網入口 | 新版位置與注意事項 |
| --- | --- | --- |
| 最新消息 | `/?post_type=notice` | `notices`；默觀月訊另歸入 `articles`，避免把所有 notice 都當成活動 |
| 分會 | `/?group=總會`、台北分會、台中分會、高雄分會、北美分會 | `groups`、`notices`、`events`；分會頁是文章列表，不一定有固定地址 |
| 行事曆 | `/?page_id=65000` | `events`；表格的分會、年度標題、合併儲存格是判讀依據 |
| 心泉、芥子 | `/?periodical_type=fountain`、`/?periodical_type=seed` | `publications`；每筆以期刊詳細頁核對期號與日期 |
| 默觀月訊 | `/?group=默觀月訊` | `articles` 的「默觀月訊」；`PrayerPage` 取第一筆，更新排序時一併確認本月選讀 |
| 文化福傳 | `/?post_type=culture_entry` | `articles` 的「文化福傳」；`CulturePage` 的精選標題與路由另有固定文字 |
| 小會是什麼、宗旨精神、歷史沿革、大事年表 | `/?page_id=50001` 至 `50004` | `src/App.tsx` 的組織介紹、`timeline`、`principles`；摘要與史料分開處理 |
| 聯絡資訊 | 首頁及相關聯絡段落 | `src/App.tsx` 的頁首、頁尾電話、email、地址，並非都在 `site.ts` |

WordPress 原生 `types` API 沒有列出所有活動與刊物自訂型別；首頁公開的 API 根入口曾是 `index.php?rest_route=/`。本技能不依賴這些 API 來判定官網內容是否存在。

## 日期與資料品質

- `.published`／`.posted-on` 是發文日期，標題或正文中的活動日期另判讀。例如「2026年9月」的回顧文章可能在 10 月發布。
- 民國 115 年是 2026 年，但表格的 `1/18` 不能一律補成本次執行年份。先讀該分會的年度標題，再保留跨日範圍；週期性活動不任意製造單一新日期。
- 行政帳號 `ccsc` 是上稿資訊，作品作者可能在正文另列。
- 原有 `II5` 標題、芥子期號及日期矛盾仍以 `CONTENT_NOTES.md` 管理。只有詳細來源足以解決矛盾時才移除疑點。
- 官網圖片或影片型文章的少量說明文字，不代表已取得完整活動紀錄。附件未閱讀時明確標示。
- 新版已確認的全名、簡稱與「偕行」文案保留；來源引文、歷史標題與人名不做機械替換。
- `HomePage` 的近期活動使用 `events.slice(0, 3)`，活動頁側欄使用 `events[0]`；單純加入新資料不保證近期區塊正確，須檢查其日期範圍與排序。`CalendarPage` 的年份原為固定字串，跨年時核對來源年度；不要任意改成執行年份。

## 穩定對應與成功基準

第一次對齊時，根據明確相同的標題、主題、分會及日期建立對應；相近標題不足以自動合併。穩定來源鍵優先使用腳本擷取的 `notice:70786` 等 WordPress 類型與 ID，否則使用官方 canonical URL。

首次實際採用來源時建立 `content/official-source-map.json`，使用如下結構。這是格式示例，不是已確認的現有對應：

```json
{
  "source_root": "https://ccsc.org.tw/",
  "records": {
    "notices/<現有 slug>": {
      "source_key": "notice:<實際文章 ID>",
      "source_url": "<實際觀察到的官網詳細頁網址>",
      "source_fingerprint": "<本輪已採用內容的 fingerprint>",
      "last_applied_at": "<有實際採用變更時的 ISO 時間>",
      "fields": ["title", "date", "excerpt", "content"]
    }
  }
}
```

腳本的 `source.json` 包含 `pages`、`records`、`source_changes`、`failures`、`missing_sections` 及 `scope.unread_pagination`。`fetch_complete` 只代表本輪宣告的頁面範圍讀取完整，不代表程式碼已更新，也不代表全部歷史分頁均已讀取。

成功發布基準 `last-published.json` 是 `records` 字典及必要來源／覆蓋資訊；只合併已在專案採用且成功發布的紀錄。已保留待審或未修改的來源，不用最新抓取值覆蓋其成功基準，否則下一輪會錯誤忽略尚未處理的變動。

只有「上輪見到、本輪沒見到」時，腳本列在 `not_observed_this_run`，不當成刪除指令。擷取時間、網站導覽或頁尾改動不應讓正文產生假異動。

## 執行與報告

腳本只用 Python 標準函式庫，預設從當前專案讀取來源對應與上次成功基準。`--recent-per-section` 預設 10，`--max-pages` 預設 160；達到頁數上限會標示不完整，不能宣稱完整對齊。

需要追讀某個已觀察到的分頁、重讀失敗頁或做局部查核時：

```text
python -X utf8 <skill-directory>/scripts/collect_source.py --url <官網頁面> --output .maintenance/content-sync/runs/<時間>/additional.json
```

局部結果與完整結果合併判讀，不用局部擷取結果取代整份成功基準。原始擷取資料留在 `.maintenance/`；提交的報告只保存採用的資訊摘要、來源網址、對齊欄位、未覆蓋範圍與待審原因。
