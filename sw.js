// sw.js intentionally kept as a no-op.
// This public informational calculator does not use offline caching or
// client-side persistence of user-entered values.
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
