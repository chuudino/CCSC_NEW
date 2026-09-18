import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Cross,
  ExternalLink,
  Feather,
  Globe2,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Phone,
  PlayCircle,
  Quote,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  articles,
  events,
  groups,
  notices,
  principles,
  publications,
  timeline,
} from './data/site'

const navItems = [
  { label: '關於我們', to: '/about' },
  { label: '活動與分會', to: '/activities' },
  { label: '行事曆', to: '/calendar' },
  { label: '小會刊物', to: '/publications' },
  { label: '文化福傳', to: '/culture' },
  { label: '默觀祈禱', to: '/prayer' },
]

const groupName = (slug: string) => groups.find((group) => group.slug === slug)?.name ?? slug

function formatDate(date: string, withYear = true) {
  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat('zh-TW', {
    year: withYear ? 'numeric' : undefined,
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(parsed)
}

function SacredMark({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? 'sacred-mark sacred-mark--compact' : 'sacred-mark'} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="45" cy="47" r="31" />
      <circle cx="75" cy="47" r="31" />
      <circle cx="60" cy="74" r="31" />
      <path d="M60 13v22M49 24h22" className="sacred-mark__cross" />
      <circle cx="60" cy="60" r="53" className="sacred-mark__orbit" />
    </svg>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function SearchBox({ onSubmit }: { onSubmit?: () => void }) {
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    const query = value.trim()
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
    onSubmit?.()
  }

  return (
    <form className="search-box" role="search" onSubmit={submit}>
      <Search size={18} aria-hidden="true" />
      <label className="sr-only" htmlFor="site-search">搜尋網站內容</label>
      <input
        id="site-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="搜尋活動、文章、刊物…"
      />
      <button type="submit">搜尋</button>
    </form>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-bar__inner">
          <span>天主教中華基督神修小會</span>
          <div>
            <a href="tel:+886225230538"><Phone size={13} /> (02) 2523-0538</a>
            <a href="mailto:ccscasso@gmail.com"><Mail size={13} /> ccscasso@gmail.com</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Link className="brand" to="/" aria-label="中華基督神修小會首頁">
            <SacredMark compact />
            <span><strong>中華基督神修小會</strong><small>Chinese Christian Spirit Community</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="主要導覽">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="icon-button" to="/search" aria-label="搜尋"><Search size={20} /></Link>
            <button className="menu-button" aria-label={open ? '關閉選單' : '開啟選單'} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="mobile-panel">
            <div className="shell">
              <SearchBox onSubmit={() => setOpen(false)} />
              <nav aria-label="行動版導覽">
                {navItems.map((item) => <NavLink key={item.to} to={item.to}>{item.label}<ChevronRight size={17} /></NavLink>)}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div className="footer__brand">
          <SacredMark compact />
          <div><strong>中華基督神修小會</strong><p>在基督的愛內，共同成長</p></div>
        </div>
        <div>
          <h2>聯絡我們</h2>
          <p><MapPin size={16} /> 台北市中山區林森北路 73 號 2 樓</p>
          <p><Phone size={16} /> <a href="tel:+886225230538">(02) 2523-0538</a></p>
          <p><Mail size={16} /> <a href="mailto:ccscasso@gmail.com">ccscasso@gmail.com</a></p>
        </div>
        <div>
          <h2>快速前往</h2>
          <Link to="/calendar">近期行事曆</Link>
          <Link to="/publications">心泉與芥子</Link>
          <Link to="/search">全站搜尋</Link>
        </div>
        <div>
          <h2>各地分會</h2>
          {groups.slice(0, 5).map((group) => <Link key={group.slug} to={`/groups/${group.slug}`}>{group.name}</Link>)}
        </div>
      </div>
      <div className="shell footer__bottom">
        <span>© 2026 中華基督神修小會</span>
        <a href="https://ccsc.org.tw/" target="_blank" rel="noreferrer">舊版官網 <ExternalLink size={13} /></a>
      </div>
    </footer>
  )
}

function Layout({ children }: { children: ReactNode }) {
  return <><ScrollToTop /><Header /><main>{children}</main><Footer /></>
}

function SectionHeading({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
      {action}
    </div>
  )
}

function PageHero({ eyebrow, title, text, icon }: { eyebrow: string; title: string; text: string; icon?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="shell page-hero__inner">
        <div><span className="eyebrow eyebrow--light">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>
        <div className="page-hero__icon">{icon ?? <SacredMark />}</div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__copy">
            <span className="eyebrow"><Sparkles size={15} /> 一個在愛內彼此扶持的家</span>
            <h1>在基督的愛內，<br /><em>共同成長。</em></h1>
            <p>我們是一群在日常生活中尋找天主的人。以中華文化的深度、福音的喜樂，彼此偕行，也走向世界。</p>
            <div className="button-row">
              <Link className="button button--primary" to="/about">認識小會 <ArrowRight size={18} /></Link>
              <Link className="button button--ghost" to="/calendar">查看近期活動</Link>
            </div>
            <div className="hero__facts">
              <div><strong>1962</strong><span>在台北相聚啟程</span></div>
              <div><strong>5</strong><span>海內外分會</span></div>
              <div><strong>愛・自由・喜樂</strong><span>共同的靈修精神</span></div>
            </div>
          </div>
          <div className="hero-art" aria-label="象徵天主聖三與團體共融的圖像">
            <div className="hero-art__halo" />
            <SacredMark />
            <blockquote><Quote size={22} /><p>愛是含忍的，愛是慈祥的……愛永存不朽。</p><cite>格林多前書 13:4, 8</cite></blockquote>
            <div className="hero-art__note"><Cross size={18} /><span>奉獻所有<br />神化一切</span></div>
          </div>
        </div>
        <div className="hero__scroll"><span>向下認識我們</span><i /></div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <SectionHeading eyebrow="近期偕行" title="在相遇中，讓信仰成為生活" text="從共融、祈禱到文化與服務，找到一個與你偕行的入口。" action={<Link className="text-link" to="/calendar">完整行事曆 <ArrowRight size={16} /></Link>} />
          <div className="event-feature-grid">
            {events.slice(0, 3).map((event, index) => (
              <article className={index === 0 ? 'event-feature event-feature--primary' : 'event-feature'} key={event.id}>
                <div className="date-tile"><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('zh-TW', { month: 'short' }).format(new Date(`${event.date}T12:00:00`))}</span></div>
                <div><span className="tag">{groupName(event.group)}</span><h3>{event.title}</h3><p><MapPin size={15} /> {event.location}{event.speaker ? `・${event.speaker}` : ''}</p></div>
                <Link to="/calendar" aria-label={`查看${event.title}`}><ArrowUpRight /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section mission-section">
        <div className="shell mission-grid">
          <div className="mission-intro">
            <span className="eyebrow eyebrow--light">我們相信</span>
            <h2>信仰，發生在<br />每一個真實日常。</h2>
            <p>小會不是遠離世界的生活，而是在家庭、工作與社會中，讓基督藉著我們的口、心和手愛人助人。</p>
            <Link className="button button--cream" to="/about">閱讀宗旨與精神 <ArrowRight size={18} /></Link>
          </div>
          <div className="principle-list">
            {principles.map((principle, index) => (
              <div key={principle.title}><span>0{index + 1}</span><h3>{principle.title}</h3><p>{principle.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <SectionHeading eyebrow="最新消息" title="小會正在發生的事" action={<Link className="text-link" to="/activities">瀏覽全部 <ArrowRight size={16} /></Link>} />
          <div className="notice-grid">
            {notices.slice(0, 3).map((notice, index) => (
              <article className={index === 0 ? 'notice-card notice-card--featured' : 'notice-card'} key={notice.slug}>
                <div className="notice-card__visual"><span>{notice.group}</span><Feather /></div>
                <div className="notice-card__body"><time>{formatDate(notice.date)}</time><h3>{notice.title}</h3><p>{notice.excerpt}</p><Link to={`/article/${notice.slug}`}>閱讀消息 <ArrowRight size={15} /></Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section publication-band">
        <div className="shell publication-band__grid">
          <div>
            <span className="eyebrow">小會刊物</span>
            <h2>文字，是相遇之後<br />留下的一眼清泉。</h2>
            <p>《心泉》記錄靈修與生命分享，《芥子》展開神學思想與文化省思。</p>
            <Link className="text-link" to="/publications">走進閱讀室 <ArrowRight size={16} /></Link>
          </div>
          <div className="publication-covers">
            {publications.slice(0, 2).map((publication) => (
              <Link className={`mini-cover mini-cover--${publication.accent}`} to="/publications" key={publication.slug}>
                <span>{publication.series}</span><i /><strong>{publication.issue}</strong><small>{publication.date}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <SectionHeading eyebrow="遍及各地" title="同一份精神，多樣的團體生活" text="從台灣到北美，透過實體與線上相聚，讓距離不阻隔共融。" />
          <div className="group-ribbon">
            {groups.slice(0, 5).map((group) => <Link key={group.slug} to={`/groups/${group.slug}`}><Globe2 /><span><strong>{group.name}</strong><small>{group.location}</small></span><ChevronRight /></Link>)}
          </div>
        </div>
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About CCSC" title="一個以基督愛為中心的大家庭" text="在中華文化中尋求靈修成長，彼此扶持，並在各自的生活崗位上成為愛的見證。" icon={<HeartHandshake />} />
      <section className="section section--paper">
        <div className="shell readable-grid">
          <aside><span className="eyebrow">小會是什麼？</span><h2>不是離開生活，<br />而是更深地進入生活。</h2></aside>
          <div className="prose lead-prose">
            <p>小會是一個以基督愛為中心的大家庭。每位成員在團體中陶成為具有獨立健全人格及深厚內修基礎的成熟教友，並以學習、進取的態度，回應時代的變化。</p>
            <p>會員以不同的生活方式奉獻自己：有人在婚姻與家庭中成全生命，有人選擇獨身或修會生活。無論身在何處，都在各自崗位默默耕耘，使社會更臻完善。</p>
            <blockquote>讓天主藉著我們進入世界；讓基督藉著我們的口、我們的心和我們的手，愛人助人。</blockquote>
            <p>我們珍視中華文化的優長，也向世界其他文化學習，盼望東西文化在基督內相遇，使華夏精神在福音中發揚。</p>
          </div>
        </div>
      </section>
      <section className="section values-section">
        <div className="shell">
          <SectionHeading eyebrow="宗旨與精神" title="繼續基督對中華的使命" text="在生活中成全自己，在教會內團結，以完成共同使命。" />
          <div className="purpose-grid">
            {[
              ['01', '尋求真理', '與現代人攜手，在一切真理中辨認基督之光。'],
              ['02', '建設文化', '在福音光照下，保存傳統的優長，吸取現代文化的養分。'],
              ['03', '促成公義', '關心社會、服務人群，為更公義和諧的世界持續悔改與行動。'],
              ['04', '活出成全', '藉祈禱、聖體與研讀聖經，讓生命與基督保持連結。'],
            ].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section section--paper">
        <div className="shell">
          <SectionHeading eyebrow="歷史沿革" title="六十多年，一條持續展開的路" text="從五位教友的神修小組，走向跨地域、跨世代的信仰家庭。" />
          <div className="timeline">
            {timeline.map(([year, item]) => <div key={year}><time>{year}</time><i /><p>{item}</p></div>)}
          </div>
        </div>
      </section>
    </>
  )
}

function ActivitiesPage() {
  return (
    <>
      <PageHero eyebrow="Community & Events" title="相遇、共融，然後一起行動" text="瀏覽近期消息，也認識各地分會如何在祈禱、文化與服務中活出小會精神。" icon={<Users />} />
      <section className="section section--paper">
        <div className="shell">
          <SectionHeading eyebrow="最新消息" title="活動與生活紀錄" />
          <div className="list-layout">
            <div className="article-list">
              {notices.map((notice) => (
                <article key={notice.slug}>
                  <time>{formatDate(notice.date)}</time>
                  <div><span className="tag">{notice.group}</span><h2>{notice.title}</h2><p>{notice.excerpt}</p></div>
                  <Link to={`/article/${notice.slug}`} aria-label={`閱讀${notice.title}`}><ArrowRight /></Link>
                </article>
              ))}
            </div>
            <aside className="sidebar-card"><CalendarDays /><h2>下一場相聚</h2><strong>{events[0].title}</strong><p>{formatDate(events[0].date)}・{events[0].location}</p><Link to="/calendar">查看行事曆 <ArrowRight size={15} /></Link></aside>
          </div>
        </div>
      </section>
      <section className="section section--mist">
        <div className="shell"><SectionHeading eyebrow="各地分會" title="找到一個與你偕行的團體" />
          <div className="group-card-grid">
            {groups.map((group) => <Link className={`group-card group-card--${group.accent}`} to={`/groups/${group.slug}`} key={group.slug}><span>{group.shortName}</span><div><h3>{group.name}</h3><p>{group.description}</p><small><MapPin size={14} /> {group.location}</small></div><ArrowUpRight /></Link>)}
          </div>
        </div>
      </section>
    </>
  )
}

function GroupPage() {
  const { slug } = useParams()
  const group = groups.find((item) => item.slug === slug)
  if (!group) return <NotFound />
  const groupEvents = events.filter((event) => event.group === group.slug || (group.slug === 'headquarters' && event.group === 'headquarters'))
  return (
    <>
      <PageHero eyebrow="Local Community" title={group.name} text={group.description} icon={<Globe2 />} />
      <section className="section section--paper"><div className="shell group-detail-grid">
        <div><span className="eyebrow">團體節奏</span><h2>{group.rhythm}</h2><p className="large-copy">我們在固定相聚中祈禱、學習與分享生命，也透過服務與文化活動，將信仰帶進真實世界。</p><div className="contact-strip"><MapPin /><span><strong>聚會地區</strong>{group.location}</span></div></div>
        <div className="upcoming-panel"><h2>近期安排</h2>{groupEvents.length ? groupEvents.map((event) => <div key={event.id}><time>{formatDate(event.date, false)}</time><strong>{event.title}</strong><span>{event.location}</span></div>) : <p>最新聚會資訊整理中，歡迎聯絡總會。</p>}<Link className="button button--primary" to="/calendar">完整行事曆 <ArrowRight size={17} /></Link></div>
      </div></section>
    </>
  )
}

function CalendarPage() {
  const [filter, setFilter] = useState('all')
  const visibleEvents = filter === 'all' ? events : events.filter((event) => event.group === filter)
  return (
    <>
      <PageHero eyebrow="Calendar" title="2026 行事曆" text="把相聚留在日曆上，也把彼此放在祈禱中。活動資訊以各分會公告為準。" icon={<CalendarDays />} />
      <section className="section section--paper"><div className="shell">
        <div className="filter-row" role="group" aria-label="依分會篩選">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>全部</button>
          {groups.slice(0, 5).map((group) => <button key={group.slug} className={filter === group.slug ? 'active' : ''} onClick={() => setFilter(group.slug)}>{group.shortName}</button>)}
        </div>
        <div className="calendar-list">
          {visibleEvents.map((event) => <article key={event.id}><div className="calendar-list__date"><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('zh-TW', { month: 'short' }).format(new Date(`${event.date}T12:00:00`))}</span></div><div><span className="tag">{groupName(event.group)}</span><h2>{event.title}</h2>{event.description && <p>{event.description}</p>}<small><Clock3 size={14} /> {formatDate(event.date)}{event.endDate ? `－${formatDate(event.endDate)}` : ''}<MapPin size={14} /> {event.location}{event.speaker ? `・${event.speaker}` : ''}</small></div></article>)}
        </div>
      </div></section>
    </>
  )
}

function PublicationsPage() {
  return (
    <>
      <PageHero eyebrow="Publications" title="心泉與芥子" text="保存團體的共同記憶，也讓靈修經驗、神學思想與文化省思持續流動。" icon={<BookOpen />} />
      <section className="section section--paper"><div className="shell">
        <div className="publication-intro"><div><span className="eyebrow">閱讀室</span><h2>一篇文章，一段偕行的路</h2></div><p>《心泉》是小會的生命記錄與靈修分享；《芥子》由北美分會持續耕耘，讓微小的信仰種子在文化中生長。</p></div>
        <div className="library-grid">
          {publications.map((publication) => <article key={publication.slug} className={`library-item library-item--${publication.accent}`}><div className="book-cover"><span>CCSC</span><strong>{publication.series}</strong><i /><small>{publication.issue}</small></div><div><span className="tag">{publication.series}</span><h2>{publication.issue}</h2><time>{publication.date}</time><p>{publication.description}</p><button className="text-link" type="button">本期目錄整理中 <ArrowRight size={15} /></button></div></article>)}
        </div>
      </div></section>
    </>
  )
}

function CulturePage() {
  const culture = articles.filter((article) => article.category === '文化福傳')
  return (
    <>
      <PageHero eyebrow="Faith & Culture" title="讓福音與文化相遇" text="透過文字、影像、詩歌與生命故事，在當代生活中展開更寬廣的信仰對話。" icon={<Feather />} />
      <section className="section section--paper"><div className="shell">
        <div className="featured-story"><div className="featured-story__art"><PlayCircle /><span>影音專題</span></div><div><span className="eyebrow">文化福傳專題</span><h2>晚霞滿天</h2><p>分享朝聖路上的心靈故事與見證。當腳步慢下來，我們重新聽見內在的聲音，也在沿途風景中練習交託。</p><Link className="button button--primary" to="/article/twilight-full-sky">閱讀專題 <ArrowRight size={17} /></Link></div></div>
        <SectionHeading eyebrow="選讀文章" title="在美與思想之間停留" />
        <div className="story-grid">{culture.map((article) => <article key={article.slug}><div><span>{article.category}</span><Feather /></div><time>{article.date}</time><h2>{article.title}</h2><p>{article.excerpt}</p><Link to={`/article/${article.slug}`}>繼續閱讀 <ArrowRight size={15} /></Link></article>)}</div>
      </div></section>
    </>
  )
}

function PrayerPage() {
  const article = articles.find((item) => item.category === '默觀月訊')!
  return (
    <>
      <PageHero eyebrow="Contemplative Prayer" title="相逢寧靜中" text="整裝待發，隨時儆醒；在安靜、讀經與祈禱中，陪伴彼此成為天主眼中完整的自己。" icon={<Sparkles />} />
      <section className="section prayer-section"><div className="shell prayer-grid">
        <div className="prayer-quote"><SacredMark /><blockquote>禰是葡萄樹，我們是枝條，離開禰，我們什麼也不能做。<cite>若望福音 15:5</cite></blockquote></div>
        <div><span className="eyebrow">每日操練</span><h2>在規律裡，為心保留一片安靜。</h2><div className="practice-list"><div><strong>10</strong><span>分鐘讀聖經</span></div><div><strong>15</strong><span>分鐘歸心祈禱</span></div><div><strong>1</strong><span>句耶穌禱文</span></div></div><p>「耶穌基督天主子，求禰可憐我。」讓一句簡單的祈禱，陪伴呼吸，也陪伴一天的生活。</p></div>
      </div></section>
      <section className="section section--paper"><div className="shell"><SectionHeading eyebrow="默觀月訊" title="本月選讀" /><article className="reading-feature"><div><span className="tag">{article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><Link className="text-link" to={`/article/${article.slug}`}>閱讀全文 <ArrowRight size={16} /></Link></div><div><Quote /><p>把心中的聖善願望帶到天主面前，讓愛比能力更早一步抵達。</p></div></article></div></section>
    </>
  )
}

const searchIndex = [
  ...notices.map((item) => ({ title: item.title, text: `${item.excerpt} ${item.group}`, to: `/article/${item.slug}`, type: '活動消息' })),
  ...articles.map((item) => ({ title: item.title, text: `${item.excerpt} ${item.author}`, to: `/article/${item.slug}`, type: item.category })),
  ...groups.map((item) => ({ title: item.name, text: `${item.description} ${item.location}`, to: `/groups/${item.slug}`, type: '分會' })),
  ...publications.map((item) => ({ title: `${item.series} ${item.issue}`, text: item.description, to: '/publications', type: '小會刊物' })),
  ...events.map((item) => ({ title: item.title, text: `${item.location} ${groupName(item.group)} ${item.description ?? ''}`, to: '/calendar', type: '行事曆' })),
]

function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [query, setQuery] = useState(initial)
  useEffect(() => setQuery(initial), [initial])
  const results = useMemo(() => {
    const keyword = initial.trim().toLocaleLowerCase('zh-TW')
    if (!keyword) return searchIndex
    return searchIndex.filter((item) => `${item.title} ${item.text} ${item.type}`.toLocaleLowerCase('zh-TW').includes(keyword))
  }, [initial])
  function submit(event: FormEvent) { event.preventDefault(); setParams(query.trim() ? { q: query.trim() } : {}) }
  return (
    <>
      <PageHero eyebrow="Search" title="搜尋小會網站" text="從活動、分會、刊物與文章中，找到你正在尋找的內容。" icon={<Search />} />
      <section className="section section--paper"><div className="shell search-page">
        <form onSubmit={submit}><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="輸入關鍵字" aria-label="搜尋關鍵字" /><button className="button button--primary">搜尋</button></form>
        <p className="result-count">{initial ? `「${initial}」共找到 ${results.length} 筆結果` : `瀏覽全部 ${results.length} 筆內容`}</p>
        <div className="search-results">{results.map((item, index) => <Link to={item.to} key={`${item.to}-${index}`}><span className="tag">{item.type}</span><div><h2>{item.title}</h2><p>{item.text}</p></div><ArrowUpRight /></Link>)}{results.length === 0 && <div className="empty-state"><Search /><h2>沒有找到相符內容</h2><p>試試較短的關鍵字，或瀏覽活動與刊物。</p></div>}</div>
      </div></section>
    </>
  )
}

function ArticlePage() {
  const { slug } = useParams()
  const notice = notices.find((item) => item.slug === slug)
  const article = articles.find((item) => item.slug === slug)
  const item = notice ? { title: notice.title, date: notice.date, category: notice.group, author: '中華基督神修小會', content: notice.content } : article
  if (!item) return <NotFound />
  return (
    <article className="article-page">
      <header><div className="shell article-header"><Link to={notice ? '/activities' : '/culture'}>← 返回{notice ? '活動消息' : '文章列表'}</Link><span className="tag">{item.category}</span><h1>{item.title}</h1><div><time>{item.date}</time><span>{item.author}</span></div></div></header>
      <div className="shell article-body"><aside><SacredMark compact /><span>在基督的愛內<br />共同成長</span></aside><div className="prose">{item.content.map((paragraph, index) => index === 0 && article?.category === '默觀月訊' ? <blockquote key={paragraph}>{paragraph}</blockquote> : <p key={paragraph}>{paragraph}</p>)}<hr /><p className="source-note">本頁為舊官網公開內容的新版摘要。歷史資料與活動細節以小會正式公告為準。</p></div></div>
    </article>
  )
}

function NotFound() {
  return <section className="not-found"><SacredMark /><span className="eyebrow">404</span><h1>這一頁暫時找不到</h1><p>也許內容正在整理，或網址已經更新。</p><Link className="button button--primary" to="/">回到首頁 <ArrowRight size={17} /></Link></section>
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/groups/:slug" element={<GroupPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/prayer" element={<PrayerPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
