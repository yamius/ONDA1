---
kind: measurements
slug: how-we-evaluate-research
title: "How ONDA Science Checks and Grades Research"
metaTitle: "How ONDA Checks and Grades Research"
metaDescription: "How ONDA Science verifies each source, reads each study, grades each claim and handles company claims, conflicts of interest and fragile results."
shortAnswer: >
  ONDA Science looks up every journal source in Crossref or PubMed, copies a
  quote from it word for word for each claim, and grades each claim with one
  of six evidence classes, from established to unknown. A study in a group is
  never turned into a verdict about one person. Regulatory status comes only
  from official databases, conflicts of interest are reported as found, and a
  missing statement is never read as no conflict.
keyPoints:
  - "Every journal source on a science page is looked up by its DOI or PMID, and its title, authors and year are compared with the reference before it is used."
  - "Each claim in a page's evidence table carries an exact quote from its source; if the quote does not say the claim, the claim is rewritten or cut."
  - "Each claim gets one evidence class — established, guideline or expert consensus, context-dependent, emerging, debated or unknown."
  - "A result in a group of people is not a prediction for one person."
  - "Animal studies, single studies, narrative reviews and maker-linked studies are labelled as what they are, and none of them is presented as stronger evidence than it is."
  - "A device's regulatory status comes only from official databases; registration with a regulator is not clearance."
  - "Funding and conflicts of interest are reported as found; when a statement could not be read, the page says so rather than assuming none."
image: /images/science/measurements-how-we-evaluate-research.jpg
imageAlt: "A thin magnifying glass held over a short stack of papers, with one line of text underlined and a small check mark beside it."
imagePrompt: "Minimal scientific illustration on a clean white background: a thin outline of a magnifying glass over a small stack of paper sheets, one line on the top sheet underlined in teal with a small check mark beside it, thin teal lines with a soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, landscape."
editor: "Yakiv Bilenko"
reviewer: null
lastReviewed: "2026-10-11"
related:
  glossary: [heart-rate-variability]
  articles: []
  tools: []
  science: [measurements/onda-method, measurements/heart-rate-variability, concepts/interpreting-hrv]
sources:
  - id: S1
    cite: "Carter et al. (2026)"
    title: "Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research"
    journal: "American Journal of Physiology. Heart and Circulatory Physiology"
    year: 2026
    doi: "10.1152/ajpheart.00041.2026"
    pmid: 42495990
    type: guideline
  - id: S2
    cite: "Laborde, Mosley & Thayer (2017)"
    title: "Heart Rate Variability and Cardiac Vagal Tone in Psychophysiological Research - Recommendations for Experiment Planning, Data Analysis, and Data Reporting"
    journal: "Frontiers in Psychology"
    year: 2017
    doi: "10.3389/fpsyg.2017.00213"
    pmid: 28265249
    type: review
  - id: S3
    cite: "Kazdağlı & Özel (2026)"
    title: "A reporting checklist for human and animal heart rate variability research"
    journal: "Pflügers Archiv - European Journal of Physiology"
    year: 2026
    doi: "10.1007/s00424-026-03210-y"
    pmid: 42745081
    type: review
    note: "Closed access: funding not checked"
  - id: S4
    cite: "ONDA — product documentation: How ONDA works"
    title: "How ONDA works"
    url: "https://onda-life.com/how-it-works"
    type: product-documentation
