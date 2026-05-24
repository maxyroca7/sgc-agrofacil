// ════════════════════════════════════════════════════
// SERVICE WORKER — REG-01 Agrofacil SGC Digital
// Estrategia: cache-first para el HTML principal,
// network-first para recursos externos (fuentes, libs)
// ════════════════════════════════════════════════════

const CACHE = 'reg01-v5';
const ARCHIVOS = [
  './REG01_planilla_digital.html',
  './registro_nc.html',
  './manifest.json',
];

// Instalar: cachear archivos del proyecto
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
      .catch(err => console.log('Cache install error:', err))
  );
});

// Activar: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => clients.claim())
  );
});

// Fetch: cache-first para archivos locales
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Recursos externos (fuentes Google, SheetJS CDN): red con fallback
  if(url.origin !== self.location.origin){
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Archivos locales: cache-first (funciona offline)
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if(cached) return cached;
        return fetch(e.request).then(r => {
          caches.open(CACHE).then(c => c.put(e.request, r.clone()));
          return r;
        });
      })
  );
});
