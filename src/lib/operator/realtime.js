import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { API_URL } from '../conversation/api';
import { normalizeMessage } from '../conversation/types';

const appKey = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST;
const port = Number(import.meta.env.VITE_REVERB_PORT || 443);
const scheme = import.meta.env.VITE_REVERB_SCHEME || 'https';
const inboxChannelName = import.meta.env.VITE_OPERATOR_REVERB_CHANNEL || 'operator.inbox';

export const subscribeToOperatorConversations = ({
  conversationIds,
  token,
  onMessage,
  onInboxEvent,
  onStatus,
  onReconnect,
}) => {
  if (!appKey || !host) {
    onStatus('saved');
    return { disconnect: () => {}, whisperTyping: () => {} };
  }

  let echo;
  const channels = new Map();

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
      authEndpoint: `${API_URL}/api/operator/broadcasting/auth`,
      auth: {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const inboxChannel = echo.private(inboxChannelName);
    inboxChannel.listen('.message.created', (payload) => {
      const message = normalizeMessage(payload?.data || payload);
      if (message) onMessage(message);
      if (message && onInboxEvent) onInboxEvent(message);
    });

    conversationIds.forEach((conversationId) => {
      const channel = echo.private(`conversation.${conversationId}`);
      channel.listen('.message.created', (payload) => {
        const message = normalizeMessage(payload?.data || payload);
        if (message) onMessage(message);
      });
      channels.set(conversationId, channel);
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

    return {
      whisperTyping: (conversationId, typing) => {
        channels.get(conversationId)?.whisper('typing', { sender: 'operator', typing });
      },
      disconnect: () => {
        connection?.unbind('state_change', handleStateChange);
        conversationIds.forEach((id) => echo.leave(`conversation.${id}`));
        echo.leave(inboxChannelName);
        echo.disconnect();
      },
    };
  } catch {
    onStatus('saved');
    echo?.disconnect();
    return { disconnect: () => {}, whisperTyping: () => {} };
  }
};
