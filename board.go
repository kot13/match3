package main

import "math/rand"

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
			index := rand.Intn(5)
			line = append(line, gems[index])
		}
		board = append(board, line)
	}
	return
}

func isDeadBoard(board [][]string) bool {
	return true
}

func hasMatches(board [][]string) bool {
	for i := 1; i < countCols-1; i++ {
		for j := 1; j < countRows-1; j++ {
			countVert, countHoriz := gemMatches(board, j, i)
			if countVert >= minMatch || countHoriz >= minMatch {
				return true
			}
		}
	}
	return false
}

func gemMatches(board [][]string, posX int, posY int) (int, int) {
	countUp := gemDirectionMatches(board, posX, posY, 0, -1)
	countDown := gemDirectionMatches(board, posX, posY, 0, 1)
	countLeft := gemDirectionMatches(board, posX, posY, -1, 0)
	countRight := gemDirectionMatches(board, posX, posY, 1, 0)
	return countUp + countDown + 1, countLeft + countRight + 1
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
