# KopiKita MY

A fictional Malaysian café concept by [Ismail Studio](https://ismailstudio.my/). The café, menu and prices are imagined. All 30 menu products use genuine, independently sourced representative photographs; the coffee-pour and print compositions are generated illustrative brand artwork. There are no orders, payments, reservations, actual venue, customer claims or business hours.

The V4 source on `codex/kopikita-v4` now has complete 30-photo coverage. The user authorized representative photography on 20 October 2026; the four clarified matches and their ingredient limits are recorded in [the photo sourcing report](reports/PHOTO-SOURCING.md). Publication and production acceptance are recorded separately in [the V4 release report](docs/V4-RELEASE-REPORT.md) and `reports/evidence.json`. Photo completion alone is not a production deployment receipt.

- Canonical public URL: <https://kopikita.ismailstudio.my/>
- Existing Worker endpoint: <https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/>
- Repository: <https://github.com/ismailabs/kopikita>
- Existing Cloudflare Worker: `kopikita`, account and custom hostname pinned in `wrangler.jsonc`

## V4 architecture and design

Semantic HTML, one tokenized stylesheet and progressive vanilla JavaScript implement three signature scenes: an illustrative coffee-pour opening, a photographic menu exhibition and the Ismail Studio finale. Native CSS, SVG and Web Animations API provide motion. No runtime packages, third-party scripts, external fonts, backend services, analytics or paid services are required. DM Sans and DM Serif Display are hosted locally with their SIL Open Font Licenses.

The opening uses supplied desktop and portrait artwork with KOPI/KITA poster typography. The menu alternates image-led cards on desktop, keeps paired columns on tablet and wider mobile viewports, then becomes a single stack at 480px and below. Mobile crops, typography and action placement are separately composed. [V4 design decisions](docs/V4-DESIGN-DECISIONS.md) and [matched V3/V4 visual review](reports/VISUAL-REVIEW.md) document the implementation and tradeoffs.

All 30 original entries remain ordinary HTML and work without JavaScript: local kopi (6), espresso (9), iced (7) and bakes (8). `data/menu-baseline.csv` locks every original name, description, category, ID and displayed price. Five filter buttons update pressed state, announce counts and preserve category state in the URL. Legacy category and product fragments reveal the correct content. Navigation supports Escape, outside dismissal, destination focus and responsive reset, including when the main script fails.

Content is visible before animation. Global pause, the ticker's pause control, reduced motion, offscreen/document pausing and lifecycle cleanup retain usable static content. Fictional status is visible in the opening, story, menu and footer. The menu explicitly says that KopiKita prepared and photographed none of the products. Product and footer credits identify each photograph's creator, source, license and adaptations. See [asset credits](ASSET-CREDITS.md), the [source-linked contact sheet](reports/photo-contact-sheet.html) and `data/product-photos.json`.

Metadata describes an indexable fictional `CreativeWork`, with the custom canonical, robots policy and sitemap. It contains no operational café, LocalBusiness, rating or booking schema. Portfolio and enquiry actions link to the real `https://ismailstudio.my/` and its `#contact` section; the concept submits no enquiry itself.

## Development and verification

Use Node.js 22+ and locked development dependencies. Windows browser tests use installed Microsoft Edge. `BROWSER_PATH` selects another Chromium executable; `BROWSER_ENGINE=webkit` selects the cached alternate engine. Run the dev server in a separate terminal:

```sh
npm ci
npm run dev
```

Then run the relevant source, browser and release checks:

```sh
npm run verify
npm test
node tools/v4-interactions.mjs
node tools/v4-visual-check.mjs
node tools/external-check.mjs
python KopiKita-V4-Codex-Handoff/scripts/check_product_photos.py --repo-root .
npm run build
npm run release:gate
npx wrangler deploy --keep-vars --dry-run
```

The local handoff is ignored and must be present to run its photography checker. Its metadata check does not replace actual image and reuse-permission inspection. `tools/v4-visual-check.mjs` captures the live public V3 baseline before release; after V4 deployment, retain the saved V3 captures/source instead of relabeling the live site as V3.

Preview: `http://127.0.0.1:4173`. `SITE_URL` changes the test destination and `EVIDENCE_DIR` changes the evidence directory. [TESTING.md](TESTING.md) distinguishes current executed results, reproduction commands and remaining verification. The browser suite covers eight widths from 320 to 1920px, exact menu data, image decoding, filters, anchors, keyboard/navigation, reduced motion, no JavaScript, main-script failure and 200% text. Axe covers desktop/mobile, open navigation and filtered state; external navigation is tested separately against the actual portfolio.

`tools/performance.mjs` runs three alternating paired mobile Lighthouse trials and one desktop pair against a separately served immutable V3 baseline on port 4174 and the candidate on port 4173. Run it after other browser suites close. These are local lab measurements, not field Core Web Vitals or conversion evidence.

## Existing Worker publication

The site uses Workers Static Assets, with the existing Worker and custom hostname. No Pages project, DNS change or infrastructure recreation is required. Use authenticated `npm run deploy` from reviewed committed source after the complete media, technical and visual gates pass. The script invokes `release:gate` before Wrangler; Wrangler's build hook runs `npm run build`, and `--keep-vars` preserves dashboard variables. A Git push alone does not establish deployment. The inherited Workers Builds integration remains unverified unless its current state is independently observed.

The build copies an explicit public allowlist and only assets referenced by public HTML/CSS, plus font licenses. `dist/release.json` records the source commit and every public file's SHA-256, normalizing text line endings across Windows/Linux. Handoffs, source documentation, menu CSV, provenance JSON, tools, dependencies, Git state, raw evidence and credentials stay outside the public bundle. The `_headers` control file sets `Cache-Control: public, max-age=0, must-revalidate, no-transform` on this Worker's responses; it must return 404 publicly.

After deployment, `node tools/verify-production.mjs` must match the committed build's manifest and every public asset hash, and confirm source/private paths return 404. Repeat with `SITE_URL` set to the enabled workers.dev endpoint, then run browser and real studio-link checks against production. The [V4 release report](docs/V4-RELEASE-REPORT.md) must record the actual deployed version, verified public commit, evidence and rollback procedure before claiming completion. The retained [V3 acceptance report](docs/V3-RELEASE-REPORT.md) is historical recovery evidence, not proof of a V4 release.
