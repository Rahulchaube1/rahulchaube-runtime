import { test, expect, beforeEach, afterEach } from "bun:test";
import { IncrementalCompiler, DependencyGraph } from "../runtime/compiler/incremental.ts";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TMP_INC_DIR = resolve(process.cwd(), ".tmp_test_inc");

beforeEach(() => {
  if (existsSync(TMP_INC_DIR)) rmSync(TMP_INC_DIR, { recursive: true });
  mkdirSync(TMP_INC_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TMP_INC_DIR)) rmSync(TMP_INC_DIR, { recursive: true });
});

test("DependencyGraph: tracks transitive dependencies", () => {
  const g = new DependencyGraph();
  g.addDependency("main.ts", "utils.ts");
  g.addDependency("utils.ts", "math.ts");

  const mainDeps = g.getDependencies("main.ts");
  expect(mainDeps).toEqual(["utils.ts"]);

  const mathDependents = Array.from(g.getTransitiveDependents("math.ts"));
  expect(mathDependents).toContain("utils.ts");
  expect(mathDependents).toContain("main.ts");
});

test("IncrementalCompiler: recompiles only modified files on second pass", () => {
  const mainFile = resolve(TMP_INC_DIR, "main.ts");
  const helperFile = resolve(TMP_INC_DIR, "helper.ts");

  writeFileSync(helperFile, "export const value: number = 42;");
  writeFileSync(mainFile, `import { value } from "./helper.ts"; console.log(value);`);

  const compiler = new IncrementalCompiler();

  // First compile — both files dirty
  const pass1 = compiler.compile(mainFile);
  expect(pass1.dirtyFiles.length).toBe(2);

  // Second compile without changes — 0 dirty files
  const pass2 = compiler.compile(mainFile);
  expect(pass2.dirtyFiles.length).toBe(0);

  // Modify helper file
  writeFileSync(helperFile, "export const value: number = 100;");

  // Third compile — helper and main invalidated
  const pass3 = compiler.compile(mainFile);
  expect(pass3.dirtyFiles).toContain(helperFile);
});
