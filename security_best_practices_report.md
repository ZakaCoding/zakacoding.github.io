# Release and security remediation — 2026-10-09

## Executive summary

The merged Studio announcement and Vite upgrade are compatible with a normal clean install after React plugin 5.2.0 was adopted. Authorized security remediation now clears all **22 npm dependency findings**. Both the full and production audits report **zero known vulnerabilities** against the final lockfile.

The repository also removes persistent chat credentials, uses an expression-free animation runtime, and builds an enforced CSP into all seven HTML documents. **Live release hardening remains conditional on applying the generated Cloudflare response-header rule.** Account access was unavailable, so framing and other header-only controls have not been activated. Backend token lifetimes have not been changed. Zero advisory findings are not a guarantee against undiscovered vulnerabilities.

## Method and scope

Used OpenAI's [security-best-practices skill](https://github.com/openai/skills/blob/main/skills/.curated/security-best-practices/SKILL.md), with its React and frontend JavaScript guidance. Dependency scans used npm's advisory service; manual review covered rendering, generated HTML, credentials, URL handling, service workers, and outbound destinations. Targeted secret-pattern checks do not replace a dedicated secret scanner or a Git-history audit. This work changes the portfolio repository; it does not deploy the site or change the chat backend.

## Dependency findings: resolved

| ID | Original severity and impact | Remediation and current evidence |
| --- | --- | --- |
| 1 | Critical: prototype pollution in Pages publishing tooling | `package.json:41` pins `gh-pages` to **6.1.1**, fixing the old 3.2.3 advisory. Its existing `-d dist` CLI and default branch are supported. 6.3.0 was evaluated but carries an audited vulnerable glob subtree, so it was not retained. |
| 2 | Critical: shell command injection in the unused toggle/native dependency tree | Removed unused `react-toggle-dark-mode` and its native/3D/tooling peers. `shell-quote` is absent from the final tree. No app-controlled shell sink was identified. |
| 3 | High: parser denial-of-service advisories | Upgraded Tailwind and its PostCSS integration to **4.3.3**, removed unused Flowbite packages, and applied compatible parser lockfile updates. The old reset and palette are retained in `src/styles/preflight.css:1` and `src/index.css:1`. Both audits are clean. |
| 4 | Moderate: router redirect and SSR hydration advisories | Upgraded `react-router-dom` to **7.18.4** (`package.json:29`). Existing client HashRouter routes, Desk entry, and static project pages remain in use. |

The first two critical advisories were [gh-pages prototype pollution](https://github.com/advisories/GHSA-8mmm-9v2q-x3f9) and [shell-quote command injection](https://github.com/advisories/GHSA-pqg4-j6r4-53mv). Their presence in the prior dependency tree did not demonstrate exploitation through the portfolio.

## Application hardening

### 5. Persistent bearer credentials: storage issue resolved

`src/lib/operator/storage.js:3` and `src/lib/conversation/storage.js:3` now retain credentials only in module memory. `src/lib/sessionMemory.js:3` removes both legacy credential keys on every React entry, including Home. Preferences, drafts, and failed-message outboxes remain separate; they do not contain bearer credentials.

Operator use is bounded locally to the earlier server expiry or eight hours (`src/lib/operator/storage.js:14`). The expiry timer signs out locally and attempts backend token revocation when reachable (`src/hooks/useOperatorChat.js:81`). Explicit logout still revokes through the existing bearer API. No cookie authentication was introduced.

**Behavior change:** visitor sessions survive hash-route navigation within the open document, but cannot resume after a refresh or document closure. Desk refresh requires sign-in. Existing backend conversations remain durable; lost visitor credentials cannot recover access. The UI and README explain the new behavior.

**Limit:** in-memory credentials remain accessible to malicious code executing in the active document. The frontend cap is not server-side expiry. The inspected local backend issues tokens using `chat.operator_token_ttl_days`, whose source default is 90 days; effective deployed configuration was not verified. Closing or refreshing a document discards its token without guaranteed server revocation. Backend lifetime and any previously issued-token revocation remain an operator/backend concern.

### 6. Browser policy: repository fixed; edge activation pending

`scripts/security-policy.mjs:3` restricts executable scripts to same-origin bundles and exact JSON-LD hashes. It blocks inline handlers, eval, objects, and base-URL injection, and limits API/WebSocket destinations to configured HTTPS/WSS origins. Embedded icon fonts are allowed as font data, and inline styles remain allowed for Framer Motion and interactive desk styling. All built documents receive the policy before executable or style resources (`scripts/apply-security-policy.mjs:8`).

The build produces `dist/cloudflare-security-headers.json` with CSP plus `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, referrer policy, and permissions policy. [Apply instructions](docs/security-headers.md) preserve unrelated Cloudflare rules. A generated file does not activate a rule. HTML meta CSP cannot supply framing or MIME-sniffing response-header protection; no connected Cloudflare management integration was available.

### 7. Eval-capable animation runtime: resolved

`src/components/LottiePlayer.jsx:4` imports the light SVG player from **lottie-web 5.13.0**, excluding the expression interpreter. Both repository animation assets contain no expression strings. Memoji hover/focus behavior, robot eyes, and reduced-motion behavior are retained. The production build no longer emits the Lottie eval warning, and no direct eval or dynamic Function constructor was found in the light runtime.

## Verification

- A clean `npm ci` succeeds without force or legacy peer dependency options. Remaining ESLint/tooling deprecation notices are maintenance notices, not findings in the current npm audit.
- `npm audit --json`: **0 critical, 0 high, 0 moderate, 0 low**. `npm audit --omit=dev --json`: **0**. Results describe the final lockfile and advisory data sampled on 2026-10-09.
- Production build, lint, release configuration check, all three Node test files, and `git diff --check` pass. Tests cover legacy credential cleanup, memory-only sessions, expiry bounds, generated entry pages, CSP hashes/TLS, and edge rules.
- Chromium verification passes at 1440, 390, and 320 pixels, including reduced motion, credential cleanup, mocked bearer login/visitor restoration, expiry revocation, animations, static routes, and rejection of injected inline JavaScript. Normal flows produce no CSP violations or application exceptions. Work keyboard reveal, menu geometry, Escape, and focus restoration also pass. Screenshots were inspected. Backend authorization and actual realtime delivery are not established by mocked API/socket checks; the installed socket adapter was normalized to discard data after closure as native sockets do.
- Targeted private-key, AWS, GitHub, and OpenAI credential-pattern checks across tracked and intended new text files found no matching secret. No first-party eval or dynamic Function constructor was found. The built CNAME remains `zakacoding.dev`.
- Broader route testing found an existing missing copy-button error on the standalone OwA page; `public/owa/owa.js:281` now guards that optional control so remaining page behavior can initialize.
- Modern browser support follows the upgraded compiler: Chrome 111+, Safari 16.4+, Firefox 128+. Chromium was available for local checks; actual Safari/Firefox devices were not tested.

No push, Pages publication, Fly deployment, or Cloudflare change was performed. Apply and verify the edge rule when publishing this build.
