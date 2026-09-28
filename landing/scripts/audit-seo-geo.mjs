/**
 * SEO + GEO audit over the built site (dist/). Read-only; report in
 * .cache/seo-geo-audit.md. Groups pages by type and reports per-type coverage.
 *   node scripts/audit-seo-geo.mjs
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const DIST = 'dist'
const pages = []
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) {
      if (dir === DIST && ['assets', '_content', 'images', 'fonts', 'decks', 'embed'].includes(f)) continue
      walk(p)
    } else if (f === 'index.html') {
      const rel = '/' + p.slice(DIST.length + 1).replace(/\\/g, '/').replace(/\/?index\.html$/, '')
      pages.push({ path: rel === '/' ? '/' : rel.replace(/\/$/, ''), html: readFileSync(p, 'utf-8') })
    }
  }
}
walk(DIST)

const typeOf = (p) => {
  const b = p.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/'
  if (b === '/') return 'home'
  if (/^\/articles\/topic\//.test(b)) return 'library-hub'
  if (/^\/articles\/./.test(b)) return 'article'
  if (b === '/articles') return 'library'
  if (/^\/glossary\/./.test(b)) return 'glossary-term'
  if (/^\/reviews\/vs\//.test(b)) return 'h2h'
  if (/^\/reviews\/compare\//.test(b)) return 'comparison'
  if (/^\/reviews\/./.test(b)) return 'review-or-category'
  if (/^\/tools\/./.test(b)) return 'tool'
  if (/^\/(level|part|bio)\//.test(b)) return 'path/bio'
  if (/^\/topics\//.test(b)) return 'topic-pillar'
  return 'other'
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
const words = (s) => (s.match(/[\p{L}\p{N}]+/gu) ?? []).length
// CJK has no spaces: count chars/2 as "words"
const wordCount = (s, lang) => (['zh', 'ja'].includes(lang) ? Math.round((s.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu) ?? []).length / 2) + words(s.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, ' ')) : words(s))

const rows = []
for (const { path, html } of pages) {
  const head = html.split('</head>')[0]
  const body = html.split('<div id="root">')[1] ?? ''
  const lang = html.match(/<html\s+lang="([^"]*)"/)?.[1] ?? 'en'
  const robots = head.match(/<meta\s+name="robots"\s+content="([^"]*)"/)?.[1] ?? ''
  if (/noindex/.test(robots)) continue
  const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
  const desc = decode(head.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '')
  const ld = [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try {
      const d = JSON.parse(m[1])
      const list = Array.isArray(d) ? d : d['@graph'] ?? [d]
      return list
    } catch {
      return [{ '@type': 'INVALID' }]
    }
  })
  const types = new Set(ld.flatMap((d) => [].concat(d['@type'] ?? [])))
  const deep = JSON.stringify(ld)
  const main = body.match(/<main[\s\S]*?<\/main>/)?.[0] ?? body
  const bodyText = text(main)
  const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  const noAlt = imgs.filter((i) => !/\balt="[^"]+"/.test(i)).length
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length
  const h2 = [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => text(m[1]))
  const qHeadings = [...body.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => text(m[1])).filter((t) => /[?？]$/.test(t)).length
  // first real paragraph of the main content (answer-first check)
  const firstP = text((main.match(/<p[^>]*>([\s\S]*?)<\/p>/) ?? [])[1] ?? '')
  const extLinks = [...main.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]).filter((u) => !u.includes('onda-life.com'))
  const sciLinks = extLinks.filter((u) => /pubmed|ncbi|doi\.org|nature\.com|frontiersin|sciencedirect|springer|wiley|jamanetwork|bmj|thelancet|nih\.gov|plos|mdpi|oup\.com|sagepub|tandfonline|cell\.com|ahajournals|biorxiv|medrxiv|who\.int|cdc\.gov/.test(u)).length
  rows.push({
    path, type: typeOf(path), lang, title, desc,
    og: /property="og:title"/.test(head) && /property="og:image"/.test(head),
    tw: /name="twitter:card"/.test(head),
    types, hasAuthor: /"author"/.test(deep), hasDateMod: /"dateModified"/.test(deep), hasDatePub: /"datePublished"/.test(deep),
    faq: types.has('FAQPage'), invalidLd: types.has('INVALID'),
    words: wordCount(bodyText, lang), noAlt, imgs: imgs.length, h1, h2: h2.length, qHeadings,
    firstPWords: wordCount(firstP, lang), sciLinks, extLinks: extLinks.length,
    kb: Math.round(html.length / 1024),
  })
}

const out = []
const say = (s = '') => out.push(s)
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '—')
const byType = new Map()
for (const r of rows) byType.set(r.type, [...(byType.get(r.type) ?? []), r])

say(`# SEO + GEO audit — ${rows.length} indexable pages`)
say()
say('## Per page type')
say()
say('| type | pages | median words | thin (<300) | FAQPage | author | dateModified | sci links (median) | Q-headings (pages ≥1) | answer-first ¶ 25–90 words | top JSON-LD |')
say('|---|---|---|---|---|---|---|---|---|---|---|')
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0 }
for (const [t, rs] of [...byType].sort((a, b) => b[1].length - a[1].length)) {
  const tc = new Map()
  for (const r of rs) for (const x of r.types) tc.set(x, (tc.get(x) ?? 0) + 1)
  const top = [...tc].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `${k} ${pct(n, rs.length)}`).join(', ')
  say(`| ${t} | ${rs.length} | ${med(rs.map((r) => r.words))} | ${rs.filter((r) => r.words < 300).length} | ${pct(rs.filter((r) => r.faq).length, rs.length)} | ${pct(rs.filter((r) => r.hasAuthor).length, rs.length)} | ${pct(rs.filter((r) => r.hasDateMod).length, rs.length)} | ${med(rs.map((r) => r.sciLinks))} | ${pct(rs.filter((r) => r.qHeadings > 0).length, rs.length)} | ${pct(rs.filter((r) => r.firstPWords >= 25 && r.firstPWords <= 90).length, rs.length)} | ${top} |`)
}
say()
const tooLongT = rows.filter((r) => r.title.length > 65), tooShortT = rows.filter((r) => r.title.length < 25)
const noDesc = rows.filter((r) => !r.desc), longD = rows.filter((r) => r.desc.length > 165), shortD = rows.filter((r) => r.desc && r.desc.length < 70)
say(`## Titles & descriptions`)
say(`- title > 65 chars: ${tooLongT.length} · < 25 chars: ${tooShortT.length}`)
for (const r of tooShortT.slice(0, 12)) say(`  - short title "${r.title}" \`${r.path}\``)
say(`- description missing: ${noDesc.length} · > 165: ${longD.length} · < 70: ${shortD.length}`)
for (const r of [...noDesc, ...shortD].slice(0, 12)) say(`  - desc "${r.desc}" \`${r.path}\``)
say()
say(`## Headings, images, social`)
say(`- H1 missing: ${rows.filter((r) => r.h1 === 0).length} · multiple: ${rows.filter((r) => r.h1 > 1).length}`)
say(`- images without alt: ${rows.reduce((a, r) => a + r.noAlt, 0)} on ${rows.filter((r) => r.noAlt).length} pages`)
for (const r of rows.filter((r) => r.noAlt).slice(0, 8)) say(`  - \`${r.path}\` ${r.noAlt}/${r.imgs}`)
say(`- missing og:title/og:image: ${rows.filter((r) => !r.og).length} · missing twitter:card: ${rows.filter((r) => !r.tw).length}`)
say(`- invalid JSON-LD blocks: ${rows.filter((r) => r.invalidLd).length}`)
say()
say('## Thin pages (< 300 words), by type')
for (const [t, rs] of byType) {
  const thin = rs.filter((r) => r.words < 300)
  if (thin.length) say(`- ${t}: ${thin.length} — e.g. ${thin.slice(0, 4).map((r) => `\`${r.path}\` (${r.words})`).join(', ')}`)
}
say()
say('## Articles without scientific citations (GEO: citable sources)')
const arts = rows.filter((r) => r.type === 'article' && r.lang === 'en')
const noSci = arts.filter((r) => r.sciLinks === 0)
say(`- EN articles: ${arts.length} · with ≥1 study link: ${arts.length - noSci.length} · none: ${noSci.length}`)
for (const r of noSci.slice(0, 25)) say(`  - \`${r.path}\` (${r.words} words, ${r.extLinks} external links)`)
say()
say('## Heavy HTML (> 400 KB)')
for (const r of rows.filter((r) => r.kb > 400).sort((a, b) => b.kb - a.kb).slice(0, 10)) say(`- \`${r.path}\` ${r.kb} KB`)
mkdirSync('.cache', { recursive: true })
writeFileSync(join('.cache', 'seo-geo-audit.md'), out.join('\n'))
console.log(out.join('\n').slice(0, 9000))
