import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function blyx(args: string[]): number {
  const filename = process.platform === "win32" ? "blyxc.exe" : "blyxc";
  const bundled = fileURLToPath(new URL("../../bin/" + filename, import.meta.url));
  const compiler = process.env.BLYXC || (existsSync(bundled) ? bundled : "blyxc");
  const result = spawnSync(compiler, args.length ? args : ["--help"], { stdio: "inherit" });
  if (result.error) console.error(`Could not start ${compiler}: ${result.error.message}`);
  return result.status ?? 1;
}

export function blyxFile(command: "run" | "build", args: string[], flags: Record<string, unknown>): number {
  for (const key of Object.keys(flags)) {
    if (key === "no-color" || key === "debug" || (command === "build" && key === "outfile")) continue;
    console.error(`[ERR] Unsupported Blyx ${command} option: --${key}`);
    return 1;
  }
  if (command === "run") return blyx(["native-run", args[0], "--", ...args.slice(1)]);
  if (args.length !== 1) {
    console.error("[ERR] A Blyx build takes one entry file.");
    return 1;
  }
  return blyx(["build", args[0], ...(typeof flags.outfile === "string" && flags.outfile ? ["-o", flags.outfile] : [])]);
}
