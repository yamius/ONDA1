#!/usr/bin/env node
/**
 * Stage 5 — High-trust outbound citation audit.
 *
 * Scans every article body for sentences that signal a claim about
 * research without providing a source link, and emits a prioritized
 * report to dist/seo-audit/research-citation-gaps.{json,md}.
 *
 * Patterns flagged:
 *   - "research shows / suggests / indicates / demonstrates"
 *   - "studies show / suggest / indicate"
 *   - "clinical data / clinical trials / clinical evidence"
 *   - "scientists found / researchers found"
 *   - "evidence shows / evidence suggests"
 *   - "meta-analysis"
 *   - "according to a study"
 *
 * A flag is suppressed when the same sentence already contains a
 * footnote-style reference, an inline link, a DOI, a PubMed ID, a
 * doi.org URL, or a journal-style citation pattern (e.g. "(Smith et
 * al., 2020)").
 *
 * Non-fatal: produces a report and a count. CI gates on coverage via
 * SEO_STRICT=1 (matching the other validators).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const articlesDir = join(projectRoot, 'src', 'data', 'articles')
const auditDir = join(projectRoot, 'dist', 'seo-audit')

const PATTERNS = [
  /\b(research|studies?|evidence)\s+(shows?|suggests?|indicates?|demonstrates?|finds?|prove[sd]?)\b/i,
  /\bclinical\s+(data|trials?|evidence|studies)\b/i,
  /\b(scientists?|researchers?)\s+(found|discovered|showed|report(ed)?|demonstrated)\b/i,
  /\b(meta[-\s]?analysis|systematic\s+review|peer[-\s]?reviewed)\b/i,
  /\baccording\s+to\s+(a|the)\s+stud(y|ies)\b/i,
  /\bstud(y|ies)\s+(in|published\s+in)\b/i,
]

const HAS_CITATION = [
  /https?:\/\//,
  /\[\^[^\]]+\]/, // markdown footnote refs like [^1]
  /\bdoi\.org\b/i,
  /\bpubmed\b/i,
  /\bPMID:?\s*\d+/i,
  /\bDOI:?\s*10\./i,
  /\([A-Z][A-Za-z\s,&.-]+(?:et\s+al\.)?,\s*(19|20)\d{2}\)/, // (Smith et al., 2020)
]

function loadArticleSources() {
  // Read each article .ts as a string and extract slug + content.
  // (Importing the bundled module would lose source positions; the
  // string scan is sufficient for line numbers and is much faster.)
  const out = []
  for (const f of readdirSync(articlesDir)) {
    if (!f.endsWith('.ts')) continue
    if (f === 'types.ts' || f === 'index.ts' || f.endsWith('.generated.ts')) continue
    const path = join(articlesDir, f)
    const src = readFileSync(path, 'utf-8')
    const slugMatch = src.match(/slug:\s*['"]([^'"]+)['"]/)
    const titleMatch = src.match(/title:\s*['"]([^'"]+)['"]/)
    const slug = slugMatch ? slugMatch[1] : f.replace(/\.ts$/, '')
    const title = titleMatch ? titleMatch[1] : slug
    out.push({ file: f, path, slug, title, src })
  }
  return out
}

function splitSentences(text) {
  // Strip code fences, then split on sentence boundaries.
  const noCode = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]+`/g, ' ')
  return noCode
    .split(/(?<=[.!?])\s+(?=[A-Z(])|\n{2,}/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

const articles = loadArticleSources()
const violations = []
let totalClaims = 0
let totalCovered = 0

for (const a of articles) {
  // Extract markdown body from `content: \`...\`` template literal.
  const cm = a.src.match(/content:\s*`([\s\S]*?)`,\s*\n/)
  if (!cm) continue
  const body = cm[1]
  const sentences = splitSentences(body)

  for (const s of sentences) {
    let matched = false
    for (const re of PATTERNS) {
      if (re.test(s)) {
        matched = true
        break
      }
    }
    if (!matched) continue
    totalClaims++
    let cited = false
    for (const re of HAS_CITATION) {
      if (re.test(s)) {
        cited = true
        break
      }
    }
    if (cited) {
      totalCovered++
      continue
    }
    violations.push({
      slug: a.slug,
      title: a.title,
      file: `src/data/articles/${a.file}`,
      sentence: s.length > 220 ? s.slice(0, 220) + '…' : s,
    })
  }
}

mkdirSync(auditDir, { recursive: true })
const summary = {
  generatedAt: new Date().toISOString(),
  articlesScanned: articles.length,
  totalClaims,
  totalCovered,
  totalGaps: violations.length,
  coverage:
    totalClaims > 0 ? Number(((totalCovered / totalClaims) * 100).toFixed(1)) : 100,
  violations,
}
writeFileSync(join(auditDir, 'research-citation-gaps.json'), JSON.stringify(summary, null, 2))

const md = [
  '# Research-citation gap report',
  '',
  `Generated: ${summary.generatedAt}`,
  `Articles scanned: ${summary.articlesScanned}`,
  `Research-style claims: ${summary.totalClaims}`,
  `With at least one citation marker: ${summary.totalCovered}`,
  `Coverage: **${summary.coverage}%**`,
  `Open gaps: **${summary.totalGaps}**`,
  '',
  '## Gaps by article',
  '',
]
const byArticle = new Map()
for (const v of violations) {
  if (!byArticle.has(v.slug)) byArticle.set(v.slug, [])
  byArticle.get(v.slug).push(v)
}
for (const [slug, list] of [...byArticle.entries()].sort((a, b) => b[1].length - a[1].length)) {
  md.push(`### ${list[0].title} (${slug}) — ${list.length} gap(s)`)
  md.push('')
  for (const v of list.slice(0, 5)) md.push(`- ${v.sentence}`)
  if (list.length > 5) md.push(`- … and ${list.length - 5} more`)
  md.push('')
}
writeFileSync(join(auditDir, 'research-citation-gaps.md'), md.join('\n'))

console.log(
  `[research-citation-audit] ${articles.length} articles, ${totalClaims} claims, ${totalCovered} cited (${summary.coverage}%), ${violations.length} gap(s)`,
)
if (process.env.SEO_STRICT === '1' && violations.length > 0) {
  process.exit(1)
}
