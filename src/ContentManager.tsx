import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { groups, recurringEvents } from './data/site'

export type Kind = 'upcoming' | 'record' | 'plan'
type Draft = { kind: Kind; groupIds: string[]; title: string; date: string; endDate: string; location: string; body: string }
type Item = { id: string; draft: Draft; published?: Draft; version: number; approvedVersion?: number }
type State = { revision: number; items: Item[] }
const labels = { upcoming: '將到來的活動', record: '活動記錄', plan: '年度活動計劃' }
const paths = { upcoming: '/activities', record: '/records', plan: '/calendar' }
const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei' }).format(new Date())
const empty = (kind: Kind, group = 'all'): Draft => ({ kind, groupIds: groups.some(x => x.slug === group) ? [group] : [], title: '', date: '', endDate: '', location: '', body: '' })
const groupNames = (ids: string[] = []) => ids.length ? ids.map(id => groups.find(x => x.slug === id)?.name ?? id).join('、') : '所屬單位待確認'
const inGroup = (ids: string[] = [], group: string) => group === 'all' || (group === 'unassigned' ? !ids.length : ids.includes(group))

function GroupFilter({ value, onChange, unassigned = false, disabled = false }: { value: string; onChange: (value: string) => void; unassigned?: boolean; disabled?: boolean }) {
  return <label>篩選單位
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
      <option value="all">全部</option>
      {groups.map(x => <option key={x.slug} value={x.slug}>{x.name}</option>)}
      {unassigned && <option value="unassigned">所屬單位待確認</option>}
    </select>
  </label>
}

function ContentTabs({ group }: { group: string }) {
  const query = group === 'all' ? '' : `?group=${encodeURIComponent(group)}`
  return <nav className="content-tabs" aria-label="活動內容分類">
    {(Object.keys(labels) as Kind[]).map(kind => <Link key={kind} to={paths[kind] + query}>{labels[kind]}</Link>)}
  </nav>
}

export function ManagedPage({ kind, compact = false }: { kind: Kind; compact?: boolean }) {
  const [items, setItems] = useState<(Draft & { id: string })[]>([])
  const [error, setError] = useState(''), [loaded, setLoaded] = useState(false)
  const [params, setParams] = useSearchParams()
  const requestedGroup = params.get('group') || 'all'
  const group = compact || !['all', 'unassigned', ...groups.map(x => x.slug)].includes(requestedGroup) ? 'all' : requestedGroup
  const year = params.get('year') || today().slice(0, 4)
  const filter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key); else next.set(key, value)
    setParams(next)
  }
  useEffect(() => {
    fetch('/api/content').then(async r => {
      if (!r.ok) throw Error('資料暫時無法載入，請稍後重試')
      return r.json()
    }).then(d => { setItems(d.items); setLoaded(true) }).catch(e => { setError(e.message); setLoaded(true) })
  }, [])
  const rows = items.filter(x => x.kind === kind && inGroup(x.groupIds, group) && (kind === 'upcoming' ? (x.endDate || x.date) >= today() : kind === 'record' ? x.date <= today() : x.date.startsWith(year)))
    .sort((a, b) => kind === 'record' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))
  const visible = compact ? rows.slice(0, 3) : rows
  const recurring = kind === 'plan' ? recurringEvents.filter(x => inGroup([x.group], group)) : []
  return <section className="section section--paper"><div className="shell">
    <span className="eyebrow">{kind === 'plan' ? '全年規劃' : '小會偕行'}</span>
    <h1>{labels[kind]}</h1>
    <p>{kind === 'plan' ? '年度活動計劃獨立管理，計劃不等於已公告或已舉行的活動。' : kind === 'record' ? '已發生並經核定的活動記錄，依活動日期由新到舊排列。' : '已核定的活動訊息，依活動日期由近到遠排列；活動結束後不會自動轉成活動記錄。'}</p>
    <ContentTabs group={group} />
    <p><Link to="/announcements">原官網公告摘要</Link></p>
    {!compact && <div className="content-filters">
      <GroupFilter value={group} onChange={value => filter('group', value)} unassigned={group === 'unassigned' || items.some(x => x.kind === kind && !x.groupIds?.length)} />
      {kind === 'plan' && <label>年度<select value={year} onChange={e => filter('year', e.target.value)}>
        {Array.from(new Set([today().slice(0, 4), year, ...items.filter(x => x.kind === 'plan').map(x => x.date.slice(0, 4))])).sort().map(y => <option key={y}>{y}</option>)}
      </select></label>}
    </div>}
    {recurring.map(x => <article className="recurring-card" key={x.id}>
      <span className="tag">{groupNames([x.group])}</span><h2>{x.title}（固定安排）</h2>
      <p>{x.schedule}</p><p>{x.hosts.join('、')}</p>
      <a href={x.sourceUrl} target="_blank" rel="noreferrer">查看原官網安排</a>
    </article>)}
    {error && <p role="alert">{error}</p>}{!loaded && <p role="status">載入中…</p>}
    <div className="managed-grid">{visible.map(x => <article key={x.id}>
      <div className="content-tags"><span className="tag">{labels[x.kind]}</span><span className="tag">{groupNames(x.groupIds)}</span></div>
      <h2>{x.title}</h2><p><time>{x.date}</time>{x.endDate && ' 至 ' + x.endDate}</p>
      {x.location && <p>地點：{x.location}</p>}<p className="content-body">{x.body}</p>
    </article>)}</div>
    {loaded && !error && !rows.length && <p role="status">目前所選條件下尚無已核定發佈的{labels[kind]}{recurring.length ? '；固定安排如上。' : '。'}</p>}
    {compact && <Link to="/activities">查看所有活動 →</Link>}
  </div></section>
}

