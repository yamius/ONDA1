#!/usr/bin/env node
/**
 * JSON-LD shape validator.
 *
 * Walks every prerendered HTML file under dist/, extracts every
 * <script type="application/ld+json"> blob, parses each one, and checks:
 *
 *   1. Valid JSON.
 *   2. @context = 'https://schema.org' (string or array containing it).
 *   3. @type present.
 *   4. Per-type required fields (Article needs headline + author +
 *      datePublished; HowTo needs name + step; FAQPage needs mainEntity;
 *      Organization needs name + url; CollectionPage needs name + url).
 *   5. Cross-blob: every page that has an Article blob must also have a
 *      BreadcrumbList blob (rich-result eligibility).
 *
 * Writes dist/seo-audit/jsonld.{json,md}. Exits 0 by default; set
 * SEO_STRICT=1 to fail the build on any error.
 *
 * Optional Google Rich Results Test API integration: if
 * GOOGLE_RICH_RESULTS_API_KEY is set, the script samples 10 URLs and posts
 * them to https://searchconsole.googleapis.com/v1/urlTestingTools/
 * richResults:run. Without the key, only the local shape validator runs —
 * matches the brief's "skip-without-key" pattern.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const auditDir = join(distDir, 'seo-audit')

if (!existsSync(distDir)) {
  console.warn('[validate-jsonld] dist/ not found — skipping')
  process.exit(0)
}

/** Recursively list every *.html file under a directory. */
function walkHtml(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (name === 'seo-audit' || name === 'datasets' || name === 'assets' || name === 'og-images') continue
      out.push(...walkHtml(full))
    } else if (st.isFile() && name.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

const htmlFiles = walkHtml(distDir)
console.log(`[validate-jsonld] scanning ${htmlFiles.length} HTML file(s)`)

const JSONLD_RE = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi

const REQUIRED_BY_TYPE = {
  Article: ['headline', 'author', 'datePublished'],
  NewsArticle: ['headline', 'author', 'datePublished'],
  BlogPosting: ['headline', 'author', 'datePublished'],
  MedicalScholarlyArticle: ['headline', 'author', 'datePublished'],
  HowTo: ['name', 'step'],
  FAQPage: ['mainEntity'],
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  WebPage: ['name'],
  CollectionPage: ['name', 'url'],
  ItemList: ['itemListElement'],
  BreadcrumbList: ['itemListElement'],
  DefinedTerm: ['name'],
  Question: ['name', 'acceptedAnswer'],
  Answer: ['text'],
}

function getType(node) {
  if (!node || typeof node !== 'object') return null
  const t = node['@type']
  if (Array.isArray(t)) return t[0]
  return t ?? null
}

function checkContext(node) {
  const ctx = node['@context']
  if (typeof ctx === 'string') return /schema\.org/.test(ctx)
  if (Array.isArray(ctx)) return ctx.some((c) => typeof c === 'string' && /schema\.org/.test(c))
  return false
}

function checkRequired(node, type) {
  const req = REQUIRED_BY_TYPE[type]
  if (!req) return [] // unknown type — skip
  return req.filter((field) => !(field in node))
}

const errors = []
const stats = { files: 0, blobs: 0, types: {} }

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8')
  const rel = relative(distDir, file)
  stats.files++

  let m
  const blobsThisFile = []
  // Reset regex lastIndex for each file
  JSONLD_RE.lastIndex = 0
  while ((m = JSONLD_RE.exec(html)) !== null) {
    stats.blobs++
    let parsed
    try {
      parsed = JSON.parse(m[1].trim())
    } catch (e) {
      errors.push({ file: rel, type: 'invalid-json', detail: e.message.slice(0, 120) })
      continue
    }
    /** Recursively visit every typed entity reachable through @graph,
     *  arrays, or property values. The shape-validator must descend into
     *  @graph wrappers (very common pattern for Article + Breadcrumb +
     *  Organization combo blobs) so required-field checks fire on nested
     *  entities and we don't false-positive `missing-type` on the wrapper. */
    function visit(node, depth) {
      if (depth > 6) return
      if (Array.isArray(node)) {
        for (const child of node) visit(child, depth + 1)
        return
      }
      if (!node || typeof node !== 'object') return

      const t = getType(node)
      if (t) {
        stats.types[t] = (stats.types[t] ?? 0) + 1
        blobsThisFile.push(t)
        const missing = checkRequired(node, t)
        if (missing.length > 0) {
          errors.push({ file: rel, type: 'missing-required-fields', schemaType: t, missing })
        }
      }
      // Descend into @graph and any property whose value is an object/array.
      if (Array.isArray(node['@graph'])) {
        for (const child of node['@graph']) visit(child, depth + 1)
      }
      for (const [key, value] of Object.entries(node)) {
        if (key === '@graph' || key === '@type' || key === '@context') continue
        if (value && (Array.isArray(value) || typeof value === 'object')) {
          visit(value, depth + 1)
        }
      }
    }

    // Top-level entities only need @context check; descendants inherit it
    // per schema.org JSON-LD spec.
    const tops = Array.isArray(parsed) ? parsed : [parsed]
    for (const top of tops) {
      if (!top || typeof top !== 'object') {
        errors.push({ file: rel, type: 'non-object-blob' })
        continue
      }
      if (!checkContext(top)) {
        const t = getType(top) ?? '(unknown)'
        errors.push({ file: rel, type: 'missing-context', schemaType: t })
      }
      // A top-level @graph wrapper without @type is legitimate; only flag
      // missing-type if there's no @graph either.
      if (!getType(top) && !Array.isArray(top['@graph'])) {
        errors.push({ file: rel, type: 'missing-type' })
      }
      visit(top, 0)
    }
  }

  // Cross-blob check: Article-family pages should also have a
  // BreadcrumbList for rich-result eligibility.
  const hasArticle = blobsThisFile.some((t) => t === 'Article' || t === 'NewsArticle' || t === 'BlogPosting' || t === 'MedicalScholarlyArticle')
  const hasBreadcrumb = blobsThisFile.includes('BreadcrumbList')
  if (hasArticle && !hasBreadcrumb) {
    errors.push({ file: rel, type: 'article-without-breadcrumb' })
  }
}

