/**
 * Generates llms.txt and llms-full.txt for AI search engines
 * (Perplexity, ChatGPT search, Claude, etc.) per the llmstxt.org spec.
 *
 *   /llms.txt       — compact index of every public page on onda-life.com
 *                     so an LLM can pick the right URL to fetch.
 *   /llms-full.txt  — same index plus the full markdown body of every
 *                     article and glossary term, for LLMs that prefer one
 *                     authoritative document over scraping.
 *
 * Run order: prerender.ts -> sitemap.ts -> indexnow.ts -> llms-txt.ts
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { glossaryTerms } from '../src/data/glossary'
import { levelsData } from '../src/data/levels'
import { parts } from '../src/pages/PartPage'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'

const HEADER = `# ONDA Life

> ONDA Life is a biohacking and consciousness-engineering operating system. The body is treated as a biocomputer; protocols, articles, and a 24-stage level architecture systematize neuroscience, HRV training, circadian alignment, metabolic flexibility, breathwork, and cognitive optimization.

This file follows the llms.txt convention (https://llmstxt.org/) so AI search and reasoning systems can discover and cite ONDA Life content accurately.

- All content is original to ONDA Life and may be cited with attribution to onda-life.com.
- The site ships in 5 languages (en, es, ru, uk, zh). The canonical URLs below are EN; localized variants live at /:lang/<path>.
- For full article and glossary bodies in markdown, use /llms-full.txt.
`

/** Short, link-only index. */
function buildIndex(): string {
  const sections: string[] = [HEADER]

  // Core pages
  sections.push(`## Core pages

- [Home](${SITE_URL}/): biohacking OS, 24 stages of consciousness firmware
- [About](${SITE_URL}/about): philosophy and team
- [Inner Spectrum](${SITE_URL}/inner-spectrum): the philosophy layer
- [The Stack](${SITE_URL}/the-stack): protocol architecture overview
- [Bio OS](${SITE_URL}/bio): real-time biometric dashboard
- [Articles](${SITE_URL}/articles): SEO long-form content index
- [Glossary](${SITE_URL}/glossary): defined terms with cross-links
- [Sitemap](${SITE_URL}/sitemap): all pages
- [Contact](${SITE_URL}/contact): reach the team
`)

  // Levels & parts (24 stages)
  const levelLines: string[] = []
  for (const [num, level] of Object.entries(levelsData)) {
    levelLines.push(`- [Level ${num} — ${level.name}](${SITE_URL}/level/${num})`)
  }
  sections.push(`## Levels (8 stages of biocomputer architecture)

${levelLines.join('\n')}
`)

  const partLines: string[] = []
  for (const [slug, part] of Object.entries(parts)) {
    const title = `${part.title} ${part.titleHighlight}`.trim()
    partLines.push(`- [${title}](${SITE_URL}/part/${slug}): ${part.subtitle ?? part.metaDescription ?? ''}`)
  }
  sections.push(`## Parts (24 protocol stages)

${partLines.join('\n')}
`)

  // Articles, grouped by category
  const byCategory = new Map<string, typeof articles>()
  for (const a of articles) {
    if (!byCategory.has(a.category)) byCategory.set(a.category, [])
    byCategory.get(a.category)!.push(a)
  }
  const categoryOrder = ['Neural Hardware', 'Biological Software', 'OS States', 'ONDA Protocol']
  const articlesBlock: string[] = []
  for (const cat of categoryOrder) {
    const list = byCategory.get(cat)
    if (!list || list.length === 0) continue
    articlesBlock.push(`### ${cat}\n`)
    for (const a of list) {
      articlesBlock.push(`- [${a.title}](${SITE_URL}/articles/${a.slug}): ${a.description}`)
    }
    articlesBlock.push('')
  }
  // Catch-all for any category not in canonical order
  for (const [cat, list] of byCategory) {
    if (categoryOrder.includes(cat)) continue
    articlesBlock.push(`### ${cat}\n`)
    for (const a of list) {
      articlesBlock.push(`- [${a.title}](${SITE_URL}/articles/${a.slug}): ${a.description}`)
    }
    articlesBlock.push('')
  }
  sections.push(`## Articles\n\n${articlesBlock.join('\n')}`)

  // Glossary
  const glossLines: string[] = []
  for (const term of glossaryTerms) {
    glossLines.push(`- [${term.title}](${SITE_URL}/glossary/${term.slug}): ${term.shortDescription}`)
  }
  sections.push(`## Glossary

${glossLines.join('\n')}
`)

  // Optional / long-tail
  sections.push(`## Optional

- [Privacy Policy](${SITE_URL}/privacy)
- [Terms of Service](${SITE_URL}/terms)
- [Full text dump (markdown)](${SITE_URL}/llms-full.txt)
`)

  return sections.join('\n')
}

/** Index + full markdown bodies. Order: Articles, Glossary. */
function buildFull(index: string): string {
  const out: string[] = [index, '\n---\n', '# Full content\n']

  out.push('## Articles (full markdown bodies)\n')
  for (const a of articles) {
    out.push(`### ${a.title}\n`)
    out.push(`URL: ${SITE_URL}/articles/${a.slug}`)
    out.push(`Category: ${a.category}`)
    out.push(`Description: ${a.description}\n`)
    out.push(a.content.trim())
    out.push('\n---\n')
  }

  out.push('## Glossary (full markdown bodies)\n')
  for (const term of glossaryTerms) {
    out.push(`### ${term.title}\n`)
    out.push(`URL: ${SITE_URL}/glossary/${term.slug}`)
    out.push(`Category: ${term.category}`)
    out.push(`Short: ${term.shortDescription}\n`)
    out.push(term.content.trim())
    out.push('\n---\n')
  }

  return out.join('\n')
}

const index = buildIndex()
const full = buildFull(index)

writeFileSync(join(distDir, 'llms.txt'), index)
writeFileSync(join(distDir, 'llms-full.txt'), full)

console.log(
  `[llms-txt] Generated llms.txt (${(index.length / 1024).toFixed(1)} KB) and llms-full.txt (${(full.length / 1024).toFixed(1)} KB)`,
)
