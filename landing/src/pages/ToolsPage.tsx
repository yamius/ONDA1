/**
 * /tools — hub for ONDA Life's free interactive calculators.
 *
 * Thick, self-contained page: expanded intro, the Bio OS feature + tool grid,
 * and a closing evidence-grounded body written for search/answer engines
 * (what these tools are, grouped by domain, how to read the numbers honestly).
 * Self-contained meta + CollectionPage/ItemList JSON-LD over the catalogue.
 *
 * Localized to ru + es via tools-i18n.ts (pilot). The framing prose localizes;
 * tool cards (name + blurb) stay English because /tools/<slug> pages are
 * English-only, and internal Links keep EN paths — same as /product and /faq.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath, langHref, homePathFor } from '../i18n'
import { TOOLS } from '../data/tools'
import { TOOLS_I18N, TOOLS_EN } from '../data/tools-i18n'
import { localizedToolCard } from '../data/tools-localized'
import { hrvToolCopy } from '../data/hrv-tool-i18n'

const SITE_URL = 'https://onda-life.com'

/** Category groupings for the closing body — index-aligned with copy.domains. */
const DOMAIN_CATS: string[][] = [
  ['NERVOUS SYSTEM', 'RECOVERY'],
  ['SLEEP'],
  ['FITNESS'],
  ['NUTRITION'],
  ['FOCUS', 'DOPAMINE', 'LONGEVITY'],
]


function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

/** Locale-aware "{n} tools" label (Russian has 3 plural forms). */
function toolCountLabel(n: number, lang: string): string {
  if (lang === 'ru') {
    const mod10 = n % 10
    const mod100 = n % 100
    let word: string
    if (mod10 === 1 && mod100 !== 11) word = 'инструмент'
    else if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) word = 'инструмента'
    else word = 'инструментов'
    return `${n} ${word}`
  }
  if (lang === 'es') return `${n} ${n === 1 ? 'herramienta' : 'herramientas'}`
  return `${n} ${n === 1 ? 'tool' : 'tools'}`
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

export function ToolsPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const copy = TOOLS_I18N[lang] ?? TOOLS_EN
  // Localized calculators first (translated name + blurb); English-only tools after.
  const orderedTools = [...TOOLS]
    .map((t) => ({ ...t, ...(localizedToolCard(t.slug, lang) ?? {}), loc: !!localizedToolCard(t.slug, lang) }))
    .sort((a, b) => Number(b.loc) - Number(a.loc))
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/tools`

  useEffect(() => {
    document.title = copy.metaTitle
    setMeta('description', copy.metaDescription)
    setMeta('og:title', copy.metaTitle, true)
    setMeta('og:description', copy.metaDescription, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', copy.metaTitle, true)
    setMeta('twitter:description', copy.metaDescription, true)
    window.scrollTo({ top: 0 })
    // CollectionPage/ItemList JSON-LD and hreflang cluster are emitted
    // statically by prerender/meta-inject (prerender skips useEffect).
  }, [copy, pageUrl])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={homePathFor(lang)} className="hover:text-terminal-green">{hrvToolCopy(lang).breadcrumb.home}</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">{copy.breadcrumbTools}</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{copy.h1}</h1>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60">{copy.intro1}</p>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        {copy.intro2Pre}
        <Link to={langHref('/product', lang)} className="text-terminal-green hover:underline">{copy.ondaLink}</Link>
        {copy.intro2Post}
      </p>

      {/* Bio OS — the flagship live dashboard. It keeps its own URL (/bio) and
          its own richer engine; here it's surfaced under the Tools group as a
          featured entry (nav placement only — the path is unchanged). */}
      <Link
        to={langHref('/bio', lang)}
        className="mb-4 block rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-5 transition-colors hover:border-terminal-green/50 hover:bg-terminal-green/10"
      >
        <div className="mb-1 flex items-center gap-3">
          <span className="font-semibold text-white/90">{copy.bioOsTitle}</span>
          <span className="rounded-md border border-terminal-green/30 bg-terminal-green/10 px-2 py-0.5 font-mono text-[10px] text-terminal-green/90">{copy.bioOsBadge}</span>
        </div>
        <p className="font-mono text-xs leading-relaxed text-white/50">{copy.bioOsDesc}</p>
      </Link>

      <div className="grid grid-cols-1 gap-4">
        {orderedTools.map((t) => (
          <Link
            key={t.slug}
            to={langHref(`/tools/${t.slug}`, lang)}
            className="block rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
          >
            <div className="mb-1 flex items-center gap-3">
              <span className="font-semibold text-white/90">{t.name}</span>
              <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-2 py-0.5 font-mono text-[10px] text-terminal-green/80">{copy.liveLabel}</span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/50">{t.blurb}</p>
          </Link>
        ))}
      </div>

      {/* ── SEO / answer-engine body ─────────────────────────────────────── */}
      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{copy.aboutHeading}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/65">
          <p>{copy.aboutP1}</p>
          <p>
            {copy.aboutP2Pre}
            <Link to={langHref('/measurements', lang)} className="text-terminal-green hover:underline">{copy.measuresLink}</Link>
            {copy.aboutP2Mid}
            <Link to={langHref('/research', lang)} className="text-terminal-green hover:underline">{copy.researchLink}</Link>
            {copy.aboutP2Post}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {DOMAIN_CATS.map((cats, i) => {
            const count = TOOLS.filter((t) => cats.includes(t.category)).length
            if (count === 0) return null
            const d = copy.domains[i]
            return (
              <div key={i}>
                <h3 className="mb-1.5 font-semibold text-white/90">
                  {d.title}
                  <span className="ml-2 font-mono text-[11px] font-normal text-white/35">
                    {toolCountLabel(count, lang)}
                  </span>
                </h3>
                <p className="font-mono text-sm leading-relaxed text-white/60">{d.body}</p>
              </div>
            )
          })}
        </div>

        <h3 className="mt-10 mb-2 font-semibold text-white/90">{copy.readHeading}</h3>
        <p className="font-mono text-sm leading-relaxed text-white/60">{copy.readBody}</p>

        <p className="mt-8 font-mono text-sm leading-relaxed text-white/60">
          {copy.ctaPre}
          <Link to={langHref('/product', lang)} className="text-terminal-green hover:underline">{copy.seeLink}</Link>
          {copy.ctaMid}
          <Link to={langHref('/compare', lang)} className="text-terminal-green hover:underline">{copy.compareLink}</Link>
          {copy.ctaPost}
        </p>
      </section>
    </main>
  )
}
