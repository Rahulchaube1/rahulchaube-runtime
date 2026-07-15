/**
 * `rahulchaube remove <pkg...>` — remove dependencies.
 */
import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";

export async function remove(args: string[], _flags: Record<string, unknown>): Promise<number> {
  if (args.length === 0) {
    log.error("Usage: rahulchaube remove <package...>");
    return 1;
  }
  const sp = (await import("../ui/spinner.ts")).spinner(`${icons.package} Removing ${args.join(", ")}…`);
  const r = runEngine(["remove", ...args]);
  sp.stop();
  if (r.code === 0) log.success(`Removed ${colors.bold(args.join(", "))}.`);
  else log.error("Remove failed.");
  return r.code;
}
