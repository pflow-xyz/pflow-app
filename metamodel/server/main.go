package main

import "net/http"

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})

	http.HandleFunc("/img/", func(w http.ResponseWriter, r *http.Request) {
		// read model from URL and render it as an image
	})

	http.ListenAndServe(":8080", nil)
}
