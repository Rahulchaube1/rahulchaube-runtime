/**
 * RahulChaube Runtime — Script Execution Engine.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * This engine executes transpiled CommonJS-compatible JavaScript
 * using the host JavaScript engine's `new Function()` API in a
 * sandboxed module scope with a custom require() implementation.
 *
 * WHAT IS IMPLEMENTED:
 *   - CJS module wrapper (exports, require, module, __filename, __dirname)
 *   - Recursive local module require() with the runtime module resolver
 *   - JSON file require()
 *   - Node built-in module passthrough (fs, path, os, crypto, events,
 *     stream, buffer, util, url, timers, http, https, child_process,
 *     net, tls, assert, worker_threads, readline, zlib)
 *   - node: prefix stripped for built-ins (node:fs → fs)
 *   - Module cache (per-runScript call)
 *   - TypeScript source transpilation before execution
 *   - Accurate source paths in __filename / __dirname
 *   - process, console, setTimeout/setInterval access via global scope
 *
 * WHAT IS NOT IMPLEMENTED / DELEGATED:
 *   - ESM native execution (import() in the output is not supported;
 *     all ESM is transformed to CJS by the transpiler)
 *   - Dynamic import() calls in transpiled output will fail
 *   - Top-level await (only works if wrapped in async IIFE by user)
 *   - Worker threads (the built-in is passed through but not sandboxed)
 *   - V8 Inspector / debugger protocol
 *   - Source maps (error line numbers reflect transpiled output, not source)
 *
 * HOST ENGINE DEPENDENCY:
 *   The `new Function()` call and all JS evaluation is performed by the
 *   host engine (currently Bun's JavaScriptCore). RahulChaube Runtime does
 *   not yet implement its own bytecode compiler or JIT.
 * ─────────────────────────────────────────────────────────────────
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { resolveModule } from "../module-loader/resolver.ts";
import { transpileSource } from "../compiler/transpiler.ts";
import { formatCodeFrame } from "../diagnostics/errors.ts";
import { globalModuleCache } from "../module-loader/cache.ts";

export interface ExecutionResult {
  success: boolean;
  exitCode: number;
  error?: Error;
  warnings?: string[];
}

// Node built-in modules that we pass through to the host require()
const NODE_BUILTINS = new Set([
  "fs", "path", "os", "crypto", "events", "stream", "buffer", "util",
  "url", "timers", "http", "https", "child_process", "net", "tls",
  "assert", "worker_threads", "readline", "zlib", "string_decoder",
  "querystring", "dns", "dgram", "cluster", "v8", "vm", "perf_hooks",
  "async_hooks", "trace_events", "constants", "module", "process",
]);

export async function runScript(
  entryPath: string,
  options: { debug?: boolean } = {}
): Promise<ExecutionResult> {
  // Per-execution module cache (isolated from other runScript calls)
  const moduleCache = new Map<string, Record<string, unknown>>();
  const allWarnings: string[] = [];

  function makeRequire(callerFile: string) {
    return function customRequire(specifier: string): unknown {
      // Strip node: prefix
      const spec = specifier.startsWith("node:") ? specifier.slice(5) : specifier;

      // Pass through Node built-ins
      if (NODE_BUILTINS.has(spec)) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(spec);
      }

      // Resolve the module
      let resolved: ReturnType<typeof resolveModule>;
      try {
        resolved = resolveModule(spec, callerFile);
      } catch (err) {
        // Last-ditch: try native require (for installed npm packages)
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          return require(spec);
        } catch {
          throw err;
        }
      }

      const { resolvedPath, extension } = resolved;

      // Return from cache
      if (moduleCache.has(resolvedPath)) {
        return moduleCache.get(resolvedPath);
      }

      // JSON files
      if (extension === ".json") {
        const content = JSON.parse(readFileSync(resolvedPath, "utf-8"));
        moduleCache.set(resolvedPath, content);
        return content;
      }

      // TypeScript / JavaScript source files
      // Check compiled code cache first (avoids re-transpilation on repeated require)
      let compiledCode: string;
      const cached = globalModuleCache.get(resolvedPath);
      if (cached) {
        compiledCode = cached.compiledCode;
      } else {
        const sourceText = readFileSync(resolvedPath, "utf-8");
        const result = transpileSource({
          fileName: resolvedPath,
          sourceText,
          debug: options.debug,
        });
        allWarnings.push(...result.warnings);
        globalModuleCache.set(resolvedPath, sourceText, result.code);
        compiledCode = result.code;
      }

      const modExports: Record<string, unknown> = {};
      const modObj = { exports: modExports };
      moduleCache.set(resolvedPath, modExports); // prevent circular loops

      try {
        const fn = new Function(
          "exports", "require", "module", "__filename", "__dirname",
          compiledCode
        );
        fn(
          modObj.exports,
          makeRequire(resolvedPath),
          modObj,
          resolvedPath,
          dirname(resolvedPath)
        );
        // The module may have replaced exports entirely (module.exports = …)
        moduleCache.set(resolvedPath, modObj.exports);
      } catch (err) {
        moduleCache.delete(resolvedPath);
        throw err;
      }

      return modObj.exports;
    };
  }

  try {
    if (!existsSync(entryPath)) {
      throw new Error(`Entry file not found: ${entryPath}`);
    }
    if (!statSync(entryPath).isFile()) {
      throw new Error(`Entry path is not a file: ${entryPath}`);
    }

    // Check compiled code cache before transpiling entry file
    let entryCompiledCode: string;
    const entryCached = globalModuleCache.get(entryPath);
    if (entryCached) {
      entryCompiledCode = entryCached.compiledCode;
    } else {
      const sourceText = readFileSync(entryPath, "utf-8");
      const result = transpileSource({
        fileName: entryPath,
        sourceText,
        debug: options.debug,
      });
      allWarnings.push(...result.warnings);
      globalModuleCache.set(entryPath, sourceText, result.code);
      entryCompiledCode = result.code;
    }

    const entryExports: Record<string, unknown> = {};
    const entryMod = { exports: entryExports };
    moduleCache.set(entryPath, entryExports);

    const fn = new Function(
      "exports", "require", "module", "__filename", "__dirname",
      entryCompiledCode
    );
    fn(
      entryMod.exports,
      makeRequire(entryPath),
      entryMod,
      entryPath,
      dirname(entryPath)
    );

    return { success: true, exitCode: 0, warnings: allWarnings };
  } catch (err) {
    const error = err as Error;
    // Attempt to extract line number from stack trace
    const stackLine = error.stack?.split("\n")[1] ?? "";
    const lineMatch = stackLine.match(/:(\d+):(\d+)/);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : 1;
    const column = lineMatch ? parseInt(lineMatch[2], 10) : 1;

    const sourceText = (() => {
      try {
        return readFileSync(entryPath, "utf-8");
      } catch {
        return "// Could not read source file";
      }
    })();

    const frame = formatCodeFrame({
      filePath: entryPath,
      line,
      column,
      sourceText,
      message: error.message,
    });
    console.error(frame);
    return { success: false, exitCode: 1, error, warnings: allWarnings };
  }
}
