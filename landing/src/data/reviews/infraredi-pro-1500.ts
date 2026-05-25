import type { ToolReview } from './types'

const infraredi: ToolReview = {
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
    'The Infraredi Pro 1500 is the large-panel value-tier choice — comparable size to the MitoPRO 1500 at meaningfully lower price. Four-wavelength coverage (630 + 660 + 830 + 850 nm), independently-tested irradiance close to claimed figures, EMF in the same range as the established players. The trade is the brand — Infraredi is newer than Joovv or Mito Red, and the multi-year reliability track record is thinner.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Manufacturer-claimed ~140 mW/cm² at 0" / ~60 mW/cm² at 6". Independent meter readings within 10% of stated 6" figures.' },
    { criterionId: 'wavelengths', score: 8.5, note: 'Four wavelengths (630 + 660 + 830 + 850 nm) — same spectrum as MitoPRO 1500.' },
    { criterionId: 'build-emf-flicker', score: 8.0, note: 'EMF tested at <0.5 mG at 6", flicker rate disclosed. Build is competent — aluminium back, glass front; multi-year warranty.' },
    { criterionId: 'coverage', score: 8.5, note: 'Large panel — half-body coverage comparable to MitoPRO 1500. Stand and door mount included.' },
    { criterionId: 'evidence', score: 7.0, note: 'No FDA Class II registration. Marketing is reasonable; references underlying photobiomodulation literature without overreach.' },
    { criterionId: 'value', score: 8.0, note: '$999 for a panel size comparable to MitoPRO 1500 ($1,199). Strong value in the large-panel tier.' },
  ],
  pros: [
    'Large-panel size at $999 — cheaper than MitoPRO 1500 for comparable coverage',
    'Four-wavelength coverage matches the MitoPRO spectrum',
    'Stand and door mount included rather than upsold',
    'EMF testing published',
  ],
  cons: [
    'Newer brand — multi-year reliability track record is thinner',
    'No FDA Class II registration',
    'EMF and flicker testing less independently re-verified than Joovv or PlatinumLED',
    'Smaller community / biohacker following than Mito Red',
  ],
  bestFor: 'Best for buyers who want MitoPRO-size coverage at $200 less and accept a newer brand.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Infraredi product documentation, independent irradiance/EMF reports from biohacker review sites and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 999, note: 'one-time; stand and mount included', asOf: '2026-05-23' },
  link: 'https://infraredi.com/products/infraredi-pro-1500',
  linkType: 'official',
  content: `## Where it leads

Infraredi Pro 1500 is the large-panel value pick. Comparable coverage to MitoPRO 1500, comparable four-wavelength spectrum (630 + 660 + 830 + 850 nm), comparable EMF testing — at $200 less and with stand and door mount included rather than sold separately. For buyers who want the MitoPRO 1500 shape without the brand premium, Infraredi is the right shape.

## Where it falls short

Brand maturity. Infraredi is newer than Joovv or Mito Red, and the multi-year reliability track record is thinner. EMF and flicker testing is published but less independently re-verified than the larger brands. No FDA Class II registration.

## Who it is for

Choose Infraredi Pro 1500 if MitoPRO-class large-panel coverage at $200 less is the deciding criterion and you are comfortable with a newer brand. For the established biohacker community, Mito Red. For pure budget, Hooga.`,
  references: [
    { label: 'Infraredi Pro 1500 — official product page', url: 'https://infraredi.com/products/infraredi-pro-1500' },
    { label: 'Photobiomodulation therapy clinical review (Photonics)', url: 'https://www.mdpi.com/2304-6732/6/3/77' },
  ],
  relatedSlugs: ['mito-red-mitopro-1500', 'hooga-hg500', 'biolight-pro-900'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default infraredi
