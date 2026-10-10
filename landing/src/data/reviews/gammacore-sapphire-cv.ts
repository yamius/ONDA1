import type { ToolReviewInput } from './types'

const gammacoreSapphireCv: ToolReviewInput = {
  slug: 'gammacore-sapphire-cv',
  name: 'gammaCore Sapphire CV',
  brand: 'electroCore',
  category: 'vagus-stim',
  productType: 'Prescription cervical tVNS (handheld)',
  description:
    'ONDA review of the gammaCore Sapphire CV — the FDA-cleared prescription cervical tVNS device for migraine and cluster headache. Scored on evidence, mechanism and value.',
  verdict:
    'The FDA-cleared medical reference for non-invasive cervical VNS — a clinical tool, not a consumer wellness device.',
  summary:
    'gammaCore is the only non-invasive vagus nerve stimulator with FDA clearance for headache disorders — migraine (prevention and acute treatment, age 12+), cluster headache, paroxysmal hemicrania and hemicrania continua. It is a handheld device pressed against the side of the neck over the carotid artery, delivering a proprietary 5 kHz waveform burst for 2-minute sessions. Available by prescription only. Within its indications it is the most evidence-backed device in this list — and it is priced and gated accordingly.',
  scores: [
    { criterionId: 'evidence', score: 8.5, note: 'FDA-cleared for migraine prevention and acute treatment (age 12+), cluster headache, paroxysmal hemicrania and hemicrania continua. The pivotal randomised trials were sponsored by electroCore, and maker-sponsored studies do not count as evidence in ONDA scores; independent trials remain, so it is still the clinical reference for non-invasive cervical VNS.' },
    { criterionId: 'mechanism', score: 8.5, note: 'Cervical tVNS over the carotid sheath — targets the cervical vagal trunk directly. Proprietary 5 kHz burst waveform; parameters are fixed, not user-adjustable.' },
    { criterionId: 'protocols', score: 5.5, note: 'Two-minute fixed sessions, dose set by prescriber. No programme variety — by design, since dosing is clinically calibrated.' },
    { criterionId: 'comfort', score: 7.0, note: 'Handheld and ergonomic; the user controls placement and intensity. Some users report neck discomfort or jaw twitches at higher amplitudes.' },
    { criterionId: 'biofeedback', score: 5.0, note: 'Counts and logs sessions on-device. No HRV measurement or external integration.' },
    { criterionId: 'value', score: 5.5, note: 'Prescription pricing varies — typically ~$600 device plus refill cards; insurance coverage uneven. Not a casual purchase.' },
  ],
  pros: [
    'FDA-cleared — the only non-invasive VNS device with that status',
    'The deepest randomised-trial evidence base of any device here',
    'Targets the cervical vagal trunk directly, not the auricular branch',
    'Clinically calibrated dosing — no guesswork',
  ],
  cons: [
    'Prescription-only in the US; gated by a physician',
    'Indications limited to headache disorders (migraine, cluster headache, paroxysmal hemicrania, hemicrania continua)',
    'No customisable protocols — fixed 2-minute sessions',
    'Cost varies by payer; refill model can lock you in',
  ],
  bestFor: 'Best for clinically-indicated migraine or cluster-headache patients — the medical reference for cervical VNS.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from electroCore clinical documentation, FDA-cleared labelling, and the published gammaCore randomised-trial record. Not hands-on tested by ONDA.',
  price: { usd: 600, note: 'prescription required; refill cards extra', asOf: '2026-05-21' },
  link: 'https://www.gammacore.com/',
  linkType: 'official',
  content: `## Where it leads

gammaCore Sapphire CV is the only non-invasive [vagus nerve](/glossary/vagus-nerve) stimulator with FDA clearance — a fact that puts it in a different regulatory tier from everything else in this list. It is cleared for migraine prevention and acute treatment (from age 12), cluster-headache acute and preventive treatment, and the rarer headache disorders paroxysmal hemicrania and hemicrania continua, backed by more than thirty randomised controlled trials over the past decade. The device is held against the side of the neck over the carotid sheath and delivers a proprietary 5 kHz burst waveform for two-minute sessions; dosing is set clinically rather than by app.

## What are the downsides of gammaCore Sapphire CV?

That same regulatory and clinical rigour limits its use. It is prescription-only, its indications are headache-specific, and there is no programme variety: dose, duration and waveform are fixed. It does not measure HRV, does not integrate with any health app, and at roughly six hundred dollars before refill cards it is expensive even before insurance enters the picture. As a wellness or general-recovery tool it is the wrong shape — Truvaga 350, made by the same company, exists for exactly that use case.

## Who should buy gammaCore Sapphire CV?

Choose gammaCore if you have a clinical migraine or cluster-headache diagnosis and a prescriber who will write for it. For general HRV training, stress reduction or experimental tVNS, Nurosym (auricular, evidence-backed) or Truvaga 350 (cervical, OTC) are the right tools — not this one.

---

## Background reading

The biology behind what these devices target — and the protocols that compound with the hardware.

- [CO₂ tolerance and the oxygen limit](/articles/co2-tolerance-expanding-oxygen-limit) — why slow breathing rebuilds vagal tone via CO₂ chemistry
- [Breathwork as a command-line interface](/articles/breathwork-command-line-interface) — the protocols stimulation pairs with
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — why vagal tone work targets cortisol downstream
`,
  references: [
    { label: 'gammaCore — official product page', url: 'https://www.gammacore.com/' },
    { label: 'FDA 510(k) clearance — non-invasive vagus nerve stimulator for migraine', url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K173442' },
    { label: 'Silberstein et al. 2016 — Non-invasive vagus nerve stimulation for the acute treatment of cluster headache: findings from the randomized, double-blind, sham-controlled ACT1 study (Headache)', url: 'https://doi.org/10.1111/head.12896' },
  ],
  relatedSlugs: ['truvaga-350', 'nurosym', 'livanova-vns-therapy'],
  faq: [
    { q: "Do you need a prescription for gammaCore?", a: "Yes. In the US, gammaCore Sapphire CV is prescription-only, so access is gated by a physician. It is the only non-invasive vagus nerve stimulator with FDA clearance, and that clearance covers migraine (prevention and acute treatment, age 12+), cluster headache, paroxysmal hemicrania and hemicrania continua, not general wellness use." },
    { q: "How much does gammaCore cost?", a: "gammaCore costs around $600, with refill cards extra. The actual cost varies by payer, and the refill model can lock you in over time. Because a prescription is required, you get it through a physician rather than as a simple retail purchase." },
    { q: "How does gammaCore work?", a: "gammaCore is a handheld device you press against the side of the neck over the carotid artery. It delivers a proprietary 5 kHz waveform burst in fixed 2-minute sessions, targeting the cervical vagal trunk directly rather than the ear branch. Dosing is clinically calibrated, with no customisable protocols." },
    { q: "Is gammaCore worth it?", a: "For clinically indicated migraine or cluster-headache patients, yes: it has the deepest randomised-trial evidence base of any device in its category. For general stress relief or wellness it is the wrong tool, because it is a clinical device with narrow indications and prescription gating." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-10-10',
}

export default gammacoreSapphireCv
