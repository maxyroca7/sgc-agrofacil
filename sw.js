// ============================================================
//  sw.js — Agrofacil SGC · v38
//  Cambio v38:
//    - sync.js v1.3: el guardado empuja SOLO el lote que cambió
//      (antes re-subía TODO el array en cada guardado → miles de
//       escrituras de más, que reventaban la cuota diaria de Firestore).
//      Firma por lote (_syncSig) sembrada desde la nube en pullLotes
//      y en el listener para no re-subir lo que vino del servidor.
//  (v37: sync.js v1.2 conflict-resolution de LOTES por lastModified)
//  (v36: sync.js v1.1 NCs a nc/registro + resolver QR multi-estrategia)
// ============================================================

const CACHE_NAME = 'agrofacil-v38';
const ASSETS = [
  '/login.html',
  '/home.html',
  '/REG01_planilla_digital.html',
  '/registro_nc.html',
  '/coordinadora.html',
  '/historial.html',
  '/firebase-init.js',
  '/roles.js',
  '/sync.js',
  '/cfg-loader.js',
  '/print-lote.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon-32.png',
];

// ── INSTALL: precachea todos los assets ──────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v37] Precacheando assets...');
      // addAll individual tolerante: si un asset falla, no rompe el resto
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) =>
            console.warn('[SW v37] No se pudo cachear:', url, err.message)
          )
        )
      );
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
            console.log('[SW v37] Eliminando caché viejo:', key);
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
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match(request))
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
