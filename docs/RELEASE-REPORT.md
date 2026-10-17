# KopiKita MY — production acceptance

**PRODUCTION COMPLETE — VERIFIED.** Application acceptance checked 2026-10-17T08:06:23.708Z.

## Verified destinations and release

| Destination | Acceptance |
|---|---|
| https://kopikita.ismailstudio.my/ | Canonical production URL; HTTPS, exact manifest and all 60 public hashes PASS; full seven-width Edge journey PASS. |
| https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/ | URL independently reported by Wrangler; HTTPS, exact manifest, all 60 public hashes, seven-width Edge journey and 375/1440 smoke PASS. |
| Any additional historical URL | UNRESOLVED; no Pages URL, www alias or third café endpoint is invented. |

Accepted application commit: **2b15599324b45bf23f2bbd8b1c410f3c107c3178**, integrated by fast-forward into **main** from **codex/kopikita-redesign** in https://github.com/ismailabs/kopikita. Application Worker version: **35c40053-ea12-42ff-b5b1-04cf9d2ac944**; deployment: **af085ca4-092c-418c-bf8d-6109a71a8bf8**, 100% traffic. The final acceptance-document commit changes no public file hashes; its exact deployed HEAD, version and deployment ID are recorded after publication in local artifacts/RELEASE-REPORT.md and artifacts/PUBLICATION.json, and verified through public /release.json. This avoids embedding a circular self-commit hash.

## Hosting investigation and scoped restoration

The initial README at 8b11de8 recommended Pages but explicitly said the intended domain was not configured/published. That is not evidence of an actual Pages deployment. By 541ae32 the repository had a pinned Workers Static Assets config and documented authenticated Workers Builds integration. Saved live HTML, screenshots and release receipts show the same café at the custom and workers.dev hosts. The latest verified historical arrangement was therefore Workers; no historical Pages deployment is established.

Fresh authenticated inspection found no KopiKita Worker, service, Pages project or custom-domain mapping, and no conflicting Worker route. The user then explicitly authorized recreating the missing KopiKita target and configuring the canonical subdomain. Worker kopikita was recreated in account 44214a829e2337ca50cf40e4cd827cba, tag ac70fa7b1f354bdaa501a7588449e8a4. Cloudflare's domain plan reported one addition, zero updates/removals/conflicts. Attachment used override_existing_origin=false and override_existing_dns_record=false. No apex, wildcard, nameserver, MX, PROWORKS, CIVOLYN or unrelated resource was targeted.

The observed release mechanism is authenticated manual Wrangler deployment with --keep-vars and the existing npm build hook. New Worker settings have no bindings/secrets. Workers Builds API reads returned 403 with local OAuth; automatic Git deployment is unverified and not claimed. No build token or shared integration was created.

## Released application and production correction

The approved warm editorial redesign, local licensed fonts, synthetic responsive photography, progressive navigation, full menu, featured links, atmosphere section and tasteful ISMAIL endcap are preserved. All **30 original names, descriptions, categories and prices** exactly match original Git HTML and the locked CSV: **6 local / 9 espresso / 7 iced / 8 bakes**, 30 total. All content remains available without JavaScript, with visible fictional disclosures and no operational ordering, booking or payments.

The resumed work corrected transient filter-button contrast. Live custom-host verification then found inherited Cloudflare Web Analytics injection changing HTML bytes. A Worker-local _headers policy now sends public, max-age=0, must-revalidate, no-transform, preventing that injection without changing shared analytics settings. All public bytes now match the local committed build. The consumed _headers control file, source, docs, data, Git and environment paths return 404. No runtime tracker or backend was added.

## Every mandatory P0 gate

| Gate | Result and authoritative evidence |
|---|---|
| Correct Git baseline, remote, preserved user work and scoped identity | PASS. Baseline 541ae32, approved b6385c2, tested 1c219bf and accepted application revision above remain ancestors. Fast-forward integration and normal pushes only; handoff preserved/ignored. Account/Worker/hostname inspected and creation explicitly authorized. |
| All 30 original menu fields and distribution | PASS. Original Git HTML equals CSV equals source; live rendered strict equality at all seven widths; counts 30/6/9/7/8. |
| Coherent responsive fictional café and truthful reachable sections | PASS. Actual canonical-host 320/375/430/768/1024/1440/1920 captures, no overflow; visual review of mobile/desktop hero, menu, atmosphere and studio endcap. |
| Exact ISMAIL links and disclosure | PASS. Live pointer and keyboard navigation via exactly https://ismailstudio.my/ reaches the real portfolio; footer popup has null opener. Disclosures remain visible. |
| Controls, pointer/keyboard/touch, filters/status, focus, fallback and motion | PASS. Full live Edge journeys, exact featured destinations, navigation dismissal/Escape/focus return, complete DOM Tab order, touch emulation, no-JS/blocked-main-script fallback, 200% text and reduced motion. |
| Real build, tests and staged/live smoke | PASS. Static verification, dry runs, generated types, full live Edge, 375/1440 live smoke, four live Edge/WebKit paused-motion axe cases and exact hosted byte checks. All completed axe scans have zero findings. |
| Security, secrets, safe source and scoped deploy invariant | PASS. Reviewed staged whitespace/common-secret-pattern/history scans; allowlisted publication; private/control paths 404; no force push, secret exposure, unrelated deletion or shared-zone change. The Worker has no user bindings. |
| Production publish from validated source; exact SHA/assets and canonical host | PASS. Authenticated deployment records, enabled custom hostname, real TLS/public DNS and manifest/hash comparisons at both verified URLs. Final exact-HEAD receipt is regenerated after the documentation-only publication. |
| Truthful report, files/Git/URLs/tests/screenshots/performance/issues/rollback | PASS. This report, TESTING.md, README, ASSET-CREDITS, raw local receipts and exact final publication report. |

