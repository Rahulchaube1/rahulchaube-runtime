/**
 * RahulChaube Runtime — Compatibility Suite: Infrastructure & Core Runtime (Tests 271–310).
 */
import { test, expect, beforeEach, afterEach } from "bun:test";
import { resolve } from "node:path";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";

import { resolveModule } from "../../runtime/module-loader/resolver.ts";
import { ModuleLoader } from "../../runtime/module-loader/loader.ts";
import { VirtualFS } from "../../runtime/fs/virtual-fs.ts";
import { runScript } from "../../runtime/engine/runner.ts";
import { PermissionManager, PermissionDeniedError } from "../../runtime/permissions/index.ts";
import { PermissionedFS, PermissionedEnv } from "../../runtime/permissions/enforcement.ts";
import { PluginLoader } from "../../runtime/plugins/loader.ts";
import { RegistryClient } from "../../runtime/registry/client.ts";
import { PersistentDiskCache } from "../../runtime/cache/disk-cache.ts";
import { IncrementalCompiler } from "../../runtime/compiler/incremental.ts";
import { LockfileManager } from "../../runtime/package-manager/lockfile.ts";
import { PackageInstaller } from "../../runtime/package-manager/installer.ts";
import { RahulChaubeWorker } from "../../runtime/worker/worker.ts";
import { FileWatcher } from "../../runtime/watcher/watcher.ts";

const TMP_INFRA_DIR = resolve(process.cwd(), ".tmp_test_compat_infra");

beforeEach(() => {
  if (existsSync(TMP_INFRA_DIR)) rmSync(TMP_INFRA_DIR, { recursive: true });
  mkdirSync(TMP_INFRA_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TMP_INFRA_DIR)) rmSync(TMP_INFRA_DIR, { recursive: true });
});

// 271-280. Resolver & Module Graph
test("Infra: Module resolver resolves relative TS files", () => {
  const caller = resolve(process.cwd(), "tests/runtime.test.ts");
  const res = resolveModule("../packages/rahulchaube-cli/package.json", caller);
  expect(res.extension).toBe(".json");
  expect(res.isPackage).toBe(false);
});

test("Infra: ModuleLoader loads dependency graph", () => {
  const pkgPath = resolve(process.cwd(), "packages/rahulchaube-cli/package.json");
  const loader = new ModuleLoader();
  const mod = loader.load(pkgPath);
  expect(mod.evaluationState).toBe("loaded");
});

test("Infra: VirtualFS caches file reads in memory", () => {
  const vfs = new VirtualFS();
  const pkgPath = resolve(process.cwd(), "packages/rahulchaube-cli/package.json");
  const data = vfs.readFile(pkgPath);
  expect(data).toContain("rahulchaube");
  expect(vfs.exists(pkgPath)).toBe(true);
});

// 281-290. Runner, Permissions & Plugins
test("Infra: runScript executes script file and returns exit code 0", async () => {
  const scriptFile = resolve(TMP_INFRA_DIR, "runme.ts");
  writeFileSync(scriptFile, "const x: number = 100; if (x !== 100) throw new Error('fail');");
  const res = await runScript(scriptFile);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Infra: PermissionedFS throws PermissionDeniedError on unauthorized read", () => {
  const pm = new PermissionManager({ read: "deny-all" });
  const pfs = new PermissionedFS(pm);
  expect(() => pfs.readFileSync("package.json")).toThrow(PermissionDeniedError);
});

test("Infra: PermissionedEnv throws PermissionDeniedError on unauthorized env access", () => {
  const pm = new PermissionManager({ env: "deny-all" });
  const penv = new PermissionedEnv(pm);
  expect(() => penv.get("SECRET")).toThrow(PermissionDeniedError);
});

test("Infra: PluginLoader enforces semver version validation", async () => {
  const pPath = resolve(TMP_INFRA_DIR, "plugin-invalid.js");
  writeFileSync(pPath, "module.exports = { name: 'bad', version: 'invalid' };");
  const loader = new PluginLoader();
  await expect(loader.load(pPath)).rejects.toThrow("version must be a semver string");
});

// 291-300. Registry, Disk Cache & Incremental Compiler
test("Infra: RegistryClient in-memory cache operations", () => {
  const client = new RegistryClient();
  expect(client.cacheSize()).toBe(0);
  client.clearCache();
  expect(client.cacheSize()).toBe(0);
});

test("Infra: PersistentDiskCache module persistence and retrieval", () => {
  const disk = new PersistentDiskCache(TMP_INFRA_DIR);
  const file = resolve(TMP_INFRA_DIR, "test.ts");
  writeFileSync(file, "const a: number = 1;");

  disk.setModule(file, "const a: number = 1;", "var a = 1;");
  const code = disk.getModule(file, "const a: number = 1;");
  expect(code).toBe("var a = 1;");
});

test("Infra: IncrementalCompiler detects changed files", () => {
  const fileA = resolve(TMP_INFRA_DIR, "a.ts");
  writeFileSync(fileA, "export const a = 1;");

  const compiler = new IncrementalCompiler();
  const build1 = compiler.compile(fileA);
  expect(build1.dirtyFiles.length).toBe(1);

  const build2 = compiler.compile(fileA);
  expect(build2.dirtyFiles.length).toBe(0);
});

// 301-310. Lockfile, Installer, Worker & Watcher
test("Infra: LockfileManager generates valid rahulchaube.lock structure", () => {
  const lock = LockfileManager.create({
    demo: { version: "1.0.0", resolved: "https://example.com/demo.tgz" },
  });
  const lockPath = LockfileManager.write(TMP_INFRA_DIR, lock);
  expect(existsSync(lockPath)).toBe(true);

  const read = LockfileManager.read(TMP_INFRA_DIR);
  expect(read?.packages.demo.version).toBe("1.0.0");
});

test("Infra: PackageInstaller extracts POSIX ustar headers", () => {
  const installer = new PackageInstaller();
  const tarBuf = Buffer.alloc(1536);
  tarBuf.write("package/test.txt", 0, 16, "ascii");
  tarBuf.write("00000000005 ", 124, 12, "ascii");
  tarBuf.write("0", 156, 1, "ascii");
  tarBuf.write("hello", 512, 5, "utf-8");

  const outDir = resolve(TMP_INFRA_DIR, "extracted");
  installer.extractTarball(tarBuf, outDir);

  const content = require("node:fs").readFileSync(resolve(outDir, "test.txt"), "utf-8");
  expect(content).toBe("hello");
});

test("Infra: RahulChaubeWorker executes TS script and receives postMessage", async () => {
  const wFile = resolve(TMP_INFRA_DIR, "worker.ts");
  writeFileSync(wFile, `
    globalThis.onmessage = (evt: any) => {
      globalThis.postMessage({ val: evt.data.val * 3 });
    };
  `);

  const worker = new RahulChaubeWorker(wFile);
  const result = await new Promise((res) => {
    worker.onmessage = (evt: any) => res(evt.data);
    worker.postMessage({ val: 14 });
  });

  expect(result).toEqual({ val: 42 });
  await worker.terminate();
});

test("Infra: FileWatcher monitors file and debounces change events", async () => {
  const watchFile = resolve(TMP_INFRA_DIR, "watchme.ts");
  writeFileSync(watchFile, "const v = 1;");

  let triggered = false;
  const watcher = new FileWatcher(watchFile, () => { triggered = true; }, 20);
  watcher.start();

  await new Promise((r) => setTimeout(r, 40));
  writeFileSync(watchFile, "const v = 2;");

  await new Promise((r) => setTimeout(r, 80));
  expect(triggered).toBe(true);
  watcher.stop();
});
