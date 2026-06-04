import type { Article } from './types'

/**
 * Box Breathing — companion guide for /tools/breathing.
 * Targets the high-volume "box breathing / 4-7-8 breathing" query in plain
 * language (the existing breathwork article is conceptual/ONDA-model). ONDA voice.
 */
const article: Article = {
  slug: 'box-breathing-how-it-works',
  title: 'Box Breathing: The 4-4-4-4 Reset for Stress',
  seoTitle: 'Box Breathing: How to Do It (4-4-4-4) | ONDA Life',
  description:
    'Box breathing is the 4-4-4-4 technique used by Navy SEALs to stay calm under pressure. Here is how to do it, why slow breathing works, and when to use it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['parasympathetic-nervous-system', 'vagus-nerve', 'heart-rate-variability', 'diaphragm', 'sympathetic-nervous-system'],
  introStyle: 'blue',
  image: '/images/tools/breathing.png',
  imageAlt:
    'Box breathing 4-4-4-4 technique: inhale, hold, exhale, hold — a paced breathing reset that calms the nervous system and raises HRV.',
  imageTitle: '[STATE_RESET]: The 4-4-4-4 box — pacing breath to down-shift the nervous system.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Follow the animated circle instead of counting — box, 4-7-8 and coherent, paced for you.',
    link: '/tools/breathing',
    linkText: 'Breathing Pacer →',
  },
  howToSteps: [
    { name: 'Breathe in — 4 seconds', text: 'Inhale slowly through the nose for a count of four, letting the belly expand.', protocolId: 'box-inhale' },
    { name: 'Hold — 4 seconds', text: 'Hold the breath in, relaxed, for a count of four. No straining.', protocolId: 'box-hold-in' },
    { name: 'Breathe out — 4 seconds', text: 'Exhale smoothly through the nose or mouth for a count of four.', protocolId: 'box-exhale' },
    { name: 'Hold — 4 seconds', text: 'Hold the breath out for a count of four, then repeat the box for 4–6 rounds.', protocolId: 'box-hold-out' },
  ],
  content: `
## [ PROTOCOL: BOX_BREATHING // 4-4-4-4 ]

> "Box breathing is the simplest down-regulation tool there is: inhale 4, hold 4, exhale 4, hold 4 — a square you trace with your breath. The US military teaches it to operators who need to stay calm and think clearly while everything around them is loud. In the ONDA Biocomputer model, it's a manual override on the autonomic nervous system: when you can't change the situation, you can change the breath, and the body follows."

---

## Section 1: How it works

You can't consciously command your heart rate or your stress chemistry — but breathing is the one autonomic function you *can* drive manually, and it back-propagates to the rest of the system. Slow, paced breathing at around six breaths per minute shifts the balance toward the [parasympathetic](/glossary/parasympathetic-nervous-system) ("rest-and-digest") branch, raises [heart-rate variability](/glossary/heart-rate-variability) and lowers arousal (Zaccaro 2018; Lehrer & Gevirtz 2014).

Box breathing's equal 4-4-4-4 rhythm lands you near that rate, and the breath-holds add a deliberate, almost meditative structure that gives a busy mind something simple to track. The result: a fast, portable way to step out of fight-or-flight.

---

## Section 2: When to use which pattern

- **Box (4-4-4-4)** — steady focus under pressure. Best before a stressful event, or to settle without making yourself sleepy. The held breaths build composure.
- **4-7-8** — a stronger off-switch for sleep. The long hold and even longer exhale push your breathing rate right down and emphasise the calming out-breath.
- **Extended exhale (4-6)** — fastest everyday calm. A longer exhale than inhale raises vagal tone quickest; an RCT found brief exhale-focused breathing improved mood and lowered arousal more than mindfulness (Balban 2023).

Don't count in your head — let the [Breathing Pacer](/tools/breathing) run the rhythm so you can just follow the circle. For the personalised HRV sweet spot, see [resonance breathing](/tools/resonance-breathing).

---

## Section 3: Box-Breathing Protocols

### PROTOCOL 1: The Pre-Stress Box

> **The Hack:** Run 4–6 rounds of 4-4-4-4 in the two minutes before anything that spikes you — a meeting, a lift, a hard conversation.

**The Science:** Slowing the breath pre-emptively raises parasympathetic tone, so you enter the event already down-shifted instead of trying to claw back calm mid-spike.

### PROTOCOL 2: Nasal, Diaphragmatic, Quiet

> **The Hack:** Breathe through the nose into the belly (the [diaphragm](/glossary/diaphragm)), not the chest, and keep it silent and smooth.

**The Logic:** Nasal, diaphragmatic breathing slows the rate naturally and engages the vagus more than shallow chest breathing. If you're audibly straining, ease off the counts.

### PROTOCOL 3: Shorten the Box if You're Light-Headed

> **The Hack:** If 4-4-4-4 makes you dizzy, drop to 3-3-3-3 or skip the holds. Never force it.

**The Logic:** The holds can feel like too much at first. Comfort beats heroics — the calming effect comes from the slow rhythm, not from enduring long holds.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: HRV / resting-HR tracker, or just the felt sense
> METRIC: Heart rate and tension drop within a few rounds
> STATUS: PARASYMPATHETIC_ENGAGED
`,
}

export default [article]
