import { test, expect, beforeEach, afterEach } from "bun:test";
import { PersistentCacheEngine } from "../runtime/cache/persistent-cache.ts";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TMP_PCACHE_DIR = resolve(process.cwd(), ".tmp_test_pcache");

beforeEach(() => {
  if (existsSync(TMP_PCACHE_DIR)) rmSync(TMP_PCACHE_DIR, { recursive: true });
  mkdirSync(TMP_PCACHE_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TMP_PCACHE_DIR)) rmSync(TMP_PCACHE_DIR, { recursive: true });
});

test("PersistentCacheEngine: SHA-256 checksum generation and verification", () => {
  const engine = new PersistentCacheEngine(TMP_PCACHE_DIR);
  const data = "RahulChaube Runtime Cache Verification Payload";

  const sha = engine.computeSha256(data);
  expect(sha.length).toBe(64); // SHA-256 is 64 hex chars
  expect(engine.verifyChecksum(data, sha)).toBe(true);
  expect(engine.verifyChecksum("other data", sha)).toBe(false);
});

test("PersistentCacheEngine: stores and retrieves compiled modules with SHA-256 invalidation", () => {
  const engine = new PersistentCacheEngine(TMP_PCACHE_DIR);
  const file = resolve(TMP_PCACHE_DIR, "index.ts");
  const src = "const x: number = 42;";

  writeFileSync(file, src);
  engine.storeCompiledModule(file, src, "var x = 42;");

  const cached = engine.getCompiledModule(file, src);
  expect(cached).toBe("var x = 42;");

  // Changed source should invalidate
  const mismatch = engine.getCompiledModule(file, "const x: number = 99;");
  expect(mismatch).toBeNull();
});

test("PersistentCacheEngine: stores and retrieves dependency graph JSON", () => {
  const engine = new PersistentCacheEngine(TMP_PCACHE_DIR);
  const graph = { "main.ts": ["helper.ts"], "helper.ts": ["math.ts"] };

  engine.storeDependencyGraph("project-root", graph);
  const retrieved = engine.getDependencyGraph("project-root");

  expect(retrieved).toEqual(graph);
});
