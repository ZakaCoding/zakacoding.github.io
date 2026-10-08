# Release and security review — 2026-10-09

## Executive summary

The Studio announcement and Vite upgrade are merged into `main` at `586f7d9`. The Vite upgrade initially prevented a normal clean install: React plugin 4.7.0 supports Vite 4–7, while the merged lockfile selects Vite 8.3.2. Updating the plugin to 5.2.0 resolves that conflict. The Node requirement is now declared in `package.json` and documented in `README.md`.

**Security approval is withheld.** The refreshed npm audit reports **22 affected dependency entries: 2 critical, 15 high, and 5 moderate**. The production dependency tree reports **13: 1 critical, 10 high, and 2 moderate**. Counts include transitive parents affected by the same advisory; they are not counts of distinct exploits. A production dependency entry does not establish that the vulnerable code ships in the browser.

The principal vulnerable versions below were already in `origin/main` before these merges. No new exploitable injection path was found in the Studio toast. Persistent bearer tokens and missing browser security headers also need follow-up. This review records findings; security dependency migrations, authentication changes, and edge configuration changes have not been applied.

## Scope and method

- Used OpenAI's [security-best-practices skill](https://github.com/openai/skills/blob/main/skills/.curated/security-best-practices/SKILL.md), including its React and general frontend JavaScript references.
- Ran `npm audit --json` and `npm audit --omit=dev --json` against the corrected lockfile, using the npm advisory service. Both exit with status 1 because findings remain.
- Reviewed React rendering, generated HTML, URL handling, network destinations, session storage, public configuration, and service worker behavior. Searched first-party JavaScript for HTML injection, dynamic code execution, cross-window messaging, and dynamically loaded scripts.
- Checked tracked text files for common private-key, AWS, GitHub, and OpenAI credential patterns without printing matched values. No matching secret was found. The tracked environment files contain public browser connection settings; a Reverb application key is not an operator credential.
- Inspected HTTPS response headers for the live Home and `/operator/` documents. These describe the currently published site, not deployment of this local merge.
- Backend authorization, token expiry enforcement, infrastructure configuration, Git history secret scanning, and penetration testing are outside this review. No dedicated SAST or secret-scanning binary was installed; the source review and credential checks use targeted patterns and manual inspection.

## Critical dependency findings

### 1. Vulnerable Pages deployment dependency

