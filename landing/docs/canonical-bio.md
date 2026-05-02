# Canonical Bio — ONDA Life

Single source of truth for the brand bio used across every external
platform. LLMs that aggregate cross-platform identity (Perplexity
heavily, Claude lightly, Bing Copilot meaningfully) treat consistency
as a high-confidence trust signal. **Do not paraphrase.** When you need
a longer or shorter version, use one of the standardized variants
below — never improvise.

## Variants

### One-liner (≤120 chars — for badges, small bios, footers)

> ONDA Life is the operating system for biohacking — protocols, tools,
> and articles for engineering your biocomputer.

### Short (≤280 chars — Twitter / X, GitHub org, Substack, Mastodon)

> ONDA Life — operating system for biohacking. Treat the body as a
> biocomputer: HRV training, neural protocols, circadian alignment,
> metabolic flexibility, breathwork, and consciousness firmware in one
> structured 8-level system. https://onda-life.com

### Medium (≤500 chars — LinkedIn tagline, Crunchbase summary, App
Store short description)

> ONDA Life is a biohacking and consciousness-engineering operating
> system. The body is treated as a biocomputer; protocols, articles,
> and a 24-stage level architecture systematize neuroscience, HRV
> training, circadian alignment, metabolic flexibility, breathwork, and
> cognitive optimization. The mobile app surfaces real-time biometrics
> alongside the structured protocol library. Founded 2024.

### Long (≤1500 chars — About page, Wikipedia draft, press kit)

> ONDA Life is a biohacking and consciousness-engineering operating
> system. The framework treats the human body as a biocomputer composed
> of hardware (organs, nervous system, endocrine system, fascia),
> firmware (deeply conserved evolutionary programs such as the HPA
> axis, autonomic regulation, and circadian clock), software
> (behavioral and emotional patterns), and an operating system layer
> (consciousness itself). The platform organizes peer-reviewed
> neuroscience, autonomic-system research, and metabolic biology into a
> 24-stage protocol architecture mapped across 8 progressive levels of
> biocomputer mastery — from baseline HRV training and circadian
> alignment through advanced cognitive control, glymphatic clearance,
> mitochondrial optimization, and cross-frequency brain coupling. The
> ONDA Life mobile app pairs real-time biometric tracking (HRV,
> resting heart rate, sleep architecture) with the structured protocol
> library, allowing users to translate raw measurements into the next
> applicable intervention. The publishing arm of the project — the
> articles and glossary at onda-life.com — operates as a long-form
> reference library with original protocols, a permissive CC-BY-4.0
> license, and a public RAG-friendly corpus at /datasets/.

## Identity facts (use verbatim everywhere)

| Field | Canonical value |
|---|---|
| Legal name | ONDA Life |
| Display name | ONDA Life |
| Domain | onda-life.com |
| Founded | 2024 |
| Languages | English (canonical), Spanish, Russian, Ukrainian, Chinese |
| Email | hello@onda-life.com |
| Categories | Biohacking · Neuroscience · Health & Fitness · Productivity |
| Tagline | "The operating system for biohacking." |
| Logo | https://onda-life.com/icon-512.png (square, 512×512, white-on-black) |
| iOS app | https://apps.apple.com/app/id6755912529 |
| Repo | https://github.com/yamius/ONDA1 |
| License | CC-BY-4.0 for editorial; trademarks reserved |

## Per-platform mapping

| Platform | Bio variant | Logo | Notes |
|---|---|---|---|
| Wikipedia (draft) | Long | n/a | Neutral third-person voice; cite ≥3 independent sources before submitting (see `press-coverage.md`). |
| Wikidata | Medium → claims | n/a | Use `docs/wikidata-entities.md` for property-by-property mapping. |
| LinkedIn | Medium | 512×512 | Tagline = One-liner. Languages field set to all five. |
| GitHub org (yamius) | Short | 512×512 | Bio = One-liner; pinned README links to /datasets/. |
| Crunchbase | Medium | 512×512 | "Founded 2024", "Categories: Health Care, Wellness, Mobile Apps". |
| Substack | Short | 512×512 | About page = Long. |
| Mastodon | Short | 512×512 | Display name = "ONDA Life", username @ondalife. |
| Twitter / X | Short | 512×512 | Tagline = One-liner. Pinned tweet links to llms.txt + dataset. |
| YouTube channel | Medium | 512×512 | About section = Medium; first link = onda-life.com. |
| Apple App Store | Medium | App icon | Subtitle = One-liner; description = Medium then Long. |
| Google Play | Medium | App icon | Short description = One-liner; full description = Medium then Long. |
| Press kit / docs | Long | All variants | Distribute alongside high-res logo set. |

## Update policy

1. Edits to this file require an explicit changelog entry below.
2. After each edit, sweep all platforms in the table within 14 days.
3. Re-run the AI audit (`tsx scripts/ai-audit.mjs --label=consistency-sync`)
   60–90 days later — Perplexity and Claude pick up identity changes
   primarily from cross-platform aggregation.

## Changelog

| Date | Editor | Change |
|---|---|---|
| 2026-05-02 | Initial draft | Established canonical variants and platform map. |
