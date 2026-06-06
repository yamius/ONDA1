// Best-effort: capture the short commit SHA at build start so prerender can
// stamp the build beacon even where in-process `git rev-parse` later fails
// (e.g. some Replit build envs). Never throws — if git is unavailable the
// file is simply not written and prerender falls back to env var → 'unknown'.
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

try {
  const sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim()
  if (sha) {
    writeFileSync('.build-sha', sha)
    console.log(`[write-build-sha] ${sha}`)
  }
} catch {
  // git unavailable in this env — silently skip; beacon falls back gracefully.
}