## Network, accessibility and evidence scope

Cloudflare and Google public DNS resolve the custom hostname. This machine initially retained its earlier NXDOMAIN answer; those failed default-transport diagnostics are retained. The default resolver recovered naturally at 2026-10-17T08:05:51.865Z, and ordinary-network canonical verification now also passes all 60 hashes and private-path checks. Canonical-host QA used an isolated loopback CONNECT tunnel resolving through 1.1.1.1/8.8.8.8. Browser HTTPS remained end-to-end with normal certificate validation; Node hash checks also used public DNS and TLS validation. No IP was hardcoded, HTTP response rewritten, TLS check bypassed, or system/router DNS setting changed. Fresh browser contexts required real network loads. Both endpoints were additionally verified through the default resolver after propagation. The earlier transport workaround is disclosed and is not substituted for the final ordinary-network checks.

Full final canonical browser run: zero script, HTTP and unexpected failed-request errors; zero image cancellations. An earlier stricter run recorded responsive image cancellations during resize; these are now separately logged while visible-image decoding and genuine request failures remain mandatory. The earlier pre-recovery full WebKit run was partial; current **live WebKit coverage is the focused 375/1440 contrast/motion scans**, not a claim of a full live Safari/iOS suite. Automated axe is not WCAG certification. Physical devices, manual screen readers, browser-chrome zoom and field INP were not tested.

## Performance

One isolated live simulated-mobile Lighthouse 13.5.0 / Edge 155.0.4283.45 run through the recorded QA transport: performance 59, accessibility 100, best practices 100, SEO 69; LCP 3.03s, FCP 1.26s, TBT 5465ms, CLS 0. This is one lab observation, not field data or a reliable before/after comparison. SEO reflects intentional noindex, follow for a fictional portfolio concept. Historical local three-pair medians were baseline 74 vs redesign 85, LCP 1.96 vs 2.32s, CLS 0 vs 0; variance and richer imagery/fonts were documented, and no speedup/conversion claim is made.

The byte-identical Worker endpoint was then measured once through the default resolver: performance 78, accessibility 100, best practices 100, SEO 69; LCP 2.56s, TBT 775ms, CLS 0. The canonical trace attributed about 6.25s to Other/unattributable work, about 1.34s to style/layout and only 0.13s to script evaluation; boot-up was about 0.1s, with no unused-JS finding. The samples show substantial environment/transport sensitivity, not a proven causal diagnosis. High lab blocking time remains a limitation, and neither sample establishes field performance or a speedup. No blind application/design change was made from this noisy measurement.

## Evidence and rollback

Raw local evidence under artifacts/recovery/: preflight.json, domain-plan.json, domain-attachment.json, created-worker.json, cloudflare-live.json, dns-after.json, accepted-custom-hashes/dns-transport.json, final-custom-edge/results.json and screenshots/axe, live-worker-edge/results.json, live-worker-smoke/results.json, live-motion/results.json, live-external/results.json, live-performance/mobile.json and summary.json, worker-performance/mobile.json and summary.json, default-resolver-latest.json. Hosted hash receipts are artifacts/production/assets-<hostname>.json. Exact final revision/deployment and post-publication checks are in artifacts/PUBLICATION.json and artifacts/RELEASE-REPORT.md.

No rollback was needed. Verified fallback version **35c40053-ea12-42ff-b5b1-04cf9d2ac944** is the accepted application revision. After a later regression, inspect current state and use npx wrangler rollback 35c40053-ea12-42ff-b5b1-04cf9d2ac944 --name kopikita with a reviewed reason, or a normal source revert/new deploy. The old deleted Worker's IDs must not be guessed or reused. Preserve the hostname and do not reset/force-push Git history.

No further user authorization or account action is required for this completed manual release. Future automatic Git builds require separately verified integration; they are not part of the success claim.
