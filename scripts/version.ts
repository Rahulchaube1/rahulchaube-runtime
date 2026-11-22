/**
 * Version bump helper for RahulChaube Runtime releases.
 * Usage: rahulchaube run scripts/version.ts --minor
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const arg = process.argv[2]?.replace(/^--/, "") ?? "patch";
if (!["major", "minor", "patch"].includes(arg)) throw new Error("Expected --major, --minor, or --patch");
const [major, minor, patch] = readFileSync(join(root, "native/VERSION"), "utf8").trim().split(".").map(Number);
const next =
  arg === "major" ? `${major + 1}.0.0`
  : arg === "minor" ? `${major}.${minor + 1}.0`
  : `${major}.${minor}.${patch + 1}`;

writeFileSync(join(root, "native/VERSION"), next + "\n");
console.log(`[version] RahulChaube Runtime -> v${next}`);
