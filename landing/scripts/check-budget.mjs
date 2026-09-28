/**
 * Build-time guard (runs after `vite build`, before prerender). Keeps the
 * browser payload flat as the site grows to thousands of articles/reviews:
 *
 *  1. ENTRY    — the eager entry chunk stays under ENTRY_BUDGET_KB gzip.
 *  2. LEAKS    — no browser JS chunk may contain full content bodies. Bodies ship
 *                one entry at a time from /_content (scripts/generate-article-chunks.ts);
 *                src/generated/content-sentinels.json holds plain-text snippets from
 *                inside real bodies of every collection. Finding one in a chunk means
 *                a full registry (src/data/articles, data/reviews, data/glossary, or a
 *                full locale articles.json) got imported into browser code again.
 *  3. CATALOGS — the light catalogs/indexes that DO ship grow with the number of
 *                entries; each has a cap so growth is a conscious decision
 *                (paginate or trim fields before raising it).
 *  4. CHUNKS   — no single JS chunk over CHUNK_BUDGET_KB gzip.
 *  5. ENTRIES  — no single /_content file over ENTRY_FILE_BUDGET_KB (one article/review).
 *
 * Raise a number only deliberately — the message says what to do instead.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { gzipSync } from 'zlib'
import { join } from 'path'

const DIST = 'dist'
const ASSETS = join(DIST, 'assets')
const ENTRY_BUDGET_KB = 150
const CHUNK_BUDGET_KB = 300
const ENTRY_FILE_BUDGET_KB = 150
/** Light catalogs, matched by chunk-name prefix (Vite names chunks after their module). */
const CATALOG_BUDGETS_KB = [
  { prefix: 'article-catalog-', kb: 80, what: 'EN article catalog (src/generated/article-catalog.ts)' },
  { prefix: 'review-content-', kb: 150, what: 'review/comparison/head-to-head catalog (src/generated/review-catalog.ts)' },
  { prefix: 'glossary-index-', kb: 60, what: 'glossary index (src/generated/glossary-index.ts)' },
  { prefix: 'articles-', kb: 100, what: 'a light locale articles namespace (src/generated/i18n/<lang>/articles.json)' },
  { prefix: 'reviews-', kb: 100, what: 'a light locale reviews namespace (src/generated/i18n/<lang>/reviews.json)' },
  { prefix: 'glossary-', kb: 100, what: 'a light locale glossary namespace (src/generated/i18n/<lang>/glossary.json)' },
]

const errors = []
const warn = []
const gzKb = (buf) => gzipSync(buf).length / 1024

// 1. Entry
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')
const match = indexHtml.match(/src="(\/assets\/index-[^"]+\.js)"/)
if (!match) {
  console.error('[budget] FAIL — could not locate the entry chunk in dist/index.html')
  process.exit(1)
}
const entryKb = gzKb(readFileSync(join(DIST, match[1])))
console.log(`[budget] entry chunk ${match[1]} — ${entryKb.toFixed(1)} KB gzip (budget ${ENTRY_BUDGET_KB} KB)`)
if (entryKb > ENTRY_BUDGET_KB) {
  errors.push(
    `entry chunk is ${entryKb.toFixed(1)} KB gzip, over ${ENTRY_BUDGET_KB} KB — a heavy module is statically imported into the eager path; lazy-load it.`,
  )
}

// 2–4. Every JS chunk
const sentinelsPath = join('src', 'generated', 'content-sentinels.json')
const sentinels = existsSync(sentinelsPath) ? JSON.parse(readFileSync(sentinelsPath, 'utf-8')) : []
if (!sentinels.length) errors.push('no content sentinels found — run scripts/generate-article-chunks.ts before the budget check.')
let biggest = { name: '', kb: 0 }
for (const name of readdirSync(ASSETS).filter((f) => f.endsWith('.js'))) {
  const buf = readFileSync(join(ASSETS, name))
  const text = buf.toString('utf-8')
  for (const s of sentinels) {
    if (text.includes(s.text)) {
      errors.push(
        `assets/${name} contains full ${s.collection} bodies ("${s.text}…"). Browser code must read content through ` +
          `src/lib/{article,review,glossary}-content.ts, not import src/data/articles, data/reviews, data/glossary or a full locale file.`,
      )
      break
    }
  }
  const kb = gzKb(buf)
  if (kb > biggest.kb) biggest = { name, kb }
  if (kb > CHUNK_BUDGET_KB) errors.push(`assets/${name} is ${kb.toFixed(0)} KB gzip, over the ${CHUNK_BUDGET_KB} KB per-chunk budget — split or lazy-load it.`)
  const cat = CATALOG_BUDGETS_KB.find((c) => name.startsWith(c.prefix))
  if (cat) {
    if (kb > cat.kb) {
      errors.push(
        `assets/${name} (${cat.what}) is ${kb.toFixed(0)} KB gzip, over its ${cat.kb} KB cap — trim catalog fields or paginate lists before raising the cap.`,
      )
    } else if (kb > cat.kb * 0.8) {
      warn.push(`assets/${name} (${cat.what}) at ${kb.toFixed(0)}/${cat.kb} KB gzip — nearing its cap.`)
    }
  }
}
console.log(`[budget] largest chunk assets/${biggest.name} — ${biggest.kb.toFixed(1)} KB gzip (budget ${CHUNK_BUDGET_KB} KB)`)

// 5. One-entry content files
let entries = 0
let largest = { path: '', kb: 0 }
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (f.endsWith('.json')) {
      entries++
      const kb = statSync(p).size / 1024
      if (kb > largest.kb) largest = { path: p, kb }
      if (kb > ENTRY_FILE_BUDGET_KB) errors.push(`${p} is ${kb.toFixed(0)} KB — a single entry this large should be split into parts.`)
    }
  }
}
if (existsSync(join(DIST, '_content'))) walk(join(DIST, '_content'))
else errors.push('dist/_content is missing — per-entry bodies were not generated.')
console.log(`[budget] ${entries} per-entry content files, largest ${largest.path} — ${largest.kb.toFixed(0)} KB (budget ${ENTRY_FILE_BUDGET_KB} KB)`)
console.log(`[budget] leak check: ${sentinels.length} content sentinels scanned`)

for (const w of warn) console.warn(`[budget] WARN — ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`[budget] FAIL — ${e}`)
  process.exit(1)
}
console.log('[budget] OK')
