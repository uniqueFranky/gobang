package calculator

import (
	"container/heap"
	"gobang-backend/evaluator"
)

type LevelHeap []evaluator.LevelTuple

func NewLevelHeap(lvTp []evaluator.LevelTuple) LevelHeap {
	return lvTp
}

func (h LevelHeap) Len() int {
	return len(h)
}

func (h LevelHeap) Less(i, j int) bool {
	return h[i].Lv < h[j].Lv
}

func (h LevelHeap) Swap(i, j int) {
	h[i], h[j] = h[j], h[i]
}

func (h *LevelHeap) Push(x interface{}) {
	*h = append(*h, x.(evaluator.LevelTuple))
}

func (h *LevelHeap) Pop() interface{} {
	val := (*h)[h.Len()-1]
	*h = (*h)[:h.Len()-1]
	return val
}

func (h *LevelHeap) update(updown int) int64 {
	top := h.Pop().(evaluator.LevelTuple)
	delta := -constantScores[top.Lv]
	if updown == -1 { // level down
		if top.Lv < 10 {
			top.Lv++
		}
	} else { // level up
		if top.Lv > 0 {
			top.Lv--
		}
	}
	delta += constantScores[top.Lv]
	h.Push(top)
	return delta
}

func (h *LevelHeap) copy() *LevelHeap {
	slc := make([]evaluator.LevelTuple, 0)
	for _, t := range *h {
		slc = append(slc, t)
	}
	hp := NewLevelHeap(slc)
	heap.Init(&hp)
	return &hp
}
