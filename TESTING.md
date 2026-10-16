# KopiKita redesign — executed validation

17 October 2026, Malaysia. This report distinguishes local evidence from production acceptance. **Production publication is blocked by Cloudflare authentication.**

## Baseline

Verified local root, `origin=https://github.com/ismailabs/kopikita.git`, `main`, local/fetched/advertised SHA `541ae3246a9ef69cf6da0025f2c00aece62664f0`. The supplied handoff was the only untracked folder; it was preserved and ignored. Its manifest matches all 31 present listed files; its listed short-prompt file is absent. No other source changes were present.

Captured fresh local, custom-host and workers.dev screenshots at 375/1440px. Both public hosts returned 200, served 30 items and had the old workers.dev canonical. Both public `/release.json` documents identified the baseline SHA. `https://ismailstudio.my/` successfully redirected to `https://www.ismailstudio.my/`.

The original browser suite passed at 320/375/430/768/1024/1440 before edits. All four menu fields in the handoff CSV were separately compared with original Git source and matched exactly.

## Commands and observed results

| Check | Observed result |
|---|---|
| `npm ci` | PASS: 151 packages, 152 audited, zero known vulnerabilities. An initial overlapping install attempt failed with ENOTEMPTY; its task-owned installer was stopped and generated dependencies preserved under ignored artifacts before the clean install. |
| `npm run verify` | PASS: exact 30 original names, descriptions, categories and prices; distribution 30/6/9/7/8; anchors, assets, metadata, noindex, exact ISMAIL URLs, disclosure and both inline/external JS syntax. |
| `npm test` (Edge 155.0.4283.45) | PASS: seven widths, all five filters, exact rendered menu data, featured-to-menu focus/category, mobile navigation/Escape/outside dismissal/destination focus, responsive reset, actual marquee frames and seam, pause/resume, live reduced motion, no-JS, blocked main script, 200% text at 1440 and 320, skip link, touch emulation and no JS/resource failures. |
| Additional focus checks, Edge and WebKit | PASS: every visible link/button in document Tab order, visible skip focus and activation; keyboard toggle/Escape/focus return; Space filtering; hidden hash target reveal. Explicit tabindex=0 fixed the WebKit port's native-link Tab behavior without positive tabindex or dropping the assertion. Fresh pages avoid WebKit's focus restoration on same-URL navigation. |
| WebKit 27.2 full responsive/interaction/axe suite | PASS at all seven widths, including complete Tab order and skip activation. Initial runs exposed asynchronous resize delivery and link-tabbing differences, both investigated and corrected. Final receipt: `artifacts/final-webkit/results.json`; do not infer physical Safari/iOS coverage. |
| `node tools/external-check.mjs` | PASS: actual studio navigation by pointer and keyboard to the live portfolio, plus protected footer popup with null opener. |
| `npm run build` | PASS: 60 allowlisted public files, reproducible text normalization and release manifest. |
| `npx wrangler deploy --dry-run` | PASS: static-asset upload prepared; no bindings found locally; no deployment occurred. This does not inspect hosted bindings. |
| Built-site smoke, port 4175 | PASS: 375/1440px, exact menu, filters, highlighted row, custom canonical, zero axe findings and JS errors. |
| `node tools/motion-contrast-check.mjs` | PASS: actual filter/entrance animations frozen at their first frame, zero axe findings at 375/1440 in Edge and WebKit. The source now uses movement only; text remains fully opaque. Receipt: `artifacts/motion-contrast/results.json`. |
| Built-site hash/privacy verification | PASS: 60/60 file hashes match; docs, tools, CSV, handoff, Git config and environment paths return 404 from the allowlisted staging server. |
| Staged whitespace and secret-pattern/history scans | PASS after removing trailing whitespace from a font license without changing its text. No generated/private paths or common secret patterns in the reviewed staged scope/history. |
| Production deployment/acceptance | BLOCKED: connector reauthentication required (`oauth_token_invalid_grant`); Wrangler has no authenticated session/API token. User confirmed reconnect is unavailable. No main push or manual deploy is authorized past the brief's unverified Worker invariant gate. |

## Accessibility and visual review

Axe 4.13, WCAG 2 A/AA, 2.1 AA and 2.2 AA tags: zero findings on completed desktop/mobile, open-navigation and filtered-menu scans. One observed 4.42:1 studio eyebrow contrast failure was corrected. This is not a complete WCAG conformance claim.

