import type { ToolReview } from './types'

const qiCoil: ToolReview = {
  slug: 'qi-coil',
  name: 'Qi Coil',
  brand: 'Qi Life (Resonant Frequencies)',
  category: 'pemf',
  productType: 'Rife/“scalar” frequency device marketed as PEMF',
  description:
    'Qi Coil review: a Rife/“scalar” frequency device marketed as PEMF — low disclosed field, black-box presets, $797–$9,995. No credible evidence for the core claims.',
  verdict:
    'Marketed as PEMF but built on Rife-frequency and “scalar” claims with no credible evidence — undisclosed field parameters, black-box presets, extreme pricing. A real PEMF mat does more, with actual specs, for less.',
  summary:
    'Qi Coil is the coil-plus-app product from Qi Life (founder David Wong). It converts audio “frequencies” into an electromagnetic field and ships a library of 10,000+ Rife-style frequency programs via the Resonant Console app, with higher tiers adding “scalar” and “medbed” marketing. It is sold as PEMF, but its foundation is Rife and scalar-energy theory — neither of which has credible clinical support. The company does not disclose a PEMF frequency range or waveform; a compact ~15 Gauss field is claimed. Pricing runs from $797 (Mini) to $4,995 (3S) and $9,995 (Max Scalar). As a PEMF device specifically, it is low-field, black-box and extremely priced.',
  overallScore: 3.0,
  scores: [
    { criterionId: 'field-strength', score: 3.5, note: 'A compact ~15 Gauss field is claimed, but no waveform, frequency range or intensity is disclosed — the specs a PEMF buyer needs to compare are simply absent. The marketing is about “10,000 frequencies” (audio/Rife framing), not field parameters.' },
    { criterionId: 'waveform-evidence', score: 1.5, note: 'The core is Rife-frequency and “scalar energy” theory. There is no reliable evidence that Rife devices treat any condition (Cancer Research UK), and scalar energy is not recognised by mainstream physics. Claims are anecdotal, with no peer-reviewed support for the device.' },
    { criterionId: 'build', score: 5.0, note: 'Hardware is a portable coil paired to a phone app; a range of tiers and cases exist. Build quality is not independently verified here and customer experiences are mixed.' },
    { criterionId: 'programmability', score: 4.5, note: 'A very large preset library (10,000+ programs) — but black-box: the presets are Rife/audio “frequencies”, and no PEMF parameters (waveform, Hz range, intensity) are exposed to inspect or match to research.' },
    { criterionId: 'form-factor', score: 5.5, note: 'Portable coil, app-controlled, with a claimed field reach of a few feet. Genuinely convenient as an object; the higher “Aura” tiers move to large room-scale units.' },
    { criterionId: 'value', score: 1.5, note: '$797 (Mini) to $4,995 (3S) and $9,995 (Max Scalar), with room-scale Aura units advertised around $9,000. Extreme pricing for a modality with no credible evidence and undisclosed PEMF specs — poor value on any objective read.' },
  ],
  pros: [
    'Portable, genuinely convenient coil-plus-app form factor',
    'Very large preset library and an active user community',
  ],
  cons: [
    'Core mechanism is Rife/“scalar” theory — no credible clinical evidence (Cancer Research UK on Rife; scalar not recognised by mainstream physics)',
    'No disclosed PEMF waveform, frequency range or intensity — impossible to compare on the specs that matter',
    'Extreme pricing ($797–$9,995) for what is delivered',
    '“Medbed”/“scalar” marketing overstates what any consumer coil can do',
  ],
  bestFor:
    'Hard to recommend for evidence-led buyers. If you want a portable frequency gadget and a large preset library for subjective, ritual use — and the price is not an obstacle — it is that. For actual PEMF with disclosed parameters and better value, look elsewhere.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Qi Life’s own product/marketing materials, public pricing and the published evidence base for Rife and scalar-energy claims. Not hands-on tested by ONDA.',
  price: { usd: 797, note: 'Mini system; 3S $4,995, Max Scalar $9,995', asOf: '2026-09-06' },
  link: 'https://qilifestore.com/collections/qi-coils',
  linkType: 'official',
  content: `## What it actually is

Qi Coil is sold under the PEMF banner, but its foundation is **Rife-frequency** and **“scalar energy”** theory. The pitch is a coil plus the Resonant Console app, with a library of 10,000+ “frequency programs” you play into an electromagnetic field, and higher tiers layered with “scalar” and “medbed” language. That framing — audio “frequencies” for named conditions — is Rife, not PEMF as the recovery literature uses the term.

## The evidence problem

This is where it fails an evidence-first read. There is no reliable evidence that Rife devices treat any disease ([Cancer Research UK](https://www.cancerresearchuk.org/about-cancer/treatment/complementary-alternative-therapies/individual-therapies/rife-machine-and-cancer)), and **scalar energy is not recognised within mainstream physics** in the form marketed. The device’s own claims are anecdotal, and the company does not publish a PEMF frequency range or waveform — so there is nothing to check against the actual PEMF research (Schumann band, bone-healing frequencies, etc.).

## As a PEMF device

Judged as PEMF specifically, the numbers a buyer needs are missing: no disclosed waveform, no frequency range, no intensity beyond a compact ~15 Gauss claim. A legitimate mat like the [Healthy Wave Multi-Wave](/reviews/healthy-wave-multi-wave) exposes real parameters and stacks PEMF + infrared + red light for less than the mid Qi Coil tiers; the [Bemer Classic Evo](/reviews/bemer-classic-evo) has an actual published-signal research base. Qi Coil offers neither.

## Who it is for

Only for someone who wants a portable frequency gadget and a big preset library for subjective, ritual use, and to whom the price is not an obstacle. For PEMF chosen on evidence and disclosed specs, see the [best PEMF devices](/reviews/pemf-devices) — start with Healthy Wave or Bemer.
`,
  references: [
    { label: 'Qi Life Store — official Qi Coil collection', url: 'https://qilifestore.com/collections/qi-coils' },
    { label: 'Cancer Research UK — Rife machines (no reliable evidence)', url: 'https://www.cancerresearchuk.org/about-cancer/treatment/complementary-alternative-therapies/individual-therapies/rife-machine-and-cancer' },
    { label: 'Medical News Today — Rife machine for cancer: does it work?', url: 'https://www.medicalnewstoday.com/articles/325628' },
  ],
  relatedSlugs: ['healthy-wave-multi-wave', 'bemer-classic-evo', 'higherdose-pemf-mat', 'resona-health-vibe'],
  publishOn: '2026-09-06',
  datePublished: '2026-09-06',
  dateModified: '2026-09-06',
}

export default qiCoil
