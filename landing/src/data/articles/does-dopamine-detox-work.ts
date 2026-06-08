import type { Article } from './types'

/**
 * Does a Dopamine Detox Work — companion guide for /tools/dopamine-detox.
 * Question-intent explainer (distinct from the tool's "build a plan" intent),
 * honest myth-vs-mechanism, funnelling to the planner. Reuses verified sources.
 */
const article: Article = {
  slug: 'does-dopamine-detox-work',
  title: 'Does a Dopamine Detox Actually Work? The Honest Answer',
  seoTitle: 'Does a Dopamine Detox Work? (Honest) | ONDA Life',
  description:
    'You can’t detox dopamine — but the practice behind the buzzword works. Here’s what a dopamine detox really is (stimulus control), what the science says, and how to do it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['dopamine', 'prefrontal-cortex', 'limbic-system', 'homeostasis', 'neuroplasticity'],
  introStyle: 'purple',
  image: '/images/does-dopamine-detox-work.png',
  imageAlt:
    'Does a dopamine detox work — the honest answer: you can’t detox dopamine, but stimulus control (cutting cheap-reward loops) genuinely recalibrates focus.',
  imageTitle: '[REWARD_RECALIBRATION]: What a "dopamine detox" actually is — stimulus control, not a cleanse.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Skip the theory and build a reset you’ll actually follow — pick a window and the loops to cut.',
    link: '/tools/dopamine-detox',
    linkText: 'Dopamine Reset Planner →',
  },
  howToSteps: [
    { name: 'Drop the literal "detox" idea', text: 'You are not flushing dopamine. Reframe it as a stimulus-control reset — cutting high-stimulation, low-effort reward loops for a window.', protocolId: 'dd-reframe' },
    { name: 'Pick the loops to cut', text: 'Short-form video, doomscrolling, gaming, porn, junk food, notifications — choose the ones that most hijack your attention.', protocolId: 'dd-pick' },
    { name: 'Replace, don’t just remove', text: 'Fill the gap with slower rewards — walks, reading, deep work, real conversation — so boredom doesn’t pull you back.', protocolId: 'dd-replace' },
    { name: 'Reintroduce deliberately', text: 'Afterward, add inputs back one at a time with limits, instead of bingeing the moment it ends.', protocolId: 'dd-reintroduce' },
  ],
  content: `
## [ AUDITING THE REWARD LOGIC ]

> "'Does a dopamine detox work?' Yes and no — and the gap between them is the whole point. No, you cannot 'detox' or 'reset' [dopamine](/glossary/dopamine) by abstaining for a day; screens don't deplete it and a fast doesn't flush it. But the *practice* hiding under the buzzword does work, because it isn't really about dopamine at all. It's stimulus control: deliberately removing intense, frictionless rewards so your motivation recalibrates toward slower, higher-effort ones. The name is wrong; the behaviour is sound."

---

## Section 1: The myth and the mechanism

The pop version claims your brain is 'overloaded with dopamine' from phones and that a fast resets your baseline. That mechanism isn't real. What *is* real: a diet of intense, low-effort rewards (endless feeds, junk food, gambling-style loops) sensitises your motivation toward those things and dulls it toward ordinary effort (Volkow 2017). Coherent work, reading and exercise start to feel flat by comparison — not because dopamine is 'depleted', but because the bar has been raised.

A 'dopamine detox' helps by *lowering that bar again*. The clinically accurate description is **time-based stimulus control**, a cognitive-behavioural technique — which is exactly how researchers reframed 'dopamine fasting' once the hype outran the science (Fei 2022).

---

## Section 2: So what does the evidence actually support?

- **The literal claims** (resetting receptors, detoxing the molecule): not supported. Major clinical sources are clear the "detox" framing is a myth.
- **The behaviour** (cutting high-stimulation loops for a defined period, then reintroducing deliberately): supported as stimulus control, and low-risk to try.
- **Best evidence-based version:** not a heroic week of monk-like abstinence, but small, repeatable guardrails — a daily morning block off feeds, notifications trimmed, single-tasking restored.

The honest takeaway: do it, but for the right reason and in the right way. It's behaviour change, not a cleanse.

---

## Section 3: How to do it properly

The full step-by-step is in the box on this page; in short — reframe it as stimulus control, pick the specific loops to cut, replace each with a slower reward, and reintroduce deliberately afterward. Forcing relaxation or going cold-turkey on everything tends to backfire; structure beats willpower.

Rather than wing it, the [Dopamine Reset Planner](/tools/dopamine-detox) builds the plan for you — choose a window (morning, 24-hour, weekend, 7-day) and the loops to cut, and it returns the tactics plus the stimulus-control rules that make it stick. For the deeper "why," see [Dopamine Architecture](/articles/dopamine-architecture-mastering-desire).

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Screen-time analytics + subjective focus
> METRIC: Longer focus spans and less reflexive reaching for the phone
> STATUS: REWARD_BASELINE_RECALIBRATING

---

This is an educational behaviour-change guide, not medical advice or treatment for addiction. If a behaviour feels genuinely compulsive and is harming your life, that warrants support from a qualified clinician.
`,
}

export default [article]
