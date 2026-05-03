# Content Sprint — 50 New Articles

This document is the source of truth for the 50-article sprint. It records:
the ONDA voice canon distilled from the existing 67 articles, the prioritized
topic list, batch ordering, and per-article status.

## Voice canon (distilled from `vagus-nerve-master-key`, `nervous-system-ping-latency`, `acetylcholine-lens-neuro-mechanics`)

Every new article must observe these conventions. Drift = reject.

### Tone
- **Technical-poetic-engineering**. Body-as-biocomputer is the controlling
  metaphor in every section. Hardware / software / firmware / packet / lens /
  shader / overclock / CPU / bandwidth / latency / resonance / coherence are
  the working vocabulary.
- Statements are declarative, never tentative. "X happens" not "X may
  happen". When uncertainty exists, name the precise mechanism that's
  unclear, don't hedge the whole sentence.
- Brand voice opens with a `>` blockquote that frames the topic as a
  diagnostic finding ("Most humans live on factory settings...", "In any
  high-load network, latency is the bottleneck...").

### Structure (mandatory)
1. **Header marker** — first line is `## [ STATUS: <STATE> ]` or
   `## [ <CONCEPT> ]` (e.g. `## [ INITIALIZING ADMIN ACCESS ]`,
   `## [ THE PING RATE OF LIFE ]`).
2. **Hero blockquote** — 2–4 lines of italics-flavored setup, ends with the
   article title or thesis in quotes.
3. `---` horizontal rule between major sections (not between every H3).
4. **Numbered sections**: `## Section N: <Title>` for the engineering deep
   dive, OR thematic H2s like `## The Diagnostics`, `## The Optimization`.
5. **Protocol blocks** are blockquotes:
   ```
   > **The Hack:** <one-sentence imperative protocol>
   >
   > **Status:** Calibrating...
   ```
   Followed by `**The Logic:**` or `**The Science:**` paragraph explaining
   the mechanism.
6. **Hardware validation footer** (every article):
   ```
   > [ HARDWARE_VALIDATION ]
   > VALIDATION_DEVICE: <device>
   > METRIC: <measurable metric>
   > STATUS: <STATE_FLAG>
   ```
7. Optional closing `> **ONDA_STATEMENT:**` or `> [ ONDA_STATEMENT ]` line.

### Required Article fields
- `slug` — kebab-case, descriptive, ≤60 chars.
- `title` — declarative, may include a colon and subtitle clause.
- `seoTitle` — 50–60 chars, ends with `| ONDA Biology` or `| ONDA Life`.
- `description` — 140–160 chars, contains the primary keyword in the first
  half.
- `category` — STRICT enum: `Neural Hardware` | `Biological Software` |
  `OS States` | `ONDA Protocol`. Picking the wrong category fails the
  brand-reinforcement audit.
- `relatedSlugs` — 3–6 entries, mix of glossary terms + adjacent articles.
- `image`, `imageAlt`, `imageTitle`, `imageCaption`, `imagePlacement` — see
  image rules below.
- `howToSteps` — minimum 3 entries with unique `protocolId`.
- `neuralSuggestion` — internal link to a logically adjacent article (1
  sentence + path + anchor text).
- `introStyle` — pick by category: cyan/indigo/purple/amber/emerald/blue/
  orange/rose/gold/slate.

### AI-first additions for this sprint
On top of the existing canon, every new article in this sprint adds:
- A 60–80-word noun-first opening paragraph **inside Section 1** with the
  primary keyword in the first 12 words. AI search engines lift this verbatim.
- One-sentence italic TL;DR before each major section.
- A `## Common Questions` section near the end with 5 Q&A pairs (real
  "People also ask" questions, not invented).
- A final `## TL;DR` section: 5 single-sentence bullets summarizing the
  article. Universal LLM lift target.

### Image canon
- Path: `/images/articles/<slug>.png` or `.webp`. Generated to ONDA visual
  language: dark cyberpunk-medical, terminal-green / cyan / amber accents,
  HUD overlays, technical labels.
- Prompts saved to `landing/docs/image-prompts/<slug>.md`.
- When image isn't available this sprint, omit `image*` fields and add to
  `landing/docs/missing-images.md`. ArticlePage degrades gracefully.

### References & sourcing rigor
- Every scientific claim traces to a real DOI / PubMed link.
- Article ends with a `## References` section listing sources in
  `Author A, et al. (Year). Title. Journal. https://doi.org/...` format.
- Per-article source manifest at `landing/docs/sources/<slug>.md` for
  editorial review.

## Topic selection methodology

Pulled from: existing ONDA coverage gap (67 articles audited), Reddit
`/r/Biohackers` + `/r/Nootropics` recurring threads (last 6 months — manual
sampling), Google Trends rising biohacking queries 2025, and Andrew Huberman
/ Peter Attia / Rhonda Patrick episode topics with persistent high search
volume.

For each candidate the three axes are scored 1–10:
- **Volume**: monthly-search-volume proxy (high/medium/low based on
  cross-platform recurrence).
- **Topical fit**: alignment with body-as-biocomputer framing.
- **Authority gap**: thinness of well-ranked existing pages.

Final list = combined score ≥ 18 / 30, no slug-level duplication with the
existing 67 articles. **Semantic-overlap caveat**: each topic was scanned
against existing slugs by hand for surface-level duplication, but a few
adjacent themes (breathwork↔CO2 tolerance, sleep↔glymphatic, vagal
states↔polyvagal stress) require an explicit angle differentiation in the
draft to avoid cannibalization with existing strong pages. Notes:

- `breathwork-during-exercise-co2-buffer` → must be exercise-context only;
  do not re-tread `co2-tolerance-expanding-oxygen-limit` or
  `breathwork-command-line-interface`.
- `glymphatic-positioning-lateral-sleep` → niche to lateral-position
  evidence (Lee 2015); do not re-tread `glymphatic-flush-clearing-neural-cache`
  or `nightly-flush-glymphatic-neural-cache`.
- `dorsal-vagal-shutdown-recovery` → must focus on the dorsal-shutdown
  exit protocol specifically; do not re-tread `vagus-nerve-master-key` or
  `nervous-system-ping-latency`.
- `panic-protocol-acute-sympathetic-override` → cyclic-sigh / acute
  intervention focus; differentiate from `hrv-training-nervous-system-latency`.

These angle-locks are enforced at draft time, not at slug time.

## The 50 (with rationale)

| # | Slug | Cluster | Vol | Fit | Gap | Notes |
|---|---|---|---|---|---|---|
| 1 | zone-2-cardio-mitochondrial-bandwidth | Movement | 10 | 10 | 7 | Attia/San Millan, huge search volume, perfect mitochondria-bandwidth reframe |
| 2 | cold-thermogenesis-adaptation-curve | Cold/heat | 10 | 9 | 7 | Søberg literature, complements existing CO2 article |
| 3 | deep-sleep-n3-slow-wave-architecture | Sleep | 10 | 10 | 7 | Walker, slow-wave = "deep firmware write" reframe |
| 4 | rem-extension-cognitive-defragmentation | Sleep | 9 | 10 | 8 | Memory consolidation as defrag — very ONDA |
| 5 | chronotype-cpu-clock-detection | Sleep | 8 | 10 | 8 | Roenneberg MCTQ, pure clock-detection framing |
| 6 | glymphatic-positioning-lateral-sleep | Sleep | 7 | 9 | 9 | Lee 2015 lateral position study, niche but high-fit |
| 7 | apigenin-allosteric-sleep-modulator | Sleep | 7 | 8 | 9 | Sinclair stack ingredient, GABAA allosteric story |
| 8 | sauna-thermal-hormesis-dosing | Cold/heat | 9 | 9 | 7 | Laukkanen Finnish cohort, dose-response curve |
| 9 | contrast-therapy-vasomotor-training | Cold/heat | 8 | 9 | 8 | Vascular pump training reframe |
| 10 | brown-adipose-thermogenic-reactor | Cold/heat | 8 | 10 | 8 | UCP1 literal reactor metaphor |
| 11 | continuous-glucose-monitoring-non-diabetic | Nutrition | 10 | 10 | 7 | Levels/Nutrisense surge, real-time telemetry framing |
| 12 | exogenous-ketones-fuel-switching | Nutrition | 9 | 9 | 7 | KE4, Cunnane brain-fuel research |
| 13 | time-restricted-eating-window-tuning | Nutrition | 10 | 9 | 6 | Panda Salk RCTs, scheduling-as-system-config |
| 14 | postprandial-glucose-spike-management | Nutrition | 9 | 9 | 7 | Stanford Snyder spike-typing work |
| 15 | berberine-glucose-modulator | Nutrition | 8 | 8 | 7 | AMPK activation, "nature's metformin" — well-cited |
| 16 | protein-leverage-appetite-targeting | Nutrition | 7 | 9 | 8 | Raubenheimer/Simpson appetite-as-protein-seek |
| 17 | vo2-max-cardiorespiratory-ceiling | Movement | 10 | 9 | 6 | Strongest all-cause mortality predictor |
| 18 | eccentric-overload-tendon-rewiring | Movement | 7 | 9 | 8 | Schoenfeld eccentric, tendon collagen synthesis |
| 19 | breathwork-during-exercise-co2-buffer | Movement | 7 | 10 | 8 | Nasal-only training, lactate buffering |
| 20 | hypoxic-altitude-simulation-training | Movement | 8 | 10 | 8 | EPO upregulation, altitude tent / mask studies |
| 21 | testosterone-natural-optimization-protocol | Hormonal | 10 | 9 | 6 | Sleep, sun, sprint, zinc — multi-lever protocol |
| 22 | growth-hormone-pulse-engineering | Hormonal | 8 | 10 | 8 | Sleep + sprint + fasting → endogenous GH pulse |
| 23 | thyroid-micronutrient-selenium-iodine | Hormonal | 7 | 8 | 8 | Selenoprotein cofactor stack |
| 24 | ashwagandha-cortisol-allosteric-modulator | Hormonal | 9 | 8 | 7 | Chandrasekhar 2012 RCT, cortisol-clamp story |
| 25 | working-memory-dual-n-back-training | Cognitive | 8 | 10 | 8 | Jaeggi 2008, RAM-training reframe |
| 26 | default-mode-network-quieting-protocol | Cognitive | 9 | 10 | 7 | Brewer meditation fMRI, "background process kill" |
| 27 | microdose-protocol-low-threshold-psychedelics | Cognitive | 9 | 8 | 6 | Polito Imperial College framework |
| 28 | l-theanine-caffeine-attention-stack | Cognitive | 9 | 9 | 6 | Owen/Bryan stack RCTs |
| 29 | lions-mane-nerve-growth-factor | Cognitive | 9 | 9 | 7 | Mori NGF studies, neurogenesis support |
| 30 | methylene-blue-mitochondrial-electron-shuttle | Cognitive | 7 | 10 | 9 | ETC bypass — cleanest "shader" reframe |
| 31 | spermidine-autophagy-induction | Longevity | 8 | 10 | 8 | Madeo, autophagy without fasting |
| 32 | urolithin-a-mitophagy-activator | Longevity | 8 | 10 | 8 | Mitopure / Amazentis RCTs |
| 33 | glycine-pre-sleep-thermal-shunt | Longevity | 8 | 10 | 9 | Bannai/Kawai 2012, distal vasodilation = thermal shunt |
| 34 | nad-precursor-nr-vs-nmn-comparison | Longevity | 9 | 9 | 7 | Sinclair NMN vs Brenner NR debate |
| 35 | hyperbaric-oxygen-tissue-saturation | Longevity | 8 | 9 | 7 | Efrati telomere RCT |
| 36 | panic-protocol-acute-sympathetic-override | Stress | 8 | 10 | 8 | Cyclic sigh, Huberman Cell Reports 2023 |
| 37 | dorsal-vagal-shutdown-recovery | Stress | 7 | 10 | 8 | Polyvagal — dorsal exit protocol |
| 38 | heartmath-coherence-emotional-regulation | Stress | 7 | 9 | 8 | HRV biofeedback subspecialty |
| 39 | hrv-wearable-comparison-oura-whoop-garmin | Wearables | 10 | 8 | 5 | Comparison piece, long-tail magnet |
| 40 | eeg-headband-consumer-neurofeedback | Wearables | 7 | 9 | 8 | Muse / Neurosity / Flowtime |
| 41 | red-light-panel-irradiance-buying-guide | Wearables | 9 | 8 | 7 | Joovv/Mito wavelength + dose math |
| 42 | cgm-platform-comparison | Wearables | 8 | 8 | 7 | Levels vs Nutrisense vs Stelo |
| 43 | magnesium-form-comparison-glycinate-threonate | Supplements | 9 | 9 | 7 | Most-asked supplement question |
| 44 | creatine-cognition-bioenergetic-buffer | Supplements | 9 | 10 | 7 | Cognitive creatine RCTs (Rae 2003, Avgerinos 2018) |
| 45 | saffron-mood-serotonin-modulator | Supplements | 7 | 8 | 8 | Crocin/safranal SSRI-comparable RCTs |
| 46 | rhodiola-adaptogen-mental-fatigue | Supplements | 8 | 9 | 7 | Salidroside, Olsson 2009 RCT |
| 47 | mouth-taping-nasal-breathing-protocol | Practical | 9 | 9 | 7 | Nestor "Breath" surge, NO production story |
| 48 | tongue-posture-airway-architecture | Practical | 8 | 9 | 8 | Mewing, airway = system intake port |
| 49 | grounding-earthing-electron-flow | Practical | 8 | 8 | 7 | Chevalier inflammation studies, electron transport |
| 50 | forest-bathing-terpene-immunomodulation | Practical | 7 | 9 | 8 | Li NK cell + phytoncide research |

## Batch order

- **Batch 1 — High volume / fast wins (1–10):** zone-2, cold-thermogenesis,
  deep-sleep-n3, rem-extension, chronotype-cpu, sauna, contrast-therapy,
  CGM-non-diabetic, time-restricted-eating, magnesium-comparison.
- **Batch 2 — Sleep cluster topical bomb (11–20):** glymphatic-positioning,
  apigenin, dorsal-vagal, panic-protocol, heartmath, mouth-taping,
  glycine-pre-sleep, exogenous-ketones, postprandial-glucose,
  default-mode-network.
- **Batch 3 — Rising-query wave (21–30):** ashwagandha, l-theanine-caffeine,
  lions-mane, methylene-blue, spermidine, urolithin-a, NAD-precursor,
  microdose, working-memory, brown-adipose.
- **Batch 4 — Authority-gap pounce (31–40):** vo2-max, testosterone-protocol,
  growth-hormone-pulse, thyroid-micronutrient, eccentric-overload,
  breathwork-during-exercise, hypoxic-altitude, creatine-cognition,
  HBOT-tissue-saturation, berberine.
- **Batch 5 — Wildcards / long-tail (41–50):** HRV-wearable-comparison,
  EEG-headband, red-light-panel, CGM-platform-comparison, saffron, rhodiola,
  protein-leverage, tongue-posture, grounding-earthing, forest-bathing.

## Per-article status

| # | Slug | EN body | sources/<slug>.md | image | i18n stubs | indexed |
|---|---|---|---|---|---|---|
| 1 | zone-2-cardio-mitochondrial-bandwidth | ✅ | ✅ | placeholder | pending | ✅ |
| 2 | cold-thermogenesis-adaptation-curve | ✅ | ✅ | placeholder | pending | ✅ |
| 3 | deep-sleep-n3-slow-wave-architecture | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| ... 4–50 | — | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |

Two pilot articles ship in this session as the quality bar. Batch 1 finishes
in subsequent sessions at a cadence of 2–3 articles per session so each one
gets the rigor demanded by the spec.

## Operational notes

- New articles are auto-discovered by the registry. The Sprint B
  auto-publishing pipeline applies — set `publishedAt` in the future to
  ship a finished article on a schedule.
- Internal-link refresh + featured rail rotation happen at batch boundaries
  (every 10 articles), not per article — see Stage 6 of the original sprint
  spec for the audit protocol.
- IndexNow / sitemap-news / RSS pick up new URLs automatically because of
  the single-chokepoint registry filter.
