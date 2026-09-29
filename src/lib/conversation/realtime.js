import { createPortfolioEcho } from '../realtime';
import { normalizeMessage } from './types';

export const subscribeToConversation = ({ conversationId, token, onMessage, onStatus, onReconnect, onTyping }) => {
  let echo;
  try {
    onStatus('connecting');
    echo = createPortfolioEcho('/broadcasting/auth', token);
    if (!echo) {
      onStatus('saved');
      return () => {};
    }

    const channel = echo.private(`conversation.${conversationId}`);
    // MessageCreated::broadcastAs() publishes the custom event name
    // `message.created`; the leading dot tells Echo not to prepend
    // its default App.Events namespace.
    channel.listen('.message.created', (payload) => {
      const message = normalizeMessage(payload?.data || payload);
      if (message) onMessage(message);
    });

    channel.listenForWhisper('typing', (payload) => {
      if (onTyping && payload?.sender === 'operator') onTyping(payload.typing !== false);
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
