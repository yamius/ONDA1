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
| Russo 2017 | Russo MA, Santarelli DM, O’Rourke D. The physiological effects of slow breathing in the healthy human. *Breathe* 2017;13(4):298–309 | review | DOI 10.1183/20734735.009817 · PMID 29209423 | RSA definition, posture/state, slow-breathing peak, mechanism debate (baroreflex vs central), function hypotheses |
| Eckberg 2003 | Eckberg DL. The human respiratory gate. *J Physiol* 2003;548(2):339–352 | review | DOI 10.1113/jphysiol.2002.037192 · PMID 12626671 | RSA as normal resting physiology; small at fast, large at slow breathing; respiration vs baroreflex view |
| Hirsch & Bishop 1981 | Hirsch JA, Bishop B. Respiratory sinus arrhythmia in humans: how breathing pattern modulates heart rate. *Am J Physiol* 1981;241(4):H620–H629 | other (laboratory study) | DOI 10.1152/ajpheart.1981.241.4.H620 · PMID 7315987 | RSA vs breathing rate and tidal volume; age (small sample) |
| Hayano 1996 | Hayano J et al. Respiratory sinus arrhythmia: a phenomenon improving pulmonary gas exchange and circulatory efficiency. *Circulation* 1996;94(4):842–847 | other (animal experiment) | DOI 10.1161/01.CIR.94.4.842 · PMID 8772709 | Mechanism summary; gas-exchange hypothesis (dogs) — hypothesis only |
| Ben-Tal 2012 | Ben-Tal A, Shamailov SS, Paton JFR. Evaluating the physiological significance of respiratory sinus arrhythmia. *J Physiol* 2012;590(8):1989–2008 | other (modelling) | DOI 10.1113/jphysiol.2011.222422 · PMID 22289913 | Competing hypothesis: RSA minimises cardiac work — hypothesis only |
| Grossman & Taylor 2007 | Grossman P, Taylor EW. Toward understanding respiratory sinus arrhythmia. *Biol Psychol* 2007;74(2):263–285 | review | DOI 10.1016/j.biopsycho.2005.11.014 · PMID 17081672 | Limits of RSA as a vagal-tone index (respiration confounds, dissociation) |
| Laborde 2022 | Laborde S et al. Effects of voluntary slow breathing on heart rate and heart rate variability: a systematic review and a meta-analysis. *Neurosci Biobehav Rev* 2022;138:104711 | systematic review + meta-analysis | DOI 10.1016/j.neubiorev.2022.104711 · PMID 35623448 | vmHRV rises during slow breathing, right after a session and after multi-session programmes |
| Sevoz-Couche & Laborde 2022 | Sevoz-Couche C, Laborde S. Heart rate variability and slow-paced breathing: when coherence meets resonance. *Neurosci Biobehav Rev* 2022;135:104576 | review | DOI 10.1016/j.neubiorev.2022.104576 · PMID 35167847 | Resonance/coherence mechanism; central (interoceptive) route as hypothesis |
| Vaschillo 2006 | Vaschillo EG, Vaschillo B, Lehrer PM. Characteristics of resonance in heart rate variability stimulated by biofeedback. *Appl Psychophysiol Biofeedback* 2006;31(2):129–142 | other (laboratory study) | DOI 10.1007/s10484-006-9009-3 · PMID 16838124 | Individual resonance frequency: sex, height, not age; stable across sessions |
| Shaffer & Meehan 2020 | A practical guide to resonance frequency assessment for heart rate variability biofeedback. *Frontiers in Neuroscience* 2020;14:570400 | review (methods) | DOI 10.3389/fnins.2020.570400 | Individual resonance frequency |
| Balban 2023 | Balban MY et al. Brief structured respiration practices enhance mood and reduce physiological arousal. *Cell Reports Medicine* 2023;4(1):100895 | randomized trial | DOI 10.1016/j.xcrm.2022.100895 | Cyclic sighing; daily dose |
| Szulczewski 2023 | Szulczewski MT, D’Agostini M, Van Diest I et al. Expiratory-gated taVNS does not further augment heart rate variability during slow breathing at 0.1 Hz. *Appl Psychophysiol Biofeedback* 2023;48:323–333 | randomized crossover | DOI 10.1007/s10484-023-09584-4 · PMID 36920567 | Slow breathing drives the HRV response; added taVNS did not augment it |

