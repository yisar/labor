importScripts('https://cdn.jsdelivr.net/gh/yisar/labor/sw.js')

addEventListener('install', (event) => {
  event.waitUntil(skipWaiting())
})

addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})

registerLaborListener('api.wasm', { base: 'api' })
