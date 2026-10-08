# Cloudflare response headers

The build inserts an enforced script CSP and referrer policy into every HTML document. It excludes inline event handlers and eval, allows bundled scripts, and hashes the site's JSON-LD metadata. Inline styles remain allowed for Framer Motion and the interactive desk. API requests and WebSockets are restricted to the configured HTTPS/WSS destinations.

GitHub Pages cannot set arbitrary response headers, and HTML meta tags cannot enforce framing protection or `nosniff`. The build therefore also writes **`dist/cloudflare-security-headers.json`**, containing a complete Cloudflare response-header transform rule and the exact CSP hashes for that build.

This artifact is configuration, not an active rule. No connected Cloudflare management integration was available during remediation, so the live headers have not been changed.

## Apply the rule

1. Run `npm run build` with the production browser configuration.
2. Open the `zakacoding.dev` zone in Cloudflare and create a **Modify Response Header** transform rule.
3. Use the generated rule's expression, restricted to `zakacoding.dev` and `www.zakacoding.dev`.
4. Copy the five header names and their static values from `rules[0].action_parameters.headers`. Use **Set static** for each. The JSON also supports API tooling; merge its rule into an existing response-header ruleset instead of replacing unrelated rules.
5. Verify Home, About, Work, the operator shortcut, and realtime behavior. Check HTTPS GET responses for both `/` and `/operator/` for the generated CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`.

Update the edge CSP when structured metadata or API/Reverb destinations change. A header CSP and meta CSP are both enforced; neither can loosen the other. The rule intentionally leaves other domains untouched and does not alter backend CORS, HSTS, or notifications.

Reference: [Cloudflare response header transforms](https://developers.cloudflare.com/rules/transform/response-header-modification/).
