import { Token, TokenType, lookupIdent } from "./token";

interface BasicLexer {
  input: string;
  position: number;
  readPosition: number;
  ch: string;
  nextToken(): Token;
}

export class Lexer implements BasicLexer {
  input: string;
  position: number;
  readPosition: number;
  ch: string;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch;
    this.readChar();
  }

  private isLetter(ch: string) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
  }

  private isDigit(ch: string) {
    return ch >= "0" && ch <= "9";
  }

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = "";
    } else {
      this.ch = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition++;
  }

  private readNumber() {
    const position = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private newToken(tokenType: TokenType, ch: string): Token {
    return { type: tokenType, literal: ch };
  }

  private readIdentifier(): string {
    const position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private skipWhitespace() {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return "";
    } else {
      return this.input[this.readPosition];
    }
  }

  nextToken(): Token {
    let token: Token;
    this.skipWhitespace();

    switch (this.ch) {
      case "=":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = this.newToken(TokenType.EQ, literal);
        } else {
          token = this.newToken(TokenType.ASSIGN, this.ch);
        }
        break;
      case "+":
        token = this.newToken(TokenType.PLUS, this.ch);
        break;
      case "(":
        token = this.newToken(TokenType.LPAREN, this.ch);
        break;
      case ")":
        token = this.newToken(TokenType.RPAREN, this.ch);
        break;
      case "{":
        token = this.newToken(TokenType.LBRACE, this.ch);
        break;
      case "}":
        token = this.newToken(TokenType.RBRACE, this.ch);
        break;
      case ",":
        token = this.newToken(TokenType.COMMA, this.ch);
        break;
      case ";":
        token = this.newToken(TokenType.SEMICOLON, this.ch);
        break;
      case "!":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = this.newToken(TokenType.NOT_EQ, literal);
        } else {
          token = this.newToken(TokenType.BANG, this.ch);
        }
        break;
      case "-":
        token = this.newToken(TokenType.MINUS, this.ch);
        break;
      case "/":
        token = this.newToken(TokenType.SLASH, this.ch);
        break;
      case "*":
        token = this.newToken(TokenType.ASTERISK, this.ch);
        break;
      case "<":
        token = this.newToken(TokenType.LT, this.ch);
        break;
      case ">":
        token = this.newToken(TokenType.GT, this.ch);
        break;
      case "":
        return this.newToken(TokenType.EOF, "");
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const type = lookupIdent(literal);
          return this.newToken(type, literal);
        } else if (this.isDigit(this.ch)) {
          const literal = this.readNumber();
          return this.newToken(TokenType.INT, literal);
        } else {
          token = this.newToken(TokenType.ILLEGAL, this.ch);
        }
        break;
    }
    this.readChar();
    return token;
  }
}
