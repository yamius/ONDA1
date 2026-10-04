# 4. Source registry

These are the sources already checked by Claude Code: the DOI or PMID exists in Crossref or PubMed and matches the paper. Use them first.

## Rule for new sources

A new source is allowed **only with a DOI or PMID that can be verified**.
- **What Mistral does:** lists each new source in the hand-off note with authors, title, journal, year, DOI/PMID, study type and what it is cited for.
- **What Claude Code does:**
  - looks the identifier up in Crossref or PubMed;
  - checks that title, authors and year match;
  - opens the abstract and confirms it supports the claim;
  - adds the source here.

  A source that fails any of these is removed from the page.

No DOI or PMID means no source, with one exception: **official documentation** (type `official`).
- It covers manufacturer and regulator documents: Apple, Garmin, Oura, FDA, EMA and similar.
- It is cited by URL; the URL must open.
- It is allowed **only for device and regulatory facts**, never for a health, physiology or efficacy claim.

The check enforces all three points (see [01-quality-standard.md](01-quality-standard.md) §1.2). A new official document goes through the same proposal route as any new source.

## Foundations and HRV measurement

| Short cite | Full reference | Type | DOI / PMID | Use for |
|---|---|---|---|---|
| Task Force 1996 | Task Force of the ESC and NASPE. Heart rate variability: standards of measurement, physiological interpretation and clinical use. *Circulation* 1996;93(5):1043–1065 | guideline | DOI 10.1161/01.CIR.93.5.1043 | Metric definitions (RMSSD, SDNN, frequency bands); classic measurement standards |
| Esco 2026 | Esco MR, Fields AD, Mohammadnabi A, Kliszczewicz B. Monitoring training adaptation and recovery status in athletes using heart rate variability via mobile devices: a narrative review. *Sensors* 2026;26(1):3 | review (narrative) | DOI 10.3390/s26010003 · PMID 41516438 | Personal baseline needs frequent readings over at least a week; weekly means + CV; peer comparison misleads (athlete monitoring) |
| Kristiansen 2009 | Kristiansen J, Olsen A, Skotte JH, Garde AH. Reproducibility and seasonal variation of ambulatory short-term heart rate variability in healthy subjects. *Scand J Clin Lab Invest* 2009;69(6):651–661 | observational | DOI 10.3109/00365510902946984 · PMID 19424916 | Weak seasonal variation in some short-term HRV measures; within-subject CV unaffected |
| Shaffer & Ginsberg 2017 | An overview of heart rate variability metrics and norms. *Frontiers in Public Health* 2017;5:258 | review | DOI 10.3389/fpubh.2017.00258 | What each metric reflects; recording length |
| Carter 2026 | Carter JR et al. Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research. *Am J Physiol Heart Circ Physiol* 2026;331:H918–H943 | guideline | DOI 10.1152/ajpheart.00041.2026 | Measurement rigour; recording conditions; respiration; wearable limits; interpretation cautions |
| Xu 2026 | Xu S, Liu H, Liu Z, Su P, Gu Z. Accuracy of photoplethysmography-derived pulse rate variability compared with electrocardiography-derived heart rate variability: a systematic review and meta-analysis. *Sensors* 2026;26(16):5192 | systematic review + meta-analysis | DOI 10.3390/s26165192 · PMID 42655500 | PPG (PRV) vs ECG (HRV) agreement; limits on generalisation |
| Zuern 2026 | Zuern CS et al. Validation of photoplethysmography-derived short-term heart rate variability using a wearable device. *Scientific Reports* 2026;16:22597 | observational (validation) | DOI 10.1038/s41598-026-52700-7 | Simultaneous ECG/PPG; metric-specific agreement; motion and signal-quality limits |
| Voss 2015 | Voss A et al. Short-term heart rate variability — influence of gender and age in healthy subjects. *PLOS ONE* 2015;10(3):e0118308 | observational | DOI 10.1371/journal.pone.0118308 | Age and sex effects on HRV; basis of the ONDA norm tables |
| Nunan 2010 | Nunan D, Sandercock GRH, Brodie DA. A quantitative systematic review of normal values for short-term heart rate variability in healthy adults. *Pacing Clin Electrophysiol* 2010;33(11):1407–1417 | systematic review | DOI 10.1111/j.1540-8159.2010.02841.x · PMID 20663071 | Pooled short-term (daytime) normal values |
| Laborde 2017 | Laborde S, Mosley E, Thayer JF. Heart rate variability and cardiac vagal tone in psychophysiological research — recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology* 2017;8:213 | review (methods) | DOI 10.3389/fpsyg.2017.00213 | Vagally mediated HRV; why “vagal tone” is not measured directly; reporting standards |
| Billman 2013 | Billman GE. The LF/HF ratio does not accurately measure cardiac sympatho-vagal balance. *Frontiers in Physiology* 2013;4:26 | review | DOI 10.3389/fphys.2013.00026 | LF/HF is not sympathovagal balance |

