/**
 * Filesystem helpers for reading project metadata and lockfiles.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  workspaces?: string[] | { packages: string[] };
  [k: string]: unknown;
}

export function readPackageJson(dir: string = process.cwd()): PackageJson | null {
  const p = join(dir, "package.json");
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8")) as PackageJson;
  } catch {
    return null;
  }
}

export function findProjectRoot(start: string = process.cwd()): string {
  let dir = start;
  while (true) {
    if (existsSync(join(dir, "package.json"))) return dir;
    const parent = join(dir, "..");
    if (parent === dir) return start;
    dir = parent;
  }
}

/**
 * Lightweight lockfile model. Only the parts we need for graph/why/outdated.
 */
export interface LockfilePkg {
  name: string;
  version: string;
  resolved?: string;
  integrity?: string;
  dependencies?: Record<string, string>;
}

export function readBunLock(dir: string): { packages: Record<string, LockfilePkg> } {
  const p = join(dir, "bun.lock");
  if (!existsSync(p)) return { packages: {} };
  try {
    const raw = readFileSync(p, "utf8");
    // bun.lock is a TOML file; we only need package metadata lines.
    const packages: Record<string, LockfilePkg> = {};
    const re = /^"?(?:([^"]+)@)?([^"]+)@([^"]+)"?\s*=\s*\["([^"]*)"(?:,\s*"([^"]*)")?/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw))) {
      const name = m[1] || m[2];
      const version = m[3];
      const resolved = m[4];
      const integrity = m[5];
      packages[`${name}@${version}`] = { name, version, resolved, integrity };
    }
    return { packages };
  } catch {
    return { packages: {} };
  }
}

export function allDeps(pkg: PackageJson): Record<string, { range: string; type: string }> {
  const out: Record<string, { range: string; type: string }> = {};
  const add = (deps: Record<string, string> | undefined, type: string) => {
    if (!deps) return;
    for (const [k, v] of Object.entries(deps)) out[k] = { range: v, type };
  };
  add(pkg.dependencies, "dependency");
  add(pkg.devDependencies, "devDependency");
  add(pkg.peerDependencies, "peerDependency");
  add(pkg.optionalDependencies, "optionalDependency");
  return out;
}

export function listWorkspaces(root: string): string[] {
  const pkg = readPackageJson(root);
  if (!pkg?.workspaces) return [];
  const ws = Array.isArray(pkg.workspaces)
    ? pkg.workspaces
    : pkg.workspaces.packages ?? [];
  const out: string[] = [];
  for (const pattern of ws) {
    const base = join(root, pattern);
    if (existsSync(base) && statSync(base).isDirectory()) out.push(base);
  }
  return out;
}

export function walkDir(dir: string, pred: (p: string) => boolean, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    try {
      const st = statSync(full);
      if (st.isDirectory()) walkDir(full, pred, out);
      else if (pred(full)) out.push(full);
    } catch {
      /* ignore */
    }
  }
  return out;
}
