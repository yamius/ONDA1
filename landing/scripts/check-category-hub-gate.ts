/**
 * Simulates future daily rebuilds and checks the localized category hubs:
 *  - a hub /<lang>/reviews/<category-url-slug> exists only on/after its queue date;
 *  - the hub's child links (reviews / round-up / duels in that category) are exactly the
 *    children prerendered in that language on that date — so each new translated review
 *    appears on the hub automatically when its queue date is reached.
 * The hub page computes its links from LOCALIZED_COVERAGE, which is generated from
 * LOCALIZED_REVIEW_ROUTE_SET — this script checks that route set at each simulated date.
 *
 *   npx tsx scripts/check-category-hub-gate.ts
 */
import { execFileSync } from 'child_process'
import { RELEASE_QUEUE_ENTRIES } from './article-release-queue'
import { reviews, comparisons, headToHeads, getCategoryByUrlSlug } from '../src/data/reviews'

const hubs = RELEASE_QUEUE_ENTRIES.filter((e) => e.collection === ('categoryHubs' as never))
if (!hubs.length) {
  console.log('[hub-gate] no categoryHubs in the release queue — nothing to check')
  process.exit(0)
}

/** Route set at a simulated build date (fresh process: BUILD_DATE is read at import). */
function routesAt(date: string): Set<string> {
  const out = execFileSync(
    process.execPath,
    ['--import', 'tsx', '-e', "import('./scripts/prerender-routes.ts').then(m=>process.stdout.write(JSON.stringify([...m.LOCALIZED_REVIEW_ROUTE_SET])))"],
    { env: { ...process.env, ONDA_BUILD_DATE: date }, maxBuffer: 64 << 20 },
  ).toString()
  return new Set(JSON.parse(out) as string[])
}

let failed = 0
const fail = (m: string) => { failed++; console.error(`  FAIL ${m}`) }
const prev = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) - 864e5).toISOString().slice(0, 10)

for (const hub of hubs) {
  const cat = getCategoryByUrlSlug(hub.slug)
  if (!cat) { fail(`${hub.slug}: not a category URL slug`); continue }
  const children = [
    ...reviews.filter((r) => r.category === cat).map((r) => `/${hub.lang}/reviews/${r.slug}`),
    ...comparisons.filter((c) => c.category === cat).map((c) => `/${hub.lang}/reviews/compare/${c.slug}`),
  ]
  const catSlugs = new Set(reviews.filter((r) => r.category === cat).map((r) => r.slug))
  for (const h of headToHeads) {
    if (catSlugs.has(h.productASlug) && catSlugs.has(h.productBSlug) && (!h.productCSlug || catSlugs.has(h.productCSlug)))
      children.push(`/${hub.lang}/reviews/vs/${h.slug}`)
  }
  // Dates to simulate: the day before the hub, the hub date, and every child release date after it.
  const childDates = RELEASE_QUEUE_ENTRIES.filter((e) => e.lang === hub.lang && children.some((c) => c.endsWith(`/${e.slug}`))).map((e) => e.publishOn)
  const today = new Date().toISOString().slice(0, 10)
  const dates = [...new Set([today, ...childDates.filter((d) => d > today && d < hub.publishOn).slice(0, 3), prev(hub.publishOn), hub.publishOn, ...childDates.filter((d) => d > hub.publishOn)])].sort()
  console.log(`[hub-gate] ${hub.lang} /reviews/${hub.slug} (queue ${hub.publishOn}) — dates ${dates.join(', ')}`)
  let lastLinks = -1
  for (const d of dates) {
    const set = routesAt(d)
    const hubRoute = `/${hub.lang}/reviews/${hub.slug}`
    const live = d >= hub.publishOn
    if (set.has(hubRoute) !== live) fail(`${d}: hub route ${live ? 'missing' : 'present before its date'}`)
    const links = children.filter((c) => set.has(c))
    for (const e of RELEASE_QUEUE_ENTRIES.filter((e) => e.lang === hub.lang && e.publishOn <= d))
      for (const c of children) if (c.endsWith(`/${e.slug}`) && !set.has(c)) fail(`${d}: ${c} released by queue but not linked`)
    if (live && links.length < lastLinks) fail(`${d}: link count went down`)
    lastLinks = links.length
    console.log(`  ${d}: hub ${set.has(hubRoute) ? 'live' : 'absent'}, ${links.length} child link(s)`)
  }
}
if (failed) {
  console.error(`[hub-gate] ${failed} failure(s)`)
  process.exit(1)
}
console.log('[hub-gate] OK')
