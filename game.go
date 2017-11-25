package main

import (
	//"encoding/json"
	"log"
	//"sync"
	//"time"

	//"encoding/json"
	"encoding/json"
	"github.com/googollee/go-socket.io"
	"sync"
)

const (
	gameRoom        = "game"
	maxCountPlayers = 2
	gameDuration    = 30
)

var (
	playersLock = sync.Mutex{}
	//timer       = time.NewTimer(time.Second * gameDuration)
)

type Game struct {
	server  *socketio.Server
	players map[socketio.Socket]*Player
}

type GameState struct {
	Players map[string]Player `json:"players"`
	Board   [][]string        `json:"board"`
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
	so.On("joinNewPlayer", func(playerName string) {
		log.Println("joinNewPlayer")

		if len(self.players) == maxCountPlayers {
			log.Println("Error: max player count")
			return
		}

		player := NewPlayer(so.Id(), playerName)
		log.Println("Set player id: ", so.Id())

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
				Players: players,
				Board:   board,
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
