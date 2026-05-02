#!/usr/bin/env node
/**
 * Stage 16 — brand entity reinforcement validator.
 *
 * Confirms that:
 *   1. Every Article + TechArticle JSON-LD payload references the same
 *      canonical Organization (`name: "ONDA Life"`, `url: SITE_URL`).
 *   2. Every prerendered article HTML contains at least one inline
 *      brand mention (ONDA system / ONDA framework / ONDA protocol /
 *      ONDA Life), OR ships the canonical brand-footer micro-bio in
 *      the rendered body.
 *
 * Variance in publisher.name or url across pages is the failure mode
 * Google + LLMs treat as "weakly attributed content".
 *
 * Output: dist/seo-audit/brand-reinforcement.{json,md}
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const auditDir = join(distDir, 'seo-audit')

const CANONICAL_NAME = 'ONDA Life'
const CANONICAL_URL = 'https://onda-life.com'
const BRAND_PHRASES = [
  /ONDA Life/i,
  /ONDA system/i,
  /ONDA framework/i,
  /ONDA protocol/i,
  /ONDA OS/i,
]

function* walk(root) {
  for (const entry of readdirSync(root)) {
    if (entry === 'seo-audit' || entry === 'datasets' || entry === 'ai-audit' || entry.startsWith('.')) continue
    const p = join(root, entry)
    const st = statSync(p)
    if (st.isDirectory()) yield* walk(p)
    else if (st.isFile() && entry.endsWith('.html')) yield p
  }
}

const articleViolations = []
let articlePages = 0
const variance = { publisherNames: new Map(), publisherUrls: new Map() }

for (const file of walk(distDir)) {
  const rel = file.slice(distDir.length + 1)
  const html = readFileSync(file, 'utf-8')
  const isArticle = rel.startsWith('articles/') && rel.endsWith('/index.html')
  if (!isArticle) continue
  articlePages++

  // Inspect every JSON-LD block for publisher consistency.
  const ldRe = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g
  let m
  let pubNameMismatches = 0
  let pubUrlMismatches = 0
  while ((m = ldRe.exec(html)) !== null) {
    let data
    try { data = JSON.parse(m[1]) } catch { continue }
    const objs = Array.isArray(data) ? data : [data]
    for (const o of objs) {
      const pub = o?.publisher ?? o?.author
      if (!pub) continue
      if (pub.name) {
        variance.publisherNames.set(pub.name, (variance.publisherNames.get(pub.name) ?? 0) + 1)
        if (pub.name !== CANONICAL_NAME) pubNameMismatches++
      }
      if (pub.url) {
        variance.publisherUrls.set(pub.url, (variance.publisherUrls.get(pub.url) ?? 0) + 1)
        if (pub.url !== CANONICAL_URL) pubUrlMismatches++
      }
    }
  }

  // Body must contain >=1 brand phrase OR the standardized footer micro-bio.
  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i)
  const body = bodyMatch ? bodyMatch[0] : html
  const hasPhrase = BRAND_PHRASES.some((re) => re.test(body))

  if (!hasPhrase || pubNameMismatches > 0 || pubUrlMismatches > 0) {
    articleViolations.push({
      file: rel,
      hasBrandPhrase: hasPhrase,
      publisherNameMismatches: pubNameMismatches,
      publisherUrlMismatches: pubUrlMismatches,
    })
  }
}

mkdirSync(auditDir, { recursive: true })
const summary = {
  generatedAt: new Date().toISOString(),
  articlePages,
  violations: articleViolations.length,
  variance: {
    publisherNames: [...variance.publisherNames.entries()].sort((a, b) => b[1] - a[1]),
    publisherUrls: [...variance.publisherUrls.entries()].sort((a, b) => b[1] - a[1]),
  },
  details: articleViolations,
}
writeFileSync(join(auditDir, 'brand-reinforcement.json'), JSON.stringify(summary, null, 2))

const md = [
  '# Brand entity reinforcement audit',
  '',
  `Generated: ${summary.generatedAt}`,
  `Article pages scanned: ${articlePages}`,
  `Violations: ${articleViolations.length}`,
  '',
  '## Publisher name variance',
  '| Name | Occurrences |',
  '|---|---:|',
  ...summary.variance.publisherNames.map(([n, c]) => `| ${n} | ${c} |`),
  '',
  '## Publisher URL variance',
  '| URL | Occurrences |',
  '|---|---:|',
  ...summary.variance.publisherUrls.map(([u, c]) => `| ${u} | ${c} |`),
  '',
  '## Article violations',
  '| File | Has brand phrase | Publisher.name ≠ canonical | Publisher.url ≠ canonical |',
  '|---|:---:|---:|---:|',
  ...articleViolations.slice(0, 50).map((v) =>
    `| ${v.file} | ${v.hasBrandPhrase ? '✓' : '✗'} | ${v.publisherNameMismatches} | ${v.publisherUrlMismatches} |`,
  ),
]
writeFileSync(join(auditDir, 'brand-reinforcement.md'), md.join('\n'))
console.log(
  `[validate-brand-reinforcement] ${articlePages} articles, ${articleViolations.length} violation(s)`,
)
if (process.env.SEO_STRICT === '1' && articleViolations.length > 0) {
  process.exit(1)
}
