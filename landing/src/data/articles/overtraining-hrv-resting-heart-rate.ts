import type { Article } from './types'

/**
 * Overtraining / under-recovery → resting HR up + HRV (RMSSD) down = fatigue; growth needs
 * hard training FOLLOWED by recovery. Ties to ONDA's real athlete-relevant reads: resting HR,
 * HRV, 1-min recovery, VO2max (est.). Grounded: RMSSD drop with functional overreaching;
 * combined RHR+HRV to distinguish overtraining from recovery. Firewall: descriptive, not medical.
 */
const article: Article = {
  slug: 'overtraining-hrv-resting-heart-rate',
  title: 'Overtraining Has a Number: When Your Recovery Signals Turn',
  seoTitle: 'Overtraining, Resting Heart Rate & HRV Recovery | ONDA Life',
  description:
    'More training isn’t more progress — recovery decides. When load outruns recovery, resting heart rate creeps up and HRV drops. Why the fitness gain lives in the rest, and how to read the turn before it costs you.',
  category: 'ONDA Protocol',
  relatedSlugs: ['heart-rate-variability', 'zone-2-training-aerobic-base', 'vo2max-increase-aerobic-engine', 'apple-watch-recovery-hrv-vs-overall-hrv', 'what-your-apple-watch-records'],
  introStyle: 'cyan',
  neuralSuggestion: {
    text: 'Training is the stimulus. Recovery is where the adaptation actually happens — if you let it.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: MORE IS NOT THE ANSWER ]

> "You trained harder this block than last. You got slower. The numbers know why.

> The oldest mistake in training is treating the workout as the thing that makes you fitter. It isn't. The workout is the *stimulus* — a controlled dose of damage. The adaptation, the actual fitness, is built afterward, during recovery. Skip the recovery and you keep paying for stimulus you can't cash in. Do it long enough and your own physiology starts filing complaints."

---

## Section 1: Fitness is built in the rest, not the rep

Hard training works by overload: you stress a system past its comfort, and it rebuilds a little stronger. But *only if rebuilding is allowed to happen.* Adaptation requires the recovery phase — that's not a slogan, it's the mechanism. Load without adequate recovery isn't extra training; it's accumulated fatigue with no payoff, and past a point, a performance *decline*.

This is why "more" is the wrong dial past a certain volume. The athletes who improve aren't the ones who train the most — they're the ones who match hard work to real recovery, block after block.

---

## Section 2: The autonomic turn — RHR up, HRV down

When load outruns recovery, the autonomic nervous system tells on you before your performance fully collapses. Two signals move together:

- **Resting heart rate creeps up.** An elevated morning pulse against your baseline is a classic marker of accumulated fatigue or an incomplete recovery — the body idling higher because it never fully stood down.
- **HRV drops.** Reduced resting [variability](/glossary/heart-rate-variability) (RMSSD) is repeatedly associated with fatigue, overreaching and blunted performance. As training exceeds your adaptive capacity, variability falls and its night-to-night stability degrades.

Neither number alone is decisive — HRV is influenced by heart rate itself, so they're best read *together*. The combination of a rising resting heart rate and a falling HRV is the pattern researchers use to separate genuine overreaching from a body that's recovering on schedule.

---

## Section 3: One-minute recovery and the aerobic ceiling

Two more of your own numbers sharpen the picture. **Heart-rate recovery** — how fast your pulse drops in the minute after effort — reflects parasympathetic reactivation; a recovery that's slowing over weeks is a fatigue flag. And **VO₂max**, your estimated aerobic ceiling, is the slow-moving scoreboard: it should trend up or hold across a well-managed block, and stall or slide when you're digging a hole. Together with resting heart rate and HRV, they turn "I feel flat" into something you can actually see.

---

## Section 4: Reading the turn before it costs you

The whole point of monitoring is to catch the turn early — while it's a deload decision, not an injury. With a **personal baseline**, an elevated resting pulse and a suppressed [HRV](/glossary/heart-rate-variability) that persist for several days read as a clear departure from your corridor: the signal to insert recovery *now*. ONDA reads resting heart rate, HRV, one-minute recovery and estimated VO₂max from an Apple Watch and holds them against your own normal, so overtraining stops being a feeling you argue with and becomes a pattern you can act on — [your data, your deload](/measurements).

Firewall, plainly: these are descriptive training signals, not medical readings. Persistent fatigue, a resting heart rate that stays high, or performance that keeps sliding despite rest deserve a coach and, if health is in question, a doctor — not just an app.

---

## Section 5: Training the recovery, not just the work

Program recovery as deliberately as you program load. Follow hard blocks with easier ones, protect sleep as your primary adaptation tool, and use your down-signals to trigger a deload before your body forces one. On rest days, gentle [exhale-led breathing](/articles/coherent-breathing-guide) supports the parasympathetic reactivation that recovery depends on. Build your aerobic base sustainably with [zone-2 training](/articles/zone-2-training-aerobic-base), and understand the ceiling you're raising in [the VO₂max engine](/articles/vo2max-increase-aerobic-engine).

> **The Hack:** Let your baseline call the deload. When your resting heart rate sits elevated and your HRV stays suppressed for several days running, that's not weakness to push through — it's your recovery account overdrawn. Rest *then*, and the next block is the one that actually makes you faster.

> [ SYSTEM_STATUS ]
> PRINCIPLE: adaptation happens in recovery, not the workout
> SIGNAL: resting HR ↑ + HRV ↓ (read together) = under-recovered
> EXTRAS: slowing 1-min recovery · stalling VO₂max
> ACTION: deload on the signal — DESCRIPTIVE, NOT MEDICAL
`,
  howToSteps: [
    {
      name: 'Treat recovery as the training',
      text: 'The workout is the stimulus; the adaptation is built during recovery. Program easy blocks, sleep and rest days as deliberately as you program hard sessions — that’s where fitness is made.',
      protocolId: 'ot-recovery-first',
    },
    {
      name: 'Read resting HR and HRV together',
      text: 'A rising resting heart rate paired with a falling HRV against your baseline is the signature of load outrunning recovery. Neither number alone is decisive; the combination is.',
      protocolId: 'ot-rhr-hrv',
    },
    {
      name: 'Watch recovery speed and VO₂max',
      text: 'A one-minute heart-rate recovery that’s slowing, or an estimated VO₂max that stalls or slides, sharpens the picture. Together with resting HR and HRV they turn “feeling flat” into a readable pattern.',
      protocolId: 'ot-recovery-vo2',
    },
    {
      name: 'Deload on the signal',
      text: 'When your down-signals persist for several days, insert recovery before your body forces it with injury or illness. Persistent fatigue despite rest belongs with a coach or clinician.',
      protocolId: 'ot-deload',
    },
  ],
}

export default [article]
