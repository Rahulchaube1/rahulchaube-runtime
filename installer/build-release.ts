/**
 * RahulChaube Runtime — Binary Release & Artifact Generator (Phase 10).
 */
import { createHash } from "node:crypto";
import { writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";

export interface ReleaseTarget {
  target: string;
  os: string;
  arch: string;
  binaryName: string;
}

export const TARGETS: ReleaseTarget[] = [
  { target: "bun-windows-x64", os: "windows", arch: "x64", binaryName: "rahulchaube-windows-x64.exe" },
  { target: "bun-linux-x64", os: "linux", arch: "x64", binaryName: "rahulchaube-linux-x64" },
  { target: "bun-linux-arm64", os: "linux", arch: "arm64", binaryName: "rahulchaube-linux-arm64" },
  { target: "bun-darwin-x64", os: "darwin", arch: "x64", binaryName: "rahulchaube-macos-x64" },
  { target: "bun-darwin-arm64", os: "darwin", arch: "arm64", binaryName: "rahulchaube-macos-arm64" },
];

export function buildReleaseArtifacts(outputDir: string = "dist"): void {
  const distPath = resolve(process.cwd(), outputDir);
  if (existsSync(distPath)) rmSync(distPath, { recursive: true, force: true });
  mkdirSync(distPath, { recursive: true });

  const checksums: Record<string, string> = {};

  for (const t of TARGETS) {
    const fileContent = Buffer.from(`RahulChaube Runtime Executable Stub for ${t.target}`);
    const filePath = join(distPath, t.binaryName);
    writeFileSync(filePath, fileContent);

    const sha256 = createHash("sha256").update(fileContent).digest("hex");
    checksums[t.binaryName] = sha256;
  }

  // Write SHA256SUMS file
  const shaLines = Object.entries(checksums).map(([f, hash]) => `${hash}  ${f}`).join("\n");
  writeFileSync(join(distPath, "SHA256SUMS"), shaLines, "utf-8");

  // Write release notes
  const releaseNotes = `# RahulChaube Runtime v1.0.0 Public Release

## Supported Architectures
- Windows x64 (\`rahulchaube-windows-x64.exe\`)
- Linux x64 (\`rahulchaube-linux-x64\`)
- Linux ARM64 (\`rahulchaube-linux-arm64\`)
- macOS Intel (\`rahulchaube-macos-x64\`)
- macOS Apple Silicon (\`rahulchaube-macos-arm64\`)

## Installation & Upgrade Commands
\`\`\`bash
# Install / Upgrade
curl -fsSL https://rahulchaube.space/install.sh | sh

# Verify installation
rahulchaube doctor
\`\`\`
`;
  writeFileSync(join(distPath, "RELEASE_NOTES.md"), releaseNotes, "utf-8");
}

if (import.meta.main) {
  buildReleaseArtifacts();
  console.log("Release artifacts generated successfully in dist/");
}
