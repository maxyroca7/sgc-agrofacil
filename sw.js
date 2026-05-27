// ============================================================
//  sw.js — Agrofacil SGC · v24
//  Cambio v24: checks TRAZAB./QR, PACKAGING, PALETIZ. en vista tabla landscape
// ============================================================

const CACHE_NAME = 'agrofacil-v24';

const ASSETS = [
  '/login.html',
  '/home.html',
  '/REG01_planilla_digital.html',
  '/registro_nc.html',
  '/historial.html',
  '/firebase-init.js',
  '/sync.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── INSTALL: precachea todos los assets ──────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v18] Precacheando assets...');
      return cache.addAll(ASSETS);
    })
  );
  // Activa inmediatamente sin esperar que se cierren pestañas viejas
  self.skipWaiting();
});

// ── ACTIVATE: elimina cachés anteriores ─────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW v18] Eliminando caché viejo:', key);
            return caches.delete(key);
          })
      )
    )
  );
  // Toma control de todas las pestañas abiertas de inmediato
  self.clients.claim();
});

// ── FETCH: Network-first para HTML, Cache-first para assets ─
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar requests del mismo origen
  if (url.origin !== location.origin) return;

  const isHTML = request.destination === 'document' ||
                 url.pathname.endsWith('.html') ||
                 url.pathname === '/';

  if (isHTML) {
    // Network-first para HTML: siempre intenta traer la versión fresca
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Actualiza el caché con la versión fresca
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback: sirve desde caché
          return caches.match(request);
        })
    );
  } else {
    // Cache-first para JS, CSS, imágenes, manifest
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        });
      })
    );
  }
});
