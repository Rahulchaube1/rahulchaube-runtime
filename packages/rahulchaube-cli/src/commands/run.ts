/**
 * `rahulchaube run [script] [-- ...args]` — run a package.json script.
 */
import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";

export async function run(args: string[], _flags: Record<string, unknown>): Promise<number> {
  const sp = (await import("../ui/spinner.ts")).spinner(`${icons.run} Running ${colors.bold(args.join(" "))}…`);
  sp.stop();
  const r = runEngine(["run", ...args]);
  return r.code;
}
