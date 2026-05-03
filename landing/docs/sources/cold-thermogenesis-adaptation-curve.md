# Source manifest — cold-thermogenesis-adaptation-curve

Per-claim source mapping for editorial review and future fact-checks.

## Claim → source

| Article claim | Source |
|---|---|
| TRPM8 = peripheral cold receptor, fires high-frequency afferent burst | McKemy et al. 2002 (Nature) 416: 52–58 — identifies TRPM8 as the cold-and-menthol receptor. https://doi.org/10.1038/nature719 |
| Cold immersion → ~530 % plasma norepinephrine elevation, ~250 % dopamine | Šrámek et al. 2000 (Eur J Appl Physiol) — direct plasma catecholamine measurements at 14 °C immersion |
| Habitual winter swimmers carry elevated brown-adipose tissue mass measurable by PET-CT | Søberg et al. 2021 (Cell Reports Medicine) — winter-swimmer cohort with PET-CT BAT imaging |
| Cold-shock reflex peaks at 30 s and decays by 90 s within one exposure; damps ~50 % over 4–6 sessions | Tipton 1989 (Clinical Science) — original characterization of human cold-shock response and habituation |
| ~11 min/week immersion at 11–15 °C is the practical target | **Synthesized** recommendation popularized by Susanna Søberg from her own cohort work (Søberg 2021, Cell Reports Medicine — single-cohort study, NOT a meta-analysis) plus the broader cold-exposure literature. No head-to-head dose-response RCT establishes 11 min as optimal. Article body now flags this explicitly as a synthesized target rather than an RCT-derived dose. |
| Šrámek 2000 dopamine / norepinephrine percentages are protocol-specific (1 h, 14 °C) | Šrámek 2000 — explicitly framed in body as measurements from that protocol, not universal post-exposure values |
| Cold-water immersion within 1 hour post-resistance training blunts protein synthesis and long-term hypertrophy | Roberts et al. 2015 (J Physiol) and Fyfe et al. 2019 (J Appl Physiol) — both show interference with anabolic signaling |
| Contrast therapy reduces DOMS and accelerates recovery | Bleakley & Davison 2010 (Br J Sports Med) — systematic review |
| First-ever immersions in <12 °C water can trigger arrhythmia in vulnerable subjects | Tipton 1989 + cold-water drowning epidemiology (Datta & Tipton 2006, J Sports Sci) |
| Cold-activated BAT is present in adult humans | van Marken Lichtenbelt 2009 (NEJM) — landmark adult-human BAT-via-PET paper |

## Excluded / hedged claims

- "Brown-adipose recruitment measurable at 6–8 weeks" — derived from
  imaging-cohort timing in Søberg's protocol; presented as a typical window,
  not a guaranteed individual response.
- "Evening cold blunts the body-temperature drop that cues sleep onset" —
  mechanism is well-established (Kräuchi 2007, Sleep Med Rev), but the size
  of the sleep-quality penalty varies; framed as a precaution.
- The Šrámek norepinephrine and dopamine percentages are reported as
  measured in that specific protocol (1 hour, 14 °C); the article frames
  them as illustrative of magnitude, not as universal post-exposure values.

## Architect-review corrections (post-pilot)

- **Søberg 2021 mischaracterization fixed**: prior draft called it "a
  meta-analysis"; it is a single-cohort study comparing winter swimmers
  vs. controls. Body rewritten to attribute the 11 min/week target to the
  Søberg research-program synthesis and to label it explicitly as a
  practical recommendation rather than an RCT-derived dose.
- **BAT-mass claim softened**: prior draft said winter swimmers carry
  "markedly elevated brown adipose tissue mass". Reworded to "altered
  cold-induced thermogenesis and differences in brown-adipose tissue
  activity on PET-CT compared to controls" — closer to what the data
  actually show.

## Editorial notes

- Three protocols presented as discrete tracks (adaptation, contrast,
  acute reset) so readers can pick by goal. The 11 min/week canonical dose
  is foregrounded because it has the strongest replicated literature.
- Hard constraints section (cardiac, hypertrophy, sympathetic) added because
  cold exposure has real injury / interference modes that wellness coverage
  routinely glosses.
- Visual-language: "cold-load initiated", "brown adipose recruiting",
  "vascular pump priming", "dopamine spike active" — fits canon.
- Rich-result schema: HowTo (3 steps), FAQPage (5 Q&A), Article. Same as
  zone-2 article.
