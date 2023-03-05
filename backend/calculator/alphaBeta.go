package calculator

import (
	"gobang-backend/zobrist"
)

// AlphaBeta
// curDep：当前搜索的深度
// maxDep：最大深度，即博弈树深度
// alpha：根据已经搜索完成的节点，当前节点的最优得分
// beta：根据已经搜索完成的节点，父节点的最优得分
// hasher：Zobrist哈希的执行者
// totScore：最高得分，由于传递的是指针，会在返回前修改对应的实参
// stepCnt：在整局对局中，当前这一步是第几步
// 返回值：第一层返回二维数组坐标的一维编码，即15*i+j，其他层返回当前层的alpha值
///**
func (c *Calculator) AlphaBeta(curDep int, maxDep int, alpha int64, beta int64, hasher *zobrist.Hasher, totScore *int64, stepCnt int) int64 {

	var turn int
	if curDep%2 == 0 { // turn == 1 stands for AI's turn, turn == 2 stands for Player's turn
		turn = 2
	} else {
		turn = 1
	}

	// 根据防御策略和棋子的相关性，确定可以落子的坐标，只选择这些坐标进行搜索。
	pts, winner, selfLvTps, oppLvTps := c.getSelectable(turn)
	// 判断对局是否已经结束，若对局结束却不及时返回，会导致AI失灵
	if winner == 1 {
		return win + 10000
	} else if winner == 2 {
		return -win - 10000
	}
	// 叶子结点，直接返回局面的评分
	if curDep == maxDep {
		return c.calcScore()
	}

	// 记忆化：若已经搜索过这一节点，直接返回即可
	//oldVal, ok := hasher.GetScore(maxDep - curDep)
	//if ok && curDep != 1 {
	//	return oldVal
	//}

	moveLen := len(pts)
	var maxposi int
	var maxposj int
	if curDep%2 == 0 { // Player's turn, min node
		for id := 0; id < moveLen; id++ { // 在id这一坐标模拟落子，计算新的局面并向更深层搜索
			i := pts[id].X
			j := pts[id].Y
			c.status[i][j] = 2
			if len(selfLvTps) > 0 && len(oppLvTps) > 0 { // 启发式评估，A*算法的变形
				elic := c.calcElicitation(2, (maxDep-curDep)/2, selfLvTps, (maxDep-curDep)/2, oppLvTps)
				if elic >= alpha { // Elicitation
					c.status[i][j] = 0
					continue
				}
			}

			hasher.PutAt(i, j, 0, 2)
			val := c.AlphaBeta(curDep+1, maxDep, -win*10, alpha, hasher, totScore, stepCnt+1) // 向更深层搜索
			// 回溯时将状态恢复至原始状态，并做出更新和剪枝
			if val < alpha { // 更新自身的alpha值
				alpha = val
			}
			hasher.PutAt(i, j, 2, 0)
			c.status[i][j] = 0
			if alpha <= beta { // 剪枝
				//hasher.SetScore(maxDep-curDep, alpha)
				return alpha
			}
		}
		return alpha
	} else { // Computer's turn, max node
		for id := 0; id < moveLen; id++ { // 在id这一坐标模拟落子，计算新的局面并向更深层搜索
			i := pts[id].X
			j := pts[id].Y
			c.status[i][j] = 1
			if len(selfLvTps) > 0 && len(oppLvTps) > 0 { // 启发式评估，A*算法的变形
				elic := c.calcElicitation(2, (maxDep-curDep)/2-1, selfLvTps, (maxDep-curDep)/2, oppLvTps)
				if elic <= alpha { // Elicitation
					c.status[i][j] = 0
					continue
				}
			}
			hasher.PutAt(i, j, 0, 1)
			val := c.AlphaBeta(curDep+1, maxDep, win*10, alpha, hasher, totScore, stepCnt+1)
			// 回溯时将状态恢复至原始状态，并做出更新和剪枝
			if val > alpha { // 更新自身的alpha值
				alpha = val
				maxposi = i
				maxposj = j
			}
			hasher.PutAt(i, j, 1, 0)
			c.status[i][j] = 0
			if alpha >= beta { // 剪枝
				//hasher.SetScore(maxDep-curDep, alpha)
				return alpha
			}
		}
	}
	//hasher.SetScore(maxDep-curDep, alpha) // 记忆化
	// 返回结果
	if curDep == 1 {
		*totScore = alpha
		return int64(maxposi*15 + maxposj)
	} else {
		return alpha
	}
}
