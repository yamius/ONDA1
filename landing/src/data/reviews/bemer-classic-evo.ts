import type { ToolReviewInput } from './types'

const bemerClassicEvo: ToolReviewInput = {
  slug: 'bemer-classic-evo',
  name: 'Bemer Classic Evo',
  brand: 'Bemer',
  category: 'pemf',
  productType: 'Professional-grade PEMF mat system',
  description:
    'ONDA review of the Bemer Classic Evo — the category-defining PEMF mat with 50+ published clinical studies, FDA Class II clearance and the proprietary Bemer biorhythmic signal. Scored on field strength, waveform research, build and value.',
  verdict:
    'The PEMF reference — most-published waveform, FDA Class II, multi-decade brand pedigree. Premium pricing reflects the research moat.',
  summary:
    'Bemer Classic Evo is the smartphone-of-PEMF — the category-defining mat with the deepest published research base (50+ peer-reviewed studies on the specific Bemer biorhythmic signal), FDA Class II clearance, and a 25-year brand track record. Field intensity is deliberately low; the differentiator is the proprietary waveform, not raw gauss. The editorial point of contention is price ($5,490) and the fact that proprietary signal locks you into the Bemer ecosystem.',
  scores: [
    { criterionId: 'field-strength', score: 7.5, note: 'Low-intensity by design (~35–150 µT). Bemer’s thesis is that microcirculation responds to waveform shape, not peak gauss — backed by published research but lower than coil systems on raw output.' },
    { criterionId: 'waveform-evidence', score: 9.8, note: 'The Bemer biorhythmic signal has the deepest peer-reviewed evidence base of any consumer PEMF — 50+ published studies on the specific waveform, not just on PEMF in general.' },
    { criterionId: 'build', score: 9.0, note: 'Premium German build, FDA Class II clearance, 3-year warranty. Control unit electronics among the best in category. Multi-decade reliability track record.' },
    { criterionId: 'programmability', score: 8.0, note: 'Pre-set Bemer protocols with intensity steps (P1–P10). App-controlled. Programmes are documented but the waveform itself is proprietary and not user-customisable.' },
    { criterionId: 'form-factor', score: 8.5, note: 'Full-body mat + B.Spot pillow applicator + B.Pad spot applicator. Coordinated multi-applicator system from a single control unit.' },
    { criterionId: 'value', score: 6.0, note: '$5,490 — premium. Subscription-free but the price is the editorial point of contention. You pay for the research moat and FDA clearance, not raw intensity.' },
  ],
  pros: [
    'Most-published PEMF waveform in the category (50+ peer-reviewed studies)',
    'FDA Class II clearance — among the few PEMF mats with regulatory standing',
    'Premium German build with multi-decade reliability track record',
    'Coordinated multi-applicator system (mat + pillow + spot pad)',
  ],
  cons: [
    'Premium pricing ($5,490) — editorial point of contention',
    'Low raw field intensity vs coil systems (by design, but a marketing target for competitors)',
    'Proprietary signal locks you into the Bemer ecosystem and protocols',
    'MLM-style distribution model in some markets',
  ],
  bestFor: 'Best for users wanting the most-researched PEMF waveform in a coordinated multi-applicator system, with FDA Class II clearance and a multi-decade brand pedigree.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Bemer product documentation, FDA Class II registration, and the published Bemer biorhythmic-signal literature (50+ peer-reviewed studies on microcirculation). Not hands-on tested by ONDA.',
  price: { usd: 5490, note: 'set: control unit + B.Body mat + B.Spot + B.Pad', asOf: '2026-05-27' },
  link: 'https://www.bemergroup.com/',
  linkType: 'official',
  content: `## Where it leads

Bemer Classic Evo is the PEMF category reference — the device with the deepest published research base on a specific consumer waveform. The Bemer biorhythmic signal has 50+ peer-reviewed studies on microcirculation; no other consumer PEMF brand has that research moat. FDA Class II clearance and a multi-decade brand pedigree compound the credibility advantage.

## What are the downsides of Bemer Classic Evo?

Price and intensity. At $5,490 Bemer is the most expensive consumer PEMF mat by a meaningful margin, and the raw field intensity (35–150 µT) is dramatically lower than coil systems like Pulse Centers (200,000+ µT peak). Bemer's thesis is that waveform shape matters more than peak intensity — true per their research, but it leaves the device vulnerable to "underpowered" criticism from intensity-first competitors.

## Who should buy Bemer Classic Evo?

Choose Bemer Classic Evo if you want the most-researched PEMF waveform with FDA Class II clearance and you accept premium pricing. For high-intensity coil work, Pulse Centers. For multi-modality at lower price, Healthy Wave Multi-Wave. For wearable PEMF at the entry tier, Resona Health VIBE.

---

## Background reading

The biology of why pulsed electromagnetic fields modulate cellular ion gradients and microcirculation.

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — how endogenous and applied electromagnetic fields shape tissue repair
- [Does sleep really clean your brain? The glymphatic evidence](/articles/nightly-flush-glymphatic-neural-cache) — what is shown in people, and what is still disputed
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid) — adjunct PEMF for cellular energy restoration
`,
  references: [
    { label: 'Bemer Group — official site', url: 'https://www.bemergroup.com/' },
  ],
  relatedSlugs: ['healthy-wave-multi-wave', 'pulse-centers-pulse-xl-pro', 'higherdose-pemf-mat'],
  publishOn: '2026-06-22',
  faq: [
    { q: "Is the Bemer Classic Evo worth it?", a: "Yes, if research depth matters most to you. The Bemer Classic Evo has the most-published PEMF waveform, with 50+ peer-reviewed studies, plus FDA Class II clearance and a 25-year brand track record. Its $5,490 price is the main point of contention, and the proprietary signal locks you into Bemer's ecosystem." },
    { q: "How much does the Bemer Classic Evo cost?", a: "The Bemer Classic Evo costs $5,490 for the set: control unit, B.Body mat, B.Spot and B.Pad. That premium price reflects the research moat around the proprietary Bemer biorhythmic signal rather than raw field strength, which is deliberately low." },
    { q: "What are the downsides of the Bemer Classic Evo?", a: "The Bemer Classic Evo is expensive at $5,490 and has low raw field intensity compared with coil systems, by design. Its proprietary signal locks you into Bemer's ecosystem and protocols, and some markets sell it through an MLM-style distribution model." },
    { q: "Who is the Bemer Classic Evo best for?", a: "The Bemer Classic Evo is best for users who want the most-researched PEMF waveform in a coordinated multi-applicator system. It suits buyers who value FDA Class II clearance and a multi-decade brand pedigree enough to pay premium pricing." },
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-06-22',
}

export default bemerClassicEvo
