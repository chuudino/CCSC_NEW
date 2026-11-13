import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { activityCategories, groups, recurringEvents } from './data/site'

export type Kind = 'upcoming' | 'record' | 'plan' | 'notice'
type Precision = 'day' | 'month' | 'year' | 'unknown'
type Attachment = { label: string; url: string; kind: 'pdf' | 'file'; previewUrl?: string }
type Draft = { kind: Kind; groupIds: string[]; title: string; date: string; endDate: string; location: string; body: string; category?: string; datePrecision?: Precision; dateNote?: string; publishedDate?: string; legacySlugs?: string[]; sourceKeys?: string[]; sourceUrl?: string; links?: { label: string; url: string }[]; attachments?: Attachment[] }
type Item = { id: string; draft: Draft; published?: Draft; version: number; approvedVersion?: number }
type State = { revision: number; items: Item[] }
export type PublishedContent = Draft & { id: string }
const labels = { upcoming: '將到來的活動', record: '活動記錄', plan: '年度活動計劃', notice: '公告與會務' }
const paths = { upcoming: '/activities', record: '/records', plan: '/calendar', notice: '/activity-notices' }
const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei' }).format(new Date())
const empty = (kind: Kind, group = 'all'): Draft => ({ kind, groupIds: groups.some(x => x.slug === group) ? [group] : [], title: '', date: '', endDate: '', location: '', body: '', category: 'other', datePrecision: kind === 'notice' ? 'unknown' : 'day' })
const groupNames = (ids: string[] = []) => ids.length ? ids.map(id => groups.find(x => x.slug === id)?.name ?? id).join('、') : '所屬單位待確認'
const inGroup = (ids: string[] = [], group: string) => group === 'all' || (group === 'unassigned' ? !ids.length : ids.includes(group))
export const activityPath = (item: PublishedContent) => item.legacySlugs?.length ? `/article/${encodeURIComponent(item.legacySlugs[0])}` : `/activity/${encodeURIComponent(item.id)}`
export const activityLabel = (kind: Kind) => labels[kind]
const categoryName = (id = 'other') => activityCategories.find(x => x.id === id)?.name || '其他活動'
const contentDate = (item: Draft) => item.date ? (item.datePrecision === 'month' ? item.date + '（月份）' : item.datePrecision === 'year' ? item.date + ' 年' : item.date) + (item.endDate ? ' 至 ' + item.endDate : '') : '活動日期未載'
const sortDate = (item: Draft) => item.date || item.publishedDate || ''
const attachmentLimit = 10

export function usePublishedContent() {
  const [items, setItems] = useState<PublishedContent[]>([])
  const [error, setError] = useState(''), [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let active = true
    fetch('/api/content').then(async r => {
      if (!r.ok) throw Error('資料暫時無法載入，請稍後重試')
      return r.json()
    }).then(d => { if (active) { setItems(d.items); setLoaded(true) } }).catch(e => { if (active) { setError(e.message); setLoaded(true) } })
    return () => { active = false }
  }, [])
  return { items, error, loaded }
}

