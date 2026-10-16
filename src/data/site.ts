export type SourceLink = { label: string; url: string }

export type Group = {
  slug: string
  name: string
  shortName: string
  location: string
  description: string
  rhythm: string
  accent: string
  sourceUrl?: string
}

export type Event = {
  host?: string
  relatedGroups?: string[]
  sourceUrl?: string
  sourceDateLabel?: string
  note?: string
  id: string
  date: string
  endDate?: string
  title: string
  group: string
  location: string
  speaker?: string
  description?: string
}

export type Notice = {
  sourceKey?: string
  sourceUrl?: string
  sourceKind?: 'text' | 'image' | 'video' | 'mixed'
  links?: SourceLink[]
  groupSlug?: string
  slug: string
  date: string
  title: string
  group: string
  excerpt: string
  content: string[]
}

export type Publication = {
  slug: string
  series: '心泉' | '芥子'
  issue: string
  date: string
  description: string
  accent: string
}

export type Article = {
  sourceKey?: string
  sourceUrl?: string
  sourceKind?: 'text' | 'image' | 'video' | 'mixed'
  links?: SourceLink[]
  slug: string
  category: '文化福傳' | '默觀月訊' | '靈修札記'
  title: string
  author: string
  date: string
  excerpt: string
  content: string[]
}

export type RecurringEvent = { id: string; title: string; group: string; schedule: string; hosts: string[]; sourceUrl: string }

export const groups: Group[] = [
  {
    "slug": "headquarters",
    "name": "總會",
    "shortName": "總會",
    "location": "台北・長安天主堂",
    "description": "連結各分會、推動陶成與共融，陪伴會員在生活中實踐小會使命。",
    "rhythm": "全國共融、陶成與年度會慶",
    "accent": "gold",
    "sourceUrl": "https://ccsc.org.tw/?group=%E7%B8%BD%E6%9C%83"
  },
  {
    "slug": "taipei",
    "name": "台北分會",
    "shortName": "台北",
    "location": "台北",
    "description": "透過月會、避靜、文化活動與社區關懷，在城市生活中偕行。",
    "rhythm": "月會、避靜、藝文與關懷服務",
    "accent": "teal",
    "sourceUrl": "https://ccsc.org.tw/?group=%E5%8F%B0%E5%8C%97%E5%88%86%E6%9C%83"
  },
  {
    "slug": "taichung",
    "name": "台中分會",
    "shortName": "台中",
    "location": "台中・雙十堂",
    "description": "以靈修、福傳、共融、傳承為年度主題，透過月會、分享與服務，在生活中彼此扶持。",
    "rhythm": "每月聚會、避靜與共融營",
    "accent": "indigo",
    "sourceUrl": "https://ccsc.org.tw/?group=%E5%8F%B0%E4%B8%AD%E5%88%86%E6%9C%83"
  },
  {
    "slug": "kaohsiung",
    "name": "高雄分會",
    "shortName": "高雄",
    "location": "高雄",
    "description": "在南台灣延續小會大家庭的精神，舉辦月會、會慶與生命分享。",
    "rhythm": "月會、會慶與分會共融",
    "accent": "terracotta",
    "sourceUrl": "https://ccsc.org.tw/?group=%E9%AB%98%E9%9B%84%E5%88%86%E6%9C%83"
  },
  {
    "slug": "north-america",
    "name": "北美分會",
    "shortName": "北美",
    "location": "北美・線上共融",
    "description": "跨越地域，以線上祈禱、月會與芥子刊物維繫華人信仰團體。",
    "rhythm": "週間線上祈禱與跨區月會",
    "accent": "blue",
    "sourceUrl": "https://ccsc.org.tw/?group=%E5%8C%97%E7%BE%8E%E5%88%86%E6%9C%83"
  },
  {
    "slug": "contemplation",
    "name": "神修默觀祈禱小組",
    "shortName": "默觀",
    "location": "線上與各地小組",
    "description": "以每日讀經、歸心祈禱與耶穌禱文，學習相逢於寧靜中。",
    "rhythm": "平日默觀祈禱與每月月訊",
    "accent": "plum",
    "sourceUrl": "https://ccsc.org.tw/?group=%E9%BB%98%E8%A7%80%E6%9C%88%E8%A8%8A"
  }
]

