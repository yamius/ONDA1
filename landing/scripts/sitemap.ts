/**
 * Generates sitemap.xml with all prerendered routes for Google indexing.
 * Run after: npm run build (prerender calls this at the end)
 *
 * Priority: Main 1.0, /glossary (hub) 0.9, /level/ 0.8, /glossary/:slug 0.7
 * Lastmod: real date for article/glossary/review pages; omitted otherwise
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPrerenderRoutes, LOCALIZED_ROUTE_SET, LOCALIZED_BASE_PATHS, LOCALIZED_METRIC_ROUTE_SET, METRIC_KEYS, LOCALIZED_LEVEL_ROUTE_SET, LEVEL_NUMBERS, LOCALIZED_PART_ROUTE_SET, PART_SLUGS, LOCALIZED_ARTICLE_ROUTE_SET, ALL_PILOT_ARTICLE_SLUGS, articleLocalizedLangs, RU_PILOT_REVIEW_SLUGS, RU_PILOT_COMPARISON_SLUGS, INDEXED_TOPIC_SLUGS } from './prerender-routes'
import { SUPPORTED_LANGS, stripLangPrefix, localizedPathFor, metricPathFor, levelPathFor, partPathFor, parseMetricRoute, parseLevelRoute, parsePartRoute, type Lang } from '../src/i18n'
import { FEATURED_ARTICLE_SLUGS } from '../src/data/articles-categories'
import { FEATURED_TERM_SLUGS } from '../src/data/glossary-categories'
import { getArticleBySlug } from '../src/data/articles'
import { ARTICLE_DATES } from '../src/data/article-dates.generated'
import { getReviewBySlug, getComparisonBySlug } from '../src/data/reviews'
import { readFileSync } from 'fs'

/** Minimal XML attribute/text escaper. Order matters: ampersand first. */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Per-article image:image block for Google Image Search (Image Sitemap
 * extension). Empty string if the article has no hero image. Title and
 * caption fall back through (imageTitle -> title) and (imageCaption ->
 * imageAlt -> title) so we always emit useful text.
 */
function buildImageBlockForArticle(slug: string): string {
  const article = getArticleBySlug(slug)
  if (!article || !article.image) return ''
  const loc = `${SITE_URL}${article.image}`
  const title = article.imageTitle || article.title
  const caption = article.imageCaption || article.imageAlt || article.title
  return `\n    <image:image>
      <image:loc>${escapeXml(loc)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>`
}

// Featured slugs get higher priority + weekly changefreq so Google
// re-crawls them more often. Regular articles/terms drop one tier
// below to make the relative weighting visible to crawlers.
const FEATURED_ARTICLE_SET = new Set<string>(FEATURED_ARTICLE_SLUGS)
const FEATURED_TERM_SET = new Set<string>(FEATURED_TERM_SLUGS)

function articleSlugFromRoute(route: string): string | null {
  const m = route.match(/^\/articles\/([^/]+)$/)
  return m ? m[1] : null
}

