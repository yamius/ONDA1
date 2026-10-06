import type { Article } from './types'

/**
 * Cold exposure → sympathetic shock spike; cold on the face → diving-response vagal brake (HRV up DURING, not after); breath is the control
 * knob. Ties to ONDA practices + coherence/HRV + the cold-plunge reviews (physiology article the
 * review cluster lacks). Firewall: practice + safety (cold-shock/gasp, heart conditions → clinician).
 * Grounded (science/evidence/cold-exposure): RMSSD rises during diving-response triggers, not post-exposure; controlled breathing
 * blunts the cold-shock response. No fabricated numbers.
 */
const article: Article = {
  slug: 'cold-exposure-vagus-nerve',
  title: 'Cold and the Vagus Nerve: Why a Cold Shower Resets Your Nervous System',
  seoTitle: 'Cold Exposure & the Vagus Nerve: What Happens | ONDA Life',
  description:
    'A cold shower hits like an alarm — then leaves you strangely calm. Cold on the skin triggers a sympathetic spike; cold on the face slows the heart through the vagus nerve, and the breath is the knob you control. The physiology, and how to use it.',
  category: 'OS States',
  relatedSlugs: ['vagus-nerve', 'heart-rate-variability', 'coherent-breathing-guide', 'co2-tolerance-expanding-oxygen-limit', 'anxiety-panic-breathing-hrv'],
  introStyle: 'blue',
  image: '/images/articles/cold-exposure-vagus-nerve.webp',
  imageAlt:
    "Figure under a cold cascade with the vagus nerve lit down the spine, a sympathetic spike then the vagal brake of the diving response.",
  imageTitle: "Cold and the vagus nerve — sympathetic spike, then vagal brake",
  imageCaption:
    "Cold exposure and the vagus nerve — a sympathetic spike, the vagal brake of the diving response, and how the breath is the knob controlling both.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Cold is a stressor you choose — and the breath is how you stay in charge of it. That’s the whole skill.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: THE ALARM THAT LEAVES YOU CALM ]

> "The first second of cold water is an emergency. The breath catches, the heart bangs, the whole body screams to get out. And then — a minute later, back in the warm — something unexpected: a wide, clear calm you didn't have before.

> That whiplash from alarm to calm isn't random. It's two branches of your nervous system handing off, and if you know what's happening, you can ride it on purpose."

---

## Section 1: What does cold shock do to your body?

Cold hitting the skin triggers the **cold-shock response**: an immediate [sympathetic](/glossary/sympathetic-nervous-system) surge. Heart rate jumps, blood vessels clamp, and — most importantly — you gasp. That involuntary gasp and the rapid breathing that follows are the dangerous part of cold exposure, because a gasp underwater is how cold water kills. On dry land in a shower it's harmless, but it's the same reflex: the body treating cold as a threat and flooding the system with *go*.

This is real stress, deliberately chosen. Which is exactly what makes it trainable.

---

## Section 2: How is cold exposure linked to the vagus nerve?

Cold on the face does something different from cold on the skin: it triggers the diving response, in which the [vagus nerve](/glossary/vagus-nerve) slows the heart through the [parasympathetic](/glossary/parasympathetic-nervous-system) branch. Across studies of these diving-response triggers, vagally mediated [heart rate variability](/glossary/heart-rate-variability) rose during the exposure but not afterwards ([what the evidence on cold exposure shows](/science/evidence/cold-exposure)). So a post-cold "vagal rebound" has not been shown: the calm many people feel afterwards is a real experience, but a higher reading in the cold does not mean your resting HRV has changed.

Picture it as an image, not a measurement: a stress-and-settle cycle in a few minutes. That repeating it trains the vagus nerve or your recovery has not been shown.

---

## Section 3: How should you breathe during cold exposure?

The whole practice hinges on one thing: **controlling the gasp.** The cold's power over you lives in that panicked first breath. If you can meet the water and keep your breathing slow and deliberate instead of gasping, you stay ahead of the cold-shock response — you keep the [sympathetic](/glossary/sympathetic-nervous-system) spike from bootstrapping into panic, and the breath stays under your control.

This is the same skill as any breath-based regulation: a slow, controlled breath is the manual override on an autonomic alarm. Cold just turns the alarm way up, which makes it superb *training* for staying calm under a real stressor — see the acute version in [anxiety, panic and the breath](/articles/anxiety-panic-breathing-hrv), and the breathing tolerance it builds in [CO₂ tolerance](/articles/co2-tolerance-expanding-oxygen-limit).

---

## Section 4: Where ONDA fits — and the safety line

ONDA doesn't run your cold shower, but it trains the exact skill the cold demands and lets you watch your heart rhythm while you breathe. The [breathing practices](/hrv-biofeedback) build the slow, controlled breath that keeps you ahead of the gasp; with an Apple Watch, the live [coherence](/glossary/coherence) feedback shows your heart rhythm organising as you steady the breath — the same vagal control you're trying to hold in the water. Practice the calm breath warm, and it's there when the cold tries to take it.

Now the safety line, and it's not optional. The cold-shock gasp is a genuine drowning risk in open water — never cold-plunge alone or in water you can't easily exit. Cold is a real cardiovascular stressor: **if you have a heart condition, high blood pressure, are pregnant, or have any medical concern, talk to a doctor before deliberate cold exposure.** ONDA is a self-regulation tool, not a medical device, and none of this is medical advice.

---

## Section 5: Using it well

Start small and end cold: thirty seconds at the end of a warm shower is a real dose. Meet the water with a long, slow exhale — decide your first breath before it hits — and keep the breathing deliberate rather than letting it run ragged. Come out and notice how you feel, but treat any calm as your experience, not as proof that you have trained the vagus nerve. Keep it brief, keep it regular, and keep the breath in charge the whole time.

> **The Hack:** The cold's grip is in the gasp. Meet the water with one long, slow exhale and refuse to let the breath go ragged — control that first breath and the panic reflex no longer runs the show. With repeated exposures, the cold-shock response itself becomes smaller.

> [ SYSTEM_STATUS ]
> SPIKE: cold-shock = sympathetic surge + involuntary gasp
> VAGAL BRAKE: cold on the face slows the heart; HRV rises during exposure, not after
> KNOB: slow controlled breath governs the whole cycle
> SAFETY: never alone in open water · heart condition → doctor first
`,
  howToSteps: [
    {
      name: 'Understand the two phases',
      text: 'Cold on the skin triggers a sympathetic spike (racing heart, involuntary gasp); cold on the face triggers the diving response, which slows the heart through the vagus nerve. Vagally mediated HRV rises during the exposure, not afterwards — a post-cold “vagal rebound” has not been shown.',
      protocolId: 'cold-phases',
    },
    {
      name: 'Control the first breath',
      text: 'The cold’s power is in the gasp. Decide your first breath before the water hits and meet it with a long, slow exhale — keeping the breath deliberate stops the spike from becoming panic.',
      protocolId: 'cold-breath',
    },
    {
      name: 'Train the breath warm first',
      text: 'Practice slow, controlled breathing and watch it settle your rhythm before you ever get cold. The skill you build warm is the one that keeps you calm in the water.',
      protocolId: 'cold-train',
    },
    {
      name: 'Respect the safety limits',
      text: 'Never cold-plunge alone or in water you can’t exit — the gasp is a drowning risk. Cold is a cardiovascular stressor: with a heart condition, high blood pressure, pregnancy or any medical concern, clear it with a doctor first.',
      protocolId: 'cold-safety',
    },
  ],
}

export default [article]
