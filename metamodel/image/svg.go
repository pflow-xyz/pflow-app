package image

import (
	"fmt"
	"github.com/pflow-xyz/pflow-app/metamodel"
	"strconv"
)

func ExportAsSvg(model *metamodel.Model) string {
	img := newImage(model)
	img.NewSvgImage()
	img.Render()
	return img.Buffer
}

// svgImage represents the Svg display of the Petri net model.
type svgImage struct {
	Buffer string
	Model  *metamodel.Model
	State  map[string]metamodel.Token
}

// newImage creates a new display for the given Petri net model and state.
func newImage(model *metamodel.Model, state ...map[string]metamodel.Token) svgImage {
	if len(state) == 1 {
		return svgImage{Model: model, State: state[0]}
	}
	return svgImage{Model: model, State: make(map[string]metamodel.Token)}
}

// getViewPort calculates the viewport dimensions for the Petri net model.
func (img *svgImage) getViewPort() (x1 int, y1 int, width int, height int) {
	var minX int = 0
	var minY int = 0
	var limitX int = 0
	var limitY int = 0

	for _, p := range img.Model.Places {
		if limitX < p.X {
			limitX = p.X
		}
		if limitY < p.Y {
			limitY = p.Y
		}
		if minX == 0 || minX > p.X {
			minX = p.X
		}
		if minY == 0 || minY > p.Y {
			minY = p.Y
		}
	}
	for _, t := range img.Model.Transitions {
		if limitX < t.X {
			limitX = t.X
		}
		if limitY < t.Y {
			limitY = t.Y
		}
		if minX == 0 || minX > t.X {
			minX = t.X
		}
		if minY == 0 || minY > t.Y {
			minY = t.Y
		}
	}
	const margin = 60
	x1 = minX - margin
	y1 = minY - margin
	x2 := limitX + margin
	y2 := limitY + margin

	return x1, y1, x2 - x1, y2 - y1
}

// NewSvgImage creates a new Svg image for the Petri net model
func (img *svgImage) NewSvgImage() {
	x1, y1, width, height := img.getViewPort()
	img.Buffer += fmt.Sprintf("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"%v\" height=\"%v\" viewBox=\"%v %v %v %v\">", width, height, x1, y1, width, height)
	img.Rect(0, 0, width, height+60, "fill=\"#ffffff\"")
	img.WriteDefs()
}

// WriteDefs writes the Svg definitions for the display.
func (img *svgImage) WriteDefs() {
	img.Buffer += "<defs>" +
		"<marker id=\"markerArrow1\" markerWidth=\"23\" markerHeight=\"13\" refX=\"31\" refY=\"6\" orient=\"auto\">" +
		"<rect width=\"28\" height=\"3\" fill=\"white\" stroke=\"white\" x=\"3\" y=\"5\"/>" +
		"<path d=\"M2,2 L2,11 L10,6 L2,2\"/>" +
		"</marker>" +
		"<marker id=\"markerInhibit1\" markerWidth=\"23\" markerHeight=\"13\" refX=\"31\" refY=\"6\" orient=\"auto\">" +
		"<rect width=\"28\" height=\"3\" fill=\"white\" stroke=\"white\" x=\"3\" y=\"5\"/>" +
		"<circle cx=\"5\" cy=\"6.5\" r=\"4\"/>" +
		"</marker>" +
		"</defs>"
}

// Group starts a new group in the Svg.
func (img *svgImage) Gend() {
	img.WriteElement("</g>")
}

// WriteElement writes an element to the Svg buffer.
func (img *svgImage) WriteElement(element string) {
	img.Buffer += element
}

// Render renders the Petri net model to Svg.
func (img *svgImage) Render() {
	for _, arc := range img.Model.Arrows {
		img.ArcElement(arc)
	}
	for label, place := range img.Model.Places {
		img.PlaceElement(label, place)
	}
	for label, transition := range img.Model.Transitions {
		img.TransitionElement(label, transition)
	}
	img.EndSvg()
}

