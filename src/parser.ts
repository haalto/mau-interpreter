import { AST, Identifier, LetStatement, Program } from "./ast";
import { Lexer } from "./lexer";
import { Token, TokenType } from "./token";

export class Parser {
  private lexer: Lexer;
  private curToken: Token;
  private peekToken: Token;
  private errors: string[];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.curToken = lexer.nextToken();
    this.peekToken = lexer.nextToken();
    this.errors = [];
  }

  private nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private expectPeek(tokenType: TokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(tokenType);
      return false;
    }
  }

  private peekTokenIs(tokenType: TokenType) {
    return this.peekToken.type === tokenType;
  }

  private curTokenIs(tokenType: TokenType) {
    return this.curToken.type === tokenType;
  }

  private parseLetStatement() {
    const statement = new LetStatement(this.curToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    statement.name = new Identifier(this.curToken, this.curToken.literal);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private parseStatement() {
    switch (this.curToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  private peekError(tokenType: TokenType) {
    const msg = `expected next token to be ${tokenType}, got ${this.peekToken.type} instead`;
    this.errors.push(msg);
  }

  getErrors(): string[] {
    return this.errors;
  }

  parseProgram(): AST {
    const program = new Program();
    while (this.curToken.type !== TokenType.EOF) {
      const statement = this.parseStatement();
      if (statement) {
        program.statements.push(statement);
      }
      this.nextToken();
    }
    return program;
  }
}
