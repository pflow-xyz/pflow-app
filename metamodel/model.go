package metamodel

import (
	"github.com/pflow-xyz/pflow-app/metamodel/token"
	"strconv"
)

func TokenFromString(s string) token.Token {
	var i int64
	i, _ = strconv.ParseInt(s, 10, 64)
	return token.Token{[]int64{i}}
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
	Offset   int         `json:"offset"`
	Initial  token.Token `json:"initial,omitempty"`  // Initial Token
	Capacity token.Token `json:"capacity,omitempty"` // Capacity Token
	X        int         `json:"x"`
	Y        int         `json:"y"`
}

type Transition struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Arrow struct {
	Source  string      `json:"source"`
	Target  string      `json:"target"`
	Weight  token.Token `json:"weight,omitempty"`
	Inhibit bool        `json:"inhibit,omitempty"`
}

func (model *Model) Transform(state []token.Token, action string, multiple int64) ([]token.Token, bool) {
	if multiple <= 0 {
		return state, false
	}
	_, ok := model.Transitions[action]
	if !ok {
		return state, false
	}
	newState := make([]token.Token, len(state))
	for k, token := range state {
		newState[k] = token.Copy()
	}
	for _, arc := range model.Arrows {
		if arc.Target == action {
			i := model.Places[arc.Source].Offset
			newState[i] = newState[i].Sub(arc.Weight, multiple)
		} else if arc.Source == action {
			i := model.Places[arc.Source].Offset
			newState[i] = newState[i].Add(arc.Weight, multiple)
		}
	}
	if !token.ValidState(newState, model) {
		return state, false
	}
	return newState, true
}

func (model *Model) Capacity() []token.Token {
	c := make([]token.Token, len(model.Places))
	for _, p := range model.Places {
		c[p.Offset] = p.Capacity
	}
	return c
}
