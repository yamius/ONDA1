/**
 * Route list for prerender. Used only at build time.
 * Imports all data to enumerate every URL that needs an HTML file.
 */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { glossaryTerms } from '../src/data/glossary'
import { articles } from '../src/data/articles'
import { TOPIC_SLUGS, INDEXED_TOPIC_SLUGS } from '../src/data/topics'
import { parts } from '../src/pages/PartPage'
import { levelsData } from '../src/data/levels'
import { METRIC_DETAILS } from '../src/data/bioMetrics'
import { reviews, comparisons, headToHeads, CATEGORY_URL_SLUGS } from '../src/data/reviews'
import { localizedRouteVariants, metricRouteVariants, levelRouteVariants, partRouteVariants, LOCALIZED_PAGES } from '../src/i18n'

// Pages localized into all 5 languages — each gets its own prerendered HTML
// per language. Generated from LOCALIZED_PAGES (single source of truth in i18n.ts).
const localizedRoutes = localizedRouteVariants()

// /bio/:metric variants × 5 languages.
const metricKeys = Object.keys(METRIC_DETAILS)
const localizedMetricRoutes = metricRouteVariants(metricKeys)

// /level/:n variants × 5 languages.
const levelNumbers = Object.keys(levelsData).map(Number)
const localizedLevelRoutes = levelRouteVariants(levelNumbers)

// /part/:slug variants × 5 languages.
const partSlugs = Object.keys(parts)
const localizedPartRoutes = partRouteVariants(partSlugs)

/**
 * Pilot list: 22 articles where the Spanish localised URL goes live.
 * Listed slugs get a prerendered /es/articles/<slug> page plus an
 * en+es+x-default hreflang cluster on both the EN and ES URLs (and
 * matching <xhtml:link> entries in sitemap.xml).
 *
 * Adding a slug here is the single trigger — only do it once the ES
 * translation in public/locales/es/articles.json has been reviewed
 * end-to-end. Raw LLM-translated YMYL content shipped as fresh URLs
 * at scale risks Google's "scaled content abuse" classifier.
 *
 * Roadmap for expansion: review remaining 45 ES translations, then
 * gate RU activation behind a Russian reviewer, etc.
 */
export const RU_PILOT_ARTICLE_SLUGS: readonly string[] = [
  // 11 featured pillar articles (same set as ES — overlapping pilots is
  // intentional so we can compare ES vs RU SERP performance per slug).
  'vagus-nerve-master-key',
  'neuroplasticity-flow-overclocking',
  'neural-entrainment-meditation-2',
  'electric-medicine-neuromodulation',
  'muscle-metabolic-marker',
  'chm-continuous-hormone-monitoring',
  'glymphatic-flush-clearing-neural-cache',
  'cpg-neural-autopilot',
  'co2-tolerance-expanding-oxygen-limit',
  'dopamine-architecture-mastering-desire',
  'gut-brain-axis-data-link',
  // +1 high-volume Russian search topic (циркадные ритмы / биохакинг сна).
  'circadian-reset-mastering-light',
  // Molecular Psychology pillar — RU translation reviewed, ships with the pilot.
  'molecular-psychology-hormonal-firmware',
] as const

/**
 * Spanish article pilot. The 22 base slugs below are already live. The
 * remaining 45 reviewed ES translations are drip-published via
 * ES_ARTICLE_ROLLOUT — each slug carries the date its /es/articles/<slug>
 * URL goes live, gated at BUILD TIME. Same discipline as REVIEW_ROLLOUT:
 * a finished translation sits in the repo yet stays invisible to crawlers
 * until its day. One ~11-article batch per Monday redeploy reads to
 * Google as organic growth, not a scaled-content dump.
 */
