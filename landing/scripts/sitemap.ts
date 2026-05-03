/**
 * Generates sitemap.xml with all prerendered routes for Google indexing.
 * Run after: npm run build (prerender calls this at the end)
 *
 * Priority: Main 1.0, /glossary (hub) 0.9, /level/ 0.8, /glossary/:slug 0.7
 * Lastmod: file mtime when available, else build date
 */
import { writeFileSync, mkdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPrerenderRoutes, LOCALIZED_ROUTE_SET, LOCALIZED_BASE_PATHS, LOCALIZED_METRIC_ROUTE_SET, METRIC_KEYS, LOCALIZED_LEVEL_ROUTE_SET, LEVEL_NUMBERS, LOCALIZED_PART_ROUTE_SET, PART_SLUGS, LOCALIZED_TOPIC_ROUTE_SET, TOPIC_SLUGS } from './prerender-routes'
import { SUPPORTED_LANGS, stripLangPrefix, localizedPathFor, metricPathFor, levelPathFor, partPathFor, topicPathFor, parseMetricRoute, parseLevelRoute, parsePartRoute, parseTopicRoute, type Lang } from '../src/i18n'
import { readFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'
const buildDate = new Date().toISOString().split('T')[0]

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
  if (route === '/contact') return '0.8'
  if (route.startsWith('/level/')) return '0.8'
  if (route.startsWith('/glossary/')) return '0.7'
  if (route.startsWith('/articles/')) return '0.8'
  return '0.8'
}

function getLastmod(route: string): string {
  const filePath =
    route === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.slice(1), 'index.html')
  try {
    if (existsSync(filePath)) {
      const mtime = statSync(filePath).mtime
      return mtime.toISOString().split('T')[0]
    }
  } catch {
    /* ignore */
  }
  return buildDate
}

// Per-language translation tables. Used to:
//   1. include /:lang/part|articles|glossary/:slug URLs in sitemap only when
//      that language has a translated body (otherwise canonical points to EN,
//      sitemap entry would duplicate the EN URL and trigger duplicate-content).
//   2. build hreflang clusters with only the langs that have body content.
//
// Part: gated since launch.
// Article: preventive — articles aren't currently emitted per-locale in
//   prerender-routes (EN-only), so this is a no-op today but guarantees we
//   never ship broken localized URLs once /lang/articles/<slug> goes live.
// Glossary: same logic. ES has 210 terms translated, RU/UK/ZH have 0 — so if
//   localized glossary routes ever ship, ES gets included and the rest skipped.
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

// Articles localization gate (preventive — see comment above).
interface BodiesFile { bodies?: Record<string, unknown> }
const articlesByLang: Partial<Record<Lang, Set<string>>> = {}
for (const lang of SUPPORTED_LANGS) {
  if (lang === 'en') continue
  try {
    const file = JSON.parse(readFileSync(join(localesDir, lang, 'articles.json'), 'utf-8')) as BodiesFile
    articlesByLang[lang] = new Set(Object.keys(file.bodies ?? {}))
  } catch {
    articlesByLang[lang] = new Set()
  }
}
/** Returns true if the localized URL `/${lang}/articles/${slug}` should be in sitemap. */
export function articleHasLocalizedBody(slug: string, lang: Lang): boolean {
  if (lang === 'en') return true
  return articlesByLang[lang]?.has(slug) ?? false
}

// Glossary localization gate.
const glossaryByLang: Partial<Record<Lang, Set<string>>> = {}
for (const lang of SUPPORTED_LANGS) {
  if (lang === 'en') continue
  try {
    const file = JSON.parse(readFileSync(join(localesDir, lang, 'glossary.json'), 'utf-8')) as BodiesFile
    glossaryByLang[lang] = new Set(Object.keys(file.bodies ?? {}))
  } catch {
    glossaryByLang[lang] = new Set()
  }
}
/** Returns true if the localized URL `/${lang}/glossary/${slug}` should be in sitemap. */
export function glossaryHasLocalizedBody(slug: string, lang: Lang): boolean {
  if (lang === 'en') return true
  return glossaryByLang[lang]?.has(slug) ?? false
}

const allRoutes = getPrerenderRoutes()
const routes = allRoutes.filter(r => {
  // Part routes: gate by part.json translation table.
  if (LOCALIZED_PART_ROUTE_SET.has(r)) {
    const info = parsePartRoute(r)
    if (!info) return false
    return partTranslated[info.slug]?.includes(info.lang)
  }
  // Localized article URLs (defensive — EN-only today, but guard for future).
  const am = r.match(/^\/(es|ru|uk|zh)\/articles\/([^/]+)$/)
  if (am) return articleHasLocalizedBody(am[2], am[1] as Lang)
  // Localized glossary URLs (defensive).
  const gm = r.match(/^\/(es|ru|uk|zh)\/glossary\/([^/]+)$/)
  if (gm) return glossaryHasLocalizedBody(gm[2], gm[1] as Lang)
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

/** Pre-build hreflang alternates for each topic. */
const altsByTopic: Record<string, string> = {}
for (const slug of TOPIC_SLUGS) {
  const tags = SUPPORTED_LANGS.map(l => {
    const href = `${SITE_URL}${topicPathFor(slug, l)}`
    return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`
  })
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${topicPathFor(slug, 'en')}"/>`)
  altsByTopic[slug] = tags.join('\n')
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
  const changefreq = path === '/' ? 'weekly' : 'monthly'
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
  } else if (LOCALIZED_TOPIC_ROUTE_SET.has(path)) {
    const info = parseTopicRoute(path)
    if (info) alternates = `\n${altsByTopic[info.slug] ?? ''}`
  }
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alternates}
  </url>`
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`

mkdirSync(distDir, { recursive: true })
writeFileSync(join(distDir, 'sitemap.xml'), sitemap)
console.log('[sitemap] Generated sitemap.xml with', routes.length, 'URLs')
