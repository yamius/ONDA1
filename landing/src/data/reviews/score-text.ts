/**
 * Review scores in prose (task 089). Text never hand-types a score: it writes
 *   {{score:<review-slug>}}              → computed overall score, e.g. "7.9"
 *   {{score:<review-slug>.<criterion>}}  → one criterion score, e.g. "8.5"
 * followed by the visible scale ("/10", "分", …). The number is formatted per locale
 * (decimal comma in de/es/fr/it/nl/pl/pt/ru/uk; "10" stays "10").
 *   {{literal:…}} is the explicit escape for a number that only LOOKS like a score
 * (a maker's power level "5 of 10", a methodology cap "max 7.5"); it renders its text.
 * Resolved at build time together with {{fact:}} (resolveFacts in science/facts.ts) once
 * all-reviews.ts has registered the computed scores. scripts/check-review-scores.ts fails
 * the build on hand-typed scores (HAND_SCORE_RES) in any review/duel/round-up text.
 */
export type ScoreLookup = (slug: string, criterionId?: string) => number | undefined

let lookup: ScoreLookup | null = null
export function registerScoreLookup(fn: ScoreLookup): void {
  lookup = fn
}

const COMMA_LANGS = new Set(['de', 'es', 'fr', 'it', 'nl', 'pl', 'pt', 'ru', 'uk'])
export function formatScore(n: number, lang = 'en'): string {
  const s = n === 10 ? '10' : n.toFixed(1)
  return COMMA_LANGS.has(lang) ? s.replace('.', ',') : s
}

export const SCORE_TOKEN_RE = /\{\{score:([a-z0-9-]+)(?:\.([a-z0-9-]+))?\}\}/g
const LITERAL_RE = /\{\{literal:([^{}]*)\}\}/g

/** Every {{score:…}} token in a value (deep), sorted — used to compare a translation with EN. */
export function scoreTokens(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(...(v.match(SCORE_TOKEN_RE) ?? []))
  else if (Array.isArray(v)) v.forEach((x) => scoreTokens(x, out))
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => scoreTokens(x, out))
  return out.sort()
}

export function resolveScoreText(text: string, where = 'text', lang = 'en'): string {
  if (!text || text.indexOf('{{') < 0) return text
  return text
    .replace(SCORE_TOKEN_RE, (m, slug: string, crit?: string) => {
      if (!lookup) throw new Error(`[scores] ${m} in ${where}: review scores not registered (import src/data/reviews/all-reviews first)`)
      const n = lookup(slug, crit)
      if (n === undefined) throw new Error(`[scores] unknown review/criterion ${m} in ${where}`)
      return formatScore(n, lang)
    })
    .replace(LITERAL_RE, (_m, t: string) => t)
}

/** Deep variant; returns the same object when nothing changed. */
export function resolveScoresDeep<T>(value: T, where: string, lang = 'en'): T {
  if (typeof value === 'string') return resolveScoreText(value, where, lang) as unknown as T
  if (Array.isArray(value)) {
    const out = value.map((v, i) => resolveScoresDeep(v, `${where}[${i}]`, lang))
    return (out.some((v, i) => v !== value[i]) ? out : value) as unknown as T
  }
  if (value && typeof value === 'object') {
    let changed = false
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = resolveScoresDeep(v, `${where}.${k}`, lang)
      if (out[k] !== v) changed = true
    }
    return (changed ? out : value) as T
  }
  return value
}

// ── hand-typed score patterns (EN + localized forms, decimal point or comma) ──
/** Latin/Cyrillic letter: "G7 de 10" is a model name, but CJK text glues the number to a kana/hanzi. */
const LTR = String.raw`A-Za-zÀ-ɏЀ-ӿ`
const N = String.raw`(10|\d[.,]\d|\d)(?![.,]?\d)`
const NOT_UNIT = String.raw`(?!位|[-–]?\s?(?:week|HP|day|min|hour|Tag|día|jour|giorn|dni|дн|нед|周|日))`
export const HAND_SCORE_RES: { re: RegExp; langs?: string[] }[] = [
  { re: new RegExp(String.raw`(?<![${LTR}\d.,–-])${N}\s*/\s*10(?!\d)`, 'gu') },
  { re: new RegExp(String.raw`(?<![${LTR}\d.,–-])${N}\s+(?:out of|из|з|von|de|sur|su|na|op|van|em|di)\s+10(?![\d.,])`, 'giu') },
  {
    re: new RegExp(
      String.raw`(?<![${LTR}])(?:scor(?:es|ed|ing|e of|e)|rated|nota|rating of|оценк\p{L}*|оцінк\p{L}*|Bewertung(?: von)?|puntuaci[oó]n(?: de)?|note de|punteggio(?: di)?|pontua[cç][aã]o(?: de)?|ocen\p{L}*(?: na)?|スコア|評価|评分|得分)[\s：]*${N}${NOT_UNIT}`,
      'giu',
    ),
  },
  { re: new RegExp(String.raw`(?<![\d.,])([1-9][.,]\d|10)\s*分(?![钟鐘])`, 'gu'), langs: ['zh'] },
  // "7.0, the base score for …" / "— 7.0, the score for …" (086: a hand-typed rule score the patterns above missed)
  { re: new RegExp(String.raw`(?<![${LTR}\d.,–-])${N},?\s+(?:is\s+)?the\s+(?:base\s+|ceiling\s+|maximum\s+|max\s+)?score(?![a-z])`, 'giu'), langs: ['en'] },
  { re: new RegExp(String.raw`(?<![\d.,])([1-9][.,]\d|10)\s*点`, 'gu'), langs: ['ja'] },
]

export interface HandScore { start: number; end: number; text: string; value: number; numStart: number; numText: string }
/** Hand-typed scores in a string (placeholders and {{literal:}} spans are skipped). Overlapping matches merged. */
export function findHandTypedScores(s: string, lang = 'en'): HandScore[] {
  const masked = s.replace(SCORE_TOKEN_RE, (m) => '§'.repeat(m.length)).replace(LITERAL_RE, (m) => '§'.repeat(m.length))
  const hits: HandScore[] = []
  for (const { re, langs } of HAND_SCORE_RES) {
    if (langs && !langs.includes(lang)) continue
    re.lastIndex = 0
    for (let m; (m = re.exec(masked)); ) hits.push({ start: m.index, end: m.index + m[0].length, text: m[0], value: Number(m[1].replace(',', '.')), numStart: m.index + m[0].indexOf(m[1]), numText: m[1] })
  }
  hits.sort((a, b) => a.start - b.start)
  const out: HandScore[] = []
  for (const h of hits) {
    const last = out[out.length - 1]
    if (last && h.start < last.end) {
      if (h.end > last.end) { last.end = h.end; last.text = s.slice(last.start, h.end) }
    } else out.push({ ...h })
  }
  return out
}
