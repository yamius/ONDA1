import type { ToolReview } from './types'

const gembaredVesta: ToolReview = {
  slug: 'gembared-vesta',
  name: 'GembaRed Vesta',
  brand: 'GembaRed',
  category: 'red-light',
  productType: 'EMF-shielded full-spectrum LED therapy panel',
  description:
    'ONDA review of the GembaRed Vesta — the EMF-shielded premium red light panel built by an in-the-industry founder. Scored on irradiance, EMF, build and value.',
  verdict:
    'The build-and-EMF specialist of the category — fully-shielded, six-wavelength, founder-engineered. Premium pricing for premium engineering rigour.',
  summary:
    'The GembaRed Vesta is the panel built by a former medical-LED engineer for buyers who treat EMF and flicker as first-class criteria. Six-wavelength coverage (480 + 630 + 660 + 810 + 830 + 850 nm), fully-shielded power supply, third-party EMF tested to <0.1 mG at 6", and flicker measured below the threshold for photobiology research. Premium-priced, deliberately niche; the audiophile of red light therapy.',
  overallScore: 8.1,
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Manufacturer-claimed ~120 mW/cm² at 0" / ~60 mW/cm² at 6"; independent verification within 5% of stated figures. Honestly specced.' },
    { criterionId: 'wavelengths', score: 9.0, note: 'Six wavelengths (480 + 630 + 660 + 810 + 830 + 850 nm), matched to published photobiomodulation literature. Same spectrum as PlatinumLED BIOMAX 600.' },
    { criterionId: 'build-emf-flicker', score: 9.5, note: 'Fully-shielded power supply, EMF <0.1 mG at 6" — lowest in this list. Flicker at sub-research-threshold levels. Build quality is the brand’s reason to exist.' },
    { criterionId: 'coverage', score: 7.5, note: 'Mid-size panel — comparable to PlatinumLED BIOMAX 600. Half-body for targeted-area use; full-body requires stacking.' },
    { criterionId: 'evidence', score: 7.5, note: 'No FDA Class II registration. Founder-engineer publishes the technical reasoning behind the EMF-shielding choices, which is unusual transparency for the category.' },
    { criterionId: 'value', score: 6.5, note: '$1,199 — premium pricing in the BIOMAX 600 / MitoPRO range. Justified for users who care about the EMF discipline; not otherwise.' },
  ],
  pros: [
    'Lowest EMF measurement in the consumer red-light category',
    'Founder-engineer transparency — design rationale published',
    'Six-wavelength coverage same as PlatinumLED BIOMAX 600',
    'Sub-research-threshold flicker rate',
  ],
  cons: [
    'Premium pricing without the size or modularity of Joovv / Mito Red',
    'Smaller brand — multi-year reliability track record is thinner',
    'No FDA Class II registration',
    'Niche positioning — EMF discipline appeals to a subset of buyers',
  ],
  bestFor: 'Best for buyers who treat EMF and flicker as first-class criteria and want the cleanest possible build at premium price.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from GembaRed product documentation, published third-party EMF and flicker test reports, founder-published engineering notes and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 1199, note: 'one-time', asOf: '2026-05-23' },
  link: 'https://gembared.com/products/vesta',
  linkType: 'official',
  content: `## Where it leads

The GembaRed Vesta is the panel built by someone who actually cares about the power-supply hardware behind the LEDs. The fully-shielded design produces the lowest EMF measurement in this list at the standard treatment distance, flicker is below research-threshold levels, and the six-wavelength spectrum matches the underlying photobiomodulation literature exactly. The founder publishes the engineering rationale openly, which is rare in a category dominated by marketing claims.

## Where it falls short

GembaRed is a smaller brand than Joovv, Mito Red or PlatinumLED. Reliability track record is shorter, mid-size panel format means full-body needs stacking, and the premium pricing puts it in the same range as MitoPRO and BIOMAX 600 without the modular scalability of Joovv. The EMF discipline is the reason to choose it; for users who do not weight that, the value proposition is thinner.

## Who it is for

Choose GembaRed Vesta if EMF and flicker are first-class criteria — you want the cleanest possible build and you trust the engineer-founder transparency. For modular full-body scaling, Joovv. For maximum half-body coverage, MitoPRO 1500. For the broadest established brand and the same EMF discipline at lower price, PlatinumLED BIOMAX 600.`,
  references: [
    { label: 'GembaRed Vesta — official product page', url: 'https://gembared.com/products/vesta' },
    { label: 'GembaRed engineering notes on EMF shielding', url: 'https://gembared.com/blogs/news' },
  ],
  relatedSlugs: ['joovv-solo-3', 'platinumled-biomax-600', 'rubylx-lyra-pro'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default gembaredVesta
