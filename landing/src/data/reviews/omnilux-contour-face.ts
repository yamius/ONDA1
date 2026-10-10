import type { ToolReviewInput } from './types'

const omniluxContourFace: ToolReviewInput = {
  slug: 'omnilux-contour-face',
  name: 'Omnilux Contour Face',
  brand: 'Omnilux',
  category: 'red-light-mask',
  productType: 'Flexible silicone red light face mask',
  description:
    'ONDA review of the Omnilux Contour Face — flexible silicone red light mask with the deepest peer-reviewed dermatology evidence base. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'A dermatology-practice mask — peer-reviewed dermatology studies, flexible silicone, FDA-cleared per Omnilux.',
  summary:
    'Omnilux Contour Face is the red light mask used in dermatology practices, with peer-reviewed clinical studies behind it; Omnilux says it is FDA-cleared. Flexible silicone (Omnilux calls it medical-grade) for unattended wear, 132 LEDs (red 633 nm + near-infrared 830 nm), 10-minute session protocol. The clinical-evidence moat is what separates it from consumer-brand alternatives — Omnilux is the device dermatologists use in their own clinics.',
  scores: [
    { criterionId: 'irradiance', score: 9.0, note: 'Documented irradiance honest to dermatology-clinic dose at 10-minute session. Among the most transparent specs in the category — not inflated peak figures.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Red 633 nm + near-infrared 830 nm — the two wavelengths most used in skin studies. No blue / amber distraction.' },
    { criterionId: 'led-count-coverage', score: 8.0, note: '132 LEDs evenly distributed across forehead, cheeks and jaw. No neck flap on the standard Contour; neck addition sold separately.' },
    { criterionId: 'clinical-evidence', score: 9.5, note: 'Peer-reviewed published studies on the specific device for fine lines, collagen and skin smoothness; FDA-cleared per Omnilux (clearance is not FDA approval). The deepest clinical-evidence moat in consumer red light masks.' },
    { criterionId: 'comfort-fit', score: 9.0, note: 'Flexible silicone (medical-grade, per Omnilux) — comfortable in our assessment. Sits naturally on the face, adjustable strap, unattended wear OK.' },
    { criterionId: 'value', score: 7.0, note: '$395 — premium pricing. Justified by the clinical evidence base; not the cheapest mask but the credibility-per-dollar is strong.' },
  ],
  pros: [
    'Used by dermatology practices; FDA-cleared per Omnilux',
    'Peer-reviewed published studies on the specific device',
    'Flexible silicone (medical-grade, per Omnilux) — comfortable for unattended wear',
    'Honest irradiance specs without marketing inflation',
  ],
  cons: [
    'Premium pricing ($395)',
    'No neck flap on the standard Contour (sold separately)',
    'Single 10-minute protocol — no advanced programmability',
    'No blue / amber wavelength variants (by design — clinical focus)',
  ],
  bestFor: 'Best for users wanting the dermatology reference with peer-reviewed clinical evidence and best-in-class flexible-silicone comfort.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Omnilux product documentation, the brand’s FDA-clearance statement and the published peer-reviewed dermatology literature on the Contour Face device. Not hands-on tested by ONDA.',
  price: { usd: 395, note: 'Contour Face; neck flap sold separately', asOf: '2026-09-30' },
  link: 'https://omniluxled.com/',
  linkType: 'official',
  content: `## Where it leads

Omnilux Contour Face is the dermatology reference — the mask used in clinical practices and the device backed by peer-reviewed studies on its specific waveform and dose. Omnilux says the mask is FDA-cleared; clearance means the FDA found it substantially equivalent to a device already on the market for a named use, not FDA approval. Flexible silicone (Omnilux calls it medical-grade) makes it comfortable to wear in our assessment.

## What are the downsides of Omnilux Contour Face?

Price and scope. At $395 Omnilux is premium-tier; competitors at half the price (LightStim, Solawave) cover lighter use cases. Single 10-minute protocol — no programmability for users wanting modes / sessions. No neck flap on the standard Contour without paying extra.

## Who should buy Omnilux Contour Face?

Choose Omnilux Contour Face if you want the dermatology reference with peer-reviewed clinical evidence and best-in-class comfort. For larger consumer market share, CurrentBody Series 2. For dermatology-brand alternative, Dr. Dennis Gross SpectraLite. For handheld at lower price, LightStim.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — photobiomodulation and cellular ATP
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid) — red light as mitochondrial-energy adjunct
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors)
`,
  references: [
    { label: 'Omnilux — official site', url: 'https://omniluxled.com/' },
  ],
  relatedSlugs: ['currentbody-series-2', 'dr-dennis-gross-spectralite', 'lumara-viso'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is the Omnilux Contour Face worth it?", a: "The Omnilux Contour Face is worth it if you want the dermatology reference. Omnilux says it is FDA-cleared, and it has peer-reviewed studies on the specific device, honest irradiance specs, and flexible silicone (medical-grade, per Omnilux) that is comfortable to wear. Programmability is minimal." },
    { q: "How much does the Omnilux Contour Face cost?", a: "The Omnilux Contour Face is listed at $395. The neck flap is not included with the standard Contour and is sold separately, so budget extra if you want neck coverage as well as the face." },
    { q: "What are the downsides of the Omnilux Contour Face?", a: "It carries premium $395 pricing, the standard version has no neck flap, it offers only a single 10-minute protocol with no advanced programmability, and it has no blue or amber wavelength variants, by design, because of its clinical focus." },
    { q: "Omnilux Contour Face vs Lumara Viso: which is better?", a: "Omnilux is better for clinical evidence, with device-specific peer-reviewed studies. The Lumara Viso offers more LEDs, three wavelengths and an included neck flap, but has a lighter evidence moat and costs more at $650." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-10-10',
}

export default omniluxContourFace
