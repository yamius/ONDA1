/**
 * /apple-watch-hrv-biofeedback — cornerstone, device-specific explainer:
 * HRV biofeedback on Apple Watch. What the Watch measures, whether it does
 * real-time HRV biofeedback on its own (it doesn't), and how ONDA adds that
 * layer. Informational-first, honest, bridges to the product.
 * EN-only. Self-contained meta + Article + FAQPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CornerstoneRelated } from '../components/CornerstoneRelated'
import { appStoreUrl } from '../config/appStore'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/apple-watch-hrv-biofeedback`
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

const PAGE_TITLE = 'HRV Biofeedback on Apple Watch: How It Works | ONDA Life'
const PAGE_DESC =
  'HRV biofeedback on Apple Watch: what the Watch measures, why it records HRV rather than giving live biofeedback on its own, how accurate it is, and how ONDA turns it into a real-time coherence loop.'

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Can the Apple Watch do HRV biofeedback?',
    a: 'The Apple Watch measures heart rate and HRV, but on its own it records HRV as periodic readings rather than giving real-time biofeedback while you breathe. The Watch supplies the heart data; an app like ONDA turns it into a live HRV-biofeedback loop with a coherence score you train against.',
  },
  {
    q: 'Does the Apple Watch measure HRV in real time?',
    a: 'The Watch samples heart rate continuously and logs HRV values, but Apple’s own Health app shows HRV as occasional readings, not a continuous live number. For real-time feedback during a breathing session, you need an app that reads the Watch’s heart data live — such as ONDA.',
  },
  {
    q: 'How accurate is Apple Watch HRV?',
    a: 'The Apple Watch’s optical sensor gives good HRV for tracking trends and recovery, and is well-suited to at-rest readings. It isn’t reference-grade like an ECG chest strap, but for everyday HRV biofeedback and trend tracking it’s more than capable.',
  },
  {
    q: 'Do I need an Apple Watch for HRV biofeedback with ONDA?',
    a: 'No. ONDA also works with the iPhone camera (photoplethysmography) for a resting HRV reading. An Apple Watch adds continuous heart data and live feedback, but it isn’t required to start.',
  },
  {
    q: 'Is Apple Watch HRV biofeedback a medical tool?',
    a: 'No. HRV biofeedback with the Apple Watch is a self-regulation practice, not a diagnostic or medical device. The Watch’s ECG/AFib features are separate, Apple-cleared functions; HRV biofeedback is about training your breathing and nervous system.',
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

/** Article + FAQPage JSON-LD, emitted statically by meta-inject. */
export function appleWatchHrvJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'HRV Biofeedback on Apple Watch: How It Works',
      description: PAGE_DESC,
      url: PAGE_URL,
      inLanguage: 'en',
      author: { '@id': AUTHOR_ID },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      about: ['Apple Watch', 'HRV biofeedback', 'Heart rate variability'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
}

export function AppleWatchHrvBiofeedbackPage() {
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
    // Article + FAQPage JSON-LD emitted statically by meta-inject.
  }, [location])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ APPLE WATCH · HRV BIOFEEDBACK ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">HRV Biofeedback on Apple Watch</h1>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">
          <strong className="text-white">The Apple Watch measures heart rate and HRV — but on its own it
          records HRV as periodic readings rather than giving you real-time biofeedback while you breathe.</strong>{' '}
          The Watch is an excellent heart-data source; turning that into a live HRV-biofeedback loop, with a
          coherence score you train against, is what an app like ONDA adds on top.
        </p>
        <a
          href={appStoreUrl('apple_watch_hrv_page')}
          className="mt-6 inline-block rounded border border-terminal-green/40 px-4 py-2 font-mono text-sm text-terminal-green hover:bg-terminal-green/10"
        >
          Get ONDA on the App Store &rarr;
        </a>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="On this page">
        {[
          ['measures', 'What the Watch measures'],
          ['realtime', 'Real-time biofeedback?'],
          ['accuracy', 'Accuracy'],
          ['how', 'How to do it'],
          ['vs-camera', 'Watch vs iPhone camera'],
          ['faq', 'FAQ'],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">
            {label}
          </a>
        ))}
      </nav>

      <Section id="measures" kicker="[ WHAT IT MEASURES ]" title="What the Apple Watch actually measures">
        <p>
          The Apple Watch uses an optical heart-rate sensor to read your pulse continuously, and it logs
          heart-rate variability (HRV) values to Apple Health. It also has separate, Apple-cleared ECG and
          irregular-rhythm features. For HRV biofeedback, the relevant part is the continuous heart data —
          the beat-to-beat signal an app can read to compute HRV live.
        </p>
      </Section>

      <Section id="realtime" kicker="[ REAL-TIME? ]" title="Does the Apple Watch give real-time HRV biofeedback?">
        <p>
          Not by itself. Apple’s Health app surfaces HRV as occasional readings — useful for tracking trends,
          but not a continuous live number, and not a biofeedback loop. Real-time HRV biofeedback means seeing
          your rhythm respond <em>as you breathe</em> and adjusting. That requires an app that reads the
          Watch’s heart data live and turns it into feedback — which is exactly what ONDA does with its live{' '}
          <Link to="/hrv-vs-coherence" className="text-terminal-green hover:underline">coherence score</Link>.
        </p>
      </Section>

      <Section id="accuracy" kicker="[ ACCURACY ]" title="How accurate is Apple Watch HRV?">
        <p>
          The Watch’s optical sensor gives good HRV for everyday tracking and biofeedback, and it’s well-suited
          to at-rest readings. It isn’t reference-grade like an ECG chest strap — motion and loose fit add
          noise — but for training your breathing and watching your resting-HRV trend, it’s more than capable.
          Different devices report different HRV numbers, so compare your own trend, not absolute values across
          devices.
        </p>
      </Section>

      <Section id="how" kicker="[ HOW TO DO IT ]" title="How to do HRV biofeedback with your Apple Watch">
        <ol className="space-y-2">
          <li>1. Install an HRV-biofeedback app that reads Apple Watch heart data live — for example ONDA.</li>
          <li>2. Sit comfortably and start a session; the app reads your heartbeat from the Watch.</li>
          <li>3. Breathe slowly at your resonance pace (~6 breaths a minute) following the pacer.</li>
          <li>4. Watch the live coherence score rise as your heart rhythm smooths — that’s the feedback loop.</li>
          <li>5. Over weeks, track your resting-HRV trend as the measure of progress.</li>
        </ol>
        <p>
          See <Link to="/how-it-works" className="text-terminal-green hover:underline">how ONDA works</Link> and{' '}
          <Link to="/resonance-breathing" className="text-terminal-green hover:underline">resonance breathing</Link>.
        </p>
      </Section>

      <Section id="vs-camera" kicker="[ WATCH VS CAMERA ]" title="Apple Watch vs iPhone camera">
        <p>
          You don’t strictly need the Watch. ONDA can read your pulse with the iPhone camera (PPG) for a
          resting HRV reading. The Apple Watch adds continuous heart data and smoother live feedback and is
          the better option if you own one — but the camera is a genuine no-extra-hardware alternative. See{' '}
          <Link to="/product" className="text-terminal-green hover:underline">product facts</Link>.
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

      <CornerstoneRelated current="apple-watch-hrv-biofeedback" />
    </main>
  )
}
