/**
 * `rahulchaube doctor [--fix]` — environment diagnostics and self-healing.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { runEngine } from "../engine/bun.ts";
import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { readPackageJson, findProjectRoot } from "../util/fs.ts";

interface Check {
  name: string;
  ok: boolean;
  detail: string;
  fix?: () => boolean;
}

export async function doctor(args: string[], flags: Record<string, unknown>): Promise<number> {
  const fix = !!flags.fix;
  const root = findProjectRoot();
  const checks: Check[] = [];

  // 1. Engine availability
  const eng = runEngine(["--version"], { inherit: false });
  checks.push({
    name: "Engine runtime",
    ok: eng.code === 0,
    detail: eng.code === 0 ? eng.stdout.trim() : "engine not found on PATH",
  });

  // 2. Project root present
  const pkg = readPackageJson(root);
  checks.push({
    name: "Project manifest",
    ok: !!pkg,
    detail: pkg ? join(root, "package.json") : "no package.json",
  }, dependencyCheck(root));

  // 4. Cache dir writable
  const cache = join(root, "node_modules", ".cache");
  checks.push({
    name: "Cache directory",
    ok: true,
    detail: existsSync(cache) ? "ready" : "will be created on first build",
  }, ignoreCheck(root));

  let failures = 0;
  for (const c of checks) {
    if (c.ok) {
      log.success(`${c.name}: ${colors.dim(c.detail)}`);
    } else if (fix && c.fix?.()) {
      log.success(`${icons.wrench} Fixed ${colors.bold(c.name)}.`);
    } else {
      failures++;
      log.error(`${c.name}: ${c.detail}`);
    }
  }

  if (failures === 0) {
    log.success(`${icons.shield} Your environment is healthy.`);
    return 0;
  }
  log.warn(`Found ${failures} issue(s). Run ${colors.bold("rahulchaube doctor --fix")} to repair.`);
  return 1;
}


function dependencyCheck(root: string): Check {
  const present = existsSync(join(root, "node_modules"));
  const missing = !present && existsSync(join(root, "bun.lock"));
  return {
    name: "Dependency tree",
    ok: !missing,
    detail: missing ? "missing node_modules" : "ready",
    fix: () => runEngine(["install", "--frozen-lockfile"], { cwd: root, inherit: false }).code === 0,
  };
}

function ignoreCheck(root: string): Check {
  const file = join(root, ".gitignore");
  const ignored = existsSync(file) && readFileSync(file, "utf8").includes("node_modules");
  return {
    name: "VCS hygiene", ok: ignored,
    detail: ignored ? ".gitignore covers node_modules" : "add node_modules to .gitignore",
    fix: () => {
      appendFileSync(file, "\nnode_modules\n");
      return true;
    },
  };
}
