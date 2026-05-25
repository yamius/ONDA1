import type { ToolReview } from './types'

const joovvSolo3: ToolReview = {
  slug: 'joovv-solo-3',
  name: 'Joovv Solo 3.0',
  brand: 'Joovv',
  category: 'red-light',
  productType: 'Modular full-panel red + NIR LED therapy device',
  description:
    'ONDA review of the Joovv Solo 3.0 — the reference biohacker red light therapy panel, modular and FDA-registered. Scored on irradiance, wavelengths, EMF and value.',
  verdict:
    'The category reference — modular, well-built, fairly measured irradiance and FDA-registered. Most expensive in this list, mostly justified.',
  summary:
    'The Joovv Solo 3.0 is the panel that defined the consumer red-light category. Modular Solo panels link together to scale from a single half-body unit to a stand-mounted full-body wall. Combo 660 nm red + 850 nm NIR, FDA-registered as a Class II device for skin indications, independently-verified irradiance close to advertised figures, low EMF and low flicker. The most expensive option here, with most of the premium going to build and verification rather than spec inflation.',
  overallScore: 8.6,
  scores: [
    { criterionId: 'irradiance', score: 9.0, note: 'Manufacturer-claimed >100 mW/cm² at 6 inches; independent meter readings sit close to that figure unlike most cheaper panels — one of the most honestly-specced devices in the category.' },
    { criterionId: 'wavelengths', score: 8.5, note: 'Combo 660 nm red + 850 nm NIR with published peaks at the standard photobiomodulation wavelengths. No exotic UV/940 nm additions; clean spectrum.' },
    { criterionId: 'build-emf-flicker', score: 9.0, note: 'Aluminium back panel, glass front, third-party EMF tested at <0.5 mG at 6 inches; flicker rate published and low. Among the cleanest builds in this list.' },
    { criterionId: 'coverage', score: 8.5, note: 'Solo is half-body coverage; modular system stacks vertically for full-body. Stand and door-mount hardware included. Modularity is unique in this list.' },
    { criterionId: 'evidence', score: 8.0, note: 'FDA-registered Class II device for skin indications. Joovv collaborates with published photobiomodulation researchers and cites real peer-reviewed studies on the underlying mechanism.' },
    { criterionId: 'value', score: 6.5, note: '$1,295 for Solo 3.0 — most expensive in this list. Premium pricing is mostly justified by build and verification but it is real money.' },
  ],
  pros: [
    'The category reference — verified irradiance, low EMF, low flicker, FDA-registered',
    'Modular Solo system stacks vertically for full-body without buying a new panel',
    'Real published photobiomodulation researcher partnerships, not just marketing',
    'Multi-year warranty and serviceable hardware',
  ],
  cons: [
    'The most expensive panel in this list — $1,295 for Solo 3.0',
    'Modular full-body stack runs $3,000–$5,000 total',
    'No exotic wavelength options for users who want 810 / 830 / 940 nm',
    'Single front-emitter layout, not bidirectional',
  ],
  bestFor: 'Best for biohackers who want the category-reference build and verified irradiance, and accept premium pricing for it.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Joovv product documentation, independent irradiance/EMF/flicker test reports from biohacker review sites and the published photobiomodulation literature underlying the device claims. Not hands-on tested by ONDA.',
  price: { usd: 1295, note: 'one-time; modular stacks scale from $1,295 to $5,000+', asOf: '2026-05-23' },
  link: 'https://joovv.com/products/joovv-solo-3-0',
  linkType: 'official',
  content: `## Where it leads

The Joovv Solo 3.0 is the panel against which the rest of this category is measured. Independent irradiance testing comes close to the manufacturer-stated figure, EMF measurements at the standard treatment distance sit below 0.5 mG, flicker rate is published and clean. The Solo is also the only modular panel in this list: a single Solo is half-body, two link vertically for most of the upper body, three stack into a full-body wall. The FDA Class II registration covers consumer-skin indications honestly.

## Where it falls short

Price. $1,295 for a Solo 3.0 is the most expensive single panel in this list; a true full-body Joovv stack runs $3,000–$5,000. The wavelength options are standard 660 + 850 nm only — no 810 nm, 830 nm or 940 nm for users who want a richer spectrum. Layout is single-direction front-emitter, not bidirectional.

## Who it is for

Choose Joovv Solo 3.0 if you want the category-reference build and you accept that verification, EMF discipline and modular scalability have a price. If price is the deciding criterion, Mito Red MitoPRO 1500 or Hooga HG500 cover most of the spec at a fraction of the cost; if you want EMF-shielded premium with independent testing, GembaRed Vesta is the cleaner build at slightly lower price.`,
  references: [
    { label: 'Joovv Solo 3.0 — official product page', url: 'https://joovv.com/products/joovv-solo-3-0' },
    { label: 'Photobiomodulation therapy — clinical evidence review (Photonics)', url: 'https://www.mdpi.com/2304-6732/6/3/77' },
  ],
  relatedSlugs: ['mito-red-mitopro-1500', 'platinumled-biomax-600', 'gembared-vesta'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default joovvSolo3
