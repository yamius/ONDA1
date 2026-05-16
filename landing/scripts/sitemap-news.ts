/**
 * Generates dist/sitemap-news.xml — Google News sitemap extension.
 *
 * Google crawls news sitemaps significantly more often than regular
 * sitemap.xml (typical re-crawl: 10–60 minutes vs hours-to-days). The
 * format is open to any site, not just news publishers; the only hard
 * requirement is that listed URLs were published or substantially
 * updated within the last 48 hours.
 *
 * Scope: articles (date from git history) plus /reviews and
 * /reviews/compare pages (date from each review's dateModified /
 * datePublished). Reviews are the most time-sensitive content on the
 * site — prices drift, products get superseded — so a fast re-crawl
 * signal matters most there.
 *
 * Safety net: an empty <urlset> is invalid per GSC's news-sitemap schema
 * (it reports "missing XML tag" on the urlset). When nothing falls inside
 * the 48h window we fall back to the N most-recently-modified URLs so the
 * file is always valid — Google silently ignores entries older than 48h,
 * so a stale fallback entry costs nothing but keeps the sitemap parseable.
 *
 * Submit /sitemap-news.xml in Google Search Console as a separate sitemap
 * entry alongside the regular /sitemap.xml.
 *
 * Run order: prerender.ts -> sitemap.ts -> sitemap-news.ts -> feed.ts ...
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { ARTICLE_DATES } from '../src/data/article-dates.generated'
import { reviews, comparisons } from '../src/data/reviews'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'

// Google requires items to be within the last 2 days (48h). Anything older
// is silently dropped from the index, so trimming locally keeps the file
// small and keeps Googlebot's per-fetch crawl signal high.
const FRESHNESS_WINDOW_MS = 48 * 60 * 60 * 1000
// When the 48h window is empty, list this many most-recent URLs so the file
// stays a valid (non-empty) urlset.
const FALLBACK_COUNT = 10
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

interface NewsEntry {
  url: string
  title: string
  /** ISO timestamp used both for the freshness filter and news:publication_date. */
  iso: string
  ms: number
}

const candidates: NewsEntry[] = []

// --- Articles: dates come from git history (first commit = published,
// last commit = modified). ---
for (const a of articles) {
  const dates = ARTICLE_DATES[a.slug]
  if (!dates) continue
  const candidateIso = dates.modified || dates.published
  const ms = new Date(candidateIso).getTime()
  if (Number.isNaN(ms)) continue
  candidates.push({
    url: `${SITE_URL}/articles/${a.slug}`,
    title: a.title,
    iso: new Date(ms).toISOString(),
    ms,
  })
}

// --- Reviews: dateModified rolls forward whenever a price or verdict is
// refreshed, so reviews naturally re-enter the freshness window on edit. ---
for (const r of reviews) {
  const candidateIso = r.dateModified || r.datePublished
  const ms = new Date(candidateIso).getTime()
  if (Number.isNaN(ms)) continue
  candidates.push({
    url: `${SITE_URL}/reviews/${r.slug}`,
    title: r.name,
    iso: new Date(ms).toISOString(),
    ms,
  })
}

// --- Comparison round-ups (/reviews/compare/<slug>). ---
for (const c of comparisons) {
  const candidateIso = c.dateModified || c.datePublished
  const ms = new Date(candidateIso).getTime()
  if (Number.isNaN(ms)) continue
  candidates.push({
    url: `${SITE_URL}/reviews/compare/${c.slug}`,
    title: c.title,
    iso: new Date(ms).toISOString(),
    ms,
  })
}

// Newest first.
candidates.sort((a, b) => b.ms - a.ms)

// Primary selection: everything inside the 48h window. Fallback: the N
// most-recent URLs overall, so the urlset is never empty (GSC rejects an
// empty news sitemap as "missing XML tag").
let selected = candidates.filter((c) => NOW - c.ms <= FRESHNESS_WINDOW_MS)
const usedFallback = selected.length === 0
if (usedFallback) selected = candidates.slice(0, FALLBACK_COUNT)

const urls = selected
  .map(
    (f) => `  <url>
    <loc>${escapeXml(f.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>ONDA Life</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${f.iso}</news:publication_date>
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
console.log(
  `[sitemap-news] Generated sitemap-news.xml with ${selected.length} URL(s)` +
    (usedFallback
      ? ` (fallback: 48h window empty, listed ${selected.length} most-recent)`
      : ` in the 48h freshness window`),
)
