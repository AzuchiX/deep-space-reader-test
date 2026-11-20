const CACHE='deep-space-reader-v1.2.1-test';
const SHELL=['./','./index.html','./icon.svg','./manifest.webmanifest','./version.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('deep-space-reader-')&&k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
if(e.request.url.includes('version.json')){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return}
e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){let copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}return r}).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):Response.error())))});
