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
  fix?: () => void;
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
  });

  // 3. node_modules vs lockfile consistency
  const nm = existsSync(join(root, "node_modules"));
  const lock = existsSync(join(root, "bun.lock"));
  checks.push({
    name: "Dependency tree",
    ok: nm || !lock,
    detail: nm ? "node_modules present" : lock ? "missing node_modules — run `rahulchaube install`" : "no deps",
    fix: nm || !lock ? undefined : () => runEngine(["install", "--frozen-lockfile"], { inherit: false }),
  });

  // 4. Cache dir writable
  const cache = join(root, "node_modules", ".cache");
  checks.push({
    name: "Cache directory",
    ok: true,
    detail: existsSync(cache) ? "ready" : "will be created on first build",
  });

  // 5. Git ignore hygiene (node_modules ignored)
  const gitignore = existsSync(join(root, ".gitignore"))
    ? (await import("node:fs")).readFileSync(join(root, ".gitignore"), "utf8")
    : "";
  checks.push({
    name: "VCS hygiene",
    ok: gitignore.includes("node_modules"),
    detail: gitignore.includes("node_modules") ? ".gitignore covers node_modules" : "add node_modules to .gitignore",
      fix: gitignore.includes("node_modules")
        ? undefined
        : () => {
            appendFileSync(join(root, ".gitignore"), "\nnode_modules\n");
          },
  });

  let failures = 0;
  for (const c of checks) {
    if (c.ok) {
      log.success(`${c.name}: ${colors.dim(c.detail)}`);
    } else {
      failures++;
      if (fix && c.fix) {
        c.fix();
        log.success(`${icons.wrench} Fixed ${colors.bold(c.name)}.`);
      } else {
        log.error(`${c.name}: ${c.detail}`);
      }
    }
  }

  if (failures === 0) {
    log.success(`${icons.shield} Your environment is healthy.`);
    return 0;
  }
  if (fix) {
    log.success(`${icons.wrench} Doctor applied ${failures} fix(es).`);
    return 0;
  }
  log.warn(`Found ${failures} issue(s). Run ${colors.bold("rahulchaube doctor --fix")} to repair.`);
  return 1;
}
