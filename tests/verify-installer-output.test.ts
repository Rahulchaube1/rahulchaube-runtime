import { test, expect } from "bun:test";
import { GET } from "../website/app/install.ps1/route.ts";

test("Installer Verification: GET() route returns correct lines without embedded CR/LF", async () => {
  const response = GET();
  const text = await response.text();

  console.log("=== VERIFIED INSTALL.PS1 ROUTE OUTPUT ===");
  console.log(text);

  expect(text).toContain('$PackagesDir = Join-Path $InstallDir "packages"');
  expect(text).toContain('$CliDir = Join-Path $PackagesDir "rahulchaube-cli"');
  expect(text).toContain('$RuntimeDir = Join-Path $InstallDir "runtime"');
  expect(text).toContain('Copy-Item -Path "$candidateRuntime\\*" -Destination $RuntimeDir');
  expect(text).not.toContain("packages\nrahulchaube-cli");
  expect(text).not.toContain("packages\r\nahulchaube-cli");
});
