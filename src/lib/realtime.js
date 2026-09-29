import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { API_URL } from './conversation/api';

export const createPortfolioEcho = (authPath, token) => {
  const key = import.meta.env.VITE_REVERB_APP_KEY;
  const host = import.meta.env.VITE_REVERB_HOST;
  if (!key || !host) return null;

  window.Pusher = Pusher;
  const port = Number(import.meta.env.VITE_REVERB_PORT || 443);
  return new Echo({
    broadcaster: 'reverb',
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${API_URL}${authPath}`,
    auth: { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } },
  });
};
