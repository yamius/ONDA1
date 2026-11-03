/**
 * Task 108 — build step: fetch onda-psych pages and register their new PMID/DOI in the same build.
 * Mistral pages are bot-merged (v3), so new ids never reach data/citation-registry.json by hand; without this the
 * strict fetch skipped every page with a new id (2026-11-03: all psych pages 404).
 * 1. fetch-psych --include-unregistered  2. check-citations --refresh (PubMed/Crossref, writes the registry on disk)
 * 3. if refresh/check fails (network, a wrong-paper id) — strict fetch-psych again: pages whose ids did resolve are
 *    published, the rest are skipped with a warning; the build itself never breaks on psych citations.
 * The refreshed registry is not committed by the build; run `npm run citations:refresh` locally to persist it.
 */
import { spawnSync } from 'node:child_process'

const run = (args: string[]) => spawnSync('npx', ['tsx', ...args], { stdio: 'inherit', shell: true }).status === 0

if (!run(['scripts/fetch-psych.ts', '--include-unregistered'])) process.exit(1)
if (!run(['scripts/check-citations.ts', '--refresh'])) {
  console.warn('[psych-citations] WARNING: citation refresh/check failed — re-fetching psych pages strictly (unresolved pages skipped)')
  if (!run(['scripts/fetch-psych.ts'])) process.exit(1)
}
