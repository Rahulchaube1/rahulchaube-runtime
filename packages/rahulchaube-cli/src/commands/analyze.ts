/**
 * `rahulchaube analyze` — static project analysis with diagnostics & suggestions.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { table } from "../ui/table.ts";
import { walkDir, findProjectRoot, readPackageJson, allDeps } from "../util/fs.ts";
import { sep } from "node:path";

interface Diagnostic {
  severity: "info" | "warn" | "hint";
  file: string;
  message: string;
}

export async function analyze(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  log.info(`${icons.scan} Analyzing project at ${colors.dim(root)}…`);

  const diag: Diagnostic[] = [];
  const files = walkDir(root, (p) => /\.(ts|tsx|js|jsx|mts|cts|mjs|cjs)$/.test(p)).slice(0, 5000);

  // Heuristics
  let consoleCount = 0;
  let todoCount = 0;
  let anyCount = 0;
  let largeFiles = 0;

  for (const f of files) {
    let content = "";
    try {
      content = (await import("node:fs")).readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const rel = f.replace(root + (root.endsWith("/") || root.endsWith("\\") ? "" : sep), "");
    const lines = content.split("\n").length;
    if (lines > 800) {
      largeFiles++;
      diag.push({ severity: "hint", file: rel, message: `Large file (${lines} lines) — consider splitting.` });
    }
    const cc = (content.match(/console\.(log|warn|error|debug)/g) ?? []).length;
    if (cc > 0) {
      consoleCount += cc;
      if (cc > 10) diag.push({ severity: "warn", file: rel, message: `${cc} console.* calls — use a logger.` });
    }
    const td = (content.match(/\b(TODO|FIXME|XXX)\b/g) ?? []).length;
    if (td > 0) todoCount += td;
    const ay = (content.match(/\bany\b/g) ?? []).length;
    if (ay > 5) {
      anyCount += ay;
      diag.push({ severity: "hint", file: rel, message: `${ay} uses of 'any' — tighten types.` });
    }
  }

  // Dependency hygiene
  const pkg = readPackageJson(root);
  if (pkg) {
    const deps = allDeps(pkg);
    const names = Object.keys(deps);
    const heavy = ["moment", "lodash", "webpack", "jquery"];
    for (const h of heavy) {
      if (names.includes(h)) {
        diag.push({
          severity: "hint",
          file: "package.json",
          message: `'${h}' is heavy — consider a lighter alternative.`,
        });
      }
    }
  }

  const score = Math.max(0, 100 - diag.length * 3 - (consoleCount > 20 ? 10 : 0));
  log.plain("");
  log.plain(`${colors.magenta(icons.graph)} ${colors.bold("Analysis Report")}`);
  log.plain(
    `  Files scanned: ${colors.cyan(String(files.length))}  ` +
      `Console calls: ${colors.yellow(String(consoleCount))}  ` +
      `TODOs: ${colors.yellow(String(todoCount))}  ` +
      `Large files: ${colors.yellow(String(largeFiles))}`,
  );
  log.plain("");
  log.plain(`${colors.bold("Health score:")} ${scoreColor(score)(score + " / 100")}`);
  log.plain("");

  if (diag.length === 0) {
    log.success(`${icons.success} No issues found. Your project is in great shape!`);
    return 0;
  }

  const rows = diag.slice(0, 40).map((d) => ({
    sev: d.severity,
    file: d.file,
    msg: d.message,
  }));
  log.plain(
    table(rows, [
      {
        key: "sev",
        header: "Level",
        color: (s) => (s === "warn" ? colors.yellow(s) : colors.cyan(s)),
      },
      { key: "file", header: "File", color: colors.bold },
      { key: "msg", header: "Finding", color: colors.white },
    ]),
  );
  log.plain("");
  log.info(`Found ${colors.bold(String(diag.length))} suggestion(s). Use ${colors.bold("rahulchaube optimize")} for fixes.`);
  if (flags.json) log.plain(JSON.stringify({ score, diagnostics: diag }, null, 2));
  return 0;
}

function scoreColor(s: number) {
  return s >= 80 ? colors.green : s >= 50 ? colors.yellow : colors.red;
}
