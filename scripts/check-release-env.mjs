import { loadEnv } from 'vite';
import { readFile } from 'node:fs/promises';

const fileEnv = loadEnv('production', process.cwd(), '');
const env = { ...fileEnv, ...process.env };

const required = [
  'VITE_CHAT_API_URL',
  'VITE_REVERB_APP_KEY',
  'VITE_REVERB_HOST',
  'VITE_REVERB_PORT',
  'VITE_REVERB_SCHEME',
];

const missing = required.filter((key) => !String(env[key] ?? '').trim());

if (missing.length > 0) {
  console.error(`Release stopped: missing ${missing.join(', ')}`);
  process.exit(1);
}

const domain = (await readFile('public/CNAME', 'utf8').catch(() => '')).trim();
if (domain !== 'zakacoding.dev') {
  console.error(`Release stopped: public/CNAME must contain zakacoding.dev (found ${domain || 'empty'}).`);
  process.exit(1);
}

console.log('Release configuration OK (production config + environment overrides).');
