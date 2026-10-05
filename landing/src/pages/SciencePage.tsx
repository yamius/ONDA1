/**
 * ONDA Science — /science, /science/<kind>, /science/<kind>/<slug>. EN-only.
 * Content: content/science/<kind>/<slug>.md → src/generated/science-pages.ts (scripts/generate-science-pages.ts).
 * Rules for the content: docs/science-pack/. Meta + JSON-LD for prerender: scienceMeta() (used by meta-inject).
 */
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { SCIENCE_PAGES, SCIENCE_KINDS, type SciencePageData, type ScienceKind, type ScienceSource } from '../generated/science-pages'
import { NotFoundPage } from './NotFoundPage'
import { OptimizedImage } from '../components/OptimizedImage'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

export const SCIENCE_HUB_TITLE = 'ONDA Science: HRV, Breathing and the Nervous System'
export const SCIENCE_HUB_DESC =
  'Evidence-first reference pages on heart rate variability, breathing and the autonomic nervous system — what each measure is, what the research shows and its limits.'

const KIND_INFO: Record<ScienceKind, { label: string; desc: string }> = {
  concepts: { label: 'Concepts', desc: 'What the core terms mean — definitions, what they reflect and what they do not.' },
  measurements: { label: 'Measurements', desc: 'How these signals are measured, by which methods, and how far to trust them.' },
  mechanisms: { label: 'Mechanisms', desc: 'How breathing, the heart and the nervous system interact.' },
  evidence: { label: 'Evidence', desc: 'What the research shows for specific methods, by strength of evidence.' },
}

const CLASS_LABEL: Record<string, string> = {
  established: 'Established',
  guideline: 'Guideline / expert consensus',
  'context-dependent': 'Context-dependent',
  emerging: 'Emerging',
  debated: 'Debated',
  unknown: 'Unknown',
}

const pageUrl = (p: Pick<SciencePageData, 'kind' | 'slug'>) => `${SITE_URL}/science/${p.kind}/${p.slug}`
/** Short entity name for breadcrumbs: the title before an em/en dash. */
export const scienceShortName = (title: string) => title.split(/\s[—–]\s/)[0]
const findPage = (kind?: string, slug?: string) => SCIENCE_PAGES.find((p) => p.kind === kind && p.slug === slug)
const kindsWithPages = () => SCIENCE_KINDS.filter((k) => SCIENCE_PAGES.some((p) => p.kind === k))
const fmtDate = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