const ES_ARTICLE_PILOT_BASE: readonly string[] = [
  // 11 featured pillar articles (FEATURED_ARTICLE_SLUGS).
  'vagus-nerve-master-key',
  'neuroplasticity-flow-overclocking',
  'neural-entrainment-meditation-2',
  'electric-medicine-neuromodulation',
  'muscle-metabolic-marker',
  'chm-continuous-hormone-monitoring',
  'glymphatic-flush-clearing-neural-cache',
  'cpg-neural-autopilot',
  'co2-tolerance-expanding-oxygen-limit',
  'dopamine-architecture-mastering-desire',
  'gut-brain-axis-data-link',
  // 11 high-value follow-ups (sleep / breathwork / metabolism / HRV).
  'circadian-reset-mastering-light',
  'metabolic-flexibility-dual-fuel-system',
  'breathwork-command-line-interface',
  'dopamine-stacking-preventing-circuit-overload',
  'nightly-flush-glymphatic-neural-cache',
  'nervous-system-ping-latency',
  'fault-tolerant-human-hrv-buffer',
  'resonant-frequency-system-coherence',
  'baroreflex-01hz-shift',
  'idle-state-alpha-rhythms',
  'interoceptive-precision-sensor-calibration',
]

interface ArticleRolloutEntry {
  slug: string
  /** ISO date (YYYY-MM-DD) the /es/articles/<slug> URL goes live. */
  publishOn: string
}

/** Remaining 45 reviewed ES article translations, ~11 per Monday. */
const ES_ARTICLE_ROLLOUT: ArticleRolloutEntry[] = [
  // Batch 1 — 2026-06-22
  { slug: 'acc-calibration-protocol-cognitive-control', publishOn: '2026-06-22' },
  { slug: 'acetylcholine-lens-neuro-mechanics', publishOn: '2026-06-22' },
  { slug: 'adaptation-hack-range-fractionation', publishOn: '2026-06-22' },
  { slug: 'adrenal-governor-thermal-runaway', publishOn: '2026-06-22' },
  { slug: 'ai-biomarker-tracking-predictive', publishOn: '2026-06-22' },
  { slug: 'ancestral-sync-circadian-anchors', publishOn: '2026-06-22' },
  { slug: 'anterior-cingulate-core-coherence-monitoring', publishOn: '2026-06-22' },
  { slug: 'anti-entropy-neural-architecture', publishOn: '2026-06-22' },
  { slug: 'biological-latency-optimizing-system-ping', publishOn: '2026-06-22' },
  { slug: 'bohr-effect-oxygen-telemetry', publishOn: '2026-06-22' },
  { slug: 'cacao-stem-cells', publishOn: '2026-06-22' },
  { slug: 'circadian-lighting-dark-therapy', publishOn: '2026-06-22' },
  // Batch 2 — 2026-06-29
  { slug: 'cognitive-architecture-neural-throughput', publishOn: '2026-06-29' },
  { slug: 'cognitive-architecture-nootropic-stacks', publishOn: '2026-06-29' },
  { slug: 'digital-dementia-attentional-control', publishOn: '2026-06-29' },
  { slug: 'endocrine-social-drive-oxytocin-testosterone', publishOn: '2026-06-29' },
  { slug: 'energy-governor-tsh', publishOn: '2026-06-29' },
  { slug: 'energy-sensor-leptin', publishOn: '2026-06-29' },
  { slug: 'fascial-tensegrity-protocol-myofascial-noise', publishOn: '2026-06-29' },
  { slug: 'femtech-cyclical-architecture', publishOn: '2026-06-29' },
  { slug: 'glp1-biology-muscle-preservation', publishOn: '2026-06-29' },
  { slug: 'hpa-axis-control-cortisol-aggression', publishOn: '2026-06-29' },
  { slug: 'hrv-training-nervous-system-latency', publishOn: '2026-06-29' },
  // Batch 3 — 2026-07-06
  { slug: 'hydraulic-viscosity-onda-transport-bus', publishOn: '2026-07-06' },
  { slug: 'longevity-hardware-cellular-cleanup', publishOn: '2026-07-06' },
  { slug: 'longevity-protocol-biological-clock-reset', publishOn: '2026-07-06' },
  { slug: 'metabolic-redundancy-hybrid-power-architecture', publishOn: '2026-07-06' },
  { slug: 'mitochondrial-biogenesis-cellular-power-grid', publishOn: '2026-07-06' },
  { slug: 'mitochondrial-dna-red-light', publishOn: '2026-07-06' },
  { slug: 'neural-bridge-alpha-flow-gateway', publishOn: '2026-07-06' },
  { slug: 'neural-hydraulics-csf-flow', publishOn: '2026-07-06' },
  { slug: 'neural-optimizer-estrogen', publishOn: '2026-07-06' },
  { slug: 'neural-signal-to-noise-cleaning-system-channel', publishOn: '2026-07-06' },
  { slug: 'phase-locked-acoustic-sleep', publishOn: '2026-07-06' },
  // Batch 4 — 2026-07-13
  { slug: 'physiological-concentration-flow-state-hardwired', publishOn: '2026-07-13' },
  { slug: 'protocol-circadian-hard-reset', publishOn: '2026-07-13' },
  { slug: 'quiet-mode-alpha-cortisol-buffer', publishOn: '2026-07-13' },
  { slug: 'rhythmic-entrainment-system-frequencies', publishOn: '2026-07-13' },
  { slug: 'senolytic-high-dosing-longevity', publishOn: '2026-07-13' },
  { slug: 'spinal-harddrive-cpg-autonomous-scripts', publishOn: '2026-07-13' },
  { slug: 'spinal-intelligence-decentralized-control', publishOn: '2026-07-13' },
  { slug: 'system-feedback-biometric-loop', publishOn: '2026-07-13' },
  { slug: 'system-stability-serotonin', publishOn: '2026-07-13' },
  { slug: 'vascular-tensegrity-microvascular-mechanics', publishOn: '2026-07-13' },
  { slug: 'ventral-tegmental-core-motivational-salience', publishOn: '2026-07-13' },
  // Molecular Psychology pillar — joins the final ES batch.
  { slug: 'molecular-psychology-hormonal-firmware', publishOn: '2026-07-13' },
]

