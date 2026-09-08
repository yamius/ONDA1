/**
 * /tools — hub for ONDA Life's free interactive calculators.
 *
 * Thick, self-contained page: expanded intro, the Bio OS feature + tool grid,
 * and a closing evidence-grounded body written for search/answer engines
 * (what these tools are, grouped by domain, how to read the numbers honestly).
 * Self-contained meta + CollectionPage/ItemList JSON-LD over the catalogue.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { TOOLS } from '../data/tools'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/tools`

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

/** Domain groupings for the closing body — each maps to tool `category` values. */
const TOOL_DOMAINS: { title: string; cats: string[]; body: string }[] = [
  {
    title: 'Nervous system & recovery',
    cats: ['NERVOUS SYSTEM', 'RECOVERY'],
    body: 'Heart-rate variability, resting heart rate and stress-load calculators that read your autonomic state — the balance between the “fight-or-flight” sympathetic branch and the “rest-and-digest” parasympathetic one. These are the metrics ONDA Life is built around, so each one links back to what the number actually means and what reliably moves it.',
  },
  {
    title: 'Sleep',
    cats: ['SLEEP'],
    body: 'Sleep-debt, caffeine cut-off and chronotype tools that turn sleep from a vague target into concrete timing. Sleep is the single biggest lever on next-day HRV and recovery, so getting the timing of caffeine, light and bedtime right pays back everywhere else.',
  },
  {
    title: 'Fitness & training',
    cats: ['FITNESS'],
    body: 'Heart-rate-zone and training-load calculators — including a Zone 2 aerobic-base estimate from the accurate Tanaka age formula — so you can train at the intensity you actually intend rather than guessing.',
  },
  {
    title: 'Nutrition',
    cats: ['NUTRITION'],
    body: 'Protein, hydration and intake calculators grounded in published guidelines (ISSN/ACSM), giving you a defensible daily target and per-meal split instead of a round-number rule of thumb.',
  },
  {
    title: 'Focus, dopamine & longevity',
    cats: ['FOCUS', 'DOPAMINE', 'LONGEVITY'],
    body: 'Attention, reward-balance and healthspan tools for the longer game — the habits and rhythms that compound over months, not the metric you check each morning.',
  },
]

export function ToolsPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  useEffect(() => {
    const title = 'Biohacking Tools & Calculators — Free & Evidence-Based | ONDA Life'
    const desc =
      'Free interactive calculators for HRV, sleep debt, caffeine timing, heart-rate zones, protein and more — each read against the published evidence, no sign-up, then trackable in ONDA Life.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    window.scrollTo({ top: 0 })
    // CollectionPage/ItemList JSON-LD is emitted statically by meta-inject.
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Tools</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Biohacking Tools</h1>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60">
        Free interactive calculators for the metrics that matter — HRV, sleep, heart-rate zones,
        caffeine timing, protein and more. Every tool reads your number against the published
        evidence, not a round-number rule of thumb, and tells you what actually moves it.
      </p>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        No sign-up, no account, nothing to install — they run right in your browser. When you want
        the same numbers tracked automatically over time instead of typed in once, that&rsquo;s what{' '}
        <Link to={`${langPrefix}/product`} className="text-terminal-green hover:underline">ONDA Life</Link>{' '}
        does on your iPhone and Apple Watch.
      </p>

      {/* Bio OS — the flagship live dashboard. It keeps its own URL (/bio) and
          its own richer engine; here it's surfaced under the Tools group as a
          featured entry (nav placement only — the path is unchanged). */}
      <Link
        to={`${langPrefix}/bio`}
        className="mb-4 block rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-5 transition-colors hover:border-terminal-green/50 hover:bg-terminal-green/10"
      >
        <div className="mb-1 flex items-center gap-3">
          <span className="font-semibold text-white/90">Bio OS — live biometric dashboard</span>
          <span className="rounded-md border border-terminal-green/30 bg-terminal-green/10 px-2 py-0.5 font-mono text-[10px] text-terminal-green/90">live · camera</span>
        </div>
        <p className="font-mono text-xs leading-relaxed text-white/50">
          Camera-based pulse, breathing and nervous-system readout — your body, in real time, right in the browser.
        </p>
      </Link>

      <div className="grid grid-cols-1 gap-4">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            to={`${langPrefix}/tools/${t.slug}`}
            className="block rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
          >
            <div className="mb-1 flex items-center gap-3">
              <span className="font-semibold text-white/90">{t.name}</span>
              <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-2 py-0.5 font-mono text-[10px] text-terminal-green/80">live</span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/50">{t.blurb}</p>
          </Link>
        ))}
      </div>

      {/* ── SEO / answer-engine body ─────────────────────────────────────── */}
      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">About these tools</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/65">
          <p>
            These are the small, focused calculators the quantified-self and biohacking world
            keeps reaching for — heart-rate variability, sleep debt, caffeine half-life, training
            zones, protein needs — collected in one place and, where it matters, tied to the
            science rather than left as a bare number. The point isn&rsquo;t the number itself; it&rsquo;s
            reading it in context: what&rsquo;s normal for your age, what a change actually signals, and
            which lever moves it.
          </p>
          <p>
            Wherever a tool touches your nervous system — HRV, resting heart rate, stress load —
            it links through to{' '}
            <Link to={`${langPrefix}/measurements`} className="text-terminal-green hover:underline">what ONDA measures</Link>{' '}
            and the{' '}
            <Link to={`${langPrefix}/research`} className="text-terminal-green hover:underline">evidence behind it</Link>,
            so you can see the caveats, not just the output. We&rsquo;d rather a calculator make you a
            little more skeptical and a little better informed than hand you a false-precision score.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {TOOL_DOMAINS.map((d) => {
            const count = TOOLS.filter((t) => d.cats.includes(t.category)).length
            if (count === 0) return null
            return (
              <div key={d.title}>
                <h3 className="mb-1.5 font-semibold text-white/90">
                  {d.title}
                  <span className="ml-2 font-mono text-[11px] font-normal text-white/35">
                    {count} {count === 1 ? 'tool' : 'tools'}
                  </span>
                </h3>
                <p className="font-mono text-sm leading-relaxed text-white/60">{d.body}</p>
              </div>
            )
          })}
        </div>

        <h3 className="mt-10 mb-2 font-semibold text-white/90">How to read your numbers honestly</h3>
        <p className="font-mono text-sm leading-relaxed text-white/60">
          A single reading is a snapshot, and snapshots are noisy — HRV alone swings with sleep,
          hydration, alcohol, illness and even how you sat down. Your own trend over days and weeks
          is far more meaningful than one figure, and comparing your absolute number to someone
          else&rsquo;s is rarely useful. These tools are for orientation and self-experiment, not
          diagnosis; they don&rsquo;t replace a clinician. Used that way, they&rsquo;re a fast, honest way to
          turn a metric you&rsquo;ve heard about into something you can actually act on.
        </p>

        <p className="mt-8 font-mono text-sm leading-relaxed text-white/60">
          Want the nervous-system side tracked continuously instead of typed in?{' '}
          <Link to={`${langPrefix}/product`} className="text-terminal-green hover:underline">See what ONDA Life does</Link>,
          or{' '}
          <Link to={`${langPrefix}/compare`} className="text-terminal-green hover:underline">how it compares</Link>{' '}
          to the wearables and apps people cross-shop.
        </p>
      </section>
    </main>
  )
}
