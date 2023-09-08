import { Lexer } from "../src/lexer";
import { TokenType } from "../src/token";

describe("lexer", () => {
  it("should lex a simple input", () => {
    const input = `=+(){},;`;

    const expectedTokens = [
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.PLUS, literal: "+" },
      { type: TokenType.LPAREN, literal: "(" },
      { type: TokenType.RPAREN, literal: ")" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.COMMA, literal: "," },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.EOF, literal: "" },
    ];

    const lexer = new Lexer(input);
    for (const token of expectedTokens) {
      const nextToken = lexer.nextToken();
      expect(nextToken).toEqual(token);
    }
  });

  it("should lex a more complex input", () => {
    const input = `
      let five = 5;
      let ten = 10;
    
      let add = fn(x, y) {
        x + y;
      };
    
      let result = add(five, ten);
      `;

    const expectedTokens = [
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENT, literal: "five" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENT, literal: "ten" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENT, literal: "add" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.FUNCTION, literal: "fn" },
      { type: TokenType.LPAREN, literal: "(" },
      { type: TokenType.IDENT, literal: "x" },
      { type: TokenType.COMMA, literal: "," },
      { type: TokenType.IDENT, literal: "y" },
      { type: TokenType.RPAREN, literal: ")" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.IDENT, literal: "x" },
      { type: TokenType.PLUS, literal: "+" },
      { type: TokenType.IDENT, literal: "y" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.LET, literal: "let" },
      { type: TokenType.IDENT, literal: "result" },
      { type: TokenType.ASSIGN, literal: "=" },
      { type: TokenType.IDENT, literal: "add" },
      { type: TokenType.LPAREN, literal: "(" },
      { type: TokenType.IDENT, literal: "five" },
      { type: TokenType.COMMA, literal: "," },
      { type: TokenType.IDENT, literal: "ten" },
      { type: TokenType.RPAREN, literal: ")" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.EOF, literal: "" },
    ];

    const lexer = new Lexer(input);
    for (const token of expectedTokens) {
      const nextToken = lexer.nextToken();
      expect(nextToken).toEqual(token);
    }
  });

  it("should lex rest of the operators", () => {
    const input = `
      !-/*5;
      5 < 10 > 5;
    `;
    const expectedTokens = [
      { type: TokenType.BANG, literal: "!" },
      { type: TokenType.MINUS, literal: "-" },
      { type: TokenType.SLASH, literal: "/" },
      { type: TokenType.ASTERISK, literal: "*" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.LT, literal: "<" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.GT, literal: ">" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.EOF, literal: "" },
    ];

    const lexer = new Lexer(input);
    for (const token of expectedTokens) {
      const nextToken = lexer.nextToken();
      expect(nextToken).toEqual(token);
    }
  });

  it("should lex if else true and false", () => {
    const input = `
      if (5 < 10) {
        return true;
      } else {
        return false;
      }
    `;

    const expectedTokens = [
      { type: TokenType.IF, literal: "if" },
      { type: TokenType.LPAREN, literal: "(" },
      { type: TokenType.INT, literal: "5" },
      { type: TokenType.LT, literal: "<" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.RPAREN, literal: ")" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.RETURN, literal: "return" },
      { type: TokenType.TRUE, literal: "true" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.ELSE, literal: "else" },
      { type: TokenType.LBRACE, literal: "{" },
      { type: TokenType.RETURN, literal: "return" },
      { type: TokenType.FALSE, literal: "false" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.RBRACE, literal: "}" },
      { type: TokenType.EOF, literal: "" },
    ];

    const lexer = new Lexer(input);
    for (const token of expectedTokens) {
      const nextToken = lexer.nextToken();
      expect(nextToken).toEqual(token);
    }
  });

  it("should lex equal and not equal", () => {
    const input = `
      10 == 10;
      10 != 9;
    `;

    const expectedTokens = [
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.EQ, literal: "==" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.INT, literal: "10" },
      { type: TokenType.NOT_EQ, literal: "!=" },
      { type: TokenType.INT, literal: "9" },
      { type: TokenType.SEMICOLON, literal: ";" },
      { type: TokenType.EOF, literal: "" },
    ];

    const lexer = new Lexer(input);
    for (const token of expectedTokens) {
      const nextToken = lexer.nextToken();
      expect(nextToken).toEqual(token);
    }
  });
});
