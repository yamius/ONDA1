import type { Article } from './types'

/**
 * Body fat % — companion article for /tools/body-fat.
 * Targets "ideal body fat percentage / how to measure body fat" intent.
 */
const article: Article = {
  slug: 'body-fat-percentage-composition',
  title: 'Body Fat %: Reading Your Composition Layer',
  seoTitle: 'Ideal Body Fat Percentage & How to Measure | ONDA Life',
  description:
    'What is a healthy body-fat percentage, and how do you measure it accurately? Essential vs storage fat, the ranges by sex, and why composition beats the scale.',
  category: 'ONDA Protocol',
  relatedSlugs: ['metabolism', 'insulin-sensitivity', 'metabolic-flexibility', 'homeostasis', 'cortisol'],
  introStyle: 'gold',
  image: '/images/tools/body-fat.png',
  imageAlt:
    'Body fat percentage and composition: essential vs storage fat, healthy ranges by sex, and measurement methods from tape to DEXA.',
  imageTitle: '[COMPOSITION_LAYER]: Reading fat mass vs lean mass — the signal the scale hides.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Estimate your body-fat percentage with just a tape measure using the U.S. Navy method.',
    link: '/tools/body-fat',
    linkText: 'Body Fat Calculator →',
  },
  content: `
## [ READING THE COMPOSITION LAYER ]

> "The scale reports one number and hides the only one that matters. Two people at the same bodyweight can carry wildly different amounts of muscle and fat — different engines, different risk, different reflection in the mirror. In the ONDA Biocomputer model, bodyweight is a single noisy register; body composition is the actual state.

> Body-fat percentage splits that register into its parts: lean mass (muscle, bone, organs, water) versus fat mass. Track this layer and you can tell whether a 'plateau' on the scale is actually recomposition — muscle up, fat down — in disguise."

---

## Section 1: Essential vs storage fat

Not all fat is surplus. **Essential fat** — the minimum for hormones, nerves, and organ protection — is about **2–5% in men and 10–13% in women** (women's higher floor supports reproductive function). Everything above that is **storage fat**, the buffer you can actually move.

Rough healthy ("fitness") ranges: ~14–17% for men, ~21–24% for women, with athletic bands a notch lower. "Ideal" depends on age, genetics and goals — chasing essential-fat levels year-round is neither sustainable nor healthy.

---

## Section 2: How to measure it

Every method trades accuracy for access:

- **DEXA / Bod Pod** — most accurate, but you pay and travel for them.
- **Skinfold calipers** — good with a skilled tester; operator-dependent.
- **U.S. Navy tape method** — circumference-based, ~3–4% standard error, free and repeatable at home. The [Body Fat Calculator](/tools/body-fat) runs this Hodgdon–Beckett equation from your neck, waist (and hip) measurements.
- **Bioimpedance scales** — convenient but swing with hydration; useful only for trends.

The lesson: pick one method, use it under the same conditions, and **track the trend** rather than obsessing over a single absolute number.

---

## Section 3: Composition Firmware Protocols

### PROTOCOL 1: Measure the Trend, Not the Day

> **The Hack:** Take the same measurement weekly, same time of day, same conditions, and watch the multi-week direction.

**The Science:** Day-to-day shifts are mostly water and gut contents. A consistent method exposes the real signal — fat and muscle change slowly, over weeks.

### PROTOCOL 2: Recompose, Don't Just Cut

> **The Hack:** Pair a modest calorie deficit with resistance training and high [protein](/articles/protein-intake-muscle-protein-synthesis).

**The Logic:** Dieting alone drops weight *and* muscle, raising the fat-to-lean ratio you don't want. Training plus protein tells the body to spend fat and keep muscle — body fat % falls even if the scale moves slowly.

### PROTOCOL 3: Watch Waist for Risk

> **The Hack:** Track waist circumference alongside body-fat %.

**The Logic:** Visceral (abdominal) fat drives [metabolic](/glossary/metabolism) and cardiovascular risk more than total fat. A shrinking waist is a strong health signal independent of the percentage itself.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Tape measure (Navy method) + weekly log
> METRIC: Body-fat % and waist trending down while strength holds
> STATUS: RECOMPOSITION_IN_PROGRESS
`,
  howToSteps: [
    {
      name: 'Measure the Trend, Not the Day',
      text: 'Take the same measurement weekly at the same time and conditions, and read the multi-week direction rather than daily noise.',
      protocolId: 'bodyfat-measure-trend',
    },
    {
      name: 'Recompose, Don’t Just Cut',
      text: 'Pair a modest calorie deficit with resistance training and high protein so you lose fat while keeping muscle.',
      protocolId: 'bodyfat-recompose',
    },
    {
      name: 'Watch Waist for Risk',
      text: 'Track waist circumference alongside body-fat %, since visceral fat drives metabolic risk more than total fat does.',
      protocolId: 'bodyfat-watch-waist',
    },
  ],
}

export default [article]
