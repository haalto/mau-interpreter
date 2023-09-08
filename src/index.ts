import { createInterface } from "node:readline";
import { Lexer } from "./lexer";

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

    while (lexer.ch !== "") {
      console.log(lexer.nextToken());
    }
    input = await prompt(">> ");
  }

  rl.close();
}

repl();
