import type { ToolReview } from './types'

const hoogaHg500: ToolReview = {
  slug: 'hooga-hg500',
  name: 'Hooga HG500',
  brand: 'Hooga',
  category: 'red-light',
  productType: 'Budget biohacker red + NIR LED therapy panel',
  description:
    'ONDA review of the Hooga HG500 — the budget biohacker red light panel that beats every premium device on value. Scored on irradiance, EMF and value.',
  verdict:
    'The budget biohacker reference — solid build, honest specs, a third of the cost of Joovv with most of the basic spec intact.',
  summary:
    'The Hooga HG500 is the panel that turned consumer red-light therapy into a sub-$400 category. Two-wavelength coverage (660 + 850 nm), 100 5W LEDs, independently-tested irradiance close to claimed figures, EMF measurements in the same range as panels three times the price. The trade is hardware refinement — less polished aluminium, no exotic wavelengths, smaller community than Joovv or Mito Red — but on the criteria that matter (irradiance, EMF, wavelengths) it punches well above its price tier.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Manufacturer-claimed ~100 mW/cm² at 0" / ~45 mW/cm² at 6". Independent meter readings within 10% of stated 6" figures — honest specs at the price.' },
    { criterionId: 'wavelengths', score: 7.0, note: 'Two wavelengths (660 + 850 nm) — the basic biohacker default. No 630, 810, 830 or 940 nm.' },
    { criterionId: 'build-emf-flicker', score: 7.5, note: 'EMF <0.5 mG at 6", flicker rate disclosed and low. Build is competent — aluminium back, plastic front trim; multi-year warranty.' },
    { criterionId: 'coverage', score: 7.5, note: 'Half-body coverage in a single panel. Stand and door-mount hardware included.' },
    { criterionId: 'evidence', score: 6.5, note: 'No FDA Class II registration. Marketing is conservative; Hooga does not overclaim — unusual at the budget tier.' },
    { criterionId: 'value', score: 9.5, note: '$349 for half-body coverage with verified specs — by far the best value in this list. Cheaper panels exist on Amazon but spec discipline drops fast.' },
  ],
  pros: [
    'Best value in the consumer red-light category — $349 for verified half-body specs',
    'Independent meter readings close to manufacturer claims',
    'Stand and door-mount hardware included',
    'Conservative marketing — Hooga does not overclaim',
  ],
  cons: [
    'Two-wavelength coverage only — no 630, 810 or exotic additions',
    'No FDA Class II registration',
    'Smaller LED count (100 vs 200–300 in premium panels)',
    'Aluminium-and-plastic build less premium than Joovv or Mito Red',
  ],
  bestFor: 'Best for first-time red-light buyers or biohackers prioritising value over wavelength breadth and premium build.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Hooga product documentation, independent irradiance/EMF reports from biohacker review sites and the underlying photobiomodulation literature. Not hands-on tested by ONDA.',
  price: { usd: 349, note: 'one-time; stand and door mount included', asOf: '2026-05-23' },
  link: 'https://hoogahealth.com/products/hooga-hg500',
  linkType: 'official',
  content: `## Where it leads

Hooga HG500 is the cheapest legitimate red-light therapy panel on the consumer market. Two-wavelength coverage (660 + 850 nm), 100 5W LEDs, honestly-specced irradiance and EMF figures in the same range as panels three times the price. Stand and door-mount included. The marketing is restrained for the category — no peak-irradiance-at-touching-the-LED games. For first-time buyers or buyers who treat red light as one of many tools rather than the centrepiece, this is the right entry.

## Where it falls short

You give up wavelength breadth (no 630/810/830 nm), LED count, and the premium build feel of Joovv or Mito Red. No FDA Class II registration. Smaller community/support footprint than the larger brands. The panel does what it does well; it just does less than premium options.

## Who it is for

Choose Hooga HG500 if budget is the deciding criterion and you want verified specs at the entry tier. For wavelength breadth, MitoPRO 1500 or PlatinumLED BIOMAX 600. For premium build and FDA registration, Joovv Solo 3.0.`,
  references: [
    { label: 'Hooga HG500 — official product page', url: 'https://hoogahealth.com/products/hooga-hg500' },
    { label: 'Photobiomodulation therapy clinical review (Photonics)', url: 'https://www.mdpi.com/2304-6732/6/3/77' },
  ],
  relatedSlugs: ['mito-red-mitopro-1500', 'biolight-pro-900', 'infraredi-pro-1500'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default hoogaHg500
