/**
 * Glossary term cards (owner decision 2026-11-15, variant C).
 *
 * One PNG per term and language, 1200×630, generated at BUILD time by
 * scripts/generate-glossary-cards.ts into dist/images/glossary/<lang>/<slug>.png
 * (not committed — keeps the repo small). The same file is:
 *   - og:image / twitter:image of the term page (full 1200×630);
 *   - the ImageObject of the term's DefinedTerm JSON-LD and the image sitemap entry;
 *   - the visible banner on the term page and in the glossary list, where CSS crops
 *     it to the middle band (object-fit: cover on a 4:1 box — all text lives in
 *     y 165–465, so the crop is the card).
 */
export const GLOSSARY_CARD_W = 1200
export const GLOSSARY_CARD_H = 630
/** Top of the 300-px content band; the band is vertically centred. */
export const GLOSSARY_CARD_BAND_TOP = 165

export function glossaryCardPath(slug: string, lang = 'en'): string {
  return `/images/glossary/${lang}/${slug}.png`
}

/** Accent colour per glossary category (the coloured letter block). */
export const GLOSSARY_CATEGORY_ACCENT: Record<string, string> = {
  'Neural Hardware': '#00d4ff',
  'Biological Software': '#c084fc',
  'OS States': '#4ade80',
  'ONDA Protocol': '#fbbf24',
}

/** Descriptive alt text: the term and its definition, in the page language
 *  (image search and answer engines read alt/caption as the image's meaning). */
export function glossaryCardAlt(title: string, shortDescription: string): string {
  const d = shortDescription.trim().replace(/\s+/g, ' ')
  return d ? `${title}: ${d}` : title
}
