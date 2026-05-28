import type { ToolReview } from './types'

const bobAndBradQ2: ToolReview = {
  slug: 'bob-and-brad-q2-mini',
  name: 'Bob and Brad Q2 Mini',
  brand: 'Bob and Brad',
  category: 'massage-gun',
  productType: 'Budget mini massage gun with PT-endorsed brand',
  description:
    'ONDA review of the Bob and Brad Q2 Mini — viral budget mini massage gun from the "Famous Physical Therapists" YouTube brand at $99. Scored on stall force, build, battery and value.',
  verdict:
    'Best budget mini value — Bob and Brad PT-credibility branding at $99. Limited stall force; brand pedigree from "Famous Physical Therapists" YouTube channel is the differentiator.',
  summary:
    'Bob and Brad Q2 Mini is the viral budget mini — credible-PT-brand branding from the "Famous Physical Therapists" YouTube channel, 35 lbs stall force, 10 mm amplitude, 4 attachments, $99. Strong consumer brand recognition from YouTube physical-therapy content. The budget-tier reference, especially for users who trust the Bob and Brad PT-credibility framing.',
  overallScore: 6.8,
  scores: [
    { criterionId: 'stall-force-amplitude', score: 6.5, note: '35 lbs stall force + 10 mm amplitude. Modest by premium standards but credible for daily-use protocols.' },
    { criterionId: 'build-attachments', score: 7.0, note: 'Brushless motor at budget price. 4 attachments included. 1-year warranty.' },
    { criterionId: 'battery-noise', score: 7.5, note: 'Brushless motor at 55 dB. ~6 hours per charge.' },
    { criterionId: 'app-smart-features', score: 4.5, note: 'No app or Bluetooth. Battery indicator only.' },
    { criterionId: 'ergonomics-portability', score: 8.5, note: 'Mini form factor — ~1 lb. Excellent portability and travel-friendliness.' },
    { criterionId: 'value', score: 9.5, note: '$99 — unbeatable value for the spec + brand credibility. Best budget mini overall.' },
  ],
  pros: [
    'Unbeatable $99 pricing for the spec + brand',
    'Bob and Brad "Famous Physical Therapists" brand credibility',
    'Mini form factor with brushless motor',
    '~6 hour battery life — long for the size',
  ],
  cons: [
    'Modest stall force (35 lbs)',
    'No app or smart features',
    '10 mm amplitude vs premium 14–16 mm',
    'No multi-grip handle',
  ],
  bestFor: 'Best for budget-conscious buyers wanting credible-brand mini massage gun at $99 — accept reduced stall force for the price point.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Bob and Brad product documentation and 2026 budget-mini reviews. Not hands-on tested by ONDA.',
  price: { usd: 99, note: 'Q2 Mini with 4 attachments', asOf: '2026-05-28' },
  link: 'https://bobandbrad.com/',
  linkType: 'official',
  content: `## Where it leads

Bob and Brad Q2 Mini is the budget-tier reference — credible PT-brand framing from the "Famous Physical Therapists" YouTube channel, brushless motor at $99, excellent portability. Best budget mini value.

## Where it falls short

Stall force and app. 35 lbs stall force is half of premium-tier specs; no app integration. For users wanting premium percussion, premium tier required.

## Who it is for

Choose Bob and Brad Q2 Mini for budget mini with brand credibility. For premium travel mini, Hypervolt Go 2. For higher budget specs, OPOVE M3 Pro 2. For lowest-cost budget, Renpho R3.

---

## Background reading

- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'Bob and Brad — official site', url: 'https://bobandbrad.com/' },
  ],
  relatedSlugs: ['renpho-r3', 'hypervolt-go-2', 'opove-m3-pro-2'],
  publishOn: '2026-07-20',
  datePublished: '2026-07-20',
  dateModified: '2026-07-20',
}

export default bobAndBradQ2
