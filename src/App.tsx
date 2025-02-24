import React from 'react';
import './App.css';

const model = {
    "modelType": "petriNet",
    "version": "v0",
    "places": {
        "place0": {"offset": 0, "initial": 1, "capacity": 3, "x": 130, "y": 207},
        "place1": {"offset": 1, "x": 395, "y": 299}
    },
    "transitions": {
        "txn0": {"x": 46, "y": 116},
        "txn1": {"x": 227, "y": 112},
        "txn2": {"x": 43, "y": 307},
        "txn3": {"x": 235, "y": 306}
    },
    "arcs": [
        {"source": "txn0", "target": "place0"},
        {"source": "place0", "target": "txn1", "weight": 3},
        {"source": "txn2", "target": "place0", "weight": 3, "inhibit": true},
        {"source": "place0", "target": "txn3", "inhibit": true},
        {"source": "txn3", "target": "place1"}
    ]
} as Model

type Model = {
    modelType: string;
    version: string;
    places: Record<string, Place>;
    transitions: Record<string, Transition>;
    arcs: Array<Arrow>;
}

type Place = {
    offset: number;
    initial?: number;
    capacity?: number;
    x: number;
    y: number;
};

type Transition = {
    offset?: number;
    role?: string;
    x: number;
    y: number;
};

type Arrow = {
    source: string;
    target: string;
    weight?: number;
    inhibit?: boolean;
}

function exportAsUrl(model: any): string {
    const params = new URLSearchParams();

    params.append('modelType', model.modelType);
    params.append('version', model.version);

    for (const [placeName, placeData] of Object.entries(model.places as Record<string, Place>)) {
        params.append('place', placeName);
        for (const [key, value] of Object.entries(placeData)) {
            params.append(key, value.toString());
        }
    }

    for (const [transitionName, transitionData] of Object.entries(model.transitions as Record<string, Transition>)) {
        params.append('transition', transitionName);
        for (const [key, value] of Object.entries(transitionData)) {
            params.append(key, value.toString());
        }
    }

    for (const arc of model.arcs) {
        for (const [key, value] of Object.entries(arc)) {
            // @ts-ignore
            params.append(key, value.toString());
        }
    }

    return `?${params.toString()}`;
}

function importFromUrl(url: string): Model {
    const queryString = url.split('?')[1];
    const params = queryString.split('&');

    const model = {
        modelType: '',
        version: '',
        places: {} as Record<string, Place>,
        transitions: {} as Record<string, Transition>,
        arcs: [] as Array<Arrow>
    } as Model;

    let currentPlace: string | null = null;
    let currentTransition: string | null = null;
    let currentArc: number | null = null;

    for (const param of params) {
        const [key, value] = param.split('=');
        const decodedValue = decodeURIComponent(value);

        if (key === 'modelType') {
            model.modelType = decodedValue;
        } else if (key === 'version') {
            model.version = decodedValue;
        } else if (key === 'place') {
            currentTransition = null;
            currentArc = null;
            currentPlace = decodedValue;
            model.places[currentPlace] = {initial: 0, capacity: 0 } as Place;
        } else if (key === 'transition') {
            currentPlace = null;
            currentArc = null;
            currentTransition = decodedValue;
            model.transitions[currentTransition] = {} as Transition;
        } else if (key === 'source') {
            currentPlace = null;
            currentTransition = null;
            currentArc = model.arcs.length;
            model.arcs.push({source: decodedValue, target: '', inhibit: false, weight: 1});
        } else if (key === 'target') {
            currentPlace = null;
            currentTransition = null;
            console.log({key, value, decodedValue})
            model.arcs[currentArc as number].target = decodedValue;
        } else if (currentArc && model.arcs[currentArc]) {
            // @ts-ignore
            if (key === 'inhibit') {
                // @ts-ignore
                model.arcs[currentArc].inhibit = decodedValue === 'true';
            } else {
                // @ts-ignore
                model.arcs[currentArc][key as keyof Arrow] = isNaN(Number(decodedValue)) ? decodedValue : Number(decodedValue);
            }
        } else if (currentPlace && model.places[currentPlace]) {
            // @ts-ignore
            model.places[currentPlace][key as keyof Place] = isNaN(Number(decodedValue)) ? decodedValue : Number(decodedValue);
        } else if (currentTransition && model.transitions[currentTransition]) {
            // @ts-ignore
            model.transitions[currentTransition][key as keyof Transition] = isNaN(Number(decodedValue)) ? decodedValue : Number(decodedValue);
        } else {
            console.error("unknown", {key, value, decodedValue})
        }
    }

    return model;
}

var imported = null;

function toBase64(model: Model): string {
    return btoa(JSON.stringify(model))
}

function toImage(model: Model): string {
    return 'https://pflow.dev/img/?b=' + toBase64(model)
}

function toUrl(model: Model): string {
    return 'https://pflow.dev/?b=' + toBase64(model)
}

function EmbeddedImport(): React.ReactElement {
    if (!window.location.search) {
        return <React.Fragment/>
    }
    imported = importFromUrl(window.location.search);
    // console.log("importing from url")
    // console.log(JSON.stringify(imported));

    return <foreignObject x="600" y="0" width="500" height="500">
        <a href={toUrl(imported)} target="_blank" rel="noreferrer">
            <img src={toImage(imported)} alt="test"/>
        </a>
        <br />
        <a href={exportAsUrl(imported)}>
            Re-encoded Url model
        </a>
    </foreignObject>

}

function App() {
    return (
        <svg width={1500} height={500} viewBox="0 0 1500 500" xmlns="http://www.w3.org/2000/svg">
            <foreignObject x="100" y="0" width="500" height="500">
                <a href={toUrl(model)} target="_blank" rel="noreferrer">
                    <img src={toImage(model)} alt="test"/>
                </a>
                <a href={"?"}> Back &lt;- </a> <br />< br/>
                <a href={exportAsUrl(model)}>
                    Url-encoded model -&gt;
                </a>
            </foreignObject>
            <EmbeddedImport/>
        </svg>
    );
}

export default App;
