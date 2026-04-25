const CACHE_NAME = 'flex-rail-map-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon_flex_rail_way_map.png',
];

// インストール時：静的アセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ時：Network First（最新データ優先）、失敗時はキャッシュから
self.addEventListener('fetch', (event) => {
  // chrome-extensionやdata URIはスキップ
  if (!event.request.url.startsWith('http')) return;
  // Leafletタイルは除外（常にネットワーク）
  if (event.request.url.includes('tile')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
