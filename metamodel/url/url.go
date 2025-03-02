package url

import (
	"fmt"
	"github.com/pflow-xyz/pflow-app/metamodel"
	"net/url"
	"strconv"
)

// creates a minified URL from a model
func exportAsUrl(model metamodel.Model) string {
	params := url.Values{}
	params.Add("m", model.ModelType)
	params.Add("v", "0")

	for placeName, placeData := range model.Places {
		params.Add("p", placeName)
		params.Add("o", strconv.Itoa(int(placeData.Offset)))
		params.Add("i", strconv.Itoa(int(placeData.Initial)))
		params.Add("c", strconv.Itoa(int(placeData.Capacity)))
		params.Add("x", strconv.Itoa(int(placeData.X)))
		params.Add("y", strconv.Itoa(int(placeData.Y)))
	}

	for transitionName, transitionData := range model.Transitions {
		params.Add("t", transitionName)
		params.Add("x", strconv.Itoa(int(transitionData.X)))
		params.Add("y", strconv.Itoa(int(transitionData.Y)))
	}

	for _, arc := range model.Arrows {
		params.Add("s", arc.Source) // FIXME: get string
		params.Add("e", arc.Target)
		params.Add("w", strconv.Itoa(arc.Weight))
		if arc.Inhibit {
			params.Add("n", "1")
		}
	}

	return "?" + params.Encode()
}

// imports a model from a minified URL
func importFromMinUrl(model *metamodel.Model, urlString string) {
	parsedUrl, err := url.Parse(urlString)
	if err != nil {
		fmt.Println("Error parsing URL:", err)
		return
	}

	params := parsedUrl.Query()
	var currentPlace string
	var currentTransition string
	var currentArc int

	for key, values := range params {
		for _, value := range values {
			decodedValue, _ := url.QueryUnescape(value)
			switch key {
			case "m":
				model.ModelType = decodedValue
			case "v":
				model.Version = decodedValue
			case "p":
				currentPlace = decodedValue
				model.Places[currentPlace] = metamodel.Place{}
			case "o":
				if currentPlace != "" {
					offset, _ := strconv.Atoi(decodedValue)
					place := model.Places[currentPlace]
					place.Offset = offset
					model.Places[currentPlace] = place
				}
			case "i":
				if currentPlace != "" {
					initial, _ := strconv.Atoi(decodedValue)
					place := model.Places[currentPlace]
					place.Initial = initial
					model.Places[currentPlace] = place
				}
			case "c":
				if currentPlace != "" {
					capacity, _ := strconv.Atoi(decodedValue)
					place := model.Places[currentPlace]
					place.Capacity = capacity
					model.Places[currentPlace] = place
				}
			case "x":
				if currentPlace != "" {
					x, _ := strconv.Atoi(decodedValue)
					place := model.Places[currentPlace]
					place.X = x
					model.Places[currentPlace] = place
				} else if currentTransition != "" {
					x, _ := strconv.Atoi(decodedValue)
					transition := model.Transitions[currentTransition]
					transition.X = x
					model.Transitions[currentTransition] = transition
				}
			case "y":
				if currentPlace != "" {
					y, _ := strconv.Atoi(decodedValue)
					place := model.Places[currentPlace]
					place.Y = y
					model.Places[currentPlace] = place
				} else if currentTransition != "" {
					y, _ := strconv.Atoi(decodedValue)
					transition := model.Transitions[currentTransition]
					transition.Y = y
					model.Transitions[currentTransition] = transition
				}
			case "t":
				currentPlace = ""
				currentTransition = decodedValue
				model.Transitions[currentTransition] = metamodel.Transition{}
			case "s":
				currentPlace = ""
				currentTransition = ""
				currentArc = len(model.Arrows)
				model.Arrows = append(model.Arrows, metamodel.Arrow{Source: decodedValue})
			case "e":
				if currentArc != -1 {
					arc := model.Arrows[currentArc]
					arc.Target = decodedValue
					model.Arrows[currentArc] = arc
				}
			case "n":
				if currentArc != -1 {
					arc := model.Arrows[currentArc]
					arc.Inhibit = decodedValue == "1"
					model.Arrows[currentArc] = arc
				}
			case "w":
				if currentArc != -1 {
					weight, _ := strconv.Atoi(decodedValue)
					arc := model.Arrows[currentArc]
					arc.Weight = weight
					model.Arrows[currentArc] = arc
				}
			}
		}
	}
}
