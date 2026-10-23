// Service worker de Cuentas Claras. Solo cachea los archivos de la app: tus datos están en localStorage y no se tocan.
const VERSION='0.2.1';
const CACHE='cuentas-claras-'+VERSION;
const ARCHIVOS=['./','./index.html','./manifest.webmanifest','./inter.woff','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARCHIVOS.map(u=>new Request(u,{cache:'reload'})))));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('cuentas-claras-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data==='actualizar')self.skipWaiting();});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 if(r.mode==='navigate'||r.destination==='document'){ // red primero: así llega la versión nueva al abrir; sin red, la copia guardada
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));}return res;}).catch(()=>caches.match('./index.html',{ignoreSearch:true})));return;}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(ca=>ca.put(r,cp));}return res;})));});
