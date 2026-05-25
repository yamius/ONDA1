import type { ToolReview } from './types'

const sensAi: ToolReview = {
  slug: 'sens-ai',
  name: 'Sens.ai',
  brand: 'Sens.ai',
  category: 'eeg-headset',
  productType: 'Multi-modal headset (EEG + photobiomodulation + HRV)',
  description:
    'ONDA review of Sens.ai — the premium multi-modal headset fusing five-channel EEG with intracranial photobiomodulation and HRV training. Scored on signal, content and value.',
  verdict:
    'The most ambitious multi-modal headset — EEG plus photobiomodulation plus HRV, at a premium price that demands the use case.',
  summary:
    'Sens.ai is the only headset in this list that combines passive measurement (five-channel EEG and HRV) with active intervention (transcranial photobiomodulation — near-infrared light). The programmes layer the three modalities into combined neurofeedback + light + HRV sessions, framed around focus, calm, mood and clarity. Premium positioning with a subscription on top of the $1495 hardware. The right shape only when the multi-modal use case is what you want.',
  overallScore: 7.1,
  scores: [
    { criterionId: 'signal-quality', score: 7.5, note: 'Five-channel dry EEG plus HRV from an ear-clip sensor, plus PBM near-infrared LEDs over the prefrontal cortex. Signal quality consumer-grade across all three modalities.' },
    { criterionId: 'training-content', score: 8.5, note: 'Multi-modal programmes layering EEG neurofeedback, photobiomodulation and HRV training in single 25-minute sessions. No other consumer device offers this combination.' },
    { criterionId: 'insights', score: 8.0, note: 'Per-session post-analysis across all three signals plus aggregate trend data. The strongest cross-modal interpretation in this list.' },
    { criterionId: 'comfort', score: 7.0, note: 'Substantial headset with multiple sensor arrays — heavier than Muse or Crown. Sit-down sessions only; not for movement or sleep.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Polished app with progression tracking. Less mature ecosystem than Muse — the device is newer to market.' },
    { criterionId: 'open-data', score: 5.5, note: 'Limited raw data export; programme is closed-loop by design. Not a developer platform.' },
    { criterionId: 'value', score: 4.5, note: '$1495 hardware plus subscription for full programme access. The most expensive entry in this category.' },
  ],
  pros: [
    'The only headset combining EEG + PBM + HRV in a single device and programme',
    'Strong cross-modal session analysis — three biomarkers on one timeline',
    'Premium hardware build and progression-tracked content',
    'Photobiomodulation evidence base independently real — adds a second intervention to EEG neurofeedback',
  ],
  cons: [
    'The most expensive headset in this list — $1495 plus subscription',
    'Closed-loop data model — not for developers or researchers',
    'Heavy headset — not for overnight wear or movement',
    'Newer market entry — ecosystem less mature than Muse or Emotiv',
  ],
  bestFor: 'Best for users specifically seeking the EEG + photobiomodulation + HRV stack in one device, willing to pay premium.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Sens.ai product documentation, the published photobiomodulation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 1495, note: '$1495 device + subscription for full programmes', asOf: '2026-05-21' },
  link: 'https://www.sens.ai/',
  linkType: 'official',
  content: `## Where it leads

Sens.ai is the only headset in this list that ships as a multi-modal device. Five-channel dry EEG over the scalp, an ear-clip HRV sensor, and an array of near-infrared LEDs over the prefrontal cortex for transcranial photobiomodulation — three independent biomarkers and one independent intervention, woven into a single 25-minute programme. The cross-modal session analysis genuinely uses all three signals; nothing else in the consumer space does this.

## Where it falls short

Price first. At $1495 plus an ongoing programme subscription, Sens.ai is the most expensive entry in this category — more than the Neurosity Crown without the Crown’s developer access. The data model is closed by design; raw export is limited. The headset is also physically substantial, comfortable only in a sit-down session rather than for movement or sleep. For users who want one or two of the modalities but not all three, single-purpose devices are better value.

## Who it is for

Choose Sens.ai if the multi-modal stack — EEG + photobiomodulation + HRV in a single programme — is specifically what you want, and the price is acceptable. If you want EEG alone with the deepest content, Muse S Athena. If you want EEG with open data, Neurosity Crown.

---

## Background reading

The neuroscience these headsets feed back — and the cognitive states the EEG signal reveals.

- [Digital dementia and attentional control](/articles/digital-dementia-attentional-control) — rebuilding attention with feedback-driven practice
- [Neuroplasticity and flow overclocking](/articles/neuroplasticity-flow-overclocking) — EEG signatures of flow states and how they form
- [ACC calibration: cognitive-control protocol](/articles/acc-calibration-protocol-cognitive-control) — how prefrontal control loops show up in EEG
`,
  references: [
    { label: 'Sens.ai — official product page', url: 'https://www.sens.ai/' },
    { label: 'Transcranial photobiomodulation — clinical evidence review (Photonics)', url: 'https://www.mdpi.com/2304-6732/6/3/77' },
  ],
  relatedSlugs: ['neurosity-crown', 'muse-s-athena', 'mendi'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default sensAi