function glossarySlugFromRoute(route: string): string | null {
  const m = route.match(/^\/glossary\/([^/]+)$/)
  return m ? m[1] : null
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'

/** Build canonical URL without trailing slash. Ensures https only. */
function buildLoc(path: string): string {
  const base = SITE_URL.replace(/\/+$/, '')
  const cleanPath = (path || '/').replace(/\/+$/, '') || '/'
  return cleanPath === '/' ? base : `${base}${cleanPath}`
}

function getPriority(route: string): string {
  if (route === '/') return '1.0'
  if (LOCALIZED_ROUTE_SET.has(route)) return '0.9'
  if (LOCALIZED_METRIC_ROUTE_SET.has(route)) return '0.7'
  if (LOCALIZED_LEVEL_ROUTE_SET.has(route)) return '0.8'
  if (route === '/glossary') return '0.9'
  if (route === '/articles') return '0.9'
  if (route === '/topics') return '0.9'
  if (route.startsWith('/topics/')) return '0.85'
  if (route === '/contact') return '0.8'
  if (route.startsWith('/level/')) return '0.8'
  const articleSlug = articleSlugFromRoute(route)
  if (articleSlug) return FEATURED_ARTICLE_SET.has(articleSlug) ? '0.9' : '0.7'
  const termSlug = glossarySlugFromRoute(route)
  if (termSlug) return FEATURED_TERM_SET.has(termSlug) ? '0.8' : '0.6'
  return '0.8'
}

function getChangefreq(route: string): string {
  if (route === '/') return 'weekly'
  const articleSlug = articleSlugFromRoute(route)
  if (articleSlug && FEATURED_ARTICLE_SET.has(articleSlug)) return 'weekly'
  const termSlug = glossarySlugFromRoute(route)
  if (termSlug && FEATURED_TERM_SET.has(termSlug)) return 'weekly'
  return 'monthly'
}

/**
 * Real content-modification date for a route as YYYY-MM-DD, or null.
 *
 * Only article and glossary pages carry a tracked modification date
 * (ARTICLE_DATES, derived from git history). Every other route returns
 * null so <lastmod> is omitted: stamping the build date on 500+ URLs
 * each deploy reads as a mass content refresh — a known search-spam
 * signal — whereas a missing <lastmod> is spec-valid and honest.
 */
function getLastmod(route: string): string | null {
  const slug = route.match(/^(?:\/(?:es|ru|uk|zh))?\/articles\/([^/]+)$/)?.[1]
  if (slug) {
    const d = ARTICLE_DATES[slug]
    return d ? (d.modified || d.published).slice(0, 10) : null
  }
  if (/^(?:\/(?:es|ru|uk|zh))?\/glossary\/[^/]+$/.test(route)) {
    const d = ARTICLE_DATES['__glossary']
    return d ? (d.modified || d.published).slice(0, 10) : null
  }
  const cmpSlug = route.match(/^(?:\/(?:es|ru|uk|zh))?\/reviews\/compare\/([^/]+)$/)?.[1]
  if (cmpSlug) {
    const c = getComparisonBySlug(cmpSlug)
    return c ? c.dateModified.slice(0, 10) : null
  }
  const revSlug = route.match(/^(?:\/(?:es|ru|uk|zh))?\/reviews\/([^/]+)$/)?.[1]
  if (revSlug && revSlug !== 'methodology') {
    const r = getReviewBySlug(revSlug)
    return r ? r.dateModified.slice(0, 10) : null
  }
  return null
}

// Per-language part translations table. Used to:
//   1. include /:lang/part/:slug URLs in sitemap only when that language has
//      a translation (otherwise canonical points to EN, sitemap entry would
//      duplicate the EN URL).
//   2. build hreflang clusters per part with only the langs that have body.
const localesDir = join(__dirname, '..', 'public', 'locales')
const partTranslated: Record<string, Lang[]> = {}
for (const slug of PART_SLUGS) {
  partTranslated[slug] = ['en']
  for (const lang of SUPPORTED_LANGS) {
    if (lang === 'en') continue
    const file = JSON.parse(readFileSync(join(localesDir, lang, 'part.json'), 'utf-8')) as { parts?: Record<string, unknown> }
    if (file.parts && file.parts[slug]) partTranslated[slug].push(lang)
  }
}

const allRoutes = getPrerenderRoutes()
const INDEXED_TOPIC_SET = new Set<string>(INDEXED_TOPIC_SLUGS)
const routes = allRoutes.filter((r) => {
  if (LOCALIZED_PART_ROUTE_SET.has(r)) {
    const info = parsePartRoute(r)
    if (!info) return false
    // Include EN always; non-EN only if translated.
    return partTranslated[info.slug]?.includes(info.lang)
  }
  // Topic hubs: only include hubs that have a pillar (rest are noindex).
  const tm = r.match(/^\/topics\/([^/]+)$/)
  if (tm) return INDEXED_TOPIC_SET.has(tm[1])
  return true
})

/** Pre-build hreflang alternates for each localized base path. */
const altsByBase: Record<string, string> = {}
for (const base of LOCALIZED_BASE_PATHS) {
  const tags = SUPPORTED_LANGS.map(l => {
    const href = `${SITE_URL}${localizedPathFor(base, l)}`.replace(/\/+$/, '') || SITE_URL
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  })
  const enHref = `${SITE_URL}${localizedPathFor(base, 'en')}`.replace(/\/+$/, '') || SITE_URL
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${enHref}"/>`)
  altsByBase[base] = tags.join('\n')
}

/** Pre-build hreflang alternates for each metric. */
const altsByMetric: Record<string, string> = {}
for (const key of METRIC_KEYS) {
  const tags = SUPPORTED_LANGS.map(l => {
    const href = `${SITE_URL}${metricPathFor(key, l)}`
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  })
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${metricPathFor(key, 'en')}"/>`)
  altsByMetric[key] = tags.join('\n')
}

/** Pre-build hreflang alternates for each level. */
const altsByLevel: Record<number, string> = {}
for (const n of LEVEL_NUMBERS) {
  const tags = SUPPORTED_LANGS.map(l => {
    const href = `${SITE_URL}${levelPathFor(n, l)}`
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  })
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${levelPathFor(n, 'en')}"/>`)
  altsByLevel[n] = tags.join('\n')
}

/** Pre-build hreflang alternates for each pilot article — emitted on EN URL and on every localised sibling. */
const altsByArticle: Record<string, string> = {}
for (const slug of ALL_PILOT_ARTICLE_SLUGS) {
  const langs = articleLocalizedLangs(slug)
  if (langs.length <= 1) continue
  const tags = langs.map((l) => {
    const href = l === 'en' ? `${SITE_URL}/articles/${slug}` : `${SITE_URL}/${l}/articles/${slug}`
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  })
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/articles/${slug}"/>`)
  altsByArticle[slug] = tags.join('\n')
}

/** Pre-build hreflang alternates for review/comparison/hub pages with a RU
 *  sibling (RU pilot — Sleep apps category). Emitted on EN and RU URLs. */
function reviewCluster(enPath: string): string {
  const tags = ['en', 'ru'].map((l) => {
    const href = l === 'en' ? `${SITE_URL}${enPath}` : `${SITE_URL}/${l}${enPath}`
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  })
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${enPath}"/>`)
  return tags.join('\n')
}
const altsByReviewSlug: Record<string, string> = {}
for (const slug of RU_PILOT_REVIEW_SLUGS) altsByReviewSlug[slug] = reviewCluster(`/reviews/${slug}`)
const altsByComparisonSlug: Record<string, string> = {}
for (const slug of RU_PILOT_COMPARISON_SLUGS) altsByComparisonSlug[slug] = reviewCluster(`/reviews/compare/${slug}`)
const reviewHubAlts = reviewCluster('/reviews')

/** Hreflang cluster for a review hub / review / comparison route, or '' . */
function reviewAlternates(path: string): string {
  if (path === '/reviews' || path === '/ru/reviews') return reviewHubAlts
  let m = path.match(/^(?:\/ru)?\/reviews\/compare\/([^/]+)$/)
  if (m) return altsByComparisonSlug[m[1]] ?? ''
  m = path.match(/^(?:\/ru)?\/reviews\/([^/]+)$/)
  if (m && m[1] !== 'methodology') return altsByReviewSlug[m[1]] ?? ''
  return ''
}

/** Pre-build hreflang alternates for each part — only languages with translations. */
const altsByPart: Record<string, string> = {}
for (const slug of PART_SLUGS) {
  const langs = partTranslated[slug]
  if (langs.length <= 1) continue // EN-only — no alternates
  const tags = langs.map(l => {
    const href = `${SITE_URL}${partPathFor(slug, l)}`
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  })
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${partPathFor(slug, 'en')}"/>`)
  altsByPart[slug] = tags.join('\n')
}

const urls = routes.map((path) => {
  const loc = buildLoc(path)
  const lastmod = getLastmod(path)
  const priority = getPriority(path)
  const changefreq = getChangefreq(path)
  // Image Sitemap extension: list the article's hero image so Google
  // Image Search can index it with our title + caption metadata.
  const articleSlug = articleSlugFromRoute(path)
  const images = articleSlug ? buildImageBlockForArticle(articleSlug) : ''
  let alternates = ''
  if (LOCALIZED_ROUTE_SET.has(path)) {
    const base = stripLangPrefix(path)
    alternates = `\n${altsByBase[base] ?? ''}`
  } else if (LOCALIZED_METRIC_ROUTE_SET.has(path)) {
    const info = parseMetricRoute(path)
    if (info) alternates = `\n${altsByMetric[info.metric] ?? ''}`
  } else if (LOCALIZED_LEVEL_ROUTE_SET.has(path)) {
    const info = parseLevelRoute(path)
    if (info) alternates = `\n${altsByLevel[info.levelNum] ?? ''}`
  } else if (LOCALIZED_PART_ROUTE_SET.has(path)) {
    const info = parsePartRoute(path)
    if (info && altsByPart[info.slug]) alternates = `\n${altsByPart[info.slug]}`
  } else if (LOCALIZED_ARTICLE_ROUTE_SET.has(path)) {
    // Localised /es/articles/<slug>
    const m = path.match(/^\/(?:en|es|ru|uk|zh)\/articles\/([^/]+)$/)
    if (m && altsByArticle[m[1]]) alternates = `\n${altsByArticle[m[1]]}`
  } else if (articleSlug && altsByArticle[articleSlug]) {
    // EN /articles/<slug> for a slug that has a localised sibling.
    alternates = `\n${altsByArticle[articleSlug]}`
  } else {
    // Review hub / review / comparison — EN or RU (pilot: Sleep apps).
    const revAlts = reviewAlternates(path)
    if (revAlts) alternates = `\n${revAlts}`
  }
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alternates}${images}
  </url>`
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`

mkdirSync(distDir, { recursive: true })
writeFileSync(join(distDir, 'sitemap.xml'), sitemap)
console.log('[sitemap] Generated sitemap.xml with', routes.length, 'URLs')
