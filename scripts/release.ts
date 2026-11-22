/**
 * Create a release tag for RahulChaube Runtime.
 * Usage: rahulchaube run scripts/release.ts
 *
 * Reads the CLI version and prints/creates a git tag. In CI this is followed by
 * the release workflow which builds artifacts and publishes checksums.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = join(import.meta.dir, "..");
const tag = "v" + readFileSync(join(root, "native/VERSION"), "utf8").trim();
execFileSync("git", ["tag", tag], { cwd: root, stdio: "inherit" });
console.log(`[release] Tagged ${tag}. Push with: git push origin ${tag}`);
