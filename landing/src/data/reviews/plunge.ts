import type { ToolReview } from './types'

const plunge: ToolReview = {
  slug: 'plunge',
  name: 'The Plunge All-In',
  brand: 'The Plunge Co',
  category: 'cold-plunge',
  productType: 'Premium cold plunge tub with built-in chiller',
  description:
    'ONDA review of The Plunge All-In — the category-leading premium cold-plunge tub with integrated chiller, ozone filtration and 3-year warranty. Scored on chiller capacity, build, water management and value.',
  verdict:
    'The category-defining cold plunge — premium build, capable chiller, polished consumer experience at a premium price.',
  summary:
    'The Plunge All-In is the cold-plunge tub that brought the category mainstream. Insulated acrylic tub with built-in 1 HP chiller, ozone water sanitation, programmable temperature down to 39°F, indoor/outdoor rated. The hardware that defined consumer-grade cold-plunge expectations — premium-priced and worth it for users who want a turnkey daily-use plunge.',
  overallScore: 8.4,
  scores: [
    { criterionId: 'chiller-capacity', score: 9.0, note: '1 HP chiller, holds 39°F reliably even in summer ambient. Strong recovery time post-plunge. Among the most capable chillers in the consumer category.' },
    { criterionId: 'build', score: 8.5, note: 'Insulated acrylic tub, marine-grade hardware, 3-year warranty. Outdoor-rated. Multi-year reliability track record in the user base.' },
    { criterionId: 'water-management', score: 8.5, note: 'Ozone sanitation + filter; water changes every 2–4 weeks under typical use. The most-polished water-management system in the consumer category.' },
    { criterionId: 'form-factor', score: 8.0, note: 'Indoor or outdoor install, 67×31×27 inches. Requires 110V outlet and level surface. Drainage built in.' },
    { criterionId: 'evidence', score: 7.0, note: 'Manufacturer protocol guidance is honest about cold-exposure research; does not overclaim. Founder Michael Garrett is a credible voice in the cold-exposure community.' },
    { criterionId: 'value', score: 6.5, note: '$5,990 + shipping. Premium pricing, but inclusive of chiller, ozone, warranty. Cheaper than DIY chest-freezer + chiller setups once labour is counted.' },
  ],
  pros: [
    'Category-defining premium build with proven multi-year reliability',
    'Capable 1 HP chiller holds 39°F reliably even in summer heat',
    'Ozone sanitation cuts water-change frequency to every 2–4 weeks',
    'Indoor / outdoor rated with 3-year warranty',
  ],
  cons: [
    'Premium pricing — $5,990 puts it out of reach of casual experimenters',
    'Requires 110V outlet and level surface (rooftop / patio installs need planning)',
    'Footprint is real — not a small-apartment fit',
    'Long lead times during peak demand periods',
  ],
  bestFor: 'Best for serious daily-use cold-plunge users who want the category-leading turnkey hardware.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from The Plunge Co product documentation, the cold-exposure research literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 5990, note: 'one-time; ozone, chiller and 3-year warranty included', asOf: '2026-05-25' },
  link: 'https://theplunge.com/',
  linkType: 'official',
  content: `## Where it leads

The Plunge All-In is the cold-plunge tub that defined consumer expectations for the category. The 1 HP integrated chiller is the most capable in the consumer space, the ozone sanitation system cuts water-change frequency to every 2–4 weeks rather than weekly, and the build holds up outdoors in the multi-year ownership reports. Founder Michael Garrett built the company around the cold-exposure community, and the protocol guidance is honest about what the research supports — the [norepinephrine](/glossary/norepinephrine) and [dopamine](/glossary/dopamine) surge cold drives, framed as [hormesis](/glossary/hormesis) rather than a cure-all.

## Where it falls short

Price. At $5,990 it is premium-tier, and the footprint is real — this is not a small-apartment fit. Installation requires a level surface and 110V outlet, and lead times during peak demand can stretch into months.

## Who it is for

Choose The Plunge All-In if cold plunge is a serious daily practice and you want the turnkey hardware that defined the category. For occasional experimentation, a budget option like Cold Pod or Ice Barrel covers the use case for under $500.

---

## Background reading

The biology of why cold exposure works — and the protocols that compound with the hardware.

- [Vagus nerve: the master key](/articles/vagus-nerve-master-key) — why cold-water immersion is one of the strongest non-electrical vagal activators
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — how cold exposure shapes the cortisol curve
- [Adrenal governor and thermal runaway](/articles/adrenal-governor-thermal-runaway) — the thermoregulatory side of the stress response`,
  references: [
    { label: 'The Plunge — official product page', url: 'https://theplunge.com/' },
    { label: 'Cold-water immersion and vagal tone (Frontiers in Physiology)', url: 'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2022.876283/full' },
  ],
  relatedSlugs: ['edge-tub', 'coldture', 'morozko-forge'],
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default plunge
