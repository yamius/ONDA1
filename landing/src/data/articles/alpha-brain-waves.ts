import type { Article } from './types'

/**
 * Explainer for "alpha waves" / "alpha brain waves" / "eeg alpha waves" (GSC 2026-10: ~150 impressions/28d at
 * position ~80, no matching page — owner OK 2026-11-05). Textbook physiology (8–12 Hz, posterior, eyes-closed,
 * blocked by eye opening) plus four reviews and the Muse validation study, all PubMed-verified. Honest ONDA tie:
 * ONDA measures the heart (HRV), not the brain — no EEG claim about the app.
 */
const article: Article = {
  slug: 'alpha-brain-waves',
  title: 'Alpha Brain Waves: What They Are and What They Can (and Cannot) Tell You',
  seoTitle: 'Alpha Brain Waves: What They Are, How to Measure | ONDA Life',
  description:
    'Alpha waves are 8–12 Hz brain rhythms that rise when you close your eyes and relax. What they reflect, what meditation does to them and what a consumer EEG headset can really show.',
  category: 'Neural Hardware',
  relatedSlugs: ['meditation-gamma-waves-experience', 'neural-bridge-alpha-flow-gateway', 'heart-rate-variability'],
  introStyle: 'indigo',
  neuralSuggestion: {
    text: 'Alpha is a brain signal and needs an EEG headset. Your heart gives a calmer, easier daily signal: HRV.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## Quick answer

**Alpha waves are rhythmic electrical brain activity at about 8–12 cycles per second (Hz).** They are strongest over the back of the head when you are awake, relaxed and have your eyes closed, and they shrink the moment you open your eyes or focus on something you see. They are not a "calm mode" you switch on: alpha is better understood as the brain quietening the areas it does not need right now.

## What alpha waves are

An EEG (electroencephalogram) records tiny voltage changes on the scalp produced by large groups of neurons firing in step. Those changes form rhythms, named by speed: delta (slowest), theta, **alpha (about 8–12 Hz)**, beta and gamma (fastest).

Alpha was the first human brain rhythm ever recorded. The German psychiatrist Hans Berger described it in 1929, which is why the drop in alpha when the eyes open is still called the **Berger effect** or "alpha blocking".

Three facts are well established:

- **Where:** alpha is largest over the occipital and parietal regions (back of the head), the visual areas.
- **When:** it is strongest in relaxed, eyes-closed wakefulness and falls with eye opening, visual attention and mental effort.
- **Whose:** each person has their own peak alpha frequency. It differs between people and tends to slow with age ([Klimesch, 1999](https://pubmed.ncbi.nlm.nih.gov/10209231/)).

## What alpha actually reflects

For decades alpha was called an "idling" rhythm. The current view is more precise: alpha reflects **active inhibition**. When a brain region is not needed for the task at hand, its alpha rises, which helps route processing to the regions that are needed ([Jensen & Mazaheri, 2010](https://pubmed.ncbi.nlm.nih.gov/21119777/)). That is why alpha over the visual cortex rises when you close your eyes and why it can rise over one side of the brain while you pay attention to the other side of space.

So "more alpha" does not simply mean "more relaxed" or "better". It depends on where it is measured, what you are doing and how it is calculated. Researchers use several different alpha measures (absolute power, relative power, peak frequency, change from rest to task), and they do not always agree ([Bazanova & Vernon, 2014](https://pubmed.ncbi.nlm.nih.gov/23701947/)).

## Alpha waves and meditation

Meditation is the most common reason people ask about alpha. A systematic review of 56 EEG studies of mindfulness found that **increased alpha and theta power were the most common finding**, in healthy people and in patient groups, but the studies were small and varied widely in methods, so the authors could not draw firm conclusions about what drives the change ([Lomas, Ivtzan & Fu, 2015](https://pubmed.ncbi.nlm.nih.gov/26441373/)).

The honest summary: meditation often goes along with more alpha, but a high alpha reading is not proof that you meditated "well", and a low one is not proof that you failed.

## Can a consumer EEG headset measure alpha?

Yes, roughly. Consumer headsets such as Muse, Neurosity Crown or Emotiv pick up real brain signals through a few dry electrodes. A validation study showed that the four-channel Muse could record classic event-related brain responses comparable to a research system ([Krigolson et al., 2017](https://pubmed.ncbi.nlm.nih.gov/28344546/)).

The limits matter:

- **Few channels, wrong place.** Alpha is largest at the back of the head; many consumer headsets sit on the forehead and behind the ears.
- **Artefacts.** Blinks, jaw clenching and movement create signals far larger than alpha.
- **Proprietary scores.** "Calm" or "focus" numbers are each company's own algorithm, not a validated alpha measure, and they cannot be compared between brands.

If you want to try, see our [best EEG headsets](/reviews/compare/best-eeg-headsets-2026) and [Neurosity Crown alternatives](/reviews/compare/neurosity-crown-alternatives).

## Can you "train" alpha waves?

Alpha neurofeedback, where a device rewards you when your alpha rises, is one of the oldest neurofeedback protocols. People can learn to change their alpha in the session. Whether that change brings lasting benefits for stress, focus or sleep is far less certain, and the research uses many different protocols. Treat claims that a device will "boost your alpha" for a specific health benefit with caution.

## A simpler daily signal

Alpha needs a headset, a quiet room and careful interpretation. If your real goal is to see how calm or recovered your body is, heart rate variability (HRV) is easier to measure every day with a ring, a watch or even a phone camera. [ONDA](/how-it-works) works with HRV and breathing; it does not measure brain waves.

*This article is for education and is not medical advice. An EEG for a medical question (seizures, sleep disorders) is a clinical test and is read by a doctor.*
`,
}

export default [article]
