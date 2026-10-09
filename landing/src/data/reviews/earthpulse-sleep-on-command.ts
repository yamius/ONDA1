import type { ToolReviewInput } from './types'

const earthpulse: ToolReviewInput = {
  slug: 'earthpulse-sleep-on-command',
  name: 'EarthPulse Sleep on Command',
  brand: 'EarthPulse',
  category: 'pemf',
  productType: 'Sleep-focused under-mattress PEMF device',
  description:
    'ONDA review of the EarthPulse Sleep on Command — under-mattress PEMF device marketed for sleep onset, deep sleep and recovery. Scored on field strength, waveform research, build and value.',
  verdict:
    'Sleep-marketed PEMF — under-mattress install, Schumann and delta settings, mid-tier pricing. Well built, but no controlled trials show better sleep.',
  summary:
    'EarthPulse Sleep on Command is the sleep-niche PEMF device — sits under your mattress, runs Schumann-resonance (7.83 Hz) and delta-band frequency settings overnight. The maker markets it for sleep onset and deep sleep; we found no controlled human trials showing better sleep from these settings. Single applicator, single use case, accessible $899 pricing.',
  scores: [
    { criterionId: 'field-strength', score: 7.0, note: 'Moderate field intensity tuned for overnight low-dose exposure. Designed for hours-of-use sleep protocols, not high-intensity recovery sessions.' },
    { criterionId: 'waveform-evidence', score: 7.0, note: 'EarthPulse markets Schumann (7.83 Hz) and delta settings for sleep. We found no controlled human trials showing better sleep from these settings, and none of the device itself.' },
    { criterionId: 'build', score: 7.5, note: 'Solid build for under-mattress install. Multi-decade EarthPulse brand pedigree in sleep-focused PEMF. 1-year warranty.' },
    { criterionId: 'programmability', score: 7.0, note: 'Preset protocols the maker labels by sleep goal (sleep onset, deep sleep, recovery). Limited parameter customisation beyond presets.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Under-mattress install — set once, runs overnight. Convenient for overnight use. Not suitable for active recovery sessions.' },
    { criterionId: 'value', score: 7.5, note: '$899 — accessible pricing for a narrow but well-executed use case.' },
  ],
  pros: [
    'Under-mattress install — set once, runs overnight',
    'Schumann 7.83 Hz and delta-band settings (sleep benefit not shown in trials)',
    'Accessible $899 pricing',
    'Multi-decade brand pedigree in sleep PEMF',
  ],
  cons: [
    'Narrow use case — sleep only, not active recovery',
    'No multi-applicator coverage for daytime sessions',
    'Limited parameter customisation',
    'Smaller community / brand recognition than Bemer',
    'No controlled trials show better sleep from Schumann or delta PEMF settings',
  ],
  bestFor: 'Best for users who want an overnight, under-mattress PEMF device rather than daytime sessions, and who accept that a sleep benefit is not shown in controlled trials.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from EarthPulse product documentation and 2026 sleep-PEMF user reviews. Not hands-on tested by ONDA.',
  price: { usd: 899, note: 'standalone under-mattress unit', asOf: '2026-05-27' },
  link: 'https://earthpulse.net/',
  linkType: 'official',
  content: `## Where it leads

EarthPulse Sleep on Command is the best-known sleep-marketed PEMF device — under-mattress install, Schumann and delta-band overnight settings, accessible $899 pricing. Schumann resonances are real, very weak natural oscillations, but we found no controlled human trials showing that Schumann or delta PEMF settings improve sleep. See [PEMF therapy — the evidence](/science/evidence/pemf).

## What are the downsides of EarthPulse Sleep on Command?

Single use case and no sleep trials. EarthPulse is built for overnight use — it's not a daytime recovery mat or a spot-treatment coil. Users wanting general recovery PEMF should look elsewhere.

## Who should buy EarthPulse Sleep on Command?

Choose EarthPulse if you want overnight PEMF — under-mattress install, Schumann/delta settings, set-once daily use — and accept that better sleep is not shown in trials. Ongoing insomnia needs a medical assessment. For general daytime recovery, OMI or Healthy Wave. For Bemer-style biorhythmic protocols, Bemer Classic Evo.

---

## Background reading

- [PEMF therapy — what the evidence shows](/science/evidence/pemf) — what is shown in people, what comes from cell studies, and what FDA registration, clearance and approval mean
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep) — sound-based stimulation during sleep (not PEMF)
- [Does sleep really clean your brain? The glymphatic evidence](/articles/nightly-flush-glymphatic-neural-cache) — what is shown in people, and what is still disputed
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors)
`,
  references: [
    { label: 'EarthPulse — official site', url: 'https://earthpulse.net/' },
  ],
  relatedSlugs: ['bemer-classic-evo', 'omi-full-body-mat', 'resona-health-vibe'],
  publishOn: '2026-06-22',
  faq: [
    { q: "Is the EarthPulse Sleep on Command worth it?", a: "Only if you want overnight PEMF and accept unproven sleep claims. EarthPulse sits under your mattress and runs Schumann 7.83 Hz and delta-band settings overnight for $899; we found no controlled trials showing better sleep. It is sleep-only with a single applicator." },
    { q: "How much does the EarthPulse Sleep on Command cost?", a: "The EarthPulse Sleep on Command costs $899 for the standalone under-mattress unit. That is accessible pricing within PEMF, compared with multi-applicator systems such as the Bemer Classic Evo at $5,490. It installs under the mattress and runs overnight." },
    { q: "What are the downsides of the EarthPulse Sleep on Command?", a: "EarthPulse has a narrow use case: sleep only, not active recovery. It offers no multi-applicator coverage for daytime sessions, limited parameter customisation, and smaller community and brand recognition than Bemer. Within sleep, though, it is executed well." },
    { q: "Who is the EarthPulse Sleep on Command best for?", a: "EarthPulse is best for people who want overnight PEMF under the mattress rather than daytime sessions. The maker markets it for sleep onset and deep sleep, but this is not shown in controlled trials, so it is not a treatment for insomnia." },
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-10-10',
}

export default earthpulse
