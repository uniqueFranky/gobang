package calculator

import "gobang-backend/evaluator"

func (c *Calculator) getSelectable(turn int) ([]evaluator.Point, int) {
	selectable := make([][]bool, 15)
	for i := 0; i < 15; i++ {
		selectable[i] = make([]bool, 15)
	}

	for i := 0; i < 15; i++ {
		for j := 0; j < 15; j++ {
			if c.status[i][j] != 0 {
				for k := -3; k <= 3; k++ {
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

	lvTuples, danger := c.getAllLevels(opp, pts)
	if danger > 0 {
		var newPts []evaluator.Point
		for _, tp := range lvTuples {
			if tp.Lv == 0 {
				return nil, opp
			}
			x := tp.X
			y := tp.Y
			for i := 0; i < 6; i++ {
				xx := x + evaluator.MoveX[tp.Dir]*i
				yy := y + evaluator.MoveY[tp.Dir]*i
				if xx >= 0 && xx < 15 && yy >= 0 && yy < 15 && c.status[xx][yy] == 0 {
					newPts = append(newPts, evaluator.Point{
						X: xx,
						Y: yy,
					})
				}
			}
		}
		return newPts, 0
	} else {
		return pts, 0
	}

}

func (c *Calculator) getAllLevels(turn int, selectable []evaluator.Point) ([]evaluator.LevelTuple, evaluator.Danger) {
	eva := evaluator.NewEvaluator(c.status)
	lvTuple, danger := eva.GetAllLevels(turn, selectable)
	return lvTuple, danger
}
