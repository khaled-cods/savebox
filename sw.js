const V="sb-v3",SHELL=["./","index.html","app.js","config.js","supabase.min.js","qrcode.js","jsqr.js","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="sb-share").map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method==="POST"&&u.pathname.endsWith("/share")){e.respondWith(handleShare(r));return}
 if(r.method!=="GET"||u.origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("index.html"))));
});
async function handleShare(r){
 try{
  const fd=await r.formData(),c=await caches.open("sb-share");
  for(const k of await c.keys())await c.delete(k);
  const text=[fd.get("title"),fd.get("text"),fd.get("url")].filter(Boolean);
  await c.put("/text",new Response(JSON.stringify({title:fd.get("title")||"",text:fd.get("text")||"",url:fd.get("url")||""}),{headers:{"content-type":"application/json"}}));
  let i=0;for(const f of fd.getAll("files")){if(f&&f.size){await c.put("/f"+(i++),new Response(f,{headers:{"x-name":encodeURIComponent(f.name||"file"),"content-type":f.type||"application/octet-stream"}}))}}
 }catch(e){}
 return Response.redirect("./?shared=1",303);
}

self.addEventListener("push",e=>{
 let d={};try{d=e.data.json()}catch(x){d={title:"SaveBox",body:e.data?e.data.text():""}}
 e.waitUntil((async()=>{
  const cs=await clients.matchAll({type:"window",includeUncontrolled:true});
  if(cs.some(c=>c.focused&&c.visibilityState==="visible"))return;
  await self.registration.showNotification(d.title||"SaveBox",{body:d.body||"",tag:d.tag||"sb",icon:"icon-192.png",badge:"icon-192.png",renotify:true,dir:"auto",data:{url:"./"}});
 })());
});
self.addEventListener("notificationclick",e=>{
 e.notification.close();
 e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{const c=cs.find(x=>"focus" in x);if(c)return c.focus();return clients.openWindow("./")}));
});
