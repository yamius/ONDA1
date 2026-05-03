/**
 * Route list for prerender. Used only at build time.
 * Imports all data to enumerate every URL that needs an HTML file.
 */
import { glossaryTerms } from '../src/data/glossary'
import { articles } from '../src/data/articles'
import { parts } from '../src/pages/PartPage'
import { levelsData } from '../src/data/levels'
import { TOPICS } from '../src/data/topics'
import { METRIC_DETAILS } from '../src/data/bioMetrics'
import { localizedRouteVariants, metricRouteVariants, levelRouteVariants, partRouteVariants, topicRouteVariants, glossarySlugRouteVariants, articleSlugRouteVariants, LOCALIZED_PAGES } from '../src/i18n'

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

// /topics/:slug variants × 5 languages.
const topicSlugs = TOPICS.map((t) => t.slug)
const localizedTopicRoutes = topicRouteVariants(topicSlugs)

// /glossary/:slug variants × 5 languages.
const glossarySlugs = glossaryTerms.map((t) => t.slug)
const localizedGlossarySlugRoutes = glossarySlugRouteVariants(glossarySlugs)

// /articles/:slug variants × 5 languages.
const articleSlugs = articles.map((a) => a.slug)
const localizedArticleSlugRoutes = articleSlugRouteVariants(articleSlugs)

// Pages that stay EN-only for now (Articles, etc).
const nonLocalizedStaticPaths = [
  '/contact',
  '/the-stack',
  '/sitemap',
  '/privacy',
  '/terms',
  '/license',
]

const staticPaths = [
  ...localizedRoutes,
  ...nonLocalizedStaticPaths,
]

export function getPrerenderRoutes(): string[] {
  return [
    ...staticPaths,
    ...localizedGlossarySlugRoutes,
    ...localizedArticleSlugRoutes,
    ...localizedTopicRoutes,
    ...localizedPartRoutes,
    ...localizedLevelRoutes,
    ...localizedMetricRoutes,
  ]
}

/** Set of all routes that are localized variants of static pages — used by prerender + sitemap. */
export const LOCALIZED_ROUTE_SET = new Set(localizedRoutes)

/** Set of all routes that are localized metric detail pages. */
export const LOCALIZED_METRIC_ROUTE_SET = new Set(localizedMetricRoutes)

/** Set of all routes that are localized level detail pages. */
export const LOCALIZED_LEVEL_ROUTE_SET = new Set(localizedLevelRoutes)

/** Set of all routes that are localized part detail pages. */
export const LOCALIZED_PART_ROUTE_SET = new Set(localizedPartRoutes)

/** Set of all routes that are localized topic detail pages. */
export const LOCALIZED_TOPIC_ROUTE_SET = new Set(localizedTopicRoutes)

/** All topic slugs (for sitemap hreflang per topic). */
export const TOPIC_SLUGS = topicSlugs

/** Set of all routes that are localized glossary detail pages. */
export const LOCALIZED_GLOSSARY_SLUG_ROUTE_SET = new Set(localizedGlossarySlugRoutes)

/** All glossary term slugs (for sitemap hreflang per term). */
export const GLOSSARY_TERM_SLUGS = glossarySlugs

/** Set of all routes that are localized article detail pages. */
export const LOCALIZED_ARTICLE_SLUG_ROUTE_SET = new Set(localizedArticleSlugRoutes)

/** All article slugs (for sitemap hreflang per article). */
export const ARTICLE_SLUGS = articleSlugs

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
