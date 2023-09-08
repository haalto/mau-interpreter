import { LetStatement } from "../src/ast";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";

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

    console.log(program.statements);

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
    const program = parser.parseProgram();
    const errors = parser.getErrors();

    console.log(program.statements);
    console.log(errors);

    expect(program.statements.length).toBe(0);
    expect(errors.length).toBe(3);

    expect(errors[0]).toBe("expected next token to be =, got INT instead");
    expect(errors[1]).toBe("expected next token to be IDENT, got = instead");
    expect(errors[2]).toBe("expected next token to be IDENT, got INT instead");
  });
});
