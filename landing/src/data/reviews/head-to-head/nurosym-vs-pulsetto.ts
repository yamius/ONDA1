import type { HeadToHeadInput } from '../types'

const nurosymVsPulsetto: HeadToHeadInput = {
  slug: 'nurosym-vs-pulsetto',
  productASlug: 'nurosym',
  productBSlug: 'pulsetto',
  title: 'Nurosym vs Pulsetto (2026)',
  description:
    'Nurosym vs Pulsetto — side-by-side ONDA comparison of the two leading consumer tVNS devices. Auricular vs cervical, clinical-grade evidence vs accessible price.',
  intro:
    'Nurosym and Pulsetto are the two consumer tVNS devices most users compare against each other. They stimulate different branches of the vagus nerve — Nurosym at the ear (auricular), Pulsetto at the neck (cervical) — and they come from different ends of the market: Nurosym is the consumer line of Parasym’s ear stimulator, with the deepest published research base (mostly on earlier Parasym models), Pulsetto is the consumer-accessible neck collar with the widest programme variety at a third of the price.',
  jobDependentVerdict: true,
  verdict:
    'Depends on what matters most. Nurosym wins on evidence and disclosed parameters; Pulsetto wins on protocol variety, daily-use form factor and price.',
  bestForA:
    'Choose Nurosym if peer-reviewed evidence and disclosed stimulation parameters are the deciding criteria, and you are running structured tVNS self-experiments where the literature reference matters.',
  bestForB:
    'Choose Pulsetto if you want a polished daily-use cervical tVNS device with four guided programmes at an accessible price, and you are comfortable with a thinner independent-evidence base.',
  axes: [
    { name: 'Stimulation target', winner: 'tie', note: 'Different vagus branches: Nurosym at the auricular branch (ear), Pulsetto at the cervical vagal trunk (neck). Both studied, neither proven for wellness use; the cervical approach is more direct, the auricular has the deeper literature.' },
    { name: 'Independent evidence base', winner: 'a', note: 'Nurosym: about twenty independent peer-reviewed studies of Parasym devices (50+ according to the manufacturer, as of October 2026), mostly on earlier models; no depression trial and only uncontrolled long-COVID pilots. Pulsetto: one published pilot plus company-sponsored studies.' },
    { name: 'Stimulation parameters', winner: 'a', note: 'Nurosym: trials that name it report 20–25 Hz and 200–250 µs; waveform proprietary. Pulsetto: documented in-app but less granular. Nurosym is the right pick for self-experimenters who reference the literature.' },
    { name: 'Protocol variety', winner: 'b', note: 'Pulsetto: four guided programmes (sleep, stress, anxiety, pain). Nurosym: a single deliberately-spartan programme with user-titrated intensity.' },
    { name: 'Form factor', winner: 'b', note: 'Pulsetto: lightweight neck collar — minimal setup. Nurosym: ear clip with cable tether to the control unit.' },
    { name: 'Regulatory status', winner: 'tie', note: 'Both CE-marked. Nurosym a medical device (Class IIa per the maker); Pulsetto wellness device. Neither FDA-cleared.' },
    { name: 'Price', winner: 'b', note: 'Pulsetto: $269 hardware. Nurosym: €700 (~$820). Pulsetto costs roughly a third of the price.' },
  ],
  faq: [
    {
      q: 'Is Nurosym worth nearly three times the price of Pulsetto?',
      a: 'For users running structured tVNS self-experiments where the literature reference matters, yes — Parasym devices, mostly earlier models, were used in about twenty independent published studies, and the trials report stimulation settings you can cite. For users who want a guided daily-use experience, Pulsetto costs a third as much; neither device’s wellness benefit is proven.',
    },
    {
      q: 'Auricular vs cervical tVNS — which is better?',
      a: 'Neither is proven for wellness use; the practical difference is form factor. The cervical approach (Pulsetto) targets the vagal trunk more directly; the auricular approach (Nurosym) has the deeper published research base. For most users the form factor decides — an ear clip versus a neck collar.',
    },
    {
      q: 'Are either FDA-cleared?',
      a: 'Neither in the US. Both carry CE marks in Europe — Nurosym as a medical device (Class IIa per the maker), Pulsetto as a consumer wellness device. The only FDA-cleared non-invasive vagus stimulator is gammaCore (prescription, headache indications only).',
    },
    {
      q: 'Can I combine Nurosym and Pulsetto?',
      a: 'There is no clinical reason not to — they stimulate different branches of the same nerve, and sequential use is harmless. Most users pick one based on form factor and price rather than running both.',
    },
  ],
  content: `## The short version

Nurosym is the auricular tVNS device with the largest independent trial record in consumer tVNS (mostly earlier Parasym models); Pulsetto is the accessible cervical tVNS collar with the widest protocol library at a third of the price. Pick on whether evidence depth or daily-use form factor matters more.

## When is Nurosym the right pick?

For self-experimenters and biohackers who want to reference the literature, Nurosym is the right shape. The trials that name Nurosym used 20–25 Hz and 200–250 µs, close to the 20 Hz and 200 µs of the main Parasym heart trials, and the maker says Nurosym uses the same AVNT technology as the earlier Parasym devices (company-stated; no published equivalence data), and the deliberate single-programme spartan UX matches how the research treats the device.

## When is Pulsetto the right pick?

For users who want a polished daily-use experience with guided sleep, stress, anxiety and pain programmes, Pulsetto is the right shape. The neck collar is faster to put on than an ear clip, the four-mode library covers the common use cases, and at $269 it is a third of the entry cost of Nurosym.`,
  relatedComparisonSlug: 'best-vagus-nerve-stimulators-2026',
  datePublished: '2026-05-22',
  dateModified: '2026-10-10',
}

export default nurosymVsPulsetto
