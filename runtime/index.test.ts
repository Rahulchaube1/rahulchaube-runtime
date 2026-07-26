import { test, expect } from "bun:test";
import { resolve } from "node:path";
import { writeFileSync, unlinkSync } from "node:fs";
import { resolveModule } from "./module-loader/resolver.ts";
import { ModuleLoader } from "./module-loader/loader.ts";
import { VirtualFS } from "./fs/virtual-fs.ts";
import { transpileSource } from "./compiler/transpiler.ts";
import { runScript } from "./engine/runner.ts";
import { formatCodeFrame } from "./diagnostics/errors.ts";

const pkgPath = resolve(process.cwd(), "packages/rahulchaube-cli/package.json");

test("Stage 2: Module Resolver resolves local file paths", () => {
  const res = resolveModule("packages/rahulchaube-cli/package.json", process.cwd());
  expect(res.resolvedPath).toContain("package.json");
  expect(res.extension).toBe(".json");
});

test("Stage 3: Virtual FS reads and caches files", () => {
  const vfs = new VirtualFS();
  const content = vfs.readFile(pkgPath);
  expect(content).toContain("rahulchaube-cli");
  expect(vfs.exists(pkgPath)).toBe(true);
});

test("Stage 4: Module Loader caches loaded modules", () => {
  const loader = new ModuleLoader();
  const mod = loader.load(pkgPath);
  expect(mod.id).toContain("package.json");
  expect(mod.evaluationState).toBe("loaded");
});

test("Stage 5: Transpiler strips TypeScript annotations", () => {
  const tsCode = "const num: number = 42;";
  const res = transpileSource({ fileName: "test.ts", sourceText: tsCode });
  expect(res.code).toBe("const num = 42;");
});

test("Stage 6: Runner executes script engine", async () => {
  const tempScript = resolve(process.cwd(), "temp_test_script.js");
  writeFileSync(tempScript, "console.log('Test execution');");
  const res = await runScript(tempScript);
  unlinkSync(tempScript);
  expect(res.success).toBe(true);
});

test("Stage 7: Diagnostics formats code frames for errors", () => {
  const diag = formatCodeFrame({
    filePath: "test.ts",
    line: 1,
    column: 1,
    sourceText: "const a = 1;",
    message: "Syntax Error",
  });
  expect(diag).toContain("Syntax Error");
  expect(diag).toContain("test.ts");
});