## HRV biofeedback outcomes (evidence/hrv-biofeedback, approved 2026-10-05)

| Short cite | Full reference | Type | DOI / PMID | Use for |
|---|---|---|---|---|
| Lehrer 2020 | Lehrer P et al. Heart rate variability biofeedback improves emotional and physical health and performance: a systematic review and meta analysis. *Appl Psychophysiol Biofeedback* 2020;45(3):109–129 | systematic review + meta-analysis | DOI 10.1007/s10484-020-09466-z · PMID 32385728 | Overall small-to-moderate effect; outcome ranking; active vs inactive controls; “complementary treatment” |
| Goessl 2017 | Goessl VC, Curtiss JE, Hofmann SG. The effect of heart rate variability biofeedback training on stress and anxiety: a meta-analysis. *Psychol Med* 2017;47(15):2578–2586 | meta-analysis | DOI 10.1017/S0033291717001003 · PMID 28478782 | Self-reported stress and anxiety; need for better-controlled studies |
| Pizzoli 2021 | Pizzoli SFM et al. A meta-analysis on heart rate variability biofeedback and depressive symptoms. *Sci Rep* 2021;11:6650 | meta-analysis | DOI 10.1038/s41598-021-86149-7 · PMID 33758260 | Depressive symptoms; heterogeneity; prediction interval |
| Vann-Adibe 2026 | Vann-Adibe S et al. Efficacy and methodology of remote heart rate variability biofeedback interventions for mental health. *Appl Psychophysiol Biofeedback* 2026;51(3):441–452 | systematic review + meta-analysis | DOI 10.1007/s10484-025-09750-w · PMID 41310318 | Remote programmes; stress not significant; moderators (screen on device) |
| Kaneko 2026 | Kaneko K et al. Effects of heart rate variability biofeedback on cardiac autonomic function in patients with cardiovascular disease. *Appl Psychophysiol Biofeedback* 2026 (online ahead of print) | systematic review + meta-analysis | DOI 10.1007/s10484-025-09765-3 · PMID 41501316 | Modest blood-pressure decrease in CVD; risk of bias. **Year = online-first; check volume/year when the issue appears** |
| Jiménez Morgan 2017 | Jiménez Morgan S, Molina Mora JA. Effect of heart rate variability biofeedback on sport performance, a systematic review. *Appl Psychophysiol Biofeedback* 2017;42(3):235–245 | systematic review | DOI 10.1007/s10484-017-9364-2 · PMID 28573597 | Sport: few small studies |
| Tinello 2022 | Tinello D, Kliegel M, Zuber S. Does heart rate variability biofeedback enhance executive functions across the lifespan? *J Cogn Enhanc* 2022;6(1):126–142 | systematic review | DOI 10.1007/s41465-021-00218-3 · PMID 35299845 | Executive functions, attention |
| Fournié 2021 | Fournié C et al. Heart rate variability biofeedback in chronic disease management: a systematic review. *Complement Ther Med* 2021;60:102750 | systematic review | DOI 10.1016/j.ctim.2021.102750 · PMID 34118390 | Chronic disease; feasibility without adverse effects |
| Minjoz 2026 | Minjoz S et al. Psychophysiological effects of heart rate variability biofeedback versus sham biofeedback: a randomized controlled trial. *Biol Psychol* 2026;206:109254 | randomized trial | DOI 10.1016/j.biopsycho.2026.109254 · PMID 41905438 | Biofeedback vs sham (mood yes, autonomic measures no); sham content not described in the abstract |
| Sumińska 2026 | Sumińska S, Rynkiewicz A, Szulczewski M. Resonance frequency versus fixed 0.1 Hz breathing in HRV biofeedback. *Sci Rep* 2026;16:22630 | randomized trial | DOI 10.1038/s41598-026-53333-6 · PMID 42156977 | One trial: individual resonance rate did not outperform a fixed rate — always as a single study, class emerging |

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
