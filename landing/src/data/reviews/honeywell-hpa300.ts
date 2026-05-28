import type { ToolReview } from './types'

const honeywellHpa300: ToolReview = {
  slug: 'honeywell-hpa300',
  name: 'Honeywell HPA300',
  brand: 'Honeywell',
  category: 'air-purifier',
  productType: 'Budget large-room True HEPA + carbon air purifier',
  description:
    'ONDA review of the Honeywell HPA300 — long-running Honeywell budget True HEPA H13 + activated carbon air purifier with 465 sq ft coverage at $249. Scored on filtration, CADR, build and value.',
  verdict:
    'Best Honeywell-brand budget large-room — True HEPA H13 + carbon + 465 sq ft coverage at $249. No sensor or smart features; Honeywell brand-trust play.',
  summary:
    'Honeywell HPA300 is the long-running Honeywell budget large-room reference — True HEPA H13, activated-carbon pre-filter, 465 sq ft AHAM-certified coverage, simple 3-speed + Turbo control, $249. Honeywell brand pedigree from home-appliance category. No app, no sensor — basic but credible large-room budget. Strong consumer track record at scale.',
  overallScore: 6.5,
  scores: [
    { criterionId: 'filtration-technology', score: 7.0, note: 'True HEPA H13 + activated-carbon pre-filter. Standard budget spec without premium differentiation.' },
    { criterionId: 'cadr-coverage', score: 8.0, note: 'AHAM-certified 300 CADR. 465 sq ft coverage — largest budget-tier coverage in roundup.' },
    { criterionId: 'build-noise', score: 6.5, note: 'Solid Honeywell build. Loud on Turbo (~62 dB); ~37 dB on low. Noisier than Coway / Levoit budgets.' },
    { criterionId: 'smart-features', score: 4.0, note: 'No app, no sensor, no auto mode. 3-speed + Turbo control. Basic LED indicator.' },
    { criterionId: 'maintenance-cost', score: 7.0, note: '12-month HEPA + 3-month pre-filter. ~$80/year filter cost.' },
    { criterionId: 'value', score: 8.0, note: '$249 — best budget large-room coverage. 465 sq ft at sub-Coway 400 pricing.' },
  ],
  pros: [
    'Largest budget-tier coverage (465 sq ft)',
    'Honeywell home-appliance brand pedigree',
    'Strong consumer review base at scale',
    'Solid build for the price',
  ],
  cons: [
    'No app, no sensor, no auto mode',
    'Loud on Turbo speed (~62 dB)',
    'No PlasmaWave or premium tech',
    'Plastic build with no premium polish',
  ],
  bestFor: 'Best for budget buyers wanting Honeywell brand-trust + large-room coverage without paying for smart features.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Honeywell product documentation, AHAM certification and multi-year consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 249, note: 'HPA300 standalone', asOf: '2026-05-28' },
  link: 'https://www.honeywellpluggedin.com/',
  linkType: 'official',
  content: `## Where it leads

Honeywell HPA300 is the budget large-room reference — True HEPA H13 + carbon + 465 sq ft coverage at $249. Honeywell home-appliance brand-trust play with strong consumer review base.

## Where it falls short

Smart features and noise. No app, no sensor, no auto mode; loud on Turbo. For users wanting smart features, Levoit Core 600S better fit at higher price.

## Who it is for

Choose Honeywell HPA300 for budget large-room coverage with Honeywell brand-trust. For smart features, Levoit Core 600S. For Wirecutter-favorite, Coway Airmega AP-1512HH. For PlasmaWave option, Winix 5500-2.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Honeywell — official site', url: 'https://www.honeywellpluggedin.com/' },
  ],
  relatedSlugs: ['coway-airmega-ap-1512hh', 'winix-5500-2', 'levoit-core-600s'],
  publishOn: '2026-07-27',
  datePublished: '2026-07-27',
  dateModified: '2026-07-27',
}

export default honeywellHpa300
