package url_test

import (
	"github.com/pflow-xyz/pflow-app/metamodel"
	"github.com/pflow-xyz/pflow-app/metamodel/url"
	"strings"
	"testing"
)

var example = []string{
	"?m=PetriNet&v=v0",
	"&p=place0&o=0&i=1&c=3&x=130&y=207",
	"&p=place1&o=1&i=0&c=0&x=395&y=299",
	"&t=txn0&x=46&y=116&t=txn1&x=227&y=112",
	"&t=txn2&x=43&y=307&t=txn3&x=235&y=306",
	"&s=txn0&e=place0&w=1",
	"&s=place0&e=txn1&w=3",
	"&s=txn2&e=place0&w=3&n=1",
	"&s=place0&e=txn3&w=1&n=1",
	"&s=txn3&e=place1&w=1",
}

var exampleUrl = strings.Join(example, "")

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

func TestExportAsUrl(t *testing.T) {
	model := &exampleModel
	urlString := url.ExportAsUrl(model)
	if urlString != exampleUrl {
		t.Errorf("Missmatch:  |%v|", urlString)
	}
}

func TestImportFromUrl(t *testing.T) {
	model := metamodel.NewModel()
	url.ImportFromUrl(model, exampleUrl)

	if model.ModelType != "PetriNet" {
		t.Errorf("Expected petriNet, got %v", model.ModelType)
	}
	if model.Version != "v0" {
		t.Errorf("Expected v0, got %v", model.Version)
	}

	if len(model.Places) != 2 {
		t.Errorf("Expected 2 places, got %v", len(model.Places))
	}

	if len(model.Transitions) != 4 {
		t.Errorf("Expected 4 transitions, got %v", len(model.Transitions))
	}

}
