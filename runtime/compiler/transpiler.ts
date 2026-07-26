/**
 * RahulChaube Runtime — AST Compiler & Transpiler Pipeline.
 */
import { ASTParser, Lexer, TokenType } from "../parser/ast-parser.ts";

export interface TranspileOptions {
  fileName: string;
  sourceText: string;
  minify?: boolean;
}

export interface TranspileResult {
  code: string;
  ast?: object;
}

export function transpileSource(opts: TranspileOptions): TranspileResult {
  const parser = new ASTParser();
  const ast = parser.parse(opts.sourceText);
  const lexer = new Lexer(opts.sourceText);
  const tokens = lexer.tokenize();

  const outTokens: string[] = [];
  let i = 0;

  while (i < tokens.length) {
    const tok = tokens[i];

    if (tok.type === TokenType.EOF) break;

    // Skip TypeScript 'type' and 'interface' declarations
    if (tok.type === TokenType.Keyword && (tok.value === "type" || tok.value === "interface")) {
      while (i < tokens.length && tokens[i].value !== ";" && tokens[i].value !== "}" && tokens[i].type !== TokenType.EOF) {
        i++;
      }
      if (tokens[i]?.value === ";" || tokens[i]?.value === "}") i++;
      continue;
    }

    // Skip TypeScript explicit type annotations (e.g. `: string`, `: number`)
    if (tok.type === TokenType.Punctuation && tok.value === ":") {
      const prevTok = tokens[i - 1];
      const nextTok = tokens[i + 1];
      if (prevTok && (prevTok.type === TokenType.Identifier || prevTok.type === TokenType.Punctuation)) {
        if (nextTok && (nextTok.type === TokenType.Identifier || nextTok.value === "Record" || nextTok.value === "Array")) {
          i += 2; // Skip colon and type identifier
          if (tokens[i]?.value === "<") {
            while (i < tokens.length && tokens[i].value !== ">" && tokens[i].type !== TokenType.EOF) {
              i++;
            }
            if (tokens[i]?.value === ">") i++;
          }
          continue;
        }
      }
    }

    if (tok.type === TokenType.Comment) {
      if (!opts.minify) {
        outTokens.push(tok.value);
      }
      i++;
      continue;
    }

    outTokens.push(tok.value);
    i++;
  }

  let code = outTokens.join(" ");

  // Cleanup spaces around punctuation for valid JS syntax
  code = code.replace(/\s*([;=,\(\)\{\}:])\s*/g, "$1");
  code = code.replace(/\b(const|let|var|function|return|import|export|from|if|else)\b/g, "$1 ");
  code = code.replace(/\s+/g, " ").trim();
  code = code.replace(/\)\s*\{/g, ") {");

  if (opts.minify) {
    code = code.replace(/\s+/g, " ").trim();
  }

  return { code, ast };
}
