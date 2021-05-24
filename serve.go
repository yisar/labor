package labor

import (
	"fmt"
	"net/http"
	"strings"
	"syscall/js"
)

func Serve(handler http.Handler) func() {
	var h = handler
	if h == nil {
		h = http.DefaultServeMux
	}

	var prefix = js.Global().Get("labor").Get("path").String()
	for strings.HasSuffix(prefix, "/") {
		prefix = strings.TrimSuffix(prefix, "/")
	}

	if prefix != "" {
		var mux = http.NewServeMux()
		mux.Handle(prefix+"/", http.StripPrefix(prefix, h))
		h = mux
	}

	var cb = js.FuncOf(func(_ js.Value, args []js.Value) interface{} {
		var resPromise, resolve, reject = NewPromise()

		go func() {
			defer func() {
				if r := recover(); r != nil {
					if err, ok := r.(error); ok {
						reject(fmt.Sprintf("labor: panic: %+v\n", err))
					} else {
						reject(fmt.Sprintf("labor: panic: %v\n", r))
					}
				}
			}()

			var res = NewResponseRecorder()

			h.ServeHTTP(res, Request(args[0]))

			resolve(res)
		}()

		return resPromise
	})

	js.Global().Get("labor").Call("setHandler", cb)

	return cb.Release
}
