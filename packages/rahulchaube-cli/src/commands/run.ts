/**
 * `rahulchaube run [target] [-- ...args]` — Native execution pipeline coordinator.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { resolveModule } from "../../../../runtime/module-loader/resolver.ts";
import { ModuleLoader } from "../../../../runtime/module-loader/loader.ts";
import { VirtualFS } from "../../../../runtime/fs/virtual-fs.ts";
import { transpileSource } from "../../../../runtime/compiler/transpiler.ts";
import { runScript } from "../../../../runtime/engine/runner.ts";
import { formatCodeFrame } from "../../../../runtime/diagnostics/errors.ts";
import { runEngine } from "../engine/bun.ts";

export async function run(args: string[], flags: Record<string, unknown>): Promise<number> {
  const target = args[0];
  if (!target) {
    log.error("No script or file target specified.");
    log.info("Usage: rahulchaube run <file.ts | script>");
    return 1;
  }

  // If target is a local file, run native pipeline
  const absPath = resolve(process.cwd(), target);
  if (existsSync(absPath) || target.endsWith(".ts") || target.endsWith(".js") || target.endsWith(".tsx")) {
    log.debug(`[Stage 1: CLI] Subcommand 'run' received target: ${colors.bold(target)}`);

    try {
      // Stage 2: Module Resolver
      log.debug(`[Stage 2: Resolver] Resolving module specifier '${target}'...`);
      const res = resolveModule(target, process.cwd());
      log.debug(`[Stage 2: Resolver] Resolved -> ${res.resolvedPath} (ext: ${res.extension})`);

      // Stage 3: Virtual FS
      log.debug(`[Stage 3: Virtual FS] Reading file into memory cache...`);
      const vfs = new VirtualFS();
      const rawText = vfs.readFile(res.resolvedPath);
      log.debug(`[Stage 3: Virtual FS] Read ${rawText.length} bytes from disk`);

      // Stage 4: Module Loader
      log.debug(`[Stage 4: Loader] Loading dependency graph and checking circular imports...`);
      const loader = new ModuleLoader();
      const loaded = loader.load(res.resolvedPath);
      log.debug(`[Stage 4: Loader] Loaded module graph with ${loaded.dependencies.length} dependencies`);

      // Stage 5: Transpiler
      log.debug(`[Stage 5: Transpiler] Stripping TypeScript annotations and comments...`);
      const transpiled = transpileSource({
        fileName: res.resolvedPath,
        sourceText: loaded.sourceText,
        minify: Boolean(flags.minify),
      });
      log.debug(`[Stage 5: Transpiler] Compiled code size: ${transpiled.code.length} characters`);

      // Stage 6: Runner
      log.debug(`[Stage 6: Runner] Executing script engine...`);
      const result = await runScript(res.resolvedPath);

      if (!result.success && result.error) {
        // Stage 7: Diagnostics
        log.debug(`[Stage 7: Diagnostics] Formatting error code frame...`);
        const diag = formatCodeFrame({
          filePath: res.resolvedPath,
          line: 1,
          column: 1,
          sourceText: loaded.sourceText,
          message: result.error.message,
        });
        log.plain(diag);
        return 1;
      }

      return 0;
    } catch (err) {
      log.error(`[Stage 7: Diagnostics] Execution failed: ${(err as Error).message}`);
      return 1;
    }
  }

  // Fallback for package.json scripts
  const r = runEngine(["run", ...args]);
  return r.code;
}
