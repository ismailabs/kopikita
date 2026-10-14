# KopiKita MY — Fictional café website

A self-contained, responsive, single-page static website designed as a **fictional Kuala Lumpur specialty café concept** for **ISMAIL**, an independent Malaysian website development brand.

**Important:** KopiKita MY does not represent an operating café. Its menu, RM prices, setting, photos and stories are illustrative portfolio content. There is no booking, ordering, checkout, physical location, real café contact information or backend.

- Intended showcase URL: <https://kopikita.ismailstudio.my/> (**not published or configured by this project**)
- Real ISMAIL site: <https://www.ismailstudio.my/>
- Preferred hosting: **Cloudflare Pages with GitHub integration**
- Stack: **HTML5, CSS3, vanilla JavaScript, local WebP/JPEG and SVG**. No build system or Node.js package installation is required.

## What is included

- Warm editorial café art direction, adaptable desktop/mobile layouts and original logo/favicon.
- A concept disclosure at the top of the page, plus an explicit footer explanation.
- Hero, story, three featured signatures, 30 illustrated menu items, atmosphere, closing message, and portfolio attribution.
- Filterable menu categories (Everything, Malaysian kopi, Espresso bar, Iced & specialty, Bakes), with all menu items visible without JavaScript.
- Accessible mobile navigation, skip link, visible keyboard focus, semantic headings and reduced-motion support.
- Local optimized imagery, Open Graph artwork, SEO metadata, `robots.txt` and `sitemap.xml`.

## Folder structure

```text
kopikita-my/
├── index.html                 # Main content, menu item text/prices, metadata
├── styles.css                 # Palette, layout, type, responsiveness
├── script.js                  # Mobile navigation and category filters
├── robots.txt
├── sitemap.xml
├── README.md
├── ASSET-CREDITS.md
├── TESTING.md                 # Actual validation and limitations
└── assets/
    ├── brand/
    │   ├── favicon.svg
    │   └── logo.svg
    ├── images/
    │   ├── iced-latte.webp
    │   ├── cafe-interior.webp
    │   ├── espresso-craft.webp
    │   ├── pastry-selection.webp
    │   └── og-cover.jpg
    └── icons/
        └── item-01.svg ... item-30.svg
```

`assets/fonts/` is intentionally **not present**; fonts are system fallbacks and do not require network access.

## 1. Extract and preview locally

1. Download `kopikita-my-website.zip` and extract it. It creates a `kopikita-my` folder.
2. Open that folder, which contains `index.html` at the **deployable website root**.
3. Double-click `index.html` for a quick preview; its CSS, JS and assets use relative paths.
4. For a more representative browser preview, start a small local server **inside the `kopikita-my` folder**:

**Windows (PowerShell):**

```powershell
cd path\to\kopikita-my
py -m http.server 8000
```

**macOS / Linux:**