/** Build date (UTC) — the gate every rollout schedule compares against. */
const BUILD_DATE = new Date().toISOString().slice(0, 10)

/** Article slugs with a live /es/articles/<slug> URL — the base pilot plus
 *  rollout entries whose publishOn date has been reached at build time. */
export const ES_PILOT_ARTICLE_SLUGS: readonly string[] = [
  ...ES_ARTICLE_PILOT_BASE,
  ...ES_ARTICLE_ROLLOUT.filter((e) => e.publishOn <= BUILD_DATE).map((e) => e.slug),
]

const localizedEsArticleRoutes = ES_PILOT_ARTICLE_SLUGS.map((s) => `/es/articles/${s}`)
const localizedRuArticleRoutes = RU_PILOT_ARTICLE_SLUGS.map((s) => `/ru/articles/${s}`)

/**
 * Glossary localisation rollout. Every reviewed term translation lives in
 * public/locales/<lang>/glossary.json; the GlossaryTermPage component
 * already reads it. Terms are drip-published GLOSSARY_BATCH per Monday
 * from each language's `start` date, gated at BUILD TIME — same discipline
 * as the article and review rollouts. Each /<lang>/glossary index ships
 * with that language's first batch.
 *
 * ES and RU schedules are staggered so a Monday redeploy never surfaces
 * two full-language batches at once: ES runs 2026-07-20 → 2026-09-28,
 * RU picks up the week after ES completes.
 */
const __dirname = dirname(fileURLToPath(import.meta.url))
const GLOSSARY_BATCH = 21

interface GlossaryRollout {
  lang: string
  /** First Monday (YYYY-MM-DD) the language's drip schedule begins. */
  start: string
}

const GLOSSARY_ROLLOUTS: readonly GlossaryRollout[] = [
  { lang: 'es', start: '2026-07-20' },
  { lang: 'ru', start: '2026-10-05' },
]

function loadGlossaryBodies(lang: string): Record<string, unknown> {
  try {
    const f = JSON.parse(
      readFileSync(join(__dirname, '..', 'public', 'locales', lang, 'glossary.json'), 'utf-8'),
    ) as { bodies?: Record<string, unknown> }
    return f.bodies ?? {}
  } catch {
    return {}
  }
}

