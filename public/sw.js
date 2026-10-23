/** Precaches the self-contained game so a repeat visit can work offline after the first load. */
const CACHE='ezra-be-hooping-v3-2026-10-23';
const STATIC=[
 './','./index.html','./src/game.js','./src/engine.mjs','./src/audio.mjs','./src/voice-clips.mjs','./src/styles.css','./manifest.webmanifest',
 './assets/icons/icon-192.png','./assets/icons/icon-512.png',
 './assets/game-art/backyard-scene.webp','./assets/game-art/playground-scene.webp','./assets/game-art/arena-scene.webp',
 './assets/game-art/backyard-card.webp','./assets/game-art/playground-card.webp','./assets/game-art/arena-card.webp',
 './assets/game-art/backyard-net.png','./assets/game-art/playground-net.png','./assets/game-art/arena-net.png',
 './assets/music/ezra-be-hooping-2.mp3','./assets/music/ezra-got-game.mp3',
 './assets/sounds/shot-whoosh.wav','./assets/sounds/net-swish.wav','./assets/sounds/ball-bounce.wav',
 './assets/sounds/rim-clang.wav','./assets/sounds/green-sparkle.wav','./assets/sounds/crowd-cheer.wav','./assets/sounds/final-buzzer.wav'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ezra-be-hooping-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 // iOS/Chrome media players request byte ranges. Serve actual 206 partial responses
 // from cached complete music files when available; otherwise use the network.
 const range=e.request.headers.get('range');
 if(range){
  e.respondWith(caches.match(e.request.url).then(async cached=>{
   if(!cached)return fetch(e.request);
   const match=/bytes=(\d+)-(\d*)/.exec(range);
   if(!match)return cached;
   const blob=await cached.blob(),start=Number(match[1]),end=match[2]?Number(match[2]):blob.size-1;
   const safeEnd=Math.min(end,blob.size-1);
   if(start>=blob.size||safeEnd<start)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${blob.size}`}});
   return new Response(blob.slice(start,safeEnd+1),{status:206,headers:{
    'Content-Type':cached.headers.get('Content-Type')||'audio/mpeg',
    'Content-Range':`bytes ${start}-${safeEnd}/${blob.size}`,
    'Content-Length':String(safeEnd-start+1),'Accept-Ranges':'bytes'
   }});
  }).catch(()=>fetch(e.request)));
  return;
 }
 // Cache-first prevents sudden mid-round visual changes if a deployment occurs during gameplay.
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
  if(res.ok) {const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}
  return res;
 }).catch(()=>caches.match('./index.html'))));
});
