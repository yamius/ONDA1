import type { Article } from './types'

/**
 * Coherent Breathing — companion guide for /tools/resonance-breathing + /tools/breathing.
 * Targets "coherent breathing / 6 breaths per minute / resonance breathing benefits".
 * Distinct from box-breathing guide (that's box/4-7-8). Reuses verified sources.
 */
const article: Article = {
  slug: 'coherent-breathing-guide',
  title: 'Coherent Breathing: The 6-Breaths-a-Minute HRV Sweet Spot',
  seoTitle: 'Coherent Breathing: ~6 Breaths/Min for HRV | ONDA Life',
  description:
    'Coherent breathing — slow, even breaths at about six per minute — maximises HRV and calms the nervous system. The science, the rate, and how to practise it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['heart-rate-variability', 'parasympathetic-nervous-system', 'vagus-nerve', 'diaphragm', 'sympathetic-nervous-system'],
  introStyle: 'cyan',
  image: '/images/tools/resonance-breathing.png',
  imageAlt:
    'Coherent breathing at ~6 breaths per minute: the resonance frequency where heart rate, breathing and baroreflex sync and HRV peaks.',
  imageTitle: '[RESONANCE_LOCK]: Breathing at ~6/min to maximise heart-rate variability.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Find your personal resonance rate (~4.5–6.5/min) and pace it with the circle.',
    link: '/tools/resonance-breathing',
    linkText: 'Resonance Breathing Finder →',
  },
  howToSteps: [
    { name: 'Breathe ~6 per minute', text: 'Inhale ~5 seconds, exhale ~5 seconds, evenly and through the nose — about six breaths a minute.', protocolId: 'coherent-rate' },
    { name: 'Keep it smooth and effortless', text: 'No breath-holds, no straining; the breath should be gentle and continuous, belly-led.', protocolId: 'coherent-smooth' },
    { name: 'Practise 10–20 minutes', text: 'Sessions of 10–20 minutes, once or twice daily, build the largest benefit over weeks.', protocolId: 'coherent-dose' },
    { name: 'Dial in your exact rate', text: 'Your personal resonance frequency sits between 4.5 and 6.5/min — test to find where you feel calmest.', protocolId: 'coherent-personal' },
  ],
  content: `
## [ PROTOCOL: COHERENT_BREATHING // RESONANCE_LOCK ]

> "Coherent breathing is the quiet powerhouse of breathwork: slow, even breaths at about six per minute, no holds, no drama. At that pace something neat happens — your heart rate, breathing and blood-pressure rhythms fall into phase, and your [heart-rate variability](/glossary/heart-rate-variability) swings to its widest. In the ONDA Biocomputer model, you’ve found the system’s resonant frequency, where a small, rhythmic input produces a large, calming output."

---

## Section 1: Why ~6 breaths a minute

Around six breaths per minute (0.1 Hz) is the **resonance frequency** of the cardiovascular system. Breathe there and you maximally stimulate the baroreflex — the loop that buffers blood pressure — driving large, coherent heart-rate oscillations and shifting the balance toward the [parasympathetic](/glossary/parasympathetic-nervous-system) branch via the [vagus nerve](/glossary/vagus-nerve) (Lehrer 2003; Lehrer & Gevirtz 2014). This is the engine of HRV biofeedback.

It isn’t exactly six for everyone — personal resonance sits between about 4.5 and 6.5/min. The [Resonance Breathing Finder](/tools/resonance-breathing) helps you home in on yours; if you just want a paced circle, the [Breathing Pacer](/tools/breathing) has a coherent preset.

---

## Section 2: What it does

A controlled study had people breathe at resonance frequency for 15 minutes; it raised HRV and improved mood versus sitting quietly (Steffen 2017). Acutely, coherent breathing reliably increases HRV and lowers arousal; practised regularly it’s associated with better stress resilience, blood pressure and emotional regulation. It is not a cure for anxiety disorders, but it’s one of the most evidence-grounded, zero-cost self-regulation tools there is.

Coherent breathing differs from [box breathing and 4-7-8](/articles/box-breathing-how-it-works): those use holds and are great for acute calm or sleep, while coherent is a smooth, hold-free rhythm optimised specifically for HRV — better for daily practice and biofeedback.

---

## Section 3: How to practise

### PROTOCOL 1: Even, Nasal, Belly-Led

> **The Hack:** Inhale ~5s, exhale ~5s, through the nose, into the [diaphragm](/glossary/diaphragm) — smooth and continuous.

**The Science:** Even, slow, diaphragmatic breathing at ~6/min hits the baroreflex resonance; chest-shallow or jerky breathing doesn’t.

### PROTOCOL 2: 10–20 Minutes, Most Days

> **The Hack:** One or two sessions of 10–20 minutes daily.

**The Science:** HRV-biofeedback protocols use this dose; the acute calm is immediate, and the larger adaptations build over weeks of consistency.

### PROTOCOL 3: Find Your Own Rate

> **The Hack:** Test 6.5, 6, 5.5, 5 and 4.5/min for a couple of minutes each; keep the one that feels smoothest and calmest.

**The Logic:** Everyone’s resonance frequency differs slightly. The exact rate is best confirmed against live HRV (what the ONDA app does), but feel gets you close.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: HRV reading during the session
> METRIC: Heart-rate oscillation amplitude peaks at your resonance rate
> STATUS: RESONANCE_ACHIEVED

---

Educational, not medical advice. If you have a cardiovascular or respiratory condition or feel light-headed, stop and breathe normally.
`,
}

export default [article]
