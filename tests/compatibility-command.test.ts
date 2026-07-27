import { test, expect } from "bun:test";
import { compatibilityCommand } from "../packages/rahulchaube-cli/src/commands/compatibility.ts";

test("CLI: compatibility command executes all 12 projects in compatibility/ and returns exit code 0", async () => {
  const exitCode = await compatibilityCommand([], {});
  expect(exitCode).toBe(0);
});
