/**
 * `rahulchaube install` — install dependencies with a branded experience.
 */
import { forward } from "./forward.ts";
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { spinner } from "../ui/spinner.ts";
import { readPackageJson, findProjectRoot } from "../util/fs.ts";

export async function install(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  const pkg = readPackageJson(root);
  if (!pkg) {
    log.error(`No ${colors.bold("package.json")} found in ${colors.dim(root)}.`);
    return 1;
  }
  const depCount =
    Object.keys(pkg.dependencies ?? {}).length +
    Object.keys(pkg.devDependencies ?? {}).length;
  if (depCount === 0) {
    log.warn("No dependencies declared in package.json.");
  }
  const sp = spinner(`${icons.package} Resolving ${depCount} packages…`);
  // The engine performs the actual resolution + install.
  const extra = args.slice();
  if (flags["frozen-lockfile"]) extra.push("--frozen-lockfile");
  if (flags.production) extra.push("--production");
  if (flags["no-save"]) extra.push("--no-save");
  const r = runEngine(["install", ...extra]);
  sp.stop();
  if (r.code === 0) {
    log.success(`${colors.green(icons.success)} Dependencies installed. ${colors.dim(`(${depCount} top-level)`)}`);
  } else {
    log.error("Install failed. Try `rahulchaube doctor` to diagnose.");
  }
  return r.code;
}
