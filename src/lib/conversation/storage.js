const STORAGE_KEY = 'zakacoding.conversation.v1';

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
