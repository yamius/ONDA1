import type { Article } from './types'

/**
 * Flagship "honest anomaly" article. Maps ONDA's real feature — deviation from a
 * personal statistical corridor (mean ± SD over 90 days, resting HR / HRV / respiratory
 * rate) — to the well-documented finding that these signals drift from an individual's
 * baseline 1-3 days before conscious symptoms. HONEST FIREWALL: not illness prediction,
 * not a diagnosis, no disease named. ONDA describes deviation from YOUR normal, nothing more.
 * Grounded: pre-symptomatic wearable studies (Mishra/Snyder 2020; Alavi 2022 real-time alerting).
 */
const article: Article = {
  slug: 'your-baseline-knows-first',
  title: 'Your Baseline Knows First: The Signal Your Body Sends Before You Notice',
  seoTitle: 'Your Body Knows Before You Do: Baseline Deviation | ONDA Life',
  description:
    'Your resting heart rate, HRV and breathing drift from your personal normal before you consciously feel “off.” Why the deviation — not the number — is the signal, and how a personal baseline makes it visible without any medical claim.',
  category: 'Biological Software',
  relatedSlugs: ['heart-rate-variability', 'what-your-apple-watch-records', 'apple-watch-recovery-hrv-vs-overall-hrv', 'vagus-nerve', 'coherent-breathing-guide'],
  introStyle: 'indigo',
  image: '/images/articles/your-baseline-knows-first.webp',
  imageAlt:
    'Translucent glowing human torso showing resting heart rate, HRV and breathing rate as a personal baseline corridor, with one signal drifting out of range.',
  imageTitle: 'Your personal baseline corridor — and the early drift out of it',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'A baseline is only useful if something reads it back to you. That’s the whole job of the signal.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE EARLY SIGNAL ]

> "You wake up, you feel fine, you get on with the day. But your body has been keeping notes you never read — and sometimes those notes changed days ago.

> The strange, well-documented truth of continuous physiology is this: your resting rhythm often drifts *before* you consciously feel anything. Not because a device is psychic. Because your autonomic nervous system reacts to load — a hard week, a short night, a coming cold — earlier and more honestly than your self-report does."

---

## Section 1: The number lies. The deviation doesn't.

Here is the single most misunderstood idea in wearable health: **a value on its own means almost nothing. The deviation from *your* normal means almost everything.**

A resting heart rate of 72 is unremarkable — unless yours normally sits at 58. Then 72 is a fourteen-beat shout. The same logic runs through [heart-rate variability](/glossary/heart-rate-variability) and breathing rate: there is no universal "good" number, only your own corridor and how far today has stepped outside it.

Every serious study of pre-symptomatic physiology lands on the same sentence. It is not the reading that carries the information; it is the departure from the personal baseline. Which is exactly why a device that only shows you today's number — with no memory of your normal — is showing you noise.

---

## Section 2: What "your body knows first" actually means

When your system takes on load — physical, viral, circadian, emotional — the autonomic response often shows up in the measurable layer before it reaches the felt layer. Researchers watching continuous wearable data have repeatedly seen resting heart rate and breathing rate move away from an individual's baseline **one to three days before** that person reported feeling unwell (Mishra 2020; Alavi 2022). The device wasn't diagnosing anything. It was noticing a shift in the person's own corridor that the person hadn't consciously registered yet.

That is the honest version of "your body knows before you do." Not prophecy. Not a diagnosis. Just a lag — between the moment your physiology changes and the moment *you* notice — and a personal baseline that can see into that gap.

---

## Section 3: Why you can't feel it yourself

Interoception — your sense of your own internal state — is famously coarse. You feel hunger, pain, a pounding heart. You do not feel a five-beat rise in resting pulse, a fifteen-percent dip in variability, or a breathing rate creeping up by two a minute overnight. Those are exactly the signals that move first, and exactly the ones below the threshold of conscious sensation.

This is not a flaw you can train away with willpower. It is the resolution limit of self-report. The only way to close the gap is to move the measurement outside your own perception — to let something with a longer, steadier memory hold your baseline and tell you when you've left it.

---

## Section 4: How ONDA turns a corridor into a signal — honestly

ONDA builds a **personal corridor**, not a population chart. Over a rolling window it learns your own resting heart rate, your own variability, your own breathing rate, and the normal spread around each. Then it watches for a departure that is both statistically real *and* meaningful — a move outside roughly 1.5 standard deviations, past a per-metric floor, held for more than one night — before it says a word. It is pure statistics: [your data, against your normal](/measurements), never a generic threshold.

And here is the firewall, stated plainly. **ONDA does not diagnose anything.** It does not name a condition, predict an illness, or tell you to "seek treatment." It says one honest thing: *your rhythm has moved away from your own baseline, and it's been there a while.* What that means — a hard training block, a bad stretch of sleep, stress, a bug coming on, nothing at all — is yours and your doctor's to interpret. The signal is descriptive. It points at your own data; it never dresses up as medicine.

That restraint is the point. A tool that shouted "illness detected" would be both dishonest and against the rules that keep it on your phone. A tool that says "you've drifted from your normal — here's the data, and here's a two-minute practice to down-shift" is telling you only what it actually knows.

---

## Section 5: What to do with an early signal

An early signal is an invitation to pay attention, not to panic. When your corridor flags a drift, the useful responses are boring and real: protect your sleep, ease off the training load, hydrate, and give your nervous system a deliberate parasympathetic nudge. Slow, [exhale-led breathing](/articles/coherent-breathing-guide) raises [vagal](/glossary/vagus-nerve) tone within minutes and is the lowest-risk lever you have — see the live version in [HRV biofeedback](/hrv-biofeedback).

And if a drift is large, persistent, or paired with symptoms that worry you, the move is a clinician, not an app. ONDA is not a medical device; the baseline is a mirror, not a diagnosis.

> **The Hack:** Stop reading single numbers. Watch the *distance from your own baseline* instead — a five-beat rise in resting pulse or a sustained dip in variability is your body's earliest, most honest note. Let something hold your corridor for you, because the one system you can't perceive from the inside is the one keeping the tab.

> [ SYSTEM_STATUS ]
> SIGNAL: deviation from personal corridor (not the raw value)
> LEAD_TIME: physiology shifts before conscious symptoms
> PERCEPTION: interoception too coarse to feel it
> ONDA_ROLE: describe the drift, name nothing — PRACTICE, NOT DIAGNOSIS
`,
  howToSteps: [
    {
      name: 'Track distance from baseline, not raw numbers',
      text: 'A reading only means something relative to your own normal. Watch how far today sits from your personal corridor of resting heart rate, HRV and breathing rate — the deviation carries the signal.',
      protocolId: 'baseline-deviation',
    },
    {
      name: 'Let a longer memory hold your corridor',
      text: 'You cannot feel a five-beat rise in resting pulse or a small dip in variability. Move the measurement outside your perception so a steady baseline can flag the drift you cannot sense.',
      protocolId: 'baseline-memory',
    },
    {
      name: 'Respond boringly and early',
      text: 'When your baseline drifts, protect sleep, ease training load, hydrate, and down-shift with slow exhale-led breathing to raise vagal tone. Small, early responses beat dramatic late ones.',
      protocolId: 'baseline-respond',
    },
    {
      name: 'Escalate real concern to a clinician',
      text: 'A large or persistent drift, or anything paired with symptoms that worry you, belongs with a doctor. A personal baseline is descriptive — a mirror, never a diagnosis.',
      protocolId: 'baseline-escalate',
    },
  ],
}

export default [article]
