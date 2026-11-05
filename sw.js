/* İnciland servis çalışanı: oyun internetsiz de açılır */
const V='inci-koyu-c969eab5';
const SHELL=['./','index.html','manifest.webmanifest','icons/i192.png','icons/i512.png','icons/m512.png','icons/a180.png','icons/f32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  /* yazı tipleri: önce önbellek, arkada güncelle */
  if(u.host.includes('fonts.googleapis.com')||u.host.includes('fonts.gstatic.com')){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>hit);return hit||net})));return}
  if(u.origin!==location.origin)return;
  /* oyun dosyaları: önce ağ (güncel sürüm), yoksa önbellek */
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(h=>h||caches.match('index.html'))))});
