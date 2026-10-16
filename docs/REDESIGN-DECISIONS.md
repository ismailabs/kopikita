# KopiKita — redesign decisions

17 October 2026. These are implementation choices made within the user's brief, not retroactive user approvals.

## Evidence and scope

Baseline: `541ae3246a9ef69cf6da0025f2c00aece62664f0`, clean `main` tracking the same advertised GitHub SHA. The supplied handoff was the sole untracked folder and is preserved, ignored, and excluded from publication. There were no applicable AGENTS.md files. Read every supplied Markdown document, menu CSV, manifest, SVG, all four boards, both Pinterest reference images and the source photographs. The manifest lists a `PASTE-INTO-CODEX.txt` that was absent from the supplied folder; the direct user request and full operating brief supply the execution contract.

Fresh browser captures confirm both public hostnames serve the original 30-item design, with workers.dev canonical metadata. The intended custom host works. `https://ismailstudio.my/` returns the portfolio after redirecting to `https://www.ismailstudio.my/`. No DNS modification is needed.

The original browser suite passed at all six original sizes before edits. Baseline imagery, narrow two-stylesheet cascade and excessively long sequence of repeated invitations were opportunities for composition and maintainability, not claims of broken functionality. The new page removes a redundant closing block and puts favourites before the longer story.

## Reference comparison

Scores are subjective art-direction judgments, 0–4, using the brief's weights. They do not measure conversions or certify accessibility.

| Reference | Café credibility 20 | Studio journey 20 | Mobile 20 | Cohesion 15 | Real menu 15 | Feasibility 10 | Weighted /100 |
|---|---:|---:|---:|---:|---:|---:|---:|
| A, warm editorial | 4 | 3 | 4 | 3 | 4 | 4 | 91.25 |
| B, minimal luxury | 3 | 3 | 4 | 3 | 3 | 4 | 82.5 |
| C, cinematic | 4 | 3 | 3 | 4 | 3 | 3 | 83.75 |
| D, local botanical | 4 | 3 | 3 | 3 | 3 | 3 | 80 |

Choose A's clear warm reading surfaces and mobile hierarchy; C's atmospheric opening; B's disciplined product rhythm. D contributes the restrained botanical identity and Malaysian sense of welcome. The resulting design is one system, not a collage of four pages. Do not copy board pricing, stories about farms, imaginary community metrics, locations or shopping features. The four highlight entries are Caffè Latte, Iced Latte, Kopi O and Butter Croissant, with exact source descriptions and prices.

## System

- Cream `#f9f5ed`, paper `#f1eade`, ink `#30231e`, muted `#6a5a50`, clay `#9c482e`; dark olive atmosphere `#2a3027`. The studio eyebrow uses darker `#823a25` after measured axe contrast feedback.
- Locally hosted, OFL-licensed DM Serif Display regular/italic and DM Sans variable Latin. Serif display headings, neutral interface labels, tabular prices. Fonts have swap and Georgia/Segoe UI fallbacks. No external runtime requests.
- Mobile-first one-column layout; two product columns from 600px; desktop navigation/story/menu/atmosphere from 761px; four highlight columns from 1000px. Fluid 20–80px gutters, 72–120px section rhythm, 1600px maximum content width.
- Desktop hero uses the supplied dark-left/right-cup composition. Mobile copy sits on cream above a dedicated cup crop, so no essential copy overlays a detailed subject. Both are live HTML, not a sliced board.
- Real illustrated menu rows remain exactly in source order. Wrapped five-button filters expose pressed state and live count. No checkout, booking, cart or fabricated operational controls.
- Highlight anchors reveal the correct category, move focus to the original entry, and work without JS. Hash navigation can reveal a hidden group. Navigation supports Escape, outside dismissal, destination focus and responsive reset.
- One slow marquee has a native pause/resume button, offscreen/document pause, reduced-motion handling and static no-JS fallback. Entry motion never hides essential content. No trackers were added.
- Measured loading QA found a mobile header shift when the deferred script collapsed navigation after paint. The small navigation controller now runs immediately after header markup; the main deferred script handles menu and motion. Without JS all navigation links remain visible; if only the main script fails, the early navigation still works and inactive filter buttons remain hidden. All three local text faces are preloaded to stabilize typography. The revised lab trials record zero mobile CLS.
- The installed WebKit port skipped native links under its default Tab preference. Explicit zero tabindex on links keeps the same document order and makes the links reachable there. No positive tabindex is used. The browser suite checks the complete visible-link/button Tab sequence, rather than dropping the failed skip-link assertion.
- Fictional disclosure appears before the header, beside illustrative pricing, in the studio endcap and in the footer. Only two external portfolio invitations. The user-selected non-www URL is preserved in their hrefs even though the portfolio redirects.

## Publication constraints

Keep the existing Worker configuration/account/name/observability/bindings unchanged. Use existing main-branch Workers Builds only after authenticated inspection and exact commit validation. Do not launch a duplicate deployment. Canonical/OG/robots/sitemap use the working custom hostname; noindex, follow keeps this fictional example out of search results. The Worker endpoint remains available. All original menu descriptions are preserved without exceptions.

## Visual QA adaptation

Intentionally omit fictional sales UI, reviews, farm claims and board-only products. Keep original SVG thumbnails in the 30-item menu to distinguish exact entries without invented product photography. Mobile highlights stack with large touch targets; tablets use two columns. Separate section screenshots, not only scaled full-page images, are used to inspect text, crops, prices and focus. Actual test evidence and remaining limitations are recorded in the release report.
