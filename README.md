# ZakaCoding portfolio

Source for [zakacoding.dev](https://zakacoding.dev/), Zaka Noor's portfolio. It presents selected engineering work, an interactive About page, and a conversation interface.

## Run locally

Requires Node.js 20.19+ on the Node 20 line, or Node.js 22.12+ (including newer major versions), and npm. These minimum versions are required by Vite 8.

```bash
npm ci
npm run dev
```

Vite prints the local URL. The portfolio pages work without a backend. The conversation interface requires the chat API; during development, Vite proxies `/chat-api` requests to `CHAT_PROXY_TARGET`. Copy `.env.example` to `.env.local` if you need to override that target or other local settings. Keep backend secrets out of `VITE_*` variables because Vite includes them in browser code.

## Pages

- `/` — homepage
- `/work/` — selected work and engineering stories, generated as static pages at build time
- `/#/archive` — project archive
- `/#/about` — About page and conversation interface
- `/operator/` — authenticated conversation desk with a dedicated Home Screen manifest (old `/#/operator` links redirect here)

The React pages use hash routing so shared links work on GitHub Pages. The `/work/` pages are generated as standalone HTML by `scripts/build-project-pages.mjs`. Run `npm run build` followed by `npm run preview` to view those pages locally.

Chat credentials live only in the open document's memory. Visitor conversations survive navigation between hash routes; refreshing or closing the page loses access to that visitor session. Desk refresh requires sign-in, and its local session lasts at most eight hours or the earlier backend expiry. This does not change the backend token lifetime. Drafts and failed-message outboxes remain in browser storage without bearer credentials.

The production CSS requires Chrome 111+, Safari 16.4+, or Firefox 128+, following [Tailwind 4's browser support](https://tailwindcss.com/docs/upgrade-guide).

## Checks and release

```bash
npm run lint
npm run build
node --test tests/*.test.mjs
npm run release:check
npm audit
npm audit --omit=dev
```

`npm run release` checks the production configuration, builds the site, and publishes `dist/` to the `gh-pages` branch. The public browser settings used for release are in `.env.production`. Create and push a Git tag separately when marking a version; deployment does not create one.

The [2026-10-09 security review](security_best_practices_report.md) records zero known vulnerabilities in both dependency scans after remediation. `gh-pages` is intentionally pinned to 6.1.1 because the evaluated 6.3.0 release retained a vulnerable glob subtree. Re-audit before publishing.

Every built HTML page includes an enforced CSP. The build also writes a Cloudflare response-header rule to `dist/cloudflare-security-headers.json`; [apply it at Cloudflare](docs/security-headers.md) for framing protection and other header-only controls. Publishing the JSON alone does not enable the rule. Once verification is complete, run `npm run release` to publish.

The `public/CNAME` file keeps `zakacoding.dev` attached to GitHub Pages across releases. The Pages custom domain and Cloudflare DNS must point to the same domain. The chat API and Reverb remain on Fly; their deployed origin allowlists must include `https://zakacoding.dev` and `https://www.zakacoding.dev` for browser features to work from the custom domain.

### iPhone operator shortcut

After deploying, open `https://zakacoding.dev/operator/` in Safari and use Share → Add to Home Screen. The shortcut should be named **Zaka Desk**. Replace an old shortcut that launches About; its saved launch URL may still belong to the portfolio app. Sign in and enable notifications from the new Desk shortcut. Operator authentication remains on the backend.

Run `npm run build && node --test tests/operator-entry.test.mjs` to check the built entry page, manifest, legacy routes, and notification targets.
