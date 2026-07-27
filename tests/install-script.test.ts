import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";

test("Installer: route.ts contains correct split PackagesDir and CliDir without embedded CR/LF", () => {
  const routeContent = readFileSync("website/app/install.ps1/route.ts", "utf-8");
  expect(routeContent).toContain('$PackagesDir = Join-Path $InstallDir "packages"');
  expect(routeContent).toContain('$CliDir = Join-Path $PackagesDir "rahulchaube-cli"');
  expect(routeContent).not.toContain('Join-Path $InstallDir "packages\nrahulchaube-cli"');
  expect(routeContent).not.toContain('Join-Path $InstallDir "packages\rahulchaube-cli"');
});

test("Installer: install.ps1 contains correct split PackagesDir and CliDir without embedded CR/LF", () => {
  const psContent = readFileSync("installer/install.ps1", "utf-8");
  expect(psContent).toContain('$PackagesDir = Join-Path $InstallDir "packages"');
  expect(psContent).toContain('$CliDir = Join-Path $PackagesDir "rahulchaube-cli"');
  expect(psContent).not.toContain('Join-Path $InstallDir "packages\rahulchaube-cli"');
});
