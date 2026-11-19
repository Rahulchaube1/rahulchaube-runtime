// Shared by the Bash, PowerShell, and repository installers. Run with Bun.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";

const origin = process.env.RAHULCHAUBE_INSTALL_ORIGIN || "https://www.rahulchaube.space";
const repo = "Rahulchaube1/rahulchaube-runtime";

async function getArchive(url, blob) {
  const res = await fetch(url);
  if (res.ok) return Buffer.from(await res.arrayBuffer());
  if (![401, 403, 404].includes(res.status) || new URL(url).hostname !== "github.com") {
    throw new Error(`Archive download failed (HTTP ${res.status})`);
  }
  if (!/^[a-f0-9]{40}$/.test(blob)) throw new Error("Missing GitHub archive identifier");
  try {
    return execFileSync("gh", ["api", "--hostname", "github.com", "-H", "Accept: application/vnd.github.raw+json",
      `repos/${repo}/git/blobs/${blob}`], { maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    throw new Error("This archive requires repository access. Sign in with gh auth login and retry.");
  }
}

async function install() {
  const os = process.platform === "win32" ? "win" : process.platform;
  const target = `${os}-${process.arch}`;
  const metadata = await fetch(new URL("/api/version", origin));
  if (!metadata.ok) throw new Error(`Release lookup failed (HTTP ${metadata.status})`);
  const release = await metadata.json();
  const url = release.assets[target];
  const requested = process.argv.indexOf("--version");
  if (requested >= 0 && process.argv[requested + 1]?.replace(/^v/, "") !== release.version) {
    throw new Error(`This installer provides v${release.version}`);
  }
  if (!url) throw new Error(`No release archive for ${target}`);
  if (process.argv.includes("--dry-run")) {
    console.log(`v${release.version} for ${target}: ${url}`);
    return;
  }

  const filename = `runtime-${target}.${os === "win" ? "zip" : "tar.gz"}`;
  const expected = release.sha256[filename];
  if (!/^[a-f0-9]{64}$/i.test(expected ?? "")) throw new Error(`Missing SHA-256 for ${filename}`);
  const bytes = await getArchive(url, release.blobs?.[filename]);
  if (createHash("sha256").update(bytes).digest("hex") !== expected.toLowerCase()) {
    throw new Error(`SHA-256 mismatch for ${filename}`);
  }

  const dest = resolve(process.env.RAHULCHAUBE_INSTALL_DIR || join(homedir(), ".rahulchaube"));
  mkdirSync(dest, { recursive: true });
  const stage = mkdtempSync(join(dest, ".install-"));
  const lock = join(dest, ".install-lock");
  let locked = false;
  let keepBackup = false;
  try {
    writeFileSync(join(stage, filename), bytes);
    execFileSync("tar", ["-xf", join(stage, filename), "-C", stage]);
    const cli = join(stage, "packages/rahulchaube-cli/bin/rahulchaube.ts");
    const reported = execFileSync("bun", ["run", cli, "--version"], { encoding: "utf8" });
    if (!reported.trim().endsWith(`v${release.version}`)) throw new Error("Archive version check failed");

    mkdirSync(lock);
    locked = true;
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
      keepBackup = true;
      for (const { to, backup } of updated.reverse()) {
        rmSync(to, { recursive: true, force: true });
        if (backup) renameSync(backup, to);
      }
      keepBackup = false;
      throw error;
    }
    console.log(`Installed RahulChaube Runtime v${release.version} in ${dest}`);
  } finally {
    if (locked) rmSync(lock, { recursive: true });
    if (!keepBackup) rmSync(stage, { recursive: true, force: true });
  }
}

try {
  await install();
} catch (error) {
  console.error(`Installation failed: ${error.message}`);
  process.exitCode = 1;
}
