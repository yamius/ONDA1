/**
 * /hrv-biofeedback — the cornerstone "bridge entity" page.
 *
 * Answers three questions in one authoritative place: what HRV biofeedback is,
 * whether it's evidence-based, and how ONDA implements it. Informational-first
 * (the definition and science stand on their own), then bridges to the product
 * honestly. Reuses the verified references from evidence.ts (real DOI/PMID).
 *
 * Honesty: cite the evidence at the level it supports; state plainly what HRV
 * does and does NOT tell you; ONDA is not a medical device.
 *
 * EN-only. Self-contained meta + Article + FAQPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { EVIDENCE_REFERENCES } from '../data/evidence'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/hrv-biofeedback`
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

const PAGE_TITLE = 'HRV Biofeedback: How It Works & the Evidence | ONDA Life'
const PAGE_DESC =
  'HRV biofeedback explained: what it is, how the real-time feedback loop works, what the evidence supports, how it differs from HRV tracking, and how ONDA implements it. Honest and cited.'

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is HRV biofeedback?',
    a: 'HRV biofeedback is a technique in which you see your heart-rate variability in real time and adjust your breathing in response — usually breathing slowly at your resonance frequency. The live feedback closes a loop that trains the autonomic nervous system, rather than just recording it.',
  },
  {
    q: 'Does HRV biofeedback actually work?',
    a: 'The acute effect is well established: paced breathing at resonance frequency raises HRV during the session and engages the parasympathetic system. Longer-term benefits for stress and self-regulation are supported but vary between people. It is one of the most evidence-grounded, low-risk self-regulation techniques available.',
  },
  {
    q: 'What is the difference between HRV biofeedback and HRV tracking?',
    a: 'HRV tracking passively records your HRV (often overnight) so you can watch trends — what rings and bands do. HRV biofeedback is active: you get live feedback while you breathe and train your heart rhythm in the moment. Tracking tells you how you recovered; biofeedback gives you something to do about it.',
  },
  {
    q: 'Do I need a chest strap for HRV biofeedback?',
    a: 'Not always. A chest strap gives the most accurate signal, but apps like ONDA use the iPhone camera (photoplethysmography) or an Apple Watch to give usable real-time feedback with no extra hardware.',
  },
  {
    q: 'How long does HRV biofeedback take to work?',
    a: 'You feel the acute effect immediately — HRV rises within a single session. Changes in your resting baseline, where they happen, tend to show over weeks of consistent practice rather than days, and the size of the change varies between people.',
  },
  {
    q: 'Is ONDA HRV biofeedback?',
    a: 'Yes. ONDA is an HRV biofeedback and guided-breathing app: it shows a live coherence score and your heart-rhythm response as you breathe, using the iPhone camera or an Apple Watch, inside a guided practice. It is not a medical device.',
  },
]

/** Article + FAQPage JSON-LD. Exported so meta-inject can emit it statically
 *  (prerender's renderToString never runs the useEffect that would add it). */
