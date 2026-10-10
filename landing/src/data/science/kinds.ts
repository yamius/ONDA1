/**
 * ONDA Science kinds — the URL sections /science/<kind>/<slug>. The one list: used by the generator
 * (scripts/generate-science-pages.ts → SCIENCE_KINDS in src/generated/science-pages.ts), the content check
 * (scripts/check-science-content.ts) and the interface strings (i18n.ts). Order = order of the sections on the hub.
 * A new kind also needs its label and description in every language of SCIENCE_UI (i18n.ts; tsc enforces it).
 */
export const SCIENCE_KIND_IDS = ['concepts', 'measurements', 'mechanisms', 'evidence', 'questions'] as const
export type ScienceKindId = (typeof SCIENCE_KIND_IDS)[number]

/**
 * A section page /<lang>/science/<kind> is indexed — in the sitemap (and so IndexNow), linked from the /science hub
 * heading and from the breadcrumbs of its pages — only once the kind has at least this many published pages in that
 * language. Below it the section page is still served, but with robots "noindex, follow" and no links pointing to it;
 * the pages of the kind themselves are indexed and listed on the hub as usual. Generic rule (src/lib/science-meta.ts
 * kindIndexed), first used for `questions` (task 064, 2026-10-10).
 */
export const MIN_PAGES_FOR_INDEXED_KIND = 3
