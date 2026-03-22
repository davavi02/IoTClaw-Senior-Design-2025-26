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
	rooms  *ActiveGames
}

func CreateServer() *Server {
	server := &Server{rooms: InitializeGamerooms()}

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

	//These either are unprotected routes, one uses user/pass one uses
	server.router.HandleFunc("/api/login", server.handleGoogleLogin).Methods("POST")
	server.router.HandleFunc("/api/creategame", server.handleCreateGameRoom).Methods("POST")

	//These are protected by our jwts
	apiRoute := server.router.PathPrefix("/api").Subrouter()
	apiRoute.HandleFunc("/profile", server.getProfileData).Methods("GET")
	apiRoute.HandleFunc("/profile", server.updateProfileData).Methods("POST")
	apiRoute.HandleFunc("/tokens", server.handleGetTokens).Methods("GET")
	apiRoute.HandleFunc("/join/{game}", server.handleJoinRoom).Methods("GET")
	apiRoute.HandleFunc("/games", server.handleGetGames).Methods("GET")
	apiRoute.HandleFunc("/shop", server.handleGetProducts).Methods("GET")
	apiRoute.HandleFunc("/address", server.handleGetAddress).Methods("GET")
	apiRoute.HandleFunc("/address", server.handleUpdateAddress).Methods("POST")
	apiRoute.HandleFunc("/buy/{id}", server.handleBuyProduct).Methods("POST")
	apiRoute.HandleFunc("/report-error", server.handleReportError).Methods("POST")
	apiRoute.HandleFunc("/prizes", server.handleGetPrizes).Methods("GET")
	apiRoute.Use(authCheckMiddleware)

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
	userProfile.Jwt, err = createToken(userProfile.DatabaseUID, false, false)
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

	//Get uid..
	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
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

type updateProfileBody struct {
	Name string `json:"name"`
}

func (server *Server) updateProfileData(w http.ResponseWriter, r *http.Request) {
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

	var body updateProfileBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	name := strings.TrimSpace(body.Name)
	if name == "" || len(name) > 120 {
		http.Error(w, "Name must be 1–120 characters", http.StatusBadRequest)
		return
	}

	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
	}

	if err := UpdateUserDisplayName(r.Context(), trx, uid, name); err != nil {
		http.Error(w, "Issue updating profile.", http.StatusInternalServerError)
		return
	}

	userProfile, err := GetUserDataFromDatabaseByUID(r.Context(), trx, uid)
	if err != nil || userProfile == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	if err = trx.Commit(); err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(userProfile); err != nil {
		http.Error(w, "Issue creating responce.", http.StatusInternalServerError)
		return
	}
}

