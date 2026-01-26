package main

import (
	"net/http"
	"sync"
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
	return ok
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
	defer container.Lock()
	gameName := r.URL.Query().Get("game")
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
	serveWs(hub, w, r, data.IsGame)
}
