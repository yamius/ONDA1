/**
 * Route list for prerender. Used only at build time.
 * Imports all data to enumerate every URL that needs an HTML file.
 */
import { glossaryTerms } from '../src/data/glossary'
import { articles } from '../src/data/articles'
import { TOPIC_SLUGS, INDEXED_TOPIC_SLUGS } from '../src/data/topics'
import { parts } from '../src/pages/PartPage'
import { levelsData } from '../src/data/levels'
import { METRIC_DETAILS } from '../src/data/bioMetrics'
import { reviews, comparisons } from '../src/data/reviews'
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
] as const

export const ES_PILOT_ARTICLE_SLUGS: readonly string[] = [
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
] as const

const localizedEsArticleRoutes = ES_PILOT_ARTICLE_SLUGS.map((s) => `/es/articles/${s}`)
const localizedRuArticleRoutes = RU_PILOT_ARTICLE_SLUGS.map((s) => `/ru/articles/${s}`)

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
  // Spanish — drip-published one category per Monday. Add meditation-app
  // here once its ES translation lands.
  { lang: 'es', category: 'sleep-app', publishOn: '2026-05-16' },
  { lang: 'es', category: 'hrv-wearable', publishOn: '2026-05-18' },
]

/** Build date (UTC) — the gate the rollout schedule is compared against. */
const REVIEW_BUILD_DATE = new Date().toISOString().slice(0, 10)

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
  return langs
}

/** Union of all article slugs that have at least one localised URL prerendered. */
export const ALL_PILOT_ARTICLE_SLUGS: readonly string[] = Array.from(
  new Set<string>([...ES_PILOT_ARTICLE_SLUGS, ...RU_PILOT_ARTICLE_SLUGS]),
)

// Pages that stay EN-only for now (Articles, Glossary, etc).
// NOTE: /privacy + /terms moved to LOCALIZED_PAGES (i18n.ts) — they now ship
// in all 5 langs via localizedRoutes. JSON translations already exist in
// public/locales/*/{privacy,terms}.json.
const nonLocalizedStaticPaths = [
  '/glossary',
  '/articles',
  '/contact',
  '/the-stack',
  '/sitemap',
  '/topics',
  '/reviews',
  '/reviews/methodology',
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
    ...localizedPartRoutes,
    ...localizedLevelRoutes,
    ...localizedMetricRoutes,
    ...topicHubRoutes,
    ...reviews.map((r) => `/reviews/${r.slug}`),
    ...comparisons.map((c) => `/reviews/compare/${c.slug}`),
    ...localizedReviewRoutes,
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
])

/** Set of localized review/comparison/hub/methodology routes (all pilots). */
export const LOCALIZED_REVIEW_ROUTE_SET = new Set(localizedReviewRoutes)

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
