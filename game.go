package main

import (
	//"encoding/json"
	"log"
	//"sync"
	"time"

	"github.com/googollee/go-socket.io"
)

const (
	gameRoom        = "game"
	maxCountPlayers = 2
	gameDuration    = 30
)

type Game struct {
	server  *socketio.Server
	players map[socketio.Socket]*Player
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
	})

	so.On("disconnection", func() {
		log.Println("on disconnect")
	})
}

func (self *Game) Loop() {
	ticker := time.NewTicker(time.Millisecond * 100)
	prevTick := time.Now()

	for t := range ticker.C {
		deltaTime := float32(t.Sub(prevTick).Seconds())
		prevTick = t

		log.Println(deltaTime)

		var msg []byte

		self.server.BroadcastTo(gameRoom, "tick", string(msg))
	}
}
