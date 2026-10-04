# 11. Lessons from the first page (`concepts/rmssd`, 2026-10-04)

The first page was good, but it still needed fixes at publishing. Avoid these so the next pages arrive ready.

| # | What happened on `rmssd` | Rule now |
|---|---|---|
| 1 | **Fact repeated by its frame.** The draft had “the standard definition is {{fact:hrv.rmssd.definition}}”, which renders as “…the standard definition is RMSSD — the root mean square…”. Also “paired with SDNN, whose standard definition is {{fact:hrv.sdnn.definition}}”, which names SDNN twice. | Build the sentence so the fact reads naturally and the term appears once ([01-quality-standard.md](01-quality-standard.md) §1.12). Fixed to “In the field’s measurement standards it is defined precisely: {{fact:hrv.rmssd.definition}}” and “It is usually paired with a second time-domain metric — {{fact:hrv.sdnn.definition}}”. **The check now catches both patterns.** |
| 2 | **Specific details cited to general reviews.** “A late workout, an evening drink, caffeine… or illness can shift a single night’s reading [S2, S8]” rests on a general HRV overview and a methods guideline that do not study alcohol, caffeine or illness. | Every evidence-map row now needs a **`quote`**: a short exact sentence from the cited source that states the claim. If no source you have says it, find one that does, propose it, or drop the detail ([01-quality-standard.md](01-quality-standard.md) §1.13). |
| 3 | **No image fields.** | Write `imageAlt` and `imagePrompt` in the light scientific style ([10-image-style.md](10-image-style.md)). The check requires both. |
| 4 | **`relatedPlanned` written as an object** (`relatedPlanned: {science: [...]}`). The check crashed on it. | `relatedPlanned` is a flat list: `relatedPlanned: [concepts/sdnn, concepts/hrv-baseline]`. Inline links go only to pages that already exist. |
| 5 | **Official Apple rows without `claimType`.** | Rows citing an `official` source need `claimType: device` (or `regulatory`) and no health or efficacy wording. Done right: the three Apple sources S9–S11 were used only for what Apple Health records. |
| 6 | **Guideline used correctly.** Carter 2026 (S8) supports “compare against your own baseline under comparable conditions” with class `guideline`, and the text says “expert consensus, not direct experimental data”. | Keep doing this. `guideline` is for recommendations and methods, and must cite a `guideline` source. |
| 7 | **No proposals were needed**, because all numbers existed as facts (`hrv.pooled.daytime` was approved before the page). | When a value is missing, use the proposals block; don’t work around it in prose. |
| 8 | **The check could not be run** (no Node.js on Mistral’s side). | Say so in the hand-off note; Claude Code runs it. Still self-check every item in [08-handoff-checklist.md](08-handoff-checklist.md). |

**What made the page strong — keep it:**
- the answer comes first;
- the scope of each number is stated (“a pooled daytime average, not a night-time value and not an age norm”);
- “What it does not tell you” is honest;
- the “In ONDA” paragraph is exact (SDNN baseline, surrogate live tile, camera gives only pulse);
- it links to the articles that own the practical angle instead of repeating them.

Use https://onda-life.com/science/concepts/rmssd as the reference for structure and tone.
