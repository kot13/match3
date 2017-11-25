package main

const DefaultEnergy = 0
const DefaultMimimi = 0

type Player struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Energy int    `json:"energy"`
	Mimimi int    `json:"mimimi"`
	Skin   string `json:"skin"`
}

func NewPlayer(socketId string, playerName string, skin string) (player *Player) {
	player = &Player{
		Id:     socketId,
		Name:   playerName,
		Skin:   skin,
		Mimimi: DefaultMimimi,
		Energy: DefaultEnergy,
	}

	return
}
