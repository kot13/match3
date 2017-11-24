package main

import (
	"github.com/googollee/go-socket.io"
	"log"
	"net/http"
)

func main() {
	log.Println("start")
	defer log.Println("stop")

	server, err := socketio.NewServer(nil)
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path)
		http.ServeFile(w, r, "www"+r.URL.Path)
	})

	http.Handle("/ws/", server)

	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Println("ListenAndServe: ", err)
		panic(err)
	}
}
