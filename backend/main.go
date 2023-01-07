package main

import (
	"encoding/json"
	"fmt"
	"gobang-backend/calculator"
	"gobang-backend/evaluator"
	"gobang-backend/zobrist"
	"gorilla/mux"
	"net/http"
	"strconv"
)

type Server struct {
	*mux.Router
}

type Step struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func main() {
	server := Server{mux.NewRouter()}
	evaluator.Init()
	zobrist.InitHasher()
	zobrist.ZobristInit()
	server.HandleFunc("/getStep/{zobrist}/{stepCnt}", getStep()).Methods("POST")
	//if err := http.ListenAndServeTLS(":9999", "/etc/httpd/ssl/franky.pro.crt", "/etc/httpd/ssl/franky.pro.key", server); err != nil {
	//	fmt.Println("ERROR!!!!!!!!")
	//}
	http.ListenAndServe(":9999", server)

}

func getStep() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var status [][]int
		if err := json.NewDecoder(r.Body).Decode(&status); err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		hashString := mux.Vars(r)["zobrist"]
		stepCntString := mux.Vars(r)["stepCnt"]
		hashValue, err := strconv.ParseUint(hashString, 10, 64)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		stepCnt, err := strconv.ParseInt(stepCntString, 10, 64)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		hasher := zobrist.NewHasher(hashValue)
		calc := calculator.NewCalculator(status)
		var score1 int64
		var step int64

		step = calc.AlphaBeta(1, 5, -10000000, 10000000, hasher, &score1, int(stepCnt))

		y := step % 15
		x := (step - y) / 15
		s := Step{
			X: int(x),
			Y: int(y),
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(s); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
