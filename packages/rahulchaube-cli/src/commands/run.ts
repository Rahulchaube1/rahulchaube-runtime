/**
 * `rahulchaube run [target] [-- ...args]` — Native execution pipeline coordinator.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { existsSync, realpathSync } from "node:fs";
import { extname, resolve } from "node:path";

import { SUPPORTED_EXTENSIONS } from "../../../../runtime/module-loader/resolver.ts";
import { runScript } from "../../../../runtime/engine/runner.ts";
import { spawnSync } from "node:child_process";
import { runEngine } from "../engine/bun.ts";

export async function run(args: string[], flags: Record<string, unknown>): Promise<number> {
  if (args[0]?.endsWith(".blyx")) return (await import("./blyx.ts")).blyxFile("run", args, flags);
  const target = args[0];
  if (!target) {
    log.error("No script or file target specified.");
    log.info("Usage: rahulchaube run <file.ts | script> [--watch]");
    return 1;
  }

  const watch = Boolean(flags.watch || flags.w);
  if (watch && flags.hot) {
    log.error("Choose either --watch or --hot.");
    return 1;
  }
  const mode = watch ? "--watch" : flags.hot ? "--hot" : undefined;

  // If target is a local file, run native pipeline
  const absPath = resolve(process.cwd(), target);
  if (existsSync(absPath) || SUPPORTED_EXTENSIONS.includes(extname(target))) {
    log.debug(`[Stage 1: CLI] Subcommand 'run' received target: ${colors.bold(target)}`);

    if (mode) {
      // Windows may provide a DOS short path for cwd while module imports use long paths.
      const cwd = realpathSync.native(process.cwd());
      const entry = existsSync(absPath) ? realpathSync.native(absPath) : absPath;
      const result = spawnSync(process.execPath, [mode, entry, ...args.slice(1)], { cwd, stdio: "inherit" });
      if (result.error) log.error(result.error.message);
      return result.status ?? 1;
    }
    process.argv = [process.execPath, absPath, ...args.slice(1)];
    return (await runScript(absPath, { debug: Boolean(flags.debug) })).exitCode;
  }

  // Fallback for package.json scripts
  const r = runEngine(["run", ...(mode ? [mode] : []), ...args]);
  return r.code;
}
