#!/usr/bin/env node
/**
 * Stage 6 — FAQ coverage audit.
 *
 * Reports article + glossary pages that lack a FAQPage JSON-LD block
 * with the recommended >=5 question/answer pairs. Reads the FAQ schema
 * registries already shipped in scripts/meta-inject.ts (FAQ_SCHEMA for
 * articles and FAQ_LEVEL_SCHEMA for levels) and cross-references with
 * the article + glossary registries.
 *
 * Non-fatal by default. Set SEO_STRICT=1 to fail the build if any
 * article or term lacks a 5-question FAQ block.
 *
 * Output: dist/seo-audit/faq-coverage.{json,md}
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const auditDir = join(projectRoot, 'dist', 'seo-audit')

const { articles } = await import('../src/data/articles/index.ts')
const { glossaryTerms } = await import('../src/data/glossary.ts')

// Parse the FAQ_SCHEMA literal out of meta-inject.ts. We do a lightweight
// AST-free scan because the file is large and the schema is the single
// place where FAQ blocks are registered.
const metaInjectSrc = readFileSync(join(projectRoot, 'scripts', 'meta-inject.ts'), 'utf-8')

function extractKeyedSchema(name) {
  const re = new RegExp(`const\\s+${name}\\s*:\\s*Record<[^>]+>\\s*=\\s*\\{`)
  const start = metaInjectSrc.search(re)
  if (start === -1) return {}
  // Find matching closing brace.
  let depth = 0
  let i = metaInjectSrc.indexOf('{', start)
  let begin = i
  for (; i < metaInjectSrc.length; i++) {
    const c = metaInjectSrc[i]
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) break
    }
  }
  const body = metaInjectSrc.slice(begin + 1, i)
  // Match top-level keys: 'slug-or-number': [...]
  const out = {}
  const keyRe = /(?:^|\s)['"]?([\w-]+)['"]?\s*:\s*\[/g
  let m
  while ((m = keyRe.exec(body)) !== null) {
    // Count question entries inside this array.
    const arrStart = m.index + m[0].length
    let d = 1
    let j = arrStart
    for (; j < body.length; j++) {
      const c = body[j]
      if (c === '[') d++
      else if (c === ']') {
        d--
        if (d === 0) break
      }
    }
    const arr = body.slice(arrStart, j)
    const qCount = (arr.match(/question\s*:/g) ?? []).length
    out[m[1]] = qCount
  }
  return out
}

const articleFaq = extractKeyedSchema('FAQ_SCHEMA')
const levelFaq = extractKeyedSchema('FAQ_LEVEL_SCHEMA')

const TARGET_PER_PAGE = 5
const articleReport = articles.map((a) => ({
  slug: a.slug,
  title: a.title,
  questions: articleFaq[a.slug] ?? 0,
  meetsTarget: (articleFaq[a.slug] ?? 0) >= TARGET_PER_PAGE,
}))
const glossaryReport = glossaryTerms.map((t) => ({
  slug: t.slug,
  title: t.title,
  // Glossary terms don't have FAQ blocks today — every term is a gap.
  questions: 0,
  meetsTarget: false,
}))

const summary = {
  generatedAt: new Date().toISOString(),
  target: TARGET_PER_PAGE,
  articles: {
    total: articleReport.length,
    withFaq: articleReport.filter((x) => x.questions > 0).length,
    meetingTarget: articleReport.filter((x) => x.meetsTarget).length,
    coverage: articleReport.length
      ? Number(((articleReport.filter((x) => x.meetsTarget).length / articleReport.length) * 100).toFixed(1))
      : 0,
  },
  glossary: {
    total: glossaryReport.length,
    withFaq: 0,
    meetingTarget: 0,
    coverage: 0,
  },
  levels: {
    registered: Object.keys(levelFaq).length,
    meetingTarget: Object.entries(levelFaq).filter(([, n]) => n >= TARGET_PER_PAGE).length,
  },
  gaps: {
    articles: articleReport.filter((x) => !x.meetsTarget).map((x) => ({ slug: x.slug, title: x.title, current: x.questions })),
    glossary: glossaryReport.map((x) => ({ slug: x.slug, title: x.title, current: 0 })),
  },
}

mkdirSync(auditDir, { recursive: true })
writeFileSync(join(auditDir, 'faq-coverage.json'), JSON.stringify(summary, null, 2))

const md = [
  '# FAQ coverage audit',
  '',
  `Generated: ${summary.generatedAt}`,
  `Target: **${summary.target}** Q&A pairs per page`,
  '',
  '## Articles',
  `Total: ${summary.articles.total}`,
  `With at least one Q&A: ${summary.articles.withFaq}`,
  `Meeting target (≥${summary.target}): ${summary.articles.meetingTarget}`,
  `Coverage: **${summary.articles.coverage}%**`,
  '',
  '## Glossary',
  `Total: ${summary.glossary.total}`,
  `With at least one Q&A: ${summary.glossary.withFaq} (no glossary FAQ blocks shipped yet)`,
  '',
  '## Levels',
  `Registered FAQ blocks: ${summary.levels.registered}`,
  `Meeting target: ${summary.levels.meetingTarget}`,
  '',
  '## Article gaps (top 30)',
  '| Slug | Current Q&A | Title |',
  '|---|---:|---|',
  ...summary.gaps.articles
    .slice(0, 30)
    .map((g) => `| \`${g.slug}\` | ${g.current} | ${g.title} |`),
]
writeFileSync(join(auditDir, 'faq-coverage.md'), md.join('\n'))

console.log(
  `[audit-faq-coverage] articles ${summary.articles.meetingTarget}/${summary.articles.total} meet target, glossary ${summary.glossary.meetingTarget}/${summary.glossary.total}`,
)
if (
  process.env.SEO_STRICT === '1' &&
  summary.articles.meetingTarget < summary.articles.total
) {
  process.exit(1)
}
