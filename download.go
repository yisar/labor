package labor

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"syscall/js"
)

func Download(url string) interface{} {
  res, _ := http.Get(url)
	b, _ := ioutil.ReadAll(res.Body)
	fmt.Println(res)
	body := js.Global().Get("Uint8Array").New(len(b))
	js.CopyBytesToJS(body, b)
	return body
}