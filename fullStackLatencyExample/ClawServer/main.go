//https://github.com/gorilla/websocket/blob/main/examples/chat/main.go

package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {

	router := mux.NewRouter()

	cabHub1 := newHub("cab1122!!@@", "cli1122!!@@")
	go cabHub1.run()

	router.HandleFunc("/cab1/client", func(w http.ResponseWriter, r *http.Request) {
		serveWs(cabHub1, w, r, false)
	})

	router.HandleFunc("/cab1/cab", func(w http.ResponseWriter, r *http.Request) {
		serveWs(cabHub1, w, r, true)
	})

	//What a exaple get rest api endpoint would look like to get the num clients connected to cabinent hub1
	//Note this function doesnt exist, as I didnt make a getUsers function
	//router.HandleFunc("/api/cab1/numClients", cabHub1.getUsers).Methods("GET")

	//err := http.ListenAndServe(":443", router)
	err := http.ListenAndServeTLS(":443", "server.crt", "server.key", router)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
