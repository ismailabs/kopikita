# KopiKita MY — authorized production recovery in progress

The user authorized recreating the missing KopiKita-specific deployment and preserving `https://kopikita.ismailstudio.my/`. This supersedes the earlier prohibition on recreation and the historical blocked checkpoint below.

Repository history at `541ae32`, the original Wrangler configuration and saved live receipts identify Workers Static Assets, not Pages. Fresh account inspection found no matching Worker/Pages project or custom-domain mapping. No conflicting Worker route existed. The recreated `kopikita` Worker first deployed validated commit `1c219bf`; version `84eb8d2e-8fda-434b-9eed-81e788dadcc6`, deployment `4cabf1d4-6cca-454f-9c30-1b82f8525c15`. Cloudflare's custom-domain changeset then reported exactly one addition, zero updates/removals/conflicts. The hostname was attached with `override_existing_origin=false` and `override_existing_dns_record=false`; no shared zone setting or other project was changed.

Public Cloudflare/Google DNS resolves the hostname, but this machine's default resolver retains the earlier negative answer. Read-only QA can use an isolated public-DNS CONNECT tunnel with end-to-end TLS validation; no system DNS or router setting is changed. Such evidence is labeled separately from default-resolver checks.

Live Worker seven-width Edge tests and all 60 asset hashes PASS at `1c219bf`. The custom host exposed zone-level automatic Web Analytics injection, causing strict HTML hash failure. A KopiKita-only `_headers` response policy adds `no-transform` to prevent that injection without touching shared analytics. The build consumes this control file without listing it as a public asset. Browser verification now also records failed requests. Full custom-host acceptance will be rerun after this correction; production is not yet accepted in this checkpoint.

Raw recovery evidence is in `artifacts/recovery/`; exact final deployment and public acceptance receipts will replace the local `artifacts/RELEASE-REPORT.md` and `artifacts/PUBLICATION.json` after verification. Builds API inspection returns 403 with local OAuth, so automatic Git builds are unverified. The authenticated manual Wrangler deployment is the observed release mechanism.

---

# Historical blocked checkpoint

**BLOCKED — IMPLEMENTED, PRODUCTION BLOCKED.** Updated 2026-10-17. Wrangler authentication has recovered, but the existing production target is absent. This checkpoint supersedes the older authentication blocker and public-version observations in the historical validation record below.

## Current production evidence

Wrangler 4.151.0 successfully authenticated with the locally authorized OAuth session and reported account `44214a829e2337ca50cf40e4cd827cba`, matching the unchanged config. Credentials remained local and were not printed or committed. The separate connector still requires reauthorization; authenticated local API reads work.

- `wrangler deployments list --name kopikita --json`: error `10007`, Worker does not exist.
- Authenticated Worker/service inventories contain no KopiKita target. Settings return HTTP 404 / `10007`; service lookup returns HTTP 404 / `10090`.
- No KopiKita custom-domain mapping or matching Pages project exists. The account Workers subdomain still matches `mohamad-ismail-mohd-izwan`. Repository history identifies **Workers Static Assets**, not Pages.
- At `2026-10-17T07:29:09.126Z` (15:29 MYT), `https://kopikita.ismailstudio.my/` still failed DNS resolution (`ENOTFOUND`). An independent public DNS-over-HTTPS query returned status 3 / NXDOMAIN at `07:01:18Z`; the authenticated inventory was rechecked at 15:29 and still contained no KopiKita target or mapping.
- `https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/` returned Cloudflare HTTP 404 for `/release.json`. Neither endpoint currently exposes a release SHA.
- Only those two café URLs are established by repository evidence. A third café endpoint, current build trigger, deployment ID and hosted bindings cannot be verified while the target is absent. The external ISMAIL portfolio is not a third café deployment.

Sanitized local receipts: `artifacts/release-resume/cloudflare-before.json`, `cloudflare-discovery.json`, `public-current.json`, and `custom-dns.json`. The earlier `public-before.json` showed baseline `541ae32` at both hosts; that is historical, not current. No attribution is made for the target's absence.

## Source and current local validation

Approved implementation `b6385c2977ebd56cbc0b3ad5aefc693ddb4c8e74` is preserved on `codex/kopikita-redesign`, descended from main baseline `541ae3246a9ef69cf6da0025f2c00aece62664f0`. Fresh fetch and advertised remote refs matched; no newer shared source changes were found.

