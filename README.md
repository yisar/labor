# Labor

Implementation of [Web Container](https://github.com/stackblitz/webcontainer-core)

### Detail

```js
code => js runtime => rust/go wasm API
```

举个例子

```js
const res = await readFile('a.js')
```
这一句代码中的 `readFile` 最终是要执行到 rust/go 中的 API 的，但到底怎么将 go 的 API 注入进去的呢？

此时就需要 go 注入到全局一个 API

```go
js.Global().Set("readFile", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
    readFile(args[0].String()) // 相当于 eval
    return nil
}))
```
我们在 js 侧，只需要直接调用，不需要发接口

```js
new Function('readFile', `const res = await readFile('a.js')`)(readFile)
```
大功告成，就是如此简单，在 wasm 端实现 API，然后在 js 侧注入到字符串里即可

但还没完，那么问题来了，文件系统呢？http呢？

这就得看 go 对 WASI 的支持程度了，亲测 `net/http` 包大部分支持良好，但不能启端口，`osutil` 包内存 API 是支持的


demo 只是打个比方，这个项目我会用 go 写，因为 docker 也是用 go 写的

值得一提的是，为了获得更好的性能和大小，我们接下来会使用类似 [tinygo](https://github.com/tinygo-org/tinygo) 的编译器

但是 trip worker 我还是会用 rust 实现，理由和 deno 一样，所以本质上，同一套标准库，我得写两遍了，呜呜呜

