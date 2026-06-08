import type { Article } from './types'

/**
 * VO2max — companion article for /tools/vo2max.
 * Targets "how to increase VO2max / what is a good VO2max" intent, ONDA voice.
 */
const article: Article = {
  slug: 'vo2max-increase-aerobic-engine',
  title: 'VO₂max: Overclocking Your Aerobic Engine',
  seoTitle: 'How to Increase VO₂max: The Protocol | ONDA Life',
  description:
    'VO₂max is the single best marker of cardiorespiratory fitness and a top predictor of lifespan. Learn what it is, what is good for your age, and how to raise it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['mitochondria', 'metabolic-flexibility', 'atp', 'heart-rate-variability', 'homeostasis'],
  introStyle: 'cyan',
  image: '/images/vo2max-increase-aerobic-engine.png',
  imageAlt:
    'VO2max aerobic engine capacity: maximum oxygen uptake, the top marker of cardiorespiratory fitness and a strong predictor of longevity.',
  imageTitle: '[ENGINE_THROUGHPUT]: Maximising oxygen uptake — the master ceiling on aerobic output.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Estimate your VO₂max from resting and max heart rate, and see your age/sex percentile.',
    link: '/tools/vo2max',
    linkText: 'VO₂max Estimator →',
  },
  content: `
## [ READING THE ENGINE SPEC ]

> "VO₂max is the maximum volume of oxygen your system can take in, deliver, and burn per minute. In the ONDA Biocomputer model, it is the clock speed of your aerobic engine — the hard ceiling on sustained output. Everything from a flight of stairs to a decade of healthspan runs under it.

> It is also one of the strongest single predictors of all-cause mortality on record — a low number is a bigger risk than smoking. The good news: of all your fitness markers, this is one of the most trainable. You can overclock it."

---

## Section 1: What the number means

VO₂max is measured in millilitres of oxygen per kilogram of bodyweight per minute (ml/kg/min). It reflects the whole oxygen pipeline: lungs in, heart pumping, blood delivering, [mitochondria](/glossary/mitochondria) consuming. A bottleneck anywhere caps the number.

You don't need a lab to get a working estimate. The [VO₂max Estimator](/tools/vo2max) uses the Heart Rate Ratio Method (resting vs max HR) and shows where you land against age- and sex-based norms — for men in their 30s, "good" is roughly 41–47 ml/kg/min; for women, about 34–39.

---

## Section 2: The decline — and the override

VO₂max falls about **10% per decade** after 30 if you do nothing. That decline is not a fixed law; it's an untrained default. Consistent aerobic work can hold a 50-year-old at the fitness of an untrained 30-year-old. You are not raising a number for vanity — you are buying back decades of capacity.

The lever is the same hardware Zone 2 builds — [ATP](/glossary/atp) production, capillary density, stroke volume — pushed to its ceiling.

---

## Section 3: VO₂max Firmware Protocols

### PROTOCOL 1: Build the Base First

> **The Hack:** Before chasing intervals, install an aerobic base with low-intensity volume.

**The Science:** High-intensity work raises the roof, but a small base means a low roof. Spend weeks in Zone 2 first — see the [Zone 2 training guide](/articles/zone-2-training-aerobic-base) — then layer intensity on top.

### PROTOCOL 2: The Norwegian 4×4

> **The Hack:** 4 intervals of 4 minutes near 90–95% max HR, each followed by 3 minutes easy. Once or twice a week.

**The Science:** The 4×4 is the most studied VO₂max protocol. Working close to max HR for sustained intervals forces the heart's stroke volume and oxygen-delivery system to adapt — the most direct stimulus for raising the ceiling.

### PROTOCOL 3: Protect Recovery Between Efforts

> **The Hack:** Keep hard VO₂max sessions to 1–2 per week and watch your morning HRV and resting HR.

**The Logic:** Adaptation happens during recovery, not the session. Stacking high-intensity work on poor recovery just digs a hole. Let [heart-rate variability](/glossary/heart-rate-variability) tell you when to push and when to back off.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: HR-ratio estimate or lab CPET
> METRIC: Estimated VO₂max ↑ over 8–12 weeks
> STATUS: AEROBIC_CEILING_RISING
`,
  howToSteps: [
    {
      name: 'Build the Base First',
      text: 'Install an aerobic base with low-intensity Zone 2 volume for several weeks before adding high-intensity intervals.',
      protocolId: 'vo2max-base-first',
    },
    {
      name: 'The Norwegian 4×4',
      text: 'Perform 4 intervals of 4 minutes near 90–95% of max heart rate, each followed by 3 minutes easy, once or twice a week.',
      protocolId: 'vo2max-norwegian-4x4',
    },
    {
      name: 'Protect Recovery Between Efforts',
      text: 'Keep hard VO₂max sessions to 1–2 per week and use morning HRV and resting HR to decide when to push or back off.',
      protocolId: 'vo2max-protect-recovery',
    },
  ],
}

export default [article]
