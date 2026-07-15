/**
 * RahulChaube Runtime project configuration.
 * Reads `rahulchaube.json` / `rahulchaube.toml` from the project root.
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface RCConfig {
  telemetry?: boolean;
  autoInstall?: boolean;
  registry?: string;
  cacheDir?: string;
  concurrency?: number;
  plugins?: string[];
  theme?: "default" | "light" | "minimal";
  [k: string]: unknown;
}

const DEFAULTS: RCConfig = {
  telemetry: false,
  autoInstall: true,
  concurrency: Math.max(4, Math.min(32, (globalThis as any).navigator?.hardwareConcurrency ?? 8)),
  theme: "default",
};

export function configPath(root = process.cwd()): string | null {
  for (const name of ["rahulchaube.json", "rahulchaube.toml"]) {
    const p = join(root, name);
    if (existsSync(p)) return p;
  }
  return null;
}

export function readConfig(root = process.cwd()): RCConfig {
  const p = configPath(root);
  if (!p) return { ...DEFAULTS };
  try {
    const raw = readFileSync(p, "utf8");
    if (p.endsWith(".toml")) {
      const cfg: Record<string, unknown> = {};
      for (const line of raw.split("\n")) {
        const m = line.match(/^([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
        if (m) cfg[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
      }
      return { ...DEFAULTS, ...(cfg as unknown as RCConfig) };
    }
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function writeConfig(root: string, cfg: RCConfig): void {
  writeFileSync(join(root, "rahulchaube.json"), JSON.stringify(cfg, null, 2) + "\n");
}
