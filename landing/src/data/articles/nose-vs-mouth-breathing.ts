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
  image: '/images/articles/nose-vs-mouth-breathing.jpg',
  imageAlt:
    'Nose vs Mouth Breathing — illustration: a face-profile silhouette showing smooth, laminar airflow through the nose contrasted with scattered, turbulent flow near the mouth.',
  imageTitle: 'Nose vs Mouth Breathing',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'A minute each way, nose then mouth — the difference often shows up plainly in your own heart rhythm.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
Nose breathing and mouth breathing affect your body differently — not just how much air you move, but your autonomic balance and your ability to concentrate. Japanese research comparing the two, in a randomized design, measured [heart rate variability](/science/concepts/heart-rate-variability) (HRV) and sustained attention under each condition, and reported differences in autonomic function between nose and mouth breathing. The short version: in this one small study, nasal breathing came out slightly better on autonomic and attention measures than mouth breathing — an early finding, not an established effect. How you breathe — not just how deeply — shapes your nervous system.

## Does it matter if you breathe through your nose or mouth?

Yes — the path the air takes changes the physiology, even if it's easy to think a breath is a breath. Nasal breathing filters, warms and humidifies air, and — importantly for your nervous system — it's slower and more resistive than mouth breathing. That natural resistance encourages a longer, more controlled breath, which is exactly the pattern associated with higher vagally mediated HRV (see [vagus nerve](/glossary/vagus-nerve)) and shifts you toward "rest and digest." Mouth breathing, by contrast, tends to be faster and shallower, which can nudge you toward a more sympathetic (activated) state.

Nasal breathing also carries nitric oxide made in the sinuses into the lungs, where it is proposed to aid oxygen uptake; how large any such effect is in daily life is not established (see [the evidence on nasal breathing](/science/evidence/nasal-breathing)).

## What the Japanese research found

A randomized study compared nose breathing and mouth breathing within the same participants, using a wearable heart-rate sensor to analyze HRV (the LF and HF frequency bands that reflect autonomic activity) and a Continuous Performance Test to measure sustained attention. By expressing each breathing condition's autonomic index relative to normal breathing, the researchers could isolate the effect of the breathing route itself.

The finding: the breathing route produced measurable differences in autonomic function, and nasal breathing was associated with better markers than mouth breathing. In other words, simply switching from mouth to nose breathing shifted the autonomic balance — and this tied into differences in concentration on the attention task. Because it is one small study, it hints that *how* you route your breath may matter for your nervous system and focus — it does not establish that it does.

## Does nose breathing improve focus?

This small study linked nasal breathing to slightly steadier sustained attention — an early finding, and the part most breathing advice misses, since we usually frame breathing as a calming tool. That makes physiological sense: a regulated autonomic state — not too activated, not sluggish — is the foundation for focus. If mouth breathing tips you slightly toward a scattered, sympathetic-leaning state, and nasal breathing keeps you regulated, then something as simple as keeping your mouth closed during deep work could support concentration. It's a low-effort lever hiding in plain sight — and it pairs well with [breathing for focus and attention](/articles/breathing-for-focus-and-attention).

## When should you breathe through your nose vs your mouth?

- **Default to nose breathing** at rest, during focus work, and during [slow breathing](/science/evidence/slow-breathing) practice — it conditions the air and encourages a slower breath; small studies hint at a calmer state and steadier attention.
- **Mouth breathing has its place** during hard physical exertion, when you need maximum airflow. That's appropriate; the concern is *habitual* mouth breathing at rest.
- **Watch for mouth breathing at night** — it's common and can fragment sleep. Nasal breathing during sleep is generally more restorative.
- **In slow-breathing practice**, inhale through the nose for the natural pacing (nasal nitric oxide is a proposed extra whose effect size is not established); a mouth exhale is fine for a long, controlled out-breath — the pattern [coherent breathing](/articles/coherent-breathing-guide) and the [physiological sigh](/articles/physiological-sigh) both use.

## See how your breathing shifts you

Because the effect of breathing route shows up in your autonomic balance, you can observe it. ONDA reads your pulse from your phone camera, or your HRV from Apple Health (Apple Watch or another tracker that syncs there), so you can watch how nasal versus mouth breathing changes your heart rhythm in real time with an Apple Watch. Trying it yourself — a minute each way — often makes the difference obvious in your own numbers.
`,
}

export default [article]
