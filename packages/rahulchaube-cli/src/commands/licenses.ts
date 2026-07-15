/**
 * `rahulchaube licenses` — summarize dependency license usage & policy checks.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { table } from "../ui/table.ts";
import { findProjectRoot, readPackageJson, allDeps, listWorkspaces } from "../util/fs.ts";
import { join } from "node:path";

const PERMISSIVE = new Set([
  "MIT", "ISC", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause",
  "0BSD", "Unlicense", "CC0-1.0", "BlueOak-1.0.0", "WTFPL",
]);

export async function licenses(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  const pkg = readPackageJson(root);
  if (!pkg) {
    log.error("No package.json found.");
    return 1;
  }
  const deps = allDeps(pkg);
  const names = Object.keys(deps);

  // Best-effort classification. A full resolution reads installed package.json files.
  const buckets: Record<string, number> = {};
  for (const name of names) {
    const guess = await readInstalledLicense(root, name);
    buckets[guess] = (buckets[guess] ?? 0) + 1;
  }

  const rows = Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .map(([lic, n]) => ({
      license: lic,
      count: String(n),
      policy: PERMISSIVE.has(lic) ? "allowed" : "review",
    }));

  log.plain(
    table(rows, [
      { key: "license", header: "License", color: colors.bold },
      { key: "count", header: "Packages", align: "right", color: colors.cyan },
      {
        key: "policy",
        header: "Policy",
        color: (s) => (s === "allowed" ? colors.green(s) : colors.yellow(s)),
      },
    ]),
  );

  const flagged = rows.filter((r) => r.policy === "review");
  if (flagged.length) {
    log.warn(
      `${icons.key} ${flagged.length} license type(s) need review: ${colors.bold(
        flagged.map((f) => f.license).join(", "),
      )}`,
    );
  } else {
    log.success(`${icons.shield} All ${names.length} dependency licenses are permissive.`);
  }
  if (flags.json) log.plain(JSON.stringify(buckets, null, 2));
  return 0;
}

async function readInstalledLicense(root: string, name: string): Promise<string> {
  const candidates = [
    joinSafe(root, "node_modules", name, "package.json"),
    ...listWorkspaces(root).flatMap((w) =>
      joinSafe(w, "node_modules", name, "package.json"),
    ),
  ];
  for (const c of candidates) {
    try {
      const { readFileSync, existsSync } = await import("node:fs");
      if (!existsSync(c)) continue;
      const meta = JSON.parse(readFileSync(c, "utf8"));
      if (typeof meta.license === "string") return meta.license;
      if (Array.isArray(meta.licenses)) return meta.licenses[0]?.type ?? "UNKNOWN";
    } catch {
      /* ignore */
    }
  }
  return "UNKNOWN";
}

function joinSafe(...p: string[]) {
  return join(...p);
}
