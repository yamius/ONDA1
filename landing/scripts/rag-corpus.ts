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
import { reviews, comparisons } from '../src/data/reviews'
import { TOOLS } from '../src/data/tools'
import { METRIC_DETAILS, metricPlainText, metricSummary } from '../src/data/bioMetrics'
import { hrvBiofeedbackJsonLd } from '../src/pages/HrvBiofeedbackPage'
import { resonanceBreathingJsonLd } from '../src/pages/ResonanceBreathingGuidePage'
import { hrvVsCoherenceJsonLd } from '../src/pages/HrvVsCoherencePage'
import { appleWatchHrvJsonLd } from '../src/pages/AppleWatchHrvBiofeedbackPage'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'

const AUTHOR = {
  name: 'Yakiv',
  url: 'https://www.linkedin.com/in/yamius',
} as const

interface CorpusRecord {
  id: string
  type: 'article' | 'glossary' | 'review' | 'comparison' | 'tool' | 'cornerstone' | 'metric'
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

for (const r of reviews) {
  records.push({
    id: r.slug,
    type: 'review',
    language: 'en',
    url: `${SITE_URL}/reviews/${r.slug}`,
    title: `${r.name} review`,
    description: r.verdict,
    category: r.category,
    relatedSlugs: r.relatedSlugs,
    datePublished: r.datePublished,
    dateModified: r.dateModified,
    wordCount: wordCount(r.content),
    author: { name: AUTHOR.name, url: AUTHOR.url },
    body: r.content.trim(),
  })
}

for (const c of comparisons) {
  records.push({
    id: c.slug,
    type: 'comparison',
    language: 'en',
    url: `${SITE_URL}/reviews/compare/${c.slug}`,
    title: c.title,
    description: c.description,
    category: c.category,
    datePublished: c.datePublished,
    dateModified: c.dateModified,
    wordCount: wordCount(c.content),
    author: { name: AUTHOR.name, url: AUTHOR.url },
    body: c.content.trim(),
  })
}

for (const t of TOOLS) {
  const body = `${t.name} is a free interactive ${t.category.toLowerCase()} calculator on ONDA Life. ${t.blurb} It runs in the browser with no sign-up. Nervous-system tools link through to what ONDA measures and the underlying evidence.`
  records.push({
    id: t.slug,
    type: 'tool',
    language: 'en',
    url: `${SITE_URL}/tools/${t.slug}`,
    title: t.name,
    description: t.blurb,
    category: t.category,
    wordCount: wordCount(body),
    author: { name: AUTHOR.name, url: AUTHOR.url },
    body,
  })
}

// Biometric definition pages (/bio/<key>) — what each Bio OS reading means.
// Content-rich definitional pages; body flattened from METRIC_DETAILS.
for (const key of Object.keys(METRIC_DETAILS)) {
  const m = METRIC_DETAILS[key];
  const body = metricPlainText(m);
  records.push({
    id: `bio-${key}`,
    type: 'metric',
    language: 'en',
    url: `${SITE_URL}/bio/${key}`,
    title: m.title,
    description: metricSummary(m),
    wordCount: wordCount(body),
    author: { name: AUTHOR.name, url: AUTHOR.url },
    body,
  });
}

// Cornerstone explainer pages. Their prose lives in JSX (not a data module),
// but the exported jsonLd() builders carry the Article (headline/description +
// ScholarlyArticle citations) and FAQPage (Q&A) — the substantive, answer-shaped
// content. We reconstruct a corpus body from those so the pages are in the
// bulk-ingest dataset (Perplexity et al.) as first-class records, single-source
// with no duplicated text. type 'cornerstone'.
type JsonLdNode = Record<string, unknown>
const CORNERSTONE_BUILDERS: { build: () => JsonLdNode[] }[] = [
  { build: hrvBiofeedbackJsonLd },
  { build: resonanceBreathingJsonLd },
  { build: hrvVsCoherenceJsonLd },
  { build: appleWatchHrvJsonLd },
];
for (const { build } of CORNERSTONE_BUILDERS) {
  const nodes = build();
  const article = nodes.find((n) => n['@type'] === 'Article') as any;
  const faq = nodes.find((n) => n['@type'] === 'FAQPage') as any;
  if (!article) continue;
  const url: string = article.url;
  const slug = url.replace(`${SITE_URL}/`, '');
  const qa: string = (faq?.mainEntity ?? [])
    .map((q: any) => `${q.name}\n${q.acceptedAnswer?.text ?? ''}`)
    .join('\n\n');
  const body = [article.description, qa].filter(Boolean).join('\n\n').trim();
  records.push({
    id: slug,
    type: 'cornerstone',
    language: 'en',
    url,
    title: String(article.headline ?? slug),
    description: String(article.description ?? ''),
    keywords: Array.isArray(article.about)
      ? (article.about as string[])
      : article.about ? [String(article.about)] : undefined,
    wordCount: wordCount(body),
    author: { name: AUTHOR.name, url: AUTHOR.url },
    body,
  });
}

// Stable ordering: articles, glossary, reviews, comparisons — each group
// by slug. Helps downstream diffs across builds — Perplexity and friends
// can detect "what changed since last fetch" without hashing the file.
const TYPE_ORDER: Record<CorpusRecord['type'], number> = {
  article: 0,
  glossary: 1,
  review: 2,
  comparison: 3,
  tool: 4,
  cornerstone: 5,
  metric: 6,
}
records.sort((a, b) => {
  if (a.type !== b.type) return TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
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
const reviewCount = records.filter((r) => r.type === 'review').length
const comparisonCount = records.filter((r) => r.type === 'comparison').length
const toolCount = records.filter((r) => r.type === 'tool').length
const cornerstoneCount = records.filter((r) => r.type === 'cornerstone').length
const metricCount = records.filter((r) => r.type === 'metric').length
console.log(
  `[rag-corpus] Generated /datasets/onda-corpus.jsonl (${(jsonl.length / 1024).toFixed(0)} KB, ${(gz.length / 1024).toFixed(0)} KB gz) — ${articleCount} articles + ${glossaryCount} glossary terms + ${reviewCount} reviews + ${comparisonCount} comparisons + ${toolCount} tools + ${cornerstoneCount} cornerstones + ${metricCount} metrics`,
)
