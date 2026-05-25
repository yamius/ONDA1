import type { ToolReview } from './types'

const mendi: ToolReview = {
  slug: 'mendi',
  name: 'Mendi',
  brand: 'Mendi',
  category: 'eeg-headset',
  productType: 'fNIRS prefrontal brain-training headband',
  description:
    'ONDA review of Mendi — the prefrontal-cortex fNIRS (not EEG) headband with game-based neurofeedback training. Scored on signal, content and value.',
  verdict:
    'Not EEG — fNIRS prefrontal training in a simple game-based form. Easy to use, narrowly focused.',
  summary:
    'Mendi is a Swedish-built headband that measures prefrontal cortex blood-oxygenation via fNIRS (functional near-infrared spectroscopy) rather than EEG, and feeds the signal into a game-based neurofeedback experience: keep the ball flying by sustaining attention to your forehead activity. Included here because it is in the consumer brain-training buying conversation even though the modality is different. Simpler than EEG, easier to learn, narrower in scope.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'signal-quality', score: 6.5, note: 'fNIRS optodes over the prefrontal cortex — measures blood-oxygenation changes rather than electrical activity. Single-region measurement, simpler than EEG but less informationally rich.' },
    { criterionId: 'training-content', score: 7.5, note: 'Game-based neurofeedback: a ball rises with sustained prefrontal activity. Simple programme, no meditation library, no sleep — pure focus training.' },
    { criterionId: 'insights', score: 7.0, note: 'Per-session focus scores plus aggregate trend data. Less analytical depth than EEG-based devices.' },
    { criterionId: 'comfort', score: 8.0, note: 'Simple forehead band — comfortable for 10–15 minute sessions, easy to put on and remove.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Polished iOS/Android app with clean game-driven session flow.' },
    { criterionId: 'open-data', score: 5.0, note: 'Closed system — no raw data export or SDK. Not a developer platform.' },
    { criterionId: 'value', score: 7.5, note: '$299 hardware, no subscription required. Cheaper than Muse S Athena, more expensive than Muse 2.' },
  ],
  pros: [
    'Game-based neurofeedback — easiest learning curve in the category',
    'Single forehead band — most comfortable form factor for focus sessions',
    'No subscription required',
    'fNIRS gives a different signal modality from EEG — useful if EEG has not worked for you',
  ],
  cons: [
    'Not EEG — fNIRS is a different (and narrower) signal',
    'Single-region measurement only (prefrontal cortex)',
    'No meditation library or sleep tracking',
    'Closed data platform — no developer access',
  ],
  bestFor: 'Best for users seeking the simplest neurofeedback experience focused purely on prefrontal attention training.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Mendi product documentation, the published fNIRS neurofeedback literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 299, note: 'one-time; no subscription', asOf: '2026-05-21' },
  link: 'https://www.mendi.io/',
  linkType: 'official',
  content: `## Where it leads

Mendi is the gentlest entry into neurofeedback. The fNIRS sensor on the forehead measures blood-oxygenation changes in the prefrontal cortex — a different signal from EEG, simpler to interpret — and feeds it into a single game: a ball rises as you sustain prefrontal activity, falls as you lose focus. There is nothing else to learn. Sessions are short, the app is clean, and the device is the most comfortable in this list.

## Where it falls short

Mendi is also the narrowest entry. fNIRS is not EEG — different modality, different interpretation, single-region measurement only — and the platform offers no meditation library, no sleep tracking, no developer access. For users who want anything beyond pure prefrontal attention training, Mendi is the wrong shape.

## Who it is for

Choose Mendi if the simplest possible neurofeedback experience is exactly what you want, or if EEG-based devices have not produced a clear signal for you and a different modality is worth trying. For meditation breadth, Muse S Athena or Muse 2. For real EEG with developer access, Neurosity Crown or Emotiv Insight 2.

---

## Background reading

The neuroscience these headsets feed back — and the cognitive states the EEG signal reveals.

- [Cognitive architecture: neural throughput](/articles/cognitive-architecture-neural-throughput) — reading EEG as the bandwidth signal of your cognitive system
- [Cognitive architecture: nootropic stacks](/articles/cognitive-architecture-nootropic-stacks) — why EEG is the closest consumer-measurable proxy for nootropic effects
- [Digital dementia and attentional control](/articles/digital-dementia-attentional-control) — rebuilding attention with feedback-driven practice
`,
  references: [
    { label: 'Mendi — official product page', url: 'https://www.mendi.io/' },
    { label: 'fNIRS neurofeedback — clinical review (NeuroImage)', url: 'https://www.sciencedirect.com/science/article/pii/S1053811919309668' },
  ],
  relatedSlugs: ['muse-s-athena', 'focuscalm', 'sens-ai'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default mendi
