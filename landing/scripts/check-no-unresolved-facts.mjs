/**
 * Build guard: no {{fact:…}} placeholder may reach the published site.
 * Facts are resolved in the data modules (articles, FAQs, glossary), in the chunk generator and in the
 * prerender (locale files); this scan catches any path that was missed. Exit 1 lists the files.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIST = join(process.cwd(), 'dist')
// Rendered output only: JS bundles may carry raw data resolved at runtime (topic-hub FAQ translations via
// hubFaqFor) and the resolver's own error messages; the prerendered HTML of those pages is scanned instead.
const EXT = /\.(html|json|txt|xml|md)$/
const hits = []
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (EXT.test(f)) {
      const s = readFileSync(p, 'utf8')
      const i = s.indexOf('{{fact:')
      if (i >= 0) hits.push(`${relative(DIST, p)}: …${s.slice(i, i + 60)}…`)
    }
  }
}
walk(DIST)
if (hits.length) {
  console.error(`[facts] ${hits.length} file(s) in dist contain an unresolved {{fact:…}}:\n  ` + hits.slice(0, 30).join('\n  '))
  process.exit(1)
}
console.log('[facts] OK — no unresolved {{fact:…}} in dist')
