import type { Article } from './types'

/**
 * Respiratory rate = one of ONDA's 3 baseline range-signals (resting HR / HRV / respiratory rate),
 * yet almost nobody looks at it. Stable personal metric that rises with stress, illness, alcohol,
 * overtraining before you feel it. Firewall: descriptive, not diagnosis. Funnels to /measurements +
 * your-baseline-knows-first. Grounded: normal resting 12-20/min; RR as an early, sensitive vital.
 */
const article: Article = {
  slug: 'respiratory-rate-hidden-signal',
  title: 'Your Respiratory Rate: The Overnight Number You Never Look At',
  seoTitle: 'Respiratory Rate: The Hidden Overnight Signal | ONDA Life',
  description:
    'Your breathing rate is one of the most stable, sensitive vitals you own — and the one you never check. Why a resting respiratory rate that drifts from your baseline is an early, honest signal, and how to read it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['your-baseline-knows-first', 'heart-rate-variability', 'what-your-apple-watch-records', 'co2-tolerance-expanding-oxygen-limit', 'coherent-breathing-guide'],
  introStyle: 'cyan',
  neuralSuggestion: {
    text: 'Three signals sit in your baseline. Two get all the attention. This is the quiet one that often moves first.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE QUIET VITAL ]

> "You know your resting heart rate. You've heard of HRV. But ask most people their normal breathing rate and you'll get a blank look — even though they've been running it their whole life, every few seconds, without a break.

> Respiratory rate is the forgotten vital. It's slow to change, tightly personal, and unusually honest — which makes it one of the best early signals your body has, and the one almost nobody reads."

---

## Section 1: The most personal number you don't know

At rest, a typical adult breathes somewhere between about **12 and 20 times a minute** — but the population range isn't the point. Your own resting rate is remarkably stable: night after night, it settles into a narrow personal band. That stability is exactly what makes a *departure* meaningful. When your normal is 14 and you're suddenly running 17 overnight, that's not noise — it's a three-breath shift in one of your steadiest signals.

Like resting heart rate and [HRV](/glossary/heart-rate-variability), respiratory rate carries information only relative to your own baseline. There is no universal "good" number — only your corridor and how far tonight has stepped outside it.

---

## Section 2: What makes it drift

Respiratory rate is wired straight into your autonomic state, so it moves with the things that load your system:

- **Stress and arousal** push it up — [sympathetic](/glossary/sympathetic-nervous-system) tone quickens the breath, often before you consciously feel tense.
- **A coming illness** frequently nudges resting breathing rate upward as the body mounts a response — one of the earliest, most sensitive shifts, before symptoms arrive.
- **Alcohol** in the evening keeps the overnight rate elevated along with heart rate, part of the night your body never fully rests.
- **Overtraining and under-recovery** can lift it as accumulated fatigue keeps the system idling higher.

None of these is a diagnosis. They're loads, and your breathing rate is one of the first places they register.

---

## Section 3: Why it often moves first

Breathing sits at the crossroads of the voluntary and the automatic — you can override it, but left alone it's governed by brainstem circuits tracking CO₂, effort and threat. That tight autonomic coupling means it responds quickly and sensitively to internal change. In continuous-monitoring research, resting respiratory rate is repeatedly one of the signals that shifts *before* a person notices anything is off — a quiet early mover, precisely because it's so tightly regulated and so far below conscious attention.

You will not feel your breathing rate rise by two overnight. That's the whole reason it's worth measuring instead of sensing.

---

## Section 4: How ONDA reads it — honestly

Respiratory rate is one of the three signals in ONDA's **personal baseline**, alongside resting heart rate and [HRV](/glossary/heart-rate-variability). ONDA learns your normal band and the spread around it, then treats a sustained departure — held across nights, past a meaningful floor — as a signal worth surfacing, not a single reading to react to. During a live practice it also shows your breathing rate directly, even from the phone camera, so you can watch it settle in real time. It's all [your data against your own normal](/measurements).

The firewall, plainly: an elevated respiratory rate is **descriptive, not diagnostic**. ONDA does not name a condition or predict illness — it tells you your breathing has drifted from your baseline and stayed there. What that means is yours, and your clinician's, to interpret. A resting rate that stays high, or one paired with breathlessness or symptoms that worry you, is a reason to see a doctor, not to open an app.

---

## Section 5: The one you can also steer

Here's what makes respiratory rate unique among your vitals: it's the only one you can *directly* move. You can't will your heart rate down, but you can slow your breath — and when you do, the rest of the system follows. Slow, [exhale-led breathing](/articles/coherent-breathing-guide) drops the rate on purpose, raises vagal tone, and pulls the whole autonomic state toward calm. For the deeper mechanics of breathing tolerance and CO₂, see [CO₂ tolerance](/articles/co2-tolerance-expanding-oxygen-limit); for why a drifting baseline is worth watching at all, see [your baseline knows first](/articles/your-baseline-knows-first).

> **The Hack:** Learn your normal resting respiratory rate the way you know your resting pulse. It's one of your steadiest signals, so a two-or-three-breath rise that holds overnight is an early, honest flag — and it's the one vital you can also reach in and steer, one slow breath at a time.

> [ SYSTEM_STATUS ]
> METRIC: resting respiratory rate — stable, personal, ~12-20/min
> DRIVERS: stress · coming illness · alcohol · under-recovery
> PROPERTY: sensitive early mover, below conscious attention
> DUAL_USE: read it AND steer it — DESCRIPTIVE, NOT DIAGNOSIS
`,
  howToSteps: [
    {
      name: 'Learn your normal band',
      text: 'Resting respiratory rate is highly personal and stable. Get to know your own overnight band the way you know your resting pulse — the value matters only relative to your baseline.',
      protocolId: 'rr-baseline',
    },
    {
      name: 'Watch for a sustained drift',
      text: 'A two-or-three-breath rise that holds across nights is a meaningful departure in one of your steadiest signals. Look for the sustained shift, not a single reading.',
      protocolId: 'rr-drift',
    },
    {
      name: 'Read it as a load signal, not a diagnosis',
      text: 'Stress, a coming illness, alcohol and under-recovery all lift resting breathing rate. It’s descriptive — a drift from your normal — never a diagnosis. Persistent elevation or symptoms belong with a doctor.',
      protocolId: 'rr-load',
    },
    {
      name: 'Use the one vital you can steer',
      text: 'Unlike heart rate, you can move breathing directly. Slow, exhale-led breathing lowers the rate on purpose, raises vagal tone and pulls the whole autonomic state toward calm.',
      protocolId: 'rr-steer',
    },
  ],
}

export default [article]
