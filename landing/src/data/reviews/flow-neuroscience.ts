import type { ToolReviewInput } from './types'

const flowNeuroscience: ToolReviewInput = {
  slug: 'flow-neuroscience',
  name: 'Flow Neuroscience',
  brand: 'Flow Neuroscience',
  category: 'eeg-headset',
  productType: 'FDA-approved (PMA) and CE-marked tDCS headset for depression (prescription-only in the US)',
  description:
    'ONDA review of Flow Neuroscience — the FDA-approved, CE-marked tDCS headset for major depression, combining transcranial direct-current stimulation with a structured behavioural-therapy app. Scored on evidence, programmes and value.',
  verdict:
    'Not EEG — clinical tDCS for depression, with the strongest regulatory and trial backing in this list.',
  summary:
    'Flow Neuroscience is a Swedish-built tDCS (transcranial direct-current stimulation) headset paired with a structured cognitive-behavioural programme app, indicated for major depression. CE-marked as a Class IIa medical device in the EU and prescribed within the UK NHS in some pathways; in the US it received FDA premarket approval (PMA P230024, 8 December 2025) for moderate-to-severe major depression in adults who are not treatment-resistant, and has been available by prescription only (in person or via telehealth) since September 2026. Not EEG — Flow stimulates, not measures — but lives in the consumer brain-training buying conversation. The clinical reference for take-home tDCS in this list.',
  scores: [
    { criterionId: 'signal-quality', score: 7.5, note: 'tDCS — transcranial direct-current stimulation over the dorsolateral prefrontal cortex (the kind used in clinical trials). Disclosed stimulation parameters (2 mA, 30-minute sessions); CE-marked Class IIa medical device.' },
    { criterionId: 'training-content', score: 8.0, note: 'Structured 8-week behavioural-therapy programme paired with stimulation sessions — the strongest content scaffolding in this list because it is built around a clinical protocol.' },
    { criterionId: 'insights', score: 6.0, note: 'Mood and adherence tracking against validated scales (PHQ-9). Less granular than EEG headsets — Flow tracks symptoms, not brain signal.' },
    { criterionId: 'comfort', score: 7.0, note: 'Rigid headset; 30-minute seated sessions. Some users report a transient scalp tingle or itch during stimulation — well-documented and reversible.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Polished app with daily check-ins and adherence tracking.' },
    { criterionId: 'open-data', score: 4.0, note: 'Closed platform — clinical programme design, not a developer environment.' },
    { criterionId: 'value', score: 5.5, note: '£399 (~$499) hardware plus monthly therapy-app subscription in the UK. NHS routes available in some UK regions reduce out-of-pocket cost. US price not yet published.' },
  ],
  pros: [
    'FDA premarket approval (Dec 2025) plus CE-marked Class IIa medical device — the strongest regulatory backing in this list',
    'Real randomised-trial evidence for depression (including a fully remote randomised sham-controlled trial published in Nature Medicine (Woodham 2024))',
    'Integrated 8-week behavioural-therapy programme — structured content',
    'Prescribed within parts of the UK NHS as a depression-pathway option',
  ],
  cons: [
    'Not EEG — Flow stimulates rather than measures, included for editorial completeness',
    'Indication restricted to major depression; prescription-only in the US',
    'Monthly subscription on top of the hardware cost',
    'Closed platform — no developer access or raw data',
  ],
  bestFor: 'Reference clinical tDCS — for users with major depression who want a take-home device with regulatory and trial backing.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Flow Neuroscience product documentation, the published Flow tDCS trial record and independent 2026 reviews. Not hands-on tested by ONDA. Included as the clinical tDCS reference point in this category.',
  price: { usd: 499, note: '£399 UK device + monthly therapy-app subscription; US: prescription-only, price not yet published', asOf: '2026-05-21' },
  link: 'https://www.flowneuroscience.com/',
  linkType: 'official',
  content: `## Where it leads

Flow Neuroscience is the clinical reference for take-home tDCS — the most regulated, most trial-backed device in this list. CE-marked as a Class IIa medical device in the EU, granted FDA premarket approval (PMA P230024, 8 December 2025) for moderate-to-severe major depression in adults (not treatment-resistant), paired with a structured eight-week behavioural-therapy programme, and prescribed within parts of the UK NHS as a depression-pathway option. Since September 2026 it has been available across the US by prescription only, after an in-person or telehealth evaluation. The published randomised-trial evidence for tDCS in major depression is real and growing; Flow’s contribution is packaging that into a take-home protocol patients actually complete.

## What are the downsides of Flow Neuroscience?

It is not an EEG headset. Flow stimulates the dorsolateral prefrontal cortex with 2 mA of direct current; it does not measure brain activity. Indication is restricted to major depression — for general focus, meditation or sleep, Flow is the wrong tool. The platform is closed, the price includes a monthly therapy-app subscription on top of the hardware, and outside the UK NHS pathways the full cost is out-of-pocket. In the US, Flow has not yet published a price or an insurance pathway.

## Who should buy Flow Neuroscience?

Choose Flow Neuroscience if you have major depression and a clinician open to discussing it as a take-home option — in the US it requires a prescription, and it is a treatment to use under clinical guidance, not a replacement for care. For general brain training, meditation feedback or sleep tracking, this is the wrong category — Muse S Athena and the EEG-based devices are the right shape. Flow is included here as the clinical reference for what regulated, trial-backed brain-targeted hardware looks like.

---

## Background reading

Background on the brain systems behind mood and attention. Flow stimulates the brain with a weak current; it does not record EEG.

- [Digital dementia and attentional control](/articles/digital-dementia-attentional-control) — rebuilding attention with feedback-driven practice
- [Neuroplasticity and flow overclocking](/articles/neuroplasticity-flow-overclocking) — what flow states are and how they form
- [ACC calibration: cognitive-control protocol](/articles/acc-calibration-protocol-cognitive-control) — the prefrontal control loops behind cognitive control
`,
  references: [
    { label: 'Flow Neuroscience — official site', url: 'https://www.flowneuroscience.com/' },
    { label: 'FDA premarket approval P230024 — Flow FL-100', url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpma/pma.cfm?id=P230024' },
    { label: 'Woodham RD et al. (2024). Home-based tDCS for major depressive disorder: a fully remote phase 2 randomized sham-controlled trial. Nature Medicine', url: 'https://doi.org/10.1038/s41591-024-03305-y' },
  ],
  relatedSlugs: ['myndlift', 'sens-ai', 'muse-s-athena'],
  faq: [
    { q: "Is Flow Neuroscience an EEG headset?", a: "No. Flow Neuroscience is a tDCS headset: it stimulates the brain with direct current rather than measuring brain activity. It is indicated for major depression, CE-marked as a Class IIa medical device in the EU, FDA-approved in the US (prescription-only), and paired with a structured cognitive-behavioural programme app." },
    { q: "How much does Flow Neuroscience cost?", a: "In the UK, Flow costs £399 (about $499) for the device, plus a monthly subscription for the therapy app. In the US it is prescription-only and Flow has not yet published a price. That subscription covers the integrated 8-week behavioural-therapy programme. Budget for both, because the ongoing app fee sits on top of the hardware price." },
    { q: "Does Flow Neuroscience work for depression?", a: "Flow has real randomised-trial evidence for depression, including a fully remote randomised sham-controlled trial published in Nature Medicine (Woodham 2024), it is prescribed within parts of the UK NHS as a depression-pathway option, and in December 2025 the FDA approved it for moderate-to-severe major depression in adults. That gives it the strongest regulatory and trial backing in its category, though its indication is restricted to major depression." },
    { q: "Who is Flow Neuroscience best for?", a: "Flow is best for people with major depression who want a take-home device with regulatory and trial backing. It is a poor fit for general brain training or tinkering: the platform is closed, with no developer access or raw data, and it is not indicated for anything beyond depression." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-09-30',
}

export default flowNeuroscience
