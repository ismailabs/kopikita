# KopiKita MY V3 validation

18 October 2026. This file records executed V3 checks; the production receipt is in [docs/V3-RELEASE-REPORT.md](docs/V3-RELEASE-REPORT.md). Historical V2 acceptance remains in docs/RELEASE-REPORT.md.

The exact 30 menu entries match data/menu-baseline.csv and original Git commit 541ae3246a9ef69cf6da0025f2c00aece62664f0. Categories remain 6/9/7/8 and display prices/descriptions are unchanged.

- Locked npm ci on Node 24.19.0/npm 11.17.0 completed with 0 reported vulnerabilities. npm reported unapproved optional esbuild/workerd install scripts; no permission policy was changed. Existing installed executables passed the build/dry-run gates.
- npm run verify passes the exact menu, anchors, asset paths, canonical, noindex, disclosures, studio destinations and JS syntax.
- Full local Edge 155.0.4283.62 suite passes at 320/375/390/430/768/1024/1440/1920: exact menu/filter counts, four favourite anchors/focus, mobile nav/Escape/outside tap, breakpoint reset, ticker frames/seam/pause/offscreen pause, keyboard/skip/touch, reduced motion, noJS, blocked-main-script fallback and 200% text at 320/1440. Zero axe findings, JS/HTTP failures, image cancellations or external runtime loads. Raw results/screenshots: artifacts/v3-local/edge/.
- Full local WebKit 27.2 suite also passes all eight widths and the complete keyboard, navigation, filter, fallback, reduced-motion and 200% text checks, with zero axe/errors/cancellations/external runtime loads. Raw results: artifacts/v3-local/webkit/.
- node tools/motion-contrast-check.mjs passes 16 real paused-animation cases: Edge 155.0.4283.62 and WebKit 27.2, 375/1440px, entrance-first/control-mid plus all first/middle/last frames. Zero axe findings and fully opaque live text. Raw results: artifacts/v3-local/motion/.
- node tools/external-check.mjs passes pointer/keyboard navigation to the exact studio href, its real redirect and protected footer popup.
- npm run build and npx wrangler deploy --dry-run pass. The explicit allowlist produces 60 public files plus release.json; no bindings. The built 4175 preview passes all 60 public hashes and 15 private/source 404 checks, including V3 handoff/skill files.

The live canonical Edge full suite passed all eight widths and the same complete functional/fallback/accessibility checks. Workers.dev smoke passed at 375/1440. Raw results: artifacts/v3-production/.

The production verifier now records bounded transport retries without retrying status, manifest or hash mismatches. Its three negative fixtures all fail immediately as intended; the ignored helper exits 0. On Windows Node 24, two intentionally failing children additionally report UV_HANDLE_CLOSING during shutdown after writing correct FAIL receipts; raw evidence is retained. Actual positive production checks exit 0.

The initial open-navigation axe run found decorative ivory stamp text over orange at 2.43:1. Opaque pine fixed it. Visual review also found 320px enlarged-text overlap; adaptive favourites columns, fixed-size gutters, wrapping definition and resilient body text fixed it. Final full Edge rechecked both cases without relaxing assertions.

Paired Lighthouse finished: V3 mobile medians 97 performance, 2.274s LCP, 126ms TBT and CLS 0; desktop sample 99. FCP was slower than the baseline median. Every sample, trace and limitation is recorded in the release report; both public hosts also passed exact manifest/60-file hashes/private 404s and browser journeys. Detailed production receipts are recorded there. No inherited V2 result counts as V3 acceptance.

Reproduce with Node 22+ and the locked project dependencies:

```sh
npm ci
npm run dev
npm run verify
npm test
node tools/motion-contrast-check.mjs
node tools/external-check.mjs
npm run build
npx wrangler deploy --dry-run
node tools/scan-secrets.mjs
```

Set BROWSER_ENGINE=webkit to select the cached Playwright engine, EVIDENCE_DIR for independent raw results, and SITE_URL for built/public checks. Source must be stable during browser tests. Run tools/performance.mjs alone, with a separately served immutable baseline at 4174 and candidate at 4173; it saves Lighthouse reports and traces for three alternating mobile pairs and one desktop pair. Lab timing is host-sensitive and does not establish field Core Web Vitals or a speedup.

Limitations: browser automation is on Windows, with emulated viewport/touch/text scaling; no physical devices, manual screen-reader audit, browser-chrome zoom or field INP measurement. Axe is not a full WCAG conformance certification. Secret checks cover common patterns and reachable diffs, not a Gitleaks audit.
