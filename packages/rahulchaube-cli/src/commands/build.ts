/**
 * `rahulchaube build [entry...]` — Native build & bundle coordinator.
 */
import { realpathSync } from "node:fs";
import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";

export async function build(args: string[], flags: Record<string, unknown>): Promise<number> {
  const out = flags.outdir ? ["--outdir", String(flags.outdir)] : [];
  const target = flags.target ? ["--target", String(flags.target)] : [];
  const minify = flags.minify ? ["--minify"] : [];
  const sourcemap = flags.sourcemap ? ["--sourcemap"] : [];
  const splitting = flags.splitting ? ["--splitting"] : [];

  const output = typeof flags.outfile === "string" ? ["--outfile", flags.outfile] : out;
  const compile = flags.compile ? ["--compile"] : [];
  const watch = flags.watch || flags.w ? ["--watch"] : [];

  log.info(`${icons.build} Building ${colors.dim(args.join(" ") || "project")}…`);
  return runEngine(["build", ...watch, ...output, ...compile, ...target, ...minify, ...sourcemap, ...splitting, ...args],
    watch.length ? { cwd: realpathSync.native(process.cwd()) } : {}).code;
}
