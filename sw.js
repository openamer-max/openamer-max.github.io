/* OpenAmer PWA — Service Worker
 *
 * Strategie:
 *   Navigation (die App-Seite): erst Netz, sonst Cache  -> Updates kommen an,
 *                               offline startet sie trotzdem
 *   Icons/Manifest:             erst Cache, sonst Netz  -> schneller Start
 *
 * Wichtig: der Service Worker laeuft nur ueber HTTPS oder auf localhost.
 */

const VERSION = 'openamer-app-v2';
const SHELL = [
  '/',
  '/manifest.webmanifest',
  '/logo.png',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Modelle/Provider nie abfangen

  const isNavigation = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((hit) => {
            if (hit) return hit;
            // Nur die App selbst bekommt den Shell-Rueckfall
            if (url.pathname === '/' || url.pathname === '/index.html') return caches.match('/');
            return Response.error();
          }))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
