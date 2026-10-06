import { ALL_REVIEWS, ALL_COMPARISONS, rankPositions, weightedMean } from '../src/data/reviews'
const cats = [...new Set(ALL_REVIEWS.map((r) => r.category))]
for (const c of cats) {
  const list = ALL_REVIEWS.filter((r) => r.category === c)
  const rp = rankPositions(list)
  const t = list.map((r, i) => (rp[i].tied ? `${r.slug}=${rp[i].rank}` : '')).filter(Boolean)
  if (t.length) console.log('TIE', c, t.join(' '))
}
for (const r of ALL_REVIEWS) { const m = weightedMean(r.category, r.scores); if (Math.abs(m*100 - Math.round(m*100)) < 1e-6 && Math.round(m*1000)%100===50) console.log('half', r.slug, m) }
