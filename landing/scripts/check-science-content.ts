/**
 * Gate for the science-content branch (Mistral-authored pages).
 *
 *   npx tsx scripts/check-science-content.ts            # all files in content/science/
 *   npx tsx scripts/check-science-content.ts --diff     # also: only allowed files changed vs origin/main
 *   npx tsx scripts/check-science-content.ts --offline  # skip Crossref/PubMed lookups
 *
 * Checks every content/science/<kind>/<slug>.md:
 *  1. frontmatter: required fields, kind, slug = file name, lengths, reviewer only if set
 *  2. sources: each has a DOI or PMID, and it exists (Crossref / NCBI); ids S1… unique
 *  3. evidenceMap: each row cites existing sources; every [Sx] used in the body is listed
 *  4. numbers: no digits in the body outside {{fact:…}}, [Sx] markers, headings’ allowed years
 *     and citations “(Author 2021)”; every fact id exists and is approved
 *  5. banned wording from spec 002 §6–7
 *  6. related links point to pages that exist
 *  7. (--diff) the branch touches only allowed paths
 * Exit code 1 on any error.
 */
import { execSync } from 'node:child_process'
import matter from 'gray-matter'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative, basename, dirname } from 'node:path'
import { FACTS } from '../src/data/science/facts'
import { articles } from '../src/data/articles'
import { glossaryTerms } from '../src/data/glossary'

const ROOT = join(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const DIR = join(ROOT, 'content', 'science')
const KINDS = ['concepts', 'measurements', 'mechanisms', 'evidence']
const SOURCE_TYPES = ['systematic-review', 'meta-analysis', 'randomized-trial', 'observational', 'review', 'guideline', 'other']
const CLASSES = ['established', 'context-dependent', 'emerging', 'debated', 'unknown']
const OFFLINE = process.argv.includes('--offline')
const DIFF = process.argv.includes('--diff')

/** Paths the science-content branch may change (repo-relative, forward slashes). */
export const ALLOWED = [/^landing\/content\/science\/(concepts|measurements|mechanisms|evidence)\/[a-z0-9-]+\.md$/]

/** Spec 002 §6–7 + audit §4: wording that must not appear. */
const BANNED: [RegExp, string][] = [
  [/\bmeasures? vagal tone\b/i, 'HRV does not measure vagal tone directly — use {{fact:claim.vagalTone}}'],
  [/\b(trains?|training|increases?|boosts?) (your )?vagal tone\b/i, 'vagal tone cannot be measured or “trained” directly'],
  [/\b(stimulates?|activates?) (the )?vagus\b/i, 'use {{fact:claim.slowExhale}} instead of “stimulates the vagus”'],
  [/LF\s*\/\s*HF\b[^.]{0,60}\b(balance|sympathetic)/i, 'LF/HF is not sympathovagal balance'],
  [/\bhigher HRV is always better\b/i, 'not always true'],
  [/\blow HRV means (you are |you’re )?stress/i, 'use {{fact:claim.hrvNotStress}}'],
  [/\breset (your )?nervous system\b/i, 'banned phrase'],
  [/\bhack (your )?biology\b/i, 'banned phrase'],
  [/\b(cure|cures|curing|treats? (anxiety|depression|insomnia))\b/i, 'no treatment/cure claims'],
  [/\bclinically proven\b/i, 'no “clinically proven”'],
  [/\bRecovery HRV\b[^.]{0,40}\bRMSSD\b|\bRMSSD\b[^.]{0,40}\bRecovery HRV\b/i, 'Apple does not officially state Recovery HRV = RMSSD (owner rule 2026-10-04)'],
]

const errors: string[] = []
const err = (file: string, msg: string) => errors.push(`${file}: ${msg}`)

function parseFrontmatter(src: string): { data: any; body: string } {
  if (!src.startsWith('---')) throw new Error('missing --- frontmatter ---')
  const m = matter(src)
  return { data: m.data, body: m.content }
}

async function exists(src: { doi?: string; pmid?: string | number }): Promise<string | null> {
  if (OFFLINE) return null
  try {
    if (src.doi) {
      const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(src.doi)}`, { headers: { 'user-agent': 'onda-life science check (mailto:info@onda-life.com)' } })
      if (r.status === 404) return `DOI not found in Crossref: ${src.doi}`
      if (!r.ok) return null // network trouble ≠ fabricated source; re-run
    }
    if (src.pmid) {
      const r = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${src.pmid}`)
      const j: any = r.ok ? await r.json() : null
      if (j && (!j.result || !j.result[String(src.pmid)] || j.result[String(src.pmid)].error)) return `PMID not found in PubMed: ${src.pmid}`
    }
  } catch { return null }
  return null
}

