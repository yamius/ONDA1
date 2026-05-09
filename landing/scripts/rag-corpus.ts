/**
 * Generates dist/datasets/onda-corpus.jsonl (+ .gz) — a single-fetch
 * RAG-friendly dump of every public article and glossary term as JSONL.
 *
 *   One JSON object per line. Each line is a self-contained record so
 *   AI ingestion pipelines can stream-parse without loading the whole
 *   file into memory.
 *
 * Why JSONL: Perplexity, Anthropic, OpenAI, Cohere, Mistral and the
 * RAG community at large normalised on JSONL for training and
 * retrieval datasets. One HTTP request gets the entire ONDA corpus
 * with consistent schema, vs. crawling 544 individual URLs.
 *
 * Discovery: a sibling Dataset JSON-LD blob is emitted on the homepage
 * by meta-inject.ts (see buildDatasetJsonLd) and a <link rel=alternate
 * type=application/x-jsonlines> tag in index.html points at this file.
 *
 * Run order: prerender.ts -> sitemap.ts -> feed.ts -> llms-txt.ts ->
 *            rag-corpus.ts -> indexnow.ts
 */
import { writeFileSync, mkdirSync } from 'fs'
import { gzipSync } from 'zlib'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { glossaryTerms } from '../src/data/glossary'
import { ARTICLE_DATES } from '../src/data/article-dates.generated'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'

const AUTHOR = {
  name: 'Yakiv',
  url: 'https://www.linkedin.com/in/yamius',
} as const

interface CorpusRecord {
  id: string
  type: 'article' | 'glossary'
  language: 'en'
  url: string
  title: string
  description: string
  category?: string
  keywords?: string[]
  datePublished?: string
  dateModified?: string
  relatedSlugs?: string[]
  wordCount: number
  author: { name: string; url: string }
  body: string
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

const records: CorpusRecord[] = []

for (const a of articles) {
  const dates = ARTICLE_DATES[a.slug]
  records.push({
    id: a.slug,
    type: 'article',
    language: 'en',
    url: `${SITE_URL}/articles/${a.slug}`,
    title: a.title,
    description: a.description,
    category: a.category,
    relatedSlugs: a.relatedSlugs,
    datePublished: dates?.published,
    dateModified: dates?.modified,
    wordCount: wordCount(a.content),
    author: { name: AUTHOR.name, url: AUTHOR.url },
    body: a.content.trim(),
  })
}

for (const t of glossaryTerms) {
  records.push({
    id: t.slug,
    type: 'glossary',
    language: 'en',
    url: `${SITE_URL}/glossary/${t.slug}`,
    title: t.title,
    description: t.shortDescription,
    category: t.category,
    wordCount: wordCount(t.content),
    author: { name: AUTHOR.name, url: AUTHOR.url },
    body: t.content.trim(),
  })
}

// Stable ordering: articles first, then glossary, both by slug. Helps
// downstream diffs across builds — Perplexity and friends can detect
// "what changed since last fetch" without hashing the whole file.
records.sort((a, b) => {
  if (a.type !== b.type) return a.type === 'article' ? -1 : 1
  return a.id.localeCompare(b.id)
})

const jsonl = records.map((r) => JSON.stringify(r)).join('\n') + '\n'
const datasetsDir = join(distDir, 'datasets')
mkdirSync(datasetsDir, { recursive: true })
writeFileSync(join(datasetsDir, 'onda-corpus.jsonl'), jsonl)

// Pre-compressed sibling — most CDNs serve .gz directly when the client
// sends Accept-Encoding: gzip. Saves bandwidth on bulk ingestion.
const gz = gzipSync(jsonl, { level: 9 })
writeFileSync(join(datasetsDir, 'onda-corpus.jsonl.gz'), gz)

const articleCount = records.filter((r) => r.type === 'article').length
const glossaryCount = records.filter((r) => r.type === 'glossary').length
console.log(
  `[rag-corpus] Generated /datasets/onda-corpus.jsonl (${(jsonl.length / 1024).toFixed(0)} KB, ${(gz.length / 1024).toFixed(0)} KB gz) — ${articleCount} articles + ${glossaryCount} glossary terms`,
)
