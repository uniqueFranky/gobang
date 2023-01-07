package calculator

import (
	"gobang-backend/zobrist"
)

func (c *Calculator) AlphaBeta(curDep int, maxDep int, alpha int64, beta int64, hasher *zobrist.Hasher, totScore *int64, stepCnt int) int64 {

	var turn int
	if curDep%2 == 0 {
		turn = 2
	} else {
		turn = 1
	}

	pts, winner, selfLvTps, oppLvTps := c.getSelectable(turn)
	if winner == 1 {
		return win + 10000
	} else if winner == 2 {
		return -win - 10000
	}

	if curDep == maxDep {
		return c.calcScore()
	}

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
			if len(selfLvTps) > 0 && len(oppLvTps) > 0 {
				elic := c.calcElicitation(2, (maxDep-curDep)/2, selfLvTps, (maxDep-curDep)/2, oppLvTps)
				if elic >= alpha { // Elicitation
					c.status[i][j] = 0
					continue
				}
			}

			hasher.PutAt(i, j, 0, 2)
			val := c.AlphaBeta(curDep+1, maxDep, -win*10, alpha, hasher, totScore, stepCnt+1)
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
			if len(selfLvTps) > 0 && len(oppLvTps) > 0 {
				elic := c.calcElicitation(2, (maxDep-curDep)/2-1, selfLvTps, (maxDep-curDep)/2, oppLvTps)
				if elic <= alpha { // Elicitation
					c.status[i][j] = 0
					continue
				}
			}
			hasher.PutAt(i, j, 0, 1)
			val := c.AlphaBeta(curDep+1, maxDep, win*10, alpha, hasher, totScore, stepCnt+1)

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
