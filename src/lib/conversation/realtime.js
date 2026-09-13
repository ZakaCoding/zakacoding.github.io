import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { API_URL } from './api';
import { normalizeMessage } from './types';

const appKey = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST;
const port = Number(import.meta.env.VITE_REVERB_PORT || 443);
const scheme = import.meta.env.VITE_REVERB_SCHEME || 'https';

export const subscribeToConversation = ({ conversationId, token, onMessage, onStatus, onReconnect, onTyping }) => {
  if (!appKey || !host) {
    onStatus('saved');
    return () => {};
  }

  let echo;
  try {
    window.Pusher = Pusher;
    onStatus('connecting');
    echo = new Echo({
      broadcaster: 'reverb',
      key: appKey,
      wsHost: host,
      wsPort: port,
      wssPort: port,
      forceTLS: scheme === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const channel = echo.private(`conversation.${conversationId}`);
    channel.listen('MessageCreated', (payload) => {
      const message = normalizeMessage(payload?.data || payload);
      if (message) onMessage(message);
    });

    channel.listenForWhisper('typing', (payload) => {
      if (onTyping && payload?.sender === 'operator') onTyping(true);
    });

    const connection = echo.connector?.pusher?.connection;
    const handleStateChange = (states) => {
      if (states.current === 'connected') {
        onStatus('live');
        onReconnect();
      } else if (states.current === 'connecting' || states.current === 'initialized') {
        onStatus('connecting');
      } else {
        onStatus('saved');
      }
    };

    connection?.bind('state_change', handleStateChange);

    return () => {
      connection?.unbind('state_change', handleStateChange);
      echo.leave(`conversation.${conversationId}`);
      echo.disconnect();
    };
  } catch {
    onStatus('saved');
    echo?.disconnect();
    return () => {};
  }
};
