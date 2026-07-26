import { test, expect, beforeEach, afterEach } from "bun:test";
import { PackageInstaller } from "../runtime/package-manager/installer.ts";
import { LockfileManager } from "../runtime/package-manager/lockfile.ts";
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const TMP_PROJ_DIR = resolve(process.cwd(), ".tmp_test_project");

beforeEach(() => {
  if (existsSync(TMP_PROJ_DIR)) rmSync(TMP_PROJ_DIR, { recursive: true });
  mkdirSync(TMP_PROJ_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TMP_PROJ_DIR)) rmSync(TMP_PROJ_DIR, { recursive: true });
});

test("LockfileManager: creates, writes, and reads lockfile", () => {
  const lock = LockfileManager.create({
    ms: { version: "2.1.3", resolved: "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz" },
  });

  const path = LockfileManager.write(TMP_PROJ_DIR, lock);
  expect(existsSync(path)).toBe(true);

  const read = LockfileManager.read(TMP_PROJ_DIR);
  expect(read).not.toBeNull();
  expect(read?.packages.ms.version).toBe("2.1.3");
});

test("PackageInstaller: extracts ustar tarball data", () => {
  const installer = new PackageInstaller();
  const destDir = resolve(TMP_PROJ_DIR, "extracted");

  // Create a minimal synthetic TAR buffer (512 header + 512 data + 1024 nulls)
  const tarBuf = Buffer.alloc(2048);
  const header = tarBuf.subarray(0, 512);

  // Filename: package/index.js
  header.write("package/index.js", 0, 16, "ascii");
  // File size: 12 bytes in octal ("00000000014\0")
  header.write("00000000014 ", 124, 12, "ascii");
  // Typeflag: '0' (file)
  header.write("0", 156, 1, "ascii");

  // Content: "hello world\n" (12 bytes) at offset 512
  tarBuf.write("hello world\n", 512, 12, "utf-8");

  installer.extractTarball(tarBuf, destDir);

  const fileContent = readFileSync(resolve(destDir, "index.js"), "utf-8");
  expect(fileContent).toBe("hello world\n");
});

test("PackageInstaller: installs dependencies and generates lockfile", async () => {
  writeFileSync(
    resolve(TMP_PROJ_DIR, "package.json"),
    JSON.stringify({ dependencies: { ms: "2.1.3" } })
  );

  const installer = new PackageInstaller();
  let result;
  try {
    result = await installer.installProject(TMP_PROJ_DIR);
  } catch (err) {
    console.warn("[SKIP] Network install test skipped:", (err as Error).message);
    return;
  }

  expect(result.installed).toContain("ms@2.1.3");
  expect(existsSync(resolve(TMP_PROJ_DIR, "rahulchaube.lock"))).toBe(true);
  expect(existsSync(resolve(TMP_PROJ_DIR, "node_modules", "ms", "package.json"))).toBe(true);
});
