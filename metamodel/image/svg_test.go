package image_test

import (
	"github.com/pflow-xyz/pflow-app/metamodel"
	"github.com/pflow-xyz/pflow-app/metamodel/image"
	"strings"
	"testing"
)

var exampleModel = metamodel.Model{
	ModelType: "PetriNet",
	Version:   "v0",
	Places: map[string]metamodel.Place{
		"place0": {Offset: 0, Initial: metamodel.Token{1}, Capacity: metamodel.Token{3}, X: 130, Y: 207},
		"place1": {Offset: 1, Initial: metamodel.Token{0}, Capacity: metamodel.Token{0}, X: 395, Y: 299},
	},
	Transitions: map[string]metamodel.Transition{
		"txn0": {X: 46, Y: 116},
		"txn1": {X: 227, Y: 112},
		"txn2": {X: 43, Y: 307},
		"txn3": {X: 235, Y: 306},
	},
	Arrows: []metamodel.Arrow{
		{Source: "txn0", Target: "place0", Weight: metamodel.Token{1}},
		{Source: "place0", Target: "txn1", Weight: metamodel.Token{3}},
		{Source: "txn2", Target: "place0", Weight: metamodel.Token{3}, Inhibit: true},
		{Source: "place0", Target: "txn3", Weight: metamodel.Token{1}, Inhibit: true},
		{Source: "txn3", Target: "place1", Weight: metamodel.Token{1}},
	},
}

func TestImage(t *testing.T) {
	model := &exampleModel
	svg := image.ExportAsSvg(model)
	if strings.HasPrefix(svg, "<svg") == false {
		t.Errorf("Expected svg, got %v", svg)
	}

	if strings.HasSuffix(svg, "</svg>") == false {
		t.Errorf("Expected svg, got %v", svg)
	}
}
