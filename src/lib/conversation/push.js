import { API_URL } from './api';

export const pushSupport = () => {
  if (!window.isSecureContext || !('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

const pushRequest = async (path, token, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options, signal: AbortSignal.timeout(15000),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) throw new Error(path === '/api/push/config' && (response.status === 503 || response.status === 404)
    ? 'Push notifications are not configured on the server yet. You can still leave a message.'
    : 'Couldn’t save notification settings. Please try again.');
  return response.status === 204 ? null : response.json();
};

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
};

const subscriptionPath = (session, operator) => operator
  ? '/api/operator/push-subscriptions'
  : `/api/conversations/${encodeURIComponent(session.id)}/push-subscriptions`;

export const getPushRegistration = () => navigator.serviceWorker.register('/chat-sw.js', { scope: '/', updateViaCache: 'none' });

export const syncPushSubscription = async (session, operator = false, requestPermission = false) => {
  if (!session || pushSupport() === 'unsupported') return 'unsupported';
  // Request directly from the click handler, before a network round trip (required on Safari).
  if (requestPermission && Notification.permission === 'default') await Notification.requestPermission();
  if (Notification.permission !== 'granted') return Notification.permission;
  const { data: config } = await pushRequest('/api/push/config');
  if (!config?.enabled || !config.public_key) throw new Error('Push notifications are not configured on the server yet.');
  await getPushRegistration();
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  const key = decodeBase64Url(config.public_key);
  if (subscription?.options.applicationServerKey && !new Uint8Array(subscription.options.applicationServerKey).every((value, index) => key[index] === value)) {
    await subscription.unsubscribe();
    subscription = null;
  }
  if (!subscription && !requestPermission) return 'default';
  subscription ||= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
  const { data } = await pushRequest(subscriptionPath(session, operator), session.token, { method: 'POST', body: JSON.stringify(subscription.toJSON()) });
  return { state: 'enabled', id: data.id };
};

export const disablePushSubscription = async (session, operator = false) => {
  if (pushSupport() === 'unsupported') return;
  const registration = await navigator.serviceWorker.getRegistration('/');
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) await pushRequest(subscriptionPath(session, operator), session.token, { method: 'DELETE', body: JSON.stringify({ endpoint: subscription.endpoint }) });
  // One browser subscription can serve the operator and a visitor; remove only this recipient on the server.
};

export const testPushSubscription = (session, id, operator = false) => pushRequest(`${subscriptionPath(session, operator)}/${id}/test`, session.token, { method: 'POST' });
