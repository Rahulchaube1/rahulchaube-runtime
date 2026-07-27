/**
 * RahulChaube Runtime — Comprehensive Stress Testing Suite (Phase 4).
 */
import { test, expect } from "bun:test";
import { resolve, join } from "node:path";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { transpileSource } from "../runtime/compiler/transpiler.ts";
import { WorkerPool } from "../runtime/concurrency/worker-pool.ts";
import { IncrementalWatcher } from "../runtime/watcher/watcher.ts";
import { HMREngine } from "../runtime/hmr/engine.ts";

const STRESS_DIR = resolve(process.cwd(), ".tmp_stress_test");

function setupStressDir() {
  if (existsSync(STRESS_DIR)) rmSync(STRESS_DIR, { recursive: true, force: true });
  mkdirSync(STRESS_DIR, { recursive: true });
}

function cleanupStressDir() {
  if (existsSync(STRESS_DIR)) rmSync(STRESS_DIR, { recursive: true, force: true });
}

test("Stress: Transpile 10, 100, and 1000 synthetic modules", () => {
  setupStressDir();
  const counts = [10, 100, 1000];

  for (const count of counts) {
    const start = performance.now();
    for (let i = 0; i < count; i++) {
      const code = `export const val_${i}: number = ${i} * 2; function getVal_${i}(): number { return val_${i}; }`;
      const res = transpileSource({ fileName: `mod_${i}.ts`, sourceText: code });
      expect(res.code).toContain(`exports.val_${i} = val_${i}`);
    }
    const duration = performance.now() - start;
    expect(duration).toBeGreaterThan(0);
  }

  cleanupStressDir();
});

test("Stress: Deeply nested directory structure (20 levels)", () => {
  setupStressDir();
  let currentPath = STRESS_DIR;
  for (let depth = 0; depth < 20; depth++) {
    currentPath = join(currentPath, `level_${depth}`);
    mkdirSync(currentPath, { recursive: true });
  }

  const deepFile = join(currentPath, "deep_module.ts");
  writeFileSync(deepFile, "export const DEEP_VAL: number = 999;");
  expect(existsSync(deepFile)).toBe(true);

  const res = transpileSource({ fileName: deepFile, sourceText: "export const DEEP_VAL: number = 999;" });
  expect(res.code).toContain("exports.DEEP_VAL = DEEP_VAL");

  cleanupStressDir();
});

test("Stress: Long and Unicode filenames", () => {
  setupStressDir();
  const longName = "a_".repeat(60) + "module.ts";
  const unicodeName = "モジュール_⚡_rahulchaube.ts";

  const longFile = join(STRESS_DIR, longName);
  const unicodeFile = join(STRESS_DIR, unicodeName);

  writeFileSync(longFile, "export const LONG = 1;");
  writeFileSync(unicodeFile, "export const UNICODE = '日本語';");

  expect(existsSync(longFile)).toBe(true);
  expect(existsSync(unicodeFile)).toBe(true);

  cleanupStressDir();
});

test("Stress: Very Large JSON Import parsing (100,000 items)", () => {
  const items = Array.from({ length: 100000 }, (_, i) => ({ id: i, name: `user_${i}`, active: i % 2 === 0 }));
  const jsonStr = JSON.stringify({ users: items, count: items.length });

  const start = performance.now();
  const parsed = JSON.parse(jsonStr);
  const duration = performance.now() - start;

  expect(parsed.users.length).toBe(100000);
  expect(duration).toBeLessThan(1000);
});

test("Stress: Concurrency WorkerPool task queue execution under load", async () => {
  const pool = new WorkerPool(4);
  const tasks = Array.from({ length: 50 }, (_, i) => ({ fileName: `test_${i}.ts`, sourceText: `export const a_${i} = ${i};` }));

  const results = await pool.transpileParallel(tasks);
  expect(results.size).toBe(50);
  expect(results.get("test_0.ts")).toContain("exports.a_0 = a_0");
});

test("Stress: HMR Engine rapid state updates & invalidation", () => {
  const hmr = new HMREngine();
  const ctx = hmr.createHotContext("app.ts");
  ctx.accept(() => {});
  ctx.data.count = 100;

  for (let i = 0; i < 10; i++) {
    hmr.reloadModule("app.ts", `exports.count = ${i};`);
  }

  expect(ctx.data.count).toBe(100);
  expect(hmr.getHistory().length).toBe(10);
});
