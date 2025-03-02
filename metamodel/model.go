package metamodel

import (
	"fmt"
	"strconv"
)

type Token struct {
	Value int64
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
	Offset   int
	Initial  Token
	Capacity Token
	X        int
	Y        int
}

type Transition struct {
	X int
	Y int
}

type Arrow struct {
	Source  string
	Target  string
	Weight  Token
	Inhibit bool
}
