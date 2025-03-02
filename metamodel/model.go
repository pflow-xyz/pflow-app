package metamodel

import (
	"fmt"
	"net/url"
	"sort"
	"strconv"
)

type Token struct {
	Value int64
}

func (t *Token) String() string {
	return fmt.Sprintf("%v", *t)
}

func TokenFromString(s string) Token {
	var i int64
	i, _ = strconv.ParseInt(s, 10, 64)
	return Token{i}
}

type Model struct {
	ModelType   string
	Version     string
	Places      map[string]Place
	Transitions map[string]Transition
	Arrows      []Arrow
}

type Place struct {
	Offset   int
	Initial  Token
	Capacity Token
	X        int
	Y        int
}

type Transition struct {
	X int
	Y int
}

type Arrow struct {
	Source  string
	Target  string
	Weight  Token
	Inhibit bool
}

func ExportAsUrl(model *Model) string {
	params := url.Values{}
	params.Add("m", model.ModelType)
	params.Add("v", model.Version)

	// sorted place names
	placeNames := make([]string, 0, len(model.Places))
	{
		for placeName := range model.Places {
			placeNames = append(placeNames, placeName)
		}
		sort.Slice(placeNames, func(i, j int) bool {
			return placeNames[i] < placeNames[j]
		})
	}

	for placeName, placeData := range model.Places {
		params.Add("p", placeName)
		params.Add("o", strconv.Itoa(placeData.Offset))
		params.Add("i", placeData.Initial.String())
		params.Add("c", placeData.Capacity.String())
		params.Add("x", strconv.Itoa(placeData.X))
		params.Add("y", strconv.Itoa(placeData.Y))
	}

	transitionNames := make([]string, 0, len(model.Transitions))
	{ // sorted transition names
		for transitionName := range model.Transitions {
			transitionNames = append(transitionNames, transitionName)
		}
		sort.Slice(transitionNames, func(i, j int) bool {
			return transitionNames[i] < transitionNames[j]
		})
	}

	for _, transitionName := range transitionNames {
		params.Add("t", transitionName)
		params.Add("x", strconv.Itoa(model.Transitions[transitionName].X))
		params.Add("y", strconv.Itoa(model.Transitions[transitionName].Y))
	}

	// arcs are in natural order
	for _, arc := range model.Arrows {
		params.Add("s", arc.Source)
		params.Add("e", arc.Target)
		params.Add("w", arc.Weight.String())
		if arc.Inhibit {
			params.Add("n", "1")
		}
	}

	return "?" + params.Encode()
}

func ImportFromUrl(model *Model, urlString string) {
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
				model.Places[currentPlace] = Place{}
			case "o":
				if currentPlace != "" {
					offset, _ := strconv.Atoi(decodedValue)
					place := model.Places[currentPlace]
					place.Offset = offset
					model.Places[currentPlace] = place
				}
			case "i":
				if currentPlace != "" {
					place := model.Places[currentPlace]
					place.Initial = TokenFromString(decodedValue)
					model.Places[currentPlace] = place
				}
			case "c":
				if currentPlace != "" {
					place := model.Places[currentPlace]
					place.Capacity = TokenFromString(decodedValue)
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
				model.Transitions[currentTransition] = Transition{}
			case "s":
				currentPlace = ""
				currentTransition = ""
				currentArc = len(model.Arrows)
				model.Arrows = append(model.Arrows, Arrow{Source: decodedValue})
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
					arc := model.Arrows[currentArc]
					arc.Weight = TokenFromString(decodedValue)
					model.Arrows[currentArc] = arc
				}
			}
		}
	}
}
