/**
 * RahulChaube Runtime — Lockfile Generator & Parser (`rahulchaube.lock`).
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Manages creation, parsing, and serialization of `rahulchaube.lock` lockfile.
 *   Ensures deterministic dependency installation across environments.
 * ─────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface LockfileEntry {
  version: string;
  resolved: string;
  integrity?: string;
  dependencies?: Record<string, string>;
}

export interface Lockfile {
  lockfileVersion: number;
  generator: string;
  packages: Record<string, LockfileEntry>;
}

export class LockfileManager {
  public static readonly LOCKFILE_NAME = "rahulchaube.lock";

  public static create(packages: Record<string, LockfileEntry>): Lockfile {
    return {
      lockfileVersion: 1,
      generator: "rahulchaube-runtime/1.0.0",
      packages,
    };
  }

  public static write(dir: string, lockfile: Lockfile): string {
    const lockPath = resolve(dir, LockfileManager.LOCKFILE_NAME);
    const content = JSON.stringify(lockfile, null, 2);
    writeFileSync(lockPath, content, "utf-8");
    return lockPath;
  }

  public static read(dir: string): Lockfile | null {
    const lockPath = resolve(dir, LockfileManager.LOCKFILE_NAME);
    if (!existsSync(lockPath)) return null;
    try {
      const raw = readFileSync(lockPath, "utf-8");
      return JSON.parse(raw) as Lockfile;
    } catch {
      return null;
    }
  }
}
