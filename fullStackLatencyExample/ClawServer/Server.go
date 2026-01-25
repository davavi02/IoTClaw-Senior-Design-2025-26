package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

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

	server.router.HandleFunc("/api/login", server.handleGoogleLogin).Methods("POST")
	server.router.HandleFunc("/api/profile", server.getProfileData).Methods("GET")
	server.router.HandleFunc("/api/creategame", serv).Methods()

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

func (server *Server) handleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	tokenString := getAuthHeaderToken(w, r)
	if tokenString == "" {
		http.Error(w, "Must have auth header", http.StatusUnauthorized)
		return
	}

	user := VerifyAndGetGoogleUser(tokenString, r.Context())
	if user == nil {
		http.Error(w, "Authorization failed.", http.StatusUnauthorized)
		return
	}

	//check if user exists in db otherwise we make one.
	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	//See if user exists and get it if it does.
	userProfile, err := GetUserDataFromDatabaseByGID(r.Context(), trx, user.GoogleID)
	//two things can go wrong here its not in db so we make one or actual err
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	//Gotta make one
	if userProfile == nil {
		userProfile, err = InsertNewUserInDatabase(r.Context(), trx, user)

		if err != nil || userProfile == nil {
			http.Error(w, "Issue with database.", http.StatusInternalServerError)
			return
		}
	}

	//Got userProfile data now. Time to make the JWT
	userProfile.Jwt, err = createToken(userProfile.DatabaseUID, false)
	if err != nil {
		http.Error(w, "Issue creating auth token.", http.StatusInternalServerError)
		return
	}

	//Commit trx and send.
	err = trx.Commit()
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	//Responding
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(userProfile)
	if err != nil {
		http.Error(w, "Issue creating responce.", http.StatusInternalServerError)
		return
	}
}

func authCheckMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := getAuthHeaderToken(w, r)
		if tokenString == "" {
			http.Error(w, "Must have auth header", http.StatusUnauthorized)
			return
		}

		err := verifyToken(tokenString)

		if err != nil {
			http.Error(w, "Not authorized, sorry.", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func getAuthHeaderToken(w http.ResponseWriter, r *http.Request) string {
	authhead := r.Header.Get("Authorization")
	if authhead == "" {
		http.Error(w, "Must have auth header", http.StatusUnauthorized)
		return ""
	}

	if !strings.HasPrefix(authhead, "Bearer ") {
		http.Error(w, "Auth must be in format 'Bearer -tokenhere-'.", http.StatusUnauthorized)
		return ""
	}
	tokenString := strings.TrimPrefix(authhead, "Bearer ")
	return tokenString
}

func (server *Server) getProfileData(w http.ResponseWriter, r *http.Request) {
	tokenString := getAuthHeaderToken(w, r)
	if tokenString == "" {
		http.Error(w, "Auth must be in format 'Bearer -tokenhere-'.", http.StatusUnauthorized)
		return
	}

	jwtData := getJwtData(tokenString)
	if jwtData == nil {
		http.Error(w, "Authorization failed.", http.StatusUnauthorized)
		return
	}

	//check if user exists in db otherwise we make one.
	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	//get the uid
	uid, err := strconv.ParseInt(jwtData.UserId, 10, 64)
	if err != nil {
		http.Error(w, "Issue with JWT", http.StatusUnauthorized)
	}

	//See if user exists and get it if it does.
	userProfile, err := GetUserDataFromDatabaseByUID(r.Context(), trx, uid)
	//two things can go wrong here its not in db so we make one or actual err
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	//Commit trx and send.
	err = trx.Commit()
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	//Responding
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(userProfile)
	if err != nil {
		http.Error(w, "Issue creating responce.", http.StatusInternalServerError)
		return
	}
}

func (server *Server) handleCreateGameRoom(w http.ResponseWriter, r *http.Request) {

}
