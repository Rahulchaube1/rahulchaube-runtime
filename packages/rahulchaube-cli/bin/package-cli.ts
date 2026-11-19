#!/usr/bin/env -S bun run
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const filename = process.platform === "win32" ? "rahulchaube-native.exe" : "rahulchaube-native";
const native = fileURLToPath(new URL(filename, import.meta.url));
if (existsSync(native)) {
  const result = spawnSync(native, process.argv.slice(2), { stdio: "inherit" });
  if (result.error) console.error(result.error.message);
  if (result.signal) process.kill(process.pid, result.signal);
  process.exitCode = result.status ?? 1;
} else {
  await import("./rahulchaube.ts");
}
