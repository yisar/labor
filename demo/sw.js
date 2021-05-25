importScripts('https://cdn.staticaly.com/gh/yisar/labor/main/sw.js?env=dev')

addEventListener('install', (event) => {
  event.waitUntil(skipWaiting())
})

addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})


registerLaborListener('out.wasm', { base: 'api' }).then((global) => {
  new Function('global', `
  
    with(global){
      httpGet('/hello')
      httpServe()
    }
  
`)(global)
})
