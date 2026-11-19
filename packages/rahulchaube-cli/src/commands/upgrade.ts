import { spawnSync } from "node:child_process";
import { log } from "../ui/logger.ts";
import cliPackage from "../../package.json";

export async function upgradeCommand(): Promise<number> {
  const response = await fetch("https://www.rahulchaube.space/api/version");
  if (!response.ok) throw new Error(`Version lookup failed (HTTP ${response.status})`);
  const { version } = await response.json() as { version: string };
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Invalid release version");
  const current = cliPackage.version.split(".").map(Number);
  const difference = version.split(".").map((v, i) => Number(v) - current[i]).find(delta => delta !== 0);
  if (!difference || difference < 0) {
    log.info(`Installed v${cliPackage.version} is up to date.`);
    return 0;
  }
  const windows = process.platform === "win32";
  const command = windows ? "powershell" : "bash";
  const args = windows
    ? ["-NoProfile", "-Command", "irm https://www.rahulchaube.space/install.ps1 | iex"]
    : ["-o", "pipefail", "-c", "curl -fsSL https://www.rahulchaube.space/install | bash"];
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  return result.status ?? 1;
}
