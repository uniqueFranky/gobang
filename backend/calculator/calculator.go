package calculator

import (
	"container/heap"
	"gobang-backend/evaluator"
)

type Calculator struct {
	status [][]int
}

func NewCalculator(status [][]int) *Calculator {
	return &Calculator{status: status}
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

func (c *Calculator) calcElicitation(turn int, selfStep int, selfLvTps []evaluator.LevelTuple, oppStep int,
	oppLvTps []evaluator.LevelTuple) int64 {
	selfSlice := make([]evaluator.LevelTuple, 0)
	for _, t := range selfLvTps {
		selfSlice = append(selfSlice, t)
	}
	oppSlice := make([]evaluator.LevelTuple, 0)
	for _, t := range oppLvTps {
		oppSlice = append(oppSlice, t)
	}

	selfHeap := NewLevelHeap(selfSlice)
	oppHeap := NewLevelHeap(oppSlice)
	heap.Init(&selfHeap)
	heap.Init(&oppHeap)
	var delta int64 = 0
	for i := 0; i < selfStep; i++ {
		delta += selfHeap.update(1)
		delta += oppHeap.update(-1)
	}

	var ret int64
	if turn == 1 {
		ret = 100000000
	} else {
		ret = -100000000
	}
	for i := 0; i < oppStep; i++ { // level up opp for i times, level down self for oppStep-i times
		tmpDelta := delta
		tmpSelfHeap := selfHeap.copy()
		tmpOppHeap := oppHeap.copy()
		for j := 0; j < i; j++ {
			tmpDelta += tmpSelfHeap.update(1)
		}
		for j := 0; j < oppStep-i; j++ {
			tmpDelta += tmpOppHeap.update(-1)
		}
		if turn == 1 {
			if ret > tmpDelta {
				ret = tmpDelta
			}
		} else {
			if ret < tmpDelta {
				ret = tmpDelta
			}
		}
	}
	return ret
}
