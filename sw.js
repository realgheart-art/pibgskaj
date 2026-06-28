/* ============================================================
   Service Worker — SeHATI (Portal PIBG SK Alor Janggus)
   ------------------------------------------------------------
   PENTING: Setiap kali anda kemas kini index.html atau fail
   lain, TUKAR nombor VERSI di bawah (cth v2 -> v3). Ini memaksa
   service worker dipasang semula & cache lama dibersihkan,
   supaya semua pengguna dapat versi terkini.
   ============================================================ */
const VERSI = 'v3';
const CACHE = 'sehati-' + VERSI;

// Aset yang jarang berubah (cache-first untuk kelajuan)
const ASET_STATIK = ['./manifest.json', './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./', './index.html', ...ASET_STATIK]))
      .then(() => self.skipWaiting())   // pasang versi baru serta-merta
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())  // ambil alih semua tab terbuka
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = req.url;

  // 1) API Google Apps Script — sentiasa rangkaian (data terkini), jangan cache
  if (url.includes('script.google.com')) {
    e.respondWith(
      fetch(req).catch(() => new Response('{"ok":false,"offline":true}',
        { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // 2) Halaman & dokumen HTML — NETWORK-FIRST
  //    (sentiasa cuba versi terkini; guna cache hanya bila offline)
  if (req.mode === 'navigate' || url.endsWith('/') || url.endsWith('index.html')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const salinan = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', salinan));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 3) Aset statik lain — CACHE-FIRST (laju), kemas kini di latar
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const salinan = res.clone();
      caches.open(CACHE).then(c => c.put(req, salinan));
      return res;
    }).catch(() => cached))
  );
});

// Benarkan halaman minta SW baru aktif serta-merta
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
