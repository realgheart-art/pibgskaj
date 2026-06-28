/* Service Worker — Portal PIBG SK Alor Janggus */
const CACHE = 'sehati-skaj-v2';
const ASET = ['./', './index.html', './manifest.json', './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASET)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Jangan cache panggilan API GAS (sentiasa ambil data terkini)
  if (req.url.includes('script.google.com')) {
    e.respondWith(fetch(req).catch(() => new Response('{"ok":false,"offline":true}',
      { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  // Aset statik: cache-first
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const salinan = res.clone();
      caches.open(CACHE).then(c => c.put(req, salinan));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
