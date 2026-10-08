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
    'Vagus nerve exercises: slow-exhale breathing, humming, gargling and cold exposure — what the evidence says about shifting out of fight-or-flight.',
  imageTitle: '[PARASYMPATHETIC_BRAKE]: Engaging the calming brake to leave fight-or-flight.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Not sure which state you’re in? Find out, then get the matched protocol.',
    link: '/tools/nervous-system',
    linkText: 'Nervous System State Quiz →',
  },
  howToSteps: [
    { name: 'Slow, long-exhale breathing', text: 'Breathe slowly for a few minutes; many people make the exhale longer than the inhale (e.g. in 4, out 6). Slow breathing is the best-supported of these exercises.', protocolId: 'vagus-exhale' },
    { name: 'Hum, chant or gargle', text: 'Humming, chanting "voo/om" or gargling vibrates the vocal cords, which the vagus innervates — 30–60 seconds.', protocolId: 'vagus-hum' },
    { name: 'Cool the face', text: 'Splash cold water on the face or hold a cold pack to the cheeks/eyes for ~30 seconds to trigger the calming dive reflex.', protocolId: 'vagus-cold' },
    { name: 'Make it a daily habit', text: 'Vagal tone cannot be measured directly; HRV reflects vagally mediated changes — and a few minutes of slow breathing most days tends to raise resting HRV over weeks, not one session.', protocolId: 'vagus-habit' },
  ],
  content: `
## [ PROTOCOL: VAGAL_TONE // LEAVE_FIGHT_OR_FLIGHT ]

> "The vagus nerve is the main cable of your [parasympathetic](/glossary/parasympathetic-nervous-system) 'rest-and-digest' branch — the brake on fight-or-flight. 'Vagus nerve exercises' are simply ways to press that brake on purpose. The internet has turned this into a miracle-cure genre; the reality is more modest and more useful. A handful of techniques genuinely raise vagal activity in the moment, and practised regularly they make calm easier to reach. Here's what actually works, and what's hype."

---

## What is the vagus nerve, in plain terms?

The [vagus nerve](/science/concepts/vagus-nerve) is the main nerve of the [parasympathetic](/glossary/parasympathetic-nervous-system) system, running from the brainstem to the heart, lungs and gut. Most of its traffic goes *up*, not down: roughly 80–90% of its fibres are sensory (afferent), carrying signals about the state of your organs to the brain, while the remaining 10–20% carry commands back to the body (Breit 2018). On the "down" side, vagal fibres release acetylcholine at the heart, which slows the heartbeat — that is the brake the exercises below lean on.

This two-way wiring is why breathing works as a lever: you can't will your heart to slow, but you can change your breathing, and the vagus relays the result in both directions.

---

## How do you know vagus nerve exercises are working?

You know they're working when your [HRV](/science/concepts/heart-rate-variability) rises: vagal activity shows up in your [heart-rate variability](/glossary/heart-rate-variability) — higher vagal tone, higher HRV, and a faster return to calm after stress (Laborde 2017). The techniques below all converge on the same mechanism: more vagal output, less [sympathetic](/glossary/sympathetic-nervous-system) drive.

Not sure which state you're actually in? The [Nervous System State quiz](/tools/nervous-system) reads fight-or-flight vs shutdown vs regulated and gives you the matching protocol.

### How is vagal tone measured?

Vagal tone can't be measured directly in everyday life; it is estimated from heart-rate variability. The usual indices are [RMSSD](/science/concepts/rmssd) (beat-to-beat variation), high-frequency HRV, and [respiratory sinus arrhythmia](/science/concepts/respiratory-sinus-arrhythmia) — the heart speeding up slightly on the inhale and slowing on the exhale. These are indirect proxies, not a gold standard: breathing rate and depth, posture, time of day, caffeine, alcohol and illness all move them, which is why researchers recommend controlling or at least reporting breathing when HRV is used as a vagal marker (Laborde 2017).

In practice, that means comparing like with like: a morning reading taken the same way each day, watched as a trend over weeks, tells you more than any single number. ONDA reads HRV from Apple Watch via Apple Health for exactly this kind of baseline.

---

## Which vagus nerve exercises actually work?

Slow, long-exhale breathing is the strongest, best-evidenced vagus nerve exercise; humming, cold on the face and slow social contact follow.

- **Slow, long-exhale breathing** — the strongest, best-evidenced lever. {{fact:claim.slowExhale}}. Slow breathing shifts state fast (Gerritsen & Band 2018). This is the engine behind every breathing app, and the [Breathing Pacer](/tools/breathing) automates it.
- **Humming, chanting, gargling** — the vagus innervates the larynx, so vocal-cord vibration is thought to give it gentle stimulation (a proposed route, not shown beyond the slow exhale that comes with it). Low-cost and easy to try; see [humming, chanting and Om: the evidence](/science/evidence/humming-and-chanting).
- **Cold on the face** — a cold splash or pack to the face triggers the [dive reflex](/glossary/mammalian-dive-reflex), abruptly slowing the heart via the vagus. A fast circuit-breaker when you're spiked.
- **Slow, social, safe** — unhurried conversation, being with people you trust, and even a long exhale-sigh all nudge the system toward the regulated state.

### What's mostly hype

"Vagus nerve resets" promising to cure anxiety, autoimmune disease or inflammation in one move outrun the evidence. Supplements and most gadgets marketed for the vagus are weakly supported, and popular tricks like holding your eyes to one side "until you sigh" have no published evidence behind them. The boring basics — breath, sleep, movement, connection — do the real work.

### What about polyvagal theory?

Much of the "vagal states" language online — safe and social, fight-or-flight, shutdown — comes from polyvagal theory (Porges 2009). It is popular in therapy because it gives people a simple map of how their body reacts to feeling safe or threatened. But several of its core anatomical and evolutionary claims, such as a separate "ventral vagal" system unique to mammals driving social engagement, are disputed by physiologists (Grossman 2023). Use the map as a way to notice your state, not as settled biology. The exercises here don't depend on it: slow breathing slows the heart through the vagus either way.

---

## How do you do the three core exercises?

Start with the long exhale, add a hum when you want a quick reset, and keep the cold-face trick for acute spikes.

### PROTOCOL 1: The Exhale Brake

> **The Hack:** Breathe in for 4, out for 6, for 3–5 minutes whenever you're wired.

**The Science:** The heart slows on every exhale, so a longer exhale spends more time in that phase. {{fact:claim.slowExhale}}.

### PROTOCOL 2: The 60-Second Hum

> **The Hack:** Hum or chant a low "voo"/"om" on each exhale for a minute.

**The Logic:** Vocal-cord vibration is thought to reach vagal fibres in the throat, on top of the long exhale — a discreet reset you can do almost anywhere.

### PROTOCOL 3: Cold Face Reset

> **The Hack:** Splash cold water on your face, or hold a cold pack over your cheeks and eyes for ~30 seconds.

**The Logic:** This fires the mammalian dive reflex, which slows the heart through the vagus — useful to break an acute stress spike. (Skip if you have a heart condition.)

> [ HARDWARE_VALIDATION ]
> EXAMPLE_DEVICE: HRV tracker (morning trend)
> METRIC: HRV rises during the face cooling; a higher resting HRV afterwards has not been shown
> STATUS: HRV_UP_DURING_EXPOSURE
`,
}

export default [article]
