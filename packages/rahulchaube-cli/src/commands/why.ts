/**
 * `rahulchaube why <pkg>` — explain why a dependency is installed.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { findProjectRoot, readPackageJson, allDeps } from "../util/fs.ts";

export async function why(args: string[], _flags: Record<string, unknown>): Promise<number> {
  const target = args[0];
  if (!target) {
    log.error("Usage: rahulchaube why <package>");
    return 1;
  }
  const root = findProjectRoot();
  const pkg = readPackageJson(root);
  if (!pkg) {
    log.error("No package.json found.");
    return 1;
  }
  const deps = allDeps(pkg);
  if (deps[target]) {
    log.success(
      `${icons.search} ${colors.bold(target)} is a direct ${colors.cyan(deps[target].type)} (${colors.dim(
        deps[target].range,
      )}).`,
    );
    return 0;
  }

  // Transitive search: scan installed packages for who depends on target.
  const dependents = await findDependents(root, target);
  if (dependents.length === 0) {
    log.warn(`${target} is not present in your dependency tree.`);
    return 0;
  }
  log.plain("");
  log.plain(`${colors.magenta(icons.dependency)} ${colors.bold(target)} is required by:`);
  for (const d of dependents) {
    log.plain(`  ${colors.dim("└─")} ${colors.bold(d.name)} ${colors.dim("@" + d.version)}`);
  }
  log.plain("");
  return 0;
}

async function findDependents(root: string, target: string) {
  const { existsSync, readFileSync, readdirSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");
  const nm = join(root, "node_modules");
  if (!existsSync(nm)) return [];
  const out: { name: string; version: string }[] = [];
  const scan = (dir: string) => {
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const e of entries) {
      if (e === ".bin" || e.startsWith("@")) {
        if (e.startsWith("@")) {
          try {
            for (const sub of readdirSync(join(dir, e))) scan(join(dir, e, sub));
          } catch {
            /* ignore */
          }
        }
        continue;
      }
      const pj = join(dir, e, "package.json");
      if (!existsSync(pj)) continue;
      try {
        const meta = JSON.parse(readFileSync(pj, "utf8"));
        const all = { ...meta.dependencies, ...meta.peerDependencies, ...meta.optionalDependencies };
        if (all && target in all) out.push({ name: meta.name, version: meta.version });
      } catch {
        /* ignore */
      }
    }
  };
  scan(nm);
  return out;
}
