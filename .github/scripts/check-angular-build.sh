#!/usr/bin/env bash
#
# The Angular demo's source CI is compile-only. Distribution materialization belongs
# to the build and release trains, which replace cedar-cee-demo-angular-dist in their
# disposable workspaces. This check therefore examines only the build emitted by the
# source job and proves that it bundled the exact public CEE version the manifest pins.
#
# Run it after `npm run build` in cedar-cee-demo-angular-src.
set -euo pipefail

src=cedar-cee-demo-angular-src
built="$src/dist/cedar-cee-demo-angular-src/browser"

if [ ! -f "$built/main.js" ]; then
  echo "::error::$built/main.js is missing; run npm run build in $src first"
  exit 1
fi

pinned=$(node -p "require('./$src/package.json').dependencies['cedar-embeddable-editor']")

# CEE stamps its own version into the bundle it ships, and bundling keeps that literal.
if ! grep -q "version:\"$pinned\"" "$built/main.js"; then
  echo "::error::$built/main.js does not carry the pinned CEE version $pinned"
  exit 1
fi

echo "$built/main.js carries the pinned CEE version $pinned"
