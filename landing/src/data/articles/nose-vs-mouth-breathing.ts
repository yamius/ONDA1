import type { Article } from './types'

/**
 * Nose vs mouth breathing — the ROUTE (not just depth) shifts autonomic balance + sustained attention.
 * Grounded: Japanese randomized within-subject study (HRV LF/HF + Continuous Performance Test);
 * nasal resistance → slower controlled breath → vagal shift; nasal nitric oxide. AEO reference,
 * FAQ in ARTICLE_FAQ. Honest: nasal favoured for rest/focus, mouth fine for exertion; camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'nose-vs-mouth-breathing',
  title: 'Nose vs Mouth Breathing: What It Does to Your Nervous System and Focus',
  seoTitle: 'Nose vs Mouth Breathing: Nervous System & Focus | ONDA Life',
  description:
    'Nose breathing shifts your autonomic balance and supports focus differently than mouth breathing. What Japanese research found, the physiology, and when each matters.',
  category: 'Biological Software',
  relatedSlugs: ['coherent-breathing-guide', 'breathing-lowers-stress-hormones', 'physiological-sigh', 'how-to-raise-hrv-naturally', 'breathing-for-focus-and-attention'],
  introStyle: 'blue',
  neuralSuggestion: {
    text: 'A minute each way, nose then mouth — the difference often shows up plainly in your own heart rhythm.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
Nose breathing and mouth breathing affect your body differently — not just how much air you move, but your autonomic balance and your ability to concentrate. Japanese research comparing the two, in a randomized design, measured heart rate variability (HRV) and sustained attention under each condition, finding measurable differences in autonomic function between nose and mouth breathing. The short version: nasal breathing tends to support a calmer, more regulated autonomic state and steadier focus, while habitual mouth breathing is associated with a less favorable pattern. How you breathe — not just how deeply — shapes your nervous system.

## Why the route of air matters

It's easy to think a breath is a breath, but the path the air takes changes the physiology. Nasal breathing filters, warms and humidifies air, and — importantly for your nervous system — it's slower and more resistive than mouth breathing. That natural resistance encourages a longer, more controlled breath, which is exactly the pattern that activates the [vagus nerve](/glossary/vagus-nerve) and shifts you toward "rest and digest." Mouth breathing, by contrast, tends to be faster and shallower, which can nudge you toward a more sympathetic (activated) state.

Nasal breathing also engages nitric oxide produced in the nasal passages, which supports blood flow and oxygen uptake — a benefit you skip entirely when breathing through the mouth.

## What the Japanese research found

A randomized study compared nose breathing and mouth breathing within the same participants, using a wearable heart-rate sensor to analyze HRV (the LF and HF frequency bands that reflect autonomic activity) and a Continuous Performance Test to measure sustained attention. By expressing each breathing condition's autonomic index relative to normal breathing, the researchers could isolate the effect of the breathing route itself.

The finding: the breathing route produced measurable differences in autonomic function, and nasal breathing was associated with better markers than mouth breathing. In other words, simply switching from mouth to nose breathing shifted the autonomic balance — and this tied into differences in concentration on the attention task. It's a controlled demonstration that *how* you route your breath, independent of depth, changes both your nervous system and your focus.

## The focus connection

This is the part most breathing advice misses. We usually frame breathing as a calming tool, but the research also linked nasal breathing to steadier sustained attention. That makes physiological sense: a regulated autonomic state — not too activated, not sluggish — is the foundation for focus. If mouth breathing tips you slightly toward a scattered, sympathetic-leaning state, and nasal breathing keeps you regulated, then something as simple as keeping your mouth closed during deep work could support concentration. It's a low-effort lever hiding in plain sight — and it pairs well with [breathing for focus and attention](/articles/breathing-for-focus-and-attention).

## When each matters

- **Default to nose breathing** at rest, during focus work, and during slow breathing practice — it supports a calm, regulated state and steadier attention.
- **Mouth breathing has its place** during hard physical exertion, when you need maximum airflow. That's appropriate; the concern is *habitual* mouth breathing at rest.
- **Watch for mouth breathing at night** — it's common and can fragment sleep. Nasal breathing during sleep is generally more restorative.
- **In slow-breathing practice**, inhale through the nose to get the natural pacing and nitric oxide benefit; a mouth exhale is fine for a long, controlled out-breath — the pattern [coherent breathing](/articles/coherent-breathing-guide) and the [physiological sigh](/articles/physiological-sigh) both use.

## See how your breathing shifts you

Because the effect of breathing route shows up in your autonomic balance, you can observe it. ONDA reads your pulse from your phone camera, or your HRV from your Apple Watch, so you can watch how nasal versus mouth breathing changes your heart rhythm in real time. Trying it yourself — a minute each way — often makes the difference obvious in your own numbers.
`,
}

export default [article]
