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
  const installDir = process.env.RC_INSTALL_DIR || path.join(homedir(), ".rc-runtime");
  const dirs = (process.env.PATH || "").split(path.delimiter).filter(dir => path.isAbsolute(dir));
  dirs.push(path.join(installDir, "bin"));
  for (const dir of new Set(dirs)) {
    const file = path.join(dir, windows ? "rc.exe" : "rc");
    if (await executable(file)) return file;
  }
  throw new Error("Install RC Runtime 1.4 or newer, or set RC Runtime: Executable Path.");
}

module.exports = { resolveRuntime, supportsFile };
