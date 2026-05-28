import type { ToolReview } from './types'

const levoitCore300: ToolReview = {
  slug: 'levoit-core-300',
  name: 'Levoit Core 300',
  brand: 'Levoit',
  category: 'air-purifier',
  productType: 'Entry-budget True HEPA air purifier',
  description:
    'ONDA review of the Levoit Core 300 — entry-budget True HEPA H13 + activated carbon air purifier at $99. Scored on filtration, CADR, build and value.',
  verdict:
    'Best entry-budget — True HEPA H13 + carbon at $99 with credible 219 sq ft coverage. The starter device for users entering the category.',
  summary:
    'Levoit Core 300 is the entry-budget reference — True HEPA H13, activated-carbon layer, 219 sq ft AHAM-certified coverage, basic 3-speed control, $99. Levoit consumer brand dominance with Amazon distribution. No app, no sensor, no auto mode — pure mechanical entry-level device. The right starter purifier for users entering the category.',
  overallScore: 6.5,
  scores: [
    { criterionId: 'filtration-technology', score: 7.5, note: 'True HEPA H13 + activated carbon. Same core filtration spec as mid-budget devices at entry price.' },
    { criterionId: 'cadr-coverage', score: 6.5, note: 'AHAM-certified 141 CADR. 219 sq ft coverage at 2 ACH; ~85 sq ft at 5 ACH — bedroom-only scale.' },
    { criterionId: 'build-noise', score: 7.0, note: 'Solid budget build. ~24 dB on low (quiet), 50 dB on high.' },
    { criterionId: 'smart-features', score: 4.5, note: 'No app, no sensor, no auto mode. 3-speed control only. The trade for entry pricing.' },
    { criterionId: 'maintenance-cost', score: 7.5, note: '6-12 month filter cycle. ~$30-50/year filter cost. Cheapest filter ownership in category.' },
    { criterionId: 'value', score: 9.5, note: '$99 — best entry-budget value. True HEPA H13 at entry price unbeatable.' },
  ],
  pros: [
    'True HEPA H13 + carbon at $99',
    'Cheapest filter ownership in category',
    'Levoit brand pedigree with Amazon distribution',
    'Quiet on low (~24 dB)',
  ],
  cons: [
    'No app, no sensor, no auto mode',
    '219 sq ft coverage — bedroom-only scale',
    'Plastic budget build',
    '3-speed manual control only',
  ],
  bestFor: 'Best for users entering the air-purifier category — $99 starter device for single bedroom with credible True HEPA filtration.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Levoit product documentation, AHAM certification and 2026 consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 99, note: 'Core 300 standalone', asOf: '2026-05-28' },
  link: 'https://levoit.com/',
  linkType: 'official',
  content: `## Where it leads

Levoit Core 300 is the entry-budget reference — True HEPA H13 + activated carbon at $99 with 219 sq ft bedroom coverage. Best starter purifier for category entry; cheapest filter ownership long-term.

## Where it falls short

Coverage and smart features. 219 sq ft is bedroom-only scale; no app, no sensor, no auto mode. For users wanting larger coverage or smart features, mid-budget required.

## Who it is for

Choose Levoit Core 300 as starter purifier for single bedroom at $99. For larger coverage + smart features, Levoit Core 600S. For Wirecutter-trust budget, Coway Airmega AP-1512HH. For Korean budget with sensor, Winix 5500-2.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Levoit — official site', url: 'https://levoit.com/' },
  ],
  relatedSlugs: ['levoit-core-600s', 'coway-airmega-ap-1512hh', 'honeywell-hpa300'],
  publishOn: '2026-07-27',
  datePublished: '2026-07-27',
  dateModified: '2026-07-27',
}

export default levoitCore300
