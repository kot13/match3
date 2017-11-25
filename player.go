package main

const Health = 100

type Player struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Health int    `json:"health"`
}

func NewPlayer(socketId string, playerName string) (player *Player) {
	player = &Player{
		Id:     socketId,
		Name:   playerName,
		Health: Health,
	}

	return
}
