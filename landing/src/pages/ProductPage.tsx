/**
 * /product — the canonical, machine-readable product page for ONDA Life.
 *
 * A factual spec sheet an AI can lift cleanly: what ONDA is, the Product
 * Facts table (kept in sync with the App Store listing), what it does, and
 * who it is / isn't for. Complements /measurements (what it measures) and
 * /how-it-works (the method).
 *
 * Honesty rules:
 *   - iOS only today (iPhone / iPad / Apple Watch). Android is a WAITLIST,
 *     not a shipping app — never list Android as available.
 *   - Free to start, no account. There is an optional subscription; do not
 *     invent a specific price.
 *   - Health data is read via HealthKit and stays on device.
 *
 * EN-only. Self-contained meta + SoftwareApplication JSON-LD (mobile app,
 * HealthApplication, free offer, App Store downloadUrl).
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appStoreUrl, APP_STORE_ID } from '../config/appStore'
import { ONDA_CAPS, getOndaVs, type Cap, type CapabilityAxis } from '../data/onda-vs'
import { langFromPath } from '../i18n'
import { PRODUCT_I18N, type ProductCopy } from '../data/product-i18n'

const CAP_GLYPH: Record<Cap, string> = { yes: '✓', limited: '~', no: '—' }
const CAP_CLASS: Record<Cap, string> = {
  yes: 'text-terminal-green',
  limited: 'text-amber-300',
  no: 'text-white/25',
}
// A focused "why ONDA" mini-matrix: the axes that most separate ONDA from a
// passive tracker (Oura) and a meditation app (Headspace).
const WHY_ROWS: CapabilityAxis[] = [
  'Real-time HRV biofeedback (live feedback as you breathe)',
  'Live coherence score',
  'Works with no wearable or chest strap (iPhone camera)',
  'Structured, progressive program',
]

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/product`
const APP_STORE_CANONICAL = `https://apps.apple.com/app/id${APP_STORE_ID}`

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

/** SoftwareApplication JSON-LD (one canonical app entity), emitted statically
 *  by meta-inject for /product and its localized routes. */
export function productJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${PAGE_URL}#app`,
      name: 'ONDA Life',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'iOS, watchOS',
      description:
        'Structured HRV biofeedback training: guided breathing with live heart-rhythm feedback, across an 8-level path for your nervous system.',
      url: PAGE_URL,
      downloadUrl: APP_STORE_CANONICAL,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      isAccessibleForFree: true,
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    },
  ]
}