function glossaryPublishDate(start: string, index: number): string {
  const d = new Date(`${start}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + Math.floor(index / GLOSSARY_BATCH) * 7)
  return d.toISOString().slice(0, 10)
}

/** lang → ordered list of glossary slugs whose publishOn Monday has been
 *  reached at build time. A future-dated language is simply absent. */
const liveGlossaryByLang: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {}
  for (const { lang, start } of GLOSSARY_ROLLOUTS) {
    const bodies = loadGlossaryBodies(lang)
    const slugs = glossaryTerms
      .map((t) => t.slug)
      .filter((s) => s in bodies)
      .sort()
    const live = slugs.filter((_s, i) => glossaryPublishDate(start, i) <= BUILD_DATE)
    if (live.length) out[lang] = live
  }
  return out
})()

const liveGlossarySetByLang: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(liveGlossaryByLang).map(([lang, slugs]) => [lang, new Set(slugs)]),
)

const localizedGlossaryRoutes: string[] = Object.entries(liveGlossaryByLang).flatMap(
  ([lang, slugs]) => [`/${lang}/glossary`, ...slugs.map((s) => `/${lang}/glossary/${s}`)],
)

/** Languages with at least one glossary term live — gates each /<lang>/glossary index. */
export const GLOSSARY_LIVE_LANGS: readonly string[] = Object.keys(liveGlossaryByLang)

/** Backwards-compat flag: true once at least one ES glossary term is live. */
export const ES_GLOSSARY_LIVE: boolean = (liveGlossaryByLang['es']?.length ?? 0) > 0

/** Hreflang cluster for the glossary index — EN plus every language whose
 *  /<lang>/glossary index is live. */
export const GLOSSARY_INDEX_LANGS: readonly string[] = ['en', ...GLOSSARY_LIVE_LANGS]

/** Languages with a localised URL prerendered for a glossary term. */
export function glossaryLocalizedLangs(slug: string): readonly string[] {
  const langs: string[] = ['en']
  for (const [lang, set] of Object.entries(liveGlossarySetByLang)) {
    if (set.has(slug)) langs.push(lang)
  }
  return langs
}

/**
 * Programmatic article-localisation rollout for UK and ZH. Their
 * articles.json carries the full reviewed article translation; this
 * drip-publishes ARTICLE_ROLLOUT_BATCH articles per Monday from each
 * language's start date, gated at BUILD TIME — the same anti-scaled-content
 * discipline as the ES article rollout and the glossary rollout.
 *
 * Staggered so no Monday redeploy surfaces two full-locale batches at once:
 * ES articles finish 2026-07-13, so UK starts 2026-08-03; ZH starts
 * 2026-11-02, after the RU glossary rollout has settled.
 *
 * ES and RU keep their existing hand-curated pilot lists above — this block
 * only adds UK and ZH.
 */
const ARTICLE_ROLLOUT_BATCH = 11
const ARTICLE_LOCALE_ROLLOUTS: readonly { lang: string; start: string }[] = [
  { lang: 'uk', start: '2026-08-03' },
  { lang: 'zh', start: '2026-11-02' },
]
function articleRolloutDate(start: string, index: number): string {
  const d = new Date(`${start}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + Math.floor(index / ARTICLE_ROLLOUT_BATCH) * 7)
  return d.toISOString().slice(0, 10)
}
function loadArticleBodies(lang: string): Record<string, unknown> {
  try {
    const f = JSON.parse(
      readFileSync(join(__dirname, '..', 'public', 'locales', lang, 'articles.json'), 'utf-8'),
    ) as { bodies?: Record<string, unknown> }
    return f.bodies ?? {}
  } catch {
    return {}
  }
}
/** lang → article slugs whose publishOn Monday has been reached at build time. */
const liveLocaleArticles: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {}
  for (const { lang, start } of ARTICLE_LOCALE_ROLLOUTS) {
    const bodies = loadArticleBodies(lang)
    const slugs = articles
      .map((a) => a.slug)
      .filter((s) => s in bodies)
      .sort()
    const live = slugs.filter((_s, i) => articleRolloutDate(start, i) <= BUILD_DATE)
    if (live.length) out[lang] = live
  }
  return out
})()
const liveLocaleArticleSetByLang: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(liveLocaleArticles).map(([lang, slugs]) => [lang, new Set(slugs)]),
)
const localizedLocaleArticleRoutes: string[] = Object.entries(liveLocaleArticles).flatMap(
  ([lang, slugs]) => slugs.map((s) => `/${lang}/articles/${s}`),
)

