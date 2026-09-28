/**
 * Rewrites translation files into the canonical shape of src/data/i18n-schema.ts:
 *   - Q&A {question, answer} → {q, a}; empty/broken Q&A items dropped
 *   - non-translatable keys removed (ids, links, flags: protocolId, neuralSuggestion.link, imagePlacement …)
 *   - keyed ids that no longer exist in EN removed (e.g. a comparison whose picks changed)
 * Key order and line endings (CRLF/LF) are preserved, so a diff shows only real changes.
 * Idempotent. Used by the one-off migration and by scripts/i18n-import.ts.
 *
 *   npx tsx scripts/i18n-normalize.ts          # every language
 *   npx tsx scripts/i18n-normalize.ts ru de    # some
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { TRANSLATION_SCHEMA, type FieldSpec, type TranslationCollection } from '../src/data/i18n-schema'
import { enSource } from './lib/i18n-source'

const ALL_LANGS = ['es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt']

function normQA(v: unknown): { q: string; a: string }[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out = v
    .map((x) => ({ q: x?.q ?? x?.question, a: x?.a ?? x?.answer }))
    .filter((x) => typeof x.q === 'string' && x.q.trim() && typeof x.a === 'string' && x.a.trim())
  return out.length ? out : undefined
}
const pickKeys = (o: Record<string, unknown>, keys: readonly string[]) =>
  Object.fromEntries(Object.entries(o).filter(([k]) => keys.includes(k)))

function normField(spec: FieldSpec, v: unknown, en: unknown): unknown {
  switch (spec.kind) {
    case 'qaList':
      return normQA(v)
    case 'indexed':
      return Array.isArray(v) ? v.map((x) => (x && typeof x === 'object' ? pickKeys(x as Record<string, unknown>, spec.keys) : x)) : v
    case 'object':
      return v && typeof v === 'object' ? pickKeys(v as Record<string, unknown>, spec.keys) : v
    case 'keyed': {
      if (!v || typeof v !== 'object' || !en || typeof en !== 'object') return v
      const ids = new Set(Object.keys(en))
      const kept = Object.entries(v as Record<string, unknown>)
        .filter(([k]) => ids.has(k))
        .map(([k, val]) => [k, spec.keys && val && typeof val === 'object' ? pickKeys(val as Record<string, unknown>, spec.keys) : val])
      return Object.fromEntries(kept)
    }
    default:
      return v
  }
}

/** Normalize one entry in place-order; returns the canonical entry. */
export function normalizeEntry(col: TranslationCollection, entry: Record<string, unknown>, en: Record<string, unknown> | undefined) {
  const fields = TRANSLATION_SCHEMA[col].fields as Record<string, FieldSpec>
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(entry)) {
    const spec = fields[k]
    if (!spec) continue // not translatable → EN is the source
    const nv = normField(spec, v, en?.[k])
    if (nv !== undefined) out[k] = nv
  }
  return out
}

/** Normalize every collection in one language's files. Returns number of changed files. */
export function normalizeLang(lang: string): number {
  const byFile = new Map<string, TranslationCollection[]>()
  for (const [col, s] of Object.entries(TRANSLATION_SCHEMA) as [TranslationCollection, { file: string }][]) {
    byFile.set(s.file, [...(byFile.get(s.file) ?? []), col])
  }
  let changed = 0
  for (const [file, cols] of byFile) {
    const p = join('public', 'locales', lang, file)
    let raw: string
    try {
      raw = readFileSync(p, 'utf-8')
    } catch {
      continue
    }
    const data = JSON.parse(raw)
    for (const col of cols) {
      const path = TRANSLATION_SCHEMA[col].path
      const entries = data[path] as Record<string, Record<string, unknown>> | undefined
      if (!entries) continue
      const en = enSource(col)
      for (const slug of Object.keys(entries)) {
        // reviews.bodies also carries partial entries for review cards; same schema applies
        entries[slug] = normalizeEntry(col, entries[slug], en.get(slug))
      }
    }
    let out = JSON.stringify(data, null, 2) + '\n'
    if (raw.includes('\r\n')) out = out.replace(/\n/g, '\r\n')
    if (out !== raw) {
      writeFileSync(p, out)
      changed++
    }
  }
  return changed
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const langs = process.argv.slice(2).length ? process.argv.slice(2) : ALL_LANGS
  let n = 0
  for (const l of langs) n += normalizeLang(l)
  console.log(`[i18n-normalize] ${n} file(s) rewritten to the canonical schema`)
}
