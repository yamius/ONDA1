import type { ToolReview } from './types'

const apolloNeuro: ToolReview = {
  slug: 'apollo-neuro',
  name: 'Apollo Neuro',
  brand: 'Apollo Neuroscience',
  category: 'vagus-stim',
  productType: 'Vibrotactile vagal modulator (wearable)',
  description:
    'ONDA review of the Apollo Neuro — the vibrotactile wearable that modulates vagal tone through low-frequency haptic stimulation. Scored on evidence, mechanism and value.',
  verdict:
    'The most wearable device in the category — vibrotactile, not electrical, with mounting clinical evidence on HRV and recovery.',
  summary:
    'Apollo Neuro is a wrist or ankle worn band that uses low-frequency haptic vibration — not electrical stimulation — to modulate autonomic state and vagal tone. The mechanism is mechanoreceptor-mediated rather than direct vagal stimulation, which keeps it out of the strict tVNS category but firmly in the vagus-modulator conversation. Founder-led University of Pittsburgh research; comfortable enough to wear all day.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'evidence', score: 7.0, note: 'Published HRV / recovery RCTs from the founding team at University of Pittsburgh; independent replication is mounting. Strongest evidence base of any non-electrical device here.' },
    { criterionId: 'mechanism', score: 6.5, note: 'Vibrotactile rather than electrical — modulates vagal tone via low-frequency mechanoreception. Not tVNS in the strict sense; classified here as a vagal modulator.' },
    { criterionId: 'protocols', score: 8.5, note: 'Seven distinct modes (energy, calm, sleep, focus, recover, social, clear) with adjustable intensity and duration. Best programme variety in the category.' },
    { criterionId: 'comfort', score: 9.0, note: 'Wrist, ankle or clip-on; designed for all-day wear. The only device here genuinely worn passively.' },
    { criterionId: 'biofeedback', score: 7.0, note: 'App logs sessions and self-rated state; integrates with Apple Health and Oura for HRV correlation.' },
    { criterionId: 'value', score: 6.5, note: '$349 hardware plus optional Apollo+ membership ($14.99/mo) for premium content. No subscription required for basic operation.' },
  ],
  pros: [
    'The only device here designed for genuine all-day wear',
    'Founder-led peer-reviewed research on HRV and recovery',
    'Seven distinct programmes for different states',
    'Non-electrical — no skin contact, no pads, no titration',
  ],
  cons: [
    'Vibrotactile mechanism is less direct than electrical tVNS',
    'No on-device HRV measurement',
    'Premium content gated behind Apollo+ subscription',
    'Less effective than tVNS for users seeking strong acute responses',
  ],
  bestFor: 'Best for daily-wear vagal modulation — gentle, non-electrical and the easiest to integrate into life.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Apollo Neuroscience clinical documentation, published University of Pittsburgh HRV/recovery trials and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 349, note: 'one-time; Apollo+ optional ~$15/mo', asOf: '2026-05-21' },
  link: 'https://apolloneuro.com/',
  linkType: 'official',
  content: `## Where it leads

Apollo Neuro is the easiest device in this category to actually live with. It is worn on the wrist or ankle like a band, delivers low-frequency vibration rather than electrical pulses, and runs in the background — no setup, no pads, no titration. The founding team at University of Pittsburgh has published peer-reviewed HRV and recovery trials on it, which is more than most non-electrical vagal devices can claim. Seven programmes cover different intent states (calm, energy, sleep, focus, recover, social, clear), with intensity and duration both adjustable.

## Where it falls short

The mechanism is the catch. Vibrotactile stimulation modulates autonomic tone via mechanoreceptor pathways and reaches the vagus indirectly — it is not transcutaneous vagus nerve stimulation in the strict sense. Users coming from electrical tVNS often describe the effect as gentler and slower; the acute parasympathetic shift is real but less pronounced than what an ear clip or neck collar can produce. The premium content library sits behind Apollo+, though basic operation is unsubscribed.

## Who it is for

Choose Apollo Neuro if you want a vagal-modulation device you can actually wear all day, in the office, while sleeping, while exercising, without any setup ritual. If you want a stronger acute electrical effect, Nurosym, Truvaga 350 or Pulsetto are better fits. Pair the two if you can — many users run Apollo Neuro as the daily passive baseline and an electrical tVNS device for targeted sessions.`,
  references: [
    { label: 'Apollo Neuro — official product page', url: 'https://apolloneuro.com/' },
    { label: 'Apollo wearable HRV/recovery RCT — University of Pittsburgh', url: 'https://apolloneuro.com/pages/science' },
  ],
  relatedSlugs: ['sensate', 'pulsetto', 'nurosym'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default apolloNeuro