/**
 * Review-localisation rollout schedule. Each entry is one language ×
 * one review category, with the date its localised /<lang>/reviews/*
 * URLs go live. A category's routes are prerendered — and enter the
 * sitemap and hreflang clusters — only once its publishOn date has been
 * reached at BUILD TIME. So a finished translation can sit fully in the
 * repo yet stay invisible to crawlers (no prerendered HTML, not in the
 * sitemap, not linked anywhere) until its day arrives.
 *
 * Operating model: the site is rebuilt and redeployed manually every
 * Monday. Each Monday, the entries dated that day or earlier come live.
 * One category (~11 pages) per week reads to Google as organic growth
 * rather than a scaled-content dump. Only add an entry here once its
 * translation block in public/locales/<lang>/reviews.json is reviewed
 * end-to-end — the date gate controls *when* it ships, not whether it
 * is ready.
 */
interface ReviewPilotEntry {
  lang: string
  category: string
  /** ISO date (YYYY-MM-DD) the localised URLs go live. */
  publishOn: string
}

const REVIEW_ROLLOUT: ReviewPilotEntry[] = [
  // Russian — full hub, already live.
  { lang: 'ru', category: 'sleep-app', publishOn: '2026-05-16' },
  { lang: 'ru', category: 'hrv-wearable', publishOn: '2026-05-16' },
  { lang: 'ru', category: 'meditation-app', publishOn: '2026-05-16' },
  // Spanish — drip-published one category per Monday.
  { lang: 'es', category: 'sleep-app', publishOn: '2026-05-16' },
  { lang: 'es', category: 'hrv-wearable', publishOn: '2026-05-18' },
  { lang: 'es', category: 'meditation-app', publishOn: '2026-05-25' },
  // Ukrainian — drip-published one category per Monday.
  { lang: 'uk', category: 'sleep-app', publishOn: '2026-06-01' },
  { lang: 'uk', category: 'hrv-wearable', publishOn: '2026-06-08' },
  { lang: 'uk', category: 'meditation-app', publishOn: '2026-06-15' },
]

/** Build date (UTC) — the gate the rollout schedule is compared against. */
const REVIEW_BUILD_DATE = BUILD_DATE

/**
 * Live pilots: language → set of categories whose publishOn date has
 * been reached. Everything downstream (prerendered routes, hreflang,
 * sitemap) derives from this, so a future-dated entry is fully inert.
 */
const REVIEW_PILOTS: Record<string, Set<string>> = (() => {
  const out: Record<string, Set<string>> = {}
  for (const e of REVIEW_ROLLOUT) {
    if (e.publishOn > REVIEW_BUILD_DATE) continue
    ;(out[e.lang] ??= new Set<string>()).add(e.category)
  }
  return out
})()

/** Languages with at least one review category already live. */
export const REVIEW_PILOT_LANGS: readonly string[] = Object.keys(REVIEW_PILOTS)

/** Prerendered review routes for one language pilot — hub, methodology,
 *  every review and comparison in the piloted categories. */
function pilotReviewRoutes(lang: string, cats: ReadonlySet<string>): string[] {
  return [
    `/${lang}/reviews`,
    `/${lang}/reviews/methodology`,
    ...reviews.filter((r) => cats.has(r.category)).map((r) => `/${lang}/reviews/${r.slug}`),
    ...comparisons.filter((c) => cats.has(c.category)).map((c) => `/${lang}/reviews/compare/${c.slug}`),
  ]
}