## Breathing, resonance and biofeedback

| Short cite | Full reference | Type | DOI / PMID | Use for |
|---|---|---|---|---|
| Lehrer 2003 | Lehrer PM et al. Heart rate variability biofeedback increases baroreflex gain and peak expiratory flow. *Psychosomatic Medicine* 2003;65(5):796–805 | randomized trial | DOI 10.1097/01.psy.0000089200.81962.19 | Resonance breathing around 0.1 Hz; baroreflex |
| Lehrer & Gevirtz 2014 | Heart rate variability biofeedback: how and why does it work? *Frontiers in Psychology* 2014;5:756 | review | DOI 10.3389/fpsyg.2014.00756 | Mechanisms of HRV biofeedback |
| Shaffer & Meehan 2020 | A practical guide to resonance frequency assessment for heart rate variability biofeedback. *Frontiers in Neuroscience* 2020;14:570400 | review (methods) | DOI 10.3389/fnins.2020.570400 | Individual resonance frequency |
| Balban 2023 | Balban MY et al. Brief structured respiration practices enhance mood and reduce physiological arousal. *Cell Reports Medicine* 2023;4(1):100895 | randomized trial | DOI 10.1016/j.xcrm.2022.100895 | Cyclic sighing; daily dose |
| Szulczewski 2023 | Szulczewski MT, D’Agostini M, Van Diest I et al. Expiratory-gated taVNS does not further augment heart rate variability during slow breathing at 0.1 Hz. *Appl Psychophysiol Biofeedback* 2023;48:323–333 | randomized crossover | DOI 10.1007/s10484-023-09584-4 · PMID 36920567 | Slow breathing drives the HRV response; added taVNS did not augment it |

## Transcutaneous vagus nerve stimulation (flagship 2)

| Short cite | Full reference | Type | DOI / PMID | Use for |
|---|---|---|---|---|
| Wolf 2021 | Wolf V, Kühnel A, Teckentrup V, Koenig J, Kroemer NB. Does transcutaneous auricular vagus nerve stimulation affect vagally mediated heart rate variability? A living and interactive Bayesian meta-analysis. *Psychophysiology* 2021;58(11):e13933 | meta-analysis | DOI 10.1111/psyp.13933 | Acute taVNS effect on vmHRV is not robust |
| Yap 2020 | Yap JYY et al. Critical review of transcutaneous vagus nerve stimulation: challenges for translation to clinical practice. *Frontiers in Neuroscience* 2020;14:284 | review | DOI 10.3389/fnins.2020.00284 · PMID 32410932 | Sham, parameter and biomarker problems |
| Butt 2020 | Butt MF, Albusoda A, Farmer AD, Aziz Q. The anatomical basis for transcutaneous auricular vagus nerve stimulation. *Journal of Anatomy* 2020;237(4):588–611 | review (anatomy) | DOI 10.1111/joa.13122 · PMID 31742681 | Auricular branch anatomy; individual variation |
| Atanackov 2025 | Atanackov P et al. The acute effects of varying frequency and pulse width of taVNS on heart rate variability in healthy adults: a randomized crossover controlled trial. *Biomedicines* 2025;13(3):700 | randomized crossover | DOI 10.3390/biomedicines13030700 | Metric-specific response (SDNN vs RMSSD) |
| Tan 2023 | Tan C et al. The efficacy and safety of taVNS in the treatment of depressive disorder: a systematic review and meta-analysis of RCTs. *J Affect Disord* 2023;337:37–49 | meta-analysis | DOI 10.1016/j.jad.2023.05.048 · PMID 37230264 | Symptom-scale improvement; small trials, heterogeneity |
| Lin 2026 | taVNS for sleep disorders: a systematic review and meta-analysis of sleep, anxiety, depression and safety outcomes. *Psychology, Health & Medicine* 2026 | meta-analysis | DOI 10.1080/13548506.2026.2708207 · PMID 42522355 | Small-to-moderate pooled effects in mostly small trials (effect sizes only via facts) |
| de Oliveira 2025 | de Oliveira HM et al. taVNS in insomnia: a systematic review and meta-analysis. *Neuromodulation* 2025;28(8):1332–1340 | meta-analysis | DOI 10.1016/j.neurom.2025.04.001 · PMID 40323248 | Independent sleep meta-analysis; cite qualitatively |
| Gerges 2024 | Gerges ANH et al. Clinical application of transcutaneous auricular vagus nerve stimulation: a scoping review. *Disability and Rehabilitation* 2024;46:5730–5760 | scoping review | DOI 10.1080/09638288.2024.2313123 | Sham methodology |
| Tian 2023 | Tian QQ et al. Combined effect of taVNS and 0.1 Hz slow-paced breathing on working memory. *Frontiers in Neuroscience* 2023;17:1133964 | randomized trial | DOI 10.3389/fnins.2023.1133964 | Qualitative only |
| Wan 2026 | Wan S et al. Effectiveness of taVNS in stroke rehabilitation: a systematic review and meta-analysis of RCTs. *Frontiers in Neurology* 2026 | meta-analysis | DOI 10.3389/fneur.2026.1786103 | Qualitative only |

