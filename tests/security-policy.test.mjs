import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { secureHtml } from '../scripts/security-policy.mjs';

test('policy permits exact structured metadata without allowing inline code or eval', () => {
  const json = '{"name":"Zaka"}';
  const html = secureHtml(`<head><meta charset="utf-8"><script type="application/ld+json">${json}</script><script>alert(1)</script></head>`);
  const hash = createHash('sha256').update(json).digest('base64');
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<script'));
  assert.ok(html.includes(`'sha256-${hash}'`));
  assert.match(html, /script-src-attr 'none'/);
  assert.match(html, /font-src 'self' data:/);
  assert.doesNotMatch(html, /unsafe-eval/);
  assert.doesNotMatch(html, /script-src[^;]*unsafe-inline/);
  assert.doesNotMatch(html, /frame-ancestors/); // Meta CSP cannot enforce this directive.
});

test('production policy requires TLS and uses only configured realtime destinations', () => {
  const input = '<meta charset="utf-8">';
  assert.throws(() => secureHtml(input, { VITE_CHAT_API_URL: 'http://example.com' }), /HTTPS/);
  assert.throws(() => secureHtml(input, { VITE_REVERB_SCHEME: 'http' }), /TLS/);
  const html = secureHtml(input, { VITE_CHAT_API_URL: 'https://api.example.com/path', VITE_REVERB_HOST: 'ws.example.com', VITE_REVERB_PORT: '8443' });
  assert.match(html, /connect-src 'self' https:\/\/api\.example\.com wss:\/\/ws\.example\.com:8443/);
});

test('every built document receives the policy before script or stylesheet resources', async () => {
  async function check(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await check(path);
      else if (entry.name.endsWith('.html')) {
        const html = await readFile(path, 'utf8');
        const policy = html.indexOf('Content-Security-Policy');
        assert.ok(policy >= 0, path);
        const script = html.indexOf('<script');
        const stylesheet = html.search(/<link[^>]*rel="stylesheet"/);
        assert.ok(script < 0 || policy < script, path);
        assert.ok(stylesheet < 0 || policy < stylesheet, path);
        assert.match(html, /name="referrer" content="strict-origin-when-cross-origin"/, path);
      }
    }
  }
  await check('dist');
});

test('edge rule supplies header-only protections and preserves unrelated domains', async () => {
  const rule = JSON.parse(await readFile('dist/cloudflare-security-headers.json', 'utf8')).rules[0];
  assert.equal(rule.expression, '(http.host in {"zakacoding.dev" "www.zakacoding.dev"})');
  const headers = rule.action_parameters.headers;
  assert.equal(headers['x-frame-options'].value, 'DENY');
  assert.equal(headers['x-content-type-options'].value, 'nosniff');
  assert.match(headers['content-security-policy'].value, /frame-ancestors 'none'/);
  assert.doesNotMatch(headers['content-security-policy'].value, /unsafe-eval/);
});
