/**
 * `rahulchaube test [filters...]` — run the test runner.
 */
import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";

export async function test(args: string[], flags: Record<string, unknown>): Promise<number> {
  const watch = flags.watch ? ["--watch"] : [];
  const coverage = flags.coverage ? ["--coverage"] : [];
  log.info(`${icons.test} Launching test suite…`);
  const r = runEngine(["test", ...watch, ...coverage, ...args]);
  return r.code;
}
