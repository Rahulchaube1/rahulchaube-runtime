/**
 * `rahulchaube run [target] [-- ...args]` — Native execution pipeline coordinator.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { existsSync } from "node:fs";
import { extname, resolve } from "node:path";

import { SUPPORTED_EXTENSIONS } from "../../../../runtime/module-loader/resolver.ts";
import { runScript } from "../../../../runtime/engine/runner.ts";
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
  if (existsSync(absPath) || SUPPORTED_EXTENSIONS.includes(extname(target))) {
    log.debug(`[Stage 1: CLI] Subcommand 'run' received target: ${colors.bold(target)}`);

    process.argv = [process.execPath, absPath, ...args.slice(1)];
    const executeOnce = async () => (await runScript(absPath, { debug: Boolean(flags.debug) })).exitCode;

    const exitCode = await executeOnce();

    if (isWatch) {
      log.info(`${colors.cyan(icons.info)} Watch mode active. Monitoring file changes…`);
      const watcher = new FileWatcher(absPath, async (_evt, filename) => {
        log.info(`${colors.yellow(icons.bolt)} Change detected in ${filename || target}. Re-executing…`);
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
