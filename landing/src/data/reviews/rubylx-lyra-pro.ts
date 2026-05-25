import type { ToolReview } from './types'

const rubylxLyraPro: ToolReview = {
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
  overallScore: 8.0,
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

## Where it falls short

RubyLx is a smaller brand than Joovv, Mito Red or PlatinumLED. The multi-year reliability track record is shorter, the modular ecosystem (Joovv) is absent, and the no FDA Class II registration carries the same implication as for everyone outside Joovv. The pricing is premium but justified by the testing transparency.

## Who it is for

Choose RubyLx Lyra Pro if every published specification must be independently verifiable before purchase, and you trust a smaller brand’s testing discipline over a larger brand’s marketing. For modular scaling, Joovv. For EMF-shielded engineering, GembaRed. For pure value, Hooga.`,
  references: [
    { label: 'RubyLx Lyra Pro — official product page', url: 'https://rubylx.com/products/lyra-pro' },
    { label: 'RubyLx third-party lab reports — Lyra Pro', url: 'https://rubylx.com/pages/lab-testing' },
  ],
  relatedSlugs: ['gembared-vesta', 'platinumled-biomax-600', 'joovv-solo-3'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default rubylxLyraPro
