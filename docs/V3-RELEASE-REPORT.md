# KopiKita MY V3 release report

**Status: local release gates passed; production release pending.** Verified candidate evidence is below. The production baseline and rollback reference remain independently verified.

## Verified before release

- Repository: `https://github.com/ismailabs/kopikita`. Local `main`, fetched `origin/main` and advertised remote `main` matched `1a461d26d8e6d64e78538b490c82bd2dfdc513a5`, with zero divergence. Original baseline `541ae3246a9ef69cf6da0025f2c00aece62664f0` and approved predecessor `b6385c2977ebd56cbc0b3ad5aefc693ddb4c8e74` remain ancestors. Work proceeds on `redesign/kopikita-v3`.
- Project-local Wrangler `4.151.0` authenticated successfully through the existing OAuth session in account `44214a829e2337ca50cf40e4cd827cba`. The separate Cloudflare connector requires reauthentication; the manual CLI path is usable. Workers Builds trigger inspection returned HTTP 403, so automatic Git deployment is unverified.
- Existing Worker `kopikita`, tag `ac70fa7b1f354bdaa501a7588449e8a4`, is an assets-only deployment with no bindings. Compatibility date is `2026-10-12`; current observability and asset settings match the existing configuration. The enabled custom hostname maps to `kopikita` / `production`; workers.dev is enabled.
- Baseline `wrangler.jsonc` SHA256: `1D2D9B0E3BD7922E4B563D417A12F127D78EFFEE42A51B0BB92031AB96CC2A1F`.

| Verified public host | Baseline result |
| --- | --- |
| https://kopikita.ismailstudio.my/ | HTTPS and manifest commit match; all 60 public SHA256 hashes equal committed baseline source; 11 private/source paths return 404. |
| https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/ | Same exact commit, 60 hashes and 11 private/source 404 checks pass independently. |

The private-path checks include the V3 handoff README and reference prototype. Responses preserve `Cache-Control: public, max-age=0, must-revalidate, no-transform`. Checks used ordinary DNS with a per-process IPv4-first preference and normal TLS certificate validation. Raw receipts retain transient network attempts.

## Verified rollback reference

Before V3, active Worker version `477f472e-ac48-4744-a385-55af294912df` served 100% of traffic through deployment `467f9e81-eca6-4b4c-96f7-43d277518d76`. The scoped version-detail read confirmed this version belongs to `kopikita`, has no bindings, and preserves the asset/header settings above. Both public manifests identify baseline source commit `1a461d26d8e6d64e78538b490c82bd2dfdc513a5`.

If a confirmed V3 regression requires rollback, recheck the current Worker and use the verified baseline version with the existing scoped configuration, recording the reason and actual result. Rebuild the baseline commit in a preserved checkout and reverify both hosts' exact manifest/hashes and browser journeys. Do not reset or force-push history, recreate infrastructure, or alter DNS. No rollback was executed during preflight.

## Raw evidence and skills

Local evidence is intentionally Git-ignored and excluded from the website build:

- `artifacts/v3-release-readiness/cloudflare-before.json`: Worker settings, deployments, domain mapping, subdomain and exact version detail.
- `artifacts/v3-release-readiness/worker-and-builds-before.json`: Worker identity/tag and HTTP 403 Builds inspection.
- `artifacts/v3-release-readiness/public-baseline-final.json`: canonical host's complete 60-file and private-path pass; retained first workers.dev attempt.
- `artifacts/v3-release-readiness/public-baseline-worker-retry.json`: complete workers.dev pass.
- `artifacts/v3-release-readiness/public-baseline.json`: retained initial network diagnostics.

Cloudflare release skills read:

- `C:/Users/moham/OneDrive/Desktop/kopikita-my/.agents/skills/wrangler/SKILL.md`
- `C:/Users/moham/.codex/plugins/cache/openai-curated-remote/app-6a99ceead2c481919fb44845267235c4/1.0.1/skills/cloudflare/SKILL.md`
- `C:/Users/moham/.codex/plugins/cache/openai-curated-remote/app-6a99ceead2c481919fb44845267235c4/1.0.1/skills/wrangler/SKILL.md`

## Candidate acceptance

All required local gates passed. Application source is index.html/styles.css; runtime script, menu CSV, lockfile, Worker config, response policy, robots/sitemap and existing assets are unchanged. Reviewed files: index.html, styles.css, README.md, TESTING.md, ASSET-CREDITS.md, docs/V3-DESIGN-DECISIONS.md, this report, tools/browser-check.mjs, tools/motion-contrast-check.mjs, tools/performance.mjs, tools/scan-secrets.mjs and tools/verify-production.mjs. No handoff/skill materials are staged or included in the build.

