export type ModelData = {
    modelType: string;
    version: string;
    places: Record<string, Place>;
    transitions: Record<string, Transition>;
    arcs: Array<Arrow>;
    tokens?: Array<string>; // optional, used for simulation
}

// make token like the go type
export type Token = Array<number>;

export function T(...args: (number | string)[]): Token {
    return args.map(arg => Number(arg) || 0);
}

export type Place = {
    offset: number;
    initial?: Token;
    capacity?: Token;
    tokens?: Token; // optional, used for simulation
    x: number;
    y: number;
};

export type Transition = {
    offset?: number;
    role?: string;
    x: number;
    y: number;
};

export type Arrow = {
    source: string;
    target: string;
    weight?: Token;
    inhibit?: boolean;
};

export class Model {
    modelType: string;
    version: string;
    places: Record<string, Place>;
    transitions: Record<string, Transition>;
    arcs: Array<Arrow>;

    constructor(data: ModelData = {} as Model) {
        this.modelType = data.modelType;
        this.version = data.version;
        this.places = data.places;
        this.transitions = data.transitions;
        this.arcs = data.arcs;
    }

    static fromUrl(url: string): Model {
        return new Model(importUrl(url));
    }

    static fromBase64(base64: string): Model {
        return new Model(JSON.parse(atob(base64)));
    }

    toJson(): string {
        return toJson(this);
    }

    toBase64(): string {
        return btoa(JSON.stringify(this));
    }

    toUrl(): string {
        return exportAsUrl(this);
    }

    toImage(): string {
        return toImage(this);
    }

    toMinUrl(): string {
        return exportAsMinUrl(this);
    }
}

