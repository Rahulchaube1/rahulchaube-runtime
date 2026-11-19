import { nativeFixture } from "./release-fixture.ts";
import { test, expect } from "bun:test";
import { buildReleaseArtifacts, RELEASE_TARGETS } from "../installer/build-release.ts";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";

test("Installer: buildReleaseArtifacts generates all 5 cross-platform targets and checksums.txt", () => {
  const distDir = resolve(process.cwd(), ".tmp_dist_test");
  const fixture = nativeFixture();
  try { buildReleaseArtifacts(".tmp_dist_test", fixture); } finally { rmSync(fixture, { recursive: true, force: true }); }

  for (const t of RELEASE_TARGETS) {
    expect(existsSync(join(distDir, t.archiveName))).toBe(true);
  }

  expect(existsSync(join(distDir, "checksums.txt"))).toBe(true);
  expect(existsSync(join(distDir, "version.json"))).toBe(true);

  const shaContent = readFileSync(join(distDir, "checksums.txt"), "utf-8");
  expect(shaContent).toContain("runtime-win-x64.zip");
  expect(shaContent).toContain("runtime-linux-arm64.tar.gz");

  if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true });
});
