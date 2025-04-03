import { parseGoModel } from './golang';
import { ModelData } from '../model';

// REVIEW: this

describe('parseModel', () => {
  it('should parse a simple model', () => {
    const input = `
    Model {
        ModelType: "PetriNet",
        Version: "v0",
        Places: {
            "place1": {
                Offset: 0,
                Initial: [1],
                Capacity: [10],
                X: 100,
                Y: 200
            },
            "place2": {
                Offset: 1,
                Initial: [0],
                Capacity: [5],
                X: 150,
                Y: 250
            }
        },
        Transitions: {
            "transition1": {
                X: 300,
                Y: 400
            }
        },
        Arrows: [
            {
                Source: "place1",
                Target: "transition1",
                Weight: [1],
                Inhibit: false
            }
        ]
    }
    `;

    const expectedModel: ModelData = {
      modelType: 'PetriNet',
      version: 'v0',
      places: {
        place1: { offset: 0, initial: [1], capacity: [10], x: 100, y: 200 },
        place2: { offset: 1, initial: [0], capacity: [5], x: 150, y: 250 }
      },
      transitions: {
        transition1: { x: 300, y: 400 }
      },
      arcs: [
        { source: 'place1', target: 'transition1', weight: [1], inhibit: false }
      ]
    };

    const model = parseGoModel(input);
    expect(model).toEqual(expectedModel);
  });

  it('should handle missing optional fields', () => {
    const input = `
    Model {
        ModelType: "PetriNet",
        Version: "v0",
        Places: {
            "place1": {
                Offset: 0,
                X: 100,
                Y: 200
            }
        },
        Transitions: {
            "transition1": {
                X: 300,
                Y: 400
            }
        },
        Arrows: [
            {
                Source: "place1",
                Target: "transition1"
            }
        ]
    }
    `;

    const expectedModel: ModelData = {
      modelType: 'PetriNet',
      version: 'v0',
      places: {
        place1: { offset: 0, x: 100, y: 200 }
      },
      transitions: {
        transition1: { x: 300, y: 400 }
      },
      arcs: [
        { source: 'place1', target: 'transition1' }
      ]
    };

    const model = parseGoModel(input);
    expect(model).toEqual(expectedModel);
  });

  it('should return an empty model for invalid input', () => {
    const input = `Invalid Model`;

    const expectedModel: ModelData = {
      modelType: '',
      version: '',
      places: {},
      transitions: {},
      arcs: []
    };

    const model = parseGoModel(input);
    expect(model).toEqual(expectedModel);
  });
});