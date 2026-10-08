import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import { secureHtml } from './security-policy.mjs';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
let count = 0;
const scriptHashes = new Set();
async function apply(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await apply(path);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      if (!/<meta\b[^>]*charset=/i.test(html)) throw new Error(`HTML charset missing: ${path}`);
      const secured = secureHtml(html, env);
      for (const hash of secured.matchAll(/'sha256-[A-Za-z0-9+/=]+'/g)) scriptHashes.add(hash[0]);
      await writeFile(path, secured);
      count += 1;
    }
  }
}
await apply('dist');
// GitHub Pages cannot set arbitrary response headers. Generate an exact,
// reviewable Cloudflare rule; publishing this file does not activate the rule.
const sample = secureHtml('<meta charset="utf-8">', env);
const basePolicy = sample.match(/content="([^"]+)"/)[1];
const policy = basePolicy.replace("script-src 'self'", `script-src 'self' ${[...scriptHashes].join(' ')}`.trim()) + "; frame-ancestors 'none'";
await writeFile('dist/cloudflare-security-headers.json', JSON.stringify({
  name: 'Portfolio browser security headers',
  kind: 'zone',
  phase: 'http_response_headers_transform',
  rules: [{
    action: 'rewrite',
    expression: '(http.host in {"zakacoding.dev" "www.zakacoding.dev"})',
    description: 'Protect portfolio and Desk documents',
    enabled: true,
    action_parameters: { headers: {
      'content-security-policy': { operation: 'set', value: policy },
      'x-frame-options': { operation: 'set', value: 'DENY' },
      'x-content-type-options': { operation: 'set', value: 'nosniff' },
      'referrer-policy': { operation: 'set', value: 'strict-origin-when-cross-origin' },
      'permissions-policy': { operation: 'set', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
    } },
  }],
}, null, 2) + '\n');
console.log(`Applied CSP and referrer policy to ${count} HTML documents.`);
