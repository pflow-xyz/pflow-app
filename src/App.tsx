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

// Example Export
//
// Base64 encoded version of the model:
//
// https://pflow.dev/?b=eyJtb2RlbFR5cGUiOiJwZXRyaU5ldCIsInZlcn
// Npb24iOiJ2MCIsInBsYWNlcyI6eyJwbGFjZTAiOnsiaW5pdGlhbCI6MSwiY
// 2FwYWNpdHkiOjMsIm9mZnNldCI6MCwieCI6MTMwLCJ5IjoyMDd9LCJwbGFj
// ZTEiOnsiaW5pdGlhbCI6MCwiY2FwYWNpdHkiOjAsIm9mZnNldCI6MSwieCI
// 6Mzk1LCJ5IjoyOTl9fSwidHJhbnNpdGlvbnMiOnsidHhuMCI6eyJ4Ijo0Ni
// wieSI6MTE2fSwidHhuMSI6eyJ4IjoyMjcsInkiOjExMn0sInR4bjIiOnsie
// CI6NDMsInkiOjMwN30sInR4bjMiOnsieCI6MjM1LCJ5IjozMDZ9fSwiYXJj
// cyI6W3sic291cmNlIjoidHhuMCIsInRhcmdldCI6InBsYWNlMCIsImluaGl
// iaXQiOmZhbHNlLCJ3ZWlnaHQiOjF9LHsic291cmNlIjoicGxhY2UwIiwidG
// FyZ2V0IjoidHhuMSIsImluaGliaXQiOmZhbHNlLCJ3ZWlnaHQiOjN9LHsic
// 291cmNlIjoidHhuMiIsInRhcmdldCI6InBsYWNlMCIsImluaGliaXQiOnRy
// dWUsIndlaWdodCI6M30seyJzb3VyY2UiOiJwbGFjZTAiLCJ0YXJnZXQiOiJ
// 0eG4zIiwiaW5oaWJpdCI6dHJ1ZSwid2VpZ2h0IjoxfSx7InNvdXJjZSI6In
// R4bjMiLCJ0YXJnZXQiOiJwbGFjZTEiLCJpbmhpYml0IjpmYWxzZSwid2VpZ2h0IjoxfV19
//
// Compare with brotli encoded version
// https://pflow.dev/?z=G5sCIBwHdqMPWUYyo7XgaT/B/8+NT3WcvPDeu7
// qxUgxFDCqCK/KRBeEniEJf6rAojNxceB5GeWQPKMNzjxcXnwuSeCTptkKoH
// kH1utxupuM/CaRc5//wu8bbl2twEmQhzLGvitYK4NqGLIG0KVhGSHPwjPDE
// Bsr6bgZZxvkMq+kpudx1FKU2E60lQT4IcSmuGd8zZHQ6lUa6F38vhvcRtbP
// iGUyoBLLKVK7ZnkVntb+nQGiV3JXEpBDbjFzleFhtrgHy9XrJJJArRQE8hV7/iz/WJuePvvvRh1RRlyl5Lxhk7z01sfNo1dY=
//
// MinUrl encoded version
//
// &p= starts a new place
//  &o= sets the offset of the place
//  &i= sets the initial marking of the place
//  &c= sets the capacity of the place
//  &x= sets the x coordinate of the place
//  &y= sets the y coordinate of the place
//
// &t= starts a new transition
//  &o= sets the offset of the transition
//  &r= sets the role of the transition
//  &x= sets the x coordinate of the transition
//  &y= sets the y coordinate of the transition
//
// &s= starts a new arc (source)
//   &e= ends the arc (target)
//   &w= sets the weight of the arc
//   &n= sets the arc to be an inhibitor arc
//
// http://localhost:3000/?m=petriNet&v=v0
// &p=place0&o=0&i=1&c=3&x=130&y=207
// &p=place1&o=1&x=395&y=299
// &t=txn0&x=46&y=116
// &t=txn1&x=227&y=112
// &t=txn2&x=43&y=307
// &t=txn3&x=235&y=306
// &s=txn0&e=place0
// &s=place0&e=txn1
// &s=txn2&e=place0
// &s=place0&e=txn3
// &s=txn3&e=place1
function exportAsMinUrl(model: any): string {
    const params = new URLSearchParams();

    params.append('m', model.modelType);
    params.append('v', model.version);

    for (const [placeName, placeData] of Object.entries(model.places as Record<string, Place>)) {
        params.append('p', placeName);
        for (const [key, value] of Object.entries(placeData)) {
            switch (key) {
                case 'offset':
                    params.append('o', value.toString());
                    break;
                case 'initial':
                    params.append('i', value.toString());
                    break;
                case 'capacity':
                    params.append('c', value.toString());
                    break;
                case 'x':
                    params.append('x', value.toString());
                    break;
                case 'y':
                    params.append('y', value.toString());
                    break;
                default:
                    break;
            }
        }
    }

    for (const [transitionName, transitionData] of Object.entries(model.transitions as Record<string, Transition>)) {
        params.append('t', transitionName);
        for (const [key, value] of Object.entries(transitionData)) {
            switch (key) {
                case 'offset':
                    params.append('o', value.toString());
                    break;
                case 'role':
                    params.append('r', value.toString());
                    break;
                case 'x':
                    params.append('x', value.toString());
                    break;
                case 'y':
                    params.append('y', value.toString());
                    break;
                default:
                    break;
            }
        }
    }

    for (const arc of model.arcs) {
        for (const [key, value] of Object.entries(arc)) {
            switch (key) {
                case 'source':
                    // @ts-ignore
                    params.append('s', value.toString());
                    break;
                case 'target':
                    // @ts-ignore
                    params.append('e', value.toString());
                    break;
                case 'weight':
                    // @ts-ignore
                    params.append('w', value.toString());
                    break;
                case 'inhibit':
                    if (value) {
                        // @ts-ignore
                        params.append('n', 1);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    return `?${params.toString()}`;
}

function importFromMinUrl(url: string): Model {
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

        if (key === 'm') {
            model.modelType = decodedValue;
        } else if (key === 'v') {
            model.version = decodedValue;
        } else if (key === 'p') {
            currentPlace = decodedValue;
            model.places[currentPlace] = {initial: 0, capacity: 0} as Place;
        } else if (!!currentPlace && key === 'o') {
                model.places[currentPlace].offset = Number(decodedValue);
        } else if (!!currentPlace && key === 'i') {
            model.places[currentPlace]["initial"] = isNaN(Number(decodedValue)) ? 0 : Number(decodedValue);
        } else if (!!currentPlace && key === 'c') {
            model.places[currentPlace]["capacity"] = isNaN(Number(decodedValue)) ? 0 : Number(decodedValue);
        }  else if (!!currentPlace && key === 'x') {
            model.places[currentPlace].x = Number(decodedValue);
        } else if (!!currentPlace && key === 'y') {
            model.places[currentPlace].y = Number(decodedValue);
        } else if (key === 't') {
            currentPlace = null;
            currentTransition = decodedValue;
            model.transitions[currentTransition] = {} as Transition;
        }  else if (!!currentTransition && key === 'x') {
            model.transitions[currentTransition].x = Number(decodedValue);
        } else if (!!currentTransition && key === 'y') {
            model.transitions[currentTransition].y = Number(decodedValue);
        } else if (key === 's') {
            currentPlace = null;
            currentTransition = null;
            currentArc = model.arcs.length;
            model.arcs.push({source: decodedValue, target: '', inhibit: false, weight: 1});
        } else if (currentArc !== null && key === 'e') {
            model.arcs[currentArc].target = decodedValue;
        } else if (currentArc !== null && key === 'n') {
            model.arcs[currentArc].inhibit = decodedValue === "1";
        } else if (currentArc !== null && key === 'w') {
            model.arcs[currentArc].weight = Number(decodedValue)
        } else {
            console.log({key, value, decodedValue, currentArc, currentTransition, currentPlace, msg: "unmatched"})
        }
    }

    console.log(JSON.stringify(model));

    return model;
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

function importUrl(url: string): Model {
    // if modelType is in the url use importFromUrl
    if (url.includes('modelType')) {
        return importFromUrl(url);
    } else if (url.includes('m')) {
        return importFromMinUrl(url);
    }
    return {} as Model
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
            model.arcs[currentArc as number].target = decodedValue;
        } else if (currentArc && model.arcs[currentArc]) {
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
        }
    }

    return model;
}

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
    var imported = null;
    if (!window.location.search) {
        return <React.Fragment/>
    }
    imported = importUrl(window.location.search);
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
    var minUrl = exportAsMinUrl(model);
    // add newlines before each place, transition, and arc
    minUrl = minUrl.replaceAll("&p=", "\n\n&p=");
    minUrl = minUrl.replaceAll("&t=", "\n\n&t=");
    minUrl = minUrl.replaceAll("&s=", "\n\n&s=");
    return (
        <svg width={1500} height={1000} viewBox="0 0 1500 1000" xmlns="http://www.w3.org/2000/svg">
            <foreignObject x="100" y="0" width="1500" height="1000">
                <a href={toUrl(model)} target="_blank" rel="noreferrer">
                    <img src={toImage(model)} alt="test"/>
                </a>
                <br />< br/>
                <a href={"?"}> Back &lt;- </a>
                <br />< br/>
                <a href={exportAsUrl(model)}>
                    Url-encoded model -&gt;
                </a>
                <br />< br/>
                <a href={exportAsMinUrl(model)}>
                    MinUrl-encoded model -&gt;
                </a>
                <pre>{minUrl}</pre>
            </foreignObject>
            <EmbeddedImport/>
        </svg>
    );
}

export default App;
