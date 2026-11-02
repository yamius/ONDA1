/**
 * /science/psychology/ hub and /science/psychology/<topic>/ (task 108, EN only). Data + meta: src/lib/psych.ts.
 * Content is rendered as-is from onda-psych (approved claims); [<claim-id>] markers in the body link to the claim.
 */
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { NotFoundPage } from './NotFoundPage'
import { scienceUi } from '../data/science/i18n'
import { SITE_URL } from '../lib/science-meta'
import { PSYCH_HUB, PSYCH_HUB_DESC, PSYCH_HUB_TITLE, PSYCH_PAGES, psychMeta, psychPage, psychPath, psychSourceHref, psychSources, sourceNo, type PsychPage } from '../lib/psych'

const ui = scienceUi('en')
const H2 = 'mb-4 mt-12 text-xl font-bold md:text-2xl'
const P = 'font-mono text-sm leading-relaxed text-white/70'
const STUDY: Record<string, string> = { 'sr-ma': 'Systematic review / meta-analysis', rct: 'Randomised controlled trial', guideline: 'Guideline', cohort: 'Cohort study', review: 'Review' }
const fmtDate = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
  el.setAttribute('content', content)
}
/** Client-side title/description on navigation only; JSON-LD is static (meta-inject). */
function usePsychMeta(route: string) {
  useEffect(() => {
    const m = psychMeta(route)
    if (!m) return
    document.title = m.title
    setMeta('description', m.description)
    setMeta('og:title', m.title.replace(/ \| ONDA Life$/, ''), true)
    setMeta('og:description', m.description, true)
    setMeta('og:url', `${SITE_URL}${route}`, true)
  }, [route])
}

function Crumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs text-white/40">
      {items.map((c, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5">/</span>}
          {c.to ? <Link to={c.to} className="hover:text-white/70">{c.label}</Link> : <span className="text-white/60">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}

function ClassBadge({ c }: { c: string }) {
  const tone = c === 'established' || c === 'guideline' ? 'border-terminal-green/50 text-terminal-green' : c === 'emerging' || c === 'debated' ? 'border-amber-400/50 text-amber-300' : 'border-sky-400/50 text-sky-300'
  return <span className={`inline-block whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone}`}>{ui.classes[c as keyof typeof ui.classes] ?? c}</span>
}

function Hub() {
  usePsychMeta(PSYCH_HUB)
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-8">
        <Crumbs items={[{ to: '/science', label: ui.science }, { label: 'Psychology' }]} />
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{PSYCH_HUB_TITLE}</h1>
        <p className={P}>{PSYCH_HUB_DESC} Educational information, not medical advice.</p>
      </header>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {PSYCH_PAGES.map((p) => (
          <Link key={p.topic} to={psychPath(p.topic)} className="block rounded border border-white/10 p-4 transition-colors hover:border-terminal-green/40">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">Psychology</div>
            <div className="mb-2 font-semibold text-white/90">{p.title}</div>
            <p className="font-mono text-xs leading-relaxed text-white/55">{p.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

/** [anxiety-c1] / [anxiety-c1][anxiety-c3] → links to the claim cards. */
function linkClaims(md: string, p: PsychPage): string {
  const ids = new Set(p.claims.map((c) => c.id))
  return md.replace(/\[([a-z0-9-]+-c\d+)\](?!\()/g, (m, id: string) => {
    if (!ids.has(id)) return m
    const n = p.claims.findIndex((c) => c.id === id) + 1
    return `[\\[C${n}\\]](#claim-${id})`
  })
}

const mdComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) =>
    href?.startsWith('#') ? <a href={href} className="text-xs text-terminal-green/70 no-underline hover:text-terminal-green">{children}</a>
      : href?.startsWith('/') ? <Link to={href} className="text-terminal-green hover:underline">{children}</Link>
        : <a href={href} target="_blank" rel="noopener" className="text-terminal-green hover:underline">{children}</a>,
  h2: ({ children, id }: { children?: React.ReactNode; id?: string }) => <h2 id={id} className={H2}>{children}</h2>,
  h3: ({ children, id }: { children?: React.ReactNode; id?: string }) => <h3 id={id} className="mb-3 mt-8 text-lg font-semibold">{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className={`${P} mb-4`}>{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className={`${P} mb-4 list-disc space-y-2 pl-5`}>{children}</ul>,
}

function Topic({ p }: { p: PsychPage }) {
  usePsychMeta(psychPath(p.topic))
  const sources = psychSources(p)
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <article>
        <header className="border-b border-white/10 pt-6 pb-8">
          <Crumbs items={[{ to: '/science', label: ui.science }, { to: PSYCH_HUB, label: 'Psychology' }, { label: p.title.split(':')[0] }]} />
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{p.title}</h1>
          <p className="font-mono text-xs text-white/45">Updated <time dateTime={p.updated}>{fmtDate(p.updated)}</time> · every claim quoted from its source</p>
        </header>

        <section aria-label={ui.shortAnswer} className="mt-8 rounded border border-terminal-green/30 bg-terminal-green/5 p-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-terminal-green/80">{ui.shortAnswer}</div>
          <p className="text-[15px] leading-relaxed text-white/85">{p.summary}</p>
        </section>

        <div className="mt-4">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={mdComponents as never}>{linkClaims(p.body, p)}</Markdown>
        </div>

        {p.uncertainty ? (
          <section aria-label="Uncertainty" className="mt-8 rounded border border-white/15 p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/50">How certain is this?</div>
            <p className={P}>{p.uncertainty}</p>
          </section>
        ) : null}

        <section aria-label="Claims and evidence">
          <h2 className={H2}>Claims and evidence</h2>
          <ol className="space-y-4">
            {p.claims.map((c, i) => (
              <li key={c.id} id={`claim-${c.id}`} className="scroll-mt-24 rounded border border-white/10 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-terminal-green/70">[C{i + 1}]</span>
                  <ClassBadge c={c.evidence_class} />
                </div>
                <p className="mb-3 text-sm leading-relaxed text-white/85">{c.text}</p>
                {(c.sources ?? []).map((s, j) => (
                  <div key={j} className="mb-3 border-l-2 border-white/15 pl-3">
                    <blockquote className="font-mono text-xs italic leading-relaxed text-white/60">“{s.quote}”</blockquote>
                    <p className="mt-1 font-mono text-[11px] text-white/45">
                      <a href={`#source-${sourceNo(p, s)}`} className="text-terminal-green/70">[S{sourceNo(p, s)}]</a> · {STUDY[s.study_type] ?? s.study_type}
                      {' · '}Conflicts of interest: {s.coi}{s.industry ? ' · industry-funded' : ''}
                    </p>
                  </div>
                ))}
                {c.limitation ? <p className="font-mono text-xs text-white/50"><span className="text-white/65">{ui.limitation}:</span> {c.limitation}</p> : null}
              </li>
            ))}
          </ol>
        </section>

        <section aria-label={ui.sources}>
          <h2 className={H2}>{ui.sources}</h2>
          <ol className={`${P} space-y-2`}>
            {sources.map((s) => {
              const href = psychSourceHref(s)
              return (
                <li key={s.n} id={`source-${s.n}`} className="scroll-mt-24 break-words">
                  <span className="text-terminal-green/70">[S{s.n}]</span> {STUDY[s.study_type] ?? s.study_type}.
                  {s.pmid ? <> PMID <a href={`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`} target="_blank" rel="noopener" className="text-white/80 hover:underline">{s.pmid}</a></> : null}
                  {s.doi ? <> · DOI <a href={href ?? undefined} target="_blank" rel="noopener" className="text-white/80 hover:underline">{s.doi}</a></> : null}
                </li>
              )
            })}
          </ol>
        </section>

        <p className="mt-12 font-mono text-xs text-white/40">Educational information, not medical advice. If anxiety or low mood is severe or persistent, or you have thoughts of self-harm, contact a qualified professional or local emergency services.</p>
        <p className="mt-3 font-mono text-xs text-white/40"><Link to={PSYCH_HUB} className="hover:text-white/70">More psychology topics</Link> · <Link to="/science" className="hover:text-white/70">ONDA Science</Link></p>
      </article>
    </main>
  )
}

export function PsychologyPage() {
  const { topic } = useParams()
  if (!PSYCH_PAGES.length) return <NotFoundPage />
  if (!topic) return <Hub />
  const p = psychPage(topic)
  return p ? <Topic p={p} /> : <NotFoundPage />
}
