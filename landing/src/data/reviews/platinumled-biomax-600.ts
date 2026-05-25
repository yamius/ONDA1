import type { ToolReview } from './types'

const platinumledBiomax600: ToolReview = {
  slug: 'platinumled-biomax-600',
  name: 'PlatinumLED BIOMAX 600',
  brand: 'PlatinumLED',
  category: 'red-light',
  productType: 'Mid-size red + NIR LED therapy panel',
  description:
    'ONDA review of the PlatinumLED BIOMAX 600 — mid-size five-wavelength red light panel with strong third-party EMF testing. Scored on irradiance, EMF discipline and value.',
  verdict:
    'Strong mid-size panel with the richest wavelength spectrum and clean EMF discipline. Joovv-class build at a tier-lower price.',
  summary:
    'The PlatinumLED BIOMAX 600 is the smaller flagship of the BIOMAX line — five-wavelength coverage (480 + 630 + 660 + 810 + 830 + 850 nm), independently-tested EMF and flicker, and a build quality close to Joovv at meaningfully lower price. PlatinumLED has been in the consumer photobiomodulation market longer than most and the line has matured. Mid-size means the panel pairs well with a stand for targeted-area work; full-body requires two.',
  overallScore: 8.2,
  scores: [
    { criterionId: 'irradiance', score: 8.5, note: 'Manufacturer-claimed peak ~149 mW/cm² at 0"; ~70 mW/cm² at 6". Independent verification within 10% of stated 6" figures.' },
    { criterionId: 'wavelengths', score: 9.0, note: 'Six-wavelength coverage (480 + 630 + 660 + 810 + 830 + 850 nm) — broader than even MitoPRO. The 480 nm blue is unusual and a small share of total output.' },
    { criterionId: 'build-emf-flicker', score: 9.0, note: 'Third-party EMF testing at <0.3 mG at 6", flicker rate disclosed and low. PlatinumLED published its lab testing publicly — rare in the category.' },
    { criterionId: 'coverage', score: 7.5, note: 'Mid-size panel — half-body for upper torso. Smaller than Joovv Solo or MitoPRO 1500; pairs well with targeted work but requires stacking for full body.' },
    { criterionId: 'evidence', score: 7.5, note: 'PlatinumLED references real photobiomodulation literature; no FDA Class II registration like Joovv but the marketing is restrained relative to category norms.' },
    { criterionId: 'value', score: 7.5, note: '$999 — meaningfully cheaper than Joovv Solo 3.0 and MitoPRO 1500 for comparable build and broader spectrum. Strong value in the premium tier.' },
  ],
  pros: [
    'Broadest wavelength spectrum in this list — six published wavelengths',
    'Publicly-published third-party EMF and flicker testing',
    'Cheaper than Joovv and MitoPRO at $999',
    'Mature brand with long consumer-RLT track record',
  ],
  cons: [
    'Mid-size panel — smaller treatment area than MitoPRO 1500 or full Joovv stack',
    'No FDA Class II registration',
    'Six-wavelength claim relies on small LED counts for the less-common bands (480, 810)',
    'Stand and mount hardware sold separately',
  ],
  bestFor: 'Best for buyers who want broad-spectrum coverage and verified EMF discipline at sub-Joovv pricing.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from PlatinumLED product documentation, published third-party EMF and flicker test reports and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 999, note: 'one-time; stand/mount hardware extra', asOf: '2026-05-23' },
  link: 'https://www.platinumtherapylights.com/biomax600',
  linkType: 'official',
  content: `## Where it leads

PlatinumLED BIOMAX 600 is the panel that wins on spectrum breadth and EMF discipline at the price tier just below Joovv and MitoPRO. The six-wavelength coverage (480 + 630 + 660 + 810 + 830 + 850 nm) is wider than anything else in this list, and PlatinumLED is one of the few brands that publicly publishes its third-party EMF and flicker test reports rather than just claiming the numbers.

## Where it falls short

The BIOMAX 600 is mid-size — smaller than Joovv Solo 3.0 or MitoPRO 1500. For full-body coverage you stack two. The six-wavelength claim is partly marketing: the 480 nm blue is a small share of total output, and the smaller LED counts for the less-common bands mean their effective dose is modest. No FDA Class II registration like Joovv.

## Who it is for

Choose PlatinumLED BIOMAX 600 if you want broad-spectrum coverage and published EMF testing at $300 below Joovv, and the mid-size panel fits your use case. For larger half-body or modular full-body needs, Mito Red or Joovv. For pure budget, Hooga HG500.`,
  references: [
    { label: 'PlatinumLED BIOMAX 600 — official product page', url: 'https://www.platinumtherapylights.com/biomax600' },
    { label: 'PlatinumLED third-party EMF and irradiance test reports', url: 'https://www.platinumtherapylights.com/testing' },
  ],
  relatedSlugs: ['joovv-solo-3', 'mito-red-mitopro-1500', 'biolight-pro-900'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default platinumledBiomax600
