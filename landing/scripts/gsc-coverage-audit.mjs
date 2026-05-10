#!/usr/bin/env node
/**
 * GSC Coverage Audit
 *
 * Runs Google Search Console URL Inspection API on every URL in
 * dist/sitemap.xml, groups by indexability status, and writes a
 * prioritised action list to dist/seo-audit/gsc-coverage.{json,md}.
 *
 * What it answers in one run:
 *   - How many of our 544+ URLs are actually in Google's index?
 *   - Which ones are "Discovered, not indexed" (top priority for manual
 *     GSC URL-Inspection submission)?
 *   - Which ones are "Crawled, not indexed" (content-quality issue —
 *     fix the page, do not just resubmit)?
 *   - Which ones are excluded for technical / canonical reasons?
 *
 * Setup (one-time):
 *   1. Google Cloud Console → enable Search Console API
 *   2. Create a service account, generate a JSON key
 *   3. Search Console → Settings → Users → add the service account email
 *      as Owner (URL Inspection API requires Owner, not Full)
 *   4. Place the JSON at landing/.cache/gsc-credentials.json (or set
 *      GSC_CREDENTIALS_PATH env var)
 *
 * Usage:
 *   npm --prefix landing run audit:gsc
 *
 * Cost / limits:
 *   - 2,000 inspection calls/day per Google Cloud project (free tier)
 *   - ~600 requests/minute throttle — script paces 200 ms/request to stay
 *     well below the rate limit
 *   - 544 URLs ≈ 110 seconds total wall-clock time
 *
 * The script is intentionally NOT wired into the main build pipeline.
 * Run it manually (or via a separate weekly cron) when you want a fresh
 * coverage snapshot.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { JWT } from 'google-auth-library'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const sitemapPath = join(distDir, 'sitemap.xml')
const auditDir = join(distDir, 'seo-audit')

// Search Console URL Inspection accepts EITHER:
//   - URL-prefix property:  'https://onda-life.com/'
//   - Domain property:      'sc-domain:onda-life.com'
// onda-life.com is verified as a URL-prefix property; default matches that.
// Override at runtime via env (e.g. when adding a new sc-domain property).
const SITE_PROPERTY = process.env.GSC_SITE_PROPERTY || 'https://onda-life.com/'
const REQUEST_DELAY_MS = 200
const ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'

const credsPath =
  process.env.GSC_CREDENTIALS_PATH ||
  join(__dirname, '..', '.cache', 'gsc-credentials.json')

if (!existsSync(credsPath)) {
  console.log(`[gsc-audit] credentials not found at ${credsPath}`)
  console.log('[gsc-audit] set GSC_CREDENTIALS_PATH env var or place service-account JSON at .cache/gsc-credentials.json')
  console.log('[gsc-audit] see scripts/gsc-coverage-audit.mjs header for setup steps')
  process.exit(0)
}

if (!existsSync(sitemapPath)) {
  console.log('[gsc-audit] dist/sitemap.xml not found — run `npm run build` first, skipping')
  process.exit(0)
}

// 1. Auth via service-account JSON
const creds = JSON.parse(readFileSync(credsPath, 'utf-8'))
const auth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
})

// 2. Read URLs from prerendered sitemap.xml — one source of truth.
const xml = readFileSync(sitemapPath, 'utf-8')
const urls = []
const locRe = /<loc>([^<]+)<\/loc>/g
let m
while ((m = locRe.exec(xml)) !== null) urls.push(m[1])
if (urls.length === 0) {
  console.log('[gsc-audit] no <loc> entries in sitemap.xml, skipping')
  process.exit(0)
}

console.log(`[gsc-audit] property: ${SITE_PROPERTY}`)
console.log(`[gsc-audit] inspecting ${urls.length} URL(s) — paced at ${REQUEST_DELAY_MS}ms/request, ETA ~${Math.ceil((urls.length * REQUEST_DELAY_MS) / 1000)}s`)

/**
 * Fetch a fresh-or-cached access token from the JWT client. google-auth-
 * library caches the token internally and auto-refreshes when expired,
 * so calling this per request is cheap — the cache hit path is ~microseconds.
 * Empirically the old code (cache token once at start) saw 401s after
 * ~500 requests despite the JWT being valid for 1h — possibly Google's
 * rate-window invalidating reused tokens, possibly a Replit/Windows
 * environment quirk. Calling getAccessToken() each time sidesteps it.
 */
