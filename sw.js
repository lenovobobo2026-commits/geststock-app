const CACHE_NAME = 'geststock-v1.0.0';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installation — mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('GestStock PWA — fichiers mis en cache');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation — suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if(key !== CACHE_NAME){
          console.log('Ancien cache supprimé:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch — servir depuis le cache si hors ligne
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retourner le cache si disponible, sinon aller sur le réseau
      return response || fetch(event.request).catch(() => {
        return caches.match('/index.html');
      });
    })
  );
});