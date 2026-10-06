import type { ToolReviewInput } from './types'

const bobAndBradQ2: ToolReviewInput = {
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

## What are the downsides of Bob and Brad Q2 Mini?

Stall force and app. 35 lbs stall force is half of premium-tier specs; no app integration. For users wanting premium percussion, premium tier required.

## Who should buy Bob and Brad Q2 Mini?

Choose Bob and Brad Q2 Mini for budget mini with brand credibility. For premium travel mini, Hypervolt Go 2. For higher budget specs, OPOVE M3 Pro 2. For lowest-cost budget, Renpho R3.

---

## Background reading

- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid)
`,
  references: [
    { label: 'Bob and Brad — official site', url: 'https://bobandbrad.com/' },
  ],
  relatedSlugs: ['renpho-r3', 'hypervolt-go-2', 'opove-m3-pro-2'],
  publishOn: '2026-07-20',
  faq: [
    { q: "Is the Bob and Brad Q2 Mini worth it?", a: "Yes, for budget buyers. The Bob and Brad Q2 Mini offers a brushless motor, about 6 hours of battery life and 4 attachments for $99, backed by the Famous Physical Therapists brand. Its 35 lbs stall force and 10 mm amplitude are modest, so it is not for users who want premium power." },
    { q: "How much does the Bob and Brad Q2 Mini cost?", a: "The Bob and Brad Q2 Mini costs $99 with 4 attachments. For that price you get a mini form factor with a brushless motor, 35 lbs stall force, 10 mm amplitude and roughly 6 hours of battery life, which is long for its size." },
    { q: "What are the downsides of the Bob and Brad Q2 Mini?", a: "The Bob and Brad Q2 Mini has modest 35 lbs stall force and a 10 mm amplitude, versus 14–16 mm on premium massage guns. It also has no app or smart features and no multi-grip handle for reaching awkward spots." },
    { q: "Who is the Bob and Brad Q2 Mini best for?", a: "The Bob and Brad Q2 Mini is best for budget-conscious buyers who want a credible-brand mini massage gun at $99. It suits people who trust the Bob and Brad physical-therapist framing and accept reduced stall force for the price." },
  ],
  datePublished: '2026-07-20',
  dateModified: '2026-07-20',
}

export default bobAndBradQ2
