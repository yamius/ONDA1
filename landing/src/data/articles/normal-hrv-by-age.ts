import type { Article } from './types'

/**
 * Normal HRV by age — massive "good HRV / average HRV" query. AEO reference with age×RMSSD table.
 * Honest: ranges are broad, device-dependent guidance, NOT invented precision; the core message is
 * "your baseline and trend beat any population average." FAQ in ARTICLE_FAQ. Leads into ONDA baseline.
 */
const article: Article = {
  slug: 'normal-hrv-by-age',
  title: 'Normal HRV by Age: What’s a Good Heart Rate Variability?',
  seoTitle: 'Normal HRV by Age: What’s a Good HRV? | ONDA Life',
  description:
    'There’s no single good HRV number — it depends on age and your own baseline. Typical HRV ranges by age, why HRV drops as you get older, and why your trend matters more than any average.',
  category: 'Biological Software',
  relatedSlugs: ['how-to-raise-hrv-naturally', 'how-to-measure-hrv-consistently', 'hrv-different-every-device', 'resting-heart-rate-by-age', 'your-baseline-knows-first'],
  introStyle: 'rose',
  neuralSuggestion: {
    text: 'Stop asking “is 45 ms good?” The number that matters is whether YOUR HRV is trending up or down.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
There is no universal "good" HRV number — it depends heavily on your age, and even more on your own baseline. As a rough guide, average overnight HRV (measured as RMSSD) runs about 60–100 ms in your 20s, 45–75 ms in your 30s, 35–60 ms in your 40s, 25–50 ms in your 50s, and 20–40 ms after 60. HRV naturally declines with age and varies a lot between devices, fitness levels, sleep and stress. The single most useful number isn't where you land against the population — it's whether your own HRV is trending up or down against your personal normal.

## Typical HRV ranges by age

These ranges are broad on purpose. HRV varies enormously between individuals, so two healthy people the same age can differ by 40 ms or more. Use this as orientation, not a scoreboard:

| Age range | Typical overnight HRV (RMSSD) |
|---|---|
| 20–29 | ~60–100 ms |
| 30–39 | ~45–75 ms |
| 40–49 | ~35–60 ms |
| 50–59 | ~25–50 ms |
| 60+ | ~20–40 ms |

If your number sits inside or near your age band, that's normal. If it sits below, that alone means little — it could be your genetics, your device, or a rough week. What matters is the direction it moves over time.

## Why HRV drops with age

HRV reflects the flexibility of your autonomic nervous system — how nimbly it switches between "fight or flight" and "rest and digest." That flexibility gradually declines with age as the vagus nerve's influence on the heart weakens and the cardiovascular system stiffens. This is normal and expected; a 55-year-old with an HRV of 35 ms is not "worse off" than a 25-year-old at 70 ms. They're at different points on the same curve. The decline is also not fixed — fitness, sleep, and consistent [slow-breathing practice](/articles/how-to-raise-hrv-naturally) can slow it and even reverse short-term dips.

## Why your baseline beats any average

Here's the core problem with age charts: the range within one age is far wider than the difference between ages. That makes the population average almost useless for judging your own health. What is useful is your **personal baseline** — your own typical HRV over the last few weeks — and how today compares to it. A drop from your normal of 60 ms down to 40 ms is a real, meaningful signal about your recovery. The number 40 on its own is not; for someone else it might be perfectly normal. HRV is a you-versus-you metric, not a you-versus-everyone one — which is exactly [why your own baseline knows first](/articles/your-baseline-knows-first).

## What lowers your HRV

Day to day, HRV moves in response to how you're recovering. The most common things that push it down:

- **Alcohol** — even one drink measurably lowers overnight HRV.
- **Poor or short sleep** — the fastest way to a low reading.
- **Stress and illness** — both keep the sympathetic system switched on.
- **Overtraining** — hard training without recovery suppresses HRV.
- **Late meals and caffeine** — both can raise nighttime heart rate and lower HRV.

A single low reading usually means one bad night. A run of low readings against your baseline is the signal worth paying attention to.

## See your own HRV and trend

Because HRV only means something against your own baseline, a chart of age averages can't tell you what you actually need to know. ONDA reads your resting heart rate, HRV and breathing from your Apple Watch history and builds your personal corridor — your normal range — then shows you when today drifts outside it. Instead of asking "is 45 ms good?", you see whether *your* HRV is holding, climbing, or dropping, and what tends to move it. That's the number that actually reflects your recovery.
`,
}

export default [article]
