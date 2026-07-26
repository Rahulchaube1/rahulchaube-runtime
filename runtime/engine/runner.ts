/**
 * RahulChaube Runtime — Execution Engine & Pipeline Coordinator.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { ModuleLoader } from "../module-loader/loader.ts";
import { resolveModule } from "../module-loader/resolver.ts";
import { transpileSource } from "../compiler/transpiler.ts";
import { formatCodeFrame } from "../diagnostics/errors.ts";

export interface ExecutionResult {
  success: boolean;
  exitCode: number;
  error?: Error;
}

const moduleCache = new Map<string, any>();

export async function runScript(entryPath: string): Promise<ExecutionResult> {
  const loader = new ModuleLoader();

  function customRequire(specifier: string, parentFile: string): any {
    // 1. Built-in Node module check
    const builtinModules = ["fs", "path", "os", "crypto", "events", "stream", "buffer", "util", "url", "timers", "http", "https", "child_process"];
    if (builtinModules.includes(specifier) || specifier.startsWith("node:")) {
      return require(specifier);
    }

    // 2. Resolve relative or package module path
    try {
      const resolved = resolveModule(specifier, parentFile);

      if (moduleCache.has(resolved.resolvedPath)) {
        return moduleCache.get(resolved.resolvedPath);
      }

      // Handle JSON imports directly
      if (resolved.extension === ".json") {
        const jsonContent = JSON.parse(readFileSync(resolved.resolvedPath, "utf-8"));
        moduleCache.set(resolved.resolvedPath, jsonContent);
        return jsonContent;
      }

      const loadedMod = loader.load(resolved.resolvedPath);
      const compiled = transpileSource({
        fileName: resolved.resolvedPath,
        sourceText: loadedMod.sourceText,
      });

      const modObj = { exports: {} as any };
      const req = (childSpec: string) => customRequire(childSpec, resolved.resolvedPath);

      const fn = new Function("exports", "require", "module", "__filename", "__dirname", compiled.code);
      fn(modObj.exports, req, modObj, resolved.resolvedPath, dirname(resolved.resolvedPath));

      moduleCache.set(resolved.resolvedPath, modObj.exports);
      return modObj.exports;
    } catch {
      return require(specifier);
    }
  }

  try {
    const loaded = loader.load(entryPath);
    const compiled = transpileSource({
      fileName: entryPath,
      sourceText: loaded.sourceText,
    });

    const moduleObj = { exports: {} as any };
    const req = (spec: string) => customRequire(spec, entryPath);

    const scriptFunc = new Function("exports", "require", "module", "__filename", "__dirname", compiled.code);
    scriptFunc(moduleObj.exports, req, moduleObj, entryPath, dirname(entryPath));

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
