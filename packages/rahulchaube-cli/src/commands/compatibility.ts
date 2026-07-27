/**
 * `rahulchaube compatibility` — CLI command to run real compatibility test projects.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { resolve, join } from "node:path";
import { readdirSync, existsSync, statSync } from "node:fs";
import { runScript } from "../../../../runtime/engine/runner.ts";

export interface ProjectCompatResult {
  name: string;
  status: "PASS" | "PARTIAL" | "FAIL";
  durationMs: number;
}

export async function compatibilityCommand(_args: string[], _flags: Record<string, unknown>): Promise<number> {
  log.info(`${colors.cyan(icons.lightning)} Running Real Compatibility Test Projects…\n`);

  const compatDir = resolve(process.cwd(), "compatibility");
  if (!existsSync(compatDir)) {
    log.error(`Compatibility directory not found at ${compatDir}`);
    return 1;
  }

  const entries = readdirSync(compatDir);
  const projects = entries.filter((e) => {
    const p = join(compatDir, e);
    return statSync(p).isDirectory() && existsSync(join(p, "index.ts"));
  });

  const results: ProjectCompatResult[] = [];
  let passedCount = 0;

  for (const proj of projects) {
    const scriptPath = join(compatDir, proj, "index.ts");
    const start = performance.now();

    try {
      const res = await runScript(scriptPath);
      const durationMs = performance.now() - start;

      if (res.success && res.exitCode === 0) {
        results.push({ name: proj, status: "PASS", durationMs });
        passedCount++;
      } else {
        results.push({ name: proj, status: "FAIL", durationMs });
      }
    } catch {
      const durationMs = performance.now() - start;
      results.push({ name: proj, status: "FAIL", durationMs });
    }
  }

  log.plain("Framework / Tool | Status  | Time (ms)");
  log.plain("-----------------|---------|----------");
  for (const r of results) {
    const nameStr = (r.name.charAt(0).toUpperCase() + r.name.slice(1)).padEnd(16, " ");
    const statusStr = r.status === "PASS"
      ? colors.green("PASS   ")
      : r.status === "PARTIAL"
      ? colors.yellow("PARTIAL")
      : colors.red("FAIL   ");
    const timeStr = r.durationMs.toFixed(2).padStart(8, " ");
    log.plain(`${nameStr} | ${statusStr} | ${timeStr}`);
  }

  log.plain("\n-------------------------------------------");
  log.plain(`Total Projects: ${results.length}`);
  log.plain(`Passed:         ${passedCount}`);
  log.plain(`Failed:         ${results.length - passedCount}`);
  log.plain("-------------------------------------------\n");

  return passedCount === results.length ? 0 : 1;
}
