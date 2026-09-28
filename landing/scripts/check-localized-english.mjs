/**
 * Post-prerender check: English sentences left on LOCALIZED pages (dist/<lang>/…).
 * Catches the whole class "a component renders an EN field instead of the translation"
 * no matter which page or component — plus untranslated content on published pages.
 * Warn-only (a report, not a gate): .cache/localized-english.md
 * Strings that are English on purpose (study titles, brand names) rarely match the
 * heuristic; links to untranslated EN articles do, and are expected.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const DIST = 'dist'
const LANGS = ['es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt']
const EN = /\b(the|your|you|with|what|how|why|and|this|that|are|from|into|than|not|of)\b/gi
const NOT_EN = /\b(der|die|das|und|ist|nicht|mit|dein|deine|een|het|van|niet|les|des|est|pour|una|della|che|para|com|não|jest|nie|się)\b/i
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")

function* pages(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) yield* pages(p)
    else if (f === 'index.html') yield p
  }
}

const perLang = []
const lines = ['# English on localized pages', '']
for (const lang of LANGS) {
  const root = join(DIST, lang)
  if (!existsSync(root)) continue
  const counts = new Map()
  let n = 0
  for (const p of pages(root)) {
    n++
    let body = readFileSync(p, 'utf-8').split('<div id="root">')[1] ?? ''
    body = body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
    for (const m of body.matchAll(/>([^<>]{25,})</g)) {
      const t = decode(m[1]).trim()
      const words = t.match(/[A-Za-z']+/g) ?? []
      if (words.length < 5 || NOT_EN.test(t)) continue
      if (new Set((t.match(EN) ?? []).map((w) => w.toLowerCase())).size < 2) continue
      const letters = [...t].filter((c) => /\p{L}/u.test(c))
      if (!letters.length || letters.filter((c) => c <= 'z').length / letters.length < 0.9) continue
      const key = t.slice(0, 110)
      const e = counts.get(key) ?? { n: 0, where: p.slice(DIST.length + 1).replace(/\\/g, '/').replace(/\/index\.html$/, '') }
      e.n++
      counts.set(key, e)
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1].n - a[1].n)
  perLang.push(`${lang}:${counts.size}`)
  lines.push(`## ${lang} — ${n} pages, ${counts.size} distinct English strings`, '')
  for (const [t, e] of top.slice(0, 60)) lines.push(`- ${e.n}× ${t}  (${e.where})`)
  lines.push('')
}
mkdirSync('.cache', { recursive: true })
writeFileSync(join('.cache', 'localized-english.md'), lines.join('\n'))
console.log(`[localized-english] distinct English strings per language — ${perLang.join('  ')} (details: .cache/localized-english.md)`)
