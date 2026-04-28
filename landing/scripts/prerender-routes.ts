/**
 * Route list for prerender. Used only at build time.
 * Imports all data to enumerate every URL that needs an HTML file.
 */
import { glossaryTerms } from '../src/data/glossary'
import { articles } from '../src/data/articles'
import { parts } from '../src/pages/PartPage'
import { levelsData } from '../src/data/levels'
import { METRIC_DETAILS } from '../src/data/bioMetrics'
import { localizedRouteVariants, LOCALIZED_PAGES } from '../src/i18n'

// Pages localized into all 5 languages — each gets its own prerendered HTML
// per language. Generated from LOCALIZED_PAGES (single source of truth in i18n.ts).
const localizedRoutes = localizedRouteVariants()

// Pages that stay EN-only for now (Phase 2 stops at home/about/bio/inner-spectrum).
const nonLocalizedStaticPaths = [
  '/glossary',
  '/articles',
  '/contact',
  '/the-stack',
  '/sitemap',
  '/privacy',
  '/terms',
]

const staticPaths = [
  ...localizedRoutes,
  ...nonLocalizedStaticPaths,
]

export function getPrerenderRoutes(): string[] {
  return [
    ...staticPaths,
    ...glossaryTerms.map((t) => `/glossary/${t.slug}`),
    ...articles.map((a) => `/articles/${a.slug}`),
    ...Object.keys(parts).map((s) => `/part/${s}`),
    ...Object.keys(levelsData).map((n) => `/level/${n}`),
    ...Object.keys(METRIC_DETAILS).map((k) => `/bio/${k}`),
  ]
}

/** Set of all routes that are localized variants — used by prerender + sitemap. */
export const LOCALIZED_ROUTE_SET = new Set(localizedRoutes)

/** EN base paths that have localized variants — used by sitemap for hreflang grouping. */
export const LOCALIZED_BASE_PATHS = Object.keys(LOCALIZED_PAGES)

// Backwards compat for prerender.ts (kept so the diff to caller is minimal).
export const HOME_LANG_PATHS = ['/', '/es', '/ru', '/uk', '/zh']
