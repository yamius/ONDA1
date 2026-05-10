/**
 * Generates dist/sitemap-news.xml — Google News sitemap extension.
 *
 * Google crawls news sitemaps significantly more often than regular
 * sitemap.xml (typical re-crawl: 10–60 minutes vs hours-to-days). The
 * format is open to any site, not just news publishers; the only hard
 * requirement is that listed URLs were published or substantially
 * updated within the last 48 hours.
 *
 * We list articles whose article-dates.generated `modified` (or `published`
 * when modified is missing) is inside the 48h window. ARTICLE_DATES is
 * derived from git history — first commit = published, last commit =
 * modified — so any article edit naturally rolls forward into the window
 * on the next build.
 *
 * Submit /sitemap-news.xml in Google Search Console as a separate sitemap
 * entry alongside the regular /sitemap.xml. GSC tracks them independently
 * and surfaces News-specific impressions / clicks reports.
 *
 * Run order: prerender.ts -> sitemap.ts -> sitemap-news.ts -> feed.ts ...
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { ARTICLE_DATES } from '../src/data/article-dates.generated'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'

// Google requires items to be within the last 2 days (48h). Anything older
// is silently dropped from the index, so trimming locally keeps the file
// small and keeps Googlebot's per-fetch crawl signal high.
const FRESHNESS_WINDOW_MS = 48 * 60 * 60 * 1000
const NOW = Date.now()

/** Minimal XML escaper — order matters: ampersand first. */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface FreshArticle {
  slug: string
  title: string
  publicationDate: string
}

const fresh: FreshArticle[] = []
for (const a of articles) {
  const dates = ARTICLE_DATES[a.slug]
  if (!dates) continue
  // Use whichever date is newer — Google interprets publication_date as
  // "when this URL became newsworthy", which for our purposes is the most
  // recent material change.
  const candidateIso = dates.modified || dates.published
  const candidateMs = new Date(candidateIso).getTime()
  if (Number.isNaN(candidateMs)) continue
  if (NOW - candidateMs > FRESHNESS_WINDOW_MS) continue
  fresh.push({
    slug: a.slug,
    title: a.title,
    publicationDate: new Date(candidateMs).toISOString(),
  })
}

// Newest first — not strictly required by Google but helpful for human
// inspection of the file.
fresh.sort((a, b) => (a.publicationDate < b.publicationDate ? 1 : -1))

const urls = fresh
  .map(
    (f) => `  <url>
    <loc>${SITE_URL}/articles/${f.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>ONDA Life</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${f.publicationDate}</news:publication_date>
      <news:title>${escapeXml(f.title)}</news:title>
    </news:news>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`

writeFileSync(join(distDir, 'sitemap-news.xml'), sitemap)
console.log(`[sitemap-news] Generated sitemap-news.xml with ${fresh.length} article(s) in the 48h freshness window`)
