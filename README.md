# cedar-component-demo

Three small applications that embed the CEDAR Embeddable Editor, one per framework:

| Folder | Framework |
|---|---|
| `cedar-cee-demo-angular-src` | Angular |
| `cedar-cee-demo-react` | React |
| `cedar-cee-demo-ember-src` | Ember |

All three edit the same template, `eDNA ECT Demonstration`, which each one keeps as a
file of its own. No demo reaches out to a template server.

`cedar-cee-demo-angular-dist` is the built Angular demo, published as an npm package.
The release fills it from `cedar-cee-demo-angular-src`, so edit the source and rebuild
rather than editing the built files.

Each demo lints, tests and builds on its own:

```shell
npm run lint && npm test && npm run build
```

From a CEDAR workspace, `cedarcli test cee-demos` always checks all three demos in
disposable copies against their checked-out CEE pins. To check an unpublished CEE
candidate, pass `--cee-package /absolute/path/to/staged-package-or.tgz`; the runner
installs those exact packaged bytes under the demos' usual CEE dependency name.
Neither mode changes the source manifests or locks.

The gate divides its worker allocation between three parallel framework builds, then runs
27 production-browser cases: three consumer contracts in each framework and each of Chromium,
Firefox and WebKit. They check object inputs, configured rendering, typed change events and
serialized values, and a fresh mount after navigation. All assets and templates are local;
these checks need no CEDAR deployment. Retries and skips cannot satisfy the gate.
The CLI reserves the allocation from CEDAR's shared host worker pool. Command logs, timings,
browser JSON results and failure traces live beside the gate record under `.cedar/cee-demos/runs/`.

To test already-built demos directly, run `npm ci` in `browser`,
`npx playwright install chromium firefox webkit`, then `npm test`. Set `CEDAR_TEST_WORKERS`
to bound that invocation, or `CEDAR_DEMO_FRAMEWORKS=angular` (also `react` or `ember`) to
select one framework. `cedarcli test cee-demos` always checks all three regardless of that selector.
Linux hosts need `npx playwright install-deps chromium firefox webkit` once; CI installs those
system dependencies explicitly. No browser test changes the demo's normal UI.

Everyday frontend builds keep these demos outside the main build graph and run this
gate only when CEE's embedding API/packaging, consumer pins or demo inputs change
(including the first run). CEE CI and the public-release procedure check the staged
candidate regardless of local cached results. Train and platform-release checks
continue to include all three demos.

GitHub Actions runs lint, framework tests, production builds and the three-engine browser gate
for each demo on every push and pull request, on Node 24. It also checks the Angular source build
with `.github/scripts/check-angular-build.sh`; source CI does not rewrite tracked distributions.

Please check out the individual README files in the top level folders!
