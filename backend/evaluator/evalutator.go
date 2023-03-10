package evaluator

import "fmt"

type Evaluator struct {
	status [][]int
}

type LevelTuple struct {
	X   int
	Y   int
	Lv  Level
	Dir Direction
}

type Point struct {
	X int
	Y int
}

func NewEvaluator(status [][]int) *Evaluator {
	return &Evaluator{status: status}
}

func (e *Evaluator) getLevel(x int, y int, turn int, dir Direction) Level {
	var s [6]int
	for i := 0; i < 6; i++ {
		xx := x + MoveX[dir]*i
		yy := y + MoveY[dir]*i
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
	lv := level[s[0]][s[1]][s[2]][s[3]][s[4]][s[5]]
	return lv
}

func (e *Evaluator) GetAllLevels(turn int, selectable []Point) ([]LevelTuple, Danger) {
	//fmt.Println("getAllLevelsOf", turn)
	var lvTuple []LevelTuple
	var danger Danger = 0
	moveLen := len(selectable)
	for id := 0; id < moveLen; id++ {
		i := selectable[id].X
		j := selectable[id].Y
		for dir := horizontal; dir <= subDiagonal; dir++ {
			lv := e.getLevel(i, j, turn, dir)
			tp := LevelTuple{
				X:   i,
				Y:   j,
				Lv:  lv,
				Dir: dir,
			}
			if lv <= warning { //WARNING
				if danger == safe {
					lvTuple = make([]LevelTuple, 0)
					danger = dangerous
				}
				lvTuple = append(lvTuple, tp)
			} else {
				if danger == safe {
					lvTuple = append(lvTuple, tp)
				}
			}

		}
	}
	//fmt.Println(danger)
	return lvTuple, danger
}

func (e *Evaluator) GetLevelsForCalculator(turn int) []LevelTuple {
	var lvTuple []LevelTuple
	for i := 0; i < 15; i++ {
		for j := 0; j < 15; j++ {
			for dir := horizontal; dir <= subDiagonal; dir++ {
				lv := e.getLevel(i, j, turn, dir)
				tp := LevelTuple{
					X:   i,
					Y:   j,
					Lv:  lv,
					Dir: dir,
				}
				lvTuple = append(lvTuple, tp)
			}
		}
	}
	return lvTuple
}

func (e *Evaluator) Print() {
	fmt.Println(e.status)
}
