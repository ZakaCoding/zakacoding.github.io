import { createHash } from 'node:crypto';

export function secureHtml(html, env = {}) {
  const apiOrigin = new URL(env.VITE_CHAT_API_URL || 'https://ws-chat-zakacoding.fly.dev').origin;
  const socket = new URL(`https://${env.VITE_REVERB_HOST || 'ws-chat-zakacoding.fly.dev'}`);
  socket.protocol = 'wss:';
  socket.port = env.VITE_REVERB_PORT || '443';
  if (!apiOrigin.startsWith('https://')) throw new Error('Production chat API must use HTTPS.');
  if (env.VITE_REVERB_SCHEME && env.VITE_REVERB_SCHEME !== 'https') throw new Error('Production Reverb must use TLS.');

  // Permit only the build's structured metadata, never arbitrary inline script.
  const hashes = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  const policy = [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`.trim(),
    "script-src-attr 'none'",
    // Framer Motion and the desk assign inline style properties, not scripts.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    // Bootstrap icons embed their font; this does not permit executable data URLs.
    "font-src 'self' data:",
    "media-src 'self'",
    `connect-src 'self' ${apiOrigin} ${socket.origin}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join('; ');
  const escaped = policy.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const tags = `<meta http-equiv="Content-Security-Policy" content="${escaped}"><meta name="referrer" content="strict-origin-when-cross-origin">`;
  // Keep the charset first and the policy ahead of every executable resource.
  return html.replace(/(<meta\b[^>]*charset=[^>]*>)/i, (charset) => charset + tags);
}
