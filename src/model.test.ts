import {importFromUrl, importFromMinUrl, exportAsUrl, Model, exportAsMinUrl} from './model';
import { parseUrl, parseMinUrl, LexModel } from './parser';


const testModel = {
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

describe('Model Tests', () => {

  it('should import model from URL', () => {
    const url = '?modelType=testModel&version=1.0&place=place1&offset=10&initial=5&capacity=20&x=100&y=200&transition=trans1&x=300&y=400&source=place1&target=trans1&weight=2&inhibit=true';
    const model: Model = importFromUrl(url);
    expect(model.modelType).toBe('testModel');
    expect(model.version).toBe('1.0');
    expect(model.places['place1']).toEqual({ offset: 10, initial: 5, capacity: 20, x: 100, y: 200 });
    expect(model.transitions['trans1']).toEqual({ x: 300, y: 400 });
    expect(model.arcs[0]).toEqual({ source: 'place1', target: 'trans1', weight: 2, inhibit: true });
  });

  it('should import model from minified URL', () => {
    const minUrl = '?m=testModel&v=1.0&p=place1&o=10&i=5&c=20&x=100&y=200&t=trans1&x=300&y=400&s=place1&e=trans1&w=2&n=1';
    const model: Model = importFromMinUrl(minUrl);
    expect(model.modelType).toBe('testModel');
    expect(model.version).toBe('1.0');
    expect(model.places['place1']).toEqual({ offset: 10, initial: 5, capacity: 20, x: 100, y: 200 });
    expect(model.transitions['trans1']).toEqual({ x: 300, y: 400 });
    expect(model.arcs[0]).toEqual({ source: 'place1', target: 'trans1', weight: 2, inhibit: true });
  });

  it('should parse URL correctly', () => {
    const url = exportAsUrl(testModel)

    const m: LexModel | Error = parseUrl(url);
    if (m instanceof Error) {
        throw m;
    }
    expect(m).toEqual(testModel);
  });

  it('should parse minified URL correctly', () => {
    const minUrl = exportAsMinUrl(testModel)

    const m: LexModel | Error = parseMinUrl(minUrl);
    if (m instanceof Error) {
        throw m;
    }
    expect(m).toEqual(testModel);
  });
});