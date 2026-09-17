import type { Article } from './types'

/**
 * Tier-1 "condition & the autonomic nervous system" investigation.
 * Targets long-covid / dysautonomia / POTS + "breathing exercises for
 * dysautonomia / HRV" intent. Honest firewall: ONDA measures & trains the
 * autonomic/HRV dimension; it does NOT diagnose or treat dysautonomia.
 * Grounded in real literature (HEARTLOC HRV-biofeedback feasibility study;
 * Zaccaro 2018; Lehrer & Gevirtz 2014). Funnels to /hrv-biofeedback.
 */
const article: Article = {
  slug: 'dysautonomia-long-covid-breathing',
  title: 'The Autonomic Glitch: What Long Covid Taught Us About HRV and Breathing',
  seoTitle: 'Long Covid, Dysautonomia & HRV Breathing | ONDA Life',
  description:
    'A short investigation into dysautonomia — the nervous-system dysregulation behind much of long Covid and POTS — why it shows up as low HRV, and what the breathing-biofeedback studies actually found.',
  category: 'OS States',
  relatedSlugs: ['heart-rate-variability', 'autonomic-nervous-system', 'vagus-nerve', 'hrv-training-nervous-system-latency', 'coherent-breathing-guide'],
  introStyle: 'indigo',
  neuralSuggestion: {
    text: 'Dysautonomia is a dysregulation of the same system slow breathing trains. See the loop for yourself.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: THE INVISIBLE DYSREGULATION ]

> "The patients kept describing the same impossible pattern. Heart racing when they stood up. Exhausted after a short walk. Brain fog, palpitations, breathlessness — all with 'normal' blood tests. For a while the medical system had no name to offer them.

> Then the same phrase started surfacing in paper after paper: **autonomic dysfunction**. The problem wasn't in any one organ. It was in the control layer that coordinates all of them — and it happened to be the exact system you can read from a heartbeat."

---

## Section 1: The system that runs in the background

Your [autonomic nervous system](/glossary/autonomic-nervous-system) (ANS) is the biocomputer's background process. You never consciously run it, yet it sets your heart rate, dilates your pupils, moves blood to your legs when you stand, and switches you between "fight-or-flight" (sympathetic) and "rest-and-digest" (parasympathetic).

**Dysautonomia** is what happens when that background process starts mis-scheduling — firing sympathetic when it should be calm, failing to compensate when you stand. Postural orthostatic tachycardia syndrome (POTS) — a racing heart on standing — is one well-known form.

It was largely a niche diagnosis until a wave of post-viral illness put it on the map. Reviews of long Covid found that a large share of the lingering symptoms — palpitations, dizziness, fatigue, breathlessness — map cleanly onto autonomic dysfunction, with prevalence estimates ranging widely but landing well above pre-pandemic baselines (Sivan 2022).

---

## Section 2: Why it shows up as low HRV

Here's the detail that makes this trackable. The single best window into autonomic balance is [heart-rate variability](/glossary/heart-rate-variability) — the beat-to-beat variation in your pulse. A relaxed, parasympathetically-toned system produces *irregular*, adaptive spacing between beats (high HRV). A system stuck in sympathetic overdrive produces metronomic, rigid beats (low HRV).

Dysautonomia, almost by definition, tends to drag HRV down and keep it there. That is why post-viral autonomic studies lean so heavily on HRV as a marker — it is a non-invasive readout of the exact system that's misbehaving (Shaffer & Ginsberg 2017).

The uncomfortable irony: getting a low recovery score every morning is *itself* a stressor, which nudges the sympathetic branch further and can push the number lower still. Measurement without a lever becomes part of the loop.

---

## Section 3: The clue in the breathing studies

If the problem is a control system tilted toward sympathetic, the interesting question is whether you can nudge it back — voluntarily. There is exactly one autonomic function you can drive on demand: **breathing**.

Slow, paced breathing at roughly six breaths per minute is one of the most evidence-grounded ways to shift autonomic balance toward the parasympathetic branch and raise HRV in the moment (Zaccaro 2018; Lehrer & Gevirtz 2014). When you pace the breath at that "resonance" frequency, the heart-rate rhythm and the breath lock into phase and HRV amplitude climbs — the [baroreflex](/articles/baroreflex-01hz-shift) that regulates blood pressure gets exercised like a muscle.

Researchers took the obvious next step and tested it in the hardest population. A feasibility study of home-based HRV-biofeedback breathing in long-Covid patients — diaphragmatic breathing guided by an HRV app — reported that the intervention was practical to run at home and showed a signal of benefit on dysautonomia-related symptoms (Corrado 2024). It was small and preliminary, not a cure. But it pointed the way: train the autonomic system through the one input it can't ignore.

---

## Section 4: What you can actually see

This is where a tool like ONDA fits — and where honesty matters. ONDA is an [HRV biofeedback](/hrv-biofeedback) and guided-breathing app. It reads your heartbeat from the phone camera or an Apple Watch, paces you at your resonance rate, and shows your own heart rhythm organising in real time as a live coherence score. Exactly [what it measures](/measurements) is spelled out, and [how it works](/how-it-works) too.

What that does, honestly, is let you *see and train the autonomic dimension* — the same HRV/parasympathetic axis the studies above track. What it does **not** do is diagnose or treat dysautonomia, POTS, or long Covid. It is a self-regulation trainer, not a medical device.

---

## Section 5: The careful part

Dysautonomia deserves respect, not hacks. Two honest cautions:

- **Get the diagnosis from a clinician.** Racing heart, fainting and breathlessness need a real work-up. A breathing app is not that.
- **In POTS and post-viral illness, more is not better.** Standard "just take a big deep breath" advice can actually trigger a flare if pushed. The research protocols use *gentle*, comfortable, paced breathing — never forced or heroic. If a session makes you feel worse, stop, and work with a clinician who understands autonomic conditions.

Used within those limits, slow paced breathing is a low-risk practice with a real acute effect on the system in question — and, unusually, one you can watch happen.

> **The Hack:** If your resting HRV lives in the basement and you feel "wired but tired," don't just keep logging it. Spend five minutes a day breathing at your resonance pace with live feedback, and judge progress by your own multi-week trend — not any single morning score.

> [ SYSTEM_STATUS ]
> LAYER: autonomic nervous system (background process)
> FAULT: sympathetic-dominant dysregulation → low HRV
> INPUT_YOU_CONTROL: paced breathing → parasympathetic engagement
> STATUS: TRAINABLE, NOT A CURE
`,
  howToSteps: [
    {
      name: 'Rule out the medical layer first',
      text: 'Racing heart on standing, fainting or breathlessness need a clinical work-up. Use breathing practice alongside proper care for dysautonomia or POTS — never instead of it.',
      protocolId: 'dys-clinical-first',
    },
    {
      name: 'Breathe gently at your resonance pace',
      text: 'Pace the breath at roughly six breaths per minute (about 5.5 seconds in, 5.5 out) — comfortable and unforced. In POTS and post-viral illness, gentle beats deep; if a session worsens symptoms, stop.',
      protocolId: 'dys-resonance',
    },
    {
      name: 'Close the loop with live HRV feedback',
      text: 'Use HRV biofeedback so you can watch your heart rhythm organise in real time, rather than breathing blind — the live signal is what turns breathing into training.',
      protocolId: 'dys-biofeedback',
    },
    {
      name: 'Judge by the trend, not the day',
      text: 'Track whether your own resting-HRV trend rises over weeks. Autonomic retraining is slow; a single daily score tells you little and can become a stressor of its own.',
      protocolId: 'dys-trend',
    },
  ],
}

export default [article]
