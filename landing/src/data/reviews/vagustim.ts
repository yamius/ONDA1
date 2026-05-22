import type { ToolReview } from './types'

const vagustim: ToolReview = {
  slug: 'vagustim',
  name: 'Vagustim',
  brand: 'Vagustim Health',
  category: 'vagus-stim',
  productType: 'Auricular tVNS (ear clip + paired electrodes)',
  description:
    'ONDA review of Vagustim — protocol-driven auricular tVNS device backed by published research and CE-marked for stress, anxiety and HRV modulation. Scored on evidence, mechanism and value.',
  verdict:
    'Protocol-driven auricular tVNS with credible research provenance — strong on EU regulatory and trial backing.',
  summary:
    'Vagustim is a Turkish-developed auricular tVNS device, CE-marked and backed by a published trial base from clinical-research groups in Turkey and Germany. Hardware combines an ear clip with paired auxiliary electrodes for specific protocols (vagus only, vagus + acupoint, etc.). Less brand recognition outside the EU than Nurosym, comparable evidence depth, and a wider protocol library.',
  overallScore: 7.3,
  scores: [
    { criterionId: 'evidence', score: 7.5, note: 'CE-marked Class IIa medical device; trial base of independent and company-collaborator studies on HRV, anxiety and depression. Second to Nurosym in published evidence among ear-clip devices.' },
    { criterionId: 'mechanism', score: 7.5, note: 'Auricular tVNS via tragus clip, plus paired electrode protocols. Documented stimulation parameters configurable per protocol.' },
    { criterionId: 'protocols', score: 8.0, note: 'Library of protocol presets (stress, sleep, depression, anxiety, IBS), each with disclosed parameters. Stronger protocol variety than Nurosym.' },
    { criterionId: 'comfort', score: 7.0, note: 'Tragus clip plus secondary electrode pads. Slightly more setup than a single ear clip; well-tolerated for 20-30 minute sessions.' },
    { criterionId: 'biofeedback', score: 6.5, note: 'Companion app logs sessions and self-rated state; no on-device HRV.' },
    { criterionId: 'value', score: 7.0, note: '~€499 (~$540) hardware, no subscription. Mid-pack pricing for a research-backed device.' },
  ],
  pros: [
    'CE-marked Class IIa medical device — EU regulatory backing',
    'Wider protocol library than Nurosym with disclosed parameters',
    'Independent and collaborator-published trial base on HRV and anxiety',
    'No subscription required',
  ],
  cons: [
    'Less brand recognition than Nurosym outside the EU',
    'Multi-electrode setup is more involved than a single ear clip',
    'No on-device HRV biofeedback',
    'Customer support and warranty processes weaker outside EU markets',
  ],
  bestFor: 'Best for users in EU markets who want protocol variety alongside Nurosym-level evidence.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Vagustim Health product documentation, published independent and collaborator trials and 2026 EU market reviews. Not hands-on tested by ONDA.',
  price: { usd: 540, note: '€499 — one-time; no subscription', asOf: '2026-05-21' },
  link: 'https://vagustim.io/',
  linkType: 'official',
  content: `## Where it leads

Vagustim is the strongest non-Nurosym auricular tVNS device on evidence. It is CE-marked as a Class IIa medical device, and the trial base — from Turkish and German clinical-research groups — covers HRV modulation, depression, anxiety and IBS protocols. Where Nurosym ships a single, deliberately spartan programme, Vagustim layers a library of protocol presets on top of the ear clip, each with disclosed pulse parameters configurable per condition.

## Where it falls short

Distribution is the constraint. Brand recognition outside the EU is thin, customer support and warranty processes vary by region, and the multi-electrode setup (tragus clip plus secondary pads for some protocols) is more involved than a single ear clip. For a first-time user that adds friction. There is no on-device HRV measurement — like every other ear-clip device here, biofeedback has to come from a paired wearable.

## Who it is for

Choose Vagustim if you are in an EU market, want clinical-grade evidence comparable to Nurosym, and prefer a wider protocol library to a single deliberately constrained programme. If you are outside the EU, Nurosym’s distribution and support are more reliable. If you want fewer electrodes and a phone-app driven UX, Pulsetto is closer to that shape.`,
  references: [
    { label: 'Vagustim — official product page', url: 'https://vagustim.io/' },
    { label: 'taVNS for major depression — randomised trial (Brain Stimulation)', url: 'https://www.brainstimjrnl.com/article/S1935-861X(15)00879-1/fulltext' },
  ],
  relatedSlugs: ['nurosym', 'pulsetto', 'hoolest-verelief-prime'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default vagustim
