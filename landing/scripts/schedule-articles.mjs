#!/usr/bin/env node
/**
 * schedule-articles.mjs — Auto-publishing CLI for landing/.
 *
 * Subcommands:
 *   list                       Show every article with its publishedAt status.
 *   list --pending             Only future-scheduled articles.
 *   list --published           Only already-public articles.
 *   set <slug> <iso>           Set publishedAt for the given slug.
 *   clear <slug>               Remove publishedAt (=> publish immediately).
 *   check                      Exit 1 if any scheduled article would publish in the next 24h
 *                              without the daily cron firing — useful in CI sanity checks.
 *
 * The CLI mutates `landing/src/data/articles/<slug>.ts` in place by injecting
 * or replacing a top-level `publishedAt:` field on the exported article
 * object. It uses string-level edits (not the TS compiler) so the diff stays
 * minimal and reviewable.
 *
 * Exit codes: 0 success, 1 logical failure, 2 invalid usage.
 *
 * Examples:
 *   node scripts/schedule-articles.mjs list
 *   node scripts/schedule-articles.mjs set vagus-nerve 2026-01-15T08:00:00Z
 *   node scripts/schedule-articles.mjs clear vagus-nerve
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = join(__dirname, '..', 'src', 'data', 'articles')

function listArticleFiles() {
  return readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')
    .map((f) => join(ARTICLES_DIR, f))
}

/** Best-effort regex parse of the article module — pulls slug + publishedAt
 *  without spinning up the TS compiler. The article files all follow the
 *  shape `slug: '...'` and (optionally) `publishedAt: '...'`. */
function parseArticleFile(path) {
  const src = readFileSync(path, 'utf8')
  const slugMatch = src.match(/slug:\s*['"]([^'"]+)['"]/)
  const pubMatch = src.match(/publishedAt:\s*['"]([^'"]+)['"]/)
  return {
    path,
    slug: slugMatch ? slugMatch[1] : null,
    publishedAt: pubMatch ? pubMatch[1] : null,
    src,
  }
}

function loadAll() {
  return listArticleFiles()
    .map(parseArticleFile)
    .filter((a) => a.slug)
}

function fmtRow(a, now) {
  const pub = a.publishedAt ?? '-'
  let status = 'live'
  if (a.publishedAt) {
    const t = Date.parse(a.publishedAt)
    if (!Number.isNaN(t)) status = t <= now ? 'live' : 'scheduled'
  }
  return `${status.padEnd(10)} ${a.slug.padEnd(60)} ${pub}`
}

function cmdList(args) {
  const onlyPending = args.includes('--pending')
  const onlyPublished = args.includes('--published')
  const now = Date.now()
  const all = loadAll().sort((a, b) => a.slug.localeCompare(b.slug))
  const filtered = all.filter((a) => {
    const t = a.publishedAt ? Date.parse(a.publishedAt) : NaN
    const isFuture = !Number.isNaN(t) && t > now
    if (onlyPending) return isFuture
    if (onlyPublished) return !isFuture
    return true
  })
  console.log(`status     slug                                                         publishedAt`)
  for (const a of filtered) console.log(fmtRow(a, now))
  console.log(`\n${filtered.length}/${all.length} articles`)
}

function findFileBySlug(slug) {
  const all = loadAll()
  const hit = all.find((a) => a.slug === slug)
  if (!hit) {
    console.error(`No article with slug "${slug}". Run \`list\` to see options.`)
    process.exit(1)
  }
  return hit
}

function validateIso(iso) {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) {
    console.error(`Invalid ISO 8601 timestamp: "${iso}". Try e.g. 2026-01-15T08:00:00Z`)
    process.exit(2)
  }
  return new Date(t).toISOString()
}

