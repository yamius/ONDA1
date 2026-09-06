/**
 * /measurements — "What ONDA actually measures".
 *
 * The single most machine-verifiable, citable page on the site: a signal
 * table separating what ONDA measures directly, what it derives, and what
 * it estimates (interpretation) — plus an explicit "what ONDA does NOT
 * measure / claim" register.
 *
 * Honesty rules (do not break):
 *   - "Directly measured" only for heart rate and the HRV computed from
 *     real beat intervals (Apple Watch / HealthKit; iPhone camera PPG at rest).
 *   - Coherence is DERIVED (a synchronization metric), never "measured".
 *   - Stress and Energy are ESTIMATES / interpretations, never biomarkers.
 *   - Never list steps / calories / VO2max / sleep stages / glucose / cortisol
 *     / BDNF / EEG as measured — the app does not surface them.
 *   - ONDA is not a medical or diagnostic device.
 *
 * EN-only, mirrors ResearchPage: self-contained meta + WebPage + FAQPage
 * JSON-LD. No fabricated claims.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MEASUREMENTS_FAQ } from '../data/measurements-faq'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/measurements`
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

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

type Kind = 'measured' | 'derived' | 'estimated'

interface SignalRow {
  signal: string
  source: string
  kind: Kind
  meaning: string
}

/** The canonical signal table. Order: hardware-truth first, interpretation last. */
const SIGNALS: SignalRow[] = [
  {
    signal: 'Heart rate',
    source: 'Apple Watch optical sensor, or iPhone camera pulse (PPG)',
    kind: 'measured',
    meaning: 'Beats per minute, read live during a session and at rest.',
  },
  {
    signal: 'HRV (RMSSD / SDNN)',
    source: 'Beat-to-beat (RR) intervals from Apple Watch / Apple Health; camera PPG at rest',
    kind: 'measured',
    meaning:
      'Heart-rate variability — the variation between heartbeats, the core recovery/autonomic signal.',
  },
  {
    signal: 'Coherence',
    source: 'Cardiac rhythm + breathing pace during a paced-breathing session',
    kind: 'derived',
    meaning:
      'A synchronization score: how smoothly and rhythmically your heart rhythm oscillates with your breath. A feedback metric, not a clinical biomarker.',
  },
  {
    signal: 'Resting-HRV trend',
    source: 'Your own HRV readings aggregated over days and weeks',
    kind: 'derived',
    meaning:
      'Your personal baseline and its direction over time — the long-term signal ONDA is designed to move.',
  },
  {
    signal: 'Stress',
    source: 'HR and HRV patterns',
    kind: 'estimated',
    meaning:
      'ONDA’s interpretation of your current physiological state — an estimate, not a measurement of "stress" and not a diagnosis.',
  },
  {
    signal: 'Energy',
    source: 'HR and HRV patterns',
    kind: 'estimated',
    meaning:
      'ONDA’s interpretation of readiness / activation — an estimate derived from the same signals, not a directly measured quantity.',
  },
]

const KIND_LABEL: Record<Kind, string> = {
  measured: 'Directly measured',
  derived: 'Derived',
  estimated: 'Estimated',
}

const KIND_CLASS: Record<Kind, string> = {
  measured: 'text-terminal-green border-terminal-green/40',
  derived: 'text-cyan-300 border-cyan-300/40',
  estimated: 'text-amber-300 border-amber-300/40',
}

/** Things ONDA deliberately does NOT measure — the honesty backstop. */
const NOT_MEASURED: string[] = [
  'Blood glucose, cortisol, BDNF or any blood/hormone biomarker',
  'Brain activity (EEG), brain waves or "gamma coherence"',
  'Sleep stages — ONDA is not a sleep tracker',
  'Steps, calories or VO₂max — ONDA does not read your fitness data',
  'Any diagnostic or medical output — ONDA is not a medical device',
]

const FAQ = MEASUREMENTS_FAQ

export function MeasurementsPage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'What ONDA Measures — HRV, Coherence & What’s Estimated | ONDA Life'
    const desc =
      'Exactly what ONDA measures directly (heart rate, HRV), what it derives (coherence, resting-HRV trend) and what it estimates (stress, energy) — plus what it does not measure. Honest, machine-verifiable.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)

    setOrCreateScript('ld-measurements-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: title,
      description: desc,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL },
      about: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    })

    return () => {
      const el = document.getElementById('ld-measurements-webpage')
      if (el) el.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">
          [ WHAT ONDA MEASURES ]
        </div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          What ONDA actually measures.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Words like HRV, coherence, stress and energy sit side by side in the
          app — but they are not the same kind of number. Some are measured
          directly from your heart, some are derived, and some are ONDA&rsquo;s
          estimate. Here is exactly which is which, so you (and any system
          citing us) never have to guess.
        </p>
      </header>

      {/* LEGEND */}
      <section className="pt-10">
        <div className="flex flex-wrap gap-3 font-mono text-xs">
          {(['measured', 'derived', 'estimated'] as Kind[]).map((k) => (
            <span key={k} className={`rounded border px-3 py-1.5 ${KIND_CLASS[k]}`}>
              {KIND_LABEL[k]}
            </span>
          ))}
        </div>
      </section>

      {/* SIGNAL TABLE */}
      <section className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 font-mono text-xs uppercase tracking-wider text-white/50">
                <th className="py-3 pr-4">Signal</th>
                <th className="py-3 pr-4">Source</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3">What it means</th>
              </tr>
            </thead>
            <tbody>
              {SIGNALS.map((row) => (
                <tr key={row.signal} className="border-b border-white/10 align-top">
                  <td className="py-4 pr-4 font-semibold text-white">{row.signal}</td>
                  <td className="py-4 pr-4 text-white/70">{row.source}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-block whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[11px] ${KIND_CLASS[row.kind]}`}
                    >
                      {KIND_LABEL[row.kind]}
                    </span>
                  </td>
                  <td className="py-4 text-white/70">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHAT ONDA DOES NOT MEASURE */}
      <section className="pt-14">
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          What ONDA does <span className="text-amber-300">not</span> measure.
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70">
          Just as important as what we track. ONDA is a heart-signal app — it
          does not read the following, and does not claim to:
        </p>
        <ul className="space-y-2 font-mono text-sm text-white/70">
          {NOT_MEASURED.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-amber-300">✕</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW IT'S COMPUTED — link out */}
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.02] p-6">
        <p className="font-mono text-sm leading-relaxed text-white/70">
          For the method behind each number — how HRV is computed from beat
          intervals, and how the coherence score is built — see{' '}
          <Link to="/how-it-works" className="text-terminal-green hover:underline">
            how ONDA works
          </Link>
          . For the evidence these signals rest on, see{' '}
          <Link to="/research" className="text-terminal-green hover:underline">
            the science behind ONDA
          </Link>
          , and to read your own HRV against population norms, the{' '}
          <Link to="/tools/hrv" className="text-terminal-green hover:underline">
            HRV interpreter
          </Link>
          .
        </p>
      </section>

      {/* FAQ */}
      <section className="pt-14">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
          Questions
        </h2>
        <div className="space-y-6">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-6">
              <h3 className="mb-2 font-semibold text-white">{f.q}</h3>
              <p className="font-mono text-sm leading-relaxed text-white/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
