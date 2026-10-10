import type { ToolReviewInput } from './types'

const hoogaHg500: ToolReviewInput = {
  slug: 'hooga-hg500',
  name: 'Hooga HG500',
  brand: 'Hooga',
  category: 'red-light',
  productType: 'Budget biohacker red + NIR LED therapy panel',
  description:
    'ONDA review of the Hooga HG500 — the budget biohacker red light panel that beats every premium device on value. Scored on irradiance, EMF and value.',
  verdict:
    'The budget biohacker reference — solid build, honest specs, about a fifth of the cost of Joovv with most of the basic spec intact.',
  summary:
    'The Hooga HG500 is the panel that turned consumer red-light therapy into a sub-$400 category. Two-wavelength coverage (660 + 850 nm), 100 5W LEDs, independently-tested irradiance close to claimed figures, EMF measurements in the same range as panels three times the price. The trade is hardware refinement — less polished aluminium, no exotic wavelengths, smaller community than Joovv or Mito Red — but on the criteria that matter (irradiance, EMF, wavelengths) it punches well above its price tier.',
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Hooga now states 94 mW/cm² at 6" on the official product page (checked 2026-10-01). Earlier independent meter readings tracked the stated figures closely — honest specs at the price.' },
    { criterionId: 'wavelengths', score: 7.0, note: 'Two wavelengths (660 + 850 nm) — the basic biohacker default. No 630, 810, 830 or 940 nm.' },
    { criterionId: 'build-emf-flicker', score: 7.5, note: 'EMF <0.5 mG at 6", flicker rate disclosed and low. Build is competent — aluminium back, plastic front trim; 3-year warranty and 60-day returns.' },
    { criterionId: 'coverage', score: 7.5, note: 'Half-body coverage in a single panel. Stand and door-mount hardware included.' },
    { criterionId: 'evidence', score: 6.5, note: 'Hooga’s FAQ states its status accurately (the panels “are not FDA Class II or 510(k)-cleared finished devices”), more precisely than most of the category; its sales page does not (see the score adjustment).' },
    { criterionId: 'value', score: 9.5, note: '$359 for half-body coverage with verified specs — by far the best value in this list. Cheaper panels exist on Amazon but spec discipline drops fast.' },
  ],
  editorialAdjustment: { value: -0.3, reason: 'Marketing honesty — the red-light collection page says the therapy is “FDA-cleared for general wellness use”, but Hooga panels have no FDA clearance; Hooga’s own FAQ says they “are not FDA Class II or 510(k)-cleared finished devices” — the FAQ is the accurate one (checked October 2026). This is scored here, not under evidence.' },
  pros: [
    'Best value in the consumer red-light category — $359 for verified half-body specs',
    'Independent meter readings close to manufacturer claims',
    'Stand and door-mount hardware included',
    'Conservative marketing — Hooga does not overclaim',
  ],
  cons: [
    'Two-wavelength coverage only — no 630, 810 or exotic additions',
    'Smaller LED count (100 vs 200–300 in premium panels)',
    'Aluminium-and-plastic build less premium than Joovv or Mito Red',
  ],
  bestFor: 'Best for first-time red-light buyers or biohackers prioritising value over wavelength breadth and premium build.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Hooga product documentation, independent irradiance/EMF reports from biohacker review sites and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 359, note: 'one-time on hoogahealth.com; door mount and hanging kit included, mobile stand sold separately; 3-year warranty, 60-day returns', asOf: '2026-10-01' },
  link: 'https://hoogahealth.com/products/hooga-500w-red-and-near-infrared-light-therapy-panel',
  linkType: 'official',
  content: `## Where it leads

Hooga HG500 is the cheapest legitimate red-light therapy panel on the consumer market. Two-wavelength coverage (660 + 850 nm), 100 5W LEDs, honestly-specced irradiance and EMF figures in the same range as panels three times the price. Door mount and hanging kit included (a mobile stand is extra), with a 3-year warranty and 60-day returns. The marketing is restrained for the category — no peak-irradiance-at-touching-the-LED games. For first-time buyers or buyers who treat red light as one of many tools rather than the centrepiece, this is the right entry.

## What are the downsides of Hooga HG500?

You give up wavelength breadth (no 630/810/830 nm), LED count, and the premium build feel of Joovv or Mito Red. Smaller community/support footprint than the larger brands. The panel does what it does well; it just does less than premium options.

## Who should buy Hooga HG500?

Choose Hooga HG500 if budget is the deciding criterion and you want verified specs at the entry tier. For wavelength breadth, MitoPRO 1500 or PlatinumLED BIOMAX 600. For premium build and modularity, Joovv Solo 3.0.

---

## Background reading

The photobiomodulation mechanism behind why red light therapy works.

- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why photobiomodulation drives mitochondrial density up
- [Longevity hardware and cellular cleanup](/articles/longevity-hardware-cellular-cleanup) — how RLT fits the broader autophagy / mitophagy stack
- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where photobiomodulation slots into a reset routine
`,
  references: [
    { label: 'Hooga HG500 — official product page', url: 'https://hoogahealth.com/products/hooga-500w-red-and-near-infrared-light-therapy-panel' },
    { label: "Hamblin 2019 — Photobiomodulation for Alzheimer's disease: has the light dawned? (Photonics)", url: 'https://doi.org/10.3390/photonics6030077' },
  ],
  relatedSlugs: ['mito-red-mitopro-1500', 'biolight-pro-900', 'infraredi-pro-1500'],
  faq: [
    { q: "Is the Hooga HG500 worth it?", a: "Yes, for a first red-light panel. At $359 with a door mount, hanging kit, 3-year warranty and 60-day returns, the HG500 delivers independently tested irradiance close to its claims and EMF readings in the same range as panels three times the price. You give up hardware refinement and wavelength breadth, not core performance." },
    { q: "What wavelengths does the Hooga HG500 use?", a: "The HG500 uses two wavelengths, 660 nm red and 850 nm near-infrared, from 100 5W LEDs. It has no 630 nm, 810 nm or more exotic additions. Buyers who want broader spectrum coverage will need a pricier panel such as the GembaRed Vesta or Joovv." },
    { q: "Hooga HG500 vs Joovv: which should I buy?", a: "The Hooga costs about a fifth of Joovv ($1,699) while keeping most of the basic spec: honest irradiance and low EMF. Joovv adds a more premium build, more LEDs and a modular system. Choose Hooga for value, Joovv if you want the premium modular build." },
  ],
  datePublished: '2026-05-23',
  dateModified: '2026-10-10',
}

export default hoogaHg500
