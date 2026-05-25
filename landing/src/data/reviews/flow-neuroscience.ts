import type { ToolReview } from './types'

const flowNeuroscience: ToolReview = {
  slug: 'flow-neuroscience',
  name: 'Flow Neuroscience',
  brand: 'Flow Neuroscience',
  category: 'eeg-headset',
  productType: 'CE-marked tDCS headset (depression, prescribed in some markets)',
  description:
    'ONDA review of Flow Neuroscience — the CE-marked tDCS headset for major depression, combining transcranial direct-current stimulation with a structured behavioural-therapy app. Scored on evidence, programmes and value.',
  verdict:
    'Not EEG — clinical tDCS for depression, with the strongest regulatory and trial backing in this list.',
  summary:
    'Flow Neuroscience is a Swedish-built tDCS (transcranial direct-current stimulation) headset paired with a structured cognitive-behavioural programme app, indicated for major depression. CE-marked as a Class IIa medical device in the EU and prescribed within the UK NHS in some pathways. Not EEG — Flow stimulates, not measures — but lives in the consumer brain-training buying conversation. The clinical reference for take-home tDCS in this list.',
  overallScore: 6.7,
  scores: [
    { criterionId: 'signal-quality', score: 7.5, note: 'tDCS — clinical-grade transcranial direct-current stimulation over the dorsolateral prefrontal cortex. Disclosed stimulation parameters (2 mA, 30-minute sessions); CE-marked Class IIa medical device.' },
    { criterionId: 'training-content', score: 8.0, note: 'Structured 8-week behavioural-therapy programme paired with stimulation sessions — the strongest content scaffolding in this list because it is built around a clinical protocol.' },
    { criterionId: 'insights', score: 6.0, note: 'Mood and adherence tracking against validated scales (PHQ-9). Less granular than EEG headsets — Flow tracks symptoms, not brain signal.' },
    { criterionId: 'comfort', score: 7.0, note: 'Rigid headset; 30-minute seated sessions. Some users report a transient scalp tingle or itch during stimulation — well-documented and reversible.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Polished app with daily check-ins and clinical-grade adherence tracking.' },
    { criterionId: 'open-data', score: 4.0, note: 'Closed platform — clinical programme design, not a developer environment.' },
    { criterionId: 'value', score: 5.5, note: '£399 (~$499) hardware plus monthly therapy-app subscription. NHS routes available in some UK regions reduce out-of-pocket cost.' },
  ],
  pros: [
    'CE-marked Class IIa medical device — the strongest regulatory backing in this list',
    'Real randomised-trial evidence for depression (published in Brain Stimulation and elsewhere)',
    'Integrated 8-week behavioural-therapy programme — clinical-grade content scaffold',
    'Prescribed within parts of the UK NHS as a depression-pathway option',
  ],
  cons: [
    'Not EEG — Flow stimulates rather than measures, included for editorial completeness',
    'Indication restricted to major depression',
    'Monthly subscription on top of the hardware cost',
    'Closed platform — no developer access or raw data',
  ],
  bestFor: 'Reference clinical tDCS — for users with major depression who want a take-home device with regulatory and trial backing.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Flow Neuroscience product documentation, the published Flow tDCS trial record and independent 2026 reviews. Not hands-on tested by ONDA. Included as the clinical tDCS reference point in this category.',
  price: { usd: 499, note: '£399 device + monthly therapy-app subscription', asOf: '2026-05-21' },
  link: 'https://www.flowneuroscience.com/',
  linkType: 'official',
  content: `## Where it leads

Flow Neuroscience is the clinical reference for take-home tDCS — the most regulated, most trial-backed device in this list. CE-marked as a Class IIa medical device in the EU, paired with a structured eight-week behavioural-therapy programme, and prescribed within parts of the UK NHS as a depression-pathway option. The published randomised-trial evidence for tDCS in major depression is real and growing; Flow’s contribution is packaging that into a take-home protocol patients actually complete.

## Where it falls short

It is not an EEG headset. Flow stimulates the dorsolateral prefrontal cortex with 2 mA of direct current; it does not measure brain activity. Indication is restricted to major depression — for general focus, meditation or sleep, Flow is the wrong tool. The platform is closed, the price includes a monthly therapy-app subscription on top of the hardware, and outside the UK NHS pathways the full cost is out-of-pocket.

## Who it is for

Choose Flow Neuroscience if you have major depression and a clinician open to discussing it as a take-home option. For general brain training, meditation feedback or sleep tracking, this is the wrong category — Muse S Athena and the EEG-based devices are the right shape. Flow is included here as the clinical reference for what regulated, trial-backed brain-targeted hardware looks like.

---

## Background reading

The neuroscience these headsets feed back — and the cognitive states the EEG signal reveals.

- [Digital dementia and attentional control](/articles/digital-dementia-attentional-control) — rebuilding attention with feedback-driven practice
- [Neuroplasticity and flow overclocking](/articles/neuroplasticity-flow-overclocking) — EEG signatures of flow states and how they form
- [ACC calibration: cognitive-control protocol](/articles/acc-calibration-protocol-cognitive-control) — how prefrontal control loops show up in EEG
`,
  references: [
    { label: 'Flow Neuroscience — official site', url: 'https://www.flowneuroscience.com/' },
    { label: 'Home-based tDCS for major depression — randomised trial (The Lancet Digital Health)', url: 'https://www.thelancet.com/journals/landig/article/PIIS2589-7500(23)00077-X/fulltext' },
  ],
  relatedSlugs: ['myndlift', 'sens-ai', 'muse-s-athena'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default flowNeuroscience
