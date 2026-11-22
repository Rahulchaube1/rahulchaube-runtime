// Older shell bootstraps downloaded this JS entry. Forward them to the public
// native installer so an upgrade uses the same checks and layout as a fresh install.
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const windows = process.platform === "win32";
const name = windows ? "install.ps1" : "install.sh";
const origin = process.env.RAHULCHAUBE_INSTALL_ORIGIN || "https://www.rahulchaube.space";
const response = await fetch(new URL(name, origin));
if (!response.ok) throw new Error(`Installer download returned HTTP ${response.status}`);
const stage = mkdtempSync(join(tmpdir(), "rc-bootstrap-"));
try {
  const script = join(stage, name);
  writeFileSync(script, await response.text());
  const child = spawnSync(windows ? "powershell" : "bash",
    [...(windows ? ["-NoProfile", "-File"] : []), script, ...process.argv.slice(2)], { stdio: "inherit" });
  if (child.error) throw child.error;
  process.exitCode = child.status ?? 1;
} finally { rmSync(stage, { recursive: true, force: true }); }
