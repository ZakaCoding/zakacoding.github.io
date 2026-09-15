import { normalizeMessage } from './types';

const API_URL = import.meta.env.DEV ? '/chat-api' : (import.meta.env.VITE_CHAT_API_URL || 'https://ws-chat-zakacoding.fly.dev').replace(/\/$/, '');

export class ConversationApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ConversationApiError';
    this.status = status;
  }
}

const request = async (path, { token, ...options } = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
      response = await fetch(`${API_URL}${path}`, { ...options, headers, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new ConversationApiError('network');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // Some failures do not return JSON; the status is enough for recovery.
  }

  if (!response.ok) throw new ConversationApiError('request-failed', response.status);
  return payload;
};

export const createConversation = async () => {
  const data = (await request('/api/conversations', { method: 'POST' }))?.data;
  if (!data?.id || !data?.token) throw new ConversationApiError('invalid-response');

  return { id: String(data.id), token: String(data.token) };
};

export const loadConversation = async ({ id, token }) => {
  const data = (await request(`/api/conversations/${encodeURIComponent(id)}`, { token }))?.data;
  if (!data?.id || !Array.isArray(data.messages)) throw new ConversationApiError('invalid-response');

  return {
    id: String(data.id),
    status: data.status || 'open',
    messages: data.messages.map(normalizeMessage).filter(Boolean),
    contactEmail: data.contact_email || '',
  };
};

export const sendConversationMessage = async ({ id, token, body, clientMessageId }) => {
  const message = normalizeMessage((await request(`/api/conversations/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    token,
    body: JSON.stringify({ body, client_message_id: clientMessageId }),
  }))?.data);
  if (!message) throw new ConversationApiError('invalid-response');

  return message;
};

export { API_URL };

export const saveConversationContact = async ({ id, token, email }) => request(`/api/conversations/${encodeURIComponent(id)}/contact`, {
  token, method: 'PATCH', body: JSON.stringify({ email: email || null }),
});
