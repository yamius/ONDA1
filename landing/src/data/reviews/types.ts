/**
 * Content type for the /reviews hub — ONDA's editorial reviews and
 * comparisons of biohacking tools (HRV wearables first).
 *
 * Two archetypes:
 *   ToolReview  — one product, scored against per-category criteria.
 *   Comparison  — a ranked round-up that composes several ToolReviews.
 *
 * Scores are a single expert editorial assessment (author: Yakiv Bilenko),
 * surfaced as schema.org/Review with a reviewRating — never an
 * aggregateRating, which would require real aggregate data.
 */

/** Niche a review belongs to. Kept narrow on purpose — extend only when a
 *  category gains its own criteria set in criteria.ts. */
export type ReviewCategory =
  | 'hrv-wearable'
  | 'meditation-app'
  | 'sleep-app'
  | 'vagus-stim'
  | 'cgm'
  | 'eeg-headset'
  | 'red-light'
  | 'cold-plunge'
  | 'sauna'
  | 'sleep-climate'
  | 'pemf'
  | 'breathwork-app'
  | 'red-light-mask'

/** How a verdict link is treated. 'affiliate' flips rel="sponsored nofollow"
 *  plus a visible disclosure badge in the UI. v1 ships everything 'official'. */
export type LinkType = 'official' | 'affiliate'

/** Whether ONDA physically used the device or assessed it from public
 *  evidence. Shown verbatim on the page — the core honesty signal. */
export type TestStatus = 'hands-on' | 'evidence-based'

/** A single scoring axis for a category. Weights within a category sum to 1. */
export interface Criterion {
  id: string
  label: string
  /** Share of the overall score, 0–1. */
  weight: number
  /** Plain-English description shown on the methodology page. */
  description: string
}

/** One scored criterion within a review. `criterionId` must match a
 *  Criterion.id from criteria.ts for the review's category. */
export interface CriterionScore {
  criterionId: string
  /** 0–10, one decimal. */
  score: number
  /** One- or two-sentence justification — shown next to the score. */
  note: string
}

/** External source backing a factual claim (device validation studies). */
export interface ReviewReference {
  label: string
  url: string
}

/** Price snapshot. `asOf` is an ISO date — prices drift, so the page
 *  always shows when the figure was last verified. */
export interface ReviewPrice {
  usd: number
  /** Subscription or bundle caveats, e.g. "+ $6/mo membership". */
  note?: string
  /** ISO date (YYYY-MM-DD) the price was last verified. */
  asOf: string
}

export interface ToolReview {
  slug: string
  /** Full product name, e.g. "Oura Ring Gen4". */
  name: string
  /** Manufacturer, e.g. "Oura". */
  brand: string
  category: ReviewCategory
  /** Human-readable form factor, e.g. "Smart ring", "Chest strap". */
  productType: string
  /** SEO meta description (140–160 chars). */
  description: string
  /** One-line ONDA verdict — the quotable line for AI answers. */
  verdict: string
  /** TL;DR paragraph shown above the fold. */
  summary: string
  /** Overall editorial score, 0–10 (one decimal). Weighted mean of scores. */
  overallScore: number
  /** Per-criterion breakdown. Order follows criteria.ts. */
  scores: CriterionScore[]
  pros: string[]
  cons: string[]
  /** "Best for ..." positioning line. */
  bestFor: string
  testStatus: TestStatus
  /** How it was tested or assessed — e.g. "6 weeks against a Polar H10
   *  chest strap" or "Assessed from spec sheets plus peer-reviewed
   *  validation studies (see References)". */
  testNote: string
  price?: ReviewPrice
  /** Official product URL. */
  link: string
  linkType: LinkType
  /** Image path from public root, e.g. /images/reviews/oura-gen4.webp */
  image?: string
  imageAlt?: string
  /** Markdown body of the review. */
  content: string
  references?: ReviewReference[]
  relatedSlugs?: string[]
  /** ISO date (YYYY-MM-DD). */
  datePublished: string
  /** ISO date (YYYY-MM-DD) — drives sitemap <lastmod> and the "Updated" UI. */
  dateModified: string
  /** Optional date-gate (YYYY-MM-DD). Same shape as HeadToHead.publishOn —
   *  the review is hidden from the live `reviews` array, the prerender
   *  route list and any helper lookup until this date. Used to drip-publish
   *  categories. Absent = live immediately. */
  publishOn?: string
}

