import type { ToolReview } from './types'

const inergizeColdTub: ToolReview = {
  slug: 'inergize-cold-tub',
  name: 'Inergize Cold Tub',
  brand: 'Inergize',
  category: 'cold-plunge',
  productType: 'Mid-tier insulated tub with optional chiller',
  description:
    'ONDA review of the Inergize Cold Tub — mid-tier insulated tub available with or without chiller add-on.',
  verdict:
    'A mid-tier tub that competes on configurability — buy the tub now, add a chiller later if needed.',
  summary:
    'Inergize sells an insulated tub that can run either as an ice-fill plunge or with their separate chiller unit added. The modular approach reduces upfront cost and lets users upgrade as practice solidifies. Build is solid; chiller (sold separately) is competent but less powerful than Plunge’s integrated unit.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'chiller-capacity', score: 6.5, note: 'Chiller sold separately. The optional chiller is competent but lower-power than Plunge’s 1 HP unit — slower recovery, weaker summer performance.' },
    { criterionId: 'build', score: 7.5, note: 'Insulated tub with stronger insulation than Cold Pod, lighter than Plunge. 1-year tub warranty, separate warranty on chiller.' },
    { criterionId: 'water-management', score: 6.5, note: 'Optional ozone add-on; base config is manual water changes.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Indoor or outdoor, 67×31 inches footprint. Drain via spigot. Modular install — tub first, chiller later.' },
    { criterionId: 'evidence', score: 6.0, note: 'Honest about being a configurable mid-tier option; doesn’t overclaim hardware vs Plunge.' },
    { criterionId: 'value', score: 8.0, note: '$1,500 tub-only, $2,800 with chiller. Modular pricing is the differentiator — splits the chiller-tier cost across phases.' },
  ],
  pros: [
    'Modular tub-then-chiller path — split upfront cost across phases',
    'Better insulation than inflatable / barrel options',
    'Optional ozone add-on for low-maintenance water',
    'Indoor / outdoor rated',
  ],
  cons: [
    'Chiller (when added) is less powerful than Plunge’s integrated unit',
    'Total cost with chiller approaches Edge Tub territory',
    'Multi-year reliability track record is thinner than Plunge',
    'Warranty is component-by-component rather than whole-system',
  ],
  bestFor: 'Best for users who want a modular cold-plunge upgrade path — tub now, chiller later.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Inergize product documentation and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 1500, note: 'tub-only; chiller add-on ~$1,300', asOf: '2026-05-25' },
  link: 'https://inergizehealth.com/',
  linkType: 'official',
  content: `## Where it leads

Inergize takes the modular approach to cold plunge: buy the tub now, add a chiller later if daily-use practice solidifies. At $1,500 tub-only it splits the chiller-tier upfront cost across phases. For users who want better insulation than barrel or inflatable options but are not ready for $5K turnkey, this is the right shape.

## Where it falls short

The chiller (when added) is less capable than Plunge’s integrated 1 HP unit — slower recovery, weaker summer performance. Total cost with chiller approaches Edge Tub territory. Multi-year reliability data is thinner than the category leaders.

## Who it is for

Choose Inergize if the modular upgrade path is the value — testing daily practice with ice-fill before paying for the chiller. For all-in turnkey, Plunge or Edge. For pure budget testing, Cold Pod or Ice Barrel.

---

## Background reading

The biology of why cold exposure works — and the protocols that compound with the hardware.

- [CO₂ tolerance and the oxygen limit](/articles/co2-tolerance-expanding-oxygen-limit) — why cold and breath protocols layer cleanly
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — cold exposure as a daily anti-entropy stress dose
- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why cold-shock drives mitochondrial density up
`,
  references: [
    { label: 'Inergize Health — official site', url: 'https://inergizehealth.com/' },
  ],
  relatedSlugs: ['ice-barrel-500', 'edge-tub', 'plunge'],
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default inergizeColdTub
