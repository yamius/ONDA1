import type { Article } from './types'

/**
 * Methodology: how to measure HRV so readings are comparable (same time, same conditions, morning,
 * camera vs Watch). Complements hrv-different-every-device (which is about cross-device differences).
 * Ties to ONDA camera + baseline. Firewall: descriptive. Grounded: HRV sensitive to time-of-day,
 * position, breathing, caffeine, recency of food/exercise — control the conditions to read the trend.
 */
const article: Article = {
  slug: 'how-to-measure-hrv-consistently',
  title: 'How to Measure HRV So the Number Actually Means Something',
  seoTitle: 'How to Measure HRV Consistently (Same Time, Same Way) | ONDA Life',
  description:
    'HRV swings with time of day, posture, breathing, caffeine and your last meal — so a reading taken at random is noise. The simple rules that make your HRV comparable night to night, and why the trend beats any single number.',
  category: 'ONDA Protocol',
  relatedSlugs: ['hrv-different-every-device', 'heart-rate-variability', 'apple-watch-recovery-hrv-vs-overall-hrv', 'what-your-apple-watch-records', 'your-baseline-knows-first'],
  introStyle: 'indigo',
  neuralSuggestion: {
    text: 'A single HRV number is almost meaningless. A consistent series is one of the most useful things you own.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE NUMBER THAT WON'T SIT STILL ]

> "You check your HRV and it's 45. You check an hour later and it's 68. You panic, or you celebrate, and both are mistakes — because you just measured two different situations, not two different you's.

> HRV is gloriously sensitive. That sensitivity is what makes it useful and what makes it useless — depending entirely on whether you control the conditions. Measured carelessly, it's noise. Measured consistently, it's one of the best signals you have."

---

## Section 1: Why HRV moves so much

[Heart-rate variability](/glossary/heart-rate-variability) reflects the moment-to-moment balance of your autonomic nervous system, and that balance shifts constantly. Time of day moves it — HRV follows a circadian curve. Posture moves it — lying, sitting and standing give different numbers. Your breathing moves it hardest of all — slow breathing inflates it, fast breathing deflates it. Recent caffeine, a recent meal, a recent workout, alcohol the night before, even talking or a stray stressful thought all shift the reading.

None of that is a malfunction. It's the metric doing its job — tracking a system that genuinely changes minute to minute. Which means an HRV number without its *context* tells you almost nothing.

---

## Section 2: The one rule — measure the same way, every time

Everything about reading HRV well collapses into a single principle: **standardize the conditions so the only thing changing is you.** If you take every reading at the same time, in the same position, breathing the same way, you strip out the noise from time-of-day, posture and breath — and whatever's left is a real signal about your recovery state. Change the conditions and you're comparing apples to a different fruit each day.

This is why the *overnight* reading is so valuable: sleep is the most standardized condition you have. Same time (all night), same position (lying), same activity (none), same breathing (slow and regular). An overnight HRV averaged across the night is about as controlled a measurement as you'll get without a lab.

---

## Section 3: The practical checklist

If you're taking a spot reading rather than an overnight one, control what you can:

- **Same time of day** — first thing in the morning is the classic choice, before the day's inputs pile on.
- **Same position** — pick one (lying or seated) and always use it.
- **Before caffeine, food, or exercise** — all three move HRV; measure before them.
- **Breathe normally and stay still** — don't consciously slow your breath for the reading (that inflates it), don't talk, don't scroll.
- **Give it a minute to settle** — the first seconds after you sit down are still catching up.

Get those right and your day-to-day readings become comparable. Get them wrong and you're measuring your morning routine, not your physiology.

---

## Section 4: How ONDA keeps it honest

ONDA reads your pulse from the phone camera or an Apple Watch and, crucially, builds a **personal baseline** rather than judging any single number — because a single number is exactly the thing you shouldn't trust. It learns your own normal and the spread around it, so what you react to is a *departure from your corridor*, not a raw value. With an Apple Watch, overnight HRV feeds that baseline under the most standardized conditions you have; from the camera, a consistent daily reading works too, as long as you take it the same way each time — [your data, read properly](/measurements).

And don't compare across devices. Each one uses different sensors and math, so your Watch HRV and another tracker's won't match — that's expected, not an error. Pick one source and follow its trend; the full explanation is in [why your HRV is different on every device](/articles/hrv-different-every-device).

---

## Section 5: Trust the trend, not the reading

The final reframe, and the most important: **a single HRV number is almost meaningless; a consistent series is gold.** Don't react to today's value — watch where it sits relative to your own recent normal and which way it's trending. A steady, standardized series is what turns HRV from an anxiety-generator into an actual signal about your recovery, your training, and [when your baseline is drifting](/articles/your-baseline-knows-first).

> **The Hack:** Measure HRV the same way every single time — same hour, same position, before caffeine, breathing normally — or let an overnight read do it for you, since sleep standardizes the conditions automatically. Then ignore any single number and follow the trend against your own baseline. Consistency is the whole game.

> [ SYSTEM_STATUS ]
> SENSITIVITY: HRV shifts with time, posture, breath, caffeine, food
> RULE: standardize conditions — change only YOU
> BEST: overnight read (sleep = most standardized condition)
> USE: trust the trend vs your baseline, never one number — DESCRIPTIVE
`,
  howToSteps: [
    {
      name: 'Standardize the conditions',
      text: 'Take every reading at the same time of day, in the same position, breathing normally. Controlling time, posture and breath strips out the noise so the reading reflects your actual recovery state.',
      protocolId: 'hrv-standardize',
    },
    {
      name: 'Measure before the day’s inputs',
      text: 'Caffeine, food and exercise all move HRV. Take a spot reading first thing, before any of them, and give it a minute to settle rather than reading the instant you sit down.',
      protocolId: 'hrv-before',
    },
    {
      name: 'Prefer the overnight read',
      text: 'Sleep is the most standardized condition you have — same time, position, activity and breathing. An overnight HRV averaged across the night is the most controlled measurement without a lab.',
      protocolId: 'hrv-overnight',
    },
    {
      name: 'Follow the trend, not the number',
      text: 'A single reading is noise; a consistent series is signal. Watch where today sits against your own recent baseline and which way it’s heading — and don’t compare HRV across different devices.',
      protocolId: 'hrv-trend',
    },
  ],
}

export default [article]
