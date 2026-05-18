/**
 * Build-time guard: fail the build if the eager client entry chunk grows past
 * a hard gzip budget. The entry was reduced from 1.28 MB to ~107 KB by the
 * lazy-i18n work; this check stops a future change from silently undoing it
 * (e.g. a static import of a heavy data module landing back in the entry).
 *
 * Runs after `vite build`, before prerender. Tune ENTRY_BUDGET_KB only with a
 * deliberate decision — a rising number should be a conscious trade-off.
 */
import { readFileSync } from 'fs'
import { gzipSync } from 'zlib'
import { join } from 'path'

const DIST = 'dist'
const ENTRY_BUDGET_KB = 150

const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')
const match = indexHtml.match(/src="(\/assets\/index-[^"]+\.js)"/)
if (!match) {
  console.error('[budget] FAIL — could not locate the entry chunk in dist/index.html')
  process.exit(1)
}

const entryRel = match[1]
const gzipBytes = gzipSync(readFileSync(join(DIST, entryRel))).length
const kb = gzipBytes / 1024

console.log(`[budget] entry chunk ${entryRel} — ${kb.toFixed(1)} KB gzip (budget ${ENTRY_BUDGET_KB} KB)`)
if (kb > ENTRY_BUDGET_KB) {
  console.error(
    `[budget] FAIL — entry chunk is ${kb.toFixed(1)} KB gzip, over the ${ENTRY_BUDGET_KB} KB budget.\n` +
      '[budget] A heavy module is likely being statically imported into the eager path.\n' +
      '[budget] Lazy-load it, or raise ENTRY_BUDGET_KB deliberately if the growth is justified.',
  )
  process.exit(1)
}
console.log('[budget] OK')
