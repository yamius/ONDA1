import type { ToolReview } from './types'

const muse2: ToolReview = {
  slug: 'muse-2',
  name: 'Muse 2',
  brand: 'Interaxon',
  category: 'eeg-headset',
  productType: 'Consumer EEG headband (meditation)',
  description:
    'ONDA review of the Muse 2 — the mature, mass-market EEG meditation headband at half the price of the flagship Athena. Scored on signal, content and value.',
  verdict:
    'The most popular consumer EEG headband — mature content, accessible price, the entry point of the category.',
  summary:
    'Muse 2 is the headband that put consumer EEG meditation on the map. Four dry EEG electrodes plus PPG heart-rate, a mature meditation content library, polished app, and the lowest price in this list outside the budget NeuroSky entry. Older hardware than the Athena and no sleep tracking — but for users who want meditation feedback only, it remains the most cost-effective choice.',
  overallScore: 7.8,
  scores: [
    { criterionId: 'signal-quality', score: 7.5, note: 'Four dry EEG electrodes plus PPG heart rate — adequate consumer signal that holds well in sit-up sessions; lower stability than research wet-electrode systems.' },
    { criterionId: 'training-content', score: 8.5, note: 'Mature meditation library after a decade of releases — calm, focus, breath, body-scan, mood. Less depth than the Athena variant but covers the core daily use case fully.' },
    { criterionId: 'insights', score: 7.5, note: 'Per-session calm / neutral / active percentage plus heart-rate trend; less narrative than the Athena’s analyser. Adequate for tracking practice over months.' },
    { criterionId: 'comfort', score: 7.0, note: 'Rigid headband — comfortable for 10–20 minute meditation sessions but not designed for overnight wear.' },
    { criterionId: 'app-ux', score: 8.0, note: 'Polished iOS/Android app; mature ecosystem with Apple Health integration. UI shows its age in places.' },
    { criterionId: 'open-data', score: 6.5, note: 'Raw-EEG export available via Muse Direct (third-party); first-party SDK limited.' },
    { criterionId: 'value', score: 8.5, note: '$249 hardware, no mandatory subscription — the most cost-effective entry into real consumer EEG meditation feedback.' },
  ],
  pros: [
    'The most popular consumer EEG headband — mature ecosystem and community',
    'Lowest price among genuinely-EEG meditation devices',
    'No mandatory subscription — full features with the device',
    'Heart-rate plus EEG signal in one device',
  ],
  cons: [
    'No sleep tracking — that is the Athena upgrade',
    'Older hardware than Muse S Athena (no fNIRS, no overnight wear)',
    'Limited developer SDK',
    'Rigid band less comfortable than soft-band alternatives',
  ],
  bestFor: 'Best for first-time EEG meditation users who want the most mature consumer device at an accessible price.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Interaxon product documentation, published Muse EEG validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 249, note: 'one-time; no mandatory subscription', asOf: '2026-05-21' },
  link: 'https://choosemuse.com/products/muse-2',
  linkType: 'official',
  content: `## Where it leads

Muse 2 is the device that taught the consumer EEG market what good looks like. The four dry electrodes are not research-grade but they are adequate; the meditation content library is the deepest in the consumer space; the app has been polished through more than a decade of iteration. At $249 it is the cheapest legitimate EEG meditation headband on the market that still has a real ecosystem behind it.

## Where it falls short

Time is the issue. The Muse 2 hardware predates the Athena variant and lacks fNIRS, sleep tracking and overnight wear. For pure meditation use the gap matters less than the price difference suggests — but if you want sleep, you have outgrown this device. The developer SDK is limited, so biohackers wanting raw signal access reach for Neurosity Crown instead.

## Who it is for

Choose Muse 2 if meditation feedback is the only thing you want from an EEG headset and price matters. If you want sleep tracking on top, Muse S Athena. If you want raw EEG data for self-experimentation, Neurosity Crown.

---

## Background reading

The neuroscience these headsets feed back — and the cognitive states the EEG signal reveals.

- [Neuroplasticity and flow overclocking](/articles/neuroplasticity-flow-overclocking) — EEG signatures of flow states and how they form
- [ACC calibration: cognitive-control protocol](/articles/acc-calibration-protocol-cognitive-control) — how prefrontal control loops show up in EEG
- [Adaptation and range fractionation](/articles/adaptation-hack-range-fractionation) — training cognitive states by deliberate variation
`,
  references: [
    { label: 'Muse 2 — official product page', url: 'https://choosemuse.com/products/muse-2' },
    { label: 'Muse EEG headband — independent signal-quality validation (Frontiers in Neuroscience)', url: 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2020.00109/full' },
  ],
  relatedSlugs: ['muse-s-athena', 'focuscalm', 'neurosity-crown'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default muse2
