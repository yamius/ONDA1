/**
 * Route list for prerender. Used only at build time.
 * Imports all data to enumerate every URL that needs an HTML file.
 */
import { glossaryTerms } from '../src/data/glossary'
import { articles } from '../src/data/articles'
import { parts } from '../src/pages/PartPage'
import { levelsData } from '../src/data/levels'
import { METRIC_DETAILS } from '../src/data/bioMetrics'

const staticPaths = [
  '/',
  '/about',
  '/glossary',
  '/articles',
  '/contact',
  '/the-stack',
  '/sitemap',
  '/inner-spectrum',
  '/bio',
  '/privacy',
  '/terms',
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
