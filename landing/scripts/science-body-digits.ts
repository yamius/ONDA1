/**
 * Digits allowed in the BODY of ONDA Science pages (shared by check-science-content.ts and
 * science-translation-helper.ts). Everything here is a label/identifier, not a claim; every other digit
 * must go through {{fact:…}}. Title, metaTitle, metaDescription, shortAnswer and keyPoints stay strict
 * (these helpers are never applied to them).
 */

// Years / study periods (owner decision 2026-10-08): a year 1900–2099 or a range like "1990–2002" / "1990-2002"
// describes WHEN a study ran (bibliographic description), not a claim.
// Kept tight so data still fails: no digit or % next to it and no decimal/thousands separator ("12.2014", "2,000"),
// and not followed by a count/unit ("2000 participants", "1950 ms" still fail).
export const STUDY_YEAR = /(?<![\d.,])(?:19|20)\d{2}(?:\s?[–-]\s?(?:19|20)\d{2})?(?![\d%]|[.,]\d)(?!\s*(?:%|ms|bpm|mg|kg|g\b|min|h\b|people|participants|subjects|patients|men|women|adults|children|users|nights|days))/g

// Full dates of regulatory / research events (owner decision 2026-10-08), in the 12 site languages.
// Month names are listed explicitly (stems + inflections) so "12 sessions 2026" can never pass as a date.
const MONTH = [
  // en
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
  // de
  'Januar', 'Jänner', 'Februar', 'März', 'Mai', 'Juni', 'Juli', 'Oktober', 'Dezember',
  // fr
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  // es
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'setiembre', 'octubre', 'noviembre', 'diciembre',
  // it
  'gennaio', 'febbraio', 'aprile', 'maggio', 'giugno', 'luglio', 'settembre', 'ottobre', 'dicembre',
  // pt
  'janeiro', 'fevereiro', 'março', 'maio', 'junho', 'julho', 'setembro', 'outubro', 'novembro', 'dezembro',
  // nl
  'januari', 'februari', 'maart', 'mei', 'augustus',
  // pl (nominative + genitive)
  'styczeń', 'stycznia', 'luty', 'lutego', 'marzec', 'marca', 'kwiecień', 'kwietnia', 'maj', 'maja', 'czerwiec', 'czerwca',
  'lipiec', 'lipca', 'sierpień', 'sierpnia', 'wrzesień', 'września', 'październik', 'października', 'listopad', 'listopada', 'grudzień', 'grudnia',
  // ru (genitive + nominative)
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
  // uk (genitive + nominative)
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
  'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'грудень',
].join('|')
const Y = '(?:19|20)\\d{2}'
const D = '(?:0?[1-9]|[12]\\d|3[01])'
export const FULL_DATE = new RegExp(
  [
    `(?<![\\d.,])${D}\\.?\\s+(?:de\\s+)?(?:${MONTH})\\s+(?:de\\s+)?${Y}(?:\\s*(?:г\\.|р\\.|року|года))?(?!\\d)`, // 18 May 2026, 18. Mai 2026, 18 de mayo de 2026, 18 мая 2026 г.
    `(?<![\\p{L}])(?:${MONTH})\\s+${D},?\\s+${Y}(?!\\d)`, // May 18, 2026
    `(?<![\\d.,-])${Y}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])(?![\\d-])`, // 2026-05-18 (ISO)
    `${Y}\\s?年\\s?(?:1[0-2]|0?[1-9])\\s?月\\s?${D}\\s?日`, // 2026年5月18日 (ja/zh)
    `${Y}\\s?年\\s?(?:1[0-2]|0?[1-9])\\s?月(?!\\s?\\d)`, // 2026年5月 — month + year (owner 2026-10-08); "May 2026" etc. already pass via STUDY_YEAR
  ].join('|'),
  'giu',
)

// Regulatory designations used as proper names (owner decision 2026-10-08): "510(k)", clearance/approval numbers
// (K231368, DEN…, P…), Federal Register citations ("91 FR 20352") and document numbers ("2026-07366"),
// CFR sections ("21 CFR 890.5870"), dockets ("FDA-2020-N-1053"). Product codes (LOF, NGX) have no digits.
export const REG_DESIGNATION = new RegExp(
  [
    '510\\s?\\(k\\)',
    '\\b(?:K|DEN|P)\\d{6}(?:\\/S\\d{3})?\\b',
    '\\b\\d{1,3}\\s?FR\\s?\\d{3,6}\\b',
    '\\b\\d{1,2}\\s?CFR\\s?(?:§\\s?)?\\d{1,4}(?:\\.\\d{1,5})?\\b',
    '\\bFDA-(?:19|20)\\d{2}-[A-Z]-\\d{4}\\b',
    '(?<![\\d.,-])(?:19|20)\\d{2}-\\d{5}(?![\\d-])', // Federal Register document number
  ].join('|'),
  'g',
)

/** Remove every allowed body label (designations, full dates, years) — whatever digits remain must fail. */
export function stripBodyDigitExceptions(text: string): string {
  return text.replace(REG_DESIGNATION, ' ').replace(FULL_DATE, ' ').replace(STUDY_YEAR, ' ')
}
