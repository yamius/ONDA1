import type { ToolReview } from './types'

const gammacoreSapphireCv: ToolReview = {
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
    'gammaCore is the only non-invasive vagus nerve stimulator with FDA clearance for migraine and cluster-headache treatment. It is a handheld device pressed against the side of the neck over the carotid artery, delivering a proprietary 5 kHz waveform burst for 2-minute sessions. Available by prescription only. Within its indications it is the most evidence-backed device in this list — and it is priced and gated accordingly.',
  overallScore: 8.4,
  scores: [
    { criterionId: 'evidence', score: 9.7, note: 'FDA-cleared for migraine prevention and cluster-headache acute/preventive treatment; 30+ randomised trials. The clinical reference for non-invasive cervical VNS.' },
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
    'Indication limited to migraine and cluster headache',
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

gammaCore Sapphire CV is the only non-invasive vagus nerve stimulator with FDA clearance — a fact that puts it in a different regulatory tier from everything else in this list. It is cleared for migraine prevention, episodic-migraine acute treatment, and cluster-headache acute and preventive treatment, backed by more than thirty randomised controlled trials over the past decade. The device is held against the side of the neck over the carotid sheath and delivers a proprietary 5 kHz burst waveform for two-minute sessions; dosing is set clinically rather than by app.

## Where it falls short

That same regulatory and clinical rigour limits its use. It is prescription-only, its indications are headache-specific, and there is no programme variety: dose, duration and waveform are fixed. It does not measure HRV, does not integrate with any health app, and at roughly six hundred dollars before refill cards it is expensive even before insurance enters the picture. As a wellness or general-recovery tool it is the wrong shape — Truvaga 350, made by the same company, exists for exactly that use case.

## Who it is for

Choose gammaCore if you have a clinical migraine or cluster-headache diagnosis and a prescriber who will write for it. For general HRV training, stress reduction or experimental tVNS, Nurosym (auricular, evidence-backed) or Truvaga 350 (cervical, OTC) are the right tools — not this one.`,
  references: [
    { label: 'gammaCore — official product page', url: 'https://www.gammacore.com/' },
    { label: 'FDA 510(k) clearance — non-invasive vagus nerve stimulator for migraine', url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K173442' },
    { label: 'nVNS for cluster headache — randomised trial (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5654415/' },
  ],
  relatedSlugs: ['truvaga-350', 'nurosym', 'livanova-vns-therapy'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default gammacoreSapphireCv
