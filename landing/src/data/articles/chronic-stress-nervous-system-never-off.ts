import type { Article } from './types'

/**
 * Chronic stress suppresses HRV across the day, leisure AND sleep — the "no off-switch" lens.
 * Distinct from how-to-lower-cortisol (cortisol + detox myth): here the frame is HRV that stays
 * low into the evening/sleep, and the measurable rebound from a breathing reset. Grounded:
 * effort-reward/job-strain lowers HRV at work, leisure and sleep; nurses study (Jarczok) prolonged
 * stress → reduced HF/LF with no recovery in rest periods. Honest firewall: practice, not treatment.
 */
const article: Article = {
  slug: 'chronic-stress-nervous-system-never-off',
  title: 'The Nervous System That Never Clocks Out',
  seoTitle: 'Chronic Stress & Low HRV: The Missing Off-Switch | ONDA Life',
  description:
    'Chronic stress doesn’t stop when the workday does — it holds your HRV low through the evening and into sleep, so recovery never fully starts. Why the real question is whether your body ever switches off, and how to see it.',
  category: 'OS States',
  relatedSlugs: ['heart-rate-variability', 'cortisol', 'how-to-lower-cortisol', 'vagus-nerve', 'coherent-breathing-guide'],
  introStyle: 'slate',
  neuralSuggestion: {
    text: 'The question isn’t how stressed you were today. It’s whether your body ever came back down.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: THE SHIFT THAT NEVER ENDS ]

> "You closed the laptop. You told yourself the day was over. Your nervous system didn't get the memo.

> Acute stress is normal and healthy — a spike, then a return to baseline. The problem isn't the spike. It's the *return* that stops happening. In chronic stress the system forgets how to come down, and the tell isn't how high you go under pressure. It's that you never fully land afterward — not in the evening, not even in sleep."

---

## Section 1: Stress is supposed to be a spike, not a plateau

The stress response is a loop with an off-switch. A threat arrives, the [sympathetic](/glossary/sympathetic-nervous-system) branch fires, [cortisol](/glossary/cortisol) and heart rate climb, and then — when the threat passes — the [parasympathetic](/glossary/parasympathetic-nervous-system) branch brings you back down and [variability](/glossary/heart-rate-variability) returns. That recovery *is* health. A body that spikes and recovers cleanly is doing exactly what it should.

Chronic stress breaks the off-switch. The plateau replaces the spike. And because the elevated state becomes your new normal, you stop noticing it — the frog-in-warming-water problem of the autonomic nervous system.

---

## Section 2: The tell is HRV that stays down — into sleep

This is where the data is unambiguous. Studies of high-strain work — high effort, low reward — find **lower HRV not just during work, but through leisure and sleep, on work days and weekends alike.** A study of nurses under prolonged occupational stress found reduced high-frequency and low-frequency HRV power during work *and a lack of recovery in the non-working, resting periods.* The parasympathetic brake stayed off the clock.

That's the signature that matters. Anyone's HRV drops under an acute stressor — that's normal. The chronic-stress fingerprint is **HRV that fails to rebound when the stressor is gone**: a flat evening, a shallow night, a baseline that has quietly settled lower and stopped coming back up.

---

## Section 3: Why you can't feel it

You'd think chronic sympathetic tone would be obvious. It isn't — because it's your reference point now. Interoception recalibrates to the plateau; "wired but tired," "can't switch off," "fine, just busy" all describe a nervous system stuck in mild activation that no longer registers as unusual. The felt sense adapts. The measured signal doesn't — which is exactly why it's worth measuring.

---

## Section 4: Making the off-switch visible

The useful reframe: don't ask *how stressed was I today* — ask *did my body ever come back down.* That's a question your own [HRV](/glossary/heart-rate-variability) corridor can answer. An evening and overnight variability that sits below your normal, night after night, is the plateau showing itself. A baseline that's drifted lower over weeks is the off-switch quietly failing.

ONDA holds that corridor — your resting heart rate, variability and breathing against your own normal — so a nervous system that never clocks out becomes something you can actually see rather than a vague sense of depletion. And it shows the *rebound*, too: because slow, paced breathing acutely raises vagal tone and HRV within minutes, you can watch the brake re-engage in real time in [HRV biofeedback](/hrv-biofeedback) — proof the off-switch still works, even when it feels stuck.

The firewall, plainly: this is a **self-regulation practice, not a treatment**. Breathing tools and better recovery habits sit alongside real rest, boundaries, and — when stress is running your life — professional care. ONDA is not a medical device and does not diagnose anything.

---

## Section 5: Rebuilding the return

You rebuild the off-switch by practicing the descent, deliberately, until it's automatic again. A short daily [exhale-led breathing](/articles/coherent-breathing-guide) session trains the parasympathetic return. Hard boundaries around work's end, real disengagement in the evening, and protected sleep give the rebound somewhere to happen. For the hormonal half of the same picture — and why "detox" isn't the answer — see [how to lower cortisol](/articles/how-to-lower-cortisol).

> **The Hack:** Judge your stress by the *recovery*, not the peak. If your evening and overnight HRV never climb back into your baseline, your off-switch is the thing to train — a couple of minutes of slow, longer-exhale breathing a day teaches the nervous system how to land again.

> [ SYSTEM_STATUS ]
> HEALTHY: stress spikes, then HRV recovers
> CHRONIC: HRV stays low through leisure and sleep — no rebound
> PERCEPTION: plateau becomes the new normal, felt as "fine"
> TRAIN: practice the descent — PRACTICE, NOT TREATMENT
`,
  howToSteps: [
    {
      name: 'Judge recovery, not the peak',
      text: 'Everyone’s HRV drops under acute stress — that’s normal. The signal that matters is whether it rebounds. Watch whether your evening and overnight variability return to your baseline.',
      protocolId: 'stress-recovery-lens',
    },
    {
      name: 'Look for the plateau in your own corridor',
      text: 'HRV that sits below your normal night after night, or a baseline that has drifted lower over weeks, is the off-switch failing. It’s below conscious perception, so it needs measuring.',
      protocolId: 'stress-plateau',
    },
    {
      name: 'Train the descent daily',
      text: 'A few minutes of slow, exhale-led breathing acutely raises vagal tone and HRV, re-teaching the parasympathetic return. Done daily, it makes the off-switch automatic again.',
      protocolId: 'stress-descent',
    },
    {
      name: 'Protect the rebound',
      text: 'Hard boundaries at the end of work, real evening disengagement and protected sleep give recovery somewhere to happen. When stress is running your life, add professional care — the practice sits alongside it, not instead.',
      protocolId: 'stress-boundaries',
    },
  ],
}

export default [article]
