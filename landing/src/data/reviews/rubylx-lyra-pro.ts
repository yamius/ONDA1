import type { ToolReviewInput } from './types'

const rubylxLyraPro: ToolReviewInput = {
  slug: 'rubylx-lyra-pro',
  name: 'RubyLx Lyra Pro',
  brand: 'RubyLx',
  category: 'red-light',
  productType: 'Independently-tested premium red + NIR LED panel',
  description:
    'ONDA review of the RubyLx Lyra Pro — premium red light panel with extensive third-party irradiance, EMF and flicker testing. Scored on evidence, build and value.',
  verdict:
    'The testing-transparency premium pick — third-party verified on every spec, premium-priced, smaller brand than Joovv.',
  summary:
    'The RubyLx Lyra Pro is the panel for buyers who want every published specification independently verified. RubyLx submits each model to third-party labs for irradiance, EMF, flicker and spectrum measurement and publishes the full reports. The Lyra Pro carries five wavelengths (630 + 660 + 810 + 830 + 850 nm) with build and EMF discipline in the Joovv-tier. Smaller brand than the category leaders; the testing transparency is the value.',
  scores: [
    { criterionId: 'irradiance', score: 9.0, note: 'Third-party measured ~125 mW/cm² at 0" / ~62 mW/cm² at 6". Independent verification matches manufacturer claim within 5%.' },
    { criterionId: 'wavelengths', score: 8.5, note: 'Five wavelengths (630 + 660 + 810 + 830 + 850 nm) — covers the standard photobiomodulation range without exotic additions.' },
    { criterionId: 'build-emf-flicker', score: 9.0, note: 'Third-party EMF at <0.3 mG at 6", flicker rate published and below research thresholds. Aluminium build with multi-year warranty.' },
    { criterionId: 'coverage', score: 7.5, note: 'Mid-large panel — between PlatinumLED BIOMAX 600 and MitoPRO 1500. Stand included; full-body requires stacking.' },
    { criterionId: 'evidence', score: 7.5, note: 'No FDA Class II registration but RubyLx publishes full third-party lab reports for every claimed spec — the most-tested panel in this list.' },
    { criterionId: 'value', score: 7.0, note: '$1,099 — premium pricing but cheaper than Joovv. The third-party testing transparency is what justifies the premium over BioLight.' },
  ],
  pros: [
    'Most third-party tested panel in the consumer red-light category',
    'Five-wavelength coverage at premium build quality',
    'Lab reports published for irradiance, EMF, flicker and spectrum',
    'Cheaper than Joovv with comparable EMF discipline',
  ],
  cons: [
    'Smaller brand following — reliability track record shorter than Joovv or Mito Red',
    'No FDA Class II registration',
    'Mid-large panel — full-body requires stacking',
    'No modular ecosystem like Joovv',
  ],
  bestFor: 'Best for buyers who want every published spec independently verified before purchase.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from RubyLx product documentation, the full published third-party lab reports and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 1099, note: 'one-time; stand included', asOf: '2026-05-23' },
  link: 'https://rubylx.com/products/lyra-pro',
  linkType: 'official',
  content: `## Where it leads

RubyLx Lyra Pro is the panel built for buyers who do not trust marketing-stated specs. RubyLx submits each model to third-party labs for irradiance, EMF, flicker and spectrum verification, then publishes the full lab reports. Independent measurements come in within 5% of manufacturer claims across the board — the tightest match in this list. Five-wavelength coverage, premium build, EMF and flicker discipline match the Joovv/GembaRed tier.

## What are the downsides of RubyLx Lyra Pro?

RubyLx is a smaller brand than Joovv, Mito Red or PlatinumLED. The multi-year reliability track record is shorter, the modular ecosystem (Joovv) is absent, and the no FDA Class II registration carries the same implication as for every panel here except Joovv and the MitoPRO 1500X. The pricing is premium but justified by the testing transparency.

## Who should buy RubyLx Lyra Pro?

Choose RubyLx Lyra Pro if every published specification must be independently verifiable before purchase, and you trust a smaller brand’s testing discipline over a larger brand’s marketing. For modular scaling, Joovv. For EMF-shielded engineering, GembaRed. For pure value, Hooga.

---

## Background reading

The photobiomodulation mechanism behind why red light therapy works.

- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where photobiomodulation slots into a reset routine
- [Mitochondrial DNA and red light](/articles/mitochondrial-dna-red-light) — how 660/850 nm photons reach the mitochondria and what they do there
- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why photobiomodulation drives mitochondrial density up
`,
  references: [
    { label: 'RubyLx Lyra Pro — official product page', url: 'https://rubylx.com/products/lyra-pro' },
    { label: 'RubyLx third-party lab reports — Lyra Pro', url: 'https://rubylx.com/pages/lab-testing' },
  ],
  relatedSlugs: ['gembared-vesta', 'platinumled-biomax-600', 'joovv-solo-3'],
  faq: [
    { q: "Is the RubyLx Lyra Pro worth it?", a: "The Lyra Pro is worth it for buyers who want every spec independently verified. It is the most third-party tested panel in consumer red light, with published lab reports for irradiance, EMF, flicker and spectrum, and five-wavelength coverage. It lacks FDA Class II registration." },
    { q: "How much does the RubyLx Lyra Pro cost?", a: "The RubyLx Lyra Pro is listed at $1,099 one-time, with the stand included. That is cheaper than Joovv, though full-body coverage requires stacking more than one panel. Its published lab reports cover irradiance, EMF, flicker and spectrum, and it offers five-wavelength coverage." },
    { q: "What are the downsides of the RubyLx Lyra Pro?", a: "RubyLx has a smaller brand following, so its reliability track record is shorter than Joovv or Mito Red. The Lyra Pro has no FDA Class II registration, full-body use requires stacking panels, and there is no modular ecosystem like Joovv's." },
    { q: "RubyLx Lyra Pro vs Joovv: which is better?", a: "The Lyra Pro is cheaper than Joovv with comparable EMF discipline and more published third-party lab testing. Joovv offers a modular ecosystem and a longer reliability track record. Pick RubyLx for verified specs and value, Joovv for its ecosystem." },
  ],
  datePublished: '2026-05-23',
  dateModified: '2026-10-01',
}

export default rubylxLyraPro
