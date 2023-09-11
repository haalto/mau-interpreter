import {
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
} from "../src/ast";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { TokenType } from "../src/token";

describe("parser", () => {
  it("should parse a simple let statements", () => {
    const input = `
      let x = 5;
      let y = 10;
      let foobar = 838383;
    `;

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    expect(program).not.toBeNull();

    expect(program.statements.length).toBe(3);

    const expectedIdentifiers = ["x", "y", "foobar"];

    for (let i = 0; i < expectedIdentifiers.length; i++) {
      const statement = program.statements[i];
      expect(statement).toBeInstanceOf(LetStatement);
      const letStatement = statement as LetStatement;
      expect(letStatement.name.value).toBe(expectedIdentifiers[i]);
      expect(letStatement.name.tokenLiteral()).toBe(expectedIdentifiers[i]);
    }
  });

  it("should return errors", () => {
    const input = `
      let x 5;
      let = 10;
      let 838383;
    `;

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    parser.parseProgram();
    const errors = parser.getErrors();
    expect(errors.length).toBeGreaterThan(0);

    expect(errors[0]).toBe("expected next token to be =, got INT instead");
    expect(errors[1]).toBe("expected next token to be IDENT, got = instead");
    expect(errors[2]).toBe("no prefix parse function for = found");
    expect(errors[3]).toBe("expected next token to be IDENT, got INT instead");
  });

  it("should parse a simple return statement", () => {
    const input = `
      return 5;
      return 10;
      return 993322;
    `;

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    expect(program.statements.length).toBe(3);

    for (const statement of program.statements) {
      expect(statement.tokenLiteral()).toBe("return");
    }
  });

  it("should match the string representation", () => {
    const lexer = new Lexer("");
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const letStatement1 = new LetStatement({
      type: TokenType.LET,
      literal: "let",
    });
    letStatement1.name = new Identifier(
      { type: TokenType.IDENT, literal: "x" },
      "x"
    );
    letStatement1.value = new Identifier(
      { type: TokenType.IDENT, literal: "y" },
      "y"
    );
    program.statements.push(letStatement1);

    expect(program.getStringRepresentation()).toBe("let x = y;");
  });

  it("should parse a simple identifier expression statement", () => {
    const input = `foobar;`;

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const statements = program.statements;
    const errors = parser.getErrors();

    expect(errors.length).toBe(0);

    const expressionStatement = statements[0];

    if (
      !(expressionStatement instanceof ExpressionStatement) ||
      !(expressionStatement.expression instanceof Identifier)
    ) {
      throw new Error("Expected expression statement");
    }

    expect(expressionStatement.tokenLiteral()).toBe("foobar");
    expect(expressionStatement.expression.value).toBe("foobar");
  });

  it("should parse a simple integer literal expression statement", () => {
    const input = `5;`;

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const statements = program.statements;
    const expressionStatement = statements[0];

    if (
      !(expressionStatement instanceof ExpressionStatement) ||
      !(expressionStatement.expression instanceof IntegerLiteral)
    ) {
      throw new Error("Expected expression statement");
    }

    const integerLiteral = expressionStatement.expression;

    expect(integerLiteral.tokenLiteral()).toBe("5");
    expect(integerLiteral.value).toBe(5);
  });

  it("should parse a simple prefix expression statement", () => {
    const input = `
      !5;
      -15;
    `;

    const expectedOperators = ["!", "-"];
    const expectedValues = [5, 15];

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();
    const statements = program.statements;

    expect(statements.length).toBe(2);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (
        !(statement instanceof ExpressionStatement) ||
        !(statement.expression instanceof PrefixExpression)
      ) {
        throw new Error("Expected expression statement");
      }

      const prefixExpression = statement.expression;
      const integerLiteral = prefixExpression.right;

      if (!(integerLiteral instanceof IntegerLiteral)) {
        throw new Error("Expected integer literal");
      }

      expect(prefixExpression.operator).toBe(expectedOperators[i]);
      expect(integerLiteral.value).toBe(expectedValues[i]);
    }
  });

  it("should parse a simple infix expression statement", () => {
    const input = `
      5 + 5;
      5 - 5;
      5 * 5;
      5 / 5;
      5 > 5;
      5 < 5;
      5 == 5;
      5 != 5;
    `;

    const expectedOperators = ["+", "-", "*", "/", ">", "<", "==", "!="];

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    const program = parser.parseProgram();
    const statements = program.statements;
    console.log(statements);
    expect(statements.length).toBe(8);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (
        !(statement instanceof ExpressionStatement) ||
        !(statement.expression instanceof InfixExpression)
      ) {
        throw new Error("Expected expression statement");
      }

      const infixExpression = statement.expression;
      const left = infixExpression.left;
      const right = infixExpression.right;

      if (!(left instanceof IntegerLiteral)) {
        throw new Error("Expected integer literal");
      }

      if (!(right instanceof IntegerLiteral)) {
        throw new Error("Expected integer literal");
      }

      expect(left.value).toBe(5);
      expect(right.value).toBe(5);
      expect(infixExpression.operator).toBe(expectedOperators[i]);
    }
  });
});
