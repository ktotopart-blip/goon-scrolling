const V="goon-v1",M="goon-media",SHELL=["./","index.html","style.css","core.js","data.js","phrases.js","fx.js","settings.js","app.js","manifest.webmanifest","icon-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==M).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin||r.headers.has("range"))return;
  const media=/\/photos(_f)?\//.test(u.pathname);
  e.respondWith(caches.open(media?M:V).then(async c=>{
    const hit=await c.match(r);
    if(media&&hit)return hit;
    try{const x=await fetch(r);if(x.ok)c.put(r,x.clone());return x}catch(err){if(hit)return hit;throw err}}))});
