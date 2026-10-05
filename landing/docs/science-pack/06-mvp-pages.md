# 6. The 13 MVP pages

The decisions come from the audit ([`../science-audit.md`](../science-audit.md) §2–3).

- **Path.** One file per page: `landing/content/science/<kind>/<slug>.md`, URL `/science/<kind>/<slug>`.
- **Language.** English only.
- **Questions.** No `/questions/` pages: questions belong to articles and tools.

**Status — published:**
- `concepts/rmssd` — 2026-10-04 (reference example of a finished page)
- `concepts/sdnn` — 2026-10-05
- `measurements/heart-rate-variability` — 2026-10-05 (flagship 1)
- `concepts/heart-rate-variability` — 2026-10-05 (hub entity)
- `evidence/vagus-nerve-stimulation` — 2026-10-05 (flagship 2)
- `concepts/hrv-baseline` — 2026-10-05
- `concepts/respiratory-sinus-arrhythmia` — 2026-10-05 (written by Claude Code under the same pack)
- `mechanisms/breathing-and-hrv` — 2026-10-05 (written by Claude Code under the same pack)
- `evidence/hrv-biofeedback` — 2026-10-05 (written by Claude Code under the same pack)
- `evidence/slow-breathing` — 2026-10-05 (written by Claude Code under the same pack)
- `concepts/autonomic-nervous-system` — 2026-10-05 (written by Claude Code under the same pack)

**The full plan — remaining MVP order, phase 2 (incl. `concepts/interpreting-hrv`, `mechanisms/hrv-day-to-day`) and the methodology page — is in [ONDA_science_roadmap.md](ONDA_science_roadmap.md).** Pages listed there may go in `relatedPlanned`; pages not in the roadmap may not.

All other pages: not written yet. Yakiv names the next page. Put published pages in `related.science`, unwritten ones in `relatedPlanned`.

| # | URL | Type | Main intent | Overlaps with (existing) | How the science page differs |
|---|---|---|---|---|---|
| 1 | `/science/concepts/heart-rate-variability` | concept (hub entity) | What HRV is, its main metrics, what it does *not* tell you | `/glossary/heart-rate-variability`, `/articles/hrv-questions-answered`, `/hrv-biofeedback` | Full entity with the 002 §6 guardrails in one place. The glossary stays a short definition; the FAQ article keeps owning the questions. |
| 2 | `/science/concepts/rmssd` | concept | Definition of RMSSD, what it reflects, how wearables report it | none — not in the glossary | Fills a gap; `/tools/hrv` and the norm articles link here. Age norms stay with `/articles/normal-hrv-by-age`; link, don’t repeat. |
| 3 | `/science/concepts/sdnn` | concept | Definition of SDNN; Apple Health stores HRV as SDNN | none — not in the glossary | Fills a gap; the single place for the “SDNN on Apple Watch” explanation (official facts only). |
| 4 | `/science/concepts/hrv-baseline` | concept | What a personal baseline is and how readings are compared with it | `/articles/your-baseline-knows-first`, `/articles/what-your-apple-watch-records`, `/tools/baseline` | The single definition of the windows: `baseline.window`, `baseline.minNights`, `baseline.compare`, `baseline.corridor`. The articles keep the stories, the tool keeps the counting. |
| 5 | `/science/concepts/autonomic-nervous-system` | concept | Both branches of the ANS on one page | `/glossary/autonomic-nervous-system`, `…/sympathetic-nervous-system`, `…/parasympathetic-nervous-system`, `/articles/how-to-train-your-nervous-system` | One entity instead of three thin pages; the glossary keeps the short definitions; no practice content. |
| 6 | `/science/concepts/vagus-nerve` | concept | Vagus nerve anatomy and function | `/glossary/vagus-nerve`, `…/ventral-vagus`, `…/polyvagal-theory`, `/articles/vagus-nerve-exercises` | Anatomy and function only, no practices. The home of `claim.vagalTone`. Polyvagal theory is described as debated. |
| 7 | `/science/concepts/respiratory-sinus-arrhythmia` | concept | What RSA is — the link between breathing and heart rate | none | Fills a gap; it is the core of the breathing–HRV link. |
| 8 | `/science/measurements/heart-rate-variability` | measurement — **flagship 1**: “Can You Trust HRV From a Smartwatch or Ring?” (spec 003) | How well PPG (PRV) agrees with ECG HRV, where and why it diverges, what follows | `/articles/hrv-different-every-device`, `/articles/apple-watch-recovery-hrv-vs-overall-hrv`, `/articles/why-is-my-apple-watch-hrv-low`, `/articles/how-to-measure-hrv-consistently`, `/tools/hrv`, `/measurements`, `/reviews/compare/best-hrv-trackers-2026` | Answers the method question with Xu 2026, Zuern 2026 and Carter 2026. It is not the everyday “why are my numbers different” article, not a device ranking, and gives no accuracy percentages unless they are facts. |
| 9 | `/science/measurements/resting-heart-rate` | measurement | How resting heart rate is measured; what “normal” means | `/articles/resting-heart-rate-by-age`, `/tools/resting-heart-rate` | Method and conventions: `rhr.adult.normal` always with `rhr.adult.normal.caveat`, plus `rhr.trained`. Age tables stay with the article. |
| 10 | `/science/mechanisms/breathing-and-hrv` | mechanism | RSA, baroreflex around 0.1 Hz, resonance | `/resonance-breathing`, `/articles/find-your-resonance-breathing-rate`, `/articles/coherent-breathing-guide`, `/articles/resonant-frequency-system-coherence`, `/articles/baroreflex-01hz-shift`, `/hrv-vs-coherence` | Mechanism and evidence classes, not a how-to. Resonance numbers only via the `breath.resonance.*` facts. Practice pages link here. |
| 11 | `/science/evidence/hrv-biofeedback` | evidence | What the evidence shows for HRV biofeedback | `/hrv-biofeedback`, `/research` | Evidence synthesis by class. `/hrv-biofeedback` stays the practical page and `/research` links here. |
| 12 | `/science/evidence/slow-breathing` | evidence | What the evidence shows for slow breathing | `/articles/hrv-breathing-cold-honest-limits`, `/articles/coherent-breathing-guide`, `/articles/cardiac-coherence-365-method`, `/articles/high-blood-pressure-slow-breathing`, `/articles/anxiety-panic-breathing-hrv` | Synthesis with claim classes; it also covers the concept “slow breathing”. Practice stays in the articles. |
| 13 | `/science/evidence/vagus-nerve-stimulation` | evidence — **flagship 2**: “Does Vagus Nerve Stimulation Really Work?” (spec 005) | Does non-invasive VNS (taVNS / tVNS) work, for what, how well | `/articles/vagus-nerve-exercises`, `/articles/electric-medicine-neuromodulation`, `/articles/cold-exposure-vagus-nerve`, `/articles/humming-breath-vagus`, `/reviews/compare/best-vagus-nerve-stimulators-2026`, stimulator reviews and comparisons | Evidence only, no device ranking. Covers: unstable HRV effect (Wolf 2021), sham problems (Yap 2020), anatomy (Butt 2020), sleep and depression meta-analyses, regulatory clearance for gammaCore headache indications only. Implanted-VNS evidence never supports non-invasive claims. |

**Not in the MVP — do not write:**
- the `/questions/` and `/research/` sections;
- separate sympathetic and parasympathetic pages;
- `concepts/resonance-breathing` (link only);
- `concepts/slow-breathing` (merged into #12);
- these phase-2 pages: respiratory rate, sleep / stress / exercise and HRV, interoception.
