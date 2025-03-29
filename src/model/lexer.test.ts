import { lexer, TokenType } from './lexer';

describe('lexer', () => {
  it('should tokenize a simple input string', () => {
    const input = '/?modelType=petriNet&version=v0';
    const tokens = lexer(input);

    expect(tokens).toEqual([
      { type: TokenType.Slash, value: '/' },
      { type: TokenType.QuestionMark, value: '?' },
      { type: TokenType.Identifier, value: 'modelType' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'petriNet' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'version' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'v0' },
      { type: TokenType.EOF, value: '' }
    ]);
  });

  it('should return an error for unexpected characters', () => {
    const input = '/?modelType=petriNet&version=v0$';
    const tokens = lexer(input);
    expect(tokens).toBeInstanceOf(Error);
  });

  it('should tokenize a complex input string', () => {
    const input = '/?modelType=petriNet&version=v0&place=place_name&offset=offset&initial=initial&capacity=capacity&x=x_coord&y=y_coord&transition=transition_name&x=x_coord&y=y_coord&source=source_name&target=target_name&weight=weight&inhibit=true';
    const tokens = lexer(input);

    expect(tokens).toEqual([
      { type: TokenType.Slash, value: '/' },
      { type: TokenType.QuestionMark, value: '?' },
      { type: TokenType.Identifier, value: 'modelType' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'petriNet' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'version' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'v0' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'place' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'place_name' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'offset' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'offset' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'initial' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'initial' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'capacity' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'capacity' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'x' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'x_coord' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'y' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'y_coord' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'transition' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'transition_name' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'x' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'x_coord' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'y' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'y_coord' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'source' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'source_name' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'target' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'target_name' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'weight' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'weight' },
      { type: TokenType.Ampersand, value: '&' },
      { type: TokenType.Identifier, value: 'inhibit' },
      { type: TokenType.Equals, value: '=' },
      { type: TokenType.Identifier, value: 'true' },
      { type: TokenType.EOF, value: '' }
    ]);
  });
});