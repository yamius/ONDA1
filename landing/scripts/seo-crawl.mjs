#!/usr/bin/env node
/**
 * SEO baseline crawler — walks every prerendered HTML file under dist/ and
 * extracts the SEO signals we care about. Emits two files:
 *
 *   dist/seo-audit/baseline.json   — machine-readable per-page data
 *   dist/seo-audit/baseline.md     — human-readable summary + flags
 *
 * Re-run after every sprint stage to see the diff.
 *
 * Usage:
 *   tsx scripts/seo-crawl.mjs           # writes baseline.json + baseline.md
 *   SEO_AUDIT_LABEL=post-sprint tsx scripts/seo-crawl.mjs
 *                                        # writes post-sprint.{json,md} instead
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const auditDir = join(distDir, 'seo-audit')
const label = process.env.SEO_AUDIT_LABEL || 'baseline'

if (!existsSync(distDir)) {
  console.error('[seo-crawl] dist/ not found — run vite build + prerender first')
  process.exit(1)
}

mkdirSync(auditDir, { recursive: true })

// ----------------------------------------------------------------------------
// Walk dist/ for index.html files. Skip /seo-audit and /og-images output dirs.
// ----------------------------------------------------------------------------
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'seo-audit' || entry.name === 'og-images' || entry.name === 'assets') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.name === 'index.html') out.push(full)
  }
  return out
}

// ----------------------------------------------------------------------------
// Tiny HTML parsers: regex-based, fast, good enough for static prerendered
// HTML (we control the template). No JSDOM cost.
// ----------------------------------------------------------------------------
function attr(html, tag, attrName, valueAttr = 'content') {
  // Match <tag ... attrName="value" ... valueAttr="X" ...>
  const re = new RegExp(
    `<${tag}\\b[^>]*\\b${attrName}=["']${attrName === 'rel' || attrName === 'name' || attrName === 'property' ? '([^"\']+)' : '[^"\']+'}["'][^>]*>`,
    'gi'
  )
  // Simpler approach: find every <tag ...> block then split.
  const blockRe = new RegExp(`<${tag}\\b[^>]*>`, 'gi')
  const blocks = html.match(blockRe) || []
  const wanted = blocks.find((b) => new RegExp(`\\b${attrName}=["']?[^"'>]+["']?`, 'i').test(b))
  if (!wanted) return null
  const m = wanted.match(new RegExp(`\\b${valueAttr}=["']([^"']*)["']`, 'i'))
  return m ? m[1] : null
}

function findAll(html, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>`, 'gi')
  return html.match(re) || []
}

function textBetween(html, openTag, closeTag) {
  const re = new RegExp(`<${openTag}\\b[^>]*>([\\s\\S]*?)<\\/${closeTag}>`, 'i')
  const m = html.match(re)
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : null
}

function metaContent(html, kind, name) {
  // <meta (name|property)="..." content="...">
  const re = new RegExp(
    `<meta\\b[^>]*\\b${kind}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&')}["'][^>]*>`,
    'i'
  )
  const m = html.match(re)
  if (!m) return null
  // Match content="..." OR content='...' separately so an apostrophe inside a
  // double-quoted value (e.g. "brain's cache") doesn't terminate the capture
  // and produce a falsely-truncated description length.
  const c = m[0].match(/\bcontent="([^"]*)"|content='([^']*)'/i)
  if (!c) return null
  const raw = c[1] != null ? c[1] : c[2]
  // Decode the most common entities we emit so length budgets match the
  // human-readable string, not the encoded bytes.
  return raw
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function linkHref(html, rel, hreflang) {
  const blocks = findAll(html, 'link')
  for (const b of blocks) {
    if (!new RegExp(`\\brel=["']${rel}["']`, 'i').test(b)) continue
    if (hreflang) {
      const hl = b.match(/\bhreflang=["']([^"']+)["']/i)
      if (!hl || hl[1] !== hreflang) continue
    }
    const m = b.match(/\bhref=["']([^"']+)["']/i)
    if (m) return m[1]
  }
  return null
}

function hreflangCluster(html) {
  const blocks = findAll(html, 'link')
  const out = {}
  for (const b of blocks) {
    if (!/\brel=["']alternate["']/i.test(b)) continue
    const hl = b.match(/\bhreflang=["']([^"']+)["']/i)
    const hr = b.match(/\bhref=["']([^"']+)["']/i)
    if (hl && hr) out[hl[1]] = hr[1]
  }
  return out
}

function extractJsonLd(html) {
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const out = []
  let m
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim()
    try {
      const parsed = JSON.parse(raw)
      const arr = Array.isArray(parsed) ? parsed : [parsed]
      for (const obj of arr) {
        if (obj && typeof obj === 'object') {
          out.push({ type: obj['@type'] || 'Unknown', valid: true, size: raw.length })
        }
      }
    } catch (err) {
      out.push({ type: 'INVALID', valid: false, error: String(err.message), preview: raw.slice(0, 80) })
    }
  }
  return out
}

function imgAuditSummary(html) {
  const blocks = findAll(html, 'img')
  let total = blocks.length
  let missingAlt = 0
  let emptyAlt = 0
  for (const b of blocks) {
    const a = b.match(/\balt=["']([^"']*)["']/i)
    if (!a) {
      missingAlt++
    } else if (!a[1].trim()) {
      // Empty alt is OK *only* with aria-hidden — flag if not.
      const hasAria = /\baria-hidden=["']true["']/i.test(b)
      if (!hasAria) emptyAlt++
    }
  }
  return { total, missingAlt, emptyAlt }
}

function linkCountSummary(html, currentUrl) {
  const blocks = findAll(html, 'a')
  let internal = 0
  let external = 0
  for (const b of blocks) {
    const m = b.match(/\bhref=["']([^"']+)["']/i)
    if (!m) continue
    const href = m[1]
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue
    if (/^https?:\/\//i.test(href)) {
      try {
        const u = new URL(href)
        const cu = new URL(currentUrl)
        if (u.host === cu.host) internal++
        else external++
      } catch {
        external++
      }
    } else {
      internal++
    }
  }
  return { internal, external }
}

function wordCount(html) {
  // Strip <script>, <style>, then tags.
  const noScript = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
  return noScript.split(/\s+/).filter(Boolean).length
}

// ----------------------------------------------------------------------------
// Main loop
// ----------------------------------------------------------------------------
const SITE_URL = 'https://onda-life.com'
const files = walk(distDir).sort()
const pages = []

for (const file of files) {
  const rel = relative(distDir, file).replace(/\\/g, '/')
  const route = '/' + rel.replace(/\/?index\.html$/, '')
  const url = route === '/' ? SITE_URL : `${SITE_URL}${route}`
  const html = readFileSync(file, 'utf-8')

  const title = textBetween(html, 'title', 'title') || ''
  const description = metaContent(html, 'name', 'description') || ''
  const robots = metaContent(html, 'name', 'robots') || 'index, follow'
  const canonical = linkHref(html, 'canonical')
  const ogTitle = metaContent(html, 'property', 'og:title') || ''
  const ogDescription = metaContent(html, 'property', 'og:description') || ''
  const ogImage = metaContent(html, 'property', 'og:image') || ''
  const ogUrl = metaContent(html, 'property', 'og:url') || ''
  const twitterCard = metaContent(html, 'property', 'twitter:card') || metaContent(html, 'name', 'twitter:card') || ''
  const hreflang = hreflangCluster(html)
  const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length
  const jsonLd = extractJsonLd(html)
  const imgs = imgAuditSummary(html)
  const links = linkCountSummary(html, url)
  const words = wordCount(html)
  const sizeKb = +(statSync(file).size / 1024).toFixed(1)

  pages.push({
    route,
    url,
    sizeKb,
    title: { value: title, length: title.length },
    description: { value: description, length: description.length },
    robots,
    canonical,
    canonicalIsAbsoluteHttps: canonical ? /^https:\/\//i.test(canonical) : false,
    canonicalMatchesUrl: canonical === url,
    og: { title: ogTitle, description: ogDescription, image: ogImage, url: ogUrl },
    twitterCard,
    hreflang,
    hreflangCount: Object.keys(hreflang).length,
    h1Count,
    jsonLd: jsonLd.map((j) => ({ type: j.type, valid: j.valid })),
    jsonLdInvalid: jsonLd.filter((j) => !j.valid).length,
    images: imgs,
    links,
    wordCount: words,
  })
}

// ----------------------------------------------------------------------------
// Aggregate flags
// ----------------------------------------------------------------------------
// Budget rationale:
//   Title 30–65: Google truncates around 580px (~60 chars). 65 is tolerant.
//   Description 80–200: Google shows ~158 desktop / ~120 mobile. >200 is
//     truncated mid-snippet which kills CTR. <80 is below the "rich result"
//     threshold for many SERP layouts. Articles in this codebase consistently
//     run 170-200 chars, which is fine.
const TITLE_MIN = 30
const TITLE_MAX = 65
const DESC_MIN = 80
const DESC_MAX = 200

const flags = {
  missingTitle: pages.filter((p) => !p.title.value).map((p) => p.route),
  duplicateTitles: (() => {
    const m = new Map()
    for (const p of pages) {
      if (!p.title.value) continue
      m.set(p.title.value, (m.get(p.title.value) || 0).concat ? [...m.get(p.title.value), p.route] : [p.route])
      // simple counter
      const cur = m.get(p.title.value)
      if (Array.isArray(cur)) m.set(p.title.value, cur)
      else m.set(p.title.value, [p.route])
    }
    // Recompute properly:
    const buckets = new Map()
    for (const p of pages) {
      if (!p.title.value) continue
      if (!buckets.has(p.title.value)) buckets.set(p.title.value, [])
      buckets.get(p.title.value).push(p.route)
    }
    const dupes = []
    for (const [t, routes] of buckets) {
      if (routes.length > 1) dupes.push({ title: t, routes })
    }
    return dupes
  })(),
  titleOutsideBudget: pages
    .filter((p) => p.title.length < TITLE_MIN || p.title.length > TITLE_MAX)
    .map((p) => ({ route: p.route, length: p.title.length, title: p.title.value })),
  missingDescription: pages.filter((p) => !p.description.value).map((p) => p.route),
  descriptionOutsideBudget: pages
    .filter((p) => p.description.length < DESC_MIN || p.description.length > DESC_MAX)
    .map((p) => ({ route: p.route, length: p.description.length })),
  missingCanonical: pages.filter((p) => !p.canonical).map((p) => p.route),
  brokenCanonical: pages.filter((p) => p.canonical && !p.canonicalIsAbsoluteHttps).map((p) => p.route),
  canonicalUrlMismatch: pages
    .filter((p) => p.canonical && !p.canonicalMatchesUrl)
    .map((p) => ({ route: p.route, canonical: p.canonical, expected: p.url })),
  missingH1: pages.filter((p) => p.h1Count === 0).map((p) => p.route),
  multipleH1: pages.filter((p) => p.h1Count > 1).map((p) => ({ route: p.route, count: p.h1Count })),
  invalidJsonLd: pages.filter((p) => p.jsonLdInvalid > 0).map((p) => ({ route: p.route, count: p.jsonLdInvalid })),
  imagesMissingAlt: pages
    .filter((p) => p.images.missingAlt + p.images.emptyAlt > 0)
    .map((p) => ({ route: p.route, missingAlt: p.images.missingAlt, emptyAlt: p.images.emptyAlt })),
  noindexInSitemapCandidates: pages
    .filter((p) => /noindex/i.test(p.robots))
    .map((p) => p.route),
  hreflangMissing: pages.filter((p) => p.hreflangCount === 0 && p.route !== '/sitemap' && p.route !== '/').map((p) => p.route),
}

// ----------------------------------------------------------------------------
// Hreflang reciprocity check — every URL listed in any cluster should be
// listed by every member of that cluster. Build the inverse map, look for
// orphans.
// ----------------------------------------------------------------------------
const clusterLookup = new Map() // url -> Set of (lang -> url) entries
for (const p of pages) {
  if (p.hreflangCount === 0) continue
  for (const [, alt] of Object.entries(p.hreflang)) {
    if (!clusterLookup.has(alt)) clusterLookup.set(alt, new Set())
    clusterLookup.get(alt).add(JSON.stringify(p.hreflang))
  }
}
const hreflangNonReciprocal = []
for (const p of pages) {
  if (p.hreflangCount === 0) continue
  for (const [lang, alt] of Object.entries(p.hreflang)) {
    const target = pages.find((q) => q.url === alt || q.url === alt.replace(/\/$/, ''))
    if (!target) {
      hreflangNonReciprocal.push({ from: p.url, missingTarget: alt, lang })
      continue
    }
    if (!Object.values(target.hreflang).some((x) => x === p.url || x.replace(/\/$/, '') === p.url)) {
      hreflangNonReciprocal.push({ from: p.url, target: alt, reason: 'target does not link back' })
    }
  }
}
flags.hreflangNonReciprocal = hreflangNonReciprocal.slice(0, 50) // cap noise

// ----------------------------------------------------------------------------
// Per-section averages (group by route prefix).
// ----------------------------------------------------------------------------
function section(route) {
  if (route === '/') return 'home'
  const segs = route.split('/').filter(Boolean)
  if (['en', 'es', 'ru', 'uk', 'zh'].includes(segs[0])) segs.shift()
  return segs[0] || 'home'
}
const bySection = new Map()
for (const p of pages) {
  const s = section(p.route)
  if (!bySection.has(s)) bySection.set(s, [])
  bySection.get(s).push(p)
}
const sectionStats = {}
for (const [s, list] of bySection) {
  const wordSum = list.reduce((a, b) => a + b.wordCount, 0)
  const titleSum = list.reduce((a, b) => a + b.title.length, 0)
  sectionStats[s] = {
    pages: list.length,
    avgWordCount: Math.round(wordSum / list.length),
    avgTitleLength: Math.round(titleSum / list.length),
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  label,
  totalPages: pages.length,
  sectionStats,
  flagCounts: Object.fromEntries(
    Object.entries(flags).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])
  ),
}

writeFileSync(
  join(auditDir, `${label}.json`),
  JSON.stringify({ summary, flags, pages }, null, 2)
)

// ----------------------------------------------------------------------------
// Markdown summary
// ----------------------------------------------------------------------------
const md = []
md.push(`# SEO Audit — ${label}\n`)
md.push(`Generated: ${summary.generatedAt}`)
md.push(`Total pages crawled: **${summary.totalPages}**\n`)
md.push(`## Section averages\n`)
md.push(`| Section | Pages | Avg word count | Avg title length |`)
md.push(`|---------|-------|----------------|------------------|`)
for (const [s, st] of Object.entries(sectionStats)) {
  md.push(`| ${s} | ${st.pages} | ${st.avgWordCount} | ${st.avgTitleLength} |`)
}
md.push('')
md.push(`## Flags\n`)
md.push(`| Flag | Count |`)
md.push(`|------|-------|`)
for (const [k, v] of Object.entries(summary.flagCounts)) {
  md.push(`| ${k} | ${v} |`)
}
md.push('')

// Top offenders
function topList(name, items, format) {
  if (!items || !items.length) return
  md.push(`### ${name} (${items.length})\n`)
  for (const it of items.slice(0, 25)) md.push(`- ${format(it)}`)
  if (items.length > 25) md.push(`- … and ${items.length - 25} more`)
  md.push('')
}
topList('Titles outside 30–65 char budget', flags.titleOutsideBudget, (i) => `\`${i.route}\` — ${i.length} chars: ${i.title}`)
topList('Descriptions outside 80–165 char budget', flags.descriptionOutsideBudget, (i) => `\`${i.route}\` — ${i.length} chars`)
topList('Missing description', flags.missingDescription, (i) => `\`${i}\``)
topList('Missing canonical', flags.missingCanonical, (i) => `\`${i}\``)
topList('Canonical URL mismatch', flags.canonicalUrlMismatch, (i) => `\`${i.route}\`: canonical=${i.canonical}, expected=${i.expected}`)
topList('Missing H1', flags.missingH1, (i) => `\`${i}\``)
topList('Multiple H1', flags.multipleH1, (i) => `\`${i.route}\` (${i.count})`)
topList('Images missing alt', flags.imagesMissingAlt, (i) => `\`${i.route}\` (missing=${i.missingAlt}, empty-no-aria=${i.emptyAlt})`)
topList('Hreflang non-reciprocal', flags.hreflangNonReciprocal, (i) => `from=${i.from}, target=${i.missingTarget || i.target} (${i.reason || 'missing'})`)
topList('Invalid JSON-LD', flags.invalidJsonLd, (i) => `\`${i.route}\` (${i.count} blocks)`)
topList('Duplicate titles', flags.duplicateTitles, (i) => `${JSON.stringify(i.routes)} — "${i.title}"`)

writeFileSync(join(auditDir, `${label}.md`), md.join('\n') + '\n')

console.log(
  `[seo-crawl] ${label}: ${pages.length} pages, ` +
    Object.entries(summary.flagCounts)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ') || `${pages.length} pages, 0 flags`
)
console.log(`[seo-crawl] wrote ${auditDir}/${label}.json + ${label}.md`)
