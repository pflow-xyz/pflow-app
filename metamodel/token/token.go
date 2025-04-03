package token

import "strconv"

func T(i ...interface{}) Token {
	t := make([]int64, len(i))
	for j := range i {
		switch i[j].(type) {
		case int:
			t[j] = int64(i[j].(int))
		case int64:
			t[j] = i[j].(int64)
		case string:
			var err error
			t[j], err = strconv.ParseInt(i[j].(string), 10, 64)
			if err != nil {
				panic(err)
			}
		default:
			panic("unsupported type")
		}
	}
	return Token{Value: t}
}

type Token struct {
	Value []int64 `json:"value"`
}

// REVIEW: this is uses to export a single value - will need to support vectors
func (a Token) String(i int) string {
	return strconv.FormatInt(a.Value[i], 10)
}

func (a Token) Add(b Token, weight ...int64) Token {
	var w int64
	if len(weight) == 0 {
		w = weight[0]
	} else {
		w = 1
	}
	c := Token{}
	for i := range a.Value {
		c.Value = append(c.Value, a.Value[i]+b.Value[i]*w)
	}
	return c
}

func (a Token) Sub(b Token, weight ...int64) Token {
	var w int64
	if len(weight) == 0 {
		w = weight[0]
	} else {
		w = 1
	}
	c := Token{}
	for i := range a.Value {
		c.Value = append(c.Value, a.Value[i]-b.Value[i]*w)
	}
	return c
}

func (a Token) Copy() Token {
	b := Token{}
	for i := range a.Value {
		b.Value = append(b.Value, a.Value[i])
	}
	return b
}

type modelCapacity interface {
	Capacity() []Token
}

func ValidState(s []Token, m modelCapacity) bool {
	c := m.Capacity()
	for i := range s {
		for j := range s[i].Value {
			if s[i].Value[j] < 0 || s[i].Value[j] > c[i].Value[j] {
				return false
			}
		}
	}
	return true
}
