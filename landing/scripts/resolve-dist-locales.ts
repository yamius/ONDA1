/**
 * Resolve {{fact:…}} in the locale files Vite copied to dist/locales/<lang>/*.json (served as-is to the
 * browser for on-demand namespaces). Sources in public/locales keep their placeholders.
 * Runs right after `vite build`. Missing translation / unknown or unapproved fact → build error.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { resolveFactsDeep, type FactLang } from '../src/data/science/facts'

const DIR = join(process.cwd(), 'dist', 'locales')
let changed = 0
for (const lang of readdirSync(DIR)) {
  const ld = join(DIR, lang)
  if (!statSync(ld).isDirectory()) continue
  for (const f of readdirSync(ld)) {
    if (!f.endsWith('.json')) continue
    const p = join(ld, f)
    const raw = readFileSync(p, 'utf8')
    if (!raw.includes('{{fact:')) continue
    writeFileSync(p, JSON.stringify(resolveFactsDeep(JSON.parse(raw), `dist/locales/${lang}/${f}`, lang as FactLang)))
    changed++
  }
}
console.log(`[facts] resolved placeholders in ${changed} dist locale file(s)`)
