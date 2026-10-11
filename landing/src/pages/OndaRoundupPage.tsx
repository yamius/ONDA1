/**
 * /compare/<roundup-slug> — ONDA Life's OWN ranked "top X" guide, on the
 * /compare side (never the independent /reviews system). Rendered via the
 * CompareSlugRouter dispatcher alongside the pairwise onda-vs pages.
 *
 * Honesty: a visible transparency banner says this is ONDA's own guide, ONDA
 * is ranked #1 only in categories where it genuinely leads, and the bottom
 * line states plainly what ONDA is NOT best at and who to buy instead.
 *
 * Localized at /<lang>/compare/<slug> from public/locales/<lang>/onda-guides.json
 * (schema `roundups` in src/data/i18n-schema.ts; released via the queue). Never in
 * reviews.json — ONDA's own guides stay out of the independent /reviews system.
 * Self-contained meta + ItemList + FAQPage JSON-LD.
 */
import AppStoreCTA, { ctaVariantForCompareSlug } from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getRoundup, CAP_PROFILES } from '../data/onda-roundups'
import { CAPABILITIES, type Cap } from '../data/onda-vs'
import { NotFoundPage } from './NotFoundPage'
import { useTranslation } from 'react-i18next'
import { langFromPath, langHref, homePathFor } from '../i18n'

const SITE_URL = 'https://onda-life.com'

