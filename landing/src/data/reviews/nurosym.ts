import type { ToolReviewInput } from './types'

const nurosym: ToolReviewInput = {
  slug: 'nurosym',
  name: 'Nurosym',
  brand: 'Parasym Health',
  category: 'vagus-stim',
  productType: 'Auricular tVNS (ear clip)',
  description:
    'ONDA review of the Nurosym — Parasym’s consumer ear tVNS device; earlier Parasym models were used in published cardiovascular, HRV and inflammation-marker trials. Scored on evidence, mechanism, protocols and value.',
  verdict:
    'The most-studied consumer ear tVNS device — an ear clip of the kind used in research studies, with a price to match.',
  summary:
    'Nurosym is the consumer line of Parasym, the London company whose ear stimulators, mostly earlier models, were used in about twenty independent peer-reviewed studies of auricular vagus nerve stimulation (50+ according to the manufacturer, as of October 2026). It clips to the tragus of the left ear and delivers a calibrated electrical pulse to the auricular branch of the vagus nerve. There is no app gimmickry — a single dial, stimulation settings reported in the trials, and the largest independent trial record of any consumer device, though mostly small studies on earlier Parasym models.',
  scores: [
    { criterionId: 'evidence', score: 7.5, note: 'Trials were mostly on Parasym — an earlier version from the same maker, with academic funding — and samples were small; where Nurosym itself is named, results are mostly null. About twenty independent peer-reviewed studies used Parasym ear stimulators (50+ according to the manufacturer, as of October 2026); most had a sham or control arm. None was maker-funded, though Parasym supplied devices for some. The clearest positive results come from small sham-controlled trials in cardiovascular patients on earlier models (AF burden, TNF-alpha, POTS tachycardia, blood pressure). The maker says Nurosym uses the same technology, but no published data show it performs like those models. No trial has depression as its main outcome, and long-COVID data are uncontrolled pilots. ONDA rule: an earlier version of the same device counts when the maker and the stimulation method are the same, capped at 7.5.' },
    { criterionId: 'mechanism', score: 9.0, note: 'Transcutaneous auricular VNS at the tragus, the most-studied non-invasive target, The trials that name Nurosym report its frequency and pulse width (20–25 Hz, 200–250 µs); the waveform itself is proprietary.' },
    { criterionId: 'protocols', score: 7.0, note: 'A single, well-defined stimulation programme; intensity is dialled by the user. Less programme variety than Pulsetto, but the frequency and pulse width are reported in the trials.' },
    { criterionId: 'comfort', score: 7.5, note: 'A tragus clip is well-tolerated for 30–60 minute sessions; not designed for hours of wear, and the cable tethers you to the unit.' },
    { criterionId: 'biofeedback', score: 6.5, note: 'No built-in HRV measurement — pair with a chest strap or ring for closed-loop tracking.' },
    { criterionId: 'value', score: 6.0, note: '€700 (about $820; US pricing varies by region) one-time, no subscription. Premium pricing for the largest independent trial record (mostly earlier Parasym models), not for casual experimenters.' },
  ],
  pros: [
    'Largest independent trial record of any consumer tVNS device (mostly earlier Parasym models)',
    'Frequency and pulse width reported in trials (waveform proprietary)',
    'No subscription, no app required to use',
    'CE-marked medical device (Class IIa per the maker)',
  ],
  cons: [
    'Single programme — less variety than app-driven competitors',
    'No on-device HRV measurement or session logging',
    '€700 (about $820) puts it out of reach of casual users',
    'Wired clip is less convenient than a wireless wearable',
  ],
  bestFor: 'Best for auricular tVNS of the kind used in research, at home — when evidence matters more than form factor.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, the published Parasym/Nurosym trial record and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 820, note: '€700 list on nurosym.com (≈$820; regional pricing varies) — one-time; no subscription; 2-year warranty', asOf: '2026-10-01' },
  link: 'https://nurosym.com/',
  linkType: 'official',
  content: `## Where it leads

Among consumer devices, Nurosym leads on the criterion that matters most for medical devices: evidence. Parasym devices, mostly earlier models, were used in about twenty independent published studies of transcutaneous auricular VNS — stimulating the [vagus nerve](/glossary/vagus-nerve). The clearest positive results come from small sham-controlled trials in cardiovascular patients (atrial fibrillation, POTS, high blood pressure). There are also acute [HRV](/glossary/heart-rate-variability) studies in healthy adults and uncontrolled long-COVID pilots. The newer trials that name Nurosym (2025–26) mostly found no effect versus sham, and although the maker says Nurosym uses the same technology, no published data show it performs like the older models — so ONDA caps its evidence score at 7.5. Being studied is not the same as being proven, though: a living meta-analysis of 16 sham-controlled studies in healthy people (Wolf 2021, *Psychophysiology*) found no reliable effect of ear tVNS on vagally mediated HRV, so do not buy it expecting your HRV to rise. The trials that name Nurosym report its frequency and pulse width (20–25 Hz, 200–250 µs; intensity user-titrated), so a clinician or self-experimenter can describe most of the dose — the waveform itself is proprietary.

## What are the downsides of Nurosym?

The same austerity that makes Nurosym credible makes it spartan. There is one stimulation programme, no app, no on-device HRV, no session log, and the unit is tethered to the ear clip by a cable. At €700 (about $820) it is also the most expensive ear-clip device in this list. If you want guided modes for sleep, focus and stress, Pulsetto offers more programme variety at a lower price — even if its evidence base is thinner.

## Who should buy Nurosym?

Choose Nurosym if you are running a structured tVNS self-experiment, want stimulation settings you can match against the published trials, and are willing to pay clinical pricing for clinical provenance. If you want a polished consumer experience with modes and a phone app, Pulsetto, Xen by Neuvana or Truvaga are better fits.

---

## Background reading

The biology behind what these devices target — and the protocols that compound with the hardware.

- [Vagus nerve exercises](/articles/vagus-nerve-exercises) — why the vagus nerve sits upstream of HRV, sleep, mood and inflammation
- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — the regulatory and mechanistic landscape behind non-invasive VNS
- [ACC and coherence monitoring](/articles/anterior-cingulate-core-coherence-monitoring) — how vagal tone shapes attention and emotional regulation upstream
`,
  references: [
    { label: 'Nurosym — official product page', url: 'https://nurosym.com/' },
    { label: 'Kaniusas et al. 2019 — auricular VNS from a physiological perspective (Frontiers in Neuroscience; not a Nurosym study; authors tied to SzeleSTIM, another ear-VNS maker)', url: 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2019.00854/full' },
    { label: 'Wolf et al. 2021 — Does transcutaneous auricular vagus nerve stimulation affect vagally mediated heart rate variability? A living Bayesian meta-analysis (Psychophysiology)', url: 'https://doi.org/10.1111/psyp.13933' },
  ],
  relatedSlugs: ['gammacore-sapphire-cv', 'pulsetto', 'truvaga-350'],
  faq: [
    { q: "Is Nurosym worth it?", a: "Nurosym is worth it if evidence matters more than form factor. It has the largest independent trial record of any consumer tVNS device (mostly earlier Parasym models), frequency and pulse width reported in trials, and is a CE-marked medical device (Class IIa per the maker). Expect a single programme and a wired ear clip." },
    { q: "How much does Nurosym cost?", a: "Nurosym is listed at €700 on the official store, about $820 (regional pricing varies), as a one-time purchase with no subscription and no app required to use it. The review notes that price puts it out of reach of casual users. It is CE-marked (Class IIa per the maker)." },
    { q: "What are the downsides of Nurosym?", a: "Nurosym offers a single programme with less variety than app-driven competitors, no on-device HRV measurement or session logging, a €700 (about $820) price that puts it out of reach of casual users, and a wired clip that is less convenient than a wireless wearable." },
    { q: "Nurosym vs Pulsetto: which is better?", a: "Nurosym is better for evidence: it has the largest independent trial record in consumer tVNS (mostly on earlier Parasym models). Pulsetto is cheaper at $269, is neck-worn and offers four guided programmes, but its independent clinical evidence is thinner than Nurosym's." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-10-10',
}

export default nurosym
