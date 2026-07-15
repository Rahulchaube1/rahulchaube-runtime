/**
 * `rahulchaube optimize` — suggest and (optionally) apply performance fixes.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { confirm } from "../ui/prompt.ts";
import { findProjectRoot, readPackageJson } from "../util/fs.ts";
import { join } from "node:path";

interface Suggestion {
  id: string;
  title: string;
  detail: string;
  apply?: () => void;
}

export async function optimize(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  const pkg = readPackageJson(root);
  if (!pkg) {
    log.error("No package.json found.");
    return 1;
  }

  const suggestions: Suggestion[] = [];

  const scripts = pkg.scripts ?? {};
  if (scripts.build && !/--minify/.test(scripts.build) && !/rahulchaube build/.test(scripts.build)) {
    suggestions.push({
      id: "build-minify",
      title: "Enable minification in your build",
      detail: "Add `--minify` to shrink output bundles and improve cold start.",
    });
  }
  if (scripts.build && !/--sourcemap/.test(scripts.build)) {
    suggestions.push({
      id: "build-sm",
      title: "Emit source maps",
      detail: "Add `--sourcemap` so stack traces map back to your source.",
    });
  }
  if (!scripts.benchmark) {
    suggestions.push({
      id: "add-bench",
      title: "Add a benchmark script",
      detail: "Run `rahulchaube benchmark` to track performance regressions.",
    });
  }
  if (!scripts.test) {
    suggestions.push({
      id: "add-test",
      title: "Add a test script",
      detail: "Run `rahulchaube test` to protect against regressions.",
    });
  }

  log.plain("");
  log.plain(`${colors.magenta(icons.bolt)} ${colors.bold("Optimization Suggestions")}`);
  log.plain("");
  if (suggestions.length === 0) {
    log.success(`${icons.success} No obvious optimizations available. Run ${colors.bold("rahulchaube analyze")} for deeper insights.`);
    return 0;
  }

  suggestions.forEach((s, i) => {
    log.plain(`  ${colors.magenta(String(i + 1) + ".")} ${colors.bold(s.title)}`);
    log.plain(`     ${colors.dim(s.detail)}`);
  });
  log.plain("");

  if (flags.apply || (await confirm("Apply safe suggestions automatically?", false))) {
    // Most suggestions are manifest edits; we apply the minify/sourcemap flags.
    const build = pkg.scripts?.build;
    if (build && /rahulchaube build/.test(build)) {
      let next = build;
      if (!/--minify/.test(next)) next += " --minify";
      if (!/--sourcemap/.test(next)) next += " --sourcemap";
      pkg.scripts!.build = next;
      (await import("node:fs")).      writeFileSync(
        join(root, "package.json"),
        JSON.stringify(pkg, null, 2) + "\n",
      );
      log.success(`${icons.wrench} Updated scripts.build with --minify --sourcemap.`);
    } else {
      log.info("Apply builds to scripts that use `rahulchaube build` for automatic edits.");
    }
  } else {
    log.info("No changes made. Re-run with `--apply` to auto-apply safe fixes.");
  }
  return 0;
}
