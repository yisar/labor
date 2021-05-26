package labor

import (
	"io/ioutil"
	"syscall/js"
)

func Download(url string) interface{} {
  res, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}
	body = js.Global().Get("Uint8Array").New(len(b))
	js.CopyBytesToJS(body, b)
	return body
}