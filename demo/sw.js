importScripts('https://cdn.jsdelivr.net/gh/yisar/labor/sw.js')

addEventListener('install', (event) => {
  event.waitUntil(skipWaiting())
})

addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})


registerLaborListener('out.wasm', { base: 'api' })

setTimeout(() => {
  console.log(123)
  new Function('global', `
  
    with(global){
      httpGet('/hello')
      httpServe()
    }
  
`)(global)
}, 1000)
