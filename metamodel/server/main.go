package main

import (
	"github.com/pflow-xyz/pflow-app/metamodel"
	"github.com/pflow-xyz/pflow-app/metamodel/image"
	"github.com/pflow-xyz/pflow-app/metamodel/url"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		model := metamodel.NewModel()
		url.ImportFromUrl(model, r.URL.String())
		model.ToJson(w)
	})

	http.HandleFunc("/img/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "image/svg+xml")
		model := metamodel.NewModel()
		url.ImportFromUrl(model, r.URL.String())
		image.ExportAsSvg(model, w)
	})

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		println(err)
	}
}
