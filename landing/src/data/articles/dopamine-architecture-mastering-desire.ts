import type { Article } from './types'

/**
 * Dopamine Architecture: Mastering the Currency of Desire
 * SEO article with glossary term linking.
 */
const article: Article = {
  slug: 'dopamine-architecture-mastering-desire',
  title: 'Dopamine Architecture: Mastering the Currency of Desire',
  description:
    'Learn how to reclaim your drive by understanding Dopamine as the biological Prediction Error — and escape the Dopamine Traps that hijack your reward circuitry.',
  category: 'Biological Software',
  relatedSlugs: ['dopamine', 'ventral-tegmental-area', 'prefrontal-cortex', 'limbic-system', 'homeostasis', 'circadian-rhythm', 'ond-tokens', 'neuroplasticity'],
  introStyle: 'purple',
  neuralSuggestion: {
    text: 'Drive requires Balance. Learn how to calibrate your recovery with the Vagus Nerve Protocol.',
    link: '/articles/vagus-nerve-master-key',
    linkText: 'Vagus Nerve Protocol',
  },
  content: `
## [ ANALYZING REWARD LOGIC ]

> "Dopamine is not about pleasure. It is about pursuit. It is the biological 'Prediction Error'—the neural delta between what you expect and what you receive. In the ONDA Biocomputer model, Dopamine is the biological substrate of OND Tokens — the internal reward currency used to prioritize tasks and allocate metabolic energy.
>
> Most modern environments are 'Dopamine Traps' designed to hijack your reward circuitry via low-value loops—scrolling, notifications, and refined sugars. This leads to 'Receptor Downregulation'—a state where your hardware becomes numb to the signals that actually matter. You're not lazy; your dopamine baseline is just miscalibrated.
>
> To reclaim your drive, you must understand the difference between 'Cheap Dopamine' and 'High-Yield Pursuit.' It is time to rewrite your reward logic."

---

## Section 1: The Reward Circuitry

The dopamine pathway begins in the Ventral Tegmental Area (VTA) and projects to the Nucleus Accumbens. This is the core of your motivation engine. When this circuit is active, your Prefrontal Cortex shifts into 'High-Focus' mode, directing all system resources toward a specific goal. However, if this circuit is overstimulated by synthetic triggers, the Limbic System overrides your rational OS, leading to compulsive behaviors and "Brain Fog."

---

## Section 2: The Baseline vs. The Spike

Your biological "Satisfaction Level" depends on your Dopamine Baseline. When you experience a massive spike (a 'Cheap Dopamine' hit), your system triggers Homeostasis, forcing a proportional "crash" to balance the scales. Chronic spiking leads to a lower baseline, making everyday tasks feel grey and uninspiring. The good news: Neuroplasticity allows you to rewire this circuitry over time. To maintain high performance, you must protect your baseline from extreme volatility.

---

## Section 4: Dopamine Firmware Upgrades

### PROTOCOL 1: The 'Intermittent Reward' Logic

> **The Hack:** Do not celebrate every minor win. Use a "coin flip" or a randomizer to decide if you get a reward after a successful task.

**The Science:** This mimics natural survival conditions. Random rewards prevent receptor saturation and keep your motivation levels at a steady high, preventing the "Post-Success Depression" common in high-achievers.

### PROTOCOL 2: The Morning Light Trigger

> **The Hack:** Get 10–15 minutes of direct sunlight (no windows/sunglasses) within the first hour of waking up.

**The Logic:** Sunlight triggers an immediate release of precursor dopamine and sets the timer for your Circadian Rhythm. This is the foundation of your daily "Motivation Window."

### PROTOCOL 3: Cold-Induced Baseline Boost

> **The Hack:** A 2-minute cold shower or ice bath (below 15°C).

**The Logic:** Unlike caffeine, which causes a sharp spike and crash, cold exposure raises baseline dopamine by up to 250%. This elevation is slow, steady, and lasts for 3–4 hours, providing "Clean Energy" for deep work.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Screen Time Analytics
> METRIC: Daily Pickup Count
> STATUS: ATTENTION_AUDIT_STABLE
`,
  howToSteps: [
    {
      name: "The 'Intermittent Reward' Logic",
      text: 'Do not celebrate every minor win. Use a "coin flip" or a randomizer to decide if you get a reward after a successful task.',
      protocolId: 'dopamine-intermittent-reward',
    },
    {
      name: 'The Morning Light Trigger',
      text: 'Get 10–15 minutes of direct sunlight (no windows/sunglasses) within the first hour of waking up.',
      protocolId: 'dopamine-morning-light',
    },
    {
      name: 'Cold-Induced Baseline Boost',
      text: 'A 2-minute cold shower or ice bath (below 15°C).',
      protocolId: 'dopamine-cold-baseline',
    },
  ],
}

export default [article]
