/** Run from landing/.
 * Writes docs/science-pack/03-facts.md from src/data/science/facts.ts so the
 * pack can never disagree with the facts module.
 *   npx tsx scripts/science-pack-facts.ts          # regenerate
 *   npx tsx scripts/science-pack-facts.ts --check  # exit 1 if the doc is stale
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { FACTS } from '../src/data/science/facts'

const OUT = join(process.cwd(), 'docs', 'science-pack', '03-facts.md')
const cell = (s: string) => s.replace(/\|/g, '\|').replace(/\n/g, ' ')
const src = (f: (typeof FACTS)[string]) =>
  f.sources.map((s) => s.doi ? `${s.label} — DOI ${s.doi}` : s.pmid ? `${s.label} — PMID ${s.pmid}` : `${s.label} — ${s.url}`).join('; ')

const all = Object.values(FACTS)
const group = (pred: (id: string) => boolean) => all.filter((f) => pred(f.id))
const isTable = (id: string) => /^(hrv\.(rmssd|sdnn)|rhr\.(male|female))\.(median|typical)\./.test(id)

function table(rows: typeof all): string {
  return ['| id | Inserted text | Scope | Status | Sources |', '|---|---|---|---|---|',
    ...rows.map((f) => `| \`${f.id}\` | ${cell(f.display)} | ${cell(f.scope)} | ${f.status} | ${cell(src(f))} |`)].join('\n')
}

const doc = `# 3. Approved facts

> Generated from \`src/data/science/facts.ts\` by \`npx tsx scripts/science-pack-facts.ts\`. Do not edit by hand.

**Every number in a science page comes from a \`{{fact:<id>}}\` reference.** A number typed by hand fails the check. Use only facts with status \`approved\`. A \`proposed\` fact waits for Yakiv and cannot be used.

Need a value that is missing? Write \`{{fact:NEW: what you need}}\` in the draft and list it in the hand-off note (see [08-handoff-checklist.md](08-handoff-checklist.md)) with value, scope and a DOI/PMID. Claude Code adds it here after Yakiv approves.

## Hand-written facts

${table(group((id) => !isTable(id)))}

## Table facts (generated from hrv-norms.ts and resting-hr.ts)

Ids follow \`<metric>.<median|typical>.<age>\` with ages written \`18-29\`, \`30-39\` … \`70plus\`. \`typical\` is the 25th–75th percentile.

${table(group(isTable))}
`

if (process.argv.includes('--check')) {
  const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : ''
  if (cur !== doc) { console.error('[science-pack] 03-facts.md is stale — run npx tsx scripts/science-pack-facts.ts'); process.exit(1) }
  console.log('[science-pack] 03-facts.md up to date')
} else {
  writeFileSync(OUT, doc)
  console.log(`[science-pack] wrote ${all.length} facts`)
}
