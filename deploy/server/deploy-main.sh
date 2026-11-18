#!/usr/bin/env bash
# Release the site's own code (home page, admin, shared parts) from garage-omsk-v2.
# Usage (from the owner's machine):
#   tar czf - --exclude=node_modules --exclude=.next --exclude=data -C website . | ssh root@server /opt/garage-deploy/deploy-main.sh
# The pages currently published from garageseo (seo-current) are kept on top.
set -euo pipefail

BASE=/opt/garage-deploy
SEO_DIRS=("content" "src/app/(seo)" "src/components/seo" "src/lib/seo" "public/seo")

IN=$(mktemp -d /tmp/garage-main.XXXXXX)
STAGE=$(mktemp -d /tmp/garage-stage.XXXXXX)
trap 'rm -rf "$IN" "$STAGE"' EXIT

tar xzf - -C "$IN" --no-same-owner
[ -f "$IN/package.json" ] || { echo "no package.json in the upload"; exit 1; }
rm -rf "$IN/node_modules" "$IN/.next" "$IN/data" "$IN/public/uploads" "$IN"/.env*

cp -a "$IN/." "$STAGE/"
if [ -d "$BASE/seo-current" ]; then
  for d in "${SEO_DIRS[@]}"; do
    rm -rf "$STAGE/$d"
    [ -d "$BASE/seo-current/$d" ] && mkdir -p "$(dirname "$STAGE/$d")" && cp -a "$BASE/seo-current/$d" "$STAGE/$d"
  done
fi

"$BASE/build-and-swap.sh" "$STAGE"

rm -rf "$BASE/main-src.new" && cp -a "$IN" "$BASE/main-src.new"
rm -rf "$BASE/main-src" && mv "$BASE/main-src.new" "$BASE/main-src"
if [ ! -d "$BASE/seo-current" ]; then
  mkdir -p "$BASE/seo-current"
  for d in "${SEO_DIRS[@]}"; do
    [ -d "$STAGE/$d" ] && mkdir -p "$(dirname "$BASE/seo-current/$d")" && cp -a "$STAGE/$d" "$BASE/seo-current/$d"
  done
fi
