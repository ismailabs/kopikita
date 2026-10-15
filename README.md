# KopiKita MY

A fictional Kuala Lumpur specialty café concept, designed and developed by ISMAIL as a frontend portfolio showcase. The café, products and prices are illustrative. Enquiries about website services go to [ISMAIL](https://www.ismailstudio.my/).

- Production: https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/
- Repository: https://github.com/ismailabs/kopikita
- Production branch: `main`
- Existing Cloudflare Worker: `kopikita`

## Architecture

Semantic HTML, CSS and vanilla JavaScript, with system fonts and local WebP/JPEG/SVG assets. There are no runtime packages, CDN scripts, backend services or purchasing operations. The original 30 menu entries remain in HTML: Malaysian kopi (6), espresso bar (9), iced & specialty (7), and bakes (8).

`styles.css` contains the original visual foundations; `refinements.css` contains the editorial type scale, responsive refinements and motion system. `script.js` progressively enhances navigation, filters, announcements, the marquee pause control and one-time Intersection Observer entrances. Without JavaScript, the navigation and all menu content remain available, and the marquee becomes static. Reduced-motion preferences also disable the moving marquee and menu transitions.

The marquee uses equal 1600px tracks, translated by half their combined width. Its usual pace is about 36px per second and is independent of the viewport width. Above 1600px, each track expands to cover the viewport. Decorative duplicates are hidden from assistive technology. A native pause/resume control is available; movement also pauses offscreen and when the document is hidden.

## Local development and validation

Requires Node.js 22 or newer. Development dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
npm run verify
npm test
npm run build
npx wrangler deploy --dry-run
```

Preview: `http://127.0.0.1:4173`. The browser checks use an installed Microsoft Edge by default. On another machine, install Chromium with `npx playwright install chromium` and supply `BROWSER_PATH` with its executable path. Screenshots and machine-readable results are written under ignored `artifacts/`.

Browser checks cover 320, 375, 430, 768, 1024 and 1440px, all five filters, responsive navigation, keyboard activation, reduced motion, actual animation frames, marquee pause/resume, missing JavaScript, blocked script loading, resource failures, text enlargement and axe accessibility checks. See [TESTING.md](TESTING.md) for executed evidence and its limits.

## Deployment to the existing Worker

This repository uses Cloudflare Workers Static Assets. The `wrangler.jsonc` name is `kopikita`; the public destination remains the existing `workers.dev` hostname. The previous Pages/custom-domain instructions were obsolete and have been replaced.

`npm run build` copies an explicit public allowlist into `dist`: HTML, the two stylesheets, JavaScript, robots, sitemap and local assets. It creates `release.json` with the Git commit and SHA-256 hashes of public files. Source documentation, dependencies, test evidence, `.git`, deployment state and credentials stay outside the publish directory.

Before deploying, authenticate against the account that owns the existing Worker and inspect its current settings, bindings and build integration. If Workers Builds is already deploying `main`, observe that deployment instead of launching a duplicate. Authenticated inspection on 15 October 2026 confirmed Workers Builds connects `ismailabs/kopikita` (`main`) to the existing Worker. Its deploy command is `npx wrangler deploy`, with an empty separate build command. The Wrangler build hook runs `npm run build` before that existing deploy command. Pushing to `main` therefore publishes automatically; observe the build instead of deploying twice.

For a verified manual deployment:

```sh
npx wrangler whoami
npm run verify
npm test
npm run build
npx wrangler deploy --dry-run
npm run deploy
```

The deployment command keeps dashboard variables. This static-asset configuration must first be compared with the existing hosted Worker's settings; it is not authorization to remove unrelated bindings or secrets. No DNS or account changes are needed.

After publishing, retrieve `/release.json`, verify its commit and hashes against the committed build, and rerun browser checks with `SITE_URL` set to the production URL. A local build, successful push or deployment response alone does not establish production acceptance.

## Assets and project truthfulness

Existing photography and illustrations are preserved. See [ASSET-CREDITS.md](ASSET-CREDITS.md) for attribution. Metadata describes a `CreativeWork`, rather than an operating café, and canonical/Open Graph/robots/sitemap references point to the approved production hostname. The concept disclosure is visible at the top and in the footer.
