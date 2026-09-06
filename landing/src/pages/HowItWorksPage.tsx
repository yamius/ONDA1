/**
 * /how-it-works — "How ONDA works".
 *
 * The technical-methodology companion to /measurements. Describes the
 * biofeedback loop and, at an honest conceptual level, how HRV and the
 * coherence score are computed — the concrete technical objects AI systems
 * match against a "real-time HRV biofeedback app" query.
 *
 * Honesty rules: describe method at the level we can actually stand behind
 * (RMSSD from beat intervals; coherence as a synchronization score over a
 * rolling window). Do NOT invent exact sampling rates, proprietary
 * coefficients or algorithm internals we cannot verify. Always state the
 * boundaries: coherence is not a biomarker, ONDA is not a medical device.
 *
 * EN-only, mirrors ResearchPage / MeasurementsPage: self-contained meta +
 * WebPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/how-it-works`
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

interface LoopStep {
  n: string
  title: string
  body: string
}

const LOOP: LoopStep[] = [
  { n: '1', title: 'Signal in', body: 'ONDA reads your heartbeat — from the Apple Watch optical sensor (or Apple Health), or from the iPhone camera measuring the colour change in your fingertip (photoplethysmography, PPG).' },
  { n: '2', title: 'Beat intervals', body: 'From that signal ONDA extracts the time between consecutive heartbeats — the beat-to-beat (RR) intervals. This series is the raw material for every heart-rhythm number.' },
  { n: '3', title: 'HRV + rhythm', body: 'ONDA computes HRV from the variation in those intervals, and tracks the shape of the heart-rhythm wave in real time as you breathe.' },
  { n: '4', title: 'Live feedback', body: 'The current rhythm and a coherence score are shown live, so you can see your body respond to each breath — the biofeedback loop that makes ONDA an active trainer, not a passive tracker.' },
  { n: '5', title: 'Paced breathing', body: 'A visual pacer guides you toward slow, even breaths near your resonance frequency (roughly 5–6 breaths per minute), the pace that most strongly organizes the heart rhythm.' },
  { n: '6', title: 'Trend over time', body: 'Session by session, ONDA records your resting-HRV baseline and its direction — the long-term signal the practice is designed to move.' },
]

export function HowItWorksPage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'How ONDA Works — HRV, Coherence & the Biofeedback Loop | ONDA Life'
    const desc =
      'How ONDA works: from Apple Watch or iPhone-camera pulse to beat intervals, HRV (RMSSD/SDNN), a live coherence score and paced resonance breathing — explained with its limits.'
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

    setOrCreateScript('ld-howitworks-webpage', {
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
      const el = document.getElementById('ld-howitworks-webpage')
      if (el) el.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">
          [ HOW ONDA WORKS ]
        </div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          How ONDA works.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          ONDA turns your heartbeat into a live signal you can train against.
          Here is the loop — from raw pulse to HRV to the coherence score you
          see on screen — and, just as importantly, what each number is and
          is not.
        </p>
      </header>

      {/* THE LOOP */}
      <section className="pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">The biofeedback loop</h2>
        <ol className="space-y-5">
          {LOOP.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-terminal-green/40 font-mono text-sm text-terminal-green">
                {s.n}
              </span>
              <div>
                <h3 className="mb-1 font-semibold text-white">{s.title}</h3>
                <p className="font-mono text-sm leading-relaxed text-white/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* HOW HRV IS COMPUTED */}
      <section className="pt-14">
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">How ONDA computes HRV</h2>
        <p className="mb-4 font-mono text-sm leading-relaxed text-white/70">
          Heart-rate variability is the variation in the time between
          heartbeats. ONDA computes it from the beat-to-beat (RR) interval
          series — primarily as <strong className="text-white">RMSSD</strong>{' '}
          (the root mean square of successive differences), the short-term
          measure most closely tied to parasympathetic (vagal) activity, and
          reports <strong className="text-white">SDNN</strong> where a broader
          window applies. On Apple Watch, ONDA can use the HRV that Apple Health
          already derives; from the iPhone camera, it computes HRV from the
          pulse waveform at rest.
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/70">
          A clean reading needs a stable signal and a short quiet window. Motion,
          a poor camera contact or an irregular rhythm add noise, so readings are
          most reliable at rest; when the signal is too poor to trust, ONDA asks
          you to retake it rather than showing a number it cannot stand behind.
        </p>
      </section>

      {/* HOW COHERENCE IS COMPUTED */}
      <section className="pt-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">How ONDA computes coherence</h2>
        <p className="mb-4 font-mono text-sm leading-relaxed text-white/70">
          When you breathe slowly and evenly, your heart rate rises and falls in
          a smooth wave that tracks your breath (respiratory sinus arrhythmia).
          ONDA&rsquo;s <strong className="text-white">coherence score</strong>{' '}
          reflects how smooth, regular and large that oscillation is over a
          rolling window — in other words, how well your heart rhythm is
          organized by your breathing right now. Higher, steadier breathing near
          your resonance frequency tends to raise it.
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/70">
          What it is <em>not</em>: coherence is a real-time practice metric, not
          a clinical biomarker, not a measure of &ldquo;how healthy&rdquo; you
          are, and not comparable across different people as a score of merit.
          It is a mirror for your practice in the moment.
        </p>
      </section>

      {/* BOUNDARIES */}
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-3 text-lg font-bold text-white">The boundaries</h2>
        <ul className="space-y-2 font-mono text-sm text-white/70">
          <li>• HRV is not a direct measure of &ldquo;stress&rdquo;; a higher HRV is not automatically better in every context.</li>
          <li>• The coherence score is not a clinical or diagnostic biomarker.</li>
          <li>• ONDA is not a medical device and does not diagnose, treat or monitor any condition.</li>
        </ul>
        <p className="mt-4 font-mono text-sm leading-relaxed text-white/70">
          For exactly which numbers are measured, derived or estimated, see{' '}
          <Link to="/measurements" className="text-terminal-green hover:underline">
            what ONDA measures
          </Link>
          ; for the evidence behind the method, see{' '}
          <Link to="/research" className="text-terminal-green hover:underline">
            the science behind ONDA
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