function sourceHref(s: ScienceSource): string | null {
  if (s.doi) return `https://doi.org/${s.doi}`
  if (s.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`
  return s.url
}

/** Paths prerendered for the section (hub, kinds that have pages, pages). */
export function sciencePaths(): string[] {
  return ['/science', ...kindsWithPages().map((k) => `/science/${k}`), ...SCIENCE_PAGES.map((p) => `/science/${p.kind}/${p.slug}`)]
}

/** Title/description/JSON-LD for a /science route (prerender + client). undefined = not a science page. */
export function scienceMeta(route: string): { title: string; description: string; ogType: 'website' | 'article'; jsonLd: Record<string, unknown>[]; image?: string; imageAlt?: string; breadcrumbs: { name: string; url: string }[] } | undefined {
  const [, root, kind, slug] = route.split('/')
  if (root !== 'science') return undefined
  const isPartOf = { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL }
  const crumbs = [{ name: 'Home', url: SITE_URL }, { name: 'Science', url: `${SITE_URL}/science` }]
  if (!kind) {
    return {
      breadcrumbs: crumbs,
      title: `${SCIENCE_HUB_TITLE} | ONDA Life`,
      description: SCIENCE_HUB_DESC,
      ogType: 'website',
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${SITE_URL}/science#webpage`, url: `${SITE_URL}/science`,
        name: SCIENCE_HUB_TITLE, description: SCIENCE_HUB_DESC, inLanguage: 'en', isPartOf,
        hasPart: SCIENCE_PAGES.map((p) => ({ '@type': 'Article', name: p.title, url: pageUrl(p) })),
      }],
    }
  }
  if (!(SCIENCE_KINDS as string[]).includes(kind)) return undefined
  const info = KIND_INFO[kind as ScienceKind]
  crumbs.push({ name: info.label, url: `${SITE_URL}/science/${kind}` })
  if (!slug) {
    return {
      breadcrumbs: crumbs,
      title: `${info.label} — ONDA Science | ONDA Life`,
      description: `ONDA Science ${info.label.toLowerCase()}: ${info.desc}`,
      ogType: 'website',
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'CollectionPage', url: `${SITE_URL}/science/${kind}`, name: `${info.label} — ONDA Science`, inLanguage: 'en', isPartOf,
        hasPart: SCIENCE_PAGES.filter((p) => p.kind === kind).map((p) => ({ '@type': 'Article', name: p.title, url: pageUrl(p) })),
      }],
    }
  }
  const p = findPage(kind, slug)
  if (!p) return undefined
  const editor = { '@type': 'Person', name: p.editor, url: `${SITE_URL}/about` }
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': p.kind === 'concepts' ? 'Article' : 'TechArticle',
    '@id': `${pageUrl(p)}#article`,
    url: pageUrl(p),
    mainEntityOfPage: pageUrl(p),
    headline: p.title,
    description: p.metaDescription,
    abstract: p.shortAnswer,
    inLanguage: 'en',
    dateModified: p.dateModified,
    author: editor,
    editor,
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    isPartOf,
    citation: p.sources.map((s) => ({
      '@type': s.type === 'official' ? 'WebPage' : 'ScholarlyArticle',
      name: s.title,
      ...(s.year ? { datePublished: String(s.year) } : {}),
      ...(sourceHref(s) ? { url: sourceHref(s) } : {}),
      ...(s.doi ? { identifier: `doi:${s.doi}` } : {}),
    })),
  }
  if (p.kind === 'concepts') article.about = { '@type': 'DefinedTerm', name: p.title.split(/\s[—–:-]\s/)[0], description: p.shortAnswer, url: pageUrl(p) }
  if (p.reviewer) { article.reviewedBy = { '@type': 'Person', name: p.reviewer }; if (p.lastReviewed) article.lastReviewed = p.lastReviewed }
  if (p.image) article.image = { '@type': 'ImageObject', url: `${SITE_URL}${p.image}`, ...(p.imageWidth ? { width: p.imageWidth, height: p.imageHeight } : {}), ...(p.imageAlt ? { caption: p.imageAlt } : {}) }
  crumbs.push({ name: scienceShortName(p.title), url: pageUrl(p) })
  return { title: `${p.metaTitle} | ONDA Life`, description: p.metaDescription, ogType: 'article', jsonLd: [article], breadcrumbs: crumbs, ...(p.image ? { image: `${SITE_URL}${p.image}`, imageAlt: p.imageAlt ?? undefined } : {}) }
}

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

function useScienceMeta(route: string) {
  useEffect(() => {
    const m = scienceMeta(route)
    if (!m) return
    document.title = m.title
    setMeta('description', m.description)
    setMeta('og:title', m.title.replace(/ \| ONDA Life$/, ''), true)
    setMeta('og:description', m.description, true)
    setMeta('og:type', m.ogType, true)
    setMeta('og:url', `${SITE_URL}${route}`, true)
    setMeta('og:image', m.image ?? OG_IMAGE, true)
  }, [route])
}

const H2 = 'mb-4 mt-12 text-xl font-bold md:text-2xl'
const P = 'font-mono text-sm leading-relaxed text-white/70'

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

function PageCard({ p }: { p: SciencePageData }) {
  return (
    <Link to={`/science/${p.kind}/${p.slug}`} className="block rounded border border-white/10 p-4 transition-colors hover:border-terminal-green/40">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">{KIND_INFO[p.kind].label}</div>
      <div className="mb-2 font-semibold text-white/90">{p.title}</div>
      <p className="font-mono text-xs leading-relaxed text-white/55">{p.metaDescription}</p>
    </Link>
  )
}

