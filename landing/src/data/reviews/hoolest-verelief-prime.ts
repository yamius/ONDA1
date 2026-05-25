import type { ToolReview } from './types'

const hoolestVeReliefPrime: ToolReview = {
  slug: 'hoolest-verelief-prime',
  name: 'Hoolest VeRelief Prime',
  brand: 'Hoolest Performance',
  category: 'vagus-stim',
  productType: 'Handheld tVNS (finger / neck grip)',
  description:
    'ONDA review of the Hoolest VeRelief Prime — handheld vagus nerve stimulator built for athletic recovery and sleep onset. Scored on evidence, mechanism and value.',
  verdict:
    'The most athlete-focused tVNS device — short, intense sessions for recovery and sleep onset.',
  summary:
    'Hoolest VeRelief Prime is a handheld tVNS device designed by Arizona State University spin-out Hoolest Performance. Grip electrodes target either the auricular branch (held to the ear) or the cervical branch (held to the neck), delivering high-intensity 3–5 minute sessions. Engineered around athletic recovery and pre-sleep parasympathetic priming, with founder-published research.',
  overallScore: 7.2,
  scores: [
    { criterionId: 'evidence', score: 6.5, note: 'Founder-published research on HRV recovery and sleep onset; ASU spin-out lineage. Smaller trial base than Nurosym, but Hoolest-specific data exists.' },
    { criterionId: 'mechanism', score: 7.5, note: 'Handheld transcutaneous VNS — usable at ear or neck via finger-grip electrodes. Higher peak intensities than ear-clip devices, in shorter sessions.' },
    { criterionId: 'protocols', score: 7.0, note: 'Three intensity modes; sessions 3–5 minutes. Less programme variety than Pulsetto but more intense per minute.' },
    { criterionId: 'comfort', score: 6.5, note: 'Requires active holding for the full session — not a passive wearable. Higher peak intensity can feel sharp.' },
    { criterionId: 'biofeedback', score: 6.0, note: 'Companion app logs sessions and integrates with Apple Health for HRV correlation; no on-device HRV.' },
    { criterionId: 'value', score: 7.5, note: '$279 one-time, no subscription. Comparable to Pulsetto at the entry tier.' },
  ],
  pros: [
    'Founder-published HRV and sleep-onset research',
    'High peak intensity in short sessions — fits athletic recovery workflows',
    'Usable at the ear or neck — two stimulation targets in one device',
    'No subscription required',
  ],
  cons: [
    'Active holding required — not a passive wearable',
    'Less protocol variety than Pulsetto',
    'Higher peak intensity can be uncomfortable',
    'Independent third-party evidence is still emerging',
  ],
  bestFor: 'Best for athletes wanting short, intense pre-sleep or post-training parasympathetic priming.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Hoolest product documentation, the founder-published research record and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 279, note: 'one-time; no subscription', asOf: '2026-05-21' },
  link: 'https://www.hoolest.com/',
  linkType: 'official',
  content: `## Where it leads

Hoolest VeRelief Prime is the most athlete-shaped device in this category. It is a handheld stimulator gripped in the hand and pressed against either the ear or the side of the neck, delivering a short (3–5 minute), high-intensity tVNS session. The company is an Arizona State University spin-out, and the founding team has published HRV-recovery and sleep-onset research on the device itself — a level of investigator transparency unusual at this price point.

## Where it falls short

It is not a passive wearable. The user has to actively hold the device against the chosen site for the full session, which makes it less suited to ambient daily use than Apollo Neuro or a wearable like Pulsetto. Peak intensities are higher than ear-clip devices, so the sensation can be sharp for first-time users. Programme variety is narrower than Pulsetto’s four-mode library.

## Who it is for

Choose Hoolest VeRelief Prime if you want a short, intense parasympathetic session before sleep or after training, and you prefer an athlete-built tool over a wellness wearable. If you want passive all-day vagal modulation, Apollo Neuro is the right shape. If you want a guided, programme-driven daily device, Pulsetto delivers more variety for similar money.

---

## Background reading

The biology behind what these devices target — and the protocols that compound with the hardware.

- [Vagus nerve: the master key](/articles/vagus-nerve-master-key) — why the vagus nerve sits upstream of HRV, sleep, mood and inflammation
- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — the regulatory and mechanistic landscape behind non-invasive VNS
- [ACC and coherence monitoring](/articles/anterior-cingulate-core-coherence-monitoring) — how vagal tone shapes attention and emotional regulation upstream
`,
  references: [
    { label: 'Hoolest VeRelief Prime — official product page', url: 'https://www.hoolest.com/' },
    { label: 'Hoolest HRV recovery and sleep-onset research summary', url: 'https://www.hoolest.com/pages/science' },
  ],
  relatedSlugs: ['pulsetto', 'apollo-neuro', 'vagustim'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default hoolestVeReliefPrime
