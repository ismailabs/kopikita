# KopiKita V4 release record

20 October 2026. The photography blocker is resolved under the user's representative-photography clarification. Final Git publication and production verification are pending below; this intermediate record does not claim deployment.

## Implementation and visual acceptance

The existing V4 work is preserved: supplied illustrative coffee-pour artwork, kinetic KOPI/KITA typography, a separate portrait mobile composition, a photographic 30-item exhibition, and the large Ismail Studio finale. Native CSS and Web Animations API provide scene entrances, image/arrow feedback, filtering transitions and a pausable ticker. Scrolling stays native. No runtime framework, backend, paid service, tracking or ordering flow was added.

The Visual Transformation Gate passes on inspected, matched V3/V4 hero, menu and studio captures at 1440x900 and 390x844. The current run also records five actual animation states for each of the three signature experiences at both sizes, with fully opaque informative text. Composition, typography, artwork, menu discovery and studio conversion are visibly different; no subjective score substitutes for those captures. See [visual review](../reports/VISUAL-REVIEW.md).

All 30 original menu names, descriptions, categories, prices and IDs remain exact. The gallery has 30 distinct genuine photographs and 60 self-hosted WebP derivatives. Wider layouts use paired 4:3 cards; phones up to 480px use one column and 6:5 crops. Visible disclosure identifies independent representative images and says KopiKita prepared and photographed none of the products. Generated hero/print artwork is separately disclosed and never counted as photography.

## Sources and licenses

The final four products use LeonardKong's Penang black kopi, Sharon Hahn Darlin's Ipoh kopitiam coffee, Peachyeung316's pandan Swiss roll, and Jimmy Liao's fresh-mango tart. Their source pages, precise licenses, source-byte hashes, crops and representation limits are in [PHOTO-SOURCING.md](../reports/PHOTO-SOURCING.md), [the contact sheet](../reports/photo-contact-sheet.html) and `data/product-photos.json`. Public product and footer credits preserve title, creator, source, license and modification notices. CC BY-SA image derivatives retain their applicable license separately from the site code.

Sugar, exact milk ingredient and filling/cream recipe are not asserted from images. Those limits follow the user's explicit clarification; menu text is unchanged. No photograph was generated or purchased. Assets and tooling used for this work required zero additional cost.

## Verification

| Gate | Actual result and receipt |
| --- | --- |
| Source/content/SEO | `npm run verify` PASS: 30 exact records; 6/9/7/8 categories; stable anchors/assets; JavaScript syntax; canonical; indexable fictional CreativeWork; approved studio/credit destinations and disclosures. |
| Photography | Handoff `check_product_photos.py --repo-root .` PASS: 30 rows, 30 baseline rows, zero gaps. Independent audit verified 60 integrated WebPs, 30 unique source hashes, matching credits and four new original-image hashes. |
| Chromium | `artifacts/browser/results.json`: Edge 155.0.4283.62 at 320/375/390/430/768/1024/1440/1920; exact rows, decoded images, filters, navigation, ticker, keyboard/skip, touch, reduced motion, no-JS/blocked-script fallback and 200% text PASS. Zero axe findings, JS/HTTP errors or external runtime requests. |
| WebKit | `artifacts/v4/webkit-photo-final-desktop/results.json`: WebKit 27.2 at 768/1024/1440/1920 and shared mobile navigation, filtered axe, keyboard/skip, reduced motion, no-JS/blocked-script and 320/1440 text-enlargement checks PASS. A preceding run completed 320/375/390/430 before a 768px pointer-stability timeout; its successful captures remain in `artifacts/v4/webkit-photo-final/`. The retry passed without production changes or weaker assertions. One obsolete responsive image request was cancelled; visible images decoded. |
| Visual/native scenes | `artifacts/v4/visual-final/results.json`: matched captures plus 30 real frames. Full 30-photo contact sheet and desktop/tablet/phone captures inspected. |
| Design inspector | `artifacts/v4/taste-photos-release/report.json`: 0 FAIL, 3 defended WARN at 1440/768/390; every listed sheet inspected. Approved palette/type/label/numbering allowances and intentional decorative ticker clipping are documented in the visual review. No broken-image allowance. Earlier retries are retained, not represented as passes. |
| Source lint | Taste lint: 0 FAIL, 1 WARN for em-dash separators, largely in provenance credits and preserved content. |
| Packaging | `npm run build`: 74 allowlisted public files plus `release.json`. Project-local Wrangler 4.151.0 `deploy --keep-vars --dry-run` PASS, no bindings. `artifacts/v4/wrangler-dry-run-photos-30.txt`. |
| Skills | [Skill ledger](../reports/skill-usage.md) records contributions and brief-specific overrides. |

