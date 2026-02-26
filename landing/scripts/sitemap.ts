/**
 * Generates sitemap.xml with all prerendered routes.
 * Run after: npm run build (prerender)
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPrerenderRoutes } from '../src/config/routes'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://ondalife.replit.app'

const routes = getPrerenderRoutes()

const urls = routes.map((path) => {
  const loc = `${SITE_URL}${path === '/' ? '' : path}`
  const priority = path === '/' ? '1.0' : path.split('/').length <= 2 ? '0.9' : '0.8'
  const changefreq = path === '/' ? 'weekly' : 'monthly'
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

writeFileSync(join(distDir, 'sitemap.xml'), sitemap)
console.log('[sitemap] Generated sitemap.xml with', routes.length, 'URLs')
