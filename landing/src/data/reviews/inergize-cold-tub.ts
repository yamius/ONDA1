import type { ToolReview } from './types'

const inergizeColdTub: ToolReview = {
  slug: 'inergize-cold-tub',
  name: 'Inergize Cold Tub',
  brand: 'Inergize',
  category: 'cold-plunge',
  productType: 'Mid-tier insulated tub with optional chiller',
  description:
    'Inergize Cold Tub review: a configurable mid-tier plunge — start as ice-fill, add the chiller later. Solid tub; the add-on chiller is competent, not powerful.',
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
    { criterionId: 'value', score: 8.0, note: 'Scored on the earlier $1,500 tub / ~$1,300 chiller pricing. As of Sept 2026 Inergize lists the Elite Tub (tub + 0.8 HP Elite Chiller) at $2,990 on sale and the Elite Chiller alone at $2,690; no standalone portable tub is listed.' },
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
  price: { usd: 2990, note: 'Elite Tub = portable tub + 0.8 HP Elite Chiller (sale price; list $3,990). Elite Chiller alone $2,690; certified-refurbished tub + chiller $1,790; Spire cedar tub from $5,990 (tub only) / $7,990 with chiller', asOf: '2026-09-30' },
  link: 'https://inergizehealth.com/',
  linkType: 'official',
  content: `> Update (September 2026): Inergize's current lineup no longer lists a standalone tub at the $1,500 price reviewed here. The closest match is the Elite Tub — a portable tub bundled with the 0.8 HP Elite Chiller (37-104°F) at $2,990 on sale (list $3,990). The Elite Chiller is also sold alone ($2,690) for use with another tub, a certified-refurbished tub + chiller is $1,790, and the cedar Spire tub starts at $5,990 without chiller. The modular tub-first, chiller-later path described below is therefore now mainly possible by pairing the standalone chiller with a tub you already own.

## Where it leads

Inergize takes the modular approach to cold plunge: buy the tub now, add a chiller later if daily-use practice solidifies. At $1,500 tub-only it splits the chiller-tier upfront cost across phases. For users who want better insulation than barrel or inflatable options but are not ready for $5K turnkey, this is the right shape.

## What are the downsides of the Inergize Cold Tub?

The chiller (when added) is less capable than Plunge’s integrated 1 HP unit — slower recovery, weaker summer performance. Total cost with chiller approaches Edge Tub territory. Multi-year reliability data is thinner than the category leaders.

## Who should buy the Inergize Cold Tub?

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
  faq: [
    { q: "Can you add a chiller to the Inergize Cold Tub later?", a: "Yes, that is the main appeal. You can run the Inergize tub as an ice-fill plunge first and add its separate chiller later, which is how it was originally sold at about $1,500 for the tub plus about $1,300 for the chiller. As of September 2026 Inergize lists the tub bundled with its Elite Chiller ($2,990 on sale) and the Elite Chiller alone ($2,690), so the split-purchase path is now mainly chiller-plus-your-own-tub. It splits the upfront cost and lets you upgrade once your practice is established." },
    { q: "Inergize Cold Tub vs The Plunge: which is better?", a: "The Plunge has a more powerful integrated chiller and a longer reliability track record. Inergize is cheaper to start and modular, with better insulation than inflatable or barrel options. Once you add the chiller, though, the total cost approaches Edge Tub territory." },
    { q: "What are the downsides of the Inergize Cold Tub?", a: "The add-on chiller is less powerful than the unit integrated into The Plunge, and the full setup approaches Edge Tub pricing. Its multi-year reliability record is thinner than The Plunge, and the warranty is split component by component rather than covering the whole system." },
  ],
  datePublished: '2026-05-25',
  dateModified: '2026-09-30',
}

export default inergizeColdTub
