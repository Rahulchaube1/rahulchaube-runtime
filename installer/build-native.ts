// Build a native distribution on its target OS using the pinned Blyx compiler.
import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = join(root, "packages", "rahulchaube-cli");
const [compilerArg, destArg] = process.argv.slice(2);
if (!compilerArg || !destArg) throw new Error("Usage: bun installer/build-native.ts <blyxc executable> <output directory>");
const compiler = resolve(compilerArg);
const dest = resolve(destArg);
const suffix = process.platform === "win32" ? ".exe" : "";
const stage = mkdtempSync(join(tmpdir(), "rahul-blyx-build-"));
function cliText(flag: string, color: boolean): string {
  return execFileSync(process.execPath, [join(pkg, "bin/rahulchaube.ts"), flag], {
    env: { ...process.env, NO_COLOR: color ? "" : "1", FORCE_COLOR: color ? "1" : "0" },
    encoding: "utf8",
  }).replaceAll("\r\n", "\n");
}
// Blyx accepts literal Unicode (including ANSI ESC) and these string escapes.
function literal(text: string): string {
  const escaped = text.replaceAll("\\", String.raw`\\`).replaceAll('"', String.raw`\"`)
    .replaceAll("\n", String.raw`\n`).replaceAll("\r", String.raw`\r`);
  return `"${escaped}"`;
}
try {
  cpSync(join(pkg, "blyx"), stage, { recursive: true });
  const metadata = [["help_text", "--help"], ["version_text", "--version"]].map(([fn, flag]) =>
    `pub fn ${fn}(color: bool) -> String { if color { return ${literal(cliText(flag, true))}; } ${literal(cliText(flag, false))} }`
  );
  metadata.push(`pub fn compiler_filename() -> String { "blyxc${suffix}" }`);
  writeFileSync(join(stage, "metadata.blyx"), metadata.join("\n"));
  mkdirSync(dest, { recursive: true });
  const out = join(dest, "rahulchaube-native" + suffix);
  execFileSync(compiler, ["build", join(stage, "main.blyx"), "-o", out], { stdio: "inherit" });
  copyFileSync(compiler, join(dest, "blyxc" + suffix));
  chmodSync(out, 0o755);
  chmodSync(join(dest, "blyxc" + suffix), 0o755);
} finally {
  rmSync(stage, { recursive: true, force: true });
}
