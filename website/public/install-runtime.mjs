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

async function readArchive(filename, blob) {
  if (archiveDir) return readFileSync(join(archiveDir, filename));
  if (!/^[a-f0-9]{40}$/.test(blob)) throw new Error("Missing GitHub archive identifier");
  const endpoint = `repos/${repo}/git/blobs/${blob}`;
  // Fetch the exact public Git object identified by the release manifest.
  try {
    const response = await fetch("https://api.github.com/" + endpoint, {
      headers: { Accept: "application/vnd.github.raw+json" }, signal: AbortSignal.timeout(20000),
    });
    if (response.ok) return Buffer.from(await response.arrayBuffer());
  } catch { /* An authenticated CLI can also read restricted or rate-limited archives. */ }
  try {
    return execFileSync("gh", ["api", "--hostname", "github.com", "-H", "Accept: application/vnd.github.raw+json",
      endpoint], { maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    throw new Error("Could not download the release archive from GitHub. Check your connection or sign in with gh auth login and retry.");
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
    console.log("The requested release is available for this platform.");
    return;
  }
  const filename = `runtime-${target}.${os === "win" ? "zip" : "tar.gz"}`;
  const bytes = await readArchive(filename, release.blobs[filename]);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== release.sha256[filename]) throw new Error(`SHA-256 mismatch for ${filename}`);

  const dest = resolve(process.env.RAHULCHAUBE_INSTALL_DIR || join(homedir(), ".rahulchaube"));
  mkdirSync(dest, { recursive: true });
  const stage = mkdtempSync(join(dest, ".install-"));
  let activated = false;
  try {
    writeFileSync(join(stage, filename), bytes);
    const tar = os === "win" ? join(process.env.SystemRoot, "System32", "tar.exe") : "tar";
    execFileSync(tar, ["-xf", join(stage, filename), "-C", stage]);
    const cli = join(stage, "packages/rahulchaube-cli/bin", os === "win" ? "rahulchaube-native.exe" : "rahulchaube-native");
    const native = release.launcher === "blyx";
    const args = native ? ["--version"] : ["run", join(stage, "packages/rahulchaube-cli/bin/rahulchaube.ts"), "--version"];
    const reported = execFileSync(native ? cli : process.execPath, args, {
      encoding: "utf8", env: { ...process.env, NO_COLOR: "1" }
    });
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
