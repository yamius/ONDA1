/**
 * Build check for computed review scores (owner spec 2026-10-06).
 *
 * Fails the build when:
 *  - a review file still hand-types `overallScore:` or a duel hand-types
 *    `winnerSlug:` (both are computed — scoring.ts);
 *  - a category's criterion weights do not sum to 1, a review misses a
 *    criterion of its category, or a criterion score is outside 0–10;
 *  - an editorialAdjustment exceeds ±0.3 (MAX_EDITORIAL_ADJUSTMENT) or has
 *    no reason;
 *  - a published overall score ≠ round-half-up(weighted mean + adjustment);
 *  - a round-up pick points to an unknown review or a round-up has more
 *    than one "Best overall" award.
 *
 * Run: tsx scripts/check-review-scores.ts (wired into `npm run build`).
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ALL_REVIEWS, ALL_COMPARISONS, weightedMean, roundHalfUp1, MAX_EDITORIAL_ADJUSTMENT } from '../src/data/reviews'
import { CRITERIA } from '../src/data/reviews/criteria'
import { ALL_HEAD_TO_HEADS } from '../src/data/reviews/head-to-head'

const errors: string[] = []
const root = join(import.meta.dirname, '..', 'src', 'data', 'reviews')

// 1. No hand-typed computed fields in data files.
for (const f of readdirSync(root).filter((f) => f.endsWith('.ts'))) {
  if (['types.ts', 'scoring.ts', 'index.ts', 'all-reviews.ts', 'criteria.ts'].includes(f)) continue
  if (/^\s*overallScore\s*:/m.test(readFileSync(join(root, f), 'utf8'))) errors.push(`${f}: hand-typed overallScore (it is computed)`)
}
const h2hDir = join(root, 'head-to-head')
for (const f of readdirSync(h2hDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  if (/^\s*winnerSlug\s*:/m.test(readFileSync(join(h2hDir, f), 'utf8'))) errors.push(`head-to-head/${f}: hand-typed winnerSlug (it is computed)`)
}

// 2. Criterion weights sum to 1 per category.
for (const [cat, list] of Object.entries(CRITERIA)) {
  const sum = list.reduce((s, c) => s + c.weight, 0)
  if (Math.abs(sum - 1) > 1e-9) errors.push(`criteria ${cat}: weights sum to ${sum}, not 1`)
}

// 3. Every review: complete criteria, scores in range, adjustment rule, published = computed.
for (const r of ALL_REVIEWS) {
  try {
    for (const s of r.scores) {
      if (!(s.score >= 0 && s.score <= 10)) errors.push(`${r.slug}: ${s.criterionId} score ${s.score} outside 0–10`)
    }
    const adj = r.editorialAdjustment
    if (adj) {
      if (Math.abs(adj.value) > MAX_EDITORIAL_ADJUSTMENT + 1e-9) errors.push(`${r.slug}: editorialAdjustment ${adj.value} exceeds ±${MAX_EDITORIAL_ADJUSTMENT}`)
      if (!adj.reason || !adj.reason.trim()) errors.push(`${r.slug}: editorialAdjustment without a reason`)
    }
    const expected = roundHalfUp1(weightedMean(r.category, r.scores, r.slug) + (adj?.value ?? 0))
    if (r.overallScore !== expected) errors.push(`${r.slug}: overall ${r.overallScore} ≠ computed ${expected}`)
  } catch (e) {
    errors.push(String((e as Error).message))
  }
}

// 4. Round-ups: known reviews, at most one "Best overall".
const known = new Set(ALL_REVIEWS.map((r) => r.slug))
for (const c of ALL_COMPARISONS) {
  for (const p of c.picks) if (!known.has(p.reviewSlug)) errors.push(`${c.slug}: pick "${p.reviewSlug}" has no review`)
  const best = c.picks.filter((p) => /^best overall/i.test(p.award))
  if (best.length > 1) errors.push(`${c.slug}: ${best.length} "Best overall" awards`)
}

if (errors.length) {
  console.error(`[check-review-scores] ${errors.length} error(s):\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
const adjusted = ALL_REVIEWS.filter((r) => r.editorialAdjustment).length
console.log(`[check-review-scores] OK — ${ALL_REVIEWS.length} reviews computed (${adjusted} with editorial adjustment), ${ALL_COMPARISONS.length} round-ups, ${ALL_HEAD_TO_HEADS.length} head-to-heads`)
