# KopiKita V4 — IMPLEMENTED, PRODUCTION BLOCKED

Date: 20 October 2026. Scope: KopiKita only. **This is a reviewable implementation, not a finished production V4 release.** The approved handoff requires 30 genuine matching photographs. There are 23 accepted photographs and seven unresolved products; the photography and overall Visual Transformation gates remain blocked. No V4 production deployment or remote preview has been performed.

## Implementation

The vanilla one-page site now opens with supplied coffee-pour artwork, kinetic KOPI/KITA type and a separately composed portrait mobile scene. The menu is an editorial exhibition of all 30 exact original records, with local responsive photos, query-string filters, stable category/product fragments, focus management and individual source credits. The final scene reveals large Ismail Studio typography and working portfolio/contact links. The live studio contact section was inspected; no enquiry was submitted.

Native CSS, SVG and WAAPI provide the finite scene animations, product interactions, category transitions and controlled ticker. Pause, reduced motion, offscreen/document pausing and page lifecycle cleanup preserve usable static content. No React, GSAP, backend, analytics, paid service, checkout, fabricated venue or testimonial was added. Fictional status and the distinction between generated brand artwork and independent photography remain visible. Metadata describes an indexable fictional CreativeWork; production's V3 SEO has not been changed.

See [design decisions](V4-DESIGN-DECISIONS.md), [visual inspection](../reports/VISUAL-REVIEW.md), [skill ledger](../reports/skill-usage.md), [source review](../reports/PHOTO-SOURCING.md), [source-linked contact sheet](../reports/photo-contact-sheet.html), and `data/product-photos.json`.

## Hard release blocker

| Missing exact photo | Reason |
| --- | --- |
| Kopi O Kosong | Unsweetened local black kopi not verified; no sugar assumption made from another black-coffee photo. |
| Kopi C | Evaporated-milk variant and free reuse rights not verified. |
| Gula Melaka Latte | Exact paid-stock candidate cannot be used under the zero-cost condition. |
| Orange Espresso Tonic | Available coffee/tonic photo does not verify orange. |
| Coconut Cold Brew | Available coconut candidate is explicitly a rose variant. |
| Pandan Kaya Roll | Available pandan roll does not verify kaya filling. |
| Mango Fruit Tart | Available mango mini-pie does not depict the stated fresh-mango/vanilla-cream tart. |

The supplied photography checker fails with 49 field findings across these seven rows. The supplied visual checker fails on the unpassed photo/visual gates and missing V4 production verification. Those are deliberate truthful failures. `npm run deploy` now runs a fail-closed `release:gate` before Wrangler, preventing these missing items from becoming a nominally accepted release. Generated art, duplicated images and wrong recipes were not used to close the gap.

## Evidence and verification

| Check | Observed result |
| --- | --- |
| Handoff integrity before editing | PASS, 36 files and SHA256 checks. The photo checklist's execution columns were then updated; canonical text remains unchanged. |
| Canonical menu / source guards | `npm run verify` PASS: all names, descriptions, categories, displayed prices and 30 stable entries; anchors/assets, JS syntax, canonical and truthful CreativeWork schema. `data/menu-baseline.csv` and `wrangler.jsonc` unchanged. |
| Real static comparison / native scene frames | PASS for collection: paired 1440×900 and 390×844 public-V3/local-V4 opening, menu and studio captures; 30 actual 0/25/50/75/100% scene samples and recorded transforms. Overall visual acceptance remains BLOCKED by photos. |
| Design inspection | Final inspector 0 FAIL, 3 documented WARN at 1440/768/390. Source lint 0 FAIL, 0 WARN. Three inspected correction rounds. |
| Motion contrast | Edge and WebKit, 375/1440, actual frozen entrance/filter frames: opaque informative text and zero axe findings. |
| New interactions | Edge and WebKit reach all 79 initial controls in DOM order; native credits keyboard/reveal, global pause, conflicting deep links and 320/1440 text enlargement PASS. |
| Built preview | PASS at 375/1440: exact menu, filter, featured target, canonical, zero axe and JS errors. All 67 public hashes match the local candidate manifest; private/source paths return 404. This is local evidence. |
| Asset provenance | 23 genuine locally hosted photos, 46 WebP variants; source and license metadata plus all-30 contact sheet. Seven unresolved; photo gate FAIL. |
| Cloudflare packaging | Project-local Wrangler 4.151.0 assets-only dry run PASS, no bindings; existing pinned account/Worker/config preserved. No production write. |
| Production preservation | Current V3 reverified: commit `48fef5bcd98bf0881c49cace7a2f26334cfb14da`, all 60 public hashes, private/source 404 checks, zero recorded transport retries. |

