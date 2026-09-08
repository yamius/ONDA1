/**
 * /tools — hub for ONDA Life's free interactive calculators.
 *
 * Thick, self-contained page: expanded intro, the Bio OS feature + tool grid,
 * and a closing evidence-grounded body written for search/answer engines
 * (what these tools are, grouped by domain, how to read the numbers honestly).
 * Self-contained meta + CollectionPage/ItemList JSON-LD over the catalogue.
 *
 * Localized to ru + es via tools-i18n.ts (pilot). The framing prose localizes;
 * tool cards (name + blurb) stay English because /tools/<slug> pages are
 * English-only, and internal Links keep EN paths — same as /product and /faq.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { TOOLS } from '../data/tools'
import { TOOLS_I18N, type ToolsCopy } from '../data/tools-i18n'

const SITE_URL = 'https://onda-life.com'

/** Category groupings for the closing body — index-aligned with copy.domains. */
const DOMAIN_CATS: string[][] = [
  ['NERVOUS SYSTEM', 'RECOVERY'],
  ['SLEEP'],
  ['FITNESS'],
  ['NUTRITION'],
  ['FOCUS', 'DOPAMINE', 'LONGEVITY'],
]

/** English copy — the built-in default; ru/es overlay from TOOLS_I18N. */
const EN_COPY: ToolsCopy = {
  metaTitle: 'Biohacking Tools & Calculators — Free & Evidence-Based | ONDA Life',
  metaDescription:
    'Free interactive calculators for HRV, sleep debt, caffeine timing, heart-rate zones, protein and more — each read against the published evidence, no sign-up, then trackable in ONDA Life.',
  breadcrumbTools: 'Tools',
  h1: 'Biohacking Tools',
  intro1:
    'Free interactive calculators for the metrics that matter — HRV, sleep, heart-rate zones, caffeine timing, protein and more. Every tool reads your number against the published evidence, not a round-number rule of thumb, and tells you what actually moves it.',
  intro2Pre:
    'No sign-up, no account, nothing to install — they run right in your browser. When you want the same numbers tracked automatically over time instead of typed in once, that’s what ',
  ondaLink: 'ONDA Life',
  intro2Post: ' does on your iPhone and Apple Watch.',
  bioOsTitle: 'Bio OS — live biometric dashboard',
  bioOsBadge: 'live · camera',
  bioOsDesc:
    'Camera-based pulse, breathing and nervous-system readout — your body, in real time, right in the browser.',
  liveLabel: 'live',
  aboutHeading: 'About these tools',
  aboutP1:
    'These are the small, focused calculators the quantified-self and biohacking world keeps reaching for — heart-rate variability, sleep debt, caffeine half-life, training zones, protein needs — collected in one place and, where it matters, tied to the science rather than left as a bare number. The point isn’t the number itself; it’s reading it in context: what’s normal for your age, what a change actually signals, and which lever moves it.',
  aboutP2Pre:
    'Wherever a tool touches your nervous system — HRV, resting heart rate, stress load — it links through to ',
  measuresLink: 'what ONDA measures',
  aboutP2Mid: ' and the ',
  researchLink: 'evidence behind it',
  aboutP2Post:
    ', so you can see the caveats, not just the output. We’d rather a calculator make you a little more skeptical and a little better informed than hand you a false-precision score.',
  domains: [
    {
      title: 'Nervous system & recovery',
      body: 'Heart-rate variability, resting heart rate and stress-load calculators that read your autonomic state — the balance between the “fight-or-flight” sympathetic branch and the “rest-and-digest” parasympathetic one. These are the metrics ONDA Life is built around, so each one links back to what the number actually means and what reliably moves it.',
    },
    {
      title: 'Sleep',
      body: 'Sleep-debt, caffeine cut-off and chronotype tools that turn sleep from a vague target into concrete timing. Sleep is the single biggest lever on next-day HRV and recovery, so getting the timing of caffeine, light and bedtime right pays back everywhere else.',
    },
    {
      title: 'Fitness & training',
      body: 'Heart-rate-zone and training-load calculators — including a Zone 2 aerobic-base estimate from the accurate Tanaka age formula — so you can train at the intensity you actually intend rather than guessing.',
    },
    {
      title: 'Nutrition',
      body: 'Protein, hydration and intake calculators grounded in published guidelines (ISSN/ACSM), giving you a defensible daily target and per-meal split instead of a round-number rule of thumb.',
    },
    {
      title: 'Focus, dopamine & longevity',
      body: 'Attention, reward-balance and healthspan tools for the longer game — the habits and rhythms that compound over months, not the metric you check each morning.',
    },
  ],
  readHeading: 'How to read your numbers honestly',
  readBody:
    'A single reading is a snapshot, and snapshots are noisy — HRV alone swings with sleep, hydration, alcohol, illness and even how you sat down. Your own trend over days and weeks is far more meaningful than one figure, and comparing your absolute number to someone else’s is rarely useful. These tools are for orientation and self-experiment, not diagnosis; they don’t replace a clinician. Used that way, they’re a fast, honest way to turn a metric you’ve heard about into something you can actually act on.',
  ctaPre: 'Want the nervous-system side tracked continuously instead of typed in? ',
  seeLink: 'See what ONDA Life does',
  ctaMid: ', or ',
  compareLink: 'how it compares',
  ctaPost: ' to the wearables and apps people cross-shop.',
}

