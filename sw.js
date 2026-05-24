// ════════════════════════════════════════════
// SERVICE WORKER — SGC Digital Agrofacil
// Versión: v15
// Estrategia: cache-first local · network-first externos
// ════════════════════════════════════════════

const CACHE = 'reg01-v15';
const ARCHIVOS = [
  './REG01_planilla_digital.html',
  './registro_nc.html',
  './manifest.json',
  './favicon.svg',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './icon-192x192.png',
  './icon-512x512.png',
];

// Instalar: pre-cachear todos los archivos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// Activar: eliminar cachés viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first para archivos locales, network-first para externos
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Ignorar extensiones de Chrome y peticiones no GET
  if (e.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Para archivos externos (CDN, fonts) → network-first
  if (url.origin !== self.location.origin) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Para archivos locales → cache-first (ignorar querystring para el match)
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(url.pathname).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(resp => {
          if (resp && resp.status === 200) {
            cache.put(url.pathname, resp.clone());
          }
          return resp;
        });
      })
    )
  );
});
