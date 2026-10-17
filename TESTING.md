# KopiKita MY — executed production validation

Production acceptance: **PASS**, with the network/browser scope below. Detailed P0 acceptance and hosting history are in docs/RELEASE-REPORT.md. Accepted application revision: 2b15599324b45bf23f2bbd8b1c410f3c107c3178; the final acceptance-document commit preserves all 60 public file hashes.

| Executed check | Observed result |
|---|---|
| npm run verify; original Git/CSV/source comparison | PASS; exact 30 original names/descriptions/categories/prices, 30/6/9/7/8, metadata, noindex, anchors, assets, disclosures and script syntax. |
| Build, Wrangler dry run and generated project types | PASS; 60 public files plus release manifest; _headers consumed privately. |
| Canonical-host full Edge 155.0.4283.45 suite | PASS at 320/375/430/768/1024/1440/1920; exact menu, all filters, navigation/dismissal/focus, featured links, touch, keyboard/skip, 200% text, no-JS, blocked-main-script fallback, reduced motion and actual marquee. Zero axe, HTTP, script or failed-request findings; final image cancellations: 0. |
| Worker-host full Edge suite and post-correction 375/1440 smoke | PASS; identical public file bytes, all menu fields, interactions, canonical metadata and zero axe/script errors. |
| Live paused-motion contrast, Edge and WebKit 27.2 | PASS, four cases: 375/1440 in each engine; zero axe findings. This is focused WebKit coverage, not a full live Safari/iOS suite. |
| Live external ISMAIL pointer, keyboard and footer popup | PASS; exact source href https://ismailstudio.my/ redirects to the real portfolio; footer opener is null. |
| Both public /release.json and all 60 file hashes | PASS; private/source/control paths 404; no-transform header present and no injected analytics HTML. |
| Reviewed staged whitespace and common-secret-pattern/history scans | PASS; generated/private/handoff paths excluded. This is not described as a Gitleaks audit. |
| Public DNS and TLS | PASS via independent public resolvers and fresh public-DNS QA transport; the default resolver later recovered naturally (2026-10-17T08:05:51.865Z) and canonical ordinary-network hash checks PASS. No system DNS/cache change or TLS bypass. |
| Isolated live mobile Lighthouse | One measured lab run: performance 59, accessibility 100, best practices 100, SEO 69; LCP 3.03s, TBT 5465ms, CLS 0. Not field data or proof of speedup. |

## Failures diagnosed and corrected

The resumed button transition briefly reached 3.91:1 contrast; removing colour interpolation and retaining opaque moving text fixed it. Strict custom-host hashing then found inherited zone analytics injection; the Worker-only no-transform response policy removed it without modifying shared analytics settings or relaxing hash comparison. An early request-failure scan recorded browser-cancelled responsive image requests during resize. Such image cancellations are recorded separately while every visible image must decode and all genuine failures remain fatal; the final full run recorded none. A parallel external footer click timed out; the isolated unchanged rerun passed, with no timeout/assertion relaxation. Earlier overlapping builds caused a decode failure; final production tests used stable hosted output.

## Evidence and limitations

Current raw evidence is under artifacts/recovery/ (see the release report's exact paths). During propagation, canonical requests used a process-local public-DNS CONNECT tunnel with end-to-end TLS validation because the default resolver returned an old negative answer. The default resolver then recovered naturally, and ordinary-network canonical verification passed as well. The transport does not rewrite HTTP, hardcode an IP or change system/router settings. Worker endpoint checks also passed normally. Every result names its actual base URL; local staging is never called production.

Actual mobile/desktop hero, full menu, atmosphere and studio screenshots were reviewed. Physical phones, manual screen readers, browser-chrome zoom and field INP are untested. CSS 200% text and touch emulation are covered. The original full local WebKit suite passed before follow-ups; a fresh broad local rerun later ended without a result and is PARTIAL. Current live WebKit evidence is focused and labeled. No full WCAG, real-device, conversion or field-performance claim is made.

Historical local Lighthouse medians (three pairs, with documented host variance) were performance 74→85, LCP 1.96→2.32s, FCP 1.48→2.16s, TBT 894→417ms, CLS 0→0. Richer imagery/local fonts have a loading cost, and these older trials are not a comparison against the final public run.

## Public performance diagnostic

The byte-identical Worker endpoint was then measured once through the default resolver: performance 78, accessibility 100, best practices 100, SEO 69; LCP 2.56s, TBT 775ms, CLS 0. The canonical trace attributed about 6.25s to Other/unattributable work, about 1.34s to style/layout and only 0.13s to script evaluation; boot-up was about 0.1s, with no unused-JS finding. The samples show substantial environment/transport sensitivity, not a proven causal diagnosis. High lab blocking time remains a limitation, and neither sample establishes field performance or a speedup. No blind application/design change was made from this noisy measurement.

Both raw lab runs are preserved; neither is averaged into a favorable claim.