async function bearerToken() {
  const t = await auth.getAccessToken()
  const tok = typeof t === 'string' ? t : t?.token
  if (!tok) throw new Error('failed to obtain access token from JWT — check credentials')
  return tok
}

// Smoke check at startup — fail fast if the JSON is invalid before we
// fire 589 requests at the API.
await bearerToken()

// 3. Inspect each URL. Tolerate per-URL failures so one 4xx doesn't
//    abort the whole run. Auto-retry once on 401/429 with a fresh token.
async function inspectOne(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const accessToken = await bearerToken()
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: SITE_PROPERTY,
        languageCode: 'en-US',
      }),
    })
    if (res.ok) return { ok: true, data: await res.json() }
    // Retry once on auth / rate hiccups; treat anything else as final.
    if (attempt === 0 && (res.status === 401 || res.status === 429)) {
      await new Promise((r) => setTimeout(r, 1000))
      continue
    }
    return { ok: false, status: res.status, data: await res.json().catch(() => ({})) }
  }
  return { ok: false, status: 0, data: {} } // unreachable
}

const results = []
let failures = 0
for (let i = 0; i < urls.length; i++) {
  const url = urls[i]
  try {
    const r = await inspectOne(url)
    if (!r.ok) {
      failures++
      if (failures <= 5) {
        console.warn(
          `[gsc-audit] ${url} -> ${r.status} ${(r.data?.error?.message || '').slice(0, 120)}`,
        )
      } else if (failures === 6) {
        console.warn('[gsc-audit] ... further per-URL failures suppressed (will summarise at end)')
      }
      continue
    }
    const data = r.data
    const idx = data.inspectionResult?.indexStatusResult || {}
    results.push({
      url,
      verdict: idx.verdict || 'UNKNOWN',
      coverageState: idx.coverageState || 'unknown',
      lastCrawlTime: idx.lastCrawlTime || null,
      pageFetchState: idx.pageFetchState || null,
      indexingState: idx.indexingState || null,
      googleCanonical: idx.googleCanonical || null,
      userCanonical: idx.userCanonical || null,
      robotsTxtState: idx.robotsTxtState || null,
      crawledAs: idx.crawledAs || null,
    })
  } catch (e) {
    failures++
    if (failures <= 5) console.warn(`[gsc-audit] ${url} fetch error: ${e.message}`)
  }

  if ((i + 1) % 50 === 0) {
    console.log(`[gsc-audit] ... ${i + 1}/${urls.length} (${results.length} ok, ${failures} fail)`)
  }
  await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS))
}

// 4. Bucket by GSC coverageState. The strings are user-facing labels and
//    Google has changed them historically — match loosely on substrings.
//    Order matters: 'unknown to google' must come BEFORE the catch-all
//    so it lands in its own bucket rather than the unmatched pile.
const buckets = {
  indexed: [],
  discoveredNotIndexed: [],
  unknownToGoogle: [],
  crawledNotIndexed: [],
  excludedCanonical: [],
  excludedOther: [],
  errors: [],
}
for (const r of results) {
  const c = (r.coverageState || '').toLowerCase()
  if (
    c.includes('submitted and indexed') ||
    c.includes('indexed, not submitted') ||
    c === 'valid'
  ) {
    buckets.indexed.push(r)
  } else if (c.includes('unknown to google')) {
    // "URL is unknown to Google" — Google has never crawled this URL.
    // Different from 'discovered' (where Google knows the URL but chose
    // not to index yet). Common causes: sitemap not yet refetched after
    // a deploy, no internal links from indexed pages, or recent
    // domain/path changes that haven't propagated.
    buckets.unknownToGoogle.push(r)
  } else if (c.includes('discovered')) {
    buckets.discoveredNotIndexed.push(r)
  } else if (c.includes('crawled')) {
    buckets.crawledNotIndexed.push(r)
  } else if (c.includes('canonical') || c.includes('duplicate')) {
    buckets.excludedCanonical.push(r)
  } else if (c.includes('excluded') || c.includes('not found') || c.includes('blocked')) {
    buckets.excludedOther.push(r)
  } else {
    buckets.errors.push(r)
  }
}

