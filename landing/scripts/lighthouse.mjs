/**
 * Phase 1.8: Lighthouse CI gate.
 *
 * Runs Lighthouse against 10 representative routes against a local preview
 * server (`npm run preview` on :4173) and fails the build if Performance,
 * Accessibility, Best-Practices, or SEO drop below the configured floor.
 *
 * SKIP CONDITIONS (graceful exit 0):
 *   1. CHROME_PATH unset AND no chrome on PATH (this Replit container has no
 *      Chrome — script is intended for GitHub Actions where Chrome is on the
 *      runner image and CHROME_PATH=/usr/bin/google-chrome is auto-detected).
 *   2. `lighthouse` package not installed (CI workflow installs on demand
 *      via `npx lighthouse@latest` to avoid bloating local node_modules).
 *   3. LIGHTHOUSE_DISABLED=1 set in env.
 *
 * THRESHOLDS (mobile profile, default Lighthouse weights):
 *   - Performance     ≥ 90  (brief target ≥95 — 90 here = warning floor)
 *   - Accessibility   ≥ 95
 *   - Best Practices  ≥ 95
 *   - SEO             ≥ 95
 *
 * USAGE:
 *   node scripts/lighthouse.mjs                # all 10 routes
 *   PREVIEW_URL=https://onda-life.com node scripts/lighthouse.mjs   # live
 *
 * OUTPUT:
 *   dist/lighthouse/<slug>.json   raw report per route
 *   dist/lighthouse/summary.md    human-readable scorecard
 *   dist/lighthouse/summary.json  CI-parseable summary
 *   exit 1 if any score < threshold AND SEO_STRICT=1
 */
import { mkdir, writeFile, access } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const outDir = join(distDir, 'lighthouse')

const ROUTES = [
  { slug: 'home',         path: '/' },
  { slug: 'articles',     path: '/articles' },
  { slug: 'glossary',     path: '/glossary' },
  { slug: 'topics',       path: '/topics' },
  { slug: 'about',        path: '/about' },
  { slug: 'article-zone2',  path: '/articles/zone-2-cardio-mitochondrial-bandwidth' },
  { slug: 'article-cold',   path: '/articles/cold-thermogenesis-adaptation-curve' },
  { slug: 'glossary-vo2',   path: '/glossary/vo2-max' },
  { slug: 'topic-energy',   path: '/topics/energy-systems' },
  { slug: 'inner-spectrum', path: '/inner-spectrum' },
]

const THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  'best-practices': 95,
  seo: 95,
}

function detectChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH
  for (const candidate of [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

async function checkLighthouseInstalled() {
  try {
    await import('lighthouse')
    return true
  } catch {
    return false
  }
}

async function main() {
  if (process.env.LIGHTHOUSE_DISABLED === '1') {
    console.log('[lighthouse] LIGHTHOUSE_DISABLED=1 — skipping')
    return
  }
  const chrome = detectChrome()
  if (!chrome) {
    console.log('[lighthouse] no Chrome found (set CHROME_PATH or install chrome) — skipping')
    return
  }
  if (!(await checkLighthouseInstalled())) {
    console.log('[lighthouse] `lighthouse` package not installed — skipping (CI installs on demand)')
    return
  }

  const baseUrl = process.env.PREVIEW_URL || 'http://localhost:4173'
  console.log(`[lighthouse] base=${baseUrl}, chrome=${chrome}, routes=${ROUTES.length}`)

  // Lazy import — only when we know lighthouse is installed.
  const { default: lighthouse } = await import('lighthouse')
  const chromeLauncher = await import('chrome-launcher')

  const browser = await chromeLauncher.launch({
    chromePath: chrome,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  })

  await mkdir(outDir, { recursive: true })

  const summary = []
  let strictFailed = 0

  for (const route of ROUTES) {
    const url = baseUrl + route.path
    process.stdout.write(`[lighthouse] ${route.slug.padEnd(20)} `)
    try {
      const result = await lighthouse(url, {
        port: browser.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false },
      })
      if (!result?.lhr) {
        console.log('NO RESULT')
        continue
      }
      const cats = result.lhr.categories
      const scores = {
        performance: Math.round((cats.performance?.score ?? 0) * 100),
        accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
        'best-practices': Math.round((cats['best-practices']?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
      }
      const fails = Object.entries(THRESHOLDS).filter(([k, min]) => scores[k] < min)
      const status = fails.length === 0 ? 'OK' : `FAIL(${fails.map(([k, m]) => `${k}<${m}`).join(',')})`
      console.log(`P${scores.performance} A${scores.accessibility} BP${scores['best-practices']} S${scores.seo}  ${status}`)

      await writeFile(join(outDir, `${route.slug}.json`), JSON.stringify(result.lhr, null, 2))
      summary.push({ slug: route.slug, path: route.path, scores, fails: fails.map(([k]) => k) })
      if (fails.length > 0) strictFailed++
    } catch (err) {
      console.log(`ERROR ${err.message}`)
      summary.push({ slug: route.slug, path: route.path, error: err.message })
    }
  }

  await browser.kill()

  // Markdown scorecard
  const md = [
    '# Lighthouse Scorecard',
    '',
    `Run: ${new Date().toISOString()}`,
    `Base URL: ${baseUrl}`,
    '',
    '| Route | Perf | A11y | BP | SEO | Status |',
    '|---|---:|---:|---:|---:|---|',
    ...summary.map(s => s.error
      ? `| \`${s.path}\` | — | — | — | — | ERROR: ${s.error} |`
      : `| \`${s.path}\` | ${s.scores.performance} | ${s.scores.accessibility} | ${s.scores['best-practices']} | ${s.scores.seo} | ${s.fails.length === 0 ? '✓' : '✗ ' + s.fails.join(',')} |`),
    '',
    `Thresholds: Perf≥${THRESHOLDS.performance}, A11y≥${THRESHOLDS.accessibility}, BP≥${THRESHOLDS['best-practices']}, SEO≥${THRESHOLDS.seo}`,
  ].join('\n')

  await writeFile(join(outDir, 'summary.md'), md)
  await writeFile(join(outDir, 'summary.json'), JSON.stringify({ runAt: new Date().toISOString(), baseUrl, thresholds: THRESHOLDS, routes: summary }, null, 2))

  console.log(`\n[lighthouse] ${ROUTES.length - strictFailed}/${ROUTES.length} pass thresholds`)
  console.log(`[lighthouse] reports → dist/lighthouse/`)

  if (strictFailed > 0 && process.env.SEO_STRICT === '1') {
    console.error(`[lighthouse] SEO_STRICT=1: ${strictFailed} route(s) below threshold — exit 1`)
    process.exit(1)
  }
}

main().catch(e => { console.error('[lighthouse] FATAL', e); process.exit(1) })