export const events: Event[] = [
  {
    "id": "north-america-0101",
    "date": "2026-01-01",
    "title": "聊天室：元旦暫停",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "1/1 (四)",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0108",
    "date": "2026-01-08",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "1/8 (四)",
    "host": "趙世熙",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0115",
    "date": "2026-01-15",
    "title": "公念玫瑰經",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "1/15 (四)",
    "host": "王利華",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "taichung-0118",
    "date": "2026-01-18",
    "title": "譚璧輝老師分享-你認為自己是瑪利亞還是瑪爾大",
    "group": "taichung",
    "location": "雙十堂",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.1.18(日)",
    "host": "蔡熙"
  },
  {
    "id": "taipei-0118",
    "date": "2026-01-18",
    "title": "中風與心絞痛的最早期訊號及調理手法",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "1/18(日)",
    "speaker": "吳德揚老師",
    "description": "負責組：溫安組"
  },
  {
    "id": "north-america-0122",
    "date": "2026-01-22",
    "title": "神修溯源（十七）：神修生活",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "1/22 (四)",
    "host": "韓甲蕙/梁修文",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0205",
    "date": "2026-02-05",
    "title": "聊天室：在幸福中老去",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "2/5 (四)",
    "host": "江行武",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "taichung-0208",
    "date": "2026-02-08",
    "title": "劉瓊惠-分享COMINO之旅",
    "group": "taichung",
    "location": "雙十堂",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.2.8(日)",
    "host": "黃瑞華"
  },
  {
    "id": "taipei-0222",
    "date": "2026-02-22",
    "title": "會員手冊修訂討論暨春節團拜",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "2/22 (日)",
    "speaker": "張惠敏主持",
    "description": "負責組：大安組"
  },
  {
    "id": "north-america-0226",
    "date": "2026-02-26",
    "title": "神修溯源（十八）：會章上篇總複習：答覆召叫",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "2/26(四)",
    "host": "葛寧意/馮克芳",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0305",
    "date": "2026-03-05",
    "title": "聊天室：四旬期避靜講座",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "3/5 (四)",
    "host": "滕林神父",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0312",
    "date": "2026-03-12",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "3/12 (四)",
    "host": "趙世熙",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0319",
    "date": "2026-03-19",
    "title": "公念玫瑰經",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "3/19 (四)",
    "host": "王利華",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "taichung-0320",
    "date": "2026-03-20",
    "title": "避靜(神師:吳伯仁神父)",
    "group": "taichung",
    "location": "靜山",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.3.20-3.22(日)",
    "endDate": "2026-03-22",
    "host": "陳瑞蘭"
  },
  {
    "id": "taipei-0320",
    "date": "2026-03-20",
    "title": "四旬期避靜；福音應許與壯世代基督徒生活",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "3/20-22 (五-日)",
    "endDate": "2026-03-22",
    "speaker": "胡淑琴修女",
    "description": "負責組：文化組"
  },
  {
    "id": "north-america-0327",
    "date": "2026-03-27",
    "title": "小會手冊修訂討論",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "3/27(四)",
    "host": "工作室",
    "description": "北美分會活動，時間與參與方式請洽分會。",
    "note": "原表日期標示「3/27(四)」，與 2026 年星期不一致，請向分會確認。"
  },
  {
    "id": "north-america-0402",
    "date": "2026-04-02",
    "title": "聊天室：「小會的初心」研討會",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "4/2(四)",
    "host": "許建德",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0409",
    "date": "2026-04-09",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "4/9 (四)",
    "host": "趙世熙/葛寧意",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "taipei-0418",
    "date": "2026-04-18",
    "title": "南港藝文生態Go！",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "4/18 (六)",
    "speaker": "趙方麟博士帶領",
    "description": "負責組：木柵組"
  },
  {
    "id": "taichung-0419",
    "date": "2026-04-19",
    "title": "討論小會的會章",
    "group": "taichung",
    "location": "雙十堂",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.4.19 (日)",
    "host": "全體會員"
  },
  {
    "id": "north-america-0423",
    "date": "2026-04-23",
    "title": "小會手冊修訂討論",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "4/23 (四)",
    "host": "工作室",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0507",
    "date": "2026-05-07",
    "title": "聊天室：「會員手冊修訂案」分會討論及問卷收回",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "5/7 (四)",
    "host": "工作室",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0514",
    "date": "2026-05-14",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "5/14 (四)",
    "host": "趙世熙/葛寧意",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0521",
    "date": "2026-05-21",
    "title": "公念玫瑰經",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "5/21 (四)",
    "host": "王利華",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "taichung-0530",
    "date": "2026-05-30",
    "title": "慶祝會慶—與高雄分會合辦（救世主堂）",
    "group": "taichung",
    "location": "高雄",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.5.30(六)",
    "host": "張育英"
  },
  {
    "id": "taipei-0531",
    "date": "2026-05-31",
    "title": "天主聖三節會慶；主題:從羅爾新書談天主聖三靈修觀的典範轉移",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "5/31 (日)",
    "speaker": "胡國楨神父",
    "description": "負責組：溫安組"
  },
  {
    "id": "north-america-0604",
    "date": "2026-06-04",
    "title": "聊天室：「悅主畫展」",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "6/4(四)",
    "host": "周文漣",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-0611",
    "date": "2026-06-11",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "6/11(四)",
    "host": "趙世熙/葛寧意",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "taichung-0621",
    "date": "2026-06-21",
    "title": "楊敦和大哥演講-遺產信託",
    "group": "taichung",
    "location": "雙十堂",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.6.21 (日)",
    "host": "劉素梅"
  },
  {
    "id": "taipei-0621",
    "date": "2026-06-21",
    "title": "你(妳)認為自己是瑪利亞或是瑪爾大?",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "6/21 (日)",
    "speaker": "譚璧輝老師",
    "description": "負責組：大安組"
  },
  {
    "id": "taichung-0719",
    "date": "2026-07-19",
    "title": "郭良玉分享-現代父母甘苦談",
    "group": "taichung",
    "location": "雙十堂",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.7.19 (日)",
    "host": "劉瓊惠"
  },
  {
    "id": "north-america-0723",
    "date": "2026-07-23",
    "title": "公念玫瑰經",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "7/23 (四)",
    "host": "王利華",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "taipei-0726",
    "date": "2026-07-26",
    "title": "與青年同步、主同行",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "7/26 (日)",
    "speaker": "Magis楊澤隆",
    "description": "負責組：溫安組、木柵組"
  },
  {
    "id": "taipei-0815",
    "date": "2026-08-15",
    "title": "彩繪人生，活出愛 ！",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "8/15(六)",
    "speaker": "張世杰神父",
    "description": "負責組：大安組"
  },
  {
    "id": "taichung-0823",
    "date": "2026-08-23",
    "title": "游照美分享—走讀新社",
    "group": "taichung",
    "location": "新社",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.8.23(日)",
    "host": "何富寶"
  },
  {
    "id": "north-america-0828",
    "date": "2026-08-28",
    "title": "2026北美共融營: 西雅圖 Archbishop Brunett Retreat Center",
    "group": "north-america",
    "location": "西雅圖 Archbishop Brunett Retreat Center",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "8/28-31",
    "endDate": "2026-08-31",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "tc-0920",
    "date": "2026-09-20",
    "title": "讀書分享：生活中的神聖",
    "group": "taichung",
    "location": "雙十堂",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.9.20( 日)",
    "host": "傅美華"
  },
  {
    "id": "tp-0920",
    "date": "2026-09-20",
    "title": "雷公(16)及賴神父(4)周年追思",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "9/20 (日)",
    "speaker": "總會戎巧復",
    "description": "負責組：總 會"
  },
  {
    "id": "north-america-0924",
    "date": "2026-09-24",
    "title": "公念玫瑰經",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "9/24 (四)",
    "host": "王利華",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-1001",
    "date": "2026-10-01",
    "title": "聊天室：2026北美共融營活動分享",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "10/1 (四)",
    "host": "葛寧意",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-1008",
    "date": "2026-10-08",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "10/8(四)",
    "host": "趙世熙",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "camp-1023",
    "date": "2026-10-23",
    "title": "小會共融營",
    "group": "headquarters",
    "location": "彰化靜山",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "10/ 23-25(五-日)",
    "endDate": "2026-10-25",
    "description": "台北與台中分會年度行事曆均列出 10 月 23 至 25 日共融營。",
    "relatedGroups": [
      "taipei",
      "taichung"
    ]
  },
  {
    "id": "north-america-1105",
    "date": "2026-11-05",
    "title": "聊天室：福傳腳步 留在時空的足跡",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "11/5 (四)",
    "host": "張帆人、戴台馨",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-1112",
    "date": "2026-11-12",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "11/12(四)",
    "host": "趙世熙",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "tc-1115",
    "date": "2026-11-15",
    "title": "張瑞雲姐—靈修分享",
    "group": "taichung",
    "location": "雙十堂",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.11.15(日)",
    "host": "雷成明"
  },
  {
    "id": "tp-1115",
    "date": "2026-11-15",
    "title": "依納爵神操",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "11/15 (日)",
    "speaker": "尹美琪修女",
    "description": "負責組：文化組"
  },
  {
    "id": "north-america-1119",
    "date": "2026-11-19",
    "title": "公念玫瑰經",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "11/19 (四)",
    "host": "王利華",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-1204",
    "date": "2026-12-04",
    "title": "降臨期講座",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "12/4(五)",
    "host": "申同陽神父",
    "description": "北美分會活動，時間與參與方式請洽分會。"
  },
  {
    "id": "north-america-1210",
    "date": "2026-12-10",
    "title": "工作室會議",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "12/10(五)",
    "host": "趙世熙",
    "description": "北美分會活動，時間與參與方式請洽分會。",
    "note": "原表日期標示「12/10(五)」，與 2026 年星期不一致，請向分會確認。"
  },
  {
    "id": "north-america-1217",
    "date": "2026-12-17",
    "title": "教會歷史",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "12/17(五)",
    "host": "韓清平神父",
    "description": "北美分會活動，時間與參與方式請洽分會。",
    "note": "原表日期標示「12/17(五)」，與 2026 年星期不一致，請向分會確認。"
  },
  {
    "id": "tc-1220",
    "date": "2026-12-20",
    "title": "聖誕聚會",
    "group": "taichung",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "115.12.20 (日)",
    "host": "巫郁玫"
  },
  {
    "id": "tp-1220",
    "date": "2026-12-20",
    "title": "慶祝聖誕",
    "group": "taipei",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "12/20 (日)",
    "description": "負責組：文化組"
  },
  {
    "id": "north-america-1231",
    "date": "2026-12-31",
    "title": "教會歷史",
    "group": "north-america",
    "location": "地點請洽分會",
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000",
    "sourceDateLabel": "12/31(五)",
    "host": "韓清平神父",
    "description": "北美分會活動，時間與參與方式請洽分會。",
    "note": "原表日期標示「12/31(五)」，與 2026 年星期不一致，請向分會確認。"
  }
]

