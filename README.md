# KopiKita MY

A fictional Malaysian café concept by [ISMAIL](https://ismailstudio.my/). The café, menu, prices and synthetic imagery are illustrative. There are no orders, payments, reservations, actual venue, customers or business hours.

Production status (2026-10-17): **PRODUCTION COMPLETE — VERIFIED** at https://kopikita.ismailstudio.my/. The missing KopiKita Worker and hostname were restored with explicit user authorization, and live acceptance passed. See [release evidence and network scope](docs/RELEASE-REPORT.md).

- Intended public URL: <https://kopikita.ismailstudio.my/>
- Existing Worker endpoint: <https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/>
- Repository: <https://github.com/ismailabs/kopikita>, production branch `main`
- Existing Cloudflare Worker: `kopikita`, account pinned in the unchanged `wrangler.jsonc`

## Architecture and design

Semantic HTML, one tokenized mobile-first stylesheet, and progressive vanilla JavaScript. No runtime packages, third-party scripts, external fonts, backend services or analytics. DM Serif Display and DM Sans are hosted locally with their OFL licenses. The handoff boards guided composition only; their invented claims and menu data were not used.

All 30 original menu entries remain in HTML and work without JavaScript: Malaysian kopi (6), espresso bar (9), iced & specialty (7), bakes (8). `data/menu-baseline.csv`, independently checked against original commit `541ae32`, locks every name, description, category and display price. The four photographic highlights link to exact original rows. With JS they reveal the appropriate category and move focus; without JS they are ordinary working anchors.

The small navigation controller runs immediately after the header to prevent a measured loading shift; the deferred script handles filters and motion. Navigation supports Escape, outside dismissal, destination focus and responsive reset, including when the main script fails. Five native filter buttons announce counts and pressed state. The slow decorative ticker has pause/resume, offscreen/document pause, reduced-motion and static no-JS behavior. Entrances never gate access to content. Cream reading surfaces, a cinematic desktop opening, separate mobile image crop and restrained botanical identity form one visual system. See [design decisions](docs/REDESIGN-DECISIONS.md).

The fictional disclosure remains visible at the top, near the illustrative menu and in the footer. Two truthful studio links use exactly `https://ismailstudio.my/`. Metadata uses `CreativeWork`, the intended custom canonical, and `noindex, follow`. No DNS or routes need changing.

## Development and verification

Node.js 22+; locked development dependencies. On Windows the tests use installed Microsoft Edge; use `BROWSER_PATH` for an alternative Chromium executable. `BROWSER_ENGINE=webkit` or `firefox` selects another installed Playwright engine.

```sh
npm ci
npm run dev
npm run verify
npm test
node tools/motion-contrast-check.mjs
node tools/external-check.mjs
npm run build
npx wrangler deploy --dry-run
```

Preview: `http://127.0.0.1:4173`. `SITE_URL` changes the test destination, and `EVIDENCE_DIR` changes the evidence folder. The suite checks 320/375/430/768/1024/1440/1920px, exact menu content, all filters, featured links, keyboard/focus/navigation, real animation frames, pause, reduced motion, script failure, 200% text and touch emulation. Axe covers desktop/mobile, open navigation and filtered state. External navigation is separately tested against the actual portfolio. [TESTING.md](TESTING.md) records executed coverage and limitations.

`tools/performance.mjs` compares a separately served baseline on port 4174 against the candidate on port 4173: three alternating paired mobile trials and one paired desktop trial with Lighthouse. Run it after browser suites complete to avoid concurrent browser interference. These are local lab measurements, not field Core Web Vitals or conversion evidence.

## Existing Worker publication

Workers Static Assets, not Pages. Git history and saved public receipts establish the previous Worker arrangement. The original Worker was absent on 17 October 2026 and was recreated with explicit user authorization. The custom domain is now declared in `wrangler.jsonc`; Cloudflare manages that hostname's DNS and certificate. No wildcard, apex or other project's mapping is part of this configuration.

Production source is `main`. Use authenticated `npm run deploy` from a clean validated committed checkout; its Wrangler build hook executes `npm run build`, and `--keep-vars` preserves dashboard variables. The old Workers Builds integration cannot be assumed to survive recreation. Builds API inspection currently returns 403 with local OAuth, so automatic deployment is unverified; do not claim a Git push alone deploys this restored target. If Git builds are connected later, inspect and observe them rather than deploying twice. Never force-push or modify unrelated resources.

The build publishes an explicit allowlist: HTML, stylesheet, JS, robots, sitemap and selected/local assets. It creates `release.json` with the Git commit and SHA-256 hashes, normalizing text line endings across Windows/Linux. Dependencies, Git state, source docs, handoff, CSV baseline, tools, local evidence and secrets are excluded. `tools/verify-production.mjs` requires every hosted file hash and release commit to match the locally built committed revision, and checks source/private paths return 404.

The `_headers` control file sets `Cache-Control: public, max-age=0, must-revalidate, no-transform` only on this Worker's responses. This prevents the zone's automatic analytics injection from altering KopiKita's HTML, preserves exact served bytes and keeps the concept free of runtime tracking. Cloudflare consumes this control file; it is excluded from the public hash manifest and must return 404 publicly. Shared zone analytics settings are unchanged.

```sh
# From a clean, validated main checkout after authenticated invariant inspection:
npm run deploy
npm run build
node tools/verify-production.mjs
# Repeat with SITE_URL set to the existing workers.dev endpoint.
# Rerun the browser and external-link suites against the intended public URL.
```

A successful Git push alone does not establish production acceptance. Exact deployment receipts, asset matching, public browser journeys, rollback reference and remaining limitations belong in [the release report](docs/RELEASE-REPORT.md).

## Assets and ownership

See [ASSET-CREDITS.md](ASSET-CREDITS.md). Supplied third-party Pinterest screenshots, mockup PNGs and full-resolution generation originals remain in the ignored handoff and are not published. The original repository assets are retained as provenance; current imagery is explicitly synthetic. No trademark clearance, exclusive copyright, café certification or real customer results are claimed.
