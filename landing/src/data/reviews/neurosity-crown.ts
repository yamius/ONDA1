import type { ToolReview } from './types'

const neurosityCrown: ToolReview = {
  slug: 'neurosity-crown',
  name: 'Neurosity Crown',
  brand: 'Neurosity',
  category: 'eeg-headset',
  productType: 'Developer-focused EEG headset (focus, flow)',
  description:
    'ONDA review of the Neurosity Crown — the developer-and-biohacker EEG headset with eight dry electrodes and the most open SDK in the consumer market. Scored on signal, openness and value.',
  verdict:
    'The best EEG headset for developers and biohackers — open SDK, raw data, focus-music streaming. Premium price.',
  summary:
    'Neurosity Crown is the headset built for people who want to do something with the data, not just see it summarised. Eight dry EEG electrodes, the most open SDK in the consumer category (JavaScript, Python, Swift), raw-signal export, and a built-in focus-music streaming feature that adapts in real time to detected mental state. Premium hardware at premium price; the right pick for engineers, researchers and biohackers — the wrong shape for a casual meditation user.',
  overallScore: 7.6,
  scores: [
    { criterionId: 'signal-quality', score: 8.5, note: 'Eight dry EEG electrodes at multiple cortical sites — the most channels in the consumer category. Signal quality holds well in seated focus sessions.' },
    { criterionId: 'training-content', score: 6.5, note: 'Less guided content than Muse; the product bets on adaptive focus-music streaming plus user-built apps. Not a meditation library.' },
    { criterionId: 'insights', score: 8.0, note: 'Live focus, calm and flow scores, plus EEG band breakdowns. Strong real-time visualisation; less narrative session summarisation than Muse.' },
    { criterionId: 'comfort', score: 7.5, note: 'A rigid crown — comfortable for focus sessions, not designed for overnight wear or moving sessions.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Neurosity Console and Shift apps. Polished, but the UX assumes a more technical user than Muse.' },
    { criterionId: 'open-data', score: 9.5, note: 'The most open SDK in this category — JavaScript, Python and Swift APIs, raw-EEG access, no subscription required for data. Developer-first by design.' },
    { criterionId: 'value', score: 6.5, note: '$1,399 hardware, no mandatory subscription. Premium pricing — three times the cost of Muse S Athena.' },
  ],
  pros: [
    'The most open SDK in the consumer EEG market — raw data via JavaScript, Python or Swift',
    'Eight dry EEG electrodes — the most cortical coverage in this list',
    'Adaptive focus-music streaming based on detected mental state',
    'No mandatory subscription',
  ],
  cons: [
    'Premium price — three times the cost of Muse S Athena',
    'No deep meditation content library — bring your own',
    'Rigid crown — not comfortable for overnight wear',
    'UX assumes a more technical user than consumer-meditation alternatives',
  ],
  bestFor: 'Best for developers, researchers and biohackers who want raw EEG data and a programmable platform.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Neurosity product documentation, the published Neurosity SDK reference and independent 2026 developer reviews. Not hands-on tested by ONDA.',
  price: { usd: 1399, note: 'one-time; no subscription required for SDK or raw data', asOf: '2026-05-21' },
  link: 'https://neurosity.co/crown',
  linkType: 'official',
  content: `## Where it leads

Neurosity Crown is the EEG headset for people who would rather write code than press buttons. Eight dry electrodes give it the broadest cortical coverage in the consumer space — beyond Muse’s four — and the SDK is genuinely first-class: raw-EEG streaming over JavaScript, Python and Swift, no subscription gate, no proprietary middle layer. The built-in focus-music streaming adapts to the live signal in real time, which is the user-facing demo of what the platform can do; the deeper value is everything you can build on top of it.

## Where it falls short

Almost everything Muse leads on. There is no deep guided-meditation library, no sleep tracking, no soft band for overnight wear, and the price is roughly three times Muse S Athena’s. For a user who just wants meditation feedback, the Crown is the wrong shape — overbuilt and underprogrammed for that use case.

## Who it is for

Choose Neurosity Crown if you are a developer, researcher or hands-on biohacker who wants raw EEG data on a programmable platform with no subscription tax. If you want a polished consumer experience for meditation and sleep, Muse S Athena. If you want a budget-friendly EEG entry, Muse 2 or NeuroSky.

---

## Background reading

The neuroscience these headsets feed back — and the cognitive states the EEG signal reveals.

- [ACC calibration: cognitive-control protocol](/articles/acc-calibration-protocol-cognitive-control) — how prefrontal control loops show up in EEG
- [Adaptation and range fractionation](/articles/adaptation-hack-range-fractionation) — training cognitive states by deliberate variation
- [Idle-state alpha rhythms](/articles/idle-state-alpha-rhythms) — the resting cortex signal that meditation and focus headsets exploit
`,
  references: [
    { label: 'Neurosity Crown — official product page', url: 'https://neurosity.co/crown' },
    { label: 'Neurosity SDK — developer documentation', url: 'https://docs.neurosity.co/' },
  ],
  relatedSlugs: ['muse-s-athena', 'emotiv-insight-2', 'muse-2'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default neurosityCrown
