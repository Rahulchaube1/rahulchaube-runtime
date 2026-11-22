// Run the same native bootstrap used by the public installation commands.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const windows = process.platform === "win32";
const script = fileURLToPath(new URL(windows ? "../website/public/install.ps1" : "../website/public/install.sh", import.meta.url));
const result = spawnSync(windows ? "powershell" : "bash",
  [...(windows ? ["-NoProfile", "-File"] : []), script, ...process.argv.slice(2)], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
