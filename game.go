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
var CurrentPlayer string

type Game struct {
	server  *socketio.Server
	players map[socketio.Socket]*Player
}

type GameState struct {
	Players       map[string]Player `json:"players"`
	Board         [][]string        `json:"board"`
	CurrentPlayer string            `json:"currentPlayer"`
	NewGems       [][]string        `json:"newGems"`
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

		CurrentPlayer = so.Id()

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
				CurrentPlayer: CurrentPlayer,
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

	so.On("turn", func(msg string) {
		//log.Println("turn: ", msg)

		data := struct {
			Board [][]string `json:"board"`
		}{}
		err := json.Unmarshal([]byte(msg), &data)
		if err != nil {
			log.Println(err)
			return
		}

		boardWithoutKilled, newGems := RegenarateBoard(data.Board)

		var players = map[string]Player{}
		for _, p := range self.players {
			players[p.Id] = *p
		}

		if BoardIsEmpty(newGems) {
			log.Println("Board is empty")
			log.Println("Old currentPlayer: ", CurrentPlayer)
			for _, p := range self.players {
				log.Println("Player: ", p.Id)
				if CurrentPlayer != p.Id {
					log.Println("Try change currentPlayer: ", CurrentPlayer, " to: ", p.Id)
					CurrentPlayer = p.Id
					break
				}
			}
			log.Println("New currentPlayer: ", CurrentPlayer)
		} else {
			log.Println(newGems)
		}

		state, _ := json.Marshal(GameState{
			Players:       players,
			Board:         boardWithoutKilled,
			NewGems:       newGems,
			CurrentPlayer: CurrentPlayer,
		})

		so.BroadcastTo(gameRoom, "boardUpdate", string(state))
		so.Emit("boardUpdate", string(state))
	})
}
