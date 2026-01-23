package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Server struct {
	router *mux.Router
	dbMan  *DatabaseManager
}

func CreateServer() *Server {
	server := &Server{}

	dbManager, err := InitializeDatabase()
	if err != nil || dbManager == nil {
		fmt.Println("Error initializing database.")
		return nil
	}
	server.dbMan = dbManager

	if !server.createRoutes() {
		fmt.Println("Error creating routes.")
		return nil
	}

	return server
}

func (server *Server) Run(port string) error {

	err := http.ListenAndServe(port, server.router)
	if err != nil {
		log.Fatal("Fatal Error: ", err)
	}
	return nil
}

func (server *Server) createRoutes() bool {
	server.router = mux.NewRouter()

	//Ensure we initialized correctly.
	if server.router == nil {
		return false
	}

	//==============@#!$@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@# TEMPORARY FROM OLD MAIN
	cabHub1 := newHub("cab1122!!@@", "cli1122!!@@")
	go cabHub1.run()

	//Create paths
	server.router.HandleFunc("/cab1/client", func(w http.ResponseWriter, r *http.Request) {
		serveWs(cabHub1, w, r, false)
	})

	server.router.HandleFunc("/cab1/cab", func(w http.ResponseWriter, r *http.Request) {
		serveWs(cabHub1, w, r, true)
	})

	return true
}