type reportErrorBody struct {
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func (server *Server) handleReportError(w http.ResponseWriter, r *http.Request) {
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

	var body reportErrorBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	message := strings.TrimSpace(body.Message)
	if len(message) < 5 {
		http.Error(w, "Message must be at least 5 characters", http.StatusBadRequest)
		return
	}
	if len(message) > 4000 {
		http.Error(w, "Message too long (max 4000 characters)", http.StatusBadRequest)
		return
	}

	subject := strings.TrimSpace(body.Subject)
	if subject == "" {
		subject = "General"
	}
	if len(subject) > 200 {
		http.Error(w, "Subject too long (max 200 characters)", http.StatusBadRequest)
		return
	}

	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
	}

	if err := InsertErrorReport(r.Context(), trx, uid, subject, message); err != nil {
		http.Error(w, "Could not save report. Ensure ErrorReport table exists (see DBSChema/Setup.txt).", http.StatusInternalServerError)
		return
	}

	if err = trx.Commit(); err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"ok":true}`))
}

func (server *Server) handleGetPrizes(w http.ResponseWriter, r *http.Request) {
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

	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
	}

	prizes, err := GetUserPrizesForUID(r.Context(), server.dbMan.db, uid)
	if err != nil {
		http.Error(w, "Issue loading prizes. Ensure UserPrize table exists (see DBSChema/Setup.txt).", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string][]UserPrizeJSON{"prizes": prizes})
}

func (server *Server) handleCreateGameRoom(w http.ResponseWriter, r *http.Request) {
	gameData := &GameData{}
	//Get json out.
	err := json.NewDecoder(r.Body).Decode(gameData)
	if err != nil {
		http.Error(w, "Invalid data sent", http.StatusUnauthorized)
		return
	}

	//Unnessarry db transactions but it should be fine. Just trying to stay consistent
	//and copying and pasting from my other functions makes this go faster lol.
	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	//Validating the credentials..
	err = HandleGameDataLogin(r.Context(), trx, gameData)
	if err != nil {
		http.Error(w, "Unauthorizaed.", http.StatusUnauthorized)
		return
	}

	///check if game exists
	if server.rooms.DoesGameExist(gameData) {
		//Game exists...
		http.Error(w, "Game already made", http.StatusConflict)
		return
	}

	if server.rooms.CreateGame(gameData) {
		http.Error(w, "Game creation issue", http.StatusInternalServerError)
		return
	}

	//make a jwt and send it mann
	token, err := createToken(gameData.UniqueId, false, true)
	if err != nil {
		http.Error(w, "Error issuing token", http.StatusInternalServerError)
		return
	}

	//Commit trx and send.
	err = trx.Commit()
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	//Send token.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(map[string]string{"jwt": token})
	if err != nil {
		http.Error(w, "Issue creating responce.", http.StatusInternalServerError)
		return
	}
}

func (server *Server) handleJoinRoom(w http.ResponseWriter, r *http.Request) {
	jwtData := getJwtData(getAuthHeaderToken(w, r))
	if jwtData == nil {
		http.Error(w, "Issue authorizing.", http.StatusUnauthorized)
		return
	}
	server.rooms.JoinGame(w, r, jwtData)
}

func (server *Server) handleGetAddress(w http.ResponseWriter, r *http.Request) {
	jwtData := getJwtData(getAuthHeaderToken(w, r))
	if jwtData == nil {
		http.Error(w, "Issue authorizing.", http.StatusUnauthorized)
		return
	}
	//Stop cabinents from getting addys
	if jwtData.IsGame {
		http.Error(w, "unauthorized.", http.StatusUnauthorized)
		return
	}

	//Unnessarry db transactions but it should be fine. Just trying to stay consistent
	//and copying and pasting from my other functions makes this go faster lol.
	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	//Get uid..
	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
	}

	addyData, err := GetAddressData(r.Context(), trx, uid)
	if err != nil {
		http.Error(w, "Unauthorizaed.", http.StatusUnauthorized)
		return
	}

	//Commit trx and send.
	err = trx.Commit()
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	//Send dataa.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(addyData)
	if err != nil {
		http.Error(w, "Issue creating responce.", http.StatusInternalServerError)
		return
	}
}

func (server *Server) handleUpdateAddress(w http.ResponseWriter, r *http.Request) {
	jwtData := getJwtData(getAuthHeaderToken(w, r))
	if jwtData == nil {
		http.Error(w, "Issue authorizing.", http.StatusUnauthorized)
		return
	}
	//Stop cabinents from updating addys
	if jwtData.IsGame {
		http.Error(w, "unauthorized.", http.StatusUnauthorized)
		return
	}

	//Get uid..
	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
	}

	addyData := &AddressData{UniqueId: uid}

	err = json.NewDecoder(r.Body).Decode(addyData)

	//Unnessarry db transactions but it should be fine. Just trying to stay consistent
	//and copying and pasting from my other functions makes this go faster lol.
	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	//UPDATE
	err = UpdateAddressData(r.Context(), trx, addyData)
	if err != nil {
		http.Error(w, "Issue with database", http.StatusInternalServerError)
		return
	}

	//Commit trx and send.
	err = trx.Commit()
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	//Send response
	w.WriteHeader(http.StatusOK)
}

func (server *Server) handleGetGames(w http.ResponseWriter, r *http.Request) {
	err := server.rooms.GetGamesList(w, r)
	if err != nil {
		fmt.Println("Error, getting games list.")
		return
	}
}

func (server *Server) handleGetTokens(w http.ResponseWriter, r *http.Request) {
	//Get the users data.
	jwtData := getJwtData(getAuthHeaderToken(w, r))
	if jwtData == nil {
		http.Error(w, "Issue authorizing.", http.StatusUnauthorized)
		return
	}

	//Get uid..
	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
	}

	tokenData := GetUserTokenData(r.Context(), server.dbMan.db, uid)
	if tokenData == nil {
		http.Error(w, "Issue retrieving records.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(tokenData)
	if err != nil {
		http.Error(w, "Error parsing json.", http.StatusInternalServerError)
	}
}

func (server *Server) handleGetProducts(w http.ResponseWriter, r *http.Request) {
	err := GetShopProducts(w, r, server.dbMan.db)
	if err != nil {
		fmt.Println("Error getting shop products.")
		return
	}
}

func (server *Server) handleBuyProduct(w http.ResponseWriter, r *http.Request) {
	jwtData := getJwtData(getAuthHeaderToken(w, r))
	if jwtData == nil {
		http.Error(w, "Issue authorizing.", http.StatusUnauthorized)
		return
	}

	//Stop cabinents from buying tokens
	if jwtData.IsGame {
		http.Error(w, "unauthorized.", http.StatusUnauthorized)
		return
	}

	//Get product id passed
	vars := mux.Vars(r)
	pidString := vars["id"]

	//converyt to int64
	pid, err := strconv.ParseInt(pidString, 10, 64)
	if err != nil {
		http.Error(w, "Invalid url.", http.StatusBadRequest)
		return
	}

	//Unnessarry db transactions but it should be fine. Just trying to stay consistent
	//and copying and pasting from my other functions makes this go faster lol.
	trx, err := server.dbMan.BeginTransaction(r.Context())
	if err != nil || trx == nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}
	defer trx.Rollback()

	//Get uid..
	uid, err := jwtData.GetUserIdAsInt64()
	if err != nil {
		http.Error(w, "Issue with uids.", http.StatusInternalServerError)
		return
	}

	tokenData := PurchaseProduct(r.Context(), trx, pid, uid)
	if err != nil {
		http.Error(w, "Unauthorizaed.", http.StatusUnauthorized)
		return
	}

	//Commit trx and send.
	err = trx.Commit()
	if err != nil {
		http.Error(w, "Issue with database.", http.StatusInternalServerError)
		return
	}

	//Send dataa.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(tokenData)
	if err != nil {
		http.Error(w, "Issue creating responce.", http.StatusInternalServerError)
		return
	}
}