The resumed smoke check exposed a selected-to-unselected filter button whose simultaneous text/background colour transitions briefly fell below AA contrast. The sole product change removes that colour interpolation. The expanded regression freezes actual button transitions at their midpoint alongside existing first-frame animation checks. Menu data, layouts, images, scripts, deployment config and dependencies are unchanged from the approved implementation. Static checks confirm all **30 original names, descriptions, categories and prices**, distribution **30 / 6 / 9 / 7 / 8**.

Static verification and the 60-file build PASS. Built-site smoke at 375/1440 PASS with zero axe findings. The four-case 375/1440 Edge/WebKit motion/transition regression PASS. The fresh full Edge seven-width suite PASS (exit 0), including exact rendered menu, filters, keyboard, touch, reduced motion, fallback behavior and zero axe/script/resource errors. The fresh WebKit run produced captures from 320 through 1440 and a zero-finding mobile scan, but its process ended without a final result; it is PARTIAL, not a fresh full-suite pass. The earlier full WebKit run and current focused two-engine regression remain separately recorded evidence. An initial overlapping-build run hit an image decode error and is not counted as a pass; the successful Edge rerun used stable output.

The 30-row fixture was also freshly compared directly with the original Git HTML at `541ae32`; all four fields match. Fresh screenshots at `artifacts/release-resume/current-edge/` were visually reviewed at mobile/desktop hero, full mobile menu and desktop atmosphere. A parallel external-link run reached the portfolio by pointer and keyboard but timed out clicking the footer. The unchanged isolated rerun PASS (exit 0): pointer and keyboard both reached the real portfolio; the footer popup opened with null opener. Receipt: `artifacts/release-resume/external-isolated/results.json`. No test assertions or timeouts were relaxed.

Exact final feature SHA and independent advertised-remote comparison belong in local `artifacts/PUBLICATION.json` and `artifacts/RELEASE-REPORT.md` after committing; this source report cannot embed its own circular SHA. Main remains at the baseline until the existing target and deployment invariants are verified.

No account, Worker, Pages project, DNS record, domain mapping, route, binding, secret or build trigger was created, changed or deleted. PROWORKS and CIVOLYN were not modified. No main push, production deploy, cache purge or force push occurred.

## Current P0 acceptance

| Required gate | Current state |
|---|---|
| Correct clone/remote/ancestry and preserved work | PASS; feature history retained, scoped additive correction only. |
| All 30 immutable menu entries and category counts | PASS locally; production NOT TESTED because no café release is served. |
| Coherent responsive fictional café and truthful sections | PASS in fresh Edge seven-width checks and reviewed mobile/desktop captures. |
| Exact ISMAIL link and disclosure | PASS in fresh isolated pointer/keyboard/footer external tests and static disclosure checks. |
| Pointer/keyboard/touch, filters, focus and reduced motion | PASS in fresh full Edge and focused two-engine checks; fresh broad WebKit PARTIAL as documented. |
| Build/regression/staged smoke | Static/build/smoke/four-case contrast and full Edge PASS; broad WebKit limitation documented. |
| Source security and existing deploy scope | Reviewed staged whitespace/common-secret-pattern checks PASS; no hosted mutations. Hosted invariant BLOCKED by missing target. |
| Validated production publish, SHA/assets and custom host | BLOCKED; NXDOMAIN/HTTP 404, no new deployment ID. |
| Truthful report, evidence, limitations and recovery | PASS; current observations distinguished from historical evidence. |

## Required external coordination

The user confirmed they will restore or identify the existing KopiKita target. Resume after confirmation or a verified existing target dashboard URL/name. Do not create a replacement or change DNS to bypass the mismatch. Reinspect settings, mappings, bindings, secrets and main-branch Workers Builds integration; safely fast-forward validated source, push once, observe the build, then verify deployment ID, exact public SHA, every asset hash and live acceptance at every verified café endpoint.

Physical devices, manual screen readers and field performance remain untested; automated results are not WCAG certification. No rollback occurred because this session did not change production. Baseline `541ae3246a9ef69cf6da0025f2c00aece62664f0` is the prior source reference, not proof of an available rollback deployment.

---

