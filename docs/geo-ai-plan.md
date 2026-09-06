# ONDA GEO/AI Citability Plan

**Goal:** make ONDA a source AI systems (ChatGPT, Perplexity, Gemini, Google AI Overviews, Copilot) can *understand, verify, match to a user query, and cite* — not just a brand site they index.

**Origin:** ChatGPT audit of the live site + reconciliation against the actual codebase (2026-09-06). Ordered fastest+highest-value → global.

---

## What is ALREADY done (don't redo — ChatGPT missed the build-time layer)

ChatGPT analysed only the rendered page and assumed the technical layer was missing. In fact:

- **robots.txt** explicitly allows `OAI-SearchBot`, `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, etc. + two sitemaps.
- **Entity graph in schema.org** (injected in `scripts/meta-inject.ts`): `Organization → Person (@id)`, `SoftwareApplication` (HealthApplication), `WebSite`, `TechArticle`, `BreadcrumbList`, `DefinedTerm`/`DefinedTermSet`, `FAQPage`, `HowTo`, `Quotation`, `SpeakableSpecification`, `Audience`.
- **ai.txt** (attribution policy), **llms.txt + llms-full.txt** generated at build (`scripts/llms-txt.ts`), per-locale llms.txt, **feed.xml/atom.xml** (`scripts/feed.ts`), **rag-corpus** (`scripts/rag-corpus.ts`), **ai-audit** (`scripts/ai-audit.mjs`).
- **IndexNow** auto on deploy.
- **Review vs-infrastructure**: 134 head-to-heads + 167 reviews rendered from data — a reusable pattern for ONDA-vs-competitor pages.

**Implication:** the 30-day "rebuild" is unnecessary. The real gaps are a *small number of citable pages + claims discipline + entity tightening*.

---

## Canonical entity (use verbatim everywhere)

> **ONDA Life is an HRV biofeedback and guided-breathing app for real-time physiological self-regulation and nervous-system training.**
> Structured HRV biofeedback: guided breathing with live heart-rhythm feedback, across an 8-level path. iPhone camera PPG + Apple Watch. HealthApplication (iOS, Android).

Biohacking / consciousness / DNA / "biocomputer" / 24-stage philosophy = **secondary brand layer**, never the primary entity definition.

---

## 🟢 Tier 1 — Quick wins (days, max ROI)

1. **Fix llms.txt entity framing** ⭐ highest-leverage single edit.
   The generated `llms.txt` HEADER currently leads with *"biohacking and consciousness-engineering operating system… biocomputer… 24-stage level architecture"* and the Core-pages list omits the product entirely (no HRV biofeedback, no app, no App Store). This is the first paragraph every LLM reads. Rewrite HEADER + Core pages to lead with the canonical product entity; keep biohacking as a secondary section. Edit: `scripts/llms-txt.ts`.
2. **`/measurements`** — "What ONDA measures" table (Signal → Source → Directly measured / Derived / Estimated / Meaning). Most citable missing page; low effort (data page like tools). Reuse `SoftwareApplication` schema.
3. **`/how-it-works`** — how ONDA computes HRV (RMSSD/SDNN, sampling, artifacts, min data, bad-signal handling) and coherence (signals, window, what the score does *not* mean). Machine-verifiable technical objects.
4. **Claims-discipline sweep** on top pages — 4 levels: **A measures / B calculates / C research suggests / D exploring** + explicit "Evidence / limitations". Convert "ONDA says X" → "Research shows X; ONDA applies it as…".

## 🟡 Tier 2 — Core citability (2–3 weeks)

5. **Evidence Center** — upgrade `/research`: cards `Claim → Evidence (DOI + PMID + study type + n) → What ONDA does → What is NOT proven`. Build as a structured dataset (reviews pattern) for reuse.
6. **`/people/yakiv-bilenko`** standalone Person entity (Person schema exists) + **scientific advisor** full identity (name, affiliation, ORCID, role).
7. **ONDA vs alternatives** — `/compare/onda-vs-{oura,whoop,headspace,calm,breathwrk,elite-hrv}`, objective capability tables (reuse head-to-head renderer). Direct recommendation-engine material.
8. **`/product`** canonical page + **Product Facts** synced with the App Store listing.
9. **ONDA FAQ hub** — 40–60 real questions, short answer + source + link (FAQPage JSON-LD infra exists).

## 🔴 Tier 3 — Global / structural (30+ days; some need user's data)

10. **Split glossary** — scientific terms vs ONDA terminology (semantic layer/label on the existing `DefinedTermSet`).
11. **Evidence vs Philosophy** — separate semantic layers site-wide + disclaimer ("The ONDA Path is an experiential framework, not a hierarchy of validated biological states").
12. **Entity tightening** — primary = HRV biofeedback app; demote biohacking / consciousness / DNA to secondary across home, about, glossary.
13. **Outcome data** page — pilot data (n, adherence, baseline HRV change) + "preliminary, not independently validated". **Needs real data — founder's call.**
14. **Monitoring** — Bing Webmaster **AI Performance** (actual AI citations), GSC Generative-AI report, monthly 50-query AI-citation benchmark (ChatGPT / Google AI / Gemini / Perplexity / Bing: mentioned? cited? which URL? which sentence?).

## Do NOT do

- Not another 200 biohacking/philosophy articles — content volume is already ample (89 articles, 215 glossary terms, 167 reviews). The missing layer is **provability + entity clarity**, not volume.
- Don't treat `llms.txt` as a Google magic button (Google says it isn't needed for Google AI) — but we already ship it, so keep it correct.
- Don't rely on FAQ rich results as an SEO trick (Google retired FAQ rich results May 2026) — build FAQ for answer retrieval, not the old SERP snippet.

---

*Progress log:*
- 2026-09-06: Plan saved. **Tier 1 COMPLETE** (commits 78660c60, 76ea3f2d, e440c164):
  - #1 llms.txt entity-framing → product-first (was "biohacking/consciousness OS/biocomputer").
  - #2 `/measurements` — signal table (measured/derived/estimated) + FAQPage JSON-LD.
  - #3 `/how-it-works` — HRV/coherence computation + boundaries.
  - #4 claims sweep — `/about` product-entity lead + evidence/philosophy disclaimer; softened the hardest unsupported causal claims in the nervous-system-latency articles (cortisol, "persists for hours", cerebral blood flow). Rest of corpus already well-hedged (prior honesty reframe).
  - ~~Follow-up debt: non-EN about.json intro1~~ **RESOLVED same day**: intro1 translated product-first + `disclaimer` key added in all 4 non-EN locales (es, ru, uk, zh).
- 2026-09-06: **Tier 2 #5 Evidence Center DONE** (commit 28a789a2). `/research` upgraded from a prose reference list to a structured, verified evidence base (`src/data/evidence.ts`): each claim renders Claim → What ONDA does → What this does NOT prove; each reference carries authors/year/journal/study-type/DOI/PMID + ScholarlyArticle JSON-LD. Verification surfaced + fixed two real defects: a wrong PMID on Lehrer & Gevirtz (was 19246382 → an unrelated paper; correct 25101026) and a Thayer citation-text/PMID mismatch. All 4 refs verified via PubMed/DOI.
- 2026-09-06: **Tier 2 #7 ONDA-vs-alternatives DONE** (commit 2db547f3). `/compare` hub + 6 pages (`/compare/onda-vs-{oura,whoop,headspace,calm,breathwrk,elite-hrv}`), dataset `src/data/onda-vs.ts`. Kept separate from the independent /reviews firewall (transparency banner + links to the independent competitor review where one exists). One fixed capability-axis set, ONDA's column defined once, factual competitor values (Elite HRV = genuine peer; Breathwrk HRV = premium+Bluetooth only). FAQPage JSON-LD per page. Competitor facts verified 2026.
- 2026-09-06: **Tier 2 #8 /product DONE** (commit 5ef7dcd0). Canonical machine-readable product page: Product Facts table synced to App Store (id 6755912529), what it does, who it is/isn't for, SoftwareApplication JSON-LD (HealthApplication, iOS/watchOS, free offer). Honesty: iOS-only today (Android = waitlist, not listed available); no invented subscription price.
- 2026-09-06: **Tier 2 #9 FAQ hub DONE** (commit 71b7b335). `/faq` — 38 self-contained Q&A across 6 groups (`src/data/onda-faq.ts`), FAQPage JSON-LD over all items (client + build-time). Answer-engine oriented, honest, with deeper links.
- 2026-09-06: **Tier 2 #6 founder half DONE** (commit a8ad95eb). `/people/yakiv-bilenko` ProfilePage + Person (@id #author) with real credentials (architect KNUCA 2006; Gestalt therapist MIGIS 2018; KUKOOM + LinkedIn sameAs). Also fixed a site-wide author-schema overclaim: removed "neuroscience/neuroplasticity/consciousness" from the founder's knowsAbout (that's the advisor's domain), added alumniOf + hasCredential, and an explicit "founder ≠ scientific authority" note.
  - **Advisor half still BLOCKED**: only "Valentin", role, PhD field and 3 contribution bullets are known — no full name, affiliation, ORCID or consent. Nothing invented; advisor stays as the existing /research TeamCard until real identifiers + consent arrive. To finish: full name, university/affiliation, PhD (where/when/field), ORCID (or Scholar/ResearchGate), specific ONDA role, 1-3 papers w/ DOI, and consent to publish full name.
- 2026-09-06: **Tier 3 #10 glossary split DONE** (commit 7c9ed57f). `glossaryLayer` / `ONDA_VOCAB_SLUGS` in glossary.ts — conservative 13-term ONDA-coinage allowlist, everything else = science. Term page badge (Scientific term / ONDA concept) + honest note + DefinedTerm JSON-LD prefix on ONDA terms; index badge. Category deliberately not used (hub buckets mix coinages with real science).
- 2026-09-06: **Tier 3 #11 evidence-vs-philosophy DONE** (commit 88c5277e). Shared `<ExperientialFrameworkNote>` at the bottom of Inner Spectrum, /level/*, /part/* and The Stack — marks the ONDA Path as an experiential framework, not validated biology, linking to /research + /measurements. Philosophy untouched.
- 2026-09-06: **Tier 3 #12 entity tightening DONE** (commit 9425d46f). Organization JSON-LD description anchors the entity as an HRV-biofeedback app; glossary title/desc/subtitle (meta-inject + en/glossary.json) now lead with HRV/vagus/resonance breathing (was "molecular psychology / consciousness architecture", no HRV); RAG-corpus keywords reordered core-first; homepage About aria label "biohacking OS" -> product entity. Homepage title/tagline + /about were already product-first (Tier 1).
- **Next: Tier 3** — outcome data (#13, needs real pilot data), monitoring (#14, needs Bing/GSC access). Also pending: Tier 2 #6 advisor half (needs Valentin's real data). Most of the codebase-only GEO work is now DONE.
