# KopiKita MY — Validation record

**Date:** 14 October 2026. This record describes checks performed on local project files; it is not a claim that the intended public domain has been deployed.

## Passed checks

| Check | Result | Method |
| --- | --- | --- |
| Homepage and sample assets served by local Python HTTP server | Passed | HTTP 200 for `/`, `index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, hero photo, SVG favicon, and last menu icon |
| Project structure and relative paths | Passed | Parsed HTML `src`/`href` references against filesystem; no missing local references found |
| Menu completeness | Passed | Exactly 30 content entries in the HTML: local 6, espresso 9, iced 7, bakes 8 |
| Menu filters | Passed | Playwright Chromium click tests across six widths; selected groups returned the intended counts |
| Mobile navigation | Passed | Playwright Chromium checked toggle visibility, open state, and Escape close at widths 320, 375, 430 px |
| No-JavaScript fallback | Passed | Chromium with JavaScript disabled at 375px showed all 30 menu entries and the navigation links |
| Browser layout / horizontal overflow | Passed | Chromium measured zero page-level horizontal overflow at 320, 375, 430, 768, 1024, 1440px |
| Above-the-fold images | Passed | No visible missing images at the tested widths; section-scroll image checks found no broken fully loaded images |
| Browser JavaScript errors | Passed | No uncaught page errors observed in six browser configurations |
| JavaScript syntax | Passed | `node --check script.js` |
| HTML anchors and element IDs | Passed | All fragment links resolve to page IDs, with no duplicate element IDs |
| SVG and sitemap XML | Passed | XML parser accepted 32 SVG files and `sitemap.xml` |
| CSS syntax | Passed | CSS parsing found no top-level syntax errors |
| Basic contrast spot check | Passed | Revised primary accent (`#945333`) to improve small coloured text contrast against the cream background |

**Browser test environment limitation:** The container's Chromium browser was blocked by system policy from navigating to `localhost` and `file://` URLs. For responsive browser tests, the actual project HTML and CSS/JS source were rendered in an in-memory page, with the exact local image bytes embedded as data URLs. This verifies substantial visual layout and interactions, but is **not** the same as browser-testing the final files through an HTTP origin. The real static files were separately tested over local HTTP using Python. All captures and screenshots used during review were generated locally.

**Lazy images:** A full-section screenshot may be taken before images far below the current viewport have loaded; those assets successfully resolve on reaching their sections. Menu item thumbnails are intentionally marked `loading="lazy"`.

## Not tested / still to be verified

- Live Cloudflare Pages deployment, custom domain, actual DNS, SSL issuance or search-engine indexing.
- Lighthouse performance score or measured Core Web Vitals.
- Full automated accessibility/axe audit or screen-reader testing on real devices.
- Broad cross-browser matrix (Safari, Firefox, older mobile browsers).
- Real social card preview after public hosting or social cache refresh.
- Physical mobile/touch devices and live network throttling.

Review the README checklist and repeat relevant checks on the actual public deployment. Automated results do not guarantee WCAG conformance or absence of all UX defects.