function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

/** Locale-aware "{n} tools" label (Russian has 3 plural forms). */
function toolCountLabel(n: number, lang: string): string {
  if (lang === 'ru') {
    const mod10 = n % 10
    const mod100 = n % 100
    let word: string
    if (mod10 === 1 && mod100 !== 11) word = 'инструмент'
    else if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) word = 'инструмента'
    else word = 'инструментов'
    return `${n} ${word}`
  }
  if (lang === 'es') return `${n} ${n === 1 ? 'herramienta' : 'herramientas'}`
  return `${n} ${n === 1 ? 'tool' : 'tools'}`
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

export function ToolsPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const copy = lang === 'ru' || lang === 'es' ? TOOLS_I18N[lang] : EN_COPY
  const langPrefix = prefixFor(lang)
  const pageUrl = `${SITE_URL}${langPrefix}/tools`

  useEffect(() => {
    document.title = copy.metaTitle
    setMeta('description', copy.metaDescription)
    setMeta('og:title', copy.metaTitle, true)
    setMeta('og:description', copy.metaDescription, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', copy.metaTitle, true)
    setMeta('twitter:description', copy.metaDescription, true)
    window.scrollTo({ top: 0 })
    // CollectionPage/ItemList JSON-LD and hreflang cluster are emitted
    // statically by prerender/meta-inject (prerender skips useEffect).
  }, [copy, pageUrl])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">{copy.breadcrumbTools}</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{copy.h1}</h1>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60">{copy.intro1}</p>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        {copy.intro2Pre}
        <Link to={`${langPrefix}/product`} className="text-terminal-green hover:underline">{copy.ondaLink}</Link>
        {copy.intro2Post}
      </p>

      {/* Bio OS — the flagship live dashboard. It keeps its own URL (/bio) and
          its own richer engine; here it's surfaced under the Tools group as a
          featured entry (nav placement only — the path is unchanged). */}
      <Link
        to={`${langPrefix}/bio`}
        className="mb-4 block rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-5 transition-colors hover:border-terminal-green/50 hover:bg-terminal-green/10"
      >
        <div className="mb-1 flex items-center gap-3">
          <span className="font-semibold text-white/90">{copy.bioOsTitle}</span>
          <span className="rounded-md border border-terminal-green/30 bg-terminal-green/10 px-2 py-0.5 font-mono text-[10px] text-terminal-green/90">{copy.bioOsBadge}</span>
        </div>
        <p className="font-mono text-xs leading-relaxed text-white/50">{copy.bioOsDesc}</p>
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
              <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-2 py-0.5 font-mono text-[10px] text-terminal-green/80">{copy.liveLabel}</span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/50">{t.blurb}</p>
          </Link>
        ))}
      </div>

      {/* ── SEO / answer-engine body ─────────────────────────────────────── */}
      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{copy.aboutHeading}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/65">
          <p>{copy.aboutP1}</p>
          <p>
            {copy.aboutP2Pre}
            <Link to={`${langPrefix}/measurements`} className="text-terminal-green hover:underline">{copy.measuresLink}</Link>
            {copy.aboutP2Mid}
            <Link to={`${langPrefix}/research`} className="text-terminal-green hover:underline">{copy.researchLink}</Link>
            {copy.aboutP2Post}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {DOMAIN_CATS.map((cats, i) => {
            const count = TOOLS.filter((t) => cats.includes(t.category)).length
            if (count === 0) return null
            const d = copy.domains[i]
            return (
              <div key={i}>
                <h3 className="mb-1.5 font-semibold text-white/90">
                  {d.title}
                  <span className="ml-2 font-mono text-[11px] font-normal text-white/35">
                    {toolCountLabel(count, lang)}
                  </span>
                </h3>
                <p className="font-mono text-sm leading-relaxed text-white/60">{d.body}</p>
              </div>
            )
          })}
        </div>

        <h3 className="mt-10 mb-2 font-semibold text-white/90">{copy.readHeading}</h3>
        <p className="font-mono text-sm leading-relaxed text-white/60">{copy.readBody}</p>

        <p className="mt-8 font-mono text-sm leading-relaxed text-white/60">
          {copy.ctaPre}
          <Link to={`${langPrefix}/product`} className="text-terminal-green hover:underline">{copy.seeLink}</Link>
          {copy.ctaMid}
          <Link to={`${langPrefix}/compare`} className="text-terminal-green hover:underline">{copy.compareLink}</Link>
          {copy.ctaPost}
        </p>
      </section>
    </main>
  )
}
