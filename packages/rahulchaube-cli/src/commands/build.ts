/**
 * `rahulchaube build [entry...]` — Native build & bundle coordinator.
 */
import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { FileWatcher } from "../../../../runtime/watcher/watcher.ts";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export async function build(args: string[], flags: Record<string, unknown>): Promise<number> {
  const out = flags.outdir ? ["--outdir", String(flags.outdir)] : [];
  const target = flags.target ? ["--target", String(flags.target)] : [];
  const minify = flags.minify ? ["--minify"] : [];
  const sourcemap = flags.sourcemap ? ["--sourcemap"] : [];
  const splitting = flags.splitting ? ["--splitting"] : [];

  const output = typeof flags.outfile === "string" ? ["--outfile", flags.outfile] : out;
  const compile = flags.compile ? ["--compile"] : [];
  const isWatch = Boolean(flags.watch || flags.w);

  log.info(`${icons.build} Building ${colors.dim(args.join(" ") || "project")}…`);
  const r = runEngine(["build", ...output, ...compile, ...target, ...minify, ...sourcemap, ...splitting, ...args]);

  if (isWatch) {
    const entry = args[0] || "src";
    const absPath = resolve(process.cwd(), entry);
    if (existsSync(absPath)) {
      log.info(`${colors.cyan(icons.info)} Watch mode active for build. Monitoring changes…`);
      const watcher = new FileWatcher(absPath, (_evt, filename) => {
        log.info(`${colors.yellow(icons.bolt)} Rebuilding due to change in ${filename || entry}…`);
        runEngine(["build", ...output, ...compile, ...target, ...minify, ...sourcemap, ...splitting, ...args]);
      });
      watcher.start();
      return new Promise(() => {});
    }
  }

  return r.code;
}
