---
# ONE file per science page: landing/content/science/<kind>/<slug>.md
# kind = concepts | measurements | mechanisms | evidence   (no questions, no research)
kind: concepts
slug: example-entity
title: "Example Entity — What It Is and What It Isn’t"   # page H1, ≤ 70 chars
metaTitle: "Example Entity: Definition and Evidence"     # ≤ 52 chars (site adds " | ONDA Life")
metaDescription: "Answer-first summary in one or two sentences, 120–155 characters, no hype, no numbers outside fact references."
shortAnswer: >
  40–80 words. Pattern: “[Entity] is [definition]. It is used to [function].
  It is influenced by [factors]. It does not by itself establish [limitation].”
keyPoints:            # 3–7 bullets, each one sentence
  - "First key point."
  - "Second key point."
  - "Third key point."
editor: "Yakiv Bilenko"
reviewer: null        # "Valentin Zhigulin" ONLY if he actually read this page — set by Yakiv, never by the author
lastReviewed: null    # set by Yakiv at merge (YYYY-MM-DD)
related:
  glossary: [heart-rate-variability]                  # existing /glossary/<slug>
  articles: [normal-hrv-by-age]                       # existing /articles/<slug>
  tools: [hrv]                                        # existing /tools/<slug>
  science: []                                         # other /science/<kind>/<slug> pages
sources:              # every source cited in the body; DOI or PMID required (checked against Crossref / PubMed)
  - id: S1
    cite: "Task Force of the ESC and NASPE (1996)"
    title: "Heart rate variability: standards of measurement, physiological interpretation and clinical use"
    journal: "Circulation"
    year: 1996
    doi: "10.1161/01.CIR.93.5.1043"
    type: guideline          # systematic-review | meta-analysis | randomized-trial | observational | review | guideline | other
evidenceMap:          # one row per factual claim in the body (spec 002 §15)
  - claim: "RMSSD is computed from successive differences between heartbeats."
    sources: [S1]
    class: established       # established | context-dependent | emerging | debated | unknown
    limitation: "Definition only; says nothing about health outcomes."
---

## What is example entity?

Plain English, short paragraphs. Cite sources inline as [S1]. Numbers ONLY through fact references, e.g. typical night-time RMSSD at 40–49 is {{fact:hrv.rmssd.typical.40-49}} [S1].

## How does it work?

## How is it measured?

## What affects it?

## What does the evidence show?

Use the claim classes: what is established, what depends on context, what is emerging or debated, what is unknown.

## What it does not tell you

## In ONDA

One short, factual paragraph about how ONDA uses this (check docs/onda-facts-source-of-truth.md). The page must stay useful if this section is removed. No promotion.

> Educational information, not a diagnosis or medical treatment.
