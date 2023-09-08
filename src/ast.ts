import { Token } from "./token";

interface Node {
  tokenLiteral(): string;
}

interface Statement extends Node {
  node: Node;
  statementNode(): void;
}

interface Expression extends Node {
  node: Node;
  expressionNode(): void;
}

export interface AST {
  statements: Statement[];
  tokenLiteral(): string;
}

export class Identifier {
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  expressionNode(): void {
    throw new Error("Method not implemented.");
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  constructor(token: Token) {
    this.token = token;
  }
  node: Node;

  statementNode(): void {
    throw new Error("Method not implemented.");
  }

  tokenLiteral(): string {
    throw new Error("Method not implemented.");
  }
}

export class Program implements AST {
  statements: Statement[];

  constructor() {
    this.statements = [];
  }

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].node.tokenLiteral();
    } else {
      return "";
    }
  }
}
