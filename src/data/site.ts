export type Group = {
  slug: string
  name: string
  shortName: string
  location: string
  description: string
  rhythm: string
  accent: string
}

export type Event = {
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
  slug: string
  category: '文化福傳' | '默觀月訊' | '靈修札記'
  title: string
  author: string
  date: string
  excerpt: string
  content: string[]
}

export const groups: Group[] = [
  {
    slug: 'headquarters',
    name: '總會',
    shortName: '總會',
    location: '台北・長安天主堂',
    description: '連結各分會、推動陶成與共融，陪伴會員在生活中實踐小會使命。',
    rhythm: '全國共融、陶成與年度會慶',
    accent: 'gold',
  },
  {
    slug: 'taipei',
    name: '台北分會',
    shortName: '台北',
    location: '台北',
    description: '透過月會、避靜、文化活動與社區關懷，在城市生活中同行。',
    rhythm: '月會、避靜、藝文與關懷服務',
    accent: 'teal',
  },
  {
    slug: 'taichung',
    name: '台中分會',
    shortName: '台中',
    location: '台中・雙十堂',
    description: '以靈修、福傳、共融、傳承為年度主題，在分享與服務中彼此扶持。',
    rhythm: '每月聚會、避靜與共融營',
    accent: 'indigo',
  },
  {
    slug: 'kaohsiung',
    name: '高雄分會',
    shortName: '高雄',
    location: '高雄',
    description: '在南台灣延續小會大家庭的精神，舉辦月會、會慶與生命分享。',
    rhythm: '月會、會慶與分會共融',
    accent: 'terracotta',
  },
  {
    slug: 'north-america',
    name: '北美分會',
    shortName: '北美',
    location: '北美・線上共融',
    description: '跨越地域，以線上祈禱、月會與芥子刊物維繫華人信仰團體。',
    rhythm: '週間線上祈禱與跨區月會',
    accent: 'blue',
  },
  {
    slug: 'contemplation',
    name: '神修默觀祈禱小組',
    shortName: '默觀',
    location: '線上與各地小組',
    description: '以每日讀經、歸心祈禱與耶穌禱文，學習相逢於寧靜中。',
    rhythm: '平日默觀祈禱與每月月訊',
    accent: 'plum',
  },
]

export const events: Event[] = [
  { id: 'tp-0920', date: '2026-09-20', title: '雷公與賴神父周年追思', group: 'taipei', location: '台北', speaker: '總會戎巧復', description: '在感恩與祈禱中紀念同行者，回望他們留給小會的生命見證。' },
  { id: 'tc-0920', date: '2026-09-20', title: '讀書分享：生活中的神聖', group: 'taichung', location: '雙十堂', speaker: '傅美華' },
  { id: 'camp-1023', date: '2026-10-23', endDate: '2026-10-25', title: '小會共融營', group: 'headquarters', location: '彰化靜山', description: '三日共融、祈禱與生命交流，讓各地會員重新相遇。' },
  { id: 'tp-1115', date: '2026-11-15', title: '依納爵神操', group: 'taipei', location: '台北', speaker: '尹美琪修女' },
  { id: 'tc-1115', date: '2026-11-15', title: '靈修分享', group: 'taichung', location: '雙十堂', speaker: '張瑞雲' },
  { id: 'tp-1220', date: '2026-12-20', title: '慶祝聖誕', group: 'taipei', location: '台北', description: '在將臨與聖誕的喜樂中彼此祝福。' },
  { id: 'tc-1220', date: '2026-12-20', title: '聖誕聚會', group: 'taichung', location: '台中', speaker: '巫郁玫' },
  { id: 'na-weekday', date: '2026-09-21', title: '週間默觀祈禱', group: 'north-america', location: '線上', description: '週一至週五，美東時間下午 4:00。' },
]

