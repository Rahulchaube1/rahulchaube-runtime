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
import { FileWatcher } from "../../../../runtime/watcher/watcher.ts";
import { runEngine } from "../engine/bun.ts";

export async function run(args: string[], flags: Record<string, unknown>): Promise<number> {
  const target = args[0];
  if (!target) {
    log.error("No script or file target specified.");
    log.info("Usage: rahulchaube run <file.ts | script> [--watch]");
    return 1;
  }

  const isWatch = Boolean(flags.watch || flags.w);

  // If target is a local file, run native pipeline
  const absPath = resolve(process.cwd(), target);
  if (existsSync(absPath) || target.endsWith(".ts") || target.endsWith(".js") || target.endsWith(".tsx")) {
    log.debug(`[Stage 1: CLI] Subcommand 'run' received target: ${colors.bold(target)}`);

    const executeOnce = async (): Promise<number> => {
      try {
        const res = resolveModule(target, process.cwd());
        const vfs = new VirtualFS();
        const rawText = vfs.readFile(res.resolvedPath);

        const loader = new ModuleLoader();
        const loaded = loader.load(res.resolvedPath);

        transpileSource({
          fileName: res.resolvedPath,
          sourceText: loaded.sourceText,
          minify: Boolean(flags.minify),
        });

        const result = await runScript(res.resolvedPath);

        if (!result.success && result.error) {
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
    };

    const exitCode = await executeOnce();

    if (isWatch) {
      log.info(`${colors.cyan(icons.info)} Watch mode active. Monitoring file changes…`);
      const watcher = new FileWatcher(absPath, async (_evt, filename) => {
        log.info(`${colors.yellow(icons.lightning)} Change detected in ${filename || target}. Re-executing…`);
        await executeOnce();
      });
      watcher.start();
      // Keep process alive in watch mode
      return new Promise(() => {});
    }

    return exitCode;
  }

  // Fallback for package.json scripts
  const r = runEngine(["run", ...args]);
  return r.code;
}
