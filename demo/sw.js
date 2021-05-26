importScripts('https://cdn.jsdelivr.net/gh/yisar/labor/sw.js')

addEventListener('install', (event) => {
  event.waitUntil(skipWaiting())
})

addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})


registerLaborListener('out.wasm', { base: 'api' }).then((labor) => {
  new Function('labor', `with(labor){

      http.get('/hello')
      http.serve()
      
    }`)(labor)
})
