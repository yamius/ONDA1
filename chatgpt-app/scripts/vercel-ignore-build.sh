#!/bin/bash
# Vercel "Ignored Build Step" for the onda-chatgpt project (root: chatgpt-app/).
# Exit 0 = SKIP the build, exit 1 = BUILD. Every unclear case builds.
# Skips only when nothing under chatgpt-app/ changed since the last successful deployment.
PREV="$VERCEL_GIT_PREVIOUS_SHA"
CUR="$VERCEL_GIT_COMMIT_SHA"
if [ -z "$PREV" ] || [ -z "$CUR" ] || [ "$PREV" = "$CUR" ]; then echo "build: no previous SHA or redeploy"; exit 1; fi
# Vercel clones only the last ~10 commits: the previous deployment is often older, so fetch just that commit
# (depth 1 is enough for a tree diff) before giving up. Without this every unrelated push rebuilt this project.
if ! git cat-file -e "$PREV^{commit}" 2>/dev/null; then
  git fetch -q --depth=1 origin "$PREV" 2>/dev/null ||     { [ -n "$VERCEL_GIT_REPO_OWNER" ] && git fetch -q --depth=1 "https://github.com/$VERCEL_GIT_REPO_OWNER/$VERCEL_GIT_REPO_SLUG.git" "$PREV" 2>/dev/null; }
fi
git cat-file -e "$PREV^{commit}" 2>/dev/null || { echo "build: previous SHA not available"; exit 1; }
if git diff --quiet "$PREV" "$CUR" -- .; then echo "skip: no changes under chatgpt-app/ since $PREV"; exit 0; fi
echo "build: chatgpt-app/ changed"; exit 1
