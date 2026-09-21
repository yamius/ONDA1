import type { Article } from './types'

/**
 * How much alcohol lowers HRV — dose-response by number of drinks. AEO reference with drinks×HRV
 * table. Numbers are CITED population averages (aggregate wearable / WHOOP / peer-reviewed smartwatch
 * studies), explicitly framed as averages that vary per person — not invented ONDA data. Distinct
 * from how-long-does-alcohol-stay-in-your-system (clearance) — this is the autonomic/HRV lens.
 */
const article: Article = {
  slug: 'how-much-alcohol-lowers-hrv',
  title: 'How Much Does Alcohol Lower Your HRV? The Data by Number of Drinks',
  seoTitle: 'How Much Alcohol Lowers HRV: Data by Drinks | ONDA Life',
  description:
    'Alcohol lowers heart rate variability and raises resting heart rate overnight, in a dose-dependent way. How much each drink costs your recovery, from wearable and peer-reviewed data.',
  category: 'ONDA Protocol',
  relatedSlugs: ['how-to-raise-hrv-naturally', 'how-long-does-alcohol-stay-in-your-system', 'caffeine-hrv-resting-heart-rate', 'eating-late-heart-rate-sleep', 'normal-hrv-by-age'],
  introStyle: 'amber',
  neuralSuggestion: {
    text: 'The effect of two glasses of wine on your HRV isn’t the same as on anyone else’s. See yours.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Alcohol lowers your heart rate variability (HRV) and raises your resting heart rate overnight, and the effect scales with how much you drink. In aggregate wearable data, a single drink drops HRV by around 3–4% and raises sleeping heart rate by about 1–3 bpm; four drinks can cut HRV by roughly 15%. WHOOP data shows even one drink lowers HRV by an average of 7 milliseconds and raises resting heart rate by 3 bpm. The mechanism isn't sedation — alcohol activates your sympathetic "fight or flight" system as your body processes it as a toxin, which is why you can sleep a full night after drinking and still wake up unrecovered.

## The dose-response: what each drink costs

The clearest way to see alcohol's effect is by number of standard drinks in one night. Analysis of aggregate wearable data shows a consistent dose-response curve for both heart rate variability (which drops) and sleeping heart rate (which rises):

| Drinks in one night | HRV change | Sleeping heart rate change |
|---|---|---|
| 1 | −3.4% | +1.4% |
| 2 | −8% | +3.3% |
| 3 | −8.6% | +4.3% |
| 4 | −15.3% | +6.9% |

The pattern is unambiguous: more alcohol means lower HRV and higher heart rate through the night, in a straight dose-dependent line. Drink type matters too — spirits and mixed drinks hit recovery hardest, while beer has the mildest effect, though even one beer measurably lowers HRV compared to a dry night. (These are population averages; your own response will differ — which is the whole point of watching your own numbers.)

## Why alcohol wrecks recovery even when you sleep

It's counterintuitive: alcohol is a depressant, so it should calm you. But its effect on your autonomic nervous system is stimulatory, not calming. As your body metabolizes ethanol and its by-product acetaldehyde, it treats them as toxins and mounts a physiological stress response. This shifts your autonomic balance toward the sympathetic branch and away from the parasympathetic "rest and digest" activity that HRV depends on.

The result is a night where your heart never fully downshifts. Peer-reviewed smartwatch research found that even moderate drinking raised nocturnal resting heart rate significantly (from about 63.6 to 66.6 bpm) — and notably, this happened *without* changing sleep architecture. In other words, your sleep stages can look normal while your cardiovascular system works overtime all night. That gap is why you can "sleep fine" and still feel drained: your body was busy, and your numbers show it even when your sleep tracker doesn't. For how long the alcohol itself lingers, see [how long alcohol stays in your system](/articles/how-long-does-alcohol-stay-in-your-system).

## Who is affected most

Two findings stand out from the research. First, **women tend to show larger disturbances** than men — greater HRV reduction and heart rate elevation for the same relative intake, likely due to lower first-pass metabolism of alcohol. Second, being **young and fit offers no protection**: a large real-world study of employees found that physical activity and youth did not shield people from alcohol's suppression of parasympathetic tone. Fitness helps your baseline HRV, but it doesn't cancel the overnight hit from drinking.

## How long until HRV recovers

For an occasional drinker, HRV and resting heart rate typically normalize within a day or two once the alcohol clears — the smartwatch study saw values return toward baseline during the post-drinking days. For heavier or long-term drinking, recovery of autonomic function takes longer; studies in people reducing alcohol use show HRV improving over weeks of reduced or stopped drinking. The takeaway for most people: an occasional night out shows up as a temporary dip you can watch bounce back, not permanent damage.

## See alcohol's effect in your own numbers

Population averages are useful, but the number that matters is *yours*. The effect of two glasses of wine on your HRV isn't the same as on someone else's. ONDA reads your resting heart rate, HRV and breathing against your own personal baseline, so a night of drinking shows up as a visible deviation from *your* normal — and you can watch it return to your corridor over the following days. Instead of guessing what alcohol does to you, you see it, in your own data.
`,
}

export default [article]
