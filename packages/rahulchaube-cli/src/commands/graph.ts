/**
 * `rahulchaube graph` — visualize the dependency graph (ASCII tree).
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { findProjectRoot, readPackageJson, allDeps } from "../util/fs.ts";

export async function graph(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  const pkg = readPackageJson(root);
  if (!pkg) {
    log.error("No package.json found.");
    return 1;
  }
  const deps = allDeps(pkg);
  const rootName = pkg.name ?? "project";

  log.plain("");
  log.plain(`${colors.magenta(icons.graph)} ${colors.bold(rootName)} ${colors.dim("@" + (pkg.version ?? "0.0.0"))}`);
  const entries = Object.entries(deps).sort((a, b) => a[0].localeCompare(b[0]));
  entries.forEach(([name, info], i) => {
    const last = i === entries.length - 1;
    const branch = last ? "└─ " : "├─ ";
    const typeColor =
      info.type === "devDependency" ? colors.gray : colors.cyan;
    log.plain(
      `  ${colors.dim(branch)}${colors.bold(name)} ${typeColor(info.range)} ${colors.dim("[" + info.type + "]")}`,
    );
  });
  log.plain("");
  log.info(
    `Showing ${colors.bold(String(entries.length))} direct dependencies. Use ${colors.bold(
      "rahulchaube why <pkg>",
    )} to trace a specific package.`,
  );
  return 0;
}
