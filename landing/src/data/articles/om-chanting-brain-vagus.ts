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
  title: 'OM Chanting and the Brain: What a Small fMRI Study Found',
  seoTitle: 'OM Chanting, the Amygdala & the Vagus Nerve | ONDA Life',
  description:
    'A small fMRI pilot study found OM chanting was accompanied by quieter activity in the brain’s emotion centers — the amygdala and hippocampus — in a pattern its authors compared to vagus nerve stimulation. What it shows, and what it doesn’t.',
  category: 'ONDA Protocol',
  relatedSlugs: ['humming-breath-vagus', 'bhastrika-pranayama-brain-anxiety', 'vagus-nerve-exercises', 'coherent-breathing-guide'],
  introStyle: 'gold',
  image: '/images/articles/om-chanting-brain-vagus.jpg',
  imageAlt:
    'OM Chanting and the Brain — illustration: a seated figure emitting wide concentric sound-wave rings, a brain above with its deep emotional centre dimming calmly.',
  imageTitle: 'OM Chanting and the Brain',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Let the M hum on a long, slow exhale — no belief required.',
    link: '/articles/humming-breath-vagus',
    linkText: 'Humming breath & the vagus →',
  },
  content: `
OM chanting — the vocalized hum of the ancient Indian mantra — appears to calm the brain's emotion centers, and brain imaging offers a glimpse of how. In an fMRI study, chanting OM was accompanied by significant deactivation of the limbic system: the amygdala (the brain's threat detector), the hippocampus, and the orbitofrontal and cingulate cortex. The authors noted that a similar pattern is reported with clinical [vagus nerve stimulation](/science/evidence/vagus-nerve-stimulation), used medically for depression and epilepsy — suggesting OM chanting may engage related calming circuitry, without any device. When participants made a similar but non-humming sound ("ssss"), the deactivation did not appear — though that sound also differs in breathing, so it does not prove the hum itself is responsible.

## What does OM chanting do to the brain?

In brain imaging, OM chanting quieted the brain's emotional (limbic) regions. The study (Kalyani et al., 2011) scanned volunteers with fMRI while they chanted OM, compared with rest and with a control sound. During OM, researchers observed deactivation — a quieting — across limbic regions on both sides of the brain: the amygdala, hippocampus, parahippocampal gyri, orbitofrontal cortex, anterior cingulate and thalamus. These are regions that generate and process fear, threat and strong emotion.

The control condition is what makes it interesting. Saying "ssss" — similar effort, but without OM's vibrating hum — did not produce the same deactivation. One reading is that the resonant quality of OM matters, but "ssss" also changes how you breathe, so the comparison cannot separate the hum from the breathing. The honest caveat: it was a small pilot study of about a dozen volunteers, and we found no replication, so it is an intriguing signal rather than settled neuroscience.

## Does OM chanting stimulate the vagus nerve?

Possibly — the [vagus nerve](/science/concepts/vagus-nerve) is the leading hypothesis for why humming a syllable would quiet the amygdala. OM produces a strong vibration in the throat and is felt in the ears. The vagus nerve has a branch in the larynx and an auricular branch in the ear, and the authors proposed that OM's vibration stimulates these branches — increasing parasympathetic "rest and digest" activity and quieting the limbic system. That is why they compared the pattern with clinical vagus nerve stimulation (VNS). The comparison is a hypothesis about mechanism, not proof that chanting equals a medical device.

Heart-rhythm research points mostly to the breath: chanting slows breathing, and slow breathing is associated with higher vagally mediated [HRV](/science/concepts/heart-rate-variability) during practice. {{fact:claim.vagalTone}}. See [humming, chanting and Om: what the evidence shows](/science/evidence/humming-and-chanting).

## Why this fits with humming and breath

Mechanically, OM chanting is humming breath with meaning attached. It shares the core of [Bhramari, the humming bee breath](/articles/humming-breath-vagus): vibration in the larynx plus a long, controlled exhale. OM adds resonance and, for many people, the focus a mantra provides. All three — [slow breathing](/science/evidence/slow-breathing), Bhramari and OM — slow the breath; whether the hum or resonant sound adds a separate route has not been shown. OM is the one with a small brain-imaging study behind it. Contrast the fast, activating breath of [Bhastrika](/articles/bhastrika-pranayama-brain-anxiety), which reaches the emotional brain by a very different path. For more everyday options, see [vagus nerve exercises](/articles/vagus-nerve-exercises).

## How do you practice OM chanting?

- **Sit comfortably** with a straight spine and relaxed shoulders.
- **Inhale slowly through the nose**, then chant "OM" on a long, steady exhale — let the "O" open and the "M" hum, feeling the vibration in your throat, chest and head.
- **Make the exhale long** — the extended out-breath adds its own calming effect on top of the vibration.
- **Feel the resonance**, especially the hum of the "M." Some people rest their fingertips near the ears to feel it more.
- **Repeat for several rounds** or a few minutes.

You don't need to attach religious meaning to it — the physiological effect seems to come mainly from the slow, long exhale; the role of the vibration is unproven. Many find the tradition adds depth.

## See your body respond

The calming shift shows up in your heart rhythm. ONDA reads your pulse from your phone camera or Apple Watch, and your HRV from Apple Watch, so you can watch your heart rate settle as you chant on long exhales. You can't see your amygdala on fMRI at home — but you can see the autonomic calm that goes with it.

*Source: Kalyani et al., 2011, International Journal of Yoga — fMRI study of OM chanting. ONDA is a breathing and HRV biofeedback app, not a medical device.*
`,
}

export default [article]
