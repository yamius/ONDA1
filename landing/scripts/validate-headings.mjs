#!/usr/bin/env node
/**
 * Heading hierarchy validator. Walks every article + glossary content body
 * (markdown source) and verifies:
 *
 *   1. Page renders with exactly one <h1> from prerender (the page chrome
 *      provides this — markdown bodies must start at <h2> or deeper).
 *   2. No level skips (e.g. ## then #### without ###).
 *   3. No bare # (h1) inside markdown bodies (would create duplicate h1).
 *
 * Exits 1 on violation so CI / build pipelines fail fast. Run before prerender.
 *
 * Usage:
 *   tsx scripts/validate-headings.mjs
 */
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Extract markdown heading levels (ignoring fenced code blocks).
function headingLevels(md) {
  const lines = md.split('\n')
  const out = []
  let inFence = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^\s{0,3}```/.test(line) || /^\s{0,3}~~~/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = line.match(/^\s{0,3}(#{1,6})\s/)
    if (m) out.push({ level: m[1].length, text: line.replace(/^#+\s*/, '').slice(0, 60), line: i + 1 })
  }
  return out
}

function validate(label, md) {
  const h = headingLevels(md)
  const errors = []
  const warnings = []
  // Rule 1: no h1 inside bodies
  const h1s = h.filter((x) => x.level === 1)
  for (const x of h1s) errors.push(`line ${x.line}: bare # (h1) inside body — use ##: "${x.text}"`)
  // Rule 2: no skips
  let prev = null
  for (const x of h) {
    if (prev !== null && x.level > prev + 1) {
      errors.push(`line ${x.line}: heading skip h${prev}→h${x.level} ("${x.text}")`)
    }
    prev = x.level
  }
  return { errors, warnings, headings: h.length }
}

let totalErrors = 0
let totalChecked = 0

// ---- Articles (TS files with `content: \`...\`` template literal) ----
const articlesDir = join(projectRoot, 'src', 'data', 'articles')
const articleFiles = readdirSync(articlesDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')
for (const f of articleFiles) {
  const src = readFileSync(join(articlesDir, f), 'utf-8')
  // Extract content: `...` (or content: "..." for short articles)
  const m = src.match(/content:\s*`([\s\S]*?)`,?\s*(?:howToSteps|relatedSlugs|imageAlt|category|description|date|image|seoTitle|\}\s*$)/)
  if (!m) continue
  const md = m[1]
  totalChecked++
  const { errors } = validate(f, md)
  if (errors.length) {
    totalErrors += errors.length
    console.error(`[validate-headings] ${f}:`)
    for (const e of errors) console.error(`  ${e}`)
  }
}

// ---- Glossary (single TS file with array of { content: `...` }) ----
const glossarySrc = readFileSync(join(projectRoot, 'src', 'data', 'glossary.ts'), 'utf-8')
const termRe = /\{\s*slug:\s*['"]([^'"]+)['"][\s\S]*?content:\s*`([\s\S]*?)`/g
let gm
while ((gm = termRe.exec(glossarySrc)) !== null) {
  const slug = gm[1]
  const md = gm[2]
  totalChecked++
  const { errors } = validate(`glossary/${slug}`, md)
  if (errors.length) {
    totalErrors += errors.length
    console.error(`[validate-headings] glossary/${slug}:`)
    for (const e of errors) console.error(`  ${e}`)
  }
}

console.log(`[validate-headings] checked ${totalChecked} markdown bodies, ${totalErrors} error(s)`)
if (totalErrors > 0) process.exit(1)
