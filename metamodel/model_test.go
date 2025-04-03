package metamodel_test

import (
	. "github.com/pflow-xyz/pflow-app/metamodel"
	"github.com/pflow-xyz/pflow-app/metamodel/cid"
	. "github.com/pflow-xyz/pflow-app/metamodel/token"
	"strings"
	"testing"
)

// TODO: support multiple tokens

var exampleModel = Model{
	ModelType: "PetriNet",
	Version:   "v0",
	Places: map[string]Place{
		"place0": {Offset: 0, Initial: T(1), Capacity: T(3), X: 130, Y: 207},
		"place1": {Offset: 1, Initial: T(0), Capacity: T(0), X: 395, Y: 299},
	},
	Transitions: map[string]Transition{
		"txn0": {X: 46, Y: 116},
		"txn1": {X: 227, Y: 112},
		"txn2": {X: 43, Y: 307},
		"txn3": {X: 235, Y: 306},
	},
	Arrows: []Arrow{
		{Source: "txn0", Target: "place0", Weight: T(1)},
		{Source: "place0", Target: "txn1", Weight: T(3)},
		{Source: "txn2", Target: "place0", Weight: T(3), Inhibit: true},
		{Source: "place0", Target: "txn3", Weight: T(1), Inhibit: true},
		{Source: "txn3", Target: "place1", Weight: T(1)},
	},
}

func TestImportFromJson(t *testing.T) {
	var w strings.Builder
	exampleModel.ToJson(&w)
	json := w.String()
	println(json)
	model := NewModel()
	importedModel, err := model.FromJson(json)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if len(importedModel.Places) != 2 {
		t.Errorf("Expected 2 places, got %v", len(importedModel.Places))
	}
	if len(importedModel.Transitions) != 4 {
		t.Errorf("Expected 4 transitions, got %v", len(importedModel.Transitions))
	}
	if len(importedModel.Arrows) != 5 {
		t.Errorf("Expected 5 arrows, got %v", len(importedModel.Arrows))
	}

	importedCid := cid.NewCid(importedModel).String()
	modelCid := cid.NewCid(model).String()
	if importedCid != modelCid {
		t.Errorf("Expected %v, got %v", modelCid, importedCid)
	}
}
