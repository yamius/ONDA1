import type { ToolReview } from './types'

const edgeTub: ToolReview = {
  slug: 'edge-tub',
  name: 'Edge Tub',
  brand: 'Edge Tub',
  category: 'cold-plunge',
  productType: 'Mid-tier cold plunge tub with chiller',
  description:
    'ONDA review of the Edge Tub — the mid-tier cold-plunge alternative to Plunge with comparable chiller capacity at roughly half the price.',
  verdict:
    'The best value in the chiller-built cold-plunge tier — comparable hardware to The Plunge, meaningfully cheaper.',
  summary:
    'Edge Tub is the most credible mid-tier cold-plunge option in 2026 — insulated acrylic tub with built-in chiller, holds 39°F under typical use, ozone filtration. Newer brand than The Plunge with a thinner multi-year reliability track record, but the core hardware is comparable at roughly half the price.',
  overallScore: 7.8,
  scores: [
    { criterionId: 'chiller-capacity', score: 8.0, note: 'Capable chiller holds 39°F under typical use; slightly slower recovery than Plunge’s 1 HP unit in summer heat.' },
    { criterionId: 'build', score: 7.5, note: 'Insulated acrylic tub, 2-year warranty. Newer brand — multi-year reliability track record is still building.' },
    { criterionId: 'water-management', score: 8.0, note: 'Ozone sanitation + filter; water changes every 3–4 weeks under typical use.' },
    { criterionId: 'form-factor', score: 8.0, note: 'Indoor or outdoor install, comparable footprint to Plunge. Requires 110V and level surface.' },
    { criterionId: 'evidence', score: 6.5, note: 'Honest marketing language about cold-exposure benefits; less prominent founder presence than The Plunge.' },
    { criterionId: 'value', score: 8.5, note: '$2,495 — roughly half The Plunge’s price for comparable core hardware. The best chiller-built value in 2026.' },
  ],
  pros: [
    'Roughly half The Plunge’s price for comparable chiller capability',
    'Ozone sanitation included',
    'Indoor / outdoor rated',
    'Strong value pick in the chiller-built tier',
  ],
  cons: [
    'Newer brand — thinner multi-year reliability data than Plunge',
    '2-year warranty vs Plunge’s 3-year',
    'Slightly slower chiller recovery in peak summer heat',
    'Less developed protocol guidance content than Plunge',
  ],
  bestFor: 'Best for users wanting chiller-built cold-plunge capability without paying The Plunge premium.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Edge Tub product documentation, the cold-exposure research literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 2495, note: 'one-time; chiller and ozone included', asOf: '2026-05-25' },
  link: 'https://edgetheory.com/',
  linkType: 'official',
  content: `## Where it leads

Edge Tub is the price-disciplined challenger in the chiller-built cold-plunge category. Comparable chiller capacity to The Plunge, ozone sanitation included, similar form factor — at roughly $2,495 versus The Plunge’s $5,990. For users who want chiller-built hardware without paying the category-leader premium, this is the right shape.

## Where it falls short

Edge is newer and the multi-year reliability data is still being built. The warranty is shorter (2 years vs Plunge’s 3), and the chiller recovery in peak summer heat is marginally slower. Founder and content presence is also less developed.

## Who it is for

Choose Edge Tub if you want chiller-built cold-plunge capability at the most accessible price in the tier. If multi-year reliability and the deepest manufacturer support are deciding criteria, The Plunge is the right shape.

---

## Background reading

The biology of why cold exposure works — and the protocols that compound with the hardware.

- [CO₂ tolerance and the oxygen limit](/articles/co2-tolerance-expanding-oxygen-limit) — why cold and breath protocols layer cleanly
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — cold exposure as a daily anti-entropy stress dose
- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why cold-shock drives mitochondrial density up
`,
  references: [
    { label: 'Edge Tub — official site', url: 'https://edgetheory.com/' },
  ],
  relatedSlugs: ['plunge', 'inergize-cold-tub', 'ice-barrel-500'],
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default edgeTub
