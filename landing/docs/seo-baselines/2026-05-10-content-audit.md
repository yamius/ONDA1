# Content audit — 18 URLs in 🔴 Crawled-not-indexed

> Output of the 2026-05-10 GSC coverage run. Google fetched these URLs
> and decided they were not worth indexing. Improving the page is the
> only path forward — re-submitting unchanged content does not help.
>
> Source data: `landing/.cache/gsc-history/2026-05-10.json`.

## Articles (5)

CONTRIBUTING.md spec for articles: **1,500–2,500 words** body, with
`## TL;DR`, `## Common Questions`, `## References` sections, plus
`> **The Hack:**` blocks and `[ HARDWARE_VALIDATION ]` footer. All five
articles below fall short on word count and on most or all required
sections.

| Slug | Words | Hack | HW | Refs | FAQ | TL;DR | Notes |
|---|---:|:-:|:-:|:-:|:-:|:-:|---|
| ai-biomarker-tracking-predictive | 279 | ✓ | ✓ | ✗ | ✗ | ✗ | Stub-length. Topic was rolled-back during the Replit marathon revert; body never re-expanded. |
| cacao-stem-cells | 412 | ✓ | ✓ | ✗ | ✗ | ✗ | Body half target. Has Hack + HW but no scaffolding. |
| ancestral-sync-circadian-anchors | 692 | ✓ | ✗ | ✗ | ✗ | ✗ | Half target. Missing Hardware Validation footer. |
| fault-tolerant-human-hrv-buffer | 705 | ✗ | ✗ | ✗ | ✗ | ✗ | Half target. Featured pillar article (HRV cluster) — high priority to fix. |
| resonant-frequency-system-coherence | 699 | ✗ | ✗ | ✗ | ✗ | ✗ | Half target. Featured pillar (HRV cluster). |

## Glossary terms (13)

Reference quality bar for medical / biohacking glossary entries (per
Healthline / Cleveland Clinic / Mayo Clinic): **300–500 words** with
definition → mechanism → clinical relevance → cross-links → references.
All 13 below are 87–172 words — Google classifies as low-value content.

| Slug | Words | shortDesc |
|---|---:|---|
| firmware-update | 172 | structured practice session |
| metabolic-flexibility | 123 | mitochondrial fuel switching |
| autophagy | 106 | cellular cleanup |
| parasympathetic-nervous-system | 98 | rest and digest branch |
| central-pattern-generators | 113 | spinal rhythmic-movement circuits |
| proprioception | 123 | body position sense |
| cognitive-system | 142 | thinking / memory / decision networks |
| adrenaline | 107 | adrenal-medulla mobilisation hormone |
| pelvic-diaphragm | 132 | pelvic floor muscle |
| nitric-oxide | 102 | vasodilator from paranasal sinuses |
| sarcopenia | 87 | age-related muscle loss |
| vasomotricity | 112 | blood-vessel tone regulation |
| ampk | 331 | cellular energy sensor — already 300+ |

Note: **ampk** is already at 331 words — that one being in the bucket
suggests there's something else (canonical, internal-link gap) rather
than thin content. Worth inspecting separately.

## Recommended template for expanded glossary entry

```markdown
# {Term}

{One-sentence canonical definition — 15-25 words}

## Mechanism

{2-3 sentence explanation of how it works at the biological level.
Cite the molecular pathway or circuit. Use ONDA voice — biocomputer
metaphors, technical-poetic-engineering tone.}

## Why it matters in ONDA

{2-3 sentences connecting the term to ONDA protocols. Reference which
levels (1-8) or parts work with this. Cross-link 2-3 related glossary
terms and 1-2 articles.}

## Healthy vs Degraded

**Healthy:** {one-line state}
**Degraded:** {one-line state}

## See also

- [Related Term 1](/glossary/...)
- [Related Term 2](/glossary/...)
- [Article: Deep dive](/articles/...)

## References

- [PubMed citation](https://pubmed...) — what the paper showed
- [Second source](https://...) — what it adds
```

Target: 280–400 words body.

## Recommended template for expanded article

Use the existing canonical structure from CONTRIBUTING.md:

```markdown
> Hero blockquote (intro paragraph, brand-vibe)

## SECTION 1: <TITLE>

{500-700 words — concept introduction, biological mechanism, what
breaks, what restores}

> **The Hack:** {protocol payload — concrete actionable instruction}

## SECTION 2: <TITLE>

{500-700 words — deeper dive, related concepts, edge cases}

## SECTION 3: <TITLE>

{500-700 words — integration with ONDA system, levels/parts mapping}

## TL;DR

- 5 bullet points, one per major insight

## Common Questions

5 Q&A pairs — fuels FAQPage JSON-LD schema.

## References

DOI / PubMed citations as footnotes.

## [ HARDWARE_VALIDATION ]

VALIDATION_DEVICE: {what to measure with}
METRIC: {what to look at}
STATUS: BIOMETRIC_VERIFIED
```

Target: 1,500–2,500 words body (vs current ~280–705).

## Open questions for the next session

1. Are 5 of the 5 articles in this bucket also priority for the topic
   hubs? (vagus-nerve, neuroplasticity-flow, circadian-reset etc. are
   NOT in this bucket — those got indexed.)
2. Should we expand the 13 glossary terms in one batch (10K words) or
   spread across 4-6 weeks?
3. Should the article expansion be ours (LLM draft + human review) or
   should we wait for the founder to write key sections?

## Cadence checkpoint

Re-run `npm --prefix landing run audit:gsc` weekly. If a URL stays in
🔴 Crawled-not-indexed for 2+ weeks, content fix is overdue.
