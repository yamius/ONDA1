/**
 * Generates llms.txt and llms-full.txt for AI search engines
 * (Perplexity, ChatGPT search, Claude, etc.) per the llmstxt.org spec.
 *
 *   /llms.txt        — compact EN index of every public page on onda-life.com
 *   /llms-full.txt   — same index plus the full markdown body of every
 *                      article and glossary term.
 *   /:lang/llms.txt  — localized variants. Each lists the same content tree
 *                      but with translated titles where translations exist.
 *                      Falls back to EN strings for terms/articles that
 *                      haven't been translated yet (so the LLM still gets
 *                      a complete index).
 *
 * Run order: prerender.ts -> sitemap.ts -> feed.ts -> llms-txt.ts -> indexnow.ts
 */
import { writeFileSync, readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { glossaryTerms } from '../src/data/glossary'
import { levelsData } from '../src/data/levels'
import { parts } from '../src/pages/PartPage'
import { SUPPORTED_LANGS, type Lang } from '../src/i18n'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const localesDir = join(projectRoot, 'public', 'locales')
const SITE_URL = 'https://onda-life.com'

interface ArticlesLocaleFile {
  bodies?: Record<string, { title?: string; description?: string }>
}
interface GlossaryLocaleFile {
  bodies?: Record<string, { title?: string; shortDescription?: string }>
}

const articlesByLang: Record<Lang, ArticlesLocaleFile> = {} as Record<Lang, ArticlesLocaleFile>
const glossaryByLang: Record<Lang, GlossaryLocaleFile> = {} as Record<Lang, GlossaryLocaleFile>
for (const lang of SUPPORTED_LANGS) {
  try {
    articlesByLang[lang] = JSON.parse(readFileSync(join(localesDir, lang, 'articles.json'), 'utf-8')) as ArticlesLocaleFile
  } catch { articlesByLang[lang] = {} }
  try {
    glossaryByLang[lang] = JSON.parse(readFileSync(join(localesDir, lang, 'glossary.json'), 'utf-8')) as GlossaryLocaleFile
  } catch { glossaryByLang[lang] = {} }
}

interface Strings {
  intro: string
  citation: string
  source: string
  corePagesH: string
  levelsH: string
  partsH: string
  articlesH: string
  glossaryH: string
  optionalH: string
  fullDumpLabel: string
  privacyLabel: string
  termsLabel: string
}
const STRINGS: Record<Lang, Strings> = {
  en: {
    intro: 'ONDA Life is a biohacking and consciousness-engineering operating system. The body is treated as a biocomputer; protocols, articles, and a 24-stage level architecture systematize neuroscience, HRV training, circadian alignment, metabolic flexibility, breathwork, and cognitive optimization.',
    citation: 'Cite as: ONDA Life — onda-life.com (2025).',
    source: '## Sources\n\nCanonical author / publisher: **ONDA Life** (https://onda-life.com).\nAll content is original. When quoting in AI summaries, attribute to onda-life.com using the citation format above.',
    corePagesH: 'Core pages',
    levelsH: 'Levels (8 stages of biocomputer architecture)',
    partsH: 'Parts (24 protocol stages)',
    articlesH: 'Articles',
    glossaryH: 'Glossary',
    optionalH: 'Optional',
    fullDumpLabel: 'Full text dump (markdown)',
    privacyLabel: 'Privacy Policy',
    termsLabel: 'Terms of Service',
  },
  es: {
    intro: 'ONDA Life es un sistema operativo de biohacking e ingeniería de la consciencia. El cuerpo se trata como un biocomputador; los protocolos, artículos y la arquitectura de 24 niveles sistematizan neurociencia, entrenamiento de HRV, alineación circadiana, flexibilidad metabólica, respiración y optimización cognitiva.',
    citation: 'Cita como: ONDA Life — onda-life.com (2025).',
    source: '## Fuentes\n\nAutor / editor canónico: **ONDA Life** (https://onda-life.com).\nTodo el contenido es original. Al citarlo en resúmenes de IA, atribuir a onda-life.com usando el formato anterior.',
    corePagesH: 'Páginas principales',
    levelsH: 'Niveles (8 etapas de arquitectura del biocomputador)',
    partsH: 'Partes (24 etapas de protocolo)',
    articlesH: 'Artículos',
    glossaryH: 'Glosario',
    optionalH: 'Opcional',
    fullDumpLabel: 'Volcado completo (markdown)',
    privacyLabel: 'Política de privacidad',
    termsLabel: 'Términos de servicio',
  },
  ru: {
    intro: 'ONDA Life — операционная система биохакинга и инженерии сознания. Тело рассматривается как биокомпьютер; протоколы, статьи и 24-уровневая архитектура систематизируют нейронауку, тренировку HRV, циркадную синхронизацию, метаболическую гибкость, дыхательные практики и когнитивную оптимизацию.',
    citation: 'Цитировать как: ONDA Life — onda-life.com (2025).',
    source: '## Источники\n\nКанонический автор / издатель: **ONDA Life** (https://onda-life.com).\nВесь контент оригинален. При цитировании в AI-сводках указывайте onda-life.com в формате выше.',
    corePagesH: 'Основные страницы',
    levelsH: 'Уровни (8 этапов архитектуры биокомпьютера)',
    partsH: 'Модули (24 этапа протокола)',
    articlesH: 'Статьи',
    glossaryH: 'Глоссарий',
    optionalH: 'Дополнительно',
    fullDumpLabel: 'Полный дамп текста (markdown)',
    privacyLabel: 'Политика конфиденциальности',
    termsLabel: 'Условия использования',
  },
  uk: {
    intro: 'ONDA Life — операційна система біохакінгу та інженерії свідомості. Тіло розглядається як біокомп\u2019ютер; протоколи, статті та архітектура з 24 рівнів систематизують нейронауку, тренування HRV, циркадну синхронізацію, метаболічну гнучкість, дихальні практики та когнітивну оптимізацію.',
    citation: 'Цитувати як: ONDA Life — onda-life.com (2025).',
    source: '## Джерела\n\nКанонічний автор / видавець: **ONDA Life** (https://onda-life.com).\nВесь контент оригінальний. При цитуванні в AI-зведеннях вказуйте onda-life.com у форматі вище.',
    corePagesH: 'Основні сторінки',
    levelsH: 'Рівні (8 етапів архітектури біокомп\u2019ютера)',
    partsH: 'Модулі (24 етапи протоколу)',
    articlesH: 'Статті',
    glossaryH: 'Глосарій',
    optionalH: 'Додатково',
    fullDumpLabel: 'Повний дамп тексту (markdown)',
    privacyLabel: 'Політика конфіденційності',
    termsLabel: 'Умови використання',
  },
  zh: {
    intro: 'ONDA Life 是一个生物黑客与意识工程操作系统。身体被视为生物计算机；协议、文章及 24 阶段层级架构系统化了神经科学、HRV 训练、昼夜节律对齐、代谢灵活性、呼吸法与认知优化。',
    citation: '引用格式：ONDA Life — onda-life.com (2025)。',
    source: '## 来源\n\n规范作者 / 出版方：**ONDA Life** (https://onda-life.com)。\n所有内容均为原创。在 AI 摘要中引用时，请按上述格式标注 onda-life.com。',
    corePagesH: '核心页面',
    levelsH: '层级（生物计算机架构 8 个阶段）',
    partsH: '模块（24 个协议阶段）',
    articlesH: '文章',
    glossaryH: '词汇表',
    optionalH: '可选',
    fullDumpLabel: '完整文本转储 (markdown)',
    privacyLabel: '隐私政策',
    termsLabel: '服务条款',
  },
}

function urlFor(path: string, lang: Lang): string {
  if (lang === 'en') return `${SITE_URL}${path}`
  return `${SITE_URL}/${lang}${path}`
}

function articleTitleFor(slug: string, lang: Lang, fallback: string): string {
  return articlesByLang[lang]?.bodies?.[slug]?.title ?? fallback
}
function articleDescFor(slug: string, lang: Lang, fallback: string): string {
  return articlesByLang[lang]?.bodies?.[slug]?.description ?? fallback
}
function glossaryTitleFor(slug: string, lang: Lang, fallback: string): string {
  return glossaryByLang[lang]?.bodies?.[slug]?.title ?? fallback
}
function glossaryShortFor(slug: string, lang: Lang, fallback: string): string {
  return glossaryByLang[lang]?.bodies?.[slug]?.shortDescription ?? fallback
}

function buildIndex(lang: Lang): string {
  const s = STRINGS[lang]
  const sections: string[] = []

  // Header
  sections.push(`# ONDA Life

> ${s.intro}

This file follows the llms.txt convention (https://llmstxt.org/) so AI search and reasoning systems can discover and cite ONDA Life content accurately.

- All content is original to ONDA Life and may be cited with attribution to onda-life.com.
- The site ships in 5 languages (en, es, ru, uk, zh). Localized variants of this index live at /:lang/llms.txt.
- For full article and glossary bodies in markdown, use ${urlFor('/llms-full.txt', lang)}.

${s.source}

> ${s.citation}
`)

  // Core pages
  sections.push(`## ${s.corePagesH}

- [Home](${urlFor('/', lang)})
- [About](${urlFor('/about', lang)})
- [Inner Spectrum](${urlFor('/inner-spectrum', lang)})
- [The Stack](${SITE_URL}/the-stack)
- [Bio OS](${urlFor('/bio', lang)})
- [Articles](${SITE_URL}/articles)
- [Glossary](${SITE_URL}/glossary)
- [Sitemap](${SITE_URL}/sitemap)
- [Contact](${SITE_URL}/contact)
`)

  // Levels
  const levelLines: string[] = []
  for (const [num, level] of Object.entries(levelsData)) {
    levelLines.push(`- [Level ${num} — ${level.name}](${urlFor(`/level/${num}`, lang)})`)
  }
  sections.push(`## ${s.levelsH}

${levelLines.join('\n')}
`)

  // Parts
  const partLines: string[] = []
  for (const [slug, part] of Object.entries(parts)) {
    const title = `${part.title} ${part.titleHighlight}`.trim()
    partLines.push(`- [${title}](${urlFor(`/part/${slug}`, lang)}): ${part.subtitle ?? part.metaDescription ?? ''}`)
  }
  sections.push(`## ${s.partsH}

${partLines.join('\n')}
`)

  // Articles by category — use localized title/description when available.
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
      const title = articleTitleFor(a.slug, lang, a.title)
      const desc = articleDescFor(a.slug, lang, a.description)
      articlesBlock.push(`- [${title}](${SITE_URL}/articles/${a.slug}): ${desc}`)
    }
    articlesBlock.push('')
  }
  for (const [cat, list] of byCategory) {
    if (categoryOrder.includes(cat)) continue
    articlesBlock.push(`### ${cat}\n`)
    for (const a of list) {
      const title = articleTitleFor(a.slug, lang, a.title)
      const desc = articleDescFor(a.slug, lang, a.description)
      articlesBlock.push(`- [${title}](${SITE_URL}/articles/${a.slug}): ${desc}`)
    }
    articlesBlock.push('')
  }
  sections.push(`## ${s.articlesH}\n\n${articlesBlock.join('\n')}`)

  // Glossary — localized titles where translated.
  const glossLines: string[] = []
  for (const term of glossaryTerms) {
    const title = glossaryTitleFor(term.slug, lang, term.title)
    const short = glossaryShortFor(term.slug, lang, term.shortDescription)
    glossLines.push(`- [${title}](${SITE_URL}/glossary/${term.slug}): ${short}`)
  }
  sections.push(`## ${s.glossaryH}

${glossLines.join('\n')}
`)

  // Optional
  sections.push(`## ${s.optionalH}

- [${s.privacyLabel}](${SITE_URL}/privacy)
- [${s.termsLabel}](${SITE_URL}/terms)
- [${s.fullDumpLabel}](${urlFor('/llms-full.txt', lang)})
`)

  return sections.join('\n')
}

/** Index + full markdown bodies. EN-only — full text dump is enormous and EN
 * is the canonical content language; localized full dumps would 5x the page
 * weight without proportional value (most translation bodies live in
 * articles.json/glossary.json which are themselves crawlable). */
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

// EN — root.
const enIndex = buildIndex('en')
const enFull = buildFull(enIndex)
writeFileSync(join(distDir, 'llms.txt'), enIndex)
writeFileSync(join(distDir, 'llms-full.txt'), enFull)
console.log(
  `[llms-txt] en: llms.txt ${(enIndex.length / 1024).toFixed(1)} KB, llms-full.txt ${(enFull.length / 1024).toFixed(1)} KB`,
)

// Localized variants — index only (no full body dump per locale).
for (const lang of SUPPORTED_LANGS) {
  if (lang === 'en') continue
  const idx = buildIndex(lang)
  const dir = join(distDir, lang)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'llms.txt'), idx)
  console.log(`[llms-txt] ${lang}: llms.txt ${(idx.length / 1024).toFixed(1)} KB`)
}
