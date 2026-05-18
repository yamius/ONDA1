/**
 * Build-time guard: walk every prerendered HTML page and fail the build on
 * structural SEO regressions —
 *   - invalid JSON-LD (a syntax error silently kills rich results)
 *   - missing / duplicated <link rel="canonical">
 *   - an hreflang cluster with no x-default entry
 *
 * Runs as the last build stage, after prerender. Conservative by design: it
 * only flags genuine defects, so a green run is a real signal.
 */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const DIST = 'dist'
const files = readdirSync(DIST, { recursive: true })
  .filter((f) => typeof f === 'string' && f.endsWith('index.html'))
  .map((f) => join(DIST, f))

const errors = []
for (const file of files) {
  const html = readFileSync(file, 'utf-8')

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1])
    } catch {
      errors.push(`${file} — invalid JSON-LD block`)
    }
  }

  const canonical = html.match(/<link[^>]+rel="canonical"[^>]*>/g) ?? []
  if (canonical.length !== 1) {
    errors.push(`${file} — ${canonical.length} canonical tag(s), expected exactly 1`)
  }

  const hreflangs = [...html.matchAll(/hreflang="([^"]+)"/g)].map((m) => m[1])
  if (hreflangs.length > 0 && !hreflangs.includes('x-default')) {
    errors.push(`${file} — hreflang cluster without an x-default entry`)
  }
}

if (errors.length > 0) {
  console.error(`[validate-seo] FAIL — ${errors.length} issue(s) across ${files.length} pages:`)
  errors.slice(0, 25).forEach((e) => console.error('  ' + e))
  if (errors.length > 25) console.error(`  …and ${errors.length - 25} more`)
  process.exit(1)
}
console.log(`[validate-seo] OK — ${files.length} pages: JSON-LD, canonical and hreflang clean`)