function GroupFilter({ value, onChange, unassigned = false, disabled = false }: { value: string; onChange: (value: string) => void; unassigned?: boolean; disabled?: boolean }) {
  return <label>篩選單位<select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
    <option value="all">全部</option>{groups.map(x => <option key={x.slug} value={x.slug}>{x.name}</option>)}
    {unassigned && <option value="unassigned">所屬單位待確認</option>}
  </select></label>
}
function CategoryFilter({ value, onChange, disabled = false }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return <label>篩選主題<select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
    <option value="all">全部主題</option>{activityCategories.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
  </select></label>
}
function ContentTabs({ current, group, category }: { current: Kind; group: string; category: string }) {
  const params = new URLSearchParams()
  if (group !== 'all') params.set('group', group)
  if (category !== 'all') params.set('category', category)
  const query = params.size ? '?' + params.toString() : ''
  return <nav className="content-tabs" aria-label="活動內容分類">{(Object.keys(labels) as Kind[]).map(kind => <Link key={kind} to={paths[kind] + query} aria-current={kind === current ? 'page' : undefined}>{labels[kind]}</Link>)}</nav>
}

export function ManagedPage({ kind, compact = false, groupId }: { kind: Kind; compact?: boolean; groupId?: string }) {
  const { items, error, loaded } = usePublishedContent()
  const [params, setParams] = useSearchParams()
  const requestedGroup = groupId || params.get('group') || 'all'
  const group = !['all', 'unassigned', ...groups.map(x => x.slug)].includes(requestedGroup) ? 'all' : requestedGroup
  const requestedCategory = params.get('category') || 'all'
  const category = compact || !['all', ...activityCategories.map(x => x.id)].includes(requestedCategory) ? 'all' : requestedCategory
  const currentDate = today()
  const currentDay = Date.parse(currentDate)
  const year = params.get('year') || currentDate.slice(0, 4)
  const startDistance = (date: string) => {
    const startDay = Date.parse(date)
    return Number.isNaN(startDay) ? Infinity : Math.abs(startDay - currentDay)
  }
  const filter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key); else next.set(key, value)
    setParams(next)
  }
  const rows = items.filter(x => x.kind === kind && inGroup(x.groupIds, group) && (category === 'all' || (x.category || 'other') === category) && (kind === 'upcoming' ? (x.endDate || x.date) >= currentDate : kind === 'record' ? !x.date || x.date <= currentDate.slice(0, x.date.length) : kind === 'plan' ? x.date.startsWith(year) : true))
    .sort((a, b) => {
      if (kind === 'upcoming') {
        return startDistance(a.date) - startDistance(b.date) || b.date.localeCompare(a.date)
      }
      return ['record', 'notice'].includes(kind) ? sortDate(b).localeCompare(sortDate(a)) : sortDate(a).localeCompare(sortDate(b))
    })
  const visible = compact ? rows.slice(0, 3) : rows
  const recurring = kind === 'plan' && category === 'all' ? recurringEvents.filter(x => inGroup([x.group], group)) : []
  const Heading = compact ? 'h2' : 'h1'
  const query = group === 'all' ? '' : `?group=${encodeURIComponent(group)}`
  return <section className="section section--paper"><div className="shell">
    <span className="eyebrow">{kind === 'plan' ? '全年規劃' : '小會偕行'}</span><Heading>{labels[kind]}</Heading>
    {!compact && <><p>{kind === 'plan' ? '年度活動計劃獨立管理，計劃不等於已公告或已舉行的活動。' : kind === 'record' ? '保存相聚、學習與服務的足跡；只載明月份或年份的資料，依原有資訊呈現。' : kind === 'notice' ? '甄選、會議通知與會務分享；發文日期與活動日期分別記錄，歷年公告一併保存。' : '已核定且尚未結束的活動，依開始日期距今天的遠近排列。'}</p>
      <ContentTabs current={kind} group={group} category={category} /><div className="content-filters">
        <GroupFilter value={group} onChange={value => filter('group', value)} unassigned={group === 'unassigned' || items.some(x => x.kind === kind && !x.groupIds?.length)} />
        <CategoryFilter value={category} onChange={value => filter('category', value)} />
        {kind === 'plan' && <label>年度<select value={year} onChange={e => filter('year', e.target.value)}>{Array.from(new Set([currentDate.slice(0, 4), year, ...items.filter(x => x.kind === 'plan').map(x => x.date.slice(0, 4))])).sort().map(y => <option key={y}>{y}</option>)}</select></label>}
      </div></>}
    {recurring.map(x => <article className="recurring-card" key={x.id}><span className="tag">{groupNames([x.group])}</span><h2>{x.title}（固定安排）</h2><p>{x.schedule}</p><p>{x.hosts.join('、')}</p><a href={x.sourceUrl} target="_blank" rel="noreferrer">查看原官網安排</a></article>)}
    {error && <p role="alert">{error}</p>}
    <p className={!compact ? 'result-count' : undefined} role="status" hidden={compact && loaded && Boolean(error || rows.length)}>
      {!loaded ? '載入中…' : !error && !rows.length ? `目前所選條件下尚無已核定發佈的${labels[kind]}${recurring.length ? '，固定安排如上。' : '。'}` : !compact && !error ? `共 ${rows.length} 筆${labels[kind]}` : ''}
    </p>
    <div className="managed-grid">{visible.map(x => <article key={x.id}>
      <div className="content-tags"><span className="tag">{categoryName(x.category)}</span><span className="tag">{groupNames(x.groupIds)}</span></div>
      <h2><Link to={activityPath(x)}>{x.title}</Link></h2><p>{contentDate(x)}</p>
      {x.publishedDate && <p className="source-note">原始發文日期：{x.publishedDate}</p>}
      {x.location && <p>地點：{x.location}</p>}<p className="activity-excerpt">{x.body}</p>
      <Link className="text-link" to={activityPath(x)}>閱讀內容 →</Link>
    </article>)}</div>
    {compact && <Link className="text-link" to={paths[kind] + query}>查看全部{labels[kind]} →</Link>}
  </div></section>
}

