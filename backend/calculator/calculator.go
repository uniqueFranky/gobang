package calculator

type Calculator struct {
	status [][]int
}

func NewCalculator(status [][]int) *Calculator {
	return &Calculator{status: status}
}
