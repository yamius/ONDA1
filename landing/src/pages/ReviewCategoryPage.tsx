/**
 * /reviews/<category-slug> — per-category landing page for the reviews hub.
 * One focused page per ReviewCategory (HRV trackers, meditation apps, sleep
 * apps, vagus nerve stimulators, CGMs, EEG & brain-training headsets),
 * surfacing that category's round-up + all individual reviews together,
 * plus a cross-link rail to the other categories.
 *
 * Slug → category resolution lives in `getCategoryByUrlSlug` so a single
 * dynamic route in the SPA covers all six pages without per-page wiring.
 */
import { useLocation, Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  reviews,
  comparisons,
  headToHeads,
  REVIEW_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_URL_SLUGS,
  getCategoryByUrlSlug,
  getReviewBySlug,
  type ReviewCategory,
} from '../data/reviews'
import { langFromPath } from '../i18n'
import { NotFoundPage } from './NotFoundPage'

/** Per-category intro copy. Kept here rather than in i18n so each page has
 *  a category-specific, search-keyword-aware lead paragraph without forcing
 *  a translation round-trip for every category we add. */
const CATEGORY_INTRO: Record<ReviewCategory, { h1: string; intro: string }> = {
  'hrv-wearable': {
    h1: 'Best HRV Trackers (2026)',
    intro:
      'Heart-rate variability is only as useful as the device measuring it. ONDA scored the most-searched HRV trackers of 2026 — rings, bands, smartwatches and chest straps — against the same rubric so the right pick is obvious from the trade-offs, not the marketing.',
  },
  'meditation-app': {
    h1: 'Best Meditation Apps (2026)',
    intro:
      'A meditation app is judged on the depth of the teaching, not the slickness of the interface. ONDA scored the most-used apps of 2026 against the same seven criteria — library, teaching quality, personalisation, free tier, evidence and value — so the right pick is obvious from the trade-offs.',
  },
  'sleep-app': {
    h1: 'Best Sleep Apps (2026)',
    intro:
      'A sleep app either measures sleep, helps you get it, or both. ONDA scored the most-used sleep apps of 2026 against the same rubric — tracking accuracy, wind-down content, sleep-science grounding, insights and value — so the right pick is obvious from your use case.',
  },
  'vagus-stim': {
    h1: 'Best Vagus Nerve Stimulators (2026)',
    intro:
      'The vagus-stimulator market mixes regulated medical devices, evidence-backed consumer hardware and wellness products whose mechanism barely touches the vagus nerve. ONDA scored the ten most credible devices of 2026 — auricular tVNS, cervical tVNS, vibrotactile, infrasonic and one implanted reference — so the field reads as one ordered list.',
  },
  cgm: {
    h1: 'Best Continuous Glucose Monitors for Biohackers (2026)',
    intro:
      'The biohacker CGM market in 2026 is two sensors and ten wrappers. Eight of the ten programmes here ride on the same two pieces of hardware — Abbott Libre 3 or Dexcom G7 — and compete on what the software, coaching and ecosystem do with the data. ONDA scored all of them on the same six criteria so the trade-offs are explicit.',
  },
  'eeg-headset': {
    h1: 'Best EEG & Brain-Training Headsets (2026)',
    intro:
      'The brain-training headset market splits across three modalities — EEG measurement, fNIRS prefrontal sensing and tDCS stimulation — plus clinical-prescribed and multi-modal-premium entries. ONDA scored the ten most credible devices of 2026 across all modalities against the same rubric, so the cross-modality trade-offs are explicit.',
  },
  'red-light': {
    h1: 'Best Red Light Therapy Panels (2026)',
    intro:
      'Red light therapy is one of the most marketing-noisy biohacker categories on the market — inflated irradiance claims, EMF and flicker hidden behind the spec sheet, premium pricing not always backed by the build. ONDA scored the ten most credible panels of 2026 against the same six axes, with independent irradiance measurement and EMF/flicker discipline carrying weight on purpose.',
  },
  'cold-plunge': {
    h1: 'Best Cold Plunge & Ice Bath (2026)',
    intro:
      'Cold plunge hardware went from niche to mainstream over 2023–2026, and the market split into three clean tiers: chiller-built premium tubs, mid-tier insulated tubs, and budget portable plunges. ONDA scored the ten most credible options of 2026 against the same six axes — with chiller capacity, build longevity and total cost of ownership carrying the rubric.',
  },
  sauna: {
    h1: 'Best Infrared Sauna & Sauna (2026)',
    intro:
      'The home-sauna category divides cleanly across heat sources — full-spectrum IR, near-IR incandescent, traditional Finnish convection — and form factors from blanket to outdoor barrel. ONDA scored the ten most credible options of 2026 against the same six axes, with heat-source spectrum honesty and independently-measured EMF carrying weight on purpose.',
  },
  'sleep-climate': {
    h1: 'Best Smart Sleep Climate Systems (2026)',
    intro:
      'Bed-surface temperature regulation went from niche biohacker hardware to mainstream biohacker reference in 2024–2026, driven by Eight Sleep’s Pod and the long-running Sleepme (ChiliPad) lineage. ONDA scored the ten most credible smart sleep-climate systems of 2026 against the same six axes — climate range, build, app and tracking, form factor, subscription model and value.',
  },
  pemf: {
    h1: 'Best PEMF Devices (2026)',
    intro:
      'Pulsed electromagnetic field hardware divides cleanly across three form factors — full-body mats (Bemer, Healthy Wave, HigherDOSE), localised coil systems (Pulse Centers, Curatron, iMRS) and the new wearable tier (Resona Health VIBE). ONDA scored the ten most credible PEMF devices of 2026 against the same six axes — field strength, waveform research, build, programmability, form factor and value.',
  },
  'breathwork-app': {
    h1: 'Best Breathwork Apps (2026)',
    intro:
      'Breathwork went from niche somatic-therapy modality to mainstream nervous-system tool in 2024–2026, driven by the Stanford cyclic-sighing research and the Wim Hof / Othership crossover into recovery culture. ONDA scored the ten most credible breathwork apps of 2026 against the same six axes — session library, technique coverage, evidence grounding, app experience, biofeedback integration and value.',
  },
}

