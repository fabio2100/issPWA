const CACHE_NAME = 'v1_cache_iss'
urlsToCache = [
  './',
  './style.css',
  './script.js',
  './img/satellite256.png'
]

//En la instalación se almacenan en cache los estáticos
self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(urlsToCache)
        .then(()=>{self.skipWaiting()})
    })
    .catch(err=>{console.log(err)})
  )
})

//Recursos para funcionar sin conexión
self.addEventListener("activate",e=>{
  const cacheWhitelist = [CACHE_NAME]
  e.waitUntil(
    caches.keys()
    .then(cachesName=>{
      cachesName.map(cacheName=>{
        if(cacheWhitelist.indexOf(cacheName)===-1){
          return caches.delete(cacheName)
        }
      })
    })
    .then(()=>self.clients.claim())
  )
})


//evento fetch.> se encarga de recuperar los rr del navegador 

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request)
    .then(res => {
      if (res){
        return res
      }
      return fetch(e.request)
    }
    
    ) 
  )
})