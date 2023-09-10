import {
  AST,
  Expression,
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  LetStatement,
  Program,
  ReturnStatement,
} from "./ast";
import { Lexer } from "./lexer";
import { Token, TokenType } from "./token";

type PrefixParseFn = () => Expression | undefined;
type InfixParseFn = (expression: Expression) => Expression | undefined;

enum Precedence {
  LOWEST,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // myFunction(X)
}

export class Parser {
  private lexer: Lexer;
  private curToken: Token;
  private peekToken: Token;
  private errors: string[];

  private prefixParseFns: { [key: string]: PrefixParseFn };
  private infixParseFns: { [key: string]: InfixParseFn };

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.curToken = lexer.nextToken();
    this.peekToken = lexer.nextToken();
    this.errors = [];

    this.prefixParseFns = {};
    this.registerPrefix(TokenType.IDENT, this.parseIdentifier);
    this.registerPrefix(TokenType.INT, this.parseIntegerLiteral);
  }

  private parseIdentifier = (): Expression => {
    return new Identifier(this.curToken, this.curToken.literal);
  };

  private parseIntegerLiteral = (): Expression | undefined => {
    const value = parseInt(this.curToken.literal);
    if (isNaN(value)) {
      const msg = `could not parse ${this.curToken.literal} as integer`;
      this.errors.push(msg);
      return undefined;
    }

    return new IntegerLiteral(this.curToken);
  };

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

  private peekError(tokenType: TokenType) {
    const msg = `expected next token to be ${tokenType}, got ${this.peekToken.type} instead`;
    this.errors.push(msg);
  }

  getErrors(): string[] {
    return this.errors;
  }

  // Statements
  private parseStatement() {
    switch (this.curToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
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

  private parseReturnStatement() {
    const statement = new ReturnStatement(this.curToken);

    this.nextToken();

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  // Expressions
  private registerPrefix(tokenType: TokenType, fn: PrefixParseFn) {
    this.prefixParseFns[tokenType] = fn;
  }

  private registerInfix(tokenType: TokenType, fn: InfixParseFn) {
    this.infixParseFns[tokenType] = fn;
  }

  private parseExpression(precedence: Precedence): Expression | undefined {
    const prefix = this.prefixParseFns[this.curToken.type];
    if (!prefix) {
      return undefined;
    }
    let leftExp = prefix();

    return leftExp;
  }

  private parseExpressionStatement(): ExpressionStatement {
    const statement = new ExpressionStatement(this.curToken);

    statement.expression = this.parseExpression(Precedence.LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
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
