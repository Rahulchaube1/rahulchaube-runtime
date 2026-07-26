/**
 * RahulChaube Runtime — AST Parser & Tokenizer Subsystem.
 *
 * Implements tokenization, AST node construction, and type-stripping codegen.
 */

export enum TokenType {
  Keyword,
  Identifier,
  StringLiteral,
  NumericLiteral,
  Punctuation,
  Operator,
  Comment,
  EOF,
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  kind: string;
  line: number;
  column: number;
  children?: ASTNode[];
  value?: string;
  typeAnnotation?: string;
}

export class Lexer {
  private pos = 0;
  private line = 1;
  private col = 1;

  constructor(private input: string) {}

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    const len = this.input.length;

    while (this.pos < len) {
      const ch = this.input[this.pos];

      if (ch === "\n") {
        this.line++;
        this.col = 1;
        this.pos++;
        continue;
      }

      if (/\s/.test(ch)) {
        this.col++;
        this.pos++;
        continue;
      }

      // Comments
      if (ch === "/" && this.input[this.pos + 1] === "/") {
        const startCol = this.col;
        let val = "";
        while (this.pos < len && this.input[this.pos] !== "\n") {
          val += this.input[this.pos];
          this.pos++;
        }
        tokens.push({ type: TokenType.Comment, value: val, line: this.line, column: startCol });
        continue;
      }

      // String literals
      if (ch === '"' || ch === "'" || ch === "`") {
        const quote = ch;
        const startCol = this.col;
        let val = quote;
        this.pos++;
        this.col++;
        while (this.pos < len && this.input[this.pos] !== quote) {
          val += this.input[this.pos];
          this.pos++;
          this.col++;
        }
        if (this.pos < len) {
          val += quote;
          this.pos++;
          this.col++;
        }
        tokens.push({ type: TokenType.StringLiteral, value: val, line: this.line, column: startCol });
        continue;
      }

      // Identifiers / Keywords
      if (/[a-zA-Z_$]/.test(ch)) {
        const startCol = this.col;
        let val = "";
        while (this.pos < len && /[a-zA-Z0-9_$]/.test(this.input[this.pos])) {
          val += this.input[this.pos];
          this.pos++;
          this.col++;
        }
        const isKeyword = ["const", "let", "var", "function", "import", "export", "from", "return", "if", "else", "type", "interface"].includes(val);
        tokens.push({ type: isKeyword ? TokenType.Keyword : TokenType.Identifier, value: val, line: this.line, column: startCol });
        continue;
      }

      // Numbers
      if (/[0-9]/.test(ch)) {
        const startCol = this.col;
        let val = "";
        while (this.pos < len && /[0-9.]/.test(this.input[this.pos])) {
          val += this.input[this.pos];
          this.pos++;
          this.col++;
        }
        tokens.push({ type: TokenType.NumericLiteral, value: val, line: this.line, column: startCol });
        continue;
      }

      // Punctuation / Operators
      tokens.push({ type: TokenType.Punctuation, value: ch, line: this.line, column: this.col });
      this.pos++;
      this.col++;
    }

    tokens.push({ type: TokenType.EOF, value: "", line: this.line, column: this.col });
    return tokens;
  }
}

export class ASTParser {
  public parse(sourceText: string): ASTNode {
    const lexer = new Lexer(sourceText);
    const tokens = lexer.tokenize();

    const root: ASTNode = {
      kind: "Program",
      line: 1,
      column: 1,
      children: [],
    };

    let idx = 0;
    while (idx < tokens.length && tokens[idx].type !== TokenType.EOF) {
      const tok = tokens[idx];

      if (tok.type === TokenType.Keyword && (tok.value === "interface" || tok.value === "type")) {
        // Skip interface or type declaration node in AST code output
        while (idx < tokens.length && tokens[idx].value !== ";" && tokens[idx].value !== "}" && tokens[idx].type !== TokenType.EOF) {
          idx++;
        }
        if (tokens[idx]?.value === ";" || tokens[idx]?.value === "}") idx++;
        continue;
      }

      root.children!.push({
        kind: "TokenNode",
        line: tok.line,
        column: tok.column,
        value: tok.value,
      });
      idx++;
    }

    return root;
  }
}
