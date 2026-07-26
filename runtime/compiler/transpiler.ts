/**
 * RahulChaube Runtime — Compiler & Transpiler Pipeline.
 */

export interface TranspileOptions {
  fileName: string;
  sourceText: string;
  minify?: boolean;
  jsx?: boolean;
}

export interface TranspileResult {
  code: string;
  sourceMap?: string;
}

export function transpileSource(opts: TranspileOptions): TranspileResult {
  let code = opts.sourceText;

  // 1. Strip type annotations and interfaces using fast regex pass
  code = code.replace(/:\s*(?:string|number|boolean|any|void|unknown|never|object|Record<[^>]+>|Array<[^>]+>|\w+)(?=\s*[=,;\)\n\r])/g, "");
  code = code.replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "");
  code = code.replace(/type\s+\w+\s*=[\s\S]*?;/g, "");

  if (opts.minify) {
    code = code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*/g, "$1"); // Strip comments
    code = code.replace(/\s+/g, " ").trim();
  }

  return { code };
}