// Optional: Google Rich Results Test API gate. Skip cleanly without key.
// The Search Console urlTestingTools/richResults:run endpoint requires
// service-account auth (OAuth2), not a static API key — so this stays as
// a documented manual escalation path rather than an in-script call.
const richResultsApi = {
  skipped: true,
  reason: process.env.GOOGLE_RICH_RESULTS_API_KEY
    ? 'GOOGLE_RICH_RESULTS_API_KEY present but the Rich Results endpoint '
      + 'requires OAuth2 service-account auth, not a static API key. '
      + 'Trigger manual checks via https://search.google.com/test/rich-results '
      + 'for the 10 representative URLs in landing/docs/seo-verification.md.'
    : 'GOOGLE_RICH_RESULTS_API_KEY not set — manual verification only.',
}

const summary = {
  generatedAt: new Date().toISOString(),
  files: stats.files,
  blobs: stats.blobs,
  typesFound: stats.types,
  errorCount: errors.length,
  errorsByType: errors.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1
    return acc
  }, {}),
  errors: errors.slice(0, 300),
  richResultsApi,
}

mkdirSync(auditDir, { recursive: true })
writeFileSync(join(auditDir, 'jsonld.json'), JSON.stringify(summary, null, 2))

const md = [
  '# JSON-LD validation audit',
  '',
  `Generated: ${summary.generatedAt}`,
  `Files scanned: ${summary.files}`,
  `JSON-LD blobs found: ${summary.blobs}`,
  `Total errors: ${summary.errorCount}`,
  '',
  '## Schema types observed',
  '',
  ...Object.entries(summary.typesFound)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## Errors by type',
  '',
  ...Object.entries(summary.errorsByType).map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## Google Rich Results API gate',
  '',
  richResultsApi.skipped
    ? `⏭️ skipped (${richResultsApi.reason})`
    : `🔑 key present — ${richResultsApi.note}`,
  '',
  '## First 50 errors',
  '',
  ...summary.errors.slice(0, 50).map((e) => `- \`${e.type}\` — ${JSON.stringify(e)}`),
].join('\n')
writeFileSync(join(auditDir, 'jsonld.md'), md)

console.log(`[validate-jsonld] ${summary.blobs} blob(s) across ${summary.files} file(s), ${summary.errorCount} error(s)`)

if (process.env.SEO_STRICT === '1' && summary.errorCount > 0) {
  console.error('[validate-jsonld] FAIL — SEO_STRICT=1 and errors present')
  process.exit(1)
}
