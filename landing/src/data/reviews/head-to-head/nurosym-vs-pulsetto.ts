import type { HeadToHead } from '../types'

const nurosymVsPulsetto: HeadToHead = {
  slug: 'nurosym-vs-pulsetto',
  productASlug: 'nurosym',
  productBSlug: 'pulsetto',
  title: 'Nurosym vs Pulsetto (2026)',
  description:
    'Nurosym vs Pulsetto — side-by-side ONDA comparison of the two leading consumer tVNS devices. Auricular vs cervical, clinical-grade evidence vs accessible price.',
  intro:
    'Nurosym and Pulsetto are the two consumer tVNS devices most users compare against each other. They stimulate different branches of the vagus nerve — Nurosym at the ear (auricular), Pulsetto at the neck (cervical) — and they come from different ends of the market: Nurosym is the rebranded Parasym hardware with the deepest published research base, Pulsetto is the consumer-accessible neck collar with the widest programme variety at a third of the price.',
  winnerSlug: null,
  verdict:
    'Depends on what matters most. Nurosym wins on evidence and disclosed parameters; Pulsetto wins on protocol variety, daily-use form factor and price.',
  bestForA:
    'Choose Nurosym if peer-reviewed evidence and disclosed stimulation parameters are the deciding criteria, and you are running structured tVNS self-experiments where the literature reference matters.',
  bestForB:
    'Choose Pulsetto if you want a polished daily-use cervical tVNS device with four guided programmes at an accessible price, and you are comfortable with a thinner independent-evidence base.',
  axes: [
    { name: 'Stimulation target', winner: 'tie', note: 'Different vagus branches: Nurosym at the auricular branch (ear), Pulsetto at the cervical vagal trunk (neck). Both validated; the cervical approach is more direct, the auricular has the deeper literature.' },
    { name: 'Independent evidence base', winner: 'a', note: 'Nurosym (Parasym hardware): 40+ peer-reviewed trials covering HRV, inflammation, depression, long-COVID. Pulsetto: one published pilot plus company-sponsored studies.' },
    { name: 'Stimulation parameters', winner: 'a', note: 'Nurosym: disclosed (25 Hz, 200–1000 µs). Pulsetto: documented in-app but less granular. Nurosym is the right pick for self-experimenters who reference the literature.' },
    { name: 'Protocol variety', winner: 'b', note: 'Pulsetto: four guided programmes (sleep, stress, anxiety, pain). Nurosym: a single deliberately-spartan programme with user-titrated intensity.' },
    { name: 'Form factor', winner: 'b', note: 'Pulsetto: lightweight neck collar — minimal setup. Nurosym: ear clip with cable tether to the control unit.' },
    { name: 'Regulatory status', winner: 'tie', note: 'Both CE-marked. Nurosym Class IIa medical device; Pulsetto wellness device. Neither FDA-cleared.' },
    { name: 'Price', winner: 'b', note: 'Pulsetto: $269 hardware. Nurosym: £599 (~$750). Pulsetto is roughly a third of the price.' },
  ],
  faq: [
    {
      q: 'Is Nurosym worth nearly three times the price of Pulsetto?',
      a: 'For users running structured tVNS self-experiments where the literature reference matters, yes — Nurosym is the hardware platform behind dozens of published trials, with disclosed pulse parameters you can cite. For users who want a guided daily-use experience, Pulsetto delivers most of the practical effect for a third of the cost.',
    },
    {
      q: 'Auricular vs cervical tVNS — which is better?',
      a: 'Both are validated; the practical difference is form factor and acute effect. The cervical approach (Pulsetto) produces a more direct effect on the vagal trunk; the auricular approach (Nurosym) has the deeper published research base. For most users the form factor decides — an ear clip versus a neck collar.',
    },
    {
      q: 'Are either FDA-cleared?',
      a: 'Neither in the US. Both carry CE marks in Europe — Nurosym as a Class IIa medical device, Pulsetto as a consumer wellness device. The only FDA-cleared non-invasive vagus stimulator is gammaCore (prescription, headache indications only).',
    },
    {
      q: 'Can I combine Nurosym and Pulsetto?',
      a: 'There is no clinical reason not to — they stimulate different branches of the same nerve, and sequential use is harmless. Most users pick one based on form factor and price rather than running both.',
    },
  ],
  content: `## The short version

Nurosym is the clinical-grade auricular tVNS device with the deepest evidence base in consumer tVNS; Pulsetto is the accessible cervical tVNS collar with the widest protocol library at a third of the price. Pick on whether evidence depth or daily-use form factor matters more.

## When Nurosym is the right pick

For self-experimenters and biohackers who want to reference the literature, Nurosym is the right shape. The 25 Hz pulse parameters are disclosed and consistent with the published trial protocols, the hardware is the same platform used in those trials, and the deliberate single-programme spartan UX matches how the research treats the device.

## When Pulsetto is the right pick

For users who want a polished daily-use experience with guided sleep, stress, anxiety and pain programmes, Pulsetto is the right shape. The neck collar is faster to put on than an ear clip, the four-mode library covers the common use cases, and at $269 it is a third of the entry cost of Nurosym.`,
  relatedComparisonSlug: 'best-vagus-nerve-stimulators-2026',
  datePublished: '2026-05-22',
  dateModified: '2026-05-22',
}

export default nurosymVsPulsetto
