/**
 * `rahulchaube add <pkg...>` — add dependencies.
 */
import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";

export async function add(args: string[], flags: Record<string, unknown>): Promise<number> {
  if (args.length === 0) {
    log.error("Usage: rahulchaube add <package...> [--dev]");
    return 1;
  }
  const dev = flags.dev ? ["--dev"] : [];
  const exact = flags.exact ? ["--exact"] : [];
  const sp = (await import("../ui/spinner.ts")).spinner(`${icons.package} Adding ${args.join(", ")}…`);
  const r = runEngine(["add", ...dev, ...exact, ...args]);
  sp.stop();
  if (r.code === 0) log.success(`Added ${colors.bold(args.join(", "))}.`);
  else log.error("Add failed.");
  return r.code;
}