export const recurringEvents: RecurringEvent[] = [
  {
    "id": "na-weekday",
    "title": "默觀祈禱",
    "group": "north-america",
    "schedule": "週一至週五每天下午4：00（美東時間）",
    "hosts": [
      "週一：侯振中",
      "週二：徐琪",
      "週三：葛寧意",
      "週四：馮克芳",
      "週五：孫愛珠"
    ],
    "sourceUrl": "https://ccsc.org.tw/?page_id=65000"
  }
]

export const notices: Notice[] = [
  {
    "slug": "official-notice-70786",
    "date": "2026-10-12",
    "title": "2026年9月雷公暨賴神父追思",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "台北分會公開雷煥章神父與賴甘霖神父追思活動的照片與分享紀錄。",
    "content": [
      "原官網刊登雷煥章神父與賴甘霖神父逝世追思活動紀錄，並附分享人及活動照片。",
      "原頁文字說明較少，完整影像與活動細節請由下方原文入口閱讀。"
    ],
    "sourceKey": "notice:70786",
    "sourceUrl": "https://ccsc.org.tw/?p=70786",
    "sourceKind": "mixed"
  },
  {
    "slug": "wyd-2027-sponsorship",
    "date": "2026-10-01",
    "title": "2027 世界青年日青年贊助甄選公告",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "青年贊助 3 至 5 名，每名新台幣 25,000 元；申請至 2026 年 10 月 18 日 23:59 截止。",
    "content": [
      "小會邀請青年參與 2027 年韓國首爾世界青年日，提供 3 至 5 個贊助名額，每名新台幣 25,000 元。一般青年申請者須為 35 歲（含）以下；隨團參與教會志工服務者不限年齡。",
      "申請截止時間為 2026 年 10 月 18 日 23:59。線上甄選面談安排於 10 月 19 日或 20 日 19:30–21:00，請在申請表勾選所有方便時段。",
      "請備妥基本資料與聯繫方式、個人簡歷、500 至 1000 字自傳、全身生活照與報名資料，以及約 300 字的參與構想與期待。",
      "受贊助者須全程參與相關活動，並在返國後兩個月內向小會進行一次口頭信仰心得分享。紙本或電子郵件送件請註明「申請 2027 世界青年日青年贊助」；寄出後 24 小時未收到確認信，請聯絡 ccscasso@gmail.com。"
    ],
    "sourceKey": "notice:70769",
    "sourceUrl": "https://ccsc.org.tw/?p=70769",
    "sourceKind": "mixed",
    "links": [
      {
        "label": "立即填寫線上申請表",
        "url": "https://docs.google.com/forms/d/e/1FAIpQLSc1tEw_HWVxM5zOxE3ytIk7s6z801LXZ8aDF8zPG8dAe0_Xhg/viewform"
      },
      {
        "label": "下載完整甄選公告 PDF",
        "url": "https://ccsc.org.tw/wp-content/uploads/2026/10/2027世青會青年贊助甄選公告.pdf"
      }
    ]
  },
  {
    "slug": "official-notice-70698",
    "date": "2026-09-21",
    "title": "2026/8/8-台南朝聖與會員生活信仰分享",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/8/8-台南朝聖與會員生活信仰分享」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70698",
    "sourceUrl": "https://ccsc.org.tw/?p=70698",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70697",
    "date": "2026-09-21",
    "title": "2026/7/18-邀請總會主席陳惠姿[照護者自我管理]演講",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/7/18-邀請總會主席陳惠姿[照護者自我管理]演講」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70697",
    "sourceUrl": "https://ccsc.org.tw/?p=70697",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70696",
    "date": "2026-09-21",
    "title": "2026/6/20-會員張燕惠與林紫綢分享使徒工作",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/6/20-會員張燕惠與林紫綢分享使徒工作」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70696",
    "sourceUrl": "https://ccsc.org.tw/?p=70696",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70682",
    "date": "2026-09-21",
    "title": "2026/5/30-高雄與台中分會共慶會慶-天主聖三節",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/5/30-高雄與台中分會共慶會慶-天主聖三節」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70682",
    "sourceUrl": "https://ccsc.org.tw/?p=70682",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70580",
    "date": "2026-09-21",
    "title": "2026/5/2-邀請總輔導張瑞雲分享-小會的軟實力",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/5/2-邀請總輔導張瑞雲分享-小會的軟實力」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70580",
    "sourceUrl": "https://ccsc.org.tw/?p=70580",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70623",
    "date": "2026-09-20",
    "title": "2026年台中分會0912彰化天主堂百年大慶",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會0912彰化天主堂百年大慶」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70623",
    "sourceUrl": "https://ccsc.org.tw/?p=70623",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70617",
    "date": "2026-09-20",
    "title": "2026年台中分會08月會活動-游照美-新社走讀",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會08月會活動-游照美-新社走讀」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70617",
    "sourceUrl": "https://ccsc.org.tw/?p=70617",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70613",
    "date": "2026-09-20",
    "title": "2026北美分會共融營／旅遊",
    "group": "北美分會",
    "groupSlug": "north-america",
    "excerpt": "北美分會共融營以「愛在生命中滋長」為營標，地點為西雅圖 Archbishop Brunett Retreat Center。",
    "content": [
      "北美分會共融營以「愛在生命中滋長」為營標，地點為西雅圖 Archbishop Brunett Retreat Center。",
      "原頁附活動影像；行事曆列出營期為 2026 年 8 月 28 日至 31 日，屬活動回顧。"
    ],
    "sourceKey": "notice:70613",
    "sourceUrl": "https://ccsc.org.tw/?p=70613",
    "sourceKind": "mixed"
  },
  {
    "slug": "life-in-color-2026",
    "date": "2026-09-18",
    "title": "2026年8月彩繪人生~活出愛-張世杰神父",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "台北分會八月彩繪人生活動，由張世杰神父分享；原頁附活動照片。",
    "content": [
      "原官網現行標題已改為「2026年8月彩繪人生~活出愛-張世杰神父」。",
      "原頁記錄致贈北美郭瑞蘭的聖若瑟畫作，以及彌撒與交流照片；更多細節請閱讀原文。"
    ],
    "sourceKey": "notice:70515",
    "sourceUrl": "https://ccsc.org.tw/?p=70515",
    "sourceKind": "mixed"
  },
  {
    "slug": "silver-fitness",
    "date": "2026-09-17",
    "title": "歡迎報名參加外丹功 伸展運動 同樂繪….",
    "group": "服務與生活",
    "groupSlug": "headquarters",
    "excerpt": "2026 年 10 至 12 月關懷據點課程，包含氣功、肌力律動、彩繪及伸展運動。",
    "content": [
      "長安天主堂二樓據點：台北市林森北路 73 號 2 樓。課程期間為 2026 年 10 月 1 日至 12 月 28 日；週一 10:00–12:00 養身氣功、週三 10:00–12:00 強健肌力與舞動人生、週五 14:00–16:00 同樂繪與紓壓彩繪創作。國定假日停課。",
      "瑪利亞方濟各修女院據點：台北市信義路三段 147 巷 15 弄 23 號。課程期間為 2026 年 10 月 1 日至 12 月 31 日；週一 10:00–12:00 伸展運動與初階按摩、週二 14:00–16:00 銀髮動健康。",
      "週四外丹功與經絡按摩的原文時間標為「下午10:00–12:00」，時段有疑點，請報名前向辦公室確認。洽詢電話：(02) 2523-0538；電子郵件：ccscasso@gmail.com。"
    ],
    "sourceKey": "notice:70511",
    "sourceUrl": "https://ccsc.org.tw/?p=70511",
    "sourceKind": "mixed"
  },
  {
    "slug": "youth-evangelization-2026",
    "date": "2026-09-10",
    "title": "2026年7月青年福傳講座-楊澤龍弟兄",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "台北分會七月青年福傳講座，由楊澤龍弟兄分享；原頁附活動影像。",
    "content": [
      "原官網現行公告標題為「2026年7月青年福傳講座-楊澤龍弟兄」。",
      "標題與年度行事曆的講者姓名寫法不同，分別保留來源記載；完整活動紀錄請見原文。"
    ],
    "sourceKey": "notice:70454",
    "sourceUrl": "https://ccsc.org.tw/?p=70454",
    "sourceKind": "mixed"
  },
  {
    "slug": "official-notice-70448",
    "date": "2026-09-07",
    "title": "2026年6月靈修講座-譚璧輝老師",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台北分會刊登「2026年6月靈修講座-譚璧輝老師」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70448",
    "sourceUrl": "https://ccsc.org.tw/?p=70448",
    "sourceKind": "image"
  },
  {
    "slug": "trinity-feast-2026",
    "date": "2026-08-30",
    "title": "2026年5月天主聖三節會慶-胡國楨神父",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "台北分會天主聖三節會慶，由胡國楨神父分享，原頁提供影音紀錄。",
    "content": [
      "原官網以「2026年5月天主聖三節會慶-胡國楨神父」刊登活動紀錄。",
      "原頁含影片連結，這裡保留活動資訊與原文入口，未將影片內容改寫為文字。"
    ],
    "sourceKey": "notice:70443",
    "sourceUrl": "https://ccsc.org.tw/?p=70443",
    "sourceKind": "video"
  },
  {
    "slug": "nangang-art-eco",
    "date": "2026-08-29",
    "title": "2026年4月南港藝文生態Go!-趙方麟博士",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "台北分會南港藝文生態活動，由趙方麟博士帶領，原頁記錄文物館與公共藝術參訪。",
    "content": [
      "原官網刊登「2026年4月南港藝文生態Go!-趙方麟博士」活動紀錄。",
      "圖說提到中研院文物館、南港中國信託文薈館及南港展覽一館的公共藝術《天人境界》，完整照片請見原文。"
    ],
    "sourceKey": "notice:70436",
    "sourceUrl": "https://ccsc.org.tw/?p=70436",
    "sourceKind": "mixed"
  },
  {
    "slug": "official-notice-70429",
    "date": "2026-08-07",
    "title": "2026年3月避靜胡淑琴修女帶領",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台北分會刊登「2026年3月避靜胡淑琴修女帶領」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70429",
    "sourceUrl": "https://ccsc.org.tw/?p=70429",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70428",
    "date": "2026-08-06",
    "title": "2026年台中分會07月月會活動-郭良玉-現代父母甘苦談",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會07月月會活動-郭良玉-現代父母甘苦談」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70428",
    "sourceUrl": "https://ccsc.org.tw/?p=70428",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70420",
    "date": "2026-08-06",
    "title": "2026年台中分會06月月會活動-楊敦和校長-遺囑及遺產信託",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會06月月會活動-楊敦和校長-遺囑及遺產信託」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70420",
    "sourceUrl": "https://ccsc.org.tw/?p=70420",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70416",
    "date": "2026-08-06",
    "title": "2026年台中分會05月月會活動-與高雄分會共同慶祝會慶",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會05月月會活動-與高雄分會共同慶祝會慶」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70416",
    "sourceUrl": "https://ccsc.org.tw/?p=70416",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70413",
    "date": "2026-08-06",
    "title": "2026年台中分會04月月會活動- 討論小會會章",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會04月月會活動- 討論小會會章」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70413",
    "sourceUrl": "https://ccsc.org.tw/?p=70413",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-70409",
    "date": "2026-08-05",
    "title": "2026年台中分會03月月會活動-靜山年度避靜",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會03月月會活動-靜山年度避靜」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:70409",
    "sourceUrl": "https://ccsc.org.tw/?p=70409",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10250",
    "date": "2026-04-28",
    "title": "2026/3/28-高雄新書導讀會(萬事萬物堪落淚)",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/3/28-高雄新書導讀會(萬事萬物堪落淚)」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10250",
    "sourceUrl": "https://ccsc.org.tw/?p=10250",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10249",
    "date": "2026-04-27",
    "title": "2026/3/21~3/22-四旬期避靜(邀請台北分會簡銓堯帶領)",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/3/21~3/22-四旬期避靜(邀請台北分會簡銓堯帶領)」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10249",
    "sourceUrl": "https://ccsc.org.tw/?p=10249",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10248",
    "date": "2026-04-27",
    "title": "2026/2/7-會員手冊修改活動",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/2/7-會員手冊修改活動」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10248",
    "sourceUrl": "https://ccsc.org.tw/?p=10248",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10246",
    "date": "2026-04-23",
    "title": "2026年(上)高雄分會報告",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026年(上)高雄分會報告」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10246",
    "sourceUrl": "https://ccsc.org.tw/?p=10246",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10244",
    "date": "2026-04-23",
    "title": "2026/1/10 徐立玲中醫師「健康保健」講座",
    "group": "高雄分會",
    "groupSlug": "kaohsiung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "高雄分會刊登「2026/1/10 徐立玲中醫師「健康保健」講座」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10244",
    "sourceUrl": "https://ccsc.org.tw/?p=10244",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10242",
    "date": "2026-02-28",
    "title": "2026年2月份會員手冊修訂暨春節團拜",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台北分會刊登「2026年2月份會員手冊修訂暨春節團拜」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10242",
    "sourceUrl": "https://ccsc.org.tw/?p=10242",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10241",
    "date": "2026-02-27",
    "title": "2026年2月份頤福園拜年",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台北分會刊登「2026年2月份頤福園拜年」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10241",
    "sourceUrl": "https://ccsc.org.tw/?p=10241",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10240",
    "date": "2026-02-27",
    "title": "2026年1月份月會吳德揚老師健康講座",
    "group": "台北分會",
    "groupSlug": "taipei",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台北分會刊登「2026年1月份月會吳德揚老師健康講座」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10240",
    "sourceUrl": "https://ccsc.org.tw/?p=10240",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10238",
    "date": "2026-02-24",
    "title": "2026年台中分會02月月會活動-劉瓊惠-分享雙腳彈奏的交響曲",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會02月月會活動-劉瓊惠-分享雙腳彈奏的交響曲」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10238",
    "sourceUrl": "https://ccsc.org.tw/?p=10238",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10237",
    "date": "2026-02-24",
    "title": "2026年台中分會01月月會活動-譚璧輝老師-分享-你認為自己是瑪利亞還是瑪爾大",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「2026年台中分會01月月會活動-譚璧輝老師-分享-你認為自己是瑪利亞還是瑪爾大」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10237",
    "sourceUrl": "https://ccsc.org.tw/?p=10237",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10230",
    "date": "2026-01-04",
    "title": "114年台中分會10月總會活動-共融營-聖愛山莊",
    "group": "台中分會",
    "groupSlug": "taichung",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "台中分會刊登「114年台中分會10月總會活動-共融營-聖愛山莊」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10230",
    "sourceUrl": "https://ccsc.org.tw/?p=10230",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10176",
    "date": "2024-10-17",
    "title": "2024年9月北美共融營",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "總會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「2024年9月北美共融營」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10176",
    "sourceUrl": "https://ccsc.org.tw/?p=10176",
    "sourceKind": "text"
  },
  {
    "slug": "official-notice-10175",
    "date": "2024-10-17",
    "title": "2024.8.16-18青壯組日月潭之行",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "總會刊登「2024.8.16-18青壯組日月潭之行」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10175",
    "sourceUrl": "https://ccsc.org.tw/?p=10175",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10174",
    "date": "2024-10-17",
    "title": "2024/08/10中華基督神修小會參讚參議會會議記錄",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "總會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「2024/08/10中華基督神修小會參讚參議會會議記錄」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10174",
    "sourceUrl": "https://ccsc.org.tw/?p=10174",
    "sourceKind": "video"
  },
  {
    "slug": "official-notice-10173",
    "date": "2024-10-17",
    "title": "2024年4月15-18日終身奉獻會員共融營-藍眼淚馬祖暨福州行",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "原官網活動影像紀錄，保留標題、發布日期與原文入口。",
    "content": [
      "總會刊登「2024年4月15-18日終身奉獻會員共融營-藍眼淚馬祖暨福州行」。",
      "原頁以照片或影片為主，文字說明有限；完整影像與活動細節請閱讀原文。"
    ],
    "sourceKey": "notice:10173",
    "sourceUrl": "https://ccsc.org.tw/?p=10173",
    "sourceKind": "image"
  },
  {
    "slug": "official-notice-10151",
    "date": "2024-05-21",
    "title": "北美分會2024年9月共融營／旅遊",
    "group": "北美分會",
    "groupSlug": "north-america",
    "excerpt": "北美分會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「北美分會2024年9月共融營／旅遊」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10151",
    "sourceUrl": "https://ccsc.org.tw/?p=10151",
    "sourceKind": "mixed"
  },
  {
    "slug": "official-notice-10138",
    "date": "2024-02-13",
    "title": "總會研發組 2023 屆第01 次開會通知（視訊會議）",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "總會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「總會研發組 2023 屆第01 次開會通知（視訊會議）」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10138",
    "sourceUrl": "https://ccsc.org.tw/?p=10138",
    "sourceKind": "text"
  },
  {
    "slug": "official-notice-10136",
    "date": "2024-02-13",
    "title": "2024 中華基督神修小會參贊共識營（2023/11/18） 會議記錄",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "總會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「2024 中華基督神修小會參贊共識營（2023/11/18） 會議記錄」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10136",
    "sourceUrl": "https://ccsc.org.tw/?p=10136",
    "sourceKind": "text"
  },
  {
    "slug": "official-notice-10086",
    "date": "2021-10-26",
    "title": "2021 年北美小會共融營圓滿結束以及錄影連結",
    "group": "北美分會",
    "groupSlug": "north-america",
    "excerpt": "北美分會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「2021 年北美小會共融營圓滿結束以及錄影連結」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10086",
    "sourceUrl": "https://ccsc.org.tw/?p=10086",
    "sourceKind": "text"
  },
  {
    "slug": "official-notice-10085",
    "date": "2021-10-17",
    "title": "中華基督神修小會2021年網上共融營議程",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "總會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「中華基督神修小會2021年網上共融營議程」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10085",
    "sourceUrl": "https://ccsc.org.tw/?p=10085",
    "sourceKind": "text"
  },
  {
    "slug": "official-notice-10084",
    "date": "2021-10-01",
    "title": "北美分會2021共融營",
    "group": "北美分會",
    "groupSlug": "north-america",
    "excerpt": "北美分會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「北美分會2021共融營」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10084",
    "sourceUrl": "https://ccsc.org.tw/?p=10084",
    "sourceKind": "text"
  },
  {
    "slug": "official-notice-10082",
    "date": "2021-09-04",
    "title": "慶祝雷公百歲冥誕線上彌撒及共融",
    "group": "總會",
    "groupSlug": "headquarters",
    "excerpt": "總會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「慶祝雷公百歲冥誕線上彌撒及共融」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10082",
    "sourceUrl": "https://ccsc.org.tw/?p=10082",
    "sourceKind": "text"
  },
  {
    "slug": "official-notice-10005",
    "date": "2016-07-19",
    "title": "20160719北美家書",
    "group": "北美分會",
    "groupSlug": "north-america",
    "excerpt": "北美分會公開的活動或會務資訊，完整內容及相關連結請見原官網。",
    "content": [
      "原官網刊登「20160719北美家書」。",
      "本頁保留公告資訊與閱讀入口；原文中的完整議程、會議紀錄、分享及影音，請由下方連結查閱。"
    ],
    "sourceKey": "notice:10005",
    "sourceUrl": "https://ccsc.org.tw/?p=10005",
    "sourceKind": "text"
  }
]

