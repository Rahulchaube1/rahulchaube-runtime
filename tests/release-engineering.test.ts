import { nativeFixture } from "./release-fixture.ts";
import { test, expect } from "bun:test";
import { GET as getVersion } from "../website/app/api/version/route.ts";
import { buildReleaseArtifacts } from "../installer/build-release.ts";
import { existsSync, rmSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

test("Version API: GET /api/version returns version info with download assets", async () => {
  const res = getVersion();
  expect(res.status).toBe(200);
  const data = (await res.json()) as { version: string; assets: Record<string, string> };
  expect(data.version).toBe(readFileSync("native/VERSION", "utf8").trim());
  expect(data.assets["win-x64"]).toContain("runtime-win-x64.zip");
});

test("package managers select the native archives and checksums for the stable release", () => {
  const manifest = JSON.parse(readFileSync("dist/version.json", "utf8"));
  const releaseUrl = `https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v${manifest.version}`;
  const formula = readFileSync("Formula/rc-runtime.rb", "utf8");
  expect(formula).toContain(`version "${manifest.version}"`);
  const formulas = [...formula.matchAll(/url "([^"]+)"\s+sha256 "([a-f0-9]+)"/g)];
  expect(formulas).toHaveLength(4);
  const urls = new Map(formulas.map(([, url, sha]) => [url.replace("#{version}", manifest.version), sha]));
  for (const platform of ["darwin-arm64", "darwin-x64", "linux-arm64", "linux-x64"]) {
    const filename = `runtime-${platform}.tar.gz`;
    expect(urls.get(`${releaseUrl}/${filename}`)).toBe(manifest.sha256[filename]);
  }

  const filename = "runtime-win-x64.zip";
  const scoop = JSON.parse(readFileSync("bucket/rc-runtime.json", "utf8"));
  expect(scoop.version).toBe(manifest.version);
  expect(scoop.architecture["64bit"]).toEqual({ url: `${releaseUrl}/${filename}`, hash: manifest.sha256[filename] });
  const folder = join("packaging", "winget", manifest.version);
  const installer = Bun.YAML.parse(readFileSync(join(folder, "RahulChaube.RCRuntime.installer.yaml"), "utf8")) as {
    PackageVersion: string;
    Installers: { Architecture: string; InstallerUrl: string; InstallerSha256: string }[];
    NestedInstallerFiles: { RelativeFilePath: string; PortableCommandAlias: string }[];
  };
  expect(installer.PackageVersion).toBe(manifest.version);
  expect(installer.Installers).toEqual([{
    Architecture: "x64", InstallerUrl: `${releaseUrl}/${filename}`, InstallerSha256: manifest.sha256[filename].toUpperCase(),
  }]);
  expect(installer.NestedInstallerFiles).toEqual([{ RelativeFilePath: scoop.bin, PortableCommandAlias: manifest.launcher }]);
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
