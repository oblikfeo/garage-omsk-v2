#!/usr/bin/env bash
# Publish pages from the garageseo repository.
# Called by its GitHub Action over SSH (forced command); a tar.gz of the
# repository's website/ folders arrives on stdin. Only these folders are taken:
#   content/  src/app/(seo)/  src/components/seo/  public/seo/
# Everything else comes from the site's own code in /opt/garage-deploy/main-src.
set -euo pipefail

BASE=/opt/garage-deploy
SEO_DIRS=("content" "src/app/(seo)" "src/components/seo" "public/seo")

IN=$(mktemp -d /tmp/garageseo.XXXXXX)
STAGE=$(mktemp -d /tmp/garage-stage.XXXXXX)
trap 'rm -rf "$IN" "$STAGE"' EXIT

tar xzf - -C "$IN" --no-same-owner
SRC="$IN/website"
[ -d "$SRC/content" ] || { echo "no website/content in the upload"; exit 1; }

# site code + the pages from garageseo
cp -a "$BASE/main-src/." "$STAGE/"
for d in "${SEO_DIRS[@]}"; do
  rm -rf "$STAGE/$d"
  [ -d "$SRC/$d" ] && mkdir -p "$(dirname "$STAGE/$d")" && cp -a "$SRC/$d" "$STAGE/$d"
done

"$BASE/build-and-swap.sh" "$STAGE"

# remember what is live, so that site-code releases keep these pages
rm -rf "$BASE/seo-current.new" && mkdir -p "$BASE/seo-current.new"
for d in "${SEO_DIRS[@]}"; do
  [ -d "$STAGE/$d" ] && mkdir -p "$(dirname "$BASE/seo-current.new/$d")" && cp -a "$STAGE/$d" "$BASE/seo-current.new/$d"
done
rm -rf "$BASE/seo-current" && mv "$BASE/seo-current.new" "$BASE/seo-current"