**Not usable until a journal DOI/PMID is confirmed:**
- PMC13319486 (“Sorting the mind”, cognitive taVNS meta-analysis);
- PMC12689627 (“The heart knows best”).

## Resting heart rate

| Short cite | Full reference | Type | DOI / PMID | Use for |
|---|---|---|---|---|
| Nanchen 2018 | Nanchen D. Resting heart rate: what is normal? *Heart* 2018;104(13):1048–1049 | review (editorial) | DOI 10.1136/heartjnl-2017-312731 | 60–100 convention; lower values in fit people; 50–90 research |
| Ostchega 2011 | Ostchega Y et al. Resting pulse rate reference data for children, adolescents, and adults: United States, 1999–2008. *National Health Statistics Reports* No. 41 | official statistics | URL https://www.cdc.gov/nchs/data/nhsr/nhsr041.pdf | ONDA resting-heart-rate tables (NHANES) |

## Official documents (type `official`: URL, no DOI — device and regulatory facts only)

| Source | URL | Use for |
|---|---|---|
| Apple Newsroom, 9 Sep 2026 | https://www.apple.com/newsroom/2026/09/apple-advances-health-and-fitness-capabilities-using-apple-intelligence/ | Recovery HRV and Overall HRV; measuring every five minutes (fact `applewatch.hrv.variants2026`) |
| ONDA — What ONDA measures (type `product-documentation`, approved 2026-10-05) | https://onda-life.com/measurements | What the app reads and how it compares readings; scope (descriptive, not a medical assessment). Not evidence for any scientific claim |
| HealthKit heartRateVariabilitySDNN | https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn | Apple Health stores HRV as SDNN |
| HealthKit heartRateVariabilityRMSSD | https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilityrmssd | RMSSD type from iOS/watchOS 27 |
| FDA De Novo DEN150048 | https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN150048.pdf | gammaCore: the cleared headache indication only |
| electroCore — gammaCore FAQ (approved 2026-10-05) | https://www.gammacore.com/about-gammacore/faq/ | Manufacturer-listed gammaCore indications and label limitations — always attributed as “the manufacturer states”. The site blocks scripts; verify in a browser. |
| LivaNova — VNS Therapy HCP FAQs (approved 2026-10-05) | https://www.livanova.com/epilepsy-vnstherapy/en-us/hcp/faqs | Implanted VNS Therapy: device description and the epilepsy indication only (the page states no depression indication) |
| American Lung Association — respiratory rate | https://www.lung.org/blog/respiratory-rate-vital-signs | Adult resting breathing rate |

**Status of the identifiers:** every DOI above was confirmed in Crossref on 2026-10-04 (author, year, journal and title match). The automatic check looks every DOI/PMID up again each time a page that cites it is checked.
