// Exercise the exact published VSIX in an isolated VS Code extension host.
const { downloadAndUnzipVSCode, runTests } = require("@vscode/test-electron");
const { execFileSync } = require("node:child_process");
const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");

async function main() {
  const root = resolve(__dirname, "../../..");
  const dir = mkdtempSync(join(tmpdir(), "rc-vscode-"));
  try {
    const workspace = join(dir, "project with spaces");
    mkdirSync(workspace);
    mkdirSync(join(workspace, ".vscode"));
    const binary = resolve(root, "packages/rahulchaube-cli/bin/rahulchaube-native" + (process.platform === "win32" ? ".exe" : ""));
    const platform = { linux: "linux", darwin: "osx", win32: "windows" }[process.platform];
    writeFileSync(join(workspace, ".vscode/settings.json"), JSON.stringify({
      "rcRuntime.executablePath": binary,
      ["terminal.integrated.env." + platform]: { PATH: process.env.PATH },
    }));
    const vsix = join(root, "website/public/extensions/rahulchaube-runtime-" + require("../package.json").version + ".vsix");
    if (process.platform === "win32") {
      execFileSync(join(process.env.SystemRoot, "System32", "tar.exe"), ["-xf", vsix, "-C", dir]);
    } else {
      execFileSync("/usr/bin/unzip", ["-q", vsix, "-d", dir]);
    }
    const code = await downloadAndUnzipVSCode({ version: "1.105.1", cachePath: process.env.RC_VSCODE_CACHE || join(tmpdir(), "rc-vscode-cache") });
    await runTests({
      vscodeExecutablePath: code, extensionDevelopmentPath: join(dir, "extension"),
      extensionTestsPath: join(__dirname, "suite.cjs"),
      launchArgs: [workspace, "--user-data-dir=" + join(dir, "profile"), "--extensions-dir=" + join(dir, "extensions"),
        "--disable-workspace-trust", "--disable-updates", "--disable-gpu", "--skip-welcome", "--no-sandbox"],
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
