import { expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const nativeTest = test.skipIf(process.env.RAHUL_TEST_NATIVE !== "1");
const suffix = process.platform === "win32" ? ".exe" : "";
const folder = resolve("packages/rahulchaube-cli/bin");
const binary = join(folder, "rahulchaube-native" + suffix);
const legacy = [process.execPath, join(folder, "rahulchaube.ts")];
const env = { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" };
const execute = (argv: string[], cwd?: string, extraEnv: Record<string,string> = {}) => {
  const r = Bun.spawnSync(argv, { cwd, env: { ...env, ...extraEnv }, stdout: "pipe", stderr: "pipe" });
  return { code: r.exitCode, out: r.stdout.toString().replaceAll("\r\n","\n"), err: r.stderr.toString().replaceAll("\r\n","\n") };
};

nativeTest("compiled Blyx front end matches CLI output and flag handling", () => {
  for (const args of [[], ["-v"], ["--help"], ["add"], ["remove"], ["test", "-h"], ["build", "--outfile"], ["does-not-exist"]]) {
    expect(execute([binary, ...args])).toEqual(execute([...legacy, ...args]));
  }
  for (const args of [["--help"], ["--version"]]) {
    const ansi = { FORCE_COLOR: "1", NO_COLOR: "" };
    expect(execute([binary, ...args], undefined, ansi)).toEqual(execute([...legacy, ...args], undefined, ansi));
  }
});

nativeTest("compiled runtime can interpret, build, and run Blyx and execute a TS file", () => {
  const dir = mkdtempSync(join(tmpdir(), "rahul blyx "));
  try {
    writeFileSync(join(dir, "hello.blyx"), 'fn main() { println!(6 * 7); }');
    expect(execute([binary, "blyx", "run", "hello.blyx"], dir, { PATH: "", Path: "" })).toEqual({ code: 0, out: "42\n", err: "" });
    writeFileSync(join(dir, "app.blyx"), 'use std::cli; fn main() { println!(args_join(cli_args(), "|")); process_exit(17); }');
    const args = ["", "a b", "--flag=with=equals", "x&y", "₹"];
    const expected = { code: 17, out: args.join("|") + "\n", err: "" };
    expect(execute([binary, "run", "app.blyx", "--", ...args], dir)).toEqual(expected);
    const out = join(dir, "my app" + suffix);
    expect(execute([binary, "build", "--outfile=" + out, "app.blyx"], dir).code).toBe(0);
    expect(execute([out, ...args], dir)).toEqual(expected);
    expect(execute([binary, "build", "--minify", "app.blyx"], dir).code).toBe(1);
    writeFileSync(join(dir, "demo.ts"), 'console.log(process.argv.slice(2).join("|"));');
    expect(execute([binary, "run", "./demo.ts", "--", ...args], dir)).toEqual({ ...expected, code: 0 });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 60_000);

nativeTest("the Blyx launcher runs ESM, TypeScript, CommonJS and async imports through JavaScriptCore", () => {
  const dir = mkdtempSync(join(tmpdir(), "rahul js host "));
  try {
    writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "module", scripts: { "main.ts": "exit 12" } }));
    writeFileSync(join(dir, "lib.ts"), 'export const result: number = 42;');
    writeFileSync(join(dir, "main.ts"), 'const { result } = await import("./lib.ts"); console.log(result, process.argv.slice(2).join("|"));');
    const args = ["run", "main.ts", "--", "--one=x=y", "two words"];
    const result = execute([binary, ...args], dir);
    expect(execute([process.execPath, join(folder, "package-cli.ts"), ...args], dir)).toEqual(result);
    expect(result).toEqual({ code: 0, out: "42 --one=x=y|two words\n", err: "" });
    writeFileSync(join(dir, "app.cjs"), 'console.log(require("./lib.ts").result); process.exitCode = 7;');
    expect(execute([binary, "run", join(dir, "app.cjs")], dir)).toEqual({ code: 7, out: "42\n", err: "" });
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

nativeTest("Blyx engine commands preserve engine arguments, environment and nonzero exit codes", () => {
  const dir = mkdtempSync(join(tmpdir(), "rahul engine "));
  try {
    writeFileSync(join(dir, "engine.blyx"), 'use std::cli; fn main() { println!(args_join(cli_args(), "|")); println!(env_get("RAHULCHAUBE_BRAND_ACTIVE", "missing")); process_exit(23); }');
    const engine = join(dir, "mock engine" + suffix);
    expect(execute([binary, "build", "engine.blyx", "--outfile", engine], dir).code).toBe(0);
    for (const args of [
      ["add", "--exact", "hello world", "--dev", "--", "--other"],
      ["remove", "example"], ["update", "--latest", "--interactive"],
      ["test", "x", "--coverage", "--watch"],
      ["build", "a", "--outfile=a=b", "--minify", "--target", "bun", "--splitting"],
    ]) {
      const opts = { RAHULCHAUBE_ENGINE: engine };
      const baseline = execute([...legacy, ...args], dir, opts);
      expect(baseline.code).toBe(23);
      expect(execute([binary, ...args], dir, opts)).toEqual(baseline);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 60_000);
