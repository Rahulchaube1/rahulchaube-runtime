import { test, expect, beforeEach, afterEach } from "bun:test";
import { PersistentDiskCache } from "../runtime/cache/disk-cache.ts";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TMP_CACHE_DIR = resolve(process.cwd(), ".tmp_test_disk_cache");

beforeEach(() => {
  if (existsSync(TMP_CACHE_DIR)) rmSync(TMP_CACHE_DIR, { recursive: true });
  mkdirSync(TMP_CACHE_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TMP_CACHE_DIR)) rmSync(TMP_CACHE_DIR, { recursive: true });
});

test("DiskCache: stores and retrieves compiled module code", () => {
  const cache = new PersistentDiskCache(TMP_CACHE_DIR);
  const file = resolve(TMP_CACHE_DIR, "app.ts");
  writeFileSync(file, "const x: number = 42;");

  cache.setModule(file, "const x: number = 42;", "var x = 42;");
  const code = cache.getModule(file, "const x: number = 42;");

  expect(code).toBe("var x = 42;");
});

test("DiskCache: stores and retrieves registry metadata", () => {
  const cache = new PersistentDiskCache(TMP_CACHE_DIR);
  cache.setRegistryData("react@18.2.0", { name: "react", version: "18.2.0" });

  const data = cache.getRegistryData<{ name: string; version: string }>("react@18.2.0");
  expect(data?.version).toBe("18.2.0");
});

test("DiskCache: stores and retrieves binary buffer", () => {
  const cache = new PersistentDiskCache(TMP_CACHE_DIR);
  const buf = Buffer.from("RAW_TARBALL_DATA");

  cache.setBinary("pkg-1.0.0.tgz", buf);
  const retrieved = cache.getBinary("pkg-1.0.0.tgz");

  expect(retrieved).not.toBeNull();
  expect(retrieved?.toString()).toBe("RAW_TARBALL_DATA");
});
