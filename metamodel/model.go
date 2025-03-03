package metamodel

import (
	"fmt"
	json "github.com/gibson042/canonicaljson-go"
	"strconv"
)

type Token struct {
	Value int64 `json:"value"`
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

type Arrow struct {
	Source  string `json:"source"`
	Target  string `json:"target"`
	Weight  Token  `json:"weight,omitempty"`
	Inhibit bool   `json:"inhibit,omitempty"`
}

// FIXME render Places order by offset and Transitions ordered alphabetically
func (m *Model) ToJson() string {
	jsonStr := "{"
	jsonStr += "\"modelType\":\"PetriNet\","
	jsonStr += "\"version\":\"v0\","
	jsonStr += "\"places\":{"
	first := true
	for label, place := range m.Places {
		if !first {
			jsonStr += ","
		}
		first = false
		jsonStr += "\"" + label + "\":{"
		jsonStr += "\"offset\":" + strconv.Itoa(place.Offset) + ","
		if place.Initial.Value != 0 {
			jsonStr += "\"initial\":" + place.Initial.String() + ","
		}
		if place.Capacity.Value != 0 {
			jsonStr += "\"capacity\":" + place.Capacity.String() + ","
		}
		jsonStr += "\"x\":" + strconv.Itoa(place.X) + ","
		jsonStr += "\"y\":" + strconv.Itoa(place.Y)
		jsonStr += "}"
	}
	jsonStr += "},"
	jsonStr += "\"transitions\":{"
	first = true
	for label, transition := range m.Transitions {
		if !first {
			jsonStr += ","
		}
		first = false
		jsonStr += "\"" + label + "\":{"
		jsonStr += "\"x\":" + strconv.Itoa(transition.X) + ","
		jsonStr += "\"y\":" + strconv.Itoa(transition.Y)
		jsonStr += "}"
	}
	jsonStr += "},"
	jsonStr += "\"arcs\":["
	first = true
	for _, arc := range m.Arrows {
		if !first {
			jsonStr += ","
		}
		first = false
		jsonStr += "{"
		jsonStr += "\"source\":\"" + arc.Source + "\","
		jsonStr += "\"target\":\"" + arc.Target + "\""
		if arc.Weight.Value != 0 {
			jsonStr += ",\"weight\":" + arc.Weight.String()
		}
		if arc.Inhibit {
			jsonStr += ",\"inhibit\":true"
		}
		jsonStr += "}"
	}
	jsonStr += "]"
	jsonStr += "}"
	return jsonStr
}

type PlaceInt64 struct {
	Offset   int   `json:"offset"`
	Initial  int64 `json:"initial,omitempty"`  // Initial Token
	Capacity int64 `json:"capacity,omitempty"` // Capacity Token
	X        int   `json:"x"`
	Y        int   `json:"y"`
}

type ArrowInt64 struct {
	Source  string `json:"source"`
	Target  string `json:"target"`
	Weight  int64  `json:"weight,omitempty"`
	Inhibit bool   `json:"inhibit,omitempty"`
}

type importModel struct {
	ModelType   string                `json:"modelType"`
	Version     string                `json:"version"`
	Places      map[string]PlaceInt64 `json:"places"`
	Transitions map[string]Transition `json:"transitions"`
	Arrows      []ArrowInt64          `json:"arcs"`
}

func (m *importModel) ToModel() *Model {
	model := NewModel()
	model.ModelType = m.ModelType
	model.Version = m.Version
	model.Places = make(map[string]Place)
	for label, place := range m.Places {
		model.Places[label] = Place{
			Offset:   place.Offset,
			Initial:  Token{place.Initial},
			Capacity: Token{place.Capacity},
			X:        place.X,
			Y:        place.Y,
		}
	}

	model.Transitions = make(map[string]Transition)
	for label, transition := range m.Transitions {
		model.Transitions[label] = Transition{
			X: transition.X,
			Y: transition.Y,
		}
	}

	model.Arrows = make([]Arrow, len(m.Arrows))
	for i, arrow := range m.Arrows {
		model.Arrows[i] = Arrow{
			Source:  arrow.Source,
			Target:  arrow.Target,
			Weight:  Token{arrow.Weight},
			Inhibit: arrow.Inhibit,
		}
	}

	return model
}

func (m *Model) FromJson(jsonStr string) (*Model, error) {
	im := new(importModel)
	err := json.Unmarshal([]byte(jsonStr), im)
	if err != nil {
		return nil, err
	}
	newModel := im.ToModel() // overwrite m
	m.ModelType = newModel.ModelType
	m.Version = newModel.Version
	m.Places = newModel.Places
	m.Transitions = newModel.Transitions
	m.Arrows = newModel.Arrows
	return m, nil
}
