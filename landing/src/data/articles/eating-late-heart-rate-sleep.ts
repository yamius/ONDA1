import type { Article } from './types'

/**
 * Late-night eating → worse sleep (Crispim 2011, correlational) and higher cortisol awakening
 * response with unchanged short-recording HRV (Uçar 2021 crossover). Unsourced wearable-company
 * percentages removed (2026-10). Answer-first + table + test protocol + doctor note.
 * Firewall: lifestyle input in your own numbers, not diagnosis.
 */
const article: Article = {
  slug: 'eating-late-heart-rate-sleep',
  title: 'The Late Dinner Your Heart Works Through',
  seoTitle: 'Eating Late: Heart Rate, HRV and Sleep | ONDA Life',
  description:
    'A heavy late meal can worsen sleep and raise morning cortisol, but heart effects look small and personal. What studies show and how to test yours.',
  category: 'ONDA Protocol',
  relatedSlugs: ['heart-rate-variability', 'intermittent-fasting-metabolic-switch', 'circadian-rhythm', 'what-your-apple-watch-records', 'how-much-sleep-do-you-need'],
  introStyle: 'emerald',
  image: '/images/articles/eating-late-heart-rate-sleep.webp',
  imageAlt:
    "Translucent torso with a glowing digestive system working at night and a heart beating slightly elevated — a late meal’s small overnight cost to heart rate and HRV.",
  imageTitle: "The late dinner your heart works through — a small overnight cost",
  imageCaption:
    "A late dinner is sympathetic work at the wrong time — a small, personal overnight cost that keeps heart rate up and HRV down while both should fall.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'The effect of a late meal is small, personal and invisible — three good reasons to read it in your own data.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Eating a large meal close to bedtime can make sleep worse and keep your body working when it should be winding down — but the measured effect on heart rate and [HRV](/science/concepts/heart-rate-variability) is small and varies from person to person. In a polysomnography study, people who ate more of their food near sleep had poorer sleep quality (Crispim 2011), and in a controlled crossover trial a 10 p.m. meal raised the next morning’s cortisol awakening response without changing a short HRV recording (Uçar 2021). The practical takeaway: finish heavy meals a few hours before bed, and check your own overnight numbers to see whether late dinners cost you anything.

---

## Why can a late meal disturb the night?

A late meal can disturb the night because digestion is active work that overlaps with the hours your body uses to slow down. At night [resting heart rate](/science/measurements/resting-heart-rate) normally drifts toward its lowest point, [heart rate variability](/glossary/heart-rate-variability) tends to rise, and core temperature falls. Digesting a big meal redirects blood flow to the gut and produces heat (the thermic effect of food), a mild [sympathetic](/glossary/sympathetic-nervous-system) load at a time when [parasympathetic](/glossary/parasympathetic-nervous-system) recovery should dominate.

The bigger and richer the meal, and the closer to sleep, the longer that overlap lasts.

---

## What does the research actually show?

The research shows a real but modest link between late eating and worse sleep, with weaker evidence for direct heart-rate or HRV effects.

| Study | Design | What it found |
|---|---|---|
| Crispim et al., 2011 (*J Clin Sleep Med*) | 52 healthy adults, overnight polysomnography + 3-day food diary | Eating near the sleep period (dinner, late snack) was associated with poorer sleep; in women, a higher share of night-time fat and calories correlated with longer sleep latency and lower sleep efficiency |
| Uçar et al., 2021 (*Stress and Health*) | Crossover, 16 healthy young men, high-calorie meal at 10 p.m. | Both a sugary and a protein- and fat-rich late meal raised the cortisol awakening response; HRV (5-minute ECG) did not change; the fat-rich meal disturbed sleep |

Two honest caveats. Crispim 2011 is correlational, so it can’t prove the food caused the poor sleep. Uçar 2021 was small, included only young men, and measured HRV in a short recording rather than across the whole night. Wearable companies have published their own aggregate data on late meals and overnight heart rate, but those figures are not peer-reviewed, so we don’t quote them here.

The fair headline isn’t "late eating wrecks your sleep." It’s that **a heavy late meal carries a small, genuine cost for many people, its size depends on you and the meal, and you can only know your version by measuring it.**

---

## How long before bed should you stop eating?

Finishing a large meal about three hours before bed is a sensible rule of thumb, not a measured cutoff. A modest dinner may make no visible difference; a large, high-fat meal late at night is the scenario most likely to show up as worse sleep. Treat the three-hour rule as a starting point and adjust it to what your own data shows.

---

## How can you test your own response?

You can test your response by comparing early-dinner nights with late-dinner nights against your own baseline.

1. **Keep everything else steady** for a week or two — similar bedtime, no alcohol, no late training.
2. **Alternate dinner timing:** a few nights finishing 3+ hours before bed, a few nights eating within 1–2 hours of bed.
3. **Log meal time and size** (a quick note is enough).
4. **Compare overnight resting heart rate and HRV** on the two kinds of nights against [your normal range](/science/concepts/hrv-baseline), plus how you slept.
5. **Look for a consistent pattern**, not one bad night — single nights are noisy.

ONDA reads overnight heart rate, HRV and [respiratory rate](/science/measurements/respiratory-rate) from Apple Health (Apple Watch or another tracker that syncs there) and holds a personal 14-day baseline, so a late, heavy dinner shows up as a departure from your own corridor rather than from a population average — [see what ONDA measures](/measurements). It is descriptive, not diagnostic: ONDA doesn’t diagnose reflux, metabolic conditions or anything else.

---

## How do you make late meals easier on sleep?

You make late meals easier on sleep by keeping them smaller and lighter and moving the main meal earlier when you can. If you do eat late, a few minutes of slow, [exhale-led breathing](/articles/coherent-breathing-guide) before bed can help you wind down. For the deeper mechanics of an overnight fast, see [intermittent fasting and the metabolic switch](/articles/intermittent-fasting-metabolic-switch).

---

## When should you talk to a doctor?

Talk to a doctor if late meals regularly cause heartburn, a sour taste or coughing when you lie down — that can be gastro-oesophageal reflux, which is treatable. If you have diabetes and take insulin or other glucose-lowering medicines, don’t change meal timing without checking with your care team, because shifting or skipping meals can cause low blood sugar overnight. Persistent poor sleep, loud snoring or daytime exhaustion also deserve a medical look.

> **The Hack:** Don’t obey a blanket "no food after 8" rule — test it. Compare early-dinner nights against late ones in your own overnight heart rate, HRV and sleep. If your body pays a tax, you’ll see it; if it doesn’t, you can stop worrying.

> [ SYSTEM_STATUS ]
> MECHANISM: digestion overlaps the night’s wind-down
> EVIDENCE: worse sleep linked to late eating; HRV effect small or unclear
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
      text: 'The overnight cost is real but modest and person-specific — studies link late eating to worse sleep and a higher morning cortisol response, while measured HRV effects are small or absent. Don’t catastrophize it; measure it.',
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
