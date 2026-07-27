import { test, expect } from "bun:test";
import { GET as getVersion } from "../website/app/api/version/route.ts";
import { GET as getPs1 } from "../website/app/install.ps1/route.ts";
import { GET as getPosix } from "../website/app/install/route.ts";
import { buildReleaseArtifacts } from "../installer/build-release.ts";
import { existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

test("Version API: GET /api/version returns version info with download assets", async () => {
  const res = getVersion();
  expect(res.status).toBe(200);
  const data = (await res.json()) as { version: string; assets: Record<string, string> };
  expect(data.version).toBe("1.0.0");
  expect(data.assets["win-x64"]).toContain("runtime-win-x64.zip");
});

test("Release Generator: buildReleaseArtifacts generates distribution zip and tarballs", () => {
  const targetDir = ".tmp_dist_eng_test";
  const resolved = resolve(process.cwd(), targetDir);
  buildReleaseArtifacts(targetDir);
  expect(existsSync(join(resolved, "runtime-win-x64.zip"))).toBe(true);
  expect(existsSync(join(resolved, "runtime-linux-x64.tar.gz"))).toBe(true);
  expect(existsSync(join(resolved, "checksums.txt"))).toBe(true);
  expect(existsSync(join(resolved, "version.json"))).toBe(true);
  if (existsSync(resolved)) rmSync(resolved, { recursive: true, force: true });
});

test("PowerShell Installer Route: downloads release assets without local repo paths", async () => {
  const res = getPs1();
  const script = await res.text();
  expect(script).toContain("github.com/Rahulchaube1/rahulchaube-runtime/releases/download");
  expect(script).toContain("Get-FileHash");
  expect(script).not.toContain("$PWD");
  expect(script).not.toContain("Copy-Item");
});

test("POSIX Bash Installer Route: downloads release tarballs without local repo paths", async () => {
  const res = getPosix();
  const script = await res.text();
  expect(script).toContain("github.com/Rahulchaube1/rahulchaube-runtime/releases/download");
  expect(script).toContain("sha256sum");
  expect(script).not.toContain("$PWD");
  expect(script).not.toContain("cp -r");
});
