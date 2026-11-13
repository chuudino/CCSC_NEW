import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { publications } from './data/site'
import index from './data/seed/index.json'

type SeedEntry = {
  id: number
  title: string
  sourceUrl: string
  author?: string
  publisher?: string
  publisherUrl?: string
  summary?: string
  relatedLinks?: { label: string; url: string }[]
}
type Edition = keyof typeof index
type ArticleBodies = Record<string, string>

const editions: Record<Edition, SeedEntry[]> = index
const loadBodies: Record<Edition, () => Promise<{ default: ArticleBodies }>> = {
  71: () => import('./data/seed/71.json'),
  72: () => import('./data/seed/72.json'),
  73: () => import('./data/seed/73.json'),
}

export const seedIssuePath = (slug: string) => '/publications/seed/' + slug.replace(/^seed-/, '')
const entryPath = (issue: string, id: number) => '/publications/seed/' + issue + '/' + id
export const seedSearchEntries = Object.entries(editions).flatMap(([issue, entries]) =>
  entries.map(entry => ({
    title: entry.title,
    text: ['《芥子》第 ' + issue + ' 期', entry.author, entry.publisher, entry.summary].filter(Boolean).join(' · '),
    to: entryPath(issue, entry.id),
    type: '芥子',
  })),
)

function OriginalLink({ url, label }: { url: string; label: string }) {
  return <a className="text-link official-source" href={url} target="_blank" rel="noreferrer">{label} <ExternalLink size={15} aria-hidden="true" /></a>
}

function EntryBody({ issue, entry }: { issue: Edition; entry: SeedEntry }) {
  const [body, setBody] = useState<string>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (entry.summary) return
    let active = true
    loadBodies[issue]().then(({ default: articles }) => {
      if (!active) return
      const content = articles[String(entry.id)]
      if (content) setBody(content)
      else setFailed(true)
    }).catch(() => {
      if (active) setFailed(true)
    })
    return () => { active = false }
  }, [issue, entry.id, entry.summary])

  if (entry.summary) return <><h2>文章摘要</h2><p>{entry.summary}</p></>
  if (failed) return <p role="alert">文章暫時無法載入，請使用下方原官網連結閱讀。</p>
  if (!body) return <p role="status">正在載入文章…</p>
  // Stored snapshots include only allowlisted HTML and public source URLs.
  return <div className="seed-body" dangerouslySetInnerHTML={{ __html: body }} />
}

export default function SeedPublication() {
  const { issue, articleId } = useParams()
  const publication = publications.find(item => item.series === '芥子' && item.slug === 'seed-' + issue)
  const articles = issue && Object.hasOwn(editions, issue) ? editions[issue as Edition] : undefined
  const entry = articleId ? articles?.find(item => String(item.id) === articleId) : undefined

  if (!issue || !publication || !articles || (articleId && !entry)) {
    return <section className="not-found"><h1>找不到這一期或文章</h1><Link className="text-link" to="/publications">返回小會刊物</Link></section>
  }

  const issueName = '《芥子》' + publication.issue
  if (!entry) {
    return <article className="article-page">
      <header><div className="shell article-header">
        <Link to="/publications"><ArrowLeft size={14} aria-hidden="true" /> 返回小會刊物</Link>
        <h1>{issueName}</h1>
        <div><time dateTime={publication.date}>{publication.date}</time><span>共 {articles.length} 篇</span></div>
      </div></header>
      <section className="shell seed-contents">
        <nav aria-labelledby="seed-contents-heading">
          <h2 id="seed-contents-heading">本期目錄</h2>
          <ul>
            {articles.map(item => <li key={item.id}>
              <Link to={entryPath(issue, item.id)}>
                <span>{item.title}{(item.author || item.publisher) && <small>{item.author || item.publisher}</small>}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </li>)}
          </ul>
        </nav>
        {publication.sourceUrl && <OriginalLink url={publication.sourceUrl} label="查看原官網本期目錄" />}
      </section>
    </article>
  }

  return <article className="article-page">
    <header><div className="shell article-header">
      <Link to={seedIssuePath(publication.slug)}><ArrowLeft size={14} aria-hidden="true" /> 返回{issueName}目錄</Link>
      <span className="tag">{issueName}</span>
      <h1>{entry.title}</h1>
      {entry.author && <div>{entry.author}</div>}
    </div></header>
    <div className="shell prose seed-reading">
      {entry.publisher && <p>刊載來源：{entry.publisher}</p>}
      <EntryBody key={entry.id} issue={issue as Edition} entry={entry} />
      <div className="source-links">
        <OriginalLink url={entry.sourceUrl} label={entry.summary ? '在原官網閱讀全文' : '查看原官網文章'} />
        {entry.publisherUrl && <OriginalLink url={entry.publisherUrl} label="前往刊載來源" />}
        {entry.relatedLinks?.map(link => <OriginalLink key={link.url} url={link.url} label={link.label} />)}
      </div>
    </div>
  </article>
}
