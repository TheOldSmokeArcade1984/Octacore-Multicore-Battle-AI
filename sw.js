const CACHE_NAME = 'octacore-cache-v12';

// Elenco esatto di tutti i file che compongono il gioco
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.jpg'
];

// FASE 1: Installazione (Scarica i file e li salva nella cache del telefono/PC)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache neurale locale v12 aperta con successo');
        return cache.addAll(urlsToCache);
      })
  );
});

// FASE 2: Intercettazione (Quando il gioco chiede un file, lo cerca prima in cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se il file esiste nella cache, servilo direttamente (Offline mode)
        if (response) {
          return response;
        }
        // Altrimenti, prova a scaricarlo da internet
        return fetch(event.request);
      })
  );
});

// FASE 3: Attivazione (Pulisce i vecchi file se hai aggiornato la versione della cache)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Cancellazione vecchi settori di memoria PWA...');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});