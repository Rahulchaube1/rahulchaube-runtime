const { access, stat } = require("node:fs/promises");
const { constants } = require("node:fs");
const { homedir } = require("node:os");
const path = require("node:path");

const extensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts"]);
function supportsFile(file) {
  return extensions.has(path.extname(file).toLowerCase());
}

async function executable(file) {
  try {
    await access(file, constants.X_OK);
    return (await stat(file)).isFile();
  } catch { return false; }
}

async function resolveRuntime(configured) {
  const windows = process.platform === "win32";
  if (configured) {
    if (!path.isAbsolute(configured) || (windows && path.extname(configured).toLowerCase() !== ".exe") || !await executable(configured)) {
      throw new Error("Check the absolute executable path in the RC Runtime settings.");
    }
    return configured;
  }
  const installDir = process.env.RAHULCHAUBE_INSTALL_DIR || path.join(homedir(), ".rahulchaube");
  const dirs = (process.env.PATH || "").split(path.delimiter).filter(dir => path.isAbsolute(dir));
  const candidates = dirs.map(dir => path.join(dir, windows ? "rahulchaube.exe" : "rahulchaube"));
  if (windows) {
    // Windows installations expose a .cmd shim on PATH. Launch its native sibling directly.
    for (const dir of dirs) {
      if (await executable(path.join(dir, "rahulchaube.cmd"))) {
        candidates.push(path.join(dir, "../packages/rahulchaube-cli/bin/rahulchaube-native.exe"));
      }
    }
  }
  candidates.push(path.join(installDir, "packages/rahulchaube-cli/bin", windows ? "rahulchaube-native.exe" : "rahulchaube-native"));
  for (const file of candidates) {
    if (await executable(file)) return file;
  }
  throw new Error("Install RahulChaube Runtime 1.2.0 or later, or set RC Runtime: Executable Path.");
}

module.exports = { resolveRuntime, supportsFile };
