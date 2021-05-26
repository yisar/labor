importScripts('./wasm_exec.js')

self.labor = {
  http: {},
  fs: {},
}

function registerLaborListener(wasm, { base, args = [] } = {}) {
  let path = new URL(registration.scope).pathname
  if (base && base !== '') path = `${trimEnd(path, '/')}/${trimStart(base, '/')}`

  const handlerPromise = new Promise(setHandler => {
    self.labor.path = path
    self.labor.setHandler = setHandler
  })

  addEventListener('fetch', e => {
    const { pathname } = new URL(e.request.url)
    if (!pathname.startsWith(path)) return
    e.respondWith(handlerPromise.then(handler => handler(e.request)))
  })

  return new Promise((resolve) => {
    const go = new Go()
    go.argv = [wasm, ...args]
    WebAssembly.instantiateStreaming(fetch(wasm), go.importObject).then(({ instance }) => {
      go.run(instance)
      resolve(self.labor)
    })
  })
}

function excute(script){
  new Function('labor', `with(labor){${script}}`)(self.labor)
}

function trimStart(s, c) {
  let r = s
  while (r.startsWith(c)) r = r.slice(c.length)
  return r
}

function trimEnd(s, c) {
  let r = s
  while (r.endsWith(c)) r = r.slice(0, -c.length)
  return r
}

self.labor.require = (path) => {
  if (path in self.labor) {
    return self.labor[path]
  }
}