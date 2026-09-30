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
  image: '/images/articles/normal-hrv-by-age.jpg',
  imageAlt:
    'Normal HRV by Age — illustration: a row of silhouettes from young to old, each with a heart-rhythm line above them whose variability gently decreases with age.',
  imageTitle: 'Normal HRV by Age',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Stop asking “is 45 ms good?” The number that matters is whether YOUR HRV is trending up or down.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
There is no universal "good" HRV number — it depends heavily on your age, and even more on your own baseline. As a guide, the median overnight HRV (measured as RMSSD by Oura, Whoop, Garmin and Polar) is about 58 ms at 18–29, 50 ms in your 30s, 42 ms in your 40s, 36 ms in your 50s, 30 ms in your 60s and 26 ms after 70. Apple Watch reports a different measure, SDNN, with its own norms (below). HRV naturally declines with age and varies a lot between devices, fitness levels, sleep and stress. The single most useful number isn't where you land against the population — it's whether your own HRV is trending up or down against your personal normal.

**Check your number → [HRV Calculator by Age](/tools/hrv)** — enter your age and HRV to see your percentile.

More quick answers → **[HRV Questions, Answered](/articles/hrv-questions-answered)** — 52 short answers on what lowers HRV, what raises it and how to measure it.

## What is a normal HRV for my age?

A normal overnight RMSSD runs from a median of about 58 ms at ages 18–29 down to about 26 ms at 70+ — these are population norms for overnight RMSSD, the number rings and straps report. The median is the middle value; the typical range covers the middle half of healthy people (25th–75th percentile). HRV varies enormously between individuals, so two healthy people the same age can differ by 40 ms or more. Use this as orientation, not a scoreboard:

| Age | Median RMSSD | Typical range (p25–p75) |
|---|---|---|
| 18–29 | 58 ms | 42–78 ms |
| 30–39 | 50 ms | 36–68 ms |
| 40–49 | 42 ms | 30–56 ms |
| 50–59 | 36 ms | 26–48 ms |
| 60–69 | 30 ms | 22–42 ms |
| 70+ | 26 ms | 19–36 ms |

If your number sits inside or near your age band, that's normal. If it sits below, that alone means little — it could be your genetics, your device, or a rough week. What matters is the direction it moves over time. How these norms were built (Nunan 2010, Umetani 1998, Voss 2015) is explained on the [HRV calculator](/tools/hrv) page.

## What is a normal HRV on Apple Watch?

A normal Apple Watch HRV (SDNN) runs from a median of about 46 ms at ages 18–34 down to about 26 ms at 65+ — Apple Watch shows SDNN, not RMSSD, so its numbers can't be compared with the table above. In a study of about 1,900 healthy adults (Voss 2015, 5-minute resting ECG), SDNN ran:

| Age | Median SDNN | Typical range (p25–p75) |
|---|---|---|
| 18–34 | 46 ms | 35–60 ms |
| 35–44 | 42 ms | 32–54 ms |
| 45–54 | 34 ms | 27–44 ms |
| 55–64 | 29 ms | 22–39 ms |
| 65+ | 26 ms | 20–35 ms |

Apple Watch takes short readings of about a minute several times a day and at night, so single values jump around more than a lab recording. Compare your 7-day average in the Health app, not one reading.

## Is normal HRV different for men and women?

Slightly, and mostly in younger adults. In a large 24-hour ECG study, women under about 30 had somewhat lower HRV than men of the same age, and the difference faded after about 50 (Umetani 1998). The gap is small compared with the spread between individuals, so the same age table works for both sexes as a rough guide. For women, HRV also shifts across the menstrual cycle: vagal HRV tends to be lower in the second half of the cycle, after ovulation (Schmalenberger 2019), so compare the same phase of the cycle when you look at trends.

A study of wearable data from about 8 million people confirmed the same picture at scale: HRV falls steadily with age, and people of the same age differ widely (Natarajan 2020).

## Is my HRV too low?

A single low number is rarely a reason to worry. Check three things first:

1. **Compare like with like.** RMSSD (rings, straps, Whoop, Garmin, Oura) and SDNN (the standard Apple Watch HRV) are different measures, so use the matching table above. Apple Watch Series 12 also shows an RMSSD-based Recovery HRV — see [Recovery HRV vs Overall HRV](/articles/apple-watch-recovery-hrv-vs-overall-hrv).
2. **Look at your 7-day average**, not one night. One bad night, a drink or a cold can drop HRV sharply.
3. **Compare with your own baseline.** A sustained drop of more than about 10–20% below your usual range for a week or more is worth attention.

See a doctor if a low HRV comes with symptoms such as chest pain, shortness of breath, fainting, a racing or irregular heartbeat, or unusual tiredness — or if your resting heart rate is also clearly higher than usual. HRV on its own is not a diagnosis.
## Why does HRV drop with age?

HRV drops with age because the flexibility of your autonomic nervous system — how nimbly it switches between "fight or flight" and "rest and digest" — gradually declines as the vagus nerve's influence on the heart weakens and the cardiovascular system stiffens. This is normal and expected; a 55-year-old with an HRV of 35 ms is not "worse off" than a 25-year-old at 70 ms. They're at different points on the same curve. The decline is also not fixed — fitness, sleep, and consistent [slow-breathing practice](/articles/how-to-raise-hrv-naturally) can slow it and even reverse short-term dips.

## Why your baseline beats any average

Here's the core problem with age charts: the range within one age is far wider than the difference between ages. That makes the population average almost useless for judging your own health. What is useful is your **personal baseline** — your own typical HRV over the last few weeks — and how today compares to it. A drop from your normal of 60 ms down to 40 ms is a real, meaningful signal about your recovery. The number 40 on its own is not; for someone else it might be perfectly normal. HRV is a you-versus-you metric, not a you-versus-everyone one — which is exactly [why your own baseline knows first](/articles/your-baseline-knows-first).

## What lowers your HRV?

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