export function ReviewCategoryPage() {
  // The shared `/reviews/:slug` route hands us the same `slug` param it uses
  // for individual reviews; the parent dispatcher routes us here only when
  // the slug matches a known category URL slug.
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const { t: tReviews } = useTranslation('reviews')

  const category = slug ? getCategoryByUrlSlug(slug) : undefined
  if (!category) return <NotFoundPage />

  const catReviews = reviews.filter((r) => r.category === category)
  const catComparison = comparisons.find((c) => c.category === category)
  const otherCategories = REVIEW_CATEGORIES.filter((c) => c !== category)
  // Head-to-heads where every product (2 or 3) belongs to this category.
  const catReviewSlugs = new Set(catReviews.map((r) => r.slug))
  const catHeadToHeads = headToHeads.filter(
    (h) =>
      catReviewSlugs.has(h.productASlug) &&
      catReviewSlugs.has(h.productBSlug) &&
      (h.productCSlug ? catReviewSlugs.has(h.productCSlug) : true),
  )
  const { h1, intro } = CATEGORY_INTRO[category]
  const label = CATEGORY_LABELS[category]

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={lang === 'en' ? '/' : `/${lang}`} className="transition-colors hover:text-white/50">
          {tReviews('breadcrumb.home', { defaultValue: 'Home' })}
        </Link>
        <span>/</span>
        <Link to={`${langPrefix}/reviews`} className="transition-colors hover:text-white/50">
          {tReviews('breadcrumb.reviews', { defaultValue: 'Reviews' })}
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          {label}
        </span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ REVIEWS / {label.toUpperCase()} ]
      </div>
      <h1 id="article-intro" className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
        {h1}
      </h1>
      <p className="mb-6 max-w-3xl font-mono text-sm leading-relaxed text-white/50">
        {intro}
      </p>
      <Link
        to={`${langPrefix}/reviews/methodology`}
        className="mb-12 inline-block font-mono text-xs text-terminal-cyan/70 transition-colors hover:text-terminal-cyan"
      >
        {tReviews('hub.methodologyLink', { defaultValue: 'How we score →' })}
      </Link>

      {catComparison && (
        <section className="mb-14">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
            {tReviews('ui.roundUpHeading', { defaultValue: 'Ranked round-up' })}
          </h2>
          <Link
            to={`${langPrefix}/reviews/compare/${catComparison.slug}`}
            className="glass-card group flex items-start justify-between gap-4 rounded-lg p-5 transition-all hover:border-terminal-green/20"
          >
            <div className="min-w-0">
              <h3 className="font-semibold transition-colors group-hover:text-terminal-green">
                {tReviews(`comparisons.${catComparison.slug}.title`, { defaultValue: catComparison.title })}
              </h3>
              <p className="mt-1 font-mono text-xs text-white/40 line-clamp-2">
                {tReviews(`comparisons.${catComparison.slug}.description`, { defaultValue: catComparison.description })}
              </p>
            </div>
            <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">→</span>
          </Link>
        </section>
      )}

      {catHeadToHeads.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            {tReviews('ui.headToHeadHeading', { defaultValue: 'Head-to-head duels' })}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {catHeadToHeads.map((h) => {
              const a = getReviewBySlug(h.productASlug)
              const b = getReviewBySlug(h.productBSlug)
              const c = h.productCSlug ? getReviewBySlug(h.productCSlug) : undefined
              if (!a || !b || (h.productCSlug && !c)) return null
              const names = c ? [a.name, b.name, c.name] : [a.name, b.name]
              return (
                <Link
                  key={h.slug}
                  to={`${langPrefix}/reviews/vs/${h.slug}`}
                  className="glass-card group flex items-start justify-between gap-3 rounded-lg p-4 transition-all hover:border-terminal-green/20"
                >
                  <p className="font-mono text-sm font-semibold text-white/80 transition-colors group-hover:text-terminal-green">
                    {names.map((n, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-white/35"> vs </span>}
                        {n}
                      </span>
                    ))}
                  </p>
                  <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">→</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="mb-14">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
          {tReviews('ui.allReviewsHeading', { defaultValue: 'All reviews' })} ({catReviews.length})
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {catReviews.map((r) => (
            <Link
              key={r.slug}
              to={`${langPrefix}/reviews/${r.slug}`}
              className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/20"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/30">
                  {r.brand}
                </span>
                <span className="font-mono text-sm font-bold text-terminal-green">
                  {r.overallScore.toFixed(1)}
                  <span className="text-white/30"> / 10</span>
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">
                {r.name}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-white/40">
                {tReviews(`bodies.${r.slug}.verdict`, { defaultValue: r.verdict })}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-4 border-t border-white/5 pt-10">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/30">
          {tReviews('ui.otherCategoriesHeading', { defaultValue: 'Other review categories' })}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {otherCategories.map((c) => (
            <Link
              key={c}
              to={`${langPrefix}/reviews/${CATEGORY_URL_SLUGS[c]}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-terminal-cyan/30 hover:bg-white/[0.04]"
            >
              <span className="font-mono text-sm text-white/70 transition-colors group-hover:text-terminal-cyan">
                {CATEGORY_LABELS[c]}
              </span>
              <span className="font-mono text-xs text-white/25 transition-colors group-hover:text-terminal-cyan/60">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
