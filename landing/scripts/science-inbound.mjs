// Counts pages (outside /science) whose main content links to each science page.
// Usage: node scripts/science-inbound.mjs [out.json]   (run after a build; reads dist/)
import fs from 'node:fs'
import path from 'node:path'

const pages = []
;(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (f === 'index.html') pages.push(p)
  }
})('dist')

const count = {}
for (const p of pages) {
  const rel = p.split(path.sep).join('/')
  if (rel.includes('/science/')) continue
  const main = fs.readFileSync(p, 'utf8').split('<footer')[0]
  const seen = new Set()
  for (const m of main.matchAll(/href="(?:\/[a-z]{2})?\/science\/([a-z]+\/[a-z0-9-]+)\/?"/g)) {
    if (!seen.has(m[1])) { seen.add(m[1]); count[m[1]] = (count[m[1]] || 0) + 1 }
  }
}
const sorted = Object.fromEntries(Object.entries(count).sort((a, b) => b[1] - a[1]))
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(sorted, null, 1))
console.log(sorted)
