package main

import (
	//"time"
	"encoding/json"
	"github.com/googollee/go-socket.io"
	"log"
	"sync"
)

const (
	gameRoom        = "game"
	maxCountPlayers = 2
	gameDuration    = 30
)

var playersLock = sync.Mutex{}
var currentPlayer string

type Game struct {
	server  *socketio.Server
	players map[socketio.Socket]*Player
}

type GameState struct {
	Players       map[string]Player `json:"players"`
	Board         [][]string        `json:"board"`
	CurrentPlayer string            `json:"currentPlayer"`
}

func NewGame(server *socketio.Server) *Game {
	game := &Game{server: server, players: map[socketio.Socket]*Player{}}

	server.On("connection", func(so socketio.Socket) {
		log.Println("On connection")
		game.AddPlayer(so)
	})

	server.On("error", func(so socketio.Socket, err error) {
		log.Println("Error: ", err)
	})

	return game
}

func (self *Game) AddPlayer(so socketio.Socket) {
	so.On("joinNewPlayer", func(msg string) {
		log.Println("joinNewPlayer")

		if len(self.players) == maxCountPlayers {
			log.Println("Error: max player count")
			return
		}

		newPlayer := struct {
			Name string `json:"name"`
			Skin string `json:"skin"`
		}{}

		err := json.Unmarshal([]byte(msg), &newPlayer)
		if err != nil {
			log.Println(err)
			return
		}

		player := NewPlayer(so.Id(), newPlayer.Name, newPlayer.Skin)
		log.Println("Set player id: ", so.Id())

		currentPlayer = so.Id()

		func() {
			playersLock.Lock()
			defer playersLock.Unlock()
			self.players[so] = player
		}()

		so.Join(gameRoom)

		if len(self.players) == maxCountPlayers {
			var players = map[string]Player{}
			for _, p := range self.players {
				players[p.Id] = *p
			}

			board := GenerateBoard()
			state, _ := json.Marshal(GameState{
				Players:       players,
				Board:         board,
				CurrentPlayer: currentPlayer,
			})

			so.BroadcastTo(gameRoom, "start", string(state))
			so.Emit("start", string(state))
			return
		}

		//go func() {
		//	<-timer.C
		//	var maxHealth int
		//	var winnerId string
		//	for _, p := range self.players {
		//		if p.Health > maxHealth {
		//			maxHealth = p.Health
		//			winnerId = p.Id
		//		}
		//	}
		//	so.BroadcastTo(gameRoom, "win", winnerId)
		//	so.Emit("win", winnerId)
		//}()
	})

	so.On("disconnection", func() {
		log.Println("on disconnect")

		player, ok := self.players[so]
		if ok {
			func() {
				playersLock.Lock()
				defer playersLock.Unlock()
				delete(self.players, so)
			}()

			so.BroadcastTo(gameRoom, "playerDisconnected", player.Id)
		}
	})
}
