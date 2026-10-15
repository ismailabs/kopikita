# KopiKita MY validation

Executed on 15 October 2026 against the local source and the original GitHub baseline `8b11de8a181ffbe385cbb8dd4f34feee1ca42e50`.

## Passed local checks

- Actual Microsoft Edge 155.0.4283.45 browser checks at 320, 375, 430, 768, 1024 and 1440px: no horizontal page overflow; all five filters return 30 / 6 / 9 / 7 / 8 items.
- Mobile navigation opening, Escape and focus restoration, anchor activation and destination focus, desktop/mobile resize reset.
- Keyboard filter activation and visible focus styles.
- Marquee visible at every width; actual frame samples show movement; adjoining equal tracks have no gap. Native pause/resume states, reduced motion and responsive resizing checked.
- No JavaScript and blocked script loading: all 30 entries and mobile navigation remain visible. The no-JavaScript marquee is static.
- Live reduced-motion preference changes disable marquee motion and filtering transitions.
- 200% text enlargement at 1440px produces no page overflow.
- Axe 4.13 scans with WCAG 2 A/AA, 2.1 AA and 2.2 AA tags at 375 and 1440px: zero violations after correcting the small studio label's contrast.
- No JavaScript exceptions or failed HTTP resources during the exercised local interactions.
- Every complete original menu entry compared with the original Git commit: names, descriptions, prices, categories and illustrations are unchanged.
- Syntax, local asset references, internal anchor destinations, unique IDs, category counts, fictional-project disclosure and production metadata checks pass.
- Explicit public-asset build and Wrangler deployment dry run pass.
- Dependency audit reports zero known vulnerabilities; the browser packages and Wrangler are development-only.

Commands: `npm run verify`, `npm test`, `npm run build`, `npx wrangler deploy --dry-run`, and `node tools/performance.mjs`. A staged-file/common-secret-pattern and history-diff scan is also run before publication; it is not a comprehensive guarantee that all possible secrets are detectable.

## Visual evidence

Baseline screenshots were captured before source edits. Lazy-loaded images were then explicitly decoded for complete baseline and upgraded full-page captures. Browser evidence lives in ignored `artifacts/browser/`: six full-page and hero sizes, section captures at desktop/mobile, axe reports, and `results.json`.

Inspection covers heading breaks, image crops, section rhythm, menu readability, mobile navigation, the visible marquee, studio attribution and reduced-motion composition. Screenshots are real browser captures. Entrance animations are allowed to finish for final section captures.

## Performance measurements

Lighthouse 13.5.0, installed Edge 155, local loopback HTTP, default simulated mobile throttling. Both versions use the same local server implementation and browser. One isolated paired run after the interaction tests:

| Metric | Original | Upgraded |
|---|---:|---:|
| Performance | 70 | 82 |
| Accessibility | 96 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First contentful paint | 1.18 s | 1.65 s |
| Largest contentful paint | 2.07 s | 2.27 s |
| Total blocking time | 1538 ms | 648 ms |
| Cumulative layout shift | 0 | 0 |
| Speed index | 4.81 s | 2.19 s |

The earlier run overlapped other browser work and included a robots fetch timeout. It was investigated and replaced with the isolated comparison above. The upgraded run's FCP/LCP were slower, while its blocking time and speed index improved. These are single-run laboratory results, with host variance; they are not field Core Web Vitals or a guarantee of real visitor performance. No extra runtime package, font or photography download was introduced.

Raw reports and the summary are in ignored `artifacts/performance/`.

## Publishing and production acceptance

Authenticated Cloudflare inspection confirmed the existing account, `kopikita` Worker, original `workers.dev` hostname, empty bindings and the `ismailabs/kopikita` main-branch Workers Builds trigger. Compatibility date and observability configuration are preserved. The existing `npx wrangler deploy` command uses the repository's build hook to create the allowlisted `dist` directory.

After pushing the reviewed commit, acceptance requires a successful build for that exact SHA and public `/release.json` verification. Compare every public asset's SHA-256 hash with the committed build, then run the same browser suite against the public URL using `SITE_URL`. Preserve the actual deployment ID, build ID and production results in the release evidence. A push or build response alone is insufficient.

## Evidence boundaries

Automated axe checks and keyboard interaction checks do not establish complete WCAG conformance. Physical devices, manual screen readers and real-user performance were not tested. The café is fictional; no ordering, payment, reservation or business-hours claim is made.
