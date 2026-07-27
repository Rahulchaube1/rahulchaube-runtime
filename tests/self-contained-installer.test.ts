import { test, expect } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

test("Self-contained Installation: ~/.rahulchaube contains runtime/ and packages/", () => {
  const installDir = join(homedir(), ".rahulchaube");
  const binDir = join(installDir, "bin");
  const runtimeDir = join(installDir, "runtime");
  const cliDir = join(installDir, "packages", "rahulchaube-cli");

  expect(existsSync(binDir)).toBe(true);
  expect(existsSync(runtimeDir)).toBe(true);
  expect(existsSync(cliDir)).toBe(true);

  expect(existsSync(join(runtimeDir, "engine", "runner.ts"))).toBe(true);
  expect(existsSync(join(runtimeDir, "package-manager", "installer.ts"))).toBe(true);
  expect(existsSync(join(cliDir, "src", "commands", "install.ts"))).toBe(true);
});

test("Installer Script: install.ps1 route downloads release archive", () => {
  const routeContent = readFileSync("website/app/install.ps1/route.ts", "utf-8");
  expect(routeContent).toContain("github.com/Rahulchaube1/rahulchaube-runtime/releases/download");
  expect(routeContent).toContain("Expand-Archive");
});