export default function ContentManager() {
  const [state, setState] = useState<State | null>(null), [kind, setKind] = useState<Kind>('upcoming')
  const [group, setGroup] = useState('all'), [draft, setDraft] = useState<Draft>(empty('upcoming'))
  const [id, setId] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [dirty, setDirty] = useState(false)
  const load = async () => {
    setBusy(true)
    try {
      const r = await fetch('/api/content/admin'), d = await r.json()
      if (!r.ok) throw Error(d.error)
      setState(d); setDirty(false); setId(''); setDraft(empty(kind, group)); setMessage('已載入最新內容')
    } catch (e) { setMessage((e as Error).message) } finally { setBusy(false) }
  }
  useEffect(() => { void load() }, [])
  const action = async (name: string) => {
    if (!state) return
    if (name === 'approve' && !confirm('核定後將更新公開頁面，確定發佈這份已儲存的草稿？')) return
    if (name === 'unpublish' && !confirm('確定將這筆內容從公開頁面下架？草稿仍會保留。')) return
    setBusy(true)
    try {
      const r = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: name, id, draft, revision: state.revision }) }), d = await r.json()
      if (!r.ok) throw Error(d.error)
      setState(d)
      if (!id) { const item = d.items.at(-1); setId(item.id); setDraft(item.draft) }
      setDirty(false); setMessage(name === 'save' ? '草稿已儲存，尚未發佈' : name === 'approve' ? '已核定並發佈' : '已下架，草稿已保留')
    } catch (e) { setMessage((e as Error).message) } finally { setBusy(false) }
  }
  const canLeave = () => !dirty || confirm('尚有未儲存變更，確定放棄？')
  const switchTo = (next: Kind, item?: Item) => {
    if (!canLeave()) return
    setKind(next); setId(item?.id || ''); setDraft(item ? { ...item.draft, groupIds: item.draft.groupIds || [] } : empty(next, group)); setDirty(false); setMessage('')
  }
  const switchGroup = (next: string) => {
    if (!canLeave()) return
    setGroup(next); setId(''); setDraft(empty(kind, next)); setDirty(false); setMessage('')
  }
  const update = (key: keyof Draft, value: string | string[]) => { setDraft({ ...draft, [key]: value }); setDirty(true) }
  const selected = state?.items.find(x => x.id === id)
  const rows = state?.items.filter(x => x.draft.kind === kind && inGroup(x.draft.groupIds, group)).sort((a, b) => kind === 'record' ? b.draft.date.localeCompare(a.draft.date) : a.draft.date.localeCompare(b.draft.date)) || []
  return <section className="section"><div className="shell">
    <h1>內容管理與核定</h1>
    {state && <p><a href="/signout-with-chatgpt?return_to=%2Fadmin" target="_top">登出管理帳號</a></p>}
    {import.meta.env.DEV && <p role="note">開發預覽：此處為測試資料，不會更動正式網站。</p>}
    <p>新增／編輯 → 儲存草稿 → 核定發佈。修改已發佈內容時，舊版維持公開，直到新稿核定。</p>
    <p role="status" aria-live="polite">{message}</p>
    {!state ? <a target="_top" href="/signin-with-chatgpt?return_to=%2Fadmin">使用網站管理者帳號登入</a> : <>
      <div className="content-tabs">{(Object.keys(labels) as Kind[]).map(k => <button key={k} disabled={busy} aria-pressed={kind === k} onClick={() => switchTo(k)}>{labels[k]}</button>)}
        <button disabled={busy} onClick={() => { if (canLeave()) void load() }}>重新載入</button>
      </div>
      <div className="content-filters"><GroupFilter value={group} onChange={switchGroup} disabled={busy} unassigned /></div>
      <div className="editor-layout"><aside aria-label="內容清單">
        <button disabled={busy} onClick={() => switchTo(kind)}>＋ 新增{labels[kind]}</button>
        {!rows.length && <p>所選單位尚無{labels[kind]}。</p>}
        {rows.map(x => <button key={x.id} disabled={busy} aria-pressed={id === x.id} onClick={() => switchTo(kind, x)}>
          <strong>{x.draft.title}</strong><small>{groupNames(x.draft.groupIds)}</small>
          <small>{x.draft.date}・{!x.published ? '草稿' : x.version === x.approvedVersion ? '已發佈' : '待重新核定'}</small>
        </button>)}
      </aside><form onSubmit={e => { e.preventDefault(); void action('save') }}>
        <h2>{id ? '編輯' : '新增'}{labels[kind]}</h2>
        {selected?.published && <p>公開版本日期：{selected.published.date}；所屬單位：{groupNames(selected.published.groupIds)}。新修改須重新核定。</p>}
        <fieldset className="group-choices" disabled={busy}>
          <legend>所屬單位（至少選一個，可複選）</legend>
          {groups.map(x => <label key={x.slug}><input type="checkbox" checked={draft.groupIds.includes(x.slug)} onChange={e => update('groupIds', e.target.checked ? [...draft.groupIds, x.slug] : draft.groupIds.filter(value => value !== x.slug))} />{x.name}</label>)}
          {!draft.groupIds.length && <p>請勾選總會或分會；共同活動可選多個單位。</p>}
        </fieldset>
        <label>活動標題<input required maxLength={180} value={draft.title} onChange={e => update('title', e.target.value)} /></label>
        <label>{kind === 'plan' ? '計劃日期' : '活動日期'}<input required type="date" value={draft.date} onChange={e => update('date', e.target.value)} /></label>
        <label>結束日期（選填）<input type="date" min={draft.date} value={draft.endDate} onChange={e => update('endDate', e.target.value)} /></label>
        <label>地點<input maxLength={300} value={draft.location} onChange={e => update('location', e.target.value)} /></label>
        <label>內容說明<textarea rows={8} maxLength={20000} value={draft.body} onChange={e => update('body', e.target.value)} /></label>
        <div className="content-tabs"><button disabled={busy || !draft.groupIds.length} type="submit">儲存草稿</button>
          <button disabled={busy || !id || dirty || !draft.groupIds.length} type="button" onClick={() => void action('approve')}>核定並發佈</button>
          <button disabled={busy || !selected?.published || dirty} type="button" onClick={() => void action('unpublish')}>下架</button>
        </div>{dirty && <p>請先儲存草稿，再核定發佈。</p>}
      </form></div>
    </>}
  </div></section>
}
