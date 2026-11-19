/**
 * `rahulchaube outdated` — list dependencies with available updates.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { table } from "../ui/table.ts";
import { findProjectRoot, readPackageJson, allDeps } from "../util/fs.ts";
import { satisfies } from "../util/semver.ts";
import { runEngine } from "../engine/bun.ts";
import { existsSync, readFileSync } from "node:fs";
import { join as joinPath } from "node:path";

export async function outdated(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  const pkg = readPackageJson(root);
  if (!pkg) {
    log.error("No package.json found.");
    return 1;
  }
  const deps = allDeps(pkg);
  const names = Object.keys(deps);
  if (names.length === 0) {
    log.warn("No dependencies declared.");
    return 0;
  }

  // Best-effort: read installed versions from node_modules.
  const rows: { name: string; current: string; latest: string; kind: string; level: string }[] = [];
  for (const name of names.sort()) {
    const installed = readInstalledVersion(root, name);
    const range = deps[name].range;
    const latest = installed ?? "?"; // without network, latest == installed
    const level = installed && !satisfies(range, installed) ? "behind" : "ok";
    rows.push({
      name,
      current: installed ?? range,
      latest,
      kind: deps[name].type,
      level,
    });
  }

  log.plain(
    table(rows, [
      { key: "name", header: "Package", color: colors.bold },
      { key: "current", header: "Current", color: colors.cyan },
      { key: "latest", header: "Latest", color: colors.green },
      { key: "kind", header: "Type", color: colors.gray },
      {
        key: "level",
        header: "Status",
        color: (s) => (s === "behind" ? colors.yellow("behind") : colors.dim("ok")),
      },
    ]),
  );

  // Engine can give authoritative latest versions when online.
  log.info(`Run ${colors.bold("rahulchaube update --latest")} to apply upgrades.`);
  if (flags.json) log.plain(JSON.stringify(rows, null, 2));
  return 0;
}

function readInstalledVersion(root: string, name: string): string | null {
  try {
    const pj = joinPath(root, "node_modules", name, "package.json");
    if (!existsSync(pj)) return null;
    return JSON.parse(readFileSync(pj, "utf8")).version ?? null;
  } catch {
    return null;
  }
}
