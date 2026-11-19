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
  const found = await Promise.all([...new Set(dirs)].map(async dir => {
    const command = path.join(dir, windows ? "rahulchaube.exe" : "rahulchaube");
    if (await executable(command)) return command;
    // Windows installations expose a .cmd shim on PATH. Run its native sibling directly.
    if (windows && await executable(path.join(dir, "rahulchaube.cmd"))) {
      const native = path.join(dir, "../packages/rahulchaube-cli/bin/rahulchaube-native.exe");
      if (await executable(native)) return native;
    }
  }));
  const command = found.find(Boolean);
  if (command) return command;
  const fallback = path.join(installDir, "packages/rahulchaube-cli/bin", windows ? "rahulchaube-native.exe" : "rahulchaube-native");
  if (await executable(fallback)) return fallback;
  throw new Error("Install RahulChaube Runtime 1.2.0 or later, or set RC Runtime: Executable Path.");
}

module.exports = { resolveRuntime, supportsFile };