export const publications: Publication[] = [
  { slug: 'fountain-104', series: '心泉', issue: '第 104 期', date: '2026', description: '季刊・靈修、信仰與生命分享。讓不同世代的生命故事匯成一股清泉。', accent: 'teal' },
  { slug: 'seed-71', series: '芥子', issue: '第 71 期', date: '2021', description: '半年刊・神學思想與文化省思。從微小種子展開信仰與世界的對話。', accent: 'gold' },
  { slug: 'seed-73', series: '芥子', issue: '第 73 期', date: '2026-10-31', description: '北美分會網路刊物，延續跨地域的靈修書寫與文化交流。', accent: 'indigo' },
]

export const articles: Article[] = [
  {
    "slug": "prayer-2026-10",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年10月訊《Jean Lafrance 向隱密中的天父祈禱》－ 得救之道",
    "author": "神修默觀祈禱小組",
    "date": "2026-09-27",
    "excerpt": "2026 年 10 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
    "content": [
      "2026 年 10 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
      "本期從與天主的對話出發，反省如何接受天主的注視，並以讚美與感恩獻上自己的生活。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:70762",
    "sourceUrl": "https://ccsc.org.tw/?p=70762",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-09",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年9月訊《Jean Lafrance 向隱密中的天父祈禱》－ 得救之道",
    "author": "神修默觀祈禱小組",
    "date": "2026-09-20",
    "excerpt": "2026 年 9 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
    "content": [
      "2026 年 9 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
      "本期反省在天主愛的注視下存在與生活，體會生命是天主愛的工程。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:70588",
    "sourceUrl": "https://ccsc.org.tw/?p=70588",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-08",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年8月訊《Jean Lafrance 向隱密中的天父祈禱》－ 得救之道",
    "author": "神修默觀祈禱小組",
    "date": "2026-09-20",
    "excerpt": "2026 年 8 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
    "content": [
      "2026 年 8 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:70587",
    "sourceUrl": "https://ccsc.org.tw/?p=70587",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-07",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年7月訊《Jean Lafrance 向隱密中的天父祈禱》－ 得救之道",
    "author": "神修默觀祈禱小組",
    "date": "2026-09-19",
    "excerpt": "2026 年 7 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
    "content": [
      "2026 年 7 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:70583",
    "sourceUrl": "https://ccsc.org.tw/?p=70583",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-06",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年6月訊《Jean Lafrance 向隱密中的天父祈禱》－ 得救之道",
    "author": "神修默觀祈禱小組",
    "date": "2026-05-26",
    "excerpt": "2026 年 6 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
    "content": [
      "2026 年 6 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:10251",
    "sourceUrl": "https://ccsc.org.tw/?p=10251",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-05",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年5月訊《Jean Lafrance 向隱密中的天父祈禱》－ 得救之道",
    "author": "神修默觀祈禱小組",
    "date": "2026-04-27",
    "excerpt": "2026 年 5 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
    "content": [
      "2026 年 5 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:10247",
    "sourceUrl": "https://ccsc.org.tw/?p=10247",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-04",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年4月訊《Jean Lafrance 向隱密中的天父祈禱》－ 得救之道",
    "author": "神修默觀祈禱小組",
    "date": "2026-03-27",
    "excerpt": "2026 年 4 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
    "content": [
      "2026 年 4 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「得救之道」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:10243",
    "sourceUrl": "https://ccsc.org.tw/?p=10243",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-03",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年3月訊《Jean Lafrance 向隱密中的天父祈禱》－ 交談的天主",
    "author": "神修默觀祈禱小組",
    "date": "2026-02-25",
    "excerpt": "2026 年 3 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「交談的天主」。",
    "content": [
      "2026 年 3 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「交談的天主」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:10239",
    "sourceUrl": "https://ccsc.org.tw/?p=10239",
    "sourceKind": "text"
  },
  {
    "slug": "twilight-full-sky",
    "category": "文化福傳",
    "title": "晚霞滿天：在路上學習交託",
    "author": "文化福傳小組",
    "date": "2026-02",
    "excerpt": "朝聖不只是抵達一個地方，而是在每一步裡重新認識自己與天主。",
    "content": [
      "文化福傳以影像與故事記錄信仰旅程，讓生活經驗成為可以彼此分享的光。",
      "在路上，我們學習放慢、聆聽，也學習把不能掌握的明天交託出去。"
    ]
  },
  {
    "slug": "prayer-2026-02",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年2月訊《Jean Lafrance 向隱密中的天父祈禱》－ 交談的天主",
    "author": "神修默觀祈禱小組",
    "date": "2026-01-29",
    "excerpt": "2026 年 2 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「交談的天主」。",
    "content": [
      "2026 年 2 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「交談的天主」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:10236",
    "sourceUrl": "https://ccsc.org.tw/?p=10236",
    "sourceKind": "text"
  },
  {
    "slug": "prayer-2026-01",
    "category": "默觀月訊",
    "title": "神修默觀祈禱小組2026年1月訊《Jean Lafrance 向隱密中的天父祈禱》－ 前言",
    "author": "神修默觀祈禱小組",
    "date": "2025-12-28",
    "excerpt": "2026 年 1 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「前言」。",
    "content": [
      "2026 年 1 月默觀月訊，選讀 Jean Lafrance《向隱密中的天父祈禱》，主題為「前言」。",
      "月訊由神修默觀祈禱小組提供，邀請伙伴在讀經、歸心祈禱與耶穌禱文中，彼此鼓勵扶持。完整經文、選讀與導讀請閱讀原文。"
    ],
    "sourceKey": "notice:10226",
    "sourceUrl": "https://ccsc.org.tw/?p=10226",
    "sourceKind": "text"
  },
  {
    "slug": "culture-70272",
    "category": "文化福傳",
    "title": "位際範疇的補充 —— 中國神學的基本商榷",
    "author": "張春申神父",
    "date": "2025-09-29",
    "excerpt": "從中國傳統的一體觀出發，探討神學本地化，並思考位際關係如何補充對天主與人的理解。",
    "content": [
      "從中國傳統的一體觀出發，探討神學本地化，並思考位際關係如何補充對天主與人的理解。",
      "這裡提供原官網專題摘要與閱讀入口。完整論述及參考資料請閱讀原文。"
    ],
    "sourceKey": "culture_entry:70272",
    "sourceUrl": "https://ccsc.org.tw/?p=70272",
    "sourceKind": "text"
  },
  {
    "slug": "culture-70271",
    "category": "文化福傳",
    "title": "【英語視頻】The Spirituality of Struggle",
    "author": "Joan Chittister, OSB (瓊 伽蒂斯特修女)",
    "date": "2023-11-27",
    "excerpt": "瓊伽蒂斯特修女的英語影音專題，原官網收錄 The Spirituality of Struggle 三部分影片入口。",
    "content": [
      "瓊伽蒂斯特修女的英語影音專題，原官網收錄 The Spirituality of Struggle 三部分影片入口。",
      "這裡提供原官網專題摘要與閱讀入口。影片內容尚未轉錄，請至原文觀看完整影音。"
    ],
    "sourceKey": "culture_entry:70271",
    "sourceUrl": "https://ccsc.org.tw/?p=70271",
    "sourceKind": "video"
  },
  {
    "slug": "culture-70270",
    "category": "文化福傳",
    "title": "【英語視頻】Christianity and Unknowing",
    "author": "Richard Rohr, OFM (理查 羅爾神父)",
    "date": "2023-11-27",
    "excerpt": "理查羅爾神父的英語影音專題 Christianity and Unknowing，提供信仰反省的閱讀與觀看入口。",
    "content": [
      "理查羅爾神父的英語影音專題 Christianity and Unknowing，提供信仰反省的閱讀與觀看入口。",
      "這裡提供原官網專題摘要與閱讀入口。影片內容尚未轉錄，請至原文觀看完整影音。"
    ],
    "sourceKey": "culture_entry:70270",
    "sourceUrl": "https://ccsc.org.tw/?p=70270",
    "sourceKind": "video"
  },
  {
    "slug": "culture-70269",
    "category": "文化福傳",
    "title": "【視頻】不要錯過生命，從信仰獲得生命的勇氣！",
    "author": "古倫神父",
    "date": "2023-11-25",
    "excerpt": "古倫神父談生命與信仰的勇氣；本頁提供影音專題介紹，完整內容請至原官網觀看。",
    "content": [
      "古倫神父談生命與信仰的勇氣；本頁提供影音專題介紹，完整內容請至原官網觀看。",
      "這裡提供原官網專題摘要與閱讀入口。影片內容尚未轉錄，請至原文觀看完整影音。"
    ],
    "sourceKey": "culture_entry:70269",
    "sourceUrl": "https://ccsc.org.tw/?p=70269",
    "sourceKind": "video"
  },
  {
    "slug": "culture-70268",
    "category": "文化福傳",
    "title": "【視頻】活在未來——生命教育的新觀點",
    "author": "趙可式",
    "date": "2023-11-25",
    "excerpt": "趙可式分享生命教育的新觀點，原官網以影音形式收錄。",
    "content": [
      "趙可式分享生命教育的新觀點，原官網以影音形式收錄。",
      "這裡提供原官網專題摘要與閱讀入口。影片內容尚未轉錄，請至原文觀看完整影音。"
    ],
    "sourceKey": "culture_entry:70268",
    "sourceUrl": "https://ccsc.org.tw/?p=70268",
    "sourceKind": "video"
  },
  {
    "slug": "culture-70267",
    "category": "文化福傳",
    "title": "徐甘弟大以及其他——17世紀的中國婦女和耶穌會士",
    "author": "費德里克 隆巴爾迪 (Federico Lombardi, S.J.)",
    "date": "2023-10-27",
    "excerpt": "以十七世紀中國女性基督徒的經驗，探討傳教、本地化與中國婦女在信仰生活中的角色。",
    "content": [
      "以十七世紀中國女性基督徒的經驗，探討傳教、本地化與中國婦女在信仰生活中的角色。",
      "這裡提供原官網專題摘要與閱讀入口。完整論述及參考資料請閱讀原文。"
    ],
    "sourceKey": "culture_entry:70267",
    "sourceUrl": "https://ccsc.org.tw/?p=70267",
    "sourceKind": "mixed"
  },
  {
    "slug": "culture-70266",
    "category": "文化福傳",
    "title": "【視頻】生命中的善與美",
    "author": "蔣勳",
    "date": "2023-10-26",
    "excerpt": "蔣勳從善意的底線、流失與尋回出發，談生命中的善與美。",
    "content": [
      "蔣勳從善意的底線、流失與尋回出發，談生命中的善與美。",
      "這裡提供原官網專題摘要與閱讀入口。影片內容尚未轉錄，請至原文觀看完整影音。"
    ],
    "sourceKey": "culture_entry:70266",
    "sourceUrl": "https://ccsc.org.tw/?p=70266",
    "sourceKind": "video"
  },
  {
    "slug": "culture-70265",
    "category": "文化福傳",
    "title": "【視頻】聖十字若望講座 – 因愛受傷 為愛成疾－十字若望的【靈歌】",
    "author": "蔣範華修女",
    "date": "2023-09-27",
    "excerpt": "蔣範華修女導讀聖十字若望《靈歌》，原官網收錄 2022 年 10 月 14 日講座的分段影片。",
    "content": [
      "蔣範華修女導讀聖十字若望《靈歌》，原官網收錄 2022 年 10 月 14 日講座的分段影片。",
      "這裡提供原官網專題摘要與閱讀入口。影片內容尚未轉錄，請至原文觀看完整影音。"
    ],
    "sourceKey": "culture_entry:70265",
    "sourceUrl": "https://ccsc.org.tw/?p=70265",
    "sourceKind": "video"
  },
  {
    "slug": "culture-70264",
    "category": "文化福傳",
    "title": "參與〈耶穌禱文〉奧秘，邁向「天主化」之路——《聖山沙漠之夜》一書簡介",
    "author": "盧德",
    "date": "2023-09-18",
    "excerpt": "盧德介紹《聖山沙漠之夜》，從耶穌禱文、心禱與正教傳統，探索邁向天主化的靈修之路。",
    "content": [
      "盧德介紹《聖山沙漠之夜》，從耶穌禱文、心禱與正教傳統，探索邁向天主化的靈修之路。",
      "這裡提供原官網專題摘要與閱讀入口。完整論述及參考資料請閱讀原文。"
    ],
    "sourceKey": "culture_entry:70264",
    "sourceUrl": "https://ccsc.org.tw/?p=70264",
    "sourceKind": "text"
  },
  {
    "slug": "culture-70263",
    "category": "文化福傳",
    "title": "是時候重新認識被教宗方濟各「高調推出」的德日進神父及其偉大思想了",
    "author": "韓清平神父",
    "date": "2023-09-10",
    "excerpt": "韓清平神父從 2023 年教宗方濟各的蒙古之行，介紹德日進神父的思想與信仰視野。",
    "content": [
      "韓清平神父從 2023 年教宗方濟各的蒙古之行，介紹德日進神父的思想與信仰視野。",
      "這裡提供原官網專題摘要與閱讀入口。完整論述及參考資料請閱讀原文。"
    ],
    "sourceKey": "culture_entry:70263",
    "sourceUrl": "https://ccsc.org.tw/?p=70263",
    "sourceKind": "mixed"
  },
  {
    "slug": "meeting-in-silence",
    "category": "默觀月訊",
    "title": "相逢寧靜中：聖善的願望",
    "author": "神修默觀祈禱小組",
    "date": "2023-07",
    "excerpt": "把願望讓天主看見；即使能力微弱，仍以宏大的愛回應祂。",
    "content": [
      "「禰是葡萄樹，我們是枝條，離開禰，我們什麼也不能做。」（若 15:5）",
      "祈禱不只關於已經完成的事，也關於我們願意成為怎樣的人。把心中的聖善願望帶到天主面前，讓愛比能力更早一步抵達。",
      "小組邀請每位偕行者每天以十分鐘讀經、十五分鐘歸心祈禱或耶穌禱文，安靜地回到生命的中心。"
    ]
  },
  {
    "slug": "tree-of-blooming-flowers",
    "category": "文化福傳",
    "title": "一棵開花的樹 A Tree of Blooming Flowers",
    "author": "席慕蓉・星熒譯",
    "date": "2018-05",
    "excerpt": "在詩與翻譯之間，凝視等待、相遇與凋零所留下的心靈風景。",
    "content": [
      "文化福傳收錄華文詩歌及英譯作品，讓美與信仰在人與人的相遇中展開。",
      "本篇保存原作與譯文的對照閱讀，並延伸至音樂與合唱的不同詮釋。"
    ]
  }
]

export const timeline = [
  [
    "1962",
    "五位教友在台北聚為神修小組；11 月 12 日立定規模。"
  ],
  [
    "1966",
    "總會於台北成立，十二位會員首度奉獻。"
  ],
  [
    "1970",
    "於陽明山福音園通過會章，並成立《心泉》編輯小組。"
  ],
  [
    "1974",
    "北美分會成立；七位會員首度終身奉獻。高雄分會成立年份因官網史料記載不一，保留待核。"
  ],
  [
    "1993",
    "通過以天主聖三為小會主保，並以天主聖三節為會慶日。"
  ],
  [
    "2002",
    "北美分會祈禱通訊上網，小會資料首次刊載於網路。"
  ],
  [
    "2015",
    "完成小會之友人文關懷與服務促進協會登記，辦公室遷入長安天主堂。"
  ],
  [
    "2015",
    "ccsc.org.tw 官網啟用。（沿用既有摘要；本次來源未核實啟用年份。）"
  ],
  [
    "2017",
    "小會之友協會與長安天主堂合作成立社區老人關懷服務據點。"
  ],
  [
    "2020",
    "與台北瑪利亞方濟傳教修女會合作成立第二個社區老人關懷服務據點。"
  ],
  [
    "2022",
    "慶祝小會成立六十周年，發行《心泉》第 100 期特刊。"
  ],
  [
    "2023",
    "於高雄真福山舉辦小會成立六十周年全球共融營。"
  ],
  [
    "2024",
    "啟動《會員手冊》修訂工作。"
  ],
  [
    "2025",
    "台北、台中與高雄三分會聯合辦理「與小會偕行」線上陶成活動。"
  ],
  [
    "2026",
    "原官網年表記載三分會聯合辦理「與小會偕行」線上陶成活動；期別仍待確認。"
  ]
]

export const principles = [
  {
    "title": "愛",
    "text": "以基督的聖愛為根本，在日常關係中練習接納、偕行與給予。"
  },
  {
    "title": "自由",
    "text": "以超脫的心面對得失，在祈禱與分辨中回應真正的召叫。"
  },
  {
    "title": "喜樂",
    "text": "從與主結合而來的深層喜樂，成為服務與盼望的泉源。"
  }
]

export const aboutContent = {
  "mission": [
    "繼續基督對中華的使命",
    "參與現代人類對真理的尋求",
    "致力於中華新文化的建設",
    "促成更公義和諧的社會",
    "在生活中成全自己",
    "在教會內團結，以完成使命"
  ],
  "attitudes": [
    "超脫",
    "喜樂",
    "進取",
    "合作",
    "服務"
  ],
  "sources": [
    {
      "label": "小會是什麼？",
      "url": "https://ccsc.org.tw/?page_id=50001"
    },
    {
      "label": "宗旨精神",
      "url": "https://ccsc.org.tw/?page_id=50002"
    },
    {
      "label": "歷史沿革",
      "url": "https://ccsc.org.tw/?page_id=50003"
    },
    {
      "label": "大事年表",
      "url": "https://ccsc.org.tw/?page_id=50004"
    }
  ]
}

export const contentSource = {
  "url": "https://ccsc.org.tw/",
  "checkedAt": "2026-10-16",
  "calendarYear": 2026
}
