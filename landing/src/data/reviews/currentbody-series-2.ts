import type { ToolReview } from './types'

const currentbodySeries2: ToolReview = {
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
    'CurrentBody Series 2 is the highest-volume consumer red light face mask of 2026 — flexible medical-grade silicone, 132+ LEDs across red 633 nm + near-infrared 830 nm, integrated neck flap (a category first), 10-minute session. CurrentBody owns the consumer market and the Series 2 is the polished iteration of the original best-seller. FDA registered but not Class II cleared like Omnilux; the brand leans on customer-base scale rather than clinical-evidence moat.',
  overallScore: 8.3,
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Documented irradiance in dermatology-acceptable range. Less independently-verified than Omnilux but transparent at the spec level.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Red 633 nm + near-infrared 830 nm — the clinically-validated pair, matching the Omnilux spectrum.' },
    { criterionId: 'led-count-coverage', score: 9.0, note: 'Integrated neck flap is the differentiator — coverage extends from forehead through cheeks and jaw down the neck. 2026 spec war winner.' },
    { criterionId: 'clinical-evidence', score: 7.5, note: 'FDA registered but not Class II cleared. Brand-funded studies + customer-base scale rather than peer-reviewed dermatology moat.' },
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
    'Less clinical-evidence moat than Omnilux (FDA registered, not Class II cleared)',
    '$470 — premium pricing',
    'Brand leans on scale rather than peer-reviewed studies',
    'No customisable session modes',
  ],
  bestFor: 'Best for users wanting the consumer-market reference with integrated neck flap, polished silicone build and the largest customer-feedback base.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from CurrentBody product documentation, FDA registration records and independent 2026 consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 470, note: 'Series 2 with neck flap', asOf: '2026-05-28' },
  link: 'https://currentbody.com/',
  linkType: 'official',
  content: `## Where it leads

CurrentBody Series 2 is the consumer-market reference — biggest customer base, polished silicone build refined across multiple iterations, and the integrated neck flap that became the 2026 spec war winner. CurrentBody owns the consumer-facing red light mask category and the Series 2 is the rational default for buyers who value market scale and feature parity.

## Where it falls short

Clinical-evidence moat. CurrentBody is FDA registered but not Class II cleared like Omnilux; brand-funded studies exist but no peer-reviewed dermatology literature on the specific device matches Omnilux's depth. For users buying on clinical credibility, Omnilux still wins.

## Who it is for

Choose CurrentBody Series 2 if you want the consumer-market reference with integrated neck flap and polished silicone build. For FDA Class II clinical evidence, Omnilux Contour Face. For dermatology brand pedigree, Dr. Dennis Gross. For premium spec maximalism, Lumara Viso.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'CurrentBody — official site', url: 'https://currentbody.com/' },
  ],
  relatedSlugs: ['omnilux-contour-face', 'dr-dennis-gross-spectralite', 'higherdose-red-light-face-mask'],
  publishOn: '2026-07-06',
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
}

export default currentbodySeries2
