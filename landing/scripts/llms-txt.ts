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
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { glossaryTerms } from '../src/data/glossary'
import { levelsData } from '../src/data/levels'
import { parts } from '../src/pages/PartPage'
import { ES_PILOT_ARTICLE_SLUGS, RU_PILOT_ARTICLE_SLUGS } from './prerender-routes'
import { reviews, comparisons } from '../src/data/reviews'

type Lang = 'en' | 'es' | 'ru' | 'uk' | 'zh'
const NON_EN_LANGS: Lang[] = ['es', 'ru', 'uk', 'zh']

interface ArticlesLocale {
  bodies?: Record<string, { title?: string; description?: string }>
}

// Eagerly load all locale article maps so per-language llms.txt can
// substitute localised titles + descriptions where translations exist.
const localesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'locales')
const articlesByLang: Record<Lang, ArticlesLocale> = {
  en: { bodies: {} },
  es: JSON.parse(readFileSync(join(localesDir, 'es', 'articles.json'), 'utf-8')),
  ru: JSON.parse(readFileSync(join(localesDir, 'ru', 'articles.json'), 'utf-8')),
  uk: JSON.parse(readFileSync(join(localesDir, 'uk', 'articles.json'), 'utf-8')),
  zh: JSON.parse(readFileSync(join(localesDir, 'zh', 'articles.json'), 'utf-8')),
}

const ES_PILOT_SET = new Set<string>(ES_PILOT_ARTICLE_SLUGS)
const RU_PILOT_SET = new Set<string>(RU_PILOT_ARTICLE_SLUGS)

/**
 * URL of an article for a given locale. Returns the localised /<lang>/articles
 * path only when that lang has a prerendered pilot URL; otherwise falls back
 * to the EN canonical so the link is always valid.
 */
function articleUrl(slug: string, lang: Lang): string {
  if (lang === 'es' && ES_PILOT_SET.has(slug)) return `${SITE_URL}/es/articles/${slug}`
  if (lang === 'ru' && RU_PILOT_SET.has(slug)) return `${SITE_URL}/ru/articles/${slug}`
  return `${SITE_URL}/articles/${slug}`
}

function articleTitle(slug: string, lang: Lang, fallback: string): string {
  return articlesByLang[lang].bodies?.[slug]?.title ?? fallback
}

