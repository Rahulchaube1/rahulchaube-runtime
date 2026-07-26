import { test, expect } from "bun:test";
import { resolve } from "node:path";
import { runScript } from "../runtime/engine/runner.ts";

test("Integration Test 1: Multi-file ESM Relative Imports/Exports", async () => {
  const target = resolve(process.cwd(), "tests/imports/main.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Integration Test 2: JSON File Module Imports", async () => {
  const target = resolve(process.cwd(), "tests/json/app.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Integration Test 3: Built-in Node APIs (path, os, crypto)", async () => {
  const target = resolve(process.cwd(), "tests/simple/node-apis.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});
