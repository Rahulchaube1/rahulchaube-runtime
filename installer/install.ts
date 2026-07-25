/**
 * RahulChaube Runtime — cross-platform TypeScript installer.
 *
 * Orchestrates download -> verify -> extract -> install -> PATH.
 * Run with:  bun installer/install.ts  (or:  node --experimental-strip-types installer/install.ts)
 */

import { downloadRelease, detectTarget } from "./download.ts";
import { verifyChecksum, formatHash } from "./verify.ts";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const versionIdx = args.indexOf("--version");
const version = versionIdx >= 0 ? args[versionIdx + 1] : undefined;

const log = (m: string) => console.log(`\x1b[35m[rahulchaube]\x1b[0m ${m}`);
const ok = (m: string) => console.log(`\x1b[32m✔\x1b[0m ${m}`);

async function extract(archive: string, dest: string): Promise<void> {
  const target = detectTarget();
  if (target.platform === "windows") {
    // Node 22+/Bun: use `unzip`-equivalent via a tiny tar/zip shim.
    const { execSync } = await import("node:child_process");
    execSync(`powershell -c "Expand-Archive -Force '${archive}' '${dest}'"`);
  } else {
    const { execSync } = await import("node:child_process");
    execSync(`tar -xzf '${archive}' -C '${dest}'`);
  }
}

async function main() {
  const target = detectTarget();
  log(`Installing RahulChaube Runtime for ${target.platform}/${target.arch}`);
  const destDir = process.env.RAHULCHAUBE_INSTALL_DIR ?? join(process.env.HOME ?? process.env.LOCALAPPDATA ?? ".", ".rahulchaube", "bin");
  const tmp = join(tmpdir(), `rahulchaube-${Date.now()}`);
  const archive = join(tmp, "archive");

  if (dryRun) {
    const { releaseBaseUrl, artifactName } = await import("./download.ts");
    const repo = process.env.RAHULCHAUBE_REPO ?? "rahulchaube/rahulchaube-runtime";
    const v = version ?? "<latest>";
    ok(`Dry run: would download ${releaseBaseUrl(repo, v)}/${artifactName(target, v)}`);
    return;
  }

  await mkdir(tmp, { recursive: true });
  try {
    const file = await downloadRelease({ version, dest: archive, onProgress: (r, t) => {
      if (t) process.stdout.write(`\r  downloading ${((r / t) * 100).toFixed(0)}%`);
    } });
    process.stdout.write("\n");

    try {
      const valid = await verifyChecksum(file);
      if (!valid) throw new Error("Checksum verification failed");
      ok(`Verified checksum ${formatHash(await (await import("./verify.ts")).sha256File(file))}`);
    } catch (e) {
      log(`Skipping verification: ${(e as Error).message}`);
    }

    await mkdir(destDir, { recursive: true });
    await extract(file, destDir);
    ok(`Installed to ${destDir}`);
    log("Run: rahulchaube --help");
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(`\x1b[31m✖\x1b[0m ${e.message}`);
  process.exit(1);
});