const localizedReviewRoutes = Object.entries(REVIEW_PILOTS).flatMap(([lang, cats]) =>
  pilotReviewRoutes(lang, cats),
)

/** Languages that have a localised URL prerendered for a review/comparison slug. */
export function reviewLocalizedLangs(slug: string): readonly string[] {
  const rev = reviews.find((r) => r.slug === slug)
  const cmp = comparisons.find((c) => c.slug === slug)
  const cat = rev?.category ?? cmp?.category
  const langs: string[] = ['en']
  if (cat) {
    for (const [lang, cats] of Object.entries(REVIEW_PILOTS)) {
      if (cats.has(cat)) langs.push(lang)
    }
  }
  return langs
}
const ES_PILOT_ARTICLE_SET = new Set<string>(ES_PILOT_ARTICLE_SLUGS)
const RU_PILOT_ARTICLE_SET = new Set<string>(RU_PILOT_ARTICLE_SLUGS)

/** Languages that have a localised URL prerendered for an article slug. */
export function articleLocalizedLangs(slug: string): readonly string[] {
  const langs: string[] = ['en']
  if (ES_PILOT_ARTICLE_SET.has(slug)) langs.push('es')
  if (RU_PILOT_ARTICLE_SET.has(slug)) langs.push('ru')
  for (const [lang, set] of Object.entries(liveLocaleArticleSetByLang)) {
    if (set.has(slug)) langs.push(lang)
  }
  return langs
}

/** Union of all article slugs that have at least one localised URL prerendered. */
export const ALL_PILOT_ARTICLE_SLUGS: readonly string[] = Array.from(
  new Set<string>([
    ...ES_PILOT_ARTICLE_SLUGS,
    ...RU_PILOT_ARTICLE_SLUGS,
    ...Object.values(liveLocaleArticles).flat(),
  ]),
)

// Pages that stay EN-only for now (Articles, Glossary, etc).
// NOTE: /privacy + /terms moved to LOCALIZED_PAGES (i18n.ts) — they now ship
// in all 5 langs via localizedRoutes. JSON translations already exist in
// public/locales/*/{privacy,terms}.json.
const nonLocalizedStaticPaths = [
  '/glossary',
  '/the-stack',
  '/topics',
  '/reviews',
  '/reviews/methodology',
  // /research — dedicated research-partner landing, linked from the
  // Eurostar deck final slide. EN-only by design (peer-review audience).
  '/research',
  // /measurements + /how-it-works — GEO/AI citability pages: exactly what
  // ONDA measures vs derives vs estimates, and the biofeedback method. EN-only.
  '/measurements',
  '/how-it-works',
  // Interactive biohacking tools. EN-only for now.
  '/tools',
  '/tools/hrv',
  '/tools/caffeine',
  '/tools/sleep-debt',
  '/tools/zone-2',
  '/tools/chronotype',
  '/tools/protein',
  '/tools/vo2max',
  '/tools/tdee',
  '/tools/water',
  '/tools/alcohol',
  '/tools/fasting',
  '/tools/jet-lag',
  '/tools/one-rep-max',
  '/tools/body-fat',
  '/tools/sleep-cycle',
  '/tools/cognitive-shuffle',
  '/tools/breathing',
  '/tools/resonance-breathing',
  '/tools/dopamine-detox',
  '/tools/biological-age',
  '/tools/digital-detox',
  '/tools/burnout',
  '/tools/nervous-system',
  '/tools/wim-hof',
  '/tools/brain-fog',
  '/tools/resting-heart-rate',
  '/tools/recovery-score',
  '/tools/camera-heart-rate',
  '/tools/breathing-rate',
  '/tools/breath-heart-biofeedback',
  '/tools/baseline',
  '/embed/hrv',
]

// Every topic hub URL is prerendered. Hubs without a pillar render
// with <meta name=robots content=noindex> so the placeholder never
// pollutes Google's index — the URL still resolves for direct navigation
// from /topics. INDEXED_TOPIC_SLUGS is the subset that actually goes
// into sitemap.xml + hreflang (driven by data/topics.ts).
const topicHubRoutes = TOPIC_SLUGS.map((s) => `/topics/${s}`)

