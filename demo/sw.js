importScripts('./labor.js')

addEventListener('install', (event) => {
  event.waitUntil(skipWaiting())
})

addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})

registerLaborListener('out.wasm', { base: 'api' }).then((labor) => {
  excute(`
    const http = require('http')
    http.get('/hello')
    http.serve()
  `)

  // const buffer = self.labor.http.download('https://berial.vercel.app')
  // console.log(buffer)
})