Inspected actual 320/375/430/768/1024/1440/1920 layouts and mobile/desktop section captures: live heading breaks, hero cup crop, four real featured items, menu prices/descriptions, arched story photograph, dark atmosphere, truthful studio invitation and footer. Corrected 320px/200% text overflow in headings, buttons, grid sizing and decorative wordmark. Corrected a hidden skip-link capture artifact using clipping rather than a negative fixed offset. A check of the committed build exposed intermittent contrast during opacity animation: pausing the actual filter at its first frame reproduced 102 failing nodes, including 2.17:1 category labels. Removed text fading from filter and entrance effects, retaining translation and reduced-motion handling; the dedicated regression scans the real paused animations. No-JS content remains complete; blocked main JS retains early working navigation and hides inactive filters.

200% checks enlarge text with CSS; they are not a claim of testing the browser chrome's zoom control. Touch coverage is browser emulation, not a physical phone. Manual screen readers, physical hardware and field INP were not tested. Firefox could not start because its Windows side-by-side configuration is incorrect (`spawn UNKNOWN`); WebKit supplied the second-engine coverage.

## Performance evidence and tradeoffs

Lighthouse 13.5.0, installed Edge 155, loopback HTTP, default simulated mobile throttling. Three alternating paired mobile trials and one paired desktop trial; raw JSON retained. The first revised pair overlapped completion of a short targeted browser check, so the set is not uniformly isolated. Later pairs had no other test browsers active. These trials preceded the final opacity-only contrast correction; no performance run of that final follow-up commit or hosted release is claimed. Host variance was substantial; these numbers do not establish a reliable speedup or field performance.

| Mobile metric, median of the three recorded final trials | Original | Redesign |
|---|---:|---:|
| Performance | 74 | 85 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 69 |
| FCP | 1.48 s | 2.16 s |
| LCP | 1.96 s | 2.32 s |
| TBT | 894 ms | 417 ms |
| CLS | 0 | 0 |
| Speed index | 1.75 s | 2.40 s |

Raw mobile performance: original 88/74/73; redesign 72/86/85. Redesigned LCP: 3.66/2.32/2.24 s. Desktop performance: 100 for both; LCP 0.61→0.68 s; redesigned CLS 0. The first pre-fix candidate had mobile CLS up to 0.199: navigation initialized after first paint and font-driven wrapping contributed. Early navigation binding and font preloads removed it in all three final mobile trials. Richer local imagery and 86 KB of licensed local fonts are deliberate costs; FCP/LCP/speed index did not all improve. No runtime framework or tracking package was added.

SEO 69 is intentional: `noindex, follow` prevents the fictional portfolio café from being indexed. Other metadata is coherent. This should not be 'fixed' by falsely presenting an operational café or dropping the fictional indexing boundary. There are no field Core Web Vitals or conversion-uplift claims.

## Evidence locations (local, ignored)

- `artifacts/baseline/`: original local/custom/Worker screenshots, live identity receipts, handoff integrity.
- `artifacts/baseline-suite/results.json`: fresh original suite.
- `artifacts/final-edge/`: final responsive screenshots, axe reports and result JSON.
- `artifacts/final-webkit/`, `artifacts/webkit/`: second-engine screenshots and scans; original failed attempts are retained rather than hidden.
- `artifacts/external/`: real portfolio navigation receipts and screenshots.
- `artifacts/staging/`: built-site smoke results and screenshots.
- `artifacts/staging-motion-fixed/`, `artifacts/motion-contrast/`: rebuilt smoke and the first-frame transition regression after the follow-up contrast correction.
- `artifacts/performance-redesign/`: pre-fix trials; `artifacts/performance-final/`: all revised raw trials and summary.
- `artifacts/production/assets-127.0.0.1.json`: **local staging** hash/privacy receipt, identified by its explicit base URL, not production proof.
- `artifacts/PUBLICATION.json` and `artifacts/RELEASE-REPORT.md`: exact final feature SHA, advertised remote comparison, current public release observations and final P0 report.

## Production gate

Reconnect the Cloudflare plugin or authenticate Wrangler securely outside chat. Inspect account `44214a829e2337ca50cf40e4cd827cba`, existing Worker `kopikita`, current bindings/settings/custom domain and Workers Builds trigger/deploy command. Confirm no configuration loss, fetch and check ancestry, fast-forward reviewed source to main only when safe, then observe its existing automatic build. Do not duplicate it with a manual deploy. Rebuild the exact committed source, compare `/release.json` plus all public hashes on both public hosts, and run production browser/external smoke before changing the report to DONE.
