/**
 * ONDA Science — /science, /science/<kind>, /science/<kind>/<slug>, and /<lang>/… for languages in
 * SCIENCE_LIVE_LANGS (src/data/science/i18n.ts).
 * Content: content/science/<kind>/<slug>.md + translations in content/science-i18n/<lang>/ →
 * light index src/generated/science-pages.ts + one JSON per page (scripts/generate-science-pages.ts).
 * Rules for the content: docs/science-pack/. Meta + JSON-LD: src/lib/science-meta.ts (also used by meta-inject).
 */
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { SCIENCE_KINDS, type SciencePageData, type ScienceKind, type ScienceIndexEntry } from '../generated/science-pages'
import { NotFoundPage } from './NotFoundPage'
import { OptimizedImage } from '../components/OptimizedImage'
import { langHref, type Lang } from '../i18n'
import { scienceUi, fillUi, type ScienceUi } from '../data/science/i18n'
import { readSciencePage } from '../lib/science-content'
import { parseScienceRoute, scienceMeta, sciencePath, scienceShortName, indexFor, kindsWithPages, kindIndexed, sourceHref, SITE_URL } from '../lib/science-meta'

const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

const fmtDate = (d: string, ui: ScienceUi) => new Date(`${d}T12:00:00Z`).toLocaleDateString(ui.dateLocale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function useScienceMeta(route: string, page?: SciencePageData) {
  useEffect(() => {
    const m = scienceMeta(route, () => page)
    if (!m) return
    document.title = m.title
    setMeta('description', m.description)
    setMeta('og:title', m.title.replace(/ \| ONDA Life$/, ''), true)
    setMeta('og:description', m.description, true)
    setMeta('og:type', m.ogType, true)
    setMeta('og:url', `${SITE_URL}${route}`, true)
    setMeta('og:image', m.image ?? OG_IMAGE, true)
    // Section page below MIN_PAGES_FOR_INDEXED_KIND (the prerendered HTML already carries it via meta-inject).
    if (!m.noindex) return
    const prev = document.querySelector('meta[name="robots"]')?.getAttribute('content')
    setMeta('robots', 'noindex, follow')
    return () => { if (prev != null) setMeta('robots', prev) }
  }, [route, page])
}

const H2 = 'mb-4 mt-12 text-xl font-bold md:text-2xl'
const P = 'font-mono text-sm leading-relaxed text-white/70'

function Crumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs text-white/40">
      {items.map((c, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5">/</span>}
          {c.to ? <Link to={c.to} className="hover:text-white/70">{c.label}</Link> : <span className={i === items.length - 1 ? 'text-white/60' : undefined}>{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}

function PageCard({ p, lang, ui }: { p: ScienceIndexEntry; lang: string; ui: ScienceUi }) {
  return (
    <Link to={sciencePath(lang, `/${p.kind}/${p.slug}`)} className="block rounded border border-white/10 p-4 transition-colors hover:border-terminal-green/40">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">{ui.kinds[p.kind].label}</div>
      <div className="mb-2 font-semibold text-white/90">{p.i18n[lang].title}</div>
      <p className="font-mono text-xs leading-relaxed text-white/55">{p.i18n[lang].metaDescription}</p>
    </Link>
  )
}

function Hub({ lang, ui }: { lang: string; ui: ScienceUi }) {
  useScienceMeta(sciencePath(lang))
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ ONDA SCIENCE ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{ui.hubTitle}</h1>
        <p className={P}>{ui.hubIntro}</p>
        <p className={`${P} mt-4`}>
          {ui.hubResearch[0]}<Link to={langHref('/research', lang as Lang)} className="text-terminal-green hover:underline">{ui.hubResearch[1]}</Link>{ui.hubResearch[2]}
        </p>
      </header>
      {kindsWithPages(lang).map((k) => (
        <section key={k}>
          <h2 className={H2}>
            {kindIndexed(k, lang) ? <Link to={sciencePath(lang, `/${k}`)} className="hover:text-terminal-green">{ui.kinds[k].label}</Link> : ui.kinds[k].label}
          </h2>
          <p className={`${P} mb-4`}>{ui.kinds[k].desc}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {indexFor(lang).filter((p) => p.kind === k).map((p) => <PageCard key={p.slug} p={p} lang={lang} ui={ui} />)}
          </div>
        </section>
      ))}
    </main>
  )
}

function KindList({ kind, lang, ui }: { kind: ScienceKind; lang: string; ui: ScienceUi }) {
  useScienceMeta(sciencePath(lang, `/${kind}`))
  const items = indexFor(lang).filter((p) => p.kind === kind)
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-8">
        <Crumbs items={[{ to: sciencePath(lang), label: ui.science }, { label: ui.kinds[kind].label }]} />
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{ui.kinds[kind].label}</h1>
        <p className={P}>{ui.kinds[kind].desc}</p>
      </header>
      <div className="mt-8 grid gap-3 md:grid-cols-2">{items.map((p) => <PageCard key={p.slug} p={p} lang={lang} ui={ui} />)}</div>
    </main>
  )
}

/** [S1] / [S1, S3] → links to the source list. */
function linkCitations(md: string): string {
  return md.replace(/\[(S\d+(?:\s*,\s*S\d+)*)\](?!\()/g, (_m, ids: string) =>
    ids.split(/\s*,\s*/).map((id) => `[\\[${id}\\]](#source-${id})`).join(' '))
}

const mdComponents = (lang: string) => ({
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) =>
    href?.startsWith('/') ? <Link to={langHref(href, lang as Lang)} className="text-terminal-green hover:underline">{children}</Link>
      : href?.startsWith('#source-') ? <a href={href} className="text-xs text-terminal-green/70 no-underline hover:text-terminal-green">{children}</a>
        : <a href={href} target="_blank" rel="noopener" className="text-terminal-green hover:underline">{children}</a>,
  h2: ({ children, id }: { children?: React.ReactNode; id?: string }) => <h2 id={id} className={H2}>{children}</h2>,
  h3: ({ children, id }: { children?: React.ReactNode; id?: string }) => <h3 id={id} className="mb-3 mt-8 text-lg font-semibold">{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className={`${P} mb-4`}>{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className={`${P} mb-4 list-disc space-y-2 pl-5`}>{children}</ul>,
  blockquote: ({ children }: { children?: React.ReactNode }) => <div className="mt-10 border-l-2 border-white/20 pl-4 font-mono text-xs italic text-white/50">{children}</div>,
  img: ({ src, alt }: { src?: string; alt?: string }) => <OptimizedImage src={src ?? ''} alt={alt ?? ''} className="my-6 w-full rounded" />,
})

function Entry({ p, lang, ui }: { p: SciencePageData; lang: string; ui: ScienceUi }) {
  useScienceMeta(sciencePath(lang, `/${p.kind}/${p.slug}`), p)
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <article>
        <header className="border-b border-white/10 pt-6 pb-8">
          <Crumbs items={[{ to: sciencePath(lang), label: ui.science }, { to: kindIndexed(p.kind, lang) ? sciencePath(lang, `/${p.kind}`) : undefined, label: ui.kinds[p.kind].label }, { label: scienceShortName(p.title) }]} />
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{p.title}</h1>
          <p className="font-mono text-xs text-white/45">
            {fillUi(ui.editor, { name: p.editor })}
            {p.reviewer ? <> · {fillUi(ui.reviewedBy, { name: p.reviewer })}{p.lastReviewed ? fillUi(ui.reviewedOn, { date: fmtDate(p.lastReviewed, ui) }) : ''}</> : null}
            {' · '}{fillUi(ui.updated, { date: fmtDate(p.dateModified, ui) })}
          </p>
        </header>

        {p.image && (
          <figure className="mt-8 overflow-hidden rounded-xl border border-white/10">
            <OptimizedImage src={p.image} alt={p.imageAlt ?? ''} priority width={p.imageWidth ?? 1024} height={p.imageHeight ?? 768} className="w-full object-cover" />
          </figure>
        )}

        <section aria-label={ui.shortAnswer} className="mt-8 rounded border border-terminal-green/30 bg-terminal-green/5 p-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-terminal-green/80">{ui.shortAnswer}</div>
          <p className="text-[15px] leading-relaxed text-white/85">{p.shortAnswer}</p>
        </section>

        <section aria-label={ui.keyPoints} className="mt-6">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-white/50">{ui.keyPoints}</h2>
          <ul className={`${P} list-disc space-y-1.5 pl-5`}>{p.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
        </section>

        <div className="mt-4">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={mdComponents(lang) as never}>{linkCitations(p.body)}</Markdown>
        </div>

        {p.faq?.length ? (
          <section aria-label={ui.faq}>
            <h2 className={H2}>{ui.faq}</h2>
            <div className="space-y-5">
              {p.faq.map((f, i) => (
                <div key={i}>
                  <h3 className="mb-1.5 font-semibold text-white/90">{f.q}</h3>
                  <p className={P}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-label={ui.evidenceAtAGlance}>
          <h2 className={H2}>{ui.evidenceAtAGlance}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-white/70">
              <thead>
                <tr className="border-b border-white/15 text-left text-white/50">
                  <th className="py-2 pr-3 font-normal">{ui.claim}</th>
                  <th className="py-2 pr-3 font-normal">{ui.evidence}</th>
                  <th className="py-2 font-normal">{ui.limitation}</th>
                </tr>
              </thead>
              <tbody>
                {p.evidenceMap.map((e, i) => (
                  <tr key={i} className="border-b border-white/5 align-top">
                    <td className="py-2 pr-3">{e.claim} {e.sources.map((s) => <a key={s} href={`#source-${s}`} className="text-terminal-green/70">[{s}]</a>)}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{ui.classes[e.class as keyof ScienceUi['classes']] ?? e.class}</td>
                    <td className="py-2 text-white/50">{e.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-label={ui.sources}>
          <h2 className={H2}>{ui.sources}</h2>
          {ui.translationNote ? <p className={`${P} mb-3 text-white/50`}>{ui.translationNote}</p> : null}
          <ol className={`${P} space-y-2`}>
            {p.sources.map((s) => {
              const href = sourceHref(s)
              return (
                <li key={s.id} id={`source-${s.id}`} className="scroll-mt-24">
                  <span className="text-terminal-green/70">[{s.id}]</span> {s.cite}. {href ? <a href={href} target="_blank" rel="noopener" className="text-white/80 hover:underline">{s.title}</a> : s.title}
                  {s.journal ? <>. <em>{s.journal}</em></> : null}{s.year && !s.cite.includes(String(s.year)) ? ` (${s.year})` : ''}.
                  {s.doi ? <span className="text-white/40"> DOI {s.doi}</span> : null}
                  {s.pmid ? <span className="text-white/40"> · PMID {s.pmid}</span> : null}
                  {s.type === 'official' ? <span className="text-white/40"> · {ui.officialDocumentation}</span> : null}
                  {s.note ? <span className="text-white/40"> · {s.note}</span> : null}
                </li>
              )
            })}
          </ol>
        </section>

        {p.related.length > 0 && (
          <section aria-label={ui.related}>
            <h2 className={H2}>{ui.related}</h2>
            <ul className="grid gap-2 md:grid-cols-2">
              {p.related.map((r) => {
                const sci = r.type === 'Science' && indexFor(lang).some((x) => `/science/${x.kind}/${x.slug}` === r.href)
                const to = sci ? sciencePath(lang, r.href.slice('/science'.length)) : langHref(r.href, lang as Lang)
                return (
                  <li key={r.href}>
                    <Link to={to} className="block rounded border border-white/10 p-3 transition-colors hover:border-terminal-green/40">
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/40">{ui.relatedTypes[r.type as keyof ScienceUi['relatedTypes']] ?? r.type}</span>
                      <span className="text-sm text-white/85">{r.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <p className="mt-12 font-mono text-xs text-white/40">{ui.howMade}</p>
      </article>
    </main>
  )
}

export function SciencePage() {
  const { kind, slug } = useParams()
  const { pathname } = useLocation()
  const r = parseScienceRoute(pathname)
  if (!r) return <NotFoundPage />
  const lang = r.lang
  const ui = scienceUi(lang)
  if (!kind) return <Hub lang={lang} ui={ui} />
  if (!(SCIENCE_KINDS as string[]).includes(kind) || !kindsWithPages(lang).includes(kind as ScienceKind)) return <NotFoundPage />
  if (!slug) return <KindList kind={kind as ScienceKind} lang={lang} ui={ui} />
  if (!indexFor(lang).some((p) => p.kind === kind && p.slug === slug)) return <NotFoundPage />
  const p = readSciencePage(lang, kind, slug)
  return p ? <Entry p={p} lang={lang} ui={ui} /> : <NotFoundPage />
}
