import type { Article } from './types'

/**
 * Timely investigation of Apple's September 2026 HRV overhaul — Series 12 /
 * Ultra 4 on watchOS 27 split HRV into Recovery HRV and Overall HRV, and
 * HealthKit added heartRateVariabilityRMSSD as a distinct type. Apple has NOT
 * published which statistic each variant uses: never state Recovery = RMSSD
 * or Overall = SDNN as fact (owner rule 2026-10-04: no unofficial facts). High-intent, freshness-driven AIO target: "recovery HRV vs
 * overall HRV", "why did my Apple Watch HRV change", "SDNN vs RMSSD Apple
 * Watch". Facts grounded in named public sources (Apple Newsroom, MacRumors,
 * 9to5Mac, gadgetsandwearables). Honest ONDA tie: live biofeedback ≠ these
 * passive overnight metrics.
 */
const article: Article = {
  slug: 'apple-watch-recovery-hrv-vs-overall-hrv',
  title: 'Apple Watch Now Shows Two HRV Numbers: Recovery HRV vs Overall HRV',
  seoTitle: 'Apple Watch Recovery HRV vs Overall HRV Explained | ONDA Life',
  description:
    'In September 2026 Apple split Apple Watch HRV into Recovery HRV and Overall HRV, added RMSSD to HealthKit, and started measuring HRV every ~5 minutes. What changed, why there are two numbers, and why you can’t merge the old and new history.',
  category: 'Neural Hardware',
  relatedSlugs: ['heart-rate-variability', 'hrv-different-every-device', 'what-your-apple-watch-records', 'autonomic-nervous-system'],
  introStyle: 'slate',
  image: '/images/articles/apple-watch-recovery-hrv-vs-overall-hrv.webp',
  imageAlt:
    "An Apple Watch emitting two diverging HRV waveforms from the same heartbeats — Recovery HRV and Overall HRV, two separate readings, never merged.",
  imageTitle: "Two HRV numbers — Recovery HRV vs Overall HRV",
  imageCaption:
    "Apple Watch's two HRV numbers explained — Recovery HRV versus Overall HRV, two separate readings from the same heartbeats that should never be merged.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'These are passive overnight metrics. Training your HRV in the moment is a different job entirely.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ SYSTEM UPDATE: TWO NUMBERS WHERE THERE WAS ONE ]

> "People opened the Health app in late September 2026 and found something new: their Apple Watch was suddenly reporting **two** heart-rate-variability numbers instead of one — 'Recovery HRV' and 'Overall HRV' — and they often didn't match.

**Check your number → [HRV Calculator by Age](/tools/hrv)** — see where your HRV sits for your age (RMSSD from Oura, Whoop, Garmin or SDNN from Apple Watch).

> This wasn't a bug. With the Apple Watch Series 12 and Ultra 4 on watchOS 27, Apple rebuilt how the watch measures HRV — it now reports two HRV variants, measures far more *often*, and gives each number a different job. If your HRV looks different, jumpier, or hard to compare to last month, here is exactly what happened."

---

## Section 1: What Apple actually changed

The Series 12 and Ultra 4, announced in September 2026, ship with a new **Health Sensing System** — new optical and electrical heart sensors — and three things changed at once (Apple Newsroom, September 2026):

1. **HRV is now sampled about every 5 minutes** — roughly 24× more often than before, where the watch captured HRV only about once every two hours (MacRumors; 9to5Mac, September 2026).
2. **HRV split into two metrics.** The watch now surfaces **Recovery HRV** and **Overall HRV** as separate readings.
3. **Overnight Vitals now analyses Recovery HRV against your personal baseline**, with a new toggle between overnight and daytime vitals.

More frequent sampling of a noisy signal is why the number can look jumpier than the once-every-two-hours figure you were used to.

---

## What is the difference between Recovery HRV and Overall HRV?

Apple describes Recovery HRV as best for daily signals of stress and recovery, and Overall HRV as best for insights on broader health, including cardiovascular health (Apple Newsroom, 9 September 2026):

- **Recovery HRV** — aimed at *day-to-day* stress and recovery. It is the number to watch for "am I recovered today?" and it is the one Overnight Vitals compares against your personal baseline.
- **Overall HRV** — a *broader* view of your HRV, oriented toward general and cardiovascular-health context rather than daily readiness.

**What Apple has not said:** Apple has not published the formula behind Recovery HRV or Overall HRV. watchOS 27 added an RMSSD data type to Apple Health alongside the long-standing SDNN type, and Recovery HRV tends to read higher than Overall HRV, but Apple does not say which statistic each variant uses. You will see reviews claim "Recovery HRV = RMSSD" — treat that as an educated guess, not an Apple specification.

So the practical reason they don't match: **they are two different calculations from the same heartbeats, built for different questions.** Neither is "wrong."

---

## Why does SDNN vs RMSSD matter?

For years there was a quiet mismatch in the wearable world. Apple Health's long-standing HRV value in [HealthKit](/articles/what-your-apple-watch-records) is **SDNN** — the standard deviation of the intervals between normal heartbeats. But the recovery scores from Whoop, Oura and Garmin are built primarily on **RMSSD** — the root-mean-square of successive differences, which tracks the parasympathetic (vagal) branch more directly.

That mismatch is exactly why an Apple Watch HRV of, say, 40 never lined up with a Whoop or Oura number — [different devices report different HRV](/articles/hrv-different-every-device) partly because they report *different metrics*.

In 2026 that changed. With iOS and watchOS 27, **HealthKit added \`heartRateVariabilityRMSSD\` as its own distinct type**, separate from the existing \`heartRateVariabilitySDNN\` — and the two are never aliased or substituted (Apple HealthKit documentation). For the first time, third-party apps can read a native RMSSD value from Apple Health, the same family of metric the dedicated recovery trackers use. Older Apple Watch models report SDNN only.

---

## Can you combine old Apple Watch HRV history with Recovery HRV?

No. Your old Apple Watch history is SDNN, sampled roughly every two hours; Recovery HRV is a new variant, measured as often as every five minutes, whose formula Apple has not published. That makes them **separate series**, not one continuous line.

- Recovery HRV and Overall HRV will usually **differ** for the same night (Recovery HRV tends to read higher), so don't compare them directly.
- Likewise, SDNN and RMSSD are different statistics on different scales — a chart that splices SDNN months onto RMSSD months is a broken time series. Treat them as separate lines.
- Give any new baseline time. A personal HRV baseline needs roughly a week to stabilise and closer to a month to become reliable, so the first few weeks after the switch will look unsettled by design.

If your "HRV" appears to have jumped in late September 2026, this is almost certainly why — the measurement under the label changed, not your physiology.

---

## Section 5: What it means practically

- **For cross-checking Whoop/Oura/Garmin (RMSSD-based figures):** compare against the **RMSSD** value apps can now read from Apple Health, and treat Recovery HRV as Apple's daily-recovery view. Apple hasn't confirmed Recovery HRV is RMSSD, and device-to-device differences never fully vanish.
- **For broader cardiovascular context:** Apple points to Overall HRV.
- **For daily readiness:** Recovery HRV against your personal baseline is the intended signal — read the *trend*, not a single morning number.

And the honest limit: all of this is still **passive measurement** — the watch reads your nervous system while you sleep. Reading a number, however often, is a different job from *training* the system that produces it. That live, in-the-moment part — following guided breathing while you watch your own heart rhythm respond — is [HRV biofeedback](/hrv-biofeedback), and it runs on the live heartbeat, not the overnight average. As the ONDA framing puts it: most tools score you *after*; the point of biofeedback is what you can see *during*.

> **The Hack:** After updating, treat your Apple Watch HRV as a fresh start. Use **Recovery HRV** for daily recovery, **Overall HRV** for the broader picture, and don't compare the two to each other — or splice them onto your old SDNN history.

## Apple Watch vs other HRV trackers

Now that Apple Health also exposes an RMSSD value, these head-to-heads weigh the Apple Watch against the main alternatives:

- [Apple Watch Series 12 vs Whoop 5.0](/reviews/vs/apple-watch-series-12-vs-whoop-5-0)
- [Apple Watch Series 12 vs Oura Ring 4](/reviews/vs/apple-watch-series-12-vs-oura-ring-4)
- [Apple Watch Series 12 vs Oura Ring 5](/reviews/vs/apple-watch-series-12-vs-oura-ring-5)
- [Apple Watch Series 12 vs Garmin Venu 4](/reviews/vs/apple-watch-series-12-vs-garmin-venu-4)
- [Apple Watch Ultra 4 vs Apple Watch Series 12](/reviews/vs/apple-watch-ultra-4-vs-apple-watch-series-12)

> [ METRIC_MAP ]
> RECOVERY_HRV → daily stress & recovery, vs personal baseline, up to every 5 min
> OVERALL_HRV → broader / cardiovascular health
> FORMULAS: not published by Apple · HealthKit types: SDNN (long-standing) + RMSSD (new in 27)
> RULE: separate metrics, separate scales — never merge the two histories
`,
  howToSteps: [
    {
      name: 'Compare with Whoop, Oura or Garmin carefully',
      text: 'Those trackers report RMSSD-based figures. Compare them with the RMSSD value apps can now read from Apple Health; Apple has not published whether Recovery HRV itself uses RMSSD.',
      protocolId: 'awhrv-recovery',
    },
    {
      name: 'Keep Overall HRV as your long-term line',
      text: 'Apple positions Overall HRV for broader health insights, including cardiovascular health. Do not judge daily readiness from it.',
      protocolId: 'awhrv-overall',
    },
    {
      name: 'Never merge the two histories',
      text: 'Recovery HRV and Overall HRV are separate readings that usually differ (Recovery HRV tends to read higher), so do not compare them directly. Splicing old SDNN history onto the new readings creates a broken time series.',
      protocolId: 'awhrv-nomerge',
    },
    {
      name: 'Let the new baseline settle',
      text: 'A personal HRV baseline needs about a week to stabilise and closer to a month to be reliable. Expect the first few weeks after the update to look unsettled, and read the trend, not a single day.',
      protocolId: 'awhrv-baseline',
    },
  ],
}

export default [article]
