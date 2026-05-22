import type { ToolReview } from './types'

const xenByNeuvana: ToolReview = {
  slug: 'xen-by-neuvana',
  name: 'Xen by Neuvana',
  brand: 'Neuvana',
  category: 'vagus-stim',
  productType: 'Auricular tVNS (earbuds, audio-paired)',
  description:
    'ONDA review of Xen by Neuvana — auricular tVNS delivered through earbuds and paired with music. Scored on evidence, mechanism, protocols and value.',
  verdict:
    'Auricular tVNS packaged as earbuds — a clever consumer form factor, modest independent evidence.',
  summary:
    'Xen is a pair of earbuds that combine auricular tVNS — electrodes targeting the vagus nerve through the ear canal — with music playback, so the stimulation rides on top of audio. Controlled from a phone with adjustable intensity and several modes. Less clinical lineage than Nurosym, but the consumer experience is closer to wearing AirPods than wearing a medical device.',
  overallScore: 6.7,
  scores: [
    { criterionId: 'evidence', score: 5.5, note: 'Limited company-sponsored studies on HRV and sleep; no peer-reviewed RCTs of the Xen device specifically. Mechanism inherits from broader auricular tVNS evidence.' },
    { criterionId: 'mechanism', score: 7.0, note: 'Auricular tVNS via in-ear electrodes — targets the auricular vagal branch. Stimulation is synchronised with music playback through the same earbuds.' },
    { criterionId: 'protocols', score: 7.5, note: 'Multiple modes (focus, calm, sleep) plus music-paired stimulation. Intensity user-adjustable.' },
    { criterionId: 'comfort', score: 7.0, note: 'Earbuds — familiar form factor, but in-ear electrode placement is fiddlier than a tragus clip. Cable to the control unit limits mobility.' },
    { criterionId: 'biofeedback', score: 5.5, note: 'App logs sessions; no on-device HRV. Optional Apple Health integration.' },
    { criterionId: 'value', score: 6.5, note: '$399 hardware, no subscription required. More expensive than Pulsetto, less validated than Nurosym.' },
  ],
  pros: [
    'Earbud form factor — most familiar consumer shape in the category',
    'Stimulation paired with music — turns sessions into something you enjoy',
    'No subscription required for full functionality',
    'Multiple modes covering focus, calm, sleep',
  ],
  cons: [
    'Independent clinical evidence on the Xen device itself is thin',
    'In-ear electrode placement is fiddlier than a tragus clip',
    'Tethered to a control unit by a cable',
    'No on-device HRV measurement',
  ],
  bestFor: 'Best for users who want auricular tVNS in a familiar earbud form factor, paired with music.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Neuvana product documentation, the broader auricular tVNS literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 399, note: 'one-time; no subscription', asOf: '2026-05-21' },
  link: 'https://neuvanalife.com/',
  linkType: 'official',
  content: `## Where it leads

Xen by Neuvana takes the most consumer-friendly approach to auricular tVNS in this list. It packages the stimulator as in-ear electrodes built into earbuds, with the parameter playing on top of music from a phone — so a session feels closer to wearing AirPods than wearing a medical device. Modes cover focus, calm and sleep, and intensity is user-controlled. No subscription is required for full operation.

## Where it falls short

The evidence base is the weak point. The auricular tVNS mechanism inherits credibility from the broader Parasym/Nurosym literature, but Xen-specific peer-reviewed RCTs do not yet exist; what is published is company-sponsored. The earbud form factor also has a practical downside — in-ear electrode placement is more finicky than a tragus clip, and the device tethers to a control unit by cable.

## Who it is for

Choose Xen by Neuvana if the earbud form factor and music-paired sessions make daily use realistic for you, and you are comfortable with a thinner device-specific evidence base. If clinical-grade evidence is the priority, Nurosym is the right pick. If you want a wider protocol library at a lower price, Pulsetto delivers more for less.`,
  references: [
    { label: 'Xen by Neuvana — official product page', url: 'https://neuvanalife.com/' },
    { label: 'Auricular tVNS mechanism review (Frontiers in Neuroscience)', url: 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2019.00854/full' },
  ],
  relatedSlugs: ['nurosym', 'pulsetto', 'apollo-neuro'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default xenByNeuvana