- **Rule:** REACT-SUPPLY-001. **Severity:** Critical according to npm; local deployment tooling exposure.
- **Location/evidence:** `package.json:44` declares `"gh-pages": "^3.0.0"`; `package-lock.json:3717` locks version `3.2.3`.
- **Impact:** Crafted options reaching vulnerable `gh-pages` object handling can cause prototype pollution in the deployment process.
- **Advisory:** [GHSA-8mmm-9v2q-x3f9](https://github.com/advisories/GHSA-8mmm-9v2q-x3f9), affecting versions below 5.0.0. npm suggests 6.3.0.
- **Fix:** Upgrade `gh-pages` in a separate reviewed change and verify its CLI/branch/CNAME behavior without publishing.
- **Mitigation/limits:** Treat publishing configuration as trusted input and defer deployment. This package does not execute in the portfolio browser bundle; no remote exploitation path through the toast was identified.

### 2. Shell quoting command injection in an unused dependency subtree

- **Rule:** REACT-SUPPLY-001. **Severity:** Critical according to npm; Node/tooling exposure.
- **Location/evidence:** `package-lock.json:7661` locks `shell-quote` to `1.10.0`; `package.json:30` includes `react-toggle-dark-mode`, which brings `react-spring` and native/tooling peers. No first-party import of the toggle package was found.
- **Impact:** Attacker-controlled tokens used by the vulnerable quoting function in a shell command can permit command injection in a Node process.
- **Advisory:** [GHSA-pqg4-j6r4-53mv](https://github.com/advisories/GHSA-pqg4-j6r4-53mv), affecting 1.8.4 through versions below 1.11.0.
- **Fix:** Remove the unused toggle dependency and re-audit its subtree, or update the quoting dependency to a patched release after verifying its consumers.
- **Mitigation/limits:** Do not pass untrusted input into shell commands. Membership in the production dependency tree does not imply browser command execution; no app-controlled shell sink was found.

## High dependency findings

### 3. Build and native dependency denial-of-service advisories

- **Rule:** REACT-SUPPLY-001. **Severity:** High according to npm; exposure depends on the vulnerable parser receiving attacker-controlled build inputs.
- **Location/evidence:** `package-lock.json:2011` locks `braces` to `3.0.3`, and `package-lock.json:7760` locks `source-map-js` to `1.2.1`. The audited tree also includes vulnerable `brace-expansion`.
- **Impact:** Crafted glob patterns, selectors, or source maps can exhaust CPU or the stack in the affected tooling. Native/Metro parents inherit several of these findings.
- **Fix:** Remove unused dependency subtrees first, then update affected parsers and their parents through compatible releases. Validate Tailwind output before any major migration.
- **Mitigation/limits:** Build only trusted sources and keep preview servers local. There is no demonstrated public request path into these build parsers. Avoid `npm audit fix --force`, which proposes unrelated major upgrades.

## Medium application and dependency findings

### 4. Router advisories require a reviewed migration

- **Rule:** REACT-SUPPLY-001 / REACT-REDIRECT-001. **Severity:** Moderate in npm.
- **Location/evidence:** `package-lock.json:6844` and `package-lock.json:6859` lock `react-router` and `react-router-dom` to `6.30.6`; routing is configured in `src/App.jsx`.
- **Advisories:** [Backslash open redirect](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) and [SSR hydration constructor injection](https://github.com/advisories/GHSA-337j-9hxr-rhxg). npm proposes router 7.18.4.
- **Fix:** Review an upgrade with hash routes, operator redirects, and external-link behavior covered by browser checks.
- **Mitigation/limits:** This site uses a client-rendered HashRouter, not React Router SSR hydration. Reviewed redirect targets use fixed same-origin path prefixes; no attacker-controlled external navigation target was found. Those facts reduce demonstrated exposure but do not remove the dependency advisories.

### 5. Bearer tokens persist in origin-wide local storage

- **Rule:** REACT-AUTH-001 / JS-STORAGE-001. **Severity:** Medium; existing design risk.
- **Location/evidence:** `src/lib/operator/storage.js:19–22` persists `{ token, expiresAt, operator }` through `localStorage.setItem`; `src/lib/conversation/storage.js:47–54` persists the visitor conversation token.
- **Impact:** An XSS or compromised script anywhere on `zakacoding.dev` could read these tokens. `/operator/` is a separate document, but paths do not isolate origin-wide storage. Operator expiry may be null, and client checks do not prove server-side expiry.
- **Fix:** Design short-lived in-memory tokens or server-managed HttpOnly sessions, with backend authorization/expiry and CSRF reviewed together. Preserve the intended operator shortcut and visitor continuation behavior.
- **Mitigation/limits:** Require bounded server-side lifetimes and revocation, and strengthen CSP. This is not evidence of an active XSS or of a committed token; switching to session storage alone would not prevent script access.

### 6. Browser security headers are absent in the sampled live documents

- **Rule:** REACT-HEADERS-001 / REACT-CSP-001. **Severity:** Medium; defense-in-depth gap.
- **Location/evidence:** HTTPS HEAD responses for `https://zakacoding.dev/` and `https://zakacoding.dev/operator/` returned 200 without `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`. `index.html` and `operator/index.html` contain no meta CSP.
- **Impact:** The sampled app shells lack CSP restrictions and framing controls, increasing the consequence of a future injection bug and allowing framing unless another browser control intervenes.
- **Fix:** Configure headers at the hosting edge. Trial CSP in report-only mode against Home, About, Work, operator, animation, and realtime behavior before enforcement.
- **Mitigation/limits:** A meta CSP can constrain scripts but cannot supply `frame-ancestors` or report-only enforcement. No Cloudflare configuration was changed. These samples do not establish headers on every route or response.

## Low hardening finding

### 7. Lottie retains an eval-capable runtime

- **Rule:** JS-XSS-003 / JS-CSP-002. **Severity:** Low in the reviewed app context.
- **Location/evidence:** `src/components/MemojiWink.jsx:46` uses `@lottiefiles/react-lottie-player`; the Vite 8 build warns about direct `eval` in its bundled implementation.
- **Impact:** The runtime complicates a strict CSP; untrusted expression-bearing animations could expand the execution surface.
- **Fix:** Assess an expression-free/light player while preserving the accepted Memoji behavior.
- **Mitigation/limits:** Current animation input is a repository-controlled asset, not an upload or API response. Do not enable `unsafe-eval` just to suppress CSP failures. No attacker-controlled input into this eval path was demonstrated.

## Complete npm finding inventory

| npm severity | Affected entries |
| --- | --- |
| Critical (2) | `gh-pages`, `shell-quote` |
| High (15) | `@react-native/community-cli-plugin`, `@react-native/virtualized-lists`, `@react-three/fiber`, `brace-expansion`, `braces`, `chokidar`, `fast-glob`, `metro`, `metro-config`, `metro-file-map`, `metro-transform-worker`, `micromatch`, `react-native`, `source-map-js`, `tailwindcss` |
| Moderate (5) | `flowbite-react`, `postcss-nested`, `postcss-selector-parser`, `react-router`, `react-router-dom` |

## Positive checks and release validation

- The Studio toast uses fixed JSX text, a non-sensitive dismissal flag, guarded storage access, and timer cleanup. It adds no outbound request, dynamic URL, or HTML injection sink.
- Visitor and operator message bodies use React text interpolation. Generated project prose is escaped. Reviewed service worker notification links are restricted to the same origin, and the worker does not cache authenticated requests.
- First-party source searches found no raw HTML injection, `eval`, `new Function`, third-party script loader, or cross-window messaging handler requiring origin validation.
- `npm ci` completed successfully without `--force` or `--legacy-peer-deps`. It retains pre-existing peer warnings from the unused native/3D subtree.
- The production build completed with Vite 8.3.2 and React plugin 5.2.0, and generated all three project stories, sitemap, and 404 page. The Lottie eval warning remains as described in finding 7.
- `npm run lint`, `npm run release:check`, `node --test tests/operator-entry.test.mjs`, and `git diff --check` passed.
- Chromium checks against the final Vite 8 output passed at 1440, 390, and 320 pixels, including reduced motion, keyboard dismissal, persistence after reload, and route smoke checks for About, Work, operator, and generated Work pages. The toast stayed inside each viewport; no browser exceptions were observed. Screenshots were inspected. These checks do not exercise an authenticated backend session.

## Recommended follow-up order

1. Upgrade vulnerable Pages tooling and remove unused toggle/native dependency branches; rerun both audits.
2. Review remaining parser and router upgrades with focused regression checks.
3. Plan token lifetime/storage changes with the chat backend and edge CSP/framing controls.

No source push, Pages publication, Fly release, or edge configuration change was performed during this review.
