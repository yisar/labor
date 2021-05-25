package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"syscall/js"

	labor "github.com/yisar/labor"
)

func main() {

	js.Global().Set("httpGet", js.FuncOf(func (this js.Value, args []js.Value) interface{} {
		path := args[0].String()
		httpGet(path)
		return nil
	}))

	js.Global().Set("httpServe", js.FuncOf(func (this js.Value, args []js.Value) interface{} {
		labor.Serve(nil)
		return nil
	}))

	select {}
}

func httpGet(path string) interface{}{
	http.HandleFunc(path, func(res http.ResponseWriter, req *http.Request) {
		params := make(map[string]string)
		if err := json.NewDecoder(req.Body).Decode(&params); err != nil {
			panic(err)
		}

		res.Header().Add("Content-Type", "application/json")
		if err := json.NewEncoder(res).Encode(map[string]string{
			"message": fmt.Sprintf("Hello %s!", params["name"]),
		}); err != nil {
			panic(err)
		}
	})
	return nil
}