# Historical redesign validation record

The following is the previous handoff. Its authentication and live-host statements are superseded above; implementation and test evidence remain useful history.

## Source and publication

- Local clone: `C:\Users\moham\OneDrive\Desktop\kopikita-my`.
- Exact authorized remote: `https://github.com/ismailabs/kopikita.git`.
- Baseline/rollback source: `541ae3246a9ef69cf6da0025f2c00aece62664f0`.
- Implementation branch: `codex/kopikita-redesign`; final revision is this branch's reviewed HEAD. The exact committed/pushed SHA and independent advertised-remote comparison are recorded in the local `artifacts/PUBLICATION.json`, final local report and delivery message. The report is part of that commit, so it does not embed its own circular commit hash.
- Main is held at the verified baseline; no force push, main merge, manual deployment, DNS modification or hosted setting change has occurred.
- Original user changes: the sole untracked input folder is preserved and ignored. No unknown source edits were overwritten. Generated dependencies from the interrupted install remain under ignored local artifacts.

## What changed

Rebuilt `index.html` and consolidated the stylesheet into `styles.css`; removed the superseded `refinements.css`. Added a live botanical wordmark, cinematic desktop hero, separate mobile cup crop, four exact-menu highlights, warm editorial story, readable full menu, dark atmosphere section and one studio endcap. Photography, responsive derivatives, social cover, favicon and licensed local fonts are credited in `ASSET-CREDITS.md`. Old source assets remain available as provenance.

`script.js` enhances menu/filter/hash/focus and motion. A small inline navigation controller binds before the first content paint to prevent the measured header shift. All links keep DOM order with explicit zero tabindex for WebKit. The 30-row CSV fixture and `tools/menu-contract.mjs` enforce immutable data. Tests cover genuine UI behavior and actual external navigation. Build/public verification remains allowlisted and now covers either public hostname plus source/private 404s. No runtime services, trackers or operational commerce were introduced.

Other changes: canonical/OG/robots/sitemap now use the independently reachable intended custom host, `noindex, follow` reflects the fictional project, and every portfolio href is exactly `https://ismailstudio.my/`. Added design decisions, optional unactivated measurement plan, testing and maintenance/runbook documentation.

## Every P0 criterion

| P0 Definition of Done criterion | Status | Evidence |
|---|---|---|
| Git baseline, remote, preserved user changes, scoped resource identity | PASS locally; hosted identity inspection BLOCKED | Root/remotes/fetched and advertised baseline match; only handoff untracked before edits; existing name/account pinned in unchanged config. Current authenticated Worker inspection is unavailable. |
| All 30 original names/categories/prices, original descriptions, distribution | PASS | CSV independently matched original Git HTML; static and rendered strict equality; 30 / 6 / 9 / 7 / 8 at exercised widths. No description exceptions. |
| Recognizable coherent responsive KopiKita, reachable truthful sections | PASS | Actual seven-width captures, section QA, all anchors verified; all referenced product names/prices are real baseline entries; no invented venue, customers, reviews, checkout or booking. |
| Exact ISMAIL destination, external tests, informative disclosure | PASS | Real pointer/keyboard navigation and footer popup to the portfolio; top banner/menu/studio/footer disclosures; target hrefs retain non-www as requested. |
| Pointer/keyboard/touch controls, filters/status, dismissal/focus, no-JS/reduced motion | PASS locally | Edge full suite, second-engine responsive checks, focused complete Tab-order/skip checks in both engines, touch emulation and script-failure cases. See TESTING for exact coverage. |
| Static/build/relevant tests and staged browser smoke actually pass | PASS locally | Clean npm ci, verify, Edge suite, targeted regressions, build, dry-run, built-site smoke, 60-file hash/privacy check. Early failed tests were investigated; corrected behavior and remaining platform limits are documented. |
| Security: no secrets, unsafe config/resources, force push or unrelated deletion; scoped deploy invariant | PASS for source; deploy invariant BLOCKED | Staged/history common-secret scan and whitespace checks; no forbidden indexed paths; config/package/lock unchanged. Hosted bindings/settings cannot be authenticated, so production is gated. |
| Publish validated commit; actual release SHA/hashes; independently checked intended hostname | BLOCKED | Both public hosts were checked and still served baseline release. No redesign production build/deploy receipt exists. Required authenticated Worker/Builds inspection cannot be completed. |
| Truthful end report, files/Git/URLs/tests/screenshots/performance/issues/rollback | PASS | This report, TESTING, design/provenance documents, local exact-SHA publication receipt, raw browser/axe/performance evidence and final message. |

