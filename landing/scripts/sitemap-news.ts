/**
 * Google News sitemap. Lists articles published in the last 48 hours.
 *
 * Even when the site isn't formally enrolled in Google News, having a
 * News sitemap is a positive freshness signal for general indexing. The
 * file is referenced from the main sitemap and from /robots.txt.
 *
 * Run after sitemap.ts so dates and URLs match.
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { ARTICLE_DATES } from '../src/data/article-dates.generated'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'
const PUBLICATION_NAME = 'ONDA Life'
const PUBLICATION_LANG = 'en'

const HORIZON_HOURS = Number(process.env.SITEMAP_NEWS_HOURS ?? 48)
const horizonMs = HORIZON_HOURS * 60 * 60 * 1000
const cutoff = Date.now() - horizonMs

interface DateEntry { publishedAt?: string; modifiedAt?: string }
const dates = ARTICLE_DATES as Record<string, DateEntry>

function fresh(slug: string): { iso: string; date: Date } | null {
  const d = dates[slug]?.publishedAt ?? dates[slug]?.modifiedAt
  if (!d) return null
  const parsed = new Date(d)
  if (Number.isNaN(parsed.getTime())) return null
  if (parsed.getTime() < cutoff) return null
  return { iso: parsed.toISOString(), date: parsed }
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

const fresh48 = articles
  .map((a) => ({ a, ts: fresh(a.slug) }))
  .filter((x): x is { a: typeof articles[number]; ts: { iso: string; date: Date } } => !!x.ts)
  .sort((a, b) => b.ts.date.getTime() - a.ts.date.getTime())

const items = fresh48.map(({ a, ts }) => `  <url>
    <loc>${SITE_URL}/articles/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANG}</news:language>
      </news:publication>
      <news:publication_date>${ts.iso}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items.join('\n')}
</urlset>
`

writeFileSync(join(distDir, 'sitemap-news.xml'), xml)
console.log(`[sitemap-news] wrote sitemap-news.xml (${fresh48.length} articles in last ${HORIZON_HOURS}h)`)
