/**
 * Create a release tag for RahulChaube Runtime.
 * Usage: rahulchaube run scripts/release.ts
 *
 * Reads the CLI version and prints/creates a git tag. In CI this is followed by
 * the release workflow which builds artifacts and publishes checksums.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const root = join(import.meta.dir, "..", "..");
const pkg = JSON.parse(
  readFileSync(join(root, "packages", "rahulchaube-cli", "package.json"), "utf8"),
) as { version: string };

const tag = `v${pkg.version}`;
try {
  execSync(`git tag ${tag}`, { cwd: root, stdio: "inherit" });
  console.log(`◆ Tagged ${tag}. Push with: git push origin ${tag}`);
} catch {
  console.log(`◆ Tag ${tag} already exists or git unavailable.`);
}
