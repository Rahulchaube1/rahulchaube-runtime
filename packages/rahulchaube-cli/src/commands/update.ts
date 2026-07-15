/**
 * `rahulchaube update [pkg...]` — update dependencies.
 */
import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";

export async function update(args: string[], flags: Record<string, unknown>): Promise<number> {
  const interactive = flags.interactive ? ["--interactive"] : [];
  const latest = flags.latest ? ["--latest"] : [];
  const target = args.length ? args.join(", ") : "all dependencies";
  const sp = (await import("../ui/spinner.ts")).spinner(`${icons.refresh} Updating ${target}…`);
  const r = runEngine(["update", ...interactive, ...latest, ...args]);
  sp.stop();
  if (r.code === 0) log.success(`Updated ${colors.bold(target)}.`);
  else log.error("Update failed.");
  return r.code;
}
