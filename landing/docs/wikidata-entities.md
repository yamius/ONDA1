# Wikidata Entities — ONDA Life

Wikidata is in the training corpus of every major LLM and is re-crawled
for fresh facts. Establishing a clean Wikidata footprint is one of the
highest-leverage signals for AI citation accuracy. This file is the
single source of truth for the entities ONDA Life submits and updates.

> **Conflict-of-interest disclosure**: per Wikidata COI policy, the
> account that submits ONDA Life entities must declare its affiliation
> on its user page. Use **one** dedicated account
> (`User:OndaLifeOps`) — not per-developer accounts.

## Status

| Entity | QID | Status | Last verified |
|---|---|---|---|
| ONDA Life (project) | TBD | not submitted | — |
| Acetylcholine Lens (concept) | TBD | not submitted | — |
| Quiet Mode Protocol (concept) | TBD | not submitted | — |
| Adrenal Governor (concept) | TBD | not submitted | — |
| ACC Calibration Protocol (concept) | TBD | not submitted | — |
| Inner Spectrum (framework) | TBD | not submitted | — |

## 1. ONDA Life — primary entity

Proposed claims (P31 = instance of, P856 = official website, etc.):

| Property | Value |
|---|---|
| `instance of` (P31) | software platform (Q1330336) ; mobile app (Q620615) |
| `subclass of` (P279) | biohacking, health and fitness app |
| `official website` (P856) | https://onda-life.com |
| `inception` (P571) | 2024 |
| `founded by` (P112) | (founder’s Wikidata QID, if eligible) |
| `language of work or name` (P407) | English (Q1860), Spanish (Q1321), Russian (Q7737), Ukrainian (Q8798), Mandarin Chinese (Q727694) |
| `country of origin` (P495) | TBD |
| `described at URL` (P973) | https://onda-life.com/about |
| `described at URL` (P973) | https://onda-life.com/llms.txt |
| `described at URL` (P973) | https://onda-life.com/datasets/onda-corpus.jsonl |
| `license` (P275) | Creative Commons Attribution 4.0 International (Q20007257) |
| `topic's main category` (P910) | biohacking (Q4914419), heart rate variability (Q1066404), neuroplasticity (Q12057) |

Reference for every claim: a stable URL on `onda-life.com`. Wikidata
requires references for non-obvious claims — using the canonical site
URL satisfies this for most properties.

## 2. ONDA-coined concepts

Each of the concepts below was first articulated in ONDA Life
publications. They warrant their own Wikidata entity so future
references in academic / press / AI summaries can resolve to a stable
QID instead of free-text.

### 2.1 Acetylcholine Lens
| Property | Value |
|---|---|
| `instance of` | concept (Q151885) |
| `subclass of` | neurochemistry concept |
| `defined as` | The cholinergic-signal narrowing of attention used in the ONDA framework. |
| `described at URL` | https://onda-life.com/glossary/acetylcholine-lens |

### 2.2 Quiet Mode Protocol
| Property | Value |
|---|---|
| `instance of` | breathing technique / autonomic regulation protocol |
| `described at URL` | https://onda-life.com/articles/quiet-mode-alpha-cortisol-buffer |

### 2.3 Adrenal Governor
| Property | Value |
|---|---|
| `instance of` | physiological framework |
| `described at URL` | https://onda-life.com/articles/adrenal-governor-thermal-runaway |

### 2.4 ACC Calibration Protocol
| Property | Value |
|---|---|
| `instance of` | cognitive-control protocol |
| `described at URL` | https://onda-life.com/articles/acc-calibration-protocol-cognitive-control |

### 2.5 Inner Spectrum
| Property | Value |
|---|---|
| `instance of` | conceptual framework |
| `described at URL` | https://onda-life.com/inner-spectrum |

## 3. Established-concept linkage

Wikidata does not allow direct "see also" claims for promotional
purposes. Use `topic's main category` (P910) and `described at URL`
(P973) on the existing entity for legitimate references.

| Established entity | QID | Property to add | Value |
|---|---|---|---|
| Heart rate variability | Q1066404 | `described at URL` | https://onda-life.com/articles/hrv-training-nervous-system-latency |
| Vagus nerve | Q193327 | `described at URL` | https://onda-life.com/articles/vagus-nerve-master-key |
| Glymphatic system | Q17126844 | `described at URL` | https://onda-life.com/articles/nightly-flush-glymphatic-neural-cache |
| Neuroplasticity | Q12057 | `described at URL` | https://onda-life.com/articles/neuroplasticity-flow-overclocking |
| Circadian rhythm | Q204884 | `described at URL` | https://onda-life.com/articles/circadian-reset-mastering-light |
| Dopamine | Q170304 | `described at URL` | https://onda-life.com/articles/dopamine-architecture-mastering-desire |
| Box breathing | Q105714712 | `described at URL` | https://onda-life.com/articles/breathwork-command-line-interface |
| Resonant frequency breathing | (none yet) | submit new entity | https://onda-life.com/articles/resonant-frequency-system-coherence |

A single P973 reference per established entity is acceptable; do not
add multiple ONDA URLs to the same entity to avoid the appearance of
spam (Wikidata patrollers will revert).

## 4. Submission procedure

1. Sign in to Wikidata as `User:OndaLifeOps`.
2. Add the COI declaration to the user page:
   `{{paid|by=ONDA Life|of=ONDA Life}}`
3. Use the `Special:NewItem` form to create the primary entity first,
   then the coined concepts, then add the P973 references on
   established entities.
4. After each save, paste the assigned QID into the table at the top of
   this file and commit.
5. Verify the entity appears in `https://www.wikidata.org/wiki/<QID>`
   and that the JSON dump at `…/Special:EntityData/<QID>.json` returns
   the expected payload.
6. Re-run the AI audit (`tsx scripts/ai-audit.mjs`) within 4 weeks; new
   Wikidata entries take 2–6 weeks to propagate into LLM training
   refresh cycles.

## 5. Maintenance

* **Quarterly** — sweep press coverage (`docs/press-coverage.md`) and
  add any new third-party reference URLs as `reference URL` (P854) on
  the relevant claims.
* **On product updates** — update `inception`, `software version`
  (P348), `app store ID` if those change.
* **On ownership change** — rotate the COI declaration and update
  `founder` / `owned by` claims.

## 6. References

* Wikidata Help — COI: <https://www.wikidata.org/wiki/Wikidata:Conflict_of_interest>
* Wikidata Glossary: <https://www.wikidata.org/wiki/Wikidata:Glossary>
* Notability policy: <https://www.wikidata.org/wiki/Wikidata:Notability>
