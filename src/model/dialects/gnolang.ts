export {}

/*

package home

import (
	mm "gno.land/p/pflow/metamodel"
)

// exampleModel returns a simple Petri net model.
func exampleModel() *mm.Pflow {
	return &mm.Pflow{
		Places: map[string]mm.Place{
			"place0": {Offset: 0, Initial: 1, Capacity: 3, X: 130, Y: 207},
		},
		Transitions: map[string]mm.Transition{
			"txn0": {X: 46, Y: 116},
			"txn1": {X: 227, Y: 112},
			"txn2": {X: 43, Y: 307},
			"txn3": {X: 235, Y: 306},
		},
		Arrows: []mm.Arrow{
			{Source: "txn0", Target: "place0", Weight: 1},
			{Source: "place0", Target: "txn1", Weight: 3},
			{Source: "txn2", Target: "place0", Weight: 3, Inhibit: true},
			{Source: "place0", Target: "txn3", Weight: 1, Inhibit: true},
		},
	}
}

var m = exampleModel()

func Render(path string) string {
	image := m.ToImageMarkdown()
	return intro +
		libraries +
		"#### ToLinkMarkdown()\n - export the model as markdown image \n" +
		"- rendered as svg using [https://pflow.dev/img/?b=&lt;Base64&gt;](https://pflow.dev)" +
		"\n\n" + m.ToLinkMarkdown() + "\n\n" +
		"#### ToJson()\n - export the model as json\n - json can be edited using [https://pflow.dev/editor](https://pflow.dev/editor)" +
		"\n\n```json\n" + m.ToJson() + "\n```\n\n" +
		"#### ToSvg()\n - draw the model as an Svg image\n - save to file an open with browser or any Svg compatible program" +
		"\n\n```svg\n" + m.ToSvg() + "\n```\n\n" +
		"#### ToImageMardown()\n - export the model as a data URL\n - copy and paste into an <img> tag" +
		"\n\n" + image + "\n\n" +
		"\n\n```\n" + image + "\n```\n\n" +
		"#### Pflow Model \n\n Review the Gnolang source below for this state machine. \n\n" +
		"```go\n" + exampleSource + "\n```\n"
}
 */