import type { Article } from './types'

/**
 * Tier-1 "condition & the autonomic nervous system" investigation.
 * Targets anxiety / panic-attack / "breathing exercise for anxiety /
 * calm nervous system" intent. Honest firewall: ONDA trains the autonomic
 * self-regulation dimension; it is NOT a treatment for anxiety disorders.
 * Grounded in real literature (Goessl 2017 meta-analysis; Balban 2023 cyclic
 * sighing; Zaccaro 2018; Lehrer & Gevirtz 2014). Funnels to /hrv-biofeedback.
 */
const article: Article = {
  slug: 'anxiety-panic-breathing-hrv',
  title: 'The False Alarm: How a Panic Attack Hijacks the Breath — and How the Breath Takes It Back',
  seoTitle: 'Anxiety, Panic Attacks & HRV Breathing | ONDA Life',
  description:
    'A short investigation into the physiology of anxiety and panic — the runaway feedback loop between breath, heart and threat-detection — and why slow, exhale-led breathing is one of the few levers you can pull mid-spiral.',
  category: 'OS States',
  relatedSlugs: ['heart-rate-variability', 'parasympathetic-nervous-system', 'vagus-nerve', 'box-breathing-how-it-works', 'coherent-breathing-guide'],
  introStyle: 'rose',
  neuralSuggestion: {
    text: 'The breath is the one manual override on the panic loop. A live feedback loop shows it working.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: THE RUNAWAY LOOP ]

> "It starts as a flicker — a tight chest, a skipped breath, a thought. Within seconds the heart is pounding, the hands tingle, the breathing goes shallow and fast, and the brain, reading all of that, concludes something is very wrong. Which makes the heart pound harder.

> A panic attack isn't weakness or imagination. It's a **feedback loop that has slipped its leash** — a threat-detection system reacting to its own alarm. And the fastest way into the loop, it turns out, is also the only reliable way out of it."

---

## Section 1: The alarm that fires with no fire

At the base of the brain sits a fast, dumb, brilliant threat detector — it scans for danger in the background and, when tripped, floods the body with a sympathetic surge before your conscious mind gets a vote. Heart rate up, breathing up, blood to the muscles. Perfect if there's a bear.

In anxiety and panic, the detector fires at shadows: a crowded train, an email, a bodily sensation. The hardware is working; the *threshold* is miscalibrated. And because the system is a loop — body signals feed the brain's threat estimate — a small spike can bootstrap itself into a full attack in under a minute.

---

## Section 2: Why breathing is the weak point in the loop

Almost every node in that loop is involuntary. You cannot consciously lower your heart rate, cancel adrenaline, or talk your amygdala down mid-surge. But one node is different.

Breathing is the only autonomic function with a manual override — and it back-propagates to the rest of the system. Fast, shallow chest-breathing (hyperventilation) is both a *symptom* of panic and an *accelerant*: it drops CO₂, which produces the tingling, light-headedness and air-hunger that the brain reads as more danger. Slow it down and you cut the accelerant.

The mechanism runs through [heart-rate variability](/glossary/heart-rate-variability). A long, slow exhale briefly hands control to the [parasympathetic](/glossary/parasympathetic-nervous-system) branch via the [vagus nerve](/glossary/vagus-nerve); the heart slows on the out-breath. Pace the whole breath slow — and bias it toward the exhale — and you raise vagal tone and pull the system back toward calm (Zaccaro 2018; Lehrer & Gevirtz 2014).

---

## Section 3: What the trials actually found

This is not folk wisdom dressed up. Two threads of real evidence:

- **HRV biofeedback for anxiety.** A meta-analysis pooling controlled trials of HRV-biofeedback breathing found a meaningful reduction in self-reported stress and anxiety across studies (Goessl 2017). The active ingredient is exactly the slow, paced, feedback-guided breathing described above.
- **The exhale beats the mindfulness.** A 2023 randomised trial compared brief daily breathwork against mindfulness meditation and found that short, exhale-emphasised breathing ("cyclic sighing") improved mood and lowered physiological arousal *more* than the meditation control (Balban 2023). The out-breath, specifically, did the work.

The headline: for acute arousal, a few minutes of slow, exhale-led breathing is one of the best-supported, lowest-risk self-regulation tools there is.

---

## Section 4: Seeing the override work

Knowing the breath is the lever is one thing; *feeling* it move the needle is another — and that's the gap a feedback loop closes.

ONDA is an [HRV biofeedback](/hrv-biofeedback) app: it reads your heartbeat from the phone camera or an Apple Watch, paces you at your resonance breathing rate, and renders your own heart rhythm organising in real time as a coherence score. Instead of breathing blind and hoping, you watch the runaway loop actually settle — see [what it measures](/measurements) and [how it works](/how-it-works). That visible proof is oddly powerful mid-anxiety, when the brain insists nothing is helping.

Now the firewall, plainly: this is a **self-regulation practice, not a treatment for an anxiety disorder**. Breathing tools sit alongside therapy, medication and professional care — they don't replace them, and ONDA is not a medical device.

---

## Section 5: When to get help, not an app

Slow breathing is a genuine emergency brake for a spike. It is not a substitute for care when anxiety is running your life. Please talk to a professional if:

- Panic attacks are frequent, or you're reorganising your life to avoid them.
- Anxiety is interfering with work, sleep or relationships.
- You ever feel unsafe.

Chest pain, especially the first time, is a medical emergency until a doctor says otherwise — never assume it's "just panic."

Within those limits, the practice is simple and the evidence is real: when the alarm misfires, the breath is how you reach in and reset it.

> **The Hack:** At the first flicker — before the spiral — breathe low and slow with a longer exhale than inhale (try 4 in, 6 out) for a couple of minutes. Longer out-breaths raise vagal tone fastest. Do it *early*; the loop is far easier to interrupt before it accelerates.

> [ SYSTEM_STATUS ]
> LOOP: threat-detector ⇄ body signals (self-amplifying)
> ACCELERANT: fast shallow breathing (drops CO₂)
> MANUAL_OVERRIDE: slow, exhale-led breathing → vagal brake
> STATUS: PRACTICE, NOT TREATMENT
`,
  howToSteps: [
    {
      name: 'Catch it early',
      text: 'Intervene at the first flicker — a tight chest, a shallow breath — not once the attack has accelerated. The loop is far easier to interrupt before it self-amplifies.',
      protocolId: 'anx-early',
    },
    {
      name: 'Breathe low, slow, and exhale-led',
      text: 'Breathe into the belly, slow the whole breath, and make the exhale longer than the inhale (e.g. 4 seconds in, 6 out). The long out-breath raises vagal tone and slows the heart fastest.',
      protocolId: 'anx-exhale',
    },
    {
      name: 'Use live feedback to see it settle',
      text: 'HRV biofeedback shows your heart rhythm organising in real time — visible proof the brake is working, which is reassuring exactly when anxiety insists nothing helps.',
      protocolId: 'anx-biofeedback',
    },
    {
      name: 'Know when to get help',
      text: 'For frequent panic, avoidance, or anxiety that disrupts your life, see a professional. Breathing practice sits alongside therapy and care — not instead of it. First-time chest pain is a medical emergency.',
      protocolId: 'anx-help',
    },
  ],
}

export default [article]
