package metamodel

import (
	json2 "encoding/json"
	"io"
	"strconv"
)

type importModel struct {
	ModelType   string                `json:"modelType"`
	Version     string                `json:"version"`
	Places      map[string]PlaceInt64 `json:"places"`
	Transitions map[string]Transition `json:"transitions"`
	Arrows      []ArrowInt64          `json:"arcs"`
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

func (m *Model) ToJson(w io.Writer) {
	w.Write([]byte("{"))
	w.Write([]byte("\"modelType\":\"PetriNet\","))
	w.Write([]byte("\"version\":\"v0\","))
	w.Write([]byte("\"places\":{"))
	first := true
	for label, place := range m.Places {
		if !first {
			w.Write([]byte(","))
		}
		first = false
		w.Write([]byte("\"" + label + "\":{"))
		w.Write([]byte("\"offset\":" + strconv.Itoa(place.Offset) + ","))
		if place.Initial.Value != 0 {
			w.Write([]byte("\"initial\":" + place.Initial.String() + ","))
		}
		if place.Capacity.Value != 0 {
			w.Write([]byte("\"capacity\":" + place.Capacity.String() + ","))
		}
		w.Write([]byte("\"x\":" + strconv.Itoa(place.X) + ","))
		w.Write([]byte("\"y\":" + strconv.Itoa(place.Y)))
		w.Write([]byte("}"))
	}
	w.Write([]byte("},"))
	w.Write([]byte("\"transitions\":{"))
	first = true
	for label, transition := range m.Transitions {
		if !first {
			w.Write([]byte(","))
		}
		first = false
		w.Write([]byte("\"" + label + "\":{"))
		w.Write([]byte("\"x\":" + strconv.Itoa(transition.X) + ","))
		w.Write([]byte("\"y\":" + strconv.Itoa(transition.Y)))
		w.Write([]byte("}"))
	}
	w.Write([]byte("},"))
	w.Write([]byte("\"arcs\":["))
	first = true
	for _, arc := range m.Arrows {
		if !first {
			w.Write([]byte(","))
		}
		first = false
		w.Write([]byte("{"))
		w.Write([]byte("\"source\":\"" + arc.Source + "\","))
		w.Write([]byte("\"target\":\"" + arc.Target + "\""))
		if arc.Weight.Value != 0 {
			w.Write([]byte(",\"weight\":" + arc.Weight.String()))
		}
		if arc.Inhibit {
			w.Write([]byte(",\"inhibit\":true"))
		}
		w.Write([]byte("}"))
	}
	w.Write([]byte("]"))
	w.Write([]byte("}"))
}

func (m *Model) FromJson(jsonStr string) (*Model, error) {
	im := new(importModel)
	err := json2.Unmarshal([]byte(jsonStr), im)
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
