# Contributing to ONDA Life

> Rules for anyone (human or AI agent) making changes to this repo.
> See [`landing/docs/roadmap.md`](landing/docs/roadmap.md) for the engineering plan.

## Why these rules exist

In April–May 2026 a Replit Agent shipped 19 mixed commits in a single
"10-Hour Optimization Marathon" session. Quality was uneven, scope was
tangled, and reviewing piece-by-piece was impossible — so the work was
rolled back to commit `f7ae5e0` and is being rebuilt properly. The rules
below are what we wish had been followed the first time.

The Replit work is preserved (tag `replit-marathon-archive`, branch
`claude/romantic-joliot-9f0302`) for diff-reference and cherry-picking.

## The three rules

### 1. PR diff ≤ ~500 lines

If a change touches more than ~500 lines, split it. Reviewers — including
your future self — cannot meaningfully audit a thousand-line diff.

- One concern per PR. Don't bundle "fix bug X" with "refactor unrelated
  module Y" or "add new feature Z".
- If a refactor is needed to enable a feature, ship the refactor first as
  its own PR, then build the feature on top.
- Generated files (lockfiles, image manifests, prerendered HTML) don't
  count toward the line limit, but explain in the PR body why they
  changed.

### 2. Build-test before every commit

```bash
cd landing && npm run build
```

Must finish green. No "I'll fix the failing test in the next commit."
A red main is a blocker for everyone else.

- For UI changes, also run the dev server and click through the affected
  flow in a browser. Type checks ≠ feature checks.
- For SEO / prerender changes, inspect at least one rendered HTML file
  in `dist/` to verify the change actually landed where you expected.
- If the build is slow, use the quiet variant during iteration:
  ```bash
  INDEXNOW_DISABLED=1 NODE_OPTIONS='--max-old-space-size=4096' \
    npx vite build && \
    SEO_AUDIT_LABEL=dev INDEXNOW_DISABLED=1 npx tsx scripts/prerender.ts
  ```

### 3. YMYL caution (Your-Money-Your-Life)

ONDA Life publishes biohacking and neuroscience content. Google and the
major AI evaluators classify health and medical content as YMYL — held
to a higher trust standard than ordinary content. Every change should
pass these filters:

- **Author is a real person with credentials.** No anonymous articles,
  no LLM-only authorship without human attribution.
- **Sources are real and checkable.** Link to PubMed / DOI / official
  guidelines, not blog posts. Footnote claims that aren't common
  knowledge.
- **Translations get sample human review.** LLM-translated medical
  content at scale is a Google "scaled content abuse" trigger. If we
  can't review at least a sample, we don't ship the locale.
- **Publishing pace looks human.** Use the `publishedAt` scheduler
  (`scripts/schedule-articles.mjs`) to drip-publish at ≤ 1 article per
  several days, not bursts of dozens at once.
- **Disclose AI assistance honestly.** A note like "drafted with AI
  assistance, reviewed by [name]" in the article footer is fine. Hiding
  it is not.

## Push policy

- **Translation / content batches** — push to `main` allowed after build
  passes, no PR required.
- **Infrastructure changes** (`scripts/`, `pages/`, build pipeline,
  `vite.config.ts`, dependencies) — feature branch + PR + explicit
  owner OK before merge.
- **Force-push to `main`** — only with explicit per-instance
  authorization from the owner. Never automated.
- **Never `--no-verify`** to skip pre-commit hooks. If a hook fails,
  fix the underlying issue.

## Commit message style

Conventional Commits:

```
feat(landing): add responsive image ladder for article hero
fix(prerender): handle apostrophes in localized descriptions
perf(landing): lazy-load articles-meta on /articles route only
docs: update roadmap Phase 1 acceptance criteria
chore: bump sharp to 0.33.5
```

Scope is optional but encouraged. The body should explain *why*, not
*what* — the diff already shows what.

## When working as / with an AI agent

- The agent reads `CONTRIBUTING.md` and `landing/docs/roadmap.md` first,
  before touching code.
- The agent shows the diff and waits for owner OK before merging
  infrastructure changes to `main`.
- The agent does not extend scope without asking. "While I'm in here
  I also fixed X" is a smell — that's how Replit shipped 19 mixed
  commits.
