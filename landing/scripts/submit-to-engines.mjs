#!/usr/bin/env node
/**
 * Stage 13 — direct URL submission to search engines.
 *
 * Drives two channels in one pass:
 *
 *   1. Bing Webmaster URL Submission API
 *      Requires BING_WEBMASTER_API_KEY + BING_WEBMASTER_SITE_URL env.
 *      Bing also powers Microsoft Copilot and large parts of OpenAI's
 *      search; submitting here is the highest-leverage manual signal
 *      we can send.
 *
 *   2. IndexNow ping (Bing/Yandex/Seznam/Naver)
 *      Already implemented in scripts/indexnow.ts and run by
 *      prerender.ts. This script re-invokes it so a single CI step
 *      covers both channels.
 *
 * Inputs:
 *   - dist/sitemap.xml      → URL universe.
 *   - SUBMIT_URLS env       → optional comma-separated overrides
 *                             (skips sitemap parsing).
 *   - SUBMIT_LIMIT env      → cap per run (default: 1000 — the Bing
 *                             daily quota is 10000).
 *   - DRY_RUN=1             → print the planned submissions and exit.
 */
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const sitemapPath = join(projectRoot, 'dist', 'sitemap.xml')

const LIMIT = Number(process.env.SUBMIT_LIMIT ?? 1000)
const DRY = process.env.DRY_RUN === '1'

function readUrls() {
  if (process.env.SUBMIT_URLS) {
    return process.env.SUBMIT_URLS.split(',').map((s) => s.trim()).filter(Boolean)
  }
  if (!existsSync(sitemapPath)) {
    console.error('[submit-to-engines] sitemap.xml missing — run vite build + prerender first')
    process.exit(2)
  }
  const xml = readFileSync(sitemapPath, 'utf-8')
  const urls = []
  const re = /<loc>([^<]+)<\/loc>/g
  let m
  while ((m = re.exec(xml)) !== null) urls.push(m[1])
  return urls
}

async function bingSubmit(urls) {
  const key = process.env.BING_WEBMASTER_API_KEY
  const site = process.env.BING_WEBMASTER_SITE_URL
  if (!key || !site) {
    console.warn('[submit-to-engines] Bing skipped — set BING_WEBMASTER_API_KEY + BING_WEBMASTER_SITE_URL')
    return { ok: false, skipped: true }
  }
  const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${encodeURIComponent(key)}`
  const body = { siteUrl: site, urlList: urls }
  if (DRY) {
    console.log(`[submit-to-engines] DRY_RUN — would POST ${urls.length} URLs to Bing (${endpoint})`)
    return { ok: true, dry: true, count: urls.length }
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Bing submit failed: HTTP ${res.status} ${text.slice(0, 200)}`)
  }
  console.log(`[submit-to-engines] Bing accepted ${urls.length} URLs`)
  return { ok: true, count: urls.length }
}

function indexNow() {
  if (DRY) {
    console.log('[submit-to-engines] DRY_RUN — would invoke scripts/indexnow.ts')
    return { ok: true, dry: true }
  }
  try {
    execSync('tsx scripts/indexnow.ts', { cwd: projectRoot, stdio: 'inherit' })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err?.message ?? err) }
  }
}

async function main() {
  const all = readUrls()
  const urls = all.slice(0, LIMIT)
  console.log(`[submit-to-engines] sitemap=${all.length} urls, submitting=${urls.length} (limit=${LIMIT})`)

  const bingResult = await bingSubmit(urls).catch((e) => ({ ok: false, error: String(e) }))
  const indexResult = indexNow()

  const report = {
    timestamp: new Date().toISOString(),
    submitted: urls.length,
    bing: bingResult,
    indexNow: indexResult,
  }
  console.log('[submit-to-engines] result:', JSON.stringify(report, null, 2))

  if (!bingResult.ok && !bingResult.skipped) process.exit(1)
}

main().catch((err) => {
  console.error('[submit-to-engines] FATAL', err)
  process.exit(1)
})
