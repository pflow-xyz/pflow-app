package main

import (
	"github.com/pflow-xyz/pflow-app/metamodel"
	"github.com/pflow-xyz/pflow-app/metamodel/image"
	"github.com/pflow-xyz/pflow-app/metamodel/url"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// write as json
		w.Header().Set("Content-Type", "application/json")
		model := metamodel.NewModel()
		url.ImportFromUrl(model, r.URL.String())
		w.Write([]byte(model.ToJson()))
	})

	http.HandleFunc("/img/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "image/svg+xml")
		model := metamodel.NewModel()
		url.ImportFromUrl(model, r.URL.String())
		svg := image.ExportAsSvg(model)
		w.Write([]byte(svg))
	})

	http.ListenAndServe(":8080", nil)
}
