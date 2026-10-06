import { writeFileSync } from 'node:fs'
import { ALL_REVIEWS, ALL_COMPARISONS } from '../src/data/reviews'
import { ALL_HEAD_TO_HEADS } from '../src/data/reviews/head-to-head'
const out = {
  reviews: ALL_REVIEWS.map((r) => ({ slug: r.slug, name: r.name, category: r.category, overall: r.overallScore, publishOn: r.publishOn ?? null, dateModified: r.dateModified })),
  comparisons: ALL_COMPARISONS.map((c) => ({ slug: c.slug, category: c.category, picks: c.picks.map((p) => ({ slug: p.reviewSlug, award: p.award })) })),
  h2h: ALL_HEAD_TO_HEADS.map((h) => ({ slug: h.slug, products: [h.productASlug, h.productBSlug, h.productCSlug].filter(Boolean), winner: h.winnerSlug, verdict: h.verdict, publishOn: h.publishOn ?? null })),
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1))
console.log(out.reviews.length, out.comparisons.length, out.h2h.length)
