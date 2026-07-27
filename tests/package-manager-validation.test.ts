/**
 * RahulChaube Runtime — Package Manager Validation Suite (Phase 8).
 */
import { test, expect } from "bun:test";
import { PackageInstaller } from "../runtime/package-manager/installer.ts";
import { RegistryClient } from "../runtime/registry/client.ts";
import { LockfileManager } from "../runtime/package-manager/lockfile.ts";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
import { rmSync, existsSync, mkdirSync, readFileSync } from "node:fs";

const PKG_TEST_DIR = resolve(process.cwd(), ".tmp_pkg_validation_test");

function setupPkgTestDir() {
  if (existsSync(PKG_TEST_DIR)) rmSync(PKG_TEST_DIR, { recursive: true, force: true });
  mkdirSync(PKG_TEST_DIR, { recursive: true });
}

function cleanupPkgTestDir() {
  if (existsSync(PKG_TEST_DIR)) rmSync(PKG_TEST_DIR, { recursive: true, force: true });
}

test("Package Manager: Resolves metadata for real package names via RegistryClient", async () => {
  const client = new RegistryClient();
  const pkgList = ["lodash", "chalk", "react", "express", "zod", "commander"];

  for (const pkgName of pkgList) {
    const pkg = await client.getPackage(pkgName);
    expect(pkg.name).toBe(pkgName);
    expect(pkg.versions).toBeDefined();
    expect(pkg["dist-tags"].latest).toBeDefined();
  }
});

test("Package Manager: Lockfile generation and offline installation mode", () => {
  setupPkgTestDir();
  const lockfile = LockfileManager.create({
    lodash: {
      version: "4.17.21",
      resolved: "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      integrity: "sha512-v2kDEeAsHw+tUtS88zxk09L7511N6TD1g8a48V6z8+5v=",
    },
  });

  const path = LockfileManager.write(PKG_TEST_DIR, lockfile);
  expect(existsSync(path)).toBe(true);

  const readData = LockfileManager.read(PKG_TEST_DIR);
  expect(readData).not.toBeNull();
  expect(readData?.packages.lodash.version).toBe("4.17.21");

  cleanupPkgTestDir();
});

test("Package Manager: SHA checksum integrity verification helper", () => {
  const installer = new PackageInstaller();
  const data = Buffer.from("RahulChaube Integrity Test");
  const expectedSha1 = createHash("sha1").update(data).digest("hex");

  expect(() => installer.verifyShasum(data, expectedSha1)).not.toThrow();
  expect(() => installer.verifyShasum(data, "0000000000000000000000000000000000000000")).toThrow();
});
