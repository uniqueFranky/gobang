package main

import (
	"encoding/json"
	"gorilla/mux"
	"net/http"
)

type Server struct {
	*mux.Router
}

type Step struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func main() {
	server := Server{mux.NewRouter()}
	server.HandleFunc("/getStep", getStep()).Methods("POST")
	http.ListenAndServe(":9999", server)
}

func getStep() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var status [][]int
		if err := json.NewDecoder(r.Body).Decode(&status); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		step := alpha_beta(status, 1, 5, -1000000000, 1000000000)
		y := step % 15
		x := (step - y) / 15
		s := Step{
			X: int(x),
			Y: int(y),
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(s); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func alpha_beta(status [][]int, curDep int, maxDep int, alpha int64, beta int64) int64 {
	if curDep == maxDep {
		return calcScore(status)
	}
	selectable := make([][]bool, 15)
	for i := 0; i < 15; i++ {
		selectable[i] = make([]bool, 15)
	}

	for i := 0; i < 15; i++ {
		for j := 0; j < 15; j++ {
			if status[i][j] != 0 {
				for k := -3; k <= 3; k++ {
					if i+k < 15 && i+k >= 0 && status[i+k][j] == 0 {
						selectable[i+k][j] = true
					}
					if j+k < 15 && j+k >= 0 && status[i][j+k] == 0 {
						selectable[i][j+k] = true
					}
					if i+k >= 0 && i+k < 15 && j+k >= 0 && j+k < 15 && status[i+k][j+k] == 0 {
						selectable[i+k][j+k] = true
					}
					if i-k >= 0 && i-k < 15 && j+k >= 0 && j+k < 15 && status[i-k][j+k] == 0 {
						selectable[i-k][j+k] = true
					}
				}
			}
		}
	}

	moveX := make([]int, 0)
	moveY := make([]int, 0)
	for i := 0; i < 15; i++ {
		for j := 0; j < 15; j++ {
			if selectable[i][j] {
				moveX = append(moveX, i)
				moveY = append(moveY, j)
			}
		}
	}
	moveLen := len(moveX)
	var maxposi int
	var maxposj int
	if curDep%2 == 0 { // Player's turn, min node
		for id := 0; id < moveLen; id++ {
			i := moveX[id]
			j := moveY[id]
			status[i][j] = 2
			val := alpha_beta(status, curDep+1, maxDep, -1000000000, alpha)
			if val < alpha {
				alpha = val
			}
			status[i][j] = 0
			if alpha <= beta {
				return alpha
			}
		}
		return alpha
	} else { // Computer's turn, max node
		for id := 0; id < moveLen; id++ {
			i := moveX[id]
			j := moveY[id]
			status[i][j] = 1
			val := alpha_beta(status, curDep+1, maxDep, 1000000000, alpha)
			if val > alpha {
				alpha = val
				maxposi = i
				maxposj = j
			}
			status[i][j] = 0
			if alpha >= beta {
				return alpha
			}
		}
	}
	if curDep == 1 {
		return int64(maxposi*15 + maxposj)
	}
	return alpha
}

var constantDiscreteScores = [6]int64{0, 10, 100, 1000, 10000, 100000}

func numberOfPiecesHorizontally(status [][]int, turn int, x int, y int) int {
	if y+4 >= 15 {
		return 0
	}
	num := 0
	for j := 0; j < 5; j++ {
		if status[x][y+j] != turn && status[x][y+j] != 0 {
			return 0
		} else if status[x][y+j] == turn {
			num++
		}
	}
	return num
}

func numberOfPiecesVertically(status [][]int, turn int, x int, y int) int {
	if x+4 >= 15 {
		return 0
	}
	num := 0
	for i := 0; i < 5; i++ {
		if status[x+i][y] != turn && status[x+i][y] != 0 {
			return 0
		} else if status[x+i][y] == turn {
			num++
		}
	}
	return num
}

func numberOfPiecesOnMainDiagonal(status [][]int, turn int, x int, y int) int {
	if x+4 >= 15 || y+4 >= 15 {
		return 0
	}
	num := 0
	for k := 0; k < 5; k++ {
		if status[x+k][y+k] != turn && status[x+k][y+k] != 0 {
			return 0
		} else if status[x+k][y+k] == turn {
			num++
		}
	}
	return num
}

func numberOfPiecesOnSubDiagonal(status [][]int, turn int, x int, y int) int {
	if x-4 < 0 || y+4 >= 15 {
		return 0
	}
	num := 0
	for k := 0; k < 5; k++ {
		if status[x-k][y+k] != turn && status[x-k][y+k] != 0 {
			return 0
		} else if status[x-k][y+k] == turn {
			num++
		}
	}
	return num
}

func calc(status [][]int, turn int) int64 {
	var score int64 = 0
	for i := 0; i < 15; i++ {
		for j := 0; j < 15; j++ {
			score += constantDiscreteScores[numberOfPiecesHorizontally(status, turn, i, j)]
			score += constantDiscreteScores[numberOfPiecesVertically(status, turn, i, j)]
			score += constantDiscreteScores[numberOfPiecesOnMainDiagonal(status, turn, i, j)]
			score += constantDiscreteScores[numberOfPiecesOnSubDiagonal(status, turn, i, j)]
		}
	}
	return score
}

func calcScore(status [][]int) int64 {
	return calc(status, 1) - calc(status, 2)
}