function Hub() {
  useScienceMeta('/science')
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ ONDA SCIENCE ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">ONDA Science</h1>
        <p className={P}>
          Reference pages on heart rate variability, breathing and the autonomic nervous system. Each page starts with a short
          answer, separates what is established from what depends on context or is still debated, says what a measure does not
          tell you, and lists its sources. Every number comes from one checked list of facts. Educational information, not
          medical advice.
        </p>
        <p className={`${P} mt-4`}>
          Looking for how ONDA itself is built and validated? See <Link to="/research" className="text-terminal-green hover:underline">the research behind ONDA</Link>.
        </p>
      </header>
      {kindsWithPages().map((k) => (
        <section key={k}>
          <h2 className={H2}><Link to={`/science/${k}`} className="hover:text-terminal-green">{KIND_INFO[k].label}</Link></h2>
          <p className={`${P} mb-4`}>{KIND_INFO[k].desc}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {SCIENCE_PAGES.filter((p) => p.kind === k).map((p) => <PageCard key={p.slug} p={p} />)}
          </div>
        </section>
      ))}
    </main>
  )
}

function KindList({ kind }: { kind: ScienceKind }) {
  useScienceMeta(`/science/${kind}`)
  const items = SCIENCE_PAGES.filter((p) => p.kind === kind)
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-8">
        <Crumbs items={[{ to: '/science', label: 'Science' }, { label: KIND_INFO[kind].label }]} />
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{KIND_INFO[kind].label}</h1>
        <p className={P}>{KIND_INFO[kind].desc}</p>
      </header>
      <div className="mt-8 grid gap-3 md:grid-cols-2">{items.map((p) => <PageCard key={p.slug} p={p} />)}</div>
    </main>
  )
}

/** [S1] / [S1, S3] → links to the source list. */
function linkCitations(md: string): string {
  return md.replace(/\[(S\d+(?:\s*,\s*S\d+)*)\](?!\()/g, (_m, ids: string) =>
    ids.split(/\s*,\s*/).map((id) => `[\\[${id}\\]](#source-${id})`).join(' '))
}

const mdComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) =>
    href?.startsWith('/') ? <Link to={href} className="text-terminal-green hover:underline">{children}</Link>
      : href?.startsWith('#source-') ? <a href={href} className="text-xs text-terminal-green/70 no-underline hover:text-terminal-green">{children}</a>
        : <a href={href} target="_blank" rel="noopener" className="text-terminal-green hover:underline">{children}</a>,
  h2: ({ children, id }: { children?: React.ReactNode; id?: string }) => <h2 id={id} className={H2}>{children}</h2>,
  p: ({ children }: { children?: React.ReactNode }) => <p className={`${P} mb-4`}>{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className={`${P} mb-4 list-disc space-y-2 pl-5`}>{children}</ul>,
  blockquote: ({ children }: { children?: React.ReactNode }) => <div className="mt-10 border-l-2 border-white/20 pl-4 font-mono text-xs italic text-white/50">{children}</div>,
}

