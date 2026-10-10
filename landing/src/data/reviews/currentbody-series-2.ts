import type { ToolReviewInput } from './types'

const currentbodySeries2: ToolReviewInput = {
  slug: 'currentbody-series-2',
  name: 'CurrentBody Series 2 LED Light Therapy Face Mask',
  brand: 'CurrentBody',
  category: 'red-light-mask',
  productType: 'Consumer flexible silicone LED face mask with neck flap',
  description:
    'ONDA review of the CurrentBody Series 2 — the highest-volume consumer red light face mask of 2026 with flexible silicone, multi-wavelength coverage and integrated neck flap. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Best consumer-market reference — biggest customer base, polished silicone build, neck flap included. Less clinical-evidence moat than Omnilux.',
  summary:
    'CurrentBody Series 2 is the highest-volume consumer red light face mask of 2026 — flexible medical-grade silicone, 132+ LEDs across red 633 nm + near-infrared 830 nm, integrated neck flap (a category first), 10-minute session. CurrentBody owns the consumer market and the Series 2 is the polished iteration of the original best-seller. FDA registered (a listing, not clearance or approval); the brand leans on customer-base scale rather than clinical-evidence moat.',
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Documented irradiance in dermatology-acceptable range. Less independently-verified than Omnilux but transparent at the spec level.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Red 633 nm + near-infrared 830 nm — the pair most used in skin studies, matching the Omnilux spectrum.' },
    { criterionId: 'led-count-coverage', score: 9.0, note: 'Integrated neck flap is the differentiator — coverage extends from forehead through cheeks and jaw down the neck. 2026 spec war winner.' },
    { criterionId: 'clinical-evidence', score: 6.5, note: 'FDA registered (a listing, scored as neutral). Its studies are brand-funded, and studies run or funded by the maker do not count as evidence in ONDA scores — no independent peer-reviewed studies of this mask found.' },
    { criterionId: 'comfort-fit', score: 9.0, note: 'Medical-grade flexible silicone, lighter than Omnilux. Strap design refined through multiple consumer-feedback cycles.' },
    { criterionId: 'value', score: 7.5, note: '$470 — premium-tier pricing including neck flap. More expensive than Omnilux Contour Face alone but cheaper than Omnilux + neck add-on combined.' },
  ],
  pros: [
    'Integrated neck flap — coverage from forehead to neck in one device',
    'Highest customer base in consumer red light masks — refined through user feedback',
    'Flexible medical-grade silicone — among the most comfortable masks',
    'Polished consumer UX with clear session protocols',
  ],
  cons: [
    'Less clinical-evidence moat than Omnilux (no peer-reviewed studies on the specific device)',
    '$470 — premium pricing',
    'Brand leans on scale rather than peer-reviewed studies',
    'No customisable session modes',
  ],
  bestFor: 'Best for users wanting the consumer-market reference with integrated neck flap, polished silicone build and the largest customer-feedback base.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from CurrentBody product documentation, the brand’s FDA-registration statement and independent 2026 consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 470, note: 'Series 2 with neck flap', asOf: '2026-05-28' },
  link: 'https://currentbody.com/',
  linkType: 'official',
  content: `## Where it leads

CurrentBody Series 2 is the consumer-market reference — biggest customer base, polished silicone build refined across multiple iterations, and the integrated neck flap that became the 2026 spec war winner. CurrentBody owns the consumer-facing red light mask category and the Series 2 is the rational default for buyers who value market scale and feature parity.

## What are the downsides of CurrentBody Series 2 LED Light Therapy Face Mask?

Clinical-evidence moat. CurrentBody is FDA registered (a listing, not clearance or approval); brand-funded studies exist but no peer-reviewed dermatology literature on the specific device matches Omnilux's depth. For users buying on clinical credibility, Omnilux still wins.

## Who should buy CurrentBody Series 2 LED Light Therapy Face Mask?

Choose CurrentBody Series 2 if you want the consumer-market reference with integrated neck flap and polished silicone build. For peer-reviewed clinical evidence, Omnilux Contour Face. For dermatology brand pedigree, Dr. Dennis Gross. For premium spec maximalism, Lumara Viso.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid)
`,
  references: [
    { label: 'CurrentBody — official site', url: 'https://currentbody.com/' },
  ],
  relatedSlugs: ['omnilux-contour-face', 'dr-dennis-gross-spectralite', 'higherdose-red-light-face-mask'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is the CurrentBody Series 2 LED mask worth it?", a: "Yes, if comfort and neck coverage matter. The CurrentBody Series 2 uses flexible medical-grade silicone, red 633 nm and near-infrared 830 nm LEDs, and an integrated neck flap. It has less clinical-evidence moat than Omnilux, with no peer-reviewed studies on the specific device." },
    { q: "How much does the CurrentBody Series 2 cost?", a: "The CurrentBody Series 2 costs $470 with the integrated neck flap. That is premium pricing for a consumer red light mask with 10-minute sessions, a polished flexible silicone build and coverage from forehead to neck." },
    { q: "What are the downsides of the CurrentBody Series 2?", a: "The CurrentBody Series 2 has less peer-reviewed evidence than Omnilux, and the brand leans on scale rather than peer-reviewed studies. At $470 it is premium-priced, and it has no customisable session modes." },
    { q: "CurrentBody Series 2 vs Dr. Dennis Gross SpectraLite: which is better?", a: "CurrentBody Series 2 is better for comfort and neck coverage; SpectraLite is better for dermatology pedigree and acne. CurrentBody uses flexible silicone with a neck flap, while SpectraLite adds blue light but has a hard shell and no neck flap." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-10-10',
}

export default currentbodySeries2
