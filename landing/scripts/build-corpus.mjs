#!/usr/bin/env node
/**
 * RAG-friendly content export (Stage 3 of GEO sprint).
 *
 * Emits dist/datasets/onda-corpus.jsonl with one JSON object per article and
 * glossary term:
 *   { id, slug, type, title, locale, url, published, modified, category,
 *     content_md, content_plain, related, citations[], chunks[] }
 *
 * Also gzips the output to dist/datasets/onda-corpus.jsonl.gz so AI training
 * pipelines (FineWeb, RedPajama-style aggregators) can ingest the smaller
 * variant. dist/datasets/README.md describes the schema and license.
 *
 * Optional add-ons (skipped with a warning when unavailable):
 *   - parquet variant — needs `parquetjs-lite` or similar; opt-in via
 *     ENABLE_PARQUET=1 + matching dependency.
 *   - precomputed embeddings — needs OPENAI_API_KEY; opt-in via
 *     ENABLE_EMBEDDINGS=1. Writes dist/datasets/embeddings/...parquet.
 *
 * Run order: prerender → sitemap → feed → llms-txt → build-corpus → indexnow.
 */
import { readFileSync, writeFileSync, mkdirSync, createReadStream, createWriteStream } from 'fs'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist', 'datasets')
const SITE_URL = 'https://onda-life.com'
const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/'

// Use tsx-loaded TS via dynamic import.
const { articles } = await import('../src/data/articles/index.ts')
const { glossaryTerms } = await import('../src/data/glossary.ts')
let articleDates = {}
try {
  const m = await import('../src/data/article-dates.generated.ts')
  articleDates = m.ARTICLE_DATES ?? m.default ?? {}
} catch {
  /* dates file may not exist on first build */
}

mkdirSync(distDir, { recursive: true })
mkdirSync(join(distDir, 'embeddings'), { recursive: true })

/** Strip markdown to plain prose. Keeps text, drops fences, headers, links. */
function toPlain(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Extract URLs cited in markdown (footnotes, inline links, bare URLs). */
function extractCitations(md) {
  const urls = new Set()
  const linkRe = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g
  const bareRe = /https?:\/\/[^\s)<>"']+/g
  let m
  while ((m = linkRe.exec(md)) !== null) urls.add(m[1])
  while ((m = bareRe.exec(md)) !== null) urls.add(m[0])
  return [...urls]
}

/** Split content into ≤4000-token chunks (approx 4 chars/token). Returns
 * [{ id, anchor, text }] with stable anchor IDs so RAG pipelines can cite. */
function chunkContent(slug, type, md, charBudget = 16000) {
  const out = []
  // Prefer splitting on H2/H3 boundaries to preserve semantic coherence.
  const parts = md.split(/\n(?=#{2,3}\s)/g)
  let buf = ''
  let idx = 0
  const flush = () => {
    if (!buf.trim()) return
    const anchor = `${type}-${slug}-c${idx + 1}`
    out.push({ id: anchor, anchor, text: buf.trim() })
    idx++
    buf = ''
  }
  for (const p of parts) {
    if (buf.length + p.length > charBudget) flush()
    buf += (buf ? '\n' : '') + p
  }
  flush()
  return out
}

function articleToRecord(a) {
  const url = `${SITE_URL}/articles/${a.slug}`
  const dates = articleDates[a.slug] ?? {}
  // Auto-publish: a per-article `publishedAt` field (Article.publishedAt) is
  // the canonical scheduling timestamp. When present it wins over git
  // history so the JSONL corpus advertises the exact moment the article
  // went live, matching what RSS/Atom and JSON-LD report on the page.
  const published = a.publishedAt ?? dates.publishedAt ?? dates.modifiedAt ?? '2025-01-01'
  const modified = dates.modifiedAt ?? published
  const md = a.content
  return {
    id: `article:${a.slug}`,
    slug: a.slug,
    type: 'article',
    title: a.title,
    seoTitle: a.seoTitle ?? null,
    locale: 'en',
    url,
    published,
    modified,
    category: a.category,
    description: a.description,
    related: a.relatedSlugs ?? [],
    citations: extractCitations(md),
    image: a.image ? `${SITE_URL}${a.image}` : null,
    image_alt: a.imageAlt ?? null,
    license: LICENSE_URL,
    attribution: `ONDA Life. "${a.title}". ${url}.`,
    content_md: md,
    content_plain: toPlain(md),
    chunks: chunkContent(a.slug, 'article', md),
  }
}

function glossaryToRecord(t) {
  const url = `${SITE_URL}/glossary/${t.slug}`
  const md = t.content
  return {
    id: `glossary:${t.slug}`,
    slug: t.slug,
    type: 'glossary',
    title: t.title,
    locale: 'en',
    url,
    published: '2025-01-01',
    modified: '2025-01-01',
    category: t.category,
    description: t.shortDescription,
    related: t.relatedSlugs ?? [],
    citations: extractCitations(md),
    license: LICENSE_URL,
    attribution: `ONDA Life. "${t.title}". ${url}.`,
    content_md: md,
    content_plain: toPlain(md),
    chunks: chunkContent(t.slug, 'glossary', md),
  }
}

const records = [
  ...articles.map(articleToRecord),
  ...glossaryTerms.map(glossaryToRecord),
]
records.sort((a, b) => a.id.localeCompare(b.id))

const jsonlPath = join(distDir, 'onda-corpus.jsonl')
writeFileSync(jsonlPath, records.map((r) => JSON.stringify(r)).join('\n') + '\n')
const sizeKB = (Buffer.byteLength(JSON.stringify(records))/1024).toFixed(1)

// gzip variant for efficient download/distribution
await pipeline(
  createReadStream(jsonlPath),
  createGzip({ level: 9 }),
  createWriteStream(`${jsonlPath}.gz`),
)

console.log(
  `[build-corpus] wrote ${records.length} records → onda-corpus.jsonl (~${sizeKB} KB) + .gz`,
)

// Emit a per-language manifest of corpus availability (currently EN-only).
const manifest = {
  generatedAt: new Date().toISOString(),
  license: LICENSE_URL,
  attribution: 'ONDA Life — https://onda-life.com',
  files: [
    {
      path: '/datasets/onda-corpus.jsonl',
      format: 'jsonl',
      records: records.length,
      locale: 'en',
    },
    {
      path: '/datasets/onda-corpus.jsonl.gz',
      format: 'jsonl+gzip',
      records: records.length,
      locale: 'en',
    },
  ],
  schemaVersion: 1,
  schema: {
    id: 'string',
    slug: 'string',
    type: 'article|glossary',
    title: 'string',
    locale: 'string',
    url: 'string',
    published: 'YYYY-MM-DD',
    modified: 'YYYY-MM-DD',
    category: 'string',
    description: 'string',
    related: 'string[]',
    citations: 'string[]',
    license: 'string',
    attribution: 'string',
    content_md: 'string (markdown)',
    content_plain: 'string',
    chunks: 'array of { id, anchor, text }',
  },
}
writeFileSync(join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2))

// Optional Parquet/embeddings hooks — currently print a structured warning
// so downstream pipelines can detect missing artifacts and back off.
if (process.env.ENABLE_PARQUET === '1') {
  console.warn('[build-corpus] ENABLE_PARQUET=1 set but parquet writer not installed; skipping')
}
if (process.env.ENABLE_EMBEDDINGS === '1') {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[build-corpus] ENABLE_EMBEDDINGS=1 set but OPENAI_API_KEY missing; skipping embeddings export')
  } else {
    console.warn('[build-corpus] embeddings export not yet wired (would call text-embedding-3-large for each chunk and write parquet)')
  }
}
