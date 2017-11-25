package main

import (
	"math/rand"
)

const countCols = 7
const countRows = 7
const minMatch = 3

var gems = []string{"gem1", "gem2", "gem3", "gem4", "gem5"}

func GenerateBoard() (board [][]string) {
	board = fillBoard()
	for !isDeadBoard(board) || hasMatches(board) {
		board = fillBoard()
	}
	return
}

func fillBoard() (board [][]string) {
	for i := 0; i < countRows; i++ {
		var line []string
		for j := 0; j < countCols; j++ {
			line = append(line, gems[rand.Intn(5)])
		}
		board = append(board, line)
	}
	return
}

func isDeadBoard(board [][]string) bool {
	return true
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

func RegenarateBoard(board [][]string) ([][]string, [][]string) {
	boardWithoudKilled := killMatches(board)
	newGems := refillBoard(boardWithoudKilled)
	for !isDeadBoard(newGems) {
		newGems = refillBoard(boardWithoudKilled)
	}

	for i := 0; i < countRows; i++ {
		for j := 0; j < countCols; j++ {
			if boardWithoudKilled[i][j] != "" {
				newGems[i][j] = ""
			}
		}
	}

	return boardWithoudKilled, newGems
}

func killMatches(board [][]string) [][]string {
	result := duplicateBoard(board)
	for i := 0; i < countCols; i++ {
		for j := 0; j < countRows; j++ {
			countUp, countDown, countLeft, countRight := gemMatches(result, j, i)
			countVert := countUp + countDown + 1
			countHoriz := countLeft + countRight + 1
			if countHoriz >= minMatch {
				result = killMatch(result, j-countLeft, i, j+countRight, i)
			}
			if countVert >= minMatch {
				result = killMatch(result, j, i-countUp, j, i+countDown)
			}
		}
	}
	return result
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
	for i := 0; i < countRows; i++ {
		for j := 0; j < countCols; j++ {
			if result[i][j] == "" {
				result[i][j] = gems[rand.Intn(5)]
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
