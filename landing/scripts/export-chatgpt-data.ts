/**
 * Data export for the ONDA ChatGPT app (../chatgpt-app). The app never carries
 * its own copy of site facts — everything is generated from the site sources:
 *   data/reviews.json     ← src/data/reviews (compare tool)
 *   data/practices.json   ← src/data/adaptivePractices.ts + data/practice-tags.json (find_practice)
 *   lib/generated/*.js    ← src/data/hrv-norms.ts, src/data/breathing.ts (check_hrv, breathe_now)
 *
 *   npx tsx scripts/export-chatgpt-data.ts
 *
 * Re-run after changing reviews, practices, HRV norms or breathing patterns.
 *
 * Reviews: two fields are not in the review data and are set here by hand:
 *  - hrvMetric: what the device's own app reports. 'unknown' when our review
 *    text and the maker's docs we checked don't say — never guess.
 *  - worksWithOnda: the baseline reads HRV (SDNN type) and resting HR from Apple
 *    Health with no source filter (HealthKitHeartRatePlugin.swift), so other
 *    wearables count when their app syncs heart data to Apple Health → 'partly'.
 *    Live coherence is Apple-Watch-only; the camera pulse works on any iPhone.
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSync } from 'esbuild'
import { reviews, headToHeads, comparisons, CATEGORY_URL_SLUGS, scoreComparison } from '../src/data/reviews'
import { ADAPTIVE_PRACTICES } from '../src/data/adaptivePractices'

const SITE = 'https://onda-life.com'
const LANDING = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const APP = resolve(LANDING, '../chatgpt-app')
const OUT = resolve(APP, 'data/reviews.json')

type HrvMetric = 'SDNN' | 'RMSSD' | 'SDNN+RMSSD' | 'RR-intervals' | 'unknown'

/** Only wearables. Sources: our review text (Apple Watch, Oura, Ultrahuman,
 *  Amazfit) and the makers' published HRV docs (Whoop, Garmin, Fitbit). */
const HRV_METRIC: Record<string, HrvMetric> = {
  'apple-watch-series-11': 'SDNN',
  'apple-watch-series-12': 'SDNN+RMSSD', // Overall HRV (SDNN) + Recovery HRV (RMSSD)
  'apple-watch-ultra-4': 'SDNN+RMSSD',
  'oura-ring-4': 'RMSSD',
  'oura-ring-5': 'RMSSD',
  'whoop-5-0': 'RMSSD',
  'garmin-venu-4': 'RMSSD',
  'garmin-fenix-8': 'RMSSD',
  'fitbit-charge-6': 'RMSSD',
  'fitbit-air': 'RMSSD',
  'amazfit-helio-ring': 'RMSSD',
  'ultrahuman-ring-air': 'SDNN+RMSSD',
  'ultrahuman-ring-pro': 'SDNN+RMSSD',
  'polar-h10': 'RR-intervals', // raw beat-to-beat; the metric depends on the app
  'ringconn-gen-2': 'unknown',
  'ringconn-gen-3': 'unknown',
  'samsung-galaxy-ring': 'unknown',
  'circular-ring-2': 'unknown',
  'luna-ring': 'unknown',
  'withings-scanwatch': 'unknown',
}

type WorksWithOnda = 'yes' | 'partly' | 'not-a-device'

function worksWithOnda(slug: string, category: string): WorksWithOnda {
  if (category !== 'hrv-wearable') return 'not-a-device'
  return slug.startsWith('apple-watch') ? 'yes' : 'partly'
}

const WORKS_NOTE: Record<WorksWithOnda, string> = {
  yes: 'ONDA reads heart rate and HRV from Apple Watch and builds your personal baseline from its history.',
  partly:
    'Partly — via Apple Health, if the device syncs heart data there: ONDA’s personal baseline reads HRV and resting heart rate from Apple Health whatever the source. Live heart-rhythm coherence needs Apple Watch; the iPhone camera measures pulse without any device.',
  'not-a-device': '',
}

const reviewRows = reviews.map((r) => {
  const w = worksWithOnda(r.slug, r.category)
  return {
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    productType: r.productType,
    url: `${SITE}/reviews/${r.slug}`,
    categoryUrl: `${SITE}/reviews/${CATEGORY_URL_SLUGS[r.category]}`,
    priceUsd: r.price?.usd ?? null,
    priceNote: r.price?.note ?? null,
    priceAsOf: r.price?.asOf ?? null,
    score: r.overallScore,
    scores: r.scores.map((s) => ({ id: s.criterionId, score: s.score, note: s.note })),
    verdict: r.verdict,
    bestFor: r.bestFor,
    pros: r.pros,
    cons: r.cons,
    testStatus: r.testStatus,
    hrvMetric: r.category === 'hrv-wearable' ? HRV_METRIC[r.slug] ?? 'unknown' : null,
    worksWithOnda: w,
    worksWithOndaNote: WORKS_NOTE[w] || null,
    dateModified: r.dateModified,
  }
})