const CAP_GLYPH: Record<Cap, string> = { yes: '✓', limited: '~', no: '—' }
const CAP_CLASS: Record<Cap, string> = {
  yes: 'text-terminal-green',
  limited: 'text-amber-300',
  no: 'text-white/25',
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

function setOrCreateScript(id: string, json: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(json)
}

export function OndaRoundupPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const { t } = useTranslation('onda-guides')
  const base = slug ? getRoundup(slug) : undefined
  const ui = (k: string, d: string) => t(`ui.${k}`, { defaultValue: d })
  // Localized copy over the EN source (text only — ranks, links, caps stay EN data).
  const roundup = (() => {
    if (!base || lang === 'en') return base
    const k = `roundups.${base.slug}`
    const tr = (f: string, d: string) => t(`${k}.${f}`, { defaultValue: d })
    const ents = t(`${k}.entries`, { returnObjects: true, defaultValue: [] }) as { tag?: string; blurb?: string; pros?: string[]; cons?: string[] }[]
    const faq = t(`${k}.faq`, { returnObjects: true, defaultValue: [] }) as { q: string; a: string }[]
    return {
      ...base,
      title: tr('title', base.title),
      description: tr('description', base.description),
      intro: tr('intro', base.intro),
      bottomLine: tr('bottomLine', base.bottomLine),
      entries: base.entries.map((e, i) => ({
        ...e,
        tag: ents[i]?.tag ?? e.tag,
        blurb: ents[i]?.blurb ?? e.blurb,
        pros: ents[i]?.pros ?? e.pros,
        cons: ents[i]?.cons ?? e.cons,
      })),
      faq: Array.isArray(faq) && faq.length ? faq : base.faq,
    }
  })()
  const capLabels = t('capabilities', { returnObjects: true, defaultValue: [] }) as string[]
  const capLabel = (cap: string, i: number) => (lang !== 'en' && Array.isArray(capLabels) && capLabels[i]) || cap

  useEffect(() => {
    if (!roundup) return
    const pageUrl = `${SITE_URL}${lang === 'en' ? '' : `/${lang}`}/compare/${roundup.slug}`
    const title = `${roundup.title} (2026) | ONDA Life`
    const desc = roundup.description
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    setOrCreateScript('ld-roundup-itemlist', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#list`,
      name: roundup.title,
      description: desc,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: roundup.entries.map((e) => ({
        '@type': 'ListItem',
        position: e.rank,
        name: e.name,
        url: e.href.startsWith('/') ? `${SITE_URL}${langHref(e.href, lang)}` : e.href,
      })),
    })
    setOrCreateScript('ld-roundup-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: roundup.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })

    return () => {
      for (const id of ['ld-roundup-itemlist', 'ld-roundup-faq']) {
        const el = document.getElementById(id)
        if (el) el.remove()
      }
    }
  }, [roundup, location])

  if (!roundup) return <NotFoundPage />

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">{ui('home', 'Home')}</Link>
        <span>/</span>
        <Link to={langHref('/compare', lang)} className="transition-colors hover:text-white/50">{ui('compare', 'Compare')}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{roundup.title}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">[ {ui('topPicks', 'TOP PICKS')} ]</div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">{roundup.title}</h1>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/55">{roundup.intro}</p>

      {/* Transparency banner */}
      <div className="mb-10 rounded-lg border border-white/10 bg-white/[0.02] p-4 font-mono text-xs leading-relaxed text-white/50">
        {ui('transparency', 'This is ONDA Life’s own guide, and ONDA is one of the apps in it — so we rank it #1 only where it genuinely leads, name where each competitor wins, and say plainly below what ONDA is not best at.')}
      </div>

      {/* Capabilities at a glance — the same matrix as the /compare hub, scoped
          to this list's apps. Reuses CAP_PROFILES so it can't drift. */}
      <section className="mb-10">
        <h2 className="mb-1 text-lg font-bold tracking-tight md:text-xl">{ui('capsHeading', 'Capabilities at a glance')}</h2>
        <p className="mb-3 font-mono text-[11px] text-white/45">
          <span className="text-terminal-green">✓</span> {ui('yes', 'yes')} ·{' '}
          <span className="text-amber-300">~</span> {ui('limited', 'limited')} ·{' '}
          <span className="text-white/30">—</span> {ui('no', 'no')}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 font-mono text-[11px] uppercase tracking-wider text-white/50">
                <th className="py-3 pr-4 font-medium">{ui('capability', 'Capability')}</th>
                {roundup.entries.map((e) => (
                  <th
                    key={e.rank}
                    className={`px-2 py-3 text-center font-medium ${e.isOnda ? 'text-terminal-green' : 'text-white/60'}`}
                  >
                    {e.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((cap, ci) => (
                <tr key={cap} className="border-b border-white/10">
                  <td className="min-w-[220px] py-3 pr-4 align-top text-white/75">{capLabel(cap, ci)}</td>
                  {roundup.entries.map((e) => {
                    const v = CAP_PROFILES[e.capsKey][cap]
                    return (
                      <td key={e.rank} className={`px-2 py-3 text-center font-mono ${CAP_CLASS[v]}`}>
                        {CAP_GLYPH[v]}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ranked list */}
      <ol className="mb-10 space-y-4">
        {roundup.entries.map((e) => (
          <li
            key={e.rank}
            className={`rounded-xl border p-5 ${
              e.isOnda ? 'border-terminal-green/30 bg-terminal-green/5' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-mono text-lg font-bold text-terminal-green">#{e.rank}</span>
              <Link to={langHref(e.href, lang)} className="text-lg font-bold text-white hover:text-terminal-green">
                {e.name}
              </Link>
              {e.isOnda && (
                <span className="rounded border border-terminal-green/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-terminal-green">
                  {ui('ourApp', 'Our app')}
                </span>
              )}
            </div>
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-white/40">{e.tag}</div>
            <p className="mb-3 font-mono text-sm leading-relaxed text-white/70">{e.blurb}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">{ui('pros', 'Pros')}</div>
                <ul className="space-y-1 font-mono text-xs leading-relaxed text-white/65">
                  {e.pros.map((p) => (
                    <li key={p} className="flex gap-2"><span className="text-terminal-green">+</span><span>{p}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-300/80">{ui('cons', 'Cons')}</div>
                <ul className="space-y-1 font-mono text-xs leading-relaxed text-white/55">
                  {e.cons.map((c) => (
                    <li key={c} className="flex gap-2"><span className="text-amber-300">−</span><span>{c}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Bottom line — the honest boundary */}
      <section className="mb-10 rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-widest text-terminal-green/80">{ui('bottomLine', 'THE BOTTOM LINE')}</p>
        <p className="text-sm leading-relaxed text-white/85">{roundup.bottomLine}</p>
      </section>

      <AppStoreCTA ct={storeCt('cmp', roundup.slug, lang)} variant={ctaVariantForCompareSlug(roundup.slug)} lang={lang} />

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">{ui('questions', 'Questions')}</h2>
        <div className="space-y-6">
          {roundup.faq.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-6">
              <h3 className="mb-2 font-semibold text-white">{f.q}</h3>
              <p className="font-mono text-sm leading-relaxed text-white/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-links */}
      <section className="rounded-lg border border-white/10 bg-white/[0.02] p-6 font-mono text-sm leading-relaxed text-white/70">
        {ui('seeExactly', 'See exactly')}{' '}
        <Link to={langHref('/measurements', lang)} className="text-terminal-green hover:underline">{ui('whatMeasures', 'what ONDA measures')}</Link>,{' '}
        <Link to={langHref('/how-it-works', lang)} className="text-terminal-green hover:underline">{ui('howItWorks', 'how it works')}</Link>{ui('moreOn', ', and more head-to-heads on the')}{' '}
        <Link to={langHref('/compare', lang)} className="text-terminal-green hover:underline">{ui('compareHub', 'compare hub')}</Link>.
      </section>
    </div>
  )
}
