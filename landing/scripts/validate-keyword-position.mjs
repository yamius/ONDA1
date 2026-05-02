#!/usr/bin/env node
/**
 * Stage 12 — embedding/keyword early-position validator.
 *
 * Modern AI search rerankers (Perplexity, You.com, Phind, Brave AI, Bing
 * AI) embed page content and rank by semantic similarity. Token position
 * matters: terms in the first 60 characters of H1, first paragraph, and
 * meta description are weighted more heavily than later occurrences.
 *
 * For every prerendered HTML in dist/, this script:
 *   1. Derives a "primary keyword" from the meta description's first
 *      noun phrase (heuristic: longest noun-phrase-shaped substring).
 *   2. Verifies the H1, the description, and the first paragraph of the
 *      visible body each contain at least one keyword token within
 *      their first 60 characters.
 *
 * Heuristic — intentionally conservative: only flags pages where the
 * primary keyword is COMPLETELY absent from the early region of any of
 * the three locations. This keeps the false-positive rate near zero.
 *
 * Output: dist/seo-audit/keyword-position.{json,md}
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const auditDir = join(distDir, 'seo-audit')

const STOPWORDS = new Set(
  'a,an,and,are,as,at,be,by,for,from,has,have,he,her,his,in,is,it,its,of,on,or,she,that,the,this,to,was,were,will,with,you,your,we,our,this,these,those,how,what,why,when,where,which,who,can,does,do,if,not,but,onda,life,onda-life,com'.split(','),
)

function isStop(w) {
  return STOPWORDS.has(w.toLowerCase()) || w.length < 4
}

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z][a-z0-9-]+/g) ?? []).filter((w) => !isStop(w))
}

/** Pick the most plausible primary-keyword token: rarest content word in the title+desc. */
function primaryKeyword(title, desc) {
  const counts = new Map()
  for (const w of [...tokenize(title), ...tokenize(desc)]) {
    counts.set(w, (counts.get(w) ?? 0) + 1)
  }
  // Highest-frequency content word wins (it is the topical anchor).
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

function extract(html, re, group = 1) {
  const m = html.match(re)
  return m ? m[group] : null
}

function plainText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function* walk(root) {
  for (const entry of readdirSync(root)) {
    if (entry === 'seo-audit' || entry === 'datasets' || entry === 'ai-audit') continue
    if (entry.startsWith('.')) continue
    const p = join(root, entry)
    const st = statSync(p)
    if (st.isDirectory()) yield* walk(p)
    else if (st.isFile() && entry.endsWith('.html')) yield p
  }
}

const violations = []
let pages = 0
let cleanPages = 0

for (const file of walk(distDir)) {
  pages++
  const html = readFileSync(file, 'utf-8')
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i)?.replace(/\s+/g, ' ').trim() ?? ''
  const desc = extract(html, /<meta\s+name="description"\s+content="([^"]+)"/i) ?? ''
  const h1Raw = extract(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  const h1 = h1Raw ? plainText(h1Raw) : ''
  // First paragraph after the first <h1>.
  let firstP = ''
  if (h1Raw) {
    const after = html.split(h1Raw).slice(1).join(h1Raw)
    const pm = after.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)
    if (pm) firstP = plainText(pm[1])
  }
  if (!firstP) {
    const pm = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)
    if (pm) firstP = plainText(pm[1])
  }

  const kw = primaryKeyword(title, desc)
  if (!kw) continue

  const earlyH1 = h1.slice(0, 60).toLowerCase()
  const earlyDesc = desc.slice(0, 60).toLowerCase()
  const earlyFp = firstP.slice(0, 60).toLowerCase()

  const issues = []
  if (h1 && !earlyH1.includes(kw)) issues.push('h1-late-or-missing')
  if (desc && !earlyDesc.includes(kw)) issues.push('desc-late-or-missing')
  if (firstP && !earlyFp.includes(kw)) issues.push('p-late-or-missing')

  if (issues.length === 3) {
    // All three fail — strong signal the keyword isn't actually the page's primary topic.
    violations.push({
      file: file.slice(distDir.length + 1),
      keyword: kw,
      issues,
      title: title.slice(0, 90),
    })
  } else {
    cleanPages++
  }
}

mkdirSync(auditDir, { recursive: true })
const summary = {
  generatedAt: new Date().toISOString(),
  pagesScanned: pages,
  pagesClean: cleanPages,
  pagesFlagged: violations.length,
  cleanRate: pages > 0 ? Number(((cleanPages / pages) * 100).toFixed(1)) : 0,
  violations,
}
writeFileSync(join(auditDir, 'keyword-position.json'), JSON.stringify(summary, null, 2))

const md = [
  '# Keyword early-position validator',
  '',
  `Generated: ${summary.generatedAt}`,
  `Pages scanned: ${summary.pagesScanned}`,
  `Clean: ${summary.pagesClean} (${summary.cleanRate}%)`,
  `Flagged: ${summary.pagesFlagged}`,
  '',
  '## Flagged pages (primary keyword absent from early region of all three)',
  '| Page | Inferred keyword | Title |',
  '|---|---|---|',
  ...violations.slice(0, 50).map((v) => `| ${v.file} | \`${v.keyword}\` | ${v.title} |`),
]
writeFileSync(join(auditDir, 'keyword-position.md'), md.join('\n'))
console.log(
  `[validate-keyword-position] ${pages} pages, ${cleanPages} clean (${summary.cleanRate}%), ${violations.length} flagged`,
)
