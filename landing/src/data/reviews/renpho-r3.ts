import type { ToolReview } from './types'

const renphoR3: ToolReview = {
  slug: 'renpho-r3',
  name: 'Renpho R3',
  brand: 'Renpho',
  category: 'massage-gun',
  productType: 'Budget Amazon-bestseller massage gun',
  description:
    'ONDA review of the Renpho R3 — Amazon-bestseller budget massage gun at $99 with mid-tier specs and large attachment count. Scored on stall force, build, battery and value.',
  verdict:
    'Best Amazon-bestseller budget — Renpho R3 delivers credible specs at $99 with 5 attachments and quiet brushless motor.',
  summary:
    'Renpho R3 is the Amazon-bestseller budget reference — 40 lbs stall force, 12 mm amplitude, 5 attachments, quiet brushless motor, $99. Strong consumer-feedback base from Amazon distribution at scale. Renpho brand pedigree from smart scale and other home-health categories. The right buy for users who want budget percussion without the Bob and Brad PT-credibility framing premium.',
  overallScore: 6.5,
  scores: [
    { criterionId: 'stall-force-amplitude', score: 7.0, note: '40 lbs stall force + 12 mm amplitude. Better specs than Bob and Brad Q2 Mini at the same price.' },
    { criterionId: 'build-attachments', score: 7.0, note: 'Brushless motor, 5 attachments included, 1-year warranty. Solid Amazon-scale build quality.' },
    { criterionId: 'battery-noise', score: 7.5, note: 'Brushless motor at 55 dB. ~6 hours per charge.' },
    { criterionId: 'app-smart-features', score: 4.0, note: 'No app or Bluetooth. Battery indicator only.' },
    { criterionId: 'ergonomics-portability', score: 7.5, note: '~1.7 lbs. Compact full-size form factor (not mini). Standard handle.' },
    { criterionId: 'value', score: 9.0, note: '$99 — best raw-spec value among budget massage guns. Slightly higher stall + amplitude than Bob and Brad at same price.' },
  ],
  pros: [
    'Best budget specs at $99 — 40 lbs stall + 12 mm amplitude',
    '5 attachments included',
    'Strong Amazon distribution and consumer-feedback base',
    'Brushless motor at budget price',
  ],
  cons: [
    'No app or smart features',
    'No brand credibility moat (vs Bob and Brad PT framing)',
    'Single-grip standard handle',
    '1-year warranty',
  ],
  bestFor: 'Best for Amazon-buyers wanting credible-spec budget massage gun at $99 — pure spec-per-dollar play without brand credibility premium.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Renpho product documentation, Amazon reviews at scale and 2026 budget massage-gun reviews. Not hands-on tested by ONDA.',
  price: { usd: 99, note: 'R3 with 5 attachments', asOf: '2026-05-28' },
  link: 'https://www.renpho.com/',
  linkType: 'official',
  content: `## Where it leads

Renpho R3 is the Amazon-bestseller budget reference — best raw-spec budget value at $99. Strong Amazon consumer-feedback base, brushless motor, 5 attachments.

## Where it falls short

Brand credibility and app. No PT-framing moat (vs Bob and Brad); no app integration. For users buying on brand credibility, Bob and Brad better fit.

## Who it is for

Choose Renpho R3 for pure spec-per-dollar Amazon budget. For Bob and Brad PT credibility, Q2 Mini. For higher-spec mid-budget, OPOVE M3 Pro 2.

---

## Background reading

- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'Renpho — official site', url: 'https://www.renpho.com/' },
  ],
  relatedSlugs: ['bob-and-brad-q2-mini', 'opove-m3-pro-2', 'toloco-massage-gun'],
  publishOn: '2026-07-20',
  datePublished: '2026-07-20',
  dateModified: '2026-07-20',
}

export default renphoR3
