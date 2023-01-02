package calculator

import (
	"gobang-backend/evaluator"
)

func (c *Calculator) AlphaBeta(curDep int, maxDep int, alpha int64, beta int64) int64 {
	if curDep == maxDep {
		return c.calcScore()
	}

	var turn int
	if curDep%2 == 0 {
		turn = 2
	} else {
		turn = 1
	}

	pts, winner := c.getSelectable(turn)
	if winner == 1 {
		return win + 10000
	} else if winner == 2 {
		return -win - 10000
	}
	//if curDep == 1 {
	//	fmt.Println(pts)
	//}
	moveLen := len(pts)
	var maxposi int
	var maxposj int
	if curDep%2 == 0 { // Player's turn, min node
		for id := 0; id < moveLen; id++ {
			i := pts[id].X
			j := pts[id].Y
			c.status[i][j] = 2
			val := c.AlphaBeta(curDep+1, maxDep, -win*10, alpha)
			if val < alpha {
				alpha = val
			}
			c.status[i][j] = 0
			if alpha <= beta {
				return alpha
			}
		}
		return alpha
	} else { // Computer's turn, max node
		for id := 0; id < moveLen; id++ {
			i := pts[id].X
			j := pts[id].Y
			c.status[i][j] = 1
			val := c.AlphaBeta(curDep+1, maxDep, win*10, alpha)
			//if curDep == 1 {
			//	fmt.Println(i, j, val, alpha)
			//}
			if val > alpha {
				alpha = val
				maxposi = i
				maxposj = j
			}
			c.status[i][j] = 0
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

func (c *Calculator) calc(turn int) int64 {
	var score int64 = 0
	eva := evaluator.NewEvaluator(c.status)
	lvTuple := eva.GetLevelsForCalculator(turn)
	for _, tp := range lvTuple {
		lv := tp.Lv
		score += constantScores[lv]
	}
	return score
}

func (c *Calculator) calcScore() int64 {
	return c.calc(1) - c.calc(2)
}
