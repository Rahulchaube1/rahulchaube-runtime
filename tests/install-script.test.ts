import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";

test("Installer: route.ts downloads clean release archives without local repo paths", () => {
  const routeContent = readFileSync("website/app/install.ps1/route.ts", "utf-8");
  expect(routeContent).toContain("github.com/Rahulchaube1/rahulchaube-runtime/releases/download");
  expect(routeContent).not.toContain("$PWD");
  expect(routeContent).not.toContain("Copy-Item");
});

test("Installer: install.ps1 downloads clean release archives without local repo paths", () => {
  const psContent = readFileSync("installer/install.ps1", "utf-8");
  expect(psContent).toContain("github.com/Rahulchaube1/rahulchaube-runtime/releases/download");
  expect(psContent).not.toContain("$PWD");
  expect(psContent).not.toContain("Copy-Item");
});
