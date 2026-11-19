import { nativeFixture } from "./release-fixture.ts";
import { test, expect } from "bun:test";
import pkg from "../packages/rahulchaube-cli/package.json";
import { GET as getVersion } from "../website/app/api/version/route.ts";
import { buildReleaseArtifacts } from "../installer/build-release.ts";
import { existsSync, rmSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

test("Version API: GET /api/version returns version info with download assets", async () => {
  const res = getVersion();
  expect(res.status).toBe(200);
  const data = (await res.json()) as { version: string; assets: Record<string, string> };
  expect(data.version).toBe(pkg.version);
  expect(data.assets["win-x64"]).toContain("runtime-win-x64.zip");
});

test("Release Generator: buildReleaseArtifacts generates distribution zip and tarballs", () => {
  const targetDir = ".tmp_dist_eng_test";
  const resolved = resolve(process.cwd(), targetDir);
  const fixture = nativeFixture();
  try { buildReleaseArtifacts(targetDir, fixture); } finally { rmSync(fixture, { recursive: true, force: true }); }
  expect(existsSync(join(resolved, "runtime-win-x64.zip"))).toBe(true);
  expect(existsSync(join(resolved, "runtime-linux-x64.tar.gz"))).toBe(true);
  expect(existsSync(join(resolved, "checksums.txt"))).toBe(true);
  expect(existsSync(join(resolved, "version.json"))).toBe(true);
  expect(readFileSync(join(resolved, "runtime-win-x64.zip")).subarray(0, 2).toString()).toBe("PK");
  if (existsSync(resolved)) rmSync(resolved, { recursive: true, force: true });
});