/** English copy — the built-in default; ru/es overlay from PRODUCT_I18N. */
const EN_COPY: ProductCopy = {
  metaTitle: 'ONDA Life — HRV Biofeedback & Guided Breathing App | Product',
  metaDescription:
    'ONDA Life is an HRV biofeedback and guided-breathing app for iPhone, iPad and Apple Watch: live heart-rhythm feedback, a coherence score, resonance breathing and resting-HRV trends. Free to start, no account.',
  heroPara:
    'ONDA Life is an HRV biofeedback and guided-breathing app for real-time physiological self-regulation and nervous-system training. It gives live heart-rhythm feedback during paced (resonance) breathing — using your Apple Watch or iPhone camera — and tracks your resting-HRV trend across an 8-level practice path.',
  cta: 'Get ONDA on the App Store →',
  factsHeading: 'Product facts',
  facts: [
    { label: 'Name', value: 'ONDA Life' },
    { label: 'Category', value: 'Health & Fitness (HRV biofeedback & guided breathing)' },
    { label: 'Platforms', value: 'iPhone, iPad, Apple Watch (iOS / watchOS)' },
    { label: 'Android', value: 'Not yet available — waitlist only' },
    { label: 'Price', value: 'Free to start, no account. Optional subscription for full access.' },
    { label: 'Sensors', value: 'iPhone camera pulse (PPG) and Apple Watch heart data — no extra wearable required' },
    { label: 'Data & privacy', value: 'Heart data read via Apple HealthKit; health data stays on your device' },
    { label: 'First reading', value: 'About 90 seconds, no sign-up' },
  ],
  appStoreLabel: 'App Store',
  doesHeading: 'What it does',
  does: [
    'Real-time HRV biofeedback — see your heart rhythm respond live as you breathe',
    'A live coherence score during each paced-breathing session',
    'Guided resonance breathing (about six breaths a minute)',
    'Resting-HRV trend tracking over days and weeks',
    'A structured, 8-level practice path for your nervous system',
    'Works with the iPhone camera or an Apple Watch you already own',
  ],
  doesFootnotePre: 'For exactly which numbers are measured, derived or estimated, see ',
  measuresLink: 'what ONDA measures',
  doesFootnoteMid: '; for the method, ',
  howLink: 'how it works',
  whyHeading: 'Why ONDA',
  whyDesc: 'What sets ONDA apart from a passive tracker and a meditation app.',
  whyColTracker: 'A tracker (Oura)',
  whyColMeditation: 'A meditation app (Headspace)',
  whyRows: [
    'Real-time HRV biofeedback',
    'Live coherence score',
    'Works with no wearable (iPhone camera)',
    'Structured, progressive program',
  ],
  forHeading: 'ONDA is for',
  forItems: [
    'People who want to actively train their nervous system, not just track it',
    'Apple Watch owners, and anyone who wants HRV biofeedback with no extra wearable',
    'People who want physiological feedback during breathwork — to feel it working',
    'Anyone who dislikes passive readiness scores and wants something to practise',
  ],
  notForHeading: 'ONDA is not for',
  notForItems: [
    'Diagnosis, or treatment of any medical condition — ONDA is not a medical device',
    'Replacing psychotherapy or medical care',
    'Sleep tracking — ONDA is not a sleep tracker',
    'A large general meditation or sleep-story library',
  ],
  crossPre: 'See how ONDA compares to other apps and wearables on the ',
  compareLink: 'compare hub',
  crossMid: ', or read the evidence it rests on in ',
  researchLink: 'the science behind ONDA',
}

/** Alternate-language URL prefix for a given lang ('' for en). */
function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

