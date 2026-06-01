import type { ToolReview } from './types'

const nurosym: ToolReview = {
  slug: 'nurosym',
  name: 'Nurosym',
  brand: 'Parasym Health',
  category: 'vagus-stim',
  productType: 'Auricular tVNS (ear clip)',
  description:
    'ONDA review of the Nurosym — the clinical-grade auricular tVNS device used in published HRV and inflammation research. Scored on evidence, mechanism, protocols and value.',
  verdict:
    'The most clinically-validated consumer tVNS device — a research-grade ear clip with a price to match.',
  summary:
    'Nurosym is the rebranded consumer line of Parasym, the UK company whose hardware has been used in dozens of peer-reviewed studies on auricular vagus nerve stimulation. It clips to the tragus of the left ear and delivers a calibrated electrical pulse to the auricular branch of the vagus nerve. There is no app gimmickry — a single dial, documented parameters, and an evidence base no other consumer device matches.',
  overallScore: 8.6,
  scores: [
    { criterionId: 'evidence', score: 9.5, note: 'The Parasym/Nurosym hardware appears in 40+ peer-reviewed tVNS trials, covering HRV, inflammation, depression and long-COVID — the deepest research base of any consumer device here.' },
    { criterionId: 'mechanism', score: 9.0, note: 'Transcutaneous auricular VNS at the tragus, the most-studied non-invasive target, with disclosed pulse parameters (25 Hz, 200–1000 µs) rather than a black-box waveform.' },
    { criterionId: 'protocols', score: 7.0, note: 'A single, well-defined stimulation programme; intensity is dialled by the user. Less programme variety than Pulsetto, but parameters are transparent.' },
    { criterionId: 'comfort', score: 7.5, note: 'A tragus clip is well-tolerated for 30–60 minute sessions; not designed for hours of wear, and the cable tethers you to the unit.' },
    { criterionId: 'biofeedback', score: 6.5, note: 'No built-in HRV measurement — pair with a chest strap or ring for closed-loop tracking.' },
    { criterionId: 'value', score: 6.5, note: '£599 (~$750) one-time, no subscription. Premium pricing — justified by the evidence base, not for casual experimenters.' },
  ],
  pros: [
    'Deepest peer-reviewed research base of any consumer tVNS device',
    'Disclosed stimulation parameters — no black-box dosing',
    'No subscription, no app required to use',
    'UK-manufactured, CE-marked Class IIa medical device',
  ],
  cons: [
    'Single programme — less variety than app-driven competitors',
    'No on-device HRV measurement or session logging',
    '£599 puts it out of reach of casual users',
    'Wired clip is less convenient than a wireless wearable',
  ],
  bestFor: 'Best for research-grade auricular tVNS at home — when evidence matters more than form factor.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, the published Parasym/Nurosym trial record and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 750, note: '£599 — one-time; no subscription', asOf: '2026-05-21' },
  link: 'https://nurosym.com/',
  linkType: 'official',
  content: `## Where it leads

Nurosym wins this comparison on the criterion that matters most for medical devices: evidence. The underlying Parasym hardware has been the experimental platform for dozens of published trials of transcutaneous auricular VNS — stimulating the [vagus nerve](/glossary/vagus-nerve) to shift autonomic balance toward the [parasympathetic](/glossary/parasympathetic-nervous-system) branch, with measured [HRV](/glossary/heart-rate-variability) modulation, inflammatory-marker reduction and long-COVID symptom studies — which no other consumer tVNS device can claim. The parameters are documented (25 Hz pulse, 200–1000 µs pulse width, intensity user-titrated), so a clinician or self-experimenter can describe exactly what dose is being delivered.

## Where it falls short

The same austerity that makes Nurosym credible makes it spartan. There is one stimulation programme, no app, no on-device HRV, no session log, and the unit is tethered to the ear clip by a cable. At £599 it is also the most expensive ear-clip device in this list. If you want guided modes for sleep, focus and stress, Pulsetto offers more programme variety at a lower price — even if its evidence base is thinner.

## Who it is for

Choose Nurosym if you are running a structured tVNS self-experiment, want disclosed parameters you can reference against the literature, and are willing to pay clinical pricing for clinical provenance. If you want a polished consumer experience with modes and a phone app, Pulsetto, Xen by Neuvana or Truvaga are better fits.

---

## Background reading

The biology behind what these devices target — and the protocols that compound with the hardware.

- [Vagus nerve: the master key](/articles/vagus-nerve-master-key) — why the vagus nerve sits upstream of HRV, sleep, mood and inflammation
- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — the regulatory and mechanistic landscape behind non-invasive VNS
- [ACC and coherence monitoring](/articles/anterior-cingulate-core-coherence-monitoring) — how vagal tone shapes attention and emotional regulation upstream
`,
  references: [
    { label: 'Nurosym — official product page', url: 'https://nurosym.com/' },
    { label: 'Transcutaneous auricular VNS — clinical evidence review (Frontiers in Neuroscience)', url: 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2019.00854/full' },
    { label: 'taVNS modulates HRV in healthy participants (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8088823/' },
  ],
  relatedSlugs: ['gammacore-sapphire-cv', 'pulsetto', 'truvaga-350'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default nurosym
