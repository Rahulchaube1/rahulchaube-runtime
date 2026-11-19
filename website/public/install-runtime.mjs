// Shared by the Bash, PowerShell, and repository installers. Run with Bun.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";

const origin = process.env.RAHULCHAUBE_INSTALL_ORIGIN || "https://www.rahulchaube.space";
const archiveDir = process.env.RAHULCHAUBE_INSTALL_ARCHIVE_DIR;
const repo = "Rahulchaube1/rahulchaube-runtime";

async function getRelease() {
  if (archiveDir) return JSON.parse(readFileSync(join(archiveDir, "version.json"), "utf8"));
  const response = await fetch(new URL("/api/version", origin));
  if (!response.ok) throw new Error(`Release lookup failed (HTTP ${response.status})`);
  return response.json();
}

function readArchive(filename, blob) {
  if (archiveDir) return readFileSync(join(archiveDir, filename));
  if (!/^[a-f0-9]{40}$/.test(blob)) throw new Error("Missing GitHub archive identifier");
  try {
    // GitHub authenticates the visitor and enforces the repository's access controls.
    return execFileSync("gh", ["api", "--hostname", "github.com", "-H", "Accept: application/vnd.github.raw+json",
      `repos/${repo}/git/blobs/${blob}`], { maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    throw new Error("This archive requires repository access. Sign in with gh auth login and retry.");
  }
}

function activate(stage, dest) {
  const lock = join(dest, ".install-lock");
  mkdirSync(lock);
  const updated = [];
  try {
    for (const path of ["runtime", "packages/rahulchaube-cli", "bin/rahulchaube", "bin/rahulchaube.cmd", "LICENSE.md"]) {
      const to = join(dest, path);
      mkdirSync(dirname(to), { recursive: true });
      const backup = existsSync(to) ? join(stage, `previous-${updated.length}`) : null;
      if (backup) renameSync(to, backup);
      updated.push({ to, backup });
      renameSync(join(stage, path), to);
    }
  } catch (error) {
    for (const { to, backup } of updated.reverse()) {
      rmSync(to, { recursive: true, force: true });
      if (backup) renameSync(backup, to);
    }
    throw error;
  } finally {
    rmSync(lock, { recursive: true });
  }
}

async function install() {
  const os = process.platform === "win32" ? "win" : process.platform;
  const target = `${os}-${process.arch}`;
  const release = await getRelease();
  if (!/^\d+\.\d+\.\d+$/.test(release.version)) throw new Error("Invalid release version");
  const requested = process.argv.indexOf("--version");
  if (requested >= 0 && process.argv[requested + 1]?.replace(/^v/, "") !== release.version) {
    throw new Error(`This installer provides v${release.version}`);
  }
  if (!Object.hasOwn(release.assets, target)) throw new Error(`No release archive for ${target}`);
  if (process.argv.includes("--dry-run")) {
    console.log(`v${release.version} for ${target}`);
    return;
  }
  const filename = `runtime-${target}.${os === "win" ? "zip" : "tar.gz"}`;
  const bytes = readArchive(filename, release.blobs[filename]);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== release.sha256[filename]) throw new Error(`SHA-256 mismatch for ${filename}`);

  const dest = resolve(process.env.RAHULCHAUBE_INSTALL_DIR || join(homedir(), ".rahulchaube"));
  mkdirSync(dest, { recursive: true });
  const stage = mkdtempSync(join(dest, ".install-"));
  let activated = false;
  try {
    writeFileSync(join(stage, filename), bytes);
    execFileSync("tar", ["-xf", join(stage, filename), "-C", stage]);
    const cli = join(stage, "packages/rahulchaube-cli/bin/rahulchaube.ts");
    const reported = execFileSync(process.execPath, ["run", cli, "--version"], { encoding: "utf8" });
    if (!reported.trim().endsWith(`v${release.version}`)) throw new Error("Archive version check failed");
    activate(stage, dest);
    activated = true;
    console.log(`Installed RahulChaube Runtime v${release.version}`);
  } finally {
    // Keep any backups still needed if the OS interrupted rollback.
    if (activated || !readdirSync(stage).some(name => name.startsWith("previous-"))) {
      rmSync(stage, { recursive: true, force: true });
    }
  }
}

try {
  await install();
} catch (error) {
  console.error("Installation failed:", JSON.stringify(error.message));
  process.exitCode = 1;
}
