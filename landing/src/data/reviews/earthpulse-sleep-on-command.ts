import type { ToolReviewInput } from './types'

const earthpulse: ToolReviewInput = {
  slug: 'earthpulse-sleep-on-command',
  name: 'EarthPulse Sleep on Command',
  brand: 'EarthPulse',
  category: 'pemf',
  productType: 'Sleep-focused under-mattress PEMF device',
  description:
    'ONDA review of the EarthPulse Sleep on Command — under-mattress PEMF device targeted at sleep onset, deep sleep and recovery. Scored on field strength, waveform research, build and value.',
  verdict:
    'Sleep-focused PEMF — under-mattress install, Schumann-resonance protocols, mid-tier pricing. Narrow use case but executed well.',
  summary:
    'EarthPulse Sleep on Command is the sleep-niche PEMF device — sits under your mattress, runs Schumann-resonance (7.83 Hz) and delta-band frequency protocols overnight. Designed for sleep onset and deep-sleep enhancement rather than recovery sessions. Single applicator, single use case, accessible $899 pricing.',
  scores: [
    { criterionId: 'field-strength', score: 7.0, note: 'Moderate field intensity tuned for overnight low-dose exposure. Designed for hours-of-use sleep protocols, not high-intensity recovery sessions.' },
    { criterionId: 'waveform-evidence', score: 7.5, note: 'Schumann 7.83 Hz and delta-band sleep frequencies — well-documented in PEMF and sleep literature. Specific to the sleep use case.' },
    { criterionId: 'build', score: 7.5, note: 'Solid build for under-mattress install. Multi-decade EarthPulse brand pedigree in sleep-focused PEMF. 1-year warranty.' },
    { criterionId: 'programmability', score: 7.0, note: 'Sleep-stage-aligned preset protocols (sleep onset, deep sleep, recovery). Limited parameter customisation beyond presets.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Under-mattress install — set once, runs overnight. Best form factor for sleep-protocol use. Not suitable for active recovery sessions.' },
    { criterionId: 'value', score: 7.5, note: '$899 — accessible pricing for a narrow but well-executed use case.' },
  ],
  pros: [
    'Under-mattress install — set once, runs overnight',
    'Schumann 7.83 Hz and delta-band sleep protocols',
    'Accessible $899 pricing',
    'Multi-decade brand pedigree in sleep PEMF',
  ],
  cons: [
    'Narrow use case — sleep only, not active recovery',
    'No multi-applicator coverage for daytime sessions',
    'Limited parameter customisation',
    'Smaller community / brand recognition than Bemer',
  ],
  bestFor: 'Best for users buying PEMF specifically for sleep enhancement (sleep onset, deep sleep, overnight recovery) rather than active session-based recovery use.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from EarthPulse product documentation and 2026 sleep-PEMF user reviews. Not hands-on tested by ONDA.',
  price: { usd: 899, note: 'standalone under-mattress unit', asOf: '2026-05-27' },
  link: 'https://earthpulse.net/',
  linkType: 'official',
  content: `## Where it leads

EarthPulse Sleep on Command is the sleep-niche PEMF reference — under-mattress install, Schumann and delta-band overnight protocols, accessible $899 pricing. Best execution of the sleep-specific PEMF use case.

## What are the downsides of EarthPulse Sleep on Command?

Single use case. EarthPulse is built for sleep — it's not a daytime recovery mat or a spot-treatment coil. Users wanting general recovery PEMF should look elsewhere.

## Who should buy EarthPulse Sleep on Command?

Choose EarthPulse if your PEMF thesis is sleep — under-mattress install, overnight Schumann/delta protocols, set-once daily use. For general daytime recovery, OMI or Healthy Wave. For Bemer-style biorhythmic protocols, Bemer Classic Evo.

---

## Background reading

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep) — overnight entrainment paired with PEMF
- [Does sleep really clean your brain? The glymphatic evidence](/articles/nightly-flush-glymphatic-neural-cache) — what is shown in people, and what is still disputed
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors)
`,
  references: [
    { label: 'EarthPulse — official site', url: 'https://earthpulse.net/' },
  ],
  relatedSlugs: ['bemer-classic-evo', 'omi-full-body-mat', 'resona-health-vibe'],
  publishOn: '2026-06-22',
  faq: [
    { q: "Is the EarthPulse Sleep on Command worth it?", a: "Yes, if you want PEMF specifically for sleep. EarthPulse sits under your mattress and runs Schumann 7.83 Hz and delta-band protocols overnight for $899. It is not worth it for active recovery, because it is sleep-only with a single applicator." },
    { q: "How much does the EarthPulse Sleep on Command cost?", a: "The EarthPulse Sleep on Command costs $899 for the standalone under-mattress unit. That is accessible pricing within PEMF, compared with multi-applicator systems such as the Bemer Classic Evo at $5,490. It installs under the mattress and runs overnight." },
    { q: "What are the downsides of the EarthPulse Sleep on Command?", a: "EarthPulse has a narrow use case: sleep only, not active recovery. It offers no multi-applicator coverage for daytime sessions, limited parameter customisation, and smaller community and brand recognition than Bemer. Within sleep, though, it is executed well." },
    { q: "Who is the EarthPulse Sleep on Command best for?", a: "EarthPulse is best for people buying PEMF specifically for sleep enhancement, including sleep onset, deep sleep and overnight recovery. It suits users who want to set it once under the mattress rather than run daytime sessions." },
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-06-22',
}

export default earthpulse
