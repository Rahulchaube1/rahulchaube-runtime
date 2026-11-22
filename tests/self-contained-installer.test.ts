import { expect, test } from "bun:test";
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { versionInfo } from "../website/lib/releases.ts";

test("Install the archive, run the packaged CLI, and preserve the install on checksum failure", async () => {
  const dir = mkdtempSync(join(tmpdir(), "rahul-install-test-"));
  const dest = join(dir, "install");
  const archiveDir = join(dir, "archive");
  mkdirSync(archiveDir);
  const os = process.platform === "win32" ? "win" : process.platform;
  const file = `runtime-${os}-${process.arch}.${os === "win" ? "zip" : "tar.gz"}`;
  for (const name of ["version.json", "VERSION", "SHA256SUMS", file]) copyFileSync(join("dist", name), join(archiveDir, name));
  const windows = process.platform === "win32";
  const exe = windows ? "powershell" : "bash";
  const args = windows ? ["-NoProfile", "-File", "website/public/install.ps1"] : ["website/public/install.sh"];
  const install = () => Bun.spawn([exe, ...args], {
    env: { ...process.env, RAHULCHAUBE_INSTALL_DIR: dest, RAHULCHAUBE_INSTALL_ARCHIVE_DIR: archiveDir },
    stdout: "pipe", stderr: "pipe",
  });
  const launcher = join(dest, "bin", windows ? "rahulchaube.cmd" : "rahulchaube");
  const run = (args: string[]) => Bun.spawnSync(windows ? ["cmd", "/c", launcher, ...args] : [launcher, ...args], { cwd: dir });
  try {
    mkdirSync(join(dest, "cache"), { recursive: true });
    writeFileSync(join(dest, "cache", "keep"), "existing");
    const first = install();
    const firstStatus = await first.exited;
    expect(firstStatus, await new Response(first.stderr).text()).toBe(0);
    expect(run(["--version"]).stdout.toString()).toContain(versionInfo.version);
    const rc = join(dest, "bin", windows ? "rc.exe" : "rc");
    const standalone = (...args: string[]) => Bun.spawnSync([rc, ...args], {
      cwd: dir, env: { ...process.env, PATH: "", Path: "" },
    });
    expect(standalone("--version").stdout.toString().trim()).toBe("RC Runtime v" + versionInfo.version);
    writeFileSync(join(dir, "standalone.ts"), 'const value: number = 42; console.log(value, RC.args.join("|"));');
    const output = standalone("run", "standalone.ts", "--", "two words", "--flag");
    expect(output.exitCode, output.stderr.toString()).toBe(0);
    expect(output.stdout.toString().trim()).toBe("42 two words|--flag");
    writeFileSync(join(dir, "hello.blyx"), 'fn main() { println!(6 * 7); }');
    const interpreted = run(["blyx", "run", "hello.blyx"]);
    expect(interpreted.exitCode).toBe(0);
    expect(interpreted.stdout.toString().trim()).toBe("42");
    writeFileSync(join(dir, "hello.ts"), 'setTimeout(() => console.log(process.argv.slice(2).join("|")), 5);');
    const result = run(["run", "./hello.ts", "--", "--label=a=b", "hello"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString().trim()).toBe("--label=a=b|hello");
    expect(run(["run", "./missing.ts"]).exitCode).toBe(1);
    writeFileSync(join(archiveDir, file), "incomplete download");
    const failed = install();
    expect(await failed.exited).not.toBe(0);
    expect(await new Response(failed.stderr).text()).toContain("SHA-256 mismatch");
    expect(readFileSync(join(dest, "cache", "keep"), "utf8")).toBe("existing");
    expect(run(["--help"]).exitCode).toBe(0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 30_000);