export function ManagedArticle({ legacySlug }: { legacySlug?: string }) {
  const { id } = useParams()
  const { items, loaded, error } = usePublishedContent()
  const item = items.find(x => legacySlug ? x.legacySlugs?.includes(legacySlug) : x.id === id)
  if (error) return <section className="section shell"><p role="alert">{error}</p></section>
  if (!loaded) return <section className="section shell"><p role="status">載入中…</p></section>
  if (!item) return <section className="section shell"><h1>這筆內容尚未公開或已下架</h1><Link to="/activities">返回活動區域</Link></section>
  return <article className="article-page"><header><div className="shell article-header"><Link to={paths[item.kind]}>← 返回{labels[item.kind]}</Link>
    <div className="content-tags"><span className="tag">{categoryName(item.category)}</span><span className="tag">{groupNames(item.groupIds)}</span></div><h1>{item.title}</h1>
    <p>活動日期：{contentDate(item)}</p>{item.publishedDate && <p>原始發文日期：{item.publishedDate}</p>}{item.dateNote && <p>{item.dateNote}</p>}{item.location && <p>地點：{item.location}</p>}
  </div></header><div className="shell activity-detail"><div className="content-body">{item.body}</div>
    {!!item.attachments?.length && <section className="activity-attachments" aria-label="附件">
      <h2>附件</h2>
      {item.attachments.map((attachment, index) => (
        <div key={index}>
          <a className="text-link" href={attachment.url} target="_blank" rel="noreferrer">{attachment.label}（新分頁） ↗</a>
          {attachment.previewUrl && <iframe className="activity-attachments__preview" src={attachment.previewUrl}
            title={`${attachment.label} PDF 預覽`} loading="lazy" referrerPolicy="no-referrer" />}
        </div>
      ))}
    </section>}
    {!!item.links?.length && <div className="source-links">{item.links.map(x => <p key={x.url}><a className="text-link" href={x.url} target="_blank" rel="noreferrer">{x.label} ↗</a></p>)}</div>}
    {item.sourceUrl && <p className="source-note"><a href={item.sourceUrl} target="_blank" rel="noreferrer">資料來源與原始影像 ↗</a></p>}
  </div></article>
}

type EditorError = { message: string; field?: string }

