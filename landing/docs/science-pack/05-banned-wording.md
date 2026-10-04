# 5. Banned wording

These phrases must not appear in a science page, in any grammatical form. Rows marked **auto** are caught by `check-science-content.ts` (any match fails the page). Claude Code checks the rest by reading.

## Vagus and vagal tone

| Don’t write | Write instead | Check |
|---|---|---|
| X stimulates / activates the vagus (nerve) — about breathing, humming, cold, gargling, singing, etc. | `{{fact:claim.slowExhale}}`, or “is associated with higher vagally mediated HRV” | auto |
| raises / increases / improves / boosts / strengthens / enhances / trains vagal tone | `{{fact:claim.vagalTone}}` — vagal tone cannot be measured directly | auto |
| HRV measures vagal tone / HRV is a measure of vagal tone | `{{fact:claim.vagalTone}}` | auto |
| HRV directly measures parasympathetic activity | HRV measures such as RMSSD reflect vagally mediated changes in heart rate | auto |
| “vagal resilience”, “vagal strength”, “tone your vagus” | describe what was measured (HRV, heart rate) and in whom | read |
| evidence from implanted VNS used for non-invasive devices | keep the two apart; implanted evidence never supports wearable or ear-clip claims | read |

## HRV interpretation

| Don’t write | Write instead | Check |
|---|---|---|
| LF/HF is the sympathetic–parasympathetic (sympathovagal) balance | LF/HF is debated and does not measure sympathovagal balance | auto |
| higher HRV is always better | higher HRV is generally associated with better recovery, with exceptions | auto |
| low HRV means you are stressed / unwell | `{{fact:claim.hrvNotStress}}` | auto |
| your wearable measured your autonomic / nervous system | your wearable estimated heart-rate variability from the pulse signal | auto |
| a single reading as a verdict (“your HRV of X means…”) | compare with your own baseline; context matters | read |

## Apple Watch

| Don’t write | Write instead | Check |
|---|---|---|
| Recovery HRV uses / is / is based on RMSSD (or any wording that ties Recovery HRV to RMSSD) | Only the official facts: `applewatch.hrv.variants2026`, `applewatch.hrv.rmssdType`. Apple has not stated the mapping. | auto |
| Apple Watch only records SDNN (without a date or model) | `applewatch.hrv.healthkit` + `applewatch.hrv.variants2026` | read |

## Claims and hype

| Don’t write | Write instead | Check |
|---|---|---|
| cures, treats anxiety / depression / insomnia | describe the evidence and its class | auto |
| clinically proven, scientifically proven | name the study type and class | auto |
| reset your nervous system, hack your biology, rewire your brain | — | auto |
| guaranteed, always works, instantly calms | “in controlled studies…”, “for some people…” | auto |
| detox, balance your hormones, boost immunity (without a source) | — | read |
| ONDA diagnoses / detects disease / replaces your doctor | ONDA does not diagnose (see [01-quality-standard.md](01-quality-standard.md) §1.6) | auto |

## Numbers

| Don’t write | Write instead | Check |
|---|---|---|
| any number typed by hand in prose (ms, bpm, %, breaths per minute, study counts, effect sizes) | `{{fact:<id>}}` from [03-facts.md](03-facts.md), or `{{proposed:P1}}` with a proposal | auto |
| digits in title, metaTitle, metaDescription, shortAnswer, keyPoints | words | auto |
