import { createInterface } from "node:readline";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const prompt = (query: string) =>
  new Promise<string>((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });

async function repl() {
  let input = "";
  input = await prompt(">> ");

  while (input !== "exit") {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    if (parser.getErrors().length > 0) {
      console.log(parser.getErrors());
    }

    console.log(program.statements);

    input = await prompt(">> ");
  }

  rl.close();
}

repl();