const staticPaths = [
  ...localizedRoutes,
  ...nonLocalizedStaticPaths,
]

export function getPrerenderRoutes(): string[] {
  return [
    ...staticPaths,
    ...glossaryTerms.map((t) => `/glossary/${t.slug}`),
    ...articles.map((a) => `/articles/${a.slug}`),
    ...localizedEsArticleRoutes,
    ...localizedRuArticleRoutes,
    ...localizedLocaleArticleRoutes,
    ...localizedPartRoutes,
    ...localizedLevelRoutes,
    ...localizedMetricRoutes,
    ...topicHubRoutes,
    // Per-category landing pages — /reviews/hrv-trackers, /reviews/cgm, etc.
    // Each gets its own focused page that ranks for the dominant search
    // keyword ("best HRV tracker", "best CGM", "best EEG headset") instead
    // of the single /reviews omnibus. A category is prerendered if it has any
    // live content — an individual review OR a comparison round-up. (Some
    // categories ship the round-up first and add individual reviews later;
    // their landing page must still exist so cross-links don't 404.)
    ...(Array.from(
      new Set([
        ...reviews.map((r) => r.category),
        ...comparisons.map((c) => c.category),
      ]),
    ) as Array<keyof typeof CATEGORY_URL_SLUGS>)
      .map((c) => CATEGORY_URL_SLUGS[c])
      .filter(Boolean)
      .map((s) => `/reviews/${s}`),
    ...reviews.map((r) => `/reviews/${r.slug}`),
    ...comparisons.map((c) => `/reviews/compare/${c.slug}`),
    // Head-to-head duels — /reviews/vs/<product-a>-vs-<product-b>. Distinct
    // from the comparison round-ups; target the high-volume "X vs Y" query.
    ...headToHeads.map((h) => `/reviews/vs/${h.slug}`),
    ...localizedReviewRoutes,
    ...localizedGlossaryRoutes,
  ]
}

/** Slugs that should appear in sitemap.xml (i.e. have a pillar). */
export { INDEXED_TOPIC_SLUGS }

/** Set of all routes that are localized variants of static pages — used by prerender + sitemap. */
export const LOCALIZED_ROUTE_SET = new Set(localizedRoutes)

/** Set of all routes that are localized metric detail pages. */
export const LOCALIZED_METRIC_ROUTE_SET = new Set(localizedMetricRoutes)

/** Set of all routes that are localized level detail pages. */
export const LOCALIZED_LEVEL_ROUTE_SET = new Set(localizedLevelRoutes)

/** Set of all routes that are localized part detail pages. */
export const LOCALIZED_PART_ROUTE_SET = new Set(localizedPartRoutes)

/** Set of localized article routes (ES + RU pilots). */
export const LOCALIZED_ARTICLE_ROUTE_SET = new Set([
  ...localizedEsArticleRoutes,
  ...localizedRuArticleRoutes,
  ...localizedLocaleArticleRoutes,
])

/** Set of localized review/comparison/hub/methodology routes (all pilots). */
export const LOCALIZED_REVIEW_ROUTE_SET = new Set(localizedReviewRoutes)

/** Set of localized glossary routes (ES + RU rollouts — index + due term pages). */
export const LOCALIZED_GLOSSARY_ROUTE_SET = new Set(localizedGlossaryRoutes)

/** EN base paths that have localized variants — used by sitemap for hreflang grouping. */
export const LOCALIZED_BASE_PATHS = Object.keys(LOCALIZED_PAGES)

/** All metric keys (for sitemap hreflang per metric). */
export const METRIC_KEYS = metricKeys

/** All level numbers (for sitemap hreflang per level). */
export const LEVEL_NUMBERS = levelNumbers

/** All part slugs (for sitemap hreflang per part). */
export const PART_SLUGS = partSlugs

// Backwards compat for prerender.ts (kept so the diff to caller is minimal).
export const HOME_LANG_PATHS = ['/', '/es', '/ru', '/uk', '/zh']
