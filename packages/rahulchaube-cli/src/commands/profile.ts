/**
 * `rahulchaube profile <script>` — Run script under profiler.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { RuntimeProfiler } from "../../../../runtime/profiler/index.ts";
import { runScript } from "../../../../runtime/engine/runner.ts";

export async function profileCommand(args: string[], _flags: Record<string, unknown>): Promise<number> {
  const target = args[0];
  if (!target) {
    log.error("No script specified for profiling.");
    log.info("Usage: rahulchaube profile <script.ts>");
    return 1;
  }

  const absPath = resolve(process.cwd(), target);
  if (!existsSync(absPath)) {
    log.error(`File not found: ${absPath}`);
    return 1;
  }

  log.info(`${colors.cyan(icons.bolt)} Profiling execution of ${colors.bold(target)}…`);

  const profiler = new RuntimeProfiler();
  profiler.start();

  const result = await runScript(absPath);
  const report = profiler.stop(absPath);

  log.plain(profiler.formatReport(report));

  return result.success ? 0 : 1;
}
