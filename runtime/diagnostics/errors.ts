/**
 * RahulChaube Runtime — Code Diagnostics & Stack Trace Engine.
 */

export interface CodeFrameOptions {
  filePath: string;
  line: number;
  column: number;
  sourceText: string;
  message: string;
}

export function formatCodeFrame(opts: CodeFrameOptions): string {
  const lines = opts.sourceText.split(/\r?\n/);
  const targetLineIdx = opts.line - 1;
  if (targetLineIdx < 0 || targetLineIdx >= lines.length) {
    return `[ERR] ${opts.message} at ${opts.filePath}:${opts.line}:${opts.column}`;
  }

  const startIdx = Math.max(0, targetLineIdx - 2);
  const endIdx = Math.min(lines.length - 1, targetLineIdx + 2);
  const padLen = String(endIdx + 1).length;

  const output: string[] = [];
  output.push(`\x1b[31m\x1b[1m[FAIL]\x1b[0m \x1b[1m${opts.message}\x1b[0m`);
  output.push(`  \x1b[36m-->\x1b[0m ${opts.filePath}:${opts.line}:${opts.column}`);
  output.push(`  \x1b[36m${" ".repeat(padLen)} |\x1b[0m`);

  for (let i = startIdx; i <= endIdx; i++) {
    const lineNum = String(i + 1).padStart(padLen, " ");
    const lineContent = lines[i];
    if (i === targetLineIdx) {
      output.push(`  \x1b[36m${lineNum} |\x1b[0m ${lineContent}`);
      const indent = " ".repeat(Math.max(0, opts.column - 1));
      output.push(`  \x1b[36m${" ".repeat(padLen)} |\x1b[0m \x1b[31m${indent}^\x1b[0m \x1b[31m${opts.message}\x1b[0m`);
    } else {
      output.push(`  \x1b[36m${lineNum} |\x1b[0m \x1b[90m${lineContent}\x1b[0m`);
    }
  }

  output.push(`  \x1b[36m${" ".repeat(padLen)} |\x1b[0m`);
  return output.join("\n");
}
