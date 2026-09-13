import { API_URL } from '../conversation/api';
import { normalizeMessage } from '../conversation/types';

export class OperatorApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = 'OperatorApiError';
    this.status = status;
    this.payload = payload;
  }
}

const request = async (path, { token, ...options } = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new OperatorApiError('Unable to reach Zaka Desk.');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // A status code is enough to recover when the server has no JSON body.
  }

  if (!response.ok) {
    const message = payload?.message
      || (response.status === 401 ? 'Email or password is incorrect.' : 'The request could not be completed.');
    throw new OperatorApiError(message, response.status, payload);
  }

  return payload;
};

const unwrapData = (payload) => payload?.data ?? payload;

const participantName = (conversation) => {
  const guest = conversation?.participants?.find?.((participant) => participant.type === 'guest');
  return conversation?.display_name
    || conversation?.guest?.display_name
    || guest?.display_name
    || null;
};

export const normalizeOperatorConversation = (conversation) => {
  if (!conversation?.id) return null;

  const rawMessages = Array.isArray(conversation.messages) ? conversation.messages : [];
  const messages = rawMessages.map(normalizeMessage).filter(Boolean);
  const lastMessage = normalizeMessage(
    conversation.last_message
    || conversation.latest_message
    || messages.at(-1),
  );

  return {
    id: String(conversation.id),
    status: conversation.status || 'open',
    displayName: participantName(conversation),
    createdAt: conversation.created_at || null,
    lastMessageAt: conversation.last_message_at || lastMessage?.created_at || conversation.updated_at || null,
    lastMessage,
    unreadCount: Number(conversation.unread_count || 0),
    messages,
  };
};

export const loginOperator = async ({ email, password, deviceName }) => {
  const data = unwrapData(await request('/api/operator/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, device_name: deviceName }),
  }));
  const token = data?.token || data?.access_token;
  if (!token) throw new OperatorApiError('The server did not return an operator token.');

  return {
    token: String(token),
    expiresAt: data.expires_at || data.token_expires_at || null,
    operator: data.operator || data.user || null,
  };
};

export const loadOperatorIdentity = async (token) => {
  const data = unwrapData(await request('/api/operator/auth/me', { token }));
  return data?.operator || data?.user || data;
};

export const logoutOperator = async (token) => {
  await request('/api/operator/auth/logout', { method: 'DELETE', token });
};

export const loadOperatorConversations = async ({ token, page = 1 }) => {
  const payload = await request(`/api/operator/conversations?page=${page}`, { token });
  const data = unwrapData(payload);
  const rows = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

  return {
    conversations: rows.map(normalizeOperatorConversation).filter(Boolean),
    meta: payload?.meta || data?.meta || null,
  };
};

export const loadOperatorConversation = async ({ id, token }) => {
  const data = unwrapData(await request(`/api/operator/conversations/${encodeURIComponent(id)}`, { token }));
  const conversation = normalizeOperatorConversation(data);
  if (!conversation) throw new OperatorApiError('Conversation response is invalid.');
  return conversation;
};

export const sendOperatorMessage = async ({ id, token, body }) => {
  const data = unwrapData(await request(`/api/operator/conversations/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    token,
    body: JSON.stringify({ body }),
  }));
  const message = normalizeMessage(data);
  if (!message) throw new OperatorApiError('Message response is invalid.');
  return message;
};
