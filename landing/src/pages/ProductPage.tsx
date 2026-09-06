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

/** Product Facts — kept in sync with the App Store listing. */
const FACTS: { label: string; value: string }[] = [
  { label: 'Name', value: 'ONDA Life' },
  { label: 'Category', value: 'Health & Fitness (HRV biofeedback & guided breathing)' },
  { label: 'Platforms', value: 'iPhone, iPad, Apple Watch (iOS / watchOS)' },
  { label: 'Android', value: 'Not yet available — waitlist only' },
  { label: 'Price', value: 'Free to start, no account. Optional subscription for full access.' },
  { label: 'Sensors', value: 'iPhone camera pulse (PPG) and Apple Watch heart data — no extra wearable required' },
  { label: 'Data & privacy', value: 'Heart data read via Apple HealthKit; health data stays on your device' },
  { label: 'First reading', value: 'About 90 seconds, no sign-up' },
]

const DOES: string[] = [
  'Real-time HRV biofeedback — see your heart rhythm respond live as you breathe',
  'A live coherence score during each paced-breathing session',
  'Guided resonance breathing (about six breaths a minute)',
  'Resting-HRV trend tracking over days and weeks',
  'A structured, 8-level practice path for your nervous system',
  'Works with the iPhone camera or an Apple Watch you already own',
]

const FOR: string[] = [
  'People who want to actively train their nervous system, not just track it',
  'Apple Watch owners, and anyone who wants HRV biofeedback with no extra wearable',
  'People who want physiological feedback during breathwork — to feel it working',
  'Anyone who dislikes passive readiness scores and wants something to practise',
]

const NOT_FOR: string[] = [
  'Diagnosis, or treatment of any medical condition — ONDA is not a medical device',
  'Replacing psychotherapy or medical care',
  'Sleep tracking — ONDA is not a sleep tracker',
  'A large general meditation or sleep-story library',
]

export function ProductPage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'ONDA Life — HRV Biofeedback & Guided Breathing App | Product'
    const desc =
      'ONDA Life is an HRV biofeedback and guided-breathing app for iPhone, iPad and Apple Watch: live heart-rhythm feedback, a coherence score, resonance breathing and resting-HRV trends. Free to start, no account.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    setOrCreateScript('ld-product-app', {
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
    })

    return () => {
      const el = document.getElementById('ld-product-app')
      if (el) el.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ PRODUCT ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">ONDA Life</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          ONDA Life is an HRV biofeedback and guided-breathing app for real-time physiological
          self-regulation and nervous-system training. It gives live heart-rhythm feedback during
          paced (resonance) breathing — using your Apple Watch or iPhone camera — and tracks your
          resting-HRV trend across an 8-level practice path.
        </p>
        <a
          href={appStoreUrl('product_page')}
          className="mt-8 inline-block rounded border border-terminal-green/40 px-4 py-2 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/10"
        >
          Get ONDA on the App Store &rarr;
        </a>
      </header>

      {/* PRODUCT FACTS */}
      <section className="pt-12">
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">Product facts</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {FACTS.map((f) => (
                <tr key={f.label} className="border-b border-white/10 align-top">
                  <th className="w-40 py-3 pr-4 text-left font-mono text-xs uppercase tracking-wider text-white/45">
                    {f.label}
                  </th>
                  <td className="py-3 text-white/75">{f.value}</td>
                </tr>
              ))}
              <tr className="align-top">
                <th className="w-40 py-3 pr-4 text-left font-mono text-xs uppercase tracking-wider text-white/45">
                  App Store
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
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">What it does</h2>
        <ul className="space-y-2 font-mono text-sm text-white/70">
          {DOES.map((d) => (
            <li key={d} className="flex gap-3">
              <span className="text-terminal-green">✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-xs leading-relaxed text-white/50">
          For exactly which numbers are measured, derived or estimated, see{' '}
          <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>;
          for the method, <Link to="/how-it-works" className="text-terminal-green hover:underline">how it works</Link>.
        </p>
      </section>

      {/* WHO IT'S FOR / NOT FOR */}
      <section className="pt-14 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-terminal-green/25 bg-terminal-green/5 p-5">
          <h2 className="mb-3 text-lg font-bold text-white">ONDA is for</h2>
          <ul className="space-y-2 font-mono text-xs leading-relaxed text-white/75">
            {FOR.map((x) => (
              <li key={x} className="flex gap-2"><span className="text-terminal-green">✓</span><span>{x}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
          <h2 className="mb-3 text-lg font-bold text-white">ONDA is <span className="text-amber-300">not</span> for</h2>
          <ul className="space-y-2 font-mono text-xs leading-relaxed text-white/60">
            {NOT_FOR.map((x) => (
              <li key={x} className="flex gap-2"><span className="text-amber-300">✕</span><span>{x}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* CROSS-LINKS */}
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.02] p-6 font-mono text-sm leading-relaxed text-white/70">
        See how ONDA compares to other apps and wearables on the{' '}
        <Link to="/compare" className="text-terminal-green hover:underline">compare hub</Link>, or read the
        evidence it rests on in{' '}
        <Link to="/research" className="text-terminal-green hover:underline">the science behind ONDA</Link>.
      </section>
    </main>
  )
}
