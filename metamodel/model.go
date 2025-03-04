package metamodel

import (
	"fmt"
	"strconv"
)

type Token struct {
	Value int64 `json.go:"value"`
}

func (t Token) String() string {
	return fmt.Sprintf("%v", t.Value)
}

func TokenFromString(s string) Token {
	var i int64
	i, _ = strconv.ParseInt(s, 10, 64)
	return Token{i}
}

func NewModel() *Model {
	return &Model{
		ModelType:   "PetriNet",
		Version:     "v0",
		Places:      make(map[string]Place),
		Transitions: make(map[string]Transition),
		Arrows:      []Arrow{},
	}
}

type Model struct {
	ModelType   string
	Version     string
	Places      map[string]Place
	Transitions map[string]Transition
	Arrows      []Arrow
}

type Place struct {
	Offset   int   `json:"offset"`
	Initial  Token `json:"initial,omitempty"`  // Initial Token
	Capacity Token `json:"capacity,omitempty"` // Capacity Token
	X        int   `json:"x"`
	Y        int   `json:"y"`
}

type Transition struct {
	X int `json:"x"`
	Y int `json:"y"`
}

// REVIEW; json.go is that correct/
type Arrow struct {
	Source  string `json:"source"`
	Target  string `json:"target"`
	Weight  Token  `json:"weight,omitempty"`
	Inhibit bool   `json:"inhibit,omitempty"`
}
