import type { ToolReview } from './types'

const bioLightPro900: ToolReview = {
  slug: 'biolight-pro-900',
  name: 'BioLight Pro 900',
  brand: 'BioLight',
  category: 'red-light',
  productType: 'Mid-size red + NIR LED therapy panel',
  description:
    'ONDA review of the BioLight Pro 900 — mid-size red light panel pitched as a Joovv alternative. Scored on irradiance, EMF, build and value.',
  verdict:
    'Solid mid-size Joovv alternative — competent build, two-wavelength coverage, no standout differentiator at the price.',
  summary:
    'The BioLight Pro 900 sits in the same mid-tier as the PlatinumLED BIOMAX 600 — full-spectrum (600 nm + 660 nm + 830 nm + 850 nm), half-body coverage, third-party EMF testing in the same range as Joovv. The pitch is "Joovv alternative" without the brand premium; the execution is competent rather than category-leading. Reasonable mid-premium pick if you want a four-wavelength panel under $1,000.',
  overallScore: 7.6,
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Manufacturer-claimed ~120 mW/cm² at 0"; ~50 mW/cm² at 6". Independent verification within 10–15% of stated figures.' },
    { criterionId: 'wavelengths', score: 8.5, note: 'Four wavelengths (600 + 660 + 830 + 850 nm) — comparable to MitoPRO without the 630 nm. Standard photobiomodulation coverage.' },
    { criterionId: 'build-emf-flicker', score: 8.0, note: 'Third-party EMF tested at <0.5 mG at 6". Build is competent — aluminium back, glass front, multi-year warranty.' },
    { criterionId: 'coverage', score: 7.5, note: 'Mid-size half-body panel. Stand and mount hardware included; full-body requires stacking.' },
    { criterionId: 'evidence', score: 7.0, note: 'No FDA Class II registration. Marketing is reasonable for the category; no obvious overreach.' },
    { criterionId: 'value', score: 7.5, note: '$899 — undercuts Joovv and MitoPRO by ~$300–$400 for comparable build. Solid value in the mid-premium tier.' },
  ],
  pros: [
    'Four-wavelength coverage at $899 — cheaper than MitoPRO with comparable build',
    'Third-party EMF testing published',
    'Stand and door-mount hardware included',
    'Multi-year warranty',
  ],
  cons: [
    'No category-defining differentiator — competent rather than standout',
    'No FDA Class II registration',
    'Smaller brand following than Joovv or Mito Red',
    'Wavelength choices conservative — no 480, 810 or 940 nm',
  ],
  bestFor: 'Best for buyers who want a competent four-wavelength panel under $1,000 without the Joovv brand premium.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from BioLight product documentation, third-party EMF and irradiance test reports and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 899, note: 'one-time; stand/mount included', asOf: '2026-05-23' },
  link: 'https://biolight.shop/products/biolight-pro-900',
  linkType: 'official',
  content: `## Where it leads

BioLight Pro 900 is the panel that does most things right without doing any one thing exceptionally. Four-wavelength coverage matches the MitoPRO 1500 spectrum (minus the 630 nm), independent EMF testing is published in the same range as Joovv, stand and mount hardware are included rather than upsold, and the price undercuts Joovv and MitoPRO by $300–$400. Solid mid-premium execution.

## Where it falls short

Nothing about the BioLight Pro 900 stands out the way Joovv stands out on modular scaling, MitoPRO on spectrum, PlatinumLED on EMF testing or GembaRed on engineering rigour. It is a competent panel at a fair price; the lack of differentiation is the differentiator. Smaller brand following also means thinner long-term reliability data.

## Who it is for

Choose BioLight Pro 900 if you want a four-wavelength mid-size panel under $1,000 and you do not specifically value any of the things Joovv, Mito Red, PlatinumLED or GembaRed lead on. For most buyers, one of those four is the right shape; BioLight wins specifically when value at the four-wavelength tier is the deciding criterion.`,
  references: [
    { label: 'BioLight Pro 900 — official product page', url: 'https://biolight.shop/products/biolight-pro-900' },
    { label: 'Photobiomodulation therapy clinical review (Photonics)', url: 'https://www.mdpi.com/2304-6732/6/3/77' },
  ],
  relatedSlugs: ['mito-red-mitopro-1500', 'platinumled-biomax-600', 'hooga-hg500'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default bioLightPro900
