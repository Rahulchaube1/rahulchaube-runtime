import { test, expect } from "bun:test";
import { resolve } from "node:path";
import { writeFileSync, unlinkSync } from "node:fs";
import { transpileSource } from "../runtime/compiler/transpiler.ts";
import { resolveModule } from "../runtime/module-loader/resolver.ts";
import { ModuleLoader } from "../runtime/module-loader/loader.ts";
import { VirtualFS } from "../runtime/fs/virtual-fs.ts";
import { runScript } from "../runtime/engine/runner.ts";
import { formatCodeFrame } from "../runtime/diagnostics/errors.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Transpiler unit tests
// ─────────────────────────────────────────────────────────────────────────────

test("Transpiler: strips basic type annotations", () => {
  const r = transpileSource({ fileName: "t.ts", sourceText: "const x: number = 42;" });
  expect(r.code).toBe("const x = 42;");
  expect(r.warnings).toHaveLength(0);
});

test("Transpiler: strips function param and return type annotations", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "function greet(name: string): string { return name; }",
  });
  expect(r.code).toContain("function greet(name)");
  expect(r.code).not.toContain(": string");
});

test("Transpiler: removes interface declarations", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "interface Foo { bar: string; }\nconst x = 1;",
  });
  expect(r.code).not.toContain("interface");
  expect(r.code).toContain("const x = 1");
});

test("Transpiler: removes type alias declarations", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "type ID = string;\nconst id = 'abc';",
  });
  expect(r.code).not.toContain("type ID");
  expect(r.code).toContain("const id = 'abc'");
});

test("Transpiler: removes type-only imports", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "import type { Foo } from './foo';\nconst x = 1;",
  });
  expect(r.code).not.toContain("import type");
  expect(r.code).not.toContain("Foo");
});

test("Transpiler: transforms numeric enums correctly", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "enum Direction { Up, Down, Left = 10, Right }",
  });
  expect(r.code).toContain("Up: 0");
  expect(r.code).toContain("Down: 1");
  expect(r.code).toContain("Left: 10");
  expect(r.code).toContain("Right: 11");
  expect(r.code).toContain("Object.freeze");
});

test("Transpiler: transforms string enums correctly", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: `enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }`,
  });
  expect(r.code).toContain(`Active: "ACTIVE"`);
  expect(r.code).toContain(`Inactive: "INACTIVE"`);
  expect(r.code).toContain("Object.freeze");
});

test("Transpiler: does not corrupt Object.freeze values", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "const D = Object.freeze({ Up: 0, Down: 1, Left: 10 });",
  });
  expect(r.code).toContain("Up: 0");
  expect(r.code).toContain("Down: 1");
  expect(r.code).toContain("Left: 10");
});

test("Transpiler: strips generic type params from function declarations", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "function identity<T>(value: T): T { return value; }",
  });
  expect(r.code).toContain("function identity(value)");
  expect(r.code).not.toContain("<T>");
});

test("Transpiler: strips generic type args from call expressions", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "const s = identity<string>('hello');",
  });
  expect(r.code).not.toContain("<string>");
  expect(r.code).toContain("identity('hello')");
});

test("Transpiler: transforms named ESM imports to CJS require", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: `import { add, sub } from './math';`,
  });
  expect(r.code).toContain("require('./math')");
  expect(r.code).toContain("const {add, sub}");
});

test("Transpiler: transforms default ESM import to CJS require", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: `import fs from 'node:fs';`,
  });
  expect(r.code).toContain("require('node:fs')");
});

test("Transpiler: transforms namespace ESM import to CJS require", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: `import * as path from 'path';`,
  });
  expect(r.code).toContain("const path = require('path')");
});

test("Transpiler: transforms export const to CJS exports assignment", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "export const PI = 3.14;",
  });
  expect(r.code).toContain("exports.PI = PI");
  expect(r.code).toContain("const PI = 3.14");
});

test("Transpiler: transforms export default to CJS exports.default", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "export default { a: 1 };",
  });
  expect(r.code).toContain("exports.default = { a: 1 }");
});