function stripAllowed(body: string): string {
  return body
    .replace(/\{\{fact:[a-zA-Z0-9.\-]+\}\}/g, ' ')
    .replace(/\[S\d+(?:\s*,\s*S\d+)*\]/g, ' ')
    .replace(/\([A-Z][A-Za-z’'\- ]+(?: et al\.)?,? (19|20)\d{2}[a-z]?\)/g, ' ') // (Author 2021)
    .replace(/\b[A-Z][A-Za-z’'\-]+(?: et al\.)? \((19|20)\d{2}\)/g, ' ') // Author (2021)
    .replace(/\]\([^)]*\)/g, ']') // link targets
    .replace(/(aged?|at ages?|ages?) \d{2}(?:[–-]\d{2}|\+)/gi, ' ') // age bands are labels, not data
    .replace(/^#{1,6} .*$/gm, (h) => h.replace(/\b(19|20)\d{2}\b/g, ' '))
}

const routeExists = {
  glossary: new Set(glossaryTerms.map((t) => t.slug)),
  articles: new Set(articles.map((a) => a.slug)),
}

async function main() {
  if (DIFF) {
    let changed: string[] = []
    try {
      changed = execSync('git diff --name-only origin/main...HEAD', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean)
    } catch { err('git', 'could not diff against origin/main (fetch it first)') }
    for (const f of changed) if (!ALLOWED.some((re) => re.test(f))) err(f, 'file outside the allowed science-content paths')
  }

  if (!existsSync(DIR)) { console.log('[science] no content/science yet'); return }
  const files: string[] = []
  for (const k of readdirSync(DIR)) {
    const p = join(DIR, k)
    if (statSync(p).isDirectory()) for (const f of readdirSync(p)) if (f.endsWith('.md')) files.push(join(p, f))
  }
  const slugs = new Set(files.map((f) => `${basename(dirname(f))}/${basename(f, '.md')}`))

  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, '/')
    let fm: any, body: string
    try { ({ data: fm, body } = parseFrontmatter(readFileSync(file, 'utf8'))) } catch (e) { err(rel, (e as Error).message); continue }

    // 1. frontmatter
    const kind = basename(dirname(file)), slug = basename(file, '.md')
    if (!KINDS.includes(kind)) err(rel, `folder must be one of ${KINDS.join(', ')}`)
    if (fm.kind !== kind) err(rel, `kind "${fm.kind}" must equal folder "${kind}"`)
    if (fm.slug !== slug) err(rel, `slug "${fm.slug}" must equal file name "${slug}"`)
    if (!/^[a-z0-9-]+$/.test(slug)) err(rel, 'slug: lowercase letters, digits, hyphens')
    for (const k of ['title', 'metaTitle', 'metaDescription', 'shortAnswer', 'keyPoints', 'editor', 'sources', 'evidenceMap']) if (fm[k] == null) err(rel, `missing ${k}`)
    if (fm.title?.length > 70) err(rel, `title ${fm.title.length} > 70`)
    if (fm.metaTitle?.length > 52) err(rel, `metaTitle ${fm.metaTitle.length} > 52`)
    if (fm.metaDescription && (fm.metaDescription.length < 110 || fm.metaDescription.length > 155)) err(rel, `metaDescription ${fm.metaDescription.length} not in 110–155`)
    const words = String(fm.shortAnswer || '').trim().split(/\s+/).length
    if (words < 40 || words > 80) err(rel, `shortAnswer ${words} words, need 40–80`)
    if (!Array.isArray(fm.keyPoints) || fm.keyPoints.length < 3 || fm.keyPoints.length > 7) err(rel, 'keyPoints: 3–7 items')
    if (fm.editor !== 'Yakiv Bilenko') err(rel, 'editor must be "Yakiv Bilenko"')
    if (fm.reviewer != null && fm.reviewer !== 'Valentin Zhigulin') err(rel, 'reviewer must be null or "Valentin Zhigulin"')

    // 2. sources
    const ids = new Set<string>()
    for (const s of fm.sources || []) {
      if (!/^S\d+$/.test(s.id) || ids.has(s.id)) err(rel, `source id "${s.id}" must be unique S1, S2…`)
      ids.add(s.id)
      if (!s.doi && !s.pmid) err(rel, `${s.id}: DOI or PMID required`)
      if (!SOURCE_TYPES.includes(s.type)) err(rel, `${s.id}: type must be one of ${SOURCE_TYPES.join(', ')}`)
      const miss = await exists(s)
      if (miss) err(rel, `${s.id}: ${miss}`)
    }
    // 3. evidence map + inline citations
    for (const row of fm.evidenceMap || []) {
      if (!CLASSES.includes(row.class)) err(rel, `evidenceMap class "${row.class}" invalid`)
      for (const s of row.sources || []) if (!ids.has(s)) err(rel, `evidenceMap cites unknown ${s}`)
      if (!row.limitation) err(rel, `evidenceMap row “${String(row.claim).slice(0, 40)}…” needs a limitation`)
    }
    for (const m of body.matchAll(/\[(S\d+(?:\s*,\s*S\d+)*)\]/g)) for (const s of m[1].split(/\s*,\s*/)) if (!ids.has(s)) err(rel, `body cites unknown ${s}`)

    // 4. numbers & facts
    for (const m of body.matchAll(/\{\{fact:([a-zA-Z0-9.\-]+)\}\}/g)) {
      const f = FACTS[m[1]]
      if (!f) err(rel, `unknown fact ${m[1]}`)
      else if (f.status !== 'approved') err(rel, `fact ${m[1]} is not approved yet`)
    }
    const stray = [...stripAllowed(body).matchAll(/[^\n]{0,30}\d[^\n]{0,30}/g)].map((x) => x[0].trim())
    for (const s of stray) err(rel, `number outside {{fact:}}: “${s}”`)
    const fmText = [fm.title, fm.metaTitle, fm.metaDescription, fm.shortAnswer, ...(fm.keyPoints || [])].join(' ')
    if (/\d/.test(stripAllowed(fmText))) err(rel, 'numbers in title/meta/shortAnswer/keyPoints — use words or {{fact:}} in the body')

    // 5. banned wording
    const all = `${fmText}\n${body}`
    for (const [re, why] of BANNED) { const m = all.match(re); if (m) err(rel, `banned wording “${m[0]}” — ${why}`) }

    // 6. related links
    for (const g of fm.related?.glossary || []) if (!routeExists.glossary.has(g)) err(rel, `related.glossary "${g}" does not exist`)
    for (const a of fm.related?.articles || []) if (!routeExists.articles.has(a)) err(rel, `related.articles "${a}" does not exist`)
    for (const s of fm.related?.science || []) if (!slugs.has(s)) err(rel, `related.science "${s}" does not exist (use kind/slug)`)
    for (const m of body.matchAll(/\]\((\/[^)\s#]+)/g)) {
      const p = m[1].split('/').filter(Boolean)
      if (p[0] === 'articles' && p[1] && !routeExists.articles.has(p[1])) err(rel, `link to missing article ${m[1]}`)
      if (p[0] === 'glossary' && p[1] && !routeExists.glossary.has(p[1])) err(rel, `link to missing glossary term ${m[1]}`)
      if (p[0] === 'science' && p[2] && !slugs.has(`${p[1]}/${p[2]}`)) err(rel, `link to missing science page ${m[1]}`)
    }
  }

  if (errors.length) {
    console.error(`[science] ${errors.length} problem(s):\n  ` + errors.join('\n  '))
    return
  }
  console.log(`[science] OK — ${files.length} page(s) checked${OFFLINE ? ' (offline: sources not looked up)' : ''}`)
}

main().then(() => process.exit(errors.length ? 1 : 0))
