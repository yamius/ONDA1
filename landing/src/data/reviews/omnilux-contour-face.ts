import type { ToolReviewInput } from './types'

const omniluxContourFace: ToolReviewInput = {
  slug: 'omnilux-contour-face',
  name: 'Omnilux Contour Face',
  brand: 'Omnilux',
  category: 'red-light-mask',
  productType: 'Flexible silicone red light face mask',
  description:
    'ONDA review of the Omnilux Contour Face — flexible silicone red light mask, FDA-cleared for wrinkles, with no published trial of the mask itself. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Flexible silicone with the standard red + near-infrared pair, FDA-cleared for wrinkles (510(k) K191629). No published trial of the Contour itself; Omnilux\'s published studies are on other models.',
  summary:
    'Omnilux Contour Face is a home LED mask from a brand whose larger clinic panels are used in dermatology practices. It is FDA-cleared for full-face wrinkles (510(k) K191629, cleared by equivalence to an earlier LED mask without clinical data). Flexible silicone (Omnilux calls it medical-grade) for unattended wear, 132 LEDs (red 633 nm + near-infrared 830 nm), 10-minute session protocol. No peer-reviewed trial of the Contour itself has been published; Omnilux\'s published studies are on other models.',
  scores: [
    { criterionId: 'irradiance', score: 9.0, note: 'Omnilux states about 30 mW/cm² for a 10-minute session — a moderate, plausible figure rather than an inflated peak claim. The brand\'s figure; no independent measurement found.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Red 633 nm + near-infrared 830 nm — the two wavelengths most used in skin studies. No blue / amber distraction.' },
    { criterionId: 'led-count-coverage', score: 8.0, note: '132 LEDs evenly distributed across forehead, cheeks and jaw. No neck flap on the standard Contour; neck addition sold separately.' },
    { criterionId: 'clinical-evidence', score: 7.0, note: 'No published or registered trial of the Contour FACE itself (Europe PMC, ClinicalTrials.gov and Omnilux\'s own bibliography, searched October 2026). Published Omnilux studies are on other models, so they do not count for the Contour; the ones we checked — the Revive clinic panel (2005), a men\'s mask Omnilux lists as Omnilux Men (2023) and the Omnilux Clear acne mask (2025) — are also each tied to the maker (employee authors, an Omnilux advisory-board author, GlobalMed funding). The brand\'s own Contour study is unpublished, with self-reported results (company-stated). FDA 510(k) K191629 (OTC, full-face wrinkles; cleared by equivalence to an earlier LED mask without clinical data) is scored as neutral.' },
    { criterionId: 'comfort-fit', score: 9.0, note: 'Flexible silicone (medical-grade, per Omnilux) — among the most comfortable wearable masks. Sits naturally on the face, adjustable strap, unattended wear OK.' },
    { criterionId: 'value', score: 7.0, note: '$395 — premium pricing for silicone comfort (the most comfortable in our assessment) and the standard red + near-infrared pair; no device-specific trial behind the price.' },
  ],
  editorialAdjustment: { value: -0.3, reason: 'Marketing honesty — the Contour product page calls Omnilux technology “clinically proven” and cites “over 40 peer-reviewed clinical studies”, but none of them is on the Contour itself; the published studies are on other Omnilux models (checked October 2026). This is scored here, not under evidence.' },
  pros: [
    'FDA-cleared for full-face wrinkles (510(k) K191629)',
    'Red 633 nm + near-infrared 830 nm — the pair most used in skin studies',
    'Flexible silicone (medical-grade, per Omnilux) — the most comfortable mask in our assessment',
    'Moderate, plausible stated irradiance — no inflated peak claims',
  ],
  cons: [
    'No published trial of the Contour itself; Omnilux\'s published studies are on other models',
    'Premium pricing ($395)',
    'No neck flap on the standard Contour (sold separately)',
    'Single 10-minute protocol — no advanced programmability',
    'No blue / amber wavelength variants (by design)',
  ],
  bestFor: 'Best for users who want a comfortable red + near-infrared silicone mask with a simple 10-minute routine.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Omnilux product documentation, FDA 510(k) K191629 and its FDA device record, and a search for published trials (none on the Contour itself; studies of other Omnilux models were checked too). Not hands-on tested by ONDA.',
  price: { usd: 395, note: 'Contour Face; neck flap sold separately', asOf: '2026-09-30' },
  link: 'https://omniluxled.com/',
  linkType: 'official',
  content: `## Where it leads

Omnilux Contour Face leads on comfort and uses the standard red + near-infrared pair. It is FDA-cleared for full-face wrinkles (510(k) K191629); clearance means the FDA found it substantially equivalent to an earlier LED mask — here without clinical data — not FDA approval. No peer-reviewed trial of the Contour itself has been published. Omnilux's published studies are on other models; the ones we checked (the Revive clinic panel, 2005; a men's mask Omnilux lists as Omnilux Men, 2023; the Omnilux Clear acne mask, 2025) are each also tied to the maker. The brand's own Contour study is unpublished, with self-reported results. Flexible silicone (medical-grade, per Omnilux) delivers the best wearable comfort in the category.

## What are the downsides of Omnilux Contour Face?

Price and scope. At $395 Omnilux is premium-tier; competitors at half the price (LightStim, Solawave) cover lighter use cases. Single 10-minute protocol — no programmability for users wanting modes / sessions. No neck flap on the standard Contour without paying extra.

## Who should buy Omnilux Contour Face?

Choose Omnilux Contour Face if you want best-in-class silicone comfort in a red + near-infrared mask. For larger consumer market share, CurrentBody Series 2. For dermatology-brand alternative, Dr. Dennis Gross SpectraLite. For handheld at lower price, LightStim.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — photobiomodulation and cellular ATP
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid) — red light as mitochondrial-energy adjunct
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors)
`,
  references: [
    { label: 'Omnilux — official site', url: 'https://omniluxled.com/' },
    { label: 'FDA 510(k) database — K191629, faceLITE LED mask (product code OHS; FDA device record lists it as Omnilux Contour FACE)', url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K191629' },
    { label: 'FDA GUDID device record — Omnilux Contour FACE, model TN19G (DI 05060534510128)', url: 'https://accessgudid.nlm.nih.gov/devices/05060534510128' },
  ],
  relatedSlugs: ['currentbody-series-2', 'dr-dennis-gross-spectralite', 'lumara-viso'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is the Omnilux Contour Face worth it?", a: "The Omnilux Contour Face is worth it if comfort matters most. It is FDA-cleared for wrinkles (510(k) K191629), but no trial of this mask itself has been published; Omnilux's published studies are on other models. It has a moderate, plausible stated irradiance and, in our assessment, the most comfortable fit, from flexible silicone (medical-grade, per Omnilux). Programmability is minimal." },
    { q: "How much does the Omnilux Contour Face cost?", a: "The Omnilux Contour Face is listed at $395. The neck flap is not included with the standard Contour and is sold separately, so budget extra if you want neck coverage as well as the face." },
    { q: "What are the downsides of the Omnilux Contour Face?", a: "It carries premium $395 pricing, the standard version has no neck flap, it offers only a single 10-minute protocol with no advanced programmability, and it has no blue or amber wavelength variants (by design). No trial of the mask itself has been published." },
    { q: "Omnilux Contour Face vs Lumara Viso: which is better?", a: "Neither mask has a published trial of its own. Omnilux is cheaper ($395); the Lumara Viso offers more LEDs, three wavelengths and an included neck flap, and costs more at $650." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-10-10',
}

export default omniluxContourFace
