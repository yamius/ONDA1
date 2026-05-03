# Source manifest — zone-2-cardio-mitochondrial-bandwidth

Per-claim source mapping for editorial review and future fact-checks.

## Claim → source

| Article claim | Source |
|---|---|
| Zone 2 = highest workload at which lactate stays ≤2 mmol/L while clearing at production rate | San Millán & Brooks 2018 (Sports Medicine) — defines metabolic flexibility via lactate response across exercise intensities |
| FATmax = peak of fat-oxidation curve, ~1.0–1.5 g/min trained / 0.4–0.6 sedentary | Achten & Jeukendrup (2003), International Journal of Sports Medicine 24(8): 603–608. https://doi.org/10.1055/s-2003-43265 |
| PGC-1α = master coactivator of mitochondrial biogenesis, dose-dependent on aerobic exercise duration | Memme et al. 2021 (Journal of Physiology) — review of exercise → mitochondrial pathways |
| MCT1 monocarboxylate transporter upregulation = lactate clearance from glycolytic to oxidative fibers | Brooks 2018 (Cell Metabolism) — comprehensive lactate-shuttle theory translation |
| CPT1, HADH, CS upregulated by endurance training | Holloszy & Coyle 1984 (J Appl Physiol) — foundational paper on endurance enzymatic adaptation |
| 80/20 polarized training distribution outperforms threshold/HIIT-heavy in elite endurance athletes | Seiler 2010 (IJSPP) — review of training intensity distribution evidence |
| Maffetone "180 minus age" formula | Maffetone & Laursen 2017 — practical case study using MAF method |
| Zone 2 lowers HbA1c / improves fasted glucose | Cross-references to Pedersen & Saltin 2015 (Scand J Med Sci Sports) consensus statement on exercise as medicine; review supports mitochondrial-density link to glucose uptake |

## Excluded / hedged claims

- "Resting HR drops 5–10 bpm in 12 weeks" — bracketed range based on aggregate of training-study magnitudes (Carter et al. 2003); presented as trained range, not hard guarantee.
- "Resting HRV rises 5–15 ms" — same approach; based on aggregate rMSSD shifts in endurance training meta-analyses (Plews et al. 2013).
- All quantitative durations (45–60 min, 8–12 weeks) framed as "minimum effective dose" with explicit caveats — derived from Memme 2021 review timing and Seiler-school endurance practice consensus, not from a single RCT.

## Editorial notes

- Voice: technical-poetic-engineering canon (per `landing/docs/content-sprint-50.md`).
- Mechanism explanations stated definitively where mechanism is mainstream-consensus
  (PGC-1α, MCT1, CPT1, FATmax). Hedged where individual variation is high
  (specific HR formulas, duration responses).
- Caveat for fasted Zone 2 protocol: explicitly excludes anyone in caloric
  deficit or with disordered-eating history.
- Rich-result schema candidates: HowTo (3 steps, present), FAQPage (5 Q&A,
  present), Article (default). MedicalScholarlyArticle could be added once
  the `articleType` field is wired in a future sprint.
