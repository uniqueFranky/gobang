package evaluator

import "fmt"

type Evaluator struct {
	status [][]int
}

func NewEvaluator(status [][]int) *Evaluator {
	return &Evaluator{status: status}
}

func (e *Evaluator) getLevel(x int, y int, turn int, dir Direction) Level {
	var s [6]int
	for i := 0; i < 6; i++ {
		xx := x + moveX[dir]*i
		yy := y + moveY[dir]*i
		if xx < 0 || xx >= 15 || yy < 0 || yy >= 15 {
			s[i] = 2
		} else if e.status[xx][yy] == 0 {
			s[i] = 0
		} else if e.status[xx][yy] == turn {
			s[i] = 1
		} else {
			s[i] = 2
		}
	}
	return level[s[0]][s[1]][s[2]][s[3]][s[4]][s[5]]
}

func (e *Evaluator) Print() {
	fmt.Println(e.status)
}
