import type { ToolReviewInput } from './types'

const intakeBreathing: ToolReviewInput = {
  slug: 'intake-breathing',
  name: 'Intake Breathing',
  brand: 'Intake Breathing',
  category: 'breathing-aid',
  productType: 'External magnetic nasal dilator',
  description:
    'ONDA review of Intake Breathing — premium external magnetic nasal dilator with reusable magnetic strips. Scored on adhesion, mechanism, evidence and value.',
  verdict:
    'Best premium nasal dilator — magnetic reusable design, James Nestor-recommended; its airflow studies are brand-funded.',
  summary:
    'Intake Breathing is the premium external nasal dilator — small adhesive tabs on each nostril hold a flexible magnetic band that mechanically widens the nostrils overnight. James Nestor explicitly recommends it in Breath. Reusable band design, replacement adhesive tabs, demonstrably effective for mouth-breathers who can\'t commit to mouth tape. Premium pricing reflects the engineering.',
  scores: [
    { criterionId: 'adhesion-comfort', score: 8.0, note: 'Small adhesive tabs grip well; magnetic band redistributes pressure rather than holding tension on a single point. Comfortable for the form factor.' },
    { criterionId: 'breathing-mechanism', score: 9.0, note: 'External magnetic dilation — mechanically widens nostril openings. Most effective external nasal dilator approach; outperforms passive strips like Breathe Right on user-reported airflow.' },
    { criterionId: 'evidence-grounding', score: 6.5, note: 'James Nestor recommendation in Breath book. Brand-funded airflow studies. Sleep-medicine adjacent positioning without FDA Class II.' },
    { criterionId: 'form-factor', score: 8.5, note: 'Reusable magnetic band with replaceable adhesive tabs — long-term ownership economics work. Discreet visual profile.' },
    { criterionId: 'material-safety', score: 8.0, note: 'Medical-grade adhesive tabs. Magnetic band hypoallergenic. Skin-reaction reports rare.' },
    { criterionId: 'value', score: 6.5, note: '~$40 starter kit, $20/month for replacement tabs = ~$0.65/night ongoing. Premium pricing but reusable band reduces long-term cost.' },
  ],
  pros: [
    'Most effective external nasal dilator approach',
    'James Nestor recommendation in Breath book',
    'Reusable magnetic band — long-term ownership economics work',
    'Discreet visual profile',
  ],
  cons: [
    'Premium pricing vs Breathe Right strips',
    'Requires adhesive-tab replacement subscription',
    'External device — visible on the face',
    'No FDA Class II clearance',
  ],
  bestFor: 'Best for committed mouth-breathers who can\'t adapt to mouth tape and want the most effective external nasal-dilation approach.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Intake Breathing product documentation, James Nestor public endorsement and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 40, note: 'starter kit; ~$20/month tabs', asOf: '2026-05-28' },
  link: 'https://intakebreathing.com/',
  linkType: 'official',
  content: `## Where it leads

Intake Breathing is the premium external nasal dilator reference — magnetic reusable band design, James Nestor-recommended, most effective external dilation approach. Best fit for mouth-breathers who reject mouth tape.

## What are the downsides of Intake Breathing?

Cost and visibility. Subscription-style adhesive-tab replacement ongoing cost, premium positioning vs $5 Breathe Right strips. External device visible on the face.

## Who should buy Intake Breathing?

Choose Intake Breathing if you can\'t adapt to mouth tape and want the most effective external nasal dilator. For internal nasal stent, Mute. For drugstore reference, Breathe Right. For mouth tape, Hostage Tape or Somnifix.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
- [Does sleep really clean your brain? The glymphatic evidence](/articles/nightly-flush-glymphatic-neural-cache) — what is shown in people, and what is still disputed
`,
  references: [
    { label: 'Intake Breathing — official site', url: 'https://intakebreathing.com/' },
  ],
  relatedSlugs: ['mute-nasal-dilator', 'breathe-right-original', 'hostage-tape'],
  publishOn: '2026-07-13',
  faq: [
    { q: "How does Intake Breathing work?", a: "Intake Breathing is an external nasal dilator. Small adhesive tabs on each nostril hold a flexible magnetic band that mechanically widens the nostrils overnight. The band is reusable, while the adhesive tabs are replaced over time. James Nestor recommends it in his book Breath." },
    { q: "How much does Intake Breathing cost?", a: "The Intake Breathing starter kit costs about $40, and replacement adhesive tabs run roughly $20 per month. That is premium pricing compared with Breathe Right strips, though the reusable magnetic band helps the long-term ownership economics." },
    { q: "Intake Breathing vs mouth tape: which should I try?", a: "Intake suits committed mouth-breathers who cannot adapt to mouth tape. Rather than sealing the lips, it opens the nasal airway, and it is the most effective external nasal dilator approach. It is visible on the face, though, and it has no FDA Class II clearance." },
  ],
  datePublished: '2026-07-13',
  dateModified: '2026-10-10',
}

export default intakeBreathing