```bash
cd /path/to/kopikita-my
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Stop the server using **Ctrl+C**. If Python is unavailable, open `index.html` directly; this site does not need Node.js.

## 2. Editing the website

| Change | File / location |
| --- | --- |
| Headline, sections, story, disclaimers, metadata | `index.html` |
| Names, descriptions and prices of all 30 items | `index.html`, each `<article class="menu-item">` |
| Change a menu item category | Edit its `data-category` and move it into the matching `<section data-menu-group>`; adjust displayed category counts on filter buttons and group headings |
| Filter logic / mobile menu behaviour | `script.js` |
| Colours, sizing, spacing and breakpoints | `styles.css` `:root` and media queries |
| Hero and café photos | Replace `assets/images/*.webp`; keep file paths (or update matching HTML paths) |
| Menu thumbnail artwork | `assets/icons/item-01.svg` through `item-30.svg` |
| Logo and favicon | `assets/brand/*.svg` |
| Social preview artwork | `assets/images/og-cover.jpg` and corresponding HTML meta tags |
| Site's public address | Canonical/Open Graph URLs in `index.html`, plus `robots.txt` and `sitemap.xml` |

**Prices are fictional examples in RM**, not real offers or live inventory. Do not add a booking/contact CTA unless you actually create and connect the relevant service. After edits, verify links, menu categories, image alt text, mobile spacing and metadata.

### Image usage

All website imagery is stored locally. The photo-like artwork is generated and illustrative; it does not show a verified real café. See `ASSET-CREDITS.md` for image provenance, asset details and licensing caveats. No externally hosted font, image, script or stylesheet is used.

## 3. Create your GitHub repository

1. Sign into GitHub and create a new repository, for example `kopikita-my` (public or private, depending on your preferred visibility). Do not add secrets; there are none in this site.
2. **Repository root must contain `index.html`.** When using GitHub's web uploader, open the extracted `kopikita-my` folder, select the files **inside** it (including the `assets` folder), and upload them so that `index.html` is at the top level. Do not accidentally nest the whole `kopikita-my` directory one level too deep.
3. Commit the uploaded files to the default branch, typically `main`.

Alternatively, from inside the extracted folder with Git installed:

```bash
git init
git add .
git commit -m "Initial KopiKita MY website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/kopikita-my.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your own username and use your actual repo URL. If Git asks you to configure your author identity or authenticate, follow GitHub's setup instructions.

## 4. Deploy using Cloudflare Pages (recommended)

Based on the Cloudflare Pages official static HTML and Git integration guides, checked **14 October 2026**:

1. Sign in to your own Cloudflare dashboard and open **Workers & Pages**.
2. Create a **Pages** project using **Git integration** and connect your GitHub account/repository. The dashboard wording may change; locate the option to import or connect a Git repository.
3. Select the repo from step 3.
4. Choose your production branch, normally `main`.
5. This is plain static HTML: **no framework preset** and no npm build are necessary. The **build output directory should be `.`**, because `index.html` is at the repository root. If the dashboard requires a build command, use `exit 0` as documented for no-build static Pages projects; if optional, leaving it empty may work.
6. Deploy and wait for Cloudflare to show its result. The exact initial URL is assigned by Cloudflare, usually a `*.pages.dev` address.
7. Visit that assigned URL and check homepage, assets, filters, navigation and mobile layout. Do **not** assume the requested custom domain is connected yet.
8. For future updates, commit changes to the connected GitHub branch; Pages will normally deploy new commits automatically.

Official setup instructions:

- [Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)

### Git integration vs Direct Upload

- **Git integration** (recommended): automatic deployments when you push GitHub commits, as well as branch-based preview workflows. This is ideal for an evolving portfolio project.
- **Direct Upload**: drag-and-drop the site folder or a compatible ZIP using the Pages dashboard, or deploy a folder using Wrangler. This is fine for one-off publishing, but it is not the selected ongoing workflow.
- **Important project setup limitation:** Cloudflare currently documents that a project originally created through **Direct Upload cannot later be switched to Git integration**. Start with Git integration if you want automatic GitHub deployments. Git-integrated projects have restrictions on switching to dashboard drag-and-drop workflows. See [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) for current details.

## 5. Connect `kopikita.ismailstudio.my`

**Only do this after the initial `pages.dev` deployment is successful.** Changes to your public DNS affect live services; inspect the actual account and DNS settings before making any edits.

1. In your **Cloudflare Pages project**, open **Custom domains** and use the **Set up a domain** flow.
2. Enter the **exact intended hostname** `kopikita.ismailstudio.my` (no `www.`).
3. Complete the Pages domain-association steps; **do not simply create a CNAME without setting up the custom domain inside Pages first**. Cloudflare warns that doing so may lead to a 522 error.
4. If the `ismailstudio.my` DNS zone is **managed by Cloudflare**, follow the prompts; a CNAME record may be created automatically.
5. If `ismailstudio.my` DNS is **managed by another provider**, create the required **CNAME** record at that provider *after* completing the Pages custom-domain setup. In typical provider interfaces this means:
   - **Type:** `CNAME`
   - **Host/name:** `kopikita` (or `kopikita.ismailstudio.my` if the provider requires the full name)
   - **Target/value:** your **actual, assigned** `<your-pages-project>.pages.dev` hostname — never invent it or copy an example value.
6. Confirm the domain activates, HTTPS certificates work, and the page loads at <https://kopikita.ismailstudio.my/>. DNS propagation and certificate issuance may take time.
7. Verify that `assets/` files, favicon, page navigation, menu filtering, canonical URL, Open Graph image URL, `robots.txt` and `sitemap.xml` all resolve correctly.

Official reference: [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

**Do not change the root domain, MX records, nameservers or unrelated DNS records just to connect this subdomain.** You do not need a `www.kopikita.ismailstudio.my` hostname. If the existing domain is hosted elsewhere, use the documented subdomain CNAME approach rather than moving the entire DNS zone without good reason.

## 6. GitHub Pages alternative

This is compatible with GitHub Pages, but Cloudflare Pages remains the recommended platform. GitHub Pages can host the same static files. If hosting at a repository **subpath**, update the canonical and Open Graph absolute URLs to the actual published address; relative file references already work. For a custom domain, follow GitHub's own domain-verification and DNS guidance. Do not point the same custom hostname at two hosting services simultaneously.

## 7. Before publishing: checklist

- [ ] Confirm every asset loads and no console errors appear.
- [ ] Check layout around 320, 375, 430, 768, 1024, 1440px and beyond.
- [ ] Use keyboard-only navigation and test mobile menu and Escape close.
- [ ] Test every menu filter and count (6 local, 9 espresso, 7 iced, 8 bakes = 30).
- [ ] Disable JavaScript temporarily: all menu items and navigation links should remain available.
- [ ] Check visible fictional-project notices at top and footer.
- [ ] Run Lighthouse/axe or an equivalent independent audit if available; manually review contrast, alt text and content.
- [ ] Inspect the actual live site's security/HTTPS, metadata and social-sharing preview.
- [ ] Confirm ISMAIL external links lead to <https://www.ismailstudio.my/>.

## Limits and safeguards

- This project was designed for frontend presentation only. No account, payment, database, inventory, booking or real enquiry service is included.
- The canonical URL and absolute social URLs specify an **intended future address**, not a claim of actual publication.
- Static pages can be crawlable, but actual rankings, indexing, social-preview caching and real-device performance depend on the environment and cannot be guaranteed.
- Visual appearance may differ slightly across operating systems because system fonts are used. See `TESTING.md` for executed checks and testing limitations.
- Generated photographic artwork is illustrative; replace it with licensed, authentic photography if this concept is ever adapted into a real business website.
- For a real client, replace fictional content with verified business details and separately manage hosting, domain ownership and handover credentials.