export const notices: Notice[] = [
  {
    slug: 'life-in-color-2026',
    date: '2026-09-18',
    title: 'II5年8月彩繪人生~活出愛-張世杰神父',
    group: '台北分會',
    excerpt: '從生活的色彩中辨認愛的足跡，在分享與創作裡回應天主。',
    content: ['台北分會八月聚會以「彩繪人生，活出愛」為題，由張世杰神父陪伴分享。', '活動邀請參與者從生命經驗出發，看見平凡日子裡愛的召叫，並在彼此聆聽中重新得力。'],
  },
  {
    slug: 'silver-fitness',
    date: '2026-09-17',
    title: '歡迎報名參加外丹功 銀髮動動樂….',
    group: '服務與生活',
    excerpt: '以友善、安全的活動陪伴長者舒展身心，歡迎社區朋友參加。',
    content: ['小會之友持續以實際行動投入社區長者關懷。', '本活動以柔和運動與團體互動為主，詳細場次與報名方式請洽總會辦公室。'],
  },
  {
    slug: 'nangang-art-eco',
    date: '2026-08-29',
    title: '115年4月南港藝文生態Go!',
    group: '台北分會',
    excerpt: '走進南港的藝文與生態地景，在同行中感受受造界的美好。',
    content: ['台北分會四月活動走出室內，以藝文、生態與信仰交織出共融的一日。', '沿途以觀察、分享與祈禱，讓城市成為一間開放的靈修教室。'],
  },
  {
    slug: 'trinity-feast-2026',
    date: '2026-08-10',
    title: '115年5月天主聖三節會慶',
    group: '總會',
    excerpt: '在小會主保天主聖三的節日中，相聚感恩並更新共同使命。',
    content: ['天主聖三節是小會一年一度的重要會慶。', '各分會家人透過感恩祭、主題分享與共融，重新體會愛內的多元與合一。'],
  },
  {
    slug: 'youth-evangelization-2026',
    date: '2026-08-07',
    title: '115年7月青年福傳講座',
    group: '青年組',
    excerpt: '與青年同行，在當代語境裡練習聆聽、陪伴與分享信仰。',
    content: ['青年福傳不是單向傳遞，而是一起尋找生命問題中的光。', '講座從青年文化與陪伴經驗出發，探索信仰如何成為真實生活的力量。'],
  },
]

export const publications: Publication[] = [
  { slug: 'fountain-104', series: '心泉', issue: '第 104 期', date: '2026', description: '季刊・靈修、信仰與生命分享。讓不同世代的生命故事匯成一股清泉。', accent: 'teal' },
  { slug: 'seed-71', series: '芥子', issue: '第 71 期', date: '2021', description: '半年刊・神學思想與文化省思。從微小種子展開信仰與世界的對話。', accent: 'gold' },
  { slug: 'seed-73', series: '芥子', issue: '第 73 期', date: '2026-10-31', description: '北美分會網路刊物，延續跨地域的靈修書寫與文化交流。', accent: 'indigo' },
]

export const articles: Article[] = [
  {
    slug: 'meeting-in-silence',
    category: '默觀月訊',
    title: '相逢寧靜中：聖善的願望',
    author: '神修默觀祈禱小組',
    date: '2023-07',
    excerpt: '把願望讓天主看見；即使能力微弱，仍以宏大的愛回應祂。',
    content: ['「禰是葡萄樹，我們是枝條，離開禰，我們什麼也不能做。」（若 15:5）', '祈禱不只關於已經完成的事，也關於我們願意成為怎樣的人。把心中的聖善願望帶到天主面前，讓愛比能力更早一步抵達。', '小組邀請每位同行者每天以十分鐘讀經、十五分鐘歸心祈禱或耶穌禱文，安靜地回到生命的中心。'],
  },
  {
    slug: 'twilight-full-sky',
    category: '文化福傳',
    title: '晚霞滿天：在路上學習交託',
    author: '文化福傳小組',
    date: '2026-02',
    excerpt: '朝聖不只是抵達一個地方，而是在每一步裡重新認識自己與天主。',
    content: ['文化福傳以影像與故事記錄信仰旅程，讓生活經驗成為可以彼此分享的光。', '在路上，我們學習放慢、聆聽，也學習把不能掌握的明天交託出去。'],
  },
  {
    slug: 'tree-of-blooming-flowers',
    category: '文化福傳',
    title: '一棵開花的樹 A Tree of Blooming Flowers',
    author: '席慕蓉・星熒譯',
    date: '2018-05',
    excerpt: '在詩與翻譯之間，凝視等待、相遇與凋零所留下的心靈風景。',
    content: ['文化福傳收錄華文詩歌及英譯作品，讓美與信仰在人與人的相遇中展開。', '本篇保存原作與譯文的對照閱讀，並延伸至音樂與合唱的不同詮釋。'],
  },
]

export const timeline = [
  ['1962', '五位教友在台北聚為神修小組；11 月 12 日立定規模。'],
  ['1966', '總會於台北成立，十二位會員首度奉獻。'],
  ['1970', '於陽明山福音園通過會章，並成立《心泉》編輯小組。'],
  ['1974', '北美與高雄分會成立；七位會員首度終身奉獻。'],
  ['1993', '通過以天主聖三為小會主保，並以天主聖三節為會慶日。'],
  ['2002', '北美分會祈禱通訊上網，小會資料首次刊載於網路。'],
  ['2014', '成立小會之友人文關懷與服務促進協會。'],
  ['2015', 'ccsc.org.tw 官網啟用，並投入社區老人關懷服務。'],
  ['2022', '慶祝小會成立六十周年，發行《心泉》第 100 期特刊。'],
  ['2024', '啟動《會員手冊》修訂工作。'],
] as const

export const principles = [
  { title: '愛', text: '以基督的聖愛為根本，在日常關係中練習接納、同行與給予。' },
  { title: '自由', text: '以超脫的心面對得失，在祈禱與分辨中回應真正的召叫。' },
  { title: '喜樂', text: '從與主結合而來的深層喜樂，成為服務與盼望的泉源。' },
]
