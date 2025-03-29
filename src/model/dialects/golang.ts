import { ModelData, Arrow, Place, Transition } from '../model';

// REVIEW: this file uses a declarative approach to generate Go code
// consider the other state-machine formats for comparison - it may be possible to build a parser that can handle multiple formats
// or we should favor the 'active' - state machine format over the 'passive' - declarative format
// https://github.com/stackdump/pflow-polyglot/blob/main/golang/main.go

export function exportAsGoModel(model: ModelData): string {
    const places = Object.entries(model.places).map(([key, place]) => {
        return `"${key}": {
            Offset: ${place.offset ?? 0},
            Initial: ${place.initial ?? 0},
            Capacity: ${place.capacity ?? 0},
            X: ${place.x ?? 0},
            Y: ${place.y ?? 0}
        }`;
    }).join(',\n');

    const transitions = Object.entries(model.transitions).map(([key, transition]) => {
        return `"${key}": {
            X: ${transition.x ?? 0},
            Y: ${transition.y ?? 0}
        }`;
    }).join(',\n');

    const arcs = model.arcs.map(arc => {
        return `{
            Source: "${arc.source}",
            Target: "${arc.target}",
            Weight: ${arc.weight ?? 0},
            Inhibit: ${arc.inhibit ?? false}
        }`;
    }).join(',\n');

    return `Model {
        ModelType: "${model.modelType}",
        Version: "${model.version}",
        Places: {
            ${places}
        },
        Transitions: {
            ${transitions}
        },
        Arrows: [
            ${arcs}
        ]
    }`;
}


// REVIEW: consider adding a lexer/parser to handle more complex models
export function parseGoModel(input: string): ModelData {
    const model: ModelData = {
        modelType: '',
        version: '',
        places: {},
        transitions: {},
        arcs: []
    };

    const lines = input.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));

    let currentSection: 'places' | 'transitions' | 'arrows' | null = null;
    let currentKey: string | null = null;

    for (const line of lines) {
        if (line.startsWith('ModelType:')) {
            model.modelType = line.split(':')[1].trim().replace(/"/g, '');
        } else if (line.startsWith('Version:')) {
            model.version = line.split(':')[1].trim().replace(/"/g, '');
        } else if (line.startsWith('Places:')) {
            currentSection = 'places';
        } else if (line.startsWith('Transitions:')) {
            currentSection = 'transitions';
        } else if (line.startsWith('Arrows:')) {
            currentSection = 'arrows';
        } else if (currentSection === 'places' && line.includes(': {')) {
            currentKey = line.split(':')[0].trim().replace(/"/g, '');
            model.places[currentKey] = {} as Place;
        } else if (currentSection === 'transitions' && line.includes(': {')) {
            currentKey = line.split(':')[0].trim().replace(/"/g, '');
            model.transitions[currentKey] = {} as Transition;
        } else if (currentSection === 'arrows' && line.startsWith('{')) {
            model.arcs.push({} as Arrow );
        } else if (currentSection && currentKey && line.includes(':')) {
            const [key, value] = line.split(':').map(part => part.trim().replace(/,$/, ''));
            const parsedValue = isNaN(Number(value)) ? value.replace(/"/g, '') : Number(value);

            if (currentSection === 'places') {
                // @ts-ignore
                model.places[currentKey][key.toLowerCase() as keyof Place] = parsedValue;
            } else if (currentSection === 'transitions') {
                // @ts-ignore
                model.transitions[currentKey][key.toLowerCase() as keyof Transition] = parsedValue;
            } else if (currentSection === 'arrows') {
                const currentArrow = model.arcs[model.arcs.length - 1];
                // @ts-ignore
                currentArrow[key.toLowerCase() as keyof Arrow] = parsedValue;
            }
        }
    }

    return model;
}

// REVIEW: consider adding a snippet generator that includes required imports etc..