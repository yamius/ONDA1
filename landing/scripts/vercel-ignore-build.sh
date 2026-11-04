#!/bin/bash
# Vercel "Ignored Build Step" for the landing project (root: landing/).
# Exit 0 = SKIP the build, exit 1 = BUILD. Every unclear case builds.
# Skips only when nothing under landing/ (outside landing/docs/) changed since the last successful deployment
# (e.g. a push that only touches chatgpt-app/), so MCP-only pushes don't queue a 15-min site build.
PREV="$VERCEL_GIT_PREVIOUS_SHA"
CUR="$VERCEL_GIT_COMMIT_SHA"
# No previous deployment known, or same commit (redeploy / daily deploy hook) -> build.
if [ -z "$PREV" ] || [ -z "$CUR" ] || [ "$PREV" = "$CUR" ]; then echo "build: no previous SHA or redeploy"; exit 1; fi
# Daily scheduled rebuild (deploy hook at 04:15 UTC, .github/workflows/landing-scheduled-rebuild.yml) -> always build in the 04:00 UTC hour.
if [ "$(date -u +%H)" = "04" ]; then echo "build: scheduled-rebuild hour"; exit 1; fi
# Previous SHA not in the (shallow) clone -> can't compare -> build.
# Vercel clones only the last ~10 commits: the previous deployment is often older, so fetch just that commit
# (depth 1 is enough for a tree diff) before giving up. Without this every unrelated push rebuilt this project.
if ! git cat-file -e "$PREV^{commit}" 2>/dev/null; then
  git fetch -q --depth=1 origin "$PREV" 2>/dev/null ||     { [ -n "$VERCEL_GIT_REPO_OWNER" ] && git fetch -q --depth=1 "https://github.com/$VERCEL_GIT_REPO_OWNER/$VERCEL_GIT_REPO_SLUG.git" "$PREV" 2>/dev/null; }
fi
git cat-file -e "$PREV^{commit}" 2>/dev/null || { echo "build: previous SHA not available"; exit 1; }
# landing/docs/** is documentation only (not read by the build).
if git diff --quiet "$PREV" "$CUR" -- . ":(exclude)docs"; then echo "skip: no build-relevant changes under landing/ (docs/ ignored) since $PREV"; exit 0; fi
echo "build: landing/ changed"; exit 1
