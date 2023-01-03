package zobrist

import "sync"

var lock sync.Mutex
var mp []map[uint64]int64

type Hasher struct {
	*Zobrist
}

func InitHasher() {
	mp = make([]map[uint64]int64, 12)
	for i := 0; i <= 5; i++ {
		mp[i] = make(map[uint64]int64)
	}
}

func NewHasher(hashValue uint64) *Hasher {
	return &Hasher{
		Zobrist: newZobrist(hashValue),
	}
}

func (h *Hasher) PutAt(x int, y int, original int, now int) {
	h.putAt(x, y, original, now)
}

func (h *Hasher) GetHashValue() uint64 {
	return h.getHashValue()
}

func (h *Hasher) GetScore(dep int) (int64, bool) {
	lock.Lock()
	defer lock.Unlock()
	rec, ok := mp[dep][h.hashValue]
	if ok {
		return rec, true
	}
	return 0, false
}

func (h *Hasher) SetScore(dep int, score int64) {
	lock.Lock()
	defer lock.Unlock()
	_, ok := mp[dep][h.hashValue]
	if !ok && score != 10000000 && score != -10000000 {
		mp[dep][h.hashValue] = score
		//fmt.Println("set", dep, h.hashValue, score)
	}
}
