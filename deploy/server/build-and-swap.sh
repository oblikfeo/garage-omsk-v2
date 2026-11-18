#!/usr/bin/env bash
# Build a prepared source tree and swap it in as the live site.
# Usage: build-and-swap.sh <stage-dir>
# Same order as every manual release: build in a separate directory, carry over
# the admin data (data/, public/uploads/) at the last moment, swap, roll back if
# the new version does not answer.
set -euo pipefail

STAGE="$1"
LIVE=/var/www/garage
NEW=/var/www/garage-new
BACKUPS=/root/backups

exec 9>/var/lock/garage-deploy.lock
flock -w 1200 9 || { echo "another deploy is still running"; exit 1; }

echo "== prepare $NEW"
rm -rf "$NEW"
cp -a "$STAGE" "$NEW"
chmod 755 "$NEW"
cp -a "$LIVE/node_modules" "$NEW/node_modules"
cp -a "$LIVE"/.env.production "$NEW/" 2>/dev/null || true
mkdir -p "$NEW/data" "$NEW/public/uploads"
cp -a "$LIVE/data/." "$NEW/data/"
chown -R www-data:www-data "$NEW"

if ! cmp -s "$LIVE/package-lock.json" "$NEW/package-lock.json"; then
  echo "== package-lock changed: npm ci"
  (cd "$NEW" && sudo -u www-data env HOME="$NEW" npm ci --no-audit --no-fund 2>&1 | tail -3)
fi

echo "== build"
if ! (cd "$NEW" && sudo -u www-data env HOME="$NEW" npm run build > "$NEW/build.log" 2>&1); then
  echo "BUILD FAILED — the live site was not changed. Last lines:"
  grep -v "^\s*$" "$NEW/build.log" | tail -40
  exit 1
fi
grep -E "✓ Compiled|Generating static pages" "$NEW/build.log" | tail -2

echo "== swap"
TS=$(date +%Y%m%d-%H%M%S)
tar czf "$BACKUPS/garage-admin-data-$TS.tgz" -C "$LIVE" data public/uploads
systemctl stop garage
rm -rf "$NEW/data" "$NEW/public/uploads"
cp -a "$LIVE/data" "$NEW/data"
cp -a "$LIVE/public/uploads" "$NEW/public/uploads"
mv "$LIVE" "/var/www/garage-prev-$TS"
mv "$NEW" "$LIVE"
systemctl start garage

ok=0
for i in $(seq 1 40); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/)" = 200 ] && { ok=1; break; }
  sleep 1
done
if [ "$ok" != 1 ] || [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/admin/login)" != 200 ]; then
  echo "NEW VERSION DID NOT START — rolling back"
  systemctl stop garage
  mv "$LIVE" "/var/www/garage-failed-$TS"
  mv "/var/www/garage-prev-$TS" "$LIVE"
  systemctl start garage
  exit 1
fi
cmp -s "$LIVE/data/content.json" "/var/www/garage-prev-$TS/data/content.json" && echo "admin data carried over unchanged"
echo "DEPLOYED $TS (previous: /var/www/garage-prev-$TS)"

# keep the last 5 previous releases
ls -d /var/www/garage-prev-* 2>/dev/null | sort | head -n -5 | xargs -r rm -rf
