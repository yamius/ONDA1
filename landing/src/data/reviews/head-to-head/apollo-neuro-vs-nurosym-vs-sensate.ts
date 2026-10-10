import type { HeadToHeadInput } from '../types'

const apolloVsNurosymVsSensate: HeadToHeadInput = {
  slug: 'apollo-neuro-vs-nurosym-vs-sensate',
  productASlug: 'apollo-neuro',
  productBSlug: 'nurosym',
  productCSlug: 'sensate',
  title: 'Apollo Neuro vs Nurosym vs Sensate (2026)',
  description:
    'Apollo vs Nurosym vs Sensate — three-way ONDA comparison of three vagus-targeting modalities. Vibrotactile all-day, clinical auricular tVNS and infrasonic chest device in one decision.',
  intro:
    'Apollo Neuro, Nurosym and Sensate are the three consumer vagus-targeting devices users compare across mechanisms. Three different approaches to the same nerve: Apollo uses vibration on the skin (an indirect, proposed route), Nurosym delivers direct electrical stimulation to the auricular branch, Sensate uses infrasonic thoracic resonance. Same goal, three independent mechanisms.',
  verdict:
    'Nurosym wins on evidence and mechanism directness for serious users. Apollo wins for all-day wearability. Sensate wins as a focused evening ritual.',
  bestForA:
    'Choose Apollo Neuro if you want vagal modulation through the entire day — work, sleep, training — with no electrodes and the strongest non-electrical research base.',
  bestForB:
    'Choose Nurosym if peer-reviewed evidence and direct electrical stimulation are the deciding criteria — the largest independent auricular tVNS trial record in consumer devices (mostly on earlier Parasym models).',
  bestForC:
    'Choose Sensate if a focused evening wind-down ritual is the primary use case — soundscape-paired infrasonic sessions on the chest.',
  axes: [
    { name: 'Mechanism directness', winner: 'b', note: 'Nurosym: direct electrical stimulation of the auricular vagal branch — the most direct of the three. Apollo: vibrotactile, indirect via mechanoreceptors. Sensate: infrasonic chest resonance, also indirect.' },
    { name: 'Independent evidence', winner: 'b', note: 'Nurosym: about twenty independent peer-reviewed studies of Parasym devices (50+ according to the manufacturer, as of October 2026), mostly on earlier models. Apollo: University of Pittsburgh HRV/recovery RCTs. Sensate: one pilot plus company studies. Nurosym leads.' },
    { name: 'Acute effect strength', winner: 'tie', note: 'No trial compares them. Nurosym stimulates the nerve electrically, but its acute HRV data are one small sham crossover on an earlier Parasym model (Geng 2022, n=14, HRV rose). None of the trials that name Nurosym reports an HRV result, and a meta-analysis of 16 sham-controlled ear-tVNS studies (Wolf 2021) found no reliable effect. Apollo and Sensate are gentler, non-electrical routes by design.' },
    { name: 'All-day wearability', winner: 'a', note: 'Apollo: wrist/ankle/clip-on, 24/7 wear. Nurosym: 30–60 minute clip-on sessions. Sensate: chest sessions, sit-down only.' },
    { name: 'Setup friction', winner: 'a', note: 'Apollo: put it on. Sensate: chest placement + headphones. Nurosym: ear clip with cable tether to control unit.' },
    { name: 'Evening wind-down fit', winner: 'c', note: 'Sensate’s soundscape-paired sessions are the most pleasant pre-sleep ritual in this group. Apollo runs ambient overnight; Nurosym is too active for sleep.' },
    { name: 'Disclosed parameters', winner: 'b', note: 'Trials that name Nurosym report 20–25 Hz and 200–250 µs; its waveform is proprietary. Apollo and Sensate document their programmes but stimulation parameters are less granular.' },
    { name: 'Price (hardware)', winner: 'c', note: 'Sensate: $299. Apollo: $448 (incl. 1-year membership). Nurosym: €700 (~$820). Sensate is cheapest; Nurosym premium-priced for its evidence base.' },
  ],
  faq: [
    {
      q: 'Apollo Neuro vs Nurosym vs Sensate — which works best?',
      a: 'Three different jobs. Apollo for all-day passive vagal modulation. Nurosym for direct auricular tVNS with the largest independent trial record (mostly earlier Parasym models). Sensate for an evening wind-down ritual with paired soundscapes. None substitutes for the others.',
    },
    {
      q: 'Are all three really vagus nerve stimulators?',
      a: 'Only Nurosym is electrical tVNS in the strict sense — direct stimulation of the auricular vagal branch. Apollo works through vibration on the skin and Sensate through infrasonic sound on the chest — both indirect, proposed routes with limited evidence. Individual studies report HRV shifts for each, but a sham-controlled meta-analysis of ear tVNS (Wolf 2021) found no reliable effect on vagally mediated HRV, so treat HRV gains from any of them as unproven.',
    },
    {
      q: 'Which has the strongest evidence?',
      a: 'Nurosym, by a meaningful margin. The Parasym hardware behind Nurosym, mostly in earlier models, appears in about twenty independent peer-reviewed studies (50+ according to the manufacturer, as of October 2026). Apollo Neuro is second with University of Pittsburgh RCTs. Sensate is third with one published pilot plus company-funded studies.',
    },
    {
      q: 'Can I sleep with any of these?',
      a: 'Apollo Neuro — yes, designed for overnight wear with a dedicated sleep mode. Nurosym — no, ear-clip sessions are 30–60 minutes. Sensate — no, sit-down sessions only.',
    },
    {
      q: 'Should I get more than one?',
      a: 'Many committed users do — Apollo as daily passive baseline, Sensate as evening ritual, Nurosym for targeted electrical sessions. The mechanisms layer because they hit different pathways at different times of day.',
    },
  ],
  content: `## The short version

Three independent mechanisms targeting the same nerve. Apollo is all-day vibrotactile, Nurosym is direct electrical, Sensate is infrasonic-and-soundscape ritual. Pick on which mechanism fits your routine.

## When is Apollo Neuro the right pick?

If you want vagal modulation that runs through your day without ceremony, Apollo is the right shape. The vibrotactile mechanism is indirect but real, the University of Pittsburgh evidence is solid, and 24/7 wearability is the use case.

## When is Nurosym the right pick?

If you are running structured tVNS self-experiments, want stimulation settings reported in trials, and value the largest independent evidence record, Nurosym is the right shape. Parasym devices, mostly earlier models, are the most-studied consumer auricular tVNS platform; the trials that name Nurosym itself were mostly null.

## When is Sensate the right pick?

If a pleasant focused evening wind-down ritual is what you want, Sensate is the right shape. The soundscape-paired infrasonic sessions are the most enjoyable experience in this group; the trade is sit-down session-based use only.`,
  relatedComparisonSlug: 'best-vagus-nerve-stimulators-2026',
  publishOn: '2026-06-04',
  datePublished: '2026-06-04',
  dateModified: '2026-10-10',
}

export default apolloVsNurosymVsSensate
