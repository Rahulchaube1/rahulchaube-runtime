import { expect, test } from "bun:test";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";

const legacy = resolve("packages/rahulchaube-cli/bin/rahulchaube.ts");
for (const mode of ["--watch", "--hot"]) {
  test(`Compatibility CLI ${mode} reacts to imports, atomic saves and repairs`, async () => {
    const dir = mkdtempSync(join(tmpdir(), "rc live "));
    const dep = join(dir, "value.ts");
    const source = (value: number) => `export const value: number = ${value};`;
    writeFileSync(dep, source(1));
    writeFileSync(join(dir, "app.ts"), [
      'import { value } from "./value.ts";',
      'globalThis.rcRuns = (globalThis.rcRuns || 0) + 1;',
      'console.log(["RC", value, globalThis.rcRuns, ...process.argv.slice(2)].join("|"));',
      'globalThis.keepAlive ??= setInterval(() => {}, 10000);',
    ].join("\n"));
    const proc = spawn(process.execPath, [legacy, "run", mode, "app.ts", "--", "two words", "--label=x=y"], {
      cwd: dir, stdio: ["ignore", "pipe", "pipe"], detached: process.platform !== "win32",
    });
    const closed = once(proc, "close");
    let transcript = "";
    proc.stderr.on("data", chunk => { transcript += chunk; });
    const lines = createInterface({ input: proc.stdout });
    const seen: string[] = [];
    lines.on("line", line => seen.push(line));
    const waitFor = async (label: string, ready: () => boolean) => {
      const end = Date.now() + 12000;
      while (!ready()) {
        if (proc.exitCode !== null || Date.now() >= end) throw new Error(`Waiting for ${label}\n${seen.join("\n")}\n${transcript}`);
        await Bun.sleep(25);
      }
    };
    try {
      await waitFor("first run", () => seen.includes("RC|1|1|two words|--label=x=y"));
      writeFileSync(join(dir, "atomic.tmp"), source(2));
      renameSync(join(dir, "atomic.tmp"), dep);
      await waitFor("import reload", () => seen.includes(`RC|2|${mode === "--hot" ? 2 : 1}|two words|--label=x=y`));
      writeFileSync(dep, "export const value = ;");
      await waitFor("syntax error", () => /error|unexpected/i.test(transcript));
      writeFileSync(dep, source(3));
      await waitFor("recovery", () => seen.some(line => line.startsWith("RC|3|") && line.endsWith("|two words|--label=x=y")));
      expect(proc.exitCode).toBeNull();
    } finally {
      if (proc.pid && proc.exitCode === null && !proc.signalCode) {
        if (process.platform === "win32") spawnSync("taskkill.exe", ["/pid", String(proc.pid), "/t", "/f"]);
        else process.kill(-proc.pid, "SIGTERM");
      }
      await closed;
      lines.close();
      rmSync(dir, { recursive: true, force: true });
    }
  }, 50_000);
}

test("build --watch rebuilds imports outside the entry directory", async () => {
  const { mkdirSync, readFileSync, existsSync } = await import("node:fs");
  const dir = mkdtempSync(join(tmpdir(), "rc build watch "));
  const src = join(dir, "src");
  mkdirSync(src);
  const output = join(src, "result.js");
  const dep = join(dir, "common.ts");
  writeFileSync(join(src, "main.ts"), 'import {value} from "../common"; console.log(value);');
  writeFileSync(dep, 'export const value = "RC_INITIAL";');
  const proc = spawn(process.execPath, [legacy, "build", "-w", "src/main.ts", "--outfile", output], {
    cwd: dir, stdio: "ignore", detached: process.platform !== "win32",
  });
  const closed = once(proc, "close");
  try {
    for (const marker of ["RC_INITIAL", "RC_UPDATED"]) {
      const end = Date.now() + 12000;
      while (!existsSync(output) || !readFileSync(output, "utf8").includes(marker)) {
        if (Date.now() >= end || proc.exitCode !== null) throw new Error("Missing bundle update: " + marker);
        await Bun.sleep(25);
      }
      if (marker === "RC_INITIAL") writeFileSync(dep, 'export const value = "RC_UPDATED";');
    }
    expect(proc.exitCode).toBeNull();
  } finally {
    if (proc.pid && proc.exitCode === null && !proc.signalCode) {
      if (process.platform === "win32") spawnSync("taskkill.exe", ["/pid", String(proc.pid), "/t", "/f"]);
      else process.kill(-proc.pid, "SIGTERM");
    }
    await closed;
    rmSync(dir, { recursive: true, force: true });
  }
}, 30_000);
