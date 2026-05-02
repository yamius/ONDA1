#!/usr/bin/env node
/**
 * Stage 8 — Glossary first-paragraph validator.
 *
 * Generative engines lift definitions verbatim from the first paragraph
 * of a definition page. To maximize that surface area, every glossary
 * term's first paragraph must:
 *
 *   1. Start with a noun-first sentence (the term itself or a noun
 *      phrase).
 *   2. Contain ≤80 words.
 *   3. Contain a clear definition clause that uses "is", "are",
 *      "refers to", or a colon.
 *
 * Output: dist/seo-audit/glossary-definition.{json,md}
 *
 * Non-fatal by default. SEO_STRICT=1 makes it gate the build.
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const auditDir = join(projectRoot, 'dist', 'seo-audit')

const { glossaryTerms } = await import('../src/data/glossary.ts')

const MAX_WORDS = 80

function stripMd(line) {
  return line
    .replace(/^[#>\s-]+/, '')
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

function firstParagraph(md) {
  const lines = md.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  // Skip leading H1/H2 blocks — we want the first prose paragraph.
  for (const line of lines) {
    if (/^#{1,6}\s/.test(line)) continue
    if (/^>/.test(line)) continue // skip blockquote intros
    if (/^-\s/.test(line) || /^\d+\.\s/.test(line)) continue // skip lists
    return stripMd(line)
  }
  return ''
}

function isNounFirst(s, title) {
  if (!s) return false
  const first = s.split(/\s+/)[0]?.replace(/[^A-Za-z]/g, '') ?? ''
  if (!first) return false
  // Title noun start is the gold standard.
  if (s.toLowerCase().startsWith(title.toLowerCase())) return true
  // Allow common noun-phrase starts: "The X", "A X", "An X".
  if (/^(the|a|an)\b/i.test(s)) return true
  // Otherwise require capital noun (heuristic: not a verb-leading sentence).
  // Reject obvious verb leads.
  const verbStarts = /^(is|are|was|were|will|do|does|use|using|when|how|why|imagine|consider|picture)\b/i
  if (verbStarts.test(s)) return false
  // Capitalized word that isn't a connector usually means a noun.
  return /^[A-Z][A-Za-z-]+/.test(first)
}

function hasDefinitionClause(s) {
  return /\b(is|are|refers? to|means|describes?|denotes?)\b/i.test(s) || /:\s/.test(s)
}

const violations = []
const accepted = []
for (const t of glossaryTerms) {
  const para = firstParagraph(t.content)
  const wc = para ? para.split(/\s+/).length : 0
  const issues = []
  if (!para) issues.push('empty')
  if (wc > MAX_WORDS) issues.push(`words=${wc}>${MAX_WORDS}`)
  if (para && !isNounFirst(para, t.title)) issues.push('not-noun-first')
  if (para && !hasDefinitionClause(para)) issues.push('no-definition-clause')

  if (issues.length === 0) {
    accepted.push({ slug: t.slug, words: wc })
  } else {
    violations.push({
      slug: t.slug,
      title: t.title,
      issues,
      preview: para.slice(0, 200),
    })
  }
}

mkdirSync(auditDir, { recursive: true })
const summary = {
  generatedAt: new Date().toISOString(),
  total: glossaryTerms.length,
  accepted: accepted.length,
  violations: violations.length,
  coverage:
    glossaryTerms.length > 0
      ? Number(((accepted.length / glossaryTerms.length) * 100).toFixed(1))
      : 0,
  details: violations,
}
writeFileSync(join(auditDir, 'glossary-definition.json'), JSON.stringify(summary, null, 2))

const md = [
  '# Glossary first-paragraph validator',
  '',
  `Generated: ${summary.generatedAt}`,
  `Total terms: ${summary.total}`,
  `Accepted: ${summary.accepted} (${summary.coverage}%)`,
  `Violations: ${summary.violations}`,
  '',
  '## Issues',
  ...violations.slice(0, 50).map(
    (v) => `### ${v.title} \`${v.slug}\`\n- Issues: ${v.issues.join(', ')}\n- First paragraph: ${v.preview || '(empty)'}\n`,
  ),
  violations.length > 50 ? `\n_…and ${violations.length - 50} more_` : '',
]
writeFileSync(join(auditDir, 'glossary-definition.md'), md.join('\n'))

console.log(
  `[validate-glossary-definition] ${accepted.length}/${glossaryTerms.length} accepted, ${violations.length} violation(s)`,
)
if (process.env.SEO_STRICT === '1' && violations.length > 0) {
  process.exit(1)
}
