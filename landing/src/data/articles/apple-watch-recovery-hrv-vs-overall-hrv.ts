import type { Article } from './types'

/**
 * Timely investigation of Apple's September 2026 HRV overhaul — Series 12 /
 * Ultra 4 Health Sensing System split HRV into Recovery HRV (RMSSD) and
 * Overall HRV (SDNN), and HealthKit added heartRateVariabilityRMSSD as a
 * distinct type. High-intent, freshness-driven AIO target: "recovery HRV vs
 * overall HRV", "why did my Apple Watch HRV change", "SDNN vs RMSSD Apple
 * Watch". Facts grounded in named public sources (Apple Newsroom, MacRumors,
 * 9to5Mac, gadgetsandwearables). Honest ONDA tie: live biofeedback ≠ these
 * passive overnight metrics.
 */
const article: Article = {
  slug: 'apple-watch-recovery-hrv-vs-overall-hrv',
  title: 'Apple Watch Now Shows Two HRV Numbers: Recovery HRV vs Overall HRV',
  seoTitle: 'Apple Watch Recovery HRV vs Overall HRV (SDNN vs RMSSD) | ONDA Life',
  description:
    'In September 2026 Apple split Apple Watch HRV into Recovery HRV and Overall HRV, added RMSSD to HealthKit, and started measuring HRV every ~5 minutes. What changed, why there are two numbers, and why you can’t merge the old and new history.',
  category: 'Neural Hardware',
  relatedSlugs: ['heart-rate-variability', 'hrv-different-every-device', 'what-your-apple-watch-records', 'autonomic-nervous-system'],
  introStyle: 'slate',
  image: '/images/articles/apple-watch-recovery-hrv-vs-overall-hrv.webp',
  imageAlt:
    "An Apple Watch emitting two diverging HRV waveforms from the same heartbeats — Recovery HRV (RMSSD) and Overall HRV (SDNN) on different scales, never merged.",
  imageTitle: "Two HRV numbers — Recovery HRV (RMSSD) vs Overall HRV (SDNN)",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'These are passive overnight metrics. Training your HRV in the moment is a different job entirely.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ SYSTEM UPDATE: TWO NUMBERS WHERE THERE WAS ONE ]

> "People opened the Health app in late September 2026 and found something new: their Apple Watch was suddenly reporting **two** heart-rate-variability numbers instead of one — 'Recovery HRV' and 'Overall HRV' — and they often didn't match.

> This wasn't a bug. With the Apple Watch Series 12 and Ultra 4, Apple quietly rebuilt how the watch measures HRV — and in the process it changed which *metric* it reports, how *often*, and what the number even means. If your HRV looks different, jumpier, or hard to compare to last month, here is exactly what happened."

---

## Section 1: What Apple actually changed

The Series 12 and Ultra 4, announced in September 2026, ship with a new **Health Sensing System** — new optical and electrical heart sensors — and three things changed at once (Apple Newsroom, September 2026):

1. **HRV is now sampled about every 5 minutes** — roughly 24× more often than before, where the watch captured HRV only about once every two hours (MacRumors; 9to5Mac, September 2026).
2. **HRV split into two metrics.** The watch now surfaces **Recovery HRV** and **Overall HRV** as separate readings.
3. **Overnight Vitals now analyses Recovery HRV against your personal baseline**, with a new toggle between overnight and daytime vitals.

More frequent sampling of a noisy signal is why the number can look jumpier than the once-every-two-hours figure you were used to.

---

## Section 2: Recovery HRV vs Overall HRV — the real difference

The two numbers answer different questions, and the split is not cosmetic (gadgetsandwearables, September 2026):

- **Recovery HRV** — aimed at *day-to-day* stress and recovery. It is the number to watch for "am I recovered today?" and it is the one analysed against your personal overnight baseline. Under the hood it is based on **RMSSD**.
- **Overall HRV** — a *broader* view of your HRV over longer windows, oriented toward general and cardiovascular-health context rather than daily readiness. This is the continuation of Apple's historical HRV metric, **SDNN**.

So the reason they don't match is simple: **they are different statistics of the same heartbeats.** Recovery HRV (RMSSD) reacts faster to short-term parasympathetic shifts; Overall HRV (SDNN) is a wider, slower measure. Neither is "wrong."

---

## Section 3: SDNN vs RMSSD — why this is a big deal

For years there was a quiet mismatch in the wearable world. Apple Watch stored HRV in [HealthKit](/articles/what-your-apple-watch-records) as **SDNN** — the standard deviation of the intervals between normal heartbeats. But the recovery scores from Whoop, Oura and Garmin are built primarily on **RMSSD** — the root-mean-square of successive differences, which tracks the parasympathetic (vagal) branch more directly.

That mismatch is exactly why an Apple Watch HRV of, say, 40 never lined up with a Whoop or Oura number — [different devices report different HRV](/articles/hrv-different-every-device) partly because they report *different metrics*.

In 2026 that changed. Alongside the Series 12, **HealthKit added \`heartRateVariabilityRMSSD\` as its own distinct type**, separate from the existing \`heartRateVariabilitySDNN\` — and the two are never aliased or substituted (Apple developer SDK; gadgetsandwearables, September 2026). For the first time, third-party apps can read a native RMSSD number from an Apple Watch, the same family of metric the dedicated recovery trackers use.

---

## Section 4: The trap — don't stitch the old and new history together

Here is the practical warning most people miss. Because Recovery HRV (RMSSD) and Overall HRV (SDNN) are **different metrics on different scales**, you cannot take your old SDNN history and simply continue it as RMSSD.

- Your RMSSD number will usually read **higher** than your SDNN number for the same night — it is a different calculation, not an improvement.
- A chart that splices SDNN months onto RMSSD months is a broken time series. Treat the two as separate lines.
- Give any new baseline time. A personal HRV baseline needs roughly a week to stabilise and closer to a month to become reliable, so the first few weeks after the switch will look unsettled by design.

If your "HRV" appears to have jumped in late September 2026, this is almost certainly why — the metric under the label changed, not your physiology.

---

## Section 5: What it means practically

- **For cross-checking Whoop/Oura/Garmin:** use **Recovery HRV (RMSSD)**, not Overall HRV. It is finally the same family of metric, so the numbers are more comparable — though device-to-device differences never fully vanish.
- **For long-term cardiovascular context:** Overall HRV (SDNN) is the continuity metric.
- **For daily readiness:** Recovery HRV against your personal baseline is the intended signal — read the *trend*, not a single morning number.

And the honest limit: all of this is still **passive measurement** — the watch reads your nervous system while you sleep. Reading a number, however often, is a different job from *training* the system that produces it. That live, in-the-moment part — following guided breathing while you watch your own heart rhythm respond — is [HRV biofeedback](/hrv-biofeedback), and it runs on the live heartbeat, not the overnight RMSSD/SDNN average. As the ONDA framing puts it: most tools score you *after*; the point of biofeedback is what you can see *during*.

> **The Hack:** After updating, treat your Apple Watch HRV as a fresh start. Track **Recovery HRV (RMSSD)** for daily recovery and comparison with other trackers, keep **Overall HRV (SDNN)** as the long-run line, and don't compare the two to each other — or splice their histories.

> [ METRIC_MAP ]
> RECOVERY_HRV = RMSSD → daily recovery, vs personal baseline, ~5-min sampling
> OVERALL_HRV = SDNN → broader / cardiovascular, historical continuity
> RULE: separate metrics, separate scales — never merge the two histories
`,
  howToSteps: [
    {
      name: 'Use Recovery HRV to compare with Whoop, Oura or Garmin',
      text: 'Recovery HRV is based on RMSSD — the same metric family those recovery trackers use — so it is the number to cross-check against them. Overall HRV (SDNN) is not comparable to them.',
      protocolId: 'awhrv-recovery',
    },
    {
      name: 'Keep Overall HRV as your long-term line',
      text: 'Overall HRV (SDNN) is the continuation of Apple’s historical metric and suits broader, cardiovascular-health context. Do not judge daily readiness from it.',
      protocolId: 'awhrv-overall',
    },
    {
      name: 'Never merge the two histories',
      text: 'Recovery HRV (RMSSD) and Overall HRV (SDNN) are different statistics on different scales — RMSSD usually reads higher. Splicing old SDNN data onto new RMSSD data creates a broken time series.',
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
