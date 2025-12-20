// No-op Service Worker to fix 503 errors and caching issues during development
self.addEventListener('install', (_event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Pass through all fetch requests without intercepting or returning 503
self.addEventListener('fetch', (_event) => {
  return;
});