package main

import (
	"encoding/json"
	"gobang-backend/calculator"
	"gobang-backend/evaluator"
	"gorilla/mux"
	"net/http"
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
	server.HandleFunc("/getStep", getStep()).Methods("POST")
	//if err := http.ListenAndServeTLS(":9999", "/etc/httpd/ssl/franky.pro.crt", "/etc/httpd/ssl/franky.pro.key", server); err != nil {
	//	log.Fatal(err)
	//}
	http.ListenAndServe(":9999", server)
}

func getStep() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var status [][]int
		if err := json.NewDecoder(r.Body).Decode(&status); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		calc := calculator.NewCalculator(status)
		step := calc.AlphaBeta(1, 5, -1000000000, 1000000000)
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
