/**
 * Site-structure audit over the built site (dist/). Read-only; writes
 * .cache/structure-audit.md. Checks what a crawler would see:
 *   broken internal links · links through redirects · orphan / deep pages ·
 *   sitemap vs pages · hreflang reciprocity + lang attr · canonical/noindex ·
 *   duplicate titles/descriptions · missing/multiple H1.
 *   node scripts/audit-structure.mjs
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const DIST = 'dist'
const SITE = 'https://onda-life.com'
const out = []
const say = (s = '') => out.push(s)

// ── pages ──
const pages = new Map() // path -> html
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) {
      if (['assets', '_content', 'images', 'fonts'].includes(f) && dir === DIST) continue
      walk(p)
    } else if (f === 'index.html') {
      const rel = '/' + p.slice(DIST.length + 1).replace(/\\/g, '/').replace(/\/?index\.html$/, '')
      pages.set(rel === '/' ? '/' : rel.replace(/\/$/, ''), readFileSync(p, 'utf-8'))
    }
  }
}
walk(DIST)

// ── redirects (vercel.json) ──
const vercel = JSON.parse(readFileSync('vercel.json', 'utf-8'))
const redirectRes = (vercel.redirects ?? []).filter((r) => !r.has).map((r) => {
  const re = '^' + r.source.replace(/:(\w+)\(([^)]+)\)/g, '($2)').replace(/:(\w+)\*/g, '(.*)').replace(/:(\w+)/g, '([^/]+)') + '/?$'
  return new RegExp(re)
})
const isRedirect = (p) => redirectRes.some((re) => re.test(p))

const norm = (href) => {
  let h = href.split('#')[0].split('?')[0]
  if (h.startsWith(SITE)) h = h.slice(SITE.length) || '/'
  if (!h.startsWith('/')) return null
  if (h !== '/' && h.endsWith('/')) h = h.slice(0, -1)
  if (/\.[a-z0-9]{2,5}$/i.test(h)) return null // files
  if (h.startsWith('/api') || h.startsWith('/_content')) return null
  return h
}
const bodyOf = (html) => html.split('<div id="root">')[1] ?? ''

// ── links graph ──
const inbound = new Map([...pages.keys()].map((p) => [p, 0]))
const broken = new Map()
const viaRedirect = new Map()
const graph = new Map()
for (const [p, html] of pages) {
  const targets = new Set()
  for (const m of bodyOf(html).matchAll(/href="([^"]+)"/g)) {
    const t = norm(m[1])
    if (!t || t === p) continue
    targets.add(t)
  }
  graph.set(p, targets)
  for (const t of targets) {
    if (pages.has(t)) inbound.set(t, inbound.get(t) + 1)
    else if (isRedirect(t)) viaRedirect.set(t, [...(viaRedirect.get(t) ?? []), p])
    else broken.set(t, [...(broken.get(t) ?? []), p])
  }
}

// ── depth from home (BFS over body links) ──
// Seeds: every language's root/library; edges: body links + hreflang alternates
// (the language switcher is buttons, crawlers follow hreflang + sitemap).
const seeds = ['/', ...[...pages.keys()].filter((p) => /^\/[a-z]{2}(\/articles)?$/.test(p))]
const depth = new Map(seeds.map((s) => [s, 0]))
const q = [...seeds]
const hrefl = (p) => [...(pages.get(p).split('</head>')[0].matchAll(/hreflang="[^"]+"\s+href="([^"]+)"/g))].map((m) => norm(m[1])).filter(Boolean)
while (q.length) {
  const p = q.shift()
  for (const t of [...(graph.get(p) ?? []), ...hrefl(p)]) if (pages.has(t) && !depth.has(t)) { depth.set(t, depth.get(p) + 1); q.push(t) }
}

// ── head meta per page ──
const meta = new Map()
for (const [p, html] of pages) {
  const head = html.split('</head>')[0]
  const title = head.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  const desc = head.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? ''
  const canonical = head.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1] ?? ''
  const robots = head.match(/<meta\s+name="robots"\s+content="([^"]*)"/)?.[1] ?? ''
  const lang = html.match(/<html\s+lang="([^"]*)"/)?.[1] ?? ''
  const hreflang = [...head.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)].map((m) => [m[1], m[2]])
  const h1 = (bodyOf(html).match(/<h1[\s>]/g) ?? []).length
  meta.set(p, { title, desc, canonical, robots, lang, hreflang, h1 })
}
const noindex = (p) => /noindex/.test(meta.get(p).robots)

