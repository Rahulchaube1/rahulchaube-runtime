/**
 * `rahulchaube build [entry...]` — bundle with the bundler.
 */
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
  log.info(`${icons.build} Building ${colors.dim(args.join(" ") || "project")}…`);
  const r = runEngine(["build", ...out, ...target, ...minify, ...sourcemap, ...splitting, ...args]);
  return r.code;
}
