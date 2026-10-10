// KETTL — service worker. Tar imot push-varsler og viser dem. Den mellomlagrer
// ingenting, så appen hentes alltid fersk fra nettet.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data.json(); } catch (e) {}
  event.waitUntil(self.registration.showNotification(data.title || 'KETTL', {
    body: data.body || '',
    tag: data.tag || undefined,
    icon: 'favicon.png',
    badge: 'favicon.png',
  }));
});

// Trykk på et varsel: hent frem appen hvis den er åpen, ellers åpne den i innboksen.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        client.postMessage({ type: 'open-inbox' });
        return client.focus();
      }
    }
    return self.clients.openWindow('./?inbox=1');
  })());
});
