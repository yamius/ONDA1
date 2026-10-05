---
# ONE file per science page: landing/content/science/<kind>/<slug>.md
# kind = concepts | measurements | mechanisms | evidence   (no questions, no research)
kind: concepts
slug: example-entity
title: "Example Entity — What It Is and What It Isn’t"   # page H1, ≤ 70 chars, no digits
metaTitle: "Example Entity: Definition and Evidence"     # ≤ 48 chars (site adds " | ONDA Life" and cuts above 60), no digits
metaDescription: "Answer-first summary of the entity in one or two plain sentences, written for a reader and an AI answer alike, with no hype."   # 110–155 chars, no digits
shortAnswer: >      # forty to eighty words, no digits
  Example entity is a short, exact definition of the thing this page is about. It is used to describe
  a specific function in plain words. It is influenced by the major factors a reader should know about.
  It does not by itself establish the most important limitation that people tend to overlook.
keyPoints:            # 3–7 bullets, each one self-contained sentence, no digits
  - "First key point."
  - "Second key point."
  - "Third key point."
imageAlt: "One plain sentence, forty to two hundred characters, saying what the hero image shows and, if useful, what it represents."
imagePrompt: "Minimal scientific illustration on a clean white background: one visual idea tied to the entity, thin teal lines with a soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, landscape."
# image: set by Claude Code when Yakiv sends the file (/images/science/<slug>.jpg) — do not write it yourself
editor: "Yakiv Bilenko"
reviewer: null        # "Valentin Zhigulin" ONLY if he actually read this page — set by Yakiv, never by the author
lastReviewed: null    # set by Yakiv (YYYY-MM-DD)
related:              # pages that EXIST today (the check verifies each one)
  glossary: [heart-rate-variability]                  # /glossary/<slug>
  articles: [normal-hrv-by-age]                       # /articles/<slug>
  tools: [hrv]                                        # /tools/<slug>
  science: []                                         # /science/<kind>/<slug> already published
relatedPlanned:       # optional: science pages from the MVP list NOT written yet, as <kind>/<slug>.
  - concepts/sdnn     # Not checked for existence; shown automatically once that page is published.
sources:              # every source cited in the body
  - id: S1
    cite: "Task Force of the ESC and NASPE (1996)"
    title: "Heart rate variability: standards of measurement, physiological interpretation and clinical use"
    journal: "Circulation"
    year: 1996        # year of the journal volume/issue, not the online-first date
    doi: "10.1161/01.CIR.93.5.1043"   # scientific types: DOI or PMID required (looked up in Crossref / PubMed)
    type: guideline   # systematic-review | meta-analysis | randomized-trial | observational | review | guideline | other | official
    # note: "authors include an industry adviser"   # optional: a short disclosure shown in the sources list only (conflicts of interest, online-first year)
  - id: S2
    cite: "Apple HealthKit documentation"
    title: "heartRateVariabilityRMSSD"
    url: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilityrmssd"
    type: official    # official (manufacturer/regulator) or product-documentation (ONDA's own pages): URL required (must open), no DOI. ONLY for device / regulatory facts.
evidenceMap:          # one row per factual claim in the body
  - claim: "RMSSD is computed from successive differences between heartbeats."
    sources: [S1]
    class: guideline         # established | guideline | context-dependent | emerging | debated | unknown
    claimType: definition    # definition | measurement | physiology | device | regulatory | efficacy | safety | other
    quote: "RMSSD, the square root of the mean squared differences of successive NN intervals"   # exact text from the source that states the claim
    limitation: "Definition only; says nothing about health outcomes."
  - claim: "Apple Health offers an RMSSD data type."
    sources: [S2]            # an official source → claimType must be device or regulatory, never a health/efficacy claim
    class: established
    claimType: device
    quote: "A quantity sample type that measures the standard deviation of heartbeat intervals."   # copy the exact sentence from the official page
    limitation: "Documents the data type only, not how any watch feature computes its values."
proposals:            # optional: values or sources that are NOT yet in 03-facts.md / 04-sources.md
  - id: P1
    kind: fact               # fact | source
    value: "about five minutes"          # the text that {{proposed:P1}} shows in the draft
    scope: "Standard short-term recording length"
    doi: "10.1161/01.CIR.93.5.1043"      # or pmid; url only for official documents
    location: "Section on short-term recordings"   # or quote: "exact sentence from the source"
---

## What is example entity?

Plain English, short paragraphs. Cite sources inline as [S1]. Numbers ONLY through references:
approved facts like {{fact:hrv.rmssd.typical.40-49}} [S1], or your own proposal like {{proposed:P1}} [S1].

## How does it work?

## How is it measured?

## What affects it?

## What does the evidence show?

Use the claim classes: what is established, what guidelines or expert consensus recommend, what depends on context, what is emerging or debated, what is unknown.

## What it does not tell you

## In ONDA

One short, factual paragraph about how ONDA uses this (check docs/onda-facts-source-of-truth.md). The page must stay useful if this section is removed. No promotion.

> Educational information, not a diagnosis or medical treatment.