export function hrvBiofeedbackJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'HRV Biofeedback: What It Is, How It Works, and How ONDA Uses It',
      description: PAGE_DESC,
      url: PAGE_URL,
      inLanguage: 'en',
      author: { '@id': AUTHOR_ID },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      about: 'HRV biofeedback',
      citation: EVIDENCE_REFERENCES.map((r) => ({
        '@type': 'ScholarlyArticle',
        name: r.title,
        author: r.authors.split(', ').map((name) => ({ '@type': 'Person', name })),
        datePublished: String(r.year),
        isPartOf: { '@type': 'Periodical', name: r.journal },
        sameAs: [`https://doi.org/${r.doi}`, ...(r.pmid ? [`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`] : [])],
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-20">
      <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">{kicker}</div>
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">{children}</div>
    </section>
  )
}

export function HrvBiofeedbackPage() {
  const location = useLocation()

  useEffect(() => {
    void location
    document.title = PAGE_TITLE
    setMeta('description', PAGE_DESC)
    setMeta('og:title', PAGE_TITLE, true)
    setMeta('og:description', PAGE_DESC, true)
    setMeta('og:type', 'article', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', PAGE_TITLE, true)
    setMeta('twitter:description', PAGE_DESC, true)
    setMeta('twitter:image', OG_IMAGE, true)
    // Article + FAQPage JSON-LD is emitted statically by meta-inject
    // (hrvBiofeedbackJsonLd), so non-JS crawlers see it.
  }, [location])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      {/* HERO / DEFINITION */}
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ HRV BIOFEEDBACK ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          HRV Biofeedback: What It Is, How It Works, and How ONDA Uses It
        </h1>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">
          <strong className="text-white">HRV biofeedback is a technique in which you see your heart-rate
          variability in real time and adjust your breathing in response</strong> — typically breathing
          slowly at your resonance frequency (about six breaths a minute). The live feedback closes a loop:
          you can watch your heart rhythm smooth into a clean wave as you breathe, which trains the
          autonomic nervous system rather than just measuring it.
        </p>
      </header>

      {/* TOC */}
      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="On this page">
        {[
          ['how', 'How it works'],
          ['evidence', 'The evidence'],
          ['what-hrv-tells', 'What HRV tells you'],
          ['vs-tracking', 'vs HRV tracking'],
          ['onda', 'How ONDA does it'],
          ['limits', 'Limitations'],
          ['research', 'Research'],
          ['faq', 'FAQ'],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">
            {label}
          </a>
        ))}
      </nav>

      <Section id="how" kicker="[ HOW IT WORKS ]" title="How HRV biofeedback works">
        <p>
          Your heart doesn’t beat like a metronome. The time between beats speeds up slightly as you inhale
          and slows as you exhale — a rhythm called respiratory sinus arrhythmia. HRV biofeedback uses that
          link: when you breathe slowly and evenly at your resonance frequency, the heart-rate oscillation
          grows large and smooth, and the baroreflex (the body’s blood-pressure feedback loop) is strongly
          engaged.
        </p>
        <p>
          A biofeedback app measures your heartbeat, computes HRV or a coherence score from the beat-to-beat
          intervals, and shows it back to you live. You adjust your breathing to make the signal smoother —
          and the feedback loop teaches your nervous system a state it can learn to reach on its own. See{' '}
          <Link to="/how-it-works" className="text-terminal-green hover:underline">how ONDA computes it</Link>.
        </p>
      </Section>

      <Section id="evidence" kicker="[ THE EVIDENCE ]" title="What the evidence says">
        <p>
          The core mechanism is well supported. Paced breathing near resonance frequency reliably increases
          HRV during a session and engages the parasympathetic (“rest and digest”) branch, and HRV
          biofeedback is an established technique for improving vagal tone and stress resilience — not just
          measuring it (Lehrer &amp; Gevirtz, 2014; Thayer et al., 2009).
        </p>
        <p>
          What’s <em>less</em> certain is the size and durability of long-term change: how much a given
          person’s resting baseline shifts, and how that translates to specific health outcomes, varies and
          is still an active research question. We keep those two registers separate on the{' '}
          <Link to="/research" className="text-terminal-green hover:underline">evidence page</Link>.
        </p>
      </Section>

      <Section id="what-hrv-tells" kicker="[ THE SIGNAL ]" title="What HRV does — and doesn’t — tell you">
        <p>
          HRV is a useful window on the autonomic nervous system: higher short-term HRV (RMSSD) generally
          reflects stronger parasympathetic activity and better recovery <em>within a person</em>. It tends
          to fall under stress, illness, poor sleep or alcohol, and rise when you’re recovered.
        </p>
        <p>
          But HRV is not a diagnosis, not a measure of “stress” by itself, and not very meaningful compared
          between different people — it’s influenced by age, genetics, measurement method and position. Your
          own trend, read consistently, is what matters. See exactly{' '}
          <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>.
        </p>
      </Section>

      <Section id="vs-tracking" kicker="[ TRACKING VS TRAINING ]" title="HRV tracking vs HRV biofeedback">
        <p>
          These get confused constantly. <strong className="text-white">HRV tracking</strong> is passive —
          a ring or band records your HRV, usually overnight, so you can watch trends. It tells you how you
          recovered. <strong className="text-white">HRV biofeedback</strong> is active — you get live
          feedback while you breathe and train your heart rhythm in the moment. It gives you something to
          <em> do</em> about your state.
        </p>
        <p>
          They’re complementary: many people track with a wearable and train with a biofeedback app. See the{' '}
          <Link to="/compare/best-active-hrv-training-apps" className="text-terminal-green hover:underline">
            best active HRV training apps
          </Link>.
        </p>
      </Section>

      <Section id="onda" kicker="[ HOW ONDA DOES IT ]" title="How ONDA implements HRV biofeedback">
        <p>
          ONDA is an HRV biofeedback and guided-breathing app. It reads your heartbeat from the iPhone camera
          (photoplethysmography) or an Apple Watch, computes HRV and a live coherence score, and shows your
          heart rhythm responding as you breathe at your resonance pace — inside a guided, progressive
          8-level practice. You see your body organise in real time; that’s the loop that makes it a trainer,
          not a passive tracker.
        </p>
        <p>
          It’s free to start, with no account. See the full{' '}
          <Link to="/product" className="text-terminal-green hover:underline">product facts</Link>, or how ONDA
          compares in the{' '}
          <Link to="/compare/best-hrv-biofeedback-apps" className="text-terminal-green hover:underline">
            best HRV biofeedback apps
          </Link>.
        </p>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 font-mono text-xs text-white/55">
          <strong className="text-white/80">Devices:</strong> iPhone (camera pulse / PPG), iPad, and Apple
          Watch. No chest strap or dedicated wearable required. Android is on a waitlist.
        </div>
      </Section>

      <Section id="limits" kicker="[ LIMITATIONS ]" title="Limitations and honest caveats">
        <ul className="space-y-2">
          <li>• HRV biofeedback trains self-regulation; it is not a treatment for any medical condition.</li>
          <li>• A live coherence score is a practice metric, not a clinical biomarker.</li>
          <li>• Camera-based HRV is best at rest; motion and poor signal reduce accuracy.</li>
          <li>• Long-term baseline change varies between people and is not guaranteed.</li>
          <li>• ONDA is not a medical device and does not diagnose, treat or monitor any condition.</li>
        </ul>
      </Section>

      <Section id="research" kicker="[ RESEARCH ]" title="Research">
        <p className="!text-white/60">The mechanisms above rest on published work. Each reference is verified.</p>
        <ol className="mt-2 space-y-3 font-mono text-xs leading-relaxed text-white/60">
          {EVIDENCE_REFERENCES.map((r) => (
            <li key={r.id}>
              <span className="text-white/75">{r.authors}</span> ({r.year}).{' '}
              <span className="italic text-white/70">{r.title}</span>. <span className="text-white/60">{r.journal}</span>.{' '}
              <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green break-all">
                DOI: {r.doi}
              </a>
              {r.pmid && (
                <>
                  {' · '}
                  <a href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`} target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green">
                    PMID: {r.pmid}
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 !text-white/55">
          More on the evidence and its limits: <Link to="/research" className="text-terminal-green hover:underline">the science behind ONDA</Link>.
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
