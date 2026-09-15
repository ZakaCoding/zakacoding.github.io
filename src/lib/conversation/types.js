export const MAX_MESSAGE_LENGTH = 4096;

export const INITIAL_MESSAGES = [
  {
    id: 'initial-hey',
    conversation_id: null,
    sender: { type: 'operator', name: null },
    body: 'Hey 👋',
    created_at: '1970-01-01T00:00:00.000Z',
  },
  {
    id: 'initial-question',
    conversation_id: null,
    sender: { type: 'operator', name: null },
    body: 'What are you working on?',
    created_at: '1970-01-01T00:00:01.000Z',
  },
];

export const normalizeMessage = (message) => {
  if (!message?.id || typeof message.body !== 'string') return null;

  return {
    id: String(message.id),
    conversation_id: message.conversation_id ?? null,
    sender: {
      type: message.sender?.type === 'operator' ? 'operator' : 'guest',
      name: message.sender?.name ?? null,
    },
    body: message.body,
    created_at: message.created_at || new Date(0).toISOString(),
    client_message_id: message.client_message_id || null,
    ...(message.status ? { status: message.status } : {}),
  };
};

const messageTimestamp = (message) => {
  const timestamp = Date.parse(message.created_at);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const sortMessages = (messages) => [...messages].sort((left, right) => (
  messageTimestamp(left) - messageTimestamp(right)
  || left.id.localeCompare(right.id)
));

export const mergeMessages = (currentMessages, incomingMessages) => {
  const messagesById = new Map();

  [...currentMessages, ...incomingMessages].forEach((message) => {
    const normalized = normalizeMessage(message);
    if (normalized) messagesById.set(normalized.id, normalized);
  });

  return sortMessages([...messagesById.values()]);
};

export const removePendingMatch = (pendingMessages, persistedMessage) => {
  const normalized = normalizeMessage(persistedMessage);
  if (!normalized) return pendingMessages;

  let matched = false;
  return pendingMessages.filter((message) => {
    if (message.id === normalized.id) {
      matched = true;
      return false;
    }

    if (normalized.client_message_id && message.client_message_id === normalized.client_message_id) {
      return false;
    }

    if (!normalized.client_message_id && !message.client_message_id && !matched && message.body === normalized.body && message.sender.type === 'guest') {
      matched = true;
      return false;
    }

    return true;
  });
};