/** Inject/replace a `publishedAt: '<iso>'` field as the LAST property on the
 *  top-level exported article object. Picks a deterministic insertion point
 *  (just before the closing brace of the first article object literal) so
 *  diffs are minimal.
 *
 *  Caveat: this is a regex + brace-counting transform, not an AST rewrite.
 *  It assumes the article files follow the conventional shape (single
 *  top-level `const article: Article = { ... }` or `export default { ... }`,
 *  with no `}` characters in unbalanced positions inside string literals
 *  preceding the closing brace). All existing files in src/data/articles/
 *  satisfy this. If you ever introduce a top-level template literal that
 *  contains an unmatched `}`, switch this transform to use the TypeScript
 *  compiler API instead. */
function writePublishedAt(file, isoOrNull) {
  const { src, path, publishedAt } = file
  let next = src
  if (publishedAt !== null) {
    next = next.replace(/(\n\s*publishedAt:\s*['"][^'"]+['"],?)/, '')
  }
  if (isoOrNull !== null) {
    // Find the article object literal. Article files follow either
    // `export default { ... }` (single-article export) or
    // `const article: Article = { ... }` followed by `export default [article]`.
    // Try both patterns.
    const m =
      next.match(/const\s+\w+\s*:\s*Article\s*=\s*\{/) ||
      next.match(/export\s+default\s*\{/)
    if (!m) {
      console.error(`Could not locate Article object literal in ${path}`)
      process.exit(1)
    }
    // Walk braces to find matching close.
    let depth = 0
    let i = m.index + m[0].length - 1
    for (; i < next.length; i++) {
      const c = next[i]
      if (c === '{') depth++
      else if (c === '}') {
        depth--
        if (depth === 0) break
      }
    }
    if (i >= next.length) {
      console.error(`Unbalanced braces in ${path}`)
      process.exit(1)
    }
    const before = next.slice(0, i)
    const after = next.slice(i)
    const trimmedBefore = before.replace(/\s*$/, '')
    const needsComma = !trimmedBefore.endsWith(',') && !trimmedBefore.endsWith('{')
    next = `${trimmedBefore}${needsComma ? ',' : ''}\n  publishedAt: '${isoOrNull}',\n${after}`
  }
  writeFileSync(path, next, 'utf8')
}

function cmdSet(args) {
  const [slug, iso] = args
  if (!slug || !iso) {
    console.error('Usage: schedule-articles set <slug> <ISO 8601 timestamp>')
    process.exit(2)
  }
  const normalized = validateIso(iso)
  const file = findFileBySlug(slug)
  writePublishedAt(file, normalized)
  console.log(`set ${slug} -> ${normalized}`)
}

function cmdClear(args) {
  const [slug] = args
  if (!slug) {
    console.error('Usage: schedule-articles clear <slug>')
    process.exit(2)
  }
  const file = findFileBySlug(slug)
  writePublishedAt(file, null)
  console.log(`cleared publishedAt on ${slug} (article will publish immediately)`)
}

/** Sanity: exit 1 if any scheduled article is due in the next 24h. Lets CI
 *  treat this as a guardrail rather than a soft warning — pair with
 *  `|| true` in the workflow when you want the warning behavior instead. */
function cmdCheck() {
  const now = Date.now()
  const horizon = now + 24 * 60 * 60 * 1000
  const due = loadAll().filter((a) => {
    if (!a.publishedAt) return false
    const t = Date.parse(a.publishedAt)
    return !Number.isNaN(t) && t > now && t <= horizon
  })
  if (due.length === 0) {
    console.log('No articles due in the next 24h.')
    return
  }
  console.log(`${due.length} article(s) due in the next 24h:`)
  for (const a of due) console.log(`- ${a.slug} -> ${a.publishedAt}`)
  process.exit(1)
}

const [, , sub, ...rest] = process.argv
switch (sub) {
  case 'list': cmdList(rest); break
  case 'set': cmdSet(rest); break
  case 'clear': cmdClear(rest); break
  case 'check': cmdCheck(); break
  default:
    console.error('Usage: schedule-articles <list|set|clear|check> [...args]')
    process.exit(2)
}
