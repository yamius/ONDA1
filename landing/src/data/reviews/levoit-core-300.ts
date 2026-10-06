import type { ToolReviewInput } from './types'

const levoitCore300: ToolReviewInput = {
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

## What are the downsides of Levoit Core 300?

Coverage and smart features. 219 sq ft is bedroom-only scale; no app, no sensor, no auto mode. For users wanting larger coverage or smart features, mid-budget required.

## Who should buy Levoit Core 300?

Choose Levoit Core 300 as starter purifier for single bedroom at $99. For larger coverage + smart features, Levoit Core 600S. For Wirecutter-trust budget, Coway Airmega AP-1512HH. For Korean budget with sensor, Winix 5500-2.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Levoit — official site', url: 'https://levoit.com/' },
  ],
  relatedSlugs: ['levoit-core-600s', 'coway-airmega-ap-1512hh', 'honeywell-hpa300'],
  publishOn: '2026-07-27',
  faq: [
    { q: "How big a room does the Levoit Core 300 cover?", a: "The Levoit Core 300 is AHAM-certified for 219 sq ft, which makes it a bedroom-scale purifier. For larger rooms, step up to the Levoit Core 600S at 635 sq ft or the Honeywell HPA300 at 465 sq ft." },
    { q: "Is the Levoit Core 300 worth $99?", a: "Yes, as a starter purifier. For $99 you get True HEPA H13 filtration with an activated-carbon layer, the cheapest filter ownership in the category, and quiet operation of about 24 dB on low. It suits users entering the category who need to clean a single bedroom." },
    { q: "Does the Levoit Core 300 have an app or auto mode?", a: "No. The Core 300 has no app, no sensor and no auto mode, just three manual speeds. It is a purely mechanical entry-level device in a plastic budget build. For app control and auto mode, the Levoit Core 600S is the step up at $299." },
  ],
  datePublished: '2026-07-27',
  dateModified: '2026-07-27',
}

export default levoitCore300
