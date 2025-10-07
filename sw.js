const CACHE_NAME = 'beers-chope-v1';
const urlsToCache = [
  '/index.html',
  '/sw.js',
  '/manifest.json',
  '/icon-192.png', // Assure-toi d'avoir ces icônes
  '/icon-512.png',
  // Et toutes les autres ressources utilisées (CSS et JS sont intégrés, c'est facile !)
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Ouverture du cache et mise en cache des URLs');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes et réponse depuis le cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la ressource est dans le cache, on la retourne
        if (response) {
          return response;
        }
        // Sinon, on fait une requête réseau
        return fetch(event.request);
      })
  );
});

// Suppression des anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});