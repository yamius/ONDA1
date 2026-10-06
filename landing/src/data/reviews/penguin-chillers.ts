import type { ToolReviewInput } from './types'

const penguinChillers: ToolReviewInput = {
  slug: 'penguin-chillers',
  name: 'Penguin Chillers',
  brand: 'Penguin Chillers',
  category: 'cold-plunge',
  productType: 'Chiller-only retrofit (bring your own tub)',
  description:
    'Penguin Chillers review 2026: the $1,949.99 Cold Therapy Chiller reaches 37°F on 450 W. DIY cost, warranty, safety and how it compares to turnkey plunges.',
  verdict:
    'The chiller for DIY cold plunge — bring your own tub or stock tank, get a capable chiller at a real-world price.',
  summary:
    'Penguin Chillers is a Tennessee maker best known for selling the chiller without the tub. Its Cold Therapy Chiller ($1,949.99, checked 2026-10-01) is rated at 7,500 BTU/hr, chills water down to 37°F, draws 450 W on a standard 110–120 V outlet and has a built-in pump; standard water chillers start at $999.99. The user pairs it with their own stock tank, plastic tub or repurposed bath — DIY style. Penguin now also sells complete plunge systems, but this review covers the chiller-only route.',
  scores: [
    { criterionId: 'chiller-capacity', score: 8.0, note: 'Cold Therapy Chiller: 7,500 BTU/hr, 37°F minimum, holds low-to-mid 40s°F in normal use. Standard line from 1/2 HP to 1 HP for different tub sizes.' },
    { criterionId: 'build', score: 8.0, note: 'Titanium heat exchanger, R-32 refrigerant, outdoor-rated above 32°F ambient, made in Tennessee. 1-year warranty standard; 2- and 3-year extended options sold.' },
    { criterionId: 'water-management', score: 5.5, note: 'Chiller-only — water management entirely user-configured. No bundled ozone or filtration.' },
    { criterionId: 'form-factor', score: 6.5, note: 'Compact 17 × 15 × 13 in, 49 lb unit, but it requires a user-supplied tub and installation; the pump is not self-priming, so the chiller must sit at or below tub level, within about 3 ft of the drain.' },
    { criterionId: 'evidence', score: 6.5, note: 'Honest marketing about being a chiller-only solution — no overclaiming of bundled benefits.' },
    { criterionId: 'value', score: 8.5, note: '$999.99–$1,999.99 for standard chillers; $1,949.99 for the Cold Therapy Chiller (Oct 2026). With a stock tank, a DIY build typically lands around $2,200–$3,000. Cheapest path to chiller-built cold plunge.' },
  ],
  pros: [
    'Cheapest path to chiller-built cold plunge (DIY pairing)',
    'Down to 37°F on a standard 110–120 V outlet (450 W, 3.9 A)',
    'Built-in pump, quick-connect fittings, outdoor-rated',
    'Multiple chiller sizes for different tub volumes',
  ],
  cons: [
    'Chiller-only — water management, tub, install all user-configured',
    'No bundled ozone / sanitation',
    'Only a 1-year warranty as standard (2–3 years cost extra)',
    'Pump is not self-priming; placement and plumbing need planning',
  ],
  bestFor: 'Best for DIY users who want chiller-built cold plunge at the lowest credible total cost.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Penguin Chillers product documentation (specs and prices checked on the official site 2026-10-01) and independent DIY-build reviews. Not hands-on tested by ONDA.',
  price: { usd: 1950, note: 'Cold Therapy Chiller $1,949.99, chiller only; standard water chillers from $999.99; user supplies tub', asOf: '2026-10-01' },
  link: 'https://penguinchillers.com/products/cold-therapy-chiller-1',
  linkType: 'official',
  content: `## The verdict first

Penguin Chillers is the best-known way to build a chiller-cooled cold plunge without paying for a branded tub. The Cold Therapy Chiller costs $1,949.99 on the official US store (checked 2026-10-01), cools water to as low as 37°F, plugs into a standard 110–120 V outlet and draws 450 W. Add a stock tank or a large plastic tub and you have a plunge that holds the low-to-mid 40s°F for roughly $2,200–$3,000 in total. The trade-off is that everything except cooling is your job: tub, plumbing, filtration and sanitation. If you want a finished product, a turnkey tub is the better shape.

## How does a Penguin cold plunge chiller work?

A chiller is a small refrigeration unit. Water is pumped from the tub through a titanium heat exchanger, where refrigerant (R-32 in the Cold Therapy Chiller) pulls heat out, and returns colder. The Cold Therapy Chiller is rated at 7,500 BTU/hr and has a built-in pump with quick-connect fittings. Two installation details matter:

- **The pump is not self-priming.** Penguin says water must reach it by gravity, so the chiller sits at or below the tub, within about 3 feet of the tub drain.
- **Outdoor use is fine above freezing.** The unit is rated for ambient temperatures above 32°F; Penguin notes its standard (non-cold-therapy) chillers are not outdoor-rated.

Standard Penguin water chillers start at $999.99 (1/2 HP) and run to $1,999.99 (1 HP high-efficiency), and there is a $2,199.99 package built to fit the Ice Barrel. Penguin also now sells complete plunge systems from $2,999, which puts it in competition with the turnkey brands — but the chiller-only route is where it stands out.

## What does the evidence say about cold plunging?

Honestly: less than the marketing around cold plunges suggests. A 2022 review of voluntary cold-water immersion in the *International Journal of Circumpolar Health* (Espeland et al., [doi:10.1080/22423982.2022.2111789](https://doi.org/10.1080/22423982.2022.2111789)) found that many reported benefits — mood, insulin sensitivity, immune markers — come from small studies, often in experienced winter swimmers, and that it is hard to separate the cold from other lifestyle factors. Tipton and colleagues’ review "Cold water immersion: kill or cure?" (*Experimental Physiology*, 2017, [doi:10.1113/EP086283](https://doi.org/10.1113/EP086283)) sets the possible benefits against the well-documented cold-shock response — the gasp, hyperventilation and spike in heart rate and blood pressure in the first minutes. The fair reading: a cold plunge is a strong, short stressor that many people enjoy and that may help mood and alertness, but it is not a proven treatment. For the nervous-system side, see [cold exposure and the vagus nerve](/articles/cold-exposure-vagus-nerve) and [the honest limits of breathing and cold for HRV](/articles/hrv-breathing-cold-honest-limits).

## What does a DIY Penguin build really cost?

- **Chiller:** $1,949.99 (Cold Therapy Chiller) or from $999.99 for a standard chiller.
- **Tub:** a stock tank or insulated tub, usually a few hundred dollars.
- **Plumbing and filtration:** hoses, fittings, a filter and a sanitation method (many DIY builders add ozone or UV); Penguin sells an optional install kit.
- **Warranty:** 1 year standard; 2- and 3-year extensions are extra.
- **Electricity:** the unit is rated at 450 W. Even running non-stop all day that is about 10.8 kWh, and a chiller cycles off once the water is at temperature, so real use is lower; it depends on room heat, insulation and lid use. Penguin does not publish a monthly running-cost figure.

## Is a cold plunge safe?

For healthy adults short plunges are generally well tolerated, but the cold-shock response is a real cardiovascular load. Talk to a doctor first if you have heart disease, high blood pressure, arrhythmia, Raynaud’s or are pregnant. Never plunge alone or after alcohol, start at milder temperatures with 1–3 minutes, keep your head above water and get out if you feel numb, dizzy or confused. Rewarm gradually afterwards. Follow the maker’s electrical and placement instructions exactly — water and electricity share this setup.

## Penguin Chillers vs alternatives

| Option | Price (from ONDA reviews) | What you get |
|---|---|---|
| Penguin Chillers (chiller only) | $1,949.99 | Chiller to 37°F; you supply tub, filtration, sanitation |
| [Edge Tub](/reviews/edge-tub) | $2,495 | Tub with chiller and ozone included |
| [Inergize Elite Tub](/reviews/inergize-cold-tub) | $2,990 (sale) | Portable tub + 0.8 HP chiller |
| [The Plunge](/reviews/plunge) | $5,990 | Premium turnkey tub, chiller, ozone, 3-year warranty |

## Who should buy Penguin Chillers — and who should skip

**Buy** if you are comfortable choosing a tub, planning plumbing and managing water yourself, and you want the lowest credible cost for a chilled plunge. **Skip** if you want a plug-and-plunge product with sanitation and a longer warranty included — the Edge Tub is the cheaper turnkey option and The Plunge is the premium one. If you just want to try cold exposure first, an ice-filled tub such as the [Ice Barrel 500](/reviews/ice-barrel-500) costs less but needs ice every session. More options in the [best cold plunge round-up](/reviews/compare/best-cold-plunge-2026).

---

## Background reading

The biology of why cold exposure works — and the protocols that compound with the hardware.

- [CO₂ tolerance and the oxygen limit](/articles/co2-tolerance-expanding-oxygen-limit) — why cold and breath protocols layer cleanly
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — cold exposure as a daily anti-entropy stress dose
- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why cold-shock drives mitochondrial density up
`,
  references: [
    { label: 'Penguin Chillers — Cold Therapy Chiller (official product page)', url: 'https://penguinchillers.com/products/cold-therapy-chiller-1' },
    { label: 'Penguin Chillers — cold therapy chillers collection', url: 'https://penguinchillers.com/collections/cold-therapy-chillers' },
    { label: 'Espeland D et al. Health effects of voluntary exposure to cold water — a continuing subject of debate. Int J Circumpolar Health 2022', url: 'https://doi.org/10.1080/22423982.2022.2111789' },
    { label: 'Tipton MJ et al. Cold water immersion: kill or cure? Exp Physiol 2017', url: 'https://doi.org/10.1113/EP086283' },
  ],
  relatedSlugs: ['inergize-cold-tub', 'plunge', 'cold-pod'],
  faq: [
    { q: "What do Penguin Chillers include, and do they come with a tub?", a: "The chiller products come without a tub. You pair the chiller with your own stock tank, plastic tub or repurposed bath and configure filtration, sanitation and plumbing yourself. The Cold Therapy Chiller includes a built-in pump and quick-connect fittings. Penguin also now sells complete plunge systems separately. ONDA scores the chiller-only route 7.2/10." },
    { q: "How much does a Penguin Chillers cold plunge cost?", a: "The Cold Therapy Chiller costs $1,949.99 and standard water chillers start at $999.99 (official US store, checked October 2026). With a stock tank, plumbing and filtration, a DIY build typically lands around $2,200 to $3,000, versus about $5,990 for a turnkey system like The Plunge." },
    { q: "Who are Penguin Chillers best for?", a: "Penguin Chillers are best for DIY users who want chiller-built cold plunge at the lowest credible total cost and are comfortable choosing a tub, configuring plumbing and managing water themselves. There is no bundled ozone, filtration or turnkey experience; for a turnkey setup ONDA points to Plunge or Edge instead." },
    { q: "How cold can a Penguin chiller get?", a: "Penguin says the Cold Therapy Chiller cools water down to 37°F and easily holds the low-to-mid 40s°F typical for cold plunging. How fast it gets there depends on tub volume, insulation, a lid and the air temperature around it." },
    { q: "What warranty do Penguin Chillers have?", a: "The Cold Therapy Chiller comes with a 1-year warranty as standard, with 2-year and 3-year extended warranty options sold at checkout. That is shorter than some turnkey plunges, such as The Plunge with a 3-year warranty." },
    { q: "How much electricity does a cold plunge chiller use?", a: "The Penguin Cold Therapy Chiller is rated at 450 W and 3.9 A on a standard 110–120 V outlet. Running continuously that would be about 10.8 kWh a day, but the compressor cycles off once the water reaches temperature, so real use is lower and depends on insulation, a lid and room temperature. Penguin does not publish a monthly cost." },
  ],

  datePublished: '2026-05-25',
  dateModified: '2026-10-01',
}

export default penguinChillers
