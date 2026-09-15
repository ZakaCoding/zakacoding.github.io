/* Notifications only: deliberately no fetch interception or cached chat credentials. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let payload;
  try { payload = event.data?.json(); } catch { payload = null; }
  const url = payload?.operator
    ? `/#/operator?conversation=${encodeURIComponent(payload.conversation_id || '')}`
    : '/#/about?chat=1';
  event.waitUntil(self.registration.showNotification(payload?.title || 'ZakaCoding', {
    body: payload?.body || 'You have a new conversation update.',
    icon: '/logo/favicon.png', badge: '/logo/favicon.png',
    tag: payload?.tag || 'zakacoding-chat', renotify: false,
    data: { url },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/', self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = windows.find((window) => new URL(window.url).origin === url.origin);
    if (client) { await client.navigate(url.href); await client.focus(); }
    else await self.clients.openWindow(url.href);
  })());
});