export function exportAsMinUrl(model: any): string {
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

export function importFromMinUrl(url: string): ModelData {
    const queryString = url.split('?')[1];
    const params = queryString.split('&');

    const model: ModelData = {
        modelType: '',
        version: '',
        tokens:["black"],
        places: {},
        transitions: {},
        arcs: []
    };

    let currentPlace: string | null = null;
    let currentTransition: string | null = null;
    let currentArc: number | null = null;

    params.forEach(param => {
        const [key, value] = param.split('=');
        const decodedValue = decodeURIComponent(value);

        switch (key) {
            case 'm':
                model.modelType = decodedValue;
                break;
            case 'v':
                model.version = decodedValue;
                break;
            case 'p':
                currentPlace = decodedValue;
                model.places[currentPlace] = { capacity: T(0), initial: T(0), offset: -1, x: 0, y: 0 } as Place;
                break;
            case 'o':
                if (currentPlace) model.places[currentPlace].offset = Number(decodedValue);
                break;
            case 'i':
                if (currentPlace) model.places[currentPlace].initial = T(decodedValue);
                break;
            case 'c':
                if (currentPlace) model.places[currentPlace].capacity = T(decodedValue);
                break;
            case 'x':
                if (currentPlace) model.places[currentPlace].x = Number(decodedValue);
                else if (currentTransition) model.transitions[currentTransition].x = Number(decodedValue);
                break;
            case 'y':
                if (currentPlace) model.places[currentPlace].y = Number(decodedValue);
                else if (currentTransition) model.transitions[currentTransition].y = Number(decodedValue);
                break;
            case 't':
                currentPlace = null;
                currentTransition = decodedValue;
                model.transitions[currentTransition] = {} as Transition;
                break;
            case 's':
                currentPlace = null;
                currentTransition = null;
                currentArc = model.arcs.length;
                model.arcs.push({source: decodedValue, target: '', inhibit: false, weight: T(1)});
                break;
            case 'e':
                if (currentArc !== null) model.arcs[currentArc].target = decodedValue;
                break;
            case 'n':
                if (currentArc !== null) model.arcs[currentArc].inhibit = decodedValue === "1";
                break;
            case 'w':
                if (currentArc !== null) model.arcs[currentArc].weight = T(decodedValue);
                break;
            default:
                break;
        }
    });

    return model;
}

export function exportAsUrl(model: any): string {
    const params = new URLSearchParams();

    params.append('modelType', model.modelType);
    params.append('version', model.version);

    Object.entries(model.places).forEach(([placeName, placeData]) => {
        params.append('place', placeName);
        // @ts-ignore
        Object.entries(placeData).forEach(([key, value]) => {
            // @ts-ignore
            params.append(key, value.toString());
        });
    });

    Object.entries(model.transitions).forEach(([transitionName, transitionData]) => {
        params.append('transition', transitionName);
        // @ts-ignore
        Object.entries(transitionData).forEach(([key, value]) => {
            // @ts-ignore
            params.append(key, value.toString());
        });
    });

    // @ts-ignore
    model.arcs.forEach(arc => {
        // @ts-ignore
        Object.entries(arc).forEach(([key, value]) => {
            // @ts-ignore
            params.append(key, value.toString());
        });
    });

    return `?${params.toString()}`;
}

export function importUrl(url: string): ModelData {
    // if modelType is in the url use importFromUrl
    if (url.includes('modelType')) {
        return importFromUrl(url);
    } else if (url.includes('m')) {
        return importFromMinUrl(url);
    }
    return {} as Model
}

export function importFromUrl(url: string): ModelData {
    const queryString = url.split('?')[1];
    const params = new URLSearchParams(queryString);

    const model: ModelData = {
        modelType: '',
        version: '',
        places: {},
        transitions: {},
        arcs: []
    };

    let currentPlace: string | null = null;
    let currentTransition: string | null = null;
    let currentArc: number | null = null;

    params.forEach((value, key) => {
        const decodedValue = decodeURIComponent(value);

        switch (key) {
            case 'modelType':
                model.modelType = decodedValue;
                break;
            case 'version':
                model.version = decodedValue;
                break;
            case 'place':
                currentPlace = decodedValue;
                currentTransition = null;
                currentArc = null;
                model.places[currentPlace] = { capacity: T(0), initial: T(0), offset: -1, x: 0, y: 0 } as Place;
                break;
            case 'transition':
                currentTransition = decodedValue;
                currentPlace = null;
                currentArc = null;
                model.transitions[currentTransition] = {} as Transition;
                break;
            case 'source':
                currentArc = model.arcs.length;
                currentPlace = null;
                currentTransition = null;
                model.arcs.push({source: decodedValue, target: '', inhibit: false, weight: T(1)});
                break;
            case 'target':
                if (currentArc !== null) model.arcs[currentArc].target = decodedValue;
                break;
            case 'inhibit':
                if (currentArc !== null) model.arcs[currentArc].inhibit = decodedValue === 'true';
                break;
            default:
                if (currentArc !== null) {
                    // @ts-ignore
                    model.arcs[currentArc][key as keyof Arrow] = isNaN(Number(decodedValue)) ? decodedValue : Number(decodedValue);
                } else if (currentPlace) {
                    // @ts-ignore
                    model.places[currentPlace][key as keyof Place] = isNaN(Number(decodedValue)) ? decodedValue : Number(decodedValue);
                } else if (currentTransition) {
                    // @ts-ignore
                    model.transitions[currentTransition][key as keyof Transition] = isNaN(Number(decodedValue)) ? decodedValue : Number(decodedValue);
                }
                break;
        }
    });

    return model;
}

export function toJson(model: ModelData): string {
    var json = "{\n";
    json += `  "modelType": "${model.modelType}",\n`;
    json += `  "version": "${model.version}",\n`;
    json += `  "tokens": [`;
    if (model.tokens && model.tokens.length > 0) {
        json += `"${model.tokens.join('", "')}"`;
    } else {
        json += `"black"`; // default token
    }
    json += `],\n`; // close tokens
    json += `  "places": {\n`;
    const places = Object.entries(model.places);
    for (let i = 0; i < places.length; i++) {
        const [placeName, placeData] = places[i];
        json += `    "${placeName}": {`;
        json += `"offset": ${placeData.offset},`;
        if (placeData.initial) {
            json += `"initial": [${placeData.initial.join(",")}],`;
        }
        if (placeData.capacity) {
            json += `"capacity": [${placeData.capacity.join(",")}],`;
        }
        json += `"x": ${placeData.x}, "y": ${placeData.y}`;
        json += (i < places.length - 1) ? "},\n" : "}\n";
    }

    json += `  },\n`;

    // Handle transitions
    json += `  "transitions": {\n`;

    const transitions = Object.entries(model.transitions);

    for (let i = 0; i < transitions.length; i++) {
        const [transitionName, transitionData] = transitions[i];
        json += `    "${transitionName}": {`;
        if (transitionData.offset !== undefined) {
            json += `"offset": ${transitionData.offset},`;
        }
        if (transitionData.role) {
            json += `"role": "${transitionData.role}",`;
        }
        json += `"x": ${transitionData.x}, "y": ${transitionData.y}`;
        json += (i < transitions.length - 1) ? "},\n" : "}\n";
    }

    json += `  },\n`; // close transitions

    json += `  "arcs": [\n`;
    const arcs = model.arcs;

    for (let i = 0; i < arcs.length; i++) {
        const arc = arcs[i];
        json += `    {`;
        json += `"source": "${arc.source}",`;
        json += `"target": "${arc.target}"`;
        if (arc.weight) {
            json += `, "weight": [${arc.weight.join(",")}]`;
        }
        if (arc.inhibit) {
            json += `, "inhibit": true`;
        }
        json += (i < arcs.length - 1) ? `},\n` : `}\n`;
    }
    json += `  ]\n`;
    json += `}\n`;
    return json
}

export function toBase64(model: ModelData): string {
    return btoa(toJson(model))
}

export function toImage(model: ModelData): string {
    return 'https://pflow.dev/img/?b=' + toBase64(model)
}

export function toUrl(model: ModelData): string {
    return 'https://pflow.dev/?b=' + toBase64(model)
}