// ── sitemap ──
const sitemapUrls = new Set()
for (const f of readdirSync(DIST).filter((f) => /^sitemap.*\.xml$/.test(f))) {
  for (const m of readFileSync(join(DIST, f), 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const t = norm(m[1])
    if (t) sitemapUrls.add(t)
  }
}

// ── report ──
const list = (m, n = 25) => [...m.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, n).map(([t, from]) => `  - \`${t}\` ← ${from.length} page(s), e.g. \`${from[0]}\``)
say(`# Structure audit — ${pages.size} pages`)
say()
say(`## Broken internal links: ${broken.size} targets`)
out.push(...list(broken))
say()
say(`## Links that go through a redirect: ${viaRedirect.size} targets`)
out.push(...list(viaRedirect, 15))
say()
const indexable = [...pages.keys()].filter((p) => !noindex(p))
const orphans = indexable.filter((p) => p !== '/' && inbound.get(p) === 0)
say(`## Orphans (indexable, no inbound body links): ${orphans.length}`)
for (const p of orphans.slice(0, 60)) say(`  - \`${p}\`${sitemapUrls.has(p) ? ' (in sitemap)' : ''}`)
say()
const unreachable = indexable.filter((p) => !depth.has(p))
const deep = indexable.filter((p) => (depth.get(p) ?? 0) > 4)
say(`## Not reachable from home by links: ${unreachable.length} · deeper than 4 clicks: ${deep.length}`)
const byPrefix = (arr) => {
  const m = new Map()
  for (const p of arr) { const k = p.split('/').slice(0, p.match(/^\/[a-z]{2}\//) ? 3 : 2).join('/') || '/'; m.set(k, (m.get(k) ?? 0) + 1) }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, n]) => `${k}:${n}`).join('  ')
}
say(`  unreachable by section: ${byPrefix(unreachable)}`)
say(`  deep by section: ${byPrefix(deep)}`)
say()
const inSitemapNoPage = [...sitemapUrls].filter((u) => !pages.has(u))
const pageNotInSitemap = indexable.filter((p) => !sitemapUrls.has(p))
const noindexInSitemap = [...sitemapUrls].filter((u) => pages.has(u) && noindex(u))
say(`## Sitemap: ${sitemapUrls.size} URLs · in sitemap but no page: ${inSitemapNoPage.length} · indexable page missing from sitemap: ${pageNotInSitemap.length} · noindex page in sitemap: ${noindexInSitemap.length}`)
for (const u of inSitemapNoPage.slice(0, 15)) say(`  - no page: \`${u}\``)
say(`  missing by section: ${byPrefix(pageNotInSitemap)}`)
for (const u of pageNotInSitemap.slice(0, 20)) say(`  - not in sitemap: \`${u}\``)
say()
// hreflang
let hlMissingTarget = 0, hlNonReciprocal = 0, hlNoSelf = 0, langMismatch = 0
const hlSamples = []
for (const [p, m] of meta) {
  if (!m.hreflang.length) continue
  const self = m.hreflang.find(([, h]) => norm(h) === p)
  if (!self) { hlNoSelf++; if (hlSamples.length < 8) hlSamples.push(`no self-reference: \`${p}\``) }
  for (const [code, href] of m.hreflang) {
    const t = norm(href)
    if (code === 'x-default') continue
    if (!pages.has(t)) { hlMissingTarget++; if (hlSamples.length < 16) hlSamples.push(`\`${p}\` → ${code} \`${t}\` does not exist`); continue }
    if (t !== p && !meta.get(t).hreflang.some(([, h]) => norm(h) === p)) { hlNonReciprocal++; if (hlSamples.length < 24) hlSamples.push(`\`${t}\` does not point back to \`${p}\``) }
  }
  const expected = p.match(/^\/([a-z]{2})(\/|$)/)?.[1] ?? 'en'
  if (m.lang && m.lang !== expected) { langMismatch++; if (hlSamples.length < 30) hlSamples.push(`\`${p}\` has <html lang="${m.lang}">`) }
}
say(`## hreflang / lang: missing targets ${hlMissingTarget} · non-reciprocal ${hlNonReciprocal} · no self-reference ${hlNoSelf} · <html lang> ≠ URL ${langMismatch}`)
for (const s of hlSamples) say(`  - ${s}`)
say()
// canonical
const badCanon = []
for (const [p, m] of meta) {
  const c = norm(m.canonical || '')
  if (!m.canonical) badCanon.push(`\`${p}\` has no canonical`)
  else if (c !== p && !noindex(p)) badCanon.push(`\`${p}\` → canonical \`${c}\`${pages.has(c) ? '' : ' (not a page!)'}`)
}
say(`## Canonical: ${badCanon.length} pages not self-canonical / missing`)
for (const s of badCanon.slice(0, 25)) say(`  - ${s}`)
say()
// duplicates
const dup = (key) => {
  const m = new Map()
  for (const [p, v] of meta) if (!noindex(p) && v[key]) m.set(v[key], [...(m.get(v[key]) ?? []), p])
  return [...m.entries()].filter(([, ps]) => ps.length > 1).sort((a, b) => b[1].length - a[1].length)
}
const dt = dup('title'), dd = dup('desc')
say(`## Duplicate titles: ${dt.length} groups · duplicate descriptions: ${dd.length} groups`)
for (const [t, ps] of dt.slice(0, 40)) say(`  - title ×${ps.length} "${t.slice(0, 70)}" e.g. ${ps.slice(0, 3).map((x) => '`' + x + '`').join(', ')}`)
for (const [t, ps] of dd.slice(0, 8)) say(`  - desc ×${ps.length} "${t.slice(0, 70)}" e.g. ${ps.slice(0, 3).map((x) => '`' + x + '`').join(', ')}`)
say()
const noH1 = [...meta].filter(([p, m]) => !noindex(p) && m.h1 === 0).map(([p]) => p)
const multiH1 = [...meta].filter(([p, m]) => !noindex(p) && m.h1 > 1).map(([p]) => p)
say(`## H1: missing on ${noH1.length} pages · multiple on ${multiH1.length}`)
say(`  missing by section: ${byPrefix(noH1)}`)
for (const p of noH1.slice(0, 10)) say(`  - no h1: \`${p}\``)
for (const p of multiH1.slice(0, 10)) say(`  - several h1: \`${p}\``)

mkdirSync('.cache', { recursive: true })
writeFileSync(join('.cache', 'structure-audit.md'), out.join('\n'))
console.log(out.filter((l) => l.startsWith('#')).join('\n'))