## Validation and quality evidence

Executed command/results, failures and fixes are detailed in `TESTING.md`. Fresh screenshots are local under `artifacts/final-edge/` at 320/375/430/768/1024/1440/1920, including mobile/desktop sections. Baseline captures are under `artifacts/baseline/`. Compare visual hierarchy, cup crop, live type, exact prices, navigation, studio credit and fictional disclosure rather than copying invented board text. The provided boards are not implementation screenshots.

Axe scans found zero issues after correcting the studio caption contrast. Edge 155 and WebKit 27.2 completed the full seven-width suites successfully; the complete keyboard sequence also passed separately in both engines. Post-commit smoke then exposed transient contrast during a filter fade; freezing the first frame reproduced 102 findings. A follow-up correction removes text opacity from both motion effects, with a dedicated two-engine first-frame regression plus rebuilt smoke. 320px plus 200% text overflow was fixed. WebKit required waiting for the actual asynchronous responsive reset and explicit zero tabindex for links; neither assertion was simply removed. The hidden skip-link screenshot artifact was corrected. Initial npm install overlap, axe's explicit-context requirement and Firefox's Windows launch failure are retained in the evidence rather than misrepresented as passes.

Performance: Lighthouse 13.5/Edge 155, local simulated mobile, three paired trials plus one desktop pair. Raw medians: mobile performance 74→85, LCP 1.96→2.32s, FCP 1.48→2.16s, TBT 894→417ms, CLS 0→0. All three revised mobile CLS values are zero after fixing a pre-fix value up to 0.199. Desktop performance 100→100. One pair overlapped a short targeted test completion; host variance was large. Trials preceded the final opacity-only contrast correction; no performance benchmark of that follow-up commit or hosted release is claimed. This is not proof of a reliable speedup. Added licensed local fonts and richer photography have a loading cost. SEO 69 follows intentional noindex; accessibility/best practices 100 in those lab runs. No field/INP or conversion claims.

P1 limitations: no physical devices, manual screen readers, real Safari/iOS hardware, browser chrome zoom control or field performance. CSS 200% text and touch emulation were tested. Firefox could not start due to Windows side-by-side configuration. No remote preview was created because authenticated Worker invariants could not be checked; robust local allowlisted staging was used.

## Public targets and precise blocker

- Intended canonical: `https://kopikita.ismailstudio.my/`.
- Existing Worker endpoint: `https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/`.
- Worker target from configuration: `kopikita`, account `44214a829e2337ca50cf40e4cd827cba`.
- Connector: `UNAUTHORIZED`, reauthentication required, `oauth_token_invalid_grant`.
- Wrangler: no authenticated session; noninteractive commands require a scoped API token. No token was requested in chat or exposed.
- User confirmed Cloudflare cannot be reconnected now. Build/deployment IDs, current hosted bindings/settings and Workers Builds trigger are therefore UNKNOWN, not inferred safe from previous documentation.

The handoff's `06-TECHNICAL-AND-DEPLOYMENT.md` requires authenticated identity/binding inspection before main publication. Holding main is this mandatory gate, not another request for routine code/Git approval.

## Resume and rollback

Reconnect Cloudflare or authenticate Wrangler securely outside chat. Inspect the existing account/Worker, bindings/secrets/settings/custom hostname and exact main-branch build/deploy command. Fetch remote state and verify a safe fast-forward. Publish the reviewed feature commit to main only after the invariant holds, observe the existing automatic build, and avoid duplicate manual deployment. Rebuild that exact commit, compare release manifests and all 60 hashes at both public hosts, run production browser/external suites, capture actual build/deploy IDs, then update acceptance.

No production rollback is presently needed because the redesign was not released. The known prior source is baseline `541ae3246a9ef69cf6da0025f2c00aece62664f0`. After a future release, prefer reverting the redesign through a normal new commit and the existing build pipeline, or a verified prior Worker deployment through its authenticated rollback controls. Do not reset/force-push history or guess deployment IDs.