export function ProductPage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const copy: ProductCopy = lang === 'ru' || lang === 'es' ? PRODUCT_I18N[lang] : EN_COPY
  const p = prefixFor(lang)

  useEffect(() => {
    const title = copy.metaTitle
    const desc = copy.metaDescription
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', `${SITE_URL}${p}/product`, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    // hreflang alternates for the localized product pages.
    const setAlt = (hl: string, href: string) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hl}"]`)
      if (!el) {
        el = document.createElement('link')
        el.rel = 'alternate'
        el.hreflang = hl
        el.setAttribute('data-product-alt', '1')
        document.head.appendChild(el)
      }
      el.href = href
    }
    setAlt('en', `${SITE_URL}/product`)
    setAlt('ru', `${SITE_URL}/ru/product`)
    setAlt('es', `${SITE_URL}/es/product`)
    setAlt('x-default', `${SITE_URL}/product`)

    // SoftwareApplication JSON-LD emitted statically by meta-inject (productJsonLd).

    return () => {
      document.querySelectorAll('link[data-product-alt]').forEach((n) => n.remove())
    }
  }, [copy, p])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ PRODUCT ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">ONDA Life</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">{copy.heroPara}</p>
        <a
          href={appStoreUrl('product_page')}
          className="mt-8 inline-block rounded border border-terminal-green/40 px-4 py-2 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/10"
        >
          {copy.cta}
        </a>
      </header>

      {/* PRODUCT FACTS */}
      <section className="pt-12">
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">{copy.factsHeading}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {copy.facts.map((f) => (
                <tr key={f.label} className="border-b border-white/10 align-top">
                  <th className="w-40 py-3 pr-4 text-left font-mono text-xs uppercase tracking-wider text-white/45">
                    {f.label}
                  </th>
                  <td className="py-3 text-white/75">{f.value}</td>
                </tr>
              ))}
              <tr className="align-top">
                <th className="w-40 py-3 pr-4 text-left font-mono text-xs uppercase tracking-wider text-white/45">
                  {copy.appStoreLabel}
                </th>
                <td className="py-3">
                  <a
                    href={appStoreUrl('product_facts')}
                    className="text-terminal-cyan hover:text-terminal-green break-all"
                  >
                    {APP_STORE_CANONICAL}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="pt-14">
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">{copy.doesHeading}</h2>
        <ul className="space-y-2 font-mono text-sm text-white/70">
          {copy.does.map((d) => (
            <li key={d} className="flex gap-3">
              <span className="text-terminal-green">✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-xs leading-relaxed text-white/50">
          {copy.doesFootnotePre}
          <Link to="/measurements" className="text-terminal-green hover:underline">{copy.measuresLink}</Link>
          {copy.doesFootnoteMid}
          <Link to="/how-it-works" className="text-terminal-green hover:underline">{copy.howLink}</Link>.
        </p>
      </section>

      {/* WHY ONDA — focused mini capability matrix vs a tracker + a meditation app */}
      {(() => {
        const oura = getOndaVs('onda-vs-oura')
        const head = getOndaVs('onda-vs-headspace')
        if (!oura || !head) return null
        const cols: { label: string; caps: Record<CapabilityAxis, Cap>; onda?: boolean }[] = [
          { label: 'ONDA', caps: ONDA_CAPS, onda: true },
          { label: copy.whyColTracker, caps: oura.them },
          { label: copy.whyColMeditation, caps: head.them },
        ]
        return (
          <section className="pt-14">
            <h2 className="mb-1 text-2xl font-bold tracking-tight md:text-3xl">{copy.whyHeading}</h2>
            <p className="mb-4 font-mono text-xs text-white/45">
              {copy.whyDesc}{' '}
              <span className="text-terminal-green">✓</span> yes ·{' '}
              <span className="text-amber-300">~</span> limited ·{' '}
              <span className="text-white/30">—</span> no
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/20 font-mono text-[11px] uppercase tracking-wider text-white/50">
                    <th className="py-3 pr-4 font-medium">Capability</th>
                    {cols.map((c) => (
                      <th key={c.label} className={`px-2 py-3 text-center font-medium ${c.onda ? 'text-terminal-green' : 'text-white/60'}`}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WHY_ROWS.map((cap, i) => (
                    <tr key={cap} className="border-b border-white/10">
                      <td className="min-w-[200px] py-3 pr-4 align-top text-white/75">{copy.whyRows[i] ?? cap}</td>
                      {cols.map((c) => (
                        <td key={c.label} className={`px-2 py-3 text-center font-mono ${CAP_CLASS[c.caps[cap]]}`}>
                          {CAP_GLYPH[c.caps[cap]]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[11px] text-white/40">
              {copy.crossPre}
              <Link to="/compare" className="text-terminal-green hover:underline">{copy.compareLink}</Link>.
            </p>
          </section>
        )
      })()}

      {/* WHO IT'S FOR / NOT FOR */}
      <section className="pt-14 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-terminal-green/25 bg-terminal-green/5 p-5">
          <h2 className="mb-3 text-lg font-bold text-white">{copy.forHeading}</h2>
          <ul className="space-y-2 font-mono text-xs leading-relaxed text-white/75">
            {copy.forItems.map((x) => (
              <li key={x} className="flex gap-2"><span className="text-terminal-green">✓</span><span>{x}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
          <h2 className="mb-3 text-lg font-bold text-white">{copy.notForHeading}</h2>
          <ul className="space-y-2 font-mono text-xs leading-relaxed text-white/60">
            {copy.notForItems.map((x) => (
              <li key={x} className="flex gap-2"><span className="text-amber-300">✕</span><span>{x}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* CROSS-LINKS */}
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.02] p-6 font-mono text-sm leading-relaxed text-white/70">
        {copy.crossPre}
        <Link to="/compare" className="text-terminal-green hover:underline">{copy.compareLink}</Link>
        {copy.crossMid}
        <Link to="/research" className="text-terminal-green hover:underline">{copy.researchLink}</Link>.
      </section>
    </main>
  )
}
