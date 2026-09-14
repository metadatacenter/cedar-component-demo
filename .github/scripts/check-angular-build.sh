#!/usr/bin/env bash
#
# The Angular demo's source CI is compile-only. Distribution materialization belongs
# to the build and release trains, which replace cedar-cee-demo-angular-dist in their
# disposable workspaces. This check therefore examines only the build emitted by the
# source job and proves that it bundled the CEE the manifest pins.
#
# That takes two comparisons rather than one. The manifest may name CEE either as a
# plain public version or, for a Nexus dev snapshot, as an npm alias; and the version
# CEE stamps into its bundle is not always the version npm publishes it under. A dev
# snapshot keeps the stamp from the commit CEE was last versioned at, so the published
# version and the stamped one legitimately differ, and the CEE runbook says the hash
# is what distinguishes two such builds. Comparing the stamp against the manifest pin
# therefore fails on a correct dev snapshot.
#
# So: prove the install resolved what the manifest asked for, then prove the build
# carries what that install actually stamps.
#
# Run it after `npm run build` in cedar-cee-demo-angular-src.
set -euo pipefail

src=cedar-cee-demo-angular-src
built="$src/dist/cedar-cee-demo-angular-src/browser"
cee="$src/node_modules/cedar-embeddable-editor"

if [ ! -f "$built/main.js" ]; then
  echo "::error::$built/main.js is missing; run npm run build in $src first"
  exit 1
fi

# An alias names the version after its final "@"; a plain pin is already the version.
pinned=$(node -p "require('./$src/package.json').dependencies['cedar-embeddable-editor']")
wanted=${pinned##*@}
installed=$(node -p "require('./$cee/package.json').version")

if [ "$installed" != "$wanted" ]; then
  echo "::error::$src installed CEE $installed, but the manifest pins $pinned"
  exit 1
fi

# The version CEE stamps into the bundle it ships. Bundling keeps that literal.
stamp=$(grep -oE 'version:"[0-9]+\.[0-9]+\.[0-9]+[^"]*"' "$cee/cedar-embeddable-editor.js" |
  head -1 | sed 's/^version:"//; s/"$//')

if [ -z "$stamp" ]; then
  echo "::error::could not read the version stamp from $cee/cedar-embeddable-editor.js"
  exit 1
fi

if ! grep -q "version:\"$stamp\"" "$built/main.js"; then
  echo "::error::$built/main.js does not carry the stamp $stamp of the installed CEE $installed"
  exit 1
fi

echo "$built/main.js carries CEE $installed, stamped $stamp"
