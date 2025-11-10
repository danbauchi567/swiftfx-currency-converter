self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('swiftfx-v1').then(cache =>
      cache.addAll(['/', '/index.html', '/styles.css', '/script.js', '/logos.svg'])
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});