# KopiKita MY V4 verification

20 October 2026. This document distinguishes the current source checks from production acceptance. Final publication, deployed version and public receipts belong in [docs/V4-RELEASE-REPORT.md](docs/V4-RELEASE-REPORT.md) and `reports/evidence.json`. Historical V3 results remain in [docs/V3-RELEASE-REPORT.md](docs/V3-RELEASE-REPORT.md); they do not establish V4 acceptance.

## Current source evidence

- All 30 original menu records retain their names, descriptions, categories, IDs and displayed prices. `npm run verify` checks the HTML against `data/menu-baseline.csv`, category counts 6/9/7/8, anchors/assets, indexable fictional CreativeWork metadata, approved destinations, visible disclosure and JavaScript syntax.
- The supplied photography checker executed successfully after the final four images were integrated: `photo rows=30, baseline rows=30, gaps=0`. The manifest has 30 verified records, 30 distinct source pages and downloaded source hashes, complete creator/license/date/alt/match metadata and 60 existing WebP derivatives. Both responsive sizes are integrated in the page. This syntactic check is complemented by source-permission research, actual image inspection and the [30-photo contact sheet](reports/photo-contact-sheet.html); it cannot establish rights or visual suitability by itself.
- The updated Edge 155.0.4283.62 suite passed all eight widths: 320, 375, 390, 430, 768, 1024, 1440 and 1920px. It checks all 30 product images decode, exact menu/filter counts, category/product anchors, navigation/Escape/outside dismissal, responsive reset, ticker motion/seam/pause/offscreen behavior, keyboard order, skip link, touch emulation, reduced motion, no JavaScript, blocked-main-script fallback and 200% text at 320/1440. Tested axe views have zero violations; no JavaScript/HTTP errors, image cancellations or external runtime requests were recorded. Current receipt: `artifacts/browser/results.json`, with screenshots and axe records alongside it.
- The matched visual capture run passed at 1440×900 and 390×844: public V3 and local V4 hero/menu/studio views, plus 0/25/50/75/100% states of each of the three native scenes at both widths. Transform records show changing animation states and fully opaque informative text. Evidence: `artifacts/v4/visual-final/results.json` and its labeled screenshots. The actual screenshots and complete product contact sheet were inspected; [reports/VISUAL-REVIEW.md](reports/VISUAL-REVIEW.md) explains the visual changes and tradeoffs.
- The real studio pointer/keyboard, protected footer popup and `#contact` navigation passed in `artifacts/v4/external-current/results.json`. These links remain unchanged by the four final photo substitutions. No enquiry was sent.

The final 30-photo WebKit run, refreshed performance comparison, final packaging, publication and production acceptance are tracked in the release report/evidence record. Earlier 23- or 26-photo runs remain diagnostic history and must not be relabeled as final 30-photo results. A partial browser run or an old Lighthouse summary is not a passing final receipt.

The user's 20 October clarification permits representative genuine photos. Sugar content, precise milk ingredient and the pandan roll's exact filling are not inferred from the four final images. Product source/rights notes preserve these limits; the visible menu and footer disclose the independent imagery and fictional café.

## Reproduction

Use Node.js 22+ and the locked project dependencies. Start `npm run dev` separately on port 4173; source must remain stable while tests run.

```sh
npm ci
npm run verify
npm test
node tools/v4-interactions.mjs
node tools/external-check.mjs
python KopiKita-V4-Codex-Handoff/scripts/check_product_photos.py --repo-root .
npm run build
npm run release:gate
npx wrangler deploy --keep-vars --dry-run
node tools/scan-secrets.mjs
```

In PowerShell, select the alternate engine and a separate evidence directory before running the same full suite:

```powershell
$env:BROWSER_ENGINE = 'webkit'
$env:EVIDENCE_DIR = 'artifacts/v4/webkit-photo-final'
npm test
Remove-Item Env:BROWSER_ENGINE
Remove-Item Env:EVIDENCE_DIR
```

`SITE_URL` selects a built or public target. `EVIDENCE_DIR` retains separate raw results. The matched visual helper uses the live public site as V3, so run it before deployment; after deployment use the preserved V3 source/captures rather than mislabeling current production. Source lint/inspector and the documented screenshot correction rounds support visual review; automated scripts cannot determine originality or photographic truth.

Run `tools/performance.mjs` alone with an immutable V3 baseline served on port 4174 and the candidate on 4173. It saves reports and traces for three alternating mobile pairs and one desktop pair. Record actual mobile/desktop scores, LCP, TBT and CLS, including regressions and measurement limits. Host activity and simulated throttling affect lab timing; this is not a field Core Web Vitals or speedup guarantee.

`npm run release:gate` checks all 30 verified integrated unique images, required provenance fields, current HTML SHA against visual acceptance, evidence-file presence and technical status. `npm run deploy` invokes the same guard before Wrangler. Passing the guard is a precondition for deployment, not evidence that deployment occurred.

After release, run `tools/verify-production.mjs` against the canonical host and the enabled workers.dev host using the clean committed build's `dist/release.json`. Every public byte hash and source commit must match; private/source paths must return 404, and responses must preserve `no-transform`. The verifier records bounded retries only for recognized transport failures; status, manifest and hash mismatches fail immediately. Run the browser and studio-link checks on production and preserve actual Worker version/deployment receipts.

## Evidence limits

Browser automation runs on Windows with emulated viewport, touch and text enlargement. It does not replace physical-device testing, a manual screen-reader audit, browser-chrome zoom or field INP measurement. Axe is not full WCAG conformance certification. Common-pattern secret scanning of staged files/reachable history is not a Gitleaks audit. The photo metadata checker does not independently validate licensing or ingredients; the source-linked visual review supplies the associated evidence and representation limits. No customer, enquiry or conversion outcomes are claimed.
