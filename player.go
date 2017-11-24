package main

const Health = 100

type Player struct {
	Id     string
	Name   string
	Health int
}

func NewPlayer(socketId string, playerName string) (player *Player) {
	player = &Player{
		Id:     socketId,
		Name:   playerName,
		Health: Health,
	}

	return
}
