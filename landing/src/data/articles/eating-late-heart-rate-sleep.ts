import type { Article } from './types'

/**
 * Late-night eating → overnight heart rate up, HRV down; digestion = sympathetic load when
 * pulse should be falling. HONEST about effect size: real but modest and individual (trackers
 * ~+3% HR / -7% HRV; strict RCTs smaller, one crossover found HRV unchanged, cortisol up) — which
 * is itself the reason to measure YOUR response. Grounded: meal-timing/HRV literature; digestion
 * thermogenesis. Firewall: lifestyle input in your own numbers, not diagnosis.
 */
const article: Article = {
  slug: 'eating-late-heart-rate-sleep',
  title: 'The Late Dinner Your Heart Works Through',
  seoTitle: 'Late-Night Eating, Heart Rate & Overnight HRV | ONDA Life',
  description:
    'A big meal close to bedtime can keep your heart rate up and your HRV down while both should be falling — digestion is sympathetic work at the wrong time. The effect is real but personal, which is exactly why it’s worth measuring.',
  category: 'ONDA Protocol',
  relatedSlugs: ['heart-rate-variability', 'intermittent-fasting-metabolic-switch', 'circadian-rhythm', 'what-your-apple-watch-records', 'how-much-sleep-do-you-need'],
  introStyle: 'emerald',
  neuralSuggestion: {
    text: 'The effect of a late meal is small, personal and invisible — three good reasons to read it in your own data.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE NIGHT SHIFT ]

> "You ate at ten. You slept at eleven. Your heart worked until two.

> Falling asleep on a full stomach feels fine — pleasant, even. But sleep and digestion want opposite things from your nervous system, and asking for both at once means one of them runs at the wrong time. The meal wins. Your recovery loses a little. And the receipt shows up in the numbers you don't look at."

---

## Section 1: Digestion is sympathetic work

At night your body is supposed to power down — resting heart rate drifts to its lowest, [variability](/glossary/heart-rate-variability) rises, core temperature drops. A large, late meal interrupts that descent. Digestion is metabolically expensive: blood flow redirects to the gut, core temperature ticks up from the thermic effect of food, and the heart works a little harder to support the circulation. That's mild [sympathetic](/glossary/sympathetic-nervous-system) activation arriving exactly when your physiology is trying to hand the night over to [parasympathetic](/glossary/parasympathetic-nervous-system) recovery.

The bigger and richer the meal, and the closer to sleep, the longer the overlap.

---

## Section 2: What the numbers actually show — honestly

Here is where most "eat early" content oversells. The effect is **real but modest, and it varies by person.** Tracker-scale data has put a late meal (within about three hours of bed) at roughly a **3% higher heart rate and a 7% lower HRV** overnight. But the best-controlled studies are gentler: some crossover trials feeding people late find sleeping heart rate up by *under a beat per minute*, and at least one found overnight HRV essentially unchanged while morning cortisol rose instead.

So the honest headline isn't "late eating wrecks your sleep." It's: **there's a small, genuine autonomic cost, its size depends on you, the meal, and the timing — and you can only know your version by measuring it.** That personal variability is a feature of the problem, not a reason to ignore it.

---

## Section 3: Why "3 hours before bed" is a starting point, not a law

The common rule — finish eating about three hours before bed, four if you're sensitive — is a reasonable default precisely *because* responses differ. A fast metabolizer with a modest dinner may see nothing. Someone eating a large, high-fat meal at 10 p.m. may see a clear bump in overnight heart rate and a flatter HRV. The rule points you at the right neighbourhood; your own data tells you the exact address.

---

## Section 4: Reading your own late-meal receipt

This is a measurable input, so measure it. With a **personal baseline** — your normal resting heart rate, variability and breathing overnight — a late, heavy dinner shows up as a departure from your corridor: a higher sleeping pulse, a lower [HRV](/glossary/heart-rate-variability) than your normal. ONDA reads those overnight signals from an Apple Watch and holds the corridor, so you can compare an early-dinner night to a late one directly and see whether *your* body pays the tax and how much — [your data, your call](/measurements).

The firewall: this is a lifestyle input written into your own numbers, not a medical finding. ONDA doesn't diagnose reflux, metabolic conditions or anything else — it shows you how a choice moved your baseline.

---

## Section 5: Practical, not dogmatic

You don't need a rigid cutoff; you need to know your own tolerance. Push your main meal earlier when you can, keep late meals lighter and lower-fat, and if you do eat late, a short [exhale-led wind-down](/articles/coherent-breathing-guide) before bed nudges the nervous system back toward recovery. Then check the corridor — if your late nights read the same as your early ones, you've earned your flexibility honestly. For the deeper mechanics of an overnight fast, see [intermittent fasting and the metabolic switch](/articles/intermittent-fasting-metabolic-switch).

> **The Hack:** Don't obey a blanket "no food after 8" rule — test it. Compare an early-dinner night against a late one in your own overnight heart rate and HRV. If your body pays the tax, you'll see it; if it doesn't, you'll stop worrying. Either way, the answer is in your data, not a chart for the average person.

> [ SYSTEM_STATUS ]
> MECHANISM: digestion = sympathetic load when pulse should fall
> EFFECT: overnight HR ↑ / HRV ↓ — real but modest and personal
> RULE: ~3h before bed is a default, not a law
> METHOD: compare your own nights — PRACTICE, NOT DIAGNOSIS
`,
  howToSteps: [
    {
      name: 'Understand the timing conflict',
      text: 'Sleep wants your body powering down; digestion is metabolically demanding sympathetic work. A big late meal makes both run at once, and the meal delays the night’s recovery.',
      protocolId: 'latemeal-conflict',
    },
    {
      name: 'Keep the effect in proportion',
      text: 'The overnight cost is real but modest and person-specific — roughly a few percent on heart rate and HRV at most, sometimes nothing. Don’t catastrophize it; measure it.',
      protocolId: 'latemeal-proportion',
    },
    {
      name: 'Test your own tolerance',
      text: 'Compare an early-dinner night against a late one in your own overnight resting heart rate and HRV. Your personal response — not a blanket rule — tells you your real cutoff.',
      protocolId: 'latemeal-test',
    },
    {
      name: 'When you do eat late, ease the landing',
      text: 'Keep late meals lighter and lower-fat, push the main meal earlier when you can, and add a short exhale-led wind-down before bed to nudge the nervous system back toward recovery.',
      protocolId: 'latemeal-ease',
    },
  ],
}

export default [article]
