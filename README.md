# ZakaCoding portfolio

Source for [zakacoding.dev](https://zakacoding.dev/), Zaka Noor's portfolio. It presents selected engineering work, an interactive About page, and a conversation interface.

## Run locally

Requires Node.js and npm.

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
- `/#/operator` — authenticated conversation desk

The React pages use hash routing so shared links work on GitHub Pages. The `/work/` pages are generated as standalone HTML by `scripts/build-project-pages.mjs`. Run `npm run build` followed by `npm run preview` to view those pages locally.

## Checks and release

```bash
npm run lint
npm run build
npm run release
```

`npm run release` checks the production configuration, builds the site, and publishes `dist/` to the `gh-pages` branch. The public browser settings used for release are in `.env.production`. Create and push a Git tag separately when marking a version; deployment does not create one.

The `public/CNAME` file keeps `zakacoding.dev` attached to GitHub Pages across releases. The Pages custom domain and Cloudflare DNS must point to the same domain. The chat API and Reverb remain on Fly; their deployed origin allowlists must include `https://zakacoding.dev` and `https://www.zakacoding.dev` for browser features to work from the custom domain.
