# V4 Visual Transformation Gate — PASS

Reviewed 20 October 2026 against the V3 public site and the local V4 build. V4 is a substantial visual transformation, and the full 30-image product exhibition is complete. The photo contact sheet and matched screenshots were inspected at desktop and mobile sizes. All menu photography is genuine and appropriately licensed; the four clarified items are accurately labeled representative depictions. The visible menu disclosure says no products were prepared or photographed by KopiKita.

## Matched browser evidence

`artifacts/v4/visual-final/` contains actual Edge 155.0.4283.62 captures of the public V3 site and local V4 at 1440×900 and 390×844. Each viewport covers the hero, menu and studio finale. The same run captured 0%, 25%, 50%, 75% and 100% states for the three finite native scenes at both viewports; `results.json` records transform matrices and verifies informative text remained fully opaque. The 30-product contact sheet is `artifacts/v4/photo-contact-sheet.jpg`; linked per-product source and license records are in `reports/photo-contact-sheet.html` and `data/product-photos.json`.

## Observable transformation

| Area | V3 | V4 |
| --- | --- | --- |
| Hero | Three-line serif heading beside an iced-glass arch | Full-width illustrative coffee pour, huge condensed word forms, authored motion and a dedicated portrait mobile crop |
| Identity | Botanical café styling and soft serif hierarchy | Supplied porcelain-cup mark, heavy poster typography, selective serif category headings and warm print fields |
| Menu | Compact text-and-icon list after four synthetic highlights | Thirty image-led products in an alternating 4:3 gallery, exact unchanged names/descriptions/prices, live category filters and source credits |
| Motion | Mild entrance effects and a ticker | Finite pour/type entrance, restrained image zoom, tactile arrow response and large studio word entrances; native scrolling retained |
| Studio | Quiet pine contact panel | Near-viewport typographic finale with real portfolio and contact links |
| Mobile | Scaled split hero and compact menu | Independent portrait artwork, stacked composition, touch-sized filters and a single-column small-phone gallery, paired columns on wider screens |

## Gallery and layout review

The complete contact sheet was viewed at its full 30-product size. The four new assets keep the same landscape 4:3 source frame as the rest of the gallery. The CSS uses `object-fit: cover` inside the established alternating grid; phones up to 480px use a single column and a tighter 6:5 frame, while wider screens use paired 4:3 cards. Mixed source aspect ratios therefore do not change card height. The fresh-mango tart retains both fruit and pastry edge, the pandan roll shows its green sponge and spiral, and both kopi images read clearly at menu size. The Ipoh coffee crop keeps the cup prominent while leaving only a narrow toast edge. Product spacing, source credit placement and category rhythm remain consistent, so no layout or interaction redesign was needed.

The photographs come from independent contributors and show varied vessels and lighting; the gallery does not pretend to be a commissioned KopiKita product shoot. The contact sheet and visible disclosure make that distinction explicit. Hero pour and print art remain illustrative brand artwork and are not counted among the 30 product photographs.

## Current browser and interaction checks

The updated Chromium matrix passed at 320, 375, 390, 430, 768, 1024, 1440 and 1920 pixels: all 30 cards and images decoded, category counts remained 30/6/9/7/8, and no overflow, failed resources, external runtime requests or JavaScript errors occurred. Axe found no WCAG A/AA issues in the tested views and filtered menu. Reduced motion, no-JavaScript content, 200% text, keyboard tab order, mobile navigation and touch filtering also passed. Refreshed WebKit results at 768/1024/1440/1920 and shared mobile/fallback/keyboard checks are recorded in `artifacts/v4/webkit-photo-final-desktop/results.json`. The preceding mobile captures are retained separately; its 768px pointer-stability timeout was resolved by the successful focused retry without production changes.

The final inspector (`artifacts/v4/taste-photos-release/report.json`) reports 0 FAIL and 3 WARN at 1440/768/390. Every listed fold and page sheet was inspected. Allowances retain the approved cream palette, accent type, required credits/labels and preserved numbering; the covered-text allowance applies to the intentionally clipped decorative ticker, whose separate movement/seam/pause tests pass. Earlier transient image/CDP failures remain recorded, and no broken-image allowance was used. The three remaining observations are defended brief choices: supplied still artwork uses native movement rather than invented venue footage; the brand title is accompanied by visible 18px fictional-café identification; fluid poster headings and responsive product typography produce varied measured sizes. None obscures product information.

## Final acceptance refresh

Seen immediately: a Malaysian coffee poster, with a genuine-photo menu and a real studio destination. The idea is a shared kopi ritual presented as a moving printed exhibition. The live menu filters, product fragments, credits and studio links remain useful controls. Layout words: hero=full-bleed pour / story=serif split / menu=alternating photographic gallery / print=illustrative field / studio=large typographic finale. The last review resolved the four missing images, checked their phone crops, and corrected stale gallery documentation. No further visible defect was identified in the final sheets. Subjective self-ratings are omitted under the user's comparative-evidence requirement.
