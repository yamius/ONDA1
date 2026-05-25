import type { ToolReview } from './types'

const emotivInsight2: ToolReview = {
  slug: 'emotiv-insight-2',
  name: 'Emotiv Insight 2',
  brand: 'Emotiv',
  category: 'eeg-headset',
  productType: 'Research-consumer hybrid EEG headset (5 channels)',
  description:
    'ONDA review of the Emotiv Insight 2 — the five-channel consumer-research EEG headset with an established academic toolchain. Scored on signal, content and value.',
  verdict:
    'The research-consumer hybrid — five channels and a real academic toolchain, gated by a subscription for raw data.',
  summary:
    'Emotiv Insight 2 is the consumer arm of Emotiv’s research line, sitting between Neurosity Crown’s developer focus and Muse’s meditation orientation. Five EEG electrodes, an established academic toolchain (EmotivPRO is used in hundreds of published studies), and live cognitive-performance metrics including focus, stress, engagement and excitement. The catch is the data model: raw-EEG access requires the Pro tier subscription.',
  overallScore: 7.2,
  scores: [
    { criterionId: 'signal-quality', score: 8.0, note: 'Five semi-dry EEG electrodes — middle ground between Muse (4 dry) and Crown (8 dry). Signal stable in seated sessions.' },
    { criterionId: 'training-content', score: 6.0, note: 'Modest guided content; Emotiv positions the device as a measurement instrument rather than a content platform.' },
    { criterionId: 'insights', score: 7.5, note: 'Live cognitive-performance metrics — focus, stress, engagement, excitement, interest, relaxation. Stronger live analytics than Muse, lighter session summaries.' },
    { criterionId: 'comfort', score: 7.0, note: 'Lightweight five-arm crown design. Adequate for 30–60 minute sessions; not designed for overnight wear.' },
    { criterionId: 'app-ux', score: 7.0, note: 'Emotiv App and EmotivPRO web dashboard. UX is functional but reflects the research lineage — more granular than Muse, less polished than Athena.' },
    { criterionId: 'open-data', score: 9.0, note: 'Open SDK and EmotivPRO export for raw EEG — used in hundreds of published academic studies. Pro tier subscription required to unlock raw access.' },
    { criterionId: 'value', score: 6.5, note: '$499 hardware plus Pro subscription (~$99/year) for raw-data access. Less expensive than Crown, more expensive than Muse 2.' },
  ],
  pros: [
    'Five EEG channels — better cortical coverage than Muse, simpler than Crown',
    'EmotivPRO toolchain has the deepest academic-research validation',
    'Live cognitive-performance metrics across six dimensions',
    'Established SDK with multiple language bindings',
  ],
  cons: [
    'Raw-data access requires Pro subscription — feels like double-paying',
    'Modest guided-content library compared with Muse',
    'UX reflects research lineage — less polished than consumer alternatives',
    'No sleep tracking',
  ],
  bestFor: 'Best for researchers and serious self-experimenters who want academic-grade EEG toolchain at consumer pricing.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Emotiv product documentation, the EmotivPRO academic-publication record and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 499, note: '$499 device + ~$99/year Pro for raw-data access', asOf: '2026-05-21' },
  link: 'https://www.emotiv.com/products/insight',
  linkType: 'official',
  content: `## Where it leads

Emotiv Insight 2 occupies the sliver of the EEG market between consumer and research. Five semi-dry electrodes is more than Muse and fewer than Crown, the academic toolchain (EmotivPRO) is the most-cited in this category by a wide margin, and the live cognitive-performance metrics — focus, stress, engagement, excitement, interest, relaxation — are the strongest multi-dimensional readout in the consumer space. For a hobbyist who wants to do real EEG analysis without buying medical-grade gear, this is the right shape.

## Where it falls short

The data model. Raw-EEG access requires the EmotivPRO subscription on top of the $499 hardware purchase, which feels like double-paying compared to Neurosity Crown’s SDK-included model. Guided content is modest — Emotiv treats the device as an instrument, not a content platform. And there is no sleep tracking.

## Who it is for

Choose Emotiv Insight 2 if you want a research-grade toolchain at consumer pricing and the subscription-for-raw-data trade is acceptable. If raw data without subscription is the deciding criterion, Neurosity Crown. If meditation content is the deciding criterion, Muse S Athena or Muse 2.

---

## Background reading

The neuroscience these headsets feed back — and the cognitive states the EEG signal reveals.

- [Acetylcholine as the attention lens](/articles/acetylcholine-lens-neuro-mechanics) — the neurochemistry behind focus that EEG resolves
- [Cognitive architecture: neural throughput](/articles/cognitive-architecture-neural-throughput) — reading EEG as the bandwidth signal of your cognitive system
- [Cognitive architecture: nootropic stacks](/articles/cognitive-architecture-nootropic-stacks) — why EEG is the closest consumer-measurable proxy for nootropic effects
`,
  references: [
    { label: 'Emotiv Insight 2 — official product page', url: 'https://www.emotiv.com/products/insight' },
    { label: 'EmotivPRO academic-publication index', url: 'https://www.emotiv.com/publications' },
  ],
  relatedSlugs: ['neurosity-crown', 'muse-s-athena', 'neurosky-mindwave-mobile-2'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default emotivInsight2
