import type { Article } from './types'

/**
 * Vagus Nerve Exercises — companion guide for /tools/nervous-system + /tools/breathing.
 * Targets the hot "vagus nerve exercises / how to stimulate the vagus nerve"
 * query in plain language (the existing vagus article is conceptual). ONDA voice.
 */
const article: Article = {
  slug: 'vagus-nerve-exercises',
  title: 'Vagus Nerve Exercises: How to Switch On Your Calm',
  seoTitle: 'Vagus Nerve Exercises That Actually Work | ONDA Life',
  description:
    'Evidence-based vagus nerve exercises to shift out of fight-or-flight: slow exhale breathing, humming, cold and more — what works, what is hype, and how to tell.',
  category: 'ONDA Protocol',
  relatedSlugs: ['vagus-nerve', 'parasympathetic-nervous-system', 'heart-rate-variability', 'sympathetic-nervous-system', 'mammalian-dive-reflex'],
  introStyle: 'emerald',
  image: '/images/vagus-nerve-exercises.png',
  imageAlt:
    'Vagus nerve exercises: slow-exhale breathing, humming, gargling and cold exposure to raise vagal tone and shift out of fight-or-flight.',
  imageTitle: '[VAGAL_TONE_UP]: Activating the parasympathetic brake to leave fight-or-flight.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Not sure which state you’re in? Find out, then get the matched protocol.',
    link: '/tools/nervous-system',
    linkText: 'Nervous System State Quiz →',
  },
  howToSteps: [
    { name: 'Slow, long-exhale breathing', text: 'Breathe so the exhale is longer than the inhale (e.g. in 4, out 6) for a few minutes — the single most reliable vagal lever.', protocolId: 'vagus-exhale' },
    { name: 'Hum, chant or gargle', text: 'Humming, chanting "voo/om" or gargling vibrates the vocal cords, which the vagus innervates — 30–60 seconds.', protocolId: 'vagus-hum' },
    { name: 'Cool the face', text: 'Splash cold water on the face or hold a cold pack to the cheeks/eyes for ~30 seconds to trigger the calming dive reflex.', protocolId: 'vagus-cold' },
    { name: 'Make it a daily habit', text: 'Vagal tone is trainable — a few minutes of slow breathing most days raises it over weeks, not one session.', protocolId: 'vagus-habit' },
  ],
  content: `
## [ PROTOCOL: VAGAL_TONE // LEAVE_FIGHT_OR_FLIGHT ]

> "The vagus nerve is the main cable of your [parasympathetic](/glossary/parasympathetic-nervous-system) 'rest-and-digest' branch — the brake on fight-or-flight. 'Vagus nerve exercises' are simply ways to press that brake on purpose. The internet has turned this into a miracle-cure genre; the reality is more modest and more useful. A handful of techniques genuinely raise vagal activity in the moment, and practised regularly they make calm easier to reach. Here's what actually works, and what's hype."

---

## Section 1: How to know it's working

Vagal activity shows up in your [heart-rate variability](/glossary/heart-rate-variability) — higher vagal tone, higher HRV, and a faster return to calm after stress (Laborde 2017). That's the honest throughline: the techniques below all converge on the same mechanism (more vagal output, less [sympathetic](/glossary/sympathetic-nervous-system) drive), and the "vagal states" framing comes from polyvagal theory (Porges 2009), whose broad map is useful even if some specifics are debated.

Not sure which state you're actually in? The [Nervous System State quiz](/tools/nervous-system) reads fight-or-flight vs shutdown vs regulated and gives you the matching protocol.

---

## Section 2: What actually works (ranked)

- **Slow, long-exhale breathing** — the strongest, best-evidenced lever. Making the exhale longer than the inhale stimulates the vagus and shifts state fast (Gerritsen & Band 2018). This is the engine behind every breathing app, and the [Breathing Pacer](/tools/breathing) automates it.
- **Humming, chanting, gargling** — the vagus innervates the larynx, so vocal-cord vibration gives it gentle stimulation. Low-cost, surprisingly effective for a quick reset.
- **Cold on the face** — a cold splash or pack to the face triggers the [dive reflex](/glossary/mammalian-dive-reflex), abruptly slowing the heart via the vagus. A fast circuit-breaker when you're spiked.
- **Slow, social, safe** — unhurried conversation, being with people you trust, and even a long exhale-sigh all nudge the system toward the regulated state.

### What's mostly hype

"Vagus nerve resets" promising to cure anxiety, autoimmune disease or inflammation in one move outrun the evidence. Supplements and most gadgets marketed for the vagus are weakly supported. The boring basics — breath, sleep, movement, connection — do the real work.

---

## Section 3: Vagal Firmware Protocols

### PROTOCOL 1: The Exhale Brake

> **The Hack:** Breathe in for 4, out for 6, for 3–5 minutes whenever you're wired.

**The Science:** The longer exhale spends more time in the heart-rate-slowing phase of each breath, raising vagal tone and dropping arousal faster than equal breathing.

### PROTOCOL 2: The 60-Second Hum

> **The Hack:** Hum or chant a low "voo"/"om" on each exhale for a minute.

**The Logic:** Vocal-cord vibration mechanically stimulates vagal fibres in the throat — a discreet reset you can do almost anywhere.

### PROTOCOL 3: Cold Face Reset

> **The Hack:** Splash cold water on your face, or hold a cold pack over your cheeks and eyes for ~30 seconds.

**The Logic:** This fires the mammalian dive reflex, which slows the heart through the vagus — useful to break an acute stress spike. (Skip if you have a heart condition.)

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: HRV tracker (morning trend)
> METRIC: Resting HRV trends up over weeks of daily practice
> STATUS: VAGAL_TONE_RISING
`,
}

export default [article]
