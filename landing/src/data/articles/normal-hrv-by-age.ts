import type { Article } from './types'

/**
 * Normal HRV by age — massive "good HRV / average HRV" query. AEO reference with an age×sex RMSSD table
 * from Natarajan 2020 (Fitbit users, Table S3; all numbers via {{fact}}; task 054, 2026-10-08).
 * Honest: ranges are broad, device-dependent guidance, NOT invented precision; the core message is
 * "your baseline and trend beat any population average." FAQ in ARTICLE_FAQ. Leads into ONDA baseline.
 */
const article: Article = {
  slug: 'normal-hrv-by-age',
  title: 'Normal HRV by Age: Chart for Men and Women, and What’s a Good HRV',
  seoTitle: 'Normal HRV by Age Chart: What’s a Good HRV? | ONDA Life',
  description:
    'HRV by age and sex: among about 8 million Fitbit users, median morning RMSSD was {{fact:hrv.fitbit.rmssd.am.female.median.20-21}} (women) and {{fact:hrv.fitbit.rmssd.am.male.median.20-21}} (men) at 20–21, {{fact:hrv.fitbit.rmssd.am.female.median.60-61}} and {{fact:hrv.fitbit.rmssd.am.male.median.60-61}} at 60–61. Not a medical norm.',
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
There is no universal "good" [HRV](/science/concepts/heart-rate-variability) number — it depends heavily on your age, and even more on your own baseline. The largest published dataset, from about 8 million Fitbit users (Natarajan 2020), shows the typical picture: median [RMSSD](/science/concepts/rmssd) between 6 and 7 a.m. was {{fact:hrv.fitbit.rmssd.am.female.median.20-21}} for women and {{fact:hrv.fitbit.rmssd.am.male.median.20-21}} for men at age 20–21, {{fact:hrv.fitbit.rmssd.am.female.median.40-41}} and {{fact:hrv.fitbit.rmssd.am.male.median.40-41}} at 40–41, and {{fact:hrv.fitbit.rmssd.am.female.median.60-61}} and {{fact:hrv.fitbit.rmssd.am.male.median.60-61}} at 60–61. That is how HRV was distributed among Fitbit users, not a medical norm. HRV naturally declines with age and varies a lot between devices, fitness levels, sleep and stress. The single most useful number isn't where you land against the population — it's whether your own HRV is trending up or down against your personal normal.

**Check your number → [HRV Calculator by Age](/tools/hrv)** — enter your age, sex and morning RMSSD to compare it with Fitbit users your age.

More quick answers → **[HRV Questions, Answered](/articles/hrv-questions-answered)** — 52 short answers on what lowers HRV, what raises it and how to measure it.

## HRV by age chart: what is normal for my age?

The biggest age-by-sex HRV dataset comes from about 8 million Fitbit users (Natarajan 2020). The table shows how early-morning RMSSD (6–7 a.m., near the end of sleep, measured by the wrist sensor while the wearer was still) was distributed among them. The median is the middle value; the typical range covers the middle half of users (25th–75th percentile). Two healthy people of the same age can differ by 40 ms or more, so use it as orientation, not a scoreboard.

**HRV (RMSSD) by age and sex — distribution among Fitbit users, 6–7 a.m.**

| Age | Women — median | Women — typical (p25–p75) | Men — median | Men — typical (p25–p75) |
|---|---|---|---|---|
| 20–21 | {{fact:hrv.fitbit.rmssd.am.female.median.20-21}} | {{fact:hrv.fitbit.rmssd.am.female.typical.20-21}} | {{fact:hrv.fitbit.rmssd.am.male.median.20-21}} | {{fact:hrv.fitbit.rmssd.am.male.typical.20-21}} |
| 25–26 | {{fact:hrv.fitbit.rmssd.am.female.median.25-26}} | {{fact:hrv.fitbit.rmssd.am.female.typical.25-26}} | {{fact:hrv.fitbit.rmssd.am.male.median.25-26}} | {{fact:hrv.fitbit.rmssd.am.male.typical.25-26}} |
| 30–31 | {{fact:hrv.fitbit.rmssd.am.female.median.30-31}} | {{fact:hrv.fitbit.rmssd.am.female.typical.30-31}} | {{fact:hrv.fitbit.rmssd.am.male.median.30-31}} | {{fact:hrv.fitbit.rmssd.am.male.typical.30-31}} |
| 35–36 | {{fact:hrv.fitbit.rmssd.am.female.median.35-36}} | {{fact:hrv.fitbit.rmssd.am.female.typical.35-36}} | {{fact:hrv.fitbit.rmssd.am.male.median.35-36}} | {{fact:hrv.fitbit.rmssd.am.male.typical.35-36}} |
| 40–41 | {{fact:hrv.fitbit.rmssd.am.female.median.40-41}} | {{fact:hrv.fitbit.rmssd.am.female.typical.40-41}} | {{fact:hrv.fitbit.rmssd.am.male.median.40-41}} | {{fact:hrv.fitbit.rmssd.am.male.typical.40-41}} |
| 45–46 | {{fact:hrv.fitbit.rmssd.am.female.median.45-46}} | {{fact:hrv.fitbit.rmssd.am.female.typical.45-46}} | {{fact:hrv.fitbit.rmssd.am.male.median.45-46}} | {{fact:hrv.fitbit.rmssd.am.male.typical.45-46}} |
| 50–51 | {{fact:hrv.fitbit.rmssd.am.female.median.50-51}} | {{fact:hrv.fitbit.rmssd.am.female.typical.50-51}} | {{fact:hrv.fitbit.rmssd.am.male.median.50-51}} | {{fact:hrv.fitbit.rmssd.am.male.typical.50-51}} |
| 55–56 | {{fact:hrv.fitbit.rmssd.am.female.median.55-56}} | {{fact:hrv.fitbit.rmssd.am.female.typical.55-56}} | {{fact:hrv.fitbit.rmssd.am.male.median.55-56}} | {{fact:hrv.fitbit.rmssd.am.male.typical.55-56}} |
| 60–61 | {{fact:hrv.fitbit.rmssd.am.female.median.60-61}} | {{fact:hrv.fitbit.rmssd.am.female.typical.60-61}} | {{fact:hrv.fitbit.rmssd.am.male.median.60-61}} | {{fact:hrv.fitbit.rmssd.am.male.typical.60-61}} |

What to keep in mind about this table:

- **Fitbit users, not the general population.** People who wear a fitness tracker are not a random sample, and age and sex were self-reported.
- **Wrist optical sensor, early morning.** Values come from several Fitbit models during still periods at 6–7 a.m.; a chest-strap ECG, another brand or a whole-night average gives different numbers.
- **Ages 20 to 61 only**, in two-year slices every five years. Our calculator compares ages 18–19 with 20–21 and 62–64 with 60–61; above 64 it makes no comparison and shows the 60–61 figures for information only.
- **The study was done by Fitbit.** Three of the four authors were Fitbit employees, and Fitbit funded the work.

If your number sits near your age row, that's normal. If it sits below, that alone means little — it could be your genetics, your device, or a rough week. What matters is the direction it moves over time.

Other studies show the same overall picture — HRV falls with age, and men and women differ only a little: a review of 44 studies of short resting ECG recordings (Nunan 2010), a 24-hour ECG study of 260 people aged 10 to 99 (Umetani 1998) and about 1,900 adults in the German KORA study (Voss 2015). They used different recordings, so their numbers can't go into one table with the Fitbit data.

## What about Apple Watch HRV?

Apple Watch shows [SDNN](/science/concepts/sdnn), not RMSSD, from short readings of about a minute taken several times a day and at night. SDNN and RMSSD are different measures, so the table above does not apply to Apple Watch numbers. Compare your own 7-day average in the Health app with your earlier weeks instead.

## HRV by age and sex: is it different for men and women?

Only a little. {{fact:claim.hrvSexDiffSmall}}. Studies with very different methods agree: in a 24-hour ECG study, women under 30 had lower HRV than men, the gap narrowed after 30 and disappeared after 50 (Umetani 1998). In about 1,900 German adults, the sex differences disappeared in the two oldest age decades (Voss 2015). In about 14,000 short ECGs, median HRV differed minimally between men and women (van den Berg 2018). And among 8 million Fitbit users, RMSSD showed no clear difference between the sexes (Natarajan 2020) — in the table above, the women's and men's medians are close and meet at about 50. The gap is small compared with the spread between individuals. For women, HRV also shifts across the menstrual cycle: vagal HRV tends to be lower in the second half of the cycle, after ovulation (Schmalenberger 2019), so compare the same phase of the cycle when you look at trends.

## Is my HRV too low?

A single low number is rarely a reason to worry. Check three things first:

1. **Compare like with like.** RMSSD (rings, straps, Whoop, Garmin, Oura) and SDNN (the standard Apple Watch HRV) are different measures, so don't compare an Apple Watch SDNN number with the RMSSD table above. Apple Watch Series 12 also shows a separate Recovery HRV (Apple hasn’t published its formula) — see [Recovery HRV vs Overall HRV](/articles/apple-watch-recovery-hrv-vs-overall-hrv).
2. **Look at your 7-day average**, not one night. One bad night, a drink or a cold can drop HRV sharply.
3. **Compare with your own baseline.** A sustained drop of more than about 10–20% below your usual range for a week or more is worth attention.

See a doctor if a low HRV comes with symptoms such as chest pain, shortness of breath, fainting, a racing or irregular heartbeat, or unusual tiredness — or if your [resting heart rate](/science/measurements/resting-heart-rate) is also clearly higher than usual. HRV on its own is not a diagnosis.
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
- **Late meals and caffeine** — both can lower HRV; late meals can also raise nighttime heart rate, while caffeine's effect on heart rate is inconsistent and fades with regular use.

A single low reading usually means one bad night. A run of low readings against your baseline is the signal worth paying attention to.

## See your own HRV and trend

Because HRV only means something against your own baseline, a chart of age averages can't tell you what you actually need to know. ONDA reads your resting heart rate, HRV and breathing from Apple Health — from your Apple Watch or another tracker that syncs there — and builds your personal corridor — your normal range — then shows you when today drifts outside it. Instead of asking "is 45 ms good?", you see whether *your* HRV is holding, climbing, or dropping, and what tends to move it. That's the number that actually reflects your recovery.
`,
}

export default [article]