function Entry({ p }: { p: SciencePageData }) {
  useScienceMeta(`/science/${p.kind}/${p.slug}`)
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <article>
        <header className="border-b border-white/10 pt-6 pb-8">
          <Crumbs items={[{ to: '/science', label: 'Science' }, { to: `/science/${p.kind}`, label: KIND_INFO[p.kind].label }, { label: scienceShortName(p.title) }]} />
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{p.title}</h1>
          <p className="font-mono text-xs text-white/45">
            {p.editor} — editor
            {p.reviewer ? <> · Reviewed by {p.reviewer}{p.lastReviewed ? ` on ${fmtDate(p.lastReviewed)}` : ''}</> : null}
            {' · '}Updated {fmtDate(p.dateModified)}
          </p>
        </header>

        {p.image && (
          <figure className="mt-8 overflow-hidden rounded-xl border border-white/10">
            <OptimizedImage src={p.image} alt={p.imageAlt ?? ''} priority width={p.imageWidth ?? 1024} height={p.imageHeight ?? 768} className="w-full object-cover" />
          </figure>
        )}

        <section aria-label="Short answer" className="mt-8 rounded border border-terminal-green/30 bg-terminal-green/5 p-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-terminal-green/80">Short answer</div>
          <p className="text-[15px] leading-relaxed text-white/85">{p.shortAnswer}</p>
        </section>

        <section aria-label="Key points" className="mt-6">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-white/50">Key points</h2>
          <ul className={`${P} list-disc space-y-1.5 pl-5`}>{p.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
        </section>

        <div className="mt-4">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={mdComponents as never}>{linkCitations(p.body)}</Markdown>
        </div>

        <section aria-label="Evidence at a glance">
          <h2 className={H2}>Evidence at a glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-white/70">
              <thead>
                <tr className="border-b border-white/15 text-left text-white/50">
                  <th className="py-2 pr-3 font-normal">Claim</th>
                  <th className="py-2 pr-3 font-normal">Evidence</th>
                  <th className="py-2 font-normal">Limitation</th>
                </tr>
              </thead>
              <tbody>
                {p.evidenceMap.map((e, i) => (
                  <tr key={i} className="border-b border-white/5 align-top">
                    <td className="py-2 pr-3">{e.claim} {e.sources.map((s) => <a key={s} href={`#source-${s}`} className="text-terminal-green/70">[{s}]</a>)}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{CLASS_LABEL[e.class] ?? e.class}</td>
                    <td className="py-2 text-white/50">{e.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-label="Sources">
          <h2 className={H2}>Sources</h2>
          <ol className={`${P} space-y-2`}>
            {p.sources.map((s) => {
              const href = sourceHref(s)
              return (
                <li key={s.id} id={`source-${s.id}`} className="scroll-mt-24">
                  <span className="text-terminal-green/70">[{s.id}]</span> {s.cite}. {href ? <a href={href} target="_blank" rel="noopener" className="text-white/80 hover:underline">{s.title}</a> : s.title}
                  {s.journal ? <>. <em>{s.journal}</em></> : null}{s.year && !s.cite.includes(String(s.year)) ? ` (${s.year})` : ''}.
                  {s.doi ? <span className="text-white/40"> DOI {s.doi}</span> : null}
                  {s.pmid ? <span className="text-white/40"> · PMID {s.pmid}</span> : null}
                  {s.type === 'official' ? <span className="text-white/40"> · official documentation</span> : null}
                  {s.note ? <span className="text-white/40"> · {s.note}</span> : null}
                </li>
              )
            })}
          </ol>
        </section>

        {p.related.length > 0 && (
          <section aria-label="Related">
            <h2 className={H2}>Related</h2>
            <ul className="grid gap-2 md:grid-cols-2">
              {p.related.map((r) => (
                <li key={r.href}>
                  <Link to={r.href} className="block rounded border border-white/10 p-3 transition-colors hover:border-terminal-green/40">
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/40">{r.type}</span>
                    <span className="text-sm text-white/85">{r.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12 font-mono text-xs text-white/40">
          How ONDA Science pages are made: every number comes from one checked list of facts, every claim is mapped to its sources
          and graded by strength of evidence, and sources need a DOI or PMID (manufacturer documentation is used only for device facts).
        </p>
      </article>
    </main>
  )
}

export function SciencePage() {
  const { kind, slug } = useParams()
  if (!kind) return <Hub />
  if (!(SCIENCE_KINDS as string[]).includes(kind) || !kindsWithPages().includes(kind as ScienceKind)) return <NotFoundPage />
  if (!slug) return <KindList kind={kind as ScienceKind} />
  const p = findPage(kind, slug)
  return p ? <Entry p={p} /> : <NotFoundPage />
}
