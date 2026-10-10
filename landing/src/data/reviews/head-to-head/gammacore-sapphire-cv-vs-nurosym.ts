import type { HeadToHeadInput } from '../types'

const gammacoreVsNurosym: HeadToHeadInput = {
  slug: 'gammacore-sapphire-cv-vs-nurosym',
  productASlug: 'gammacore-sapphire-cv',
  productBSlug: 'nurosym',
  title: 'gammaCore Sapphire CV vs Nurosym (2026)',
  description:
    'gammaCore Sapphire CV vs Nurosym — side-by-side ONDA comparison of FDA-cleared prescription cervical tVNS versus the consumer auricular tVNS with the largest independent trial record.',
  intro:
    'gammaCore Sapphire CV and Nurosym are the two non-invasive vagus stimulators serious users compare when evidence depth is the deciding criterion. They target different branches of the vagus nerve — gammaCore at the cervical trunk, Nurosym at the auricular branch — and sit at opposite ends of the regulatory spectrum. gammaCore is FDA-cleared and prescription-only for migraine and cluster headache; Nurosym is consumer-accessible with the deepest published auricular tVNS evidence.',
  jobDependentVerdict: true,
  verdict:
    'Different roles. gammaCore for clinically-indicated headache patients with prescriber access. Nurosym for self-directed consumer tVNS users who want reported stimulation settings and the largest consumer trial record (mostly earlier Parasym models).',
  bestForA:
    'Choose gammaCore Sapphire CV if you have a migraine or cluster-headache diagnosis and a prescriber willing to write for it — the only FDA-cleared non-invasive VNS device.',
  bestForB:
    'Choose Nurosym if you want auricular tVNS at home, with the largest independent trial record of any consumer device (mostly earlier Parasym models), and you do not have an FDA-indication condition.',
  axes: [
    { name: 'Regulatory status', winner: 'tie', note: 'gammaCore Sapphire CV: FDA-cleared (prescription) for migraine (prevention and acute treatment, age 12+), cluster headache, paroxysmal hemicrania and hemicrania continua. Nurosym: CE-marked in Europe (Class IIa per the maker), not FDA-cleared. Regulatory status is a fact, not a score — FDA status is neutral in ONDA scores.' },
    { name: 'Stimulation target', winner: 'a', note: 'gammaCore: cervical vagal trunk directly (most direct possible non-invasive target). Nurosym: auricular branch (the most-studied non-invasive target).' },
    { name: 'Trial evidence — within indication', winner: 'a', note: 'gammaCore: 30+ randomised trials for migraine/cluster headache, the regulatory reference. Nurosym hardware: about twenty independent device studies (50+ according to the manufacturer, as of October 2026), small and mostly on earlier Parasym models.' },
    { name: 'Trial evidence — outside indication', winner: 'b', note: 'For HRV, stress, inflammation, depression — Nurosym hardware has the deeper published literature. gammaCore is studied specifically for headache.' },
    { name: 'Consumer accessibility', winner: 'b', note: 'gammaCore: prescription-only in the US, gated by a clinician. Nurosym: direct-to-consumer, CE-marked.' },
    { name: 'Protocol variety', winner: 'b', note: 'gammaCore: fixed 2-minute sessions, clinician-calibrated dose, no programme variety. Nurosym: single user-titrated programme with disclosed parameters.' },
    { name: 'Cost', winner: 'b', note: 'gammaCore: ~$600 device + refill cards, insurance coverage uneven. Nurosym: €700 (~$820) one-time, no refills. Nurosym costs a little more upfront but wins on long-term ownership without refills.' },
    { name: 'Disclosed parameters', winner: 'tie', note: 'Both have known stimulation parameters. gammaCore’s 5 kHz burst is fixed; trials that name Nurosym report 20–25 Hz and 200–250 µs with user-titrated intensity, though its waveform is proprietary.' },
  ],
  faq: [
    {
      q: 'Is gammaCore better than Nurosym?',
      a: 'For migraine and cluster headache, yes — gammaCore is the FDA-cleared reference and has the regulatory trial base for those specific indications. For general autonomic uses Nurosym has the broader device record (small studies, mostly on earlier Parasym models) and you can buy it without a prescription; for stress or anxiety in healthy people neither device has strong evidence.',
    },
    {
      q: 'Do I need a prescription for gammaCore?',
      a: 'Yes — gammaCore Sapphire CV is prescription-only in the US, written by a clinician for migraine or cluster-headache indications. Nurosym is consumer-accessible without a prescription.',
    },
    {
      q: 'Which has more research behind it?',
      a: 'They are studied for different things. gammaCore has 30+ randomised trials specifically for migraine and cluster headache — the regulatory reference. The Nurosym (Parasym) hardware, mostly in earlier models, appears in about twenty independent published studies (50+ according to the manufacturer, as of October 2026), with heart-rhythm, blood-pressure, inflammation-marker and acute HRV results; there is no depression trial and only uncontrolled long-COVID pilots. Different domains.',
    },
    {
      q: 'Are gammaCore and Nurosym hitting the same nerve?',
      a: 'The same nerve, different branches. gammaCore stimulates the cervical vagal trunk directly through the side of the neck; Nurosym stimulates the auricular branch through the tragus of the ear. The cervical approach is more direct; the auricular approach has the deeper non-invasive research base.',
    },
  ],
  content: `## The short version

gammaCore and Nurosym are the two non-invasive vagus stimulators with real evidence behind them — and they target different conditions. gammaCore for clinical headache indications with a prescription; Nurosym for self-directed consumer tVNS with the deepest non-indication-specific evidence base.

## When is gammaCore the right pick?

If you have a diagnosed migraine or cluster-headache condition and a clinician willing to prescribe, gammaCore is the right tool. The FDA clearance and the headache-specific trial base are the value. For general wellness, autonomic modulation or HRV training, it is the wrong shape — the indication is narrow on purpose.

## When is Nurosym the right pick?

If you want evidence-led tVNS at home without going through a clinician — for HRV training, stress modulation, sleep-onset work, anxiety-related self-experimentation — Nurosym is the right shape. Parasym devices, mostly earlier models, appear in about twenty independent studies; the clearest results are in cardiovascular patients, and trials in healthy users are few and small, with mixed results. The trials report the frequency and pulse width; no prescription gate.`,
  relatedComparisonSlug: 'best-vagus-nerve-stimulators-2026',
  datePublished: '2026-05-22',
  dateModified: '2026-10-10',
}

export default gammacoreVsNurosym