/** One ranked entry on a Comparison page. */
export interface ComparisonPick {
  /** Slug of a ToolReview in the registry. */
  reviewSlug: string
  /** Award label, e.g. "Best overall", "Best value", "Best for athletes". */
  award: string
  /** One-line reason this pick won its award. */
  takeaway: string
}

/** A question/answer pair — feeds both the on-page FAQ and FAQPage JSON-LD. */
export interface ComparisonFAQ {
  q: string
  a: string
}

/** A side-by-side head-to-head duel between two or three ToolReviews —
 *  the format AI engines and SERPs surface for "X vs Y" (and "X vs Y vs Z")
 *  queries. Distinct from Comparison (which ranks ≥3 products as a ranked
 *  round-up). Each axis row picks a winner ('a' / 'b' / 'c' / 'tie') so
 *  the page reads as a verdict, not just a spec table. */
export interface HeadToHeadAxis {
  /** Short axis label, e.g. "HRV accuracy", "Sensor", "Price". */
  name: string
  /** Which product wins this axis, or 'tie'. 'c' is valid only when
   *  the parent HeadToHead is a three-way (productCSlug present). */
  winner: 'a' | 'b' | 'c' | 'tie'
  /** One-sentence justification — shown next to the axis row. */
  note: string
}

export interface HeadToHead {
  /** Canonical slug — typically <product-a>-vs-<product-b> or
   *  <product-a>-vs-<product-b>-vs-<product-c>. */
  slug: string
  /** Slug of the first ToolReview in the registry. */
  productASlug: string
  /** Slug of the second ToolReview in the registry. */
  productBSlug: string
  /** Slug of the third ToolReview — present only for three-way duels. */
  productCSlug?: string
  /** Page title, e.g. "Oura Ring 4 vs Whoop 5.0 (2026)". */
  title: string
  /** SEO meta description (140–160 chars). */
  description: string
  /** Intro paragraph framing the comparison. */
  intro: string
  /** Slug of the winning ToolReview, or null for a deliberate tie. */
  winnerSlug: string | null
  /** One-line verdict — the quotable single-sentence answer to "which one". */
  verdict: string
  /** "Choose A if…" line — the user-fit answer for product A. */
  bestForA: string
  /** "Choose B if…" line — the user-fit answer for product B. */
  bestForB: string
  /** "Choose C if…" line — required when productCSlug is set. */
  bestForC?: string
  /** Per-axis breakdown with a winner per row. 5–8 axes. */
  axes: HeadToHeadAxis[]
  /** Drives FAQPage JSON-LD plus an on-page FAQ block. */
  faq: ComparisonFAQ[]
  /** Markdown body — extended verdict, common scenarios, edge cases. */
  content: string
  /** Optional: slug of a Comparison round-up that contains the products,
   *  for the "see the full ranking" cross-link. */
  relatedComparisonSlug?: string
  /** Optional date-gate (YYYY-MM-DD): the duel is hidden from the live
   *  registry — and not prerendered — until this date. Used to drip-publish
   *  batches of comparisons rather than ship them all at once. Absent =
   *  live immediately. */
  publishOn?: string
  /** ISO date (YYYY-MM-DD). */
  datePublished: string
  /** ISO date (YYYY-MM-DD) — drives sitemap <lastmod> and the "Updated" UI. */
  dateModified: string
}

export interface Comparison {
  slug: string
  /** Page title, e.g. "Best HRV Trackers (2026)". */
  title: string
  /** SEO meta description (140–160 chars). */
  description: string
  /** Intro paragraph framing the round-up. */
  intro: string
  category: ReviewCategory
  /** Ranked picks — array order is the ranking. */
  picks: ComparisonPick[]
  /** Closing editorial verdict. */
  verdict: string
  /** Drives FAQPage JSON-LD plus an on-page FAQ block. */
  faq: ComparisonFAQ[]
  /** Markdown body — methodology recap, how picks were chosen, etc. */
  content: string
  /** ISO date (YYYY-MM-DD). */
  datePublished: string
  /** ISO date (YYYY-MM-DD) — drives sitemap <lastmod> and the "Updated" UI. */
  dateModified: string
  /** Optional date-gate (YYYY-MM-DD). Same shape as HeadToHead.publishOn —
   *  the comparison is hidden until this date. Used for drip-publication
   *  alongside its constituent reviews. Absent = live immediately. */
  publishOn?: string
}