const missing = reviews
  .filter((r) => r.category === 'hrv-wearable' && !(r.slug in HRV_METRIC))
  .map((r) => r.slug)
if (missing.length) {
  throw new Error(`hrvMetric not set for wearable review(s): ${missing.join(', ')}`)
}

// Winner is exported only when the duel page shows one. Status and label mirror the
// line above the verdict on HeadToHeadPage.tsx (English defaults): top-two ONDA score
// gap <= 0.1 → "Practically equal by ONDA score (…)", also on 'depends on the job'
// duels; other 'depends on the job' duels → "Higher ONDA score: X (…)"; else "WINNER: X".
const reviewBySlug = new Map(reviews.map((r) => [r.slug, r]))
const duelRows = headToHeads.map((h) => {
  const prods = [h.productASlug, h.productBSlug, h.productCSlug].filter((s): s is string => !!s).map((s) => reviewBySlug.get(s)!).filter(Boolean)
  const { ranked, practicallyEqual } = scoreComparison(prods)
  const winnerReview = prods.find((p) => p.slug === h.winnerSlug)
  const status = practicallyEqual ? 'practically-equal' : h.jobDependentVerdict || !winnerReview ? 'depends-on-the-job' : 'winner'
  const s = ranked.map((r) => r.overallScore.toFixed(1))
  const label =
    status === 'practically-equal'
      ? `Practically equal by ONDA score (${s.length > 2 ? `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}` : s.join(' and ')})`
      : status === 'depends-on-the-job'
        ? `Higher ONDA score: ${ranked[0].name} (${s.join(' vs ')})`
        : `WINNER: ${winnerReview!.name}`
  return {
  slug: h.slug,
  title: h.title,
  url: `${SITE}/reviews/vs/${h.slug}`,
  products: [h.productASlug, h.productBSlug, h.productCSlug].filter(Boolean),
  winner: status === 'winner' ? h.winnerSlug : null,
  winnerStatus: status,
  label,
  onda_scores: Object.fromEntries(prods.map((r) => [r.slug, r.overallScore])),
  verdict: h.verdict,
  bestFor: { a: h.bestForA, b: h.bestForB, c: h.bestForC ?? null },
  axes: h.axes,
}})

const roundupRows = comparisons.map((c) => ({
  slug: c.slug,
  title: c.title,
  url: `${SITE}/reviews/compare/${c.slug}`,
  picks: c.picks.map((p) => ({ review: p.reviewSlug, award: p.award, takeaway: p.takeaway, ...(p.comparisonOnly ? { comparisonOnly: p.comparisonOnly } : {}) })),
}))

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(
  OUT,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString().slice(0, 10),
      source: `${SITE}/reviews`,
      reviews: reviewRows,
      headToHeads: duelRows,
      roundups: roundupRows,
    },
    null,
    2,
  ) + '\n',
)
console.log(
  `reviews ${reviewRows.length}, duels ${duelRows.length}, roundups ${roundupRows.length} → ${OUT}`,
)

// ── practices: adaptive only (the free set, playable on /emoton) ──────────
const tagsPath = resolve(APP, 'data/practice-tags.json')
const tags = JSON.parse(readFileSync(tagsPath, 'utf8')) as Record<string, any>
const untagged = Object.keys(ADAPTIVE_PRACTICES).filter((id) => !tags[id])
const orphan = Object.keys(tags).filter((id) => id !== '_about' && !(id in ADAPTIVE_PRACTICES))
if (untagged.length || orphan.length) {
  throw new Error(`practice-tags.json out of sync — untagged: ${untagged.join(', ') || '-'}; unknown: ${orphan.join(', ') || '-'}`)
}
const practiceRows = Object.values(ADAPTIVE_PRACTICES).map((p) => ({
  id: p.id,
  name: p.name,
  emoji: p.emoji,
  emotion: p.emotionFolder,
  minutes: Math.round(p.targetTime / 60),
  shortPhrase: p.shortPhrase,
  firstSteps: p.guidingTexts.slice(0, 3),
  goals: tags[p.id].goals,
  level: tags[p.id].level,
  setting: tags[p.id].setting,
  line: tags[p.id].line,
}))
writeFileSync(
  resolve(APP, 'data/practices.json'),
  JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), tryUrl: `${SITE}/emoton`, practices: practiceRows }, null, 2) + '\n',
)
console.log(`practices ${practiceRows.length} → data/practices.json`)

// ── HRV norms + breathing patterns: bundle the site modules as-is ──────────
for (const name of ['hrv-norms', 'breathing']) {
  buildSync({
    entryPoints: [resolve(LANDING, `src/data/${name}.ts`)],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    outfile: resolve(APP, `lib/generated/${name}.js`),
    banner: { js: `// GENERATED from landing/src/data/${name}.ts by landing/scripts/export-chatgpt-data.ts — do not edit.` },
    logLevel: 'error',
  })
}
console.log('lib/generated/hrv-norms.js, breathing.js')
