/**
 * RahulChaube Runtime — Official Release Asset Generator.
 *
 * Produces clean-room distribution archives:
 * - runtime-win-x64.zip
 * - runtime-linux-x64.tar.gz
 * - runtime-linux-arm64.tar.gz
 * - runtime-darwin-x64.tar.gz
 * - runtime-darwin-arm64.tar.gz
 * - checksums.txt
 * - version.json
 */
import { createHash } from "node:crypto";
import { chmodSync, renameSync, mkdtempSync, writeFileSync, mkdirSync, rmSync, cpSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";

import { tmpdir } from "node:os";


export interface TargetConfig {
  name: string;
  os: "windows" | "linux" | "darwin";
  arch: "x64" | "arm64";
  archiveName: string;
  isZip: boolean;
}

export const RELEASE_TARGETS: TargetConfig[] = [
  { name: "win-x64", os: "windows", arch: "x64", archiveName: "runtime-win-x64.zip", isZip: true },
  { name: "linux-x64", os: "linux", arch: "x64", archiveName: "runtime-linux-x64.tar.gz", isZip: false },
  { name: "linux-arm64", os: "linux", arch: "arm64", archiveName: "runtime-linux-arm64.tar.gz", isZip: false },
  { name: "darwin-x64", os: "darwin", arch: "x64", archiveName: "runtime-darwin-x64.tar.gz", isZip: false },
  { name: "darwin-arm64", os: "darwin", arch: "arm64", archiveName: "runtime-darwin-arm64.tar.gz", isZip: false },
];

export function buildReleaseArtifacts(outputDir: string = "dist", nativeDir: string = ".native-artifacts"): void {
  const rootDir = process.cwd();
  const distPath = resolve(rootDir, outputDir);
  mkdirSync(distPath, { recursive: true });
  const stagingDir = mkdtempSync(join(tmpdir(), "rahul-release-"));

  const version = readFileSync(join(rootDir, "native/VERSION"), "utf8").trim();
  const stageBin = join(stagingDir, "bin");
  mkdirSync(stageBin);
  cpSync(join(rootDir, "LICENSE.md"), join(stagingDir, "LICENSE.md"));
  cpSync(join(rootDir, "licenses"), join(stagingDir, "licenses"), {
    recursive: true, filter: path => !path.endsWith("Bun-notices.md"),
  });

  // Finish every platform archive before replacing any previously built distribution.
  const complete = mkdtempSync(join(distPath, ".build-"));
  const checksums: Record<string, string> = {};
  const sizes: Record<string, number> = {};
  const blobs: Record<string, string> = {};
  try {
    for (const t of RELEASE_TARGETS) {
      const archivePath = join(complete, t.archiveName);
      const rc = t.isZip ? "rc.exe" : "rc";
      rmSync(join(stageBin, t.isZip ? "rc" : "rc.exe"), { force: true });
      cpSync(resolve(nativeDir, "native-" + t.name, rc), join(stageBin, rc));
      chmodSync(join(stageBin, rc), 0o755);
      if (t.isZip && process.platform !== "win32") {
        execFileSync("zip", ["-qr", archivePath, "."], { cwd: stagingDir });
      } else {
        const args = t.isZip ? ["-a", "-cf"] : ["-czf"];
        execFileSync("tar", [...args, archivePath, "-C", stagingDir, "."]);
      }
      const bytes = readFileSync(archivePath);
      checksums[t.archiveName] = createHash("sha256").update(bytes).digest("hex");
      sizes[t.archiveName] = bytes.length;
      blobs[t.archiveName] = execFileSync("git", ["hash-object", "--no-filters", archivePath], { encoding: "utf8" }).trim();
    }
    for (const target of RELEASE_TARGETS) {
      renameSync(join(complete, target.archiveName), join(distPath, target.archiveName));
    }
  } finally {
    rmSync(complete, { recursive: true, force: true });
    rmSync(stagingDir, { recursive: true, force: true });
  }

  // Write checksums.txt & SHA256SUMS
  const checksumLines = Object.entries(checksums).map(([f, hash]) => `${hash}  ${f}`).join("\n");
  writeFileSync(join(distPath, "checksums.txt"), checksumLines, "utf-8");
  writeFileSync(join(distPath, "SHA256SUMS"), checksumLines, "utf-8");

  // Write version.json
  const downloadUrl = `https://raw.githubusercontent.com/Rahulchaube1/rahulchaube-runtime/v${version}/dist`;
  writeFileSync(join(distPath, "VERSION"), version + "\n");
  const versionJson = {
    version,
    channel: "stable",
    launcher: "rc",
    release: "https://www.rahulchaube.space/releases",
    downloadUrl,
    assets: Object.fromEntries(RELEASE_TARGETS.map(t => [t.name, `${downloadUrl}/${t.archiveName}`])),
    sha256: checksums,
    sizes,
    blobs,
  };
  const manifest = JSON.stringify(versionJson, null, 2) + "\n";
  writeFileSync(join(distPath, "version.json"), manifest);
  if (distPath === resolve(rootDir, "dist")) {
    writeFileSync(join(rootDir, "website/lib/release-manifest.json"), manifest);
  }
}

if (import.meta.main) {
  buildReleaseArtifacts();
  console.log("Release artifacts generated successfully in dist/");
}
