import type { Article } from './types'

/**
 * Resting heart rate by age — massive "normal resting heart rate / RHR chart" query. AEO reference
 * with age×RHR table. Honest: ranges are general guidance, no medical verdicts; trend vs baseline
 * beats the average; fitness moves RHR more than age within adulthood. FAQ in ARTICLE_FAQ.
 */
const article: Article = {
  slug: 'resting-heart-rate-by-age',
  title: 'Resting Heart Rate by Age: What’s Normal?',
  seoTitle: 'Resting Heart Rate by Age: What’s Normal? | ONDA Life',
  description:
    'A normal resting heart rate is 60–100 bpm for adults, but the healthy range shifts with age and fitness. Typical resting heart rate ranges by age, what raises or lowers yours, and when it matters.',
  category: 'Biological Software',
  relatedSlugs: ['normal-hrv-by-age', 'heart-rate-recovery-fitness-marker', 'how-to-measure-hrv-consistently', 'caffeine-hrv-resting-heart-rate', 'your-baseline-knows-first'],
  introStyle: 'rose',
  neuralSuggestion: {
    text: 'One reading tells you little. Your resting-heart-rate trend against your own normal tells you a lot.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
A normal resting heart rate for most adults is 60 to 100 beats per minute, but the healthy range shifts with age and fitness. Newborns run high (100–160 bpm), children settle down through their teens, and by adulthood most people land between 60 and 100 bpm at rest — with well-trained adults often in the 40s or 50s. A lower resting heart rate generally reflects better cardiovascular fitness, because a stronger heart pumps more blood per beat and needs fewer beats. As with HRV, the single most useful comparison isn't the population average — it's how your resting heart rate is trending against your own baseline.

## Typical resting heart rate by age

The adult "normal" band of 60–100 bpm is wide, and fitness moves people within it more than age does. These are general ranges for a healthy resting heart rate:

| Age | Typical resting heart rate |
|---|---|
| Newborn (0–1 mo) | 100–160 bpm |
| Child (1–10 yr) | 70–120 bpm |
| Teen (11–17 yr) | 60–100 bpm |
| Adult (18+) | 60–100 bpm |
| Well-trained adult | 40–60 bpm |

Within adulthood, age itself moves resting heart rate less than you'd expect — a fit 60-year-old can easily have a lower resting heart rate than an unfit 30-year-old. Fitness, stress, sleep and stimulants explain most of the difference.

## What raises and lowers your resting heart rate

Your resting heart rate is a daily readout of how your body is doing. Common influences:

**Lowers it (usually good):** regular aerobic exercise, good sleep, hydration, slow breathing practice. Endurance training is the strongest long-term lever — it's why athletes sit in the 40s and 50s.

**Raises it (worth noticing):** poor or short sleep, alcohol, [caffeine](/articles/caffeine-hrv-resting-heart-rate), stress, illness, dehydration, and hot environments. A resting heart rate that's several beats above your normal for a few days often means your body is under load — a cold coming on, accumulated stress, or poor recovery.

A single elevated reading usually means one rough night or a recent coffee. A sustained rise above your baseline is the more meaningful signal.

## Resting heart rate while sleeping

Your lowest resting heart rate of the day usually occurs during deep sleep, when parasympathetic "rest and digest" activity dominates. This overnight low is one of the most stable, comparable numbers you can track, because it's measured under consistent conditions — no caffeine, movement or stress in the moment. It's also where alcohol and late meals show up clearly: both keep your sleeping heart rate elevated through the night, which is why you can wake up unrecovered even after a full night in bed. Tracking your overnight resting heart rate against your own normal is one of the clearest windows into your recovery.

## When resting heart rate matters

A resting heart rate inside the normal range for your age and fitness is reassuring, but the number to watch is the *change*. A steady climb of several beats above your personal baseline — sustained over days, not one reading — can reflect illness, overtraining, stress, or poor sleep. Conversely, a resting heart rate that trends down as you get fitter is a sign of improving cardiovascular health. Extremes in either direction — persistently very high, or very low with symptoms like dizziness or fatigue — are worth discussing with a doctor, but resting heart rate on its own is a signal, not a diagnosis.

## See your resting heart rate trend

A one-time reading tells you little; your trend tells you a lot. ONDA reads your resting heart rate and HRV from your Apple Watch history and builds your personal baseline — your normal range — then shows you when today drifts outside it. Instead of wondering whether 58 or 68 is "good," you see whether *your* resting heart rate is holding steady, dropping as you get fitter, or creeping up because something's off. That trend is what actually reflects your health.
`,
}

export default [article]
