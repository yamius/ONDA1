import type { ToolReview } from './types'

const breatheRight: ToolReview = {
  slug: 'breathe-right-original',
  name: 'Breathe Right Original',
  brand: 'Breathe Right (Kenvue)',
  category: 'breathing-aid',
  productType: 'External adhesive nasal strip',
  description:
    'ONDA review of Breathe Right Original — the drugstore-standard external adhesive nasal strip from Kenvue/Johnson & Johnson. Scored on adhesion, mechanism, evidence and value.',
  verdict:
    'Drugstore reference for nasal strips — decades-long track record, FDA-cleared, ubiquitous distribution. Weaker mechanism than magnetic or internal dilators.',
  summary:
    'Breathe Right Original is the drugstore-standard external nasal strip — adhesive plastic strip across the bridge of the nose that uses spring-tension leverage to widen nostrils. Decades-long FDA-cleared track record (originally 3M, now Kenvue/J&J). Ubiquitous drugstore distribution. The reference everyone tries first; weaker mechanism than magnetic or internal alternatives.',
  overallScore: 6.8,
  scores: [
    { criterionId: 'adhesion-comfort', score: 7.0, note: 'Solid adhesion on clean dry skin. Skin-irritation reports moderate; clear / sensitive-skin variants address most issues.' },
    { criterionId: 'breathing-mechanism', score: 6.0, note: 'External spring-tension leverage — passive widening via plastic spring force across the bridge. Weaker than magnetic external (Intake) or internal mechanical (Mute) approaches.' },
    { criterionId: 'evidence-grounding', score: 8.0, note: 'FDA-cleared with decades of clinical-context literature on nasal-strip airflow. Multi-decade brand track record. Strongest regulatory standing in nasal dilators.' },
    { criterionId: 'form-factor', score: 7.0, note: 'Single-piece strip. Easy to apply. Disposable single-use. Visible externally.' },
    { criterionId: 'material-safety', score: 7.0, note: 'Hypoallergenic and sensitive-skin variants available. Skin-irritation reports rare with correct variant selection. Latex-free.' },
    { criterionId: 'value', score: 8.5, note: '~$10 for 30 strips = ~$0.33/night. Best per-night value in nasal-airway category by margin. Drugstore availability.' },
  ],
  pros: [
    'Strongest regulatory standing — FDA-cleared decades-long track record',
    'Best per-night value in nasal-airway category',
    'Ubiquitous drugstore distribution',
    'Sensitive-skin and clear variants available',
  ],
  cons: [
    'Weaker mechanism than magnetic / internal alternatives',
    'Single-use disposable design',
    'Visible externally',
    'Adhesion fails with skincare products or sweat',
  ],
  bestFor: 'Best for first-time nasal-airway-opener users wanting the drugstore reference at lowest per-night cost — try this before committing to premium magnetic / internal alternatives.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Breathe Right product documentation, FDA registration records and multi-decade clinical-context literature. Not hands-on tested by ONDA.',
  price: { usd: 10, note: '30-strip pack; ~$0.33/night', asOf: '2026-05-28' },
  link: 'https://www.breatheright.com/',
  linkType: 'official',
  content: `## Where it leads

Breathe Right Original is the drugstore-standard nasal strip — FDA-cleared, decades-long brand track record, ubiquitous distribution, best per-night value. The category reference everyone tries first.

## Where it falls short

Mechanism. External spring-tension leverage is weaker than magnetic external (Intake Breathing) or internal mechanical (Mute) approaches — Breathe Right opens the nostrils less aggressively. Single-use disposable design adds long-term cost vs reusable alternatives.

## Who it is for

Choose Breathe Right Original as the first nasal-airway-opener to try — cheapest credible entry, lowest commitment. If it works, great; if you want more aggressive dilation, graduate to Intake Breathing or Mute.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Breathe Right — official site', url: 'https://www.breatheright.com/' },
  ],
  relatedSlugs: ['intake-breathing', 'mute-nasal-dilator', 'nexcare-surgical-tape'],
  publishOn: '2026-07-13',
  datePublished: '2026-07-13',
  dateModified: '2026-07-13',
}

export default breatheRight