| Executed command | Result |
| --- | --- |
| npm ci | PASS on Node 24.19.0/npm 11.17.0; 0 vulnerabilities. Optional install-script approval warnings retained; existing executables work, no policy change. |
| python KopiKita-V3-Codex-Handoff/VERIFY-HANDOFF.py | PASS 61 reference hashes; reference-only validation. |
| npm run verify; independent original Git-menu comparison | PASS exact 30 names/descriptions/categories/display prices and 6/9/7/8; original 541ae324 agrees. |
| node tools/browser-check.mjs | Full Edge 155.0.4283.62 PASS at 320/375/390/430/768/1024/1440/1920. |
| BROWSER_ENGINE=webkit node tools/browser-check.mjs | Full WebKit 27.2 PASS at the same eight widths. |
| node tools/motion-contrast-check.mjs | PASS 16 cases: both engines, 375/1440, first/middle/final and original mixed-frame case; real animations, opaque text, zero axe. |
| node tools/external-check.mjs | PASS real studio pointer/keyboard/redirect and protected footer popup. |
| node artifacts/v3-local/text-enlargement.mjs; node artifacts/v3-local/tiny-hero-final.mjs | PASS 320/1440 enlarged-text/control bounds; final 320 normal/200% axe, ink bounds and visual review. |
| npm run build; npx wrangler deploy --dry-run | PASS 60 public files plus release manifest, no bindings; explicit allowlist. |
| SITE_URL=http://127.0.0.1:4175/ node tools/verify-production.mjs | PASS built preview: 60 exact hashes and 15 private/source 404s. |
| EVIDENCE_DIR=artifacts/v3-performance node tools/performance.mjs | PASS three alternating mobile pairs plus one desktop pair; eight reports and traces preserved. |
| node --check for changed tools; git diff --check | PASS. Staged secret/exclusion and final committed packaging checks follow before release. |

Both full browser suites verify exact menu/filter/feature-anchor behavior, navigation/Escape/outside tap/focus, breakpoint reset, ticker motion/pause/offscreen, no-JS, blocked-main-script, reduced motion, keyboard/skip and 200% text. Edge additionally tests touch emulation. Zero axe findings, script/HTTP failures, image cancellations or external runtime loads. Initial seal contrast failure (2.43:1) and narrow enlarged-text overlap/italic ink clipping were corrected and rechecked; no assertion was relaxed. Final tiny-screen padding and corrected 827x462 intrinsic image declaration received targeted rechecks.

## Measured performance

Lighthouse 13.5.0, Edge 155.0.4283.62, Node 24.19.0, Windows 10.0.26300, Intel i3-1005G1, four logical CPUs. Immutable baseline 1a461d2 was served at localhost:4174 and final candidate at localhost:4173. Three alternating baseline/candidate mobile pairs and one desktop pair ran sequentially after all QA browsers closed. Lighthouse simulated throttling; other host activity remains uncontrolled. These are local lab observations, not field Core Web Vitals or a production speed guarantee.

| Mobile median (3 samples each) | Baseline | V3 |
| --- | --- | --- |
| Performance | 77 | 97 |
| FCP | 0.924s | 1.353s |
| LCP | 2.499s | 2.274s |
| TBT | 991.5ms | 126ms |
| CLS | 0 | 0 |
| Speed Index | 1.811s | 1.353s |

Candidate mobile scores were 97/97/98. Baseline scores varied 67/85/77, including TBT 488–3266ms. The single desktop pair was 100→99, LCP 657→503ms, TBT 0→91ms and CLS 0→0; single samples do not establish a trend. Candidate accessibility/best-practices were 100; intentional noindex keeps SEO at 69.

The 0.429s median mobile FCP increase is retained as a limitation. Representative second-run diagnostics show similar main-thread totals (1.64→1.67s), about 1.3KB additional stylesheet transfer, a shorter measured CSS dependency chain (119→111ms), script boot 40→28ms, no unused JS, and sampled transfer 475→304KiB. The same native runtime script is preserved. These observations do not isolate a causal explanation for first-paint variance, and no improvement claim is made for FCP. Reports and traces retain every sample rather than selecting the best run.

## Browser and visual evidence

Before: artifacts/v3-baseline/screenshots/{375,1440}-{full,hero,signatures,story,menu,space,studio-note,project-note}.png, plus actual canonical-host before heroes in artifacts/v3-baseline/public-before/. After: artifacts/v3-local/edge/ and webkit/ contain all eight full/hero viewports, mobile open-nav captures, 375/1440 section crops and axe JSON. Initial visual comparison is in artifacts/v3-visual-initial/. Enlarged-text bounds/screenshots: artifacts/v3-local/text-200/ and text-200-final/.

Actual desktop/mobile/tablet browser captures were compared with the selected handoff: the arch, three-line type, alternating favourites, oat story and mosaic follow B. Intentional deviations improve text size and preserve original botanical identity/category wording. Existing synthetic photographs replace low-resolution reference crops; story crop is softer than products. Local design skill paths and specific decisions are in V3-DESIGN-DECISIONS.md.

Performance raw evidence: artifacts/v3-performance/{summary,medians,environment,tested-source-hashes}.json and eight Lighthouse reports/traces. Baseline/account reads are listed above. All artifacts remain ignored and excluded from public output.

## Production acceptance — pending

Next: staged scope/secret checks, normal feature/main Git integration, committed dry-run, authenticated npm run deploy with keep-vars, fresh Worker receipts, both-host exact manifests/hashes/private 404s and public browser journeys. No V3 production completion is claimed yet.

Remaining evidence limits: physical devices, manual screen readers, browser-chrome zoom and field INP are untested. Axe is not full WCAG certification; common-pattern scans are not a Gitleaks audit. Automatic Workers Builds is unverified (403); this release uses authenticated manual Wrangler.
