import type { Article } from './types'

/**
 * OM chanting + the brain: fMRI study (Kalyani et al., 2011, International Journal of Yoga) — limbic
 * deactivation (amygdala, hippocampus, parahippocampal gyri, OFC, ACC, thalamus) during OM vs rest;
 * "ssss" control did not show it; authors compared the pattern with vagus nerve stimulation. HONEST:
 * small study (~12 volunteers); vagal route is the authors' hypothesis. Draft's "later HD-EEG/NIRS"
 * claim dropped (not verified). Sibling of humming-breath-vagus. camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'om-chanting-brain-vagus',
  title: 'OM Chanting and the Brain: How Sacred Sound Calms the Amygdala',
  seoTitle: 'OM Chanting, the Amygdala & the Vagus Nerve | ONDA Life',
  description:
    'An fMRI study found OM chanting quiets the brain’s emotion centers — the amygdala and hippocampus — in a pattern its authors compared to vagus nerve stimulation. The science of how sacred sound calms the mind.',
  category: 'ONDA Protocol',
  relatedSlugs: ['humming-breath-vagus', 'bhastrika-pranayama-brain-anxiety', 'vagus-nerve-exercises', 'coherent-breathing-guide'],
  introStyle: 'gold',
  image: '/images/articles/om-chanting-brain-vagus.jpg',
  imageAlt:
    'OM Chanting and the Brain — illustration: a seated figure emitting wide concentric sound-wave rings, a brain above with its deep emotional centre dimming calmly.',
  imageTitle: 'OM Chanting and the Brain',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Let the M hum. The vibration and the long exhale do the work — no belief required.',
    link: '/articles/humming-breath-vagus',
    linkText: 'Humming breath & the vagus →',
  },
  content: `
OM chanting — the vocalized hum of the ancient Indian mantra — appears to calm the brain's emotion centers, and brain imaging offers a glimpse of how. In an fMRI study, chanting OM was accompanied by significant deactivation of the limbic system: the amygdala (the brain's threat detector), the hippocampus, and the orbitofrontal and cingulate cortex. The authors noted that a similar pattern is reported with clinical vagus nerve stimulation, used medically for depression and epilepsy — suggesting OM chanting may engage related calming circuitry, without any device. And when participants made a similar but non-humming sound ("ssss"), the deactivation did not appear, pointing to the resonant hum itself.

## What the brain imaging found

The study (Kalyani et al., 2011) scanned volunteers with fMRI while they chanted OM, compared with rest and with a control sound. During OM, researchers observed deactivation — a quieting — across limbic regions on both sides of the brain: the amygdala, hippocampus, parahippocampal gyri, orbitofrontal cortex, anterior cingulate and thalamus. These are regions that generate and process fear, threat and strong emotion.

The control condition is what makes it interesting. Saying "ssss" — similar effort, but without OM's vibrating hum — did not produce the same deactivation. That suggests the effect isn't just from making a sound or from the effort of vocalizing, but from the resonant quality of OM. The honest caveat: it was a small study of about a dozen volunteers, so it is an intriguing signal rather than settled neuroscience.

## The vagus nerve connection

Why would humming a syllable quiet the amygdala? The leading hypothesis is the vagus nerve. OM produces a strong vibration in the throat and is felt in the ears. The vagus nerve has a branch in the larynx and an auricular branch in the ear, and the authors proposed that OM's vibration stimulates these branches — shifting autonomic balance toward parasympathetic "rest and digest" and quieting the limbic system. That is why they compared the pattern with clinical vagus nerve stimulation (VNS). The comparison is a hypothesis about mechanism, not proof that chanting equals a medical device.

Heart-rhythm research fits the picture: studies of OM chanting and humming report increases in high-frequency HRV, the marker associated with vagal (parasympathetic) activity.

## Why this fits with humming and breath

Mechanically, OM chanting is humming breath with meaning attached. It shares the core of [Bhramari, the humming bee breath](/articles/humming-breath-vagus): vibration in the larynx plus a long, controlled exhale. OM adds resonance and, for many people, the focus a mantra provides. If slow breathing calms through pace and Bhramari through hum, OM adds a third route — resonant sound — and it's the one with brain-imaging work behind it. Contrast the fast, activating breath of [Bhastrika](/articles/bhastrika-pranayama-brain-anxiety), which reaches the emotional brain by a very different path. For more everyday options, see [vagus nerve exercises](/articles/vagus-nerve-exercises).

## How to practice OM chanting

- **Sit comfortably** with a straight spine and relaxed shoulders.
- **Inhale slowly through the nose**, then chant "OM" on a long, steady exhale — let the "O" open and the "M" hum, feeling the vibration in your throat, chest and head.
- **Make the exhale long** — the extended out-breath adds its own calming effect on top of the vibration.
- **Feel the resonance**, especially the hum of the "M." Some people rest their fingertips near the ears to feel it more.
- **Repeat for several rounds** or a few minutes.

You don't need to attach religious meaning to it — the physiological effect comes from the vibration and the long exhale, though many find the tradition adds depth.

## See your body respond

The calming shift shows up in your heart rhythm. ONDA reads your pulse from your phone camera or Apple Watch, and your HRV from Apple Watch, so you can watch your heart rate settle as you chant on long exhales. You can't see your amygdala on fMRI at home — but you can see the autonomic calm that goes with it.

*Source: Kalyani et al., 2011, International Journal of Yoga — fMRI study of OM chanting. ONDA is a breathing and HRV biofeedback app, not a medical device.*
`,
}

export default [article]
