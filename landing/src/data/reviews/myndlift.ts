import type { ToolReview } from './types'

const myndlift: ToolReview = {
  slug: 'myndlift',
  name: 'Myndlift',
  brand: 'Myndlift',
  category: 'eeg-headset',
  productType: 'Clinical neurofeedback at home (prescribed)',
  description:
    'ONDA review of Myndlift — the clinically-prescribed remote neurofeedback platform that lets licensed providers run real EEG neurofeedback at home. Scored on signal, programmes and value.',
  verdict:
    'The most clinically-credible neurofeedback platform — gated by a licensed provider, with real protocols and real outcomes.',
  summary:
    'Myndlift is not a consumer headset — it is a clinical neurofeedback platform a licensed mental-health provider prescribes and supervises remotely. The headset (typically the Muse 2 hardware or, with the channel extender, multi-site EEG) runs clinician-designed protocols for ADHD, anxiety, sleep and trauma; the data flows back to the provider, who adjusts the programme. The reference clinical neurofeedback offering in the consumer-adjacent space — included as the medical benchmark for what real neurofeedback looks like.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'signal-quality', score: 7.5, note: 'Uses Muse 2 hardware by default; the multi-site channel extender adds research-relevant electrode placements. Adequate consumer-grade signal under clinician interpretation.' },
    { criterionId: 'training-content', score: 8.5, note: 'Real clinical neurofeedback protocols for ADHD, anxiety, sleep, depression and post-traumatic stress — designed by the supervising licensed provider, not by an app.' },
    { criterionId: 'insights', score: 8.0, note: 'Sessions reviewed and adjusted by the licensed provider; outcome tracking includes both EEG metrics and validated symptom scales (e.g. ASRS, GAD-7).' },
    { criterionId: 'comfort', score: 6.5, note: 'Inherits the Muse 2 headband form factor — comfortable for 20-minute sit-down sessions, not designed for sleep or movement.' },
    { criterionId: 'app-ux', score: 7.0, note: 'Patient-side app is functional rather than polished — built around clinician-set programmes rather than self-directed exploration.' },
    { criterionId: 'open-data', score: 5.0, note: 'Closed clinical platform — data flows to the provider, not the patient. Not a developer environment.' },
    { criterionId: 'value', score: 5.0, note: '$300–$600/month depending on provider plus device cost. Insurance coverage varies; expensive for self-pay.' },
  ],
  pros: [
    'The most clinically-credible neurofeedback option in the consumer-adjacent space',
    'Programmes designed and adjusted by a licensed mental-health provider',
    'Outcome tracking against validated symptom scales',
    'Multi-site channel extender available for richer EEG protocols',
  ],
  cons: [
    'Requires a licensed clinical provider — not directly purchasable as a consumer',
    'Expensive ($300–$600/month) with patchy insurance coverage',
    'Closed data platform — no raw access for the patient',
    'Patient-side app functional rather than polished',
  ],
  bestFor: 'Reference clinical neurofeedback — for patients with a diagnosed condition and a licensed prescribing provider.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Myndlift product documentation, the published clinical neurofeedback literature and independent 2026 reviews. Not hands-on tested by ONDA. Included as the medical reference point for the category, not as a direct consumer recommendation.',
  price: { usd: 450, note: '$300–$600/mo via licensed provider; insurance varies', asOf: '2026-05-21' },
  link: 'https://www.myndlift.com/',
  linkType: 'official',
  content: `## Where it leads

Myndlift is the clinical reference for what neurofeedback can be when an actual clinician designs the protocol and adjusts it week by week. The patient wears a Muse 2 headband (or the multi-site channel extender for richer EEG), runs sessions at home, and the data flows back to the licensed supervising provider — who tunes the protocol, tracks symptom scales (ASRS for ADHD, GAD-7 for anxiety) and reports outcomes. It is the only platform in this category whose pedigree rests on supervised clinical use rather than consumer self-direction.

## Where it falls short

You cannot buy it directly. Access is gated by a licensed mental-health provider who has Myndlift in their practice; the monthly cost ($300–$600) reflects clinical supervision rather than just hardware and software. The data model is closed by design — raw EEG access does not flow back to the patient. As a consumer biohacker tool it is the wrong shape; as a clinical tool with diagnosed need, it is the most defensible option in this list.

## Who it is for

Choose Myndlift if you have a diagnosed condition (ADHD, anxiety, post-traumatic stress, sleep disorder) and a licensed mental-health provider willing to prescribe and supervise. For self-directed brain training, Muse S Athena or Neurosity Crown are the right consumer shapes; Myndlift is the clinical reference point in the same category.`,
  references: [
    { label: 'Myndlift — official site', url: 'https://www.myndlift.com/' },
    { label: 'Remote neurofeedback for ADHD — clinical evidence (Frontiers in Human Neuroscience)', url: 'https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2019.00091/full' },
  ],
  relatedSlugs: ['muse-2', 'flow-neuroscience', 'sens-ai'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default myndlift
