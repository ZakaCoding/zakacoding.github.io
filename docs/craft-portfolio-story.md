# Craft portfolio product story

Replaces the Logistics feature on the homepage with Craft and adds the standalone,
indexable `/work/craft/` story. Logistics remains available in the archive and at
its existing URL. The original homepage navigation, memoji, coffee and local-AI
interactions stay in place.

## Design and content

Editorial product story for makers, prospective users and technical reviewers.
Uses the existing Mona family, light paper surfaces and Craft’s forest-green
identity. Taste settings: design variance 8, motion intensity 6, visual density 4.
The homepage receives a scoped update; the new detail page has its own CSS and JS.

References:

- https://diana.lu/point-n-talk: a narrative developed through large product demos.
- https://diana.lu/fun: playful pacing and distinct visual moments for each idea.
- https://www.cloudflare.com/startups/: product/website context for the brief.
  This page does not claim program approval, funding, customers or eligibility.

The story explains the audience, product direction, founder’s role, editable
output, approval boundary, usage accounting, infrastructure and development
priorities. Existing interface studies and offline acceptance examples are
labelled explicitly. They are not presented as model-quality benchmarks or live
customer work. The video is dated so its older roadmap/end-card wording has context.

Motion communicates sequence and interaction: hero entry, section reveals,
workflow image changes, hover feedback and image enlargement. Reduced-motion
preferences disable animation. There is no automatic video playback or scroll
hijacking. Video has native controls and `preload="none"`.

## Source and media provenance

Portfolio base: `67cb89de8171ae48068a4c31146f5f8411a22c9b` (`origin/main`).
Product claims were reconciled against the local Cloud repository’s README,
ADR 0008, ADR 0009, Create Design acceptance and P3-B owner acceptance records.
Those records describe their own dated evidence, not a fresh production audit.
No live host, member access, allowance or Cloudflare settings were changed.

Media comes from existing owner workspace assets in `zakacoding-cloud`:

| Public asset | Existing source | Treatment |
| --- | --- | --- |
| `craft-beat.mp4` | `.state/craft-beat.mp4` | Full 26.266-second cut; H.264/AAC, 720×1280, fast-start, metadata removed; approximately 3.8 MiB |
| `film-poster.webp` | Frame at 4.2 seconds in `craft-beat.mp4` | WebP poster |
| `interface-study.webp` | `docs/design/craft-p3a/qa-managed-ux/final/chat-desktop-04-proposal.png` | Existing interface study, WebP |
| `review.webp`, `applied.webp` | `docs/evidence/craft-p3a/canvas-desktop-1440-edit-{proposal,applied}.png` | Crop to real application panel; synthetic test account/content |
| `create.webp` | `docs/evidence/craft-create-design-2026-10-25/coffee-2-approval-card.png` | Real application UI / offline fixture, WebP |
| `coffee.webp`, `saas.webp`, `studio.webp` | `docs/evidence/craft-create-design-2026-10-25/{coffee,saas,studio}-export-desktop.png` | Native Penpot output from curated offline briefs; resized to 1000px wide and converted to WebP |
| `native-editor.webp` | `docs/evidence/craft-create-design-2026-10-25/coffee-4-editor.png` | Real isolated Penpot acceptance, WebP |

The original product-film documentation is in the sibling worktree at
`zakacoding-cloud-ig-craft/docs/ig-craft/README.md`. It identifies real built Craft
panel captures, an illustrated canvas, offline replies and sample credit amounts.
The owner explicitly selected `craft-beat.mp4` for this portfolio page.
No private account screenshots, identifiers, credentials or administrator views
were copied into the portfolio.

## Verification

Checks use Node 24.18.0 and the existing dependency installation:

```sh
npm run lint
npm run build
node --test tests/*.test.mjs
npm run release:check
node --check public/craft/craft.js
node --check scripts/check-craft-browser.mjs
git diff --check
```

The local build uses Vite 8.3.2, generates the Craft page and sitemap entry, and
applies the existing CSP pipeline. The 12 existing Node tests pass. No new runtime
dependency or CSP exception is required.

Browser QA is recorded in `docs/evidence/craft-story/browser.json` (Chromium) and
`webkit.json` (WebKit). Chromium covers 1440×1000, 1366×768, 768×1024, 390×844,
and 320×740 with reduced motion. WebKit covers desktop and phone widths.
Checks cover horizontal overflow, visible hero CTA, lazy video loading, actual
video playback, all workflow selectors, lightbox opening/Escape/close, disclosure,
image loading, browser errors and asset responses. The homepage has one Craft
story link and no Logistics story link.

Run the Chromium smoke script against the built preview with an existing optional
Playwright installation (Playwright is not a product dependency):

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4175
# In another terminal:
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/check-craft-browser.mjs
```

Screenshots disable finite animations for capture; the actual page still animates.
The preserved preview images show desktop, phone and homepage layouts. This is
local browser evidence, not a production deployment or owner acceptance.

## Publication state

Implementation is prepared on `feat/craft-product-story`, for owner review.
GitHub CI, merge, publication and live verification are separate from local checks.
The existing release process builds and publishes `dist/`; do not upload source
files alone. Verify the active Cloudflare CSP against the generated header artifact
when preparing a later authorized release. No release command was run here.