const total = results.length
const stats = {
  total,
  indexed: buckets.indexed.length,
  discoveredNotIndexed: buckets.discoveredNotIndexed.length,
  unknownToGoogle: buckets.unknownToGoogle.length,
  crawledNotIndexed: buckets.crawledNotIndexed.length,
  excludedCanonical: buckets.excludedCanonical.length,
  excludedOther: buckets.excludedOther.length,
  errors: buckets.errors.length,
  apiFailures: failures,
}

const pct = (n) => (total ? Math.round((n / total) * 100) : 0)

console.log('')
console.log(`[gsc-audit] ✅ Indexed: ${stats.indexed}/${total} (${pct(stats.indexed)}%)`)
console.log(`[gsc-audit] 🟡 Discovered, not indexed: ${stats.discoveredNotIndexed}/${total} (${pct(stats.discoveredNotIndexed)}%)`)
console.log(`[gsc-audit] 🔵 Unknown to Google: ${stats.unknownToGoogle}/${total} (${pct(stats.unknownToGoogle)}%)`)
console.log(`[gsc-audit] 🔴 Crawled, not indexed: ${stats.crawledNotIndexed}/${total} (${pct(stats.crawledNotIndexed)}%)`)
console.log(`[gsc-audit] ⚪ Excluded (canonical / duplicate): ${stats.excludedCanonical}/${total} (${pct(stats.excludedCanonical)}%)`)
console.log(`[gsc-audit] ⚫ Excluded (other / blocked): ${stats.excludedOther}/${total} (${pct(stats.excludedOther)}%)`)
console.log(`[gsc-audit] ❓ Other: ${stats.errors}/${total} (${pct(stats.errors)}%)`)
if (failures > 0) console.log(`[gsc-audit] ⚠ API failures: ${failures}`)

// 5. Write outputs
mkdirSync(auditDir, { recursive: true })

writeFileSync(
  join(auditDir, 'gsc-coverage.json'),
  JSON.stringify(
    { stats, results, generatedAt: new Date().toISOString(), property: SITE_PROPERTY },
    null,
    2,
  ),
)

const md = buildMarkdown(stats, buckets, total)
writeFileSync(join(auditDir, 'gsc-coverage.md'), md)

console.log('')
console.log('[gsc-audit] Wrote dist/seo-audit/gsc-coverage.{json,md}')

if (buckets.discoveredNotIndexed.length > 0) {
  console.log('')
  console.log('[gsc-audit] 🟡 Top URLs to manually request indexing in GSC:')
  for (const r of buckets.discoveredNotIndexed.slice(0, 10)) {
    console.log(`  - ${r.url}`)
  }
  if (buckets.discoveredNotIndexed.length > 10) {
    console.log(`  …and ${buckets.discoveredNotIndexed.length - 10} more in gsc-coverage.md`)
  }
}

