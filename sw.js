const CACHE = 'menu-planner-v1';
const ASSETS = [
  './',
  './Recipe App Prototype.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Let API calls (Groq, MealDB) go straight to network
  if (e.request.url.includes('api.groq.com') ||
      e.request.url.includes('themealdb.com') ||
      e.request.url.includes('generativelanguage')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
