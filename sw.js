
const CACHE_NAME = 'cakes-n-bells-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  // Add other local assets here if you have them in public folder
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache core assets immediately
      return cache.addAll(ASSETS_TO_CACHE); 
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of open pages immediately
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Navigation Requests (HTML pages) -> Network First, Fallback to Cache
  // This ensures users always get the latest version if online, but app works if offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache with new version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, serve cached index.html
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // 2. Images -> Cache First, Fallback to Network
  // This saves data and makes the gallery feel instant.
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        
        return fetch(event.request).then((networkResponse) => {
           // Cache the new image for next time
           if(networkResponse && networkResponse.status === 200) {
             const responseClone = networkResponse.clone();
             caches.open(CACHE_NAME).then((cache) => {
               // We wrap in try-catch because opaque responses (from CDNs) can sometimes fail strict caching
               try { cache.put(event.request, responseClone); } catch(e) {}
             });
           }
           return networkResponse;
        });
      })
    );
    return;
  }

  // 3. JS/CSS/Fonts -> Stale-While-Revalidate
  // Serve cached immediately, but update in background
  if (url.pathname.match(/\.(js|css|woff2|woff)$/)) {
     event.respondWith(
       caches.match(event.request).then(cachedResponse => {
         const fetchPromise = fetch(event.request).then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
            return networkResponse;
         });
         return cachedResponse || fetchPromise;
       })
     );
     return;
  }

  // Default: Network only
  event.respondWith(fetch(event.request));
});
