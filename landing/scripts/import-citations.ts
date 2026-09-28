/**
 * Merge verified source lookups into src/data/article-citations.ts.
 *
 *   npx tsx scripts/import-citations.ts <dir>
 *
 * <dir>/<slug>.json = { slug, sources: [{ cited_as, title, authors, year, journal, doi, pmid, url, status }] }
 * Only status "verified" with a DOI or PMID is imported; duplicates (same DOI) collapse.
 * Existing entries for other slugs are kept; an imported slug is replaced.
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ARTICLE_CITATIONS, type StudyCitation } from '../src/data/article-citations'
import { articles } from '../src/data/articles'

const dir = process.argv[2]
if (!dir) {
  console.error('usage: import-citations.ts <dir>')
  process.exit(1)
}
const known = new Set(articles.map((a) => a.slug))
const merged: Record<string, StudyCitation[]> = { ...ARTICLE_CITATIONS }
let verified = 0
let skipped = 0
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const d = JSON.parse(readFileSync(join(dir, f), 'utf-8')) as { slug: string; sources: Record<string, unknown>[] }
  if (!known.has(d.slug)) {
    console.warn(`[citations] unknown slug ${d.slug} — skipped`)
    continue
  }
  const seen = new Set<string>()
  const list: StudyCitation[] = []
  for (const s of d.sources ?? []) {
    const doi = typeof s.doi === 'string' && /^10\.\d{4,9}\/\S+$/.test(s.doi) ? s.doi : undefined
    const pmid = typeof s.pmid === 'string' && /^\d{5,9}$/.test(s.pmid) ? s.pmid : undefined
    if (s.status !== 'verified' || (!doi && !pmid) || !s.title || !s.authors || !s.year) {
      skipped++
      continue
    }
    const key = doi ?? `pmid:${pmid}`
    if (seen.has(key)) continue
    seen.add(key)
    list.push({
      title: String(s.title).replace(/\s+/g, ' ').trim(),
      authors: String(s.authors).trim(),
      year: Number(s.year),
      ...(s.journal ? { journal: String(s.journal).trim() } : {}),
      ...(doi ? { doi } : {}),
      ...(pmid ? { pmid } : {}),
      url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    })
  }
  if (list.length) merged[d.slug] = list
  verified += list.length
}

const file = join('src', 'data', 'article-citations.ts')
const src = readFileSync(file, 'utf-8')
const head = src.slice(0, src.indexOf('export const ARTICLE_CITATIONS'))
const body = Object.keys(merged)
  .sort()
  .map((slug) => `  ${JSON.stringify(slug)}: ${JSON.stringify(merged[slug], null, 2).replace(/\n/g, '\n  ')},`)
  .join('\n')
writeFileSync(file, `${head}export const ARTICLE_CITATIONS: Record<string, StudyCitation[]> = {\n${body}\n}\n`)
console.log(`[citations] ${verified} verified sources imported for ${Object.keys(merged).length} articles; ${skipped} unverified skipped`)
