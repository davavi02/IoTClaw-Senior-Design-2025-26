package main

import (
	"encoding/json"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

type ActiveGames struct {
	activeGame map[string]*Hub

	sync.RWMutex
}

func InitializeGamerooms() *ActiveGames {
	return &ActiveGames{activeGame: make(map[string]*Hub)}
}

func (container *ActiveGames) CreateGame(game *GameData) bool {
	container.Lock()
	defer container.Unlock()

	_, ok := container.activeGame[game.Name]
	if ok {
		return ok
	}

	hub := newHub(container, game)
	container.activeGame[game.Name] = hub
	go hub.run()
	return false
}

func (container *ActiveGames) DoesGameExist(game *GameData) bool {
	container.Lock()
	defer container.Unlock()

	_, ok := container.activeGame[game.Name]
	return ok
}

// Todo i think this has a bug where a clinet can join the same room accross devices
func (container *ActiveGames) JoinGame(w http.ResponseWriter, r *http.Request, data *JWTData) {
	container.Lock()
	defer container.Unlock()
	vars := mux.Vars(r)
	gameName := vars["game"]
	hub, ok := container.activeGame[gameName]
	if !ok {
		http.Error(w, "Game does not exist", http.StatusBadRequest)
		return
	}
	if data.IsGame {
		if hub.gameData.Name != gameName {
			http.Error(w, "Games can only join their own games.", http.StatusForbidden)
		}
	}
	serveWs(hub, w, r, data)
}

// Realistically if I was doing something more production ready this would be cached...
func (container *ActiveGames) GetGamesList(w http.ResponseWriter, r *http.Request) error {
	container.Lock()
	defer container.Unlock()

	data := make([]*GameData, 0, len(container.activeGame))
	for _, game := range container.activeGame {
		data = append(data, game.gameData)
	}

	jsonFormated := make(map[string][]*GameData)
	jsonFormated["games"] = data

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err := json.NewEncoder(w).Encode(jsonFormated)
	if err != nil {
		http.Error(w, "Issue with database", http.StatusInternalServerError)
		return err
	}

	return nil
}
