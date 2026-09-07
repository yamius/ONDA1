/**
 * /resonance-breathing — cornerstone informational page on resonance breathing
 * (the science of slow breathing and HRV). Distinct from the interactive
 * /tools/resonance-breathing pacer, which it links to.
 *
 * Informational-first authority page; bridges to ONDA honestly. Reuses the
 * verified references from evidence.ts.
 *
 * EN-only. Self-contained meta + Article + FAQPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { EVIDENCE_REFERENCES } from '../data/evidence'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/resonance-breathing`
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
    q: 'What is resonance breathing?',
    a: 'Resonance breathing (also called coherent breathing) is slow, even breathing at the pace where your heart-rate oscillation is largest — for most people around 5.5–6 breaths a minute, roughly a 10-second cycle. At that pace the heart rhythm and breathing synchronise and HRV rises.',
  },
  {
    q: 'What is my resonance frequency?',
    a: 'Most people’s resonance frequency sits between about 4.5 and 7 breaths a minute, commonly near 6. You can find yours by trying paces in that range and noticing where your breathing feels smoothest and, with a biofeedback app, where HRV peaks.',
  },
  {
    q: 'Does slow breathing really raise HRV?',
    a: 'Yes — breathing near your resonance frequency reliably increases heart-rate variability during the session and engages the parasympathetic branch. It is the core mechanism behind HRV biofeedback. How much your resting baseline changes over time varies between people.',
  },
  {
    q: 'How long should I practise resonance breathing?',
    a: 'A typical session is about 10–20 minutes, but even a few minutes shifts your state. Consistency matters more than length — short daily sessions tend to help more than occasional long ones.',
  },
  {
    q: 'Is resonance breathing the same as box breathing?',
    a: 'No. Box breathing uses equal counts with holds (e.g. 4-4-4-4). Resonance breathing is smooth, continuous breathing without holds at a specific slow pace (~6/min) chosen to maximise heart-rate oscillation. Both calm you; resonance breathing is the one tied to HRV.',
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

export function ResonanceBreathingGuidePage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'Resonance Breathing: The Science of Slow Breathing & HRV | ONDA Life'
    const desc =
      'Resonance breathing explained: what it is, why ~6 breaths a minute maximises HRV, how to find your resonance frequency, the evidence, how to practise, and how ONDA guides it.'
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

    setOrCreateScript('ld-resbreath-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'Resonance Breathing: The Science Behind Slow Breathing and HRV',
      description: desc,
      url: PAGE_URL,
      inLanguage: 'en',
      author: { '@id': AUTHOR_ID },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      about: 'Resonance breathing',
      citation: EVIDENCE_REFERENCES.filter((r) => r.id === 'R1' || r.id === 'R2' || r.id === 'R3').map((r) => ({
        '@type': 'ScholarlyArticle',
        name: r.title,
        author: r.authors.split(', ').map((name) => ({ '@type': 'Person', name })),
        datePublished: String(r.year),
        isPartOf: { '@type': 'Periodical', name: r.journal },
        sameAs: [`https://doi.org/${r.doi}`, ...(r.pmid ? [`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`] : [])],
      })),
    })
    setOrCreateScript('ld-resbreath-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })

    return () => {
      for (const id of ['ld-resbreath-article', 'ld-resbreath-faq']) {
        const el = document.getElementById(id)
        if (el) el.remove()
      }
    }
  }, [location])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ RESONANCE BREATHING ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          Resonance Breathing: The Science Behind Slow Breathing and HRV
        </h1>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">
          <strong className="text-white">Resonance breathing is slow, even breathing at the pace where your
          heart-rate oscillation is largest</strong> — for most people around 5.5–6 breaths a minute
          (roughly a 10-second cycle). At that pace your heart rhythm and breathing synchronise, the
          baroreflex is strongly engaged, and heart-rate variability rises. It’s the breathing at the core of
          HRV biofeedback.
        </p>
        <Link
          to="/tools/resonance-breathing"
          className="mt-6 inline-block rounded border border-terminal-green/40 px-4 py-2 font-mono text-sm text-terminal-green hover:bg-terminal-green/10"
        >
          Try the resonance breathing pacer &rarr;
        </Link>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="On this page">
        {[
          ['science', 'The science'],
          ['frequency', 'Find your frequency'],
          ['evidence', 'The evidence'],
          ['practise', 'How to practise'],
          ['onda', 'How ONDA guides it'],
          ['faq', 'FAQ'],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">
            {label}
          </a>
        ))}
      </nav>

      <Section id="science" kicker="[ THE SCIENCE ]" title="Why ~6 breaths a minute is special">
        <p>
          Your heart rate naturally rises as you inhale and falls as you exhale — respiratory sinus
          arrhythmia. There’s also a slower loop: the baroreflex, which regulates blood pressure, oscillates
          at roughly 0.1 Hz — about one cycle every 10 seconds. When you breathe at that same ~0.1 Hz pace,
          the two rhythms line up and reinforce each other, and the heart-rate oscillation grows to its
          largest, smoothest amplitude. That’s resonance.
        </p>
        <p>
          The visible result is a clean, wave-like heart rhythm and a sharp rise in HRV — the signal a
          coherence score is built on. See{' '}
          <Link to="/how-it-works" className="text-terminal-green hover:underline">how ONDA computes coherence</Link>.
        </p>
      </Section>

      <Section id="frequency" kicker="[ YOUR FREQUENCY ]" title="Finding your resonance frequency">
        <p>
          Everyone’s resonance frequency is slightly different — usually between about 4.5 and 7 breaths a
          minute, most commonly near 6. To find yours, breathe smoothly at a few paces in that range and
          notice where it feels most effortless. With a biofeedback app you can go further: the pace where
          your HRV or coherence peaks is your resonance frequency.
        </p>
        <p>
          A simple starting point is a 5.5-second inhale and 5.5-second exhale (about 5.5 breaths a minute),
          then adjust from there.
        </p>
      </Section>

      <Section id="evidence" kicker="[ THE EVIDENCE ]" title="What the evidence says">
        <p>
          Breathing at resonance frequency reliably raises HRV during the session and engages the
          parasympathetic branch — the most-supported mechanism behind HRV biofeedback (Lehrer &amp; Gevirtz,
          2014). Slow, resonant breathing is also linked in the wider literature to lower arousal and better
          stress resilience with regular practice (Thayer et al., 2009; Porges, 2007).
        </p>
        <p>
          As always, the acute effect is robust; the size and durability of long-term change vary between
          people. Full detail and limits on{' '}
          <Link to="/research" className="text-terminal-green hover:underline">the evidence page</Link>.
        </p>
      </Section>

      <Section id="practise" kicker="[ HOW TO PRACTISE ]" title="How to practise resonance breathing">
        <ul className="space-y-2">
          <li>• Sit comfortably and breathe through the nose, into the belly.</li>
          <li>• Aim for a smooth ~5.5–6 breaths a minute (e.g. 5.5s in, 5.5s out) — no holds.</li>
          <li>• Keep it effortless; resonance is about smoothness, not deep or forced breaths.</li>
          <li>• Practise 10–20 minutes where you can, but a few minutes still helps.</li>
          <li>• Consistency beats duration — short daily sessions move your baseline more than rare long ones.</li>
        </ul>
      </Section>

      <Section id="onda" kicker="[ HOW ONDA GUIDES IT ]" title="How ONDA guides resonance breathing">
        <p>
          ONDA pairs a resonance-breathing pacer with live HRV feedback and a coherence score, using the
          iPhone camera or an Apple Watch — so you don’t just breathe at the right pace, you see your heart
          rhythm organise in response. That closed loop is what turns slow breathing into training. It’s free
          to start; see the full{' '}
          <Link to="/product" className="text-terminal-green hover:underline">product facts</Link> and{' '}
          <Link to="/hrv-biofeedback" className="text-terminal-green hover:underline">HRV biofeedback</Link>.
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
