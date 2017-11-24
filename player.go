package main

type Player struct {
	Id   string
	Name string
}

func NewPlayer(socketId string, playerName string) (player *Player) {
	player = &Player{
		Id:   socketId,
		Name: playerName,
	}

	return
}
