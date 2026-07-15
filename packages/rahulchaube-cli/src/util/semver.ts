/**
 * Minimal semver utilities for dependency analysis (outdated, why, dedupe).
 */

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  pre?: string;
}

export function parseSemver(v: string): SemVer | null {
  const m = v.replace(/^[^\d]*/, "").match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] };
}

export function compareSemver(a: string, b: string): number {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) return 0;
  if (pa.major !== pb.major) return pa.major - pb.major;
  if (pa.minor !== pb.minor) return pa.minor - pb.minor;
  if (pa.patch !== pb.patch) return pa.patch - pb.patch;
  return 0;
}

export function satisfies(range: string, version: string): boolean {
  const v = parseSemver(version);
  if (!v) return false;
  if (range === "*" || range === "latest" || range === "") return true;
  if (range.startsWith("^")) {
    const base = parseSemver(range.slice(1));
    if (!base) return false;
    if (v.major !== base.major) return false;
    return compareSemver(version, range.slice(1)) >= 0;
  }
  if (range.startsWith("~")) {
    const base = parseSemver(range.slice(1));
    if (!base) return false;
    if (v.major !== base.major || v.minor !== base.minor) return false;
    return compareSemver(version, range.slice(1)) >= 0;
  }
  const eq = parseSemver(range);
  if (!eq) return false;
  return compareSemver(version, range) === 0;
}

export function bumpType(current: string, latest: string): "major" | "minor" | "patch" | "none" {
  const a = parseSemver(current);
  const b = parseSemver(latest);
  if (!a || !b) return "none";
  if (b.major > a.major) return "major";
  if (b.minor > a.minor) return "minor";
  if (b.patch > a.patch) return "patch";
  return "none";
}
