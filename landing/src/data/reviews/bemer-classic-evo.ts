import type { ToolReview } from './types'

const bemerClassicEvo: ToolReview = {
  slug: 'bemer-classic-evo',
  name: 'Bemer Classic Evo',
  brand: 'Bemer',
  category: 'pemf',
  productType: 'Professional-grade PEMF mat system',
  description:
    'ONDA review of the Bemer Classic Evo — the best-known PEMF mat, with a proprietary signal, a long but mostly manufacturer-linked study list and an FDA clearance as a non-medical muscle-conditioning device. Scored on field strength, waveform research, build and value.',
  verdict:
    'The best-known PEMF mat and the most-studied single signal — but most studies are small or manufacturer-linked, and independent controlled trials found no difference from control. Premium pricing.',
  summary:
    'Bemer Classic Evo is the best-known PEMF mat, with a 25-year brand track record. Bemer cites many studies of its specific biorhythmic signal, but most are small or manufacturer-linked; independent controlled trials of a BEMER device found no difference from an inactive device in fibromyalgia (Multanen 2018) or from the untreated leg in skin blood flow in healthy volunteers (Biermann 2020). Its FDA 510(k) clearance (K231368, product code NGX) is for a powered muscle stimulator used for non-medical muscle conditioning — not for treating any disease. Field intensity is deliberately low; the selling point is the proprietary waveform, not raw gauss. The main points of contention are price ($5,490) and a proprietary signal that locks you into the Bemer ecosystem.',
  overallScore: 8.7,
  scores: [
    { criterionId: 'field-strength', score: 7.5, note: 'Low-intensity by design (~35–150 µT). Bemer’s thesis is that microcirculation responds to waveform shape, not peak gauss — a maker claim that independent controlled trials have not confirmed. Lower than coil systems on raw output.' },
    { criterionId: 'waveform-evidence', score: 9.8, note: 'Bemer cites the longest study list of any consumer PEMF signal, but most studies are small, uncontrolled or manufacturer-linked. Independent controlled trials found no difference from an inactive device in fibromyalgia (Multanen 2018) or from a control leg in skin blood flow (Biermann 2020).' },
    { criterionId: 'build', score: 9.0, note: 'Premium German build, 3-year warranty. Control unit electronics among the best in category. Multi-decade reliability track record. The FDA clearance covers non-medical muscle conditioning, not build quality or health effects.' },
    { criterionId: 'programmability', score: 8.0, note: 'Pre-set Bemer protocols with intensity steps (P1–P10). App-controlled. Programmes are documented but the waveform itself is proprietary and not user-customisable.' },
    { criterionId: 'form-factor', score: 8.5, note: 'Full-body mat + B.Spot pillow applicator + B.Pad spot applicator. Coordinated multi-applicator system from a single control unit.' },
    { criterionId: 'value', score: 6.0, note: '$5,490 — premium. Subscription-free but the price is the editorial point of contention. You pay for the brand, the proprietary signal and the multi-applicator system, not raw intensity or proven health effects.' },
  ],
  pros: [
    'Most-studied single PEMF signal in the category (though most studies are small or manufacturer-linked)',
    'FDA 510(k) clearance — as a non-medical muscle-conditioning device (product code NGX), not for treating disease',
    'Premium German build with multi-decade reliability track record',
    'Coordinated multi-applicator system (mat + pillow + spot pad)',
  ],
  cons: [
    'Premium pricing ($5,490) — editorial point of contention',
    'Independent controlled trials (fibromyalgia, skin blood flow) found no difference from control',
    'Low raw field intensity vs coil systems (by design, but a marketing target for competitors)',
    'Proprietary signal locks you into the Bemer ecosystem and protocols',
    'MLM-style distribution model in some markets',
  ],
  bestFor: 'Best for users who want Bemer’s proprietary signal in a coordinated multi-applicator system from a multi-decade brand, and who accept that independent evidence of health benefits is weak.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Bemer product documentation, the FDA 510(k) database (K231368, product code NGX: muscle conditioning, not for medical use) and published Bemer-signal studies, including independent controlled trials (Multanen 2018, Biermann 2020). Not hands-on tested by ONDA.',
  price: { usd: 5490, note: 'set: control unit + B.Body mat + B.Spot + B.Pad', asOf: '2026-05-27' },
  link: 'https://www.bemergroup.com/',
  linkType: 'official',
  content: `## Where it leads

Bemer Classic Evo is the best-known consumer PEMF mat and the signal with the longest list of studies behind it. Most of those studies are small, uncontrolled or manufacturer-linked. The independent controlled trials we found point the other way: in women with fibromyalgia, a BEMER device did no better than an inactive one (Multanen 2018), and in healthy volunteers skin blood flow under the device did not differ from the untreated leg (Biermann 2020). Bemer is cleared by the FDA through 510(k) (K231368) under product code NGX — a powered muscle stimulator for muscle conditioning, used for other than medical purposes. A clearance means the FDA found it substantially equivalent to an earlier device for that use; it is not proof of health benefits. What Bemer does lead on is build quality, a coordinated multi-applicator system and a multi-decade brand. See [PEMF therapy — what the evidence shows](/science/evidence/pemf).

## What are the downsides of Bemer Classic Evo?

Price, intensity and evidence. At $5,490 Bemer is the most expensive consumer PEMF mat by a meaningful margin, and the raw field intensity (35–150 µT) is dramatically lower than coil systems like Pulse Centers (200,000+ µT peak). Bemer's thesis is that waveform shape matters more than peak intensity — a claim that rests mainly on manufacturer-linked studies and that independent controlled trials have not confirmed.

## Who should buy Bemer Classic Evo?

Choose Bemer Classic Evo if you want the best-known PEMF signal in a well-built multi-applicator system and you accept premium pricing without proven health benefits. For high-intensity coil work, Pulse Centers. For multi-modality at lower price, Healthy Wave Multi-Wave. For wearable PEMF at the entry tier, Resona Health VIBE.

---

## Background reading

- [PEMF therapy — what the evidence shows](/science/evidence/pemf) — what is shown in people, what comes from cell studies, and what an FDA clearance does and does not mean
- [Does sleep really clean your brain? The glymphatic evidence](/articles/nightly-flush-glymphatic-neural-cache) — what is shown in people, and what is still disputed
`,
  references: [
    { label: 'Bemer Group — official site', url: 'https://www.bemergroup.com/' },
    { label: 'FDA 510(k) database — K231368, Bemer Therapy System Evo (product code NGX)', url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K231368' },
  ],
  relatedSlugs: ['healthy-wave-multi-wave', 'pulse-centers-pulse-xl-pro', 'higherdose-pemf-mat'],
  publishOn: '2026-06-22',
  faq: [
    { q: "Is the Bemer Classic Evo worth it?", a: "Only if you value the brand and build enough to pay $5,490. Bemer cites many studies of its signal, but most are small or manufacturer-linked, and independent controlled trials found no difference from control. Its FDA clearance is for non-medical muscle conditioning, and the proprietary signal locks you into Bemer's ecosystem." },
    { q: "How much does the Bemer Classic Evo cost?", a: "The Bemer Classic Evo costs $5,490 for the set: control unit, B.Body mat, B.Spot and B.Pad. That premium price pays for the brand, the proprietary Bemer biorhythmic signal and the multi-applicator system rather than raw field strength, which is deliberately low." },
    { q: "What are the downsides of the Bemer Classic Evo?", a: "The Bemer Classic Evo is expensive at $5,490 and has low raw field intensity compared with coil systems, by design. Independent controlled trials found no clear benefit, its proprietary signal locks you into Bemer's protocols, and some markets sell it through an MLM-style distribution model." },
    { q: "Who is the Bemer Classic Evo best for?", a: "The Bemer Classic Evo is best for users who want the best-known PEMF signal in a coordinated multi-applicator system from a multi-decade brand. It suits buyers who can pay premium pricing and accept that health benefits are not proven." },
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-10-07',
}

export default bemerClassicEvo
