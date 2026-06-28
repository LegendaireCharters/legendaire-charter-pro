const CACHE='legendaire-charter-pro-html-v6-lite';
const ASSETS=['./','./index.html','./css/style.css','./data/airports.js','./data/aircraft.js','./js/app.js','./js/map.js','./js/quote-engine.js','./manifest.json','./icons/icon-192.svg','./icons/icon-512.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
