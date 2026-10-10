#!/bin/bash
# Vercel "Ignored Build Step" for the landing project (root: landing/).
# Exit 0 = SKIP the build, exit 1 = BUILD. Every unclear case builds.
# Skips only when nothing under landing/ changed since the last successful deployment
# (e.g. a push that only touches chatgpt-app/), so MCP-only pushes don't queue a 15-min site build.
PREV="$VERCEL_GIT_PREVIOUS_SHA"
CUR="$VERCEL_GIT_COMMIT_SHA"
# No previous deployment known, or same commit (redeploy / daily deploy hook) -> build.
if [ -z "$PREV" ] || [ -z "$CUR" ] || [ "$PREV" = "$CUR" ]; then echo "build: no previous SHA or redeploy"; exit 1; fi
# Daily scheduled rebuild (deploy hook at 04:15 UTC, .github/workflows/landing-scheduled-rebuild.yml) -> always build in the 04:00 UTC hour.
if [ "$(date -u +%H)" = "04" ]; then echo "build: scheduled-rebuild hour"; exit 1; fi
# Previous SHA not in the (shallow) clone -> can't compare -> build.
git cat-file -e "$PREV^{commit}" 2>/dev/null || { echo "build: previous SHA not available"; exit 1; }
if git diff --quiet "$PREV" "$CUR" -- .; then echo "skip: no changes under landing/ since $PREV"; exit 0; fi
echo "build: landing/ changed"; exit 1
