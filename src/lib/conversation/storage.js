const STORAGE_KEY = 'zakacoding.conversation.v1';

export const readDraft = () => {
  try { return sessionStorage.getItem('conversation-draft') || ''; } catch { return ''; }
};

export const saveDraft = (value) => {
  try { sessionStorage.setItem('conversation-draft', value); } catch { /* In-memory composing still works. */ }
};

export const readOutbox = (id) => {
  try {
    const messages = JSON.parse(localStorage.getItem(`zakacoding.outbox.${id}`) || '[]');
    return Array.isArray(messages) ? messages.filter((message) => message.conversation_id === id && typeof message.body === 'string' && message.client_message_id)
      .map((message) => ({ ...message, status: 'failed' })) : [];
  } catch { return []; }
};

export const saveOutbox = (id, messages) => {
  try {
    if (messages.length) localStorage.setItem(`zakacoding.outbox.${id}`, JSON.stringify(messages));
    else localStorage.removeItem(`zakacoding.outbox.${id}`);
    return true;
  } catch { return false; }
};

const isValidSession = (session) => (
  Boolean(session)
  && typeof session.id === 'string'
  && session.id.length > 0
  && typeof session.token === 'string'
  && session.token.length > 0
);

export const readConversationSession = () => {
  try {
    const rawSession = window.localStorage.getItem(STORAGE_KEY);
    if (!rawSession) return null;

    const session = JSON.parse(rawSession);
    return isValidSession(session) ? { id: session.id, token: session.token } : null;
  } catch {
    return null;
  }
};

export const saveConversationSession = (session) => {
  if (!isValidSession(session)) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      id: session.id,
      token: session.token,
    }));
  } catch {
    // The REST conversation remains usable when storage is unavailable.
  }
};

export const clearConversationSession = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures so an expired session can still recover.
  }
};