function buildMarkdown(stats, buckets, total) {
  const out = []
  const ts = new Date().toISOString()
  out.push(`# GSC Coverage Audit\n`)
  out.push(`*Generated ${ts}*`)
  out.push(`*Property: ${SITE_PROPERTY}*`)
  out.push(``)
  out.push(`## Summary`)
  out.push(``)
  out.push(`| Bucket | Count | % |`)
  out.push(`|---|---:|---:|`)
  out.push(`| ✅ Indexed | ${stats.indexed} | ${pct(stats.indexed)}% |`)
  out.push(`| 🟡 Discovered, not indexed | ${stats.discoveredNotIndexed} | ${pct(stats.discoveredNotIndexed)}% |`)
  out.push(`| 🔵 Unknown to Google | ${stats.unknownToGoogle} | ${pct(stats.unknownToGoogle)}% |`)
  out.push(`| 🔴 Crawled, not indexed | ${stats.crawledNotIndexed} | ${pct(stats.crawledNotIndexed)}% |`)
  out.push(`| ⚪ Excluded (canonical / duplicate) | ${stats.excludedCanonical} | ${pct(stats.excludedCanonical)}% |`)
  out.push(`| ⚫ Excluded (other / blocked) | ${stats.excludedOther} | ${pct(stats.excludedOther)}% |`)
  out.push(`| ❓ Other / unknown | ${stats.errors} | ${pct(stats.errors)}% |`)
  out.push(`| **Total inspected** | **${total}** | **100%** |`)
  if (stats.apiFailures > 0) {
    out.push(``)
    out.push(`> ⚠ ${stats.apiFailures} API call(s) failed — those URLs are excluded from the totals above. Re-run when quota resets.`)
  }
  out.push(``)

  if (buckets.unknownToGoogle.length > 0) {
    out.push(`## 🔵 Unknown to Google — never crawled`)
    out.push(``)
    out.push(`Google has never seen these URLs. Different from "Discovered, not indexed" — Google here does not even know the URL exists. Typical causes:`)
    out.push(``)
    out.push(`- Sitemap.xml not yet refetched after the most recent deploy (Google fetches on its own schedule, typically every 1–7 days)`)
    out.push(`- No internal links from indexed pages — Google has no way to reach the URL through crawl`)
    out.push(`- Recently added URLs (topic hubs, image sitemap entries, locale variants) before the next sitemap refresh`)
    out.push(``)
    out.push(`**Action:** open Search Console → Sitemaps and click "View report" on /sitemap.xml. If "Last read" is older than the last deploy, click "Submit a refreshed copy". Then re-run this audit in 24–48 hours; most should flip to Discovered or Indexed without further action.`)
    out.push(``)
    for (const r of buckets.unknownToGoogle) out.push(`- ${r.url}`)
    out.push(``)
  }

  if (buckets.discoveredNotIndexed.length > 0) {
    out.push(`## 🟡 Discovered, not indexed — top priority for manual submission`)
    out.push(``)
    out.push(`Google knows these URLs (from sitemap or internal links) but has decided not to index them yet. Manual *Inspect URL → Request indexing* in GSC can short-circuit the queue.`)
    out.push(`GSC web UI quota: ~10 URL submissions per day per property.`)
    out.push(``)
    for (const r of buckets.discoveredNotIndexed) out.push(`- ${r.url}`)
    out.push(``)
  }

  if (buckets.crawledNotIndexed.length > 0) {
    out.push(`## 🔴 Crawled, not indexed — content-quality issue`)
    out.push(``)
    out.push(`Google fetched these URLs but excluded them. Typical causes: thin content, duplicate of another URL, low quality in Google's view, or the page lacks a clear unique value. **Do not just re-submit** — improve the page first (more body content, better title/description, unique angle) then re-submit.`)
    out.push(``)
    for (const r of buckets.crawledNotIndexed) {
      const last = r.lastCrawlTime ? `last crawl ${r.lastCrawlTime.slice(0, 10)}` : 'no last-crawl date'
      out.push(`- ${r.url} — ${last}`)
    }
    out.push(``)
  }

  if (buckets.excludedCanonical.length > 0) {
    out.push(`## ⚪ Excluded — duplicate or canonical mismatch`)
    out.push(``)
    out.push(`Google chose a different canonical for these URLs. If the chosen canonical is wrong (not what we declared), check our \`<link rel=canonical>\` and hreflang clusters.`)
    out.push(``)
    for (const r of buckets.excludedCanonical) {
      const gc = r.googleCanonical || 'n/a'
      out.push(`- ${r.url} → Google canonical: \`${gc}\``)
    }
    out.push(``)
  }

  if (buckets.excludedOther.length > 0) {
    out.push(`## ⚫ Excluded — other / blocked`)
    out.push(``)
    out.push(`Includes 404, robots.txt blocks, noindex meta. Audit each — most are intentional but check for accidents.`)
    out.push(``)
    for (const r of buckets.excludedOther) {
      out.push(`- ${r.url} — \`${r.coverageState}\``)
    }
    out.push(``)
  }

  if (buckets.errors.length > 0) {
    out.push(`## ❓ Unmatched coverage states`)
    out.push(``)
    out.push(`URLs whose returned coverageState didn't match any known bucket. Inspect manually — Google may have added new states.`)
    out.push(``)
    for (const r of buckets.errors.slice(0, 30)) {
      out.push(`- ${r.url} — \`${r.coverageState}\``)
    }
    out.push(``)
  }

  out.push(`## Suggested cadence`)
  out.push(``)
  out.push(`Run weekly. Track Indexed % over time as the primary KPI. Spike in *Crawled, not indexed* = recent content-quality regression. Spike in *Discovered, not indexed* = sitemap delivery issue or low domain authority.`)
  out.push(``)
  return out.join('\n')
}
