/**
 * Helper for translators of ONDA Science (content/science-i18n/<lang>/<kind>/<slug>.md).
 *   npx tsx scripts/science-translation-helper.ts <lang> facts          — every fact used on science pages, in <lang>
 *   npx tsx scripts/science-translation-helper.ts <lang> hash <kind/slug> — the sourceHash to put in the translation
 *   npx tsx scripts/science-translation-helper.ts <lang> check          — structure check of all <lang> translations
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { factText, type FactLang } from '../src/data/science/facts'

const [lang, cmd, arg] = process.argv.slice(2)
const hash = (t: string) => createHash('sha1').update(t.replace(/\r\n/g, '\n')).digest('hex').slice(0, 12)
const pages: string[] = []
for (const k of readdirSync('content/science')) for (const f of readdirSync(join('content/science', k))) if (f.endsWith('.md')) pages.push(`${k}/${f.slice(0, -3)}`)

if (cmd === 'facts') {
  const ids = new Set<string>()
  for (const p of pages) for (const m of readFileSync(`content/science/${p}.md`, 'utf8').matchAll(/\{\{fact:([^}|]+)(\|short)?\}\}/g)) ids.add(m[1] + (m[2] ?? ''))
  for (const x of [...ids].sort()) {
    const [id, sh] = x.split('|')
    console.log(`{{fact:${x}}}  →  ${factText(id, lang as FactLang, (sh ? 'short' : 'full') as never, 'helper')}`)
  }
} else if (cmd === 'hash') {
  console.log(hash(readFileSync(`content/science/${arg}.md`, 'utf8')))
} else if (cmd === 'check') {
  let bad = 0
  for (const p of pages) {
    const tf = `content/science-i18n/${lang}/${p}.md`
    if (!existsSync(tf)) { console.log(`MISSING ${tf}`); bad++; continue }
    const en = matter(readFileSync(`content/science/${p}.md`, 'utf8'))
    const t = matter(readFileSync(tf, 'utf8'))
    const errs: string[] = []
    if (t.data.sourceHash !== hash(readFileSync(`content/science/${p}.md`, 'utf8'))) errs.push('sourceHash does not match the EN file')
    for (const f of ['title', 'metaTitle', 'metaDescription', 'shortAnswer', 'imageAlt']) if (!t.data[f]) errs.push(`missing ${f}`)
    if ((t.data.keyPoints ?? []).length !== (en.data.keyPoints ?? []).length) errs.push('keyPoints count differs')
    if ((t.data.evidenceMap ?? []).length !== (en.data.evidenceMap ?? []).length) errs.push(`evidenceMap rows ${(t.data.evidenceMap ?? []).length} ≠ EN ${(en.data.evidenceMap ?? []).length}`)
    const facts = (s: string) => [...s.matchAll(/\{\{fact:[^}]+\}\}/g)].map((m) => m[0]).sort().join(' ')
    if (facts(t.content) !== facts(en.content)) errs.push('the body does not use the same {{fact:…}} placeholders as EN')
    const cites = (s: string) => [...new Set([...s.matchAll(/S\d+/g)].map((m) => m[0]))].sort().join(' ')
    if (cites(t.content) !== cites(en.content)) errs.push(`citations differ: EN [${cites(en.content)}] vs [${cites(t.content)}]`)
    const links = (s: string) => [...s.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]).sort().join(' ')
    if (links(t.content) !== links(en.content)) errs.push('internal links differ from EN (keep every link and its EN path)')
    const h2 = (s: string) => (s.match(/^## /gm) ?? []).length
    if (h2(t.content) !== h2(en.content)) errs.push('number of ## sections differs')
    const stray = t.content.replace(/\{\{fact:[^}]+\}\}/g, '').replace(/\[S\d+(?:,\s*S\d+)*\]/g, '').replace(/\]\([^)]*\)/g, ']').replace(/et al\.,? \d{4}/g, '').replace(/\b\d+\.\d+\.\d+\b/g, '').match(/[^\n]{0,25}\d[^\n]{0,25}/g)
    if (stray) errs.push(`digits outside facts: ${stray.slice(0, 3).map((x) => `“${x.trim()}”`).join(', ')}`)
    if (errs.length) { bad++; console.log(`${tf}:\n  - ${errs.join('\n  - ')}`) }
  }
  console.log(bad ? `[science-i18n] ${bad} file(s) with problems` : `[science-i18n] ${lang}: OK — ${pages.length} page(s)`)
}
