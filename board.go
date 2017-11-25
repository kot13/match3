package main

import (
	"math/rand"
	"time"
)

const countCols = 7
const countRows = 7
const minMatch = 3

type Gem struct {
	Name                  string
	Energy                int
	AdditionalEnergy      int
	Mimimi                int
	AdditionalMimimi      int
	EnemyEnergy           int
	EnemyAdditionalEnergy int
	EnemyMimimi           int
	EnemyAdditionalMimimi int
}

type Killed struct {
	Name  string
	Count int
}

type Scores struct {
	Energy      int
	Mimimi      int
	EnemyEnergy int
	EnemyMimimi int
}

var gems = []Gem{
	Gem{
		Name:                  "gem1",
		Energy:                -30,
		AdditionalEnergy:      -5,
		Mimimi:                30,
		AdditionalMimimi:      5,
		EnemyEnergy:           0,
		EnemyAdditionalEnergy: 0,
		EnemyMimimi:           0,
		EnemyAdditionalMimimi: 0,
	},
	Gem{
		Name:                  "gem2",
		Energy:                0,
		AdditionalEnergy:      0,
		Mimimi:                0,
		AdditionalMimimi:      0,
		EnemyEnergy:           0,
		EnemyAdditionalEnergy: 0,
		EnemyMimimi:           -20,
		EnemyAdditionalMimimi: -5,
	},
	Gem{
		Name:                  "gem3",
		Energy:                0,
		AdditionalEnergy:      0,
		Mimimi:                15,
		AdditionalMimimi:      5,
		EnemyEnergy:           0,
		EnemyAdditionalEnergy: 0,
		EnemyMimimi:           0,
		EnemyAdditionalMimimi: 0,
	},
	Gem{
		Name:                  "gem4",
		Energy:                20,
		AdditionalEnergy:      5,
		Mimimi:                0,
		AdditionalMimimi:      0,
		EnemyEnergy:           0,
		EnemyAdditionalEnergy: 0,
		EnemyMimimi:           0,
		EnemyAdditionalMimimi: 0,
	},
	Gem{
		Name:                  "gem5",
		Energy:                0,
		AdditionalEnergy:      0,
		Mimimi:                -10,
		AdditionalMimimi:      -5,
		EnemyEnergy:           -30,
		EnemyAdditionalEnergy: -5,
		EnemyMimimi:           0,
		EnemyAdditionalMimimi: 0,
	},
}

func GenerateBoard() (board [][]string) {
	board = fillBoard()
	for isDeadBoard(board) || hasMatches(board) {
		board = fillBoard()
	}
	return
}

func fillBoard() (board [][]string) {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < countRows; i++ {
		var line []string
		for j := 0; j < countCols; j++ {
			line = append(line, gems[rand.Intn(5)].Name)
		}
		board = append(board, line)
	}
	return
}

func isDeadBoard(board [][]string) bool {
	return false
}

func hasMatches(board [][]string) bool {
	for i := 0; i < countCols; i++ {
		for j := 0; j < countRows; j++ {
			countUp, countDown, countLeft, countRight := gemMatches(board, j, i)
			countVert := countUp + countDown + 1
			countHoriz := countLeft + countRight + 1
			if countVert >= minMatch || countHoriz >= minMatch {
				return true
			}
		}
	}
	return false
}

func gemMatches(board [][]string, posX int, posY int) (countUp int, countDown int, countLeft int, countRight int) {
	if posY > 0 {
		countUp = gemDirectionMatches(board, posX, posY, 0, -1)
	}
	if posY < countRows-1 {
		countDown = gemDirectionMatches(board, posX, posY, 0, 1)
	}
	if posX > 0 {
		countLeft = gemDirectionMatches(board, posX, posY, -1, 0)
	}
	if posX < countCols-1 {
		countRight = gemDirectionMatches(board, posX, posY, 1, 0)
	}
	return
}

func gemDirectionMatches(board [][]string, posX int, posY int, moveX int, moveY int) (count int) {
	var curX = posX + moveX
	var curY = posY + moveY

	for curX >= 0 && curX < countCols &&
		curY >= 0 && curY < countRows &&
		board[posY][posX] == board[curY][curX] {
		count++
		curX += moveX
		curY += moveY
	}
	return
}

func RegenarateBoard(board [][]string) ([][]string, [][]string, Scores) {
	boardWithoutKilled, killed := killMatches(board)
	newGems := refillBoard(boardWithoutKilled)
	for isDeadBoard(newGems) {
		newGems = refillBoard(boardWithoutKilled)
	}

	for i := 0; i < countRows; i++ {
		for j := 0; j < countCols; j++ {
			if boardWithoutKilled[i][j] != "" {
				newGems[i][j] = ""
			}
		}
	}

	return boardWithoutKilled, newGems, calcScores(killed)
}

func killMatches(board [][]string) ([][]string, []Killed) {
	result := duplicateBoard(board)
	var killed []Killed
	for i := 0; i < countCols; i++ {
		for j := 0; j < countRows; j++ {
			if result[i][j] == "" {
				continue
			}
			name := result[i][j]
			countKilled := 1
			countUp, countDown, countLeft, countRight := gemMatches(result, j, i)
			if countLeft+countRight+1 >= minMatch {
				countKilled += countLeft + countRight
				result = killMatch(result, j-countLeft, i, j+countRight, i)
			}
			if countUp+countDown+1 >= minMatch {
				countKilled += countUp + countDown
				result = killMatch(result, j, i-countUp, j, i+countDown)
			}
			if countKilled > 1 {
				killed = append(killed, Killed{Name: name, Count: countKilled})
			}
		}
	}
	return result, killed
}

func killMatch(board [][]string, startX int, startY int, endX int, endY int) [][]string {
	result := duplicateBoard(board)
	for i := startY; i <= endY; i++ {
		for j := startX; j <= endX; j++ {
			result[i][j] = ""
		}
	}
	return result
}

func refillBoard(board [][]string) [][]string {
	result := duplicateBoard(board)
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < countRows; i++ {
		for j := 0; j < countCols; j++ {
			if result[i][j] == "" {
				result[i][j] = gems[rand.Intn(5)].Name
			}
		}
	}
	return result
}

func duplicateBoard(board [][]string) [][]string {
	var duplicate [][]string
	for i := 0; i < len(board); i++ {
		var line []string
		for j := 0; j < len(board[i]); j++ {
			line = append(line, board[i][j])
		}
		duplicate = append(duplicate, line)
	}
	return duplicate
}

func IsEmptyBoard(board [][]string) bool {
	for i := 0; i < len(board); i++ {
		for j := 0; j < len(board[i]); j++ {
			if board[i][j] != "" {
				return false
			}
		}
	}

	return true
}

func calcScores(killed []Killed) Scores {
	scores := Scores{
		Energy:      0,
		Mimimi:      0,
		EnemyEnergy: 0,
		EnemyMimimi: 0,
	}
	for i := 0; i < len(killed); i++ {
		gem := findGemByName(killed[i].Name)
		bonus := killed[i].Count - minMatch
		scores.Energy += gem.Energy + bonus*gem.AdditionalEnergy
		scores.Mimimi += gem.Mimimi + bonus*gem.AdditionalMimimi
		scores.EnemyEnergy += gem.EnemyEnergy + bonus*gem.EnemyAdditionalEnergy
		scores.EnemyMimimi += gem.EnemyMimimi + bonus*gem.EnemyAdditionalMimimi
	}
	return scores
}

func findGemByName(name string) Gem {
	for i := 0; i < len(gems); i++ {
		if gems[i].Name == name {
			return gems[i]
		}
	}
	return gems[0]
}
