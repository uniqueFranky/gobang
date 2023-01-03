package calculator

import (
	"gobang-backend/evaluator"
	"gobang-backend/zobrist"
)

func (c *Calculator) AlphaBeta(curDep int, maxDep int, alpha int64, beta int64, hasher *zobrist.Hasher, totScore *int64) int64 {

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

	if curDep == maxDep {
		return c.calcScore()
	}

	//if curDep == 1 {
	//	fmt.Println(pts)
	//}

	oldVal, ok := hasher.GetScore(maxDep - curDep)
	if ok && curDep != 1 {
		//fmt.Println(hasher.GetHashValue(), oldVal)
		return oldVal
	}

	moveLen := len(pts)
	var maxposi int
	var maxposj int
	if curDep%2 == 0 { // Player's turn, min node
		for id := 0; id < moveLen; id++ {
			i := pts[id].X
			j := pts[id].Y
			c.status[i][j] = 2
			hasher.PutAt(i, j, 0, 2)
			val := c.AlphaBeta(curDep+1, maxDep, -win*10, alpha, hasher, totScore)
			if val < alpha {
				alpha = val
			}
			hasher.PutAt(i, j, 2, 0)
			c.status[i][j] = 0
			if alpha <= beta {
				hasher.SetScore(maxDep-curDep, alpha)
				return alpha
			}
		}
		return alpha
	} else { // Computer's turn, max node
		for id := 0; id < moveLen; id++ {
			i := pts[id].X
			j := pts[id].Y
			c.status[i][j] = 1
			hasher.PutAt(i, j, 0, 1)
			val := c.AlphaBeta(curDep+1, maxDep, win*10, alpha, hasher, totScore)
			//if curDep == 1 {
			//	fmt.Println(i, j, val, alpha)
			//}
			if val > alpha {
				alpha = val
				maxposi = i
				maxposj = j
			}
			hasher.PutAt(i, j, 1, 0)
			c.status[i][j] = 0
			if alpha >= beta {
				hasher.SetScore(maxDep-curDep, alpha)
				return alpha
			}
		}
	}
	hasher.SetScore(maxDep-curDep, alpha)
	if curDep == 1 {
		*totScore = alpha
		return int64(maxposi*15 + maxposj)
	} else {
		return alpha
	}
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
