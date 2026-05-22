import type { ToolReview } from './types'

const sensate: ToolReview = {
  slug: 'sensate',
  name: 'Sensate',
  brand: 'BioSelf Technology',
  category: 'vagus-stim',
  productType: 'Infrasonic vagal modulator (chest-worn pebble)',
  description:
    'ONDA review of Sensate — the chest-worn pebble that uses infrasonic resonance to modulate vagal tone. Scored on evidence, mechanism, comfort and value.',
  verdict:
    'A passive, calming infrasonic device — gentle, well-loved, with mechanism evidence that lags its user enthusiasm.',
  summary:
    'Sensate is a chest-placed smooth-stone-shaped device that emits low-frequency infrasonic vibration into the thoracic cavity, paired with synced soundscapes through the phone. The premise — that infrasonic resonance against the chest stimulates the vagus via thoracic mechanoreceptors — is plausible and supported by a small published trial, but mechanism evidence is thinner than electrical tVNS. As a passive 10-minute wind-down ritual it is highly effective for most users.',
  overallScore: 6.9,
  scores: [
    { criterionId: 'evidence', score: 5.5, note: 'One published RCT showing stress/HRV improvement, plus company-funded studies. Less mechanism evidence than electrical tVNS devices.' },
    { criterionId: 'mechanism', score: 5.5, note: 'Infrasonic chest resonance — proposes vagal stimulation via thoracic mechanoreception. Mechanism plausible but less direct than tVNS.' },
    { criterionId: 'protocols', score: 7.5, note: 'Library of paired soundscape sessions (10–30 minutes) for sleep, focus, anxiety reduction. Content depth is unusual for the category.' },
    { criterionId: 'comfort', score: 8.5, note: 'Smooth pebble lies on the sternum; no electrodes, no skin contact issues. Most-pleasant device in this list.' },
    { criterionId: 'biofeedback', score: 5.5, note: 'App logs sessions and pairs with Apple Health for HRV import; no on-device measurement.' },
    { criterionId: 'value', score: 6.5, note: '$299 hardware plus Sensate+ subscription ($79/yr) to unlock the full session library.' },
  ],
  pros: [
    'The most-pleasant device in this category to actually use',
    'Sound-paired sessions make it a complete wind-down ritual, not just hardware',
    'No electrodes, no pads, no skin contact concerns',
    'Strong sleep-onset use case',
  ],
  cons: [
    'Mechanism evidence is thinner than electrical tVNS',
    'Full session library requires Sensate+ annual subscription',
    'Effect is subtle compared to direct vagal stimulation',
    'Phone tethered — requires the app running during sessions',
  ],
  bestFor: 'Best for sound-paired evening wind-down rituals — comfort and calm over acute stimulation.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from BioSelf Technology product documentation, the published Sensate trial and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 299, note: 'one-time; Sensate+ subscription ~$79/yr', asOf: '2026-05-21' },
  link: 'https://www.getsensate.com/',
  linkType: 'official',
  content: `## Where it leads

Sensate is the most pleasant device in this category. It is a smooth river-stone-shaped pebble that lies on the sternum during a 10–30 minute session, emitting low-frequency infrasonic vibration through the chest while a paired soundscape plays through headphones. The premise — that infrasonic resonance modulates vagal tone via thoracic mechanoreceptors — is supported by one published RCT and several company-funded studies. As a passive evening wind-down ritual it is well-loved by daily users.

## Where it falls short

Mechanism evidence is the weak point. The infrasonic-to-vagus pathway is plausible, but the trial base is small compared to either electrical tVNS or even Apollo Neuro’s vibrotactile-mechanoreceptor model. The effect is subtle by design — sessions are about cumulative calming, not the acute parasympathetic shift a direct electrical device can produce. Full content access requires the Sensate+ subscription, which adds to the long-term cost.

## Who it is for

Choose Sensate if you want a calming evening ritual you will actually use — sound-paired, passive, comfortable — rather than a clinical-grade stimulation device. If you want acute electrical vagus stimulation, Nurosym, Truvaga 350 or Pulsetto are the right shape. Apollo Neuro is the closest non-electrical alternative if you want all-day passive wear instead of session-based use.`,
  references: [
    { label: 'Sensate — official product page', url: 'https://www.getsensate.com/' },
    { label: 'Sensate stress/HRV pilot RCT (open-access)', url: 'https://www.getsensate.com/science' },
  ],
  relatedSlugs: ['apollo-neuro', 'pulsetto', 'xen-by-neuvana'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default sensate
