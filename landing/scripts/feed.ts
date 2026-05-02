/**
 * Generates dist/feed.xml (RSS 2.0) and dist/atom.xml (Atom 1.0) from the
 * articles registry. Both standards are emitted because aggregators are
 * picky: Bing News and most news readers prefer RSS, while modern PWA-style
 * aggregators (Inoreader, NetNewsWire) prefer Atom.
 *
 * Article ordering: source order in src/data/articles/index.ts is treated as
 * reverse-chronological — newest first. This matches the convention used in
 * the articles index page and keeps the feed stable across builds.
 *
 * Run order: prerender.ts -> sitemap.ts -> feed.ts -> llms-txt.ts -> indexnow.ts
 */
import { writeFileSync, mkdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'
const FEED_TITLE = 'ONDA Life — Biohacking & Consciousness Engineering'
const FEED_DESC =
  'Long-form articles on HRV training, vagal tone, neuroplasticity, circadian alignment, metabolic flexibility and consciousness firmware. New protocols and deep-dives, treating the body as a biocomputer.'
const FEED_LANG = 'en-US'
const MAX_ITEMS = 50
const buildDate = new Date()

/** XML-safe escape for text nodes and attributes. */
function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Best-effort published date for an article. We don't track publish dates in
 * the TS registry, so we fall back to the mtime of the source .ts file when
 * it exists (stable across deploys, sortable, reflects real edits), and to
 * the build date otherwise.
 */
function articleDate(slug: string): Date {
  const candidates = [
    join(__dirname, '..', 'src', 'data', 'articles', `${slug}.ts`),
  ]
  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        return statSync(p).mtime
      } catch {
        /* fall through */
      }
    }
  }
  return buildDate
}

/** RFC-822 date for RSS 2.0. */
function rfc822(d: Date): string {
  return d.toUTCString()
}

/** ISO-8601 for Atom. */
function iso(d: Date): string {
  return d.toISOString()
}

const items = articles.slice(0, MAX_ITEMS).map((a) => ({
  slug: a.slug,
  title: a.title,
  description: a.description,
  category: a.category,
  url: `${SITE_URL}/articles/${a.slug}`,
  date: articleDate(a.slug),
  imageUrl: a.image ? `${SITE_URL}${a.image}` : undefined,
  imageAlt: a.imageAlt,
}))

// --- RSS 2.0 ---
const rssItems = items
  .map((it) => {
    const enclosure = it.imageUrl
      ? `      <enclosure url="${xml(it.imageUrl)}" type="image/webp" />`
      : ''
    return `    <item>
      <title>${xml(it.title)}</title>
      <link>${xml(it.url)}</link>
      <guid isPermaLink="true">${xml(it.url)}</guid>
      <description>${xml(it.description)}</description>
      <category>${xml(it.category)}</category>
      <pubDate>${rfc822(it.date)}</pubDate>
${enclosure}
    </item>`
  })
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${xml(FEED_DESC)}</description>
    <language>${FEED_LANG}</language>
    <lastBuildDate>${rfc822(buildDate)}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`

// --- Atom 1.0 ---
const atomEntries = items
  .map((it) => {
    const summary = `<summary>${xml(it.description)}</summary>`
    return `  <entry>
    <title>${xml(it.title)}</title>
    <link href="${xml(it.url)}" />
    <id>${xml(it.url)}</id>
    <updated>${iso(it.date)}</updated>
    <published>${iso(it.date)}</published>
    <category term="${xml(it.category)}" />
    ${summary}
  </entry>`
  })
  .join('\n')

const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${FEED_LANG}">
  <title>${xml(FEED_TITLE)}</title>
  <subtitle>${xml(FEED_DESC)}</subtitle>
  <id>${SITE_URL}/</id>
  <link href="${SITE_URL}/" />
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml" />
  <updated>${iso(buildDate)}</updated>
  <author>
    <name>ONDA Life</name>
    <uri>${SITE_URL}</uri>
  </author>
${atomEntries}
</feed>
`

mkdirSync(distDir, { recursive: true })
writeFileSync(join(distDir, 'feed.xml'), rss)
writeFileSync(join(distDir, 'atom.xml'), atom)

console.log(
  `[feed] Generated feed.xml (${(rss.length / 1024).toFixed(1)} KB) and atom.xml (${(atom.length / 1024).toFixed(1)} KB) — ${items.length} items`,
)
