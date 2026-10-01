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
    { criterionId: 'value', score: 8.0, note: '$325 one-time for 350 preloaded sessions (about six months of daily use) — now only about $56 more than Pulsetto; the rechargeable Truvaga Plus is $499. No prescription. Roughly one-fifth the long-term cost of gammaCore.' },
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
  price: { usd: 325, note: 'one-time; 350 preloaded sessions; rechargeable Truvaga Plus (unlimited use) $499', asOf: '2026-10-01' },
  link: 'https://www.truvaga.com/',
  linkType: 'official',
  content: `## Where it leads

Truvaga 350 is the most credible cervical-VNS device a consumer can buy without a prescription. electroCore — the company behind the FDA-cleared gammaCore line — repackaged its medical hardware platform as a wellness device, keeping the same handheld form factor and the same 5 kHz burst waveform that runs in the prescription unit. Manufacturing provenance and safety profile inherit directly from the clinical line, which is unusual at this price point.

## What are the downsides of Truvaga 350?

The consumer version is no longer regulated as a medical device — Truvaga is sold for general wellness, and the wellness-indication clinical evidence is much thinner than gammaCore’s headache record. The 350 designation is literal: 350 two-minute sessions and the unit retires, after which you pay for a refresh. There is no on-device HRV, and protocol variety is limited to intensity.

## Who should buy Truvaga 350?

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
  faq: [
    { q: "Is the Truvaga 350 worth it?", a: "The Truvaga 350 is worth it if you want gammaCore-style cervical tVNS without a prescription. It uses the same hardware platform as FDA-cleared gammaCore and targets the vagal trunk directly. Its consumer use is not FDA-cleared, and its 350-session cap obscures long-term cost." },
    { q: "How much does the Truvaga 350 cost?", a: "The Truvaga 350 costs $325 one-time on truvaga.com and provides 350 preloaded sessions (about six months of daily use); the rechargeable, unlimited-use Truvaga Plus costs $499. That lifetime cap makes the long-term cost less obvious than the upfront price suggests, so factor in how often you plan to use it." },
    { q: "What are the downsides of the Truvaga 350?", a: "Truvaga is not FDA-cleared for its consumer indication and is sold as a wellness device. The 350-use cap hides long-term cost, sessions are fixed at 2 minutes with intensity the only variable, and there is no on-device HRV biofeedback." },
    { q: "Truvaga 350 vs gammaCore: which is better?", a: "Truvaga uses the same hardware platform as the FDA-cleared gammaCore but needs no prescription or insurance approval. gammaCore holds the FDA clearance; Truvaga is sold as a wellness device. Choose Truvaga for easy access to cervical tVNS." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-10-01',
}

export default truvaga350
