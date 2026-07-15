/**
 * `rahulchaube benchmark [--filter ...]` — run suite + report timings.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { table } from "../ui/table.ts";
import { runEngine } from "../engine/bun.ts";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { findProjectRoot } from "../util/fs.ts";

export async function benchmark(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  const benchDir = join(root, "bench");
  log.info(`${icons.flame} Running benchmarks…`);

  // If a dedicated benchmark script exists, delegate to the engine.
  const pkg = (await import("../util/fs.ts")).readPackageJson(root);
  const script = pkg?.scripts?.["benchmark"];
  if (script) {
    return runEngine(["run", "benchmark", ...args]);
  }

  if (!existsSync(benchDir)) {
    log.warn(`No ${colors.bold("bench/")} directory found. Create one with your .bench.ts files.`);
    log.info(`Example: ${colors.cyan("import { bench } from 'rahulchaube'; bench('sum', () => 1+1);")}`);
    return 0;
  }

  const r = runEngine(["bench", ...args]);
  if (flags.json) log.plain(JSON.stringify({ benchDir }, null, 2));
  return r.code;
}
