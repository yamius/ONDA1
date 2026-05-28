import type { ToolReview } from './types'

const intakeBreathing: ToolReview = {
  slug: 'intake-breathing',
  name: 'Intake Breathing',
  brand: 'Intake Breathing',
  category: 'breathing-aid',
  productType: 'External magnetic nasal dilator',
  description:
    'ONDA review of Intake Breathing — premium external magnetic nasal dilator with reusable magnetic strips. Scored on adhesion, mechanism, evidence and value.',
  verdict:
    'Best premium nasal dilator — magnetic reusable design, James Nestor-recommended, deepest evidence base in nasal-airway openers.',
  summary:
    'Intake Breathing is the premium external nasal dilator — small adhesive tabs on each nostril hold a flexible magnetic band that mechanically widens the nostrils overnight. James Nestor explicitly recommends it in Breath. Reusable band design, replacement adhesive tabs, demonstrably effective for mouth-breathers who can\'t commit to mouth tape. Premium pricing reflects the engineering.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'adhesion-comfort', score: 8.0, note: 'Small adhesive tabs grip well; magnetic band redistributes pressure rather than holding tension on a single point. Comfortable for the form factor.' },
    { criterionId: 'breathing-mechanism', score: 9.0, note: 'External magnetic dilation — mechanically widens nostril openings. Most effective external nasal dilator approach; outperforms passive strips like Breathe Right on user-reported airflow.' },
    { criterionId: 'evidence-grounding', score: 7.5, note: 'James Nestor recommendation in Breath book. Brand-funded airflow studies. Sleep-medicine adjacent positioning without FDA Class II.' },
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

## Where it falls short

Cost and visibility. Subscription-style adhesive-tab replacement ongoing cost, premium positioning vs $5 Breathe Right strips. External device visible on the face.

## Who it is for

Choose Intake Breathing if you can\'t adapt to mouth tape and want the most effective external nasal dilator. For internal nasal stent, Mute. For drugstore reference, Breathe Right. For mouth tape, Hostage Tape or Somnifix.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
- [Nightly flush: the glymphatic system](/articles/nightly-flush-glymphatic-neural-cache)
`,
  references: [
    { label: 'Intake Breathing — official site', url: 'https://intakebreathing.com/' },
  ],
  relatedSlugs: ['mute-nasal-dilator', 'breathe-right-original', 'hostage-tape'],
  publishOn: '2026-07-13',
  datePublished: '2026-07-13',
  dateModified: '2026-07-13',
}

export default intakeBreathing
