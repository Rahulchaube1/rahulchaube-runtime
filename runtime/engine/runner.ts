/**
 * RahulChaube Runtime — Execution Engine & Pipeline Coordinator.
 */
import { ModuleLoader } from "../module-loader/loader.ts";
import { transpileSource } from "../compiler/transpiler.ts";
import { formatCodeFrame } from "../diagnostics/errors.ts";

export interface ExecutionResult {
  success: boolean;
  exitCode: number;
  error?: Error;
}

export async function runScript(entryPath: string): Promise<ExecutionResult> {
  const loader = new ModuleLoader();
  try {
    const loaded = loader.load(entryPath);
    const compiled = transpileSource({
      fileName: entryPath,
      sourceText: loaded.sourceText,
    });

    // Execute within VM context or engine scope
    const scriptFunc = new Function("exports", "require", "module", "__filename", "__dirname", compiled.code);
    const moduleObj = { exports: {} };
    scriptFunc(moduleObj.exports, (spec: string) => require(spec), moduleObj, entryPath, process.cwd());

    return { success: true, exitCode: 0 };
  } catch (err) {
    const formatted = formatCodeFrame({
      filePath: entryPath,
      line: 1,
      column: 1,
      sourceText: "// Execution error occurred",
      message: (err as Error).message,
    });
    console.error(formatted);
    return { success: false, exitCode: 1, error: err as Error };
  }
}
