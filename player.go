package main

const Health = 100

type Player struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Health int    `json:"health"`
	Skin   string `json:"skin"`
}

func NewPlayer(socketId string, playerName string, skin string) (player *Player) {
	player = &Player{
		Id:     socketId,
		Name:   playerName,
		Skin:   skin,
		Health: Health,
	}

	return
}
