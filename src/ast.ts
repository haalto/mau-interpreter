import { Token } from "./token";

interface Node {
  tokenLiteral(): string;
  getStringRepresentation(): string;
}

interface Statement extends Node {
  statementNode(): void;
}

export interface Expression extends Node {
  expressionNode(): void;
}

export interface AST extends Node {
  statements: Statement[];
}

export class Identifier implements Expression {
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  getStringRepresentation(): string {
    return this.value;
  }

  expressionNode(): void {
    throw new Error("Method not implemented.");
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

export class IntegerLiteral implements Expression {
  token: Token;
  value: number;

  constructor(token: Token) {
    this.token = token;
    this.value = Number(token.literal);
  }

  getStringRepresentation(): string {
    return this.token.literal;
  }

  expressionNode(): void {
    throw new Error("Method not implemented.");
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

export class ExpressionStatement implements Statement {
  token: Token;
  expression?: Expression;

  constructor(token: Token) {
    this.token = token;
  }
  node: Node;

  getStringRepresentation(): string {
    return this.expression?.getStringRepresentation() ?? "";
  }

  statementNode(): void {
    throw new Error("Method not implemented.");
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value?: Expression;

  constructor(token: Token) {
    this.token = token;
  }
  node: Node;

  getStringRepresentation(): string {
    return `${this.tokenLiteral()} ${this.name.getStringRepresentation()} = ${
      this.value?.getStringRepresentation() ?? ""
    };`;
  }

  statementNode(): void {
    throw new Error("Method not implemented.");
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

export class ReturnStatement implements Statement {
  private token: Token;
  private returnValue?: Expression;

  constructor(token: Token) {
    this.token = token;
  }
  node: Node;

  getStringRepresentation(): string {
    return `Token: ${this.tokenLiteral()} ${
      this.returnValue?.getStringRepresentation() ?? ""
    };`;
  }

  statementNode(): void {
    throw new Error("Method not implemented.");
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

export class Program implements AST {
  statements: Statement[];

  constructor() {
    this.statements = [];
  }

  getStringRepresentation(): string {
    return this.statements
      .map((statement) => statement.getStringRepresentation())
      .join("");
  }

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].getStringRepresentation();
    } else {
      return "";
    }
  }
}
