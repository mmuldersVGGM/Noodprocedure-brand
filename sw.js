const CACHE='npb-v3-4';
const ASSETS=[
  './','./index.html','./styles.css','./app.js','./manifest.json',
  './assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png',
  './assets/qr-noodprocedure-brand.png',
  './assets/ARO-Noodprocedure-Brandweer-concept-2026.pdf',
  './assets/Landelijke-Noodprocedure-Brand-2026.pdf',
  './assets/ARO-Noodprocedure-Brandweer-2021.pdf'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
