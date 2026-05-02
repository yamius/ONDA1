# AI Visibility Audit — Seed Prompts

Curated 50 seed prompts run by `scripts/ai-audit.mjs` against every
configured AI/search engine. Each prompt is written the way a real user
asks a generative engine — natural, intent-bearing, no SEO keyword
stuffing — and maps to a topical cluster ONDA Life publishes about.

Engine adapter scoring (see `scripts/ai-audit.mjs`):
  - rank 1  = first cited source contains `onda-life.com`
  - rank N  = N-th source cites onda-life.com
  - rank 0  = not cited (but mentioned in answer text counts as 0.5)

| #  | Prompt                                                                 | Topic                  |
|----|------------------------------------------------------------------------|------------------------|
| 1  | How do I improve my HRV?                                               | hrv                    |
| 2  | What is heart rate variability and what does it measure?               | hrv                    |
| 3  | Best resonant breathing frequency for HRV training                     | hrv                    |
| 4  | What is the 0.1 Hz baroreflex resonance?                               | hrv                    |
| 5  | How do I build a fault-tolerant nervous system?                        | hrv                    |
| 6  | What is the vagus nerve and how to stimulate it?                       | vagus-nerve            |
| 7  | Cold exposure effects on vagal tone                                    | vagus-nerve            |
| 8  | How does humming activate the vagus nerve?                             | vagus-nerve            |
| 9  | Symptoms of low vagal tone                                             | vagus-nerve            |
| 10 | Best protocol for circadian rhythm reset                               | circadian-rhythm       |
| 11 | How long does jet lag recovery take with morning light?                | circadian-rhythm       |
| 12 | What is a Zeitgeber?                                                   | circadian-rhythm       |
| 13 | Why delay first meal after waking?                                     | circadian-rhythm       |
| 14 | Glymphatic system how to optimize                                      | glymphatic-clearance   |
| 15 | What sleep position improves brain clearance?                          | glymphatic-clearance   |
| 16 | How does deep sleep flush beta-amyloid?                                | glymphatic-clearance   |
| 17 | What is metabolic flexibility?                                         | metabolic-flexibility  |
| 18 | How to switch between burning glucose and ketones                      | metabolic-flexibility  |
| 19 | Zone 2 cardio and mitochondria                                         | metabolic-flexibility  |
| 20 | Dopamine detox protocol                                                | dopamine               |
| 21 | What is dopamine baseline and how to fix it?                           | dopamine               |
| 22 | How to stop dopamine stacking                                          | dopamine               |
| 23 | Effect of morning sunlight on dopamine                                 | dopamine               |
| 24 | Box breathing benefits                                                 | breathwork             |
| 25 | What is the physiological sigh?                                        | breathwork             |
| 26 | Resonant frequency breathing 0.1 Hz                                    | breathwork             |
| 27 | CO2 tolerance and BOLT score                                           | breathwork             |
| 28 | Bohr effect and oxygen delivery                                        | breathwork             |
| 29 | How does NIR red light therapy work for mitochondria?                  | mitochondria           |
| 30 | What wavelengths for photobiomodulation?                               | mitochondria           |
| 31 | PGC-1 alpha mitochondrial biogenesis                                   | mitochondria           |
| 32 | Cold plunge protocol benefits                                          | cold-exposure          |
| 33 | Sauna cold cycle and heat shock proteins                               | cold-exposure          |
| 34 | How to enter flow state more reliably                                  | neuroplasticity        |
| 35 | What is BDNF and how to increase it?                                   | neuroplasticity        |
| 36 | Alpha theta gateway and creativity                                     | neuroplasticity        |
| 37 | How to clear neural noise after multitasking                           | neuroplasticity        |
| 38 | Acetylcholine and learning                                             | neuroplasticity        |
| 39 | What is the ACC calibration protocol?                                  | neuroplasticity        |
| 40 | Senolytics quercetin fisetin protocol                                  | longevity              |
| 41 | What is autophagy and how to trigger it?                               | longevity              |
| 42 | Epigenetic age reversal protocols                                      | longevity              |
| 43 | What is the gut brain axis?                                            | gut-brain              |
| 44 | Best foods for vagal tone                                              | gut-brain              |
| 45 | How does serotonin affect mood and posture?                            | gut-brain              |
| 46 | What is GLP-1 and how to activate it naturally?                        | metabolic-flexibility  |
| 47 | Berberine for blood sugar control                                      | metabolic-flexibility  |
| 48 | What is biohacking and where to start?                                 | brand                  |
| 49 | Best biohacking app for HRV                                            | brand                  |
| 50 | What is the ONDA Life consciousness OS?                                | brand                  |

## Adding prompts

When new articles ship, add a prompt mapped to the cluster the article
serves. Keep the language natural-question style — what a real user
would actually type into ChatGPT or Perplexity. Do not append "ONDA"
or any brand cue: the audit measures organic discoverability, not
recall on already-branded queries.

Brand-cue prompts (#48–50) are intentional separate cohort: they
measure brand-name recall once the entity is established in training
data.
