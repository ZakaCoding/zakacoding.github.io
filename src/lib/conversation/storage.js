import { clearLegacyCredentials } from '../sessionMemory.js';

let activeSession = null;

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
  return isValidSession(activeSession) ? { ...activeSession } : null;
};

export const saveConversationSession = (session) => {
  if (!isValidSession(session)) return;

  activeSession = { id: session.id, token: session.token };
};

export const clearConversationSession = () => {
  activeSession = null;
  clearLegacyCredentials();
};