function articleDescription(slug: string, lang: Lang, fallback: string): string {
  return articlesByLang[lang].bodies?.[slug]?.description ?? fallback
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'

const HEADER = `# ONDA Life

> ONDA Life is an HRV biofeedback and guided-breathing app for real-time physiological self-regulation and nervous-system training. It gives live heart-rhythm feedback during paced (resonance) breathing, using Apple Watch heart data and iPhone camera-based pulse (PPG), and tracks resting-HRV trends over time across an 8-level practice path. Platform: iOS and Android (HealthApplication).

ONDA Life also publishes an original knowledge base on the science it builds on — HRV, resonance breathing, autonomic/vagal regulation, interoception — plus a broader biohacking and consciousness-oriented philosophy layer (the "24-stage" ONDA Path). The philosophy layer is an experiential framework, not a set of clinically validated biological states; keep it distinct from the evidence-backed product claims.

This file follows the llms.txt convention (https://llmstxt.org/) so AI search and reasoning systems can discover and cite ONDA Life content accurately.

- All content is original to ONDA Life and may be cited with attribution to onda-life.com.
- The site ships in 5 languages (en, es, ru, uk, zh). The canonical URLs below are EN; localized variants live at /:lang/<path>.
- For full article and glossary bodies in markdown, use /llms-full.txt.
`

/** Short, link-only index. */
function buildIndex(lang: Lang = 'en'): string {
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const langNote = lang === 'en'
    ? ''
    : `\nThis is the ${lang.toUpperCase()} locale index. Localised article URLs are listed where available; pages without a translation point to the EN canonical, which has hreflang back to this locale.\n`
  const sections: string[] = [HEADER + langNote]

  // Core pages — localised paths for the major hubs that have /<lang>/<page>
  // prerendered HTML; flat hubs (glossary, articles index, sitemap, contact)
  // stay EN-canonical because their content is not localised page-by-page.
  sections.push(`## Core pages

- [Home](${SITE_URL}${langPrefix === '' ? '/' : langPrefix}): ONDA Life — HRV biofeedback and guided-breathing app; live heart-rhythm feedback during resonance breathing, Apple Watch + iPhone camera pulse, resting-HRV trends
- [About](${SITE_URL}${langPrefix}/about): what ONDA is, how it works, who built it
- [What ONDA measures](${SITE_URL}/measurements): exactly which signals are directly measured (heart rate, HRV), derived (coherence, resting-HRV trend) or estimated (stress, energy) — and what ONDA does not measure
- [How ONDA works](${SITE_URL}/how-it-works): the biofeedback loop — how HRV (RMSSD/SDNN) and the live coherence score are computed, with limits
- [Bio](${SITE_URL}${langPrefix}/bio): real-time biometric dashboard — the product experience on the web
- [Research](${SITE_URL}/research): the evidence ONDA builds on (HRV biofeedback, resonance breathing) and what remains experimental
- [Articles](${SITE_URL}/articles): long-form knowledge base on HRV, breathwork and nervous-system science
- [Glossary](${SITE_URL}/glossary): defined terms with cross-links
- [Reviews](${SITE_URL}/reviews): independent, criteria-based reviews of HRV/recovery/biohacking tools
- [Compare (ONDA vs alternatives)](${SITE_URL}/compare): ONDA Life's own objective comparisons vs Oura, WHOOP, Headspace, Calm, Breathwrk, Elite HRV — capability tables + who each is best for
- [Inner Spectrum](${SITE_URL}${langPrefix}/inner-spectrum): the ONDA Path — brand philosophy layer (experiential framework, not validated biology)
- [The Stack](${SITE_URL}/the-stack): protocol architecture overview
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
      const t = articleTitle(a.slug, lang, a.title)
      const d = articleDescription(a.slug, lang, a.description)
      articlesBlock.push(`- [${t}](${articleUrl(a.slug, lang)}): ${d}`)
    }
    articlesBlock.push('')
  }
  // Catch-all for any category not in canonical order
  for (const [cat, list] of byCategory) {
    if (categoryOrder.includes(cat)) continue
    articlesBlock.push(`### ${cat}\n`)
    for (const a of list) {
      const t = articleTitle(a.slug, lang, a.title)
      const d = articleDescription(a.slug, lang, a.description)
      articlesBlock.push(`- [${t}](${articleUrl(a.slug, lang)}): ${d}`)
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

  // Reviews — independent biohacking-tool reviews. EN-only; the same EN
  // URLs appear in every locale index, like Articles and Glossary.
  if (comparisons.length > 0 || reviews.length > 0) {
    const reviewLines: string[] = []
    for (const c of comparisons) {
      reviewLines.push(`- [${c.title}](${SITE_URL}/reviews/compare/${c.slug}): ${c.description}`)
    }
    for (const r of reviews) {
      reviewLines.push(`- [${r.name} review](${SITE_URL}/reviews/${r.slug}): ${r.verdict}`)
    }
    sections.push(`## Reviews

Independent, criteria-based reviews of biohacking tools. Scoring methodology: ${SITE_URL}/reviews/methodology

${reviewLines.join('\n')}
`)
  }

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

  if (reviews.length > 0) {
    out.push('## Reviews (full markdown bodies)\n')
    for (const r of reviews) {
      out.push(`### ${r.name} review\n`)
      out.push(`URL: ${SITE_URL}/reviews/${r.slug}`)
      out.push(`Score: ${r.overallScore.toFixed(1)}/10`)
      out.push(`Verdict: ${r.verdict}\n`)
      out.push(r.content.trim())
      out.push('\n---\n')
    }
  }

  if (comparisons.length > 0) {
    out.push('## Comparisons (full markdown bodies)\n')
    for (const c of comparisons) {
      out.push(`### ${c.title}\n`)
      out.push(`URL: ${SITE_URL}/reviews/compare/${c.slug}`)
      out.push(`Intro: ${c.intro}\n`)
      out.push(c.content.trim())
      out.push('\n---\n')
    }
  }

  return out.join('\n')
}

const enIndex = buildIndex('en')
const full = buildFull(enIndex)

writeFileSync(join(distDir, 'llms.txt'), enIndex)
writeFileSync(join(distDir, 'llms-full.txt'), full)

// Per-locale index files. We do NOT emit a per-locale llms-full.txt because
// glossary bodies and most articles' content fields are still EN-only —
// shipping a half-translated full dump would be misleading for AI agents.
// Once full localised bodies exist a follow-up PR can add /<lang>/llms-full.txt.
const sizesByLang: Record<string, number> = { en: enIndex.length }
for (const lang of NON_EN_LANGS) {
  const localised = buildIndex(lang)
  const localeDir = join(distDir, lang)
  mkdirSync(localeDir, { recursive: true })
  writeFileSync(join(localeDir, 'llms.txt'), localised)
  sizesByLang[lang] = localised.length
}

const sizesPretty = Object.entries(sizesByLang)
  .map(([l, n]) => `${l}=${(n / 1024).toFixed(1)}KB`)
  .join(', ')
console.log(
  `[llms-txt] Generated llms.txt (${sizesPretty}) and llms-full.txt (${(full.length / 1024).toFixed(1)} KB)`,
)