### Final browser and performance receipts

The built candidate at `http://127.0.0.1:4175/` passed the final verification run. WebKit completed the full responsive and interaction sequence at 320, 375, 390, 430, 768, 1024 and 1440px, including all 30 exact menu rows, 30/6/9/7/8 filter counts, navigation and overflow checks. The first run's 1920px filter click hit a Playwright auto-scroll stability timeout after the menu and overflow checks had passed. The helper now scrolls that control into view instantly before a real pointer click; a focused 1920px retry passed all filters and shared keyboard, no-JavaScript, reduced-motion, 200% text and navigation checks. Its receipt is `artifacts/v4/final-webkit-desktop-final/results.json`. The final 375px/1440px and filtered axe scans report zero violations.

Final Edge and WebKit interaction runs each reached all 79 controls in DOM order and passed source-credit keyboard/fragment access, global pause, page lifecycle, conflicting deep links, 200% text and offline filter controls. Motion-contrast checks on the built candidate froze actual entrance/filter frames at 375/1440 in both engines; text stayed opaque and axe reported zero findings. The built-preview link check confirmed portfolio navigation by pointer and keyboard. No external runtime requests or JavaScript/HTTP errors were found. A WebKit placeholder-SVG request cancellation was recorded during teardown after visible images had decoded; it was not an HTTP failure.

Three paired Lighthouse 13.5 mobile runs used V3 at `127.0.0.1:4174` and the V4 source preview at `127.0.0.1:4173`. The median V3/V4 LCP was **2,350/2,806ms** (+456ms); median FCP was 930/1,114ms, and V4 CLS was 0 in all three runs. Median performance score was 78/72. Mobile TBT medians were 829/1,117ms, with large outliers for both versions, so the aggregate lab scores are noisy and are not field Core Web Vitals. The portrait hero remains the LCP element. Its visually reviewed q78 WebP was reduced from 166,924 to 111,846 bytes (33%) and lowered the earlier V4 mobile median LCP from 3,245 to 2,806ms while retaining the artwork's composition. One desktop pair measured V3/V4 LCP at 559/995ms; that single sample is too small to characterize desktop performance, and both values remained below one second.

The final source verifier passed, the rebuilt preview contains 67 public files, and `npx wrangler deploy --keep-vars --dry-run` passed with no bindings. `npm run release:gate` still fails closed on exactly the seven products in the table above. Because the photo and overall visual gates remain unpassed, no V4 deployment was attempted; production remains the verified V3 version. Earlier test attempts are retained as diagnostics: 320px/200% overflow was fixed, the native details summary was added to keyboard-order coverage, and explicit tab stops were restored for WebKit. Finite animations are settled only in static screenshot helpers because offscreen scene animations intentionally pause; the separate real-frame suite tests animation states.

## Production and recovery

Production URL: https://kopikita.ismailstudio.my/. It still serves V3. The preflight authenticated read identified existing account `44214a829e2337ca50cf40e4cd827cba`, Worker `kopikita`, current version `e4aab4da-cf56-44ba-b37c-6e61734d8883` and deployment `88185ca7-e5b7-4e31-9383-add013f85a09` at 100%. No unrelated project, DNS, billing, variable, secret or credential was changed. Git push is not treated as deployment evidence.

The exact V3 source is preserved on `codex/kopikita-v3-recovery`, at `48fef5bcd98bf0881c49cace7a2f26334cfb14da`, and in `artifacts/v4/v3-source.zip`. V4 uses `codex/kopikita-v4`. No rollback is currently needed because production was never replaced.

If a later V4 deployment needs recovery, first re-read the current scoped deployment. With the unchanged KopiKita configuration, restore the recorded V3 Worker version using project-local `wrangler rollback e4aab4da-cf56-44ba-b37c-6e61734d8883 --message "Restore verified KopiKita V3"`, then verify both the custom hostname and enabled workers.dev endpoint against the saved V3 manifest and browser journeys. Rollback is limited to this assets-only Worker; it does not require DNS changes, Worker recreation, force-push or a Git reset. Verify CLI help and actual version retention before acting.

## Finishing the release

Obtain seven genuinely matching, inspectable photographs and actual reuse permissions. Update only those records and their checklist execution fields; preserve every canonical menu string. Regenerate the menu, rerun the photography checker, inspect the completed contact sheet and gallery at matched viewports, refresh visual/source acceptance and complete the existing technical checks. Then commit/push the final verified source, build from the clean commit, pass `npm run release:gate`, deploy through the existing guarded script and independently verify production's release manifest, every asset hash, private paths, HTTPS, browser behavior and studio links. Until then, do not call V4 complete or deployed.
