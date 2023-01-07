package calculator

import (
	"gobang-backend/evaluator"
	"sort"
)

func (c *Calculator) getSelectable(turn int) ([]evaluator.Point, int, []evaluator.LevelTuple, []evaluator.LevelTuple) {
	selectable := make([][]bool, 15)
	for i := 0; i < 15; i++ {
		selectable[i] = make([]bool, 15)
	}

	for i := 0; i < 15; i++ {
		for j := 0; j < 15; j++ {
			if c.status[i][j] != 0 {
				for k := -1; k <= 1; k++ {
					if i+k < 15 && i+k >= 0 && c.status[i+k][j] == 0 {
						selectable[i+k][j] = true
					}
					if j+k < 15 && j+k >= 0 && c.status[i][j+k] == 0 {
						selectable[i][j+k] = true
					}
					if i+k >= 0 && i+k < 15 && j+k >= 0 && j+k < 15 && c.status[i+k][j+k] == 0 {
						selectable[i+k][j+k] = true
					}
					if i-k >= 0 && i-k < 15 && j+k >= 0 && j+k < 15 && c.status[i-k][j+k] == 0 {
						selectable[i-k][j+k] = true
					}
				}
				selectable[i][j] = true
			}
		}
	}
	var pts []evaluator.Point
	for i := 0; i < 15; i++ {
		for j := 0; j < 15; j++ {
			if selectable[i][j] {
				pts = append(pts, evaluator.Point{
					X: i,
					Y: j,
				})
			}
		}
	}

	var opp int
	if turn == 1 {
		opp = 2
	} else {
		opp = 1
	}

	// 获取赢线三元组
	oppLvTuples, danger := c.getAllLevels(opp, pts)
	selfLvTuples, _ := c.getAllLevels(turn, pts)

	added := make(map[int]bool)

	// 对赢线进行排序
	sort.Slice(oppLvTuples, func(i, j int) bool {
		return oppLvTuples[i].Lv < oppLvTuples[j].Lv
	})
	sort.Slice(selfLvTuples, func(i, j int) bool {
		return selfLvTuples[i].Lv < selfLvTuples[j].Lv
	})

	// 判断攻守
	if c.shouldDefense(oppLvTuples, selfLvTuples, danger) { // Defense
		var newPts []evaluator.Point
		for _, tp := range oppLvTuples {
			if tp.Lv == 0 {
				return nil, opp, nil, nil
			}
			x := tp.X
			y := tp.Y
			for i := 0; i < 6; i++ {
				xx := x + evaluator.MoveX[tp.Dir]*i
				yy := y + evaluator.MoveY[tp.Dir]*i
				if xx >= 0 && xx < 15 && yy >= 0 && yy < 15 && c.status[xx][yy] == 0 && !added[xx*15+yy] {
					added[xx*15+yy] = true
					newPts = append(newPts, evaluator.Point{
						X: xx,
						Y: yy,
					})
				}
			}
		}
		return newPts, 0, selfLvTuples, oppLvTuples
	} else { //Offense
		//fmt.Println("Offense")
		pts = make([]evaluator.Point, 0)
		for _, tp := range selfLvTuples {
			x := tp.X
			y := tp.Y
			for i := 0; i < 6; i++ {
				xx := x + evaluator.MoveX[tp.Dir]*i
				yy := y + evaluator.MoveY[tp.Dir]*i
				if xx >= 0 && xx < 15 && yy >= 0 && yy < 15 && c.status[xx][yy] == 0 && !added[xx*15+yy] {
					added[xx*15+yy] = true
					pts = append(pts, evaluator.Point{
						X: xx,
						Y: yy,
					})
				}
			}
		}
		return pts, 0, selfLvTuples, oppLvTuples
	}
}

func (c *Calculator) shouldDefense(oppLvTuples []evaluator.LevelTuple, selfLvTuples []evaluator.LevelTuple, danger evaluator.Danger) bool {
	if len(selfLvTuples) > 0 {
		if selfLvTuples[0].Lv <= 2 /* 2 == single4 */ {
			return false
		}
		if len(oppLvTuples) > 0 {
			if selfLvTuples[0].Lv <= oppLvTuples[0].Lv ||
				(selfLvTuples[0].Lv <= 4 /* 4 == single3 */ && oppLvTuples[0].Lv > 2 /* 2 == single4 */) {
				return false
			}
		}
	}
	return danger > 0
}

func (c *Calculator) getAllLevels(turn int, selectable []evaluator.Point) ([]evaluator.LevelTuple, evaluator.Danger) {
	eva := evaluator.NewEvaluator(c.status)
	lvTuple, danger := eva.GetAllLevels(turn, selectable)
	return lvTuple, danger
}