test("Transpiler: transforms export { a, b as c } to CJS assignments", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "const a = 1; const b = 2;\nexport { a, b as c };",
  });
  expect(r.code).toContain("exports.a = a");
  expect(r.code).toContain("exports.c = b");
});

test("Transpiler: removes decorator lines", () => {
  const r = transpileSource({
    fileName: "t.ts",
    sourceText: "@Injectable()\nclass MyService {}",
  });
  expect(r.code).not.toContain("@Injectable");
  expect(r.code).toContain("class MyService");
});

// ─────────────────────────────────────────────────────────────────────────────
// Module Resolver unit tests
// ─────────────────────────────────────────────────────────────────────────────

test("Resolver: resolves explicit relative path", () => {
  // parentPath must be a FILE path (the calling file), not a directory
  const callerFile = resolve(process.cwd(), "tests/runtime.test.ts");
  const result = resolveModule(
    "../packages/rahulchaube-cli/package.json",
    callerFile
  );
  expect(result.extension).toBe(".json");
  expect(result.isPackage).toBe(false);
});

test("Resolver: resolves direct file path without ./", () => {
  const result = resolveModule(
    "packages/rahulchaube-cli/package.json",
    process.cwd()
  );
  expect(result.resolvedPath).toContain("package.json");
});

// ─────────────────────────────────────────────────────────────────────────────
// Module Loader unit tests
// ─────────────────────────────────────────────────────────────────────────────

test("ModuleLoader: loads and caches a file", () => {
  const pkgPath = resolve(process.cwd(), "packages/rahulchaube-cli/package.json");
  const loader = new ModuleLoader();
  const mod = loader.load(pkgPath);
  expect(mod.evaluationState).toBe("loaded");
  expect(mod.sourceText).toContain("rahulchaube");
  // Load again — should come from cache
  const mod2 = loader.load(pkgPath);
  expect(mod2).toBe(mod);
});

// ─────────────────────────────────────────────────────────────────────────────
// Virtual FS unit tests
// ─────────────────────────────────────────────────────────────────────────────

test("VirtualFS: reads and caches files", () => {
  const pkgPath = resolve(process.cwd(), "packages/rahulchaube-cli/package.json");
  const vfs = new VirtualFS();
  const content = vfs.readFile(pkgPath);
  expect(content).toContain("rahulchaube");
  expect(vfs.exists(pkgPath)).toBe(true);
});

// ─────────────────────────────────────────────────────────────────────────────
// Diagnostics unit tests
// ─────────────────────────────────────────────────────────────────────────────

test("Diagnostics: formatCodeFrame includes message and file path", () => {
  const frame = formatCodeFrame({
    filePath: "test.ts",
    line: 2,
    column: 5,
    sourceText: "const x = 1;\nconst y: BAD = 2;",
    message: "Unknown type 'BAD'",
  });
  expect(frame).toContain("Unknown type 'BAD'");
  expect(frame).toContain("test.ts");
  expect(frame).toContain("const y");
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration tests — real program execution
// ─────────────────────────────────────────────────────────────────────────────

test("Integration: named + default ESM imports/exports across files", async () => {
  const target = resolve(process.cwd(), "tests/imports/main.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Integration: JSON file imports", async () => {
  const target = resolve(process.cwd(), "tests/json/app.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Integration: Node built-in APIs (path, os, crypto)", async () => {
  const target = resolve(process.cwd(), "tests/simple/node-apis.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Integration: TypeScript enum transpilation and execution", async () => {
  const target = resolve(process.cwd(), "tests/enums/app.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Integration: TypeScript generics stripped and executed", async () => {
  const target = resolve(process.cwd(), "tests/generics/app.ts");
  const res = await runScript(target);
  expect(res.success).toBe(true);
  expect(res.exitCode).toBe(0);
});

test("Integration: inline JS script executes correctly", async () => {
  const tempPath = resolve(process.cwd(), "__test_inline.js");
  writeFileSync(tempPath, "const x = 2 + 2; if (x !== 4) throw new Error('Math broken');");
  const res = await runScript(tempPath);
  unlinkSync(tempPath);
  expect(res.success).toBe(true);
});
