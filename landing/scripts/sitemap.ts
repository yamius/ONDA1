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
import { getPrerenderRoutes, LOCALIZED_ROUTE_SET, LOCALIZED_BASE_PATHS } from './prerender-routes'
import { SUPPORTED_LANGS, stripLangPrefix, localizedPathFor } from '../src/i18n'

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

const routes = getPrerenderRoutes()

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

const urls = routes.map((path) => {
  const loc = buildLoc(path)
  const lastmod = getLastmod(path)
  const priority = getPriority(path)
  const changefreq = path === '/' ? 'weekly' : 'monthly'
  let alternates = ''
  if (LOCALIZED_ROUTE_SET.has(path)) {
    const base = stripLangPrefix(path)
    alternates = `\n${altsByBase[base] ?? ''}`
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
