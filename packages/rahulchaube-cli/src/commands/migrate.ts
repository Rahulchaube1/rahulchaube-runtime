/**
 * `rahulchaube migrate [from]` — migrate projects from npm / yarn / pnpm / bun.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { select, confirm } from "../ui/prompt.ts";
import { findProjectRoot, readPackageJson } from "../util/fs.ts";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCES = [
  { value: "npm", label: "npm", hint: "package-lock.json" },
  { value: "yarn", label: "Yarn", hint: "yarn.lock" },
  { value: "pnpm", label: "pnpm", hint: "pnpm-lock.yaml" },
  { value: "bun", label: "Bun", hint: "bun.lock" },
] as const;

export async function migrate(args: string[], _flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  let from = args[0] as (typeof SOURCES)[number]["value"] | undefined;

  if (!from) {
    const detected = SOURCES.find((s) =>
      existsSync(join(root, s.hint)),
    );
    if (detected) {
      log.info(`Detected ${colors.bold(detected.label)} (${colors.dim(detected.hint)}).`);
      from = detected.value;
    } else {
      from = await select("What are you migrating from?", SOURCES as unknown as { value: string; label: string; hint?: string }[]);
    }
  }

  log.info(`${icons.refresh} Migrating from ${colors.bold(from!)} to RahulChaube Runtime…`);

  // Remove legacy lockfiles; RahulChaube uses bun.lock (engine-compatible).
  const legacy = SOURCES.filter((s) => s.value !== "bun").map((s) => join(root, s.hint));
  for (const f of legacy) {
    if (existsSync(f)) {
      const ok = await confirm(`Remove ${f.split(/[\\/]/).pop()}?`, true);
      if (ok) {
        rmSync(f, { force: true });
        log.success(`Removed ${colors.dim(f.split(/[\\/]/).pop()!)}.`);
      }
    }
  }

  // Ensure a rahulchaube config exists with sensible defaults.
  const cfgPath = join(root, "rahulchaube.json");
  if (!existsSync(cfgPath)) {
    writeFileSync(
      cfgPath,
      JSON.stringify({ telemetry: false, autoInstall: true, theme: "default" }, null, 2) + "\n",
    );
    log.success("Created rahulchaube.json.");
  }

  log.success(`${icons.rocket} Migration complete! Run ${colors.bold("rahulchaube install")} to finish.`);
  return 0;
}