The generic Taste scene runner found no pinned `section.scene` elements. It is not counted as signature-scene proof; the dedicated native-frame suite is applicable. Required photo credits and the approved palette/poster direction are preserved. The decorative ticker is intentionally clipped inside its window; its real movement, seam, pause, offscreen behavior and accessibility have independent assertions. Actual headings remain readable in inspected frames.

## Final performance review

Lighthouse 13.5.0 / Edge 155.0.4283.62 ran three alternating mobile pairs and one desktop pair after other browser suites completed. The V3 server's HTML, CSS and JavaScript were independently matched to recovery commit `48fef5bcd98bf0881c49cace7a2f26334cfb14da`. Raw reports, traces and timestamps: `artifacts/v4/perf-final/summary.json`.

| Local lab metric | V3 | V4 |
| --- | ---: | ---: |
| Mobile median Performance | 79 | 76 |
| Mobile median LCP | 2,360ms | 2,885ms |
| Mobile median FCP | 1,036ms | 1,183ms |
| Mobile median TBT | 791ms | 786ms |
| Mobile CLS, all three runs | 0 | 0 |
| Desktop Performance, one pair | 99 | 95 |
| Desktop LCP, one pair | 518ms | 789ms |
| V4 Accessibility / Best Practices / SEO | — | 100 / 100 / 100 |

V4's mobile LCP is about 525ms slower. This is a documented trade-off for the substantially richer opening, not a claimed speed improvement. The high-priority portrait WebP is 111,846 bytes; gallery images are responsive/lazy. The representative third trace has 12 requests, about 461KB transferred, one 9.6KB runtime script, and most main-thread work in rendering/layout rather than script parsing. One V4 mobile run scored 49 with 4.70s LCP; the other two scored 77/76 with 2.86/2.88s LCP. V3 also had noisy timing outliers. All samples are retained. These local simulated measurements are not field Core Web Vitals or INP evidence; the single desktop pair is not a distribution.

## Publication and production

Pending the release commit and live receipts. Preflight confirmed existing account `44214a829e2337ca50cf40e4cd827cba`, Worker `kopikita`, enabled custom domain `kopikita.ismailstudio.my`, zone `ismailstudio.my`, compatibility date `2026-10-12`, and no bindings. Before V4, version `e4aab4da-cf56-44ba-b37c-6e61734d8883`, deployment `88185ca7-e5b7-4e31-9383-add013f85a09`, served 100% of traffic. Readback: `artifacts/v4/cloudflare-preflight.json`.

Production acceptance requires the public commit manifest and every file hash to match the committed build, private paths to return 404, HTTPS/SEO to work, and live browser/studio-link checks. A Git push alone is not deployment proof. The build excludes reports, handoffs, skills, tools, dependencies, source manifests, Git data and secrets. Cloudflare consumes `_headers`; its `no-transform` control preserves exact bytes and prevents analytics injection.

## Exact rollback

The recovery branch `codex/kopikita-v3-recovery` preserves V3 commit `48fef5bcd98bf0881c49cace7a2f26334cfb14da`. The provider version above was freshly confirmed before V4. From this repository:

```sh
npx wrangler rollback e4aab4da-cf56-44ba-b37c-6e61734d8883 --name kopikita --message "Restore verified V3 release" --yes
```

Then verify canonical and existing workers.dev hosts against the saved V3 release manifest and re-run public browser checks. Rollback creates a new deployment serving that version across existing routes; connected resource data is not restored. This assets-only Worker has no storage/database bindings. If provider retention later removes the version, use a separate clean checkout of the recovery commit and its documented build/verification/deploy workflow. Never reset or force-push the current branch. [Cloudflare rollback reference](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

## Limits

Windows browser automation uses emulated viewports/touch/text enlargement. Physical devices, a manual screen-reader audit, browser-chrome zoom, field INP/CrUX and full WCAG certification are not established. Independent photo vessels, lighting and source resolution vary and ingredient details remain representative. No enquiry was sent and no business conversion, real venue or operating café is claimed. The common-pattern secret scan is not a Gitleaks audit. Delivery items marked pending above must be completed before the goal is finished.
