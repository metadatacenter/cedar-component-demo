#!/usr/bin/env bash
#
# The Angular demo is published from cedar-cee-demo-angular-dist, which holds a build
# of cedar-cee-demo-angular-src rather than sources of its own. Nothing but habit keeps
# the two in step, and they have drifted before: the committed package once carried CEE
# 2.0.1 while every manifest pinned 2.0.3.
#
# This is not a reproducibility check. Comparing the committed bytes against a fresh
# build would demand that two machines produce identical output, which is not something
# this repository has established. It checks the two things that are unambiguous: that
# the package carries the CEE the manifest pins, and that it holds the files a build
# now produces.
#
# Run it after `npm run build` in cedar-cee-demo-angular-src.
set -euo pipefail

src=cedar-cee-demo-angular-src
dist=cedar-cee-demo-angular-dist
built="$src/dist/cedar-cee-demo-angular-src/browser"

if [ ! -d "$built" ]; then
  echo "::error::$built is missing; run npm run build in $src first"
  exit 1
fi

pinned=$(node -p "require('./$src/package.json').dependencies['cedar-embeddable-editor']")

# CEE stamps its own version into the bundle it ships, and bundling keeps that literal.
if ! grep -q "version:\"$pinned\"" "$dist/main.js"; then
  echo "::error::$dist/main.js does not carry CEE $pinned; rebuild the demo and sync the dist"
  exit 1
fi

# The dist package keeps four files of its own that no build emits.
if ! diff \
  <(cd "$built" && find . -type f | sort) \
  <(cd "$dist" && find . -type f \
      ! -name README.md ! -name license.txt \
      ! -name package.json ! -name package-lock.json | sort); then
  echo "::error::$dist does not hold the files a fresh build produces; sync the dist"
  exit 1
fi

echo "$dist carries CEE $pinned and the file set of a fresh build"
