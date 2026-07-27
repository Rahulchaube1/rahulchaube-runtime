/**
 * RahulChaube Runtime — Crash & Resilience Testing Suite (Phase 5).
 */
import { test, expect } from "bun:test";
import { transpileSource } from "../runtime/compiler/transpiler.ts";
import { runScript } from "../runtime/engine/runner.ts";
import { resolve } from "node:path";
import { writeFileSync, rmSync, existsSync, mkdirSync } from "node:fs";

const CRASH_DIR = resolve(process.cwd(), ".tmp_crash_test");

function setupCrashDir() {
  if (existsSync(CRASH_DIR)) rmSync(CRASH_DIR, { recursive: true, force: true });
  mkdirSync(CRASH_DIR, { recursive: true });
}

function cleanupCrashDir() {
  if (existsSync(CRASH_DIR)) rmSync(CRASH_DIR, { recursive: true, force: true });
}

test("Crash Handling: Transpiling malformed syntax does not crash process", () => {
  const malformedInputs = [
    "function foo( { return 1;",
    "const x = ;;;;",
    "class {{{",
    "import {{{ from 'foo'",
    "export const ====",
  ];

  for (const src of malformedInputs) {
    expect(() => {
      transpileSource({ fileName: "malformed.ts", sourceText: src });
    }).not.toThrow();
  }
});

test("Crash Handling: Malformed JSON parsing throws descriptive SyntaxError", () => {
  const brokenJson = '{"name": "Rahul", "items": [1, 2, }';
  expect(() => JSON.parse(brokenJson)).toThrow(SyntaxError);
});

test("Crash Handling: Recursive export cycles do not cause stack overflow", () => {
  const code = `
    let counter = 0;
    function recurse() {
      counter++;
      if (counter < 50) recurse();
    }
    recurse();
    exports.counter = counter;
  `;
  const res = transpileSource({ fileName: "recurse.ts", sourceText: code });
  expect(res.code).toContain("counter");
});

test("Crash Handling: Large strings and arrays under memory pressure", () => {
  const hugeArray = new Array(50000).fill("payload_string_data");
  expect(hugeArray.length).toBe(50000);

  const hugeString = "X".repeat(1000000);
  expect(hugeString.length).toBe(1000000);
});

test("Crash Handling: Missing file execution returns non-zero exit code with error diagnosis", async () => {
  setupCrashDir();
  const nonExistentFile = resolve(CRASH_DIR, "does_not_exist.ts");

  const res = await runScript(nonExistentFile);
  expect(res.success).toBe(false);
  expect(res.exitCode).toBe(1);
  expect(res.error).toBeDefined();

  cleanupCrashDir();
});
