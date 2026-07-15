/**
 * `rahulchaube cache clean [--all]` — prune the package & filesystem caches.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { runEngine } from "../engine/bun.ts";
import { existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { findProjectRoot } from "../util/fs.ts";

export async function cache(args: string[], flags: Record<string, unknown>): Promise<number> {
  const all = flags.all || flags["--all"];
  const root = findProjectRoot();

  const sp = (await import("../ui/spinner.ts")).spinner(`${icons.cache} Inspecting caches…`);
  const removed: string[] = [];

  // Project-level caches
  const localCaches = [
    join(root, "node_modules", ".cache"),
    join(root, ".rahulchaube", "cache"),
  ];
  for (const c of localCaches) {
    if (existsSync(c)) {
      rmSync(c, { recursive: true, force: true });
      removed.push(c);
    }
  }

  // Engine cache
  const r = runEngine(["pm", "cache", "rm"], { inherit: false });
  void r;
  sp.stop();

  if (removed.length === 0) {
    log.info("Caches already clean.");
  } else {
    log.success(
      `${icons.cache} Removed ${colors.bold(String(removed.length))} cache location(s):`,
    );
    for (const c of removed) log.plain("  " + colors.dim(c));
  }
  if (all) {
    log.info("Use the engine's global cache prune for a deeper clean.");
    runEngine(["pm", "cache", "rm", "--all"]);
  }
  return 0;
}
