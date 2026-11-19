/**
 * Delegation to the underlying runtime engine. RahulChaube Runtime is a fork
 * of the Bun project (MIT licensed); engine operations are forwarded to the
 * bundled `bun` binary while output is rebranded for the RahulChaube identity.
 */

import { spawnSync } from "node:child_process";
import { join } from "node:path";

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

export function engineName(): string {
  return process.env.RAHULCHAUBE_ENGINE || "bun";
}

/**
 * Run the engine with the given args, inheriting the terminal by default.
 */
export function runEngine(args: string[], opts: { inherit?: boolean; cwd?: string } = {}): RunResult {
  const inherit = opts.inherit ?? true;
  const proc = spawnSync(engineName(), args, {
    cwd: opts.cwd,
    stdio: inherit ? "inherit" : "pipe",
    env: {
      ...process.env,
      RAHULCHAUBE_BRAND_ACTIVE: "1",
    },
  });
  if (proc.error) {
    const message = `Could not start ${engineName()}: ${proc.error.message}`;
    if (inherit) console.error(message);
    return { code: 1, stdout: "", stderr: message };
  }
  if (inherit) {
    return { code: proc.status ?? 1, stdout: "", stderr: "" };
  }
  return {
    code: proc.status ?? 1,
    stdout: proc.stdout?.toString() ?? "",
    stderr: proc.stderr?.toString() ?? "",
  };
}

/**
 * Resolve the path to the engine binary. Falls back to PATH lookup.
 */
export function enginePath(): string {
  const r = spawnSync(process.env.SHELL ?? "sh", ["-lc", `command -v ${engineName()}`], {
    encoding: "utf8",
  });
  return (r.stdout ?? "").trim() || engineName();
}
