package image_test

import (
	. "github.com/pflow-xyz/pflow-app/metamodel"
	"testing"
)

func sampleModel() *Model {
	return &Model{
		ModelType: "PetriNet",
		Version:   "v0",
		Places: map[string]Place{
			"p1": {Offset: 0, Initial: Token{1}, X: 100, Y: 100},
		},
		Transitions: map[string]Transition{
			"t1": {200, 200},
		},
		Arrows: []Arrow{
			{Source: "p1", Target: "t1", Weight: Token{1}},
		},
	}
}

func TestNewSvg(t *testing.T) {

}
