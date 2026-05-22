import type { ToolReview } from './types'

const pulsetto: ToolReview = {
  slug: 'pulsetto',
  name: 'Pulsetto',
  brand: 'Pulsetto',
  category: 'vagus-stim',
  productType: 'Consumer cervical tVNS (neck collar)',
  description:
    'ONDA review of Pulsetto — the consumer neck-worn tVNS device with four guided protocols (sleep, stress, focus, recovery). Scored on evidence, mechanism, protocols and value.',
  verdict:
    'The most accessible consumer tVNS device — strong on protocol variety and price, lighter on independent clinical evidence.',
  summary:
    'Pulsetto is a Lithuanian-made neck-worn tVNS collar that stimulates the cervical vagal branches transcutaneously through two electrode pads. It runs four guided programmes — sleep, stress, anxiety reduction, pain reduction — through a companion app. CE-marked as a wellness device. The clearest entry point into consumer tVNS at the price; the evidence base is mostly company-sponsored and early.',
  overallScore: 7.4,
  scores: [
    { criterionId: 'evidence', score: 6.0, note: 'CE-marked. Mostly company-sponsored studies and one published pilot on HRV/stress; thinner independent evidence than Nurosym or gammaCore.' },
    { criterionId: 'mechanism', score: 7.5, note: 'Cervical transcutaneous VNS via twin neck electrodes — targets the cervical vagal branches. Documented pulse parameters in the app.' },
    { criterionId: 'protocols', score: 8.5, note: 'Four distinct guided programmes plus a custom mode. The strongest protocol variety in this list.' },
    { criterionId: 'comfort', score: 7.5, note: 'Lightweight collar; daily 4–20 minute sessions tolerated well. Gel/saline pad maintenance is the main friction.' },
    { criterionId: 'biofeedback', score: 6.5, note: 'App logs sessions and self-rated state; no on-device HRV. Pairs with Apple Health / Google Fit for external HRV import.' },
    { criterionId: 'value', score: 8.0, note: '$269 hardware, optional Pulsetto+ app subscription. Cheapest neck-worn tVNS here.' },
  ],
  pros: [
    'Four guided programmes — broadest protocol variety in the category',
    'Cheapest neck-worn tVNS at $269',
    'Companion app logs sessions and tracks self-rated state',
    'CE-marked; documented pulse parameters',
  ],
  cons: [
    'Independent clinical evidence is thinner than Nurosym or gammaCore',
    'Saline/gel pads need regular replacement',
    'Premium features locked behind Pulsetto+ subscription',
    'No on-device HRV biofeedback',
  ],
  bestFor: 'Best for consumers who want guided neck-worn tVNS with protocol variety, at an accessible price.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, the published Pulsetto pilot record and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 269, note: 'one-time; optional Pulsetto+ subscription ~$8/mo', asOf: '2026-05-21' },
  link: 'https://pulsetto.tech/',
  linkType: 'official',
  content: `## Where it leads

Pulsetto is the easiest way into consumer cervical tVNS. The neck-worn collar makes daily use simple — no clip to fiddle with, no handheld to hold against the carotid — and the app drives four distinct programmes (sleep, stress, anxiety, pain) instead of asking the user to titrate intensity themselves. At $269 it is also the cheapest cervical device in this list, and the parameters are documented inside the app rather than hidden.

## Where it falls short

The trade-off is evidence. Most of the supporting research is company-sponsored or in pilot stage; the deeper randomised-trial base belongs to Nurosym and gammaCore. The neck pads need periodic saline or gel-pad replacement, which adds friction. And the more sophisticated features — additional programmes, deeper insights — sit behind the Pulsetto+ subscription, so the $269 ticket understates the full ownership cost a little.

## Who it is for

Choose Pulsetto if you want a polished daily-use cervical tVNS device with structured programmes and minimal setup, and you are comfortable with a lighter independent-evidence base in exchange for accessibility. If clinical-grade evidence is the deciding criterion, Nurosym is the right pick. If you want a one-time-purchase device with no app subscription, Truvaga 350 is closer to that shape.`,
  references: [
    { label: 'Pulsetto — official product page', url: 'https://pulsetto.tech/' },
    { label: 'Pulsetto HRV/stress pilot study summary', url: 'https://pulsetto.tech/pages/science' },
  ],
  relatedSlugs: ['nurosym', 'truvaga-350', 'apollo-neuro'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default pulsetto
