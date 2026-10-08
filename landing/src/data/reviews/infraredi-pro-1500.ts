import type { ToolReviewInput } from './types'

const infraredi: ToolReviewInput = {
  slug: 'infraredi-pro-1500',
  name: 'Infraredi Pro 1500',
  brand: 'Infraredi',
  category: 'red-light',
  productType: 'Large-panel red + NIR LED therapy device (Australia / US)',
  description:
    'ONDA review of the Infraredi Pro 1500 — large-panel red light therapy device popular in AU/NZ and US markets. Scored on irradiance, EMF and value.',
  verdict:
    'Strong large-panel value pick — Joovv-class size at meaningfully lower price, with the trade being a less mature brand.',
  summary:
    'The Infraredi Pro 1500 is no longer listed on Infraredi’s store; its closest current equivalent is the Pro Max 2.0 ($1,019 on sale, list $1,199; 210 dual-lens LEDs, five wavelengths, base stand, 3-year warranty, 60-day trial). It remains the large-panel value-tier choice — comparable size to the MitoPRO 1500 at a lower price. The original Pro 1500 used four wavelengths (630 + 660 + 830 + 850 nm), independently-tested irradiance close to claimed figures, EMF in the same range as the established players. The trade is the brand — Infraredi is newer than Joovv or Mito Red, and the multi-year reliability track record is thinner.',
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Manufacturer-claimed ~140 mW/cm² at 0" / ~60 mW/cm² at 6". Independent meter readings within 10% of stated 6" figures.' },
    { criterionId: 'wavelengths', score: 8.5, note: 'Four wavelengths (630 + 660 + 830 + 850 nm) — the spectrum of the original MitoPRO 1500; the current 1500X adds 590 and 810 nm.' },
    { criterionId: 'build-emf-flicker', score: 8.0, note: 'EMF tested at <0.5 mG at 6", flicker rate disclosed. Build is competent — aluminium back, glass front; multi-year warranty.' },
    { criterionId: 'coverage', score: 8.5, note: 'Large panel — half-body coverage comparable to MitoPRO 1500. Base stand included; 3-year warranty.' },
    { criterionId: 'evidence', score: 7.0, note: 'Marketing is reasonable; references underlying photobiomodulation literature without overreach.' },
    { criterionId: 'value', score: 8.0, note: '$1,019 (Pro Max 2.0, on sale) for a panel size comparable to MitoPRO 1500X ($1,299). Strong value in the large-panel tier.' },
  ],
  pros: [
    'Large-panel size at about $1,019 — cheaper than MitoPRO 1500X for comparable coverage',
    'Four-wavelength coverage matches the original MitoPRO 1500 spectrum',
    'Stand and door mount included rather than upsold',
    'EMF testing published',
  ],
  cons: [
    'Newer brand — multi-year reliability track record is thinner',
    'EMF and flicker testing less independently re-verified than Joovv or PlatinumLED',
    'Smaller community / biohacker following than Mito Red',
  ],
  bestFor: 'Best for buyers who want MitoPRO-size coverage for about $280 less and accept a newer brand.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Infraredi product documentation, independent irradiance/EMF reports from biohacker review sites and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 1019, note: 'Pro 1500 no longer listed; current equivalent Pro Max 2.0 on infraredi.com ($1,019 sale, list $1,199); base stand included, 3-year warranty, 60-day trial', asOf: '2026-10-01' },
  link: 'https://www.infraredi.com/products/infraredi-pro-max',
  linkType: 'official',
  content: `## Where it leads

Infraredi Pro 1500 is the large-panel value pick. Note: Infraredi no longer lists the Pro 1500; the closest current model is the Pro Max 2.0 ($1,019 on sale, five wavelengths, base stand, 3-year warranty, 60-day trial). Comparable coverage to MitoPRO 1500, four-wavelength spectrum (630 + 660 + 830 + 850 nm, two fewer bands than the current 1500X), comparable EMF testing — at about $280 less than the 1500X, with a base stand included rather than sold separately. For buyers who want the MitoPRO 1500 shape without the brand premium, Infraredi is the right shape.

## What are the downsides of Infraredi Pro 1500?

Brand maturity. Infraredi is newer than Joovv or Mito Red, and the multi-year reliability track record is thinner. EMF and flicker testing is published but less independently re-verified than the larger brands.

## Who should buy Infraredi Pro 1500?

Choose Infraredi Pro 1500 if MitoPRO-class large-panel coverage for about $280 less is the deciding criterion and you are comfortable with a newer brand. For the established biohacker community, Mito Red. For pure budget, Hooga.

---

## Background reading

The photobiomodulation mechanism behind why red light therapy works.

- [Mitochondrial DNA and red light](/articles/mitochondrial-dna-red-light) — how 660/850 nm photons reach the mitochondria and what they do there
- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why photobiomodulation drives mitochondrial density up
- [Longevity hardware and cellular cleanup](/articles/longevity-hardware-cellular-cleanup) — how RLT fits the broader autophagy / mitophagy stack
`,
  references: [
    { label: 'Infraredi Pro Max 2.0 (current Pro 1500 equivalent) — official product page', url: 'https://www.infraredi.com/products/infraredi-pro-max' },
    { label: "Hamblin 2019 — Photobiomodulation for Alzheimer's disease: has the light dawned? (Photonics)", url: 'https://doi.org/10.3390/photonics6030077' },
  ],
  relatedSlugs: ['mito-red-mitopro-1500', 'hooga-hg500', 'biolight-pro-900'],
  faq: [
    { q: "Infraredi Pro 1500 vs MitoPRO 1500: which is better?", a: "The Infraredi Pro 1500 matches the MitoPRO 1500 on panel size for about $280 less (the current Pro Max 2.0 at $1,019 vs the 1500X at $1,299), with five wavelengths to the 1500X’s six and a base stand included. Mito Red has the more established brand, a larger biohacker community and a longer reliability record. Infraredi wins on price." },
    { q: "How much does the Infraredi Pro 1500 cost?", a: "Infraredi no longer lists the Pro 1500; its closest current model, the Pro Max 2.0, costs $1,019 on sale (list $1,199), with a base stand, 3-year warranty and 60-day trial. That makes it a strong value for a large panel." },
    { q: "What are the downsides of the Infraredi Pro 1500?", a: "Infraredi is a newer brand, so its multi-year reliability record is thinner than Joovv or Mito Red. Its published EMF and flicker results have been less independently re-verified than those of Joovv or PlatinumLED." },
  ],
  datePublished: '2026-05-23',
  dateModified: '2026-10-01',
}

export default infraredi
