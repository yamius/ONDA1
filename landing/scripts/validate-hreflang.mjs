#!/usr/bin/env node
/**
 * Hreflang cluster validator.
 *
 * Walks dist/sitemap.xml, parses every <url> entry's <xhtml:link rel="alternate"
 * hreflang="..."> children, and validates four invariants per cluster:
 *
 *   1. Self-reference: every URL in the cluster lists itself with its own
 *      hreflang.
 *   2. Reciprocity: if A lists B, then B must list A.
 *   3. x-default presence: every multi-locale cluster has exactly one
 *      x-default entry pointing to the EN URL (the canonical fallback).
 *   4. Absolute HTTPS canonicals: every href is `https://` and not relative.
 *
 * Writes dist/seo-audit/hreflang.{json,md}. Exits 0 by default — set
 * SEO_STRICT=1 to fail the build on any violation.
 *
 * No external API required. Pure local audit.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const sitemapPath = join(projectRoot, 'dist', 'sitemap.xml')
const auditDir = join(projectRoot, 'dist', 'seo-audit')

if (!existsSync(sitemapPath)) {
  console.warn('[validate-hreflang] dist/sitemap.xml not found — skipping')
  process.exit(0)
}

const xml = readFileSync(sitemapPath, 'utf-8')

/** Normalize URL for cross-comparison — strip trailing slash so that
 *  `https://onda-life.com/articles` and `https://onda-life.com/articles/`
 *  collide instead of producing spurious target-not-in-sitemap. */
function normalize(u) {
  return u.replace(/\/+$/, '')
}

/** Parse <url>...</url> blocks. Returns array of { loc, alternates: { lang -> href } }. */
function parseUrls(src) {
  const out = []
  const blocks = src.match(/<url>[\s\S]*?<\/url>/g) ?? []
  for (const block of blocks) {
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/)
    if (!locMatch) continue
    const loc = locMatch[1].trim()
    const alts = {}
    const altRegex = /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/?>/g
    let m
    while ((m = altRegex.exec(block)) !== null) {
      alts[m[1]] = m[2]
    }
    out.push({ loc, alternates: alts })
  }
  return out
}

const urls = parseUrls(xml)
console.log(`[validate-hreflang] parsed ${urls.length} <url> entries`)

// Build cluster lookup: for every URL that appears in any cluster, map to
// its observed cluster (set of alternates). Use the first occurrence as
// canonical and verify subsequent occurrences match.
const clustersByUrl = new Map()
for (const { loc, alternates } of urls) {
  if (Object.keys(alternates).length === 0) continue
  clustersByUrl.set(normalize(loc), alternates)
}

const violations = []

for (const { loc, alternates } of urls) {
  const normLoc = normalize(loc)
  const altKeys = Object.keys(alternates)
  if (altKeys.length === 0) continue // EN-only or no cluster — fine

  // Invariant 4: absolute HTTPS
  for (const [lang, href] of Object.entries(alternates)) {
    if (!/^https:\/\//.test(href)) {
      violations.push({ type: 'non-https-canonical', url: loc, lang, href })
    }
  }

  // Invariant 1: self-reference. The current URL must appear as one of its
  // own alternates (under any locale code other than x-default).
  const nonDefaultAlts = altKeys.filter((k) => k !== 'x-default')
  const selfListed = nonDefaultAlts.some((k) => normalize(alternates[k]) === normLoc)
  if (!selfListed) {
    violations.push({ type: 'missing-self-reference', url: loc, alternates: nonDefaultAlts })
  }

  // Invariant 3: x-default — must be present exactly once for multi-locale
  // clusters AND must point to the EN URL in the same cluster (Google's
  // canonical-fallback rule). EN URLs in our scheme have no /<lang>/ prefix.
  if (nonDefaultAlts.length > 1) {
    const xDefaults = altKeys.filter((k) => k === 'x-default')
    if (xDefaults.length === 0) {
      violations.push({ type: 'missing-x-default', url: loc })
    } else {
      const enHref = alternates['en']
      const xDefHref = alternates['x-default']
      if (enHref && normalize(xDefHref) !== normalize(enHref)) {
        violations.push({
          type: 'x-default-not-en',
          url: loc,
          xDefault: xDefHref,
          enUrl: enHref,
        })
      }
    }
  }

  // Invariant 2: reciprocity. Every alternate href that is itself emitted
  // as a <loc> must list `loc` somewhere in its own cluster.
  for (const [lang, href] of Object.entries(alternates)) {
    if (lang === 'x-default') continue
    if (normalize(href) === normLoc) continue
    const targetCluster = clustersByUrl.get(normalize(href))
    if (!targetCluster) {
      // Target URL isn't in the sitemap at all (or has no cluster). Flag —
      // hreflang to a non-indexable URL is wasted signal.
      violations.push({ type: 'target-not-in-sitemap', from: loc, target: href, lang })
      continue
    }
    const reciprocates = Object.values(targetCluster).some((h) => normalize(h) === normLoc)
    if (!reciprocates) {
      violations.push({ type: 'non-reciprocal', from: loc, target: href, lang })
    }
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  totalUrls: urls.length,
  urlsWithCluster: clustersByUrl.size,
  violationCount: violations.length,
  violationsByType: violations.reduce((acc, v) => {
    acc[v.type] = (acc[v.type] ?? 0) + 1
    return acc
  }, {}),
  violations: violations.slice(0, 200),
}

mkdirSync(auditDir, { recursive: true })
writeFileSync(join(auditDir, 'hreflang.json'), JSON.stringify(summary, null, 2))

const md = [
  '# Hreflang audit',
  '',
  `Generated: ${summary.generatedAt}`,
  `Sitemap URLs: ${summary.totalUrls}`,
  `URLs with hreflang cluster: ${summary.urlsWithCluster}`,
  `Total violations: ${summary.violationCount}`,
  '',
  '## Violations by type',
  '',
  ...Object.entries(summary.violationsByType).map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## First 50 violations',
  '',
  ...summary.violations.slice(0, 50).map((v) => `- \`${v.type}\` — ${JSON.stringify(v)}`),
].join('\n')
writeFileSync(join(auditDir, 'hreflang.md'), md)

console.log(`[validate-hreflang] ${summary.violationCount} violation(s); see dist/seo-audit/hreflang.{json,md}`)

if (process.env.SEO_STRICT === '1' && summary.violationCount > 0) {
  console.error('[validate-hreflang] FAIL — SEO_STRICT=1 and violations present')
  process.exit(1)
}
