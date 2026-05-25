import type { ToolReview } from './types'

const truvaga350: ToolReview = {
  slug: 'truvaga-350',
  name: 'Truvaga 350',
  brand: 'electroCore',
  category: 'vagus-stim',
  productType: 'Consumer cervical tVNS (handheld)',
  description:
    'ONDA review of the Truvaga 350 — electroCore’s over-the-counter cervical tVNS device built on the same hardware platform as the FDA-cleared gammaCore. Scored on evidence, mechanism and value.',
  verdict:
    'gammaCore’s clinical hardware repackaged as a consumer wellness device — strong provenance, modest evidence in the wellness indication.',
  summary:
    'Truvaga is electroCore’s consumer brand, using the same cervical tVNS hardware platform that powers the FDA-cleared gammaCore prescription line — repackaged as an over-the-counter wellness device. The 350 model delivers 350 two-minute sessions before retirement and uses the same 5 kHz burst waveform. Strong manufacturing pedigree; the wellness-indication clinical evidence is thinner than gammaCore’s headache record but real.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'evidence', score: 7.5, note: 'Inherits gammaCore’s safety record; wellness-indication evidence is a small but real set of HRV and stress studies. Not FDA-cleared for any indication — sold as a general wellness device.' },
    { criterionId: 'mechanism', score: 8.5, note: 'Same cervical tVNS approach as gammaCore: handheld unit over the carotid sheath, 5 kHz burst waveform. Targets the cervical vagal trunk directly.' },
    { criterionId: 'protocols', score: 6.5, note: 'Two-minute fixed sessions; intensity user-adjustable. The companion app suggests usage patterns rather than distinct programmes.' },
    { criterionId: 'comfort', score: 7.0, note: 'Ergonomic handheld; some users report jaw twitches or neck soreness at higher amplitudes — same as gammaCore.' },
    { criterionId: 'biofeedback', score: 6.0, note: 'App logs sessions and supports simple mood/stress journaling. No on-device HRV measurement.' },
    { criterionId: 'value', score: 7.5, note: '$499 one-time (or subscription plans). No prescription. Roughly one-fifth the long-term cost of gammaCore.' },
  ],
  pros: [
    'Same hardware platform as the FDA-cleared gammaCore — proven safety',
    'No prescription, no insurance approval needed',
    'Cervical tVNS — targets the vagal trunk directly, not just the ear branch',
    'Companion app logs sessions and tracks self-rated stress',
  ],
  cons: [
    'Not FDA-cleared in its consumer indication — sold as a wellness device',
    'Session lifetime cap (350 uses) makes long-term cost less obvious',
    'Fixed 2-minute sessions; intensity is the only variable',
    'No on-device HRV biofeedback',
  ],
  bestFor: 'Best for consumers who want gammaCore’s cervical tVNS approach without the prescription gate.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from electroCore product documentation, the gammaCore clinical record (shared platform) and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 499, note: 'one-time; 350 sessions before retirement', asOf: '2026-05-21' },
  link: 'https://www.truvaga.com/',
  linkType: 'official',
  content: `## Where it leads

Truvaga 350 is the most credible cervical-VNS device a consumer can buy without a prescription. electroCore — the company behind the FDA-cleared gammaCore line — repackaged its medical hardware platform as a wellness device, keeping the same handheld form factor and the same 5 kHz burst waveform that runs in the prescription unit. Manufacturing provenance and safety profile inherit directly from the clinical line, which is unusual at this price point.

## Where it falls short

The consumer version is no longer regulated as a medical device — Truvaga is sold for general wellness, and the wellness-indication clinical evidence is much thinner than gammaCore’s headache record. The 350 designation is literal: 350 two-minute sessions and the unit retires, after which you pay for a refresh. There is no on-device HRV, and protocol variety is limited to intensity.

## Who it is for

Choose Truvaga 350 if you want cervical-trunk tVNS — the same approach used in the FDA-cleared device — without going through a clinician, and you are willing to accept thinner wellness-indication evidence in exchange for accessibility. If you want the deepest research base, Nurosym (auricular) has the trial record. If you have a real headache diagnosis, gammaCore is the right tool.

---

## Background reading

The biology behind what these devices target — and the protocols that compound with the hardware.

- [CO₂ tolerance and the oxygen limit](/articles/co2-tolerance-expanding-oxygen-limit) — why slow breathing rebuilds vagal tone via CO₂ chemistry
- [Breathwork as a command-line interface](/articles/breathwork-command-line-interface) — the protocols stimulation pairs with
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — why vagal tone work targets cortisol downstream
`,
  references: [
    { label: 'Truvaga 350 — official product page', url: 'https://www.truvaga.com/' },
    { label: 'electroCore — published nVNS trial library', url: 'https://www.electrocore.com/clinical-evidence' },
  ],
  relatedSlugs: ['gammacore-sapphire-cv', 'nurosym', 'pulsetto'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default truvaga350
