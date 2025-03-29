import { lexer, TokenType } from './lexer';

interface Place {
  offset?: number;
  initial?: number;
  capacity?: number;
  x?: number;
  y?: number;
}

interface Transition {
  x?: number;
  y?: number;
}

interface Arc {
  source: string;
  target: string;
  weight?: number;
  inhibit?: boolean;
}

interface Model {
  modelType: string;
  version: string;
  places: { [key: string]: Place };
  transitions: { [key: string]: Transition };
  arcs: Arc[];
}

function parseUrl(url: string): Model | Error {
  const tokens = lexer(url);
  if (tokens instanceof Error) {
    return tokens;
  }

  const model: Model = {
    modelType: '',
    version: '',
    places: {},
    transitions: {},
    arcs: []
  };

  let currentPlace: string | null = null;
  let currentTransition: string | null = null;
  let currentArc: Arc | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case TokenType.Identifier:
        if (token.value === 'modelType' && tokens[i + 1]?.value === '=') {
          model.modelType = tokens[i + 2]?.value || '';
          i += 2;
        } else if (token.value === 'version' && tokens[i + 1]?.value === '=') {
          model.version = tokens[i + 2]?.value || '';
          i += 2;
        } else if (token.value === 'place') {
          currentPlace = tokens[i+2].value;
          i += 2;
          model.places[currentPlace] = {};
        } else if (token.value === 'transition') {
          currentTransition = tokens[i+2].value;
          i += 2;
          model.transitions[currentTransition] = {};
        } else if (token.value === 'source') {
          currentArc = { source: tokens[i+2].value, target: '' };
          i += 2;
          model.arcs.push(currentArc);
        } else if (token.value === 'target') {
          if (currentArc) {
            currentArc.target = tokens[i+2].value;
            i += 2;
          }
        } else if (token.value === 'weight') {
          if (currentArc) {
            currentArc.weight = parseInt(tokens[i+2].value, 10);
            i += 2;
          }
        } else if (token.value === 'inhibit') {
          if (currentArc) {
            currentArc.inhibit = tokens[i+2].value === 'true';
            i += 2;
          }
        } else if (currentTransition) {
          model.transitions[currentTransition][token.value as keyof Transition] = parseInt(tokens[i+2].value, 10);
          i += 2;
        } else if (currentPlace) {
          model.places[currentPlace][token.value as keyof Place] = parseInt(tokens[i+2].value, 10);
          i += 2;
        }
        break;
      default:
        break;
    }
  }

  return model;
}

function parseMinUrl(url: string): Model | Error {
  const tokens = lexer(url);
  if (tokens instanceof Error) {
    return tokens;
  }

  const model: Model = {
    modelType: '',
    version: '',
    places: {},
    transitions: {},
    arcs: []
  };

  let currentPlace: string | null = null;
  let currentTransition: string | null = null;
  let currentArc: Arc | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case TokenType.Identifier:
        if (token.value === 'm' && tokens[i + 1]?.value === '=') {
          model.modelType = tokens[i + 2]?.value || '';
          i += 2;
        } else if (token.value === 'v' && tokens[i + 1]?.value === '=') {
          model.version = tokens[i + 2]?.value || '';
          i += 2;
        } else if (token.value === 'p') {
          currentPlace = tokens[i + 2].value;
          i += 2;
          model.places[currentPlace] = {};
        } else if (token.value === 't') {
          currentTransition = tokens[i + 2].value;
          i += 2;
          model.transitions[currentTransition] = {};
        } else if (token.value === 's') {
          currentArc = { source: tokens[i + 2].value, target: '' };
          i += 2;
          model.arcs.push(currentArc);
        } else if (token.value === 'e') {
          if (currentArc) {
            currentArc.target = tokens[i + 2].value;
            i += 2;
          }
        } else if (token.value === 'w') {
          if (currentArc) {
            currentArc.weight = parseInt(tokens[i + 2].value, 10);
            i += 2;
          }
        } else if (token.value === 'n') {
          if (currentArc) {
            currentArc.inhibit = tokens[i + 2].value === '1';
            i += 2;
          }
        } else if (currentTransition) {
          const key = token.value === 'x' || token.value === 'y' ? token.value : '';
          if (key) {
            model.transitions[currentTransition][key as keyof Transition] = parseInt(tokens[i + 2].value, 10);
            i += 2;
          }
        } else if (currentPlace) {
          const key = token.value === 'o' ? 'offset' :
                      token.value === 'i' ? 'initial' :
                      token.value === 'c' ? 'capacity' :
                      token.value === 'x' || token.value === 'y' ? token.value : '';
          if (key) {
            model.places[currentPlace][key as keyof Place] = parseInt(tokens[i + 2].value, 10);
            i += 2;
          }
        }
        break;
      default:
        break;
    }
  }

  return model;
}

export { parseUrl, parseMinUrl };
export type { Model };