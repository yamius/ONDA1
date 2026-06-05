import type { Article } from './types'

/**
 * Water intake — companion guide for /tools/water.
 * Targets "how much water should you drink a day". Reuses verified sources.
 */
const article: Article = {
  slug: 'how-much-water-should-you-drink',
  title: 'How Much Water Should You Drink a Day?',
  seoTitle: 'How Much Water Should You Drink a Day? | ONDA Life',
  description:
    'How much water you really need — by bodyweight, not a fixed "8 glasses" — plus how exercise, heat and caffeine change it, and why thirst and urine colour matter most.',
  category: 'ONDA Protocol',
  relatedSlugs: ['homeostasis', 'metabolism', 'cortisol', 'circadian-rhythm'],
  introStyle: 'cyan',
  image: '/images/articles/how-much-water-should-you-drink.png',
  imageAlt:
    'How much water should you drink a day: a bodyweight-based target (~35 ml/kg) adjusted for exercise, heat and caffeine, with urine colour as the real-time guide.',
  imageTitle: '[HYDRATION_TARGET]: Bodyweight-based fluid need, adjusted for your day.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Get your daily water target from your bodyweight, with adjustments for training and heat.',
    link: '/tools/water',
    linkText: 'Water Intake Calculator →',
  },
  howToSteps: [
    { name: 'Start from bodyweight', text: 'A practical baseline is ~35 ml per kg per day — about 2.4 L for a 70 kg adult — not a fixed 8 glasses.', protocolId: 'water-baseline' },
    { name: 'Add for exercise and heat', text: 'Roughly 350–700 ml per hour of exercise, more in heat or for heavy sweaters; pair long/hot sessions with electrolytes.', protocolId: 'water-add' },
    { name: 'Count coffee and tea', text: 'Normal coffee and tea count toward fluid; only high alcohol intake is genuinely dehydrating.', protocolId: 'water-coffee' },
    { name: 'Let urine colour guide you', text: 'Pale straw = well hydrated; dark yellow = drink more. Spread intake across the day.', protocolId: 'water-urine' },
  ],
  content: `
## [ SETTING THE HYDRATION TARGET ]

> "‘Eight glasses a day’ is a myth with no real basis — it ignores your size, your activity and your climate. A better answer scales to your body and your day. In the ONDA Biocomputer model, hydration is a homeostatic set-point your body defends well on its own; your job is to give it enough raw material and read the simple signals it sends back."

---

## Section 1: How much you actually need

A practical baseline is about **35 ml of water per kg of bodyweight** per day — roughly 2.4 litres for a 70 kg adult, 3 litres for a 90 kg one. Because about **20% of your water comes from food**, the target from *drinks* is a little lower than your total need. Then adjust up for:

- **Exercise:** ~350–700 ml per hour of activity (more in heat, more if you sweat heavily).
- **Hot climate / sweating:** add a few hundred ml.
- **High caffeine or alcohol:** a small extra allowance — alcohol especially is dehydrating.

The [Water Intake Calculator](/tools/water) turns your weight and day into a target. But the number is a guide, not a quota.

---

## Section 2: Myths worth dropping

- **Coffee and tea don’t dehydrate you.** The mild diuretic effect of normal intake is more than offset by the water they contain, so they count toward your daily fluid.
- **You can overdo it.** Drinking very large volumes fast — especially during endurance events — can dilute blood sodium (hyponatraemia), which is dangerous. Spread intake out, and use electrolytes (not just water) for long or hot sessions.
- **Thirst works.** For healthy adults, thirst is a reliable signal; you don’t need to force-drink on a schedule.

### PROTOCOL: Read the Colour, Not the Clock

> **The Hack:** Glance at your urine — pale straw means well hydrated, dark yellow means top up. Keep a bottle within reach and sip across the day.

**The Logic:** Urine colour is a free, real-time hydration gauge that beats any fixed daily quota, because it reflects your actual balance right now — losses, intake and all.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Urine colour + thirst
> METRIC: Consistently pale-straw urine, steady energy
> STATUS: HYDRATION_BALANCED

---

Educational estimate, not medical advice. Some conditions require fluid restriction or have special needs — follow your clinician’s guidance.
`,
}

export default [article]
