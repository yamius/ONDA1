#!/bin/bash
# Vercel "Ignored Build Step" for the onda-chatgpt project (root: chatgpt-app/).
# Exit 0 = SKIP the build, exit 1 = BUILD. Every unclear case builds.
# Skips only when nothing under chatgpt-app/ changed since the last successful deployment.
PREV="$VERCEL_GIT_PREVIOUS_SHA"
CUR="$VERCEL_GIT_COMMIT_SHA"
if [ -z "$PREV" ] || [ -z "$CUR" ] || [ "$PREV" = "$CUR" ]; then echo "build: no previous SHA or redeploy"; exit 1; fi
git cat-file -e "$PREV^{commit}" 2>/dev/null || { echo "build: previous SHA not available"; exit 1; }
if git diff --quiet "$PREV" "$CUR" -- .; then echo "skip: no changes under chatgpt-app/ since $PREV"; exit 0; fi
echo "build: chatgpt-app/ changed"; exit 1