export default function ContentManager() {
  const [state, setState] = useState<State | null>(null), [kind, setKind] = useState<Kind>('upcoming')
  const [group, setGroup] = useState('all'), [category, setCategory] = useState('all'), [query, setQuery] = useState('')
  const [draft, setDraft] = useState<Draft>(empty('upcoming'))
  const [id, setId] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<EditorError[]>([])
  const errorSummary = useRef<HTMLElement>(null)
  const shouldFocusErrors = useRef(false)
  useEffect(() => {
    if (errors.length && shouldFocusErrors.current) {
      shouldFocusErrors.current = false
      errorSummary.current?.focus()
    }
  }, [errors])

  const reportErrors = (issues: EditorError[]) => {
    shouldFocusErrors.current = true
    setErrors(issues)
  }

  const fieldError = (field: string) => errors.find(error => error.field === field)?.message
  const fieldProps = (field: string, hint?: string) => {
    const invalid = Boolean(fieldError(field))
    return {
      id: field,
      'aria-invalid': invalid || undefined,
      'aria-describedby': [hint, invalid && `${field}-error`].filter(Boolean).join(' ') || undefined,
    }
  }
  const fieldFeedback = (field: string) => {
    const error = fieldError(field)
    return error && <small className="editor-field-error" id={`${field}-error`}>{error}</small>
  }

  const load = async () => {
    setErrors([])
    setBusy(true)
    try {
      const r = await fetch('/api/content/admin'), d = await r.json()
      if (!r.ok) throw Error(d.error)
      setState(d); setDirty(false); setId(''); setDraft(empty(kind, group)); setMessage('已載入最新內容')
    } catch (e) { reportErrors([{ message: (e as Error).message }]) } finally { setBusy(false) }
  }
  useEffect(() => { void load() }, [])
  const action = async (name: string) => {
    if (!state) return
    if (name === 'approve' && !confirm('核定後將更新公開頁面，確定發佈這份已儲存的草稿？')) return
    if (name === 'unpublish' && !confirm('確定將這筆內容從公開頁面下架？草稿仍會保留。')) return
    setErrors([])
    setMessage('')
    setBusy(true)
    try {
      const r = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: name, id, draft, revision: state.revision }) }), d = await r.json()
      if (!r.ok) {
        reportErrors([{ message: d.error || '暫時無法完成操作，請再試一次。', field: d.field }])
        return
      }
      setState(d)
      if (!id) { const item = d.items.at(-1); setId(item.id); setDraft(item.draft) }
      setDirty(false); setMessage(name === 'save' ? '草稿已儲存，尚未發佈' : name === 'approve' ? '已核定並發佈' : '已下架，草稿已保留')
    } catch (e) { reportErrors([{ message: (e as Error).message }]) } finally { setBusy(false) }
  }
  const canLeave = () => !dirty || confirm('尚有未儲存變更，確定放棄？')
  const switchTo = (next: Kind, item?: Item) => {
    if (!canLeave()) return
    setKind(next); setId(item?.id || ''); setDraft(item ? { ...item.draft, groupIds: item.draft.groupIds || [] } : empty(next, group)); setDirty(false); setMessage(''); setErrors([])
  }
  const changeFilter = (setter: (value: string) => void, value: string) => {
    if (!canLeave()) return
    setter(value); setId(''); setDraft(empty(kind, setter === setGroup ? value : group)); setDirty(false); setMessage(''); setErrors([])
  }
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => { setDraft(current => ({ ...current, [key]: value })); setDirty(true) }
  const attachments = draft.attachments ?? []
  const updateAttachment = (index: number, changes: Partial<Attachment>) => {
    update('attachments', attachments.map((attachment, position) => position === index ? { ...attachment, ...changes } : attachment))
  }
  const selected = state?.items.find(x => x.id === id)
  const rows = state?.items.filter(x => x.draft.kind === kind && inGroup(x.draft.groupIds, group) && (category === 'all' || (x.draft.category || 'other') === category) && `${x.draft.title} ${x.draft.body}`.includes(query.trim())).sort((a, b) => ['record', 'notice'].includes(kind) ? sortDate(b.draft).localeCompare(sortDate(a.draft)) : sortDate(a.draft).localeCompare(sortDate(b.draft))) || []
  const precision = draft.datePrecision || 'day'

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const invalid = [...event.currentTarget.querySelectorAll<HTMLInputElement>('input:invalid')]
    const issues: EditorError[] = invalid.map(input => ({
      field: input.id,
      message: input.id === 'editor-date' && input.validity.patternMismatch
        ? precision === 'month' ? '請使用西元年與兩位數月份，例如 2026-03。' : '請輸入四位數西元年，例如 2026。'
        : `${input.labels?.[0]?.firstChild?.textContent?.trim() || '此欄位'}：${input.validationMessage}`,
    }))
    if (!draft.groupIds.length) issues.unshift({ field: 'editor-group', message: '請至少選擇一個所屬單位。' })
    if (!issues.length) {
      void action('save')
      return
    }
    setMessage('')
    reportErrors(issues)
  }

  return <section className="section"><div className="shell">
    <h1>內容管理與核定</h1>{state && <p><a href="/signout-with-chatgpt?return_to=%2Fadmin" target="_top">登出管理帳號</a></p>}
    {import.meta.env.DEV && <p role="note">開發預覽：此處為測試資料，不會更動正式網站。</p>}
    <p>新增／編輯 → 儲存草稿 → 核定發佈。修改已發佈內容時，舊版維持公開，直到新稿核定。</p><p role="status" aria-live="polite">{message}</p>
    {!!errors.length && <section className="editor-errors" ref={errorSummary} tabIndex={-1} aria-labelledby="editor-error-title">
      <h2 id="editor-error-title">請確認以下問題</h2>
      <ul>{errors.map(({ field, message: error }) => <li key={field ?? error}>{field ? <a href={`#${field}`} onClick={(event) => {
        const control = document.getElementById(field)
        if (control) {
          event.preventDefault()
          control.focus()
        }
      }}>{error}</a> : error}</li>)}</ul>
    </section>}
    {!state ? <a target="_top" href="/signin-with-chatgpt?return_to=%2Fadmin">使用網站管理者帳號登入</a> : <>
      <div className="content-tabs">{(Object.keys(labels) as Kind[]).map(k => <button key={k} disabled={busy} aria-pressed={kind === k} onClick={() => switchTo(k)}>{labels[k]}</button>)}<button disabled={busy} onClick={() => { if (canLeave()) void load() }}>重新載入</button></div>
      <div className="content-filters"><GroupFilter value={group} onChange={v => changeFilter(setGroup, v)} disabled={busy} unassigned /><CategoryFilter value={category} onChange={v => changeFilter(setCategory, v)} disabled={busy} /><label>搜尋內容<input value={query} onChange={e => setQuery(e.target.value)} placeholder="標題或內容關鍵字" /></label></div>
      <p>共 {rows.length} 筆{labels[kind]}</p><div className="editor-layout"><aside aria-label="內容清單">
        <button disabled={busy} onClick={() => switchTo(kind)}>＋ 新增{labels[kind]}</button>{!rows.length && <p>所選條件尚無{labels[kind]}。</p>}
        {rows.map(x => <button key={x.id} disabled={busy} aria-pressed={id === x.id} onClick={() => switchTo(kind, x)}><strong>{x.draft.title}</strong><small>{categoryName(x.draft.category)}・{groupNames(x.draft.groupIds)}</small><small>{contentDate(x.draft)}・{!x.published ? '草稿' : x.version === x.approvedVersion ? '已發佈' : '待重新核定'}</small></button>)}
      </aside><form noValidate onSubmit={save} onChange={(event) => {
        const control = event.target as HTMLElement
        const field = control.closest('.group-choices') ? 'editor-group' : control.id
        if (field && fieldError(field)) setErrors(current => current.filter(error => error.field !== field))
      }}>
        <h2>{id ? '編輯' : '新增'}{labels[draft.kind]}</h2>{selected?.published && <p>公開版本日期：{contentDate(selected.published)}；所屬單位：{groupNames(selected.published.groupIds)}。新修改須重新核定。</p>}
        <label>內容類別<select {...fieldProps('editor-kind')} value={draft.kind} onChange={e => { const next = e.target.value as Kind; setDraft({ ...draft, kind: next, ...(['upcoming', 'plan'].includes(next) && precision !== 'day' ? { datePrecision: 'day', date: '', endDate: '' } : {}) }); setDirty(true); setErrors([]) }}>{(Object.keys(labels) as Kind[]).map(k => <option key={k} value={k}>{labels[k]}</option>)}</select>{fieldFeedback('editor-kind')}</label>
        <label>活動主題<select {...fieldProps('editor-category')} value={draft.category || 'other'} onChange={e => update('category', e.target.value)}>{activityCategories.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select>{fieldFeedback('editor-category')}</label>
        <fieldset className="group-choices" disabled={busy}><legend>所屬單位（至少選一個，可複選）</legend>{groups.map((x, index) => <label key={x.slug}><input {...(index === 0 ? fieldProps('editor-group') : {})} type="checkbox" checked={draft.groupIds.includes(x.slug)} onChange={e => update('groupIds', e.target.checked ? [...draft.groupIds, x.slug] : draft.groupIds.filter(value => value !== x.slug))} />{x.name}</label>)}{fieldFeedback('editor-group')}{!draft.groupIds.length && !fieldError('editor-group') && <p>請勾選總會或分會。共同活動可選多個單位。</p>}</fieldset>
        <label>活動標題<input {...fieldProps('editor-title')} required maxLength={180} value={draft.title} onChange={e => update('title', e.target.value)} />{fieldFeedback('editor-title')}</label>
        {['record', 'notice'].includes(draft.kind) && <label>日期精確度<select {...fieldProps('editor-precision')} value={precision} onChange={e => { setDraft({ ...draft, datePrecision: e.target.value as Precision, date: '', endDate: '' }); setDirty(true); setErrors([]) }}><option value="day">完整日期</option><option value="month">僅知月份</option><option value="year">僅知年份</option><option value="unknown">未載活動日期</option></select>{fieldFeedback('editor-precision')}</label>}
        {precision !== 'unknown' && <label>{draft.kind === 'plan' ? '計劃日期' : '活動日期'}
          {precision !== 'day' && <small id="editor-date-hint">{precision === 'month' ? '請輸入西元年與兩位數月份，例如 2026-03。' : '請輸入四位數西元年，例如 2026。'}</small>}
          <input {...fieldProps('editor-date', precision === 'day' ? undefined : 'editor-date-hint')} required type={precision === 'day' ? 'date' : 'text'} inputMode={precision === 'year' ? 'numeric' : undefined} maxLength={precision === 'month' ? 7 : precision === 'year' ? 4 : undefined} pattern={precision === 'month' ? '[0-9]{4}-(0[1-9]|1[0-2])' : precision === 'year' ? '[1-9][0-9]{3}' : undefined} value={draft.date} onChange={e => update('date', e.target.value)} />{fieldFeedback('editor-date')}
        </label>}
        {precision === 'day' && <label>結束日期（選填）<input {...fieldProps('editor-end-date')} type="date" min={draft.date} value={draft.endDate} onChange={e => update('endDate', e.target.value)} />{fieldFeedback('editor-end-date')}</label>}
        <label>日期說明（選填）<input {...fieldProps('editor-date-note')} maxLength={500} value={draft.dateNote || ''} onChange={e => update('dateNote', e.target.value)} />{fieldFeedback('editor-date-note')}</label>
        <label>原始發文日期（選填，與活動日期分開）<input {...fieldProps('editor-published-date')} type="date" value={draft.publishedDate || ''} onChange={e => update('publishedDate', e.target.value)} />{fieldFeedback('editor-published-date')}</label>
        <label>地點<input maxLength={300} value={draft.location} onChange={e => update('location', e.target.value)} /></label>
        <label>內容說明<textarea rows={10} maxLength={20000} value={draft.body} onChange={e => update('body', e.target.value)} /></label>
        <fieldset className="attachment-editor" disabled={busy}>
          <legend>附件（選填）</legend>
          <p>貼上檔案的共用連結。選「Google Drive PDF」可在文章內預覽，也可在新分頁開啟。</p>
          {attachments.map((attachment, index) => (
            <div className="attachment-editor__item" key={index}>
              <label>附件 {index + 1} 名稱<input {...fieldProps(`editor-attachment-${index}-label`)} required maxLength={200} value={attachment.label} onChange={e => updateAttachment(index, { label: e.target.value })} />{fieldFeedback(`editor-attachment-${index}-label`)}</label>
              <label>附件 {index + 1} 共用連結<input {...fieldProps(`editor-attachment-${index}-url`)} required type="url" maxLength={2048} value={attachment.url} onChange={e => updateAttachment(index, { url: e.target.value })} />{fieldFeedback(`editor-attachment-${index}-url`)}</label>
              <label>附件 {index + 1} 類型<select {...fieldProps(`editor-attachment-${index}-kind`)} value={attachment.kind} onChange={e => updateAttachment(index, { kind: e.target.value === 'pdf' ? 'pdf' : 'file' })}>
                <option value="file">檔案連結</option>
                <option value="pdf">Google Drive PDF</option>
              </select>{fieldFeedback(`editor-attachment-${index}-kind`)}</label>
              <button type="button" onClick={() => {
                update('attachments', attachments.filter((_, position) => position !== index))
                setErrors(current => current.filter(error => !error.field?.startsWith('editor-attachment-')))
              }}>移除附件 {index + 1}</button>
            </div>
          ))}
          <button type="button" disabled={attachments.length >= attachmentLimit} onClick={() => update('attachments', [...attachments, { label: '', url: '', kind: 'file' }])}>＋ 新增附件</button>
          {attachments.length >= attachmentLimit && <p>每篇內容最多可加入 {attachmentLimit} 個附件。</p>}
        </fieldset>
        {draft.sourceUrl && <p><a href={draft.sourceUrl} target="_blank" rel="noreferrer">查看匯入來源 ↗</a></p>}
        <div className="content-tabs"><button disabled={busy} type="submit">儲存草稿</button><button disabled={busy || !id || dirty || !draft.groupIds.length} type="button" onClick={() => void action('approve')}>核定並發佈</button><button disabled={busy || !selected?.published || dirty} type="button" onClick={() => void action('unpublish')}>下架</button></div>{dirty && <p>請先儲存草稿，再核定發佈。</p>}
      </form></div>
    </>}
  </div></section>
}
