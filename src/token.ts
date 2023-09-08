export type Token = {
  type: TokenType;
  literal: string;
};

export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",

  // Identifiers + literals
  IDENT = "IDENT", // add, foobar, x, y, ...
  INT = "INT", // 1343456

  // Operators
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",

  LT = "<",
  GT = ">",

  EQ = "==",
  NOT_EQ = "!=",

  // Delimiters
  COMMA = ",",
  SEMICOLON = ";",

  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",

  // Keywords
  FUNCTION = "FUNCTION",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
}

export const keyWords = new Map<string, TokenType>([
  ["fn", TokenType.FUNCTION],
  ["let", TokenType.LET],
  ["true", TokenType.TRUE],
  ["false", TokenType.FALSE],
  ["if", TokenType.IF],
  ["else", TokenType.ELSE],
  ["return", TokenType.RETURN],
]);

export const lookupIdent = (ident: string): TokenType => {
  const tokenType = keyWords.get(ident);
  if (tokenType) {
    return tokenType;
  }
  return TokenType.IDENT;
};
