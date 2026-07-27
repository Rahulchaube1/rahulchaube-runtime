import { test, expect } from "bun:test";
import { GET } from "../website/app/install.ps1/route.ts";

test("Installer Verification: GET() route returns release download script without local paths", async () => {
  const response = GET();
  const text = await response.text();

  expect(text).toContain("https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download");
  expect(text).toContain("Expand-Archive");
  expect(text).toContain("Get-FileHash");
  expect(text).not.toContain("$PWD");
  expect(text).not.toContain("Copy-Item");
});
