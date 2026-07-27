/**
 * `rahulchaube uninstall` — Uninstalls ~/.rahulchaube installation.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync, rmSync } from "node:fs";

export async function uninstallCommand(_args: string[], _flags: Record<string, unknown>): Promise<number> {
  const installDir = join(homedir(), ".rahulchaube");

  if (!existsSync(installDir)) {
    log.info("RahulChaube Runtime is not currently installed in ~/.rahulchaube.");
    return 0;
  }

  log.info(`${colors.yellow(icons.warning)} Uninstalling RahulChaube Runtime from ${colors.bold(installDir)}…`);

  try {
    rmSync(installDir, { recursive: true, force: true });
    log.success(`${colors.green(icons.success)} Uninstalled RahulChaube Runtime successfully.`);
    log.info(`${colors.dim("Tip: You can manually remove ~/.rahulchaube/bin from your PATH environment variable.")}`);
    return 0;
  } catch (err) {
    log.error(`Failed to remove ${installDir}: ${String(err)}`);
    return 1;
  }
}