evidenceMap:
  - claim: "Methods, analyses and interpretations of HRV vary widely, and debates about its reliability remain."
    sources: [S1]
    class: guideline
    claimType: measurement
    quote: "Methodological approaches, analyses, and interpretations of HRV can vary extensively, and scientific debates on HRV reliability and utility remain."
    limitation: "Guideline for research; expert consensus."
  - claim: "HRV is not appropriate as a specific marker of cardiac sympathetic outflow or of the balance between the two branches of the autonomic nervous system."
    sources: [S1]
    class: guideline
    claimType: measurement
    quote: "HRV has some utility as a cardiovascular risk stratification tool but is not appropriate to employ as a specific marker of cardiac sympathetic outflow or sympathovagal balance."
    limitation: "Guideline for research; expert consensus."
  - claim: "The input signal, recording length and place, breathing and analytical approach can all affect HRV results."
    sources: [S1]
    class: guideline
    claimType: measurement
    quote: "technical approaches such as the HRV input signal (e.g., electrocardiography vs. photoplethysmography), length of recording, location of recordings (i.e., laboratory vs. field), respiratory rate and depth, and analytical approaches (i.e., time vs. frequency domain) can all impact rigor, reliability, and study interpretations."
    limitation: "Guideline for research; expert consensus."
  - claim: "HRV findings are easy to misread, which correct methods can only partly control."
    sources: [S2]
    class: context-dependent
    claimType: measurement
    quote: "This ease of access should not obscure the difficulty of interpretation of HRV findings that can be easily misconstrued, however, this can be controlled to some extent through correct methodological processes."
    limitation: "Methods review for psychophysiological research."
  - claim: "HRV indices are highly sensitive to physiological and methodological context, including recording duration, signal quality, breathing pattern, posture, time of day, medication and analytical method."
    sources: [S3]
    class: context-dependent
    claimType: measurement
    quote: "HRV indices are highly sensitive to physiological and methodological context, including recording duration, signal quality, respiratory pattern, posture, behavioral state, circadian timing, medication use"
    limitation: "Narrative methods review with a proposed reporting checklist; closed access, abstract only."
  - claim: "Single indices such as LF/HF are at risk of being overinterpreted as direct measures of the balance between the two branches of the autonomic nervous system."
    sources: [S3]
    class: context-dependent
    claimType: measurement
    quote: "the risk of overinterpreting single indices such as LF/HF as direct measures of sympathovagal balance"
    limitation: "Narrative methods review with a proposed reporting checklist; closed access, abstract only."
  - claim: "ONDA builds a personal baseline from HRV, resting heart rate and breathing rate values in Apple Health."
    sources: [S4]
    class: established
    claimType: device
    quote: "HRV, resting heart rate and breathing rate — ONDA builds your personal baseline"
    limitation: "Describes app behaviour only."
  - claim: "ONDA is not a medical device and does not diagnose any condition."
    sources: [S4]
    class: established
    claimType: device
    quote: "ONDA is not a medical device and does not diagnose, treat or monitor any condition."
    limitation: "Describes app scope only."
---

## Why does method matter for heart rate variability?

Heart rate variability (HRV) is easy to record and hard to read. A research guideline notes that the methods, analyses and interpretations used in HRV studies vary widely, and that debates about its reliability remain [S1]. A methods review makes the same point from psychophysiology: the ease of measuring HRV can hide how easily its findings are misread [S2]. ONDA Science is built around that problem. This page sets out the rules every page follows, so that a reader can see why a sentence is worded the way it is.

## How is each source checked?

- **Identity.** Before a journal source is used on a science page, its DOI is looked up in Crossref or its PMID in PubMed, and its title, authors and year are compared with the reference. A source that does not match is removed.
- **Site-wide citation check.** Across the whole site — science pages, articles, reviews and the glossary — every PMID, DOI and PMC identifier must be in a citation register filled from PubMed and Crossref. The site build fails if a cited identifier is missing from the register, does not exist, or is known to point to a different paper. Where an author and year are written next to an identifier, the build also fails if that author is not among the paper's authors or the year is more than one year off. The build does not compare titles; that is part of the check before use.
- **Text.** Abstracts and, where open, full texts are read through Europe PMC or the publisher. A claim that rests on a part of the paper that could not be read is not made.
- **Quote.** Each claim in a page's evidence table carries a quote copied word for word from the source, and the quote is compared with the abstract or full text before the page is published. If the quote states a neighbouring idea rather than the claim, the claim is rewritten or removed.
- **Numbers.** Every number on a science page comes from one list of approved facts; only years, dates and official regulatory designations are written directly. Each fact records its source and what it applies to — population, method, time of day — and a new number waits for the editor's approval before it can be published.
- **Duplicates and replacements.** In the register of candidate sources, the same study found twice is merged into one entry, and when a newer review replaces an earlier one, the earlier entry is kept and marked as replaced rather than silently dropped.

## How is the strength of a claim graded?

Grades are attached to a specific claim, not to a product or a topic. Each claim in a page's evidence table carries exactly one evidence class:

- **Established** — consistent meta-analytic evidence, or long-settled textbook physiology (anatomy and basic mechanisms, not the effects of interventions). A single small trial is never labelled established, and the effects of breathing, cold, practices or devices are never established on textbook grounds alone.
- **Guideline / expert consensus** — a recommendation or methodological standard from a guideline. This is the strength of agreement among experts, not of outcome data.
- **Context-dependent** — supported, but only in a stated population, condition or measurement setting.
- **Emerging** — early or small studies point one way; the evidence is not yet consistent.
- **Debated** — credible sources disagree.
- **Unknown** — not studied enough to say.

Some question pages also sum up the evidence in plain words: shown, mixed, not shown and no data. Not shown means the studies looked for an effect and did not find it; it is not proof that the effect does not exist. No data means no study measured it, which is a gap, not a refutation. An association is never written as a cause.

## Which studies count, and for what?

- **Animal studies.** A finding in animals is labelled as an animal finding and is not presented as evidence about people.
- **Narrative reviews.** A review without a systematic search is labelled as a narrative review in the evidence table, and its summary is never presented as a pooled result. On its own it can support an established claim only for long-settled textbook physiology, and only when it is a classic reference review.
- **Single studies.** A result from one study is described as one study, with its population and design, and is never labelled established.
- **Maker-linked studies.** A study run or funded by the maker of a device is flagged as such, and it does not move a claim into a stronger evidence class.
- **Abstract and full text.** When the abstract and the full text of a paper disagree, the full text is used.

## Why is a group result not a personal verdict?

Almost every study reports averages across groups of people. A pooled effect says what tends to happen in a population like the one studied; it does not say what will happen to one person, and it does not travel to a different age group, sport or health condition. Pages name the population every time and keep results from, say, older adults apart from claims about young people.

## How are device and regulatory claims handled?

- **Official sources only.** A device's regulatory status comes from the regulator's own database, not from the maker's website. Registering a device with a regulator is not the same as clearance or approval.
- **Device documentation.** Manufacturer and regulator documents are cited only for what a device records or what a clearance covers, never for a health or efficacy claim.
- **Validation studies.** When a study compares named watches with a reference, the result is reported as a finding about those models in that setting, not as a recommendation.

## How do reviews use this evidence?

Device reviews on ONDA apply the same evidence rules, with a scoring layer of their own. Studies run or funded by the maker do not count as independent validation. A maker's regulatory claims are checked against the product's status in official databases: registration or clearance adds nothing to a score, and misrepresenting it costs points. When a maker's own materials claim clinical proof or studies that do not exist for that product, the score is lowered and the review quotes the maker's words. The full scoring rules are on the [review methodology](/reviews/methodology) page.

## How are funding and conflicts of interest reported?

Funding and declared conflicts of interest are read from the paper and noted with the source. Company funding or a maker's involvement is stated in the text when it bears on the claim. When the statement could not be read — for example, behind a paywall — the source note says it could not be checked. A missing statement is never presented as the absence of a conflict.

## What are the limits of HRV measures?

HRV indices are highly sensitive to context: recording length, signal quality, breathing, posture, time of day, medication and the analytical method all change the numbers [S3]. The input signal — an electrocardiogram or a wrist or finger pulse sensor — and the place of recording matter too [S1]. ONDA Science therefore compares results only across similar recording conditions and says which conditions each study used.

Two cautions run through every page. HRV is not a specific marker of sympathetic activity or of the balance between the two branches of the autonomic nervous system [S1]. Single frequency-domain indices, the LF/HF ratio above all, are easily overinterpreted and are reported only as what the study measured, with that caveat attached [S3].

## What it does not tell you

- **A checked source is not a proven claim.** Verification confirms that a paper exists and says what is quoted; the strength of the claim is set by its evidence class.
- **Not shown is not proof of absence.**
- **These rules do not make ONDA a medical service.** They govern how the science section is written.

## In ONDA

The same rules apply to what pages say about ONDA itself: ONDA builds a personal baseline from HRV, resting heart rate and breathing rate values in Apple Health and describes how your latest values compare with your own range [S4]. It is not a medical device and does not diagnose [S4], and claims about the app are checked against how the app actually works. How ONDA's own measurements work is set out on [how ONDA measures and interprets your signals](/science/measurements/onda-method).

> Educational information, not a diagnosis or medical treatment.
