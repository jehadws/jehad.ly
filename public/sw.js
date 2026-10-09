// Legacy-cache removal worker. It caches nothing: it empties Cache Storage,
// unregisters itself, and leaves the origin with no service worker.
// Ship it at /sw.js so Gatsby's gatsby-plugin-offline worker fetches it on its
// next update check and gets replaced instead of serving stale pages.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
    })()
  );
});
