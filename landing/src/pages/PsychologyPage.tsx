/**
 * /science/psychology/ hub and /science/psychology/<topic>/ (task 108) and their /<lang>/ translations. Data + meta: src/lib/psych.ts.
 * Content is rendered as-is from onda-psych (approved or auto-checked claims); [<claim-id>] markers in the body link to the claim.
 */
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { NotFoundPage } from './NotFoundPage'
import { SCIENCE_LIVE_LANGS, scienceUi } from '../data/science/i18n'
import { psychUi } from '../data/psych-i18n'
import { SITE_URL } from '../lib/science-meta'
import { parsePsychRoute, psychHubPath, psychMeta, psychOwnerReviewed, psychPage, psychPagesFor, psychPath, psychSiblings, psychSourceHref, psychSources, readPsychFull, sourceNo, type PsychFull, type PsychPage } from '../lib/psych'

const H2 = 'mb-4 mt-12 text-xl font-bold md:text-2xl'
const P = 'font-mono text-sm leading-relaxed text-white/70'
const LOCALE: Record<string, string> = { en: 'en-GB', zh: 'zh-CN', pt: 'pt-BR' }
const fmtDate = (d: string, lang: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString(LOCALE[lang] ?? lang, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
const sciHome = (lang: string) => (lang !== 'en' && SCIENCE_LIVE_LANGS.includes(lang) ? `/${lang}/science` : '/science')

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

function ClassBadge({ c, lang }: { c: string; lang: string }) {
  const ui = scienceUi(lang)
  const tone = c === 'established' || c === 'guideline' ? 'border-terminal-green/50 text-terminal-green' : c === 'emerging' || c === 'debated' ? 'border-amber-400/50 text-amber-300' : 'border-sky-400/50 text-sky-300'
  return <span className={`inline-block whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone}`}>{ui.classes[c as keyof typeof ui.classes] ?? c}</span>
}

function Hub({ lang }: { lang: string }) {
  usePsychMeta(psychHubPath(lang))
  const ui = scienceUi(lang), pu = psychUi(lang)
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-8">
        <Crumbs items={[{ to: sciHome(lang), label: ui.science }, { label: pu.psychology }]} />
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{pu.hubTitle}</h1>
        <p className={P}>{pu.hubDesc} {pu.notAdvice}</p>
      </header>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {psychPagesFor(lang).map((p) => (
          <Link key={p.topic} to={psychPath(p.topic, lang)} className="block rounded border border-white/10 p-4 transition-colors hover:border-terminal-green/40">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">{pu.psychology}</div>
            <div className="mb-2 font-semibold text-white/90">{p.title}</div>
            <p className="font-mono text-xs leading-relaxed text-white/55">{p.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

/** [anxiety-c1] / [anxiety-c1][anxiety-c3] → links to the claim cards. */
function linkClaims(md: string, p: PsychFull): string {
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
  const lang = p.lang
  usePsychMeta(psychPath(p.topic, lang))
  const ui = scienceUi(lang), pu = psychUi(lang)
  const STUDY = pu.study as Record<string, string>
  const f = readPsychFull(lang, p.topic)
  if (!f) return <NotFoundPage />
  const sources = psychSources(f)
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <article>
        <header className="border-b border-white/10 pt-6 pb-8">
          <Crumbs items={[{ to: sciHome(lang), label: ui.science }, { to: psychHubPath(lang), label: pu.psychology }, { label: p.title.split(/[:：]/)[0] }]} />
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{p.title}</h1>
          <p className="font-mono text-xs text-white/45">{pu.updated} <time dateTime={p.updated}>{fmtDate(p.updated, lang)}</time> · {pu.quoted}</p>
          <p className="font-mono text-xs text-white/45">{psychOwnerReviewed(p)
            ? <>{pu.reviewedBy} <Link to="/people/yakiv-bilenko" className="underline">Yakiv Bilenko</Link></>
            : <>{pu.autoChecked}</>}</p>
          {lang !== 'en' ? <p className="font-mono text-xs text-white/45">{ui.translationNote}</p> : null}
        </header>

        <section aria-label={ui.shortAnswer} className="mt-8 rounded border border-terminal-green/30 bg-terminal-green/5 p-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-terminal-green/80">{ui.shortAnswer}</div>
          <p className="text-[15px] leading-relaxed text-white/85">{p.summary}</p>
        </section>

        <div className="mt-4">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={mdComponents as never}>{linkClaims(f.body, f)}</Markdown>
        </div>

        {f.uncertainty ? (
          <section aria-label={pu.certainty} className="mt-8 rounded border border-white/15 p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/50">{pu.certainty}</div>
            <p className={P}>{f.uncertainty}</p>
          </section>
        ) : null}

        <section aria-label={pu.claims}>
          <h2 className={H2}>{pu.claims}</h2>
          <ol className="space-y-4">
            {f.claims.map((c, i) => (
              <li key={c.id} id={`claim-${c.id}`} className="scroll-mt-24 rounded border border-white/10 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-terminal-green/70">[C{i + 1}]</span>
                  <ClassBadge c={c.evidence_class} lang={lang} />
                </div>
                <p className="mb-3 text-sm leading-relaxed text-white/85">{c.text}</p>
                {(c.sources ?? []).map((s, j) => (
                  <div key={j} className="mb-3 border-l-2 border-white/15 pl-3">
                    <blockquote className="font-mono text-xs italic leading-relaxed text-white/60">“{s.quote}”</blockquote>
                    <p className="mt-1 font-mono text-[11px] text-white/45">
                      <a href={`#source-${sourceNo(f, s)}`} className="text-terminal-green/70">[S{sourceNo(f, s)}]</a> · {STUDY[s.study_type] ?? s.study_type}
                      {' · '}{pu.coi}: {s.coi}{s.industry ? ` · ${pu.industry}` : ''}
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

        {lang === 'en' && f.related?.length ? (
          <section aria-labelledby="related-onda" className="mt-12 border-t border-white/10 pt-8">
            <h2 id="related-onda" className={H2}>{pu.related}</h2>
            <ul className={`${P} space-y-2`}>
              {f.related.map((l) => (
                <li key={l.href}>
                  <span className="mr-2 text-[10px] uppercase tracking-widest text-white/35">{l.kind}</span>
                  <Link to={l.href} className="text-terminal-green hover:underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {psychSiblings(p).length ? (
          <section aria-labelledby="more-psych" className="mt-8">
            <h2 id="more-psych" className="mb-3 text-lg font-semibold">{pu.moreIn}</h2>
            <ul className={`${P} space-y-2`}>
              {psychSiblings(p).map((o) => (
                <li key={o.topic}><Link to={psychPath(o.topic, lang)} className="text-terminal-green hover:underline">{o.title}</Link></li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-12 font-mono text-xs text-white/40">{pu.disclaimer}</p>
        <p className="mt-3 font-mono text-xs text-white/40"><Link to={psychHubPath(lang)} className="hover:text-white/70">{pu.moreTopics}</Link> · <Link to={sciHome(lang)} className="hover:text-white/70">ONDA Science</Link></p>
      </article>
    </main>
  )
}

export function PsychologyPage() {
  const { topic } = useParams()
  const lang = parsePsychRoute(useLocation().pathname)?.lang ?? 'en'
  if (!psychPagesFor(lang).length) return <NotFoundPage />
  if (!topic) return <Hub lang={lang} />
  const p = psychPage(topic, lang)
  return p ? <Topic p={p} /> : <NotFoundPage />
}
