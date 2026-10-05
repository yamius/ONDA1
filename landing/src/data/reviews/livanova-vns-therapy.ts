import type { ToolReview } from './types'

const livanovaVnsTherapy: ToolReview = {
  slug: 'livanova-vns-therapy',
  name: 'LivaNova VNS Therapy (SenTiva)',
  brand: 'LivaNova',
  category: 'vagus-stim',
  productType: 'Implanted VNS (surgical, prescription)',
  description:
    'ONDA review of LivaNova VNS Therapy (SenTiva) — the implanted vagus nerve stimulator used for drug-resistant epilepsy and treatment-resistant depression. Reference medical device.',
  verdict:
    'The reference implanted VNS device — the clinical gold standard, not a consumer purchase.',
  summary:
    'LivaNova VNS Therapy is the implanted vagus nerve stimulator that defined the modern VNS category. A pulse generator is surgically placed under the collarbone and wired to the left cervical vagus nerve; programming is done by a clinician. FDA-approved for drug-resistant epilepsy since 1997 and treatment-resistant depression since 2005. Included here as the medical reference point for understanding what non-invasive devices can and cannot replicate.',
  overallScore: 8.0,
  scores: [
    { criterionId: 'evidence', score: 9.8, note: 'Twenty-plus years of FDA-approved use, hundreds of peer-reviewed studies, patient-outcome registry data on more than 5,000 patients. The reference VNS evidence base.' },
    { criterionId: 'mechanism', score: 9.5, note: 'Direct electrical stimulation of the cervical vagus nerve via surgically-implanted lead — the most direct stimulation possible. Programmable duty cycle, amplitude and frequency.' },
    { criterionId: 'protocols', score: 8.5, note: 'Clinician-programmed continuous duty cycle plus closed-loop AutoStim (responsive to heart-rate changes in seizure prediction). Not user-adjustable by design.' },
    { criterionId: 'comfort', score: 5.0, note: 'Surgical implant; post-operative scar and possible voice/throat side effects during stimulation. Lifetime device.' },
    { criterionId: 'biofeedback', score: 8.0, note: 'AutoStim variant uses on-device ECG-based seizure-prediction biofeedback. Programmer-side session telemetry.' },
    { criterionId: 'value', score: 4.5, note: 'Procedure typically $25,000–30,000 plus implant; covered by insurance for cleared indications. Not a consumer purchase.' },
  ],
  pros: [
    'The clinical gold standard for VNS — twenty-plus years of evidence',
    'Direct stimulation of the cervical vagus nerve — the most efficacious approach',
    'FDA-approved for drug-resistant epilepsy and treatment-resistant depression',
    'AutoStim closed-loop variant uses real-time biofeedback',
  ],
  cons: [
    'Surgical implant — not a consumer device',
    'Restricted to clinically-indicated patients with prescribing specialist',
    'Voice change and throat discomfort during stimulation are common',
    'Procedure costs are insurance-mediated; not directly purchasable',
  ],
  bestFor: 'Reference medical device for understanding what non-invasive consumer VNS can and cannot replicate.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from LivaNova clinical documentation, FDA-approved labelling and the published VNS Therapy registry literature. Included as the medical reference point for the category, not as a consumer recommendation.',
  price: { usd: 27500, note: 'procedure + device; typically insurance-covered for indicated conditions', asOf: '2026-05-21' },
  link: 'https://www.livanova.com/epilepsy-vnstherapy/en-us',
  linkType: 'official',
  content: `## Where it leads

LivaNova VNS Therapy is included in this list as the reference point — the implanted device that every non-invasive vagus stimulator is trying to approximate at one degree of indirection. A pulse generator the size of a small pocket watch is surgically placed under the left collarbone and wired to the cervical vagus nerve; the device fires on a clinician-programmed duty cycle and (in the SenTiva variant) closes the loop with on-device ECG-based seizure prediction. The evidence base is overwhelming: FDA-approved since 1997 for drug-resistant epilepsy and since 2005 for treatment-resistant depression, with hundreds of peer-reviewed studies; in the manufacturer's patient-outcome registry (5,554 patients), the share of responders rose from 49% in the first 4 months to 63% at 2–4 years, though only about 8% became seizure-free (Englot 2016).

## What are the downsides of LivaNova VNS Therapy (SenTiva)?

It is a surgical implant. The patient pathway is a neurosurgeon, a hospital procedure, post-operative recovery, lifetime carriage of the device, and the well-documented intermittent side effects — voice change and throat discomfort during stimulation cycles. It is restricted to clinically-indicated patients with prescribing specialist sign-off, and costs are insurance-mediated rather than directly purchasable.

## Who should buy LivaNova VNS Therapy (SenTiva)?

Not a consumer recommendation. LivaNova VNS Therapy is the gold-standard medical device for drug-resistant epilepsy and treatment-resistant depression — the right tool for the people meeting those criteria, prescribed by a specialist. For everyone else, non-invasive cervical (gammaCore, Truvaga) or auricular (Nurosym, Vagustim) devices approximate the mechanism without surgery, at known cost to the strength of the effect.

---

## Background reading

The biology behind what these devices target — and the protocols that compound with the hardware.

- [CO₂ tolerance and the oxygen limit](/articles/co2-tolerance-expanding-oxygen-limit) — why slow breathing rebuilds vagal tone via CO₂ chemistry
- [Breathwork as a command-line interface](/articles/breathwork-command-line-interface) — the protocols stimulation pairs with
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — why vagal tone work targets cortisol downstream
`,
  references: [
    { label: 'LivaNova VNS Therapy — official clinical site', url: 'https://www.livanova.com/epilepsy-vnstherapy/en-us' },
    { label: 'FDA — VNS Therapy approval history', url: 'https://www.accessdata.fda.gov/cdrh_docs/pdf/P970003S207B.pdf' },
    { label: 'Englot et al. 2016 — Rates and predictors of seizure freedom with vagus nerve stimulation for intractable epilepsy (VNS Therapy Patient Outcome Registry, 5,554 patients; Neurosurgery)', url: 'https://doi.org/10.1227/NEU.0000000000001165' },
  ],
  relatedSlugs: ['gammacore-sapphire-cv', 'nurosym', 'truvaga-350'],
  faq: [
    { q: "What is LivaNova VNS Therapy (SenTiva)?", a: "LivaNova VNS Therapy (SenTiva) is a surgically implanted device that directly stimulates the cervical vagus nerve. It is FDA-approved for drug-resistant epilepsy and treatment-resistant depression, and is restricted to clinically indicated patients with a prescribing specialist. It is not a consumer device, and decisions about it belong with that specialist." },
    { q: "How much does LivaNova VNS Therapy cost?", a: "The listed reference cost is around $27,500 for the procedure plus device, typically insurance-covered for indicated conditions. It cannot be bought directly: costs are insurance-mediated and access runs through a prescribing specialist, so the price a patient sees depends on their coverage rather than a retail price." },
    { q: "What are the downsides of LivaNova VNS Therapy?", a: "The main downsides are that it is a surgical implant rather than a consumer device, it is limited to clinically indicated patients with a prescribing specialist, and voice change and throat discomfort during stimulation are common. Procedure costs are insurance-mediated, so it is not directly purchasable." },
    { q: "How does LivaNova VNS compare with consumer VNS devices?", a: "LivaNova is the clinical gold standard for VNS, with twenty-plus years of evidence and direct cervical vagus stimulation, the most efficacious approach. The review treats it as a reference point for understanding what non-invasive consumer VNS devices can and cannot replicate, not as an alternative you choose off the shelf." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default livanovaVnsTherapy
