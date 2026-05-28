import type { ToolReview } from './types'

const levoitCore600s: ToolReview = {
  slug: 'levoit-core-600s',
  name: 'Levoit Core 600S',
  brand: 'Levoit',
  category: 'air-purifier',
  productType: 'Mid-budget smart True HEPA + carbon air purifier',
  description:
    'ONDA review of the Levoit Core 600S — mid-budget smart True HEPA H13 + activated carbon air purifier with VeSync app and 635 sq ft coverage at $299. Scored on filtration, CADR, build and value.',
  verdict:
    'Best mid-budget smart — True HEPA H13 + carbon + VeSync app + auto mode at $299. Levoit consumer brand dominance with solid 635 sq ft coverage.',
  summary:
    'Levoit Core 600S is the mid-budget smart reference — True HEPA H13, activated-carbon layer, 635 sq ft AHAM-certified coverage, VeSync app with PM2.5 sensor and auto mode, $299. Levoit consumer brand owns the mid-budget category through Amazon distribution and solid spec-per-dollar. The rational mid-budget default if you want smart features without paying premium-tier prices.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'filtration-technology', score: 7.5, note: 'True HEPA H13 + activated-carbon. Standard mid-tier spec without premium-tier differentiation.' },
    { criterionId: 'cadr-coverage', score: 8.0, note: 'AHAM-certified 410 CADR. 635 sq ft at 2 ACH; ~240 sq ft at 5 ACH.' },
    { criterionId: 'build-noise', score: 7.5, note: 'Solid build at price point. ~24 dB on low, 54 dB on high.' },
    { criterionId: 'smart-features', score: 8.5, note: 'VeSync app integration, built-in PM2.5 sensor, auto mode, Alexa / Google Home. Best smart features in mid-budget.' },
    { criterionId: 'maintenance-cost', score: 7.5, note: '6-12 month filter cycle. ~$50-80/year filter cost. Cheapest long-term filter ownership.' },
    { criterionId: 'value', score: 9.0, note: '$299 — best mid-budget value. Premium-feature stack at sub-Coway pricing.' },
  ],
  pros: [
    'Best smart features in mid-budget category',
    'Cheapest long-term filter ownership',
    'Levoit / VeSync ecosystem with strong Amazon distribution',
    'Apple HomeKit-adjacent via VeSync app',
  ],
  cons: [
    '635 sq ft vs Coway Airmega 400\'s 1560 sq ft AHAM coverage',
    'No premium-tier filtration differentiation',
    'Plastic build quality vs premium-brand metal alternatives',
    'Smart sensor accuracy moderate vs Dyson / IQAir',
  ],
  bestFor: 'Best for mid-budget buyers wanting smart features and app integration at $299 — sufficient for bedroom / medium room coverage.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Levoit / VeSync product documentation, AHAM certification and 2026 consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 299, note: 'Core 600S standalone', asOf: '2026-05-28' },
  link: 'https://levoit.com/',
  linkType: 'official',
  content: `## Where it leads

Levoit Core 600S is the mid-budget smart reference — True HEPA H13, VeSync app, PM2.5 sensor, auto mode at $299. Best mid-budget smart features and cheapest long-term filter ownership.

## Where it falls short

Coverage and build quality vs Coway Airmega 400. 635 sq ft vs Coway 1560 sq ft AHAM coverage. Plastic build vs premium-brand metal.

## Who it is for

Choose Levoit Core 600S for mid-budget smart features at $299. For mid-premium coverage doubling, Coway Airmega 400. For premium smart, Dyson Big+Quiet. For entry budget, Levoit Core 300.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Levoit — official site', url: 'https://levoit.com/' },
  ],
  relatedSlugs: ['levoit-core-300', 'coway-airmega-400', 'winix-5500-2'],
  publishOn: '2026-07-27',
  datePublished: '2026-07-27',
  dateModified: '2026-07-27',
}

export default levoitCore600s
