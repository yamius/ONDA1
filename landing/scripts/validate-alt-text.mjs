#!/usr/bin/env node
/**
 * Image alt-text coverage audit.
 *
 *   1. Walks every .tsx in src/, finds <img> and <OptimizedImage>, checks
 *      that an alt prop exists and isn't a literal empty string (unless
 *      paired with aria-hidden="true" — decorative).
 *   2. Walks every article + glossary TS data file, ensures imageAlt is set
 *      whenever image is set.
 *
 * Emits dist/seo-audit/alt-coverage.json and exits 1 if any violations.
 *
 * Usage:
 *   tsx scripts/validate-alt-text.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const auditDir = join(distDir, 'seo-audit')

function walk(dir, exts) {
  const out = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, exts))
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full)
  }
  return out
}

const violations = []

// ---- 1. .tsx files ----
const tsxFiles = walk(join(projectRoot, 'src'), ['.tsx'])
for (const f of tsxFiles) {
  const rawSrc = readFileSync(f, 'utf-8')
  const rel = relative(projectRoot, f).replace(/\\/g, '/')
  // Strip JS comments (// line, /* block */, JSDoc) before scanning so we
  // don't false-positive on `<img>` mentions in docs.
  const src = rawSrc
    .replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length))
  // Find every JSX <img …> and <OptimizedImage …> opening tag (multi-line aware).
  const tagRe = /<(img|OptimizedImage)\b([^>]*?)\/?>/gs
  let m
  while ((m = tagRe.exec(src)) !== null) {
    const tag = m[1]
    const attrs = m[2]
    const altMatch = attrs.match(/\balt\s*=\s*(?:\{([^}]*)\}|"([^"]*)"|'([^']*)')/s)
    const ariaHidden = /\baria-hidden\s*=\s*\{?\s*["']?true["']?\s*\}?/.test(attrs)
    if (!altMatch) {
      // Permitted: spread of rest props (e.g. `<img {...imgProps} />`) — alt
      // is forwarded by parent. Skip when a spread is present.
      if (/\{\s*\.\.\.[A-Za-z_$][\w$]*\s*\}/.test(attrs)) continue
      violations.push({ file: rel, tag, issue: 'no alt prop', line: src.slice(0, m.index).split('\n').length })
      continue
    }
    const altRaw = (altMatch[1] || altMatch[2] || altMatch[3] || '').trim()
    // Empty alt allowed only with aria-hidden
    const isEmptyLiteral = altMatch[2] !== undefined && !altRaw
    const isEmptyExpr = altMatch[1] !== undefined && /^["'`]\s*["'`]$/.test(altRaw)
    if ((isEmptyLiteral || isEmptyExpr) && !ariaHidden) {
      violations.push({
        file: rel,
        tag,
        issue: 'empty alt without aria-hidden — decorative images need aria-hidden="true"',
        line: src.slice(0, m.index).split('\n').length,
      })
    }
  }
}

// ---- 2. Article data files ----
const articlesDir = join(projectRoot, 'src', 'data', 'articles')
const articleFiles = readdirSync(articlesDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')
for (const f of articleFiles) {
  const src = readFileSync(join(articlesDir, f), 'utf-8')
  const hasImage = /\bimage:\s*['"]/i.test(src)
  const hasAlt = /\bimageAlt:\s*['"]/i.test(src)
  if (hasImage && !hasAlt) {
    violations.push({ file: `src/data/articles/${f}`, tag: 'article-data', issue: 'image without imageAlt' })
  }
}

// ---- 3. Glossary terms ----
const glossarySrc = readFileSync(join(projectRoot, 'src', 'data', 'glossary.ts'), 'utf-8')
const termRe = /\{\s*slug:\s*['"]([^'"]+)['"]([\s\S]*?)\n\s*\},?\s*\n/g
let tm
while ((tm = termRe.exec(glossarySrc)) !== null) {
  const slug = tm[1]
  const body = tm[2]
  const hasImage = /\bimage:\s*['"]/.test(body)
  const hasAlt = /\bimageAlt:\s*['"]/.test(body)
  if (hasImage && !hasAlt) {
    violations.push({ file: `src/data/glossary.ts:${slug}`, tag: 'glossary-data', issue: 'image without imageAlt' })
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  tsxFilesScanned: tsxFiles.length,
  articleFilesScanned: articleFiles.length,
  violationCount: violations.length,
  violations,
}

if (existsSync(distDir)) {
  mkdirSync(auditDir, { recursive: true })
  writeFileSync(join(auditDir, 'alt-coverage.json'), JSON.stringify(summary, null, 2))
}

console.log(`[validate-alt-text] ${tsxFiles.length} tsx + ${articleFiles.length} articles, ${violations.length} violation(s)`)
if (violations.length) {
  for (const v of violations.slice(0, 30)) {
    console.error(`  ${v.file}${v.line ? `:${v.line}` : ''} <${v.tag}>: ${v.issue}`)
  }
  if (violations.length > 30) console.error(`  … ${violations.length - 30} more`)
  process.exit(1)
}
