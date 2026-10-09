import type { ToolReviewInput } from './types'

const therafaceMask: ToolReviewInput = {
  slug: 'theraface-mask',
  name: 'TheraFace Mask',
  brand: 'Therabody',
  category: 'red-light-mask',
  productType: 'Premium consumer-brand red + blue + amber LED face mask',
  description:
    'ONDA review of the TheraFace Mask — Therabody-branded premium face mask with red, blue and amber LED protocols and brand-funded research. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Best Therabody-brand crossover into face masks — three-wavelength coverage, premium build, brand pedigree from massage gun category. Less clinical moat than dermatology references.',
  summary:
    'TheraFace Mask is Therabody\'s 2026 face mask — leveraging the Theragun brand pedigree into the red light category. Three-wavelength coverage (red 633 nm + blue 415 nm + amber 590 nm), flexible-shell hybrid build, integrated session app, premium pricing. Brand-funded research; less peer-reviewed dermatology moat than Omnilux or Dr. Dennis Gross.',
  scores: [
    { criterionId: 'irradiance', score: 7.5, note: 'Documented irradiance in dermatology-acceptable range. Brand-funded validation; less independent verification than category references.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Red 633 nm + blue 415 nm + amber 590 nm — three-wavelength coverage with mode-switching protocols.' },
    { criterionId: 'led-count-coverage', score: 7.5, note: 'Solid LED count and even distribution. No neck flap on the standard model.' },
    { criterionId: 'clinical-evidence', score: 6.0, note: 'FDA registered (a listing, not clearance or approval), brand-funded research. Therabody pedigree from massage guns is real but doesn\'t carry into red-light clinical moat.' },
    { criterionId: 'comfort-fit', score: 8.0, note: 'Hybrid flexible-shell build — between hard plastic and full silicone. App-controlled session timing is the UX differentiator.' },
    { criterionId: 'value', score: 6.5, note: '$649 — premium pricing reflecting Therabody brand premium. Justified for users in the Therabody ecosystem; expensive for users just buying a red light mask.' },
  ],
  pros: [
    'Therabody brand pedigree and ecosystem (pairs with TheraFace Pro)',
    'Three-wavelength coverage (red + blue + amber)',
    'App-controlled session protocols',
    'Premium consumer build quality',
  ],
  cons: [
    'No peer-reviewed dermatology evidence moat',
    'Premium pricing ($649)',
    'No neck flap on standard model',
    'Brand premium leans on Theragun pedigree rather than red-light credibility',
  ],
  bestFor: 'Best for users already in the Therabody ecosystem who want a coordinated face-mask + TheraFace Pro stack with three-wavelength coverage and app control.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Therabody product documentation, the brand’s FDA-registration statement and 2026 consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 649, note: 'TheraFace Mask standalone', asOf: '2026-05-28' },
  link: 'https://www.therabody.com/',
  linkType: 'official',
  content: `## Where it leads

TheraFace Mask is Therabody\'s 2026 red light face mask — three-wavelength coverage (red + blue + amber), app-controlled protocols, premium build leveraging the Theragun brand. The right device for users already in the Therabody ecosystem who want a coordinated stack.

## What are the downsides of TheraFace Mask?

Clinical evidence and price. TheraFace lacks the peer-reviewed dermatology moat of Omnilux or Dr. Dennis Gross — the Theragun pedigree is real but doesn\'t carry into red-light credibility. At $649 the premium relies on brand position rather than evidence.

## Who should buy TheraFace Mask?

Choose TheraFace Mask if you\'re already in the Therabody ecosystem and want coordinated face-mask + TheraFace Pro. For dermatology evidence, Omnilux Contour Face. For dermatology brand pedigree, Dr. Dennis Gross. For consumer market leader, CurrentBody Series 2.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid)
`,
  references: [
    { label: 'Therabody — official site', url: 'https://www.therabody.com/' },
  ],
  relatedSlugs: ['higherdose-red-light-face-mask', 'currentbody-series-2', 'omnilux-contour-face'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is the TheraFace Mask worth it?", a: "The TheraFace Mask is worth it mainly for people already in the Therabody ecosystem who want to pair it with TheraFace Pro. It offers red, blue and amber light, app-controlled protocols and premium build. It lacks a peer-reviewed dermatology evidence moat and costs $649." },
    { q: "How much does the TheraFace Mask cost?", a: "The TheraFace Mask costs $649 standalone. That is premium pricing, and the review notes the brand premium leans on Theragun pedigree rather than red-light credibility, so weigh ecosystem value before buying." },
    { q: "What are the downsides of the TheraFace Mask?", a: "The TheraFace Mask has no peer-reviewed dermatology evidence moat, costs a premium $649, and has no neck flap on the standard model. Its brand premium relies on Theragun pedigree more than red-light credibility." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-10-10',
}

export default therafaceMask
