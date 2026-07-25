/**
 * Version bump helper for RahulChaube Runtime releases.
 * Usage: rahulchaube run scripts/version.ts --minor
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..", "..");
const arg = process.argv[2] ?? "patch";
const pkgPath = join(root, "packages", "rahulchaube-cli", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string };

const [major, minor, patch] = pkg.version.split(".").map(Number);
const next =
  arg === "major" ? `${major + 1}.0.0`
  : arg === "minor" ? `${major}.${minor + 1}.0`
  : `${major}.${minor}.${patch + 1}`;

pkg.version = next;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`[version] RahulChaube Runtime -> v${next}`);
