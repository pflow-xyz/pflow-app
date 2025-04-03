enum TokenType {
    Ampersand,
    Equals,
    Slash,
    QuestionMark,
    Identifier,
    Number,
    EOF
  }

  interface Token {
    type: TokenType;
    value: string;
  }

  function lexer(input: string): Token[] | Error {
    const tokens: Token[] = [];
    let i = 0;

    while (i < input.length) {
      const char = input[i];

      switch (char) {
        case '/':
          tokens.push({ type: TokenType.Slash, value: char });
          i++;
          break;
        case '?':
          tokens.push({ type: TokenType.QuestionMark, value: char });
          i++;
          break;
        case '=':
          tokens.push({ type: TokenType.Equals, value: char });
          i++;
          break;
        case '&':
          tokens.push({ type: TokenType.Ampersand, value: char });
          i++;
          break;
        case ' ':
          i++;
          break;
        default:
          if (/[a-zA-Z_]/.test(char)) {
            let value = '';
            while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
              value += input[i];
              i++;
            }
            tokens.push({ type: TokenType.Identifier, value });
          } else if (/[0-9]/.test(char)) {
            let value = '';
            while (i < input.length && /[0-9]/.test(input[i])) {
              value += input[i];
              i++;
            }
            tokens.push({ type: TokenType.Number, value });
          } else {
            return new Error(`Unexpected character: ${char}`);
          }
      }
    }

    tokens.push({ type: TokenType.EOF, value: '' });
    return tokens;
  }


export { lexer, TokenType };