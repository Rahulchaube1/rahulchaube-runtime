import { test, expect } from "bun:test";
import { buildReleaseArtifacts, TARGETS } from "../installer/build-release.ts";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";

test("Installer: buildReleaseArtifacts generates all 5 cross-platform targets and SHA256SUMS", () => {
  const distDir = resolve(process.cwd(), ".tmp_dist_test");
  buildReleaseArtifacts(distDir);

  for (const t of TARGETS) {
    expect(existsSync(join(distDir, t.binaryName))).toBe(true);
  }

  expect(existsSync(join(distDir, "SHA256SUMS"))).toBe(true);
  expect(existsSync(join(distDir, "RELEASE_NOTES.md"))).toBe(true);

  const shaContent = readFileSync(join(distDir, "SHA256SUMS"), "utf-8");
  expect(shaContent).toContain("rahulchaube-windows-x64.exe");
  expect(shaContent).toContain("rahulchaube-linux-arm64");

  if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true });
});
