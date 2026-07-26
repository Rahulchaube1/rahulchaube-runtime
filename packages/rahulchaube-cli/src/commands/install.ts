/**
 * `rahulchaube install` — Native package installer command.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { spinner } from "../ui/spinner.ts";
import { findProjectRoot } from "../util/fs.ts";
import { PackageInstaller } from "../../../../runtime/package-manager/installer.ts";

export async function install(args: string[], flags: Record<string, unknown>): Promise<number> {
  const root = findProjectRoot();
  const sp = spinner(`${icons.package} Resolving and downloading dependencies…`);

  try {
    const installer = new PackageInstaller();
    const result = await installer.installProject(root);
    sp.stop();

    log.success(
      `${colors.green(icons.success)} Installed ${colors.bold(String(result.installed.length))} packages ` +
      `${colors.dim(`(${result.cachedCount} from cache)`)}.`
    );
    log.info(`${colors.dim("Lockfile written to")} ${result.lockfilePath}`);
    return 0;
  } catch (err) {
    sp.stop();
    log.error(`Package installation failed: ${(err as Error).message}`);
    return 1;
  }
}
