/**
 * /hrv-vs-coherence — cornerstone explainer: HRV vs coherence, the difference,
 * and how ONDA uses each. Informational-first, honest, bridges to the product.
 * EN-only. Self-contained meta + Article + FAQPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/hrv-vs-coherence`
const AUTHOR_ID = `${SITE_URL}/#author`
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

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is the difference between HRV and coherence?',
    a: 'HRV (heart-rate variability) is the raw variation in time between heartbeats — a measured signal. Coherence describes how smooth, regular and rhythmic that variation is, especially as it lines up with your breathing. HRV is the number; coherence is a measure of the pattern’s quality in the moment.',
  },
  {
    q: 'Is a high coherence score the same as high HRV?',
    a: 'They’re related but not identical. When you breathe at your resonance frequency, HRV rises and the heart rhythm becomes smooth and wave-like — high coherence. But HRV can be high in a noisy, irregular way too (e.g. from arrhythmia). Coherence specifically rewards a clean, organised oscillation, not just raw variability.',
  },
  {
    q: 'Which should I pay attention to?',
    a: 'For in-the-moment breathing practice, coherence is the useful live guide — it shows whether you’re organising your heart rhythm right now. For long-term recovery and adaptation, your resting-HRV trend over weeks is the signal to watch. They answer different questions.',
  },
  {
    q: 'Is coherence a medical or scientific measurement?',
    a: 'No. HRV is a well-defined physiological measure (e.g. RMSSD, SDNN). A coherence score is a derived practice metric — useful real-time feedback, but not a clinical biomarker and not standardised across apps.',
  },
  {
    q: 'How does ONDA use HRV and coherence?',
    a: 'ONDA measures HRV from your heartbeat (iPhone camera or Apple Watch) and shows a live coherence score during practice so you can see your rhythm organise as you breathe. Over time it tracks your resting-HRV trend. Coherence guides the session; the HRV trend tracks progress.',
  },
]

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-20">
      <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">{kicker}</div>
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">{children}</div>
    </section>
  )
}

export function HrvVsCoherencePage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'HRV vs Coherence: What’s the Difference? | ONDA Life'
    const desc =
      'HRV vs coherence explained: HRV is the raw variation between heartbeats; coherence is how smooth and rhythmic that variation is as you breathe. Which to watch, and how ONDA uses each.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'article', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)

    setOrCreateScript('ld-hrvcoh-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'HRV vs Coherence: What’s the Difference?',
      description: desc,
      url: PAGE_URL,
      inLanguage: 'en',
      author: { '@id': AUTHOR_ID },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      about: ['Heart rate variability', 'Cardiac coherence'],
    })
    setOrCreateScript('ld-hrvcoh-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })

    return () => {
      for (const id of ['ld-hrvcoh-article', 'ld-hrvcoh-faq']) {
        const el = document.getElementById(id)
        if (el) el.remove()
      }
    }
  }, [location])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ HRV VS COHERENCE ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">HRV vs Coherence: What’s the Difference?</h1>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">
          <strong className="text-white">HRV (heart-rate variability) is the raw variation in time between
          your heartbeats. Coherence is how smooth, regular and rhythmic that variation is</strong> — how
          cleanly your heart rhythm rises and falls with your breath. HRV is the measured signal; coherence
          is a measure of the pattern’s quality in the moment. They’re often confused, but they answer
          different questions.
        </p>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="On this page">
        {[
          ['hrv', 'What HRV is'],
          ['coherence', 'What coherence is'],
          ['difference', 'The difference'],
          ['which', 'Which to watch'],
          ['onda', 'How ONDA uses each'],
          ['faq', 'FAQ'],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">
            {label}
          </a>
        ))}
      </nav>

      <Section id="hrv" kicker="[ HRV ]" title="What HRV is">
        <p>
          Heart-rate variability is the variation in the time between consecutive heartbeats. It’s a measured
          physiological quantity, reported as numbers like <strong className="text-white">RMSSD</strong> (the
          short-term, beat-to-beat measure most tied to vagal activity) or <strong className="text-white">SDNN</strong>{' '}
          (overall variability). Higher short-term HRV generally reflects stronger parasympathetic activity
          and better recovery — within a person.
        </p>
      </Section>

      <Section id="coherence" kicker="[ COHERENCE ]" title="What coherence is">
        <p>
          Coherence isn’t a different measurement — it’s a description of the <em>shape</em> of your
          heart-rhythm variation. When you breathe slowly and evenly at your resonance frequency, the
          heart-rate oscillation becomes large, smooth and regular, synchronised with your breath. A
          coherence score summarises how clean and organised that oscillation is over a rolling window.
        </p>
      </Section>

      <Section id="difference" kicker="[ THE DIFFERENCE ]" title="HRV vs coherence, side by side">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody className="font-mono text-xs md:text-sm">
              <tr className="border-b border-white/15">
                <td className="w-32 py-3 pr-4 text-white/45">What it is</td>
                <td className="py-3 pr-4 text-white/75">HRV: raw variation between beats</td>
                <td className="py-3 text-white/75">Coherence: quality/smoothness of that variation</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 pr-4 text-white/45">Type</td>
                <td className="py-3 pr-4 text-white/75">Measured (RMSSD/SDNN)</td>
                <td className="py-3 text-white/75">Derived practice metric</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 pr-4 text-white/45">Best for</td>
                <td className="py-3 pr-4 text-white/75">Long-term recovery trend</td>
                <td className="py-3 text-white/75">In-the-moment breathing feedback</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white/45">Standardised?</td>
                <td className="py-3 pr-4 text-white/75">Yes — defined metrics</td>
                <td className="py-3 text-white/75">No — varies by app</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The key nuance: HRV can be high in a <em>noisy</em>, irregular way, but coherence specifically
          rewards a clean, organised oscillation. High coherence usually comes with a rise in HRV; high HRV
          doesn’t always mean high coherence.
        </p>
      </Section>

      <Section id="which" kicker="[ WHICH TO WATCH ]" title="Which one should you watch?">
        <p>
          Both — for different jobs. During a breathing session, <strong className="text-white">coherence</strong>{' '}
          is the useful live guide: it tells you whether you’re organising your heart rhythm right now. For
          progress over time, your <strong className="text-white">resting-HRV trend</strong> across weeks is
          the honest signal of recovery and adaptation. Chasing a single coherence number outside practice,
          or a single day’s HRV reading, is a mistake.
        </p>
      </Section>

      <Section id="onda" kicker="[ HOW ONDA USES EACH ]" title="How ONDA uses HRV and coherence">
        <p>
          ONDA measures HRV from your heartbeat (iPhone camera or Apple Watch) and shows a{' '}
          <strong className="text-white">live coherence score</strong> during practice, so you can see your
          rhythm organise as you breathe — the in-the-moment guide. Over time it tracks your{' '}
          <strong className="text-white">resting-HRV trend</strong> as the measure of progress. See exactly{' '}
          <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>,{' '}
          <Link to="/how-it-works" className="text-terminal-green hover:underline">how it computes coherence</Link>, and{' '}
          <Link to="/hrv-biofeedback" className="text-terminal-green hover:underline">HRV biofeedback</Link> overall.
        </p>
      </Section>

      <section id="faq" className="mt-14 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">Frequently asked questions</h2>
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