// PlaceElement renders a place element in the Svg.
func (img *svgImage) PlaceElement(label string, place metamodel.Place) {
	img.Group()
	img.Circle(place.X, place.Y, 16, "stroke-width=\"1.5\" fill=\"#ffffff\" stroke=\"#000000\"")
	img.Text(place.X-18, place.Y-20, label, "font-size=\"small\"")
	x := place.X
	y := place.Y
	tokens := place.Initial
	if state, ok := img.State[label]; ok {
		tokens = state
	}
	if tokens.Value > 0 {
		if tokens.Value == 1 {
			img.Circle(x, y, 2, "fill=\"#000000\" stroke=\"#000000\"")
		} else if tokens.Value < 10 {
			img.Text(x-4, y+5, tokens.String(), "font-size=\"large\"")
		} else {
			img.Text(x-7, y+5, tokens.String(), "font-size=\"small\"")
		}
	}
	img.Gend()
}

// ArcElement renders an arc element in the Svg.
func (img *svgImage) ArcElement(arc metamodel.Arrow) {
	img.Group()
	marker := "url(#markerArrow1)"
	if arc.Inhibit {
		marker = "url(#markerInhibit1)"
	}
	extra := "stroke=\"#000000\" fill=\"#000000\" marker-end=\"" + marker + "\""

	var p metamodel.Place
	var t metamodel.Transition
	if arc.Inhibit {
		if place, ok := img.Model.Places[arc.Source]; ok {
			p = place
			t = img.Model.Transitions[arc.Target]
		} else {
			p = img.Model.Places[arc.Target]
			t = img.Model.Transitions[arc.Source]
		}
	} else {
		if place, ok := img.Model.Places[arc.Source]; ok {
			p = place
			t = img.Model.Transitions[arc.Target]
		} else {
			p = img.Model.Places[arc.Target]
			t = img.Model.Transitions[arc.Source]
		}
	}

	if place, ok := img.Model.Places[arc.Source]; ok {
		p = place
		t = img.Model.Transitions[arc.Target]
		img.Line(p.X, p.Y, t.X, t.Y, extra)
		midX := (p.X + t.X) / 2
		midY := (p.Y+t.Y)/2 - 8
		weight := arc.Weight
		img.Text(midX-4, midY+4, weight.String(), "font-size=\"small\"")
	} else {
		p = img.Model.Places[arc.Target]
		t = img.Model.Transitions[arc.Source]
		img.Line(t.X, t.Y, p.X, p.Y, extra)
		midX := (t.X + p.X) / 2
		midY := (t.Y+p.Y)/2 - 8
		weight := arc.Weight
		img.Text(midX-4, midY+4, weight.String(), "font-size=\"small\"")
	}
	img.Gend()
}

// TransitionElement renders a transition element in the Svg.
func (img *svgImage) TransitionElement(label string, transition metamodel.Transition) {
	img.Group()
	x := transition.X - 17
	y := transition.Y - 17
	img.Rect(x, y, 30, 30, "stroke=\"#000000\" fill=\"#ffffff\" rx=\"4\"")
	img.Text(x, y-8, label, "font-size=\"small\"")
	img.Gend()
}

// EndSvg ends the Svg image.
func (img *svgImage) EndSvg() {
	img.Buffer += "</svg>"
}

// Rect draws a rectangle in the Svg.
func (img *svgImage) Rect(x, y, width, height int, extra string) {
	img.WriteElement("<rect x=\"" + strconv.Itoa(x) + "\" y=\"" + strconv.Itoa(y) + "\" width=\"" + strconv.Itoa(width) + "\" height=\"" + strconv.Itoa(height) + "\" " + extra + " />")
}

// Circle draws a circle in the Svg.
func (img *svgImage) Circle(x, y, radius int, extra string) {
	img.WriteElement("<circle cx=\"" + strconv.Itoa(x) + "\" cy=\"" + strconv.Itoa(y) + "\" r=\"" + strconv.Itoa(radius) + "\" " + extra + " />")
}

// Text draws text in the Svg.
func (img *svgImage) Text(x, y int, txt, extra string) {
	img.WriteElement("<text x=\"" + strconv.Itoa(x) + "\" y=\"" + strconv.Itoa(y) + "\" " + extra + ">" + txt + "</text>")
}

// Line draws a line in the Svg.
func (img *svgImage) Line(x1, y1, x2, y2 int, extra string) {
	img.WriteElement("<line x1=\"" + strconv.Itoa(x1) + "\" y1=\"" + strconv.Itoa(y1) + "\" x2=\"" + strconv.Itoa(x2) + "\" y2=\"" + strconv.Itoa(y2) + "\" " + extra + " />")
}

// Group starts a new group in the Svg.
func (img *svgImage) Group() {
	img.WriteElement("<g>")
}
