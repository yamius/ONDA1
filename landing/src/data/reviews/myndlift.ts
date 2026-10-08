import type { ToolReviewInput } from './types'

const myndlift: ToolReviewInput = {
  slug: 'myndlift',
  name: 'Myndlift',
  brand: 'Myndlift',
  category: 'eeg-headset',
  productType: 'Clinical neurofeedback at home (prescribed)',
  description:
    'ONDA review of Myndlift — the clinically-prescribed remote neurofeedback platform that lets licensed providers supervise EEG neurofeedback at home. Scored on signal, programmes and value.',
  verdict:
    'Clinician-supervised neurofeedback at home — gated by a licensed provider, with set protocols and symptom tracking.',
  summary:
    'Myndlift is not a consumer headset — it is a clinical neurofeedback platform a licensed mental-health provider prescribes and supervises remotely. The headset (typically the Muse 2 hardware or, with the channel extender, multi-site EEG) runs clinician-designed protocols for ADHD, anxiety, sleep and trauma; the data flows back to the provider, who adjusts the programme. The reference clinician-supervised neurofeedback offering in the consumer-adjacent space — included to show what supervised neurofeedback looks like, not as proof that it works.',
  scores: [
    { criterionId: 'signal-quality', score: 7.5, note: 'Uses Muse 2 hardware by default; the multi-site channel extender adds research-relevant electrode placements. Adequate consumer-grade signal under clinician interpretation.' },
    { criterionId: 'training-content', score: 8.5, note: 'Clinic-style neurofeedback protocols for ADHD, anxiety, sleep, depression and post-traumatic stress — designed by the supervising licensed provider, not by an app. Evidence for these uses is mixed to negative in blinded trials.' },
    { criterionId: 'insights', score: 8.0, note: 'Sessions reviewed and adjusted by the licensed provider; outcome tracking includes both EEG metrics and validated symptom scales (e.g. ASRS, GAD-7).' },
    { criterionId: 'comfort', score: 6.5, note: 'Inherits the Muse 2 headband form factor — comfortable for 20-minute sit-down sessions, not designed for sleep or movement.' },
    { criterionId: 'app-ux', score: 7.0, note: 'Patient-side app is functional rather than polished — built around clinician-set programmes rather than self-directed exploration.' },
    { criterionId: 'open-data', score: 5.0, note: 'Closed clinical platform — data flows to the provider, not the patient. Not a developer environment.' },
    { criterionId: 'value', score: 5.0, note: '$300–$600/month depending on provider plus device cost. Insurance coverage varies; expensive for self-pay.' },
  ],
  pros: [
    'The only option in this category supervised by a licensed clinician',
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
  bestFor: 'Clinician-supervised neurofeedback — for patients with a diagnosed condition and a licensed prescribing provider.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Myndlift product documentation, the published clinical neurofeedback literature and independent 2026 reviews. Not hands-on tested by ONDA. Included as the medical reference point for the category, not as a direct consumer recommendation.',
  price: { usd: 450, note: '$300–$600/mo via licensed provider; insurance varies', asOf: '2026-05-21' },
  link: 'https://www.myndlift.com/',
  linkType: 'official',
  content: `## Where it leads

Myndlift is the clinical reference for what neurofeedback can be when an actual clinician designs the protocol and adjusts it week by week. The patient wears a Muse 2 headband (or the multi-site channel extender for richer EEG), runs sessions at home, and the data flows back to the licensed supervising provider — who tunes the protocol and tracks symptom scales (ASRS for ADHD, GAD-7 for anxiety). Myndlift states that its programmes improve those symptoms; independent trials of this specific platform are not yet published, and a meta-analysis of neurofeedback trials for ADHD found benefits on symptom ratings by unblinded assessors, usually parents, but not on probably-blinded ratings (Cortese 2016). A 2025 meta-analysis again found no significant improvement on probably-blinded ratings (Westwood 2025), and a double-blind trial in children found no advantage over sham feedback (Neurofeedback Collaborative Group 2021); in insomnia, real and sham feedback helped equally (Schabus 2017). See [EEG neurofeedback: what the evidence shows](/science/evidence/eeg-neurofeedback). It is the only platform in this category whose pedigree rests on supervised clinical use rather than consumer self-direction.

## What are the downsides of Myndlift?

You cannot buy it directly. Access is gated by a licensed mental-health provider who has Myndlift in their practice; the monthly cost ($300–$600) reflects clinical supervision rather than just hardware and software. The data model is closed by design — raw EEG access does not flow back to the patient. As a consumer biohacker tool it is the wrong shape; as a clinical tool with diagnosed need, it is the only option in this list with clinician supervision.

## Who should buy Myndlift?

Choose Myndlift if you have a diagnosed condition (ADHD, anxiety, post-traumatic stress, sleep disorder) and a licensed mental-health provider willing to prescribe and supervise, and treat it as an addition to established treatment, not a replacement for it. For self-directed brain training, Muse S Athena or Neurosity Crown are the right consumer shapes; Myndlift is the clinical reference point in the same category.

---

## Background reading

The neuroscience these headsets feed back — and what the EEG signal can and cannot tell you about mental states.

- [Cognitive architecture: nootropic stacks](/articles/cognitive-architecture-nootropic-stacks) — what nootropic stacks can and cannot do, and why headset scores cannot show their effect
- [Digital dementia and attentional control](/articles/digital-dementia-attentional-control) — rebuilding attention with feedback-driven practice
- [Neuroplasticity and flow overclocking](/articles/neuroplasticity-flow-overclocking) — what flow states are and how they form
`,
  references: [
    { label: 'Myndlift — official site', url: 'https://www.myndlift.com/' },
    { label: 'Cortese et al. 2016 — Neurofeedback for attention-deficit/hyperactivity disorder: meta-analysis of clinical and neuropsychological outcomes from randomized controlled trials (J Am Acad Child Adolesc Psychiatry)', url: 'https://doi.org/10.1016/j.jaac.2016.03.007' },
  ],
  relatedSlugs: ['muse-2', 'flow-neuroscience', 'sens-ai'],
  faq: [
    { q: "Is Myndlift worth it?", a: "Myndlift is worth it for patients with a diagnosed condition working with a licensed prescribing provider. It is the only option in this category supervised by a clinician, with provider-designed programmes and symptom tracking on validated scales, but blinded trials in ADHD show little or no specific benefit from neurofeedback. It is not directly purchasable as a consumer product." },
    { q: "How much does Myndlift cost?", a: "Myndlift typically costs $300 to $600 per month through a licensed provider, and insurance coverage varies and is often patchy. It is not sold directly to consumers, so the provider sets up and adjusts the programme." },
    { q: "What are the downsides of Myndlift?", a: "Myndlift requires a licensed clinical provider, costs $300 to $600 per month with patchy insurance coverage, keeps data on a closed platform with no raw access for the patient, and has a patient-side app that is functional rather than polished." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default myndlift
