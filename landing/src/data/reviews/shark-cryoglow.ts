import type { ToolReviewInput } from './types'

const sharkCryoglow: ToolReviewInput = {
  slug: 'shark-cryoglow',
  name: 'Shark CryoGlow',
  brand: 'Shark Beauty',
  category: 'red-light-mask',
  productType: 'Cooling + LED hybrid face mask',
  description:
    'ONDA review of the Shark CryoGlow — Shark Beauty cooling + LED hybrid face mask combining red light therapy with active facial cooling. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Most novel form factor in 2026 — active cooling combined with red + blue LED. Cooling is the differentiator; LED dose is modest by design.',
  summary:
    'Shark CryoGlow is the 2026 novelty entry — combining red + blue LED with active facial cooling via integrated thermoelectric elements. Shark Beauty brand crossover from vacuum / appliance pedigree. The cooling element may feel soothing and help with morning puffiness (it is not an anti-inflammatory treatment); LED dose is modest because the device prioritises cooling. Hybrid form factor compromises both modalities mildly to deliver them together.',
  scores: [
    { criterionId: 'irradiance', score: 5.5, note: 'Modest LED irradiance — cooling element shares the form factor and limits dose. Designed for combined cooling + light rather than peak LED dose.' },
    { criterionId: 'wavelength-coverage', score: 7.0, note: 'Red 633 nm + blue 415 nm. Standard dual-spectrum coverage.' },
    { criterionId: 'led-count-coverage', score: 6.0, note: 'LED coverage compromised by cooling-element placement. Less even than pure-LED masks.' },
    { criterionId: 'clinical-evidence', score: 5.0, note: 'FDA registered (a listing, not clearance or approval). Brand-funded research on the cooling + LED combination. Limited peer-reviewed validation on the specific hybrid approach.' },
    { criterionId: 'comfort-fit', score: 7.0, note: 'Cooling feels excellent — genuinely novel sensation. Hybrid form factor heavier than pure silicone alternatives.' },
    { criterionId: 'value', score: 7.0, note: '$349 — mid-tier pricing for the cooling + LED novelty. Justified for users wanting both modalities; weak if only buying for LED dose.' },
  ],
  pros: [
    'Most novel form factor in 2026 — cooling + LED combined',
    'Cooling element feels soothing and may ease morning puffiness',
    'Dual red + blue spectrum',
    'Shark Beauty brand pedigree',
  ],
  cons: [
    'LED dose compromised by cooling element',
    'Hybrid form factor heavier than pure silicone',
    'Limited peer-reviewed clinical evidence on the cooling + LED combination',
    'Cooling adds complexity to daily use vs simpler mask',
  ],
  bestFor: 'Best for users wanting cooling + LED combined into one device — novel hybrid form factor over single-modality LED dose maximalism.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Shark Beauty product documentation, the brand’s FDA-registration statement and 2026 consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 349, note: 'CryoGlow standalone', asOf: '2026-05-28' },
  link: 'https://www.sharkbeauty.com/',
  linkType: 'official',
  content: `## Where it leads

Shark CryoGlow is the 2026 hybrid form-factor novelty — active facial cooling combined with red + blue LED in one device. Cooling element is genuinely useful and Shark Beauty brand pedigree is real (Shark vacuum / appliance crossover into beauty hardware).

## What are the downsides of Shark CryoGlow?

LED dose and hybrid trade-offs. Cooling element shares the form factor with LEDs and limits dose. Hybrid form factor adds weight and complexity vs pure silicone masks. Limited peer-reviewed clinical evidence on the cooling + LED combination specifically.

## Who should buy Shark CryoGlow?

Choose Shark CryoGlow if you want cooling + LED combined into one device for a soothing, de-puffing routine. For pure LED clinical evidence, Omnilux Contour Face. For pure LED consumer market leader, CurrentBody Series 2. For budget multi-modality handheld, Solawave Wand.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid)
`,
  references: [
    { label: 'Shark Beauty — official site', url: 'https://www.sharkbeauty.com/' },
  ],
  relatedSlugs: ['solawave-wand-4-in-1', 'higherdose-red-light-face-mask', 'theraface-mask'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is the Shark CryoGlow worth it?", a: "The Shark CryoGlow is worth it if you want cooling and LED in one device. Its cooling element feels soothing and may ease puffiness, and it offers red plus blue light. If maximum LED dose is your priority, a pure silicone mask is the better pick, because the cooling element compromises LED dose." },
    { q: "How much does the Shark CryoGlow cost?", a: "The Shark CryoGlow costs $349 as a standalone device. For that price you get a hybrid mask combining a cooling element with dual red and blue LED spectrum, backed by the Shark Beauty brand, rather than a single-modality LED mask." },
    { q: "What are the downsides of the Shark CryoGlow?", a: "The CryoGlow's cooling element compromises LED dose, and the hybrid design is heavier and more complex to use daily than a pure silicone mask. There is also limited peer-reviewed clinical evidence on the cooling-plus-LED combination specifically, so its benefits rest more on concept than proof." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-10-10',
}

export default sharkCryoglow
