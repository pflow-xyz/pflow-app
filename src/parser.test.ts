import { parseUrl, parseMinUrl, Model } from './parser';

describe('parseUrl', () => {
  it('should parse a simple URL', () => {
    const url = '/?modelType=petriNet&version=v0';
    const model = parseUrl(url) as Model;

    expect(model).toEqual({
      modelType: 'petriNet',
      version: 'v0',
      places: {},
      transitions: {},
      arcs: []
    });
  });

  it('should parse a URL with places and transitions', () => {
    const url = '/?modelType=petriNet&version=v0&place=place0&offset=0&initial=1&capacity=3&x=130&y=207&place=place1&offset=1&x=395&y=299&transition=txn0&x=46&y=116&transition=txn1&x=227&y=112&transition=txn2&x=43&y=307&transition=txn3&x=235&y=306';
    const model = parseUrl(url) as Model;

    expect(model).toEqual({
      modelType: 'petriNet',
      version: 'v0',
      places: {
        place0: { offset: 0, initial: 1, capacity: 3, x: 130, y: 207 },
        place1: { offset: 1, x: 395, y: 299 }
      },
      transitions: {
        txn0: { x: 46, y: 116 },
        txn1: { x: 227, y: 112 },
        txn2: { x: 43, y: 307 },
        txn3: { x: 235, y: 306 }
      },
      arcs: []
    });
  });

  it('should parse a URL with arcs', () => {
    const url = '/?modelType=petriNet&version=v0&source=txn0&target=place0&source=place0&target=txn1&weight=3&source=txn2&target=place0&weight=3&inhibit=true&source=place0&target=txn3&inhibit=true&source=txn3&target=place1';
    const model = parseUrl(url) as Model;

    expect(model).toEqual({
      modelType: 'petriNet',
      version: 'v0',
      places: {},
      transitions: {},
      arcs: [
        { source: 'txn0', target: 'place0' },
        { source: 'place0', target: 'txn1', weight: 3 },
        { source: 'txn2', target: 'place0', weight: 3, inhibit: true },
        { source: 'place0', target: 'txn3', inhibit: true },
        { source: 'txn3', target: 'place1' }
      ]
    });
  });

  it('should return an error for invalid URL', () => {
    const url = '/?modelType=petriNet&version=v0$';
    const result = parseUrl(url);
    expect(result).toBeInstanceOf(Error);
  });
});


describe('parseMinUrl', () => {
  it('should parse a simple min URL', () => {
    const url = '/?m=petriNet&v=v0';
    const model = parseMinUrl(url) as Model;

    expect(model).toEqual({
      modelType: 'petriNet',
      version: 'v0',
      places: {},
      transitions: {},
      arcs: []
    });
  });

  it('should parse a min URL with places and transitions', () => {
    const url = '/?m=petriNet&v=v0&p=place0&o=0&i=1&c=3&x=130&y=207&p=place1&o=1&x=395&y=299&t=txn0&x=46&y=116&t=txn1&x=227&y=112&t=txn2&x=43&y=307&t=txn3&x=235&y=306&s=txn0&e=place0&s=place0&e=txn1&w=3&s=txn2&e=place0&w=3&n=1&s=place0&e=txn3&n=1&s=txn3&e=place1'
    const model = parseMinUrl(url) as Model;

    expect(model).toEqual({
      modelType: 'petriNet',
      version: 'v0',
      places: {
        place0: { offset: 0, initial: 1, capacity: 3, x: 130, y: 207 },
        place1: { offset: 1, x: 395, y: 299 }
      },
      transitions: {
        txn0: { x: 46, y: 116 },
        txn1: { x: 227, y: 112 },
        txn2: { x: 43, y: 307 },
        txn3: { x: 235, y: 306 }
      },
      arcs: [
      {
        source: "txn0",
        target: "place0"
      },
      {
        source: "place0",
        target: "txn1",
        weight: 3
      },
      {
        inhibit: true,
        source: "txn2",
        target: "place0",
        weight: 3
      },
      {
        inhibit: true,
        source: "place0",
        target: "txn3"
      },
      {
        source: "txn3",
        target: "place1"
      }
    ]
    });
  });

  it('should parse a min URL with arcs', () => {
    const url = '/?m=petriNet&v=v0&s=txn0&e=place0&s=place0&e=txn1&w=3&s=txn2&e=place0&w=3&n=1&s=place0&e=txn3&n=1&s=txn3&e=place1';
    const model = parseMinUrl(url) as Model;

    expect(model).toEqual({
      modelType: 'petriNet',
      version: 'v0',
      places: {},
      transitions: {},
      arcs: [
        { source: 'txn0', target: 'place0' },
        { source: 'place0', target: 'txn1', weight: 3 },
        { source: 'txn2', target: 'place0', weight: 3, inhibit: true },
        { source: 'place0', target: 'txn3', inhibit: true },
        { source: 'txn3', target: 'place1' }
      ]
    });
  });

  it('should return an error for invalid min URL', () => {
    const url = '/?m=petriNet&v=v0$';
    const result = parseMinUrl(url);
    expect(result).toBeInstanceOf(Error);
  });
});